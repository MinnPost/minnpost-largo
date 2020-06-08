function showHideConditionalValue( value, parent = '' ) {
	if ( 'gets_emails' === value && '' !== parent ) {
		$( '.cmb2-message-conditional-value', parent ).hide();
		$( '.cmb2-message-conditional-emails-value', parent ).show();
	} else if ( 'has_role' === value && '' !== parent ) {
		$( '.cmb2-message-conditional-value', parent ).hide();
		$( '.cmb2-message-conditional-roles-value', parent ).show();
	}
	if ( 'gets_emails' !== value && '' !== parent ) {
		$( '.cmb2-message-conditional-emails-value', parent ).hide();
		$( '.cmb2-message-conditional-emails-value input:checkbox', parent ).prop( 'checked', false );
	}
	if ( 'has_role' !== value && '' !== parent ) {
		$( '.cmb2-message-conditional-roles-value', parent ).hide();
		$( '.cmb2-message-conditional-roles-value input:checkbox', parent ).prop( 'checked', false );
	}
}

function setupMessageConditional() {
	var conditionalSelector = '.cmb2-message-conditional select';
	if ( 0 < $( conditionalSelector ).length ) {
		showHideConditionalValue( $( conditionalSelector ).val() );
		$( document ).on( 'change', conditionalSelector, function( event ) {
			showHideConditionalValue( $( this ).val(), $( event.target ).closest( '.cmb-field-list' ) );
		} );
	}
}

$( document ).ready( function() {
	setupMessageConditional();
} );
