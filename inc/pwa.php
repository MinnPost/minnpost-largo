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
 */
if ( ! function_exists( 'minnpost_largo_web_app_manifest' ) ) :
	add_filter( 'web_app_manifest', 'minnpost_largo_web_app_manifest', 10, 1 );
	function minnpost_largo_web_app_manifest( $args ) {
		$args['description'] = get_option( 'site_blurb', '' );
		$args['display']     = 'minimal-ui';
		$args['icons']       = array(
			array(
				'src'   => get_theme_file_uri() . '/assets/img/app-icons/favicon.ico',
				'sizes' => '16x16',
				'type'  => 'image/ico',
			),
			array(
				'src'   => get_theme_file_uri() . '/assets/img/app-icons/icon-72x72.png',
				'sizes' => '72x72',
				'type'  => 'image/png',
			),
			array(
				'src'   => get_theme_file_uri() . '/assets/img/app-icons/icon-96x96.png',
				'sizes' => '96x96',
				'type'  => 'image/png',
			),
			array(
				'src'   => get_theme_file_uri() . '/assets/img/app-icons/icon-128x128.png',
				'sizes' => '128x128',
				'type'  => 'image/png',
			),
			array(
				'src'   => get_theme_file_uri() . '/assets/img/app-icons/icon-144x144.png',
				'sizes' => '144x144',
				'type'  => 'image/png',
			),
			array(
				'src'   => get_theme_file_uri() . '/assets/img/app-icons/icon-152x152.png',
				'sizes' => '152x152',
				'type'  => 'image/png',
			),
			array(
				'src'   => get_theme_file_uri() . '/assets/img/app-icons/icon-192x192.png',
				'sizes' => '192x192',
				'type'  => 'image/png',
			),
			array(
				'src'   => get_theme_file_uri() . '/assets/img/app-icons/icon-384x384.png',
				'sizes' => '384x384',
				'type'  => 'image/png',
			),
			array(
				'src'   => get_theme_file_uri() . '/assets/img/app-icons/icon-512x512.png',
				'sizes' => '512x512',
				'type'  => 'image/png',
			),
		);
		$args['lang']        = 'en-US';
		$args['orientation'] = 'portrait';
		$args['theme_color'] = '#801018';
		return $args;
	}
endif;
