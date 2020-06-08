function mp_analytics_tracking_event( type, category, action, label, value ) {
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

$( document ).ready( function( e ) {

	if ( 'undefined' !== typeof PUM ) {
		var current_popup = PUM.getPopup( $( '.pum' ) );
		var settings = PUM.getSettings( $( '.pum' ) );
		var popup_id = settings.id;
		$( document ).on( 'pumAfterOpen', function() {
			mp_analytics_tracking_event( 'event', 'Popup', 'Show', popup_id, { 'nonInteraction': 1 } );
		} );
		$( document ).on( 'pumAfterClose', function() {
			var close_trigger = $.fn.popmake.last_close_trigger;
			if ( 'undefined' !== typeof close_trigger ) {
				mp_analytics_tracking_event( 'event', 'Popup', close_trigger, popup_id, { 'nonInteraction': 1 } );
			}
		} );
		$( '.message-close' ).click( function( e ) { // user clicks link with close class
			var close_trigger = 'Close Button';
			mp_analytics_tracking_event( 'event', 'Popup', close_trigger, popup_id, { 'nonInteraction': 1 } );
		} );
		$( '.message-login' ).click( function( e ) { // user clicks link with login class
			var url = $( this ).attr( 'href' );
			mp_analytics_tracking_event( 'event', 'Popup', 'Login Link', url );
		} );
		$( '.pum-content a:not( .message-close, .pum-close, .message-login )' ).click( function( e ) { // user clicks something that is not close text or close icon
			mp_analytics_tracking_event( 'event', 'Popup', 'Click', popup_id );
		} );
	}

	if ( 'undefined' !== typeof minnpost_membership_data && '' !== minnpost_membership_data.url_access_level ) {
		var type = 'event';
		var category = 'Member Content';
		var label = location.pathname; // i think we could possibly put some grouping here, but we don't necessarily have access to one and maybe it's not worthwhile yet
		var action = 'Blocked';
		if ( true === minnpost_membership_data.current_user.can_access ) {
			action = 'Shown';
		}
		mp_analytics_tracking_event( type, category, action, label );
	}
} );
