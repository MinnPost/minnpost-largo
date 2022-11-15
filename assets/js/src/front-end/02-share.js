/**
 * Methods for sharing content
 *
 * This file does not require jQuery.
 *
 */

// track a share via analytics event.
function trackShare( text, position = '' ) {
    var category = 'Share';
    if ( '' !== position ) {
        category = 'Share - ' + position;
    }

    // track as an event
    mpAnalyticsTrackingEvent( 'event', category, text, location.pathname );
}

// top share button click
document.querySelectorAll( '.m-entry-share-top a' ).forEach(
    topButton => topButton.addEventListener( 'click', ( e ) => {
        var text = e.currentTarget.getAttribute( 'data-share-action' );
        var position = 'top';
        trackShare( text, position );
    } )
);

// when the print button is clicked
document.querySelectorAll( '.m-entry-share .a-share-print a' ).forEach(
    printButton => printButton.addEventListener( 'click', ( e ) => {
        e.preventDefault();
        window.print();
    } )
);

// when the republish button is clicked
// the plugin controls the rest, but we need to make sure the default event doesn't fire
document.querySelectorAll( '.m-entry-share .a-share-republish a' ).forEach(
    republishButton => republishButton.addEventListener( 'click', ( e ) => {
        e.preventDefault();
    } )
);

// when the copy link button is clicked
document.querySelectorAll( '.m-entry-share .a-share-copy-url a' ).forEach(
    copyButton => copyButton.addEventListener( 'click', ( e ) => {
        e.preventDefault();
        let copyText = window.location.href;
        navigator.clipboard.writeText( copyText ).then( () => {
            tlite.show( ( e.target ), { grav: 'w' } );
            setTimeout( function() {
                tlite.hide( ( e.target ) );
            }, 3000 );
        } );
    } )
);

// when sharing via facebook, twitter, or email, open the destination url in a new window
document.querySelectorAll( '.m-entry-share .a-share-facebook a, .m-entry-share .a-share-twitter a, .m-entry-share .a-share-email a' ).forEach(
    anyShareButton => anyShareButton.addEventListener( 'click', ( e ) => {
        e.preventDefault();
		var url = e.currentTarget.getAttribute( 'href' );
		window.open( url, '_blank' );
    } )
);
