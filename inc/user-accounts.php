<?php
/**
 * Methods for user account functionality
 *
 * @package MinnPost Largo
 */

if ( ! function_exists( 'login_url' ) ) :
	add_filter( 'login_url', 'login_url', 10, 3 );
	function login_url( $login_url, $redirect, $force_reauth ) {
		$login_url = site_url( '/user/login/' );
		$register_url = site_url( '/user/register/' );

		if ( '' !== $redirect && get_current_url() !== $login_url && get_current_url() !== $register_url ) {
			$login_url = add_query_arg( 'redirect_to', $redirect, $login_url );
		}
		return $login_url;
	}
endif;

if ( ! function_exists( 'register_url' ) ) :
	add_filter( 'register_url', 'register_url', 10, 1 );
	function register_url( $register_url ) {
		return site_url( '/user/register/' );
	}
endif;

if ( ! function_exists( 'lostpassword_url' ) ) :
	add_filter( 'lostpassword_url', 'my_lost_password_page', 10, 2 );
	function my_lost_password_page( $lostpassword_url, $redirect ) {
		return site_url( '/user/password-lost/' );
	}
endif;

if ( ! function_exists( 'login_form_action' ) ) :
	add_filter( 'user_account_management_login_form_action', 'login_form_action', 10, 1 );
	function login_form_action( $login_form_action ) {
		$login_form_action = site_url( 'wp-login.php' );
		return $login_form_action;
	}
endif;

if ( ! function_exists( 'register_form_action' ) ) :
	add_filter( 'user_account_management_register_form_action', 'register_form_action', 10, 1 );
	function register_form_action( $register_form_action ) {
		$register_form_action = site_url( 'wp-login.php?action=register' );
		return $register_form_action;
	}
endif;

if ( ! function_exists( 'lost_password_form_action' ) ) :
	add_filter( 'user_account_management_lost_password_form_action', 'lost_password_form_action', 10, 1 );
	function lost_password_form_action( $lost_password_form_action ) {
		$lost_password_form_action = site_url( 'wp-login.php?action=lostpassword' );
		return $lost_password_form_action;
	}
endif;
