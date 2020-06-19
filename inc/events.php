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

/**
* Get a full date string
*
* @param int $event_id
* @return string $time
*
*/
if ( ! function_exists( 'minnpost_largo_full_event_date' ) ) :
	function minnpost_largo_full_event_date( $event_id = '' ) {
		if ( '' === $event_id ) {
			$event_id = get_the_ID();
		}
		$start_date = minnpost_largo_get_ap_date( tribe_get_start_date( $event_id, false, 'j-F' ) );
		$end_date   = minnpost_largo_get_ap_date( tribe_get_end_date( $event_id, false, 'j-F' ) );
		if ( $end_date !== $start_date ) {
			$time = sprintf(
				// translators: 1) start date, 2) end date
				__( '%1$s to %2$s', 'minnpost-largo' ),
				$start_date,
				$end_date
			);
		} else {
			$time = sprintf(
				'%1$s',
				$start_date
			);
		}
		return $time;
	}
endif;

/**
* Get a full time string
*
* @param int $event_id
* @return string $time
*
*/
if ( ! function_exists( 'minnpost_largo_full_event_time' ) ) :
	function minnpost_largo_full_event_time( $event_id = '' ) {
		if ( '' === $event_id ) {
			$event_id = get_the_ID();
		}
		$start_time = minnpost_largo_get_ap_time( tribe_get_start_date( $event_id, false, 'H:i' ) );
		$end_time   = minnpost_largo_get_ap_time( tribe_get_end_date( $event_id, false, 'H:i' ) );
		if ( $end_time !== $start_time ) {
			$time = sprintf(
				// translators: 1) start time, 2) end time
				__( '%1$s to %2$s', 'minnpost-largo' ),
				$start_time,
				$end_time
			);
		} else {
			$time = sprintf(
				'%1$s',
				$start_time
			);
		}
		return $time;
	}
endif;
