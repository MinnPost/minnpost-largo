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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLWFuYWx5dGljcy5qcyIsIjAyLXNoYXJlLmpzIiwiMDMtbmF2aWdhdGlvbi5qcyIsIjA0LWZvcm1zLmpzIl0sIm5hbWVzIjpbIm1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCIsInR5cGUiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwidmFsdWUiLCJnYSIsIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiZSIsIlBVTSIsImN1cnJlbnRfcG9wdXAiLCJnZXRQb3B1cCIsInNldHRpbmdzIiwiZ2V0U2V0dGluZ3MiLCJwb3B1cF9pZCIsImlkIiwib24iLCJjbG9zZV90cmlnZ2VyIiwiZm4iLCJwb3BtYWtlIiwibGFzdF9jbG9zZV90cmlnZ2VyIiwiY2xpY2siLCJ1cmwiLCJhdHRyIiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsImpRdWVyeSIsImhhc0NsYXNzIiwidHJpbSIsInNldHVwTWVudSIsInNldHVwTmF2U2VhcmNoIiwiY29udGFpbmVyIiwibmF2c2VhcmNoY29udGFpbmVyIiwibmF2c2VhcmNodG9nZ2xlIiwibmF2c2VhcmNoZm9ybSIsImdldEVsZW1lbnRCeUlkIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJsZW5ndGgiLCJldmVudCIsIiR0YXJnZXQiLCJ0YXJnZXQiLCJjbG9zZXN0IiwiaXMiLCJjbGFzc05hbWUiLCJyZXBsYWNlIiwicHJvcCIsInJlbW92ZUNsYXNzIiwicHJldmVudERlZmF1bHQiLCJpbmRleE9mIiwiYWRkQ2xhc3MiLCJidXR0b24iLCJtZW51IiwibGlua3MiLCJpIiwibGVuIiwic3R5bGUiLCJkaXNwbGF5Iiwic2V0QXR0cmlidXRlIiwib25jbGljayIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0b2dnbGVGb2N1cyIsInRvdWNoU3RhcnRGbiIsInBhcmVudExpbmsiLCJxdWVyeVNlbGVjdG9yQWxsIiwid2luZG93IiwibWVudUl0ZW0iLCJwYXJlbnROb2RlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJjaGlsZHJlbiIsInJlbW92ZSIsImFkZCIsInNlbGYiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJwYXJlbnRFbGVtZW50IiwiaHJlZiIsIndpZGdldF90aXRsZSIsImZpbmQiLCJ6b25lX3RpdGxlIiwic2lkZWJhcl9zZWN0aW9uX3RpdGxlIiwidG9nZ2xlQ2xhc3MiLCJ0ZXh0Tm9kZXMiLCJjb250ZW50cyIsImZpbHRlciIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSIsIm5vZGVWYWx1ZSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJmb3JtIiwicmVzdF9yb290IiwidXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdCIsInNpdGVfdXJsIiwicmVzdF9uYW1lc3BhY2UiLCJmdWxsX3VybCIsImNvbmZpcm1DaGFuZ2UiLCJuZXh0RW1haWxDb3VudCIsIm5ld1ByaW1hcnlFbWFpbCIsIm9sZFByaW1hcnlFbWFpbCIsInByaW1hcnlJZCIsImVtYWlsVG9SZW1vdmUiLCJjb25zb2xpZGF0ZWRFbWFpbHMiLCJuZXdFbWFpbHMiLCJhamF4X2Zvcm1fZGF0YSIsInRoYXQiLCJ2YWwiLCJwYXJlbnQiLCJoaWRlIiwic2hvdyIsImFwcGVuZCIsImZpcnN0IiwicmVwbGFjZVdpdGgiLCJzdWJtaXQiLCJlYWNoIiwiaW5kZXgiLCJnZXQiLCJwdXNoIiwicGFyZW50cyIsImZhZGVPdXQiLCJqb2luIiwiY29uc29sZSIsImxvZyIsImJlZm9yZSIsImJ1dHRvbl9mb3JtIiwiZGF0YSIsInN1Ym1pdHRpbmdfYnV0dG9uIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRvbmUiLCJtYXAiLCJlbmNvZGVVUklD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QTdCLENBQWtDOUcsQ0FBQyxDQUFFLHVCQUFGLENBQUQsQ0FBNkI4RyxHQUE3QixLQUFxQyxHQUFyQyxHQUEyQ2hILEtBQTdFO0FBQ0EsU0FKRDtBQUtBRSxRQUFBQSxDQUFDLENBQUUsMkNBQUYsQ0FBRCxDQUFpRHdFLE1BQWpEOztBQUNBLFlBQUt4RSxDQUFDLENBQUUsb0JBQUYsQ0FBRCxDQUEwQnVDLE1BQTFCLEtBQXFDLENBQTFDLEVBQThDO0FBQzdDLGNBQUt2QyxDQUFDLENBQUUsNENBQUYsQ0FBRCxLQUFzREEsQ0FBQyxDQUFFLHFCQUFGLENBQTVELEVBQXdGO0FBQ3ZGO0FBQ0FxQixZQUFBQSxRQUFRLENBQUN3SCxNQUFUO0FBQ0E7QUFDRDtBQUNELE9BeEJEO0FBeUJBO0FBQ0QsR0FsQ0Q7QUFtQ0E7O0FBRUQ3SSxDQUFDLENBQUVDLFFBQUYsQ0FBRCxDQUFjQyxLQUFkLENBQXFCLFVBQVdGLENBQVgsRUFBZTtBQUNuQzs7QUFDQSxNQUFLQSxDQUFDLENBQUMsZUFBRCxDQUFELENBQW1CdUMsTUFBbkIsR0FBNEIsQ0FBakMsRUFBcUM7QUFDcENzRCxJQUFBQSxZQUFZO0FBQ1o7QUFDRCxDQUxEIiwiZmlsZSI6Im1pbm5wb3N0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gbXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKSB7XG5cdGlmICggdHlwZW9mIGdhICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uICggZSApIHtcblxuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgUFVNICkge1xuXHRcdHZhciBjdXJyZW50X3BvcHVwID0gUFVNLmdldFBvcHVwKCAkKCAnLnB1bScgKSApO1xuXHRcdHZhciBzZXR0aW5ncyA9IFBVTS5nZXRTZXR0aW5ncyggJCggJy5wdW0nICkgKTtcblx0XHR2YXIgcG9wdXBfaWQgPSBzZXR0aW5ncy5pZDtcblx0XHQkKCBkb2N1bWVudCApLm9uKCdwdW1BZnRlck9wZW4nLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdTaG93JywgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9ICk7XG5cdFx0fSk7XG5cdFx0JCggZG9jdW1lbnQgKS5vbigncHVtQWZ0ZXJDbG9zZScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJC5mbi5wb3BtYWtlLmxhc3RfY2xvc2VfdHJpZ2dlcjtcblx0XHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBjbG9zZV90cmlnZ2VyICkge1xuXHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCQoICcubWVzc2FnZS1jbG9zZScgKS5jbGljayhmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGNsb3NlIGNsYXNzXG5cdFx0XHR2YXIgY2xvc2VfdHJpZ2dlciA9ICdDbG9zZSBCdXR0b24nO1xuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCBjbG9zZV90cmlnZ2VyLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0gKTtcblx0XHR9KTtcblx0XHQkKCAnLm1lc3NhZ2UtbG9naW4nICkuY2xpY2soZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIGxpbmsgd2l0aCBsb2dpbiBjbGFzc1xuXHRcdFx0dmFyIHVybCA9ICQodGhpcykuYXR0cignaHJlZicpO1xuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnTG9naW4gTGluaycsIHVybCApO1xuXHRcdH0pO1xuXHRcdCQoICcucHVtLWNvbnRlbnQgYTpub3QoIC5tZXNzYWdlLWNsb3NlLCAucHVtLWNsb3NlLCAubWVzc2FnZS1sb2dpbiApJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3Mgc29tZXRoaW5nIHRoYXQgaXMgbm90IGNsb3NlIHRleHQgb3IgY2xvc2UgaWNvblxuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnQ2xpY2snLCBwb3B1cF9pZCApO1xuICAgICAgICB9KTtcblx0fVxuXG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEgJiYgJycgIT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS51cmxfYWNjZXNzX2xldmVsICkge1xuXHRcdHZhciB0eXBlID0gJ2V2ZW50Jztcblx0XHR2YXIgY2F0ZWdvcnkgPSAnTWVtYmVyIENvbnRlbnQnO1xuXHRcdHZhciBsYWJlbCA9IGxvY2F0aW9uLnBhdGhuYW1lOyAvLyBpIHRoaW5rIHdlIGNvdWxkIHBvc3NpYmx5IHB1dCBzb21lIGdyb3VwaW5nIGhlcmUsIGJ1dCB3ZSBkb24ndCBuZWNlc3NhcmlseSBoYXZlIGFjY2VzcyB0byBvbmUgYW5kIG1heWJlIGl0J3Mgbm90IHdvcnRod2hpbGUgeWV0XG5cdFx0dmFyIGFjdGlvbiA9ICdCbG9ja2VkJztcblx0XHRpZiAoIHRydWUgPT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS5jdXJyZW50X3VzZXIuY2FuX2FjY2VzcyApIHtcblx0XHRcdGFjdGlvbiA9ICdTaG93bic7XG5cdFx0fVxuXHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0fVxufSk7XG4iLCJmdW5jdGlvbiB0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApIHtcblxuXHQvLyBpZiBhIG5vdCBsb2dnZWQgaW4gdXNlciB0cmllcyB0byBlbWFpbCwgZG9uJ3QgY291bnQgdGhhdCBhcyBhIHNoYXJlXG5cdGlmICggISBqUXVlcnkoICdib2R5ICcpLmhhc0NsYXNzKCAnbG9nZ2VkLWluJykgJiYgJ0VtYWlsJyA9PT0gdGV4dCApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyB0cmFjayBhcyBhbiBldmVudCwgYW5kIGFzIHNvY2lhbCBpZiBpdCBpcyB0d2l0dGVyIG9yIGZiXG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1NoYXJlIC0gJyArIHBvc2l0aW9uLCB0ZXh0LCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0IHx8ICdUd2l0dGVyJyA9PT0gdGV4dCApIHtcblx0XHRcdGlmICggdGV4dCA9PSAnRmFjZWJvb2snICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuJCAoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLnRleHQoKS50cmltKCk7XG5cdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSk7XG5cbiQgKCAnLm0tZW50cnktc2hhcmUtYm90dG9tIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHR2YXIgdGV4dCA9ICQoIHRoaXMgKS50ZXh0KCkudHJpbSgpO1xuXHR2YXIgcG9zaXRpb24gPSAnYm90dG9tJztcblx0dHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcbn0pO1xuIiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogSGFuZGxlcyB0b2dnbGluZyB0aGUgbmF2aWdhdGlvbiBtZW51IGZvciBzbWFsbCBzY3JlZW5zIGFuZCBlbmFibGVzIFRBQiBrZXlcbiAqIG5hdmlnYXRpb24gc3VwcG9ydCBmb3IgZHJvcGRvd24gbWVudXMuXG4gKi9cblxuc2V0dXBNZW51KCAnbmF2aWdhdGlvbi1wcmltYXJ5JyApO1xuc2V0dXBNZW51KCAnbmF2aWdhdGlvbi11c2VyLWFjY291bnQtbWFuYWdlbWVudCcgKTtcbnNldHVwTmF2U2VhcmNoKCAnbmF2aWdhdGlvbi1wcmltYXJ5JyApO1xuXG5mdW5jdGlvbiBzZXR1cE5hdlNlYXJjaCggY29udGFpbmVyICkge1xuXG5cdHZhciBuYXZzZWFyY2hjb250YWluZXIsIG5hdnNlYXJjaHRvZ2dsZSwgbmF2c2VhcmNoZm9ybTtcblxuXHRjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggY29udGFpbmVyICk7XG5cdGlmICggISBjb250YWluZXIgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bmF2c2VhcmNoY29udGFpbmVyID0gJCggJ2xpLnNlYXJjaCcsICQoIGNvbnRhaW5lciApICk7XG5cdG5hdnNlYXJjaHRvZ2dsZSAgICA9ICQoICdsaS5zZWFyY2ggYScsICQoIGNvbnRhaW5lciApICk7XG5cdG5hdnNlYXJjaGZvcm0gICAgICA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2Zvcm0nIClbMF07XG5cblx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5hdnNlYXJjaHRvZ2dsZSB8fCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5hdnNlYXJjaGZvcm0gKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKCAkKCBuYXZzZWFyY2hmb3JtICkubGVuZ3RoID4gMCApIHtcblx0XHQkKCBkb2N1bWVudCApLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHR2YXIgJHRhcmdldCA9ICQoIGV2ZW50LnRhcmdldCApO1xuXHRcdFx0aWYgKCAhICR0YXJnZXQuY2xvc2VzdCggbmF2c2VhcmNoY29udGFpbmVyICkubGVuZ3RoICYmICQoIG5hdnNlYXJjaGZvcm0gKS5pcyggJzp2aXNpYmxlJyApICkge1xuXHRcdFx0XHRuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZSA9IG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lLnJlcGxhY2UoICcgdG9nZ2xlZC1mb3JtJywgJycgKTtcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucHJvcCggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5yZW1vdmVDbGFzcyggJ3RvZ2dsZWQtZm9ybScgKTtcblx0XHRcdH0gICAgICAgIFxuXHRcdH0pO1xuXHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0aWYgKCAtMSAhPT0gbmF2c2VhcmNoZm9ybS5jbGFzc05hbWUuaW5kZXhPZiggJ3RvZ2dsZWQtZm9ybScgKSApIHtcblx0XHRcdFx0bmF2c2VhcmNoZm9ybS5jbGFzc05hbWUgPSBuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZS5yZXBsYWNlKCAnIHRvZ2dsZWQtZm9ybScsICcnICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnByb3AoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucmVtb3ZlQ2xhc3MoICd0b2dnbGVkLWZvcm0nICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZSArPSAnIHRvZ2dsZWQtZm9ybSc7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnByb3AoICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5hZGRDbGFzcyggJ3RvZ2dsZWQtZm9ybScgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzZXR1cE1lbnUoIGNvbnRhaW5lciApIHtcblx0dmFyIGJ1dHRvbiwgbWVudSwgbGlua3MsIGksIGxlbjtcblx0Y29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGNvbnRhaW5lciApO1xuXHRpZiAoICEgY29udGFpbmVyICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGJ1dHRvbiA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2J1dHRvbicgKVswXTtcblx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIGJ1dHRvbiApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRtZW51ID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAndWwnIClbMF07XG5cblx0Ly8gSGlkZSBtZW51IHRvZ2dsZSBidXR0b24gaWYgbWVudSBpcyBlbXB0eSBhbmQgcmV0dXJuIGVhcmx5LlxuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgbWVudSApIHtcblx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRyZXR1cm47XG5cdH1cblxuXHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdGlmICggLTEgPT09IG1lbnUuY2xhc3NOYW1lLmluZGV4T2YoICdtZW51JyApICkge1xuXHRcdG1lbnUuY2xhc3NOYW1lICs9ICcgbWVudSc7XG5cdH1cblxuXHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggLTEgIT09IGNvbnRhaW5lci5jbGFzc05hbWUuaW5kZXhPZiggJ3RvZ2dsZWQnICkgKSB7XG5cdFx0XHRjb250YWluZXIuY2xhc3NOYW1lID0gY29udGFpbmVyLmNsYXNzTmFtZS5yZXBsYWNlKCAnIHRvZ2dsZWQnLCAnJyApO1xuXHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgKz0gJyB0b2dnbGVkJztcblx0XHRcdGJ1dHRvbi5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnICk7XG5cdFx0XHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gR2V0IGFsbCB0aGUgbGluayBlbGVtZW50cyB3aXRoaW4gdGhlIG1lbnUuXG5cdGxpbmtzICAgID0gbWVudS5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2EnICk7XG5cblx0Ly8gRWFjaCB0aW1lIGEgbWVudSBsaW5rIGlzIGZvY3VzZWQgb3IgYmx1cnJlZCwgdG9nZ2xlIGZvY3VzLlxuXHRmb3IgKCBpID0gMCwgbGVuID0gbGlua3MubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0bGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ2ZvY3VzJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0XHRsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCAnYmx1cicsIHRvZ2dsZUZvY3VzLCB0cnVlICk7XG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyBgZm9jdXNgIGNsYXNzIHRvIGFsbG93IHN1Ym1lbnUgYWNjZXNzIG9uIHRhYmxldHMuXG5cdCAqL1xuXHQoIGZ1bmN0aW9uKCBjb250YWluZXIgKSB7XG5cdFx0dmFyIHRvdWNoU3RhcnRGbiwgaSxcblx0XHRcdHBhcmVudExpbmsgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCggJy5tZW51LWl0ZW0taGFzLWNoaWxkcmVuID4gYSwgLnBhZ2VfaXRlbV9oYXNfY2hpbGRyZW4gPiBhJyApO1xuXG5cdFx0aWYgKCAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgKSB7XG5cdFx0XHR0b3VjaFN0YXJ0Rm4gPSBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0dmFyIG1lbnVJdGVtID0gdGhpcy5wYXJlbnROb2RlLCBpO1xuXG5cdFx0XHRcdGlmICggISBtZW51SXRlbS5jbGFzc0xpc3QuY29udGFpbnMoICdmb2N1cycgKSApIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0Zm9yICggaSA9IDA7IGkgPCBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuLmxlbmd0aDsgKytpICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtZW51SXRlbSA9PT0gbWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbltpXSApIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LmFkZCggJ2ZvY3VzJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1lbnVJdGVtLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBwYXJlbnRMaW5rLmxlbmd0aDsgKytpICkge1xuXHRcdFx0XHRwYXJlbnRMaW5rW2ldLmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hTdGFydEZuLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSggY29udGFpbmVyICkgKTtcbn1cblxuLyoqXG4gKiBTZXRzIG9yIHJlbW92ZXMgLmZvY3VzIGNsYXNzIG9uIGFuIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUZvY3VzKCkge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0Ly8gTW92ZSB1cCB0aHJvdWdoIHRoZSBhbmNlc3RvcnMgb2YgdGhlIGN1cnJlbnQgbGluayB1bnRpbCB3ZSBoaXQgLm5hdi1tZW51LlxuXHR3aGlsZSAoIC0xID09PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnbWVudScgKSApIHtcblxuXHRcdC8vIE9uIGxpIGVsZW1lbnRzIHRvZ2dsZSB0aGUgY2xhc3MgLmZvY3VzLlxuXHRcdGlmICggJ2xpJyA9PT0gc2VsZi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgKSB7XG5cdFx0XHRpZiAoIC0xICE9PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnZm9jdXMnICkgKSB7XG5cdFx0XHRcdHNlbGYuY2xhc3NOYW1lID0gc2VsZi5jbGFzc05hbWUucmVwbGFjZSggJyBmb2N1cycsICcnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWxmLmNsYXNzTmFtZSArPSAnIGZvY3VzJztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRzZWxmID0gc2VsZi5wYXJlbnRFbGVtZW50O1xuXHR9XG59XG5cbiQoICcjbmF2aWdhdGlvbi1mZWF0dXJlZCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnRmVhdHVyZWQgQmFyIExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcbn0pO1xuXG4kKCAnYS5nbGVhbi1zaWRlYmFyJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBTdXBwb3J0IExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcbn0pO1xuXG4kKCAnYScsICQoICcuby1zaXRlLXNpZGViYXInICkgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdHZhciB3aWRnZXRfdGl0bGUgPSAkKHRoaXMpLmNsb3Nlc3QoJy5tLXdpZGdldCcpLmZpbmQoJ2gzJykudGV4dCgpO1xuXHR2YXIgem9uZV90aXRsZSAgID0gJCh0aGlzKS5jbG9zZXN0KCcubS16b25lJykuZmluZCgnLmEtem9uZS10aXRsZScpLnRleHQoKTtcblx0dmFyIHNpZGViYXJfc2VjdGlvbl90aXRsZSA9ICcnO1xuXHRpZiAoICcnICE9PSB3aWRnZXRfdGl0bGUgKSB7XG5cdFx0c2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gd2lkZ2V0X3RpdGxlO1xuXHR9IGVsc2UgaWYgKCAnJyAhPT0gem9uZV90aXRsZSApIHtcblx0XHRzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSB6b25lX3RpdGxlO1xuXHR9XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCgnZXZlbnQnLCAnU2lkZWJhciBMaW5rJywgJ0NsaWNrJywgc2lkZWJhcl9zZWN0aW9uX3RpdGxlKTtcbn0pO1xuXG4vLyB1c2VyIGFjY291bnQgbmF2aWdhdGlvbiBjYW4gYmUgYSBkcm9wZG93blxuJCggZG9jdW1lbnQgKS5yZWFkeShmdW5jdGlvbigpIHtcblx0Ly8gaGlkZSBtZW51XG5cdGlmICgkKCcjdXNlci1hY2NvdW50LWFjY2VzcyB1bCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0JCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgPiBsaSA+IGEnKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdCQoJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJykudG9nZ2xlQ2xhc3MoICd2aXNpYmxlJyApO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9KTtcblx0fVxufSk7XG4iLCJcbmpRdWVyeS5mbi50ZXh0Tm9kZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY29udGVudHMoKS5maWx0ZXIoZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICh0aGlzLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSAmJiB0aGlzLm5vZGVWYWx1ZS50cmltKCkgIT09IFwiXCIpO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggYWN0aW9uICkge1xuXHR2YXIgbWFya3VwID0gJzxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtZm9ybS1jb25maXJtXCI+PGxhYmVsPkFyZSB5b3Ugc3VyZT8gPGEgaWQ9XCJhLWNvbmZpcm0tJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPlllczwvYT4gfCA8YSBpZD1cImEtc3RvcC0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+Tm88L2E+PC9sYWJlbD48L2xpPic7XG5cdHJldHVybiBtYXJrdXA7XG59XG5cbmZ1bmN0aW9uIG1hbmFnZUVtYWlscygpIHtcblx0dmFyIGZvcm0gICAgICAgICAgICAgICA9ICQoJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nKTtcblx0dmFyIHJlc3Rfcm9vdCAgICAgICAgICA9IHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Quc2l0ZV91cmwgKyB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnJlc3RfbmFtZXNwYWNlO1xuXHR2YXIgZnVsbF91cmwgICAgICAgICAgID0gcmVzdF9yb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdHZhciBjb25maXJtQ2hhbmdlICAgICAgPSAnJztcblx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdHZhciBuZXdQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIG9sZFByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0dmFyIGNvbnNvbGlkYXRlZEVtYWlscyA9IFtdO1xuXHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdHZhciBhamF4X2Zvcm1fZGF0YSAgICAgPSAnJztcblx0dmFyIHRoYXQgICAgICAgICAgICAgICA9ICcnO1xuXHQvLyBzdGFydCBvdXQgd2l0aCBubyBwcmltYXJ5L3JlbW92YWxzIGNoZWNrZWRcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdC8vIGlmIHRoZXJlIGlzIGEgbGlzdCBvZiBlbWFpbHMgKG5vdCBqdXN0IGEgc2luZ2xlIGZvcm0gZmllbGQpXG5cdGlmICggJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggPiAwICkge1xuXHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHQvLyBpZiBhIHVzZXIgc2VsZWN0cyBhIG5ldyBwcmltYXJ5LCBtb3ZlIGl0IGludG8gdGhhdCBwb3NpdGlvblxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XG5cdFx0XHRuZXdQcmltYXJ5RW1haWwgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRvbGRQcmltYXJ5RW1haWwgPSAkKCAnI2VtYWlsJyApLnZhbCgpO1xuXHRcdFx0cHJpbWFyeUlkICAgICAgID0gJCggdGhpcyApLnByb3AoICdpZCcgKS5yZXBsYWNlKCAncHJpbWFyeV9lbWFpbF8nLCAnJyApO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3ByaW1hcnktY2hhbmdlJyApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSB1c2VyIGZhY2luZyB2YWx1ZXNcblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG5ld1ByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3VzZXItZW1haWwtJyArIHByaW1hcnlJZCApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIG1haW4gaGlkZGVuIGZvcm0gdmFsdWVcblx0XHRcdFx0JCggJyNlbWFpbCcgKS52YWwoIG5ld1ByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQvLyBzdWJtaXQgZm9ybSB2YWx1ZXMuXG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdC8vIHVuY2hlY2sgdGhlIHJhZGlvIGJ1dHRvblxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgZm9ybSB2YWx1ZXMgdG8gdGhlIG9sZCBwcmltYXJ5IGVtYWlsXG5cdFx0XHRcdCQoICcjcHJpbWFyeV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyNyZW1vdmVfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgY29uZmlybSBtZXNzYWdlXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjaGFuZ2UnLCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG5cdFx0XHRcdGlmICggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICE9PSBlbWFpbFRvUmVtb3ZlICkge1xuXHRcdFx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscy5wdXNoKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXIgZm9yIHJlbW92YWxcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHQvLyBpZiBjb25maXJtZWQsIHJlbW92ZSB0aGUgZW1haWwgYW5kIHN1Ym1pdCB0aGUgZm9ybVxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5mYWRlT3V0KCAnbm9ybWFsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLnJlbW92ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRjb25zb2xlLmxvZyggJ3ZhbHVlIGlzICcgKyBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcpLmJlZm9yZSggJzxkaXYgY2xhc3M9XCJhLWlucHV0LXdpdGgtYnV0dG9uIGEtYnV0dG9uLXNlbnRlbmNlXCI+PGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgaWQ9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgdmFsdWU9XCJcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBuYW1lPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGlkPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGNsYXNzPVwiYS1idXR0b24gYS1idXR0b24tYWRkLXVzZXItZW1haWxcIj5BZGQ8L2J1dHRvbj48L2Rpdj4nICk7XG5cdFx0bmV4dEVtYWlsQ291bnQrKztcblx0fSk7XG5cblx0JCggJ2lucHV0W3R5cGU9c3VibWl0XScgKS5jbGljayggZnVuY3Rpb24gKCBlICkge1xuXHRcdHZhciBidXR0b24gPSAkKCB0aGlzICk7XG5cdFx0dmFyIGJ1dHRvbl9mb3JtID0gYnV0dG9uLmNsb3Nlc3QoICdmb3JtJyApO1xuXHRcdGJ1dHRvbl9mb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicsIGJ1dHRvbi52YWwoKSApO1xuXHR9KTtcblxuXHQkKCAnLm0tZW50cnktY29udGVudCcgKS5vbiggJ3N1Ym1pdCcsICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdHZhciBmb3JtID0gJCggdGhpcyApO1xuXHRcdHZhciBzdWJtaXR0aW5nX2J1dHRvbiA9IGZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJyApIHx8ICcnO1xuXHRcdC8vIGlmIHRoZXJlIGlzIG5vIHN1Ym1pdHRpbmcgYnV0dG9uLCBwYXNzIGl0IGJ5IEFqYXhcblx0XHRpZiAoICcnID09PSBzdWJtaXR0aW5nX2J1dHRvbiB8fCAnU2F2ZSBDaGFuZ2VzJyAhPT0gc3VibWl0dGluZ19idXR0b24gKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4X2Zvcm1fZGF0YSA9IGFqYXhfZm9ybV9kYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dXJsOiBmdWxsX3VybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoIHhociApIHtcblx0XHRcdCAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0ICAgIH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhfZm9ybV9kYXRhXG5cdFx0XHR9KS5kb25lKCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQodGhpcykudmFsKCk7XG5cdFx0XHRcdH0pLmdldCgpO1xuXHRcdFx0XHQkLmVhY2goIG5ld0VtYWlscywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9IG5leHRFbWFpbENvdW50ICsgaW5kZXg7XG5cdFx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5hcHBlbmQoICc8bGkgaWQ9XCJ1c2VyLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIj4nICsgdmFsdWUgKyAnPHVsIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS11c2VyLWVtYWlsLWFjdGlvbnNcIj48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtbWFrZS1wcmltYXJ5LWVtYWlsXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJwcmltYXJ5X2VtYWlsXCIgaWQ9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPk1ha2UgUHJpbWFyeTwvc21hbGw+PC9sYWJlbD48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1lbWFpbC1wcmVmZXJlbmNlc1wiPjxhIGhyZWY9XCIvbmV3c2xldHRlcnMvP2VtYWlsPScgKyBlbmNvZGVVUklDb21wb25lbnQoIHZhbHVlICkgKyAnXCI+PHNtYWxsPkVtYWlsIFByZWZlcmVuY2VzPC9zbWFsbD48L2E+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtcmVtb3ZlLWVtYWlsXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJyZW1vdmVfZW1haWxbJyArIG5leHRFbWFpbENvdW50ICsgJ11cIiBpZD1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPlJlbW92ZTwvc21hbGw+PC9sYWJlbD48L2xpPjwvdWw+PC9saT4nICk7XG5cdFx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoICQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCkgKyAnLCcgKyB2YWx1ZSApO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JCggJy5tLWZvcm0tY2hhbmdlLWVtYWlsIC5hLWlucHV0LXdpdGgtYnV0dG9uJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRpZiAoICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoID09PSAwICkge1xuXHRcdFx0XHRcdGlmICggJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApICE9PSAkKCAnaW5wdXRbbmFtZT1cImVtYWlsXCJdJyApICkge1xuXHRcdFx0XHRcdFx0Ly8gaXQgd291bGQgYmUgbmljZSB0byBvbmx5IGxvYWQgdGhlIGZvcm0sIGJ1dCB0aGVuIGNsaWNrIGV2ZW50cyBzdGlsbCBkb24ndCB3b3JrXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uICggJCApIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdGlmICggJCgnLm0tZm9ybS1lbWFpbCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cbn0pO1xuIl19
}(jQuery));
