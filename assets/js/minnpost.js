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

(function ($) {
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
    var form = $('#account-settings-form');
    var rest_root = user_account_management_rest.site_url + user_account_management_rest.rest_namespace;
    var full_url = rest_root + '/' + 'update-user/';
    var nextEmailCount = 1;
    var emailToRemove = '';
    var consolidatedEmails = [];
    var newEmails = [];
    var ajax_form_data = '';

    if ($('.m-user-email-list').length > 0) {
      nextEmailCount = $('.m-user-email-list > li').length; // if a user removes an email, take it away from the visual and from the form

      $('.a-form-caption.a-remove-email').change(function (event) {
        //emailToRemove = $(this).val();
        //$( this ).parents( 'li' ).remove();
        ajax_form_data = $(this).serialize(); //add our own ajax check as X-Requested-With is not always reliable

        ajax_form_data = ajax_form_data + '&ajaxrequest=true&subscribe';
        $.ajax({
          url: full_url,
          type: 'post',
          dataType: 'json',
          data: ajax_form_data
        }).done(function (response) {
          console.log('respond');
        });
      });
      nextEmailCount = $('.m-user-email-list > li').length;
    } // if a user wants to add an email, give them a properly numbered field


    $('.a-form-caption.a-add-email').click(function (event) {
      event.preventDefault();
      $('.a-form-caption.a-add-email').before('<div class="a-input-with-button a-button-sentence"><input type="email" name="_consolidated_emails_array[]" id="_consolidated_emails_array[]" value=""><button type="submit" name="a-add-email-' + nextEmailCount + '" id="a-add-email-' + nextEmailCount + '" class="a-button">Add</button></div>');
      nextEmailCount++;
    });
    $(form).on('submit', function (event) {
      event.preventDefault();
      ajax_form_data = form.serialize(); //add our own ajax check as X-Requested-With is not always reliable

      ajax_form_data = ajax_form_data + '&rest=true';
      $.ajax({
        url: full_url,
        type: 'post',
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('X-WP-Nonce', user_account_management_rest.nonce);
        },
        dataType: 'json',
        data: ajax_form_data
      }).done(function (data) {
        newEmails = $('input[name="_consolidated_emails_array[]"]').map(function () {
          return $(this).val();
        }).get();
        $.each(newEmails, function (index, value) {
          nextEmailCount = nextEmailCount + index;
          $('.m-user-email-list').append('<li>' + value + '<ul class="a-form-caption a-user-email-actions"><li class="a-form-caption a-make-primary-email"><input type="radio" name="primary_email" id="primary_email_' + nextEmailCount + '" value="' + value + '"><label for="primary_email_' + nextEmailCount + '"><small>Make Primary</small></label></li><li class="a-form-caption a-remove-email"><input type="checkbox" name="remove_email[' + nextEmailCount + ']" id="remove_email_' + nextEmailCount + '" value="' + value + '"><label for="remove_email_' + nextEmailCount + '"><small>Remove</small></label></li></ul></li>');
        });
        $('.m-form-change-email .a-input-with-button').remove();
      });
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
})(jQuery);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuYWx5dGljcy5qcyIsImZvcm1zLmpzIiwibmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6WyJtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsInZhbHVlIiwiZ2EiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiJCIsImNsaWNrIiwiZSIsInRyaW0iLCJocmVmIiwid2lkZ2V0X3RpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJkb2N1bWVudCIsInJlYWR5IiwiUFVNIiwiY3VycmVudF9wb3B1cCIsImdldFBvcHVwIiwic2V0dGluZ3MiLCJnZXRTZXR0aW5ncyIsInBvcHVwX2lkIiwiaWQiLCJvbiIsImNsb3NlX3RyaWdnZXIiLCJmbiIsInBvcG1ha2UiLCJsYXN0X2Nsb3NlX3RyaWdnZXIiLCJ1cmwiLCJhdHRyIiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJndGFnX3JlcG9ydF9jb252ZXJzaW9uIiwiY2FsbGJhY2siLCJ3aW5kb3ciLCJndGFnIiwibWFuYWdlRW1haWxzIiwiZm9ybSIsInJlc3Rfcm9vdCIsInVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QiLCJzaXRlX3VybCIsInJlc3RfbmFtZXNwYWNlIiwiZnVsbF91cmwiLCJuZXh0RW1haWxDb3VudCIsImVtYWlsVG9SZW1vdmUiLCJjb25zb2xpZGF0ZWRFbWFpbHMiLCJuZXdFbWFpbHMiLCJhamF4X2Zvcm1fZGF0YSIsImxlbmd0aCIsImNoYW5nZSIsImV2ZW50Iiwic2VyaWFsaXplIiwiYWpheCIsImRhdGFUeXBlIiwiZGF0YSIsImRvbmUiLCJyZXNwb25zZSIsImNvbnNvbGUiLCJsb2ciLCJwcmV2ZW50RGVmYXVsdCIsImJlZm9yZSIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJtYXAiLCJ2YWwiLCJnZXQiLCJlYWNoIiwiaW5kZXgiLCJhcHBlbmQiLCJyZW1vdmUiLCJzdWJtaXQiLCJ0aGF0IiwiYnV0dG9uIiwicHJvcCIsInBhcmFtcyIsImFqYXh1cmwiLCJtZXNzYWdlIiwic3VjY2VzcyIsImhpZGUiLCJhbmFseXRpY3NfYWN0aW9uIiwidXNlcl9zdGF0dXMiLCJjb25maXJtX21lc3NhZ2UiLCJodG1sIiwiZmFpbCIsImFsd2F5cyIsInRhcmdldCIsInJlc2V0IiwiY29udGFpbmVyIiwibWVudSIsImxpbmtzIiwiaSIsImxlbiIsImdldEVsZW1lbnRCeUlkIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJzdHlsZSIsImRpc3BsYXkiLCJzZXRBdHRyaWJ1dGUiLCJjbGFzc05hbWUiLCJpbmRleE9mIiwib25jbGljayIsInJlcGxhY2UiLCJhZGRFdmVudExpc3RlbmVyIiwidG9nZ2xlRm9jdXMiLCJzZWxmIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwicGFyZW50RWxlbWVudCIsInRvdWNoU3RhcnRGbiIsInBhcmVudExpbmsiLCJxdWVyeVNlbGVjdG9yQWxsIiwibWVudUl0ZW0iLCJwYXJlbnROb2RlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJjaGlsZHJlbiIsImFkZCIsInRvZ2dsZUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLDJCQUFULENBQXNDQyxJQUF0QyxFQUE0Q0MsUUFBNUMsRUFBc0RDLE1BQXRELEVBQThEQyxLQUE5RCxFQUFxRUMsS0FBckUsRUFBNkU7QUFDNUUsTUFBSyxPQUFPQyxFQUFQLEtBQWMsV0FBbkIsRUFBaUM7QUFDaEMsUUFBSyxPQUFPRCxLQUFQLEtBQWlCLFdBQXRCLEVBQW9DO0FBQ25DQyxNQUFBQSxFQUFFLENBQUUsTUFBRixFQUFVTCxJQUFWLEVBQWdCQyxRQUFoQixFQUEwQkMsTUFBMUIsRUFBa0NDLEtBQWxDLENBQUY7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QUNOTCxVQUFBQSxRQUFRLENBQUNFLFNBQVQsQ0FBbUIzQyxNQUFuQixDQUEyQixPQUEzQjtBQUNBO0FBQ0QsT0FmRDs7QUFpQkEsV0FBTXFCLENBQUMsR0FBRyxDQUFWLEVBQWFBLENBQUMsR0FBR2tCLFVBQVUsQ0FBQzlELE1BQTVCLEVBQW9DLEVBQUU0QyxDQUF0QyxFQUEwQztBQUN6Q2tCLFFBQUFBLFVBQVUsQ0FBQ2xCLENBQUQsQ0FBVixDQUFjVyxnQkFBZCxDQUFnQyxZQUFoQyxFQUE4Q00sWUFBOUMsRUFBNEQsS0FBNUQ7QUFDQTtBQUNEO0FBQ0QsR0ExQkMsRUEwQkNwQixTQTFCRCxDQUFGO0FBMkJBLENBbkdELEUsQ0FxR0E7O0FBQ0ExRixNQUFNLENBQUVhLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVVYsQ0FBVixFQUFjO0FBQ3ZDO0FBQ0EsTUFBSUEsQ0FBQyxDQUFDLHlCQUFELENBQUQsQ0FBNkI2QyxNQUE3QixHQUFzQyxDQUExQyxFQUE4QztBQUM3QzdDLElBQUFBLENBQUMsQ0FBQywrQkFBRCxDQUFELENBQW1Da0IsRUFBbkMsQ0FBdUMsT0FBdkMsRUFBZ0QsVUFBUzZCLEtBQVQsRUFBZ0I7QUFDL0QvQyxNQUFBQSxDQUFDLENBQUMseUJBQUQsQ0FBRCxDQUE2Qm1ILFdBQTdCLENBQTBDLFNBQTFDO0FBQ0FwRSxNQUFBQSxLQUFLLENBQUNTLGNBQU47QUFDQSxLQUhEO0FBSUE7QUFFRCxDQVREIiwiZmlsZSI6Im1pbm5wb3N0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gbXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKSB7XG5cdGlmICggdHlwZW9mIGdhICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICkge1xuXG5cdC8vIGlmIGEgbm90IGxvZ2dlZCBpbiB1c2VyIHRyaWVzIHRvIGVtYWlsLCBkb24ndCBjb3VudCB0aGF0IGFzIGEgc2hhcmVcblx0aWYgKCAhIGpRdWVyeSggJ2JvZHkgJykuaGFzQ2xhc3MoICdsb2dnZWQtaW4nKSAmJiAnRW1haWwnID09PSB0ZXh0ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIHRyYWNrIGFzIGFuIGV2ZW50LCBhbmQgYXMgc29jaWFsIGlmIGl0IGlzIHR3aXR0ZXIgb3IgZmJcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2hhcmUgLSAnICsgcG9zaXRpb24sIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgfHwgJ1R3aXR0ZXInID09PSB0ZXh0ICkge1xuXHRcdFx0aWYgKCB0ZXh0ID09ICdGYWNlYm9vaycgKSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnU2hhcmUnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdUd2VldCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG4oIGZ1bmN0aW9uKCAkICkge1xuXG5cdCQgKCAnLm0tZW50cnktc2hhcmUtdG9wIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdHZhciB0ZXh0ID0gJCggdGhpcyApLnRleHQoKS50cmltKCk7XG5cdFx0dmFyIHBvc2l0aW9uID0gJ3RvcCc7XG5cdFx0dHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcblx0fSk7XG5cblx0JCAoICcubS1lbnRyeS1zaGFyZS1ib3R0b20gYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpLnRyaW0oKTtcblx0XHR2YXIgcG9zaXRpb24gPSAnYm90dG9tJztcblx0XHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xuXHR9KTtcblxuXHQkKCAnI25hdmlnYXRpb24tZmVhdHVyZWQgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnRmVhdHVyZWQgQmFyIExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcblx0fSk7XG5cdCQoICdhLmdsZWFuLXNpZGViYXInICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1NpZGViYXIgU3VwcG9ydCBMaW5rJywgJ0NsaWNrJywgdGhpcy5ocmVmICk7XG5cdH0pO1xuXG5cdCQoICdhJywgJCggJy5vLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgd2lkZ2V0X3RpdGxlID0gJCh0aGlzKS5jbG9zZXN0KCcubS13aWRnZXQnKS5maW5kKCdoMycpLnRleHQoKTtcblx0XHR2YXIgc2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gJyc7XG5cdFx0aWYgKHdpZGdldF90aXRsZSA9PT0gJycpIHtcblx0XHRcdC8vc2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gJCh0aGlzKS5jbG9zZXN0KCcubm9kZS10eXBlLXNwaWxsJykuZmluZCgnLm5vZGUtdGl0bGUgYScpLnRleHQoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gd2lkZ2V0X3RpdGxlO1xuXHRcdH1cblx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJfc2VjdGlvbl90aXRsZSk7XG5cdH0pO1xuXG5cdCQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uICggZSApIHtcblxuXHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBQVU0gKSB7XG5cdFx0XHR2YXIgY3VycmVudF9wb3B1cCA9IFBVTS5nZXRQb3B1cCggJCggJy5wdW0nICkgKTtcblx0XHRcdHZhciBzZXR0aW5ncyA9IFBVTS5nZXRTZXR0aW5ncyggJCggJy5wdW0nICkgKTtcblx0XHRcdHZhciBwb3B1cF9pZCA9IHNldHRpbmdzLmlkO1xuXHRcdFx0JCggZG9jdW1lbnQgKS5vbigncHVtQWZ0ZXJPcGVuJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdTaG93JywgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9ICk7XG5cdFx0XHR9KTtcblx0XHRcdCQoIGRvY3VtZW50ICkub24oJ3B1bUFmdGVyQ2xvc2UnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJC5mbi5wb3BtYWtlLmxhc3RfY2xvc2VfdHJpZ2dlcjtcblx0XHRcdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGNsb3NlX3RyaWdnZXIgKSB7XG5cdFx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCBjbG9zZV90cmlnZ2VyLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLm1lc3NhZ2UtY2xvc2UnICkuY2xpY2soZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIGxpbmsgd2l0aCBjbG9zZSBjbGFzc1xuXHRcdFx0XHR2YXIgY2xvc2VfdHJpZ2dlciA9ICdDbG9zZSBCdXR0b24nO1xuXHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSApO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLm1lc3NhZ2UtbG9naW4nICkuY2xpY2soZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIGxpbmsgd2l0aCBsb2dpbiBjbGFzc1xuXHRcdFx0XHR2YXIgdXJsID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ0xvZ2luIExpbmsnLCB1cmwgKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5wdW0tY29udGVudCBhOm5vdCggLm1lc3NhZ2UtY2xvc2UsIC5wdW0tY2xvc2UsIC5tZXNzYWdlLWxvZ2luICknICkuY2xpY2soIGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBzb21ldGhpbmcgdGhhdCBpcyBub3QgY2xvc2UgdGV4dCBvciBjbG9zZSBpY29uXG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ0NsaWNrJywgcG9wdXBfaWQgKTtcbiAgICAgICAgICAgIH0pO1xuXHRcdH1cblxuXHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEgJiYgJycgIT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS51cmxfYWNjZXNzX2xldmVsICkge1xuXHRcdFx0dmFyIHR5cGUgPSAnZXZlbnQnO1xuXHRcdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHRcdHZhciBsYWJlbCA9IGxvY2F0aW9uLnBhdGhuYW1lOyAvLyBpIHRoaW5rIHdlIGNvdWxkIHBvc3NpYmx5IHB1dCBzb21lIGdyb3VwaW5nIGhlcmUsIGJ1dCB3ZSBkb24ndCBuZWNlc3NhcmlseSBoYXZlIGFjY2VzcyB0byBvbmUgYW5kIG1heWJlIGl0J3Mgbm90IHdvcnRod2hpbGUgeWV0XG5cdFx0XHR2YXIgYWN0aW9uID0gJ0Jsb2NrZWQnO1xuXHRcdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRcdGFjdGlvbiA9ICdTaG93bic7XG5cdFx0XHR9XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdFx0fVxuXHR9KTtcblxufSApKCBqUXVlcnkgKTsiLCIoZnVuY3Rpb24oJCl7XG5cdGZ1bmN0aW9uIGd0YWdfcmVwb3J0X2NvbnZlcnNpb24odXJsKSB7XG5cdFx0dmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuXHRcdCAgaWYgKHR5cGVvZih1cmwpICE9ICd1bmRlZmluZWQnKSB7XG5cdFx0ICAgIHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcblx0XHQgIH1cblx0XHR9O1xuXHRcdGd0YWcoJ2V2ZW50JywgJ2NvbnZlcnNpb24nLCB7XG5cdFx0ICAnc2VuZF90byc6ICdBVy05NzY2MjAxNzUvanFDeUNMN2F0WGtRajVYWTBRTScsXG5cdFx0ICAnZXZlbnRfY2FsbGJhY2snOiBjYWxsYmFja1xuXHRcdH0pO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1hbmFnZUVtYWlscygpIHtcblx0XHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCgnI2FjY291bnQtc2V0dGluZ3MtZm9ybScpO1xuXHRcdHZhciByZXN0X3Jvb3QgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0XHR2YXIgZnVsbF91cmwgICAgICAgICAgID0gcmVzdF9yb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdFx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdFx0dmFyIGVtYWlsVG9SZW1vdmUgICAgICA9ICcnO1xuXHRcdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0XHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdFx0dmFyIGFqYXhfZm9ybV9kYXRhICAgICA9ICcnO1xuXHRcdGlmICggJCgnLm0tdXNlci1lbWFpbC1saXN0JykubGVuZ3RoID4gMCApIHtcblx0XHRcdG5leHRFbWFpbENvdW50ID0gJCgnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknKS5sZW5ndGg7XG5cdFx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdFx0JCgnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsJykuY2hhbmdlKCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdC8vZW1haWxUb1JlbW92ZSA9ICQodGhpcykudmFsKCk7XG5cdFx0XHRcdC8vJCggdGhpcyApLnBhcmVudHMoICdsaScgKS5yZW1vdmUoKTtcblx0XHRcdFx0YWpheF9mb3JtX2RhdGEgPSAkKCB0aGlzICkuc2VyaWFsaXplKCk7IC8vYWRkIG91ciBvd24gYWpheCBjaGVjayBhcyBYLVJlcXVlc3RlZC1XaXRoIGlzIG5vdCBhbHdheXMgcmVsaWFibGVcblxuXHRcdFx0XHRhamF4X2Zvcm1fZGF0YSA9IGFqYXhfZm9ybV9kYXRhICsgJyZhamF4cmVxdWVzdD10cnVlJnN1YnNjcmliZSc7XG5cdFx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdFx0dXJsOiBmdWxsX3VybCxcblx0XHRcdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0XHRkYXRhOiBhamF4X2Zvcm1fZGF0YVxuXHRcdFx0XHR9KS5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdyZXNwb25kJyk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9KTtcblx0XHRcdG5leHRFbWFpbENvdW50ID0gJCgnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknKS5sZW5ndGg7XG5cdFx0fVxuXHRcdC8vIGlmIGEgdXNlciB3YW50cyB0byBhZGQgYW4gZW1haWwsIGdpdmUgdGhlbSBhIHByb3Blcmx5IG51bWJlcmVkIGZpZWxkXG5cdFx0JCgnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJykuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkKCcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnKS5iZWZvcmUoJzxkaXYgY2xhc3M9XCJhLWlucHV0LXdpdGgtYnV0dG9uIGEtYnV0dG9uLXNlbnRlbmNlXCI+PGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgaWQ9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgdmFsdWU9XCJcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBuYW1lPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGlkPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGNsYXNzPVwiYS1idXR0b25cIj5BZGQ8L2J1dHRvbj48L2Rpdj4nKTtcblx0XHRcdG5leHRFbWFpbENvdW50Kys7XG5cdFx0fSk7XG5cdFx0JCggZm9ybSApLm9uKCAnc3VibWl0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGFqYXhfZm9ybV9kYXRhID0gZm9ybS5zZXJpYWxpemUoKTsgLy9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBhamF4X2Zvcm1fZGF0YSArICcmcmVzdD10cnVlJztcblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHVybDogZnVsbF91cmwsXG5cdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKCB4aHIgKSB7XG5cdFx0XHQgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Qubm9uY2UgKTtcblx0XHRcdCAgICB9LFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRkYXRhOiBhamF4X2Zvcm1fZGF0YVxuXHRcdFx0fSkuZG9uZShmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdG5ld0VtYWlscyA9ICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKS5tYXAoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiAkKHRoaXMpLnZhbCgpO1xuXHRcdFx0XHR9KS5nZXQoKTtcblx0XHRcdFx0JC5lYWNoKCBuZXdFbWFpbHMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSBuZXh0RW1haWxDb3VudCArIGluZGV4O1xuXHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkuYXBwZW5kKCc8bGk+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1tYWtlLXByaW1hcnktZW1haWxcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW1hcnlfZW1haWxcIiBpZD1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+TWFrZSBQcmltYXJ5PC9zbWFsbD48L2xhYmVsPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcubS1mb3JtLWNoYW5nZS1lbWFpbCAuYS1pbnB1dC13aXRoLWJ1dHRvbicgKS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0alF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0XHRcInVzZSBzdHJpY3RcIjtcblx0XHRpZiAoICQoJy5tLWZvcm0tZW1haWwnKS5sZW5ndGggPiAwICkge1xuXHRcdFx0bWFuYWdlRW1haWxzKCk7XG5cdFx0fVxuXHRcdGlmICggJCgnLm0tZm9ybS1uZXdzbGV0dGVyLXNob3J0Y29kZScpLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHQkKCcubS1mb3JtLW5ld3NsZXR0ZXItc2hvcnRjb2RlIGZpZWxkc2V0JykuYmVmb3JlKCc8ZGl2IGNsYXNzPVwibS1ob2xkLW1lc3NhZ2VcIj48L2Rpdj4nKTtcblx0XHRcdCQoJy5tLWZvcm0tbmV3c2xldHRlci1zaG9ydGNvZGUgZm9ybScpLnN1Ym1pdChmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgZm9ybSBzdWJtaXQuXG5cdFx0XHRcdHZhciBidXR0b24gPSAkKCdidXR0b24nLCB0aGlzKTtcblx0XHRcdFx0YnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0XHRcdGJ1dHRvbi50ZXh0KCdQcm9jZXNzaW5nJyk7XG5cdFx0XHRcdC8vIHNlcmlhbGl6ZSB0aGUgZm9ybSBkYXRhXG5cdFx0XHRcdHZhciBhamF4X2Zvcm1fZGF0YSA9ICQodGhpcykuc2VyaWFsaXplKCk7XG5cdFx0XHRcdC8vYWRkIG91ciBvd24gYWpheCBjaGVjayBhcyBYLVJlcXVlc3RlZC1XaXRoIGlzIG5vdCBhbHdheXMgcmVsaWFibGVcblx0XHRcdFx0YWpheF9mb3JtX2RhdGEgPSBhamF4X2Zvcm1fZGF0YSArICcmYWpheHJlcXVlc3Q9dHJ1ZSZzdWJzY3JpYmUnO1xuXHRcdFx0XHQkLmFqYXgoe1xuXHRcdFx0XHRcdHVybDogcGFyYW1zLmFqYXh1cmwsIC8vIGRvbWFpbi93cC1hZG1pbi9hZG1pbi1hamF4LnBocFxuXHRcdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0XHRkYXRhVHlwZSA6ICdqc29uJyxcblx0XHRcdFx0XHRkYXRhOiBhamF4X2Zvcm1fZGF0YVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuZG9uZShmdW5jdGlvbihyZXNwb25zZSkgeyAvLyByZXNwb25zZSBmcm9tIHRoZSBQSFAgYWN0aW9uXG5cdFx0XHRcdFx0dmFyIG1lc3NhZ2UgPSAnJztcblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLnN1Y2Nlc3MgPT09IHRydWUgKSB7XG5cdFx0XHRcdFx0XHQkKCdmaWVsZHNldCcsIHRoYXQpLmhpZGUoKTtcblx0XHRcdFx0XHRcdGJ1dHRvbi50ZXh0KCdUaGFua3MnKTtcblx0XHRcdFx0XHRcdHZhciBhbmFseXRpY3NfYWN0aW9uID0gJ1NpZ251cCc7XG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHJlc3BvbnNlLmRhdGEudXNlcl9zdGF0dXMpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnZXhpc3RpbmcnOlxuXHRcdFx0XHRcdFx0XHRcdGFuYWx5dGljc19hY3Rpb24gPSAnVXBkYXRlJztcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlID0gJ1RoYW5rcyBmb3IgdXBkYXRpbmcgeW91ciBlbWFpbCBwcmVmZXJlbmNlcy4gVGhleSB3aWxsIGdvIGludG8gZWZmZWN0IGltbWVkaWF0ZWx5Lic7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ25ldyc6XG5cdFx0XHRcdFx0XHRcdFx0YW5hbHl0aWNzX2FjdGlvbiA9ICdTaWdudXAnO1xuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2UgPSAnV2UgaGF2ZSBhZGRlZCB5b3UgdG8gdGhlIE1pbm5Qb3N0IG1haWxpbmcgbGlzdC4nO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdwZW5kaW5nJzpcblx0XHRcdFx0XHRcdFx0XHRhbmFseXRpY3NfYWN0aW9uID0gJ1NpZ251cCc7XG5cdFx0XHRcdFx0XHRcdFx0bWVzc2FnZSA9ICdXZSBoYXZlIGFkZGVkIHlvdSB0byB0aGUgTWlublBvc3QgbWFpbGluZyBsaXN0LiBZb3Ugd2lsbCBuZWVkIHRvIGNsaWNrIHRoZSBjb25maXJtYXRpb24gbGluayBpbiB0aGUgZW1haWwgd2Ugc2VudCB0byBiZWdpbiByZWNlaXZpbmcgbWVzc2FnZXMuJztcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggcmVzcG9uc2UuZGF0YS5jb25maXJtX21lc3NhZ2UgIT09ICcnICkge1xuXHRcdFx0XHRcdFx0XHRtZXNzYWdlID0gcmVzcG9uc2UuZGF0YS5jb25maXJtX21lc3NhZ2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoICdmdW5jdGlvbicgPT09IHR5cGVvZiBtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQgKSB7XG5cdFx0XHRcdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ05ld3NsZXR0ZXInLCBhbmFseXRpY3NfYWN0aW9uLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0XHRcdFx0XHRndGFnX3JlcG9ydF9jb252ZXJzaW9uKCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRidXR0b24ucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHRidXR0b24udGV4dCgnU3Vic2NyaWJlJyk7XG5cdFx0XHRcdFx0XHRpZiAoICdmdW5jdGlvbicgPT09IHR5cGVvZiBtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQgKSB7XG5cdFx0XHRcdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ05ld3NsZXR0ZXInLCAnRmFpbCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQoJy5tLWhvbGQtbWVzc2FnZScpLmh0bWwoJzxkaXYgY2xhc3M9XCJtLWZvcm0tbWVzc2FnZSBtLWZvcm0tbWVzc2FnZS1pbmZvXCI+JyArIG1lc3NhZ2UgKyAnPC9kaXY+Jyk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5mYWlsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0JCgnLm0taG9sZC1tZXNzYWdlJykuaHRtbCgnPGRpdiBjbGFzcz1cIm0tZm9ybS1tZXNzYWdlIG0tZm9ybS1tZXNzYWdlLWluZm9cIj5BbiBlcnJvciBoYXMgb2NjdXJlZC4gUGxlYXNlIHRyeSBhZ2Fpbi48L2Rpdj4nKTtcblx0XHRcdFx0XHRidXR0b24ucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0XHRcdFx0YnV0dG9uLnRleHQoJ1N1YnNjcmliZScpO1xuXHRcdFx0XHRcdGlmICggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCApIHtcblx0XHRcdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ05ld3NsZXR0ZXInLCAnRmFpbCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuYWx3YXlzKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGV2ZW50LnRhcmdldC5yZXNldCgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59KShqUXVlcnkpO1xuIiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogSGFuZGxlcyB0b2dnbGluZyB0aGUgbmF2aWdhdGlvbiBtZW51IGZvciBzbWFsbCBzY3JlZW5zIGFuZCBlbmFibGVzIFRBQiBrZXlcbiAqIG5hdmlnYXRpb24gc3VwcG9ydCBmb3IgZHJvcGRvd24gbWVudXMuXG4gKi9cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cdHZhciBjb250YWluZXIsIGJ1dHRvbiwgbWVudSwgbGlua3MsIGksIGxlbjtcblxuXHRjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ25hdmlnYXRpb24tcHJpbWFyeScgKTtcblx0aWYgKCAhIGNvbnRhaW5lciApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRidXR0b24gPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdidXR0b24nIClbMF07XG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBidXR0b24gKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bWVudSA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ3VsJyApWzBdO1xuXG5cdC8vIEhpZGUgbWVudSB0b2dnbGUgYnV0dG9uIGlmIG1lbnUgaXMgZW1wdHkgYW5kIHJldHVybiBlYXJseS5cblx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG1lbnUgKSB7XG5cdFx0YnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRpZiAoIC0xID09PSBtZW51LmNsYXNzTmFtZS5pbmRleE9mKCAnbWVudScgKSApIHtcblx0XHRtZW51LmNsYXNzTmFtZSArPSAnIG1lbnUnO1xuXHR9XG5cblx0YnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIC0xICE9PSBjb250YWluZXIuY2xhc3NOYW1lLmluZGV4T2YoICd0b2dnbGVkJyApICkge1xuXHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IGNvbnRhaW5lci5jbGFzc05hbWUucmVwbGFjZSggJyB0b2dnbGVkJywgJycgKTtcblx0XHRcdGJ1dHRvbi5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRcdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb250YWluZXIuY2xhc3NOYW1lICs9ICcgdG9nZ2xlZCc7XG5cdFx0XHRidXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyApO1xuXHRcdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEdldCBhbGwgdGhlIGxpbmsgZWxlbWVudHMgd2l0aGluIHRoZSBtZW51LlxuXHRsaW5rcyAgICA9IG1lbnUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdhJyApO1xuXG5cdC8vIEVhY2ggdGltZSBhIG1lbnUgbGluayBpcyBmb2N1c2VkIG9yIGJsdXJyZWQsIHRvZ2dsZSBmb2N1cy5cblx0Zm9yICggaSA9IDAsIGxlbiA9IGxpbmtzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdGxpbmtzW2ldLmFkZEV2ZW50TGlzdGVuZXIoICdmb2N1cycsIHRvZ2dsZUZvY3VzLCB0cnVlICk7XG5cdFx0bGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ2JsdXInLCB0b2dnbGVGb2N1cywgdHJ1ZSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgb3IgcmVtb3ZlcyAuZm9jdXMgY2xhc3Mgb24gYW4gZWxlbWVudC5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZUZvY3VzKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdC8vIE1vdmUgdXAgdGhyb3VnaCB0aGUgYW5jZXN0b3JzIG9mIHRoZSBjdXJyZW50IGxpbmsgdW50aWwgd2UgaGl0IC5uYXYtbWVudS5cblx0XHR3aGlsZSAoIC0xID09PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnbWVudScgKSApIHtcblxuXHRcdFx0Ly8gT24gbGkgZWxlbWVudHMgdG9nZ2xlIHRoZSBjbGFzcyAuZm9jdXMuXG5cdFx0XHRpZiAoICdsaScgPT09IHNlbGYudGFnTmFtZS50b0xvd2VyQ2FzZSgpICkge1xuXHRcdFx0XHRpZiAoIC0xICE9PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnZm9jdXMnICkgKSB7XG5cdFx0XHRcdFx0c2VsZi5jbGFzc05hbWUgPSBzZWxmLmNsYXNzTmFtZS5yZXBsYWNlKCAnIGZvY3VzJywgJycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWxmLmNsYXNzTmFtZSArPSAnIGZvY3VzJztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRzZWxmID0gc2VsZi5wYXJlbnRFbGVtZW50O1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUb2dnbGVzIGBmb2N1c2AgY2xhc3MgdG8gYWxsb3cgc3VibWVudSBhY2Nlc3Mgb24gdGFibGV0cy5cblx0ICovXG5cdCggZnVuY3Rpb24oIGNvbnRhaW5lciApIHtcblx0XHR2YXIgdG91Y2hTdGFydEZuLCBpLFxuXHRcdFx0cGFyZW50TGluayA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCAnLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4gPiBhLCAucGFnZV9pdGVtX2hhc19jaGlsZHJlbiA+IGEnICk7XG5cblx0XHRpZiAoICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyApIHtcblx0XHRcdHRvdWNoU3RhcnRGbiA9IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgbWVudUl0ZW0gPSB0aGlzLnBhcmVudE5vZGUsIGk7XG5cblx0XHRcdFx0aWYgKCAhIG1lbnVJdGVtLmNsYXNzTGlzdC5jb250YWlucyggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW4ubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1lbnVJdGVtID09PSBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldICkge1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW5baV0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtZW51SXRlbS5jbGFzc0xpc3QuYWRkKCAnZm9jdXMnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRmb3IgKCBpID0gMDsgaSA8IHBhcmVudExpbmsubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdHBhcmVudExpbmtbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCB0b3VjaFN0YXJ0Rm4sIGZhbHNlICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KCBjb250YWluZXIgKSApO1xufSk7XG5cbi8vIHVzZXIgYWNjb3VudCBuYXZpZ2F0aW9uIGNhbiBiZSBhIGRyb3Bkb3duXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXHQvLyBoaWRlIG1lbnVcblx0aWYgKCQoJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJykubGVuZ3RoID4gMCApIHtcblx0XHQkKCcjdXNlci1hY2NvdW50LWFjY2VzcyA+IGxpID4gYScpLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0JCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgdWwnKS50b2dnbGVDbGFzcyggJ3Zpc2libGUnICk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0pO1xuXHR9XG5cbn0pO1xuIl19
