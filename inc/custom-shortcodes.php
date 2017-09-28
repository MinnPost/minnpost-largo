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

		if ( '' !== $args['id'] && false !== strpos( $args['id'], 'minnpostspills_widget' ) ) {
			$id = str_replace( 'minnpostspills_widget-', '', $args['id'] );
			$spills = get_option( 'widget_minnpostspills_widget', '' );
			if ( array_key_exists( $id, $spills ) ) {
				$args = $spills[ $id ];
				return the_widget( 'MinnpostSpills_Widget', $args );
			}
		}

	}
endif;
