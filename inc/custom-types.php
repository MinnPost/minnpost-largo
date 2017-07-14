<?php

// register custom post type 'newsletter'
if ( ! function_exists( 'create_newsletter' ) ) :
	add_action( 'init', 'create_newsletter' );
	function create_newsletter() {
	    register_post_type(
			'newsletter',
			array(
				'label' => 'Newsletter',
				'labels' => array(
				'name' => 'Newsletters',
				'singular_name' => 'Newsletter',
			),
			'show_ui' => true,
			'public' => true,
			'supports' => array(
				'title',
				'editor'
			),
	    )
	  );
	}
endif;


// that temporary test item
add_action( 'init', 'cptui_register_my_cpts' );
function cptui_register_my_cpts() {
	$labels = array(
		"name" => __( 'Tests', 'minnpost-largo' ),
		"singular_name" => __( 'Test', 'minnpost-largo' ),
	);
	$args = array(
		"label" => __( 'Tests', 'minnpost-largo' ),
		"labels" => $labels,
		"description" => "",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"show_in_rest" => false,
		"rest_base" => "",
		"has_archive" => false,
		"show_in_menu" => true,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => array( "slug" => "test", "with_front" => true ),
		"query_var" => true,
		"supports" => array( "title", "editor", "thumbnail" ),
	);
	register_post_type( "test", $args );
}
