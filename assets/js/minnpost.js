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

  jQuery.fn.textNodes = function () {
    return this.contents().filter(function () {
      return this.nodeType === Node.TEXT_NODE && this.nodeValue.trim() !== "";
    });
  };

  function manageEmails() {
    var form = $('#account-settings-form');
    var rest_root = user_account_management_rest.site_url + user_account_management_rest.rest_namespace;
    var full_url = rest_root + '/' + 'update-user/';
    var nextEmailCount = 1;
    var newPrimaryEmail = '';
    var oldPrimaryEmail = '';
    var primaryId = '';
    var emailToRemove = '';
    var consolidatedEmails = [];
    var newEmails = [];
    var ajax_form_data = '';
    var that = '';

    if ($('.m-user-email-list').length > 0) {
      nextEmailCount = $('.m-user-email-list > li').length; // if a user selects a new primary, move it into that position

      $('.m-user-email-list').on('change', '.a-form-caption.a-make-primary-email input[type="radio"]', function (event) {
        newPrimaryEmail = $(this).val();
        oldPrimaryEmail = $('#email').val();
        primaryId = $(this).prop('id').replace('primary_email_', ''); // change the form values to the old primary email

        $('#primary_email_' + primaryId).val(oldPrimaryEmail);
        $('#remove_email_' + primaryId).val(oldPrimaryEmail); // change the user facing values

        $('.m-user-email-list > li').textNodes().first().replaceWith(newPrimaryEmail);
        $('#user-email-' + primaryId).textNodes().first().replaceWith(oldPrimaryEmail); // change the main hidden form value. do this last.

        $('#email').val(newPrimaryEmail);
      }); // if a user removes an email, take it away from the visual and from the form

      $('.m-user-email-list').on('change', '.a-form-caption.a-remove-email input[type="checkbox"]', function (event) {
        emailToRemove = $(this).val();
        $('.m-user-email-list > li').each(function (index) {
          if ($(this).contents().get(0).nodeValue !== emailToRemove) {
            consolidatedEmails.push($(this).contents().get(0).nodeValue);
          }
        }); // get or don't get confirmation from user

        that = $(this).parent().parent();
        $('.a-pre-confirm', that).hide();
        $('.a-form-confirm', that).show();
        $(this).parent().parent().addClass('a-pre-confirm');
        $(this).parent().parent().removeClass('a-stop-confirm');
        $(this).parent().after('<li class="a-form-caption a-form-confirm"><label>Are you sure? <a id="a-confirm-removal" href="#">Yes</a> | <a id="a-stop-removal" href="#">No</a></label></li>');
        $('.m-user-email-list').on('click', '#a-confirm-removal', function (event) {
          event.preventDefault();
          $(this).parents('li').remove();
          $('#_consolidated_emails').val(consolidatedEmails.join(','));
          nextEmailCount = $('.m-user-email-list > li').length;
          form.submit();
        });
        $('.m-user-email-list').on('click', '#a-stop-removal', function (event) {
          event.preventDefault();
          $('.a-pre-confirm', that.parent()).show();
          $('.a-form-confirm', that.parent()).remove();
        });
      });
    } // if a user wants to add an email, give them a properly numbered field


    $('.a-form-caption.a-add-email').on('click', function (event) {
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
          $('.m-user-email-list').append('<li>' + value + '<ul class="a-form-caption a-user-email-actions"><li class="a-form-caption a-pre-confirm a-make-primary-email"><input type="radio" name="primary_email" id="primary_email_' + nextEmailCount + '" value="' + value + '"><label for="primary_email_' + nextEmailCount + '"><small>Make Primary</small></label></li><li class="a-form-caption a-pre-confirm a-remove-email"><input type="checkbox" name="remove_email[' + nextEmailCount + ']" id="remove_email_' + nextEmailCount + '" value="' + value + '"><label for="remove_email_' + nextEmailCount + '"><small>Remove</small></label></li></ul></li>');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuYWx5dGljcy5qcyIsImZvcm1zLmpzIiwibmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6WyJtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsInZhbHVlIiwiZ2EiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiJCIsImNsaWNrIiwiZSIsInRyaW0iLCJocmVmIiwid2lkZ2V0X3RpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJkb2N1bWVudCIsInJlYWR5IiwiUFVNIiwiY3VycmVudF9wb3B1cCIsImdldFBvcHVwIiwic2V0dGluZ3MiLCJnZXRTZXR0aW5ncyIsInBvcHVwX2lkIiwiaWQiLCJvbiIsImNsb3NlX3RyaWdnZXIiLCJmbiIsInBvcG1ha2UiLCJsYXN0X2Nsb3NlX3RyaWdnZXIiLCJ1cmwiLCJhdHRyIiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJndGFnX3JlcG9ydF9jb252ZXJzaW9uIiwiY2FsbGJhY2siLCJ3aW5kb3ciLCJndGFnIiwidGV4dE5vZGVzIiwiY29udGVudHMiLCJmaWx0ZXIiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJub2RlVmFsdWUiLCJtYW5hZ2VFbWFpbHMiLCJmb3JtIiwicmVzdF9yb290IiwidXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdCIsInNpdGVfdXJsIiwicmVzdF9uYW1lc3BhY2UiLCJmdWxsX3VybCIsIm5leHRFbWFpbENvdW50IiwibmV3UHJpbWFyeUVtYWlsIiwib2xkUHJpbWFyeUVtYWlsIiwicHJpbWFyeUlkIiwiZW1haWxUb1JlbW92ZSIsImNvbnNvbGlkYXRlZEVtYWlscyIsIm5ld0VtYWlscyIsImFqYXhfZm9ybV9kYXRhIiwidGhhdCIsImxlbmd0aCIsImV2ZW50IiwidmFsIiwicHJvcCIsInJlcGxhY2UiLCJmaXJzdCIsInJlcGxhY2VXaXRoIiwiZWFjaCIsImluZGV4IiwiZ2V0IiwicHVzaCIsInBhcmVudCIsImhpZGUiLCJzaG93IiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFmdGVyIiwicHJldmVudERlZmF1bHQiLCJwYXJlbnRzIiwicmVtb3ZlIiwiam9pbiIsInN1Ym1pdCIsImJlZm9yZSIsInNlcmlhbGl6ZSIsImFqYXgiLCJiZWZvcmVTZW5kIiwieGhyIiwic2V0UmVxdWVzdEhlYWRlciIsIm5vbmNlIiwiZGF0YVR5cGUiLCJkYXRhIiwiZG9uZSIsIm1hcCIsImFwcGVuZCIsImJ1dHRvbiIsInBhcmFtcyIsImFqYXh1cmwiLCJyZXNwb25zZSIsIm1lc3NhZ2UiLCJzdWNjZXNzIiwiYW5hbHl0aWNzX2FjdGlvbiIsInVzZXJfc3RhdHVzIiwiY29uZmlybV9tZXNzYWdlIiwiaHRtbCIsImZhaWwiLCJhbHdheXMiLCJ0YXJnZXQiLCJyZXNldCIsImNvbnRhaW5lciIsIm1lbnUiLCJsaW5rcyIsImkiLCJsZW4iLCJnZXRFbGVtZW50QnlJZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwic3R5bGUiLCJkaXNwbGF5Iiwic2V0QXR0cmlidXRlIiwiY2xhc3NOYW1lIiwiaW5kZXhPZiIsIm9uY2xpY2siLCJhZGRFdmVudExpc3RlbmVyIiwidG9nZ2xlRm9jdXMiLCJzZWxmIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwicGFyZW50RWxlbWVudCIsInRvdWNoU3RhcnRGbiIsInBhcmVudExpbmsiLCJxdWVyeVNlbGVjdG9yQWxsIiwibWVudUl0ZW0iLCJwYXJlbnROb2RlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJjaGlsZHJlbiIsImFkZCIsInRvZ2dsZUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLDJCQUFULENBQXNDQyxJQUF0QyxFQUE0Q0MsUUFBNUMsRUFBc0RDLE1BQXRELEVB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Q0FuR0QsRSxDQXFHQTs7QUFDQTVHLE1BQU0sQ0FBRWEsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVVixDQUFWLEVBQWM7QUFDdkM7QUFDQSxNQUFJQSxDQUFDLENBQUMseUJBQUQsQ0FBRCxDQUE2QndELE1BQTdCLEdBQXNDLENBQTFDLEVBQThDO0FBQzdDeEQsSUFBQUEsQ0FBQyxDQUFDLCtCQUFELENBQUQsQ0FBbUNrQixFQUFuQyxDQUF1QyxPQUF2QyxFQUFnRCxVQUFTdUMsS0FBVCxFQUFnQjtBQUMvRHpELE1BQUFBLENBQUMsQ0FBQyx5QkFBRCxDQUFELENBQTZCb0ksV0FBN0IsQ0FBMEMsU0FBMUM7QUFDQTNFLE1BQUFBLEtBQUssQ0FBQ2dCLGNBQU47QUFDQSxLQUhEO0FBSUE7QUFFRCxDQVREIiwiZmlsZSI6Im1pbm5wb3N0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gbXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKSB7XG5cdGlmICggdHlwZW9mIGdhICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICkge1xuXG5cdC8vIGlmIGEgbm90IGxvZ2dlZCBpbiB1c2VyIHRyaWVzIHRvIGVtYWlsLCBkb24ndCBjb3VudCB0aGF0IGFzIGEgc2hhcmVcblx0aWYgKCAhIGpRdWVyeSggJ2JvZHkgJykuaGFzQ2xhc3MoICdsb2dnZWQtaW4nKSAmJiAnRW1haWwnID09PSB0ZXh0ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIHRyYWNrIGFzIGFuIGV2ZW50LCBhbmQgYXMgc29jaWFsIGlmIGl0IGlzIHR3aXR0ZXIgb3IgZmJcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2hhcmUgLSAnICsgcG9zaXRpb24sIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgfHwgJ1R3aXR0ZXInID09PSB0ZXh0ICkge1xuXHRcdFx0aWYgKCB0ZXh0ID09ICdGYWNlYm9vaycgKSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnU2hhcmUnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdUd2VldCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG4oIGZ1bmN0aW9uKCAkICkge1xuXG5cdCQgKCAnLm0tZW50cnktc2hhcmUtdG9wIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdHZhciB0ZXh0ID0gJCggdGhpcyApLnRleHQoKS50cmltKCk7XG5cdFx0dmFyIHBvc2l0aW9uID0gJ3RvcCc7XG5cdFx0dHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcblx0fSk7XG5cblx0JCAoICcubS1lbnRyeS1zaGFyZS1ib3R0b20gYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpLnRyaW0oKTtcblx0XHR2YXIgcG9zaXRpb24gPSAnYm90dG9tJztcblx0XHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xuXHR9KTtcblxuXHQkKCAnI25hdmlnYXRpb24tZmVhdHVyZWQgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnRmVhdHVyZWQgQmFyIExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcblx0fSk7XG5cdCQoICdhLmdsZWFuLXNpZGViYXInICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1NpZGViYXIgU3VwcG9ydCBMaW5rJywgJ0NsaWNrJywgdGhpcy5ocmVmICk7XG5cdH0pO1xuXG5cdCQoICdhJywgJCggJy5vLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgd2lkZ2V0X3RpdGxlID0gJCh0aGlzKS5jbG9zZXN0KCcubS13aWRnZXQnKS5maW5kKCdoMycpLnRleHQoKTtcblx0XHR2YXIgc2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gJyc7XG5cdFx0aWYgKHdpZGdldF90aXRsZSA9PT0gJycpIHtcblx0XHRcdC8vc2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gJCh0aGlzKS5jbG9zZXN0KCcubm9kZS10eXBlLXNwaWxsJykuZmluZCgnLm5vZGUtdGl0bGUgYScpLnRleHQoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gd2lkZ2V0X3RpdGxlO1xuXHRcdH1cblx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJfc2VjdGlvbl90aXRsZSk7XG5cdH0pO1xuXG5cdCQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uICggZSApIHtcblxuXHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBQVU0gKSB7XG5cdFx0XHR2YXIgY3VycmVudF9wb3B1cCA9IFBVTS5nZXRQb3B1cCggJCggJy5wdW0nICkgKTtcblx0XHRcdHZhciBzZXR0aW5ncyA9IFBVTS5nZXRTZXR0aW5ncyggJCggJy5wdW0nICkgKTtcblx0XHRcdHZhciBwb3B1cF9pZCA9IHNldHRpbmdzLmlkO1xuXHRcdFx0JCggZG9jdW1lbnQgKS5vbigncHVtQWZ0ZXJPcGVuJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdTaG93JywgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9ICk7XG5cdFx0XHR9KTtcblx0XHRcdCQoIGRvY3VtZW50ICkub24oJ3B1bUFmdGVyQ2xvc2UnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJC5mbi5wb3BtYWtlLmxhc3RfY2xvc2VfdHJpZ2dlcjtcblx0XHRcdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGNsb3NlX3RyaWdnZXIgKSB7XG5cdFx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCBjbG9zZV90cmlnZ2VyLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLm1lc3NhZ2UtY2xvc2UnICkuY2xpY2soZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIGxpbmsgd2l0aCBjbG9zZSBjbGFzc1xuXHRcdFx0XHR2YXIgY2xvc2VfdHJpZ2dlciA9ICdDbG9zZSBCdXR0b24nO1xuXHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSApO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLm1lc3NhZ2UtbG9naW4nICkuY2xpY2soZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIGxpbmsgd2l0aCBsb2dpbiBjbGFzc1xuXHRcdFx0XHR2YXIgdXJsID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ0xvZ2luIExpbmsnLCB1cmwgKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5wdW0tY29udGVudCBhOm5vdCggLm1lc3NhZ2UtY2xvc2UsIC5wdW0tY2xvc2UsIC5tZXNzYWdlLWxvZ2luICknICkuY2xpY2soIGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBzb21ldGhpbmcgdGhhdCBpcyBub3QgY2xvc2UgdGV4dCBvciBjbG9zZSBpY29uXG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ0NsaWNrJywgcG9wdXBfaWQgKTtcbiAgICAgICAgICAgIH0pO1xuXHRcdH1cblxuXHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEgJiYgJycgIT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS51cmxfYWNjZXNzX2xldmVsICkge1xuXHRcdFx0dmFyIHR5cGUgPSAnZXZlbnQnO1xuXHRcdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHRcdHZhciBsYWJlbCA9IGxvY2F0aW9uLnBhdGhuYW1lOyAvLyBpIHRoaW5rIHdlIGNvdWxkIHBvc3NpYmx5IHB1dCBzb21lIGdyb3VwaW5nIGhlcmUsIGJ1dCB3ZSBkb24ndCBuZWNlc3NhcmlseSBoYXZlIGFjY2VzcyB0byBvbmUgYW5kIG1heWJlIGl0J3Mgbm90IHdvcnRod2hpbGUgeWV0XG5cdFx0XHR2YXIgYWN0aW9uID0gJ0Jsb2NrZWQnO1xuXHRcdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRcdGFjdGlvbiA9ICdTaG93bic7XG5cdFx0XHR9XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdFx0fVxuXHR9KTtcblxufSApKCBqUXVlcnkgKTsiLCIoZnVuY3Rpb24oJCl7XG5cdGZ1bmN0aW9uIGd0YWdfcmVwb3J0X2NvbnZlcnNpb24odXJsKSB7XG5cdFx0dmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuXHRcdCAgaWYgKHR5cGVvZih1cmwpICE9ICd1bmRlZmluZWQnKSB7XG5cdFx0ICAgIHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcblx0XHQgIH1cblx0XHR9O1xuXHRcdGd0YWcoJ2V2ZW50JywgJ2NvbnZlcnNpb24nLCB7XG5cdFx0ICAnc2VuZF90byc6ICdBVy05NzY2MjAxNzUvanFDeUNMN2F0WGtRajVYWTBRTScsXG5cdFx0ICAnZXZlbnRfY2FsbGJhY2snOiBjYWxsYmFja1xuXHRcdH0pO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGpRdWVyeS5mbi50ZXh0Tm9kZXMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlcihmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiAodGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgdGhpcy5ub2RlVmFsdWUudHJpbSgpICE9PSBcIlwiKTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1hbmFnZUVtYWlscygpIHtcblx0XHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCgnI2FjY291bnQtc2V0dGluZ3MtZm9ybScpO1xuXHRcdHZhciByZXN0X3Jvb3QgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0XHR2YXIgZnVsbF91cmwgICAgICAgICAgID0gcmVzdF9yb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdFx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdFx0dmFyIG5ld1ByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHRcdHZhciBvbGRQcmltYXJ5RW1haWwgICAgPSAnJztcblx0XHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdFx0dmFyIGVtYWlsVG9SZW1vdmUgICAgICA9ICcnO1xuXHRcdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0XHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdFx0dmFyIGFqYXhfZm9ybV9kYXRhICAgICA9ICcnO1xuXHRcdHZhciB0aGF0ICAgICAgICAgICAgICAgPSAnJztcblx0XHRpZiAoICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoID4gMCApIHtcblx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdC8vIGlmIGEgdXNlciBzZWxlY3RzIGEgbmV3IHByaW1hcnksIG1vdmUgaXQgaW50byB0aGF0IHBvc2l0aW9uXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2hhbmdlJywgJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdG5ld1ByaW1hcnlFbWFpbCA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdFx0cHJpbWFyeUlkICAgICAgID0gJCggdGhpcyApLnByb3AoICdpZCcgKS5yZXBsYWNlKCAncHJpbWFyeV9lbWFpbF8nLCAnJyApO1xuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIGZvcm0gdmFsdWVzIHRvIHRoZSBvbGQgcHJpbWFyeSBlbWFpbFxuXHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjcmVtb3ZlX2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgbWFpbiBoaWRkZW4gZm9ybSB2YWx1ZS4gZG8gdGhpcyBsYXN0LlxuXHRcdFx0XHQkKCAnI2VtYWlsJyApLnZhbCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHR9KTtcblx0XHRcdC8vIGlmIGEgdXNlciByZW1vdmVzIGFuIGVtYWlsLCB0YWtlIGl0IGF3YXkgZnJvbSB0aGUgdmlzdWFsIGFuZCBmcm9tIHRoZSBmb3JtXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2hhbmdlJywgJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoMCkubm9kZVZhbHVlICE9PSBlbWFpbFRvUmVtb3ZlICkge1xuXHRcdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCgwKS5ub2RlVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcblx0XHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkuYWZ0ZXIoICc8bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLWZvcm0tY29uZmlybVwiPjxsYWJlbD5BcmUgeW91IHN1cmU/IDxhIGlkPVwiYS1jb25maXJtLXJlbW92YWxcIiBocmVmPVwiI1wiPlllczwvYT4gfCA8YSBpZD1cImEtc3RvcC1yZW1vdmFsXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+JyApO1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHRcdCQoJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcpLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0JCgnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJykuYmVmb3JlKCc8ZGl2IGNsYXNzPVwiYS1pbnB1dC13aXRoLWJ1dHRvbiBhLWJ1dHRvbi1zZW50ZW5jZVwiPjxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIGlkPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIHZhbHVlPVwiXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBpZD1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBjbGFzcz1cImEtYnV0dG9uXCI+QWRkPC9idXR0b24+PC9kaXY+JyApO1xuXHRcdFx0bmV4dEVtYWlsQ291bnQrKztcblx0XHR9KTtcblx0XHQkKCBmb3JtICkub24oICdzdWJtaXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4X2Zvcm1fZGF0YSA9IGFqYXhfZm9ybV9kYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dXJsOiBmdWxsX3VybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcblx0XHRcdCAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0ICAgIH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhfZm9ybV9kYXRhXG5cdFx0XHR9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQodGhpcykudmFsKCk7XG5cdFx0XHRcdH0pLmdldCgpO1xuXHRcdFx0XHQkLmVhY2goIG5ld0VtYWlscywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9IG5leHRFbWFpbENvdW50ICsgaW5kZXg7XG5cdFx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5hcHBlbmQoICc8bGk+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtcmVtb3ZlLWVtYWlsXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJyZW1vdmVfZW1haWxbJyArIG5leHRFbWFpbENvdW50ICsgJ11cIiBpZD1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPlJlbW92ZTwvc21hbGw+PC9sYWJlbD48L2xpPjwvdWw+PC9saT4nICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFx0aWYgKCAkKCcubS1mb3JtLWVtYWlsJykubGVuZ3RoID4gMCApIHtcblx0XHRcdG1hbmFnZUVtYWlscygpO1xuXHRcdH1cblx0XHRpZiAoICQoJy5tLWZvcm0tbmV3c2xldHRlci1zaG9ydGNvZGUnKS5sZW5ndGggPiAwICkge1xuXHRcdFx0JCgnLm0tZm9ybS1uZXdzbGV0dGVyLXNob3J0Y29kZSBmaWVsZHNldCcpLmJlZm9yZSgnPGRpdiBjbGFzcz1cIm0taG9sZC1tZXNzYWdlXCI+PC9kaXY+Jyk7XG5cdFx0XHQkKCcubS1mb3JtLW5ld3NsZXR0ZXItc2hvcnRjb2RlIGZvcm0nKS5zdWJtaXQoZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGZvcm0gc3VibWl0LlxuXHRcdFx0XHR2YXIgYnV0dG9uID0gJCgnYnV0dG9uJywgdGhpcyk7XG5cdFx0XHRcdGJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdFx0XHRidXR0b24udGV4dCgnUHJvY2Vzc2luZycpO1xuXHRcdFx0XHQvLyBzZXJpYWxpemUgdGhlIGZvcm0gZGF0YVxuXHRcdFx0XHR2YXIgYWpheF9mb3JtX2RhdGEgPSAkKHRoaXMpLnNlcmlhbGl6ZSgpO1xuXHRcdFx0XHQvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRcdGFqYXhfZm9ybV9kYXRhID0gYWpheF9mb3JtX2RhdGEgKyAnJmFqYXhyZXF1ZXN0PXRydWUmc3Vic2NyaWJlJztcblx0XHRcdFx0JC5hamF4KHtcblx0XHRcdFx0XHR1cmw6IHBhcmFtcy5hamF4dXJsLCAvLyBkb21haW4vd3AtYWRtaW4vYWRtaW4tYWpheC5waHBcblx0XHRcdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRcdFx0ZGF0YVR5cGUgOiAnanNvbicsXG5cdFx0XHRcdFx0ZGF0YTogYWpheF9mb3JtX2RhdGFcblx0XHRcdFx0fSlcblx0XHRcdFx0LmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHsgLy8gcmVzcG9uc2UgZnJvbSB0aGUgUEhQIGFjdGlvblxuXHRcdFx0XHRcdHZhciBtZXNzYWdlID0gJyc7XG5cdFx0XHRcdFx0aWYgKCByZXNwb25zZS5zdWNjZXNzID09PSB0cnVlICkge1xuXHRcdFx0XHRcdFx0JCgnZmllbGRzZXQnLCB0aGF0KS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRidXR0b24udGV4dCgnVGhhbmtzJyk7XG5cdFx0XHRcdFx0XHR2YXIgYW5hbHl0aWNzX2FjdGlvbiA9ICdTaWdudXAnO1xuXHRcdFx0XHRcdFx0c3dpdGNoIChyZXNwb25zZS5kYXRhLnVzZXJfc3RhdHVzKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2V4aXN0aW5nJzpcblx0XHRcdFx0XHRcdFx0XHRhbmFseXRpY3NfYWN0aW9uID0gJ1VwZGF0ZSc7XG5cdFx0XHRcdFx0XHRcdFx0bWVzc2FnZSA9ICdUaGFua3MgZm9yIHVwZGF0aW5nIHlvdXIgZW1haWwgcHJlZmVyZW5jZXMuIFRoZXkgd2lsbCBnbyBpbnRvIGVmZmVjdCBpbW1lZGlhdGVseS4nO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlICduZXcnOlxuXHRcdFx0XHRcdFx0XHRcdGFuYWx5dGljc19hY3Rpb24gPSAnU2lnbnVwJztcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlID0gJ1dlIGhhdmUgYWRkZWQgeW91IHRvIHRoZSBNaW5uUG9zdCBtYWlsaW5nIGxpc3QuJztcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGVuZGluZyc6XG5cdFx0XHRcdFx0XHRcdFx0YW5hbHl0aWNzX2FjdGlvbiA9ICdTaWdudXAnO1xuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2UgPSAnV2UgaGF2ZSBhZGRlZCB5b3UgdG8gdGhlIE1pbm5Qb3N0IG1haWxpbmcgbGlzdC4gWW91IHdpbGwgbmVlZCB0byBjbGljayB0aGUgY29uZmlybWF0aW9uIGxpbmsgaW4gdGhlIGVtYWlsIHdlIHNlbnQgdG8gYmVnaW4gcmVjZWl2aW5nIG1lc3NhZ2VzLic7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLmRhdGEuY29uZmlybV9tZXNzYWdlICE9PSAnJyApIHtcblx0XHRcdFx0XHRcdFx0bWVzc2FnZSA9IHJlc3BvbnNlLmRhdGEuY29uZmlybV9tZXNzYWdlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgbXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50ICkge1xuXHRcdFx0XHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdOZXdzbGV0dGVyJywgYW5hbHl0aWNzX2FjdGlvbiwgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdFx0XHRcdFx0Z3RhZ19yZXBvcnRfY29udmVyc2lvbiggbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdFx0XHRcdFx0YnV0dG9uLnRleHQoJ1N1YnNjcmliZScpO1xuXHRcdFx0XHRcdFx0aWYgKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgbXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50ICkge1xuXHRcdFx0XHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdOZXdzbGV0dGVyJywgJ0ZhaWwnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkKCcubS1ob2xkLW1lc3NhZ2UnKS5odG1sKCc8ZGl2IGNsYXNzPVwibS1mb3JtLW1lc3NhZ2UgbS1mb3JtLW1lc3NhZ2UtaW5mb1wiPicgKyBtZXNzYWdlICsgJzwvZGl2PicpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuZmFpbChmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRcdCQoJy5tLWhvbGQtbWVzc2FnZScpLmh0bWwoJzxkaXYgY2xhc3M9XCJtLWZvcm0tbWVzc2FnZSBtLWZvcm0tbWVzc2FnZS1pbmZvXCI+QW4gZXJyb3IgaGFzIG9jY3VyZWQuIFBsZWFzZSB0cnkgYWdhaW4uPC9kaXY+Jyk7XG5cdFx0XHRcdFx0YnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdFx0XHRcdGJ1dHRvbi50ZXh0KCdTdWJzY3JpYmUnKTtcblx0XHRcdFx0XHRpZiAoICdmdW5jdGlvbicgPT09IHR5cGVvZiBtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQgKSB7XG5cdFx0XHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdOZXdzbGV0dGVyJywgJ0ZhaWwnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdFx0LmFsd2F5cyhmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRldmVudC50YXJnZXQucmVzZXQoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufSkoalF1ZXJ5KTtcbiIsIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIEhhbmRsZXMgdG9nZ2xpbmcgdGhlIG5hdmlnYXRpb24gbWVudSBmb3Igc21hbGwgc2NyZWVucyBhbmQgZW5hYmxlcyBUQUIga2V5XG4gKiBuYXZpZ2F0aW9uIHN1cHBvcnQgZm9yIGRyb3Bkb3duIG1lbnVzLlxuICovXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXHR2YXIgY29udGFpbmVyLCBidXR0b24sIG1lbnUsIGxpbmtzLCBpLCBsZW47XG5cblx0Y29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICduYXZpZ2F0aW9uLXByaW1hcnknICk7XG5cdGlmICggISBjb250YWluZXIgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0YnV0dG9uID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYnV0dG9uJyApWzBdO1xuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgYnV0dG9uICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1lbnUgPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICd1bCcgKVswXTtcblxuXHQvLyBIaWRlIG1lbnUgdG9nZ2xlIGJ1dHRvbiBpZiBtZW51IGlzIGVtcHR5IGFuZCByZXR1cm4gZWFybHkuXG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBtZW51ICkge1xuXHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0aWYgKCAtMSA9PT0gbWVudS5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cdFx0bWVudS5jbGFzc05hbWUgKz0gJyBtZW51Jztcblx0fVxuXG5cdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCAtMSAhPT0gY29udGFpbmVyLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZCcgKSApIHtcblx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgPSBjb250YWluZXIuY2xhc3NOYW1lLnJlcGxhY2UoICcgdG9nZ2xlZCcsICcnICk7XG5cdFx0XHRidXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSArPSAnIHRvZ2dsZWQnO1xuXHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyApO1xuXHRcdH1cblx0fTtcblxuXHQvLyBHZXQgYWxsIHRoZSBsaW5rIGVsZW1lbnRzIHdpdGhpbiB0aGUgbWVudS5cblx0bGlua3MgICAgPSBtZW51LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYScgKTtcblxuXHQvLyBFYWNoIHRpbWUgYSBtZW51IGxpbmsgaXMgZm9jdXNlZCBvciBibHVycmVkLCB0b2dnbGUgZm9jdXMuXG5cdGZvciAoIGkgPSAwLCBsZW4gPSBsaW5rcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCAnZm9jdXMnLCB0b2dnbGVGb2N1cywgdHJ1ZSApO1xuXHRcdGxpbmtzW2ldLmFkZEV2ZW50TGlzdGVuZXIoICdibHVyJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIG9yIHJlbW92ZXMgLmZvY3VzIGNsYXNzIG9uIGFuIGVsZW1lbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVGb2N1cygpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHQvLyBNb3ZlIHVwIHRocm91Z2ggdGhlIGFuY2VzdG9ycyBvZiB0aGUgY3VycmVudCBsaW5rIHVudGlsIHdlIGhpdCAubmF2LW1lbnUuXG5cdFx0d2hpbGUgKCAtMSA9PT0gc2VsZi5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cblx0XHRcdC8vIE9uIGxpIGVsZW1lbnRzIHRvZ2dsZSB0aGUgY2xhc3MgLmZvY3VzLlxuXHRcdFx0aWYgKCAnbGknID09PSBzZWxmLnRhZ05hbWUudG9Mb3dlckNhc2UoKSApIHtcblx0XHRcdFx0aWYgKCAtMSAhPT0gc2VsZi5jbGFzc05hbWUuaW5kZXhPZiggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRcdHNlbGYuY2xhc3NOYW1lID0gc2VsZi5jbGFzc05hbWUucmVwbGFjZSggJyBmb2N1cycsICcnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VsZi5jbGFzc05hbWUgKz0gJyBmb2N1cyc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0c2VsZiA9IHNlbGYucGFyZW50RWxlbWVudDtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyBgZm9jdXNgIGNsYXNzIHRvIGFsbG93IHN1Ym1lbnUgYWNjZXNzIG9uIHRhYmxldHMuXG5cdCAqL1xuXHQoIGZ1bmN0aW9uKCBjb250YWluZXIgKSB7XG5cdFx0dmFyIHRvdWNoU3RhcnRGbiwgaSxcblx0XHRcdHBhcmVudExpbmsgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCggJy5tZW51LWl0ZW0taGFzLWNoaWxkcmVuID4gYSwgLnBhZ2VfaXRlbV9oYXNfY2hpbGRyZW4gPiBhJyApO1xuXG5cdFx0aWYgKCAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgKSB7XG5cdFx0XHR0b3VjaFN0YXJ0Rm4gPSBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0dmFyIG1lbnVJdGVtID0gdGhpcy5wYXJlbnROb2RlLCBpO1xuXG5cdFx0XHRcdGlmICggISBtZW51SXRlbS5jbGFzc0xpc3QuY29udGFpbnMoICdmb2N1cycgKSApIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0Zm9yICggaSA9IDA7IGkgPCBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuLmxlbmd0aDsgKytpICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtZW51SXRlbSA9PT0gbWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbltpXSApIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LmFkZCggJ2ZvY3VzJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1lbnVJdGVtLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBwYXJlbnRMaW5rLmxlbmd0aDsgKytpICkge1xuXHRcdFx0XHRwYXJlbnRMaW5rW2ldLmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hTdGFydEZuLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSggY29udGFpbmVyICkgKTtcbn0pO1xuXG4vLyB1c2VyIGFjY291bnQgbmF2aWdhdGlvbiBjYW4gYmUgYSBkcm9wZG93blxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0Ly8gaGlkZSBtZW51XG5cdGlmICgkKCcjdXNlci1hY2NvdW50LWFjY2VzcyB1bCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0JCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgPiBsaSA+IGEnKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdCQoJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJykudG9nZ2xlQ2xhc3MoICd2aXNpYmxlJyApO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9KTtcblx0fVxuXG59KTtcbiJdfQ==
