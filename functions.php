<?php

// child theme must use get_stylesheet_directory in place of get_template_directory

// use parent styles?
/*add_action( 'wp_enqueue_scripts', 'enqueue_parent_styles' );
function enqueue_parent_styles() {
   wp_enqueue_style( 'parent-style', get_template_directory_uri().'/style.min.css' );
}*/

/**
 * Composer Libraries
 */
require get_stylesheet_directory() . '/vendor/autoload.php';

/**
 * Menu functionality
 */
require get_stylesheet_directory() . '/inc/menus.php';

/**
 * Custom content types
 */
require get_stylesheet_directory() . '/inc/custom-types.php';

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
require get_stylesheet_directory() . '/inc/extras.php';

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
 * JavaScript
 */
require get_stylesheet_directory() . '/inc/custom-scripts.php';

/**
 * Admin only css
 */
require get_stylesheet_directory() . '/inc/custom-admin-css.php';


/**
 * Load Jetpack compatibility file.
 */
//require get_stylesheet_directory() . '/inc/jetpack.php';
