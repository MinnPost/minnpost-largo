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
    var that = '';

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
          event.preventDefault(); // change the form values to the old primary email

          $('#primary_email_' + primaryId).val(oldPrimaryEmail);
          $('#remove_email_' + primaryId).val(oldPrimaryEmail); // change the user facing values

          $('.m-user-email-list > li').textNodes().first().replaceWith(newPrimaryEmail);
          $('#user-email-' + primaryId).textNodes().first().replaceWith(oldPrimaryEmail); // change the main hidden form value

          $('#email').val(newPrimaryEmail); // submit form values.

          form.submit();
          $('.a-form-confirm', that.parent()).remove();
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
          }
        }); // get or don't get confirmation from user

        that = $(this).parent().parent();
        $('.a-pre-confirm', that).hide();
        $('.a-form-confirm', that).show();
        $(this).parent().parent().addClass('a-pre-confirm');
        $(this).parent().parent().removeClass('a-stop-confirm'); //$( this ).parent().after( confirmChange );

        $(this).parent().parent().append(confirmChange);
        $('.m-user-email-list').on('click', '#a-confirm-removal', function (event) {
          event.preventDefault();
          $(this).parents('li').remove();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuYWx5dGljcy5qcyIsImZvcm1zLmpzIiwibmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6WyJtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsInZhbHVlIiwiZ2EiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiJCIsImNsaWNrIiwiZSIsInRyaW0iLCJocmVmIiwid2lkZ2V0X3RpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJkb2N1bWVudCIsInJlYWR5IiwiUFVNIiwiY3VycmVudF9wb3B1cCIsImdldFBvcHVwIiwic2V0dGluZ3MiLCJnZXRTZXR0aW5ncyIsInBvcHVwX2lkIiwiaWQiLCJvbiIsImNsb3NlX3RyaWdnZXIiLCJmbiIsInBvcG1ha2UiLCJsYXN0X2Nsb3NlX3RyaWdnZXIiLCJ1cmwiLCJhdHRyIiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJndGFnX3JlcG9ydF9jb252ZXJzaW9uIiwiY2FsbGJhY2siLCJ3aW5kb3ciLCJndGFnIiwidGV4dE5vZGVzIiwiY29udGVudHMiLCJmaWx0ZXIiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJub2RlVmFsdWUiLCJnZXRDb25maXJtQ2hhbmdlTWFya3VwIiwibWFya3VwIiwibWFuYWdlRW1haWxzIiwiZm9ybSIsInJlc3Rfcm9vdCIsInVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QiLCJzaXRlX3VybCIsInJlc3RfbmFtZXNwYWNlIiwiZnVsbF91cmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheF9mb3JtX2RhdGEiLCJ0aGF0IiwibGVuZ3RoIiwiZXZlbnQiLCJ2YWwiLCJwcm9wIiwicmVwbGFjZSIsInBhcmVudCIsImhpZGUiLCJzaG93IiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFwcGVuZCIsInByZXZlbnREZWZhdWx0IiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsInJlbW92ZSIsImVhY2giLCJpbmRleCIsImdldCIsInB1c2giLCJwYXJlbnRzIiwiam9pbiIsImJlZm9yZSIsInNlcmlhbGl6ZSIsImFqYXgiLCJiZWZvcmVTZW5kIiwieGhyIiwic2V0UmVxdWVzdEhlYWRlciIsIm5vbmNlIiwiZGF0YVR5cGUiLCJkYXRhIiwiZG9uZSIsIm1hcCIsImJ1dHRvbiIsInBhcmFtcyIsImFqYXh1cmwiLCJyZXNwb25zZSIsIm1lc3NhZ2UiLCJzdWNjZXNzIiwiYW5hbHl0aWNzX2FjdGlvbiIsInVzZXJfc3RhdHVzIiwiY29uZmlybV9tZXNzYWdlIiwiaHRtbCIsImZhaWwiLCJhbHdheXMiLCJ0YXJnZXQiLCJyZXNldCIsImNvbnRhaW5lciIsIm1lbnUiLCJsaW5rcyIsImkiLCJsZW4iLCJnZXRFbGVtZW50QnlJZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwic3R5bGUiLCJkaXNwbGF5Iiwic2V0QXR0cmlidXRlIiwiY2xhc3NOYW1lIiwiaW5kZXhPZiIsIm9uY2xpY2siLCJhZGRFdmVudExpc3RlbmVyIiwidG9nZ2xlRm9jdXMiLCJzZWxmIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwicGFyZW50RWxlbWVudCIsInRvdWNoU3RhcnRGbiIsInBhcmVudExpbmsiLCJxdWVyeVNlbGVjdG9yQWxsIiwibWVudUl0ZW0iLCJwYXJlbnROb2RlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJjaGlsZHJlbiIsImFkZCIsInRvZ2dsZUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLDJCQUFU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Y2VzQ29udGVudCI6WyJmdW5jdGlvbiBtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApIHtcblx0aWYgKCB0eXBlb2YgZ2EgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdGlmICggdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKSB7XG5cblx0Ly8gaWYgYSBub3QgbG9nZ2VkIGluIHVzZXIgdHJpZXMgdG8gZW1haWwsIGRvbid0IGNvdW50IHRoYXQgYXMgYSBzaGFyZVxuXHRpZiAoICEgalF1ZXJ5KCAnYm9keSAnKS5oYXNDbGFzcyggJ2xvZ2dlZC1pbicpICYmICdFbWFpbCcgPT09IHRleHQgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gdHJhY2sgYXMgYW4gZXZlbnQsIGFuZCBhcyBzb2NpYWwgaWYgaXQgaXMgdHdpdHRlciBvciBmYlxuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdTaGFyZSAtICcgKyBwb3NpdGlvbiwgdGV4dCwgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGdhICkge1xuXHRcdGlmICggJ0ZhY2Vib29rJyA9PT0gdGV4dCB8fCAnVHdpdHRlcicgPT09IHRleHQgKSB7XG5cdFx0XHRpZiAoIHRleHQgPT0gJ0ZhY2Vib29rJyApIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdTaGFyZScsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1R3ZWV0JywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbiggZnVuY3Rpb24oICQgKSB7XG5cblx0JCAoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpLnRyaW0oKTtcblx0XHR2YXIgcG9zaXRpb24gPSAndG9wJztcblx0XHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xuXHR9KTtcblxuXHQkICggJy5tLWVudHJ5LXNoYXJlLWJvdHRvbSBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgdGV4dCA9ICQoIHRoaXMgKS50ZXh0KCkudHJpbSgpO1xuXHRcdHZhciBwb3NpdGlvbiA9ICdib3R0b20nO1xuXHRcdHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG5cdH0pO1xuXG5cdCQoICcjbmF2aWdhdGlvbi1mZWF0dXJlZCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdGZWF0dXJlZCBCYXIgTGluaycsICdDbGljaycsIHRoaXMuaHJlZiApO1xuXHR9KTtcblx0JCggJ2EuZ2xlYW4tc2lkZWJhcicgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBTdXBwb3J0IExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcblx0fSk7XG5cblx0JCggJ2EnLCAkKCAnLm8tc2l0ZS1zaWRlYmFyJyApICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdHZhciB3aWRnZXRfdGl0bGUgPSAkKHRoaXMpLmNsb3Nlc3QoJy5tLXdpZGdldCcpLmZpbmQoJ2gzJykudGV4dCgpO1xuXHRcdHZhciBzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSAnJztcblx0XHRpZiAod2lkZ2V0X3RpdGxlID09PSAnJykge1xuXHRcdFx0Ly9zaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSAkKHRoaXMpLmNsb3Nlc3QoJy5ub2RlLXR5cGUtc3BpbGwnKS5maW5kKCcubm9kZS10aXRsZSBhJykudGV4dCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSB3aWRnZXRfdGl0bGU7XG5cdFx0fVxuXHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCgnZXZlbnQnLCAnU2lkZWJhciBMaW5rJywgJ0NsaWNrJywgc2lkZWJhcl9zZWN0aW9uX3RpdGxlKTtcblx0fSk7XG5cblx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24gKCBlICkge1xuXG5cdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIFBVTSApIHtcblx0XHRcdHZhciBjdXJyZW50X3BvcHVwID0gUFVNLmdldFBvcHVwKCAkKCAnLnB1bScgKSApO1xuXHRcdFx0dmFyIHNldHRpbmdzID0gUFVNLmdldFNldHRpbmdzKCAkKCAnLnB1bScgKSApO1xuXHRcdFx0dmFyIHBvcHVwX2lkID0gc2V0dGluZ3MuaWQ7XG5cdFx0XHQkKCBkb2N1bWVudCApLm9uKCdwdW1BZnRlck9wZW4nLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ1Nob3cnLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0gKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggZG9jdW1lbnQgKS5vbigncHVtQWZ0ZXJDbG9zZScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIGNsb3NlX3RyaWdnZXIgPSAkLmZuLnBvcG1ha2UubGFzdF9jbG9zZV90cmlnZ2VyO1xuXHRcdFx0XHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgY2xvc2VfdHJpZ2dlciApIHtcblx0XHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubWVzc2FnZS1jbG9zZScgKS5jbGljayhmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGNsb3NlIGNsYXNzXG5cdFx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJ0Nsb3NlIEJ1dHRvbic7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgY2xvc2VfdHJpZ2dlciwgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9ICk7XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubWVzc2FnZS1sb2dpbicgKS5jbGljayhmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGxvZ2luIGNsYXNzXG5cdFx0XHRcdHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcblx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnTG9naW4gTGluaycsIHVybCApO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLnB1bS1jb250ZW50IGE6bm90KCAubWVzc2FnZS1jbG9zZSwgLnB1bS1jbG9zZSwgLm1lc3NhZ2UtbG9naW4gKScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIHNvbWV0aGluZyB0aGF0IGlzIG5vdCBjbG9zZSB0ZXh0IG9yIGNsb3NlIGljb25cblx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnQ2xpY2snLCBwb3B1cF9pZCApO1xuICAgICAgICAgICAgfSk7XG5cdFx0fVxuXG5cdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSAmJiAnJyAhPT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLnVybF9hY2Nlc3NfbGV2ZWwgKSB7XG5cdFx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0XHR2YXIgY2F0ZWdvcnkgPSAnTWVtYmVyIENvbnRlbnQnO1xuXHRcdFx0dmFyIGxhYmVsID0gbG9jYXRpb24ucGF0aG5hbWU7IC8vIGkgdGhpbmsgd2UgY291bGQgcG9zc2libHkgcHV0IHNvbWUgZ3JvdXBpbmcgaGVyZSwgYnV0IHdlIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYWNjZXNzIHRvIG9uZSBhbmQgbWF5YmUgaXQncyBub3Qgd29ydGh3aGlsZSB5ZXRcblx0XHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0XHRpZiAoIHRydWUgPT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS5jdXJyZW50X3VzZXIuY2FuX2FjY2VzcyApIHtcblx0XHRcdFx0YWN0aW9uID0gJ1Nob3duJztcblx0XHRcdH1cblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9XG5cdH0pO1xuXG59ICkoIGpRdWVyeSApOyIsIihmdW5jdGlvbigkKXtcblx0ZnVuY3Rpb24gZ3RhZ19yZXBvcnRfY29udmVyc2lvbih1cmwpIHtcblx0XHR2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG5cdFx0ICBpZiAodHlwZW9mKHVybCkgIT0gJ3VuZGVmaW5lZCcpIHtcblx0XHQgICAgd2luZG93LmxvY2F0aW9uID0gdXJsO1xuXHRcdCAgfVxuXHRcdH07XG5cdFx0Z3RhZygnZXZlbnQnLCAnY29udmVyc2lvbicsIHtcblx0XHQgICdzZW5kX3RvJzogJ0FXLTk3NjYyMDE3NS9qcUN5Q0w3YXRYa1FqNVhZMFFNJyxcblx0XHQgICdldmVudF9jYWxsYmFjayc6IGNhbGxiYWNrXG5cdFx0fSk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0alF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmNvbnRlbnRzKCkuZmlsdGVyKGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuICh0aGlzLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSAmJiB0aGlzLm5vZGVWYWx1ZS50cmltKCkgIT09IFwiXCIpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggYWN0aW9uICkge1xuXHRcdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0XHRyZXR1cm4gbWFya3VwO1xuXHR9XG5cblx0ZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHRcdHZhciBmb3JtICAgICAgICAgICAgICAgPSAkKCcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJyk7XG5cdFx0dmFyIHJlc3Rfcm9vdCAgICAgICAgICA9IHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Quc2l0ZV91cmwgKyB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnJlc3RfbmFtZXNwYWNlO1xuXHRcdHZhciBmdWxsX3VybCAgICAgICAgICAgPSByZXN0X3Jvb3QgKyAnLycgKyAndXBkYXRlLXVzZXIvJztcblx0XHR2YXIgY29uZmlybUNoYW5nZSAgICAgID0gJyc7XG5cdFx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdFx0dmFyIG5ld1ByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHRcdHZhciBvbGRQcmltYXJ5RW1haWwgICAgPSAnJztcblx0XHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdFx0dmFyIGVtYWlsVG9SZW1vdmUgICAgICA9ICcnO1xuXHRcdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0XHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdFx0dmFyIGFqYXhfZm9ybV9kYXRhICAgICA9ICcnO1xuXHRcdHZhciB0aGF0ICAgICAgICAgICAgICAgPSAnJztcblx0XHRpZiAoICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoID4gMCApIHtcblx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdC8vIGlmIGEgdXNlciBzZWxlY3RzIGEgbmV3IHByaW1hcnksIG1vdmUgaXQgaW50byB0aGF0IHBvc2l0aW9uXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XG5cdFx0XHRcdG5ld1ByaW1hcnlFbWFpbCA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdFx0cHJpbWFyeUlkICAgICAgID0gJCggdGhpcyApLnByb3AoICdpZCcgKS5yZXBsYWNlKCAncHJpbWFyeV9lbWFpbF8nLCAnJyApO1xuXHRcdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncHJpbWFyeS1jaGFuZ2UnICk7XG5cblx0XHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyXG5cdFx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdFx0Ly8kKCB0aGlzICkucGFyZW50KCkuYWZ0ZXIoIGNvbmZpcm1DaGFuZ2UgKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBmb3JtIHZhbHVlcyB0byB0aGUgb2xkIHByaW1hcnkgZW1haWxcblx0XHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdFx0JCggJyNyZW1vdmVfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdFx0Ly8gY2hhbmdlIHRoZSB1c2VyIGZhY2luZyB2YWx1ZXNcblx0XHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdFx0JCggJyN1c2VyLWVtYWlsLScgKyBwcmltYXJ5SWQgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0XHQvLyBjaGFuZ2UgdGhlIG1haW4gaGlkZGVuIGZvcm0gdmFsdWVcblx0XHRcdFx0XHQkKCAnI2VtYWlsJyApLnZhbCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdFx0Ly8gc3VibWl0IGZvcm0gdmFsdWVzLlxuXHRcdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NoYW5nZScsICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRlbWFpbFRvUmVtb3ZlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcblx0XHRcdFx0XHRpZiAoICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSAhPT0gZW1haWxUb1JlbW92ZSApIHtcblx0XHRcdFx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscy5wdXNoKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcblx0XHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cdFx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHRcdCQoJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcpLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0JCgnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJykuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvblwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRcdG5leHRFbWFpbENvdW50Kys7XG5cdFx0fSk7XG5cblx0XHQkKCBmb3JtICkub24oICdzdWJtaXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4X2Zvcm1fZGF0YSA9IGFqYXhfZm9ybV9kYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dXJsOiBmdWxsX3VybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcblx0XHRcdCAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0ICAgIH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhfZm9ybV9kYXRhXG5cdFx0XHR9KS5kb25lKCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQodGhpcykudmFsKCk7XG5cdFx0XHRcdH0pLmdldCgpO1xuXHRcdFx0XHQkLmVhY2goIG5ld0VtYWlscywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9IG5leHRFbWFpbENvdW50ICsgaW5kZXg7XG5cdFx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5hcHBlbmQoICc8bGk+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtcmVtb3ZlLWVtYWlsXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJyZW1vdmVfZW1haWxbJyArIG5leHRFbWFpbENvdW50ICsgJ11cIiBpZD1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPlJlbW92ZTwvc21hbGw+PC9sYWJlbD48L2xpPjwvdWw+PC9saT4nICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFx0aWYgKCAkKCcubS1mb3JtLWVtYWlsJykubGVuZ3RoID4gMCApIHtcblx0XHRcdG1hbmFnZUVtYWlscygpO1xuXHRcdH1cblx0XHRpZiAoICQoJy5tLWZvcm0tbmV3c2xldHRlci1zaG9ydGNvZGUnKS5sZW5ndGggPiAwICkge1xuXHRcdFx0JCgnLm0tZm9ybS1uZXdzbGV0dGVyLXNob3J0Y29kZSBmaWVsZHNldCcpLmJlZm9yZSgnPGRpdiBjbGFzcz1cIm0taG9sZC1tZXNzYWdlXCI+PC9kaXY+Jyk7XG5cdFx0XHQkKCcubS1mb3JtLW5ld3NsZXR0ZXItc2hvcnRjb2RlIGZvcm0nKS5zdWJtaXQoZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGZvcm0gc3VibWl0LlxuXHRcdFx0XHR2YXIgYnV0dG9uID0gJCgnYnV0dG9uJywgdGhpcyk7XG5cdFx0XHRcdGJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXHRcdFx0XHRidXR0b24udGV4dCgnUHJvY2Vzc2luZycpO1xuXHRcdFx0XHQvLyBzZXJpYWxpemUgdGhlIGZvcm0gZGF0YVxuXHRcdFx0XHR2YXIgYWpheF9mb3JtX2RhdGEgPSAkKHRoaXMpLnNlcmlhbGl6ZSgpO1xuXHRcdFx0XHQvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRcdGFqYXhfZm9ybV9kYXRhID0gYWpheF9mb3JtX2RhdGEgKyAnJmFqYXhyZXF1ZXN0PXRydWUmc3Vic2NyaWJlJztcblx0XHRcdFx0JC5hamF4KHtcblx0XHRcdFx0XHR1cmw6IHBhcmFtcy5hamF4dXJsLCAvLyBkb21haW4vd3AtYWRtaW4vYWRtaW4tYWpheC5waHBcblx0XHRcdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRcdFx0ZGF0YVR5cGUgOiAnanNvbicsXG5cdFx0XHRcdFx0ZGF0YTogYWpheF9mb3JtX2RhdGFcblx0XHRcdFx0fSlcblx0XHRcdFx0LmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHsgLy8gcmVzcG9uc2UgZnJvbSB0aGUgUEhQIGFjdGlvblxuXHRcdFx0XHRcdHZhciBtZXNzYWdlID0gJyc7XG5cdFx0XHRcdFx0aWYgKCByZXNwb25zZS5zdWNjZXNzID09PSB0cnVlICkge1xuXHRcdFx0XHRcdFx0JCgnZmllbGRzZXQnLCB0aGF0KS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRidXR0b24udGV4dCgnVGhhbmtzJyk7XG5cdFx0XHRcdFx0XHR2YXIgYW5hbHl0aWNzX2FjdGlvbiA9ICdTaWdudXAnO1xuXHRcdFx0XHRcdFx0c3dpdGNoIChyZXNwb25zZS5kYXRhLnVzZXJfc3RhdHVzKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ2V4aXN0aW5nJzpcblx0XHRcdFx0XHRcdFx0XHRhbmFseXRpY3NfYWN0aW9uID0gJ1VwZGF0ZSc7XG5cdFx0XHRcdFx0XHRcdFx0bWVzc2FnZSA9ICdUaGFua3MgZm9yIHVwZGF0aW5nIHlvdXIgZW1haWwgcHJlZmVyZW5jZXMuIFRoZXkgd2lsbCBnbyBpbnRvIGVmZmVjdCBpbW1lZGlhdGVseS4nO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRjYXNlICduZXcnOlxuXHRcdFx0XHRcdFx0XHRcdGFuYWx5dGljc19hY3Rpb24gPSAnU2lnbnVwJztcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlID0gJ1dlIGhhdmUgYWRkZWQgeW91IHRvIHRoZSBNaW5uUG9zdCBtYWlsaW5nIGxpc3QuJztcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSAncGVuZGluZyc6XG5cdFx0XHRcdFx0XHRcdFx0YW5hbHl0aWNzX2FjdGlvbiA9ICdTaWdudXAnO1xuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2UgPSAnV2UgaGF2ZSBhZGRlZCB5b3UgdG8gdGhlIE1pbm5Qb3N0IG1haWxpbmcgbGlzdC4gWW91IHdpbGwgbmVlZCB0byBjbGljayB0aGUgY29uZmlybWF0aW9uIGxpbmsgaW4gdGhlIGVtYWlsIHdlIHNlbnQgdG8gYmVnaW4gcmVjZWl2aW5nIG1lc3NhZ2VzLic7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIHJlc3BvbnNlLmRhdGEuY29uZmlybV9tZXNzYWdlICE9PSAnJyApIHtcblx0XHRcdFx0XHRcdFx0bWVzc2FnZSA9IHJlc3BvbnNlLmRhdGEuY29uZmlybV9tZXNzYWdlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgbXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50ICkge1xuXHRcdFx0XHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdOZXdzbGV0dGVyJywgYW5hbHl0aWNzX2FjdGlvbiwgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdFx0XHRcdFx0Z3RhZ19yZXBvcnRfY29udmVyc2lvbiggbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdFx0XHRcdFx0YnV0dG9uLnRleHQoJ1N1YnNjcmliZScpO1xuXHRcdFx0XHRcdFx0aWYgKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgbXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50ICkge1xuXHRcdFx0XHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdOZXdzbGV0dGVyJywgJ0ZhaWwnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkKCcubS1ob2xkLW1lc3NhZ2UnKS5odG1sKCc8ZGl2IGNsYXNzPVwibS1mb3JtLW1lc3NhZ2UgbS1mb3JtLW1lc3NhZ2UtaW5mb1wiPicgKyBtZXNzYWdlICsgJzwvZGl2PicpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuZmFpbChmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRcdCQoJy5tLWhvbGQtbWVzc2FnZScpLmh0bWwoJzxkaXYgY2xhc3M9XCJtLWZvcm0tbWVzc2FnZSBtLWZvcm0tbWVzc2FnZS1pbmZvXCI+QW4gZXJyb3IgaGFzIG9jY3VyZWQuIFBsZWFzZSB0cnkgYWdhaW4uPC9kaXY+Jyk7XG5cdFx0XHRcdFx0YnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdFx0XHRcdGJ1dHRvbi50ZXh0KCdTdWJzY3JpYmUnKTtcblx0XHRcdFx0XHRpZiAoICdmdW5jdGlvbicgPT09IHR5cGVvZiBtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQgKSB7XG5cdFx0XHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdOZXdzbGV0dGVyJywgJ0ZhaWwnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdFx0LmFsd2F5cyhmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRldmVudC50YXJnZXQucmVzZXQoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufSkoalF1ZXJ5KTtcbiIsIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIEhhbmRsZXMgdG9nZ2xpbmcgdGhlIG5hdmlnYXRpb24gbWVudSBmb3Igc21hbGwgc2NyZWVucyBhbmQgZW5hYmxlcyBUQUIga2V5XG4gKiBuYXZpZ2F0aW9uIHN1cHBvcnQgZm9yIGRyb3Bkb3duIG1lbnVzLlxuICovXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXHR2YXIgY29udGFpbmVyLCBidXR0b24sIG1lbnUsIGxpbmtzLCBpLCBsZW47XG5cblx0Y29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICduYXZpZ2F0aW9uLXByaW1hcnknICk7XG5cdGlmICggISBjb250YWluZXIgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0YnV0dG9uID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYnV0dG9uJyApWzBdO1xuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgYnV0dG9uICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1lbnUgPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICd1bCcgKVswXTtcblxuXHQvLyBIaWRlIG1lbnUgdG9nZ2xlIGJ1dHRvbiBpZiBtZW51IGlzIGVtcHR5IGFuZCByZXR1cm4gZWFybHkuXG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBtZW51ICkge1xuXHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0aWYgKCAtMSA9PT0gbWVudS5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cdFx0bWVudS5jbGFzc05hbWUgKz0gJyBtZW51Jztcblx0fVxuXG5cdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCAtMSAhPT0gY29udGFpbmVyLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZCcgKSApIHtcblx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgPSBjb250YWluZXIuY2xhc3NOYW1lLnJlcGxhY2UoICcgdG9nZ2xlZCcsICcnICk7XG5cdFx0XHRidXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSArPSAnIHRvZ2dsZWQnO1xuXHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyApO1xuXHRcdH1cblx0fTtcblxuXHQvLyBHZXQgYWxsIHRoZSBsaW5rIGVsZW1lbnRzIHdpdGhpbiB0aGUgbWVudS5cblx0bGlua3MgICAgPSBtZW51LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYScgKTtcblxuXHQvLyBFYWNoIHRpbWUgYSBtZW51IGxpbmsgaXMgZm9jdXNlZCBvciBibHVycmVkLCB0b2dnbGUgZm9jdXMuXG5cdGZvciAoIGkgPSAwLCBsZW4gPSBsaW5rcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCAnZm9jdXMnLCB0b2dnbGVGb2N1cywgdHJ1ZSApO1xuXHRcdGxpbmtzW2ldLmFkZEV2ZW50TGlzdGVuZXIoICdibHVyJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIG9yIHJlbW92ZXMgLmZvY3VzIGNsYXNzIG9uIGFuIGVsZW1lbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVGb2N1cygpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHQvLyBNb3ZlIHVwIHRocm91Z2ggdGhlIGFuY2VzdG9ycyBvZiB0aGUgY3VycmVudCBsaW5rIHVudGlsIHdlIGhpdCAubmF2LW1lbnUuXG5cdFx0d2hpbGUgKCAtMSA9PT0gc2VsZi5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cblx0XHRcdC8vIE9uIGxpIGVsZW1lbnRzIHRvZ2dsZSB0aGUgY2xhc3MgLmZvY3VzLlxuXHRcdFx0aWYgKCAnbGknID09PSBzZWxmLnRhZ05hbWUudG9Mb3dlckNhc2UoKSApIHtcblx0XHRcdFx0aWYgKCAtMSAhPT0gc2VsZi5jbGFzc05hbWUuaW5kZXhPZiggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRcdHNlbGYuY2xhc3NOYW1lID0gc2VsZi5jbGFzc05hbWUucmVwbGFjZSggJyBmb2N1cycsICcnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VsZi5jbGFzc05hbWUgKz0gJyBmb2N1cyc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0c2VsZiA9IHNlbGYucGFyZW50RWxlbWVudDtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyBgZm9jdXNgIGNsYXNzIHRvIGFsbG93IHN1Ym1lbnUgYWNjZXNzIG9uIHRhYmxldHMuXG5cdCAqL1xuXHQoIGZ1bmN0aW9uKCBjb250YWluZXIgKSB7XG5cdFx0dmFyIHRvdWNoU3RhcnRGbiwgaSxcblx0XHRcdHBhcmVudExpbmsgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCggJy5tZW51LWl0ZW0taGFzLWNoaWxkcmVuID4gYSwgLnBhZ2VfaXRlbV9oYXNfY2hpbGRyZW4gPiBhJyApO1xuXG5cdFx0aWYgKCAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgKSB7XG5cdFx0XHR0b3VjaFN0YXJ0Rm4gPSBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0dmFyIG1lbnVJdGVtID0gdGhpcy5wYXJlbnROb2RlLCBpO1xuXG5cdFx0XHRcdGlmICggISBtZW51SXRlbS5jbGFzc0xpc3QuY29udGFpbnMoICdmb2N1cycgKSApIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0Zm9yICggaSA9IDA7IGkgPCBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuLmxlbmd0aDsgKytpICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtZW51SXRlbSA9PT0gbWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbltpXSApIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LmFkZCggJ2ZvY3VzJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1lbnVJdGVtLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBwYXJlbnRMaW5rLmxlbmd0aDsgKytpICkge1xuXHRcdFx0XHRwYXJlbnRMaW5rW2ldLmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hTdGFydEZuLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSggY29udGFpbmVyICkgKTtcbn0pO1xuXG4vLyB1c2VyIGFjY291bnQgbmF2aWdhdGlvbiBjYW4gYmUgYSBkcm9wZG93blxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0Ly8gaGlkZSBtZW51XG5cdGlmICgkKCcjdXNlci1hY2NvdW50LWFjY2VzcyB1bCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0JCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgPiBsaSA+IGEnKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdCQoJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJykudG9nZ2xlQ2xhc3MoICd2aXNpYmxlJyApO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9KTtcblx0fVxuXG59KTtcbiJdfQ==
