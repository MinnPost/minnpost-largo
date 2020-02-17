;(function($) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Optimization for Repeat Views
if (sessionStorage.serifFontsLoadedFoutWithClassPolyfill && sessionStorage.sansFontsLoadedFoutWithClassPolyfill) {
  document.documentElement.className += ' serif-fonts-loaded sans-fonts-loaded';
} else {
  /* Font Face Observer v2.1.0 - © Bram Stein. License: BSD-3-Clause */
  (function () {
    'use strict';

    var f,
        g = [];

    function l(a) {
      g.push(a);
      1 == g.length && f();
    }

    function m() {
      for (; g.length;) {
        g[0](), g.shift();
      }
    }

    f = function f() {
      setTimeout(m);
    };

    function n(a) {
      this.a = p;
      this.b = void 0;
      this.f = [];
      var b = this;

      try {
        a(function (a) {
          q(b, a);
        }, function (a) {
          r(b, a);
        });
      } catch (c) {
        r(b, c);
      }
    }

    var p = 2;

    function t(a) {
      return new n(function (b, c) {
        c(a);
      });
    }

    function u(a) {
      return new n(function (b) {
        b(a);
      });
    }

    function q(a, b) {
      if (a.a == p) {
        if (b == a) throw new TypeError();
        var c = !1;

        try {
          var d = b && b.then;

          if (null != b && "object" == _typeof(b) && "function" == typeof d) {
            d.call(b, function (b) {
              c || q(a, b);
              c = !0;
            }, function (b) {
              c || r(a, b);
              c = !0;
            });
            return;
          }
        } catch (e) {
          c || r(a, e);
          return;
        }

        a.a = 0;
        a.b = b;
        v(a);
      }
    }

    function r(a, b) {
      if (a.a == p) {
        if (b == a) throw new TypeError();
        a.a = 1;
        a.b = b;
        v(a);
      }
    }

    function v(a) {
      l(function () {
        if (a.a != p) for (; a.f.length;) {
          var b = a.f.shift(),
              c = b[0],
              d = b[1],
              e = b[2],
              b = b[3];

          try {
            0 == a.a ? "function" == typeof c ? e(c.call(void 0, a.b)) : e(a.b) : 1 == a.a && ("function" == typeof d ? e(d.call(void 0, a.b)) : b(a.b));
          } catch (h) {
            b(h);
          }
        }
      });
    }

    n.prototype.g = function (a) {
      return this.c(void 0, a);
    };

    n.prototype.c = function (a, b) {
      var c = this;
      return new n(function (d, e) {
        c.f.push([a, b, d, e]);
        v(c);
      });
    };

    function w(a) {
      return new n(function (b, c) {
        function d(c) {
          return function (d) {
            h[c] = d;
            e += 1;
            e == a.length && b(h);
          };
        }

        var e = 0,
            h = [];
        0 == a.length && b(h);

        for (var k = 0; k < a.length; k += 1) {
          u(a[k]).c(d(k), c);
        }
      });
    }

    function x(a) {
      return new n(function (b, c) {
        for (var d = 0; d < a.length; d += 1) {
          u(a[d]).c(b, c);
        }
      });
    }

    ;
    window.Promise || (window.Promise = n, window.Promise.resolve = u, window.Promise.reject = t, window.Promise.race = x, window.Promise.all = w, window.Promise.prototype.then = n.prototype.c, window.Promise.prototype["catch"] = n.prototype.g);
  })();

  (function () {
    function l(a, b) {
      document.addEventListener ? a.addEventListener("scroll", b, !1) : a.attachEvent("scroll", b);
    }

    function m(a) {
      document.body ? a() : document.addEventListener ? document.addEventListener("DOMContentLoaded", function c() {
        document.removeEventListener("DOMContentLoaded", c);
        a();
      }) : document.attachEvent("onreadystatechange", function k() {
        if ("interactive" == document.readyState || "complete" == document.readyState) document.detachEvent("onreadystatechange", k), a();
      });
    }

    ;

    function t(a) {
      this.a = document.createElement("div");
      this.a.setAttribute("aria-hidden", "true");
      this.a.appendChild(document.createTextNode(a));
      this.b = document.createElement("span");
      this.c = document.createElement("span");
      this.h = document.createElement("span");
      this.f = document.createElement("span");
      this.g = -1;
      this.b.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
      this.c.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
      this.f.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
      this.h.style.cssText = "display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";
      this.b.appendChild(this.h);
      this.c.appendChild(this.f);
      this.a.appendChild(this.b);
      this.a.appendChild(this.c);
    }

    function u(a, b) {
      a.a.style.cssText = "max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:" + b + ";";
    }

    function z(a) {
      var b = a.a.offsetWidth,
          c = b + 100;
      a.f.style.width = c + "px";
      a.c.scrollLeft = c;
      a.b.scrollLeft = a.b.scrollWidth + 100;
      return a.g !== b ? (a.g = b, !0) : !1;
    }

    function A(a, b) {
      function c() {
        var a = k;
        z(a) && a.a.parentNode && b(a.g);
      }

      var k = a;
      l(a.b, c);
      l(a.c, c);
      z(a);
    }

    ;

    function B(a, b) {
      var c = b || {};
      this.family = a;
      this.style = c.style || "normal";
      this.weight = c.weight || "normal";
      this.stretch = c.stretch || "normal";
    }

    var C = null,
        D = null,
        E = null,
        F = null;

    function G() {
      if (null === D) if (J() && /Apple/.test(window.navigator.vendor)) {
        var a = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent);
        D = !!a && 603 > parseInt(a[1], 10);
      } else D = !1;
      return D;
    }

    function J() {
      null === F && (F = !!document.fonts);
      return F;
    }

    function K() {
      if (null === E) {
        var a = document.createElement("div");

        try {
          a.style.font = "condensed 100px sans-serif";
        } catch (b) {}

        E = "" !== a.style.font;
      }

      return E;
    }

    function L(a, b) {
      return [a.style, a.weight, K() ? a.stretch : "", "100px", b].join(" ");
    }

    B.prototype.load = function (a, b) {
      var c = this,
          k = a || "BESbswy",
          r = 0,
          n = b || 3E3,
          H = new Date().getTime();
      return new Promise(function (a, b) {
        if (J() && !G()) {
          var M = new Promise(function (a, b) {
            function e() {
              new Date().getTime() - H >= n ? b(Error("" + n + "ms timeout exceeded")) : document.fonts.load(L(c, '"' + c.family + '"'), k).then(function (c) {
                1 <= c.length ? a() : setTimeout(e, 25);
              }, b);
            }

            e();
          }),
              N = new Promise(function (a, c) {
            r = setTimeout(function () {
              c(Error("" + n + "ms timeout exceeded"));
            }, n);
          });
          Promise.race([N, M]).then(function () {
            clearTimeout(r);
            a(c);
          }, b);
        } else m(function () {
          function v() {
            var b;
            if (b = -1 != f && -1 != g || -1 != f && -1 != h || -1 != g && -1 != h) (b = f != g && f != h && g != h) || (null === C && (b = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent), C = !!b && (536 > parseInt(b[1], 10) || 536 === parseInt(b[1], 10) && 11 >= parseInt(b[2], 10))), b = C && (f == w && g == w && h == w || f == x && g == x && h == x || f == y && g == y && h == y)), b = !b;
            b && (d.parentNode && d.parentNode.removeChild(d), clearTimeout(r), a(c));
          }

          function I() {
            if (new Date().getTime() - H >= n) d.parentNode && d.parentNode.removeChild(d), b(Error("" + n + "ms timeout exceeded"));else {
              var a = document.hidden;
              if (!0 === a || void 0 === a) f = e.a.offsetWidth, g = p.a.offsetWidth, h = q.a.offsetWidth, v();
              r = setTimeout(I, 50);
            }
          }

          var e = new t(k),
              p = new t(k),
              q = new t(k),
              f = -1,
              g = -1,
              h = -1,
              w = -1,
              x = -1,
              y = -1,
              d = document.createElement("div");
          d.dir = "ltr";
          u(e, L(c, "sans-serif"));
          u(p, L(c, "serif"));
          u(q, L(c, "monospace"));
          d.appendChild(e.a);
          d.appendChild(p.a);
          d.appendChild(q.a);
          document.body.appendChild(d);
          w = e.a.offsetWidth;
          x = p.a.offsetWidth;
          y = q.a.offsetWidth;
          I();
          A(e, function (a) {
            f = a;
            v();
          });
          u(e, L(c, '"' + c.family + '",sans-serif'));
          A(p, function (a) {
            g = a;
            v();
          });
          u(p, L(c, '"' + c.family + '",serif'));
          A(q, function (a) {
            h = a;
            v();
          });
          u(q, L(c, '"' + c.family + '",monospace'));
        });
      });
    };

    "object" === (typeof module === "undefined" ? "undefined" : _typeof(module)) ? module.exports = B : (window.FontFaceObserver = B, window.FontFaceObserver.prototype.load = B.prototype.load);
  })(); // minnpost fonts
  // sans


  var sansNormal = new FontFaceObserver('ff-meta-web-pro');
  var sansBold = new FontFaceObserver('ff-meta-web-pro', {
    weight: 700
  });
  var sansNormalItalic = new FontFaceObserver('ff-meta-web-pro', {
    weight: 400,
    style: 'italic'
  }); // serif

  var serifBook = new FontFaceObserver('ff-meta-serif-web-pro', {
    weight: 500
  });
  var serifBookItalic = new FontFaceObserver('ff-meta-serif-web-pro', {
    weight: 500,
    style: 'italic'
  });
  var serifBold = new FontFaceObserver('ff-meta-serif-web-pro', {
    weight: 700
  });
  var serifBoldItalic = new FontFaceObserver('ff-meta-serif-web-pro', {
    weight: 700,
    style: 'italic'
  });
  var serifBlack = new FontFaceObserver('ff-meta-serif-web-pro', {
    weight: 900
  });
  var serifBlackItalic = new FontFaceObserver('ff-meta-serif-web-pro', {
    weight: 900,
    style: 'italic'
  });
  Promise.all([sansNormal.load(null, 3000), sansBold.load(null, 3000), sansNormalItalic.load(null, 3000), serifBook.load(null, 3000), serifBookItalic.load(null, 3000), serifBold.load(null, 3000), serifBoldItalic.load(null, 3000), serifBlack.load(null, 3000), serifBlackItalic.load(null, 3000)]).then(function () {
    document.documentElement.className += ' serif-fonts-loaded'; // Optimization for Repeat Views

    sessionStorage.serifFontsLoadedFoutWithClassPolyfill = true;
  });
  Promise.all([sansNormal.load(null, 3000), sansBold.load(null, 3000), sansNormalItalic.load(null, 3000)]).then(function () {
    document.documentElement.className += ' sans-fonts-loaded'; // Optimization for Repeat Views

    sessionStorage.sansFontsLoadedFoutWithClassPolyfill = true;
  });
}
"use strict";

function mp_analytics_tracking_event(type, category, action, label, value) {
  if ('undefined' !== typeof ga) {
    if ('undefined' === typeof value) {
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
  if (!jQuery('body').hasClass('logged-in') && 'Email' === text) {
    return;
  } // track as an event, and as social if it is twitter or fb


  mp_analytics_tracking_event('event', 'Share - ' + position, text, location.pathname);

  if ('undefined' !== typeof ga) {
    if ('Facebook' === text || 'Twitter' === text) {
      if ('Facebook' == text) {
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

  if (0 < $(navsearchform).length) {
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
  if (0 < $('#user-account-access ul').length) {
    $('#user-account-access > li > a').on('click', function (event) {
      $('#user-account-access ul').toggleClass('visible');
      event.preventDefault();
    });
  }
});
"use strict";

jQuery.fn.textNodes = function () {
  return this.contents().filter(function () {
    return this.nodeType === Node.TEXT_NODE && '' !== this.nodeValue.trim();
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

  if (0 < $('.m-user-email-list').length) {
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

        if (0 === $('.m-user-email-list').length) {
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
  'use strict';

  if (0 < $('.m-form-email').length) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLWZvbnRzLmpzIiwiMDItYW5hbHl0aWNzLmpzIiwiMDMtc2hhcmUuanMiLCIwNC1uYXZpZ2F0aW9uLmpzIiwiMDUtZm9ybXMuanMiLCIwNi1jb21tZW50cy5qcyJdLCJuYW1lcyI6WyJzZXNzaW9uU3RvcmFnZSIsInNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwiLCJzYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImNsYXNzTmFtZSIsImYiLCJnIiwibCIsImEiLCJwdXNoIiwibGVuZ3RoIiwibSIsInNoaWZ0Iiwic2V0VGltZW91dCIsIm4iLCJwIiwiYiIsInEiLCJyIiwiYyIsInQiLCJ1IiwiVHlwZUVycm9yIiwiZCIsInRoZW4iLCJjYWxsIiwiZSIsInYiLCJoIiwicHJvdG90eXBlIiwidyIsImsiLCJ4Iiwid2luZG93IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyYWNlIiwiYWxsIiwiYWRkRXZlbnRMaXN0ZW5lciIsImF0dGFjaEV2ZW50IiwiYm9keSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJyZWFkeVN0YXRlIiwiZGV0YWNoRXZlbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVUZXh0Tm9kZSIsInN0eWxlIiwiY3NzVGV4dCIsInoiLCJvZmZzZXRXaWR0aCIsIndpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbFdpZHRoIiwiQSIsInBhcmVudE5vZGUiLCJCIiwiZmFtaWx5Iiwid2VpZ2h0Iiwic3RyZXRjaCIsIkMiLCJEIiwiRSIsIkYiLCJHIiwiSiIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ2ZW5kb3IiLCJleGVjIiwidXNlckFnZW50IiwicGFyc2VJbnQiLCJmb250cyIsIksiLCJmb250IiwiTCIsImpvaW4iLCJsb2FkIiwiSCIsIkRhdGUiLCJnZXRUaW1lIiwiTSIsIkVycm9yIiwiTiIsImNsZWFyVGltZW91dCIsInkiLCJyZW1vdmVDaGlsZCIsIkkiLCJoaWRkZW4iLCJkaXIiLCJtb2R1bGUiLCJleHBvcnRzIiwiRm9udEZhY2VPYnNlcnZlciIsInNhbnNOb3JtYWwiLCJzYW5zQm9sZCIsInNhbnNOb3JtYWxJdGFsaWMiLCJzZXJpZkJvb2siLCJzZXJpZkJvb2tJdGFsaWMiLCJzZXJpZkJvbGQiLCJzZXJpZkJvbGRJdGFsaWMiLCJzZXJpZkJsYWNrIiwic2VyaWZCbGFja0l0YWxpYyIsIm1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCIsInR5cGUiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwidmFsdWUiLCJnYSIsIiQiLCJyZWFkeSIsIlBVTSIsImN1cnJlbnRfcG9wdXAiLCJnZXRQb3B1cCIsInNldHRpbmdzIiwiZ2V0U2V0dGluZ3MiLCJwb3B1cF9pZCIsImlkIiwib24iLCJjbG9zZV90cmlnZ2VyIiwiZm4iLCJwb3BtYWtlIiwibGFzdF9jbG9zZV90cmlnZ2VyIiwiY2xpY2siLCJ1cmwiLCJhdHRyIiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsImpRdWVyeSIsImhhc0NsYXNzIiwidHJpbSIsInNldHVwTWVudSIsInNldHVwTmF2U2VhcmNoIiwiY29udGFpbmVyIiwibmF2c2VhcmNoY29udGFpbmVyIiwibmF2c2VhcmNodG9nZ2xlIiwibmF2c2VhcmNoZm9ybSIsImdldEVsZW1lbnRCeUlkIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJldmVudCIsIiR0YXJnZXQiLCJ0YXJnZXQiLCJjbG9zZXN0IiwiaXMiLCJyZXBsYWNlIiwicHJvcCIsInJlbW92ZUNsYXNzIiwicHJldmVudERlZmF1bHQiLCJpbmRleE9mIiwiYWRkQ2xhc3MiLCJidXR0b24iLCJtZW51IiwibGlua3MiLCJpIiwibGVuIiwiZGlzcGxheSIsIm9uY2xpY2siLCJ0b2dnbGVGb2N1cyIsInRvdWNoU3RhcnRGbiIsInBhcmVudExpbmsiLCJxdWVyeVNlbGVjdG9yQWxsIiwibWVudUl0ZW0iLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImNoaWxkcmVuIiwicmVtb3ZlIiwiYWRkIiwic2VsZiIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsInBhcmVudEVsZW1lbnQiLCJocmVmIiwid2lkZ2V0X3RpdGxlIiwiZmluZCIsInpvbmVfdGl0bGUiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJ0b2dnbGVDbGFzcyIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwiZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCIsIm1hcmt1cCIsIm1hbmFnZUVtYWlscyIsImZvcm0iLCJyZXN0X3Jvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxfdXJsIiwiY29uZmlybUNoYW5nZSIsIm5leHRFbWFpbENvdW50IiwibmV3UHJpbWFyeUVtYWlsIiwib2xkUHJpbWFyeUVtYWlsIiwicHJpbWFyeUlkIiwiZW1haWxUb1JlbW92ZSIsImNvbnNvbGlkYXRlZEVtYWlscyIsIm5ld0VtYWlscyIsImFqYXhfZm9ybV9kYXRhIiwidGhhdCIsInZhbCIsInBhcmVudCIsImhpZGUiLCJzaG93IiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJpbmRleCIsImdldCIsInBhcmVudHMiLCJmYWRlT3V0IiwiY29uc29sZSIsImxvZyIsImJlZm9yZSIsImJ1dHRvbl9mb3JtIiwiZGF0YSIsInN1Ym1pdHRpbmdfYnV0dG9uIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRvbmUiLCJtYXAiLCJlbmNvZGVVUklDb21wb25lbnQiLCJyZWxvYWQiLCJ0cmFja1Nob3dDb21tZW50cyIsImFsd2F5cyIsImNsaWNrX3ZhbHVlIiwiY2F0ZWdvcnlfcHJlZml4IiwiY2F0ZWdvcnlfc3VmZml4IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImFqYXh1cmwiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJodG1sIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0EsSUFBS0EsY0FBYyxDQUFDQyxxQ0FBZixJQUF3REQsY0FBYyxDQUFDRSxvQ0FBNUUsRUFBbUg7QUFDbEhDLEVBQUFBLFFBQVEsQ0FBQ0MsZUFBVCxDQUF5QkMsU0FBekIsSUFBc0MsdUNBQXRDO0FBQ0EsQ0FGRCxNQUVPO0FBQ047QUFBc0UsZUFBVTtBQUFDOztBQUFhLFFBQUlDLENBQUo7QUFBQSxRQUFNQyxDQUFDLEdBQUMsRUFBUjs7QUFBVyxhQUFTQyxDQUFULENBQVdDLENBQVgsRUFBYTtBQUFDRixNQUFBQSxDQUFDLENBQUNHLElBQUYsQ0FBT0QsQ0FBUDtBQUFVLFdBQUdGLENBQUMsQ0FBQ0ksTUFBTCxJQUFhTCxDQUFDLEVBQWQ7QUFBaUI7O0FBQUEsYUFBU00sQ0FBVCxHQUFZO0FBQUMsYUFBS0wsQ0FBQyxDQUFDSSxNQUFQO0FBQWVKLFFBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsSUFBT0EsQ0FBQyxDQUFDTSxLQUFGLEVBQVA7QUFBZjtBQUFnQzs7QUFBQVAsSUFBQUEsQ0FBQyxHQUFDLGFBQVU7QUFBQ1EsTUFBQUEsVUFBVSxDQUFDRixDQUFELENBQVY7QUFBYyxLQUEzQjs7QUFBNEIsYUFBU0csQ0FBVCxDQUFXTixDQUFYLEVBQWE7QUFBQyxXQUFLQSxDQUFMLEdBQU9PLENBQVA7QUFBUyxXQUFLQyxDQUFMLEdBQU8sS0FBSyxDQUFaO0FBQWMsV0FBS1gsQ0FBTCxHQUFPLEVBQVA7QUFBVSxVQUFJVyxDQUFDLEdBQUMsSUFBTjs7QUFBVyxVQUFHO0FBQUNSLFFBQUFBLENBQUMsQ0FBQyxVQUFTQSxD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QUU0SCxPQUZDO0FBR05yQixJQUFBQSxJQUFJLEVBQUU7QUFDQyxnQkFBVSw0Q0FEWDtBQUVDLGVBQVNsQixJQUFJLENBQUNDLEdBQUw7QUFGVixLQUhBO0FBT051QyxJQUFBQSxPQUFPLEVBQUUsaUJBQVVDLFFBQVYsRUFBcUI7QUFDdkI3SSxNQUFBQSxDQUFDLENBQUUsZ0NBQUYsRUFBb0NvRyxJQUFJLENBQUNFLE1BQUwsRUFBcEMsQ0FBRCxDQUFxRHdDLElBQXJELENBQTJERCxRQUFRLENBQUN2QixJQUFULENBQWN5QixPQUF6RTs7QUFDQSxVQUFLLFNBQVNGLFFBQVEsQ0FBQ3ZCLElBQVQsQ0FBY2QsSUFBNUIsRUFBbUM7QUFDeEN4RyxRQUFBQSxDQUFDLENBQUUsa0NBQUYsQ0FBRCxDQUF3Q3FHLEdBQXhDLENBQTZDLENBQTdDO0FBQ0EsT0FGSyxNQUVDO0FBQ05yRyxRQUFBQSxDQUFDLENBQUUsa0NBQUYsQ0FBRCxDQUF3Q3FHLEdBQXhDLENBQTZDLENBQTdDO0FBQ0E7QUFDRDtBQWRLLEdBQVA7QUFnQkEsQ0E1QkQiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBPcHRpbWl6YXRpb24gZm9yIFJlcGVhdCBWaWV3c1xuaWYgKCBzZXNzaW9uU3RvcmFnZS5zZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsICYmIHNlc3Npb25TdG9yYWdlLnNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCApIHtcblx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIHNlcmlmLWZvbnRzLWxvYWRlZCBzYW5zLWZvbnRzLWxvYWRlZCc7XG59IGVsc2Uge1xuXHQvKiBGb250IEZhY2UgT2JzZXJ2ZXIgdjIuMS4wIC0gwqkgQnJhbSBTdGVpbi4gTGljZW5zZTogQlNELTMtQ2xhdXNlICovKGZ1bmN0aW9uKCl7J3VzZSBzdHJpY3QnO3ZhciBmLGc9W107ZnVuY3Rpb24gbChhKXtnLnB1c2goYSk7MT09Zy5sZW5ndGgmJmYoKX1mdW5jdGlvbiBtKCl7Zm9yKDtnLmxlbmd0aDspZ1swXSgpLGcuc2hpZnQoKX1mPWZ1bmN0aW9uKCl7c2V0VGltZW91dChtKX07ZnVuY3Rpb24gbihhKXt0aGlzLmE9cDt0aGlzLmI9dm9pZCAwO3RoaXMuZj1bXTt2YXIgYj10aGlzO3RyeXthKGZ1bmN0aW9uKGEpe3EoYixhKX0sZnVuY3Rpb24oYSl7cihiLGEpfSl9Y2F0Y2goYyl7cihiLGMpfX12YXIgcD0yO2Z1bmN0aW9uIHQoYSl7cmV0dXJuIG5ldyBuKGZ1bmN0aW9uKGIsYyl7YyhhKX0pfWZ1bmN0aW9uIHUoYSl7cmV0dXJuIG5ldyBuKGZ1bmN0aW9uKGIpe2IoYSl9KX1mdW5jdGlvbiBxKGEsYil7aWYoYS5hPT1wKXtpZihiPT1hKXRocm93IG5ldyBUeXBlRXJyb3I7dmFyIGM9ITE7dHJ5e3ZhciBkPWImJmIudGhlbjtpZihudWxsIT1iJiZcIm9iamVjdFwiPT10eXBlb2YgYiYmXCJmdW5jdGlvblwiPT10eXBlb2YgZCl7ZC5jYWxsKGIsZnVuY3Rpb24oYil7Y3x8cShhLGIpO2M9ITB9LGZ1bmN0aW9uKGIpe2N8fHIoYSxiKTtjPSEwfSk7cmV0dXJufX1jYXRjaChlKXtjfHxyKGEsZSk7cmV0dXJufWEuYT0wO2EuYj1iO3YoYSl9fVxuXHRmdW5jdGlvbiByKGEsYil7aWYoYS5hPT1wKXtpZihiPT1hKXRocm93IG5ldyBUeXBlRXJyb3I7YS5hPTE7YS5iPWI7dihhKX19ZnVuY3Rpb24gdihhKXtsKGZ1bmN0aW9uKCl7aWYoYS5hIT1wKWZvcig7YS5mLmxlbmd0aDspe3ZhciBiPWEuZi5zaGlmdCgpLGM9YlswXSxkPWJbMV0sZT1iWzJdLGI9YlszXTt0cnl7MD09YS5hP1wiZnVuY3Rpb25cIj09dHlwZW9mIGM/ZShjLmNhbGwodm9pZCAwLGEuYikpOmUoYS5iKToxPT1hLmEmJihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkP2UoZC5jYWxsKHZvaWQgMCxhLmIpKTpiKGEuYikpfWNhdGNoKGgpe2IoaCl9fX0pfW4ucHJvdG90eXBlLmc9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuYyh2b2lkIDAsYSl9O24ucHJvdG90eXBlLmM9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzO3JldHVybiBuZXcgbihmdW5jdGlvbihkLGUpe2MuZi5wdXNoKFthLGIsZCxlXSk7dihjKX0pfTtcblx0ZnVuY3Rpb24gdyhhKXtyZXR1cm4gbmV3IG4oZnVuY3Rpb24oYixjKXtmdW5jdGlvbiBkKGMpe3JldHVybiBmdW5jdGlvbihkKXtoW2NdPWQ7ZSs9MTtlPT1hLmxlbmd0aCYmYihoKX19dmFyIGU9MCxoPVtdOzA9PWEubGVuZ3RoJiZiKGgpO2Zvcih2YXIgaz0wO2s8YS5sZW5ndGg7ays9MSl1KGFba10pLmMoZChrKSxjKX0pfWZ1bmN0aW9uIHgoYSl7cmV0dXJuIG5ldyBuKGZ1bmN0aW9uKGIsYyl7Zm9yKHZhciBkPTA7ZDxhLmxlbmd0aDtkKz0xKXUoYVtkXSkuYyhiLGMpfSl9O3dpbmRvdy5Qcm9taXNlfHwod2luZG93LlByb21pc2U9bix3aW5kb3cuUHJvbWlzZS5yZXNvbHZlPXUsd2luZG93LlByb21pc2UucmVqZWN0PXQsd2luZG93LlByb21pc2UucmFjZT14LHdpbmRvdy5Qcm9taXNlLmFsbD13LHdpbmRvdy5Qcm9taXNlLnByb3RvdHlwZS50aGVuPW4ucHJvdG90eXBlLmMsd2luZG93LlByb21pc2UucHJvdG90eXBlW1wiY2F0Y2hcIl09bi5wcm90b3R5cGUuZyk7fSgpKTtcblxuXHQoZnVuY3Rpb24oKXtmdW5jdGlvbiBsKGEsYil7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9hLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIixiLCExKTphLmF0dGFjaEV2ZW50KFwic2Nyb2xsXCIsYil9ZnVuY3Rpb24gbShhKXtkb2N1bWVudC5ib2R5P2EoKTpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24gYygpe2RvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsYyk7YSgpfSk6ZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixmdW5jdGlvbiBrKCl7aWYoXCJpbnRlcmFjdGl2ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlfHxcImNvbXBsZXRlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGUpZG9jdW1lbnQuZGV0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixrKSxhKCl9KX07ZnVuY3Rpb24gdChhKXt0aGlzLmE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0aGlzLmEuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIik7dGhpcy5hLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGEpKTt0aGlzLmI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5jPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5nPS0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5jLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjtcblx0dGhpcy5mLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmguc3R5bGUuY3NzVGV4dD1cImRpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjIwMCU7aGVpZ2h0OjIwMCU7Zm9udC1zaXplOjE2cHg7bWF4LXdpZHRoOm5vbmU7XCI7dGhpcy5iLmFwcGVuZENoaWxkKHRoaXMuaCk7dGhpcy5jLmFwcGVuZENoaWxkKHRoaXMuZik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYyl9XG5cdGZ1bmN0aW9uIHUoYSxiKXthLmEuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1zeW50aGVzaXM6bm9uZTtmb250OlwiK2IrXCI7XCJ9ZnVuY3Rpb24geihhKXt2YXIgYj1hLmEub2Zmc2V0V2lkdGgsYz1iKzEwMDthLmYuc3R5bGUud2lkdGg9YytcInB4XCI7YS5jLnNjcm9sbExlZnQ9YzthLmIuc2Nyb2xsTGVmdD1hLmIuc2Nyb2xsV2lkdGgrMTAwO3JldHVybiBhLmchPT1iPyhhLmc9YiwhMCk6ITF9ZnVuY3Rpb24gQShhLGIpe2Z1bmN0aW9uIGMoKXt2YXIgYT1rO3ooYSkmJmEuYS5wYXJlbnROb2RlJiZiKGEuZyl9dmFyIGs9YTtsKGEuYixjKTtsKGEuYyxjKTt6KGEpfTtmdW5jdGlvbiBCKGEsYil7dmFyIGM9Ynx8e307dGhpcy5mYW1pbHk9YTt0aGlzLnN0eWxlPWMuc3R5bGV8fFwibm9ybWFsXCI7dGhpcy53ZWlnaHQ9Yy53ZWlnaHR8fFwibm9ybWFsXCI7dGhpcy5zdHJldGNoPWMuc3RyZXRjaHx8XCJub3JtYWxcIn12YXIgQz1udWxsLEQ9bnVsbCxFPW51bGwsRj1udWxsO2Z1bmN0aW9uIEcoKXtpZihudWxsPT09RClpZihKKCkmJi9BcHBsZS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnZlbmRvcikpe3ZhciBhPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtEPSEhYSYmNjAzPnBhcnNlSW50KGFbMV0sMTApfWVsc2UgRD0hMTtyZXR1cm4gRH1mdW5jdGlvbiBKKCl7bnVsbD09PUYmJihGPSEhZG9jdW1lbnQuZm9udHMpO3JldHVybiBGfVxuXHRmdW5jdGlvbiBLKCl7aWYobnVsbD09PUUpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dHJ5e2Euc3R5bGUuZm9udD1cImNvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmXCJ9Y2F0Y2goYil7fUU9XCJcIiE9PWEuc3R5bGUuZm9udH1yZXR1cm4gRX1mdW5jdGlvbiBMKGEsYil7cmV0dXJuW2Euc3R5bGUsYS53ZWlnaHQsSygpP2Euc3RyZXRjaDpcIlwiLFwiMTAwcHhcIixiXS5qb2luKFwiIFwiKX1cblx0Qi5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMsaz1hfHxcIkJFU2Jzd3lcIixyPTAsbj1ifHwzRTMsSD0obmV3IERhdGUpLmdldFRpbWUoKTtyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtpZihKKCkmJiFHKCkpe3ZhciBNPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gZSgpeyhuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PW4/YihFcnJvcihcIlwiK24rXCJtcyB0aW1lb3V0IGV4Y2VlZGVkXCIpKTpkb2N1bWVudC5mb250cy5sb2FkKEwoYywnXCInK2MuZmFtaWx5KydcIicpLGspLnRoZW4oZnVuY3Rpb24oYyl7MTw9Yy5sZW5ndGg/YSgpOnNldFRpbWVvdXQoZSwyNSl9LGIpfWUoKX0pLE49bmV3IFByb21pc2UoZnVuY3Rpb24oYSxjKXtyPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtjKEVycm9yKFwiXCIrbitcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpfSxuKX0pO1Byb21pc2UucmFjZShbTixNXSkudGhlbihmdW5jdGlvbigpe2NsZWFyVGltZW91dChyKTthKGMpfSxcblx0Yil9ZWxzZSBtKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gdigpe3ZhciBiO2lmKGI9LTEhPWYmJi0xIT1nfHwtMSE9ZiYmLTEhPWh8fC0xIT1nJiYtMSE9aCkoYj1mIT1nJiZmIT1oJiZnIT1oKXx8KG51bGw9PT1DJiYoYj0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCksQz0hIWImJig1MzY+cGFyc2VJbnQoYlsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGJbMV0sMTApJiYxMT49cGFyc2VJbnQoYlsyXSwxMCkpKSxiPUMmJihmPT13JiZnPT13JiZoPT13fHxmPT14JiZnPT14JiZoPT14fHxmPT15JiZnPT15JiZoPT15KSksYj0hYjtiJiYoZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksY2xlYXJUaW1lb3V0KHIpLGEoYykpfWZ1bmN0aW9uIEkoKXtpZigobmV3IERhdGUpLmdldFRpbWUoKS1IPj1uKWQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGIoRXJyb3IoXCJcIitcblx0bitcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpO2Vsc2V7dmFyIGE9ZG9jdW1lbnQuaGlkZGVuO2lmKCEwPT09YXx8dm9pZCAwPT09YSlmPWUuYS5vZmZzZXRXaWR0aCxnPXAuYS5vZmZzZXRXaWR0aCxoPXEuYS5vZmZzZXRXaWR0aCx2KCk7cj1zZXRUaW1lb3V0KEksNTApfX12YXIgZT1uZXcgdChrKSxwPW5ldyB0KGspLHE9bmV3IHQoayksZj0tMSxnPS0xLGg9LTEsdz0tMSx4PS0xLHk9LTEsZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2QuZGlyPVwibHRyXCI7dShlLEwoYyxcInNhbnMtc2VyaWZcIikpO3UocCxMKGMsXCJzZXJpZlwiKSk7dShxLEwoYyxcIm1vbm9zcGFjZVwiKSk7ZC5hcHBlbmRDaGlsZChlLmEpO2QuYXBwZW5kQ2hpbGQocC5hKTtkLmFwcGVuZENoaWxkKHEuYSk7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkKTt3PWUuYS5vZmZzZXRXaWR0aDt4PXAuYS5vZmZzZXRXaWR0aDt5PXEuYS5vZmZzZXRXaWR0aDtJKCk7QShlLGZ1bmN0aW9uKGEpe2Y9YTt2KCl9KTt1KGUsXG5cdEwoYywnXCInK2MuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO0EocCxmdW5jdGlvbihhKXtnPWE7digpfSk7dShwLEwoYywnXCInK2MuZmFtaWx5KydcIixzZXJpZicpKTtBKHEsZnVuY3Rpb24oYSl7aD1hO3YoKX0pO3UocSxMKGMsJ1wiJytjLmZhbWlseSsnXCIsbW9ub3NwYWNlJykpfSl9KX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9Qjood2luZG93LkZvbnRGYWNlT2JzZXJ2ZXI9Qix3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZD1CLnByb3RvdHlwZS5sb2FkKTt9KCkpO1xuXG5cdC8vIG1pbm5wb3N0IGZvbnRzXG5cblx0Ly8gc2Fuc1xuXHR2YXIgc2Fuc05vcm1hbCA9IG5ldyBGb250RmFjZU9ic2VydmVyKCAnZmYtbWV0YS13ZWItcHJvJyApO1xuXHR2YXIgc2Fuc0JvbGQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzYW5zTm9ybWFsSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNDAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXG5cdC8vIHNlcmlmXG5cdHZhciBzZXJpZkJvb2sgPSBuZXcgRm9udEZhY2VPYnNlcnZlciggXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNTAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCb29rSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNTAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCb2xkID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNzAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCb2xkSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNzAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCbGFjayA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDkwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQmxhY2tJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA5MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cblx0UHJvbWlzZS5hbGwoIFtcblx0XHRzYW5zTm9ybWFsLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zQm9sZC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc05vcm1hbEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb29rLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvb2tJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9sZC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb2xkSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJsYWNrLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJsYWNrSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKVxuXHRdICkudGhlbiggZnVuY3Rpb24oKSB7XG5cdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIHNlcmlmLWZvbnRzLWxvYWRlZCc7XG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsID0gdHJ1ZTtcblx0fSApO1xuXG5cdFByb21pc2UuYWxsKCBbXG5cdFx0c2Fuc05vcm1hbC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc0JvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNOb3JtYWxJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApXG5cdF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2Fucy1mb250cy1sb2FkZWQnO1xuXHRcdC8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5cdFx0c2Vzc2lvblN0b3JhZ2Uuc2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsID0gdHJ1ZTtcblx0fSApO1xufVxuXG4iLCJmdW5jdGlvbiBtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApIHtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGdhICkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB2YWx1ZSApIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuJCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oIGUgKSB7XG5cblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIFBVTSApIHtcblx0XHR2YXIgY3VycmVudF9wb3B1cCA9IFBVTS5nZXRQb3B1cCggJCggJy5wdW0nICkgKTtcblx0XHR2YXIgc2V0dGluZ3MgPSBQVU0uZ2V0U2V0dGluZ3MoICQoICcucHVtJyApICk7XG5cdFx0dmFyIHBvcHVwX2lkID0gc2V0dGluZ3MuaWQ7XG5cdFx0JCggZG9jdW1lbnQgKS5vbiggJ3B1bUFmdGVyT3BlbicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnU2hvdycsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSk7XG5cdFx0fSk7XG5cdFx0JCggZG9jdW1lbnQgKS5vbiggJ3B1bUFmdGVyQ2xvc2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJC5mbi5wb3BtYWtlLmxhc3RfY2xvc2VfdHJpZ2dlcjtcblx0XHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBjbG9zZV90cmlnZ2VyICkge1xuXHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JCggJy5tZXNzYWdlLWNsb3NlJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGNsb3NlIGNsYXNzXG5cdFx0XHR2YXIgY2xvc2VfdHJpZ2dlciA9ICdDbG9zZSBCdXR0b24nO1xuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCBjbG9zZV90cmlnZ2VyLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0pO1xuXHRcdH0pO1xuXHRcdCQoICcubWVzc2FnZS1sb2dpbicgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIGxpbmsgd2l0aCBsb2dpbiBjbGFzc1xuXHRcdFx0dmFyIHVybCA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ0xvZ2luIExpbmsnLCB1cmwgKTtcblx0XHR9KTtcblx0XHQkKCAnLnB1bS1jb250ZW50IGE6bm90KCAubWVzc2FnZS1jbG9zZSwgLnB1bS1jbG9zZSwgLm1lc3NhZ2UtbG9naW4gKScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIHNvbWV0aGluZyB0aGF0IGlzIG5vdCBjbG9zZSB0ZXh0IG9yIGNsb3NlIGljb25cblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ0NsaWNrJywgcG9wdXBfaWQgKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEgJiYgJycgIT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS51cmxfYWNjZXNzX2xldmVsICkge1xuXHRcdHZhciB0eXBlID0gJ2V2ZW50Jztcblx0XHR2YXIgY2F0ZWdvcnkgPSAnTWVtYmVyIENvbnRlbnQnO1xuXHRcdHZhciBsYWJlbCA9IGxvY2F0aW9uLnBhdGhuYW1lOyAvLyBpIHRoaW5rIHdlIGNvdWxkIHBvc3NpYmx5IHB1dCBzb21lIGdyb3VwaW5nIGhlcmUsIGJ1dCB3ZSBkb24ndCBuZWNlc3NhcmlseSBoYXZlIGFjY2VzcyB0byBvbmUgYW5kIG1heWJlIGl0J3Mgbm90IHdvcnRod2hpbGUgeWV0XG5cdFx0dmFyIGFjdGlvbiA9ICdCbG9ja2VkJztcblx0XHRpZiAoIHRydWUgPT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS5jdXJyZW50X3VzZXIuY2FuX2FjY2VzcyApIHtcblx0XHRcdGFjdGlvbiA9ICdTaG93bic7XG5cdFx0fVxuXHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0fVxufSk7XG4iLCJmdW5jdGlvbiB0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApIHtcblxuXHQvLyBpZiBhIG5vdCBsb2dnZWQgaW4gdXNlciB0cmllcyB0byBlbWFpbCwgZG9uJ3QgY291bnQgdGhhdCBhcyBhIHNoYXJlXG5cdGlmICggISBqUXVlcnkoICdib2R5JyApLmhhc0NsYXNzKCAnbG9nZ2VkLWluJyApICYmICdFbWFpbCcgPT09IHRleHQgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gdHJhY2sgYXMgYW4gZXZlbnQsIGFuZCBhcyBzb2NpYWwgaWYgaXQgaXMgdHdpdHRlciBvciBmYlxuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdTaGFyZSAtICcgKyBwb3NpdGlvbiwgdGV4dCwgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGdhICkge1xuXHRcdGlmICggJ0ZhY2Vib29rJyA9PT0gdGV4dCB8fCAnVHdpdHRlcicgPT09IHRleHQgKSB7XG5cdFx0XHRpZiAoICdGYWNlYm9vaycgPT0gdGV4dCApIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdTaGFyZScsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1R3ZWV0JywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbiQgKCAnLm0tZW50cnktc2hhcmUtdG9wIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHR2YXIgdGV4dCA9ICQoIHRoaXMgKS50ZXh0KCkudHJpbSgpO1xuXHR2YXIgcG9zaXRpb24gPSAndG9wJztcblx0dHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcbn0pO1xuXG4kICggJy5tLWVudHJ5LXNoYXJlLWJvdHRvbSBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0dmFyIHRleHQgPSAkKCB0aGlzICkudGV4dCgpLnRyaW0oKTtcblx0dmFyIHBvc2l0aW9uID0gJ2JvdHRvbSc7XG5cdHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG59KTtcbiIsIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIEhhbmRsZXMgdG9nZ2xpbmcgdGhlIG5hdmlnYXRpb24gbWVudSBmb3Igc21hbGwgc2NyZWVucyBhbmQgZW5hYmxlcyBUQUIga2V5XG4gKiBuYXZpZ2F0aW9uIHN1cHBvcnQgZm9yIGRyb3Bkb3duIG1lbnVzLlxuICovXG5cbnNldHVwTWVudSggJ25hdmlnYXRpb24tcHJpbWFyeScgKTtcbnNldHVwTWVudSggJ25hdmlnYXRpb24tdXNlci1hY2NvdW50LW1hbmFnZW1lbnQnICk7XG5zZXR1cE5hdlNlYXJjaCggJ25hdmlnYXRpb24tcHJpbWFyeScgKTtcblxuZnVuY3Rpb24gc2V0dXBOYXZTZWFyY2goIGNvbnRhaW5lciApIHtcblxuXHR2YXIgbmF2c2VhcmNoY29udGFpbmVyLCBuYXZzZWFyY2h0b2dnbGUsIG5hdnNlYXJjaGZvcm07XG5cblx0Y29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGNvbnRhaW5lciApO1xuXHRpZiAoICEgY29udGFpbmVyICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG5hdnNlYXJjaGNvbnRhaW5lciA9ICQoICdsaS5zZWFyY2gnLCAkKCBjb250YWluZXIgKSApO1xuXHRuYXZzZWFyY2h0b2dnbGUgICAgPSAkKCAnbGkuc2VhcmNoIGEnLCAkKCBjb250YWluZXIgKSApO1xuXHRuYXZzZWFyY2hmb3JtICAgICAgPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdmb3JtJyApWzBdO1xuXG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBuYXZzZWFyY2h0b2dnbGUgfHwgJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBuYXZzZWFyY2hmb3JtICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmICggMCA8ICQoIG5hdnNlYXJjaGZvcm0gKS5sZW5ndGggKSB7XG5cdFx0JCggZG9jdW1lbnQgKS5jbGljayggZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0dmFyICR0YXJnZXQgPSAkKCBldmVudC50YXJnZXQgKTtcblx0XHRcdGlmICggISAkdGFyZ2V0LmNsb3Nlc3QoIG5hdnNlYXJjaGNvbnRhaW5lciApLmxlbmd0aCAmJiAkKCBuYXZzZWFyY2hmb3JtICkuaXMoICc6dmlzaWJsZScgKSApIHtcblx0XHRcdFx0bmF2c2VhcmNoZm9ybS5jbGFzc05hbWUgPSBuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZS5yZXBsYWNlKCAnIHRvZ2dsZWQtZm9ybScsICcnICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnByb3AoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucmVtb3ZlQ2xhc3MoICd0b2dnbGVkLWZvcm0nICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JCggbmF2c2VhcmNodG9nZ2xlICkub24oICdjbGljaycsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRpZiAoIC0xICE9PSBuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZC1mb3JtJyApICkge1xuXHRcdFx0XHRuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZSA9IG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lLnJlcGxhY2UoICcgdG9nZ2xlZC1mb3JtJywgJycgKTtcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucHJvcCggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5yZW1vdmVDbGFzcyggJ3RvZ2dsZWQtZm9ybScgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lICs9ICcgdG9nZ2xlZC1mb3JtJztcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucHJvcCggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLmFkZENsYXNzKCAndG9nZ2xlZC1mb3JtJyApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNldHVwTWVudSggY29udGFpbmVyICkge1xuXHR2YXIgYnV0dG9uLCBtZW51LCBsaW5rcywgaSwgbGVuO1xuXHRjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggY29udGFpbmVyICk7XG5cdGlmICggISBjb250YWluZXIgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0YnV0dG9uID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYnV0dG9uJyApWzBdO1xuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgYnV0dG9uICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1lbnUgPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICd1bCcgKVswXTtcblxuXHQvLyBIaWRlIG1lbnUgdG9nZ2xlIGJ1dHRvbiBpZiBtZW51IGlzIGVtcHR5IGFuZCByZXR1cm4gZWFybHkuXG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBtZW51ICkge1xuXHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0aWYgKCAtMSA9PT0gbWVudS5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cdFx0bWVudS5jbGFzc05hbWUgKz0gJyBtZW51Jztcblx0fVxuXG5cdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCAtMSAhPT0gY29udGFpbmVyLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZCcgKSApIHtcblx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgPSBjb250YWluZXIuY2xhc3NOYW1lLnJlcGxhY2UoICcgdG9nZ2xlZCcsICcnICk7XG5cdFx0XHRidXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSArPSAnIHRvZ2dsZWQnO1xuXHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyApO1xuXHRcdH1cblx0fTtcblxuXHQvLyBHZXQgYWxsIHRoZSBsaW5rIGVsZW1lbnRzIHdpdGhpbiB0aGUgbWVudS5cblx0bGlua3MgICAgPSBtZW51LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYScgKTtcblxuXHQvLyBFYWNoIHRpbWUgYSBtZW51IGxpbmsgaXMgZm9jdXNlZCBvciBibHVycmVkLCB0b2dnbGUgZm9jdXMuXG5cdGZvciAoIGkgPSAwLCBsZW4gPSBsaW5rcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCAnZm9jdXMnLCB0b2dnbGVGb2N1cywgdHJ1ZSApO1xuXHRcdGxpbmtzW2ldLmFkZEV2ZW50TGlzdGVuZXIoICdibHVyJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUb2dnbGVzIGBmb2N1c2AgY2xhc3MgdG8gYWxsb3cgc3VibWVudSBhY2Nlc3Mgb24gdGFibGV0cy5cblx0ICovXG5cdCggZnVuY3Rpb24oIGNvbnRhaW5lciApIHtcblx0XHR2YXIgdG91Y2hTdGFydEZuLCBpLFxuXHRcdFx0cGFyZW50TGluayA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCAnLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4gPiBhLCAucGFnZV9pdGVtX2hhc19jaGlsZHJlbiA+IGEnICk7XG5cblx0XHRpZiAoICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyApIHtcblx0XHRcdHRvdWNoU3RhcnRGbiA9IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgbWVudUl0ZW0gPSB0aGlzLnBhcmVudE5vZGUsXG5cdFx0XHRcdFx0aTtcblxuXHRcdFx0XHRpZiAoICEgbWVudUl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCAnZm9jdXMnICkgKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgbWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbi5sZW5ndGg7ICsraSApIHtcblx0XHRcdFx0XHRcdGlmICggbWVudUl0ZW0gPT09IG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW5baV0pIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LmFkZCggJ2ZvY3VzJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1lbnVJdGVtLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBwYXJlbnRMaW5rLmxlbmd0aDsgKytpICkge1xuXHRcdFx0XHRwYXJlbnRMaW5rW2ldLmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hTdGFydEZuLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSggY29udGFpbmVyICkgKTtcbn1cblxuLyoqXG4gKiBTZXRzIG9yIHJlbW92ZXMgLmZvY3VzIGNsYXNzIG9uIGFuIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUZvY3VzKCkge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0Ly8gTW92ZSB1cCB0aHJvdWdoIHRoZSBhbmNlc3RvcnMgb2YgdGhlIGN1cnJlbnQgbGluayB1bnRpbCB3ZSBoaXQgLm5hdi1tZW51LlxuXHR3aGlsZSAoIC0xID09PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnbWVudScgKSApIHtcblxuXHRcdC8vIE9uIGxpIGVsZW1lbnRzIHRvZ2dsZSB0aGUgY2xhc3MgLmZvY3VzLlxuXHRcdGlmICggJ2xpJyA9PT0gc2VsZi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgKSB7XG5cdFx0XHRpZiAoIC0xICE9PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnZm9jdXMnICkgKSB7XG5cdFx0XHRcdHNlbGYuY2xhc3NOYW1lID0gc2VsZi5jbGFzc05hbWUucmVwbGFjZSggJyBmb2N1cycsICcnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWxmLmNsYXNzTmFtZSArPSAnIGZvY3VzJztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRzZWxmID0gc2VsZi5wYXJlbnRFbGVtZW50O1xuXHR9XG59XG5cbiQoICcjbmF2aWdhdGlvbi1mZWF0dXJlZCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnRmVhdHVyZWQgQmFyIExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcbn0pO1xuXG4kKCAnYS5nbGVhbi1zaWRlYmFyJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBTdXBwb3J0IExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcbn0pO1xuXG4kKCAnYScsICQoICcuby1zaXRlLXNpZGViYXInICkgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdHZhciB3aWRnZXRfdGl0bGUgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXdpZGdldCcgKS5maW5kKCAnaDMnICkudGV4dCgpO1xuXHR2YXIgem9uZV90aXRsZSAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS16b25lJyApLmZpbmQoICcuYS16b25lLXRpdGxlJyApLnRleHQoKTtcblx0dmFyIHNpZGViYXJfc2VjdGlvbl90aXRsZSA9ICcnO1xuXHRpZiAoICcnICE9PSB3aWRnZXRfdGl0bGUgKSB7XG5cdFx0c2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gd2lkZ2V0X3RpdGxlO1xuXHR9IGVsc2UgaWYgKCAnJyAhPT0gem9uZV90aXRsZSApIHtcblx0XHRzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSB6b25lX3RpdGxlO1xuXHR9XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJfc2VjdGlvbl90aXRsZSApO1xufSk7XG5cbi8vIHVzZXIgYWNjb3VudCBuYXZpZ2F0aW9uIGNhbiBiZSBhIGRyb3Bkb3duXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblxuXHQvLyBoaWRlIG1lbnVcblx0aWYgKCAwIDwgJCggJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJyApLmxlbmd0aCApIHtcblx0XHQkKCAnI3VzZXItYWNjb3VudC1hY2Nlc3MgPiBsaSA+IGEnICkub24oICdjbGljaycsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdCQoICcjdXNlci1hY2NvdW50LWFjY2VzcyB1bCcgKS50b2dnbGVDbGFzcyggJ3Zpc2libGUnICk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0pO1xuXHR9XG59KTtcbiIsIlxualF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICggdGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgJycgIT09IHRoaXMubm9kZVZhbHVlLnRyaW0oKSApO1xuXHR9KTtcbn07XG5cbmZ1bmN0aW9uIGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoIGFjdGlvbiApIHtcblx0dmFyIG1hcmt1cCA9ICc8bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLWZvcm0tY29uZmlybVwiPjxsYWJlbD5BcmUgeW91IHN1cmU/IDxhIGlkPVwiYS1jb25maXJtLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ZZXM8L2E+IHwgPGEgaWQ9XCJhLXN0b3AtJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPk5vPC9hPjwvbGFiZWw+PC9saT4nO1xuXHRyZXR1cm4gbWFya3VwO1xufVxuXG5mdW5jdGlvbiBtYW5hZ2VFbWFpbHMoKSB7XG5cdHZhciBmb3JtICAgICAgICAgICAgICAgPSAkKCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScgKTtcblx0dmFyIHJlc3Rfcm9vdCAgICAgICAgICA9IHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Quc2l0ZV91cmwgKyB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnJlc3RfbmFtZXNwYWNlO1xuXHR2YXIgZnVsbF91cmwgICAgICAgICAgID0gcmVzdF9yb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdHZhciBjb25maXJtQ2hhbmdlICAgICAgPSAnJztcblx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdHZhciBuZXdQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIG9sZFByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0dmFyIGNvbnNvbGlkYXRlZEVtYWlscyA9IFtdO1xuXHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdHZhciBhamF4X2Zvcm1fZGF0YSAgICAgPSAnJztcblx0dmFyIHRoYXQgICAgICAgICAgICAgICA9ICcnO1xuXG5cdC8vIHN0YXJ0IG91dCB3aXRoIG5vIHByaW1hcnkvcmVtb3ZhbHMgY2hlY2tlZFxuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHQvLyBpZiB0aGVyZSBpcyBhIGxpc3Qgb2YgZW1haWxzIChub3QganVzdCBhIHNpbmdsZSBmb3JtIGZpZWxkKVxuXHRpZiAoIDAgPCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cblx0XHQvLyBpZiBhIHVzZXIgc2VsZWN0cyBhIG5ldyBwcmltYXJ5LCBtb3ZlIGl0IGludG8gdGhhdCBwb3NpdGlvblxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0XHRuZXdQcmltYXJ5RW1haWwgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRvbGRQcmltYXJ5RW1haWwgPSAkKCAnI2VtYWlsJyApLnZhbCgpO1xuXHRcdFx0cHJpbWFyeUlkICAgICAgID0gJCggdGhpcyApLnByb3AoICdpZCcgKS5yZXBsYWNlKCAncHJpbWFyeV9lbWFpbF8nLCAnJyApO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3ByaW1hcnktY2hhbmdlJyApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cblx0XHRcdC8vJCggdGhpcyApLnBhcmVudCgpLmFmdGVyKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgdXNlciBmYWNpbmcgdmFsdWVzXG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBuZXdQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyN1c2VyLWVtYWlsLScgKyBwcmltYXJ5SWQgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIG1haW4gaGlkZGVuIGZvcm0gdmFsdWVcblx0XHRcdFx0JCggJyNlbWFpbCcgKS52YWwoIG5ld1ByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHN1Ym1pdCBmb3JtIHZhbHVlcy5cblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblxuXHRcdFx0XHQvLyB1bmNoZWNrIHRoZSByYWRpbyBidXR0b25cblx0XHRcdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgZm9ybSB2YWx1ZXMgdG8gdGhlIG9sZCBwcmltYXJ5IGVtYWlsXG5cdFx0XHRcdCQoICcjcHJpbWFyeV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyNyZW1vdmVfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIHRoZSBjb25maXJtIG1lc3NhZ2Vcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdC8vIGlmIGEgdXNlciByZW1vdmVzIGFuIGVtYWlsLCB0YWtlIGl0IGF3YXkgZnJvbSB0aGUgdmlzdWFsIGFuZCBmcm9tIHRoZSBmb3JtXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NoYW5nZScsICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZW1haWxUb1JlbW92ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdyZW1vdmFsJyApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgIT09IGVtYWlsVG9SZW1vdmUgKSB7XG5cdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyIGZvciByZW1vdmFsXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQvLyBpZiBjb25maXJtZWQsIHJlbW92ZSB0aGUgZW1haWwgYW5kIHN1Ym1pdCB0aGUgZm9ybVxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5mYWRlT3V0KCAnbm9ybWFsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLnJlbW92ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRjb25zb2xlLmxvZyggJ3ZhbHVlIGlzICcgKyBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnICkuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvbiBhLWJ1dHRvbi1hZGQtdXNlci1lbWFpbFwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRuZXh0RW1haWxDb3VudCsrO1xuXHR9KTtcblxuXHQkKCAnaW5wdXRbdHlwZT1zdWJtaXRdJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgYnV0dG9uID0gJCggdGhpcyApO1xuXHRcdHZhciBidXR0b25fZm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCAnZm9ybScgKTtcblx0XHRidXR0b25fZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nLCBidXR0b24udmFsKCkgKTtcblx0fSk7XG5cblx0JCggJy5tLWVudHJ5LWNvbnRlbnQnICkub24oICdzdWJtaXQnLCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgZm9ybSA9ICQoIHRoaXMgKTtcblx0XHR2YXIgc3VibWl0dGluZ19idXR0b24gPSBmb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicgKSB8fCAnJztcblxuXHRcdC8vIGlmIHRoZXJlIGlzIG5vIHN1Ym1pdHRpbmcgYnV0dG9uLCBwYXNzIGl0IGJ5IEFqYXhcblx0XHRpZiAoICcnID09PSBzdWJtaXR0aW5nX2J1dHRvbiB8fCAnU2F2ZSBDaGFuZ2VzJyAhPT0gc3VibWl0dGluZ19idXR0b24gKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4X2Zvcm1fZGF0YSA9IGFqYXhfZm9ybV9kYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dXJsOiBmdWxsX3VybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xuXHRcdFx0ICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Lm5vbmNlICk7XG5cdFx0XHQgICAgfSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0ZGF0YTogYWpheF9mb3JtX2RhdGFcblx0XHRcdH0pLmRvbmUoIGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0XHRuZXdFbWFpbHMgPSAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHR9KS5nZXQoKTtcblx0XHRcdFx0JC5lYWNoKCBuZXdFbWFpbHMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSBuZXh0RW1haWxDb3VudCArIGluZGV4O1xuXHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkuYXBwZW5kKCAnPGxpIGlkPVwidXNlci1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtZW1haWwtcHJlZmVyZW5jZXNcIj48YSBocmVmPVwiL25ld3NsZXR0ZXJzLz9lbWFpbD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCB2YWx1ZSApICsgJ1wiPjxzbWFsbD5FbWFpbCBQcmVmZXJlbmNlczwvc21hbGw+PC9hPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLXJlbW92ZS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwicmVtb3ZlX2VtYWlsWycgKyBuZXh0RW1haWxDb3VudCArICddXCIgaWQ9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5SZW1vdmU8L3NtYWxsPjwvbGFiZWw+PC9saT48L3VsPjwvbGk+JyApO1xuXHRcdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCAkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCgpICsgJywnICsgdmFsdWUgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcubS1mb3JtLWNoYW5nZS1lbWFpbCAuYS1pbnB1dC13aXRoLWJ1dHRvbicgKS5yZW1vdmUoKTtcblx0XHRcdFx0aWYgKCAwID09PSAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKSAhPT0gJCggJ2lucHV0W25hbWU9XCJlbWFpbFwiXScgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gaXQgd291bGQgYmUgbmljZSB0byBvbmx5IGxvYWQgdGhlIGZvcm0sIGJ1dCB0aGVuIGNsaWNrIGV2ZW50cyBzdGlsbCBkb24ndCB3b3JrXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICggMCA8ICQoICcubS1mb3JtLWVtYWlsJyApLmxlbmd0aCApIHtcblx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0fVxufSk7XG4iLCIvLyBiYXNlZCBvbiB3aGljaCBidXR0b24gd2FzIGNsaWNrZWQsIHNldCB0aGUgdmFsdWVzIGZvciB0aGUgYW5hbHl0aWNzIGV2ZW50IGFuZCBjcmVhdGUgaXRcbmZ1bmN0aW9uIHRyYWNrU2hvd0NvbW1lbnRzKCBhbHdheXMsIGlkLCBjbGlja192YWx1ZSApIHtcblx0dmFyIGFjdGlvbiAgICAgICAgICA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlfcHJlZml4ID0gJyc7XG5cdHZhciBjYXRlZ29yeV9zdWZmaXggPSAnJztcblx0dmFyIHBvc2l0aW9uICAgICAgICA9ICcnO1xuXHRwb3NpdGlvbiA9IGlkLnJlcGxhY2UoICdhbHdheXMtc2hvdy1jb21tZW50cy0nLCAnJyApO1xuXHRpZiAoICcxJyA9PT0gY2xpY2tfdmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09uJztcblx0fSBlbHNlIGlmICggJzAnID09PSBjbGlja192YWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5X3ByZWZpeCA9ICdBbHdheXMgJztcblx0fVxuXHRpZiAoICcnICE9PSBwb3NpdGlvbiApIHtcblx0XHRwb3NpdGlvbiA9IHBvc2l0aW9uLmNoYXJBdCggMCApLnRvVXBwZXJDYXNlKCkgKyBwb3NpdGlvbi5zbGljZSggMSApO1xuXHRcdGNhdGVnb3J5X3N1ZmZpeCA9ICcgLSAnICsgcG9zaXRpb247XG5cdH1cblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeV9wcmVmaXggKyAnU2hvdyBDb21tZW50cycgKyBjYXRlZ29yeV9zdWZmaXgsIGFjdGlvbiwgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn1cblxuLy8gd2hlbiBzaG93aW5nIGNvbW1lbnRzIG9uY2UsIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWJ1dHRvbi1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCBmYWxzZSwgJycsICcnICk7XG59KTtcblxuLy8gU2V0IHVzZXIgbWV0YSB2YWx1ZSBmb3IgYWx3YXlzIHNob3dpbmcgY29tbWVudHMgaWYgdGhhdCBidXR0b24gaXMgY2xpY2tlZFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHZhciB0aGF0ID0gJCggdGhpcyApO1xuXHRpZiAoIHRoYXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gZWxzZSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuXHR0cmFja1Nob3dDb21tZW50cyggdHJ1ZSwgdGhhdC5hdHRyKCAnaWQnICksIHRoYXQudmFsKCkgKTtcblxuXHQvLyB3ZSBhbHJlYWR5IGhhdmUgYWpheHVybCBmcm9tIHRoZSB0aGVtZVxuXHQkLmFqYXgoe1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHR1cmw6IGFqYXh1cmwsXG5cdFx0ZGF0YToge1xuICAgICAgICBcdCdhY3Rpb24nOiAnbWlubnBvc3RfbGFyZ29fbG9hZF9jb21tZW50c19zZXRfdXNlcl9tZXRhJyxcbiAgICAgICAgXHQndmFsdWUnOiB0aGF0LnZhbCgpXG5cdFx0fSxcblx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG4gICAgICAgIFx0JCggJy5hLWFsd2F5cy1zaG93LWNvbW1lbnRzLXJlc3VsdCcsIHRoYXQucGFyZW50KCkgKS5odG1sKCByZXNwb25zZS5kYXRhLm1lc3NhZ2UgKTtcbiAgICAgICAgXHRpZiAoIHRydWUgPT09IHJlc3BvbnNlLmRhdGEuc2hvdyApIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcbiJdfQ==
}(jQuery));
