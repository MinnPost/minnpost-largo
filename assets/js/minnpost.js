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
    console.log('set the style');
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
  addAutoResize();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDAtc3RhcnQuanMiLCIwMS1mb250cy5qcyIsIjAyLWFuYWx5dGljcy5qcyIsIjAzLXNoYXJlLmpzIiwiMDQtbmF2aWdhdGlvbi5qcyIsIjA1LWZvcm1zLmpzIiwiMDYtY29tbWVudHMuanMiLCIwNy1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImRvY3VtZW50RWxlbWVudCIsInNlc3Npb25TdG9yYWdlIiwic2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsInNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsImciLCJwdXNoIiwibSIsInNoaWZ0IiwicCIsImIiLCJxIiwiYyIsInUiLCJUeXBlRXJyb3IiLCJ0aGVuIiwiY2FsbCIsInYiLCJoIiwicHJvdG90eXBlIiwidyIsImsiLCJ4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyYWNlIiwiYWxsIiwiY2F0Y2giLCJhdHRhY2hFdmVudCIsImJvZHkiLCJyZWFkeVN0YXRlIiwiZGV0YWNoRXZlbnQiLCJjcmVhdGVUZXh0Tm9kZSIsImNzc1RleHQiLCJ6Iiwid2lkdGgiLCJBIiwiQiIsImZhbWlseSIsIndlaWdodCIsInN0cmV0Y2giLCJDIiwiRCIsIkUiLCJGIiwiRyIsIkoiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidmVuZG9yIiwiZXhlYyIsInVzZXJBZ2VudCIsImZvbnRzIiwiSyIsImZvbnQiLCJMIiwiam9pbiIsImxvYWQiLCJIIiwiRGF0ZSIsImdldFRpbWUiLCJNIiwiTiIsInkiLCJJIiwiaGlkZGVuIiwiZGlyIiwiRm9udEZhY2VPYnNlcnZlciIsInNhbnNOb3JtYWwiLCJzYW5zQm9sZCIsInNhbnNOb3JtYWxJdGFsaWMiLCJzZXJpZkJvb2siLCJzZXJpZkJvb2tJdGFsaWMiLCJzZXJpZkJvbGQiLCJzZXJpZkJvbGRJdGFsaWMiLCJzZXJpZkJsYWNrIiwic2VyaWZCbGFja0l0YWxpYyIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsInR5cGUiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwidmFsdWUiLCJnYSIsImV2ZW50IiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsImpRdWVyeSIsImhhc0NsYXNzIiwiY29weUN1cnJlbnRVUkwiLCJkdW1teSIsImhyZWYiLCJzZWxlY3QiLCJleGVjQ29tbWFuZCIsIiQiLCJjbGljayIsImRhdGEiLCJwcmV2ZW50RGVmYXVsdCIsInByaW50IiwidXJsIiwiYXR0ciIsIm9wZW4iLCJzZXR1cFByaW1hcnlOYXYiLCJwcmltYXJ5TmF2VHJhbnNpdGlvbmVyIiwicHJpbWFyeU5hdlRvZ2dsZSIsImV4cGFuZGVkIiwidXNlck5hdlRyYW5zaXRpb25lciIsInVzZXJOYXZUb2dnbGUiLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCJrZXl1cCIsImtleUNvZGUiLCJwcmltYXJ5TmF2RXhwYW5kZWQiLCJ1c2VyTmF2RXhwYW5kZWQiLCJzZWFyY2hJc1Zpc2libGUiLCJzZXR1cFNjcm9sbE5hdiIsInByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0Iiwid2lkZ2V0VGl0bGUiLCJjbG9zZXN0IiwiZmluZCIsInpvbmVUaXRsZSIsInNpZGViYXJTZWN0aW9uVGl0bGUiLCJmbiIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwidHJpbSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJmb3JtIiwicmVzdFJvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxVcmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheEZvcm1EYXRhIiwidGhhdCIsInByb3AiLCJvbiIsInZhbCIsInJlcGxhY2UiLCJwYXJlbnQiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJnZXQiLCJwYXJlbnRzIiwiZmFkZU91dCIsImJlZm9yZSIsImJ1dHRvbiIsImJ1dHRvbkZvcm0iLCJzdWJtaXR0aW5nQnV0dG9uIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRvbmUiLCJtYXAiLCJpbmRleCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsImFkZEF1dG9SZXNpemUiLCJmb3JFYWNoIiwibG9nIiwiYm94U2l6aW5nIiwib2Zmc2V0IiwiY2xpZW50SGVpZ2h0IiwiaGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0IiwiYWpheFN0b3AiLCJhdXRvUmVzaXplVGV4dGFyZWEiLCJ0cmFja1Nob3dDb21tZW50cyIsImFsd2F5cyIsImlkIiwiY2xpY2tWYWx1ZSIsImNhdGVnb3J5UHJlZml4IiwiY2F0ZWdvcnlTdWZmaXgiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiaXMiLCJhamF4dXJsIiwic3VjY2VzcyIsInJlc3BvbnNlIiwiaHRtbCIsIm1lc3NhZ2UiLCJsaSIsImNhbGVu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LENBQThCLGVBQTlCLEVBQStDLENBQUUrTSxRQUFqRDs7QUFDQSxRQUFLLFNBQVNBLFFBQWQsRUFBeUI7QUFDckIwRyxNQUFBQSxvQkFBb0IsQ0FBQzVSLGNBQXJCO0FBQ0gsS0FGRCxNQUVPO0FBQ0g0UixNQUFBQSxvQkFBb0IsQ0FBQ2pTLGNBQXJCO0FBQ0g7QUFDSixHQVREO0FBV0EsTUFBSW1TLGFBQWEsR0FBR2pXLFFBQVEsQ0FBQ29GLGFBQVQsQ0FBd0IsbUJBQXhCLENBQXBCO0FBQ0E2USxFQUFBQSxhQUFhLENBQUNoVyxnQkFBZCxDQUFnQyxPQUFoQyxFQUF5QyxVQUFVQyxDQUFWLEVBQWM7QUFDbkRBLElBQUFBLENBQUMsQ0FBQzJPLGNBQUY7QUFDQSxRQUFJUSxRQUFRLEdBQUcsV0FBVzJHLGVBQWUsQ0FBQ3BVLFlBQWhCLENBQThCLGVBQTlCLENBQVgsSUFBOEQsS0FBN0U7QUFDQW9VLElBQUFBLGVBQWUsQ0FBQzFULFlBQWhCLENBQThCLGVBQTlCLEVBQStDLENBQUUrTSxRQUFqRDs7QUFDQSxRQUFLLFNBQVNBLFFBQWQsRUFBeUI7QUFDckIwRyxNQUFBQSxvQkFBb0IsQ0FBQzVSLGNBQXJCO0FBQ0gsS0FGRCxNQUVPO0FBQ0g0UixNQUFBQSxvQkFBb0IsQ0FBQ2pTLGNBQXJCO0FBQ0g7QUFDSixHQVREO0FBVUgiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB0bGl0ZSh0KXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZSl7dmFyIGk9ZS50YXJnZXQsbj10KGkpO258fChuPShpPWkucGFyZW50RWxlbWVudCkmJnQoaSkpLG4mJnRsaXRlLnNob3coaSxuLCEwKX0pfXRsaXRlLnNob3c9ZnVuY3Rpb24odCxlLGkpe3ZhciBuPVwiZGF0YS10bGl0ZVwiO2U9ZXx8e30sKHQudG9vbHRpcHx8ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiBvKCl7dGxpdGUuaGlkZSh0LCEwKX1mdW5jdGlvbiBsKCl7cnx8KHI9ZnVuY3Rpb24odCxlLGkpe2Z1bmN0aW9uIG4oKXtvLmNsYXNzTmFtZT1cInRsaXRlIHRsaXRlLVwiK3Irczt2YXIgZT10Lm9mZnNldFRvcCxpPXQub2Zmc2V0TGVmdDtvLm9mZnNldFBhcmVudD09PXQmJihlPWk9MCk7dmFyIG49dC5vZmZzZXRXaWR0aCxsPXQub2Zmc2V0SGVpZ2h0LGQ9by5vZmZzZXRIZWlnaHQsZj1vLm9mZnNldFdpZHRoLGE9aStuLzI7by5zdHlsZS50b3A9KFwic1wiPT09cj9lLWQtMTA6XCJuXCI9PT1yP2UrbCsxMDplK2wvMi1kLzIpK1wicHhcIixvLnN0eWxlLmxlZnQ9KFwid1wiPT09cz9pOlwiZVwiPT09cz9pK24tZjpcIndcIj09PXI/aStuKzEwOlwiZVwiPT09cj9pLWYtMTA6YS1mLzIpK1wicHhcIn12YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxsPWkuZ3Jhdnx8dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRsaXRlXCIpfHxcIm5cIjtvLmlubmVySFRNTD1lLHQuYXBwZW5kQ2hpbGQobyk7dmFyIHI9bFswXXx8XCJcIixzPWxbMV18fFwiXCI7bigpO3ZhciBkPW8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuXCJzXCI9PT1yJiZkLnRvcDwwPyhyPVwiblwiLG4oKSk6XCJuXCI9PT1yJiZkLmJvdHRvbT53aW5kb3cuaW5uZXJIZWlnaHQ/KHI9XCJzXCIsbigpKTpcImVcIj09PXImJmQubGVmdDwwPyhyPVwid1wiLG4oKSk6XCJ3XCI9PT1yJiZkLnJpZ2h0PndpbmRvdy5pbm5lcldpZHRoJiYocj1cImVcIixuKCkpLG8uY2xhc3NOYW1lKz1cIiB0bGl0ZS12aXNpYmxlXCIsb30odCxkLGUpKX12YXIgcixzLGQ7cmV0dXJuIHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLG8pLHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIixvKSx0LnRvb2x0aXA9e3Nob3c6ZnVuY3Rpb24oKXtkPXQudGl0bGV8fHQuZ2V0QXR0cmlidXRlKG4pfHxkLHQudGl0bGU9XCJcIix0LnNldEF0dHJpYnV0ZShuLFwiXCIpLGQmJiFzJiYocz1zZXRUaW1lb3V0KGwsaT8xNTA6MSkpfSxoaWRlOmZ1bmN0aW9uKHQpe2lmKGk9PT10KXtzPWNsZWFyVGltZW91dChzKTt2YXIgZT1yJiZyLnBhcmVudE5vZGU7ZSYmZS5yZW1vdmVDaGlsZChyKSxyPXZvaWQgMH19fX0odCxlKSkuc2hvdygpfSx0bGl0ZS5oaWRlPWZ1bmN0aW9uKHQsZSl7dC50b29sdGlwJiZ0LnRvb2x0aXAuaGlkZShlKX0sXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz10bGl0ZSk7IiwiLyoqIFxuICogTGlicmFyeSBjb2RlXG4gKiBVc2luZyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9AY2xvdWRmb3VyL3RyYW5zaXRpb24taGlkZGVuLWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCh7XG4gIGVsZW1lbnQsXG4gIHZpc2libGVDbGFzcyxcbiAgd2FpdE1vZGUgPSAndHJhbnNpdGlvbmVuZCcsXG4gIHRpbWVvdXREdXJhdGlvbixcbiAgaGlkZU1vZGUgPSAnaGlkZGVuJyxcbiAgZGlzcGxheVZhbHVlID0gJ2Jsb2NrJ1xufSkge1xuICBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0JyAmJiB0eXBlb2YgdGltZW91dER1cmF0aW9uICE9PSAnbnVtYmVyJykge1xuICAgIGNvbnNvbGUuZXJyb3IoYFxuICAgICAgV2hlbiBjYWxsaW5nIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50IHdpdGggd2FpdE1vZGUgc2V0IHRvIHRpbWVvdXQsXG4gICAgICB5b3UgbXVzdCBwYXNzIGluIGEgbnVtYmVyIGZvciB0aW1lb3V0RHVyYXRpb24uXG4gICAgYCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEb24ndCB3YWl0IGZvciBleGl0IHRyYW5zaXRpb25zIGlmIGEgdXNlciBwcmVmZXJzIHJlZHVjZWQgbW90aW9uLlxuICAvLyBJZGVhbGx5IHRyYW5zaXRpb25zIHdpbGwgYmUgZGlzYWJsZWQgaW4gQ1NTLCB3aGljaCBtZWFucyB3ZSBzaG91bGQgbm90IHdhaXRcbiAgLy8gYmVmb3JlIGFkZGluZyBgaGlkZGVuYC5cbiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKScpLm1hdGNoZXMpIHtcbiAgICB3YWl0TW9kZSA9ICdpbW1lZGlhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGxpc3RlbmVyIHRvIGFkZCBgaGlkZGVuYCBhZnRlciBvdXIgYW5pbWF0aW9ucyBjb21wbGV0ZS5cbiAgICogVGhpcyBsaXN0ZW5lciB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgY29tcGxldGluZy5cbiAgICovXG4gIGNvbnN0IGxpc3RlbmVyID0gZSA9PiB7XG4gICAgLy8gQ29uZmlybSBgdHJhbnNpdGlvbmVuZGAgd2FzIGNhbGxlZCBvbiAgb3VyIGBlbGVtZW50YCBhbmQgZGlkbid0IGJ1YmJsZVxuICAgIC8vIHVwIGZyb20gYSBjaGlsZCBlbGVtZW50LlxuICAgIGlmIChlLnRhcmdldCA9PT0gZWxlbWVudCkge1xuICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheVZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvblNob3coKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgbGlzdGVuZXIgc2hvdWxkbid0IGJlIGhlcmUgYnV0IGlmIHNvbWVvbmUgc3BhbXMgdGhlIHRvZ2dsZVxuICAgICAgICogb3ZlciBhbmQgb3ZlciByZWFsbHkgZmFzdCBpdCBjYW4gaW5jb3JyZWN0bHkgc3RpY2sgYXJvdW5kLlxuICAgICAgICogV2UgcmVtb3ZlIGl0IGp1c3QgdG8gYmUgc2FmZS5cbiAgICAgICAqL1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFNpbWlsYXJseSwgd2UnbGwgY2xlYXIgdGhlIHRpbWVvdXQgaW4gY2FzZSBpdCdzIHN0aWxsIGhhbmdpbmcgYXJvdW5kLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIC8qKlxuICAgICAgICogRm9yY2UgYSBicm93c2VyIHJlLXBhaW50IHNvIHRoZSBicm93c2VyIHdpbGwgcmVhbGl6ZSB0aGVcbiAgICAgICAqIGVsZW1lbnQgaXMgbm8gbG9uZ2VyIGBoaWRkZW5gIGFuZCBhbGxvdyB0cmFuc2l0aW9ucy5cbiAgICAgICAqL1xuICAgICAgY29uc3QgcmVmbG93ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIaWRlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvbkhpZGUoKSB7XG4gICAgICBpZiAod2FpdE1vZGUgPT09ICd0cmFuc2l0aW9uZW5kJykge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgICB9IGVsc2UgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICAgIH0sIHRpbWVvdXREdXJhdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoaXMgY2xhc3MgdG8gdHJpZ2dlciBvdXIgYW5pbWF0aW9uXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSBlbGVtZW50J3MgdmlzaWJpbGl0eVxuICAgICAqL1xuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUZWxsIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaGlkZGVuIG9yIG5vdC5cbiAgICAgKi9cbiAgICBpc0hpZGRlbigpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGhpZGRlbiBhdHRyaWJ1dGUgZG9lcyBub3QgcmVxdWlyZSBhIHZhbHVlLiBTaW5jZSBhbiBlbXB0eSBzdHJpbmcgaXNcbiAgICAgICAqIGZhbHN5LCBidXQgc2hvd3MgdGhlIHByZXNlbmNlIG9mIGFuIGF0dHJpYnV0ZSB3ZSBjb21wYXJlIHRvIGBudWxsYFxuICAgICAgICovXG4gICAgICBjb25zdCBoYXNIaWRkZW5BdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaGlkZGVuJykgIT09IG51bGw7XG5cbiAgICAgIGNvbnN0IGlzRGlzcGxheU5vbmUgPSBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJztcblxuICAgICAgY29uc3QgaGFzVmlzaWJsZUNsYXNzID0gWy4uLmVsZW1lbnQuY2xhc3NMaXN0XS5pbmNsdWRlcyh2aXNpYmxlQ2xhc3MpO1xuXG4gICAgICByZXR1cm4gaGFzSGlkZGVuQXR0cmlidXRlIHx8IGlzRGlzcGxheU5vbmUgfHwgIWhhc1Zpc2libGVDbGFzcztcbiAgICB9LFxuXG4gICAgLy8gQSBwbGFjZWhvbGRlciBmb3Igb3VyIGB0aW1lb3V0YFxuICAgIHRpbWVvdXQ6IG51bGxcbiAgfTtcbn0iLCIvKipcbiAgUHJpb3JpdHkrIGhvcml6b250YWwgc2Nyb2xsaW5nIG1lbnUuXG5cbiAgQHBhcmFtIHtPYmplY3R9IG9iamVjdCAtIENvbnRhaW5lciBmb3IgYWxsIG9wdGlvbnMuXG4gICAgQHBhcmFtIHtzdHJpbmcgfHwgRE9NIG5vZGV9IHNlbGVjdG9yIC0gRWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gbmF2U2VsZWN0b3IgLSBOYXYgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gY29udGVudFNlbGVjdG9yIC0gQ29udGVudCBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBpdGVtU2VsZWN0b3IgLSBJdGVtcyBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uTGVmdFNlbGVjdG9yIC0gTGVmdCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvblJpZ2h0U2VsZWN0b3IgLSBSaWdodCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtpbnRlZ2VyIHx8IHN0cmluZ30gc2Nyb2xsU3RlcCAtIEFtb3VudCB0byBzY3JvbGwgb24gYnV0dG9uIGNsaWNrLiAnYXZlcmFnZScgZ2V0cyB0aGUgYXZlcmFnZSBsaW5rIHdpZHRoLlxuKi9cblxuY29uc3QgUHJpb3JpdHlOYXZTY3JvbGxlciA9IGZ1bmN0aW9uKHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlcicsXG4gICAgbmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItbmF2JyxcbiAgICBjb250ZW50U2VsZWN0b3I6IGNvbnRlbnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWNvbnRlbnQnLFxuICAgIGl0ZW1TZWxlY3RvcjogaXRlbVNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItaXRlbScsXG4gICAgYnV0dG9uTGVmdFNlbGVjdG9yOiBidXR0b25MZWZ0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuICAgIGJ1dHRvblJpZ2h0U2VsZWN0b3I6IGJ1dHRvblJpZ2h0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0JyxcbiAgICBzY3JvbGxTdGVwOiBzY3JvbGxTdGVwID0gODBcbiAgfSA9IHt9KSB7XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXIgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiBzZWxlY3RvcjtcblxuICBjb25zdCB2YWxpZGF0ZVNjcm9sbFN0ZXAgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIoc2Nyb2xsU3RlcCkgfHwgc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnO1xuICB9XG5cbiAgaWYgKG5hdlNjcm9sbGVyID09PSB1bmRlZmluZWQgfHwgbmF2U2Nyb2xsZXIgPT09IG51bGwgfHwgIXZhbGlkYXRlU2Nyb2xsU3RlcCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGVyZSBpcyBzb21ldGhpbmcgd3JvbmcsIGNoZWNrIHlvdXIgb3B0aW9ucy4nKTtcbiAgfVxuXG4gIGNvbnN0IG5hdlNjcm9sbGVyTmF2ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihuYXZTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoY29udGVudFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMgPSBuYXZTY3JvbGxlckNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChpdGVtU2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckxlZnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvbkxlZnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyUmlnaHQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvblJpZ2h0U2VsZWN0b3IpO1xuXG4gIGxldCBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZUxlZnQgPSAwO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSAwO1xuICBsZXQgc2Nyb2xsaW5nRGlyZWN0aW9uID0gJyc7XG4gIGxldCBzY3JvbGxPdmVyZmxvdyA9ICcnO1xuICBsZXQgdGltZW91dDtcblxuXG4gIC8vIFNldHMgb3ZlcmZsb3cgYW5kIHRvZ2dsZSBidXR0b25zIGFjY29yZGluZ2x5XG4gIGNvbnN0IHNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgc2Nyb2xsT3ZlcmZsb3cgPSBnZXRPdmVyZmxvdygpO1xuICAgIHRvZ2dsZUJ1dHRvbnMoc2Nyb2xsT3ZlcmZsb3cpO1xuICAgIGNhbGN1bGF0ZVNjcm9sbFN0ZXAoKTtcbiAgfVxuXG5cbiAgLy8gRGVib3VuY2Ugc2V0dGluZyB0aGUgb3ZlcmZsb3cgd2l0aCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgY29uc3QgcmVxdWVzdFNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVvdXQpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aW1lb3V0KTtcblxuICAgIHRpbWVvdXQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHNldE92ZXJmbG93KCk7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8vIEdldHMgdGhlIG92ZXJmbG93IGF2YWlsYWJsZSBvbiB0aGUgbmF2IHNjcm9sbGVyXG4gIGNvbnN0IGdldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNjcm9sbFdpZHRoID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGg7XG4gICAgbGV0IHNjcm9sbFZpZXdwb3J0ID0gbmF2U2Nyb2xsZXJOYXYuY2xpZW50V2lkdGg7XG4gICAgbGV0IHNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0O1xuXG4gICAgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSBzY3JvbGxXaWR0aCAtIChzY3JvbGxWaWV3cG9ydCArIHNjcm9sbExlZnQpO1xuXG4gICAgLy8gMSBpbnN0ZWFkIG9mIDAgdG8gY29tcGVuc2F0ZSBmb3IgbnVtYmVyIHJvdW5kaW5nXG4gICAgbGV0IHNjcm9sbExlZnRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVMZWZ0ID4gMTtcbiAgICBsZXQgc2Nyb2xsUmlnaHRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVSaWdodCA+IDE7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhzY3JvbGxXaWR0aCwgc2Nyb2xsVmlld3BvcnQsIHNjcm9sbEF2YWlsYWJsZUxlZnQsIHNjcm9sbEF2YWlsYWJsZVJpZ2h0KTtcblxuICAgIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uICYmIHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2JvdGgnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2xlZnQnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuICdub25lJztcbiAgICB9XG5cbiAgfVxuXG5cbiAgLy8gQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHN0ZXAgYmFzZWQgb24gdGhlIHdpZHRoIG9mIHRoZSBzY3JvbGxlciBhbmQgdGhlIG51bWJlciBvZiBsaW5rc1xuICBjb25zdCBjYWxjdWxhdGVTY3JvbGxTdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJykge1xuICAgICAgbGV0IHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGggLSAocGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctbGVmdCcpKSArIHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpKTtcblxuICAgICAgbGV0IHNjcm9sbFN0ZXBBdmVyYWdlID0gTWF0aC5mbG9vcihzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyAvIG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zLmxlbmd0aCk7XG5cbiAgICAgIHNjcm9sbFN0ZXAgPSBzY3JvbGxTdGVwQXZlcmFnZTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIE1vdmUgdGhlIHNjcm9sbGVyIHdpdGggYSB0cmFuc2Zvcm1cbiAgY29uc3QgbW92ZVNjcm9sbGVyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG5cbiAgICBpZiAoc2Nyb2xsaW5nID09PSB0cnVlIHx8IChzY3JvbGxPdmVyZmxvdyAhPT0gZGlyZWN0aW9uICYmIHNjcm9sbE92ZXJmbG93ICE9PSAnYm90aCcpKSByZXR1cm47XG5cbiAgICBsZXQgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxTdGVwO1xuICAgIGxldCBzY3JvbGxBdmFpbGFibGUgPSBkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IHNjcm9sbEF2YWlsYWJsZUxlZnQgOiBzY3JvbGxBdmFpbGFibGVSaWdodDtcblxuICAgIC8vIElmIHRoZXJlIHdpbGwgYmUgbGVzcyB0aGFuIDI1JSBvZiB0aGUgbGFzdCBzdGVwIHZpc2libGUgdGhlbiBzY3JvbGwgdG8gdGhlIGVuZFxuICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCAoc2Nyb2xsU3RlcCAqIDEuNzUpKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbEF2YWlsYWJsZTtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSAqPSAtMTtcblxuICAgICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IHNjcm9sbFN0ZXApIHtcbiAgICAgICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NuYXAtYWxpZ24tZW5kJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIHNjcm9sbERpc3RhbmNlICsgJ3B4KSc7XG5cbiAgICBzY3JvbGxpbmdEaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgc2Nyb2xsaW5nID0gdHJ1ZTtcbiAgfVxuXG5cbiAgLy8gU2V0IHRoZSBzY3JvbGxlciBwb3NpdGlvbiBhbmQgcmVtb3ZlcyB0cmFuc2Zvcm0sIGNhbGxlZCBhZnRlciBtb3ZlU2Nyb2xsZXIoKSBpbiB0aGUgdHJhbnNpdGlvbmVuZCBldmVudFxuICBjb25zdCBzZXRTY3JvbGxlclBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50LCBudWxsKTtcbiAgICB2YXIgdHJhbnNmb3JtID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJyk7XG4gICAgdmFyIHRyYW5zZm9ybVZhbHVlID0gTWF0aC5hYnMocGFyc2VJbnQodHJhbnNmb3JtLnNwbGl0KCcsJylbNF0pIHx8IDApO1xuXG4gICAgaWYgKHNjcm9sbGluZ0RpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICB0cmFuc2Zvcm1WYWx1ZSAqPSAtMTtcbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbiAgICBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCArIHRyYW5zZm9ybVZhbHVlO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJywgJ3NuYXAtYWxpZ24tZW5kJyk7XG5cbiAgICBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgfVxuXG5cbiAgLy8gVG9nZ2xlIGJ1dHRvbnMgZGVwZW5kaW5nIG9uIG92ZXJmbG93XG4gIGNvbnN0IHRvZ2dsZUJ1dHRvbnMgPSBmdW5jdGlvbihvdmVyZmxvdykge1xuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAnbGVmdCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdyaWdodCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH1cblxuXG4gIGNvbnN0IGluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgIHNldE92ZXJmbG93KCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlck5hdi5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgc2V0U2Nyb2xsZXJQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJMZWZ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdsZWZ0Jyk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlclJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdyaWdodCcpO1xuICAgIH0pO1xuXG4gIH07XG5cblxuICAvLyBTZWxmIGluaXRcbiAgaW5pdCgpO1xuXG5cbiAgLy8gUmV2ZWFsIEFQSVxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcblxufTtcblxuLy9leHBvcnQgZGVmYXVsdCBQcmlvcml0eU5hdlNjcm9sbGVyO1xuIiwiLyoqXG4gKiBEbyB0aGVzZSB0aGluZ3MgYXMgcXVpY2tseSBhcyBwb3NzaWJsZTsgd2UgbWlnaHQgaGF2ZSBDU1Mgb3IgZWFybHkgc2NyaXB0cyB0aGF0IHJlcXVpcmUgb24gaXRcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ25vLWpzJyApO1xuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdqcycgKTtcbiIsIi8qKlxuICogVGhpcyBsb2FkcyBvdXIgZm9udHMgYW5kIGFkZHMgY2xhc3NlcyB0byB0aGUgSFRNTCBlbGVtZW50XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBGb250IEZhY2UgT2JzZXJ2ZXIgdjIuMS4wXG4gKlxuICovXG5cbi8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5pZiAoIHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgJiYgc2Vzc2lvblN0b3JhZ2Uuc2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsICkge1xuXHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkIHNhbnMtZm9udHMtbG9hZGVkJztcbn0gZWxzZSB7XG5cdC8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4xLjAgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oIGZ1bmN0aW9uKCkge1xuXHRcdCd1c2Ugc3RyaWN0Jzt2YXIgZixcblx0XHRcdGcgPSBbXTtmdW5jdGlvbiBsKCBhICkge1xuXHRcdFx0Zy5wdXNoKCBhICk7MSA9PSBnLmxlbmd0aCAmJiBmKCk7XG5cdFx0fSBmdW5jdGlvbiBtKCkge1xuXHRcdFx0Zm9yICggO2cubGVuZ3RoOyApIHtcblx0XHRcdFx0Z1swXSgpLCBnLnNoaWZ0KCk7XG5cdFx0XHR9XG5cdFx0fWYgPSBmdW5jdGlvbigpIHtcblx0XHRcdHNldFRpbWVvdXQoIG0gKTtcblx0XHR9O2Z1bmN0aW9uIG4oIGEgKSB7XG5cdFx0XHR0aGlzLmEgPSBwO3RoaXMuYiA9IHZvaWQgMDt0aGlzLmYgPSBbXTt2YXIgYiA9IHRoaXM7dHJ5IHtcblx0XHRcdFx0YSggZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0cSggYiwgYSApO1xuXHRcdFx0XHR9LCBmdW5jdGlvbiggYSApIHtcblx0XHRcdFx0XHRyKCBiLCBhICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gY2F0Y2ggKCBjICkge1xuXHRcdFx0XHRyKCBiLCBjICk7XG5cdFx0XHR9XG5cdFx0fSB2YXIgcCA9IDI7ZnVuY3Rpb24gdCggYSApIHtcblx0XHRcdHJldHVybiBuZXcgbiggZnVuY3Rpb24oIGIsIGMgKSB7XG5cdFx0XHRcdGMoIGEgKTtcblx0XHRcdH0gKTtcblx0XHR9IGZ1bmN0aW9uIHUoIGEgKSB7XG5cdFx0XHRyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBiICkge1xuXHRcdFx0XHRiKCBhICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBmdW5jdGlvbiBxKCBhLCBiICkge1xuXHRcdFx0aWYgKCBhLmEgPT0gcCApIHtcblx0XHRcdFx0aWYgKCBiID09IGEgKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcjtcblx0XHRcdFx0fSB2YXIgYyA9ICEgMTt0cnkge1xuXHRcdFx0XHRcdHZhciBkID0gYiAmJiBiLnRoZW47aWYgKCBudWxsICE9IGIgJiYgJ29iamVjdCcgPT09IHR5cGVvZiBiICYmICdmdW5jdGlvbicgPT09IHR5cGVvZiBkICkge1xuXHRcdFx0XHRcdFx0ZC5jYWxsKCBiLCBmdW5jdGlvbiggYiApIHtcblx0XHRcdFx0XHRcdFx0YyB8fCBxKCBhLCBiICk7YyA9ICEgMDtcblx0XHRcdFx0XHRcdH0sIGZ1bmN0aW9uKCBiICkge1xuXHRcdFx0XHRcdFx0XHRjIHx8IHIoIGEsIGIgKTtjID0gISAwO1xuXHRcdFx0XHRcdFx0fSApO3JldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKCBlICkge1xuXHRcdFx0XHRcdGMgfHwgciggYSwgZSApO3JldHVybjtcblx0XHRcdFx0fWEuYSA9IDA7YS5iID0gYjt2KCBhICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHIoIGEsIGIgKSB7XG5cdFx0XHRpZiAoIGEuYSA9PSBwICkge1xuXHRcdFx0XHRpZiAoIGIgPT0gYSApIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yO1xuXHRcdFx0XHR9YS5hID0gMTthLmIgPSBiO3YoIGEgKTtcblx0XHRcdH1cblx0XHR9IGZ1bmN0aW9uIHYoIGEgKSB7XG5cdFx0XHRsKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBhLmEgIT0gcCApIHtcblx0XHRcdFx0XHRmb3IgKCA7YS5mLmxlbmd0aDsgKSB7XG5cdFx0XHRcdFx0XHR2YXIgYiA9IGEuZi5zaGlmdCgpLFxuXHRcdFx0XHRcdFx0XHRjID0gYlswXSxcblx0XHRcdFx0XHRcdFx0ZCA9IGJbMV0sXG5cdFx0XHRcdFx0XHRcdGUgPSBiWzJdLFxuXHRcdFx0XHRcdFx0XHRiID0gYlszXTt0cnkge1xuXHRcdFx0XHRcdFx0XHQwID09IGEuYSA/ICdmdW5jdGlvbicgPT09IHR5cGVvZiBjID8gZSggYy5jYWxsKCB2b2lkIDAsIGEuYiApICkgOiBlKCBhLmIgKSA6IDEgPT0gYS5hICYmICggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGQgPyBlKCBkLmNhbGwoIHZvaWQgMCwgYS5iICkgKSA6IGIoIGEuYiApICk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoICggaCApIHtcblx0XHRcdFx0XHRcdFx0YiggaCApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1uLnByb3RvdHlwZS5nID0gZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jKCB2b2lkIDAsIGEgKTtcblx0XHR9O24ucHJvdG90eXBlLmMgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdHZhciBjID0gdGhpcztyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBkLCBlICkge1xuXHRcdFx0XHRjLmYucHVzaCggWyBhLCBiLCBkLCBlIF0gKTt2KCBjICk7XG5cdFx0XHR9ICk7XG5cdFx0fTtcblx0XHRmdW5jdGlvbiB3KCBhICkge1xuXHRcdFx0cmV0dXJuIG5ldyBuKCBmdW5jdGlvbiggYiwgYyApIHtcblx0XHRcdFx0ZnVuY3Rpb24gZCggYyApIHtcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGQgKSB7XG5cdFx0XHRcdFx0XHRoW2NdID0gZDtlICs9IDE7ZSA9PSBhLmxlbmd0aCAmJiBiKCBoICk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fSB2YXIgZSA9IDAsXG5cdFx0XHRcdFx0aCA9IFtdOzAgPT0gYS5sZW5ndGggJiYgYiggaCApO2ZvciAoIHZhciBrID0gMDtrIDwgYS5sZW5ndGg7ayArPSAxICkge1xuXHRcdFx0XHRcdHUoIGFba10gKS5jKCBkKCBrICksIGMgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0gZnVuY3Rpb24geCggYSApIHtcblx0XHRcdHJldHVybiBuZXcgbiggZnVuY3Rpb24oIGIsIGMgKSB7XG5cdFx0XHRcdGZvciAoIHZhciBkID0gMDtkIDwgYS5sZW5ndGg7ZCArPSAxICkge1xuXHRcdFx0XHRcdHUoIGFbZF0gKS5jKCBiLCBjICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9d2luZG93LlByb21pc2UgfHwgKCB3aW5kb3cuUHJvbWlzZSA9IG4sIHdpbmRvdy5Qcm9taXNlLnJlc29sdmUgPSB1LCB3aW5kb3cuUHJvbWlzZS5yZWplY3QgPSB0LCB3aW5kb3cuUHJvbWlzZS5yYWNlID0geCwgd2luZG93LlByb21pc2UuYWxsID0gdywgd2luZG93LlByb21pc2UucHJvdG90eXBlLnRoZW4gPSBuLnByb3RvdHlwZS5jLCB3aW5kb3cuUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2ggPSBuLnByb3RvdHlwZS5nICk7XG5cdH0oKSApO1xuXG5cdCggZnVuY3Rpb24oKSB7XG5cdFx0ZnVuY3Rpb24gbCggYSwgYiApIHtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPyBhLmFkZEV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCBiLCAhIDEgKSA6IGEuYXR0YWNoRXZlbnQoICdzY3JvbGwnLCBiICk7XG5cdFx0fSBmdW5jdGlvbiBtKCBhICkge1xuXHRcdFx0ZG9jdW1lbnQuYm9keSA/IGEoKSA6IGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uIGMoKSB7XG5cdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgYyApO2EoKTtcblx0XHRcdH0gKSA6IGRvY3VtZW50LmF0dGFjaEV2ZW50KCAnb25yZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24gaygpIHtcblx0XHRcdFx0aWYgKCAnaW50ZXJhY3RpdmUnID09IGRvY3VtZW50LnJlYWR5U3RhdGUgfHwgJ2NvbXBsZXRlJyA9PSBkb2N1bWVudC5yZWFkeVN0YXRlICkge1xuXHRcdFx0XHRcdGRvY3VtZW50LmRldGFjaEV2ZW50KCAnb25yZWFkeXN0YXRlY2hhbmdlJywgayApLCBhKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9IGZ1bmN0aW9uIHQoIGEgKSB7XG5cdFx0XHR0aGlzLmEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO3RoaXMuYS5zZXRBdHRyaWJ1dGUoICdhcmlhLWhpZGRlbicsICd0cnVlJyApO3RoaXMuYS5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIGEgKSApO3RoaXMuYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuZyA9IC0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0ID0gJ21heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4Oyc7dGhpcy5jLnN0eWxlLmNzc1RleHQgPSAnbWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7Jztcblx0XHRcdHRoaXMuZi5zdHlsZS5jc3NUZXh0ID0gJ21heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4Oyc7dGhpcy5oLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTsnO3RoaXMuYi5hcHBlbmRDaGlsZCggdGhpcy5oICk7dGhpcy5jLmFwcGVuZENoaWxkKCB0aGlzLmYgKTt0aGlzLmEuYXBwZW5kQ2hpbGQoIHRoaXMuYiApO3RoaXMuYS5hcHBlbmRDaGlsZCggdGhpcy5jICk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHUoIGEsIGIgKSB7XG5cdFx0XHRhLmEuc3R5bGUuY3NzVGV4dCA9ICdtYXgtd2lkdGg6bm9uZTttaW4td2lkdGg6MjBweDttaW4taGVpZ2h0OjIwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmF1dG87bWFyZ2luOjA7cGFkZGluZzowO3RvcDotOTk5cHg7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQtc3ludGhlc2lzOm5vbmU7Zm9udDonICsgYiArICc7Jztcblx0XHR9IGZ1bmN0aW9uIHooIGEgKSB7XG5cdFx0XHR2YXIgYiA9IGEuYS5vZmZzZXRXaWR0aCxcblx0XHRcdFx0YyA9IGIgKyAxMDA7YS5mLnN0eWxlLndpZHRoID0gYyArICdweCc7YS5jLnNjcm9sbExlZnQgPSBjO2EuYi5zY3JvbGxMZWZ0ID0gYS5iLnNjcm9sbFdpZHRoICsgMTAwO3JldHVybiBhLmcgIT09IGIgPyAoIGEuZyA9IGIsICEgMCApIDogISAxO1xuXHRcdH0gZnVuY3Rpb24gQSggYSwgYiApIHtcblx0XHRcdGZ1bmN0aW9uIGMoKSB7XG5cdFx0XHRcdHZhciBhID0gazt6KCBhICkgJiYgYS5hLnBhcmVudE5vZGUgJiYgYiggYS5nICk7XG5cdFx0XHR9IHZhciBrID0gYTtsKCBhLmIsIGMgKTtsKCBhLmMsIGMgKTt6KCBhICk7XG5cdFx0fSBmdW5jdGlvbiBCKCBhLCBiICkge1xuXHRcdFx0dmFyIGMgPSBiIHx8IHt9O3RoaXMuZmFtaWx5ID0gYTt0aGlzLnN0eWxlID0gYy5zdHlsZSB8fCAnbm9ybWFsJzt0aGlzLndlaWdodCA9IGMud2VpZ2h0IHx8ICdub3JtYWwnO3RoaXMuc3RyZXRjaCA9IGMuc3RyZXRjaCB8fCAnbm9ybWFsJztcblx0XHR9IHZhciBDID0gbnVsbCxcblx0XHRcdEQgPSBudWxsLFxuXHRcdFx0RSA9IG51bGwsXG5cdFx0XHRGID0gbnVsbDtmdW5jdGlvbiBHKCkge1xuXHRcdFx0aWYgKCBudWxsID09PSBEICkge1xuXHRcdFx0XHRpZiAoIEooKSAmJiAvQXBwbGUvLnRlc3QoIHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yICkgKSB7XG5cdFx0XHRcdFx0dmFyIGEgPSAvQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKSg/OlxcLihbMC05XSspKS8uZXhlYyggd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQgKTtEID0gISEgYSAmJiA2MDMgPiBwYXJzZUludCggYVsxXSwgMTAgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHREID0gISAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9IHJldHVybiBEO1xuXHRcdH0gZnVuY3Rpb24gSigpIHtcblx0XHRcdG51bGwgPT09IEYgJiYgKCBGID0gISEgZG9jdW1lbnQuZm9udHMgKTtyZXR1cm4gRjtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gSygpIHtcblx0XHRcdGlmICggbnVsbCA9PT0gRSApIHtcblx0XHRcdFx0dmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO3RyeSB7XG5cdFx0XHRcdFx0YS5zdHlsZS5mb250ID0gJ2NvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmJztcblx0XHRcdFx0fSBjYXRjaCAoIGIgKSB7fUUgPSAnJyAhPT0gYS5zdHlsZS5mb250O1xuXHRcdFx0fSByZXR1cm4gRTtcblx0XHR9IGZ1bmN0aW9uIEwoIGEsIGIgKSB7XG5cdFx0XHRyZXR1cm4gWyBhLnN0eWxlLCBhLndlaWdodCwgSygpID8gYS5zdHJldGNoIDogJycsICcxMDBweCcsIGIgXS5qb2luKCAnICcgKTtcblx0XHR9XG5cdFx0Qi5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0dmFyIGMgPSB0aGlzLFxuXHRcdFx0XHRrID0gYSB8fCAnQkVTYnN3eScsXG5cdFx0XHRcdHIgPSAwLFxuXHRcdFx0XHRuID0gYiB8fCAzRTMsXG5cdFx0XHRcdEggPSAoIG5ldyBEYXRlICkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZSggZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHRcdGlmICggSigpICYmICEgRygpICkge1xuXHRcdFx0XHRcdHZhciBNID0gbmV3IFByb21pc2UoIGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiBlKCkge1xuXHRcdFx0XHRcdFx0XHRcdCggbmV3IERhdGUgKS5nZXRUaW1lKCkgLSBIID49IG4gPyBiKCBFcnJvciggJycgKyBuICsgJ21zIHRpbWVvdXQgZXhjZWVkZWQnICkgKSA6IGRvY3VtZW50LmZvbnRzLmxvYWQoIEwoIGMsICdcIicgKyBjLmZhbWlseSArICdcIicgKSwgayApLnRoZW4oIGZ1bmN0aW9uKCBjICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0MSA8PSBjLmxlbmd0aCA/IGEoKSA6IHNldFRpbWVvdXQoIGUsIDI1ICk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgYiApO1xuXHRcdFx0XHRcdFx0XHR9ZSgpO1xuXHRcdFx0XHRcdFx0fSApLFxuXHRcdFx0XHRcdFx0TiA9IG5ldyBQcm9taXNlKCBmdW5jdGlvbiggYSwgYyApIHtcblx0XHRcdFx0XHRcdFx0ciA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdGMoIEVycm9yKCAnJyArIG4gKyAnbXMgdGltZW91dCBleGNlZWRlZCcgKSApO1xuXHRcdFx0XHRcdFx0XHR9LCBuICk7XG5cdFx0XHRcdFx0XHR9ICk7UHJvbWlzZS5yYWNlKCBbIE4sIE0gXSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCByICk7YSggYyApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YiApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG0oIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gdigpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGI7aWYgKCBiID0gLTEgIT0gZiAmJiAtMSAhPSBnIHx8IC0xICE9IGYgJiYgLTEgIT0gaCB8fCAtMSAhPSBnICYmIC0xICE9IGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0KCBiID0gZiAhPSBnICYmIGYgIT0gaCAmJiBnICE9IGggKSB8fCAoIG51bGwgPT09IEMgJiYgKCBiID0gL0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMoIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50ICksIEMgPSAhISBiICYmICggNTM2ID4gcGFyc2VJbnQoIGJbMV0sIDEwICkgfHwgNTM2ID09PSBwYXJzZUludCggYlsxXSwgMTAgKSAmJiAxMSA+PSBwYXJzZUludCggYlsyXSwgMTAgKSApICksIGIgPSBDICYmICggZiA9PSB3ICYmIGcgPT0gdyAmJiBoID09IHcgfHwgZiA9PSB4ICYmIGcgPT0geCAmJiBoID09IHggfHwgZiA9PSB5ICYmIGcgPT0geSAmJiBoID09IHkgKSApLCBiID0gISBiO1xuXHRcdFx0XHRcdFx0XHR9YiAmJiAoIGQucGFyZW50Tm9kZSAmJiBkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIGQgKSwgY2xlYXJUaW1lb3V0KCByICksIGEoIGMgKSApO1xuXHRcdFx0XHRcdFx0fSBmdW5jdGlvbiBJKCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICggbmV3IERhdGUgKS5nZXRUaW1lKCkgLSBIID49IG4gKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZC5wYXJlbnROb2RlICYmIGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZCApLCBiKCBFcnJvciggJycgK1xuXHRuICsgJ21zIHRpbWVvdXQgZXhjZWVkZWQnICkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgYSA9IGRvY3VtZW50LmhpZGRlbjtpZiAoICEgMCA9PT0gYSB8fCB2b2lkIDAgPT09IGEgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmID0gZS5hLm9mZnNldFdpZHRoLCBnID0gcC5hLm9mZnNldFdpZHRoLCBoID0gcS5hLm9mZnNldFdpZHRoLCB2KCk7XG5cdFx0XHRcdFx0XHRcdFx0fXIgPSBzZXRUaW1lb3V0KCBJLCA1MCApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IHZhciBlID0gbmV3IHQoIGsgKSxcblx0XHRcdFx0XHRcdFx0cCA9IG5ldyB0KCBrICksXG5cdFx0XHRcdFx0XHRcdHEgPSBuZXcgdCggayApLFxuXHRcdFx0XHRcdFx0XHRmID0gLTEsXG5cdFx0XHRcdFx0XHRcdGcgPSAtMSxcblx0XHRcdFx0XHRcdFx0aCA9IC0xLFxuXHRcdFx0XHRcdFx0XHR3ID0gLTEsXG5cdFx0XHRcdFx0XHRcdHggPSAtMSxcblx0XHRcdFx0XHRcdFx0eSA9IC0xLFxuXHRcdFx0XHRcdFx0XHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtkLmRpciA9ICdsdHInO3UoIGUsIEwoIGMsICdzYW5zLXNlcmlmJyApICk7dSggcCwgTCggYywgJ3NlcmlmJyApICk7dSggcSwgTCggYywgJ21vbm9zcGFjZScgKSApO2QuYXBwZW5kQ2hpbGQoIGUuYSApO2QuYXBwZW5kQ2hpbGQoIHAuYSApO2QuYXBwZW5kQ2hpbGQoIHEuYSApO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGQgKTt3ID0gZS5hLm9mZnNldFdpZHRoO3ggPSBwLmEub2Zmc2V0V2lkdGg7eSA9IHEuYS5vZmZzZXRXaWR0aDtJKCk7QSggZSwgZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0XHRcdGYgPSBhO3YoKTtcblx0XHRcdFx0XHRcdH0gKTt1KCBlLFxuXHRcdFx0XHRcdFx0XHRMKCBjLCAnXCInICsgYy5mYW1pbHkgKyAnXCIsc2Fucy1zZXJpZicgKSApO0EoIHAsIGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHRcdFx0XHRnID0gYTt2KCk7XG5cdFx0XHRcdFx0XHR9ICk7dSggcCwgTCggYywgJ1wiJyArIGMuZmFtaWx5ICsgJ1wiLHNlcmlmJyApICk7QSggcSwgZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0XHRcdGggPSBhO3YoKTtcblx0XHRcdFx0XHRcdH0gKTt1KCBxLCBMKCBjLCAnXCInICsgYy5mYW1pbHkgKyAnXCIsbW9ub3NwYWNlJyApICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fTsnb2JqZWN0JyA9PT0gdHlwZW9mIG1vZHVsZSA/IG1vZHVsZS5leHBvcnRzID0gQiA6ICggd2luZG93LkZvbnRGYWNlT2JzZXJ2ZXIgPSBCLCB3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZCA9IEIucHJvdG90eXBlLmxvYWQgKTtcblx0fSgpICk7XG5cblx0Ly8gbWlubnBvc3QgZm9udHNcblxuXHQvLyBzYW5zXG5cdHZhciBzYW5zTm9ybWFsID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoICdmZi1tZXRhLXdlYi1wcm8nICk7XG5cdHZhciBzYW5zQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNhbnNOb3JtYWxJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA0MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cblx0Ly8gc2VyaWZcblx0dmFyIHNlcmlmQm9vayA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDUwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9va0l0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDUwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9sZEl0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQmxhY2sgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA5MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJsYWNrSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogOTAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXG5cdFByb21pc2UuYWxsKCBbXG5cdFx0c2Fuc05vcm1hbC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc0JvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNOb3JtYWxJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9vay5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb29rSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9sZEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCbGFjay5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCbGFja0l0YWxpYy5sb2FkKCBudWxsLCAzMDAwIClcblx0XSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzZXJpZi1mb250cy1sb2FkZWQnO1xuXG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsID0gdHJ1ZTtcblx0fSApO1xuXG5cdFByb21pc2UuYWxsKCBbXG5cdFx0c2Fuc05vcm1hbC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc0JvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNOb3JtYWxJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApXG5cdF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2Fucy1mb250cy1sb2FkZWQnO1xuXG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG59XG5cbiIsIi8qKlxuICogVGhpcyBpcyB1c2VkIHRvIGNhdXNlIEdvb2dsZSBBbmFseXRpY3MgZXZlbnRzIHRvIHJ1blxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuZnVuY3Rpb24gbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgdmFsdWUgKSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdH1cblx0XHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3Igc2hhcmluZyBjb250ZW50XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8vIHRyYWNrIGEgc2hhcmUgdmlhIGFuYWx5dGljcyBldmVudFxuZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gPSAnJyApIHtcblxuXHQvLyBpZiBhIG5vdCBsb2dnZWQgaW4gdXNlciB0cmllcyB0byBlbWFpbCwgZG9uJ3QgY291bnQgdGhhdCBhcyBhIHNoYXJlXG5cdGlmICggISBqUXVlcnkoICdib2R5JyApLmhhc0NsYXNzKCAnbG9nZ2VkLWluJyApICYmICdFbWFpbCcgPT09IHRleHQgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGNhdGVnb3J5ID0gJ1NoYXJlJztcblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0Y2F0ZWdvcnkgPSAnU2hhcmUgLSAnICsgcG9zaXRpb247XG5cdH1cblxuXHQvLyB0cmFjayBhcyBhbiBldmVudCwgYW5kIGFzIHNvY2lhbCBpZiBpdCBpcyB0d2l0dGVyIG9yIGZiXG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnksIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgfHwgJ1R3aXR0ZXInID09PSB0ZXh0ICkge1xuXHRcdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0ICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuLy8gY29weSB0aGUgY3VycmVudCBVUkwgdG8gdGhlIHVzZXIncyBjbGlwYm9hcmRcbmZ1bmN0aW9uIGNvcHlDdXJyZW50VVJMKCkge1xuXHR2YXIgZHVtbXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW5wdXQnICksXG5cdFx0dGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkdW1teSApO1xuXHRkdW1teS52YWx1ZSA9IHRleHQ7XG5cdGR1bW15LnNlbGVjdCgpO1xuXHRkb2N1bWVudC5leGVjQ29tbWFuZCggJ2NvcHknICk7XG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoIGR1bW15ICk7XG59XG5cbi8vIHRvcCBzaGFyZSBidXR0b24gY2xpY2tcbiQoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLmRhdGEoICdzaGFyZS1hY3Rpb24nICk7XG5cdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSApO1xuXG4vLyBjYXVzZSB0aGUgY3VycmVudCBwYWdlIHRvIHByaW50XG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtcHJpbnQgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0d2luZG93LnByaW50KCk7XG59ICk7XG5cbi8vIHdoZW4gdGhlIGNvcHkgbGluayBidXR0b24gaXMgY2xpY2tlZFxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWNvcHktdXJsIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRjb3B5Q3VycmVudFVSTCgpO1xuXHR0bGl0ZS5zaG93KCAoIGUudGFyZ2V0ICksIHsgZ3JhdjogJ3cnIH0gKTtcblx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0dGxpdGUuaGlkZSggKCBlLnRhcmdldCApICk7XG5cdH0sIDMwMDAgKTtcblx0cmV0dXJuIGZhbHNlO1xufSApO1xuXG4vLyB3aGVuIHNoYXJpbmcgdmlhIGZhY2Vib29rLCB0d2l0dGVyLCBvciBlbWFpbCwgb3BlbiB0aGUgZGVzdGluYXRpb24gdXJsIGluIGEgbmV3IHdpbmRvd1xuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWZhY2Vib29rIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXR3aXR0ZXIgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZW1haWwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0dmFyIHVybCA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblx0d2luZG93Lm9wZW4oIHVybCwgJ19ibGFuaycgKTtcbn0gKTtcbiIsIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIE5hdmlnYXRpb24gc2NyaXB0cy4gSW5jbHVkZXMgbW9iaWxlIG9yIHRvZ2dsZSBiZWhhdmlvciwgYW5hbHl0aWNzIHRyYWNraW5nIG9mIHNwZWNpZmljIG1lbnVzLlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKi9cblxuZnVuY3Rpb24gc2V0dXBQcmltYXJ5TmF2KCkge1xuXHRjb25zdCBwcmltYXJ5TmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWxpbmtzJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgcHJpbWFyeU5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgYnV0dG9uJyApO1xuXHRpZiAoIG51bGwgIT09IHByaW1hcnlOYXZUb2dnbGUgKSB7XG5cdFx0cHJpbWFyeU5hdlRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdGNvbnN0IHVzZXJOYXZUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1taW5ucG9zdC1hY2NvdW50IHVsJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgdXNlck5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1taW5ucG9zdC1hY2NvdW50ID4gYScgKTtcblx0aWYgKCBudWxsICE9PSB1c2VyTmF2VG9nZ2xlICkge1xuXHRcdHVzZXJOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHR2YXIgdGFyZ2V0ICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ25hdiAubS1mb3JtLXNlYXJjaCBmaWVsZHNldCAuYS1idXR0b24tc2VudGVuY2UnICk7XG5cdGlmICggbnVsbCAhPT0gdGFyZ2V0ICkge1xuXHRcdHZhciBkaXYgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdGRpdi5pbm5lckhUTUwgPSAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImEtY2xvc2UtYnV0dG9uIGEtY2xvc2Utc2VhcmNoXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG5cdFx0dmFyIGZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRkaXYuc2V0QXR0cmlidXRlKCAnY2xhc3MnLCAnYS1jbG9zZS1ob2xkZXInICk7XG5cdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZCggZnJhZ21lbnQgKTtcblxuXHRcdGNvbnN0IHNlYXJjaFRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWFjdGlvbnMgLm0tZm9ybS1zZWFyY2gnICksXG5cdFx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdFx0fSApO1xuXG5cdFx0dmFyIHNlYXJjaFZpc2libGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbGkuc2VhcmNoID4gYScgKTtcblx0XHRzZWFyY2hWaXNpYmxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdHZhciBzZWFyY2hDbG9zZSAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmEtY2xvc2Utc2VhcmNoJyApO1xuXHRcdHNlYXJjaENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdC8vIGVzY2FwZSBrZXkgcHJlc3Ncblx0JCggZG9jdW1lbnQgKS5rZXl1cCggZnVuY3Rpb24oIGUgKSB7XG5cdFx0aWYgKCAyNyA9PT0gZS5rZXlDb2RlICkge1xuXHRcdFx0bGV0IHByaW1hcnlOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gcHJpbWFyeU5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHVzZXJOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gdXNlck5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHNlYXJjaElzVmlzaWJsZSA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBwcmltYXJ5TmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gcHJpbWFyeU5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHRwcmltYXJ5TmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHByaW1hcnlOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHVzZXJOYXZFeHBhbmRlZCAmJiB0cnVlID09PSB1c2VyTmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgdXNlck5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2Ygc2VhcmNoSXNWaXNpYmxlICYmIHRydWUgPT09IHNlYXJjaElzVmlzaWJsZSApIHtcblx0XHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBzZWFyY2hJc1Zpc2libGUgKTtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIHNldHVwU2Nyb2xsTmF2KCBzZWxlY3RvciwgbmF2U2VsZWN0b3IsIGNvbnRlbnRTZWxlY3RvciApIHtcblxuXHQvLyBJbml0IHdpdGggYWxsIG9wdGlvbnMgYXQgZGVmYXVsdCBzZXR0aW5nXG5cdGNvbnN0IHByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0ID0gUHJpb3JpdHlOYXZTY3JvbGxlcigge1xuXHRcdHNlbGVjdG9yOiBzZWxlY3Rvcixcblx0XHRuYXZTZWxlY3RvcjogbmF2U2VsZWN0b3IsXG5cdFx0Y29udGVudFNlbGVjdG9yOiBjb250ZW50U2VsZWN0b3IsXG5cdFx0aXRlbVNlbGVjdG9yOiAnbGksIGEnLFxuXHRcdGJ1dHRvbkxlZnRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0Jyxcblx0XHRidXR0b25SaWdodFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0J1xuXG5cdFx0Ly9zY3JvbGxTdGVwOiAnYXZlcmFnZSdcblx0fSApO1xuXG5cdC8vIEluaXQgbXVsdGlwbGUgbmF2IHNjcm9sbGVycyB3aXRoIHRoZSBzYW1lIG9wdGlvbnNcblx0LypsZXQgbmF2U2Nyb2xsZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi1zY3JvbGxlcicpO1xuXG5cdG5hdlNjcm9sbGVycy5mb3JFYWNoKChjdXJyZW50VmFsdWUsIGN1cnJlbnRJbmRleCkgPT4ge1xuXHQgIFByaW9yaXR5TmF2U2Nyb2xsZXIoe1xuXHQgICAgc2VsZWN0b3I6IGN1cnJlbnRWYWx1ZVxuXHQgIH0pO1xuXHR9KTsqL1xufVxuXG5zZXR1cFByaW1hcnlOYXYoKTtcblxuaWYgKCAwIDwgJCggJy5tLXN1Yi1uYXZpZ2F0aW9uJyApLmxlbmd0aCApIHtcblx0c2V0dXBTY3JvbGxOYXYoICcubS1zdWItbmF2aWdhdGlvbicsICcubS1zdWJuYXYtbmF2aWdhdGlvbicsICcubS1tZW51LXN1Yi1uYXZpZ2F0aW9uJyApO1xufVxuaWYgKCAwIDwgJCggJy5tLXBhZ2luYXRpb24tbmF2aWdhdGlvbicgKS5sZW5ndGggKSB7XG5cdHNldHVwU2Nyb2xsTmF2KCAnLm0tcGFnaW5hdGlvbi1uYXZpZ2F0aW9uJywgJy5tLXBhZ2luYXRpb24tY29udGFpbmVyJywgJy5tLXBhZ2luYXRpb24tbGlzdCcgKTtcbn1cblxuJCggJ2EnLCAkKCAnLm8tc2l0ZS1zaWRlYmFyJyApICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHR2YXIgd2lkZ2V0VGl0bGUgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0td2lkZ2V0JyApLmZpbmQoICdoMycgKS50ZXh0KCk7XG5cdHZhciB6b25lVGl0bGUgICAgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS16b25lJyApLmZpbmQoICcuYS16b25lLXRpdGxlJyApLnRleHQoKTtcblx0dmFyIHNpZGViYXJTZWN0aW9uVGl0bGUgPSAnJztcblx0aWYgKCAnJyAhPT0gd2lkZ2V0VGl0bGUgKSB7XG5cdFx0c2lkZWJhclNlY3Rpb25UaXRsZSA9IHdpZGdldFRpdGxlO1xuXHR9IGVsc2UgaWYgKCAnJyAhPT0gem9uZVRpdGxlICkge1xuXHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB6b25lVGl0bGU7XG5cdH1cblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBMaW5rJywgJ0NsaWNrJywgc2lkZWJhclNlY3Rpb25UaXRsZSApO1xufSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBmb3Jtc1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG5qUXVlcnkuZm4udGV4dE5vZGVzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNvbnRlbnRzKCkuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKCB0aGlzLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSAmJiAnJyAhPT0gdGhpcy5ub2RlVmFsdWUudHJpbSgpICk7XG5cdH0gKTtcbn07XG5cbmZ1bmN0aW9uIGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoIGFjdGlvbiApIHtcblx0dmFyIG1hcmt1cCA9ICc8bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLWZvcm0tY29uZmlybVwiPjxsYWJlbD5BcmUgeW91IHN1cmU/IDxhIGlkPVwiYS1jb25maXJtLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ZZXM8L2E+IHwgPGEgaWQ9XCJhLXN0b3AtJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPk5vPC9hPjwvbGFiZWw+PC9saT4nO1xuXHRyZXR1cm4gbWFya3VwO1xufVxuXG5mdW5jdGlvbiBtYW5hZ2VFbWFpbHMoKSB7XG5cdHZhciBmb3JtICAgICAgICAgICAgICAgPSAkKCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScgKTtcblx0dmFyIHJlc3RSb290ICAgICAgICAgICA9IHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Quc2l0ZV91cmwgKyB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnJlc3RfbmFtZXNwYWNlO1xuXHR2YXIgZnVsbFVybCAgICAgICAgICAgID0gcmVzdFJvb3QgKyAnLycgKyAndXBkYXRlLXVzZXIvJztcblx0dmFyIGNvbmZpcm1DaGFuZ2UgICAgICA9ICcnO1xuXHR2YXIgbmV4dEVtYWlsQ291bnQgICAgID0gMTtcblx0dmFyIG5ld1ByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgb2xkUHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBwcmltYXJ5SWQgICAgICAgICAgPSAnJztcblx0dmFyIGVtYWlsVG9SZW1vdmUgICAgICA9ICcnO1xuXHR2YXIgY29uc29saWRhdGVkRW1haWxzID0gW107XG5cdHZhciBuZXdFbWFpbHMgICAgICAgICAgPSBbXTtcblx0dmFyIGFqYXhGb3JtRGF0YSAgICAgICA9ICcnO1xuXHR2YXIgdGhhdCAgICAgICAgICAgICAgID0gJyc7XG5cblx0Ly8gc3RhcnQgb3V0IHdpdGggbm8gcHJpbWFyeS9yZW1vdmFscyBjaGVja2VkXG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdC8vIGlmIHRoZXJlIGlzIGEgbGlzdCBvZiBlbWFpbHMgKG5vdCBqdXN0IGEgc2luZ2xlIGZvcm0gZmllbGQpXG5cdGlmICggMCA8ICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoICkge1xuXHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblxuXHRcdC8vIGlmIGEgdXNlciBzZWxlY3RzIGEgbmV3IHByaW1hcnksIG1vdmUgaXQgaW50byB0aGF0IHBvc2l0aW9uXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nLCBmdW5jdGlvbigpIHtcblxuXHRcdFx0bmV3UHJpbWFyeUVtYWlsID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdHByaW1hcnlJZCAgICAgICA9ICQoIHRoaXMgKS5wcm9wKCAnaWQnICkucmVwbGFjZSggJ3ByaW1hcnlfZW1haWxfJywgJycgKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdwcmltYXJ5LWNoYW5nZScgKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXG5cdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBtYWluIGhpZGRlbiBmb3JtIHZhbHVlXG5cdFx0XHRcdCQoICcjZW1haWwnICkudmFsKCBuZXdQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBzdWJtaXQgZm9ybSB2YWx1ZXMuXG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cblx0XHRcdFx0Ly8gdW5jaGVjayB0aGUgcmFkaW8gYnV0dG9uXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIGZvcm0gdmFsdWVzIHRvIHRoZSBvbGQgcHJpbWFyeSBlbWFpbFxuXHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjcmVtb3ZlX2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgY29uZmlybSBtZXNzYWdlXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHR9ICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjaGFuZ2UnLCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZW1haWxUb1JlbW92ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdyZW1vdmFsJyApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSAhPT0gZW1haWxUb1JlbW92ZSApIHtcblx0XHRcdFx0XHRjb25zb2xpZGF0ZWRFbWFpbHMucHVzaCggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyIGZvciByZW1vdmFsXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQvLyBpZiBjb25maXJtZWQsIHJlbW92ZSB0aGUgZW1haWwgYW5kIHN1Ym1pdCB0aGUgZm9ybVxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5mYWRlT3V0KCAnbm9ybWFsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLnJlbW92ZSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCAndmFsdWUgaXMgJyArIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8vIGlmIGEgdXNlciB3YW50cyB0byBhZGQgYW4gZW1haWwsIGdpdmUgdGhlbSBhIHByb3Blcmx5IG51bWJlcmVkIGZpZWxkXG5cdCQoICcubS1mb3JtLWVtYWlsJyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcgKS5iZWZvcmUoICc8ZGl2IGNsYXNzPVwiYS1pbnB1dC13aXRoLWJ1dHRvbiBhLWJ1dHRvbi1zZW50ZW5jZVwiPjxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIGlkPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIHZhbHVlPVwiXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBpZD1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBjbGFzcz1cImEtYnV0dG9uIGEtYnV0dG9uLWFkZC11c2VyLWVtYWlsXCI+QWRkPC9idXR0b24+PC9kaXY+JyApO1xuXHRcdG5leHRFbWFpbENvdW50Kys7XG5cdH0gKTtcblxuXHQkKCAnaW5wdXRbdHlwZT1zdWJtaXRdJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgYnV0dG9uID0gJCggdGhpcyApO1xuXHRcdHZhciBidXR0b25Gb3JtID0gYnV0dG9uLmNsb3Nlc3QoICdmb3JtJyApO1xuXHRcdGJ1dHRvbkZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJywgYnV0dG9uLnZhbCgpICk7XG5cdH0gKTtcblxuXHQkKCAnLm0tZW50cnktY29udGVudCcgKS5vbiggJ3N1Ym1pdCcsICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdHZhciBmb3JtID0gJCggdGhpcyApO1xuXHRcdHZhciBzdWJtaXR0aW5nQnV0dG9uID0gZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nICkgfHwgJyc7XG5cblx0XHQvLyBpZiB0aGVyZSBpcyBubyBzdWJtaXR0aW5nIGJ1dHRvbiwgcGFzcyBpdCBieSBBamF4XG5cdFx0aWYgKCAnJyA9PT0gc3VibWl0dGluZ0J1dHRvbiB8fCAnU2F2ZSBDaGFuZ2VzJyAhPT0gc3VibWl0dGluZ0J1dHRvbiApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhamF4Rm9ybURhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4Rm9ybURhdGEgPSBhamF4Rm9ybURhdGEgKyAnJnJlc3Q9dHJ1ZSc7XG5cdFx0XHQkLmFqYXgoIHtcblx0XHRcdFx0dXJsOiBmdWxsVXJsLFxuXHRcdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKCB4aHIgKSB7XG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRkYXRhOiBhamF4Rm9ybURhdGFcblx0XHRcdH0gKS5kb25lKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0fSApLmdldCgpO1xuXHRcdFx0XHQkLmVhY2goIG5ld0VtYWlscywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9IG5leHRFbWFpbENvdW50ICsgaW5kZXg7XG5cdFx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5hcHBlbmQoICc8bGkgaWQ9XCJ1c2VyLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIj4nICsgdmFsdWUgKyAnPHVsIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS11c2VyLWVtYWlsLWFjdGlvbnNcIj48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtbWFrZS1wcmltYXJ5LWVtYWlsXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJwcmltYXJ5X2VtYWlsXCIgaWQ9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPk1ha2UgUHJpbWFyeTwvc21hbGw+PC9sYWJlbD48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1lbWFpbC1wcmVmZXJlbmNlc1wiPjxhIGhyZWY9XCIvbmV3c2xldHRlcnMvP2VtYWlsPScgKyBlbmNvZGVVUklDb21wb25lbnQoIHZhbHVlICkgKyAnXCI+PHNtYWxsPkVtYWlsIFByZWZlcmVuY2VzPC9zbWFsbD48L2E+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtcmVtb3ZlLWVtYWlsXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJyZW1vdmVfZW1haWxbJyArIG5leHRFbWFpbENvdW50ICsgJ11cIiBpZD1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPlJlbW92ZTwvc21hbGw+PC9sYWJlbD48L2xpPjwvdWw+PC9saT4nICk7XG5cdFx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoICQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCkgKyAnLCcgKyB2YWx1ZSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdCQoICcubS1mb3JtLWNoYW5nZS1lbWFpbCAuYS1pbnB1dC13aXRoLWJ1dHRvbicgKS5yZW1vdmUoKTtcblx0XHRcdFx0aWYgKCAwID09PSAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKSAhPT0gJCggJ2lucHV0W25hbWU9XCJlbWFpbFwiXScgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gaXQgd291bGQgYmUgbmljZSB0byBvbmx5IGxvYWQgdGhlIGZvcm0sIGJ1dCB0aGVuIGNsaWNrIGV2ZW50cyBzdGlsbCBkb24ndCB3b3JrXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cdH0gKTtcbn1cblxuZnVuY3Rpb24gYWRkQXV0b1Jlc2l6ZSgpIHtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJ1tkYXRhLWF1dG9yZXNpemVdJyApLmZvckVhY2goIGZ1bmN0aW9uICggZWxlbWVudCApIHtcblx0XHRjb25zb2xlLmxvZyggJ3NldCB0aGUgc3R5bGUnICk7XG5cdFx0ZWxlbWVudC5zdHlsZS5ib3hTaXppbmcgPSAnYm9yZGVyLWJveCc7XG5cdFx0dmFyIG9mZnNldCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnaW5wdXQnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQudGFyZ2V0LnN0eWxlLmhlaWdodCA9ICdhdXRvJztcblx0XHRcdGV2ZW50LnRhcmdldC5zdHlsZS5oZWlnaHQgPSBldmVudC50YXJnZXQuc2Nyb2xsSGVpZ2h0ICsgb2Zmc2V0ICsgJ3B4Jztcblx0XHR9KTtcblx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSggJ2RhdGEtYXV0b3Jlc2l6ZScgKTtcblx0fSk7XG59XG5cbiQoZG9jdW1lbnQpLmFqYXhTdG9wKGZ1bmN0aW9uKCkge1xuXHRhZGRBdXRvUmVzaXplKCk7XG59KTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKCAwIDwgJCggJy5tLWZvcm0tYWNjb3VudC1zZXR0aW5ncycgKS5sZW5ndGggKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cblx0dmFyIGF1dG9SZXNpemVUZXh0YXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICdbZGF0YS1hdXRvcmVzaXplXScgKTtcblx0aWYgKCBudWxsICE9PSBhdXRvUmVzaXplVGV4dGFyZWEgKSB7XG5cdFx0YWRkQXV0b1Jlc2l6ZSgpO1xuXHR9XG59ICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIGNvbW1lbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8vIGJhc2VkIG9uIHdoaWNoIGJ1dHRvbiB3YXMgY2xpY2tlZCwgc2V0IHRoZSB2YWx1ZXMgZm9yIHRoZSBhbmFseXRpY3MgZXZlbnQgYW5kIGNyZWF0ZSBpdFxuZnVuY3Rpb24gdHJhY2tTaG93Q29tbWVudHMoIGFsd2F5cywgaWQsIGNsaWNrVmFsdWUgKSB7XG5cdHZhciBhY3Rpb24gICAgICAgICAgPSAnJztcblx0dmFyIGNhdGVnb3J5UHJlZml4ID0gJyc7XG5cdHZhciBjYXRlZ29yeVN1ZmZpeCA9ICcnO1xuXHR2YXIgcG9zaXRpb24gICAgICAgID0gJyc7XG5cdHBvc2l0aW9uID0gaWQucmVwbGFjZSggJ2Fsd2F5cy1zaG93LWNvbW1lbnRzLScsICcnICk7XG5cdGlmICggJzEnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPbic7XG5cdH0gZWxzZSBpZiAoICcwJyA9PT0gY2xpY2tWYWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5UHJlZml4ID0gJ0Fsd2F5cyAnO1xuXHR9XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24uY2hhckF0KCAwICkudG9VcHBlckNhc2UoKSArIHBvc2l0aW9uLnNsaWNlKCAxICk7XG5cdFx0Y2F0ZWdvcnlTdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnlQcmVmaXggKyAnU2hvdyBDb21tZW50cycgKyBjYXRlZ29yeVN1ZmZpeCwgYWN0aW9uLCBsb2NhdGlvbi5wYXRobmFtZSApO1xufVxuXG4vLyB3aGVuIHNob3dpbmcgY29tbWVudHMgb25jZSwgdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtYnV0dG9uLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dHJhY2tTaG93Q29tbWVudHMoIGZhbHNlLCAnJywgJycgKTtcbn0gKTtcblxuLy8gU2V0IHVzZXIgbWV0YSB2YWx1ZSBmb3IgYWx3YXlzIHNob3dpbmcgY29tbWVudHMgaWYgdGhhdCBidXR0b24gaXMgY2xpY2tlZFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHZhciB0aGF0ID0gJCggdGhpcyApO1xuXHRpZiAoIHRoYXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gZWxzZSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuXHR0cmFja1Nob3dDb21tZW50cyggdHJ1ZSwgdGhhdC5hdHRyKCAnaWQnICksIHRoYXQudmFsKCkgKTtcblxuXHQvLyB3ZSBhbHJlYWR5IGhhdmUgYWpheHVybCBmcm9tIHRoZSB0aGVtZVxuXHQkLmFqYXgoIHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBhamF4dXJsLFxuXHRcdGRhdGE6IHtcblx0XHRcdCdhY3Rpb24nOiAnbWlubnBvc3RfbGFyZ29fbG9hZF9jb21tZW50c19zZXRfdXNlcl9tZXRhJyxcblx0XHRcdCd2YWx1ZSc6IHRoYXQudmFsKClcblx0XHR9LFxuXHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdCQoICcuYS1hbHdheXMtc2hvdy1jb21tZW50cy1yZXN1bHQnLCB0aGF0LnBhcmVudCgpICkuaHRtbCggcmVzcG9uc2UuZGF0YS5tZXNzYWdlICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IHJlc3BvbnNlLmRhdGEuc2hvdyApIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBldmVudHNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbnZhciB0YXJnZXQgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmEtZXZlbnRzLWNhbC1saW5rcycgKTtcbmlmICggbnVsbCAhPT0gdGFyZ2V0ICkge1xuICAgIHZhciBsaSAgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnbGknICk7XG4gICAgbGkuaW5uZXJIVE1MICA9ICc8YSBocmVmPVwiI1wiIGNsYXNzPVwiYS1jbG9zZS1idXR0b24gYS1jbG9zZS1jYWxlbmRhclwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuICAgIHZhciBmcmFnbWVudCAgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgbGkuc2V0QXR0cmlidXRlKCAnY2xhc3MnLCAnYS1jbG9zZS1ob2xkZXInICk7XG4gICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGxpICk7XG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xufVxuXG5jb25zdCBjYWxlbmRhclRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG4gICAgZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWV2ZW50cy1jYWwtbGlua3MnICksXG4gICAgdmlzaWJsZUNsYXNzOiAnYS1ldmVudHMtY2FsLWxpbmstdmlzaWJsZScsXG4gICAgZGlzcGxheVZhbHVlOiAnYmxvY2snXG59ICk7XG5cbnZhciBjYWxlbmRhclZpc2libGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tZXZlbnQtZGF0ZXRpbWUgYScgKTtcbmlmICggbnVsbCAhPT0gY2FsZW5kYXJWaXNpYmxlICkge1xuICAgIGNhbGVuZGFyVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IGNhbGVuZGFyVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuICAgICAgICBjYWxlbmRhclZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcbiAgICAgICAgaWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcbiAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgdmFyIGNhbGVuZGFyQ2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmEtY2xvc2UtY2FsZW5kYXInICk7XG4gICAgY2FsZW5kYXJDbG9zZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IGNhbGVuZGFyVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuICAgICAgICBjYWxlbmRhclZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcbiAgICAgICAgaWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcbiAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgICB9XG4gICAgfSApO1xufVxuIl19
}(jQuery));
