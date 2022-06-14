<?php
/**
 * Create custom form methods for processing form submissions.
 *
 * @package MinnPost Largo
 */

// remove Add Form gravityforms button from post forms
add_filter( 'gform_display_add_form_button', '__return_false' );

// remove Gravityforms added JavaScript from the head that we don't need
add_filter( 'gform_force_hooks_js_output', '__return_false' );

/**
 * Enforce anti-spam honeypot on all Gravity forms.
 *
 * @param array $form The current form to be filtered.
 *
 * @return array
 */
if ( ! function_exists( 'minnpost_largo_gf_honeypot' ) ) :
	add_filter( 'gform_form_post_get_meta', 'minnpost_largo_gf_honeypot' );
	function minnpost_largo_gf_honeypot( $form ) {
		$form['enableHoneypot'] = true;
		return $form;
	}
endif;

/**
 * Archive date forms should send users to the destination URL
 */
if ( ! function_exists( 'minnpost_largo_date_archive_submit' ) ) :
	add_action( 'admin_post_nopriv_date_archive_submit', 'minnpost_largo_date_archive_submit' );
	add_action( 'admin_post_date_archive_submit', 'minnpost_largo_date_archive_submit' );
	function minnpost_largo_date_archive_submit() {
		if ( isset( $_POST['archive_dropdown'] ) ) {
			$redirect_url = wp_validate_redirect( $_POST['archive_dropdown'] );
			wp_redirect( $redirect_url );
			exit;
		}
	}
endif;
