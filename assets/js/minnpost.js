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

// Set user meta value for always showing comments if that button is clicked
$(document).on('click', '.a-checkbox-always-show-comments', function () {
  var that = $(this);

  if (that.is(':checked')) {
    $('.a-checkbox-always-show-comments').prop('checked', true);
  } else {
    $('.a-checkbox-always-show-comments').prop('checked', false);
  } // we already have ajaxurl from the theme


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
        //that.text( that.data( 'toggle-text' ) );
        $('.a-checkbox-always-show-comments').val(0);
      } else {
        //that.text( that.data( 'default-text' ) );
        $('.a-checkbox-always-show-comments').val(1);
      }
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLWFuYWx5dGljcy5qcyIsIjAyLXNoYXJlLmpzIiwiMDMtbmF2aWdhdGlvbi5qcyIsIjA0LWZvcm1zLmpzIiwiMDUtY29tbWVudHMuanMiXSwibmFtZXMiOlsibXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50IiwidHlwZSIsImNhdGVnb3J5IiwiYWN0aW9uIiwibGFiZWwiLCJ2YWx1ZSIsImdhIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJlIiwiUFVNIiwiY3VycmVudF9wb3B1cCIsImdldFBvcHVwIiwic2V0dGluZ3MiLCJnZXRTZXR0aW5ncyIsInBvcHVwX2lkIiwiaWQiLCJvbiIsImNsb3NlX3RyaWdnZXIiLCJmbiIsInBvcG1ha2UiLCJsYXN0X2Nsb3NlX3RyaWdnZXIiLCJjbGljayIsInVybCIsImF0dHIiLCJtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEiLCJ1cmxfYWNjZXNzX2xldmVsIiwibG9jYXRpb24iLCJwYXRobmFtZSIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJ0cmltIiwic2V0dXBNZW51Iiwic2V0dXBOYXZTZWFyY2giLCJjb250YWluZXIiLCJuYXZzZWFyY2hjb250YWluZXIiLCJuYXZzZWFyY2h0b2dnbGUiLCJuYXZzZWFyY2hmb3JtIiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImxlbmd0aCIsImV2ZW50IiwiJHRhcmdldCIsInRhcmdldCIsImNsb3Nlc3QiLCJpcyIsImNsYXNzTmFtZSIsInJlcGxhY2UiLCJwcm9wIiwicmVtb3ZlQ2xhc3MiLCJwcmV2ZW50RGVmYXVsdCIsImluZGV4T2YiLCJhZGRDbGFzcyIsImJ1dHRvbiIsIm1lbnUiLCJsaW5rcyIsImkiLCJsZW4iLCJzdHlsZSIsImRpc3BsYXkiLCJzZXRBdHRyaWJ1dGUiLCJvbmNsaWNrIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRvZ2dsZUZvY3VzIiwidG91Y2hTdGFydEZuIiwicGFyZW50TGluayIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJ3aW5kb3ciLCJtZW51SXRlbSIsInBhcmVudE5vZGUiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImNoaWxkcmVuIiwicmVtb3ZlIiwiYWRkIiwic2VsZiIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsInBhcmVudEVsZW1lbnQiLCJocmVmIiwid2lkZ2V0X3RpdGxlIiwiZmluZCIsInpvbmVfdGl0bGUiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJ0b2dnbGVDbGFzcyIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwiZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCIsIm1hcmt1cCIsIm1hbmFnZUVtYWlscyIsImZvcm0iLCJyZXN0X3Jvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxfdXJsIiwiY29uZmlybUNoYW5nZSIsIm5leHRFbWFpbENvdW50IiwibmV3UHJpbWFyeUVtYWlsIiwib2xkUHJpbWFyeUVtYWlsIiwicHJpbWFyeUlkIiwiZW1haWxUb1JlbW92ZSIsImNvbnNvbGlkYXRlZEVtYWlscyIsIm5ld0VtYWlscyIsImFqYXhfZm9ybV9kYXRhIiwidGhhdCIsInZhbCIsInBhcmVudCIsImhpZGUiLCJzaG93IiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJpbmRleCIsImdldCIsInB1c2giLCJwYXJlbnRzIiwiZmFkZU91dCIsImpvaW4iLCJjb25zb2xlIiwibG9nIiwiYmVmb3JlIiwiYnV0dG9uX2Zvcm0iLCJkYXRhIiwic3VibWl0dGluZ19idXR0b24iLCJzZXJpYWxpemUiLCJhamF4IiwiYmVmb3JlU2VuZCIsInhociIsInNldFJlcXVlc3RIZWFkZXIiLCJub25jZSIsImRhdGFUeXBlIiwiZG9uZSIsIm1hcCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsImFqYXh1cmwiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJodG1sIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSwyQkFBVCxDQUFzQ0MsSUFBdEMsRUFBNENDLFFBQTVDLEVBQXNEQyxNQUF0RCxFQUE4REMsS0FBOUQsRUFBcUVDLEtBQXJFLEVBQTZFO0FBQzVFLE1BQUssT0FBT0MsRUFBUCxLQUFjLFdBQW5CLEVBQWlDO0FBQ2hDLFFBQUssT0FBT0QsS0FBUCxLQUFpQixXQUF0QixFQUFvQztBQUNuQ0MsTUFBQUEsRUFBRSxDQUFFLE1BQUYsRUFBVUwsSUFBVixFQUFnQkMsUUFBaEIsRUFBMEJDLE1BQTFCLEVBQWtDQyxLQUFsQyxDQUFGO0FBQ0EsS0FGRCxNQUVPO0FBQ05FLE1BQUFBLEVBQUUsQ0FBRSxNQUFGLEVBQVVMLElBQVYsRUFBZ0JDLFFBQWhCLEVBQTBCQyxNQUExQixFQUFrQ0MsS0FBbEMsRUFBeUNDLEtBQXpDLENBQUY7QUFDQTtBQUNELEdBTkQsTUFNTztBQUNOO0FBQ0E7QUFDRDs7QUFFREUsQ0FBQyxDQUFFQyxRQUFGLENBQUQsQ0FBY0MsS0FBZCxDQUFxQixVQUFXQyxDQUFYLEVBQWU7QUFFbkMsTUFBSyxnQkFBZ0IsT0FBT0MsR0FBNUIsRUFBa0M7QUFDakMsUUFBSUMsYUFBYSxHQUFHRCxHQUFHLENBQUNFLFFBQUosQ0FBY04sQ0FBQyxDQUFFLE1BQUYsQ0FBZixDQUFwQjtBQUNBLFFBQUlPLFFBQVEsR0FBR0gsR0FBRyxDQUFDSSxXQUFKLENBQWlCUixDQUFDLENBQUUsTUFBRixDQUFsQixDQUFmO0FBQ0EsUUFBSVMsUUFBUSxHQUFHRixRQUFRLENBQUNHLEVBQXhCO0FBQ0FWLElBQUFBLENBQUMsQ0FBRUMsUUFBRixDQUFELENBQWNVLEVBQWQsQ0FBaUIsY0FBakIsRUFBaUMsWUFBWTtBQUM1Q2xCLE1BQUFBLDJCQUEyQixDQUFFLE9BQUYsRUFBVyxPQUFYLEVBQW9CLE1BQXBCLEVBQTRCZ0Is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OUMsRUFBeUQsS0FBekQ7QUFDQSxHQU53RSxDQVF6RTs7O0FBQ0EvQyxFQUFBQSxDQUFDLENBQUNvSSxJQUFGLENBQVE7QUFDUDFJLElBQUFBLElBQUksRUFBRSxNQURDO0FBRVB1QixJQUFBQSxHQUFHLEVBQUU2SCxPQUZFO0FBR0RiLElBQUFBLElBQUksRUFBRTtBQUNMLGdCQUFVLDRDQURMO0FBRUwsZUFBU3BCLElBQUksQ0FBQ0MsR0FBTDtBQUZKLEtBSEw7QUFPRGlDLElBQUFBLE9BQU8sRUFBRSxpQkFBVUMsUUFBVixFQUFxQjtBQUM3QmhKLE1BQUFBLENBQUMsQ0FBRSxnQ0FBRixFQUFvQzZHLElBQUksQ0FBQ0UsTUFBTCxFQUFwQyxDQUFELENBQXFEa0MsSUFBckQsQ0FBMkRELFFBQVEsQ0FBQ2YsSUFBVCxDQUFjaUIsT0FBekU7O0FBQ0EsVUFBSyxTQUFTRixRQUFRLENBQUNmLElBQVQsQ0FBY2hCLElBQTVCLEVBQW1DO0FBQ3hDO0FBQ0FqSCxRQUFBQSxDQUFDLENBQUUsa0NBQUYsQ0FBRCxDQUF3QzhHLEdBQXhDLENBQTZDLENBQTdDO0FBQ0EsT0FISyxNQUdDO0FBQ047QUFDQTlHLFFBQUFBLENBQUMsQ0FBRSxrQ0FBRixDQUFELENBQXdDOEcsR0FBeEMsQ0FBNkMsQ0FBN0M7QUFDQTtBQUNLO0FBaEJBLEdBQVI7QUFrQkEsQ0EzQkQiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApIHtcblx0aWYgKCB0eXBlb2YgZ2EgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdGlmICggdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuJCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24gKCBlICkge1xuXG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBQVU0gKSB7XG5cdFx0dmFyIGN1cnJlbnRfcG9wdXAgPSBQVU0uZ2V0UG9wdXAoICQoICcucHVtJyApICk7XG5cdFx0dmFyIHNldHRpbmdzID0gUFVNLmdldFNldHRpbmdzKCAkKCAnLnB1bScgKSApO1xuXHRcdHZhciBwb3B1cF9pZCA9IHNldHRpbmdzLmlkO1xuXHRcdCQoIGRvY3VtZW50ICkub24oJ3B1bUFmdGVyT3BlbicsIGZ1bmN0aW9uICgpIHtcblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ1Nob3cnLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0gKTtcblx0XHR9KTtcblx0XHQkKCBkb2N1bWVudCApLm9uKCdwdW1BZnRlckNsb3NlJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGNsb3NlX3RyaWdnZXIgPSAkLmZuLnBvcG1ha2UubGFzdF9jbG9zZV90cmlnZ2VyO1xuXHRcdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGNsb3NlX3RyaWdnZXIgKSB7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgY2xvc2VfdHJpZ2dlciwgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9ICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JCggJy5tZXNzYWdlLWNsb3NlJyApLmNsaWNrKGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBsaW5rIHdpdGggY2xvc2UgY2xhc3Ncblx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJ0Nsb3NlIEJ1dHRvbic7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSApO1xuXHRcdH0pO1xuXHRcdCQoICcubWVzc2FnZS1sb2dpbicgKS5jbGljayhmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGxvZ2luIGNsYXNzXG5cdFx0XHR2YXIgdXJsID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdMb2dpbiBMaW5rJywgdXJsICk7XG5cdFx0fSk7XG5cdFx0JCggJy5wdW0tY29udGVudCBhOm5vdCggLm1lc3NhZ2UtY2xvc2UsIC5wdW0tY2xvc2UsIC5tZXNzYWdlLWxvZ2luICknICkuY2xpY2soIGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBzb21ldGhpbmcgdGhhdCBpcyBub3QgY2xvc2UgdGV4dCBvciBjbG9zZSBpY29uXG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdDbGljaycsIHBvcHVwX2lkICk7XG4gICAgICAgIH0pO1xuXHR9XG5cblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSAmJiAnJyAhPT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLnVybF9hY2Nlc3NfbGV2ZWwgKSB7XG5cdFx0dmFyIHR5cGUgPSAnZXZlbnQnO1xuXHRcdHZhciBjYXRlZ29yeSA9ICdNZW1iZXIgQ29udGVudCc7XG5cdFx0dmFyIGxhYmVsID0gbG9jYXRpb24ucGF0aG5hbWU7IC8vIGkgdGhpbmsgd2UgY291bGQgcG9zc2libHkgcHV0IHNvbWUgZ3JvdXBpbmcgaGVyZSwgYnV0IHdlIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYWNjZXNzIHRvIG9uZSBhbmQgbWF5YmUgaXQncyBub3Qgd29ydGh3aGlsZSB5ZXRcblx0XHR2YXIgYWN0aW9uID0gJ0Jsb2NrZWQnO1xuXHRcdGlmICggdHJ1ZSA9PT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLmN1cnJlbnRfdXNlci5jYW5fYWNjZXNzICkge1xuXHRcdFx0YWN0aW9uID0gJ1Nob3duJztcblx0XHR9XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHR9XG59KTtcbiIsImZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICkge1xuXG5cdC8vIGlmIGEgbm90IGxvZ2dlZCBpbiB1c2VyIHRyaWVzIHRvIGVtYWlsLCBkb24ndCBjb3VudCB0aGF0IGFzIGEgc2hhcmVcblx0aWYgKCAhIGpRdWVyeSggJ2JvZHkgJykuaGFzQ2xhc3MoICdsb2dnZWQtaW4nKSAmJiAnRW1haWwnID09PSB0ZXh0ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIHRyYWNrIGFzIGFuIGV2ZW50LCBhbmQgYXMgc29jaWFsIGlmIGl0IGlzIHR3aXR0ZXIgb3IgZmJcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2hhcmUgLSAnICsgcG9zaXRpb24sIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgfHwgJ1R3aXR0ZXInID09PSB0ZXh0ICkge1xuXHRcdFx0aWYgKCB0ZXh0ID09ICdGYWNlYm9vaycgKSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnU2hhcmUnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdUd2VldCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG4kICggJy5tLWVudHJ5LXNoYXJlLXRvcCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpLnRyaW0oKTtcblx0dmFyIHBvc2l0aW9uID0gJ3RvcCc7XG5cdHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG59KTtcblxuJCAoICcubS1lbnRyeS1zaGFyZS1ib3R0b20gYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLnRleHQoKS50cmltKCk7XG5cdHZhciBwb3NpdGlvbiA9ICdib3R0b20nO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSk7XG4iLCIvKipcbiAqIEZpbGUgbmF2aWdhdGlvbi5qcy5cbiAqXG4gKiBIYW5kbGVzIHRvZ2dsaW5nIHRoZSBuYXZpZ2F0aW9uIG1lbnUgZm9yIHNtYWxsIHNjcmVlbnMgYW5kIGVuYWJsZXMgVEFCIGtleVxuICogbmF2aWdhdGlvbiBzdXBwb3J0IGZvciBkcm9wZG93biBtZW51cy5cbiAqL1xuXG5zZXR1cE1lbnUoICduYXZpZ2F0aW9uLXByaW1hcnknICk7XG5zZXR1cE1lbnUoICduYXZpZ2F0aW9uLXVzZXItYWNjb3VudC1tYW5hZ2VtZW50JyApO1xuc2V0dXBOYXZTZWFyY2goICduYXZpZ2F0aW9uLXByaW1hcnknICk7XG5cbmZ1bmN0aW9uIHNldHVwTmF2U2VhcmNoKCBjb250YWluZXIgKSB7XG5cblx0dmFyIG5hdnNlYXJjaGNvbnRhaW5lciwgbmF2c2VhcmNodG9nZ2xlLCBuYXZzZWFyY2hmb3JtO1xuXG5cdGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBjb250YWluZXIgKTtcblx0aWYgKCAhIGNvbnRhaW5lciApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRuYXZzZWFyY2hjb250YWluZXIgPSAkKCAnbGkuc2VhcmNoJywgJCggY29udGFpbmVyICkgKTtcblx0bmF2c2VhcmNodG9nZ2xlICAgID0gJCggJ2xpLnNlYXJjaCBhJywgJCggY29udGFpbmVyICkgKTtcblx0bmF2c2VhcmNoZm9ybSAgICAgID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnZm9ybScgKVswXTtcblxuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgbmF2c2VhcmNodG9nZ2xlIHx8ICd1bmRlZmluZWQnID09PSB0eXBlb2YgbmF2c2VhcmNoZm9ybSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZiAoICQoIG5hdnNlYXJjaGZvcm0gKS5sZW5ndGggPiAwICkge1xuXHRcdCQoIGRvY3VtZW50ICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdHZhciAkdGFyZ2V0ID0gJCggZXZlbnQudGFyZ2V0ICk7XG5cdFx0XHRpZiAoICEgJHRhcmdldC5jbG9zZXN0KCBuYXZzZWFyY2hjb250YWluZXIgKS5sZW5ndGggJiYgJCggbmF2c2VhcmNoZm9ybSApLmlzKCAnOnZpc2libGUnICkgKSB7XG5cdFx0XHRcdG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lID0gbmF2c2VhcmNoZm9ybS5jbGFzc05hbWUucmVwbGFjZSggJyB0b2dnbGVkLWZvcm0nLCAnJyApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5wcm9wKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnJlbW92ZUNsYXNzKCAndG9nZ2xlZC1mb3JtJyApO1xuXHRcdFx0fSAgICAgICAgXG5cdFx0fSk7XG5cdFx0JCggbmF2c2VhcmNodG9nZ2xlICkub24oICdjbGljaycsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRpZiAoIC0xICE9PSBuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZC1mb3JtJyApICkge1xuXHRcdFx0XHRuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZSA9IG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lLnJlcGxhY2UoICcgdG9nZ2xlZC1mb3JtJywgJycgKTtcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucHJvcCggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5yZW1vdmVDbGFzcyggJ3RvZ2dsZWQtZm9ybScgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lICs9ICcgdG9nZ2xlZC1mb3JtJztcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucHJvcCggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLmFkZENsYXNzKCAndG9nZ2xlZC1mb3JtJyApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNldHVwTWVudSggY29udGFpbmVyICkge1xuXHR2YXIgYnV0dG9uLCBtZW51LCBsaW5rcywgaSwgbGVuO1xuXHRjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggY29udGFpbmVyICk7XG5cdGlmICggISBjb250YWluZXIgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0YnV0dG9uID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYnV0dG9uJyApWzBdO1xuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgYnV0dG9uICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1lbnUgPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICd1bCcgKVswXTtcblxuXHQvLyBIaWRlIG1lbnUgdG9nZ2xlIGJ1dHRvbiBpZiBtZW51IGlzIGVtcHR5IGFuZCByZXR1cm4gZWFybHkuXG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBtZW51ICkge1xuXHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0aWYgKCAtMSA9PT0gbWVudS5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cdFx0bWVudS5jbGFzc05hbWUgKz0gJyBtZW51Jztcblx0fVxuXG5cdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCAtMSAhPT0gY29udGFpbmVyLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZCcgKSApIHtcblx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgPSBjb250YWluZXIuY2xhc3NOYW1lLnJlcGxhY2UoICcgdG9nZ2xlZCcsICcnICk7XG5cdFx0XHRidXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSArPSAnIHRvZ2dsZWQnO1xuXHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyApO1xuXHRcdH1cblx0fTtcblxuXHQvLyBHZXQgYWxsIHRoZSBsaW5rIGVsZW1lbnRzIHdpdGhpbiB0aGUgbWVudS5cblx0bGlua3MgICAgPSBtZW51LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYScgKTtcblxuXHQvLyBFYWNoIHRpbWUgYSBtZW51IGxpbmsgaXMgZm9jdXNlZCBvciBibHVycmVkLCB0b2dnbGUgZm9jdXMuXG5cdGZvciAoIGkgPSAwLCBsZW4gPSBsaW5rcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCAnZm9jdXMnLCB0b2dnbGVGb2N1cywgdHJ1ZSApO1xuXHRcdGxpbmtzW2ldLmFkZEV2ZW50TGlzdGVuZXIoICdibHVyJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUb2dnbGVzIGBmb2N1c2AgY2xhc3MgdG8gYWxsb3cgc3VibWVudSBhY2Nlc3Mgb24gdGFibGV0cy5cblx0ICovXG5cdCggZnVuY3Rpb24oIGNvbnRhaW5lciApIHtcblx0XHR2YXIgdG91Y2hTdGFydEZuLCBpLFxuXHRcdFx0cGFyZW50TGluayA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCAnLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4gPiBhLCAucGFnZV9pdGVtX2hhc19jaGlsZHJlbiA+IGEnICk7XG5cblx0XHRpZiAoICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyApIHtcblx0XHRcdHRvdWNoU3RhcnRGbiA9IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgbWVudUl0ZW0gPSB0aGlzLnBhcmVudE5vZGUsIGk7XG5cblx0XHRcdFx0aWYgKCAhIG1lbnVJdGVtLmNsYXNzTGlzdC5jb250YWlucyggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW4ubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1lbnVJdGVtID09PSBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldICkge1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW5baV0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtZW51SXRlbS5jbGFzc0xpc3QuYWRkKCAnZm9jdXMnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LnJlbW92ZSggJ2ZvY3VzJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRmb3IgKCBpID0gMDsgaSA8IHBhcmVudExpbmsubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdHBhcmVudExpbmtbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCB0b3VjaFN0YXJ0Rm4sIGZhbHNlICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KCBjb250YWluZXIgKSApO1xufVxuXG4vKipcbiAqIFNldHMgb3IgcmVtb3ZlcyAuZm9jdXMgY2xhc3Mgb24gYW4gZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gdG9nZ2xlRm9jdXMoKSB7XG5cdHZhciBzZWxmID0gdGhpcztcblxuXHQvLyBNb3ZlIHVwIHRocm91Z2ggdGhlIGFuY2VzdG9ycyBvZiB0aGUgY3VycmVudCBsaW5rIHVudGlsIHdlIGhpdCAubmF2LW1lbnUuXG5cdHdoaWxlICggLTEgPT09IHNlbGYuY2xhc3NOYW1lLmluZGV4T2YoICdtZW51JyApICkge1xuXG5cdFx0Ly8gT24gbGkgZWxlbWVudHMgdG9nZ2xlIHRoZSBjbGFzcyAuZm9jdXMuXG5cdFx0aWYgKCAnbGknID09PSBzZWxmLnRhZ05hbWUudG9Mb3dlckNhc2UoKSApIHtcblx0XHRcdGlmICggLTEgIT09IHNlbGYuY2xhc3NOYW1lLmluZGV4T2YoICdmb2N1cycgKSApIHtcblx0XHRcdFx0c2VsZi5jbGFzc05hbWUgPSBzZWxmLmNsYXNzTmFtZS5yZXBsYWNlKCAnIGZvY3VzJywgJycgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlbGYuY2xhc3NOYW1lICs9ICcgZm9jdXMnO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHNlbGYgPSBzZWxmLnBhcmVudEVsZW1lbnQ7XG5cdH1cbn1cblxuJCggJyNuYXZpZ2F0aW9uLWZlYXR1cmVkIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdGZWF0dXJlZCBCYXIgTGluaycsICdDbGljaycsIHRoaXMuaHJlZiApO1xufSk7XG5cbiQoICdhLmdsZWFuLXNpZGViYXInICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdTaWRlYmFyIFN1cHBvcnQgTGluaycsICdDbGljaycsIHRoaXMuaHJlZiApO1xufSk7XG5cbiQoICdhJywgJCggJy5vLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0dmFyIHdpZGdldF90aXRsZSA9ICQodGhpcykuY2xvc2VzdCgnLm0td2lkZ2V0JykuZmluZCgnaDMnKS50ZXh0KCk7XG5cdHZhciB6b25lX3RpdGxlICAgPSAkKHRoaXMpLmNsb3Nlc3QoJy5tLXpvbmUnKS5maW5kKCcuYS16b25lLXRpdGxlJykudGV4dCgpO1xuXHR2YXIgc2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gJyc7XG5cdGlmICggJycgIT09IHdpZGdldF90aXRsZSApIHtcblx0XHRzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSB3aWRnZXRfdGl0bGU7XG5cdH0gZWxzZSBpZiAoICcnICE9PSB6b25lX3RpdGxlICkge1xuXHRcdHNpZGViYXJfc2VjdGlvbl90aXRsZSA9IHpvbmVfdGl0bGU7XG5cdH1cblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCdldmVudCcsICdTaWRlYmFyIExpbmsnLCAnQ2xpY2snLCBzaWRlYmFyX3NlY3Rpb25fdGl0bGUpO1xufSk7XG5cbi8vIHVzZXIgYWNjb3VudCBuYXZpZ2F0aW9uIGNhbiBiZSBhIGRyb3Bkb3duXG4kKCBkb2N1bWVudCApLnJlYWR5KGZ1bmN0aW9uKCkge1xuXHQvLyBoaWRlIG1lbnVcblx0aWYgKCQoJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJykubGVuZ3RoID4gMCApIHtcblx0XHQkKCcjdXNlci1hY2NvdW50LWFjY2VzcyA+IGxpID4gYScpLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0JCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgdWwnKS50b2dnbGVDbGFzcyggJ3Zpc2libGUnICk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0pO1xuXHR9XG59KTtcbiIsIlxualF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlcihmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKHRoaXMubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmIHRoaXMubm9kZVZhbHVlLnRyaW0oKSAhPT0gXCJcIik7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0cmV0dXJuIG1hcmt1cDtcbn1cblxuZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCgnI2FjY291bnQtc2V0dGluZ3MtZm9ybScpO1xuXHR2YXIgcmVzdF9yb290ICAgICAgICAgID0gdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5zaXRlX3VybCArIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QucmVzdF9uYW1lc3BhY2U7XG5cdHZhciBmdWxsX3VybCAgICAgICAgICAgPSByZXN0X3Jvb3QgKyAnLycgKyAndXBkYXRlLXVzZXIvJztcblx0dmFyIGNvbmZpcm1DaGFuZ2UgICAgICA9ICcnO1xuXHR2YXIgbmV4dEVtYWlsQ291bnQgICAgID0gMTtcblx0dmFyIG5ld1ByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgb2xkUHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBwcmltYXJ5SWQgICAgICAgICAgPSAnJztcblx0dmFyIGVtYWlsVG9SZW1vdmUgICAgICA9ICcnO1xuXHR2YXIgY29uc29saWRhdGVkRW1haWxzID0gW107XG5cdHZhciBuZXdFbWFpbHMgICAgICAgICAgPSBbXTtcblx0dmFyIGFqYXhfZm9ybV9kYXRhICAgICA9ICcnO1xuXHR2YXIgdGhhdCAgICAgICAgICAgICAgID0gJyc7XG5cdC8vIHN0YXJ0IG91dCB3aXRoIG5vIHByaW1hcnkvcmVtb3ZhbHMgY2hlY2tlZFxuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0Ly8gaWYgdGhlcmUgaXMgYSBsaXN0IG9mIGVtYWlscyAobm90IGp1c3QgYSBzaW5nbGUgZm9ybSBmaWVsZClcblx0aWYgKCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCA+IDAgKSB7XG5cdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdC8vIGlmIGEgdXNlciBzZWxlY3RzIGEgbmV3IHByaW1hcnksIG1vdmUgaXQgaW50byB0aGF0IHBvc2l0aW9uXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcblx0XHRcdG5ld1ByaW1hcnlFbWFpbCA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdG9sZFByaW1hcnlFbWFpbCA9ICQoICcjZW1haWwnICkudmFsKCk7XG5cdFx0XHRwcmltYXJ5SWQgICAgICAgPSAkKCB0aGlzICkucHJvcCggJ2lkJyApLnJlcGxhY2UoICdwcmltYXJ5X2VtYWlsXycsICcnICk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncHJpbWFyeS1jaGFuZ2UnICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlclxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdC8vJCggdGhpcyApLnBhcmVudCgpLmFmdGVyKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgbWFpbiBoaWRkZW4gZm9ybSB2YWx1ZVxuXHRcdFx0XHQkKCAnI2VtYWlsJyApLnZhbCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdC8vIHN1Ym1pdCBmb3JtIHZhbHVlcy5cblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0Ly8gdW5jaGVjayB0aGUgcmFkaW8gYnV0dG9uXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBmb3JtIHZhbHVlcyB0byB0aGUgb2xkIHByaW1hcnkgZW1haWxcblx0XHRcdFx0JCggJyNwcmltYXJ5X2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3JlbW92ZV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0Ly8gcmVtb3ZlIHRoZSBjb25maXJtIG1lc3NhZ2Vcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdC8vIGlmIGEgdXNlciByZW1vdmVzIGFuIGVtYWlsLCB0YWtlIGl0IGF3YXkgZnJvbSB0aGUgdmlzdWFsIGFuZCBmcm9tIHRoZSBmb3JtXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NoYW5nZScsICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZW1haWxUb1JlbW92ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdyZW1vdmFsJyApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgIT09IGVtYWlsVG9SZW1vdmUgKSB7XG5cdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlciBmb3IgcmVtb3ZhbFxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblx0XHRcdC8vIGlmIGNvbmZpcm1lZCwgcmVtb3ZlIHRoZSBlbWFpbCBhbmQgc3VibWl0IHRoZSBmb3JtXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpJyApLmZhZGVPdXQoICdub3JtYWwnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkucmVtb3ZlKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCAndmFsdWUgaXMgJyArIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIGlmIGEgdXNlciB3YW50cyB0byBhZGQgYW4gZW1haWwsIGdpdmUgdGhlbSBhIHByb3Blcmx5IG51bWJlcmVkIGZpZWxkXG5cdCQoICcubS1mb3JtLWVtYWlsJyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCgnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJykuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvbiBhLWJ1dHRvbi1hZGQtdXNlci1lbWFpbFwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRuZXh0RW1haWxDb3VudCsrO1xuXHR9KTtcblxuXHQkKCAnaW5wdXRbdHlwZT1zdWJtaXRdJyApLmNsaWNrKCBmdW5jdGlvbiAoIGUgKSB7XG5cdFx0dmFyIGJ1dHRvbiA9ICQoIHRoaXMgKTtcblx0XHR2YXIgYnV0dG9uX2Zvcm0gPSBidXR0b24uY2xvc2VzdCggJ2Zvcm0nICk7XG5cdFx0YnV0dG9uX2Zvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJywgYnV0dG9uLnZhbCgpICk7XG5cdH0pO1xuXG5cdCQoICcubS1lbnRyeS1jb250ZW50JyApLm9uKCAnc3VibWl0JywgJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0dmFyIGZvcm0gPSAkKCB0aGlzICk7XG5cdFx0dmFyIHN1Ym1pdHRpbmdfYnV0dG9uID0gZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nICkgfHwgJyc7XG5cdFx0Ly8gaWYgdGhlcmUgaXMgbm8gc3VibWl0dGluZyBidXR0b24sIHBhc3MgaXQgYnkgQWpheFxuXHRcdGlmICggJycgPT09IHN1Ym1pdHRpbmdfYnV0dG9uIHx8ICdTYXZlIENoYW5nZXMnICE9PSBzdWJtaXR0aW5nX2J1dHRvbiApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhamF4X2Zvcm1fZGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7IC8vYWRkIG91ciBvd24gYWpheCBjaGVjayBhcyBYLVJlcXVlc3RlZC1XaXRoIGlzIG5vdCBhbHdheXMgcmVsaWFibGVcblx0XHRcdGFqYXhfZm9ybV9kYXRhID0gYWpheF9mb3JtX2RhdGEgKyAnJnJlc3Q9dHJ1ZSc7XG5cdFx0XHQkLmFqYXgoe1xuXHRcdFx0XHR1cmw6IGZ1bGxfdXJsLFxuXHRcdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICggeGhyICkge1xuXHRcdFx0ICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Lm5vbmNlICk7XG5cdFx0XHQgICAgfSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0ZGF0YTogYWpheF9mb3JtX2RhdGFcblx0XHRcdH0pLmRvbmUoIGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0XHRuZXdFbWFpbHMgPSAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gJCh0aGlzKS52YWwoKTtcblx0XHRcdFx0fSkuZ2V0KCk7XG5cdFx0XHRcdCQuZWFjaCggbmV3RW1haWxzLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICkge1xuXHRcdFx0XHRcdG5leHRFbWFpbENvdW50ID0gbmV4dEVtYWlsQ291bnQgKyBpbmRleDtcblx0XHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmFwcGVuZCggJzxsaSBpZD1cInVzZXItZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPicgKyB2YWx1ZSArICc8dWwgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXVzZXItZW1haWwtYWN0aW9uc1wiPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1tYWtlLXByaW1hcnktZW1haWxcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW1hcnlfZW1haWxcIiBpZD1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+TWFrZSBQcmltYXJ5PC9zbWFsbD48L2xhYmVsPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLWVtYWlsLXByZWZlcmVuY2VzXCI+PGEgaHJlZj1cIi9uZXdzbGV0dGVycy8/ZW1haWw9JyArIGVuY29kZVVSSUNvbXBvbmVudCggdmFsdWUgKSArICdcIj48c21hbGw+RW1haWwgUHJlZmVyZW5jZXM8L3NtYWxsPjwvYT48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggJCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoKSArICcsJyArIHZhbHVlICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cdFx0XHRcdFx0XHQvLyBpdCB3b3VsZCBiZSBuaWNlIHRvIG9ubHkgbG9hZCB0aGUgZm9ybSwgYnV0IHRoZW4gY2xpY2sgZXZlbnRzIHN0aWxsIGRvbid0IHdvcmtcblx0XHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuJCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24gKCAkICkge1xuXHRcInVzZSBzdHJpY3RcIjtcblx0aWYgKCAkKCcubS1mb3JtLWVtYWlsJykubGVuZ3RoID4gMCApIHtcblx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0fVxufSk7XG4iLCIvLyBTZXQgdXNlciBtZXRhIHZhbHVlIGZvciBhbHdheXMgc2hvd2luZyBjb21tZW50cyBpZiB0aGF0IGJ1dHRvbiBpcyBjbGlja2VkXG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dmFyIHRoYXQgPSAkKCB0aGlzICk7XG5cdGlmICggdGhhdC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0fSBlbHNlIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHR9XG5cblx0Ly8gd2UgYWxyZWFkeSBoYXZlIGFqYXh1cmwgZnJvbSB0aGUgdGhlbWVcblx0JC5hamF4KCB7XG5cdFx0dHlwZTogJ1BPU1QnLFxuXHRcdHVybDogYWpheHVybCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICBcdCdhY3Rpb24nOiAnbWlubnBvc3RfbGFyZ29fbG9hZF9jb21tZW50c19zZXRfdXNlcl9tZXRhJyxcbiAgICAgICAgXHQndmFsdWUnOiB0aGF0LnZhbCgpXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcbiAgICAgICAgXHQkKCAnLmEtYWx3YXlzLXNob3ctY29tbWVudHMtcmVzdWx0JywgdGhhdC5wYXJlbnQoKSApLmh0bWwoIHJlc3BvbnNlLmRhdGEubWVzc2FnZSApO1xuICAgICAgICBcdGlmICggdHJ1ZSA9PT0gcmVzcG9uc2UuZGF0YS5zaG93ICkge1xuXHRcdFx0XHQvL3RoYXQudGV4dCggdGhhdC5kYXRhKCAndG9nZ2xlLXRleHQnICkgKTtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly90aGF0LnRleHQoIHRoYXQuZGF0YSggJ2RlZmF1bHQtdGV4dCcgKSApO1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAxICk7XG5cdFx0XHR9XG4gICAgICAgIH1cbiAgICB9ICk7XG59ICk7Il19
}(jQuery));
