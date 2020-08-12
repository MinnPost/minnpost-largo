<?php
/**
 * Sitemap.xml methods
 * Outputs at /wp-sitemap.xml
 *
 * @package MinnPost Largo
 */

/**
* Change post types that are included in the sitemap
*
* @param array $post_types
* @return array $post_types
*
*/
if ( ! function_exists( 'minnpost_largo_sitemap_post_types' ) ) :
	add_filter( 'wp_sitemaps_post_types', 'minnpost_largo_sitemap_post_types' );
	function minnpost_largo_sitemap_post_types( $post_types ) {
		unset( $post_types['thank_you_gift'] );
		unset( $post_types['partner'] );
		unset( $post_types['partner_offer'] );
		unset( $post_types['message'] );
		unset( $post_types['cr3ativsponsor'] ); // this one could probably be added back later if we move the pages to this type instead
		unset( $post_types['newsletter'] );
		return $post_types;
	}
endif;

/**
* Change taxonomies that are included in the sitemap
*
* @param array $taxonomies
* @return array $taxonomies
*
*/
if ( ! function_exists( 'minnpost_largo_sitemap_taxonomies' ) ) :
	add_filter( 'wp_sitemaps_taxonomies', 'minnpost_largo_sitemap_taxonomies' );
	function minnpost_largo_sitemap_taxonomies( $taxonomies ) {
		unset( $taxonomies['wp_log_type'] );
		unset( $taxonomies['post_format'] ); // because these are all legacy, in our case
		unset( $taxonomies['tribe_events_cat'] ); // we don't even use these
		return $taxonomies;
	}
endif;

/**
* Change sitemap providers in the sitemap
*
* @param object $provider
* @param string $name
* @return object $provider
*
*/
if ( ! function_exists( 'minnpost_largo_sitemap_providers' ) ) :
	add_filter( 'wp_sitemaps_add_provider', 'minnpost_largo_sitemap_providers', 10, 2 );
	function minnpost_largo_sitemap_providers( $provider, $name ) {
		if ( 'users' === $name ) {
			return false;
		}
		return $provider;
	}
endif;
