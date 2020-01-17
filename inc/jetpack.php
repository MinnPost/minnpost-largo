<?php
/**
 * Jetpack methods
 *
 * @package MinnPost Largo
 */

/**
* Remove share links that are automatically added
*
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
*
*/
add_filter( 'jetpack_sharing_counts', '__return_false' );

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
	add_filter( 'jetpack_lazy_images_blacklisted_classes', 'minnpost_largo_exclude_class_from_lazy_load', 999, 1 );
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
