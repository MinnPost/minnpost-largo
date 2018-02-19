jQuery( document ).ready( function( $ ) {
	"use strict";
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
					switch (response.data.user_status) {
						case 'existing':
							message = 'Thanks for updating your email preferences. They will go into effect immediately.';
							break;
						case 'new':
							message = 'We have added you to the MinnPost mailing list.';
							break;
						case 'pending':
							message = 'We have added you to the MinnPost mailing list. You will need to click the confirmation link in the email we sent to begin receiving messages.';
							break;
					}
				} else {
					button.prop('disabled', false);
					button.text('Subscribe');
				}
				$('.m-hold-message').html('<div class="m-form-message m-form-message-info">' + message + '</div>');
			})
			.fail(function(response) {
				$('.m-hold-message').html('<div class="m-form-message m-form-message-info">An error has occured. Please try again.</div>');
				button.prop('disabled', false);
				button.text('Subscribe');
			})
			.always(function() {
				event.target.reset();
			});
		});
	}
});