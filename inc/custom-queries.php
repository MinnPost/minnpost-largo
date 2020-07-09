<?php
/**
 * Create custom wp queries
 *
 * @package MinnPost Largo
 *
 */

/*
 * On site home and archives, drafts should be visible to users who can see unpublished posts
 */
if ( ! function_exists( 'minnpost_largo_unpublished_posts' ) ) :
	add_action( 'pre_get_posts', 'minnpost_largo_unpublished_posts' );
	function minnpost_largo_unpublished_posts( $query ) {
		if ( ! is_admin() && current_user_can( 'view_unpublished_posts' ) ) {
			if ( $query->is_main_query() ) {
				$query->set( 'post_status', 'any' );
				if ( isset( $_GET['p'] ) && filter_var( $_GET['p'], FILTER_VALIDATE_INT ) === filter_var( $query->query['p'], FILTER_VALIDATE_INT ) ) {
					$query->set( 'post_status', array( 'publish', 'draft', 'future' ) );
				}
			}
		}
		return $query;

	}
endif;

/**
* Change the post query used on category archive pages based on whether or not it has grouped categories associated with the main category
*
* @param object $query
*/
if ( ! function_exists( 'minnpost_grouped_category_query' ) ) :
	add_action( 'pre_get_posts', 'minnpost_grouped_category_query' );
	function minnpost_grouped_category_query( $query ) {
		if ( $query->is_archive() && ! is_admin() && $query->is_main_query() && is_category() ) {
			$category_id = $query->get_queried_object_id();
			if ( function_exists( 'minnpost_get_grouped_categories' ) ) {
				$grouped_categories = minnpost_get_grouped_categories( $category_id );
				if ( empty( $grouped_categories ) ) {
					return;
				}
				$tax_query = $query->get( 'tax_query' );
				if ( ! is_array( $tax_query ) ) {
					$tax_query = array();
				}
				$taxquery[] = array(
					'taxonomy' => 'category',
					'field'    => 'term_id',
					'terms'    => $grouped_categories,
				);
				$query->set( 'tax_query', $taxquery );
				$query->set( 'category_name', false );
			}
		}
	}
endif;

/**
* Returns array of grouped categories for the given category
*
* @param int $category_id
* @return array $grouped_categories
*
*/
if ( ! function_exists( 'minnpost_get_grouped_categories' ) ) :
	function minnpost_get_grouped_categories( $category_id = '' ) {
		$grouped_categories_args = array(
			'hide_empty' => true, // also retrieve terms which are not used yet
			'fields'     => 'ids',
			'meta_query' => array(
				array(
					'key'     => '_mp_category_group',
					'value'   => $category_id,
					'compare' => '=',
				),
			),
			'taxonomy'   => 'category',
		);
		$grouped_categories      = get_terms( $grouped_categories_args );
		return $grouped_categories;
	}
endif;

/**
* Change the post query used on category archive pages based on whether or not they have featured columns.
* This arranges featured posts and not featured posts on those archives.
*
* @param object $query
*
* @return object $query
*/
if ( ! function_exists( 'custom_archive_query_vars' ) ) :
	add_action( 'pre_get_posts', 'custom_archive_query_vars' );
	function custom_archive_query_vars( $query ) {
		if ( $query->is_archive() && ! is_admin() && $query->is_main_query() ) {
			if ( is_author() ) {
				// author archives should not get byline posts
				$query->set( 'meta_query',
					array(
						array(
							'key'     => '_mp_subtitle_settings_byline',
							'compare' => 'NOT EXISTS',
						),
					),
				);
			}
		}
		return $query;
	}
endif;

// Use simple tax queries for CAP to improve performance
add_filter( 'coauthors_plus_should_query_post_author', '__return_false' );

/**
* Change the post query used for zoninator recent posts and for the search box
*
* @param array $args
* @return array $args
*/
if ( ! function_exists( 'minnpost_zoninator_search_args' ) ) :
	add_filter( 'zoninator_recent_posts_args', 'minnpost_zoninator_search_args' );
	add_filter( 'zoninator_search_args', 'minnpost_zoninator_search_args' );
	function minnpost_zoninator_search_args( $args ) {
		$args['post_status'] = 'publish';
		$args['post_type']   = 'post';
		return $args;
	}
endif;
