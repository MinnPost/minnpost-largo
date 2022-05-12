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
	add_action( 'wp_enqueue_scripts', 'minnpost_largo_add_remove_styles', 10 );
	function minnpost_largo_add_remove_styles() {
		// add
		wp_enqueue_style( 'minnpost-fonts', 'https://use.typekit.net/cxj7fzg.css', array(), '1.0.0', 'all' );
		wp_enqueue_style( 'minnpost-style', get_theme_file_uri() . '/style.css', array(), filemtime( get_theme_file_path() . '/style.css' ), 'all' );
		wp_enqueue_style( 'minnpost-style-print', get_theme_file_uri() . '/print.css', array(), filemtime( get_theme_file_path() . '/print.css' ), 'print' );
		// remove
		wp_dequeue_style( 'largo-style' );
		wp_dequeue_style( 'media-credit' );
		wp_dequeue_style( 'widgetopts-styles' );
		wp_dequeue_style( 'popular-widget' );

		if ( is_single() ) {
			$is_liveblog = get_post_meta( get_the_ID(), 'liveblog', true );
			if ( 'enable' === $is_liveblog || 'archive' === $is_liveblog ) {
				$liveblog_css_version = '1.0.3';
				wp_enqueue_style( 'minnpost-liveblog', get_theme_file_uri() . '/assets/css/liveblog.css', array(), $liveblog_css_version, 'all' );
			}
			$css_urls = get_post_meta( get_the_ID(), '_css_file_urls', true );
			if ( '' !== $css_urls ) {
				$css_urls     = explode( "\r\n", $css_urls );
				$code_version = get_post_meta( get_the_ID(), '_extra_code_version', true );
				if ( '' === $code_version ) {
					$code_version = false;
				}
				foreach ( $css_urls as $key => $css_url ) {
					wp_enqueue_style( 'minnpost-css-' . $key . '-' . get_the_ID(), $css_url, array(), $code_version, 'all' );
				}
			}
		}
	}
endif;

/**
* Handle adding and removing of front end CSS for the MinnPost Festival pages only
*
*/
if ( ! function_exists( 'minnpost_largo_festival_styles' ) ) :
	add_action( 'wp_enqueue_scripts', 'minnpost_largo_festival_styles', 10 );
	function minnpost_largo_festival_styles() {
		if ( is_post_type_archive( 'festival' ) || is_singular( 'festival' ) || ( is_singular( 'tribe_ext_speaker' ) && has_term( 'festival', 'tribe_events_cat' ) ) ) {
			wp_dequeue_style( 'minnpost-style' );
			wp_enqueue_style( 'minnpost-festival', get_theme_file_uri() . '/assets/css/festival.css', array(), filemtime( get_theme_file_path() . '/assets/css/festival.css' ), 'all' );
		}
		if ( is_singular( 'tribe_events' ) && has_term( 'festival', 'tribe_events_cat' ) ) {
			$locate = locate_template( 'tribe-events/single-event-festival.php' );
			if ( '' !== $locate ) {
				wp_dequeue_style( 'minnpost-style' );
				wp_enqueue_style( 'minnpost-festival', get_theme_file_uri() . '/assets/css/festival.css', array(), filemtime( get_theme_file_path() . '/assets/css/festival.css' ), 'all' );
			}
		}
	}
endif;

/**
* Handle adding and removing of front end CSS for the MinnPost Tonight pages only
*
*/
if ( ! function_exists( 'minnpost_largo_tonight_styles' ) ) :
	add_action( 'wp_enqueue_scripts', 'minnpost_largo_tonight_styles', 10 );
	function minnpost_largo_tonight_styles() {
		if ( is_post_type_archive( 'tonight' ) || is_singular( 'tonight' ) || ( is_singular( 'tribe_ext_speaker' ) && has_term( 'tonight', 'tribe_events_cat' ) ) ) {
			wp_dequeue_style( 'minnpost-style' );
			wp_enqueue_style( 'minnpost-tonight', get_theme_file_uri() . '/assets/css/tonight.css', array(), filemtime( get_theme_file_path() . '/assets/css/tonight.css' ), 'all' );
		}
		if ( is_singular( 'tribe_events' ) && has_term( 'tonight', 'tribe_events_cat' ) ) {
			$locate = locate_template( 'tribe-events/single-event-tonight.php' );
			if ( '' !== $locate ) {
				wp_dequeue_style( 'minnpost-style' );
				wp_enqueue_style( 'minnpost-tonight', get_theme_file_uri() . '/assets/css/tonight.css', array(), filemtime( get_theme_file_path() . '/assets/css/tonight.css' ), 'all' );
			}
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
		//wp_add_inline_script( 'jquery-core', '$=jQuery;' ); // this would be nice, but it causes conflict with older scripts
		// add
		//wp_enqueue_script( 'modernizr', get_theme_file_uri() . '/assets/js/modernizr-custom.min.js', array(), '1.0', false );
		//wp_enqueue_script( 'minnpost', get_theme_file_uri() . '/assets/js/minnpost.min.js', array( 'jquery', 'modernizr' ), filemtime( get_theme_file_path() . '/assets/js/minnpost.min.js' ), true );
		if ( class_exists( 'Republication_Tracker_Tool' ) ) {
			wp_enqueue_script( 'republication-tracker-tool-js', plugins_url() . '/republication-tracker-tool/' . 'assets/widget.js', array( 'jquery' ), '1.0', true );
		}
		wp_enqueue_script( 'minnpost', get_theme_file_uri() . '/assets/js/minnpost.min.js', array( 'jquery', 'wp-hooks' ), filemtime( get_theme_file_path() . '/assets/js/minnpost.min.js' ), true );
		// localize
		$params = array(
			'ajaxurl' => admin_url( 'admin-ajax.php' ),
		);
		wp_localize_script( 'minnpost', 'params', $params );

		if ( is_single() ) {
			$js_urls = get_post_meta( get_the_ID(), '_js_file_urls', true );
			if ( '' !== $js_urls ) {
				$js_urls      = explode( "\r\n", $js_urls );
				$js_in_footer = true;
				$code_version = get_post_meta( get_the_ID(), '_extra_code_version', true );
				$js_placement = get_post_meta( get_the_ID(), '_extra_code_js_placement', true );
				if ( '' === $code_version ) {
					$code_version = false;
				}
				if ( 'head' === $js_placement ) {
					$js_in_footer = false;
				}
				foreach ( $js_urls as $key => $js_url ) {
					wp_enqueue_script( 'minnpost-js-' . $key . '-' . get_the_ID(), $js_url, array(), $code_version, $js_in_footer );
				}
			}
		}

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
		// dimension 1: user status dimension
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
		}

		// remove dimension 2: id and dimension 3: post type dimensions if we're not on a singular post
		if ( ! is_singular() ) {
			unset( $dimensions['2'] );
			unset( $dimensions['3'] );
		}

		// Dimension 2: object id
		// Dimension 3: object type.

		// home
		if ( is_front_page() && is_home() ) {
			$dimensions['3'] = 'home';
		}
		// archives
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

		// single post
		// this is the only one that should have dimension 4.
		if ( is_single() && function_exists( 'minnpost_get_category_name' ) ) {
			$post_id         = get_the_ID();
			$dimensions['4'] = minnpost_get_category_name( $post_id );
		} else {
			unset( $dimensions['4'] );
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

/**
* Add inline CSS from a remote URL we're loading via shortcode
*
*/
if ( ! function_exists( 'minnpost_shortcode_styles' ) ) :
	//add_action( 'wp_enqueue_scripts', 'minnpost_shortcode_styles', 10 );
	function minnpost_shortcode_styles() {
		global $post;
		if ( ! is_main_query() || ! is_singular() ) {
			return;
		}
		$result  = array();
		$pattern = get_shortcode_regex();
		if ( preg_match_all( '/' . $pattern . '/s', $post->post_content, $matches ) && in_array( 'minnpost_load_remote_url', $matches[2], true ) ) {
			$keys   = array();
			$result = array();
			foreach ( $matches[0] as $key => $value ) {
				// $matches[3] return the shortcode attribute as string
				// replace space with '&' for parse_str() function
				$get = str_replace( ' ', '&', $matches[3][ $key ] );
				parse_str( $get, $output );

				//get all shortcode attribute keys
				$keys     = array_unique( array_merge( $keys, array_keys( $output ) ) );
				$result[] = $output;
			}
			if ( ! empty( $keys ) && ! empty( $result ) ) {
				// Loop the result array and add the missing shortcode attribute key
				foreach ( $result as $key => $value ) {
					// Loop the shortcode attribute key
					foreach ( $keys as $attr_key ) {
						$result[ $key ][ $attr_key ] = isset( $result[ $key ][ $attr_key ] ) ? $result[ $key ][ $attr_key ] : null;
					}
					//sort the array key
					ksort( $result[ $key ] );
					if ( ! isset( $result[ $key ]['url'] ) ) {
						unset( $result[ $key ] );
						continue;
					}
				}
			}
			$result = array_values( $result );
			$url    = $result[0]['url'];
			$cache  = filter_var( $result[0]['cache'], FILTER_VALIDATE_BOOLEAN );
			$css    = minnpost_load_shortcode_string( $url, 'css', $cache );
			if ( '' !== $css ) {
				wp_add_inline_style( 'minnpost-style', $css );
			}
		}
	}
endif;

/**
* Add inline JavaScript from a remote URL we're loading via shortcode
*
*/
if ( ! function_exists( 'minnpost_shortcode_scripts' ) ) :
	//add_action( 'wp_enqueue_scripts', 'minnpost_shortcode_scripts', 10 );
	function minnpost_shortcode_scripts() {
		global $post;
		if ( ! is_main_query() || ! is_singular() ) {
			return;
		}
		$result  = array();
		$pattern = get_shortcode_regex();
		if ( preg_match_all( '/' . $pattern . '/s', $post->post_content, $matches ) && in_array( 'minnpost_load_remote_url', $matches[2], true ) ) {
			$keys   = array();
			$result = array();
			foreach ( $matches[0] as $key => $value ) {
				// $matches[3] return the shortcode attribute as string
				// replace space with '&' for parse_str() function
				$get = str_replace( ' ', '&', $matches[3][ $key ] );
				parse_str( $get, $output );

				//get all shortcode attribute keys
				$keys     = array_unique( array_merge( $keys, array_keys( $output ) ) );
				$result[] = $output;
			}
			if ( ! empty( $keys ) && ! empty( $result ) ) {
				// Loop the result array and add the missing shortcode attribute key
				foreach ( $result as $key => $value ) {
					// Loop the shortcode attribute key
					foreach ( $keys as $attr_key ) {
						$result[ $key ][ $attr_key ] = isset( $result[ $key ][ $attr_key ] ) ? $result[ $key ][ $attr_key ] : null;
					}
					//sort the array key
					ksort( $result[ $key ] );
					if ( ! isset( $result[ $key ]['url'] ) ) {
						unset( $result[ $key ] );
						continue;
					}
				}
			}
			$result = array_values( $result );
			$url    = $result[0]['url'];
			$cache  = filter_var( $result[0]['cache'], FILTER_VALIDATE_BOOLEAN );
			$js     = minnpost_load_shortcode_string( $url, 'js', $cache );
			if ( '' !== $js ) {
				wp_add_inline_script( 'minnpost', $js );
			}
		}
	}
endif;
