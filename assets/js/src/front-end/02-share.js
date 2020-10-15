/**
 * Methods for sharing content
 *
 * This file does require jQuery.
 *
 */

// track a share via analytics event
function trackShare( text, position = '' ) {

	// if a not logged in user tries to email, don't count that as a share
	if ( ! jQuery( 'body' ).hasClass( 'logged-in' ) && 'Email' === text ) {
		return;
	}

	var category = 'Share';
	if ( '' !== position ) {
		category = 'Share - ' + position;
	}

	// track as an event, and as social if it is twitter or fb
	mpAnalyticsTrackingEvent( 'event', category, text, location.pathname );
	if ( 'undefined' !== typeof ga ) {
		if ( 'Facebook' === text || 'Twitter' === text ) {
			if ( 'Facebook' === text ) {
				ga( 'send', 'social', text, 'Share', location.pathname );
			} else {
				ga( 'send', 'social', text, 'Tweet', location.pathname );
			}
		}
	} else {
		return;
	}
}

// copy the current URL to the user's clipboard
function copyCurrentURL() {
	var dummy = document.createElement( 'input' ),
		text = window.location.href;
	document.body.appendChild( dummy );
	dummy.value = text;
	dummy.select();
	document.execCommand( 'copy' );
	document.body.removeChild( dummy );
}

// top share button click
$( '.m-entry-share-top a' ).click( function() {
	var text = $( this ).data( 'share-action' );
	var position = 'top';
	trackShare( text, position );
} );

// when the print button is clicked
$( '.m-entry-share .a-share-print a' ).click( function( e ) {
	e.preventDefault();
	window.print();
} );

// when the republish button is clicked
// the plugin controls the rest, but we need to make sure the default event doesn't fire
$( '.m-entry-share .a-share-republish a' ).click( function( e ) {
	e.preventDefault();
} );

// when the copy link button is clicked
$( '.m-entry-share .a-share-copy-url a' ).click( function( e ) {
	copyCurrentURL();
	tlite.show( ( e.target ), { grav: 'w' } );
	setTimeout( function() {
		tlite.hide( ( e.target ) );
	}, 3000 );
	return false;
} );

// when sharing via facebook, twitter, or email, open the destination url in a new window
$( '.m-entry-share .a-share-facebook a, .m-entry-share .a-share-twitter a, .m-entry-share .a-share-email a' ).click( function( e ) {
	e.preventDefault();
	var url = $( this ).attr( 'href' );
	window.open( url, '_blank' );
} );
