<?php
/**
 * Create custom menus
 *
 * @package MinnPost Largo
 */














/**
* Set Zoninator access capabilities
*
*/
if ( ! function_exists( 'minnpost_largo_add_zones' ) ) :
	add_filter( 'zoninator_add_zone_cap', 'minnpost_largo_add_zones', 10, 1 );
	function minnpost_largo_add_zones( $role ) {
		return 'create_zones';
	}
endif;

if ( ! function_exists( 'minnpost_largo_edit_zones' ) ) :
	add_filter( 'zoninator_edit_zone_cap', 'minnpost_largo_edit_zones', 10, 1 );
	function minnpost_largo_edit_zones( $role ) {
		return 'edit_zones';
	}
endif;

if ( ! function_exists( 'minnpost_largo_manage_zones' ) ) :
	add_filter( 'zoninator_manage_zone_cap', 'minnpost_largo_manage_zones', 10, 1 );
	function minnpost_largo_manage_zones( $role ) {
		return 'manage_zones';
	}
endif;

/**
* Add unpublished indicator to admin bar menu
*
*/
if ( ! function_exists( 'minnpost_largo_unpublished_indicator' ) ) :
	add_action( 'admin_bar_menu', 'minnpost_largo_unpublished_indicator', 81 );
	function minnpost_largo_unpublished_indicator( $wp_admin_bar ) {

		if ( ! current_user_can( 'edit_posts' ) || ! is_singular() ) {
			return;
		}

		$user = wp_get_current_user();
		// not for comment moderators
		if ( in_array( 'comment_moderator', (array) $user->roles, true ) ) {
			return;
		}

		$post_id = get_the_ID();

		if ( false === $post_id ) {
			return;
		}

		$post_status = get_post_status( $post_id );

		if ( 'publish' === $post_status ) {
			return;
		}

		$args = array(
			'id'    => 'item_unpublishd',
			'title' => __( 'Unpublished', 'minnpost-largo' ),
			'meta'  => array(
				'class' => 'unpublished-indicator',
			),
		);
		$wp_admin_bar->add_node( $args );
	}
endif;

/**
* Any admin bar CSS customizations should go here so they're consistent on front and back end
*
*/
if ( ! function_exists( 'minnpost_style_tool_bar' ) ) :
	add_action( 'admin_head', 'minnpost_style_tool_bar' );
	add_action( 'wp_head', 'minnpost_style_tool_bar' );
	function minnpost_style_tool_bar() {
		echo '
		<style>
		#wp-admin-bar-item_unpublishd div, #wpadminbar:not(.mobile) #wp-admin-bar-item_unpublishd:hover div {
			text-transform: uppercase;
			background: #b60;
			color: #fff;
		}
	    </style>';
	}
endif;
