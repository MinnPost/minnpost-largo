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
		'table' => 'Appnexus_ACM_WP_List_Table'
	);
	return $providers;
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

add_filter( 'acm_output_html_after_tokens_processed', 'minnpost_no_ad_users', 10, 2 );
function minnpost_no_ad_users( $output_html, $tag_id = NULL ) {

	if ( $tag_id === 'TopRight' && $output_html === '' ) {
		// get the support nav item if there is not an ad
		if ( ! current_user_can( 'browse_without_ads' ) ) {
			$placeholder = '';
		} else {
			$placeholder = ' appnexus-ad-placeholder';
			$placeholder = '';
		}
		$default_top_right =
		'<div class="appnexus-ad ad-topright ad-support' . $placeholder . '">
			<nav id="navigation-support" class="special-navigation" role="navigation">' .
				wp_nav_menu(
					array(
						'theme_location' => 'support_minnpost',
						'menu_id' => 'support-minnpost',
						'depth' => 1,
						'container' => false,
						'walker' => new Minnpost_Walker_Nav_Menu,
						'echo' => false
					)
				) . 
			'</nav>
		</div>';
		return $default_top_right;
	}

	if ( ! current_user_can( 'browse_without_ads' ) ) {
		return $output_html;
	} else {
		if ( $tag_id === 'appnexus_head' ) {
			return '';
		} else {
			return '<div class="appnexus-ad appnexus-ad-placeholder ad-'. sanitize_title( $tag_id ) . '">AD: ' . $tag_id . '</div>';
		}
	}
}

add_filter( 'acm_display_ad_codes_without_conditionals', '__return_true' );