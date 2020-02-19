// based on which button was clicked, set the values for the analytics event and create it
function trackShowComments( always, id, click_value ) {
	var action          = '';
	var category_prefix = '';
	var category_suffix = '';
	var position        = '';
	position = id.replace( 'always-show-comments-', '' );
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
		position = position.charAt( 0 ).toUpperCase() + position.slice( 1 );
		category_suffix = ' - ' + position;
	}
	mp_analytics_tracking_event( 'event', category_prefix + 'Show Comments' + category_suffix, action, location.pathname );
}

// when showing comments once, track it as an analytics event
$( document ).on( 'click', '.a-button-show-comments', function() {
	trackShowComments( false, '', '' );
});

// Set user meta value for always showing comments if that button is clicked
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
	$.ajax({
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
	});
});
