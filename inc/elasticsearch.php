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
		/*
		$types = array(
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
		// allow for attachments.
		$types['attachment'] = 'attachment';
		$deny_list           = array(
			'wp_log',
			'vip-legacy-redirect',
			'newsletter',
			'saswp', // schema
			'saswp_reviews', // schema
			'saswp_rvs_location', // schema
			'saswp-collections', // schema
			'jp_mem_plan', // jetpack
			'jp_pay_order', // jetpack
			'jp_pay_product', // jetpack
			'msm_sitemap',
			'deleted_event',
			'adstxt',
			'app-adstxt',
			'wp_template', // for full site editing
			'wp_template_part', // for full site editing
			'wp_global_styles', // for full site editing
			'wp_navigation', // for full site editing
		);
		// unset the items with values matching the deny list
		$types = array_diff( $types, $deny_list );
		return $types;
	}
endif;

/**
 * Change which post statuses are indexable by Elasticsearch
 *
 * @see https://docs.wpvip.com/how-tos/vip-search/enable-for-wp-admin/
 * @param array $statuses statuses that are allowed
 * @return array $statuses statuses that are allowed
 */
if ( ! function_exists( 'minnpost_indexable_post_statuses' ) ) :
	add_filter( 'ep_indexable_post_status', 'minnpost_indexable_post_statuses', 10, 1 );
	function minnpost_indexable_post_statuses( $statuses ) {
		$statuses = array_merge( $statuses, array( 'inherit' ) );
		return $statuses;
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
		// error_log( 'post type is ' . $post->post_type );
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
	// add_filter( 'vip_search_post_taxonomies_allow_list', 'minnpost_indexable_taxonomy_names', 10, 2 );
	function minnpost_indexable_taxonomy_names( $taxonomy_names, $post ) {
		return $taxonomy_names;
	}
endif;

/**
 * Load related posts from Elasticsearch
 *
 * @see https://docs.wpvip.com/how-tos/vip-search/vip-search-features/#related-posts
 * @param int $count how many related stories to load
 * @return array $related_posts the array of post objects
 */
if ( ! function_exists( 'minnpost_largo_get_elasticsearch_results' ) ) :
	add_shortcode( 'elasticsearch-related-posts', 'minnpost_largo_get_elasticsearch_results' );
	function minnpost_largo_get_elasticsearch_results( $count = 3 ) {
		$related_posts = array();
		// Fetches related post IDs if Elasticsearch Related Posts is active
		if ( ( defined( 'VIP_ENABLE_VIP_SEARCH_QUERY_INTEGRATION' ) && true === VIP_ENABLE_VIP_SEARCH_QUERY_INTEGRATION && function_exists( 'vip_es_get_related_posts' ) ) ) {
			$related_posts = vip_es_get_related_posts( get_the_ID(), $count );
		}
		if ( ! empty( $related_posts ) ) {
			return $related_posts;
		} else {
			return;
		}
	}
endif;

/**
 * Filter the related post arguments
 *
 * @param array $args
 * @return array $args
 */
if ( ! function_exists( 'minnpost_largo_elasticpress_related_args' ) ) :
	add_filter( 'ep_find_related_args', 'minnpost_largo_elasticpress_related_args' );
	function minnpost_largo_elasticpress_related_args( $args ) {

		if ( function_exists( 'minnpost_largo_get_excluded_related_terms' ) ) {
			$exclude_term_ids = minnpost_largo_get_excluded_related_terms();
		}

		// settings for include/exclude of the current post category for recommendations.
		// if both are false, it uses the default ElasticPress recommending system.
		// if both are true, it would run the same category only and ignore the not same category flag.
		$same_category_only = true;
		$not_same_category  = false;

		// load the current post's permalink category ID.
		$permalink_category = minnpost_get_permalink_category_id( get_the_ID() );
		if ( in_array( (int) $permalink_category, $exclude_term_ids, true ) ) {
			// if the current category should be excluded, don't recommend stories only from this category.
			$same_category_only = false;
		}

		// get the sponsored post group category; we always want to exclude it.
		$sponsored = get_term_by( 'slug', 'sponsored-content', 'category' );

		// start the WP_Term_Query arguments.
		$term_args = array(
			'taxonomy'   => 'category',
			'fields'     => 'ids',
			'meta_query' => array(
				array(
					'key'   => '_mp_category_group',
					'value' => $sponsored->term_id,
				),
			),
		);

		// this array will be merged in later.
		$if_term_args = array();

		// our default ElasticPress behavior.
		if ( false === $same_category_only && false === $not_same_category ) {
			// get the opinion post group category; we currently exclude it by default
			$opinion      = get_term_by( 'slug', 'opinion', 'category' );
			$if_term_args = array(
				'meta_query' => array(
					'relation' => 'OR',
					array(
						'key'   => '_mp_category_group',
						'value' => $opinion->term_id,
					),
					array(
						'key'   => '_mp_category_group',
						'value' => $sponsored->term_id,
					),
				),
			);
		} elseif ( true === $same_category_only ) {
			// we only want to include the permalink category of the current post, so exclude all others.
			$if_term_args = array(
				'exclude' => $permalink_category,
			);
		} elseif ( true === $not_same_category ) {
			// we want to exclude posts with the permalink category of the current post, in addition to other excludes.
			$exclude_term_ids[] = $permalink_category;
		}

		// merge the WP_Term_Query args from the if statement.
		$term_args = array_merge( $term_args, $if_term_args );

		// generate a WP_Term_Query from the arguments.
		$term_query = new WP_Term_Query( $term_args );
		// merge the exclude IDs array with the WP_Term_Query results.
		$exclude_term_ids = array_merge( $exclude_term_ids, $term_query->terms );
		// make sure exclude ID array is unique.
		$exclude_term_ids = array_unique( $exclude_term_ids );
		sort( $exclude_term_ids );
		// send the list of categories to exclude to the ElasticPress filter.
		$args['category__not_in'] = $exclude_term_ids;

		// post IDs we want to exclude.
		if ( function_exists( 'minnpost_largo_get_excluded_related_posts' ) ) {
			$exclude_post_ids     = minnpost_largo_get_excluded_related_posts();
			$args['post__not_in'] = $exclude_post_ids;
		}

		// date range we want. production only.
		// if ( 'production' === VIP_GO_ENV ) {
		$args['date_query'] = array( 'after' => '2 weeks ago' );
		// }

		return $args;
	}
endif;

/**
 * Ajax elasticsearch on the admin
 *
 * @see https://docs.wpvip.com/how-tos/vip-search/enable-for-wp-admin/
 * @param bool $enable
 * @return bool $enable
 */
if ( ! function_exists( 'minnpost_largo_es_enable_ajax_admin' ) ) :
	add_filter( 'ep_ajax_wp_query_integration', 'minnpost_largo_es_enable_ajax_admin' );
	function minnpost_largo_es_enable_ajax_admin( $enable ) {
		if ( is_admin() ) {
			$enable = true;
		}
		return $enable;
	}
endif;

/**
 * Analyzer filters in Elasticpress
 *
 * @see https://docs.wpvip.com/how-tos/vip-search/search-tokenization/
 * @param array $filters
 * @return array $filters
 */
if ( ! function_exists( 'minnpost_elasticpress_analyzer_filters' ) ) :
	add_filter( 'ep_default_analyzer_filters', 'minnpost_elasticpress_analyzer_filters' );
	function minnpost_elasticpress_analyzer_filters( $filters ) {
		$filters[] = 'asciifolding';
		return $filters;
	}
endif;


if ( ! function_exists( 'minnpost_coauthors_search_authors_get_terms_args' ) ) :
	add_filter( 'coauthors_search_authors_get_terms_args', 'minnpost_coauthors_search_authors_get_terms_args', 10, 1 );
	function minnpost_coauthors_search_authors_get_terms_args( $args ) {
		if ( is_admin() ) {
			$args['es']           = false;
			$args['ep_integrate'] = false;
		}
		return $args;
	}
endif;


/**
 * Language analyzer filters in Elasticpress
 *
 * @see https://docs.wpvip.com/how-tos/vip-search/search-tokenization/
 * @param array $filters
 * @return array $filters
 */
if ( ! function_exists( 'minnpost_elasticpress_analyzer_language' ) ) :
	// add_filter( 'ep_analyzer_language', 'minnpost_elasticpress_analyzer_language', 10, 2 );
	function minnpost_elasticpress_analyzer_language( $language, $context ) {
		// return 'english';
		error_log( 'language is ' . $language );
		return $language;
	}
endif;
