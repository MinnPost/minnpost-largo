<?php
/**
 * Create custom wp queries
 *
 *
 * @package MinnPost Largo
 */

if ( ! function_exists( 'custom_archive_query_vars' ) ) :
	add_action( 'pre_get_posts', 'custom_archive_query_vars' );
	function custom_archive_query_vars( $query ) {
		if ( $query->is_archive() && ! is_admin() && $query->is_main_query() ) {
			if ( is_category() ) {
				$category_id = $query->get_queried_object_id();
				$figure = minnpost_get_term_figure( $category_id );
				if ( '' === get_term_meta( $category_id, '_mp_category_body', true ) || '' === $figure ) {
					$featured_num = 3;
				} else {
					$featured_num = 1;
				}
			} elseif ( is_author() ) {
				$featured_num = 3;
			}
			$query->set( 'featured_num', $featured_num );
			$featured_columns = get_term_meta( $category_id, '_mp_category_featured_columns', true );
			$query->set( 'featured_columns', $featured_columns );
			if ( '' !== $featured_columns ) {
				$query->set( 'posts_per_page', 10 + $featured_num );
			} else {
				$query->set( 'posts_per_page', 20 );
			}
		}
		return $query;
	}
endif;
