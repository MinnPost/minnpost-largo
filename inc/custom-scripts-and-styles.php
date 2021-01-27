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
* todo: we should figure out if the above is still true on VIP
*
*/
if ( ! function_exists( 'minnpost_largo_add_remove_styles' ) ) :
	add_action( 'wp_print_styles', 'minnpost_largo_add_remove_styles', 10 );
	function minnpost_largo_add_remove_styles() {
		// add
		wp_enqueue_style( 'minnpost-fonts', 'https://use.typekit.net/cxj7fzg.css', array(), '1.0.0', 'all' );
		wp_enqueue_style( 'minnpost-style', get_theme_file_uri() . '/style.css', array(), filemtime( get_theme_file_path() . '/style.css' ), 'all' );
		wp_enqueue_style( 'minnpost-style-print', get_theme_file_uri() . '/print.css', array(), filemtime( get_theme_file_path() . '/print.css' ), 'print' );
		// remove
		wp_dequeue_style( 'largo-style' );
		wp_dequeue_style( 'media-credit' );
		wp_dequeue_style( 'widgetopts-styles' );
		wp_dequeue_style( 'minnpost-nimbus' );
		wp_dequeue_style( 'minnpost-donation-progress-widget' );
		wp_dequeue_style( 'popular-widget' );
		wp_dequeue_style( 'creativ_sponsor' );

		$is_liveblog = get_post_meta( get_the_ID(), 'liveblog', true );
		if ( 'enable' === $is_liveblog || 'archive' === $is_liveblog ) {
			wp_enqueue_style( 'minnpost-liveblog', get_theme_file_uri() . '/assets/css/liveblog.css', array(), filemtime( get_theme_file_path() . '/assets/css/liveblog.css' ), 'all' );
		}
	}
endif;

/**
* Handle adding and removing of front end CSS for the MinnPost Festival pages only
*
*/
if ( ! function_exists( 'minnpost_largo_festival_styles' ) ) :
	add_action( 'wp_print_styles', 'minnpost_largo_festival_styles', 10 );
	function minnpost_largo_festival_styles() {
		if ( is_post_type_archive( 'festival' ) || is_singular( 'festival' ) || is_singular( 'tribe_ext_speaker' ) ) {
			wp_dequeue_style( 'minnpost-style' );
			wp_enqueue_style( 'minnpost-festival', get_theme_file_uri() . '/assets/css/festival.css', array(), filemtime( get_theme_file_path() . '/assets/css/festival.css' ), 'all' );
		}
	}
endif;

/**
* Add polyfill for CSS properties
*
*/
if ( ! function_exists( 'minnpost_largo_custom_properties_polyfill' ) ) :
	add_filter( 'wp_head', 'minnpost_largo_custom_properties_polyfill' );
	function minnpost_largo_custom_properties_polyfill() {
		?>
		<script>window.MSInputMethodContext && document.documentMode && document.write('<script src="https://cdn.jsdelivr.net/gh/nuxodin/ie11CustomProperties@4.1.0/ie11CustomProperties.min.js"><\x2fscript>');</script>
		<?php
	}
endif;

/**
* Add typekit to link preconnect
*
*/
if ( ! function_exists( 'minnpost_largo_typekit_head' ) ) :
	add_filter( 'wp_head', 'minnpost_largo_typekit_head' );
	function minnpost_largo_typekit_head() {
		?>
		<link rel="preconnect" href="https://use.typekit.net">
		<?php
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
		//wp_enqueue_script( 'modernizr', get_theme_file_uri() . '/assets/js/modernizr-custom.min.js', array(), '1.0', false );
		//wp_enqueue_script( 'minnpost', get_theme_file_uri() . '/assets/js/minnpost.min.js', array( 'jquery', 'modernizr' ), filemtime( get_theme_file_path() . '/assets/js/minnpost.min.js' ), true );
		wp_enqueue_script( 'minnpost', get_theme_file_uri() . '/assets/js/minnpost.min.js', array( 'jquery' ), filemtime( get_theme_file_path() . '/assets/js/minnpost.min.js' ), true );
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
		wp_enqueue_style( 'custom_wp_admin_css', get_theme_file_uri() . '/admin-style.css', array(), filemtime( get_theme_file_path() . '/admin-style.css' ) );
		wp_enqueue_script( 'minnpost-largo-admin', get_theme_file_uri() . '/assets/js/minnpost-largo-admin.min.js', array( 'jquery' ), filemtime( get_theme_file_path() . '/assets/js/minnpost-largo-admin.min.js' ), true );
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
		if ( function_exists( 'minnpost_membership' ) ) {
			$minnpost_membership = minnpost_membership();
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
		}

		return $dimensions;
	}
endif;

/**
* Filter body class
*
* @param array $classes
* @return array $classes
*
*/
if ( ! function_exists( 'minnpost_largo_body_classes' ) ) :
	add_filter( 'body_class', 'minnpost_largo_body_classes' );
	function minnpost_largo_body_classes( $classes ) {
		global $wp_query;
		$object_id      = $wp_query->get_queried_object_id();
		$category_id    = '';
		$category_group = '';
		if ( is_category() ) {
			$category_id = $object_id;
		}
		if ( is_single() ) {
			$category_id = minnpost_get_permalink_category_id( $object_id );
		}
		$category_group_id = '';
		if ( '' !== $category_id ) {
			$category          = get_category( $category_id );
			$category_group_id = minnpost_get_category_group_id( '', $category_id );
			if ( '' !== $category_group_id ) {
				$category_group = get_category( $category_group_id );
			} else {
				if ( function_exists( 'minnpost_largo_category_groups' ) ) {
					$groups = minnpost_largo_category_groups();
					if ( in_array( $category->slug, $groups, true ) ) {
						$category_group = $category;
					}
				}
			}
			if ( '' !== $category_group ) {
				$classes[] = 'category-group-' . sanitize_title( $category_group->slug );
			}
		}
		return $classes;
	}
endif;
