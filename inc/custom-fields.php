<?php
/**
 * Create custom fields for standard and custom content types.
 * Currently this uses the CMB2 plugin
 * @link https://github.com/WebDevStudios/CMB2
 *
 * @package MinnPost Largo
 */

// cmb2_init is the hook that works on rest api; cmb2_admin_init does not; there doesn't seem to be any difference in how often the hooks run though

/**
* Newsletter fields
* Even though this is a custom type, it does not currently depend on any plugins aside from CMB2
*
*/
if ( function_exists( 'create_newsletter' ) ) :
	// speed up the post loading for newsletters a little
	if ( is_admin() ) {
		add_action( 'load-post-new.php', 'check_current_screen' );
		add_action( 'load-post.php', 'check_current_screen' );
	}
	function check_current_screen() {
		$screen = get_current_screen();
		$type   = $screen->post_type;
		if ( 'newsletter' === $type ) {
			add_action( 'pre_get_posts', 'newsletter_pre_get_posts' );
		}
	}
	function newsletter_pre_get_posts( WP_Query $wp_query ) {
		if ( in_array( $wp_query->get( 'post_type' ), array( 'post' ) ) ) {
			$wp_query->set( 'update_post_meta_cache', false );
		}
	}

	/**
	* CMB2 custom fields for newsletters
	*
	* @param array $conditionals
	* @return array $conditionals
	*/
	add_action( 'cmb2_init', 'cmb2_newsletter_fields' );
	function cmb2_newsletter_fields() {

		$object_type = 'newsletter';
		$prefix      = '_mp_newsletter_';

		/**
		 * Fields above body
		 */
		$newsletter_setup = new_cmb2_box( array(
			'id'           => $prefix . 'setup',
			'title'        => 'Setup',
			'object_types' => array( $object_type ),
			//'context'    => 'after_title',
			//'priority'   => 'high',
		) );
		$newsletter_setup->add_field( array(
			'name'    => 'Newsletter Type',
			'id'      => $prefix . 'type',
			'type'    => 'select',
			'desc'    => 'Select an option',
			'default' => 'daily',
			'options' => array(
				'daily'         => __( 'Daily', 'minnpost-largo' ),
				'greater_mn'    => __( 'Greater MN', 'minnpost-largo' ),
				'sunday_review' => __( 'Sunday Review', 'minnpost-largo' ),
				'dc_memo'       => __( 'D.C. Memo', 'minnpost-largo' ),
			),
		) );
		$newsletter_setup->add_field( array(
			'name' => 'Preview Text',
			'id'   => $prefix . 'preview_text',
			'type' => 'text',
			'desc' => 'This is visible before users open the email in some email clients. If there\'s no value, we won\'t use it. Limited to 50 characters.',
		) );
		$newsletter_setup->add_field( array(
			'name' => 'Show Department for Top Stories?',
			'id'   => $prefix . 'show_department_for_top_stories',
			'type' => 'checkbox',
			'desc' => '',
		) );

		/**
		 * For posts on newsletters
		 */
		$recent_newsletter_args = array(
			'posts_per_page' => 1,
			'numberposts'    => 1,
			'orderby'        => 'modified',
			'order'          => 'DESC',
			'post_type'      => $object_type,
			'post_status'    => 'publish',
		);
		$most_recent_newsletter = wp_get_recent_posts( $recent_newsletter_args, OBJECT );
		if ( is_object( $most_recent_newsletter[0] ) ) {
			$most_recent_newsletter_modified = $most_recent_newsletter[0]->post_modified;
		} else {
			$most_recent_newsletter_modified = strtotime( time() );
		}
		$newsletter_post_args = array(
			'posts_per_page' => -1,
			'post_type'      => 'post',
			'orderby'        => 'modified',
			'order'          => 'DESC',
			'date_query'     => array(
				array(
					'column' => 'post_modified',
					'after'  => $most_recent_newsletter_modified,
				),
			),
		);
		$newsletter_top_posts = new_cmb2_box( array(
			'id'           => $prefix . 'top_posts',
			'title'        => __( 'Top Stories', 'minnpost-largo' ),
			'object_types' => array( $object_type ), // Post type
			'context'      => 'normal',
			'priority'     => 'high',
			'show_names'   => false, // Show field names on the left
		) );
		$newsletter_top_posts->add_field( array(
			'name'                           => __( 'Top Stories', 'minnpost-largo' ),
			'desc'                           => __( 'Drag posts from the left column to the right column to attach them to this page.<br />You may rearrange the order of the posts in the right column by dragging and dropping.', 'minnpost-largo' ),
			'id'                             => $prefix . 'top_posts',
			'type'                           => 'custom_attached_posts',
			'attached_posts_search_query_cb' => 'mp_attached_posts_search',
			'options'                        => array(
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
			'title'        => __( 'More Stories', 'minnpost-largo' ),
			'object_types' => array( $object_type ), // Post type
			'context'      => 'normal',
			'priority'     => 'high',
			'show_names'   => false, // Show field names on the left
		) );
		$newsletter_more_posts->add_field( array(
			'name'                           => __( 'More Stories', 'minnpost-largo' ),
			'desc'                           => __( 'Drag posts from the left column to the right column to attach them to this page.<br />You may rearrange the order of the posts in the right column by dragging and dropping.', 'minnpost-largo' ),
			'id'                             => $prefix . 'more_posts',
			'type'                           => 'custom_attached_posts',
			'attached_posts_search_query_cb' => 'mp_attached_posts_search',
			'options'                        => array(
				'show_thumbnails' => false, // Show thumbnails on the left
				'filter_boxes'    => true, // Show a text box for filtering the results
				'query_args'      => $newsletter_post_args,
			),
		) );
	}
endif;


/**
* Post fields
*
*/

/**
* Remove featured images from theme
* We do this because we use the CMB2 file field for post images, instead of the built in featured image
* This is kind of unfortunate, but it is necessary at least in this design.
*
*/
if ( ! function_exists( 'remove_featured_images_from_child_theme' ) ) :
	add_action( 'after_setup_theme', 'remove_featured_images_from_child_theme', 11 );
	function remove_featured_images_from_child_theme() {
		remove_theme_support( 'post-thumbnails' );
		//add_theme_support( 'post-thumbnails', array( 'post' ) );
	}
endif;

/**
 * Remove the default WordPress excerpt field.
 */
function minnpost_largo_admin_hide_excerpt_field() {
	add_action( 'dbx_post_advanced', '_minnpost_largo_admin_hide_excerpt_field' );
}
add_filter( 'admin_init', 'minnpost_largo_admin_hide_excerpt_field' );
function _minnpost_largo_admin_hide_excerpt_field() {
	$screen = get_current_screen();
	if ( isset( $screen->post_type ) && 'post' === $screen->post_type ) {
		remove_meta_box( 'postexcerpt', null, 'normal' );
	}
}

/**
 * Override the WordPress Excerpt field
 */
add_filter( 'cmb2_override_excerpt_meta_value', 'minnpost_largo_override_excerpt_display', 10, 2 );
function minnpost_largo_override_excerpt_display( $data, $post_id ) {
	return get_post_field( 'post_excerpt', $post_id );
}

/*
 * WP will handle the saving for us, so don't save to meta.
 */
add_filter( 'cmb2_override_excerpt_meta_save', '__return_true' );

/**
* Add custom fields to posts
*
*/
if ( ! function_exists( 'cmb2_post_fields' ) ) :

	add_action( 'cmb2_init', 'cmb2_post_fields' );
	function cmb2_post_fields() {

		$object_type = 'post';

		/**
		 * Excerpt settings
		 */
		$excerpt = new_cmb2_box( array(
			'id'           => 'cmb2_excerpt',
			'title'        => 'Excerpt',
			'object_types' => array( $object_type ), // Post type
			'context'      => 'after_title',
			'show_names'   => false,
		) );
		$excerpt->add_field( array(
			/*
			 * As long as the 'id' matches the name field of the regular WP field,
			 * WP will handle the saving for you.
			 */
			'id'        => 'excerpt',
			'name'      => 'Excerpt',
			'desc'      => '',
			'type'      => 'wysiwyg',
			'escape_cb' => false,
			'options'   => array(
				'media_buttons' => false, // show insert/upload button(s)
				'textarea_rows' => 5,
				'teeny'         => true, // output the minimal editor config used in Press This
			),
		) );

		/**
		 * Subtitle settings
		 */
		$subtitle_settings = new_cmb2_box( array(
			'id'           => 'subtitle_settings',
			'title'        => 'Subtitle Settings',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'high',
			'closed'       => true,
		) );
		$subtitle_settings->add_field( array(
			'name' => 'Byline',
			'id'   => '_mp_subtitle_settings_byline',
			'type' => 'text',
		) );
		$subtitle_settings->add_field( array(
			'name' => 'Deck',
			'id'   => '_mp_subtitle_settings_deck',
			'type' => 'text',
		) );

		/**
		 * Image settings
		 */
		$image_settings = new_cmb2_box( array(
			'id'           => $object_type . '_image_settings',
			'title'        => 'Image Settings',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'high',
			'closed'       => true,
		) );
		$image_settings->add_field( array(
			'name'         => 'Thumbnail Image',
			'desc'         => 'Upload an image or enter an URL.',
			'id'           => '_mp_post_thumbnail_image',
			'type'         => 'file',
			'preview_size' => array( 130, 85 ),
			'options'      => array(
				//'url' => false, // Hide the text input for the url
			),
			'text'         => array(
				//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
			),
			// query_args are passed to wp.media's library query.
			'query_args'   => array(
				'type' => 'image',
			),
		) );
		$image_settings->add_field( array(
			'name'             => 'Homepage Image Size',
			'id'               => '_mp_post_homepage_image_size',
			'type'             => 'select',
			'show_option_none' => true,
			'desc'             => 'Select an option',
			'default'          => 'feature-large',
			'options'          => array(
				'feature-medium' => __( 'Medium', 'minnpost-largo' ),
				'none'           => __( 'Do not display image', 'minnpost-largo' ),
				'feature-large'  => __( 'Large', 'minnpost-largo' ),
			),
		) );
		$image_settings->add_field( array(
			'name'         => 'Main Image',
			'desc'         => 'Upload an image or enter an URL.',
			'id'           => '_mp_post_main_image',
			'type'         => 'file',
			'preview_size' => array( 130, 85 ),
			'options'      => array(
				//'url' => false, // Hide the text input for the url
			),
			'text'         => array(
				//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
			),
			// query_args are passed to wp.media's library query.
			'query_args'   => array(
				'type' => 'image',
			),
		) );

		/**
		 * Display settings
		 */
		$display_settings = new_cmb2_box( array(
			'id'           => $object_type . '_display_settings',
			'title'        => 'Display Settings',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'high',
			'closed'       => true,
		) );
		$display_settings->add_field( array(
			'name' => 'Remove category from display?',
			'id'   => '_mp_remove_category_from_display',
			'type' => 'checkbox',
			'desc' => '',
		) );
		$display_settings->add_field( array(
			'name' => 'Replace category text',
			'id'   => '_mp_replace_category_text',
			'type' => 'text',
			'desc' => 'This text will show in place of the category',
		) );
		$display_settings->add_field( array(
			'name' => 'Remove title from display?',
			'id'   => '_mp_remove_title_from_display',
			'type' => 'checkbox',
			'desc' => '',
		) );
		$display_settings->add_field( array(
			'name' => 'Remove author(s) from display?',
			'id'   => '_mp_remove_author_from_display',
			'type' => 'checkbox',
			'desc' => '',
		) );
		$display_settings->add_field( array(
			'name' => 'Remove deck from display?',
			'id'   => '_mp_remove_deck_from_display',
			'type' => 'checkbox',
			'desc' => '',
		) );
		$display_settings->add_field( array(
			'name' => 'Remove date from display?',
			'id'   => '_mp_remove_date_from_display',
			'type' => 'checkbox',
			'desc' => '',
		) );
		$display_settings->add_field( array(
			'name' => 'Remove newsletter signup from display?',
			'id'   => '_mp_remove_newsletter_signup_from_display',
			'type' => 'checkbox',
			'desc' => '',
		) );
		$display_settings->add_field( array(
			'name'             => 'Share button location',
			'id'               => '_mp_share_display_location',
			'type'             => 'select',
			'show_option_none' => true,
			'desc'             => 'Select an location for the share buttons to display',
			'default'          => 'both',
			'options'          => array(
				'both'   => __( 'Both', 'minnpost-largo' ),
				'top'    => __( 'Top', 'minnpost-largo' ),
				'bottom' => __( 'Bottom', 'minnpost-largo' ),
			),
		) );

		/**
		 * Sidebar settings
		 */
		$sidebar_settings = new_cmb2_box( array(
			'id'           => $object_type . '_sidebar_options',
			'title'        => 'Sidebar Settings',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'low',
		) );
		$sidebar_settings->add_field( array(
			'name' => 'Remove whole right sidebar from this post?',
			'id'   => '_mp_remove_right_sidebar',
			'type' => 'checkbox',
			'desc' => '',
		) );
		$sidebar_settings->add_field( array(
			'name' => 'Sidebar Content Box',
			'desc' => 'Content for a single right sidebar box',
			'id'   => '_mp_post_sidebar',
			'type' => 'wysiwyg',
		) );

		/**
		 * Related content settings
		 */
		$related_settings = new_cmb2_box( array(
			'id'           => $object_type . '_related_content_options',
			'title'        => 'Related Content Settings',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'low',
			'closed'       => true,
		) );
		$related_settings->add_field( array(
			'name' => 'Add related content to this post?',
			'id'   => '_mp_show_related_content',
			'type' => 'checkbox',
			'desc' => '',
		) );
		$related_settings->add_field( array(
			'name'                           => 'Related Content',
			'id'                             => '_mp_related_content',
			'type'                           => 'custom_attached_posts',
			'options'                        => array(
				'show_thumbnails' => false, // Show thumbnails on the left
				'filter_boxes'    => false, // Show a text box for filtering the results
				'query_args'      => array(
					'posts_per_page' => 10,
					'post_type'      => $object_type,
					//'cache_results' => false,
				), // override the get_posts args
			),
			'attached_posts_search_query_cb' => 'mp_attached_posts_search',
			'attributes'                     => array(
				'required'               => false,
				'data-conditional-id'    => '_mp_show_related_content',
				'data-conditional-value' => 'on',
			),
		) );
		$related_settings->add_field( array(
			'name'                           => 'Related Multimedia',
			'id'                             => '_mp_related_multimedia',
			'type'                           => 'custom_attached_posts',
			'options'                        => array(
				'show_thumbnails' => false, // Show thumbnails on the left
				'filter_boxes'    => false, // Show a text box for filtering the results
				'query_args'      => array(
					'posts_per_page' => 10,
					'post_type'      => $object_type,
					//'cache_results' => false,
				), // override the get_posts args
			),
			'attached_posts_search_query_cb' => 'mp_attached_posts_search',
			'attributes'                     => array(
				'required'               => false,
				'data-conditional-id'    => '_mp_show_related_content',
				'data-conditional-value' => 'on',
			),
		) );
		/*$related_settings->add_field( array(
			'name'          => __( 'Related Multimedia', 'minnpost-largo' ),
			'desc'          => '',
			'id'            => '_mp_related_multimedia',
			'type'          => 'post_ajax_search',
			'multiple'      => true,
			'limit'      	=> -1,
			'query_args'	=> array(
				'post_type'			=> array( 'post' ),
				'post_status'		=> array( 'publish', 'pending' ),
				'posts_per_page'    => 5,
			)
		) );*/

		/**
		 * Membership content settings
		 * This depends on the Blocked Content Template plugin, which is called in get_member_levels()
		 */
		$member_content_settings = new_cmb2_box( array(
			'id'           => $object_type . '_member_content_options',
			'title'        => 'Member Content Settings',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'low',
			'closed'       => true,
		) );
		$member_content_settings->add_field( array(
			'name'             => 'Lowest access level',
			'id'               => '_access_level',
			'type'             => 'select',
			'desc'             => 'If this content is restricted, select the lowest level that can access it.',
			'show_option_none' => true,
			'default'          => '',
			'options'          => get_member_levels(),
		) );
		$member_content_settings->add_field( array(
			'name'             => 'MinnPost+ icon style',
			'id'               => '_mp_plus_icon_style',
			'type'             => 'select',
			'desc'             => 'Which MP+ icon to overlay on the thumbnails',
			'show_option_none' => true,
			'default'          => '',
			'options'          => array(
				'mp_plus_blackonwhite'       => __( 'Black on White', 'minnpost-largo' ),
				'mp_plus_whiteonblack'       => __( 'White on Black', 'minnpost-largo' ),
				'mp_plus_whiteonred'         => __( 'White on Red', 'minnpost-largo' ),
				'mp_plus_whiteontransparent' => __( 'White on Transparent', 'minnpost-largo' ),
			),
		) );

	}
endif;

/**
* Use CMB2 filter for searching
*
*/
if ( ! function_exists( 'mp_attached_posts_search' ) ) :
	function mp_attached_posts_search( $query ) {
		$query->query_vars['posts_per_page'] = 10;
		return $query;
	}
endif;

/**
* Add custom fields to pages
*
*/
if ( ! function_exists( 'cmb2_page_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_page_fields' );
	function cmb2_page_fields() {

		$object_type = 'page';

		/**
		 * Page settings
		 */
		$page_settings = new_cmb2_box( array(
			'id'           => 'page_settings',
			'title'        => 'Page Settings',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'low',
			'closed'       => true,
		) );
		$page_settings->add_field( array(
			'name' => 'Pre-title text',
			'id'   => '_mp_replace_category_text',
			'type' => 'text',
			'desc' => 'This text will show above the title',
		) );
		$page_settings->add_field( array(
			'name' => 'Remove title from display?',
			'id'   => '_mp_remove_title_from_display',
			'type' => 'checkbox',
			'desc' => '',
		) );

		$page_sidebar = new_cmb2_box( array(
			'id'           => $object_type . '_sidebar_options',
			'title'        => 'Sidebar Settings',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'low',
			'closed'       => true,
		) );
		$page_sidebar->add_field( array(
			'name' => 'Remove whole right sidebar from this post?',
			'id'   => '_mp_remove_right_sidebar',
			'type' => 'checkbox',
			'desc' => '',
		) );
		$page_sidebar->add_field( array(
			'name' => 'Sidebar Content Box',
			'desc' => 'Content for a single right sidebar box',
			'id'   => '_mp_post_sidebar',
			'type' => 'wysiwyg',
		) );
	}
endif;


/**
* Add custom fields to categories
*
*/
if ( ! function_exists( 'cmb2_category_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_category_fields' );
	function cmb2_category_fields() {

		$object_type = 'term';

		/**
		 * Category settings
		 */
		$category_setup = new_cmb2_box( array(
			'id'               => 'category_properties',
			'title'            => 'Category Settings',
			'object_types'     => array( $object_type ),
			'taxonomies'       => array( 'category' ),
			'new_term_section' => true, // will display in add category section
		) );
		// text fields
		$category_setup->add_field( array(
			'name'    => 'Excerpt',
			'id'      => '_mp_category_excerpt',
			'type'    => 'wysiwyg',
			'options' => array(
				'media_buttons' => false, // show insert/upload button(s)
				'textarea_rows' => 5,
				'teeny'         => true, // output the minimal editor config used in Press This
			),
		) );
		$category_setup->add_field( array(
			'name'    => 'Sponsorship',
			'id'      => '_mp_category_sponsorship',
			'type'    => 'wysiwyg',
			'options' => array(
				'media_buttons' => false, // show insert/upload button(s)
				'textarea_rows' => 5,
				'teeny'         => true, // output the minimal editor config used in Press This
			),
		) );
		// image fields
		$category_setup->add_field( array(
			'name' => 'Category Thumbnail',
			'id'   => '_mp_category_thumbnail_image',
			'type' => 'file',
		) );
		$category_setup->add_field( array(
			'name' => 'Category Main Image',
			'id'   => '_mp_category_main_image',
			'type' => 'file',
		) );
		// main body field
		$category_setup->add_field( array(
			'name'    => 'Body',
			'id'      => '_mp_category_body',
			'type'    => 'wysiwyg',
			'options' => array(
				'media_buttons' => false, // show insert/upload button(s)
				'teeny'         => false, // output the minimal editor config used in Press This
			),
		) );

		// featured columns that appear on categories
		$options = array();
		if ( is_admin() && ( isset( $_GET['taxonomy'] ) && 'category' === sanitize_key( $_GET['taxonomy'] ) && isset( $_GET['tag_ID'] ) ) || isset( $_POST['tag_ID'] ) && 'category' === sanitize_key( $_POST['taxonomy'] ) ) {

			if ( isset( $_GET['tag_ID'] ) ) :
				$category_id = absint( $_GET['tag_ID'] );
			elseif ( isset( $_POST['tag_ID'] ) ) :
				$category_id = absint( $_POST['tag_ID'] );
			endif;
			$categories = get_terms( array(
				'taxonomy'   => 'category',
				'hide_empty' => false,
			) );
			foreach ( $categories as $category ) {
				if ( $category_id !== $category->term_id ) {
					$options[ $category->term_id ] = $category->name;
				}
			}
			$category_setup->add_field( array(
				'name'    => 'Featured Columns',
				'id'      => '_mp_category_featured_columns',
				'type'    => 'multicheck',
				'options' => $options,
			) );

		}
	}

endif;

/**
* Remove the default description from categories
* We do this because we have a whole body field for categories; it is a wysiwyg field
*
*/
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


/**
* Custom Author fields
*
*/

/**
* Remove guest author bio and comments from custom author
* Bio is probably a wysiwyg thing, but I honestly don't remember.
*
*/
if ( ! function_exists( 'remove_author_fields' ) ) :
	add_action( 'add_meta_boxes', 'remove_author_fields', 19 );
	function remove_author_fields() {
		remove_meta_box( 'coauthors-manage-guest-author-bio', 'guest-author', 'normal' );
		remove_meta_box( 'commentstatusdiv', 'guest-author', 'normal' );
		remove_meta_box( 'commentsdiv', 'guest-author', 'normal' );
	}
endif;

/**
* Remove comment support from authors
*
*/
if ( ! function_exists( 'minnpost_remove_author_comments' ) ) :
	add_action( 'init', 'minnpost_remove_author_comments', 100 );
	function minnpost_remove_author_comments() {
		remove_post_type_support( 'guest-author', 'comments' );
		remove_post_type_support( 'guest-author', 'trackbacks' );
	}
endif;

/**
* Add custom fields to authors
*
*/
if ( ! function_exists( 'cmb2_author_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_author_fields', 9 );
	function cmb2_author_fields() {
		$object_type = 'guest-author';
		/**
		 * Author Settings
		 */
		$author_setup = new_cmb2_box( array(
			'id'           => $object_type . '_page_settings',
			'title'        => 'Page Info',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'low',
		) );
		// image
		$author_setup->add_field( array(
			'name' => 'Photo',
			'id'   => '_mp_author_image_id',
			'type' => 'file',
		) );
		// excerpt
		$author_setup->add_field( array(
			'name'    => 'Excerpt',
			'id'      => '_mp_author_excerpt',
			'type'    => 'wysiwyg',
			'options' => array(
				'media_buttons' => false, // show insert/upload button(s)
				'textarea_rows' => 5,
				'teeny'         => true, // output the minimal editor config used in Press This
			),
		) );
		// full bio
		$author_setup->add_field( array(
			'name'    => 'Bio',
			'id'      => '_mp_author_bio',
			'type'    => 'wysiwyg',
			'options' => array(
				'media_buttons' => false, // show insert/upload button(s)
				'textarea_rows' => 5,
				'teeny'         => true, // output the minimal editor config used in Press This
			),
		) );
		$author_setup->add_field( array(
			'name' => 'Staff Member?',
			'id'   => '_staff_member',
			'type' => 'checkbox',
			'desc' => '',
		) );
	}

endif;

/**
* Add fields to users
*
*/
if ( ! function_exists( 'cmb2_user_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_user_fields' );
	function cmb2_user_fields() {

		$object_type = 'user';

		// address fields
		$user_address = new_cmb2_box( array(
			'id'           => $object_type . '_address',
			'title'        => 'Address Info',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'low',
		) );
		$user_address->add_field( array(
			'name' => 'Street Address',
			'id'   => '_street_address',
			'type' => 'text',
			'desc' => '',
		) );
		$user_address->add_field( array(
			'name' => 'City',
			'id'   => '_city',
			'type' => 'text',
			'desc' => '',
		) );
		$user_address->add_field( array(
			'name' => 'State',
			'id'   => '_state',
			'type' => 'text',
			'desc' => '',
		) );
		$user_address->add_field( array(
			'name' => 'Zip Code',
			'id'   => '_zip_code',
			'type' => 'text',
			'desc' => '',
		) );
		$user_address->add_field( array(
			'name' => 'Country',
			'id'   => '_country',
			'type' => 'text',
			'desc' => '',
		) );

		// reading preferences
		$user_preferences = new_cmb2_box( array(
			'id'           => $object_type . '_reading_preferences',
			'title'        => 'Reading Preferences',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'low',
		) );
		$user_preferences->add_field( array(
			'name'    => 'Reading preferences:',
			'desc'    => '',
			'id'      => '_reading_topics',
			'type'    => 'multicheck',
			'options' => array(
				'Arts & Culture'         => 'Arts & Culture',
				'Economy'                => 'Economy',
				'Education'              => 'Education',
				'Environment'            => 'Environment',
				'Greater Minnesota news' => 'Greater Minnesota news',
				'Health'                 => 'Health',
				'MinnPost announcements' => 'MinnPost announcements',
				'Opinion/Commentary'     => 'Opinion/Commentary',
				'Politics & Policy'      => 'Politics & Policy',
				'Sports'                 => 'Sports',
			),
		) );

		// mailchimp newsletter fields
		$user_preferences->add_field( array(
			'name'       => 'Subscribe to these regular newsletters:',
			'desc'       => '',
			'id'         => '_newsletters',
			'type'       => 'multicheck',
			'options_cb' => 'get_mailchimp_newsletter_options',
			'default_cb' => 'get_mailchimp_user_values',
		) );
		$user_preferences->add_field( array(
			'name'       => 'Occasional MinnPost emails:',
			'desc'       => '',
			'id'         => '_occasional_emails',
			'type'       => 'multicheck',
			'options_cb' => 'get_mailchimp_occasional_email_options',
			'default_cb' => 'get_mailchimp_user_values',
		) );

		$user_donation_info = new_cmb2_box( array(
			'id'           => $object_type . '_donation_info',
			'title'        => 'Donation Info',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'low',
		) );
		$user_donation_info->add_field( array(
			'name' => 'Stripe Customer ID',
			'desc' => '',
			'id'   => '_stripe_customer_id',
			'type' => 'text',
		) );
		$user_donation_info->add_field( array(
			'name' => 'Annual Recurring Amount',
			'desc' => '',
			'id'   => '_annual_recurring_amount',
			'type' => 'text',
		) );
		$user_donation_info->add_field( array(
			'name' => 'Coming Year Contributions',
			'desc' => '',
			'id'   => '_coming_year_contributions',
			'type' => 'text',
		) );
		$user_donation_info->add_field( array(
			'name' => 'Prior Year Contributions',
			'desc' => '',
			'id'   => '_prior_year_contributions',
			'type' => 'text',
		) );
		$user_donation_info->add_field( array(
			'name' => 'Sustaining Member',
			'id'   => '_sustaining_member',
			'type' => 'checkbox',
			'desc' => '',
		) );
		$user_donation_info->add_field( array(
			'name' => 'Next Partner Claim Date',
			'id'   => '_next_partner_claim_date',
			'type' => 'text_date',
			'desc' => '',
		) );
		$user_donation_info->add_field( array(
			'name' => 'Last Partner Claim Date',
			'id'   => '_last_partner_claim_date',
			'type' => 'text_date',
			'desc' => '',
		) );
		$user_donation_info->add_field( array(
			'name' => 'Exclude from current campaign',
			'id'   => '_exclude_from_current_campaign',
			'type' => 'checkbox',
			'desc' => '',
		) );

	}
endif;

/**
* Get member levels so we can assign them to content access
* This depends on the MinnPost Membership plugin
*
* @param array $field_args
* @param array $field
* @param bool $reset
*
* @return array $values
*/
if ( ! function_exists( 'get_member_levels' ) ) :
	function get_member_levels( $field_args = array(), $field = array(), $reset = false ) {
		$values = array();
		if ( ! class_exists( 'MinnPost_Membership' ) ) {
			$file = TEMPLATEPATH . 'plugins/minnpost-membership/minnpost-membership.php';
			if ( file_exists( $file ) ) {
				require_once( $file );
			} else {
				return array();
			}
		}
		$minnpost_membership = MinnPost_Membership::get_instance();
		$member_values       = $minnpost_membership->member_levels->get_member_levels();
		foreach ( $member_values as $key => $value ) {
			$values[ $key + 1 ] = $value['name'];
		}
		return $values;
	}
endif;

/**
* Get user's current values for the MailChimp settings on user profiles.
* This determines what their subscription status is before they do anything on the website, and keeps it updated if they change their settings elsewhere.
* This depends on the MinnPost Form Processor for MailChimp, and the Form Processor for MailChimp, plugins.
*
* @param array $field_args
* @param array $field
* @param bool $reset
*
* @return array $values
*/
if ( ! function_exists( 'get_mailchimp_user_values' ) ) :
	function get_mailchimp_user_values( $field_args = array(), $field = array(), $reset = false ) {
		// figure out if we have a current user and use their settings as the default selections
		// problem: if the user has a setting for this field, this default callback won't be called
		// solution: we just never save this field. the mailchimp plugin's cache settings help keep from overloading the api
		if ( ! class_exists( 'Minnpost_Form_Processor_MailChimp' ) ) {
			require_once( TEMPLATEPATH . 'plugins/minnpost-form-processor-mailchimp/minnpost-form-processor-mailchimp.php' );
		}
		$minnpost_form_processor = Minnpost_Form_Processor_MailChimp::get_instance();
		$values                  = $minnpost_form_processor->get_mailchimp_user_values( $reset );
		return $values;
	}
endif;

/**
* Get available newsletter options to display on user's profile
* This determines what they can subscribe to.
* This depends on the MinnPost Form Processor for MailChimp, and the Form Processor for MailChimp, plugins.
*
* @param array $field
*
* @return array $options
*/
if ( ! function_exists( 'get_mailchimp_newsletter_options' ) ) :
	function get_mailchimp_newsletter_options( $field = array() ) {
		// mailchimp fields
		if ( ! class_exists( 'Minnpost_Form_Processor_MailChimp' ) ) {
			require_once( TEMPLATEPATH . 'plugins/minnpost-form-processor-mailchimp/minnpost-form-processor-mailchimp.php' );
		}
		$minnpost_form = Minnpost_Form_Processor_MailChimp::get_instance();
		$options       = $minnpost_form->get_mailchimp_field_options( '_newsletters', 'f88ee8cb3b' );
		return $options;
	}
endif;

/**
* Get available "occasional email" options to display on user's profile
* This determines what they can subscribe to.
* This depends on the MinnPost Form Processor for MailChimp, and the Form Processor for MailChimp, plugins.
*
* @param array $field
*
* @return array $options
*/
if ( ! function_exists( 'get_mailchimp_occasional_email_options' ) ) :
	function get_mailchimp_occasional_email_options( $field = array() ) {
		// mailchimp fields
		if ( ! class_exists( 'Minnpost_Form_Processor_MailChimp' ) ) {
			require_once( TEMPLATEPATH . 'plugins/minnpost-form-processor-mailchimp/minnpost-form-processor-mailchimp.php' );
		}
		$minnpost_form = Minnpost_Form_Processor_MailChimp::get_instance();
		$options       = $minnpost_form->get_mailchimp_field_options( '_occasional_emails', '93f0b57b1b' );
		return $options;
	}
endif;

/**
* Add fields to sponsors
* This all depends on the cr3ativ sponsor plugin, which is kind of bad but sufficient.
*
*/
if ( ! function_exists( 'cmb2_sponsor_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_sponsor_fields' );
	function cmb2_sponsor_fields() {

		$object_type = 'cr3ativsponsor';

		$sponsor_info = new_cmb2_box( array(
			'id'           => 'cr3ativsponsor_box',
			'title'        => 'Sponsor Information',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'high',
		) );
		// sponsor company url
		$sponsor_info->add_field( array(
			'name' => 'Company URL',
			'id'   => 'cr3ativ_sponsorurl',
			'type' => 'text',
		) );
		// what to display for the sponsor
		$sponsor_info->add_field( array(
			'name' => 'Display Text',
			'id'   => 'cr3ativ_sponsortext',
			'type' => 'text',
		) );

		/**
		 * Sponsor image settings
		 */
		$sponsor_image = new_cmb2_box( array(
			'id'           => $object_type . '_image_settings',
			'title'        => 'Image Settings',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'high',
		) );
		// thumbnail
		$sponsor_image->add_field( array(
			'name'       => 'Thumbnail Image',
			'desc'       => 'Upload an image or enter an URL.',
			'id'         => '_mp_post_thumbnail_image',
			'type'       => 'file',
			'options'    => array(
				//'url' => false, // Hide the text input for the url
			),
			'text'       => array(
				//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
			),
			// query_args are passed to wp.media's library query.
			'query_args' => array(
				'type' => 'image',
			),
		) );

	}

	/**
	* Remove comments and trackbacks from the sponsor post because that's absurd
	*
	*/
	add_action( 'init', 'remove_custom_post_comment', 100 );
	function remove_custom_post_comment() {
		remove_post_type_support( 'cr3ativsponsor', 'comments' );
		remove_post_type_support( 'cr3ativsponsor', 'trackbacks' );
	}

	/**
	* Edit the sponsor list display on the admin
	*
	*/
	add_filter( 'manage_edit-cr3ativsponsor_columns', 'minnpost_edit_sponsor_columns' );
	function minnpost_edit_sponsor_columns( $columns ) {
		$columns = array(
			'cb'              => '<input type="checkbox" />',
			'title'           => __( 'Sponsor Name', 'cr3at_sponsor' ),
			'sponsor_website' => __( 'Sponsor Website', 'cr3at_sponsor' ),
			'sponsor_level'   => __( 'Sponsor Level', 'cr3at_sponsor' ),
		);
		return $columns;
	}

endif;

/**
* Add fields to events
* This all depends on the The Events Calendar plugin
*
*/
if ( ! function_exists( 'cmb2_event_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_event_fields' );
	function cmb2_event_fields() {

		$object_type = 'tribe_events';

		/**
		 * Image settings
		 */
		$image_settings = new_cmb2_box( array(
			'id'           => $object_type . '_image_settings',
			'title'        => 'Image Settings',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'high',
		) );
		$image_settings->add_field( array(
			'name'       => 'Thumbnail Image',
			'desc'       => 'Upload an image or enter an URL.',
			'id'         => '_mp_post_thumbnail_image',
			'type'       => 'file',
			'options'    => array(
				//'url' => false, // Hide the text input for the url
			),
			'text'       => array(
				//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
			),
			// query_args are passed to wp.media's library query.
			'query_args' => array(
				'type' => 'image',
			),
		) );
		$image_settings->add_field( array(
			'name'             => 'Homepage Image Size',
			'id'               => '_mp_post_homepage_image_size',
			'type'             => 'select',
			'show_option_none' => true,
			'desc'             => 'Select an option',
			'default'          => 'feature-large',
			'options'          => array(
				'feature-medium' => __( 'Medium', 'minnpost-largo' ),
				'none'           => __( 'Do not display image', 'minnpost-largo' ),
				'feature-large'  => __( 'Large', 'minnpost-largo' ),
			),
		) );
		$image_settings->add_field( array(
			'name'         => 'Main Image',
			'desc'         => 'Upload an image or enter an URL.',
			'id'           => '_mp_post_main_image',
			'type'         => 'file',
			'preview_size' => array( 130, 85 ),
			'options'      => array(
				//'url' => false, // Hide the text input for the url
			),
			'text'         => array(
				//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
			),
			// query_args are passed to wp.media's library query.
			'query_args'   => array(
				'type' => 'image',
			),
		) );

		/**
		 * Sidebar settings
		 */
		$sidebar_settings = new_cmb2_box( array(
			'id'           => $object_type . '_sidebar_options',
			'title'        => 'Sidebar Settings',
			'object_types' => array( $object_type ),
			'context'      => 'normal',
			'priority'     => 'low',
			'closed'       => true,
		) );
		$sidebar_settings->add_field( array(
			'name' => 'Remove whole right sidebar from this post?',
			'id'   => '_mp_remove_right_sidebar',
			'type' => 'checkbox',
			'desc' => '',
		) );
		$sidebar_settings->add_field( array(
			'name' => 'Sidebar Content Box',
			'desc' => 'Content for a single right sidebar box',
			'id'   => '_mp_post_sidebar',
			'type' => 'wysiwyg',
		) );

	}

endif;
