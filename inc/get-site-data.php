<?php
/**
 * Site data that can be used in markup or functionality for the theme
 *
 * @package MinnPost Largo
 */

/**
* Easy method to get the current URL
*
* @return string $current_url
*/
if ( ! function_exists( 'get_current_url' ) ) :
	function get_current_url() {
		if ( is_page() || is_single() ) {
			$current_url = wp_get_canonical_url();
		} else {
			global $wp;
			$current_url = home_url( add_query_arg( array(), $wp->request ) );
		}
		return $current_url;
	}
endif;

/**
 * Change get_option( 'home' ) and any functions that rely on it to use
 * the value of the WP_HOME constant.
 *
 */
if ( ! function_exists( 'change_get_option_home' ) ) :
	add_filter( 'pre_option_home', 'change_get_option_home' );
	function change_get_option_home( $option ) {
		if ( defined( 'WP_HOME' ) ) {
			return WP_HOME;
		}
		return false;
	}
endif;
