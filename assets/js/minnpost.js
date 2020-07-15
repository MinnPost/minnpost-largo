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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDAtc3RhcnQuanMiLCIwMS1mb250cy5qcyIsIjAyLWFuYWx5dGljcy5qcyIsIjAzLXNoYXJlLmpzIiwiMDQtbmF2aWdhdGlvbi5qcyIsIjA1LWZvcm1zLmpzIiwiMDYtY29tbWVudHMuanMiLCIwNy1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImRvY3VtZW50RWxlbWVudCIsInNlc3Npb25TdG9yYWdlIiwic2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsInNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsImciLCJwdXNoIiwibSIsInNoaWZ0IiwicCIsImIiLCJxIiwiYyIsInUiLCJUeXBlRXJyb3IiLCJ0aGVuIiwiY2FsbCIsInYiLCJoIiwicHJvdG90eXBlIiwidyIsImsiLCJ4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyYWNlIiwiYWxsIiwiY2F0Y2giLCJhdHRhY2hFdmVudCIsImJvZHkiLCJyZWFkeVN0YXRlIiwiZGV0YWNoRXZlbnQiLCJjcmVhdGVUZXh0Tm9kZSIsImNzc1RleHQiLCJ6Iiwid2lkdGgiLCJBIiwiQiIsImZhbWlseSIsIndlaWdodCIsInN0cmV0Y2giLCJDIiwiRCIsIkUiLCJGIiwiRyIsIkoiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidmVuZG9yIiwiZXhlYyIsInVzZXJBZ2VudCIsImZvbnRzIiwiSyIsImZvbnQiLCJMIiwiam9pbiIsImxvYWQiLCJIIiwiRGF0ZSIsImdldFRpbWUiLCJNIiwiTiIsInkiLCJJIiwiaGlkZGVuIiwiZGlyIiwiRm9udEZhY2VPYnNlcnZlciIsInNhbnNOb3JtYWwiLCJzYW5zQm9sZCIsInNhbnNOb3JtYWxJdGFsaWMiLCJzZXJpZkJvb2siLCJzZXJpZkJvb2tJdGFsaWMiLCJzZXJpZkJvbGQiLCJzZXJpZkJvbGRJdGFsaWMiLCJzZXJpZkJsYWNrIiwic2VyaWZCbGFja0l0YWxpYyIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsInR5cGUiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwidmFsdWUiLCJnYSIsImV2ZW50IiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsImpRdWVyeSIsImhhc0NsYXNzIiwiY29weUN1cnJlbnRVUkwiLCJkdW1teSIsImhyZWYiLCJzZWxlY3QiLCJleGVjQ29tbWFuZCIsIiQiLCJjbGljayIsImRhdGEiLCJwcmV2ZW50RGVmYXVsdCIsInByaW50IiwidXJsIiwiYXR0ciIsIm9wZW4iLCJzZXR1cFByaW1hcnlOYXYiLCJwcmltYXJ5TmF2VHJhbnNpdGlvbmVyIiwicHJpbWFyeU5hdlRvZ2dsZSIsImV4cGFuZGVkIiwidXNlck5hdlRyYW5zaXRpb25lciIsInVzZXJOYXZUb2dnbGUiLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCJrZXl1cCIsImtleUNvZGUiLCJwcmltYXJ5TmF2RXhwYW5kZWQiLCJ1c2VyTmF2RXhwYW5kZWQiLCJzZWFyY2hJc1Zpc2libGUiLCJzZXR1cFNjcm9sbE5hdiIsInByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0Iiwid2lkZ2V0VGl0bGUiLCJjbG9zZXN0IiwiZmluZCIsInpvbmVUaXRsZSIsInNpZGViYXJTZWN0aW9uVGl0bGUiLCJmbiIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwidHJpbSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJmb3JtIiwicmVzdFJvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxVcmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheEZvcm1EYXRhIiwidGhhdCIsInByb3AiLCJvbiIsInZhbCIsInJlcGxhY2UiLCJwYXJlbnQiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJnZXQiLCJwYXJlbnRzIiwiZmFkZU91dCIsImJlZm9yZSIsImJ1dHRvbiIsImJ1dHRvbkZvcm0iLCJzdWJtaXR0aW5nQnV0dG9uIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRvbmUiLCJtYXAiLCJpbmRleCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsImFkZEF1dG9SZXNpemUiLCJmb3JFYWNoIiwiYm94U2l6aW5nIiwib2Zmc2V0IiwiY2xpZW50SGVpZ2h0IiwiaGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0IiwiYWpheFN0b3AiLCJjb21tZW50QXJlYSIsImF1dG9SZXNpemVUZXh0YXJlYSIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiaWQiLCJjbGlja1ZhbHVlIiwiY2F0ZWdvcnlQcmVmaXgiLCJjYXRlZ29yeVN1ZmZpeCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJpcyIsImFqYXh1cmwiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJodG1sIiwibWVzc2FnZSIsImxp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QixDQUE4QixlQUE5QixDQUFYLElBQThELEtBQTdFO0FBQ0FvVSxJQUFBQSxlQUFlLENBQUMxVCxZQUFoQixDQUE4QixlQUE5QixFQUErQyxDQUFFK00sUUFBakQ7O0FBQ0EsUUFBSyxTQUFTQSxRQUFkLEVBQXlCO0FBQ3JCMEcsTUFBQUEsb0JBQW9CLENBQUM1UixjQUFyQjtBQUNILEtBRkQsTUFFTztBQUNINFIsTUFBQUEsb0JBQW9CLENBQUNqUyxjQUFyQjtBQUNIO0FBQ0osR0FURDtBQVdBLE1BQUltUyxhQUFhLEdBQUdqVyxRQUFRLENBQUNvRixhQUFULENBQXdCLG1CQUF4QixDQUFwQjtBQUNBNlEsRUFBQUEsYUFBYSxDQUFDaFcsZ0JBQWQsQ0FBZ0MsT0FBaEMsRUFBeUMsVUFBVUMsQ0FBVixFQUFjO0FBQ25EQSxJQUFBQSxDQUFDLENBQUMyTyxjQUFGO0FBQ0EsUUFBSVEsUUFBUSxHQUFHLFdBQVcyRyxlQUFlLENBQUNwVSxZQUFoQixDQUE4QixlQUE5QixDQUFYLElBQThELEtBQTdFO0FBQ0FvVSxJQUFBQSxlQUFlLENBQUMxVCxZQUFoQixDQUE4QixlQUE5QixFQUErQyxDQUFFK00sUUFBakQ7O0FBQ0EsUUFBSyxTQUFTQSxRQUFkLEVBQXlCO0FBQ3JCMEcsTUFBQUEsb0JBQW9CLENBQUM1UixjQUFyQjtBQUNILEtBRkQsTUFFTztBQUNINFIsTUFBQUEsb0JBQW9CLENBQUNqUyxjQUFyQjtBQUNIO0FBQ0osR0FURDtBQVVIIiwiZmlsZSI6Im1pbm5wb3N0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gdGxpdGUodCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLGZ1bmN0aW9uKGUpe3ZhciBpPWUudGFyZ2V0LG49dChpKTtufHwobj0oaT1pLnBhcmVudEVsZW1lbnQpJiZ0KGkpKSxuJiZ0bGl0ZS5zaG93KGksbiwhMCl9KX10bGl0ZS5zaG93PWZ1bmN0aW9uKHQsZSxpKXt2YXIgbj1cImRhdGEtdGxpdGVcIjtlPWV8fHt9LCh0LnRvb2x0aXB8fGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gbygpe3RsaXRlLmhpZGUodCwhMCl9ZnVuY3Rpb24gbCgpe3J8fChyPWZ1bmN0aW9uKHQsZSxpKXtmdW5jdGlvbiBuKCl7by5jbGFzc05hbWU9XCJ0bGl0ZSB0bGl0ZS1cIityK3M7dmFyIGU9dC5vZmZzZXRUb3AsaT10Lm9mZnNldExlZnQ7by5vZmZzZXRQYXJlbnQ9PT10JiYoZT1pPTApO3ZhciBuPXQub2Zmc2V0V2lkdGgsbD10Lm9mZnNldEhlaWdodCxkPW8ub2Zmc2V0SGVpZ2h0LGY9by5vZmZzZXRXaWR0aCxhPWkrbi8yO28uc3R5bGUudG9wPShcInNcIj09PXI/ZS1kLTEwOlwiblwiPT09cj9lK2wrMTA6ZStsLzItZC8yKStcInB4XCIsby5zdHlsZS5sZWZ0PShcIndcIj09PXM/aTpcImVcIj09PXM/aStuLWY6XCJ3XCI9PT1yP2krbisxMDpcImVcIj09PXI/aS1mLTEwOmEtZi8yKStcInB4XCJ9dmFyIG89ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksbD1pLmdyYXZ8fHQuZ2V0QXR0cmlidXRlKFwiZGF0YS10bGl0ZVwiKXx8XCJuXCI7by5pbm5lckhUTUw9ZSx0LmFwcGVuZENoaWxkKG8pO3ZhciByPWxbMF18fFwiXCIscz1sWzFdfHxcIlwiO24oKTt2YXIgZD1vLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVyblwic1wiPT09ciYmZC50b3A8MD8ocj1cIm5cIixuKCkpOlwiblwiPT09ciYmZC5ib3R0b20+d2luZG93LmlubmVySGVpZ2h0PyhyPVwic1wiLG4oKSk6XCJlXCI9PT1yJiZkLmxlZnQ8MD8ocj1cIndcIixuKCkpOlwid1wiPT09ciYmZC5yaWdodD53aW5kb3cuaW5uZXJXaWR0aCYmKHI9XCJlXCIsbigpKSxvLmNsYXNzTmFtZSs9XCIgdGxpdGUtdmlzaWJsZVwiLG99KHQsZCxlKSl9dmFyIHIscyxkO3JldHVybiB0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixvKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsbyksdC50b29sdGlwPXtzaG93OmZ1bmN0aW9uKCl7ZD10LnRpdGxlfHx0LmdldEF0dHJpYnV0ZShuKXx8ZCx0LnRpdGxlPVwiXCIsdC5zZXRBdHRyaWJ1dGUobixcIlwiKSxkJiYhcyYmKHM9c2V0VGltZW91dChsLGk/MTUwOjEpKX0saGlkZTpmdW5jdGlvbih0KXtpZihpPT09dCl7cz1jbGVhclRpbWVvdXQocyk7dmFyIGU9ciYmci5wYXJlbnROb2RlO2UmJmUucmVtb3ZlQ2hpbGQocikscj12b2lkIDB9fX19KHQsZSkpLnNob3coKX0sdGxpdGUuaGlkZT1mdW5jdGlvbih0LGUpe3QudG9vbHRpcCYmdC50b29sdGlwLmhpZGUoZSl9LFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9dGxpdGUpOyIsIi8qKiBcbiAqIExpYnJhcnkgY29kZVxuICogVXNpbmcgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvQGNsb3VkZm91ci90cmFuc2l0aW9uLWhpZGRlbi1lbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoe1xuICBlbGVtZW50LFxuICB2aXNpYmxlQ2xhc3MsXG4gIHdhaXRNb2RlID0gJ3RyYW5zaXRpb25lbmQnLFxuICB0aW1lb3V0RHVyYXRpb24sXG4gIGhpZGVNb2RlID0gJ2hpZGRlbicsXG4gIGRpc3BsYXlWYWx1ZSA9ICdibG9jaydcbn0pIHtcbiAgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcgJiYgdHlwZW9mIHRpbWVvdXREdXJhdGlvbiAhPT0gJ251bWJlcicpIHtcbiAgICBjb25zb2xlLmVycm9yKGBcbiAgICAgIFdoZW4gY2FsbGluZyB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCB3aXRoIHdhaXRNb2RlIHNldCB0byB0aW1lb3V0LFxuICAgICAgeW91IG11c3QgcGFzcyBpbiBhIG51bWJlciBmb3IgdGltZW91dER1cmF0aW9uLlxuICAgIGApO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRG9uJ3Qgd2FpdCBmb3IgZXhpdCB0cmFuc2l0aW9ucyBpZiBhIHVzZXIgcHJlZmVycyByZWR1Y2VkIG1vdGlvbi5cbiAgLy8gSWRlYWxseSB0cmFuc2l0aW9ucyB3aWxsIGJlIGRpc2FibGVkIGluIENTUywgd2hpY2ggbWVhbnMgd2Ugc2hvdWxkIG5vdCB3YWl0XG4gIC8vIGJlZm9yZSBhZGRpbmcgYGhpZGRlbmAuXG4gIGlmICh3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKS5tYXRjaGVzKSB7XG4gICAgd2FpdE1vZGUgPSAnaW1tZWRpYXRlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBldmVudCBsaXN0ZW5lciB0byBhZGQgYGhpZGRlbmAgYWZ0ZXIgb3VyIGFuaW1hdGlvbnMgY29tcGxldGUuXG4gICAqIFRoaXMgbGlzdGVuZXIgd2lsbCByZW1vdmUgaXRzZWxmIGFmdGVyIGNvbXBsZXRpbmcuXG4gICAqL1xuICBjb25zdCBsaXN0ZW5lciA9IGUgPT4ge1xuICAgIC8vIENvbmZpcm0gYHRyYW5zaXRpb25lbmRgIHdhcyBjYWxsZWQgb24gIG91ciBgZWxlbWVudGAgYW5kIGRpZG4ndCBidWJibGVcbiAgICAvLyB1cCBmcm9tIGEgY2hpbGQgZWxlbWVudC5cbiAgICBpZiAoZS50YXJnZXQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFwcGx5SGlkZGVuQXR0cmlidXRlcyA9ICgpID0+IHtcbiAgICBpZihoaWRlTW9kZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogU2hvdyB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25TaG93KCkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGlzIGxpc3RlbmVyIHNob3VsZG4ndCBiZSBoZXJlIGJ1dCBpZiBzb21lb25lIHNwYW1zIHRoZSB0b2dnbGVcbiAgICAgICAqIG92ZXIgYW5kIG92ZXIgcmVhbGx5IGZhc3QgaXQgY2FuIGluY29ycmVjdGx5IHN0aWNrIGFyb3VuZC5cbiAgICAgICAqIFdlIHJlbW92ZSBpdCBqdXN0IHRvIGJlIHNhZmUuXG4gICAgICAgKi9cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBTaW1pbGFybHksIHdlJ2xsIGNsZWFyIHRoZSB0aW1lb3V0IGluIGNhc2UgaXQncyBzdGlsbCBoYW5naW5nIGFyb3VuZC5cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgIH1cblxuICAgICAgcmVtb3ZlSGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICAvKipcbiAgICAgICAqIEZvcmNlIGEgYnJvd3NlciByZS1wYWludCBzbyB0aGUgYnJvd3NlciB3aWxsIHJlYWxpemUgdGhlXG4gICAgICAgKiBlbGVtZW50IGlzIG5vIGxvbmdlciBgaGlkZGVuYCBhbmQgYWxsb3cgdHJhbnNpdGlvbnMuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHJlZmxvdyA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSGlkZSB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25IaWRlKCkge1xuICAgICAgaWYgKHdhaXRNb2RlID09PSAndHJhbnNpdGlvbmVuZCcpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuICAgICAgfSBlbHNlIGlmICh3YWl0TW9kZSA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuICAgICAgICB9LCB0aW1lb3V0RHVyYXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCB0aGlzIGNsYXNzIHRvIHRyaWdnZXIgb3VyIGFuaW1hdGlvblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHZpc2libGVDbGFzcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZSB0aGUgZWxlbWVudCdzIHZpc2liaWxpdHlcbiAgICAgKi9cbiAgICB0b2dnbGUoKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbigpKSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvblNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGVsbCB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIGhpZGRlbiBvciBub3QuXG4gICAgICovXG4gICAgaXNIaWRkZW4oKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBoaWRkZW4gYXR0cmlidXRlIGRvZXMgbm90IHJlcXVpcmUgYSB2YWx1ZS4gU2luY2UgYW4gZW1wdHkgc3RyaW5nIGlzXG4gICAgICAgKiBmYWxzeSwgYnV0IHNob3dzIHRoZSBwcmVzZW5jZSBvZiBhbiBhdHRyaWJ1dGUgd2UgY29tcGFyZSB0byBgbnVsbGBcbiAgICAgICAqL1xuICAgICAgY29uc3QgaGFzSGlkZGVuQXR0cmlidXRlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hpZGRlbicpICE9PSBudWxsO1xuXG4gICAgICBjb25zdCBpc0Rpc3BsYXlOb25lID0gZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZSc7XG5cbiAgICAgIGNvbnN0IGhhc1Zpc2libGVDbGFzcyA9IFsuLi5lbGVtZW50LmNsYXNzTGlzdF0uaW5jbHVkZXModmlzaWJsZUNsYXNzKTtcblxuICAgICAgcmV0dXJuIGhhc0hpZGRlbkF0dHJpYnV0ZSB8fCBpc0Rpc3BsYXlOb25lIHx8ICFoYXNWaXNpYmxlQ2xhc3M7XG4gICAgfSxcblxuICAgIC8vIEEgcGxhY2Vob2xkZXIgZm9yIG91ciBgdGltZW91dGBcbiAgICB0aW1lb3V0OiBudWxsXG4gIH07XG59IiwiLyoqXG4gIFByaW9yaXR5KyBob3Jpem9udGFsIHNjcm9sbGluZyBtZW51LlxuXG4gIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgLSBDb250YWluZXIgZm9yIGFsbCBvcHRpb25zLlxuICAgIEBwYXJhbSB7c3RyaW5nIHx8IERPTSBub2RlfSBzZWxlY3RvciAtIEVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IG5hdlNlbGVjdG9yIC0gTmF2IGVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRTZWxlY3RvciAtIENvbnRlbnQgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gaXRlbVNlbGVjdG9yIC0gSXRlbXMgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvbkxlZnRTZWxlY3RvciAtIExlZnQgYnV0dG9uIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBidXR0b25SaWdodFNlbGVjdG9yIC0gUmlnaHQgYnV0dG9uIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7aW50ZWdlciB8fCBzdHJpbmd9IHNjcm9sbFN0ZXAgLSBBbW91bnQgdG8gc2Nyb2xsIG9uIGJ1dHRvbiBjbGljay4gJ2F2ZXJhZ2UnIGdldHMgdGhlIGF2ZXJhZ2UgbGluayB3aWR0aC5cbiovXG5cbmNvbnN0IFByaW9yaXR5TmF2U2Nyb2xsZXIgPSBmdW5jdGlvbih7XG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXInLFxuICAgIG5hdlNlbGVjdG9yOiBuYXZTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLW5hdicsXG4gICAgY29udGVudFNlbGVjdG9yOiBjb250ZW50U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1jb250ZW50JyxcbiAgICBpdGVtU2VsZWN0b3I6IGl0ZW1TZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWl0ZW0nLFxuICAgIGJ1dHRvbkxlZnRTZWxlY3RvcjogYnV0dG9uTGVmdFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0JyxcbiAgICBidXR0b25SaWdodFNlbGVjdG9yOiBidXR0b25SaWdodFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItYnRuLS1yaWdodCcsXG4gICAgc2Nyb2xsU3RlcDogc2Nyb2xsU3RlcCA9IDgwXG4gIH0gPSB7fSkge1xuXG4gIGNvbnN0IG5hdlNjcm9sbGVyID0gdHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIDogc2VsZWN0b3I7XG5cbiAgY29uc3QgdmFsaWRhdGVTY3JvbGxTdGVwID0gKCkgPT4ge1xuICAgIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKHNjcm9sbFN0ZXApIHx8IHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJztcbiAgfVxuXG4gIGlmIChuYXZTY3JvbGxlciA9PT0gdW5kZWZpbmVkIHx8IG5hdlNjcm9sbGVyID09PSBudWxsIHx8ICF2YWxpZGF0ZVNjcm9sbFN0ZXAoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgc29tZXRoaW5nIHdyb25nLCBjaGVjayB5b3VyIG9wdGlvbnMuJyk7XG4gIH1cblxuICBjb25zdCBuYXZTY3JvbGxlck5hdiA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IobmF2U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckNvbnRlbnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGNvbnRlbnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zID0gbmF2U2Nyb2xsZXJDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoaXRlbVNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJMZWZ0ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihidXR0b25MZWZ0U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlclJpZ2h0ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihidXR0b25SaWdodFNlbGVjdG9yKTtcblxuICBsZXQgc2Nyb2xsaW5nID0gZmFsc2U7XG4gIGxldCBzY3JvbGxBdmFpbGFibGVMZWZ0ID0gMDtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID0gMDtcbiAgbGV0IHNjcm9sbGluZ0RpcmVjdGlvbiA9ICcnO1xuICBsZXQgc2Nyb2xsT3ZlcmZsb3cgPSAnJztcbiAgbGV0IHRpbWVvdXQ7XG5cblxuICAvLyBTZXRzIG92ZXJmbG93IGFuZCB0b2dnbGUgYnV0dG9ucyBhY2NvcmRpbmdseVxuICBjb25zdCBzZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIHNjcm9sbE92ZXJmbG93ID0gZ2V0T3ZlcmZsb3coKTtcbiAgICB0b2dnbGVCdXR0b25zKHNjcm9sbE92ZXJmbG93KTtcbiAgICBjYWxjdWxhdGVTY3JvbGxTdGVwKCk7XG4gIH1cblxuXG4gIC8vIERlYm91bmNlIHNldHRpbmcgdGhlIG92ZXJmbG93IHdpdGggcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIGNvbnN0IHJlcXVlc3RTZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aW1lb3V0KSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGltZW91dCk7XG5cbiAgICB0aW1lb3V0ID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBzZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuICB9XG5cblxuICAvLyBHZXRzIHRoZSBvdmVyZmxvdyBhdmFpbGFibGUgb24gdGhlIG5hdiBzY3JvbGxlclxuICBjb25zdCBnZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzY3JvbGxXaWR0aCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbFdpZHRoO1xuICAgIGxldCBzY3JvbGxWaWV3cG9ydCA9IG5hdlNjcm9sbGVyTmF2LmNsaWVudFdpZHRoO1xuICAgIGxldCBzY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdDtcblxuICAgIHNjcm9sbEF2YWlsYWJsZUxlZnQgPSBzY3JvbGxMZWZ0O1xuICAgIHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID0gc2Nyb2xsV2lkdGggLSAoc2Nyb2xsVmlld3BvcnQgKyBzY3JvbGxMZWZ0KTtcblxuICAgIC8vIDEgaW5zdGVhZCBvZiAwIHRvIGNvbXBlbnNhdGUgZm9yIG51bWJlciByb3VuZGluZ1xuICAgIGxldCBzY3JvbGxMZWZ0Q29uZGl0aW9uID0gc2Nyb2xsQXZhaWxhYmxlTGVmdCA+IDE7XG4gICAgbGV0IHNjcm9sbFJpZ2h0Q29uZGl0aW9uID0gc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPiAxO1xuXG4gICAgLy8gY29uc29sZS5sb2coc2Nyb2xsV2lkdGgsIHNjcm9sbFZpZXdwb3J0LCBzY3JvbGxBdmFpbGFibGVMZWZ0LCBzY3JvbGxBdmFpbGFibGVSaWdodCk7XG5cbiAgICBpZiAoc2Nyb2xsTGVmdENvbmRpdGlvbiAmJiBzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdib3RoJztcbiAgICB9XG4gICAgZWxzZSBpZiAoc2Nyb2xsTGVmdENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdsZWZ0JztcbiAgICB9XG4gICAgZWxzZSBpZiAoc2Nyb2xsUmlnaHRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAncmlnaHQnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiAnbm9uZSc7XG4gICAgfVxuXG4gIH1cblxuXG4gIC8vIENhbGN1bGF0ZXMgdGhlIHNjcm9sbCBzdGVwIGJhc2VkIG9uIHRoZSB3aWR0aCBvZiB0aGUgc2Nyb2xsZXIgYW5kIHRoZSBudW1iZXIgb2YgbGlua3NcbiAgY29uc3QgY2FsY3VsYXRlU2Nyb2xsU3RlcCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzY3JvbGxTdGVwID09PSAnYXZlcmFnZScpIHtcbiAgICAgIGxldCBzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbFdpZHRoIC0gKHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWxlZnQnKSkgKyBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1yaWdodCcpKSk7XG5cbiAgICAgIGxldCBzY3JvbGxTdGVwQXZlcmFnZSA9IE1hdGguZmxvb3Ioc2Nyb2xsVmlld3BvcnROb1BhZGRpbmcgLyBuYXZTY3JvbGxlckNvbnRlbnRJdGVtcy5sZW5ndGgpO1xuXG4gICAgICBzY3JvbGxTdGVwID0gc2Nyb2xsU3RlcEF2ZXJhZ2U7XG4gICAgfVxuICB9XG5cblxuICAvLyBNb3ZlIHRoZSBzY3JvbGxlciB3aXRoIGEgdHJhbnNmb3JtXG4gIGNvbnN0IG1vdmVTY3JvbGxlciA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuXG4gICAgaWYgKHNjcm9sbGluZyA9PT0gdHJ1ZSB8fCAoc2Nyb2xsT3ZlcmZsb3cgIT09IGRpcmVjdGlvbiAmJiBzY3JvbGxPdmVyZmxvdyAhPT0gJ2JvdGgnKSkgcmV0dXJuO1xuXG4gICAgbGV0IHNjcm9sbERpc3RhbmNlID0gc2Nyb2xsU3RlcDtcbiAgICBsZXQgc2Nyb2xsQXZhaWxhYmxlID0gZGlyZWN0aW9uID09PSAnbGVmdCcgPyBzY3JvbGxBdmFpbGFibGVMZWZ0IDogc2Nyb2xsQXZhaWxhYmxlUmlnaHQ7XG5cbiAgICAvLyBJZiB0aGVyZSB3aWxsIGJlIGxlc3MgdGhhbiAyNSUgb2YgdGhlIGxhc3Qgc3RlcCB2aXNpYmxlIHRoZW4gc2Nyb2xsIHRvIHRoZSBlbmRcbiAgICBpZiAoc2Nyb2xsQXZhaWxhYmxlIDwgKHNjcm9sbFN0ZXAgKiAxLjc1KSkge1xuICAgICAgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxBdmFpbGFibGU7XG4gICAgfVxuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgc2Nyb2xsRGlzdGFuY2UgKj0gLTE7XG5cbiAgICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCBzY3JvbGxTdGVwKSB7XG4gICAgICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QuYWRkKCdzbmFwLWFsaWduLWVuZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJyk7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKCcgKyBzY3JvbGxEaXN0YW5jZSArICdweCknO1xuXG4gICAgc2Nyb2xsaW5nRGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHNjcm9sbGluZyA9IHRydWU7XG4gIH1cblxuXG4gIC8vIFNldCB0aGUgc2Nyb2xsZXIgcG9zaXRpb24gYW5kIHJlbW92ZXMgdHJhbnNmb3JtLCBjYWxsZWQgYWZ0ZXIgbW92ZVNjcm9sbGVyKCkgaW4gdGhlIHRyYW5zaXRpb25lbmQgZXZlbnRcbiAgY29uc3Qgc2V0U2Nyb2xsZXJQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCwgbnVsbCk7XG4gICAgdmFyIHRyYW5zZm9ybSA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3RyYW5zZm9ybScpO1xuICAgIHZhciB0cmFuc2Zvcm1WYWx1ZSA9IE1hdGguYWJzKHBhcnNlSW50KHRyYW5zZm9ybS5zcGxpdCgnLCcpWzRdKSB8fCAwKTtcblxuICAgIGlmIChzY3JvbGxpbmdEaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuICAgICAgdHJhbnNmb3JtVmFsdWUgKj0gLTE7XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJyc7XG4gICAgbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQgKyB0cmFuc2Zvcm1WYWx1ZTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnbm8tdHJhbnNpdGlvbicsICdzbmFwLWFsaWduLWVuZCcpO1xuXG4gICAgc2Nyb2xsaW5nID0gZmFsc2U7XG4gIH1cblxuXG4gIC8vIFRvZ2dsZSBidXR0b25zIGRlcGVuZGluZyBvbiBvdmVyZmxvd1xuICBjb25zdCB0b2dnbGVCdXR0b25zID0gZnVuY3Rpb24ob3ZlcmZsb3cpIHtcbiAgICBpZiAob3ZlcmZsb3cgPT09ICdib3RoJyB8fCBvdmVyZmxvdyA9PT0gJ2xlZnQnKSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJMZWZ0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cblxuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAncmlnaHQnKSB7XG4gICAgICBuYXZTY3JvbGxlclJpZ2h0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuICB9XG5cblxuICBjb25zdCBpbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICBzZXRPdmVyZmxvdygpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHJlcXVlc3RTZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJOYXYuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsICgpID0+IHtcbiAgICAgIHNldFNjcm9sbGVyUG9zaXRpb24oKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyTGVmdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1vdmVTY3JvbGxlcignbGVmdCcpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJSaWdodC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1vdmVTY3JvbGxlcigncmlnaHQnKTtcbiAgICB9KTtcblxuICB9O1xuXG5cbiAgLy8gU2VsZiBpbml0XG4gIGluaXQoKTtcblxuXG4gIC8vIFJldmVhbCBBUElcbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG5cbn07XG5cbi8vZXhwb3J0IGRlZmF1bHQgUHJpb3JpdHlOYXZTY3JvbGxlcjtcbiIsIi8qKlxuICogRG8gdGhlc2UgdGhpbmdzIGFzIHF1aWNrbHkgYXMgcG9zc2libGU7IHdlIG1pZ2h0IGhhdmUgQ1NTIG9yIGVhcmx5IHNjcmlwdHMgdGhhdCByZXF1aXJlIG9uIGl0XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICduby1qcycgKTtcbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCAnanMnICk7XG4iLCIvKipcbiAqIFRoaXMgbG9hZHMgb3VyIGZvbnRzIGFuZCBhZGRzIGNsYXNzZXMgdG8gdGhlIEhUTUwgZWxlbWVudFxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgRm9udCBGYWNlIE9ic2VydmVyIHYyLjEuMFxuICpcbiAqL1xuXG4vLyBPcHRpbWl6YXRpb24gZm9yIFJlcGVhdCBWaWV3c1xuaWYgKCBzZXNzaW9uU3RvcmFnZS5zZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsICYmIHNlc3Npb25TdG9yYWdlLnNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCApIHtcblx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIHNlcmlmLWZvbnRzLWxvYWRlZCBzYW5zLWZvbnRzLWxvYWRlZCc7XG59IGVsc2Uge1xuXHQvKiBGb250IEZhY2UgT2JzZXJ2ZXIgdjIuMS4wIC0gwqkgQnJhbSBTdGVpbi4gTGljZW5zZTogQlNELTMtQ2xhdXNlICovKCBmdW5jdGlvbigpIHtcblx0XHQndXNlIHN0cmljdCc7dmFyIGYsXG5cdFx0XHRnID0gW107ZnVuY3Rpb24gbCggYSApIHtcblx0XHRcdGcucHVzaCggYSApOzEgPT0gZy5sZW5ndGggJiYgZigpO1xuXHRcdH0gZnVuY3Rpb24gbSgpIHtcblx0XHRcdGZvciAoIDtnLmxlbmd0aDsgKSB7XG5cdFx0XHRcdGdbMF0oKSwgZy5zaGlmdCgpO1xuXHRcdFx0fVxuXHRcdH1mID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRzZXRUaW1lb3V0KCBtICk7XG5cdFx0fTtmdW5jdGlvbiBuKCBhICkge1xuXHRcdFx0dGhpcy5hID0gcDt0aGlzLmIgPSB2b2lkIDA7dGhpcy5mID0gW107dmFyIGIgPSB0aGlzO3RyeSB7XG5cdFx0XHRcdGEoIGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHRcdHEoIGIsIGEgKTtcblx0XHRcdFx0fSwgZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0ciggYiwgYSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9IGNhdGNoICggYyApIHtcblx0XHRcdFx0ciggYiwgYyApO1xuXHRcdFx0fVxuXHRcdH0gdmFyIHAgPSAyO2Z1bmN0aW9uIHQoIGEgKSB7XG5cdFx0XHRyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBiLCBjICkge1xuXHRcdFx0XHRjKCBhICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBmdW5jdGlvbiB1KCBhICkge1xuXHRcdFx0cmV0dXJuIG5ldyBuKCBmdW5jdGlvbiggYiApIHtcblx0XHRcdFx0YiggYSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZnVuY3Rpb24gcSggYSwgYiApIHtcblx0XHRcdGlmICggYS5hID09IHAgKSB7XG5cdFx0XHRcdGlmICggYiA9PSBhICkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3I7XG5cdFx0XHRcdH0gdmFyIGMgPSAhIDE7dHJ5IHtcblx0XHRcdFx0XHR2YXIgZCA9IGIgJiYgYi50aGVuO2lmICggbnVsbCAhPSBiICYmICdvYmplY3QnID09PSB0eXBlb2YgYiAmJiAnZnVuY3Rpb24nID09PSB0eXBlb2YgZCApIHtcblx0XHRcdFx0XHRcdGQuY2FsbCggYiwgZnVuY3Rpb24oIGIgKSB7XG5cdFx0XHRcdFx0XHRcdGMgfHwgcSggYSwgYiApO2MgPSAhIDA7XG5cdFx0XHRcdFx0XHR9LCBmdW5jdGlvbiggYiApIHtcblx0XHRcdFx0XHRcdFx0YyB8fCByKCBhLCBiICk7YyA9ICEgMDtcblx0XHRcdFx0XHRcdH0gKTtyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoICggZSApIHtcblx0XHRcdFx0XHRjIHx8IHIoIGEsIGUgKTtyZXR1cm47XG5cdFx0XHRcdH1hLmEgPSAwO2EuYiA9IGI7diggYSApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiByKCBhLCBiICkge1xuXHRcdFx0aWYgKCBhLmEgPT0gcCApIHtcblx0XHRcdFx0aWYgKCBiID09IGEgKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcjtcblx0XHRcdFx0fWEuYSA9IDE7YS5iID0gYjt2KCBhICk7XG5cdFx0XHR9XG5cdFx0fSBmdW5jdGlvbiB2KCBhICkge1xuXHRcdFx0bCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggYS5hICE9IHAgKSB7XG5cdFx0XHRcdFx0Zm9yICggO2EuZi5sZW5ndGg7ICkge1xuXHRcdFx0XHRcdFx0dmFyIGIgPSBhLmYuc2hpZnQoKSxcblx0XHRcdFx0XHRcdFx0YyA9IGJbMF0sXG5cdFx0XHRcdFx0XHRcdGQgPSBiWzFdLFxuXHRcdFx0XHRcdFx0XHRlID0gYlsyXSxcblx0XHRcdFx0XHRcdFx0YiA9IGJbM107dHJ5IHtcblx0XHRcdFx0XHRcdFx0MCA9PSBhLmEgPyAnZnVuY3Rpb24nID09PSB0eXBlb2YgYyA/IGUoIGMuY2FsbCggdm9pZCAwLCBhLmIgKSApIDogZSggYS5iICkgOiAxID09IGEuYSAmJiAoICdmdW5jdGlvbicgPT09IHR5cGVvZiBkID8gZSggZC5jYWxsKCB2b2lkIDAsIGEuYiApICkgOiBiKCBhLmIgKSApO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoIGggKSB7XG5cdFx0XHRcdFx0XHRcdGIoIGggKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9bi5wcm90b3R5cGUuZyA9IGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYyggdm9pZCAwLCBhICk7XG5cdFx0fTtuLnByb3RvdHlwZS5jID0gZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHR2YXIgYyA9IHRoaXM7cmV0dXJuIG5ldyBuKCBmdW5jdGlvbiggZCwgZSApIHtcblx0XHRcdFx0Yy5mLnB1c2goIFsgYSwgYiwgZCwgZSBdICk7diggYyApO1xuXHRcdFx0fSApO1xuXHRcdH07XG5cdFx0ZnVuY3Rpb24gdyggYSApIHtcblx0XHRcdHJldHVybiBuZXcgbiggZnVuY3Rpb24oIGIsIGMgKSB7XG5cdFx0XHRcdGZ1bmN0aW9uIGQoIGMgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBkICkge1xuXHRcdFx0XHRcdFx0aFtjXSA9IGQ7ZSArPSAxO2UgPT0gYS5sZW5ndGggJiYgYiggaCApO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH0gdmFyIGUgPSAwLFxuXHRcdFx0XHRcdGggPSBbXTswID09IGEubGVuZ3RoICYmIGIoIGggKTtmb3IgKCB2YXIgayA9IDA7ayA8IGEubGVuZ3RoO2sgKz0gMSApIHtcblx0XHRcdFx0XHR1KCBhW2tdICkuYyggZCggayApLCBjICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9IGZ1bmN0aW9uIHgoIGEgKSB7XG5cdFx0XHRyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBiLCBjICkge1xuXHRcdFx0XHRmb3IgKCB2YXIgZCA9IDA7ZCA8IGEubGVuZ3RoO2QgKz0gMSApIHtcblx0XHRcdFx0XHR1KCBhW2RdICkuYyggYiwgYyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fXdpbmRvdy5Qcm9taXNlIHx8ICggd2luZG93LlByb21pc2UgPSBuLCB3aW5kb3cuUHJvbWlzZS5yZXNvbHZlID0gdSwgd2luZG93LlByb21pc2UucmVqZWN0ID0gdCwgd2luZG93LlByb21pc2UucmFjZSA9IHgsIHdpbmRvdy5Qcm9taXNlLmFsbCA9IHcsIHdpbmRvdy5Qcm9taXNlLnByb3RvdHlwZS50aGVuID0gbi5wcm90b3R5cGUuYywgd2luZG93LlByb21pc2UucHJvdG90eXBlLmNhdGNoID0gbi5wcm90b3R5cGUuZyApO1xuXHR9KCkgKTtcblxuXHQoIGZ1bmN0aW9uKCkge1xuXHRcdGZ1bmN0aW9uIGwoIGEsIGIgKSB7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyID8gYS5hZGRFdmVudExpc3RlbmVyKCAnc2Nyb2xsJywgYiwgISAxICkgOiBhLmF0dGFjaEV2ZW50KCAnc2Nyb2xsJywgYiApO1xuXHRcdH0gZnVuY3Rpb24gbSggYSApIHtcblx0XHRcdGRvY3VtZW50LmJvZHkgPyBhKCkgOiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyID8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiBjKCkge1xuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGMgKTthKCk7XG5cdFx0XHR9ICkgOiBkb2N1bWVudC5hdHRhY2hFdmVudCggJ29ucmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uIGsoKSB7XG5cdFx0XHRcdGlmICggJ2ludGVyYWN0aXZlJyA9PSBkb2N1bWVudC5yZWFkeVN0YXRlIHx8ICdjb21wbGV0ZScgPT0gZG9jdW1lbnQucmVhZHlTdGF0ZSApIHtcblx0XHRcdFx0XHRkb2N1bWVudC5kZXRhY2hFdmVudCggJ29ucmVhZHlzdGF0ZWNoYW5nZScsIGsgKSwgYSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSBmdW5jdGlvbiB0KCBhICkge1xuXHRcdFx0dGhpcy5hID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTt0aGlzLmEuc2V0QXR0cmlidXRlKCAnYXJpYS1oaWRkZW4nLCAndHJ1ZScgKTt0aGlzLmEuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCBhICkgKTt0aGlzLmIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTt0aGlzLmMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTt0aGlzLmggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTt0aGlzLmYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTt0aGlzLmcgPSAtMTt0aGlzLmIuc3R5bGUuY3NzVGV4dCA9ICdtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDsnO3RoaXMuYy5zdHlsZS5jc3NUZXh0ID0gJ21heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4Oyc7XG5cdFx0XHR0aGlzLmYuc3R5bGUuY3NzVGV4dCA9ICdtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDsnO3RoaXMuaC5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjIwMCU7aGVpZ2h0OjIwMCU7Zm9udC1zaXplOjE2cHg7bWF4LXdpZHRoOm5vbmU7Jzt0aGlzLmIuYXBwZW5kQ2hpbGQoIHRoaXMuaCApO3RoaXMuYy5hcHBlbmRDaGlsZCggdGhpcy5mICk7dGhpcy5hLmFwcGVuZENoaWxkKCB0aGlzLmIgKTt0aGlzLmEuYXBwZW5kQ2hpbGQoIHRoaXMuYyApO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB1KCBhLCBiICkge1xuXHRcdFx0YS5hLnN0eWxlLmNzc1RleHQgPSAnbWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6JyArIGIgKyAnOyc7XG5cdFx0fSBmdW5jdGlvbiB6KCBhICkge1xuXHRcdFx0dmFyIGIgPSBhLmEub2Zmc2V0V2lkdGgsXG5cdFx0XHRcdGMgPSBiICsgMTAwO2EuZi5zdHlsZS53aWR0aCA9IGMgKyAncHgnO2EuYy5zY3JvbGxMZWZ0ID0gYzthLmIuc2Nyb2xsTGVmdCA9IGEuYi5zY3JvbGxXaWR0aCArIDEwMDtyZXR1cm4gYS5nICE9PSBiID8gKCBhLmcgPSBiLCAhIDAgKSA6ICEgMTtcblx0XHR9IGZ1bmN0aW9uIEEoIGEsIGIgKSB7XG5cdFx0XHRmdW5jdGlvbiBjKCkge1xuXHRcdFx0XHR2YXIgYSA9IGs7eiggYSApICYmIGEuYS5wYXJlbnROb2RlICYmIGIoIGEuZyApO1xuXHRcdFx0fSB2YXIgayA9IGE7bCggYS5iLCBjICk7bCggYS5jLCBjICk7eiggYSApO1xuXHRcdH0gZnVuY3Rpb24gQiggYSwgYiApIHtcblx0XHRcdHZhciBjID0gYiB8fCB7fTt0aGlzLmZhbWlseSA9IGE7dGhpcy5zdHlsZSA9IGMuc3R5bGUgfHwgJ25vcm1hbCc7dGhpcy53ZWlnaHQgPSBjLndlaWdodCB8fCAnbm9ybWFsJzt0aGlzLnN0cmV0Y2ggPSBjLnN0cmV0Y2ggfHwgJ25vcm1hbCc7XG5cdFx0fSB2YXIgQyA9IG51bGwsXG5cdFx0XHREID0gbnVsbCxcblx0XHRcdEUgPSBudWxsLFxuXHRcdFx0RiA9IG51bGw7ZnVuY3Rpb24gRygpIHtcblx0XHRcdGlmICggbnVsbCA9PT0gRCApIHtcblx0XHRcdFx0aWYgKCBKKCkgJiYgL0FwcGxlLy50ZXN0KCB3aW5kb3cubmF2aWdhdG9yLnZlbmRvciApICkge1xuXHRcdFx0XHRcdHZhciBhID0gL0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMoIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50ICk7RCA9ICEhIGEgJiYgNjAzID4gcGFyc2VJbnQoIGFbMV0sIDEwICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0RCA9ICEgMTtcblx0XHRcdFx0fVxuXHRcdFx0fSByZXR1cm4gRDtcblx0XHR9IGZ1bmN0aW9uIEooKSB7XG5cdFx0XHRudWxsID09PSBGICYmICggRiA9ICEhIGRvY3VtZW50LmZvbnRzICk7cmV0dXJuIEY7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIEsoKSB7XG5cdFx0XHRpZiAoIG51bGwgPT09IEUgKSB7XG5cdFx0XHRcdHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTt0cnkge1xuXHRcdFx0XHRcdGEuc3R5bGUuZm9udCA9ICdjb25kZW5zZWQgMTAwcHggc2Fucy1zZXJpZic7XG5cdFx0XHRcdH0gY2F0Y2ggKCBiICkge31FID0gJycgIT09IGEuc3R5bGUuZm9udDtcblx0XHRcdH0gcmV0dXJuIEU7XG5cdFx0fSBmdW5jdGlvbiBMKCBhLCBiICkge1xuXHRcdFx0cmV0dXJuIFsgYS5zdHlsZSwgYS53ZWlnaHQsIEsoKSA/IGEuc3RyZXRjaCA6ICcnLCAnMTAwcHgnLCBiIF0uam9pbiggJyAnICk7XG5cdFx0fVxuXHRcdEIucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdHZhciBjID0gdGhpcyxcblx0XHRcdFx0ayA9IGEgfHwgJ0JFU2Jzd3knLFxuXHRcdFx0XHRyID0gMCxcblx0XHRcdFx0biA9IGIgfHwgM0UzLFxuXHRcdFx0XHRIID0gKCBuZXcgRGF0ZSApLmdldFRpbWUoKTtyZXR1cm4gbmV3IFByb21pc2UoIGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0XHRpZiAoIEooKSAmJiAhIEcoKSApIHtcblx0XHRcdFx0XHR2YXIgTSA9IG5ldyBQcm9taXNlKCBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24gZSgpIHtcblx0XHRcdFx0XHRcdFx0XHQoIG5ldyBEYXRlICkuZ2V0VGltZSgpIC0gSCA+PSBuID8gYiggRXJyb3IoICcnICsgbiArICdtcyB0aW1lb3V0IGV4Y2VlZGVkJyApICkgOiBkb2N1bWVudC5mb250cy5sb2FkKCBMKCBjLCAnXCInICsgYy5mYW1pbHkgKyAnXCInICksIGsgKS50aGVuKCBmdW5jdGlvbiggYyApIHtcblx0XHRcdFx0XHRcdFx0XHRcdDEgPD0gYy5sZW5ndGggPyBhKCkgOiBzZXRUaW1lb3V0KCBlLCAyNSApO1xuXHRcdFx0XHRcdFx0XHRcdH0sIGIgKTtcblx0XHRcdFx0XHRcdFx0fWUoKTtcblx0XHRcdFx0XHRcdH0gKSxcblx0XHRcdFx0XHRcdE4gPSBuZXcgUHJvbWlzZSggZnVuY3Rpb24oIGEsIGMgKSB7XG5cdFx0XHRcdFx0XHRcdHIgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRjKCBFcnJvciggJycgKyBuICsgJ21zIHRpbWVvdXQgZXhjZWVkZWQnICkgKTtcblx0XHRcdFx0XHRcdFx0fSwgbiApO1xuXHRcdFx0XHRcdFx0fSApO1Byb21pc2UucmFjZSggWyBOLCBNIF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNsZWFyVGltZW91dCggciApO2EoIGMgKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGIgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGZ1bmN0aW9uIHYoKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBiO2lmICggYiA9IC0xICE9IGYgJiYgLTEgIT0gZyB8fCAtMSAhPSBmICYmIC0xICE9IGggfHwgLTEgIT0gZyAmJiAtMSAhPSBoICkge1xuXHRcdFx0XHRcdFx0XHRcdCggYiA9IGYgIT0gZyAmJiBmICE9IGggJiYgZyAhPSBoICkgfHwgKCBudWxsID09PSBDICYmICggYiA9IC9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpLy5leGVjKCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCApLCBDID0gISEgYiAmJiAoIDUzNiA+IHBhcnNlSW50KCBiWzFdLCAxMCApIHx8IDUzNiA9PT0gcGFyc2VJbnQoIGJbMV0sIDEwICkgJiYgMTEgPj0gcGFyc2VJbnQoIGJbMl0sIDEwICkgKSApLCBiID0gQyAmJiAoIGYgPT0gdyAmJiBnID09IHcgJiYgaCA9PSB3IHx8IGYgPT0geCAmJiBnID09IHggJiYgaCA9PSB4IHx8IGYgPT0geSAmJiBnID09IHkgJiYgaCA9PSB5ICkgKSwgYiA9ICEgYjtcblx0XHRcdFx0XHRcdFx0fWIgJiYgKCBkLnBhcmVudE5vZGUgJiYgZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBkICksIGNsZWFyVGltZW91dCggciApLCBhKCBjICkgKTtcblx0XHRcdFx0XHRcdH0gZnVuY3Rpb24gSSgpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAoIG5ldyBEYXRlICkuZ2V0VGltZSgpIC0gSCA+PSBuICkge1xuXHRcdFx0XHRcdFx0XHRcdGQucGFyZW50Tm9kZSAmJiBkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIGQgKSwgYiggRXJyb3IoICcnICtcblx0biArICdtcyB0aW1lb3V0IGV4Y2VlZGVkJyApICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGEgPSBkb2N1bWVudC5oaWRkZW47aWYgKCAhIDAgPT09IGEgfHwgdm9pZCAwID09PSBhICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZiA9IGUuYS5vZmZzZXRXaWR0aCwgZyA9IHAuYS5vZmZzZXRXaWR0aCwgaCA9IHEuYS5vZmZzZXRXaWR0aCwgdigpO1xuXHRcdFx0XHRcdFx0XHRcdH1yID0gc2V0VGltZW91dCggSSwgNTAgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSB2YXIgZSA9IG5ldyB0KCBrICksXG5cdFx0XHRcdFx0XHRcdHAgPSBuZXcgdCggayApLFxuXHRcdFx0XHRcdFx0XHRxID0gbmV3IHQoIGsgKSxcblx0XHRcdFx0XHRcdFx0ZiA9IC0xLFxuXHRcdFx0XHRcdFx0XHRnID0gLTEsXG5cdFx0XHRcdFx0XHRcdGggPSAtMSxcblx0XHRcdFx0XHRcdFx0dyA9IC0xLFxuXHRcdFx0XHRcdFx0XHR4ID0gLTEsXG5cdFx0XHRcdFx0XHRcdHkgPSAtMSxcblx0XHRcdFx0XHRcdFx0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7ZC5kaXIgPSAnbHRyJzt1KCBlLCBMKCBjLCAnc2Fucy1zZXJpZicgKSApO3UoIHAsIEwoIGMsICdzZXJpZicgKSApO3UoIHEsIEwoIGMsICdtb25vc3BhY2UnICkgKTtkLmFwcGVuZENoaWxkKCBlLmEgKTtkLmFwcGVuZENoaWxkKCBwLmEgKTtkLmFwcGVuZENoaWxkKCBxLmEgKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkICk7dyA9IGUuYS5vZmZzZXRXaWR0aDt4ID0gcC5hLm9mZnNldFdpZHRoO3kgPSBxLmEub2Zmc2V0V2lkdGg7SSgpO0EoIGUsIGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHRcdFx0XHRmID0gYTt2KCk7XG5cdFx0XHRcdFx0XHR9ICk7dSggZSxcblx0XHRcdFx0XHRcdFx0TCggYywgJ1wiJyArIGMuZmFtaWx5ICsgJ1wiLHNhbnMtc2VyaWYnICkgKTtBKCBwLCBmdW5jdGlvbiggYSApIHtcblx0XHRcdFx0XHRcdFx0ZyA9IGE7digpO1xuXHRcdFx0XHRcdFx0fSApO3UoIHAsIEwoIGMsICdcIicgKyBjLmZhbWlseSArICdcIixzZXJpZicgKSApO0EoIHEsIGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHRcdFx0XHRoID0gYTt2KCk7XG5cdFx0XHRcdFx0XHR9ICk7dSggcSwgTCggYywgJ1wiJyArIGMuZmFtaWx5ICsgJ1wiLG1vbm9zcGFjZScgKSApO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH07J29iamVjdCcgPT09IHR5cGVvZiBtb2R1bGUgPyBtb2R1bGUuZXhwb3J0cyA9IEIgOiAoIHdpbmRvdy5Gb250RmFjZU9ic2VydmVyID0gQiwgd2luZG93LkZvbnRGYWNlT2JzZXJ2ZXIucHJvdG90eXBlLmxvYWQgPSBCLnByb3RvdHlwZS5sb2FkICk7XG5cdH0oKSApO1xuXG5cdC8vIG1pbm5wb3N0IGZvbnRzXG5cblx0Ly8gc2Fuc1xuXHR2YXIgc2Fuc05vcm1hbCA9IG5ldyBGb250RmFjZU9ic2VydmVyKCAnZmYtbWV0YS13ZWItcHJvJyApO1xuXHR2YXIgc2Fuc0JvbGQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzYW5zTm9ybWFsSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNDAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXG5cdC8vIHNlcmlmXG5cdHZhciBzZXJpZkJvb2sgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA1MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvb2tJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA1MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvbGQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvbGRJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJsYWNrID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogOTAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCbGFja0l0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDkwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblxuXHRQcm9taXNlLmFsbCggW1xuXHRcdHNhbnNOb3JtYWwubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zTm9ybWFsSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvb2subG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9va0l0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvbGRJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQmxhY2subG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQmxhY2tJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApXG5cdF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkJztcblxuXHRcdC8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5cdFx0c2Vzc2lvblN0b3JhZ2Uuc2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCA9IHRydWU7XG5cdH0gKTtcblxuXHRQcm9taXNlLmFsbCggW1xuXHRcdHNhbnNOb3JtYWwubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zTm9ybWFsSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKVxuXHRdICkudGhlbiggZnVuY3Rpb24oKSB7XG5cdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIHNhbnMtZm9udHMtbG9hZGVkJztcblxuXHRcdC8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5cdFx0c2Vzc2lvblN0b3JhZ2Uuc2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsID0gdHJ1ZTtcblx0fSApO1xufVxuXG4iLCIvKipcbiAqIFRoaXMgaXMgdXNlZCB0byBjYXVzZSBHb29nbGUgQW5hbHl0aWNzIGV2ZW50cyB0byBydW5cbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbmZ1bmN0aW9uIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHZhbHVlICkge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSAmJiAnJyAhPT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLnVybF9hY2Nlc3NfbGV2ZWwgKSB7XG5cdFx0dmFyIHR5cGUgPSAnZXZlbnQnO1xuXHRcdHZhciBjYXRlZ29yeSA9ICdNZW1iZXIgQ29udGVudCc7XG5cdFx0dmFyIGxhYmVsID0gbG9jYXRpb24ucGF0aG5hbWU7IC8vIGkgdGhpbmsgd2UgY291bGQgcG9zc2libHkgcHV0IHNvbWUgZ3JvdXBpbmcgaGVyZSwgYnV0IHdlIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYWNjZXNzIHRvIG9uZSBhbmQgbWF5YmUgaXQncyBub3Qgd29ydGh3aGlsZSB5ZXRcblx0XHR2YXIgYWN0aW9uID0gJ0Jsb2NrZWQnO1xuXHRcdGlmICggdHJ1ZSA9PT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLmN1cnJlbnRfdXNlci5jYW5fYWNjZXNzICkge1xuXHRcdFx0YWN0aW9uID0gJ1Nob3duJztcblx0XHR9XG5cdFx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHR9XG59ICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIHNoYXJpbmcgY29udGVudFxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG4vLyB0cmFjayBhIHNoYXJlIHZpYSBhbmFseXRpY3MgZXZlbnRcbmZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uID0gJycgKSB7XG5cblx0Ly8gaWYgYSBub3QgbG9nZ2VkIGluIHVzZXIgdHJpZXMgdG8gZW1haWwsIGRvbid0IGNvdW50IHRoYXQgYXMgYSBzaGFyZVxuXHRpZiAoICEgalF1ZXJ5KCAnYm9keScgKS5oYXNDbGFzcyggJ2xvZ2dlZC1pbicgKSAmJiAnRW1haWwnID09PSB0ZXh0ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBjYXRlZ29yeSA9ICdTaGFyZSc7XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdGNhdGVnb3J5ID0gJ1NoYXJlIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cblx0Ly8gdHJhY2sgYXMgYW4gZXZlbnQsIGFuZCBhcyBzb2NpYWwgaWYgaXQgaXMgdHdpdHRlciBvciBmYlxuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsIGNhdGVnb3J5LCB0ZXh0LCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0IHx8ICdUd2l0dGVyJyA9PT0gdGV4dCApIHtcblx0XHRcdGlmICggJ0ZhY2Vib29rJyA9PT0gdGV4dCApIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdTaGFyZScsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1R3ZWV0JywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbi8vIGNvcHkgdGhlIGN1cnJlbnQgVVJMIHRvIHRoZSB1c2VyJ3MgY2xpcGJvYXJkXG5mdW5jdGlvbiBjb3B5Q3VycmVudFVSTCgpIHtcblx0dmFyIGR1bW15ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2lucHV0JyApLFxuXHRcdHRleHQgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggZHVtbXkgKTtcblx0ZHVtbXkudmFsdWUgPSB0ZXh0O1xuXHRkdW1teS5zZWxlY3QoKTtcblx0ZG9jdW1lbnQuZXhlY0NvbW1hbmQoICdjb3B5JyApO1xuXHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKCBkdW1teSApO1xufVxuXG4vLyB0b3Agc2hhcmUgYnV0dG9uIGNsaWNrXG4kKCAnLm0tZW50cnktc2hhcmUtdG9wIGEnICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHR2YXIgdGV4dCA9ICQoIHRoaXMgKS5kYXRhKCAnc2hhcmUtYWN0aW9uJyApO1xuXHR2YXIgcG9zaXRpb24gPSAndG9wJztcblx0dHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcbn0gKTtcblxuLy8gY2F1c2UgdGhlIGN1cnJlbnQgcGFnZSB0byBwcmludFxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXByaW50IGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHdpbmRvdy5wcmludCgpO1xufSApO1xuXG4vLyB3aGVuIHRoZSBjb3B5IGxpbmsgYnV0dG9uIGlzIGNsaWNrZWRcbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1jb3B5LXVybCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0Y29weUN1cnJlbnRVUkwoKTtcblx0dGxpdGUuc2hvdyggKCBlLnRhcmdldCApLCB7IGdyYXY6ICd3JyB9ICk7XG5cdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdHRsaXRlLmhpZGUoICggZS50YXJnZXQgKSApO1xuXHR9LCAzMDAwICk7XG5cdHJldHVybiBmYWxzZTtcbn0gKTtcblxuLy8gd2hlbiBzaGFyaW5nIHZpYSBmYWNlYm9vaywgdHdpdHRlciwgb3IgZW1haWwsIG9wZW4gdGhlIGRlc3RpbmF0aW9uIHVybCBpbiBhIG5ldyB3aW5kb3dcbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1mYWNlYm9vayBhLCAubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS10d2l0dGVyIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWVtYWlsIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHZhciB1cmwgPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cdHdpbmRvdy5vcGVuKCB1cmwsICdfYmxhbmsnICk7XG59ICk7XG4iLCIvKipcbiAqIEZpbGUgbmF2aWdhdGlvbi5qcy5cbiAqXG4gKiBOYXZpZ2F0aW9uIHNjcmlwdHMuIEluY2x1ZGVzIG1vYmlsZSBvciB0b2dnbGUgYmVoYXZpb3IsIGFuYWx5dGljcyB0cmFja2luZyBvZiBzcGVjaWZpYyBtZW51cy5cbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICovXG5cbmZ1bmN0aW9uIHNldHVwUHJpbWFyeU5hdigpIHtcblx0Y29uc3QgcHJpbWFyeU5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1saW5rcycgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHByaW1hcnlOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IGJ1dHRvbicgKTtcblx0aWYgKCBudWxsICE9PSBwcmltYXJ5TmF2VG9nZ2xlICkge1xuXHRcdHByaW1hcnlOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRjb25zdCB1c2VyTmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItbWlubnBvc3QtYWNjb3VudCB1bCcgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHVzZXJOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItbWlubnBvc3QtYWNjb3VudCA+IGEnICk7XG5cdGlmICggbnVsbCAhPT0gdXNlck5hdlRvZ2dsZSApIHtcblx0XHR1c2VyTmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0dmFyIHRhcmdldCAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgLm0tZm9ybS1zZWFyY2ggZmllbGRzZXQgLmEtYnV0dG9uLXNlbnRlbmNlJyApO1xuXHRpZiAoIG51bGwgIT09IHRhcmdldCApIHtcblx0XHR2YXIgZGl2ICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRkaXYuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLXNlYXJjaFwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuXHRcdHZhciBmcmFnbWVudCAgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0ZGl2LnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuXHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG5cblx0XHRjb25zdCBzZWFyY2hUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1hY3Rpb25zIC5tLWZvcm0tc2VhcmNoJyApLFxuXHRcdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHRcdH0gKTtcblxuXHRcdHZhciBzZWFyY2hWaXNpYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ2xpLnNlYXJjaCA+IGEnICk7XG5cdFx0c2VhcmNoVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHR2YXIgc2VhcmNoQ2xvc2UgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLXNlYXJjaCcgKTtcblx0XHRzZWFyY2hDbG9zZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHQvLyBlc2NhcGUga2V5IHByZXNzXG5cdCQoIGRvY3VtZW50ICkua2V5dXAoIGZ1bmN0aW9uKCBlICkge1xuXHRcdGlmICggMjcgPT09IGUua2V5Q29kZSApIHtcblx0XHRcdGxldCBwcmltYXJ5TmF2RXhwYW5kZWQgPSAndHJ1ZScgPT09IHByaW1hcnlOYXZUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGxldCB1c2VyTmF2RXhwYW5kZWQgPSAndHJ1ZScgPT09IHVzZXJOYXZUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGxldCBzZWFyY2hJc1Zpc2libGUgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgcHJpbWFyeU5hdkV4cGFuZGVkICYmIHRydWUgPT09IHByaW1hcnlOYXZFeHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRvZ2dsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBwcmltYXJ5TmF2RXhwYW5kZWQgKTtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiB1c2VyTmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gdXNlck5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHVzZXJOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHNlYXJjaElzVmlzaWJsZSAmJiB0cnVlID09PSBzZWFyY2hJc1Zpc2libGUgKSB7XG5cdFx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgc2VhcmNoSXNWaXNpYmxlICk7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufVxuXG5mdW5jdGlvbiBzZXR1cFNjcm9sbE5hdiggc2VsZWN0b3IsIG5hdlNlbGVjdG9yLCBjb250ZW50U2VsZWN0b3IgKSB7XG5cblx0Ly8gSW5pdCB3aXRoIGFsbCBvcHRpb25zIGF0IGRlZmF1bHQgc2V0dGluZ1xuXHRjb25zdCBwcmlvcml0eU5hdlNjcm9sbGVyRGVmYXVsdCA9IFByaW9yaXR5TmF2U2Nyb2xsZXIoIHtcblx0XHRzZWxlY3Rvcjogc2VsZWN0b3IsXG5cdFx0bmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yLFxuXHRcdGNvbnRlbnRTZWxlY3RvcjogY29udGVudFNlbGVjdG9yLFxuXHRcdGl0ZW1TZWxlY3RvcjogJ2xpLCBhJyxcblx0XHRidXR0b25MZWZ0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tbGVmdCcsXG5cdFx0YnV0dG9uUmlnaHRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1yaWdodCdcblxuXHRcdC8vc2Nyb2xsU3RlcDogJ2F2ZXJhZ2UnXG5cdH0gKTtcblxuXHQvLyBJbml0IG11bHRpcGxlIG5hdiBzY3JvbGxlcnMgd2l0aCB0aGUgc2FtZSBvcHRpb25zXG5cdC8qbGV0IG5hdlNjcm9sbGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYtc2Nyb2xsZXInKTtcblxuXHRuYXZTY3JvbGxlcnMuZm9yRWFjaCgoY3VycmVudFZhbHVlLCBjdXJyZW50SW5kZXgpID0+IHtcblx0ICBQcmlvcml0eU5hdlNjcm9sbGVyKHtcblx0ICAgIHNlbGVjdG9yOiBjdXJyZW50VmFsdWVcblx0ICB9KTtcblx0fSk7Ki9cbn1cblxuc2V0dXBQcmltYXJ5TmF2KCk7XG5cbmlmICggMCA8ICQoICcubS1zdWItbmF2aWdhdGlvbicgKS5sZW5ndGggKSB7XG5cdHNldHVwU2Nyb2xsTmF2KCAnLm0tc3ViLW5hdmlnYXRpb24nLCAnLm0tc3VibmF2LW5hdmlnYXRpb24nLCAnLm0tbWVudS1zdWItbmF2aWdhdGlvbicgKTtcbn1cbmlmICggMCA8ICQoICcubS1wYWdpbmF0aW9uLW5hdmlnYXRpb24nICkubGVuZ3RoICkge1xuXHRzZXR1cFNjcm9sbE5hdiggJy5tLXBhZ2luYXRpb24tbmF2aWdhdGlvbicsICcubS1wYWdpbmF0aW9uLWNvbnRhaW5lcicsICcubS1wYWdpbmF0aW9uLWxpc3QnICk7XG59XG5cbiQoICdhJywgJCggJy5vLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0dmFyIHdpZGdldFRpdGxlICAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXdpZGdldCcgKS5maW5kKCAnaDMnICkudGV4dCgpO1xuXHR2YXIgem9uZVRpdGxlICAgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0tem9uZScgKS5maW5kKCAnLmEtem9uZS10aXRsZScgKS50ZXh0KCk7XG5cdHZhciBzaWRlYmFyU2VjdGlvblRpdGxlID0gJyc7XG5cdGlmICggJycgIT09IHdpZGdldFRpdGxlICkge1xuXHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB3aWRnZXRUaXRsZTtcblx0fSBlbHNlIGlmICggJycgIT09IHpvbmVUaXRsZSApIHtcblx0XHRzaWRlYmFyU2VjdGlvblRpdGxlID0gem9uZVRpdGxlO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJTZWN0aW9uVGl0bGUgKTtcbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgZm9ybXNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxualF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICggdGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgJycgIT09IHRoaXMubm9kZVZhbHVlLnRyaW0oKSApO1xuXHR9ICk7XG59O1xuXG5mdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0cmV0dXJuIG1hcmt1cDtcbn1cblxuZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCggJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nICk7XG5cdHZhciByZXN0Um9vdCAgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0dmFyIGZ1bGxVcmwgICAgICAgICAgICA9IHJlc3RSb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdHZhciBjb25maXJtQ2hhbmdlICAgICAgPSAnJztcblx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdHZhciBuZXdQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIG9sZFByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0dmFyIGNvbnNvbGlkYXRlZEVtYWlscyA9IFtdO1xuXHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdHZhciBhamF4Rm9ybURhdGEgICAgICAgPSAnJztcblx0dmFyIHRoYXQgICAgICAgICAgICAgICA9ICcnO1xuXG5cdC8vIHN0YXJ0IG91dCB3aXRoIG5vIHByaW1hcnkvcmVtb3ZhbHMgY2hlY2tlZFxuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHQvLyBpZiB0aGVyZSBpcyBhIGxpc3Qgb2YgZW1haWxzIChub3QganVzdCBhIHNpbmdsZSBmb3JtIGZpZWxkKVxuXHRpZiAoIDAgPCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cblx0XHQvLyBpZiBhIHVzZXIgc2VsZWN0cyBhIG5ldyBwcmltYXJ5LCBtb3ZlIGl0IGludG8gdGhhdCBwb3NpdGlvblxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oKSB7XG5cblx0XHRcdG5ld1ByaW1hcnlFbWFpbCA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdG9sZFByaW1hcnlFbWFpbCA9ICQoICcjZW1haWwnICkudmFsKCk7XG5cdFx0XHRwcmltYXJ5SWQgICAgICAgPSAkKCB0aGlzICkucHJvcCggJ2lkJyApLnJlcGxhY2UoICdwcmltYXJ5X2VtYWlsXycsICcnICk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncHJpbWFyeS1jaGFuZ2UnICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlclxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblxuXHRcdFx0Ly8kKCB0aGlzICkucGFyZW50KCkuYWZ0ZXIoIGNvbmZpcm1DaGFuZ2UgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSB1c2VyIGZhY2luZyB2YWx1ZXNcblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG5ld1ByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3VzZXItZW1haWwtJyArIHByaW1hcnlJZCApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgbWFpbiBoaWRkZW4gZm9ybSB2YWx1ZVxuXHRcdFx0XHQkKCAnI2VtYWlsJyApLnZhbCggbmV3UHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gc3VibWl0IGZvcm0gdmFsdWVzLlxuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXG5cdFx0XHRcdC8vIHVuY2hlY2sgdGhlIHJhZGlvIGJ1dHRvblxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBmb3JtIHZhbHVlcyB0byB0aGUgb2xkIHByaW1hcnkgZW1haWxcblx0XHRcdFx0JCggJyNwcmltYXJ5X2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3JlbW92ZV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyByZW1vdmUgdGhlIGNvbmZpcm0gbWVzc2FnZVxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHJlbW92ZXMgYW4gZW1haWwsIHRha2UgaXQgYXdheSBmcm9tIHRoZSB2aXN1YWwgYW5kIGZyb20gdGhlIGZvcm1cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2hhbmdlJywgJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgIT09IGVtYWlsVG9SZW1vdmUgKSB7XG5cdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlciBmb3IgcmVtb3ZhbFxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0Ly8gaWYgY29uZmlybWVkLCByZW1vdmUgdGhlIGVtYWlsIGFuZCBzdWJtaXQgdGhlIGZvcm1cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGknICkuZmFkZU91dCggJ25vcm1hbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cblx0XHRcdFx0Ly9jb25zb2xlLmxvZyggJ3ZhbHVlIGlzICcgKyBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnICkuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvbiBhLWJ1dHRvbi1hZGQtdXNlci1lbWFpbFwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRuZXh0RW1haWxDb3VudCsrO1xuXHR9ICk7XG5cblx0JCggJ2lucHV0W3R5cGU9c3VibWl0XScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGJ1dHRvbiA9ICQoIHRoaXMgKTtcblx0XHR2YXIgYnV0dG9uRm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCAnZm9ybScgKTtcblx0XHRidXR0b25Gb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicsIGJ1dHRvbi52YWwoKSApO1xuXHR9ICk7XG5cblx0JCggJy5tLWVudHJ5LWNvbnRlbnQnICkub24oICdzdWJtaXQnLCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgZm9ybSA9ICQoIHRoaXMgKTtcblx0XHR2YXIgc3VibWl0dGluZ0J1dHRvbiA9IGZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJyApIHx8ICcnO1xuXG5cdFx0Ly8gaWYgdGhlcmUgaXMgbm8gc3VibWl0dGluZyBidXR0b24sIHBhc3MgaXQgYnkgQWpheFxuXHRcdGlmICggJycgPT09IHN1Ym1pdHRpbmdCdXR0b24gfHwgJ1NhdmUgQ2hhbmdlcycgIT09IHN1Ym1pdHRpbmdCdXR0b24gKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheEZvcm1EYXRhID0gZm9ybS5zZXJpYWxpemUoKTsgLy9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheEZvcm1EYXRhID0gYWpheEZvcm1EYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogZnVsbFVybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Qubm9uY2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0ZGF0YTogYWpheEZvcm1EYXRhXG5cdFx0XHR9ICkuZG9uZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5ld0VtYWlscyA9ICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKS5tYXAoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdH0gKS5nZXQoKTtcblx0XHRcdFx0JC5lYWNoKCBuZXdFbWFpbHMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSBuZXh0RW1haWxDb3VudCArIGluZGV4O1xuXHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkuYXBwZW5kKCAnPGxpIGlkPVwidXNlci1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtZW1haWwtcHJlZmVyZW5jZXNcIj48YSBocmVmPVwiL25ld3NsZXR0ZXJzLz9lbWFpbD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCB2YWx1ZSApICsgJ1wiPjxzbWFsbD5FbWFpbCBQcmVmZXJlbmNlczwvc21hbGw+PC9hPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLXJlbW92ZS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwicmVtb3ZlX2VtYWlsWycgKyBuZXh0RW1haWxDb3VudCArICddXCIgaWQ9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5SZW1vdmU8L3NtYWxsPjwvbGFiZWw+PC9saT48L3VsPjwvbGk+JyApO1xuXHRcdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCAkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCgpICsgJywnICsgdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggMCA9PT0gJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIGl0IHdvdWxkIGJlIG5pY2UgdG8gb25seSBsb2FkIHRoZSBmb3JtLCBidXQgdGhlbiBjbGljayBldmVudHMgc3RpbGwgZG9uJ3Qgd29ya1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIGFkZEF1dG9SZXNpemUoKSB7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICdbZGF0YS1hdXRvcmVzaXplXScgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGVsZW1lbnQgKSB7XG5cdFx0ZWxlbWVudC5zdHlsZS5ib3hTaXppbmcgPSAnYm9yZGVyLWJveCc7XG5cdFx0dmFyIG9mZnNldCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnaW5wdXQnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQudGFyZ2V0LnN0eWxlLmhlaWdodCA9ICdhdXRvJztcblx0XHRcdGV2ZW50LnRhcmdldC5zdHlsZS5oZWlnaHQgPSBldmVudC50YXJnZXQuc2Nyb2xsSGVpZ2h0ICsgb2Zmc2V0ICsgJ3B4Jztcblx0XHR9KTtcblx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSggJ2RhdGEtYXV0b3Jlc2l6ZScgKTtcblx0fSk7XG59XG5cbiQoIGRvY3VtZW50ICkuYWpheFN0b3AoIGZ1bmN0aW9uKCkge1xuXHR2YXIgY29tbWVudEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnI2xsY19jb21tZW50cycgKTtcblx0aWYgKCBudWxsICE9PSBjb21tZW50QXJlYSApIHtcblx0XHRhZGRBdXRvUmVzaXplKCk7XG5cdH1cbn0pO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIDAgPCAkKCAnLm0tZm9ybS1hY2NvdW50LXNldHRpbmdzJyApLmxlbmd0aCApIHtcblx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0fVxuXHR2YXIgYXV0b1Jlc2l6ZVRleHRhcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ1tkYXRhLWF1dG9yZXNpemVdJyApO1xuXHRpZiAoIG51bGwgIT09IGF1dG9SZXNpemVUZXh0YXJlYSApIHtcblx0XHRhZGRBdXRvUmVzaXplKCk7XG5cdH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgY29tbWVudHNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuLy8gYmFzZWQgb24gd2hpY2ggYnV0dG9uIHdhcyBjbGlja2VkLCBzZXQgdGhlIHZhbHVlcyBmb3IgdGhlIGFuYWx5dGljcyBldmVudCBhbmQgY3JlYXRlIGl0XG5mdW5jdGlvbiB0cmFja1Nob3dDb21tZW50cyggYWx3YXlzLCBpZCwgY2xpY2tWYWx1ZSApIHtcblx0dmFyIGFjdGlvbiAgICAgICAgICA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlQcmVmaXggPSAnJztcblx0dmFyIGNhdGVnb3J5U3VmZml4ID0gJyc7XG5cdHZhciBwb3NpdGlvbiAgICAgICAgPSAnJztcblx0cG9zaXRpb24gPSBpZC5yZXBsYWNlKCAnYWx3YXlzLXNob3ctY29tbWVudHMtJywgJycgKTtcblx0aWYgKCAnMScgPT09IGNsaWNrVmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09uJztcblx0fSBlbHNlIGlmICggJzAnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPZmYnO1xuXHR9IGVsc2Uge1xuXHRcdGFjdGlvbiA9ICdDbGljayc7XG5cdH1cblx0aWYgKCB0cnVlID09PSBhbHdheXMgKSB7XG5cdFx0Y2F0ZWdvcnlQcmVmaXggPSAnQWx3YXlzICc7XG5cdH1cblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbi5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgcG9zaXRpb24uc2xpY2UoIDEgKTtcblx0XHRjYXRlZ29yeVN1ZmZpeCA9ICcgLSAnICsgcG9zaXRpb247XG5cdH1cblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeVByZWZpeCArICdTaG93IENvbW1lbnRzJyArIGNhdGVnb3J5U3VmZml4LCBhY3Rpb24sIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59XG5cbi8vIHdoZW4gc2hvd2luZyBjb21tZW50cyBvbmNlLCB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1idXR0b24tc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR0cmFja1Nob3dDb21tZW50cyggZmFsc2UsICcnLCAnJyApO1xufSApO1xuXG4vLyBTZXQgdXNlciBtZXRhIHZhbHVlIGZvciBhbHdheXMgc2hvd2luZyBjb21tZW50cyBpZiB0aGF0IGJ1dHRvbiBpcyBjbGlja2VkXG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dmFyIHRoYXQgPSAkKCB0aGlzICk7XG5cdGlmICggdGhhdC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0fSBlbHNlIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHR9XG5cblx0Ly8gdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCB0cnVlLCB0aGF0LmF0dHIoICdpZCcgKSwgdGhhdC52YWwoKSApO1xuXG5cdC8vIHdlIGFscmVhZHkgaGF2ZSBhamF4dXJsIGZyb20gdGhlIHRoZW1lXG5cdCQuYWpheCgge1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHR1cmw6IGFqYXh1cmwsXG5cdFx0ZGF0YToge1xuXHRcdFx0J2FjdGlvbic6ICdtaW5ucG9zdF9sYXJnb19sb2FkX2NvbW1lbnRzX3NldF91c2VyX21ldGEnLFxuXHRcdFx0J3ZhbHVlJzogdGhhdC52YWwoKVxuXHRcdH0sXG5cdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0JCggJy5hLWFsd2F5cy1zaG93LWNvbW1lbnRzLXJlc3VsdCcsIHRoYXQucGFyZW50KCkgKS5odG1sKCByZXNwb25zZS5kYXRhLm1lc3NhZ2UgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gcmVzcG9uc2UuZGF0YS5zaG93ICkge1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAwICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAxICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG59ICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIGV2ZW50c1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxudmFyIHRhcmdldCAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1ldmVudHMtY2FsLWxpbmtzJyApO1xuaWYgKCBudWxsICE9PSB0YXJnZXQgKSB7XG4gICAgdmFyIGxpICAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdsaScgKTtcbiAgICBsaS5pbm5lckhUTUwgID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLWNhbGVuZGFyXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG4gICAgdmFyIGZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBsaS5zZXRBdHRyaWJ1dGUoICdjbGFzcycsICdhLWNsb3NlLWhvbGRlcicgKTtcbiAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggbGkgKTtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG59XG5cbmNvbnN0IGNhbGVuZGFyVHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcbiAgICBlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmEtZXZlbnRzLWNhbC1saW5rcycgKSxcbiAgICB2aXNpYmxlQ2xhc3M6ICdhLWV2ZW50cy1jYWwtbGluay12aXNpYmxlJyxcbiAgICBkaXNwbGF5VmFsdWU6ICdibG9jaydcbn0gKTtcblxudmFyIGNhbGVuZGFyVmlzaWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcubS1ldmVudC1kYXRldGltZSBhJyApO1xuaWYgKCBudWxsICE9PSBjYWxlbmRhclZpc2libGUgKSB7XG4gICAgY2FsZW5kYXJWaXNpYmxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gY2FsZW5kYXJWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG4gICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICBpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICB2YXIgY2FsZW5kYXJDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1jYWxlbmRhcicgKTtcbiAgICBjYWxlbmRhckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gY2FsZW5kYXJWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG4gICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICBpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICAgIH1cbiAgICB9ICk7XG59XG4iXX0=
}(jQuery));
