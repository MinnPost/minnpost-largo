;(function($) {
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
  var zone_title = $(this).closest('.m-zone').find('.a-zone-title').text();
  var sidebar_section_title = '';

  if ('' !== widget_title) {
    sidebar_section_title = widget_title;
  } else if ('' !== zone_title) {
    sidebar_section_title = zone_title;
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
"use strict";

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
          $('.m-user-email-list').append('<li id="user-email-' + nextEmailCount + '">' + value + '<ul class="a-form-caption a-user-email-actions"><li class="a-form-caption a-pre-confirm a-make-primary-email"><input type="radio" name="primary_email" id="primary_email_' + nextEmailCount + '" value="' + value + '"><label for="primary_email_' + nextEmailCount + '"><small>Make Primary</small></label></li><li class="a-form-caption a-pre-confirm a-email-preferences"><a href="/newsletters/?email=' + encodeURIComponent(value) + '"><small>Email Preferences</small></a></li><li class="a-form-caption a-pre-confirm a-remove-email"><input type="checkbox" name="remove_email[' + nextEmailCount + ']" id="remove_email_' + nextEmailCount + '" value="' + value + '"><label for="remove_email_' + nextEmailCount + '"><small>Remove</small></label></li></ul></li>');
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

$(document).ready(function ($) {
  "use strict";

  if ($('.m-form-email').length > 0) {
    manageEmails();
  }
});
"use strict";

/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
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
} // user account navigation can be a dropdown


$(document).ready(function () {
  // hide menu
  if ($('#user-account-access ul').length > 0) {
    $('#user-account-access > li > a').on('click', function (event) {
      $('#user-account-access ul').toggleClass('visible');
      event.preventDefault();
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuYWx5dGljcy5qcyIsImZvcm1zLmpzIiwibmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6WyJtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsInZhbHVlIiwiZ2EiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiJCIsImNsaWNrIiwiZSIsInRyaW0iLCJocmVmIiwid2lkZ2V0X3RpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJ6b25lX3RpdGxlIiwic2lkZWJhcl9zZWN0aW9uX3RpdGxlIiwiZG9jdW1lbnQiLCJyZWFkeSIsIlBVTSIsImN1cnJlbnRfcG9wdXAiLCJnZXRQb3B1cCIsInNldHRpbmdzIiwiZ2V0U2V0dGluZ3MiLCJwb3B1cF9pZCIsImlkIiwib24iLCJjbG9zZV90cmlnZ2VyIiwiZm4iLCJwb3BtYWtlIiwibGFzdF9jbG9zZV90cmlnZ2VyIiwidXJsIiwiYXR0ciIsIm1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSIsInVybF9hY2Nlc3NfbGV2ZWwiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidGV4dE5vZGVzIiwiY29udGVudHMiLCJmaWx0ZXIiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJub2RlVmFsdWUiLCJnZXRDb25maXJtQ2hhbmdlTWFya3VwIiwibWFya3VwIiwibWFuYWdlRW1haWxzIiwiZm9ybSIsInJlc3Rfcm9vdCIsInVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QiLCJzaXRlX3VybCIsInJlc3RfbmFtZXNwYWNlIiwiZnVsbF91cmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheF9mb3JtX2RhdGEiLCJ0aGF0IiwicHJvcCIsImxlbmd0aCIsImV2ZW50IiwidmFsIiwicmVwbGFjZSIsInBhcmVudCIsImhpZGUiLCJzaG93IiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFwcGVuZCIsInByZXZlbnREZWZhdWx0IiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsInJlbW92ZSIsImVhY2giLCJpbmRleCIsImdldCIsInB1c2giLCJwYXJlbnRzIiwiZmFkZU91dCIsImpvaW4iLCJjb25zb2xlIiwibG9nIiwiYmVmb3JlIiwiYnV0dG9uIiwiYnV0dG9uX2Zvcm0iLCJkYXRhIiwic3VibWl0dGluZ19idXR0b24iLCJzZXJpYWxpemUiLCJhamF4IiwiYmVmb3JlU2VuZCIsInhociIsInNldFJlcXVlc3RIZWFkZXIiLCJub25jZSIsImRhdGFUeXBlIiwiZG9uZSIsIm1hcCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsInNldHVwTWVudSIsInNldHVwTmF2U2VhcmNoIiwiY29udGFpbmVyIiwibmF2c2VhcmNoY29udGFpbmVyIiwibmF2c2VhcmNodG9nZ2xlIiwibmF2c2VhcmNoZm9ybSIsImdldEVsZW1lbnRCeUlkIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCIkdGFyZ2V0IiwidGFyZ2V0IiwiaXMiLCJjbGFzc05hbWUiLCJpbmRleE9mIiwibWVudSIsImxpbmtzIiwiaSIsImxlbiIsInN0eWxlIiwiZGlzcGxheSIsInNldEF0dHJpYnV0ZSIsIm9uY2xpY2siLCJhZGRFdmVudExpc3RlbmVyIiwidG9nZ2xlRm9jdXMiLCJ0b3VjaFN0YXJ0Rm4iLCJwYXJlbnRMaW5rIiwicXVlcnlTZWxlY3RvckFsbCIsIndpbmRvdyIsIm1lbnVJdGVtIiwicGFyZW50Tm9kZSIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiY2hpbGRyZW4iLCJhZGQiLCJzZWxmIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwicGFyZW50RWxlbWVudCIsInRvZ2dsZUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLDJCQUFULENBQXNDQyxJQUF0QyxFQUE0Q0MsUUFBNUMsRUFBc0RDLE1BQXRELEVBQThEQyxLQUE5RCxFQUFxRUMsS0FBckUsRUFBNkU7QUFDNUUsTUFBSyxPQUFPQyxFQUFQLEtBQWMsV0FBbkIsRUFBaUM7QUFDaEMsUUFBSyxPQUFPRCxLQUFQLEtBQWlCLFdBQXRCLEVBQW9DO0FBQ25DQyxNQUFBQSxFQUFFLENBQUUsTUFBRixFQUFVTCxJQUFWLEVBQWdCQyxRQUFoQixFQUEwQkMsTUFBMUIsRUFBa0NDLEtBQWxDLENBQUY7QUFDQSxLQUZELE1BRU87QUFDTkUsTUFBQUEsRUFBRSxDQUFFLE1BQUYsRUFBVUwsSUFBVixFQUFnQkMsUUFBaEIsRUFBMEJDLE1BQTFCLEVBQWtDQyxLQUFsQyxFQUF5Q0MsS0FBekMsQ0FBRjtBQUNBO0FBQ0QsR0FORCxNQU1PO0FBQ047QUFDQTtBQUNEOztBQUVELFNBQVNFLFVBQVQsQ0FBcUJDLElBQXJCLEVBQTJCQyxRQUEzQixFQUFzQztBQUVyQztBQUNBLE1BQUssQ0FBRUMsTUFBTSxDQUFFLE9BQUYsQ0FBTixDQUFpQkMsUUFBakIsQ0FBMkIsV0FBM0IsQ0FBRixJQUE2QyxZQUFZSCxJQUE5RCxFQUFxRTtBQUNwRTtBQUNBLEdBTG9DLENBT3JDOzs7QUFDQVIsRUFBQUEsMkJBQTJCLENBQUUsT0FBRixFQUFXLGFBQWFTLFFBQXhCLEVBQWtDRCxJQUFsQyxFQUF3Q0ksUUFBUSxDQUFDQyxRQUFqRCxDQUEzQjs7QUFDQSxNQUFLLGdCQUFnQixPQUFPUCxFQUE1QixFQUFpQztBQUNoQyxRQUFLLGVBQWVFLElBQWYsSUFBdUIsY0FBY0EsSUFBMUMsRUFBaUQ7QUFDaEQsVUFBS0EsSUFBSSxJQUFJLFVBQWIsRUFBMEI7QUFDekJGLFFBQUFBLEVBQUUsQ0FBRSxNQUFGLEVBQVUsUUFBVixFQUFvQkUsSUFBcEIsRUFBMEIsT0FBMUIsRUFBbUNJLFFBQVEsQ0FBQ0MsUUFBNUMsQ0FBRjtBQUNBLE9BRkQsTUFFTztBQUNOUCxRQUFBQSxFQUFFLENBQUUsTUFBRixFQUFVLFFBQVYsRUFBb0JFLElBQXBCLEVBQTBCLE9BQTFCLEVBQW1DSSxRQUFRLENBQUNDLFFBQTVDLENBQUY7QUFDQTtBQUNEO0FBQ0QsR0FSRCxNQVFPO0FBQ047QUFDQTtBQUNEOztBQUVEQyxDQUFDLENBQUcsc0JBQUgsQ0FBRCxDQUE2QkMsS0FBN0IsQ0FBb0MsVUFBVUMsQ0FBVixFQUFjO0FBQ2pELE1BQUlSLElBQUksR0FBR00sQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVTixJQUFWLEdBQWlCUyxJQUFqQixFQUFYO0FBQ0EsTUFBSVIsUUFBUSxHQUFHLEtBQWY7QUFDQUYsRUFBQUEsVUFBVSxDQUFFQyxJQUFGLEVBQVFDLFFBQVIsQ0FBVjtBQUNBLENBSkQ7QUFNQUssQ0FBQyxDQUFHLHlCQUFILENBQUQsQ0FBZ0NDLEtBQWhDLENBQXVDLFVBQVVDLENBQVYsRUFBYztBQUNwRCxNQUFJUixJQUFJLEdBQUdNLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVU4sSUFBVixHQUFpQlMsSUFBakIsRUFBWDtBQUNBLE1BQUlSLFFBQVEsR0FBRyxRQUFmO0FBQ0FGLEVBQUFBLFVBQVUsQ0FBRUMsSUFBRixFQUFRQyxRQUFSLENBQVY7QUFDQSxDQUpEO0FBTUFLLENBQUMsQ0FBRSx3QkFBRixDQUFELENBQThCQyxLQUE5QixDQUFxQyxVQUFVQyxDQUFWLEVBQWM7QUFDbERoQixFQUFBQSwyQkFBMkIsQ0FBRSxPQUFGLEVBQVcsbUJBQVgsRUFBZ0MsT0FBaEMsRUFBeUMsS0FBS2tCLElBQTlDLENBQTNCO0FBQ0EsQ0FGRDtBQUdBSixDQUFDLENBQUUsaUJBQUYsQ0FBRCxDQUF1QkMsS0FBdkIsQ0FBOEIsVUFBVUMsQ0FBVixFQUFjO0FBQzNDaEIsRUFBQUEsMkJBQTJCLENBQUUsT0FBRixFQUFXLHNCQUFYLEVBQW1DLE9BQW5DLEVBQTRDLEtBQUtrQixJQUFqRCxDQUEzQjtBQUNBLENBRkQ7QUFJQUosQ0FBQyxDQUFFLEdBQUYsRUFBT0EsQ0FBQyxDQUFFLGlCQUFGLENBQVIsQ0FBRCxDQUFpQ0MsS0FBakMsQ0FBd0MsVUFBVUMsQ0FBVixFQUFjO0FBQ3JELE1BQUlHLFlBQVksR0FBR0wsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFRTSxPQUFSLENBQWdCLFdBQWhCLEVBQTZCQyxJQUE3QixDQUFrQyxJQUFsQyxFQUF3Q2IsSUFBeEMsRUFBbkI7QUFDQSxNQUFJYyxVQUFVLEdBQUtSLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUU0sT0FBUixDQUFnQixTQUFoQixFQUEyQkMsSUFBM0IsQ0FBZ0MsZUFBaEMsRUFBaURiLElBQWpELEVBQW5CO0FBQ0EsTUFBSWUscUJBQXFCLEdBQUcsRUFBNUI7O0FBQ0EsTUFBSyxPQUFPSixZQUFaLEVBQTJCO0FBQzFCSSxJQUFBQSxxQkFBcUIsR0FBR0osWUFBeEI7QUFDQSxHQUZELE1BRU8sSUFBSyxPQUFPRyxVQUFaLEVBQXlCO0FBQy9CQyxJQUFBQSxxQkFBcUIsR0FBR0QsVUFBeEI7QUFDQTs7QUFDRHRCLEVBQUFBLDJCQUEyQixDQUFDLE9BQUQsRUFBVSxjQUFWLEVBQTBCLE9BQTFCLEVBQW1DdUIscUJBQW5DLENBQTNCO0FBQ0EsQ0FWRDtBQVlBVCxDQUFDLENBQUVVLFFBQUYsQ0FBRCxDQUFjQyxLQUFkLENBQXFCLFVBQVdULENBQVgsRUFBZTtBQUVuQyxNQUFLLGdCQUFnQixPQUFPVSxHQUE1QixFQUFrQztBQUNqQyxRQUFJQyxhQUFhLEdBQUdELEdBQUcsQ0FBQ0UsUUFBSixDQUFjZCxDQUFDLENBQUUsTUFBRixDQUFmLENBQXBCO0FBQ0EsUUFBSWUsUUFBUSxHQUFHSCxHQUFHLENBQUNJLFdBQUosQ0FBaUJoQixDQUFDLENBQUUsTUFBRixDQUFsQixDQUFmO0FBQ0EsUUFBSWlCLFFBQVEsR0FBR0YsUUFBUSxDQUFDRyxFQUF4QjtBQUNBbEIsSUFBQUEsQ0FBQyxDQUFFVSxRQUFGLENBQUQsQ0FBY1MsRUFBZCxDQUFpQixjQUFqQixFQUFpQyxZQUFZO0FBQzVDakMsTUFBQUEsMkJBQTJCLENBQUUsT0FBRixFQUFXLE9BQVgsRUFBb0IsTUFBcEIsRUFBNEIrQixRQUE1QixFQUFzQztBQUFFLDBCQUFrQjtBQUFwQixPQUF0QyxDQUEzQjtBQUNBLEtBRkQ7QUFHQWpCLElBQUFBLENBQUMsQ0FBRVUsUUFBRixDQUFELENBQWNTLEVBQWQsQ0FBaUIsZUFBakIsRUFBa0MsWUFBWTtBQUM3QyxVQUFJQyxhQUFhLEdBQUdwQixDQUFDLENBQUNxQixFQUFGLENBQUtDLE9BQUwsQ0FBYUMsa0JBQWpDOztBQUNBLFVBQUssZ0JBQWdCLE9BQU9ILGFBQTVCLEVBQTRDO0FBQzNDbEMsUUFBQUEsMkJBQTJCLENBQUUsT0FBRixFQUFXLE9BQVgsRUFBb0JrQyxhQUFwQixFQUFtQ0gsUUFBbkMsRUFBNkM7QUFBRSw0QkFBa0I7QUFBcEIsU0FBN0MsQ0FBM0I7QUFDQTtBQUNELEtBTEQ7QUFNQWpCLElBQUFBLENBQUMsQ0FBRSxnQkFBRixDQUFELENBQXNCQyxLQUF0QixDQUE0QixVQUFVQyxDQUFWLEVBQWM7QUFBRTtBQUMzQyxVQUFJa0IsYUFBYSxHQUFHLGNBQXBCO0FBQ0FsQyxNQUFBQSwyQkFBMkIsQ0FBRSxPQUFGLEVBQVcsT0FBWCxFQUFvQmtDLGFBQXBCLEVBQW1DSCxRQUFuQyxFQUE2QztBQUFFLDBCQUFrQjtBQUFwQixPQUE3QyxDQUEzQjtBQUNBLEtBSEQ7QUFJQWpCLElBQUFBLENBQUMsQ0FBRSxnQkFBRixDQUFELENBQXNCQyxLQUF0QixDQUE0QixVQUFVQyxDQUFWLEVBQWM7QUFBRTtBQUMzQyxVQUFJc0IsR0FBRyxHQUFHeEIsQ0FBQyxDQUFDLElBQUQsQ0FBRCxDQUFReUIsSUFBUixDQUFhLE1BQWIsQ0FBVjtBQUNBdkMsTUFBQUEsMkJBQTJCLENBQUUsT0FBRixFQUFXLE9BQVgsRUFBb0IsWUFBcEIsRUFBa0NzQyxHQUFsQyxDQUEzQjtBQUNBLEtBSEQ7QUFJQXhCLElBQUFBLENBQUMsQ0FBRSxrRUFBRixDQUFELENBQXdFQyxLQUF4RSxDQUErRSxVQUFVQyxDQUFWLEVBQWM7QUFBRTtBQUM5RmhCLE1BQUFBLDJCQUEyQixDQUFFLE9BQUYsRUFBVyxPQUFYLEVBQW9CLE9BQXBCLEVBQTZCK0IsUUFBN0IsQ0FBM0I7QUFDTSxLQUZQO0FBR0E7O0FBRUQsTUFBSyxnQkFBZ0IsT0FBT1Msd0JBQXZCLElBQW1ELE9BQU9BLHdCQUF3QixDQUFDQyxnQkFBeEYsRUFBMkc7QUFDMUcsUUFBSXhDLElBQUksR0FBRyxPQUFYO0FBQ0EsUUFBSUMsUUFBUSxHQUFHLGdCQUFmO0FBQ0EsUUFBSUUsS0FBSyxHQUFHUSxRQUFRLENBQUNDLFFBQXJCLENBSDBHLENBRzNFOztBQUMvQixRQUFJVixNQUFNLEdBQUcsU0FBYjs7QUFDQSxRQUFLLFNBQVNxQyx3QkFBd0IsQ0FBQ0UsWUFBekIsQ0FBc0NDLFVBQXBELEVBQWlFO0FBQ2hFeEMsTUFBQUEsTUFBTSxHQUFHLE9BQVQ7QUFDQTs7QUFDREgsSUFBQUEsMkJBQTJCLENBQUVDLElBQUYsRUFBUUMsUUFBUixFQUFrQkMsTUFBbEIsRUFBMEJDLEtBQTFCLENBQTNCO0FBQ0E7QUFDRCxDQXRDRDs7O0FDaEVBTSxNQUFNLENBQUN5QixFQUFQLENBQVVTLFNBQVYsR0FBc0IsWUFBVztBQUNoQyxTQUFPLEtBQUtDLFFBQUwsR0FBZ0JDLE1BQWhCLENBQXVCLFlBQVc7QUFDeEMsV0FBUSxLQUFLQyxRQUFMLEtBQWtCQyxJQUFJLENBQUNDLFNBQXZCLElBQW9DLEtBQUtDLFNBQUwsQ0FBZWpDLElBQWYsT0FBMEIsRUFBdEU7QUFDQSxHQUZNLENBQVA7QUFHQSxDQUpEOztBQU1BLFNBQVNrQyxzQkFBVCxDQUFpQ2hELE1BQWpDLEVBQTBDO0FBQ3pDLE1BQUlpRCxNQUFNLEdBQUcscUZBQXFGakQsTUFBckYsR0FBOEYscUNBQTlGLEdBQXNJQSxNQUF0SSxHQUErSSxnQ0FBNUo7QUFDQSxTQUFPaUQsTUFBUDtBQUNBOztBQUVELFNBQVNDLFlBQVQsR0FBd0I7QUFDdkIsTUFBSUMsSUFBSSxHQUFpQnhDLENBQUMsQ0FBQyx3QkFBRCxDQUExQjtBQUNBLE1BQUl5QyxTQUFTLEdBQVlDLDRCQUE0QixDQUFDQyxRQUE3QixHQUF3Q0QsNEJBQTRCLENBQUNFLGNBQTlGO0FBQ0EsTUFBSUMsUUFBUSxHQUFhSixTQUFTLEdBQUcsR0FBWixHQUFrQixjQUEzQztBQUNBLE1BQUlLLGFBQWEsR0FBUSxFQUF6QjtBQUNBLE1BQUlDLGNBQWMsR0FBTyxDQUF6QjtBQUNBLE1BQUlDLGVBQWUsR0FBTSxFQUF6QjtBQUNBLE1BQUlDLGVBQWUsR0FBTSxFQUF6QjtBQUNBLE1BQUlDLFNBQVMsR0FBWSxFQUF6QjtBQUNBLE1BQUlDLGFBQWEsR0FBUSxFQUF6QjtBQUNBLE1BQUlDLGtCQUFrQixHQUFHLEVBQXpCO0FBQ0EsTUFBSUMsU0FBUyxHQUFZLEVBQXpCO0FBQ0EsTUFBSUMsY0FBYyxHQUFPLEVBQXpCO0FBQ0EsTUFBSUMsSUFBSSxHQUFpQixFQUF6QixDQWJ1QixDQWN2Qjs7QUFDQXZELEVBQUFBLENBQUMsQ0FBRSwwREFBRixDQUFELENBQWdFd0QsSUFBaEUsQ0FBc0UsU0FBdEUsRUFBaUYsS0FBakY7QUFDQXhELEVBQUFBLENBQUMsQ0FBRSx1REFBRixDQUFELENBQTZEd0QsSUFBN0QsQ0FBbUUsU0FBbkUsRUFBOEUsS0FBOUUsRUFoQnVCLENBaUJ2Qjs7QUFDQSxNQUFLeEQsQ0FBQyxDQUFFLG9CQUFGLENBQUQsQ0FBMEJ5RCxNQUExQixHQUFtQyxDQUF4QyxFQUE0QztBQUMzQ1YsSUFBQUEsY0FBYyxHQUFHL0MsQ0FBQyxDQUFFLHlCQUFGLENBQUQsQ0FBK0J5RCxNQUFoRCxDQUQyQyxDQUUzQzs7QUFDQXpELElBQUFBLENBQUMsQ0FBRSxvQkFBRixDQUFELENBQTBCbUIsRUFBMUIsQ0FBOEIsT0FBOUIsRUFBdUMsMERBQXZDLEVBQW1HLFVBQVV1QyxLQUFWLEVBQWtCO0FBRXBIVixNQUFBQSxlQUFlLEdBQUdoRCxDQUFDLENBQUUsSUFBRixDQUFELENBQVUyRCxHQUFWLEVBQWxCO0FBQ0FWLE1BQUFBLGVBQWUsR0FBR2pELENBQUMsQ0FBRSxRQUFGLENBQUQsQ0FBYzJELEdBQWQsRUFBbEI7QUFDQVQsTUFBQUEsU0FBUyxHQUFTbEQsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVd0QsSUFBVixDQUFnQixJQUFoQixFQUF1QkksT0FBdkIsQ0FBZ0MsZ0JBQWhDLEVBQWtELEVBQWxELENBQWxCO0FBQ0FkLE1BQUFBLGFBQWEsR0FBS1Qsc0JBQXNCLENBQUUsZ0JBQUYsQ0FBeEMsQ0FMb0gsQ0FPcEg7O0FBQ0FrQixNQUFBQSxJQUFJLEdBQUd2RCxDQUFDLENBQUUsSUFBRixDQUFELENBQVU2RCxNQUFWLEdBQW1CQSxNQUFuQixFQUFQO0FBQ0E3RCxNQUFBQSxDQUFDLENBQUUsZ0JBQUYsRUFBb0J1RCxJQUFwQixDQUFELENBQTRCTyxJQUE1QjtBQUNBOUQsTUFBQUEsQ0FBQyxDQUFFLGlCQUFGLEVBQXFCdUQsSUFBckIsQ0FBRCxDQUE2QlEsSUFBN0I7QUFDQS9ELE1BQUFBLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVTZELE1BQVYsR0FBbUJBLE1BQW5CLEdBQTRCRyxRQUE1QixDQUFzQyxlQUF0QztBQUNBaEUsTUFBQUEsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVNkQsTUFBVixHQUFtQkEsTUFBbkIsR0FBNEJJLFdBQTVCLENBQXlDLGdCQUF6QyxFQVpvSCxDQWFwSDs7QUFDQWpFLE1BQUFBLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVTZELE1BQVYsR0FBbUJBLE1BQW5CLEdBQTRCSyxNQUE1QixDQUFvQ3BCLGFBQXBDO0FBRUE5QyxNQUFBQSxDQUFDLENBQUUsb0JBQUYsQ0FBRCxDQUEwQm1CLEVBQTFCLENBQThCLE9BQTlCLEVBQXVDLDJCQUF2QyxFQUFvRSxVQUFVdUMsS0FBVixFQUFrQjtBQUNyRkEsUUFBQUEsS0FBSyxDQUFDUyxjQUFOLEdBRHFGLENBRXJGOztBQUNBbkUsUUFBQUEsQ0FBQyxDQUFFLHlCQUFGLENBQUQsQ0FBK0I4QixTQUEvQixHQUEyQ3NDLEtBQTNDLEdBQW1EQyxXQUFuRCxDQUFnRXJCLGVBQWhFO0FBQ0FoRCxRQUFBQSxDQUFDLENBQUUsaUJBQWlCa0QsU0FBbkIsQ0FBRCxDQUFnQ3BCLFNBQWhDLEdBQTRDc0MsS0FBNUMsR0FBb0RDLFdBQXBELENBQWlFcEIsZUFBakUsRUFKcUYsQ0FLckY7O0FBQ0FqRCxRQUFBQSxDQUFDLENBQUUsUUFBRixDQUFELENBQWMyRCxHQUFkLENBQW1CWCxlQUFuQixFQU5xRixDQU9yRjs7QUFDQVIsUUFBQUEsSUFBSSxDQUFDOEIsTUFBTCxHQVJxRixDQVNyRjs7QUFDQXRFLFFBQUFBLENBQUMsQ0FBRSwwREFBRixDQUFELENBQWdFd0QsSUFBaEUsQ0FBc0UsU0FBdEUsRUFBaUYsS0FBakYsRUFWcUYsQ0FXckY7O0FBQ0F4RCxRQUFBQSxDQUFDLENBQUUsb0JBQW9Ca0QsU0FBdEIsQ0FBRCxDQUFtQ1MsR0FBbkMsQ0FBd0NWLGVBQXhDO0FBQ0FqRCxRQUFBQSxDQUFDLENBQUUsbUJBQW1Ca0QsU0FBckIsQ0FBRCxDQUFrQ1MsR0FBbEMsQ0FBdUNWLGVBQXZDLEVBYnFGLENBY3JGOztBQUNBakQsUUFBQUEsQ0FBQyxDQUFFLGlCQUFGLEVBQXFCdUQsSUFBSSxDQUFDTSxNQUFMLEVBQXJCLENBQUQsQ0FBc0NVLE1BQXRDO0FBQ0F2RSxRQUFBQSxDQUFDLENBQUUsZ0JBQUYsRUFBb0J1RCxJQUFJLENBQUNNLE1BQUwsRUFBcEIsQ0FBRCxDQUFxQ0UsSUFBckM7QUFDQSxPQWpCRDtBQWtCQS9ELE1BQUFBLENBQUMsQ0FBRSxvQkFBRixDQUFELENBQTBCbUIsRUFBMUIsQ0FBOEIsT0FBOUIsRUFBdUMsd0JBQXZDLEVBQWlFLFVBQVV1QyxLQUFWLEVBQWtCO0FBQ2xGQSxRQUFBQSxLQUFLLENBQUNTLGNBQU47QUFDQW5FLFFBQUFBLENBQUMsQ0FBRSxnQkFBRixFQUFvQnVELElBQUksQ0FBQ00sTUFBTCxFQUFwQixDQUFELENBQXFDRSxJQUFyQztBQUNBL0QsUUFBQUEsQ0FBQyxDQUFFLGlCQUFGLEVBQXFCdUQsSUFBSSxDQUFDTSxNQUFMLEVBQXJCLENBQUQsQ0FBc0NVLE1BQXRDO0FBQ0EsT0FKRDtBQUtBLEtBdkNELEVBSDJDLENBNEMzQzs7QUFDQXZFLElBQUFBLENBQUMsQ0FBRSxvQkFBRixDQUFELENBQTBCbUIsRUFBMUIsQ0FBOEIsUUFBOUIsRUFBd0MsdURBQXhDLEVBQWlHLFVBQVV1QyxLQUFWLEVBQWtCO0FBQ2xIUCxNQUFBQSxhQUFhLEdBQUduRCxDQUFDLENBQUUsSUFBRixDQUFELENBQVUyRCxHQUFWLEVBQWhCO0FBQ0FiLE1BQUFBLGFBQWEsR0FBS1Qsc0JBQXNCLENBQUUsU0FBRixDQUF4QztBQUNBckMsTUFBQUEsQ0FBQyxDQUFFLHlCQUFGLENBQUQsQ0FBK0J3RSxJQUEvQixDQUFxQyxVQUFVQyxLQUFWLEVBQWtCO0FBQ3RELFlBQUt6RSxDQUFDLENBQUUsSUFBRixDQUFELENBQVUrQixRQUFWLEdBQXFCMkMsR0FBckIsQ0FBMEIsQ0FBMUIsRUFBOEJ0QyxTQUE5QixLQUE0Q2UsYUFBakQsRUFBaUU7QUFDaEVDLFVBQUFBLGtCQUFrQixDQUFDdUIsSUFBbkIsQ0FBeUIzRSxDQUFDLENBQUUsSUFBRixDQUFELENBQVUrQixRQUFWLEdBQXFCMkMsR0FBckIsQ0FBMEIsQ0FBMUIsRUFBOEJ0QyxTQUF2RDtBQUNBO0FBQ0QsT0FKRCxFQUhrSCxDQVFsSDs7QUFDQW1CLE1BQUFBLElBQUksR0FBR3ZELENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVTZELE1BQVYsR0FBbUJBLE1BQW5CLEVBQVA7QUFDQTdELE1BQUFBLENBQUMsQ0FBRSxnQkFBRixFQUFvQnVELElBQXBCLENBQUQsQ0FBNEJPLElBQTVCO0FBQ0E5RCxNQUFBQSxDQUFDLENBQUUsaUJBQUYsRUFBcUJ1RCxJQUFyQixDQUFELENBQTZCUSxJQUE3QjtBQUNBL0QsTUFBQUEsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVNkQsTUFBVixHQUFtQkEsTUFBbkIsR0FBNEJHLFFBQTVCLENBQXNDLGVBQXRDO0FBQ0FoRSxNQUFBQSxDQUFDLENBQUUsSUFBRixDQUFELENBQVU2RCxNQUFWLEdBQW1CQSxNQUFuQixHQUE0QkksV0FBNUIsQ0FBeUMsZ0JBQXpDO0FBQ0FqRSxNQUFBQSxDQUFDLENBQUUsSUFBRixDQUFELENBQVU2RCxNQUFWLEdBQW1CQSxNQUFuQixHQUE0QkssTUFBNUIsQ0FBb0NwQixhQUFwQyxFQWRrSCxDQWVsSDs7QUFDQTlDLE1BQUFBLENBQUMsQ0FBRSxvQkFBRixDQUFELENBQTBCbUIsRUFBMUIsQ0FBOEIsT0FBOUIsRUFBdUMsb0JBQXZDLEVBQTZELFVBQVV1QyxLQUFWLEVBQWtCO0FBQzlFQSxRQUFBQSxLQUFLLENBQUNTLGNBQU47QUFDQW5FLFFBQUFBLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVTRFLE9BQVYsQ0FBbUIsSUFBbkIsRUFBMEJDLE9BQTFCLENBQW1DLFFBQW5DLEVBQTZDLFlBQVc7QUFDdkQ3RSxVQUFBQSxDQUFDLENBQUUsSUFBRixDQUFELENBQVV1RSxNQUFWO0FBQ0EsU0FGRDtBQUdBdkUsUUFBQUEsQ0FBQyxDQUFFLHVCQUFGLENBQUQsQ0FBNkIyRCxHQUE3QixDQUFrQ1Asa0JBQWtCLENBQUMwQixJQUFuQixDQUF5QixHQUF6QixDQUFsQztBQUNBQyxRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBYSxjQUFjNUIsa0JBQWtCLENBQUMwQixJQUFuQixDQUF5QixHQUF6QixDQUEzQjtBQUNBL0IsUUFBQUEsY0FBYyxHQUFHL0MsQ0FBQyxDQUFFLHlCQUFGLENBQUQsQ0FBK0J5RCxNQUFoRDtBQUNBakIsUUFBQUEsSUFBSSxDQUFDOEIsTUFBTDtBQUNBdEUsUUFBQUEsQ0FBQyxDQUFFLGlCQUFGLEVBQXFCdUQsSUFBSSxDQUFDTSxNQUFMLEVBQXJCLENBQUQsQ0FBc0NVLE1BQXRDO0FBQ0EsT0FWRDtBQVdBdkUsTUFBQUEsQ0FBQyxDQUFFLG9CQUFGLENBQUQsQ0FBMEJtQixFQUExQixDQUE4QixPQUE5QixFQUF1QyxpQkFBdkMsRUFBMEQsVUFBVXVDLEtBQVYsRUFBa0I7QUFDM0VBLFFBQUFBLEtBQUssQ0FBQ1MsY0FBTjtBQUNBbkUsUUFBQUEsQ0FBQyxDQUFFLGdCQUFGLEVBQW9CdUQsSUFBSSxDQUFDTSxNQUFMLEVBQXBCLENBQUQsQ0FBcUNFLElBQXJDO0FBQ0EvRCxRQUFBQSxDQUFDLENBQUUsaUJBQUYsRUFBcUJ1RCxJQUFJLENBQUNNLE1BQUwsRUFBckIsQ0FBRCxDQUFzQ1UsTUFBdEM7QUFDQSxPQUpEO0FBS0EsS0FoQ0Q7QUFpQ0EsR0FoR3NCLENBa0d2Qjs7O0FBQ0F2RSxFQUFBQSxDQUFDLENBQUUsZUFBRixDQUFELENBQXFCbUIsRUFBckIsQ0FBeUIsT0FBekIsRUFBa0MsNkJBQWxDLEVBQWlFLFVBQVV1QyxLQUFWLEVBQWtCO0FBQ2xGQSxJQUFBQSxLQUFLLENBQUNTLGNBQU47QUFDQW5FLElBQUFBLENBQUMsQ0FBQyw2QkFBRCxDQUFELENBQWlDaUYsTUFBakMsQ0FBeUMsbU1BQW1NbEMsY0FBbk0sR0FBb04sb0JBQXBOLEdBQTJPQSxjQUEzTyxHQUE0UCwrREFBclM7QUFDQUEsSUFBQUEsY0FBYztBQUNkLEdBSkQ7QUFNQS9DLEVBQUFBLENBQUMsQ0FBRSxvQkFBRixDQUFELENBQTBCQyxLQUExQixDQUFpQyxVQUFXQyxDQUFYLEVBQWU7QUFDL0MsUUFBSWdGLE1BQU0sR0FBR2xGLENBQUMsQ0FBRSxJQUFGLENBQWQ7QUFDQSxRQUFJbUYsV0FBVyxHQUFHRCxNQUFNLENBQUM1RSxPQUFQLENBQWdCLE1BQWhCLENBQWxCO0FBQ0E2RSxJQUFBQSxXQUFXLENBQUNDLElBQVosQ0FBa0IsbUJBQWxCLEVBQXVDRixNQUFNLENBQUN2QixHQUFQLEVBQXZDO0FBQ0EsR0FKRDtBQU1BM0QsRUFBQUEsQ0FBQyxDQUFFLGtCQUFGLENBQUQsQ0FBd0JtQixFQUF4QixDQUE0QixRQUE1QixFQUFzQyx3QkFBdEMsRUFBZ0UsVUFBVXVDLEtBQVYsRUFBa0I7QUFDakYsUUFBSWxCLElBQUksR0FBR3hDLENBQUMsQ0FBRSxJQUFGLENBQVo7QUFDQSxRQUFJcUYsaUJBQWlCLEdBQUc3QyxJQUFJLENBQUM0QyxJQUFMLENBQVcsbUJBQVgsS0FBb0MsRUFBNUQsQ0FGaUYsQ0FHakY7O0FBQ0EsUUFBSyxPQUFPQyxpQkFBUCxJQUE0QixtQkFBbUJBLGlCQUFwRCxFQUF3RTtBQUN2RTNCLE1BQUFBLEtBQUssQ0FBQ1MsY0FBTjtBQUNBYixNQUFBQSxjQUFjLEdBQUdkLElBQUksQ0FBQzhDLFNBQUwsRUFBakIsQ0FGdUUsQ0FFcEM7O0FBQ25DaEMsTUFBQUEsY0FBYyxHQUFHQSxjQUFjLEdBQUcsWUFBbEM7QUFDQXRELE1BQUFBLENBQUMsQ0FBQ3VGLElBQUYsQ0FBTztBQUNOL0QsUUFBQUEsR0FBRyxFQUFFcUIsUUFEQztBQUVOMUQsUUFBQUEsSUFBSSxFQUFFLE1BRkE7QUFHTnFHLFFBQUFBLFVBQVUsRUFBRSxvQkFBV0MsR0FBWCxFQUFpQjtBQUN0QkEsVUFBQUEsR0FBRyxDQUFDQyxnQkFBSixDQUFzQixZQUF0QixFQUFvQ2hELDRCQUE0QixDQUFDaUQsS0FBakU7QUFDSCxTQUxFO0FBTU5DLFFBQUFBLFFBQVEsRUFBRSxNQU5KO0FBT05SLFFBQUFBLElBQUksRUFBRTlCO0FBUEEsT0FBUCxFQVFHdUMsSUFSSCxDQVFTLFVBQVVULElBQVYsRUFBaUI7QUFDekIvQixRQUFBQSxTQUFTLEdBQUdyRCxDQUFDLENBQUUsNENBQUYsQ0FBRCxDQUFrRDhGLEdBQWxELENBQXVELFlBQVc7QUFDN0UsaUJBQU85RixDQUFDLENBQUMsSUFBRCxDQUFELENBQVEyRCxHQUFSLEVBQVA7QUFDQSxTQUZXLEVBRVRlLEdBRlMsRUFBWjtBQUdBMUUsUUFBQUEsQ0FBQyxDQUFDd0UsSUFBRixDQUFRbkIsU0FBUixFQUFtQixVQUFVb0IsS0FBVixFQUFpQmxGLEtBQWpCLEVBQXlCO0FBQzNDd0QsVUFBQUEsY0FBYyxHQUFHQSxjQUFjLEdBQUcwQixLQUFsQztBQUNBekUsVUFBQUEsQ0FBQyxDQUFFLG9CQUFGLENBQUQsQ0FBMEJrRSxNQUExQixDQUFrQyx3QkFBd0JuQixjQUF4QixHQUF5QyxJQUF6QyxHQUFnRHhELEtBQWhELEdBQXdELDJLQUF4RCxHQUFzT3dELGNBQXRPLEdBQXVQLFdBQXZQLEdBQXFReEQsS0FBclEsR0FBNlEsOEJBQTdRLEdBQThTd0QsY0FBOVMsR0FBK1Qsc0lBQS9ULEdBQXdjZ0Qsa0JBQWtCLENBQUV4RyxLQUFGLENBQTFkLEdBQXNlLCtJQUF0ZSxHQUF3bkJ3RCxjQUF4bkIsR0FBeW9CLHNCQUF6b0IsR0FBa3FCQSxjQUFscUIsR0FBbXJCLFdBQW5yQixHQUFpc0J4RCxLQUFqc0IsR0FBeXNCLDZCQUF6c0IsR0FBeXVCd0QsY0FBenVCLEdBQTB2QixnREFBNXhCO0FBQ0EvQyxVQUFBQSxDQUFDLENBQUUsdUJBQUYsQ0FBRCxDQUE2QjJELEdBQTdCLENBQWtDM0QsQ0FBQyxDQUFFLHVCQUFGLENBQUQsQ0FBNkIyRCxHQUE3QixLQUFxQyxHQUFyQyxHQUEyQ3BFLEtBQTdFO0FBQ0EsU0FKRDtBQUtBUyxRQUFBQSxDQUFDLENBQUUsMkNBQUYsQ0FBRCxDQUFpRHVFLE1BQWpEOztBQUNBLFlBQUt2RSxDQUFDLENBQUUsb0JBQUYsQ0FBRCxDQUEwQnlELE1BQTFCLEtBQXFDLENBQTFDLEVBQThDO0FBQzdDLGNBQUt6RCxDQUFDLENBQUUsNENBQUYsQ0FBRCxLQUFzREEsQ0FBQyxDQUFFLHFCQUFGLENBQTVELEVBQXdGO0FBQ3ZGO0FBQ0FGLFlBQUFBLFFBQVEsQ0FBQ2tHLE1BQVQ7QUFDQTtBQUNEO0FBQ0QsT0F4QkQ7QUF5QkE7QUFDRCxHQWxDRDtBQW1DQTs7QUFFRGhHLENBQUMsQ0FBRVUsUUFBRixDQUFELENBQWNDLEtBQWQsQ0FBcUIsVUFBV1gsQ0FBWCxFQUFlO0FBQ25DOztBQUNBLE1BQUtBLENBQUMsQ0FBQyxlQUFELENBQUQsQ0FBbUJ5RCxNQUFuQixHQUE0QixDQUFqQyxFQUFxQztBQUNwQ2xCLElBQUFBLFlBQVk7QUFDWjtBQUNELENBTEQ7OztBQ2hLQTs7Ozs7O0FBT0EwRCxTQUFTLENBQUUsb0JBQUYsQ0FBVDtBQUNBQSxTQUFTLENBQUUsb0NBQUYsQ0FBVDtBQUNBQyxjQUFjLENBQUUsb0JBQUYsQ0FBZDs7QUFFQSxTQUFTQSxjQUFULENBQXlCQyxTQUF6QixFQUFxQztBQUVwQyxNQUFJQyxrQkFBSixFQUF3QkMsZUFBeEIsRUFBeUNDLGFBQXpDO0FBRUFILEVBQUFBLFNBQVMsR0FBR3pGLFFBQVEsQ0FBQzZGLGNBQVQsQ0FBeUJKLFNBQXpCLENBQVo7O0FBQ0EsTUFBSyxDQUFFQSxTQUFQLEVBQW1CO0FBQ2xCO0FBQ0E7O0FBRURDLEVBQUFBLGtCQUFrQixHQUFHcEcsQ0FBQyxDQUFFLFdBQUYsRUFBZUEsQ0FBQyxDQUFFbUcsU0FBRixDQUFoQixDQUF0QjtBQUNBRSxFQUFBQSxlQUFlLEdBQU1yRyxDQUFDLENBQUUsYUFBRixFQUFpQkEsQ0FBQyxDQUFFbUcsU0FBRixDQUFsQixDQUF0QjtBQUNBRyxFQUFBQSxhQUFhLEdBQVFILFNBQVMsQ0FBQ0ssb0JBQVYsQ0FBZ0MsTUFBaEMsRUFBeUMsQ0FBekMsQ0FBckI7O0FBRUEsTUFBSyxnQkFBZ0IsT0FBT0gsZUFBdkIsSUFBMEMsZ0JBQWdCLE9BQU9DLGFBQXRFLEVBQXNGO0FBQ3JGO0FBQ0E7O0FBRUQsTUFBS3RHLENBQUMsQ0FBRXNHLGFBQUYsQ0FBRCxDQUFtQjdDLE1BQW5CLEdBQTRCLENBQWpDLEVBQXFDO0FBQ3BDekQsSUFBQUEsQ0FBQyxDQUFFVSxRQUFGLENBQUQsQ0FBY1QsS0FBZCxDQUFxQixVQUFVeUQsS0FBVixFQUFrQjtBQUN0QyxVQUFJK0MsT0FBTyxHQUFHekcsQ0FBQyxDQUFFMEQsS0FBSyxDQUFDZ0QsTUFBUixDQUFmOztBQUNBLFVBQUssQ0FBRUQsT0FBTyxDQUFDbkcsT0FBUixDQUFpQjhGLGtCQUFqQixFQUFzQzNDLE1BQXhDLElBQWtEekQsQ0FBQyxDQUFFc0csYUFBRixDQUFELENBQW1CSyxFQUFuQixDQUF1QixVQUF2QixDQUF2RCxFQUE2RjtBQUM1RkwsUUFBQUEsYUFBYSxDQUFDTSxTQUFkLEdBQTBCTixhQUFhLENBQUNNLFNBQWQsQ0FBd0JoRCxPQUF4QixDQUFpQyxlQUFqQyxFQUFrRCxFQUFsRCxDQUExQjtBQUNBNUQsUUFBQUEsQ0FBQyxDQUFFcUcsZUFBRixDQUFELENBQXFCN0MsSUFBckIsQ0FBMkIsZUFBM0IsRUFBNEMsS0FBNUM7QUFDQXhELFFBQUFBLENBQUMsQ0FBRXFHLGVBQUYsQ0FBRCxDQUFxQnBDLFdBQXJCLENBQWtDLGNBQWxDO0FBQ0E7QUFDRCxLQVBEO0FBUUFqRSxJQUFBQSxDQUFDLENBQUVxRyxlQUFGLENBQUQsQ0FBcUJsRixFQUFyQixDQUF5QixPQUF6QixFQUFrQyxVQUFVdUMsS0FBVixFQUFrQjtBQUNuREEsTUFBQUEsS0FBSyxDQUFDUyxjQUFOOztBQUNBLFVBQUssQ0FBQyxDQUFELEtBQU9tQyxhQUFhLENBQUNNLFNBQWQsQ0FBd0JDLE9BQXhCLENBQWlDLGNBQWpDLENBQVosRUFBZ0U7QUFDL0RQLFFBQUFBLGFBQWEsQ0FBQ00sU0FBZCxHQUEwQk4sYUFBYSxDQUFDTSxTQUFkLENBQXdCaEQsT0FBeEIsQ0FBaUMsZUFBakMsRUFBa0QsRUFBbEQsQ0FBMUI7QUFDQTVELFFBQUFBLENBQUMsQ0FBRXFHLGVBQUYsQ0FBRCxDQUFxQjdDLElBQXJCLENBQTJCLGVBQTNCLEVBQTRDLEtBQTVDO0FBQ0F4RCxRQUFBQSxDQUFDLENBQUVxRyxlQUFGLENBQUQsQ0FBcUJwQyxXQUFyQixDQUFrQyxjQUFsQztBQUNBLE9BSkQsTUFJTztBQUNOcUMsUUFBQUEsYUFBYSxDQUFDTSxTQUFkLElBQTJCLGVBQTNCO0FBQ0E1RyxRQUFBQSxDQUFDLENBQUVxRyxlQUFGLENBQUQsQ0FBcUI3QyxJQUFyQixDQUEyQixlQUEzQixFQUE0QyxJQUE1QztBQUNBeEQsUUFBQUEsQ0FBQyxDQUFFcUcsZUFBRixDQUFELENBQXFCckMsUUFBckIsQ0FBK0IsY0FBL0I7QUFDQTtBQUNELEtBWEQ7QUFZQTtBQUNEOztBQUVELFNBQVNpQyxTQUFULENBQW9CRSxTQUFwQixFQUFnQztBQUMvQixNQUFJakIsTUFBSixFQUFZNEIsSUFBWixFQUFrQkMsS0FBbEIsRUFBeUJDLENBQXpCLEVBQTRCQyxHQUE1QjtBQUNBZCxFQUFBQSxTQUFTLEdBQUd6RixRQUFRLENBQUM2RixjQUFULENBQXlCSixTQUF6QixDQUFaOztBQUNBLE1BQUssQ0FBRUEsU0FBUCxFQUFtQjtBQUNsQjtBQUNBOztBQUVEakIsRUFBQUEsTUFBTSxHQUFHaUIsU0FBUyxDQUFDSyxvQkFBVixDQUFnQyxRQUFoQyxFQUEyQyxDQUEzQyxDQUFUOztBQUNBLE1BQUssZ0JBQWdCLE9BQU90QixNQUE1QixFQUFxQztBQUNwQztBQUNBOztBQUVENEIsRUFBQUEsSUFBSSxHQUFHWCxTQUFTLENBQUNLLG9CQUFWLENBQWdDLElBQWhDLEVBQXVDLENBQXZDLENBQVAsQ0FaK0IsQ0FjL0I7O0FBQ0EsTUFBSyxnQkFBZ0IsT0FBT00sSUFBNUIsRUFBbUM7QUFDbEM1QixJQUFBQSxNQUFNLENBQUNnQyxLQUFQLENBQWFDLE9BQWIsR0FBdUIsTUFBdkI7QUFDQTtBQUNBOztBQUVETCxFQUFBQSxJQUFJLENBQUNNLFlBQUwsQ0FBbUIsZUFBbkIsRUFBb0MsT0FBcEM7O0FBQ0EsTUFBSyxDQUFDLENBQUQsS0FBT04sSUFBSSxDQUFDRixTQUFMLENBQWVDLE9BQWYsQ0FBd0IsTUFBeEIsQ0FBWixFQUErQztBQUM5Q0MsSUFBQUEsSUFBSSxDQUFDRixTQUFMLElBQWtCLE9BQWxCO0FBQ0E7O0FBRUQxQixFQUFBQSxNQUFNLENBQUNtQyxPQUFQLEdBQWlCLFlBQVc7QUFDM0IsUUFBSyxDQUFDLENBQUQsS0FBT2xCLFNBQVMsQ0FBQ1MsU0FBVixDQUFvQkMsT0FBcEIsQ0FBNkIsU0FBN0IsQ0FBWixFQUF1RDtBQUN0RFYsTUFBQUEsU0FBUyxDQUFDUyxTQUFWLEdBQXNCVCxTQUFTLENBQUNTLFNBQVYsQ0FBb0JoRCxPQUFwQixDQUE2QixVQUE3QixFQUF5QyxFQUF6QyxDQUF0QjtBQUNBc0IsTUFBQUEsTUFBTSxDQUFDa0MsWUFBUCxDQUFxQixlQUFyQixFQUFzQyxPQUF0QztBQUNBTixNQUFBQSxJQUFJLENBQUNNLFlBQUwsQ0FBbUIsZUFBbkIsRUFBb0MsT0FBcEM7QUFDQSxLQUpELE1BSU87QUFDTmpCLE1BQUFBLFNBQVMsQ0FBQ1MsU0FBVixJQUF1QixVQUF2QjtBQUNBMUIsTUFBQUEsTUFBTSxDQUFDa0MsWUFBUCxDQUFxQixlQUFyQixFQUFzQyxNQUF0QztBQUNBTixNQUFBQSxJQUFJLENBQUNNLFlBQUwsQ0FBbUIsZUFBbkIsRUFBb0MsTUFBcEM7QUFDQTtBQUNELEdBVkQsQ0F6QitCLENBcUMvQjs7O0FBQ0FMLEVBQUFBLEtBQUssR0FBTUQsSUFBSSxDQUFDTixvQkFBTCxDQUEyQixHQUEzQixDQUFYLENBdEMrQixDQXdDL0I7O0FBQ0EsT0FBTVEsQ0FBQyxHQUFHLENBQUosRUFBT0MsR0FBRyxHQUFHRixLQUFLLENBQUN0RCxNQUF6QixFQUFpQ3VELENBQUMsR0FBR0MsR0FBckMsRUFBMENELENBQUMsRUFBM0MsRUFBZ0Q7QUFDL0NELElBQUFBLEtBQUssQ0FBQ0MsQ0FBRCxDQUFMLENBQVNNLGdCQUFULENBQTJCLE9BQTNCLEVBQW9DQyxXQUFwQyxFQUFpRCxJQUFqRDtBQUNBUixJQUFBQSxLQUFLLENBQUNDLENBQUQsQ0FBTCxDQUFTTSxnQkFBVCxDQUEyQixNQUEzQixFQUFtQ0MsV0FBbkMsRUFBZ0QsSUFBaEQ7QUFDQTtBQUVEOzs7OztBQUdFLGFBQVVwQixTQUFWLEVBQXNCO0FBQ3ZCLFFBQUlxQixZQUFKO0FBQUEsUUFBa0JSLENBQWxCO0FBQUEsUUFDQ1MsVUFBVSxHQUFHdEIsU0FBUyxDQUFDdUIsZ0JBQVYsQ0FBNEIsMERBQTVCLENBRGQ7O0FBR0EsUUFBSyxrQkFBa0JDLE1BQXZCLEVBQWdDO0FBQy9CSCxNQUFBQSxZQUFZLEdBQUcsc0JBQVV0SCxDQUFWLEVBQWM7QUFDNUIsWUFBSTBILFFBQVEsR0FBRyxLQUFLQyxVQUFwQjtBQUFBLFlBQWdDYixDQUFoQzs7QUFFQSxZQUFLLENBQUVZLFFBQVEsQ0FBQ0UsU0FBVCxDQUFtQkMsUUFBbkIsQ0FBNkIsT0FBN0IsQ0FBUCxFQUFnRDtBQUMvQzdILFVBQUFBLENBQUMsQ0FBQ2lFLGNBQUY7O0FBQ0EsZUFBTTZDLENBQUMsR0FBRyxDQUFWLEVBQWFBLENBQUMsR0FBR1ksUUFBUSxDQUFDQyxVQUFULENBQW9CRyxRQUFwQixDQUE2QnZFLE1BQTlDLEVBQXNELEVBQUV1RCxDQUF4RCxFQUE0RDtBQUMzRCxnQkFBS1ksUUFBUSxLQUFLQSxRQUFRLENBQUNDLFVBQVQsQ0FBb0JHLFFBQXBCLENBQTZCaEIsQ0FBN0IsQ0FBbEIsRUFBb0Q7QUFDbkQ7QUFDQTs7QUFDRFksWUFBQUEsUUFBUSxDQUFDQyxVQUFULENBQW9CRyxRQUFwQixDQUE2QmhCLENBQTdCLEVBQWdDYyxTQUFoQyxDQUEwQ3ZELE1BQTFDLENBQWtELE9BQWxEO0FBQ0E7O0FBQ0RxRCxVQUFBQSxRQUFRLENBQUNFLFNBQVQsQ0FBbUJHLEdBQW5CLENBQXdCLE9BQXhCO0FBQ0EsU0FURCxNQVNPO0FBQ05MLFVBQUFBLFFBQVEsQ0FBQ0UsU0FBVCxDQUFtQnZELE1BQW5CLENBQTJCLE9BQTNCO0FBQ0E7QUFDRCxPQWZEOztBQWlCQSxXQUFNeUMsQ0FBQyxHQUFHLENBQVYsRUFBYUEsQ0FBQyxHQUFHUyxVQUFVLENBQUNoRSxNQUE1QixFQUFvQyxFQUFFdUQsQ0FBdEMsRUFBMEM7QUFDekNTLFFBQUFBLFVBQVUsQ0FBQ1QsQ0FBRCxDQUFWLENBQWNNLGdCQUFkLENBQWdDLFlBQWhDLEVBQThDRSxZQUE5QyxFQUE0RCxLQUE1RDtBQUNBO0FBQ0Q7QUFDRCxHQTFCQyxFQTBCQ3JCLFNBMUJELENBQUY7QUEyQkE7QUFFRDs7Ozs7QUFHQSxTQUFTb0IsV0FBVCxHQUF1QjtBQUN0QixNQUFJVyxJQUFJLEdBQUcsSUFBWCxDQURzQixDQUd0Qjs7QUFDQSxTQUFRLENBQUMsQ0FBRCxLQUFPQSxJQUFJLENBQUN0QixTQUFMLENBQWVDLE9BQWYsQ0FBd0IsTUFBeEIsQ0FBZixFQUFrRDtBQUVqRDtBQUNBLFFBQUssU0FBU3FCLElBQUksQ0FBQ0MsT0FBTCxDQUFhQyxXQUFiLEVBQWQsRUFBMkM7QUFDMUMsVUFBSyxDQUFDLENBQUQsS0FBT0YsSUFBSSxDQUFDdEIsU0FBTCxDQUFlQyxPQUFmLENBQXdCLE9BQXhCLENBQVosRUFBZ0Q7QUFDL0NxQixRQUFBQSxJQUFJLENBQUN0QixTQUFMLEdBQWlCc0IsSUFBSSxDQUFDdEIsU0FBTCxDQUFlaEQsT0FBZixDQUF3QixRQUF4QixFQUFrQyxFQUFsQyxDQUFqQjtBQUNBLE9BRkQsTUFFTztBQUNOc0UsUUFBQUEsSUFBSSxDQUFDdEIsU0FBTCxJQUFrQixRQUFsQjtBQUNBO0FBQ0Q7O0FBRURzQixJQUFBQSxJQUFJLEdBQUdBLElBQUksQ0FBQ0csYUFBWjtBQUNBO0FBQ0QsQyxDQUVEOzs7QUFDQXJJLENBQUMsQ0FBRVUsUUFBRixDQUFELENBQWNDLEtBQWQsQ0FBb0IsWUFBVztBQUM5QjtBQUNBLE1BQUlYLENBQUMsQ0FBQyx5QkFBRCxDQUFELENBQTZCeUQsTUFBN0IsR0FBc0MsQ0FBMUMsRUFBOEM7QUFDN0N6RCxJQUFBQSxDQUFDLENBQUMsK0JBQUQsQ0FBRCxDQUFtQ21CLEVBQW5DLENBQXVDLE9BQXZDLEVBQWdELFVBQVN1QyxLQUFULEVBQWdCO0FBQy9EMUQsTUFBQUEsQ0FBQyxDQUFDLHlCQUFELENBQUQsQ0FBNkJzSSxXQUE3QixDQUEwQyxTQUExQztBQUNBNUUsTUFBQUEsS0FBSyxDQUFDUyxjQUFOO0FBQ0EsS0FIRDtBQUlBO0FBQ0QsQ0FSRCIsImZpbGUiOiJtaW5ucG9zdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICkge1xuXHRpZiAoIHR5cGVvZiBnYSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0aWYgKCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG5mdW5jdGlvbiB0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApIHtcblxuXHQvLyBpZiBhIG5vdCBsb2dnZWQgaW4gdXNlciB0cmllcyB0byBlbWFpbCwgZG9uJ3QgY291bnQgdGhhdCBhcyBhIHNoYXJlXG5cdGlmICggISBqUXVlcnkoICdib2R5ICcpLmhhc0NsYXNzKCAnbG9nZ2VkLWluJykgJiYgJ0VtYWlsJyA9PT0gdGV4dCApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyB0cmFjayBhcyBhbiBldmVudCwgYW5kIGFzIHNvY2lhbCBpZiBpdCBpcyB0d2l0dGVyIG9yIGZiXG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1NoYXJlIC0gJyArIHBvc2l0aW9uLCB0ZXh0LCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0IHx8ICdUd2l0dGVyJyA9PT0gdGV4dCApIHtcblx0XHRcdGlmICggdGV4dCA9PSAnRmFjZWJvb2snICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuJCAoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLnRleHQoKS50cmltKCk7XG5cdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSk7XG5cbiQgKCAnLm0tZW50cnktc2hhcmUtYm90dG9tIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHR2YXIgdGV4dCA9ICQoIHRoaXMgKS50ZXh0KCkudHJpbSgpO1xuXHR2YXIgcG9zaXRpb24gPSAnYm90dG9tJztcblx0dHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcbn0pO1xuXG4kKCAnI25hdmlnYXRpb24tZmVhdHVyZWQgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ0ZlYXR1cmVkIEJhciBMaW5rJywgJ0NsaWNrJywgdGhpcy5ocmVmICk7XG59KTtcbiQoICdhLmdsZWFuLXNpZGViYXInICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdTaWRlYmFyIFN1cHBvcnQgTGluaycsICdDbGljaycsIHRoaXMuaHJlZiApO1xufSk7XG5cbiQoICdhJywgJCggJy5vLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0dmFyIHdpZGdldF90aXRsZSA9ICQodGhpcykuY2xvc2VzdCgnLm0td2lkZ2V0JykuZmluZCgnaDMnKS50ZXh0KCk7XG5cdHZhciB6b25lX3RpdGxlICAgPSAkKHRoaXMpLmNsb3Nlc3QoJy5tLXpvbmUnKS5maW5kKCcuYS16b25lLXRpdGxlJykudGV4dCgpO1xuXHR2YXIgc2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gJyc7XG5cdGlmICggJycgIT09IHdpZGdldF90aXRsZSApIHtcblx0XHRzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSB3aWRnZXRfdGl0bGU7XG5cdH0gZWxzZSBpZiAoICcnICE9PSB6b25lX3RpdGxlICkge1xuXHRcdHNpZGViYXJfc2VjdGlvbl90aXRsZSA9IHpvbmVfdGl0bGU7XG5cdH1cblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCdldmVudCcsICdTaWRlYmFyIExpbmsnLCAnQ2xpY2snLCBzaWRlYmFyX3NlY3Rpb25fdGl0bGUpO1xufSk7XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uICggZSApIHtcblxuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgUFVNICkge1xuXHRcdHZhciBjdXJyZW50X3BvcHVwID0gUFVNLmdldFBvcHVwKCAkKCAnLnB1bScgKSApO1xuXHRcdHZhciBzZXR0aW5ncyA9IFBVTS5nZXRTZXR0aW5ncyggJCggJy5wdW0nICkgKTtcblx0XHR2YXIgcG9wdXBfaWQgPSBzZXR0aW5ncy5pZDtcblx0XHQkKCBkb2N1bWVudCApLm9uKCdwdW1BZnRlck9wZW4nLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdTaG93JywgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9ICk7XG5cdFx0fSk7XG5cdFx0JCggZG9jdW1lbnQgKS5vbigncHVtQWZ0ZXJDbG9zZScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJC5mbi5wb3BtYWtlLmxhc3RfY2xvc2VfdHJpZ2dlcjtcblx0XHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBjbG9zZV90cmlnZ2VyICkge1xuXHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCQoICcubWVzc2FnZS1jbG9zZScgKS5jbGljayhmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGNsb3NlIGNsYXNzXG5cdFx0XHR2YXIgY2xvc2VfdHJpZ2dlciA9ICdDbG9zZSBCdXR0b24nO1xuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCBjbG9zZV90cmlnZ2VyLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0gKTtcblx0XHR9KTtcblx0XHQkKCAnLm1lc3NhZ2UtbG9naW4nICkuY2xpY2soZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIGxpbmsgd2l0aCBsb2dpbiBjbGFzc1xuXHRcdFx0dmFyIHVybCA9ICQodGhpcykuYXR0cignaHJlZicpO1xuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnTG9naW4gTGluaycsIHVybCApO1xuXHRcdH0pO1xuXHRcdCQoICcucHVtLWNvbnRlbnQgYTpub3QoIC5tZXNzYWdlLWNsb3NlLCAucHVtLWNsb3NlLCAubWVzc2FnZS1sb2dpbiApJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3Mgc29tZXRoaW5nIHRoYXQgaXMgbm90IGNsb3NlIHRleHQgb3IgY2xvc2UgaWNvblxuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnQ2xpY2snLCBwb3B1cF9pZCApO1xuICAgICAgICB9KTtcblx0fVxuXG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEgJiYgJycgIT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS51cmxfYWNjZXNzX2xldmVsICkge1xuXHRcdHZhciB0eXBlID0gJ2V2ZW50Jztcblx0XHR2YXIgY2F0ZWdvcnkgPSAnTWVtYmVyIENvbnRlbnQnO1xuXHRcdHZhciBsYWJlbCA9IGxvY2F0aW9uLnBhdGhuYW1lOyAvLyBpIHRoaW5rIHdlIGNvdWxkIHBvc3NpYmx5IHB1dCBzb21lIGdyb3VwaW5nIGhlcmUsIGJ1dCB3ZSBkb24ndCBuZWNlc3NhcmlseSBoYXZlIGFjY2VzcyB0byBvbmUgYW5kIG1heWJlIGl0J3Mgbm90IHdvcnRod2hpbGUgeWV0XG5cdFx0dmFyIGFjdGlvbiA9ICdCbG9ja2VkJztcblx0XHRpZiAoIHRydWUgPT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS5jdXJyZW50X3VzZXIuY2FuX2FjY2VzcyApIHtcblx0XHRcdGFjdGlvbiA9ICdTaG93bic7XG5cdFx0fVxuXHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0fVxufSk7XG4iLCJcbmpRdWVyeS5mbi50ZXh0Tm9kZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY29udGVudHMoKS5maWx0ZXIoZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICh0aGlzLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSAmJiB0aGlzLm5vZGVWYWx1ZS50cmltKCkgIT09IFwiXCIpO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggYWN0aW9uICkge1xuXHR2YXIgbWFya3VwID0gJzxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtZm9ybS1jb25maXJtXCI+PGxhYmVsPkFyZSB5b3Ugc3VyZT8gPGEgaWQ9XCJhLWNvbmZpcm0tJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPlllczwvYT4gfCA8YSBpZD1cImEtc3RvcC0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+Tm88L2E+PC9sYWJlbD48L2xpPic7XG5cdHJldHVybiBtYXJrdXA7XG59XG5cbmZ1bmN0aW9uIG1hbmFnZUVtYWlscygpIHtcblx0dmFyIGZvcm0gICAgICAgICAgICAgICA9ICQoJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nKTtcblx0dmFyIHJlc3Rfcm9vdCAgICAgICAgICA9IHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Quc2l0ZV91cmwgKyB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnJlc3RfbmFtZXNwYWNlO1xuXHR2YXIgZnVsbF91cmwgICAgICAgICAgID0gcmVzdF9yb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdHZhciBjb25maXJtQ2hhbmdlICAgICAgPSAnJztcblx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdHZhciBuZXdQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIG9sZFByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0dmFyIGNvbnNvbGlkYXRlZEVtYWlscyA9IFtdO1xuXHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdHZhciBhamF4X2Zvcm1fZGF0YSAgICAgPSAnJztcblx0dmFyIHRoYXQgICAgICAgICAgICAgICA9ICcnO1xuXHQvLyBzdGFydCBvdXQgd2l0aCBubyBwcmltYXJ5L3JlbW92YWxzIGNoZWNrZWRcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdC8vIGlmIHRoZXJlIGlzIGEgbGlzdCBvZiBlbWFpbHMgKG5vdCBqdXN0IGEgc2luZ2xlIGZvcm0gZmllbGQpXG5cdGlmICggJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggPiAwICkge1xuXHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHQvLyBpZiBhIHVzZXIgc2VsZWN0cyBhIG5ldyBwcmltYXJ5LCBtb3ZlIGl0IGludG8gdGhhdCBwb3NpdGlvblxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XG5cdFx0XHRuZXdQcmltYXJ5RW1haWwgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRvbGRQcmltYXJ5RW1haWwgPSAkKCAnI2VtYWlsJyApLnZhbCgpO1xuXHRcdFx0cHJpbWFyeUlkICAgICAgID0gJCggdGhpcyApLnByb3AoICdpZCcgKS5yZXBsYWNlKCAncHJpbWFyeV9lbWFpbF8nLCAnJyApO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3ByaW1hcnktY2hhbmdlJyApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSB1c2VyIGZhY2luZyB2YWx1ZXNcblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG5ld1ByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3VzZXItZW1haWwtJyArIHByaW1hcnlJZCApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIG1haW4gaGlkZGVuIGZvcm0gdmFsdWVcblx0XHRcdFx0JCggJyNlbWFpbCcgKS52YWwoIG5ld1ByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQvLyBzdWJtaXQgZm9ybSB2YWx1ZXMuXG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdC8vIHVuY2hlY2sgdGhlIHJhZGlvIGJ1dHRvblxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgZm9ybSB2YWx1ZXMgdG8gdGhlIG9sZCBwcmltYXJ5IGVtYWlsXG5cdFx0XHRcdCQoICcjcHJpbWFyeV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyNyZW1vdmVfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgY29uZmlybSBtZXNzYWdlXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjaGFuZ2UnLCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG5cdFx0XHRcdGlmICggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICE9PSBlbWFpbFRvUmVtb3ZlICkge1xuXHRcdFx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscy5wdXNoKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXIgZm9yIHJlbW92YWxcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHQvLyBpZiBjb25maXJtZWQsIHJlbW92ZSB0aGUgZW1haWwgYW5kIHN1Ym1pdCB0aGUgZm9ybVxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5mYWRlT3V0KCAnbm9ybWFsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLnJlbW92ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRjb25zb2xlLmxvZyggJ3ZhbHVlIGlzICcgKyBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcpLmJlZm9yZSggJzxkaXYgY2xhc3M9XCJhLWlucHV0LXdpdGgtYnV0dG9uIGEtYnV0dG9uLXNlbnRlbmNlXCI+PGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgaWQ9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgdmFsdWU9XCJcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBuYW1lPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGlkPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGNsYXNzPVwiYS1idXR0b24gYS1idXR0b24tYWRkLXVzZXItZW1haWxcIj5BZGQ8L2J1dHRvbj48L2Rpdj4nICk7XG5cdFx0bmV4dEVtYWlsQ291bnQrKztcblx0fSk7XG5cblx0JCggJ2lucHV0W3R5cGU9c3VibWl0XScgKS5jbGljayggZnVuY3Rpb24gKCBlICkge1xuXHRcdHZhciBidXR0b24gPSAkKCB0aGlzICk7XG5cdFx0dmFyIGJ1dHRvbl9mb3JtID0gYnV0dG9uLmNsb3Nlc3QoICdmb3JtJyApO1xuXHRcdGJ1dHRvbl9mb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicsIGJ1dHRvbi52YWwoKSApO1xuXHR9KTtcblxuXHQkKCAnLm0tZW50cnktY29udGVudCcgKS5vbiggJ3N1Ym1pdCcsICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdHZhciBmb3JtID0gJCggdGhpcyApO1xuXHRcdHZhciBzdWJtaXR0aW5nX2J1dHRvbiA9IGZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJyApIHx8ICcnO1xuXHRcdC8vIGlmIHRoZXJlIGlzIG5vIHN1Ym1pdHRpbmcgYnV0dG9uLCBwYXNzIGl0IGJ5IEFqYXhcblx0XHRpZiAoICcnID09PSBzdWJtaXR0aW5nX2J1dHRvbiB8fCAnU2F2ZSBDaGFuZ2VzJyAhPT0gc3VibWl0dGluZ19idXR0b24gKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4X2Zvcm1fZGF0YSA9IGFqYXhfZm9ybV9kYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dXJsOiBmdWxsX3VybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcblx0XHRcdCAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0ICAgIH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhfZm9ybV9kYXRhXG5cdFx0XHR9KS5kb25lKCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQodGhpcykudmFsKCk7XG5cdFx0XHRcdH0pLmdldCgpO1xuXHRcdFx0XHQkLmVhY2goIG5ld0VtYWlscywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9IG5leHRFbWFpbENvdW50ICsgaW5kZXg7XG5cdFx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5hcHBlbmQoICc8bGkgaWQ9XCJ1c2VyLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIj4nICsgdmFsdWUgKyAnPHVsIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS11c2VyLWVtYWlsLWFjdGlvbnNcIj48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtbWFrZS1wcmltYXJ5LWVtYWlsXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJwcmltYXJ5X2VtYWlsXCIgaWQ9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPk1ha2UgUHJpbWFyeTwvc21hbGw+PC9sYWJlbD48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1lbWFpbC1wcmVmZXJlbmNlc1wiPjxhIGhyZWY9XCIvbmV3c2xldHRlcnMvP2VtYWlsPScgKyBlbmNvZGVVUklDb21wb25lbnQoIHZhbHVlICkgKyAnXCI+PHNtYWxsPkVtYWlsIFByZWZlcmVuY2VzPC9zbWFsbD48L2E+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtcmVtb3ZlLWVtYWlsXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJyZW1vdmVfZW1haWxbJyArIG5leHRFbWFpbENvdW50ICsgJ11cIiBpZD1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPlJlbW92ZTwvc21hbGw+PC9sYWJlbD48L2xpPjwvdWw+PC9saT4nICk7XG5cdFx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoICQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCkgKyAnLCcgKyB2YWx1ZSApO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JCggJy5tLWZvcm0tY2hhbmdlLWVtYWlsIC5hLWlucHV0LXdpdGgtYnV0dG9uJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRpZiAoICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoID09PSAwICkge1xuXHRcdFx0XHRcdGlmICggJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApICE9PSAkKCAnaW5wdXRbbmFtZT1cImVtYWlsXCJdJyApICkge1xuXHRcdFx0XHRcdFx0Ly8gaXQgd291bGQgYmUgbmljZSB0byBvbmx5IGxvYWQgdGhlIGZvcm0sIGJ1dCB0aGVuIGNsaWNrIGV2ZW50cyBzdGlsbCBkb24ndCB3b3JrXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uICggJCApIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdGlmICggJCgnLm0tZm9ybS1lbWFpbCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cbn0pO1xuIiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogSGFuZGxlcyB0b2dnbGluZyB0aGUgbmF2aWdhdGlvbiBtZW51IGZvciBzbWFsbCBzY3JlZW5zIGFuZCBlbmFibGVzIFRBQiBrZXlcbiAqIG5hdmlnYXRpb24gc3VwcG9ydCBmb3IgZHJvcGRvd24gbWVudXMuXG4gKi9cblxuc2V0dXBNZW51KCAnbmF2aWdhdGlvbi1wcmltYXJ5JyApO1xuc2V0dXBNZW51KCAnbmF2aWdhdGlvbi11c2VyLWFjY291bnQtbWFuYWdlbWVudCcgKTtcbnNldHVwTmF2U2VhcmNoKCAnbmF2aWdhdGlvbi1wcmltYXJ5JyApO1xuXG5mdW5jdGlvbiBzZXR1cE5hdlNlYXJjaCggY29udGFpbmVyICkge1xuXG5cdHZhciBuYXZzZWFyY2hjb250YWluZXIsIG5hdnNlYXJjaHRvZ2dsZSwgbmF2c2VhcmNoZm9ybTtcblxuXHRjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggY29udGFpbmVyICk7XG5cdGlmICggISBjb250YWluZXIgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bmF2c2VhcmNoY29udGFpbmVyID0gJCggJ2xpLnNlYXJjaCcsICQoIGNvbnRhaW5lciApICk7XG5cdG5hdnNlYXJjaHRvZ2dsZSAgICA9ICQoICdsaS5zZWFyY2ggYScsICQoIGNvbnRhaW5lciApICk7XG5cdG5hdnNlYXJjaGZvcm0gICAgICA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2Zvcm0nIClbMF07XG5cblx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5hdnNlYXJjaHRvZ2dsZSB8fCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5hdnNlYXJjaGZvcm0gKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKCAkKCBuYXZzZWFyY2hmb3JtICkubGVuZ3RoID4gMCApIHtcblx0XHQkKCBkb2N1bWVudCApLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHR2YXIgJHRhcmdldCA9ICQoIGV2ZW50LnRhcmdldCApO1xuXHRcdFx0aWYgKCAhICR0YXJnZXQuY2xvc2VzdCggbmF2c2VhcmNoY29udGFpbmVyICkubGVuZ3RoICYmICQoIG5hdnNlYXJjaGZvcm0gKS5pcyggJzp2aXNpYmxlJyApICkge1xuXHRcdFx0XHRuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZSA9IG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lLnJlcGxhY2UoICcgdG9nZ2xlZC1mb3JtJywgJycgKTtcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucHJvcCggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5yZW1vdmVDbGFzcyggJ3RvZ2dsZWQtZm9ybScgKTtcblx0XHRcdH0gICAgICAgIFxuXHRcdH0pO1xuXHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0aWYgKCAtMSAhPT0gbmF2c2VhcmNoZm9ybS5jbGFzc05hbWUuaW5kZXhPZiggJ3RvZ2dsZWQtZm9ybScgKSApIHtcblx0XHRcdFx0bmF2c2VhcmNoZm9ybS5jbGFzc05hbWUgPSBuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZS5yZXBsYWNlKCAnIHRvZ2dsZWQtZm9ybScsICcnICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnByb3AoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucmVtb3ZlQ2xhc3MoICd0b2dnbGVkLWZvcm0nICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZSArPSAnIHRvZ2dsZWQtZm9ybSc7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnByb3AoICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5hZGRDbGFzcyggJ3RvZ2dsZWQtZm9ybScgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzZXR1cE1lbnUoIGNvbnRhaW5lciApIHtcblx0dmFyIGJ1dHRvbiwgbWVudSwgbGlua3MsIGksIGxlbjtcblx0Y29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGNvbnRhaW5lciApO1xuXHRpZiAoICEgY29udGFpbmVyICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGJ1dHRvbiA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2J1dHRvbicgKVswXTtcblx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIGJ1dHRvbiApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRtZW51ID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAndWwnIClbMF07XG5cblx0Ly8gSGlkZSBtZW51IHRvZ2dsZSBidXR0b24gaWYgbWVudSBpcyBlbXB0eSBhbmQgcmV0dXJuIGVhcmx5LlxuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgbWVudSApIHtcblx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRyZXR1cm47XG5cdH1cblxuXHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdGlmICggLTEgPT09IG1lbnUuY2xhc3NOYW1lLmluZGV4T2YoICdtZW51JyApICkge1xuXHRcdG1lbnUuY2xhc3NOYW1lICs9ICcgbWVudSc7XG5cdH1cblxuXHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggLTEgIT09IGNvbnRhaW5lci5jbGFzc05hbWUuaW5kZXhPZiggJ3RvZ2dsZWQnICkgKSB7XG5cdFx0XHRjb250YWluZXIuY2xhc3NOYW1lID0gY29udGFpbmVyLmNsYXNzTmFtZS5yZXBsYWNlKCAnIHRvZ2dsZWQnLCAnJyApO1xuXHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgKz0gJyB0b2dnbGVkJztcblx0XHRcdGJ1dHRvbi5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnICk7XG5cdFx0XHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gR2V0IGFsbCB0aGUgbGluayBlbGVtZW50cyB3aXRoaW4gdGhlIG1lbnUuXG5cdGxpbmtzICAgID0gbWVudS5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2EnICk7XG5cblx0Ly8gRWFjaCB0aW1lIGEgbWVudSBsaW5rIGlzIGZvY3VzZWQgb3IgYmx1cnJlZCwgdG9nZ2xlIGZvY3VzLlxuXHRmb3IgKCBpID0gMCwgbGVuID0gbGlua3MubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0bGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ2ZvY3VzJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0XHRsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCAnYmx1cicsIHRvZ2dsZUZvY3VzLCB0cnVlICk7XG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyBgZm9jdXNgIGNsYXNzIHRvIGFsbG93IHN1Ym1lbnUgYWNjZXNzIG9uIHRhYmxldHMuXG5cdCAqL1xuXHQoIGZ1bmN0aW9uKCBjb250YWluZXIgKSB7XG5cdFx0dmFyIHRvdWNoU3RhcnRGbiwgaSxcblx0XHRcdHBhcmVudExpbmsgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCggJy5tZW51LWl0ZW0taGFzLWNoaWxkcmVuID4gYSwgLnBhZ2VfaXRlbV9oYXNfY2hpbGRyZW4gPiBhJyApO1xuXG5cdFx0aWYgKCAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgKSB7XG5cdFx0XHR0b3VjaFN0YXJ0Rm4gPSBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0dmFyIG1lbnVJdGVtID0gdGhpcy5wYXJlbnROb2RlLCBpO1xuXG5cdFx0XHRcdGlmICggISBtZW51SXRlbS5jbGFzc0xpc3QuY29udGFpbnMoICdmb2N1cycgKSApIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0Zm9yICggaSA9IDA7IGkgPCBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuLmxlbmd0aDsgKytpICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtZW51SXRlbSA9PT0gbWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbltpXSApIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LmFkZCggJ2ZvY3VzJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1lbnVJdGVtLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBwYXJlbnRMaW5rLmxlbmd0aDsgKytpICkge1xuXHRcdFx0XHRwYXJlbnRMaW5rW2ldLmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hTdGFydEZuLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSggY29udGFpbmVyICkgKTtcbn1cblxuLyoqXG4gKiBTZXRzIG9yIHJlbW92ZXMgLmZvY3VzIGNsYXNzIG9uIGFuIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUZvY3VzKCkge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0Ly8gTW92ZSB1cCB0aHJvdWdoIHRoZSBhbmNlc3RvcnMgb2YgdGhlIGN1cnJlbnQgbGluayB1bnRpbCB3ZSBoaXQgLm5hdi1tZW51LlxuXHR3aGlsZSAoIC0xID09PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnbWVudScgKSApIHtcblxuXHRcdC8vIE9uIGxpIGVsZW1lbnRzIHRvZ2dsZSB0aGUgY2xhc3MgLmZvY3VzLlxuXHRcdGlmICggJ2xpJyA9PT0gc2VsZi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgKSB7XG5cdFx0XHRpZiAoIC0xICE9PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnZm9jdXMnICkgKSB7XG5cdFx0XHRcdHNlbGYuY2xhc3NOYW1lID0gc2VsZi5jbGFzc05hbWUucmVwbGFjZSggJyBmb2N1cycsICcnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWxmLmNsYXNzTmFtZSArPSAnIGZvY3VzJztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRzZWxmID0gc2VsZi5wYXJlbnRFbGVtZW50O1xuXHR9XG59XG5cbi8vIHVzZXIgYWNjb3VudCBuYXZpZ2F0aW9uIGNhbiBiZSBhIGRyb3Bkb3duXG4kKCBkb2N1bWVudCApLnJlYWR5KGZ1bmN0aW9uKCkge1xuXHQvLyBoaWRlIG1lbnVcblx0aWYgKCQoJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJykubGVuZ3RoID4gMCApIHtcblx0XHQkKCcjdXNlci1hY2NvdW50LWFjY2VzcyA+IGxpID4gYScpLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0JCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgdWwnKS50b2dnbGVDbGFzcyggJ3Zpc2libGUnICk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0pO1xuXHR9XG59KTtcbiJdfQ==
}(jQuery));
