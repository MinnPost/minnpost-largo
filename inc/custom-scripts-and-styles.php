<?php
/**
 * Custom CSS and JavaScript for this theme
 *
 * @package MinnPost Largo
 */

/**
* Handle adding and removing of front end CSS in this theme
* This also handles whether the CSS should be served as minified based on WP_DEBUG value
* We can't use SCRIPT_DEBUG because our server fails to minify, so we have to keep that set to true, but these files are already minified.
*
*/
if ( ! function_exists( 'minnpost_largo_add_remove_styles' ) ) :
	add_action( 'wp_print_styles', 'minnpost_largo_add_remove_styles', 10 );
	function minnpost_largo_add_remove_styles() {
		// add
		$suffix = ( defined( 'SCRIPT_DEBUG' ) && 'true' === WP_DEBUG ) ? '' : '.min';
		wp_enqueue_style( 'minnpost-style', get_theme_file_uri() . '/style' . $suffix . '.css', array(), filemtime( get_theme_file_path() . '/style' . $suffix . '.css' ), 'all' );
		wp_enqueue_style( 'minnpost-style-print', get_theme_file_uri() . '/print' . $suffix . '.css', array(), filemtime( get_theme_file_path() . '/print' . $suffix . '.css' ), 'print' );
		// remove
		wp_dequeue_style( 'largo-style' );
		wp_dequeue_style( 'media-credit' );
		wp_dequeue_style( 'widgetopts-styles' );
		wp_dequeue_style( 'minnpost-nimbus' );
		wp_dequeue_style( 'minnpost-donation-progress-widget' );
		wp_dequeue_style( 'popular-widget' );
		wp_dequeue_style( 'creativ_sponsor' );
		wp_dequeue_script( 'pum-admin-theme-editor' );

		$is_liveblog = get_post_meta( get_the_ID(), 'liveblog', true );
		if ( 'enable' === $is_liveblog || 'archive' === $is_liveblog ) {
			wp_enqueue_style( 'minnpost-liveblog', get_theme_file_uri() . '/assets/css/liveblog.css', array(), filemtime( get_theme_file_path() . '/assets/css/liveblog.css' ), 'all' );
		}

	}
endif;

/**
* Handle adding and removing of front end JavaScript in this theme
* This also handles whether the JavaScript should be served as minified based on WP_DEBUG value
* We can't use SCRIPT_DEBUG because our server fails to minify, so we have to keep that set to true, but these files are already minified.
*
*/
if ( ! function_exists( 'minnpost_largo_add_remove_scripts' ) ) :
	add_action( 'wp_enqueue_scripts', 'minnpost_largo_add_remove_scripts' );
	function minnpost_largo_add_remove_scripts() {
		// add
		$suffix = ( defined( 'WP_DEBUG' ) && 'true' === WP_DEBUG ) ? '' : '.min';
		wp_enqueue_script( 'modernizr', get_theme_file_uri() . '/assets/js/modernizr-custom' . $suffix . '.js', array(), '1.0', false );
		wp_enqueue_script( 'minnpost', get_theme_file_uri() . '/assets/js/minnpost' . $suffix . '.js', array( 'jquery', 'modernizr' ), filemtime( get_theme_file_path() . '/assets/js/minnpost' . $suffix . '.js' ), true );
		// localize
		$params = array(
			'ajaxurl' => admin_url( 'admin-ajax.php' ),
		);
		wp_localize_script( 'minnpost', 'params', $params );
		// remove
		wp_dequeue_script( 'largo-navigation' );
		wp_dequeue_script( 'popular-widget' );
	}
endif;

/**
* Handle adding and removing of admin JavaScript and CSS in this theme
*
*/
if ( ! function_exists( 'minnpost_admin_style' ) ) :
	add_action( 'admin_enqueue_scripts', 'minnpost_admin_style' );
	function minnpost_admin_style( $hook ) {
		wp_enqueue_style( 'custom_wp_admin_css', get_theme_file_uri() . '/admin-style.css' );
	}
endif;

/**
* Custom dimensions for Google Analytics
*
*/
if ( ! function_exists( 'minnpost_google_analytics_dimensions' ) ) :
	add_action( 'wp_analytics_tracking_generator_custom_dimensions', 'minnpost_google_analytics_dimensions', 10, 1 );
	function minnpost_google_analytics_dimensions( $dimensions ) {
		// user dimension
		$minnpost_membership = MinnPost_Membership::get_instance();
		$user_id             = get_current_user_id();
		if ( 0 !== $user_id ) {
			$user_state = $minnpost_membership->user_info->user_member_level( $user_id )['name'];
			if ( 'Non-member' === $user_state ) {
				$value = 'Logged In Non-Member';
			} else {
				$value = get_bloginfo( 'name' ) . ' ' . $user_state;
			}
		} else {
			$value = 'Not Logged In';
		}
		$dimensions['1'] = $value;

		// remove id and post type dimensions if we're not on a singular post
		if ( ! is_singular() ) {
			unset( $dimensions['2'] );
			unset( $dimensions['3'] );
		}
		if ( is_category() || is_tag() ) {
			// categories and tags
			$term            = get_queried_object();
			$dimensions['2'] = $term->term_id;
			$dimensions['3'] = $term->taxonomy;
		} elseif ( is_author() ) {
			// authors
			$dimensions['2'] = get_queried_object_id();
			$dimensions['3'] = 'author';
		} elseif ( is_date() ) {
			$dimensions['3'] = 'date';
		} elseif ( is_post_type_archive() ) {
			$dimensions['3'] = get_post_type();
		}

		if ( is_single() && function_exists( 'minnpost_get_category_name' ) ) {
			$post_id         = get_the_ID();
			$dimensions['4'] = minnpost_get_category_name( $post_id );
		}

		return $dimensions;
	}
endif;
