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
			'thank_you_gift',
			'partner',
			'partner_offer',
			'message',
			'guest-author',
			'cr3ativsponsor',
			'wp_log',
			'vip-legacy-redirect',
			'newsletter',
			'saswp_reviews',
			'saswp-collections',
			'attachment',
			'wp_template',
			'wp_template_part',
			'wp_global_styles',
			'wp_navigation',
			'adstxt',
			'app-adstxt',
			'deleted_event',
			'jp_mem_plan',
			'jp_pay_order',
			'jp_pay_product',
			'msm_sitemap',
			'saswp_rvs_location',
		);
		// unset the items with values matching the deny list
		$types = array_diff( $types, $deny_list );
		return $types;
	}
endif;

/**
 * Change which post meta fields are indexable by Elasticsearch
 *
 * @see https://docs.wpvip.com/how-tos/vip-search/post-meta/#h-post-meta-must-be-indexed-to-be-used-in-queries
 * @param array $allow the array of allowable meta fields
 * @param object $post the current post object
 * @return array $allow the array of allowable meta fields
 */
if ( ! function_exists( 'minnpost_indexable_post_meta' ) ) :
	add_filter( 'vip_search_post_meta_allow_list', 'minnpost_indexable_post_meta', 10, 2 );
	function minnpost_indexable_post_meta( $allow, $post = null ) {
		return $allow;
	}
endif;