<?php
/**
 * Create custom form methods for processing form submissions.
 * This mainly handles subscribing users to newsletters.
 *
 * @package MinnPost Largo
 */

/**
* Subscribe a user to MinnPost emails.
* This depends on the MinnPost Form Processor for MailChimp, and the Form Processor for MailChimp, plugins.
*
*/
if ( ! function_exists( 'minnpost_email_subscribe_form_process' ) ) :
	// all of these hooks use the same method
	// basically they allow it to work whether the user is on the front end or on the admin
	// and also whether the form is submitted with a page refresh or via ajax
	add_action( 'admin_post_nopriv_newsletter_shortcode', 'minnpost_email_subscribe_form_process' );
	add_action( 'admin_post_newsletter_shortcode', 'minnpost_email_subscribe_form_process' );
	add_action( 'wp_ajax_nopriv_newsletter_shortcode', 'minnpost_email_subscribe_form_process' );
	add_action( 'wp_ajax_newsletter_shortcode', 'minnpost_email_subscribe_form_process' );
	function minnpost_email_subscribe_form_process() {

		if ( isset( $_POST['mp_newsletter_form_nonce'] ) && wp_verify_nonce( $_POST['mp_newsletter_form_nonce'], 'mp_newsletter_form_nonce' ) ) {

			// sanitize form data
			$id                = isset( $_POST['_mailchimp_user_id'] ) ? esc_attr( $_POST['_mailchimp_user_id'] ) : '';
			$status            = isset( $_POST['_mailchimp_user_status'] ) ? esc_attr( $_POST['_mailchimp_user_status'] ) : '';
			$email             = isset( $_POST['user_email'] ) ? sanitize_email( $_POST['user_email'] ) : '';
			$first_name        = isset( $_POST['first_name'] ) ? sanitize_text_field( $_POST['first_name'] ) : '';
			$last_name         = isset( $_POST['last_name'] ) ? sanitize_text_field( $_POST['last_name'] ) : '';
			$newsletters       = isset( $_POST['_newsletters'] ) ? (array) $_POST['_newsletters'] : array();
			$newsletters       = array_map( 'esc_attr', $newsletters );
			$occasional_emails = isset( $_POST['_occasional_emails'] ) ? (array) $_POST['_occasional_emails'] : array();
			$occasional_emails = array_map( 'esc_attr', $occasional_emails );

			$newsletters_available = isset( $_POST['newsletters_available'] ) ? (array) $_POST['newsletters_available'] : array();
			$newsletters_available = array_map( 'esc_attr', $newsletters_available );

			$occasional_emails_available = isset( $_POST['occasional_emails_available'] ) ? (array) $_POST['occasional_emails_available'] : array();
			$occasional_emails_available = array_map( 'esc_attr', $occasional_emails_available );

			$confirm_message = isset( $_POST['confirm_message'] ) ? sanitize_text_field( $_POST['confirm_message'] ) : '';

			$user_data = array(
				'_mailchimp_user_id' => $id,
				'user_email'         => $email,
				'first_name'         => $first_name,
				'last_name'          => $last_name,
			);

			if ( '' !== $status ) {
				$user_data['_mailchimp_user_status'] = $status;
			}

			if ( ! empty( $newsletters_available ) ) {
				$user_data['newsletters_available'] = $newsletters_available;
			}
			if ( ! empty( $occasional_emails_available ) ) {
				$user_data['occasional_emails_available'] = $occasional_emails_available;
			}

			if ( ! empty( $newsletters ) ) {
				$user_data['_newsletters'] = $newsletters;
			}
			if ( ! empty( $newsletters ) ) {
				$user_data['_occasional_emails'] = $occasional_emails;
			}

			// mailchimp fields
			if ( ! class_exists( 'Minnpost_Form_Processor_MailChimp' ) ) {
				require_once( TEMPLATEPATH . 'plugins/minnpost-form-processor-mailchimp/minnpost-form-processor-mailchimp.php' );
			}
			$minnpost_form = Minnpost_Form_Processor_MailChimp::get_instance();
			$result        = $minnpost_form->save_user_mailchimp_list_settings( $user_data );

			if ( isset( $result['id'] ) ) {
				if ( 'PUT' === $result['method'] ) {
					$user_status = 'existing';
				} elseif ( 'POST' === $result['method'] ) {
					$user_status = 'new';
					if ( 'pending' === $result['status'] ) {
						$user_status = 'pending';
					}
				}
				if ( isset( $_POST['ajaxrequest'] ) && 'true' === $_POST['ajaxrequest'] ) {
					wp_send_json_success(
						array(
							'id'              => $result['id'],
							'user_status'     => $user_status,
							'confirm_message' => $confirm_message,
						)
					);
				} else {
					if ( isset( $_GET['redirect_url'] ) && '' !== $_GET['redirect_url'] ) {
						$redirect_url = wp_validate_redirect( $_GET['redirect_url'] );
					} elseif ( isset( $_POST['redirect_url'] ) && '' !== $_POST['redirect_url'] ) {
						$redirect_url = wp_validate_redirect( $_POST['redirect_url'] );
					} else {
						$redirect_url = site_url();
					}
					$redirect_url = add_query_arg( 'subscribe-message', 'success-' . $user_status, $redirect_url );

					wp_redirect( $redirect_url );
					exit;
				}
			}

			/*$params['body'] = array(
				'email_address' => $email,
				'status' => $status,
				'merge_fields[FNAME]' => $first_name,
				'merge_fields[LNAME]' => $last_name,
			);
			foreach ( $all_newsletters as $key => $value ) {
				$params['body'][ 'interests[' . $key . ']' ] = 'false';
			}
			foreach ( $all_occasional_emails as $key => $value ) {
				$params['body'][ 'interests[' . $key . ']' ] = 'false';
			}

			// add the groups the user actually wants
			if ( ! empty( $newsletters ) ) {
				foreach ( $newsletters as $key => $value ) {
					$params['body'][ 'interests[' . $value . ']' ] = 'true';
				}
			}
			if ( ! empty( $occasional_emails ) ) {
				foreach ( $occasional_emails as $key => $value ) {
					$params['body'][ 'interests[' . $value . ']' ] = 'true';
				}
			}

			$params['method'] = $http_method;
			$params['timeout'] = 30;
			$params['sslverify'] = false;

			$rest_url = site_url( '/wp-json/form-processor-mc/v1/lists/3631302e9c/members/?api_key=0334e149b481a2391cfdd428238358a9-us1' );
			$result = wp_remote_request( $rest_url, $params );*/

			//error_log( 'result is ' . print_r( $result, true ) );
		} else {
			if ( isset( $_GET['redirect_url'] ) && '' !== $_GET['redirect_url'] ) {
				$redirect_url = wp_validate_redirect( $_GET['redirect_url'] );
			} elseif ( isset( $_POST['redirect_url'] ) && '' !== $_POST['redirect_url'] ) {
				$redirect_url = wp_validate_redirect( $_POST['redirect_url'] );
			} else {
				$redirect_url = site_url();
			}
			if ( isset( $_POST['ajaxrequest'] ) && 'true' === $_POST['ajaxrequest'] ) {
				wp_send_json_error();
			} else {
				wp_die(
					__( 'Invalid nonce specified', 'minnpost-largo' ),
					__( 'Error', 'minnpost-largo' ),
					array(
						'response'  => 403,
						'back_link' => $redirect_url,
					)
				);
			}
		}
	}
endif;

// remove Add Form gravityforms button from post forms
add_filter( 'gform_display_add_form_button', '__return_false' );
