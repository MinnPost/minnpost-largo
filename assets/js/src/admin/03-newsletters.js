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

function showHideTinyMCE( value ) {
    var editor = '.postarea';
    if ( 'dc_memo' === value || 'daily_coronavirus' === value ) {
        $( editor ).show();
    } else {
        $( editor ).hide();
    }
}

function setupNewsletterSections() {
	var newsletterTypeSelector = '#_mp_newsletter_type';
	if ( 0 < $( newsletterTypeSelector ).length ) {
		showHideNewsletterSection( $( newsletterTypeSelector ).val() );
        showHideTinyMCE( $( newsletterTypeSelector ).val() );
		$( document ).on( 'change', newsletterTypeSelector, function( event ) {
			showHideNewsletterSection( $( this ).val() );
            showHideTinyMCE( $( this ).val() );
		} );
	}
}

$( document ).ready( function() {
	setupNewsletterSections();
} );
