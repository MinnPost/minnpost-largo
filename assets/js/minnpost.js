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
          console.log('value is ' + consolidatedEmails.join(','));
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
    $('input[type=submit]').click(function (e) {
      var button = $(this);
      var button_form = button.closest('form');
      button_form.data('submitting_button', button.val());
    });
    $('.m-entry-content').on('submit', '#account-settings-form', function (event) {
      var form = $(this);
      var submitting_button = form.data('submitting_button') || ''; // if there is no submitting button, pass it by Ajax

      if ('' === submitting_button || 'Save Changes' !== submitting_button) {
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
            $('.m-user-email-list').append('<li id="user-email-' + nextEmailCount + '">' + value + '<ul class="a-form-caption a-user-email-actions"><li class="a-form-caption a-pre-confirm a-make-primary-email"><input type="radio" name="primary_email" id="primary_email_' + nextEmailCount + '" value="' + value + '"><label for="primary_email_' + nextEmailCount + '"><small>Make Primary</small></label></li><li class="a-form-caption a-pre-confirm a-email-preferences"><a href="/subscribe/?email=' + encodeURIComponent(value) + '"><small>Email Preferences</small></a></li><li class="a-form-caption a-pre-confirm a-remove-email"><input type="checkbox" name="remove_email[' + nextEmailCount + ']" id="remove_email_' + nextEmailCount + '" value="' + value + '"><label for="remove_email_' + nextEmailCount + '"><small>Remove</small></label></li></ul></li>');
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
      }
    });
  }

  jQuery(document).ready(function ($) {
    "use strict";

    if ($('.m-form-email').length > 0) {
      manageEmails();
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
  setupNavSearch('navigation-primary');

  function setupNavSearch(container) {
    var navsearchcontainer, navsearchtoggle, navsearchform;
    container = document.getElementById(container);

    if (!container) {
      return;
    }

    navsearchcontainer = $('li.search', $(container));
    navsearchtoggle = $('li.search a', $(container));
    navsearchform = container.getElementsByTagName('form')[0];

    if ('undefined' === typeof navsearchtoggle || 'undefined' === typeof navsearchform) {
      return;
    }

    if ($(navsearchform).length > 0) {
      $(document).click(function (event) {
        var $target = $(event.target);

        if (!$target.closest(navsearchcontainer).length && $(navsearchform).is(':visible')) {
          navsearchform.className = navsearchform.className.replace(' toggled-form', '');
          $(navsearchtoggle).prop('aria-expanded', false);
          $(navsearchtoggle).removeClass('toggled-form');
        }
      });
      $(navsearchtoggle).on('click', function (event) {
        event.preventDefault();

        if (-1 !== navsearchform.className.indexOf('toggled-form')) {
          navsearchform.className = navsearchform.className.replace(' toggled-form', '');
          $(navsearchtoggle).prop('aria-expanded', false);
          $(navsearchtoggle).removeClass('toggled-form');
        } else {
          navsearchform.className += ' toggled-form';
          $(navsearchtoggle).prop('aria-expanded', true);
          $(navsearchtoggle).addClass('toggled-form');
        }
      });
    }
  }

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuYWx5dGljcy5qcyIsImZvcm1zLmpzIiwibmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6WyJtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsInZhbHVlIiwiZ2EiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiJCIsImNsaWNrIiwiZSIsInRyaW0iLCJocmVmIiwid2lkZ2V0X3RpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJkb2N1bWVudCIsInJlYWR5IiwiUFVNIiwiY3VycmVudF9wb3B1cCIsImdldFBvcHVwIiwic2V0dGluZ3MiLCJnZXRTZXR0aW5ncyIsInBvcHVwX2lkIiwiaWQiLCJvbiIsImNsb3NlX3RyaWdnZXIiLCJmbiIsInBvcG1ha2UiLCJsYXN0X2Nsb3NlX3RyaWdnZXIiLCJ1cmwiLCJhdHRyIiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJ0ZXh0Tm9kZXMiLCJjb250ZW50cyIsImZpbHRlciIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSIsIm5vZGVWYWx1ZSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJmb3JtIiwicmVzdF9yb290IiwidXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdCIsInNpdGVfdXJsIiwicmVzdF9uYW1lc3BhY2UiLCJmdWxsX3VybCIsImNvbmZpcm1DaGFuZ2UiLCJuZXh0RW1haWxDb3VudCIsIm5ld1ByaW1hcnlFbWFpbCIsIm9sZFByaW1hcnlFbWFpbCIsInByaW1hcnlJZCIsImVtYWlsVG9SZW1vdmUiLCJjb25zb2xpZGF0ZWRFbWFpbHMiLCJuZXdFbWFpbHMiLCJhamF4X2Zvcm1fZGF0YSIsInRoYXQiLCJwcm9wIiwibGVuZ3RoIiwiZXZlbnQiLCJ2YWwiLCJyZXBsYWNlIiwicGFyZW50IiwiaGlkZSIsInNob3ciLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiYXBwZW5kIiwicHJldmVudERlZmF1bHQiLCJmaXJzdCIsInJlcGxhY2VXaXRoIiwic3VibWl0IiwicmVtb3ZlIiwiZWFjaCIsImluZGV4IiwiZ2V0IiwicHVzaCIsInBhcmVudHMiLCJmYWRlT3V0Iiwiam9pbiIsImNvbnNvbGUiLCJsb2ciLCJiZWZvcmUiLCJidXR0b24iLCJidXR0b25fZm9ybSIsImRhdGEiLCJzdWJtaXR0aW5nX2J1dHRvbiIsInNlcmlhbGl6ZSIsImFqYXgiLCJiZWZvcmVTZW5kIiwieGhyIiwic2V0UmVxdWVzdEhlYWRlciIsIm5vbmNlIiwiZGF0YVR5cGUiLCJkb25lIiwibWFwIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicmVsb2FkIiwic2V0dXBNZW51Iiwic2V0dXBOYXZTZWFyY2giLCJjb250YWluZXIiLCJuYXZzZWFyY2hjb250YWluZXIiLCJuYXZzZWFyY2h0b2dnbGUiLCJuYXZzZWFyY2hmb3JtIiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsIiR0YXJnZXQiLCJ0YXJnZXQiLCJpcyIsImNsYXNzTmFtZSIsImluZGV4T2YiLCJtZW51IiwibGlua3MiLCJpIiwibGVuIiwic3R5bGUiLCJkaXNwbGF5Iiwic2V0QXR0cmlidXRlIiwib25jbGljayIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0b2dnbGVGb2N1cyIsInRvdWNoU3RhcnRGbiIsInBhcmVudExpbmsiLCJxdWVyeVNlbGVjdG9yQWxsIiwid2luZG93IiwibWVudUl0ZW0iLCJwYXJlbnROb2RlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJjaGlsZHJlbiIsImFkZCIsInNlbGYiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJwYXJlbnRFbGVtZW50IiwidG9nZ2xlQ2xhc3MiXSwibWFwcGluZ3MiOiI7O0FB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Q0FBWixFQUFnRDtBQUMvQ3FCLFVBQUFBLElBQUksQ0FBQ3RCLFNBQUwsR0FBaUJzQixJQUFJLENBQUN0QixTQUFMLENBQWVoRCxPQUFmLENBQXdCLFFBQXhCLEVBQWtDLEVBQWxDLENBQWpCO0FBQ0EsU0FGRCxNQUVPO0FBQ05zRSxVQUFBQSxJQUFJLENBQUN0QixTQUFMLElBQWtCLFFBQWxCO0FBQ0E7QUFDRDs7QUFFRHNCLE1BQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDRyxhQUFaO0FBQ0E7QUFDRDtBQUVELENBbkpELEUsQ0FxSkE7O0FBQ0F4SSxNQUFNLENBQUVhLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVVYsQ0FBVixFQUFjO0FBQ3ZDO0FBQ0EsTUFBSUEsQ0FBQyxDQUFDLHlCQUFELENBQUQsQ0FBNkJ3RCxNQUE3QixHQUFzQyxDQUExQyxFQUE4QztBQUM3Q3hELElBQUFBLENBQUMsQ0FBQywrQkFBRCxDQUFELENBQW1Da0IsRUFBbkMsQ0FBdUMsT0FBdkMsRUFBZ0QsVUFBU3VDLEtBQVQsRUFBZ0I7QUFDL0R6RCxNQUFBQSxDQUFDLENBQUMseUJBQUQsQ0FBRCxDQUE2QnFJLFdBQTdCLENBQTBDLFNBQTFDO0FBQ0E1RSxNQUFBQSxLQUFLLENBQUNTLGNBQU47QUFDQSxLQUhEO0FBSUE7QUFFRCxDQVREIiwiZmlsZSI6Im1pbm5wb3N0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gbXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKSB7XG5cdGlmICggdHlwZW9mIGdhICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICkge1xuXG5cdC8vIGlmIGEgbm90IGxvZ2dlZCBpbiB1c2VyIHRyaWVzIHRvIGVtYWlsLCBkb24ndCBjb3VudCB0aGF0IGFzIGEgc2hhcmVcblx0aWYgKCAhIGpRdWVyeSggJ2JvZHkgJykuaGFzQ2xhc3MoICdsb2dnZWQtaW4nKSAmJiAnRW1haWwnID09PSB0ZXh0ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIHRyYWNrIGFzIGFuIGV2ZW50LCBhbmQgYXMgc29jaWFsIGlmIGl0IGlzIHR3aXR0ZXIgb3IgZmJcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2hhcmUgLSAnICsgcG9zaXRpb24sIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgfHwgJ1R3aXR0ZXInID09PSB0ZXh0ICkge1xuXHRcdFx0aWYgKCB0ZXh0ID09ICdGYWNlYm9vaycgKSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnU2hhcmUnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdUd2VldCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG4oIGZ1bmN0aW9uKCAkICkge1xuXG5cdCQgKCAnLm0tZW50cnktc2hhcmUtdG9wIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdHZhciB0ZXh0ID0gJCggdGhpcyApLnRleHQoKS50cmltKCk7XG5cdFx0dmFyIHBvc2l0aW9uID0gJ3RvcCc7XG5cdFx0dHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcblx0fSk7XG5cblx0JCAoICcubS1lbnRyeS1zaGFyZS1ib3R0b20gYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpLnRyaW0oKTtcblx0XHR2YXIgcG9zaXRpb24gPSAnYm90dG9tJztcblx0XHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xuXHR9KTtcblxuXHQkKCAnI25hdmlnYXRpb24tZmVhdHVyZWQgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnRmVhdHVyZWQgQmFyIExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcblx0fSk7XG5cdCQoICdhLmdsZWFuLXNpZGViYXInICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1NpZGViYXIgU3VwcG9ydCBMaW5rJywgJ0NsaWNrJywgdGhpcy5ocmVmICk7XG5cdH0pO1xuXG5cdCQoICdhJywgJCggJy5vLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgd2lkZ2V0X3RpdGxlID0gJCh0aGlzKS5jbG9zZXN0KCcubS13aWRnZXQnKS5maW5kKCdoMycpLnRleHQoKTtcblx0XHR2YXIgc2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gJyc7XG5cdFx0aWYgKHdpZGdldF90aXRsZSA9PT0gJycpIHtcblx0XHRcdC8vc2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gJCh0aGlzKS5jbG9zZXN0KCcubm9kZS10eXBlLXNwaWxsJykuZmluZCgnLm5vZGUtdGl0bGUgYScpLnRleHQoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gd2lkZ2V0X3RpdGxlO1xuXHRcdH1cblx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJfc2VjdGlvbl90aXRsZSk7XG5cdH0pO1xuXG5cdCQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uICggZSApIHtcblxuXHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBQVU0gKSB7XG5cdFx0XHR2YXIgY3VycmVudF9wb3B1cCA9IFBVTS5nZXRQb3B1cCggJCggJy5wdW0nICkgKTtcblx0XHRcdHZhciBzZXR0aW5ncyA9IFBVTS5nZXRTZXR0aW5ncyggJCggJy5wdW0nICkgKTtcblx0XHRcdHZhciBwb3B1cF9pZCA9IHNldHRpbmdzLmlkO1xuXHRcdFx0JCggZG9jdW1lbnQgKS5vbigncHVtQWZ0ZXJPcGVuJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdTaG93JywgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9ICk7XG5cdFx0XHR9KTtcblx0XHRcdCQoIGRvY3VtZW50ICkub24oJ3B1bUFmdGVyQ2xvc2UnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJC5mbi5wb3BtYWtlLmxhc3RfY2xvc2VfdHJpZ2dlcjtcblx0XHRcdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGNsb3NlX3RyaWdnZXIgKSB7XG5cdFx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCBjbG9zZV90cmlnZ2VyLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLm1lc3NhZ2UtY2xvc2UnICkuY2xpY2soZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIGxpbmsgd2l0aCBjbG9zZSBjbGFzc1xuXHRcdFx0XHR2YXIgY2xvc2VfdHJpZ2dlciA9ICdDbG9zZSBCdXR0b24nO1xuXHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSApO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLm1lc3NhZ2UtbG9naW4nICkuY2xpY2soZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIGxpbmsgd2l0aCBsb2dpbiBjbGFzc1xuXHRcdFx0XHR2YXIgdXJsID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ0xvZ2luIExpbmsnLCB1cmwgKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5wdW0tY29udGVudCBhOm5vdCggLm1lc3NhZ2UtY2xvc2UsIC5wdW0tY2xvc2UsIC5tZXNzYWdlLWxvZ2luICknICkuY2xpY2soIGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBzb21ldGhpbmcgdGhhdCBpcyBub3QgY2xvc2UgdGV4dCBvciBjbG9zZSBpY29uXG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ0NsaWNrJywgcG9wdXBfaWQgKTtcbiAgICAgICAgICAgIH0pO1xuXHRcdH1cblxuXHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEgJiYgJycgIT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS51cmxfYWNjZXNzX2xldmVsICkge1xuXHRcdFx0dmFyIHR5cGUgPSAnZXZlbnQnO1xuXHRcdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHRcdHZhciBsYWJlbCA9IGxvY2F0aW9uLnBhdGhuYW1lOyAvLyBpIHRoaW5rIHdlIGNvdWxkIHBvc3NpYmx5IHB1dCBzb21lIGdyb3VwaW5nIGhlcmUsIGJ1dCB3ZSBkb24ndCBuZWNlc3NhcmlseSBoYXZlIGFjY2VzcyB0byBvbmUgYW5kIG1heWJlIGl0J3Mgbm90IHdvcnRod2hpbGUgeWV0XG5cdFx0XHR2YXIgYWN0aW9uID0gJ0Jsb2NrZWQnO1xuXHRcdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRcdGFjdGlvbiA9ICdTaG93bic7XG5cdFx0XHR9XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdFx0fVxuXHR9KTtcblxufSApKCBqUXVlcnkgKTsiLCIoZnVuY3Rpb24oJCl7XG5cdGpRdWVyeS5mbi50ZXh0Tm9kZXMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlcihmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiAodGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgdGhpcy5ub2RlVmFsdWUudHJpbSgpICE9PSBcIlwiKTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoIGFjdGlvbiApIHtcblx0XHR2YXIgbWFya3VwID0gJzxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtZm9ybS1jb25maXJtXCI+PGxhYmVsPkFyZSB5b3Ugc3VyZT8gPGEgaWQ9XCJhLWNvbmZpcm0tJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPlllczwvYT4gfCA8YSBpZD1cImEtc3RvcC0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+Tm88L2E+PC9sYWJlbD48L2xpPic7XG5cdFx0cmV0dXJuIG1hcmt1cDtcblx0fVxuXG5cdGZ1bmN0aW9uIG1hbmFnZUVtYWlscygpIHtcblx0XHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCgnI2FjY291bnQtc2V0dGluZ3MtZm9ybScpO1xuXHRcdHZhciByZXN0X3Jvb3QgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0XHR2YXIgZnVsbF91cmwgICAgICAgICAgID0gcmVzdF9yb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdFx0dmFyIGNvbmZpcm1DaGFuZ2UgICAgICA9ICcnO1xuXHRcdHZhciBuZXh0RW1haWxDb3VudCAgICAgPSAxO1xuXHRcdHZhciBuZXdQcmltYXJ5RW1haWwgICAgPSAnJztcblx0XHR2YXIgb2xkUHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdFx0dmFyIHByaW1hcnlJZCAgICAgICAgICA9ICcnO1xuXHRcdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0XHR2YXIgY29uc29saWRhdGVkRW1haWxzID0gW107XG5cdFx0dmFyIG5ld0VtYWlscyAgICAgICAgICA9IFtdO1xuXHRcdHZhciBhamF4X2Zvcm1fZGF0YSAgICAgPSAnJztcblx0XHR2YXIgdGhhdCAgICAgICAgICAgICAgID0gJyc7XG5cdFx0Ly8gc3RhcnQgb3V0IHdpdGggbm8gcHJpbWFyeS9yZW1vdmFscyBjaGVja2VkXG5cdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHQvLyBpZiB0aGVyZSBpcyBhIGxpc3Qgb2YgZW1haWxzIChub3QganVzdCBhIHNpbmdsZSBmb3JtIGZpZWxkKVxuXHRcdGlmICggJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0Ly8gaWYgYSB1c2VyIHNlbGVjdHMgYSBuZXcgcHJpbWFyeSwgbW92ZSBpdCBpbnRvIHRoYXQgcG9zaXRpb25cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcblx0XHRcdFx0bmV3UHJpbWFyeUVtYWlsID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRvbGRQcmltYXJ5RW1haWwgPSAkKCAnI2VtYWlsJyApLnZhbCgpO1xuXHRcdFx0XHRwcmltYXJ5SWQgICAgICAgPSAkKCB0aGlzICkucHJvcCggJ2lkJyApLnJlcGxhY2UoICdwcmltYXJ5X2VtYWlsXycsICcnICk7XG5cdFx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdwcmltYXJ5LWNoYW5nZScgKTtcblxuXHRcdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcblx0XHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBuZXdQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0XHQkKCAnI3VzZXItZW1haWwtJyArIHByaW1hcnlJZCApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHRcdC8vIGNoYW5nZSB0aGUgbWFpbiBoaWRkZW4gZm9ybSB2YWx1ZVxuXHRcdFx0XHRcdCQoICcjZW1haWwnICkudmFsKCBuZXdQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0XHQvLyBzdWJtaXQgZm9ybSB2YWx1ZXMuXG5cdFx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0XHQvLyB1bmNoZWNrIHRoZSByYWRpbyBidXR0b25cblx0XHRcdFx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBmb3JtIHZhbHVlcyB0byB0aGUgb2xkIHByaW1hcnkgZW1haWxcblx0XHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdFx0JCggJyNyZW1vdmVfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdFx0Ly8gcmVtb3ZlIHRoZSBjb25maXJtIG1lc3NhZ2Vcblx0XHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gaWYgYSB1c2VyIHJlbW92ZXMgYW4gZW1haWwsIHRha2UgaXQgYXdheSBmcm9tIHRoZSB2aXN1YWwgYW5kIGZyb20gdGhlIGZvcm1cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjaGFuZ2UnLCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZW1haWxUb1JlbW92ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3JlbW92YWwnICk7XG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgIT09IGVtYWlsVG9SZW1vdmUgKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xpZGF0ZWRFbWFpbHMucHVzaCggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyIGZvciByZW1vdmFsXG5cdFx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0XHQvLyBpZiBjb25maXJtZWQsIHJlbW92ZSB0aGUgZW1haWwgYW5kIHN1Ym1pdCB0aGUgZm9ybVxuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5mYWRlT3V0KCAnbm9ybWFsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkKCB0aGlzICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCAndmFsdWUgaXMgJyArIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIGlmIGEgdXNlciB3YW50cyB0byBhZGQgYW4gZW1haWwsIGdpdmUgdGhlbSBhIHByb3Blcmx5IG51bWJlcmVkIGZpZWxkXG5cdFx0JCggJy5tLWZvcm0tZW1haWwnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0JCgnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJykuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvbiBhLWJ1dHRvbi1hZGQtdXNlci1lbWFpbFwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRcdG5leHRFbWFpbENvdW50Kys7XG5cdFx0fSk7XG5cblx0XHQkKCAnaW5wdXRbdHlwZT1zdWJtaXRdJyApLmNsaWNrKCBmdW5jdGlvbiAoIGUgKSB7XG5cdFx0XHR2YXIgYnV0dG9uID0gJCggdGhpcyApO1xuXHRcdFx0dmFyIGJ1dHRvbl9mb3JtID0gYnV0dG9uLmNsb3Nlc3QoICdmb3JtJyApO1xuXHRcdFx0YnV0dG9uX2Zvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJywgYnV0dG9uLnZhbCgpICk7XG5cdFx0fSk7XG5cblx0XHQkKCAnLm0tZW50cnktY29udGVudCcgKS5vbiggJ3N1Ym1pdCcsICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0dmFyIGZvcm0gPSAkKCB0aGlzICk7XG5cdFx0XHR2YXIgc3VibWl0dGluZ19idXR0b24gPSBmb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicgKSB8fCAnJztcblx0XHRcdC8vIGlmIHRoZXJlIGlzIG5vIHN1Ym1pdHRpbmcgYnV0dG9uLCBwYXNzIGl0IGJ5IEFqYXhcblx0XHRcdGlmICggJycgPT09IHN1Ym1pdHRpbmdfYnV0dG9uIHx8ICdTYXZlIENoYW5nZXMnICE9PSBzdWJtaXR0aW5nX2J1dHRvbiApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0YWpheF9mb3JtX2RhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRcdGFqYXhfZm9ybV9kYXRhID0gYWpheF9mb3JtX2RhdGEgKyAnJnJlc3Q9dHJ1ZSc7XG5cdFx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdFx0dXJsOiBmdWxsX3VybCxcblx0XHRcdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKCB4aHIgKSB7XG5cdFx0XHRcdCAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRcdGRhdGE6IGFqYXhfZm9ybV9kYXRhXG5cdFx0XHRcdH0pLmRvbmUoIGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0XHRcdG5ld0VtYWlscyA9ICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKS5tYXAoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICQodGhpcykudmFsKCk7XG5cdFx0XHRcdFx0fSkuZ2V0KCk7XG5cdFx0XHRcdFx0JC5lYWNoKCBuZXdFbWFpbHMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9IG5leHRFbWFpbENvdW50ICsgaW5kZXg7XG5cdFx0XHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmFwcGVuZCggJzxsaSBpZD1cInVzZXItZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPicgKyB2YWx1ZSArICc8dWwgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXVzZXItZW1haWwtYWN0aW9uc1wiPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1tYWtlLXByaW1hcnktZW1haWxcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW1hcnlfZW1haWxcIiBpZD1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+TWFrZSBQcmltYXJ5PC9zbWFsbD48L2xhYmVsPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLWVtYWlsLXByZWZlcmVuY2VzXCI+PGEgaHJlZj1cIi9zdWJzY3JpYmUvP2VtYWlsPScgKyBlbmNvZGVVUklDb21wb25lbnQoIHZhbHVlICkgKyAnXCI+PHNtYWxsPkVtYWlsIFByZWZlcmVuY2VzPC9zbWFsbD48L2E+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtcmVtb3ZlLWVtYWlsXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJyZW1vdmVfZW1haWxbJyArIG5leHRFbWFpbENvdW50ICsgJ11cIiBpZD1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPlJlbW92ZTwvc21hbGw+PC9sYWJlbD48L2xpPjwvdWw+PC9saT4nICk7XG5cdFx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggJCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoKSArICcsJyArIHZhbHVlICk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0JCggJy5tLWZvcm0tY2hhbmdlLWVtYWlsIC5hLWlucHV0LXdpdGgtYnV0dG9uJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRcdGlmICggJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRpZiAoICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKSAhPT0gJCggJ2lucHV0W25hbWU9XCJlbWFpbFwiXScgKSApIHtcblx0XHRcdFx0XHRcdFx0Ly8gaXQgd291bGQgYmUgbmljZSB0byBvbmx5IGxvYWQgdGhlIGZvcm0sIGJ1dCB0aGVuIGNsaWNrIGV2ZW50cyBzdGlsbCBkb24ndCB3b3JrXG5cdFx0XHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRqUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXHRcdFwidXNlIHN0cmljdFwiO1xuXHRcdGlmICggJCgnLm0tZm9ybS1lbWFpbCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0XHR9XG5cdH0pO1xufSkoalF1ZXJ5KTtcbiIsIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIEhhbmRsZXMgdG9nZ2xpbmcgdGhlIG5hdmlnYXRpb24gbWVudSBmb3Igc21hbGwgc2NyZWVucyBhbmQgZW5hYmxlcyBUQUIga2V5XG4gKiBuYXZpZ2F0aW9uIHN1cHBvcnQgZm9yIGRyb3Bkb3duIG1lbnVzLlxuICovXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdHNldHVwTWVudSggJ25hdmlnYXRpb24tcHJpbWFyeScgKTtcblx0c2V0dXBNZW51KCAnbmF2aWdhdGlvbi11c2VyLWFjY291bnQtbWFuYWdlbWVudCcgKTtcblx0c2V0dXBOYXZTZWFyY2goICduYXZpZ2F0aW9uLXByaW1hcnknICk7XG5cblx0ZnVuY3Rpb24gc2V0dXBOYXZTZWFyY2goIGNvbnRhaW5lciApIHtcblxuXHRcdHZhciBuYXZzZWFyY2hjb250YWluZXIsIG5hdnNlYXJjaHRvZ2dsZSwgbmF2c2VhcmNoZm9ybTtcblxuXHRcdGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBjb250YWluZXIgKTtcblx0XHRpZiAoICEgY29udGFpbmVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdG5hdnNlYXJjaGNvbnRhaW5lciA9ICQoICdsaS5zZWFyY2gnLCAkKCBjb250YWluZXIgKSApO1xuXHRcdG5hdnNlYXJjaHRvZ2dsZSAgICA9ICQoICdsaS5zZWFyY2ggYScsICQoIGNvbnRhaW5lciApICk7XG5cdFx0bmF2c2VhcmNoZm9ybSAgICAgID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnZm9ybScgKVswXTtcblxuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBuYXZzZWFyY2h0b2dnbGUgfHwgJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBuYXZzZWFyY2hmb3JtICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggJCggbmF2c2VhcmNoZm9ybSApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHQkKCBkb2N1bWVudCApLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdHZhciAkdGFyZ2V0ID0gJCggZXZlbnQudGFyZ2V0ICk7XG5cdFx0XHRcdGlmICggISAkdGFyZ2V0LmNsb3Nlc3QoIG5hdnNlYXJjaGNvbnRhaW5lciApLmxlbmd0aCAmJiAkKCBuYXZzZWFyY2hmb3JtICkuaXMoICc6dmlzaWJsZScgKSApIHtcblx0XHRcdFx0XHRuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZSA9IG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lLnJlcGxhY2UoICcgdG9nZ2xlZC1mb3JtJywgJycgKTtcblx0XHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5wcm9wKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucmVtb3ZlQ2xhc3MoICd0b2dnbGVkLWZvcm0nICk7XG5cdFx0XHRcdH0gICAgICAgIFxuXHRcdFx0fSk7XG5cdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRpZiAoIC0xICE9PSBuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZC1mb3JtJyApICkge1xuXHRcdFx0XHRcdG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lID0gbmF2c2VhcmNoZm9ybS5jbGFzc05hbWUucmVwbGFjZSggJyB0b2dnbGVkLWZvcm0nLCAnJyApO1xuXHRcdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnByb3AoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5yZW1vdmVDbGFzcyggJ3RvZ2dsZWQtZm9ybScgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZSArPSAnIHRvZ2dsZWQtZm9ybSc7XG5cdFx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucHJvcCggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XG5cdFx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkuYWRkQ2xhc3MoICd0b2dnbGVkLWZvcm0nICk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwTWVudSggY29udGFpbmVyICkge1xuXHRcdHZhciBidXR0b24sIG1lbnUsIGxpbmtzLCBpLCBsZW47XG5cdFx0Y29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGNvbnRhaW5lciApO1xuXHRcdGlmICggISBjb250YWluZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0YnV0dG9uID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYnV0dG9uJyApWzBdO1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBidXR0b24gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bWVudSA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ3VsJyApWzBdO1xuXG5cdFx0Ly8gSGlkZSBtZW51IHRvZ2dsZSBidXR0b24gaWYgbWVudSBpcyBlbXB0eSBhbmQgcmV0dXJuIGVhcmx5LlxuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBtZW51ICkge1xuXHRcdFx0YnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRcdGlmICggLTEgPT09IG1lbnUuY2xhc3NOYW1lLmluZGV4T2YoICdtZW51JyApICkge1xuXHRcdFx0bWVudS5jbGFzc05hbWUgKz0gJyBtZW51Jztcblx0XHR9XG5cblx0XHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAtMSAhPT0gY29udGFpbmVyLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZCcgKSApIHtcblx0XHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IGNvbnRhaW5lci5jbGFzc05hbWUucmVwbGFjZSggJyB0b2dnbGVkJywgJycgKTtcblx0XHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgKz0gJyB0b2dnbGVkJztcblx0XHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnICk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8vIEdldCBhbGwgdGhlIGxpbmsgZWxlbWVudHMgd2l0aGluIHRoZSBtZW51LlxuXHRcdGxpbmtzICAgID0gbWVudS5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2EnICk7XG5cblx0XHQvLyBFYWNoIHRpbWUgYSBtZW51IGxpbmsgaXMgZm9jdXNlZCBvciBibHVycmVkLCB0b2dnbGUgZm9jdXMuXG5cdFx0Zm9yICggaSA9IDAsIGxlbiA9IGxpbmtzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0bGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ2ZvY3VzJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0XHRcdGxpbmtzW2ldLmFkZEV2ZW50TGlzdGVuZXIoICdibHVyJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBUb2dnbGVzIGBmb2N1c2AgY2xhc3MgdG8gYWxsb3cgc3VibWVudSBhY2Nlc3Mgb24gdGFibGV0cy5cblx0XHQgKi9cblx0XHQoIGZ1bmN0aW9uKCBjb250YWluZXIgKSB7XG5cdFx0XHR2YXIgdG91Y2hTdGFydEZuLCBpLFxuXHRcdFx0XHRwYXJlbnRMaW5rID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoICcubWVudS1pdGVtLWhhcy1jaGlsZHJlbiA+IGEsIC5wYWdlX2l0ZW1faGFzX2NoaWxkcmVuID4gYScgKTtcblxuXHRcdFx0aWYgKCAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgKSB7XG5cdFx0XHRcdHRvdWNoU3RhcnRGbiA9IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdHZhciBtZW51SXRlbSA9IHRoaXMucGFyZW50Tm9kZSwgaTtcblxuXHRcdFx0XHRcdGlmICggISBtZW51SXRlbS5jbGFzc0xpc3QuY29udGFpbnMoICdmb2N1cycgKSApIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgbWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbi5sZW5ndGg7ICsraSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBtZW51SXRlbSA9PT0gbWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbltpXSApIHtcblx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1lbnVJdGVtLmNsYXNzTGlzdC5hZGQoICdmb2N1cycgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IHBhcmVudExpbmsubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdFx0cGFyZW50TGlua1tpXS5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIHRvdWNoU3RhcnRGbiwgZmFsc2UgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0oIGNvbnRhaW5lciApICk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyBvciByZW1vdmVzIC5mb2N1cyBjbGFzcyBvbiBhbiBlbGVtZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlRm9jdXMoKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0Ly8gTW92ZSB1cCB0aHJvdWdoIHRoZSBhbmNlc3RvcnMgb2YgdGhlIGN1cnJlbnQgbGluayB1bnRpbCB3ZSBoaXQgLm5hdi1tZW51LlxuXHRcdHdoaWxlICggLTEgPT09IHNlbGYuY2xhc3NOYW1lLmluZGV4T2YoICdtZW51JyApICkge1xuXG5cdFx0XHQvLyBPbiBsaSBlbGVtZW50cyB0b2dnbGUgdGhlIGNsYXNzIC5mb2N1cy5cblx0XHRcdGlmICggJ2xpJyA9PT0gc2VsZi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgKSB7XG5cdFx0XHRcdGlmICggLTEgIT09IHNlbGYuY2xhc3NOYW1lLmluZGV4T2YoICdmb2N1cycgKSApIHtcblx0XHRcdFx0XHRzZWxmLmNsYXNzTmFtZSA9IHNlbGYuY2xhc3NOYW1lLnJlcGxhY2UoICcgZm9jdXMnLCAnJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlbGYuY2xhc3NOYW1lICs9ICcgZm9jdXMnO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHNlbGYgPSBzZWxmLnBhcmVudEVsZW1lbnQ7XG5cdFx0fVxuXHR9XG5cbn0pO1xuXG4vLyB1c2VyIGFjY291bnQgbmF2aWdhdGlvbiBjYW4gYmUgYSBkcm9wZG93blxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0Ly8gaGlkZSBtZW51XG5cdGlmICgkKCcjdXNlci1hY2NvdW50LWFjY2VzcyB1bCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0JCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgPiBsaSA+IGEnKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdCQoJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJykudG9nZ2xlQ2xhc3MoICd2aXNpYmxlJyApO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9KTtcblx0fVxuXG59KTtcbiJdfQ==
