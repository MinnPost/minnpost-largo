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
		// indexable types. this list below is current as of 2/18/22.
		// use $public_types = get_post_types( array( 'public' => true ), 'names' );
		// to get more types that are available to be indexed.
		/*$types = array(
			'post'                => 'post',
			'page'                => 'page',
			'thank_you_gift'      => 'thank_you_gift',
			'partner'             => 'partner',
			'partner_offer'       => 'partner_offer',
			'message'             => 'message',
			'guest-author'        => 'guest-author',
			'cr3ativsponsor'      => 'cr3ativsponsor',
			'wp_log'              => 'wp_log',
			'vip-legacy-redirect' => 'vip-legacy-redirect',
			'tribe_events'        => 'tribe_events',
			'tribe_ext_speaker'   => 'tribe_ext_speaker',
			'newsletter'          => 'newsletter',
			'festival'            => 'festival',
			'tonight'             => 'tonight',
			'saswp_reviews'       => 'saswp_reviews',
			'saswp-collections'   => 'saswp-collections',
		);*/
		$deny_list = array(
			'wp_log',
			'vip-legacy-redirect',
			'newsletter',
			'saswp_reviews',
			'saswp-collections',
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
		// for site message queries
		//error_log( 'post type is ' . $post->post_type );
		if ( is_object( $post ) && 'message' === $post->post_type ) {
			$allow['_wp_inserted_message_region']               = true;
			$allow['_wp_inserted_message_conditional_operator'] = true;
			$allow['_wp_inserted_message_conditional']          = true;
			$allow['_wp_inserted_message_conditional_value']    = true;
			$allow['_wp_inserted_message_conditional_result']   = true;
		}
		return $allow;
	}
endif;

/**
 * Change which taxonomies are indexable by Elasticsearch
 *
 * @see https://docs.wpvip.com/how-tos/vip-search/post-taxonomies/
 * @param array $taxonomy_names the array of allowable taxonomy names
 * @param object $post the current post object
 * @return array $taxonomy_names the array of allowable taxonomy names
 */
if ( ! function_exists( 'minnpost_indexable_taxonomy_names' ) ) :
	//add_filter( 'vip_search_post_taxonomies_allow_list', 'minnpost_indexable_taxonomy_names', 10, 2 );
	function minnpost_indexable_taxonomy_names( $taxonomy_names, $post ) {
		return $taxonomy_names;
	}
endif;

// vip_es_get_related_posts is the method for returning related posts
