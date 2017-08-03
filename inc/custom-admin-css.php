<?php
/**
 * Custom admin only css for this theme
 *
 * @package MinnPost Largo
 */

if ( ! function_exists( 'load_custom_wp_admin_style' ) ) :
	function load_custom_wp_admin_style( $hook ) {
		// Load only on ?page=toplevel_page_zoninator to fix that awful css
		/*if ( 'toplevel_page_zoninator' !== $hook ) {
			return;
		}*/
		wp_enqueue_style( 'custom_wp_admin_css', get_stylesheet_directory_uri() . '/admin-style.css' );
	}
	add_action( 'admin_enqueue_scripts', 'load_custom_wp_admin_style' );
endif;
