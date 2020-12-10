<?php
/**
 * Theme-specific Methods for The Events Calendar
 *
 * @package MinnPost Largo
 */

/**
* Handle deregistering event CSS and JS
*/
if ( ! function_exists( 'minnpost_largo_remove_tribe_styles' ) ) :
	add_action( 'wp_enqueue_scripts', 'minnpost_largo_remove_tribe_styles', 9999 );
	function minnpost_largo_remove_tribe_styles() {
		//this is based on using the "skeleton styles" option
		if ( ! is_admin() ) {
			$styles  = array(
				'tribe-events-bootstrap-datepicker-css',
				'tribe-events-calendar-style',
				'tribe-events-custom-jquery-styles',
				'tribe-events-calendar-style',
				'tribe-events-calendar-pro-style',
				'tribe-events-full-calendar-style-css',
				'tribe-common-skeleton-style-css',
				'tribe-tooltip',
				'tribe-accessibility-css',
				'tribe-common-skeleton-style',
				'tribe-events-views-v2-bootstrap-datepicker-styles-css',
				'tribe-events-views-v2-skeleton',
			);
			$scripts = array(
				'tribe-common',
				'tribe-admin-url-fragment-scroll',
				'tribe-buttonset',
				'tribe-dependency',
				'tribe-pue-notices',
				'tribe-validation',
				'tribe-timepicker',
				'tribe-jquery-timepicker',
				'tribe-dropdowns',
				'tribe-attrchange',
				'tribe-bumpdown',
				'tribe-datatables',
				'tribe-migrate-legacy-settings',
				'tribe-admin-help-page',
				'tribe-tooltip-js',
				'mt-a11y-dialog',
				'tribe-dialog-js',
				'tribe-moment',
				'tribe-tooltipster',
				'tribe-events-settings',
				'tribe-events-php-date-formatter',
				'tribe-events-jquery-resize',
				'tribe-events-chosen-jquery',
				'tribe-events-bootstrap-datepicker',
				'tribe-events-ecp-plugins',
				'tribe-events-editor',
				'tribe-events-dynamic',
				'jquery-placeholder',
				'tribe-events-calendar-script',
				'tribe-events-bar',
				'the-events-calendar',
				'tribe-events-ajax-day',
				'tribe-events-list',
				'tribe-query-string',
				'tribe-clipboard',
				'datatables',
				'tribe-select2',
				'tribe-utils-camelcase',
				'tribe-app-shop-js',
				'tribe-events-views-v2-accordion',
				'tribe-events-views-v2-breakpoints',
				'tribe-events-views-v2-datepicker',
				'tribe-events-views-v2-events-bar',
				'tribe-events-views-v2-events-bar-inputs',
				'tribe-events-views-v2-manager',
				'tribe-events-views-v2-month-grid',
				'tribe-events-views-v2-month-mobile-events',
				'tribe-events-views-v2-navigation-scroll',
				'tribe-events-views-v2-multiday-events',
				'tribe-events-views-v2-tooltip',
				'tribe-events-views-v2-viewport',
				'tribe-events-views-v2-view-selector',
			);
			wp_deregister_script( $scripts );
			wp_deregister_style( $styles );
			wp_dequeue_script( $scripts );
			wp_dequeue_style( $styles );
		}
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
		$start_date = minnpost_largo_get_ap_date( tribe_get_start_date( $event_id, false, 'm/d/Y' ) );
		$end_date   = minnpost_largo_get_ap_date( tribe_get_end_date( $event_id, false, 'm/d/Y' ) );
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

/**
* Changes the text labels for Google Calendar and iCal buttons on a single event page
*
*/
if ( ! function_exists( 'minnpost_largo_single_event_links' ) ) :
	if ( ! class_exists( 'tribe' ) ) {
		return;
	}
	remove_action( 'tribe_events_single_event_after_the_content', array( tribe( 'tec.iCal' ), 'single_event_links' ) );
	add_action( 'tribe_events_single_event_after_the_content', 'minnpost_largo_single_event_links' );
	function minnpost_largo_single_event_links() {
		if ( is_single() && post_password_required() ) {
			return;
		}
		echo '<ul class="a-events-cal-links">';
		echo '<li><a class="a-events-gcal" href="' . tribe_get_gcal_link() . '" title="' . __( 'Add to Google Calendar', 'minnpost-largo' ) . '">+ Add to Google Calendar</a></li>';
		echo '<li><a class="a-events-ical" href="' . tribe_get_single_ical_link() . '" title="' . __( 'Export to Calendar', 'minnpost-largo' ) . '">+ Export to Calendar </a></li>';
		echo '</ul>';
	}
endif;