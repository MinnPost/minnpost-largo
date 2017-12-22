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
		register_setting( 'general', 'default_image_url', 'esc_attr' );
		add_settings_field( 'default_image_url', '<label for="default_image_url">' . __( 'Default Image URL' , 'minnpost-largo' ) . '</label>' , array( $this, 'default_image_html' ) , 'general' );
		register_setting( 'general', 'site_footer_message', 'esc_attr' );
		add_settings_field( 'site_footer_message', '<label for="site_footer_message">' . __( 'Site Footer Message' , 'minnpost-largo' ) . '</label>' , array( $this, 'footer_message_html' ) , 'general' );
	}
	function default_image_html() {
		$value = get_option( 'default_image_url', '' );
		echo '<input type="text" id="default_image_url" name="default_image_url" value="' . $value . '" />';
	}
	function footer_message_html() {
		$value = get_option( 'site_footer_message', '' );
		echo '<input type="text" id="site_footer_message" name="site_footer_message" value="' . $value . '" />';
	}
}
