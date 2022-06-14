<?php
/**
 * Theme settings for ad providers
 *
 * Currently this depends on the Ad Code Manager plugin from Automattic
 *
 * @link https://vip.wordpress.com/documentation/configure-ad-code-manager-to-manage-the-advertisements-on-your-site/
 *
 * @package MinnPost Largo
 */

/**
 * Ad conditionals that aren't already included in the ad plugin
 *
 * @param array $conditionals
 * @return array $conditionals
 */
if ( ! function_exists( 'minnpost_acm_whitelisted_conditionals' ) ) :
	add_filter( 'acm_whitelisted_conditionals', 'minnpost_acm_whitelisted_conditionals' );
	function minnpost_acm_whitelisted_conditionals( $conditionals ) {
		$conditionals[] = 'has_primary_category';
		$conditionals[] = 'is_post_type';
		$conditionals[] = 'is_post_type_archive';
		$conditionals[] = 'is_feed';
		sort( $conditionals );
		return $conditionals;
	}
endif;

/**
* Placeholders for ads; these are shown to users who have the capability to browse without ads
*
* @param array $output
* @param int $tag_id
* @return string $output
*/
if ( ! function_exists( 'acm_no_ad_users' ) ) :
	add_filter( 'acm_output_html_after_tokens_processed', 'acm_no_ad_users', 10, 2 );
	function acm_no_ad_users( $output, $tag_id = null ) {
		if ( is_array( $output ) ) {
			$output_html   = isset( $output['html'] ) ? $output['html'] : '';
			$output_script = isset( $output['script'] ) ? $output['script'] : '';
		} else {
			$output_html   = $output;
			$output_script = '';
		}
		if ( is_feed() ) {
			$output = $output_html;
		}
		if ( ! current_user_can( 'browse_without_ads' ) ) {
			$output = $output_html . $output_script;
		} else {
			if ( $tag_id === 'dfp_head' ) {
				$output = '';
			} else {
				$output = '<div class="acm-ad acm-ad-placeholder ad-' . sanitize_title( $tag_id ) . '">AD: ' . $tag_id . '</div>';
			}
		}
		return $output;
	}
endif;

/**
* Highest count available for the ad code table. This should always be set to a value higher than what we need.
*
* @param int $adcount
* @return int $adcount
*/
if ( ! function_exists( 'minnpost_acm_ad_count' ) ) :
	add_filter( 'acm_ad_code_count', 'minnpost_acm_ad_count' );
	function minnpost_acm_ad_count( $adcount ) {
		$adcount = 200;
		return $adcount;
	}
endif;

/**
* Set the default ad provider for the theme.
*
* @param string $current_provider_slug
* @return string $current_provider_slug
*/
if ( ! function_exists( 'minnpost_acm_default_provider' ) ) :
	add_filter( 'acm_provider_slug', 'minnpost_acm_default_provider' );
	function minnpost_acm_default_provider( $current_provider_slug ) {
		$current_provider_slug = 'arcads_dfp';
		return $current_provider_slug;
	}
endif;

// add_filter( 'acm_display_ad_codes_without_conditionals', '__return_true' );
