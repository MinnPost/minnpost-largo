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
 * Custom settings
 */
require get_stylesheet_directory() . '/inc/custom-settings.php';

/**
 * Menu functionality
 */
require get_stylesheet_directory() . '/inc/menus.php';

/**
 * User account functionality
 */
require get_stylesheet_directory() . '/inc/user-accounts.php';

/**
 * Custom content types
 */
require get_stylesheet_directory() . '/inc/custom-types.php';

/**
 * Custom fields for this theme.
 */
require get_stylesheet_directory() . '/inc/custom-fields.php';

/**
 * Custom shortcodes for this theme.
 */
require get_stylesheet_directory() . '/inc/custom-shortcodes.php';

/**
 * Implement the Custom Header feature.
 */
//require get_stylesheet_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_stylesheet_directory() . '/inc/template-tags.php';

/**
 * Meta tags for the theme
 */
require get_stylesheet_directory() . '/inc/meta.php';

/**
 * Custom functions for emails the site sends.
 */
require get_stylesheet_directory() . '/inc/site-emails.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_stylesheet_directory() . '/inc/extras.php';

/**
 * Custom sidebars
 */
require get_stylesheet_directory() . '/inc/sidebars.php';

/**
 * Custom Queries
 */
require get_stylesheet_directory() . '/inc/custom-queries.php';

/**
 * Comment settings and such
 */
require get_stylesheet_directory() . '/inc/comments.php';

/**
 * Comment list
 */
require get_stylesheet_directory() . '/inc/comment-list.php';

/**
 * Widgets
 */
require get_stylesheet_directory() . '/inc/widgets/widget-filter.php';
require get_stylesheet_directory() . '/inc/widgets/glean.php';

/**
 * Custom ad providers for the ad-code-manager plugin
 */
require get_stylesheet_directory() . '/inc/custom-ad-providers.php';

/**
 * JavaScript and CSS
 */
require get_stylesheet_directory() . '/inc/custom-scripts-and-styles.php';


/**
 * Load Jetpack compatibility file.
 */
//require get_stylesheet_directory() . '/inc/jetpack.php';
