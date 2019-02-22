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

  function getConfirmChangeMarkup(action) {
    var markup = '<li class="a-form-caption a-form-confirm"><label>Are you sure? <a id="a-confirm-' + action + '" href="#">Yes</a> | <a id="a-stop-' + action + '" href="#">No</a></label></li>';
    return markup;
  }

  function manageEmails() {
    var form = $('#account-settings-form');
    var rest_root = user_account_management_rest.site_url + user_account_management_rest.rest_namespace;
    var full_url = rest_root + '/' + 'update-user/';
    var confirmChange = '';
    var nextEmailCount = 1;
    var newPrimaryEmail = '';
    var oldPrimaryEmail = '';
    var primaryId = '';
    var emailToRemove = '';
    var consolidatedEmails = [];
    var newEmails = [];
    var ajax_form_data = '';
    var that = ''; // start out with no primary/removals checked

    $('.a-form-caption.a-make-primary-email input[type="radio"]').prop('checked', false);
    $('.a-form-caption.a-remove-email input[type="checkbox"]').prop('checked', false); // if there is a list of emails (not just a single form field)

    if ($('.m-user-email-list').length > 0) {
      nextEmailCount = $('.m-user-email-list > li').length; // if a user selects a new primary, move it into that position

      $('.m-user-email-list').on('click', '.a-form-caption.a-make-primary-email input[type="radio"]', function (event) {
        newPrimaryEmail = $(this).val();
        oldPrimaryEmail = $('#email').val();
        primaryId = $(this).prop('id').replace('primary_email_', '');
        confirmChange = getConfirmChangeMarkup('primary-change'); // get or don't get confirmation from user

        that = $(this).parent().parent();
        $('.a-pre-confirm', that).hide();
        $('.a-form-confirm', that).show();
        $(this).parent().parent().addClass('a-pre-confirm');
        $(this).parent().parent().removeClass('a-stop-confirm'); //$( this ).parent().after( confirmChange );

        $(this).parent().parent().append(confirmChange);
        $('.m-user-email-list').on('click', '#a-confirm-primary-change', function (event) {
          event.preventDefault(); // change the user facing values

          $('.m-user-email-list > li').textNodes().first().replaceWith(newPrimaryEmail);
          $('#user-email-' + primaryId).textNodes().first().replaceWith(oldPrimaryEmail); // change the main hidden form value

          $('#email').val(newPrimaryEmail); // submit form values.

          form.submit(); // uncheck the radio button

          $('.a-form-caption.a-make-primary-email input[type="radio"]').prop('checked', false); // change the form values to the old primary email

          $('#primary_email_' + primaryId).val(oldPrimaryEmail);
          $('#remove_email_' + primaryId).val(oldPrimaryEmail); // remove the confirm message

          $('.a-form-confirm', that.parent()).remove();
          $('.a-pre-confirm', that.parent()).show();
        });
        $('.m-user-email-list').on('click', '#a-stop-primary-change', function (event) {
          event.preventDefault();
          $('.a-pre-confirm', that.parent()).show();
          $('.a-form-confirm', that.parent()).remove();
        });
      }); // if a user removes an email, take it away from the visual and from the form

      $('.m-user-email-list').on('change', '.a-form-caption.a-remove-email input[type="checkbox"]', function (event) {
        emailToRemove = $(this).val();
        confirmChange = getConfirmChangeMarkup('removal');
        $('.m-user-email-list > li').each(function (index) {
          if ($(this).contents().get(0).nodeValue !== emailToRemove) {
            consolidatedEmails.push($(this).contents().get(0).nodeValue);
          } else {
            consolidatedEmails.splice($.inArray(consolidatedEmails, $(this).contents().get(0).nodeValue), 1);
          }
        }); // get or don't get confirmation from user for removal

        that = $(this).parent().parent();
        $('.a-pre-confirm', that).hide();
        $('.a-form-confirm', that).show();
        $(this).parent().parent().addClass('a-pre-confirm');
        $(this).parent().parent().removeClass('a-stop-confirm');
        $(this).parent().parent().append(confirmChange); // if confirmed, remove the email and submit the form

        $('.m-user-email-list').on('click', '#a-confirm-removal', function (event) {
          event.preventDefault();
          $(this).parents('li').fadeOut('normal', function () {
            $(this).remove();
          });
          $('#_consolidated_emails').val(consolidatedEmails.join(','));
          nextEmailCount = $('.m-user-email-list > li').length;
          form.submit();
          $('.a-form-confirm', that.parent()).remove();
        });
        $('.m-user-email-list').on('click', '#a-stop-removal', function (event) {
          event.preventDefault();
          $('.a-pre-confirm', that.parent()).show();
          $('.a-form-confirm', that.parent()).remove();
        });
      });
    } // if a user wants to add an email, give them a properly numbered field


    $('.m-form-email').on('click', '.a-form-caption.a-add-email', function (event) {
      event.preventDefault();
      $('.a-form-caption.a-add-email').before('<div class="a-input-with-button a-button-sentence"><input type="email" name="_consolidated_emails_array[]" id="_consolidated_emails_array[]" value=""><button type="submit" name="a-add-email-' + nextEmailCount + '" id="a-add-email-' + nextEmailCount + '" class="a-button a-button-add-user-email">Add</button></div>');
      nextEmailCount++;
    });
    $('.m-entry-content').on('submit', '#account-settings-form', function (event) {
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
          $('.m-user-email-list').append('<li id="user-email-' + nextEmailCount + '">' + value + '<ul class="a-form-caption a-user-email-actions"><li class="a-form-caption a-pre-confirm a-make-primary-email"><input type="radio" name="primary_email" id="primary_email_' + nextEmailCount + '" value="' + value + '"><label for="primary_email_' + nextEmailCount + '"><small>Make Primary</small></label></li><li class="a-form-caption a-pre-confirm a-remove-email"><input type="checkbox" name="remove_email[' + nextEmailCount + ']" id="remove_email_' + nextEmailCount + '" value="' + value + '"><label for="remove_email_' + nextEmailCount + '"><small>Remove</small></label></li></ul></li>');
          $('#_consolidated_emails').val($('#_consolidated_emails').val() + ',' + value);
        });
        $('.m-form-change-email .a-input-with-button').remove();

        if ($('.m-user-email-list').length === 0) {
          if ($('input[name="_consolidated_emails_array[]"]') !== $('input[name="email"]')) {
            // it would be nice to only load the form, but then click events still don't work
            location.reload();
          }
        }
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
  setupMenu('navigation-primary');
  setupMenu('navigation-user-account-management');

  function setupMenu(container) {
    var button, menu, links, i, len;
    container = document.getElementById(container);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuYWx5dGljcy5qcyIsImZvcm1zLmpzIiwibmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6WyJtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsInZhbHVlIiwiZ2EiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiJCIsImNsaWNrIiwiZSIsInRyaW0iLCJocmVmIiwid2lkZ2V0X3RpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJkb2N1bWVudCIsInJlYWR5IiwiUFVNIiwiY3VycmVudF9wb3B1cCIsImdldFBvcHVwIiwic2V0dGluZ3MiLCJnZXRTZXR0aW5ncyIsInBvcHVwX2lkIiwiaWQiLCJvbiIsImNsb3NlX3RyaWdnZXIiLCJmbiIsInBvcG1ha2UiLCJsYXN0X2Nsb3NlX3RyaWdnZXIiLCJ1cmwiLCJhdHRyIiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJndGFnX3JlcG9ydF9jb252ZXJzaW9uIiwiY2FsbGJhY2siLCJ3aW5kb3ciLCJndGFnIiwidGV4dE5vZGVzIiwiY29udGVudHMiLCJmaWx0ZXIiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJub2RlVmFsdWUiLCJnZXRDb25maXJtQ2hhbmdlTWFya3VwIiwibWFya3VwIiwibWFuYWdlRW1haWxzIiwiZm9ybSIsInJlc3Rfcm9vdCIsInVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QiLCJzaXRlX3VybCIsInJlc3RfbmFtZXNwYWNlIiwiZnVsbF91cmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheF9mb3JtX2RhdGEiLCJ0aGF0IiwicHJvcCIsImxlbmd0aCIsImV2ZW50IiwidmFsIiwicmVwbGFjZSIsInBhcmVudCIsImhpZGUiLCJzaG93IiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFwcGVuZCIsInByZXZlbnREZWZhdWx0IiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsInJlbW92ZSIsImVhY2giLCJpbmRleCIsImdldCIsInB1c2giLCJzcGxpY2UiLCJpbkFycmF5IiwicGFyZW50cyIsImZhZGVPdXQiLCJqb2luIiwiYmVmb3JlIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRhdGEiLCJkb25lIiwibWFwIiwicmVsb2FkIiwiYnV0dG9uIiwicGFyYW1zIiwiYWpheHVybCIsInJlc3BvbnNlIiwibWVzc2FnZSIsInN1Y2Nlc3MiLCJhbmFseXRpY3NfYWN0aW9uIiwidXNlcl9zdGF0dXMiLCJjb25maXJtX21lc3NhZ2UiLCJodG1sIiwiZmFpbCIsImFsd2F5cyIsInRhcmdldCIsInJlc2V0Iiwic2V0dXBNZW51IiwiY29udGFpbmVyIiwibWVudSIsImxpbmtzIiwiaSIsImxlbiIsImdldEVsZW1lbnRCeUlkIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJzdHlsZSIsImRpc3BsYXkiLCJzZXRBdHRyaWJ1dGUiLCJjbGFzc05hbWUiLCJpbmRleE9mIiwib25jbGljayIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0b2dnbGVGb2N1cyIsInRvdWNoU3RhcnRGbiIsInBhcmVudExpbmsiLCJxdWVyeVNlbGVjdG9yQWxsIiwibWVudUl0ZW0iLCJwYXJlbnROb2RlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJjaGlsZHJlbiIsImFkZCIsInNlbGYiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJwYXJlbnRFbGVt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LENBQUMsK0JBQUQsQ0FBRCxDQUFtQ2tCLEVBQW5DLENBQXVDLE9BQXZDLEVBQWdELFVBQVMyQyxLQUFULEVBQWdCO0FBQy9EN0QsTUFBQUEsQ0FBQyxDQUFDLHlCQUFELENBQUQsQ0FBNkIySSxXQUE3QixDQUEwQyxTQUExQztBQUNBOUUsTUFBQUEsS0FBSyxDQUFDUyxjQUFOO0FBQ0EsS0FIRDtBQUlBO0FBRUQsQ0FURCIsImZpbGUiOiJtaW5ucG9zdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICkge1xuXHRpZiAoIHR5cGVvZiBnYSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0aWYgKCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG5mdW5jdGlvbiB0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApIHtcblxuXHQvLyBpZiBhIG5vdCBsb2dnZWQgaW4gdXNlciB0cmllcyB0byBlbWFpbCwgZG9uJ3QgY291bnQgdGhhdCBhcyBhIHNoYXJlXG5cdGlmICggISBqUXVlcnkoICdib2R5ICcpLmhhc0NsYXNzKCAnbG9nZ2VkLWluJykgJiYgJ0VtYWlsJyA9PT0gdGV4dCApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyB0cmFjayBhcyBhbiBldmVudCwgYW5kIGFzIHNvY2lhbCBpZiBpdCBpcyB0d2l0dGVyIG9yIGZiXG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1NoYXJlIC0gJyArIHBvc2l0aW9uLCB0ZXh0LCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0IHx8ICdUd2l0dGVyJyA9PT0gdGV4dCApIHtcblx0XHRcdGlmICggdGV4dCA9PSAnRmFjZWJvb2snICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuKCBmdW5jdGlvbiggJCApIHtcblxuXHQkICggJy5tLWVudHJ5LXNoYXJlLXRvcCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgdGV4dCA9ICQoIHRoaXMgKS50ZXh0KCkudHJpbSgpO1xuXHRcdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHRcdHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG5cdH0pO1xuXG5cdCQgKCAnLm0tZW50cnktc2hhcmUtYm90dG9tIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdHZhciB0ZXh0ID0gJCggdGhpcyApLnRleHQoKS50cmltKCk7XG5cdFx0dmFyIHBvc2l0aW9uID0gJ2JvdHRvbSc7XG5cdFx0dHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcblx0fSk7XG5cblx0JCggJyNuYXZpZ2F0aW9uLWZlYXR1cmVkIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ0ZlYXR1cmVkIEJhciBMaW5rJywgJ0NsaWNrJywgdGhpcy5ocmVmICk7XG5cdH0pO1xuXHQkKCAnYS5nbGVhbi1zaWRlYmFyJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdTaWRlYmFyIFN1cHBvcnQgTGluaycsICdDbGljaycsIHRoaXMuaHJlZiApO1xuXHR9KTtcblxuXHQkKCAnYScsICQoICcuby1zaXRlLXNpZGViYXInICkgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyIHdpZGdldF90aXRsZSA9ICQodGhpcykuY2xvc2VzdCgnLm0td2lkZ2V0JykuZmluZCgnaDMnKS50ZXh0KCk7XG5cdFx0dmFyIHNpZGViYXJfc2VjdGlvbl90aXRsZSA9ICcnO1xuXHRcdGlmICh3aWRnZXRfdGl0bGUgPT09ICcnKSB7XG5cdFx0XHQvL3NpZGViYXJfc2VjdGlvbl90aXRsZSA9ICQodGhpcykuY2xvc2VzdCgnLm5vZGUtdHlwZS1zcGlsbCcpLmZpbmQoJy5ub2RlLXRpdGxlIGEnKS50ZXh0KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNpZGViYXJfc2VjdGlvbl90aXRsZSA9IHdpZGdldF90aXRsZTtcblx0XHR9XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCdldmVudCcsICdTaWRlYmFyIExpbmsnLCAnQ2xpY2snLCBzaWRlYmFyX3NlY3Rpb25fdGl0bGUpO1xuXHR9KTtcblxuXHQkKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiAoIGUgKSB7XG5cblx0XHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgUFVNICkge1xuXHRcdFx0dmFyIGN1cnJlbnRfcG9wdXAgPSBQVU0uZ2V0UG9wdXAoICQoICcucHVtJyApICk7XG5cdFx0XHR2YXIgc2V0dGluZ3MgPSBQVU0uZ2V0U2V0dGluZ3MoICQoICcucHVtJyApICk7XG5cdFx0XHR2YXIgcG9wdXBfaWQgPSBzZXR0aW5ncy5pZDtcblx0XHRcdCQoIGRvY3VtZW50ICkub24oJ3B1bUFmdGVyT3BlbicsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnU2hvdycsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSApO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCBkb2N1bWVudCApLm9uKCdwdW1BZnRlckNsb3NlJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgY2xvc2VfdHJpZ2dlciA9ICQuZm4ucG9wbWFrZS5sYXN0X2Nsb3NlX3RyaWdnZXI7XG5cdFx0XHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBjbG9zZV90cmlnZ2VyICkge1xuXHRcdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgY2xvc2VfdHJpZ2dlciwgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0JCggJy5tZXNzYWdlLWNsb3NlJyApLmNsaWNrKGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBsaW5rIHdpdGggY2xvc2UgY2xhc3Ncblx0XHRcdFx0dmFyIGNsb3NlX3RyaWdnZXIgPSAnQ2xvc2UgQnV0dG9uJztcblx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCBjbG9zZV90cmlnZ2VyLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0gKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5tZXNzYWdlLWxvZ2luJyApLmNsaWNrKGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBsaW5rIHdpdGggbG9naW4gY2xhc3Ncblx0XHRcdFx0dmFyIHVybCA9ICQodGhpcykuYXR0cignaHJlZicpO1xuXHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdMb2dpbiBMaW5rJywgdXJsICk7XG5cdFx0XHR9KTtcblx0XHRcdCQoICcucHVtLWNvbnRlbnQgYTpub3QoIC5tZXNzYWdlLWNsb3NlLCAucHVtLWNsb3NlLCAubWVzc2FnZS1sb2dpbiApJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3Mgc29tZXRoaW5nIHRoYXQgaXMgbm90IGNsb3NlIHRleHQgb3IgY2xvc2UgaWNvblxuXHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdDbGljaycsIHBvcHVwX2lkICk7XG4gICAgICAgICAgICB9KTtcblx0XHR9XG5cblx0XHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHRcdHZhciB0eXBlID0gJ2V2ZW50Jztcblx0XHRcdHZhciBjYXRlZ29yeSA9ICdNZW1iZXIgQ29udGVudCc7XG5cdFx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdFx0dmFyIGFjdGlvbiA9ICdCbG9ja2VkJztcblx0XHRcdGlmICggdHJ1ZSA9PT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLmN1cnJlbnRfdXNlci5jYW5fYWNjZXNzICkge1xuXHRcdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdFx0fVxuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH1cblx0fSk7XG5cbn0gKSggalF1ZXJ5ICk7IiwiKGZ1bmN0aW9uKCQpe1xuXHRmdW5jdGlvbiBndGFnX3JlcG9ydF9jb252ZXJzaW9uKHVybCkge1xuXHRcdHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcblx0XHQgIGlmICh0eXBlb2YodXJsKSAhPSAndW5kZWZpbmVkJykge1xuXHRcdCAgICB3aW5kb3cubG9jYXRpb24gPSB1cmw7XG5cdFx0ICB9XG5cdFx0fTtcblx0XHRndGFnKCdldmVudCcsICdjb252ZXJzaW9uJywge1xuXHRcdCAgJ3NlbmRfdG8nOiAnQVctOTc2NjIwMTc1L2pxQ3lDTDdhdFhrUWo1WFkwUU0nLFxuXHRcdCAgJ2V2ZW50X2NhbGxiYWNrJzogY2FsbGJhY2tcblx0XHR9KTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRqUXVlcnkuZm4udGV4dE5vZGVzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuY29udGVudHMoKS5maWx0ZXIoZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gKHRoaXMubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmIHRoaXMubm9kZVZhbHVlLnRyaW0oKSAhPT0gXCJcIik7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdFx0dmFyIG1hcmt1cCA9ICc8bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLWZvcm0tY29uZmlybVwiPjxsYWJlbD5BcmUgeW91IHN1cmU/IDxhIGlkPVwiYS1jb25maXJtLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ZZXM8L2E+IHwgPGEgaWQ9XCJhLXN0b3AtJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPk5vPC9hPjwvbGFiZWw+PC9saT4nO1xuXHRcdHJldHVybiBtYXJrdXA7XG5cdH1cblxuXHRmdW5jdGlvbiBtYW5hZ2VFbWFpbHMoKSB7XG5cdFx0dmFyIGZvcm0gICAgICAgICAgICAgICA9ICQoJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nKTtcblx0XHR2YXIgcmVzdF9yb290ICAgICAgICAgID0gdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5zaXRlX3VybCArIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QucmVzdF9uYW1lc3BhY2U7XG5cdFx0dmFyIGZ1bGxfdXJsICAgICAgICAgICA9IHJlc3Rfcm9vdCArICcvJyArICd1cGRhdGUtdXNlci8nO1xuXHRcdHZhciBjb25maXJtQ2hhbmdlICAgICAgPSAnJztcblx0XHR2YXIgbmV4dEVtYWlsQ291bnQgICAgID0gMTtcblx0XHR2YXIgbmV3UHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdFx0dmFyIG9sZFByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHRcdHZhciBwcmltYXJ5SWQgICAgICAgICAgPSAnJztcblx0XHR2YXIgZW1haWxUb1JlbW92ZSAgICAgID0gJyc7XG5cdFx0dmFyIGNvbnNvbGlkYXRlZEVtYWlscyA9IFtdO1xuXHRcdHZhciBuZXdFbWFpbHMgICAgICAgICAgPSBbXTtcblx0XHR2YXIgYWpheF9mb3JtX2RhdGEgICAgID0gJyc7XG5cdFx0dmFyIHRoYXQgICAgICAgICAgICAgICA9ICcnO1xuXHRcdC8vIHN0YXJ0IG91dCB3aXRoIG5vIHByaW1hcnkvcmVtb3ZhbHMgY2hlY2tlZFxuXHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0Ly8gaWYgdGhlcmUgaXMgYSBsaXN0IG9mIGVtYWlscyAobm90IGp1c3QgYSBzaW5nbGUgZm9ybSBmaWVsZClcblx0XHRpZiAoICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoID4gMCApIHtcblx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdC8vIGlmIGEgdXNlciBzZWxlY3RzIGEgbmV3IHByaW1hcnksIG1vdmUgaXQgaW50byB0aGF0IHBvc2l0aW9uXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XG5cdFx0XHRcdG5ld1ByaW1hcnlFbWFpbCA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdFx0cHJpbWFyeUlkICAgICAgID0gJCggdGhpcyApLnByb3AoICdpZCcgKS5yZXBsYWNlKCAncHJpbWFyeV9lbWFpbF8nLCAnJyApO1xuXHRcdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncHJpbWFyeS1jaGFuZ2UnICk7XG5cblx0XHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyXG5cdFx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdFx0Ly8kKCB0aGlzICkucGFyZW50KCkuYWZ0ZXIoIGNvbmZpcm1DaGFuZ2UgKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0Ly8gY2hhbmdlIHRoZSB1c2VyIGZhY2luZyB2YWx1ZXNcblx0XHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdFx0JCggJyN1c2VyLWVtYWlsLScgKyBwcmltYXJ5SWQgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0XHQvLyBjaGFuZ2UgdGhlIG1haW4gaGlkZGVuIGZvcm0gdmFsdWVcblx0XHRcdFx0XHQkKCAnI2VtYWlsJyApLnZhbCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdFx0Ly8gc3VibWl0IGZvcm0gdmFsdWVzLlxuXHRcdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdFx0Ly8gdW5jaGVjayB0aGUgcmFkaW8gYnV0dG9uXG5cdFx0XHRcdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHRcdC8vIGNoYW5nZSB0aGUgZm9ybSB2YWx1ZXMgdG8gdGhlIG9sZCBwcmltYXJ5IGVtYWlsXG5cdFx0XHRcdFx0JCggJyNwcmltYXJ5X2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHRcdCQoICcjcmVtb3ZlX2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHRcdC8vIHJlbW92ZSB0aGUgY29uZmlybSBtZXNzYWdlXG5cdFx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGlmIGEgdXNlciByZW1vdmVzIGFuIGVtYWlsLCB0YWtlIGl0IGF3YXkgZnJvbSB0aGUgdmlzdWFsIGFuZCBmcm9tIHRoZSBmb3JtXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2hhbmdlJywgJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdyZW1vdmFsJyApO1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkuZWFjaCggZnVuY3Rpb24oIGluZGV4ICkge1xuXHRcdFx0XHRcdGlmICggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICE9PSBlbWFpbFRvUmVtb3ZlICkge1xuXHRcdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zb2xpZGF0ZWRFbWFpbHMuc3BsaWNlKCAkLmluQXJyYXkoIGNvbnNvbGlkYXRlZEVtYWlscywgJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICksIDEgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXIgZm9yIHJlbW92YWxcblx0XHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHRcdC8vIGlmIGNvbmZpcm1lZCwgcmVtb3ZlIHRoZSBlbWFpbCBhbmQgc3VibWl0IHRoZSBmb3JtXG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpJyApLmZhZGVPdXQoICdub3JtYWwnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gaWYgYSB1c2VyIHdhbnRzIHRvIGFkZCBhbiBlbWFpbCwgZ2l2ZSB0aGVtIGEgcHJvcGVybHkgbnVtYmVyZWQgZmllbGRcblx0XHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkKCcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnKS5iZWZvcmUoICc8ZGl2IGNsYXNzPVwiYS1pbnB1dC13aXRoLWJ1dHRvbiBhLWJ1dHRvbi1zZW50ZW5jZVwiPjxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIGlkPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIHZhbHVlPVwiXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBpZD1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBjbGFzcz1cImEtYnV0dG9uIGEtYnV0dG9uLWFkZC11c2VyLWVtYWlsXCI+QWRkPC9idXR0b24+PC9kaXY+JyApO1xuXHRcdFx0bmV4dEVtYWlsQ291bnQrKztcblx0XHR9KTtcblxuXHRcdCQoICcubS1lbnRyeS1jb250ZW50JyApLm9uKCAnc3VibWl0JywgJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4X2Zvcm1fZGF0YSA9IGFqYXhfZm9ybV9kYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dXJsOiBmdWxsX3VybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcblx0XHRcdCAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0ICAgIH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhfZm9ybV9kYXRhXG5cdFx0XHR9KS5kb25lKCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQodGhpcykudmFsKCk7XG5cdFx0XHRcdH0pLmdldCgpO1xuXHRcdFx0XHQkLmVhY2goIG5ld0VtYWlscywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9IG5leHRFbWFpbENvdW50ICsgaW5kZXg7XG5cdFx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5hcHBlbmQoICc8bGkgaWQ9XCJ1c2VyLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIj4nICsgdmFsdWUgKyAnPHVsIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS11c2VyLWVtYWlsLWFjdGlvbnNcIj48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtbWFrZS1wcmltYXJ5LWVtYWlsXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJwcmltYXJ5X2VtYWlsXCIgaWQ9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPk1ha2UgUHJpbWFyeTwvc21hbGw+PC9sYWJlbD48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggJCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoKSArICcsJyArIHZhbHVlICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cdFx0XHRcdFx0XHQvLyBpdCB3b3VsZCBiZSBuaWNlIHRvIG9ubHkgbG9hZCB0aGUgZm9ybSwgYnV0IHRoZW4gY2xpY2sgZXZlbnRzIHN0aWxsIGRvbid0IHdvcmtcblx0XHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXHRcdFwidXNlIHN0cmljdFwiO1xuXHRcdGlmICggJCgnLm0tZm9ybS1lbWFpbCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0XHR9XG5cdFx0aWYgKCAkKCcubS1mb3JtLW5ld3NsZXR0ZXItc2hvcnRjb2RlJykubGVuZ3RoID4gMCApIHtcblx0XHRcdCQoJy5tLWZvcm0tbmV3c2xldHRlci1zaG9ydGNvZGUgZmllbGRzZXQnKS5iZWZvcmUoJzxkaXYgY2xhc3M9XCJtLWhvbGQtbWVzc2FnZVwiPjwvZGl2PicpO1xuXHRcdFx0JCgnLm0tZm9ybS1uZXdzbGV0dGVyLXNob3J0Y29kZSBmb3JtJykuc3VibWl0KGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gUHJldmVudCB0aGUgZGVmYXVsdCBmb3JtIHN1Ym1pdC5cblx0XHRcdFx0dmFyIGJ1dHRvbiA9ICQoJ2J1dHRvbicsIHRoaXMpO1xuXHRcdFx0XHRidXR0b24ucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblx0XHRcdFx0YnV0dG9uLnRleHQoJ1Byb2Nlc3NpbmcnKTtcblx0XHRcdFx0Ly8gc2VyaWFsaXplIHRoZSBmb3JtIGRhdGFcblx0XHRcdFx0dmFyIGFqYXhfZm9ybV9kYXRhID0gJCh0aGlzKS5zZXJpYWxpemUoKTtcblx0XHRcdFx0Ly9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0XHRhamF4X2Zvcm1fZGF0YSA9IGFqYXhfZm9ybV9kYXRhICsgJyZhamF4cmVxdWVzdD10cnVlJnN1YnNjcmliZSc7XG5cdFx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdFx0dXJsOiBwYXJhbXMuYWpheHVybCwgLy8gZG9tYWluL3dwLWFkbWluL2FkbWluLWFqYXgucGhwXG5cdFx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRcdGRhdGFUeXBlIDogJ2pzb24nLFxuXHRcdFx0XHRcdGRhdGE6IGFqYXhfZm9ybV9kYXRhXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7IC8vIHJlc3BvbnNlIGZyb20gdGhlIFBIUCBhY3Rpb25cblx0XHRcdFx0XHR2YXIgbWVzc2FnZSA9ICcnO1xuXHRcdFx0XHRcdGlmICggcmVzcG9uc2Uuc3VjY2VzcyA9PT0gdHJ1ZSApIHtcblx0XHRcdFx0XHRcdCQoJ2ZpZWxkc2V0JywgdGhhdCkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0YnV0dG9uLnRleHQoJ1RoYW5rcycpO1xuXHRcdFx0XHRcdFx0dmFyIGFuYWx5dGljc19hY3Rpb24gPSAnU2lnbnVwJztcblx0XHRcdFx0XHRcdHN3aXRjaCAocmVzcG9uc2UuZGF0YS51c2VyX3N0YXR1cykge1xuXHRcdFx0XHRcdFx0XHRjYXNlICdleGlzdGluZyc6XG5cdFx0XHRcdFx0XHRcdFx0YW5hbHl0aWNzX2FjdGlvbiA9ICdVcGRhdGUnO1xuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2UgPSAnVGhhbmtzIGZvciB1cGRhdGluZyB5b3VyIGVtYWlsIHByZWZlcmVuY2VzLiBUaGV5IHdpbGwgZ28gaW50byBlZmZlY3QgaW1tZWRpYXRlbHkuJztcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbmV3Jzpcblx0XHRcdFx0XHRcdFx0XHRhbmFseXRpY3NfYWN0aW9uID0gJ1NpZ251cCc7XG5cdFx0XHRcdFx0XHRcdFx0bWVzc2FnZSA9ICdXZSBoYXZlIGFkZGVkIHlvdSB0byB0aGUgTWlublBvc3QgbWFpbGluZyBsaXN0Lic7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3BlbmRpbmcnOlxuXHRcdFx0XHRcdFx0XHRcdGFuYWx5dGljc19hY3Rpb24gPSAnU2lnbnVwJztcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlID0gJ1dlIGhhdmUgYWRkZWQgeW91IHRvIHRoZSBNaW5uUG9zdCBtYWlsaW5nIGxpc3QuIFlvdSB3aWxsIG5lZWQgdG8gY2xpY2sgdGhlIGNvbmZpcm1hdGlvbiBsaW5rIGluIHRoZSBlbWFpbCB3ZSBzZW50IHRvIGJlZ2luIHJlY2VpdmluZyBtZXNzYWdlcy4nO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCByZXNwb25zZS5kYXRhLmNvbmZpcm1fbWVzc2FnZSAhPT0gJycgKSB7XG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2UgPSByZXNwb25zZS5kYXRhLmNvbmZpcm1fbWVzc2FnZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCApIHtcblx0XHRcdFx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnTmV3c2xldHRlcicsIGFuYWx5dGljc19hY3Rpb24sIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHRcdFx0XHRcdGd0YWdfcmVwb3J0X2NvbnZlcnNpb24oIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRcdFx0XHRcdGJ1dHRvbi50ZXh0KCdTdWJzY3JpYmUnKTtcblx0XHRcdFx0XHRcdGlmICggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCApIHtcblx0XHRcdFx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnTmV3c2xldHRlcicsICdGYWlsJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JCgnLm0taG9sZC1tZXNzYWdlJykuaHRtbCgnPGRpdiBjbGFzcz1cIm0tZm9ybS1tZXNzYWdlIG0tZm9ybS1tZXNzYWdlLWluZm9cIj4nICsgbWVzc2FnZSArICc8L2Rpdj4nKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmZhaWwoZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0XHQkKCcubS1ob2xkLW1lc3NhZ2UnKS5odG1sKCc8ZGl2IGNsYXNzPVwibS1mb3JtLW1lc3NhZ2UgbS1mb3JtLW1lc3NhZ2UtaW5mb1wiPkFuIGVycm9yIGhhcyBvY2N1cmVkLiBQbGVhc2UgdHJ5IGFnYWluLjwvZGl2PicpO1xuXHRcdFx0XHRcdGJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblx0XHRcdFx0XHRidXR0b24udGV4dCgnU3Vic2NyaWJlJyk7XG5cdFx0XHRcdFx0aWYgKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgbXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50ICkge1xuXHRcdFx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnTmV3c2xldHRlcicsICdGYWlsJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5hbHdheXMoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0ZXZlbnQudGFyZ2V0LnJlc2V0KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn0pKGpRdWVyeSk7XG4iLCIvKipcbiAqIEZpbGUgbmF2aWdhdGlvbi5qcy5cbiAqXG4gKiBIYW5kbGVzIHRvZ2dsaW5nIHRoZSBuYXZpZ2F0aW9uIG1lbnUgZm9yIHNtYWxsIHNjcmVlbnMgYW5kIGVuYWJsZXMgVEFCIGtleVxuICogbmF2aWdhdGlvbiBzdXBwb3J0IGZvciBkcm9wZG93biBtZW51cy5cbiAqL1xualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRzZXR1cE1lbnUoICduYXZpZ2F0aW9uLXByaW1hcnknICk7XG5cdHNldHVwTWVudSggJ25hdmlnYXRpb24tdXNlci1hY2NvdW50LW1hbmFnZW1lbnQnICk7XG5cblx0ZnVuY3Rpb24gc2V0dXBNZW51KCBjb250YWluZXIgKSB7XG5cdFx0dmFyIGJ1dHRvbiwgbWVudSwgbGlua3MsIGksIGxlbjtcblx0XHRjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggY29udGFpbmVyICk7XG5cdFx0aWYgKCAhIGNvbnRhaW5lciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRidXR0b24gPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdidXR0b24nIClbMF07XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIGJ1dHRvbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRtZW51ID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAndWwnIClbMF07XG5cblx0XHQvLyBIaWRlIG1lbnUgdG9nZ2xlIGJ1dHRvbiBpZiBtZW51IGlzIGVtcHR5IGFuZCByZXR1cm4gZWFybHkuXG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG1lbnUgKSB7XG5cdFx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0aWYgKCAtMSA9PT0gbWVudS5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cdFx0XHRtZW51LmNsYXNzTmFtZSArPSAnIG1lbnUnO1xuXHRcdH1cblxuXHRcdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIC0xICE9PSBjb250YWluZXIuY2xhc3NOYW1lLmluZGV4T2YoICd0b2dnbGVkJyApICkge1xuXHRcdFx0XHRjb250YWluZXIuY2xhc3NOYW1lID0gY29udGFpbmVyLmNsYXNzTmFtZS5yZXBsYWNlKCAnIHRvZ2dsZWQnLCAnJyApO1xuXHRcdFx0XHRidXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHRcdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSArPSAnIHRvZ2dsZWQnO1xuXHRcdFx0XHRidXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyApO1xuXHRcdFx0XHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Ly8gR2V0IGFsbCB0aGUgbGluayBlbGVtZW50cyB3aXRoaW4gdGhlIG1lbnUuXG5cdFx0bGlua3MgICAgPSBtZW51LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYScgKTtcblxuXHRcdC8vIEVhY2ggdGltZSBhIG1lbnUgbGluayBpcyBmb2N1c2VkIG9yIGJsdXJyZWQsIHRvZ2dsZSBmb2N1cy5cblx0XHRmb3IgKCBpID0gMCwgbGVuID0gbGlua3MubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCAnZm9jdXMnLCB0b2dnbGVGb2N1cywgdHJ1ZSApO1xuXHRcdFx0bGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ2JsdXInLCB0b2dnbGVGb2N1cywgdHJ1ZSApO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFRvZ2dsZXMgYGZvY3VzYCBjbGFzcyB0byBhbGxvdyBzdWJtZW51IGFjY2VzcyBvbiB0YWJsZXRzLlxuXHRcdCAqL1xuXHRcdCggZnVuY3Rpb24oIGNvbnRhaW5lciApIHtcblx0XHRcdHZhciB0b3VjaFN0YXJ0Rm4sIGksXG5cdFx0XHRcdHBhcmVudExpbmsgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCggJy5tZW51LWl0ZW0taGFzLWNoaWxkcmVuID4gYSwgLnBhZ2VfaXRlbV9oYXNfY2hpbGRyZW4gPiBhJyApO1xuXG5cdFx0XHRpZiAoICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyApIHtcblx0XHRcdFx0dG91Y2hTdGFydEZuID0gZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0dmFyIG1lbnVJdGVtID0gdGhpcy5wYXJlbnROb2RlLCBpO1xuXG5cdFx0XHRcdFx0aWYgKCAhIG1lbnVJdGVtLmNsYXNzTGlzdC5jb250YWlucyggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0Zm9yICggaSA9IDA7IGkgPCBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuLmxlbmd0aDsgKytpICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIG1lbnVJdGVtID09PSBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldICkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW5baV0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LmFkZCggJ2ZvY3VzJyApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtZW51SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCAnZm9jdXMnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgcGFyZW50TGluay5sZW5ndGg7ICsraSApIHtcblx0XHRcdFx0XHRwYXJlbnRMaW5rW2ldLmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hTdGFydEZuLCBmYWxzZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSggY29udGFpbmVyICkgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIG9yIHJlbW92ZXMgLmZvY3VzIGNsYXNzIG9uIGFuIGVsZW1lbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVGb2N1cygpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHQvLyBNb3ZlIHVwIHRocm91Z2ggdGhlIGFuY2VzdG9ycyBvZiB0aGUgY3VycmVudCBsaW5rIHVudGlsIHdlIGhpdCAubmF2LW1lbnUuXG5cdFx0d2hpbGUgKCAtMSA9PT0gc2VsZi5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cblx0XHRcdC8vIE9uIGxpIGVsZW1lbnRzIHRvZ2dsZSB0aGUgY2xhc3MgLmZvY3VzLlxuXHRcdFx0aWYgKCAnbGknID09PSBzZWxmLnRhZ05hbWUudG9Mb3dlckNhc2UoKSApIHtcblx0XHRcdFx0aWYgKCAtMSAhPT0gc2VsZi5jbGFzc05hbWUuaW5kZXhPZiggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRcdHNlbGYuY2xhc3NOYW1lID0gc2VsZi5jbGFzc05hbWUucmVwbGFjZSggJyBmb2N1cycsICcnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VsZi5jbGFzc05hbWUgKz0gJyBmb2N1cyc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0c2VsZiA9IHNlbGYucGFyZW50RWxlbWVudDtcblx0XHR9XG5cdH1cblxufSk7XG5cbi8vIHVzZXIgYWNjb3VudCBuYXZpZ2F0aW9uIGNhbiBiZSBhIGRyb3Bkb3duXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXHQvLyBoaWRlIG1lbnVcblx0aWYgKCQoJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJykubGVuZ3RoID4gMCApIHtcblx0XHQkKCcjdXNlci1hY2NvdW50LWFjY2VzcyA+IGxpID4gYScpLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0JCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgdWwnKS50b2dnbGVDbGFzcyggJ3Zpc2libGUnICk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0pO1xuXHR9XG5cbn0pO1xuIl19
