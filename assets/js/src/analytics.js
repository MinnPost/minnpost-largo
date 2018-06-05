( function( $ ) {

	function mp_analytics_tracking_event( type, category, action, label, value ) {
		if ( typeof ga !== 'undefined' ) {
			if ( typeof value === 'undefined' ) {
				ga( 'send', type, category, action, label );
			} else {
				ga( 'send', type, category, action, label, value );
			}
		} else {
			return;
		}
	}

	function trackShare( text, position ) {

		// if a not logged in user tries to email, don't count that as a share
		if ( ! $( 'body ').hasClass( 'logged-in') && 'Email' === text ) {
			return;
		}

		// track as an event, and as social if it is twitter or fb
		mp_analytics_tracking_event( 'event', 'Share - ' + position, text, location.pathname );
		if ( 'undefined' !== typeof ga ) {
			if ( 'Facebook' === text || 'Twitter' === text ) {
				if ( text == 'Facebook' ) {
					ga( 'send', 'social', text, 'Share', location.pathname );
				} else {
					ga( 'send', 'social', text, 'Tweet', location.pathname );
				}
			}
		} else {
			return;
		}
	}

	$ ( '.m-entry-share-top a' ).click( function( e ) {
		var text = $( this ).text().trim();
		var position = 'top';
		trackShare( text, position );
	});

	$ ( '.m-entry-share-bottom a' ).click( function( e ) {
		var text = $( this ).text().trim();
		var position = 'bottom';
		trackShare( text, position );
	});

	$( '#navigation-featured a' ).click( function( e ) {
		mp_analytics_tracking_event( 'event', 'Featured Bar Link', 'Click', this.href );
	});
	$( 'a.glean-sidebar' ).click( function( e ) {
		mp_analytics_tracking_event( 'event', 'Sidebar Support Link', 'Click', this.href );
	});

	$( 'a', $( '.o-site-sidebar' ) ).click( function( e ) {
		var widget_title = $(this).closest('.m-widget').find('h3').text();
		var sidebar_section_title = '';
		if (widget_title === '') {
			//sidebar_section_title = $(this).closest('.node-type-spill').find('.node-title a').text();
		} else {
			sidebar_section_title = widget_title;
		}
		mp_analytics_tracking_event('event', 'Sidebar Link', 'Click', sidebar_section_title);
	});

	$( document ).ready( function ( e ) {

		if ( 'undefined' !== typeof PUM ) {
			var current_popup = PUM.getPopup( $( '.pum' ) );
			var settings = PUM.getSettings( $( '.pum' ) );
			var popup_id = settings.id;
			$( document ).on('pumAfterOpen', function () {
				mp_analytics_tracking_event( 'event', 'Popup', 'Show', popup_id, { 'nonInteraction': 1 } );
			});
			$( document ).on('pumAfterClose', function () {
				var close_trigger = $.fn.popmake.last_close_trigger;
				if ( 'undefined' !== typeof close_trigger ) {
					mp_analytics_tracking_event( 'event', 'Popup', close_trigger, popup_id, { 'nonInteraction': 1 } );
				}
			});
			$( '.message-close' ).click(function( e ) { // user clicks link with close class
				var close_trigger = 'Close Button';
				mp_analytics_tracking_event( 'event', 'Popup', close_trigger, popup_id, { 'nonInteraction': 1 } );
			});
			$( '.message-login' ).click(function( e ) { // user clicks link with login class
				var url = $(this).attr('href');
				mp_analytics_tracking_event( 'event', 'Popup', 'Login Link', url );
			});
			$( '.pum-content a:not( .message-close, .pum-close, .message-login )' ).click( function( e ) { // user clicks something that is not close text or close icon
				mp_analytics_tracking_event( 'event', 'Popup', 'Click', popup_id );
            });
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
	});

} )( jQuery );