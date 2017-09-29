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
			return '<div class="newsletter_shortcode_form newsletter_shortcode_form_' . $args['newsletter'] . '">
		      <img src="' . get_stylesheet_directory_uri() . '/assets/img/dcmemologo-transparent.png" alt="MinnPost D.C. Memo">
		      <div class="container">
		        <p>For a one-stop source of the most informative, insightful and entertaining coverage coming out of Washington, subscribe to MinnPost’s D.C. Memo.</p>
		        <!-- Begin MailChimp Signup Form -->
		        <form action="//minnpost.us1.list-manage.com/subscribe/post?u=97f7a4b7244e73cbb7fd521b2&amp;id=3631302e9c" class="validate" id="mc-embedded-subscribe-form" method="post" name="mc-embedded-subscribe-form" target="_blank">
		          <input id="mce-EMAILTYPE-0" name="EMAILTYPE" value="html" type="hidden" />
		          <p><small><span class="form-required">*</span> indicates required</small></p>
		          <div class="minnpost-mailchimp-message" style="display: none; margin: 0 0 1em 0; padding: .5em 1em; background-color: #cdcdd0;"></div>
		          <div class="mc-field-group form-item">
		            <label for="mce-EMAIL">Email Address <span class="form-required">*</span></label>
		            <input class="required email" id="mce-EMAIL" name="EMAIL" size="60" value="" type="email" required />
		          </div>
		          <div class="mc-field-group form-item">
		            <label for="mce-FNAME">First Name <span class="form-required">*</span></label>
		            <input class="required" id="mce-FNAME" name="FNAME" size="60" value="" type="text" required />
		          </div>
		          <div class="mc-field-group form-item">
		            <label for="mce-LNAME">Last Name <span class="form-required">*</span></label>
		            <input class="required" id="mce-LNAME" name="LNAME" size="60" value="" type="text" required />
		          </div>
		          <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
		          <div style="position: absolute; left: -5000px;"><input name="b_97f7a4b7244e73cbb7fd521b2_3631302e9c" tabindex="-1" value="" type="text" /></div>
		          <div class="clear">
		          <button type="submit" name="subscribe" id="mc-embedded-dc-subscribe" class="button next choose">Subscribe</button>
		          </div>
		        </form>
		      </div>
		    </div>';
		}

	}
endif;
