<?php
/**
 * Extra methods.
 * I think we probably should try to use this less than we do.
 *
 * @package MinnPost Largo
 */

/**
* Method for checking if a type matches the type of the current post
*
* @param string $type
*
* @return bool
*/
if ( ! function_exists( 'is_post_type' ) ) :
	function is_post_type( $type ) {
		global $wp_query;
		if ( get_post_type( $wp_query->post->ID ) === $type ) {
			return true;
		}
		return false;
	}
endif;

/**
* Get DOM innerHTML of an element
*
* @param object $element
*
* @return string $inner_html
*/
if ( ! function_exists( 'minnpost_dom_innerhtml' ) ) :
	function minnpost_dom_innerhtml( $element ) {
		$inner_html = '';
		$children   = $element->childNodes;
		foreach ( $children as $child ) {
			$tmp_dom = new DOMDocument();
			$tmp_dom->appendChild( $tmp_dom->importNode( $child, true ) );
			$inner_html .= trim( $tmp_dom->saveHTML() );
		}
		return $inner_html;
	}
endif;

/**
* Expire auth cookie after 1 year. I don't know why it's 1 year.
*
* @param int $expirein
*
* @return int
*/
if ( ! function_exists( 'keep_me_logged_in_for_1_year' ) ) :
	add_filter( 'auth_cookie_expiration', 'keep_me_logged_in_for_1_year' );
	function keep_me_logged_in_for_1_year( $expirein ) {
		return 31556926; // 1 year in seconds
	}
endif;

/**
* Unregister widgets we don't want
* Currently this method is unused.
*/
if ( ! function_exists( 'minnpost_unregister_widgets' ) ) :
	//add_action( 'widgets_init', 'minnpost_unregister_widgets', 11 );
	function minnpost_unregister_widgets() {
		unregister_widget( 'WP_Widget_Pages' );
		unregister_widget( 'WP_Widget_Calendar' );
		unregister_widget( 'WP_Widget_Archives' );
		unregister_widget( 'WP_Widget_Meta' );
		unregister_widget( 'WP_Widget_Search' );
		unregister_widget( 'WP_Widget_Text' );
		unregister_widget( 'WP_Widget_Categories' );
		unregister_widget( 'WP_Widget_Recent_Posts' );
		unregister_widget( 'WP_Widget_Recent_Comments' );
		unregister_widget( 'WP_Widget_RSS' );
		unregister_widget( 'WP_Widget_Tag_Cloud' );
		//unregister_widget( 'WP_Nav_Menu_Widget' );
	}
endif;

/**
* Disable WP's autoformatting on content imported from Drupal
*
*/
if ( ! function_exists( 'disable_autoformatting_old_content' ) ) :
	add_action( 'wp', 'disable_autoformatting_old_content' );
	function disable_autoformatting_old_content() {
		$migrated_date = get_option( 'wp_migrate_timestamp', time() );
		$post_date     = get_post_modified_time( 'U' );
		if ( $migrated_date > $post_date ) {
			$remove_filter = true;
		}
		if ( ! isset( $remove_filter ) || false === $remove_filter ) {
			return;
		}
		remove_filter( 'the_content', 'wpautop' );
	}
endif;

/**
* Remove tagline field from display
*
*/
if ( ! function_exists( 'remove_tagline' ) ) :
	add_filter( 'document_title_parts', 'remove_tagline' );
	function remove_tagline( $title ) {
		if ( isset( $title['tagline'] ) ) {
			unset( $title['tagline'] );
		}
		return $title;
	}
endif;

/**
* Set the document title separator
*
* @param string $sep
*
* @return string $sep
*/
if ( ! function_exists( 'minnpost_document_title_separator' ) ) :
	add_filter( 'document_title_separator', 'minnpost_document_title_separator' );
	function minnpost_document_title_separator( $sep ) {
		$sep = '|';
		return $sep;
	}
endif;

/**
* Remove <head> hooks that we don't need
* Some of these are default; others are added by other plugins
*
*/
if ( ! function_exists( 'minnpost_remove_head_hooks' ) ) :
	function minnpost_remove_head_hooks() {
		add_filter( 'feed_links_show_comments_feed', '__return_false' );
		add_filter( 'the_generator', '__return_false' );
		remove_action( 'wp_head', 'feed_links_extra', 3 );
		remove_action( 'wp_head', 'wlwmanifest_link' );
		remove_action( 'wp_head', 'wp_generator' );
		remove_action( 'wp_head', 'wp_shortlink_wp_head' );
		remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10 );
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		remove_action( 'wp_head', 'largo_customizer_css', 1 );
	}
	minnpost_remove_head_hooks();
endif;

/**
* Easy method to get the current URL
*
* @return string $current_url
*/
if ( ! function_exists( 'get_current_url' ) ) :
	function get_current_url() {
		if ( is_page() || is_single() ) {
			$current_url = wp_get_canonical_url();
		} else {
			global $wp;
			$current_url = home_url( add_query_arg( array(), $wp->request ) );
		}
		return $current_url;
	}
endif;

/**
* Remove the absurd X-Pingback header
*
* @param array $headers
* @param object $wp_query
*
* @return array $headers
*
*/
add_filter('wp_headers', function( $headers, $wp_query ) {
	if ( array_key_exists( 'X-Pingback', $headers ) ) {
		unset( $headers['X-Pingback'] );
	}
	return $headers;
}, 11, 2 );

/**
* Remove the RSD link from <head>
*
*/
add_action( 'wp', function() {
	remove_action( 'wp_head', 'rsd_link' );
}, 11 );

/**
* Easy method to highlight the search string in the search result
*
* @param string $text
*
* @return string $text
*/
if ( ! function_exists( 'highlight_search_results' ) ) :
	// this filter runs on the_excerpt and the_title
	// to highlight inside both locations for search result pages
	add_filter( 'the_excerpt', 'highlight_search_results' );
	add_filter( 'the_title', 'highlight_search_results' );
	function highlight_search_results( $text ) {
		if ( is_search() && ! is_admin() ) {
			$sr          = get_query_var( 's' );
			$highlighted = preg_filter( '/' . preg_quote( $sr ) . '/i', '<span class="a-search-highlight">$0</span>', $text );
			if ( ! empty( $highlighted ) ) {
				$text = $highlighted;
			}
		}
		return $text;
	}
endif;

/**
* Set a cookie for the last time the user visits so we can see what happened since then
*/
if ( ! function_exists( 'minnpost_lastvisit_set_cookie' ) ) :
	add_action( 'init', 'minnpost_lastvisit_set_cookie' );
	function minnpost_lastvisit_set_cookie() {
		if ( is_admin() ) {
			return;
		}
		$current = current_time( 'timestamp', 1 );
		setcookie( 'lastvisit', $current, time() + 60 + 60 * 24 * 7, COOKIEPATH, COOKIE_DOMAIN );
	}
endif;

/**
* Check to see if a post is new since the user last visited
*
* @param int $id
*
* @return bool
*/
if ( ! function_exists( 'is_post_new' ) ) :
	function is_post_new( $id ) {
		// if no cookie then return false
		if ( ! isset( $_COOKIE['lastvisit'] ) || '' === $_COOKIE['lastvisit'] ) {
			return false;
		}
		$lastvisit    = $_COOKIE['lastvisit'];
		$publish_date = get_post_time( 'U', true, $id );
		if ( $publish_date > $lastvisit ) {
			return true;
		}
	}
endif;

/**
 * Redirection Plugin Editor access
 */
if ( ! function_exists( 'redirection_to_editor' ) ) :
	add_filter( 'redirection_role', 'redirection_to_editor' );
	function redirection_to_editor() {
		return 'edit_pages';
	}
endif;

/**
 * Change get_option( 'home' ) and any functions that rely on it to use
 * the value of the WP_HOME constant.
 *
 */
if ( ! function_exists( 'change_get_option_home' ) ) :
	add_filter( 'pre_option_home', 'change_get_option_home' );
	function change_get_option_home( $option ) {
		if ( defined( 'WP_HOME' ) ) {
			return WP_HOME;
		}
		return false;
	}
endif;

/**
 * default editor for certain posts
 */
if ( ! function_exists( 'minnpost_set_default_editor' ) ) :
	add_filter( 'wp_default_editor', 'minnpost_set_default_editor' );
	function minnpost_set_default_editor( $editor ) {
		//$screen = get_current_screen();

		if ( is_admin() ) {
			global $post;
			$id       = $post->ID;
			$use_html = get_post_meta( $id, '_mp_post_use_html_editor', true );
			if ( 'on' === $use_html ) {
				$editor = 'html';
			} else {
				$editor = 'tinymce';
			}
		}

		return $editor;
	}
endif;
