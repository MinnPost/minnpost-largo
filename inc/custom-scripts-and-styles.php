<?php
/**
 * Custom JavaScript for this theme
 *
 * @package MinnPost Largo
 */

if ( ! function_exists( 'minnpost_largo_load_custom_scripts' ) ) :
	add_action( 'wp_enqueue_scripts', 'minnpost_largo_load_custom_scripts' );
	function minnpost_largo_load_custom_scripts() {
		wp_enqueue_script( 'minnpost', '/wp-content/themes/minnpost-largo/assets/js/minnpost.min.js', 'jquery', '1.0', true );
	}
endif;

if ( ! function_exists( 'load_custom_wp_admin_style' ) ) :
	add_action( 'admin_enqueue_scripts', 'load_custom_wp_admin_style' );
	function load_custom_wp_admin_style( $hook ) {
		// Load only on ?page=toplevel_page_zoninator to fix that awful css
		/*if ( 'toplevel_page_zoninator' !== $hook ) {
			return;
		}*/
		wp_enqueue_style( 'custom_wp_admin_css', get_stylesheet_directory_uri() . '/admin-style.css' );
	}
endif;

if ( ! function_exists( 'minnpost_largo_remove_scripts_styles' ) && ! function_exists( 'minnpost_largo_remove_styles' ) ) :
	add_action( 'wp_print_scripts', 'minnpost_largo_remove_scripts', 10 );
	function minnpost_largo_remove_scripts() {
		wp_dequeue_script( 'popular-widget' );
	}
	add_action( 'wp_print_styles', 'minnpost_largo_remove_styles', 10 );
	function minnpost_largo_remove_styles() {
		wp_dequeue_style( 'popular-widget' );
	}
endif;
