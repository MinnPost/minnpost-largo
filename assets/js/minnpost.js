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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/** 
 * Library code
 * Using https://www.npmjs.com/package/@cloudfour/transition-hidden-element
 */
function transitionHiddenElement(_ref) {
  var element = _ref.element,
      visibleClass = _ref.visibleClass,
      _ref$waitMode = _ref.waitMode,
      waitMode = _ref$waitMode === void 0 ? 'transitionend' : _ref$waitMode,
      timeoutDuration = _ref.timeoutDuration,
      _ref$hideMode = _ref.hideMode,
      hideMode = _ref$hideMode === void 0 ? 'hidden' : _ref$hideMode,
      _ref$displayValue = _ref.displayValue,
      displayValue = _ref$displayValue === void 0 ? 'block' : _ref$displayValue;

  if (waitMode === 'timeout' && typeof timeoutDuration !== 'number') {
    console.error("\n      When calling transitionHiddenElement with waitMode set to timeout,\n      you must pass in a number for timeoutDuration.\n    ");
    return;
  } // Don't wait for exit transitions if a user prefers reduced motion.
  // Ideally transitions will be disabled in CSS, which means we should not wait
  // before adding `hidden`.


  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    waitMode = 'immediate';
  }
  /**
   * An event listener to add `hidden` after our animations complete.
   * This listener will remove itself after completing.
   */


  var listener = function listener(e) {
    // Confirm `transitionend` was called on  our `element` and didn't bubble
    // up from a child element.
    if (e.target === element) {
      applyHiddenAttributes();
      element.removeEventListener('transitionend', listener);
    }
  };

  var applyHiddenAttributes = function applyHiddenAttributes() {
    if (hideMode === 'display') {
      element.style.display = 'none';
    } else {
      element.setAttribute('hidden', true);
    }
  };

  var removeHiddenAttributes = function removeHiddenAttributes() {
    if (hideMode === 'display') {
      element.style.display = displayValue;
    } else {
      element.removeAttribute('hidden');
    }
  };

  return {
    /**
     * Show the element
     */
    transitionShow: function transitionShow() {
      /**
       * This listener shouldn't be here but if someone spams the toggle
       * over and over really fast it can incorrectly stick around.
       * We remove it just to be safe.
       */
      element.removeEventListener('transitionend', listener);
      /**
       * Similarly, we'll clear the timeout in case it's still hanging around.
       */

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      removeHiddenAttributes();
      /**
       * Force a browser re-paint so the browser will realize the
       * element is no longer `hidden` and allow transitions.
       */

      var reflow = element.offsetHeight;
      element.classList.add(visibleClass);
    },

    /**
     * Hide the element
     */
    transitionHide: function transitionHide() {
      if (waitMode === 'transitionend') {
        element.addEventListener('transitionend', listener);
      } else if (waitMode === 'timeout') {
        this.timeout = setTimeout(function () {
          applyHiddenAttributes();
        }, timeoutDuration);
      } else {
        applyHiddenAttributes();
      } // Add this class to trigger our animation


      element.classList.remove(visibleClass);
    },

    /**
     * Toggle the element's visibility
     */
    toggle: function toggle() {
      if (this.isHidden()) {
        this.transitionShow();
      } else {
        this.transitionHide();
      }
    },

    /**
     * Tell whether the element is hidden or not.
     */
    isHidden: function isHidden() {
      /**
       * The hidden attribute does not require a value. Since an empty string is
       * falsy, but shows the presence of an attribute we compare to `null`
       */
      var hasHiddenAttribute = element.getAttribute('hidden') !== null;
      var isDisplayNone = element.style.display === 'none';

      var hasVisibleClass = _toConsumableArray(element.classList).includes(visibleClass);

      return hasHiddenAttribute || isDisplayNone || !hasVisibleClass;
    },
    // A placeholder for our `timeout`
    timeout: null
  };
}
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
 * Navigation scripts. Includes mobile or toggle behavior, analytics tracking of specific menus.
 */
function setupPrimaryNav() {
  var primaryNavTransitioner = transitionHiddenElement({
    element: document.querySelector('.m-menu-primary-links'),
    visibleClass: 'is-open',
    displayValue: 'flex'
  });
  var primaryNavToggle = document.querySelector('nav button');
  primaryNavToggle.addEventListener('click', function (e) {
    e.preventDefault();
    var expanded = this.getAttribute('aria-expanded') === 'true' || false;
    this.setAttribute('aria-expanded', !expanded);

    if (true === expanded) {
      primaryNavTransitioner.transitionHide();
    } else {
      primaryNavTransitioner.transitionShow();
    }
  });
  var userNavTransitioner = transitionHiddenElement({
    element: document.querySelector('.your-minnpost-account ul'),
    visibleClass: 'is-open',
    displayValue: 'flex'
  });
  var userNavToggle = document.querySelector('.your-minnpost-account > a');
  userNavToggle.addEventListener('click', function (e) {
    e.preventDefault();
    var expanded = this.getAttribute('aria-expanded') === 'true' || false;
    this.setAttribute('aria-expanded', !expanded);

    if (true === expanded) {
      userNavTransitioner.transitionHide();
    } else {
      userNavTransitioner.transitionShow();
    }
  });
  var target = document.querySelector('nav .m-form-search fieldset');
  var span = document.createElement('span');
  span.innerHTML = '<a href="#" class="a-close-search"><i class="fas fa-times"></i></a>';
  var div = document.createElement('div');
  div.appendChild(span);
  var fragment = document.createDocumentFragment();
  fragment.appendChild(div);
  target.appendChild(fragment);
  var searchTransitioner = transitionHiddenElement({
    element: document.querySelector('.m-menu-primary-actions .m-form-search'),
    visibleClass: 'is-open',
    displayValue: 'flex'
  });
  var searchVisible = document.querySelector('li.search > a');
  searchVisible.addEventListener('click', function (e) {
    e.preventDefault();
    var expanded = searchVisible.getAttribute('aria-expanded') === 'true' || false;
    searchVisible.setAttribute('aria-expanded', !expanded);

    if (true === expanded) {
      searchTransitioner.transitionHide();
    } else {
      searchTransitioner.transitionShow();
    }
  });
  var searchClose = document.querySelector('.a-close-search');
  searchClose.addEventListener('click', function (e) {
    e.preventDefault();
    var expanded = searchVisible.getAttribute('aria-expanded') === 'true' || false;
    searchVisible.setAttribute('aria-expanded', !expanded);

    if (true === expanded) {
      searchTransitioner.transitionHide();
    } else {
      searchTransitioner.transitionShow();
    }
  }); // escape key press

  $(document).keyup(function (e) {
    if (27 === e.keyCode) {
      var primaryNavExpanded = primaryNavToggle.getAttribute('aria-expanded') === 'true' || false;
      var userNavExpanded = userNavToggle.getAttribute('aria-expanded') === 'true' || false;
      var searchIsVisible = searchVisible.getAttribute('aria-expanded') === 'true' || false;

      if (undefined !== _typeof(primaryNavExpanded) && true === primaryNavExpanded) {
        primaryNavToggle.setAttribute('aria-expanded', !primaryNavExpanded);
        primaryNavTransitioner.transitionHide();
      }

      if (undefined !== _typeof(userNavExpanded) && true === userNavExpanded) {
        userNavToggle.setAttribute('aria-expanded', !userNavExpanded);
        userNavTransitioner.transitionHide();
      }

      if (undefined !== _typeof(searchIsVisible) && true === searchIsVisible) {
        searchVisible.setAttribute('aria-expanded', !searchIsVisible);
        searchTransitioner.transitionHide();
      }
    }
  });
}

setupPrimaryNav();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDAtc3RhcnQuanMiLCIwMS1mb250cy5qcyIsIjAyLWFuYWx5dGljcy5qcyIsIjAzLXNoYXJlLmpzIiwiMDQtbmF2aWdhdGlvbi5qcyIsIjA1LWZvcm1zLmpzIiwiMDYtY29tbWVudHMuanMiXSwibmFtZXMiOlsidGxpdGUiLCJ0IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImkiLCJ0YXJnZXQiLCJuIiwicGFyZW50RWxlbWVudCIsInNob3ciLCJ0b29sdGlwIiwibyIsImhpZGUiLCJsIiwiciIsImNsYXNzTmFtZSIsInMiLCJvZmZzZXRUb3AiLCJvZmZzZXRMZWZ0Iiwib2Zmc2V0UGFyZW50Iiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJkIiwiZiIsImEiLCJzdHlsZSIsInRvcCIsImxlZnQiLCJjcmVhdGVFbGVtZW50IiwiZ3JhdiIsImdldEF0dHJpYnV0ZSIsImlubmVySFRNTCIsImFwcGVuZENoaWxkIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiYm90dG9tIiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJyaWdodCIsImlubmVyV2lkdGgiLCJ0aXRsZSIsInNldEF0dHJpYnV0ZSIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJtb2R1bGUiLCJleHBvcnRzIiwidHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQiLCJlbGVtZW50IiwidmlzaWJsZUNsYXNzIiwid2FpdE1vZGUiLCJ0aW1lb3V0RHVyYXRpb24iLCJoaWRlTW9kZSIsImRpc3BsYXlWYWx1ZSIsImNvbnNvbGUiLCJlcnJvciIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwibGlzdGVuZXIiLCJhcHBseUhpZGRlbkF0dHJpYnV0ZXMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzcGxheSIsInJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMiLCJyZW1vdmVBdHRyaWJ1dGUiLCJ0cmFuc2l0aW9uU2hvdyIsInRpbWVvdXQiLCJyZWZsb3ciLCJjbGFzc0xpc3QiLCJhZGQiLCJ0cmFuc2l0aW9uSGlkZSIsInJlbW92ZSIsInRvZ2dsZSIsImlzSGlkZGVuIiwiaGFzSGlkZGVuQXR0cmlidXRlIiwiaXNEaXNwbGF5Tm9uZSIsImhhc1Zpc2libGVDbGFzcyIsImluY2x1ZGVzIiwiJCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJzZXNzaW9uU3RvcmFnZSIsInNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwiLCJzYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwiLCJkb2N1bWVudEVsZW1lbnQiLCJnIiwicHVzaCIsImxlbmd0aCIsIm0iLCJzaGlmdCIsInAiLCJiIiwicSIsImMiLCJ1IiwiVHlwZUVycm9yIiwidGhlbiIsImNhbGwiLCJ2IiwiaCIsInByb3RvdHlwZSIsInciLCJrIiwieCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmFjZSIsImFsbCIsImF0dGFjaEV2ZW50IiwiYm9keSIsInJlYWR5U3RhdGUiLCJkZXRhY2hFdmVudCIsImNyZWF0ZVRleHROb2RlIiwiY3NzVGV4dCIsInoiLCJ3aWR0aCIsInNjcm9sbExlZnQiLCJzY3JvbGxXaWR0aCIsIkEiLCJCIiwiZmFtaWx5Iiwid2VpZ2h0Iiwic3RyZXRjaCIsIkMiLCJEIiwiRSIsIkYiLCJHIiwiSiIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ2ZW5kb3IiLCJleGVjIiwidXNlckFnZW50IiwicGFyc2VJbnQiLCJmb250cyIsIksiLCJmb250IiwiTCIsImpvaW4iLCJsb2FkIiwiSCIsIkRhdGUiLCJnZXRUaW1lIiwiTSIsIkVycm9yIiwiTiIsInkiLCJJIiwiaGlkZGVuIiwiZGlyIiwiRm9udEZhY2VPYnNlcnZlciIsInNhbnNOb3JtYWwiLCJzYW5zQm9sZCIsInNhbnNOb3JtYWxJdGFsaWMiLCJzZXJpZkJvb2siLCJzZXJpZkJvb2tJdGFsaWMiLCJzZXJpZkJvbGQiLCJzZXJpZkJvbGRJdGFsaWMiLCJzZXJpZkJsYWNrIiwic2VyaWZCbGFja0l0YWxpYyIsIm1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCIsInR5cGUiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwidmFsdWUiLCJnYSIsInJlYWR5IiwiUFVNIiwiY3VycmVudF9wb3B1cCIsImdldFBvcHVwIiwic2V0dGluZ3MiLCJnZXRTZXR0aW5ncyIsInBvcHVwX2lkIiwiaWQiLCJvbiIsImNsb3NlX3RyaWdnZXIiLCJmbiIsInBvcG1ha2UiLCJsYXN0X2Nsb3NlX3RyaWdnZXIiLCJjbGljayIsInVybCIsImF0dHIiLCJtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEiLCJ1cmxfYWNjZXNzX2xldmVsIiwibG9jYXRpb24iLCJwYXRobmFtZSIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJjb3B5Q3VycmVudFVSTCIsImR1bW15IiwiaHJlZiIsInNlbGVjdCIsImV4ZWNDb21tYW5kIiwiZGF0YSIsInByZXZlbnREZWZhdWx0IiwicHJpbnQiLCJvcGVuIiwic2V0dXBQcmltYXJ5TmF2IiwicHJpbWFyeU5hdlRyYW5zaXRpb25lciIsInF1ZXJ5U2VsZWN0b3IiLCJwcmltYXJ5TmF2VG9nZ2xlIiwiZXhwYW5kZWQiLCJ1c2VyTmF2VHJhbnNpdGlvbmVyIiwidXNlck5hdlRvZ2dsZSIsInNwYW4iLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCJrZXl1cCIsImtleUNvZGUiLCJwcmltYXJ5TmF2RXhwYW5kZWQiLCJ1c2VyTmF2RXhwYW5kZWQiLCJzZWFyY2hJc1Zpc2libGUiLCJ1bmRlZmluZWQiLCJ3aWRnZXRfdGl0bGUiLCJjbG9zZXN0IiwiZmluZCIsInpvbmVfdGl0bGUiLCJzaWRlYmFyX3NlY3Rpb25fdGl0bGUiLCJ0ZXh0Tm9kZXMiLCJjb250ZW50cyIsImZpbHRlciIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSIsIm5vZGVWYWx1ZSIsInRyaW0iLCJnZXRDb25maXJtQ2hhbmdlTWFya3VwIiwibWFya3VwIiwibWFuYWdlRW1haWxzIiwiZm9ybSIsInJlc3Rfcm9vdCIsInVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QiLCJzaXRlX3VybCIsInJlc3RfbmFtZXNwYWNlIiwiZnVsbF91cmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheF9mb3JtX2RhdGEiLCJ0aGF0IiwicHJvcCIsImV2ZW50IiwidmFsIiwicmVwbGFjZSIsInBhcmVudCIsImFwcGVuZCIsImZpcnN0IiwicmVwbGFjZVdpdGgiLCJzdWJtaXQiLCJlYWNoIiwiaW5kZXgiLCJnZXQiLCJwYXJlbnRzIiwiZmFkZU91dCIsImxvZyIsImJlZm9yZSIsImJ1dHRvbiIsImJ1dHRvbl9mb3JtIiwic3VibWl0dGluZ19idXR0b24iLCJzZXJpYWxpemUiLCJhamF4IiwiYmVmb3JlU2VuZCIsInhociIsInNldFJlcXVlc3RIZWFkZXIiLCJub25jZSIsImRhdGFUeXBlIiwiZG9uZSIsIm1hcCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiY2xpY2tfdmFsdWUiLCJjYXRlZ29yeV9wcmVmaXgiLCJjYXRlZ29yeV9zdWZmaXgiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiaXMiLCJhamF4dXJsIiwic3VjY2VzcyIsInJlc3BvbnNlIiwiaHRtbCIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsS0FBVCxDQUFlQyxDQUFmLEVB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QUFxRHNDLElBQXJELENBQTJERCxRQUFRLENBQUNqRyxJQUFULENBQWNtRyxPQUF6RTs7QUFDQSxVQUFLLFNBQVNGLFFBQVEsQ0FBQ2pHLElBQVQsQ0FBYy9MLElBQTVCLEVBQW1DO0FBQ3hDb0UsUUFBQUEsQ0FBQyxDQUFFLGtDQUFGLENBQUQsQ0FBd0NxTCxHQUF4QyxDQUE2QyxDQUE3QztBQUNBLE9BRkssTUFFQztBQUNOckwsUUFBQUEsQ0FBQyxDQUFFLGtDQUFGLENBQUQsQ0FBd0NxTCxHQUF4QyxDQUE2QyxDQUE3QztBQUNBO0FBQ0Q7QUFkSyxHQUFQO0FBZ0JBLENBNUJEIiwiZmlsZSI6Im1pbm5wb3N0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gdGxpdGUodCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLGZ1bmN0aW9uKGUpe3ZhciBpPWUudGFyZ2V0LG49dChpKTtufHwobj0oaT1pLnBhcmVudEVsZW1lbnQpJiZ0KGkpKSxuJiZ0bGl0ZS5zaG93KGksbiwhMCl9KX10bGl0ZS5zaG93PWZ1bmN0aW9uKHQsZSxpKXt2YXIgbj1cImRhdGEtdGxpdGVcIjtlPWV8fHt9LCh0LnRvb2x0aXB8fGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gbygpe3RsaXRlLmhpZGUodCwhMCl9ZnVuY3Rpb24gbCgpe3J8fChyPWZ1bmN0aW9uKHQsZSxpKXtmdW5jdGlvbiBuKCl7by5jbGFzc05hbWU9XCJ0bGl0ZSB0bGl0ZS1cIityK3M7dmFyIGU9dC5vZmZzZXRUb3AsaT10Lm9mZnNldExlZnQ7by5vZmZzZXRQYXJlbnQ9PT10JiYoZT1pPTApO3ZhciBuPXQub2Zmc2V0V2lkdGgsbD10Lm9mZnNldEhlaWdodCxkPW8ub2Zmc2V0SGVpZ2h0LGY9by5vZmZzZXRXaWR0aCxhPWkrbi8yO28uc3R5bGUudG9wPShcInNcIj09PXI/ZS1kLTEwOlwiblwiPT09cj9lK2wrMTA6ZStsLzItZC8yKStcInB4XCIsby5zdHlsZS5sZWZ0PShcIndcIj09PXM/aTpcImVcIj09PXM/aStuLWY6XCJ3XCI9PT1yP2krbisxMDpcImVcIj09PXI/aS1mLTEwOmEtZi8yKStcInB4XCJ9dmFyIG89ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksbD1pLmdyYXZ8fHQuZ2V0QXR0cmlidXRlKFwiZGF0YS10bGl0ZVwiKXx8XCJuXCI7by5pbm5lckhUTUw9ZSx0LmFwcGVuZENoaWxkKG8pO3ZhciByPWxbMF18fFwiXCIscz1sWzFdfHxcIlwiO24oKTt2YXIgZD1vLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVyblwic1wiPT09ciYmZC50b3A8MD8ocj1cIm5cIixuKCkpOlwiblwiPT09ciYmZC5ib3R0b20+d2luZG93LmlubmVySGVpZ2h0PyhyPVwic1wiLG4oKSk6XCJlXCI9PT1yJiZkLmxlZnQ8MD8ocj1cIndcIixuKCkpOlwid1wiPT09ciYmZC5yaWdodD53aW5kb3cuaW5uZXJXaWR0aCYmKHI9XCJlXCIsbigpKSxvLmNsYXNzTmFtZSs9XCIgdGxpdGUtdmlzaWJsZVwiLG99KHQsZCxlKSl9dmFyIHIscyxkO3JldHVybiB0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixvKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsbyksdC50b29sdGlwPXtzaG93OmZ1bmN0aW9uKCl7ZD10LnRpdGxlfHx0LmdldEF0dHJpYnV0ZShuKXx8ZCx0LnRpdGxlPVwiXCIsdC5zZXRBdHRyaWJ1dGUobixcIlwiKSxkJiYhcyYmKHM9c2V0VGltZW91dChsLGk/MTUwOjEpKX0saGlkZTpmdW5jdGlvbih0KXtpZihpPT09dCl7cz1jbGVhclRpbWVvdXQocyk7dmFyIGU9ciYmci5wYXJlbnROb2RlO2UmJmUucmVtb3ZlQ2hpbGQocikscj12b2lkIDB9fX19KHQsZSkpLnNob3coKX0sdGxpdGUuaGlkZT1mdW5jdGlvbih0LGUpe3QudG9vbHRpcCYmdC50b29sdGlwLmhpZGUoZSl9LFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9dGxpdGUpOyIsIi8qKiBcbiAqIExpYnJhcnkgY29kZVxuICogVXNpbmcgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvQGNsb3VkZm91ci90cmFuc2l0aW9uLWhpZGRlbi1lbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoe1xuICBlbGVtZW50LFxuICB2aXNpYmxlQ2xhc3MsXG4gIHdhaXRNb2RlID0gJ3RyYW5zaXRpb25lbmQnLFxuICB0aW1lb3V0RHVyYXRpb24sXG4gIGhpZGVNb2RlID0gJ2hpZGRlbicsXG4gIGRpc3BsYXlWYWx1ZSA9ICdibG9jaydcbn0pIHtcbiAgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcgJiYgdHlwZW9mIHRpbWVvdXREdXJhdGlvbiAhPT0gJ251bWJlcicpIHtcbiAgICBjb25zb2xlLmVycm9yKGBcbiAgICAgIFdoZW4gY2FsbGluZyB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCB3aXRoIHdhaXRNb2RlIHNldCB0byB0aW1lb3V0LFxuICAgICAgeW91IG11c3QgcGFzcyBpbiBhIG51bWJlciBmb3IgdGltZW91dER1cmF0aW9uLlxuICAgIGApO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRG9uJ3Qgd2FpdCBmb3IgZXhpdCB0cmFuc2l0aW9ucyBpZiBhIHVzZXIgcHJlZmVycyByZWR1Y2VkIG1vdGlvbi5cbiAgLy8gSWRlYWxseSB0cmFuc2l0aW9ucyB3aWxsIGJlIGRpc2FibGVkIGluIENTUywgd2hpY2ggbWVhbnMgd2Ugc2hvdWxkIG5vdCB3YWl0XG4gIC8vIGJlZm9yZSBhZGRpbmcgYGhpZGRlbmAuXG4gIGlmICh3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKS5tYXRjaGVzKSB7XG4gICAgd2FpdE1vZGUgPSAnaW1tZWRpYXRlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBldmVudCBsaXN0ZW5lciB0byBhZGQgYGhpZGRlbmAgYWZ0ZXIgb3VyIGFuaW1hdGlvbnMgY29tcGxldGUuXG4gICAqIFRoaXMgbGlzdGVuZXIgd2lsbCByZW1vdmUgaXRzZWxmIGFmdGVyIGNvbXBsZXRpbmcuXG4gICAqL1xuICBjb25zdCBsaXN0ZW5lciA9IGUgPT4ge1xuICAgIC8vIENvbmZpcm0gYHRyYW5zaXRpb25lbmRgIHdhcyBjYWxsZWQgb24gIG91ciBgZWxlbWVudGAgYW5kIGRpZG4ndCBidWJibGVcbiAgICAvLyB1cCBmcm9tIGEgY2hpbGQgZWxlbWVudC5cbiAgICBpZiAoZS50YXJnZXQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFwcGx5SGlkZGVuQXR0cmlidXRlcyA9ICgpID0+IHtcbiAgICBpZihoaWRlTW9kZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogU2hvdyB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25TaG93KCkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGlzIGxpc3RlbmVyIHNob3VsZG4ndCBiZSBoZXJlIGJ1dCBpZiBzb21lb25lIHNwYW1zIHRoZSB0b2dnbGVcbiAgICAgICAqIG92ZXIgYW5kIG92ZXIgcmVhbGx5IGZhc3QgaXQgY2FuIGluY29ycmVjdGx5IHN0aWNrIGFyb3VuZC5cbiAgICAgICAqIFdlIHJlbW92ZSBpdCBqdXN0IHRvIGJlIHNhZmUuXG4gICAgICAgKi9cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBTaW1pbGFybHksIHdlJ2xsIGNsZWFyIHRoZSB0aW1lb3V0IGluIGNhc2UgaXQncyBzdGlsbCBoYW5naW5nIGFyb3VuZC5cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgIH1cblxuICAgICAgcmVtb3ZlSGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICAvKipcbiAgICAgICAqIEZvcmNlIGEgYnJvd3NlciByZS1wYWludCBzbyB0aGUgYnJvd3NlciB3aWxsIHJlYWxpemUgdGhlXG4gICAgICAgKiBlbGVtZW50IGlzIG5vIGxvbmdlciBgaGlkZGVuYCBhbmQgYWxsb3cgdHJhbnNpdGlvbnMuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHJlZmxvdyA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSGlkZSB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25IaWRlKCkge1xuICAgICAgaWYgKHdhaXRNb2RlID09PSAndHJhbnNpdGlvbmVuZCcpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuICAgICAgfSBlbHNlIGlmICh3YWl0TW9kZSA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuICAgICAgICB9LCB0aW1lb3V0RHVyYXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCB0aGlzIGNsYXNzIHRvIHRyaWdnZXIgb3VyIGFuaW1hdGlvblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHZpc2libGVDbGFzcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZSB0aGUgZWxlbWVudCdzIHZpc2liaWxpdHlcbiAgICAgKi9cbiAgICB0b2dnbGUoKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbigpKSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvblNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGVsbCB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIGhpZGRlbiBvciBub3QuXG4gICAgICovXG4gICAgaXNIaWRkZW4oKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBoaWRkZW4gYXR0cmlidXRlIGRvZXMgbm90IHJlcXVpcmUgYSB2YWx1ZS4gU2luY2UgYW4gZW1wdHkgc3RyaW5nIGlzXG4gICAgICAgKiBmYWxzeSwgYnV0IHNob3dzIHRoZSBwcmVzZW5jZSBvZiBhbiBhdHRyaWJ1dGUgd2UgY29tcGFyZSB0byBgbnVsbGBcbiAgICAgICAqL1xuICAgICAgY29uc3QgaGFzSGlkZGVuQXR0cmlidXRlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hpZGRlbicpICE9PSBudWxsO1xuXG4gICAgICBjb25zdCBpc0Rpc3BsYXlOb25lID0gZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZSc7XG5cbiAgICAgIGNvbnN0IGhhc1Zpc2libGVDbGFzcyA9IFsuLi5lbGVtZW50LmNsYXNzTGlzdF0uaW5jbHVkZXModmlzaWJsZUNsYXNzKTtcblxuICAgICAgcmV0dXJuIGhhc0hpZGRlbkF0dHJpYnV0ZSB8fCBpc0Rpc3BsYXlOb25lIHx8ICFoYXNWaXNpYmxlQ2xhc3M7XG4gICAgfSxcblxuICAgIC8vIEEgcGxhY2Vob2xkZXIgZm9yIG91ciBgdGltZW91dGBcbiAgICB0aW1lb3V0OiBudWxsXG4gIH07XG59IiwiJCggJ2h0bWwnICkucmVtb3ZlQ2xhc3MoICduby1qcycgKS5hZGRDbGFzcyggJ2pzJyApOyIsIi8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5pZiAoIHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgJiYgc2Vzc2lvblN0b3JhZ2Uuc2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsICkge1xuXHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkIHNhbnMtZm9udHMtbG9hZGVkJztcbn0gZWxzZSB7XG5cdC8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4xLjAgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oZnVuY3Rpb24oKXsndXNlIHN0cmljdCc7dmFyIGYsZz1bXTtmdW5jdGlvbiBsKGEpe2cucHVzaChhKTsxPT1nLmxlbmd0aCYmZigpfWZ1bmN0aW9uIG0oKXtmb3IoO2cubGVuZ3RoOylnWzBdKCksZy5zaGlmdCgpfWY9ZnVuY3Rpb24oKXtzZXRUaW1lb3V0KG0pfTtmdW5jdGlvbiBuKGEpe3RoaXMuYT1wO3RoaXMuYj12b2lkIDA7dGhpcy5mPVtdO3ZhciBiPXRoaXM7dHJ5e2EoZnVuY3Rpb24oYSl7cShiLGEpfSxmdW5jdGlvbihhKXtyKGIsYSl9KX1jYXRjaChjKXtyKGIsYyl9fXZhciBwPTI7ZnVuY3Rpb24gdChhKXtyZXR1cm4gbmV3IG4oZnVuY3Rpb24oYixjKXtjKGEpfSl9ZnVuY3Rpb24gdShhKXtyZXR1cm4gbmV3IG4oZnVuY3Rpb24oYil7YihhKX0pfWZ1bmN0aW9uIHEoYSxiKXtpZihhLmE9PXApe2lmKGI9PWEpdGhyb3cgbmV3IFR5cGVFcnJvcjt2YXIgYz0hMTt0cnl7dmFyIGQ9YiYmYi50aGVuO2lmKG51bGwhPWImJlwib2JqZWN0XCI9PXR5cGVvZiBiJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBkKXtkLmNhbGwoYixmdW5jdGlvbihiKXtjfHxxKGEsYik7Yz0hMH0sZnVuY3Rpb24oYil7Y3x8cihhLGIpO2M9ITB9KTtyZXR1cm59fWNhdGNoKGUpe2N8fHIoYSxlKTtyZXR1cm59YS5hPTA7YS5iPWI7dihhKX19XG5cdGZ1bmN0aW9uIHIoYSxiKXtpZihhLmE9PXApe2lmKGI9PWEpdGhyb3cgbmV3IFR5cGVFcnJvcjthLmE9MTthLmI9Yjt2KGEpfX1mdW5jdGlvbiB2KGEpe2woZnVuY3Rpb24oKXtpZihhLmEhPXApZm9yKDthLmYubGVuZ3RoOyl7dmFyIGI9YS5mLnNoaWZ0KCksYz1iWzBdLGQ9YlsxXSxlPWJbMl0sYj1iWzNdO3RyeXswPT1hLmE/XCJmdW5jdGlvblwiPT10eXBlb2YgYz9lKGMuY2FsbCh2b2lkIDAsYS5iKSk6ZShhLmIpOjE9PWEuYSYmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGQ/ZShkLmNhbGwodm9pZCAwLGEuYikpOmIoYS5iKSl9Y2F0Y2goaCl7YihoKX19fSl9bi5wcm90b3R5cGUuZz1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5jKHZvaWQgMCxhKX07bi5wcm90b3R5cGUuYz1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXM7cmV0dXJuIG5ldyBuKGZ1bmN0aW9uKGQsZSl7Yy5mLnB1c2goW2EsYixkLGVdKTt2KGMpfSl9O1xuXHRmdW5jdGlvbiB3KGEpe3JldHVybiBuZXcgbihmdW5jdGlvbihiLGMpe2Z1bmN0aW9uIGQoYyl7cmV0dXJuIGZ1bmN0aW9uKGQpe2hbY109ZDtlKz0xO2U9PWEubGVuZ3RoJiZiKGgpfX12YXIgZT0wLGg9W107MD09YS5sZW5ndGgmJmIoaCk7Zm9yKHZhciBrPTA7azxhLmxlbmd0aDtrKz0xKXUoYVtrXSkuYyhkKGspLGMpfSl9ZnVuY3Rpb24geChhKXtyZXR1cm4gbmV3IG4oZnVuY3Rpb24oYixjKXtmb3IodmFyIGQ9MDtkPGEubGVuZ3RoO2QrPTEpdShhW2RdKS5jKGIsYyl9KX07d2luZG93LlByb21pc2V8fCh3aW5kb3cuUHJvbWlzZT1uLHdpbmRvdy5Qcm9taXNlLnJlc29sdmU9dSx3aW5kb3cuUHJvbWlzZS5yZWplY3Q9dCx3aW5kb3cuUHJvbWlzZS5yYWNlPXgsd2luZG93LlByb21pc2UuYWxsPXcsd2luZG93LlByb21pc2UucHJvdG90eXBlLnRoZW49bi5wcm90b3R5cGUuYyx3aW5kb3cuUHJvbWlzZS5wcm90b3R5cGVbXCJjYXRjaFwiXT1uLnByb3RvdHlwZS5nKTt9KCkpO1xuXG5cdChmdW5jdGlvbigpe2Z1bmN0aW9uIGwoYSxiKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2EuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLGIsITEpOmEuYXR0YWNoRXZlbnQoXCJzY3JvbGxcIixiKX1mdW5jdGlvbiBtKGEpe2RvY3VtZW50LmJvZHk/YSgpOmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbiBjKCl7ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixjKTthKCl9KTpkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGZ1bmN0aW9uIGsoKXtpZihcImludGVyYWN0aXZlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGV8fFwiY29tcGxldGVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZSlkb2N1bWVudC5kZXRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGspLGEoKX0pfTtmdW5jdGlvbiB0KGEpe3RoaXMuYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RoaXMuYS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKTt0aGlzLmEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYSkpO3RoaXMuYj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5oPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmc9LTE7dGhpcy5iLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmMuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO1xuXHR0aGlzLmYuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuaC5zdHlsZS5jc3NUZXh0PVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjt0aGlzLmIuYXBwZW5kQ2hpbGQodGhpcy5oKTt0aGlzLmMuYXBwZW5kQ2hpbGQodGhpcy5mKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5iKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5jKX1cblx0ZnVuY3Rpb24gdShhLGIpe2EuYS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6XCIrYitcIjtcIn1mdW5jdGlvbiB6KGEpe3ZhciBiPWEuYS5vZmZzZXRXaWR0aCxjPWIrMTAwO2EuZi5zdHlsZS53aWR0aD1jK1wicHhcIjthLmMuc2Nyb2xsTGVmdD1jO2EuYi5zY3JvbGxMZWZ0PWEuYi5zY3JvbGxXaWR0aCsxMDA7cmV0dXJuIGEuZyE9PWI/KGEuZz1iLCEwKTohMX1mdW5jdGlvbiBBKGEsYil7ZnVuY3Rpb24gYygpe3ZhciBhPWs7eihhKSYmYS5hLnBhcmVudE5vZGUmJmIoYS5nKX12YXIgaz1hO2woYS5iLGMpO2woYS5jLGMpO3ooYSl9O2Z1bmN0aW9uIEIoYSxiKXt2YXIgYz1ifHx7fTt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwifXZhciBDPW51bGwsRD1udWxsLEU9bnVsbCxGPW51bGw7ZnVuY3Rpb24gRygpe2lmKG51bGw9PT1EKWlmKEooKSYmL0FwcGxlLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKSl7dmFyIGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO0Q9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCl9ZWxzZSBEPSExO3JldHVybiBEfWZ1bmN0aW9uIEooKXtudWxsPT09RiYmKEY9ISFkb2N1bWVudC5mb250cyk7cmV0dXJuIEZ9XG5cdGZ1bmN0aW9uIEsoKXtpZihudWxsPT09RSl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0cnl7YS5zdHlsZS5mb250PVwiY29uZGVuc2VkIDEwMHB4IHNhbnMtc2VyaWZcIn1jYXRjaChiKXt9RT1cIlwiIT09YS5zdHlsZS5mb250fXJldHVybiBFfWZ1bmN0aW9uIEwoYSxiKXtyZXR1cm5bYS5zdHlsZSxhLndlaWdodCxLKCk/YS5zdHJldGNoOlwiXCIsXCIxMDBweFwiLGJdLmpvaW4oXCIgXCIpfVxuXHRCLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxrPWF8fFwiQkVTYnN3eVwiLHI9MCxuPWJ8fDNFMyxIPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2lmKEooKSYmIUcoKSl7dmFyIE09bmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBlKCl7KG5ldyBEYXRlKS5nZXRUaW1lKCktSD49bj9iKEVycm9yKFwiXCIrbitcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpOmRvY3VtZW50LmZvbnRzLmxvYWQoTChjLCdcIicrYy5mYW1pbHkrJ1wiJyksaykudGhlbihmdW5jdGlvbihjKXsxPD1jLmxlbmd0aD9hKCk6c2V0VGltZW91dChlLDI1KX0sYil9ZSgpfSksTj1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGMpe3I9c2V0VGltZW91dChmdW5jdGlvbigpe2MoRXJyb3IoXCJcIituK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSl9LG4pfSk7UHJvbWlzZS5yYWNlKFtOLE1dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHIpO2EoYyl9LFxuXHRiKX1lbHNlIG0oZnVuY3Rpb24oKXtmdW5jdGlvbiB2KCl7dmFyIGI7aWYoYj0tMSE9ZiYmLTEhPWd8fC0xIT1mJiYtMSE9aHx8LTEhPWcmJi0xIT1oKShiPWYhPWcmJmYhPWgmJmchPWgpfHwobnVsbD09PUMmJihiPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSxDPSEhYiYmKDUzNj5wYXJzZUludChiWzFdLDEwKXx8NTM2PT09cGFyc2VJbnQoYlsxXSwxMCkmJjExPj1wYXJzZUludChiWzJdLDEwKSkpLGI9QyYmKGY9PXcmJmc9PXcmJmg9PXd8fGY9PXgmJmc9PXgmJmg9PXh8fGY9PXkmJmc9PXkmJmg9PXkpKSxiPSFiO2ImJihkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxjbGVhclRpbWVvdXQociksYShjKSl9ZnVuY3Rpb24gSSgpe2lmKChuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PW4pZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksYihFcnJvcihcIlwiK1xuXHRuK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLGc9cC5hLm9mZnNldFdpZHRoLGg9cS5hLm9mZnNldFdpZHRoLHYoKTtyPXNldFRpbWVvdXQoSSw1MCl9fXZhciBlPW5ldyB0KGspLHA9bmV3IHQoaykscT1uZXcgdChrKSxmPS0xLGc9LTEsaD0tMSx3PS0xLHg9LTEseT0tMSxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5kaXI9XCJsdHJcIjt1KGUsTChjLFwic2Fucy1zZXJpZlwiKSk7dShwLEwoYyxcInNlcmlmXCIpKTt1KHEsTChjLFwibW9ub3NwYWNlXCIpKTtkLmFwcGVuZENoaWxkKGUuYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2QuYXBwZW5kQ2hpbGQocS5hKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO3c9ZS5hLm9mZnNldFdpZHRoO3g9cC5hLm9mZnNldFdpZHRoO3k9cS5hLm9mZnNldFdpZHRoO0koKTtBKGUsZnVuY3Rpb24oYSl7Zj1hO3YoKX0pO3UoZSxcblx0TChjLCdcIicrYy5mYW1pbHkrJ1wiLHNhbnMtc2VyaWYnKSk7QShwLGZ1bmN0aW9uKGEpe2c9YTt2KCl9KTt1KHAsTChjLCdcIicrYy5mYW1pbHkrJ1wiLHNlcmlmJykpO0EocSxmdW5jdGlvbihhKXtoPWE7digpfSk7dShxLEwoYywnXCInK2MuZmFtaWx5KydcIixtb25vc3BhY2UnKSl9KX0pfTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1COih3aW5kb3cuRm9udEZhY2VPYnNlcnZlcj1CLHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkPUIucHJvdG90eXBlLmxvYWQpO30oKSk7XG5cblx0Ly8gbWlubnBvc3QgZm9udHNcblxuXHQvLyBzYW5zXG5cdHZhciBzYW5zTm9ybWFsID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoICdmZi1tZXRhLXdlYi1wcm8nICk7XG5cdHZhciBzYW5zQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNhbnNOb3JtYWxJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA0MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cblx0Ly8gc2VyaWZcblx0dmFyIHNlcmlmQm9vayA9IG5ldyBGb250RmFjZU9ic2VydmVyKCBcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA1MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvb2tJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA1MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvbGQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvbGRJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJsYWNrID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogOTAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCbGFja0l0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDkwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblxuXHRQcm9taXNlLmFsbCggW1xuXHRcdHNhbnNOb3JtYWwubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zTm9ybWFsSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvb2subG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9va0l0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvbGRJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQmxhY2subG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQmxhY2tJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApXG5cdF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkJztcblx0XHQvLyBPcHRpbWl6YXRpb24gZm9yIFJlcGVhdCBWaWV3c1xuXHRcdHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG5cblx0UHJvbWlzZS5hbGwoIFtcblx0XHRzYW5zTm9ybWFsLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zQm9sZC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc05vcm1hbEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwIClcblx0XSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzYW5zLWZvbnRzLWxvYWRlZCc7XG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG59XG5cbiIsImZ1bmN0aW9uIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHZhbHVlICkge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggZSApIHtcblxuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgUFVNICkge1xuXHRcdHZhciBjdXJyZW50X3BvcHVwID0gUFVNLmdldFBvcHVwKCAkKCAnLnB1bScgKSApO1xuXHRcdHZhciBzZXR0aW5ncyA9IFBVTS5nZXRTZXR0aW5ncyggJCggJy5wdW0nICkgKTtcblx0XHR2YXIgcG9wdXBfaWQgPSBzZXR0aW5ncy5pZDtcblx0XHQkKCBkb2N1bWVudCApLm9uKCAncHVtQWZ0ZXJPcGVuJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdTaG93JywgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9KTtcblx0XHR9KTtcblx0XHQkKCBkb2N1bWVudCApLm9uKCAncHVtQWZ0ZXJDbG9zZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGNsb3NlX3RyaWdnZXIgPSAkLmZuLnBvcG1ha2UubGFzdF9jbG9zZV90cmlnZ2VyO1xuXHRcdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGNsb3NlX3RyaWdnZXIgKSB7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgY2xvc2VfdHJpZ2dlciwgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkKCAnLm1lc3NhZ2UtY2xvc2UnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBsaW5rIHdpdGggY2xvc2UgY2xhc3Ncblx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJ0Nsb3NlIEJ1dHRvbic7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSk7XG5cdFx0fSk7XG5cdFx0JCggJy5tZXNzYWdlLWxvZ2luJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGxvZ2luIGNsYXNzXG5cdFx0XHR2YXIgdXJsID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnTG9naW4gTGluaycsIHVybCApO1xuXHRcdH0pO1xuXHRcdCQoICcucHVtLWNvbnRlbnQgYTpub3QoIC5tZXNzYWdlLWNsb3NlLCAucHVtLWNsb3NlLCAubWVzc2FnZS1sb2dpbiApJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3Mgc29tZXRoaW5nIHRoYXQgaXMgbm90IGNsb3NlIHRleHQgb3IgY2xvc2UgaWNvblxuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnQ2xpY2snLCBwb3B1cF9pZCApO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSAmJiAnJyAhPT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLnVybF9hY2Nlc3NfbGV2ZWwgKSB7XG5cdFx0dmFyIHR5cGUgPSAnZXZlbnQnO1xuXHRcdHZhciBjYXRlZ29yeSA9ICdNZW1iZXIgQ29udGVudCc7XG5cdFx0dmFyIGxhYmVsID0gbG9jYXRpb24ucGF0aG5hbWU7IC8vIGkgdGhpbmsgd2UgY291bGQgcG9zc2libHkgcHV0IHNvbWUgZ3JvdXBpbmcgaGVyZSwgYnV0IHdlIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYWNjZXNzIHRvIG9uZSBhbmQgbWF5YmUgaXQncyBub3Qgd29ydGh3aGlsZSB5ZXRcblx0XHR2YXIgYWN0aW9uID0gJ0Jsb2NrZWQnO1xuXHRcdGlmICggdHJ1ZSA9PT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLmN1cnJlbnRfdXNlci5jYW5fYWNjZXNzICkge1xuXHRcdFx0YWN0aW9uID0gJ1Nob3duJztcblx0XHR9XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHR9XG59KTtcbiIsImZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uID0gJycgKSB7XG5cblx0Ly8gaWYgYSBub3QgbG9nZ2VkIGluIHVzZXIgdHJpZXMgdG8gZW1haWwsIGRvbid0IGNvdW50IHRoYXQgYXMgYSBzaGFyZVxuXHRpZiAoICEgalF1ZXJ5KCAnYm9keScgKS5oYXNDbGFzcyggJ2xvZ2dlZC1pbicgKSAmJiAnRW1haWwnID09PSB0ZXh0ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBjYXRlZ29yeSA9ICdTaGFyZSc7XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdGNhdGVnb3J5ID0gJ1NoYXJlIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cblx0Ly8gdHJhY2sgYXMgYW4gZXZlbnQsIGFuZCBhcyBzb2NpYWwgaWYgaXQgaXMgdHdpdHRlciBvciBmYlxuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsIGNhdGVnb3J5LCB0ZXh0LCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0IHx8ICdUd2l0dGVyJyA9PT0gdGV4dCApIHtcblx0XHRcdGlmICggJ0ZhY2Vib29rJyA9PSB0ZXh0ICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZnVuY3Rpb24gY29weUN1cnJlbnRVUkwoKSB7XG5cdHZhciBkdW1teSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdpbnB1dCcgKSwgdGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkdW1teSApO1xuXHRkdW1teS52YWx1ZSA9IHRleHQ7XG5cdGR1bW15LnNlbGVjdCgpO1xuXHRkb2N1bWVudC5leGVjQ29tbWFuZCggJ2NvcHknICk7XG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoIGR1bW15ICk7XG59XG5cbiQoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLmRhdGEoICdzaGFyZS1hY3Rpb24nICk7XG5cdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSk7XG5cbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1wcmludCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR3aW5kb3cucHJpbnQoKTtcbn0pO1xuXG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtY29weS11cmwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGNvcHlDdXJyZW50VVJMKCk7XG5cdHRsaXRlLnNob3coICggZS50YXJnZXQgKSwgeyBncmF2OiAndycgfSApO1xuXHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHR0bGl0ZS5oaWRlKCAoIGUudGFyZ2V0ICkgKTtcblx0fSwgMzAwMCApO1xuXHRyZXR1cm4gZmFsc2U7XG59KTtcblxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWZhY2Vib29rIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXR3aXR0ZXIgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZW1haWwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0dmFyIHVybCA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcbiAgICB3aW5kb3cub3BlbiggdXJsLCAnX2JsYW5rJyApO1xufSk7XG4iLCIvKipcbiAqIEZpbGUgbmF2aWdhdGlvbi5qcy5cbiAqXG4gKiBOYXZpZ2F0aW9uIHNjcmlwdHMuIEluY2x1ZGVzIG1vYmlsZSBvciB0b2dnbGUgYmVoYXZpb3IsIGFuYWx5dGljcyB0cmFja2luZyBvZiBzcGVjaWZpYyBtZW51cy5cbiAqL1xuXG5mdW5jdGlvbiBzZXR1cFByaW1hcnlOYXYoKSB7XG5cdGNvbnN0IHByaW1hcnlOYXZUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCh7XG5cdCAgZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1saW5rcycgKSxcblx0ICB2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0ICBkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9KTtcblxuXHR2YXIgcHJpbWFyeU5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgYnV0dG9uJyApO1xuXHRwcmltYXJ5TmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0bGV0IGV4cGFuZGVkID0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZScgfHwgZmFsc2U7XG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdH1cblx0fSk7XG5cblx0Y29uc3QgdXNlck5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KHtcblx0ICBlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItbWlubnBvc3QtYWNjb3VudCB1bCcgKSxcblx0ICB2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0ICBkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9KTtcblxuXHR2YXIgdXNlck5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1taW5ucG9zdC1hY2NvdW50ID4gYScgKTtcblx0dXNlck5hdlRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGxldCBleHBhbmRlZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnIHx8IGZhbHNlO1xuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1x0XG5cdFx0fSBlbHNlIHtcblx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHR9XG5cdH0pO1xuXG5cdHZhciB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IC5tLWZvcm0tc2VhcmNoIGZpZWxkc2V0JyApO1xuXHR2YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyk7XG5cdHNwYW4uaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLXNlYXJjaFwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuXG5cdHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0ZGl2LmFwcGVuZENoaWxkKHNwYW4pO1xuXG5cdHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcblxuXHR0YXJnZXQuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuXG5cdGNvbnN0IHNlYXJjaFRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KHtcblx0ICBlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWFjdGlvbnMgLm0tZm9ybS1zZWFyY2gnICksXG5cdCAgdmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdCAgZGlzcGxheVZhbHVlOiAnZmxleCdcblx0fSk7XG5cblx0dmFyIHNlYXJjaFZpc2libGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbGkuc2VhcmNoID4gYScgKTtcblx0c2VhcmNoVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGxldCBleHBhbmRlZCA9IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnIHx8IGZhbHNlO1xuXHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdH1cblx0fSk7XG5cblx0dmFyIHNlYXJjaENsb3NlICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1zZWFyY2gnICk7XG5cdHNlYXJjaENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0bGV0IGV4cGFuZGVkID0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZScgfHwgZmFsc2U7XG5cdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBlc2NhcGUga2V5IHByZXNzXG5cdCQoZG9jdW1lbnQpLmtleXVwKGZ1bmN0aW9uKGUpIHtcblx0XHRpZiAoMjcgPT09IGUua2V5Q29kZSApIHtcblx0XHRcdGxldCBwcmltYXJ5TmF2RXhwYW5kZWQgPSBwcmltYXJ5TmF2VG9nZ2xlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJyB8fCBmYWxzZTtcblx0XHRcdGxldCB1c2VyTmF2RXhwYW5kZWQgPSB1c2VyTmF2VG9nZ2xlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJyB8fCBmYWxzZTtcblx0XHRcdGxldCBzZWFyY2hJc1Zpc2libGUgPSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJyB8fCBmYWxzZTtcblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgcHJpbWFyeU5hdkV4cGFuZGVkICYmIHRydWUgPT09IHByaW1hcnlOYXZFeHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRvZ2dsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBwcmltYXJ5TmF2RXhwYW5kZWQgKTtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1x0XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHVzZXJOYXZFeHBhbmRlZCAmJiB0cnVlID09PSB1c2VyTmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgdXNlck5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcdFxuXHRcdFx0fVxuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBzZWFyY2hJc1Zpc2libGUgJiYgdHJ1ZSA9PT0gc2VhcmNoSXNWaXNpYmxlICkge1xuXHRcdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHNlYXJjaElzVmlzaWJsZSApO1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufVxuXG5zZXR1cFByaW1hcnlOYXYoKTtcblxuJCggJyNuYXZpZ2F0aW9uLWZlYXR1cmVkIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdGZWF0dXJlZCBCYXIgTGluaycsICdDbGljaycsIHRoaXMuaHJlZiApO1xufSk7XG5cbiQoICdhLmdsZWFuLXNpZGViYXInICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdTaWRlYmFyIFN1cHBvcnQgTGluaycsICdDbGljaycsIHRoaXMuaHJlZiApO1xufSk7XG5cbiQoICdhJywgJCggJy5vLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0dmFyIHdpZGdldF90aXRsZSA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0td2lkZ2V0JyApLmZpbmQoICdoMycgKS50ZXh0KCk7XG5cdHZhciB6b25lX3RpdGxlICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXpvbmUnICkuZmluZCggJy5hLXpvbmUtdGl0bGUnICkudGV4dCgpO1xuXHR2YXIgc2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gJyc7XG5cdGlmICggJycgIT09IHdpZGdldF90aXRsZSApIHtcblx0XHRzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSB3aWRnZXRfdGl0bGU7XG5cdH0gZWxzZSBpZiAoICcnICE9PSB6b25lX3RpdGxlICkge1xuXHRcdHNpZGViYXJfc2VjdGlvbl90aXRsZSA9IHpvbmVfdGl0bGU7XG5cdH1cblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBMaW5rJywgJ0NsaWNrJywgc2lkZWJhcl9zZWN0aW9uX3RpdGxlICk7XG59KTtcbiIsIlxualF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICggdGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgJycgIT09IHRoaXMubm9kZVZhbHVlLnRyaW0oKSApO1xuXHR9KTtcbn07XG5cbmZ1bmN0aW9uIGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoIGFjdGlvbiApIHtcblx0dmFyIG1hcmt1cCA9ICc8bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLWZvcm0tY29uZmlybVwiPjxsYWJlbD5BcmUgeW91IHN1cmU/IDxhIGlkPVwiYS1jb25maXJtLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ZZXM8L2E+IHwgPGEgaWQ9XCJhLXN0b3AtJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPk5vPC9hPjwvbGFiZWw+PC9saT4nO1xuXHRyZXR1cm4gbWFya3VwO1xufVxuXG5mdW5jdGlvbiBtYW5hZ2VFbWFpbHMoKSB7XG5cdHZhciBmb3JtICAgICAgICAgICAgICAgPSAkKCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScgKTtcblx0dmFyIHJlc3Rfcm9vdCAgICAgICAgICA9IHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Quc2l0ZV91cmwgKyB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnJlc3RfbmFtZXNwYWNlO1xuXHR2YXIgZnVsbF91cmwgICAgICAgICAgID0gcmVzdF9yb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdHZhciBjb25maXJtQ2hhbmdlICAgICAgPSAnJztcblx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdHZhciBuZXdQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIG9sZFByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0dmFyIGNvbnNvbGlkYXRlZEVtYWlscyA9IFtdO1xuXHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdHZhciBhamF4X2Zvcm1fZGF0YSAgICAgPSAnJztcblx0dmFyIHRoYXQgICAgICAgICAgICAgICA9ICcnO1xuXG5cdC8vIHN0YXJ0IG91dCB3aXRoIG5vIHByaW1hcnkvcmVtb3ZhbHMgY2hlY2tlZFxuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHQvLyBpZiB0aGVyZSBpcyBhIGxpc3Qgb2YgZW1haWxzIChub3QganVzdCBhIHNpbmdsZSBmb3JtIGZpZWxkKVxuXHRpZiAoIDAgPCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cblx0XHQvLyBpZiBhIHVzZXIgc2VsZWN0cyBhIG5ldyBwcmltYXJ5LCBtb3ZlIGl0IGludG8gdGhhdCBwb3NpdGlvblxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0XHRuZXdQcmltYXJ5RW1haWwgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRvbGRQcmltYXJ5RW1haWwgPSAkKCAnI2VtYWlsJyApLnZhbCgpO1xuXHRcdFx0cHJpbWFyeUlkICAgICAgID0gJCggdGhpcyApLnByb3AoICdpZCcgKS5yZXBsYWNlKCAncHJpbWFyeV9lbWFpbF8nLCAnJyApO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3ByaW1hcnktY2hhbmdlJyApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cblx0XHRcdC8vJCggdGhpcyApLnBhcmVudCgpLmFmdGVyKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgdXNlciBmYWNpbmcgdmFsdWVzXG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBuZXdQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyN1c2VyLWVtYWlsLScgKyBwcmltYXJ5SWQgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIG1haW4gaGlkZGVuIGZvcm0gdmFsdWVcblx0XHRcdFx0JCggJyNlbWFpbCcgKS52YWwoIG5ld1ByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHN1Ym1pdCBmb3JtIHZhbHVlcy5cblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblxuXHRcdFx0XHQvLyB1bmNoZWNrIHRoZSByYWRpbyBidXR0b25cblx0XHRcdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgZm9ybSB2YWx1ZXMgdG8gdGhlIG9sZCBwcmltYXJ5IGVtYWlsXG5cdFx0XHRcdCQoICcjcHJpbWFyeV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyNyZW1vdmVfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIHRoZSBjb25maXJtIG1lc3NhZ2Vcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdC8vIGlmIGEgdXNlciByZW1vdmVzIGFuIGVtYWlsLCB0YWtlIGl0IGF3YXkgZnJvbSB0aGUgdmlzdWFsIGFuZCBmcm9tIHRoZSBmb3JtXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NoYW5nZScsICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZW1haWxUb1JlbW92ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdyZW1vdmFsJyApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmVhY2goIGZ1bmN0aW9uKCBpbmRleCApIHtcblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgIT09IGVtYWlsVG9SZW1vdmUgKSB7XG5cdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyIGZvciByZW1vdmFsXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQvLyBpZiBjb25maXJtZWQsIHJlbW92ZSB0aGUgZW1haWwgYW5kIHN1Ym1pdCB0aGUgZm9ybVxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5mYWRlT3V0KCAnbm9ybWFsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLnJlbW92ZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRjb25zb2xlLmxvZyggJ3ZhbHVlIGlzICcgKyBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnICkuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvbiBhLWJ1dHRvbi1hZGQtdXNlci1lbWFpbFwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRuZXh0RW1haWxDb3VudCsrO1xuXHR9KTtcblxuXHQkKCAnaW5wdXRbdHlwZT1zdWJtaXRdJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHR2YXIgYnV0dG9uID0gJCggdGhpcyApO1xuXHRcdHZhciBidXR0b25fZm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCAnZm9ybScgKTtcblx0XHRidXR0b25fZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nLCBidXR0b24udmFsKCkgKTtcblx0fSk7XG5cblx0JCggJy5tLWVudHJ5LWNvbnRlbnQnICkub24oICdzdWJtaXQnLCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgZm9ybSA9ICQoIHRoaXMgKTtcblx0XHR2YXIgc3VibWl0dGluZ19idXR0b24gPSBmb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicgKSB8fCAnJztcblxuXHRcdC8vIGlmIHRoZXJlIGlzIG5vIHN1Ym1pdHRpbmcgYnV0dG9uLCBwYXNzIGl0IGJ5IEFqYXhcblx0XHRpZiAoICcnID09PSBzdWJtaXR0aW5nX2J1dHRvbiB8fCAnU2F2ZSBDaGFuZ2VzJyAhPT0gc3VibWl0dGluZ19idXR0b24gKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4X2Zvcm1fZGF0YSA9IGFqYXhfZm9ybV9kYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dXJsOiBmdWxsX3VybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xuXHRcdFx0ICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Lm5vbmNlICk7XG5cdFx0XHQgICAgfSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0ZGF0YTogYWpheF9mb3JtX2RhdGFcblx0XHRcdH0pLmRvbmUoIGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0XHRuZXdFbWFpbHMgPSAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHR9KS5nZXQoKTtcblx0XHRcdFx0JC5lYWNoKCBuZXdFbWFpbHMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSBuZXh0RW1haWxDb3VudCArIGluZGV4O1xuXHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkuYXBwZW5kKCAnPGxpIGlkPVwidXNlci1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtZW1haWwtcHJlZmVyZW5jZXNcIj48YSBocmVmPVwiL25ld3NsZXR0ZXJzLz9lbWFpbD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCB2YWx1ZSApICsgJ1wiPjxzbWFsbD5FbWFpbCBQcmVmZXJlbmNlczwvc21hbGw+PC9hPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLXJlbW92ZS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwicmVtb3ZlX2VtYWlsWycgKyBuZXh0RW1haWxDb3VudCArICddXCIgaWQ9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5SZW1vdmU8L3NtYWxsPjwvbGFiZWw+PC9saT48L3VsPjwvbGk+JyApO1xuXHRcdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCAkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCgpICsgJywnICsgdmFsdWUgKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcubS1mb3JtLWNoYW5nZS1lbWFpbCAuYS1pbnB1dC13aXRoLWJ1dHRvbicgKS5yZW1vdmUoKTtcblx0XHRcdFx0aWYgKCAwID09PSAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKSAhPT0gJCggJ2lucHV0W25hbWU9XCJlbWFpbFwiXScgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gaXQgd291bGQgYmUgbmljZSB0byBvbmx5IGxvYWQgdGhlIGZvcm0sIGJ1dCB0aGVuIGNsaWNrIGV2ZW50cyBzdGlsbCBkb24ndCB3b3JrXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICggMCA8ICQoICcubS1mb3JtLWVtYWlsJyApLmxlbmd0aCApIHtcblx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0fVxufSk7XG4iLCIvLyBiYXNlZCBvbiB3aGljaCBidXR0b24gd2FzIGNsaWNrZWQsIHNldCB0aGUgdmFsdWVzIGZvciB0aGUgYW5hbHl0aWNzIGV2ZW50IGFuZCBjcmVhdGUgaXRcbmZ1bmN0aW9uIHRyYWNrU2hvd0NvbW1lbnRzKCBhbHdheXMsIGlkLCBjbGlja192YWx1ZSApIHtcblx0dmFyIGFjdGlvbiAgICAgICAgICA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlfcHJlZml4ID0gJyc7XG5cdHZhciBjYXRlZ29yeV9zdWZmaXggPSAnJztcblx0dmFyIHBvc2l0aW9uICAgICAgICA9ICcnO1xuXHRwb3NpdGlvbiA9IGlkLnJlcGxhY2UoICdhbHdheXMtc2hvdy1jb21tZW50cy0nLCAnJyApO1xuXHRpZiAoICcxJyA9PT0gY2xpY2tfdmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09uJztcblx0fSBlbHNlIGlmICggJzAnID09PSBjbGlja192YWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5X3ByZWZpeCA9ICdBbHdheXMgJztcblx0fVxuXHRpZiAoICcnICE9PSBwb3NpdGlvbiApIHtcblx0XHRwb3NpdGlvbiA9IHBvc2l0aW9uLmNoYXJBdCggMCApLnRvVXBwZXJDYXNlKCkgKyBwb3NpdGlvbi5zbGljZSggMSApO1xuXHRcdGNhdGVnb3J5X3N1ZmZpeCA9ICcgLSAnICsgcG9zaXRpb247XG5cdH1cblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeV9wcmVmaXggKyAnU2hvdyBDb21tZW50cycgKyBjYXRlZ29yeV9zdWZmaXgsIGFjdGlvbiwgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn1cblxuLy8gd2hlbiBzaG93aW5nIGNvbW1lbnRzIG9uY2UsIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWJ1dHRvbi1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCBmYWxzZSwgJycsICcnICk7XG59KTtcblxuLy8gU2V0IHVzZXIgbWV0YSB2YWx1ZSBmb3IgYWx3YXlzIHNob3dpbmcgY29tbWVudHMgaWYgdGhhdCBidXR0b24gaXMgY2xpY2tlZFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHZhciB0aGF0ID0gJCggdGhpcyApO1xuXHRpZiAoIHRoYXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gZWxzZSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuXHR0cmFja1Nob3dDb21tZW50cyggdHJ1ZSwgdGhhdC5hdHRyKCAnaWQnICksIHRoYXQudmFsKCkgKTtcblxuXHQvLyB3ZSBhbHJlYWR5IGhhdmUgYWpheHVybCBmcm9tIHRoZSB0aGVtZVxuXHQkLmFqYXgoe1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHR1cmw6IGFqYXh1cmwsXG5cdFx0ZGF0YToge1xuICAgICAgICBcdCdhY3Rpb24nOiAnbWlubnBvc3RfbGFyZ29fbG9hZF9jb21tZW50c19zZXRfdXNlcl9tZXRhJyxcbiAgICAgICAgXHQndmFsdWUnOiB0aGF0LnZhbCgpXG5cdFx0fSxcblx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG4gICAgICAgIFx0JCggJy5hLWFsd2F5cy1zaG93LWNvbW1lbnRzLXJlc3VsdCcsIHRoYXQucGFyZW50KCkgKS5odG1sKCByZXNwb25zZS5kYXRhLm1lc3NhZ2UgKTtcbiAgICAgICAgXHRpZiAoIHRydWUgPT09IHJlc3BvbnNlLmRhdGEuc2hvdyApIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcbiJdfQ==
}(jQuery));
