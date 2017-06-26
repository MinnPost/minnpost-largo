<?php
/**
 * Create custom fields
 *
 * Currently this uses the Carbon Fields plugin
 *
 * @link https://github.com/htmlburger/carbon-fields
 *
 * @package MinnPost Largo
 */


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