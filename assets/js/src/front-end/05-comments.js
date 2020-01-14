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
				//that.text( that.data( 'toggle-text' ) );
				$( '.a-checkbox-always-show-comments' ).val( 0 );
			} else {
				//that.text( that.data( 'default-text' ) );
				$( '.a-checkbox-always-show-comments' ).val( 1 );
			}
        }
    } );
} );