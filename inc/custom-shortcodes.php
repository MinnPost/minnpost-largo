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

		if ( '' !== $args['newsletter'] ) {
			if ( 'dc' === $args['newsletter'] ) {
				return '<div class="m-widget m-widget-form m-form m-form-newsletter-shortcode m-form-newsletter-shortcode-' . $args['newsletter'] . '">
			      <img src="' . get_theme_file_uri() . '/assets/img/dcmemologo-transparent.png" alt="MinnPost D.C. Memo">
			      <div class="m-form-container">
			        <p>For a one-stop source of the most informative, insightful and entertaining coverage coming out of Washington, subscribe to MinnPost&apos;s D.C. Memo.</p>
			        <!-- Begin MailChimp Signup Form -->
			        <form action="//minnpost.us1.list-manage.com/subscribe/post?u=97f7a4b7244e73cbb7fd521b2&amp;id=3631302e9c" class="validate" id="mc-embedded-subscribe-form" method="post" name="mc-embedded-subscribe-form" target="_blank">
			          <input id="mce-EMAILTYPE-0" name="EMAILTYPE" value="html" type="hidden" />
			          <p><small><span class="a-form-required">*</span> indicates required</small></p>
			          <div class="a-mailchimp-message"></div>
			          <div class="m-field-group m-form-item">
			            <label for="mce-EMAIL">Email Address <span class="a-form-required">*</span></label>
			            <input class="required email" id="mce-EMAIL" name="EMAIL" size="60" value="" type="email" required />
			          </div>
			          <div class="m-field-group m-form-item">
			            <label for="mce-FNAME">First Name <span class="a-form-required">*</span></label>
			            <input class="required" id="mce-FNAME" name="FNAME" size="60" value="" type="text" required />
			          </div>
			          <div class="m-field-group m-form-item">
			            <label for="mce-LNAME">Last Name <span class="a-form-required">*</span></label>
			            <input class="required" id="mce-LNAME" name="LNAME" size="60" value="" type="text" required />
			          </div>
			          <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
			          <div style="position: absolute; left: -5000px;"><input name="b_97f7a4b7244e73cbb7fd521b2_3631302e9c" tabindex="-1" value="" type="text" /></div>
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

				//error_log( 'result is ' . print_r( $api_result, true ) );
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