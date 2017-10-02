<?php
/**
 * Create custom content types
 *
 *
 * @package MinnPost Largo
 */

// register custom post type 'newsletter'
if ( ! function_exists( 'create_newsletter' ) ) :
	add_action( 'init', 'create_newsletter' );
	function create_newsletter() {
		register_post_type(
			'newsletter',
			array(
				'label' => __( 'Newsletter', 'minnpost-largo' ),
				'labels' => array(
					'name' => __( 'Newsletters', 'minnpost-largo' ),
					'singular_name' => __( 'Newsletter', 'minnpost-largo' ),
					'menu_name' => __( 'Newsletters', 'minnpost-largo' ),
					'name_admin_bar' => __( 'Newsletters', 'minnpost-largo' ),
					'add_new' => __( 'Add New', 'minnpost-largo' ),
					'add_new_item' => __( 'Add New Newsletter', 'minnpost-largo' ),
					'new_item' => __( 'New Newsletter', 'minnpost-largo' ),
					'edit_item' => __( 'Edit Newsletter', 'minnpost-largo' ),
					'view_item' => __( 'View Newsletter', 'minnpost-largo' ),
					'all_items' => __( 'All Newsletters', 'minnpost-largo' ),
					'search_items' => __( 'Search Newsletters', 'minnpost-largo' ),
					'parent_item_colon' => __( 'Parent Newsletters:', 'minnpost-largo' ),
					'not_found' => __( 'No newsletters found.', 'minnpost-largo' ),
					'not_found_in_trash' => __( 'No newsletters found in Trash.', 'minnpost-largo' ),
				),
				'show_ui' => true,
				'public' => true,
				'hierarchical' => true,
				'supports' => array(
					'title',
					'editor',
				),
			)
		);
	}

endif;


// that temporary test item
add_action( 'init', 'cptui_register_my_cpts' );
function cptui_register_my_cpts() {
	$labels = array(
		'name' => __( 'Tests', 'minnpost-largo' ),
		'singular_name' => __( 'Test', 'minnpost-largo' ),
	);
	$args = array(
		'label' => __( 'Tests', 'minnpost-largo' ),
		'labels' => $labels,
		'description' => '',
		'public' => true,
		'publicly_queryable' => true,
		'show_ui' => true,
		'show_in_rest' => false,
		'rest_base' => '',
		'has_archive' => false,
		'show_in_menu' => true,
		'exclude_from_search' => false,
		'capability_type' => 'post',
		'map_meta_cap' => true,
		'hierarchical' => false,
		'rewrite' => array(
			'slug' => 'test',
			'with_front' => true,
		),
		'query_var' => true,
		'supports' => array( 'title', 'editor', 'thumbnail' ),
	);
	register_post_type( 'test', $args );
}
