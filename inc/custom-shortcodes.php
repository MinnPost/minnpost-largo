<?php
/**
 * Create custom shortcodes
 *
 *
 * @package MinnPost Largo
 */

// add widget instance shortcode
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
			$id = str_replace( strtolower( $spill_type ) . '-', '', $args['id'] );
			$spills = get_option( 'widget_' . strtolower( $spill_type ), '' );
			if ( array_key_exists( $id, $spills ) ) {
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

// add newsletter embed shortcode
if ( ! function_exists( 'newsletter_embed' ) ) :
	add_shortcode( 'newsletter_embed', 'newsletter_embed' );
	function newsletter_embed( $atts ) {
		$args = shortcode_atts(
			array(
				'newsletter' => '',
			),
			$atts
		);
		$message = '';
		if ( isset( $_GET['subscribe-message'] ) ) {
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
					$message = '';
					break;
			}
			$message = '<div class="m-form-message m-form-message-info">' . $message . '</div>';
		}
		// Generate a custom nonce value.
		$newsletter_nonce = wp_create_nonce( 'mp_newsletter_form_nonce' );
		if ( '' !== $args['newsletter'] ) {
			if ( 'dc' === $args['newsletter'] ) {
				return '<div class="m-widget m-widget-form m-form m-form-newsletter-shortcode m-form-newsletter-shortcode-' . $args['newsletter'] . '" id="form-newsletter-shortcode-' . $args['newsletter'] . '">
				<img src="' . get_theme_file_uri() . '/assets/img/dcmemologo-transparent.png" alt="MinnPost D.C. Memo">
				<div class="m-form-container">
					<p>For a one-stop source of the most informative, insightful and entertaining coverage coming out of Washington, subscribe to MinnPost&apos;s D.C. Memo.</p>
					<form action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" method="post">
						<input type="hidden" name="action" value="newsletter_shortcode">
						<input type="hidden" name="mp_newsletter_form_nonce" value="' . $newsletter_nonce . '">
						<input type="hidden" name="redirect_url" value="' . get_current_url() . '#form-newsletter-shortcode-' . $args['newsletter'] . '">
						<input type="hidden" name="newsletters_available[]" value="d89249e207">
						<input type="hidden" name="_newsletters[]" value="d89249e207">
						' . $message . '
						<fieldset>
							<p><small><span class="a-form-required">*</span> indicates required</small></p>
							<div class="m-field-group m-form-item">
								<label for="dc_user_email">Email Address <span class="a-form-required">*</span></label>
								<input class="required email" id="dc_user_email" name="user_email" value="" type="email" required />
								</div>
								<div class="m-field-group m-form-item">
									<label for="dc_first_name">First Name <span class="a-form-required">*</span></label>
									<input class="required" id="dc_first_name" name="first_name" size="60" value="" type="text" required />
								</div>
								<div class="m-field-group m-form-item">
									<label for="dc_last_name">Last Name <span class="a-form-required">*</span></label>
									<input class="required" id="dc_last_name" name="last_name" size="60" value="" type="text" required />
								</div>
							</fieldset>
							<div class="clear">
								<button type="submit" name="subscribe" id="mc-embedded-dc-subscribe" class="a-button a-button-next a-button-choose">Subscribe</button>
							</div>
						</form>
					</div>
				</div>';
			} elseif ( 'default' === $args['newsletter'] ) {
				return '<div class="m-form m-form-in-body m-form-newsletter-shortcode m-form-newsletter-shortcode-' . $args['newsletter'] . '">
					<h2 class="a-form-title">Get MinnPost\'s top stories in your inbox</h2>
					<!-- Begin MailChimp Signup Form -->
			        <form action="//minnpost.us1.list-manage.com/subscribe/post?u=97f7a4b7244e73cbb7fd521b2&amp;id=3631302e9c" class="validate" id="mc-embedded-subscribe-form" method="post" name="mc-embedded-subscribe-form" target="_blank">
			        	<input id="mce-EMAILTYPE-0" name="EMAILTYPE" value="html" type="hidden" />

			        	<div class="a-mailchimp-message"></div>
			          
						<div class="m-field-group m-form-item m-form-item-first-name">
						    <label>First Name</label>
						    <input name="FNAME" required="" type="text">
						</div>
						<div class="m-field-group m-form-item m-form-item-last-name">
						    <label>Last Name</label>
						    <input name="LNAME" required="" type="text">
						</div>
						<div class="m-field-group m-form-item m-form-item-email">
							<label>Email address: </label>
							<input type="email" name="EMAIL" type="email" required />
						</div>
						<div class="m-field-group m-form-item m-form-item-list-choices">
						    <label>
						        <input name="INTERESTS[f88ee8cb3b][]" value="04471b1571" checked="true"
						        type="checkbox"> <span>Daily newsletter</span>
						    </label>
						    <label>
						        <input name="INTERESTS[f88ee8cb3b][]" value="94fc1bd7c9" checked="true"
						        type="checkbox"> <span>Sunday review</span>
						    </label>
						    <label>
						        <input name="INTERESTS[f88ee8cb3b][]" value="ce6fd734b6"
						        type="checkbox"> <span>Greater Minnesota newsletter</span>
						    </label>
						    <label>
						        <input name="INTERESTS[f88ee8cb3b][]" value="d89249e207"
						        type="checkbox"> <span>D.C. Memo</span>
						    </label>
						</div>

						<!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
						<div style="position: absolute; left: -5000px;"><input name="b_97f7a4b7244e73cbb7fd521b2_3631302e9c" tabindex="-1" value="" type="text" /></div>
						<button type="submit" name="subscribe" id="mc-embedded-dc-subscribe" class="a-button a-button-next a-button-choose">Subscribe Now</button>
					</form>
				</div>';
			} elseif ( 'full' === $args['newsletter'] ) {
				$url = str_replace( 'https', 'http', get_rest_url( null, '/form-processor-mc/v1/lists/3631302e9c/interest-categories' ) );
				$form = '';

				$form .= '
				<form id="minnpost-form-' . $args['newsletter'] . '" action="" accept-charset="UTF-8" method="post">
					<fieldset>
						<div class="m-field-group m-form-item m-form-item-email">
							<label>Email address: </label>
							<input type="email" name="EMAIL" type="email" required />
						</div>
						<div class="m-field-group m-form-item m-form-item-first-name">
						    <label>First Name</label>
						    <input name="FNAME" required="" type="text">
						</div>
						<div class="m-field-group m-form-item m-form-item-last-name">
						    <label>Last Name</label>
						    <input name="LNAME" required="" type="text">
						</div>';
				$groups = json_decode( wp_remote_get( $url )['body'] );
				foreach ( $groups->categories as $group ) {
					$id = $group->id;
					$title = $group->title;
					$form .= '
						<div class="m-field-group m-form-checkboxes m-form-newsletters">
							<h3>' . $title . ':</h3>
						</div>
					';
					//<div class="m-field-group m-form-checkboxes m-form-newsletters">
					//	<h3>Subscribe to these regular newsletters:</h3>
					//	<label>
					//		<input name="interests[]" value="" type="checkbox">
					//		Daily Newsletter
					//	</label>
					//</div>
					//<div class="m-field-group m-form-checkboxes m-form-periodic">
					//	<h3>Occasional MinnPost emails:</h3>
					//	<label>
					//		<input name="interests[]" value="" type="checkbox">
					//		Events &amp; member benefits
					//	</label>
					//</div>
				}
				$form .= '</fieldset>
				</form>
				';

				return $form;
			}
		}

	}
endif;

function minnpost_interest_groups( $call, $params ) {
	$result = 'foo';
	return $result;
}

// add column list shortcode
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
			$output .= '<ol class="m-columns m-columns-summary">';
			$term_ids = explode( ',', $args['term_ids'] );
			foreach ( $term_ids as $term_id ) {
				$term = get_term_by( 'id', $term_id, 'category' );
				$output .= '<li>';
				$output .= minnpost_get_term_figure( $term_id, 'thumbnail', true, true, 'figure' );
				$output .= '</li>';
			}
			$output .= '</ol>';
		}
		return $output;
	}
endif;

// add column list shortcode
if ( ! function_exists( 'mp_sponsors' ) ) :
	add_shortcode( 'mp_sponsors', 'mp_sponsors' );
	function mp_sponsors( $atts, $content ) {
		extract(
			shortcode_atts(
				array(
					'columns' => '4',
					'image' => 'yes',
					'title' => 'yes',
					'link'  => 'yes',
					'bio' => 'yes',
					'show' => '',
					'orderby' => '',
					'order' => '',
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
				'post_type' => 'cr3ativsponsor',
				'posts_per_page' => $show,
				'order' => $order,
				'orderby' => $orderby,
				'tax_query' => array(
					array(
						'taxonomy' => 'cr3ativsponsor_level',
						'field' => 'slug',
						'terms' => array( $category ),
					),
				),
			);
		} else {
			$args = array(
				'post_type' => 'cr3ativsponsor',
				'order' => $order,
				'orderby' => $orderby,
				'posts_per_page' => $show,
			);
		}
		query_posts( $args );
		$output = '';
		$temp_title = '';
		$temp_link = '';
		$temp_excerpt = '';
		$temp_image = '';

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
		if ( have_posts( $args ) ) :
			while ( have_posts() ) :
				the_post();
				$temp_title = get_the_title( $post->ID );
				$temp_sponsorurl = get_post_meta( $post->ID, 'cr3ativ_sponsorurl', true );
				$temp_excerpt = get_post_meta( $post->ID, 'cr3ativ_sponsortext', true );
				$image_data = get_minnpost_post_image();
				$temp_image = $image_data['markup'];
				$output .= '<li class="a-sponsor">';

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
		wp_reset_query();
		return $output;
	}

endif;

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
			$can_access = $account_management->check_user_permissions( $user_id );
		} else {
			return;
		}
		// if we are on the current user, or if this user can edit users
		if ( false === $can_access ) {
			return __( 'You do not have permission to access this page.', 'minnpost-largo' );
		}

		$member_level = get_user_meta( $user_id, 'member_level', true );
		if ( '' !== $member_level ) {
			$attributes['member_level_name'] = $member_level;
			$attributes['member_level_value'] = sanitize_title( $member_level );
			if ( 'Non-member' !== $member_level ) {
				$attributes['member_level_value'] = strtolower( substr( $member_level, 9 ) );
			}
		} else {
			$attributes['member_level_name'] = 'Non-member';
			$attributes['member_level_value'] = 'non-member';
		}

		$attributes['user'] = get_userdata( $user_id );
		$attributes['user_meta'] = get_user_meta( $user_id );

		$attributes['reading_topics'] = array();
		if ( isset( $attributes['user_meta']['_reading_topics'] ) ) {
			if ( is_array( maybe_unserialize( $attributes['user_meta']['_reading_topics'][0] ) ) ) {
				$topics = maybe_unserialize( $attributes['user_meta']['_reading_topics'][0] );
				foreach ( $topics as $topic ) {
					$term = get_term_by( 'slug', sanitize_title( $topic ), 'category' );
					if ( false !== $term ) {
						$cat_id = $term->term_id;
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
