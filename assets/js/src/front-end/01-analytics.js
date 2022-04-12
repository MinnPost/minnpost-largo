/**
 * This is used to cause Google Analytics events to run
 *
 * This file does not require jQuery.
 *
 */

/*
 * Call hooks from other places.
 * This allows other plugins that we maintain to pass data to the theme's analytics method.
*/
if ( typeof wp !== 'undefined' ) {
	wp.hooks.addAction( 'wpMessageInserterAnalyticsEvent', 'minnpostLargo', mpAnalyticsTrackingEvent, 10 );
	wp.hooks.addAction( 'minnpostFormProcessorMailchimpAnalyticsEvent', 'minnpostLargo', mpAnalyticsTrackingEvent, 10 );
}

/*
 * Create a Google Analytics event for the theme. This calls the wp-analytics-tracking-generator action.
 * type: generally this is "event"
 * category: Event Category
 * label: Event Label
 * action: Event Action
 * value: optional
 * non_interaction: optional
*/
function mpAnalyticsTrackingEvent( type, category, action, label, value, non_interaction ) {
	wp.hooks.doAction('wpAnalyticsTrackingGeneratorEvent', type, category, action, label, value, non_interaction);
}

/*
 * When a part of the website is member-specific, create an event for whether it was shown or not.
*/
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
