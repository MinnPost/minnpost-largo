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
    var navsearchtoggle, navsearchform;
    container = document.getElementById(container);

    if (!container) {
      return;
    }

    navsearchtoggle = $('li.search a', $(container));
    navsearchform = container.getElementsByTagName('form')[0];

    if ('undefined' === typeof navsearchtoggle || 'undefined' === typeof navsearchform) {
      return;
    }

    if ($(navsearchform).length > 0) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuYWx5dGljcy5qcyIsImZvcm1zLmpzIiwibmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6WyJtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsInZhbHVlIiwiZ2EiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiJCIsImNsaWNrIiwiZSIsInRyaW0iLCJocmVmIiwid2lkZ2V0X3RpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJkb2N1bWVudCIsInJlYWR5IiwiUFVNIiwiY3VycmVudF9wb3B1cCIsImdldFBvcHVwIiwic2V0dGluZ3MiLCJnZXRTZXR0aW5ncyIsInBvcHVwX2lkIiwiaWQiLCJvbiIsImNsb3NlX3RyaWdnZXIiLCJmbiIsInBvcG1ha2UiLCJsYXN0X2Nsb3NlX3RyaWdnZXIiLCJ1cmwiLCJhdHRyIiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJ0ZXh0Tm9kZXMiLCJjb250ZW50cyIsImZpbHRlciIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSIsIm5vZGVWYWx1ZSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJmb3JtIiwicmVzdF9yb290IiwidXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdCIsInNpdGVfdXJsIiwicmVzdF9uYW1lc3BhY2UiLCJmdWxsX3VybCIsImNvbmZpcm1DaGFuZ2UiLCJuZXh0RW1haWxDb3VudCIsIm5ld1ByaW1hcnlFbWFpbCIsIm9sZFByaW1hcnlFbWFpbCIsInByaW1hcnlJZCIsImVtYWlsVG9SZW1vdmUiLCJjb25zb2xpZGF0ZWRFbWFpbHMiLCJuZXdFbWFpbHMiLCJhamF4X2Zvcm1fZGF0YSIsInRoYXQiLCJwcm9wIiwibGVuZ3RoIiwiZXZlbnQiLCJ2YWwiLCJyZXBsYWNlIiwicGFyZW50IiwiaGlkZSIsInNob3ciLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiYXBwZW5kIiwicHJldmVudERlZmF1bHQiLCJmaXJzdCIsInJlcGxhY2VXaXRoIiwic3VibWl0IiwicmVtb3ZlIiwiZWFjaCIsImluZGV4IiwiZ2V0IiwicHVzaCIsInBhcmVudHMiLCJmYWRlT3V0Iiwiam9pbiIsImNvbnNvbGUiLCJsb2ciLCJiZWZvcmUiLCJidXR0b24iLCJidXR0b25fZm9ybSIsImRhdGEiLCJzdWJtaXR0aW5nX2J1dHRvbiIsInNlcmlhbGl6ZSIsImFqYXgiLCJiZWZvcmVTZW5kIiwieGhyIiwic2V0UmVxdWVzdEhlYWRlciIsIm5vbmNlIiwiZGF0YVR5cGUiLCJkb25lIiwibWFwIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicmVsb2FkIiwic2V0dXBNZW51Iiwic2V0dXBOYXZTZWFyY2giLCJjb250YWluZXIiLCJuYXZzZWFyY2h0b2dnbGUiLCJuYXZzZWFyY2hmb3JtIiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImNsYXNzTmFtZSIsImluZGV4T2YiLCJtZW51IiwibGlua3MiLCJpIiwibGVuIiwic3R5bGUiLCJkaXNwbGF5Iiwic2V0QXR0cmlidXRlIiwib25jbGljayIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0b2dnbGVGb2N1cyIsInRvdWNoU3RhcnRGbiIsInBhcmVudExpbmsiLCJxdWVyeVNlbGVjdG9yQWxsIiwid2luZG93IiwibWVudUl0ZW0iLCJwYXJlbnROb2RlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJjaGlsZHJlbiIsImFkZCIsInNlbGYiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJwYXJlbnRFbGVtZW50IiwidG9nZ2xlQ2xhc3MiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsMkJBQVQsQ0FBc0NDLElBQXRDLEVBQTRDQyxRQUE1QyxFQUFz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Y3NfdHJhY2tpbmdfZXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApIHtcblx0aWYgKCB0eXBlb2YgZ2EgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdGlmICggdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKSB7XG5cblx0Ly8gaWYgYSBub3QgbG9nZ2VkIGluIHVzZXIgdHJpZXMgdG8gZW1haWwsIGRvbid0IGNvdW50IHRoYXQgYXMgYSBzaGFyZVxuXHRpZiAoICEgalF1ZXJ5KCAnYm9keSAnKS5oYXNDbGFzcyggJ2xvZ2dlZC1pbicpICYmICdFbWFpbCcgPT09IHRleHQgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gdHJhY2sgYXMgYW4gZXZlbnQsIGFuZCBhcyBzb2NpYWwgaWYgaXQgaXMgdHdpdHRlciBvciBmYlxuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdTaGFyZSAtICcgKyBwb3NpdGlvbiwgdGV4dCwgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGdhICkge1xuXHRcdGlmICggJ0ZhY2Vib29rJyA9PT0gdGV4dCB8fCAnVHdpdHRlcicgPT09IHRleHQgKSB7XG5cdFx0XHRpZiAoIHRleHQgPT0gJ0ZhY2Vib29rJyApIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdTaGFyZScsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1R3ZWV0JywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbiggZnVuY3Rpb24oICQgKSB7XG5cblx0JCAoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpLnRyaW0oKTtcblx0XHR2YXIgcG9zaXRpb24gPSAndG9wJztcblx0XHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xuXHR9KTtcblxuXHQkICggJy5tLWVudHJ5LXNoYXJlLWJvdHRvbSBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgdGV4dCA9ICQoIHRoaXMgKS50ZXh0KCkudHJpbSgpO1xuXHRcdHZhciBwb3NpdGlvbiA9ICdib3R0b20nO1xuXHRcdHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG5cdH0pO1xuXG5cdCQoICcjbmF2aWdhdGlvbi1mZWF0dXJlZCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdGZWF0dXJlZCBCYXIgTGluaycsICdDbGljaycsIHRoaXMuaHJlZiApO1xuXHR9KTtcblx0JCggJ2EuZ2xlYW4tc2lkZWJhcicgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBTdXBwb3J0IExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcblx0fSk7XG5cblx0JCggJ2EnLCAkKCAnLm8tc2l0ZS1zaWRlYmFyJyApICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdHZhciB3aWRnZXRfdGl0bGUgPSAkKHRoaXMpLmNsb3Nlc3QoJy5tLXdpZGdldCcpLmZpbmQoJ2gzJykudGV4dCgpO1xuXHRcdHZhciBzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSAnJztcblx0XHRpZiAod2lkZ2V0X3RpdGxlID09PSAnJykge1xuXHRcdFx0Ly9zaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSAkKHRoaXMpLmNsb3Nlc3QoJy5ub2RlLXR5cGUtc3BpbGwnKS5maW5kKCcubm9kZS10aXRsZSBhJykudGV4dCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSB3aWRnZXRfdGl0bGU7XG5cdFx0fVxuXHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCgnZXZlbnQnLCAnU2lkZWJhciBMaW5rJywgJ0NsaWNrJywgc2lkZWJhcl9zZWN0aW9uX3RpdGxlKTtcblx0fSk7XG5cblx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24gKCBlICkge1xuXG5cdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIFBVTSApIHtcblx0XHRcdHZhciBjdXJyZW50X3BvcHVwID0gUFVNLmdldFBvcHVwKCAkKCAnLnB1bScgKSApO1xuXHRcdFx0dmFyIHNldHRpbmdzID0gUFVNLmdldFNldHRpbmdzKCAkKCAnLnB1bScgKSApO1xuXHRcdFx0dmFyIHBvcHVwX2lkID0gc2V0dGluZ3MuaWQ7XG5cdFx0XHQkKCBkb2N1bWVudCApLm9uKCdwdW1BZnRlck9wZW4nLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ1Nob3cnLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0gKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggZG9jdW1lbnQgKS5vbigncHVtQWZ0ZXJDbG9zZScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIGNsb3NlX3RyaWdnZXIgPSAkLmZuLnBvcG1ha2UubGFzdF9jbG9zZV90cmlnZ2VyO1xuXHRcdFx0XHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgY2xvc2VfdHJpZ2dlciApIHtcblx0XHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubWVzc2FnZS1jbG9zZScgKS5jbGljayhmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGNsb3NlIGNsYXNzXG5cdFx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJ0Nsb3NlIEJ1dHRvbic7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgY2xvc2VfdHJpZ2dlciwgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9ICk7XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubWVzc2FnZS1sb2dpbicgKS5jbGljayhmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGxvZ2luIGNsYXNzXG5cdFx0XHRcdHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcblx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnTG9naW4gTGluaycsIHVybCApO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLnB1bS1jb250ZW50IGE6bm90KCAubWVzc2FnZS1jbG9zZSwgLnB1bS1jbG9zZSwgLm1lc3NhZ2UtbG9naW4gKScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIHNvbWV0aGluZyB0aGF0IGlzIG5vdCBjbG9zZSB0ZXh0IG9yIGNsb3NlIGljb25cblx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnQ2xpY2snLCBwb3B1cF9pZCApO1xuICAgICAgICAgICAgfSk7XG5cdFx0fVxuXG5cdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSAmJiAnJyAhPT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLnVybF9hY2Nlc3NfbGV2ZWwgKSB7XG5cdFx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0XHR2YXIgY2F0ZWdvcnkgPSAnTWVtYmVyIENvbnRlbnQnO1xuXHRcdFx0dmFyIGxhYmVsID0gbG9jYXRpb24ucGF0aG5hbWU7IC8vIGkgdGhpbmsgd2UgY291bGQgcG9zc2libHkgcHV0IHNvbWUgZ3JvdXBpbmcgaGVyZSwgYnV0IHdlIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYWNjZXNzIHRvIG9uZSBhbmQgbWF5YmUgaXQncyBub3Qgd29ydGh3aGlsZSB5ZXRcblx0XHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0XHRpZiAoIHRydWUgPT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS5jdXJyZW50X3VzZXIuY2FuX2FjY2VzcyApIHtcblx0XHRcdFx0YWN0aW9uID0gJ1Nob3duJztcblx0XHRcdH1cblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9XG5cdH0pO1xuXG59ICkoIGpRdWVyeSApOyIsIihmdW5jdGlvbigkKXtcblx0alF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmNvbnRlbnRzKCkuZmlsdGVyKGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuICh0aGlzLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSAmJiB0aGlzLm5vZGVWYWx1ZS50cmltKCkgIT09IFwiXCIpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggYWN0aW9uICkge1xuXHRcdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0XHRyZXR1cm4gbWFya3VwO1xuXHR9XG5cblx0ZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHRcdHZhciBmb3JtICAgICAgICAgICAgICAgPSAkKCcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJyk7XG5cdFx0dmFyIHJlc3Rfcm9vdCAgICAgICAgICA9IHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Quc2l0ZV91cmwgKyB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnJlc3RfbmFtZXNwYWNlO1xuXHRcdHZhciBmdWxsX3VybCAgICAgICAgICAgPSByZXN0X3Jvb3QgKyAnLycgKyAndXBkYXRlLXVzZXIvJztcblx0XHR2YXIgY29uZmlybUNoYW5nZSAgICAgID0gJyc7XG5cdFx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdFx0dmFyIG5ld1ByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHRcdHZhciBvbGRQcmltYXJ5RW1haWwgICAgPSAnJztcblx0XHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdFx0dmFyIGVtYWlsVG9SZW1vdmUgICAgICA9ICcnO1xuXHRcdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0XHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdFx0dmFyIGFqYXhfZm9ybV9kYXRhICAgICA9ICcnO1xuXHRcdHZhciB0aGF0ICAgICAgICAgICAgICAgPSAnJztcblx0XHQvLyBzdGFydCBvdXQgd2l0aCBubyBwcmltYXJ5L3JlbW92YWxzIGNoZWNrZWRcblx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdC8vIGlmIHRoZXJlIGlzIGEgbGlzdCBvZiBlbWFpbHMgKG5vdCBqdXN0IGEgc2luZ2xlIGZvcm0gZmllbGQpXG5cdFx0aWYgKCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cdFx0XHQvLyBpZiBhIHVzZXIgc2VsZWN0cyBhIG5ldyBwcmltYXJ5LCBtb3ZlIGl0IGludG8gdGhhdCBwb3NpdGlvblxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRuZXdQcmltYXJ5RW1haWwgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdG9sZFByaW1hcnlFbWFpbCA9ICQoICcjZW1haWwnICkudmFsKCk7XG5cdFx0XHRcdHByaW1hcnlJZCAgICAgICA9ICQoIHRoaXMgKS5wcm9wKCAnaWQnICkucmVwbGFjZSggJ3ByaW1hcnlfZW1haWxfJywgJycgKTtcblx0XHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3ByaW1hcnktY2hhbmdlJyApO1xuXG5cdFx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlclxuXHRcdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cdFx0XHRcdC8vJCggdGhpcyApLnBhcmVudCgpLmFmdGVyKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdC8vIGNoYW5nZSB0aGUgdXNlciBmYWNpbmcgdmFsdWVzXG5cdFx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG5ld1ByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBtYWluIGhpZGRlbiBmb3JtIHZhbHVlXG5cdFx0XHRcdFx0JCggJyNlbWFpbCcgKS52YWwoIG5ld1ByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHRcdC8vIHN1Ym1pdCBmb3JtIHZhbHVlcy5cblx0XHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHRcdC8vIHVuY2hlY2sgdGhlIHJhZGlvIGJ1dHRvblxuXHRcdFx0XHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0XHQvLyBjaGFuZ2UgdGhlIGZvcm0gdmFsdWVzIHRvIHRoZSBvbGQgcHJpbWFyeSBlbWFpbFxuXHRcdFx0XHRcdCQoICcjcHJpbWFyeV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0XHQkKCAnI3JlbW92ZV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0XHQvLyByZW1vdmUgdGhlIGNvbmZpcm0gbWVzc2FnZVxuXHRcdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NoYW5nZScsICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRlbWFpbFRvUmVtb3ZlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcblx0XHRcdFx0XHRpZiAoICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSAhPT0gZW1haWxUb1JlbW92ZSApIHtcblx0XHRcdFx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscy5wdXNoKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXIgZm9yIHJlbW92YWxcblx0XHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHRcdC8vIGlmIGNvbmZpcm1lZCwgcmVtb3ZlIHRoZSBlbWFpbCBhbmQgc3VibWl0IHRoZSBmb3JtXG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpJyApLmZhZGVPdXQoICdub3JtYWwnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coICd2YWx1ZSBpcyAnICsgY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gaWYgYSB1c2VyIHdhbnRzIHRvIGFkZCBhbiBlbWFpbCwgZ2l2ZSB0aGVtIGEgcHJvcGVybHkgbnVtYmVyZWQgZmllbGRcblx0XHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkKCcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnKS5iZWZvcmUoICc8ZGl2IGNsYXNzPVwiYS1pbnB1dC13aXRoLWJ1dHRvbiBhLWJ1dHRvbi1zZW50ZW5jZVwiPjxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIGlkPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIHZhbHVlPVwiXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBpZD1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBjbGFzcz1cImEtYnV0dG9uIGEtYnV0dG9uLWFkZC11c2VyLWVtYWlsXCI+QWRkPC9idXR0b24+PC9kaXY+JyApO1xuXHRcdFx0bmV4dEVtYWlsQ291bnQrKztcblx0XHR9KTtcblxuXHRcdCQoICdpbnB1dFt0eXBlPXN1Ym1pdF0nICkuY2xpY2soIGZ1bmN0aW9uICggZSApIHtcblx0XHRcdHZhciBidXR0b24gPSAkKCB0aGlzICk7XG5cdFx0XHR2YXIgYnV0dG9uX2Zvcm0gPSBidXR0b24uY2xvc2VzdCggJ2Zvcm0nICk7XG5cdFx0XHRidXR0b25fZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nLCBidXR0b24udmFsKCkgKTtcblx0XHR9KTtcblxuXHRcdCQoICcubS1lbnRyeS1jb250ZW50JyApLm9uKCAnc3VibWl0JywgJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHR2YXIgZm9ybSA9ICQoIHRoaXMgKTtcblx0XHRcdHZhciBzdWJtaXR0aW5nX2J1dHRvbiA9IGZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJyApIHx8ICcnO1xuXHRcdFx0Ly8gaWYgdGhlcmUgaXMgbm8gc3VibWl0dGluZyBidXR0b24sIHBhc3MgaXQgYnkgQWpheFxuXHRcdFx0aWYgKCAnJyA9PT0gc3VibWl0dGluZ19idXR0b24gfHwgJ1NhdmUgQ2hhbmdlcycgIT09IHN1Ym1pdHRpbmdfYnV0dG9uICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRhamF4X2Zvcm1fZGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7IC8vYWRkIG91ciBvd24gYWpheCBjaGVjayBhcyBYLVJlcXVlc3RlZC1XaXRoIGlzIG5vdCBhbHdheXMgcmVsaWFibGVcblx0XHRcdFx0YWpheF9mb3JtX2RhdGEgPSBhamF4X2Zvcm1fZGF0YSArICcmcmVzdD10cnVlJztcblx0XHRcdFx0JC5hamF4KHtcblx0XHRcdFx0XHR1cmw6IGZ1bGxfdXJsLFxuXHRcdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcblx0XHRcdFx0ICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Lm5vbmNlICk7XG5cdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdFx0ZGF0YTogYWpheF9mb3JtX2RhdGFcblx0XHRcdFx0fSkuZG9uZSggZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJCh0aGlzKS52YWwoKTtcblx0XHRcdFx0XHR9KS5nZXQoKTtcblx0XHRcdFx0XHQkLmVhY2goIG5ld0VtYWlscywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRcdG5leHRFbWFpbENvdW50ID0gbmV4dEVtYWlsQ291bnQgKyBpbmRleDtcblx0XHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkuYXBwZW5kKCAnPGxpIGlkPVwidXNlci1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtZW1haWwtcHJlZmVyZW5jZXNcIj48YSBocmVmPVwiL3N1YnNjcmliZS8/ZW1haWw9JyArIGVuY29kZVVSSUNvbXBvbmVudCggdmFsdWUgKSArICdcIj48c21hbGw+RW1haWwgUHJlZmVyZW5jZXM8L3NtYWxsPjwvYT48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCAkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCgpICsgJywnICsgdmFsdWUgKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0aWYgKCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0XHRcdGlmICggJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApICE9PSAkKCAnaW5wdXRbbmFtZT1cImVtYWlsXCJdJyApICkge1xuXHRcdFx0XHRcdFx0XHQvLyBpdCB3b3VsZCBiZSBuaWNlIHRvIG9ubHkgbG9hZCB0aGUgZm9ybSwgYnV0IHRoZW4gY2xpY2sgZXZlbnRzIHN0aWxsIGRvbid0IHdvcmtcblx0XHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFx0aWYgKCAkKCcubS1mb3JtLWVtYWlsJykubGVuZ3RoID4gMCApIHtcblx0XHRcdG1hbmFnZUVtYWlscygpO1xuXHRcdH1cblx0fSk7XG59KShqUXVlcnkpO1xuIiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogSGFuZGxlcyB0b2dnbGluZyB0aGUgbmF2aWdhdGlvbiBtZW51IGZvciBzbWFsbCBzY3JlZW5zIGFuZCBlbmFibGVzIFRBQiBrZXlcbiAqIG5hdmlnYXRpb24gc3VwcG9ydCBmb3IgZHJvcGRvd24gbWVudXMuXG4gKi9cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0c2V0dXBNZW51KCAnbmF2aWdhdGlvbi1wcmltYXJ5JyApO1xuXHRzZXR1cE1lbnUoICduYXZpZ2F0aW9uLXVzZXItYWNjb3VudC1tYW5hZ2VtZW50JyApO1xuXHRzZXR1cE5hdlNlYXJjaCggJ25hdmlnYXRpb24tcHJpbWFyeScgKTtcblxuXHRmdW5jdGlvbiBzZXR1cE5hdlNlYXJjaCggY29udGFpbmVyICkge1xuXG5cdFx0dmFyIG5hdnNlYXJjaHRvZ2dsZSwgbmF2c2VhcmNoZm9ybTtcblxuXHRcdGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBjb250YWluZXIgKTtcblx0XHRpZiAoICEgY29udGFpbmVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdG5hdnNlYXJjaHRvZ2dsZSA9ICQoICdsaS5zZWFyY2ggYScsICQoIGNvbnRhaW5lciApICk7XG5cdFx0bmF2c2VhcmNoZm9ybSAgID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnZm9ybScgKVswXTtcblxuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBuYXZzZWFyY2h0b2dnbGUgfHwgJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBuYXZzZWFyY2hmb3JtICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggJCggbmF2c2VhcmNoZm9ybSApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRpZiAoIC0xICE9PSBuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZC1mb3JtJyApICkge1xuXHRcdFx0XHRcdG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lID0gbmF2c2VhcmNoZm9ybS5jbGFzc05hbWUucmVwbGFjZSggJyB0b2dnbGVkLWZvcm0nLCAnJyApO1xuXHRcdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnByb3AoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5yZW1vdmVDbGFzcyggJ3RvZ2dsZWQtZm9ybScgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZSArPSAnIHRvZ2dsZWQtZm9ybSc7XG5cdFx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucHJvcCggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XG5cdFx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkuYWRkQ2xhc3MoICd0b2dnbGVkLWZvcm0nICk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwTWVudSggY29udGFpbmVyICkge1xuXHRcdHZhciBidXR0b24sIG1lbnUsIGxpbmtzLCBpLCBsZW47XG5cdFx0Y29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGNvbnRhaW5lciApO1xuXHRcdGlmICggISBjb250YWluZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0YnV0dG9uID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYnV0dG9uJyApWzBdO1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBidXR0b24gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bWVudSA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ3VsJyApWzBdO1xuXG5cdFx0Ly8gSGlkZSBtZW51IHRvZ2dsZSBidXR0b24gaWYgbWVudSBpcyBlbXB0eSBhbmQgcmV0dXJuIGVhcmx5LlxuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBtZW51ICkge1xuXHRcdFx0YnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRcdGlmICggLTEgPT09IG1lbnUuY2xhc3NOYW1lLmluZGV4T2YoICdtZW51JyApICkge1xuXHRcdFx0bWVudS5jbGFzc05hbWUgKz0gJyBtZW51Jztcblx0XHR9XG5cblx0XHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAtMSAhPT0gY29udGFpbmVyLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZCcgKSApIHtcblx0XHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IGNvbnRhaW5lci5jbGFzc05hbWUucmVwbGFjZSggJyB0b2dnbGVkJywgJycgKTtcblx0XHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgKz0gJyB0b2dnbGVkJztcblx0XHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnICk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8vIEdldCBhbGwgdGhlIGxpbmsgZWxlbWVudHMgd2l0aGluIHRoZSBtZW51LlxuXHRcdGxpbmtzICAgID0gbWVudS5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2EnICk7XG5cblx0XHQvLyBFYWNoIHRpbWUgYSBtZW51IGxpbmsgaXMgZm9jdXNlZCBvciBibHVycmVkLCB0b2dnbGUgZm9jdXMuXG5cdFx0Zm9yICggaSA9IDAsIGxlbiA9IGxpbmtzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0bGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ2ZvY3VzJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0XHRcdGxpbmtzW2ldLmFkZEV2ZW50TGlzdGVuZXIoICdibHVyJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBUb2dnbGVzIGBmb2N1c2AgY2xhc3MgdG8gYWxsb3cgc3VibWVudSBhY2Nlc3Mgb24gdGFibGV0cy5cblx0XHQgKi9cblx0XHQoIGZ1bmN0aW9uKCBjb250YWluZXIgKSB7XG5cdFx0XHR2YXIgdG91Y2hTdGFydEZuLCBpLFxuXHRcdFx0XHRwYXJlbnRMaW5rID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoICcubWVudS1pdGVtLWhhcy1jaGlsZHJlbiA+IGEsIC5wYWdlX2l0ZW1faGFzX2NoaWxkcmVuID4gYScgKTtcblxuXHRcdFx0aWYgKCAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgKSB7XG5cdFx0XHRcdHRvdWNoU3RhcnRGbiA9IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdHZhciBtZW51SXRlbSA9IHRoaXMucGFyZW50Tm9kZSwgaTtcblxuXHRcdFx0XHRcdGlmICggISBtZW51SXRlbS5jbGFzc0xpc3QuY29udGFpbnMoICdmb2N1cycgKSApIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgbWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbi5sZW5ndGg7ICsraSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBtZW51SXRlbSA9PT0gbWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbltpXSApIHtcblx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1lbnVJdGVtLmNsYXNzTGlzdC5hZGQoICdmb2N1cycgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IHBhcmVudExpbmsubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdFx0cGFyZW50TGlua1tpXS5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIHRvdWNoU3RhcnRGbiwgZmFsc2UgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0oIGNvbnRhaW5lciApICk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyBvciByZW1vdmVzIC5mb2N1cyBjbGFzcyBvbiBhbiBlbGVtZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlRm9jdXMoKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0Ly8gTW92ZSB1cCB0aHJvdWdoIHRoZSBhbmNlc3RvcnMgb2YgdGhlIGN1cnJlbnQgbGluayB1bnRpbCB3ZSBoaXQgLm5hdi1tZW51LlxuXHRcdHdoaWxlICggLTEgPT09IHNlbGYuY2xhc3NOYW1lLmluZGV4T2YoICdtZW51JyApICkge1xuXG5cdFx0XHQvLyBPbiBsaSBlbGVtZW50cyB0b2dnbGUgdGhlIGNsYXNzIC5mb2N1cy5cblx0XHRcdGlmICggJ2xpJyA9PT0gc2VsZi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgKSB7XG5cdFx0XHRcdGlmICggLTEgIT09IHNlbGYuY2xhc3NOYW1lLmluZGV4T2YoICdmb2N1cycgKSApIHtcblx0XHRcdFx0XHRzZWxmLmNsYXNzTmFtZSA9IHNlbGYuY2xhc3NOYW1lLnJlcGxhY2UoICcgZm9jdXMnLCAnJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlbGYuY2xhc3NOYW1lICs9ICcgZm9jdXMnO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHNlbGYgPSBzZWxmLnBhcmVudEVsZW1lbnQ7XG5cdFx0fVxuXHR9XG5cbn0pO1xuXG4vLyB1c2VyIGFjY291bnQgbmF2aWdhdGlvbiBjYW4gYmUgYSBkcm9wZG93blxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0Ly8gaGlkZSBtZW51XG5cdGlmICgkKCcjdXNlci1hY2NvdW50LWFjY2VzcyB1bCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0JCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgPiBsaSA+IGEnKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdCQoJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJykudG9nZ2xlQ2xhc3MoICd2aXNpYmxlJyApO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9KTtcblx0fVxuXG59KTtcbiJdfQ==
