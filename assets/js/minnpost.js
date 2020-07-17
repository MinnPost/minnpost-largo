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

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

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

/**
 * Do these things as quickly as possible; we might have CSS or early scripts that require on it
 *
 * This file does not require jQuery.
 *
 */
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * This loads our fonts and adds classes to the HTML element
 *
 * This file does not require jQuery.
 * This file does require Font Face Observer v2.1.0
 *
 */
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
        if (b == a) {
          throw new TypeError();
        }

        var c = !1;

        try {
          var d = b && b.then;

          if (null != b && 'object' === _typeof(b) && 'function' === typeof d) {
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
        if (b == a) {
          throw new TypeError();
        }

        a.a = 1;
        a.b = b;
        v(a);
      }
    }

    function v(a) {
      l(function () {
        if (a.a != p) {
          for (; a.f.length;) {
            var b = a.f.shift(),
                c = b[0],
                d = b[1],
                e = b[2],
                b = b[3];

            try {
              0 == a.a ? 'function' === typeof c ? e(c.call(void 0, a.b)) : e(a.b) : 1 == a.a && ('function' === typeof d ? e(d.call(void 0, a.b)) : b(a.b));
            } catch (h) {
              b(h);
            }
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

    window.Promise || (window.Promise = n, window.Promise.resolve = u, window.Promise.reject = t, window.Promise.race = x, window.Promise.all = w, window.Promise.prototype.then = n.prototype.c, window.Promise.prototype.catch = n.prototype.g);
  })();

  (function () {
    function l(a, b) {
      document.addEventListener ? a.addEventListener('scroll', b, !1) : a.attachEvent('scroll', b);
    }

    function m(a) {
      document.body ? a() : document.addEventListener ? document.addEventListener('DOMContentLoaded', function c() {
        document.removeEventListener('DOMContentLoaded', c);
        a();
      }) : document.attachEvent('onreadystatechange', function k() {
        if ('interactive' == document.readyState || 'complete' == document.readyState) {
          document.detachEvent('onreadystatechange', k), a();
        }
      });
    }

    function t(a) {
      this.a = document.createElement('div');
      this.a.setAttribute('aria-hidden', 'true');
      this.a.appendChild(document.createTextNode(a));
      this.b = document.createElement('span');
      this.c = document.createElement('span');
      this.h = document.createElement('span');
      this.f = document.createElement('span');
      this.g = -1;
      this.b.style.cssText = 'max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;';
      this.c.style.cssText = 'max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;';
      this.f.style.cssText = 'max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;';
      this.h.style.cssText = 'display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;';
      this.b.appendChild(this.h);
      this.c.appendChild(this.f);
      this.a.appendChild(this.b);
      this.a.appendChild(this.c);
    }

    function u(a, b) {
      a.a.style.cssText = 'max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:' + b + ';';
    }

    function z(a) {
      var b = a.a.offsetWidth,
          c = b + 100;
      a.f.style.width = c + 'px';
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

    function B(a, b) {
      var c = b || {};
      this.family = a;
      this.style = c.style || 'normal';
      this.weight = c.weight || 'normal';
      this.stretch = c.stretch || 'normal';
    }

    var C = null,
        D = null,
        E = null,
        F = null;

    function G() {
      if (null === D) {
        if (J() && /Apple/.test(window.navigator.vendor)) {
          var a = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent);
          D = !!a && 603 > parseInt(a[1], 10);
        } else {
          D = !1;
        }
      }

      return D;
    }

    function J() {
      null === F && (F = !!document.fonts);
      return F;
    }

    function K() {
      if (null === E) {
        var a = document.createElement('div');

        try {
          a.style.font = 'condensed 100px sans-serif';
        } catch (b) {}

        E = '' !== a.style.font;
      }

      return E;
    }

    function L(a, b) {
      return [a.style, a.weight, K() ? a.stretch : '', '100px', b].join(' ');
    }

    B.prototype.load = function (a, b) {
      var c = this,
          k = a || 'BESbswy',
          r = 0,
          n = b || 3E3,
          H = new Date().getTime();
      return new Promise(function (a, b) {
        if (J() && !G()) {
          var M = new Promise(function (a, b) {
            function e() {
              new Date().getTime() - H >= n ? b(Error('' + n + 'ms timeout exceeded')) : document.fonts.load(L(c, '"' + c.family + '"'), k).then(function (c) {
                1 <= c.length ? a() : setTimeout(e, 25);
              }, b);
            }

            e();
          }),
              N = new Promise(function (a, c) {
            r = setTimeout(function () {
              c(Error('' + n + 'ms timeout exceeded'));
            }, n);
          });
          Promise.race([N, M]).then(function () {
            clearTimeout(r);
            a(c);
          }, b);
        } else {
          m(function () {
            function v() {
              var b;

              if (b = -1 != f && -1 != g || -1 != f && -1 != h || -1 != g && -1 != h) {
                (b = f != g && f != h && g != h) || (null === C && (b = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent), C = !!b && (536 > parseInt(b[1], 10) || 536 === parseInt(b[1], 10) && 11 >= parseInt(b[2], 10))), b = C && (f == w && g == w && h == w || f == x && g == x && h == x || f == y && g == y && h == y)), b = !b;
              }

              b && (d.parentNode && d.parentNode.removeChild(d), clearTimeout(r), a(c));
            }

            function I() {
              if (new Date().getTime() - H >= n) {
                d.parentNode && d.parentNode.removeChild(d), b(Error('' + n + 'ms timeout exceeded'));
              } else {
                var a = document.hidden;

                if (!0 === a || void 0 === a) {
                  f = e.a.offsetWidth, g = p.a.offsetWidth, h = q.a.offsetWidth, v();
                }

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
                d = document.createElement('div');
            d.dir = 'ltr';
            u(e, L(c, 'sans-serif'));
            u(p, L(c, 'serif'));
            u(q, L(c, 'monospace'));
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
        }
      });
    };

    'object' === (typeof module === "undefined" ? "undefined" : _typeof(module)) ? module.exports = B : (window.FontFaceObserver = B, window.FontFaceObserver.prototype.load = B.prototype.load);
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

/**
 * This is used to cause Google Analytics events to run
 *
 * This file does not require jQuery.
 *
 */
function mpAnalyticsTrackingEvent(type, category, action, label, value) {
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

document.addEventListener('DOMContentLoaded', function (event) {
  if ('undefined' !== typeof minnpost_membership_data && '' !== minnpost_membership_data.url_access_level) {
    var type = 'event';
    var category = 'Member Content';
    var label = location.pathname; // i think we could possibly put some grouping here, but we don't necessarily have access to one and maybe it's not worthwhile yet

    var action = 'Blocked';

    if (true === minnpost_membership_data.current_user.can_access) {
      action = 'Shown';
    }

    mpAnalyticsTrackingEvent(type, category, action, label);
  }
});
"use strict";

/**
 * Methods for sharing content
 *
 * This file does require jQuery.
 *
 */
// track a share via analytics event
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


  mpAnalyticsTrackingEvent('event', category, text, location.pathname);

  if ('undefined' !== typeof ga) {
    if ('Facebook' === text || 'Twitter' === text) {
      if ('Facebook' === text) {
        ga('send', 'social', text, 'Share', location.pathname);
      } else {
        ga('send', 'social', text, 'Tweet', location.pathname);
      }
    }
  } else {
    return;
  }
} // copy the current URL to the user's clipboard


function copyCurrentURL() {
  var dummy = document.createElement('input'),
      text = window.location.href;
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
} // top share button click


$('.m-entry-share-top a').click(function () {
  var text = $(this).data('share-action');
  var position = 'top';
  trackShare(text, position);
}); // cause the current page to print

$('.m-entry-share .a-share-print a').click(function (e) {
  e.preventDefault();
  window.print();
}); // when the copy link button is clicked

$('.m-entry-share .a-share-copy-url a').click(function (e) {
  copyCurrentURL();
  tlite.show(e.target, {
    grav: 'w'
  });
  setTimeout(function () {
    tlite.hide(e.target);
  }, 3000);
  return false;
}); // when sharing via facebook, twitter, or email, open the destination url in a new window

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
 * This file does require jQuery.
 */
function setupPrimaryNav() {
  var primaryNavTransitioner = transitionHiddenElement({
    element: document.querySelector('.m-menu-primary-links'),
    visibleClass: 'is-open',
    displayValue: 'flex'
  });
  var primaryNavToggle = document.querySelector('nav button');

  if (null !== primaryNavToggle) {
    primaryNavToggle.addEventListener('click', function (e) {
      e.preventDefault();
      var expanded = 'true' === this.getAttribute('aria-expanded') || false;
      this.setAttribute('aria-expanded', !expanded);

      if (true === expanded) {
        primaryNavTransitioner.transitionHide();
      } else {
        primaryNavTransitioner.transitionShow();
      }
    });
  }

  var userNavTransitioner = transitionHiddenElement({
    element: document.querySelector('.your-minnpost-account ul'),
    visibleClass: 'is-open',
    displayValue: 'flex'
  });
  var userNavToggle = document.querySelector('.your-minnpost-account > a');

  if (null !== userNavToggle) {
    userNavToggle.addEventListener('click', function (e) {
      e.preventDefault();
      var expanded = 'true' === this.getAttribute('aria-expanded') || false;
      this.setAttribute('aria-expanded', !expanded);

      if (true === expanded) {
        userNavTransitioner.transitionHide();
      } else {
        userNavTransitioner.transitionShow();
      }
    });
  }

  var target = document.querySelector('nav .m-form-search fieldset .a-button-sentence');

  if (null !== target) {
    var div = document.createElement('div');
    div.innerHTML = '<a href="#" class="a-close-button a-close-search"><i class="fas fa-times"></i></a>';
    var fragment = document.createDocumentFragment();
    div.setAttribute('class', 'a-close-holder');
    fragment.appendChild(div);
    target.appendChild(fragment);

    var _searchTransitioner = transitionHiddenElement({
      element: document.querySelector('.m-menu-primary-actions .m-form-search'),
      visibleClass: 'is-open',
      displayValue: 'flex'
    });

    var searchVisible = document.querySelector('li.search > a');
    searchVisible.addEventListener('click', function (e) {
      e.preventDefault();
      var expanded = 'true' === searchVisible.getAttribute('aria-expanded') || false;
      searchVisible.setAttribute('aria-expanded', !expanded);

      if (true === expanded) {
        _searchTransitioner.transitionHide();
      } else {
        _searchTransitioner.transitionShow();
      }
    });
    var searchClose = document.querySelector('.a-close-search');
    searchClose.addEventListener('click', function (e) {
      e.preventDefault();
      var expanded = 'true' === searchVisible.getAttribute('aria-expanded') || false;
      searchVisible.setAttribute('aria-expanded', !expanded);

      if (true === expanded) {
        _searchTransitioner.transitionHide();
      } else {
        _searchTransitioner.transitionShow();
      }
    });
  } // escape key press


  $(document).keyup(function (e) {
    if (27 === e.keyCode) {
      var primaryNavExpanded = 'true' === primaryNavToggle.getAttribute('aria-expanded') || false;
      var userNavExpanded = 'true' === userNavToggle.getAttribute('aria-expanded') || false;
      var searchIsVisible = 'true' === searchVisible.getAttribute('aria-expanded') || false;

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

function setupScrollNav(selector, navSelector, contentSelector) {
  // Init with all options at default setting
  var priorityNavScrollerDefault = PriorityNavScroller({
    selector: selector,
    navSelector: navSelector,
    contentSelector: contentSelector,
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

if (0 < $('.m-sub-navigation').length) {
  setupScrollNav('.m-sub-navigation', '.m-subnav-navigation', '.m-menu-sub-navigation');
}

if (0 < $('.m-pagination-navigation').length) {
  setupScrollNav('.m-pagination-navigation', '.m-pagination-container', '.m-pagination-list');
}

$('a', $('.o-site-sidebar')).click(function () {
  var widgetTitle = $(this).closest('.m-widget').find('h3').text();
  var zoneTitle = $(this).closest('.m-zone').find('.a-zone-title').text();
  var sidebarSectionTitle = '';

  if ('' !== widgetTitle) {
    sidebarSectionTitle = widgetTitle;
  } else if ('' !== zoneTitle) {
    sidebarSectionTitle = zoneTitle;
  }

  mpAnalyticsTrackingEvent('event', 'Sidebar Link', 'Click', sidebarSectionTitle);
});
"use strict";

/**
 * Methods for forms
 *
 * This file does require jQuery.
 *
 */
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
  var restRoot = user_account_management_rest.site_url + user_account_management_rest.rest_namespace;
  var fullUrl = restRoot + '/' + 'update-user/';
  var confirmChange = '';
  var nextEmailCount = 1;
  var newPrimaryEmail = '';
  var oldPrimaryEmail = '';
  var primaryId = '';
  var emailToRemove = '';
  var consolidatedEmails = [];
  var newEmails = [];
  var ajaxFormData = '';
  var that = ''; // start out with no primary/removals checked

  $('.a-form-caption.a-make-primary-email input[type="radio"]').prop('checked', false);
  $('.a-form-caption.a-remove-email input[type="checkbox"]').prop('checked', false); // if there is a list of emails (not just a single form field)

  if (0 < $('.m-user-email-list').length) {
    nextEmailCount = $('.m-user-email-list > li').length; // if a user selects a new primary, move it into that position

    $('.m-user-email-list').on('click', '.a-form-caption.a-make-primary-email input[type="radio"]', function () {
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

    $('.m-user-email-list').on('change', '.a-form-caption.a-remove-email input[type="checkbox"]', function () {
      emailToRemove = $(this).val();
      confirmChange = getConfirmChangeMarkup('removal');
      $('.m-user-email-list > li').each(function () {
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
        $('#_consolidated_emails').val(consolidatedEmails.join(',')); //console.log( 'value is ' + consolidatedEmails.join( ',' ) );

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
  $('input[type=submit]').click(function () {
    var button = $(this);
    var buttonForm = button.closest('form');
    buttonForm.data('submitting_button', button.val());
  });
  $('.m-entry-content').on('submit', '#account-settings-form', function (event) {
    var form = $(this);
    var submittingButton = form.data('submitting_button') || ''; // if there is no submitting button, pass it by Ajax

    if ('' === submittingButton || 'Save Changes' !== submittingButton) {
      event.preventDefault();
      ajaxFormData = form.serialize(); //add our own ajax check as X-Requested-With is not always reliable

      ajaxFormData = ajaxFormData + '&rest=true';
      $.ajax({
        url: fullUrl,
        type: 'post',
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('X-WP-Nonce', user_account_management_rest.nonce);
        },
        dataType: 'json',
        data: ajaxFormData
      }).done(function () {
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

function addAutoResize() {
  document.querySelectorAll('[data-autoresize]').forEach(function (element) {
    element.style.boxSizing = 'border-box';
    var offset = element.offsetHeight - element.clientHeight;
    element.addEventListener('input', function (event) {
      event.target.style.height = 'auto';
      event.target.style.height = event.target.scrollHeight + offset + 'px';
    });
    element.removeAttribute('data-autoresize');
  });
}

$(document).ajaxStop(function () {
  var commentArea = document.querySelector('#llc_comments');

  if (null !== commentArea) {
    addAutoResize();
  }
});
document.addEventListener('DOMContentLoaded', function (event) {
  'use strict';

  if (0 < $('.m-form-account-settings').length) {
    manageEmails();
  }

  var autoResizeTextarea = document.querySelector('[data-autoresize]');

  if (null !== autoResizeTextarea) {
    addAutoResize();
  }
});
"use strict";

/**
 * Methods for comments
 *
 * This file does require jQuery.
 *
 */
// based on which button was clicked, set the values for the analytics event and create it
function trackShowComments(always, id, clickValue) {
  var action = '';
  var categoryPrefix = '';
  var categorySuffix = '';
  var position = '';
  position = id.replace('always-show-comments-', '');

  if ('1' === clickValue) {
    action = 'On';
  } else if ('0' === clickValue) {
    action = 'Off';
  } else {
    action = 'Click';
  }

  if (true === always) {
    categoryPrefix = 'Always ';
  }

  if ('' !== position) {
    position = position.charAt(0).toUpperCase() + position.slice(1);
    categorySuffix = ' - ' + position;
  }

  mpAnalyticsTrackingEvent('event', categoryPrefix + 'Show Comments' + categorySuffix, action, location.pathname);
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
    url: params.ajaxurl,
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
"use strict";

/**
 * Methods for events
 *
 * This file does not require jQuery.
 *
 */
var target = document.querySelector('.a-events-cal-links');

if (null !== target) {
  var li = document.createElement('li');
  li.innerHTML = '<a href="#" class="a-close-button a-close-calendar"><i class="fas fa-times"></i></a>';
  var fragment = document.createDocumentFragment();
  li.setAttribute('class', 'a-close-holder');
  fragment.appendChild(li);
  target.appendChild(fragment);
}

var calendarTransitioner = transitionHiddenElement({
  element: document.querySelector('.a-events-cal-links'),
  visibleClass: 'a-events-cal-link-visible',
  displayValue: 'block'
});
var calendarVisible = document.querySelector('.m-event-datetime a');

if (null !== calendarVisible) {
  calendarVisible.addEventListener('click', function (e) {
    e.preventDefault();
    var expanded = 'true' === calendarVisible.getAttribute('aria-expanded') || false;
    calendarVisible.setAttribute('aria-expanded', !expanded);

    if (true === expanded) {
      calendarTransitioner.transitionHide();
    } else {
      calendarTransitioner.transitionShow();
    }
  });
  var calendarClose = document.querySelector('.a-close-calendar');
  calendarClose.addEventListener('click', function (e) {
    e.preventDefault();
    var expanded = 'true' === calendarVisible.getAttribute('aria-expanded') || false;
    calendarVisible.setAttribute('aria-expanded', !expanded);

    if (true === expanded) {
      calendarTransitioner.transitionHide();
    } else {
      calendarTransitioner.transitionShow();
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDAtc3RhcnQuanMiLCIwMS1mb250cy5qcyIsIjAyLWFuYWx5dGljcy5qcyIsIjAzLXNoYXJlLmpzIiwiMDQtbmF2aWdhdGlvbi5qcyIsIjA1LWZvcm1zLmpzIiwiMDYtY29tbWVudHMuanMiLCIwNy1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImRvY3VtZW50RWxlbWVudCIsInNlc3Npb25TdG9yYWdlIiwic2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsInNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsImciLCJwdXNoIiwibSIsInNoaWZ0IiwicCIsImIiLCJxIiwiYyIsInUiLCJUeXBlRXJyb3IiLCJ0aGVuIiwiY2FsbCIsInYiLCJoIiwicHJvdG90eXBlIiwidyIsImsiLCJ4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyYWNlIiwiYWxsIiwiY2F0Y2giLCJhdHRhY2hFdmVudCIsImJvZHkiLCJyZWFkeVN0YXRlIiwiZGV0YWNoRXZlbnQiLCJjcmVhdGVUZXh0Tm9kZSIsImNzc1RleHQiLCJ6Iiwid2lkdGgiLCJBIiwiQiIsImZhbWlseSIsIndlaWdodCIsInN0cmV0Y2giLCJDIiwiRCIsIkUiLCJGIiwiRyIsIkoiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidmVuZG9yIiwiZXhlYyIsInVzZXJBZ2VudCIsImZvbnRzIiwiSyIsImZvbnQiLCJMIiwiam9pbiIsImxvYWQiLCJIIiwiRGF0ZSIsImdldFRpbWUiLCJNIiwiTiIsInkiLCJJIiwiaGlkZGVuIiwiZGlyIiwiRm9udEZhY2VPYnNlcnZlciIsInNhbnNOb3JtYWwiLCJzYW5zQm9sZCIsInNhbnNOb3JtYWxJdGFsaWMiLCJzZXJpZkJvb2siLCJzZXJpZkJvb2tJdGFsaWMiLCJzZXJpZkJvbGQiLCJzZXJpZkJvbGRJdGFsaWMiLCJzZXJpZkJsYWNrIiwic2VyaWZCbGFja0l0YWxpYyIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsInR5cGUiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwidmFsdWUiLCJnYSIsImV2ZW50IiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsImpRdWVyeSIsImhhc0NsYXNzIiwiY29weUN1cnJlbnRVUkwiLCJkdW1teSIsImhyZWYiLCJzZWxlY3QiLCJleGVjQ29tbWFuZCIsIiQiLCJjbGljayIsImRhdGEiLCJwcmV2ZW50RGVmYXVsdCIsInByaW50IiwidXJsIiwiYXR0ciIsIm9wZW4iLCJzZXR1cFByaW1hcnlOYXYiLCJwcmltYXJ5TmF2VHJhbnNpdGlvbmVyIiwicHJpbWFyeU5hdlRvZ2dsZSIsImV4cGFuZGVkIiwidXNlck5hdlRyYW5zaXRpb25lciIsInVzZXJOYXZUb2dnbGUiLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCJrZXl1cCIsImtleUNvZGUiLCJwcmltYXJ5TmF2RXhwYW5kZWQiLCJ1c2VyTmF2RXhwYW5kZWQiLCJzZWFyY2hJc1Zpc2libGUiLCJzZXR1cFNjcm9sbE5hdiIsInByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0Iiwid2lkZ2V0VGl0bGUiLCJjbG9zZXN0IiwiZmluZCIsInpvbmVUaXRsZSIsInNpZGViYXJTZWN0aW9uVGl0bGUiLCJmbiIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwidHJpbSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJmb3JtIiwicmVzdFJvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxVcmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheEZvcm1EYXRhIiwidGhhdCIsInByb3AiLCJvbiIsInZhbCIsInJlcGxhY2UiLCJwYXJlbnQiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJnZXQiLCJwYXJlbnRzIiwiZmFkZU91dCIsImJlZm9yZSIsImJ1dHRvbiIsImJ1dHRvbkZvcm0iLCJzdWJtaXR0aW5nQnV0dG9uIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRvbmUiLCJtYXAiLCJpbmRleCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsImFkZEF1dG9SZXNpemUiLCJmb3JFYWNoIiwiYm94U2l6aW5nIiwib2Zmc2V0IiwiY2xpZW50SGVpZ2h0IiwiaGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0IiwiYWpheFN0b3AiLCJjb21tZW50QXJlYSIsImF1dG9SZXNpemVUZXh0YXJlYSIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiaWQiLCJjbGlja1ZhbHVlIiwiY2F0ZWdvcnlQcmVmaXgiLCJjYXRlZ29yeVN1ZmZpeCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJpcyIsInBhcmFtcyIsImFqYXh1cmwiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJodG1sIiwibWVzc2FnZSIsImxpIiwiY2FsZW5kYXJUcmFuc2l0aW9uZXIiLCJjYWxlbmRhclZpc2libGUiLCJjYWxlbmRhckNsb3NlIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLEtBQVQsQ0FBZUMsQ0FBZixFQUFpQjtBQUFDQyxFQUFBQSxRQUFRLENBQUNDLGdCQUFULENBQTBCLFdBQTFCLEVBQXNDLFVBQVNDLENBQVQsRUFBVztBQUFDLFFBQUlDLENBQUMsR0FBQ0QsQ0FBQyxDQUFDRSxNQUFSO0FBQUEsUUFBZUMsQ0FBQyxHQUFDTixDQUFDLENBQUNJLENBQUQsQ0FBbEI7QUFBc0JFLElBQUFBLENBQUMsS0FBR0EsQ0FBQyxHQUFDLENBQUNGLENBQUMsR0FBQ0EsQ0FBQyxDQUFDRyxhQUFMLEtBQXFCUCxDQUFDLENBQUNJLENBQUQsQ0FBM0IsQ0FBRCxFQUFpQ0UsQ0FBQyxJQUFFUCxLQUFLLENBQUNTLElBQU4sQ0FBV0osQ0FBWCxFQUFhRSxDQUFiLEVBQWUsQ0FBQyxDQUFoQixDQUFwQztBQUF1RCxHQUEvSDtBQUFpSTs7QUFBQVAsS0FBSyxDQUFDUyxJQUFOLEdBQVcsVUFBU1IsQ0FBVCxFQUFXRyxDQUFYLEVBQWFDLENBQWIsRUFBZTtBQUFDLE1BQUlFLENBQUMsR0FBQyxZQUFOO0FBQW1CSCxFQUFBQSxDQUFDLEdBQUNBLENBQUMsSUFBRSxFQUFMLEVBQVEsQ0FBQ0gsQ0FBQyxDQUFDUyxPQUFGLElBQVcsVUFBU1QsQ0FBVCxFQUFXRyxDQUFYLEVBQWE7QUFBQyxhQUFTTyxDQUFULEdBQVk7QUFBQ1gsTUFBQUEsS0FBSyxDQUFDWSxJQUFOLENBQVdYLENBQVgsRUFBYSxDQUFDLENBQWQ7QUFBaUI7O0FBQUEsYUFBU1ksQ0FBVCxHQUFZO0FBQUNDLE1BQUFBLENBQUMsS0FBR0EsQ0FBQyxHQUFDLFVBQVNiLENBQVQsRUFBV0csQ0FBWCxFQUFhQyxDQUFiLEVBQWU7QUFBQyxpQkFBU0UsQ0FBVCxHQUFZO0FBQUNJLFVBQUFBLENBQUMsQ0FBQ0ksU0FBRixHQUFZLGlCQUFlRCxDQUFmLEdBQWlCRSxDQUE3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VzRHLGVBQWUsQ0FBQ3JVLFlBQWhCLENBQThCLGVBQTlCLENBQVgsSUFBOEQsS0FBN0U7QUFDQXFVLElBQUFBLGVBQWUsQ0FBQzNULFlBQWhCLENBQThCLGVBQTlCLEVBQStDLENBQUUrTSxRQUFqRDs7QUFDQSxRQUFLLFNBQVNBLFFBQWQsRUFBeUI7QUFDckIyRyxNQUFBQSxvQkFBb0IsQ0FBQzdSLGNBQXJCO0FBQ0gsS0FGRCxNQUVPO0FBQ0g2UixNQUFBQSxvQkFBb0IsQ0FBQ2xTLGNBQXJCO0FBQ0g7QUFDSixHQVREO0FBV0EsTUFBSW9TLGFBQWEsR0FBR2xXLFFBQVEsQ0FBQ29GLGFBQVQsQ0FBd0IsbUJBQXhCLENBQXBCO0FBQ0E4USxFQUFBQSxhQUFhLENBQUNqVyxnQkFBZCxDQUFnQyxPQUFoQyxFQUF5QyxVQUFVQyxDQUFWLEVBQWM7QUFDbkRBLElBQUFBLENBQUMsQ0FBQzJPLGNBQUY7QUFDQSxRQUFJUSxRQUFRLEdBQUcsV0FBVzRHLGVBQWUsQ0FBQ3JVLFlBQWhCLENBQThCLGVBQTlCLENBQVgsSUFBOEQsS0FBN0U7QUFDQXFVLElBQUFBLGVBQWUsQ0FBQzNULFlBQWhCLENBQThCLGVBQTlCLEVBQStDLENBQUUrTSxRQUFqRDs7QUFDQSxRQUFLLFNBQVNBLFFBQWQsRUFBeUI7QUFDckIyRyxNQUFBQSxvQkFBb0IsQ0FBQzdSLGNBQXJCO0FBQ0gsS0FGRCxNQUVPO0FBQ0g2UixNQUFBQSxvQkFBb0IsQ0FBQ2xTLGNBQXJCO0FBQ0g7QUFDSixHQVREO0FBVUgiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB0bGl0ZSh0KXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZSl7dmFyIGk9ZS50YXJnZXQsbj10KGkpO258fChuPShpPWkucGFyZW50RWxlbWVudCkmJnQoaSkpLG4mJnRsaXRlLnNob3coaSxuLCEwKX0pfXRsaXRlLnNob3c9ZnVuY3Rpb24odCxlLGkpe3ZhciBuPVwiZGF0YS10bGl0ZVwiO2U9ZXx8e30sKHQudG9vbHRpcHx8ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiBvKCl7dGxpdGUuaGlkZSh0LCEwKX1mdW5jdGlvbiBsKCl7cnx8KHI9ZnVuY3Rpb24odCxlLGkpe2Z1bmN0aW9uIG4oKXtvLmNsYXNzTmFtZT1cInRsaXRlIHRsaXRlLVwiK3Irczt2YXIgZT10Lm9mZnNldFRvcCxpPXQub2Zmc2V0TGVmdDtvLm9mZnNldFBhcmVudD09PXQmJihlPWk9MCk7dmFyIG49dC5vZmZzZXRXaWR0aCxsPXQub2Zmc2V0SGVpZ2h0LGQ9by5vZmZzZXRIZWlnaHQsZj1vLm9mZnNldFdpZHRoLGE9aStuLzI7by5zdHlsZS50b3A9KFwic1wiPT09cj9lLWQtMTA6XCJuXCI9PT1yP2UrbCsxMDplK2wvMi1kLzIpK1wicHhcIixvLnN0eWxlLmxlZnQ9KFwid1wiPT09cz9pOlwiZVwiPT09cz9pK24tZjpcIndcIj09PXI/aStuKzEwOlwiZVwiPT09cj9pLWYtMTA6YS1mLzIpK1wicHhcIn12YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxsPWkuZ3Jhdnx8dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRsaXRlXCIpfHxcIm5cIjtvLmlubmVySFRNTD1lLHQuYXBwZW5kQ2hpbGQobyk7dmFyIHI9bFswXXx8XCJcIixzPWxbMV18fFwiXCI7bigpO3ZhciBkPW8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuXCJzXCI9PT1yJiZkLnRvcDwwPyhyPVwiblwiLG4oKSk6XCJuXCI9PT1yJiZkLmJvdHRvbT53aW5kb3cuaW5uZXJIZWlnaHQ/KHI9XCJzXCIsbigpKTpcImVcIj09PXImJmQubGVmdDwwPyhyPVwid1wiLG4oKSk6XCJ3XCI9PT1yJiZkLnJpZ2h0PndpbmRvdy5pbm5lcldpZHRoJiYocj1cImVcIixuKCkpLG8uY2xhc3NOYW1lKz1cIiB0bGl0ZS12aXNpYmxlXCIsb30odCxkLGUpKX12YXIgcixzLGQ7cmV0dXJuIHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLG8pLHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIixvKSx0LnRvb2x0aXA9e3Nob3c6ZnVuY3Rpb24oKXtkPXQudGl0bGV8fHQuZ2V0QXR0cmlidXRlKG4pfHxkLHQudGl0bGU9XCJcIix0LnNldEF0dHJpYnV0ZShuLFwiXCIpLGQmJiFzJiYocz1zZXRUaW1lb3V0KGwsaT8xNTA6MSkpfSxoaWRlOmZ1bmN0aW9uKHQpe2lmKGk9PT10KXtzPWNsZWFyVGltZW91dChzKTt2YXIgZT1yJiZyLnBhcmVudE5vZGU7ZSYmZS5yZW1vdmVDaGlsZChyKSxyPXZvaWQgMH19fX0odCxlKSkuc2hvdygpfSx0bGl0ZS5oaWRlPWZ1bmN0aW9uKHQsZSl7dC50b29sdGlwJiZ0LnRvb2x0aXAuaGlkZShlKX0sXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz10bGl0ZSk7IiwiLyoqIFxuICogTGlicmFyeSBjb2RlXG4gKiBVc2luZyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9AY2xvdWRmb3VyL3RyYW5zaXRpb24taGlkZGVuLWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCh7XG4gIGVsZW1lbnQsXG4gIHZpc2libGVDbGFzcyxcbiAgd2FpdE1vZGUgPSAndHJhbnNpdGlvbmVuZCcsXG4gIHRpbWVvdXREdXJhdGlvbixcbiAgaGlkZU1vZGUgPSAnaGlkZGVuJyxcbiAgZGlzcGxheVZhbHVlID0gJ2Jsb2NrJ1xufSkge1xuICBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0JyAmJiB0eXBlb2YgdGltZW91dER1cmF0aW9uICE9PSAnbnVtYmVyJykge1xuICAgIGNvbnNvbGUuZXJyb3IoYFxuICAgICAgV2hlbiBjYWxsaW5nIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50IHdpdGggd2FpdE1vZGUgc2V0IHRvIHRpbWVvdXQsXG4gICAgICB5b3UgbXVzdCBwYXNzIGluIGEgbnVtYmVyIGZvciB0aW1lb3V0RHVyYXRpb24uXG4gICAgYCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEb24ndCB3YWl0IGZvciBleGl0IHRyYW5zaXRpb25zIGlmIGEgdXNlciBwcmVmZXJzIHJlZHVjZWQgbW90aW9uLlxuICAvLyBJZGVhbGx5IHRyYW5zaXRpb25zIHdpbGwgYmUgZGlzYWJsZWQgaW4gQ1NTLCB3aGljaCBtZWFucyB3ZSBzaG91bGQgbm90IHdhaXRcbiAgLy8gYmVmb3JlIGFkZGluZyBgaGlkZGVuYC5cbiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKScpLm1hdGNoZXMpIHtcbiAgICB3YWl0TW9kZSA9ICdpbW1lZGlhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGxpc3RlbmVyIHRvIGFkZCBgaGlkZGVuYCBhZnRlciBvdXIgYW5pbWF0aW9ucyBjb21wbGV0ZS5cbiAgICogVGhpcyBsaXN0ZW5lciB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgY29tcGxldGluZy5cbiAgICovXG4gIGNvbnN0IGxpc3RlbmVyID0gZSA9PiB7XG4gICAgLy8gQ29uZmlybSBgdHJhbnNpdGlvbmVuZGAgd2FzIGNhbGxlZCBvbiAgb3VyIGBlbGVtZW50YCBhbmQgZGlkbid0IGJ1YmJsZVxuICAgIC8vIHVwIGZyb20gYSBjaGlsZCBlbGVtZW50LlxuICAgIGlmIChlLnRhcmdldCA9PT0gZWxlbWVudCkge1xuICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheVZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvblNob3coKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgbGlzdGVuZXIgc2hvdWxkbid0IGJlIGhlcmUgYnV0IGlmIHNvbWVvbmUgc3BhbXMgdGhlIHRvZ2dsZVxuICAgICAgICogb3ZlciBhbmQgb3ZlciByZWFsbHkgZmFzdCBpdCBjYW4gaW5jb3JyZWN0bHkgc3RpY2sgYXJvdW5kLlxuICAgICAgICogV2UgcmVtb3ZlIGl0IGp1c3QgdG8gYmUgc2FmZS5cbiAgICAgICAqL1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFNpbWlsYXJseSwgd2UnbGwgY2xlYXIgdGhlIHRpbWVvdXQgaW4gY2FzZSBpdCdzIHN0aWxsIGhhbmdpbmcgYXJvdW5kLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIC8qKlxuICAgICAgICogRm9yY2UgYSBicm93c2VyIHJlLXBhaW50IHNvIHRoZSBicm93c2VyIHdpbGwgcmVhbGl6ZSB0aGVcbiAgICAgICAqIGVsZW1lbnQgaXMgbm8gbG9uZ2VyIGBoaWRkZW5gIGFuZCBhbGxvdyB0cmFuc2l0aW9ucy5cbiAgICAgICAqL1xuICAgICAgY29uc3QgcmVmbG93ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIaWRlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvbkhpZGUoKSB7XG4gICAgICBpZiAod2FpdE1vZGUgPT09ICd0cmFuc2l0aW9uZW5kJykge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgICB9IGVsc2UgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICAgIH0sIHRpbWVvdXREdXJhdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoaXMgY2xhc3MgdG8gdHJpZ2dlciBvdXIgYW5pbWF0aW9uXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSBlbGVtZW50J3MgdmlzaWJpbGl0eVxuICAgICAqL1xuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUZWxsIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaGlkZGVuIG9yIG5vdC5cbiAgICAgKi9cbiAgICBpc0hpZGRlbigpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGhpZGRlbiBhdHRyaWJ1dGUgZG9lcyBub3QgcmVxdWlyZSBhIHZhbHVlLiBTaW5jZSBhbiBlbXB0eSBzdHJpbmcgaXNcbiAgICAgICAqIGZhbHN5LCBidXQgc2hvd3MgdGhlIHByZXNlbmNlIG9mIGFuIGF0dHJpYnV0ZSB3ZSBjb21wYXJlIHRvIGBudWxsYFxuICAgICAgICovXG4gICAgICBjb25zdCBoYXNIaWRkZW5BdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaGlkZGVuJykgIT09IG51bGw7XG5cbiAgICAgIGNvbnN0IGlzRGlzcGxheU5vbmUgPSBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJztcblxuICAgICAgY29uc3QgaGFzVmlzaWJsZUNsYXNzID0gWy4uLmVsZW1lbnQuY2xhc3NMaXN0XS5pbmNsdWRlcyh2aXNpYmxlQ2xhc3MpO1xuXG4gICAgICByZXR1cm4gaGFzSGlkZGVuQXR0cmlidXRlIHx8IGlzRGlzcGxheU5vbmUgfHwgIWhhc1Zpc2libGVDbGFzcztcbiAgICB9LFxuXG4gICAgLy8gQSBwbGFjZWhvbGRlciBmb3Igb3VyIGB0aW1lb3V0YFxuICAgIHRpbWVvdXQ6IG51bGxcbiAgfTtcbn0iLCIvKipcbiAgUHJpb3JpdHkrIGhvcml6b250YWwgc2Nyb2xsaW5nIG1lbnUuXG5cbiAgQHBhcmFtIHtPYmplY3R9IG9iamVjdCAtIENvbnRhaW5lciBmb3IgYWxsIG9wdGlvbnMuXG4gICAgQHBhcmFtIHtzdHJpbmcgfHwgRE9NIG5vZGV9IHNlbGVjdG9yIC0gRWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gbmF2U2VsZWN0b3IgLSBOYXYgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gY29udGVudFNlbGVjdG9yIC0gQ29udGVudCBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBpdGVtU2VsZWN0b3IgLSBJdGVtcyBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uTGVmdFNlbGVjdG9yIC0gTGVmdCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvblJpZ2h0U2VsZWN0b3IgLSBSaWdodCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtpbnRlZ2VyIHx8IHN0cmluZ30gc2Nyb2xsU3RlcCAtIEFtb3VudCB0byBzY3JvbGwgb24gYnV0dG9uIGNsaWNrLiAnYXZlcmFnZScgZ2V0cyB0aGUgYXZlcmFnZSBsaW5rIHdpZHRoLlxuKi9cblxuY29uc3QgUHJpb3JpdHlOYXZTY3JvbGxlciA9IGZ1bmN0aW9uKHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlcicsXG4gICAgbmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItbmF2JyxcbiAgICBjb250ZW50U2VsZWN0b3I6IGNvbnRlbnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWNvbnRlbnQnLFxuICAgIGl0ZW1TZWxlY3RvcjogaXRlbVNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItaXRlbScsXG4gICAgYnV0dG9uTGVmdFNlbGVjdG9yOiBidXR0b25MZWZ0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuICAgIGJ1dHRvblJpZ2h0U2VsZWN0b3I6IGJ1dHRvblJpZ2h0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0JyxcbiAgICBzY3JvbGxTdGVwOiBzY3JvbGxTdGVwID0gODBcbiAgfSA9IHt9KSB7XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXIgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiBzZWxlY3RvcjtcblxuICBjb25zdCB2YWxpZGF0ZVNjcm9sbFN0ZXAgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIoc2Nyb2xsU3RlcCkgfHwgc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnO1xuICB9XG5cbiAgaWYgKG5hdlNjcm9sbGVyID09PSB1bmRlZmluZWQgfHwgbmF2U2Nyb2xsZXIgPT09IG51bGwgfHwgIXZhbGlkYXRlU2Nyb2xsU3RlcCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGVyZSBpcyBzb21ldGhpbmcgd3JvbmcsIGNoZWNrIHlvdXIgb3B0aW9ucy4nKTtcbiAgfVxuXG4gIGNvbnN0IG5hdlNjcm9sbGVyTmF2ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihuYXZTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoY29udGVudFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMgPSBuYXZTY3JvbGxlckNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChpdGVtU2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckxlZnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvbkxlZnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyUmlnaHQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvblJpZ2h0U2VsZWN0b3IpO1xuXG4gIGxldCBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZUxlZnQgPSAwO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSAwO1xuICBsZXQgc2Nyb2xsaW5nRGlyZWN0aW9uID0gJyc7XG4gIGxldCBzY3JvbGxPdmVyZmxvdyA9ICcnO1xuICBsZXQgdGltZW91dDtcblxuXG4gIC8vIFNldHMgb3ZlcmZsb3cgYW5kIHRvZ2dsZSBidXR0b25zIGFjY29yZGluZ2x5XG4gIGNvbnN0IHNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgc2Nyb2xsT3ZlcmZsb3cgPSBnZXRPdmVyZmxvdygpO1xuICAgIHRvZ2dsZUJ1dHRvbnMoc2Nyb2xsT3ZlcmZsb3cpO1xuICAgIGNhbGN1bGF0ZVNjcm9sbFN0ZXAoKTtcbiAgfVxuXG5cbiAgLy8gRGVib3VuY2Ugc2V0dGluZyB0aGUgb3ZlcmZsb3cgd2l0aCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgY29uc3QgcmVxdWVzdFNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVvdXQpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aW1lb3V0KTtcblxuICAgIHRpbWVvdXQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHNldE92ZXJmbG93KCk7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8vIEdldHMgdGhlIG92ZXJmbG93IGF2YWlsYWJsZSBvbiB0aGUgbmF2IHNjcm9sbGVyXG4gIGNvbnN0IGdldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNjcm9sbFdpZHRoID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGg7XG4gICAgbGV0IHNjcm9sbFZpZXdwb3J0ID0gbmF2U2Nyb2xsZXJOYXYuY2xpZW50V2lkdGg7XG4gICAgbGV0IHNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0O1xuXG4gICAgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSBzY3JvbGxXaWR0aCAtIChzY3JvbGxWaWV3cG9ydCArIHNjcm9sbExlZnQpO1xuXG4gICAgLy8gMSBpbnN0ZWFkIG9mIDAgdG8gY29tcGVuc2F0ZSBmb3IgbnVtYmVyIHJvdW5kaW5nXG4gICAgbGV0IHNjcm9sbExlZnRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVMZWZ0ID4gMTtcbiAgICBsZXQgc2Nyb2xsUmlnaHRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVSaWdodCA+IDE7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhzY3JvbGxXaWR0aCwgc2Nyb2xsVmlld3BvcnQsIHNjcm9sbEF2YWlsYWJsZUxlZnQsIHNjcm9sbEF2YWlsYWJsZVJpZ2h0KTtcblxuICAgIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uICYmIHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2JvdGgnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2xlZnQnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuICdub25lJztcbiAgICB9XG5cbiAgfVxuXG5cbiAgLy8gQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHN0ZXAgYmFzZWQgb24gdGhlIHdpZHRoIG9mIHRoZSBzY3JvbGxlciBhbmQgdGhlIG51bWJlciBvZiBsaW5rc1xuICBjb25zdCBjYWxjdWxhdGVTY3JvbGxTdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJykge1xuICAgICAgbGV0IHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGggLSAocGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctbGVmdCcpKSArIHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpKTtcblxuICAgICAgbGV0IHNjcm9sbFN0ZXBBdmVyYWdlID0gTWF0aC5mbG9vcihzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyAvIG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zLmxlbmd0aCk7XG5cbiAgICAgIHNjcm9sbFN0ZXAgPSBzY3JvbGxTdGVwQXZlcmFnZTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIE1vdmUgdGhlIHNjcm9sbGVyIHdpdGggYSB0cmFuc2Zvcm1cbiAgY29uc3QgbW92ZVNjcm9sbGVyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG5cbiAgICBpZiAoc2Nyb2xsaW5nID09PSB0cnVlIHx8IChzY3JvbGxPdmVyZmxvdyAhPT0gZGlyZWN0aW9uICYmIHNjcm9sbE92ZXJmbG93ICE9PSAnYm90aCcpKSByZXR1cm47XG5cbiAgICBsZXQgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxTdGVwO1xuICAgIGxldCBzY3JvbGxBdmFpbGFibGUgPSBkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IHNjcm9sbEF2YWlsYWJsZUxlZnQgOiBzY3JvbGxBdmFpbGFibGVSaWdodDtcblxuICAgIC8vIElmIHRoZXJlIHdpbGwgYmUgbGVzcyB0aGFuIDI1JSBvZiB0aGUgbGFzdCBzdGVwIHZpc2libGUgdGhlbiBzY3JvbGwgdG8gdGhlIGVuZFxuICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCAoc2Nyb2xsU3RlcCAqIDEuNzUpKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbEF2YWlsYWJsZTtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSAqPSAtMTtcblxuICAgICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IHNjcm9sbFN0ZXApIHtcbiAgICAgICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NuYXAtYWxpZ24tZW5kJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIHNjcm9sbERpc3RhbmNlICsgJ3B4KSc7XG5cbiAgICBzY3JvbGxpbmdEaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgc2Nyb2xsaW5nID0gdHJ1ZTtcbiAgfVxuXG5cbiAgLy8gU2V0IHRoZSBzY3JvbGxlciBwb3NpdGlvbiBhbmQgcmVtb3ZlcyB0cmFuc2Zvcm0sIGNhbGxlZCBhZnRlciBtb3ZlU2Nyb2xsZXIoKSBpbiB0aGUgdHJhbnNpdGlvbmVuZCBldmVudFxuICBjb25zdCBzZXRTY3JvbGxlclBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50LCBudWxsKTtcbiAgICB2YXIgdHJhbnNmb3JtID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJyk7XG4gICAgdmFyIHRyYW5zZm9ybVZhbHVlID0gTWF0aC5hYnMocGFyc2VJbnQodHJhbnNmb3JtLnNwbGl0KCcsJylbNF0pIHx8IDApO1xuXG4gICAgaWYgKHNjcm9sbGluZ0RpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICB0cmFuc2Zvcm1WYWx1ZSAqPSAtMTtcbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbiAgICBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCArIHRyYW5zZm9ybVZhbHVlO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJywgJ3NuYXAtYWxpZ24tZW5kJyk7XG5cbiAgICBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgfVxuXG5cbiAgLy8gVG9nZ2xlIGJ1dHRvbnMgZGVwZW5kaW5nIG9uIG92ZXJmbG93XG4gIGNvbnN0IHRvZ2dsZUJ1dHRvbnMgPSBmdW5jdGlvbihvdmVyZmxvdykge1xuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAnbGVmdCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdyaWdodCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH1cblxuXG4gIGNvbnN0IGluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgIHNldE92ZXJmbG93KCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlck5hdi5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgc2V0U2Nyb2xsZXJQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJMZWZ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdsZWZ0Jyk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlclJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdyaWdodCcpO1xuICAgIH0pO1xuXG4gIH07XG5cblxuICAvLyBTZWxmIGluaXRcbiAgaW5pdCgpO1xuXG5cbiAgLy8gUmV2ZWFsIEFQSVxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcblxufTtcblxuLy9leHBvcnQgZGVmYXVsdCBQcmlvcml0eU5hdlNjcm9sbGVyO1xuIiwiLyoqXG4gKiBEbyB0aGVzZSB0aGluZ3MgYXMgcXVpY2tseSBhcyBwb3NzaWJsZTsgd2UgbWlnaHQgaGF2ZSBDU1Mgb3IgZWFybHkgc2NyaXB0cyB0aGF0IHJlcXVpcmUgb24gaXRcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ25vLWpzJyApO1xuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdqcycgKTtcbiIsIi8qKlxuICogVGhpcyBsb2FkcyBvdXIgZm9udHMgYW5kIGFkZHMgY2xhc3NlcyB0byB0aGUgSFRNTCBlbGVtZW50XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBGb250IEZhY2UgT2JzZXJ2ZXIgdjIuMS4wXG4gKlxuICovXG5cbi8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5pZiAoIHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgJiYgc2Vzc2lvblN0b3JhZ2Uuc2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsICkge1xuXHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkIHNhbnMtZm9udHMtbG9hZGVkJztcbn0gZWxzZSB7XG5cdC8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4xLjAgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oIGZ1bmN0aW9uKCkge1xuXHRcdCd1c2Ugc3RyaWN0Jzt2YXIgZixcblx0XHRcdGcgPSBbXTtmdW5jdGlvbiBsKCBhICkge1xuXHRcdFx0Zy5wdXNoKCBhICk7MSA9PSBnLmxlbmd0aCAmJiBmKCk7XG5cdFx0fSBmdW5jdGlvbiBtKCkge1xuXHRcdFx0Zm9yICggO2cubGVuZ3RoOyApIHtcblx0XHRcdFx0Z1swXSgpLCBnLnNoaWZ0KCk7XG5cdFx0XHR9XG5cdFx0fWYgPSBmdW5jdGlvbigpIHtcblx0XHRcdHNldFRpbWVvdXQoIG0gKTtcblx0XHR9O2Z1bmN0aW9uIG4oIGEgKSB7XG5cdFx0XHR0aGlzLmEgPSBwO3RoaXMuYiA9IHZvaWQgMDt0aGlzLmYgPSBbXTt2YXIgYiA9IHRoaXM7dHJ5IHtcblx0XHRcdFx0YSggZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0cSggYiwgYSApO1xuXHRcdFx0XHR9LCBmdW5jdGlvbiggYSApIHtcblx0XHRcdFx0XHRyKCBiLCBhICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gY2F0Y2ggKCBjICkge1xuXHRcdFx0XHRyKCBiLCBjICk7XG5cdFx0XHR9XG5cdFx0fSB2YXIgcCA9IDI7ZnVuY3Rpb24gdCggYSApIHtcblx0XHRcdHJldHVybiBuZXcgbiggZnVuY3Rpb24oIGIsIGMgKSB7XG5cdFx0XHRcdGMoIGEgKTtcblx0XHRcdH0gKTtcblx0XHR9IGZ1bmN0aW9uIHUoIGEgKSB7XG5cdFx0XHRyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBiICkge1xuXHRcdFx0XHRiKCBhICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBmdW5jdGlvbiBxKCBhLCBiICkge1xuXHRcdFx0aWYgKCBhLmEgPT0gcCApIHtcblx0XHRcdFx0aWYgKCBiID09IGEgKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcjtcblx0XHRcdFx0fSB2YXIgYyA9ICEgMTt0cnkge1xuXHRcdFx0XHRcdHZhciBkID0gYiAmJiBiLnRoZW47aWYgKCBudWxsICE9IGIgJiYgJ29iamVjdCcgPT09IHR5cGVvZiBiICYmICdmdW5jdGlvbicgPT09IHR5cGVvZiBkICkge1xuXHRcdFx0XHRcdFx0ZC5jYWxsKCBiLCBmdW5jdGlvbiggYiApIHtcblx0XHRcdFx0XHRcdFx0YyB8fCBxKCBhLCBiICk7YyA9ICEgMDtcblx0XHRcdFx0XHRcdH0sIGZ1bmN0aW9uKCBiICkge1xuXHRcdFx0XHRcdFx0XHRjIHx8IHIoIGEsIGIgKTtjID0gISAwO1xuXHRcdFx0XHRcdFx0fSApO3JldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKCBlICkge1xuXHRcdFx0XHRcdGMgfHwgciggYSwgZSApO3JldHVybjtcblx0XHRcdFx0fWEuYSA9IDA7YS5iID0gYjt2KCBhICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHIoIGEsIGIgKSB7XG5cdFx0XHRpZiAoIGEuYSA9PSBwICkge1xuXHRcdFx0XHRpZiAoIGIgPT0gYSApIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yO1xuXHRcdFx0XHR9YS5hID0gMTthLmIgPSBiO3YoIGEgKTtcblx0XHRcdH1cblx0XHR9IGZ1bmN0aW9uIHYoIGEgKSB7XG5cdFx0XHRsKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBhLmEgIT0gcCApIHtcblx0XHRcdFx0XHRmb3IgKCA7YS5mLmxlbmd0aDsgKSB7XG5cdFx0XHRcdFx0XHR2YXIgYiA9IGEuZi5zaGlmdCgpLFxuXHRcdFx0XHRcdFx0XHRjID0gYlswXSxcblx0XHRcdFx0XHRcdFx0ZCA9IGJbMV0sXG5cdFx0XHRcdFx0XHRcdGUgPSBiWzJdLFxuXHRcdFx0XHRcdFx0XHRiID0gYlszXTt0cnkge1xuXHRcdFx0XHRcdFx0XHQwID09IGEuYSA/ICdmdW5jdGlvbicgPT09IHR5cGVvZiBjID8gZSggYy5jYWxsKCB2b2lkIDAsIGEuYiApICkgOiBlKCBhLmIgKSA6IDEgPT0gYS5hICYmICggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGQgPyBlKCBkLmNhbGwoIHZvaWQgMCwgYS5iICkgKSA6IGIoIGEuYiApICk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoICggaCApIHtcblx0XHRcdFx0XHRcdFx0YiggaCApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1uLnByb3RvdHlwZS5nID0gZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jKCB2b2lkIDAsIGEgKTtcblx0XHR9O24ucHJvdG90eXBlLmMgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdHZhciBjID0gdGhpcztyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBkLCBlICkge1xuXHRcdFx0XHRjLmYucHVzaCggWyBhLCBiLCBkLCBlIF0gKTt2KCBjICk7XG5cdFx0XHR9ICk7XG5cdFx0fTtcblx0XHRmdW5jdGlvbiB3KCBhICkge1xuXHRcdFx0cmV0dXJuIG5ldyBuKCBmdW5jdGlvbiggYiwgYyApIHtcblx0XHRcdFx0ZnVuY3Rpb24gZCggYyApIHtcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGQgKSB7XG5cdFx0XHRcdFx0XHRoW2NdID0gZDtlICs9IDE7ZSA9PSBhLmxlbmd0aCAmJiBiKCBoICk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fSB2YXIgZSA9IDAsXG5cdFx0XHRcdFx0aCA9IFtdOzAgPT0gYS5sZW5ndGggJiYgYiggaCApO2ZvciAoIHZhciBrID0gMDtrIDwgYS5sZW5ndGg7ayArPSAxICkge1xuXHRcdFx0XHRcdHUoIGFba10gKS5jKCBkKCBrICksIGMgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0gZnVuY3Rpb24geCggYSApIHtcblx0XHRcdHJldHVybiBuZXcgbiggZnVuY3Rpb24oIGIsIGMgKSB7XG5cdFx0XHRcdGZvciAoIHZhciBkID0gMDtkIDwgYS5sZW5ndGg7ZCArPSAxICkge1xuXHRcdFx0XHRcdHUoIGFbZF0gKS5jKCBiLCBjICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9d2luZG93LlByb21pc2UgfHwgKCB3aW5kb3cuUHJvbWlzZSA9IG4sIHdpbmRvdy5Qcm9taXNlLnJlc29sdmUgPSB1LCB3aW5kb3cuUHJvbWlzZS5yZWplY3QgPSB0LCB3aW5kb3cuUHJvbWlzZS5yYWNlID0geCwgd2luZG93LlByb21pc2UuYWxsID0gdywgd2luZG93LlByb21pc2UucHJvdG90eXBlLnRoZW4gPSBuLnByb3RvdHlwZS5jLCB3aW5kb3cuUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2ggPSBuLnByb3RvdHlwZS5nICk7XG5cdH0oKSApO1xuXG5cdCggZnVuY3Rpb24oKSB7XG5cdFx0ZnVuY3Rpb24gbCggYSwgYiApIHtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPyBhLmFkZEV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCBiLCAhIDEgKSA6IGEuYXR0YWNoRXZlbnQoICdzY3JvbGwnLCBiICk7XG5cdFx0fSBmdW5jdGlvbiBtKCBhICkge1xuXHRcdFx0ZG9jdW1lbnQuYm9keSA/IGEoKSA6IGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uIGMoKSB7XG5cdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgYyApO2EoKTtcblx0XHRcdH0gKSA6IGRvY3VtZW50LmF0dGFjaEV2ZW50KCAnb25yZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24gaygpIHtcblx0XHRcdFx0aWYgKCAnaW50ZXJhY3RpdmUnID09IGRvY3VtZW50LnJlYWR5U3RhdGUgfHwgJ2NvbXBsZXRlJyA9PSBkb2N1bWVudC5yZWFkeVN0YXRlICkge1xuXHRcdFx0XHRcdGRvY3VtZW50LmRldGFjaEV2ZW50KCAnb25yZWFkeXN0YXRlY2hhbmdlJywgayApLCBhKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9IGZ1bmN0aW9uIHQoIGEgKSB7XG5cdFx0XHR0aGlzLmEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO3RoaXMuYS5zZXRBdHRyaWJ1dGUoICdhcmlhLWhpZGRlbicsICd0cnVlJyApO3RoaXMuYS5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIGEgKSApO3RoaXMuYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuZyA9IC0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0ID0gJ21heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4Oyc7dGhpcy5jLnN0eWxlLmNzc1RleHQgPSAnbWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7Jztcblx0XHRcdHRoaXMuZi5zdHlsZS5jc3NUZXh0ID0gJ21heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4Oyc7dGhpcy5oLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTsnO3RoaXMuYi5hcHBlbmRDaGlsZCggdGhpcy5oICk7dGhpcy5jLmFwcGVuZENoaWxkKCB0aGlzLmYgKTt0aGlzLmEuYXBwZW5kQ2hpbGQoIHRoaXMuYiApO3RoaXMuYS5hcHBlbmRDaGlsZCggdGhpcy5jICk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHUoIGEsIGIgKSB7XG5cdFx0XHRhLmEuc3R5bGUuY3NzVGV4dCA9ICdtYXgtd2lkdGg6bm9uZTttaW4td2lkdGg6MjBweDttaW4taGVpZ2h0OjIwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmF1dG87bWFyZ2luOjA7cGFkZGluZzowO3RvcDotOTk5cHg7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQtc3ludGhlc2lzOm5vbmU7Zm9udDonICsgYiArICc7Jztcblx0XHR9IGZ1bmN0aW9uIHooIGEgKSB7XG5cdFx0XHR2YXIgYiA9IGEuYS5vZmZzZXRXaWR0aCxcblx0XHRcdFx0YyA9IGIgKyAxMDA7YS5mLnN0eWxlLndpZHRoID0gYyArICdweCc7YS5jLnNjcm9sbExlZnQgPSBjO2EuYi5zY3JvbGxMZWZ0ID0gYS5iLnNjcm9sbFdpZHRoICsgMTAwO3JldHVybiBhLmcgIT09IGIgPyAoIGEuZyA9IGIsICEgMCApIDogISAxO1xuXHRcdH0gZnVuY3Rpb24gQSggYSwgYiApIHtcblx0XHRcdGZ1bmN0aW9uIGMoKSB7XG5cdFx0XHRcdHZhciBhID0gazt6KCBhICkgJiYgYS5hLnBhcmVudE5vZGUgJiYgYiggYS5nICk7XG5cdFx0XHR9IHZhciBrID0gYTtsKCBhLmIsIGMgKTtsKCBhLmMsIGMgKTt6KCBhICk7XG5cdFx0fSBmdW5jdGlvbiBCKCBhLCBiICkge1xuXHRcdFx0dmFyIGMgPSBiIHx8IHt9O3RoaXMuZmFtaWx5ID0gYTt0aGlzLnN0eWxlID0gYy5zdHlsZSB8fCAnbm9ybWFsJzt0aGlzLndlaWdodCA9IGMud2VpZ2h0IHx8ICdub3JtYWwnO3RoaXMuc3RyZXRjaCA9IGMuc3RyZXRjaCB8fCAnbm9ybWFsJztcblx0XHR9IHZhciBDID0gbnVsbCxcblx0XHRcdEQgPSBudWxsLFxuXHRcdFx0RSA9IG51bGwsXG5cdFx0XHRGID0gbnVsbDtmdW5jdGlvbiBHKCkge1xuXHRcdFx0aWYgKCBudWxsID09PSBEICkge1xuXHRcdFx0XHRpZiAoIEooKSAmJiAvQXBwbGUvLnRlc3QoIHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yICkgKSB7XG5cdFx0XHRcdFx0dmFyIGEgPSAvQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKSg/OlxcLihbMC05XSspKS8uZXhlYyggd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQgKTtEID0gISEgYSAmJiA2MDMgPiBwYXJzZUludCggYVsxXSwgMTAgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHREID0gISAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9IHJldHVybiBEO1xuXHRcdH0gZnVuY3Rpb24gSigpIHtcblx0XHRcdG51bGwgPT09IEYgJiYgKCBGID0gISEgZG9jdW1lbnQuZm9udHMgKTtyZXR1cm4gRjtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gSygpIHtcblx0XHRcdGlmICggbnVsbCA9PT0gRSApIHtcblx0XHRcdFx0dmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO3RyeSB7XG5cdFx0XHRcdFx0YS5zdHlsZS5mb250ID0gJ2NvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmJztcblx0XHRcdFx0fSBjYXRjaCAoIGIgKSB7fUUgPSAnJyAhPT0gYS5zdHlsZS5mb250O1xuXHRcdFx0fSByZXR1cm4gRTtcblx0XHR9IGZ1bmN0aW9uIEwoIGEsIGIgKSB7XG5cdFx0XHRyZXR1cm4gWyBhLnN0eWxlLCBhLndlaWdodCwgSygpID8gYS5zdHJldGNoIDogJycsICcxMDBweCcsIGIgXS5qb2luKCAnICcgKTtcblx0XHR9XG5cdFx0Qi5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0dmFyIGMgPSB0aGlzLFxuXHRcdFx0XHRrID0gYSB8fCAnQkVTYnN3eScsXG5cdFx0XHRcdHIgPSAwLFxuXHRcdFx0XHRuID0gYiB8fCAzRTMsXG5cdFx0XHRcdEggPSAoIG5ldyBEYXRlICkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZSggZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHRcdGlmICggSigpICYmICEgRygpICkge1xuXHRcdFx0XHRcdHZhciBNID0gbmV3IFByb21pc2UoIGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiBlKCkge1xuXHRcdFx0XHRcdFx0XHRcdCggbmV3IERhdGUgKS5nZXRUaW1lKCkgLSBIID49IG4gPyBiKCBFcnJvciggJycgKyBuICsgJ21zIHRpbWVvdXQgZXhjZWVkZWQnICkgKSA6IGRvY3VtZW50LmZvbnRzLmxvYWQoIEwoIGMsICdcIicgKyBjLmZhbWlseSArICdcIicgKSwgayApLnRoZW4oIGZ1bmN0aW9uKCBjICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0MSA8PSBjLmxlbmd0aCA/IGEoKSA6IHNldFRpbWVvdXQoIGUsIDI1ICk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgYiApO1xuXHRcdFx0XHRcdFx0XHR9ZSgpO1xuXHRcdFx0XHRcdFx0fSApLFxuXHRcdFx0XHRcdFx0TiA9IG5ldyBQcm9taXNlKCBmdW5jdGlvbiggYSwgYyApIHtcblx0XHRcdFx0XHRcdFx0ciA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdGMoIEVycm9yKCAnJyArIG4gKyAnbXMgdGltZW91dCBleGNlZWRlZCcgKSApO1xuXHRcdFx0XHRcdFx0XHR9LCBuICk7XG5cdFx0XHRcdFx0XHR9ICk7UHJvbWlzZS5yYWNlKCBbIE4sIE0gXSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCByICk7YSggYyApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YiApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG0oIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gdigpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGI7aWYgKCBiID0gLTEgIT0gZiAmJiAtMSAhPSBnIHx8IC0xICE9IGYgJiYgLTEgIT0gaCB8fCAtMSAhPSBnICYmIC0xICE9IGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0KCBiID0gZiAhPSBnICYmIGYgIT0gaCAmJiBnICE9IGggKSB8fCAoIG51bGwgPT09IEMgJiYgKCBiID0gL0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMoIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50ICksIEMgPSAhISBiICYmICggNTM2ID4gcGFyc2VJbnQoIGJbMV0sIDEwICkgfHwgNTM2ID09PSBwYXJzZUludCggYlsxXSwgMTAgKSAmJiAxMSA+PSBwYXJzZUludCggYlsyXSwgMTAgKSApICksIGIgPSBDICYmICggZiA9PSB3ICYmIGcgPT0gdyAmJiBoID09IHcgfHwgZiA9PSB4ICYmIGcgPT0geCAmJiBoID09IHggfHwgZiA9PSB5ICYmIGcgPT0geSAmJiBoID09IHkgKSApLCBiID0gISBiO1xuXHRcdFx0XHRcdFx0XHR9YiAmJiAoIGQucGFyZW50Tm9kZSAmJiBkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIGQgKSwgY2xlYXJUaW1lb3V0KCByICksIGEoIGMgKSApO1xuXHRcdFx0XHRcdFx0fSBmdW5jdGlvbiBJKCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICggbmV3IERhdGUgKS5nZXRUaW1lKCkgLSBIID49IG4gKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZC5wYXJlbnROb2RlICYmIGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZCApLCBiKCBFcnJvciggJycgK1xuXHRuICsgJ21zIHRpbWVvdXQgZXhjZWVkZWQnICkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgYSA9IGRvY3VtZW50LmhpZGRlbjtpZiAoICEgMCA9PT0gYSB8fCB2b2lkIDAgPT09IGEgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmID0gZS5hLm9mZnNldFdpZHRoLCBnID0gcC5hLm9mZnNldFdpZHRoLCBoID0gcS5hLm9mZnNldFdpZHRoLCB2KCk7XG5cdFx0XHRcdFx0XHRcdFx0fXIgPSBzZXRUaW1lb3V0KCBJLCA1MCApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IHZhciBlID0gbmV3IHQoIGsgKSxcblx0XHRcdFx0XHRcdFx0cCA9IG5ldyB0KCBrICksXG5cdFx0XHRcdFx0XHRcdHEgPSBuZXcgdCggayApLFxuXHRcdFx0XHRcdFx0XHRmID0gLTEsXG5cdFx0XHRcdFx0XHRcdGcgPSAtMSxcblx0XHRcdFx0XHRcdFx0aCA9IC0xLFxuXHRcdFx0XHRcdFx0XHR3ID0gLTEsXG5cdFx0XHRcdFx0XHRcdHggPSAtMSxcblx0XHRcdFx0XHRcdFx0eSA9IC0xLFxuXHRcdFx0XHRcdFx0XHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtkLmRpciA9ICdsdHInO3UoIGUsIEwoIGMsICdzYW5zLXNlcmlmJyApICk7dSggcCwgTCggYywgJ3NlcmlmJyApICk7dSggcSwgTCggYywgJ21vbm9zcGFjZScgKSApO2QuYXBwZW5kQ2hpbGQoIGUuYSApO2QuYXBwZW5kQ2hpbGQoIHAuYSApO2QuYXBwZW5kQ2hpbGQoIHEuYSApO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGQgKTt3ID0gZS5hLm9mZnNldFdpZHRoO3ggPSBwLmEub2Zmc2V0V2lkdGg7eSA9IHEuYS5vZmZzZXRXaWR0aDtJKCk7QSggZSwgZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0XHRcdGYgPSBhO3YoKTtcblx0XHRcdFx0XHRcdH0gKTt1KCBlLFxuXHRcdFx0XHRcdFx0XHRMKCBjLCAnXCInICsgYy5mYW1pbHkgKyAnXCIsc2Fucy1zZXJpZicgKSApO0EoIHAsIGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHRcdFx0XHRnID0gYTt2KCk7XG5cdFx0XHRcdFx0XHR9ICk7dSggcCwgTCggYywgJ1wiJyArIGMuZmFtaWx5ICsgJ1wiLHNlcmlmJyApICk7QSggcSwgZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0XHRcdGggPSBhO3YoKTtcblx0XHRcdFx0XHRcdH0gKTt1KCBxLCBMKCBjLCAnXCInICsgYy5mYW1pbHkgKyAnXCIsbW9ub3NwYWNlJyApICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fTsnb2JqZWN0JyA9PT0gdHlwZW9mIG1vZHVsZSA/IG1vZHVsZS5leHBvcnRzID0gQiA6ICggd2luZG93LkZvbnRGYWNlT2JzZXJ2ZXIgPSBCLCB3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZCA9IEIucHJvdG90eXBlLmxvYWQgKTtcblx0fSgpICk7XG5cblx0Ly8gbWlubnBvc3QgZm9udHNcblxuXHQvLyBzYW5zXG5cdHZhciBzYW5zTm9ybWFsID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoICdmZi1tZXRhLXdlYi1wcm8nICk7XG5cdHZhciBzYW5zQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNhbnNOb3JtYWxJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA0MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cblx0Ly8gc2VyaWZcblx0dmFyIHNlcmlmQm9vayA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDUwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9va0l0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDUwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9sZEl0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQmxhY2sgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA5MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJsYWNrSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogOTAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXG5cdFByb21pc2UuYWxsKCBbXG5cdFx0c2Fuc05vcm1hbC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc0JvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNOb3JtYWxJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9vay5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb29rSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9sZEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCbGFjay5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCbGFja0l0YWxpYy5sb2FkKCBudWxsLCAzMDAwIClcblx0XSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzZXJpZi1mb250cy1sb2FkZWQnO1xuXG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsID0gdHJ1ZTtcblx0fSApO1xuXG5cdFByb21pc2UuYWxsKCBbXG5cdFx0c2Fuc05vcm1hbC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc0JvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNOb3JtYWxJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApXG5cdF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2Fucy1mb250cy1sb2FkZWQnO1xuXG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG59XG5cbiIsIi8qKlxuICogVGhpcyBpcyB1c2VkIHRvIGNhdXNlIEdvb2dsZSBBbmFseXRpY3MgZXZlbnRzIHRvIHJ1blxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuZnVuY3Rpb24gbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgdmFsdWUgKSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdH1cblx0XHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3Igc2hhcmluZyBjb250ZW50XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8vIHRyYWNrIGEgc2hhcmUgdmlhIGFuYWx5dGljcyBldmVudFxuZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gPSAnJyApIHtcblxuXHQvLyBpZiBhIG5vdCBsb2dnZWQgaW4gdXNlciB0cmllcyB0byBlbWFpbCwgZG9uJ3QgY291bnQgdGhhdCBhcyBhIHNoYXJlXG5cdGlmICggISBqUXVlcnkoICdib2R5JyApLmhhc0NsYXNzKCAnbG9nZ2VkLWluJyApICYmICdFbWFpbCcgPT09IHRleHQgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGNhdGVnb3J5ID0gJ1NoYXJlJztcblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0Y2F0ZWdvcnkgPSAnU2hhcmUgLSAnICsgcG9zaXRpb247XG5cdH1cblxuXHQvLyB0cmFjayBhcyBhbiBldmVudCwgYW5kIGFzIHNvY2lhbCBpZiBpdCBpcyB0d2l0dGVyIG9yIGZiXG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnksIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgfHwgJ1R3aXR0ZXInID09PSB0ZXh0ICkge1xuXHRcdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0ICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuLy8gY29weSB0aGUgY3VycmVudCBVUkwgdG8gdGhlIHVzZXIncyBjbGlwYm9hcmRcbmZ1bmN0aW9uIGNvcHlDdXJyZW50VVJMKCkge1xuXHR2YXIgZHVtbXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW5wdXQnICksXG5cdFx0dGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkdW1teSApO1xuXHRkdW1teS52YWx1ZSA9IHRleHQ7XG5cdGR1bW15LnNlbGVjdCgpO1xuXHRkb2N1bWVudC5leGVjQ29tbWFuZCggJ2NvcHknICk7XG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoIGR1bW15ICk7XG59XG5cbi8vIHRvcCBzaGFyZSBidXR0b24gY2xpY2tcbiQoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLmRhdGEoICdzaGFyZS1hY3Rpb24nICk7XG5cdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSApO1xuXG4vLyBjYXVzZSB0aGUgY3VycmVudCBwYWdlIHRvIHByaW50XG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtcHJpbnQgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0d2luZG93LnByaW50KCk7XG59ICk7XG5cbi8vIHdoZW4gdGhlIGNvcHkgbGluayBidXR0b24gaXMgY2xpY2tlZFxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWNvcHktdXJsIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRjb3B5Q3VycmVudFVSTCgpO1xuXHR0bGl0ZS5zaG93KCAoIGUudGFyZ2V0ICksIHsgZ3JhdjogJ3cnIH0gKTtcblx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0dGxpdGUuaGlkZSggKCBlLnRhcmdldCApICk7XG5cdH0sIDMwMDAgKTtcblx0cmV0dXJuIGZhbHNlO1xufSApO1xuXG4vLyB3aGVuIHNoYXJpbmcgdmlhIGZhY2Vib29rLCB0d2l0dGVyLCBvciBlbWFpbCwgb3BlbiB0aGUgZGVzdGluYXRpb24gdXJsIGluIGEgbmV3IHdpbmRvd1xuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWZhY2Vib29rIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXR3aXR0ZXIgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZW1haWwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0dmFyIHVybCA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblx0d2luZG93Lm9wZW4oIHVybCwgJ19ibGFuaycgKTtcbn0gKTtcbiIsIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIE5hdmlnYXRpb24gc2NyaXB0cy4gSW5jbHVkZXMgbW9iaWxlIG9yIHRvZ2dsZSBiZWhhdmlvciwgYW5hbHl0aWNzIHRyYWNraW5nIG9mIHNwZWNpZmljIG1lbnVzLlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKi9cblxuZnVuY3Rpb24gc2V0dXBQcmltYXJ5TmF2KCkge1xuXHRjb25zdCBwcmltYXJ5TmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWxpbmtzJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgcHJpbWFyeU5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgYnV0dG9uJyApO1xuXHRpZiAoIG51bGwgIT09IHByaW1hcnlOYXZUb2dnbGUgKSB7XG5cdFx0cHJpbWFyeU5hdlRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdGNvbnN0IHVzZXJOYXZUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1taW5ucG9zdC1hY2NvdW50IHVsJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgdXNlck5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1taW5ucG9zdC1hY2NvdW50ID4gYScgKTtcblx0aWYgKCBudWxsICE9PSB1c2VyTmF2VG9nZ2xlICkge1xuXHRcdHVzZXJOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHR2YXIgdGFyZ2V0ICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ25hdiAubS1mb3JtLXNlYXJjaCBmaWVsZHNldCAuYS1idXR0b24tc2VudGVuY2UnICk7XG5cdGlmICggbnVsbCAhPT0gdGFyZ2V0ICkge1xuXHRcdHZhciBkaXYgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdGRpdi5pbm5lckhUTUwgPSAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImEtY2xvc2UtYnV0dG9uIGEtY2xvc2Utc2VhcmNoXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG5cdFx0dmFyIGZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRkaXYuc2V0QXR0cmlidXRlKCAnY2xhc3MnLCAnYS1jbG9zZS1ob2xkZXInICk7XG5cdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZCggZnJhZ21lbnQgKTtcblxuXHRcdGNvbnN0IHNlYXJjaFRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWFjdGlvbnMgLm0tZm9ybS1zZWFyY2gnICksXG5cdFx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdFx0fSApO1xuXG5cdFx0dmFyIHNlYXJjaFZpc2libGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbGkuc2VhcmNoID4gYScgKTtcblx0XHRzZWFyY2hWaXNpYmxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdHZhciBzZWFyY2hDbG9zZSAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmEtY2xvc2Utc2VhcmNoJyApO1xuXHRcdHNlYXJjaENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdC8vIGVzY2FwZSBrZXkgcHJlc3Ncblx0JCggZG9jdW1lbnQgKS5rZXl1cCggZnVuY3Rpb24oIGUgKSB7XG5cdFx0aWYgKCAyNyA9PT0gZS5rZXlDb2RlICkge1xuXHRcdFx0bGV0IHByaW1hcnlOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gcHJpbWFyeU5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHVzZXJOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gdXNlck5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHNlYXJjaElzVmlzaWJsZSA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBwcmltYXJ5TmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gcHJpbWFyeU5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHRwcmltYXJ5TmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHByaW1hcnlOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHVzZXJOYXZFeHBhbmRlZCAmJiB0cnVlID09PSB1c2VyTmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgdXNlck5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2Ygc2VhcmNoSXNWaXNpYmxlICYmIHRydWUgPT09IHNlYXJjaElzVmlzaWJsZSApIHtcblx0XHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBzZWFyY2hJc1Zpc2libGUgKTtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIHNldHVwU2Nyb2xsTmF2KCBzZWxlY3RvciwgbmF2U2VsZWN0b3IsIGNvbnRlbnRTZWxlY3RvciApIHtcblxuXHQvLyBJbml0IHdpdGggYWxsIG9wdGlvbnMgYXQgZGVmYXVsdCBzZXR0aW5nXG5cdGNvbnN0IHByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0ID0gUHJpb3JpdHlOYXZTY3JvbGxlcigge1xuXHRcdHNlbGVjdG9yOiBzZWxlY3Rvcixcblx0XHRuYXZTZWxlY3RvcjogbmF2U2VsZWN0b3IsXG5cdFx0Y29udGVudFNlbGVjdG9yOiBjb250ZW50U2VsZWN0b3IsXG5cdFx0aXRlbVNlbGVjdG9yOiAnbGksIGEnLFxuXHRcdGJ1dHRvbkxlZnRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0Jyxcblx0XHRidXR0b25SaWdodFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0J1xuXG5cdFx0Ly9zY3JvbGxTdGVwOiAnYXZlcmFnZSdcblx0fSApO1xuXG5cdC8vIEluaXQgbXVsdGlwbGUgbmF2IHNjcm9sbGVycyB3aXRoIHRoZSBzYW1lIG9wdGlvbnNcblx0LypsZXQgbmF2U2Nyb2xsZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi1zY3JvbGxlcicpO1xuXG5cdG5hdlNjcm9sbGVycy5mb3JFYWNoKChjdXJyZW50VmFsdWUsIGN1cnJlbnRJbmRleCkgPT4ge1xuXHQgIFByaW9yaXR5TmF2U2Nyb2xsZXIoe1xuXHQgICAgc2VsZWN0b3I6IGN1cnJlbnRWYWx1ZVxuXHQgIH0pO1xuXHR9KTsqL1xufVxuXG5zZXR1cFByaW1hcnlOYXYoKTtcblxuaWYgKCAwIDwgJCggJy5tLXN1Yi1uYXZpZ2F0aW9uJyApLmxlbmd0aCApIHtcblx0c2V0dXBTY3JvbGxOYXYoICcubS1zdWItbmF2aWdhdGlvbicsICcubS1zdWJuYXYtbmF2aWdhdGlvbicsICcubS1tZW51LXN1Yi1uYXZpZ2F0aW9uJyApO1xufVxuaWYgKCAwIDwgJCggJy5tLXBhZ2luYXRpb24tbmF2aWdhdGlvbicgKS5sZW5ndGggKSB7XG5cdHNldHVwU2Nyb2xsTmF2KCAnLm0tcGFnaW5hdGlvbi1uYXZpZ2F0aW9uJywgJy5tLXBhZ2luYXRpb24tY29udGFpbmVyJywgJy5tLXBhZ2luYXRpb24tbGlzdCcgKTtcbn1cblxuJCggJ2EnLCAkKCAnLm8tc2l0ZS1zaWRlYmFyJyApICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHR2YXIgd2lkZ2V0VGl0bGUgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0td2lkZ2V0JyApLmZpbmQoICdoMycgKS50ZXh0KCk7XG5cdHZhciB6b25lVGl0bGUgICAgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS16b25lJyApLmZpbmQoICcuYS16b25lLXRpdGxlJyApLnRleHQoKTtcblx0dmFyIHNpZGViYXJTZWN0aW9uVGl0bGUgPSAnJztcblx0aWYgKCAnJyAhPT0gd2lkZ2V0VGl0bGUgKSB7XG5cdFx0c2lkZWJhclNlY3Rpb25UaXRsZSA9IHdpZGdldFRpdGxlO1xuXHR9IGVsc2UgaWYgKCAnJyAhPT0gem9uZVRpdGxlICkge1xuXHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB6b25lVGl0bGU7XG5cdH1cblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBMaW5rJywgJ0NsaWNrJywgc2lkZWJhclNlY3Rpb25UaXRsZSApO1xufSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBmb3Jtc1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG5qUXVlcnkuZm4udGV4dE5vZGVzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNvbnRlbnRzKCkuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKCB0aGlzLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSAmJiAnJyAhPT0gdGhpcy5ub2RlVmFsdWUudHJpbSgpICk7XG5cdH0gKTtcbn07XG5cbmZ1bmN0aW9uIGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoIGFjdGlvbiApIHtcblx0dmFyIG1hcmt1cCA9ICc8bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLWZvcm0tY29uZmlybVwiPjxsYWJlbD5BcmUgeW91IHN1cmU/IDxhIGlkPVwiYS1jb25maXJtLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ZZXM8L2E+IHwgPGEgaWQ9XCJhLXN0b3AtJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPk5vPC9hPjwvbGFiZWw+PC9saT4nO1xuXHRyZXR1cm4gbWFya3VwO1xufVxuXG5mdW5jdGlvbiBtYW5hZ2VFbWFpbHMoKSB7XG5cdHZhciBmb3JtICAgICAgICAgICAgICAgPSAkKCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScgKTtcblx0dmFyIHJlc3RSb290ICAgICAgICAgICA9IHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Quc2l0ZV91cmwgKyB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnJlc3RfbmFtZXNwYWNlO1xuXHR2YXIgZnVsbFVybCAgICAgICAgICAgID0gcmVzdFJvb3QgKyAnLycgKyAndXBkYXRlLXVzZXIvJztcblx0dmFyIGNvbmZpcm1DaGFuZ2UgICAgICA9ICcnO1xuXHR2YXIgbmV4dEVtYWlsQ291bnQgICAgID0gMTtcblx0dmFyIG5ld1ByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgb2xkUHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBwcmltYXJ5SWQgICAgICAgICAgPSAnJztcblx0dmFyIGVtYWlsVG9SZW1vdmUgICAgICA9ICcnO1xuXHR2YXIgY29uc29saWRhdGVkRW1haWxzID0gW107XG5cdHZhciBuZXdFbWFpbHMgICAgICAgICAgPSBbXTtcblx0dmFyIGFqYXhGb3JtRGF0YSAgICAgICA9ICcnO1xuXHR2YXIgdGhhdCAgICAgICAgICAgICAgID0gJyc7XG5cblx0Ly8gc3RhcnQgb3V0IHdpdGggbm8gcHJpbWFyeS9yZW1vdmFscyBjaGVja2VkXG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdC8vIGlmIHRoZXJlIGlzIGEgbGlzdCBvZiBlbWFpbHMgKG5vdCBqdXN0IGEgc2luZ2xlIGZvcm0gZmllbGQpXG5cdGlmICggMCA8ICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoICkge1xuXHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblxuXHRcdC8vIGlmIGEgdXNlciBzZWxlY3RzIGEgbmV3IHByaW1hcnksIG1vdmUgaXQgaW50byB0aGF0IHBvc2l0aW9uXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nLCBmdW5jdGlvbigpIHtcblxuXHRcdFx0bmV3UHJpbWFyeUVtYWlsID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdHByaW1hcnlJZCAgICAgICA9ICQoIHRoaXMgKS5wcm9wKCAnaWQnICkucmVwbGFjZSggJ3ByaW1hcnlfZW1haWxfJywgJycgKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdwcmltYXJ5LWNoYW5nZScgKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXG5cdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBtYWluIGhpZGRlbiBmb3JtIHZhbHVlXG5cdFx0XHRcdCQoICcjZW1haWwnICkudmFsKCBuZXdQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBzdWJtaXQgZm9ybSB2YWx1ZXMuXG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cblx0XHRcdFx0Ly8gdW5jaGVjayB0aGUgcmFkaW8gYnV0dG9uXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIGZvcm0gdmFsdWVzIHRvIHRoZSBvbGQgcHJpbWFyeSBlbWFpbFxuXHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjcmVtb3ZlX2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgY29uZmlybSBtZXNzYWdlXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHR9ICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjaGFuZ2UnLCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZW1haWxUb1JlbW92ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdyZW1vdmFsJyApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSAhPT0gZW1haWxUb1JlbW92ZSApIHtcblx0XHRcdFx0XHRjb25zb2xpZGF0ZWRFbWFpbHMucHVzaCggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyIGZvciByZW1vdmFsXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQvLyBpZiBjb25maXJtZWQsIHJlbW92ZSB0aGUgZW1haWwgYW5kIHN1Ym1pdCB0aGUgZm9ybVxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5mYWRlT3V0KCAnbm9ybWFsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLnJlbW92ZSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCAndmFsdWUgaXMgJyArIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8vIGlmIGEgdXNlciB3YW50cyB0byBhZGQgYW4gZW1haWwsIGdpdmUgdGhlbSBhIHByb3Blcmx5IG51bWJlcmVkIGZpZWxkXG5cdCQoICcubS1mb3JtLWVtYWlsJyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcgKS5iZWZvcmUoICc8ZGl2IGNsYXNzPVwiYS1pbnB1dC13aXRoLWJ1dHRvbiBhLWJ1dHRvbi1zZW50ZW5jZVwiPjxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIGlkPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIHZhbHVlPVwiXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBpZD1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBjbGFzcz1cImEtYnV0dG9uIGEtYnV0dG9uLWFkZC11c2VyLWVtYWlsXCI+QWRkPC9idXR0b24+PC9kaXY+JyApO1xuXHRcdG5leHRFbWFpbENvdW50Kys7XG5cdH0gKTtcblxuXHQkKCAnaW5wdXRbdHlwZT1zdWJtaXRdJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgYnV0dG9uID0gJCggdGhpcyApO1xuXHRcdHZhciBidXR0b25Gb3JtID0gYnV0dG9uLmNsb3Nlc3QoICdmb3JtJyApO1xuXHRcdGJ1dHRvbkZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJywgYnV0dG9uLnZhbCgpICk7XG5cdH0gKTtcblxuXHQkKCAnLm0tZW50cnktY29udGVudCcgKS5vbiggJ3N1Ym1pdCcsICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdHZhciBmb3JtID0gJCggdGhpcyApO1xuXHRcdHZhciBzdWJtaXR0aW5nQnV0dG9uID0gZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nICkgfHwgJyc7XG5cblx0XHQvLyBpZiB0aGVyZSBpcyBubyBzdWJtaXR0aW5nIGJ1dHRvbiwgcGFzcyBpdCBieSBBamF4XG5cdFx0aWYgKCAnJyA9PT0gc3VibWl0dGluZ0J1dHRvbiB8fCAnU2F2ZSBDaGFuZ2VzJyAhPT0gc3VibWl0dGluZ0J1dHRvbiApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhamF4Rm9ybURhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4Rm9ybURhdGEgPSBhamF4Rm9ybURhdGEgKyAnJnJlc3Q9dHJ1ZSc7XG5cdFx0XHQkLmFqYXgoIHtcblx0XHRcdFx0dXJsOiBmdWxsVXJsLFxuXHRcdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKCB4aHIgKSB7XG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRkYXRhOiBhamF4Rm9ybURhdGFcblx0XHRcdH0gKS5kb25lKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0fSApLmdldCgpO1xuXHRcdFx0XHQkLmVhY2goIG5ld0VtYWlscywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9IG5leHRFbWFpbENvdW50ICsgaW5kZXg7XG5cdFx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5hcHBlbmQoICc8bGkgaWQ9XCJ1c2VyLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIj4nICsgdmFsdWUgKyAnPHVsIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS11c2VyLWVtYWlsLWFjdGlvbnNcIj48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtbWFrZS1wcmltYXJ5LWVtYWlsXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJwcmltYXJ5X2VtYWlsXCIgaWQ9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPk1ha2UgUHJpbWFyeTwvc21hbGw+PC9sYWJlbD48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1lbWFpbC1wcmVmZXJlbmNlc1wiPjxhIGhyZWY9XCIvbmV3c2xldHRlcnMvP2VtYWlsPScgKyBlbmNvZGVVUklDb21wb25lbnQoIHZhbHVlICkgKyAnXCI+PHNtYWxsPkVtYWlsIFByZWZlcmVuY2VzPC9zbWFsbD48L2E+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtcmVtb3ZlLWVtYWlsXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJyZW1vdmVfZW1haWxbJyArIG5leHRFbWFpbENvdW50ICsgJ11cIiBpZD1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPlJlbW92ZTwvc21hbGw+PC9sYWJlbD48L2xpPjwvdWw+PC9saT4nICk7XG5cdFx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoICQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCkgKyAnLCcgKyB2YWx1ZSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdCQoICcubS1mb3JtLWNoYW5nZS1lbWFpbCAuYS1pbnB1dC13aXRoLWJ1dHRvbicgKS5yZW1vdmUoKTtcblx0XHRcdFx0aWYgKCAwID09PSAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKSAhPT0gJCggJ2lucHV0W25hbWU9XCJlbWFpbFwiXScgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gaXQgd291bGQgYmUgbmljZSB0byBvbmx5IGxvYWQgdGhlIGZvcm0sIGJ1dCB0aGVuIGNsaWNrIGV2ZW50cyBzdGlsbCBkb24ndCB3b3JrXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cdH0gKTtcbn1cblxuZnVuY3Rpb24gYWRkQXV0b1Jlc2l6ZSgpIHtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJ1tkYXRhLWF1dG9yZXNpemVdJyApLmZvckVhY2goIGZ1bmN0aW9uICggZWxlbWVudCApIHtcblx0XHRlbGVtZW50LnN0eWxlLmJveFNpemluZyA9ICdib3JkZXItYm94Jztcblx0XHR2YXIgb2Zmc2V0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgLSBlbGVtZW50LmNsaWVudEhlaWdodDtcblx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdpbnB1dCcsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG5cdFx0XHRldmVudC50YXJnZXQuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuXHRcdFx0ZXZlbnQudGFyZ2V0LnN0eWxlLmhlaWdodCA9IGV2ZW50LnRhcmdldC5zY3JvbGxIZWlnaHQgKyBvZmZzZXQgKyAncHgnO1xuXHRcdH0pO1xuXHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCAnZGF0YS1hdXRvcmVzaXplJyApO1xuXHR9KTtcbn1cblxuJCggZG9jdW1lbnQgKS5hamF4U3RvcCggZnVuY3Rpb24oKSB7XG5cdHZhciBjb21tZW50QXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcjbGxjX2NvbW1lbnRzJyApO1xuXHRpZiAoIG51bGwgIT09IGNvbW1lbnRBcmVhICkge1xuXHRcdGFkZEF1dG9SZXNpemUoKTtcblx0fVxufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICggMCA8ICQoICcubS1mb3JtLWFjY291bnQtc2V0dGluZ3MnICkubGVuZ3RoICkge1xuXHRcdG1hbmFnZUVtYWlscygpO1xuXHR9XG5cdHZhciBhdXRvUmVzaXplVGV4dGFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnW2RhdGEtYXV0b3Jlc2l6ZV0nICk7XG5cdGlmICggbnVsbCAhPT0gYXV0b1Jlc2l6ZVRleHRhcmVhICkge1xuXHRcdGFkZEF1dG9SZXNpemUoKTtcblx0fVxufSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBjb21tZW50c1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG4vLyBiYXNlZCBvbiB3aGljaCBidXR0b24gd2FzIGNsaWNrZWQsIHNldCB0aGUgdmFsdWVzIGZvciB0aGUgYW5hbHl0aWNzIGV2ZW50IGFuZCBjcmVhdGUgaXRcbmZ1bmN0aW9uIHRyYWNrU2hvd0NvbW1lbnRzKCBhbHdheXMsIGlkLCBjbGlja1ZhbHVlICkge1xuXHR2YXIgYWN0aW9uICAgICAgICAgID0gJyc7XG5cdHZhciBjYXRlZ29yeVByZWZpeCA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlTdWZmaXggPSAnJztcblx0dmFyIHBvc2l0aW9uICAgICAgICA9ICcnO1xuXHRwb3NpdGlvbiA9IGlkLnJlcGxhY2UoICdhbHdheXMtc2hvdy1jb21tZW50cy0nLCAnJyApO1xuXHRpZiAoICcxJyA9PT0gY2xpY2tWYWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT24nO1xuXHR9IGVsc2UgaWYgKCAnMCcgPT09IGNsaWNrVmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09mZic7XG5cdH0gZWxzZSB7XG5cdFx0YWN0aW9uID0gJ0NsaWNrJztcblx0fVxuXHRpZiAoIHRydWUgPT09IGFsd2F5cyApIHtcblx0XHRjYXRlZ29yeVByZWZpeCA9ICdBbHdheXMgJztcblx0fVxuXHRpZiAoICcnICE9PSBwb3NpdGlvbiApIHtcblx0XHRwb3NpdGlvbiA9IHBvc2l0aW9uLmNoYXJBdCggMCApLnRvVXBwZXJDYXNlKCkgKyBwb3NpdGlvbi5zbGljZSggMSApO1xuXHRcdGNhdGVnb3J5U3VmZml4ID0gJyAtICcgKyBwb3NpdGlvbjtcblx0fVxuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsIGNhdGVnb3J5UHJlZml4ICsgJ1Nob3cgQ29tbWVudHMnICsgY2F0ZWdvcnlTdWZmaXgsIGFjdGlvbiwgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn1cblxuLy8gd2hlbiBzaG93aW5nIGNvbW1lbnRzIG9uY2UsIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWJ1dHRvbi1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCBmYWxzZSwgJycsICcnICk7XG59ICk7XG5cbi8vIFNldCB1c2VyIG1ldGEgdmFsdWUgZm9yIGFsd2F5cyBzaG93aW5nIGNvbW1lbnRzIGlmIHRoYXQgYnV0dG9uIGlzIGNsaWNrZWRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR2YXIgdGhhdCA9ICQoIHRoaXMgKTtcblx0aWYgKCB0aGF0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9IGVsc2Uge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvLyB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcblx0dHJhY2tTaG93Q29tbWVudHMoIHRydWUsIHRoYXQuYXR0ciggJ2lkJyApLCB0aGF0LnZhbCgpICk7XG5cblx0Ly8gd2UgYWxyZWFkeSBoYXZlIGFqYXh1cmwgZnJvbSB0aGUgdGhlbWVcblx0JC5hamF4KCB7XG5cdFx0dHlwZTogJ1BPU1QnLFxuXHRcdHVybDogcGFyYW1zLmFqYXh1cmwsXG5cdFx0ZGF0YToge1xuXHRcdFx0J2FjdGlvbic6ICdtaW5ucG9zdF9sYXJnb19sb2FkX2NvbW1lbnRzX3NldF91c2VyX21ldGEnLFxuXHRcdFx0J3ZhbHVlJzogdGhhdC52YWwoKVxuXHRcdH0sXG5cdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0JCggJy5hLWFsd2F5cy1zaG93LWNvbW1lbnRzLXJlc3VsdCcsIHRoYXQucGFyZW50KCkgKS5odG1sKCByZXNwb25zZS5kYXRhLm1lc3NhZ2UgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gcmVzcG9uc2UuZGF0YS5zaG93ICkge1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAwICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAxICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG59ICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIGV2ZW50c1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxudmFyIHRhcmdldCAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1ldmVudHMtY2FsLWxpbmtzJyApO1xuaWYgKCBudWxsICE9PSB0YXJnZXQgKSB7XG4gICAgdmFyIGxpICAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdsaScgKTtcbiAgICBsaS5pbm5lckhUTUwgID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLWNhbGVuZGFyXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG4gICAgdmFyIGZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBsaS5zZXRBdHRyaWJ1dGUoICdjbGFzcycsICdhLWNsb3NlLWhvbGRlcicgKTtcbiAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggbGkgKTtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG59XG5cbmNvbnN0IGNhbGVuZGFyVHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcbiAgICBlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmEtZXZlbnRzLWNhbC1saW5rcycgKSxcbiAgICB2aXNpYmxlQ2xhc3M6ICdhLWV2ZW50cy1jYWwtbGluay12aXNpYmxlJyxcbiAgICBkaXNwbGF5VmFsdWU6ICdibG9jaydcbn0gKTtcblxudmFyIGNhbGVuZGFyVmlzaWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcubS1ldmVudC1kYXRldGltZSBhJyApO1xuaWYgKCBudWxsICE9PSBjYWxlbmRhclZpc2libGUgKSB7XG4gICAgY2FsZW5kYXJWaXNpYmxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gY2FsZW5kYXJWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG4gICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICBpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICB2YXIgY2FsZW5kYXJDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1jYWxlbmRhcicgKTtcbiAgICBjYWxlbmRhckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gY2FsZW5kYXJWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG4gICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICBpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICAgIH1cbiAgICB9ICk7XG59XG4iXX0=
}(jQuery));
