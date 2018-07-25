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
				'label'               => __( 'Newsletter', 'minnpost-largo' ),
				'labels'              => array(
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
				'show_ui'             => true,
				'public'              => true,
				'exclude_from_search' => true,
				'hierarchical'        => true,
				'supports'            => array(
					'title',
					'editor',
				),
			)
		);
	}
endif;

if ( ! function_exists( 'minnpost_indexable_post_types' ) ) :
	add_filter( 'ep_indexable_post_types', 'minnpost_indexable_post_types' );
	function minnpost_indexable_post_types( $post_types ) {
		/* default value here is:
		$post_types = array(
			'post'           => 'post',
			'page'           => 'page',
			'attachment'     => 'attachment',
			'partner'        => 'partner',
			'partner_offer'  => 'partner_offer',
			'popup'          => 'popup',
			'guest'-author   => 'guest-author',
			'cr3ativsponsor' => 'cr3ativsponsor',
			'wp_log'         => 'wp_log',
			'tribe_events'   => 'tribe_events',
			'newsletter'     => 'newsletter',
		);
		*/
		$non_indexable_types = array(
			'partner_offer' => 'partner_offer',
			'wp_log'        => 'wp_log',
		);
		$post_types          = array_diff_assoc( $post_types, $non_indexable_types );
		return $post_types;
	}
endif;
