<?php
/**
 * Create custom shortcodes
 *
 * @package MinnPost Largo
 */

/**
 * Add widget instance shortcode
 *
 * @param array $atts
 */
if ( ! function_exists( 'widget_instance' ) ) :
	add_shortcode( 'widget_instance', 'widget_instance' );
	function widget_instance( $atts ) {

		$args = shortcode_atts(
			array(
				'id' => '',
			),
			$atts
		);

		$spill_type = 'MinnpostSpills_Widget';

		if ( '' !== $args['id'] && false !== strpos( $args['id'], strtolower( $spill_type ) ) ) {
			$id     = str_replace( strtolower( $spill_type ) . '-', '', $args['id'] );
			$spills = get_option( 'widget_' . strtolower( $spill_type ), '' );
			if ( is_array( $spills ) && array_key_exists( $id, $spills ) ) {
				$args = $spills[ $id ];
				ob_start();
				the_widget( $spill_type, $args );
				$widget_output = ob_get_contents();
				ob_end_clean();
				echo apply_filters( 'widget_output', $widget_output, strtolower( $spill_type ), $id, $id );
			}
		}

	}
endif;

/**
* Add column list
* This allows us to display list of categories as shortcode
*
* @param array $atts
*/
if ( ! function_exists( 'column_list' ) ) :
	add_shortcode( 'column_list', 'column_list' );
	function column_list( $atts ) {

		$args = shortcode_atts(
			array(
				'term_ids' => '',
			),
			$atts
		);

		$output = '';
		if ( '' !== $args['term_ids'] ) {
			$output  .= '<ol class="m-columns m-columns-summary">';
			$term_ids = explode( ',', $args['term_ids'] );
			foreach ( $term_ids as $term_id ) {
				$term    = get_term_by( 'id', $term_id, 'category' );
				$output .= '<li>';
				$output .= minnpost_get_term_figure( $term_id, 'thumbnail', true, true, 'figure' );
				$output .= '</li>';
			}
			$output .= '</ol>';
		}
		return $output;
	}
endif;

/**
* Sponsor list
* This is for the sponsor list in the footer
* This all depends on the cr3ativ sponsor plugin, which is kind of bad but sufficient.
*
* @param array $atts
* @param string $content
* @return string $output
*/
if ( ! function_exists( 'mp_sponsors' ) ) :
	add_shortcode( 'mp_sponsors', 'mp_sponsors' );
	function mp_sponsors( $atts, $content ) {
		extract(
			shortcode_atts(
				array(
					'display_level'          => 'default',
					'show_level_heading'     => 'no',
					'show_image'             => 'yes',
					'image_size'             => 'full',
					'show_title'             => 'yes',
					'show_link'              => 'yes',
					'show_link_display_text' => 'no',
					'show_excerpt'           => 'no',
					'show_content'           => 'no',
					'category_to_show'       => 'none',
					'category_to_exclude'    => '',
					'show_how_many'          => '-1',
					'orderby'                => '',
					'order'                  => '',
					'year'                   => '',
				),
				$atts
			)
		);

		global $post;
		$taxonomy_name = 'cr3ativsponsor_level';

		if ( '' === $category_to_show ) {
			$category_to_show = 'none';
		}
		if ( '' === $orderby ) {
			$orderby = 'rand';
		}
		if ( '' === $order ) {
			$order = 'asc';
		}
		if ( 'none' !== $category_to_show ) {
			$categories_to_show = explode( ',', $category_to_show );
			$args               = array(
				'post_type'      => 'cr3ativsponsor',
				'posts_per_page' => $show_how_many,
				'order'          => $order,
				'orderby'        => $orderby,
				'tax_query'      => array(
					array(
						'taxonomy' => 'cr3ativsponsor_level',
						'field'    => 'slug',
						'terms'    => $categories_to_show,
					),
				),
			);
		} else {
			$args = array(
				'post_type'      => 'cr3ativsponsor',
				'order'          => $order,
				'orderby'        => $orderby,
				'posts_per_page' => $show_how_many,
				'tax_query'      => array(
					array(
						'taxonomy' => $taxonomy_name,
						'field'    => 'term_id',
						'operator' => 'NOT IN',
						'terms'    => get_terms(
							$taxonomy_name,
							array(
								'fields' => 'ids',
							)
						),
					),
				),
			);
		}
		if ( 'production' === VIP_GO_ENV || ( defined( 'VIP_ENABLE_VIP_SEARCH_QUERY_INTEGRATION' ) && true === VIP_ENABLE_VIP_SEARCH_QUERY_INTEGRATION ) ) {
			$args['es'] = true; // elasticsearch.
		}
		if ( '' !== $year ) {
			$args['year'] = $year;
		}

		$display_level_class = '';
		if ( '1' === $display_level ) {
			$display_level_class = 'level-one';
		} elseif ( '2' === $display_level ) {
			$display_level_class = 'level-two';
		} elseif ( '3' === $display_level ) {
			$display_level_class = 'level-three';
		} elseif ( '4' === $display_level ) {
			$display_level_class = 'level-four';
		}

		$sponsors = new WP_Query( $args );
		$output   = '';

		if ( $sponsors->have_posts() ) {
			if ( 'yes' === $show_level_heading ) {
				$category      = get_term_by( 'slug', $category_to_show, $taxonomy_name );
				$category_name = $category->name;
			}
			if ( isset( $category_name ) ) {
				$output .= '<h2>' . $category_name . '</h2>';
			}
			$output .= '<ul class="a-sponsor-list a-sponsor-list-' . $display_level_class . '">';
			while ( $sponsors->have_posts() ) {
				$sponsors->the_post();

				$output .= '<li class="a-sponsor">';

				$url      = get_post_meta( get_the_ID(), 'cr3ativ_sponsorurl', true );
				$linktext = get_post_meta( get_the_ID(), 'cr3ativ_sponsortext', true );
				$content  = get_the_content();
				$content  = apply_filters( 'the_content', $content );
				$twitter  = get_post_meta( get_the_ID(), 'cr3ativ_sponsortwitter', true );

				if ( 'yes' === $show_link && '' !== $url ) {
					$output .= '<a href="' . $url . '">';
				}

				if ( 'yes' === $show_title ) {
					$output .= '<h2 class="cr3_sponsorname">' . get_the_title() . '</h2>';
				}

				$image_data   = get_minnpost_post_image( '', array( 'location' => 'sponsorlist' ), get_the_ID() );
				$image_markup = isset( $image_data['markup'] ) ? $image_data['markup'] : '';
				$excerpt      = get_post_meta( get_the_ID(), 'cr3ativ_sponsortext', true );
				$excerpt      = apply_filters( 'the_content', $excerpt );
				if ( 'yes' === $show_image ) {
					$output .= '<figure>';
					$output .= $image_markup;
					if ( 'yes' === $show_excerpt && '' !== $excerpt ) {
						$output .= '<figcaption>' . $temp_excerpt . '</figcaption>';
					}
					$output .= '</figure>';
				} else {
					if ( 'yes' === $show_excerpt && '' !== $excerpt ) {
						$output .= $excerpt;
					}
				}

				if ( 'yes' === $show_link && '' !== $url ) {
					$output .= '</a>';
				}

				if ( ( 'yes' === $show_content && '' !== $content ) || ( 'yes' === $show_link && '' !== $url ) ) {
					$output .= '<div class="a-sponsor-content">';
				}

				if ( 'yes' === $show_content && '' !== $content ) {
					$output .= $content;
				}

				if ( '' !== $twitter ) {
					$output .= '<p class="a-sponsor-twitter"><a href="https://twitter.com/' . $twitter . '">@' . $twitter . '</a></p>';
				}

				if ( '' !== $show_link && 'yes' === $show_link_display_text ) {
					$output .= '<p class="a-sponsor-url"><a href="' . $url . '">' . $linktext . '</a></p>';
				}

				if ( ( 'yes' === $show_content && '' !== $content ) || ( 'yes' === $show_link && '' !== $url ) ) {
					$output .= '</div>';
				}

				$output .= '</li>';
			}
			$output .= '</ul>';
			wp_reset_postdata();
		}

		return $output;
	}

endif;

/**
* User Account info shortcode
* This depends on the User Account Management plugin
* We use this for the main user account page
*
* @param array $attributes
* @param string $content
* @return string output of get_template_html from account management plugin
*/
if ( ! function_exists( 'minnpost_account_info' ) ) :
	add_shortcode( 'account-info', 'minnpost_account_info' );
	function minnpost_account_info( $attributes, $content ) {

		if ( ! is_array( $attributes ) ) {
			$attributes = array();
		}

		$user_id = get_query_var( 'users', '' );
		if ( isset( $_GET['user_id'] ) ) {
			$user_id = esc_attr( $_GET['user_id'] );
		} else {
			$user_id = get_current_user_id();
		}

		$can_access = false;
		if ( function_exists( 'user_account_management' ) ) {
			$account_management = user_account_management();
			$can_access         = $account_management->user_data->check_user_permissions( $user_id );
		} else {
			return;
		}
		// if we are on the current user, or if this user can edit users
		if ( false === $can_access ) {
			return __( 'You do not have permission to access this page.', 'minnpost-largo' );
		}

		$member_level = get_user_meta( $user_id, 'member_level', true );
		if ( '' !== $member_level ) {
			$attributes['member_level_name']  = $member_level;
			$attributes['member_level_value'] = sanitize_title( $member_level );
			if ( 'Non-member' !== $member_level ) {
				$attributes['member_level_value'] = strtolower( substr( $member_level, 9 ) );
			}
		} else {
			$attributes['member_level_name']  = 'Non-member';
			$attributes['member_level_value'] = 'non-member';
		}

		$attributes['user']      = get_userdata( $user_id );
		$attributes['user_meta'] = get_user_meta( $user_id );

		$attributes['reading_topics'] = array();
		if ( isset( $attributes['user_meta']['_reading_topics'] ) ) {
			if ( is_array( maybe_unserialize( $attributes['user_meta']['_reading_topics'][0] ) ) ) {
				$topics = maybe_unserialize( $attributes['user_meta']['_reading_topics'][0] );
				foreach ( $topics as $topic ) {
					$term = get_term_by( 'slug', sanitize_title( $topic ), 'category' );
					if ( false !== $term ) {
						$cat_id                                  = $term->term_id;
						$attributes['reading_topics'][ $cat_id ] = $topic;
					}
				}
				$topics_query_args = array(
					'posts_per_page' => 10,
					'category__in'   => array_keys( $attributes['reading_topics'] ),
				);
				if ( 'production' === VIP_GO_ENV || ( defined( 'VIP_ENABLE_VIP_SEARCH_QUERY_INTEGRATION' ) && true === VIP_ENABLE_VIP_SEARCH_QUERY_INTEGRATION ) ) {
					$topics_query_args['es'] = true; // elasticsearch.
				}
				$attributes['topics_query'] = new WP_Query( $topics_query_args );
			}
		}

		return $account_management->get_template_html( 'account-info', 'front-end', $attributes );
	}
endif;

/**
* User Account preferences shortcode
* This depends on the User Account Management plugin
* We use this for the user preferences page
*
* @param array $attributes
* @param string $content
* @return string output of get_template_html from account management plugin
*/
if ( ! function_exists( 'minnpost_account_preferences' ) ) :
	add_shortcode( 'custom-account-preferences-form', 'minnpost_account_preferences' );
	function minnpost_account_preferences( $attributes, $content = null ) {

		if ( ! is_array( $attributes ) ) {
			$attributes = array();
		}

		$user_id = get_query_var( 'users', '' );
		if ( isset( $_GET['user_id'] ) ) {
			$user_id = esc_attr( $_GET['user_id'] );
		} else {
			$user_id = get_current_user_id();
		}

		$can_access = false;
		if ( function_exists( 'user_account_management' ) ) {
			$account_management = user_account_management();
			$can_access         = $account_management->user_data->check_user_permissions( $user_id );
		} else {
			return;
		}
		// if we are on the current user, or if this user can edit users
		if ( false === $can_access ) {
			return __( 'You do not have permission to access this page.', 'minnpost-largo' );
		}

		// this functionality is mostly from https://pippinsplugins.com/change-password-form-short-code/
		// we should use it for this page as well, unless and until it becomes insufficient

		$attributes['current_url'] = get_current_url();
		$attributes['redirect']    = $attributes['current_url'];

		if ( ! is_user_logged_in() ) {
			return __( 'You are not signed in.', 'minnpost-largo' );
		} else {
			// Error messages
			$errors = array();
			if ( isset( $_REQUEST['errors'] ) ) {
				$error_codes = explode( ',', $_REQUEST['errors'] );

				foreach ( $error_codes as $code ) {
					$errors[] = $account_management->get_error_message( $code );
				}
			}
			$attributes['errors'] = $errors;
			if ( isset( $user_id ) && '' !== $user_id ) {
				$attributes['user'] = get_userdata( $user_id );
			} else {
				$attributes['user'] = wp_get_current_user();
			}
			$attributes['user_meta'] = get_user_meta( $attributes['user']->ID );

			$attributes['always_load_comments'] = '';
			if ( isset( $attributes['user_meta']['always_load_comments'] ) ) {
				if ( is_array( maybe_unserialize( $attributes['user_meta']['always_load_comments'][0] ) ) ) {
					$attributes['user_reading_topics']['always_load_comments'] = maybe_unserialize( $attributes['user_meta']['always_load_comments'][0] );
				}
			}

			// todo: this should probably be in the database somewhere
			$attributes['reading_topics'] = array(
				'Arts & Culture'         => __( 'Arts & Culture', 'minnpost-largo' ),
				'Economy'                => __( 'Economy', 'minnpost-largo' ),
				'Education'              => __( 'Education', 'minnpost-largo' ),
				'Environment'            => __( 'Environment', 'minnpost-largo' ),
				'Greater Minnesota news' => __( 'Greater Minnesota news', 'minnpost-largo' ),
				'Health'                 => __( 'Health', 'minnpost-largo' ),
				'MinnPost announcements' => __( 'MinnPost announcements', 'minnpost-largo' ),
				'Opinion/Commentary'     => __( 'Opinion/Commentary', 'minnpost-largo' ),
				'Politics & Policy'      => __( 'Politics & Policy', 'minnpost-largo' ),
				'Sports'                 => __( 'Sports', 'minnpost-largo' ),
			);

			$attributes['user_reading_topics'] = array();
			if ( isset( $attributes['user_meta']['_reading_topics'] ) ) {
				if ( is_array( maybe_unserialize( $attributes['user_meta']['_reading_topics'][0] ) ) ) {
					$topics = maybe_unserialize( $attributes['user_meta']['_reading_topics'][0] );
					foreach ( $topics as $topic ) {
						$attributes['user_reading_topics'][] = $topic;
					}
				}
			}

			return $account_management->get_template_html( 'account-preferences-form', 'front-end', $attributes );

		}
	}
endif;

/**
* Add logo shortcode
*
* @param array $atts
*/
if ( ! function_exists( 'minnpost_logo' ) ) :
	add_shortcode( 'minnpost_logo', 'minnpost_logo' );
	function minnpost_logo( $atts ) {

		$args = shortcode_atts(
			array(
				'position' => 'top',
			),
			$atts
		);

		ob_start();
		get_template_part( 'template-parts/logo', $args['position'] );
		$output = ob_get_contents();
		ob_end_clean();
		return $output;
	}
endif;

/**
* Shortcode to display topics on a page
*
* @param array $atts
*/
if ( ! function_exists( 'minnpost_largo_topics' ) ) :
	add_shortcode( 'topics', 'minnpost_largo_topics' );
	function minnpost_largo_topics( $atts ) {
		$output = '';
		$args   = shortcode_atts(
			array(
				'grouped'   => '0',
				'sponsored' => '0',
			),
			$atts
		);

		$exclude_ids = array();
		$exclusions  = do_shortcode( '[return_excluded_terms]' );
		if ( ! empty( $exclusions ) ) {
			$exclude_ids = str_getcsv( $exclusions, ',', "'" );
		}

		$grouped = filter_var( $args['grouped'], FILTER_VALIDATE_BOOLEAN );
		if ( true === $grouped ) {
			$group_categories  = array();
			$groups            = minnpost_largo_category_groups();
			$include_sponsored = filter_var( $args['sponsored'], FILTER_VALIDATE_BOOLEAN );
			foreach ( $groups as $group ) {
				if ( false === $include_sponsored ) {
					if ( 'sponsored-content' === $group ) {
						continue;
					}
				}
				$category = get_term_by( 'slug', $group, 'category' );
				if ( false !== $category && ! in_array( $category->term_id, $exclude_ids, true ) ) {
					$group_categories[] = $category;
				}
			}
		}

		if ( isset( $group_categories ) ) {
			$output .= '<div class="o-grouped-categories">';
			foreach ( $group_categories as $topic ) {
				$output .= '<section class="m-group-category">';
				$output .= '<h2 class="a-group-category-title">' . $topic->name . '</h2>';
				$args    = array(
					'taxonomy'     => 'category',
					'meta_key'     => '_mp_category_group',
					'meta_value'   => $topic->term_id,
					'meta_compare' => '=',
					'exclude'      => $exclude_ids,
				);
				if ( 'production' === VIP_GO_ENV || ( defined( 'VIP_ENABLE_VIP_SEARCH_QUERY_INTEGRATION' ) && true === VIP_ENABLE_VIP_SEARCH_QUERY_INTEGRATION ) ) {
					$args['es'] = true; // elasticsearch.
				}
				$grouped_query = new WP_Term_Query( $args );
				if ( ! empty( $grouped_query->terms ) ) {
					$output .= '<ol class="a-grouped-categories">';
					foreach ( $grouped_query->terms as $category ) {
						$output .= '<li>';
						$output .= '<a href="' . site_url( $category->slug ) . '" class="a-grouped-category-title">' . $category->name . '</a>';
						$output .= '</li>';
					}
					$output .= '</ol>';
				}
				$output .= '</section>';
			}
			$output .= '</div>';
		}
		return $output;
	}
endif;

/**
* Shortcode to load HTML content from a remote URL
*
* @param array $atts
* @return string $output
*/
if ( ! function_exists( 'minnpost_load_remote_url' ) ) :
	// add_shortcode( 'minnpost_load_remote_url', 'minnpost_load_remote_url' );
	function minnpost_load_remote_url( $atts ) {
		$output = '';
		$args   = shortcode_atts(
			array(
				'url'        => '',
				'cache'      => true,
				'cache_time' => MINUTE_IN_SECONDS * 1,
			),
			$atts
		);

		if ( '' === $args['url'] ) {
			return $output;
		}

		$url    = esc_url_raw( $args['url'] );
		$cache  = filter_var( $args['cache'], FILTER_VALIDATE_BOOLEAN );
		$output = minnpost_load_shortcode_string( $url, 'html', $cache, $args['cache_time'] );

		return $output;
	}
endif;

/**
* Method for loading content from a URL
*
* @param string $url
* @param string $part
* @param bool $cache
* @param string $cache_time
* @return string $output
*/
if ( ! function_exists( 'minnpost_load_shortcode_string' ) ) :
	function minnpost_load_shortcode_string( $url, $part = '', $cache = true, $cache_time = '' ) {
		$output = '';
		$url    = esc_url_raw( $url );
		$cache  = filter_var( $cache, FILTER_VALIDATE_BOOLEAN );
		if ( '' === $cache_time ) {
			$cache_time = MINUTE_IN_SECONDS * 1;
		} else {
			$cache_time = strtotime( $cache_time );
		}

		if ( true === $cache ) {
			if ( '' !== $part ) {
				$cache_part = '_' . $part;
			} else {
				$cache_part = '';
			}
			$cache_key   = md5( 'minnpost_remote_url_content_' . $url . $cache_part );
			$cache_group = 'minnpost';
			$output      = wp_cache_get( $cache_key, $cache_group );
		}

		if ( false === $cache || false === $output ) {
			$response = wp_remote_get( $url );
			if ( ! is_wp_error( $response ) ) {
				$output = wp_remote_retrieve_body( $response );
				libxml_use_internal_errors( true );
				$document = wp_remote_retrieve_body( $response ); // this is the remote HTML file
				// create a new DomDocument object
				$html = new DOMDocument( '1.0', 'UTF-8' );
				// load the HTML into the DomDocument object (this would be your source HTML)
				$html->loadHTML( $document, LIBXML_HTML_NODEFDTD );
				if ( 'html' === $part ) {
					// get all <body> elements
					$body_element = $html->getElementsByTagName( 'body' );
					// it is to be assumed that there is only one <body> element.
					$body = $body_element->item( 0 );
					// get the HTML contained within that body element
					$output = $body->ownerDocument->saveHTML( $body );

					$trim_off_front = strpos( $output, '<body>' ) + 6;
					$trim_off_end   = ( strrpos( $output, '</body>' ) ) - strlen( $output );
					$output         = substr( $output, $trim_off_front, $trim_off_end );
					$output         = apply_filters( 'the_content', $output );
				} elseif ( 'css' === $part ) {
					// get all <style> elements
					$style_element = $html->getElementsByTagName( 'style' );
					// it is to be assumed that there is only one <style> element.
					$style  = $style_element->item( 0 );
					$output = $style->nodeValue;
				} elseif ( 'js' === $part ) {
					$script_element = $html->getElementById( 'script-import' );
					$script         = $script_element;
					$output         = $script->nodeValue;
				}
				if ( true === $cache ) {
					wp_cache_set( $cache_key, $output, $cache_group, $cache_time );
				}
			}
		}
		return $output;
	}
endif;

if ( ! function_exists( 'mp_load_tags' ) ) :
	add_shortcode( 'mp_load_tags', 'mp_load_tags' );
	/**
	 * List posts from tags
	 * By giving a shortcode a list of tags, plus other parameters, we can create a dynamic list of posts from certain tags.
	 *
	 * @param array  $attributes the array of shortcode attributes.
	 * @param string $content the content inside the shortcode.
	 * @return string $output
	 */
	function mp_load_tags( $attributes, $content ) {
		$attributes = shortcode_atts(
			array(
				'tags'                => '', // explode it after.
				'tag_field'           => 'slug',
				'show_tag_image'      => 'no',
				'tag_image_size'      => 'full',
				'show_tag_title'      => 'yes',
				'show_tag_excerpt'    => 'no',
				'show_tag_content'    => 'no',
				'posts_per_tag'       => 10,
				'show_post_image'     => 'no',
				'post_image_size'     => '',
				'show_post_title'     => 'yes',
				'show_post_excerpt'   => 'no',
				'show_post_content'   => 'no',
				'show_post_only_once' => 'no',
				'exclude_opinion'     => 'yes',
			),
			$attributes
		);

		// query values.
		$tags          = array_map( 'trim', explode( ',', $attributes['tags'] ) );
		$tag_field     = $attributes['tag_field'];
		$posts_per_tag = (int) $attributes['posts_per_tag'];

		$output          = '';
		$output_post_ids = array();
		// get the sponsored post group category; we always want to exclude it.
		$sponsored = get_term_by( 'slug', 'sponsored-content', 'category' );

		// optionally remove opinion categories.
		$exclude_term_ids = array();
		if ( 'yes' === $attributes['exclude_opinion'] ) {
			$opinion = get_term_by( 'slug', 'opinion', 'category' );
			// start the WP_Term_Query arguments.
			$term_args    = array(
				'taxonomy'   => 'category',
				'fields'     => 'ids',
				'meta_query' => array(
					array(
						'key'   => '_mp_category_group',
						'value' => $sponsored->term_id,
					),
				),
			);
			$if_term_args = array(
				'meta_query' => array(
					'relation' => 'OR',
					array(
						'key'   => '_mp_category_group',
						'value' => $opinion->term_id,
					),
					array(
						'key'   => '_mp_category_group',
						'value' => $sponsored->term_id,
					),
				),
			);
			// merge the WP_Term_Query args from the if statement.
			$term_args = array_merge( $term_args, $if_term_args );

			// elasticsearch.
			if ( 'production' === VIP_GO_ENV || ( defined( 'VIP_ENABLE_VIP_SEARCH_QUERY_INTEGRATION' ) && true === VIP_ENABLE_VIP_SEARCH_QUERY_INTEGRATION ) ) {
				$term_args['es'] = true;
			}

			// generate a WP_Term_Query from the arguments.
			$term_query       = new WP_Term_Query( $term_args );
			$exclude_term_ids = $term_query->terms;
			// make sure exclude ID array is unique.
			$exclude_term_ids = array_unique( $exclude_term_ids );
			sort( $exclude_term_ids );
		}

		foreach ( $tags as $tag ) {
			if ( null === term_exists( $tag, 'post_tag' ) ) {
				continue;
			}
			$args = array(
				'post_type'        => 'post',
				'tag'              => $tag,
				'posts_per_page'   => $posts_per_tag,
				'post__not_in'     => $output_post_ids,
				'category__not_in' => $exclude_term_ids,
			);
			if ( 'production' === VIP_GO_ENV || ( defined( 'VIP_ENABLE_VIP_SEARCH_QUERY_INTEGRATION' ) && true === VIP_ENABLE_VIP_SEARCH_QUERY_INTEGRATION ) ) {
				$args['es'] = true; // elasticsearch.
			}
			$tag_posts = new WP_Query( $args );
			if ( $tag_posts->have_posts() ) {
				$tag_data = get_term_by( 'slug', $tag, 'post_tag' );
				$output  .= '<section class="o-mp-load-tags">';
				if ( 'yes' === $attributes['show_tag_title'] ) {
					$output .= '<h2>' . $tag_data->name . '</h2>';
				}
				if ( 'yes' === $attributes['show_tag_image'] ) {
					$term_figure = minnpost_get_term_figure( $tag_data->term_id, $attributes['tag_image_size'], false, false, '', true, array(), 'tag', true );
					$output     .= $term_figure;
				}
				if ( 'yes' === $attributes['show_tag_excerpt'] ) {
					$excerpt = minnpost_get_term_text( $tag_data->term_id, 'excerpt', 'tag' );
					if ( '' !== $excerpt ) {
						$output .= $excerpt;
					}
				} elseif ( 'yes' === $attributes['show_tag_content'] ) {
					$content = minnpost_get_term_text( $tag_data->term_id, 'feature', 'tag' );
					if ( '' !== $content ) {
						$output .= $content;
					}
				}
				$output .= '<ul>';
				while ( $tag_posts->have_posts() ) {
					$tag_posts->the_post();
					if ( 'yes' === $attributes['show_post_only_once'] ) {
						$output_post_ids[] = get_the_ID();
					}
					$output .= '<li><a href="' . get_permalink() . '">' . get_the_title() . '</a>';
					$output .= '</li>';
				}
				$output .= '</ul></section>';
			}
		}
		return $output;
	}
endif;
