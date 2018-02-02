<?php
/**
 * Jetpack methods
 *
 * @package MinnPost Largo
 */

// sharing by email
if ( ! function_exists( 'share_email_allowed' ) ) :
	add_filter( 'sharing_services_email', 'share_email_allowed' );
	function share_email_allowed() {
		return true;
	}
endif;

// where sharing does not go
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
