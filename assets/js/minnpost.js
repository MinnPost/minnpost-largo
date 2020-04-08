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
  var navTransitioner = transitionHiddenElement({
    element: document.querySelector('.m-menu-primary-links'),
    visibleClass: 'is-open',
    displayValue: 'flex'
  });
  var navToggle = document.querySelector('nav button');
  navToggle.addEventListener('click', function (e) {
    e.preventDefault();
    var expanded = this.getAttribute('aria-expanded') === 'true' || false;
    this.setAttribute('aria-expanded', !expanded);

    if (true === expanded) {
      navTransitioner.transitionHide();
    } else {
      navTransitioner.transitionShow();
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
      var expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
      var searchIsVisible = searchVisible.getAttribute('aria-expanded') === 'true' || false;

      if (undefined !== _typeof(expanded) && true === expanded) {
        navToggle.setAttribute('aria-expanded', !expanded);
        navTransitioner.transitionHide();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDAtc3RhcnQuanMiLCIwMS1mb250cy5qcyIsIjAyLWFuYWx5dGljcy5qcyIsIjAzLXNoYXJlLmpzIiwiMDQtbmF2aWdhdGlvbi5qcyIsIjA1LWZvcm1zLmpzIiwiMDYtY29tbWVudHMuanMiXSwibmFtZXMiOlsidGxpdGUiLCJ0IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImkiLCJ0YXJnZXQiLCJuIiwicGFyZW50RWxlbWVudCIsInNob3ciLCJ0b29sdGlwIiwibyIsImhpZGUiLCJsIiwiciIsImNsYXNzTmFtZSIsInMiLCJvZmZzZXRUb3AiLCJvZmZzZXRMZWZ0Iiwib2Zmc2V0UGFyZW50Iiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJkIiwiZiIsImEiLCJzdHlsZSIsInRvcCIsImxlZnQiLCJjcmVhdGVFbGVtZW50IiwiZ3JhdiIsImdldEF0dHJpYnV0ZSIsImlubmVySFRNTCIsImFwcGVuZENoaWxkIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiYm90dG9tIiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJyaWdodCIsImlubmVyV2lkdGgiLCJ0aXRsZSIsInNldEF0dHJpYnV0ZSIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJtb2R1bGUiLCJleHBvcnRzIiwidHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQiLCJlbGVtZW50IiwidmlzaWJsZUNsYXNzIiwid2FpdE1vZGUiLCJ0aW1lb3V0RHVyYXRpb24iLCJoaWRlTW9kZSIsImRpc3BsYXlWYWx1ZSIsImNvbnNvbGUiLCJlcnJvciIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwibGlzdGVuZXIiLCJhcHBseUhpZGRlbkF0dHJpYnV0ZXMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzcGxheSIsInJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMiLCJyZW1vdmVBdHRyaWJ1dGUiLCJ0cmFuc2l0aW9uU2hvdyIsInRpbWVvdXQiLCJyZWZsb3ciLCJjbGFzc0xpc3QiLCJhZGQiLCJ0cmFuc2l0aW9uSGlkZSIsInJlbW92ZSIsInRvZ2dsZSIsImlzSGlkZGVuIiwiaGFzSGlkZGVuQXR0cmlidXRlIiwiaXNEaXNwbGF5Tm9uZSIsImhhc1Zpc2libGVDbGFzcyIsImluY2x1ZGVzIiwiJCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJzZXNzaW9uU3RvcmFnZSIsInNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwiLCJzYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwiLCJkb2N1bWVudEVsZW1lbnQiLCJnIiwicHVzaCIsImxlbmd0aCIsIm0iLCJzaGlmdCIsInAiLCJiIiwicSIsImMiLCJ1IiwiVHlwZUVycm9yIiwidGhlbiIsImNhbGwiLCJ2IiwiaCIsInByb3RvdHlwZSIsInciLCJrIiwieCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmFjZSIsImFsbCIsImF0dGFjaEV2ZW50IiwiYm9keSIsInJlYWR5U3RhdGUiLCJkZXRhY2hFdmVudCIsImNyZWF0ZVRleHROb2RlIiwiY3NzVGV4dCIsInoiLCJ3aWR0aCIsInNjcm9sbExlZnQiLCJzY3JvbGxXaWR0aCIsIkEiLCJCIiwiZmFtaWx5Iiwid2VpZ2h0Iiwic3RyZXRjaCIsIkMiLCJEIiwiRSIsIkYiLCJHIiwiSiIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ2ZW5kb3IiLCJleGVjIiwidXNlckFnZW50IiwicGFyc2VJbnQiLCJmb250cyIsIksiLCJmb250IiwiTCIsImpvaW4iLCJsb2FkIiwiSCIsIkRhdGUiLCJnZXRUaW1lIiwiTSIsIkVycm9yIiwiTiIsInkiLCJJIiwiaGlkZGVuIiwiZGlyIiwiRm9udEZhY2VPYnNlcnZlciIsInNhbnNOb3JtYWwiLCJzYW5zQm9sZCIsInNhbnNOb3JtYWxJdGFsaWMiLCJzZXJpZkJvb2siLCJzZXJpZkJvb2tJdGFsaWMiLCJzZXJpZkJvbGQiLCJzZXJpZkJvbGRJdGFsaWMiLCJzZXJpZkJsYWNrIiwic2VyaWZCbGFja0l0YWxpYyIsIm1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCIsInR5cGUiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwidmFsdWUiLCJnYSIsInJlYWR5IiwiUFVNIiwiY3VycmVudF9wb3B1cCIsImdldFBvcHVwIiwic2V0dGluZ3MiLCJnZXRTZXR0aW5ncyIsInBvcHVwX2lkIiwiaWQiLCJvbiIsImNsb3NlX3RyaWdnZXIiLCJmbiIsInBvcG1ha2UiLCJsYXN0X2Nsb3NlX3RyaWdnZXIiLCJjbGljayIsInVybCIsImF0dHIiLCJtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEiLCJ1cmxfYWNjZXNzX2xldmVsIiwibG9jYXRpb24iLCJwYXRobmFtZSIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJjb3B5Q3VycmVudFVSTCIsImR1bW15IiwiaHJlZiIsInNlbGVjdCIsImV4ZWNDb21tYW5kIiwiZGF0YSIsInByZXZlbnREZWZhdWx0IiwicHJpbnQiLCJvcGVuIiwic2V0dXBQcmltYXJ5TmF2IiwibmF2VHJhbnNpdGlvbmVyIiwicXVlcnlTZWxlY3RvciIsIm5hdlRvZ2dsZSIsImV4cGFuZGVkIiwic3BhbiIsImRpdiIsImZyYWdtZW50IiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsInNlYXJjaFRyYW5zaXRpb25lciIsInNlYXJjaFZpc2libGUiLCJzZWFyY2hDbG9zZSIsImtleXVwIiwia2V5Q29kZSIsInNlYXJjaElzVmlzaWJsZSIsInVuZGVmaW5lZCIsIndpZGdldF90aXRsZSIsImNsb3Nlc3QiLCJmaW5kIiwiem9uZV90aXRsZSIsInNpZGViYXJfc2VjdGlvbl90aXRsZSIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwidHJpbSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJmb3JtIiwicmVzdF9yb290IiwidXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdCIsInNpdGVfdXJsIiwicmVzdF9uYW1lc3BhY2UiLCJmdWxsX3VybCIsImNvbmZpcm1DaGFuZ2UiLCJuZXh0RW1haWxDb3VudCIsIm5ld1ByaW1hcnlFbWFpbCIsIm9sZFByaW1hcnlFbWFpbCIsInByaW1hcnlJZCIsImVtYWlsVG9SZW1vdmUiLCJjb25zb2xpZGF0ZWRFbWFpbHMiLCJuZXdFbWFpbHMiLCJhamF4X2Zvcm1fZGF0YSIsInRoYXQiLCJwcm9wIiwiZXZlbnQiLCJ2YWwiLCJyZXBsYWNlIiwicGFyZW50IiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJpbmRleCIsImdldCIsInBhcmVudHMiLCJmYWRlT3V0IiwibG9nIiwiYmVmb3JlIiwiYnV0dG9uIiwiYnV0dG9uX2Zvcm0iLCJzdWJtaXR0aW5nX2J1dHRvbiIsInNlcmlhbGl6ZSIsImFqYXgiLCJiZWZvcmVTZW5kIiwieGhyIiwic2V0UmVxdWVzdEhlYWRlciIsIm5vbmNlIiwiZGF0YVR5cGUiLCJkb25lIiwibWFwIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicmVsb2FkIiwidHJhY2tTaG93Q29tbWVudHMiLCJhbHdheXMiLCJjbGlja192YWx1ZSIsImNhdGVnb3J5X3ByZWZpeCIsImNhdGVnb3J5X3N1ZmZpeCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJpcyIsImFqYXh1cmwiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJodG1sIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxLQUFULENBQWVDLENBQWYsRUFBaUI7QUFBQ0MsRUFBQUEsUUFBUSxDQUFDQyxnQkFBVCxDQUEwQixXQUExQixFQUFzQyxVQUFTQyxDQUFULEVBQVc7QUFBQyxRQUFJQyxDQUFDLEdBQUNELENB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LENBQTJERCxRQUFRLENBQUM3RixJQUFULENBQWMrRixPQUF6RTs7QUFDQSxVQUFLLFNBQVNGLFFBQVEsQ0FBQzdGLElBQVQsQ0FBYy9MLElBQTVCLEVBQW1DO0FBQ3hDb0UsUUFBQUEsQ0FBQyxDQUFFLGtDQUFGLENBQUQsQ0FBd0NpTCxHQUF4QyxDQUE2QyxDQUE3QztBQUNBLE9BRkssTUFFQztBQUNOakwsUUFBQUEsQ0FBQyxDQUFFLGtDQUFGLENBQUQsQ0FBd0NpTCxHQUF4QyxDQUE2QyxDQUE3QztBQUNBO0FBQ0Q7QUFkSyxHQUFQO0FBZ0JBLENBNUJEIiwiZmlsZSI6Im1pbm5wb3N0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gdGxpdGUodCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLGZ1bmN0aW9uKGUpe3ZhciBpPWUudGFyZ2V0LG49dChpKTtufHwobj0oaT1pLnBhcmVudEVsZW1lbnQpJiZ0KGkpKSxuJiZ0bGl0ZS5zaG93KGksbiwhMCl9KX10bGl0ZS5zaG93PWZ1bmN0aW9uKHQsZSxpKXt2YXIgbj1cImRhdGEtdGxpdGVcIjtlPWV8fHt9LCh0LnRvb2x0aXB8fGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gbygpe3RsaXRlLmhpZGUodCwhMCl9ZnVuY3Rpb24gbCgpe3J8fChyPWZ1bmN0aW9uKHQsZSxpKXtmdW5jdGlvbiBuKCl7by5jbGFzc05hbWU9XCJ0bGl0ZSB0bGl0ZS1cIityK3M7dmFyIGU9dC5vZmZzZXRUb3AsaT10Lm9mZnNldExlZnQ7by5vZmZzZXRQYXJlbnQ9PT10JiYoZT1pPTApO3ZhciBuPXQub2Zmc2V0V2lkdGgsbD10Lm9mZnNldEhlaWdodCxkPW8ub2Zmc2V0SGVpZ2h0LGY9by5vZmZzZXRXaWR0aCxhPWkrbi8yO28uc3R5bGUudG9wPShcInNcIj09PXI/ZS1kLTEwOlwiblwiPT09cj9lK2wrMTA6ZStsLzItZC8yKStcInB4XCIsby5zdHlsZS5sZWZ0PShcIndcIj09PXM/aTpcImVcIj09PXM/aStuLWY6XCJ3XCI9PT1yP2krbisxMDpcImVcIj09PXI/aS1mLTEwOmEtZi8yKStcInB4XCJ9dmFyIG89ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksbD1pLmdyYXZ8fHQuZ2V0QXR0cmlidXRlKFwiZGF0YS10bGl0ZVwiKXx8XCJuXCI7by5pbm5lckhUTUw9ZSx0LmFwcGVuZENoaWxkKG8pO3ZhciByPWxbMF18fFwiXCIscz1sWzFdfHxcIlwiO24oKTt2YXIgZD1vLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVyblwic1wiPT09ciYmZC50b3A8MD8ocj1cIm5cIixuKCkpOlwiblwiPT09ciYmZC5ib3R0b20+d2luZG93LmlubmVySGVpZ2h0PyhyPVwic1wiLG4oKSk6XCJlXCI9PT1yJiZkLmxlZnQ8MD8ocj1cIndcIixuKCkpOlwid1wiPT09ciYmZC5yaWdodD53aW5kb3cuaW5uZXJXaWR0aCYmKHI9XCJlXCIsbigpKSxvLmNsYXNzTmFtZSs9XCIgdGxpdGUtdmlzaWJsZVwiLG99KHQsZCxlKSl9dmFyIHIscyxkO3JldHVybiB0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixvKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsbyksdC50b29sdGlwPXtzaG93OmZ1bmN0aW9uKCl7ZD10LnRpdGxlfHx0LmdldEF0dHJpYnV0ZShuKXx8ZCx0LnRpdGxlPVwiXCIsdC5zZXRBdHRyaWJ1dGUobixcIlwiKSxkJiYhcyYmKHM9c2V0VGltZW91dChsLGk/MTUwOjEpKX0saGlkZTpmdW5jdGlvbih0KXtpZihpPT09dCl7cz1jbGVhclRpbWVvdXQocyk7dmFyIGU9ciYmci5wYXJlbnROb2RlO2UmJmUucmVtb3ZlQ2hpbGQocikscj12b2lkIDB9fX19KHQsZSkpLnNob3coKX0sdGxpdGUuaGlkZT1mdW5jdGlvbih0LGUpe3QudG9vbHRpcCYmdC50b29sdGlwLmhpZGUoZSl9LFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9dGxpdGUpOyIsIi8qKiBcbiAqIExpYnJhcnkgY29kZVxuICogVXNpbmcgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvQGNsb3VkZm91ci90cmFuc2l0aW9uLWhpZGRlbi1lbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoe1xuICBlbGVtZW50LFxuICB2aXNpYmxlQ2xhc3MsXG4gIHdhaXRNb2RlID0gJ3RyYW5zaXRpb25lbmQnLFxuICB0aW1lb3V0RHVyYXRpb24sXG4gIGhpZGVNb2RlID0gJ2hpZGRlbicsXG4gIGRpc3BsYXlWYWx1ZSA9ICdibG9jaydcbn0pIHtcbiAgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcgJiYgdHlwZW9mIHRpbWVvdXREdXJhdGlvbiAhPT0gJ251bWJlcicpIHtcbiAgICBjb25zb2xlLmVycm9yKGBcbiAgICAgIFdoZW4gY2FsbGluZyB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCB3aXRoIHdhaXRNb2RlIHNldCB0byB0aW1lb3V0LFxuICAgICAgeW91IG11c3QgcGFzcyBpbiBhIG51bWJlciBmb3IgdGltZW91dER1cmF0aW9uLlxuICAgIGApO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRG9uJ3Qgd2FpdCBmb3IgZXhpdCB0cmFuc2l0aW9ucyBpZiBhIHVzZXIgcHJlZmVycyByZWR1Y2VkIG1vdGlvbi5cbiAgLy8gSWRlYWxseSB0cmFuc2l0aW9ucyB3aWxsIGJlIGRpc2FibGVkIGluIENTUywgd2hpY2ggbWVhbnMgd2Ugc2hvdWxkIG5vdCB3YWl0XG4gIC8vIGJlZm9yZSBhZGRpbmcgYGhpZGRlbmAuXG4gIGlmICh3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKS5tYXRjaGVzKSB7XG4gICAgd2FpdE1vZGUgPSAnaW1tZWRpYXRlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBldmVudCBsaXN0ZW5lciB0byBhZGQgYGhpZGRlbmAgYWZ0ZXIgb3VyIGFuaW1hdGlvbnMgY29tcGxldGUuXG4gICAqIFRoaXMgbGlzdGVuZXIgd2lsbCByZW1vdmUgaXRzZWxmIGFmdGVyIGNvbXBsZXRpbmcuXG4gICAqL1xuICBjb25zdCBsaXN0ZW5lciA9IGUgPT4ge1xuICAgIC8vIENvbmZpcm0gYHRyYW5zaXRpb25lbmRgIHdhcyBjYWxsZWQgb24gIG91ciBgZWxlbWVudGAgYW5kIGRpZG4ndCBidWJibGVcbiAgICAvLyB1cCBmcm9tIGEgY2hpbGQgZWxlbWVudC5cbiAgICBpZiAoZS50YXJnZXQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFwcGx5SGlkZGVuQXR0cmlidXRlcyA9ICgpID0+IHtcbiAgICBpZihoaWRlTW9kZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogU2hvdyB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25TaG93KCkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGlzIGxpc3RlbmVyIHNob3VsZG4ndCBiZSBoZXJlIGJ1dCBpZiBzb21lb25lIHNwYW1zIHRoZSB0b2dnbGVcbiAgICAgICAqIG92ZXIgYW5kIG92ZXIgcmVhbGx5IGZhc3QgaXQgY2FuIGluY29ycmVjdGx5IHN0aWNrIGFyb3VuZC5cbiAgICAgICAqIFdlIHJlbW92ZSBpdCBqdXN0IHRvIGJlIHNhZmUuXG4gICAgICAgKi9cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBTaW1pbGFybHksIHdlJ2xsIGNsZWFyIHRoZSB0aW1lb3V0IGluIGNhc2UgaXQncyBzdGlsbCBoYW5naW5nIGFyb3VuZC5cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgIH1cblxuICAgICAgcmVtb3ZlSGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICAvKipcbiAgICAgICAqIEZvcmNlIGEgYnJvd3NlciByZS1wYWludCBzbyB0aGUgYnJvd3NlciB3aWxsIHJlYWxpemUgdGhlXG4gICAgICAgKiBlbGVtZW50IGlzIG5vIGxvbmdlciBgaGlkZGVuYCBhbmQgYWxsb3cgdHJhbnNpdGlvbnMuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHJlZmxvdyA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSGlkZSB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25IaWRlKCkge1xuICAgICAgaWYgKHdhaXRNb2RlID09PSAndHJhbnNpdGlvbmVuZCcpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuICAgICAgfSBlbHNlIGlmICh3YWl0TW9kZSA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuICAgICAgICB9LCB0aW1lb3V0RHVyYXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCB0aGlzIGNsYXNzIHRvIHRyaWdnZXIgb3VyIGFuaW1hdGlvblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHZpc2libGVDbGFzcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZSB0aGUgZWxlbWVudCdzIHZpc2liaWxpdHlcbiAgICAgKi9cbiAgICB0b2dnbGUoKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbigpKSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvblNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGVsbCB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIGhpZGRlbiBvciBub3QuXG4gICAgICovXG4gICAgaXNIaWRkZW4oKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBoaWRkZW4gYXR0cmlidXRlIGRvZXMgbm90IHJlcXVpcmUgYSB2YWx1ZS4gU2luY2UgYW4gZW1wdHkgc3RyaW5nIGlzXG4gICAgICAgKiBmYWxzeSwgYnV0IHNob3dzIHRoZSBwcmVzZW5jZSBvZiBhbiBhdHRyaWJ1dGUgd2UgY29tcGFyZSB0byBgbnVsbGBcbiAgICAgICAqL1xuICAgICAgY29uc3QgaGFzSGlkZGVuQXR0cmlidXRlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hpZGRlbicpICE9PSBudWxsO1xuXG4gICAgICBjb25zdCBpc0Rpc3BsYXlOb25lID0gZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZSc7XG5cbiAgICAgIGNvbnN0IGhhc1Zpc2libGVDbGFzcyA9IFsuLi5lbGVtZW50LmNsYXNzTGlzdF0uaW5jbHVkZXModmlzaWJsZUNsYXNzKTtcblxuICAgICAgcmV0dXJuIGhhc0hpZGRlbkF0dHJpYnV0ZSB8fCBpc0Rpc3BsYXlOb25lIHx8ICFoYXNWaXNpYmxlQ2xhc3M7XG4gICAgfSxcblxuICAgIC8vIEEgcGxhY2Vob2xkZXIgZm9yIG91ciBgdGltZW91dGBcbiAgICB0aW1lb3V0OiBudWxsXG4gIH07XG59IiwiJCggJ2h0bWwnICkucmVtb3ZlQ2xhc3MoICduby1qcycgKS5hZGRDbGFzcyggJ2pzJyApOyIsIi8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5pZiAoIHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgJiYgc2Vzc2lvblN0b3JhZ2Uuc2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsICkge1xuXHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkIHNhbnMtZm9udHMtbG9hZGVkJztcbn0gZWxzZSB7XG5cdC8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4xLjAgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oZnVuY3Rpb24oKXsndXNlIHN0cmljdCc7dmFyIGYsZz1bXTtmdW5jdGlvbiBsKGEpe2cucHVzaChhKTsxPT1nLmxlbmd0aCYmZigpfWZ1bmN0aW9uIG0oKXtmb3IoO2cubGVuZ3RoOylnWzBdKCksZy5zaGlmdCgpfWY9ZnVuY3Rpb24oKXtzZXRUaW1lb3V0KG0pfTtmdW5jdGlvbiBuKGEpe3RoaXMuYT1wO3RoaXMuYj12b2lkIDA7dGhpcy5mPVtdO3ZhciBiPXRoaXM7dHJ5e2EoZnVuY3Rpb24oYSl7cShiLGEpfSxmdW5jdGlvbihhKXtyKGIsYSl9KX1jYXRjaChjKXtyKGIsYyl9fXZhciBwPTI7ZnVuY3Rpb24gdChhKXtyZXR1cm4gbmV3IG4oZnVuY3Rpb24oYixjKXtjKGEpfSl9ZnVuY3Rpb24gdShhKXtyZXR1cm4gbmV3IG4oZnVuY3Rpb24oYil7YihhKX0pfWZ1bmN0aW9uIHEoYSxiKXtpZihhLmE9PXApe2lmKGI9PWEpdGhyb3cgbmV3IFR5cGVFcnJvcjt2YXIgYz0hMTt0cnl7dmFyIGQ9YiYmYi50aGVuO2lmKG51bGwhPWImJlwib2JqZWN0XCI9PXR5cGVvZiBiJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBkKXtkLmNhbGwoYixmdW5jdGlvbihiKXtjfHxxKGEsYik7Yz0hMH0sZnVuY3Rpb24oYil7Y3x8cihhLGIpO2M9ITB9KTtyZXR1cm59fWNhdGNoKGUpe2N8fHIoYSxlKTtyZXR1cm59YS5hPTA7YS5iPWI7dihhKX19XG5cdGZ1bmN0aW9uIHIoYSxiKXtpZihhLmE9PXApe2lmKGI9PWEpdGhyb3cgbmV3IFR5cGVFcnJvcjthLmE9MTthLmI9Yjt2KGEpfX1mdW5jdGlvbiB2KGEpe2woZnVuY3Rpb24oKXtpZihhLmEhPXApZm9yKDthLmYubGVuZ3RoOyl7dmFyIGI9YS5mLnNoaWZ0KCksYz1iWzBdLGQ9YlsxXSxlPWJbMl0sYj1iWzNdO3RyeXswPT1hLmE/XCJmdW5jdGlvblwiPT10eXBlb2YgYz9lKGMuY2FsbCh2b2lkIDAsYS5iKSk6ZShhLmIpOjE9PWEuYSYmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGQ/ZShkLmNhbGwodm9pZCAwLGEuYikpOmIoYS5iKSl9Y2F0Y2goaCl7YihoKX19fSl9bi5wcm90b3R5cGUuZz1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5jKHZvaWQgMCxhKX07bi5wcm90b3R5cGUuYz1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXM7cmV0dXJuIG5ldyBuKGZ1bmN0aW9uKGQsZSl7Yy5mLnB1c2goW2EsYixkLGVdKTt2KGMpfSl9O1xuXHRmdW5jdGlvbiB3KGEpe3JldHVybiBuZXcgbihmdW5jdGlvbihiLGMpe2Z1bmN0aW9uIGQoYyl7cmV0dXJuIGZ1bmN0aW9uKGQpe2hbY109ZDtlKz0xO2U9PWEubGVuZ3RoJiZiKGgpfX12YXIgZT0wLGg9W107MD09YS5sZW5ndGgmJmIoaCk7Zm9yKHZhciBrPTA7azxhLmxlbmd0aDtrKz0xKXUoYVtrXSkuYyhkKGspLGMpfSl9ZnVuY3Rpb24geChhKXtyZXR1cm4gbmV3IG4oZnVuY3Rpb24oYixjKXtmb3IodmFyIGQ9MDtkPGEubGVuZ3RoO2QrPTEpdShhW2RdKS5jKGIsYyl9KX07d2luZG93LlByb21pc2V8fCh3aW5kb3cuUHJvbWlzZT1uLHdpbmRvdy5Qcm9taXNlLnJlc29sdmU9dSx3aW5kb3cuUHJvbWlzZS5yZWplY3Q9dCx3aW5kb3cuUHJvbWlzZS5yYWNlPXgsd2luZG93LlByb21pc2UuYWxsPXcsd2luZG93LlByb21pc2UucHJvdG90eXBlLnRoZW49bi5wcm90b3R5cGUuYyx3aW5kb3cuUHJvbWlzZS5wcm90b3R5cGVbXCJjYXRjaFwiXT1uLnByb3RvdHlwZS5nKTt9KCkpO1xuXG5cdChmdW5jdGlvbigpe2Z1bmN0aW9uIGwoYSxiKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2EuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLGIsITEpOmEuYXR0YWNoRXZlbnQoXCJzY3JvbGxcIixiKX1mdW5jdGlvbiBtKGEpe2RvY3VtZW50LmJvZHk/YSgpOmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbiBjKCl7ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixjKTthKCl9KTpkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGZ1bmN0aW9uIGsoKXtpZihcImludGVyYWN0aXZlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGV8fFwiY29tcGxldGVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZSlkb2N1bWVudC5kZXRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGspLGEoKX0pfTtmdW5jdGlvbiB0KGEpe3RoaXMuYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RoaXMuYS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKTt0aGlzLmEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYSkpO3RoaXMuYj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5oPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmc9LTE7dGhpcy5iLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmMuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO1xuXHR0aGlzLmYuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuaC5zdHlsZS5jc3NUZXh0PVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjt0aGlzLmIuYXBwZW5kQ2hpbGQodGhpcy5oKTt0aGlzLmMuYXBwZW5kQ2hpbGQodGhpcy5mKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5iKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5jKX1cblx0ZnVuY3Rpb24gdShhLGIpe2EuYS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6XCIrYitcIjtcIn1mdW5jdGlvbiB6KGEpe3ZhciBiPWEuYS5vZmZzZXRXaWR0aCxjPWIrMTAwO2EuZi5zdHlsZS53aWR0aD1jK1wicHhcIjthLmMuc2Nyb2xsTGVmdD1jO2EuYi5zY3JvbGxMZWZ0PWEuYi5zY3JvbGxXaWR0aCsxMDA7cmV0dXJuIGEuZyE9PWI/KGEuZz1iLCEwKTohMX1mdW5jdGlvbiBBKGEsYil7ZnVuY3Rpb24gYygpe3ZhciBhPWs7eihhKSYmYS5hLnBhcmVudE5vZGUmJmIoYS5nKX12YXIgaz1hO2woYS5iLGMpO2woYS5jLGMpO3ooYSl9O2Z1bmN0aW9uIEIoYSxiKXt2YXIgYz1ifHx7fTt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwifXZhciBDPW51bGwsRD1udWxsLEU9bnVsbCxGPW51bGw7ZnVuY3Rpb24gRygpe2lmKG51bGw9PT1EKWlmKEooKSYmL0FwcGxlLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKSl7dmFyIGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO0Q9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCl9ZWxzZSBEPSExO3JldHVybiBEfWZ1bmN0aW9uIEooKXtudWxsPT09RiYmKEY9ISFkb2N1bWVudC5mb250cyk7cmV0dXJuIEZ9XG5cdGZ1bmN0aW9uIEsoKXtpZihudWxsPT09RSl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0cnl7YS5zdHlsZS5mb250PVwiY29uZGVuc2VkIDEwMHB4IHNhbnMtc2VyaWZcIn1jYXRjaChiKXt9RT1cIlwiIT09YS5zdHlsZS5mb250fXJldHVybiBFfWZ1bmN0aW9uIEwoYSxiKXtyZXR1cm5bYS5zdHlsZSxhLndlaWdodCxLKCk/YS5zdHJldGNoOlwiXCIsXCIxMDBweFwiLGJdLmpvaW4oXCIgXCIpfVxuXHRCLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxrPWF8fFwiQkVTYnN3eVwiLHI9MCxuPWJ8fDNFMyxIPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2lmKEooKSYmIUcoKSl7dmFyIE09bmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBlKCl7KG5ldyBEYXRlKS5nZXRUaW1lKCktSD49bj9iKEVycm9yKFwiXCIrbitcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpOmRvY3VtZW50LmZvbnRzLmxvYWQoTChjLCdcIicrYy5mYW1pbHkrJ1wiJyksaykudGhlbihmdW5jdGlvbihjKXsxPD1jLmxlbmd0aD9hKCk6c2V0VGltZW91dChlLDI1KX0sYil9ZSgpfSksTj1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGMpe3I9c2V0VGltZW91dChmdW5jdGlvbigpe2MoRXJyb3IoXCJcIituK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSl9LG4pfSk7UHJvbWlzZS5yYWNlKFtOLE1dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHIpO2EoYyl9LFxuXHRiKX1lbHNlIG0oZnVuY3Rpb24oKXtmdW5jdGlvbiB2KCl7dmFyIGI7aWYoYj0tMSE9ZiYmLTEhPWd8fC0xIT1mJiYtMSE9aHx8LTEhPWcmJi0xIT1oKShiPWYhPWcmJmYhPWgmJmchPWgpfHwobnVsbD09PUMmJihiPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSxDPSEhYiYmKDUzNj5wYXJzZUludChiWzFdLDEwKXx8NTM2PT09cGFyc2VJbnQoYlsxXSwxMCkmJjExPj1wYXJzZUludChiWzJdLDEwKSkpLGI9QyYmKGY9PXcmJmc9PXcmJmg9PXd8fGY9PXgmJmc9PXgmJmg9PXh8fGY9PXkmJmc9PXkmJmg9PXkpKSxiPSFiO2ImJihkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxjbGVhclRpbWVvdXQociksYShjKSl9ZnVuY3Rpb24gSSgpe2lmKChuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PW4pZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksYihFcnJvcihcIlwiK1xuXHRuK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLGc9cC5hLm9mZnNldFdpZHRoLGg9cS5hLm9mZnNldFdpZHRoLHYoKTtyPXNldFRpbWVvdXQoSSw1MCl9fXZhciBlPW5ldyB0KGspLHA9bmV3IHQoaykscT1uZXcgdChrKSxmPS0xLGc9LTEsaD0tMSx3PS0xLHg9LTEseT0tMSxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5kaXI9XCJsdHJcIjt1KGUsTChjLFwic2Fucy1zZXJpZlwiKSk7dShwLEwoYyxcInNlcmlmXCIpKTt1KHEsTChjLFwibW9ub3NwYWNlXCIpKTtkLmFwcGVuZENoaWxkKGUuYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2QuYXBwZW5kQ2hpbGQocS5hKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO3c9ZS5hLm9mZnNldFdpZHRoO3g9cC5hLm9mZnNldFdpZHRoO3k9cS5hLm9mZnNldFdpZHRoO0koKTtBKGUsZnVuY3Rpb24oYSl7Zj1hO3YoKX0pO3UoZSxcblx0TChjLCdcIicrYy5mYW1pbHkrJ1wiLHNhbnMtc2VyaWYnKSk7QShwLGZ1bmN0aW9uKGEpe2c9YTt2KCl9KTt1KHAsTChjLCdcIicrYy5mYW1pbHkrJ1wiLHNlcmlmJykpO0EocSxmdW5jdGlvbihhKXtoPWE7digpfSk7dShxLEwoYywnXCInK2MuZmFtaWx5KydcIixtb25vc3BhY2UnKSl9KX0pfTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1COih3aW5kb3cuRm9udEZhY2VPYnNlcnZlcj1CLHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkPUIucHJvdG90eXBlLmxvYWQpO30oKSk7XG5cblx0Ly8gbWlubnBvc3QgZm9udHNcblxuXHQvLyBzYW5zXG5cdHZhciBzYW5zTm9ybWFsID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoICdmZi1tZXRhLXdlYi1wcm8nICk7XG5cdHZhciBzYW5zQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNhbnNOb3JtYWxJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA0MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cblx0Ly8gc2VyaWZcblx0dmFyIHNlcmlmQm9vayA9IG5ldyBGb250RmFjZU9ic2VydmVyKCBcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA1MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvb2tJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA1MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvbGQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvbGRJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJsYWNrID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogOTAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCbGFja0l0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDkwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblxuXHRQcm9taXNlLmFsbCggW1xuXHRcdHNhbnNOb3JtYWwubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zTm9ybWFsSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvb2subG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9va0l0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvbGRJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQmxhY2subG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQmxhY2tJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApXG5cdF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkJztcblx0XHQvLyBPcHRpbWl6YXRpb24gZm9yIFJlcGVhdCBWaWV3c1xuXHRcdHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG5cblx0UHJvbWlzZS5hbGwoIFtcblx0XHRzYW5zTm9ybWFsLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zQm9sZC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc05vcm1hbEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwIClcblx0XSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzYW5zLWZvbnRzLWxvYWRlZCc7XG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG59XG5cbiIsImZ1bmN0aW9uIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHZhbHVlICkge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggZSApIHtcblxuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgUFVNICkge1xuXHRcdHZhciBjdXJyZW50X3BvcHVwID0gUFVNLmdldFBvcHVwKCAkKCAnLnB1bScgKSApO1xuXHRcdHZhciBzZXR0aW5ncyA9IFBVTS5nZXRTZXR0aW5ncyggJCggJy5wdW0nICkgKTtcblx0XHR2YXIgcG9wdXBfaWQgPSBzZXR0aW5ncy5pZDtcblx0XHQkKCBkb2N1bWVudCApLm9uKCAncHVtQWZ0ZXJPcGVuJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdTaG93JywgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9KTtcblx0XHR9KTtcblx0XHQkKCBkb2N1bWVudCApLm9uKCAncHVtQWZ0ZXJDbG9zZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGNsb3NlX3RyaWdnZXIgPSAkLmZuLnBvcG1ha2UubGFzdF9jbG9zZV90cmlnZ2VyO1xuXHRcdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGNsb3NlX3RyaWdnZXIgKSB7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgY2xvc2VfdHJpZ2dlciwgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkKCAnLm1lc3NhZ2UtY2xvc2UnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBsaW5rIHdpdGggY2xvc2UgY2xhc3Ncblx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJ0Nsb3NlIEJ1dHRvbic7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSk7XG5cdFx0fSk7XG5cdFx0JCggJy5tZXNzYWdlLWxvZ2luJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGxvZ2luIGNsYXNzXG5cdFx0XHR2YXIgdXJsID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnTG9naW4gTGluaycsIHVybCApO1xuXHRcdH0pO1xuXHRcdCQoICcucHVtLWNvbnRlbnQgYTpub3QoIC5tZXNzYWdlLWNsb3NlLCAucHVtLWNsb3NlLCAubWVzc2FnZS1sb2dpbiApJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3Mgc29tZXRoaW5nIHRoYXQgaXMgbm90IGNsb3NlIHRleHQgb3IgY2xvc2UgaWNvblxuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnQ2xpY2snLCBwb3B1cF9pZCApO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSAmJiAnJyAhPT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLnVybF9hY2Nlc3NfbGV2ZWwgKSB7XG5cdFx0dmFyIHR5cGUgPSAnZXZlbnQnO1xuXHRcdHZhciBjYXRlZ29yeSA9ICdNZW1iZXIgQ29udGVudCc7XG5cdFx0dmFyIGxhYmVsID0gbG9jYXRpb24ucGF0aG5hbWU7IC8vIGkgdGhpbmsgd2UgY291bGQgcG9zc2libHkgcHV0IHNvbWUgZ3JvdXBpbmcgaGVyZSwgYnV0IHdlIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYWNjZXNzIHRvIG9uZSBhbmQgbWF5YmUgaXQncyBub3Qgd29ydGh3aGlsZSB5ZXRcblx0XHR2YXIgYWN0aW9uID0gJ0Jsb2NrZWQnO1xuXHRcdGlmICggdHJ1ZSA9PT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLmN1cnJlbnRfdXNlci5jYW5fYWNjZXNzICkge1xuXHRcdFx0YWN0aW9uID0gJ1Nob3duJztcblx0XHR9XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHR9XG59KTtcbiIsImZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uID0gJycgKSB7XG5cblx0Ly8gaWYgYSBub3QgbG9nZ2VkIGluIHVzZXIgdHJpZXMgdG8gZW1haWwsIGRvbid0IGNvdW50IHRoYXQgYXMgYSBzaGFyZVxuXHRpZiAoICEgalF1ZXJ5KCAnYm9keScgKS5oYXNDbGFzcyggJ2xvZ2dlZC1pbicgKSAmJiAnRW1haWwnID09PSB0ZXh0ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBjYXRlZ29yeSA9ICdTaGFyZSc7XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdGNhdGVnb3J5ID0gJ1NoYXJlIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cblx0Ly8gdHJhY2sgYXMgYW4gZXZlbnQsIGFuZCBhcyBzb2NpYWwgaWYgaXQgaXMgdHdpdHRlciBvciBmYlxuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsIGNhdGVnb3J5LCB0ZXh0LCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0IHx8ICdUd2l0dGVyJyA9PT0gdGV4dCApIHtcblx0XHRcdGlmICggJ0ZhY2Vib29rJyA9PSB0ZXh0ICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZnVuY3Rpb24gY29weUN1cnJlbnRVUkwoKSB7XG5cdHZhciBkdW1teSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdpbnB1dCcgKSwgdGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkdW1teSApO1xuXHRkdW1teS52YWx1ZSA9IHRleHQ7XG5cdGR1bW15LnNlbGVjdCgpO1xuXHRkb2N1bWVudC5leGVjQ29tbWFuZCggJ2NvcHknICk7XG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoIGR1bW15ICk7XG59XG5cbiQoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLmRhdGEoICdzaGFyZS1hY3Rpb24nICk7XG5cdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSk7XG5cbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1wcmludCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR3aW5kb3cucHJpbnQoKTtcbn0pO1xuXG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtY29weS11cmwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGNvcHlDdXJyZW50VVJMKCk7XG5cdHRsaXRlLnNob3coICggZS50YXJnZXQgKSwgeyBncmF2OiAndycgfSApO1xuXHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHR0bGl0ZS5oaWRlKCAoIGUudGFyZ2V0ICkgKTtcblx0fSwgMzAwMCApO1xuXHRyZXR1cm4gZmFsc2U7XG59KTtcblxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWZhY2Vib29rIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXR3aXR0ZXIgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZW1haWwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0dmFyIHVybCA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcbiAgICB3aW5kb3cub3BlbiggdXJsLCAnX2JsYW5rJyApO1xufSk7XG4iLCIvKipcbiAqIEZpbGUgbmF2aWdhdGlvbi5qcy5cbiAqXG4gKiBOYXZpZ2F0aW9uIHNjcmlwdHMuIEluY2x1ZGVzIG1vYmlsZSBvciB0b2dnbGUgYmVoYXZpb3IsIGFuYWx5dGljcyB0cmFja2luZyBvZiBzcGVjaWZpYyBtZW51cy5cbiAqL1xuXG5mdW5jdGlvbiBzZXR1cFByaW1hcnlOYXYoKSB7XG5cdGNvbnN0IG5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KHtcblx0ICBlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWxpbmtzJyApLFxuXHQgIHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHQgIGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0pO1xuXG5cdHZhciBuYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IGJ1dHRvbicgKTtcblx0bmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0bGV0IGV4cGFuZGVkID0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZScgfHwgZmFsc2U7XG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRuYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRuYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHR9XG5cdH0pO1xuXG5cdHZhciB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IC5tLWZvcm0tc2VhcmNoIGZpZWxkc2V0JyApO1xuXHR2YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyk7XG5cdHNwYW4uaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLXNlYXJjaFwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuXG5cdHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0ZGl2LmFwcGVuZENoaWxkKHNwYW4pO1xuXG5cdHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcblxuXHR0YXJnZXQuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuXG5cdGNvbnN0IHNlYXJjaFRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KHtcblx0ICBlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWFjdGlvbnMgLm0tZm9ybS1zZWFyY2gnICksXG5cdCAgdmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdCAgZGlzcGxheVZhbHVlOiAnZmxleCdcblx0fSk7XG5cblx0dmFyIHNlYXJjaFZpc2libGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbGkuc2VhcmNoID4gYScgKTtcblx0c2VhcmNoVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGxldCBleHBhbmRlZCA9IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnIHx8IGZhbHNlO1xuXHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdH1cblx0fSk7XG5cblx0dmFyIHNlYXJjaENsb3NlICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1zZWFyY2gnICk7XG5cdHNlYXJjaENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0bGV0IGV4cGFuZGVkID0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZScgfHwgZmFsc2U7XG5cdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBlc2NhcGUga2V5IHByZXNzXG5cdCQoZG9jdW1lbnQpLmtleXVwKGZ1bmN0aW9uKGUpIHtcblx0XHRpZiAoMjcgPT09IGUua2V5Q29kZSApIHtcblx0XHRcdGxldCBleHBhbmRlZCA9IG5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZScgfHwgZmFsc2U7XG5cdFx0XHRsZXQgc2VhcmNoSXNWaXNpYmxlID0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZScgfHwgZmFsc2U7XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIGV4cGFuZGVkICYmIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRuYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdFx0bmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XHRcblx0XHRcdH1cblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2Ygc2VhcmNoSXNWaXNpYmxlICYmIHRydWUgPT09IHNlYXJjaElzVmlzaWJsZSApIHtcblx0XHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBzZWFyY2hJc1Zpc2libGUgKTtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn1cblxuc2V0dXBQcmltYXJ5TmF2KCk7XG5cbiQoICcjbmF2aWdhdGlvbi1mZWF0dXJlZCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnRmVhdHVyZWQgQmFyIExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcbn0pO1xuXG4kKCAnYS5nbGVhbi1zaWRlYmFyJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBTdXBwb3J0IExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcbn0pO1xuXG4kKCAnYScsICQoICcuby1zaXRlLXNpZGViYXInICkgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdHZhciB3aWRnZXRfdGl0bGUgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXdpZGdldCcgKS5maW5kKCAnaDMnICkudGV4dCgpO1xuXHR2YXIgem9uZV90aXRsZSAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS16b25lJyApLmZpbmQoICcuYS16b25lLXRpdGxlJyApLnRleHQoKTtcblx0dmFyIHNpZGViYXJfc2VjdGlvbl90aXRsZSA9ICcnO1xuXHRpZiAoICcnICE9PSB3aWRnZXRfdGl0bGUgKSB7XG5cdFx0c2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gd2lkZ2V0X3RpdGxlO1xuXHR9IGVsc2UgaWYgKCAnJyAhPT0gem9uZV90aXRsZSApIHtcblx0XHRzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSB6b25lX3RpdGxlO1xuXHR9XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJfc2VjdGlvbl90aXRsZSApO1xufSk7XG4iLCJcbmpRdWVyeS5mbi50ZXh0Tm9kZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY29udGVudHMoKS5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoIHRoaXMubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmICcnICE9PSB0aGlzLm5vZGVWYWx1ZS50cmltKCkgKTtcblx0fSk7XG59O1xuXG5mdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0cmV0dXJuIG1hcmt1cDtcbn1cblxuZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCggJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nICk7XG5cdHZhciByZXN0X3Jvb3QgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0dmFyIGZ1bGxfdXJsICAgICAgICAgICA9IHJlc3Rfcm9vdCArICcvJyArICd1cGRhdGUtdXNlci8nO1xuXHR2YXIgY29uZmlybUNoYW5nZSAgICAgID0gJyc7XG5cdHZhciBuZXh0RW1haWxDb3VudCAgICAgPSAxO1xuXHR2YXIgbmV3UHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBvbGRQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIHByaW1hcnlJZCAgICAgICAgICA9ICcnO1xuXHR2YXIgZW1haWxUb1JlbW92ZSAgICAgID0gJyc7XG5cdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0dmFyIG5ld0VtYWlscyAgICAgICAgICA9IFtdO1xuXHR2YXIgYWpheF9mb3JtX2RhdGEgICAgID0gJyc7XG5cdHZhciB0aGF0ICAgICAgICAgICAgICAgPSAnJztcblxuXHQvLyBzdGFydCBvdXQgd2l0aCBubyBwcmltYXJ5L3JlbW92YWxzIGNoZWNrZWRcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0Ly8gaWYgdGhlcmUgaXMgYSBsaXN0IG9mIGVtYWlscyAobm90IGp1c3QgYSBzaW5nbGUgZm9ybSBmaWVsZClcblx0aWYgKCAwIDwgJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHNlbGVjdHMgYSBuZXcgcHJpbWFyeSwgbW92ZSBpdCBpbnRvIHRoYXQgcG9zaXRpb25cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScsIGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdFx0bmV3UHJpbWFyeUVtYWlsID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdHByaW1hcnlJZCAgICAgICA9ICQoIHRoaXMgKS5wcm9wKCAnaWQnICkucmVwbGFjZSggJ3ByaW1hcnlfZW1haWxfJywgJycgKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdwcmltYXJ5LWNoYW5nZScgKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXG5cdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBtYWluIGhpZGRlbiBmb3JtIHZhbHVlXG5cdFx0XHRcdCQoICcjZW1haWwnICkudmFsKCBuZXdQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBzdWJtaXQgZm9ybSB2YWx1ZXMuXG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cblx0XHRcdFx0Ly8gdW5jaGVjayB0aGUgcmFkaW8gYnV0dG9uXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIGZvcm0gdmFsdWVzIHRvIHRoZSBvbGQgcHJpbWFyeSBlbWFpbFxuXHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjcmVtb3ZlX2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgY29uZmlybSBtZXNzYWdlXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjaGFuZ2UnLCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG5cdFx0XHRcdGlmICggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICE9PSBlbWFpbFRvUmVtb3ZlICkge1xuXHRcdFx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscy5wdXNoKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlciBmb3IgcmVtb3ZhbFxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0Ly8gaWYgY29uZmlybWVkLCByZW1vdmUgdGhlIGVtYWlsIGFuZCBzdWJtaXQgdGhlIGZvcm1cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGknICkuZmFkZU91dCggJ25vcm1hbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0Y29uc29sZS5sb2coICd2YWx1ZSBpcyAnICsgY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gaWYgYSB1c2VyIHdhbnRzIHRvIGFkZCBhbiBlbWFpbCwgZ2l2ZSB0aGVtIGEgcHJvcGVybHkgbnVtYmVyZWQgZmllbGRcblx0JCggJy5tLWZvcm0tZW1haWwnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJyApLmJlZm9yZSggJzxkaXYgY2xhc3M9XCJhLWlucHV0LXdpdGgtYnV0dG9uIGEtYnV0dG9uLXNlbnRlbmNlXCI+PGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgaWQ9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgdmFsdWU9XCJcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBuYW1lPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGlkPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGNsYXNzPVwiYS1idXR0b24gYS1idXR0b24tYWRkLXVzZXItZW1haWxcIj5BZGQ8L2J1dHRvbj48L2Rpdj4nICk7XG5cdFx0bmV4dEVtYWlsQ291bnQrKztcblx0fSk7XG5cblx0JCggJ2lucHV0W3R5cGU9c3VibWl0XScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyIGJ1dHRvbiA9ICQoIHRoaXMgKTtcblx0XHR2YXIgYnV0dG9uX2Zvcm0gPSBidXR0b24uY2xvc2VzdCggJ2Zvcm0nICk7XG5cdFx0YnV0dG9uX2Zvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJywgYnV0dG9uLnZhbCgpICk7XG5cdH0pO1xuXG5cdCQoICcubS1lbnRyeS1jb250ZW50JyApLm9uKCAnc3VibWl0JywgJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0dmFyIGZvcm0gPSAkKCB0aGlzICk7XG5cdFx0dmFyIHN1Ym1pdHRpbmdfYnV0dG9uID0gZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nICkgfHwgJyc7XG5cblx0XHQvLyBpZiB0aGVyZSBpcyBubyBzdWJtaXR0aW5nIGJ1dHRvbiwgcGFzcyBpdCBieSBBamF4XG5cdFx0aWYgKCAnJyA9PT0gc3VibWl0dGluZ19idXR0b24gfHwgJ1NhdmUgQ2hhbmdlcycgIT09IHN1Ym1pdHRpbmdfYnV0dG9uICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGFqYXhfZm9ybV9kYXRhID0gZm9ybS5zZXJpYWxpemUoKTsgLy9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBhamF4X2Zvcm1fZGF0YSArICcmcmVzdD10cnVlJztcblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHVybDogZnVsbF91cmwsXG5cdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oIHhociApIHtcblx0XHRcdCAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0ICAgIH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhfZm9ybV9kYXRhXG5cdFx0XHR9KS5kb25lKCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0fSkuZ2V0KCk7XG5cdFx0XHRcdCQuZWFjaCggbmV3RW1haWxzLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICkge1xuXHRcdFx0XHRcdG5leHRFbWFpbENvdW50ID0gbmV4dEVtYWlsQ291bnQgKyBpbmRleDtcblx0XHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmFwcGVuZCggJzxsaSBpZD1cInVzZXItZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPicgKyB2YWx1ZSArICc8dWwgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXVzZXItZW1haWwtYWN0aW9uc1wiPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1tYWtlLXByaW1hcnktZW1haWxcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW1hcnlfZW1haWxcIiBpZD1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+TWFrZSBQcmltYXJ5PC9zbWFsbD48L2xhYmVsPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLWVtYWlsLXByZWZlcmVuY2VzXCI+PGEgaHJlZj1cIi9uZXdzbGV0dGVycy8/ZW1haWw9JyArIGVuY29kZVVSSUNvbXBvbmVudCggdmFsdWUgKSArICdcIj48c21hbGw+RW1haWwgUHJlZmVyZW5jZXM8L3NtYWxsPjwvYT48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggJCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoKSArICcsJyArIHZhbHVlICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggMCA9PT0gJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIGl0IHdvdWxkIGJlIG5pY2UgdG8gb25seSBsb2FkIHRoZSBmb3JtLCBidXQgdGhlbiBjbGljayBldmVudHMgc3RpbGwgZG9uJ3Qgd29ya1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIDAgPCAkKCAnLm0tZm9ybS1lbWFpbCcgKS5sZW5ndGggKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cbn0pO1xuIiwiLy8gYmFzZWQgb24gd2hpY2ggYnV0dG9uIHdhcyBjbGlja2VkLCBzZXQgdGhlIHZhbHVlcyBmb3IgdGhlIGFuYWx5dGljcyBldmVudCBhbmQgY3JlYXRlIGl0XG5mdW5jdGlvbiB0cmFja1Nob3dDb21tZW50cyggYWx3YXlzLCBpZCwgY2xpY2tfdmFsdWUgKSB7XG5cdHZhciBhY3Rpb24gICAgICAgICAgPSAnJztcblx0dmFyIGNhdGVnb3J5X3ByZWZpeCA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlfc3VmZml4ID0gJyc7XG5cdHZhciBwb3NpdGlvbiAgICAgICAgPSAnJztcblx0cG9zaXRpb24gPSBpZC5yZXBsYWNlKCAnYWx3YXlzLXNob3ctY29tbWVudHMtJywgJycgKTtcblx0aWYgKCAnMScgPT09IGNsaWNrX3ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPbic7XG5cdH0gZWxzZSBpZiAoICcwJyA9PT0gY2xpY2tfdmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09mZic7XG5cdH0gZWxzZSB7XG5cdFx0YWN0aW9uID0gJ0NsaWNrJztcblx0fVxuXHRpZiAoIHRydWUgPT09IGFsd2F5cyApIHtcblx0XHRjYXRlZ29yeV9wcmVmaXggPSAnQWx3YXlzICc7XG5cdH1cblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbi5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgcG9zaXRpb24uc2xpY2UoIDEgKTtcblx0XHRjYXRlZ29yeV9zdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgY2F0ZWdvcnlfcHJlZml4ICsgJ1Nob3cgQ29tbWVudHMnICsgY2F0ZWdvcnlfc3VmZml4LCBhY3Rpb24sIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59XG5cbi8vIHdoZW4gc2hvd2luZyBjb21tZW50cyBvbmNlLCB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1idXR0b24tc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR0cmFja1Nob3dDb21tZW50cyggZmFsc2UsICcnLCAnJyApO1xufSk7XG5cbi8vIFNldCB1c2VyIG1ldGEgdmFsdWUgZm9yIGFsd2F5cyBzaG93aW5nIGNvbW1lbnRzIGlmIHRoYXQgYnV0dG9uIGlzIGNsaWNrZWRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR2YXIgdGhhdCA9ICQoIHRoaXMgKTtcblx0aWYgKCB0aGF0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9IGVsc2Uge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvLyB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcblx0dHJhY2tTaG93Q29tbWVudHMoIHRydWUsIHRoYXQuYXR0ciggJ2lkJyApLCB0aGF0LnZhbCgpICk7XG5cblx0Ly8gd2UgYWxyZWFkeSBoYXZlIGFqYXh1cmwgZnJvbSB0aGUgdGhlbWVcblx0JC5hamF4KHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBhamF4dXJsLFxuXHRcdGRhdGE6IHtcbiAgICAgICAgXHQnYWN0aW9uJzogJ21pbm5wb3N0X2xhcmdvX2xvYWRfY29tbWVudHNfc2V0X3VzZXJfbWV0YScsXG4gICAgICAgIFx0J3ZhbHVlJzogdGhhdC52YWwoKVxuXHRcdH0sXG5cdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuICAgICAgICBcdCQoICcuYS1hbHdheXMtc2hvdy1jb21tZW50cy1yZXN1bHQnLCB0aGF0LnBhcmVudCgpICkuaHRtbCggcmVzcG9uc2UuZGF0YS5tZXNzYWdlICk7XG4gICAgICAgIFx0aWYgKCB0cnVlID09PSByZXNwb25zZS5kYXRhLnNob3cgKSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDAgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDEgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG4iXX0=
}(jQuery));
