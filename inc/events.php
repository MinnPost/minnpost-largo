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
	function minnpost_largo_full_event_time( $event_id = '', $args = array() ) {
		if ( '' === $event_id ) {
			$event_id = get_the_ID();
		}
		$timezone   = '';
		$start_time = minnpost_largo_get_ap_time( tribe_get_start_date( $event_id, false, 'H:i' ) );
		$end_time   = minnpost_largo_get_ap_time( tribe_get_end_date( $event_id, false, 'H:i' ) );
		if ( isset( $args['show_timezone'] ) && true === $args['show_timezone'] ) {
			$timezone = '&nbsp;' . minnpost_largo_get_timezone( tribe_get_start_date( $event_id, false, 'H:i' ) );
		}
		if ( $end_time !== $start_time ) {
			$time = sprintf(
				// translators: 1) start time, 2) end time, 3) timezone
				__( '%1$s to %2$s%3$s', 'minnpost-largo' ),
				$start_time,
				$end_time,
				$timezone
			);
		} else {
			// translators: 1) start time, 2) timezone
			$time = sprintf(
				'%1$s%2$s',
				$start_time,
				$timezone
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
	if ( ! class_exists( 'Tribe__Events__Main' ) ) {
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

/**
* Set the festival date range based on the specified page slug that contains the events.
* @param string $event_slug
* @return string $output
*
*/
if ( ! function_exists( 'minnpost_largo_get_festival_date_range' ) ) :
	function minnpost_largo_get_festival_date_range( $event_slug = '' ) {
		$output      = '';
		$post        = get_page_by_path( $event_slug, OBJECT, 'festival' );
		$event_posts = get_post_meta( $post->ID, '_mp_festival_content_posts', true );
		if ( ! empty( $event_posts ) ) {

			foreach ( $event_posts as $key => $event_post_id ) {
				if ( 'publish' !== get_post_status( $event_post_id ) ) {
					unset( $event_posts[ $key ] );
				}
			}

			$first_event_id = $event_posts[0];
			$last_event_key = array_key_last( $event_posts );
			$last_event_id  = $event_posts[ $last_event_key ];

			$start_timestamp = tribe_get_start_date( $first_event_id, false, 'U' );
			$end_timestamp   = tribe_get_end_date( $last_event_id, false, 'U' );
			$start_date      = tribe_get_start_date( $first_event_id, false, 'c' );
			$end_date        = tribe_get_end_date( $last_event_id, false, 'c' );

			if ( $start_timestamp === $end_timestamp ) {
				// same day - 1st April 2012
				$output = minnpost_largo_get_ap_date( $start_date );
			} elseif ( gmdate( 'Y-m', $start_timestamp ) === gmdate( 'Y-m', $end_timestamp ) ) {
				// same year and month - 3rd - 21st March 2012
				$output = sprintf(
					// translators: parameters are start and end dates
					esc_html__( '%1$s %2$s &ndash; %3$s, %4$s', 'minnpost-largo' ),
					minnpost_largo_get_ap_date( $start_date, 'month' ),
					minnpost_largo_get_ap_date( $start_date, 'day' ),
					minnpost_largo_get_ap_date( $end_date, 'day' ),
					minnpost_largo_get_ap_date( $start_date, 'year' ),
				);
			} elseif ( gmdate( 'Y', $start_timestamp ) === gmdate( 'Y', $end_timestamp ) ) {
				// same year - 29th January - 2nd February 2012
				$output = sprintf(
					// translators: parameters are start and end dates
					esc_html__( '%1$s &ndash; %2$s, %3$s', 'minnpost-largo' ),
					minnpost_largo_get_ap_date( $start_date, '', 'year' ),
					minnpost_largo_get_ap_date( $end_date, '', 'year' ),
					minnpost_largo_get_ap_date( $start_date, 'year' ),
				);
			} else {
				// completely different - 8th December 2012 - 2nd Janurary 2013
				$output = sprintf(
					// translators: parameters are start and end dates
					esc_html__( '%1$s &ndash; %2$s', 'minnpost-largo' ),
					minnpost_largo_get_ap_date( $start_date ),
					minnpost_largo_get_ap_date( $end_date )
				);
			}
		}
		return $output;
	}
endif;

/**
* Get the info for the festival logo
* @param string $object_type
* @return array $festival_logo_info
*
*/
if ( ! function_exists( 'minnpost_largo_get_festival_logo_info' ) ) :
	function minnpost_largo_get_festival_logo_info( $object_type = 'festival' ) {
		$post_id            = 0;
		$is_current_url     = false;
		$festival_logo_info = array();
		// check to see if there is a post checked for /festival already
		$directory_args  = array(
			'posts_per_page' => 1,
			'post_type'      => $object_type,
			'meta_key'       => $object_type . '_load_as_directory_content',
			'meta_value'     => 'on',
		);
		$directory_query = new WP_Query( $directory_args );
		if ( $directory_query->have_posts() ) {
			global $post;
			$post_id = isset( $post->ID ) ? $post->ID : '';
			$post_id = isset( $directory_query->posts[0]->ID ) ? (int) $directory_query->posts[0]->ID : $post_id;
			$title   = get_the_title( $post_id );
			if ( get_the_ID() === $post_id ) {
				$is_current_url = true;
			}
		}

		if ( 0 === $post_id ) {
			$title = __( 'MinnPost Festival', 'minnpost-largo' );
		}

		$url = get_post_type_archive_link( $object_type );

		$festival_logo_info = array(
			'url'            => $url,
			'title'          => $title,
			'is_current_url' => $is_current_url,
		);
		return $festival_logo_info;
	}
endif;

/**
* Allow events to load if their category has a template
* @param string $type
* @return string $type
*
*/
if ( ! function_exists( 'minnpost_event_category_single_template' ) ) :
	add_filter( 'tribe_events_template', 'minnpost_event_category_single_template', 10, 2 );
	function minnpost_event_category_single_template( $type ) {
		global $post;
		$post_id          = isset( $post->ID ) ? $post->ID : '';
		$event_categories = get_the_terms( $post_id, 'tribe_events_cat' );
		if ( ! empty( $event_categories ) ) {
			foreach ( $event_categories as $event_category ) {
				$slug   = $event_category->slug;
				$locate = locate_template( 'tribe-events/single-event-' . $slug . '.php' );
				if ( '' !== $locate ) {
					return $locate;
				}
			}
		}
		return $type;
	}
endif;

/**
* Edit the events that are returned for a given speaker
* @param array $events
* @return array $events
*
*/
if ( ! function_exists( 'minnpost_festival_get_speaker_events' ) ) :
	add_filter( 'tribe_ext_tribe_ext_speaker_get_events', 'minnpost_festival_get_speaker_events', 10, 2 );
	function minnpost_festival_get_speaker_events( $events, $args ) {
		$args['post_status'] = 'any';
		$args['post_type']   = array( 'tribe_events' );
		$events_query        = new WP_Query( $args );
		return $events_query;
	}
endif;

/**
* Display a link to buy a festival pass
*
*/
if ( ! function_exists( 'minnpost_festival_pass_link' ) ) :
	function minnpost_festival_pass_link() {
		echo minnpost_festival_get_festival_pass_link();
	}
endif;


/**
* Get a link to buy a festival pass
* @return string $buy_festival_pass
*
*/
if ( ! function_exists( 'minnpost_festival_get_festival_pass_link' ) ) :
	function minnpost_festival_get_festival_pass_link() {
		$buy_festival_pass = sprintf(
			// translators: 1) url to buy a festival, 2) link text
			__( '<a href="%1$s" class="a-button">%2$s</a>', 'minnpost-largo' ),
			site_url( '/festival/' ),
			esc_html__( 'Buy a festival pass' )
		);
		return $buy_festival_pass;
	}
endif;

/**
* Event category breadcrumb
*
*/
if ( ! function_exists( 'minnpost_event_category_breadcrumb' ) ) :
	function minnpost_event_category_breadcrumb() {
		global $post;
		$post_id          = isset( $post->ID ) ? $post->ID : '';
		$event_categories = get_the_terms( $post_id, 'tribe_events_cat' );
		if ( ! empty( $event_categories ) ) {
			foreach ( $event_categories as $event_category ) {
				$category_name = $event_category->name;
				if ( 'festival' === $event_category->slug ) {
					$category_link = site_url( '/festival/' );
				} else {
					$category_link = get_term_link( $event_category->term_id, 'tribe_events_cat' );
				}
				echo '<div class="a-breadcrumb a-event-category-name a-event-category-name-' . esc_attr( $event_category->slug ) . '"><a href="' . $category_link . '">' . $category_name . '</a></div>';
			}
		}
	}
endif;
