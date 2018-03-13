<?php
/**
 * Create custom admin settings fields
 *
 * @package MinnPost Largo
 */

$new_minnpost_setting = new Minnpost_General_Setting();

/**
* This class handles additional settings fields for this theme.
*
* This includes:
* default image URL for sharing
* Site footer message
* Email address for site emails
* Name of sender for site emails
* Site blurb for default meta description
*
*/
class Minnpost_General_Setting {

	/**
	* Admin hook to register the fields
	*
	*/
	function __construct() {
		add_filter( 'admin_init', array( $this, 'register_fields' ) );
	}

	/**
	* Use the settings api to create the basic text fields
	*
	*/
	function register_fields() {

		// default site blurb
		register_setting( 'general', 'site_blurb', 'sanitize_text' );
		add_settings_field(
			'site_blurb',
			'<label for="site_blurb">' . __( 'Site Blurb', 'minnpost-largo' ) . '</label>',
			array(
				$this,
				'site_blurb',
			),
			'general'
		);

		// default image url
		register_setting( 'general', 'default_image_url', 'esc_attr' );
		add_settings_field(
			'default_image_url',
			'<label for="default_image_url">' . __( 'Default Image URL', 'minnpost-largo' ) . '</label>',
			array(
				$this,
				'default_image_html',
			),
			'general'
		);

		// site footer message
		register_setting( 'general', 'site_footer_message', 'esc_attr' );
		add_settings_field(
			'site_footer_message',
			'<label for="site_footer_message">' . __( 'Site Footer Message', 'minnpost-largo' ) . '</label>',
			array(
				$this,
				'footer_message_html',
			),
			'general'
		);

		// email address for site emails
		register_setting( 'general', 'site_email_from', 'sanitize_email' );
		add_settings_field(
			'site_email_from',
			'<label for="site_email_from">' . __( 'Email Sending Address', 'minnpost-largo' ) . '</label>',
			array(
				$this,
				'email_sending_address_html',
			),
			'general'
		);

		// sender name for site emails
		register_setting( 'general', 'site_email_from_name', 'esc_attr' );
		add_settings_field(
			'site_email_from_name',
			'<label for="site_email_from_name">' . __( 'Email Sending Name', 'minnpost-largo' ) . '</label>',
			array(
				$this,
				'email_sending_name_html',
			),
			'general'
		);

	}

	// handle the html for each of the above fields
	function site_blurb() {
		$value = get_option( 'site_blurb', '' );
		echo '<input type="text" id="site_blurb" name="site_blurb" value="' . $value . '" />';
	}
	function default_image_html() {
		$value = get_option( 'default_image_url', '' );
		echo '<input type="text" id="default_image_url" name="default_image_url" value="' . $value . '" />';
	}
	function footer_message_html() {
		$value = get_option( 'site_footer_message', '' );
		echo '<input type="text" id="site_footer_message" name="site_footer_message" value="' . $value . '" />';
	}
	function email_sending_address_html() {
		$value = get_option( 'site_email_from', '' );
		echo '<input type="email" id="site_email_from" name="site_email_from" value="' . $value . '" />';
	}
	function email_sending_name_html() {
		$value = get_option( 'site_email_from_name', '' );
		echo '<input type="text" id="site_email_from_name" name="site_email_from_name" value="' . $value . '" />';
	}

}
