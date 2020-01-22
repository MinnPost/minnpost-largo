function showHideConditionalValue( value ) {
	if ( 'gets_emails' === value ) {
		$( '.cmb2-message-conditional-value' ).hide();
	} else {
		$( '.cmb2-message-conditional-value' ).show();
	}
}

function setupMessageConditional() {
	var conditional_selector = '.cmb2-message-conditional select';
	if ( $( conditional_selector ).length > 0 ) {
		showHideConditionalValue( $( conditional_selector ).val() );
		$( document ).on( 'change', conditional_selector, function() {
			showHideConditionalValue( $( this ).val() );
		});
	}
}

$( document ).ready( function ( e ) {
	setupMessageConditional();
});
