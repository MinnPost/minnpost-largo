<?php
/**
 * Extra methods
 *
 * @package MinnPost Largo
 */

if ( ! function_exists( 'minnpost_remove_comment_support' ) ) :
	function minnpost_remove_comment_support() {
		remove_post_type_support( 'page', 'comments' );
		remove_post_type_support( 'page', 'trackbacks' );
	}

	// remove comments from pages
	add_action( 'init', 'minnpost_remove_comment_support', 100 );

endif;


if ( ! function_exists( 'is_post_type' ) ) :
	function is_post_type( $type ) {
		global $wp_query;
		if ( get_post_type( $wp_query->post->ID ) === $type ) {
			return true;
		}
		return false;
	}
endif;

if ( ! function_exists( 'minnpost_post_thumbnail_sizes_attr' ) ) :
	add_filter( 'wp_get_attachment_image_attributes', 'minnpost_post_thumbnail_sizes_attr', 10 , 3 );
	function minnpost_post_thumbnail_sizes_attr( $attr = array(), $attachment, $size = '' ) {
		if ( 'post-thumbnail' === $size ) {
			is_active_sidebar( 'sidebar-1' ) && $attr['sizes'] = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 984px) 60vw, (max-width: 1362px) 62vw, 840px';
			! is_active_sidebar( 'sidebar-1' ) && $attr['sizes'] = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 1362px) 88vw, 1200px';
		}
		return $attr;
	}
endif;

if ( ! function_exists( 'minnpost_dom_innerhtml' ) ) :
	function minnpost_dom_innerhtml( $element ) {
		$inner_html = '';
		$children = $element->childNodes;
		foreach ( $children as $child ) {
			$tmp_dom = new DOMDocument();
			$tmp_dom->appendChild( $tmp_dom->importNode( $child, true ) );
			$inner_html .= trim( $tmp_dom->saveHTML() );
		}
		return $inner_html;
	}
endif;

if ( ! function_exists( 'keep_me_logged_in_for_1_year' ) ) :
	add_filter( 'auth_cookie_expiration', 'keep_me_logged_in_for_1_year' );
	function keep_me_logged_in_for_1_year( $expirein ) {
		return 31556926; // 1 year in seconds
	}
endif;
