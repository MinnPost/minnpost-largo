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
* Change the post query used on category and author archive pages to account for our custom meta fields.
*
* @param object $query
* @return object $query
*/
if ( ! function_exists( 'custom_archive_query_vars' ) ) :
	add_action( 'pre_get_posts', 'custom_archive_query_vars' );
	function custom_archive_query_vars( $query ) {
		// only do stuff on archive templates when it's the main query
		if ( $query->is_archive() && ! is_admin() && $query->is_main_query() ) {
			// for category archives
			if ( is_category() ) {
				$category_id = $query->get_queried_object_id();
				if ( function_exists( 'minnpost_get_grouped_categories' ) ) {

					// term meta field where a category stores its parent
					$grouping_field = '_mp_category_group';
					// get the children of a parent category
					$grouped_categories = minnpost_get_grouped_categories( $category_id );
					// get the parent id of a child category
					$grouping_category_id = get_term_meta( $category_id, $grouping_field, true );

					// set up an array for changing the query
					$taxonomy_parameters = array();

					// if this category has a parent category id
					// this means it's a child category like metro
					if ( '' !== $grouping_category_id ) {
						// get the children of the other parent categories that aren't this one
						// this is an array of IDs to exclude
						$exclude_ids = minnpost_get_grouping_categories_to_exclude( $grouping_category_id );
					}

					// if this category has child categories
					// this means it's a parent, like news
					if ( ! empty( $grouped_categories ) ) {
						// get the children of the other parent categories that aren't this one
						// this is an array of IDs to exclude
						$exclude_ids    = minnpost_get_grouping_categories_to_exclude( $category_id );
						$category_ids   = $grouped_categories;
						$category_ids[] = $category_id; // in case posts are added to the parent

						// if this is a parent category, the query should not be limited to itself
						$query->set( 'category_name', false );

						// these are the category IDs of the childrten to include in the query
						$taxonomy_parameters[] = array(
							'taxonomy' => 'category',
							'field'    => 'term_id',
							'terms'    => $category_ids,
						);
					}

					// exclude IDs is a cached array for each category ID.
					// see minnpost_get_grouping_categories_to_exclude()

					// if we have category IDs to exclude, exclude them from the query
					if ( ! empty( $exclude_ids ) && is_array( $exclude_ids ) ) {
						/*$taxonomy_parameters[] = array(
							'taxonomy' => 'category',
							'field'    => 'term_id',
							'terms'    => $exclude_ids,
							'operator' => 'NOT IN',
						);*/
						// this value is serialized, so I think we have to loop through the IDs
						$meta_parameters['relation'] = 'AND';
						foreach ( $exclude_ids as $id ) {
							$meta_parameters[] = array(
								'key'     => '_category_permalink',
								'value'   => $id,
								'compare' => 'NOT LIKE',
							);
						}
					}

					// if there is a taxonomy query, use it
					if ( ! empty( $taxonomy_parameters ) ) {
						$query->set( 'tax_query', $taxonomy_parameters );
					}

					// if there is a meta query, use it
					if ( ! empty( $meta_parameters ) ) {
						$query->set( 'meta_query', $meta_parameters );
					}
				}
			} elseif ( is_author() ) {
				// for author archives
				// author archives should not get byline posts
				$query->set(
					'meta_query',
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

/**
* Returns array of grouped categories for the given category.
* This means the categories that are children of a parent category.
* Ex: all the categories that are "news" categories.
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
* Returns the grouping category for the given category.
* This means the parent category.
* Ex: returns the "news" category for the "metro" category.
*
* @param int $category_id
* @return array $grouping_category
*
*/
if ( ! function_exists( 'minnpost_get_grouping_category' ) ) :
	function minnpost_get_grouping_category( $category_id = '' ) {
		$grouping_field       = '_mp_category_group';
		$grouping_category_id = get_term_meta( $category_id, $grouping_field, true );
		$grouping_category    = get_term_by( 'id', $grouping_category_id );
		return $grouping_category;
	}
endif;

/**
* Returns the grouping category IDs to skip
* This means the parent categories to skip based on the current category's parent
* Ex: returns the "opinion" and "arts & culture" and "health" categories for the "metro" category.
*
* @param int $category_id
* @return array $exclude_ids
*
*/
if ( ! function_exists( 'minnpost_get_grouping_categories_to_exclude' ) ) :
	function minnpost_get_grouping_categories_to_exclude( $category_id = '' ) {
		if ( '' === $category_id ) {
			return array();
		}
		$cache_key   = md5( 'minnpost_largo_grouping_categories_exclude_' . $category_id );
		$cache_group = 'minnpost';
		$exclude_ids = wp_cache_get( $cache_key, $cache_group );
		if ( false === $exclude_ids ) {
			$exclude_ids = array();
			if ( function_exists( 'minnpost_largo_category_groups' ) ) {
				$choices = minnpost_largo_category_groups();
				foreach ( $choices as $choice ) {
					$category = minnpost_largo_group_category( $choice );
					if ( (int) $category_id !== (int) $category->term_id ) {
						$exclude_ids[] = array_values( minnpost_get_grouped_categories( $category->term_id ) );
					}
				}
			}
			$exclude_ids = array_merge( ... array_values( $exclude_ids ) );
			wp_cache_set( $cache_key, $exclude_ids, $cache_group, DAY_IN_SECONDS * 1 );
		}
		return $exclude_ids;
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
