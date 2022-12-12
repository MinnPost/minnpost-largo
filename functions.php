<?php

// child theme can now use get_theme_file_path()

// use parent styles?
/*
add_action( 'wp_enqueue_scripts', 'enqueue_parent_styles' );
function enqueue_parent_styles() {
	wp_enqueue_style( 'parent-style', get_theme_file_path().'/style.min.css' );
}*/

$theme = wp_get_theme();
define( 'THEME_VERSION', $theme->Version ); // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

/**
 * Composer Libraries
 */
require get_theme_file_path() . '/vendor/autoload.php';

/**
 * Site data the theme can use
 */
require get_theme_file_path() . '/inc/get-site-data.php';

/**
 * Custom settings
 */
require get_theme_file_path() . '/inc/custom-settings.php';

/**
 * User account functionality
 */
require get_theme_file_path() . '/inc/user-accounts.php';

/**
 * Custom content types
 */
require get_theme_file_path() . '/inc/custom-types.php';

/**
 * Custom fields for this theme.
 */
require get_theme_file_path() . '/inc/custom-fields.php';

/**
 * Custom forms for this theme.
 */
require get_theme_file_path() . '/inc/custom-forms.php';

/**
 * Custom shortcodes for this theme.
 */
require get_theme_file_path() . '/inc/custom-shortcodes.php';

/**
 * Implement the Custom Header feature.
 */
// require get_theme_file_path() . '/inc/custom-header.php';

/**
 * Custom template functions for this theme.
 */
require get_theme_file_path() . '/inc/template-functions.php';

/**
 * Menu functions and filters
 */
require get_theme_file_path() . '/inc/menu-functions.php';

/**
 * Custom template tags for this theme.
 */
require get_theme_file_path() . '/inc/template-tags.php';

/**
 * Meta tags for the theme
 */
require get_theme_file_path() . '/inc/meta.php';

/**
 * File uploads
 */
require get_theme_file_path() . '/inc/uploads.php';

/**
 * Custom functions for emails the site sends.
 */
require get_theme_file_path() . '/inc/site-emails.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_theme_file_path() . '/inc/extras.php';

/**
 * Custom sidebars
 */
require get_theme_file_path() . '/inc/sidebars.php';

/**
 * Custom Queries
 */
require get_theme_file_path() . '/inc/custom-queries.php';

/**
 * Comment settings and such
 */
require get_theme_file_path() . '/inc/comments.php';

/**
 * Comment list
 */
require get_theme_file_path() . '/inc/comment-list.php';

/**
 * Widgets
 */
require get_theme_file_path() . '/inc/widgets/widget-filter.php';
require get_theme_file_path() . '/inc/widgets/glean.php';
require get_theme_file_path() . '/inc/widgets/picked-for-you.php';

/**
 * Custom ad providers for the ad-code-manager plugin
 */
require get_theme_file_path() . '/inc/custom-ad-providers.php';

/**
 * JavaScript and CSS
 */
require get_theme_file_path() . '/inc/custom-scripts-and-styles.php';

/**
 * Settings for PWA (progressive web app) plugin
 */
require get_theme_file_path() . '/inc/pwa.php';

/**
 * Settings for Apple News
 */
require get_theme_file_path() . '/inc/apple-news.php';

/**
 * Settings for robots.txt
 */
require get_theme_file_path() . '/inc/robots.php';

/**
 * The Events Calendar related methods
 */
require get_theme_file_path() . '/inc/events.php';

/**
 * Elasticsearch related methods
 */
require get_theme_file_path() . '/inc/elasticsearch.php';

/**
 * Jetpack related methods
 */
require get_theme_file_path() . '/inc/jetpack.php';

/**
 * Settings for popup plugin, site messages plugin, etc.
 */
require get_theme_file_path() . '/inc/popups-site-messages.php';
