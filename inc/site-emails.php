<?php
/**
 * Emails sent by the website
 *
 * @package MinnPost Largo
 */

/**
* Address site emails come from
*
* @param string $old
*
* @return string $email
*
*/
if ( ! has_filter( 'wp_mail_from' ) && ! function_exists( 'minnpost_largo_mail_from' ) ) :
	add_filter( 'wp_mail_from', 'minnpost_largo_mail_from' );
	function minnpost_largo_mail_from( $old ) {
		$email = get_option( 'site_email_from', get_option( 'admin_email' ) );
		return $email;
	}
endif;

/**
* Sender name site emails come from
*
* @param string $old
*
* @return string $site_name
*
*/
if ( ! has_filter( 'wp_mail_from_name' ) && ! function_exists( 'minnpost_largo_mail_from_name' ) ) :
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

/**
* Change any desired attributes for the new user notification email
*
* @param array $new_user_email_attributes
*
* @return array $new_user_email_attributes
*
*/
if ( ! function_exists( 'minnpost_largo_new_user_email_attributes' ) ) :
	add_filter( 'user_account_management_new_user_email_attributes', 'minnpost_largo_new_user_email_attributes', 10, 1 );
	function minnpost_largo_new_user_email_attributes( $new_user_email_attributes ) {
		$new_user_email_attributes['subject'] = 'Welcome to MinnPost';
		return $new_user_email_attributes;
	}
endif;

/**
* Change subject for password reset email
*
* @param string $title
* @param string $user_login
* @param array $user_data
*
* @return string $title
*
*/
if ( ! function_exists( 'minnpost_largo_retrieve_password_subject_filter' ) ) :
	add_filter( 'retrieve_password_title', 'minnpost_largo_retrieve_password_subject_filter', 10, 3 );
	function minnpost_largo_retrieve_password_subject_filter( $title, $user_login, $user_data ) {
		$title = 'Reset your MinnPost password';
		return $title;
	}
endif;
