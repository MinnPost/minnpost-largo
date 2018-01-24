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

if ( ! function_exists( 'minnpost_largo_user_child_template' ) ) :
	add_filter( 'page_template', 'minnpost_largo_user_child_template', 10, 1 );
	function minnpost_largo_user_child_template( $template ) {
		global $post;
		$page = get_page_by_path( 'user' );
		$id = $page->ID;

		if ( $post->post_parent === $id || $post->ID === $id ) {
			// get top level parent page
			//$parent = get_post( reset( array_reverse( get_post_ancestors( $post->ID ) ) ) );
			// or ...
			// when you need closest parent post instead
			$parent = get_post( $post->post_parent );

			$child_template = locate_template(
				[
					$parent->post_name . '-' . $post->post_name . '.php',
					$parent->post_name . '-' . $post->ID . '.php',
					$parent->post_name . '.php',
				]
			);
			if ( $child_template ) {
				return $child_template;
			}
		}
		return $template;
	}
endif;

// Create the query var so that WP catches the custom /user/id url
if ( ! function_exists( 'minnpost_largo_user_rewrite' ) ) :
	add_filter( 'query_vars', 'minnpost_largo_user_rewrite' );
	function minnpost_largo_user_rewrite( $vars ) {
		$vars[] = 'users';
		return $vars;
	}
endif;

// Create the rewrites
if ( ! function_exists( 'minnpost_largo_user_rewrite_rule' ) ) :
	add_action( 'init', 'minnpost_largo_user_rewrite_rule' );
	function minnpost_largo_user_rewrite_rule() {
		add_rewrite_tag( '%users%', '([^&]+)' );
		add_rewrite_rule(
			'^users/([^/]*)/?',
			'index.php?users=$matches[1]',
			'top'
		);
	}
endif;

// Catch the URL and redirect it to a template file
if ( ! function_exists( 'minnpost_largo_user_rewrite_catch' ) ) :
	add_action( 'template_include', 'minnpost_largo_user_rewrite_catch' );
	function minnpost_largo_user_rewrite_catch( $original_template ) {
		global $wp_query;
		if ( array_key_exists( 'users', $wp_query->query_vars ) ) {
			$wp_query->is_home = false;
			$wp_query->is_singular = true;
			return get_theme_file_path() . '/user-profile.php';
		} else {
			return $original_template;
		}
	}
endif;
