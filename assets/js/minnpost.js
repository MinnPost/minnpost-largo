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

// button click for showing comments one time
$(document).on('click', '.a-button-show-comments', function () {
  trackShowComments(false, '', '');
}); // button click for always showing comments displayed before the comment list

$(document).on('click', '#always-show-comments-before', function () {
  trackShowComments(true, 'Before', $(this).val());
}); // button click for always showing comments displayed after the comment list

$(document).on('click', '#always-show-comments-after', function () {
  trackShowComments(true, 'After', $(this).val());
});

function trackShowComments(always, position, click_value) {
  var action = '';
  var category_prefix = '';
  var category_suffix = '';

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
    category_suffix = ' - ' + position;
  }

  mp_analytics_tracking_event('event', category_prefix + 'Show Comments' + category_suffix, action, location.pathname);
} // Set user meta value for always showing comments if that button is clicked


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
        $('.a-checkbox-always-show-comments').val(0);
      } else {
        $('.a-checkbox-always-show-comments').val(1);
      }
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLWFuYWx5dGljcy5qcyIsIjAyLXNoYXJlLmpzIiwiMDMtbmF2aWdhdGlvbi5qcyIsIjA0LWZvcm1zLmpzIiwiMDUtY29tbWVudHMuanMiXSwibmFtZXMiOlsibXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50IiwidHlwZSIsImNhdGVnb3J5IiwiYWN0aW9uIiwibGFiZWwiLCJ2YWx1ZSIsImdhIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJlIiwiUFVNIiwiY3VycmVudF9wb3B1cCIsImdldFBvcHVwIiwic2V0dGluZ3MiLCJnZXRTZXR0aW5ncyIsInBvcHVwX2lkIiwiaWQiLCJvbiIsImNsb3NlX3RyaWdnZXIiLCJmbiIsInBvcG1ha2UiLCJsYXN0X2Nsb3NlX3RyaWdnZXIiLCJjbGljayIsInVybCIsImF0dHIiLCJtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEiLCJ1cmxfYWNjZXNzX2xldmVsIiwibG9jYXRpb24iLCJwYXRobmFtZSIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJ0cmltIiwic2V0dXBNZW51Iiwic2V0dXBOYXZTZWFyY2giLCJjb250YWluZXIiLCJuYXZzZWFyY2hjb250YWluZXIiLCJuYXZzZWFyY2h0b2dnbGUiLCJuYXZzZWFyY2hmb3JtIiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImxlbmd0aCIsImV2ZW50IiwiJHRhcmdldCIsInRhcmdldCIsImNsb3Nlc3QiLCJpcyIsImNsYXNzTmFtZSIsInJlcGxhY2UiLCJwcm9wIiwicmVtb3ZlQ2xhc3MiLCJwcmV2ZW50RGVmYXVsdCIsImluZGV4T2YiLCJhZGRDbGFzcyIsImJ1dHRvbiIsIm1lbnUiLCJsaW5rcyIsImkiLCJsZW4iLCJzdHlsZSIsImRpc3BsYXkiLCJzZXRBdHRyaWJ1dGUiLCJvbmNsaWNrIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRvZ2dsZUZvY3VzIiwidG91Y2hTdGFydEZuIiwicGFyZW50TGluayIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJ3aW5kb3ciLCJtZW51SXRlbSIsInBhcmVudE5vZGUiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImNoaWxkcmVuIiwicmVtb3ZlIiwiYWRkIiwic2VsZiIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsInBhcmVudEVsZW1lbnQiLCJocmVmIiwid2lkZ2V0X3RpdGxlIiwiZmluZCIsInpvbmVfdGl0bGUiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJ0b2dnbGVDbGFzcyIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwiZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCIsIm1hcmt1cCIsIm1hbmFnZUVtYWlscyIsImZvcm0iLCJyZXN0X3Jvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxfdXJsIiwiY29uZmlybUNoYW5nZSIsIm5leHRFbWFpbENvdW50IiwibmV3UHJpbWFyeUVtYWlsIiwib2xkUHJpbWFyeUVtYWlsIiwicHJpbWFyeUlkIiwiZW1haWxUb1JlbW92ZSIsImNvbnNvbGlkYXRlZEVtYWlscyIsIm5ld0VtYWlscyIsImFqYXhfZm9ybV9kYXRhIiwidGhhdCIsInZhbCIsInBhcmVudCIsImhpZGUiLCJzaG93IiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJpbmRleCIsImdldCIsInB1c2giLCJwYXJlbnRzIiwiZmFkZU91dCIsImpvaW4iLCJjb25zb2xlIiwibG9nIiwiYmVmb3JlIiwiYnV0dG9uX2Zvcm0iLCJkYXRhIiwic3VibWl0dGluZ19idXR0b24iLCJzZXJpYWxpemUiLCJhamF4IiwiYmVmb3JlU2VuZCIsInhociIsInNldFJlcXVlc3RIZWFkZXIiLCJub25jZSIsImRhdGFUeXBlIiwiZG9uZSIsIm1hcCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiY2xpY2tfdmFsdWUiLCJjYXRlZ29yeV9wcmVmaXgiLCJjYXRlZ29yeV9zdWZmaXgiLCJhamF4dXJsIiwic3VjY2VzcyIsInJlc3BvbnNlIiwiaHRtbCIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsMkJBQVQsQ0FBc0NDLElBQXRDLEVBQTRDQyxRQUE1QyxFQUFzREMsTUFBdEQsRUFBOERDLEtBQTlELEVBQXFFQyxLQUFyRSxFQUE2RTtBQUM1RSxNQUFLLE9BQU9DLEVBQVAsS0FBYyxXQUFuQixFQUFpQztBQUNoQyxRQUFLLE9BQU9ELEtBQVAsS0FBaUIsV0FBdEIsRUFBb0M7QUFDbkNDLE1BQUFBLEVBQUUsQ0FBRSxNQUFGLEVBQVVMLElBQVYsRUFBZ0JDLFFBQWhCLEVBQTBCQyxNQUExQixFQUFrQ0MsS0FBbEMsQ0FBRjtBQUNBLEtBRkQsTUFFTztBQUNORSxNQUFBQSxFQUFFLENBQUUsTUFBRixFQUFVTCxJQUFWLEVBQWdCQyxRQUFoQixFQUEwQkMsTUFBMUIsRUFBa0NDLEtBQWxDLEVBQXlDQyxLQUF6QyxDQUFGO0FBQ0E7QUFDRCxHQU5ELE1BTU87QUFDTjtBQUNBO0FBQ0Q7O0FBRURFLENBQUMsQ0FBRUMsUUFBRixDQUFELENBQWNDLEtBQWQsQ0FBcUIsVUFBV0MsQ0FBWCxFQUFlO0FBRW5DLE1BQUssZ0JBQWdCLE9BQU9DLEdBQTVCLEVBQWtDO0FBQ2pDLFFBQUlDLGFBQWEsR0FBR0QsR0FBRyxDQUFDRSxRQUFKLENBQWNOLENBQUMsQ0FBRSxNQUFGLENBQWYsQ0FBcEI7QUFDQSxRQUFJTyxRQUFRLEdBQUdILEdBQUcsQ0FBQ0ksV0FBSixDQUFpQlIsQ0FBQyxDQUFFLE1BQUYsQ0FBbEIsQ0FBZjtBQUNBLFFBQUlTLFFBQVEsR0FBR0YsUUFBUSxDQUFDRyxFQUF4QjtBQUNBVixJQUFBQSxDQUFDLENBQUVDLFFBQUYsQ0FBRCxDQUFjVSxFQUFkLENBQWlC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bmN0aW9uIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICkge1xuXHRpZiAoIHR5cGVvZiBnYSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0aWYgKCB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiAoIGUgKSB7XG5cblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIFBVTSApIHtcblx0XHR2YXIgY3VycmVudF9wb3B1cCA9IFBVTS5nZXRQb3B1cCggJCggJy5wdW0nICkgKTtcblx0XHR2YXIgc2V0dGluZ3MgPSBQVU0uZ2V0U2V0dGluZ3MoICQoICcucHVtJyApICk7XG5cdFx0dmFyIHBvcHVwX2lkID0gc2V0dGluZ3MuaWQ7XG5cdFx0JCggZG9jdW1lbnQgKS5vbigncHVtQWZ0ZXJPcGVuJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnU2hvdycsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSApO1xuXHRcdH0pO1xuXHRcdCQoIGRvY3VtZW50ICkub24oJ3B1bUFmdGVyQ2xvc2UnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgY2xvc2VfdHJpZ2dlciA9ICQuZm4ucG9wbWFrZS5sYXN0X2Nsb3NlX3RyaWdnZXI7XG5cdFx0XHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgY2xvc2VfdHJpZ2dlciApIHtcblx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCBjbG9zZV90cmlnZ2VyLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0gKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkKCAnLm1lc3NhZ2UtY2xvc2UnICkuY2xpY2soZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIGxpbmsgd2l0aCBjbG9zZSBjbGFzc1xuXHRcdFx0dmFyIGNsb3NlX3RyaWdnZXIgPSAnQ2xvc2UgQnV0dG9uJztcblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgY2xvc2VfdHJpZ2dlciwgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9ICk7XG5cdFx0fSk7XG5cdFx0JCggJy5tZXNzYWdlLWxvZ2luJyApLmNsaWNrKGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBsaW5rIHdpdGggbG9naW4gY2xhc3Ncblx0XHRcdHZhciB1cmwgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ0xvZ2luIExpbmsnLCB1cmwgKTtcblx0XHR9KTtcblx0XHQkKCAnLnB1bS1jb250ZW50IGE6bm90KCAubWVzc2FnZS1jbG9zZSwgLnB1bS1jbG9zZSwgLm1lc3NhZ2UtbG9naW4gKScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIHNvbWV0aGluZyB0aGF0IGlzIG5vdCBjbG9zZSB0ZXh0IG9yIGNsb3NlIGljb25cblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ0NsaWNrJywgcG9wdXBfaWQgKTtcbiAgICAgICAgfSk7XG5cdH1cblxuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdH1cblx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdH1cbn0pO1xuIiwiZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKSB7XG5cblx0Ly8gaWYgYSBub3QgbG9nZ2VkIGluIHVzZXIgdHJpZXMgdG8gZW1haWwsIGRvbid0IGNvdW50IHRoYXQgYXMgYSBzaGFyZVxuXHRpZiAoICEgalF1ZXJ5KCAnYm9keSAnKS5oYXNDbGFzcyggJ2xvZ2dlZC1pbicpICYmICdFbWFpbCcgPT09IHRleHQgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gdHJhY2sgYXMgYW4gZXZlbnQsIGFuZCBhcyBzb2NpYWwgaWYgaXQgaXMgdHdpdHRlciBvciBmYlxuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdTaGFyZSAtICcgKyBwb3NpdGlvbiwgdGV4dCwgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGdhICkge1xuXHRcdGlmICggJ0ZhY2Vib29rJyA9PT0gdGV4dCB8fCAnVHdpdHRlcicgPT09IHRleHQgKSB7XG5cdFx0XHRpZiAoIHRleHQgPT0gJ0ZhY2Vib29rJyApIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdTaGFyZScsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1R3ZWV0JywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbiQgKCAnLm0tZW50cnktc2hhcmUtdG9wIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHR2YXIgdGV4dCA9ICQoIHRoaXMgKS50ZXh0KCkudHJpbSgpO1xuXHR2YXIgcG9zaXRpb24gPSAndG9wJztcblx0dHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcbn0pO1xuXG4kICggJy5tLWVudHJ5LXNoYXJlLWJvdHRvbSBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpLnRyaW0oKTtcblx0dmFyIHBvc2l0aW9uID0gJ2JvdHRvbSc7XG5cdHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG59KTtcbiIsIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIEhhbmRsZXMgdG9nZ2xpbmcgdGhlIG5hdmlnYXRpb24gbWVudSBmb3Igc21hbGwgc2NyZWVucyBhbmQgZW5hYmxlcyBUQUIga2V5XG4gKiBuYXZpZ2F0aW9uIHN1cHBvcnQgZm9yIGRyb3Bkb3duIG1lbnVzLlxuICovXG5cbnNldHVwTWVudSggJ25hdmlnYXRpb24tcHJpbWFyeScgKTtcbnNldHVwTWVudSggJ25hdmlnYXRpb24tdXNlci1hY2NvdW50LW1hbmFnZW1lbnQnICk7XG5zZXR1cE5hdlNlYXJjaCggJ25hdmlnYXRpb24tcHJpbWFyeScgKTtcblxuZnVuY3Rpb24gc2V0dXBOYXZTZWFyY2goIGNvbnRhaW5lciApIHtcblxuXHR2YXIgbmF2c2VhcmNoY29udGFpbmVyLCBuYXZzZWFyY2h0b2dnbGUsIG5hdnNlYXJjaGZvcm07XG5cblx0Y29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGNvbnRhaW5lciApO1xuXHRpZiAoICEgY29udGFpbmVyICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG5hdnNlYXJjaGNvbnRhaW5lciA9ICQoICdsaS5zZWFyY2gnLCAkKCBjb250YWluZXIgKSApO1xuXHRuYXZzZWFyY2h0b2dnbGUgICAgPSAkKCAnbGkuc2VhcmNoIGEnLCAkKCBjb250YWluZXIgKSApO1xuXHRuYXZzZWFyY2hmb3JtICAgICAgPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdmb3JtJyApWzBdO1xuXG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBuYXZzZWFyY2h0b2dnbGUgfHwgJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBuYXZzZWFyY2hmb3JtICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmICggJCggbmF2c2VhcmNoZm9ybSApLmxlbmd0aCA+IDAgKSB7XG5cdFx0JCggZG9jdW1lbnQgKS5jbGljayggZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0dmFyICR0YXJnZXQgPSAkKCBldmVudC50YXJnZXQgKTtcblx0XHRcdGlmICggISAkdGFyZ2V0LmNsb3Nlc3QoIG5hdnNlYXJjaGNvbnRhaW5lciApLmxlbmd0aCAmJiAkKCBuYXZzZWFyY2hmb3JtICkuaXMoICc6dmlzaWJsZScgKSApIHtcblx0XHRcdFx0bmF2c2VhcmNoZm9ybS5jbGFzc05hbWUgPSBuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZS5yZXBsYWNlKCAnIHRvZ2dsZWQtZm9ybScsICcnICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnByb3AoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucmVtb3ZlQ2xhc3MoICd0b2dnbGVkLWZvcm0nICk7XG5cdFx0XHR9ICAgICAgICBcblx0XHR9KTtcblx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGlmICggLTEgIT09IG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lLmluZGV4T2YoICd0b2dnbGVkLWZvcm0nICkgKSB7XG5cdFx0XHRcdG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lID0gbmF2c2VhcmNoZm9ybS5jbGFzc05hbWUucmVwbGFjZSggJyB0b2dnbGVkLWZvcm0nLCAnJyApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5wcm9wKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnJlbW92ZUNsYXNzKCAndG9nZ2xlZC1mb3JtJyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmF2c2VhcmNoZm9ybS5jbGFzc05hbWUgKz0gJyB0b2dnbGVkLWZvcm0nO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5wcm9wKCAnYXJpYS1leHBhbmRlZCcsIHRydWUgKTtcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkuYWRkQ2xhc3MoICd0b2dnbGVkLWZvcm0nICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2V0dXBNZW51KCBjb250YWluZXIgKSB7XG5cdHZhciBidXR0b24sIG1lbnUsIGxpbmtzLCBpLCBsZW47XG5cdGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBjb250YWluZXIgKTtcblx0aWYgKCAhIGNvbnRhaW5lciApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRidXR0b24gPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdidXR0b24nIClbMF07XG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBidXR0b24gKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bWVudSA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ3VsJyApWzBdO1xuXG5cdC8vIEhpZGUgbWVudSB0b2dnbGUgYnV0dG9uIGlmIG1lbnUgaXMgZW1wdHkgYW5kIHJldHVybiBlYXJseS5cblx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG1lbnUgKSB7XG5cdFx0YnV0dG9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRpZiAoIC0xID09PSBtZW51LmNsYXNzTmFtZS5pbmRleE9mKCAnbWVudScgKSApIHtcblx0XHRtZW51LmNsYXNzTmFtZSArPSAnIG1lbnUnO1xuXHR9XG5cblx0YnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIC0xICE9PSBjb250YWluZXIuY2xhc3NOYW1lLmluZGV4T2YoICd0b2dnbGVkJyApICkge1xuXHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IGNvbnRhaW5lci5jbGFzc05hbWUucmVwbGFjZSggJyB0b2dnbGVkJywgJycgKTtcblx0XHRcdGJ1dHRvbi5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRcdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb250YWluZXIuY2xhc3NOYW1lICs9ICcgdG9nZ2xlZCc7XG5cdFx0XHRidXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyApO1xuXHRcdFx0bWVudS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEdldCBhbGwgdGhlIGxpbmsgZWxlbWVudHMgd2l0aGluIHRoZSBtZW51LlxuXHRsaW5rcyAgICA9IG1lbnUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdhJyApO1xuXG5cdC8vIEVhY2ggdGltZSBhIG1lbnUgbGluayBpcyBmb2N1c2VkIG9yIGJsdXJyZWQsIHRvZ2dsZSBmb2N1cy5cblx0Zm9yICggaSA9IDAsIGxlbiA9IGxpbmtzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdGxpbmtzW2ldLmFkZEV2ZW50TGlzdGVuZXIoICdmb2N1cycsIHRvZ2dsZUZvY3VzLCB0cnVlICk7XG5cdFx0bGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ2JsdXInLCB0b2dnbGVGb2N1cywgdHJ1ZSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRvZ2dsZXMgYGZvY3VzYCBjbGFzcyB0byBhbGxvdyBzdWJtZW51IGFjY2VzcyBvbiB0YWJsZXRzLlxuXHQgKi9cblx0KCBmdW5jdGlvbiggY29udGFpbmVyICkge1xuXHRcdHZhciB0b3VjaFN0YXJ0Rm4sIGksXG5cdFx0XHRwYXJlbnRMaW5rID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoICcubWVudS1pdGVtLWhhcy1jaGlsZHJlbiA+IGEsIC5wYWdlX2l0ZW1faGFzX2NoaWxkcmVuID4gYScgKTtcblxuXHRcdGlmICggJ29udG91Y2hzdGFydCcgaW4gd2luZG93ICkge1xuXHRcdFx0dG91Y2hTdGFydEZuID0gZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdHZhciBtZW51SXRlbSA9IHRoaXMucGFyZW50Tm9kZSwgaTtcblxuXHRcdFx0XHRpZiAoICEgbWVudUl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCAnZm9jdXMnICkgKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgbWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbi5sZW5ndGg7ICsraSApIHtcblx0XHRcdFx0XHRcdGlmICggbWVudUl0ZW0gPT09IG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW5baV0gKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbltpXS5jbGFzc0xpc3QucmVtb3ZlKCAnZm9jdXMnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG1lbnVJdGVtLmNsYXNzTGlzdC5hZGQoICdmb2N1cycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZW51SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCAnZm9jdXMnICk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGZvciAoIGkgPSAwOyBpIDwgcGFyZW50TGluay5sZW5ndGg7ICsraSApIHtcblx0XHRcdFx0cGFyZW50TGlua1tpXS5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIHRvdWNoU3RhcnRGbiwgZmFsc2UgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0oIGNvbnRhaW5lciApICk7XG59XG5cbi8qKlxuICogU2V0cyBvciByZW1vdmVzIC5mb2N1cyBjbGFzcyBvbiBhbiBlbGVtZW50LlxuICovXG5mdW5jdGlvbiB0b2dnbGVGb2N1cygpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdC8vIE1vdmUgdXAgdGhyb3VnaCB0aGUgYW5jZXN0b3JzIG9mIHRoZSBjdXJyZW50IGxpbmsgdW50aWwgd2UgaGl0IC5uYXYtbWVudS5cblx0d2hpbGUgKCAtMSA9PT0gc2VsZi5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cblx0XHQvLyBPbiBsaSBlbGVtZW50cyB0b2dnbGUgdGhlIGNsYXNzIC5mb2N1cy5cblx0XHRpZiAoICdsaScgPT09IHNlbGYudGFnTmFtZS50b0xvd2VyQ2FzZSgpICkge1xuXHRcdFx0aWYgKCAtMSAhPT0gc2VsZi5jbGFzc05hbWUuaW5kZXhPZiggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRzZWxmLmNsYXNzTmFtZSA9IHNlbGYuY2xhc3NOYW1lLnJlcGxhY2UoICcgZm9jdXMnLCAnJyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VsZi5jbGFzc05hbWUgKz0gJyBmb2N1cyc7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0c2VsZiA9IHNlbGYucGFyZW50RWxlbWVudDtcblx0fVxufVxuXG4kKCAnI25hdmlnYXRpb24tZmVhdHVyZWQgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ0ZlYXR1cmVkIEJhciBMaW5rJywgJ0NsaWNrJywgdGhpcy5ocmVmICk7XG59KTtcblxuJCggJ2EuZ2xlYW4tc2lkZWJhcicgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1NpZGViYXIgU3VwcG9ydCBMaW5rJywgJ0NsaWNrJywgdGhpcy5ocmVmICk7XG59KTtcblxuJCggJ2EnLCAkKCAnLm8tc2l0ZS1zaWRlYmFyJyApICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHR2YXIgd2lkZ2V0X3RpdGxlID0gJCh0aGlzKS5jbG9zZXN0KCcubS13aWRnZXQnKS5maW5kKCdoMycpLnRleHQoKTtcblx0dmFyIHpvbmVfdGl0bGUgICA9ICQodGhpcykuY2xvc2VzdCgnLm0tem9uZScpLmZpbmQoJy5hLXpvbmUtdGl0bGUnKS50ZXh0KCk7XG5cdHZhciBzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSAnJztcblx0aWYgKCAnJyAhPT0gd2lkZ2V0X3RpdGxlICkge1xuXHRcdHNpZGViYXJfc2VjdGlvbl90aXRsZSA9IHdpZGdldF90aXRsZTtcblx0fSBlbHNlIGlmICggJycgIT09IHpvbmVfdGl0bGUgKSB7XG5cdFx0c2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gem9uZV90aXRsZTtcblx0fVxuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJfc2VjdGlvbl90aXRsZSk7XG59KTtcblxuLy8gdXNlciBhY2NvdW50IG5hdmlnYXRpb24gY2FuIGJlIGEgZHJvcGRvd25cbiQoIGRvY3VtZW50ICkucmVhZHkoZnVuY3Rpb24oKSB7XG5cdC8vIGhpZGUgbWVudVxuXHRpZiAoJCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgdWwnKS5sZW5ndGggPiAwICkge1xuXHRcdCQoJyN1c2VyLWFjY291bnQtYWNjZXNzID4gbGkgPiBhJykub24oICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHQkKCcjdXNlci1hY2NvdW50LWFjY2VzcyB1bCcpLnRvZ2dsZUNsYXNzKCAndmlzaWJsZScgKTtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fSk7XG5cdH1cbn0pO1xuIiwiXG5qUXVlcnkuZm4udGV4dE5vZGVzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNvbnRlbnRzKCkuZmlsdGVyKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAodGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgdGhpcy5ub2RlVmFsdWUudHJpbSgpICE9PSBcIlwiKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoIGFjdGlvbiApIHtcblx0dmFyIG1hcmt1cCA9ICc8bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLWZvcm0tY29uZmlybVwiPjxsYWJlbD5BcmUgeW91IHN1cmU/IDxhIGlkPVwiYS1jb25maXJtLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ZZXM8L2E+IHwgPGEgaWQ9XCJhLXN0b3AtJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPk5vPC9hPjwvbGFiZWw+PC9saT4nO1xuXHRyZXR1cm4gbWFya3VwO1xufVxuXG5mdW5jdGlvbiBtYW5hZ2VFbWFpbHMoKSB7XG5cdHZhciBmb3JtICAgICAgICAgICAgICAgPSAkKCcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJyk7XG5cdHZhciByZXN0X3Jvb3QgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0dmFyIGZ1bGxfdXJsICAgICAgICAgICA9IHJlc3Rfcm9vdCArICcvJyArICd1cGRhdGUtdXNlci8nO1xuXHR2YXIgY29uZmlybUNoYW5nZSAgICAgID0gJyc7XG5cdHZhciBuZXh0RW1haWxDb3VudCAgICAgPSAxO1xuXHR2YXIgbmV3UHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBvbGRQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIHByaW1hcnlJZCAgICAgICAgICA9ICcnO1xuXHR2YXIgZW1haWxUb1JlbW92ZSAgICAgID0gJyc7XG5cdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0dmFyIG5ld0VtYWlscyAgICAgICAgICA9IFtdO1xuXHR2YXIgYWpheF9mb3JtX2RhdGEgICAgID0gJyc7XG5cdHZhciB0aGF0ICAgICAgICAgICAgICAgPSAnJztcblx0Ly8gc3RhcnQgb3V0IHdpdGggbm8gcHJpbWFyeS9yZW1vdmFscyBjaGVja2VkXG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHQvLyBpZiB0aGVyZSBpcyBhIGxpc3Qgb2YgZW1haWxzIChub3QganVzdCBhIHNpbmdsZSBmb3JtIGZpZWxkKVxuXHRpZiAoICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoID4gMCApIHtcblx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cdFx0Ly8gaWYgYSB1c2VyIHNlbGVjdHMgYSBuZXcgcHJpbWFyeSwgbW92ZSBpdCBpbnRvIHRoYXQgcG9zaXRpb25cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFxuXHRcdFx0bmV3UHJpbWFyeUVtYWlsID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdHByaW1hcnlJZCAgICAgICA9ICQoIHRoaXMgKS5wcm9wKCAnaWQnICkucmVwbGFjZSggJ3ByaW1hcnlfZW1haWxfJywgJycgKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdwcmltYXJ5LWNoYW5nZScgKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0Ly8kKCB0aGlzICkucGFyZW50KCkuYWZ0ZXIoIGNvbmZpcm1DaGFuZ2UgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgdXNlciBmYWNpbmcgdmFsdWVzXG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBuZXdQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyN1c2VyLWVtYWlsLScgKyBwcmltYXJ5SWQgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBtYWluIGhpZGRlbiBmb3JtIHZhbHVlXG5cdFx0XHRcdCQoICcjZW1haWwnICkudmFsKCBuZXdQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0Ly8gc3VibWl0IGZvcm0gdmFsdWVzLlxuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHQvLyB1bmNoZWNrIHRoZSByYWRpbyBidXR0b25cblx0XHRcdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIGZvcm0gdmFsdWVzIHRvIHRoZSBvbGQgcHJpbWFyeSBlbWFpbFxuXHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjcmVtb3ZlX2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQvLyByZW1vdmUgdGhlIGNvbmZpcm0gbWVzc2FnZVxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHJlbW92ZXMgYW4gZW1haWwsIHRha2UgaXQgYXdheSBmcm9tIHRoZSB2aXN1YWwgYW5kIGZyb20gdGhlIGZvcm1cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2hhbmdlJywgJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRlbWFpbFRvUmVtb3ZlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3JlbW92YWwnICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkuZWFjaCggZnVuY3Rpb24oIGluZGV4ICkge1xuXHRcdFx0XHRpZiAoICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSAhPT0gZW1haWxUb1JlbW92ZSApIHtcblx0XHRcdFx0XHRjb25zb2xpZGF0ZWRFbWFpbHMucHVzaCggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyIGZvciByZW1vdmFsXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0Ly8gaWYgY29uZmlybWVkLCByZW1vdmUgdGhlIGVtYWlsIGFuZCBzdWJtaXQgdGhlIGZvcm1cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGknICkuZmFkZU91dCggJ25vcm1hbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0Y29uc29sZS5sb2coICd2YWx1ZSBpcyAnICsgY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gaWYgYSB1c2VyIHdhbnRzIHRvIGFkZCBhbiBlbWFpbCwgZ2l2ZSB0aGVtIGEgcHJvcGVybHkgbnVtYmVyZWQgZmllbGRcblx0JCggJy5tLWZvcm0tZW1haWwnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnKS5iZWZvcmUoICc8ZGl2IGNsYXNzPVwiYS1pbnB1dC13aXRoLWJ1dHRvbiBhLWJ1dHRvbi1zZW50ZW5jZVwiPjxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIGlkPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIHZhbHVlPVwiXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBpZD1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBjbGFzcz1cImEtYnV0dG9uIGEtYnV0dG9uLWFkZC11c2VyLWVtYWlsXCI+QWRkPC9idXR0b24+PC9kaXY+JyApO1xuXHRcdG5leHRFbWFpbENvdW50Kys7XG5cdH0pO1xuXG5cdCQoICdpbnB1dFt0eXBlPXN1Ym1pdF0nICkuY2xpY2soIGZ1bmN0aW9uICggZSApIHtcblx0XHR2YXIgYnV0dG9uID0gJCggdGhpcyApO1xuXHRcdHZhciBidXR0b25fZm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCAnZm9ybScgKTtcblx0XHRidXR0b25fZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nLCBidXR0b24udmFsKCkgKTtcblx0fSk7XG5cblx0JCggJy5tLWVudHJ5LWNvbnRlbnQnICkub24oICdzdWJtaXQnLCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgZm9ybSA9ICQoIHRoaXMgKTtcblx0XHR2YXIgc3VibWl0dGluZ19idXR0b24gPSBmb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicgKSB8fCAnJztcblx0XHQvLyBpZiB0aGVyZSBpcyBubyBzdWJtaXR0aW5nIGJ1dHRvbiwgcGFzcyBpdCBieSBBamF4XG5cdFx0aWYgKCAnJyA9PT0gc3VibWl0dGluZ19idXR0b24gfHwgJ1NhdmUgQ2hhbmdlcycgIT09IHN1Ym1pdHRpbmdfYnV0dG9uICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGFqYXhfZm9ybV9kYXRhID0gZm9ybS5zZXJpYWxpemUoKTsgLy9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBhamF4X2Zvcm1fZGF0YSArICcmcmVzdD10cnVlJztcblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHVybDogZnVsbF91cmwsXG5cdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKCB4aHIgKSB7XG5cdFx0XHQgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Qubm9uY2UgKTtcblx0XHRcdCAgICB9LFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRkYXRhOiBhamF4X2Zvcm1fZGF0YVxuXHRcdFx0fSkuZG9uZSggZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRcdG5ld0VtYWlscyA9ICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKS5tYXAoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiAkKHRoaXMpLnZhbCgpO1xuXHRcdFx0XHR9KS5nZXQoKTtcblx0XHRcdFx0JC5lYWNoKCBuZXdFbWFpbHMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSBuZXh0RW1haWxDb3VudCArIGluZGV4O1xuXHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkuYXBwZW5kKCAnPGxpIGlkPVwidXNlci1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtZW1haWwtcHJlZmVyZW5jZXNcIj48YSBocmVmPVwiL25ld3NsZXR0ZXJzLz9lbWFpbD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCB2YWx1ZSApICsgJ1wiPjxzbWFsbD5FbWFpbCBQcmVmZXJlbmNlczwvc21hbGw+PC9hPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLXJlbW92ZS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwicmVtb3ZlX2VtYWlsWycgKyBuZXh0RW1haWxDb3VudCArICddXCIgaWQ9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5SZW1vdmU8L3NtYWxsPjwvbGFiZWw+PC9saT48L3VsPjwvbGk+JyApO1xuXHRcdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCAkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCgpICsgJywnICsgdmFsdWUgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcubS1mb3JtLWNoYW5nZS1lbWFpbCAuYS1pbnB1dC13aXRoLWJ1dHRvbicgKS5yZW1vdmUoKTtcblx0XHRcdFx0aWYgKCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0XHRpZiAoICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKSAhPT0gJCggJ2lucHV0W25hbWU9XCJlbWFpbFwiXScgKSApIHtcblx0XHRcdFx0XHRcdC8vIGl0IHdvdWxkIGJlIG5pY2UgdG8gb25seSBsb2FkIHRoZSBmb3JtLCBidXQgdGhlbiBjbGljayBldmVudHMgc3RpbGwgZG9uJ3Qgd29ya1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiAoICQgKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXHRpZiAoICQoJy5tLWZvcm0tZW1haWwnKS5sZW5ndGggPiAwICkge1xuXHRcdG1hbmFnZUVtYWlscygpO1xuXHR9XG59KTtcbiIsIi8vIGJ1dHRvbiBjbGljayBmb3Igc2hvd2luZyBjb21tZW50cyBvbmUgdGltZVxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWJ1dHRvbi1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCBmYWxzZSwgJycsICcnICk7XG59KTtcblxuLy8gYnV0dG9uIGNsaWNrIGZvciBhbHdheXMgc2hvd2luZyBjb21tZW50cyBkaXNwbGF5ZWQgYmVmb3JlIHRoZSBjb21tZW50IGxpc3RcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcjYWx3YXlzLXNob3ctY29tbWVudHMtYmVmb3JlJywgZnVuY3Rpb24oKSB7XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCB0cnVlLCAnQmVmb3JlJywgJCggdGhpcyApLnZhbCgpICk7XG59KTtcblxuLy8gYnV0dG9uIGNsaWNrIGZvciBhbHdheXMgc2hvd2luZyBjb21tZW50cyBkaXNwbGF5ZWQgYWZ0ZXIgdGhlIGNvbW1lbnQgbGlzdFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJyNhbHdheXMtc2hvdy1jb21tZW50cy1hZnRlcicsIGZ1bmN0aW9uKCkge1xuXHR0cmFja1Nob3dDb21tZW50cyggdHJ1ZSwgJ0FmdGVyJywgJCggdGhpcyApLnZhbCgpICk7XG59KTtcblxuZnVuY3Rpb24gdHJhY2tTaG93Q29tbWVudHMoIGFsd2F5cywgcG9zaXRpb24sIGNsaWNrX3ZhbHVlICkge1xuXHR2YXIgYWN0aW9uICAgICAgICAgID0gJyc7XG5cdHZhciBjYXRlZ29yeV9wcmVmaXggPSAnJztcblx0dmFyIGNhdGVnb3J5X3N1ZmZpeCA9ICcnO1xuXHRpZiAoICcxJyA9PT0gY2xpY2tfdmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09uJztcblx0fSBlbHNlIGlmICggJzAnID09PSBjbGlja192YWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5X3ByZWZpeCA9ICdBbHdheXMgJztcblx0fVxuXHRpZiAoICcnICE9PSBwb3NpdGlvbiApIHtcblx0XHRjYXRlZ29yeV9zdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgY2F0ZWdvcnlfcHJlZml4ICsgJ1Nob3cgQ29tbWVudHMnICsgY2F0ZWdvcnlfc3VmZml4LCBhY3Rpb24sIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59XG5cbi8vIFNldCB1c2VyIG1ldGEgdmFsdWUgZm9yIGFsd2F5cyBzaG93aW5nIGNvbW1lbnRzIGlmIHRoYXQgYnV0dG9uIGlzIGNsaWNrZWRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR2YXIgdGhhdCA9ICQoIHRoaXMgKTtcblx0aWYgKCB0aGF0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9IGVsc2Uge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvLyB3ZSBhbHJlYWR5IGhhdmUgYWpheHVybCBmcm9tIHRoZSB0aGVtZVxuXHQkLmFqYXgoIHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBhamF4dXJsLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgIFx0J2FjdGlvbic6ICdtaW5ucG9zdF9sYXJnb19sb2FkX2NvbW1lbnRzX3NldF91c2VyX21ldGEnLFxuICAgICAgICBcdCd2YWx1ZSc6IHRoYXQudmFsKClcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuICAgICAgICBcdCQoICcuYS1hbHdheXMtc2hvdy1jb21tZW50cy1yZXN1bHQnLCB0aGF0LnBhcmVudCgpICkuaHRtbCggcmVzcG9uc2UuZGF0YS5tZXNzYWdlICk7XG4gICAgICAgIFx0aWYgKCB0cnVlID09PSByZXNwb25zZS5kYXRhLnNob3cgKSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDAgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDEgKTtcblx0XHRcdH1cbiAgICAgICAgfVxuICAgIH0gKTtcbn0gKTsiXX0=
}(jQuery));
