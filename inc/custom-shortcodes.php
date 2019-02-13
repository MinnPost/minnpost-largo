<?php
/**
 * Create custom shortcodes
 *
 *
 * @package MinnPost Largo
 */

/**
* Add widget instance shortcode
*
* @param array $atts
*
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
* Add newsletter embed shortcode
* This allows us to use newsletter form as widgets
*
* @param array $atts
*
*/
if ( ! function_exists( 'newsletter_embed' ) ) :
	add_shortcode( 'newsletter_embed', 'newsletter_embed' );
	function newsletter_embed( $atts ) {
		if ( is_admin() ) {
			return false;
		}
		$args    = shortcode_atts(
			array(
				'newsletter'      => '',
				'confirm_message' => '',
			),
			$atts
		);
		$message = '';
		if ( isset( $_GET['subscribe-message'] ) ) {
			if ( '' === $args['confirm_message'] ) {
				switch ( $_GET['subscribe-message'] ) {
					case 'success-existing':
						$message = __( 'Thanks for updating your email preferences. They will go into effect immediately.', 'minnpost-largo' );
						break;
					case 'success-new':
						$message = __( 'We have added you to the MinnPost mailing list.', 'minnpost-largo' );
						break;
					case 'success-pending':
						$message = __( 'We have added you to the MinnPost mailing list. You will need to click the confirmation link in the email we sent to begin receiving messages.', 'minnpost-largo' );
						break;
					default:
						$message = $args['confirm_message'];
						break;
				}
			} else {
				$message = $args['confirm_message'];
			}
			$message = '<div class="m-form-message m-form-message-info">' . $message . '</div>';
		} else {
			$confirm_message = $args['confirm_message'];
		}
		// Generate a custom nonce value.
		$newsletter_nonce = wp_create_nonce( 'mp_newsletter_form_nonce' );
		if ( '' !== $args['newsletter'] ) {
			if ( 'dc' === $args['newsletter'] ) {
				set_query_var( 'newsletter', 'dc' );
				set_query_var( 'newsletter_nonce', $newsletter_nonce );
				set_query_var( 'redirect_url', get_current_url() . '#form-newsletter-shortcode-' . $args['newsletter'] );
				set_query_var( 'message', $message );
				ob_start();
				$file = get_template_part( 'inc/forms/newsletter', 'shortcode-dc' );
				$html = ob_get_contents();
				ob_end_clean();
				return $html;
			} elseif ( 'default' === $args['newsletter'] ) {
				set_query_var( 'newsletter', 'default' );
				set_query_var( 'newsletter_nonce', $newsletter_nonce );
				set_query_var( 'redirect_url', get_current_url() );
				set_query_var( 'message', $message );
				get_template_part( 'inc/forms/newsletter', 'shortcode' );
			} elseif ( 'full' === $args['newsletter'] ) {
				set_query_var( 'newsletter', 'full' );
				set_query_var( 'newsletter_nonce', $newsletter_nonce );
				set_query_var( 'redirect_url', get_current_url() );
				set_query_var( 'message', $message );
				get_template_part( 'inc/forms/newsletter', 'full' );
			} elseif ( 'full-dc' === $args['newsletter'] ) {
				set_query_var( 'newsletter', 'full-dc' );
				set_query_var( 'newsletter_nonce', $newsletter_nonce );
				set_query_var( 'redirect_url', get_current_url() );
				set_query_var( 'message', $message );
				get_template_part( 'inc/forms/newsletter', 'full-dc' );
			}
		} else {
			set_query_var( 'newsletter', 'email' );
			set_query_var( 'newsletter_nonce', $newsletter_nonce );
			set_query_var( 'redirect_url', get_current_url() );
			set_query_var( 'message', $message );
			set_query_var( 'confirm_message', $confirm_message );
			ob_start();
			$file = get_template_part( 'inc/forms/newsletter', 'shortcode-email' );
			$html = ob_get_contents();
			ob_end_clean();
			return $html;
		}

	}
endif;

/**
* Add column list
* This allows us to display list of categories as shortcode
*
* @param array $atts
*
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
*
*/
if ( ! function_exists( 'mp_sponsors' ) ) :
	add_shortcode( 'mp_sponsors', 'mp_sponsors' );
	function mp_sponsors( $atts, $content ) {
		extract(
			shortcode_atts(
				array(
					'columns'  => '4',
					'image'    => 'yes',
					'title'    => 'yes',
					'link'     => 'yes',
					'bio'      => 'yes',
					'show'     => '',
					'orderby'  => '',
					'order'    => '',
					'category' => '',
				),
				$atts
			)
		);

		global $post;

		if ( '' === $category ) {
			$category = 'all';
		}
		if ( '' === $orderby ) {
			$orderby = 'rand';
		}
		if ( '' === $order ) {
			$order = 'asc';
		}
		if ( 'all' !== $category ) {
			$args = array(
				'post_type'      => 'cr3ativsponsor',
				'posts_per_page' => $show,
				'order'          => $order,
				'orderby'        => $orderby,
				'tax_query'      => array(
					array(
						'taxonomy' => 'cr3ativsponsor_level',
						'field'    => 'slug',
						'terms'    => array( $category ),
					),
				),
				'ep_integrate'             => true,
			);
		} else {
			$args = array(
				'post_type'      => 'cr3ativsponsor',
				'order'          => $order,
				'orderby'        => $orderby,
				'posts_per_page' => $show,
				'ep_integrate'             => true,
			);
		}

		$sponsors = new WP_Query( $args );

		$output       = '';
		$temp_title   = '';
		$temp_link    = '';
		$temp_excerpt = '';
		$temp_image   = '';

		if ( '1' === $columns ) {
			$columns_class = 'columns-one';
		} elseif ( '2' === $columns ) {
			$columns_class = 'columns-two';
		} elseif ( '3' === $columns ) {
			$columns_class = 'columns-three';
		} else {
			$columns_class = 'columns-four';
		}

		$output .= '<ul class="a-sponsor-list a-sponsor-list-' . $columns_class . '">';
		if ( $sponsors->have_posts( $args ) ) :
			while ( $sponsors->have_posts() ) :
				$sponsors->the_post();
				$temp_title      = get_the_title( $post->ID );
				$temp_sponsorurl = get_post_meta( $post->ID, 'cr3ativ_sponsorurl', true );
				$temp_excerpt    = get_post_meta( $post->ID, 'cr3ativ_sponsortext', true );
				$image_data      = get_minnpost_post_image( 'sponsor-thumbnail', array( 'location' => 'footer' ), $post->ID );
				$temp_image      = $image_data['markup'];
				$output         .= '<li class="a-sponsor">';

				if ( 'yes' === $link ) {
					$output .= '<a href="' . $temp_sponsorurl . '">';
				}
				if ( 'yes' === $title ) {
					$output .= '<h2 class="cr3_sponsorname">' . $temp_title . '</h2>';
				}
				if ( 'yes' === $image ) {
					$output .= '<figure>';
					if ( 'yes' === $bio ) {
						$output .= '<figcaption>' . $temp_excerpt . '</figcaption>';
					}
					$output .= $temp_image;
					$output .= '</figure>';
				} else {
					if ( 'yes' === $bio ) {
						$output .= '<p>' . $temp_excerpt . '</p>';
					}
				}

				if ( 'yes' === $link ) {
					$output .= '</a>';
				}
				$output .= '</li>';
			endwhile;
		endif;
		$output .= '</ul>';
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
*
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
		if ( class_exists( 'User_Account_Management' ) ) {
			$account_management = User_Account_Management::get_instance();
			$can_access         = $account_management->check_user_permissions( $user_id );
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
				$attributes['topics_query'] = new WP_Query(
					array(
						'category__in' => array_keys( $attributes['reading_topics'] ),
					)
				);

			}
		}

		return $account_management->get_template_html( 'account-info', 'front-end', $attributes );
	}
endif;
