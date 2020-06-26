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

$(document).ready(function () {
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

$('.m-entry-share-top a').click(function () {
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

$(document).ready(function ($) {
  'use strict';

  if (0 < $('.m-form-email').length) {
    manageEmails();
  }
});
"use strict";

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDAtc3RhcnQuanMiLCIwMS1mb250cy5qcyIsIjAyLWFuYWx5dGljcy5qcyIsIjAzLXNoYXJlLmpzIiwiMDQtbmF2aWdhdGlvbi5qcyIsIjA1LWZvcm1zLmpzIiwiMDYtY29tbWVudHMuanMiLCIwNy1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImRvY3VtZW50RWxlbWVudCIsInNlc3Npb25TdG9yYWdlIiwic2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsInNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsImciLCJwdXNoIiwibSIsInNoaWZ0IiwicCIsImIiLCJxIiwiYyIsInUiLCJUeXBlRXJyb3IiLCJ0aGVuIiwiY2FsbCIsInYiLCJoIiwicHJvdG90eXBlIiwidyIsImsiLCJ4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyYWNlIiwiYWxsIiwiY2F0Y2giLCJhdHRhY2hFdmVudCIsImJvZHkiLCJyZWFkeVN0YXRlIiwiZGV0YWNoRXZlbnQiLCJjcmVhdGVUZXh0Tm9kZSIsImNzc1RleHQiLCJ6Iiwid2lkdGgiLCJBIiwiQiIsImZhbWlseSIsIndlaWdodCIsInN0cmV0Y2giLCJDIiwiRCIsIkUiLCJGIiwiRyIsIkoiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidmVuZG9yIiwiZXhlYyIsInVzZXJBZ2VudCIsImZvbnRzIiwiSyIsImZvbnQiLCJMIiwiam9pbiIsImxvYWQiLCJIIiwiRGF0ZSIsImdldFRpbWUiLCJNIiwiTiIsInkiLCJJIiwiaGlkZGVuIiwiZGlyIiwiRm9udEZhY2VPYnNlcnZlciIsInNhbnNOb3JtYWwiLCJzYW5zQm9sZCIsInNhbnNOb3JtYWxJdGFsaWMiLCJzZXJpZkJvb2siLCJzZXJpZkJvb2tJdGFsaWMiLCJzZXJpZkJvbGQiLCJzZXJpZkJvbGRJdGFsaWMiLCJzZXJpZkJsYWNrIiwic2VyaWZCbGFja0l0YWxpYyIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsInR5cGUiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwidmFsdWUiLCJnYSIsIiQiLCJyZWFkeSIsIm1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSIsInVybF9hY2Nlc3NfbGV2ZWwiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiY3VycmVudF91c2VyIiwiY2FuX2FjY2VzcyIsInRyYWNrU2hhcmUiLCJ0ZXh0IiwicG9zaXRpb24iLCJqUXVlcnkiLCJoYXNDbGFzcyIsImNvcHlDdXJyZW50VVJMIiwiZHVtbXkiLCJocmVmIiwic2VsZWN0IiwiZXhlY0NvbW1hbmQiLCJjbGljayIsImRhdGEiLCJwcmV2ZW50RGVmYXVsdCIsInByaW50IiwidXJsIiwiYXR0ciIsIm9wZW4iLCJzZXR1cFByaW1hcnlOYXYiLCJwcmltYXJ5TmF2VHJhbnNpdGlvbmVyIiwicHJpbWFyeU5hdlRvZ2dsZSIsImV4cGFuZGVkIiwidXNlck5hdlRyYW5zaXRpb25lciIsInVzZXJOYXZUb2dnbGUiLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCJrZXl1cCIsImtleUNvZGUiLCJwcmltYXJ5TmF2RXhwYW5kZWQiLCJ1c2VyTmF2RXhwYW5kZWQiLCJzZWFyY2hJc1Zpc2libGUiLCJzZXR1cFNjcm9sbE5hdiIsInByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0Iiwid2lkZ2V0VGl0bGUiLCJjbG9zZXN0IiwiZmluZCIsInpvbmVUaXRsZSIsInNpZGViYXJTZWN0aW9uVGl0bGUiLCJmbiIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwidHJpbSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJmb3JtIiwicmVzdFJvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxVcmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheEZvcm1EYXRhIiwidGhhdCIsInByb3AiLCJvbiIsInZhbCIsInJlcGxhY2UiLCJwYXJlbnQiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiYXBwZW5kIiwiZXZlbnQiLCJmaXJzdCIsInJlcGxhY2VXaXRoIiwic3VibWl0IiwiZWFjaCIsImdldCIsInBhcmVudHMiLCJmYWRlT3V0IiwiYmVmb3JlIiwiYnV0dG9uIiwiYnV0dG9uRm9ybSIsInN1Ym1pdHRpbmdCdXR0b24iLCJzZXJpYWxpemUiLCJhamF4IiwiYmVmb3JlU2VuZCIsInhociIsInNldFJlcXVlc3RIZWFkZXIiLCJub25jZSIsImRhdGFUeXBlIiwiZG9uZSIsIm1hcCIsImluZGV4IiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicmVsb2FkIiwidHJhY2tTaG93Q29tbWVudHMiLCJhbHdheXMiLCJpZCIsImNsaWNrVmFsdWUiLCJjYXRlZ29yeVByZWZpeCIsImNhdGVnb3J5U3VmZml4IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImlzIiwiYWpheHVybCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImh0bWwiLCJtZXNzYWdlIiwibGkiLCJjYWxlbmRhclRyYW5zaXRpb25lciIsImNhbGVuZGFyVmlzaWJsZSIsImNhbGVuZGFyQ2xvc2UiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsS0FBVCxDQUFlQyxDQUFmLEVBQWlCO0FBQUNDLEVBQUFBLFFBQVEs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RU87QUFDSG1SLE1BQUFBLG9CQUFvQixDQUFDeFIsY0FBckI7QUFDSDtBQUNKLEdBVEQ7QUFXQSxNQUFJMFIsYUFBYSxHQUFHeFYsUUFBUSxDQUFDb0YsYUFBVCxDQUF3QixtQkFBeEIsQ0FBcEI7QUFDQW9RLEVBQUFBLGFBQWEsQ0FBQ3ZWLGdCQUFkLENBQWdDLE9BQWhDLEVBQXlDLFVBQVVDLENBQVYsRUFBYztBQUNuREEsSUFBQUEsQ0FBQyxDQUFDMk8sY0FBRjtBQUNBLFFBQUlRLFFBQVEsR0FBRyxXQUFXa0csZUFBZSxDQUFDM1QsWUFBaEIsQ0FBOEIsZUFBOUIsQ0FBWCxJQUE4RCxLQUE3RTtBQUNBMlQsSUFBQUEsZUFBZSxDQUFDalQsWUFBaEIsQ0FBOEIsZUFBOUIsRUFBK0MsQ0FBRStNLFFBQWpEOztBQUNBLFFBQUssU0FBU0EsUUFBZCxFQUF5QjtBQUNyQmlHLE1BQUFBLG9CQUFvQixDQUFDblIsY0FBckI7QUFDSCxLQUZELE1BRU87QUFDSG1SLE1BQUFBLG9CQUFvQixDQUFDeFIsY0FBckI7QUFDSDtBQUNKLEdBVEQ7QUFVSCIsImZpbGUiOiJtaW5ucG9zdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHRsaXRlKHQpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIixmdW5jdGlvbihlKXt2YXIgaT1lLnRhcmdldCxuPXQoaSk7bnx8KG49KGk9aS5wYXJlbnRFbGVtZW50KSYmdChpKSksbiYmdGxpdGUuc2hvdyhpLG4sITApfSl9dGxpdGUuc2hvdz1mdW5jdGlvbih0LGUsaSl7dmFyIG49XCJkYXRhLXRsaXRlXCI7ZT1lfHx7fSwodC50b29sdGlwfHxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIG8oKXt0bGl0ZS5oaWRlKHQsITApfWZ1bmN0aW9uIGwoKXtyfHwocj1mdW5jdGlvbih0LGUsaSl7ZnVuY3Rpb24gbigpe28uY2xhc3NOYW1lPVwidGxpdGUgdGxpdGUtXCIrcitzO3ZhciBlPXQub2Zmc2V0VG9wLGk9dC5vZmZzZXRMZWZ0O28ub2Zmc2V0UGFyZW50PT09dCYmKGU9aT0wKTt2YXIgbj10Lm9mZnNldFdpZHRoLGw9dC5vZmZzZXRIZWlnaHQsZD1vLm9mZnNldEhlaWdodCxmPW8ub2Zmc2V0V2lkdGgsYT1pK24vMjtvLnN0eWxlLnRvcD0oXCJzXCI9PT1yP2UtZC0xMDpcIm5cIj09PXI/ZStsKzEwOmUrbC8yLWQvMikrXCJweFwiLG8uc3R5bGUubGVmdD0oXCJ3XCI9PT1zP2k6XCJlXCI9PT1zP2krbi1mOlwid1wiPT09cj9pK24rMTA6XCJlXCI9PT1yP2ktZi0xMDphLWYvMikrXCJweFwifXZhciBvPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpLGw9aS5ncmF2fHx0LmdldEF0dHJpYnV0ZShcImRhdGEtdGxpdGVcIil8fFwiblwiO28uaW5uZXJIVE1MPWUsdC5hcHBlbmRDaGlsZChvKTt2YXIgcj1sWzBdfHxcIlwiLHM9bFsxXXx8XCJcIjtuKCk7dmFyIGQ9by5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm5cInNcIj09PXImJmQudG9wPDA/KHI9XCJuXCIsbigpKTpcIm5cIj09PXImJmQuYm90dG9tPndpbmRvdy5pbm5lckhlaWdodD8ocj1cInNcIixuKCkpOlwiZVwiPT09ciYmZC5sZWZ0PDA/KHI9XCJ3XCIsbigpKTpcIndcIj09PXImJmQucmlnaHQ+d2luZG93LmlubmVyV2lkdGgmJihyPVwiZVwiLG4oKSksby5jbGFzc05hbWUrPVwiIHRsaXRlLXZpc2libGVcIixvfSh0LGQsZSkpfXZhciByLHMsZDtyZXR1cm4gdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsbyksdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLG8pLHQudG9vbHRpcD17c2hvdzpmdW5jdGlvbigpe2Q9dC50aXRsZXx8dC5nZXRBdHRyaWJ1dGUobil8fGQsdC50aXRsZT1cIlwiLHQuc2V0QXR0cmlidXRlKG4sXCJcIiksZCYmIXMmJihzPXNldFRpbWVvdXQobCxpPzE1MDoxKSl9LGhpZGU6ZnVuY3Rpb24odCl7aWYoaT09PXQpe3M9Y2xlYXJUaW1lb3V0KHMpO3ZhciBlPXImJnIucGFyZW50Tm9kZTtlJiZlLnJlbW92ZUNoaWxkKHIpLHI9dm9pZCAwfX19fSh0LGUpKS5zaG93KCl9LHRsaXRlLmhpZGU9ZnVuY3Rpb24odCxlKXt0LnRvb2x0aXAmJnQudG9vbHRpcC5oaWRlKGUpfSxcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmKG1vZHVsZS5leHBvcnRzPXRsaXRlKTsiLCIvKiogXG4gKiBMaWJyYXJ5IGNvZGVcbiAqIFVzaW5nIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL0BjbG91ZGZvdXIvdHJhbnNpdGlvbi1oaWRkZW4tZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KHtcbiAgZWxlbWVudCxcbiAgdmlzaWJsZUNsYXNzLFxuICB3YWl0TW9kZSA9ICd0cmFuc2l0aW9uZW5kJyxcbiAgdGltZW91dER1cmF0aW9uLFxuICBoaWRlTW9kZSA9ICdoaWRkZW4nLFxuICBkaXNwbGF5VmFsdWUgPSAnYmxvY2snXG59KSB7XG4gIGlmICh3YWl0TW9kZSA9PT0gJ3RpbWVvdXQnICYmIHR5cGVvZiB0aW1lb3V0RHVyYXRpb24gIT09ICdudW1iZXInKSB7XG4gICAgY29uc29sZS5lcnJvcihgXG4gICAgICBXaGVuIGNhbGxpbmcgdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQgd2l0aCB3YWl0TW9kZSBzZXQgdG8gdGltZW91dCxcbiAgICAgIHlvdSBtdXN0IHBhc3MgaW4gYSBudW1iZXIgZm9yIHRpbWVvdXREdXJhdGlvbi5cbiAgICBgKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIERvbid0IHdhaXQgZm9yIGV4aXQgdHJhbnNpdGlvbnMgaWYgYSB1c2VyIHByZWZlcnMgcmVkdWNlZCBtb3Rpb24uXG4gIC8vIElkZWFsbHkgdHJhbnNpdGlvbnMgd2lsbCBiZSBkaXNhYmxlZCBpbiBDU1MsIHdoaWNoIG1lYW5zIHdlIHNob3VsZCBub3Qgd2FpdFxuICAvLyBiZWZvcmUgYWRkaW5nIGBoaWRkZW5gLlxuICBpZiAod2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJykubWF0Y2hlcykge1xuICAgIHdhaXRNb2RlID0gJ2ltbWVkaWF0ZSc7XG4gIH1cblxuICAvKipcbiAgICogQW4gZXZlbnQgbGlzdGVuZXIgdG8gYWRkIGBoaWRkZW5gIGFmdGVyIG91ciBhbmltYXRpb25zIGNvbXBsZXRlLlxuICAgKiBUaGlzIGxpc3RlbmVyIHdpbGwgcmVtb3ZlIGl0c2VsZiBhZnRlciBjb21wbGV0aW5nLlxuICAgKi9cbiAgY29uc3QgbGlzdGVuZXIgPSBlID0+IHtcbiAgICAvLyBDb25maXJtIGB0cmFuc2l0aW9uZW5kYCB3YXMgY2FsbGVkIG9uICBvdXIgYGVsZW1lbnRgIGFuZCBkaWRuJ3QgYnViYmxlXG4gICAgLy8gdXAgZnJvbSBhIGNoaWxkIGVsZW1lbnQuXG4gICAgaWYgKGUudGFyZ2V0ID09PSBlbGVtZW50KSB7XG4gICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcblxuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhcHBseUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVtb3ZlSGlkZGVuQXR0cmlidXRlcyA9ICgpID0+IHtcbiAgICBpZihoaWRlTW9kZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5VmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC8qKlxuICAgICAqIFNob3cgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICB0cmFuc2l0aW9uU2hvdygpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhpcyBsaXN0ZW5lciBzaG91bGRuJ3QgYmUgaGVyZSBidXQgaWYgc29tZW9uZSBzcGFtcyB0aGUgdG9nZ2xlXG4gICAgICAgKiBvdmVyIGFuZCBvdmVyIHJlYWxseSBmYXN0IGl0IGNhbiBpbmNvcnJlY3RseSBzdGljayBhcm91bmQuXG4gICAgICAgKiBXZSByZW1vdmUgaXQganVzdCB0byBiZSBzYWZlLlxuICAgICAgICovXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG5cbiAgICAgIC8qKlxuICAgICAgICogU2ltaWxhcmx5LCB3ZSdsbCBjbGVhciB0aGUgdGltZW91dCBpbiBjYXNlIGl0J3Mgc3RpbGwgaGFuZ2luZyBhcm91bmQuXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgICB9XG5cbiAgICAgIHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMoKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBGb3JjZSBhIGJyb3dzZXIgcmUtcGFpbnQgc28gdGhlIGJyb3dzZXIgd2lsbCByZWFsaXplIHRoZVxuICAgICAgICogZWxlbWVudCBpcyBubyBsb25nZXIgYGhpZGRlbmAgYW5kIGFsbG93IHRyYW5zaXRpb25zLlxuICAgICAgICovXG4gICAgICBjb25zdCByZWZsb3cgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHZpc2libGVDbGFzcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEhpZGUgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICB0cmFuc2l0aW9uSGlkZSgpIHtcbiAgICAgIGlmICh3YWl0TW9kZSA9PT0gJ3RyYW5zaXRpb25lbmQnKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICAgIH0gZWxzZSBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0Jykge1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgICAgfSwgdGltZW91dER1cmF0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdGhpcyBjbGFzcyB0byB0cmlnZ2VyIG91ciBhbmltYXRpb25cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgdGhlIGVsZW1lbnQncyB2aXNpYmlsaXR5XG4gICAgICovXG4gICAgdG9nZ2xlKCkge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oKSkge1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRlbGwgd2hldGhlciB0aGUgZWxlbWVudCBpcyBoaWRkZW4gb3Igbm90LlxuICAgICAqL1xuICAgIGlzSGlkZGVuKCkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgaGlkZGVuIGF0dHJpYnV0ZSBkb2VzIG5vdCByZXF1aXJlIGEgdmFsdWUuIFNpbmNlIGFuIGVtcHR5IHN0cmluZyBpc1xuICAgICAgICogZmFsc3ksIGJ1dCBzaG93cyB0aGUgcHJlc2VuY2Ugb2YgYW4gYXR0cmlidXRlIHdlIGNvbXBhcmUgdG8gYG51bGxgXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IGhhc0hpZGRlbkF0dHJpYnV0ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdoaWRkZW4nKSAhPT0gbnVsbDtcblxuICAgICAgY29uc3QgaXNEaXNwbGF5Tm9uZSA9IGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnO1xuXG4gICAgICBjb25zdCBoYXNWaXNpYmxlQ2xhc3MgPSBbLi4uZWxlbWVudC5jbGFzc0xpc3RdLmluY2x1ZGVzKHZpc2libGVDbGFzcyk7XG5cbiAgICAgIHJldHVybiBoYXNIaWRkZW5BdHRyaWJ1dGUgfHwgaXNEaXNwbGF5Tm9uZSB8fCAhaGFzVmlzaWJsZUNsYXNzO1xuICAgIH0sXG5cbiAgICAvLyBBIHBsYWNlaG9sZGVyIGZvciBvdXIgYHRpbWVvdXRgXG4gICAgdGltZW91dDogbnVsbFxuICB9O1xufSIsIi8qKlxuICBQcmlvcml0eSsgaG9yaXpvbnRhbCBzY3JvbGxpbmcgbWVudS5cblxuICBAcGFyYW0ge09iamVjdH0gb2JqZWN0IC0gQ29udGFpbmVyIGZvciBhbGwgb3B0aW9ucy5cbiAgICBAcGFyYW0ge3N0cmluZyB8fCBET00gbm9kZX0gc2VsZWN0b3IgLSBFbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBuYXZTZWxlY3RvciAtIE5hdiBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50U2VsZWN0b3IgLSBDb250ZW50IGVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGl0ZW1TZWxlY3RvciAtIEl0ZW1zIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBidXR0b25MZWZ0U2VsZWN0b3IgLSBMZWZ0IGJ1dHRvbiBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uUmlnaHRTZWxlY3RvciAtIFJpZ2h0IGJ1dHRvbiBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge2ludGVnZXIgfHwgc3RyaW5nfSBzY3JvbGxTdGVwIC0gQW1vdW50IHRvIHNjcm9sbCBvbiBidXR0b24gY2xpY2suICdhdmVyYWdlJyBnZXRzIHRoZSBhdmVyYWdlIGxpbmsgd2lkdGguXG4qL1xuXG5jb25zdCBQcmlvcml0eU5hdlNjcm9sbGVyID0gZnVuY3Rpb24oe1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyJyxcbiAgICBuYXZTZWxlY3RvcjogbmF2U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1uYXYnLFxuICAgIGNvbnRlbnRTZWxlY3RvcjogY29udGVudFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItY29udGVudCcsXG4gICAgaXRlbVNlbGVjdG9yOiBpdGVtU2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1pdGVtJyxcbiAgICBidXR0b25MZWZ0U2VsZWN0b3I6IGJ1dHRvbkxlZnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWJ0bi0tbGVmdCcsXG4gICAgYnV0dG9uUmlnaHRTZWxlY3RvcjogYnV0dG9uUmlnaHRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWJ0bi0tcmlnaHQnLFxuICAgIHNjcm9sbFN0ZXA6IHNjcm9sbFN0ZXAgPSA4MFxuICB9ID0ge30pIHtcblxuICBjb25zdCBuYXZTY3JvbGxlciA9IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSA6IHNlbGVjdG9yO1xuXG4gIGNvbnN0IHZhbGlkYXRlU2Nyb2xsU3RlcCA9ICgpID0+IHtcbiAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihzY3JvbGxTdGVwKSB8fCBzY3JvbGxTdGVwID09PSAnYXZlcmFnZSc7XG4gIH1cblxuICBpZiAobmF2U2Nyb2xsZXIgPT09IHVuZGVmaW5lZCB8fCBuYXZTY3JvbGxlciA9PT0gbnVsbCB8fCAhdmFsaWRhdGVTY3JvbGxTdGVwKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGlzIHNvbWV0aGluZyB3cm9uZywgY2hlY2sgeW91ciBvcHRpb25zLicpO1xuICB9XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXJOYXYgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKG5hdlNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3Rvcihjb250ZW50U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckNvbnRlbnRJdGVtcyA9IG5hdlNjcm9sbGVyQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKGl0ZW1TZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyTGVmdCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoYnV0dG9uTGVmdFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJSaWdodCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoYnV0dG9uUmlnaHRTZWxlY3Rvcik7XG5cbiAgbGV0IHNjcm9sbGluZyA9IGZhbHNlO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IDA7XG4gIGxldCBzY3JvbGxBdmFpbGFibGVSaWdodCA9IDA7XG4gIGxldCBzY3JvbGxpbmdEaXJlY3Rpb24gPSAnJztcbiAgbGV0IHNjcm9sbE92ZXJmbG93ID0gJyc7XG4gIGxldCB0aW1lb3V0O1xuXG5cbiAgLy8gU2V0cyBvdmVyZmxvdyBhbmQgdG9nZ2xlIGJ1dHRvbnMgYWNjb3JkaW5nbHlcbiAgY29uc3Qgc2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBzY3JvbGxPdmVyZmxvdyA9IGdldE92ZXJmbG93KCk7XG4gICAgdG9nZ2xlQnV0dG9ucyhzY3JvbGxPdmVyZmxvdyk7XG4gICAgY2FsY3VsYXRlU2Nyb2xsU3RlcCgpO1xuICB9XG5cblxuICAvLyBEZWJvdW5jZSBzZXR0aW5nIHRoZSBvdmVyZmxvdyB3aXRoIHJlcXVlc3RBbmltYXRpb25GcmFtZVxuICBjb25zdCByZXF1ZXN0U2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGltZW91dCkgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRpbWVvdXQpO1xuXG4gICAgdGltZW91dCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgc2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgLy8gR2V0cyB0aGUgb3ZlcmZsb3cgYXZhaWxhYmxlIG9uIHRoZSBuYXYgc2Nyb2xsZXJcbiAgY29uc3QgZ2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgc2Nyb2xsV2lkdGggPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxXaWR0aDtcbiAgICBsZXQgc2Nyb2xsVmlld3BvcnQgPSBuYXZTY3JvbGxlck5hdi5jbGllbnRXaWR0aDtcbiAgICBsZXQgc2Nyb2xsTGVmdCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQ7XG5cbiAgICBzY3JvbGxBdmFpbGFibGVMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICBzY3JvbGxBdmFpbGFibGVSaWdodCA9IHNjcm9sbFdpZHRoIC0gKHNjcm9sbFZpZXdwb3J0ICsgc2Nyb2xsTGVmdCk7XG5cbiAgICAvLyAxIGluc3RlYWQgb2YgMCB0byBjb21wZW5zYXRlIGZvciBudW1iZXIgcm91bmRpbmdcbiAgICBsZXQgc2Nyb2xsTGVmdENvbmRpdGlvbiA9IHNjcm9sbEF2YWlsYWJsZUxlZnQgPiAxO1xuICAgIGxldCBzY3JvbGxSaWdodENvbmRpdGlvbiA9IHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID4gMTtcblxuICAgIC8vIGNvbnNvbGUubG9nKHNjcm9sbFdpZHRoLCBzY3JvbGxWaWV3cG9ydCwgc2Nyb2xsQXZhaWxhYmxlTGVmdCwgc2Nyb2xsQXZhaWxhYmxlUmlnaHQpO1xuXG4gICAgaWYgKHNjcm9sbExlZnRDb25kaXRpb24gJiYgc2Nyb2xsUmlnaHRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAnYm90aCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNjcm9sbExlZnRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAnbGVmdCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ3JpZ2h0JztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gJ25vbmUnO1xuICAgIH1cblxuICB9XG5cblxuICAvLyBDYWxjdWxhdGVzIHRoZSBzY3JvbGwgc3RlcCBiYXNlZCBvbiB0aGUgd2lkdGggb2YgdGhlIHNjcm9sbGVyIGFuZCB0aGUgbnVtYmVyIG9mIGxpbmtzXG4gIGNvbnN0IGNhbGN1bGF0ZVNjcm9sbFN0ZXAgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnKSB7XG4gICAgICBsZXQgc2Nyb2xsVmlld3BvcnROb1BhZGRpbmcgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxXaWR0aCAtIChwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1sZWZ0JykpICsgcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKSkpO1xuXG4gICAgICBsZXQgc2Nyb2xsU3RlcEF2ZXJhZ2UgPSBNYXRoLmZsb29yKHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIC8gbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMubGVuZ3RoKTtcblxuICAgICAgc2Nyb2xsU3RlcCA9IHNjcm9sbFN0ZXBBdmVyYWdlO1xuICAgIH1cbiAgfVxuXG5cbiAgLy8gTW92ZSB0aGUgc2Nyb2xsZXIgd2l0aCBhIHRyYW5zZm9ybVxuICBjb25zdCBtb3ZlU2Nyb2xsZXIgPSBmdW5jdGlvbihkaXJlY3Rpb24pIHtcblxuICAgIGlmIChzY3JvbGxpbmcgPT09IHRydWUgfHwgKHNjcm9sbE92ZXJmbG93ICE9PSBkaXJlY3Rpb24gJiYgc2Nyb2xsT3ZlcmZsb3cgIT09ICdib3RoJykpIHJldHVybjtcblxuICAgIGxldCBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbFN0ZXA7XG4gICAgbGV0IHNjcm9sbEF2YWlsYWJsZSA9IGRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gc2Nyb2xsQXZhaWxhYmxlTGVmdCA6IHNjcm9sbEF2YWlsYWJsZVJpZ2h0O1xuXG4gICAgLy8gSWYgdGhlcmUgd2lsbCBiZSBsZXNzIHRoYW4gMjUlIG9mIHRoZSBsYXN0IHN0ZXAgdmlzaWJsZSB0aGVuIHNjcm9sbCB0byB0aGUgZW5kXG4gICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IChzY3JvbGxTdGVwICogMS43NSkpIHtcbiAgICAgIHNjcm9sbERpc3RhbmNlID0gc2Nyb2xsQXZhaWxhYmxlO1xuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHNjcm9sbERpc3RhbmNlICo9IC0xO1xuXG4gICAgICBpZiAoc2Nyb2xsQXZhaWxhYmxlIDwgc2Nyb2xsU3RlcCkge1xuICAgICAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc25hcC1hbGlnbi1lbmQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgnICsgc2Nyb2xsRGlzdGFuY2UgKyAncHgpJztcblxuICAgIHNjcm9sbGluZ0RpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICBzY3JvbGxpbmcgPSB0cnVlO1xuICB9XG5cblxuICAvLyBTZXQgdGhlIHNjcm9sbGVyIHBvc2l0aW9uIGFuZCByZW1vdmVzIHRyYW5zZm9ybSwgY2FsbGVkIGFmdGVyIG1vdmVTY3JvbGxlcigpIGluIHRoZSB0cmFuc2l0aW9uZW5kIGV2ZW50XG4gIGNvbnN0IHNldFNjcm9sbGVyUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQsIG51bGwpO1xuICAgIHZhciB0cmFuc2Zvcm0gPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd0cmFuc2Zvcm0nKTtcbiAgICB2YXIgdHJhbnNmb3JtVmFsdWUgPSBNYXRoLmFicyhwYXJzZUludCh0cmFuc2Zvcm0uc3BsaXQoJywnKVs0XSkgfHwgMCk7XG5cbiAgICBpZiAoc2Nyb2xsaW5nRGlyZWN0aW9uID09PSAnbGVmdCcpIHtcbiAgICAgIHRyYW5zZm9ybVZhbHVlICo9IC0xO1xuICAgIH1cblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QuYWRkKCduby10cmFuc2l0aW9uJyk7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LnN0eWxlLnRyYW5zZm9ybSA9ICcnO1xuICAgIG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ICsgdHJhbnNmb3JtVmFsdWU7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nLCAnc25hcC1hbGlnbi1lbmQnKTtcblxuICAgIHNjcm9sbGluZyA9IGZhbHNlO1xuICB9XG5cblxuICAvLyBUb2dnbGUgYnV0dG9ucyBkZXBlbmRpbmcgb24gb3ZlcmZsb3dcbiAgY29uc3QgdG9nZ2xlQnV0dG9ucyA9IGZ1bmN0aW9uKG92ZXJmbG93KSB7XG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdsZWZ0Jykge1xuICAgICAgbmF2U2Nyb2xsZXJMZWZ0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG5cbiAgICBpZiAob3ZlcmZsb3cgPT09ICdib3RoJyB8fCBvdmVyZmxvdyA9PT0gJ3JpZ2h0Jykge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlclJpZ2h0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cbiAgfVxuXG5cbiAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgc2V0T3ZlcmZsb3coKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyTmF2LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgIHJlcXVlc3RTZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCAoKSA9PiB7XG4gICAgICBzZXRTY3JvbGxlclBvc2l0aW9uKCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlckxlZnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBtb3ZlU2Nyb2xsZXIoJ2xlZnQnKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyUmlnaHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBtb3ZlU2Nyb2xsZXIoJ3JpZ2h0Jyk7XG4gICAgfSk7XG5cbiAgfTtcblxuXG4gIC8vIFNlbGYgaW5pdFxuICBpbml0KCk7XG5cblxuICAvLyBSZXZlYWwgQVBJXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xuXG59O1xuXG4vL2V4cG9ydCBkZWZhdWx0IFByaW9yaXR5TmF2U2Nyb2xsZXI7XG4iLCIvKipcbiAqIERvIHRoZXNlIHRoaW5ncyBhcyBxdWlja2x5IGFzIHBvc3NpYmxlOyB3ZSBtaWdodCBoYXZlIENTUyBvciBlYXJseSBzY3JpcHRzIHRoYXQgcmVxdWlyZSBvbiBpdFxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAnbm8tanMnICk7XG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ2pzJyApO1xuIiwiLy8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3NcbmlmICggc2Vzc2lvblN0b3JhZ2Uuc2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCAmJiBzZXNzaW9uU3RvcmFnZS5zYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgKSB7XG5cdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzZXJpZi1mb250cy1sb2FkZWQgc2Fucy1mb250cy1sb2FkZWQnO1xufSBlbHNlIHtcblx0LyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjEuMCAtIMKpIEJyYW0gU3RlaW4uIExpY2Vuc2U6IEJTRC0zLUNsYXVzZSAqLyggZnVuY3Rpb24oKSB7XG5cdFx0J3VzZSBzdHJpY3QnO3ZhciBmLFxuXHRcdFx0ZyA9IFtdO2Z1bmN0aW9uIGwoIGEgKSB7XG5cdFx0XHRnLnB1c2goIGEgKTsxID09IGcubGVuZ3RoICYmIGYoKTtcblx0XHR9IGZ1bmN0aW9uIG0oKSB7XG5cdFx0XHRmb3IgKCA7Zy5sZW5ndGg7ICkge1xuXHRcdFx0XHRnWzBdKCksIGcuc2hpZnQoKTtcblx0XHRcdH1cblx0XHR9ZiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0c2V0VGltZW91dCggbSApO1xuXHRcdH07ZnVuY3Rpb24gbiggYSApIHtcblx0XHRcdHRoaXMuYSA9IHA7dGhpcy5iID0gdm9pZCAwO3RoaXMuZiA9IFtdO3ZhciBiID0gdGhpczt0cnkge1xuXHRcdFx0XHRhKCBmdW5jdGlvbiggYSApIHtcblx0XHRcdFx0XHRxKCBiLCBhICk7XG5cdFx0XHRcdH0sIGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHRcdHIoIGIsIGEgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSBjYXRjaCAoIGMgKSB7XG5cdFx0XHRcdHIoIGIsIGMgKTtcblx0XHRcdH1cblx0XHR9IHZhciBwID0gMjtmdW5jdGlvbiB0KCBhICkge1xuXHRcdFx0cmV0dXJuIG5ldyBuKCBmdW5jdGlvbiggYiwgYyApIHtcblx0XHRcdFx0YyggYSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZnVuY3Rpb24gdSggYSApIHtcblx0XHRcdHJldHVybiBuZXcgbiggZnVuY3Rpb24oIGIgKSB7XG5cdFx0XHRcdGIoIGEgKTtcblx0XHRcdH0gKTtcblx0XHR9IGZ1bmN0aW9uIHEoIGEsIGIgKSB7XG5cdFx0XHRpZiAoIGEuYSA9PSBwICkge1xuXHRcdFx0XHRpZiAoIGIgPT0gYSApIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yO1xuXHRcdFx0XHR9IHZhciBjID0gISAxO3RyeSB7XG5cdFx0XHRcdFx0dmFyIGQgPSBiICYmIGIudGhlbjtpZiAoIG51bGwgIT0gYiAmJiAnb2JqZWN0JyA9PT0gdHlwZW9mIGIgJiYgJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGQgKSB7XG5cdFx0XHRcdFx0XHRkLmNhbGwoIGIsIGZ1bmN0aW9uKCBiICkge1xuXHRcdFx0XHRcdFx0XHRjIHx8IHEoIGEsIGIgKTtjID0gISAwO1xuXHRcdFx0XHRcdFx0fSwgZnVuY3Rpb24oIGIgKSB7XG5cdFx0XHRcdFx0XHRcdGMgfHwgciggYSwgYiApO2MgPSAhIDA7XG5cdFx0XHRcdFx0XHR9ICk7cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0XHRcdFx0YyB8fCByKCBhLCBlICk7cmV0dXJuO1xuXHRcdFx0XHR9YS5hID0gMDthLmIgPSBiO3YoIGEgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gciggYSwgYiApIHtcblx0XHRcdGlmICggYS5hID09IHAgKSB7XG5cdFx0XHRcdGlmICggYiA9PSBhICkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3I7XG5cdFx0XHRcdH1hLmEgPSAxO2EuYiA9IGI7diggYSApO1xuXHRcdFx0fVxuXHRcdH0gZnVuY3Rpb24gdiggYSApIHtcblx0XHRcdGwoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIGEuYSAhPSBwICkge1xuXHRcdFx0XHRcdGZvciAoIDthLmYubGVuZ3RoOyApIHtcblx0XHRcdFx0XHRcdHZhciBiID0gYS5mLnNoaWZ0KCksXG5cdFx0XHRcdFx0XHRcdGMgPSBiWzBdLFxuXHRcdFx0XHRcdFx0XHRkID0gYlsxXSxcblx0XHRcdFx0XHRcdFx0ZSA9IGJbMl0sXG5cdFx0XHRcdFx0XHRcdGIgPSBiWzNdO3RyeSB7XG5cdFx0XHRcdFx0XHRcdDAgPT0gYS5hID8gJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGMgPyBlKCBjLmNhbGwoIHZvaWQgMCwgYS5iICkgKSA6IGUoIGEuYiApIDogMSA9PSBhLmEgJiYgKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgZCA/IGUoIGQuY2FsbCggdm9pZCAwLCBhLmIgKSApIDogYiggYS5iICkgKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKCBoICkge1xuXHRcdFx0XHRcdFx0XHRiKCBoICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fW4ucHJvdG90eXBlLmcgPSBmdW5jdGlvbiggYSApIHtcblx0XHRcdHJldHVybiB0aGlzLmMoIHZvaWQgMCwgYSApO1xuXHRcdH07bi5wcm90b3R5cGUuYyA9IGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0dmFyIGMgPSB0aGlzO3JldHVybiBuZXcgbiggZnVuY3Rpb24oIGQsIGUgKSB7XG5cdFx0XHRcdGMuZi5wdXNoKCBbIGEsIGIsIGQsIGUgXSApO3YoIGMgKTtcblx0XHRcdH0gKTtcblx0XHR9O1xuXHRcdGZ1bmN0aW9uIHcoIGEgKSB7XG5cdFx0XHRyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBiLCBjICkge1xuXHRcdFx0XHRmdW5jdGlvbiBkKCBjICkge1xuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiggZCApIHtcblx0XHRcdFx0XHRcdGhbY10gPSBkO2UgKz0gMTtlID09IGEubGVuZ3RoICYmIGIoIGggKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9IHZhciBlID0gMCxcblx0XHRcdFx0XHRoID0gW107MCA9PSBhLmxlbmd0aCAmJiBiKCBoICk7Zm9yICggdmFyIGsgPSAwO2sgPCBhLmxlbmd0aDtrICs9IDEgKSB7XG5cdFx0XHRcdFx0dSggYVtrXSApLmMoIGQoIGsgKSwgYyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSBmdW5jdGlvbiB4KCBhICkge1xuXHRcdFx0cmV0dXJuIG5ldyBuKCBmdW5jdGlvbiggYiwgYyApIHtcblx0XHRcdFx0Zm9yICggdmFyIGQgPSAwO2QgPCBhLmxlbmd0aDtkICs9IDEgKSB7XG5cdFx0XHRcdFx0dSggYVtkXSApLmMoIGIsIGMgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH13aW5kb3cuUHJvbWlzZSB8fCAoIHdpbmRvdy5Qcm9taXNlID0gbiwgd2luZG93LlByb21pc2UucmVzb2x2ZSA9IHUsIHdpbmRvdy5Qcm9taXNlLnJlamVjdCA9IHQsIHdpbmRvdy5Qcm9taXNlLnJhY2UgPSB4LCB3aW5kb3cuUHJvbWlzZS5hbGwgPSB3LCB3aW5kb3cuUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IG4ucHJvdG90eXBlLmMsIHdpbmRvdy5Qcm9taXNlLnByb3RvdHlwZS5jYXRjaCA9IG4ucHJvdG90eXBlLmcgKTtcblx0fSgpICk7XG5cblx0KCBmdW5jdGlvbigpIHtcblx0XHRmdW5jdGlvbiBsKCBhLCBiICkge1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA/IGEuYWRkRXZlbnRMaXN0ZW5lciggJ3Njcm9sbCcsIGIsICEgMSApIDogYS5hdHRhY2hFdmVudCggJ3Njcm9sbCcsIGIgKTtcblx0XHR9IGZ1bmN0aW9uIG0oIGEgKSB7XG5cdFx0XHRkb2N1bWVudC5ib2R5ID8gYSgpIDogZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA/IGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gYygpIHtcblx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBjICk7YSgpO1xuXHRcdFx0fSApIDogZG9jdW1lbnQuYXR0YWNoRXZlbnQoICdvbnJlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbiBrKCkge1xuXHRcdFx0XHRpZiAoICdpbnRlcmFjdGl2ZScgPT0gZG9jdW1lbnQucmVhZHlTdGF0ZSB8fCAnY29tcGxldGUnID09IGRvY3VtZW50LnJlYWR5U3RhdGUgKSB7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZGV0YWNoRXZlbnQoICdvbnJlYWR5c3RhdGVjaGFuZ2UnLCBrICksIGEoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0gZnVuY3Rpb24gdCggYSApIHtcblx0XHRcdHRoaXMuYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7dGhpcy5hLnNldEF0dHJpYnV0ZSggJ2FyaWEtaGlkZGVuJywgJ3RydWUnICk7dGhpcy5hLmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSggYSApICk7dGhpcy5iID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICk7dGhpcy5jID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICk7dGhpcy5oID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICk7dGhpcy5mID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICk7dGhpcy5nID0gLTE7dGhpcy5iLnN0eWxlLmNzc1RleHQgPSAnbWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7Jzt0aGlzLmMuc3R5bGUuY3NzVGV4dCA9ICdtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDsnO1xuXHRcdFx0dGhpcy5mLnN0eWxlLmNzc1RleHQgPSAnbWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7Jzt0aGlzLmguc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyMDAlO2hlaWdodDoyMDAlO2ZvbnQtc2l6ZToxNnB4O21heC13aWR0aDpub25lOyc7dGhpcy5iLmFwcGVuZENoaWxkKCB0aGlzLmggKTt0aGlzLmMuYXBwZW5kQ2hpbGQoIHRoaXMuZiApO3RoaXMuYS5hcHBlbmRDaGlsZCggdGhpcy5iICk7dGhpcy5hLmFwcGVuZENoaWxkKCB0aGlzLmMgKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdSggYSwgYiApIHtcblx0XHRcdGEuYS5zdHlsZS5jc3NUZXh0ID0gJ21heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1zeW50aGVzaXM6bm9uZTtmb250OicgKyBiICsgJzsnO1xuXHRcdH0gZnVuY3Rpb24geiggYSApIHtcblx0XHRcdHZhciBiID0gYS5hLm9mZnNldFdpZHRoLFxuXHRcdFx0XHRjID0gYiArIDEwMDthLmYuc3R5bGUud2lkdGggPSBjICsgJ3B4JzthLmMuc2Nyb2xsTGVmdCA9IGM7YS5iLnNjcm9sbExlZnQgPSBhLmIuc2Nyb2xsV2lkdGggKyAxMDA7cmV0dXJuIGEuZyAhPT0gYiA/ICggYS5nID0gYiwgISAwICkgOiAhIDE7XG5cdFx0fSBmdW5jdGlvbiBBKCBhLCBiICkge1xuXHRcdFx0ZnVuY3Rpb24gYygpIHtcblx0XHRcdFx0dmFyIGEgPSBrO3ooIGEgKSAmJiBhLmEucGFyZW50Tm9kZSAmJiBiKCBhLmcgKTtcblx0XHRcdH0gdmFyIGsgPSBhO2woIGEuYiwgYyApO2woIGEuYywgYyApO3ooIGEgKTtcblx0XHR9IGZ1bmN0aW9uIEIoIGEsIGIgKSB7XG5cdFx0XHR2YXIgYyA9IGIgfHwge307dGhpcy5mYW1pbHkgPSBhO3RoaXMuc3R5bGUgPSBjLnN0eWxlIHx8ICdub3JtYWwnO3RoaXMud2VpZ2h0ID0gYy53ZWlnaHQgfHwgJ25vcm1hbCc7dGhpcy5zdHJldGNoID0gYy5zdHJldGNoIHx8ICdub3JtYWwnO1xuXHRcdH0gdmFyIEMgPSBudWxsLFxuXHRcdFx0RCA9IG51bGwsXG5cdFx0XHRFID0gbnVsbCxcblx0XHRcdEYgPSBudWxsO2Z1bmN0aW9uIEcoKSB7XG5cdFx0XHRpZiAoIG51bGwgPT09IEQgKSB7XG5cdFx0XHRcdGlmICggSigpICYmIC9BcHBsZS8udGVzdCggd2luZG93Lm5hdmlnYXRvci52ZW5kb3IgKSApIHtcblx0XHRcdFx0XHR2YXIgYSA9IC9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpKD86XFwuKFswLTldKykpLy5leGVjKCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCApO0QgPSAhISBhICYmIDYwMyA+IHBhcnNlSW50KCBhWzFdLCAxMCApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdEQgPSAhIDE7XG5cdFx0XHRcdH1cblx0XHRcdH0gcmV0dXJuIEQ7XG5cdFx0fSBmdW5jdGlvbiBKKCkge1xuXHRcdFx0bnVsbCA9PT0gRiAmJiAoIEYgPSAhISBkb2N1bWVudC5mb250cyApO3JldHVybiBGO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBLKCkge1xuXHRcdFx0aWYgKCBudWxsID09PSBFICkge1xuXHRcdFx0XHR2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7dHJ5IHtcblx0XHRcdFx0XHRhLnN0eWxlLmZvbnQgPSAnY29uZGVuc2VkIDEwMHB4IHNhbnMtc2VyaWYnO1xuXHRcdFx0XHR9IGNhdGNoICggYiApIHt9RSA9ICcnICE9PSBhLnN0eWxlLmZvbnQ7XG5cdFx0XHR9IHJldHVybiBFO1xuXHRcdH0gZnVuY3Rpb24gTCggYSwgYiApIHtcblx0XHRcdHJldHVybiBbIGEuc3R5bGUsIGEud2VpZ2h0LCBLKCkgPyBhLnN0cmV0Y2ggOiAnJywgJzEwMHB4JywgYiBdLmpvaW4oICcgJyApO1xuXHRcdH1cblx0XHRCLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHR2YXIgYyA9IHRoaXMsXG5cdFx0XHRcdGsgPSBhIHx8ICdCRVNic3d5Jyxcblx0XHRcdFx0ciA9IDAsXG5cdFx0XHRcdG4gPSBiIHx8IDNFMyxcblx0XHRcdFx0SCA9ICggbmV3IERhdGUgKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKCBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdFx0aWYgKCBKKCkgJiYgISBHKCkgKSB7XG5cdFx0XHRcdFx0dmFyIE0gPSBuZXcgUHJvbWlzZSggZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHRcdFx0XHRcdGZ1bmN0aW9uIGUoKSB7XG5cdFx0XHRcdFx0XHRcdFx0KCBuZXcgRGF0ZSApLmdldFRpbWUoKSAtIEggPj0gbiA/IGIoIEVycm9yKCAnJyArIG4gKyAnbXMgdGltZW91dCBleGNlZWRlZCcgKSApIDogZG9jdW1lbnQuZm9udHMubG9hZCggTCggYywgJ1wiJyArIGMuZmFtaWx5ICsgJ1wiJyApLCBrICkudGhlbiggZnVuY3Rpb24oIGMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQxIDw9IGMubGVuZ3RoID8gYSgpIDogc2V0VGltZW91dCggZSwgMjUgKTtcblx0XHRcdFx0XHRcdFx0XHR9LCBiICk7XG5cdFx0XHRcdFx0XHRcdH1lKCk7XG5cdFx0XHRcdFx0XHR9ICksXG5cdFx0XHRcdFx0XHROID0gbmV3IFByb21pc2UoIGZ1bmN0aW9uKCBhLCBjICkge1xuXHRcdFx0XHRcdFx0XHRyID0gc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0YyggRXJyb3IoICcnICsgbiArICdtcyB0aW1lb3V0IGV4Y2VlZGVkJyApICk7XG5cdFx0XHRcdFx0XHRcdH0sIG4gKTtcblx0XHRcdFx0XHRcdH0gKTtQcm9taXNlLnJhY2UoIFsgTiwgTSBdICkudGhlbiggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQoIHIgKTthKCBjICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRiICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bSggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRmdW5jdGlvbiB2KCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgYjtpZiAoIGIgPSAtMSAhPSBmICYmIC0xICE9IGcgfHwgLTEgIT0gZiAmJiAtMSAhPSBoIHx8IC0xICE9IGcgJiYgLTEgIT0gaCApIHtcblx0XHRcdFx0XHRcdFx0XHQoIGIgPSBmICE9IGcgJiYgZiAhPSBoICYmIGcgIT0gaCApIHx8ICggbnVsbCA9PT0gQyAmJiAoIGIgPSAvQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyggd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQgKSwgQyA9ICEhIGIgJiYgKCA1MzYgPiBwYXJzZUludCggYlsxXSwgMTAgKSB8fCA1MzYgPT09IHBhcnNlSW50KCBiWzFdLCAxMCApICYmIDExID49IHBhcnNlSW50KCBiWzJdLCAxMCApICkgKSwgYiA9IEMgJiYgKCBmID09IHcgJiYgZyA9PSB3ICYmIGggPT0gdyB8fCBmID09IHggJiYgZyA9PSB4ICYmIGggPT0geCB8fCBmID09IHkgJiYgZyA9PSB5ICYmIGggPT0geSApICksIGIgPSAhIGI7XG5cdFx0XHRcdFx0XHRcdH1iICYmICggZC5wYXJlbnROb2RlICYmIGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZCApLCBjbGVhclRpbWVvdXQoIHIgKSwgYSggYyApICk7XG5cdFx0XHRcdFx0XHR9IGZ1bmN0aW9uIEkoKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggKCBuZXcgRGF0ZSApLmdldFRpbWUoKSAtIEggPj0gbiApIHtcblx0XHRcdFx0XHRcdFx0XHRkLnBhcmVudE5vZGUgJiYgZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBkICksIGIoIEVycm9yKCAnJyArXG5cdG4gKyAnbXMgdGltZW91dCBleGNlZWRlZCcgKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBhID0gZG9jdW1lbnQuaGlkZGVuO2lmICggISAwID09PSBhIHx8IHZvaWQgMCA9PT0gYSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdGYgPSBlLmEub2Zmc2V0V2lkdGgsIGcgPSBwLmEub2Zmc2V0V2lkdGgsIGggPSBxLmEub2Zmc2V0V2lkdGgsIHYoKTtcblx0XHRcdFx0XHRcdFx0XHR9ciA9IHNldFRpbWVvdXQoIEksIDUwICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gdmFyIGUgPSBuZXcgdCggayApLFxuXHRcdFx0XHRcdFx0XHRwID0gbmV3IHQoIGsgKSxcblx0XHRcdFx0XHRcdFx0cSA9IG5ldyB0KCBrICksXG5cdFx0XHRcdFx0XHRcdGYgPSAtMSxcblx0XHRcdFx0XHRcdFx0ZyA9IC0xLFxuXHRcdFx0XHRcdFx0XHRoID0gLTEsXG5cdFx0XHRcdFx0XHRcdHcgPSAtMSxcblx0XHRcdFx0XHRcdFx0eCA9IC0xLFxuXHRcdFx0XHRcdFx0XHR5ID0gLTEsXG5cdFx0XHRcdFx0XHRcdGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO2QuZGlyID0gJ2x0cic7dSggZSwgTCggYywgJ3NhbnMtc2VyaWYnICkgKTt1KCBwLCBMKCBjLCAnc2VyaWYnICkgKTt1KCBxLCBMKCBjLCAnbW9ub3NwYWNlJyApICk7ZC5hcHBlbmRDaGlsZCggZS5hICk7ZC5hcHBlbmRDaGlsZCggcC5hICk7ZC5hcHBlbmRDaGlsZCggcS5hICk7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggZCApO3cgPSBlLmEub2Zmc2V0V2lkdGg7eCA9IHAuYS5vZmZzZXRXaWR0aDt5ID0gcS5hLm9mZnNldFdpZHRoO0koKTtBKCBlLCBmdW5jdGlvbiggYSApIHtcblx0XHRcdFx0XHRcdFx0ZiA9IGE7digpO1xuXHRcdFx0XHRcdFx0fSApO3UoIGUsXG5cdFx0XHRcdFx0XHRcdEwoIGMsICdcIicgKyBjLmZhbWlseSArICdcIixzYW5zLXNlcmlmJyApICk7QSggcCwgZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0XHRcdGcgPSBhO3YoKTtcblx0XHRcdFx0XHRcdH0gKTt1KCBwLCBMKCBjLCAnXCInICsgYy5mYW1pbHkgKyAnXCIsc2VyaWYnICkgKTtBKCBxLCBmdW5jdGlvbiggYSApIHtcblx0XHRcdFx0XHRcdFx0aCA9IGE7digpO1xuXHRcdFx0XHRcdFx0fSApO3UoIHEsIEwoIGMsICdcIicgKyBjLmZhbWlseSArICdcIixtb25vc3BhY2UnICkgKTtcblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9OydvYmplY3QnID09PSB0eXBlb2YgbW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgPSBCIDogKCB3aW5kb3cuRm9udEZhY2VPYnNlcnZlciA9IEIsIHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkID0gQi5wcm90b3R5cGUubG9hZCApO1xuXHR9KCkgKTtcblxuXHQvLyBtaW5ucG9zdCBmb250c1xuXG5cdC8vIHNhbnNcblx0dmFyIHNhbnNOb3JtYWwgPSBuZXcgRm9udEZhY2VPYnNlcnZlciggJ2ZmLW1ldGEtd2ViLXBybycgKTtcblx0dmFyIHNhbnNCb2xkID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNzAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2Fuc05vcm1hbEl0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDQwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblxuXHQvLyBzZXJpZlxuXHR2YXIgc2VyaWZCb29rID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNTAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCb29rSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNTAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCb2xkID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNzAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCb2xkSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNzAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCbGFjayA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDkwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQmxhY2tJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA5MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cblx0UHJvbWlzZS5hbGwoIFtcblx0XHRzYW5zTm9ybWFsLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zQm9sZC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc05vcm1hbEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb29rLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvb2tJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9sZC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb2xkSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJsYWNrLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJsYWNrSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKVxuXHRdICkudGhlbiggZnVuY3Rpb24oKSB7XG5cdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIHNlcmlmLWZvbnRzLWxvYWRlZCc7XG5cblx0XHQvLyBPcHRpbWl6YXRpb24gZm9yIFJlcGVhdCBWaWV3c1xuXHRcdHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG5cblx0UHJvbWlzZS5hbGwoIFtcblx0XHRzYW5zTm9ybWFsLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zQm9sZC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc05vcm1hbEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwIClcblx0XSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzYW5zLWZvbnRzLWxvYWRlZCc7XG5cblx0XHQvLyBPcHRpbWl6YXRpb24gZm9yIFJlcGVhdCBWaWV3c1xuXHRcdHNlc3Npb25TdG9yYWdlLnNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCA9IHRydWU7XG5cdH0gKTtcbn1cblxuIiwiZnVuY3Rpb24gbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgdmFsdWUgKSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEgJiYgJycgIT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS51cmxfYWNjZXNzX2xldmVsICkge1xuXHRcdHZhciB0eXBlID0gJ2V2ZW50Jztcblx0XHR2YXIgY2F0ZWdvcnkgPSAnTWVtYmVyIENvbnRlbnQnO1xuXHRcdHZhciBsYWJlbCA9IGxvY2F0aW9uLnBhdGhuYW1lOyAvLyBpIHRoaW5rIHdlIGNvdWxkIHBvc3NpYmx5IHB1dCBzb21lIGdyb3VwaW5nIGhlcmUsIGJ1dCB3ZSBkb24ndCBuZWNlc3NhcmlseSBoYXZlIGFjY2VzcyB0byBvbmUgYW5kIG1heWJlIGl0J3Mgbm90IHdvcnRod2hpbGUgeWV0XG5cdFx0dmFyIGFjdGlvbiA9ICdCbG9ja2VkJztcblx0XHRpZiAoIHRydWUgPT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS5jdXJyZW50X3VzZXIuY2FuX2FjY2VzcyApIHtcblx0XHRcdGFjdGlvbiA9ICdTaG93bic7XG5cdFx0fVxuXHRcdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0fVxufSApO1xuIiwiZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gPSAnJyApIHtcblxuXHQvLyBpZiBhIG5vdCBsb2dnZWQgaW4gdXNlciB0cmllcyB0byBlbWFpbCwgZG9uJ3QgY291bnQgdGhhdCBhcyBhIHNoYXJlXG5cdGlmICggISBqUXVlcnkoICdib2R5JyApLmhhc0NsYXNzKCAnbG9nZ2VkLWluJyApICYmICdFbWFpbCcgPT09IHRleHQgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGNhdGVnb3J5ID0gJ1NoYXJlJztcblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0Y2F0ZWdvcnkgPSAnU2hhcmUgLSAnICsgcG9zaXRpb247XG5cdH1cblxuXHQvLyB0cmFjayBhcyBhbiBldmVudCwgYW5kIGFzIHNvY2lhbCBpZiBpdCBpcyB0d2l0dGVyIG9yIGZiXG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnksIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgfHwgJ1R3aXR0ZXInID09PSB0ZXh0ICkge1xuXHRcdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0ICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZnVuY3Rpb24gY29weUN1cnJlbnRVUkwoKSB7XG5cdHZhciBkdW1teSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdpbnB1dCcgKSxcblx0XHR0ZXh0ID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGR1bW15ICk7XG5cdGR1bW15LnZhbHVlID0gdGV4dDtcblx0ZHVtbXkuc2VsZWN0KCk7XG5cdGRvY3VtZW50LmV4ZWNDb21tYW5kKCAnY29weScgKTtcblx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCggZHVtbXkgKTtcbn1cblxuJCggJy5tLWVudHJ5LXNoYXJlLXRvcCBhJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0dmFyIHRleHQgPSAkKCB0aGlzICkuZGF0YSggJ3NoYXJlLWFjdGlvbicgKTtcblx0dmFyIHBvc2l0aW9uID0gJ3RvcCc7XG5cdHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG59ICk7XG5cbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1wcmludCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR3aW5kb3cucHJpbnQoKTtcbn0gKTtcblxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWNvcHktdXJsIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRjb3B5Q3VycmVudFVSTCgpO1xuXHR0bGl0ZS5zaG93KCAoIGUudGFyZ2V0ICksIHsgZ3JhdjogJ3cnIH0gKTtcblx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0dGxpdGUuaGlkZSggKCBlLnRhcmdldCApICk7XG5cdH0sIDMwMDAgKTtcblx0cmV0dXJuIGZhbHNlO1xufSApO1xuXG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZmFjZWJvb2sgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtdHdpdHRlciBhLCAubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1lbWFpbCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR2YXIgdXJsID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXHR3aW5kb3cub3BlbiggdXJsLCAnX2JsYW5rJyApO1xufSApO1xuIiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogTmF2aWdhdGlvbiBzY3JpcHRzLiBJbmNsdWRlcyBtb2JpbGUgb3IgdG9nZ2xlIGJlaGF2aW9yLCBhbmFseXRpY3MgdHJhY2tpbmcgb2Ygc3BlY2lmaWMgbWVudXMuXG4gKi9cblxuZnVuY3Rpb24gc2V0dXBQcmltYXJ5TmF2KCkge1xuXHRjb25zdCBwcmltYXJ5TmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWxpbmtzJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgcHJpbWFyeU5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgYnV0dG9uJyApO1xuXHRpZiAoIG51bGwgIT09IHByaW1hcnlOYXZUb2dnbGUgKSB7XG5cdFx0cHJpbWFyeU5hdlRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdGNvbnN0IHVzZXJOYXZUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1taW5ucG9zdC1hY2NvdW50IHVsJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgdXNlck5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1taW5ucG9zdC1hY2NvdW50ID4gYScgKTtcblx0aWYgKCBudWxsICE9PSB1c2VyTmF2VG9nZ2xlICkge1xuXHRcdHVzZXJOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHR2YXIgdGFyZ2V0ICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ25hdiAubS1mb3JtLXNlYXJjaCBmaWVsZHNldCAuYS1idXR0b24tc2VudGVuY2UnICk7XG5cdGlmICggbnVsbCAhPT0gdGFyZ2V0ICkge1xuXHRcdHZhciBkaXYgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdGRpdi5pbm5lckhUTUwgPSAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImEtY2xvc2UtYnV0dG9uIGEtY2xvc2Utc2VhcmNoXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG5cdFx0dmFyIGZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRkaXYuc2V0QXR0cmlidXRlKCAnY2xhc3MnLCAnYS1jbG9zZS1ob2xkZXInICk7XG5cdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZCggZnJhZ21lbnQgKTtcblxuXHRcdGNvbnN0IHNlYXJjaFRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWFjdGlvbnMgLm0tZm9ybS1zZWFyY2gnICksXG5cdFx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdFx0fSApO1xuXG5cdFx0dmFyIHNlYXJjaFZpc2libGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbGkuc2VhcmNoID4gYScgKTtcblx0XHRzZWFyY2hWaXNpYmxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdHZhciBzZWFyY2hDbG9zZSAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmEtY2xvc2Utc2VhcmNoJyApO1xuXHRcdHNlYXJjaENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdC8vIGVzY2FwZSBrZXkgcHJlc3Ncblx0JCggZG9jdW1lbnQgKS5rZXl1cCggZnVuY3Rpb24oIGUgKSB7XG5cdFx0aWYgKCAyNyA9PT0gZS5rZXlDb2RlICkge1xuXHRcdFx0bGV0IHByaW1hcnlOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gcHJpbWFyeU5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHVzZXJOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gdXNlck5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHNlYXJjaElzVmlzaWJsZSA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBwcmltYXJ5TmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gcHJpbWFyeU5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHRwcmltYXJ5TmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHByaW1hcnlOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHVzZXJOYXZFeHBhbmRlZCAmJiB0cnVlID09PSB1c2VyTmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgdXNlck5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2Ygc2VhcmNoSXNWaXNpYmxlICYmIHRydWUgPT09IHNlYXJjaElzVmlzaWJsZSApIHtcblx0XHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBzZWFyY2hJc1Zpc2libGUgKTtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIHNldHVwU2Nyb2xsTmF2KCBzZWxlY3RvciwgbmF2U2VsZWN0b3IsIGNvbnRlbnRTZWxlY3RvciApIHtcblxuXHQvLyBJbml0IHdpdGggYWxsIG9wdGlvbnMgYXQgZGVmYXVsdCBzZXR0aW5nXG5cdGNvbnN0IHByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0ID0gUHJpb3JpdHlOYXZTY3JvbGxlcigge1xuXHRcdHNlbGVjdG9yOiBzZWxlY3Rvcixcblx0XHRuYXZTZWxlY3RvcjogbmF2U2VsZWN0b3IsXG5cdFx0Y29udGVudFNlbGVjdG9yOiBjb250ZW50U2VsZWN0b3IsXG5cdFx0aXRlbVNlbGVjdG9yOiAnbGksIGEnLFxuXHRcdGJ1dHRvbkxlZnRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0Jyxcblx0XHRidXR0b25SaWdodFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0J1xuXG5cdFx0Ly9zY3JvbGxTdGVwOiAnYXZlcmFnZSdcblx0fSApO1xuXG5cdC8vIEluaXQgbXVsdGlwbGUgbmF2IHNjcm9sbGVycyB3aXRoIHRoZSBzYW1lIG9wdGlvbnNcblx0LypsZXQgbmF2U2Nyb2xsZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi1zY3JvbGxlcicpO1xuXG5cdG5hdlNjcm9sbGVycy5mb3JFYWNoKChjdXJyZW50VmFsdWUsIGN1cnJlbnRJbmRleCkgPT4ge1xuXHQgIFByaW9yaXR5TmF2U2Nyb2xsZXIoe1xuXHQgICAgc2VsZWN0b3I6IGN1cnJlbnRWYWx1ZVxuXHQgIH0pO1xuXHR9KTsqL1xufVxuXG5zZXR1cFByaW1hcnlOYXYoKTtcblxuaWYgKCAwIDwgJCggJy5tLXN1Yi1uYXZpZ2F0aW9uJyApLmxlbmd0aCApIHtcblx0c2V0dXBTY3JvbGxOYXYoICcubS1zdWItbmF2aWdhdGlvbicsICcubS1zdWJuYXYtbmF2aWdhdGlvbicsICcubS1tZW51LXN1Yi1uYXZpZ2F0aW9uJyApO1xufVxuaWYgKCAwIDwgJCggJy5tLXBhZ2luYXRpb24tbmF2aWdhdGlvbicgKS5sZW5ndGggKSB7XG5cdHNldHVwU2Nyb2xsTmF2KCAnLm0tcGFnaW5hdGlvbi1uYXZpZ2F0aW9uJywgJy5tLXBhZ2luYXRpb24tY29udGFpbmVyJywgJy5tLXBhZ2luYXRpb24tbGlzdCcgKTtcbn1cblxuJCggJ2EnLCAkKCAnLm8tc2l0ZS1zaWRlYmFyJyApICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHR2YXIgd2lkZ2V0VGl0bGUgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0td2lkZ2V0JyApLmZpbmQoICdoMycgKS50ZXh0KCk7XG5cdHZhciB6b25lVGl0bGUgICAgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS16b25lJyApLmZpbmQoICcuYS16b25lLXRpdGxlJyApLnRleHQoKTtcblx0dmFyIHNpZGViYXJTZWN0aW9uVGl0bGUgPSAnJztcblx0aWYgKCAnJyAhPT0gd2lkZ2V0VGl0bGUgKSB7XG5cdFx0c2lkZWJhclNlY3Rpb25UaXRsZSA9IHdpZGdldFRpdGxlO1xuXHR9IGVsc2UgaWYgKCAnJyAhPT0gem9uZVRpdGxlICkge1xuXHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB6b25lVGl0bGU7XG5cdH1cblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBMaW5rJywgJ0NsaWNrJywgc2lkZWJhclNlY3Rpb25UaXRsZSApO1xufSApO1xuIiwialF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICggdGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgJycgIT09IHRoaXMubm9kZVZhbHVlLnRyaW0oKSApO1xuXHR9ICk7XG59O1xuXG5mdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0cmV0dXJuIG1hcmt1cDtcbn1cblxuZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCggJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nICk7XG5cdHZhciByZXN0Um9vdCAgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0dmFyIGZ1bGxVcmwgICAgICAgICAgICA9IHJlc3RSb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdHZhciBjb25maXJtQ2hhbmdlICAgICAgPSAnJztcblx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdHZhciBuZXdQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIG9sZFByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0dmFyIGNvbnNvbGlkYXRlZEVtYWlscyA9IFtdO1xuXHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdHZhciBhamF4Rm9ybURhdGEgICAgICAgPSAnJztcblx0dmFyIHRoYXQgICAgICAgICAgICAgICA9ICcnO1xuXG5cdC8vIHN0YXJ0IG91dCB3aXRoIG5vIHByaW1hcnkvcmVtb3ZhbHMgY2hlY2tlZFxuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHQvLyBpZiB0aGVyZSBpcyBhIGxpc3Qgb2YgZW1haWxzIChub3QganVzdCBhIHNpbmdsZSBmb3JtIGZpZWxkKVxuXHRpZiAoIDAgPCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cblx0XHQvLyBpZiBhIHVzZXIgc2VsZWN0cyBhIG5ldyBwcmltYXJ5LCBtb3ZlIGl0IGludG8gdGhhdCBwb3NpdGlvblxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oKSB7XG5cblx0XHRcdG5ld1ByaW1hcnlFbWFpbCA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdG9sZFByaW1hcnlFbWFpbCA9ICQoICcjZW1haWwnICkudmFsKCk7XG5cdFx0XHRwcmltYXJ5SWQgICAgICAgPSAkKCB0aGlzICkucHJvcCggJ2lkJyApLnJlcGxhY2UoICdwcmltYXJ5X2VtYWlsXycsICcnICk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncHJpbWFyeS1jaGFuZ2UnICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlclxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblxuXHRcdFx0Ly8kKCB0aGlzICkucGFyZW50KCkuYWZ0ZXIoIGNvbmZpcm1DaGFuZ2UgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSB1c2VyIGZhY2luZyB2YWx1ZXNcblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG5ld1ByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3VzZXItZW1haWwtJyArIHByaW1hcnlJZCApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgbWFpbiBoaWRkZW4gZm9ybSB2YWx1ZVxuXHRcdFx0XHQkKCAnI2VtYWlsJyApLnZhbCggbmV3UHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gc3VibWl0IGZvcm0gdmFsdWVzLlxuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXG5cdFx0XHRcdC8vIHVuY2hlY2sgdGhlIHJhZGlvIGJ1dHRvblxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBmb3JtIHZhbHVlcyB0byB0aGUgb2xkIHByaW1hcnkgZW1haWxcblx0XHRcdFx0JCggJyNwcmltYXJ5X2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3JlbW92ZV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyByZW1vdmUgdGhlIGNvbmZpcm0gbWVzc2FnZVxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHJlbW92ZXMgYW4gZW1haWwsIHRha2UgaXQgYXdheSBmcm9tIHRoZSB2aXN1YWwgYW5kIGZyb20gdGhlIGZvcm1cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2hhbmdlJywgJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgIT09IGVtYWlsVG9SZW1vdmUgKSB7XG5cdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlciBmb3IgcmVtb3ZhbFxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0Ly8gaWYgY29uZmlybWVkLCByZW1vdmUgdGhlIGVtYWlsIGFuZCBzdWJtaXQgdGhlIGZvcm1cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGknICkuZmFkZU91dCggJ25vcm1hbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cblx0XHRcdFx0Ly9jb25zb2xlLmxvZyggJ3ZhbHVlIGlzICcgKyBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnICkuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvbiBhLWJ1dHRvbi1hZGQtdXNlci1lbWFpbFwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRuZXh0RW1haWxDb3VudCsrO1xuXHR9ICk7XG5cblx0JCggJ2lucHV0W3R5cGU9c3VibWl0XScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGJ1dHRvbiA9ICQoIHRoaXMgKTtcblx0XHR2YXIgYnV0dG9uRm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCAnZm9ybScgKTtcblx0XHRidXR0b25Gb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicsIGJ1dHRvbi52YWwoKSApO1xuXHR9ICk7XG5cblx0JCggJy5tLWVudHJ5LWNvbnRlbnQnICkub24oICdzdWJtaXQnLCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgZm9ybSA9ICQoIHRoaXMgKTtcblx0XHR2YXIgc3VibWl0dGluZ0J1dHRvbiA9IGZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJyApIHx8ICcnO1xuXG5cdFx0Ly8gaWYgdGhlcmUgaXMgbm8gc3VibWl0dGluZyBidXR0b24sIHBhc3MgaXQgYnkgQWpheFxuXHRcdGlmICggJycgPT09IHN1Ym1pdHRpbmdCdXR0b24gfHwgJ1NhdmUgQ2hhbmdlcycgIT09IHN1Ym1pdHRpbmdCdXR0b24gKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheEZvcm1EYXRhID0gZm9ybS5zZXJpYWxpemUoKTsgLy9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheEZvcm1EYXRhID0gYWpheEZvcm1EYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogZnVsbFVybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Qubm9uY2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0ZGF0YTogYWpheEZvcm1EYXRhXG5cdFx0XHR9ICkuZG9uZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5ld0VtYWlscyA9ICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKS5tYXAoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdH0gKS5nZXQoKTtcblx0XHRcdFx0JC5lYWNoKCBuZXdFbWFpbHMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSBuZXh0RW1haWxDb3VudCArIGluZGV4O1xuXHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkuYXBwZW5kKCAnPGxpIGlkPVwidXNlci1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtZW1haWwtcHJlZmVyZW5jZXNcIj48YSBocmVmPVwiL25ld3NsZXR0ZXJzLz9lbWFpbD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCB2YWx1ZSApICsgJ1wiPjxzbWFsbD5FbWFpbCBQcmVmZXJlbmNlczwvc21hbGw+PC9hPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLXJlbW92ZS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwicmVtb3ZlX2VtYWlsWycgKyBuZXh0RW1haWxDb3VudCArICddXCIgaWQ9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5SZW1vdmU8L3NtYWxsPjwvbGFiZWw+PC9saT48L3VsPjwvbGk+JyApO1xuXHRcdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCAkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCgpICsgJywnICsgdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggMCA9PT0gJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIGl0IHdvdWxkIGJlIG5pY2UgdG8gb25seSBsb2FkIHRoZSBmb3JtLCBidXQgdGhlbiBjbGljayBldmVudHMgc3RpbGwgZG9uJ3Qgd29ya1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9ICk7XG59XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICggMCA8ICQoICcubS1mb3JtLWVtYWlsJyApLmxlbmd0aCApIHtcblx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0fVxufSApO1xuIiwiLy8gYmFzZWQgb24gd2hpY2ggYnV0dG9uIHdhcyBjbGlja2VkLCBzZXQgdGhlIHZhbHVlcyBmb3IgdGhlIGFuYWx5dGljcyBldmVudCBhbmQgY3JlYXRlIGl0XG5mdW5jdGlvbiB0cmFja1Nob3dDb21tZW50cyggYWx3YXlzLCBpZCwgY2xpY2tWYWx1ZSApIHtcblx0dmFyIGFjdGlvbiAgICAgICAgICA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlQcmVmaXggPSAnJztcblx0dmFyIGNhdGVnb3J5U3VmZml4ID0gJyc7XG5cdHZhciBwb3NpdGlvbiAgICAgICAgPSAnJztcblx0cG9zaXRpb24gPSBpZC5yZXBsYWNlKCAnYWx3YXlzLXNob3ctY29tbWVudHMtJywgJycgKTtcblx0aWYgKCAnMScgPT09IGNsaWNrVmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09uJztcblx0fSBlbHNlIGlmICggJzAnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPZmYnO1xuXHR9IGVsc2Uge1xuXHRcdGFjdGlvbiA9ICdDbGljayc7XG5cdH1cblx0aWYgKCB0cnVlID09PSBhbHdheXMgKSB7XG5cdFx0Y2F0ZWdvcnlQcmVmaXggPSAnQWx3YXlzICc7XG5cdH1cblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbi5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgcG9zaXRpb24uc2xpY2UoIDEgKTtcblx0XHRjYXRlZ29yeVN1ZmZpeCA9ICcgLSAnICsgcG9zaXRpb247XG5cdH1cblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeVByZWZpeCArICdTaG93IENvbW1lbnRzJyArIGNhdGVnb3J5U3VmZml4LCBhY3Rpb24sIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59XG5cbi8vIHdoZW4gc2hvd2luZyBjb21tZW50cyBvbmNlLCB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1idXR0b24tc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR0cmFja1Nob3dDb21tZW50cyggZmFsc2UsICcnLCAnJyApO1xufSApO1xuXG4vLyBTZXQgdXNlciBtZXRhIHZhbHVlIGZvciBhbHdheXMgc2hvd2luZyBjb21tZW50cyBpZiB0aGF0IGJ1dHRvbiBpcyBjbGlja2VkXG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dmFyIHRoYXQgPSAkKCB0aGlzICk7XG5cdGlmICggdGhhdC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0fSBlbHNlIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHR9XG5cblx0Ly8gdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCB0cnVlLCB0aGF0LmF0dHIoICdpZCcgKSwgdGhhdC52YWwoKSApO1xuXG5cdC8vIHdlIGFscmVhZHkgaGF2ZSBhamF4dXJsIGZyb20gdGhlIHRoZW1lXG5cdCQuYWpheCgge1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHR1cmw6IGFqYXh1cmwsXG5cdFx0ZGF0YToge1xuXHRcdFx0J2FjdGlvbic6ICdtaW5ucG9zdF9sYXJnb19sb2FkX2NvbW1lbnRzX3NldF91c2VyX21ldGEnLFxuXHRcdFx0J3ZhbHVlJzogdGhhdC52YWwoKVxuXHRcdH0sXG5cdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0JCggJy5hLWFsd2F5cy1zaG93LWNvbW1lbnRzLXJlc3VsdCcsIHRoYXQucGFyZW50KCkgKS5odG1sKCByZXNwb25zZS5kYXRhLm1lc3NhZ2UgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gcmVzcG9uc2UuZGF0YS5zaG93ICkge1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAwICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAxICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG59ICk7XG4iLCJ2YXIgdGFyZ2V0ICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWV2ZW50cy1jYWwtbGlua3MnICk7XG5pZiAoIG51bGwgIT09IHRhcmdldCApIHtcbiAgICB2YXIgbGkgICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2xpJyApO1xuICAgIGxpLmlubmVySFRNTCAgPSAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImEtY2xvc2UtYnV0dG9uIGEtY2xvc2UtY2FsZW5kYXJcIj48aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT48L2E+JztcbiAgICB2YXIgZnJhZ21lbnQgID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGxpLnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBsaSApO1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZCggZnJhZ21lbnQgKTtcbn1cblxuY29uc3QgY2FsZW5kYXJUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuICAgIGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1ldmVudHMtY2FsLWxpbmtzJyApLFxuICAgIHZpc2libGVDbGFzczogJ2EtZXZlbnRzLWNhbC1saW5rLXZpc2libGUnLFxuICAgIGRpc3BsYXlWYWx1ZTogJ2Jsb2NrJ1xufSApO1xuXG52YXIgY2FsZW5kYXJWaXNpYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLWV2ZW50LWRhdGV0aW1lIGEnICk7XG5pZiAoIG51bGwgIT09IGNhbGVuZGFyVmlzaWJsZSApIHtcbiAgICBjYWxlbmRhclZpc2libGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBjYWxlbmRhclZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcbiAgICAgICAgY2FsZW5kYXJWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgICAgIGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG4gICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgIHZhciBjYWxlbmRhckNsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLWNhbGVuZGFyJyApO1xuICAgIGNhbGVuZGFyQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBjYWxlbmRhclZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcbiAgICAgICAgY2FsZW5kYXJWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgICAgIGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG4gICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcbiAgICAgICAgfVxuICAgIH0gKTtcbn1cbiJdfQ==
}(jQuery));
