<?php
/**
 * Create custom fields
 *
 * Currently this uses the CMB2 plugin
 *
 * @link https://github.com/WebDevStudios/CMB2
 *
 * @package MinnPost Largo
 */

// cmb2_init is the hook that works on rest api; cmb2_admin_init does not; there doesn't seem to be any difference in how often the hooks run though

/**
 * Newsletter fields
 */

if ( function_exists( 'create_newsletter' ) ) :
	// speed up the post loading for newsletters a little
	if ( is_admin() ) {
		add_action( 'load-post-new.php', 'check_current_screen' );
		add_action( 'load-post.php', 'check_current_screen' );
	}
	function check_current_screen() {
		$screen = get_current_screen();
		$type = $screen->post_type;
		if ( 'newsletter' === $type ) {
			add_action( 'pre_get_posts', 'newsletter_pre_get_posts' );
		}
	}
	function newsletter_pre_get_posts( WP_Query $wp_query ) {
		if ( in_array( $wp_query->get( 'post_type' ), array( 'post' ) ) ) {
			$wp_query->set( 'update_post_meta_cache', false );
		}
	}

	// CMB2 custom fields for newsletters
	add_action( 'cmb2_init', 'cmb2_newsletter_fields' );
	function cmb2_newsletter_fields() {

		$object_type = 'newsletter';
		$prefix = '_mp_newsletter_';

		/**
		 * Fields above body
		 */
		$newsletter_setup = new_cmb2_box( array(
			'id'            => $prefix . 'setup',
			'title'         => 'Setup',
			'object_types'  => array( $object_type ),
			//'context'       => 'after_title',
			//'priority'      => 'high',
		) );
		$newsletter_setup->add_field( array(
			'name'       => 'Newsletter Type',
			'id'         => $prefix . 'type',
			'type'       => 'select',
			'desc'       => 'Select an option',
			'default'    => 'daily',
			'options'           => array(
				'daily' => __( 'Daily', 'cmb2' ),
				'greater_mn' => __( 'Greater MN', 'cmb2' ),
				'sunday_review' => __( 'Sunday Review', 'cmb2' ),
				'dc_memo'    => __( 'D.C. Memo', 'cmb2' ),
			),
		) );
		$newsletter_setup->add_field( array(
			'name'       => 'Preview Text',
			'id'         => $prefix . 'preview_text',
			'type'       => 'text',
			'desc'       => 'This is visible before users open the email in some email clients. If there\'s no value, we won\'t use it. Limited to 50 characters.',
		) );
		$newsletter_setup->add_field( array(
			'name'       => 'Show Department for Top Stories?',
			'id'         => $prefix . 'show_department_for_top_stories',
			'type'       => 'checkbox',
			'desc'       => '',
		) );

		/**
		 * For posts on newsletters
		 */
		$recent_newsletter_args = array(
			'posts_per_page' => 1,
			'numberposts' => 1,
			'orderby' => 'modified',
			'order' => 'DESC',
			'post_type' => $object_type,
			'post_status' => 'publish',
		);
		$most_recent_newsletter = wp_get_recent_posts( $recent_newsletter_args, OBJECT );
		if ( is_object( $most_recent_newsletter[0] ) ) {
			$most_recent_newsletter_modified = $most_recent_newsletter[0]->post_modified;
		} else {
			$most_recent_newsletter_modified = strtotime( time() );
		}
		$newsletter_post_args = array(
			'posts_per_page' => -1,
			'post_type' => 'post',
			'orderby' => 'modified',
			'order' => 'DESC',
			'date_query' => array(
				array(
					'column' => 'post_modified',
					'after'  => $most_recent_newsletter_modified,
				),
			),
		);
		$newsletter_top_posts = new_cmb2_box( array(
			'id'           => $prefix . 'top_posts',
			'title'        => __( 'Top Stories', 'cmb2' ),
			'object_types' => array( $object_type ), // Post type
			'context'      => 'normal',
			'priority'     => 'high',
			'show_names'   => false, // Show field names on the left
		) );
		$newsletter_top_posts->add_field( array(
			'name'    => __( 'Top Stories', 'cmb2' ),
			'desc'    => __( 'Drag posts from the left column to the right column to attach them to this page.<br />You may rearrange the order of the posts in the right column by dragging and dropping.', 'cmb2' ),
			'id'      => $prefix . 'top_posts',
			'type'    => 'custom_attached_posts',
			'options' => array(
				'show_thumbnails' => false, // Show thumbnails on the left
				'filter_boxes'    => true, // Show a text box for filtering the results
				'query_args'      => $newsletter_post_args,
			),
		) );
		$newsletter_top_posts->add_field( array(
			'name' => 'Show Department for Top Stories',
			'desc' => 'If checked, top stories will also display their department name.',
			'id'   => 'top_posts_show_department',
			'type' => 'checkbox',
		) );
		$newsletter_more_posts = new_cmb2_box( array(
			'id'           => $prefix . 'more_posts',
			'title'        => __( 'More Stories', 'cmb2' ),
			'object_types' => array( $object_type ), // Post type
			'context'      => 'normal',
			'priority'     => 'high',
			'show_names'   => false, // Show field names on the left
		) );
		$newsletter_more_posts->add_field( array(
			'name'    => __( 'More Stories', 'cmb2' ),
			'desc'    => __( 'Drag posts from the left column to the right column to attach them to this page.<br />You may rearrange the order of the posts in the right column by dragging and dropping.', 'cmb2' ),
			'id'      => $prefix . 'more_posts',
			'type'    => 'custom_attached_posts',
			'options' => array(
				'show_thumbnails' => false, // Show thumbnails on the left
				'filter_boxes'    => true, // Show a text box for filtering the results
				'query_args'      => $newsletter_post_args,
			),
		) );
	}
endif;


// CMB2 custom fields for posts

// removing fields
if ( ! function_exists( 'remove_featured_images_from_child_theme' ) ) :
	// override the parent theme's support for featured images because we are using cmb2 for that, at least for now
	add_action( 'after_setup_theme', 'remove_featured_images_from_child_theme', 11 );
	function remove_featured_images_from_child_theme() {
		remove_theme_support( 'post-thumbnails' );
		//add_theme_support( 'post-thumbnails', array( 'post' ) );
	}
endif;

if ( ! function_exists( 'show_hidden_meta_boxes' ) ) :
	add_filter( 'default_hidden_meta_boxes', 'show_hidden_meta_boxes', 10, 2 );
	function show_hidden_meta_boxes( $hidden, $screen ) {
		if ( 'post' == $screen->base ) {
			foreach ( $hidden as $key => $value ) {
				if ( 'postexcerpt' == $value ) {
					unset( $hidden[ $key ] );
					break;
				}
			}
		}
		return $hidden;
	}
endif;

// add fields to posts
if ( ! function_exists( 'cmb2_post_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_post_fields' );
	function cmb2_post_fields() {

		$object_type = 'post';

		/**
		 * Image settings
		 */
		$image_settings = new_cmb2_box( array(
			'id'            => $object_type . '_image_settings',
			'title'         => 'Image Settings',
			'object_types'  => array( $object_type ),
			'context'       => 'normal',
			'priority'      => 'high',
		) );
		$image_settings->add_field( array(
			'name'    => 'Thumbnail Image',
			'desc'    => 'Upload an image or enter an URL.',
			'id'      => '_mp_post_thumbnail_image',
			'type'    => 'file',
			'options' => array(
				//'url' => false, // Hide the text input for the url
			),
			'text'    => array(
				//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
			),
			// query_args are passed to wp.media's library query.
			'query_args' => array(
				'type' => 'image',
			),
		) );
		$image_settings->add_field( array(
			'name'       => 'Homepage Image Size',
			'id'         => '_mp_post_homepage_image_size',
			'type'       => 'select',
			'show_option_none' => true,
			'desc'       => 'Select an option',
			'default'    => 'feature-large',
			'options'           => array(
				'feature-medium' => __( 'Medium', 'cmb2' ),
				'none' => __( 'Do not display image', 'cmb2' ),
				'feature-large' => __( 'Large', 'cmb2' ),
			),
		) );
		$image_settings->add_field( array(
			'name'    => 'Main Image',
			'desc'    => 'Upload an image or enter an URL.',
			'id'      => '_mp_post_main_image',
			'type'    => 'file',
			'preview_size' => array( 130, 85 ),
			'options' => array(
				//'url' => false, // Hide the text input for the url
			),
			'text'    => array(
				//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
			),
			// query_args are passed to wp.media's library query.
			'query_args' => array(
				'type' => 'image',
			),
		) );

		/**
		 * Subtitle settings
		 */
		$subtitle_settings = new_cmb2_box( array(
			'id'            => 'subtitle_settings',
			'title'         => 'Subtitle Settings',
			'object_types'  => array( $object_type ),
			'context'       => 'after_title',
			'priority'      => 'high',
		) );
		$subtitle_settings->add_field( array(
			'name'       => 'Deck',
			'id'         => '_mp_subtitle_settings_deck',
			'type'       => 'text',
		) );
		$subtitle_settings->add_field( array(
			'name'       => 'Byline',
			'id'         => '_mp_subtitle_settings_byline',
			'type'       => 'text',
		) );

		/**
		 * Sidebar settings
		 */
		$sidebar_settings = new_cmb2_box( array(
			'id'            => $object_type . '_sidebar_options',
			'title'         => 'Sidebar Options',
			'object_types'  => array( $object_type ),
			'context'       => 'normal',
			'priority'      => 'low',
		) );
		$sidebar_settings->add_field( array(
			'name'       => 'Remove whole right sidebar from this post?',
			'id'         => '_mp_remove_right_sidebar',
			'type'       => 'checkbox',
			'desc'       => '',
		) );
		$sidebar_settings->add_field( array(
			'name'    => 'Sidebar Content Box',
			'desc'    => 'Content for a single right sidebar box',
			'id'      => '_mp_post_sidebar',
			'type'    => 'wysiwyg',
		) );

		/**
		 * Related content settings
		 */
		$related_settings = new_cmb2_box( array(
			'id'            => $object_type . '_related_content_options',
			'title'         => 'Related Content Options',
			'object_types'  => array( $object_type ),
			'context'       => 'normal',
			'priority'      => 'low',
		) );
		$related_settings->add_field( array(
			'name'       => 'Show related content?',
			'id'         => '_mp_show_related_content',
			'type'       => 'checkbox',
			'desc'       => '',
		) );
		$related_settings->add_field( array(
			'name'       => 'Related Content',
			'id'         => '_mp_related_content',
			'type'    => 'custom_attached_posts',
			'options' => array(
				'show_thumbnails' => false, // Show thumbnails on the left
				'filter_boxes'    => true, // Show a text box for filtering the results
				'query_args'      => array(
					'posts_per_page' => 10,
					'post_type'      => 'post',
				), // override the get_posts args
			),
			'attributes' => array(
				'required'            => false,
				'data-conditional-id' => '_mp_show_related_content',
				'data-conditional-value' => 'on',
			),
		) );
		$related_settings->add_field( array(
			'name'       => 'Related Multimedia',
			'id'         => '_mp_related_multimedia',
			'type'    => 'custom_attached_posts',
			'options' => array(
				'show_thumbnails' => false, // Show thumbnails on the left
				'filter_boxes'    => true, // Show a text box for filtering the results
				'query_args'      => array(
					'posts_per_page' => 10,
					'post_type'      => 'post',
				), // override the get_posts args
			),
			'attributes' => array(
				'required'            => false,
				'data-conditional-id' => '_mp_show_related_content',
				'data-conditional-value' => 'on',
			),
		) );

	}

	add_image_size( 'post-feature', 190, 9999 );
	add_image_size( 'post-feature-large', 400, 400 );
	add_image_size( 'post-feature-medium', 190, 125, true );
	add_image_size( 'post-newsletter-thumb', 80, 60, true );

endif;


// add fields to pages
if ( ! function_exists( 'cmb2_page_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_page_fields' );
	function cmb2_page_fields() {

		$object_type = 'page';

		/**
		 * Page settings
		 */
		$page_settings = new_cmb2_box( array(
			'id'            => 'page_settings',
			'title'         => 'Page Settings',
			'object_types'  => array( $object_type ),
			'context'       => 'normal',
			'priority'      => 'low',
		) );
		$page_settings->add_field( array(
			'name'       => 'Remove title from display?',
			'id'         => '_mp_remove_title_from_display',
			'type'       => 'checkbox',
			'desc'       => '',
		) );

		$page_sidebar = new_cmb2_box( array(
			'id'            => $object_type . '_sidebar_options',
			'title'         => 'Sidebar Options',
			'object_types'  => array( $object_type ),
			'context'       => 'normal',
			'priority'      => 'low',
		) );
		$page_sidebar->add_field( array(
			'name'       => 'Remove whole right sidebar from this post?',
			'id'         => '_mp_remove_right_sidebar',
			'type'       => 'checkbox',
			'desc'       => '',
		) );
		$page_sidebar->add_field( array(
			'name'    => 'Sidebar Content Box',
			'desc'    => 'Content for a single right sidebar box',
			'id'      => '_mp_post_sidebar',
			'type'    => 'wysiwyg',
		) );
	}
endif;


// CMB2 custom fields for categories
if ( ! function_exists( 'cmb2_category_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_category_fields' );
	function cmb2_category_fields() {

		$object_type = 'term';

		/**
		 * Subtitle settings
		 */
		$category_setup = new_cmb2_box( array(
			'id'            => 'category_properties',
			'title'         => 'Category Settings',
			'object_types'  => array( $object_type ),
			'taxonomies'    => array( 'category' ),
			'new_term_section' => true, // will display in add category section
		) );
		$category_setup->add_field( array(
			'name'       => 'Excerpt',
			'id'         => '_mp_category_excerpt',
			'type'       => 'wysiwyg',
		) );
		$category_setup->add_field( array(
			'name'       => 'Sponsorship',
			'id'         => '_mp_category_sponsorship',
			'type'       => 'wysiwyg',
		) );
		$category_setup->add_field( array(
			'name'       => 'Category Thumbnail',
			'id'         => '_mp_category_thumbnail_image',
			'type'       => 'file',
		) );
		$category_setup->add_field( array(
			'name'       => 'Category Main Image',
			'id'         => '_mp_category_main_image',
			'type'       => 'file',
		) );
		$category_setup->add_field( array(
			'name'       => 'Body',
			'id'         => '_mp_category_body',
			'type'       => 'wysiwyg',
		) );

		$options = array();
		if ( is_admin() && ( isset( $_GET['taxonomy'] ) && 'category' === sanitize_key( $_GET['taxonomy'] ) && isset( $_GET['tag_ID'] ) ) || isset( $_POST['tag_ID'] ) && 'category' === sanitize_key( $_POST['taxonomy'] ) ) {

			if ( isset( $_GET['tag_ID'] ) ) :
				$category_id = absint( $_GET['tag_ID'] );
			elseif ( isset( $_POST['tag_ID'] ) ) :
				$category_id = absint( $_POST['tag_ID'] );
			endif;
			$categories = get_terms( array(
				'taxonomy' => 'category',
				'hide_empty' => false,
			) );
			foreach ( $categories as $category ) {
				if ( $category_id !== $category->term_id ) {
					$options[ $category->term_id ] = $category->name;
				}
			}
			$category_setup->add_field( array(
				'name'       => 'Featured Columns',
				'id'         => '_mp_category_featured_columns',
				'type'       => 'multicheck',
				'options' => $options,
			) );

		}
	}

	add_image_size( 'category-featured-column', 50, 9999 ); // scale so the width is 50px

endif;

if ( ! function_exists( 'remove_default_category_description' ) ) :
	add_action( 'admin_head', 'remove_default_category_description' );
	function remove_default_category_description() {
		global $current_screen;
		if ( 'edit-category' === $current_screen->id ) { ?>
			<script>
			jQuery(function($) {
				$('textarea#description, textarea#tag-description').closest('tr.form-field, div.form-field').remove();
			});
			</script>
		<?php
		}
	}
endif;


// CMB2 custom fields for custom authors

// remove fields
if ( ! function_exists( 'remove_author_fields' ) ) :
	// override the parent theme's support for featured images because we are using cmb2 for that, at least for now
	add_action( 'add_meta_boxes' , 'remove_author_fields', 19 );
	function remove_author_fields() {
		remove_meta_box( 'coauthors-manage-guest-author-bio' , 'guest-author', 'normal' );
	}
endif;

// add fields to authors
if ( ! function_exists( 'cmb2_author_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_author_fields', 9 );
	function cmb2_author_fields() {
		$object_type = 'guest-author';
		/**
		 * Image Settings
		 */
		$author_setup = new_cmb2_box( array(
			'id'            => $object_type . '_image_settings',
			'title'         => 'Page Info',
			'object_types'  => array( $object_type ),
			'context'       => 'normal',
			'priority'      => 'low',
		) );
		$author_setup->add_field( array(
			'name'       => 'Photo',
			'id'         => '_mp_author_image_id',
			'type'       => 'file',
		) );
		$author_setup->add_field( array(
			'name'       => 'Excerpt',
			'id'         => '_mp_author_excerpt',
			'type'       => 'wysiwyg',
		) );
		$author_setup->add_field( array(
			'name'       => 'Bio',
			'id'         => '_mp_author_bio',
			'type'       => 'wysiwyg',
		) );
	}

	add_image_size( 'author-image', 190, 9999 ); // scale so the width is 190px
	add_image_size( 'author-thumb', 75, 9999 ); // scale so the width is 75px

endif;

// add fields to users
if ( ! function_exists( 'cmb2_user_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_user_fields' );
	function cmb2_user_fields() {

		$object_type = 'user';
		$user_address = new_cmb2_box( array(
			'id'            => $object_type . '_address',
			'title'         => 'Address Info',
			'object_types'  => array( $object_type ),
			'context'       => 'normal',
			'priority'      => 'low',
		) );
		$user_address->add_field( array(
			'name'       => 'Street Address',
			'id'         => '_street_address',
			'type'       => 'text',
			'desc'       => '',
		) );
		$user_address->add_field( array(
			'name'       => 'City',
			'id'         => '_city',
			'type'       => 'text',
			'desc'       => '',
		) );
		$user_address->add_field( array(
			'name'       => 'State',
			'id'         => '_state',
			'type'       => 'text',
			'desc'       => '',
		) );
		$user_address->add_field( array(
			'name'       => 'Zip Code',
			'id'         => '_zip_code',
			'type'       => 'text',
			'desc'       => '',
		) );
		$user_address->add_field( array(
			'name'       => 'Country',
			'id'         => '_country',
			'type'       => 'text',
			'desc'       => '',
		) );

		$user_preferences = new_cmb2_box( array(
			'id'            => $object_type . '_reading_preferences',
			'title'         => 'Reading Preferences',
			'object_types'  => array( $object_type ),
			'context'       => 'normal',
			'priority'      => 'low',
		) );
		$user_preferences->add_field( array(
			'name'    => 'Reading preferences:',
			'desc'    => '',
			'id'      => '_reading_topics',
			'type'    => 'multicheck',
			'options' => array(
				'Arts & Culture' => 'Arts & Culture',
				'Economy' => 'Economy',
				'Education' => 'Education',
				'Environment' => 'Environment',
				'Greater Minnesota news' => 'Greater Minnesota news',
				'Health' => 'Health',
				'MinnPost announcements' => 'MinnPost announcements',
				'Opinion/Commentary' => 'Opinion/Commentary',
				'Politics & Policy' => 'Politics & Policy',
				'Sports' => 'Sports',
			),
		) );

		// mailchimp fields
		$user_preferences->add_field( array(
			'name'    => 'Subscribe to these regular newsletters:',
			'desc'    => '',
			'id'      => '_newsletters',
			'type'    => 'multicheck',
			'options_cb' => 'get_mailchimp_newsletter_options',
			'default_cb' => 'get_mailchimp_user_values',
		) );
		$user_preferences->add_field( array(
			'name'    => 'Occasional MinnPost emails:',
			'desc'    => '',
			'id'      => '_occasional_emails',
			'type'    => 'multicheck',
			'options_cb' => 'get_mailchimp_occasional_email_options',
			'default_cb' => 'get_mailchimp_user_values',
		) );
	}
endif;


if ( ! function_exists( 'get_mailchimp_user_values' ) ) :
	function get_mailchimp_user_values( $field_args = array(), $field = array(), $reset = false ) {
		// figure out if we have a current user and use their settings as the default selections
		// problem: if the user has a setting for this field, this default callback won't be called
		// solution: we just never save this field. the mailchimp plugin's cache settings help keep from overloading the api
		if ( ! class_exists( 'Minnpost_Form_Processor_MailChimp' ) ) {
			require_once( TEMPLATEPATH . 'plugins/minnpost-form-processor-mailchimp/minnpost-form-processor-mailchimp.php' );
		}
		$minnpost_form_processor = Minnpost_Form_Processor_MailChimp::get_instance();
		$values = $minnpost_form_processor->get_mailchimp_user_values( $reset );
		return $values;
	}
endif;

if ( ! function_exists( 'get_mailchimp_newsletter_options' ) ) :
	function get_mailchimp_newsletter_options( $field = array() ) {
		// mailchimp fields
		if ( ! class_exists( 'Minnpost_Form_Processor_MailChimp' ) ) {
			require_once( TEMPLATEPATH . 'plugins/minnpost-form-processor-mailchimp/minnpost-form-processor-mailchimp.php' );
		}
		$minnpost_form = Minnpost_Form_Processor_MailChimp::get_instance();
		$options = $minnpost_form->get_mailchimp_field_options( '_newsletters', 'f88ee8cb3b' );
		return $options;
	}
endif;

if ( ! function_exists( 'get_mailchimp_occasional_email_options' ) ) :
	function get_mailchimp_occasional_email_options( $field = array() ) {
		// mailchimp fields
		if ( ! class_exists( 'Minnpost_Form_Processor_MailChimp' ) ) {
			require_once( TEMPLATEPATH . 'plugins/minnpost-form-processor-mailchimp/minnpost-form-processor-mailchimp.php' );
		}
		$minnpost_form = Minnpost_Form_Processor_MailChimp::get_instance();
		$options = $minnpost_form->get_mailchimp_field_options( '_occasional_emails', '93f0b57b1b' );
		return $options;
	}
endif;

// add fields to sponsors
if ( ! function_exists( 'cmb2_sponsor_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_sponsor_fields' );
	function cmb2_sponsor_fields() {

		$object_type = 'cr3ativsponsor';

		$sponsor_info = new_cmb2_box( array(
			'id'            => 'cr3ativsponsor_box',
			'title'         => 'Sponsor Information',
			'object_types'  => array( $object_type ),
			'context'       => 'normal',
			'priority'      => 'high',
		) );
		$sponsor_info->add_field( array(
			'name'       => 'Company URL',
			'id'         => 'cr3ativ_sponsorurl',
			'type'       => 'text',
		) );
		$sponsor_info->add_field( array(
			'name'       => 'Display Text',
			'id'         => 'cr3ativ_sponsortext',
			'type'       => 'text',
		) );

		/**
		 * Image settings
		 */
		$sponsor_image = new_cmb2_box( array(
			'id'            => $object_type . '_image_settings',
			'title'         => 'Image Settings',
			'object_types'  => array( $object_type ),
			'context'       => 'normal',
			'priority'      => 'high',
		) );
		$sponsor_image->add_field( array(
			'name'    => 'Thumbnail Image',
			'desc'    => 'Upload an image or enter an URL.',
			'id'      => '_mp_post_thumbnail_image',
			'type'    => 'file',
			'options' => array(
				//'url' => false, // Hide the text input for the url
			),
			'text'    => array(
				//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
			),
			// query_args are passed to wp.media's library query.
			'query_args' => array(
				'type' => 'image',
			),
		) );

	}

	add_action( 'init', 'remove_custom_post_comment', 100 );
	function remove_custom_post_comment() {
		remove_post_type_support( 'cr3ativsponsor', 'comments' );
		remove_post_type_support( 'cr3ativsponsor', 'trackbacks' );
	}

	add_filter( 'manage_edit-cr3ativsponsor_columns', 'minnpost_edit_sponsor_columns' );
	function minnpost_edit_sponsor_columns( $columns ) {
		$columns = array(
			'cb' => '<input type="checkbox" />',
			'title' => __( 'Sponsor Name', 'cr3at_sponsor' ),
			'sponsor_website' => __( 'Sponsor Website', 'cr3at_sponsor' ),
			'sponsor_level' => __( 'Sponsor Level' , 'cr3at_sponsor' ),
		);
		return $columns;
	}

endif;

// add fields to events
if ( ! function_exists( 'cmb2_event_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_event_fields' );
	function cmb2_event_fields() {

		$object_type = 'tribe_events';

		/**
		 * Image settings
		 */
		$image_settings = new_cmb2_box( array(
			'id'            => $object_type . '_image_settings',
			'title'         => 'Image Settings',
			'object_types'  => array( $object_type ),
			'context'       => 'normal',
			'priority'      => 'high',
		) );
		$image_settings->add_field( array(
			'name'    => 'Thumbnail Image',
			'desc'    => 'Upload an image or enter an URL.',
			'id'      => '_mp_post_thumbnail_image',
			'type'    => 'file',
			'options' => array(
				//'url' => false, // Hide the text input for the url
			),
			'text'    => array(
				//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
			),
			// query_args are passed to wp.media's library query.
			'query_args' => array(
				'type' => 'image',
			),
		) );
		$image_settings->add_field( array(
			'name'       => 'Homepage Image Size',
			'id'         => '_mp_post_homepage_image_size',
			'type'       => 'select',
			'show_option_none' => true,
			'desc'       => 'Select an option',
			'default'    => 'feature-large',
			'options'           => array(
				'feature-medium' => __( 'Medium', 'cmb2' ),
				'none' => __( 'Do not display image', 'cmb2' ),
				'feature-large' => __( 'Large', 'cmb2' ),
			),
		) );
		$image_settings->add_field( array(
			'name'    => 'Main Image',
			'desc'    => 'Upload an image or enter an URL.',
			'id'      => '_mp_post_main_image',
			'type'    => 'file',
			'preview_size' => array( 130, 85 ),
			'options' => array(
				//'url' => false, // Hide the text input for the url
			),
			'text'    => array(
				//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
			),
			// query_args are passed to wp.media's library query.
			'query_args' => array(
				'type' => 'image',
			),
		) );

		/**
		 * Sidebar settings
		 */
		$sidebar_settings = new_cmb2_box( array(
			'id'            => $object_type . '_sidebar_options',
			'title'         => 'Sidebar Options',
			'object_types'  => array( $object_type ),
			'context'       => 'normal',
			'priority'      => 'low',
		) );
		$sidebar_settings->add_field( array(
			'name'       => 'Remove whole right sidebar from this post?',
			'id'         => '_mp_remove_right_sidebar',
			'type'       => 'checkbox',
			'desc'       => '',
		) );
		$sidebar_settings->add_field( array(
			'name'    => 'Sidebar Content Box',
			'desc'    => 'Content for a single right sidebar box',
			'id'      => '_mp_post_sidebar',
			'type'    => 'wysiwyg',
		) );

	}

endif;
