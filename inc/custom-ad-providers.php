<?php
/**
 * Create custom ad providers
 *
 * Currently this uses the Ad Code Manager plugin from Automattic
 *
 * @link https://vip.wordpress.com/documentation/configure-ad-code-manager-to-manage-the-advertisements-on-your-site/
 *
 * @package MinnPost Largo
 */

add_filter( 'acm_register_provider_slug', 'my_acm_register_provider_slug' );
function my_acm_register_provider_slug( $providers ) {
	$providers->appnexus = array(
		'provider' => 'Appnexus_Async_ACM_Provider',
		'table' => 'Appnexus_ACM_WP_List_Table'
	);
	return $providers;
}

add_filter( 'acm_display_ad_codes_without_conditionals', '__return_true' );