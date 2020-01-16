// button click for showing comments one time
$( document ).on( 'click', '.a-button-show-comments', function() {
	trackShowComments( false, '', '' );
});

// button click for always showing comments displayed before the comment list
$( document ).on( 'click', '#always-show-comments-before', function() {
	trackShowComments( true, 'Before', $( this ).val() );
});

// button click for always showing comments displayed after the comment list
$( document ).on( 'click', '#always-show-comments-after', function() {
	trackShowComments( true, 'After', $( this ).val() );
});

function trackShowComments( always, position, click_value ) {
	var action          = '';
	var category_prefix = '';
	var category_suffix = '';
	if ( '1' === click_value ) {
		action = 'On';
	} else if ( '0' === click_value ) {
		action = 'Off';
	} else {
		action = 'Click';
	}
	if ( true === always ) {
		category_prefix = 'Always ';
	}
	if ( '' !== position ) {
		category_suffix = ' - ' + position;
	}
	mp_analytics_tracking_event( 'event', category_prefix + 'Show Comments' + category_suffix, action, location.pathname );
}

// Set user meta value for always showing comments if that button is clicked
$( document ).on( 'click', '.a-checkbox-always-show-comments', function() {
	var that = $( this );
	if ( that.is( ':checked' ) ) {
		$( '.a-checkbox-always-show-comments' ).prop( 'checked', true );
	} else {
		$( '.a-checkbox-always-show-comments' ).prop( 'checked', false );
	}

	// we already have ajaxurl from the theme
	$.ajax( {
		type: 'POST',
		url: ajaxurl,
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