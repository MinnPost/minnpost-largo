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

  if ($('.m-user-email-list').length > 0) {
    // if a user removes an email, take it away from the visual and from the form
    $('.a-form-caption.a-remove-email').click(function (event) {
      event.preventDefault();
      emailToRemove = $(this).parents('li').contents().get(0).nodeValue.trim();
      consolidatedEmails = $('#_consolidated_emails').val().split(',');
      consolidatedEmails = $.grep(consolidatedEmails, function (value) {
        return value !== emailToRemove;
      });
      $('#_consolidated_emails').val(consolidatedEmails.join(','));
      $(this).parents('li').remove();
    });
    nextEmailCount = $('.m-user-email-list li').length;
  } // if a user wants to add an email, give them a properly numbered field


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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuYWx5dGljcy5qcyIsImZvcm1zLmpzIiwibmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6WyJtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsInZhbHVlIiwiZ2EiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiJCIsImNsaWNrIiwiZSIsInRyaW0iLCJocmVmIiwid2lkZ2V0X3RpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJkb2N1bWVudCIsInJlYWR5IiwiUFVNIiwiY3VycmVudF9wb3B1cCIsImdldFBvcHVwIiwic2V0dGluZ3MiLCJnZXRTZXR0aW5ncyIsInBvcHVwX2lkIiwiaWQiLCJvbiIsImNsb3NlX3RyaWdnZXIiLCJmbiIsInBvcG1ha2UiLCJsYXN0X2Nsb3NlX3RyaWdnZXIiLCJ1cmwiLCJhdHRyIiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJndGFnX3JlcG9ydF9jb252ZXJzaW9uIiwiY2FsbGJhY2siLCJ3aW5kb3ciLCJndGFnIiwibWFuYWdlRW1haWxzIiwibmV4dEVtYWlsQ291bnQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibGVuZ3RoIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInBhcmVudHMiLCJjb250ZW50cyIsImdldCIsIm5vZGVWYWx1ZSIsInZhbCIsInNwbGl0IiwiZ3JlcCIsImpvaW4iLCJyZW1vdmUiLCJiZWZvcmUiLCJzdWJtaXQiLCJ0aGF0IiwiYnV0dG9uIiwicHJvcCIsImFqYXhfZm9ybV9kYXRhIiwic2VyaWFsaXplIiwiYWpheCIsInBhcmFtcyIsImFqYXh1cmwiLCJkYXRhVHlwZSIsImRhdGEiLCJkb25lIiwicmVzcG9uc2UiLCJtZXNzYWdlIiwic3VjY2VzcyIsImhpZGUiLCJhbmFseXRpY3NfYWN0aW9uIiwidXNlcl9zdGF0dXMiLCJjb25maXJtX21lc3NhZ2UiLCJodG1sIiwiZmFpbCIsImFsd2F5cyIsInRhcmdldCIsInJlc2V0IiwiY29udGFpbmVyIiwibWVudSIsImxpbmtzIiwiaSIsImxlbiIsImdldEVsZW1lbnRCeUlkIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJzdHlsZSIsImRpc3BsYXkiLCJzZXRBdHRyaWJ1dGUiLCJjbGFzc05hbWUiLCJpbmRleE9mIiwib25jbGljayIsInJlcGxhY2UiLCJhZGRFdmVudExpc3RlbmVyIiwidG9nZ2xlRm9jdXMiLCJzZWxmIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwicGFyZW50RWxlbWVudCIsInRvdWNoU3RhcnRGbiIsInBhcmVudExpbmsiLCJxdWVyeVNlbGVjdG9yQWxsIiwibWVudUl0ZW0iLCJwYXJlbnROb2RlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJjaGlsZHJlbiIsImFkZCIsInRvZ2dsZUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLDJCQUFULENBQXNDQyxJQUF0QyxFQUE0Q0MsUUFBNUMsRUFBc0RDLE1BQXRELEVBQThEQyxLQUE5RCxFQUFxRUMsS0FBckUsRUFBNkU7QUFDNUUsTUFBSyxPQUFPQyxFQUFQLEtBQWMsV0FBbkIsRUFBaUM7QUFDaEMsUUFBSyxPQUFPRCxLQUFQLEtBQWlCLFdBQXRCLEVBQW9DO0FBQ25DQyxNQUFBQSxFQUFFLENBQUUsTUFBRixFQUFVTCxJQUFWLEVBQWdCQyxRQUFoQixFQUEwQkMsTUFBMUIsRUFBa0NDLEtBQWxDLENBQUY7QUFDQSxLQUZELE1BRU87QUFDTkUsTUFBQUEsRUFBRSxDQUFFLE1BQUYsRUFBVUwsSUFBVixFQUFnQkMsUUFBaEIsRUFBMEJDLE1BQTFCLEVBQWtDQyxLQUFsQyxFQUF5Q0MsS0FBekMsQ0FBRjtBQUNBO0FBQ0QsR0FORCxNQU1PO0FBQ047QUFDQTtBQUNEOztB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LENBQTZCdUcsV0FBN0IsQ0FBMEMsU0FBMUM7QUFDQWpFLE1BQUFBLEtBQUssQ0FBQ0MsY0FBTjtBQUNBLEtBSEQ7QUFJQTtBQUVELENBVEQiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApIHtcblx0aWYgKCB0eXBlb2YgZ2EgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdGlmICggdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKSB7XG5cblx0Ly8gaWYgYSBub3QgbG9nZ2VkIGluIHVzZXIgdHJpZXMgdG8gZW1haWwsIGRvbid0IGNvdW50IHRoYXQgYXMgYSBzaGFyZVxuXHRpZiAoICEgalF1ZXJ5KCAnYm9keSAnKS5oYXNDbGFzcyggJ2xvZ2dlZC1pbicpICYmICdFbWFpbCcgPT09IHRleHQgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gdHJhY2sgYXMgYW4gZXZlbnQsIGFuZCBhcyBzb2NpYWwgaWYgaXQgaXMgdHdpdHRlciBvciBmYlxuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdTaGFyZSAtICcgKyBwb3NpdGlvbiwgdGV4dCwgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGdhICkge1xuXHRcdGlmICggJ0ZhY2Vib29rJyA9PT0gdGV4dCB8fCAnVHdpdHRlcicgPT09IHRleHQgKSB7XG5cdFx0XHRpZiAoIHRleHQgPT0gJ0ZhY2Vib29rJyApIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdTaGFyZScsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1R3ZWV0JywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbiggZnVuY3Rpb24oICQgKSB7XG5cblx0JCAoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpLnRyaW0oKTtcblx0XHR2YXIgcG9zaXRpb24gPSAndG9wJztcblx0XHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xuXHR9KTtcblxuXHQkICggJy5tLWVudHJ5LXNoYXJlLWJvdHRvbSBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgdGV4dCA9ICQoIHRoaXMgKS50ZXh0KCkudHJpbSgpO1xuXHRcdHZhciBwb3NpdGlvbiA9ICdib3R0b20nO1xuXHRcdHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG5cdH0pO1xuXG5cdCQoICcjbmF2aWdhdGlvbi1mZWF0dXJlZCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdGZWF0dXJlZCBCYXIgTGluaycsICdDbGljaycsIHRoaXMuaHJlZiApO1xuXHR9KTtcblx0JCggJ2EuZ2xlYW4tc2lkZWJhcicgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBTdXBwb3J0IExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcblx0fSk7XG5cblx0JCggJ2EnLCAkKCAnLm8tc2l0ZS1zaWRlYmFyJyApICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdHZhciB3aWRnZXRfdGl0bGUgPSAkKHRoaXMpLmNsb3Nlc3QoJy5tLXdpZGdldCcpLmZpbmQoJ2gzJykudGV4dCgpO1xuXHRcdHZhciBzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSAnJztcblx0XHRpZiAod2lkZ2V0X3RpdGxlID09PSAnJykge1xuXHRcdFx0Ly9zaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSAkKHRoaXMpLmNsb3Nlc3QoJy5ub2RlLXR5cGUtc3BpbGwnKS5maW5kKCcubm9kZS10aXRsZSBhJykudGV4dCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSB3aWRnZXRfdGl0bGU7XG5cdFx0fVxuXHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCgnZXZlbnQnLCAnU2lkZWJhciBMaW5rJywgJ0NsaWNrJywgc2lkZWJhcl9zZWN0aW9uX3RpdGxlKTtcblx0fSk7XG5cblx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24gKCBlICkge1xuXG5cdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIFBVTSApIHtcblx0XHRcdHZhciBjdXJyZW50X3BvcHVwID0gUFVNLmdldFBvcHVwKCAkKCAnLnB1bScgKSApO1xuXHRcdFx0dmFyIHNldHRpbmdzID0gUFVNLmdldFNldHRpbmdzKCAkKCAnLnB1bScgKSApO1xuXHRcdFx0dmFyIHBvcHVwX2lkID0gc2V0dGluZ3MuaWQ7XG5cdFx0XHQkKCBkb2N1bWVudCApLm9uKCdwdW1BZnRlck9wZW4nLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ1Nob3cnLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0gKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggZG9jdW1lbnQgKS5vbigncHVtQWZ0ZXJDbG9zZScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIGNsb3NlX3RyaWdnZXIgPSAkLmZuLnBvcG1ha2UubGFzdF9jbG9zZV90cmlnZ2VyO1xuXHRcdFx0XHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgY2xvc2VfdHJpZ2dlciApIHtcblx0XHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubWVzc2FnZS1jbG9zZScgKS5jbGljayhmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGNsb3NlIGNsYXNzXG5cdFx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJ0Nsb3NlIEJ1dHRvbic7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgY2xvc2VfdHJpZ2dlciwgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9ICk7XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubWVzc2FnZS1sb2dpbicgKS5jbGljayhmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGxvZ2luIGNsYXNzXG5cdFx0XHRcdHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcblx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnTG9naW4gTGluaycsIHVybCApO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLnB1bS1jb250ZW50IGE6bm90KCAubWVzc2FnZS1jbG9zZSwgLnB1bS1jbG9zZSwgLm1lc3NhZ2UtbG9naW4gKScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIHNvbWV0aGluZyB0aGF0IGlzIG5vdCBjbG9zZSB0ZXh0IG9yIGNsb3NlIGljb25cblx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnQ2xpY2snLCBwb3B1cF9pZCApO1xuICAgICAgICAgICAgfSk7XG5cdFx0fVxuXG5cdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSAmJiAnJyAhPT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLnVybF9hY2Nlc3NfbGV2ZWwgKSB7XG5cdFx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0XHR2YXIgY2F0ZWdvcnkgPSAnTWVtYmVyIENvbnRlbnQnO1xuXHRcdFx0dmFyIGxhYmVsID0gbG9jYXRpb24ucGF0aG5hbWU7IC8vIGkgdGhpbmsgd2UgY291bGQgcG9zc2libHkgcHV0IHNvbWUgZ3JvdXBpbmcgaGVyZSwgYnV0IHdlIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYWNjZXNzIHRvIG9uZSBhbmQgbWF5YmUgaXQncyBub3Qgd29ydGh3aGlsZSB5ZXRcblx0XHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0XHRpZiAoIHRydWUgPT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS5jdXJyZW50X3VzZXIuY2FuX2FjY2VzcyApIHtcblx0XHRcdFx0YWN0aW9uID0gJ1Nob3duJztcblx0XHRcdH1cblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9XG5cdH0pO1xuXG59ICkoIGpRdWVyeSApOyIsImZ1bmN0aW9uIGd0YWdfcmVwb3J0X2NvbnZlcnNpb24odXJsKSB7XG5cdHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcblx0ICBpZiAodHlwZW9mKHVybCkgIT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgIHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcblx0ICB9XG5cdH07XG5cdGd0YWcoJ2V2ZW50JywgJ2NvbnZlcnNpb24nLCB7XG5cdCAgJ3NlbmRfdG8nOiAnQVctOTc2NjIwMTc1L2pxQ3lDTDdhdFhrUWo1WFkwUU0nLFxuXHQgICdldmVudF9jYWxsYmFjayc6IGNhbGxiYWNrXG5cdH0pO1xuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIG1hbmFnZUVtYWlscygpIHtcblx0dmFyIG5leHRFbWFpbENvdW50ID0gMTtcblx0dmFyIGVtYWlsVG9SZW1vdmUgID0gJyc7XG5cdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0aWYgKCAkKCcubS11c2VyLWVtYWlsLWxpc3QnKS5sZW5ndGggPiAwICkge1xuXHRcdC8vIGlmIGEgdXNlciByZW1vdmVzIGFuIGVtYWlsLCB0YWtlIGl0IGF3YXkgZnJvbSB0aGUgdmlzdWFsIGFuZCBmcm9tIHRoZSBmb3JtXG5cdFx0JCgnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsJykuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRlbWFpbFRvUmVtb3ZlICAgICAgPSAkKHRoaXMpLnBhcmVudHMoJ2xpJykuY29udGVudHMoKS5nZXQoMCkubm9kZVZhbHVlLnRyaW0oKTtcblx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscyA9ICQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCkuc3BsaXQoICcsJyApO1xuXHRcdFx0Y29uc29saWRhdGVkRW1haWxzID0gJC5ncmVwKCBjb25zb2xpZGF0ZWRFbWFpbHMsIGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlICE9PSBlbWFpbFRvUmVtb3ZlO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggY29uc29saWRhdGVkRW1haWxzLmpvaW4oJywnKSApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5yZW1vdmUoKTtcblx0XHR9KTtcblx0XHRuZXh0RW1haWxDb3VudCA9ICQoJy5tLXVzZXItZW1haWwtbGlzdCBsaScpLmxlbmd0aDtcblx0fVxuXHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHQkKCcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnKS5jbGljayggZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCgnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJykuYmVmb3JlKCc8aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5WycgKyBuZXh0RW1haWxDb3VudCArICddXCIgaWQ9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIHZhbHVlPVwiXCI+Jylcblx0XHRuZXh0RW1haWxDb3VudCsrO1xuXHR9KTtcbn1cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdGlmICggJCgnLm0tZm9ybS1lbWFpbCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cblx0aWYgKCAkKCcubS1mb3JtLW5ld3NsZXR0ZXItc2hvcnRjb2RlJykubGVuZ3RoID4gMCApIHtcblx0XHQkKCcubS1mb3JtLW5ld3NsZXR0ZXItc2hvcnRjb2RlIGZpZWxkc2V0JykuYmVmb3JlKCc8ZGl2IGNsYXNzPVwibS1ob2xkLW1lc3NhZ2VcIj48L2Rpdj4nKTtcblx0XHQkKCcubS1mb3JtLW5ld3NsZXR0ZXItc2hvcnRjb2RlIGZvcm0nKS5zdWJtaXQoZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgZm9ybSBzdWJtaXQuXG5cdFx0XHR2YXIgYnV0dG9uID0gJCgnYnV0dG9uJywgdGhpcyk7XG5cdFx0XHRidXR0b24ucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRcdGJ1dHRvbi50ZXh0KCdQcm9jZXNzaW5nJyk7XG5cdFx0XHQvLyBzZXJpYWxpemUgdGhlIGZvcm0gZGF0YVxuXHRcdFx0dmFyIGFqYXhfZm9ybV9kYXRhID0gJCh0aGlzKS5zZXJpYWxpemUoKTtcblx0XHRcdC8vYWRkIG91ciBvd24gYWpheCBjaGVjayBhcyBYLVJlcXVlc3RlZC1XaXRoIGlzIG5vdCBhbHdheXMgcmVsaWFibGVcblx0XHRcdGFqYXhfZm9ybV9kYXRhID0gYWpheF9mb3JtX2RhdGEgKyAnJmFqYXhyZXF1ZXN0PXRydWUmc3Vic2NyaWJlJztcblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHVybDogcGFyYW1zLmFqYXh1cmwsIC8vIGRvbWFpbi93cC1hZG1pbi9hZG1pbi1hamF4LnBocFxuXHRcdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRcdGRhdGFUeXBlIDogJ2pzb24nLFxuXHRcdFx0XHRkYXRhOiBhamF4X2Zvcm1fZGF0YVxuXHRcdFx0fSlcblx0XHRcdC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7IC8vIHJlc3BvbnNlIGZyb20gdGhlIFBIUCBhY3Rpb25cblx0XHRcdFx0dmFyIG1lc3NhZ2UgPSAnJztcblx0XHRcdFx0aWYgKCByZXNwb25zZS5zdWNjZXNzID09PSB0cnVlICkge1xuXHRcdFx0XHRcdCQoJ2ZpZWxkc2V0JywgdGhhdCkuaGlkZSgpO1xuXHRcdFx0XHRcdGJ1dHRvbi50ZXh0KCdUaGFua3MnKTtcblx0XHRcdFx0XHR2YXIgYW5hbHl0aWNzX2FjdGlvbiA9ICdTaWdudXAnO1xuXHRcdFx0XHRcdHN3aXRjaCAocmVzcG9uc2UuZGF0YS51c2VyX3N0YXR1cykge1xuXHRcdFx0XHRcdFx0Y2FzZSAnZXhpc3RpbmcnOlxuXHRcdFx0XHRcdFx0XHRhbmFseXRpY3NfYWN0aW9uID0gJ1VwZGF0ZSc7XG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2UgPSAnVGhhbmtzIGZvciB1cGRhdGluZyB5b3VyIGVtYWlsIHByZWZlcmVuY2VzLiBUaGV5IHdpbGwgZ28gaW50byBlZmZlY3QgaW1tZWRpYXRlbHkuJztcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlICduZXcnOlxuXHRcdFx0XHRcdFx0XHRhbmFseXRpY3NfYWN0aW9uID0gJ1NpZ251cCc7XG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2UgPSAnV2UgaGF2ZSBhZGRlZCB5b3UgdG8gdGhlIE1pbm5Qb3N0IG1haWxpbmcgbGlzdC4nO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGNhc2UgJ3BlbmRpbmcnOlxuXHRcdFx0XHRcdFx0XHRhbmFseXRpY3NfYWN0aW9uID0gJ1NpZ251cCc7XG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2UgPSAnV2UgaGF2ZSBhZGRlZCB5b3UgdG8gdGhlIE1pbm5Qb3N0IG1haWxpbmcgbGlzdC4gWW91IHdpbGwgbmVlZCB0byBjbGljayB0aGUgY29uZmlybWF0aW9uIGxpbmsgaW4gdGhlIGVtYWlsIHdlIHNlbnQgdG8gYmVnaW4gcmVjZWl2aW5nIG1lc3NhZ2VzLic7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLmRhdGEuY29uZmlybV9tZXNzYWdlICE9PSAnJyApIHtcblx0XHRcdFx0XHRcdG1lc3NhZ2UgPSByZXNwb25zZS5kYXRhLmNvbmZpcm1fbWVzc2FnZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgbXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50ICkge1xuXHRcdFx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnTmV3c2xldHRlcicsIGFuYWx5dGljc19hY3Rpb24sIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHRcdFx0XHRndGFnX3JlcG9ydF9jb252ZXJzaW9uKCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRidXR0b24ucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0XHRcdFx0YnV0dG9uLnRleHQoJ1N1YnNjcmliZScpO1xuXHRcdFx0XHRcdGlmICggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCApIHtcblx0XHRcdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ05ld3NsZXR0ZXInLCAnRmFpbCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdCQoJy5tLWhvbGQtbWVzc2FnZScpLmh0bWwoJzxkaXYgY2xhc3M9XCJtLWZvcm0tbWVzc2FnZSBtLWZvcm0tbWVzc2FnZS1pbmZvXCI+JyArIG1lc3NhZ2UgKyAnPC9kaXY+Jyk7XG5cdFx0XHR9KVxuXHRcdFx0LmZhaWwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0JCgnLm0taG9sZC1tZXNzYWdlJykuaHRtbCgnPGRpdiBjbGFzcz1cIm0tZm9ybS1tZXNzYWdlIG0tZm9ybS1tZXNzYWdlLWluZm9cIj5BbiBlcnJvciBoYXMgb2NjdXJlZC4gUGxlYXNlIHRyeSBhZ2Fpbi48L2Rpdj4nKTtcblx0XHRcdFx0YnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdFx0XHRidXR0b24udGV4dCgnU3Vic2NyaWJlJyk7XG5cdFx0XHRcdGlmICggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCApIHtcblx0XHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdOZXdzbGV0dGVyJywgJ0ZhaWwnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmFsd2F5cyhmdW5jdGlvbigpIHtcblx0XHRcdFx0ZXZlbnQudGFyZ2V0LnJlc2V0KCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxufSk7IiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogSGFuZGxlcyB0b2dnbGluZyB0aGUgbmF2aWdhdGlvbiBtZW51IGZvciBzbWFsbCBzY3JlZW5zIGFuZCBlbmFibGVzIFRBQiBrZXlcbiAqIG5hdmlnYXRpb24gc3VwcG9ydCBmb3IgZHJvcGRvd24gbWVudXMuXG4gKi9cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cdHZhciBjb250YWluZXIsIGJ1dHRvbiwgbWVudSwgbGlua3MsIGksIGxlbjtcblxuXHRjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ25hdmlnYXRpb24tcHJpbWFyeScgKTtcblx0aWYgKCAhIGNvbnRhaW5lciApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRidXR0b24gPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdidXR0b24nIClbMF07XG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBidXR0b24gKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bWVudSA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ3VsJyApWzBdO1xuXG5cdC8vIEhpZGUgbWVudSB0b2dnbGUgYnV0dG9uIGlmIG1lbnUgaXMgZW1wdHkgYW5kIHJldHVybiBlYXJseS5cblx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG1lbnUgKSB7XG5cdFx0YnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRpZiAoIC0xID09PSBtZW51LmNsYXNzTmFtZS5pbmRleE9mKCAnbWVudScgKSApIHtcblx0XHRtZW51LmNsYXNzTmFtZSArPSAnIG1lbnUnO1xuXHR9XG5cblx0YnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIC0xICE9PSBjb250YWluZXIuY2xhc3NOYW1lLmluZGV4T2YoICd0b2dnbGVkJyApICkge1xuXHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IGNvbnRhaW5lci5jbGFzc05hbWUucmVwbGFjZSggJyB0b2dnbGVkJywgJycgKTtcblx0XHRcdGJ1dHRvbi5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRcdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb250YWluZXIuY2xhc3NOYW1lICs9ICcgdG9nZ2xlZCc7XG5cdFx0XHRidXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyApO1xuXHRcdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEdldCBhbGwgdGhlIGxpbmsgZWxlbWVudHMgd2l0aGluIHRoZSBtZW51LlxuXHRsaW5rcyAgICA9IG1lbnUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdhJyApO1xuXG5cdC8vIEVhY2ggdGltZSBhIG1lbnUgbGluayBpcyBmb2N1c2VkIG9yIGJsdXJyZWQsIHRvZ2dsZSBmb2N1cy5cblx0Zm9yICggaSA9IDAsIGxlbiA9IGxpbmtzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdGxpbmtzW2ldLmFkZEV2ZW50TGlzdGVuZXIoICdmb2N1cycsIHRvZ2dsZUZvY3VzLCB0cnVlICk7XG5cdFx0bGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ2JsdXInLCB0b2dnbGVGb2N1cywgdHJ1ZSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgb3IgcmVtb3ZlcyAuZm9jdXMgY2xhc3Mgb24gYW4gZWxlbWVudC5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZUZvY3VzKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdC8vIE1vdmUgdXAgdGhyb3VnaCB0aGUgYW5jZXN0b3JzIG9mIHRoZSBjdXJyZW50IGxpbmsgdW50aWwgd2UgaGl0IC5uYXYtbWVudS5cblx0XHR3aGlsZSAoIC0xID09PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnbWVudScgKSApIHtcblxuXHRcdFx0Ly8gT24gbGkgZWxlbWVudHMgdG9nZ2xlIHRoZSBjbGFzcyAuZm9jdXMuXG5cdFx0XHRpZiAoICdsaScgPT09IHNlbGYudGFnTmFtZS50b0xvd2VyQ2FzZSgpICkge1xuXHRcdFx0XHRpZiAoIC0xICE9PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnZm9jdXMnICkgKSB7XG5cdFx0XHRcdFx0c2VsZi5jbGFzc05hbWUgPSBzZWxmLmNsYXNzTmFtZS5yZXBsYWNlKCAnIGZvY3VzJywgJycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWxmLmNsYXNzTmFtZSArPSAnIGZvY3VzJztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRzZWxmID0gc2VsZi5wYXJlbnRFbGVtZW50O1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUb2dnbGVzIGBmb2N1c2AgY2xhc3MgdG8gYWxsb3cgc3VibWVudSBhY2Nlc3Mgb24gdGFibGV0cy5cblx0ICovXG5cdCggZnVuY3Rpb24oIGNvbnRhaW5lciApIHtcblx0XHR2YXIgdG91Y2hTdGFydEZuLCBpLFxuXHRcdFx0cGFyZW50TGluayA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCAnLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4gPiBhLCAucGFnZV9pdGVtX2hhc19jaGlsZHJlbiA+IGEnICk7XG5cblx0XHRpZiAoICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyApIHtcblx0XHRcdHRvdWNoU3RhcnRGbiA9IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgbWVudUl0ZW0gPSB0aGlzLnBhcmVudE5vZGUsIGk7XG5cblx0XHRcdFx0aWYgKCAhIG1lbnVJdGVtLmNsYXNzTGlzdC5jb250YWlucyggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW4ubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1lbnVJdGVtID09PSBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldICkge1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW5baV0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtZW51SXRlbS5jbGFzc0xpc3QuYWRkKCAnZm9jdXMnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRmb3IgKCBpID0gMDsgaSA8IHBhcmVudExpbmsubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdHBhcmVudExpbmtbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCB0b3VjaFN0YXJ0Rm4sIGZhbHNlICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KCBjb250YWluZXIgKSApO1xufSk7XG5cbi8vIHVzZXIgYWNjb3VudCBuYXZpZ2F0aW9uIGNhbiBiZSBhIGRyb3Bkb3duXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXHQvLyBoaWRlIG1lbnVcblx0aWYgKCQoJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJykubGVuZ3RoID4gMCApIHtcblx0XHQkKCcjdXNlci1hY2NvdW50LWFjY2VzcyA+IGxpID4gYScpLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0JCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgdWwnKS50b2dnbGVDbGFzcyggJ3Zpc2libGUnICk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0pO1xuXHR9XG5cbn0pO1xuIl19
