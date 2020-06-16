<?php
/**
 * Theme-specific Methods for The Events Calendar
 *
 * @package MinnPost Largo
 */

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
