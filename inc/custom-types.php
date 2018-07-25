<?php
/**
 * Create custom content types
 * We do not use a plugin for creating these, but some of the types do, and some other types are created by plugins.
 *
 * @package MinnPost Largo
 */

/**
* Register custom post type 'newsletter'
*
*/
if ( ! function_exists( 'create_newsletter' ) ) :
	add_action( 'init', 'create_newsletter' );
	function create_newsletter() {
		register_post_type(
			'newsletter',
			array(
				'label'        => __( 'Newsletter', 'minnpost-largo' ),
				'labels'       => array(
					'name'               => __( 'Newsletters', 'minnpost-largo' ),
					'singular_name'      => __( 'Newsletter', 'minnpost-largo' ),
					'menu_name'          => __( 'Newsletters', 'minnpost-largo' ),
					'name_admin_bar'     => __( 'Newsletter', 'minnpost-largo' ),
					'add_new'            => __( 'Add New', 'minnpost-largo' ),
					'add_new_item'       => __( 'Add New Newsletter', 'minnpost-largo' ),
					'new_item'           => __( 'New Newsletter', 'minnpost-largo' ),
					'edit_item'          => __( 'Edit Newsletter', 'minnpost-largo' ),
					'view_item'          => __( 'View Newsletter', 'minnpost-largo' ),
					'all_items'          => __( 'All Newsletters', 'minnpost-largo' ),
					'search_items'       => __( 'Search Newsletters', 'minnpost-largo' ),
					'parent_item_colon'  => __( 'Parent Newsletters:', 'minnpost-largo' ),
					'not_found'          => __( 'No newsletters found.', 'minnpost-largo' ),
					'not_found_in_trash' => __( 'No newsletters found in Trash.', 'minnpost-largo' ),
				),
				'show_ui'      => true,
				'public'       => true,
				'hierarchical' => true,
				'supports'     => array(
					'title',
					'editor',
				),
			)
		);
	}
endif;
