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
			}
			if ( is_singular( 'post' ) ) {
				$query->set( 'post_status', array( 'publish', 'draft', 'future' ) );
			}
		}
		return $query;

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
			if ( is_category() ) {
				$category_id = $query->get_queried_object_id();
				$figure      = minnpost_get_term_figure( $category_id );
				if ( '' === get_term_meta( $category_id, '_mp_category_body', true ) || '' === $figure ) {
					$featured_num = 3;
				} else {
					$featured_num = 1;
				}
			} elseif ( is_author() ) {
				$featured_num = 3;
			} else {
				$featured_num = 0;
			}
			$query->set( 'featured_num', $featured_num );
			if ( isset( $category_id ) ) {
				$featured_columns = get_term_meta( $category_id, '_mp_category_featured_columns', true );
			} else {
				$featured_columns = '';
			}
			$query->set( 'featured_columns', $featured_columns );
			if ( is_category() ) {
				if ( '' !== $featured_columns ) {
					$query->set( 'posts_per_page', 10 + $featured_num );
				} else {
					$query->set( 'posts_per_page', 20 );
				}
			}
		}
		return $query;
	}
endif;

// add_filter( 'coauthors_plus_should_query_post_author', '__return_false' );

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
