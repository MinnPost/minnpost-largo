/**
 * Methods for forms
 *
 * This file does require jQuery.
 *
 */

jQuery.fn.textNodes = function() {
	return this.contents().filter( function() {
		return ( this.nodeType === Node.TEXT_NODE && '' !== this.nodeValue.trim() );
	} );
};

function getConfirmChangeMarkup( action ) {
	var markup = '<li class="a-form-caption a-form-confirm"><label>Are you sure? <a id="a-confirm-' + action + '" href="#">Yes</a> | <a id="a-stop-' + action + '" href="#">No</a></label></li>';
	return markup;
}

function manageEmails() {
	var form               = $( '#account-settings-form' );
	var restRoot           = user_account_management_rest.site_url + user_account_management_rest.rest_namespace;
	var fullUrl            = restRoot + '/' + 'update-user/';
	var confirmChange      = '';
	var nextEmailCount     = 1;
	var newPrimaryEmail    = '';
	var oldPrimaryEmail    = '';
	var primaryId          = '';
	var emailToRemove      = '';
	var consolidatedEmails = [];
	var newEmails          = [];
	var ajaxFormData       = '';
	var that               = '';

	// start out with no primary/removals checked
	$( '.a-form-caption.a-make-primary-email input[type="radio"]' ).prop( 'checked', false );
	$( '.a-form-caption.a-remove-email input[type="checkbox"]' ).prop( 'checked', false );

	// if there is a list of emails (not just a single form field)
	if ( 0 < $( '.m-user-email-list' ).length ) {
		nextEmailCount = $( '.m-user-email-list > li' ).length;

		// if a user selects a new primary, move it into that position
		$( '.m-user-email-list' ).on( 'click', '.a-form-caption.a-make-primary-email input[type="radio"]', function() {

			newPrimaryEmail = $( this ).val();
			oldPrimaryEmail = $( '#email' ).val();
			primaryId       = $( this ).prop( 'id' ).replace( 'primary_email_', '' );
			confirmChange   = getConfirmChangeMarkup( 'primary-change' );

			// get or don't get confirmation from user
			that = $( this ).parent().parent();
			$( '.a-pre-confirm', that ).hide();
			$( '.a-form-confirm', that ).show();
			$( this ).parent().parent().addClass( 'a-pre-confirm' );
			$( this ).parent().parent().removeClass( 'a-stop-confirm' );

			//$( this ).parent().after( confirmChange );
			$( this ).parent().parent().append( confirmChange );

			$( '.m-user-email-list' ).on( 'click', '#a-confirm-primary-change', function( event ) {
				event.preventDefault();

				// change the user facing values
				$( '.m-user-email-list > li' ).textNodes().first().replaceWith( newPrimaryEmail );
				$( '#user-email-' + primaryId ).textNodes().first().replaceWith( oldPrimaryEmail );

				// change the main hidden form value
				$( '#email' ).val( newPrimaryEmail );

				// submit form values.
				form.submit();

				// uncheck the radio button
				$( '.a-form-caption.a-make-primary-email input[type="radio"]' ).prop( 'checked', false );

				// change the form values to the old primary email
				$( '#primary_email_' + primaryId ).val( oldPrimaryEmail );
				$( '#remove_email_' + primaryId ).val( oldPrimaryEmail );

				// remove the confirm message
				$( '.a-form-confirm', that.parent() ).remove();
				$( '.a-pre-confirm', that.parent() ).show();
			} );
			$( '.m-user-email-list' ).on( 'click', '#a-stop-primary-change', function( event ) {
				event.preventDefault();
				$( '.a-pre-confirm', that.parent() ).show();
				$( '.a-form-confirm', that.parent() ).remove();
			} );
		} );

		// if a user removes an email, take it away from the visual and from the form
		$( '.m-user-email-list' ).on( 'change', '.a-form-caption.a-remove-email input[type="checkbox"]', function() {
			emailToRemove = $( this ).val();
			confirmChange   = getConfirmChangeMarkup( 'removal' );
			$( '.m-user-email-list > li' ).each( function() {
				if ( $( this ).contents().get( 0 ).nodeValue !== emailToRemove ) {
					consolidatedEmails.push( $( this ).contents().get( 0 ).nodeValue );
				}
			} );

			// get or don't get confirmation from user for removal
			that = $( this ).parent().parent();
			$( '.a-pre-confirm', that ).hide();
			$( '.a-form-confirm', that ).show();
			$( this ).parent().parent().addClass( 'a-pre-confirm' );
			$( this ).parent().parent().removeClass( 'a-stop-confirm' );
			$( this ).parent().parent().append( confirmChange );

			// if confirmed, remove the email and submit the form
			$( '.m-user-email-list' ).on( 'click', '#a-confirm-removal', function( event ) {
				event.preventDefault();
				$( this ).parents( 'li' ).fadeOut( 'normal', function() {
					$( this ).remove();
				} );
				$( '#_consolidated_emails' ).val( consolidatedEmails.join( ',' ) );

				//console.log( 'value is ' + consolidatedEmails.join( ',' ) );
				nextEmailCount = $( '.m-user-email-list > li' ).length;
				form.submit();
				$( '.a-form-confirm', that.parent() ).remove();
			} );
			$( '.m-user-email-list' ).on( 'click', '#a-stop-removal', function( event ) {
				event.preventDefault();
				$( '.a-pre-confirm', that.parent() ).show();
				$( '.a-form-confirm', that.parent() ).remove();
			} );
		} );
	}

	// if a user wants to add an email, give them a properly numbered field
	$( '.m-form-email' ).on( 'click', '.a-form-caption.a-add-email', function( event ) {
		event.preventDefault();
		$( '.a-form-caption.a-add-email' ).before( '<div class="a-input-with-button a-button-sentence"><input type="email" name="_consolidated_emails_array[]" id="_consolidated_emails_array[]" value=""><button type="submit" name="a-add-email-' + nextEmailCount + '" id="a-add-email-' + nextEmailCount + '" class="a-button a-button-add-user-email">Add</button></div>' );
		nextEmailCount++;
	} );

	$( 'input[type=submit]' ).click( function() {
		var button = $( this );
		var buttonForm = button.closest( 'form' );
		buttonForm.data( 'submitting_button', button.val() );
	} );

	$( '.m-entry-content' ).on( 'submit', '#account-settings-form', function( event ) {
		var form = $( this );
		var submittingButton = form.data( 'submitting_button' ) || '';

		// if there is no submitting button, pass it by Ajax
		if ( '' === submittingButton || 'Save Changes' !== submittingButton ) {
			event.preventDefault();
			ajaxFormData = form.serialize(); //add our own ajax check as X-Requested-With is not always reliable
			ajaxFormData = ajaxFormData + '&rest=true';
			$.ajax( {
				url: fullUrl,
				type: 'post',
				beforeSend: function( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', user_account_management_rest.nonce );
				},
				dataType: 'json',
				data: ajaxFormData
			} ).done( function() {
				newEmails = $( 'input[name="_consolidated_emails_array[]"]' ).map( function() {
					return $( this ).val();
				} ).get();
				$.each( newEmails, function( index, value ) {
					nextEmailCount = nextEmailCount + index;
					$( '.m-user-email-list' ).append( '<li id="user-email-' + nextEmailCount + '">' + value + '<ul class="a-form-caption a-user-email-actions"><li class="a-form-caption a-pre-confirm a-make-primary-email"><input type="radio" name="primary_email" id="primary_email_' + nextEmailCount + '" value="' + value + '"><label for="primary_email_' + nextEmailCount + '"><small>Make Primary</small></label></li><li class="a-form-caption a-pre-confirm a-email-preferences"><a href="/newsletters/?email=' + encodeURIComponent( value ) + '"><small>Email Preferences</small></a></li><li class="a-form-caption a-pre-confirm a-remove-email"><input type="checkbox" name="remove_email[' + nextEmailCount + ']" id="remove_email_' + nextEmailCount + '" value="' + value + '"><label for="remove_email_' + nextEmailCount + '"><small>Remove</small></label></li></ul></li>' );
					$( '#_consolidated_emails' ).val( $( '#_consolidated_emails' ).val() + ',' + value );
				} );
				$( '.m-form-change-email .a-input-with-button' ).remove();
				if ( 0 === $( '.m-user-email-list' ).length ) {
					if ( $( 'input[name="_consolidated_emails_array[]"]' ) !== $( 'input[name="email"]' ) ) {

						// it would be nice to only load the form, but then click events still don't work
						location.reload();
					}
				}
			} );
		}
	} );
}

function addAutoResize() {
	document.querySelectorAll( '[data-autoresize]' ).forEach( function ( element ) {
		element.style.boxSizing = 'border-box';
		var offset = element.offsetHeight - element.clientHeight;
		element.addEventListener( 'input', function ( event ) {
			event.target.style.height = 'auto';
			event.target.style.height = event.target.scrollHeight + offset + 'px';
		});
		element.removeAttribute( 'data-autoresize' );
	});
}

$( document ).ajaxStop( function() {
	var commentArea = document.querySelector( '#llc_comments' );
	if ( null !== commentArea ) {
		addAutoResize();
	}
});

document.addEventListener( 'DOMContentLoaded', function( event ) {
	'use strict';
	if ( 0 < $( '.m-form-account-settings' ).length ) {
		manageEmails();
	}
	var autoResizeTextarea = document.querySelector( '[data-autoresize]' );
	if ( null !== autoResizeTextarea ) {
		addAutoResize();
	}
} );
