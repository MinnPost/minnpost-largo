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

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
var searchToggle = document.querySelector('li.search a');
var menu = navButton.nextElementSibling;
navButton.addEventListener('click', function () {
  var expanded = this.getAttribute('aria-expanded') === 'true' || false;
  this.setAttribute('aria-expanded', !expanded);
  var menu = this.nextElementSibling;
  menu.hidden = !menu.hidden;
});
searchToggle.addEventListener('click', function (event) {
  event.preventDefault();
  var searchVisible = this.getAttribute('aria-expanded') === 'true' || false;
  this.setAttribute('aria-expanded', !searchVisible);
  var searchForm = this.nextElementSibling;
  searchForm.hidden = !searchForm.hidden;
}); // escape key press

$(document).keyup(function (e) {
  if (27 === e.keyCode) {
    var expanded = navButton.getAttribute('aria-expanded') === 'true' || false;
    var searchVisible = searchToggle.getAttribute('aria-expanded') === 'true' || false;

    if (undefined !== _typeof(expanded) && true === expanded) {
      var _menu = navButton.nextElementSibling;
      navButton.setAttribute('aria-expanded', false);
      _menu.hidden = !_menu.hidden;
    }

    if (undefined !== _typeof(searchVisible) && true === searchVisible) {
      var searchForm = searchToggle.nextElementSibling;
      searchToggle.setAttribute('aria-expanded', false);
      searchForm.hidden = !searchForm.hidden;
    }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAwLXN0YXJ0LmpzIiwiMDEtZm9udHMuanMiLCIwMi1hbmFseXRpY3MuanMiLCIwMy1zaGFyZS5qcyIsIjA0LW5hdmlnYXRpb24uanMiLCIwNS1mb3Jtcy5qcyIsIjA2LWNvbW1lbnRzLmpzIl0sIm5hbWVzIjpbInRsaXRlIiwidCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJpIiwidGFyZ2V0IiwibiIsInBhcmVudEVsZW1lbnQiLCJzaG93IiwidG9vbHRpcCIsIm8iLCJoaWRlIiwibCIsInIiLCJjbGFzc05hbWUiLCJzIiwib2Zmc2V0VG9wIiwib2Zmc2V0TGVmdCIsIm9mZnNldFBhcmVudCIsIm9mZnNldFdpZHRoIiwib2Zmc2V0SGVpZ2h0IiwiZCIsImYiLCJhIiwic3R5bGUiLCJ0b3AiLCJsZWZ0IiwiY3JlYXRlRWxlbWVudCIsImdyYXYiLCJnZXRBdHRyaWJ1dGUiLCJpbm5lckhUTUwiLCJhcHBlbmRDaGlsZCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImJvdHRvbSIsIndpbmRvdyIsImlubmVySGVpZ2h0IiwicmlnaHQiLCJpbm5lcldpZHRoIiwidGl0bGUiLCJzZXRBdHRyaWJ1dGUiLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwibW9kdWxlIiwiZXhwb3J0cyIsIiQiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwic2Vzc2lvblN0b3JhZ2UiLCJzZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsIiwic2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsIiwiZG9jdW1lbnRFbGVtZW50IiwiZyIsInB1c2giLCJsZW5ndGgiLCJtIiwic2hpZnQiLCJwIiwiYiIsInEiLCJjIiwidSIsIlR5cGVFcnJvciIsInRoZW4iLCJjYWxsIiwidiIsImgiLCJwcm90b3R5cGUiLCJ3IiwiayIsIngiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJhY2UiLCJhbGwiLCJhdHRhY2hFdmVudCIsImJvZHkiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVhZHlTdGF0ZSIsImRldGFjaEV2ZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJjc3NUZXh0IiwieiIsIndpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbFdpZHRoIiwiQSIsIkIiLCJmYW1pbHkiLCJ3ZWlnaHQiLCJzdHJldGNoIiwiQyIsIkQiLCJFIiwiRiIsIkciLCJKIiwidGVzdCIsIm5hdmlnYXRvciIsInZlbmRvciIsImV4ZWMiLCJ1c2VyQWdlbnQiLCJwYXJzZUludCIsImZvbnRzIiwiSyIsImZvbnQiLCJMIiwiam9pbiIsImxvYWQiLCJIIiwiRGF0ZSIsImdldFRpbWUiLCJNIiwiRXJyb3IiLCJOIiwieSIsIkkiLCJoaWRkZW4iLCJkaXIiLCJGb250RmFjZU9ic2VydmVyIiwic2Fuc05vcm1hbCIsInNhbnNCb2xkIiwic2Fuc05vcm1hbEl0YWxpYyIsInNlcmlmQm9vayIsInNlcmlmQm9va0l0YWxpYyIsInNlcmlmQm9sZCIsInNlcmlmQm9sZEl0YWxpYyIsInNlcmlmQmxhY2siLCJzZXJpZkJsYWNrSXRhbGljIiwibXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50IiwidHlwZSIsImNhdGVnb3J5IiwiYWN0aW9uIiwibGFiZWwiLCJ2YWx1ZSIsImdhIiwicmVhZHkiLCJQVU0iLCJjdXJyZW50X3BvcHVwIiwiZ2V0UG9wdXAiLCJzZXR0aW5ncyIsImdldFNldHRpbmdzIiwicG9wdXBfaWQiLCJpZCIsIm9uIiwiY2xvc2VfdHJpZ2dlciIsImZuIiwicG9wbWFrZSIsImxhc3RfY2xvc2VfdHJpZ2dlciIsImNsaWNrIiwidXJsIiwiYXR0ciIsIm1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSIsInVybF9hY2Nlc3NfbGV2ZWwiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiY3VycmVudF91c2VyIiwiY2FuX2FjY2VzcyIsInRyYWNrU2hhcmUiLCJ0ZXh0IiwicG9zaXRpb24iLCJqUXVlcnkiLCJoYXNDbGFzcyIsImNvcHlDdXJyZW50VVJMIiwiZHVtbXkiLCJocmVmIiwic2VsZWN0IiwiZXhlY0NvbW1hbmQiLCJkYXRhIiwicHJldmVudERlZmF1bHQiLCJwcmludCIsIm9wZW4iLCJuYXZCdXR0b24iLCJxdWVyeVNlbGVjdG9yIiwic2VhcmNoVG9nZ2xlIiwibWVudSIsIm5leHRFbGVtZW50U2libGluZyIsImV4cGFuZGVkIiwiZXZlbnQiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoRm9ybSIsImtleXVwIiwia2V5Q29kZSIsInVuZGVmaW5lZCIsInNldHVwTmF2U2VhcmNoIiwiY29udGFpbmVyIiwibmF2c2VhcmNoY29udGFpbmVyIiwibmF2c2VhcmNodG9nZ2xlIiwibmF2c2VhcmNoZm9ybSIsImdldEVsZW1lbnRCeUlkIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCIkdGFyZ2V0IiwiY2xvc2VzdCIsImlzIiwicmVwbGFjZSIsInByb3AiLCJpbmRleE9mIiwic2V0dXBNZW51IiwiYnV0dG9uIiwibGlua3MiLCJsZW4iLCJkaXNwbGF5Iiwib25jbGljayIsInRvZ2dsZUZvY3VzIiwidG91Y2hTdGFydEZuIiwicGFyZW50TGluayIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJtZW51SXRlbSIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiY2hpbGRyZW4iLCJyZW1vdmUiLCJhZGQiLCJzZWxmIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwid2lkZ2V0X3RpdGxlIiwiZmluZCIsInpvbmVfdGl0bGUiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJ0b2dnbGVDbGFzcyIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwidHJpbSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJmb3JtIiwicmVzdF9yb290IiwidXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdCIsInNpdGVfdXJsIiwicmVzdF9uYW1lc3BhY2UiLCJmdWxsX3VybCIsImNvbmZpcm1DaGFuZ2UiLCJuZXh0RW1haWxDb3VudCIsIm5ld1ByaW1hcnlFbWFpbCIsIm9sZFByaW1hcnlFbWFpbCIsInByaW1hcnlJZCIsImVtYWlsVG9SZW1vdmUiLCJjb25zb2xpZGF0ZWRFbWFpbHMiLCJuZXdFbWFpbHMiLCJhamF4X2Zvcm1fZGF0YSIsInRoYXQiLCJ2YWwiLCJwYXJlbnQiLCJhcHBlbmQiLCJmaXJzdCIsInJlcGxhY2VXaXRoIiwic3VibWl0IiwiZWFjaCIsImluZGV4IiwiZ2V0IiwicGFyZW50cyIsImZhZGVPdXQiLCJjb25zb2xlIiwibG9nIiwiYmVmb3JlIiwiYnV0dG9uX2Zvcm0iLCJzdWJtaXR0aW5nX2J1dHRvbiIsInNlcmlhbGl6ZSIsImFqYXgiLCJiZWZvcmVTZW5kIiwieGhyIiwic2V0UmVxdWVzdEhlYWRlciIsIm5vbmNlIiwiZGF0YVR5cGUiLCJkb25lIiwibWFwIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicmVsb2FkIiwidHJhY2tTaG93Q29tbWVudHMiLCJhbHdheXMiLCJjbGlja192YWx1ZSIsImNhdGVnb3J5X3ByZWZpeCIsImNhdGVnb3J5X3N1ZmZpeCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJhamF4dXJsIiwic3VjY2VzcyIsInJlc3BvbnNlIiwiaHRtbCIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsS0FBVCxDQUFlQyxDQUFmLEVBQWlCO0FBQUNDLEVBQUFBLFFBQVEsQ0FBQ0MsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBc0MsVUFBU0MsQ0FBVCxFQUFXO0FBQUMsUUFBSUMsQ0FBQyxHQUFDRCxDQUFDLENBQUNFLE1BQVI7QUFBQSxRQUFlQyxDQUFDLEdBQUNOLENBQUMsQ0FBQ0ksQ0FBRCxDQUFsQjtBQUFzQkUsSUFBQUEsQ0FBQyxLQUFHQSxDQUFDLEdBQUMsQ0FBQ0YsQ0FBQyxHQUFDQSxDQUFDLENBQUNHLGFBQUwsS0FBcUJQLENBQUMsQ0FBQ0ks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QUFDQTtBQUNEO0FBZEssR0FBUDtBQWdCQSxDQTVCRCIsImZpbGUiOiJtaW5ucG9zdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHRsaXRlKHQpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIixmdW5jdGlvbihlKXt2YXIgaT1lLnRhcmdldCxuPXQoaSk7bnx8KG49KGk9aS5wYXJlbnRFbGVtZW50KSYmdChpKSksbiYmdGxpdGUuc2hvdyhpLG4sITApfSl9dGxpdGUuc2hvdz1mdW5jdGlvbih0LGUsaSl7dmFyIG49XCJkYXRhLXRsaXRlXCI7ZT1lfHx7fSwodC50b29sdGlwfHxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIG8oKXt0bGl0ZS5oaWRlKHQsITApfWZ1bmN0aW9uIGwoKXtyfHwocj1mdW5jdGlvbih0LGUsaSl7ZnVuY3Rpb24gbigpe28uY2xhc3NOYW1lPVwidGxpdGUgdGxpdGUtXCIrcitzO3ZhciBlPXQub2Zmc2V0VG9wLGk9dC5vZmZzZXRMZWZ0O28ub2Zmc2V0UGFyZW50PT09dCYmKGU9aT0wKTt2YXIgbj10Lm9mZnNldFdpZHRoLGw9dC5vZmZzZXRIZWlnaHQsZD1vLm9mZnNldEhlaWdodCxmPW8ub2Zmc2V0V2lkdGgsYT1pK24vMjtvLnN0eWxlLnRvcD0oXCJzXCI9PT1yP2UtZC0xMDpcIm5cIj09PXI/ZStsKzEwOmUrbC8yLWQvMikrXCJweFwiLG8uc3R5bGUubGVmdD0oXCJ3XCI9PT1zP2k6XCJlXCI9PT1zP2krbi1mOlwid1wiPT09cj9pK24rMTA6XCJlXCI9PT1yP2ktZi0xMDphLWYvMikrXCJweFwifXZhciBvPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpLGw9aS5ncmF2fHx0LmdldEF0dHJpYnV0ZShcImRhdGEtdGxpdGVcIil8fFwiblwiO28uaW5uZXJIVE1MPWUsdC5hcHBlbmRDaGlsZChvKTt2YXIgcj1sWzBdfHxcIlwiLHM9bFsxXXx8XCJcIjtuKCk7dmFyIGQ9by5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm5cInNcIj09PXImJmQudG9wPDA/KHI9XCJuXCIsbigpKTpcIm5cIj09PXImJmQuYm90dG9tPndpbmRvdy5pbm5lckhlaWdodD8ocj1cInNcIixuKCkpOlwiZVwiPT09ciYmZC5sZWZ0PDA/KHI9XCJ3XCIsbigpKTpcIndcIj09PXImJmQucmlnaHQ+d2luZG93LmlubmVyV2lkdGgmJihyPVwiZVwiLG4oKSksby5jbGFzc05hbWUrPVwiIHRsaXRlLXZpc2libGVcIixvfSh0LGQsZSkpfXZhciByLHMsZDtyZXR1cm4gdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsbyksdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLG8pLHQudG9vbHRpcD17c2hvdzpmdW5jdGlvbigpe2Q9dC50aXRsZXx8dC5nZXRBdHRyaWJ1dGUobil8fGQsdC50aXRsZT1cIlwiLHQuc2V0QXR0cmlidXRlKG4sXCJcIiksZCYmIXMmJihzPXNldFRpbWVvdXQobCxpPzE1MDoxKSl9LGhpZGU6ZnVuY3Rpb24odCl7aWYoaT09PXQpe3M9Y2xlYXJUaW1lb3V0KHMpO3ZhciBlPXImJnIucGFyZW50Tm9kZTtlJiZlLnJlbW92ZUNoaWxkKHIpLHI9dm9pZCAwfX19fSh0LGUpKS5zaG93KCl9LHRsaXRlLmhpZGU9ZnVuY3Rpb24odCxlKXt0LnRvb2x0aXAmJnQudG9vbHRpcC5oaWRlKGUpfSxcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmKG1vZHVsZS5leHBvcnRzPXRsaXRlKTsiLCIkKCAnaHRtbCcgKS5yZW1vdmVDbGFzcyggJ25vLWpzJyApLmFkZENsYXNzKCAnanMnICk7IiwiLy8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3NcbmlmICggc2Vzc2lvblN0b3JhZ2Uuc2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCAmJiBzZXNzaW9uU3RvcmFnZS5zYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgKSB7XG5cdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzZXJpZi1mb250cy1sb2FkZWQgc2Fucy1mb250cy1sb2FkZWQnO1xufSBlbHNlIHtcblx0LyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjEuMCAtIMKpIEJyYW0gU3RlaW4uIExpY2Vuc2U6IEJTRC0zLUNsYXVzZSAqLyhmdW5jdGlvbigpeyd1c2Ugc3RyaWN0Jzt2YXIgZixnPVtdO2Z1bmN0aW9uIGwoYSl7Zy5wdXNoKGEpOzE9PWcubGVuZ3RoJiZmKCl9ZnVuY3Rpb24gbSgpe2Zvcig7Zy5sZW5ndGg7KWdbMF0oKSxnLnNoaWZ0KCl9Zj1mdW5jdGlvbigpe3NldFRpbWVvdXQobSl9O2Z1bmN0aW9uIG4oYSl7dGhpcy5hPXA7dGhpcy5iPXZvaWQgMDt0aGlzLmY9W107dmFyIGI9dGhpczt0cnl7YShmdW5jdGlvbihhKXtxKGIsYSl9LGZ1bmN0aW9uKGEpe3IoYixhKX0pfWNhdGNoKGMpe3IoYixjKX19dmFyIHA9MjtmdW5jdGlvbiB0KGEpe3JldHVybiBuZXcgbihmdW5jdGlvbihiLGMpe2MoYSl9KX1mdW5jdGlvbiB1KGEpe3JldHVybiBuZXcgbihmdW5jdGlvbihiKXtiKGEpfSl9ZnVuY3Rpb24gcShhLGIpe2lmKGEuYT09cCl7aWYoYj09YSl0aHJvdyBuZXcgVHlwZUVycm9yO3ZhciBjPSExO3RyeXt2YXIgZD1iJiZiLnRoZW47aWYobnVsbCE9YiYmXCJvYmplY3RcIj09dHlwZW9mIGImJlwiZnVuY3Rpb25cIj09dHlwZW9mIGQpe2QuY2FsbChiLGZ1bmN0aW9uKGIpe2N8fHEoYSxiKTtjPSEwfSxmdW5jdGlvbihiKXtjfHxyKGEsYik7Yz0hMH0pO3JldHVybn19Y2F0Y2goZSl7Y3x8cihhLGUpO3JldHVybn1hLmE9MDthLmI9Yjt2KGEpfX1cblx0ZnVuY3Rpb24gcihhLGIpe2lmKGEuYT09cCl7aWYoYj09YSl0aHJvdyBuZXcgVHlwZUVycm9yO2EuYT0xO2EuYj1iO3YoYSl9fWZ1bmN0aW9uIHYoYSl7bChmdW5jdGlvbigpe2lmKGEuYSE9cClmb3IoO2EuZi5sZW5ndGg7KXt2YXIgYj1hLmYuc2hpZnQoKSxjPWJbMF0sZD1iWzFdLGU9YlsyXSxiPWJbM107dHJ5ezA9PWEuYT9cImZ1bmN0aW9uXCI9PXR5cGVvZiBjP2UoYy5jYWxsKHZvaWQgMCxhLmIpKTplKGEuYik6MT09YS5hJiYoXCJmdW5jdGlvblwiPT10eXBlb2YgZD9lKGQuY2FsbCh2b2lkIDAsYS5iKSk6YihhLmIpKX1jYXRjaChoKXtiKGgpfX19KX1uLnByb3RvdHlwZS5nPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmModm9pZCAwLGEpfTtuLnByb3RvdHlwZS5jPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcztyZXR1cm4gbmV3IG4oZnVuY3Rpb24oZCxlKXtjLmYucHVzaChbYSxiLGQsZV0pO3YoYyl9KX07XG5cdGZ1bmN0aW9uIHcoYSl7cmV0dXJuIG5ldyBuKGZ1bmN0aW9uKGIsYyl7ZnVuY3Rpb24gZChjKXtyZXR1cm4gZnVuY3Rpb24oZCl7aFtjXT1kO2UrPTE7ZT09YS5sZW5ndGgmJmIoaCl9fXZhciBlPTAsaD1bXTswPT1hLmxlbmd0aCYmYihoKTtmb3IodmFyIGs9MDtrPGEubGVuZ3RoO2srPTEpdShhW2tdKS5jKGQoayksYyl9KX1mdW5jdGlvbiB4KGEpe3JldHVybiBuZXcgbihmdW5jdGlvbihiLGMpe2Zvcih2YXIgZD0wO2Q8YS5sZW5ndGg7ZCs9MSl1KGFbZF0pLmMoYixjKX0pfTt3aW5kb3cuUHJvbWlzZXx8KHdpbmRvdy5Qcm9taXNlPW4sd2luZG93LlByb21pc2UucmVzb2x2ZT11LHdpbmRvdy5Qcm9taXNlLnJlamVjdD10LHdpbmRvdy5Qcm9taXNlLnJhY2U9eCx3aW5kb3cuUHJvbWlzZS5hbGw9dyx3aW5kb3cuUHJvbWlzZS5wcm90b3R5cGUudGhlbj1uLnByb3RvdHlwZS5jLHdpbmRvdy5Qcm9taXNlLnByb3RvdHlwZVtcImNhdGNoXCJdPW4ucHJvdG90eXBlLmcpO30oKSk7XG5cblx0KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gbChhLGIpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/YS5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsYiwhMSk6YS5hdHRhY2hFdmVudChcInNjcm9sbFwiLGIpfWZ1bmN0aW9uIG0oYSl7ZG9jdW1lbnQuYm9keT9hKCk6ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uIGMoKXtkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGMpO2EoKX0pOmRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24gaygpe2lmKFwiaW50ZXJhY3RpdmVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZXx8XCJjb21wbGV0ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlKWRvY3VtZW50LmRldGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsayksYSgpfSl9O2Z1bmN0aW9uIHQoYSl7dGhpcy5hPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5hLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpO3RoaXMuYS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSk7dGhpcy5iPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmg9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5mPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZz0tMTt0aGlzLmIuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuYy5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7XG5cdHRoaXMuZi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5oLnN0eWxlLmNzc1RleHQ9XCJkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyMDAlO2hlaWdodDoyMDAlO2ZvbnQtc2l6ZToxNnB4O21heC13aWR0aDpub25lO1wiO3RoaXMuYi5hcHBlbmRDaGlsZCh0aGlzLmgpO3RoaXMuYy5hcHBlbmRDaGlsZCh0aGlzLmYpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmIpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmMpfVxuXHRmdW5jdGlvbiB1KGEsYil7YS5hLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTttaW4td2lkdGg6MjBweDttaW4taGVpZ2h0OjIwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmF1dG87bWFyZ2luOjA7cGFkZGluZzowO3RvcDotOTk5cHg7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQtc3ludGhlc2lzOm5vbmU7Zm9udDpcIitiK1wiO1wifWZ1bmN0aW9uIHooYSl7dmFyIGI9YS5hLm9mZnNldFdpZHRoLGM9YisxMDA7YS5mLnN0eWxlLndpZHRoPWMrXCJweFwiO2EuYy5zY3JvbGxMZWZ0PWM7YS5iLnNjcm9sbExlZnQ9YS5iLnNjcm9sbFdpZHRoKzEwMDtyZXR1cm4gYS5nIT09Yj8oYS5nPWIsITApOiExfWZ1bmN0aW9uIEEoYSxiKXtmdW5jdGlvbiBjKCl7dmFyIGE9azt6KGEpJiZhLmEucGFyZW50Tm9kZSYmYihhLmcpfXZhciBrPWE7bChhLmIsYyk7bChhLmMsYyk7eihhKX07ZnVuY3Rpb24gQihhLGIpe3ZhciBjPWJ8fHt9O3RoaXMuZmFtaWx5PWE7dGhpcy5zdHlsZT1jLnN0eWxlfHxcIm5vcm1hbFwiO3RoaXMud2VpZ2h0PWMud2VpZ2h0fHxcIm5vcm1hbFwiO3RoaXMuc3RyZXRjaD1jLnN0cmV0Y2h8fFwibm9ybWFsXCJ9dmFyIEM9bnVsbCxEPW51bGwsRT1udWxsLEY9bnVsbDtmdW5jdGlvbiBHKCl7aWYobnVsbD09PUQpaWYoSigpJiYvQXBwbGUvLnRlc3Qod2luZG93Lm5hdmlnYXRvci52ZW5kb3IpKXt2YXIgYT0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7RD0hIWEmJjYwMz5wYXJzZUludChhWzFdLDEwKX1lbHNlIEQ9ITE7cmV0dXJuIER9ZnVuY3Rpb24gSigpe251bGw9PT1GJiYoRj0hIWRvY3VtZW50LmZvbnRzKTtyZXR1cm4gRn1cblx0ZnVuY3Rpb24gSygpe2lmKG51bGw9PT1FKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RyeXthLnN0eWxlLmZvbnQ9XCJjb25kZW5zZWQgMTAwcHggc2Fucy1zZXJpZlwifWNhdGNoKGIpe31FPVwiXCIhPT1hLnN0eWxlLmZvbnR9cmV0dXJuIEV9ZnVuY3Rpb24gTChhLGIpe3JldHVyblthLnN0eWxlLGEud2VpZ2h0LEsoKT9hLnN0cmV0Y2g6XCJcIixcIjEwMHB4XCIsYl0uam9pbihcIiBcIil9XG5cdEIucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLGs9YXx8XCJCRVNic3d5XCIscj0wLG49Ynx8M0UzLEg9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7aWYoSigpJiYhRygpKXt2YXIgTT1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGUoKXsobmV3IERhdGUpLmdldFRpbWUoKS1IPj1uP2IoRXJyb3IoXCJcIituK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSk6ZG9jdW1lbnQuZm9udHMubG9hZChMKGMsJ1wiJytjLmZhbWlseSsnXCInKSxrKS50aGVuKGZ1bmN0aW9uKGMpezE8PWMubGVuZ3RoP2EoKTpzZXRUaW1lb3V0KGUsMjUpfSxiKX1lKCl9KSxOPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYyl7cj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YyhFcnJvcihcIlwiK24rXCJtcyB0aW1lb3V0IGV4Y2VlZGVkXCIpKX0sbil9KTtQcm9taXNlLnJhY2UoW04sTV0pLnRoZW4oZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQocik7YShjKX0sXG5cdGIpfWVsc2UgbShmdW5jdGlvbigpe2Z1bmN0aW9uIHYoKXt2YXIgYjtpZihiPS0xIT1mJiYtMSE9Z3x8LTEhPWYmJi0xIT1ofHwtMSE9ZyYmLTEhPWgpKGI9ZiE9ZyYmZiE9aCYmZyE9aCl8fChudWxsPT09QyYmKGI9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLEM9ISFiJiYoNTM2PnBhcnNlSW50KGJbMV0sMTApfHw1MzY9PT1wYXJzZUludChiWzFdLDEwKSYmMTE+PXBhcnNlSW50KGJbMl0sMTApKSksYj1DJiYoZj09dyYmZz09dyYmaD09d3x8Zj09eCYmZz09eCYmaD09eHx8Zj09eSYmZz09eSYmaD09eSkpLGI9IWI7YiYmKGQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGNsZWFyVGltZW91dChyKSxhKGMpKX1mdW5jdGlvbiBJKCl7aWYoKG5ldyBEYXRlKS5nZXRUaW1lKCktSD49bilkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxiKEVycm9yKFwiXCIrXG5cdG4rXCJtcyB0aW1lb3V0IGV4Y2VlZGVkXCIpKTtlbHNle3ZhciBhPWRvY3VtZW50LmhpZGRlbjtpZighMD09PWF8fHZvaWQgMD09PWEpZj1lLmEub2Zmc2V0V2lkdGgsZz1wLmEub2Zmc2V0V2lkdGgsaD1xLmEub2Zmc2V0V2lkdGgsdigpO3I9c2V0VGltZW91dChJLDUwKX19dmFyIGU9bmV3IHQoaykscD1uZXcgdChrKSxxPW5ldyB0KGspLGY9LTEsZz0tMSxoPS0xLHc9LTEseD0tMSx5PS0xLGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmRpcj1cImx0clwiO3UoZSxMKGMsXCJzYW5zLXNlcmlmXCIpKTt1KHAsTChjLFwic2VyaWZcIikpO3UocSxMKGMsXCJtb25vc3BhY2VcIikpO2QuYXBwZW5kQ2hpbGQoZS5hKTtkLmFwcGVuZENoaWxkKHAuYSk7ZC5hcHBlbmRDaGlsZChxLmEpO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZCk7dz1lLmEub2Zmc2V0V2lkdGg7eD1wLmEub2Zmc2V0V2lkdGg7eT1xLmEub2Zmc2V0V2lkdGg7SSgpO0EoZSxmdW5jdGlvbihhKXtmPWE7digpfSk7dShlLFxuXHRMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2Fucy1zZXJpZicpKTtBKHAsZnVuY3Rpb24oYSl7Zz1hO3YoKX0pO3UocCxMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2VyaWYnKSk7QShxLGZ1bmN0aW9uKGEpe2g9YTt2KCl9KTt1KHEsTChjLCdcIicrYy5mYW1pbHkrJ1wiLG1vbm9zcGFjZScpKX0pfSl9O1wib2JqZWN0XCI9PT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPUI6KHdpbmRvdy5Gb250RmFjZU9ic2VydmVyPUIsd2luZG93LkZvbnRGYWNlT2JzZXJ2ZXIucHJvdG90eXBlLmxvYWQ9Qi5wcm90b3R5cGUubG9hZCk7fSgpKTtcblxuXHQvLyBtaW5ucG9zdCBmb250c1xuXG5cdC8vIHNhbnNcblx0dmFyIHNhbnNOb3JtYWwgPSBuZXcgRm9udEZhY2VPYnNlcnZlciggJ2ZmLW1ldGEtd2ViLXBybycgKTtcblx0dmFyIHNhbnNCb2xkID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNzAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2Fuc05vcm1hbEl0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDQwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblxuXHQvLyBzZXJpZlxuXHR2YXIgc2VyaWZCb29rID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoIFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDUwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9va0l0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDUwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9sZEl0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQmxhY2sgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA5MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJsYWNrSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogOTAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXG5cdFByb21pc2UuYWxsKCBbXG5cdFx0c2Fuc05vcm1hbC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc0JvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNOb3JtYWxJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9vay5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb29rSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9sZEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCbGFjay5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCbGFja0l0YWxpYy5sb2FkKCBudWxsLCAzMDAwIClcblx0XSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzZXJpZi1mb250cy1sb2FkZWQnO1xuXHRcdC8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5cdFx0c2Vzc2lvblN0b3JhZ2Uuc2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCA9IHRydWU7XG5cdH0gKTtcblxuXHRQcm9taXNlLmFsbCggW1xuXHRcdHNhbnNOb3JtYWwubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zTm9ybWFsSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKVxuXHRdICkudGhlbiggZnVuY3Rpb24oKSB7XG5cdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIHNhbnMtZm9udHMtbG9hZGVkJztcblx0XHQvLyBPcHRpbWl6YXRpb24gZm9yIFJlcGVhdCBWaWV3c1xuXHRcdHNlc3Npb25TdG9yYWdlLnNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCA9IHRydWU7XG5cdH0gKTtcbn1cblxuIiwiZnVuY3Rpb24gbXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgdmFsdWUgKSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCBlICkge1xuXG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBQVU0gKSB7XG5cdFx0dmFyIGN1cnJlbnRfcG9wdXAgPSBQVU0uZ2V0UG9wdXAoICQoICcucHVtJyApICk7XG5cdFx0dmFyIHNldHRpbmdzID0gUFVNLmdldFNldHRpbmdzKCAkKCAnLnB1bScgKSApO1xuXHRcdHZhciBwb3B1cF9pZCA9IHNldHRpbmdzLmlkO1xuXHRcdCQoIGRvY3VtZW50ICkub24oICdwdW1BZnRlck9wZW4nLCBmdW5jdGlvbigpIHtcblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ1Nob3cnLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0pO1xuXHRcdH0pO1xuXHRcdCQoIGRvY3VtZW50ICkub24oICdwdW1BZnRlckNsb3NlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgY2xvc2VfdHJpZ2dlciA9ICQuZm4ucG9wbWFrZS5sYXN0X2Nsb3NlX3RyaWdnZXI7XG5cdFx0XHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgY2xvc2VfdHJpZ2dlciApIHtcblx0XHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCBjbG9zZV90cmlnZ2VyLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCQoICcubWVzc2FnZS1jbG9zZScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIGxpbmsgd2l0aCBjbG9zZSBjbGFzc1xuXHRcdFx0dmFyIGNsb3NlX3RyaWdnZXIgPSAnQ2xvc2UgQnV0dG9uJztcblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgY2xvc2VfdHJpZ2dlciwgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9KTtcblx0XHR9KTtcblx0XHQkKCAnLm1lc3NhZ2UtbG9naW4nICkuY2xpY2soIGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBsaW5rIHdpdGggbG9naW4gY2xhc3Ncblx0XHRcdHZhciB1cmwgPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdMb2dpbiBMaW5rJywgdXJsICk7XG5cdFx0fSk7XG5cdFx0JCggJy5wdW0tY29udGVudCBhOm5vdCggLm1lc3NhZ2UtY2xvc2UsIC5wdW0tY2xvc2UsIC5tZXNzYWdlLWxvZ2luICknICkuY2xpY2soIGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBzb21ldGhpbmcgdGhhdCBpcyBub3QgY2xvc2UgdGV4dCBvciBjbG9zZSBpY29uXG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdDbGljaycsIHBvcHVwX2lkICk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdH1cblx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdH1cbn0pO1xuIiwiZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gPSAnJyApIHtcblxuXHQvLyBpZiBhIG5vdCBsb2dnZWQgaW4gdXNlciB0cmllcyB0byBlbWFpbCwgZG9uJ3QgY291bnQgdGhhdCBhcyBhIHNoYXJlXG5cdGlmICggISBqUXVlcnkoICdib2R5JyApLmhhc0NsYXNzKCAnbG9nZ2VkLWluJyApICYmICdFbWFpbCcgPT09IHRleHQgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGNhdGVnb3J5ID0gJ1NoYXJlJztcblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0Y2F0ZWdvcnkgPSAnU2hhcmUgLSAnICsgcG9zaXRpb247XG5cdH1cblxuXHQvLyB0cmFjayBhcyBhbiBldmVudCwgYW5kIGFzIHNvY2lhbCBpZiBpdCBpcyB0d2l0dGVyIG9yIGZiXG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgY2F0ZWdvcnksIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgfHwgJ1R3aXR0ZXInID09PSB0ZXh0ICkge1xuXHRcdFx0aWYgKCAnRmFjZWJvb2snID09IHRleHQgKSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnU2hhcmUnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdUd2VldCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG5mdW5jdGlvbiBjb3B5Q3VycmVudFVSTCgpIHtcblx0dmFyIGR1bW15ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2lucHV0JyApLCB0ZXh0ID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGR1bW15ICk7XG5cdGR1bW15LnZhbHVlID0gdGV4dDtcblx0ZHVtbXkuc2VsZWN0KCk7XG5cdGRvY3VtZW50LmV4ZWNDb21tYW5kKCAnY29weScgKTtcblx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCggZHVtbXkgKTtcbn1cblxuJCggJy5tLWVudHJ5LXNoYXJlLXRvcCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0dmFyIHRleHQgPSAkKCB0aGlzICkuZGF0YSggJ3NoYXJlLWFjdGlvbicgKTtcblx0dmFyIHBvc2l0aW9uID0gJ3RvcCc7XG5cdHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG59KTtcblxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXByaW50IGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHdpbmRvdy5wcmludCgpO1xufSk7XG5cbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1jb3B5LXVybCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0Y29weUN1cnJlbnRVUkwoKTtcblx0dGxpdGUuc2hvdyggKCBlLnRhcmdldCApLCB7IGdyYXY6ICd3JyB9ICk7XG5cdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdHRsaXRlLmhpZGUoICggZS50YXJnZXQgKSApO1xuXHR9LCAzMDAwICk7XG5cdHJldHVybiBmYWxzZTtcbn0pO1xuXG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZmFjZWJvb2sgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtdHdpdHRlciBhLCAubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1lbWFpbCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR2YXIgdXJsID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuICAgIHdpbmRvdy5vcGVuKCB1cmwsICdfYmxhbmsnICk7XG59KTtcbiIsIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIEhhbmRsZXMgdG9nZ2xpbmcgdGhlIG5hdmlnYXRpb24gbWVudSBmb3Igc21hbGwgc2NyZWVucyBhbmQgZW5hYmxlcyBUQUIga2V5XG4gKiBuYXZpZ2F0aW9uIHN1cHBvcnQgZm9yIGRyb3Bkb3duIG1lbnVzLlxuICovXG5cbi8vc2V0dXBNZW51KCAnbmF2aWdhdGlvbi1wcmltYXJ5JyApO1xuLy9zZXR1cE1lbnUoICduYXZpZ2F0aW9uLXVzZXItYWNjb3VudC1tYW5hZ2VtZW50JyApO1xuLy9zZXR1cE5hdlNlYXJjaCggJ25hdmlnYXRpb24tcHJpbWFyeScgKTtcblxudmFyIG5hdkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgYnV0dG9uJyApO1xudmFyIHNlYXJjaFRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICdsaS5zZWFyY2ggYScgKTtcbmxldCBtZW51ID0gbmF2QnV0dG9uLm5leHRFbGVtZW50U2libGluZztcbm5hdkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgZXhwYW5kZWQgPSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJyB8fCBmYWxzZTtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgbGV0IG1lbnUgPSB0aGlzLm5leHRFbGVtZW50U2libGluZztcbiAgICBtZW51LmhpZGRlbiA9ICEgbWVudS5oaWRkZW47XG59KTtcbnNlYXJjaFRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRsZXQgc2VhcmNoVmlzaWJsZSA9IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnIHx8IGZhbHNlO1xuXHR0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHNlYXJjaFZpc2libGUgKTtcblx0bGV0IHNlYXJjaEZvcm0gPSB0aGlzLm5leHRFbGVtZW50U2libGluZztcblx0c2VhcmNoRm9ybS5oaWRkZW4gPSAhIHNlYXJjaEZvcm0uaGlkZGVuO1xufSk7XG4vLyBlc2NhcGUga2V5IHByZXNzXG4kKGRvY3VtZW50KS5rZXl1cChmdW5jdGlvbihlKSB7XG5cdGlmICgyNyA9PT0gZS5rZXlDb2RlICkge1xuXHRcdGxldCBleHBhbmRlZCA9IG5hdkJ1dHRvbi5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZScgfHwgZmFsc2U7XG5cdFx0bGV0IHNlYXJjaFZpc2libGUgPSBzZWFyY2hUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnIHx8IGZhbHNlO1xuXHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgZXhwYW5kZWQgJiYgdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRsZXQgbWVudSA9IG5hdkJ1dHRvbi5uZXh0RWxlbWVudFNpYmxpbmc7XG5cdFx0XHRuYXZCdXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0XHRtZW51LmhpZGRlbiA9ICEgbWVudS5oaWRkZW47XG5cdFx0fVxuXHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2Ygc2VhcmNoVmlzaWJsZSAmJiB0cnVlID09PSBzZWFyY2hWaXNpYmxlICkge1xuXHRcdFx0bGV0IHNlYXJjaEZvcm0gPSBzZWFyY2hUb2dnbGUubmV4dEVsZW1lbnRTaWJsaW5nO1xuXHRcdFx0c2VhcmNoVG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXHRcdFx0c2VhcmNoRm9ybS5oaWRkZW4gPSAhIHNlYXJjaEZvcm0uaGlkZGVuO1xuXHRcdH1cblx0fVxufSk7XG5cbmZ1bmN0aW9uIHNldHVwTmF2U2VhcmNoKCBjb250YWluZXIgKSB7XG5cblx0dmFyIG5hdnNlYXJjaGNvbnRhaW5lciwgbmF2c2VhcmNodG9nZ2xlLCBuYXZzZWFyY2hmb3JtO1xuXG5cdGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBjb250YWluZXIgKTtcblx0aWYgKCAhIGNvbnRhaW5lciApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRuYXZzZWFyY2hjb250YWluZXIgPSAkKCAnbGkuc2VhcmNoJywgJCggY29udGFpbmVyICkgKTtcblx0bmF2c2VhcmNodG9nZ2xlICAgID0gJCggJ2xpLnNlYXJjaCBhJywgJCggY29udGFpbmVyICkgKTtcblx0bmF2c2VhcmNoZm9ybSAgICAgID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnZm9ybScgKVswXTtcblxuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgbmF2c2VhcmNodG9nZ2xlIHx8ICd1bmRlZmluZWQnID09PSB0eXBlb2YgbmF2c2VhcmNoZm9ybSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZiAoIDAgPCAkKCBuYXZzZWFyY2hmb3JtICkubGVuZ3RoICkge1xuXHRcdCQoIGRvY3VtZW50ICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdHZhciAkdGFyZ2V0ID0gJCggZXZlbnQudGFyZ2V0ICk7XG5cdFx0XHRpZiAoICEgJHRhcmdldC5jbG9zZXN0KCBuYXZzZWFyY2hjb250YWluZXIgKS5sZW5ndGggJiYgJCggbmF2c2VhcmNoZm9ybSApLmlzKCAnOnZpc2libGUnICkgKSB7XG5cdFx0XHRcdG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lID0gbmF2c2VhcmNoZm9ybS5jbGFzc05hbWUucmVwbGFjZSggJyB0b2dnbGVkLWZvcm0nLCAnJyApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5wcm9wKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnJlbW92ZUNsYXNzKCAndG9nZ2xlZC1mb3JtJyApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0aWYgKCAtMSAhPT0gbmF2c2VhcmNoZm9ybS5jbGFzc05hbWUuaW5kZXhPZiggJ3RvZ2dsZWQtZm9ybScgKSApIHtcblx0XHRcdFx0bmF2c2VhcmNoZm9ybS5jbGFzc05hbWUgPSBuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZS5yZXBsYWNlKCAnIHRvZ2dsZWQtZm9ybScsICcnICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnByb3AoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucmVtb3ZlQ2xhc3MoICd0b2dnbGVkLWZvcm0nICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZSArPSAnIHRvZ2dsZWQtZm9ybSc7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnByb3AoICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5hZGRDbGFzcyggJ3RvZ2dsZWQtZm9ybScgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzZXR1cE1lbnUoIGNvbnRhaW5lciApIHtcblx0dmFyIGJ1dHRvbiwgbWVudSwgbGlua3MsIGksIGxlbjtcblx0Y29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGNvbnRhaW5lciApO1xuXHRpZiAoICEgY29udGFpbmVyICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGJ1dHRvbiA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2J1dHRvbicgKVswXTtcblx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIGJ1dHRvbiApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRtZW51ID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAndWwnIClbMF07XG5cblx0Ly8gSGlkZSBtZW51IHRvZ2dsZSBidXR0b24gaWYgbWVudSBpcyBlbXB0eSBhbmQgcmV0dXJuIGVhcmx5LlxuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgbWVudSApIHtcblx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRyZXR1cm47XG5cdH1cblxuXHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdGlmICggLTEgPT09IG1lbnUuY2xhc3NOYW1lLmluZGV4T2YoICdtZW51JyApICkge1xuXHRcdG1lbnUuY2xhc3NOYW1lICs9ICcgbWVudSc7XG5cdH1cblxuXHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggLTEgIT09IGNvbnRhaW5lci5jbGFzc05hbWUuaW5kZXhPZiggJ3RvZ2dsZWQnICkgKSB7XG5cdFx0XHRjb250YWluZXIuY2xhc3NOYW1lID0gY29udGFpbmVyLmNsYXNzTmFtZS5yZXBsYWNlKCAnIHRvZ2dsZWQnLCAnJyApO1xuXHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgKz0gJyB0b2dnbGVkJztcblx0XHRcdGJ1dHRvbi5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnICk7XG5cdFx0XHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gR2V0IGFsbCB0aGUgbGluayBlbGVtZW50cyB3aXRoaW4gdGhlIG1lbnUuXG5cdGxpbmtzICAgID0gbWVudS5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2EnICk7XG5cblx0Ly8gRWFjaCB0aW1lIGEgbWVudSBsaW5rIGlzIGZvY3VzZWQgb3IgYmx1cnJlZCwgdG9nZ2xlIGZvY3VzLlxuXHRmb3IgKCBpID0gMCwgbGVuID0gbGlua3MubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0bGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ2ZvY3VzJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0XHRsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCAnYmx1cicsIHRvZ2dsZUZvY3VzLCB0cnVlICk7XG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyBgZm9jdXNgIGNsYXNzIHRvIGFsbG93IHN1Ym1lbnUgYWNjZXNzIG9uIHRhYmxldHMuXG5cdCAqL1xuXHQoIGZ1bmN0aW9uKCBjb250YWluZXIgKSB7XG5cdFx0dmFyIHRvdWNoU3RhcnRGbiwgaSxcblx0XHRcdHBhcmVudExpbmsgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCggJy5tZW51LWl0ZW0taGFzLWNoaWxkcmVuID4gYSwgLnBhZ2VfaXRlbV9oYXNfY2hpbGRyZW4gPiBhJyApO1xuXG5cdFx0aWYgKCAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgKSB7XG5cdFx0XHR0b3VjaFN0YXJ0Rm4gPSBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0dmFyIG1lbnVJdGVtID0gdGhpcy5wYXJlbnROb2RlLFxuXHRcdFx0XHRcdGk7XG5cblx0XHRcdFx0aWYgKCAhIG1lbnVJdGVtLmNsYXNzTGlzdC5jb250YWlucyggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW4ubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1lbnVJdGVtID09PSBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbltpXS5jbGFzc0xpc3QucmVtb3ZlKCAnZm9jdXMnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG1lbnVJdGVtLmNsYXNzTGlzdC5hZGQoICdmb2N1cycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZW51SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCAnZm9jdXMnICk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGZvciAoIGkgPSAwOyBpIDwgcGFyZW50TGluay5sZW5ndGg7ICsraSApIHtcblx0XHRcdFx0cGFyZW50TGlua1tpXS5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIHRvdWNoU3RhcnRGbiwgZmFsc2UgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0oIGNvbnRhaW5lciApICk7XG59XG5cbi8qKlxuICogU2V0cyBvciByZW1vdmVzIC5mb2N1cyBjbGFzcyBvbiBhbiBlbGVtZW50LlxuICovXG5mdW5jdGlvbiB0b2dnbGVGb2N1cygpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdC8vIE1vdmUgdXAgdGhyb3VnaCB0aGUgYW5jZXN0b3JzIG9mIHRoZSBjdXJyZW50IGxpbmsgdW50aWwgd2UgaGl0IC5uYXYtbWVudS5cblx0d2hpbGUgKCAtMSA9PT0gc2VsZi5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cblx0XHQvLyBPbiBsaSBlbGVtZW50cyB0b2dnbGUgdGhlIGNsYXNzIC5mb2N1cy5cblx0XHRpZiAoICdsaScgPT09IHNlbGYudGFnTmFtZS50b0xvd2VyQ2FzZSgpICkge1xuXHRcdFx0aWYgKCAtMSAhPT0gc2VsZi5jbGFzc05hbWUuaW5kZXhPZiggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRzZWxmLmNsYXNzTmFtZSA9IHNlbGYuY2xhc3NOYW1lLnJlcGxhY2UoICcgZm9jdXMnLCAnJyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VsZi5jbGFzc05hbWUgKz0gJyBmb2N1cyc7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0c2VsZiA9IHNlbGYucGFyZW50RWxlbWVudDtcblx0fVxufVxuXG4kKCAnI25hdmlnYXRpb24tZmVhdHVyZWQgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ0ZlYXR1cmVkIEJhciBMaW5rJywgJ0NsaWNrJywgdGhpcy5ocmVmICk7XG59KTtcblxuJCggJ2EuZ2xlYW4tc2lkZWJhcicgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1NpZGViYXIgU3VwcG9ydCBMaW5rJywgJ0NsaWNrJywgdGhpcy5ocmVmICk7XG59KTtcblxuJCggJ2EnLCAkKCAnLm8tc2l0ZS1zaWRlYmFyJyApICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHR2YXIgd2lkZ2V0X3RpdGxlID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS13aWRnZXQnICkuZmluZCggJ2gzJyApLnRleHQoKTtcblx0dmFyIHpvbmVfdGl0bGUgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0tem9uZScgKS5maW5kKCAnLmEtem9uZS10aXRsZScgKS50ZXh0KCk7XG5cdHZhciBzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSAnJztcblx0aWYgKCAnJyAhPT0gd2lkZ2V0X3RpdGxlICkge1xuXHRcdHNpZGViYXJfc2VjdGlvbl90aXRsZSA9IHdpZGdldF90aXRsZTtcblx0fSBlbHNlIGlmICggJycgIT09IHpvbmVfdGl0bGUgKSB7XG5cdFx0c2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gem9uZV90aXRsZTtcblx0fVxuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdTaWRlYmFyIExpbmsnLCAnQ2xpY2snLCBzaWRlYmFyX3NlY3Rpb25fdGl0bGUgKTtcbn0pO1xuXG4vLyB1c2VyIGFjY291bnQgbmF2aWdhdGlvbiBjYW4gYmUgYSBkcm9wZG93blxuJCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cblx0Ly8gaGlkZSBtZW51XG5cdGlmICggMCA8ICQoICcjdXNlci1hY2NvdW50LWFjY2VzcyB1bCcgKS5sZW5ndGggKSB7XG5cdFx0JCggJyN1c2VyLWFjY291bnQtYWNjZXNzID4gbGkgPiBhJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHQkKCAnI3VzZXItYWNjb3VudC1hY2Nlc3MgdWwnICkudG9nZ2xlQ2xhc3MoICd2aXNpYmxlJyApO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9KTtcblx0fVxufSk7XG4iLCJcbmpRdWVyeS5mbi50ZXh0Tm9kZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY29udGVudHMoKS5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoIHRoaXMubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmICcnICE9PSB0aGlzLm5vZGVWYWx1ZS50cmltKCkgKTtcblx0fSk7XG59O1xuXG5mdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0cmV0dXJuIG1hcmt1cDtcbn1cblxuZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCggJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nICk7XG5cdHZhciByZXN0X3Jvb3QgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0dmFyIGZ1bGxfdXJsICAgICAgICAgICA9IHJlc3Rfcm9vdCArICcvJyArICd1cGRhdGUtdXNlci8nO1xuXHR2YXIgY29uZmlybUNoYW5nZSAgICAgID0gJyc7XG5cdHZhciBuZXh0RW1haWxDb3VudCAgICAgPSAxO1xuXHR2YXIgbmV3UHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBvbGRQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIHByaW1hcnlJZCAgICAgICAgICA9ICcnO1xuXHR2YXIgZW1haWxUb1JlbW92ZSAgICAgID0gJyc7XG5cdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0dmFyIG5ld0VtYWlscyAgICAgICAgICA9IFtdO1xuXHR2YXIgYWpheF9mb3JtX2RhdGEgICAgID0gJyc7XG5cdHZhciB0aGF0ICAgICAgICAgICAgICAgPSAnJztcblxuXHQvLyBzdGFydCBvdXQgd2l0aCBubyBwcmltYXJ5L3JlbW92YWxzIGNoZWNrZWRcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0Ly8gaWYgdGhlcmUgaXMgYSBsaXN0IG9mIGVtYWlscyAobm90IGp1c3QgYSBzaW5nbGUgZm9ybSBmaWVsZClcblx0aWYgKCAwIDwgJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHNlbGVjdHMgYSBuZXcgcHJpbWFyeSwgbW92ZSBpdCBpbnRvIHRoYXQgcG9zaXRpb25cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScsIGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdFx0bmV3UHJpbWFyeUVtYWlsID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdHByaW1hcnlJZCAgICAgICA9ICQoIHRoaXMgKS5wcm9wKCAnaWQnICkucmVwbGFjZSggJ3ByaW1hcnlfZW1haWxfJywgJycgKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdwcmltYXJ5LWNoYW5nZScgKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXG5cdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBtYWluIGhpZGRlbiBmb3JtIHZhbHVlXG5cdFx0XHRcdCQoICcjZW1haWwnICkudmFsKCBuZXdQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBzdWJtaXQgZm9ybSB2YWx1ZXMuXG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cblx0XHRcdFx0Ly8gdW5jaGVjayB0aGUgcmFkaW8gYnV0dG9uXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIGZvcm0gdmFsdWVzIHRvIHRoZSBvbGQgcHJpbWFyeSBlbWFpbFxuXHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjcmVtb3ZlX2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgY29uZmlybSBtZXNzYWdlXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjaGFuZ2UnLCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG5cdFx0XHRcdGlmICggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICE9PSBlbWFpbFRvUmVtb3ZlICkge1xuXHRcdFx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscy5wdXNoKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlciBmb3IgcmVtb3ZhbFxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0Ly8gaWYgY29uZmlybWVkLCByZW1vdmUgdGhlIGVtYWlsIGFuZCBzdWJtaXQgdGhlIGZvcm1cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGknICkuZmFkZU91dCggJ25vcm1hbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0Y29uc29sZS5sb2coICd2YWx1ZSBpcyAnICsgY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gaWYgYSB1c2VyIHdhbnRzIHRvIGFkZCBhbiBlbWFpbCwgZ2l2ZSB0aGVtIGEgcHJvcGVybHkgbnVtYmVyZWQgZmllbGRcblx0JCggJy5tLWZvcm0tZW1haWwnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJyApLmJlZm9yZSggJzxkaXYgY2xhc3M9XCJhLWlucHV0LXdpdGgtYnV0dG9uIGEtYnV0dG9uLXNlbnRlbmNlXCI+PGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgaWQ9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgdmFsdWU9XCJcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBuYW1lPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGlkPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGNsYXNzPVwiYS1idXR0b24gYS1idXR0b24tYWRkLXVzZXItZW1haWxcIj5BZGQ8L2J1dHRvbj48L2Rpdj4nICk7XG5cdFx0bmV4dEVtYWlsQ291bnQrKztcblx0fSk7XG5cblx0JCggJ2lucHV0W3R5cGU9c3VibWl0XScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyIGJ1dHRvbiA9ICQoIHRoaXMgKTtcblx0XHR2YXIgYnV0dG9uX2Zvcm0gPSBidXR0b24uY2xvc2VzdCggJ2Zvcm0nICk7XG5cdFx0YnV0dG9uX2Zvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJywgYnV0dG9uLnZhbCgpICk7XG5cdH0pO1xuXG5cdCQoICcubS1lbnRyeS1jb250ZW50JyApLm9uKCAnc3VibWl0JywgJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0dmFyIGZvcm0gPSAkKCB0aGlzICk7XG5cdFx0dmFyIHN1Ym1pdHRpbmdfYnV0dG9uID0gZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nICkgfHwgJyc7XG5cblx0XHQvLyBpZiB0aGVyZSBpcyBubyBzdWJtaXR0aW5nIGJ1dHRvbiwgcGFzcyBpdCBieSBBamF4XG5cdFx0aWYgKCAnJyA9PT0gc3VibWl0dGluZ19idXR0b24gfHwgJ1NhdmUgQ2hhbmdlcycgIT09IHN1Ym1pdHRpbmdfYnV0dG9uICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGFqYXhfZm9ybV9kYXRhID0gZm9ybS5zZXJpYWxpemUoKTsgLy9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBhamF4X2Zvcm1fZGF0YSArICcmcmVzdD10cnVlJztcblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHVybDogZnVsbF91cmwsXG5cdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oIHhociApIHtcblx0XHRcdCAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0ICAgIH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhfZm9ybV9kYXRhXG5cdFx0XHR9KS5kb25lKCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0fSkuZ2V0KCk7XG5cdFx0XHRcdCQuZWFjaCggbmV3RW1haWxzLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICkge1xuXHRcdFx0XHRcdG5leHRFbWFpbENvdW50ID0gbmV4dEVtYWlsQ291bnQgKyBpbmRleDtcblx0XHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmFwcGVuZCggJzxsaSBpZD1cInVzZXItZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPicgKyB2YWx1ZSArICc8dWwgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXVzZXItZW1haWwtYWN0aW9uc1wiPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1tYWtlLXByaW1hcnktZW1haWxcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW1hcnlfZW1haWxcIiBpZD1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+TWFrZSBQcmltYXJ5PC9zbWFsbD48L2xhYmVsPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLWVtYWlsLXByZWZlcmVuY2VzXCI+PGEgaHJlZj1cIi9uZXdzbGV0dGVycy8/ZW1haWw9JyArIGVuY29kZVVSSUNvbXBvbmVudCggdmFsdWUgKSArICdcIj48c21hbGw+RW1haWwgUHJlZmVyZW5jZXM8L3NtYWxsPjwvYT48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggJCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoKSArICcsJyArIHZhbHVlICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggMCA9PT0gJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIGl0IHdvdWxkIGJlIG5pY2UgdG8gb25seSBsb2FkIHRoZSBmb3JtLCBidXQgdGhlbiBjbGljayBldmVudHMgc3RpbGwgZG9uJ3Qgd29ya1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIDAgPCAkKCAnLm0tZm9ybS1lbWFpbCcgKS5sZW5ndGggKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cbn0pO1xuIiwiLy8gYmFzZWQgb24gd2hpY2ggYnV0dG9uIHdhcyBjbGlja2VkLCBzZXQgdGhlIHZhbHVlcyBmb3IgdGhlIGFuYWx5dGljcyBldmVudCBhbmQgY3JlYXRlIGl0XG5mdW5jdGlvbiB0cmFja1Nob3dDb21tZW50cyggYWx3YXlzLCBpZCwgY2xpY2tfdmFsdWUgKSB7XG5cdHZhciBhY3Rpb24gICAgICAgICAgPSAnJztcblx0dmFyIGNhdGVnb3J5X3ByZWZpeCA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlfc3VmZml4ID0gJyc7XG5cdHZhciBwb3NpdGlvbiAgICAgICAgPSAnJztcblx0cG9zaXRpb24gPSBpZC5yZXBsYWNlKCAnYWx3YXlzLXNob3ctY29tbWVudHMtJywgJycgKTtcblx0aWYgKCAnMScgPT09IGNsaWNrX3ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPbic7XG5cdH0gZWxzZSBpZiAoICcwJyA9PT0gY2xpY2tfdmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09mZic7XG5cdH0gZWxzZSB7XG5cdFx0YWN0aW9uID0gJ0NsaWNrJztcblx0fVxuXHRpZiAoIHRydWUgPT09IGFsd2F5cyApIHtcblx0XHRjYXRlZ29yeV9wcmVmaXggPSAnQWx3YXlzICc7XG5cdH1cblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbi5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgcG9zaXRpb24uc2xpY2UoIDEgKTtcblx0XHRjYXRlZ29yeV9zdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgY2F0ZWdvcnlfcHJlZml4ICsgJ1Nob3cgQ29tbWVudHMnICsgY2F0ZWdvcnlfc3VmZml4LCBhY3Rpb24sIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59XG5cbi8vIHdoZW4gc2hvd2luZyBjb21tZW50cyBvbmNlLCB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1idXR0b24tc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR0cmFja1Nob3dDb21tZW50cyggZmFsc2UsICcnLCAnJyApO1xufSk7XG5cbi8vIFNldCB1c2VyIG1ldGEgdmFsdWUgZm9yIGFsd2F5cyBzaG93aW5nIGNvbW1lbnRzIGlmIHRoYXQgYnV0dG9uIGlzIGNsaWNrZWRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR2YXIgdGhhdCA9ICQoIHRoaXMgKTtcblx0aWYgKCB0aGF0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9IGVsc2Uge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvLyB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcblx0dHJhY2tTaG93Q29tbWVudHMoIHRydWUsIHRoYXQuYXR0ciggJ2lkJyApLCB0aGF0LnZhbCgpICk7XG5cblx0Ly8gd2UgYWxyZWFkeSBoYXZlIGFqYXh1cmwgZnJvbSB0aGUgdGhlbWVcblx0JC5hamF4KHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBhamF4dXJsLFxuXHRcdGRhdGE6IHtcbiAgICAgICAgXHQnYWN0aW9uJzogJ21pbm5wb3N0X2xhcmdvX2xvYWRfY29tbWVudHNfc2V0X3VzZXJfbWV0YScsXG4gICAgICAgIFx0J3ZhbHVlJzogdGhhdC52YWwoKVxuXHRcdH0sXG5cdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuICAgICAgICBcdCQoICcuYS1hbHdheXMtc2hvdy1jb21tZW50cy1yZXN1bHQnLCB0aGF0LnBhcmVudCgpICkuaHRtbCggcmVzcG9uc2UuZGF0YS5tZXNzYWdlICk7XG4gICAgICAgIFx0aWYgKCB0cnVlID09PSByZXNwb25zZS5kYXRhLnNob3cgKSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDAgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDEgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG4iXX0=
}(jQuery));
