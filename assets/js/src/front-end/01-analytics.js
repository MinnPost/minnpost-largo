/**
 * This is used to cause Google Analytics events to run
 *
 * This file does not require jQuery.
 *
 */

 function mpAnalyticsCheckAnalyticsVersion() {
	var version = '';
	if ( 'undefined' !== typeof analytics_tracking_settings && 'undefined' !== typeof analytics_tracking_settings.analytics_type ) {
		if ( 'gtagjs' === analytics_tracking_settings.analytics_type && 'function' === typeof gtag ) {
			version = 'gtag';
		} else if ( 'analyticsjs' === analytics_tracking_settings.analytics_type && 'function' === typeof ga ) {
			version = 'ga';
		}
	}
	return version;
}

function mpAnalyticsTrackingEvent( type, category, action, label, value, non_interaction ) {
	var version = mpAnalyticsCheckAnalyticsVersion();
	if ( 'gtag' === version ) {
		// Sends the event to the Google Analytics property with
		// tracking ID GA_MEASUREMENT_ID set by the config command in
		// the global tracking snippet.
		// example: gtag('event', 'play', { 'event_category': 'Videos', 'event_label': 'Fall Campaign' });
		var params = {
			'event_category': category,
			'event_label': label
		};
		if ( 'undefined' !== typeof value ) {
			params.value = value;
		}
		if ( 'undefined' !== typeof non_interaction ) {
			params.non_interaction = non_interaction;
		}
		gtag( type, action, params );
	} else if ( 'ga' === version ) {
		// Uses the default tracker to send the event to the
		// Google Analytics property with tracking ID GA_MEASUREMENT_ID.
		// example: ga('send', 'event', 'Videos', 'play', 'Fall Campaign');
		// noninteraction seems to have been working like this in analytics.js.
		if ( non_interaction == 1 ) {
			value = { 'nonInteraction': 1 };
		}
		if ( 'undefined' === typeof value ) {
			ga( 'send', type, category, action, label );
		} else {
			ga( 'send', type, category, action, label, value );
		}
	}
}

document.addEventListener( 'DOMContentLoaded', function( event ) {
	if ( 'undefined' !== typeof minnpost_membership_data && '' !== minnpost_membership_data.url_access_level ) {
		var type = 'event';
		var category = 'Member Content';
		var label = location.pathname; // i think we could possibly put some grouping here, but we don't necessarily have access to one and maybe it's not worthwhile yet
		var action = 'Blocked';
		if ( true === minnpost_membership_data.current_user.can_access ) {
			action = 'Shown';
		}
		mpAnalyticsTrackingEvent( type, category, action, label );
	}
} );
