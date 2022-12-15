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
if ( 'undefined' !== typeof wp ) {
	// for analytics
	wp.hooks.addAction( 'wpMessageInserterAnalyticsEvent', 'minnpostLargo', mpAnalyticsTrackingEvent, 10 );
	wp.hooks.addAction( 'minnpostFormProcessorMailchimpAnalyticsEvent', 'minnpostLargo', mpAnalyticsTrackingEvent, 10 );
	wp.hooks.addAction( 'minnpostMembershipAnalyticsEvent', 'minnpostLargo', mpAnalyticsTrackingEvent, 10 );
	wp.hooks.addAction( 'minnpostMembershipAnalyticsEcommerceAction', 'minnpostLargo', mpAnalyticsTrackingEcommerceAction, 10 );

	// for data layer to Google Tag Manager
	wp.hooks.addAction( 'wpMessageInserterDataLayerEvent', 'minnpostLargo', mpDataLayerEvent, 10 );
	wp.hooks.addAction( 'minnpostFormProcessorMailchimpDataLayerEvent', 'minnpostLargo', mpDataLayerEvent, 10 );
	wp.hooks.addAction( 'minnpostMembershipDataLayerEcommerceAction', 'minnpostLargo', mpDataLayerEcommerce, 10 );
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
	wp.hooks.doAction( 'wpAnalyticsTrackingGeneratorEvent', type, category, action, label, value, non_interaction );
}

/*
 * Create a datalayer event for the theme using the gtm4wp plugin. This sets the dataLayer object for Google Tag Manager.
 * It should only have data that is not avaialable to GTM by default.
 * dataLayerContent: the object that should be added
*/
function mpDataLayerEvent( dataLayerContent ) {
	if ( 'undefined' !== typeof dataLayer && Object.keys( dataLayerContent ).length !== 0 ) {
		dataLayer.push( dataLayerContent );
	}
}

/*
 * Create a Google Analytics Ecommerce action for the theme. This calls the wp-analytics-tracking-generator action.
 *
*/
function mpAnalyticsTrackingEcommerceAction( type, action, product, step ) {
	wp.hooks.doAction( 'wpAnalyticsTrackingGeneratorEcommerceAction', type, action, product, step );
}

/*
 * Set up dataLayer stuff for ecommerce via Google Tag Manager using the gtm4wp plugin.
 *
*/
function mpDataLayerEcommerce( dataLayerContent ) {
	if ( 'undefined' !== typeof dataLayer && Object.keys( dataLayerContent ).length !== 0 ) {
		dataLayer.push({ ecommerce: null }); // first, make sure there aren't multiple things happening.
		if ( 'undefined' !== typeof dataLayerContent.action && 'undefined' !== typeof dataLayerContent.product ) {
			dataLayer.push({
				event: dataLayerContent.action,
				ecommerce: {
					items: [dataLayerContent.product]
				}
			});
		}
	}
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
