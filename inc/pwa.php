<?php
/**
 * PWA (Progressive Web App) methods.
 * To see the app manifest, go to /wp-json/app/v1/web-manifest
 *
 * @package MinnPost Largo
 */

/**
* Edit the web app manifest
*
* @param array $args
* @return array $args
*
*/
if ( ! function_exists( 'minnpost_largo_web_app_manifest' ) ) :
	add_filter( 'web_app_manifest', 'minnpost_largo_web_app_manifest', 10, 1 );
	function minnpost_largo_web_app_manifest( $args ) {
		$args['description'] = get_option( 'site_blurb', '' );
		return $args;
	}
endif;
