<?php
/**
 * Elasticsearch methods
 *
 * @package MinnPost Largo
 */

/**
 * Change which post types are indexable by Elasticsearch
 *
 * @see https://docs.wpvip.com/how-tos/vip-search/post-types/#h-public-post-types-are-indexed-by-default
 * @param array $types the array of post types
 * @return array $types the array of post types
 */
if ( ! function_exists( 'minnpost_indexable_post_types' ) ) :
	add_filter( 'ep_indexable_post_types', 'minnpost_indexable_post_types', 10, 1 );
	function minnpost_indexable_post_types( $types ) {
		// public types. this list below is current as of 11/19/21.
		// $public_types = get_post_types( array( 'public' => true ), 'names' );
		// error_log( 'public types is ' . print_r( $public_types, true ) );
		$deny_list = array(
			'attachment',
			'thank_you_gift',
			'partner',
			'partner_offer',
			'popup',
			'message',
			'guest-author',
			'cr3ativsponsor',
			'wp_log',
			'vip-legacy-redirect',
			'newsletter',
			'saswp_reviews',
			'saswp-collections',
			'nav_menu_item',
			'msm_sitemap',
			'vip-legacy-redirect',
		);
		// unset the items with values matching the deny list
		$types = array_diff( $types, $deny_list );
		return $types;
	}
endif;