<?php

// child theme must use get_stylesheet_directory in place of get_template_directory

// use parent styles?
/*add_action( 'wp_enqueue_scripts', 'enqueue_parent_styles' );
function enqueue_parent_styles() {
   wp_enqueue_style( 'parent-style', get_template_directory_uri().'/style.min.css' );
}*/

if ( ! function_exists( 'minnpost_menus' ) ) :
	function minnpost_menus() {
		// Add Your Menu Locations
		register_nav_menus(
			array(
				'footer_primary' => __( 'Footer Primary' ), // main footer. about, advertise, member benefits, etc
				'footer_secondary' => __( 'Footer Secondary' ), // bottom of footer. careers, etc
				'minnpost_network' => __( 'Network Menu' ), // social networks, rss
				'support_minnpost' => __( 'Support Menu' ), // the support box next to the top banner ad
				'secondary_links' => __( 'Secondary' ), // that weird nav next to logo with columns, weather, events, support
				'primary_links' => __( 'Primary' ), // main nav below logo
			)
		);
		unregister_nav_menu( 'menu-1' );
	}

	add_action( 'init', 'minnpost_menus' );

endif;

/**
 * Custom fields for this theme.
 */
require get_stylesheet_directory() . '/inc/custom-fields.php';

/**
 * Implement the Custom Header feature.
 */
//require get_stylesheet_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_stylesheet_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
//require get_stylesheet_directory() . '/inc/extras.php';

/**
 * Custom sidebars
 */
require get_stylesheet_directory() . '/inc/sidebars.php';

/**
 * Widgets
 */
require get_stylesheet_directory() . '/inc/widgets/glean.php';

/**
 * Custom ad providers for the ad-code-manager plugin
 */
require get_stylesheet_directory() . '/inc/custom-ad-providers.php';



/**
 * Load Jetpack compatibility file.
 */
//require get_stylesheet_directory() . '/inc/jetpack.php';
