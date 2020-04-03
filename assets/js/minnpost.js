;(function($) {
"use strict";

function tlite(t) {
  document.addEventListener("mouseover", function (e) {
    var i = e.target,
        n = t(i);
    n || (n = (i = i.parentElement) && t(i)), n && tlite.show(i, n, !0);
  });
}

tlite.show = function (t, e, i) {
  var n = "data-tlite";
  e = e || {}, (t.tooltip || function (t, e) {
    function o() {
      tlite.hide(t, !0);
    }

    function l() {
      r || (r = function (t, e, i) {
        function n() {
          o.className = "tlite tlite-" + r + s;
          var e = t.offsetTop,
              i = t.offsetLeft;
          o.offsetParent === t && (e = i = 0);
          var n = t.offsetWidth,
              l = t.offsetHeight,
              d = o.offsetHeight,
              f = o.offsetWidth,
              a = i + n / 2;
          o.style.top = ("s" === r ? e - d - 10 : "n" === r ? e + l + 10 : e + l / 2 - d / 2) + "px", o.style.left = ("w" === s ? i : "e" === s ? i + n - f : "w" === r ? i + n + 10 : "e" === r ? i - f - 10 : a - f / 2) + "px";
        }

        var o = document.createElement("span"),
            l = i.grav || t.getAttribute("data-tlite") || "n";
        o.innerHTML = e, t.appendChild(o);
        var r = l[0] || "",
            s = l[1] || "";
        n();
        var d = o.getBoundingClientRect();
        return "s" === r && d.top < 0 ? (r = "n", n()) : "n" === r && d.bottom > window.innerHeight ? (r = "s", n()) : "e" === r && d.left < 0 ? (r = "w", n()) : "w" === r && d.right > window.innerWidth && (r = "e", n()), o.className += " tlite-visible", o;
      }(t, d, e));
    }

    var r, s, d;
    return t.addEventListener("mousedown", o), t.addEventListener("mouseleave", o), t.tooltip = {
      show: function show() {
        d = t.title || t.getAttribute(n) || d, t.title = "", t.setAttribute(n, ""), d && !s && (s = setTimeout(l, i ? 150 : 1));
      },
      hide: function hide(t) {
        if (i === t) {
          s = clearTimeout(s);
          var e = r && r.parentNode;
          e && e.removeChild(r), r = void 0;
        }
      }
    };
  }(t, e)).show();
}, tlite.hide = function (t, e) {
  t.tooltip && t.tooltip.hide(e);
}, "undefined" != typeof module && module.exports && (module.exports = tlite);
"use strict";

$('html').removeClass('no-js').addClass('js');
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

function trackShare(text) {
  var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  // if a not logged in user tries to email, don't count that as a share
  if (!jQuery('body').hasClass('logged-in') && 'Email' === text) {
    return;
  }

  var category = 'Share';

  if ('' !== position) {
    category = 'Share - ' + position;
  } // track as an event, and as social if it is twitter or fb


  mp_analytics_tracking_event('event', category, text, location.pathname);

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

function copyCurrentURL() {
  var dummy = document.createElement('input'),
      text = window.location.href;
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
}

$('.m-entry-share-top a').click(function (e) {
  var text = $(this).data('share-action');
  var position = 'top';
  trackShare(text, position);
});
$('.m-entry-share .a-share-print a').click(function (e) {
  e.preventDefault();
  window.print();
});
$('.m-entry-share .a-share-copy-url a').click(function (e) {
  copyCurrentURL();
  tlite.show(e.target, {
    grav: 'w'
  });
  setTimeout(function () {
    tlite.hide(e.target);
  }, 3000);
  return false;
});
$('.m-entry-share .a-share-facebook a, .m-entry-share .a-share-twitter a, .m-entry-share .a-share-email a').click(function (e) {
  e.preventDefault();
  var url = $(this).attr('href');
  window.open(url, '_blank');
});
"use strict";

/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
//setupMenu( 'navigation-primary' );
//setupMenu( 'navigation-user-account-management' );
//setupNavSearch( 'navigation-primary' );
var navButton = document.querySelector('nav button');
var menu = navButton.nextElementSibling;
navButton.addEventListener('click', function () {
  var expanded = this.getAttribute('aria-expanded') === 'true' || false;
  this.setAttribute('aria-expanded', !expanded);
  var menu = this.nextElementSibling;
  menu.hidden = !menu.hidden;
}); // escape key press

$(document).keyup(function (e) {
  if (27 === e.keyCode) {
    navButton.setAttribute('aria-expanded', false); //let menu = navButton.nextElementSibling;

    menu.hidden = true;
  }
});

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAwLXN0YXJ0LmpzIiwiMDEtZm9udHMuanMiLCIwMi1hbmFseXRpY3MuanMiLCIwMy1zaGFyZS5qcyIsIjA0LW5hdmlnYXRpb24uanMiLCIwNS1mb3Jtcy5qcyIsIjA2LWNvbW1lbnRzLmpzIl0sIm5hbWVzIjpbInRsaXRlIiwidCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJpIiwidGFyZ2V0IiwibiIsInBhcmVudEVsZW1lbnQiLCJzaG93IiwidG9vbHRpcCIsIm8iLCJoaWRlIiwibCIsInIiLCJjbGFzc05hbWUiLCJzIiwib2Zmc2V0VG9wIiwib2Zmc2V0TGVmdCIsIm9mZnNldFBhcmVudCIsIm9mZnNldFdpZHRoIiwib2Zmc2V0SGVpZ2h0IiwiZCIsImYiLCJhIiwic3R5bGUiLCJ0b3AiLCJsZWZ0IiwiY3JlYXRlRWxlbWVudCIsImdyYXYiLCJnZXRBdHRyaWJ1dGUiLCJpbm5lckhUTUwiLCJhcHBlbmRDaGlsZCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImJvdHRvbSIsIndpbmRvdyIsImlubmVySGVpZ2h0IiwicmlnaHQiLCJpbm5lcldpZHRoIiwidGl0bGUiLCJzZXRBdHRyaWJ1dGUiLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwibW9kdWxlIiwiZXhwb3J0cyIsIiQiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwic2Vzc2lvblN0b3JhZ2UiLCJzZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsIiwic2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsIiwiZG9jdW1lbnRFbGVtZW50IiwiZyIsInB1c2giLCJsZW5ndGgiLCJtIiwic2hpZnQiLCJwIiwiYiIsInEiLCJjIiwidSIsIlR5cGVFcnJvciIsInRoZW4iLCJjYWxsIiwidiIsImgiLCJwcm90b3R5cGUiLCJ3IiwiayIsIngiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJhY2UiLCJhbGwiLCJhdHRhY2hFdmVudCIsImJvZHkiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVhZHlTdGF0ZSIsImRldGFjaEV2ZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJjc3NUZXh0IiwieiIsIndpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbFdpZHRoIiwiQSIsIkIiLCJmYW1pbHkiLCJ3ZWlnaHQiLCJzdHJldGNoIiwiQyIsIkQiLCJFIiwiRiIsIkciLCJKIiwidGVzdCIsIm5hdmlnYXRvciIsInZlbmRvciIsImV4ZWMiLCJ1c2VyQWdlbnQiLCJwYXJzZUludCIsImZvbnRzIiwiSyIsImZvbnQiLCJMIiwiam9pbiIsImxvYWQiLCJIIiwiRGF0ZSIsImdldFRpbWUiLCJNIiwiRXJyb3IiLCJOIiwieSIsIkkiLCJoaWRkZW4iLCJkaXIiLCJGb250RmFjZU9ic2VydmVyIiwic2Fuc05vcm1hbCIsInNhbnNCb2xkIiwic2Fuc05vcm1hbEl0YWxpYyIsInNlcmlmQm9vayIsInNlcmlmQm9va0l0YWxpYyIsInNlcmlmQm9sZCIsInNlcmlmQm9sZEl0YWxpYyIsInNlcmlmQmxhY2siLCJzZXJpZkJsYWNrSXRhbGljIiwibXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50IiwidHlwZSIsImNhdGVnb3J5IiwiYWN0aW9uIiwibGFiZWwiLCJ2YWx1ZSIsImdhIiwicmVhZHkiLCJQVU0iLCJjdXJyZW50X3BvcHVwIiwiZ2V0UG9wdXAiLCJzZXR0aW5ncyIsImdldFNldHRpbmdzIiwicG9wdXBfaWQiLCJpZCIsIm9uIiwiY2xvc2VfdHJpZ2dlciIsImZuIiwicG9wbWFrZSIsImxhc3RfY2xvc2VfdHJpZ2dlciIsImNsaWNrIiwidXJsIiwiYXR0ciIsIm1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSIsInVybF9hY2Nlc3NfbGV2ZWwiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiY3VycmVudF91c2VyIiwiY2FuX2FjY2VzcyIsInRyYWNrU2hhcmUiLCJ0ZXh0IiwicG9zaXRpb24iLCJqUXVlcnkiLCJoYXNDbGFzcyIsImNvcHlDdXJyZW50VVJMIiwiZHVtbXkiLCJocmVmIiwic2VsZWN0IiwiZXhlY0NvbW1hbmQiLCJkYXRhIiwicHJldmVudERlZmF1bHQiLCJwcmludCIsIm9wZW4iLCJuYXZCdXR0b24iLCJxdWVyeVNlbGVjdG9yIiwibWVudSIsIm5leHRFbGVtZW50U2libGluZyIsImV4cGFuZGVkIiwia2V5dXAiLCJrZXlDb2RlIiwic2V0dXBOYXZTZWFyY2giLCJjb250YWluZXIiLCJuYXZzZWFyY2hjb250YWluZXIiLCJuYXZzZWFyY2h0b2dnbGUiLCJuYXZzZWFyY2hmb3JtIiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImV2ZW50IiwiJHRhcmdldCIsImNsb3Nlc3QiLCJpcyIsInJlcGxhY2UiLCJwcm9wIiwiaW5kZXhPZiIsInNldHVwTWVudSIsImJ1dHRvbiIsImxpbmtzIiwibGVuIiwiZGlzcGxheSIsIm9uY2xpY2siLCJ0b2dnbGVGb2N1cyIsInRvdWNoU3RhcnRGbiIsInBhcmVudExpbmsiLCJxdWVyeVNlbGVjdG9yQWxsIiwibWVudUl0ZW0iLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImNoaWxkcmVuIiwicmVtb3ZlIiwiYWRkIiwic2VsZiIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsIndpZGdldF90aXRsZSIsImZpbmQiLCJ6b25lX3RpdGxlIiwic2lkZWJhcl9zZWN0aW9uX3RpdGxlIiwidG9nZ2xlQ2xhc3MiLCJ0ZXh0Tm9kZXMiLCJjb250ZW50cyIsImZpbHRlciIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSIsIm5vZGVWYWx1ZSIsInRyaW0iLCJnZXRDb25maXJtQ2hhbmdlTWFya3VwIiwibWFya3VwIiwibWFuYWdlRW1haWxzIiwiZm9ybSIsInJlc3Rfcm9vdCIsInVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QiLCJzaXRlX3VybCIsInJlc3RfbmFtZXNwYWNlIiwiZnVsbF91cmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheF9mb3JtX2RhdGEiLCJ0aGF0IiwidmFsIiwicGFyZW50IiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJpbmRleCIsImdldCIsInBhcmVudHMiLCJmYWRlT3V0IiwiY29uc29sZSIsImxvZyIsImJlZm9yZSIsImJ1dHRvbl9mb3JtIiwic3VibWl0dGluZ19idXR0b24iLCJzZXJpYWxpemUiLCJhamF4IiwiYmVmb3JlU2VuZCIsInhociIsInNldFJlcXVlc3RIZWFkZXIiLCJub25jZSIsImRhdGFUeXBlIiwiZG9uZSIsIm1hcCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiY2xpY2tfdmFsdWUiLCJjYXRlZ29yeV9wcmVmaXgiLCJjYXRlZ29yeV9zdWZmaXgiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiYWpheHVybCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImh0bWwiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLEtBQVQsQ0FBZUMsQ0FBZixFQUFpQjtBQUFDQyxFQUFBQSxRQUFRLENBQUNDLGdCQUFULENBQTBCLFdBQTFCLEVBQXNDLFVBQVNDLENBQVQsRUFBVztBQUFDLFFBQUlDLENBQUMsR0FBQ0QsQ0FBQyxDQUFDRSxNQUFSO0FBQUEsUUFBZUMsQ0FBQyxHQUFDTixDQUFDLENBQUNJLENBQUQsQ0FBbEI7QUFBc0JFLElBQUFBLENBQUMsS0FBR0EsQ0FBQyxHQUFDLENBQUNGLENBQUMsR0FBQ0EsQ0FBQyxDQUFDRyxhQUFMLEtBQXFCUCxDQUFDLENBQUNJLENBQUQsQ0FBM0IsQ0FBRCxFQUFpQ0UsQ0FBQyxJQUFFUCxLQUFLLENBQUNTLElBQU4sQ0FBV0os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O0FBQ0E7QUFDRDtBQWRLLEdBQVA7QUFnQkEsQ0E1QkQiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB0bGl0ZSh0KXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZSl7dmFyIGk9ZS50YXJnZXQsbj10KGkpO258fChuPShpPWkucGFyZW50RWxlbWVudCkmJnQoaSkpLG4mJnRsaXRlLnNob3coaSxuLCEwKX0pfXRsaXRlLnNob3c9ZnVuY3Rpb24odCxlLGkpe3ZhciBuPVwiZGF0YS10bGl0ZVwiO2U9ZXx8e30sKHQudG9vbHRpcHx8ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiBvKCl7dGxpdGUuaGlkZSh0LCEwKX1mdW5jdGlvbiBsKCl7cnx8KHI9ZnVuY3Rpb24odCxlLGkpe2Z1bmN0aW9uIG4oKXtvLmNsYXNzTmFtZT1cInRsaXRlIHRsaXRlLVwiK3Irczt2YXIgZT10Lm9mZnNldFRvcCxpPXQub2Zmc2V0TGVmdDtvLm9mZnNldFBhcmVudD09PXQmJihlPWk9MCk7dmFyIG49dC5vZmZzZXRXaWR0aCxsPXQub2Zmc2V0SGVpZ2h0LGQ9by5vZmZzZXRIZWlnaHQsZj1vLm9mZnNldFdpZHRoLGE9aStuLzI7by5zdHlsZS50b3A9KFwic1wiPT09cj9lLWQtMTA6XCJuXCI9PT1yP2UrbCsxMDplK2wvMi1kLzIpK1wicHhcIixvLnN0eWxlLmxlZnQ9KFwid1wiPT09cz9pOlwiZVwiPT09cz9pK24tZjpcIndcIj09PXI/aStuKzEwOlwiZVwiPT09cj9pLWYtMTA6YS1mLzIpK1wicHhcIn12YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxsPWkuZ3Jhdnx8dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRsaXRlXCIpfHxcIm5cIjtvLmlubmVySFRNTD1lLHQuYXBwZW5kQ2hpbGQobyk7dmFyIHI9bFswXXx8XCJcIixzPWxbMV18fFwiXCI7bigpO3ZhciBkPW8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuXCJzXCI9PT1yJiZkLnRvcDwwPyhyPVwiblwiLG4oKSk6XCJuXCI9PT1yJiZkLmJvdHRvbT53aW5kb3cuaW5uZXJIZWlnaHQ/KHI9XCJzXCIsbigpKTpcImVcIj09PXImJmQubGVmdDwwPyhyPVwid1wiLG4oKSk6XCJ3XCI9PT1yJiZkLnJpZ2h0PndpbmRvdy5pbm5lcldpZHRoJiYocj1cImVcIixuKCkpLG8uY2xhc3NOYW1lKz1cIiB0bGl0ZS12aXNpYmxlXCIsb30odCxkLGUpKX12YXIgcixzLGQ7cmV0dXJuIHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLG8pLHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIixvKSx0LnRvb2x0aXA9e3Nob3c6ZnVuY3Rpb24oKXtkPXQudGl0bGV8fHQuZ2V0QXR0cmlidXRlKG4pfHxkLHQudGl0bGU9XCJcIix0LnNldEF0dHJpYnV0ZShuLFwiXCIpLGQmJiFzJiYocz1zZXRUaW1lb3V0KGwsaT8xNTA6MSkpfSxoaWRlOmZ1bmN0aW9uKHQpe2lmKGk9PT10KXtzPWNsZWFyVGltZW91dChzKTt2YXIgZT1yJiZyLnBhcmVudE5vZGU7ZSYmZS5yZW1vdmVDaGlsZChyKSxyPXZvaWQgMH19fX0odCxlKSkuc2hvdygpfSx0bGl0ZS5oaWRlPWZ1bmN0aW9uKHQsZSl7dC50b29sdGlwJiZ0LnRvb2x0aXAuaGlkZShlKX0sXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz10bGl0ZSk7IiwiJCggJ2h0bWwnICkucmVtb3ZlQ2xhc3MoICduby1qcycgKS5hZGRDbGFzcyggJ2pzJyApOyIsIi8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5pZiAoIHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgJiYgc2Vzc2lvblN0b3JhZ2Uuc2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsICkge1xuXHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkIHNhbnMtZm9udHMtbG9hZGVkJztcbn0gZWxzZSB7XG5cdC8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4xLjAgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oZnVuY3Rpb24oKXsndXNlIHN0cmljdCc7dmFyIGYsZz1bXTtmdW5jdGlvbiBsKGEpe2cucHVzaChhKTsxPT1nLmxlbmd0aCYmZigpfWZ1bmN0aW9uIG0oKXtmb3IoO2cubGVuZ3RoOylnWzBdKCksZy5zaGlmdCgpfWY9ZnVuY3Rpb24oKXtzZXRUaW1lb3V0KG0pfTtmdW5jdGlvbiBuKGEpe3RoaXMuYT1wO3RoaXMuYj12b2lkIDA7dGhpcy5mPVtdO3ZhciBiPXRoaXM7dHJ5e2EoZnVuY3Rpb24oYSl7cShiLGEpfSxmdW5jdGlvbihhKXtyKGIsYSl9KX1jYXRjaChjKXtyKGIsYyl9fXZhciBwPTI7ZnVuY3Rpb24gdChhKXtyZXR1cm4gbmV3IG4oZnVuY3Rpb24oYixjKXtjKGEpfSl9ZnVuY3Rpb24gdShhKXtyZXR1cm4gbmV3IG4oZnVuY3Rpb24oYil7YihhKX0pfWZ1bmN0aW9uIHEoYSxiKXtpZihhLmE9PXApe2lmKGI9PWEpdGhyb3cgbmV3IFR5cGVFcnJvcjt2YXIgYz0hMTt0cnl7dmFyIGQ9YiYmYi50aGVuO2lmKG51bGwhPWImJlwib2JqZWN0XCI9PXR5cGVvZiBiJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBkKXtkLmNhbGwoYixmdW5jdGlvbihiKXtjfHxxKGEsYik7Yz0hMH0sZnVuY3Rpb24oYil7Y3x8cihhLGIpO2M9ITB9KTtyZXR1cm59fWNhdGNoKGUpe2N8fHIoYSxlKTtyZXR1cm59YS5hPTA7YS5iPWI7dihhKX19XG5cdGZ1bmN0aW9uIHIoYSxiKXtpZihhLmE9PXApe2lmKGI9PWEpdGhyb3cgbmV3IFR5cGVFcnJvcjthLmE9MTthLmI9Yjt2KGEpfX1mdW5jdGlvbiB2KGEpe2woZnVuY3Rpb24oKXtpZihhLmEhPXApZm9yKDthLmYubGVuZ3RoOyl7dmFyIGI9YS5mLnNoaWZ0KCksYz1iWzBdLGQ9YlsxXSxlPWJbMl0sYj1iWzNdO3RyeXswPT1hLmE/XCJmdW5jdGlvblwiPT10eXBlb2YgYz9lKGMuY2FsbCh2b2lkIDAsYS5iKSk6ZShhLmIpOjE9PWEuYSYmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGQ/ZShkLmNhbGwodm9pZCAwLGEuYikpOmIoYS5iKSl9Y2F0Y2goaCl7YihoKX19fSl9bi5wcm90b3R5cGUuZz1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5jKHZvaWQgMCxhKX07bi5wcm90b3R5cGUuYz1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXM7cmV0dXJuIG5ldyBuKGZ1bmN0aW9uKGQsZSl7Yy5mLnB1c2goW2EsYixkLGVdKTt2KGMpfSl9O1xuXHRmdW5jdGlvbiB3KGEpe3JldHVybiBuZXcgbihmdW5jdGlvbihiLGMpe2Z1bmN0aW9uIGQoYyl7cmV0dXJuIGZ1bmN0aW9uKGQpe2hbY109ZDtlKz0xO2U9PWEubGVuZ3RoJiZiKGgpfX12YXIgZT0wLGg9W107MD09YS5sZW5ndGgmJmIoaCk7Zm9yKHZhciBrPTA7azxhLmxlbmd0aDtrKz0xKXUoYVtrXSkuYyhkKGspLGMpfSl9ZnVuY3Rpb24geChhKXtyZXR1cm4gbmV3IG4oZnVuY3Rpb24oYixjKXtmb3IodmFyIGQ9MDtkPGEubGVuZ3RoO2QrPTEpdShhW2RdKS5jKGIsYyl9KX07d2luZG93LlByb21pc2V8fCh3aW5kb3cuUHJvbWlzZT1uLHdpbmRvdy5Qcm9taXNlLnJlc29sdmU9dSx3aW5kb3cuUHJvbWlzZS5yZWplY3Q9dCx3aW5kb3cuUHJvbWlzZS5yYWNlPXgsd2luZG93LlByb21pc2UuYWxsPXcsd2luZG93LlByb21pc2UucHJvdG90eXBlLnRoZW49bi5wcm90b3R5cGUuYyx3aW5kb3cuUHJvbWlzZS5wcm90b3R5cGVbXCJjYXRjaFwiXT1uLnByb3RvdHlwZS5nKTt9KCkpO1xuXG5cdChmdW5jdGlvbigpe2Z1bmN0aW9uIGwoYSxiKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2EuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLGIsITEpOmEuYXR0YWNoRXZlbnQoXCJzY3JvbGxcIixiKX1mdW5jdGlvbiBtKGEpe2RvY3VtZW50LmJvZHk/YSgpOmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbiBjKCl7ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixjKTthKCl9KTpkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGZ1bmN0aW9uIGsoKXtpZihcImludGVyYWN0aXZlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGV8fFwiY29tcGxldGVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZSlkb2N1bWVudC5kZXRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGspLGEoKX0pfTtmdW5jdGlvbiB0KGEpe3RoaXMuYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RoaXMuYS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKTt0aGlzLmEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYSkpO3RoaXMuYj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5oPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmc9LTE7dGhpcy5iLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmMuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO1xuXHR0aGlzLmYuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuaC5zdHlsZS5jc3NUZXh0PVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjt0aGlzLmIuYXBwZW5kQ2hpbGQodGhpcy5oKTt0aGlzLmMuYXBwZW5kQ2hpbGQodGhpcy5mKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5iKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5jKX1cblx0ZnVuY3Rpb24gdShhLGIpe2EuYS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6XCIrYitcIjtcIn1mdW5jdGlvbiB6KGEpe3ZhciBiPWEuYS5vZmZzZXRXaWR0aCxjPWIrMTAwO2EuZi5zdHlsZS53aWR0aD1jK1wicHhcIjthLmMuc2Nyb2xsTGVmdD1jO2EuYi5zY3JvbGxMZWZ0PWEuYi5zY3JvbGxXaWR0aCsxMDA7cmV0dXJuIGEuZyE9PWI/KGEuZz1iLCEwKTohMX1mdW5jdGlvbiBBKGEsYil7ZnVuY3Rpb24gYygpe3ZhciBhPWs7eihhKSYmYS5hLnBhcmVudE5vZGUmJmIoYS5nKX12YXIgaz1hO2woYS5iLGMpO2woYS5jLGMpO3ooYSl9O2Z1bmN0aW9uIEIoYSxiKXt2YXIgYz1ifHx7fTt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwifXZhciBDPW51bGwsRD1udWxsLEU9bnVsbCxGPW51bGw7ZnVuY3Rpb24gRygpe2lmKG51bGw9PT1EKWlmKEooKSYmL0FwcGxlLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKSl7dmFyIGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO0Q9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCl9ZWxzZSBEPSExO3JldHVybiBEfWZ1bmN0aW9uIEooKXtudWxsPT09RiYmKEY9ISFkb2N1bWVudC5mb250cyk7cmV0dXJuIEZ9XG5cdGZ1bmN0aW9uIEsoKXtpZihudWxsPT09RSl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0cnl7YS5zdHlsZS5mb250PVwiY29uZGVuc2VkIDEwMHB4IHNhbnMtc2VyaWZcIn1jYXRjaChiKXt9RT1cIlwiIT09YS5zdHlsZS5mb250fXJldHVybiBFfWZ1bmN0aW9uIEwoYSxiKXtyZXR1cm5bYS5zdHlsZSxhLndlaWdodCxLKCk/YS5zdHJldGNoOlwiXCIsXCIxMDBweFwiLGJdLmpvaW4oXCIgXCIpfVxuXHRCLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxrPWF8fFwiQkVTYnN3eVwiLHI9MCxuPWJ8fDNFMyxIPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2lmKEooKSYmIUcoKSl7dmFyIE09bmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBlKCl7KG5ldyBEYXRlKS5nZXRUaW1lKCktSD49bj9iKEVycm9yKFwiXCIrbitcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpOmRvY3VtZW50LmZvbnRzLmxvYWQoTChjLCdcIicrYy5mYW1pbHkrJ1wiJyksaykudGhlbihmdW5jdGlvbihjKXsxPD1jLmxlbmd0aD9hKCk6c2V0VGltZW91dChlLDI1KX0sYil9ZSgpfSksTj1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGMpe3I9c2V0VGltZW91dChmdW5jdGlvbigpe2MoRXJyb3IoXCJcIituK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSl9LG4pfSk7UHJvbWlzZS5yYWNlKFtOLE1dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHIpO2EoYyl9LFxuXHRiKX1lbHNlIG0oZnVuY3Rpb24oKXtmdW5jdGlvbiB2KCl7dmFyIGI7aWYoYj0tMSE9ZiYmLTEhPWd8fC0xIT1mJiYtMSE9aHx8LTEhPWcmJi0xIT1oKShiPWYhPWcmJmYhPWgmJmchPWgpfHwobnVsbD09PUMmJihiPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSxDPSEhYiYmKDUzNj5wYXJzZUludChiWzFdLDEwKXx8NTM2PT09cGFyc2VJbnQoYlsxXSwxMCkmJjExPj1wYXJzZUludChiWzJdLDEwKSkpLGI9QyYmKGY9PXcmJmc9PXcmJmg9PXd8fGY9PXgmJmc9PXgmJmg9PXh8fGY9PXkmJmc9PXkmJmg9PXkpKSxiPSFiO2ImJihkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxjbGVhclRpbWVvdXQociksYShjKSl9ZnVuY3Rpb24gSSgpe2lmKChuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PW4pZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksYihFcnJvcihcIlwiK1xuXHRuK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLGc9cC5hLm9mZnNldFdpZHRoLGg9cS5hLm9mZnNldFdpZHRoLHYoKTtyPXNldFRpbWVvdXQoSSw1MCl9fXZhciBlPW5ldyB0KGspLHA9bmV3IHQoaykscT1uZXcgdChrKSxmPS0xLGc9LTEsaD0tMSx3PS0xLHg9LTEseT0tMSxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5kaXI9XCJsdHJcIjt1KGUsTChjLFwic2Fucy1zZXJpZlwiKSk7dShwLEwoYyxcInNlcmlmXCIpKTt1KHEsTChjLFwibW9ub3NwYWNlXCIpKTtkLmFwcGVuZENoaWxkKGUuYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2QuYXBwZW5kQ2hpbGQocS5hKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO3c9ZS5hLm9mZnNldFdpZHRoO3g9cC5hLm9mZnNldFdpZHRoO3k9cS5hLm9mZnNldFdpZHRoO0koKTtBKGUsZnVuY3Rpb24oYSl7Zj1hO3YoKX0pO3UoZSxcblx0TChjLCdcIicrYy5mYW1pbHkrJ1wiLHNhbnMtc2VyaWYnKSk7QShwLGZ1bmN0aW9uKGEpe2c9YTt2KCl9KTt1KHAsTChjLCdcIicrYy5mYW1pbHkrJ1wiLHNlcmlmJykpO0EocSxmdW5jdGlvbihhKXtoPWE7digpfSk7dShxLEwoYywnXCInK2MuZmFtaWx5KydcIixtb25vc3BhY2UnKSl9KX0pfTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1COih3aW5kb3cuRm9udEZhY2VPYnNlcnZlcj1CLHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkPUIucHJvdG90eXBlLmxvYWQpO30oKSk7XG5cblx0Ly8gbWlubnBvc3QgZm9udHNcblxuXHQvLyBzYW5zXG5cdHZhciBzYW5zTm9ybWFsID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoICdmZi1tZXRhLXdlYi1wcm8nICk7XG5cdHZhciBzYW5zQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNhbnNOb3JtYWxJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA0MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cblx0Ly8gc2VyaWZcblx0dmFyIHNlcmlmQm9vayA9IG5ldyBGb250RmFjZU9ic2VydmVyKCBcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA1MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvb2tJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA1MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvbGQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvbGRJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJsYWNrID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogOTAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCbGFja0l0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDkwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblxuXHRQcm9taXNlLmFsbCggW1xuXHRcdHNhbnNOb3JtYWwubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zTm9ybWFsSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvb2subG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9va0l0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvbGRJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQmxhY2subG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQmxhY2tJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApXG5cdF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkJztcblx0XHQvLyBPcHRpbWl6YXRpb24gZm9yIFJlcGVhdCBWaWV3c1xuXHRcdHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG5cblx0UHJvbWlzZS5hbGwoIFtcblx0XHRzYW5zTm9ybWFsLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zQm9sZC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc05vcm1hbEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwIClcblx0XSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzYW5zLWZvbnRzLWxvYWRlZCc7XG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG59XG5cbiIsImZ1bmN0aW9uIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHZhbHVlICkge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggZSApIHtcblxuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgUFVNICkge1xuXHRcdHZhciBjdXJyZW50X3BvcHVwID0gUFVNLmdldFBvcHVwKCAkKCAnLnB1bScgKSApO1xuXHRcdHZhciBzZXR0aW5ncyA9IFBVTS5nZXRTZXR0aW5ncyggJCggJy5wdW0nICkgKTtcblx0XHR2YXIgcG9wdXBfaWQgPSBzZXR0aW5ncy5pZDtcblx0XHQkKCBkb2N1bWVudCApLm9uKCAncHVtQWZ0ZXJPcGVuJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdTaG93JywgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9KTtcblx0XHR9KTtcblx0XHQkKCBkb2N1bWVudCApLm9uKCAncHVtQWZ0ZXJDbG9zZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGNsb3NlX3RyaWdnZXIgPSAkLmZuLnBvcG1ha2UubGFzdF9jbG9zZV90cmlnZ2VyO1xuXHRcdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGNsb3NlX3RyaWdnZXIgKSB7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgY2xvc2VfdHJpZ2dlciwgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkKCAnLm1lc3NhZ2UtY2xvc2UnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBsaW5rIHdpdGggY2xvc2UgY2xhc3Ncblx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJ0Nsb3NlIEJ1dHRvbic7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSk7XG5cdFx0fSk7XG5cdFx0JCggJy5tZXNzYWdlLWxvZ2luJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGxvZ2luIGNsYXNzXG5cdFx0XHR2YXIgdXJsID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnTG9naW4gTGluaycsIHVybCApO1xuXHRcdH0pO1xuXHRcdCQoICcucHVtLWNvbnRlbnQgYTpub3QoIC5tZXNzYWdlLWNsb3NlLCAucHVtLWNsb3NlLCAubWVzc2FnZS1sb2dpbiApJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3Mgc29tZXRoaW5nIHRoYXQgaXMgbm90IGNsb3NlIHRleHQgb3IgY2xvc2UgaWNvblxuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnQ2xpY2snLCBwb3B1cF9pZCApO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSAmJiAnJyAhPT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLnVybF9hY2Nlc3NfbGV2ZWwgKSB7XG5cdFx0dmFyIHR5cGUgPSAnZXZlbnQnO1xuXHRcdHZhciBjYXRlZ29yeSA9ICdNZW1iZXIgQ29udGVudCc7XG5cdFx0dmFyIGxhYmVsID0gbG9jYXRpb24ucGF0aG5hbWU7IC8vIGkgdGhpbmsgd2UgY291bGQgcG9zc2libHkgcHV0IHNvbWUgZ3JvdXBpbmcgaGVyZSwgYnV0IHdlIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYWNjZXNzIHRvIG9uZSBhbmQgbWF5YmUgaXQncyBub3Qgd29ydGh3aGlsZSB5ZXRcblx0XHR2YXIgYWN0aW9uID0gJ0Jsb2NrZWQnO1xuXHRcdGlmICggdHJ1ZSA9PT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLmN1cnJlbnRfdXNlci5jYW5fYWNjZXNzICkge1xuXHRcdFx0YWN0aW9uID0gJ1Nob3duJztcblx0XHR9XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHR9XG59KTtcbiIsImZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uID0gJycgKSB7XG5cblx0Ly8gaWYgYSBub3QgbG9nZ2VkIGluIHVzZXIgdHJpZXMgdG8gZW1haWwsIGRvbid0IGNvdW50IHRoYXQgYXMgYSBzaGFyZVxuXHRpZiAoICEgalF1ZXJ5KCAnYm9keScgKS5oYXNDbGFzcyggJ2xvZ2dlZC1pbicgKSAmJiAnRW1haWwnID09PSB0ZXh0ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBjYXRlZ29yeSA9ICdTaGFyZSc7XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdGNhdGVnb3J5ID0gJ1NoYXJlIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cblx0Ly8gdHJhY2sgYXMgYW4gZXZlbnQsIGFuZCBhcyBzb2NpYWwgaWYgaXQgaXMgdHdpdHRlciBvciBmYlxuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsIGNhdGVnb3J5LCB0ZXh0LCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0IHx8ICdUd2l0dGVyJyA9PT0gdGV4dCApIHtcblx0XHRcdGlmICggJ0ZhY2Vib29rJyA9PSB0ZXh0ICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZnVuY3Rpb24gY29weUN1cnJlbnRVUkwoKSB7XG5cdHZhciBkdW1teSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdpbnB1dCcgKSwgdGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkdW1teSApO1xuXHRkdW1teS52YWx1ZSA9IHRleHQ7XG5cdGR1bW15LnNlbGVjdCgpO1xuXHRkb2N1bWVudC5leGVjQ29tbWFuZCggJ2NvcHknICk7XG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoIGR1bW15ICk7XG59XG5cbiQoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLmRhdGEoICdzaGFyZS1hY3Rpb24nICk7XG5cdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSk7XG5cbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1wcmludCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR3aW5kb3cucHJpbnQoKTtcbn0pO1xuXG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtY29weS11cmwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGNvcHlDdXJyZW50VVJMKCk7XG5cdHRsaXRlLnNob3coICggZS50YXJnZXQgKSwgeyBncmF2OiAndycgfSApO1xuXHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHR0bGl0ZS5oaWRlKCAoIGUudGFyZ2V0ICkgKTtcblx0fSwgMzAwMCApO1xuXHRyZXR1cm4gZmFsc2U7XG59KTtcblxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWZhY2Vib29rIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXR3aXR0ZXIgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZW1haWwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0dmFyIHVybCA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcbiAgICB3aW5kb3cub3BlbiggdXJsLCAnX2JsYW5rJyApO1xufSk7XG4iLCIvKipcbiAqIEZpbGUgbmF2aWdhdGlvbi5qcy5cbiAqXG4gKiBIYW5kbGVzIHRvZ2dsaW5nIHRoZSBuYXZpZ2F0aW9uIG1lbnUgZm9yIHNtYWxsIHNjcmVlbnMgYW5kIGVuYWJsZXMgVEFCIGtleVxuICogbmF2aWdhdGlvbiBzdXBwb3J0IGZvciBkcm9wZG93biBtZW51cy5cbiAqL1xuXG4vL3NldHVwTWVudSggJ25hdmlnYXRpb24tcHJpbWFyeScgKTtcbi8vc2V0dXBNZW51KCAnbmF2aWdhdGlvbi11c2VyLWFjY291bnQtbWFuYWdlbWVudCcgKTtcbi8vc2V0dXBOYXZTZWFyY2goICduYXZpZ2F0aW9uLXByaW1hcnknICk7XG5cbnZhciBuYXZCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IGJ1dHRvbicgKTtcbmxldCBtZW51ID0gbmF2QnV0dG9uLm5leHRFbGVtZW50U2libGluZztcbm5hdkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgZXhwYW5kZWQgPSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJyB8fCBmYWxzZTtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgbGV0IG1lbnUgPSB0aGlzLm5leHRFbGVtZW50U2libGluZztcbiAgICBtZW51LmhpZGRlbiA9ICEgbWVudS5oaWRkZW47XG59KTtcbi8vIGVzY2FwZSBrZXkgcHJlc3NcbiQoZG9jdW1lbnQpLmtleXVwKGZ1bmN0aW9uKGUpIHtcblx0aWYgKDI3ID09PSBlLmtleUNvZGUpIHtcblx0XHRuYXZCdXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0Ly9sZXQgbWVudSA9IG5hdkJ1dHRvbi5uZXh0RWxlbWVudFNpYmxpbmc7XG5cdFx0bWVudS5oaWRkZW4gPSB0cnVlO1xuXHR9XG59KTtcblxuZnVuY3Rpb24gc2V0dXBOYXZTZWFyY2goIGNvbnRhaW5lciApIHtcblxuXHR2YXIgbmF2c2VhcmNoY29udGFpbmVyLCBuYXZzZWFyY2h0b2dnbGUsIG5hdnNlYXJjaGZvcm07XG5cblx0Y29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGNvbnRhaW5lciApO1xuXHRpZiAoICEgY29udGFpbmVyICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG5hdnNlYXJjaGNvbnRhaW5lciA9ICQoICdsaS5zZWFyY2gnLCAkKCBjb250YWluZXIgKSApO1xuXHRuYXZzZWFyY2h0b2dnbGUgICAgPSAkKCAnbGkuc2VhcmNoIGEnLCAkKCBjb250YWluZXIgKSApO1xuXHRuYXZzZWFyY2hmb3JtICAgICAgPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdmb3JtJyApWzBdO1xuXG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBuYXZzZWFyY2h0b2dnbGUgfHwgJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBuYXZzZWFyY2hmb3JtICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmICggMCA8ICQoIG5hdnNlYXJjaGZvcm0gKS5sZW5ndGggKSB7XG5cdFx0JCggZG9jdW1lbnQgKS5jbGljayggZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0dmFyICR0YXJnZXQgPSAkKCBldmVudC50YXJnZXQgKTtcblx0XHRcdGlmICggISAkdGFyZ2V0LmNsb3Nlc3QoIG5hdnNlYXJjaGNvbnRhaW5lciApLmxlbmd0aCAmJiAkKCBuYXZzZWFyY2hmb3JtICkuaXMoICc6dmlzaWJsZScgKSApIHtcblx0XHRcdFx0bmF2c2VhcmNoZm9ybS5jbGFzc05hbWUgPSBuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZS5yZXBsYWNlKCAnIHRvZ2dsZWQtZm9ybScsICcnICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnByb3AoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucmVtb3ZlQ2xhc3MoICd0b2dnbGVkLWZvcm0nICk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JCggbmF2c2VhcmNodG9nZ2xlICkub24oICdjbGljaycsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRpZiAoIC0xICE9PSBuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZC1mb3JtJyApICkge1xuXHRcdFx0XHRuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZSA9IG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lLnJlcGxhY2UoICcgdG9nZ2xlZC1mb3JtJywgJycgKTtcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucHJvcCggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5yZW1vdmVDbGFzcyggJ3RvZ2dsZWQtZm9ybScgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lICs9ICcgdG9nZ2xlZC1mb3JtJztcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucHJvcCggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLmFkZENsYXNzKCAndG9nZ2xlZC1mb3JtJyApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNldHVwTWVudSggY29udGFpbmVyICkge1xuXHR2YXIgYnV0dG9uLCBtZW51LCBsaW5rcywgaSwgbGVuO1xuXHRjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggY29udGFpbmVyICk7XG5cdGlmICggISBjb250YWluZXIgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0YnV0dG9uID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYnV0dG9uJyApWzBdO1xuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgYnV0dG9uICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1lbnUgPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICd1bCcgKVswXTtcblxuXHQvLyBIaWRlIG1lbnUgdG9nZ2xlIGJ1dHRvbiBpZiBtZW51IGlzIGVtcHR5IGFuZCByZXR1cm4gZWFybHkuXG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBtZW51ICkge1xuXHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0aWYgKCAtMSA9PT0gbWVudS5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cdFx0bWVudS5jbGFzc05hbWUgKz0gJyBtZW51Jztcblx0fVxuXG5cdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCAtMSAhPT0gY29udGFpbmVyLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZCcgKSApIHtcblx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgPSBjb250YWluZXIuY2xhc3NOYW1lLnJlcGxhY2UoICcgdG9nZ2xlZCcsICcnICk7XG5cdFx0XHRidXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSArPSAnIHRvZ2dsZWQnO1xuXHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyApO1xuXHRcdH1cblx0fTtcblxuXHQvLyBHZXQgYWxsIHRoZSBsaW5rIGVsZW1lbnRzIHdpdGhpbiB0aGUgbWVudS5cblx0bGlua3MgICAgPSBtZW51LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYScgKTtcblxuXHQvLyBFYWNoIHRpbWUgYSBtZW51IGxpbmsgaXMgZm9jdXNlZCBvciBibHVycmVkLCB0b2dnbGUgZm9jdXMuXG5cdGZvciAoIGkgPSAwLCBsZW4gPSBsaW5rcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCAnZm9jdXMnLCB0b2dnbGVGb2N1cywgdHJ1ZSApO1xuXHRcdGxpbmtzW2ldLmFkZEV2ZW50TGlzdGVuZXIoICdibHVyJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUb2dnbGVzIGBmb2N1c2AgY2xhc3MgdG8gYWxsb3cgc3VibWVudSBhY2Nlc3Mgb24gdGFibGV0cy5cblx0ICovXG5cdCggZnVuY3Rpb24oIGNvbnRhaW5lciApIHtcblx0XHR2YXIgdG91Y2hTdGFydEZuLCBpLFxuXHRcdFx0cGFyZW50TGluayA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCAnLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4gPiBhLCAucGFnZV9pdGVtX2hhc19jaGlsZHJlbiA+IGEnICk7XG5cblx0XHRpZiAoICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyApIHtcblx0XHRcdHRvdWNoU3RhcnRGbiA9IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHR2YXIgbWVudUl0ZW0gPSB0aGlzLnBhcmVudE5vZGUsXG5cdFx0XHRcdFx0aTtcblxuXHRcdFx0XHRpZiAoICEgbWVudUl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCAnZm9jdXMnICkgKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgbWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbi5sZW5ndGg7ICsraSApIHtcblx0XHRcdFx0XHRcdGlmICggbWVudUl0ZW0gPT09IG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW5baV0pIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LmFkZCggJ2ZvY3VzJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1lbnVJdGVtLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBwYXJlbnRMaW5rLmxlbmd0aDsgKytpICkge1xuXHRcdFx0XHRwYXJlbnRMaW5rW2ldLmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hTdGFydEZuLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSggY29udGFpbmVyICkgKTtcbn1cblxuLyoqXG4gKiBTZXRzIG9yIHJlbW92ZXMgLmZvY3VzIGNsYXNzIG9uIGFuIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUZvY3VzKCkge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0Ly8gTW92ZSB1cCB0aHJvdWdoIHRoZSBhbmNlc3RvcnMgb2YgdGhlIGN1cnJlbnQgbGluayB1bnRpbCB3ZSBoaXQgLm5hdi1tZW51LlxuXHR3aGlsZSAoIC0xID09PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnbWVudScgKSApIHtcblxuXHRcdC8vIE9uIGxpIGVsZW1lbnRzIHRvZ2dsZSB0aGUgY2xhc3MgLmZvY3VzLlxuXHRcdGlmICggJ2xpJyA9PT0gc2VsZi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgKSB7XG5cdFx0XHRpZiAoIC0xICE9PSBzZWxmLmNsYXNzTmFtZS5pbmRleE9mKCAnZm9jdXMnICkgKSB7XG5cdFx0XHRcdHNlbGYuY2xhc3NOYW1lID0gc2VsZi5jbGFzc05hbWUucmVwbGFjZSggJyBmb2N1cycsICcnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWxmLmNsYXNzTmFtZSArPSAnIGZvY3VzJztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRzZWxmID0gc2VsZi5wYXJlbnRFbGVtZW50O1xuXHR9XG59XG5cbiQoICcjbmF2aWdhdGlvbi1mZWF0dXJlZCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnRmVhdHVyZWQgQmFyIExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcbn0pO1xuXG4kKCAnYS5nbGVhbi1zaWRlYmFyJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBTdXBwb3J0IExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcbn0pO1xuXG4kKCAnYScsICQoICcuby1zaXRlLXNpZGViYXInICkgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdHZhciB3aWRnZXRfdGl0bGUgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXdpZGdldCcgKS5maW5kKCAnaDMnICkudGV4dCgpO1xuXHR2YXIgem9uZV90aXRsZSAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS16b25lJyApLmZpbmQoICcuYS16b25lLXRpdGxlJyApLnRleHQoKTtcblx0dmFyIHNpZGViYXJfc2VjdGlvbl90aXRsZSA9ICcnO1xuXHRpZiAoICcnICE9PSB3aWRnZXRfdGl0bGUgKSB7XG5cdFx0c2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gd2lkZ2V0X3RpdGxlO1xuXHR9IGVsc2UgaWYgKCAnJyAhPT0gem9uZV90aXRsZSApIHtcblx0XHRzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSB6b25lX3RpdGxlO1xuXHR9XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJfc2VjdGlvbl90aXRsZSApO1xufSk7XG5cbi8vIHVzZXIgYWNjb3VudCBuYXZpZ2F0aW9uIGNhbiBiZSBhIGRyb3Bkb3duXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblxuXHQvLyBoaWRlIG1lbnVcblx0aWYgKCAwIDwgJCggJyN1c2VyLWFjY291bnQtYWNjZXNzIHVsJyApLmxlbmd0aCApIHtcblx0XHQkKCAnI3VzZXItYWNjb3VudC1hY2Nlc3MgPiBsaSA+IGEnICkub24oICdjbGljaycsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdCQoICcjdXNlci1hY2NvdW50LWFjY2VzcyB1bCcgKS50b2dnbGVDbGFzcyggJ3Zpc2libGUnICk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0pO1xuXHR9XG59KTtcbiIsIlxualF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICggdGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgJycgIT09IHRoaXMubm9kZVZhbHVlLnRyaW0oKSApO1xuXHR9KTtcbn07XG5cbmZ1bmN0aW9uIGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoIGFjdGlvbiApIHtcblx0dmFyIG1hcmt1cCA9ICc8bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLWZvcm0tY29uZmlybVwiPjxsYWJlbD5BcmUgeW91IHN1cmU/IDxhIGlkPVwiYS1jb25maXJtLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ZZXM8L2E+IHwgPGEgaWQ9XCJhLXN0b3AtJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPk5vPC9hPjwvbGFiZWw+PC9saT4nO1xuXHRyZXR1cm4gbWFya3VwO1xufVxuXG5mdW5jdGlvbiBtYW5hZ2VFbWFpbHMoKSB7XG5cdHZhciBmb3JtICAgICAgICAgICAgICAgPSAkKCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScgKTtcblx0dmFyIHJlc3Rfcm9vdCAgICAgICAgICA9IHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Quc2l0ZV91cmwgKyB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnJlc3RfbmFtZXNwYWNlO1xuXHR2YXIgZnVsbF91cmwgICAgICAgICAgID0gcmVzdF9yb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdHZhciBjb25maXJtQ2hhbmdlICAgICAgPSAnJztcblx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdHZhciBuZXdQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIG9sZFByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0dmFyIGNvbnNvbGlkYXRlZEVtYWlscyA9IFtdO1xuXHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdHZhciBhamF4X2Zvcm1fZGF0YSAgICAgPSAnJztcblx0dmFyIHRoYXQgICAgICAgICAgICAgICA9ICcnO1xuXG5cdC8vIHN0YXJ0IG91dCB3aXRoIG5vIHByaW1hcnkvcmVtb3ZhbHMgY2hlY2tlZFxuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHQvLyBpZiB0aGVyZSBpcyBhIGxpc3Qgb2YgZW1haWxzIChub3QganVzdCBhIHNpbmdsZSBmb3JtIGZpZWxkKVxuXHRpZiAoIDAgPCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cblx0XHQvLyBpZiBhIHVzZXIgc2VsZWN0cyBhIG5ldyBwcmltYXJ5LCBtb3ZlIGl0IGludG8gdGhhdCBwb3NpdGlvblxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0XHRuZXdQcmltYXJ5RW1haWwgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRvbGRQcmltYXJ5RW1haWwgPSAkKCAnI2VtYWlsJyApLnZhbCgpO1xuXHRcdFx0cHJpbWFyeUlkICAgICAgID0gJCggdGhpcyApLnByb3AoICdpZCcgKS5yZXBsYWNlKCAncHJpbWFyeV9lbWFpbF8nLCAnJyApO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3ByaW1hcnktY2hhbmdlJyApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cblx0XHRcdC8vJCggdGhpcyApLnBhcmVudCgpLmFmdGVyKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgdXNlciBmYWNpbmcgdmFsdWVzXG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBuZXdQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyN1c2VyLWVtYWlsLScgKyBwcmltYXJ5SWQgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIG1haW4gaGlkZGVuIGZvcm0gdmFsdWVcblx0XHRcdFx0JCggJyNlbWFpbCcgKS52YWwoIG5ld1ByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHN1Ym1pdCBmb3JtIHZhbHVlcy5cblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblxuXHRcdFx0XHQvLyB1bmNoZWNrIHRoZSByYWRpbyBidXR0b25cblx0XHRcdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgZm9ybSB2YWx1ZXMgdG8gdGhlIG9sZCBwcmltYXJ5IGVtYWlsXG5cdFx0XHRcdCQoICcjcHJpbWFyeV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyNyZW1vdmVfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIHRoZSBjb25maXJtIG1lc3NhZ2Vcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdC8vIGlmIGEgdXNlciByZW1vdmVzIGFuIGVtYWlsLCB0YWtlIGl0IGF3YXkgZnJvbSB0aGUgdmlzdWFsIGFuZCBmcm9tIHRoZSBmb3JtXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NoYW5nZScsICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZW1haWxUb1JlbW92ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdyZW1vdmFsJyApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgIT09IGVtYWlsVG9SZW1vdmUgKSB7XG5cdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyIGZvciByZW1vdmFsXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQvLyBpZiBjb25maXJtZWQsIHJlbW92ZSB0aGUgZW1haWwgYW5kIHN1Ym1pdCB0aGUgZm9ybVxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5mYWRlT3V0KCAnbm9ybWFsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLnJlbW92ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRjb25zb2xlLmxvZyggJ3ZhbHVlIGlzICcgKyBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnICkuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvbiBhLWJ1dHRvbi1hZGQtdXNlci1lbWFpbFwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRuZXh0RW1haWxDb3VudCsrO1xuXHR9KTtcblxuXHQkKCAnaW5wdXRbdHlwZT1zdWJtaXRdJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgYnV0dG9uID0gJCggdGhpcyApO1xuXHRcdHZhciBidXR0b25fZm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCAnZm9ybScgKTtcblx0XHRidXR0b25fZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nLCBidXR0b24udmFsKCkgKTtcblx0fSk7XG5cblx0JCggJy5tLWVudHJ5LWNvbnRlbnQnICkub24oICdzdWJtaXQnLCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgZm9ybSA9ICQoIHRoaXMgKTtcblx0XHR2YXIgc3VibWl0dGluZ19idXR0b24gPSBmb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicgKSB8fCAnJztcblxuXHRcdC8vIGlmIHRoZXJlIGlzIG5vIHN1Ym1pdHRpbmcgYnV0dG9uLCBwYXNzIGl0IGJ5IEFqYXhcblx0XHRpZiAoICcnID09PSBzdWJtaXR0aW5nX2J1dHRvbiB8fCAnU2F2ZSBDaGFuZ2VzJyAhPT0gc3VibWl0dGluZ19idXR0b24gKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4X2Zvcm1fZGF0YSA9IGFqYXhfZm9ybV9kYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dXJsOiBmdWxsX3VybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xuXHRcdFx0ICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Lm5vbmNlICk7XG5cdFx0XHQgICAgfSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0ZGF0YTogYWpheF9mb3JtX2RhdGFcblx0XHRcdH0pLmRvbmUoIGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0XHRuZXdFbWFpbHMgPSAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHR9KS5nZXQoKTtcblx0XHRcdFx0JC5lYWNoKCBuZXdFbWFpbHMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSBuZXh0RW1haWxDb3VudCArIGluZGV4O1xuXHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkuYXBwZW5kKCAnPGxpIGlkPVwidXNlci1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtZW1haWwtcHJlZmVyZW5jZXNcIj48YSBocmVmPVwiL25ld3NsZXR0ZXJzLz9lbWFpbD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCB2YWx1ZSApICsgJ1wiPjxzbWFsbD5FbWFpbCBQcmVmZXJlbmNlczwvc21hbGw+PC9hPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLXJlbW92ZS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwicmVtb3ZlX2VtYWlsWycgKyBuZXh0RW1haWxDb3VudCArICddXCIgaWQ9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5SZW1vdmU8L3NtYWxsPjwvbGFiZWw+PC9saT48L3VsPjwvbGk+JyApO1xuXHRcdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCAkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCgpICsgJywnICsgdmFsdWUgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcubS1mb3JtLWNoYW5nZS1lbWFpbCAuYS1pbnB1dC13aXRoLWJ1dHRvbicgKS5yZW1vdmUoKTtcblx0XHRcdFx0aWYgKCAwID09PSAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKSAhPT0gJCggJ2lucHV0W25hbWU9XCJlbWFpbFwiXScgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gaXQgd291bGQgYmUgbmljZSB0byBvbmx5IGxvYWQgdGhlIGZvcm0sIGJ1dCB0aGVuIGNsaWNrIGV2ZW50cyBzdGlsbCBkb24ndCB3b3JrXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICggMCA8ICQoICcubS1mb3JtLWVtYWlsJyApLmxlbmd0aCApIHtcblx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0fVxufSk7XG4iLCIvLyBiYXNlZCBvbiB3aGljaCBidXR0b24gd2FzIGNsaWNrZWQsIHNldCB0aGUgdmFsdWVzIGZvciB0aGUgYW5hbHl0aWNzIGV2ZW50IGFuZCBjcmVhdGUgaXRcbmZ1bmN0aW9uIHRyYWNrU2hvd0NvbW1lbnRzKCBhbHdheXMsIGlkLCBjbGlja192YWx1ZSApIHtcblx0dmFyIGFjdGlvbiAgICAgICAgICA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlfcHJlZml4ID0gJyc7XG5cdHZhciBjYXRlZ29yeV9zdWZmaXggPSAnJztcblx0dmFyIHBvc2l0aW9uICAgICAgICA9ICcnO1xuXHRwb3NpdGlvbiA9IGlkLnJlcGxhY2UoICdhbHdheXMtc2hvdy1jb21tZW50cy0nLCAnJyApO1xuXHRpZiAoICcxJyA9PT0gY2xpY2tfdmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09uJztcblx0fSBlbHNlIGlmICggJzAnID09PSBjbGlja192YWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5X3ByZWZpeCA9ICdBbHdheXMgJztcblx0fVxuXHRpZiAoICcnICE9PSBwb3NpdGlvbiApIHtcblx0XHRwb3NpdGlvbiA9IHBvc2l0aW9uLmNoYXJBdCggMCApLnRvVXBwZXJDYXNlKCkgKyBwb3NpdGlvbi5zbGljZSggMSApO1xuXHRcdGNhdGVnb3J5X3N1ZmZpeCA9ICcgLSAnICsgcG9zaXRpb247XG5cdH1cblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeV9wcmVmaXggKyAnU2hvdyBDb21tZW50cycgKyBjYXRlZ29yeV9zdWZmaXgsIGFjdGlvbiwgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn1cblxuLy8gd2hlbiBzaG93aW5nIGNvbW1lbnRzIG9uY2UsIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWJ1dHRvbi1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCBmYWxzZSwgJycsICcnICk7XG59KTtcblxuLy8gU2V0IHVzZXIgbWV0YSB2YWx1ZSBmb3IgYWx3YXlzIHNob3dpbmcgY29tbWVudHMgaWYgdGhhdCBidXR0b24gaXMgY2xpY2tlZFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHZhciB0aGF0ID0gJCggdGhpcyApO1xuXHRpZiAoIHRoYXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gZWxzZSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuXHR0cmFja1Nob3dDb21tZW50cyggdHJ1ZSwgdGhhdC5hdHRyKCAnaWQnICksIHRoYXQudmFsKCkgKTtcblxuXHQvLyB3ZSBhbHJlYWR5IGhhdmUgYWpheHVybCBmcm9tIHRoZSB0aGVtZVxuXHQkLmFqYXgoe1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHR1cmw6IGFqYXh1cmwsXG5cdFx0ZGF0YToge1xuICAgICAgICBcdCdhY3Rpb24nOiAnbWlubnBvc3RfbGFyZ29fbG9hZF9jb21tZW50c19zZXRfdXNlcl9tZXRhJyxcbiAgICAgICAgXHQndmFsdWUnOiB0aGF0LnZhbCgpXG5cdFx0fSxcblx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG4gICAgICAgIFx0JCggJy5hLWFsd2F5cy1zaG93LWNvbW1lbnRzLXJlc3VsdCcsIHRoYXQucGFyZW50KCkgKS5odG1sKCByZXNwb25zZS5kYXRhLm1lc3NhZ2UgKTtcbiAgICAgICAgXHRpZiAoIHRydWUgPT09IHJlc3BvbnNlLmRhdGEuc2hvdyApIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcbiJdfQ==
}(jQuery));
