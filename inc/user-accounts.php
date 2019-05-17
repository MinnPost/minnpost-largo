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
* This depends on the MinnPost Roles and Capabilities plugin
*
*
*/
if ( ! function_exists( 'restrict_comment_moderators' ) ) :
	add_action( 'admin_init', 'restrict_comment_moderators', 1 );
	function restrict_comment_moderators() {
		global $pagenow;
		$user         = class_exists( 'AAM' ) ? AAM::getUser() : wp_get_current_user();
		$member_roles = array( 'member_bronze', 'member_silver', 'member_gold', 'member_platinum' );
		$user->roles  = array_diff( (array) $user->roles, $member_roles );
		if ( in_array( 'comment_moderator', (array) $user->roles ) ) {
			if ( ( 'edit.php' === $pagenow || 'post.php' === $pagenow || 'post-new.php' === $pagenow ) ) {
				wp_die( esc_html__( 'You are not allowed to access this part of the site', 'minnpost-largo' ) );
			}
		}
	}
endif;

/**
* Add custom MP fields to user data
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
		// if these are cmb2 fields, they'll be sanitized by cmb2
		// handle consolidated email addresses if they're submitted by the form
		// this array is all of the submitted email addresses, not all the previously saved ones
		if ( isset( $posted['_consolidated_emails_array'] ) && is_array( $posted['_consolidated_emails_array'] ) ) {
			$user_data['_consolidated_emails_array'] = array_map( 'sanitize_email', wp_unslash( $posted['_consolidated_emails_array'] ) );
		}
		$all_emails[] = $user_data['user_email'];
		// combine all consolidated emails
		if ( isset( $posted['_consolidated_emails'] ) && ! empty( $posted['_consolidated_emails'] ) ) {
			// this is a cmb2 field or a rest api field
			$all_emails = array_map( 'trim', explode( ',', $posted['_consolidated_emails'] ) );
			// if the user is changing their primary email, switch the new primary with the old primary.
			if ( isset( $posted['primary_email'] ) ) {
				$primary_email = sanitize_email( $posted['primary_email'] );
				if ( in_array( $primary_email, $all_emails ) ) {
					$user_data['user_email'] = $primary_email;
				}
			}
		}

		// combine all the emails into one array
		if ( isset( $user_data['_consolidated_emails_array'] ) ) {
			$all_emails = array_merge( $all_emails, $user_data['_consolidated_emails_array'] );
		}

		// if the user is removing an email, delete it
		if ( isset( $posted['remove_email'] ) && ! empty( $posted['remove_email'] ) ) {
			$remove_emails = array_map( 'sanitize_email', wp_unslash( $posted['remove_email'] ) );
			$all_emails    = array_diff( $all_emails, $remove_emails );
		}

		// make sure the array of emails is unique, and put it together in a string to pass on
		$all_emails                        = array_unique( $all_emails );
		$posted['_consolidated_emails']    = implode( ',', $all_emails );
		$user_data['_consolidated_emails'] = $posted['_consolidated_emails'];

		// reading preferences field
		if ( isset( $posted['_reading_topics'] ) && ! empty( $posted['_reading_topics'] ) ) {
			$user_data['_reading_topics'] = $posted['_reading_topics'];
		}

		// street address field
		if ( isset( $posted['street_address'] ) && ! empty( $posted['street_address'] ) ) {
			$user_data['_street_address'] = $posted['street_address'];
		}

		return $user_data;
	}
endif;


/**
* Set the user email address for the form. Used when users have multiple email addresses and need to set the MailChimp preferences for them.
*
* @param string $user_email
* @param int $user_id
* @return string $user_email
*
*/
if ( ! function_exists( 'mailchimp_set_form_user_email' ) ) :
	add_filter( 'minnpost_form_processor_mailchimp_set_form_user_email', 'mailchimp_set_form_user_email', 10, 2 );
	function mailchimp_set_form_user_email( $user_email, $user_id ) {
		$emails = get_user_meta( $user_id, '_consolidated_emails', true );
		$emails = explode( ',', $emails );
		if ( 1 >= count( $emails ) ) {
			return $user_email;
		} else {
			if ( isset( $_GET['email'] ) ) {
				$email_to_check = sanitize_email( $_GET['email'] );
				if ( in_array( $email_to_check, $emails, true ) ) {
					return $email_to_check;
				}
			}
		}
		return $user_email;
	}
endif;

/**
* Save custom MP fields to user data
*
* @param array $user_data
* @param array $existing_user_data
*
*/
if ( ! function_exists( 'save_minnpost_user_data' ) ) :
	add_action( 'user_account_management_post_user_data_save', 'save_minnpost_user_data', 10, 2 );
	function save_minnpost_user_data( $user_data, $existing_user_data ) {
		// handle consolidated email addresses
		if ( isset( $user_data['ID'] ) && isset( $user_data['_consolidated_emails'] ) && '' !== $user_data['_consolidated_emails'] ) {
			$all_emails = array_map( 'trim', explode( ',', $user_data['_consolidated_emails'] ) );
		}

		// handle removing email addresses from a user's account
		if ( isset( $user_data['ID'] ) && isset( $user_data['remove_email'] ) ) {
			$all_emails = array_diff( $all_emails, $user_data['remove_email'] );
		}

		// make a string out of the email array and save it
		if ( isset( $all_emails ) ) {
			$all_emails = array_unique( $all_emails );
			$all_emails = implode( ',', $all_emails );
			update_user_meta( $user_data['ID'], '_consolidated_emails', $all_emails );
		}

		// reading preferences field
		if ( isset( $user_data['ID'] ) && isset( $user_data['_reading_topics'] ) && '' !== $user_data['_reading_topics'] ) {
			update_user_meta( $user_data['ID'], '_reading_topics', $user_data['_reading_topics'] );
		}

		// street address field
		if ( isset( $user_data['_street_address'] ) ) {
			update_user_meta( $user_data['ID'], '_street_address', $user_data['_street_address'] );
		}
	}
endif;

/**
* When a user dropdown is in use (this only happens in admin pages for us, filter it so it shows the roles we would want
*
* @param array $query_args
* @return array $existing_user_data
*
*/
if ( ! function_exists( 'filter_wp_dropdown_users_args' ) ) :
	add_filter( 'wp_dropdown_users_args', 'filter_wp_dropdown_users_args' );
	function filter_wp_dropdown_users_args( $query_args ) {
		$query_args['role__in'] = array(
			'administrator',
			'editor',
			'business',
			'author',
			'contributor',
			'comment_moderator',
			'staff',
		);
		// Unset the 'who' as this defaults to the 'author' role
		unset( $query_args['who'] );
		return $query_args;
	}
endif;

if ( ! function_exists( 'minnpost_largo_check_consolidated_emails' ) ) :
	function minnpost_largo_check_consolidated_emails( $user_data, $current_email ) {
		$emails = array();
		// this is $_POST data
		if ( isset( $user_data['consolidated_emails'] ) ) {
			$emails = array_map( 'trim', explode( ',', $user_data['consolidated_emails'] ) );
		} elseif ( isset( $user_data['_consolidated_emails'][0] ) ) {
			// this is stored user data
			$emails = array_map( 'trim', explode( ',', $user_data['_consolidated_emails'][0] ) );
		}
		if ( false !== ( $key = array_search( $current_email, $emails ) ) ) {
			unset( $emails[ $key ] );
		}
		return $emails;
	}
endif;
