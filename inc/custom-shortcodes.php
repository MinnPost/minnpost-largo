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
			return 'newsletter is ' . $args['newsletter'];
		}

	}
endif;
