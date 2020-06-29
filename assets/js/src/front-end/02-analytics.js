/**
 * This is used to cause Google Analytics events to run
 *
 * This file does not require jQuery.
 *
 */

function mpAnalyticsTrackingEvent( type, category, action, label, value ) {
	if ( 'undefined' !== typeof ga ) {
		if ( 'undefined' === typeof value ) {
			ga( 'send', type, category, action, label );
		} else {
			ga( 'send', type, category, action, label, value );
		}
	} else {
		return;
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
