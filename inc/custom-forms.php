<?php
/**
 * Create custom form methods for processing form submissions.
 *
 * @package MinnPost Largo
 */

// remove Add Form gravityforms button from post forms
add_filter( 'gform_display_add_form_button', '__return_false' );

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
