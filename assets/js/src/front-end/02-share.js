function trackShare( text, position ) {

	// if a not logged in user tries to email, don't count that as a share
	if ( ! jQuery( 'body ').hasClass( 'logged-in') && 'Email' === text ) {
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
