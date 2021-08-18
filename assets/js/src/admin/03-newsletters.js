function showHideNewsletterSection( value ) {
    var newsletterSectionSelector = '.cmb2-newsletter-section';
    if ( 0 < $( newsletterSectionSelector ).length ) {
        $( newsletterSectionSelector ).each(function( index ) {
            var parent = $( this ).closest( '.context-box' );
            if ( $( this ).hasClass( 'cmb2-newsletter-section-' + value ) ) {
                parent.show();
            } else {
                parent.hide();
            }
        });
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

function showTeaserSection( value ) {
    if ( 'artscape' === value ) {
        $( '#_mp_newsletter_teaser_options' ).removeClass( 'closed' );
    }
}

function setupNewsletterSections() {
	var newsletterTypeSelector = '#_mp_newsletter_type';
	if ( 0 < $( newsletterTypeSelector ).length ) {
		showHideNewsletterSection( $( newsletterTypeSelector ).val() );
        showHideBodyField( $( newsletterTypeSelector ).val() );
        showTeaserSection( $( newsletterTypeSelector ).val() );
		$( document ).on( 'change', newsletterTypeSelector, function( event ) {
			showHideNewsletterSection( $( this ).val() );
            showTeaserSection( $( this ).val() );
            showHideBodyField( $( this ).val() );
		} );
	}
}

$( document ).ready( function() {
	setupNewsletterSections();
} );
