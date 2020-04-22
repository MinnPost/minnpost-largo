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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

/**
  Priority+ horizontal scrolling menu.

  @param {Object} object - Container for all options.
    @param {string || DOM node} selector - Element selector.
    @param {string} navSelector - Nav element selector.
    @param {string} contentSelector - Content element selector.
    @param {string} itemSelector - Items selector.
    @param {string} buttonLeftSelector - Left button selector.
    @param {string} buttonRightSelector - Right button selector.
    @param {integer || string} scrollStep - Amount to scroll on button click. 'average' gets the average link width.
*/
var PriorityNavScroller = function PriorityNavScroller() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$selector = _ref.selector,
      selector = _ref$selector === void 0 ? '.nav-scroller' : _ref$selector,
      _ref$navSelector = _ref.navSelector,
      navSelector = _ref$navSelector === void 0 ? '.nav-scroller-nav' : _ref$navSelector,
      _ref$contentSelector = _ref.contentSelector,
      contentSelector = _ref$contentSelector === void 0 ? '.nav-scroller-content' : _ref$contentSelector,
      _ref$itemSelector = _ref.itemSelector,
      itemSelector = _ref$itemSelector === void 0 ? '.nav-scroller-item' : _ref$itemSelector,
      _ref$buttonLeftSelect = _ref.buttonLeftSelector,
      buttonLeftSelector = _ref$buttonLeftSelect === void 0 ? '.nav-scroller-btn--left' : _ref$buttonLeftSelect,
      _ref$buttonRightSelec = _ref.buttonRightSelector,
      buttonRightSelector = _ref$buttonRightSelec === void 0 ? '.nav-scroller-btn--right' : _ref$buttonRightSelec,
      _ref$scrollStep = _ref.scrollStep,
      scrollStep = _ref$scrollStep === void 0 ? 80 : _ref$scrollStep;

  var navScroller = typeof selector === 'string' ? document.querySelector(selector) : selector;

  var validateScrollStep = function validateScrollStep() {
    return Number.isInteger(scrollStep) || scrollStep === 'average';
  };

  if (navScroller === undefined || navScroller === null || !validateScrollStep()) {
    throw new Error('There is something wrong, check your options.');
  }

  var navScrollerNav = navScroller.querySelector(navSelector);
  var navScrollerContent = navScroller.querySelector(contentSelector);
  var navScrollerContentItems = navScrollerContent.querySelectorAll(itemSelector);
  var navScrollerLeft = navScroller.querySelector(buttonLeftSelector);
  var navScrollerRight = navScroller.querySelector(buttonRightSelector);
  var scrolling = false;
  var scrollAvailableLeft = 0;
  var scrollAvailableRight = 0;
  var scrollingDirection = '';
  var scrollOverflow = '';
  var timeout; // Sets overflow and toggle buttons accordingly

  var setOverflow = function setOverflow() {
    scrollOverflow = getOverflow();
    toggleButtons(scrollOverflow);
    calculateScrollStep();
  }; // Debounce setting the overflow with requestAnimationFrame


  var requestSetOverflow = function requestSetOverflow() {
    if (timeout) window.cancelAnimationFrame(timeout);
    timeout = window.requestAnimationFrame(function () {
      setOverflow();
    });
  }; // Gets the overflow available on the nav scroller


  var getOverflow = function getOverflow() {
    var scrollWidth = navScrollerNav.scrollWidth;
    var scrollViewport = navScrollerNav.clientWidth;
    var scrollLeft = navScrollerNav.scrollLeft;
    scrollAvailableLeft = scrollLeft;
    scrollAvailableRight = scrollWidth - (scrollViewport + scrollLeft); // 1 instead of 0 to compensate for number rounding

    var scrollLeftCondition = scrollAvailableLeft > 1;
    var scrollRightCondition = scrollAvailableRight > 1; // console.log(scrollWidth, scrollViewport, scrollAvailableLeft, scrollAvailableRight);

    if (scrollLeftCondition && scrollRightCondition) {
      return 'both';
    } else if (scrollLeftCondition) {
      return 'left';
    } else if (scrollRightCondition) {
      return 'right';
    } else {
      return 'none';
    }
  }; // Calculates the scroll step based on the width of the scroller and the number of links


  var calculateScrollStep = function calculateScrollStep() {
    if (scrollStep === 'average') {
      var scrollViewportNoPadding = navScrollerNav.scrollWidth - (parseInt(getComputedStyle(navScrollerContent).getPropertyValue('padding-left')) + parseInt(getComputedStyle(navScrollerContent).getPropertyValue('padding-right')));
      var scrollStepAverage = Math.floor(scrollViewportNoPadding / navScrollerContentItems.length);
      scrollStep = scrollStepAverage;
    }
  }; // Move the scroller with a transform


  var moveScroller = function moveScroller(direction) {
    if (scrolling === true || scrollOverflow !== direction && scrollOverflow !== 'both') return;
    var scrollDistance = scrollStep;
    var scrollAvailable = direction === 'left' ? scrollAvailableLeft : scrollAvailableRight; // If there will be less than 25% of the last step visible then scroll to the end

    if (scrollAvailable < scrollStep * 1.75) {
      scrollDistance = scrollAvailable;
    }

    if (direction === 'right') {
      scrollDistance *= -1;

      if (scrollAvailable < scrollStep) {
        navScrollerContent.classList.add('snap-align-end');
      }
    }

    navScrollerContent.classList.remove('no-transition');
    navScrollerContent.style.transform = 'translateX(' + scrollDistance + 'px)';
    scrollingDirection = direction;
    scrolling = true;
  }; // Set the scroller position and removes transform, called after moveScroller() in the transitionend event


  var setScrollerPosition = function setScrollerPosition() {
    var style = window.getComputedStyle(navScrollerContent, null);
    var transform = style.getPropertyValue('transform');
    var transformValue = Math.abs(parseInt(transform.split(',')[4]) || 0);

    if (scrollingDirection === 'left') {
      transformValue *= -1;
    }

    navScrollerContent.classList.add('no-transition');
    navScrollerContent.style.transform = '';
    navScrollerNav.scrollLeft = navScrollerNav.scrollLeft + transformValue;
    navScrollerContent.classList.remove('no-transition', 'snap-align-end');
    scrolling = false;
  }; // Toggle buttons depending on overflow


  var toggleButtons = function toggleButtons(overflow) {
    if (overflow === 'both' || overflow === 'left') {
      navScrollerLeft.classList.add('active');
    } else {
      navScrollerLeft.classList.remove('active');
    }

    if (overflow === 'both' || overflow === 'right') {
      navScrollerRight.classList.add('active');
    } else {
      navScrollerRight.classList.remove('active');
    }
  };

  var init = function init() {
    setOverflow();
    window.addEventListener('resize', function () {
      requestSetOverflow();
    });
    navScrollerNav.addEventListener('scroll', function () {
      requestSetOverflow();
    });
    navScrollerContent.addEventListener('transitionend', function () {
      setScrollerPosition();
    });
    navScrollerLeft.addEventListener('click', function () {
      moveScroller('left');
    });
    navScrollerRight.addEventListener('click', function () {
      moveScroller('right');
    });
  }; // Self init


  init(); // Reveal API

  return {
    init: init
  };
}; //export default PriorityNavScroller;
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

function setupTopicsNav() {
  // Init with all options at default setting
  var priorityNavScrollerDefault = PriorityNavScroller({
    selector: '.m-topics',
    navSelector: '.m-topics-navigation',
    contentSelector: '.m-menu-topics',
    itemSelector: 'li, a',
    buttonLeftSelector: '.nav-scroller-btn--left',
    buttonRightSelector: '.nav-scroller-btn--right' //scrollStep: 'average'

  }); // Init multiple nav scrollers with the same options

  /*let navScrollers = document.querySelectorAll('.nav-scroller');
  	navScrollers.forEach((currentValue, currentIndex) => {
    PriorityNavScroller({
      selector: currentValue
    });
  });*/
}

setupPrimaryNav();
setupTopicsNav();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDAtc3RhcnQuanMiLCIwMS1mb250cy5qcyIsIjAyLWFuYWx5dGljcy5qcyIsIjAzLXNoYXJlLmpzIiwiMDQtbmF2aWdhdGlvbi5qcyIsIjA1LWZvcm1zLmpzIiwiMDYtY29tbWVudHMuanMiXSwibmFtZXMiOlsidGxpdGUiLCJ0IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImkiLCJ0YXJnZXQiLCJuIiwicGFyZW50RWxlbWVudCIsInNob3ciLCJ0b29sdGlwIiwibyIsImhpZGUiLCJsIiwiciIsImNsYXNzTmFtZSIsInMiLCJvZmZzZXRUb3AiLCJvZmZzZXRMZWZ0Iiwib2Zmc2V0UGFyZW50Iiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJkIiwiZiIsImEiLCJzdHlsZSIsInRvcCIsImxlZnQiLCJjcmVhdGVFbGVtZW50IiwiZ3JhdiIsImdldEF0dHJpYnV0ZSIsImlubmVySFRNTCIsImFwcGVuZENoaWxkIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiYm90dG9tIiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJyaWdodCIsImlubmVyV2lkdGgiLCJ0aXRsZSIsInNldEF0dHJpYnV0ZSIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJtb2R1bGUiLCJleHBvcnRzIiwidHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQiLCJlbGVtZW50IiwidmlzaWJsZUNsYXNzIiwid2FpdE1vZGUiLCJ0aW1lb3V0RHVyYXRpb24iLCJoaWRlTW9kZSIsImRpc3BsYXlWYWx1ZSIsImNvbnNvbGUiLCJlcnJvciIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwibGlzdGVuZXIiLCJhcHBseUhpZGRlbkF0dHJpYnV0ZXMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzcGxheSIsInJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMiLCJyZW1vdmVBdHRyaWJ1dGUiLCJ0cmFuc2l0aW9uU2hvdyIsInRpbWVvdXQiLCJyZWZsb3ciLCJjbGFzc0xpc3QiLCJhZGQiLCJ0cmFuc2l0aW9uSGlkZSIsInJlbW92ZSIsInRvZ2dsZSIsImlzSGlkZGVuIiwiaGFzSGlkZGVuQXR0cmlidXRlIiwiaXNEaXNwbGF5Tm9uZSIsImhhc1Zpc2libGVDbGFzcyIsImluY2x1ZGVzIiwiUHJpb3JpdHlOYXZTY3JvbGxlciIsInNlbGVjdG9yIiwibmF2U2VsZWN0b3IiLCJjb250ZW50U2VsZWN0b3IiLCJpdGVtU2VsZWN0b3IiLCJidXR0b25MZWZ0U2VsZWN0b3IiLCJidXR0b25SaWdodFNlbGVjdG9yIiwic2Nyb2xsU3RlcCIsIm5hdlNjcm9sbGVyIiwicXVlcnlTZWxlY3RvciIsInZhbGlkYXRlU2Nyb2xsU3RlcCIsIk51bWJlciIsImlzSW50ZWdlciIsInVuZGVmaW5lZCIsIkVycm9yIiwibmF2U2Nyb2xsZXJOYXYiLCJuYXZTY3JvbGxlckNvbnRlbnQiLCJuYXZTY3JvbGxlckNvbnRlbnRJdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJuYXZTY3JvbGxlckxlZnQiLCJuYXZTY3JvbGxlclJpZ2h0Iiwic2Nyb2xsaW5nIiwic2Nyb2xsQXZhaWxhYmxlTGVmdCIsInNjcm9sbEF2YWlsYWJsZVJpZ2h0Iiwic2Nyb2xsaW5nRGlyZWN0aW9uIiwic2Nyb2xsT3ZlcmZsb3ciLCJzZXRPdmVyZmxvdyIsImdldE92ZXJmbG93IiwidG9nZ2xlQnV0dG9ucyIsImNhbGN1bGF0ZVNjcm9sbFN0ZXAiLCJyZXF1ZXN0U2V0T3ZlcmZsb3ciLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInNjcm9sbFdpZHRoIiwic2Nyb2xsVmlld3BvcnQiLCJjbGllbnRXaWR0aCIsInNjcm9sbExlZnQiLCJzY3JvbGxMZWZ0Q29uZGl0aW9uIiwic2Nyb2xsUmlnaHRDb25kaXRpb24iLCJzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyIsInBhcnNlSW50IiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImdldFByb3BlcnR5VmFsdWUiLCJzY3JvbGxTdGVwQXZlcmFnZSIsIk1hdGgiLCJmbG9vciIsImxlbmd0aCIsIm1vdmVTY3JvbGxlciIsImRpcmVjdGlvbiIsInNjcm9sbERpc3RhbmNlIiwic2Nyb2xsQXZhaWxhYmxlIiwidHJhbnNmb3JtIiwic2V0U2Nyb2xsZXJQb3NpdGlvbiIsInRyYW5zZm9ybVZhbHVlIiwiYWJzIiwic3BsaXQiLCJvdmVyZmxvdyIsImluaXQiLCIkIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsInNlc3Npb25TdG9yYWdlIiwic2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsInNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsImRvY3VtZW50RWxlbWVudCIsImciLCJwdXNoIiwibSIsInNoaWZ0IiwicCIsImIiLCJxIiwiYyIsInUiLCJUeXBlRXJyb3IiLCJ0aGVuIiwiY2FsbCIsInYiLCJoIiwicHJvdG90eXBlIiwidyIsImsiLCJ4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyYWNlIiwiYWxsIiwiYXR0YWNoRXZlbnQiLCJib2R5IiwicmVhZHlTdGF0ZSIsImRldGFjaEV2ZW50IiwiY3JlYXRlVGV4dE5vZGUiLCJjc3NUZXh0IiwieiIsIndpZHRoIiwiQSIsIkIiLCJmYW1pbHkiLCJ3ZWlnaHQiLCJzdHJldGNoIiwiQyIsIkQiLCJFIiwiRiIsIkciLCJKIiwidGVzdCIsIm5hdmlnYXRvciIsInZlbmRvciIsImV4ZWMiLCJ1c2VyQWdlbnQiLCJmb250cyIsIksiLCJmb250IiwiTCIsImpvaW4iLCJsb2FkIiwiSCIsIkRhdGUiLCJnZXRUaW1lIiwiTSIsIk4iLCJ5IiwiSSIsImhpZGRlbiIsImRpciIsIkZvbnRGYWNlT2JzZXJ2ZXIiLCJzYW5zTm9ybWFsIiwic2Fuc0JvbGQiLCJzYW5zTm9ybWFsSXRhbGljIiwic2VyaWZCb29rIiwic2VyaWZCb29rSXRhbGljIiwic2VyaWZCb2xkIiwic2VyaWZCb2xkSXRhbGljIiwic2VyaWZCbGFjayIsInNlcmlmQmxhY2tJdGFsaWMiLCJtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsInZhbHVlIiwiZ2EiLCJyZWFkeSIsIlBVTSIsImN1cnJlbnRfcG9wdXAiLCJnZXRQb3B1cCIsInNldHRpbmdzIiwiZ2V0U2V0dGluZ3MiLCJwb3B1cF9pZCIsImlkIiwib24iLCJjbG9zZV90cmlnZ2VyIiwiZm4iLCJwb3BtYWtlIiwibGFzdF9jbG9zZV90cmlnZ2VyIiwiY2xpY2siLCJ1cmwiLCJhdHRyIiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsImpRdWVyeSIsImhhc0NsYXNzIiwiY29weUN1cnJlbnRVUkwiLCJkdW1teSIsImhyZWYiLCJzZWxlY3QiLCJleGVjQ29tbWFuZCIsImRhdGEiLCJwcmV2ZW50RGVmYXVsdCIsInByaW50Iiwib3BlbiIsInNldHVwUHJpbWFyeU5hdiIsInByaW1hcnlOYXZUcmFuc2l0aW9uZXIiLCJwcmltYXJ5TmF2VG9nZ2xlIiwiZXhwYW5kZWQiLCJ1c2VyTmF2VHJhbnNpdGlvbmVyIiwidXNlck5hdlRvZ2dsZSIsInNwYW4iLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCJrZXl1cCIsImtleUNvZGUiLCJwcmltYXJ5TmF2RXhwYW5kZWQiLCJ1c2VyTmF2RXhwYW5kZWQiLCJzZWFyY2hJc1Zpc2libGUiLCJzZXR1cFRvcGljc05hdiIsInByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0Iiwid2lkZ2V0X3RpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJ6b25lX3RpdGxlIiwic2lkZWJhcl9zZWN0aW9uX3RpdGxlIiwidGV4dE5vZGVzIiwiY29udGVudHMiLCJmaWx0ZXIiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJub2RlVmFsdWUiLCJ0cmltIiwiZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCIsIm1hcmt1cCIsIm1hbmFnZUVtYWlscyIsImZvcm0iLCJyZXN0X3Jvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxfdXJsIiwiY29uZmlybUNoYW5nZSIsIm5leHRFbWFpbENvdW50IiwibmV3UHJpbWFyeUVtYWlsIiwib2xkUHJpbWFyeUVtYWlsIiwicHJpbWFyeUlkIiwiZW1haWxUb1JlbW92ZSIsImNvbnNvbGlkYXRlZEVtYWlscyIsIm5ld0VtYWlscyIsImFqYXhfZm9ybV9kYXRhIiwidGhhdCIsInByb3AiLCJldmVudCIsInZhbCIsInJlcGxhY2UiLCJwYXJlbnQiLCJhcHBlbmQiLCJmaXJzdCIsInJlcGxhY2VXaXRoIiwic3VibWl0IiwiZWFjaCIsImluZGV4IiwiZ2V0IiwicGFyZW50cyIsImZhZGVPdXQiLCJsb2ciLCJiZWZvcmUiLCJidXR0b24iLCJidXR0b25fZm9ybSIsInN1Ym1pdHRpbmdfYnV0dG9uIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRvbmUiLCJtYXAiLCJlbmNvZGVVUklDb21wb25lbnQiLCJyZWxvYWQiLCJ0cmFja1Nob3dDb21tZW50cyIsImFsd2F5cyIsImNsaWNrX3ZhbHVlIiwiY2F0ZWdvcnlfcHJlZml4IiwiY2F0ZWdvcnlfc3VmZml4IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImlzIiwiYWpheHVybCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImh0bWwiLCJtZXNzYWdlIl0sIm1hcHBp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LENBQUMsQ0FBRSxnQ0FBRixFQUFvQzZLLElBQUksQ0FBQ0ssTUFBTCxFQUFwQyxDQUFELENBQXFEc0MsSUFBckQsQ0FBMkRELFFBQVEsQ0FBQ2pHLElBQVQsQ0FBY21HLE9BQXpFOztBQUNBLFVBQUssU0FBU0YsUUFBUSxDQUFDakcsSUFBVCxDQUFjcFAsSUFBNUIsRUFBbUM7QUFDeEM4SCxRQUFBQSxDQUFDLENBQUUsa0NBQUYsQ0FBRCxDQUF3Q2dMLEdBQXhDLENBQTZDLENBQTdDO0FBQ0EsT0FGSyxNQUVDO0FBQ05oTCxRQUFBQSxDQUFDLENBQUUsa0NBQUYsQ0FBRCxDQUF3Q2dMLEdBQXhDLENBQTZDLENBQTdDO0FBQ0E7QUFDRDtBQWRLLEdBQVA7QUFnQkEsQ0E1QkQiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB0bGl0ZSh0KXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZSl7dmFyIGk9ZS50YXJnZXQsbj10KGkpO258fChuPShpPWkucGFyZW50RWxlbWVudCkmJnQoaSkpLG4mJnRsaXRlLnNob3coaSxuLCEwKX0pfXRsaXRlLnNob3c9ZnVuY3Rpb24odCxlLGkpe3ZhciBuPVwiZGF0YS10bGl0ZVwiO2U9ZXx8e30sKHQudG9vbHRpcHx8ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiBvKCl7dGxpdGUuaGlkZSh0LCEwKX1mdW5jdGlvbiBsKCl7cnx8KHI9ZnVuY3Rpb24odCxlLGkpe2Z1bmN0aW9uIG4oKXtvLmNsYXNzTmFtZT1cInRsaXRlIHRsaXRlLVwiK3Irczt2YXIgZT10Lm9mZnNldFRvcCxpPXQub2Zmc2V0TGVmdDtvLm9mZnNldFBhcmVudD09PXQmJihlPWk9MCk7dmFyIG49dC5vZmZzZXRXaWR0aCxsPXQub2Zmc2V0SGVpZ2h0LGQ9by5vZmZzZXRIZWlnaHQsZj1vLm9mZnNldFdpZHRoLGE9aStuLzI7by5zdHlsZS50b3A9KFwic1wiPT09cj9lLWQtMTA6XCJuXCI9PT1yP2UrbCsxMDplK2wvMi1kLzIpK1wicHhcIixvLnN0eWxlLmxlZnQ9KFwid1wiPT09cz9pOlwiZVwiPT09cz9pK24tZjpcIndcIj09PXI/aStuKzEwOlwiZVwiPT09cj9pLWYtMTA6YS1mLzIpK1wicHhcIn12YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxsPWkuZ3Jhdnx8dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRsaXRlXCIpfHxcIm5cIjtvLmlubmVySFRNTD1lLHQuYXBwZW5kQ2hpbGQobyk7dmFyIHI9bFswXXx8XCJcIixzPWxbMV18fFwiXCI7bigpO3ZhciBkPW8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuXCJzXCI9PT1yJiZkLnRvcDwwPyhyPVwiblwiLG4oKSk6XCJuXCI9PT1yJiZkLmJvdHRvbT53aW5kb3cuaW5uZXJIZWlnaHQ/KHI9XCJzXCIsbigpKTpcImVcIj09PXImJmQubGVmdDwwPyhyPVwid1wiLG4oKSk6XCJ3XCI9PT1yJiZkLnJpZ2h0PndpbmRvdy5pbm5lcldpZHRoJiYocj1cImVcIixuKCkpLG8uY2xhc3NOYW1lKz1cIiB0bGl0ZS12aXNpYmxlXCIsb30odCxkLGUpKX12YXIgcixzLGQ7cmV0dXJuIHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLG8pLHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIixvKSx0LnRvb2x0aXA9e3Nob3c6ZnVuY3Rpb24oKXtkPXQudGl0bGV8fHQuZ2V0QXR0cmlidXRlKG4pfHxkLHQudGl0bGU9XCJcIix0LnNldEF0dHJpYnV0ZShuLFwiXCIpLGQmJiFzJiYocz1zZXRUaW1lb3V0KGwsaT8xNTA6MSkpfSxoaWRlOmZ1bmN0aW9uKHQpe2lmKGk9PT10KXtzPWNsZWFyVGltZW91dChzKTt2YXIgZT1yJiZyLnBhcmVudE5vZGU7ZSYmZS5yZW1vdmVDaGlsZChyKSxyPXZvaWQgMH19fX0odCxlKSkuc2hvdygpfSx0bGl0ZS5oaWRlPWZ1bmN0aW9uKHQsZSl7dC50b29sdGlwJiZ0LnRvb2x0aXAuaGlkZShlKX0sXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz10bGl0ZSk7IiwiLyoqIFxuICogTGlicmFyeSBjb2RlXG4gKiBVc2luZyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9AY2xvdWRmb3VyL3RyYW5zaXRpb24taGlkZGVuLWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCh7XG4gIGVsZW1lbnQsXG4gIHZpc2libGVDbGFzcyxcbiAgd2FpdE1vZGUgPSAndHJhbnNpdGlvbmVuZCcsXG4gIHRpbWVvdXREdXJhdGlvbixcbiAgaGlkZU1vZGUgPSAnaGlkZGVuJyxcbiAgZGlzcGxheVZhbHVlID0gJ2Jsb2NrJ1xufSkge1xuICBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0JyAmJiB0eXBlb2YgdGltZW91dER1cmF0aW9uICE9PSAnbnVtYmVyJykge1xuICAgIGNvbnNvbGUuZXJyb3IoYFxuICAgICAgV2hlbiBjYWxsaW5nIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50IHdpdGggd2FpdE1vZGUgc2V0IHRvIHRpbWVvdXQsXG4gICAgICB5b3UgbXVzdCBwYXNzIGluIGEgbnVtYmVyIGZvciB0aW1lb3V0RHVyYXRpb24uXG4gICAgYCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEb24ndCB3YWl0IGZvciBleGl0IHRyYW5zaXRpb25zIGlmIGEgdXNlciBwcmVmZXJzIHJlZHVjZWQgbW90aW9uLlxuICAvLyBJZGVhbGx5IHRyYW5zaXRpb25zIHdpbGwgYmUgZGlzYWJsZWQgaW4gQ1NTLCB3aGljaCBtZWFucyB3ZSBzaG91bGQgbm90IHdhaXRcbiAgLy8gYmVmb3JlIGFkZGluZyBgaGlkZGVuYC5cbiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKScpLm1hdGNoZXMpIHtcbiAgICB3YWl0TW9kZSA9ICdpbW1lZGlhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGxpc3RlbmVyIHRvIGFkZCBgaGlkZGVuYCBhZnRlciBvdXIgYW5pbWF0aW9ucyBjb21wbGV0ZS5cbiAgICogVGhpcyBsaXN0ZW5lciB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgY29tcGxldGluZy5cbiAgICovXG4gIGNvbnN0IGxpc3RlbmVyID0gZSA9PiB7XG4gICAgLy8gQ29uZmlybSBgdHJhbnNpdGlvbmVuZGAgd2FzIGNhbGxlZCBvbiAgb3VyIGBlbGVtZW50YCBhbmQgZGlkbid0IGJ1YmJsZVxuICAgIC8vIHVwIGZyb20gYSBjaGlsZCBlbGVtZW50LlxuICAgIGlmIChlLnRhcmdldCA9PT0gZWxlbWVudCkge1xuICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheVZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvblNob3coKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgbGlzdGVuZXIgc2hvdWxkbid0IGJlIGhlcmUgYnV0IGlmIHNvbWVvbmUgc3BhbXMgdGhlIHRvZ2dsZVxuICAgICAgICogb3ZlciBhbmQgb3ZlciByZWFsbHkgZmFzdCBpdCBjYW4gaW5jb3JyZWN0bHkgc3RpY2sgYXJvdW5kLlxuICAgICAgICogV2UgcmVtb3ZlIGl0IGp1c3QgdG8gYmUgc2FmZS5cbiAgICAgICAqL1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFNpbWlsYXJseSwgd2UnbGwgY2xlYXIgdGhlIHRpbWVvdXQgaW4gY2FzZSBpdCdzIHN0aWxsIGhhbmdpbmcgYXJvdW5kLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIC8qKlxuICAgICAgICogRm9yY2UgYSBicm93c2VyIHJlLXBhaW50IHNvIHRoZSBicm93c2VyIHdpbGwgcmVhbGl6ZSB0aGVcbiAgICAgICAqIGVsZW1lbnQgaXMgbm8gbG9uZ2VyIGBoaWRkZW5gIGFuZCBhbGxvdyB0cmFuc2l0aW9ucy5cbiAgICAgICAqL1xuICAgICAgY29uc3QgcmVmbG93ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIaWRlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvbkhpZGUoKSB7XG4gICAgICBpZiAod2FpdE1vZGUgPT09ICd0cmFuc2l0aW9uZW5kJykge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgICB9IGVsc2UgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICAgIH0sIHRpbWVvdXREdXJhdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoaXMgY2xhc3MgdG8gdHJpZ2dlciBvdXIgYW5pbWF0aW9uXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSBlbGVtZW50J3MgdmlzaWJpbGl0eVxuICAgICAqL1xuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUZWxsIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaGlkZGVuIG9yIG5vdC5cbiAgICAgKi9cbiAgICBpc0hpZGRlbigpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGhpZGRlbiBhdHRyaWJ1dGUgZG9lcyBub3QgcmVxdWlyZSBhIHZhbHVlLiBTaW5jZSBhbiBlbXB0eSBzdHJpbmcgaXNcbiAgICAgICAqIGZhbHN5LCBidXQgc2hvd3MgdGhlIHByZXNlbmNlIG9mIGFuIGF0dHJpYnV0ZSB3ZSBjb21wYXJlIHRvIGBudWxsYFxuICAgICAgICovXG4gICAgICBjb25zdCBoYXNIaWRkZW5BdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaGlkZGVuJykgIT09IG51bGw7XG5cbiAgICAgIGNvbnN0IGlzRGlzcGxheU5vbmUgPSBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJztcblxuICAgICAgY29uc3QgaGFzVmlzaWJsZUNsYXNzID0gWy4uLmVsZW1lbnQuY2xhc3NMaXN0XS5pbmNsdWRlcyh2aXNpYmxlQ2xhc3MpO1xuXG4gICAgICByZXR1cm4gaGFzSGlkZGVuQXR0cmlidXRlIHx8IGlzRGlzcGxheU5vbmUgfHwgIWhhc1Zpc2libGVDbGFzcztcbiAgICB9LFxuXG4gICAgLy8gQSBwbGFjZWhvbGRlciBmb3Igb3VyIGB0aW1lb3V0YFxuICAgIHRpbWVvdXQ6IG51bGxcbiAgfTtcbn0iLCIvKipcbiAgUHJpb3JpdHkrIGhvcml6b250YWwgc2Nyb2xsaW5nIG1lbnUuXG5cbiAgQHBhcmFtIHtPYmplY3R9IG9iamVjdCAtIENvbnRhaW5lciBmb3IgYWxsIG9wdGlvbnMuXG4gICAgQHBhcmFtIHtzdHJpbmcgfHwgRE9NIG5vZGV9IHNlbGVjdG9yIC0gRWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gbmF2U2VsZWN0b3IgLSBOYXYgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gY29udGVudFNlbGVjdG9yIC0gQ29udGVudCBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBpdGVtU2VsZWN0b3IgLSBJdGVtcyBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uTGVmdFNlbGVjdG9yIC0gTGVmdCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvblJpZ2h0U2VsZWN0b3IgLSBSaWdodCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtpbnRlZ2VyIHx8IHN0cmluZ30gc2Nyb2xsU3RlcCAtIEFtb3VudCB0byBzY3JvbGwgb24gYnV0dG9uIGNsaWNrLiAnYXZlcmFnZScgZ2V0cyB0aGUgYXZlcmFnZSBsaW5rIHdpZHRoLlxuKi9cblxuY29uc3QgUHJpb3JpdHlOYXZTY3JvbGxlciA9IGZ1bmN0aW9uKHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlcicsXG4gICAgbmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItbmF2JyxcbiAgICBjb250ZW50U2VsZWN0b3I6IGNvbnRlbnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWNvbnRlbnQnLFxuICAgIGl0ZW1TZWxlY3RvcjogaXRlbVNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItaXRlbScsXG4gICAgYnV0dG9uTGVmdFNlbGVjdG9yOiBidXR0b25MZWZ0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuICAgIGJ1dHRvblJpZ2h0U2VsZWN0b3I6IGJ1dHRvblJpZ2h0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0JyxcbiAgICBzY3JvbGxTdGVwOiBzY3JvbGxTdGVwID0gODBcbiAgfSA9IHt9KSB7XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXIgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiBzZWxlY3RvcjtcblxuICBjb25zdCB2YWxpZGF0ZVNjcm9sbFN0ZXAgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIoc2Nyb2xsU3RlcCkgfHwgc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnO1xuICB9XG5cbiAgaWYgKG5hdlNjcm9sbGVyID09PSB1bmRlZmluZWQgfHwgbmF2U2Nyb2xsZXIgPT09IG51bGwgfHwgIXZhbGlkYXRlU2Nyb2xsU3RlcCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGVyZSBpcyBzb21ldGhpbmcgd3JvbmcsIGNoZWNrIHlvdXIgb3B0aW9ucy4nKTtcbiAgfVxuXG4gIGNvbnN0IG5hdlNjcm9sbGVyTmF2ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihuYXZTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoY29udGVudFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMgPSBuYXZTY3JvbGxlckNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChpdGVtU2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckxlZnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvbkxlZnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyUmlnaHQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvblJpZ2h0U2VsZWN0b3IpO1xuXG4gIGxldCBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZUxlZnQgPSAwO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSAwO1xuICBsZXQgc2Nyb2xsaW5nRGlyZWN0aW9uID0gJyc7XG4gIGxldCBzY3JvbGxPdmVyZmxvdyA9ICcnO1xuICBsZXQgdGltZW91dDtcblxuXG4gIC8vIFNldHMgb3ZlcmZsb3cgYW5kIHRvZ2dsZSBidXR0b25zIGFjY29yZGluZ2x5XG4gIGNvbnN0IHNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgc2Nyb2xsT3ZlcmZsb3cgPSBnZXRPdmVyZmxvdygpO1xuICAgIHRvZ2dsZUJ1dHRvbnMoc2Nyb2xsT3ZlcmZsb3cpO1xuICAgIGNhbGN1bGF0ZVNjcm9sbFN0ZXAoKTtcbiAgfVxuXG5cbiAgLy8gRGVib3VuY2Ugc2V0dGluZyB0aGUgb3ZlcmZsb3cgd2l0aCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgY29uc3QgcmVxdWVzdFNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVvdXQpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aW1lb3V0KTtcblxuICAgIHRpbWVvdXQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHNldE92ZXJmbG93KCk7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8vIEdldHMgdGhlIG92ZXJmbG93IGF2YWlsYWJsZSBvbiB0aGUgbmF2IHNjcm9sbGVyXG4gIGNvbnN0IGdldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNjcm9sbFdpZHRoID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGg7XG4gICAgbGV0IHNjcm9sbFZpZXdwb3J0ID0gbmF2U2Nyb2xsZXJOYXYuY2xpZW50V2lkdGg7XG4gICAgbGV0IHNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0O1xuXG4gICAgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSBzY3JvbGxXaWR0aCAtIChzY3JvbGxWaWV3cG9ydCArIHNjcm9sbExlZnQpO1xuXG4gICAgLy8gMSBpbnN0ZWFkIG9mIDAgdG8gY29tcGVuc2F0ZSBmb3IgbnVtYmVyIHJvdW5kaW5nXG4gICAgbGV0IHNjcm9sbExlZnRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVMZWZ0ID4gMTtcbiAgICBsZXQgc2Nyb2xsUmlnaHRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVSaWdodCA+IDE7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhzY3JvbGxXaWR0aCwgc2Nyb2xsVmlld3BvcnQsIHNjcm9sbEF2YWlsYWJsZUxlZnQsIHNjcm9sbEF2YWlsYWJsZVJpZ2h0KTtcblxuICAgIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uICYmIHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2JvdGgnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2xlZnQnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuICdub25lJztcbiAgICB9XG5cbiAgfVxuXG5cbiAgLy8gQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHN0ZXAgYmFzZWQgb24gdGhlIHdpZHRoIG9mIHRoZSBzY3JvbGxlciBhbmQgdGhlIG51bWJlciBvZiBsaW5rc1xuICBjb25zdCBjYWxjdWxhdGVTY3JvbGxTdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJykge1xuICAgICAgbGV0IHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGggLSAocGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctbGVmdCcpKSArIHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpKTtcblxuICAgICAgbGV0IHNjcm9sbFN0ZXBBdmVyYWdlID0gTWF0aC5mbG9vcihzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyAvIG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zLmxlbmd0aCk7XG5cbiAgICAgIHNjcm9sbFN0ZXAgPSBzY3JvbGxTdGVwQXZlcmFnZTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIE1vdmUgdGhlIHNjcm9sbGVyIHdpdGggYSB0cmFuc2Zvcm1cbiAgY29uc3QgbW92ZVNjcm9sbGVyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG5cbiAgICBpZiAoc2Nyb2xsaW5nID09PSB0cnVlIHx8IChzY3JvbGxPdmVyZmxvdyAhPT0gZGlyZWN0aW9uICYmIHNjcm9sbE92ZXJmbG93ICE9PSAnYm90aCcpKSByZXR1cm47XG5cbiAgICBsZXQgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxTdGVwO1xuICAgIGxldCBzY3JvbGxBdmFpbGFibGUgPSBkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IHNjcm9sbEF2YWlsYWJsZUxlZnQgOiBzY3JvbGxBdmFpbGFibGVSaWdodDtcblxuICAgIC8vIElmIHRoZXJlIHdpbGwgYmUgbGVzcyB0aGFuIDI1JSBvZiB0aGUgbGFzdCBzdGVwIHZpc2libGUgdGhlbiBzY3JvbGwgdG8gdGhlIGVuZFxuICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCAoc2Nyb2xsU3RlcCAqIDEuNzUpKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbEF2YWlsYWJsZTtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSAqPSAtMTtcblxuICAgICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IHNjcm9sbFN0ZXApIHtcbiAgICAgICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NuYXAtYWxpZ24tZW5kJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIHNjcm9sbERpc3RhbmNlICsgJ3B4KSc7XG5cbiAgICBzY3JvbGxpbmdEaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgc2Nyb2xsaW5nID0gdHJ1ZTtcbiAgfVxuXG5cbiAgLy8gU2V0IHRoZSBzY3JvbGxlciBwb3NpdGlvbiBhbmQgcmVtb3ZlcyB0cmFuc2Zvcm0sIGNhbGxlZCBhZnRlciBtb3ZlU2Nyb2xsZXIoKSBpbiB0aGUgdHJhbnNpdGlvbmVuZCBldmVudFxuICBjb25zdCBzZXRTY3JvbGxlclBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50LCBudWxsKTtcbiAgICB2YXIgdHJhbnNmb3JtID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJyk7XG4gICAgdmFyIHRyYW5zZm9ybVZhbHVlID0gTWF0aC5hYnMocGFyc2VJbnQodHJhbnNmb3JtLnNwbGl0KCcsJylbNF0pIHx8IDApO1xuXG4gICAgaWYgKHNjcm9sbGluZ0RpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICB0cmFuc2Zvcm1WYWx1ZSAqPSAtMTtcbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbiAgICBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCArIHRyYW5zZm9ybVZhbHVlO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJywgJ3NuYXAtYWxpZ24tZW5kJyk7XG5cbiAgICBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgfVxuXG5cbiAgLy8gVG9nZ2xlIGJ1dHRvbnMgZGVwZW5kaW5nIG9uIG92ZXJmbG93XG4gIGNvbnN0IHRvZ2dsZUJ1dHRvbnMgPSBmdW5jdGlvbihvdmVyZmxvdykge1xuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAnbGVmdCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdyaWdodCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH1cblxuXG4gIGNvbnN0IGluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgIHNldE92ZXJmbG93KCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlck5hdi5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgc2V0U2Nyb2xsZXJQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJMZWZ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdsZWZ0Jyk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlclJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdyaWdodCcpO1xuICAgIH0pO1xuXG4gIH07XG5cblxuICAvLyBTZWxmIGluaXRcbiAgaW5pdCgpO1xuXG5cbiAgLy8gUmV2ZWFsIEFQSVxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcblxufTtcblxuLy9leHBvcnQgZGVmYXVsdCBQcmlvcml0eU5hdlNjcm9sbGVyO1xuIiwiJCggJ2h0bWwnICkucmVtb3ZlQ2xhc3MoICduby1qcycgKS5hZGRDbGFzcyggJ2pzJyApOyIsIi8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5pZiAoIHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgJiYgc2Vzc2lvblN0b3JhZ2Uuc2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsICkge1xuXHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkIHNhbnMtZm9udHMtbG9hZGVkJztcbn0gZWxzZSB7XG5cdC8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4xLjAgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oZnVuY3Rpb24oKXsndXNlIHN0cmljdCc7dmFyIGYsZz1bXTtmdW5jdGlvbiBsKGEpe2cucHVzaChhKTsxPT1nLmxlbmd0aCYmZigpfWZ1bmN0aW9uIG0oKXtmb3IoO2cubGVuZ3RoOylnWzBdKCksZy5zaGlmdCgpfWY9ZnVuY3Rpb24oKXtzZXRUaW1lb3V0KG0pfTtmdW5jdGlvbiBuKGEpe3RoaXMuYT1wO3RoaXMuYj12b2lkIDA7dGhpcy5mPVtdO3ZhciBiPXRoaXM7dHJ5e2EoZnVuY3Rpb24oYSl7cShiLGEpfSxmdW5jdGlvbihhKXtyKGIsYSl9KX1jYXRjaChjKXtyKGIsYyl9fXZhciBwPTI7ZnVuY3Rpb24gdChhKXtyZXR1cm4gbmV3IG4oZnVuY3Rpb24oYixjKXtjKGEpfSl9ZnVuY3Rpb24gdShhKXtyZXR1cm4gbmV3IG4oZnVuY3Rpb24oYil7YihhKX0pfWZ1bmN0aW9uIHEoYSxiKXtpZihhLmE9PXApe2lmKGI9PWEpdGhyb3cgbmV3IFR5cGVFcnJvcjt2YXIgYz0hMTt0cnl7dmFyIGQ9YiYmYi50aGVuO2lmKG51bGwhPWImJlwib2JqZWN0XCI9PXR5cGVvZiBiJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBkKXtkLmNhbGwoYixmdW5jdGlvbihiKXtjfHxxKGEsYik7Yz0hMH0sZnVuY3Rpb24oYil7Y3x8cihhLGIpO2M9ITB9KTtyZXR1cm59fWNhdGNoKGUpe2N8fHIoYSxlKTtyZXR1cm59YS5hPTA7YS5iPWI7dihhKX19XG5cdGZ1bmN0aW9uIHIoYSxiKXtpZihhLmE9PXApe2lmKGI9PWEpdGhyb3cgbmV3IFR5cGVFcnJvcjthLmE9MTthLmI9Yjt2KGEpfX1mdW5jdGlvbiB2KGEpe2woZnVuY3Rpb24oKXtpZihhLmEhPXApZm9yKDthLmYubGVuZ3RoOyl7dmFyIGI9YS5mLnNoaWZ0KCksYz1iWzBdLGQ9YlsxXSxlPWJbMl0sYj1iWzNdO3RyeXswPT1hLmE/XCJmdW5jdGlvblwiPT10eXBlb2YgYz9lKGMuY2FsbCh2b2lkIDAsYS5iKSk6ZShhLmIpOjE9PWEuYSYmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGQ/ZShkLmNhbGwodm9pZCAwLGEuYikpOmIoYS5iKSl9Y2F0Y2goaCl7YihoKX19fSl9bi5wcm90b3R5cGUuZz1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5jKHZvaWQgMCxhKX07bi5wcm90b3R5cGUuYz1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXM7cmV0dXJuIG5ldyBuKGZ1bmN0aW9uKGQsZSl7Yy5mLnB1c2goW2EsYixkLGVdKTt2KGMpfSl9O1xuXHRmdW5jdGlvbiB3KGEpe3JldHVybiBuZXcgbihmdW5jdGlvbihiLGMpe2Z1bmN0aW9uIGQoYyl7cmV0dXJuIGZ1bmN0aW9uKGQpe2hbY109ZDtlKz0xO2U9PWEubGVuZ3RoJiZiKGgpfX12YXIgZT0wLGg9W107MD09YS5sZW5ndGgmJmIoaCk7Zm9yKHZhciBrPTA7azxhLmxlbmd0aDtrKz0xKXUoYVtrXSkuYyhkKGspLGMpfSl9ZnVuY3Rpb24geChhKXtyZXR1cm4gbmV3IG4oZnVuY3Rpb24oYixjKXtmb3IodmFyIGQ9MDtkPGEubGVuZ3RoO2QrPTEpdShhW2RdKS5jKGIsYyl9KX07d2luZG93LlByb21pc2V8fCh3aW5kb3cuUHJvbWlzZT1uLHdpbmRvdy5Qcm9taXNlLnJlc29sdmU9dSx3aW5kb3cuUHJvbWlzZS5yZWplY3Q9dCx3aW5kb3cuUHJvbWlzZS5yYWNlPXgsd2luZG93LlByb21pc2UuYWxsPXcsd2luZG93LlByb21pc2UucHJvdG90eXBlLnRoZW49bi5wcm90b3R5cGUuYyx3aW5kb3cuUHJvbWlzZS5wcm90b3R5cGVbXCJjYXRjaFwiXT1uLnByb3RvdHlwZS5nKTt9KCkpO1xuXG5cdChmdW5jdGlvbigpe2Z1bmN0aW9uIGwoYSxiKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2EuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLGIsITEpOmEuYXR0YWNoRXZlbnQoXCJzY3JvbGxcIixiKX1mdW5jdGlvbiBtKGEpe2RvY3VtZW50LmJvZHk/YSgpOmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbiBjKCl7ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixjKTthKCl9KTpkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGZ1bmN0aW9uIGsoKXtpZihcImludGVyYWN0aXZlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGV8fFwiY29tcGxldGVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZSlkb2N1bWVudC5kZXRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGspLGEoKX0pfTtmdW5jdGlvbiB0KGEpe3RoaXMuYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RoaXMuYS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKTt0aGlzLmEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYSkpO3RoaXMuYj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5oPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmc9LTE7dGhpcy5iLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmMuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO1xuXHR0aGlzLmYuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuaC5zdHlsZS5jc3NUZXh0PVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjt0aGlzLmIuYXBwZW5kQ2hpbGQodGhpcy5oKTt0aGlzLmMuYXBwZW5kQ2hpbGQodGhpcy5mKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5iKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5jKX1cblx0ZnVuY3Rpb24gdShhLGIpe2EuYS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6XCIrYitcIjtcIn1mdW5jdGlvbiB6KGEpe3ZhciBiPWEuYS5vZmZzZXRXaWR0aCxjPWIrMTAwO2EuZi5zdHlsZS53aWR0aD1jK1wicHhcIjthLmMuc2Nyb2xsTGVmdD1jO2EuYi5zY3JvbGxMZWZ0PWEuYi5zY3JvbGxXaWR0aCsxMDA7cmV0dXJuIGEuZyE9PWI/KGEuZz1iLCEwKTohMX1mdW5jdGlvbiBBKGEsYil7ZnVuY3Rpb24gYygpe3ZhciBhPWs7eihhKSYmYS5hLnBhcmVudE5vZGUmJmIoYS5nKX12YXIgaz1hO2woYS5iLGMpO2woYS5jLGMpO3ooYSl9O2Z1bmN0aW9uIEIoYSxiKXt2YXIgYz1ifHx7fTt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwifXZhciBDPW51bGwsRD1udWxsLEU9bnVsbCxGPW51bGw7ZnVuY3Rpb24gRygpe2lmKG51bGw9PT1EKWlmKEooKSYmL0FwcGxlLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKSl7dmFyIGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO0Q9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCl9ZWxzZSBEPSExO3JldHVybiBEfWZ1bmN0aW9uIEooKXtudWxsPT09RiYmKEY9ISFkb2N1bWVudC5mb250cyk7cmV0dXJuIEZ9XG5cdGZ1bmN0aW9uIEsoKXtpZihudWxsPT09RSl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0cnl7YS5zdHlsZS5mb250PVwiY29uZGVuc2VkIDEwMHB4IHNhbnMtc2VyaWZcIn1jYXRjaChiKXt9RT1cIlwiIT09YS5zdHlsZS5mb250fXJldHVybiBFfWZ1bmN0aW9uIEwoYSxiKXtyZXR1cm5bYS5zdHlsZSxhLndlaWdodCxLKCk/YS5zdHJldGNoOlwiXCIsXCIxMDBweFwiLGJdLmpvaW4oXCIgXCIpfVxuXHRCLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxrPWF8fFwiQkVTYnN3eVwiLHI9MCxuPWJ8fDNFMyxIPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2lmKEooKSYmIUcoKSl7dmFyIE09bmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBlKCl7KG5ldyBEYXRlKS5nZXRUaW1lKCktSD49bj9iKEVycm9yKFwiXCIrbitcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpOmRvY3VtZW50LmZvbnRzLmxvYWQoTChjLCdcIicrYy5mYW1pbHkrJ1wiJyksaykudGhlbihmdW5jdGlvbihjKXsxPD1jLmxlbmd0aD9hKCk6c2V0VGltZW91dChlLDI1KX0sYil9ZSgpfSksTj1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGMpe3I9c2V0VGltZW91dChmdW5jdGlvbigpe2MoRXJyb3IoXCJcIituK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSl9LG4pfSk7UHJvbWlzZS5yYWNlKFtOLE1dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHIpO2EoYyl9LFxuXHRiKX1lbHNlIG0oZnVuY3Rpb24oKXtmdW5jdGlvbiB2KCl7dmFyIGI7aWYoYj0tMSE9ZiYmLTEhPWd8fC0xIT1mJiYtMSE9aHx8LTEhPWcmJi0xIT1oKShiPWYhPWcmJmYhPWgmJmchPWgpfHwobnVsbD09PUMmJihiPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSxDPSEhYiYmKDUzNj5wYXJzZUludChiWzFdLDEwKXx8NTM2PT09cGFyc2VJbnQoYlsxXSwxMCkmJjExPj1wYXJzZUludChiWzJdLDEwKSkpLGI9QyYmKGY9PXcmJmc9PXcmJmg9PXd8fGY9PXgmJmc9PXgmJmg9PXh8fGY9PXkmJmc9PXkmJmg9PXkpKSxiPSFiO2ImJihkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxjbGVhclRpbWVvdXQociksYShjKSl9ZnVuY3Rpb24gSSgpe2lmKChuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PW4pZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksYihFcnJvcihcIlwiK1xuXHRuK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLGc9cC5hLm9mZnNldFdpZHRoLGg9cS5hLm9mZnNldFdpZHRoLHYoKTtyPXNldFRpbWVvdXQoSSw1MCl9fXZhciBlPW5ldyB0KGspLHA9bmV3IHQoaykscT1uZXcgdChrKSxmPS0xLGc9LTEsaD0tMSx3PS0xLHg9LTEseT0tMSxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5kaXI9XCJsdHJcIjt1KGUsTChjLFwic2Fucy1zZXJpZlwiKSk7dShwLEwoYyxcInNlcmlmXCIpKTt1KHEsTChjLFwibW9ub3NwYWNlXCIpKTtkLmFwcGVuZENoaWxkKGUuYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2QuYXBwZW5kQ2hpbGQocS5hKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO3c9ZS5hLm9mZnNldFdpZHRoO3g9cC5hLm9mZnNldFdpZHRoO3k9cS5hLm9mZnNldFdpZHRoO0koKTtBKGUsZnVuY3Rpb24oYSl7Zj1hO3YoKX0pO3UoZSxcblx0TChjLCdcIicrYy5mYW1pbHkrJ1wiLHNhbnMtc2VyaWYnKSk7QShwLGZ1bmN0aW9uKGEpe2c9YTt2KCl9KTt1KHAsTChjLCdcIicrYy5mYW1pbHkrJ1wiLHNlcmlmJykpO0EocSxmdW5jdGlvbihhKXtoPWE7digpfSk7dShxLEwoYywnXCInK2MuZmFtaWx5KydcIixtb25vc3BhY2UnKSl9KX0pfTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1COih3aW5kb3cuRm9udEZhY2VPYnNlcnZlcj1CLHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkPUIucHJvdG90eXBlLmxvYWQpO30oKSk7XG5cblx0Ly8gbWlubnBvc3QgZm9udHNcblxuXHQvLyBzYW5zXG5cdHZhciBzYW5zTm9ybWFsID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoICdmZi1tZXRhLXdlYi1wcm8nICk7XG5cdHZhciBzYW5zQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNhbnNOb3JtYWxJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA0MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cblx0Ly8gc2VyaWZcblx0dmFyIHNlcmlmQm9vayA9IG5ldyBGb250RmFjZU9ic2VydmVyKCBcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA1MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvb2tJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA1MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvbGQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvbGRJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJsYWNrID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogOTAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCbGFja0l0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDkwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblxuXHRQcm9taXNlLmFsbCggW1xuXHRcdHNhbnNOb3JtYWwubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zTm9ybWFsSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvb2subG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9va0l0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvbGRJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQmxhY2subG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQmxhY2tJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApXG5cdF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkJztcblx0XHQvLyBPcHRpbWl6YXRpb24gZm9yIFJlcGVhdCBWaWV3c1xuXHRcdHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG5cblx0UHJvbWlzZS5hbGwoIFtcblx0XHRzYW5zTm9ybWFsLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zQm9sZC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc05vcm1hbEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwIClcblx0XSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzYW5zLWZvbnRzLWxvYWRlZCc7XG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG59XG5cbiIsImZ1bmN0aW9uIG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHZhbHVlICkge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggZSApIHtcblxuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgUFVNICkge1xuXHRcdHZhciBjdXJyZW50X3BvcHVwID0gUFVNLmdldFBvcHVwKCAkKCAnLnB1bScgKSApO1xuXHRcdHZhciBzZXR0aW5ncyA9IFBVTS5nZXRTZXR0aW5ncyggJCggJy5wdW0nICkgKTtcblx0XHR2YXIgcG9wdXBfaWQgPSBzZXR0aW5ncy5pZDtcblx0XHQkKCBkb2N1bWVudCApLm9uKCAncHVtQWZ0ZXJPcGVuJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsICdTaG93JywgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9KTtcblx0XHR9KTtcblx0XHQkKCBkb2N1bWVudCApLm9uKCAncHVtQWZ0ZXJDbG9zZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGNsb3NlX3RyaWdnZXIgPSAkLmZuLnBvcG1ha2UubGFzdF9jbG9zZV90cmlnZ2VyO1xuXHRcdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGNsb3NlX3RyaWdnZXIgKSB7XG5cdFx0XHRcdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1BvcHVwJywgY2xvc2VfdHJpZ2dlciwgcG9wdXBfaWQsIHsgJ25vbkludGVyYWN0aW9uJzogMSB9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkKCAnLm1lc3NhZ2UtY2xvc2UnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkgeyAvLyB1c2VyIGNsaWNrcyBsaW5rIHdpdGggY2xvc2UgY2xhc3Ncblx0XHRcdHZhciBjbG9zZV90cmlnZ2VyID0gJ0Nsb3NlIEJ1dHRvbic7XG5cdFx0XHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsICdQb3B1cCcsIGNsb3NlX3RyaWdnZXIsIHBvcHVwX2lkLCB7ICdub25JbnRlcmFjdGlvbic6IDEgfSk7XG5cdFx0fSk7XG5cdFx0JCggJy5tZXNzYWdlLWxvZ2luJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3MgbGluayB3aXRoIGxvZ2luIGNsYXNzXG5cdFx0XHR2YXIgdXJsID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnTG9naW4gTGluaycsIHVybCApO1xuXHRcdH0pO1xuXHRcdCQoICcucHVtLWNvbnRlbnQgYTpub3QoIC5tZXNzYWdlLWNsb3NlLCAucHVtLWNsb3NlLCAubWVzc2FnZS1sb2dpbiApJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHsgLy8gdXNlciBjbGlja3Mgc29tZXRoaW5nIHRoYXQgaXMgbm90IGNsb3NlIHRleHQgb3IgY2xvc2UgaWNvblxuXHRcdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnUG9wdXAnLCAnQ2xpY2snLCBwb3B1cF9pZCApO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSAmJiAnJyAhPT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLnVybF9hY2Nlc3NfbGV2ZWwgKSB7XG5cdFx0dmFyIHR5cGUgPSAnZXZlbnQnO1xuXHRcdHZhciBjYXRlZ29yeSA9ICdNZW1iZXIgQ29udGVudCc7XG5cdFx0dmFyIGxhYmVsID0gbG9jYXRpb24ucGF0aG5hbWU7IC8vIGkgdGhpbmsgd2UgY291bGQgcG9zc2libHkgcHV0IHNvbWUgZ3JvdXBpbmcgaGVyZSwgYnV0IHdlIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYWNjZXNzIHRvIG9uZSBhbmQgbWF5YmUgaXQncyBub3Qgd29ydGh3aGlsZSB5ZXRcblx0XHR2YXIgYWN0aW9uID0gJ0Jsb2NrZWQnO1xuXHRcdGlmICggdHJ1ZSA9PT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLmN1cnJlbnRfdXNlci5jYW5fYWNjZXNzICkge1xuXHRcdFx0YWN0aW9uID0gJ1Nob3duJztcblx0XHR9XG5cdFx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHR9XG59KTtcbiIsImZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uID0gJycgKSB7XG5cblx0Ly8gaWYgYSBub3QgbG9nZ2VkIGluIHVzZXIgdHJpZXMgdG8gZW1haWwsIGRvbid0IGNvdW50IHRoYXQgYXMgYSBzaGFyZVxuXHRpZiAoICEgalF1ZXJ5KCAnYm9keScgKS5oYXNDbGFzcyggJ2xvZ2dlZC1pbicgKSAmJiAnRW1haWwnID09PSB0ZXh0ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBjYXRlZ29yeSA9ICdTaGFyZSc7XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdGNhdGVnb3J5ID0gJ1NoYXJlIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cblx0Ly8gdHJhY2sgYXMgYW4gZXZlbnQsIGFuZCBhcyBzb2NpYWwgaWYgaXQgaXMgdHdpdHRlciBvciBmYlxuXHRtcF9hbmFseXRpY3NfdHJhY2tpbmdfZXZlbnQoICdldmVudCcsIGNhdGVnb3J5LCB0ZXh0LCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0IHx8ICdUd2l0dGVyJyA9PT0gdGV4dCApIHtcblx0XHRcdGlmICggJ0ZhY2Vib29rJyA9PSB0ZXh0ICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZnVuY3Rpb24gY29weUN1cnJlbnRVUkwoKSB7XG5cdHZhciBkdW1teSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdpbnB1dCcgKSwgdGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkdW1teSApO1xuXHRkdW1teS52YWx1ZSA9IHRleHQ7XG5cdGR1bW15LnNlbGVjdCgpO1xuXHRkb2N1bWVudC5leGVjQ29tbWFuZCggJ2NvcHknICk7XG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoIGR1bW15ICk7XG59XG5cbiQoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLmRhdGEoICdzaGFyZS1hY3Rpb24nICk7XG5cdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSk7XG5cbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1wcmludCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR3aW5kb3cucHJpbnQoKTtcbn0pO1xuXG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtY29weS11cmwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGNvcHlDdXJyZW50VVJMKCk7XG5cdHRsaXRlLnNob3coICggZS50YXJnZXQgKSwgeyBncmF2OiAndycgfSApO1xuXHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHR0bGl0ZS5oaWRlKCAoIGUudGFyZ2V0ICkgKTtcblx0fSwgMzAwMCApO1xuXHRyZXR1cm4gZmFsc2U7XG59KTtcblxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWZhY2Vib29rIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXR3aXR0ZXIgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZW1haWwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0dmFyIHVybCA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcbiAgICB3aW5kb3cub3BlbiggdXJsLCAnX2JsYW5rJyApO1xufSk7XG4iLCIvKipcbiAqIEZpbGUgbmF2aWdhdGlvbi5qcy5cbiAqXG4gKiBOYXZpZ2F0aW9uIHNjcmlwdHMuIEluY2x1ZGVzIG1vYmlsZSBvciB0b2dnbGUgYmVoYXZpb3IsIGFuYWx5dGljcyB0cmFja2luZyBvZiBzcGVjaWZpYyBtZW51cy5cbiAqL1xuXG5mdW5jdGlvbiBzZXR1cFByaW1hcnlOYXYoKSB7XG5cdGNvbnN0IHByaW1hcnlOYXZUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCh7XG5cdCAgZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1saW5rcycgKSxcblx0ICB2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0ICBkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9KTtcblxuXHR2YXIgcHJpbWFyeU5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgYnV0dG9uJyApO1xuXHRwcmltYXJ5TmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0bGV0IGV4cGFuZGVkID0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZScgfHwgZmFsc2U7XG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdH1cblx0fSk7XG5cblx0Y29uc3QgdXNlck5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KHtcblx0ICBlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItbWlubnBvc3QtYWNjb3VudCB1bCcgKSxcblx0ICB2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0ICBkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9KTtcblxuXHR2YXIgdXNlck5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1taW5ucG9zdC1hY2NvdW50ID4gYScgKTtcblx0dXNlck5hdlRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGxldCBleHBhbmRlZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnIHx8IGZhbHNlO1xuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1x0XG5cdFx0fSBlbHNlIHtcblx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHR9XG5cdH0pO1xuXG5cdHZhciB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IC5tLWZvcm0tc2VhcmNoIGZpZWxkc2V0JyApO1xuXHR2YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyk7XG5cdHNwYW4uaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLXNlYXJjaFwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuXG5cdHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0ZGl2LmFwcGVuZENoaWxkKHNwYW4pO1xuXG5cdHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcblxuXHR0YXJnZXQuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuXG5cdGNvbnN0IHNlYXJjaFRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KHtcblx0ICBlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWFjdGlvbnMgLm0tZm9ybS1zZWFyY2gnICksXG5cdCAgdmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdCAgZGlzcGxheVZhbHVlOiAnZmxleCdcblx0fSk7XG5cblx0dmFyIHNlYXJjaFZpc2libGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbGkuc2VhcmNoID4gYScgKTtcblx0c2VhcmNoVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGxldCBleHBhbmRlZCA9IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnIHx8IGZhbHNlO1xuXHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdH1cblx0fSk7XG5cblx0dmFyIHNlYXJjaENsb3NlICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1zZWFyY2gnICk7XG5cdHNlYXJjaENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0bGV0IGV4cGFuZGVkID0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZScgfHwgZmFsc2U7XG5cdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBlc2NhcGUga2V5IHByZXNzXG5cdCQoZG9jdW1lbnQpLmtleXVwKGZ1bmN0aW9uKGUpIHtcblx0XHRpZiAoMjcgPT09IGUua2V5Q29kZSApIHtcblx0XHRcdGxldCBwcmltYXJ5TmF2RXhwYW5kZWQgPSBwcmltYXJ5TmF2VG9nZ2xlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJyB8fCBmYWxzZTtcblx0XHRcdGxldCB1c2VyTmF2RXhwYW5kZWQgPSB1c2VyTmF2VG9nZ2xlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJyB8fCBmYWxzZTtcblx0XHRcdGxldCBzZWFyY2hJc1Zpc2libGUgPSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJyB8fCBmYWxzZTtcblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgcHJpbWFyeU5hdkV4cGFuZGVkICYmIHRydWUgPT09IHByaW1hcnlOYXZFeHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRvZ2dsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBwcmltYXJ5TmF2RXhwYW5kZWQgKTtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1x0XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHVzZXJOYXZFeHBhbmRlZCAmJiB0cnVlID09PSB1c2VyTmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgdXNlck5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcdFxuXHRcdFx0fVxuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBzZWFyY2hJc1Zpc2libGUgJiYgdHJ1ZSA9PT0gc2VhcmNoSXNWaXNpYmxlICkge1xuXHRcdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHNlYXJjaElzVmlzaWJsZSApO1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzZXR1cFRvcGljc05hdigpIHtcblxuXHQvLyBJbml0IHdpdGggYWxsIG9wdGlvbnMgYXQgZGVmYXVsdCBzZXR0aW5nXG5cdGNvbnN0IHByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0ID0gUHJpb3JpdHlOYXZTY3JvbGxlcih7XG5cdCAgc2VsZWN0b3I6ICcubS10b3BpY3MnLFxuXHQgIG5hdlNlbGVjdG9yOiAnLm0tdG9waWNzLW5hdmlnYXRpb24nLFxuXHQgIGNvbnRlbnRTZWxlY3RvcjogJy5tLW1lbnUtdG9waWNzJyxcblx0ICBpdGVtU2VsZWN0b3I6ICdsaSwgYScsXG5cdCAgYnV0dG9uTGVmdFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuXHQgIGJ1dHRvblJpZ2h0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tcmlnaHQnLFxuXHQgIC8vc2Nyb2xsU3RlcDogJ2F2ZXJhZ2UnXG5cdH0pO1xuXG5cdC8vIEluaXQgbXVsdGlwbGUgbmF2IHNjcm9sbGVycyB3aXRoIHRoZSBzYW1lIG9wdGlvbnNcblx0LypsZXQgbmF2U2Nyb2xsZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi1zY3JvbGxlcicpO1xuXG5cdG5hdlNjcm9sbGVycy5mb3JFYWNoKChjdXJyZW50VmFsdWUsIGN1cnJlbnRJbmRleCkgPT4ge1xuXHQgIFByaW9yaXR5TmF2U2Nyb2xsZXIoe1xuXHQgICAgc2VsZWN0b3I6IGN1cnJlbnRWYWx1ZVxuXHQgIH0pO1xuXHR9KTsqL1xufVxuXG5zZXR1cFByaW1hcnlOYXYoKTtcbnNldHVwVG9waWNzTmF2KCk7XG5cbiQoICcjbmF2aWdhdGlvbi1mZWF0dXJlZCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnRmVhdHVyZWQgQmFyIExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcbn0pO1xuXG4kKCAnYS5nbGVhbi1zaWRlYmFyJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0bXBfYW5hbHl0aWNzX3RyYWNraW5nX2V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBTdXBwb3J0IExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcbn0pO1xuXG4kKCAnYScsICQoICcuby1zaXRlLXNpZGViYXInICkgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdHZhciB3aWRnZXRfdGl0bGUgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXdpZGdldCcgKS5maW5kKCAnaDMnICkudGV4dCgpO1xuXHR2YXIgem9uZV90aXRsZSAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS16b25lJyApLmZpbmQoICcuYS16b25lLXRpdGxlJyApLnRleHQoKTtcblx0dmFyIHNpZGViYXJfc2VjdGlvbl90aXRsZSA9ICcnO1xuXHRpZiAoICcnICE9PSB3aWRnZXRfdGl0bGUgKSB7XG5cdFx0c2lkZWJhcl9zZWN0aW9uX3RpdGxlID0gd2lkZ2V0X3RpdGxlO1xuXHR9IGVsc2UgaWYgKCAnJyAhPT0gem9uZV90aXRsZSApIHtcblx0XHRzaWRlYmFyX3NlY3Rpb25fdGl0bGUgPSB6b25lX3RpdGxlO1xuXHR9XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJfc2VjdGlvbl90aXRsZSApO1xufSk7XG4iLCJcbmpRdWVyeS5mbi50ZXh0Tm9kZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY29udGVudHMoKS5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoIHRoaXMubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmICcnICE9PSB0aGlzLm5vZGVWYWx1ZS50cmltKCkgKTtcblx0fSk7XG59O1xuXG5mdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0cmV0dXJuIG1hcmt1cDtcbn1cblxuZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCggJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nICk7XG5cdHZhciByZXN0X3Jvb3QgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0dmFyIGZ1bGxfdXJsICAgICAgICAgICA9IHJlc3Rfcm9vdCArICcvJyArICd1cGRhdGUtdXNlci8nO1xuXHR2YXIgY29uZmlybUNoYW5nZSAgICAgID0gJyc7XG5cdHZhciBuZXh0RW1haWxDb3VudCAgICAgPSAxO1xuXHR2YXIgbmV3UHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBvbGRQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIHByaW1hcnlJZCAgICAgICAgICA9ICcnO1xuXHR2YXIgZW1haWxUb1JlbW92ZSAgICAgID0gJyc7XG5cdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0dmFyIG5ld0VtYWlscyAgICAgICAgICA9IFtdO1xuXHR2YXIgYWpheF9mb3JtX2RhdGEgICAgID0gJyc7XG5cdHZhciB0aGF0ICAgICAgICAgICAgICAgPSAnJztcblxuXHQvLyBzdGFydCBvdXQgd2l0aCBubyBwcmltYXJ5L3JlbW92YWxzIGNoZWNrZWRcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0Ly8gaWYgdGhlcmUgaXMgYSBsaXN0IG9mIGVtYWlscyAobm90IGp1c3QgYSBzaW5nbGUgZm9ybSBmaWVsZClcblx0aWYgKCAwIDwgJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHNlbGVjdHMgYSBuZXcgcHJpbWFyeSwgbW92ZSBpdCBpbnRvIHRoYXQgcG9zaXRpb25cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScsIGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdFx0bmV3UHJpbWFyeUVtYWlsID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdHByaW1hcnlJZCAgICAgICA9ICQoIHRoaXMgKS5wcm9wKCAnaWQnICkucmVwbGFjZSggJ3ByaW1hcnlfZW1haWxfJywgJycgKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdwcmltYXJ5LWNoYW5nZScgKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXG5cdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBtYWluIGhpZGRlbiBmb3JtIHZhbHVlXG5cdFx0XHRcdCQoICcjZW1haWwnICkudmFsKCBuZXdQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBzdWJtaXQgZm9ybSB2YWx1ZXMuXG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cblx0XHRcdFx0Ly8gdW5jaGVjayB0aGUgcmFkaW8gYnV0dG9uXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIGZvcm0gdmFsdWVzIHRvIHRoZSBvbGQgcHJpbWFyeSBlbWFpbFxuXHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjcmVtb3ZlX2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgY29uZmlybSBtZXNzYWdlXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHR9KTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjaGFuZ2UnLCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG5cdFx0XHRcdGlmICggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICE9PSBlbWFpbFRvUmVtb3ZlICkge1xuXHRcdFx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscy5wdXNoKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlciBmb3IgcmVtb3ZhbFxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0Ly8gaWYgY29uZmlybWVkLCByZW1vdmUgdGhlIGVtYWlsIGFuZCBzdWJtaXQgdGhlIGZvcm1cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGknICkuZmFkZU91dCggJ25vcm1hbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0Y29uc29sZS5sb2coICd2YWx1ZSBpcyAnICsgY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gaWYgYSB1c2VyIHdhbnRzIHRvIGFkZCBhbiBlbWFpbCwgZ2l2ZSB0aGVtIGEgcHJvcGVybHkgbnVtYmVyZWQgZmllbGRcblx0JCggJy5tLWZvcm0tZW1haWwnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJyApLmJlZm9yZSggJzxkaXYgY2xhc3M9XCJhLWlucHV0LXdpdGgtYnV0dG9uIGEtYnV0dG9uLXNlbnRlbmNlXCI+PGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgaWQ9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgdmFsdWU9XCJcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBuYW1lPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGlkPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGNsYXNzPVwiYS1idXR0b24gYS1idXR0b24tYWRkLXVzZXItZW1haWxcIj5BZGQ8L2J1dHRvbj48L2Rpdj4nICk7XG5cdFx0bmV4dEVtYWlsQ291bnQrKztcblx0fSk7XG5cblx0JCggJ2lucHV0W3R5cGU9c3VibWl0XScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyIGJ1dHRvbiA9ICQoIHRoaXMgKTtcblx0XHR2YXIgYnV0dG9uX2Zvcm0gPSBidXR0b24uY2xvc2VzdCggJ2Zvcm0nICk7XG5cdFx0YnV0dG9uX2Zvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJywgYnV0dG9uLnZhbCgpICk7XG5cdH0pO1xuXG5cdCQoICcubS1lbnRyeS1jb250ZW50JyApLm9uKCAnc3VibWl0JywgJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0dmFyIGZvcm0gPSAkKCB0aGlzICk7XG5cdFx0dmFyIHN1Ym1pdHRpbmdfYnV0dG9uID0gZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nICkgfHwgJyc7XG5cblx0XHQvLyBpZiB0aGVyZSBpcyBubyBzdWJtaXR0aW5nIGJ1dHRvbiwgcGFzcyBpdCBieSBBamF4XG5cdFx0aWYgKCAnJyA9PT0gc3VibWl0dGluZ19idXR0b24gfHwgJ1NhdmUgQ2hhbmdlcycgIT09IHN1Ym1pdHRpbmdfYnV0dG9uICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGFqYXhfZm9ybV9kYXRhID0gZm9ybS5zZXJpYWxpemUoKTsgLy9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheF9mb3JtX2RhdGEgPSBhamF4X2Zvcm1fZGF0YSArICcmcmVzdD10cnVlJztcblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHVybDogZnVsbF91cmwsXG5cdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oIHhociApIHtcblx0XHRcdCAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0ICAgIH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhfZm9ybV9kYXRhXG5cdFx0XHR9KS5kb25lKCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0fSkuZ2V0KCk7XG5cdFx0XHRcdCQuZWFjaCggbmV3RW1haWxzLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICkge1xuXHRcdFx0XHRcdG5leHRFbWFpbENvdW50ID0gbmV4dEVtYWlsQ291bnQgKyBpbmRleDtcblx0XHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmFwcGVuZCggJzxsaSBpZD1cInVzZXItZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPicgKyB2YWx1ZSArICc8dWwgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXVzZXItZW1haWwtYWN0aW9uc1wiPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1tYWtlLXByaW1hcnktZW1haWxcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW1hcnlfZW1haWxcIiBpZD1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+TWFrZSBQcmltYXJ5PC9zbWFsbD48L2xhYmVsPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLWVtYWlsLXByZWZlcmVuY2VzXCI+PGEgaHJlZj1cIi9uZXdzbGV0dGVycy8/ZW1haWw9JyArIGVuY29kZVVSSUNvbXBvbmVudCggdmFsdWUgKSArICdcIj48c21hbGw+RW1haWwgUHJlZmVyZW5jZXM8L3NtYWxsPjwvYT48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggJCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoKSArICcsJyArIHZhbHVlICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggMCA9PT0gJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIGl0IHdvdWxkIGJlIG5pY2UgdG8gb25seSBsb2FkIHRoZSBmb3JtLCBidXQgdGhlbiBjbGljayBldmVudHMgc3RpbGwgZG9uJ3Qgd29ya1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIDAgPCAkKCAnLm0tZm9ybS1lbWFpbCcgKS5sZW5ndGggKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cbn0pO1xuIiwiLy8gYmFzZWQgb24gd2hpY2ggYnV0dG9uIHdhcyBjbGlja2VkLCBzZXQgdGhlIHZhbHVlcyBmb3IgdGhlIGFuYWx5dGljcyBldmVudCBhbmQgY3JlYXRlIGl0XG5mdW5jdGlvbiB0cmFja1Nob3dDb21tZW50cyggYWx3YXlzLCBpZCwgY2xpY2tfdmFsdWUgKSB7XG5cdHZhciBhY3Rpb24gICAgICAgICAgPSAnJztcblx0dmFyIGNhdGVnb3J5X3ByZWZpeCA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlfc3VmZml4ID0gJyc7XG5cdHZhciBwb3NpdGlvbiAgICAgICAgPSAnJztcblx0cG9zaXRpb24gPSBpZC5yZXBsYWNlKCAnYWx3YXlzLXNob3ctY29tbWVudHMtJywgJycgKTtcblx0aWYgKCAnMScgPT09IGNsaWNrX3ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPbic7XG5cdH0gZWxzZSBpZiAoICcwJyA9PT0gY2xpY2tfdmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09mZic7XG5cdH0gZWxzZSB7XG5cdFx0YWN0aW9uID0gJ0NsaWNrJztcblx0fVxuXHRpZiAoIHRydWUgPT09IGFsd2F5cyApIHtcblx0XHRjYXRlZ29yeV9wcmVmaXggPSAnQWx3YXlzICc7XG5cdH1cblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbi5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgcG9zaXRpb24uc2xpY2UoIDEgKTtcblx0XHRjYXRlZ29yeV9zdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wX2FuYWx5dGljc190cmFja2luZ19ldmVudCggJ2V2ZW50JywgY2F0ZWdvcnlfcHJlZml4ICsgJ1Nob3cgQ29tbWVudHMnICsgY2F0ZWdvcnlfc3VmZml4LCBhY3Rpb24sIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59XG5cbi8vIHdoZW4gc2hvd2luZyBjb21tZW50cyBvbmNlLCB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1idXR0b24tc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR0cmFja1Nob3dDb21tZW50cyggZmFsc2UsICcnLCAnJyApO1xufSk7XG5cbi8vIFNldCB1c2VyIG1ldGEgdmFsdWUgZm9yIGFsd2F5cyBzaG93aW5nIGNvbW1lbnRzIGlmIHRoYXQgYnV0dG9uIGlzIGNsaWNrZWRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR2YXIgdGhhdCA9ICQoIHRoaXMgKTtcblx0aWYgKCB0aGF0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9IGVsc2Uge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvLyB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcblx0dHJhY2tTaG93Q29tbWVudHMoIHRydWUsIHRoYXQuYXR0ciggJ2lkJyApLCB0aGF0LnZhbCgpICk7XG5cblx0Ly8gd2UgYWxyZWFkeSBoYXZlIGFqYXh1cmwgZnJvbSB0aGUgdGhlbWVcblx0JC5hamF4KHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBhamF4dXJsLFxuXHRcdGRhdGE6IHtcbiAgICAgICAgXHQnYWN0aW9uJzogJ21pbm5wb3N0X2xhcmdvX2xvYWRfY29tbWVudHNfc2V0X3VzZXJfbWV0YScsXG4gICAgICAgIFx0J3ZhbHVlJzogdGhhdC52YWwoKVxuXHRcdH0sXG5cdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuICAgICAgICBcdCQoICcuYS1hbHdheXMtc2hvdy1jb21tZW50cy1yZXN1bHQnLCB0aGF0LnBhcmVudCgpICkuaHRtbCggcmVzcG9uc2UuZGF0YS5tZXNzYWdlICk7XG4gICAgICAgIFx0aWYgKCB0cnVlID09PSByZXNwb25zZS5kYXRhLnNob3cgKSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDAgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDEgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG4iXX0=
}(jQuery));
