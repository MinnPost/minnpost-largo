<?php
/**
 * Do things for media uploads
 *
 * @package MinnPost Largo
 */

/**
* Add image sizes for posts.
* These are created when an image is uploaded.
*
*/
if ( ! function_exists( 'minnpost_image_sizes' ) ) :
	add_action( 'after_setup_theme', 'minnpost_image_sizes' );
	function minnpost_image_sizes() {
		/*add_image_size( 'post-feature', 190, 9999 );
		add_image_size( 'post-feature-large', 400, 400 );
		add_image_size( 'post-feature-medium', 190, 125, true );
		add_image_size( 'post-newsletter-thumb', 80, 60, true );*/
		add_image_size( 'feature', 190, 9999 );
		add_image_size( 'feature-large', 400, 400 );
		add_image_size( 'feature-medium', 190, 125, true );
		add_image_size( 'newsletter-thumb', 80, 60, true );
		add_image_size( 'author-thumbnail', 75, 9999 );
	}
endif;

/**
* Size attribute for thumbnail images
*
* @param array $attr
* @param object $attachment
* @param string|array $size
*
* @return array $attr
*/
if ( ! function_exists( 'minnpost_post_thumbnail_sizes_attr' ) ) :
	add_filter( 'wp_get_attachment_image_attributes', 'minnpost_post_thumbnail_sizes_attr', 10, 3 );
	function minnpost_post_thumbnail_sizes_attr( $attr = array(), $attachment, $size = '' ) {
		if ( 'post-thumbnail' === $size ) {
			is_active_sidebar( 'sidebar-1' ) && $attr['sizes']   = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 984px) 60vw, (max-width: 1362px) 62vw, 840px';
			! is_active_sidebar( 'sidebar-1' ) && $attr['sizes'] = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 1362px) 88vw, 1200px';
		}
		return $attr;
	}
endif;

/**
* Whether this image should be watermarked. For us, this should depend on the member level field of the post
*
* @param bool $allowed
* @param int $post_id
*
* @return bool $allowed
*/
if ( ! function_exists( 'image_watermark_allowed' ) ) :
	add_filter( 'image_watermark_allowed', 'minnpost_image_watermark_allowed', 10, 2 );
	function minnpost_image_watermark_allowed( $allowed, $post_id ) {
		// allowed default is false
		$access_level = get_post_meta( $post_id, '_access_level', true );
		if ( '' !== $access_level ) {
			if ( class_exists( 'Blocked_Content_Template' ) ) {
				$blocked_content_template = Blocked_Content_Template::get_instance();
				$minimum_level            = $blocked_content_template->get_minimum_branded_level();
				if ( $access_level >= $minimum_level ) {
					$allowed = true;
				}
			} else {
				$allowed = true;
			}
		}
		return $allowed;
	}
endif;
