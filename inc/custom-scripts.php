<?php
/**
 * Custom JavaScript for this theme
 *
 * @package MinnPost Largo
 */

function minnpost_largo_load_custom_scripts() {
	wp_enqueue_script( 'minnpost', '/wp-content/themes/minnpost-largo/assets/js/minnpost.js', 'jquery', '1.0', true );
}
add_action( 'wp_enqueue_scripts', 'minnpost_largo_load_custom_scripts' );