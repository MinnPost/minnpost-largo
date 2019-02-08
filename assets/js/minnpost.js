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

      $('.a-form-caption.a-remove-email input[type="checkbox"]').change(function (event) {
        emailToRemove = $(this).val();
        $('.m-user-email-list > li').each(function (index) {
          if ($(this).contents().get(0).nodeValue !== emailToRemove) {
            consolidatedEmails.push($(this).contents().get(0).nodeValue);
          }
        }); // check for confirmation from user, then do this:

        $(this).parent().html('Are you sure you want to remove this email? <button type="button" name="a-confirm-removal" id="a-confirm-removal" class="a-button">Confirm</button>');
        $('#a-confirm-removal').click(function (event) {
          $(this).parents('li').remove();
          $('#_consolidated_emails').val(consolidatedEmails.join(','));
          nextEmailCount = $('.m-user-email-list > li').length;
          form.submit();
        });
      });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuYWx5dGljcy5qcyIsImZvcm1zLmpzIiwibmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6WyJtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsInZhbHVlIiwiZ2EiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiJCIsImNsaWNrIiwiZSIsInRyaW0iLCJocmVmIiwid2lkZ2V0X3RpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJkb2N1bWVudCIsInJlYWR5IiwiUFVNIiwiY3VycmVudF9wb3B1cCIsImdldFBvcHVwIiwic2V0dGluZ3MiLCJnZXRTZXR0aW5ncyIsInBvcHVwX2lkIiwiaWQiLCJvbiIsImNsb3NlX3RyaWdnZXIiLCJmbiIsInBvcG1ha2UiLCJsYXN0X2Nsb3NlX3RyaWdnZXIiLCJ1cmwiLCJhdHRyIiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJndGFnX3JlcG9ydF9jb252ZXJzaW9uIiwiY2FsbGJhY2siLCJ3aW5kb3ciLCJndGFnIiwibWFuYWdlRW1haWxzIiwiZm9ybSIsInJlc3Rfcm9vdCIsInVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QiLCJzaXRlX3VybCIsInJlc3RfbmFtZXNwYWNlIiwiZnVsbF91cmwiLCJuZXh0RW1haWxDb3VudCIsImVtYWlsVG9SZW1vdmUiLCJjb25zb2xpZGF0ZWRFbWFpbHMiLCJuZXdFbWFpbHMiLCJhamF4X2Zvcm1fZGF0YSIsImxlbmd0aCIsImNoYW5nZSIsImV2ZW50IiwidmFsIiwiZWFjaCIsImluZGV4IiwiY29udGVudHMiLCJnZXQiLCJub2RlVmFsdWUiLCJwdXNoIiwicGFyZW50IiwiaHRtbCIsInBhcmVudHMiLCJyZW1vdmUiLCJqb2luIiwic3VibWl0IiwicHJldmVudERlZmF1bHQiLCJiZWZvcmUiLCJzZXJpYWxpemUiLCJhamF4IiwiYmVmb3JlU2VuZCIsInhociIsInNldFJlcXVlc3RIZWFkZXIiLCJub25jZSIsImRhdGFUeXBlIiwiZGF0YSIsImRvbmUiLCJtYXAiLCJhcHBlbmQiLCJ0aGF0IiwiYnV0dG9uIiwicHJvcCIsInBhcmFtcyIsImFqYXh1cmwiLCJyZXNwb25zZSIsIm1lc3NhZ2UiLCJzdWNjZXNzIiwiaGlkZSIsImFuYWx5dGljc19hY3Rpb24iLCJ1c2VyX3N0YXR1cyIsImNvbmZpcm1fbWVzc2FnZSIsImZhaWwiLCJhbHdheXMiLCJ0YXJnZXQiLCJyZXNldCIsImNvbnRhaW5lciIsIm1lbnUiLCJsaW5rcyIsImkiLCJsZW4iLCJnZXRFbGVtZW50QnlJZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwic3R5bGUiLCJkaXNwbGF5Iiwic2V0QXR0cmlidXRlIiwiY2xhc3NOYW1lIiwiaW5kZXhPZiIsIm9uY2xpY2siLCJyZXBsYWNlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRvZ2dsZUZvY3VzIiwic2VsZiIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsInBhcmVudEVsZW1lbnQiLCJ0b3VjaFN0YXJ0Rm4iLCJwYXJlbnRMaW5rIiwicXVlcnlTZWxlY3RvckFsbCIsIm1lbnVJdGVtIiwicGFyZW50Tm9kZSIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiY2hpbGRyZW4iLCJhZGQiLCJ0b2dnbGVDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSwyQkFBVCxDQUFzQ0MsSUFBdEMsRUFBNENDLFFBQTVDLEVBQXNEQyxNQUF0RCxFQUE4REMsS0FBOUQsRUFBcUVDLEtBQXJFLEVBQTZFO0FBQzVFLE1BQUssT0FBT0MsRUFBUCxLQUFjLFdBQW5CLEVBQWlDO0FBQ2hDLFFBQUssT0FBT0QsS0FBUCxLQUFpQixXQUF0QixFQUFvQztBQUNuQ0MsTUFBQUEsRUFBRSxDQUFFLE1BQUYsRUFBVUwsSUFBVixFQUFnQkMsUUFBaEIsRUFBMEJDLE1BQTFCLEVBQWtDQyxLQUFsQyxDQUFGO0FBQ0EsS0FGRCxNQUVPO0FBQ05FLE1BQUFBLEVBQUUsQ0FBRSxNQUFGLEVBQVVMLElBQVYsRUFBZ0JDLFFBQWhCLEVBQTBCQyxNQUExQixFQUFrQ0MsS0FBbEMsRUFBeUNDLEtBQXpDLENBQUY7QUFDQTtBQUNELEdBTkQsTUFNTztBQUNOO0FBQ0E7QUFDRDs7QUFFRCxTQUFTRSxVQUFULENBQXFCQyxJQUFyQixFQUEyQkMsUUFBM0IsRUFBc0M7QUFFckM7QUFDQSxNQUFLLENBQUVDLE1BQU0sQ0FBRSxPQUFGLENBQU4sQ0FBaUJDLFFBQWpCLENBQTJCLFdBQTNCLENBQUYsSUFBNkMsWUFBWUgsSUFBOUQsRUFBcUU7QUFDcEU7QUFDQSxHQUxvQyxDQU9yQzs7O0FBQ0FSLEVBQUFBLDJCQUEyQixDQUFFLE9BQUYsRUFBVyxhQUFhUyxRQUF4QixFQUFrQ0QsSUFBbEMsRUFBd0NJLFFBQVEsQ0FBQ0MsUUFBakQsQ0FBM0I7O0FBQ0EsTUFBSyxnQkFBZ0IsT0FBT1AsRUFBNUIsRUFBaUM7QUFDaEMsUUFBSyxlQUFlRSxJQUFmLElBQXVCLGNBQWNBLElBQTFDLEVBQWlEO0FBQ2hELFVBQUtBLElBQUksSUFBSSxVQUFiLEVBQTBCO0FBQ3pCRixRQUFBQSxFQUFFLENBQUUsTUFBRixFQUFVLFFBQVYsRUFBb0JFLElBQXBCLEVBQTBCLE9BQTFCLEVBQW1DSSxRQUFRLENBQUNDLFFBQTVDLENBQUY7QUFDQSxPQUZELE1BRU87QUFDTlAsUUFBQUEsRUFBRSxDQUFFLE1BQUYsRUFBVSxRQUFWLEVBQW9CRSxJQUFwQixFQUEwQixPQUExQixFQUFtQ0ksUUFBUSxDQUFDQyxRQUE1QyxDQUFGO0FBQ0E7QUFDRDtBQUNELEdBUkQsTUFRTztBQUNOO0FBQ0E7QUFDRDs7QUFFRCxDQUFFLFVBQVVDLENBQVYsRUFBYztBQUVmQSxFQUFBQSxDQUFDLENBQUcsc0JBQUgsQ0FBRCxDQUE2QkMsS0FBN0IsQ0FBb0MsVUFBVUMsQ0FBVixFQUFjO0FBQ2pELFFBQUlSLElBQUksR0FBR00sQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVTixJQUFWLEdBQWlCUyxJQUFqQixFQUFYO0FBQ0EsUUFBSVIsUUFBUSxHQUFHLEtBQWY7QUFDQUYsSUFBQUEsVUFBVSxDQUFFQyxJQUFGLEVBQVFDLFFBQVIsQ0FBVjtBQUNBLEdBSkQ7QUFNQUssRUFBQUEsQ0FBQyxDQUFHLHlCQUFILENBQUQsQ0FBZ0NDLEtBQWhDLENBQXVDLFVBQVVDLENBQVYsRUFBYztBQUNwRCxRQUFJUixJQUFJLEdBQUdNLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVU4sSUFBVixHQUFpQlMsSUFBakIsRUFBWDtBQUNBLFFBQUlSLFFBQVEsR0FBRyxRQUFmO0FBQ0FGLElBQUFBLFVBQVUsQ0FBRUMsSUFBRixFQUFRQyxRQUFSLENBQVY7QUFDQSxHQUpEO0FBTUFLLEVBQUFBLENBQUMsQ0FBRSx3QkFBRixDQUFELENBQThCQyxLQUE5QixDQUFxQyxVQUFVQyxDQUFWLEVBQWM7QUFDbERoQixJQUFBQSwyQkFBMkIsQ0FBRSxPQUFGLEVBQVcsbUJBQVgsRUFBZ0MsT0FBaEMsRUFBeUMsS0FBS2tCLElBQTlDLENBQTNCO0FBQ0EsR0FGRDtBQUdBSixFQUFBQSxDQUFDLENBQUUsaUJBQUYsQ0FBRCxDQUF1QkMsS0FBdkIsQ0FBOEIsVUFBVUMsQ0FBVixFQUFjO0FBQzNDaEIsSUFBQUEsMkJBQTJCLENBQUUsT0FBRixFQUFXLHNCQUFYLEVBQW1DLE9BQW5DLEVBQTRDLEtBQUtrQixJQUFqRCxDQUEzQjtBQUNBLEdBRkQ7QUFJQUosRUFBQUEsQ0FBQyxDQUFFLEdBQUYsRUFBT0EsQ0FBQyxDQUFFLGlCQUFGLENBQVIsQ0FBRCxDQUFpQ0MsS0FBakMsQ0FBd0MsVUFBVUMsQ0FBVixFQUFjO0FBQ3JELFFBQUlHLFlBQVksR0FBR0wsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRTSxPQUFSLENBQWdCLFdBQWhCLEVBQTZCQyxJQUE3QixDQUFrQyxJQUFsQyxFQUF3Q2IsSUFBeEMsRUFBbkI7QUFDQSxRQUFJYyxxQkFBcUIsR0FBRyxFQUE1Qjs7QUFDQSxRQUFJSCxZQUFZLEtBQUssRUFBckIsRUFBeUIsQ0FDeEI7QUFDQSxLQUZELE1BRU87QUFDTkcsTUFBQUEscUJBQXFCLEdBQUdILFlBQXhCO0FBQ0E7O0FBQ0RuQixJQUFBQSwyQkFBMkIsQ0FBQyxPQUFELEVBQVUsY0FBVixFQUEwQixPQUExQixFQUFtQ3NCLHFCQUFuQyxDQUEzQjtBQUNBLEdBVEQ7QUFXQVIsRUFBQUEsQ0FBQyxDQUFFUyxRQUFGLENBQUQsQ0FBY0MsS0FBZCxDQUFxQixVQUFXUixDQUFYLEVBQWU7QUFFbkMsUUFBSyxnQkFBZ0IsT0FBT1MsR0FBNUIsRUFBa0M7QUFDakMsVUFBSUMsYUFBYSxHQUFHRCxHQUFHLENBQUNFLFFBQUosQ0FBY2IsQ0FBQyxDQUFFLE1BQUYsQ0FBZixDQUFwQjtBQUNBLFVBQUljLFFBQVEsR0FBR0gsR0FBRyxDQUFDSSxXQUFKLENBQWlCZixDQUFDLENBQUUsTUFBRixDQUFsQixDQUFmO0FBQ0EsVUFBSWdCLFFBQVEsR0FBR0YsUUFBUSxDQUFDRyxFQUF4QjtBQUNBakIsTUFBQUEsQ0FBQyxDQUFFUyxRQUFGLENBQUQsQ0FBY1MsRUFBZCxDQUFpQixjQUFqQixFQUFpQyxZQUFZO0FBQzVDaEMsUUFBQUEsMkJBQTJCLENBQUUsT0FBRixFQUFXLE9BQVgsRUFBb0IsTUFBcEIsRUFBNEI4QixRQUE1QixFQUFzQztBQUFFLDRCQUFrQjtBQUFwQixTQUF0QyxDQUEzQjtBQUNBLE9BRkQ7QUFHQWhCLE1BQUFBLENBQUMsQ0FBRVMsUUFBRixDQUFELENBQWNTLEVBQWQsQ0FBaUIsZUFBakIsRUFBa0MsWUFBWTtBQUM3QyxZQUFJQyxhQUFhLEdBQUduQixDQUFDLENBQUNvQixFQUFGLENBQUtDLE9BQUwsQ0FBYUMsa0JBQWpDOztBQUNBLFlBQUssZ0JBQWdCLE9BQU9ILGFBQTVCLEVBQTRDO0FBQzNDakMsVUFBQUEsMkJBQTJCLENBQUUsT0FBRixFQUFXLE9BQVgsRUFBb0JpQyxhQUFwQixFQUFtQ0gsUUFBbkMsRUFBNkM7QUFBRSw4QkFBa0I7QUFBcEIsV0FBN0MsQ0FBM0I7QUFDQTtBQUNELE9BTEQ7QUFNQWhCLE1BQUFBLENBQUMsQ0FBRSxnQkFBRixDQUFELENBQXNCQyxLQUF0QixDQUE0QixVQUFVQyxDQUFWLEVBQWM7QUFBRTtBQUMzQyxZQUFJaUIsYUFBYSxHQUFHLGNBQXBCO0FBQ0FqQyxRQUFBQSwyQkFBMkIsQ0FBRSxPQUFGLEVBQVcsT0FBWCxFQUFvQmlDLGFBQXBCLEVBQW1DSCxRQUFuQyxFQUE2QztBQUFFLDRCQUFrQjtBQUFwQixTQUE3QyxDQUEzQjtBQUNBLE9BSEQ7QUFJQWhCLE1BQUFBLENBQUMsQ0FBRSxnQkFBRixDQUFELENBQXNCQyxLQUF0QixDQUE0QixVQUFVQyxDQUFWLEVBQWM7QUFBRTtBQUMzQyxZQUFJcUIsR0FBRyxHQUFHdkIsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRd0IsSUFBUixDQUFhLE1BQWIsQ0FBVjtBQUNBdEMsUUFBQUEsMkJBQTJCLENBQUUsT0FBRixFQUFXLE9BQVgsRUFBb0IsWUFBcEIsRUFBa0NxQyxHQUFsQyxDQUEzQjtBQUNBLE9BSEQ7QUFJQXZCLE1BQUFBLENBQUMsQ0FBRSxrRUFBRixDQUFELENBQXdFQyxLQUF4RSxDQUErRSxVQUFVQyxDQUFWLEVBQWM7QUFBRTtBQUM5RmhCLFFBQUFBLDJCQUEyQixDQUFFLE9BQUYsRUFBVyxPQUFYLEVBQW9CLE9BQXBCLEVBQTZCOEIsUUFBN0IsQ0FBM0I7QUFDUyxPQUZWO0FBR0E7O0FBRUQsUUFBSyxnQkFBZ0IsT0FBT1Msd0JBQXZCLElBQW1ELE9BQU9BLHdCQUF3QixDQUFDQyxnQkFBeEYsRUFBMkc7QUFDMUcsVUFBSXZDLElBQUksR0FBRyxPQUFYO0FBQ0EsVUFBSUMsUUFBUSxHQUFHLGdCQUFmO0FBQ0EsVUFBSUUsS0FBSyxHQUFHUSxRQUFRLENBQUNDLFFBQXJCLENBSDBHLENBRzNFOztBQUMvQixVQUFJVixNQUFNLEdBQUcsU0FBYjs7QUFDQSxVQUFLLFNBQVNvQyx3QkFBd0IsQ0FBQ0UsWUFBekIsQ0FBc0NDLFVBQXBELEVBQWlFO0FBQ2hFdkMsUUFBQUEsTUFBTSxHQUFHLE9BQVQ7QUFDQTs7QUFDREgsTUFBQUEsMkJBQTJCLENBQUVDLElBQUYsRUFBUUMsUUFBUixFQUFrQkMsTUFBbEIsRUFBMEJDLEtBQTFCLENBQTNCO0FBQ0E7QUFDRCxHQXRDRDtBQXdDQSxDQXhFRCxFQXdFS00sTUF4RUw7OztBQ2xDQSxDQUFDLFVBQVNJLENBQVQsRUFBVztBQUNYLFdBQVM2QixzQkFBVCxDQUFnQ04sR0FBaEMsRUFBcUM7QUFDcEMsUUFBSU8sUUFBUSxHQUFHLFNBQVhBLFFBQVcsR0FBWTtBQUN6QixVQUFJLE9BQU9QLEdBQVAsSUFBZSxXQUFuQixFQUFnQztBQUM5QlEsUUFBQUEsTUFBTSxDQUFDakMsUUFBUCxHQUFrQnlCLEdBQWxCO0FBQ0Q7QUFDRixLQUpEOztBQUtBUyxJQUFBQSxJQUFJLENBQUMsT0FBRCxFQUFVLFlBQVYsRUFBd0I7QUFDMUIsaUJBQVcsa0NBRGU7QUFFMUIsd0JBQWtCRjtBQUZRLEtBQXhCLENBQUo7QUFJQSxXQUFPLEtBQVA7QUFDQTs7QUFFRCxXQUFTRyxZQUFULEdBQXdCO0FBQ3ZCLFFBQUlDLElBQUksR0FBaUJsQyxDQUFDLENBQUMsd0JBQUQsQ0FBMUI7QUFDQSxRQUFJbUMsU0FBUyxHQUFZQyw0QkFBNEIsQ0FBQ0MsUUFBN0IsR0FBd0NELDRCQUE0QixDQUFDRSxjQUE5RjtBQUNBLFFBQUlDLFFBQVEsR0FBYUosU0FBUyxHQUFHLEdBQVosR0FBa0IsY0FBM0M7QUFDQSxRQUFJSyxjQUFjLEdBQU8sQ0FBekI7QUFDQSxRQUFJQyxhQUFhLEdBQVEsRUFBekI7QUFDQSxRQUFJQyxrQkFBa0IsR0FBRyxFQUF6QjtBQUNBLFFBQUlDLFNBQVMsR0FBWSxFQUF6QjtBQUNBLFFBQUlDLGNBQWMsR0FBTyxFQUF6Qjs7QUFDQSxRQUFLNUMsQ0FBQyxDQUFDLG9CQUFELENBQUQsQ0FBd0I2QyxNQUF4QixHQUFpQyxDQUF0QyxFQUEwQztBQUN6Q0wsTUFBQUEsY0FBYyxHQUFHeEMsQ0FBQyxDQUFFLHlCQUFGLENBQUQsQ0FBK0I2QyxNQUFoRCxDQUR5QyxDQUV6Qzs7QUFDQTdDLE1BQUFBLENBQUMsQ0FBQyx1REFBRCxDQUFELENBQTJEOEMsTUFBM0QsQ0FBbUUsVUFBVUMsS0FBVixFQUFrQjtBQUNwRk4sUUFBQUEsYUFBYSxHQUFHekMsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVZ0QsR0FBVixFQUFoQjtBQUNBaEQsUUFBQUEsQ0FBQyxDQUFFLHlCQUFGLENBQUQsQ0FBK0JpRCxJQUEvQixDQUFxQyxVQUFVQyxLQUFWLEVBQWtCO0FBQ3RELGNBQUtsRCxDQUFDLENBQUUsSUFBRixDQUFELENBQVVtRCxRQUFWLEdBQXFCQyxHQUFyQixDQUF5QixDQUF6QixFQUE0QkMsU0FBNUIsS0FBMENaLGFBQS9DLEVBQStEO0FBQzlEQyxZQUFBQSxrQkFBa0IsQ0FBQ1ksSUFBbkIsQ0FBeUJ0RCxDQUFDLENBQUUsSUFBRixDQUFELENBQVVtRCxRQUFWLEdBQXFCQyxHQUFyQixDQUF5QixDQUF6QixFQUE0QkMsU0FBckQ7QUFDQTtBQUNELFNBSkQsRUFGb0YsQ0FPcEY7O0FBQ0FyRCxRQUFBQSxDQUFDLENBQUUsSUFBRixDQUFELENBQVV1RCxNQUFWLEdBQW1CQyxJQUFuQixDQUF5QixxSkFBekI7QUFDQXhELFFBQUFBLENBQUMsQ0FBRSxvQkFBRixDQUFELENBQTBCQyxLQUExQixDQUFpQyxVQUFVOEMsS0FBVixFQUFrQjtBQUNsRC9DLFVBQUFBLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVXlELE9BQVYsQ0FBbUIsSUFBbkIsRUFBMEJDLE1BQTFCO0FBQ0ExRCxVQUFBQSxDQUFDLENBQUUsdUJBQUYsQ0FBRCxDQUE2QmdELEdBQTdCLENBQWtDTixrQkFBa0IsQ0FBQ2lCLElBQW5CLENBQXlCLEdBQXpCLENBQWxDO0FBQ0FuQixVQUFBQSxjQUFjLEdBQUd4QyxDQUFDLENBQUUseUJBQUYsQ0FBRCxDQUErQjZDLE1BQWhEO0FBQ0FYLFVBQUFBLElBQUksQ0FBQzBCLE1BQUw7QUFDQSxTQUxEO0FBTUEsT0FmRDtBQWdCQSxLQTVCc0IsQ0E2QnZCOzs7QUFDQTVELElBQUFBLENBQUMsQ0FBQyw2QkFBRCxDQUFELENBQWlDQyxLQUFqQyxDQUF3QyxVQUFVOEMsS0FBVixFQUFrQjtBQUN6REEsTUFBQUEsS0FBSyxDQUFDYyxjQUFOO0FBQ0E3RCxNQUFBQSxDQUFDLENBQUMsNkJBQUQsQ0FBRCxDQUFpQzhELE1BQWpDLENBQXdDLG1NQUFtTXRCLGNBQW5NLEdBQW9OLG9CQUFwTixHQUEyT0EsY0FBM08sR0FBNFAsdUNBQXBTO0FBQ0FBLE1BQUFBLGNBQWM7QUFDZCxLQUpEO0FBS0F4QyxJQUFBQSxDQUFDLENBQUVrQyxJQUFGLENBQUQsQ0FBVWhCLEVBQVYsQ0FBYyxRQUFkLEVBQXdCLFVBQVU2QixLQUFWLEVBQWtCO0FBQ3pDQSxNQUFBQSxLQUFLLENBQUNjLGNBQU47QUFDQWpCLE1BQUFBLGNBQWMsR0FBR1YsSUFBSSxDQUFDNkIsU0FBTCxFQUFqQixDQUZ5QyxDQUVOOztBQUNuQ25CLE1BQUFBLGNBQWMsR0FBR0EsY0FBYyxHQUFHLFlBQWxDO0FBQ0E1QyxNQUFBQSxDQUFDLENBQUNnRSxJQUFGLENBQU87QUFDTnpDLFFBQUFBLEdBQUcsRUFBRWdCLFFBREM7QUFFTnBELFFBQUFBLElBQUksRUFBRSxNQUZBO0FBR044RSxRQUFBQSxVQUFVLEVBQUUsb0JBQVdDLEdBQVgsRUFBaUI7QUFDdEJBLFVBQUFBLEdBQUcsQ0FBQ0MsZ0JBQUosQ0FBc0IsWUFBdEIsRUFBb0MvQiw0QkFBNEIsQ0FBQ2dDLEtBQWpFO0FBQ0gsU0FMRTtBQU1OQyxRQUFBQSxRQUFRLEVBQUUsTUFOSjtBQU9OQyxRQUFBQSxJQUFJLEVBQUUxQjtBQVBBLE9BQVAsRUFRRzJCLElBUkgsQ0FRUSxVQUFTRCxJQUFULEVBQWU7QUFDdEIzQixRQUFBQSxTQUFTLEdBQUczQyxDQUFDLENBQUUsNENBQUYsQ0FBRCxDQUFrRHdFLEdBQWxELENBQXVELFlBQVc7QUFDN0UsaUJBQU94RSxDQUFDLENBQUMsSUFBRCxDQUFELENBQVFnRCxHQUFSLEVBQVA7QUFDQSxTQUZXLEVBRVRJLEdBRlMsRUFBWjtBQUdBcEQsUUFBQUEsQ0FBQyxDQUFDaUQsSUFBRixDQUFRTixTQUFSLEVBQW1CLFVBQVVPLEtBQVYsRUFBaUIzRCxLQUFqQixFQUF5QjtBQUMzQ2lELFVBQUFBLGNBQWMsR0FBR0EsY0FBYyxHQUFHVSxLQUFsQztBQUNBbEQsVUFBQUEsQ0FBQyxDQUFFLG9CQUFGLENBQUQsQ0FBMEJ5RSxNQUExQixDQUFrQyxTQUFTbEYsS0FBVCxHQUFpQiw2SkFBakIsR0FBaUxpRCxjQUFqTCxHQUFrTSxXQUFsTSxHQUFnTmpELEtBQWhOLEdBQXdOLDhCQUF4TixHQUF5UGlELGNBQXpQLEdBQTBRLGdJQUExUSxHQUE2WUEsY0FBN1ksR0FBOFosc0JBQTlaLEdBQXViQSxjQUF2YixHQUF3YyxXQUF4YyxHQUFzZGpELEtBQXRkLEdBQThkLDZCQUE5ZCxHQUE4ZmlELGNBQTlmLEdBQStnQixnREFBampCO0FBQ0EsU0FIRDtBQUlBeEMsUUFBQUEsQ0FBQyxDQUFFLDJDQUFGLENBQUQsQ0FBaUQwRCxNQUFqRDtBQUNBLE9BakJEO0FBa0JBLEtBdEJEO0FBdUJBOztBQUVEOUQsRUFBQUEsTUFBTSxDQUFFYSxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVWLENBQVYsRUFBYztBQUN2Qzs7QUFDQSxRQUFLQSxDQUFDLENBQUMsZUFBRCxDQUFELENBQW1CNkMsTUFBbkIsR0FBNEIsQ0FBakMsRUFBcUM7QUFDcENaLE1BQUFBLFlBQVk7QUFDWjs7QUFDRCxRQUFLakMsQ0FBQyxDQUFDLDhCQUFELENBQUQsQ0FBa0M2QyxNQUFsQyxHQUEyQyxDQUFoRCxFQUFvRDtBQUNuRDdDLE1BQUFBLENBQUMsQ0FBQyx1Q0FBRCxDQUFELENBQTJDOEQsTUFBM0MsQ0FBa0Qsb0NBQWxEO0FBQ0E5RCxNQUFBQSxDQUFDLENBQUMsbUNBQUQsQ0FBRCxDQUF1QzRELE1BQXZDLENBQThDLFVBQVNiLEtBQVQsRUFBZ0I7QUFDN0QsWUFBSTJCLElBQUksR0FBRyxJQUFYO0FBQ0EzQixRQUFBQSxLQUFLLENBQUNjLGNBQU4sR0FGNkQsQ0FFckM7O0FBQ3hCLFlBQUljLE1BQU0sR0FBRzNFLENBQUMsQ0FBQyxRQUFELEVBQVcsSUFBWCxDQUFkO0FBQ0EyRSxRQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWSxVQUFaLEVBQXdCLElBQXhCO0FBQ0FELFFBQUFBLE1BQU0sQ0FBQ2pGLElBQVAsQ0FBWSxZQUFaLEVBTDZELENBTTdEOztBQUNBLFlBQUlrRCxjQUFjLEdBQUc1QyxDQUFDLENBQUMsSUFBRCxDQUFELENBQVErRCxTQUFSLEVBQXJCLENBUDZELENBUTdEOztBQUNBbkIsUUFBQUEsY0FBYyxHQUFHQSxjQUFjLEdBQUcsNkJBQWxDO0FBQ0E1QyxRQUFBQSxDQUFDLENBQUNnRSxJQUFGLENBQU87QUFDTnpDLFVBQUFBLEdBQUcsRUFBRXNELE1BQU0sQ0FBQ0MsT0FETjtBQUNlO0FBQ3JCM0YsVUFBQUEsSUFBSSxFQUFFLE1BRkE7QUFHTmtGLFVBQUFBLFFBQVEsRUFBRyxNQUhMO0FBSU5DLFVBQUFBLElBQUksRUFBRTFCO0FBSkEsU0FBUCxFQU1DMkIsSUFORCxDQU1NLFVBQVNRLFFBQVQsRUFBbUI7QUFBRTtBQUMxQixjQUFJQyxPQUFPLEdBQUcsRUFBZDs7QUFDQSxjQUFLRCxRQUFRLENBQUNFLE9BQVQsS0FBcUIsSUFBMUIsRUFBaUM7QUFDaENqRixZQUFBQSxDQUFDLENBQUMsVUFBRCxFQUFhMEUsSUFBYixDQUFELENBQW9CUSxJQUFwQjtBQUNBUCxZQUFBQSxNQUFNLENBQUNqRixJQUFQLENBQVksUUFBWjtBQUNBLGdCQUFJeUYsZ0JBQWdCLEdBQUcsUUFBdkI7O0FBQ0Esb0JBQVFKLFFBQVEsQ0FBQ1QsSUFBVCxDQUFjYyxXQUF0QjtBQUNDLG1CQUFLLFVBQUw7QUFDQ0QsZ0JBQUFBLGdCQUFnQixHQUFHLFFBQW5CO0FBQ0FILGdCQUFBQSxPQUFPLEdBQUcsbUZBQVY7QUFDQTs7QUFDRCxtQkFBSyxLQUFMO0FBQ0NHLGdCQUFBQSxnQkFBZ0IsR0FBRyxRQUFuQjtBQUNBSCxnQkFBQUEsT0FBTyxHQUFHLGlEQUFWO0FBQ0E7O0FBQ0QsbUJBQUssU0FBTDtBQUNDRyxnQkFBQUEsZ0JBQWdCLEdBQUcsUUFBbkI7QUFDQUgsZ0JBQUFBLE9BQU8sR0FBRyxnSkFBVjtBQUNBO0FBWkY7O0FBY0EsZ0JBQUtELFFBQVEsQ0FBQ1QsSUFBVCxDQUFjZSxlQUFkLEtBQWtDLEVBQXZDLEVBQTRDO0FBQzNDTCxjQUFBQSxPQUFPLEdBQUdELFFBQVEsQ0FBQ1QsSUFBVCxDQUFjZSxlQUF4QjtBQUNBOztBQUNELGdCQUFLLGVBQWUsT0FBT25HLDJCQUEzQixFQUF5RDtBQUN4REEsY0FBQUEsMkJBQTJCLENBQUUsT0FBRixFQUFXLFlBQVgsRUFBeUJpRyxnQkFBekIsRUFBMkNyRixRQUFRLENBQUNDLFFBQXBELENBQTNCO0FBQ0E4QixjQUFBQSxzQkFBc0IsQ0FBRS9CLFFBQVEsQ0FBQ0MsUUFBWCxDQUF0QjtBQUNBO0FBQ0QsV0F6QkQsTUF5Qk87QUFDTjRFLFlBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFVBQVosRUFBd0IsS0FBeEI7QUFDQUQsWUFBQUEsTUFBTSxDQUFDakYsSUFBUCxDQUFZLFdBQVo7O0FBQ0EsZ0JBQUssZUFBZSxPQUFPUiwyQkFBM0IsRUFBeUQ7QUFDeERBLGNBQUFBLDJCQUEyQixDQUFFLE9BQUYsRUFBVyxZQUFYLEVBQXlCLE1BQXpCLEVBQWlDWSxRQUFRLENBQUNDLFFBQTFDLENBQTNCO0FBQ0E7QUFDRDs7QUFDREMsVUFBQUEsQ0FBQyxDQUFDLGlCQUFELENBQUQsQ0FBcUJ3RCxJQUFyQixDQUEwQixxREFBcUR3QixPQUFyRCxHQUErRCxRQUF6RjtBQUNBLFNBekNELEVBMENDTSxJQTFDRCxDQTBDTSxVQUFTUCxRQUFULEVBQW1CO0FBQ3hCL0UsVUFBQUEsQ0FBQyxDQUFDLGlCQUFELENBQUQsQ0FBcUJ3RCxJQUFyQixDQUEwQiwrRkFBMUI7QUFDQW1CLFVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFVBQVosRUFBd0IsS0FBeEI7QUFDQUQsVUFBQUEsTUFBTSxDQUFDakYsSUFBUCxDQUFZLFdBQVo7O0FBQ0EsY0FBSyxlQUFlLE9BQU9SLDJCQUEzQixFQUF5RDtBQUN4REEsWUFBQUEsMkJBQTJCLENBQUUsT0FBRixFQUFXLFlBQVgsRUFBeUIsTUFBekIsRUFBaUNZLFFBQVEsQ0FBQ0MsUUFBMUMsQ0FBM0I7QUFDQTtBQUNELFNBakRELEVBa0RDd0YsTUFsREQsQ0FrRFEsWUFBVztBQUNsQnhDLFVBQUFBLEtBQUssQ0FBQ3lDLE1BQU4sQ0FBYUMsS0FBYjtBQUNBLFNBcEREO0FBcURBLE9BL0REO0FBZ0VBO0FBQ0QsR0F4RUQ7QUF5RUEsQ0FuSkQsRUFtSkc3RixNQW5KSDs7O0FDQUE7Ozs7OztBQU1BQSxNQUFNLENBQUVhLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVVYsQ0FBVixFQUFjO0FBQ3ZDLE1BQUkwRixTQUFKLEVBQWVmLE1BQWYsRUFBdUJnQixJQUF2QixFQUE2QkMsS0FBN0IsRUFBb0NDLENBQXBDLEVBQXVDQyxHQUF2QztBQUVBSixFQUFBQSxTQUFTLEdBQUdqRixRQUFRLENBQUNzRixjQUFULENBQXlCLG9CQUF6QixDQUFaOztBQUNBLE1BQUssQ0FBRUwsU0FBUCxFQUFtQjtBQUNsQjtBQUNBOztBQUVEZixFQUFBQSxNQUFNLEdBQUdlLFNBQVMsQ0FBQ00sb0JBQVYsQ0FBZ0MsUUFBaEMsRUFBMkMsQ0FBM0MsQ0FBVDs7QUFDQSxNQUFLLGdCQUFnQixPQUFPckIsTUFBNUIsRUFBcUM7QUFDcEM7QUFDQTs7QUFFRGdCLEVBQUFBLElBQUksR0FBR0QsU0FBUyxDQUFDTSxvQkFBVixDQUFnQyxJQUFoQyxFQUF1QyxDQUF2QyxDQUFQLENBYnVDLENBZXZDOztBQUNBLE1BQUssZ0JBQWdCLE9BQU9MLElBQTVCLEVBQW1DO0FBQ2xDaEIsSUFBQUEsTUFBTSxDQUFDc0IsS0FBUCxDQUFhQyxPQUFiLEdBQXVCLE1BQXZCO0FBQ0E7QUFDQTs7QUFFRFAsRUFBQUEsSUFBSSxDQUFDUSxZQUFMLENBQW1CLGVBQW5CLEVBQW9DLE9BQXBDOztBQUNBLE1BQUssQ0FBQyxDQUFELEtBQU9SLElBQUksQ0FBQ1MsU0FBTCxDQUFlQyxPQUFmLENBQXdCLE1BQXhCLENBQVosRUFBK0M7QUFDOUNWLElBQUFBLElBQUksQ0FBQ1MsU0FBTCxJQUFrQixPQUFsQjtBQUNBOztBQUVEekIsRUFBQUEsTUFBTSxDQUFDMkIsT0FBUCxHQUFpQixZQUFXO0FBQzNCLFFBQUssQ0FBQyxDQUFELEtBQU9aLFNBQVMsQ0FBQ1UsU0FBVixDQUFvQkMsT0FBcEIsQ0FBNkIsU0FBN0IsQ0FBWixFQUF1RDtBQUN0RFgsTUFBQUEsU0FBUyxDQUFDVSxTQUFWLEdBQXNCVixTQUFTLENBQUNVLFNBQVYsQ0FBb0JHLE9BQXBCLENBQTZCLFVBQTdCLEVBQXlDLEVBQXpDLENBQXRCO0FBQ0E1QixNQUFBQSxNQUFNLENBQUN3QixZQUFQLENBQXFCLGVBQXJCLEVBQXNDLE9BQXRDO0FBQ0FSLE1BQUFBLElBQUksQ0FBQ1EsWUFBTCxDQUFtQixlQUFuQixFQUFvQyxPQUFwQztBQUNBLEtBSkQsTUFJTztBQUNOVCxNQUFBQSxTQUFTLENBQUNVLFNBQVYsSUFBdUIsVUFBdkI7QUFDQXpCLE1BQUFBLE1BQU0sQ0FBQ3dCLFlBQVAsQ0FBcUIsZUFBckIsRUFBc0MsTUFBdEM7QUFDQVIsTUFBQUEsSUFBSSxDQUFDUSxZQUFMLENBQW1CLGVBQW5CLEVBQW9DLE1BQXBDO0FBQ0E7QUFDRCxHQVZELENBMUJ1QyxDQXNDdkM7OztBQUNBUCxFQUFBQSxLQUFLLEdBQU1ELElBQUksQ0FBQ0ssb0JBQUwsQ0FBMkIsR0FBM0IsQ0FBWCxDQXZDdUMsQ0F5Q3ZDOztBQUNBLE9BQU1ILENBQUMsR0FBRyxDQUFKLEVBQU9DLEdBQUcsR0FBR0YsS0FBSyxDQUFDL0MsTUFBekIsRUFBaUNnRCxDQUFDLEdBQUdDLEdBQXJDLEVBQTBDRCxDQUFDLEVBQTNDLEVBQWdEO0FBQy9DRCxJQUFBQSxLQUFLLENBQUNDLENBQUQsQ0FBTCxDQUFTVyxnQkFBVCxDQUEyQixPQUEzQixFQUFvQ0MsV0FBcEMsRUFBaUQsSUFBakQ7QUFDQWIsSUFBQUEsS0FBSyxDQUFDQyxDQUFELENBQUwsQ0FBU1csZ0JBQVQsQ0FBMkIsTUFBM0IsRUFBbUNDLFdBQW5DLEVBQWdELElBQWhEO0FBQ0E7QUFFRDs7Ozs7QUFHQSxXQUFTQSxXQUFULEdBQXVCO0FBQ3RCLFFBQUlDLElBQUksR0FBRyxJQUFYLENBRHNCLENBR3RCOztBQUNBLFdBQVEsQ0FBQyxDQUFELEtBQU9BLElBQUksQ0FBQ04sU0FBTCxDQUFlQyxPQUFmLENBQXdCLE1BQXhCLENBQWYsRUFBa0Q7QUFFakQ7QUFDQSxVQUFLLFNBQVNLLElBQUksQ0FBQ0MsT0FBTCxDQUFhQyxXQUFiLEVBQWQsRUFBMkM7QUFDMUMsWUFBSyxDQUFDLENBQUQsS0FBT0YsSUFBSSxDQUFDTixTQUFMLENBQWVDLE9BQWYsQ0FBd0IsT0FBeEIsQ0FBWixFQUFnRDtBQUMvQ0ssVUFBQUEsSUFBSSxDQUFDTixTQUFMLEdBQWlCTSxJQUFJLENBQUNOLFNBQUwsQ0FBZUcsT0FBZixDQUF3QixRQUF4QixFQUFrQyxFQUFsQyxDQUFqQjtBQUNBLFNBRkQsTUFFTztBQUNORyxVQUFBQSxJQUFJLENBQUNOLFNBQUwsSUFBa0IsUUFBbEI7QUFDQTtBQUNEOztBQUVETSxNQUFBQSxJQUFJLEdBQUdBLElBQUksQ0FBQ0csYUFBWjtBQUNBO0FBQ0Q7QUFFRDs7Ozs7QUFHRSxhQUFVbkIsU0FBVixFQUFzQjtBQUN2QixRQUFJb0IsWUFBSjtBQUFBLFFBQWtCakIsQ0FBbEI7QUFBQSxRQUNDa0IsVUFBVSxHQUFHckIsU0FBUyxDQUFDc0IsZ0JBQVYsQ0FBNEIsMERBQTVCLENBRGQ7O0FBR0EsUUFBSyxrQkFBa0JqRixNQUF2QixFQUFnQztBQUMvQitFLE1BQUFBLFlBQVksR0FBRyxzQkFBVTVHLENBQVYsRUFBYztBQUM1QixZQUFJK0csUUFBUSxHQUFHLEtBQUtDLFVBQXBCO0FBQUEsWUFBZ0NyQixDQUFoQzs7QUFFQSxZQUFLLENBQUVvQixRQUFRLENBQUNFLFNBQVQsQ0FBbUJDLFFBQW5CLENBQTZCLE9BQTdCLENBQVAsRUFBZ0Q7QUFDL0NsSCxVQUFBQSxDQUFDLENBQUMyRCxjQUFGOztBQUNBLGVBQU1nQyxDQUFDLEdBQUcsQ0FBVixFQUFhQSxDQUFDLEdBQUdvQixRQUFRLENBQUNDLFVBQVQsQ0FBb0JHLFFBQXBCLENBQTZCeEUsTUFBOUMsRUFBc0QsRUFBRWdELENBQXhELEVBQTREO0FBQzNELGdCQUFLb0IsUUFBUSxLQUFLQSxRQUFRLENBQUNDLFVBQVQsQ0FBb0JHLFFBQXBCLENBQTZCeEIsQ0FBN0IsQ0FBbEIsRUFBb0Q7QUFDbkQ7QUFDQTs7QUFDRG9CLFlBQUFBLFFBQVEsQ0FBQ0MsVUFBVCxDQUFvQkcsUUFBcEIsQ0FBNkJ4QixDQUE3QixFQUFnQ3NCLFNBQWhDLENBQTBDekQsTUFBMUMsQ0FBa0QsT0FBbEQ7QUFDQTs7QUFDRHVELFVBQUFBLFFBQVEsQ0FBQ0UsU0FBVCxDQUFtQkcsR0FBbkIsQ0FBd0IsT0FBeEI7QUFDQSxTQVRELE1BU087QUFDTkwsVUFBQUEsUUFBUSxDQUFDRSxTQUFULENBQW1CekQsTUFBbkIsQ0FBMkIsT0FBM0I7QUFDQTtBQUNELE9BZkQ7O0FBaUJBLFdBQU1tQyxDQUFDLEdBQUcsQ0FBVixFQUFhQSxDQUFDLEdBQUdrQixVQUFVLENBQUNsRSxNQUE1QixFQUFvQyxFQUFFZ0QsQ0FBdEMsRUFBMEM7QUFDekNrQixRQUFBQSxVQUFVLENBQUNsQixDQUFELENBQVYsQ0FBY1csZ0JBQWQsQ0FBZ0MsWUFBaEMsRUFBOENNLFlBQTlDLEVBQTRELEtBQTVEO0FBQ0E7QUFDRDtBQUNELEdBMUJDLEVBMEJDcEIsU0ExQkQsQ0FBRjtBQTJCQSxDQW5HRCxFLENBcUdBOztBQUNBOUYsTUFBTSxDQUFFYSxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVWLENBQVYsRUFBYztBQUN2QztBQUNBLE1BQUlBLENBQUMsQ0FBQyx5QkFBRCxDQUFELENBQTZCNkMsTUFBN0IsR0FBc0MsQ0FBMUMsRUFBOEM7QUFDN0M3QyxJQUFBQSxDQUFDLENBQUMsK0JBQUQsQ0FBRCxDQUFtQ2tCLEVBQW5DLENBQXVDLE9BQXZDLEVBQWdELFVBQVM2QixLQUFULEVBQWdCO0FBQy9EL0MsTUFBQUEsQ0FBQyxDQUFDLHlCQUFELENBQUQsQ0FBNkJ1SCxXQUE3QixDQUEwQyxTQUExQztBQUNBeEUsTUFBQUEsS0FBSyxDQUFDYyxjQUFOO0FBQ0EsS0FIRDtBQUlBO0FBRUQsQ0FURCIsImZpbGUiOiJtaW5ucG9zdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICkge1xuXHRpZiAoIHR5cGVvZiBnYSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0aWYgKCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG5mdW5jdGlvbiB0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApIHtcblxuXHQvLyBpZiBhIG5vdCBsb2dnZWQgaW4gdXNlciB0cmllcyB0byBlbWFpbCwgZG9uJ3QgY291bnQgdGhhdCBhcyBhIHNoYXJlXG5cdGlmICggISBqUXVlcnkoICdib2R5ICcpLmhhc0NsYXNzKCAnbG9nZ2VkLWluJykgJiYgJ0VtYWlsJyA9PT0gdGV4dCApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyB0cmFjayBhcyBhbiBldmVudCwgYW5kIGFzIHNvY2lhbCBpZiBpdCBpcyB0d2l0dGVyIG9yIGZiXG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1NoYXJlIC0gJyArIHBvc2l0aW9uLCB0ZXh0LCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0IHx8ICdUd2l0dGVyJyA9PT0gdGV4dCApIHtcblx0XHRcdGlmICggdGV4dCA9PSAnRmFjZWJvb2snICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuKCBmdW5jdGlvbiggJCApIHtcblxuXHQkICggJy5tLWVudHJ5LXNoYXJlLXRvcCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgdGV4dCA9ICQoIHRoaXMgKS50ZXh0KCkudHJpbSgpO1xuXHRcdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHRcdHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG5cdH0pO1xuXG5cdCQgKCAnLm0tZW50cnktc2hhcmUtYm90dG9tIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdHZhciB0ZXh0ID0gJCggdGhpcyApLnRleHQoKS50cmltKCk7XG5cdFx0dmFyIHBvc2l0aW9uID0gJ2JvdHRvbSc7XG5cdFx0dHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcblx0fSk7XG5cblx0JCggJyNuYXZpZ2F0aW9uLWZlYXR1cmVkIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ0ZlYXR1cmVkIEJhciBMaW5rJywgJ0NsaWNrJywgdGhpcy5ocmVmICk7XG5cdH0pO1xuXHQkKCAnYS5nbGVhbi1zaWRlYmFyJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdTaWRlYmFyIFN1cHBvcnQgTGluaycsICdDbGljaycsIHRoaXMuaHJlZiApO1xuXHR9KTtcblxuXHQkKCAnYScsICQoICcuby1zaXRlLXNpZGViYXInICkgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyIHdpZGdldF90aXRsZSA9ICQodGhpcykuY2xvc2VzdCgnLm0td2lkZ2V0JykuZmluZCgnaDMnKS50ZXh0KCk7XG5cdFx0dmFyIHNpZGViYXJfc2VjdGlvbl90aXRsZSA9ICcnO1xuXHRcdGlmICh3aWRnZXRfdGl0bGUgPT09ICcnKSB7XG5cdFx0XHQvL3NpZGViYXJfc2VjdGlvbl90aXRsZSA9ICQodGhpcykuY2xvc2VzdCgnLm5vZGUtdHlwZS1zcGlsbCcpLmZpbmQoJy5ub2RlLXRpdGxlIGEnKS50ZXh0KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNpZGViYXJfc2VjdGlvbl90aXRsZSA9IHdpZGdldF90aXRsZTtcblx0XHR9XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCdldmVudCcsICdTaWRlYmFyIExpbmsnLCAnQ2xpY2snLCBzaWRlYmFyX3NlY3Rpb25fdGl0bGUpO1xuXHR9KTtcblxuXHQkKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiAoIGUgKSB7XG5cblx0XHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgUFVNICkge1xuXHRcdFx0dmFyIGN1cnJlbnRfcG9wdXAgPSBQVU0uZ2V0UG9wdXAoICQoICcucHVtJyApICk7XG5cdFx0XHR2YXIgc2V0dGluZ3MgPSBQVU0uZ2V0U2V0dGluZ3MoICQoICcucHVtJyApICk7XG5cdFx0XHR2YXIgcG9wdXBfaWQgPSBzZXR0aW5ncy5pZDtcblx0XHRcdCQoIGRvY3VtZW50ICkub24oJ3B1bUFmdGVyT3BlbicsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnU2hvdycsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSApO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCBkb2N1bWVudCApLm9uKCdwdW1BZnRlckNsb3NlJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgY2xvc2VfdHJpZ2dlciA9ICQuZm4ucG9wbWFrZS5sYXN0X2Nsb3NlX3RyaWdnZXI7XG5cdFx0XHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBjbG9zZV90cmlnZ2VyICkge1xuXHRcdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgY2xvc2VfdHJpZ2dlciwgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0JCggJy5tZXNzYWdlLWNsb3NlJyApLmNsaWNrKGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBsaW5rIHdpdGggY2xvc2UgY2xhc3Ncblx0XHRcdFx0dmFyIGNsb3NlX3RyaWdnZXIgPSAnQ2xvc2UgQnV0dG9uJztcblx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCBjbG9zZV90cmlnZ2VyLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0gKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5tZXNzYWdlLWxvZ2luJyApLmNsaWNrKGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBsaW5rIHdpdGggbG9naW4gY2xhc3Ncblx0XHRcdFx0dmFyIHVybCA9ICQodGhpcykuYXR0cignaHJlZicpO1xuXHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdMb2dpbiBMaW5rJywgdXJsICk7XG5cdFx0XHR9KTtcblx0XHRcdCQoICcucHVtLWNvbnRlbnQgYTpub3QoIC5tZXNzYWdlLWNsb3NlLCAucHVtLWNsb3NlLCAubWVzc2FnZS1sb2dpbiApJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3Mgc29tZXRoaW5nIHRoYXQgaXMgbm90IGNsb3NlIHRleHQgb3IgY2xvc2UgaWNvblxuXHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdDbGljaycsIHBvcHVwX2lkICk7XG4gICAgICAgICAgICB9KTtcblx0XHR9XG5cblx0XHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHRcdHZhciB0eXBlID0gJ2V2ZW50Jztcblx0XHRcdHZhciBjYXRlZ29yeSA9ICdNZW1iZXIgQ29udGVudCc7XG5cdFx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdFx0dmFyIGFjdGlvbiA9ICdCbG9ja2VkJztcblx0XHRcdGlmICggdHJ1ZSA9PT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLmN1cnJlbnRfdXNlci5jYW5fYWNjZXNzICkge1xuXHRcdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdFx0fVxuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH1cblx0fSk7XG5cbn0gKSggalF1ZXJ5ICk7IiwiKGZ1bmN0aW9uKCQpe1xuXHRmdW5jdGlvbiBndGFnX3JlcG9ydF9jb252ZXJzaW9uKHVybCkge1xuXHRcdHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcblx0XHQgIGlmICh0eXBlb2YodXJsKSAhPSAndW5kZWZpbmVkJykge1xuXHRcdCAgICB3aW5kb3cubG9jYXRpb24gPSB1cmw7XG5cdFx0ICB9XG5cdFx0fTtcblx0XHRndGFnKCdldmVudCcsICdjb252ZXJzaW9uJywge1xuXHRcdCAgJ3NlbmRfdG8nOiAnQVctOTc2NjIwMTc1L2pxQ3lDTDdhdFhrUWo1WFkwUU0nLFxuXHRcdCAgJ2V2ZW50X2NhbGxiYWNrJzogY2FsbGJhY2tcblx0XHR9KTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRmdW5jdGlvbiBtYW5hZ2VFbWFpbHMoKSB7XG5cdFx0dmFyIGZvcm0gICAgICAgICAgICAgICA9ICQoJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nKTtcblx0XHR2YXIgcmVzdF9yb290ICAgICAgICAgID0gdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5zaXRlX3VybCArIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QucmVzdF9uYW1lc3BhY2U7XG5cdFx0dmFyIGZ1bGxfdXJsICAgICAgICAgICA9IHJlc3Rfcm9vdCArICcvJyArICd1cGRhdGUtdXNlci8nO1xuXHRcdHZhciBuZXh0RW1haWxDb3VudCAgICAgPSAxO1xuXHRcdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0XHR2YXIgY29uc29saWRhdGVkRW1haWxzID0gW107XG5cdFx0dmFyIG5ld0VtYWlscyAgICAgICAgICA9IFtdO1xuXHRcdHZhciBhamF4X2Zvcm1fZGF0YSAgICAgPSAnJztcblx0XHRpZiAoICQoJy5tLXVzZXItZW1haWwtbGlzdCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cdFx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdFx0JCgnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLmNoYW5nZSggZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRlbWFpbFRvUmVtb3ZlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkuZWFjaCggZnVuY3Rpb24oIGluZGV4ICkge1xuXHRcdFx0XHRcdGlmICggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KDApLm5vZGVWYWx1ZSAhPT0gZW1haWxUb1JlbW92ZSApIHtcblx0XHRcdFx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscy5wdXNoKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoMCkubm9kZVZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Ly8gY2hlY2sgZm9yIGNvbmZpcm1hdGlvbiBmcm9tIHVzZXIsIHRoZW4gZG8gdGhpczpcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudCgpLmh0bWwoICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVtb3ZlIHRoaXMgZW1haWw/IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG5hbWU9XCJhLWNvbmZpcm0tcmVtb3ZhbFwiIGlkPVwiYS1jb25maXJtLXJlbW92YWxcIiBjbGFzcz1cImEtYnV0dG9uXCI+Q29uZmlybTwvYnV0dG9uPicgKTtcblx0XHRcdFx0JCggJyNhLWNvbmZpcm0tcmVtb3ZhbCcgKS5jbGljayggZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGknICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHRcdCQoJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcpLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0JCgnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJykuYmVmb3JlKCc8ZGl2IGNsYXNzPVwiYS1pbnB1dC13aXRoLWJ1dHRvbiBhLWJ1dHRvbi1zZW50ZW5jZVwiPjxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIGlkPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIHZhbHVlPVwiXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBpZD1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBjbGFzcz1cImEtYnV0dG9uXCI+QWRkPC9idXR0b24+PC9kaXY+JyApO1xuXHRcdFx0bmV4dEVtYWlsQ291bnQrKztcblx0XHR9KTtcblx0XHQkKCBmb3JtICkub24oICdzdWJtaXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4X2Zvcm1fZGF0YSA9IGFqYXhfZm9ybV9kYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dXJsOiBmdWxsX3VybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcblx0XHRcdCAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0ICAgIH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhfZm9ybV9kYXRhXG5cdFx0XHR9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQodGhpcykudmFsKCk7XG5cdFx0XHRcdH0pLmdldCgpO1xuXHRcdFx0XHQkLmVhY2goIG5ld0VtYWlscywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9IG5leHRFbWFpbENvdW50ICsgaW5kZXg7XG5cdFx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5hcHBlbmQoICc8bGk+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1tYWtlLXByaW1hcnktZW1haWxcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW1hcnlfZW1haWxcIiBpZD1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+TWFrZSBQcmltYXJ5PC9zbWFsbD48L2xhYmVsPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcubS1mb3JtLWNoYW5nZS1lbWFpbCAuYS1pbnB1dC13aXRoLWJ1dHRvbicgKS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0alF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0XHRcInVzZSBzdHJpY3RcIjtcblx0XHRpZiAoICQoJy5tLWZvcm0tZW1haWwnKS5sZW5ndGggPiAwICkge1xuXHRcdFx0bWFuYWdlRW1haWxzKCk7XG5cdFx0fVxuXHRcdGlmICggJCgnLm0tZm9ybS1uZXdzbGV0dGVyLXNob3J0Y29kZScpLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHQkKCcubS1mb3JtLW5ld3NsZXR0ZXItc2hvcnRjb2RlIGZpZWxkc2V0JykuYmVmb3JlKCc8ZGl2IGNsYXNzPVwibS1ob2xkLW1lc3NhZ2VcIj48L2Rpdj4nKTtcblx0XHRcdCQoJy5tLWZvcm0tbmV3c2xldHRlci1zaG9ydGNvZGUgZm9ybScpLnN1Ym1pdChmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgZm9ybSBzdWJtaXQuXG5cdFx0XHRcdHZhciBidXR0b24gPSAkKCdidXR0b24nLCB0aGlzKTtcblx0XHRcdFx0YnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0XHRcdGJ1dHRvbi50ZXh0KCdQcm9jZXNzaW5nJyk7XG5cdFx0XHRcdC8vIHNlcmlhbGl6ZSB0aGUgZm9ybSBkYXRhXG5cdFx0XHRcdHZhciBhamF4X2Zvcm1fZGF0YSA9ICQodGhpcykuc2VyaWFsaXplKCk7XG5cdFx0XHRcdC8vYWRkIG91ciBvd24gYWpheCBjaGVjayBhcyBYLVJlcXVlc3RlZC1XaXRoIGlzIG5vdCBhbHdheXMgcmVsaWFibGVcblx0XHRcdFx0YWpheF9mb3JtX2RhdGEgPSBhamF4X2Zvcm1fZGF0YSArICcmYWpheHJlcXVlc3Q9dHJ1ZSZzdWJzY3JpYmUnO1xuXHRcdFx0XHQkLmFqYXgoe1xuXHRcdFx0XHRcdHVybDogcGFyYW1zLmFqYXh1cmwsIC8vIGRvbWFpbi93cC1hZG1pbi9hZG1pbi1hamF4LnBocFxuXHRcdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0XHRkYXRhVHlwZSA6ICdqc29uJyxcblx0XHRcdFx0XHRkYXRhOiBhamF4X2Zvcm1fZGF0YVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuZG9uZShmdW5jdGlvbihyZXNwb25zZSkgeyAvLyByZXNwb25zZSBmcm9tIHRoZSBQSFAgYWN0aW9uXG5cdFx0XHRcdFx0dmFyIG1lc3NhZ2UgPSAnJztcblx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLnN1Y2Nlc3MgPT09IHRydWUgKSB7XG5cdFx0XHRcdFx0XHQkKCdmaWVsZHNldCcsIHRoYXQpLmhpZGUoKTtcblx0XHRcdFx0XHRcdGJ1dHRvbi50ZXh0KCdUaGFua3MnKTtcblx0XHRcdFx0XHRcdHZhciBhbmFseXRpY3NfYWN0aW9uID0gJ1NpZ251cCc7XG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHJlc3BvbnNlLmRhdGEudXNlcl9zdGF0dXMpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnZXhpc3RpbmcnOlxuXHRcdFx0XHRcdFx0XHRcdGFuYWx5dGljc19hY3Rpb24gPSAnVXBkYXRlJztcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlID0gJ1RoYW5rcyBmb3IgdXBkYXRpbmcgeW91ciBlbWFpbCBwcmVmZXJlbmNlcy4gVGhleSB3aWxsIGdvIGludG8gZWZmZWN0IGltbWVkaWF0ZWx5Lic7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ25ldyc6XG5cdFx0XHRcdFx0XHRcdFx0YW5hbHl0aWNzX2FjdGlvbiA9ICdTaWdudXAnO1xuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2UgPSAnV2UgaGF2ZSBhZGRlZCB5b3UgdG8gdGhlIE1pbm5Qb3N0IG1haWxpbmcgbGlzdC4nO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlICdwZW5kaW5nJzpcblx0XHRcdFx0XHRcdFx0XHRhbmFseXRpY3NfYWN0aW9uID0gJ1NpZ251cCc7XG5cdFx0XHRcdFx0XHRcdFx0bWVzc2FnZSA9ICdXZSBoYXZlIGFkZGVkIHlvdSB0byB0aGUgTWlublBvc3QgbWFpbGluZyBsaXN0LiBZb3Ugd2lsbCBuZWVkIHRvIGNsaWNrIHRoZSBjb25maXJtYXRpb24gbGluayBpbiB0aGUgZW1haWwgd2Ugc2VudCB0byBiZWdpbiByZWNlaXZpbmcgbWVzc2FnZXMuJztcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggcmVzcG9uc2UuZGF0YS5jb25maXJtX21lc3NhZ2UgIT09ICcnICkge1xuXHRcdFx0XHRcdFx0XHRtZXNzYWdlID0gcmVzcG9uc2UuZGF0YS5jb25maXJtX21lc3NhZ2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoICdmdW5jdGlvbicgPT09IHR5cGVvZiBtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQgKSB7XG5cdFx0XHRcdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ05ld3NsZXR0ZXInLCBhbmFseXRpY3NfYWN0aW9uLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0XHRcdFx0XHRndGFnX3JlcG9ydF9jb252ZXJzaW9uKCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRidXR0b24ucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHRidXR0b24udGV4dCgnU3Vic2NyaWJlJyk7XG5cdFx0XHRcdFx0XHRpZiAoICdmdW5jdGlvbicgPT09IHR5cGVvZiBtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQgKSB7XG5cdFx0XHRcdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ05ld3NsZXR0ZXInLCAnRmFpbCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQoJy5tLWhvbGQtbWVzc2FnZScpLmh0bWwoJzxkaXYgY2xhc3M9XCJtLWZvcm0tbWVzc2FnZSBtLWZvcm0tbWVzc2FnZS1pbmZvXCI+JyArIG1lc3NhZ2UgKyAnPC9kaXY+Jyk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5mYWlsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0JCgnLm0taG9sZC1tZXNzYWdlJykuaHRtbCgnPGRpdiBjbGFzcz1cIm0tZm9ybS1tZXNzYWdlIG0tZm9ybS1tZXNzYWdlLWluZm9cIj5BbiBlcnJvciBoYXMgb2NjdXJlZC4gUGxlYXNlIHRyeSBhZ2Fpbi48L2Rpdj4nKTtcblx0XHRcdFx0XHRidXR0b24ucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cdFx0XHRcdFx0YnV0dG9uLnRleHQoJ1N1YnNjcmliZScpO1xuXHRcdFx0XHRcdGlmICggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCApIHtcblx0XHRcdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ05ld3NsZXR0ZXInLCAnRmFpbCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuYWx3YXlzKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGV2ZW50LnRhcmdldC5yZXNldCgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59KShqUXVlcnkpO1xuIiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogSGFuZGxlcyB0b2dnbGluZyB0aGUgbmF2aWdhdGlvbiBtZW51IGZvciBzbWFsbCBzY3JlZW5zIGFuZCBlbmFibGVzIFRBQiBrZXlcbiAqIG5hdmlnYXRpb24gc3VwcG9ydCBmb3IgZHJvcGRvd24gbWVudXMuXG4gKi9cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cdHZhciBjb250YWluZXIsIGJ1dHRvbiwgbWVudSwgbGlua3MsIGksIGxlbjtcblxuXHRjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ25hdmlnYXRpb24tcHJpbWFyeScgKTtcblx0aWYgKCAhIGNvbnRhaW5lciApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRidXR0b24gPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdidXR0b24nIClbMF07XG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBidXR0b24gKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bWVudSA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ3VsJyApWzBdO1xuXG5cdC8vIEhpZGUgbWVudSB0b2dnbGUgYnV0dG9uIGlmIG1lbnUgaXMgZW1wdHkgYW5kIHJldHVybiBlYXJseS5cblx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG1lbnUgKSB7XG5cdFx0YnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRpZiAoIC0xID09PSBtZW51LmNsYXNzTmFtZS5pbmRleE9mKCAnbWVudScgKSApIHtcblx0XHRtZW51LmNsYXNzTmFtZSArPSAnIG1lbnUnO1xuXHR9XG5cblx0YnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIC0xICE9PSBjb250YWluZXIuY2xhc3NOYW1lLmluZGV4T2YoICd0b2dnbGVkJyApICkge1xuXHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IGNvbnRhaW5lci5jbGFzc05hbWUucmVwbGFjZSggJyB0b2dnbGVkJywgJycgKTtcblx0XHRcdGJ1dHRvbi5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRcdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb250YWluZXIuY2xhc3NOYW1lICs9ICcgdG9nZ2xlZCc7XG5cdFx0XHRidXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyApO1xuXHRcdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEdldCBhbGwgdGhlIGxpbmsgZWxlbWVudHMgd2l0aGluIHRoZSBtZW51LlxuXHRsaW5rcyAgICA9IG1lbnUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdhJyApO1xuXG5cdC8vIEVhY2ggdGltZSBhIG1lbnUgbGluayBpcyBmb2N1c2VkIG9yIGJsdXJyZWQsIHRvZ2dsZSBmb2N1cy5cblx0Zm9yICggaSA9IDAsIGxlbiA9IGxpbmtzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdGxpbmtzW2ldLmFkZEV2ZW50TGlzdGVuZXIoICdmb2N1cycsIHRvZ2dsZUZvY3VzLCB0cnVlICk7XG5cdFx0bGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ2JsdXInLCB0b2dnbGVGb2N1cywgdHJ1ZSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgb3IgcmVtb3ZlcyAuZm9jdXMgY2xhc3Mgb24gYW4gZWxlbWVudC5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZUZvY3VzKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdC8vIE1vdmUgdXAgdGhyb3VnaCB0aGUgYW5jZXN0b3JzIG9mIHRoZSBjdXJyZW50IGxpbmsgdW50aWwgd2UgaGl0IC5uYXYtbWVudS5cblx0XHR3aGlsZSAoIC0xID09PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnbWVudScgKSApIHtcblxuXHRcdFx0Ly8gT24gbGkgZWxlbWVudHMgdG9nZ2xlIHRoZSBjbGFzcyAuZm9jdXMuXG5cdFx0XHRpZiAoICdsaScgPT09IHNlbGYudGFnTmFtZS50b0xvd2VyQ2FzZSgpICkge1xuXHRcdFx0XHRpZiAoIC0xICE9PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnZm9jdXMnICkgKSB7XG5cdFx0XHRcdFx0c2VsZi5jbGFzc05hbWUgPSBzZWxmLmNsYXNzTmFtZS5yZXBsYWNlKCAnIGZvY3VzJywgJycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWxmLmNsYXNzTmFtZSArPSAnIGZvY3VzJztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRzZWxmID0gc2VsZi5wYXJlbnRFbGVtZW50O1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUb2dnbGVzIGBmb2N1c2AgY2xhc3MgdG8gYWxsb3cgc3VibWVudSBhY2Nlc3Mgb24gdGFibGV0cy5cblx0ICovXG5cdCggZnVuY3Rpb24oIGNvbnRhaW5lciApIHtcblx0XHR2YXIgdG91Y2hTdGFydEZuLCBpLFxuXHRcdFx0cGFyZW50TGluayA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCAnLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4gPiBhLCAucGFnZV9pdGVtX2hhc19jaGlsZHJlbiA+IGEnICk7XG5cblx0XHRpZiAoICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyApIHtcblx0XHRcdHRvdWNoU3RhcnRGbiA9IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgbWVudUl0ZW0gPSB0aGlzLnBhcmVudE5vZGUsIGk7XG5cblx0XHRcdFx0aWYgKCAhIG1lbnVJdGVtLmNsYXNzTGlzdC5jb250YWlucyggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW4ubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1lbnVJdGVtID09PSBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldICkge1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW5baV0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtZW51SXRlbS5jbGFzc0xpc3QuYWRkKCAnZm9jdXMnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRmb3IgKCBpID0gMDsgaSA8IHBhcmVudExpbmsubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdHBhcmVudExpbmtbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCB0b3VjaFN0YXJ0Rm4sIGZhbHNlICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KCBjb250YWluZXIgKSApO1xufSk7XG5cbi8vIHVzZXIgYWNjb3VudCBuYXZpZ2F0aW9uIGNhbiBiZSBhIGRyb3Bkb3duXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXHQvLyBoaWRlIG1lbnVcblx0aWYgKCQoJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJykubGVuZ3RoID4gMCApIHtcblx0XHQkKCcjdXNlci1hY2NvdW50LWFjY2VzcyA+IGxpID4gYScpLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0JCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgdWwnKS50b2dnbGVDbGFzcyggJ3Zpc2libGUnICk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0pO1xuXHR9XG5cbn0pO1xuIl19
