(function($){
	function gtag_report_conversion(url) {
		var callback = function () {
		  if (typeof(url) != 'undefined') {
		    window.location = url;
		  }
		};
		gtag('event', 'conversion', {
		  'send_to': 'AW-976620175/jqCyCL7atXkQj5XY0QM',
		  'event_callback': callback
		});
		return false;
	}

	jQuery.fn.textNodes = function() {
		return this.contents().filter(function() {
			return (this.nodeType === Node.TEXT_NODE && this.nodeValue.trim() !== "");
		});
	}

	function getConfirmChangeMarkup( action ) {
		var markup = '<li class="a-form-caption a-form-confirm"><label>Are you sure? <a id="a-confirm-' + action + '" href="#">Yes</a> | <a id="a-stop-' + action + '" href="#">No</a></label></li>';
		return markup;
	}

	function manageEmails() {
		var form               = $('#account-settings-form');
		var rest_root          = user_account_management_rest.site_url + user_account_management_rest.rest_namespace;
		var full_url           = rest_root + '/' + 'update-user/';
		var confirmChange      = '';
		var nextEmailCount     = 1;
		var newPrimaryEmail    = '';
		var oldPrimaryEmail    = '';
		var primaryId          = '';
		var emailToRemove      = '';
		var consolidatedEmails = [];
		var newEmails          = [];
		var ajax_form_data     = '';
		var that               = '';
		// start out with no primary/removals checked
		$( '.a-form-caption.a-make-primary-email input[type="radio"]' ).prop( 'checked', false );
		$( '.a-form-caption.a-remove-email input[type="checkbox"]' ).prop( 'checked', false );
		if ( $( '.m-user-email-list' ).length > 0 ) {
			nextEmailCount = $( '.m-user-email-list > li' ).length;
			// if a user selects a new primary, move it into that position
			$( '.m-user-email-list' ).on( 'click', '.a-form-caption.a-make-primary-email input[type="radio"]', function( event ) {
				
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
				});
				$( '.m-user-email-list' ).on( 'click', '#a-stop-primary-change', function( event ) {
					event.preventDefault();
					$( '.a-pre-confirm', that.parent() ).show();
					$( '.a-form-confirm', that.parent() ).remove();
				});
			});

			// if a user removes an email, take it away from the visual and from the form
			$( '.m-user-email-list' ).on( 'change', '.a-form-caption.a-remove-email input[type="checkbox"]', function( event ) {
				emailToRemove = $( this ).val();
				confirmChange   = getConfirmChangeMarkup( 'removal' );
				$( '.m-user-email-list > li' ).each( function( index ) {
					if ( $( this ).contents().get( 0 ).nodeValue !== emailToRemove ) {
						consolidatedEmails.push( $( this ).contents().get( 0 ).nodeValue );
					}
				});
				// get or don't get confirmation from user
				that = $( this ).parent().parent();
				$( '.a-pre-confirm', that ).hide();
				$( '.a-form-confirm', that ).show();
				$( this ).parent().parent().addClass( 'a-pre-confirm' );
				$( this ).parent().parent().removeClass( 'a-stop-confirm' );
				//$( this ).parent().after( confirmChange );
				$( this ).parent().parent().append( confirmChange );
				$( '.m-user-email-list' ).on( 'click', '#a-confirm-removal', function( event ) {
					event.preventDefault();
					$( this ).parents( 'li' ).remove();
					$( '#_consolidated_emails' ).val( consolidatedEmails.join( ',' ) );
					nextEmailCount = $( '.m-user-email-list > li' ).length;
					form.submit();
					$( '.a-form-confirm', that.parent() ).remove();
				});
				$( '.m-user-email-list' ).on( 'click', '#a-stop-removal', function( event ) {
					event.preventDefault();
					$( '.a-pre-confirm', that.parent() ).show();
					$( '.a-form-confirm', that.parent() ).remove();
				});
			});
		}

		// if a user wants to add an email, give them a properly numbered field
		$('.a-form-caption.a-add-email').on( 'click', function( event ) {
			event.preventDefault();
			$('.a-form-caption.a-add-email').before( '<div class="a-input-with-button a-button-sentence"><input type="email" name="_consolidated_emails_array[]" id="_consolidated_emails_array[]" value=""><button type="submit" name="a-add-email-' + nextEmailCount + '" id="a-add-email-' + nextEmailCount + '" class="a-button a-button-add-user-email">Add</button></div>' );
			nextEmailCount++;
		});

		$( form ).on( 'submit', function( event ) {
			event.preventDefault();
			ajax_form_data = form.serialize(); //add our own ajax check as X-Requested-With is not always reliable
			ajax_form_data = ajax_form_data + '&rest=true';
			$.ajax({
				url: full_url,
				type: 'post',
				beforeSend: function ( xhr ) {
			        xhr.setRequestHeader( 'X-WP-Nonce', user_account_management_rest.nonce );
			    },
				dataType: 'json',
				data: ajax_form_data
			}).done( function( data ) {
				newEmails = $( 'input[name="_consolidated_emails_array[]"]' ).map( function() {
					return $(this).val();
				}).get();
				$.each( newEmails, function( index, value ) {
					nextEmailCount = nextEmailCount + index;
					$( '.m-user-email-list' ).append( '<li>' + value + '<ul class="a-form-caption a-user-email-actions"><li class="a-form-caption a-pre-confirm a-make-primary-email"><input type="radio" name="primary_email" id="primary_email_' + nextEmailCount + '" value="' + value + '"><label for="primary_email_' + nextEmailCount + '"><small>Make Primary</small></label></li><li class="a-form-caption a-pre-confirm a-remove-email"><input type="checkbox" name="remove_email[' + nextEmailCount + ']" id="remove_email_' + nextEmailCount + '" value="' + value + '"><label for="remove_email_' + nextEmailCount + '"><small>Remove</small></label></li></ul></li>' );
					$( '#_consolidated_emails' ).val( $( '#_consolidated_emails' ).val() + ',' + value );
				});
				$( '.m-form-change-email .a-input-with-button' ).remove();
			});
		});
	}

	jQuery( document ).ready( function( $ ) {
		"use strict";
		if ( $('.m-form-email').length > 0 ) {
			manageEmails();
		}
		if ( $('.m-form-newsletter-shortcode').length > 0 ) {
			$('.m-form-newsletter-shortcode fieldset').before('<div class="m-hold-message"></div>');
			$('.m-form-newsletter-shortcode form').submit(function(event) {
				var that = this;
				event.preventDefault(); // Prevent the default form submit.
				var button = $('button', this);
				button.prop('disabled', true);
				button.text('Processing');
				// serialize the form data
				var ajax_form_data = $(this).serialize();
				//add our own ajax check as X-Requested-With is not always reliable
				ajax_form_data = ajax_form_data + '&ajaxrequest=true&subscribe';
				$.ajax({
					url: params.ajaxurl, // domain/wp-admin/admin-ajax.php
					type: 'post',
					dataType : 'json',
					data: ajax_form_data
				})
				.done(function(response) { // response from the PHP action
					var message = '';
					if ( response.success === true ) {
						$('fieldset', that).hide();
						button.text('Thanks');
						var analytics_action = 'Signup';
						switch (response.data.user_status) {
							case 'existing':
								analytics_action = 'Update';
								message = 'Thanks for updating your email preferences. They will go into effect immediately.';
								break;
							case 'new':
								analytics_action = 'Signup';
								message = 'We have added you to the MinnPost mailing list.';
								break;
							case 'pending':
								analytics_action = 'Signup';
								message = 'We have added you to the MinnPost mailing list. You will need to click the confirmation link in the email we sent to begin receiving messages.';
								break;
						}
						if ( response.data.confirm_message !== '' ) {
							message = response.data.confirm_message;
						}
						if ( 'function' === typeof mp_analytics_tracking_event ) {
							mp_analytics_tracking_event( 'event', 'Newsletter', analytics_action, location.pathname );
							gtag_report_conversion( location.pathname );
						}
					} else {
						button.prop('disabled', false);
						button.text('Subscribe');
						if ( 'function' === typeof mp_analytics_tracking_event ) {
							mp_analytics_tracking_event( 'event', 'Newsletter', 'Fail', location.pathname );
						}
					}
					$('.m-hold-message').html('<div class="m-form-message m-form-message-info">' + message + '</div>');
				})
				.fail(function(response) {
					$('.m-hold-message').html('<div class="m-form-message m-form-message-info">An error has occured. Please try again.</div>');
					button.prop('disabled', false);
					button.text('Subscribe');
					if ( 'function' === typeof mp_analytics_tracking_event ) {
						mp_analytics_tracking_event( 'event', 'Newsletter', 'Fail', location.pathname );
					}
				})
				.always(function() {
					event.target.reset();
				});
			});
		}
	});
})(jQuery);
