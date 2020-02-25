<?php
/**
 * Extra methods.
 * I think we probably should try to use this less than we do.
 *
 * @package MinnPost Largo
 */

/**
* Method for checking if a post has the supplied category as its primary
*
* @param int $category
*
* @return bool $has_primary_category
*/
if ( ! function_exists( 'has_primary_category' ) ) :
	function has_primary_category( $category ) {
		$has_primary_category = false;
		if ( is_singular( 'post' ) ) {
			$primary_category = get_post_meta( get_the_id(), '_category_permalink', true );
			if ( isset( $primary_category['category'] ) && '' !== $primary_category['category'] ) {
				//$has_primary_category = true;
				$category_object = get_category_by_slug( $category );
				if ( ! is_object( $category_object ) ) {
					return $has_primary_category;
				}
				$cat_id = $category_object->term_id;
				if ( (int) $cat_id === (int) $primary_category['category'] ) {
					$has_primary_category = true;
				}
			}
		}
		return $has_primary_category;
	}
endif;

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
			$highlighted = preg_filter( '/' . preg_quote( $sr, '/' ) . '/i', '<span class="a-search-highlight">$0</span>', $text );
			if ( ! empty( $highlighted ) ) {
				$text = $highlighted;
			}
		}
		return $text;
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
 * default editor for certain posts
 */
if ( ! function_exists( 'minnpost_set_default_editor' ) ) :
	add_filter( 'wp_default_editor', 'minnpost_set_default_editor' );
	function minnpost_set_default_editor( $editor ) {
		//$screen = get_current_screen();

		if ( is_admin() ) {
			global $post;
			if ( is_object( $post ) && isset( $post->ID ) ) {
				$id       = $post->ID;
				$use_html = get_post_meta( $id, '_mp_post_use_html_editor', true );
				if ( 'on' === $use_html ) {
					$editor = 'html';
				} else {
					$editor = 'tinymce';
				}
			}
		}

		return $editor;
	}
endif;

/**
 * Use ElasticPress for Zoninator zone queries
 * @param array $args
 * @return array $args
 */
if ( ! function_exists( 'minnpost_zoninator_elasticpress' ) ) :
	add_filter( 'zoninator_recent_posts_args', 'minnpost_zoninator_elasticpress' );
	function minnpost_zoninator_elasticpress( $args ) {
		if ( 'production' === VIP_GO_ENV ) {
			$args['es'] = true; // elasticsearch on production only
		}
		return $args;
	}
endif;

/**
 * Use ElasticPress for message queries
 * @param array $args
 * @return array $args
 */
if ( ! function_exists( 'minnpost_message_args' ) ) :
	add_filter( 'wp_message_inserter_post_args', 'minnpost_message_args' );
	function minnpost_message_args( $args ) {
		if ( 'production' === VIP_GO_ENV ) {
			$args['es'] = true; // elasticsearch on production only
		}
		return $args;
	}
endif;

/**
 * Turn off the view count because we don't use it anyway
 * @param bool $status
 * @return bool false
 */
if ( ! function_exists( 'minnpost_turn_off_popular_views' ) ) :
	add_filter( 'pop_set_post_view', 'minnpost_turn_off_popular_views' );
	function minnpost_turn_off_popular_views( $status ) {
		return false;
	}
endif;

/**
 * Set external domains allowed for redirects
 * @param array $hosts
 * @return array $hosts
 */
add_filter( 'allowed_redirect_hosts', function( $hosts ) {
	$hosts[] = 'members.minnpost.com';
	$hosts[] = 'support.minnpost.com';
	$hosts[] = 'givemn.org';
	return $hosts;
});

wpcom_vip_load_gutenberg( false );

/**
 * Prevent VIP Support users from being redirected to /user/login. They can use wp-login.php.
 * @param boolean $skip_login_redirect
 * @return boolean $skip_login_redirect
 */
if ( ! function_exists( 'minnpost_prevent_login_redirect' ) ) :
	add_filter( 'user_account_management_skip_login_redirect', 'minnpost_prevent_login_redirect', 10, 1 );
	function minnpost_prevent_login_redirect( $skip_login_redirect ) {
		if ( defined( 'A8C_PROXIED_REQUEST' ) && true === A8C_PROXIED_REQUEST ) {
			// The request originates from WordPress.com VIP (Automattic)
			$skip_login_redirect = true;
		}
		return $skip_login_redirect;
	}
endif;

/**
 * Check to see if we're on a membership URL
 * @return bool
 */
if ( ! function_exists( 'is_membership' ) ) :
	function is_membership() {
		global $wp_query;
		return ( isset( $wp_query->query['is_membership'] ) && true === $wp_query->query['is_membership'] );
	}
endif;

// use the WP Core send_frame_options_header method to apply x-frame-options: sameorigin
if ( function_exists( 'send_frame_options_header' ) ) :
	add_action( 'send_headers', 'send_frame_options_header', 10, 0 );
endif;
