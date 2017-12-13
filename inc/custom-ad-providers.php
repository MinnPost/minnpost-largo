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

add_filter( 'acm_register_provider_slug', 'minnpost_acm_register_provider_slug' );
function minnpost_acm_register_provider_slug( $providers ) {
	$providers->appnexus = array(
		'provider' => 'Appnexus_Async_ACM_Provider',
		'table' => 'Appnexus_ACM_WP_List_Table',
	);
	return $providers;
}

add_filter( 'acm_whitelisted_conditionals', 'minnpost_acm_whitelisted_conditionals' );
function minnpost_acm_whitelisted_conditionals( $conditionals ) {
	$conditionals[] = 'minnpost_is_post_type';
	$conditionals[] = 'is_post_type_archive';
	return $conditionals;
}

add_action( 'load-themes.php', 'add_theme_caps' );
function add_theme_caps() {
	global $pagenow;

	$roles = array( 'administrator' );

	if ( 'themes.php' == $pagenow && isset( $_GET['activated'] ) ) {
		// Theme is activated
		// add the capability to the roles
		if ( null !== $roles ) {
			foreach ( $roles as $role ) {
				$role = get_role( $role );
				$role->add_cap( 'browse_without_ads' );
			}
		}
	} else {
		// Theme is deactivated
		// Remove the capacity when theme is deactivated
		if ( null !== $roles ) {
			foreach ( $roles as $role ) {
				$role = get_role( $role );
				$role->remove_cap( 'browse_without_ads' );
			}
		}
	}
}

add_filter( 'acm_output_html_after_tokens_processed', 'acm_no_ad_users', 10, 2 );
function acm_no_ad_users( $output_html, $tag_id = null ) {

	if ( 'TopRight' === $tag_id ) {
		// get the support nav item if there is not an ad
		$default_top_right = '';
		if ( ! current_user_can( 'browse_without_ads' ) ) {
			$placeholder = '';
		} else {
			$placeholder = ' appnexus-ad-placeholder';
		}
		$default_top_right .= '<div class="appnexus-ad ad-topright ad-support' . $placeholder . '">';
		if ( current_user_can( 'browse_without_ads' ) ) {
			$default_top_right .= '<div class="ad-overlay">AD: ' . $tag_id . '</div>';
		}
		if ( current_user_can( 'browse_without_ads' ) || '' === $output_html ) {
			$default_top_right .=
			'<nav id="navigation-support" class="special-navigation" role="navigation">' .
				'<h2>Support MinnPost</h2>' .
				wp_nav_menu(
					array(
						'theme_location' => 'support_minnpost',
						'menu_id' => 'support-minnpost',
						'depth' => 1,
						'container' => false,
						'walker' => new Minnpost_Walker_Nav_Menu,
						'echo' => false,
					)
				) .
			'</nav></div>';
		} else {
			$default_top_right = $output_html;
		}
		return $default_top_right;
	}
	//return $output_html;
	if ( ! current_user_can( 'browse_without_ads' ) ) {
		return $output_html;
	} else {
		if ( 'appnexus_head' === $tag_id ) {
			return '';
		} else {
			return '<div class="appnexus-ad appnexus-ad-placeholder ad-' . sanitize_title( $tag_id ) . '">AD: ' . $tag_id . '</div>';
		}
	}
}

add_filter( 'acm_display_ad_codes_without_conditionals', '__return_true' );

add_filter( 'acm_ad_code_count', 'minnpost_acm_ad_count' );
function minnpost_acm_ad_count( $adcount ) {
	$adcount = 110;
	return $adcount;
}
