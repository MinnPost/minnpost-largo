<?php
/**
 * Methods for The Events Calendar
 *
 * @package MinnPost Largo
 */

/**
 * Changes Past Event Reverse Chronological Order
 *
 * @param array $template_vars An array of variables used to display the current view.
 *
 * @return array
 */
if ( ! function_exists( 'minnpost_largo_past_reverse_chronological_v2' ) ) :
	// Change List View to Past Event Reverse Chronological Order
	add_filter( 'tribe_events_views_v2_view_list_template_vars', 'minnpost_largo_past_reverse_chronological_v2', 100 );
	// Change Photo View to Past Event Reverse Chronological Order
	add_filter( 'tribe_events_views_v2_view_photo_template_vars', 'minnpost_largo_past_reverse_chronological_v2', 100 );
	function minnpost_largo_past_reverse_chronological_v2( $template_vars ) {
		if ( ! empty( $template_vars['is_past'] ) ) {
			$template_vars['events'] = array_reverse( $template_vars['events'] );
		}
		return $template_vars;
	}
endif;

if ( ! function_exists( 'minnpost_largo_deregister_tribe_styles' ) ) :
	add_action( 'wp_print_styles', 'minnpost_largo_deregister_tribe_styles', 10 );
	function minnpost_largo_deregister_tribe_styles() {
		wp_dequeue_style( 'tribe-events-pro-views-v2-skeleton' );
		wp_dequeue_style( 'tribe-events-pro-views-v2-full' );
		wp_dequeue_style( 'tribe-events-views-v2-skeleton' );
		wp_dequeue_style( 'tribe-events-views-v2-full' );
		wp_dequeue_style( 'tribe-common-skeleton-style' );
		wp_dequeue_style( 'tribe-common-full-style' );
		wp_dequeue_style( 'tribe-common-skeleton-style' );
		wp_dequeue_style( 'tribe-events-views-v2-bootstrap-datepicker-styles' );
		wp_dequeue_style( 'tribe-tooltip' );
		wp_dequeue_style( 'tribe-events-admin-menu' );
	}
endif;

/**
* Modify the columns on the edit events admin page
*
* @param array $columns
* @return array $columns
*
*/
if ( ! function_exists( 'minnpost_largo_event_columns' ) ) :
	add_filter( 'manage_edit-tribe_events_columns', 'minnpost_largo_event_columns' );
	function minnpost_largo_event_columns( $columns ) {
		unset( $columns['tribe_events_cat_permalink'] );
		return $columns;
	}
endif;
