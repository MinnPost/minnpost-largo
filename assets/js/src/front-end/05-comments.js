/**
 * Methods for comments
 *
 * This file does require jQuery.
 *
 */

// based on which button was clicked, set the values for the analytics event and create it
function trackShowComments( always, id, clickValue ) {
	var action          = '';
	var categoryPrefix = '';
	var categorySuffix = '';
	var position        = '';
	position = id.replace( 'always-show-comments-', '' );
	if ( '1' === clickValue ) {
		action = 'On';
	} else if ( '0' === clickValue ) {
		action = 'Off';
	} else {
		action = 'Click';
	}
	if ( true === always ) {
		categoryPrefix = 'Always ';
	}
	if ( '' !== position ) {
		position = position.charAt( 0 ).toUpperCase() + position.slice( 1 );
		categorySuffix = ' - ' + position;
	}
	mpAnalyticsTrackingEvent( 'event', categoryPrefix + 'Show Comments' + categorySuffix, action, location.pathname );
}

// when showing comments once, allow it to be an analytics event
const showCommentsButton = document.querySelector( '.a-button-show-comments' );
if (showCommentsButton) {
	showCommentsButton.addEventListener('click', function (e) {
		trackShowComments( false, '', '' );
	} );
}

// Set user meta value for always showing comments if that button is clicked. this uses jquery.
$( document ).on( 'click', '.a-checkbox-always-show-comments', function() {
	var that = $( this );
	if ( that.is( ':checked' ) ) {
		$( '.a-checkbox-always-show-comments' ).prop( 'checked', true );
	} else {
		$( '.a-checkbox-always-show-comments' ).prop( 'checked', false );
	}

	// track it as an analytics event
	trackShowComments( true, that.attr( 'id' ), that.val() );

	// we already have ajaxurl from the theme
	$.ajax( {
		type: 'POST',
		url: params.ajaxurl,
		data: {
			'action': 'minnpost_largo_load_comments_set_user_meta',
			'value': that.val()
		},
		success: function( response ) {
			$( '.a-always-show-comments-result', that.parent() ).html( response.data.message );
			if ( true === response.data.show ) {
				$( '.a-checkbox-always-show-comments' ).val( 0 );
			} else {
				$( '.a-checkbox-always-show-comments' ).val( 1 );
			}
		}
	} );
} );

// this uses jquery.
! ( function( d ) {
	if ( ! d.currentScript ) {
		var data = {
			action: 'llc_load_comments',
			post: $( '#llc_post_id' ).val()
		};

		// Ajax request link.
		var llcajaxurl = $( '#llc_ajax_url' ).val();

		// Full url to get comments (Adding parameters).
		var commentUrl = llcajaxurl + '?' + $.param( data );

		// Perform ajax request.
		$.get( commentUrl, function( response ) {
			if ( '' !== response ) {
				$( '#llc_comments' ).html( response );

				// Initialize comments after lazy loading.
				if ( window.addComment && window.addComment.init ) {
					window.addComment.init();
				}

				// Get the comment li id from url if exist.
				var commentId = document.URL.substr( document.URL.indexOf( '#comment' ) );

				// If comment id found, scroll to that comment.
				if ( -1 < commentId.indexOf( '#comment' ) ) {
					$( window ).scrollTop( $( commentId ).offset().top );
				}
			}
		} );
	}
}( document ) );
