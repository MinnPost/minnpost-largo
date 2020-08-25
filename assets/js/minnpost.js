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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDAtc3RhcnQuanMiLCIwMS1mb250cy5qcyIsIjAyLWFuYWx5dGljcy5qcyIsIjAzLXNoYXJlLmpzIiwiMDQtbmF2aWdhdGlvbi5qcyIsIjA1LWZvcm1zLmpzIiwiMDYtY29tbWVudHMuanMiLCIwNy1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImRvY3VtZW50RWxlbWVudCIsInNlc3Npb25TdG9yYWdlIiwic2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsInNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsImciLCJwdXNoIiwibSIsInNoaWZ0IiwicCIsImIiLCJxIiwiYyIsInUiLCJUeXBlRXJyb3IiLCJ0aGVuIiwiY2FsbCIsInYiLCJoIiwicHJvdG90eXBlIiwidyIsImsiLCJ4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyYWNlIiwiYWxsIiwiY2F0Y2giLCJhdHRhY2hFdmVudCIsImJvZHkiLCJyZWFkeVN0YXRlIiwiZGV0YWNoRXZlbnQiLCJjcmVhdGVUZXh0Tm9kZSIsImNzc1RleHQiLCJ6Iiwid2lkdGgiLCJBIiwiQiIsImZhbWlseSIsIndlaWdodCIsInN0cmV0Y2giLCJDIiwiRCIsIkUiLCJGIiwiRyIsIkoiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidmVuZG9yIiwiZXhlYyIsInVzZXJBZ2VudCIsImZvbnRzIiwiSyIsImZvbnQiLCJMIiwiam9pbiIsImxvYWQiLCJIIiwiRGF0ZSIsImdldFRpbWUiLCJNIiwiTiIsInkiLCJJIiwiaGlkZGVuIiwiZGlyIiwiRm9udEZhY2VPYnNlcnZlciIsInNhbnNOb3JtYWwiLCJzYW5zQm9sZCIsInNhbnNOb3JtYWxJdGFsaWMiLCJzZXJpZkJvb2siLCJzZXJpZkJvb2tJdGFsaWMiLCJzZXJpZkJvbGQiLCJzZXJpZkJvbGRJdGFsaWMiLCJzZXJpZkJsYWNrIiwic2VyaWZCbGFja0l0YWxpYyIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsInR5cGUiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwidmFsdWUiLCJnYSIsImV2ZW50IiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsImpRdWVyeSIsImhhc0NsYXNzIiwiY29weUN1cnJlbnRVUkwiLCJkdW1teSIsImhyZWYiLCJzZWxlY3QiLCJleGVjQ29tbWFuZCIsIiQiLCJjbGljayIsImRhdGEiLCJwcmV2ZW50RGVmYXVsdCIsInByaW50IiwidXJsIiwiYXR0ciIsIm9wZW4iLCJzZXR1cFByaW1hcnlOYXYiLCJwcmltYXJ5TmF2VHJhbnNpdGlvbmVyIiwicHJpbWFyeU5hdlRvZ2dsZSIsImV4cGFuZGVkIiwidXNlck5hdlRyYW5zaXRpb25lciIsInVzZXJOYXZUb2dnbGUiLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCJrZXl1cCIsImtleUNvZGUiLCJwcmltYXJ5TmF2RXhwYW5kZWQiLCJ1c2VyTmF2RXhwYW5kZWQiLCJzZWFyY2hJc1Zpc2libGUiLCJzZXR1cFNjcm9sbE5hdiIsInVhIiwiaXNJRSIsInByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0Iiwid2lkZ2V0VGl0bGUiLCJjbG9zZXN0IiwiZmluZCIsInpvbmVUaXRsZSIsInNpZGViYXJTZWN0aW9uVGl0bGUiLCJmbiIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwidHJpbSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJmb3JtIiwicmVzdFJvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxVcmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheEZvcm1EYXRhIiwidGhhdCIsInByb3AiLCJvbiIsInZhbCIsInJlcGxhY2UiLCJwYXJlbnQiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJnZXQiLCJwYXJlbnRzIiwiZmFkZU91dCIsImJlZm9yZSIsImJ1dHRvbiIsImJ1dHRvbkZvcm0iLCJzdWJtaXR0aW5nQnV0dG9uIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRvbmUiLCJtYXAiLCJpbmRleCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsImFkZEF1dG9SZXNpemUiLCJmb3JFYWNoIiwiYm94U2l6aW5nIiwib2Zmc2V0IiwiY2xpZW50SGVpZ2h0IiwiaGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0IiwiYWpheFN0b3AiLCJjb21tZW50QXJlYSIsImF1dG9SZXNpemVUZXh0YXJlYSIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiaWQiLCJjbGlja1ZhbHVlIiwiY2F0ZWdvcnlQcmVmaXgiLCJjYXRlZ29yeVN1ZmZpeCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJpcyIsInBhcmFtcyIsImFqYXh1cmwiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJodG1sIiwibWVzc2FnZSIsImN1cnJlbnRTY3JpcHQiLCJwb3N0IiwibGxjYWpheHVybCIsImNvbW1lbnRVcmwiLCJwYXJhbSIsImFkZENvbW1lbnQiLCJjb21tZW50SWQiLCJVUkwiLCJzdWJzdHIiLCJpbmRleE9mIiwic2Nyb2xsVG9wIiwibGkiLCJjYWxlbmRhclRyYW5zaXRpb25lciIsImNhbGVuZGFyVmlzaWJsZSIsImNhbGVuZGFyQ2xvc2UiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsS0FBVCxDQUFlQyxDQUFmLEVBQWlCO0FBQUNDLEVBQUFBLFFBQVEsQ0FBQ0MsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBc0MsVUFBU0MsQ0FBVCxFQUFXO0FBQUMsUUFBSUMsQ0FBQyxHQUFDRCxDQUFDLENBQUNFLE1BQVI7QUFBQSxRQUFlQyxDQUFDLEdBQUNOLENBQUMsQ0FBQ0ksQ0FBRCxDQUFsQjtBQUFzQkUsSUFBQUEsQ0FBQyxLQUFHQSxDQUFDLEdBQUMsQ0FBQ0YsQ0FBQyxHQUFDQSxDQUFDLENBQUNHLGFBQUwsS0FBcUJQLENBQUMsQ0FBQ0ksQ0FBRCxDQUEzQixDQUFELEVBQWlDRSxDQUFDLElBQUVQLEtBQUssQ0FBQ1MsSUFBTixDQUFXSixDQUFYLEVBQWFFLENBQWIsRUFBZSxDQUFDLENBQWhCLENBQXBDO0FBQXVELEdBQS9IO0FBQWlJOztBQUFBUCxLQUFLLENBQUNTLElBQU4sR0FBVyxVQUFTUixDQUFULEVBQVdHLENBQVgsRUFBYUMsQ0FBYixFQUFlO0FBQUMsTUFBSUUsQ0FBQyxHQUFDLFlBQU47QUFBbUJILEVBQUFBLENBQUMsR0FBQ0EsQ0FBQyxJQUFFLEVBQUwsRUFBUSxDQUFDSCxDQUFDLENBQUNTLE9BQUYsSUFBVyxVQUFTVCxDQUFULEVBQVdHLENBQVgsRUFBYTtBQUFDLGFBQVNPLENBQVQsR0FBWTtBQUFDWCxNQUFBQSxLQUFLLENBQUNZLElBQU4sQ0FBV1gsQ0FBWCxFQUFhLENBQUMsQ0FBZDtBQUFpQjs7QUFBQSxhQUFTWSxDQUFULEdBQVk7QUFBQ0MsTUFBQUEsQ0FBQyxL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QUFoQixDQUE4QixlQUE5QixFQUErQyxDQUFFK00sUUFBakQ7O0FBQ0EsUUFBSyxTQUFTQSxRQUFkLEVBQXlCO0FBQ3JCd0gsTUFBQUEsb0JBQW9CLENBQUMxUyxjQUFyQjtBQUNILEtBRkQsTUFFTztBQUNIMFMsTUFBQUEsb0JBQW9CLENBQUMvUyxjQUFyQjtBQUNIO0FBQ0osR0FURDtBQVVIIiwiZmlsZSI6Im1pbm5wb3N0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gdGxpdGUodCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLGZ1bmN0aW9uKGUpe3ZhciBpPWUudGFyZ2V0LG49dChpKTtufHwobj0oaT1pLnBhcmVudEVsZW1lbnQpJiZ0KGkpKSxuJiZ0bGl0ZS5zaG93KGksbiwhMCl9KX10bGl0ZS5zaG93PWZ1bmN0aW9uKHQsZSxpKXt2YXIgbj1cImRhdGEtdGxpdGVcIjtlPWV8fHt9LCh0LnRvb2x0aXB8fGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gbygpe3RsaXRlLmhpZGUodCwhMCl9ZnVuY3Rpb24gbCgpe3J8fChyPWZ1bmN0aW9uKHQsZSxpKXtmdW5jdGlvbiBuKCl7by5jbGFzc05hbWU9XCJ0bGl0ZSB0bGl0ZS1cIityK3M7dmFyIGU9dC5vZmZzZXRUb3AsaT10Lm9mZnNldExlZnQ7by5vZmZzZXRQYXJlbnQ9PT10JiYoZT1pPTApO3ZhciBuPXQub2Zmc2V0V2lkdGgsbD10Lm9mZnNldEhlaWdodCxkPW8ub2Zmc2V0SGVpZ2h0LGY9by5vZmZzZXRXaWR0aCxhPWkrbi8yO28uc3R5bGUudG9wPShcInNcIj09PXI/ZS1kLTEwOlwiblwiPT09cj9lK2wrMTA6ZStsLzItZC8yKStcInB4XCIsby5zdHlsZS5sZWZ0PShcIndcIj09PXM/aTpcImVcIj09PXM/aStuLWY6XCJ3XCI9PT1yP2krbisxMDpcImVcIj09PXI/aS1mLTEwOmEtZi8yKStcInB4XCJ9dmFyIG89ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksbD1pLmdyYXZ8fHQuZ2V0QXR0cmlidXRlKFwiZGF0YS10bGl0ZVwiKXx8XCJuXCI7by5pbm5lckhUTUw9ZSx0LmFwcGVuZENoaWxkKG8pO3ZhciByPWxbMF18fFwiXCIscz1sWzFdfHxcIlwiO24oKTt2YXIgZD1vLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVyblwic1wiPT09ciYmZC50b3A8MD8ocj1cIm5cIixuKCkpOlwiblwiPT09ciYmZC5ib3R0b20+d2luZG93LmlubmVySGVpZ2h0PyhyPVwic1wiLG4oKSk6XCJlXCI9PT1yJiZkLmxlZnQ8MD8ocj1cIndcIixuKCkpOlwid1wiPT09ciYmZC5yaWdodD53aW5kb3cuaW5uZXJXaWR0aCYmKHI9XCJlXCIsbigpKSxvLmNsYXNzTmFtZSs9XCIgdGxpdGUtdmlzaWJsZVwiLG99KHQsZCxlKSl9dmFyIHIscyxkO3JldHVybiB0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixvKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsbyksdC50b29sdGlwPXtzaG93OmZ1bmN0aW9uKCl7ZD10LnRpdGxlfHx0LmdldEF0dHJpYnV0ZShuKXx8ZCx0LnRpdGxlPVwiXCIsdC5zZXRBdHRyaWJ1dGUobixcIlwiKSxkJiYhcyYmKHM9c2V0VGltZW91dChsLGk/MTUwOjEpKX0saGlkZTpmdW5jdGlvbih0KXtpZihpPT09dCl7cz1jbGVhclRpbWVvdXQocyk7dmFyIGU9ciYmci5wYXJlbnROb2RlO2UmJmUucmVtb3ZlQ2hpbGQocikscj12b2lkIDB9fX19KHQsZSkpLnNob3coKX0sdGxpdGUuaGlkZT1mdW5jdGlvbih0LGUpe3QudG9vbHRpcCYmdC50b29sdGlwLmhpZGUoZSl9LFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9dGxpdGUpOyIsIi8qKiBcbiAqIExpYnJhcnkgY29kZVxuICogVXNpbmcgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvQGNsb3VkZm91ci90cmFuc2l0aW9uLWhpZGRlbi1lbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoe1xuICBlbGVtZW50LFxuICB2aXNpYmxlQ2xhc3MsXG4gIHdhaXRNb2RlID0gJ3RyYW5zaXRpb25lbmQnLFxuICB0aW1lb3V0RHVyYXRpb24sXG4gIGhpZGVNb2RlID0gJ2hpZGRlbicsXG4gIGRpc3BsYXlWYWx1ZSA9ICdibG9jaydcbn0pIHtcbiAgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcgJiYgdHlwZW9mIHRpbWVvdXREdXJhdGlvbiAhPT0gJ251bWJlcicpIHtcbiAgICBjb25zb2xlLmVycm9yKGBcbiAgICAgIFdoZW4gY2FsbGluZyB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCB3aXRoIHdhaXRNb2RlIHNldCB0byB0aW1lb3V0LFxuICAgICAgeW91IG11c3QgcGFzcyBpbiBhIG51bWJlciBmb3IgdGltZW91dER1cmF0aW9uLlxuICAgIGApO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRG9uJ3Qgd2FpdCBmb3IgZXhpdCB0cmFuc2l0aW9ucyBpZiBhIHVzZXIgcHJlZmVycyByZWR1Y2VkIG1vdGlvbi5cbiAgLy8gSWRlYWxseSB0cmFuc2l0aW9ucyB3aWxsIGJlIGRpc2FibGVkIGluIENTUywgd2hpY2ggbWVhbnMgd2Ugc2hvdWxkIG5vdCB3YWl0XG4gIC8vIGJlZm9yZSBhZGRpbmcgYGhpZGRlbmAuXG4gIGlmICh3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKS5tYXRjaGVzKSB7XG4gICAgd2FpdE1vZGUgPSAnaW1tZWRpYXRlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBldmVudCBsaXN0ZW5lciB0byBhZGQgYGhpZGRlbmAgYWZ0ZXIgb3VyIGFuaW1hdGlvbnMgY29tcGxldGUuXG4gICAqIFRoaXMgbGlzdGVuZXIgd2lsbCByZW1vdmUgaXRzZWxmIGFmdGVyIGNvbXBsZXRpbmcuXG4gICAqL1xuICBjb25zdCBsaXN0ZW5lciA9IGUgPT4ge1xuICAgIC8vIENvbmZpcm0gYHRyYW5zaXRpb25lbmRgIHdhcyBjYWxsZWQgb24gIG91ciBgZWxlbWVudGAgYW5kIGRpZG4ndCBidWJibGVcbiAgICAvLyB1cCBmcm9tIGEgY2hpbGQgZWxlbWVudC5cbiAgICBpZiAoZS50YXJnZXQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFwcGx5SGlkZGVuQXR0cmlidXRlcyA9ICgpID0+IHtcbiAgICBpZihoaWRlTW9kZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogU2hvdyB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25TaG93KCkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGlzIGxpc3RlbmVyIHNob3VsZG4ndCBiZSBoZXJlIGJ1dCBpZiBzb21lb25lIHNwYW1zIHRoZSB0b2dnbGVcbiAgICAgICAqIG92ZXIgYW5kIG92ZXIgcmVhbGx5IGZhc3QgaXQgY2FuIGluY29ycmVjdGx5IHN0aWNrIGFyb3VuZC5cbiAgICAgICAqIFdlIHJlbW92ZSBpdCBqdXN0IHRvIGJlIHNhZmUuXG4gICAgICAgKi9cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBTaW1pbGFybHksIHdlJ2xsIGNsZWFyIHRoZSB0aW1lb3V0IGluIGNhc2UgaXQncyBzdGlsbCBoYW5naW5nIGFyb3VuZC5cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgIH1cblxuICAgICAgcmVtb3ZlSGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICAvKipcbiAgICAgICAqIEZvcmNlIGEgYnJvd3NlciByZS1wYWludCBzbyB0aGUgYnJvd3NlciB3aWxsIHJlYWxpemUgdGhlXG4gICAgICAgKiBlbGVtZW50IGlzIG5vIGxvbmdlciBgaGlkZGVuYCBhbmQgYWxsb3cgdHJhbnNpdGlvbnMuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHJlZmxvdyA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSGlkZSB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25IaWRlKCkge1xuICAgICAgaWYgKHdhaXRNb2RlID09PSAndHJhbnNpdGlvbmVuZCcpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuICAgICAgfSBlbHNlIGlmICh3YWl0TW9kZSA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuICAgICAgICB9LCB0aW1lb3V0RHVyYXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCB0aGlzIGNsYXNzIHRvIHRyaWdnZXIgb3VyIGFuaW1hdGlvblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHZpc2libGVDbGFzcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZSB0aGUgZWxlbWVudCdzIHZpc2liaWxpdHlcbiAgICAgKi9cbiAgICB0b2dnbGUoKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbigpKSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvblNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGVsbCB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIGhpZGRlbiBvciBub3QuXG4gICAgICovXG4gICAgaXNIaWRkZW4oKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBoaWRkZW4gYXR0cmlidXRlIGRvZXMgbm90IHJlcXVpcmUgYSB2YWx1ZS4gU2luY2UgYW4gZW1wdHkgc3RyaW5nIGlzXG4gICAgICAgKiBmYWxzeSwgYnV0IHNob3dzIHRoZSBwcmVzZW5jZSBvZiBhbiBhdHRyaWJ1dGUgd2UgY29tcGFyZSB0byBgbnVsbGBcbiAgICAgICAqL1xuICAgICAgY29uc3QgaGFzSGlkZGVuQXR0cmlidXRlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hpZGRlbicpICE9PSBudWxsO1xuXG4gICAgICBjb25zdCBpc0Rpc3BsYXlOb25lID0gZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZSc7XG5cbiAgICAgIGNvbnN0IGhhc1Zpc2libGVDbGFzcyA9IFsuLi5lbGVtZW50LmNsYXNzTGlzdF0uaW5jbHVkZXModmlzaWJsZUNsYXNzKTtcblxuICAgICAgcmV0dXJuIGhhc0hpZGRlbkF0dHJpYnV0ZSB8fCBpc0Rpc3BsYXlOb25lIHx8ICFoYXNWaXNpYmxlQ2xhc3M7XG4gICAgfSxcblxuICAgIC8vIEEgcGxhY2Vob2xkZXIgZm9yIG91ciBgdGltZW91dGBcbiAgICB0aW1lb3V0OiBudWxsXG4gIH07XG59IiwiLyoqXG4gIFByaW9yaXR5KyBob3Jpem9udGFsIHNjcm9sbGluZyBtZW51LlxuXG4gIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgLSBDb250YWluZXIgZm9yIGFsbCBvcHRpb25zLlxuICAgIEBwYXJhbSB7c3RyaW5nIHx8IERPTSBub2RlfSBzZWxlY3RvciAtIEVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IG5hdlNlbGVjdG9yIC0gTmF2IGVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRTZWxlY3RvciAtIENvbnRlbnQgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gaXRlbVNlbGVjdG9yIC0gSXRlbXMgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvbkxlZnRTZWxlY3RvciAtIExlZnQgYnV0dG9uIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBidXR0b25SaWdodFNlbGVjdG9yIC0gUmlnaHQgYnV0dG9uIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7aW50ZWdlciB8fCBzdHJpbmd9IHNjcm9sbFN0ZXAgLSBBbW91bnQgdG8gc2Nyb2xsIG9uIGJ1dHRvbiBjbGljay4gJ2F2ZXJhZ2UnIGdldHMgdGhlIGF2ZXJhZ2UgbGluayB3aWR0aC5cbiovXG5cbmNvbnN0IFByaW9yaXR5TmF2U2Nyb2xsZXIgPSBmdW5jdGlvbih7XG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXInLFxuICAgIG5hdlNlbGVjdG9yOiBuYXZTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLW5hdicsXG4gICAgY29udGVudFNlbGVjdG9yOiBjb250ZW50U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1jb250ZW50JyxcbiAgICBpdGVtU2VsZWN0b3I6IGl0ZW1TZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWl0ZW0nLFxuICAgIGJ1dHRvbkxlZnRTZWxlY3RvcjogYnV0dG9uTGVmdFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0JyxcbiAgICBidXR0b25SaWdodFNlbGVjdG9yOiBidXR0b25SaWdodFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItYnRuLS1yaWdodCcsXG4gICAgc2Nyb2xsU3RlcDogc2Nyb2xsU3RlcCA9IDgwXG4gIH0gPSB7fSkge1xuXG4gIGNvbnN0IG5hdlNjcm9sbGVyID0gdHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIDogc2VsZWN0b3I7XG5cbiAgY29uc3QgdmFsaWRhdGVTY3JvbGxTdGVwID0gKCkgPT4ge1xuICAgIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKHNjcm9sbFN0ZXApIHx8IHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJztcbiAgfVxuXG4gIGlmIChuYXZTY3JvbGxlciA9PT0gdW5kZWZpbmVkIHx8IG5hdlNjcm9sbGVyID09PSBudWxsIHx8ICF2YWxpZGF0ZVNjcm9sbFN0ZXAoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgc29tZXRoaW5nIHdyb25nLCBjaGVjayB5b3VyIG9wdGlvbnMuJyk7XG4gIH1cblxuICBjb25zdCBuYXZTY3JvbGxlck5hdiA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IobmF2U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckNvbnRlbnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGNvbnRlbnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zID0gbmF2U2Nyb2xsZXJDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoaXRlbVNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJMZWZ0ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihidXR0b25MZWZ0U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlclJpZ2h0ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihidXR0b25SaWdodFNlbGVjdG9yKTtcblxuICBsZXQgc2Nyb2xsaW5nID0gZmFsc2U7XG4gIGxldCBzY3JvbGxBdmFpbGFibGVMZWZ0ID0gMDtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID0gMDtcbiAgbGV0IHNjcm9sbGluZ0RpcmVjdGlvbiA9ICcnO1xuICBsZXQgc2Nyb2xsT3ZlcmZsb3cgPSAnJztcbiAgbGV0IHRpbWVvdXQ7XG5cblxuICAvLyBTZXRzIG92ZXJmbG93IGFuZCB0b2dnbGUgYnV0dG9ucyBhY2NvcmRpbmdseVxuICBjb25zdCBzZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIHNjcm9sbE92ZXJmbG93ID0gZ2V0T3ZlcmZsb3coKTtcbiAgICB0b2dnbGVCdXR0b25zKHNjcm9sbE92ZXJmbG93KTtcbiAgICBjYWxjdWxhdGVTY3JvbGxTdGVwKCk7XG4gIH1cblxuXG4gIC8vIERlYm91bmNlIHNldHRpbmcgdGhlIG92ZXJmbG93IHdpdGggcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIGNvbnN0IHJlcXVlc3RTZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aW1lb3V0KSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGltZW91dCk7XG5cbiAgICB0aW1lb3V0ID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBzZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuICB9XG5cblxuICAvLyBHZXRzIHRoZSBvdmVyZmxvdyBhdmFpbGFibGUgb24gdGhlIG5hdiBzY3JvbGxlclxuICBjb25zdCBnZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzY3JvbGxXaWR0aCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbFdpZHRoO1xuICAgIGxldCBzY3JvbGxWaWV3cG9ydCA9IG5hdlNjcm9sbGVyTmF2LmNsaWVudFdpZHRoO1xuICAgIGxldCBzY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdDtcblxuICAgIHNjcm9sbEF2YWlsYWJsZUxlZnQgPSBzY3JvbGxMZWZ0O1xuICAgIHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID0gc2Nyb2xsV2lkdGggLSAoc2Nyb2xsVmlld3BvcnQgKyBzY3JvbGxMZWZ0KTtcblxuICAgIC8vIDEgaW5zdGVhZCBvZiAwIHRvIGNvbXBlbnNhdGUgZm9yIG51bWJlciByb3VuZGluZ1xuICAgIGxldCBzY3JvbGxMZWZ0Q29uZGl0aW9uID0gc2Nyb2xsQXZhaWxhYmxlTGVmdCA+IDE7XG4gICAgbGV0IHNjcm9sbFJpZ2h0Q29uZGl0aW9uID0gc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPiAxO1xuXG4gICAgLy8gY29uc29sZS5sb2coc2Nyb2xsV2lkdGgsIHNjcm9sbFZpZXdwb3J0LCBzY3JvbGxBdmFpbGFibGVMZWZ0LCBzY3JvbGxBdmFpbGFibGVSaWdodCk7XG5cbiAgICBpZiAoc2Nyb2xsTGVmdENvbmRpdGlvbiAmJiBzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdib3RoJztcbiAgICB9XG4gICAgZWxzZSBpZiAoc2Nyb2xsTGVmdENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdsZWZ0JztcbiAgICB9XG4gICAgZWxzZSBpZiAoc2Nyb2xsUmlnaHRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAncmlnaHQnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiAnbm9uZSc7XG4gICAgfVxuXG4gIH1cblxuXG4gIC8vIENhbGN1bGF0ZXMgdGhlIHNjcm9sbCBzdGVwIGJhc2VkIG9uIHRoZSB3aWR0aCBvZiB0aGUgc2Nyb2xsZXIgYW5kIHRoZSBudW1iZXIgb2YgbGlua3NcbiAgY29uc3QgY2FsY3VsYXRlU2Nyb2xsU3RlcCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzY3JvbGxTdGVwID09PSAnYXZlcmFnZScpIHtcbiAgICAgIGxldCBzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbFdpZHRoIC0gKHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWxlZnQnKSkgKyBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1yaWdodCcpKSk7XG5cbiAgICAgIGxldCBzY3JvbGxTdGVwQXZlcmFnZSA9IE1hdGguZmxvb3Ioc2Nyb2xsVmlld3BvcnROb1BhZGRpbmcgLyBuYXZTY3JvbGxlckNvbnRlbnRJdGVtcy5sZW5ndGgpO1xuXG4gICAgICBzY3JvbGxTdGVwID0gc2Nyb2xsU3RlcEF2ZXJhZ2U7XG4gICAgfVxuICB9XG5cblxuICAvLyBNb3ZlIHRoZSBzY3JvbGxlciB3aXRoIGEgdHJhbnNmb3JtXG4gIGNvbnN0IG1vdmVTY3JvbGxlciA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuXG4gICAgaWYgKHNjcm9sbGluZyA9PT0gdHJ1ZSB8fCAoc2Nyb2xsT3ZlcmZsb3cgIT09IGRpcmVjdGlvbiAmJiBzY3JvbGxPdmVyZmxvdyAhPT0gJ2JvdGgnKSkgcmV0dXJuO1xuXG4gICAgbGV0IHNjcm9sbERpc3RhbmNlID0gc2Nyb2xsU3RlcDtcbiAgICBsZXQgc2Nyb2xsQXZhaWxhYmxlID0gZGlyZWN0aW9uID09PSAnbGVmdCcgPyBzY3JvbGxBdmFpbGFibGVMZWZ0IDogc2Nyb2xsQXZhaWxhYmxlUmlnaHQ7XG5cbiAgICAvLyBJZiB0aGVyZSB3aWxsIGJlIGxlc3MgdGhhbiAyNSUgb2YgdGhlIGxhc3Qgc3RlcCB2aXNpYmxlIHRoZW4gc2Nyb2xsIHRvIHRoZSBlbmRcbiAgICBpZiAoc2Nyb2xsQXZhaWxhYmxlIDwgKHNjcm9sbFN0ZXAgKiAxLjc1KSkge1xuICAgICAgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxBdmFpbGFibGU7XG4gICAgfVxuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgc2Nyb2xsRGlzdGFuY2UgKj0gLTE7XG5cbiAgICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCBzY3JvbGxTdGVwKSB7XG4gICAgICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QuYWRkKCdzbmFwLWFsaWduLWVuZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJyk7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKCcgKyBzY3JvbGxEaXN0YW5jZSArICdweCknO1xuXG4gICAgc2Nyb2xsaW5nRGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHNjcm9sbGluZyA9IHRydWU7XG4gIH1cblxuXG4gIC8vIFNldCB0aGUgc2Nyb2xsZXIgcG9zaXRpb24gYW5kIHJlbW92ZXMgdHJhbnNmb3JtLCBjYWxsZWQgYWZ0ZXIgbW92ZVNjcm9sbGVyKCkgaW4gdGhlIHRyYW5zaXRpb25lbmQgZXZlbnRcbiAgY29uc3Qgc2V0U2Nyb2xsZXJQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCwgbnVsbCk7XG4gICAgdmFyIHRyYW5zZm9ybSA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3RyYW5zZm9ybScpO1xuICAgIHZhciB0cmFuc2Zvcm1WYWx1ZSA9IE1hdGguYWJzKHBhcnNlSW50KHRyYW5zZm9ybS5zcGxpdCgnLCcpWzRdKSB8fCAwKTtcblxuICAgIGlmIChzY3JvbGxpbmdEaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuICAgICAgdHJhbnNmb3JtVmFsdWUgKj0gLTE7XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJyc7XG4gICAgbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQgKyB0cmFuc2Zvcm1WYWx1ZTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnbm8tdHJhbnNpdGlvbicsICdzbmFwLWFsaWduLWVuZCcpO1xuXG4gICAgc2Nyb2xsaW5nID0gZmFsc2U7XG4gIH1cblxuXG4gIC8vIFRvZ2dsZSBidXR0b25zIGRlcGVuZGluZyBvbiBvdmVyZmxvd1xuICBjb25zdCB0b2dnbGVCdXR0b25zID0gZnVuY3Rpb24ob3ZlcmZsb3cpIHtcbiAgICBpZiAob3ZlcmZsb3cgPT09ICdib3RoJyB8fCBvdmVyZmxvdyA9PT0gJ2xlZnQnKSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJMZWZ0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cblxuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAncmlnaHQnKSB7XG4gICAgICBuYXZTY3JvbGxlclJpZ2h0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuICB9XG5cblxuICBjb25zdCBpbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICBzZXRPdmVyZmxvdygpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHJlcXVlc3RTZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJOYXYuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsICgpID0+IHtcbiAgICAgIHNldFNjcm9sbGVyUG9zaXRpb24oKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyTGVmdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1vdmVTY3JvbGxlcignbGVmdCcpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJSaWdodC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1vdmVTY3JvbGxlcigncmlnaHQnKTtcbiAgICB9KTtcblxuICB9O1xuXG5cbiAgLy8gU2VsZiBpbml0XG4gIGluaXQoKTtcblxuXG4gIC8vIFJldmVhbCBBUElcbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG5cbn07XG5cbi8vZXhwb3J0IGRlZmF1bHQgUHJpb3JpdHlOYXZTY3JvbGxlcjtcbiIsIi8qKlxuICogRG8gdGhlc2UgdGhpbmdzIGFzIHF1aWNrbHkgYXMgcG9zc2libGU7IHdlIG1pZ2h0IGhhdmUgQ1NTIG9yIGVhcmx5IHNjcmlwdHMgdGhhdCByZXF1aXJlIG9uIGl0XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICduby1qcycgKTtcbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCAnanMnICk7XG4iLCIvKipcbiAqIFRoaXMgbG9hZHMgb3VyIGZvbnRzIGFuZCBhZGRzIGNsYXNzZXMgdG8gdGhlIEhUTUwgZWxlbWVudFxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgRm9udCBGYWNlIE9ic2VydmVyIHYyLjEuMFxuICpcbiAqL1xuXG4vLyBPcHRpbWl6YXRpb24gZm9yIFJlcGVhdCBWaWV3c1xuaWYgKCBzZXNzaW9uU3RvcmFnZS5zZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsICYmIHNlc3Npb25TdG9yYWdlLnNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCApIHtcblx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIHNlcmlmLWZvbnRzLWxvYWRlZCBzYW5zLWZvbnRzLWxvYWRlZCc7XG59IGVsc2Uge1xuXHQvKiBGb250IEZhY2UgT2JzZXJ2ZXIgdjIuMS4wIC0gwqkgQnJhbSBTdGVpbi4gTGljZW5zZTogQlNELTMtQ2xhdXNlICovKCBmdW5jdGlvbigpIHtcblx0XHQndXNlIHN0cmljdCc7dmFyIGYsXG5cdFx0XHRnID0gW107ZnVuY3Rpb24gbCggYSApIHtcblx0XHRcdGcucHVzaCggYSApOzEgPT0gZy5sZW5ndGggJiYgZigpO1xuXHRcdH0gZnVuY3Rpb24gbSgpIHtcblx0XHRcdGZvciAoIDtnLmxlbmd0aDsgKSB7XG5cdFx0XHRcdGdbMF0oKSwgZy5zaGlmdCgpO1xuXHRcdFx0fVxuXHRcdH1mID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRzZXRUaW1lb3V0KCBtICk7XG5cdFx0fTtmdW5jdGlvbiBuKCBhICkge1xuXHRcdFx0dGhpcy5hID0gcDt0aGlzLmIgPSB2b2lkIDA7dGhpcy5mID0gW107dmFyIGIgPSB0aGlzO3RyeSB7XG5cdFx0XHRcdGEoIGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHRcdHEoIGIsIGEgKTtcblx0XHRcdFx0fSwgZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0ciggYiwgYSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9IGNhdGNoICggYyApIHtcblx0XHRcdFx0ciggYiwgYyApO1xuXHRcdFx0fVxuXHRcdH0gdmFyIHAgPSAyO2Z1bmN0aW9uIHQoIGEgKSB7XG5cdFx0XHRyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBiLCBjICkge1xuXHRcdFx0XHRjKCBhICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBmdW5jdGlvbiB1KCBhICkge1xuXHRcdFx0cmV0dXJuIG5ldyBuKCBmdW5jdGlvbiggYiApIHtcblx0XHRcdFx0YiggYSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZnVuY3Rpb24gcSggYSwgYiApIHtcblx0XHRcdGlmICggYS5hID09IHAgKSB7XG5cdFx0XHRcdGlmICggYiA9PSBhICkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3I7XG5cdFx0XHRcdH0gdmFyIGMgPSAhIDE7dHJ5IHtcblx0XHRcdFx0XHR2YXIgZCA9IGIgJiYgYi50aGVuO2lmICggbnVsbCAhPSBiICYmICdvYmplY3QnID09PSB0eXBlb2YgYiAmJiAnZnVuY3Rpb24nID09PSB0eXBlb2YgZCApIHtcblx0XHRcdFx0XHRcdGQuY2FsbCggYiwgZnVuY3Rpb24oIGIgKSB7XG5cdFx0XHRcdFx0XHRcdGMgfHwgcSggYSwgYiApO2MgPSAhIDA7XG5cdFx0XHRcdFx0XHR9LCBmdW5jdGlvbiggYiApIHtcblx0XHRcdFx0XHRcdFx0YyB8fCByKCBhLCBiICk7YyA9ICEgMDtcblx0XHRcdFx0XHRcdH0gKTtyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoICggZSApIHtcblx0XHRcdFx0XHRjIHx8IHIoIGEsIGUgKTtyZXR1cm47XG5cdFx0XHRcdH1hLmEgPSAwO2EuYiA9IGI7diggYSApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmdW5jdGlvbiByKCBhLCBiICkge1xuXHRcdFx0aWYgKCBhLmEgPT0gcCApIHtcblx0XHRcdFx0aWYgKCBiID09IGEgKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcjtcblx0XHRcdFx0fWEuYSA9IDE7YS5iID0gYjt2KCBhICk7XG5cdFx0XHR9XG5cdFx0fSBmdW5jdGlvbiB2KCBhICkge1xuXHRcdFx0bCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggYS5hICE9IHAgKSB7XG5cdFx0XHRcdFx0Zm9yICggO2EuZi5sZW5ndGg7ICkge1xuXHRcdFx0XHRcdFx0dmFyIGIgPSBhLmYuc2hpZnQoKSxcblx0XHRcdFx0XHRcdFx0YyA9IGJbMF0sXG5cdFx0XHRcdFx0XHRcdGQgPSBiWzFdLFxuXHRcdFx0XHRcdFx0XHRlID0gYlsyXSxcblx0XHRcdFx0XHRcdFx0YiA9IGJbM107dHJ5IHtcblx0XHRcdFx0XHRcdFx0MCA9PSBhLmEgPyAnZnVuY3Rpb24nID09PSB0eXBlb2YgYyA/IGUoIGMuY2FsbCggdm9pZCAwLCBhLmIgKSApIDogZSggYS5iICkgOiAxID09IGEuYSAmJiAoICdmdW5jdGlvbicgPT09IHR5cGVvZiBkID8gZSggZC5jYWxsKCB2b2lkIDAsIGEuYiApICkgOiBiKCBhLmIgKSApO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoIGggKSB7XG5cdFx0XHRcdFx0XHRcdGIoIGggKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9bi5wcm90b3R5cGUuZyA9IGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYyggdm9pZCAwLCBhICk7XG5cdFx0fTtuLnByb3RvdHlwZS5jID0gZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHR2YXIgYyA9IHRoaXM7cmV0dXJuIG5ldyBuKCBmdW5jdGlvbiggZCwgZSApIHtcblx0XHRcdFx0Yy5mLnB1c2goIFsgYSwgYiwgZCwgZSBdICk7diggYyApO1xuXHRcdFx0fSApO1xuXHRcdH07XG5cdFx0ZnVuY3Rpb24gdyggYSApIHtcblx0XHRcdHJldHVybiBuZXcgbiggZnVuY3Rpb24oIGIsIGMgKSB7XG5cdFx0XHRcdGZ1bmN0aW9uIGQoIGMgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBkICkge1xuXHRcdFx0XHRcdFx0aFtjXSA9IGQ7ZSArPSAxO2UgPT0gYS5sZW5ndGggJiYgYiggaCApO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH0gdmFyIGUgPSAwLFxuXHRcdFx0XHRcdGggPSBbXTswID09IGEubGVuZ3RoICYmIGIoIGggKTtmb3IgKCB2YXIgayA9IDA7ayA8IGEubGVuZ3RoO2sgKz0gMSApIHtcblx0XHRcdFx0XHR1KCBhW2tdICkuYyggZCggayApLCBjICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9IGZ1bmN0aW9uIHgoIGEgKSB7XG5cdFx0XHRyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBiLCBjICkge1xuXHRcdFx0XHRmb3IgKCB2YXIgZCA9IDA7ZCA8IGEubGVuZ3RoO2QgKz0gMSApIHtcblx0XHRcdFx0XHR1KCBhW2RdICkuYyggYiwgYyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fXdpbmRvdy5Qcm9taXNlIHx8ICggd2luZG93LlByb21pc2UgPSBuLCB3aW5kb3cuUHJvbWlzZS5yZXNvbHZlID0gdSwgd2luZG93LlByb21pc2UucmVqZWN0ID0gdCwgd2luZG93LlByb21pc2UucmFjZSA9IHgsIHdpbmRvdy5Qcm9taXNlLmFsbCA9IHcsIHdpbmRvdy5Qcm9taXNlLnByb3RvdHlwZS50aGVuID0gbi5wcm90b3R5cGUuYywgd2luZG93LlByb21pc2UucHJvdG90eXBlLmNhdGNoID0gbi5wcm90b3R5cGUuZyApO1xuXHR9KCkgKTtcblxuXHQoIGZ1bmN0aW9uKCkge1xuXHRcdGZ1bmN0aW9uIGwoIGEsIGIgKSB7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyID8gYS5hZGRFdmVudExpc3RlbmVyKCAnc2Nyb2xsJywgYiwgISAxICkgOiBhLmF0dGFjaEV2ZW50KCAnc2Nyb2xsJywgYiApO1xuXHRcdH0gZnVuY3Rpb24gbSggYSApIHtcblx0XHRcdGRvY3VtZW50LmJvZHkgPyBhKCkgOiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyID8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiBjKCkge1xuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGMgKTthKCk7XG5cdFx0XHR9ICkgOiBkb2N1bWVudC5hdHRhY2hFdmVudCggJ29ucmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uIGsoKSB7XG5cdFx0XHRcdGlmICggJ2ludGVyYWN0aXZlJyA9PSBkb2N1bWVudC5yZWFkeVN0YXRlIHx8ICdjb21wbGV0ZScgPT0gZG9jdW1lbnQucmVhZHlTdGF0ZSApIHtcblx0XHRcdFx0XHRkb2N1bWVudC5kZXRhY2hFdmVudCggJ29ucmVhZHlzdGF0ZWNoYW5nZScsIGsgKSwgYSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSBmdW5jdGlvbiB0KCBhICkge1xuXHRcdFx0dGhpcy5hID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTt0aGlzLmEuc2V0QXR0cmlidXRlKCAnYXJpYS1oaWRkZW4nLCAndHJ1ZScgKTt0aGlzLmEuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCBhICkgKTt0aGlzLmIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTt0aGlzLmMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTt0aGlzLmggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTt0aGlzLmYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTt0aGlzLmcgPSAtMTt0aGlzLmIuc3R5bGUuY3NzVGV4dCA9ICdtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDsnO3RoaXMuYy5zdHlsZS5jc3NUZXh0ID0gJ21heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4Oyc7XG5cdFx0XHR0aGlzLmYuc3R5bGUuY3NzVGV4dCA9ICdtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDsnO3RoaXMuaC5zdHlsZS5jc3NUZXh0ID0gJ2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjIwMCU7aGVpZ2h0OjIwMCU7Zm9udC1zaXplOjE2cHg7bWF4LXdpZHRoOm5vbmU7Jzt0aGlzLmIuYXBwZW5kQ2hpbGQoIHRoaXMuaCApO3RoaXMuYy5hcHBlbmRDaGlsZCggdGhpcy5mICk7dGhpcy5hLmFwcGVuZENoaWxkKCB0aGlzLmIgKTt0aGlzLmEuYXBwZW5kQ2hpbGQoIHRoaXMuYyApO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB1KCBhLCBiICkge1xuXHRcdFx0YS5hLnN0eWxlLmNzc1RleHQgPSAnbWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6JyArIGIgKyAnOyc7XG5cdFx0fSBmdW5jdGlvbiB6KCBhICkge1xuXHRcdFx0dmFyIGIgPSBhLmEub2Zmc2V0V2lkdGgsXG5cdFx0XHRcdGMgPSBiICsgMTAwO2EuZi5zdHlsZS53aWR0aCA9IGMgKyAncHgnO2EuYy5zY3JvbGxMZWZ0ID0gYzthLmIuc2Nyb2xsTGVmdCA9IGEuYi5zY3JvbGxXaWR0aCArIDEwMDtyZXR1cm4gYS5nICE9PSBiID8gKCBhLmcgPSBiLCAhIDAgKSA6ICEgMTtcblx0XHR9IGZ1bmN0aW9uIEEoIGEsIGIgKSB7XG5cdFx0XHRmdW5jdGlvbiBjKCkge1xuXHRcdFx0XHR2YXIgYSA9IGs7eiggYSApICYmIGEuYS5wYXJlbnROb2RlICYmIGIoIGEuZyApO1xuXHRcdFx0fSB2YXIgayA9IGE7bCggYS5iLCBjICk7bCggYS5jLCBjICk7eiggYSApO1xuXHRcdH0gZnVuY3Rpb24gQiggYSwgYiApIHtcblx0XHRcdHZhciBjID0gYiB8fCB7fTt0aGlzLmZhbWlseSA9IGE7dGhpcy5zdHlsZSA9IGMuc3R5bGUgfHwgJ25vcm1hbCc7dGhpcy53ZWlnaHQgPSBjLndlaWdodCB8fCAnbm9ybWFsJzt0aGlzLnN0cmV0Y2ggPSBjLnN0cmV0Y2ggfHwgJ25vcm1hbCc7XG5cdFx0fSB2YXIgQyA9IG51bGwsXG5cdFx0XHREID0gbnVsbCxcblx0XHRcdEUgPSBudWxsLFxuXHRcdFx0RiA9IG51bGw7ZnVuY3Rpb24gRygpIHtcblx0XHRcdGlmICggbnVsbCA9PT0gRCApIHtcblx0XHRcdFx0aWYgKCBKKCkgJiYgL0FwcGxlLy50ZXN0KCB3aW5kb3cubmF2aWdhdG9yLnZlbmRvciApICkge1xuXHRcdFx0XHRcdHZhciBhID0gL0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMoIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50ICk7RCA9ICEhIGEgJiYgNjAzID4gcGFyc2VJbnQoIGFbMV0sIDEwICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0RCA9ICEgMTtcblx0XHRcdFx0fVxuXHRcdFx0fSByZXR1cm4gRDtcblx0XHR9IGZ1bmN0aW9uIEooKSB7XG5cdFx0XHRudWxsID09PSBGICYmICggRiA9ICEhIGRvY3VtZW50LmZvbnRzICk7cmV0dXJuIEY7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIEsoKSB7XG5cdFx0XHRpZiAoIG51bGwgPT09IEUgKSB7XG5cdFx0XHRcdHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTt0cnkge1xuXHRcdFx0XHRcdGEuc3R5bGUuZm9udCA9ICdjb25kZW5zZWQgMTAwcHggc2Fucy1zZXJpZic7XG5cdFx0XHRcdH0gY2F0Y2ggKCBiICkge31FID0gJycgIT09IGEuc3R5bGUuZm9udDtcblx0XHRcdH0gcmV0dXJuIEU7XG5cdFx0fSBmdW5jdGlvbiBMKCBhLCBiICkge1xuXHRcdFx0cmV0dXJuIFsgYS5zdHlsZSwgYS53ZWlnaHQsIEsoKSA/IGEuc3RyZXRjaCA6ICcnLCAnMTAwcHgnLCBiIF0uam9pbiggJyAnICk7XG5cdFx0fVxuXHRcdEIucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdHZhciBjID0gdGhpcyxcblx0XHRcdFx0ayA9IGEgfHwgJ0JFU2Jzd3knLFxuXHRcdFx0XHRyID0gMCxcblx0XHRcdFx0biA9IGIgfHwgM0UzLFxuXHRcdFx0XHRIID0gKCBuZXcgRGF0ZSApLmdldFRpbWUoKTtyZXR1cm4gbmV3IFByb21pc2UoIGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0XHRpZiAoIEooKSAmJiAhIEcoKSApIHtcblx0XHRcdFx0XHR2YXIgTSA9IG5ldyBQcm9taXNlKCBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24gZSgpIHtcblx0XHRcdFx0XHRcdFx0XHQoIG5ldyBEYXRlICkuZ2V0VGltZSgpIC0gSCA+PSBuID8gYiggRXJyb3IoICcnICsgbiArICdtcyB0aW1lb3V0IGV4Y2VlZGVkJyApICkgOiBkb2N1bWVudC5mb250cy5sb2FkKCBMKCBjLCAnXCInICsgYy5mYW1pbHkgKyAnXCInICksIGsgKS50aGVuKCBmdW5jdGlvbiggYyApIHtcblx0XHRcdFx0XHRcdFx0XHRcdDEgPD0gYy5sZW5ndGggPyBhKCkgOiBzZXRUaW1lb3V0KCBlLCAyNSApO1xuXHRcdFx0XHRcdFx0XHRcdH0sIGIgKTtcblx0XHRcdFx0XHRcdFx0fWUoKTtcblx0XHRcdFx0XHRcdH0gKSxcblx0XHRcdFx0XHRcdE4gPSBuZXcgUHJvbWlzZSggZnVuY3Rpb24oIGEsIGMgKSB7XG5cdFx0XHRcdFx0XHRcdHIgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRjKCBFcnJvciggJycgKyBuICsgJ21zIHRpbWVvdXQgZXhjZWVkZWQnICkgKTtcblx0XHRcdFx0XHRcdFx0fSwgbiApO1xuXHRcdFx0XHRcdFx0fSApO1Byb21pc2UucmFjZSggWyBOLCBNIF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNsZWFyVGltZW91dCggciApO2EoIGMgKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGIgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGZ1bmN0aW9uIHYoKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBiO2lmICggYiA9IC0xICE9IGYgJiYgLTEgIT0gZyB8fCAtMSAhPSBmICYmIC0xICE9IGggfHwgLTEgIT0gZyAmJiAtMSAhPSBoICkge1xuXHRcdFx0XHRcdFx0XHRcdCggYiA9IGYgIT0gZyAmJiBmICE9IGggJiYgZyAhPSBoICkgfHwgKCBudWxsID09PSBDICYmICggYiA9IC9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpLy5leGVjKCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCApLCBDID0gISEgYiAmJiAoIDUzNiA+IHBhcnNlSW50KCBiWzFdLCAxMCApIHx8IDUzNiA9PT0gcGFyc2VJbnQoIGJbMV0sIDEwICkgJiYgMTEgPj0gcGFyc2VJbnQoIGJbMl0sIDEwICkgKSApLCBiID0gQyAmJiAoIGYgPT0gdyAmJiBnID09IHcgJiYgaCA9PSB3IHx8IGYgPT0geCAmJiBnID09IHggJiYgaCA9PSB4IHx8IGYgPT0geSAmJiBnID09IHkgJiYgaCA9PSB5ICkgKSwgYiA9ICEgYjtcblx0XHRcdFx0XHRcdFx0fWIgJiYgKCBkLnBhcmVudE5vZGUgJiYgZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBkICksIGNsZWFyVGltZW91dCggciApLCBhKCBjICkgKTtcblx0XHRcdFx0XHRcdH0gZnVuY3Rpb24gSSgpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAoIG5ldyBEYXRlICkuZ2V0VGltZSgpIC0gSCA+PSBuICkge1xuXHRcdFx0XHRcdFx0XHRcdGQucGFyZW50Tm9kZSAmJiBkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIGQgKSwgYiggRXJyb3IoICcnICtcblx0biArICdtcyB0aW1lb3V0IGV4Y2VlZGVkJyApICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGEgPSBkb2N1bWVudC5oaWRkZW47aWYgKCAhIDAgPT09IGEgfHwgdm9pZCAwID09PSBhICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZiA9IGUuYS5vZmZzZXRXaWR0aCwgZyA9IHAuYS5vZmZzZXRXaWR0aCwgaCA9IHEuYS5vZmZzZXRXaWR0aCwgdigpO1xuXHRcdFx0XHRcdFx0XHRcdH1yID0gc2V0VGltZW91dCggSSwgNTAgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSB2YXIgZSA9IG5ldyB0KCBrICksXG5cdFx0XHRcdFx0XHRcdHAgPSBuZXcgdCggayApLFxuXHRcdFx0XHRcdFx0XHRxID0gbmV3IHQoIGsgKSxcblx0XHRcdFx0XHRcdFx0ZiA9IC0xLFxuXHRcdFx0XHRcdFx0XHRnID0gLTEsXG5cdFx0XHRcdFx0XHRcdGggPSAtMSxcblx0XHRcdFx0XHRcdFx0dyA9IC0xLFxuXHRcdFx0XHRcdFx0XHR4ID0gLTEsXG5cdFx0XHRcdFx0XHRcdHkgPSAtMSxcblx0XHRcdFx0XHRcdFx0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7ZC5kaXIgPSAnbHRyJzt1KCBlLCBMKCBjLCAnc2Fucy1zZXJpZicgKSApO3UoIHAsIEwoIGMsICdzZXJpZicgKSApO3UoIHEsIEwoIGMsICdtb25vc3BhY2UnICkgKTtkLmFwcGVuZENoaWxkKCBlLmEgKTtkLmFwcGVuZENoaWxkKCBwLmEgKTtkLmFwcGVuZENoaWxkKCBxLmEgKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkICk7dyA9IGUuYS5vZmZzZXRXaWR0aDt4ID0gcC5hLm9mZnNldFdpZHRoO3kgPSBxLmEub2Zmc2V0V2lkdGg7SSgpO0EoIGUsIGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHRcdFx0XHRmID0gYTt2KCk7XG5cdFx0XHRcdFx0XHR9ICk7dSggZSxcblx0XHRcdFx0XHRcdFx0TCggYywgJ1wiJyArIGMuZmFtaWx5ICsgJ1wiLHNhbnMtc2VyaWYnICkgKTtBKCBwLCBmdW5jdGlvbiggYSApIHtcblx0XHRcdFx0XHRcdFx0ZyA9IGE7digpO1xuXHRcdFx0XHRcdFx0fSApO3UoIHAsIEwoIGMsICdcIicgKyBjLmZhbWlseSArICdcIixzZXJpZicgKSApO0EoIHEsIGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHRcdFx0XHRoID0gYTt2KCk7XG5cdFx0XHRcdFx0XHR9ICk7dSggcSwgTCggYywgJ1wiJyArIGMuZmFtaWx5ICsgJ1wiLG1vbm9zcGFjZScgKSApO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH07J29iamVjdCcgPT09IHR5cGVvZiBtb2R1bGUgPyBtb2R1bGUuZXhwb3J0cyA9IEIgOiAoIHdpbmRvdy5Gb250RmFjZU9ic2VydmVyID0gQiwgd2luZG93LkZvbnRGYWNlT2JzZXJ2ZXIucHJvdG90eXBlLmxvYWQgPSBCLnByb3RvdHlwZS5sb2FkICk7XG5cdH0oKSApO1xuXG5cdC8vIG1pbm5wb3N0IGZvbnRzXG5cblx0Ly8gc2Fuc1xuXHR2YXIgc2Fuc05vcm1hbCA9IG5ldyBGb250RmFjZU9ic2VydmVyKCAnZmYtbWV0YS13ZWItcHJvJyApO1xuXHR2YXIgc2Fuc0JvbGQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzYW5zTm9ybWFsSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNDAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXG5cdC8vIHNlcmlmXG5cdHZhciBzZXJpZkJvb2sgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA1MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvb2tJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA1MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvbGQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJvbGRJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA3MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJsYWNrID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogOTAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCbGFja0l0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDkwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblxuXHRQcm9taXNlLmFsbCggW1xuXHRcdHNhbnNOb3JtYWwubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zTm9ybWFsSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvb2subG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9va0l0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvbGRJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQmxhY2subG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQmxhY2tJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApXG5cdF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkJztcblxuXHRcdC8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5cdFx0c2Vzc2lvblN0b3JhZ2Uuc2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCA9IHRydWU7XG5cdH0gKTtcblxuXHRQcm9taXNlLmFsbCggW1xuXHRcdHNhbnNOb3JtYWwubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNCb2xkLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zTm9ybWFsSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKVxuXHRdICkudGhlbiggZnVuY3Rpb24oKSB7XG5cdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIHNhbnMtZm9udHMtbG9hZGVkJztcblxuXHRcdC8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5cdFx0c2Vzc2lvblN0b3JhZ2Uuc2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsID0gdHJ1ZTtcblx0fSApO1xufVxuXG4iLCIvKipcbiAqIFRoaXMgaXMgdXNlZCB0byBjYXVzZSBHb29nbGUgQW5hbHl0aWNzIGV2ZW50cyB0byBydW5cbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbmZ1bmN0aW9uIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHZhbHVlICkge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSAmJiAnJyAhPT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLnVybF9hY2Nlc3NfbGV2ZWwgKSB7XG5cdFx0dmFyIHR5cGUgPSAnZXZlbnQnO1xuXHRcdHZhciBjYXRlZ29yeSA9ICdNZW1iZXIgQ29udGVudCc7XG5cdFx0dmFyIGxhYmVsID0gbG9jYXRpb24ucGF0aG5hbWU7IC8vIGkgdGhpbmsgd2UgY291bGQgcG9zc2libHkgcHV0IHNvbWUgZ3JvdXBpbmcgaGVyZSwgYnV0IHdlIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYWNjZXNzIHRvIG9uZSBhbmQgbWF5YmUgaXQncyBub3Qgd29ydGh3aGlsZSB5ZXRcblx0XHR2YXIgYWN0aW9uID0gJ0Jsb2NrZWQnO1xuXHRcdGlmICggdHJ1ZSA9PT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLmN1cnJlbnRfdXNlci5jYW5fYWNjZXNzICkge1xuXHRcdFx0YWN0aW9uID0gJ1Nob3duJztcblx0XHR9XG5cdFx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHR9XG59ICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIHNoYXJpbmcgY29udGVudFxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG4vLyB0cmFjayBhIHNoYXJlIHZpYSBhbmFseXRpY3MgZXZlbnRcbmZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uID0gJycgKSB7XG5cblx0Ly8gaWYgYSBub3QgbG9nZ2VkIGluIHVzZXIgdHJpZXMgdG8gZW1haWwsIGRvbid0IGNvdW50IHRoYXQgYXMgYSBzaGFyZVxuXHRpZiAoICEgalF1ZXJ5KCAnYm9keScgKS5oYXNDbGFzcyggJ2xvZ2dlZC1pbicgKSAmJiAnRW1haWwnID09PSB0ZXh0ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBjYXRlZ29yeSA9ICdTaGFyZSc7XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdGNhdGVnb3J5ID0gJ1NoYXJlIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cblx0Ly8gdHJhY2sgYXMgYW4gZXZlbnQsIGFuZCBhcyBzb2NpYWwgaWYgaXQgaXMgdHdpdHRlciBvciBmYlxuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsIGNhdGVnb3J5LCB0ZXh0LCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0IHx8ICdUd2l0dGVyJyA9PT0gdGV4dCApIHtcblx0XHRcdGlmICggJ0ZhY2Vib29rJyA9PT0gdGV4dCApIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdTaGFyZScsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1R3ZWV0JywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbi8vIGNvcHkgdGhlIGN1cnJlbnQgVVJMIHRvIHRoZSB1c2VyJ3MgY2xpcGJvYXJkXG5mdW5jdGlvbiBjb3B5Q3VycmVudFVSTCgpIHtcblx0dmFyIGR1bW15ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2lucHV0JyApLFxuXHRcdHRleHQgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggZHVtbXkgKTtcblx0ZHVtbXkudmFsdWUgPSB0ZXh0O1xuXHRkdW1teS5zZWxlY3QoKTtcblx0ZG9jdW1lbnQuZXhlY0NvbW1hbmQoICdjb3B5JyApO1xuXHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKCBkdW1teSApO1xufVxuXG4vLyB0b3Agc2hhcmUgYnV0dG9uIGNsaWNrXG4kKCAnLm0tZW50cnktc2hhcmUtdG9wIGEnICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHR2YXIgdGV4dCA9ICQoIHRoaXMgKS5kYXRhKCAnc2hhcmUtYWN0aW9uJyApO1xuXHR2YXIgcG9zaXRpb24gPSAndG9wJztcblx0dHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcbn0gKTtcblxuLy8gY2F1c2UgdGhlIGN1cnJlbnQgcGFnZSB0byBwcmludFxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXByaW50IGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHdpbmRvdy5wcmludCgpO1xufSApO1xuXG4vLyB3aGVuIHRoZSBjb3B5IGxpbmsgYnV0dG9uIGlzIGNsaWNrZWRcbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1jb3B5LXVybCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0Y29weUN1cnJlbnRVUkwoKTtcblx0dGxpdGUuc2hvdyggKCBlLnRhcmdldCApLCB7IGdyYXY6ICd3JyB9ICk7XG5cdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdHRsaXRlLmhpZGUoICggZS50YXJnZXQgKSApO1xuXHR9LCAzMDAwICk7XG5cdHJldHVybiBmYWxzZTtcbn0gKTtcblxuLy8gd2hlbiBzaGFyaW5nIHZpYSBmYWNlYm9vaywgdHdpdHRlciwgb3IgZW1haWwsIG9wZW4gdGhlIGRlc3RpbmF0aW9uIHVybCBpbiBhIG5ldyB3aW5kb3dcbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1mYWNlYm9vayBhLCAubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS10d2l0dGVyIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWVtYWlsIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHZhciB1cmwgPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cdHdpbmRvdy5vcGVuKCB1cmwsICdfYmxhbmsnICk7XG59ICk7XG4iLCIvKipcbiAqIEZpbGUgbmF2aWdhdGlvbi5qcy5cbiAqXG4gKiBOYXZpZ2F0aW9uIHNjcmlwdHMuIEluY2x1ZGVzIG1vYmlsZSBvciB0b2dnbGUgYmVoYXZpb3IsIGFuYWx5dGljcyB0cmFja2luZyBvZiBzcGVjaWZpYyBtZW51cy5cbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICovXG5cbmZ1bmN0aW9uIHNldHVwUHJpbWFyeU5hdigpIHtcblx0Y29uc3QgcHJpbWFyeU5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1saW5rcycgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHByaW1hcnlOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IGJ1dHRvbicgKTtcblx0aWYgKCBudWxsICE9PSBwcmltYXJ5TmF2VG9nZ2xlICkge1xuXHRcdHByaW1hcnlOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRjb25zdCB1c2VyTmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItbWlubnBvc3QtYWNjb3VudCB1bCcgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHVzZXJOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItbWlubnBvc3QtYWNjb3VudCA+IGEnICk7XG5cdGlmICggbnVsbCAhPT0gdXNlck5hdlRvZ2dsZSApIHtcblx0XHR1c2VyTmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0dmFyIHRhcmdldCAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgLm0tZm9ybS1zZWFyY2ggZmllbGRzZXQgLmEtYnV0dG9uLXNlbnRlbmNlJyApO1xuXHRpZiAoIG51bGwgIT09IHRhcmdldCApIHtcblx0XHR2YXIgZGl2ICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRkaXYuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLXNlYXJjaFwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuXHRcdHZhciBmcmFnbWVudCAgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0ZGl2LnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuXHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG5cblx0XHRjb25zdCBzZWFyY2hUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1hY3Rpb25zIC5tLWZvcm0tc2VhcmNoJyApLFxuXHRcdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHRcdH0gKTtcblxuXHRcdHZhciBzZWFyY2hWaXNpYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ2xpLnNlYXJjaCA+IGEnICk7XG5cdFx0c2VhcmNoVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHR2YXIgc2VhcmNoQ2xvc2UgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLXNlYXJjaCcgKTtcblx0XHRzZWFyY2hDbG9zZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHQvLyBlc2NhcGUga2V5IHByZXNzXG5cdCQoIGRvY3VtZW50ICkua2V5dXAoIGZ1bmN0aW9uKCBlICkge1xuXHRcdGlmICggMjcgPT09IGUua2V5Q29kZSApIHtcblx0XHRcdGxldCBwcmltYXJ5TmF2RXhwYW5kZWQgPSAndHJ1ZScgPT09IHByaW1hcnlOYXZUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGxldCB1c2VyTmF2RXhwYW5kZWQgPSAndHJ1ZScgPT09IHVzZXJOYXZUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGxldCBzZWFyY2hJc1Zpc2libGUgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgcHJpbWFyeU5hdkV4cGFuZGVkICYmIHRydWUgPT09IHByaW1hcnlOYXZFeHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRvZ2dsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBwcmltYXJ5TmF2RXhwYW5kZWQgKTtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiB1c2VyTmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gdXNlck5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHVzZXJOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHNlYXJjaElzVmlzaWJsZSAmJiB0cnVlID09PSBzZWFyY2hJc1Zpc2libGUgKSB7XG5cdFx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgc2VhcmNoSXNWaXNpYmxlICk7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufVxuXG5mdW5jdGlvbiBzZXR1cFNjcm9sbE5hdiggc2VsZWN0b3IsIG5hdlNlbGVjdG9yLCBjb250ZW50U2VsZWN0b3IgKSB7XG5cblx0dmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG5cdHZhciBpc0lFID0gL01TSUV8VHJpZGVudC8udGVzdCh1YSk7XG5cdGlmICggaXNJRSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBJbml0IHdpdGggYWxsIG9wdGlvbnMgYXQgZGVmYXVsdCBzZXR0aW5nXG5cdGNvbnN0IHByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0ID0gUHJpb3JpdHlOYXZTY3JvbGxlcigge1xuXHRcdHNlbGVjdG9yOiBzZWxlY3Rvcixcblx0XHRuYXZTZWxlY3RvcjogbmF2U2VsZWN0b3IsXG5cdFx0Y29udGVudFNlbGVjdG9yOiBjb250ZW50U2VsZWN0b3IsXG5cdFx0aXRlbVNlbGVjdG9yOiAnbGksIGEnLFxuXHRcdGJ1dHRvbkxlZnRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0Jyxcblx0XHRidXR0b25SaWdodFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0J1xuXG5cdFx0Ly9zY3JvbGxTdGVwOiAnYXZlcmFnZSdcblx0fSApO1xuXG5cdC8vIEluaXQgbXVsdGlwbGUgbmF2IHNjcm9sbGVycyB3aXRoIHRoZSBzYW1lIG9wdGlvbnNcblx0LypsZXQgbmF2U2Nyb2xsZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi1zY3JvbGxlcicpO1xuXG5cdG5hdlNjcm9sbGVycy5mb3JFYWNoKChjdXJyZW50VmFsdWUsIGN1cnJlbnRJbmRleCkgPT4ge1xuXHQgIFByaW9yaXR5TmF2U2Nyb2xsZXIoe1xuXHQgICAgc2VsZWN0b3I6IGN1cnJlbnRWYWx1ZVxuXHQgIH0pO1xuXHR9KTsqL1xufVxuXG5zZXR1cFByaW1hcnlOYXYoKTtcblxuaWYgKCAwIDwgJCggJy5tLXN1Yi1uYXZpZ2F0aW9uJyApLmxlbmd0aCApIHtcblx0c2V0dXBTY3JvbGxOYXYoICcubS1zdWItbmF2aWdhdGlvbicsICcubS1zdWJuYXYtbmF2aWdhdGlvbicsICcubS1tZW51LXN1Yi1uYXZpZ2F0aW9uJyApO1xufVxuaWYgKCAwIDwgJCggJy5tLXBhZ2luYXRpb24tbmF2aWdhdGlvbicgKS5sZW5ndGggKSB7XG5cdHNldHVwU2Nyb2xsTmF2KCAnLm0tcGFnaW5hdGlvbi1uYXZpZ2F0aW9uJywgJy5tLXBhZ2luYXRpb24tY29udGFpbmVyJywgJy5tLXBhZ2luYXRpb24tbGlzdCcgKTtcbn1cblxuJCggJ2EnLCAkKCAnLm8tc2l0ZS1zaWRlYmFyJyApICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHR2YXIgd2lkZ2V0VGl0bGUgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0td2lkZ2V0JyApLmZpbmQoICdoMycgKS50ZXh0KCk7XG5cdHZhciB6b25lVGl0bGUgICAgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS16b25lJyApLmZpbmQoICcuYS16b25lLXRpdGxlJyApLnRleHQoKTtcblx0dmFyIHNpZGViYXJTZWN0aW9uVGl0bGUgPSAnJztcblx0aWYgKCAnJyAhPT0gd2lkZ2V0VGl0bGUgKSB7XG5cdFx0c2lkZWJhclNlY3Rpb25UaXRsZSA9IHdpZGdldFRpdGxlO1xuXHR9IGVsc2UgaWYgKCAnJyAhPT0gem9uZVRpdGxlICkge1xuXHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB6b25lVGl0bGU7XG5cdH1cblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBMaW5rJywgJ0NsaWNrJywgc2lkZWJhclNlY3Rpb25UaXRsZSApO1xufSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBmb3Jtc1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG5qUXVlcnkuZm4udGV4dE5vZGVzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNvbnRlbnRzKCkuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKCB0aGlzLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSAmJiAnJyAhPT0gdGhpcy5ub2RlVmFsdWUudHJpbSgpICk7XG5cdH0gKTtcbn07XG5cbmZ1bmN0aW9uIGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoIGFjdGlvbiApIHtcblx0dmFyIG1hcmt1cCA9ICc8bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLWZvcm0tY29uZmlybVwiPjxsYWJlbD5BcmUgeW91IHN1cmU/IDxhIGlkPVwiYS1jb25maXJtLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ZZXM8L2E+IHwgPGEgaWQ9XCJhLXN0b3AtJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPk5vPC9hPjwvbGFiZWw+PC9saT4nO1xuXHRyZXR1cm4gbWFya3VwO1xufVxuXG5mdW5jdGlvbiBtYW5hZ2VFbWFpbHMoKSB7XG5cdHZhciBmb3JtICAgICAgICAgICAgICAgPSAkKCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScgKTtcblx0dmFyIHJlc3RSb290ICAgICAgICAgICA9IHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Quc2l0ZV91cmwgKyB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnJlc3RfbmFtZXNwYWNlO1xuXHR2YXIgZnVsbFVybCAgICAgICAgICAgID0gcmVzdFJvb3QgKyAnLycgKyAndXBkYXRlLXVzZXIvJztcblx0dmFyIGNvbmZpcm1DaGFuZ2UgICAgICA9ICcnO1xuXHR2YXIgbmV4dEVtYWlsQ291bnQgICAgID0gMTtcblx0dmFyIG5ld1ByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgb2xkUHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBwcmltYXJ5SWQgICAgICAgICAgPSAnJztcblx0dmFyIGVtYWlsVG9SZW1vdmUgICAgICA9ICcnO1xuXHR2YXIgY29uc29saWRhdGVkRW1haWxzID0gW107XG5cdHZhciBuZXdFbWFpbHMgICAgICAgICAgPSBbXTtcblx0dmFyIGFqYXhGb3JtRGF0YSAgICAgICA9ICcnO1xuXHR2YXIgdGhhdCAgICAgICAgICAgICAgID0gJyc7XG5cblx0Ly8gc3RhcnQgb3V0IHdpdGggbm8gcHJpbWFyeS9yZW1vdmFscyBjaGVja2VkXG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdC8vIGlmIHRoZXJlIGlzIGEgbGlzdCBvZiBlbWFpbHMgKG5vdCBqdXN0IGEgc2luZ2xlIGZvcm0gZmllbGQpXG5cdGlmICggMCA8ICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoICkge1xuXHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblxuXHRcdC8vIGlmIGEgdXNlciBzZWxlY3RzIGEgbmV3IHByaW1hcnksIG1vdmUgaXQgaW50byB0aGF0IHBvc2l0aW9uXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nLCBmdW5jdGlvbigpIHtcblxuXHRcdFx0bmV3UHJpbWFyeUVtYWlsID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdHByaW1hcnlJZCAgICAgICA9ICQoIHRoaXMgKS5wcm9wKCAnaWQnICkucmVwbGFjZSggJ3ByaW1hcnlfZW1haWxfJywgJycgKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdwcmltYXJ5LWNoYW5nZScgKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXG5cdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBtYWluIGhpZGRlbiBmb3JtIHZhbHVlXG5cdFx0XHRcdCQoICcjZW1haWwnICkudmFsKCBuZXdQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBzdWJtaXQgZm9ybSB2YWx1ZXMuXG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cblx0XHRcdFx0Ly8gdW5jaGVjayB0aGUgcmFkaW8gYnV0dG9uXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIGZvcm0gdmFsdWVzIHRvIHRoZSBvbGQgcHJpbWFyeSBlbWFpbFxuXHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjcmVtb3ZlX2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgY29uZmlybSBtZXNzYWdlXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHR9ICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjaGFuZ2UnLCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZW1haWxUb1JlbW92ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdyZW1vdmFsJyApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSAhPT0gZW1haWxUb1JlbW92ZSApIHtcblx0XHRcdFx0XHRjb25zb2xpZGF0ZWRFbWFpbHMucHVzaCggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyIGZvciByZW1vdmFsXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQvLyBpZiBjb25maXJtZWQsIHJlbW92ZSB0aGUgZW1haWwgYW5kIHN1Ym1pdCB0aGUgZm9ybVxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5mYWRlT3V0KCAnbm9ybWFsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLnJlbW92ZSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCAndmFsdWUgaXMgJyArIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8vIGlmIGEgdXNlciB3YW50cyB0byBhZGQgYW4gZW1haWwsIGdpdmUgdGhlbSBhIHByb3Blcmx5IG51bWJlcmVkIGZpZWxkXG5cdCQoICcubS1mb3JtLWVtYWlsJyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcgKS5iZWZvcmUoICc8ZGl2IGNsYXNzPVwiYS1pbnB1dC13aXRoLWJ1dHRvbiBhLWJ1dHRvbi1zZW50ZW5jZVwiPjxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIGlkPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIHZhbHVlPVwiXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBpZD1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBjbGFzcz1cImEtYnV0dG9uIGEtYnV0dG9uLWFkZC11c2VyLWVtYWlsXCI+QWRkPC9idXR0b24+PC9kaXY+JyApO1xuXHRcdG5leHRFbWFpbENvdW50Kys7XG5cdH0gKTtcblxuXHQkKCAnaW5wdXRbdHlwZT1zdWJtaXRdJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgYnV0dG9uID0gJCggdGhpcyApO1xuXHRcdHZhciBidXR0b25Gb3JtID0gYnV0dG9uLmNsb3Nlc3QoICdmb3JtJyApO1xuXHRcdGJ1dHRvbkZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJywgYnV0dG9uLnZhbCgpICk7XG5cdH0gKTtcblxuXHQkKCAnLm0tZW50cnktY29udGVudCcgKS5vbiggJ3N1Ym1pdCcsICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdHZhciBmb3JtID0gJCggdGhpcyApO1xuXHRcdHZhciBzdWJtaXR0aW5nQnV0dG9uID0gZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nICkgfHwgJyc7XG5cblx0XHQvLyBpZiB0aGVyZSBpcyBubyBzdWJtaXR0aW5nIGJ1dHRvbiwgcGFzcyBpdCBieSBBamF4XG5cdFx0aWYgKCAnJyA9PT0gc3VibWl0dGluZ0J1dHRvbiB8fCAnU2F2ZSBDaGFuZ2VzJyAhPT0gc3VibWl0dGluZ0J1dHRvbiApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhamF4Rm9ybURhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4Rm9ybURhdGEgPSBhamF4Rm9ybURhdGEgKyAnJnJlc3Q9dHJ1ZSc7XG5cdFx0XHQkLmFqYXgoIHtcblx0XHRcdFx0dXJsOiBmdWxsVXJsLFxuXHRcdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKCB4aHIgKSB7XG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRkYXRhOiBhamF4Rm9ybURhdGFcblx0XHRcdH0gKS5kb25lKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0fSApLmdldCgpO1xuXHRcdFx0XHQkLmVhY2goIG5ld0VtYWlscywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9IG5leHRFbWFpbENvdW50ICsgaW5kZXg7XG5cdFx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5hcHBlbmQoICc8bGkgaWQ9XCJ1c2VyLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIj4nICsgdmFsdWUgKyAnPHVsIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS11c2VyLWVtYWlsLWFjdGlvbnNcIj48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtbWFrZS1wcmltYXJ5LWVtYWlsXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJwcmltYXJ5X2VtYWlsXCIgaWQ9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPk1ha2UgUHJpbWFyeTwvc21hbGw+PC9sYWJlbD48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1lbWFpbC1wcmVmZXJlbmNlc1wiPjxhIGhyZWY9XCIvbmV3c2xldHRlcnMvP2VtYWlsPScgKyBlbmNvZGVVUklDb21wb25lbnQoIHZhbHVlICkgKyAnXCI+PHNtYWxsPkVtYWlsIFByZWZlcmVuY2VzPC9zbWFsbD48L2E+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtcmVtb3ZlLWVtYWlsXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJyZW1vdmVfZW1haWxbJyArIG5leHRFbWFpbENvdW50ICsgJ11cIiBpZD1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPlJlbW92ZTwvc21hbGw+PC9sYWJlbD48L2xpPjwvdWw+PC9saT4nICk7XG5cdFx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoICQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCkgKyAnLCcgKyB2YWx1ZSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdCQoICcubS1mb3JtLWNoYW5nZS1lbWFpbCAuYS1pbnB1dC13aXRoLWJ1dHRvbicgKS5yZW1vdmUoKTtcblx0XHRcdFx0aWYgKCAwID09PSAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKSAhPT0gJCggJ2lucHV0W25hbWU9XCJlbWFpbFwiXScgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gaXQgd291bGQgYmUgbmljZSB0byBvbmx5IGxvYWQgdGhlIGZvcm0sIGJ1dCB0aGVuIGNsaWNrIGV2ZW50cyBzdGlsbCBkb24ndCB3b3JrXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cdH0gKTtcbn1cblxuZnVuY3Rpb24gYWRkQXV0b1Jlc2l6ZSgpIHtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJ1tkYXRhLWF1dG9yZXNpemVdJyApLmZvckVhY2goIGZ1bmN0aW9uICggZWxlbWVudCApIHtcblx0XHRlbGVtZW50LnN0eWxlLmJveFNpemluZyA9ICdib3JkZXItYm94Jztcblx0XHR2YXIgb2Zmc2V0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgLSBlbGVtZW50LmNsaWVudEhlaWdodDtcblx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdpbnB1dCcsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG5cdFx0XHRldmVudC50YXJnZXQuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuXHRcdFx0ZXZlbnQudGFyZ2V0LnN0eWxlLmhlaWdodCA9IGV2ZW50LnRhcmdldC5zY3JvbGxIZWlnaHQgKyBvZmZzZXQgKyAncHgnO1xuXHRcdH0pO1xuXHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCAnZGF0YS1hdXRvcmVzaXplJyApO1xuXHR9KTtcbn1cblxuJCggZG9jdW1lbnQgKS5hamF4U3RvcCggZnVuY3Rpb24oKSB7XG5cdHZhciBjb21tZW50QXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcjbGxjX2NvbW1lbnRzJyApO1xuXHRpZiAoIG51bGwgIT09IGNvbW1lbnRBcmVhICkge1xuXHRcdGFkZEF1dG9SZXNpemUoKTtcblx0fVxufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICggMCA8ICQoICcubS1mb3JtLWFjY291bnQtc2V0dGluZ3MnICkubGVuZ3RoICkge1xuXHRcdG1hbmFnZUVtYWlscygpO1xuXHR9XG5cdHZhciBhdXRvUmVzaXplVGV4dGFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnW2RhdGEtYXV0b3Jlc2l6ZV0nICk7XG5cdGlmICggbnVsbCAhPT0gYXV0b1Jlc2l6ZVRleHRhcmVhICkge1xuXHRcdGFkZEF1dG9SZXNpemUoKTtcblx0fVxufSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBjb21tZW50c1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG4vLyBiYXNlZCBvbiB3aGljaCBidXR0b24gd2FzIGNsaWNrZWQsIHNldCB0aGUgdmFsdWVzIGZvciB0aGUgYW5hbHl0aWNzIGV2ZW50IGFuZCBjcmVhdGUgaXRcbmZ1bmN0aW9uIHRyYWNrU2hvd0NvbW1lbnRzKCBhbHdheXMsIGlkLCBjbGlja1ZhbHVlICkge1xuXHR2YXIgYWN0aW9uICAgICAgICAgID0gJyc7XG5cdHZhciBjYXRlZ29yeVByZWZpeCA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlTdWZmaXggPSAnJztcblx0dmFyIHBvc2l0aW9uICAgICAgICA9ICcnO1xuXHRwb3NpdGlvbiA9IGlkLnJlcGxhY2UoICdhbHdheXMtc2hvdy1jb21tZW50cy0nLCAnJyApO1xuXHRpZiAoICcxJyA9PT0gY2xpY2tWYWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT24nO1xuXHR9IGVsc2UgaWYgKCAnMCcgPT09IGNsaWNrVmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09mZic7XG5cdH0gZWxzZSB7XG5cdFx0YWN0aW9uID0gJ0NsaWNrJztcblx0fVxuXHRpZiAoIHRydWUgPT09IGFsd2F5cyApIHtcblx0XHRjYXRlZ29yeVByZWZpeCA9ICdBbHdheXMgJztcblx0fVxuXHRpZiAoICcnICE9PSBwb3NpdGlvbiApIHtcblx0XHRwb3NpdGlvbiA9IHBvc2l0aW9uLmNoYXJBdCggMCApLnRvVXBwZXJDYXNlKCkgKyBwb3NpdGlvbi5zbGljZSggMSApO1xuXHRcdGNhdGVnb3J5U3VmZml4ID0gJyAtICcgKyBwb3NpdGlvbjtcblx0fVxuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsIGNhdGVnb3J5UHJlZml4ICsgJ1Nob3cgQ29tbWVudHMnICsgY2F0ZWdvcnlTdWZmaXgsIGFjdGlvbiwgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn1cblxuLy8gd2hlbiBzaG93aW5nIGNvbW1lbnRzIG9uY2UsIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWJ1dHRvbi1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCBmYWxzZSwgJycsICcnICk7XG59ICk7XG5cbi8vIFNldCB1c2VyIG1ldGEgdmFsdWUgZm9yIGFsd2F5cyBzaG93aW5nIGNvbW1lbnRzIGlmIHRoYXQgYnV0dG9uIGlzIGNsaWNrZWRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR2YXIgdGhhdCA9ICQoIHRoaXMgKTtcblx0aWYgKCB0aGF0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9IGVsc2Uge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvLyB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcblx0dHJhY2tTaG93Q29tbWVudHMoIHRydWUsIHRoYXQuYXR0ciggJ2lkJyApLCB0aGF0LnZhbCgpICk7XG5cblx0Ly8gd2UgYWxyZWFkeSBoYXZlIGFqYXh1cmwgZnJvbSB0aGUgdGhlbWVcblx0JC5hamF4KCB7XG5cdFx0dHlwZTogJ1BPU1QnLFxuXHRcdHVybDogcGFyYW1zLmFqYXh1cmwsXG5cdFx0ZGF0YToge1xuXHRcdFx0J2FjdGlvbic6ICdtaW5ucG9zdF9sYXJnb19sb2FkX2NvbW1lbnRzX3NldF91c2VyX21ldGEnLFxuXHRcdFx0J3ZhbHVlJzogdGhhdC52YWwoKVxuXHRcdH0sXG5cdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0JCggJy5hLWFsd2F5cy1zaG93LWNvbW1lbnRzLXJlc3VsdCcsIHRoYXQucGFyZW50KCkgKS5odG1sKCByZXNwb25zZS5kYXRhLm1lc3NhZ2UgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gcmVzcG9uc2UuZGF0YS5zaG93ICkge1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAwICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAxICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG59ICk7XG5cbiFmdW5jdGlvbiggZCApIHtcblx0aWYgKCAhZC5jdXJyZW50U2NyaXB0ICkge1xuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0YWN0aW9uOiBcImxsY19sb2FkX2NvbW1lbnRzXCIsXG5cdFx0XHRwb3N0OiAkKCBcIiNsbGNfcG9zdF9pZFwiICkudmFsKClcblx0XHR9O1xuXHRcdC8vIEFqYXggcmVxdWVzdCBsaW5rLlxuXHRcdHZhciBsbGNhamF4dXJsID0gJCggXCIjbGxjX2FqYXhfdXJsXCIgKS52YWwoKTtcblx0XHQvLyBGdWxsIHVybCB0byBnZXQgY29tbWVudHMgKEFkZGluZyBwYXJhbWV0ZXJzKS5cblx0XHR2YXIgY29tbWVudFVybCA9IGxsY2FqYXh1cmwgKyAnPycgKyAkLnBhcmFtKCBkYXRhICk7XG5cdFx0Ly8gUGVyZm9ybSBhamF4IHJlcXVlc3QuXG5cdFx0JC5nZXQoIGNvbW1lbnRVcmwsIGZ1bmN0aW9uICggcmVzcG9uc2UgKSB7XG5cdFx0XHRpZiAoIHJlc3BvbnNlICE9PSBcIlwiICkge1xuXHRcdFx0XHQkKCBcIiNsbGNfY29tbWVudHNcIiApLmh0bWwoIHJlc3BvbnNlICk7XG5cdFx0XHRcdC8vIEluaXRpYWxpemUgY29tbWVudHMgYWZ0ZXIgbGF6eSBsb2FkaW5nLlxuXHRcdFx0XHRpZiAoIHdpbmRvdy5hZGRDb21tZW50ICYmIHdpbmRvdy5hZGRDb21tZW50LmluaXQgKSB7XG5cdFx0XHRcdFx0d2luZG93LmFkZENvbW1lbnQuaW5pdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIEdldCB0aGUgY29tbWVudCBsaSBpZCBmcm9tIHVybCBpZiBleGlzdC5cblx0XHRcdFx0dmFyIGNvbW1lbnRJZCA9IGRvY3VtZW50LlVSTC5zdWJzdHIoIGRvY3VtZW50LlVSTC5pbmRleE9mKCBcIiNjb21tZW50XCIgKSApO1xuXHRcdFx0XHQvLyBJZiBjb21tZW50IGlkIGZvdW5kLCBzY3JvbGwgdG8gdGhhdCBjb21tZW50LlxuXHRcdFx0XHRpZiAoIGNvbW1lbnRJZC5pbmRleE9mKCAnI2NvbW1lbnQnICkgPiAtMSApIHtcblx0XHRcdFx0XHQkKCB3aW5kb3cgKS5zY3JvbGxUb3AoICQoIGNvbW1lbnRJZCApLm9mZnNldCgpLnRvcCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG59KCBkb2N1bWVudCApOyIsIi8qKlxuICogTWV0aG9kcyBmb3IgZXZlbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG52YXIgdGFyZ2V0ICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWV2ZW50cy1jYWwtbGlua3MnICk7XG5pZiAoIG51bGwgIT09IHRhcmdldCApIHtcbiAgICB2YXIgbGkgICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2xpJyApO1xuICAgIGxpLmlubmVySFRNTCAgPSAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImEtY2xvc2UtYnV0dG9uIGEtY2xvc2UtY2FsZW5kYXJcIj48aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT48L2E+JztcbiAgICB2YXIgZnJhZ21lbnQgID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGxpLnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBsaSApO1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZCggZnJhZ21lbnQgKTtcbn1cblxuY29uc3QgY2FsZW5kYXJUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuICAgIGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1ldmVudHMtY2FsLWxpbmtzJyApLFxuICAgIHZpc2libGVDbGFzczogJ2EtZXZlbnRzLWNhbC1saW5rLXZpc2libGUnLFxuICAgIGRpc3BsYXlWYWx1ZTogJ2Jsb2NrJ1xufSApO1xuXG52YXIgY2FsZW5kYXJWaXNpYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLWV2ZW50LWRhdGV0aW1lIGEnICk7XG5pZiAoIG51bGwgIT09IGNhbGVuZGFyVmlzaWJsZSApIHtcbiAgICBjYWxlbmRhclZpc2libGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBjYWxlbmRhclZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcbiAgICAgICAgY2FsZW5kYXJWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgICAgIGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG4gICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgIHZhciBjYWxlbmRhckNsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLWNhbGVuZGFyJyApO1xuICAgIGNhbGVuZGFyQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBjYWxlbmRhclZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcbiAgICAgICAgY2FsZW5kYXJWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgICAgIGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG4gICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcbiAgICAgICAgfVxuICAgIH0gKTtcbn1cbiJdfQ==
}(jQuery));
