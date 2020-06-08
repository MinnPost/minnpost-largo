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
	var conditional_selector = '.cmb2-message-conditional select';
	if ( 0 < $( conditional_selector ).length ) {
		showHideConditionalValue( $( conditional_selector ).val() );
		$( document ).on( 'change', conditional_selector, function( event ) {
			showHideConditionalValue( $( this ).val(), $( event.target ).closest( '.cmb-field-list' ) );
		} );
	}
}

$( document ).ready( function( e ) {
	setupMessageConditional();
} );
