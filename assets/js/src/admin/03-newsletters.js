function showHideNewsletterSection( value ) {
    var newsletterSectionSelector = '.cmb2-newsletter-section';
    if ( 0 < $( newsletterSectionSelector ).length ) {
        $( newsletterSectionSelector ).each( function( index ) {
            var parent = $( this ).closest( '.context-box' );
            if ( $( this ).hasClass( 'cmb2-newsletter-section-' + value ) ) {
                parent.show();
            } else {
                parent.hide();
            }
        } );
    }
}

function showHideBodyField( value ) {
    var editor = '.postarea';
    if ( 'dc_memo' === value || 'daily_coronavirus' === value ) {
        $( editor ).show();
    } else {
        $( editor ).hide();
    }
}

function showIntroSection( value ) {
    var intro_text = '.cmb2-id--mp-newsletter-newsletter-teaser';
    if ( 'artscape' === value ) {
        $( '#_mp_newsletter_introduction' ).removeClass( 'closed' );
    }
    if ( 'dc_memo' === value || 'daily_coronavirus' === value ) {
        $( intro_text ).hide();
    } else {
        $( intro_text ).show();
    }
}

function setupNewsletterSections() {
	var newsletterTypeSelector = '#_mp_newsletter_type';
	if ( 0 < $( newsletterTypeSelector ).length ) {
		showHideNewsletterSection( $( newsletterTypeSelector ).val() );
        showHideBodyField( $( newsletterTypeSelector ).val() );
        showIntroSection( $( newsletterTypeSelector ).val() );
		$( document ).on( 'change', newsletterTypeSelector, function( event ) {
			showHideNewsletterSection( $( this ).val() );
            showIntroSection( $( this ).val() );
            showHideBodyField( $( this ).val() );
		} );
	}
}

$( document ).ready( function() {
	setupNewsletterSections();
} );
