<?php
/**
 * Jetpack methods
 *
 * @package MinnPost Largo
 */

/**
 * Remove share links that are automatically added
 */
if ( ! function_exists( 'jptweak_remove_share' ) ) :
	add_action( 'loop_start', 'jptweak_remove_share' );
	function jptweak_remove_share() {
		remove_filter( 'the_content', 'sharing_display', 19 );
		remove_filter( 'the_excerpt', 'sharing_display', 19 );
		if ( class_exists( 'Jetpack_Likes' ) ) {
			remove_filter( 'the_content', array( Jetpack_Likes::init(), 'post_likes' ), 30, 1 );
		}
	}
endif;

/**
* Remove count from share buttons
*/
add_filter( 'jetpack_sharing_counts', '__return_false' );

/**
* Implode front end CSS added by Jetpack.
*/
add_filter( 'jetpack_implode_frontend_css', '__return_false', 99 );

/**
* Hide the sharing box from edit pages
*/
if ( ! function_exists( 'minnpost_show_sharing_box' ) ) :
	add_filter( 'sharing_meta_box_show', 'minnpost_show_sharing_box' );
	function minnpost_show_sharing_box() {
		return false;
	}
endif;

// remove the open graph tags because we handle them in meta.php
add_filter( 'jetpack_enable_open_graph', '__return_false' );

/**
* Arguments for VIP Go image processing
* documentation at https://vip.wordpress.com/documentation/vip-go/images-on-vip-go/
*
* @param array $args
* @return array $args
*/
if ( ! function_exists( 'minnpost_largo_custom_photon' ) ) :
	add_filter( 'jetpack_photon_pre_args', 'minnpost_largo_custom_photon' );
	function minnpost_largo_custom_photon( $args ) {
		$args['strip'] = 'all';
		return $args;
	}
endif;

/**
* Exclude given classes from lazy images if they're on an image tag
*
* @param array $classes
* @return array $classes
*/
if ( ! function_exists( 'minnpost_largo_exclude_class_from_lazy_load' ) ) :
	add_filter( 'jetpack_lazy_images_blocked_classes', 'minnpost_largo_exclude_class_from_lazy_load', 999, 1 );
	function minnpost_largo_exclude_class_from_lazy_load( $classes ) {
		$classes[] = 'no-lazy';
		return $classes;
	}
endif;

/**
* Allow individual posts to disable Jetpack lazy images
*
* @param bool $enabled
* @return bool $enabled
*/
if ( ! function_exists( 'minnpost_largo_exclude_post_from_lazy_load' ) ) :
	add_filter( 'lazyload_is_enabled', 'minnpost_largo_exclude_post_from_lazy_load' );
	function minnpost_largo_exclude_post_from_lazy_load( $enabled ) {
		global $post;
		if ( isset( $post ) && is_object( $post ) ) {
			$post_id           = $post->ID;
			$prevent_lazy_load = get_post_meta( $post_id, '_mp_prevent_lazyload', true );
			if ( 'on' === $prevent_lazy_load ) {
				return false;
			}
		}
		return $enabled;
	}
endif;

/**
* ES Query arguments for Jetpack
*
* @param array $args The Elasticsearch query args
* @param WP_Query $query The WP_Query object
* @return array The modified array
*/
if ( ! function_exists( 'minnpost_largo_es_query_args' ) ) :
	add_filter( 'jetpack_search_es_query_args', 'minnpost_largo_es_query_args', 10, 2 );
	function minnpost_largo_es_query_args( $args, $query ) {
		if ( is_array( $args ) ) {
			$args['authenticated_request'] = true;
		}
		return $args;
	}
endif;

/**
 * Remove the default Jetpack Related Posts output
 * Because we're going to use WP Query instead
 */
if ( ! function_exists( 'minnpost_largo_jetpack_remove' ) ) :
	add_action( 'wp', 'minnpost_largo_jetpack_remove', 20 );
	function minnpost_largo_jetpack_remove() {
		if ( class_exists( 'Jetpack_RelatedPosts' ) ) {
			$jprp     = Jetpack_RelatedPosts::init();
			$callback = array( $jprp, 'filter_add_target_to_dom' );
			remove_filter( 'the_content', $callback, 40 );
		}
	}
endif;

/**
 * Display the post author after the Related Posts context.
 *
 * @param string $context Context displayed below each related post.
 * @param string $post_id Post ID of the post for which we are retrieving Related Posts.
 *
 * @return string $context Context, including information about the post author.
 */
if ( ! function_exists( 'minnpost_largo_jetpack_remove' ) ) :
	add_filter( 'jetpack_relatedposts_filter_post_context', 'jetpackme_related_authors', 10, 2 );
	function jetpackme_related_authors( $context, $post_id ) {
		$byline = minnpost_get_posted_by( $post_id );
		// Add the author name after the existing context.
		if ( ! empty( $byline ) ) {
			return $context . $byline;
		}
		// Final fallback.
		return $context;
	}
endif;

/**
 * Generate a WP query object for jetpack related posts.
 * These results are displayed by the minnpost_related function in inc/template-tags.php
 *
 * @param int $count
 * @return object $related_query
 */
if ( ! function_exists( 'minnpost_largo_get_jetpack_results' ) ) :
	add_shortcode( 'jetpack-related-posts', 'minnpost_largo_get_jetpack_results' );
	function minnpost_largo_get_jetpack_results( $count = 3 ) {
		$related_posts = array();
		$query         = array();

		// Number of posts to show
		$query['showposts'] = $count;

		// Fetches related post IDs if JetPack Related Posts is active
		// only do this on production because Jetpack doesn't work on stage/dev
		if ( class_exists( 'Jetpack_RelatedPosts' ) && method_exists( 'Jetpack_RelatedPosts', 'init_raw' ) ) :
			$related = Jetpack_RelatedPosts::init_raw()
				->set_query_name( 'minnpost-largo-related-automated' ) // optional, name can be anything
				->get_for_post_id(
					get_the_ID(),
					array( 'size' => $query['showposts'] )
				);
			if ( $related ) :
				foreach ( $related as $result ) :
					$related_posts[] = $result['id'];
				endforeach;
			endif;
		endif;

		// Sets query to related posts, falls back to recent posts
		if ( $related_posts ) {
			$query['post__in'] = $related_posts;
			$query['orderby']  = 'post__in';
			$title             = __( 'Related Posts', 'minnpost-largo' );
			$related_query     = new WP_Query( $query );
			$related_posts     = $related_query->get_posts();
			return $related_posts;
		} else {
			return;
		}
	}
endif;

/**
 * Exclude categories from Jetpack related posts
 *
 * @param array $filters
 * @return array $filters
 */
if ( ! function_exists( 'minnpost_largo_jetpack_exclude_category' ) ) :
	add_filter( 'jetpack_relatedposts_filter_filters', 'minnpost_largo_jetpack_exclude_category' );
	function minnpost_largo_jetpack_exclude_category( $filters ) {

		if ( function_exists( 'minnpost_largo_get_excluded_related_terms' ) ) {
			$exclude_ids = minnpost_largo_get_excluded_related_terms();
		}

		// settings for include/exclude of the current post category for recommendations.
		// if both are false, it uses the default Jetpack recommending system.
		// if both are true, it would run the same category only and ignore the not same category flag.
		$same_category_only = true;
		$not_same_category  = false;

		// load the current post's permalink category ID.
		$permalink_category = minnpost_get_permalink_category_id( get_the_ID() );
		if ( in_array( (int) $permalink_category, $exclude_ids, true ) ) {
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

		// our default Jetpack behavior.
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
			$exclude_ids[] = $permalink_category;
		}

		// merge the WP_Term_Query args from the if statement.
		$term_args = array_merge( $term_args, $if_term_args );

		// generate a WP_Term_Query from the arguments.
		$term_query = new WP_Term_Query( $term_args );
		// merge the exclude IDs array with the WP_Term_Query results.
		$exclude_ids = array_merge( $exclude_ids, $term_query->terms );
		// make sure exclude ID array is unique.
		$exclude_ids = array_unique( $exclude_ids );
		sort( $exclude_ids );
		// send the list of categories to exclude to the Jetpack filter.
		$filters[] = array(
			'not' => array(
				'terms' => array(
					'category.term_id' => $exclude_ids,
				),
			),
		);
		return $filters;
	}
endif;

/**
 * Exclude Daily Coronavirus Updates from Jetpack-generated related posts
 *
 * @param array $exclude_post_ids
 * @param int $post_id
 * @return array $coronavirus_update_ids
 */
if ( ! function_exists( 'minnpost_related_exclude_coronavirus_updates' ) ) :
	add_filter( 'jetpack_relatedposts_filter_exclude_post_ids', 'minnpost_related_exclude_coronavirus_updates' );
	function minnpost_related_exclude_coronavirus_updates( $exclude_post_ids ) {

		if ( function_exists( 'minnpost_largo_get_excluded_related_posts' ) ) {
			$exclude_post_ids = minnpost_largo_get_excluded_related_posts();
		}

		return $exclude_post_ids;
	}
endif;

/**
 * Restrict related posts to a desired date range
 *
 * @param array $date_range
 * @return array $date_range
 */
if ( ! function_exists( 'minnpost_largo_jetpack_related_date_range' ) ) :
	add_filter( 'jetpack_relatedposts_filter_date_range', 'minnpost_largo_jetpack_related_date_range' );
	function minnpost_largo_jetpack_related_date_range( $date_range ) {
		$date_range = array(
			'from' => strtotime( '-1 week' ),
			'to'   => time(),
		);
		return $date_range;
	}
endif;

use Automattic\Jetpack\Sync\Settings;

/**
 * Filter all blocked post types.
 *
 * @param array $args Hook arguments.
 * @return array|false Hook arguments, or false if the post type is a blocked one.
 */
if ( ! function_exists( 'wpvip_filter_blocked_post_types_deleted' ) ) :
	add_filter( 'jetpack_sync_before_enqueue_deleted_post', 'wpvip_filter_blocked_post_types_deleted' );
	function wpvip_filter_blocked_post_types_deleted( $args ) {
		$post = get_post( $args[0] );
		if ( ! is_wp_error( $post ) && ! empty( $post ) ) {
			if ( in_array( $post->post_type, Settings::get_setting( 'post_types_blacklist' ), true ) ) {
				return false;
			}
		}
		return $args;
	}
endif;
