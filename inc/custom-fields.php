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

/**
 * Newsletter fields
 *
 * @return array
 */


/*function jb_pre_get_posts( WP_Query $wp_query ) {
	if ( in_array( $wp_query->get( 'post_type' ), array( 'newsletter', 'post' ) ) ) {
		$wp_query->set( 'update_post_meta_cache', false );
	}
}

// Only do this for admin
if ( is_admin() ) {
	add_action( 'pre_get_posts', 'jb_pre_get_posts' );
}
*/

add_action( 'cmb2_init', 'cmb2_newsletter_posts' );
function cmb2_newsletter_posts() {

	$recent_newsletter_args = array(
	    'post_type' =>'newsletter',
	    'posts_per_page' => 1
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
		'id'           => '_mp_newsletter_top_posts',
		'title'        => __( 'Top Stories', 'cmb2' ),
		'object_types' => array( 'newsletter' ), // Post type
		'context'      => 'normal',
		'priority'     => 'high',
		'show_names'   => false, // Show field names on the left
	) );
	$newsletter_top_posts->add_field( array(
		'name'    => __( 'Top Stories', 'cmb2' ),
		'desc'    => __( 'Drag posts from the left column to the right column to attach them to this page.<br />You may rearrange the order of the posts in the right column by dragging and dropping.', 'cmb2' ),
		'id'      => '_mp_newsletter_top_posts',
		'type'    => 'custom_attached_posts',
		'options' => array(
			'show_thumbnails' => false, // Show thumbnails on the left
			'filter_boxes'    => true, // Show a text box for filtering the results
			'query_args'      => $newsletter_post_args,
		),
	) );

	$newsletter_more_posts = new_cmb2_box( array(
		'id'           => '_mp_newsletter_more_posts',
		'title'        => __( 'More Stories', 'cmb2' ),
		'object_types' => array( 'newsletter' ), // Post type
		'context'      => 'normal',
		'priority'     => 'high',
		'show_names'   => false, // Show field names on the left
	) );
	$newsletter_more_posts->add_field( array(
		'name'    => __( 'More Stories', 'cmb2' ),
		'desc'    => __( 'Drag posts from the left column to the right column to attach them to this page.<br />You may rearrange the order of the posts in the right column by dragging and dropping.', 'cmb2' ),
		'id'      => '_mp_newsletter_more_posts',
		'type'    => 'custom_attached_posts',
		'options' => array(
			'show_thumbnails' => false, // Show thumbnails on the left
			'filter_boxes'    => true, // Show a text box for filtering the results
			'query_args'      => $newsletter_post_args,
		),
	) );

}








/**
 * Define methods to use
 */
use Carbon_Fields\Container;
use Carbon_Fields\Field;


/**
 * Post properties
 *
 * @uses show_on_post_type()
 * @uses add_fields()
 * @uses Field::make()
 */
Container::make( 'post_meta', 'Image Settings' )->show_on_post_type( 'post' )->add_fields(
	array(
		Field::make( 'select', '_mp_image_settings_homepage_image_size', 'Homepage Image Size' )->add_options(
			array(
		    	'' => '- None -',
		    	'medium' => 'Medium',
		    	'none' => 'Do not display image',
		    	'large' => 'Large',
			)
		)->set_default_value( 'large' ),
	)
);
Container::make( 'post_meta', 'Subtitle Settings' )->show_on_post_type( 'post' )->add_fields(
	array(
		Field::make( 'text', '_mp_subtitle_settings_deck', 'Deck' ),
		Field::make( 'text', '_mp_subtitle_settings_byline', 'Byline' ),
	)
);




/**
 * Category properties
 *
 * @uses show_on_taxonomy()
 * @uses add_fields()
 * @uses Field::make()
 */
Container::make( 'term_meta', 'Category Properties' )->show_on_taxonomy( 'category' )->add_fields(
	array(
		Field::make( 'rich_text', '_mp_category_excerpt', 'Excerpt' ),
		Field::make( 'rich_text', '_mp_category_sponsorship', 'Sponsorship' ),
		Field::make( 'image', '_mp_category_thumbnail_id', 'Category Thumbnail' ),
		Field::make( 'image', '_mp_category_main_image_id', 'Category Main Image' ),
		Field::make( 'rich_text', '_mp_category_body', 'Body' ),
	)
);

if ( ! function_exists( 'remove_default_category_description' ) ) :
	add_action('admin_head', 'remove_default_category_description');
	function remove_default_category_description() {
	    global $current_screen;
	    if ( $current_screen->id == 'edit-category' ) { ?>
			<script>
			jQuery(function($) {
	        	$('textarea#description, textarea#tag-description').closest('tr.form-field, div.form-field').remove();
			});
			</script>
		<?php }
	}
endif;