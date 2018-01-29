<?php
/**
 * Custom CSS and JavaScript for this theme
 *
 * @package MinnPost Largo
 */

if ( ! function_exists( 'minnpost_largo_load_custom_scripts' ) ) :
	add_action( 'wp_enqueue_scripts', 'minnpost_largo_load_custom_scripts' );
	function minnpost_largo_load_custom_scripts() {
		wp_enqueue_script( 'modernizr', get_theme_file_uri() . '/assets/js/modernizr-custom.js', array(), '1.0', true );
		wp_enqueue_script( 'minnpost', get_theme_file_uri() . '/assets/js/minnpost.js', array( 'jquery', 'modernizr' ), '1.0', false );
	}
endif;

if ( ! function_exists( 'load_custom_wp_admin_style' ) ) :
	add_action( 'admin_enqueue_scripts', 'load_custom_wp_admin_style' );
	function load_custom_wp_admin_style( $hook ) {
		// Load only on ?page=toplevel_page_zoninator to fix that awful css
		/*if ( 'toplevel_page_zoninator' !== $hook ) {
			return;
		}*/
		wp_enqueue_style( 'custom_wp_admin_css', get_theme_file_uri() . '/admin-style.css' );
	}
endif;

if ( ! function_exists( 'minnpost_largo_remove_scripts' ) && ! function_exists( 'minnpost_largo_remove_styles' ) ) :
	add_action( 'wp_print_scripts', 'minnpost_largo_remove_scripts', 10 );
	function minnpost_largo_remove_scripts() {
		wp_dequeue_script( 'largo-navigation' );
		wp_dequeue_script( 'popular-widget' );
	}
	add_action( 'wp_print_styles', 'minnpost_largo_remove_styles', 10 );
	function minnpost_largo_remove_styles() {
		$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';
		wp_dequeue_style( 'largo-style' );
		wp_dequeue_style( 'media-credit' );
		wp_dequeue_style( 'widgetopts-styles' );
		wp_dequeue_style( 'minnpost-nimbus' );
		wp_dequeue_style( 'minnpost-donation-progress-widget' );
		wp_enqueue_style( 'minnpost-style', get_theme_file_uri() . '/style' . $suffix . '.css', array(), filemtime(get_template_directory() . '/style.min.css'), false );
		wp_dequeue_style( 'popular-widget' );
		wp_dequeue_style( 'creativ_sponsor' );
	}
endif;
