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
}); // when the print button is clicked

$('.m-entry-share .a-share-print a').click(function (e) {
  e.preventDefault();
  window.print();
}); // when the republish button is clicked
// the plugin controls the rest, but we need to make sure the default event doesn't fire

$('.m-entry-share .a-share-republish a').click(function (e) {
  e.preventDefault();
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
  var ua = window.navigator.userAgent;
  var isIE = /MSIE|Trident/.test(ua);

  if (isIE) {
    return;
  } // Init with all options at default setting


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
!function (d) {
  if (!d.currentScript) {
    var data = {
      action: "llc_load_comments",
      post: $("#llc_post_id").val()
    }; // Ajax request link.

    var llcajaxurl = $("#llc_ajax_url").val(); // Full url to get comments (Adding parameters).

    var commentUrl = llcajaxurl + '?' + $.param(data); // Perform ajax request.

    $.get(commentUrl, function (response) {
      if (response !== "") {
        $("#llc_comments").html(response); // Initialize comments after lazy loading.

        if (window.addComment && window.addComment.init) {
          window.addComment.init();
        } // Get the comment li id from url if exist.


        var commentId = document.URL.substr(document.URL.indexOf("#comment")); // If comment id found, scroll to that comment.

        if (commentId.indexOf('#comment') > -1) {
          $(window).scrollTop($(commentId).offset().top);
        }
      }
    });
  }
}(document);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDAtc3RhcnQuanMiLCIwMS1mb250cy5qcyIsIjAyLWFuYWx5dGljcy5qcyIsIjAzLXNoYXJlLmpzIiwiMDQtbmF2aWdhdGlvbi5qcyIsIjA1LWZvcm1zLmpzIiwiMDYtY29tbWVudHMuanMiLCIwNy1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImRvY3VtZW50RWxlbWVudCIsInNlc3Npb25TdG9yYWdlIiwic2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsInNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsImciLCJwdXNoIiwibSIsInNoaWZ0IiwicCIsImIiLCJxIiwiYyIsInUiLCJUeXBlRXJyb3IiLCJ0aGVuIiwiY2FsbCIsInYiLCJoIiwicHJvdG90eXBlIiwidyIsImsiLCJ4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyYWNlIiwiYWxsIiwiY2F0Y2giLCJhdHRhY2hFdmVudCIsImJvZHkiLCJyZWFkeVN0YXRlIiwiZGV0YWNoRXZlbnQiLCJjcmVhdGVUZXh0Tm9kZSIsImNzc1RleHQiLCJ6Iiwid2lkdGgiLCJBIiwiQiIsImZhbWlseSIsIndlaWdodCIsInN0cmV0Y2giLCJDIiwiRCIsIkUiLCJGIiwiRyIsIkoiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidmVuZG9yIiwiZXhlYyIsInVzZXJBZ2VudCIsImZvbnRzIiwiSyIsImZvbnQiLCJMIiwiam9pbiIsImxvYWQiLCJIIiwiRGF0ZSIsImdldFRpbWUiLCJNIiwiTiIsInkiLCJJIiwiaGlkZGVuIiwiZGlyIiwiRm9udEZhY2VPYnNlcnZlciIsInNhbnNOb3JtYWwiLCJzYW5zQm9sZCIsInNhbnNOb3JtYWxJdGFsaWMiLCJzZXJpZkJvb2siLCJzZXJpZkJvb2tJdGFsaWMiLCJzZXJpZkJvbGQiLCJzZXJpZkJvbGRJdGFsaWMiLCJzZXJpZkJsYWNrIiwic2VyaWZCbGFja0l0YWxpYyIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsInR5cGUiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwidmFsdWUiLCJnYSIsImV2ZW50IiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsImpRdWVyeSIsImhhc0NsYXNzIiwiY29weUN1cnJlbnRVUkwiLCJkdW1teSIsImhyZWYiLCJzZWxlY3QiLCJleGVjQ29tbWFuZCIsIiQiLCJjbGljayIsImRhdGEiLCJwcmV2ZW50RGVmYXVsdCIsInByaW50IiwidXJsIiwiYXR0ciIsIm9wZW4iLCJzZXR1cFByaW1hcnlOYXYiLCJwcmltYXJ5TmF2VHJhbnNpdGlvbmVyIiwicHJpbWFyeU5hdlRvZ2dsZSIsImV4cGFuZGVkIiwidXNlck5hdlRyYW5zaXRpb25lciIsInVzZXJOYXZUb2dnbGUiLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCJrZXl1cCIsImtleUNvZGUiLCJwcmltYXJ5TmF2RXhwYW5kZWQiLCJ1c2VyTmF2RXhwYW5kZWQiLCJzZWFyY2hJc1Zpc2libGUiLCJzZXR1cFNjcm9sbE5hdiIsInVhIiwiaXNJRSIsInByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0Iiwid2lkZ2V0VGl0bGUiLCJjbG9zZXN0IiwiZmluZCIsInpvbmVUaXRsZSIsInNpZGViYXJTZWN0aW9uVGl0bGUiLCJmbiIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwidHJpbSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJmb3JtIiwicmVzdFJvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxVcmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheEZvcm1EYXRhIiwidGhhdCIsInByb3AiLCJvbiIsInZhbCIsInJlcGxhY2UiLCJwYXJlbnQiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJnZXQiLCJwYXJlbnRzIiwiZmFkZU91dCIsImJlZm9yZSIsImJ1dHRvbiIsImJ1dHRvbkZvcm0iLCJzdWJtaXR0aW5nQnV0dG9uIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRvbmUiLCJtYXAiLCJpbmRleCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsImFkZEF1dG9SZXNpemUiLCJmb3JFYWNoIiwiYm94U2l6aW5nIiwib2Zmc2V0IiwiY2xpZW50SGVpZ2h0IiwiaGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0IiwiYWpheFN0b3AiLCJjb21tZW50QXJlYSIsImF1dG9SZXNpemVUZXh0YXJlYSIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiaWQiLCJjbGlja1ZhbHVlIiwiY2F0ZWdvcnlQcmVmaXgiLCJjYXRlZ29yeVN1ZmZpeCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJpcyIsInBhcmFtcyIsImFqYXh1cmwiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJodG1sIiwibWVzc2FnZSIsImN1cnJlbnRTY3JpcHQiLCJwb3N0IiwibGxjYWpheHVybCIsImNvbW1lbnRVcmwiLCJwYXJhbSIsImFkZENvbW1lbnQiLCJjb21tZW50SWQiLCJVUkwiLCJzdWJzdHIiLCJpbmRleE9mIiwic2Nyb2xsVG9wIiwibGkiLCJjYWxlbmRhclRyYW5zaXRpb25lciIsImNhbGVuZGFyVmlzaWJsZSIsImNhbGVuZGFyQ2xvc2UiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsS0FBVCxDQUFlQyxDQUFmLEVBQWlCO0FBQUNDLEVBQUFBLFFBQVEsQ0FBQ0MsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBc0MsVUFBU0MsQ0FBVCxFQUFXO0FBQUMsUUFBSUMsQ0FBQyxHQUFDRCxDQUFDLENBQUNFLE1BQVI7QUFBQSxRQUFlQyxDQUFDLEdBQUNOLENBQUMsQ0FBQ0ksQ0FBRCxDQUFsQjtBQUFzQkUsSUFBQUEsQ0FBQyxLQUFHQSxDQUFDLEdBQUMsQ0FBQ0YsQ0FBQyxHQUFDQSxDQUFDLENBQUNHLGFBQUwsS0FBcUJQLENBQUMsQ0FBQ0ksQ0FBRCxDQUEzQixDQUFELEVBQWlDRSxDQUFDLElBQUVQLEtBQUssQ0FBQ1MsSUFBTixDQUFXSixDQUFYLEVBQWFFLENBQWIsRUFBZSxDQUFDLENBQWhCLENBQXBDO0FBQXVELEdBQS9IO0FBQWlJOztBQUFBUCxLQUFLLENBQUNTLElBQU4sR0FBVyxVQUFTUixDQUFULEVBQVdHLENBQVgsRUFBYUMsQ0FBYixFQUFlO0FBQUMsTUFBSUUsQ0FBQyxHQUFDLFlBQU47QUFBbUJILEVBQUFBLENBQUMsR0FBQ0EsQ0FBQyxJQUFFLEVBQUwsRUFBUSxDQUFDSCxDQUFDLENBQUNTLE9BQUYsSUFBVyxVQUFTVCxDQUFULEVBQVdHLENBQVgsRUFBYTtBQUFDLGFBQVNPLENBQVQsR0FBWTtBQUFDWCxNQUFBQSxLQUFLLENBQUNZLElBQU4sQ0FBV1gsQ0FBWCxFQUFhLENBQUMsQ0FBZDtBQUFpQjs7QUFBQSxhQUFTWSxDQUFULEdBQVk7QUFBQ0MsTUFBQUEsQ0FBQyxL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QUMsQ0FBQzJPLGNBQUY7QUFDQSxRQUFJUSxRQUFRLEdBQUcsV0FBV3lILGVBQWUsQ0FBQ2xWLFlBQWhCLENBQThCLGVBQTlCLENBQVgsSUFBOEQsS0FBN0U7QUFDQWtWLElBQUFBLGVBQWUsQ0FBQ3hVLFlBQWhCLENBQThCLGVBQTlCLEVBQStDLENBQUUrTSxRQUFqRDs7QUFDQSxRQUFLLFNBQVNBLFFBQWQsRUFBeUI7QUFDckJ3SCxNQUFBQSxvQkFBb0IsQ0FBQzFTLGNBQXJCO0FBQ0gsS0FGRCxNQUVPO0FBQ0gwUyxNQUFBQSxvQkFBb0IsQ0FBQy9TLGNBQXJCO0FBQ0g7QUFDSixHQVREO0FBVUgiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB0bGl0ZSh0KXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZSl7dmFyIGk9ZS50YXJnZXQsbj10KGkpO258fChuPShpPWkucGFyZW50RWxlbWVudCkmJnQoaSkpLG4mJnRsaXRlLnNob3coaSxuLCEwKX0pfXRsaXRlLnNob3c9ZnVuY3Rpb24odCxlLGkpe3ZhciBuPVwiZGF0YS10bGl0ZVwiO2U9ZXx8e30sKHQudG9vbHRpcHx8ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiBvKCl7dGxpdGUuaGlkZSh0LCEwKX1mdW5jdGlvbiBsKCl7cnx8KHI9ZnVuY3Rpb24odCxlLGkpe2Z1bmN0aW9uIG4oKXtvLmNsYXNzTmFtZT1cInRsaXRlIHRsaXRlLVwiK3Irczt2YXIgZT10Lm9mZnNldFRvcCxpPXQub2Zmc2V0TGVmdDtvLm9mZnNldFBhcmVudD09PXQmJihlPWk9MCk7dmFyIG49dC5vZmZzZXRXaWR0aCxsPXQub2Zmc2V0SGVpZ2h0LGQ9by5vZmZzZXRIZWlnaHQsZj1vLm9mZnNldFdpZHRoLGE9aStuLzI7by5zdHlsZS50b3A9KFwic1wiPT09cj9lLWQtMTA6XCJuXCI9PT1yP2UrbCsxMDplK2wvMi1kLzIpK1wicHhcIixvLnN0eWxlLmxlZnQ9KFwid1wiPT09cz9pOlwiZVwiPT09cz9pK24tZjpcIndcIj09PXI/aStuKzEwOlwiZVwiPT09cj9pLWYtMTA6YS1mLzIpK1wicHhcIn12YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxsPWkuZ3Jhdnx8dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRsaXRlXCIpfHxcIm5cIjtvLmlubmVySFRNTD1lLHQuYXBwZW5kQ2hpbGQobyk7dmFyIHI9bFswXXx8XCJcIixzPWxbMV18fFwiXCI7bigpO3ZhciBkPW8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuXCJzXCI9PT1yJiZkLnRvcDwwPyhyPVwiblwiLG4oKSk6XCJuXCI9PT1yJiZkLmJvdHRvbT53aW5kb3cuaW5uZXJIZWlnaHQ/KHI9XCJzXCIsbigpKTpcImVcIj09PXImJmQubGVmdDwwPyhyPVwid1wiLG4oKSk6XCJ3XCI9PT1yJiZkLnJpZ2h0PndpbmRvdy5pbm5lcldpZHRoJiYocj1cImVcIixuKCkpLG8uY2xhc3NOYW1lKz1cIiB0bGl0ZS12aXNpYmxlXCIsb30odCxkLGUpKX12YXIgcixzLGQ7cmV0dXJuIHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLG8pLHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIixvKSx0LnRvb2x0aXA9e3Nob3c6ZnVuY3Rpb24oKXtkPXQudGl0bGV8fHQuZ2V0QXR0cmlidXRlKG4pfHxkLHQudGl0bGU9XCJcIix0LnNldEF0dHJpYnV0ZShuLFwiXCIpLGQmJiFzJiYocz1zZXRUaW1lb3V0KGwsaT8xNTA6MSkpfSxoaWRlOmZ1bmN0aW9uKHQpe2lmKGk9PT10KXtzPWNsZWFyVGltZW91dChzKTt2YXIgZT1yJiZyLnBhcmVudE5vZGU7ZSYmZS5yZW1vdmVDaGlsZChyKSxyPXZvaWQgMH19fX0odCxlKSkuc2hvdygpfSx0bGl0ZS5oaWRlPWZ1bmN0aW9uKHQsZSl7dC50b29sdGlwJiZ0LnRvb2x0aXAuaGlkZShlKX0sXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz10bGl0ZSk7IiwiLyoqIFxuICogTGlicmFyeSBjb2RlXG4gKiBVc2luZyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9AY2xvdWRmb3VyL3RyYW5zaXRpb24taGlkZGVuLWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCh7XG4gIGVsZW1lbnQsXG4gIHZpc2libGVDbGFzcyxcbiAgd2FpdE1vZGUgPSAndHJhbnNpdGlvbmVuZCcsXG4gIHRpbWVvdXREdXJhdGlvbixcbiAgaGlkZU1vZGUgPSAnaGlkZGVuJyxcbiAgZGlzcGxheVZhbHVlID0gJ2Jsb2NrJ1xufSkge1xuICBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0JyAmJiB0eXBlb2YgdGltZW91dER1cmF0aW9uICE9PSAnbnVtYmVyJykge1xuICAgIGNvbnNvbGUuZXJyb3IoYFxuICAgICAgV2hlbiBjYWxsaW5nIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50IHdpdGggd2FpdE1vZGUgc2V0IHRvIHRpbWVvdXQsXG4gICAgICB5b3UgbXVzdCBwYXNzIGluIGEgbnVtYmVyIGZvciB0aW1lb3V0RHVyYXRpb24uXG4gICAgYCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEb24ndCB3YWl0IGZvciBleGl0IHRyYW5zaXRpb25zIGlmIGEgdXNlciBwcmVmZXJzIHJlZHVjZWQgbW90aW9uLlxuICAvLyBJZGVhbGx5IHRyYW5zaXRpb25zIHdpbGwgYmUgZGlzYWJsZWQgaW4gQ1NTLCB3aGljaCBtZWFucyB3ZSBzaG91bGQgbm90IHdhaXRcbiAgLy8gYmVmb3JlIGFkZGluZyBgaGlkZGVuYC5cbiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKScpLm1hdGNoZXMpIHtcbiAgICB3YWl0TW9kZSA9ICdpbW1lZGlhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGxpc3RlbmVyIHRvIGFkZCBgaGlkZGVuYCBhZnRlciBvdXIgYW5pbWF0aW9ucyBjb21wbGV0ZS5cbiAgICogVGhpcyBsaXN0ZW5lciB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgY29tcGxldGluZy5cbiAgICovXG4gIGNvbnN0IGxpc3RlbmVyID0gZSA9PiB7XG4gICAgLy8gQ29uZmlybSBgdHJhbnNpdGlvbmVuZGAgd2FzIGNhbGxlZCBvbiAgb3VyIGBlbGVtZW50YCBhbmQgZGlkbid0IGJ1YmJsZVxuICAgIC8vIHVwIGZyb20gYSBjaGlsZCBlbGVtZW50LlxuICAgIGlmIChlLnRhcmdldCA9PT0gZWxlbWVudCkge1xuICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheVZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvblNob3coKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgbGlzdGVuZXIgc2hvdWxkbid0IGJlIGhlcmUgYnV0IGlmIHNvbWVvbmUgc3BhbXMgdGhlIHRvZ2dsZVxuICAgICAgICogb3ZlciBhbmQgb3ZlciByZWFsbHkgZmFzdCBpdCBjYW4gaW5jb3JyZWN0bHkgc3RpY2sgYXJvdW5kLlxuICAgICAgICogV2UgcmVtb3ZlIGl0IGp1c3QgdG8gYmUgc2FmZS5cbiAgICAgICAqL1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFNpbWlsYXJseSwgd2UnbGwgY2xlYXIgdGhlIHRpbWVvdXQgaW4gY2FzZSBpdCdzIHN0aWxsIGhhbmdpbmcgYXJvdW5kLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIC8qKlxuICAgICAgICogRm9yY2UgYSBicm93c2VyIHJlLXBhaW50IHNvIHRoZSBicm93c2VyIHdpbGwgcmVhbGl6ZSB0aGVcbiAgICAgICAqIGVsZW1lbnQgaXMgbm8gbG9uZ2VyIGBoaWRkZW5gIGFuZCBhbGxvdyB0cmFuc2l0aW9ucy5cbiAgICAgICAqL1xuICAgICAgY29uc3QgcmVmbG93ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIaWRlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvbkhpZGUoKSB7XG4gICAgICBpZiAod2FpdE1vZGUgPT09ICd0cmFuc2l0aW9uZW5kJykge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgICB9IGVsc2UgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICAgIH0sIHRpbWVvdXREdXJhdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoaXMgY2xhc3MgdG8gdHJpZ2dlciBvdXIgYW5pbWF0aW9uXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSBlbGVtZW50J3MgdmlzaWJpbGl0eVxuICAgICAqL1xuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUZWxsIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaGlkZGVuIG9yIG5vdC5cbiAgICAgKi9cbiAgICBpc0hpZGRlbigpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGhpZGRlbiBhdHRyaWJ1dGUgZG9lcyBub3QgcmVxdWlyZSBhIHZhbHVlLiBTaW5jZSBhbiBlbXB0eSBzdHJpbmcgaXNcbiAgICAgICAqIGZhbHN5LCBidXQgc2hvd3MgdGhlIHByZXNlbmNlIG9mIGFuIGF0dHJpYnV0ZSB3ZSBjb21wYXJlIHRvIGBudWxsYFxuICAgICAgICovXG4gICAgICBjb25zdCBoYXNIaWRkZW5BdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaGlkZGVuJykgIT09IG51bGw7XG5cbiAgICAgIGNvbnN0IGlzRGlzcGxheU5vbmUgPSBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJztcblxuICAgICAgY29uc3QgaGFzVmlzaWJsZUNsYXNzID0gWy4uLmVsZW1lbnQuY2xhc3NMaXN0XS5pbmNsdWRlcyh2aXNpYmxlQ2xhc3MpO1xuXG4gICAgICByZXR1cm4gaGFzSGlkZGVuQXR0cmlidXRlIHx8IGlzRGlzcGxheU5vbmUgfHwgIWhhc1Zpc2libGVDbGFzcztcbiAgICB9LFxuXG4gICAgLy8gQSBwbGFjZWhvbGRlciBmb3Igb3VyIGB0aW1lb3V0YFxuICAgIHRpbWVvdXQ6IG51bGxcbiAgfTtcbn0iLCIvKipcbiAgUHJpb3JpdHkrIGhvcml6b250YWwgc2Nyb2xsaW5nIG1lbnUuXG5cbiAgQHBhcmFtIHtPYmplY3R9IG9iamVjdCAtIENvbnRhaW5lciBmb3IgYWxsIG9wdGlvbnMuXG4gICAgQHBhcmFtIHtzdHJpbmcgfHwgRE9NIG5vZGV9IHNlbGVjdG9yIC0gRWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gbmF2U2VsZWN0b3IgLSBOYXYgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gY29udGVudFNlbGVjdG9yIC0gQ29udGVudCBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBpdGVtU2VsZWN0b3IgLSBJdGVtcyBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uTGVmdFNlbGVjdG9yIC0gTGVmdCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvblJpZ2h0U2VsZWN0b3IgLSBSaWdodCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtpbnRlZ2VyIHx8IHN0cmluZ30gc2Nyb2xsU3RlcCAtIEFtb3VudCB0byBzY3JvbGwgb24gYnV0dG9uIGNsaWNrLiAnYXZlcmFnZScgZ2V0cyB0aGUgYXZlcmFnZSBsaW5rIHdpZHRoLlxuKi9cblxuY29uc3QgUHJpb3JpdHlOYXZTY3JvbGxlciA9IGZ1bmN0aW9uKHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlcicsXG4gICAgbmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItbmF2JyxcbiAgICBjb250ZW50U2VsZWN0b3I6IGNvbnRlbnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWNvbnRlbnQnLFxuICAgIGl0ZW1TZWxlY3RvcjogaXRlbVNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItaXRlbScsXG4gICAgYnV0dG9uTGVmdFNlbGVjdG9yOiBidXR0b25MZWZ0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuICAgIGJ1dHRvblJpZ2h0U2VsZWN0b3I6IGJ1dHRvblJpZ2h0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0JyxcbiAgICBzY3JvbGxTdGVwOiBzY3JvbGxTdGVwID0gODBcbiAgfSA9IHt9KSB7XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXIgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiBzZWxlY3RvcjtcblxuICBjb25zdCB2YWxpZGF0ZVNjcm9sbFN0ZXAgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIoc2Nyb2xsU3RlcCkgfHwgc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnO1xuICB9XG5cbiAgaWYgKG5hdlNjcm9sbGVyID09PSB1bmRlZmluZWQgfHwgbmF2U2Nyb2xsZXIgPT09IG51bGwgfHwgIXZhbGlkYXRlU2Nyb2xsU3RlcCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGVyZSBpcyBzb21ldGhpbmcgd3JvbmcsIGNoZWNrIHlvdXIgb3B0aW9ucy4nKTtcbiAgfVxuXG4gIGNvbnN0IG5hdlNjcm9sbGVyTmF2ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihuYXZTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoY29udGVudFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMgPSBuYXZTY3JvbGxlckNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChpdGVtU2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckxlZnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvbkxlZnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyUmlnaHQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvblJpZ2h0U2VsZWN0b3IpO1xuXG4gIGxldCBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZUxlZnQgPSAwO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSAwO1xuICBsZXQgc2Nyb2xsaW5nRGlyZWN0aW9uID0gJyc7XG4gIGxldCBzY3JvbGxPdmVyZmxvdyA9ICcnO1xuICBsZXQgdGltZW91dDtcblxuXG4gIC8vIFNldHMgb3ZlcmZsb3cgYW5kIHRvZ2dsZSBidXR0b25zIGFjY29yZGluZ2x5XG4gIGNvbnN0IHNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgc2Nyb2xsT3ZlcmZsb3cgPSBnZXRPdmVyZmxvdygpO1xuICAgIHRvZ2dsZUJ1dHRvbnMoc2Nyb2xsT3ZlcmZsb3cpO1xuICAgIGNhbGN1bGF0ZVNjcm9sbFN0ZXAoKTtcbiAgfVxuXG5cbiAgLy8gRGVib3VuY2Ugc2V0dGluZyB0aGUgb3ZlcmZsb3cgd2l0aCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgY29uc3QgcmVxdWVzdFNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVvdXQpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aW1lb3V0KTtcblxuICAgIHRpbWVvdXQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHNldE92ZXJmbG93KCk7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8vIEdldHMgdGhlIG92ZXJmbG93IGF2YWlsYWJsZSBvbiB0aGUgbmF2IHNjcm9sbGVyXG4gIGNvbnN0IGdldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNjcm9sbFdpZHRoID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGg7XG4gICAgbGV0IHNjcm9sbFZpZXdwb3J0ID0gbmF2U2Nyb2xsZXJOYXYuY2xpZW50V2lkdGg7XG4gICAgbGV0IHNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0O1xuXG4gICAgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSBzY3JvbGxXaWR0aCAtIChzY3JvbGxWaWV3cG9ydCArIHNjcm9sbExlZnQpO1xuXG4gICAgLy8gMSBpbnN0ZWFkIG9mIDAgdG8gY29tcGVuc2F0ZSBmb3IgbnVtYmVyIHJvdW5kaW5nXG4gICAgbGV0IHNjcm9sbExlZnRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVMZWZ0ID4gMTtcbiAgICBsZXQgc2Nyb2xsUmlnaHRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVSaWdodCA+IDE7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhzY3JvbGxXaWR0aCwgc2Nyb2xsVmlld3BvcnQsIHNjcm9sbEF2YWlsYWJsZUxlZnQsIHNjcm9sbEF2YWlsYWJsZVJpZ2h0KTtcblxuICAgIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uICYmIHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2JvdGgnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2xlZnQnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuICdub25lJztcbiAgICB9XG5cbiAgfVxuXG5cbiAgLy8gQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHN0ZXAgYmFzZWQgb24gdGhlIHdpZHRoIG9mIHRoZSBzY3JvbGxlciBhbmQgdGhlIG51bWJlciBvZiBsaW5rc1xuICBjb25zdCBjYWxjdWxhdGVTY3JvbGxTdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJykge1xuICAgICAgbGV0IHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGggLSAocGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctbGVmdCcpKSArIHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpKTtcblxuICAgICAgbGV0IHNjcm9sbFN0ZXBBdmVyYWdlID0gTWF0aC5mbG9vcihzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyAvIG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zLmxlbmd0aCk7XG5cbiAgICAgIHNjcm9sbFN0ZXAgPSBzY3JvbGxTdGVwQXZlcmFnZTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIE1vdmUgdGhlIHNjcm9sbGVyIHdpdGggYSB0cmFuc2Zvcm1cbiAgY29uc3QgbW92ZVNjcm9sbGVyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG5cbiAgICBpZiAoc2Nyb2xsaW5nID09PSB0cnVlIHx8IChzY3JvbGxPdmVyZmxvdyAhPT0gZGlyZWN0aW9uICYmIHNjcm9sbE92ZXJmbG93ICE9PSAnYm90aCcpKSByZXR1cm47XG5cbiAgICBsZXQgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxTdGVwO1xuICAgIGxldCBzY3JvbGxBdmFpbGFibGUgPSBkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IHNjcm9sbEF2YWlsYWJsZUxlZnQgOiBzY3JvbGxBdmFpbGFibGVSaWdodDtcblxuICAgIC8vIElmIHRoZXJlIHdpbGwgYmUgbGVzcyB0aGFuIDI1JSBvZiB0aGUgbGFzdCBzdGVwIHZpc2libGUgdGhlbiBzY3JvbGwgdG8gdGhlIGVuZFxuICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCAoc2Nyb2xsU3RlcCAqIDEuNzUpKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbEF2YWlsYWJsZTtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSAqPSAtMTtcblxuICAgICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IHNjcm9sbFN0ZXApIHtcbiAgICAgICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NuYXAtYWxpZ24tZW5kJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIHNjcm9sbERpc3RhbmNlICsgJ3B4KSc7XG5cbiAgICBzY3JvbGxpbmdEaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgc2Nyb2xsaW5nID0gdHJ1ZTtcbiAgfVxuXG5cbiAgLy8gU2V0IHRoZSBzY3JvbGxlciBwb3NpdGlvbiBhbmQgcmVtb3ZlcyB0cmFuc2Zvcm0sIGNhbGxlZCBhZnRlciBtb3ZlU2Nyb2xsZXIoKSBpbiB0aGUgdHJhbnNpdGlvbmVuZCBldmVudFxuICBjb25zdCBzZXRTY3JvbGxlclBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50LCBudWxsKTtcbiAgICB2YXIgdHJhbnNmb3JtID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJyk7XG4gICAgdmFyIHRyYW5zZm9ybVZhbHVlID0gTWF0aC5hYnMocGFyc2VJbnQodHJhbnNmb3JtLnNwbGl0KCcsJylbNF0pIHx8IDApO1xuXG4gICAgaWYgKHNjcm9sbGluZ0RpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICB0cmFuc2Zvcm1WYWx1ZSAqPSAtMTtcbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbiAgICBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCArIHRyYW5zZm9ybVZhbHVlO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJywgJ3NuYXAtYWxpZ24tZW5kJyk7XG5cbiAgICBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgfVxuXG5cbiAgLy8gVG9nZ2xlIGJ1dHRvbnMgZGVwZW5kaW5nIG9uIG92ZXJmbG93XG4gIGNvbnN0IHRvZ2dsZUJ1dHRvbnMgPSBmdW5jdGlvbihvdmVyZmxvdykge1xuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAnbGVmdCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdyaWdodCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH1cblxuXG4gIGNvbnN0IGluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgIHNldE92ZXJmbG93KCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlck5hdi5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgc2V0U2Nyb2xsZXJQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJMZWZ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdsZWZ0Jyk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlclJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdyaWdodCcpO1xuICAgIH0pO1xuXG4gIH07XG5cblxuICAvLyBTZWxmIGluaXRcbiAgaW5pdCgpO1xuXG5cbiAgLy8gUmV2ZWFsIEFQSVxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcblxufTtcblxuLy9leHBvcnQgZGVmYXVsdCBQcmlvcml0eU5hdlNjcm9sbGVyO1xuIiwiLyoqXG4gKiBEbyB0aGVzZSB0aGluZ3MgYXMgcXVpY2tseSBhcyBwb3NzaWJsZTsgd2UgbWlnaHQgaGF2ZSBDU1Mgb3IgZWFybHkgc2NyaXB0cyB0aGF0IHJlcXVpcmUgb24gaXRcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ25vLWpzJyApO1xuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdqcycgKTtcbiIsIi8qKlxuICogVGhpcyBsb2FkcyBvdXIgZm9udHMgYW5kIGFkZHMgY2xhc3NlcyB0byB0aGUgSFRNTCBlbGVtZW50XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBGb250IEZhY2UgT2JzZXJ2ZXIgdjIuMS4wXG4gKlxuICovXG5cbi8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5pZiAoIHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgJiYgc2Vzc2lvblN0b3JhZ2Uuc2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsICkge1xuXHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkIHNhbnMtZm9udHMtbG9hZGVkJztcbn0gZWxzZSB7XG5cdC8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4xLjAgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oIGZ1bmN0aW9uKCkge1xuXHRcdCd1c2Ugc3RyaWN0Jzt2YXIgZixcblx0XHRcdGcgPSBbXTtmdW5jdGlvbiBsKCBhICkge1xuXHRcdFx0Zy5wdXNoKCBhICk7MSA9PSBnLmxlbmd0aCAmJiBmKCk7XG5cdFx0fSBmdW5jdGlvbiBtKCkge1xuXHRcdFx0Zm9yICggO2cubGVuZ3RoOyApIHtcblx0XHRcdFx0Z1swXSgpLCBnLnNoaWZ0KCk7XG5cdFx0XHR9XG5cdFx0fWYgPSBmdW5jdGlvbigpIHtcblx0XHRcdHNldFRpbWVvdXQoIG0gKTtcblx0XHR9O2Z1bmN0aW9uIG4oIGEgKSB7XG5cdFx0XHR0aGlzLmEgPSBwO3RoaXMuYiA9IHZvaWQgMDt0aGlzLmYgPSBbXTt2YXIgYiA9IHRoaXM7dHJ5IHtcblx0XHRcdFx0YSggZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0cSggYiwgYSApO1xuXHRcdFx0XHR9LCBmdW5jdGlvbiggYSApIHtcblx0XHRcdFx0XHRyKCBiLCBhICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gY2F0Y2ggKCBjICkge1xuXHRcdFx0XHRyKCBiLCBjICk7XG5cdFx0XHR9XG5cdFx0fSB2YXIgcCA9IDI7ZnVuY3Rpb24gdCggYSApIHtcblx0XHRcdHJldHVybiBuZXcgbiggZnVuY3Rpb24oIGIsIGMgKSB7XG5cdFx0XHRcdGMoIGEgKTtcblx0XHRcdH0gKTtcblx0XHR9IGZ1bmN0aW9uIHUoIGEgKSB7XG5cdFx0XHRyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBiICkge1xuXHRcdFx0XHRiKCBhICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBmdW5jdGlvbiBxKCBhLCBiICkge1xuXHRcdFx0aWYgKCBhLmEgPT0gcCApIHtcblx0XHRcdFx0aWYgKCBiID09IGEgKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcjtcblx0XHRcdFx0fSB2YXIgYyA9ICEgMTt0cnkge1xuXHRcdFx0XHRcdHZhciBkID0gYiAmJiBiLnRoZW47aWYgKCBudWxsICE9IGIgJiYgJ29iamVjdCcgPT09IHR5cGVvZiBiICYmICdmdW5jdGlvbicgPT09IHR5cGVvZiBkICkge1xuXHRcdFx0XHRcdFx0ZC5jYWxsKCBiLCBmdW5jdGlvbiggYiApIHtcblx0XHRcdFx0XHRcdFx0YyB8fCBxKCBhLCBiICk7YyA9ICEgMDtcblx0XHRcdFx0XHRcdH0sIGZ1bmN0aW9uKCBiICkge1xuXHRcdFx0XHRcdFx0XHRjIHx8IHIoIGEsIGIgKTtjID0gISAwO1xuXHRcdFx0XHRcdFx0fSApO3JldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKCBlICkge1xuXHRcdFx0XHRcdGMgfHwgciggYSwgZSApO3JldHVybjtcblx0XHRcdFx0fWEuYSA9IDA7YS5iID0gYjt2KCBhICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHIoIGEsIGIgKSB7XG5cdFx0XHRpZiAoIGEuYSA9PSBwICkge1xuXHRcdFx0XHRpZiAoIGIgPT0gYSApIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yO1xuXHRcdFx0XHR9YS5hID0gMTthLmIgPSBiO3YoIGEgKTtcblx0XHRcdH1cblx0XHR9IGZ1bmN0aW9uIHYoIGEgKSB7XG5cdFx0XHRsKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBhLmEgIT0gcCApIHtcblx0XHRcdFx0XHRmb3IgKCA7YS5mLmxlbmd0aDsgKSB7XG5cdFx0XHRcdFx0XHR2YXIgYiA9IGEuZi5zaGlmdCgpLFxuXHRcdFx0XHRcdFx0XHRjID0gYlswXSxcblx0XHRcdFx0XHRcdFx0ZCA9IGJbMV0sXG5cdFx0XHRcdFx0XHRcdGUgPSBiWzJdLFxuXHRcdFx0XHRcdFx0XHRiID0gYlszXTt0cnkge1xuXHRcdFx0XHRcdFx0XHQwID09IGEuYSA/ICdmdW5jdGlvbicgPT09IHR5cGVvZiBjID8gZSggYy5jYWxsKCB2b2lkIDAsIGEuYiApICkgOiBlKCBhLmIgKSA6IDEgPT0gYS5hICYmICggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGQgPyBlKCBkLmNhbGwoIHZvaWQgMCwgYS5iICkgKSA6IGIoIGEuYiApICk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoICggaCApIHtcblx0XHRcdFx0XHRcdFx0YiggaCApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1uLnByb3RvdHlwZS5nID0gZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jKCB2b2lkIDAsIGEgKTtcblx0XHR9O24ucHJvdG90eXBlLmMgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdHZhciBjID0gdGhpcztyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBkLCBlICkge1xuXHRcdFx0XHRjLmYucHVzaCggWyBhLCBiLCBkLCBlIF0gKTt2KCBjICk7XG5cdFx0XHR9ICk7XG5cdFx0fTtcblx0XHRmdW5jdGlvbiB3KCBhICkge1xuXHRcdFx0cmV0dXJuIG5ldyBuKCBmdW5jdGlvbiggYiwgYyApIHtcblx0XHRcdFx0ZnVuY3Rpb24gZCggYyApIHtcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGQgKSB7XG5cdFx0XHRcdFx0XHRoW2NdID0gZDtlICs9IDE7ZSA9PSBhLmxlbmd0aCAmJiBiKCBoICk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fSB2YXIgZSA9IDAsXG5cdFx0XHRcdFx0aCA9IFtdOzAgPT0gYS5sZW5ndGggJiYgYiggaCApO2ZvciAoIHZhciBrID0gMDtrIDwgYS5sZW5ndGg7ayArPSAxICkge1xuXHRcdFx0XHRcdHUoIGFba10gKS5jKCBkKCBrICksIGMgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0gZnVuY3Rpb24geCggYSApIHtcblx0XHRcdHJldHVybiBuZXcgbiggZnVuY3Rpb24oIGIsIGMgKSB7XG5cdFx0XHRcdGZvciAoIHZhciBkID0gMDtkIDwgYS5sZW5ndGg7ZCArPSAxICkge1xuXHRcdFx0XHRcdHUoIGFbZF0gKS5jKCBiLCBjICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9d2luZG93LlByb21pc2UgfHwgKCB3aW5kb3cuUHJvbWlzZSA9IG4sIHdpbmRvdy5Qcm9taXNlLnJlc29sdmUgPSB1LCB3aW5kb3cuUHJvbWlzZS5yZWplY3QgPSB0LCB3aW5kb3cuUHJvbWlzZS5yYWNlID0geCwgd2luZG93LlByb21pc2UuYWxsID0gdywgd2luZG93LlByb21pc2UucHJvdG90eXBlLnRoZW4gPSBuLnByb3RvdHlwZS5jLCB3aW5kb3cuUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2ggPSBuLnByb3RvdHlwZS5nICk7XG5cdH0oKSApO1xuXG5cdCggZnVuY3Rpb24oKSB7XG5cdFx0ZnVuY3Rpb24gbCggYSwgYiApIHtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPyBhLmFkZEV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCBiLCAhIDEgKSA6IGEuYXR0YWNoRXZlbnQoICdzY3JvbGwnLCBiICk7XG5cdFx0fSBmdW5jdGlvbiBtKCBhICkge1xuXHRcdFx0ZG9jdW1lbnQuYm9keSA/IGEoKSA6IGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uIGMoKSB7XG5cdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgYyApO2EoKTtcblx0XHRcdH0gKSA6IGRvY3VtZW50LmF0dGFjaEV2ZW50KCAnb25yZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24gaygpIHtcblx0XHRcdFx0aWYgKCAnaW50ZXJhY3RpdmUnID09IGRvY3VtZW50LnJlYWR5U3RhdGUgfHwgJ2NvbXBsZXRlJyA9PSBkb2N1bWVudC5yZWFkeVN0YXRlICkge1xuXHRcdFx0XHRcdGRvY3VtZW50LmRldGFjaEV2ZW50KCAnb25yZWFkeXN0YXRlY2hhbmdlJywgayApLCBhKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9IGZ1bmN0aW9uIHQoIGEgKSB7XG5cdFx0XHR0aGlzLmEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO3RoaXMuYS5zZXRBdHRyaWJ1dGUoICdhcmlhLWhpZGRlbicsICd0cnVlJyApO3RoaXMuYS5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIGEgKSApO3RoaXMuYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuZyA9IC0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0ID0gJ21heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4Oyc7dGhpcy5jLnN0eWxlLmNzc1RleHQgPSAnbWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7Jztcblx0XHRcdHRoaXMuZi5zdHlsZS5jc3NUZXh0ID0gJ21heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4Oyc7dGhpcy5oLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTsnO3RoaXMuYi5hcHBlbmRDaGlsZCggdGhpcy5oICk7dGhpcy5jLmFwcGVuZENoaWxkKCB0aGlzLmYgKTt0aGlzLmEuYXBwZW5kQ2hpbGQoIHRoaXMuYiApO3RoaXMuYS5hcHBlbmRDaGlsZCggdGhpcy5jICk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHUoIGEsIGIgKSB7XG5cdFx0XHRhLmEuc3R5bGUuY3NzVGV4dCA9ICdtYXgtd2lkdGg6bm9uZTttaW4td2lkdGg6MjBweDttaW4taGVpZ2h0OjIwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmF1dG87bWFyZ2luOjA7cGFkZGluZzowO3RvcDotOTk5cHg7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQtc3ludGhlc2lzOm5vbmU7Zm9udDonICsgYiArICc7Jztcblx0XHR9IGZ1bmN0aW9uIHooIGEgKSB7XG5cdFx0XHR2YXIgYiA9IGEuYS5vZmZzZXRXaWR0aCxcblx0XHRcdFx0YyA9IGIgKyAxMDA7YS5mLnN0eWxlLndpZHRoID0gYyArICdweCc7YS5jLnNjcm9sbExlZnQgPSBjO2EuYi5zY3JvbGxMZWZ0ID0gYS5iLnNjcm9sbFdpZHRoICsgMTAwO3JldHVybiBhLmcgIT09IGIgPyAoIGEuZyA9IGIsICEgMCApIDogISAxO1xuXHRcdH0gZnVuY3Rpb24gQSggYSwgYiApIHtcblx0XHRcdGZ1bmN0aW9uIGMoKSB7XG5cdFx0XHRcdHZhciBhID0gazt6KCBhICkgJiYgYS5hLnBhcmVudE5vZGUgJiYgYiggYS5nICk7XG5cdFx0XHR9IHZhciBrID0gYTtsKCBhLmIsIGMgKTtsKCBhLmMsIGMgKTt6KCBhICk7XG5cdFx0fSBmdW5jdGlvbiBCKCBhLCBiICkge1xuXHRcdFx0dmFyIGMgPSBiIHx8IHt9O3RoaXMuZmFtaWx5ID0gYTt0aGlzLnN0eWxlID0gYy5zdHlsZSB8fCAnbm9ybWFsJzt0aGlzLndlaWdodCA9IGMud2VpZ2h0IHx8ICdub3JtYWwnO3RoaXMuc3RyZXRjaCA9IGMuc3RyZXRjaCB8fCAnbm9ybWFsJztcblx0XHR9IHZhciBDID0gbnVsbCxcblx0XHRcdEQgPSBudWxsLFxuXHRcdFx0RSA9IG51bGwsXG5cdFx0XHRGID0gbnVsbDtmdW5jdGlvbiBHKCkge1xuXHRcdFx0aWYgKCBudWxsID09PSBEICkge1xuXHRcdFx0XHRpZiAoIEooKSAmJiAvQXBwbGUvLnRlc3QoIHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yICkgKSB7XG5cdFx0XHRcdFx0dmFyIGEgPSAvQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKSg/OlxcLihbMC05XSspKS8uZXhlYyggd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQgKTtEID0gISEgYSAmJiA2MDMgPiBwYXJzZUludCggYVsxXSwgMTAgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHREID0gISAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9IHJldHVybiBEO1xuXHRcdH0gZnVuY3Rpb24gSigpIHtcblx0XHRcdG51bGwgPT09IEYgJiYgKCBGID0gISEgZG9jdW1lbnQuZm9udHMgKTtyZXR1cm4gRjtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gSygpIHtcblx0XHRcdGlmICggbnVsbCA9PT0gRSApIHtcblx0XHRcdFx0dmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO3RyeSB7XG5cdFx0XHRcdFx0YS5zdHlsZS5mb250ID0gJ2NvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmJztcblx0XHRcdFx0fSBjYXRjaCAoIGIgKSB7fUUgPSAnJyAhPT0gYS5zdHlsZS5mb250O1xuXHRcdFx0fSByZXR1cm4gRTtcblx0XHR9IGZ1bmN0aW9uIEwoIGEsIGIgKSB7XG5cdFx0XHRyZXR1cm4gWyBhLnN0eWxlLCBhLndlaWdodCwgSygpID8gYS5zdHJldGNoIDogJycsICcxMDBweCcsIGIgXS5qb2luKCAnICcgKTtcblx0XHR9XG5cdFx0Qi5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0dmFyIGMgPSB0aGlzLFxuXHRcdFx0XHRrID0gYSB8fCAnQkVTYnN3eScsXG5cdFx0XHRcdHIgPSAwLFxuXHRcdFx0XHRuID0gYiB8fCAzRTMsXG5cdFx0XHRcdEggPSAoIG5ldyBEYXRlICkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZSggZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHRcdGlmICggSigpICYmICEgRygpICkge1xuXHRcdFx0XHRcdHZhciBNID0gbmV3IFByb21pc2UoIGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiBlKCkge1xuXHRcdFx0XHRcdFx0XHRcdCggbmV3IERhdGUgKS5nZXRUaW1lKCkgLSBIID49IG4gPyBiKCBFcnJvciggJycgKyBuICsgJ21zIHRpbWVvdXQgZXhjZWVkZWQnICkgKSA6IGRvY3VtZW50LmZvbnRzLmxvYWQoIEwoIGMsICdcIicgKyBjLmZhbWlseSArICdcIicgKSwgayApLnRoZW4oIGZ1bmN0aW9uKCBjICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0MSA8PSBjLmxlbmd0aCA/IGEoKSA6IHNldFRpbWVvdXQoIGUsIDI1ICk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgYiApO1xuXHRcdFx0XHRcdFx0XHR9ZSgpO1xuXHRcdFx0XHRcdFx0fSApLFxuXHRcdFx0XHRcdFx0TiA9IG5ldyBQcm9taXNlKCBmdW5jdGlvbiggYSwgYyApIHtcblx0XHRcdFx0XHRcdFx0ciA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdGMoIEVycm9yKCAnJyArIG4gKyAnbXMgdGltZW91dCBleGNlZWRlZCcgKSApO1xuXHRcdFx0XHRcdFx0XHR9LCBuICk7XG5cdFx0XHRcdFx0XHR9ICk7UHJvbWlzZS5yYWNlKCBbIE4sIE0gXSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCByICk7YSggYyApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YiApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG0oIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gdigpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGI7aWYgKCBiID0gLTEgIT0gZiAmJiAtMSAhPSBnIHx8IC0xICE9IGYgJiYgLTEgIT0gaCB8fCAtMSAhPSBnICYmIC0xICE9IGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0KCBiID0gZiAhPSBnICYmIGYgIT0gaCAmJiBnICE9IGggKSB8fCAoIG51bGwgPT09IEMgJiYgKCBiID0gL0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMoIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50ICksIEMgPSAhISBiICYmICggNTM2ID4gcGFyc2VJbnQoIGJbMV0sIDEwICkgfHwgNTM2ID09PSBwYXJzZUludCggYlsxXSwgMTAgKSAmJiAxMSA+PSBwYXJzZUludCggYlsyXSwgMTAgKSApICksIGIgPSBDICYmICggZiA9PSB3ICYmIGcgPT0gdyAmJiBoID09IHcgfHwgZiA9PSB4ICYmIGcgPT0geCAmJiBoID09IHggfHwgZiA9PSB5ICYmIGcgPT0geSAmJiBoID09IHkgKSApLCBiID0gISBiO1xuXHRcdFx0XHRcdFx0XHR9YiAmJiAoIGQucGFyZW50Tm9kZSAmJiBkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIGQgKSwgY2xlYXJUaW1lb3V0KCByICksIGEoIGMgKSApO1xuXHRcdFx0XHRcdFx0fSBmdW5jdGlvbiBJKCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICggbmV3IERhdGUgKS5nZXRUaW1lKCkgLSBIID49IG4gKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZC5wYXJlbnROb2RlICYmIGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZCApLCBiKCBFcnJvciggJycgK1xuXHRuICsgJ21zIHRpbWVvdXQgZXhjZWVkZWQnICkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgYSA9IGRvY3VtZW50LmhpZGRlbjtpZiAoICEgMCA9PT0gYSB8fCB2b2lkIDAgPT09IGEgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmID0gZS5hLm9mZnNldFdpZHRoLCBnID0gcC5hLm9mZnNldFdpZHRoLCBoID0gcS5hLm9mZnNldFdpZHRoLCB2KCk7XG5cdFx0XHRcdFx0XHRcdFx0fXIgPSBzZXRUaW1lb3V0KCBJLCA1MCApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IHZhciBlID0gbmV3IHQoIGsgKSxcblx0XHRcdFx0XHRcdFx0cCA9IG5ldyB0KCBrICksXG5cdFx0XHRcdFx0XHRcdHEgPSBuZXcgdCggayApLFxuXHRcdFx0XHRcdFx0XHRmID0gLTEsXG5cdFx0XHRcdFx0XHRcdGcgPSAtMSxcblx0XHRcdFx0XHRcdFx0aCA9IC0xLFxuXHRcdFx0XHRcdFx0XHR3ID0gLTEsXG5cdFx0XHRcdFx0XHRcdHggPSAtMSxcblx0XHRcdFx0XHRcdFx0eSA9IC0xLFxuXHRcdFx0XHRcdFx0XHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtkLmRpciA9ICdsdHInO3UoIGUsIEwoIGMsICdzYW5zLXNlcmlmJyApICk7dSggcCwgTCggYywgJ3NlcmlmJyApICk7dSggcSwgTCggYywgJ21vbm9zcGFjZScgKSApO2QuYXBwZW5kQ2hpbGQoIGUuYSApO2QuYXBwZW5kQ2hpbGQoIHAuYSApO2QuYXBwZW5kQ2hpbGQoIHEuYSApO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGQgKTt3ID0gZS5hLm9mZnNldFdpZHRoO3ggPSBwLmEub2Zmc2V0V2lkdGg7eSA9IHEuYS5vZmZzZXRXaWR0aDtJKCk7QSggZSwgZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0XHRcdGYgPSBhO3YoKTtcblx0XHRcdFx0XHRcdH0gKTt1KCBlLFxuXHRcdFx0XHRcdFx0XHRMKCBjLCAnXCInICsgYy5mYW1pbHkgKyAnXCIsc2Fucy1zZXJpZicgKSApO0EoIHAsIGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHRcdFx0XHRnID0gYTt2KCk7XG5cdFx0XHRcdFx0XHR9ICk7dSggcCwgTCggYywgJ1wiJyArIGMuZmFtaWx5ICsgJ1wiLHNlcmlmJyApICk7QSggcSwgZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0XHRcdGggPSBhO3YoKTtcblx0XHRcdFx0XHRcdH0gKTt1KCBxLCBMKCBjLCAnXCInICsgYy5mYW1pbHkgKyAnXCIsbW9ub3NwYWNlJyApICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fTsnb2JqZWN0JyA9PT0gdHlwZW9mIG1vZHVsZSA/IG1vZHVsZS5leHBvcnRzID0gQiA6ICggd2luZG93LkZvbnRGYWNlT2JzZXJ2ZXIgPSBCLCB3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZCA9IEIucHJvdG90eXBlLmxvYWQgKTtcblx0fSgpICk7XG5cblx0Ly8gbWlubnBvc3QgZm9udHNcblxuXHQvLyBzYW5zXG5cdHZhciBzYW5zTm9ybWFsID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoICdmZi1tZXRhLXdlYi1wcm8nICk7XG5cdHZhciBzYW5zQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNhbnNOb3JtYWxJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA0MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cblx0Ly8gc2VyaWZcblx0dmFyIHNlcmlmQm9vayA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDUwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9va0l0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDUwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9sZEl0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQmxhY2sgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA5MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJsYWNrSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogOTAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXG5cdFByb21pc2UuYWxsKCBbXG5cdFx0c2Fuc05vcm1hbC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc0JvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNOb3JtYWxJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9vay5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb29rSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9sZEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCbGFjay5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCbGFja0l0YWxpYy5sb2FkKCBudWxsLCAzMDAwIClcblx0XSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzZXJpZi1mb250cy1sb2FkZWQnO1xuXG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsID0gdHJ1ZTtcblx0fSApO1xuXG5cdFByb21pc2UuYWxsKCBbXG5cdFx0c2Fuc05vcm1hbC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc0JvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNOb3JtYWxJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApXG5cdF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2Fucy1mb250cy1sb2FkZWQnO1xuXG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG59XG5cbiIsIi8qKlxuICogVGhpcyBpcyB1c2VkIHRvIGNhdXNlIEdvb2dsZSBBbmFseXRpY3MgZXZlbnRzIHRvIHJ1blxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuZnVuY3Rpb24gbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgdmFsdWUgKSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdH1cblx0XHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3Igc2hhcmluZyBjb250ZW50XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8vIHRyYWNrIGEgc2hhcmUgdmlhIGFuYWx5dGljcyBldmVudFxuZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gPSAnJyApIHtcblxuXHQvLyBpZiBhIG5vdCBsb2dnZWQgaW4gdXNlciB0cmllcyB0byBlbWFpbCwgZG9uJ3QgY291bnQgdGhhdCBhcyBhIHNoYXJlXG5cdGlmICggISBqUXVlcnkoICdib2R5JyApLmhhc0NsYXNzKCAnbG9nZ2VkLWluJyApICYmICdFbWFpbCcgPT09IHRleHQgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGNhdGVnb3J5ID0gJ1NoYXJlJztcblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0Y2F0ZWdvcnkgPSAnU2hhcmUgLSAnICsgcG9zaXRpb247XG5cdH1cblxuXHQvLyB0cmFjayBhcyBhbiBldmVudCwgYW5kIGFzIHNvY2lhbCBpZiBpdCBpcyB0d2l0dGVyIG9yIGZiXG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnksIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgfHwgJ1R3aXR0ZXInID09PSB0ZXh0ICkge1xuXHRcdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0ICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuLy8gY29weSB0aGUgY3VycmVudCBVUkwgdG8gdGhlIHVzZXIncyBjbGlwYm9hcmRcbmZ1bmN0aW9uIGNvcHlDdXJyZW50VVJMKCkge1xuXHR2YXIgZHVtbXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW5wdXQnICksXG5cdFx0dGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkdW1teSApO1xuXHRkdW1teS52YWx1ZSA9IHRleHQ7XG5cdGR1bW15LnNlbGVjdCgpO1xuXHRkb2N1bWVudC5leGVjQ29tbWFuZCggJ2NvcHknICk7XG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoIGR1bW15ICk7XG59XG5cbi8vIHRvcCBzaGFyZSBidXR0b24gY2xpY2tcbiQoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLmRhdGEoICdzaGFyZS1hY3Rpb24nICk7XG5cdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSApO1xuXG4vLyB3aGVuIHRoZSBwcmludCBidXR0b24gaXMgY2xpY2tlZFxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXByaW50IGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHdpbmRvdy5wcmludCgpO1xufSApO1xuXG4vLyB3aGVuIHRoZSByZXB1Ymxpc2ggYnV0dG9uIGlzIGNsaWNrZWRcbi8vIHRoZSBwbHVnaW4gY29udHJvbHMgdGhlIHJlc3QsIGJ1dCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGUgZGVmYXVsdCBldmVudCBkb2Vzbid0IGZpcmVcbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1yZXB1Ymxpc2ggYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcbn0gKTtcblxuLy8gd2hlbiB0aGUgY29weSBsaW5rIGJ1dHRvbiBpcyBjbGlja2VkXG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtY29weS11cmwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGNvcHlDdXJyZW50VVJMKCk7XG5cdHRsaXRlLnNob3coICggZS50YXJnZXQgKSwgeyBncmF2OiAndycgfSApO1xuXHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHR0bGl0ZS5oaWRlKCAoIGUudGFyZ2V0ICkgKTtcblx0fSwgMzAwMCApO1xuXHRyZXR1cm4gZmFsc2U7XG59ICk7XG5cbi8vIHdoZW4gc2hhcmluZyB2aWEgZmFjZWJvb2ssIHR3aXR0ZXIsIG9yIGVtYWlsLCBvcGVuIHRoZSBkZXN0aW5hdGlvbiB1cmwgaW4gYSBuZXcgd2luZG93XG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZmFjZWJvb2sgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtdHdpdHRlciBhLCAubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1lbWFpbCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR2YXIgdXJsID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXHR3aW5kb3cub3BlbiggdXJsLCAnX2JsYW5rJyApO1xufSApO1xuIiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogTmF2aWdhdGlvbiBzY3JpcHRzLiBJbmNsdWRlcyBtb2JpbGUgb3IgdG9nZ2xlIGJlaGF2aW9yLCBhbmFseXRpY3MgdHJhY2tpbmcgb2Ygc3BlY2lmaWMgbWVudXMuXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqL1xuXG5mdW5jdGlvbiBzZXR1cFByaW1hcnlOYXYoKSB7XG5cdGNvbnN0IHByaW1hcnlOYXZUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcubS1tZW51LXByaW1hcnktbGlua3MnICksXG5cdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0ZGlzcGxheVZhbHVlOiAnZmxleCdcblx0fSApO1xuXG5cdHZhciBwcmltYXJ5TmF2VG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ25hdiBidXR0b24nICk7XG5cdGlmICggbnVsbCAhPT0gcHJpbWFyeU5hdlRvZ2dsZSApIHtcblx0XHRwcmltYXJ5TmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0Y29uc3QgdXNlck5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy55b3VyLW1pbm5wb3N0LWFjY291bnQgdWwnICksXG5cdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0ZGlzcGxheVZhbHVlOiAnZmxleCdcblx0fSApO1xuXG5cdHZhciB1c2VyTmF2VG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy55b3VyLW1pbm5wb3N0LWFjY291bnQgPiBhJyApO1xuXHRpZiAoIG51bGwgIT09IHVzZXJOYXZUb2dnbGUgKSB7XG5cdFx0dXNlck5hdlRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHZhciB0YXJnZXQgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IC5tLWZvcm0tc2VhcmNoIGZpZWxkc2V0IC5hLWJ1dHRvbi1zZW50ZW5jZScgKTtcblx0aWYgKCBudWxsICE9PSB0YXJnZXQgKSB7XG5cdFx0dmFyIGRpdiAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0ZGl2LmlubmVySFRNTCA9ICc8YSBocmVmPVwiI1wiIGNsYXNzPVwiYS1jbG9zZS1idXR0b24gYS1jbG9zZS1zZWFyY2hcIj48aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT48L2E+Jztcblx0XHR2YXIgZnJhZ21lbnQgID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGRpdi5zZXRBdHRyaWJ1dGUoICdjbGFzcycsICdhLWNsb3NlLWhvbGRlcicgKTtcblx0XHRmcmFnbWVudC5hcHBlbmRDaGlsZCggZGl2ICk7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xuXG5cdFx0Y29uc3Qgc2VhcmNoVHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcubS1tZW51LXByaW1hcnktYWN0aW9ucyAubS1mb3JtLXNlYXJjaCcgKSxcblx0XHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdFx0ZGlzcGxheVZhbHVlOiAnZmxleCdcblx0XHR9ICk7XG5cblx0XHR2YXIgc2VhcmNoVmlzaWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICdsaS5zZWFyY2ggPiBhJyApO1xuXHRcdHNlYXJjaFZpc2libGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0dmFyIHNlYXJjaENsb3NlICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1zZWFyY2gnICk7XG5cdFx0c2VhcmNoQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0Ly8gZXNjYXBlIGtleSBwcmVzc1xuXHQkKCBkb2N1bWVudCApLmtleXVwKCBmdW5jdGlvbiggZSApIHtcblx0XHRpZiAoIDI3ID09PSBlLmtleUNvZGUgKSB7XG5cdFx0XHRsZXQgcHJpbWFyeU5hdkV4cGFuZGVkID0gJ3RydWUnID09PSBwcmltYXJ5TmF2VG9nZ2xlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRsZXQgdXNlck5hdkV4cGFuZGVkID0gJ3RydWUnID09PSB1c2VyTmF2VG9nZ2xlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRsZXQgc2VhcmNoSXNWaXNpYmxlID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHByaW1hcnlOYXZFeHBhbmRlZCAmJiB0cnVlID09PSBwcmltYXJ5TmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgcHJpbWFyeU5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgdXNlck5hdkV4cGFuZGVkICYmIHRydWUgPT09IHVzZXJOYXZFeHBhbmRlZCApIHtcblx0XHRcdFx0dXNlck5hdlRvZ2dsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISB1c2VyTmF2RXhwYW5kZWQgKTtcblx0XHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBzZWFyY2hJc1Zpc2libGUgJiYgdHJ1ZSA9PT0gc2VhcmNoSXNWaXNpYmxlICkge1xuXHRcdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHNlYXJjaElzVmlzaWJsZSApO1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcbn1cblxuZnVuY3Rpb24gc2V0dXBTY3JvbGxOYXYoIHNlbGVjdG9yLCBuYXZTZWxlY3RvciwgY29udGVudFNlbGVjdG9yICkge1xuXG5cdHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuXHR2YXIgaXNJRSA9IC9NU0lFfFRyaWRlbnQvLnRlc3QodWEpO1xuXHRpZiAoIGlzSUUgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gSW5pdCB3aXRoIGFsbCBvcHRpb25zIGF0IGRlZmF1bHQgc2V0dGluZ1xuXHRjb25zdCBwcmlvcml0eU5hdlNjcm9sbGVyRGVmYXVsdCA9IFByaW9yaXR5TmF2U2Nyb2xsZXIoIHtcblx0XHRzZWxlY3Rvcjogc2VsZWN0b3IsXG5cdFx0bmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yLFxuXHRcdGNvbnRlbnRTZWxlY3RvcjogY29udGVudFNlbGVjdG9yLFxuXHRcdGl0ZW1TZWxlY3RvcjogJ2xpLCBhJyxcblx0XHRidXR0b25MZWZ0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tbGVmdCcsXG5cdFx0YnV0dG9uUmlnaHRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1yaWdodCdcblxuXHRcdC8vc2Nyb2xsU3RlcDogJ2F2ZXJhZ2UnXG5cdH0gKTtcblxuXHQvLyBJbml0IG11bHRpcGxlIG5hdiBzY3JvbGxlcnMgd2l0aCB0aGUgc2FtZSBvcHRpb25zXG5cdC8qbGV0IG5hdlNjcm9sbGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYtc2Nyb2xsZXInKTtcblxuXHRuYXZTY3JvbGxlcnMuZm9yRWFjaCgoY3VycmVudFZhbHVlLCBjdXJyZW50SW5kZXgpID0+IHtcblx0ICBQcmlvcml0eU5hdlNjcm9sbGVyKHtcblx0ICAgIHNlbGVjdG9yOiBjdXJyZW50VmFsdWVcblx0ICB9KTtcblx0fSk7Ki9cbn1cblxuc2V0dXBQcmltYXJ5TmF2KCk7XG5cbmlmICggMCA8ICQoICcubS1zdWItbmF2aWdhdGlvbicgKS5sZW5ndGggKSB7XG5cdHNldHVwU2Nyb2xsTmF2KCAnLm0tc3ViLW5hdmlnYXRpb24nLCAnLm0tc3VibmF2LW5hdmlnYXRpb24nLCAnLm0tbWVudS1zdWItbmF2aWdhdGlvbicgKTtcbn1cbmlmICggMCA8ICQoICcubS1wYWdpbmF0aW9uLW5hdmlnYXRpb24nICkubGVuZ3RoICkge1xuXHRzZXR1cFNjcm9sbE5hdiggJy5tLXBhZ2luYXRpb24tbmF2aWdhdGlvbicsICcubS1wYWdpbmF0aW9uLWNvbnRhaW5lcicsICcubS1wYWdpbmF0aW9uLWxpc3QnICk7XG59XG5cbiQoICdhJywgJCggJy5vLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0dmFyIHdpZGdldFRpdGxlICAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXdpZGdldCcgKS5maW5kKCAnaDMnICkudGV4dCgpO1xuXHR2YXIgem9uZVRpdGxlICAgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0tem9uZScgKS5maW5kKCAnLmEtem9uZS10aXRsZScgKS50ZXh0KCk7XG5cdHZhciBzaWRlYmFyU2VjdGlvblRpdGxlID0gJyc7XG5cdGlmICggJycgIT09IHdpZGdldFRpdGxlICkge1xuXHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB3aWRnZXRUaXRsZTtcblx0fSBlbHNlIGlmICggJycgIT09IHpvbmVUaXRsZSApIHtcblx0XHRzaWRlYmFyU2VjdGlvblRpdGxlID0gem9uZVRpdGxlO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJTZWN0aW9uVGl0bGUgKTtcbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgZm9ybXNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxualF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICggdGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgJycgIT09IHRoaXMubm9kZVZhbHVlLnRyaW0oKSApO1xuXHR9ICk7XG59O1xuXG5mdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0cmV0dXJuIG1hcmt1cDtcbn1cblxuZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCggJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nICk7XG5cdHZhciByZXN0Um9vdCAgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0dmFyIGZ1bGxVcmwgICAgICAgICAgICA9IHJlc3RSb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdHZhciBjb25maXJtQ2hhbmdlICAgICAgPSAnJztcblx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdHZhciBuZXdQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIG9sZFByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0dmFyIGNvbnNvbGlkYXRlZEVtYWlscyA9IFtdO1xuXHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdHZhciBhamF4Rm9ybURhdGEgICAgICAgPSAnJztcblx0dmFyIHRoYXQgICAgICAgICAgICAgICA9ICcnO1xuXG5cdC8vIHN0YXJ0IG91dCB3aXRoIG5vIHByaW1hcnkvcmVtb3ZhbHMgY2hlY2tlZFxuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHQvLyBpZiB0aGVyZSBpcyBhIGxpc3Qgb2YgZW1haWxzIChub3QganVzdCBhIHNpbmdsZSBmb3JtIGZpZWxkKVxuXHRpZiAoIDAgPCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cblx0XHQvLyBpZiBhIHVzZXIgc2VsZWN0cyBhIG5ldyBwcmltYXJ5LCBtb3ZlIGl0IGludG8gdGhhdCBwb3NpdGlvblxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oKSB7XG5cblx0XHRcdG5ld1ByaW1hcnlFbWFpbCA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdG9sZFByaW1hcnlFbWFpbCA9ICQoICcjZW1haWwnICkudmFsKCk7XG5cdFx0XHRwcmltYXJ5SWQgICAgICAgPSAkKCB0aGlzICkucHJvcCggJ2lkJyApLnJlcGxhY2UoICdwcmltYXJ5X2VtYWlsXycsICcnICk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncHJpbWFyeS1jaGFuZ2UnICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlclxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblxuXHRcdFx0Ly8kKCB0aGlzICkucGFyZW50KCkuYWZ0ZXIoIGNvbmZpcm1DaGFuZ2UgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSB1c2VyIGZhY2luZyB2YWx1ZXNcblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG5ld1ByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3VzZXItZW1haWwtJyArIHByaW1hcnlJZCApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgbWFpbiBoaWRkZW4gZm9ybSB2YWx1ZVxuXHRcdFx0XHQkKCAnI2VtYWlsJyApLnZhbCggbmV3UHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gc3VibWl0IGZvcm0gdmFsdWVzLlxuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXG5cdFx0XHRcdC8vIHVuY2hlY2sgdGhlIHJhZGlvIGJ1dHRvblxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBmb3JtIHZhbHVlcyB0byB0aGUgb2xkIHByaW1hcnkgZW1haWxcblx0XHRcdFx0JCggJyNwcmltYXJ5X2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3JlbW92ZV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyByZW1vdmUgdGhlIGNvbmZpcm0gbWVzc2FnZVxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHJlbW92ZXMgYW4gZW1haWwsIHRha2UgaXQgYXdheSBmcm9tIHRoZSB2aXN1YWwgYW5kIGZyb20gdGhlIGZvcm1cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2hhbmdlJywgJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgIT09IGVtYWlsVG9SZW1vdmUgKSB7XG5cdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlciBmb3IgcmVtb3ZhbFxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0Ly8gaWYgY29uZmlybWVkLCByZW1vdmUgdGhlIGVtYWlsIGFuZCBzdWJtaXQgdGhlIGZvcm1cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGknICkuZmFkZU91dCggJ25vcm1hbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cblx0XHRcdFx0Ly9jb25zb2xlLmxvZyggJ3ZhbHVlIGlzICcgKyBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnICkuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvbiBhLWJ1dHRvbi1hZGQtdXNlci1lbWFpbFwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRuZXh0RW1haWxDb3VudCsrO1xuXHR9ICk7XG5cblx0JCggJ2lucHV0W3R5cGU9c3VibWl0XScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGJ1dHRvbiA9ICQoIHRoaXMgKTtcblx0XHR2YXIgYnV0dG9uRm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCAnZm9ybScgKTtcblx0XHRidXR0b25Gb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicsIGJ1dHRvbi52YWwoKSApO1xuXHR9ICk7XG5cblx0JCggJy5tLWVudHJ5LWNvbnRlbnQnICkub24oICdzdWJtaXQnLCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgZm9ybSA9ICQoIHRoaXMgKTtcblx0XHR2YXIgc3VibWl0dGluZ0J1dHRvbiA9IGZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJyApIHx8ICcnO1xuXG5cdFx0Ly8gaWYgdGhlcmUgaXMgbm8gc3VibWl0dGluZyBidXR0b24sIHBhc3MgaXQgYnkgQWpheFxuXHRcdGlmICggJycgPT09IHN1Ym1pdHRpbmdCdXR0b24gfHwgJ1NhdmUgQ2hhbmdlcycgIT09IHN1Ym1pdHRpbmdCdXR0b24gKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheEZvcm1EYXRhID0gZm9ybS5zZXJpYWxpemUoKTsgLy9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheEZvcm1EYXRhID0gYWpheEZvcm1EYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogZnVsbFVybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Qubm9uY2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0ZGF0YTogYWpheEZvcm1EYXRhXG5cdFx0XHR9ICkuZG9uZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5ld0VtYWlscyA9ICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKS5tYXAoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdH0gKS5nZXQoKTtcblx0XHRcdFx0JC5lYWNoKCBuZXdFbWFpbHMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSBuZXh0RW1haWxDb3VudCArIGluZGV4O1xuXHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkuYXBwZW5kKCAnPGxpIGlkPVwidXNlci1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtZW1haWwtcHJlZmVyZW5jZXNcIj48YSBocmVmPVwiL25ld3NsZXR0ZXJzLz9lbWFpbD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCB2YWx1ZSApICsgJ1wiPjxzbWFsbD5FbWFpbCBQcmVmZXJlbmNlczwvc21hbGw+PC9hPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLXJlbW92ZS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwicmVtb3ZlX2VtYWlsWycgKyBuZXh0RW1haWxDb3VudCArICddXCIgaWQ9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5SZW1vdmU8L3NtYWxsPjwvbGFiZWw+PC9saT48L3VsPjwvbGk+JyApO1xuXHRcdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCAkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCgpICsgJywnICsgdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggMCA9PT0gJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIGl0IHdvdWxkIGJlIG5pY2UgdG8gb25seSBsb2FkIHRoZSBmb3JtLCBidXQgdGhlbiBjbGljayBldmVudHMgc3RpbGwgZG9uJ3Qgd29ya1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIGFkZEF1dG9SZXNpemUoKSB7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICdbZGF0YS1hdXRvcmVzaXplXScgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGVsZW1lbnQgKSB7XG5cdFx0ZWxlbWVudC5zdHlsZS5ib3hTaXppbmcgPSAnYm9yZGVyLWJveCc7XG5cdFx0dmFyIG9mZnNldCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnaW5wdXQnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQudGFyZ2V0LnN0eWxlLmhlaWdodCA9ICdhdXRvJztcblx0XHRcdGV2ZW50LnRhcmdldC5zdHlsZS5oZWlnaHQgPSBldmVudC50YXJnZXQuc2Nyb2xsSGVpZ2h0ICsgb2Zmc2V0ICsgJ3B4Jztcblx0XHR9KTtcblx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSggJ2RhdGEtYXV0b3Jlc2l6ZScgKTtcblx0fSk7XG59XG5cbiQoIGRvY3VtZW50ICkuYWpheFN0b3AoIGZ1bmN0aW9uKCkge1xuXHR2YXIgY29tbWVudEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnI2xsY19jb21tZW50cycgKTtcblx0aWYgKCBudWxsICE9PSBjb21tZW50QXJlYSApIHtcblx0XHRhZGRBdXRvUmVzaXplKCk7XG5cdH1cbn0pO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIDAgPCAkKCAnLm0tZm9ybS1hY2NvdW50LXNldHRpbmdzJyApLmxlbmd0aCApIHtcblx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0fVxuXHR2YXIgYXV0b1Jlc2l6ZVRleHRhcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ1tkYXRhLWF1dG9yZXNpemVdJyApO1xuXHRpZiAoIG51bGwgIT09IGF1dG9SZXNpemVUZXh0YXJlYSApIHtcblx0XHRhZGRBdXRvUmVzaXplKCk7XG5cdH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgY29tbWVudHNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuLy8gYmFzZWQgb24gd2hpY2ggYnV0dG9uIHdhcyBjbGlja2VkLCBzZXQgdGhlIHZhbHVlcyBmb3IgdGhlIGFuYWx5dGljcyBldmVudCBhbmQgY3JlYXRlIGl0XG5mdW5jdGlvbiB0cmFja1Nob3dDb21tZW50cyggYWx3YXlzLCBpZCwgY2xpY2tWYWx1ZSApIHtcblx0dmFyIGFjdGlvbiAgICAgICAgICA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlQcmVmaXggPSAnJztcblx0dmFyIGNhdGVnb3J5U3VmZml4ID0gJyc7XG5cdHZhciBwb3NpdGlvbiAgICAgICAgPSAnJztcblx0cG9zaXRpb24gPSBpZC5yZXBsYWNlKCAnYWx3YXlzLXNob3ctY29tbWVudHMtJywgJycgKTtcblx0aWYgKCAnMScgPT09IGNsaWNrVmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09uJztcblx0fSBlbHNlIGlmICggJzAnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPZmYnO1xuXHR9IGVsc2Uge1xuXHRcdGFjdGlvbiA9ICdDbGljayc7XG5cdH1cblx0aWYgKCB0cnVlID09PSBhbHdheXMgKSB7XG5cdFx0Y2F0ZWdvcnlQcmVmaXggPSAnQWx3YXlzICc7XG5cdH1cblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbi5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgcG9zaXRpb24uc2xpY2UoIDEgKTtcblx0XHRjYXRlZ29yeVN1ZmZpeCA9ICcgLSAnICsgcG9zaXRpb247XG5cdH1cblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeVByZWZpeCArICdTaG93IENvbW1lbnRzJyArIGNhdGVnb3J5U3VmZml4LCBhY3Rpb24sIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59XG5cbi8vIHdoZW4gc2hvd2luZyBjb21tZW50cyBvbmNlLCB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1idXR0b24tc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR0cmFja1Nob3dDb21tZW50cyggZmFsc2UsICcnLCAnJyApO1xufSApO1xuXG4vLyBTZXQgdXNlciBtZXRhIHZhbHVlIGZvciBhbHdheXMgc2hvd2luZyBjb21tZW50cyBpZiB0aGF0IGJ1dHRvbiBpcyBjbGlja2VkXG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dmFyIHRoYXQgPSAkKCB0aGlzICk7XG5cdGlmICggdGhhdC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0fSBlbHNlIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHR9XG5cblx0Ly8gdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCB0cnVlLCB0aGF0LmF0dHIoICdpZCcgKSwgdGhhdC52YWwoKSApO1xuXG5cdC8vIHdlIGFscmVhZHkgaGF2ZSBhamF4dXJsIGZyb20gdGhlIHRoZW1lXG5cdCQuYWpheCgge1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHR1cmw6IHBhcmFtcy5hamF4dXJsLFxuXHRcdGRhdGE6IHtcblx0XHRcdCdhY3Rpb24nOiAnbWlubnBvc3RfbGFyZ29fbG9hZF9jb21tZW50c19zZXRfdXNlcl9tZXRhJyxcblx0XHRcdCd2YWx1ZSc6IHRoYXQudmFsKClcblx0XHR9LFxuXHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdCQoICcuYS1hbHdheXMtc2hvdy1jb21tZW50cy1yZXN1bHQnLCB0aGF0LnBhcmVudCgpICkuaHRtbCggcmVzcG9uc2UuZGF0YS5tZXNzYWdlICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IHJlc3BvbnNlLmRhdGEuc2hvdyApIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufSApO1xuXG4hZnVuY3Rpb24oIGQgKSB7XG5cdGlmICggIWQuY3VycmVudFNjcmlwdCApIHtcblx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdGFjdGlvbjogXCJsbGNfbG9hZF9jb21tZW50c1wiLFxuXHRcdFx0cG9zdDogJCggXCIjbGxjX3Bvc3RfaWRcIiApLnZhbCgpXG5cdFx0fTtcblx0XHQvLyBBamF4IHJlcXVlc3QgbGluay5cblx0XHR2YXIgbGxjYWpheHVybCA9ICQoIFwiI2xsY19hamF4X3VybFwiICkudmFsKCk7XG5cdFx0Ly8gRnVsbCB1cmwgdG8gZ2V0IGNvbW1lbnRzIChBZGRpbmcgcGFyYW1ldGVycykuXG5cdFx0dmFyIGNvbW1lbnRVcmwgPSBsbGNhamF4dXJsICsgJz8nICsgJC5wYXJhbSggZGF0YSApO1xuXHRcdC8vIFBlcmZvcm0gYWpheCByZXF1ZXN0LlxuXHRcdCQuZ2V0KCBjb21tZW50VXJsLCBmdW5jdGlvbiAoIHJlc3BvbnNlICkge1xuXHRcdFx0aWYgKCByZXNwb25zZSAhPT0gXCJcIiApIHtcblx0XHRcdFx0JCggXCIjbGxjX2NvbW1lbnRzXCIgKS5odG1sKCByZXNwb25zZSApO1xuXHRcdFx0XHQvLyBJbml0aWFsaXplIGNvbW1lbnRzIGFmdGVyIGxhenkgbG9hZGluZy5cblx0XHRcdFx0aWYgKCB3aW5kb3cuYWRkQ29tbWVudCAmJiB3aW5kb3cuYWRkQ29tbWVudC5pbml0ICkge1xuXHRcdFx0XHRcdHdpbmRvdy5hZGRDb21tZW50LmluaXQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBHZXQgdGhlIGNvbW1lbnQgbGkgaWQgZnJvbSB1cmwgaWYgZXhpc3QuXG5cdFx0XHRcdHZhciBjb21tZW50SWQgPSBkb2N1bWVudC5VUkwuc3Vic3RyKCBkb2N1bWVudC5VUkwuaW5kZXhPZiggXCIjY29tbWVudFwiICkgKTtcblx0XHRcdFx0Ly8gSWYgY29tbWVudCBpZCBmb3VuZCwgc2Nyb2xsIHRvIHRoYXQgY29tbWVudC5cblx0XHRcdFx0aWYgKCBjb21tZW50SWQuaW5kZXhPZiggJyNjb21tZW50JyApID4gLTEgKSB7XG5cdFx0XHRcdFx0JCggd2luZG93ICkuc2Nyb2xsVG9wKCAkKCBjb21tZW50SWQgKS5vZmZzZXQoKS50b3AgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxufSggZG9jdW1lbnQgKTsiLCIvKipcbiAqIE1ldGhvZHMgZm9yIGV2ZW50c1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxudmFyIHRhcmdldCAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1ldmVudHMtY2FsLWxpbmtzJyApO1xuaWYgKCBudWxsICE9PSB0YXJnZXQgKSB7XG4gICAgdmFyIGxpICAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdsaScgKTtcbiAgICBsaS5pbm5lckhUTUwgID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLWNhbGVuZGFyXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG4gICAgdmFyIGZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBsaS5zZXRBdHRyaWJ1dGUoICdjbGFzcycsICdhLWNsb3NlLWhvbGRlcicgKTtcbiAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggbGkgKTtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG59XG5cbmNvbnN0IGNhbGVuZGFyVHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcbiAgICBlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmEtZXZlbnRzLWNhbC1saW5rcycgKSxcbiAgICB2aXNpYmxlQ2xhc3M6ICdhLWV2ZW50cy1jYWwtbGluay12aXNpYmxlJyxcbiAgICBkaXNwbGF5VmFsdWU6ICdibG9jaydcbn0gKTtcblxudmFyIGNhbGVuZGFyVmlzaWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcubS1ldmVudC1kYXRldGltZSBhJyApO1xuaWYgKCBudWxsICE9PSBjYWxlbmRhclZpc2libGUgKSB7XG4gICAgY2FsZW5kYXJWaXNpYmxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gY2FsZW5kYXJWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG4gICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICBpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICB2YXIgY2FsZW5kYXJDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1jYWxlbmRhcicgKTtcbiAgICBjYWxlbmRhckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gY2FsZW5kYXJWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG4gICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICBpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICAgIH1cbiAgICB9ICk7XG59XG4iXX0=
}(jQuery));
