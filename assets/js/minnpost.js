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
document.addEventListener("click", function (event) {
  navButton.setAttribute('aria-expanded', false); //let menu = navButton.nextElementSibling;

  menu.hidden = true;
}, true);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAwLXN0YXJ0LmpzIiwiMDEtZm9udHMuanMiLCIwMi1hbmFseXRpY3MuanMiLCIwMy1zaGFyZS5qcyIsIjA0LW5hdmlnYXRpb24uanMiLCIwNS1mb3Jtcy5qcyIsIjA2LWNvbW1lbnRzLmpzIl0sIm5hbWVzIjpbInRsaXRlIiwidCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJpIiwidGFyZ2V0IiwibiIsInBhcmVudEVsZW1lbnQiLCJzaG93IiwidG9vbHRpcCIsIm8iLCJoaWRlIiwibCIsInIiLCJjbGFzc05hbWUiLCJzIiwib2Zmc2V0VG9wIiwib2Zmc2V0TGVmdCIsIm9mZnNldFBhcmVudCIsIm9mZnNldFdpZHRoIiwib2Zmc2V0SGVpZ2h0IiwiZCIsImYiLCJhIiwic3R5bGUiLCJ0b3AiLCJsZWZ0IiwiY3JlYXRlRWxlbWVudCIsImdyYXYiLCJnZXRBdHRyaWJ1dGUiLCJpbm5lckhUTUwiLCJhcHBlbmRDaGlsZCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImJvdHRvbSIsIndpbmRvdyIsImlubmVySGVpZ2h0IiwicmlnaHQiLCJpbm5lcldpZHRoIiwidGl0bGUiLCJzZXRBdHRyaWJ1dGUiLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwibW9kdWxlIiwiZXhwb3J0cyIsIiQiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwic2Vzc2lvblN0b3JhZ2UiLCJzZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsIiwic2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsIiwiZG9jdW1lbnRFbGVtZW50IiwiZyIsInB1c2giLCJsZW5ndGgiLCJtIiwic2hpZnQiLCJwIiwiYiIsInEiLCJjIiwidSIsIlR5cGVFcnJvciIsInRoZW4iLCJjYWxsIiwidiIsImgiLCJwcm90b3R5cGUiLCJ3IiwiayIsIngiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJhY2UiLCJhbGwiLCJhdHRhY2hFdmVudCIsImJvZHkiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVhZHlTdGF0ZSIsImRldGFjaEV2ZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJjc3NUZXh0IiwieiIsIndpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbFdpZHRoIiwiQSIsIkIiLCJmYW1pbHkiLCJ3ZWlnaHQiLCJzdHJldGNoIiwiQyIsIkQiLCJFIiwiRiIsIkciLCJKIiwidGVzdCIsIm5hdmlnYXRvciIsInZlbmRvciIsImV4ZWMiLCJ1c2VyQWdlbnQiLCJwYXJzZUludCIsImZvbnRzIiwiSyIsImZvbnQiLCJMIiwiam9pbiIsImxvYWQiLCJIIiwiRGF0ZSIsImdldFRpbWUiLCJNIiwiRXJyb3IiLCJOIiwieSIsIkkiLCJoaWRkZW4iLCJkaXIiLCJGb250RmFjZU9ic2VydmVyIiwic2Fuc05vcm1hbCIsInNhbnNCb2xkIiwic2Fuc05vcm1hbEl0YWxpYyIsInNlcmlmQm9vayIsInNlcmlmQm9va0l0YWxpYyIsInNlcmlmQm9sZCIsInNlcmlmQm9sZEl0YWxpYyIsInNlcmlmQmxhY2siLCJzZXJpZkJsYWNrSXRhbGljIiwibXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50IiwidHlwZSIsImNhdGVnb3J5IiwiYWN0aW9uIiwibGFiZWwiLCJ2YWx1ZSIsImdhIiwicmVhZHkiLCJQVU0iLCJjdXJyZW50X3BvcHVwIiwiZ2V0UG9wdXAiLCJzZXR0aW5ncyIsImdldFNldHRpbmdzIiwicG9wdXBfaWQiLCJpZCIsIm9uIiwiY2xvc2VfdHJpZ2dlciIsImZuIiwicG9wbWFrZSIsImxhc3RfY2xvc2VfdHJpZ2dlciIsImNsaWNrIiwidXJsIiwiYXR0ciIsIm1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSIsInVybF9hY2Nlc3NfbGV2ZWwiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiY3VycmVudF91c2VyIiwiY2FuX2FjY2VzcyIsInRyYWNrU2hhcmUiLCJ0ZXh0IiwicG9zaXRpb24iLCJqUXVlcnkiLCJoYXNDbGFzcyIsImNvcHlDdXJyZW50VVJMIiwiZHVtbXkiLCJocmVmIiwic2VsZWN0IiwiZXhlY0NvbW1hbmQiLCJkYXRhIiwicHJldmVudERlZmF1bHQiLCJwcmludCIsIm9wZW4iLCJuYXZCdXR0b24iLCJxdWVyeVNlbGVjdG9yIiwibWVudSIsIm5leHRFbGVtZW50U2libGluZyIsImV4cGFuZGVkIiwia2V5dXAiLCJrZXlDb2RlIiwiZXZlbnQiLCJzZXR1cE5hdlNlYXJjaCIsImNvbnRhaW5lciIsIm5hdnNlYXJjaGNvbnRhaW5lciIsIm5hdnNlYXJjaHRvZ2dsZSIsIm5hdnNlYXJjaGZvcm0iLCJnZXRFbGVtZW50QnlJZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiJHRhcmdldCIsImNsb3Nlc3QiLCJpcyIsInJlcGxhY2UiLCJwcm9wIiwiaW5kZXhPZiIsInNldHVwTWVudSIsImJ1dHRvbiIsImxpbmtzIiwibGVuIiwiZGlzcGxheSIsIm9uY2xpY2siLCJ0b2dnbGVGb2N1cyIsInRvdWNoU3RhcnRGbiIsInBhcmVudExpbmsiLCJxdWVyeVNlbGVjdG9yQWxsIiwibWVudUl0ZW0iLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImNoaWxkcmVuIiwicmVtb3ZlIiwiYWRkIiwic2VsZiIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsIndpZGdldF90aXRsZSIsImZpbmQiLCJ6b25lX3RpdGxlIiwic2lkZWJhcl9zZWN0aW9uX3RpdGxlIiwidG9nZ2xlQ2xhc3MiLCJ0ZXh0Tm9kZXMiLCJjb250ZW50cyIsImZpbHRlciIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSIsIm5vZGVWYWx1ZSIsInRyaW0iLCJnZXRDb25maXJtQ2hhbmdlTWFya3VwIiwibWFya3VwIiwibWFuYWdlRW1haWxzIiwiZm9ybSIsInJlc3Rfcm9vdCIsInVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QiLCJzaXRlX3VybCIsInJlc3RfbmFtZXNwYWNlIiwiZnVsbF91cmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheF9mb3JtX2RhdGEiLCJ0aGF0IiwidmFsIiwicGFyZW50IiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJpbmRleCIsImdldCIsInBhcmVudHMiLCJmYWRlT3V0IiwiY29uc29sZSIsImxvZyIsImJlZm9yZSIsImJ1dHRvbl9mb3JtIiwic3VibWl0dGluZ19idXR0b24iLCJzZXJpYWxpemUiLCJhamF4IiwiYmVmb3JlU2VuZCIsInhociIsInNldFJlcXVlc3RIZWFkZXIiLCJub25jZSIsImRhdGFUeXBlIiwiZG9uZSIsIm1hcCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiY2xpY2tfdmFsdWUiLCJjYXRlZ29yeV9wcmVmaXgiLCJjYXRlZ29yeV9zdWZmaXgiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiYWpheHVybCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImh0bWwiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLEtBQVQsQ0FBZUMsQ0FBZixFQUFpQjtBQUFDQyxFQUFBQSxRQUFRLENBQUNDLGdCQUFULENBQTBCLFdBQTFCLEVBQXNDLFVBQVNDLENBQVQsRUFBVztBQUFDLFFBQUlDLENBQUMsR0FBQ0QsQ0FBQyxDQUFDRSxNQUFSO0FBQUEsUUFBZUMsQ0FBQyxHQUFDTixDQUFDLENBQUNJLENBQUQsQ0FBbEI7QUFBc0JFLElBQUFBLENBQUMsS0FBR0EsQ0FBQyxHQUFDLENBQUNGLENBQUMsR0FBQ0EsQ0FBQyxDQUFDRyxhQUFMLEtBQXFCUCxDQUFDLENBQUNJLENBQUQsQ0FBM0IsQ0FBRCxFQUFpQ0UsQ0FBQyxJQUFFUCxLQUFLLENBQUNTLElBQU4sQ0FBV0os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QVNGLFFBQVEsQ0FBQ2pILElBQVQsQ0FBY2xLLElBQTVCLEVBQW1DO0FBQ3hDc0MsUUFBQUEsQ0FBQyxDQUFFLGtDQUFGLENBQUQsQ0FBd0N3TSxHQUF4QyxDQUE2QyxDQUE3QztBQUNBLE9BRkssTUFFQztBQUNOeE0sUUFBQUEsQ0FBQyxDQUFFLGtDQUFGLENBQUQsQ0FBd0N3TSxHQUF4QyxDQUE2QyxDQUE3QztBQUNBO0FBQ0Q7QUFkSyxHQUFQO0FBZ0JBLENBNUJEIiwiZmlsZSI6Im1pbm5wb3N0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gdGxpdGUodCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLGZ1bmN0aW9uKGUpe3ZhciBpPWUudGFyZ2V0LG49dChpKTtufHwobj0oaT1pLnBhcmVudEVsZW1lbnQpJiZ0KGkpKSxuJiZ0bGl0ZS5zaG93KGksbiwhMCl9KX10bGl0ZS5zaG93PWZ1bmN0aW9uKHQsZSxpKXt2YXIgbj1cImRhdGEtdGxpdGVcIjtlPWV8fHt9LCh0LnRvb2x0aXB8fGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gbygpe3RsaXRlLmhpZGUodCwhMCl9ZnVuY3Rpb24gbCgpe3J8fChyPWZ1bmN0aW9uKHQsZSxpKXtmdW5jdGlvbiBuKCl7by5jbGFzc05hbWU9XCJ0bGl0ZSB0bGl0ZS1cIityK3M7dmFyIGU9dC5vZmZzZXRUb3AsaT10Lm9mZnNldExlZnQ7by5vZmZzZXRQYXJlbnQ9PT10JiYoZT1pPTApO3ZhciBuPXQub2Zmc2V0V2lkdGgsbD10Lm9mZnNldEhlaWdodCxkPW8ub2Zmc2V0SGVpZ2h0LGY9by5vZmZzZXRXaWR0aCxhPWkrbi8yO28uc3R5bGUudG9wPShcInNcIj09PXI/ZS1kLTEwOlwiblwiPT09cj9lK2wrMTA6ZStsLzItZC8yKStcInB4XCIsby5zdHlsZS5sZWZ0PShcIndcIj09PXM/aTpcImVcIj09PXM/aStuLWY6XCJ3XCI9PT1yP2krbisxMDpcImVcIj09PXI/aS1mLTEwOmEtZi8yKStcInB4XCJ9dmFyIG89ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksbD1pLmdyYXZ8fHQuZ2V0QXR0cmlidXRlKFwiZGF0YS10bGl0ZVwiKXx8XCJuXCI7by5pbm5lckhUTUw9ZSx0LmFwcGVuZENoaWxkKG8pO3ZhciByPWxbMF18fFwiXCIscz1sWzFdfHxcIlwiO24oKTt2YXIgZD1vLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVyblwic1wiPT09ciYmZC50b3A8MD8ocj1cIm5cIixuKCkpOlwiblwiPT09ciYmZC5ib3R0b20+d2luZG93LmlubmVySGVpZ2h0PyhyPVwic1wiLG4oKSk6XCJlXCI9PT1yJiZkLmxlZnQ8MD8ocj1cIndcIixuKCkpOlwid1wiPT09ciYmZC5yaWdodD53aW5kb3cuaW5uZXJXaWR0aCYmKHI9XCJlXCIsbigpKSxvLmNsYXNzTmFtZSs9XCIgdGxpdGUtdmlzaWJsZVwiLG99KHQsZCxlKSl9dmFyIHIscyxkO3JldHVybiB0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixvKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsbyksdC50b29sdGlwPXtzaG93OmZ1bmN0aW9uKCl7ZD10LnRpdGxlfHx0LmdldEF0dHJpYnV0ZShuKXx8ZCx0LnRpdGxlPVwiXCIsdC5zZXRBdHRyaWJ1dGUobixcIlwiKSxkJiYhcyYmKHM9c2V0VGltZW91dChsLGk/MTUwOjEpKX0saGlkZTpmdW5jdGlvbih0KXtpZihpPT09dCl7cz1jbGVhclRpbWVvdXQocyk7dmFyIGU9ciYmci5wYXJlbnROb2RlO2UmJmUucmVtb3ZlQ2hpbGQocikscj12b2lkIDB9fX19KHQsZSkpLnNob3coKX0sdGxpdGUuaGlkZT1mdW5jdGlvbih0LGUpe3QudG9vbHRpcCYmdC50b29sdGlwLmhpZGUoZSl9LFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9dGxpdGUpOyIsIiQoICdodG1sJyApLnJlbW92ZUNsYXNzKCAnbm8tanMnICkuYWRkQ2xhc3MoICdqcycgKTsiLCIvLyBPcHRpbWl6YXRpb24gZm9yIFJlcGVhdCBWaWV3c1xuaWYgKCBzZXNzaW9uU3RvcmFnZS5zZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsICYmIHNlc3Npb25TdG9yYWdlLnNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCApIHtcblx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIHNlcmlmLWZvbnRzLWxvYWRlZCBzYW5zLWZvbnRzLWxvYWRlZCc7XG59IGVsc2Uge1xuXHQvKiBGb250IEZhY2UgT2JzZXJ2ZXIgdjIuMS4wIC0gwqkgQnJhbSBTdGVpbi4gTGljZW5zZTogQlNELTMtQ2xhdXNlICovKGZ1bmN0aW9uKCl7J3VzZSBzdHJpY3QnO3ZhciBmLGc9W107ZnVuY3Rpb24gbChhKXtnLnB1c2goYSk7MT09Zy5sZW5ndGgmJmYoKX1mdW5jdGlvbiBtKCl7Zm9yKDtnLmxlbmd0aDspZ1swXSgpLGcuc2hpZnQoKX1mPWZ1bmN0aW9uKCl7c2V0VGltZW91dChtKX07ZnVuY3Rpb24gbihhKXt0aGlzLmE9cDt0aGlzLmI9dm9pZCAwO3RoaXMuZj1bXTt2YXIgYj10aGlzO3RyeXthKGZ1bmN0aW9uKGEpe3EoYixhKX0sZnVuY3Rpb24oYSl7cihiLGEpfSl9Y2F0Y2goYyl7cihiLGMpfX12YXIgcD0yO2Z1bmN0aW9uIHQoYSl7cmV0dXJuIG5ldyBuKGZ1bmN0aW9uKGIsYyl7YyhhKX0pfWZ1bmN0aW9uIHUoYSl7cmV0dXJuIG5ldyBuKGZ1bmN0aW9uKGIpe2IoYSl9KX1mdW5jdGlvbiBxKGEsYil7aWYoYS5hPT1wKXtpZihiPT1hKXRocm93IG5ldyBUeXBlRXJyb3I7dmFyIGM9ITE7dHJ5e3ZhciBkPWImJmIudGhlbjtpZihudWxsIT1iJiZcIm9iamVjdFwiPT10eXBlb2YgYiYmXCJmdW5jdGlvblwiPT10eXBlb2YgZCl7ZC5jYWxsKGIsZnVuY3Rpb24oYil7Y3x8cShhLGIpO2M9ITB9LGZ1bmN0aW9uKGIpe2N8fHIoYSxiKTtjPSEwfSk7cmV0dXJufX1jYXRjaChlKXtjfHxyKGEsZSk7cmV0dXJufWEuYT0wO2EuYj1iO3YoYSl9fVxuXHRmdW5jdGlvbiByKGEsYil7aWYoYS5hPT1wKXtpZihiPT1hKXRocm93IG5ldyBUeXBlRXJyb3I7YS5hPTE7YS5iPWI7dihhKX19ZnVuY3Rpb24gdihhKXtsKGZ1bmN0aW9uKCl7aWYoYS5hIT1wKWZvcig7YS5mLmxlbmd0aDspe3ZhciBiPWEuZi5zaGlmdCgpLGM9YlswXSxkPWJbMV0sZT1iWzJdLGI9YlszXTt0cnl7MD09YS5hP1wiZnVuY3Rpb25cIj09dHlwZW9mIGM/ZShjLmNhbGwodm9pZCAwLGEuYikpOmUoYS5iKToxPT1hLmEmJihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkP2UoZC5jYWxsKHZvaWQgMCxhLmIpKTpiKGEuYikpfWNhdGNoKGgpe2IoaCl9fX0pfW4ucHJvdG90eXBlLmc9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuYyh2b2lkIDAsYSl9O24ucHJvdG90eXBlLmM9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzO3JldHVybiBuZXcgbihmdW5jdGlvbihkLGUpe2MuZi5wdXNoKFthLGIsZCxlXSk7dihjKX0pfTtcblx0ZnVuY3Rpb24gdyhhKXtyZXR1cm4gbmV3IG4oZnVuY3Rpb24oYixjKXtmdW5jdGlvbiBkKGMpe3JldHVybiBmdW5jdGlvbihkKXtoW2NdPWQ7ZSs9MTtlPT1hLmxlbmd0aCYmYihoKX19dmFyIGU9MCxoPVtdOzA9PWEubGVuZ3RoJiZiKGgpO2Zvcih2YXIgaz0wO2s8YS5sZW5ndGg7ays9MSl1KGFba10pLmMoZChrKSxjKX0pfWZ1bmN0aW9uIHgoYSl7cmV0dXJuIG5ldyBuKGZ1bmN0aW9uKGIsYyl7Zm9yKHZhciBkPTA7ZDxhLmxlbmd0aDtkKz0xKXUoYVtkXSkuYyhiLGMpfSl9O3dpbmRvdy5Qcm9taXNlfHwod2luZG93LlByb21pc2U9bix3aW5kb3cuUHJvbWlzZS5yZXNvbHZlPXUsd2luZG93LlByb21pc2UucmVqZWN0PXQsd2luZG93LlByb21pc2UucmFjZT14LHdpbmRvdy5Qcm9taXNlLmFsbD13LHdpbmRvdy5Qcm9taXNlLnByb3RvdHlwZS50aGVuPW4ucHJvdG90eXBlLmMsd2luZG93LlByb21pc2UucHJvdG90eXBlW1wiY2F0Y2hcIl09bi5wcm90b3R5cGUuZyk7fSgpKTtcblxuXHQoZnVuY3Rpb24oKXtmdW5jdGlvbiBsKGEsYil7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9hLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIixiLCExKTphLmF0dGFjaEV2ZW50KFwic2Nyb2xsXCIsYil9ZnVuY3Rpb24gbShhKXtkb2N1bWVudC5ib2R5P2EoKTpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24gYygpe2RvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsYyk7YSgpfSk6ZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixmdW5jdGlvbiBrKCl7aWYoXCJpbnRlcmFjdGl2ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlfHxcImNvbXBsZXRlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGUpZG9jdW1lbnQuZGV0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixrKSxhKCl9KX07ZnVuY3Rpb24gdChhKXt0aGlzLmE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0aGlzLmEuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIik7dGhpcy5hLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGEpKTt0aGlzLmI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5jPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5nPS0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5jLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjtcblx0dGhpcy5mLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmguc3R5bGUuY3NzVGV4dD1cImRpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjIwMCU7aGVpZ2h0OjIwMCU7Zm9udC1zaXplOjE2cHg7bWF4LXdpZHRoOm5vbmU7XCI7dGhpcy5iLmFwcGVuZENoaWxkKHRoaXMuaCk7dGhpcy5jLmFwcGVuZENoaWxkKHRoaXMuZik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYyl9XG5cdGZ1bmN0aW9uIHUoYSxiKXthLmEuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1zeW50aGVzaXM6bm9uZTtmb250OlwiK2IrXCI7XCJ9ZnVuY3Rpb24geihhKXt2YXIgYj1hLmEub2Zmc2V0V2lkdGgsYz1iKzEwMDthLmYuc3R5bGUud2lkdGg9YytcInB4XCI7YS5jLnNjcm9sbExlZnQ9YzthLmIuc2Nyb2xsTGVmdD1hLmIuc2Nyb2xsV2lkdGgrMTAwO3JldHVybiBhLmchPT1iPyhhLmc9YiwhMCk6ITF9ZnVuY3Rpb24gQShhLGIpe2Z1bmN0aW9uIGMoKXt2YXIgYT1rO3ooYSkmJmEuYS5wYXJlbnROb2RlJiZiKGEuZyl9dmFyIGs9YTtsKGEuYixjKTtsKGEuYyxjKTt6KGEpfTtmdW5jdGlvbiBCKGEsYil7dmFyIGM9Ynx8e307dGhpcy5mYW1pbHk9YTt0aGlzLnN0eWxlPWMuc3R5bGV8fFwibm9ybWFsXCI7dGhpcy53ZWlnaHQ9Yy53ZWlnaHR8fFwibm9ybWFsXCI7dGhpcy5zdHJldGNoPWMuc3RyZXRjaHx8XCJub3JtYWxcIn12YXIgQz1udWxsLEQ9bnVsbCxFPW51bGwsRj1udWxsO2Z1bmN0aW9uIEcoKXtpZihudWxsPT09RClpZihKKCkmJi9BcHBsZS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnZlbmRvcikpe3ZhciBhPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtEPSEhYSYmNjAzPnBhcnNlSW50KGFbMV0sMTApfWVsc2UgRD0hMTtyZXR1cm4gRH1mdW5jdGlvbiBKKCl7bnVsbD09PUYmJihGPSEhZG9jdW1lbnQuZm9udHMpO3JldHVybiBGfVxuXHRmdW5jdGlvbiBLKCl7aWYobnVsbD09PUUpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dHJ5e2Euc3R5bGUuZm9udD1cImNvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmXCJ9Y2F0Y2goYil7fUU9XCJcIiE9PWEuc3R5bGUuZm9udH1yZXR1cm4gRX1mdW5jdGlvbiBMKGEsYil7cmV0dXJuW2Euc3R5bGUsYS53ZWlnaHQsSygpP2Euc3RyZXRjaDpcIlwiLFwiMTAwcHhcIixiXS5qb2luKFwiIFwiKX1cblx0Qi5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMsaz1hfHxcIkJFU2Jzd3lcIixyPTAsbj1ifHwzRTMsSD0obmV3IERhdGUpLmdldFRpbWUoKTtyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtpZihKKCkmJiFHKCkpe3ZhciBNPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gZSgpeyhuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PW4/YihFcnJvcihcIlwiK24rXCJtcyB0aW1lb3V0IGV4Y2VlZGVkXCIpKTpkb2N1bWVudC5mb250cy5sb2FkKEwoYywnXCInK2MuZmFtaWx5KydcIicpLGspLnRoZW4oZnVuY3Rpb24oYyl7MTw9Yy5sZW5ndGg/YSgpOnNldFRpbWVvdXQoZSwyNSl9LGIpfWUoKX0pLE49bmV3IFByb21pc2UoZnVuY3Rpb24oYSxjKXtyPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtjKEVycm9yKFwiXCIrbitcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpfSxuKX0pO1Byb21pc2UucmFjZShbTixNXSkudGhlbihmdW5jdGlvbigpe2NsZWFyVGltZW91dChyKTthKGMpfSxcblx0Yil9ZWxzZSBtKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gdigpe3ZhciBiO2lmKGI9LTEhPWYmJi0xIT1nfHwtMSE9ZiYmLTEhPWh8fC0xIT1nJiYtMSE9aCkoYj1mIT1nJiZmIT1oJiZnIT1oKXx8KG51bGw9PT1DJiYoYj0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCksQz0hIWImJig1MzY+cGFyc2VJbnQoYlsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGJbMV0sMTApJiYxMT49cGFyc2VJbnQoYlsyXSwxMCkpKSxiPUMmJihmPT13JiZnPT13JiZoPT13fHxmPT14JiZnPT14JiZoPT14fHxmPT15JiZnPT15JiZoPT15KSksYj0hYjtiJiYoZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksY2xlYXJUaW1lb3V0KHIpLGEoYykpfWZ1bmN0aW9uIEkoKXtpZigobmV3IERhdGUpLmdldFRpbWUoKS1IPj1uKWQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGIoRXJyb3IoXCJcIitcblx0bitcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpO2Vsc2V7dmFyIGE9ZG9jdW1lbnQuaGlkZGVuO2lmKCEwPT09YXx8dm9pZCAwPT09YSlmPWUuYS5vZmZzZXRXaWR0aCxnPXAuYS5vZmZzZXRXaWR0aCxoPXEuYS5vZmZzZXRXaWR0aCx2KCk7cj1zZXRUaW1lb3V0KEksNTApfX12YXIgZT1uZXcgdChrKSxwPW5ldyB0KGspLHE9bmV3IHQoayksZj0tMSxnPS0xLGg9LTEsdz0tMSx4PS0xLHk9LTEsZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2QuZGlyPVwibHRyXCI7dShlLEwoYyxcInNhbnMtc2VyaWZcIikpO3UocCxMKGMsXCJzZXJpZlwiKSk7dShxLEwoYyxcIm1vbm9zcGFjZVwiKSk7ZC5hcHBlbmRDaGlsZChlLmEpO2QuYXBwZW5kQ2hpbGQocC5hKTtkLmFwcGVuZENoaWxkKHEuYSk7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkKTt3PWUuYS5vZmZzZXRXaWR0aDt4PXAuYS5vZmZzZXRXaWR0aDt5PXEuYS5vZmZzZXRXaWR0aDtJKCk7QShlLGZ1bmN0aW9uKGEpe2Y9YTt2KCl9KTt1KGUsXG5cdEwoYywnXCInK2MuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO0EocCxmdW5jdGlvbihhKXtnPWE7digpfSk7dShwLEwoYywnXCInK2MuZmFtaWx5KydcIixzZXJpZicpKTtBKHEsZnVuY3Rpb24oYSl7aD1hO3YoKX0pO3UocSxMKGMsJ1wiJytjLmZhbWlseSsnXCIsbW9ub3NwYWNlJykpfSl9KX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9Qjood2luZG93LkZvbnRGYWNlT2JzZXJ2ZXI9Qix3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZD1CLnByb3RvdHlwZS5sb2FkKTt9KCkpO1xuXG5cdC8vIG1pbm5wb3N0IGZvbnRzXG5cblx0Ly8gc2Fuc1xuXHR2YXIgc2Fuc05vcm1hbCA9IG5ldyBGb250RmFjZU9ic2VydmVyKCAnZmYtbWV0YS13ZWItcHJvJyApO1xuXHR2YXIgc2Fuc0JvbGQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzYW5zTm9ybWFsSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNDAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXG5cdC8vIHNlcmlmXG5cdHZhciBzZXJpZkJvb2sgPSBuZXcgRm9udEZhY2VPYnNlcnZlciggXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNTAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCb29rSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNTAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCb2xkID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNzAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCb2xkSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNzAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCbGFjayA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDkwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQmxhY2tJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA5MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cblx0UHJvbWlzZS5hbGwoIFtcblx0XHRzYW5zTm9ybWFsLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zQm9sZC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc05vcm1hbEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb29rLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvb2tJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9sZC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb2xkSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJsYWNrLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJsYWNrSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKVxuXHRdICkudGhlbiggZnVuY3Rpb24oKSB7XG5cdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIHNlcmlmLWZvbnRzLWxvYWRlZCc7XG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsID0gdHJ1ZTtcblx0fSApO1xuXG5cdFByb21pc2UuYWxsKCBbXG5cdFx0c2Fuc05vcm1hbC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc0JvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNOb3JtYWxJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApXG5cdF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2Fucy1mb250cy1sb2FkZWQnO1xuXHRcdC8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5cdFx0c2Vzc2lvblN0b3JhZ2Uuc2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsID0gdHJ1ZTtcblx0fSApO1xufVxuXG4iLCJmdW5jdGlvbiBtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApIHtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGdhICkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB2YWx1ZSApIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuJCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oIGUgKSB7XG5cblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIFBVTSApIHtcblx0XHR2YXIgY3VycmVudF9wb3B1cCA9IFBVTS5nZXRQb3B1cCggJCggJy5wdW0nICkgKTtcblx0XHR2YXIgc2V0dGluZ3MgPSBQVU0uZ2V0U2V0dGluZ3MoICQoICcucHVtJyApICk7XG5cdFx0dmFyIHBvcHVwX2lkID0gc2V0dGluZ3MuaWQ7XG5cdFx0JCggZG9jdW1lbnQgKS5vbiggJ3B1bUFmdGVyT3BlbicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnU2hvdycsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSk7XG5cdFx0fSk7XG5cdFx0JCggZG9jdW1lbnQgKS5vbiggJ3B1bUFmdGVyQ2xvc2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJC5mbi5wb3BtYWtlLmxhc3RfY2xvc2VfdHJpZ2dlcjtcblx0XHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBjbG9zZV90cmlnZ2VyICkge1xuXHRcdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JCggJy5tZXNzYWdlLWNsb3NlJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGNsb3NlIGNsYXNzXG5cdFx0XHR2YXIgY2xvc2VfdHJpZ2dlciA9ICdDbG9zZSBCdXR0b24nO1xuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCBjbG9zZV90cmlnZ2VyLCBwb3B1cF9pZCwgeyAnbm9uSW50ZXJhY3Rpb24nOiAxIH0pO1xuXHRcdH0pO1xuXHRcdCQoICcubWVzc2FnZS1sb2dpbicgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIGxpbmsgd2l0aCBsb2dpbiBjbGFzc1xuXHRcdFx0dmFyIHVybCA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ0xvZ2luIExpbmsnLCB1cmwgKTtcblx0XHR9KTtcblx0XHQkKCAnLnB1bS1jb250ZW50IGE6bm90KCAubWVzc2FnZS1jbG9zZSwgLnB1bS1jbG9zZSwgLm1lc3NhZ2UtbG9naW4gKScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7IC8vIHVzZXIgY2xpY2tzIHNvbWV0aGluZyB0aGF0IGlzIG5vdCBjbG9zZSB0ZXh0IG9yIGNsb3NlIGljb25cblx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgJ0NsaWNrJywgcG9wdXBfaWQgKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEgJiYgJycgIT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS51cmxfYWNjZXNzX2xldmVsICkge1xuXHRcdHZhciB0eXBlID0gJ2V2ZW50Jztcblx0XHR2YXIgY2F0ZWdvcnkgPSAnTWVtYmVyIENvbnRlbnQnO1xuXHRcdHZhciBsYWJlbCA9IGxvY2F0aW9uLnBhdGhuYW1lOyAvLyBpIHRoaW5rIHdlIGNvdWxkIHBvc3NpYmx5IHB1dCBzb21lIGdyb3VwaW5nIGhlcmUsIGJ1dCB3ZSBkb24ndCBuZWNlc3NhcmlseSBoYXZlIGFjY2VzcyB0byBvbmUgYW5kIG1heWJlIGl0J3Mgbm90IHdvcnRod2hpbGUgeWV0XG5cdFx0dmFyIGFjdGlvbiA9ICdCbG9ja2VkJztcblx0XHRpZiAoIHRydWUgPT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS5jdXJyZW50X3VzZXIuY2FuX2FjY2VzcyApIHtcblx0XHRcdGFjdGlvbiA9ICdTaG93bic7XG5cdFx0fVxuXHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0fVxufSk7XG4iLCJmdW5jdGlvbiB0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiA9ICcnICkge1xuXG5cdC8vIGlmIGEgbm90IGxvZ2dlZCBpbiB1c2VyIHRyaWVzIHRvIGVtYWlsLCBkb24ndCBjb3VudCB0aGF0IGFzIGEgc2hhcmVcblx0aWYgKCAhIGpRdWVyeSggJ2JvZHknICkuaGFzQ2xhc3MoICdsb2dnZWQtaW4nICkgJiYgJ0VtYWlsJyA9PT0gdGV4dCApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgY2F0ZWdvcnkgPSAnU2hhcmUnO1xuXHRpZiAoICcnICE9PSBwb3NpdGlvbiApIHtcblx0XHRjYXRlZ29yeSA9ICdTaGFyZSAtICcgKyBwb3NpdGlvbjtcblx0fVxuXG5cdC8vIHRyYWNrIGFzIGFuIGV2ZW50LCBhbmQgYXMgc29jaWFsIGlmIGl0IGlzIHR3aXR0ZXIgb3IgZmJcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeSwgdGV4dCwgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGdhICkge1xuXHRcdGlmICggJ0ZhY2Vib29rJyA9PT0gdGV4dCB8fCAnVHdpdHRlcicgPT09IHRleHQgKSB7XG5cdFx0XHRpZiAoICdGYWNlYm9vaycgPT0gdGV4dCApIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdTaGFyZScsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1R3ZWV0JywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvcHlDdXJyZW50VVJMKCkge1xuXHR2YXIgZHVtbXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW5wdXQnICksIHRleHQgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggZHVtbXkgKTtcblx0ZHVtbXkudmFsdWUgPSB0ZXh0O1xuXHRkdW1teS5zZWxlY3QoKTtcblx0ZG9jdW1lbnQuZXhlY0NvbW1hbmQoICdjb3B5JyApO1xuXHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKCBkdW1teSApO1xufVxuXG4kKCAnLm0tZW50cnktc2hhcmUtdG9wIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHR2YXIgdGV4dCA9ICQoIHRoaXMgKS5kYXRhKCAnc2hhcmUtYWN0aW9uJyApO1xuXHR2YXIgcG9zaXRpb24gPSAndG9wJztcblx0dHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcbn0pO1xuXG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtcHJpbnQgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0d2luZG93LnByaW50KCk7XG59KTtcblxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWNvcHktdXJsIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRjb3B5Q3VycmVudFVSTCgpO1xuXHR0bGl0ZS5zaG93KCAoIGUudGFyZ2V0ICksIHsgZ3JhdjogJ3cnIH0gKTtcblx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0dGxpdGUuaGlkZSggKCBlLnRhcmdldCApICk7XG5cdH0sIDMwMDAgKTtcblx0cmV0dXJuIGZhbHNlO1xufSk7XG5cbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1mYWNlYm9vayBhLCAubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS10d2l0dGVyIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWVtYWlsIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHZhciB1cmwgPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG4gICAgd2luZG93Lm9wZW4oIHVybCwgJ19ibGFuaycgKTtcbn0pO1xuIiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogSGFuZGxlcyB0b2dnbGluZyB0aGUgbmF2aWdhdGlvbiBtZW51IGZvciBzbWFsbCBzY3JlZW5zIGFuZCBlbmFibGVzIFRBQiBrZXlcbiAqIG5hdmlnYXRpb24gc3VwcG9ydCBmb3IgZHJvcGRvd24gbWVudXMuXG4gKi9cblxuLy9zZXR1cE1lbnUoICduYXZpZ2F0aW9uLXByaW1hcnknICk7XG4vL3NldHVwTWVudSggJ25hdmlnYXRpb24tdXNlci1hY2NvdW50LW1hbmFnZW1lbnQnICk7XG4vL3NldHVwTmF2U2VhcmNoKCAnbmF2aWdhdGlvbi1wcmltYXJ5JyApO1xuXG52YXIgbmF2QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ25hdiBidXR0b24nICk7XG5sZXQgbWVudSA9IG5hdkJ1dHRvbi5uZXh0RWxlbWVudFNpYmxpbmc7XG5uYXZCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgbGV0IGV4cGFuZGVkID0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZScgfHwgZmFsc2U7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgIGxldCBtZW51ID0gdGhpcy5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgbWVudS5oaWRkZW4gPSAhIG1lbnUuaGlkZGVuO1xufSk7XG4vLyBlc2NhcGUga2V5IHByZXNzXG4kKGRvY3VtZW50KS5rZXl1cChmdW5jdGlvbihlKSB7XG5cdGlmICgyNyA9PT0gZS5rZXlDb2RlKSB7XG5cdFx0bmF2QnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXHRcdC8vbGV0IG1lbnUgPSBuYXZCdXR0b24ubmV4dEVsZW1lbnRTaWJsaW5nO1xuXHRcdG1lbnUuaGlkZGVuID0gdHJ1ZTtcblx0fVxufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG5cdFwiY2xpY2tcIiwgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdG5hdkJ1dHRvbi5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHQvL2xldCBtZW51ID0gbmF2QnV0dG9uLm5leHRFbGVtZW50U2libGluZztcblx0XHRtZW51LmhpZGRlbiA9IHRydWU7XG5cdH0sIHRydWVcbik7XG5cbmZ1bmN0aW9uIHNldHVwTmF2U2VhcmNoKCBjb250YWluZXIgKSB7XG5cblx0dmFyIG5hdnNlYXJjaGNvbnRhaW5lciwgbmF2c2VhcmNodG9nZ2xlLCBuYXZzZWFyY2hmb3JtO1xuXG5cdGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBjb250YWluZXIgKTtcblx0aWYgKCAhIGNvbnRhaW5lciApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRuYXZzZWFyY2hjb250YWluZXIgPSAkKCAnbGkuc2VhcmNoJywgJCggY29udGFpbmVyICkgKTtcblx0bmF2c2VhcmNodG9nZ2xlICAgID0gJCggJ2xpLnNlYXJjaCBhJywgJCggY29udGFpbmVyICkgKTtcblx0bmF2c2VhcmNoZm9ybSAgICAgID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnZm9ybScgKVswXTtcblxuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgbmF2c2VhcmNodG9nZ2xlIHx8ICd1bmRlZmluZWQnID09PSB0eXBlb2YgbmF2c2VhcmNoZm9ybSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZiAoIDAgPCAkKCBuYXZzZWFyY2hmb3JtICkubGVuZ3RoICkge1xuXHRcdCQoIGRvY3VtZW50ICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdHZhciAkdGFyZ2V0ID0gJCggZXZlbnQudGFyZ2V0ICk7XG5cdFx0XHRpZiAoICEgJHRhcmdldC5jbG9zZXN0KCBuYXZzZWFyY2hjb250YWluZXIgKS5sZW5ndGggJiYgJCggbmF2c2VhcmNoZm9ybSApLmlzKCAnOnZpc2libGUnICkgKSB7XG5cdFx0XHRcdG5hdnNlYXJjaGZvcm0uY2xhc3NOYW1lID0gbmF2c2VhcmNoZm9ybS5jbGFzc05hbWUucmVwbGFjZSggJyB0b2dnbGVkLWZvcm0nLCAnJyApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5wcm9wKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnJlbW92ZUNsYXNzKCAndG9nZ2xlZC1mb3JtJyApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0aWYgKCAtMSAhPT0gbmF2c2VhcmNoZm9ybS5jbGFzc05hbWUuaW5kZXhPZiggJ3RvZ2dsZWQtZm9ybScgKSApIHtcblx0XHRcdFx0bmF2c2VhcmNoZm9ybS5jbGFzc05hbWUgPSBuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZS5yZXBsYWNlKCAnIHRvZ2dsZWQtZm9ybScsICcnICk7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnByb3AoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRcdFx0JCggbmF2c2VhcmNodG9nZ2xlICkucmVtb3ZlQ2xhc3MoICd0b2dnbGVkLWZvcm0nICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuYXZzZWFyY2hmb3JtLmNsYXNzTmFtZSArPSAnIHRvZ2dsZWQtZm9ybSc7XG5cdFx0XHRcdCQoIG5hdnNlYXJjaHRvZ2dsZSApLnByb3AoICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSApO1xuXHRcdFx0XHQkKCBuYXZzZWFyY2h0b2dnbGUgKS5hZGRDbGFzcyggJ3RvZ2dsZWQtZm9ybScgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBzZXR1cE1lbnUoIGNvbnRhaW5lciApIHtcblx0dmFyIGJ1dHRvbiwgbWVudSwgbGlua3MsIGksIGxlbjtcblx0Y29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGNvbnRhaW5lciApO1xuXHRpZiAoICEgY29udGFpbmVyICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGJ1dHRvbiA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2J1dHRvbicgKVswXTtcblx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIGJ1dHRvbiApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRtZW51ID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAndWwnIClbMF07XG5cblx0Ly8gSGlkZSBtZW51IHRvZ2dsZSBidXR0b24gaWYgbWVudSBpcyBlbXB0eSBhbmQgcmV0dXJuIGVhcmx5LlxuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgbWVudSApIHtcblx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRyZXR1cm47XG5cdH1cblxuXHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdGlmICggLTEgPT09IG1lbnUuY2xhc3NOYW1lLmluZGV4T2YoICdtZW51JyApICkge1xuXHRcdG1lbnUuY2xhc3NOYW1lICs9ICcgbWVudSc7XG5cdH1cblxuXHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggLTEgIT09IGNvbnRhaW5lci5jbGFzc05hbWUuaW5kZXhPZiggJ3RvZ2dsZWQnICkgKSB7XG5cdFx0XHRjb250YWluZXIuY2xhc3NOYW1lID0gY29udGFpbmVyLmNsYXNzTmFtZS5yZXBsYWNlKCAnIHRvZ2dsZWQnLCAnJyApO1xuXHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgKz0gJyB0b2dnbGVkJztcblx0XHRcdGJ1dHRvbi5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnICk7XG5cdFx0XHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gR2V0IGFsbCB0aGUgbGluayBlbGVtZW50cyB3aXRoaW4gdGhlIG1lbnUuXG5cdGxpbmtzICAgID0gbWVudS5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2EnICk7XG5cblx0Ly8gRWFjaCB0aW1lIGEgbWVudSBsaW5rIGlzIGZvY3VzZWQgb3IgYmx1cnJlZCwgdG9nZ2xlIGZvY3VzLlxuXHRmb3IgKCBpID0gMCwgbGVuID0gbGlua3MubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0bGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ2ZvY3VzJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0XHRsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCAnYmx1cicsIHRvZ2dsZUZvY3VzLCB0cnVlICk7XG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyBgZm9jdXNgIGNsYXNzIHRvIGFsbG93IHN1Ym1lbnUgYWNjZXNzIG9uIHRhYmxldHMuXG5cdCAqL1xuXHQoIGZ1bmN0aW9uKCBjb250YWluZXIgKSB7XG5cdFx0dmFyIHRvdWNoU3RhcnRGbiwgaSxcblx0XHRcdHBhcmVudExpbmsgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCggJy5tZW51LWl0ZW0taGFzLWNoaWxkcmVuID4gYSwgLnBhZ2VfaXRlbV9oYXNfY2hpbGRyZW4gPiBhJyApO1xuXG5cdFx0aWYgKCAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgKSB7XG5cdFx0XHR0b3VjaFN0YXJ0Rm4gPSBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0dmFyIG1lbnVJdGVtID0gdGhpcy5wYXJlbnROb2RlLFxuXHRcdFx0XHRcdGk7XG5cblx0XHRcdFx0aWYgKCAhIG1lbnVJdGVtLmNsYXNzTGlzdC5jb250YWlucyggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW4ubGVuZ3RoOyArK2kgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1lbnVJdGVtID09PSBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbltpXS5jbGFzc0xpc3QucmVtb3ZlKCAnZm9jdXMnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG1lbnVJdGVtLmNsYXNzTGlzdC5hZGQoICdmb2N1cycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZW51SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCAnZm9jdXMnICk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGZvciAoIGkgPSAwOyBpIDwgcGFyZW50TGluay5sZW5ndGg7ICsraSApIHtcblx0XHRcdFx0cGFyZW50TGlua1tpXS5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIHRvdWNoU3RhcnRGbiwgZmFsc2UgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0oIGNvbnRhaW5lciApICk7XG59XG5cbi8qKlxuICogU2V0cyBvciByZW1vdmVzIC5mb2N1cyBjbGFzcyBvbiBhbiBlbGVtZW50LlxuICovXG5mdW5jdGlvbiB0b2dnbGVGb2N1cygpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdC8vIE1vdmUgdXAgdGhyb3VnaCB0aGUgYW5jZXN0b3JzIG9mIHRoZSBjdXJyZW50IGxpbmsgdW50aWwgd2UgaGl0IC5uYXYtbWVudS5cblx0d2hpbGUgKCAtMSA9PT0gc2VsZi5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cblx0XHQvLyBPbiBsaSBlbGVtZW50cyB0b2dnbGUgdGhlIGNsYXNzIC5mb2N1cy5cblx0XHRpZiAoICdsaScgPT09IHNlbGYudGFnTmFtZS50b0xvd2VyQ2FzZSgpICkge1xuXHRcdFx0aWYgKCAtMSAhPT0gc2VsZi5jbGFzc05hbWUuaW5kZXhPZiggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRzZWxmLmNsYXNzTmFtZSA9IHNlbGYuY2xhc3NOYW1lLnJlcGxhY2UoICcgZm9jdXMnLCAnJyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VsZi5jbGFzc05hbWUgKz0gJyBmb2N1cyc7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0c2VsZiA9IHNlbGYucGFyZW50RWxlbWVudDtcblx0fVxufVxuXG4kKCAnI25hdmlnYXRpb24tZmVhdHVyZWQgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ0ZlYXR1cmVkIEJhciBMaW5rJywgJ0NsaWNrJywgdGhpcy5ocmVmICk7XG59KTtcblxuJCggJ2EuZ2xlYW4tc2lkZWJhcicgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1NpZGViYXIgU3VwcG9ydCBMaW5rJywgJ0NsaWNrJywgdGhpcy5ocmVmICk7XG59KTtcblxuJCggJ2EnLCAkKCAnLm8tc2l0ZS1zaWRlYmFyJyApICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHR2YXIgd2lkZ2V0X3RpdGxlID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS13aWRnZXQnICkuZmluZCggJ2gzJyApLnRleHQoKTtcblx0dmFyIHpvbmVfdGl0bGUgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0tem9uZScgKS5maW5kKCAnLmEtem9uZS10aXRsZScgKS50ZXh0KCk7XG5cdHZhciBzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSAnJztcblx0aWYgKCAnJyAhPT0gd2lkZ2V0X3RpdGxlICkge1xuXHRcdHNpZGViYXJfc2VjdGlvbl90aXRsZSA9IHdpZGdldF90aXRsZTtcblx0fSBlbHNlIGlmICggJycgIT09IHpvbmVfdGl0bGUgKSB7XG5cdFx0c2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gem9uZV90aXRsZTtcblx0fVxuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdTaWRlYmFyIExpbmsnLCAnQ2xpY2snLCBzaWRlYmFyX3NlY3Rpb25fdGl0bGUgKTtcbn0pO1xuXG4vLyB1c2VyIGFjY291bnQgbmF2aWdhdGlvbiBjYW4gYmUgYSBkcm9wZG93blxuJCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cblx0Ly8gaGlkZSBtZW51XG5cdGlmICggMCA8ICQoICcjdXNlci1hY2NvdW50LWFjY2VzcyB1bCcgKS5sZW5ndGggKSB7XG5cdFx0JCggJyN1c2VyLWFjY291bnQtYWNjZXNzID4gbGkgPiBhJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHQkKCAnI3VzZXItYWNjb3VudC1hY2Nlc3MgdWwnICkudG9nZ2xlQ2xhc3MoICd2aXNpYmxlJyApO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9KTtcblx0fVxufSk7XG4iLCJcbmpRdWVyeS5mbi50ZXh0Tm9kZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY29udGVudHMoKS5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoIHRoaXMubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmICcnICE9PSB0aGlzLm5vZGVWYWx1ZS50cmltKCkgKTtcblx0fSk7XG59O1xuXG5mdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0cmV0dXJuIG1hcmt1cDtcbn1cblxuZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCggJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nICk7XG5cdHZhciByZXN0X3Jvb3QgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0dmFyIGZ1bGxfdXJsICAgICAgICAgICA9IHJlc3Rfcm9vdCArICcvJyArICd1cGRhdGUtdXNlci8nO1xuXHR2YXIgY29uZmlybUNoYW5nZSAgICAgID0gJyc7XG5cdHZhciBuZXh0RW1haWxDb3VudCAgICAgPSAxO1xuXHR2YXIgbmV3UHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBvbGRQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIHByaW1hcnlJZCAgICAgICAgICA9ICcnO1xuXHR2YXIgZW1haWxUb1JlbW92ZSAgICAgID0gJyc7XG5cdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0dmFyIG5ld0VtYWlscyAgICAgICAgICA9IFtdO1xuXHR2YXIgYWpheF9mb3JtX2RhdGEgICAgID0gJyc7XG5cdHZhciB0aGF0ICAgICAgICAgICAgICAgPSAnJztcblxuXHQvLyBzdGFydCBvdXQgd2l0aCBubyBwcmltYXJ5L3JlbW92YWxzIGNoZWNrZWRcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0Ly8gaWYgdGhlcmUgaXMgYSBsaXN0IG9mIGVtYWlscyAobm90IGp1c3QgYSBzaW5nbGUgZm9ybSBmaWVsZClcblx0aWYgKCAwIDwgJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHNlbGVjdHMgYSBuZXcgcHJpbWFyeSwgbW92ZSBpdCBpbnRvIHRoYXQgcG9zaXRpb25cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScsIGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdFx0bmV3UHJpbWFyeUVtYWlsID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdHByaW1hcnlJZCAgICAgICA9ICQoIHRoaXMgKS5wcm9wKCAnaWQnICkucmVwbGFjZSggJ3ByaW1hcnlfZW1haWxfJywgJycgKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdwcmltYXJ5LWNoYW5nZScgKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXG5cdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBtYWluIGhpZGRlbiBmb3JtIHZhbHVlXG5cdFx0XHRcdCQoICcjZW1haWwnICkudmFsKCBuZXdQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBzdWJtaXQgZm9ybSB2YWx1ZXMuXG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cblx0XHRcdFx0Ly8gdW5jaGVjayB0aGUgcmFkaW8gYnV0dG9uXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIGZvcm0gdmFsdWVzIHRvIHRoZSBvbGQgcHJpbWFyeSBlbWFpbFxuXHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjcmVtb3ZlX2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgY29uZmlybSBtZXNzYWdlXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjaGFuZ2UnLCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG5cdFx0XHRcdGlmICggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICE9PSBlbWFpbFRvUmVtb3ZlICkge1xuXHRcdFx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscy5wdXNoKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlciBmb3IgcmVtb3ZhbFxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0Ly8gaWYgY29uZmlybWVkLCByZW1vdmUgdGhlIGVtYWlsIGFuZCBzdWJtaXQgdGhlIGZvcm1cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGknICkuZmFkZU91dCggJ25vcm1hbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0Y29uc29sZS5sb2coICd2YWx1ZSBpcyAnICsgY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gaWYgYSB1c2VyIHdhbnRzIHRvIGFkZCBhbiBlbWFpbCwgZ2l2ZSB0aGVtIGEgcHJvcGVybHkgbnVtYmVyZWQgZmllbGRcblx0JCggJy5tLWZvcm0tZW1haWwnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJyApLmJlZm9yZSggJzxkaXYgY2xhc3M9XCJhLWlucHV0LXdpdGgtYnV0dG9uIGEtYnV0dG9uLXNlbnRlbmNlXCI+PGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgaWQ9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgdmFsdWU9XCJcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBuYW1lPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGlkPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGNsYXNzPVwiYS1idXR0b24gYS1idXR0b24tYWRkLXVzZXItZW1haWxcIj5BZGQ8L2J1dHRvbj48L2Rpdj4nICk7XG5cdFx0bmV4dEVtYWlsQ291bnQrKztcblx0fSk7XG5cblx0JCggJ2lucHV0W3R5cGU9c3VibWl0XScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyIGJ1dHRvbiA9ICQoIHRoaXMgKTtcblx0XHR2YXIgYnV0dG9uX2Zvcm0gPSBidXR0b24uY2xvc2VzdCggJ2Zvcm0nICk7XG5cdFx0YnV0dG9uX2Zvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJywgYnV0dG9uLnZhbCgpICk7XG5cdH0pO1xuXG5cdCQoICcubS1lbnRyeS1jb250ZW50JyApLm9uKCAnc3VibWl0JywgJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0dmFyIGZvcm0gPSAkKCB0aGlzICk7XG5cdFx0dmFyIHN1Ym1pdHRpbmdfYnV0dG9uID0gZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nICkgfHwgJyc7XG5cblx0XHQvLyBpZiB0aGVyZSBpcyBubyBzdWJtaXR0aW5nIGJ1dHRvbiwgcGFzcyBpdCBieSBBamF4XG5cdFx0aWYgKCAnJyA9PT0gc3VibWl0dGluZ19idXR0b24gfHwgJ1NhdmUgQ2hhbmdlcycgIT09IHN1Ym1pdHRpbmdfYnV0dG9uICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGFqYXhfZm9ybV9kYXRhID0gZm9ybS5zZXJpYWxpemUoKTsgLy9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBhamF4X2Zvcm1fZGF0YSArICcmcmVzdD10cnVlJztcblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHVybDogZnVsbF91cmwsXG5cdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oIHhociApIHtcblx0XHRcdCAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0ICAgIH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhfZm9ybV9kYXRhXG5cdFx0XHR9KS5kb25lKCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0fSkuZ2V0KCk7XG5cdFx0XHRcdCQuZWFjaCggbmV3RW1haWxzLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICkge1xuXHRcdFx0XHRcdG5leHRFbWFpbENvdW50ID0gbmV4dEVtYWlsQ291bnQgKyBpbmRleDtcblx0XHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmFwcGVuZCggJzxsaSBpZD1cInVzZXItZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPicgKyB2YWx1ZSArICc8dWwgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXVzZXItZW1haWwtYWN0aW9uc1wiPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1tYWtlLXByaW1hcnktZW1haWxcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW1hcnlfZW1haWxcIiBpZD1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+TWFrZSBQcmltYXJ5PC9zbWFsbD48L2xhYmVsPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLWVtYWlsLXByZWZlcmVuY2VzXCI+PGEgaHJlZj1cIi9uZXdzbGV0dGVycy8/ZW1haWw9JyArIGVuY29kZVVSSUNvbXBvbmVudCggdmFsdWUgKSArICdcIj48c21hbGw+RW1haWwgUHJlZmVyZW5jZXM8L3NtYWxsPjwvYT48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggJCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoKSArICcsJyArIHZhbHVlICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggMCA9PT0gJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIGl0IHdvdWxkIGJlIG5pY2UgdG8gb25seSBsb2FkIHRoZSBmb3JtLCBidXQgdGhlbiBjbGljayBldmVudHMgc3RpbGwgZG9uJ3Qgd29ya1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIDAgPCAkKCAnLm0tZm9ybS1lbWFpbCcgKS5sZW5ndGggKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cbn0pO1xuIiwiLy8gYmFzZWQgb24gd2hpY2ggYnV0dG9uIHdhcyBjbGlja2VkLCBzZXQgdGhlIHZhbHVlcyBmb3IgdGhlIGFuYWx5dGljcyBldmVudCBhbmQgY3JlYXRlIGl0XG5mdW5jdGlvbiB0cmFja1Nob3dDb21tZW50cyggYWx3YXlzLCBpZCwgY2xpY2tfdmFsdWUgKSB7XG5cdHZhciBhY3Rpb24gICAgICAgICAgPSAnJztcblx0dmFyIGNhdGVnb3J5X3ByZWZpeCA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlfc3VmZml4ID0gJyc7XG5cdHZhciBwb3NpdGlvbiAgICAgICAgPSAnJztcblx0cG9zaXRpb24gPSBpZC5yZXBsYWNlKCAnYWx3YXlzLXNob3ctY29tbWVudHMtJywgJycgKTtcblx0aWYgKCAnMScgPT09IGNsaWNrX3ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPbic7XG5cdH0gZWxzZSBpZiAoICcwJyA9PT0gY2xpY2tfdmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09mZic7XG5cdH0gZWxzZSB7XG5cdFx0YWN0aW9uID0gJ0NsaWNrJztcblx0fVxuXHRpZiAoIHRydWUgPT09IGFsd2F5cyApIHtcblx0XHRjYXRlZ29yeV9wcmVmaXggPSAnQWx3YXlzICc7XG5cdH1cblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbi5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgcG9zaXRpb24uc2xpY2UoIDEgKTtcblx0XHRjYXRlZ29yeV9zdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgY2F0ZWdvcnlfcHJlZml4ICsgJ1Nob3cgQ29tbWVudHMnICsgY2F0ZWdvcnlfc3VmZml4LCBhY3Rpb24sIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59XG5cbi8vIHdoZW4gc2hvd2luZyBjb21tZW50cyBvbmNlLCB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1idXR0b24tc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR0cmFja1Nob3dDb21tZW50cyggZmFsc2UsICcnLCAnJyApO1xufSk7XG5cbi8vIFNldCB1c2VyIG1ldGEgdmFsdWUgZm9yIGFsd2F5cyBzaG93aW5nIGNvbW1lbnRzIGlmIHRoYXQgYnV0dG9uIGlzIGNsaWNrZWRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR2YXIgdGhhdCA9ICQoIHRoaXMgKTtcblx0aWYgKCB0aGF0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9IGVsc2Uge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvLyB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcblx0dHJhY2tTaG93Q29tbWVudHMoIHRydWUsIHRoYXQuYXR0ciggJ2lkJyApLCB0aGF0LnZhbCgpICk7XG5cblx0Ly8gd2UgYWxyZWFkeSBoYXZlIGFqYXh1cmwgZnJvbSB0aGUgdGhlbWVcblx0JC5hamF4KHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBhamF4dXJsLFxuXHRcdGRhdGE6IHtcbiAgICAgICAgXHQnYWN0aW9uJzogJ21pbm5wb3N0X2xhcmdvX2xvYWRfY29tbWVudHNfc2V0X3VzZXJfbWV0YScsXG4gICAgICAgIFx0J3ZhbHVlJzogdGhhdC52YWwoKVxuXHRcdH0sXG5cdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuICAgICAgICBcdCQoICcuYS1hbHdheXMtc2hvdy1jb21tZW50cy1yZXN1bHQnLCB0aGF0LnBhcmVudCgpICkuaHRtbCggcmVzcG9uc2UuZGF0YS5tZXNzYWdlICk7XG4gICAgICAgIFx0aWYgKCB0cnVlID09PSByZXNwb25zZS5kYXRhLnNob3cgKSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDAgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDEgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG4iXX0=
}(jQuery));
