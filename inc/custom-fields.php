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
				'daily' 	    => __( 'Daily', 'cmb2' ),
				'greater_mn'    => __( 'Greater MN', 'cmb2' ),
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
		$most_recent_newsletter_modified = $most_recent_newsletter[0]->post_modified;
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

// add fields to posts
if ( ! function_exists( 'cmb2_post_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_post_fields' );
	function cmb2_post_fields() {

		$object_type = 'post';

		/**
		 * Image settings
		 */
		$post_setup = new_cmb2_box( array(
			'id'            => $object_type . '_image_settings',
			'title'         => 'Image Settings',
			'object_types'  => array( $object_type ),
			'context'       => 'normal',
			'priority'      => 'high',
		) );
		$post_setup->add_field( array(
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
		$post_setup->add_field( array(
			'name'       => 'Homepage Image Size',
			'id'         => '_mp_post_homepage_image_size',
			'type'       => 'select',
			'show_option_none' => true,
			'desc'       => 'Select an option',
			'default'    => 'feature-large',
			'options'           => array(
				'feature-medium' 	    => __( 'Medium', 'cmb2' ),
				'none'    => __( 'Do not display image', 'cmb2' ),
				'feature-large' => __( 'Large', 'cmb2' ),
			),
		) );
		$post_setup->add_field( array(
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
		$post_setup = new_cmb2_box( array(
			'id'            => 'subtitle_settings',
			'title'         => 'Subtitle Settings',
			'object_types'  => array( $object_type ),
			'context'       => 'after_title',
			'priority'      => 'high',
		) );
		$post_setup->add_field( array(
			'name'       => 'Deck',
			'id'         => '_mp_subtitle_settings_deck',
			'type'       => 'text',
		) );
		$post_setup->add_field( array(
			'name'       => 'Byline',
			'id'         => '_mp_subtitle_settings_byline',
			'type'       => 'text',
		) );

	}

	add_image_size( 'post-feature', 190, 9999 );
	add_image_size( 'post-feature-large', 400, 400 );
	add_image_size( 'post-feature-medium', 190, 125, true );
	add_image_size( 'post-newsletter-thumb', 80, 60, true );

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
			foreach( $categories as $category ) {
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
		<?php }
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
