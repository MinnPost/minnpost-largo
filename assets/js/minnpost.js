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
}

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
}); // user account navigation can be a dropdown

$(document).ready(function () {
  // hide menu
  if ($('#user-account-access ul').length > 0) {
    $('#user-account-access > li > a').on('click', function (event) {
      $('#user-account-access ul').toggleClass('visible');
      event.preventDefault();
    });
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

// based on which button was clicked, set the values for the analytics event and create it
function trackShowComments(always, id, click_value) {
  var action = '';
  var category_prefix = '';
  var category_suffix = '';
  var position = '';
  position = id.replace('always-show-comments-', '');

  if ('1' === click_value) {
    action = 'On';
  } else if ('0' === click_value) {
    action = 'Off';
  } else {
    action = 'Click';
  }

  if (true === always) {
    category_prefix = 'Always ';
  }

  if ('' !== position) {
    position = position.charAt(0).toUpperCase() + position.slice(1);
    category_suffix = ' - ' + position;
  }

  mp_analytics_tracking_event('event', category_prefix + 'Show Comments' + category_suffix, action, location.pathname);
} // when showing comments once, track it as an analytics event


$(document).on('click', '.a-button-show-comments', function () {
  trackShowComments(false, '', '');
}); // Set user meta value for always showing comments if that button is clicked

$(document).on('click', '.a-checkbox-always-show-comments', function () {
  var that = $(this);

  if (that.is(':checked')) {
    $('.a-checkbox-always-show-comments').prop('checked', true);
  } else {
    $('.a-checkbox-always-show-comments').prop('checked', false);
  } // track it as an analytics event


  trackShowComments(true, that.attr('id'), that.val()); // we already have ajaxurl from the theme

  $.ajax({
    type: 'POST',
    url: ajaxurl,
    data: {
      'action': 'minnpost_largo_load_comments_set_user_meta',
      'value': that.val()
    },
    success: function success(response) {
      $('.a-always-show-comments-result', that.parent()).html(response.data.message);

      if (true === response.data.show) {
        $('.a-checkbox-always-show-comments').val(0);
      } else {
        $('.a-checkbox-always-show-comments').val(1);
      }
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLWFuYWx5dGljcy5qcyIsIjAyLXNoYXJlLmpzIiwiMDMtbmF2aWdhdGlvbi5qcyIsIjA0LWZvcm1zLmpzIiwiMDUtY29tbWVudHMuanMiXSwibmFtZXMiOlsibXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50IiwidHlwZSIsImNhdGVnb3J5IiwiYWN0aW9uIiwibGFiZWwiLCJ2YWx1ZSIsImdhIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJlIiwiUFVNIiwiY3VycmVudF9wb3B1cCIsImdldFBvcHVwIiwic2V0dGluZ3MiLCJnZXRTZXR0aW5ncyIsInBvcHVwX2lkIiwiaWQiLCJvbiIsImNsb3NlX3RyaWdnZXIiLCJmbiIsInBvcG1ha2UiLCJsYXN0X2Nsb3NlX3RyaWdnZXIiLCJjbGljayIsInVybCIsImF0dHIiLCJtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEiLCJ1cmxfYWNjZXNzX2xldmVsIiwibG9jYXRpb24iLCJwYXRobmFtZSIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJ0cmltIiwic2V0dXBNZW51Iiwic2V0dXBOYXZTZWFyY2giLCJjb250YWluZXIiLCJuYXZzZWFyY2hjb250YWluZXIiLCJuYXZzZWFyY2h0b2dnbGUiLCJuYXZzZWFyY2hmb3JtIiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImxlbmd0aCIsImV2ZW50IiwiJHRhcmdldCIsInRhcmdldCIsImNsb3Nlc3QiLCJpcyIsImNsYXNzTmFtZSIsInJlcGxhY2UiLCJwcm9wIiwicmVtb3ZlQ2xhc3MiLCJwcmV2ZW50RGVmYXVsdCIsImluZGV4T2YiLCJhZGRDbGFzcyIsImJ1dHRvbiIsIm1lbnUiLCJsaW5rcyIsImkiLCJsZW4iLCJzdHlsZSIsImRpc3BsYXkiLCJzZXRBdHRyaWJ1dGUiLCJvbmNsaWNrIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRvZ2dsZUZvY3VzIiwidG91Y2hTdGFydEZuIiwicGFyZW50TGluayIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJ3aW5kb3ciLCJtZW51SXRlbSIsInBhcmVudE5vZGUiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImNoaWxkcmVuIiwicmVtb3ZlIiwiYWRkIiwic2VsZiIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsInBhcmVudEVsZW1lbnQiLCJocmVmIiwid2lkZ2V0X3RpdGxlIiwiZmluZCIsInpvbmVfdGl0bGUiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJ0b2dnbGVDbGFzcyIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwiZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCIsIm1hcmt1cCIsIm1hbmFnZUVtYWlscyIsImZvcm0iLCJyZXN0X3Jvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxfdXJsIiwiY29uZmlybUNoYW5nZSIsIm5leHRFbWFpbENvdW50IiwibmV3UHJpbWFyeUVtYWlsIiwib2xkUHJpbWFyeUVtYWlsIiwicHJpbWFyeUlkIiwiZW1haWxUb1JlbW92ZSIsImNvbnNvbGlkYXRlZEVtYWlscyIsIm5ld0VtYWlscyIsImFqYXhfZm9ybV9kYXRhIiwidGhhdCIsInZhbCIsInBhcmVudCIsImhpZGUiLCJzaG93IiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJpbmRleCIsImdldCIsInB1c2giLCJwYXJlbnRzIiwiZmFkZU91dCIsImpvaW4iLCJjb25zb2xlIiwibG9nIiwiYmVmb3JlIiwiYnV0dG9uX2Zvcm0iLCJkYXRhIiwic3VibWl0dGluZ19idXR0b24iLCJzZXJpYWxpemUiLCJhamF4IiwiYmVmb3JlU2VuZCIsInhociIsInNldFJlcXVlc3RIZWFkZXIiLCJub25jZSIsImRhdGFUeXBlIiwiZG9uZSIsIm1hcCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiY2xpY2tfdmFsdWUiLCJjYXRlZ29yeV9wcmVmaXgiLCJjYXRlZ29yeV9zdWZmaXgiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiYWpheHVybCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImh0bWwiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLDJCQUFULENBQXNDQyxJQUF0QyxFQUE0Q0MsUUFBNUMsRUFBc0RDLE1BQXRELEVBQThEQyxLQUE5RCxFQUFxRUMsS0FBckUsRUFBNkU7QUFDNUUsTUFBSyxPQUFPQyxFQUFQLEtBQWMsV0FBbkIsRUFBaUM7QUFDaEMsUUFBSyxPQUFPRCxLQUFQLEtBQWlCLFdBQXRCLEVBQW9DO0FBQ25DQyxNQUFBQSxFQUFFLENBQUUsTUFBRixFQUFVTCxJQUFWLEVBQWdCQyxRQUFoQixFQUEwQkMsTUFBMUIsRUFBa0NDLEtBQWxDLENBQUY7QUFDQSxLQUZELE1BRU87QUFDTkUsTUFBQUEsRUFBRSxDQUFFLE1BQUYsRUFBVUwsSUFBVixFQUFnQkMsUUFBaEIsRUFBMEJDLE1BQTFCLEVBQWtDQyxLQUFsQyxFQUF5Q0MsS0FBekMsQ0FBRjtBQUNBO0FBQ0QsR0FORCxNQU1PO0FBQ047QUFDQTtBQUNEOztBQUVERSxDQUFDLENBQUVDLFFBQUYsQ0FBRCxDQUFjQyxLQUFkLENBQXFCLFVBQVdDLENBQVgsRUFBZTtBQUVuQyxNQUFLLGdCQUFnQixPQUFPQyxHQUE1QixFQUFrQztBQUNqQyxRQUFJQyxhQUFhLEdBQUdELEdBQUcsQ0FBQ0UsUUFBSixDQUFjTixDQUFDLENBQUUsTUFBRixDQUFmLENBQXBCO0FBQ0EsUUFBSU8sUUFBUSxHQUFHSCxHQUFHLENBQUNJLFdBQUosQ0FBaUJSLENBQUMsQ0FBRSxNQUFGLENBQWxCLENBQWY7QUFDQSxRQUFJUyxRQUFRLEdBQUdGLFFBQVEsQ0FBQ0csRUFBeEI7QUFDQVYsSUFBQUEsQ0FBQyxD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bmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApIHtcblx0aWYgKCB0eXBlb2YgZ2EgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdGlmICggdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuJCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24gKCBlICkge1xuXG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBQVU0gKSB7XG5cdFx0dmFyIGN1cnJlbnRfcG9wdXAgPSBQVU0uZ2V0UG9wdXAoICQoICcucHVtJyApICk7XG5cdFx0dmFyIHNldHRpbmdzID0gUFVNLmdldFNldHRpbmdzKCAkKCAnLnB1bScgKSApO1xuXHRcdHZhciBwb3B1cF9pZCA9IHNldHRpbmdzLmlkO1xuXHRcdCQoIGRvY3VtZW50ICkub24oJ3B1bUFmdGVyT3BlbicsIGZ1bmN0aW9uICgpIHtcblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ1Nob3cnLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0gKTtcblx0XHR9KTtcblx0XHQkKCBkb2N1bWVudCApLm9uKCdwdW1BZnRlckNsb3NlJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGNsb3NlX3RyaWdnZXIgPSAkLmZuLnBvcG1ha2UubGFzdF9jbG9zZV90cmlnZ2VyO1xuXHRcdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGNsb3NlX3RyaWdnZXIgKSB7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgY2xvc2VfdHJpZ2dlciwgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9ICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JCggJy5tZXNzYWdlLWNsb3NlJyApLmNsaWNrKGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBsaW5rIHdpdGggY2xvc2UgY2xhc3Ncblx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJ0Nsb3NlIEJ1dHRvbic7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSApO1xuXHRcdH0pO1xuXHRcdCQoICcubWVzc2FnZS1sb2dpbicgKS5jbGljayhmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGxvZ2luIGNsYXNzXG5cdFx0XHR2YXIgdXJsID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdMb2dpbiBMaW5rJywgdXJsICk7XG5cdFx0fSk7XG5cdFx0JCggJy5wdW0tY29udGVudCBhOm5vdCggLm1lc3NhZ2UtY2xvc2UsIC5wdW0tY2xvc2UsIC5tZXNzYWdlLWxvZ2luICknICkuY2xpY2soIGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBzb21ldGhpbmcgdGhhdCBpcyBub3QgY2xvc2UgdGV4dCBvciBjbG9zZSBpY29uXG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdDbGljaycsIHBvcHVwX2lkICk7XG4gICAgICAgIH0pO1xuXHR9XG5cblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSAmJiAnJyAhPT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLnVybF9hY2Nlc3NfbGV2ZWwgKSB7XG5cdFx0dmFyIHR5cGUgPSAnZXZlbnQnO1xuXHRcdHZhciBjYXRlZ29yeSA9ICdNZW1iZXIgQ29udGVudCc7XG5cdFx0dmFyIGxhYmVsID0gbG9jYXRpb24ucGF0aG5hbWU7IC8vIGkgdGhpbmsgd2UgY291bGQgcG9zc2libHkgcHV0IHNvbWUgZ3JvdXBpbmcgaGVyZSwgYnV0IHdlIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYWNjZXNzIHRvIG9uZSBhbmQgbWF5YmUgaXQncyBub3Qgd29ydGh3aGlsZSB5ZXRcblx0XHR2YXIgYWN0aW9uID0gJ0Jsb2NrZWQnO1xuXHRcdGlmICggdHJ1ZSA9PT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLmN1cnJlbnRfdXNlci5jYW5fYWNjZXNzICkge1xuXHRcdFx0YWN0aW9uID0gJ1Nob3duJztcblx0XHR9XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHR9XG59KTtcbiIsImZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICkge1xuXG5cdC8vIGlmIGEgbm90IGxvZ2dlZCBpbiB1c2VyIHRyaWVzIHRvIGVtYWlsLCBkb24ndCBjb3VudCB0aGF0IGFzIGEgc2hhcmVcblx0aWYgKCAhIGpRdWVyeSggJ2JvZHkgJykuaGFzQ2xhc3MoICdsb2dnZWQtaW4nKSAmJiAnRW1haWwnID09PSB0ZXh0ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIHRyYWNrIGFzIGFuIGV2ZW50LCBhbmQgYXMgc29jaWFsIGlmIGl0IGlzIHR3aXR0ZXIgb3IgZmJcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2hhcmUgLSAnICsgcG9zaXRpb24sIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgfHwgJ1R3aXR0ZXInID09PSB0ZXh0ICkge1xuXHRcdFx0aWYgKCB0ZXh0ID09ICdGYWNlYm9vaycgKSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnU2hhcmUnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdUd2VldCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG4kICggJy5tLWVudHJ5LXNoYXJlLXRvcCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpLnRyaW0oKTtcblx0dmFyIHBvc2l0aW9uID0gJ3RvcCc7XG5cdHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG59KTtcblxuJCAoICcubS1lbnRyeS1zaGFyZS1ib3R0b20gYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLnRleHQoKS50cmltKCk7XG5cdHZhciBwb3NpdGlvbiA9ICdib3R0b20nO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSk7XG4iLCIvKipcbiAqIEZpbGUgbmF2aWdhdGlvbi5qcy5cbiAqXG4gKiBIYW5kbGVzIHRvZ2dsaW5nIHRoZSBuYXZpZ2F0aW9uIG1lbnUgZm9yIHNtYWxsIHNjcmVlbnMgYW5kIGVuYWJsZXMgVEFCIGtleVxuICogbmF2aWdhdGlvbiBzdXBwb3J0IGZvciBkcm9wZG93biBtZW51cy5cbiAqL1xuXG5zZXR1cE1lbnUoICduYXZpZ2F0aW9uLXByaW1hcnknICk7XG5zZXR1cE1lbnUoICduYXZpZ2F0aW9uLXVzZXItYWNjb3VudC1tYW5hZ2VtZW50JyApO1xuc2V0dXBOYXZTZWFyY2goICduYXZpZ2F0aW9uLXByaW1hcnknICk7XG5cbmZ1bmN0aW9uIHNldHVwTmF2U2VhcmNoKCBjb250YWluZXIgKSB7XG5cblx0dmFyIG5hdnNlYXJjaGNvbnRhaW5lciwgbmF2c2VhcmNodG9nZ2xlLCBuYXZzZWFyY2hmb3JtO1xuXG5cdGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBjb250YWluZXIgKTtcblx0aWYgKCAhIGNvbnRhaW5lciApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRuYXZzZWFyY2hjb250YWluZXIgPSAkKCAnbGkuc2VhcmNoJywgJCggY29udGFpbmVyICkgKTtcblx0bmF2c2VhcmNodG9nZ2xlICAgID0gJCggJ2xpLnNlYXJjaCBhJywgJCggY29udGFpbmVyICkgKTtcblx0bmF2c2VhcmNoZm9ybSAgICAgID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnZm9ybScgKVswXTtcblxuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgbmF2c2VhcmNodG9nZ2xlIHx8ICd1bmRlZmluZWQnID09PSB0eXBlb2YgbmF2c2VhcmNoZm9ybSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZiAoICQoIG5hdnNlYXJjaGZvcm0gKS5sZW5ndGggPiAwICkge1xuXHRcdCQoIGRvY3VtZW50ICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdHZhciAkdGFyZ2V0ID0gJCggZXZlbnQudGFyZ2V0ICk7XG5cdFx0XHRpZiAoICEgJHRhcmdldC5jbG9zZXN0KCBuYXZzZWFyY2hjb250YWluZXIgKS5sZW5ndGggJiYgJCggbmF2c2VhcmNoZm9ybSApLmlzKCAnOnZpc2libGUnICkgKSB7XG5cdFx0XHRcdG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lID0gbmF2c2VhcmNoZm9ybS5jbGFzc05hbWUucmVwbGFjZSggJyB0b2dnbGVkLWZvcm0nLCAnJyApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5wcm9wKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnJlbW92ZUNsYXNzKCAndG9nZ2xlZC1mb3JtJyApO1xuXHRcdFx0fSAgICAgICAgXG5cdFx0fSk7XG5cdFx0JCggbmF2c2VhcmNodG9nZ2xlICkub24oICdjbGljaycsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRpZiAoIC0xICE9PSBuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZC1mb3JtJyApICkge1xuXHRcdFx0XHRuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZSA9IG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lLnJlcGxhY2UoICcgdG9nZ2xlZC1mb3JtJywgJycgKTtcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucHJvcCggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5yZW1vdmVDbGFzcyggJ3RvZ2dsZWQtZm9ybScgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lICs9ICcgdG9nZ2xlZC1mb3JtJztcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucHJvcCggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLmFkZENsYXNzKCAndG9nZ2xlZC1mb3JtJyApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNldHVwTWVudSggY29udGFpbmVyICkge1xuXHR2YXIgYnV0dG9uLCBtZW51LCBsaW5rcywgaSwgbGVuO1xuXHRjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggY29udGFpbmVyICk7XG5cdGlmICggISBjb250YWluZXIgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0YnV0dG9uID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYnV0dG9uJyApWzBdO1xuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgYnV0dG9uICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1lbnUgPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICd1bCcgKVswXTtcblxuXHQvLyBIaWRlIG1lbnUgdG9nZ2xlIGJ1dHRvbiBpZiBtZW51IGlzIGVtcHR5IGFuZCByZXR1cm4gZWFybHkuXG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBtZW51ICkge1xuXHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0aWYgKCAtMSA9PT0gbWVudS5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cdFx0bWVudS5jbGFzc05hbWUgKz0gJyBtZW51Jztcblx0fVxuXG5cdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCAtMSAhPT0gY29udGFpbmVyLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZCcgKSApIHtcblx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgPSBjb250YWluZXIuY2xhc3NOYW1lLnJlcGxhY2UoICcgdG9nZ2xlZCcsICcnICk7XG5cdFx0XHRidXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSArPSAnIHRvZ2dsZWQnO1xuXHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyApO1xuXHRcdH1cblx0fTtcblxuXHQvLyBHZXQgYWxsIHRoZSBsaW5rIGVsZW1lbnRzIHdpdGhpbiB0aGUgbWVudS5cblx0bGlua3MgICAgPSBtZW51LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYScgKTtcblxuXHQvLyBFYWNoIHRpbWUgYSBtZW51IGxpbmsgaXMgZm9jdXNlZCBvciBibHVycmVkLCB0b2dnbGUgZm9jdXMuXG5cdGZvciAoIGkgPSAwLCBsZW4gPSBsaW5rcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCAnZm9jdXMnLCB0b2dnbGVGb2N1cywgdHJ1ZSApO1xuXHRcdGxpbmtzW2ldLmFkZEV2ZW50TGlzdGVuZXIoICdibHVyJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUb2dnbGVzIGBmb2N1c2AgY2xhc3MgdG8gYWxsb3cgc3VibWVudSBhY2Nlc3Mgb24gdGFibGV0cy5cblx0ICovXG5cdCggZnVuY3Rpb24oIGNvbnRhaW5lciApIHtcblx0XHR2YXIgdG91Y2hTdGFydEZuLCBpLFxuXHRcdFx0cGFyZW50TGluayA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCAnLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4gPiBhLCAucGFnZV9pdGVtX2hhc19jaGlsZHJlbiA+IGEnICk7XG5cblx0XHRpZiAoICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyApIHtcblx0XHRcdHRvdWNoU3RhcnRGbiA9IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgbWVudUl0ZW0gPSB0aGlzLnBhcmVudE5vZGUsIGk7XG5cblx0XHRcdFx0aWYgKCAhIG1lbnVJdGVtLmNsYXNzTGlzdC5jb250YWlucyggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW4ubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1lbnVJdGVtID09PSBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldICkge1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW5baV0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtZW51SXRlbS5jbGFzc0xpc3QuYWRkKCAnZm9jdXMnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRmb3IgKCBpID0gMDsgaSA8IHBhcmVudExpbmsubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdHBhcmVudExpbmtbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCB0b3VjaFN0YXJ0Rm4sIGZhbHNlICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KCBjb250YWluZXIgKSApO1xufVxuXG4vKipcbiAqIFNldHMgb3IgcmVtb3ZlcyAuZm9jdXMgY2xhc3Mgb24gYW4gZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gdG9nZ2xlRm9jdXMoKSB7XG5cdHZhciBzZWxmID0gdGhpcztcblxuXHQvLyBNb3ZlIHVwIHRocm91Z2ggdGhlIGFuY2VzdG9ycyBvZiB0aGUgY3VycmVudCBsaW5rIHVudGlsIHdlIGhpdCAubmF2LW1lbnUuXG5cdHdoaWxlICggLTEgPT09IHNlbGYuY2xhc3NOYW1lLmluZGV4T2YoICdtZW51JyApICkge1xuXG5cdFx0Ly8gT24gbGkgZWxlbWVudHMgdG9nZ2xlIHRoZSBjbGFzcyAuZm9jdXMuXG5cdFx0aWYgKCAnbGknID09PSBzZWxmLnRhZ05hbWUudG9Mb3dlckNhc2UoKSApIHtcblx0XHRcdGlmICggLTEgIT09IHNlbGYuY2xhc3NOYW1lLmluZGV4T2YoICdmb2N1cycgKSApIHtcblx0XHRcdFx0c2VsZi5jbGFzc05hbWUgPSBzZWxmLmNsYXNzTmFtZS5yZXBsYWNlKCAnIGZvY3VzJywgJycgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlbGYuY2xhc3NOYW1lICs9ICcgZm9jdXMnO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHNlbGYgPSBzZWxmLnBhcmVudEVsZW1lbnQ7XG5cdH1cbn1cblxuJCggJyNuYXZpZ2F0aW9uLWZlYXR1cmVkIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdGZWF0dXJlZCBCYXIgTGluaycsICdDbGljaycsIHRoaXMuaHJlZiApO1xufSk7XG5cbiQoICdhLmdsZWFuLXNpZGViYXInICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdTaWRlYmFyIFN1cHBvcnQgTGluaycsICdDbGljaycsIHRoaXMuaHJlZiApO1xufSk7XG5cbiQoICdhJywgJCggJy5vLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0dmFyIHdpZGdldF90aXRsZSA9ICQodGhpcykuY2xvc2VzdCgnLm0td2lkZ2V0JykuZmluZCgnaDMnKS50ZXh0KCk7XG5cdHZhciB6b25lX3RpdGxlICAgPSAkKHRoaXMpLmNsb3Nlc3QoJy5tLXpvbmUnKS5maW5kKCcuYS16b25lLXRpdGxlJykudGV4dCgpO1xuXHR2YXIgc2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gJyc7XG5cdGlmICggJycgIT09IHdpZGdldF90aXRsZSApIHtcblx0XHRzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSB3aWRnZXRfdGl0bGU7XG5cdH0gZWxzZSBpZiAoICcnICE9PSB6b25lX3RpdGxlICkge1xuXHRcdHNpZGViYXJfc2VjdGlvbl90aXRsZSA9IHpvbmVfdGl0bGU7XG5cdH1cblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCdldmVudCcsICdTaWRlYmFyIExpbmsnLCAnQ2xpY2snLCBzaWRlYmFyX3NlY3Rpb25fdGl0bGUpO1xufSk7XG5cbi8vIHVzZXIgYWNjb3VudCBuYXZpZ2F0aW9uIGNhbiBiZSBhIGRyb3Bkb3duXG4kKCBkb2N1bWVudCApLnJlYWR5KGZ1bmN0aW9uKCkge1xuXHQvLyBoaWRlIG1lbnVcblx0aWYgKCQoJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJykubGVuZ3RoID4gMCApIHtcblx0XHQkKCcjdXNlci1hY2NvdW50LWFjY2VzcyA+IGxpID4gYScpLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0JCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgdWwnKS50b2dnbGVDbGFzcyggJ3Zpc2libGUnICk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0pO1xuXHR9XG59KTtcbiIsIlxualF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlcihmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKHRoaXMubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmIHRoaXMubm9kZVZhbHVlLnRyaW0oKSAhPT0gXCJcIik7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0cmV0dXJuIG1hcmt1cDtcbn1cblxuZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCgnI2FjY291bnQtc2V0dGluZ3MtZm9ybScpO1xuXHR2YXIgcmVzdF9yb290ICAgICAgICAgID0gdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5zaXRlX3VybCArIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QucmVzdF9uYW1lc3BhY2U7XG5cdHZhciBmdWxsX3VybCAgICAgICAgICAgPSByZXN0X3Jvb3QgKyAnLycgKyAndXBkYXRlLXVzZXIvJztcblx0dmFyIGNvbmZpcm1DaGFuZ2UgICAgICA9ICcnO1xuXHR2YXIgbmV4dEVtYWlsQ291bnQgICAgID0gMTtcblx0dmFyIG5ld1ByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgb2xkUHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBwcmltYXJ5SWQgICAgICAgICAgPSAnJztcblx0dmFyIGVtYWlsVG9SZW1vdmUgICAgICA9ICcnO1xuXHR2YXIgY29uc29saWRhdGVkRW1haWxzID0gW107XG5cdHZhciBuZXdFbWFpbHMgICAgICAgICAgPSBbXTtcblx0dmFyIGFqYXhfZm9ybV9kYXRhICAgICA9ICcnO1xuXHR2YXIgdGhhdCAgICAgICAgICAgICAgID0gJyc7XG5cdC8vIHN0YXJ0IG91dCB3aXRoIG5vIHByaW1hcnkvcmVtb3ZhbHMgY2hlY2tlZFxuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0Ly8gaWYgdGhlcmUgaXMgYSBsaXN0IG9mIGVtYWlscyAobm90IGp1c3QgYSBzaW5nbGUgZm9ybSBmaWVsZClcblx0aWYgKCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdC8vIGlmIGEgdXNlciBzZWxlY3RzIGEgbmV3IHByaW1hcnksIG1vdmUgaXQgaW50byB0aGF0IHBvc2l0aW9uXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcblx0XHRcdG5ld1ByaW1hcnlFbWFpbCA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdG9sZFByaW1hcnlFbWFpbCA9ICQoICcjZW1haWwnICkudmFsKCk7XG5cdFx0XHRwcmltYXJ5SWQgICAgICAgPSAkKCB0aGlzICkucHJvcCggJ2lkJyApLnJlcGxhY2UoICdwcmltYXJ5X2VtYWlsXycsICcnICk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncHJpbWFyeS1jaGFuZ2UnICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlclxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdC8vJCggdGhpcyApLnBhcmVudCgpLmFmdGVyKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgbWFpbiBoaWRkZW4gZm9ybSB2YWx1ZVxuXHRcdFx0XHQkKCAnI2VtYWlsJyApLnZhbCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdC8vIHN1Ym1pdCBmb3JtIHZhbHVlcy5cblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0Ly8gdW5jaGVjayB0aGUgcmFkaW8gYnV0dG9uXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBmb3JtIHZhbHVlcyB0byB0aGUgb2xkIHByaW1hcnkgZW1haWxcblx0XHRcdFx0JCggJyNwcmltYXJ5X2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3JlbW92ZV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0Ly8gcmVtb3ZlIHRoZSBjb25maXJtIG1lc3NhZ2Vcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdC8vIGlmIGEgdXNlciByZW1vdmVzIGFuIGVtYWlsLCB0YWtlIGl0IGF3YXkgZnJvbSB0aGUgdmlzdWFsIGFuZCBmcm9tIHRoZSBmb3JtXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NoYW5nZScsICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZW1haWxUb1JlbW92ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdyZW1vdmFsJyApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgIT09IGVtYWlsVG9SZW1vdmUgKSB7XG5cdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlciBmb3IgcmVtb3ZhbFxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblx0XHRcdC8vIGlmIGNvbmZpcm1lZCwgcmVtb3ZlIHRoZSBlbWFpbCBhbmQgc3VibWl0IHRoZSBmb3JtXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpJyApLmZhZGVPdXQoICdub3JtYWwnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkucmVtb3ZlKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCAndmFsdWUgaXMgJyArIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIGlmIGEgdXNlciB3YW50cyB0byBhZGQgYW4gZW1haWwsIGdpdmUgdGhlbSBhIHByb3Blcmx5IG51bWJlcmVkIGZpZWxkXG5cdCQoICcubS1mb3JtLWVtYWlsJyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCgnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJykuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvbiBhLWJ1dHRvbi1hZGQtdXNlci1lbWFpbFwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRuZXh0RW1haWxDb3VudCsrO1xuXHR9KTtcblxuXHQkKCAnaW5wdXRbdHlwZT1zdWJtaXRdJyApLmNsaWNrKCBmdW5jdGlvbiAoIGUgKSB7XG5cdFx0dmFyIGJ1dHRvbiA9ICQoIHRoaXMgKTtcblx0XHR2YXIgYnV0dG9uX2Zvcm0gPSBidXR0b24uY2xvc2VzdCggJ2Zvcm0nICk7XG5cdFx0YnV0dG9uX2Zvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJywgYnV0dG9uLnZhbCgpICk7XG5cdH0pO1xuXG5cdCQoICcubS1lbnRyeS1jb250ZW50JyApLm9uKCAnc3VibWl0JywgJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0dmFyIGZvcm0gPSAkKCB0aGlzICk7XG5cdFx0dmFyIHN1Ym1pdHRpbmdfYnV0dG9uID0gZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nICkgfHwgJyc7XG5cdFx0Ly8gaWYgdGhlcmUgaXMgbm8gc3VibWl0dGluZyBidXR0b24sIHBhc3MgaXQgYnkgQWpheFxuXHRcdGlmICggJycgPT09IHN1Ym1pdHRpbmdfYnV0dG9uIHx8ICdTYXZlIENoYW5nZXMnICE9PSBzdWJtaXR0aW5nX2J1dHRvbiApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhamF4X2Zvcm1fZGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7IC8vYWRkIG91ciBvd24gYWpheCBjaGVjayBhcyBYLVJlcXVlc3RlZC1XaXRoIGlzIG5vdCBhbHdheXMgcmVsaWFibGVcblx0XHRcdGFqYXhfZm9ybV9kYXRhID0gYWpheF9mb3JtX2RhdGEgKyAnJnJlc3Q9dHJ1ZSc7XG5cdFx0XHQkLmFqYXgoe1xuXHRcdFx0XHR1cmw6IGZ1bGxfdXJsLFxuXHRcdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICggeGhyICkge1xuXHRcdFx0ICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Lm5vbmNlICk7XG5cdFx0XHQgICAgfSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0ZGF0YTogYWpheF9mb3JtX2RhdGFcblx0XHRcdH0pLmRvbmUoIGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0XHRuZXdFbWFpbHMgPSAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gJCh0aGlzKS52YWwoKTtcblx0XHRcdFx0fSkuZ2V0KCk7XG5cdFx0XHRcdCQuZWFjaCggbmV3RW1haWxzLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICkge1xuXHRcdFx0XHRcdG5leHRFbWFpbENvdW50ID0gbmV4dEVtYWlsQ291bnQgKyBpbmRleDtcblx0XHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmFwcGVuZCggJzxsaSBpZD1cInVzZXItZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPicgKyB2YWx1ZSArICc8dWwgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXVzZXItZW1haWwtYWN0aW9uc1wiPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1tYWtlLXByaW1hcnktZW1haWxcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW1hcnlfZW1haWxcIiBpZD1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+TWFrZSBQcmltYXJ5PC9zbWFsbD48L2xhYmVsPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLWVtYWlsLXByZWZlcmVuY2VzXCI+PGEgaHJlZj1cIi9uZXdzbGV0dGVycy8/ZW1haWw9JyArIGVuY29kZVVSSUNvbXBvbmVudCggdmFsdWUgKSArICdcIj48c21hbGw+RW1haWwgUHJlZmVyZW5jZXM8L3NtYWxsPjwvYT48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggJCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoKSArICcsJyArIHZhbHVlICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cdFx0XHRcdFx0XHQvLyBpdCB3b3VsZCBiZSBuaWNlIHRvIG9ubHkgbG9hZCB0aGUgZm9ybSwgYnV0IHRoZW4gY2xpY2sgZXZlbnRzIHN0aWxsIGRvbid0IHdvcmtcblx0XHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuJCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24gKCAkICkge1xuXHRcInVzZSBzdHJpY3RcIjtcblx0aWYgKCAkKCcubS1mb3JtLWVtYWlsJykubGVuZ3RoID4gMCApIHtcblx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0fVxufSk7XG4iLCIvLyBiYXNlZCBvbiB3aGljaCBidXR0b24gd2FzIGNsaWNrZWQsIHNldCB0aGUgdmFsdWVzIGZvciB0aGUgYW5hbHl0aWNzIGV2ZW50IGFuZCBjcmVhdGUgaXRcbmZ1bmN0aW9uIHRyYWNrU2hvd0NvbW1lbnRzKCBhbHdheXMsIGlkLCBjbGlja192YWx1ZSApIHtcblx0dmFyIGFjdGlvbiAgICAgICAgICA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlfcHJlZml4ID0gJyc7XG5cdHZhciBjYXRlZ29yeV9zdWZmaXggPSAnJztcblx0dmFyIHBvc2l0aW9uICAgICAgICA9ICcnO1xuXHRwb3NpdGlvbiA9IGlkLnJlcGxhY2UoICdhbHdheXMtc2hvdy1jb21tZW50cy0nLCAnJyApO1xuXHRpZiAoICcxJyA9PT0gY2xpY2tfdmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09uJztcblx0fSBlbHNlIGlmICggJzAnID09PSBjbGlja192YWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5X3ByZWZpeCA9ICdBbHdheXMgJztcblx0fVxuXHRpZiAoICcnICE9PSBwb3NpdGlvbiApIHtcblx0XHRwb3NpdGlvbiA9IHBvc2l0aW9uLmNoYXJBdCggMCApLnRvVXBwZXJDYXNlKCkgKyBwb3NpdGlvbi5zbGljZSggMSApOyBcblx0XHRjYXRlZ29yeV9zdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgY2F0ZWdvcnlfcHJlZml4ICsgJ1Nob3cgQ29tbWVudHMnICsgY2F0ZWdvcnlfc3VmZml4LCBhY3Rpb24sIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59XG5cbi8vIHdoZW4gc2hvd2luZyBjb21tZW50cyBvbmNlLCB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1idXR0b24tc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR0cmFja1Nob3dDb21tZW50cyggZmFsc2UsICcnLCAnJyApO1xufSk7XG5cbi8vIFNldCB1c2VyIG1ldGEgdmFsdWUgZm9yIGFsd2F5cyBzaG93aW5nIGNvbW1lbnRzIGlmIHRoYXQgYnV0dG9uIGlzIGNsaWNrZWRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR2YXIgdGhhdCA9ICQoIHRoaXMgKTtcblx0aWYgKCB0aGF0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9IGVsc2Uge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvLyB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcblx0dHJhY2tTaG93Q29tbWVudHMoIHRydWUsIHRoYXQuYXR0ciggJ2lkJyApLCB0aGF0LnZhbCgpICk7XG5cblx0Ly8gd2UgYWxyZWFkeSBoYXZlIGFqYXh1cmwgZnJvbSB0aGUgdGhlbWVcblx0JC5hamF4KCB7XG5cdFx0dHlwZTogJ1BPU1QnLFxuXHRcdHVybDogYWpheHVybCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICBcdCdhY3Rpb24nOiAnbWlubnBvc3RfbGFyZ29fbG9hZF9jb21tZW50c19zZXRfdXNlcl9tZXRhJyxcbiAgICAgICAgXHQndmFsdWUnOiB0aGF0LnZhbCgpXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcbiAgICAgICAgXHQkKCAnLmEtYWx3YXlzLXNob3ctY29tbWVudHMtcmVzdWx0JywgdGhhdC5wYXJlbnQoKSApLmh0bWwoIHJlc3BvbnNlLmRhdGEubWVzc2FnZSApO1xuICAgICAgICBcdGlmICggdHJ1ZSA9PT0gcmVzcG9uc2UuZGF0YS5zaG93ICkge1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAwICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAxICk7XG5cdFx0XHR9XG4gICAgICAgIH1cbiAgICB9ICk7XG59ICk7Il19
}(jQuery));
