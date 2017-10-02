<?php
/**
 * Create custom admin settings fields
 *
 *
 * @package MinnPost Largo
 */

$new_minnpost_setting = new Minnpost_General_Setting();

class Minnpost_General_Setting {
	function __construct() {
		add_filter( 'admin_init' , array( $this, 'register_fields' ) );
	}
	function register_fields() {
		register_setting( 'general', 'site_footer_message', 'esc_attr' );
		add_settings_field( 'site_footer_message', '<label for="site_footer_message">' . __( 'Site Footer Message' , 'site_footer_message' ) . '</label>' , array( $this, 'fields_html' ) , 'general' );
	}
	function fields_html() {
		$value = get_option( 'site_footer_message', '' );
		echo '<input type="text" id="site_footer_message" name="site_footer_message" value="' . $value . '" />';
	}
}
