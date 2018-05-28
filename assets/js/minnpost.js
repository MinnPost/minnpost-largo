'use strict';

function mp_analytics_tracking_event(type, category, action, label, value) {
	if (typeof ga !== 'undefined') {
		if (typeof value === 'undefined') {
			ga('send', type, category, action, label);
		} else {
			ga('send', type, category, action, label, value);
		}
	} else {
		return;
	}
}

function trackShare(text, position) {

	// if a not logged in user tries to email, don't count that as a share
	if (!$('body ').hasClass('logged-in') && 'Email' === text) {
		return;
	}

	// track as an event, and as social if it is twitter or fb
	mp_analytics_tracking_event('event', 'Share - ' + position, text, location.pathname);
	if ('undefined' !== typeof ga) {
		if ('Facebook' === text || 'Twitter' === text) {
			if (text == 'Facebook') {
				ga('send', 'social', text, 'Share', location.pathname);
			} else {
				ga('send', 'social', text, 'Tweet', location.pathname);
			}
		}
	} else {
		return;
	}
}

jQuery('.m-entry-share-top a').click(function ($) {
	var text = $(this).text().trim();
	var position = 'top';
	trackShare(text, position);
});

jQuery('.m-entry-share-bottom a').click(function ($) {
	var text = $(this).text().trim();
	var position = 'bottom';
	trackShare(text, position);
});

jQuery('#navigation-featured a').click(function ($) {
	mp_analytics_tracking_event('event', 'Featured Bar Link', 'Click', this.href);
});
jQuery('a.glean-sidebar').click(function ($) {
	mp_analytics_tracking_event('event', 'Sidebar Support Link', 'Click', this.href);
});

jQuery('a', $('#o-site-sidebar')).click(function ($) {
	var widget_title = $(this).closest('.m-widget').find('h3').text();
	var sidebar_section_title = '';
	if (widget_title === '') {
		//sidebar_section_title = $(this).closest('.node-type-spill').find('.node-title a').text();
	} else {
		sidebar_section_title = widget_title;
	}
	mp_analytics_tracking_event('event', 'Sidebar Link', 'Click', sidebar_section_title);
});

jQuery(document).ready(function ($) {
	if ('undefined' !== typeof minnpost_membership_data && '' !== minnpost_membership_data.url_access_level) {
		var type = 'event';
		var category = 'Member Content';
		var label = location.pathname; // i think we could possibly put some grouping here, but we don't necessarily have access to one and maybe it's not worthwhile yet
		var action = 'Blocked';
		if (true === minnpost_membership_data.current_user.can_access) {
			action = 'Shown';
		}
		mp_analytics_tracking_event(type, category, action, label);
	}
});
'use strict';

jQuery(document).ready(function ($) {
	"use strict";

	if ($('.m-form-newsletter-shortcode').length > 0) {
		$('.m-form-newsletter-shortcode fieldset').before('<div class="m-hold-message"></div>');
		$('.m-form-newsletter-shortcode form').submit(function (event) {
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
				dataType: 'json',
				data: ajax_form_data
			}).done(function (response) {
				// response from the PHP action
				var message = '';
				if (response.success === true) {
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
					if ('function' === typeof mp_analytics_tracking_event) {
						mp_analytics_tracking_event('event', 'Newsletter', analytics_action, location.pathname);
					}
				} else {
					button.prop('disabled', false);
					button.text('Subscribe');
					if ('function' === typeof mp_analytics_tracking_event) {
						mp_analytics_tracking_event('event', 'Newsletter', 'Fail', location.pathname);
					}
				}
				$('.m-hold-message').html('<div class="m-form-message m-form-message-info">' + message + '</div>');
			}).fail(function (response) {
				$('.m-hold-message').html('<div class="m-form-message m-form-message-info">An error has occured. Please try again.</div>');
				button.prop('disabled', false);
				button.text('Subscribe');
				if ('function' === typeof mp_analytics_tracking_event) {
					mp_analytics_tracking_event('event', 'Newsletter', 'Fail', location.pathname);
				}
			}).always(function () {
				event.target.reset();
			});
		});
	}
});
'use strict';

/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
(function () {
	var container, button, menu, links, i, len;

	container = document.getElementById('navigation-primary');
	if (!container) {
		return;
	}

	button = container.getElementsByTagName('button')[0];
	if ('undefined' === typeof button) {
		return;
	}

	menu = container.getElementsByTagName('ul')[0];

	// Hide menu toggle button if menu is empty and return early.
	if ('undefined' === typeof menu) {
		button.style.display = 'none';
		return;
	}

	menu.setAttribute('aria-expanded', 'false');
	if (-1 === menu.className.indexOf('menu')) {
		menu.className += ' menu';
	}

	button.onclick = function () {
		if (-1 !== container.className.indexOf('toggled')) {
			container.className = container.className.replace(' toggled', '');
			button.setAttribute('aria-expanded', 'false');
			menu.setAttribute('aria-expanded', 'false');
		} else {
			container.className += ' toggled';
			button.setAttribute('aria-expanded', 'true');
			menu.setAttribute('aria-expanded', 'true');
		}
	};

	// Get all the link elements within the menu.
	links = menu.getElementsByTagName('a');

	// Each time a menu link is focused or blurred, toggle focus.
	for (i = 0, len = links.length; i < len; i++) {
		links[i].addEventListener('focus', toggleFocus, true);
		links[i].addEventListener('blur', toggleFocus, true);
	}

	/**
  * Sets or removes .focus class on an element.
  */
	function toggleFocus() {
		var self = this;

		// Move up through the ancestors of the current link until we hit .nav-menu.
		while (-1 === self.className.indexOf('menu')) {

			// On li elements toggle the class .focus.
			if ('li' === self.tagName.toLowerCase()) {
				if (-1 !== self.className.indexOf('focus')) {
					self.className = self.className.replace(' focus', '');
				} else {
					self.className += ' focus';
				}
			}

			self = self.parentElement;
		}
	}

	/**
  * Toggles `focus` class to allow submenu access on tablets.
  */
	(function (container) {
		var touchStartFn,
		    i,
		    parentLink = container.querySelectorAll('.menu-item-has-children > a, .page_item_has_children > a');

		if ('ontouchstart' in window) {
			touchStartFn = function touchStartFn(e) {
				var menuItem = this.parentNode,
				    i;

				if (!menuItem.classList.contains('focus')) {
					e.preventDefault();
					for (i = 0; i < menuItem.parentNode.children.length; ++i) {
						if (menuItem === menuItem.parentNode.children[i]) {
							continue;
						}
						menuItem.parentNode.children[i].classList.remove('focus');
					}
					menuItem.classList.add('focus');
				} else {
					menuItem.classList.remove('focus');
				}
			};

			for (i = 0; i < parentLink.length; ++i) {
				parentLink[i].addEventListener('touchstart', touchStartFn, false);
			}
		}
	})(container);
})();

// user account navigation can be a dropdown
jQuery(document).ready(function ($) {
	// hide menu
	if ($('#user-account-access ul').length > 0) {
		$('#user-account-access > li > a').on('click', function (event) {
			$('#user-account-access ul').toggleClass('visible');
			event.preventDefault();
		});
	}
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuYWx5dGljcy5qcyIsImZvcm1zLmpzIiwibmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6WyJtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsInZhbHVlIiwiZ2EiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwiJCIsImhhc0NsYXNzIiwibG9jYXRpb24iLCJwYXRobmFtZSIsImpRdWVyeSIsImNsaWNrIiwidHJpbSIsImhyZWYiLCJ3aWRnZXRfdGl0bGUiLCJjbG9zZXN0IiwiZmluZCIsInNpZGViYXJfc2VjdGlvbl90aXRsZSIsImRvY3VtZW50IiwicmVhZHkiLCJtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEiLCJ1cmxfYWNjZXNzX2xldmVsIiwiY3VycmVudF91c2VyIiwiY2FuX2FjY2VzcyIsImxlbmd0aCIsImJlZm9yZSIsInN1Ym1pdCIsImV2ZW50IiwidGhhdCIsInByZXZlbnREZWZhdWx0IiwiYnV0dG9uIiwicHJvcCIsImFqYXhfZm9ybV9kYXRhIiwic2VyaWFsaXplIiwiYWpheCIsInVybCIsInBhcmFtcyIsImFqYXh1cmwiLCJkYXRhVHlwZSIsImRhdGEiLCJkb25lIiwicmVzcG9uc2UiLCJtZXNzYWdlIiwic3VjY2VzcyIsImhpZGUiLCJhbmFseXRpY3NfYWN0aW9uIiwidXNlcl9zdGF0dXMiLCJodG1sIiwiZmFpbCIsImFsd2F5cyIsInRhcmdldCIsInJlc2V0IiwiY29udGFpbmVyIiwibWVudSIsImxpbmtzIiwiaSIsImxlbiIsImdldEVsZW1lbnRCeUlkIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJzdHlsZSIsImRpc3BsYXkiLCJzZXRBdHRyaWJ1dGUiLCJjbGFzc05hbWUiLCJpbmRleE9mIiwib25jbGljayIsInJlcGxhY2UiLCJhZGRFdmVudExpc3RlbmVyIiwidG9nZ2xlRm9jdXMiLCJzZWxmIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwicGFyZW50RWxlbWVudCIsInRvdWNoU3RhcnRGbiIsInBhcmVudExpbmsiLCJxdWVyeVNlbGVjdG9yQWxsIiwid2luZG93IiwiZSIsIm1lbnVJdGVtIiwicGFyZW50Tm9kZSIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiY2hpbGRyZW4iLCJyZW1vdmUiLCJhZGQiLCJvbiIsInRvZ2dsZUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLDJCQUFULENBQXNDQyxJQUF0QyxFQUE0Q0MsUUFBNUMsRUFBc0RDLE1BQXRELEVBQThEQyxLQUE5RCxFQUFxRUMsS0FBckUsRUFBNkU7QUFDNUUsS0FBSyxPQUFPQyxFQUFQLEtBQWMsV0FBbkIsRUFBaUM7QUFDaEMsTUFBSyxPQUFPRCxLQUFQLEtBQWlCLFdBQXRCLEVBQW9DO0FBQ25DQyxNQUFJLE1BQUosRUFBWUwsSUFBWixFQUFrQkMsUUFBbEIsRUFBNEJDLE1BQTVCLEVBQW9DQyxLQUFwQztBQUNBLEdBRkQsTUFFTztBQUNORSxNQUFJLE1BQUosRUFBWUwsSUFBWixFQUFrQkMsUUFBbEIsRUFBNEJDLE1BQTVCLEVBQW9DQyxLQUFwQyxFQUEyQ0MsS0FBM0M7QUFDQTtBQUNELEVBTkQsTUFNTztBQUNOO0FBQ0E7QUFDRDs7QUFFRCxTQUFTRSxVQUFULENBQXFCQyxJQUFyQixFQUEyQkMsUUFBM0IsRUFBc0M7O0FBRXJDO0FBQ0EsS0FBSyxDQUFFQyxFQUFHLE9BQUgsRUFBWUMsUUFBWixDQUFzQixXQUF0QixDQUFGLElBQXdDLFlBQVlILElBQXpELEVBQWdFO0FBQy9EO0FBQ0E7O0FBRUQ7QUFDQVIsNkJBQTZCLE9BQTdCLEVBQXNDLGFBQWFTLFFBQW5ELEVBQTZERCxJQUE3RCxFQUFtRUksU0FBU0MsUUFBNUU7QUFDQSxLQUFLLGdCQUFnQixPQUFPUCxFQUE1QixFQUFpQztBQUNoQyxNQUFLLGVBQWVFLElBQWYsSUFBdUIsY0FBY0EsSUFBMUMsRUFBaUQ7QUFDaEQsT0FBS0EsUUFBUSxVQUFiLEVBQTBCO0FBQ3pCRixPQUFJLE1BQUosRUFBWSxRQUFaLEVBQXNCRSxJQUF0QixFQUE0QixPQUE1QixFQUFxQ0ksU0FBU0MsUUFBOUM7QUFDQSxJQUZELE1BRU87QUFDTlAsT0FBSSxNQUFKLEVBQVksUUFBWixFQUFzQkUsSUFBdEIsRUFBNEIsT0FBNUIsRUFBcUNJLFNBQVNDLFFBQTlDO0FBQ0E7QUFDRDtBQUNELEVBUkQsTUFRTztBQUNOO0FBQ0E7QUFDRDs7QUFFREMsT0FBUyxzQkFBVCxFQUFrQ0MsS0FBbEMsQ0FBeUMsVUFBVUwsQ0FBVixFQUFjO0FBQ3RELEtBQUlGLE9BQU9FLEVBQUcsSUFBSCxFQUFVRixJQUFWLEdBQWlCUSxJQUFqQixFQUFYO0FBQ0EsS0FBSVAsV0FBVyxLQUFmO0FBQ0FGLFlBQVlDLElBQVosRUFBa0JDLFFBQWxCO0FBQ0EsQ0FKRDs7QUFNQUssT0FBUyx5QkFBVCxFQUFxQ0MsS0FBckMsQ0FBNEMsVUFBVUwsQ0FBVixFQUFjO0FBQ3pELEtBQUlGLE9BQU9FLEVBQUcsSUFBSCxFQUFVRixJQUFWLEdBQWlCUSxJQUFqQixFQUFYO0FBQ0EsS0FBSVAsV0FBVyxRQUFmO0FBQ0FGLFlBQVlDLElBQVosRUFBa0JDLFFBQWxCO0FBQ0EsQ0FKRDs7QUFNQUssT0FBUSx3QkFBUixFQUFtQ0MsS0FBbkMsQ0FBMEMsVUFBVUwsQ0FBVixFQUFjO0FBQ3ZEViw2QkFBNkIsT0FBN0IsRUFBc0MsbUJBQXRDLEVBQTJELE9BQTNELEVBQW9FLEtBQUtpQixJQUF6RTtBQUNBLENBRkQ7QUFHQUgsT0FBUSxpQkFBUixFQUE0QkMsS0FBNUIsQ0FBbUMsVUFBVUwsQ0FBVixFQUFjO0FBQ2hEViw2QkFBNkIsT0FBN0IsRUFBc0Msc0JBQXRDLEVBQThELE9BQTlELEVBQXVFLEtBQUtpQixJQUE1RTtBQUNBLENBRkQ7O0FBSUFILE9BQVEsR0FBUixFQUFhSixFQUFHLGlCQUFILENBQWIsRUFBc0NLLEtBQXRDLENBQTZDLFVBQVVMLENBQVYsRUFBYztBQUMxRCxLQUFJUSxlQUFlUixFQUFFLElBQUYsRUFBUVMsT0FBUixDQUFnQixXQUFoQixFQUE2QkMsSUFBN0IsQ0FBa0MsSUFBbEMsRUFBd0NaLElBQXhDLEVBQW5CO0FBQ0EsS0FBSWEsd0JBQXdCLEVBQTVCO0FBQ0EsS0FBSUgsaUJBQWlCLEVBQXJCLEVBQXlCO0FBQ3hCO0FBQ0EsRUFGRCxNQUVPO0FBQ05HLDBCQUF3QkgsWUFBeEI7QUFDQTtBQUNEbEIsNkJBQTRCLE9BQTVCLEVBQXFDLGNBQXJDLEVBQXFELE9BQXJELEVBQThEcUIscUJBQTlEO0FBQ0EsQ0FURDs7QUFXQVAsT0FBUVEsUUFBUixFQUFtQkMsS0FBbkIsQ0FBMEIsVUFBV2IsQ0FBWCxFQUFlO0FBQ3hDLEtBQUssZ0JBQWdCLE9BQU9jLHdCQUF2QixJQUFtRCxPQUFPQSx5QkFBeUJDLGdCQUF4RixFQUEyRztBQUMxRyxNQUFJeEIsT0FBTyxPQUFYO0FBQ0EsTUFBSUMsV0FBVyxnQkFBZjtBQUNBLE1BQUlFLFFBQVFRLFNBQVNDLFFBQXJCLENBSDBHLENBRzNFO0FBQy9CLE1BQUlWLFNBQVMsU0FBYjtBQUNBLE1BQUssU0FBU3FCLHlCQUF5QkUsWUFBekIsQ0FBc0NDLFVBQXBELEVBQWlFO0FBQ2hFeEIsWUFBUyxPQUFUO0FBQ0E7QUFDREgsOEJBQTZCQyxJQUE3QixFQUFtQ0MsUUFBbkMsRUFBNkNDLE1BQTdDLEVBQXFEQyxLQUFyRDtBQUNBO0FBQ0QsQ0FYRDs7O0FDaEVBVSxPQUFRUSxRQUFSLEVBQW1CQyxLQUFuQixDQUEwQixVQUFVYixDQUFWLEVBQWM7QUFDdkM7O0FBQ0EsS0FBS0EsRUFBRSw4QkFBRixFQUFrQ2tCLE1BQWxDLEdBQTJDLENBQWhELEVBQW9EO0FBQ25EbEIsSUFBRSx1Q0FBRixFQUEyQ21CLE1BQTNDLENBQWtELG9DQUFsRDtBQUNBbkIsSUFBRSxtQ0FBRixFQUF1Q29CLE1BQXZDLENBQThDLFVBQVNDLEtBQVQsRUFBZ0I7QUFDN0QsT0FBSUMsT0FBTyxJQUFYO0FBQ0FELFNBQU1FLGNBQU4sR0FGNkQsQ0FFckM7QUFDeEIsT0FBSUMsU0FBU3hCLEVBQUUsUUFBRixFQUFZLElBQVosQ0FBYjtBQUNBd0IsVUFBT0MsSUFBUCxDQUFZLFVBQVosRUFBd0IsSUFBeEI7QUFDQUQsVUFBTzFCLElBQVAsQ0FBWSxZQUFaO0FBQ0E7QUFDQSxPQUFJNEIsaUJBQWlCMUIsRUFBRSxJQUFGLEVBQVEyQixTQUFSLEVBQXJCO0FBQ0E7QUFDQUQsb0JBQWlCQSxpQkFBaUIsNkJBQWxDO0FBQ0ExQixLQUFFNEIsSUFBRixDQUFPO0FBQ05DLFNBQUtDLE9BQU9DLE9BRE4sRUFDZTtBQUNyQnhDLFVBQU0sTUFGQTtBQUdOeUMsY0FBVyxNQUhMO0FBSU5DLFVBQU1QO0FBSkEsSUFBUCxFQU1DUSxJQU5ELENBTU0sVUFBU0MsUUFBVCxFQUFtQjtBQUFFO0FBQzFCLFFBQUlDLFVBQVUsRUFBZDtBQUNBLFFBQUtELFNBQVNFLE9BQVQsS0FBcUIsSUFBMUIsRUFBaUM7QUFDaENyQyxPQUFFLFVBQUYsRUFBY3NCLElBQWQsRUFBb0JnQixJQUFwQjtBQUNBZCxZQUFPMUIsSUFBUCxDQUFZLFFBQVo7QUFDQSxTQUFJeUMsbUJBQW1CLFFBQXZCO0FBQ0EsYUFBUUosU0FBU0YsSUFBVCxDQUFjTyxXQUF0QjtBQUNDLFdBQUssVUFBTDtBQUNDRCwwQkFBbUIsUUFBbkI7QUFDQUgsaUJBQVUsbUZBQVY7QUFDQTtBQUNELFdBQUssS0FBTDtBQUNDRywwQkFBbUIsUUFBbkI7QUFDQUgsaUJBQVUsaURBQVY7QUFDQTtBQUNELFdBQUssU0FBTDtBQUNDRywwQkFBbUIsUUFBbkI7QUFDQUgsaUJBQVUsZ0pBQVY7QUFDQTtBQVpGO0FBY0EsU0FBSyxlQUFlLE9BQU85QywyQkFBM0IsRUFBeUQ7QUFDeERBLGtDQUE2QixPQUE3QixFQUFzQyxZQUF0QyxFQUFvRGlELGdCQUFwRCxFQUFzRXJDLFNBQVNDLFFBQS9FO0FBQ0E7QUFDRCxLQXJCRCxNQXFCTztBQUNOcUIsWUFBT0MsSUFBUCxDQUFZLFVBQVosRUFBd0IsS0FBeEI7QUFDQUQsWUFBTzFCLElBQVAsQ0FBWSxXQUFaO0FBQ0EsU0FBSyxlQUFlLE9BQU9SLDJCQUEzQixFQUF5RDtBQUN4REEsa0NBQTZCLE9BQTdCLEVBQXNDLFlBQXRDLEVBQW9ELE1BQXBELEVBQTREWSxTQUFTQyxRQUFyRTtBQUNBO0FBQ0Q7QUFDREgsTUFBRSxpQkFBRixFQUFxQnlDLElBQXJCLENBQTBCLHFEQUFxREwsT0FBckQsR0FBK0QsUUFBekY7QUFDQSxJQXJDRCxFQXNDQ00sSUF0Q0QsQ0FzQ00sVUFBU1AsUUFBVCxFQUFtQjtBQUN4Qm5DLE1BQUUsaUJBQUYsRUFBcUJ5QyxJQUFyQixDQUEwQiwrRkFBMUI7QUFDQWpCLFdBQU9DLElBQVAsQ0FBWSxVQUFaLEVBQXdCLEtBQXhCO0FBQ0FELFdBQU8xQixJQUFQLENBQVksV0FBWjtBQUNBLFFBQUssZUFBZSxPQUFPUiwyQkFBM0IsRUFBeUQ7QUFDeERBLGlDQUE2QixPQUE3QixFQUFzQyxZQUF0QyxFQUFvRCxNQUFwRCxFQUE0RFksU0FBU0MsUUFBckU7QUFDQTtBQUNELElBN0NELEVBOENDd0MsTUE5Q0QsQ0E4Q1EsWUFBVztBQUNsQnRCLFVBQU11QixNQUFOLENBQWFDLEtBQWI7QUFDQSxJQWhERDtBQWlEQSxHQTNERDtBQTREQTtBQUNELENBakVEOzs7QUNBQTs7Ozs7O0FBTUEsQ0FBRSxZQUFXO0FBQ1osS0FBSUMsU0FBSixFQUFldEIsTUFBZixFQUF1QnVCLElBQXZCLEVBQTZCQyxLQUE3QixFQUFvQ0MsQ0FBcEMsRUFBdUNDLEdBQXZDOztBQUVBSixhQUFZbEMsU0FBU3VDLGNBQVQsQ0FBeUIsb0JBQXpCLENBQVo7QUFDQSxLQUFLLENBQUVMLFNBQVAsRUFBbUI7QUFDbEI7QUFDQTs7QUFFRHRCLFVBQVNzQixVQUFVTSxvQkFBVixDQUFnQyxRQUFoQyxFQUEyQyxDQUEzQyxDQUFUO0FBQ0EsS0FBSyxnQkFBZ0IsT0FBTzVCLE1BQTVCLEVBQXFDO0FBQ3BDO0FBQ0E7O0FBRUR1QixRQUFPRCxVQUFVTSxvQkFBVixDQUFnQyxJQUFoQyxFQUF1QyxDQUF2QyxDQUFQOztBQUVBO0FBQ0EsS0FBSyxnQkFBZ0IsT0FBT0wsSUFBNUIsRUFBbUM7QUFDbEN2QixTQUFPNkIsS0FBUCxDQUFhQyxPQUFiLEdBQXVCLE1BQXZCO0FBQ0E7QUFDQTs7QUFFRFAsTUFBS1EsWUFBTCxDQUFtQixlQUFuQixFQUFvQyxPQUFwQztBQUNBLEtBQUssQ0FBQyxDQUFELEtBQU9SLEtBQUtTLFNBQUwsQ0FBZUMsT0FBZixDQUF3QixNQUF4QixDQUFaLEVBQStDO0FBQzlDVixPQUFLUyxTQUFMLElBQWtCLE9BQWxCO0FBQ0E7O0FBRURoQyxRQUFPa0MsT0FBUCxHQUFpQixZQUFXO0FBQzNCLE1BQUssQ0FBQyxDQUFELEtBQU9aLFVBQVVVLFNBQVYsQ0FBb0JDLE9BQXBCLENBQTZCLFNBQTdCLENBQVosRUFBdUQ7QUFDdERYLGFBQVVVLFNBQVYsR0FBc0JWLFVBQVVVLFNBQVYsQ0FBb0JHLE9BQXBCLENBQTZCLFVBQTdCLEVBQXlDLEVBQXpDLENBQXRCO0FBQ0FuQyxVQUFPK0IsWUFBUCxDQUFxQixlQUFyQixFQUFzQyxPQUF0QztBQUNBUixRQUFLUSxZQUFMLENBQW1CLGVBQW5CLEVBQW9DLE9BQXBDO0FBQ0EsR0FKRCxNQUlPO0FBQ05ULGFBQVVVLFNBQVYsSUFBdUIsVUFBdkI7QUFDQWhDLFVBQU8rQixZQUFQLENBQXFCLGVBQXJCLEVBQXNDLE1BQXRDO0FBQ0FSLFFBQUtRLFlBQUwsQ0FBbUIsZUFBbkIsRUFBb0MsTUFBcEM7QUFDQTtBQUNELEVBVkQ7O0FBWUE7QUFDQVAsU0FBV0QsS0FBS0ssb0JBQUwsQ0FBMkIsR0FBM0IsQ0FBWDs7QUFFQTtBQUNBLE1BQU1ILElBQUksQ0FBSixFQUFPQyxNQUFNRixNQUFNOUIsTUFBekIsRUFBaUMrQixJQUFJQyxHQUFyQyxFQUEwQ0QsR0FBMUMsRUFBZ0Q7QUFDL0NELFFBQU1DLENBQU4sRUFBU1csZ0JBQVQsQ0FBMkIsT0FBM0IsRUFBb0NDLFdBQXBDLEVBQWlELElBQWpEO0FBQ0FiLFFBQU1DLENBQU4sRUFBU1csZ0JBQVQsQ0FBMkIsTUFBM0IsRUFBbUNDLFdBQW5DLEVBQWdELElBQWhEO0FBQ0E7O0FBRUQ7OztBQUdBLFVBQVNBLFdBQVQsR0FBdUI7QUFDdEIsTUFBSUMsT0FBTyxJQUFYOztBQUVBO0FBQ0EsU0FBUSxDQUFDLENBQUQsS0FBT0EsS0FBS04sU0FBTCxDQUFlQyxPQUFmLENBQXdCLE1BQXhCLENBQWYsRUFBa0Q7O0FBRWpEO0FBQ0EsT0FBSyxTQUFTSyxLQUFLQyxPQUFMLENBQWFDLFdBQWIsRUFBZCxFQUEyQztBQUMxQyxRQUFLLENBQUMsQ0FBRCxLQUFPRixLQUFLTixTQUFMLENBQWVDLE9BQWYsQ0FBd0IsT0FBeEIsQ0FBWixFQUFnRDtBQUMvQ0ssVUFBS04sU0FBTCxHQUFpQk0sS0FBS04sU0FBTCxDQUFlRyxPQUFmLENBQXdCLFFBQXhCLEVBQWtDLEVBQWxDLENBQWpCO0FBQ0EsS0FGRCxNQUVPO0FBQ05HLFVBQUtOLFNBQUwsSUFBa0IsUUFBbEI7QUFDQTtBQUNEOztBQUVETSxVQUFPQSxLQUFLRyxhQUFaO0FBQ0E7QUFDRDs7QUFFRDs7O0FBR0UsWUFBVW5CLFNBQVYsRUFBc0I7QUFDdkIsTUFBSW9CLFlBQUo7QUFBQSxNQUFrQmpCLENBQWxCO0FBQUEsTUFDQ2tCLGFBQWFyQixVQUFVc0IsZ0JBQVYsQ0FBNEIsMERBQTVCLENBRGQ7O0FBR0EsTUFBSyxrQkFBa0JDLE1BQXZCLEVBQWdDO0FBQy9CSCxrQkFBZSxzQkFBVUksQ0FBVixFQUFjO0FBQzVCLFFBQUlDLFdBQVcsS0FBS0MsVUFBcEI7QUFBQSxRQUFnQ3ZCLENBQWhDOztBQUVBLFFBQUssQ0FBRXNCLFNBQVNFLFNBQVQsQ0FBbUJDLFFBQW5CLENBQTZCLE9BQTdCLENBQVAsRUFBZ0Q7QUFDL0NKLE9BQUUvQyxjQUFGO0FBQ0EsVUFBTTBCLElBQUksQ0FBVixFQUFhQSxJQUFJc0IsU0FBU0MsVUFBVCxDQUFvQkcsUUFBcEIsQ0FBNkJ6RCxNQUE5QyxFQUFzRCxFQUFFK0IsQ0FBeEQsRUFBNEQ7QUFDM0QsVUFBS3NCLGFBQWFBLFNBQVNDLFVBQVQsQ0FBb0JHLFFBQXBCLENBQTZCMUIsQ0FBN0IsQ0FBbEIsRUFBb0Q7QUFDbkQ7QUFDQTtBQUNEc0IsZUFBU0MsVUFBVCxDQUFvQkcsUUFBcEIsQ0FBNkIxQixDQUE3QixFQUFnQ3dCLFNBQWhDLENBQTBDRyxNQUExQyxDQUFrRCxPQUFsRDtBQUNBO0FBQ0RMLGNBQVNFLFNBQVQsQ0FBbUJJLEdBQW5CLENBQXdCLE9BQXhCO0FBQ0EsS0FURCxNQVNPO0FBQ05OLGNBQVNFLFNBQVQsQ0FBbUJHLE1BQW5CLENBQTJCLE9BQTNCO0FBQ0E7QUFDRCxJQWZEOztBQWlCQSxRQUFNM0IsSUFBSSxDQUFWLEVBQWFBLElBQUlrQixXQUFXakQsTUFBNUIsRUFBb0MsRUFBRStCLENBQXRDLEVBQTBDO0FBQ3pDa0IsZUFBV2xCLENBQVgsRUFBY1csZ0JBQWQsQ0FBZ0MsWUFBaEMsRUFBOENNLFlBQTlDLEVBQTRELEtBQTVEO0FBQ0E7QUFDRDtBQUNELEVBMUJDLEVBMEJDcEIsU0ExQkQsQ0FBRjtBQTJCQSxDQW5HRDs7QUFxR0E7QUFDQTFDLE9BQVFRLFFBQVIsRUFBbUJDLEtBQW5CLENBQTBCLFVBQVViLENBQVYsRUFBYztBQUN2QztBQUNBLEtBQUlBLEVBQUUseUJBQUYsRUFBNkJrQixNQUE3QixHQUFzQyxDQUExQyxFQUE4QztBQUM3Q2xCLElBQUUsK0JBQUYsRUFBbUM4RSxFQUFuQyxDQUF1QyxPQUF2QyxFQUFnRCxVQUFTekQsS0FBVCxFQUFnQjtBQUMvRHJCLEtBQUUseUJBQUYsRUFBNkIrRSxXQUE3QixDQUEwQyxTQUExQztBQUNBMUQsU0FBTUUsY0FBTjtBQUNBLEdBSEQ7QUFJQTtBQUVELENBVEQiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApIHtcblx0aWYgKCB0eXBlb2YgZ2EgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdGlmICggdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKSB7XG5cblx0Ly8gaWYgYSBub3QgbG9nZ2VkIGluIHVzZXIgdHJpZXMgdG8gZW1haWwsIGRvbid0IGNvdW50IHRoYXQgYXMgYSBzaGFyZVxuXHRpZiAoICEgJCggJ2JvZHkgJykuaGFzQ2xhc3MoICdsb2dnZWQtaW4nKSAmJiAnRW1haWwnID09PSB0ZXh0ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIHRyYWNrIGFzIGFuIGV2ZW50LCBhbmQgYXMgc29jaWFsIGlmIGl0IGlzIHR3aXR0ZXIgb3IgZmJcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2hhcmUgLSAnICsgcG9zaXRpb24sIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgfHwgJ1R3aXR0ZXInID09PSB0ZXh0ICkge1xuXHRcdFx0aWYgKCB0ZXh0ID09ICdGYWNlYm9vaycgKSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnU2hhcmUnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdUd2VldCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG5qUXVlcnkgKCAnLm0tZW50cnktc2hhcmUtdG9wIGEnICkuY2xpY2soIGZ1bmN0aW9uKCAkICkge1xuXHR2YXIgdGV4dCA9ICQoIHRoaXMgKS50ZXh0KCkudHJpbSgpO1xuXHR2YXIgcG9zaXRpb24gPSAndG9wJztcblx0dHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcbn0pO1xuXG5qUXVlcnkgKCAnLm0tZW50cnktc2hhcmUtYm90dG9tIGEnICkuY2xpY2soIGZ1bmN0aW9uKCAkICkge1xuXHR2YXIgdGV4dCA9ICQoIHRoaXMgKS50ZXh0KCkudHJpbSgpO1xuXHR2YXIgcG9zaXRpb24gPSAnYm90dG9tJztcblx0dHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcbn0pO1xuXG5qUXVlcnkoICcjbmF2aWdhdGlvbi1mZWF0dXJlZCBhJyApLmNsaWNrKCBmdW5jdGlvbiggJCApIHtcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnRmVhdHVyZWQgQmFyIExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcbn0pO1xualF1ZXJ5KCAnYS5nbGVhbi1zaWRlYmFyJyApLmNsaWNrKCBmdW5jdGlvbiggJCApIHtcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBTdXBwb3J0IExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcbn0pO1xuXG5qUXVlcnkoICdhJywgJCggJyNvLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbiggJCApIHtcblx0dmFyIHdpZGdldF90aXRsZSA9ICQodGhpcykuY2xvc2VzdCgnLm0td2lkZ2V0JykuZmluZCgnaDMnKS50ZXh0KCk7XG5cdHZhciBzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSAnJztcblx0aWYgKHdpZGdldF90aXRsZSA9PT0gJycpIHtcblx0XHQvL3NpZGViYXJfc2VjdGlvbl90aXRsZSA9ICQodGhpcykuY2xvc2VzdCgnLm5vZGUtdHlwZS1zcGlsbCcpLmZpbmQoJy5ub2RlLXRpdGxlIGEnKS50ZXh0KCk7XG5cdH0gZWxzZSB7XG5cdFx0c2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gd2lkZ2V0X3RpdGxlO1xuXHR9XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCgnZXZlbnQnLCAnU2lkZWJhciBMaW5rJywgJ0NsaWNrJywgc2lkZWJhcl9zZWN0aW9uX3RpdGxlKTtcbn0pO1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uICggJCApIHtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSAmJiAnJyAhPT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLnVybF9hY2Nlc3NfbGV2ZWwgKSB7XG5cdFx0dmFyIHR5cGUgPSAnZXZlbnQnO1xuXHRcdHZhciBjYXRlZ29yeSA9ICdNZW1iZXIgQ29udGVudCc7XG5cdFx0dmFyIGxhYmVsID0gbG9jYXRpb24ucGF0aG5hbWU7IC8vIGkgdGhpbmsgd2UgY291bGQgcG9zc2libHkgcHV0IHNvbWUgZ3JvdXBpbmcgaGVyZSwgYnV0IHdlIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYWNjZXNzIHRvIG9uZSBhbmQgbWF5YmUgaXQncyBub3Qgd29ydGh3aGlsZSB5ZXRcblx0XHR2YXIgYWN0aW9uID0gJ0Jsb2NrZWQnO1xuXHRcdGlmICggdHJ1ZSA9PT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLmN1cnJlbnRfdXNlci5jYW5fYWNjZXNzICkge1xuXHRcdFx0YWN0aW9uID0gJ1Nob3duJztcblx0XHR9XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHR9XG59KTtcbiIsImpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXHRpZiAoICQoJy5tLWZvcm0tbmV3c2xldHRlci1zaG9ydGNvZGUnKS5sZW5ndGggPiAwICkge1xuXHRcdCQoJy5tLWZvcm0tbmV3c2xldHRlci1zaG9ydGNvZGUgZmllbGRzZXQnKS5iZWZvcmUoJzxkaXYgY2xhc3M9XCJtLWhvbGQtbWVzc2FnZVwiPjwvZGl2PicpO1xuXHRcdCQoJy5tLWZvcm0tbmV3c2xldHRlci1zaG9ydGNvZGUgZm9ybScpLnN1Ym1pdChmdW5jdGlvbihldmVudCkge1xuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gUHJldmVudCB0aGUgZGVmYXVsdCBmb3JtIHN1Ym1pdC5cblx0XHRcdHZhciBidXR0b24gPSAkKCdidXR0b24nLCB0aGlzKTtcblx0XHRcdGJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdFx0YnV0dG9uLnRleHQoJ1Byb2Nlc3NpbmcnKTtcblx0XHRcdC8vIHNlcmlhbGl6ZSB0aGUgZm9ybSBkYXRhXG5cdFx0XHR2YXIgYWpheF9mb3JtX2RhdGEgPSAkKHRoaXMpLnNlcmlhbGl6ZSgpO1xuXHRcdFx0Ly9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBhamF4X2Zvcm1fZGF0YSArICcmYWpheHJlcXVlc3Q9dHJ1ZSZzdWJzY3JpYmUnO1xuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dXJsOiBwYXJhbXMuYWpheHVybCwgLy8gZG9tYWluL3dwLWFkbWluL2FkbWluLWFqYXgucGhwXG5cdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0ZGF0YVR5cGUgOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhfZm9ybV9kYXRhXG5cdFx0XHR9KVxuXHRcdFx0LmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHsgLy8gcmVzcG9uc2UgZnJvbSB0aGUgUEhQIGFjdGlvblxuXHRcdFx0XHR2YXIgbWVzc2FnZSA9ICcnO1xuXHRcdFx0XHRpZiAoIHJlc3BvbnNlLnN1Y2Nlc3MgPT09IHRydWUgKSB7XG5cdFx0XHRcdFx0JCgnZmllbGRzZXQnLCB0aGF0KS5oaWRlKCk7XG5cdFx0XHRcdFx0YnV0dG9uLnRleHQoJ1RoYW5rcycpO1xuXHRcdFx0XHRcdHZhciBhbmFseXRpY3NfYWN0aW9uID0gJ1NpZ251cCc7XG5cdFx0XHRcdFx0c3dpdGNoIChyZXNwb25zZS5kYXRhLnVzZXJfc3RhdHVzKSB7XG5cdFx0XHRcdFx0XHRjYXNlICdleGlzdGluZyc6XG5cdFx0XHRcdFx0XHRcdGFuYWx5dGljc19hY3Rpb24gPSAnVXBkYXRlJztcblx0XHRcdFx0XHRcdFx0bWVzc2FnZSA9ICdUaGFua3MgZm9yIHVwZGF0aW5nIHlvdXIgZW1haWwgcHJlZmVyZW5jZXMuIFRoZXkgd2lsbCBnbyBpbnRvIGVmZmVjdCBpbW1lZGlhdGVseS4nO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgJ25ldyc6XG5cdFx0XHRcdFx0XHRcdGFuYWx5dGljc19hY3Rpb24gPSAnU2lnbnVwJztcblx0XHRcdFx0XHRcdFx0bWVzc2FnZSA9ICdXZSBoYXZlIGFkZGVkIHlvdSB0byB0aGUgTWlublBvc3QgbWFpbGluZyBsaXN0Lic7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAncGVuZGluZyc6XG5cdFx0XHRcdFx0XHRcdGFuYWx5dGljc19hY3Rpb24gPSAnU2lnbnVwJztcblx0XHRcdFx0XHRcdFx0bWVzc2FnZSA9ICdXZSBoYXZlIGFkZGVkIHlvdSB0byB0aGUgTWlublBvc3QgbWFpbGluZyBsaXN0LiBZb3Ugd2lsbCBuZWVkIHRvIGNsaWNrIHRoZSBjb25maXJtYXRpb24gbGluayBpbiB0aGUgZW1haWwgd2Ugc2VudCB0byBiZWdpbiByZWNlaXZpbmcgbWVzc2FnZXMuJztcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCApIHtcblx0XHRcdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ05ld3NsZXR0ZXInLCBhbmFseXRpY3NfYWN0aW9uLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRidXR0b24ucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0XHRcdFx0YnV0dG9uLnRleHQoJ1N1YnNjcmliZScpO1xuXHRcdFx0XHRcdGlmICggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCApIHtcblx0XHRcdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ05ld3NsZXR0ZXInLCAnRmFpbCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdCQoJy5tLWhvbGQtbWVzc2FnZScpLmh0bWwoJzxkaXYgY2xhc3M9XCJtLWZvcm0tbWVzc2FnZSBtLWZvcm0tbWVzc2FnZS1pbmZvXCI+JyArIG1lc3NhZ2UgKyAnPC9kaXY+Jyk7XG5cdFx0XHR9KVxuXHRcdFx0LmZhaWwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0JCgnLm0taG9sZC1tZXNzYWdlJykuaHRtbCgnPGRpdiBjbGFzcz1cIm0tZm9ybS1tZXNzYWdlIG0tZm9ybS1tZXNzYWdlLWluZm9cIj5BbiBlcnJvciBoYXMgb2NjdXJlZC4gUGxlYXNlIHRyeSBhZ2Fpbi48L2Rpdj4nKTtcblx0XHRcdFx0YnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdFx0XHRidXR0b24udGV4dCgnU3Vic2NyaWJlJyk7XG5cdFx0XHRcdGlmICggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCApIHtcblx0XHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdOZXdzbGV0dGVyJywgJ0ZhaWwnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmFsd2F5cyhmdW5jdGlvbigpIHtcblx0XHRcdFx0ZXZlbnQudGFyZ2V0LnJlc2V0KCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxufSk7IiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogSGFuZGxlcyB0b2dnbGluZyB0aGUgbmF2aWdhdGlvbiBtZW51IGZvciBzbWFsbCBzY3JlZW5zIGFuZCBlbmFibGVzIFRBQiBrZXlcbiAqIG5hdmlnYXRpb24gc3VwcG9ydCBmb3IgZHJvcGRvd24gbWVudXMuXG4gKi9cbiggZnVuY3Rpb24oKSB7XG5cdHZhciBjb250YWluZXIsIGJ1dHRvbiwgbWVudSwgbGlua3MsIGksIGxlbjtcblxuXHRjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ25hdmlnYXRpb24tcHJpbWFyeScgKTtcblx0aWYgKCAhIGNvbnRhaW5lciApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRidXR0b24gPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdidXR0b24nIClbMF07XG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBidXR0b24gKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bWVudSA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ3VsJyApWzBdO1xuXG5cdC8vIEhpZGUgbWVudSB0b2dnbGUgYnV0dG9uIGlmIG1lbnUgaXMgZW1wdHkgYW5kIHJldHVybiBlYXJseS5cblx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG1lbnUgKSB7XG5cdFx0YnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRpZiAoIC0xID09PSBtZW51LmNsYXNzTmFtZS5pbmRleE9mKCAnbWVudScgKSApIHtcblx0XHRtZW51LmNsYXNzTmFtZSArPSAnIG1lbnUnO1xuXHR9XG5cblx0YnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIC0xICE9PSBjb250YWluZXIuY2xhc3NOYW1lLmluZGV4T2YoICd0b2dnbGVkJyApICkge1xuXHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IGNvbnRhaW5lci5jbGFzc05hbWUucmVwbGFjZSggJyB0b2dnbGVkJywgJycgKTtcblx0XHRcdGJ1dHRvbi5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRcdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb250YWluZXIuY2xhc3NOYW1lICs9ICcgdG9nZ2xlZCc7XG5cdFx0XHRidXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyApO1xuXHRcdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEdldCBhbGwgdGhlIGxpbmsgZWxlbWVudHMgd2l0aGluIHRoZSBtZW51LlxuXHRsaW5rcyAgICA9IG1lbnUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdhJyApO1xuXG5cdC8vIEVhY2ggdGltZSBhIG1lbnUgbGluayBpcyBmb2N1c2VkIG9yIGJsdXJyZWQsIHRvZ2dsZSBmb2N1cy5cblx0Zm9yICggaSA9IDAsIGxlbiA9IGxpbmtzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdGxpbmtzW2ldLmFkZEV2ZW50TGlzdGVuZXIoICdmb2N1cycsIHRvZ2dsZUZvY3VzLCB0cnVlICk7XG5cdFx0bGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ2JsdXInLCB0b2dnbGVGb2N1cywgdHJ1ZSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgb3IgcmVtb3ZlcyAuZm9jdXMgY2xhc3Mgb24gYW4gZWxlbWVudC5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZUZvY3VzKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdC8vIE1vdmUgdXAgdGhyb3VnaCB0aGUgYW5jZXN0b3JzIG9mIHRoZSBjdXJyZW50IGxpbmsgdW50aWwgd2UgaGl0IC5uYXYtbWVudS5cblx0XHR3aGlsZSAoIC0xID09PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnbWVudScgKSApIHtcblxuXHRcdFx0Ly8gT24gbGkgZWxlbWVudHMgdG9nZ2xlIHRoZSBjbGFzcyAuZm9jdXMuXG5cdFx0XHRpZiAoICdsaScgPT09IHNlbGYudGFnTmFtZS50b0xvd2VyQ2FzZSgpICkge1xuXHRcdFx0XHRpZiAoIC0xICE9PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnZm9jdXMnICkgKSB7XG5cdFx0XHRcdFx0c2VsZi5jbGFzc05hbWUgPSBzZWxmLmNsYXNzTmFtZS5yZXBsYWNlKCAnIGZvY3VzJywgJycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWxmLmNsYXNzTmFtZSArPSAnIGZvY3VzJztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRzZWxmID0gc2VsZi5wYXJlbnRFbGVtZW50O1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUb2dnbGVzIGBmb2N1c2AgY2xhc3MgdG8gYWxsb3cgc3VibWVudSBhY2Nlc3Mgb24gdGFibGV0cy5cblx0ICovXG5cdCggZnVuY3Rpb24oIGNvbnRhaW5lciApIHtcblx0XHR2YXIgdG91Y2hTdGFydEZuLCBpLFxuXHRcdFx0cGFyZW50TGluayA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCAnLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4gPiBhLCAucGFnZV9pdGVtX2hhc19jaGlsZHJlbiA+IGEnICk7XG5cblx0XHRpZiAoICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyApIHtcblx0XHRcdHRvdWNoU3RhcnRGbiA9IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgbWVudUl0ZW0gPSB0aGlzLnBhcmVudE5vZGUsIGk7XG5cblx0XHRcdFx0aWYgKCAhIG1lbnVJdGVtLmNsYXNzTGlzdC5jb250YWlucyggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW4ubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1lbnVJdGVtID09PSBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldICkge1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW5baV0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtZW51SXRlbS5jbGFzc0xpc3QuYWRkKCAnZm9jdXMnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRmb3IgKCBpID0gMDsgaSA8IHBhcmVudExpbmsubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdHBhcmVudExpbmtbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCB0b3VjaFN0YXJ0Rm4sIGZhbHNlICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KCBjb250YWluZXIgKSApO1xufSApKCk7XG5cbi8vIHVzZXIgYWNjb3VudCBuYXZpZ2F0aW9uIGNhbiBiZSBhIGRyb3Bkb3duXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXHQvLyBoaWRlIG1lbnVcblx0aWYgKCQoJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJykubGVuZ3RoID4gMCApIHtcblx0XHQkKCcjdXNlci1hY2NvdW50LWFjY2VzcyA+IGxpID4gYScpLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0JCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgdWwnKS50b2dnbGVDbGFzcyggJ3Zpc2libGUnICk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0pO1xuXHR9XG5cbn0pO1xuIl19
