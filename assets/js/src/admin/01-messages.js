function showHideConditionalValue( value ) {
	if ( 'gets_emails' === value ) {
		$( '.cmb2-message-conditional-value' ).hide();
		$( '.cmb2-message-conditional-emails-value' ).show();
	} else if ( 'has_role' === value ) {
		$( '.cmb2-message-conditional-value' ).hide();
		$( '.cmb2-message-conditional-roles-value' ).show();
	}
	if ( 'gets_emails' !== value ) {
		$( '.cmb2-message-conditional-emails-value' ).hide();
		$( '.cmb2-message-conditional-emails-value input:checkbox' ).prop( 'checked', false );
	}
	if ( 'has_role' !== value ) {
		$( '.cmb2-message-conditional-roles-value' ).hide();
		$( '.cmb2-message-conditional-roles-value input:checkbox' ).prop( 'checked', false );
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
