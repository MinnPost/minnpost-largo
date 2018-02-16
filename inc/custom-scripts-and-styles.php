<?php
/**
 * Custom CSS and JavaScript for this theme
 *
 * @package MinnPost Largo
 */

// all adding/removing of theme's front-end css should go here
if ( ! function_exists( 'minnpost_largo_add_remove_styles' ) ) :
	add_action( 'wp_print_styles', 'minnpost_largo_add_remove_styles', 10 );
	function minnpost_largo_add_remove_styles() {
		// add
		$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';
		wp_enqueue_style( 'minnpost-style', get_theme_file_uri() . '/style' . $suffix . '.css', array(), filemtime( get_theme_file_path() . '/style' . $suffix . '.css' ), false );
		// remove
		wp_dequeue_style( 'largo-style' );
		wp_dequeue_style( 'media-credit' );
		wp_dequeue_style( 'widgetopts-styles' );
		wp_dequeue_style( 'minnpost-nimbus' );
		wp_dequeue_style( 'minnpost-donation-progress-widget' );
		wp_dequeue_style( 'popular-widget' );
		wp_dequeue_style( 'creativ_sponsor' );
	}
endif;

// all adding/removing of theme's front-end scripts should go here
if ( ! function_exists( 'minnpost_largo_add_remove_scripts' ) ) :
	add_action( 'wp_enqueue_scripts', 'minnpost_largo_add_remove_scripts' );
	function minnpost_largo_add_remove_scripts() {
		// add
		$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';
		wp_enqueue_script( 'modernizr', get_theme_file_uri() . '/assets/js/modernizr-custom' . $suffix . '.js', array(), '1.0', true );
		wp_enqueue_script( 'minnpost', get_theme_file_uri() . '/assets/js/minnpost' . $suffix . '.js', array( 'jquery', 'modernizr' ), filemtime( get_theme_file_path() . '/assets/js/minnpost' . $suffix . '.js' ), false );
		// localize
		$params = array(
			'ajaxurl' => admin_url( 'admin-ajax.php' ),
		);
		wp_localize_script( 'minnpost', 'params', $params );
		// remove
		wp_dequeue_script( 'largo-navigation' );
		wp_dequeue_script( 'popular-widget' );
	}
endif;

// all adding/removing of theme's admin scripts should go here
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
