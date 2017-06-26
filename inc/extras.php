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