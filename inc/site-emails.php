<?php
/**
 * Emails sent by the website
 *
 * @package MinnPost Largo
 */

// address the messages come from
if ( ! function_exists( 'minnpost_largo_mail_from' ) ) :
	add_filter( 'wp_mail_from', 'minnpost_largo_mail_from' );
	function minnpost_largo_mail_from( $old ) {
		$email = get_option( 'site_email_from', get_option( 'admin_email' ) );
		return $email;
	}
endif;

// name the messages come from
if ( ! function_exists( 'minnpost_largo_mail_from_name' ) ) :
	add_filter( 'wp_mail_from_name', 'minnpost_largo_mail_from_name' );
	function minnpost_largo_mail_from_name( $old ) {
		$site_name = get_option( 'site_email_from_name', get_option( 'blogname' ) );
		return $site_name;
	}
endif;

// send emails as html - must create templates for the desired emails to work nicely
add_filter( 'wp_mail_content_type', function() {
	return 'text/html';
} );
