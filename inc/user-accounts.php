<?php
/**
 * Methods for user account functionality
 * Much of this depends on the User Account Management plugin
 *
 * @package MinnPost Largo
 */

/**
* Return login url for users
*
* @param string $login_url
* @param string $redirect
* @param bool $force_reauth
* @return string $login_url
*
*/
if ( ! function_exists( 'login_url' ) ) :
	add_filter( 'login_url', 'login_url', 10, 3 );
	function login_url( $login_url, $redirect, $force_reauth ) {
		$login_url    = site_url( '/user/login/' );
		$register_url = site_url( '/user/register/' );

		if ( '' !== $redirect && get_current_url() !== $login_url && get_current_url() !== $register_url ) {
			$login_url = add_query_arg( 'redirect_to', $redirect, $login_url );
		}
		return $login_url;
	}
endif;

/**
* Return register url for users
*
* @param string $register_url
* @return string
*
*/
if ( ! function_exists( 'register_url' ) ) :
	add_filter( 'register_url', 'register_url', 10, 1 );
	function register_url( $register_url ) {
		return site_url( '/user/register/' );
	}
endif;

/**
* Return lost password url for users
*
* @param string $lostpassword_url
* @param string $redirect
* @return string
*
*/
if ( ! function_exists( 'lostpassword_url' ) ) :
	add_filter( 'lostpassword_url', 'my_lost_password_page', 10, 2 );
	function my_lost_password_page( $lostpassword_url, $redirect ) {
		return site_url( '/user/password-lost/' );
	}
endif;

/**
* Return login form action url for users
*
* @param string $login_form_action
* @return string
*
*/
if ( ! function_exists( 'login_form_action' ) ) :
	add_filter( 'user_account_management_login_form_action', 'login_form_action', 10, 1 );
	function login_form_action( $login_form_action ) {
		$login_form_action = site_url( 'wp-login.php' );
		return $login_form_action;
	}
endif;

/**
* Return register form action url for users
*
* @param string $register_form_action
* @return string
*
*/
if ( ! function_exists( 'register_form_action' ) ) :
	add_filter( 'user_account_management_register_form_action', 'register_form_action', 10, 1 );
	function register_form_action( $register_form_action ) {
		$register_form_action = site_url( 'wp-login.php?action=register' );
		return $register_form_action;
	}
endif;

/**
* Return lost password form action url for users
*
* @param string $lost_password_form_action
* @return string
*
*/
if ( ! function_exists( 'lost_password_form_action' ) ) :
	add_filter( 'user_account_management_lost_password_form_action', 'lost_password_form_action', 10, 1 );
	function lost_password_form_action( $lost_password_form_action ) {
		$lost_password_form_action = site_url( 'wp-login.php?action=lostpassword' );
		return $lost_password_form_action;
	}
endif;

/**
* Return theme template for user pages
*
* @param string $template
* @return string $template
*
*/
if ( ! function_exists( 'minnpost_largo_user_child_template' ) ) :
	add_filter( 'page_template', 'minnpost_largo_user_child_template', 10, 1 );
	function minnpost_largo_user_child_template( $template ) {
		global $post;
		$page = get_page_by_path( 'user' );
		$id   = $page->ID;

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

/**
* Create the query var so that WP catches the custom /user/id url
*
* @param array $vars
* @return array $vars
*
*/
if ( ! function_exists( 'minnpost_largo_user_rewrite' ) ) :
	add_filter( 'query_vars', 'minnpost_largo_user_rewrite' );
	function minnpost_largo_user_rewrite( $vars ) {
		$vars[] = 'users';
		return $vars;
	}
endif;

/**
* Create the rewrite rules for those user urls
*
* @param array $vars
* @return array $vars
*
*/
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

/**
* Catch the user URL and send it to a theme template file
*
* @param string $original_template
* @return string
*
*/
if ( ! function_exists( 'minnpost_largo_user_rewrite_catch' ) ) :
	add_action( 'template_include', 'minnpost_largo_user_rewrite_catch' );
	function minnpost_largo_user_rewrite_catch( $original_template ) {
		global $wp_query;
		if ( array_key_exists( 'users', $wp_query->query_vars ) ) {
			$wp_query->is_home     = false;
			$wp_query->is_singular = true;
			return get_theme_file_path() . '/user-profile.php';
		} else {
			return $original_template;
		}
	}
endif;

/**
* This stops comment moderators from doing things with posts
* WordPress would otherwise allow this, but it is not viable for us
* This depends on the Advanced Access Manager plugin
*
*
*/
if ( ! function_exists( 'restrict_comment_moderators' ) ) :
	add_action( 'admin_init', 'restrict_comment_moderators', 1 );
	function restrict_comment_moderators() {
		global $pagenow;
		$user          = AAM::getUser();
		$capabillities = $user->getObject( 'capabilities' );
		if ( in_array( 'comment_moderator', (array) $user->roles ) ) {
			$user->roles = array( 'comment_moderator' );
			if ( ( 'edit.php' === $pagenow || 'post.php' === $pagenow || 'post-new.php' === $pagenow ) ) {
				wp_die( __( 'You are not allowed to access this part of the site', 'minnpost-largo' ) );
			}
		}
	}
endif;

/**
* Add reading topics to user data
*
* @param array $user_data
* @param array $posted
* @param array $existing_user_data
* @return array $user_data
*
*/
if ( ! function_exists( 'add_to_user_data' ) ) :
	add_filter( 'user_account_management_add_to_user_data', 'add_to_user_data', 10, 3 );
	function add_to_user_data( $user_data, $posted, $existing_user_data ) {
		// reading preferences field
		if ( isset( $posted['_reading_topics'] ) && ! empty( $posted['_reading_topics'] ) ) {
			$user_data['_reading_topics'] = $posted['_reading_topics'];
		}
		return $user_data;
	}
endif;

/**
* Save user data
*
* @param array $user_data
* @param array $existing_user_data
*
*/
if ( ! function_exists( 'save_minnpost_user_data' ) ) :
	add_action( 'user_account_management_post_user_data_save', 'save_minnpost_user_data', 10, 2 );
	function save_minnpost_user_data( $user_data, $existing_user_data ) {
		if ( isset( $user_data['_reading_topics'] ) && '' !== $user_data['_reading_topics'] ) {
			update_user_meta( $user_data['ID'], '_reading_topics', $user_data['_reading_topics'] );
		}
	}
endif;
