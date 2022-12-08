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
		// this is based on using the "skeleton styles" option
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
				'tribe-events-v2-single-skeleton',
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
* Filter to modify the html that gets added before event data by The Events Calendar.
*
* @param string $before the before HTML value that gets displayed.
* @return string $before
*/
if ( ! function_exists( 'minnpost_largo_events_before_html' ) ) :
	add_filter( 'tribe_events_before_html', 'minnpost_largo_events_before_html', 10, 4 );
	function minnpost_largo_events_before_html( $before ) {
		$before = '';
		return $before;
	}
endif;

if ( ! function_exists( 'minnpost_largo_get_event_title' ) ) :
	add_filter( 'pre_get_document_title', 'minnpost_largo_get_event_title' );
	function minnpost_largo_get_event_title() {
		if ( is_post_type_archive('tribe_events') ) {
			$title = tribe_get_events_title();
			if ( substr( $title, -strlen( ' | ' . get_bloginfo( 'name' ) ) ) !== ' | ' . get_bloginfo( 'name' ) ) {
				$title .= ' | ' . get_bloginfo( 'name' );
			}
			return $title;
		}
	}
endif;

/**
* Whether to override The Event Calendar templating. This shouldn't be necessary, but as of 6.0 it appears that it is.
*
* @param bool $hijack
* @param string $template
* @param object $context
* @param object $query
* @return bool $hijack
* @see https://wordpress.org/support/topic/version-6-0-causes-a-redirect-from-category-page-urls-and-loads-tec-template/
*/
if ( ! function_exists( 'minnpost_largo_event_template_hierarchy' ) ) :
	add_filter( 'tribe_events_views_v2_use_wp_template_hierarchy', 'minnpost_largo_event_template_hierarchy', 10, 4 );
	function minnpost_largo_event_template_hierarchy( $hijack, $template, $context, $query ) {
		$hijack = true;
		if ( is_post_type_archive( 'tribe_events' ) || is_singular( 'tribe_events' ) ) {
			$hijack = false;
		}
		return $hijack;
	}
endif;

/**
* Filter to stop concatenating a JavaScript on VIP Go environments.
*
* @param bool $do_concat
* @param string $handle
* @return bool $do_concat
* @see https://wordpress.org/support/topic/add-another-organizer-button-does-not-work-in-hosted-environment/
*/
if ( ! function_exists( 'minnpost_largo_vip_js_concat_filter' ) ) :
	add_filter( 'js_do_concat', 'minnpost_largo_vip_js_concat_filter', 10, 2 );
	function minnpost_largo_vip_js_concat_filter( $do_concat, $handle ) {
		if ( is_admin() ) {
			// do not include tribe-events-dynamic in concatenated bundles.
			if ( 'tribe-events-dynamic' === $handle ) {
				return false;
			}
		}
		return $do_concat;
	}
endif;

/**
* Filter to stop enqueing event stuff on the front end.
*
* @param bool $should_enqueue_frontend
* @return bool $should_enqueue_frontend
*/
if ( ! function_exists( 'minnpost_largo_do_not_enqueue_event_frontend' ) ) :
	add_filter( 'tribe_events_assets_should_enqueue_frontend', 'minnpost_largo_do_not_enqueue_event_frontend', 30 );
	add_filter( 'tribe_events_views_v2_assets_should_enqueue_frontend', 'minnpost_largo_do_not_enqueue_event_frontend' );
	function minnpost_largo_do_not_enqueue_event_frontend( $should_enqueue_frontend ) {
		if ( ! is_admin() ) {
			$should_enqueue_frontend = false;
		}
		return $should_enqueue_frontend;
	}
endif;

/**
* Modify the columns on the edit events admin page
*
* @param array $columns
* @return array $columns
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
*/
if ( ! function_exists( 'minnpost_largo_full_event_date' ) ) :
	function minnpost_largo_full_event_date( $event_id = '', $args = array() ) {
		if ( '' === $event_id ) {
			$event_id = get_the_ID();
		}
		if ( ! isset( $args['show_full_month_name'] ) || ( isset( $args['show_full_month_name'] ) && true !== $args['show_full_month_name'] ) ) {
			$start_date = minnpost_largo_get_ap_date( tribe_get_start_date( $event_id, false, 'm/d/Y' ) );
			$end_date   = minnpost_largo_get_ap_date( tribe_get_end_date( $event_id, false, 'm/d/Y' ) );
		} else {
			$start_date = tribe_get_start_date( $event_id, false, 'F j, Y' );
			$end_date   = tribe_get_end_date( $event_id, false, 'F j, Y' );
		}
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
		$separator = esc_html__( 'to', 'minnpost-largo' );
		if ( isset( $args['separator'] ) ) {
			$separator = $args['separator'];
		}
		$event_all_day = get_post_meta( $event_id, '_EventAllDay', true );
		if ( 'yes' === $event_all_day ) {
			$time = '';
		} else {
			if ( ( $end_time !== $start_time ) && ( ! isset( $args['show_end_time'] ) || ( isset( $args['show_end_time'] ) && false !== $args['show_end_time'] ) ) ) {
				$time = sprintf(
					// translators: 1) start time, 2) separator, 3) end time, 4) timezone
					__( '%1$s %2$s %3$s%4$s', 'minnpost-largo' ),
					$start_time,
					$separator,
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
		}
		return $time;
	}
endif;

/**
* Changes the text labels for Google Calendar and iCal buttons on a single event page
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
* Get the year for the event website. It's based on the publish date of the directory page.
 *
* @param int $post_id
* @param array $args
* @return int $post_id
*/
if ( ! function_exists( 'minnpost_largo_get_event_year' ) ) :
	function minnpost_largo_get_event_year( $object_type = 'festival', $year = '' ) {
		if ( '' === $year ) {
			$year = gmdate( 'Y' );
		}
		$directory_args  = array(
			'posts_per_page' => 1,
			'post_type'      => $object_type,
			'meta_key'       => $object_type . '_load_as_directory_content',
			'meta_value'     => 'on',
			'year'           => $year,
		);
		$directory_query = new WP_Query( $directory_args );
		if ( $directory_query->have_posts() ) {
			while ( $directory_query->have_posts() ) {
				$directory_query->the_post();
				$year = get_the_date( 'Y' );
			}
		}
		wp_reset_postdata();
		return $year;
	}
endif;

/**
* Set the event website date range based on the specified page slug that contains the events.
 *
* @param string $object_type
* @param string $event_slug
* @return string $output
*/
if ( ! function_exists( 'minnpost_largo_get_event_website_date_range' ) ) :
	function minnpost_largo_get_event_website_date_range( $object_type = 'festival', $event_slug = '' ) {
		$output = '';
		// rewrite the event slug based on the year, if necessary.
		$event_year = minnpost_largo_get_event_year( $object_type, get_the_date( 'Y' ) );

		// check for a settings page with a start and end date.
		$event_site_settings = get_option( 'minnpost_largo_' . $object_type . '_settings', '' );
		if ( '' !== $event_site_settings && is_array( $event_site_settings ) ) {
			if ( isset( $event_site_settings[ 'minnpost_largo_' . $event_year . '_start_date' ] ) ) {
				$start_date = esc_html( $event_site_settings[ 'minnpost_largo_' . $event_year . '_start_date' ] );
			}
			if ( isset( $event_site_settings[ 'minnpost_largo_' . $event_year . '_end_date' ] ) ) {
				$end_date = esc_html( $event_site_settings[ 'minnpost_largo_' . $event_year . '_end_date' ] );
			}
			$start_timestamp = strtotime( $start_date );
			$end_timestamp   = strtotime( $end_date );
			$start_day = minnpost_largo_get_ap_date( $start_date );
			$end_day   = minnpost_largo_get_ap_date( $end_date );
		}
		if ( ! isset( $start_day ) || ! isset( $end_day ) ) {
			// otherwise, use the event start and stop times to generate the dates
			if ( $event_year && gmdate( 'Y' ) !== $event_year ) {
				$event_slug .= '-' . $event_year;
			}
			$post = get_page_by_path( $event_slug, OBJECT, $object_type );
			if ( ! is_object( $post ) ) {
				return $output;
			}
			$event_posts = get_post_meta( $post->ID, '_mp_' . $object_type . '_content_posts', true );
			if ( ! empty( $event_posts ) ) {

				foreach ( $event_posts as $key => $event_post_id ) {
					if ( 'publish' !== get_post_status( $event_post_id ) ) {
						unset( $event_posts[ $key ] );
					}
					$post_year = get_the_date( 'Y', $event_post_id );
					if ( $post_year !== $event_year ) {
						unset( $event_posts[ $key ] );
					}
					if ( empty( $event_posts ) ) {
						return $output;
					}
				}

				$first_event_id = $event_posts[0];
				$last_event_key = array_key_last( $event_posts );
				$last_event_id  = $event_posts[ $last_event_key ];

				$start_timestamp = tribe_get_start_date( $first_event_id, false, 'U' );
				$end_timestamp   = tribe_get_end_date( $last_event_id, false, 'U' );
				$start_date      = tribe_get_start_date( $first_event_id, false, 'c' );
				$end_date        = tribe_get_end_date( $last_event_id, false, 'c' );
				$start_day       = minnpost_largo_get_ap_date( tribe_get_start_date( $first_event_id, false, 'm/d/Y' ) );
				$end_day         = minnpost_largo_get_ap_date( tribe_get_end_date( $last_event_id, false, 'm/d/Y' ) );
			} else {
				return $output;
			}
		}

		if ( $start_day === $end_day ) {
			// same day - 1st April 2012
			// $output = minnpost_largo_get_ap_date( $start_date );
			$date_time = new DateTime( $start_date );
			$output    = $date_time->format( 'F j, Y' );
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
	
		return $output;
	}
endif;

/**
* Set the event ID if it's not the current post ID.
 *
* @param int $post_id
* @param array $args
* @return int $post_id
*/
if ( ! function_exists( 'minnpost_largo_set_event_id' ) ) :
	add_filter( 'minnpost_largo_set_event_id', 'minnpost_largo_set_event_id', 10, 2 );
	function minnpost_largo_set_event_id( $post_id, $args = array() ) {
		if ( isset( $args['object_type'] ) && isset( $args['event_slug'] ) ) {
			$object_type = $args['object_type'];
			$event_slug  = $args['event_slug'];
			$post        = get_page_by_path( $event_slug, OBJECT, $object_type );
			if ( is_object( $post ) ) {
				$post_id = $post->ID;
			}
		} else {
			$object_type = get_post_type( $post_id );
		}

		$event_posts = get_post_meta( $post_id, '_mp_' . $object_type . '_content_posts', true );
		if ( ! empty( $event_posts ) ) {
			foreach ( $event_posts as $key => $event_post_id ) {
				if ( 'publish' !== get_post_status( $event_post_id ) ) {
					unset( $event_posts[ $key ] );
				}
			}
			if ( ! empty( $event_posts[0] ) ) {
				$first_event_id = $event_posts[0];
				// $last_event_key = array_key_last( $event_posts );
				// $last_event_id  = $event_posts[ $last_event_key ];
				$post_id = $first_event_id;
			}
		}
		return $post_id;
	}
endif;

/**
* Get the info for the event website page logo
 *
* @param string $object_type
* @return array $event_logo_info
*/
if ( ! function_exists( 'minnpost_largo_get_event_website_logo_info' ) ) :
	function minnpost_largo_get_event_website_logo_info( $object_type = 'festival' ) {
		$post_id         = 0;
		$is_current_url  = false;
		$event_year      = minnpost_largo_get_event_year( $object_type, get_the_date( 'Y' ) );
		$event_logo_info = array();
		// check to see if there is a post checked for the event directory page already
		$directory_args  = array(
			'posts_per_page' => 1,
			'post_type'      => $object_type,
			'meta_key'       => $object_type . '_load_as_directory_content',
			'meta_value'     => 'on',
			'year'           => $event_year,
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
			$title = __( 'MinnPost Event Website', 'minnpost-largo' );
		}

		$url = get_post_type_archive_link( $object_type );
		if ( $event_year && gmdate( 'Y' ) !== $event_year ) {
			$url = get_the_permalink( $post_id );
		}

		$event_logo_info = array(
			'url'            => $url,
			'title'          => $title,
			'is_current_url' => $is_current_url,
		);
		return $event_logo_info;
	}
endif;

/**
* Allow events to load if their category has a template
 *
* @param string $type
* @return string $type
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
 *
* @param array $events
* @return array $events
*/
if ( ! function_exists( 'minnpost_event_website_get_speaker_events' ) ) :
	add_filter( 'tribe_ext_tribe_ext_speaker_get_events', 'minnpost_event_website_get_speaker_events', 10, 2 );
	function minnpost_event_website_get_speaker_events( $events, $args ) {
		$args['post_status'] = 'any';
		$args['post_type']   = array( 'tribe_events' );
		$events_query        = new WP_Query( $args );
		return $events_query;
	}
endif;

/**
 * Hook in and register a submenu options page for the Appearance menu.
 */
if ( ! function_exists( 'minnpost_largo_register_festival_options_menu' ) ) :
	add_action( 'cmb2_admin_init', 'minnpost_largo_register_festival_options_menu' );
	function minnpost_largo_register_festival_options_menu() {
		$festival_settings = new_cmb2_box( array(
			'id'           => 'minnpost_largo_festival_settings',
			'title'        => esc_html__( 'Festival Settings', 'minnpost-largo' ),
			'object_types' => array( 'options-page' ),
			'option_key'   => 'minnpost_largo_festival_settings', // The option key and admin menu page slug.
			'parent_slug'  => 'edit.php?post_type=tribe_events', // Make options page a submenu item of the themes menu.
			'capability'   => 'edit_event_website_page', // Cap required to view options-page.
		) );
		$festival_settings->add_field( array(
			'name'    => esc_html__( 'Years', 'minnpost-largo' ),
			'desc'    => esc_html__( 'Enter the years for festival websites, separated by commas, and then save. Fields will be created for each year. Enter the years like this: 2021, 2022,2023. Spaces do not matter.', 'minnpost-largo' ),
			'id'      => 'minnpost_festival_years',
			'type'    => 'text',
			'default' => '',
		) );
		$festival_settings_value = get_option( 'minnpost_largo_festival_settings', '' );
		$festival_years          = isset( $festival_settings_value['minnpost_festival_years'] ) ? $festival_settings_value['minnpost_festival_years'] : '';
		if ( '' !== $festival_years ) {
			$festival_years          = array_map( 'trim', explode( ',', $festival_years ) );
			rsort( $festival_years );
			foreach ( $festival_years as $festival_year ) {
				$start_date_label = sprintf(
					// translators: 1) which year it is
					esc_html__( '%1$s Start Date', 'minnpost-largo' ),
					$festival_year
				);
				$festival_settings->add_field(
					array(
						'name'    => $start_date_label,
						'desc'    => esc_html__( 'Choose or enter the start date for the site header', 'minnpost-largo' ),
						'id'      => 'minnpost_largo_' . $festival_year . '_start_date',
						'type'    => 'text_date',
						'default' => '',
					)
				);
				$end_date_label = sprintf(
					// translators: 1) which year it is
					esc_html__( '%1$s End Date', 'minnpost-largo' ),
					$festival_year
				);
				$festival_settings->add_field(
					array(
						'name'    => $end_date_label,
						'desc'    => esc_html__( 'Choose or enter the end date for the site header', 'minnpost-largo' ),
						'id'      => 'minnpost_largo_' . $festival_year . '_end_date',
						'type'    => 'text_date',
						'default' => '',
					)
				);
				$url_label = sprintf(
					// translators: 1) which year it is
					esc_html__( '%1$s Button URL', 'minnpost-largo' ),
					$festival_year
				);
				$festival_settings->add_field(
					array(
						'name'    => $url_label,
						'desc'    => esc_html__( 'Enter the url for the button', 'minnpost-largo' ),
						'id'      => 'minnpost_largo_' . $festival_year . '_button_url',
						'type'    => 'text',
						'default' => '',
					)
				);
				$text_label = sprintf(
					// translators: 1) which year it is
					esc_html__( '%1$s Button Text', 'minnpost-largo' ),
					$festival_year
				);
				$festival_settings->add_field(
					array(
						'name'    => $text_label,
						'desc'    => esc_html__( 'Enter the text for the button', 'minnpost-largo' ),
						'id'      => 'minnpost_largo_' . $festival_year . '_button_text',
						'type'    => 'text',
						'default' => '',
					)
				);
				$header_image_label = sprintf(
					// translators: 1) which year it is
					esc_html__( '%1$s Header Image', 'minnpost-largo' ),
					$festival_year
				);
				$festival_settings->add_field(
					array(
						'name'       => $header_image_label,
						'desc'       => esc_html__( 'Choose the header image, or enter the URL, from the media library. It is expected to be 350px tall and will be positioned near the top left.', 'minnpost-largo' ),
						'id'         => 'minnpost_largo_' . $festival_year . '_header_image',
						'type'       => 'file',
						'text'       => array(
							'add_upload_file_text' => esc_html__( 'Add Image', 'minnpost-largo' ),
						),
						'query_args' => array(
							// Only allow gif, jpg, or png images
							'type' => array(
								'image/gif',
								'image/jpeg',
								'image/png',
							),
						),
					)
				);
				$landing_page_header_image_label = sprintf(
					// translators: 1) which year it is
					esc_html__( '%1$s Landing Page Header Image', 'minnpost-largo' ),
					$festival_year
				);
				$festival_settings->add_field(
					array(
						'name'       => $landing_page_header_image_label,
						'desc'       => esc_html__( 'For the landing page only: choose the header image, or enter the URL, from the media library. It is expected to be 600px tall and will be positioned near the top left. If no file is selected here, the landing page will use the standard header image.', 'minnpost-largo' ),
						'id'         => 'minnpost_largo_' . $festival_year . '_landing_page_header_image',
						'type'       => 'file',
						'text'       => array(
							'add_upload_file_text' => esc_html__( 'Add Image', 'minnpost-largo' ),
						),
						'query_args' => array(
							// Only allow gif, jpg, or png images
							'type' => array(
								'image/gif',
								'image/jpeg',
								'image/png',
							),
						),
					)
				);
				$header_color_top_label = sprintf(
					// translators: 1) which year it is
					esc_html__( '%1$s Header Background Color Top', 'minnpost-largo' ),
					$festival_year
				);
				$festival_settings->add_field(
					array(
						'name'    => $header_color_top_label,
						'id'      => 'minnpost_largo_' . $festival_year . '_header_color_top',
						'type'    => 'colorpicker',
						'default' => '#ffffff',
						'desc'    => esc_html__( 'The header will use the top and bottom colors in a gradient, unless they are the same.', 'minnpost-largo' ),
					)
				);
				$header_color_bottom_label = sprintf(
					// translators: 1) which year it is
					esc_html__( '%1$s Header Background Color Bottom', 'minnpost-largo' ),
					$festival_year
				);
				$festival_settings->add_field(
					array(
						'name'    => $header_color_bottom_label,
						'id'      => 'minnpost_largo_' . $festival_year . '_header_color_bottom',
						'type'    => 'colorpicker',
						'default' => '#ffffff',
						'desc'    => esc_html__( 'The header will use the top and bottom colors in a gradient, unless they are the same.', 'minnpost-largo' ),
					)
				);
				$disclaimer_label = sprintf(
					// translators: 1) which year it is
					esc_html__( '%1$s Disclaimer Text', 'minnpost-largo' ),
					$festival_year
				);
				$festival_settings->add_field(
					array(
						'name'    => $disclaimer_label,
						'desc'    => esc_html__( 'Enter the disclaimer text for the bottom of the site', 'minnpost-largo' ),
						'id'      => 'minnpost_largo_' . $festival_year . '_disclaimer_text',
						'type'    => 'textarea_small',
						'default' => '',
					)
				);
			}
		}
	}
endif;

/**
* Display a link to buy an event pass
 *
* @param string $object_type
*/
if ( ! function_exists( 'minnpost_event_website_pass_link' ) ) :
	function minnpost_event_website_pass_link( $object_type = 'festival', $args = array() ) {
		echo minnpost_get_event_website_pass_link( $object_type, $args );
	}
endif;


/**
* Get a link to buy an event pass
 *
* @return string $buy_event_pass
*/
if ( ! function_exists( 'minnpost_get_event_website_pass_link' ) ) :
	function minnpost_get_event_website_pass_link( $object_type = 'festival', $args = array() ) {
		$class = 'a-button';
		if ( isset( $args['class'] ) ) {
			$class .= ' ' . $args['class'];
		}
		$event_year = minnpost_largo_get_event_year( $object_type, get_the_date( 'Y' ) );
		if ( 'festival' === $object_type ) {
			$festival_settings = get_option( 'minnpost_largo_festival_settings', '' );
			$label             = '';
			if ( isset( $festival_settings[ 'minnpost_largo_' . $event_year . '_button_text' ] ) ) {
				$label = esc_html( $festival_settings[ 'minnpost_largo_' . $event_year . '_button_text' ] );
			}
			if ( isset( $args['label'] ) ) {
				$label = $args['label'];
			}
			$url = '#';
			if ( isset( $festival_settings[ 'minnpost_largo_' . $event_year . '_button_url' ] ) ) {
				$url = esc_url_raw( $festival_settings[ 'minnpost_largo_' . $event_year . '_button_url' ] );
			}
			$buy_event_pass = sprintf(
				// translators: 1) url to buy a pass, 2) link text, 3) class
				__( '<a href="%1$s" class="%3$s">%2$s</a>', 'minnpost-largo' ),
				$url,
				$label,
				$class
			);
		} elseif ( 'tonight' === $object_type ) {
			$buy_event_pass = sprintf(
				// translators: 1) url to buy a pass, 2) link text
				__( '<a href="%1$s" class="a-button">%2$s</a>', 'minnpost-largo' ),
				esc_url_raw( 'https://www.eventbrite.com/e/minnpost-tonight-tickets-169166105375' ),
				esc_html__( 'Reserve your tickets' )
			);
		}
		return $buy_event_pass;
	}
endif;

/**
* Event category breadcrumb
*/
if ( ! function_exists( 'minnpost_event_category_breadcrumb' ) ) :
	function minnpost_event_category_breadcrumb() {
		global $post;
		$post_id          = isset( $post->ID ) ? $post->ID : '';
		$event_categories = get_the_terms( $post_id, 'tribe_events_cat' );
		if ( ! empty( $event_categories ) ) {
			foreach ( $event_categories as $event_category ) {
				$category_name = $event_category->name;
				if ( 'festival' === $event_category->slug || 'tonight' === $event_category->slug ) {
					$category_link = site_url( '/' . $event_category->slug . '/' );
				} else {
					$category_link = get_term_link( $event_category->term_id, 'tribe_events_cat' );
				}
				echo '<div class="a-breadcrumb a-event-category-name a-event-category-name-' . esc_attr( $event_category->slug ) . '"><a href="' . $category_link . '">' . $category_name . '</a></div>';
			}
		}
	}
endif;

/**
* Returns the category name for a post's main event category
*
* @param int $post_id
* @return string $category_name
*/
if ( ! function_exists( 'minnpost_get_event_category_name' ) ) :
	function minnpost_get_event_category_name( $post_id = '' ) {
		$category_name = '';
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}

		$hide_category = get_post_meta( $post_id, '_mp_remove_category_from_display', true );
		if ( 'on' === $hide_category ) {
			return $category_name;
		}

		$category_id = minnpost_get_permalink_event_category_id( $post_id );
		if ( '' !== $category_id ) {
			$category = get_term( $category_id, 'tribe_events_cat' );
		}

		if ( isset( $category->name ) ) {
			$category_name = $category->name;
		}

		return $category_name;
	}
endif;

/**
* Returns the category slug for a post's main event category
*
* @param int $post_id
* @return string $category_slug
*/
if ( ! function_exists( 'minnpost_get_event_category_slug' ) ) :
	function minnpost_get_event_category_slug( $post_id = '' ) {
		$category_slug = '';
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}

		$hide_category = get_post_meta( $post_id, '_mp_remove_category_from_display', true );
		if ( 'on' === $hide_category ) {
			return $category_slug;
		}

		$category_id = minnpost_get_permalink_event_category_id( $post_id );
		if ( '' !== $category_id ) {
			$category = get_term( $category_id, 'tribe_events_cat' );
		}

		if ( isset( $category->slug ) ) {
			$category_slug = $category->slug;
		}

		return $category_slug;
	}
endif;

/**
* Returns the category ID for a post's permalink event category
*
* @param int $post_id
* @return int $category_id
*/
if ( ! function_exists( 'minnpost_get_permalink_event_category_id' ) ) :
	function minnpost_get_permalink_event_category_id( $post_id = '' ) {
		$category_id = '';
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}
		$category_permalink = get_post_meta( $post_id, '_category_permalink', true );
		if ( null !== $category_permalink && '' !== $category_permalink ) {
			if ( isset( $category_permalink['tribe_events_cat'] ) && '' !== $category_permalink['tribe_events_cat'] ) {
				$category_id = $category_permalink['tribe_events_cat'];
			} else {
				$categories  = get_the_terms( $post_id, 'tribe_events_cat' );
				$category_id = isset( $categories[0] ) ? $categories[0]->term_id : '';
			}
		} else {
			$categories = get_the_terms( $post_id, 'tribe_events_cat' );
			if ( isset( $categories[0] ) && is_object( $categories[0] ) && ! is_wp_error( $categories[0] ) ) {
				$category_id = $categories[0]->term_id;
			}
		}
		return $category_id;
	}
endif;

/**
* Display the disclaimer
 *
* @param string $object_type
*/
if ( ! function_exists( 'minnpost_event_website_disclaimer_text' ) ) :
	function minnpost_event_website_disclaimer_text( $object_type = 'festival' ) {
		echo minnpost_event_website_get_disclaimer_text( $object_type );
	}
endif;


/**
* Get the styled disclaimer text
 *
* @param string $object_type
* @return string $disclaimer_text
*/
if ( ! function_exists( 'minnpost_event_website_get_disclaimer_text' ) ) :
	function minnpost_event_website_get_disclaimer_text( $object_type = 'festival' ) {
		$event_year      = minnpost_largo_get_event_year( $object_type, get_the_date( 'Y' ) );
		$disclaimer_text = '';
		if ( isset( $event_year ) ) {
			$festival_settings = get_option( 'minnpost_largo_festival_settings', '' );
			if ( isset( $festival_settings[ 'minnpost_largo_' . $event_year . '_disclaimer_text' ] ) ) {
				$disclaimer_text = esc_html( $festival_settings[ 'minnpost_largo_' . $event_year . '_disclaimer_text' ] );
			}
		}
		if ( '' !== $disclaimer_text ) {
			$disclaimer_text = '<aside class="a-' . $object_type . '-minnpost-notice"><p>' . $disclaimer_text . '</p></aside>';
		}
		return $disclaimer_text;
	}
endif;

/**
* The speaker picker is broken in current versions of The Event Calendar, so we can add our own.
 *
* @param bool $show_speaker_meta_box
* @return bool $show_speaker_meta_box
*/
if ( ! function_exists( 'minnpost_hide_default_speaker_meta_box' ) ) :
	// add_filter( 'tribe_ext_events_add_tribe_ext_speaker_meta_box', 'minnpost_hide_default_speaker_meta_box' );
	function minnpost_hide_default_speaker_meta_box( $show_speaker_meta_box ) {
		return false;
	}
endif;

/**
* Handle adding and removing of front end CSS for the MinnPost Festival pages only
*/
if ( ! function_exists( 'minnpost_largo_festival_styles' ) ) :
	add_action( 'wp_enqueue_scripts', 'minnpost_largo_festival_styles', 10 );
	function minnpost_largo_festival_styles() {
		if ( is_post_type_archive( 'festival' ) || is_singular( 'festival' ) || ( is_singular( 'tribe_ext_speaker' ) && has_term( 'festival', 'tribe_events_cat' ) ) ) {
			wp_dequeue_style( 'minnpost-style' );
			wp_enqueue_style( 'minnpost-festival', get_theme_file_uri() . '/assets/css/festival.css', array(), filemtime( get_theme_file_path() . '/assets/css/festival.css' ), 'all' );
			$event_year = minnpost_largo_get_event_year( 'festival', get_the_date( 'Y' ) );
			if ( isset( $event_year ) ) {
				$year_css          = '';
				$festival_settings = get_option( 'minnpost_largo_festival_settings', '' );
				if ( isset( $festival_settings[ 'minnpost_largo_' . $event_year . '_header_color_top' ] ) ) {
					$header_color_top = esc_html( $festival_settings[ 'minnpost_largo_' . $event_year . '_header_color_top' ] );
					$year_css        .= '.o-header-festival { background: ' . $header_color_top . ';';
				}
				if ( isset( $festival_settings[ 'minnpost_largo_' . $event_year . '_header_color_bottom' ] ) ) {
					$header_color_bottom = esc_html( $festival_settings[ 'minnpost_largo_' . $event_year . '_header_color_bottom' ] );
				}
				if ( isset( $festival_settings[ 'minnpost_largo_' . $event_year . '_header_image' ] ) ) {
					$header_image = esc_html( $festival_settings[ 'minnpost_largo_' . $event_year . '_header_image' ] );
				}
				if ( isset( $festival_settings[ 'minnpost_largo_' . $event_year . '_landing_page_header_image' ] ) ) {
					$landing_page_header_image = esc_html( $festival_settings[ 'minnpost_largo_' . $event_year . '_landing_page_header_image' ] );
				}
				if ( isset( $header_color_top ) && isset( $header_color_bottom ) && isset( $header_image ) ) {
					$year_css .= 'background: url(' . $header_image . ') no-repeat 24% 100%, linear-gradient(to bottom, ' . $header_color_top . ', ' . $header_color_bottom . ');';
				}
				if ( isset( $festival_settings[ 'minnpost_largo_' . $event_year . '_header_color_top' ] ) ) {
					$year_css .= '}';
				}
				if ( isset( $header_color_top ) && isset( $header_color_bottom ) && isset( $landing_page_header_image ) ) {
					$year_css .= '@media screen and (min-width: 50em) { body.festival-landing-page.festival-' . $event_year . ' .o-header-festival { background: url(' . $landing_page_header_image . ') no-repeat 2% 100%, linear-gradient(to bottom, ' . $header_color_top . ', ' . $header_color_bottom . '); } }';
				}
				if ( '' !== $year_css ) {
					wp_add_inline_style( 'minnpost-festival', $year_css );
				}
			}
		}
		if ( is_singular( 'tribe_events' ) && has_term( 'festival', 'tribe_events_cat' ) ) {
			$locate = locate_template( 'tribe-events/single-event-festival.php' );
			if ( '' !== $locate ) {
				wp_dequeue_style( 'minnpost-style' );
				wp_enqueue_style( 'minnpost-festival', get_theme_file_uri() . '/assets/css/festival.css', array(), filemtime( get_theme_file_path() . '/assets/css/festival.css' ), 'all' );
			}
		}
	}
endif;

/**
* Handle archived MinnPost Festival menus
*/
if ( ! function_exists( 'minnpost_largo_tonight_styles' ) ) :
	add_filter( 'wp_nav_menu_objects', 'minnpost_largo_old_festival_menu', 20, 2 );
	function minnpost_largo_old_festival_menu( $sorted_menu_items, $args ) {
		if ( 'festival' !== $args->theme_location ) {
			return $sorted_menu_items;
		}
		$event_year = minnpost_largo_get_event_year( 'festival', get_the_date( 'Y' ) );
		$event_slug = '';
		if ( $event_year && gmdate( 'Y' ) !== $event_year ) {
			$event_slug .= '-' . $event_year;
		}
		if ( '' !== $event_slug ) {
			foreach ( $sorted_menu_items as $item ) {
				$active_class = sanitize_title( $item->title );
				if ( in_array( 'menu-item-object-festival', $item->classes, true ) ) {
					$item->url = untrailingslashit( $item->url );
					$item->url = trailingslashit( $item->url . '-' . $event_year );
					$item->url = esc_url_raw( $item->url );
				} elseif ( 'festival-passes' === $active_class ) {
					$item->url = '#';
					$festival_settings = get_option( 'minnpost_largo_festival_settings', '' );
					if ( isset( $festival_settings[ 'minnpost_largo_' . $event_year . '_button_url' ] ) ) {
						$item->url = esc_url_raw( $festival_settings[ 'minnpost_largo_' . $event_year . '_button_url' ] );
					}
				}
			}
		}
		return $sorted_menu_items;
	}
endif;


/**
* Handle adding and removing of front end CSS for the MinnPost Tonight pages only
*/
if ( ! function_exists( 'minnpost_largo_tonight_styles' ) ) :
	add_action( 'wp_enqueue_scripts', 'minnpost_largo_tonight_styles', 10 );
	function minnpost_largo_tonight_styles() {
		if ( is_post_type_archive( 'tonight' ) || is_singular( 'tonight' ) || ( is_singular( 'tribe_ext_speaker' ) && has_term( 'tonight', 'tribe_events_cat' ) ) ) {
			wp_dequeue_style( 'minnpost-style' );
			wp_enqueue_style( 'minnpost-tonight', get_theme_file_uri() . '/assets/css/tonight.css', array(), filemtime( get_theme_file_path() . '/assets/css/tonight.css' ), 'all' );
		}
		if ( is_singular( 'tribe_events' ) && has_term( 'tonight', 'tribe_events_cat' ) ) {
			$locate = locate_template( 'tribe-events/single-event-tonight.php' );
			if ( '' !== $locate ) {
				wp_dequeue_style( 'minnpost-style' );
				wp_enqueue_style( 'minnpost-tonight', get_theme_file_uri() . '/assets/css/tonight.css', array(), filemtime( get_theme_file_path() . '/assets/css/tonight.css' ), 'all' );
			}
		}
	}
endif;

/**
* Do any editing to enqueued scripts
 *
 * @param string $hook
*/
if ( ! function_exists( 'minnpost_event_enqueue_scripts' ) ) :
	add_action( 'admin_enqueue_scripts', 'minnpost_event_enqueue_scripts' );
	function minnpost_event_enqueue_scripts( $hook ) {
		$show_speaker_meta_box = apply_filters( 'tribe_ext_events_add_tribe_ext_speaker_meta_box', true );
		if ( false === $show_speaker_meta_box ) {
			// wp_enqueue_style( 'custom_wp_admin_css', get_theme_file_uri() . '/admin-style.css', array(), filemtime( get_theme_file_path() . '/admin-style.css' ) );
			$css = '#event_tribe_ext_speaker {display: none;}';
			wp_add_inline_style( 'custom_wp_admin_css', $css );
		}
		// the festival settings page will fail if we don't enqueue media assets.
		if ( 'tribe_events_page_minnpost_largo_festival_settings' === $hook ) {
			wp_enqueue_media();
		}
	}
endif;

/**
* Load the linked event posts by type if we're using our own field to save them.
 *
* @param array $result
* @param int $post_id
* @param string $post_type
* @return array $result
*/
if ( ! function_exists( 'minnpost_get_linked_event_posts' ) ) :
	add_filter( 'tribe_events_get_linked_posts_by_post_type', 'minnpost_get_linked_event_posts', 10, 3 );
	function minnpost_get_linked_event_posts( $result, $post_id, $post_type ) {
		$speakers = get_post_meta( $post_id, '_tribe_linked_post_tribe_ext_speaker', true );
		if ( is_array( $speakers ) ) {
			$result = array();
			foreach ( $speakers as $speaker_id ) {
				if ( ! is_object( $speaker_id ) ) {
					$speaker  = get_post( $speaker_id );
					$result[] = $speaker;
				}
			}
		}
		return $result;
	}
endif;
