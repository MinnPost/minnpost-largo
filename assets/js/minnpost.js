"use strict";

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
  if (!jQuery('body ').hasClass('logged-in') && 'Email' === text) {
    return;
  } // track as an event, and as social if it is twitter or fb


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

(function ($) {
  $('.m-entry-share-top a').click(function (e) {
    var text = $(this).text().trim();
    var position = 'top';
    trackShare(text, position);
  });
  $('.m-entry-share-bottom a').click(function (e) {
    var text = $(this).text().trim();
    var position = 'bottom';
    trackShare(text, position);
  });
  $('#navigation-featured a').click(function (e) {
    mp_analytics_tracking_event('event', 'Featured Bar Link', 'Click', this.href);
  });
  $('a.glean-sidebar').click(function (e) {
    mp_analytics_tracking_event('event', 'Sidebar Support Link', 'Click', this.href);
  });
  $('a', $('.o-site-sidebar')).click(function (e) {
    var widget_title = $(this).closest('.m-widget').find('h3').text();
    var sidebar_section_title = '';

    if (widget_title === '') {//sidebar_section_title = $(this).closest('.node-type-spill').find('.node-title a').text();
    } else {
      sidebar_section_title = widget_title;
    }

    mp_analytics_tracking_event('event', 'Sidebar Link', 'Click', sidebar_section_title);
  });
  $(document).ready(function (e) {
    if ('undefined' !== typeof PUM) {
      var current_popup = PUM.getPopup($('.pum'));
      var settings = PUM.getSettings($('.pum'));
      var popup_id = settings.id;
      $(document).on('pumAfterOpen', function () {
        mp_analytics_tracking_event('event', 'Popup', 'Show', popup_id, {
          'nonInteraction': 1
        });
      });
      $(document).on('pumAfterClose', function () {
        var close_trigger = $.fn.popmake.last_close_trigger;

        if ('undefined' !== typeof close_trigger) {
          mp_analytics_tracking_event('event', 'Popup', close_trigger, popup_id, {
            'nonInteraction': 1
          });
        }
      });
      $('.message-close').click(function (e) {
        // user clicks link with close class
        var close_trigger = 'Close Button';
        mp_analytics_tracking_event('event', 'Popup', close_trigger, popup_id, {
          'nonInteraction': 1
        });
      });
      $('.message-login').click(function (e) {
        // user clicks link with login class
        var url = $(this).attr('href');
        mp_analytics_tracking_event('event', 'Popup', 'Login Link', url);
      });
      $('.pum-content a:not( .message-close, .pum-close, .message-login )').click(function (e) {
        // user clicks something that is not close text or close icon
        mp_analytics_tracking_event('event', 'Popup', 'Click', popup_id);
      });
    }

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
})(jQuery);
"use strict";

function gtag_report_conversion(url) {
  var callback = function callback() {
    if (typeof url != 'undefined') {
      window.location = url;
    }
  };

  gtag('event', 'conversion', {
    'send_to': 'AW-976620175/jqCyCL7atXkQj5XY0QM',
    'event_callback': callback
  });
  return false;
}

function manageEmails() {
  var nextEmailCount = 1;
  var emailToRemove = '';
  var consolidatedEmails = [];
  /*if ( $('.m-user-email-list').length > 0 ) {
  	// if a user removes an email, take it away from the visual and from the form
  	$('.a-form-caption.a-remove-email').change( function( event ) {
  		emailToRemove = $(this).val();
  		$( this ).parents( 'li' ).remove();
  	});
  	nextEmailCount = $('.m-user-email-list li').length;
  }*/
  // if a user wants to add an email, give them a properly numbered field

  $('.a-form-caption.a-add-email').click(function (event) {
    event.preventDefault();
    $('.a-form-caption.a-add-email').before('<input type="email" name="_consolidated_emails_array[' + nextEmailCount + ']" id="_consolidated_emails_array[' + nextEmailCount + ']" value="">');
    nextEmailCount++;
  });
}

jQuery(document).ready(function ($) {
  "use strict";

  if ($('.m-form-email').length > 0) {
    manageEmails();
  }

  if ($('.m-form-newsletter-shortcode').length > 0) {
    $('.m-form-newsletter-shortcode fieldset').before('<div class="m-hold-message"></div>');
    $('.m-form-newsletter-shortcode form').submit(function (event) {
      var that = this;
      event.preventDefault(); // Prevent the default form submit.

      var button = $('button', this);
      button.prop('disabled', true);
      button.text('Processing'); // serialize the form data

      var ajax_form_data = $(this).serialize(); //add our own ajax check as X-Requested-With is not always reliable

      ajax_form_data = ajax_form_data + '&ajaxrequest=true&subscribe';
      $.ajax({
        url: params.ajaxurl,
        // domain/wp-admin/admin-ajax.php
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

          if (response.data.confirm_message !== '') {
            message = response.data.confirm_message;
          }

          if ('function' === typeof mp_analytics_tracking_event) {
            mp_analytics_tracking_event('event', 'Newsletter', analytics_action, location.pathname);
            gtag_report_conversion(location.pathname);
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
"use strict";

/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
jQuery(document).ready(function ($) {
  var container, button, menu, links, i, len;
  container = document.getElementById('navigation-primary');

  if (!container) {
    return;
  }

  button = container.getElementsByTagName('button')[0];

  if ('undefined' === typeof button) {
    return;
  }

  menu = container.getElementsByTagName('ul')[0]; // Hide menu toggle button if menu is empty and return early.

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
  }; // Get all the link elements within the menu.


  links = menu.getElementsByTagName('a'); // Each time a menu link is focused or blurred, toggle focus.

  for (i = 0, len = links.length; i < len; i++) {
    links[i].addEventListener('focus', toggleFocus, true);
    links[i].addEventListener('blur', toggleFocus, true);
  }
  /**
   * Sets or removes .focus class on an element.
   */


  function toggleFocus() {
    var self = this; // Move up through the ancestors of the current link until we hit .nav-menu.

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
}); // user account navigation can be a dropdown

jQuery(document).ready(function ($) {
  // hide menu
  if ($('#user-account-access ul').length > 0) {
    $('#user-account-access > li > a').on('click', function (event) {
      $('#user-account-access ul').toggleClass('visible');
      event.preventDefault();
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuYWx5dGljcy5qcyIsImZvcm1zLmpzIiwibmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6WyJtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsInZhbHVlIiwiZ2EiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiJCIsImNsaWNrIiwiZSIsInRyaW0iLCJocmVmIiwid2lkZ2V0X3RpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJkb2N1bWVudCIsInJlYWR5IiwiUFVNIiwiY3VycmVudF9wb3B1cCIsImdldFBvcHVwIiwic2V0dGluZ3MiLCJnZXRTZXR0aW5ncyIsInBvcHVwX2lkIiwiaWQiLCJvbiIsImNsb3NlX3RyaWdnZXIiLCJmbiIsInBvcG1ha2UiLCJsYXN0X2Nsb3NlX3RyaWdnZXIiLCJ1cmwiLCJhdHRyIiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJndGFnX3JlcG9ydF9jb252ZXJzaW9uIiwiY2FsbGJhY2siLCJ3aW5kb3ciLCJndGFnIiwibWFuYWdlRW1haWxzIiwibmV4dEVtYWlsQ291bnQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImJlZm9yZSIsImxlbmd0aCIsInN1Ym1pdCIsInRoYXQiLCJidXR0b24iLCJwcm9wIiwiYWpheF9mb3JtX2RhdGEiLCJzZXJpYWxpemUiLCJhamF4IiwicGFyYW1zIiwiYWpheHVybCIsImRhdGFUeXBlIiwiZGF0YSIsImRvbmUiLCJyZXNwb25zZSIsIm1lc3NhZ2UiLCJzdWNjZXNzIiwiaGlkZSIsImFuYWx5dGljc19hY3Rpb24iLCJ1c2VyX3N0YXR1cyIsImNvbmZpcm1fbWVzc2FnZSIsImh0bWwiLCJmYWlsIiwiYWx3YXlzIiwidGFyZ2V0IiwicmVzZXQiLCJjb250YWluZXIiLCJtZW51IiwibGlua3MiLCJpIiwibGVuIiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsInN0eWxlIiwiZGlzcGxheSIsInNldEF0dHJpYnV0ZSIsImNsYXNzTmFtZSIsImluZGV4T2YiLCJvbmNsaWNrIiwicmVwbGFjZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0b2dnbGVGb2N1cyIsInNlbGYiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJwYXJlbnRFbGVtZW50IiwidG91Y2hTdGFydEZuIiwicGFyZW50TGluayIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJtZW51SXRlbSIsInBhcmVudE5vZGUiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImNoaWxkcmVuIiwicmVtb3ZlIiwiYWRkIiwidG9nZ2xlQ2xhc3MiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsMkJBQVQsQ0FBc0NDLElBQXRDLEVBQTRDQyxRQUE1QyxFQUFzREMsTUFBdEQsRUFBOERDLEtBQTlELEVBQXFFQyxLQUFyRSxFQUE2RTtBQUM1RSxNQUFLLE9BQU9DLEVBQVAsS0FBYyxXQUFuQixFQUFpQztBQUNoQyxRQUFLLE9BQU9ELEtBQVAsS0FBaUIsV0FBdEIsRUFBb0M7QUFDbkNDLE1BQUFBLEVBQUUsQ0FBRSxNQUFGLEVBQVVMLElBQVYsRUFBZ0JDLFFBQWhCLEVBQTBCQyxNQUExQixFQUFrQ0MsS0FBbEMsQ0FBRjtBQUNBLEtBRkQsTUFFTztBQUNORSxNQUFBQSxFQUFFLENBQUUsTUFBRixFQUFVTCxJQUFWLEVBQWdCQyxRQUFoQixFQUEwQkMsTUFBMUIsRUFBa0NDLEtBQWxDLEVBQXlDQyxLQUF6QyxDQUFGO0FBQ0E7QUFDRCxHQU5ELE1BTU87QUFDTjtBQUNBO0FBQ0Q7O0FBRUQsU0FBU0UsVUFBVCxDQUFxQkMsSUFBckIsRUFBMkJDLFFBQTNCLEVBQXNDO0FBRXJDO0FBQ0EsTUFBSyxDQUFF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QyxPQUF2QyxFQUFnRCxVQUFTbUIsS0FBVCxFQUFnQjtBQUMvRHJDLE1BQUFBLENBQUMsQ0FBQyx5QkFBRCxDQUFELENBQTZCK0YsV0FBN0IsQ0FBMEMsU0FBMUM7QUFDQTFELE1BQUFBLEtBQUssQ0FBQ0MsY0FBTjtBQUNBLEtBSEQ7QUFJQTtBQUVELENBVEQiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApIHtcblx0aWYgKCB0eXBlb2YgZ2EgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdGlmICggdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKSB7XG5cblx0Ly8gaWYgYSBub3QgbG9nZ2VkIGluIHVzZXIgdHJpZXMgdG8gZW1haWwsIGRvbid0IGNvdW50IHRoYXQgYXMgYSBzaGFyZVxuXHRpZiAoICEgalF1ZXJ5KCAnYm9keSAnKS5oYXNDbGFzcyggJ2xvZ2dlZC1pbicpICYmICdFbWFpbCcgPT09IHRleHQgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gdHJhY2sgYXMgYW4gZXZlbnQsIGFuZCBhcyBzb2NpYWwgaWYgaXQgaXMgdHdpdHRlciBvciBmYlxuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdTaGFyZSAtICcgKyBwb3NpdGlvbiwgdGV4dCwgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGdhICkge1xuXHRcdGlmICggJ0ZhY2Vib29rJyA9PT0gdGV4dCB8fCAnVHdpdHRlcicgPT09IHRleHQgKSB7XG5cdFx0XHRpZiAoIHRleHQgPT0gJ0ZhY2Vib29rJyApIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdTaGFyZScsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1R3ZWV0JywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbiggZnVuY3Rpb24oICQgKSB7XG5cblx0JCAoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpLnRyaW0oKTtcblx0XHR2YXIgcG9zaXRpb24gPSAndG9wJztcblx0XHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xuXHR9KTtcblxuXHQkICggJy5tLWVudHJ5LXNoYXJlLWJvdHRvbSBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgdGV4dCA9ICQoIHRoaXMgKS50ZXh0KCkudHJpbSgpO1xuXHRcdHZhciBwb3NpdGlvbiA9ICdib3R0b20nO1xuXHRcdHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG5cdH0pO1xuXG5cdCQoICcjbmF2aWdhdGlvbi1mZWF0dXJlZCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdGZWF0dXJlZCBCYXIgTGluaycsICdDbGljaycsIHRoaXMuaHJlZiApO1xuXHR9KTtcblx0JCggJ2EuZ2xlYW4tc2lkZWJhcicgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBTdXBwb3J0IExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcblx0fSk7XG5cblx0JCggJ2EnLCAkKCAnLm8tc2l0ZS1zaWRlYmFyJyApICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdHZhciB3aWRnZXRfdGl0bGUgPSAkKHRoaXMpLmNsb3Nlc3QoJy5tLXdpZGdldCcpLmZpbmQoJ2gzJykudGV4dCgpO1xuXHRcdHZhciBzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSAnJztcblx0XHRpZiAod2lkZ2V0X3RpdGxlID09PSAnJykge1xuXHRcdFx0Ly9zaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSAkKHRoaXMpLmNsb3Nlc3QoJy5ub2RlLXR5cGUtc3BpbGwnKS5maW5kKCcubm9kZS10aXRsZSBhJykudGV4dCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSB3aWRnZXRfdGl0bGU7XG5cdFx0fVxuXHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCgnZXZlbnQnLCAnU2lkZWJhciBMaW5rJywgJ0NsaWNrJywgc2lkZWJhcl9zZWN0aW9uX3RpdGxlKTtcblx0fSk7XG5cblx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24gKCBlICkge1xuXG5cdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIFBVTSApIHtcblx0XHRcdHZhciBjdXJyZW50X3BvcHVwID0gUFVNLmdldFBvcHVwKCAkKCAnLnB1bScgKSApO1xuXHRcdFx0dmFyIHNldHRpbmdzID0gUFVNLmdldFNldHRpbmdzKCAkKCAnLnB1bScgKSApO1xuXHRcdFx0dmFyIHBvcHVwX2lkID0gc2V0dGluZ3MuaWQ7XG5cdFx0XHQkKCBkb2N1bWVudCApLm9uKCdwdW1BZnRlck9wZW4nLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ1Nob3cnLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0gKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggZG9jdW1lbnQgKS5vbigncHVtQWZ0ZXJDbG9zZScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIGNsb3NlX3RyaWdnZXIgPSAkLmZuLnBvcG1ha2UubGFzdF9jbG9zZV90cmlnZ2VyO1xuXHRcdFx0XHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgY2xvc2VfdHJpZ2dlciApIHtcblx0XHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubWVzc2FnZS1jbG9zZScgKS5jbGljayhmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGNsb3NlIGNsYXNzXG5cdFx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJ0Nsb3NlIEJ1dHRvbic7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgY2xvc2VfdHJpZ2dlciwgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9ICk7XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubWVzc2FnZS1sb2dpbicgKS5jbGljayhmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGxvZ2luIGNsYXNzXG5cdFx0XHRcdHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcblx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnTG9naW4gTGluaycsIHVybCApO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLnB1bS1jb250ZW50IGE6bm90KCAubWVzc2FnZS1jbG9zZSwgLnB1bS1jbG9zZSwgLm1lc3NhZ2UtbG9naW4gKScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIHNvbWV0aGluZyB0aGF0IGlzIG5vdCBjbG9zZSB0ZXh0IG9yIGNsb3NlIGljb25cblx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnQ2xpY2snLCBwb3B1cF9pZCApO1xuICAgICAgICAgICAgfSk7XG5cdFx0fVxuXG5cdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSAmJiAnJyAhPT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLnVybF9hY2Nlc3NfbGV2ZWwgKSB7XG5cdFx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0XHR2YXIgY2F0ZWdvcnkgPSAnTWVtYmVyIENvbnRlbnQnO1xuXHRcdFx0dmFyIGxhYmVsID0gbG9jYXRpb24ucGF0aG5hbWU7IC8vIGkgdGhpbmsgd2UgY291bGQgcG9zc2libHkgcHV0IHNvbWUgZ3JvdXBpbmcgaGVyZSwgYnV0IHdlIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYWNjZXNzIHRvIG9uZSBhbmQgbWF5YmUgaXQncyBub3Qgd29ydGh3aGlsZSB5ZXRcblx0XHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0XHRpZiAoIHRydWUgPT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS5jdXJyZW50X3VzZXIuY2FuX2FjY2VzcyApIHtcblx0XHRcdFx0YWN0aW9uID0gJ1Nob3duJztcblx0XHRcdH1cblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9XG5cdH0pO1xuXG59ICkoIGpRdWVyeSApOyIsImZ1bmN0aW9uIGd0YWdfcmVwb3J0X2NvbnZlcnNpb24odXJsKSB7XG5cdHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcblx0ICBpZiAodHlwZW9mKHVybCkgIT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcblx0ICB9XG5cdH07XG5cdGd0YWcoJ2V2ZW50JywgJ2NvbnZlcnNpb24nLCB7XG5cdCAgJ3NlbmRfdG8nOiAnQVctOTc2NjIwMTc1L2pxQ3lDTDdhdFhrUWo1WFkwUU0nLFxuXHQgICdldmVudF9jYWxsYmFjayc6IGNhbGxiYWNrXG5cdH0pO1xuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIG1hbmFnZUVtYWlscygpIHtcblx0dmFyIG5leHRFbWFpbENvdW50ID0gMTtcblx0dmFyIGVtYWlsVG9SZW1vdmUgID0gJyc7XG5cdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0LyppZiAoICQoJy5tLXVzZXItZW1haWwtbGlzdCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0Ly8gaWYgYSB1c2VyIHJlbW92ZXMgYW4gZW1haWwsIHRha2UgaXQgYXdheSBmcm9tIHRoZSB2aXN1YWwgYW5kIGZyb20gdGhlIGZvcm1cblx0XHQkKCcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwnKS5jaGFuZ2UoIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKHRoaXMpLnZhbCgpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5yZW1vdmUoKTtcblx0XHR9KTtcblx0XHRuZXh0RW1haWxDb3VudCA9ICQoJy5tLXVzZXItZW1haWwtbGlzdCBsaScpLmxlbmd0aDtcblx0fSovXG5cdC8vIGlmIGEgdXNlciB3YW50cyB0byBhZGQgYW4gZW1haWwsIGdpdmUgdGhlbSBhIHByb3Blcmx5IG51bWJlcmVkIGZpZWxkXG5cdCQoJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcpLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnKS5iZWZvcmUoJzxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbJyArIG5leHRFbWFpbENvdW50ICsgJ11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5WycgKyBuZXh0RW1haWxDb3VudCArICddXCIgdmFsdWU9XCJcIj4nKVxuXHRcdG5leHRFbWFpbENvdW50Kys7XG5cdH0pO1xufVxuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXHRcInVzZSBzdHJpY3RcIjtcblx0aWYgKCAkKCcubS1mb3JtLWVtYWlsJykubGVuZ3RoID4gMCApIHtcblx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0fVxuXHRpZiAoICQoJy5tLWZvcm0tbmV3c2xldHRlci1zaG9ydGNvZGUnKS5sZW5ndGggPiAwICkge1xuXHRcdCQoJy5tLWZvcm0tbmV3c2xldHRlci1zaG9ydGNvZGUgZmllbGRzZXQnKS5iZWZvcmUoJzxkaXYgY2xhc3M9XCJtLWhvbGQtbWVzc2FnZVwiPjwvZGl2PicpO1xuXHRcdCQoJy5tLWZvcm0tbmV3c2xldHRlci1zaG9ydGNvZGUgZm9ybScpLnN1Ym1pdChmdW5jdGlvbihldmVudCkge1xuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gUHJldmVudCB0aGUgZGVmYXVsdCBmb3JtIHN1Ym1pdC5cblx0XHRcdHZhciBidXR0b24gPSAkKCdidXR0b24nLCB0aGlzKTtcblx0XHRcdGJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdFx0YnV0dG9uLnRleHQoJ1Byb2Nlc3NpbmcnKTtcblx0XHRcdC8vIHNlcmlhbGl6ZSB0aGUgZm9ybSBkYXRhXG5cdFx0XHR2YXIgYWpheF9mb3JtX2RhdGEgPSAkKHRoaXMpLnNlcmlhbGl6ZSgpO1xuXHRcdFx0Ly9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBhamF4X2Zvcm1fZGF0YSArICcmYWpheHJlcXVlc3Q9dHJ1ZSZzdWJzY3JpYmUnO1xuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dXJsOiBwYXJhbXMuYWpheHVybCwgLy8gZG9tYWluL3dwLWFkbWluL2FkbWluLWFqYXgucGhwXG5cdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0ZGF0YVR5cGUgOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhfZm9ybV9kYXRhXG5cdFx0XHR9KVxuXHRcdFx0LmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHsgLy8gcmVzcG9uc2UgZnJvbSB0aGUgUEhQIGFjdGlvblxuXHRcdFx0XHR2YXIgbWVzc2FnZSA9ICcnO1xuXHRcdFx0XHRpZiAoIHJlc3BvbnNlLnN1Y2Nlc3MgPT09IHRydWUgKSB7XG5cdFx0XHRcdFx0JCgnZmllbGRzZXQnLCB0aGF0KS5oaWRlKCk7XG5cdFx0XHRcdFx0YnV0dG9uLnRleHQoJ1RoYW5rcycpO1xuXHRcdFx0XHRcdHZhciBhbmFseXRpY3NfYWN0aW9uID0gJ1NpZ251cCc7XG5cdFx0XHRcdFx0c3dpdGNoIChyZXNwb25zZS5kYXRhLnVzZXJfc3RhdHVzKSB7XG5cdFx0XHRcdFx0XHRjYXNlICdleGlzdGluZyc6XG5cdFx0XHRcdFx0XHRcdGFuYWx5dGljc19hY3Rpb24gPSAnVXBkYXRlJztcblx0XHRcdFx0XHRcdFx0bWVzc2FnZSA9ICdUaGFua3MgZm9yIHVwZGF0aW5nIHlvdXIgZW1haWwgcHJlZmVyZW5jZXMuIFRoZXkgd2lsbCBnbyBpbnRvIGVmZmVjdCBpbW1lZGlhdGVseS4nO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgJ25ldyc6XG5cdFx0XHRcdFx0XHRcdGFuYWx5dGljc19hY3Rpb24gPSAnU2lnbnVwJztcblx0XHRcdFx0XHRcdFx0bWVzc2FnZSA9ICdXZSBoYXZlIGFkZGVkIHlvdSB0byB0aGUgTWlublBvc3QgbWFpbGluZyBsaXN0Lic7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAncGVuZGluZyc6XG5cdFx0XHRcdFx0XHRcdGFuYWx5dGljc19hY3Rpb24gPSAnU2lnbnVwJztcblx0XHRcdFx0XHRcdFx0bWVzc2FnZSA9ICdXZSBoYXZlIGFkZGVkIHlvdSB0byB0aGUgTWlublBvc3QgbWFpbGluZyBsaXN0LiBZb3Ugd2lsbCBuZWVkIHRvIGNsaWNrIHRoZSBjb25maXJtYXRpb24gbGluayBpbiB0aGUgZW1haWwgd2Ugc2VudCB0byBiZWdpbiByZWNlaXZpbmcgbWVzc2FnZXMuJztcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggcmVzcG9uc2UuZGF0YS5jb25maXJtX21lc3NhZ2UgIT09ICcnICkge1xuXHRcdFx0XHRcdFx0bWVzc2FnZSA9IHJlc3BvbnNlLmRhdGEuY29uZmlybV9tZXNzYWdlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoICdmdW5jdGlvbicgPT09IHR5cGVvZiBtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQgKSB7XG5cdFx0XHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdOZXdzbGV0dGVyJywgYW5hbHl0aWNzX2FjdGlvbiwgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdFx0XHRcdGd0YWdfcmVwb3J0X2NvbnZlcnNpb24oIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRcdFx0XHRidXR0b24udGV4dCgnU3Vic2NyaWJlJyk7XG5cdFx0XHRcdFx0aWYgKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgbXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50ICkge1xuXHRcdFx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnTmV3c2xldHRlcicsICdGYWlsJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0JCgnLm0taG9sZC1tZXNzYWdlJykuaHRtbCgnPGRpdiBjbGFzcz1cIm0tZm9ybS1tZXNzYWdlIG0tZm9ybS1tZXNzYWdlLWluZm9cIj4nICsgbWVzc2FnZSArICc8L2Rpdj4nKTtcblx0XHRcdH0pXG5cdFx0XHQuZmFpbChmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHQkKCcubS1ob2xkLW1lc3NhZ2UnKS5odG1sKCc8ZGl2IGNsYXNzPVwibS1mb3JtLW1lc3NhZ2UgbS1mb3JtLW1lc3NhZ2UtaW5mb1wiPkFuIGVycm9yIGhhcyBvY2N1cmVkLiBQbGVhc2UgdHJ5IGFnYWluLjwvZGl2PicpO1xuXHRcdFx0XHRidXR0b24ucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0XHRcdGJ1dHRvbi50ZXh0KCdTdWJzY3JpYmUnKTtcblx0XHRcdFx0aWYgKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgbXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50ICkge1xuXHRcdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ05ld3NsZXR0ZXInLCAnRmFpbCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuYWx3YXlzKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRldmVudC50YXJnZXQucmVzZXQoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG59KTsiLCIvKipcbiAqIEZpbGUgbmF2aWdhdGlvbi5qcy5cbiAqXG4gKiBIYW5kbGVzIHRvZ2dsaW5nIHRoZSBuYXZpZ2F0aW9uIG1lbnUgZm9yIHNtYWxsIHNjcmVlbnMgYW5kIGVuYWJsZXMgVEFCIGtleVxuICogbmF2aWdhdGlvbiBzdXBwb3J0IGZvciBkcm9wZG93biBtZW51cy5cbiAqL1xualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0dmFyIGNvbnRhaW5lciwgYnV0dG9uLCBtZW51LCBsaW5rcywgaSwgbGVuO1xuXG5cdGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAnbmF2aWdhdGlvbi1wcmltYXJ5JyApO1xuXHRpZiAoICEgY29udGFpbmVyICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGJ1dHRvbiA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2J1dHRvbicgKVswXTtcblx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIGJ1dHRvbiApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRtZW51ID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAndWwnIClbMF07XG5cblx0Ly8gSGlkZSBtZW51IHRvZ2dsZSBidXR0b24gaWYgbWVudSBpcyBlbXB0eSBhbmQgcmV0dXJuIGVhcmx5LlxuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgbWVudSApIHtcblx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRyZXR1cm47XG5cdH1cblxuXHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdGlmICggLTEgPT09IG1lbnUuY2xhc3NOYW1lLmluZGV4T2YoICdtZW51JyApICkge1xuXHRcdG1lbnUuY2xhc3NOYW1lICs9ICcgbWVudSc7XG5cdH1cblxuXHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggLTEgIT09IGNvbnRhaW5lci5jbGFzc05hbWUuaW5kZXhPZiggJ3RvZ2dsZWQnICkgKSB7XG5cdFx0XHRjb250YWluZXIuY2xhc3NOYW1lID0gY29udGFpbmVyLmNsYXNzTmFtZS5yZXBsYWNlKCAnIHRvZ2dsZWQnLCAnJyApO1xuXHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgKz0gJyB0b2dnbGVkJztcblx0XHRcdGJ1dHRvbi5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnICk7XG5cdFx0XHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gR2V0IGFsbCB0aGUgbGluayBlbGVtZW50cyB3aXRoaW4gdGhlIG1lbnUuXG5cdGxpbmtzICAgID0gbWVudS5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2EnICk7XG5cblx0Ly8gRWFjaCB0aW1lIGEgbWVudSBsaW5rIGlzIGZvY3VzZWQgb3IgYmx1cnJlZCwgdG9nZ2xlIGZvY3VzLlxuXHRmb3IgKCBpID0gMCwgbGVuID0gbGlua3MubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0bGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ2ZvY3VzJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0XHRsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCAnYmx1cicsIHRvZ2dsZUZvY3VzLCB0cnVlICk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyBvciByZW1vdmVzIC5mb2N1cyBjbGFzcyBvbiBhbiBlbGVtZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlRm9jdXMoKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0Ly8gTW92ZSB1cCB0aHJvdWdoIHRoZSBhbmNlc3RvcnMgb2YgdGhlIGN1cnJlbnQgbGluayB1bnRpbCB3ZSBoaXQgLm5hdi1tZW51LlxuXHRcdHdoaWxlICggLTEgPT09IHNlbGYuY2xhc3NOYW1lLmluZGV4T2YoICdtZW51JyApICkge1xuXG5cdFx0XHQvLyBPbiBsaSBlbGVtZW50cyB0b2dnbGUgdGhlIGNsYXNzIC5mb2N1cy5cblx0XHRcdGlmICggJ2xpJyA9PT0gc2VsZi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgKSB7XG5cdFx0XHRcdGlmICggLTEgIT09IHNlbGYuY2xhc3NOYW1lLmluZGV4T2YoICdmb2N1cycgKSApIHtcblx0XHRcdFx0XHRzZWxmLmNsYXNzTmFtZSA9IHNlbGYuY2xhc3NOYW1lLnJlcGxhY2UoICcgZm9jdXMnLCAnJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlbGYuY2xhc3NOYW1lICs9ICcgZm9jdXMnO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHNlbGYgPSBzZWxmLnBhcmVudEVsZW1lbnQ7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRvZ2dsZXMgYGZvY3VzYCBjbGFzcyB0byBhbGxvdyBzdWJtZW51IGFjY2VzcyBvbiB0YWJsZXRzLlxuXHQgKi9cblx0KCBmdW5jdGlvbiggY29udGFpbmVyICkge1xuXHRcdHZhciB0b3VjaFN0YXJ0Rm4sIGksXG5cdFx0XHRwYXJlbnRMaW5rID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoICcubWVudS1pdGVtLWhhcy1jaGlsZHJlbiA+IGEsIC5wYWdlX2l0ZW1faGFzX2NoaWxkcmVuID4gYScgKTtcblxuXHRcdGlmICggJ29udG91Y2hzdGFydCcgaW4gd2luZG93ICkge1xuXHRcdFx0dG91Y2hTdGFydEZuID0gZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdHZhciBtZW51SXRlbSA9IHRoaXMucGFyZW50Tm9kZSwgaTtcblxuXHRcdFx0XHRpZiAoICEgbWVudUl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCAnZm9jdXMnICkgKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgbWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbi5sZW5ndGg7ICsraSApIHtcblx0XHRcdFx0XHRcdGlmICggbWVudUl0ZW0gPT09IG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW5baV0gKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbltpXS5jbGFzc0xpc3QucmVtb3ZlKCAnZm9jdXMnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG1lbnVJdGVtLmNsYXNzTGlzdC5hZGQoICdmb2N1cycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZW51SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCAnZm9jdXMnICk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGZvciAoIGkgPSAwOyBpIDwgcGFyZW50TGluay5sZW5ndGg7ICsraSApIHtcblx0XHRcdFx0cGFyZW50TGlua1tpXS5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIHRvdWNoU3RhcnRGbiwgZmFsc2UgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0oIGNvbnRhaW5lciApICk7XG59KTtcblxuLy8gdXNlciBhY2NvdW50IG5hdmlnYXRpb24gY2FuIGJlIGEgZHJvcGRvd25cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cdC8vIGhpZGUgbWVudVxuXHRpZiAoJCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgdWwnKS5sZW5ndGggPiAwICkge1xuXHRcdCQoJyN1c2VyLWFjY291bnQtYWNjZXNzID4gbGkgPiBhJykub24oICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHQkKCcjdXNlci1hY2NvdW50LWFjY2VzcyB1bCcpLnRvZ2dsZUNsYXNzKCAndmlzaWJsZScgKTtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fSk7XG5cdH1cblxufSk7XG4iXX0=
