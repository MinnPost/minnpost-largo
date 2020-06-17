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
  var userNavTransitioner = transitionHiddenElement({
    element: document.querySelector('.your-minnpost-account ul'),
    visibleClass: 'is-open',
    displayValue: 'flex'
  });
  var userNavToggle = document.querySelector('.your-minnpost-account > a');
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
  var target = document.querySelector('nav .m-form-search fieldset .a-button-sentence');
  var div = document.createElement('div');
  div.innerHTML = '<a href="#" class="a-close-search"><i class="fas fa-times"></i></a>';
  var fragment = document.createDocumentFragment();
  div.setAttribute('class', 'a-close-holder');
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
    var expanded = 'true' === searchVisible.getAttribute('aria-expanded') || false;
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
    var expanded = 'true' === searchVisible.getAttribute('aria-expanded') || false;
    searchVisible.setAttribute('aria-expanded', !expanded);

    if (true === expanded) {
      searchTransitioner.transitionHide();
    } else {
      searchTransitioner.transitionShow();
    }
  }); // escape key press

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
setupScrollNav('.m-sub-navigation', '.m-subnav-navigation', '.m-menu-sub-navigation');
setupScrollNav('.m-pagination-navigation', '.m-pagination-container', '.m-pagination-list');
$('#navigation-featured a').click(function () {
  mpAnalyticsTrackingEvent('event', 'Featured Bar Link', 'Click', this.href);
});
$('a.glean-sidebar').click(function () {
  mpAnalyticsTrackingEvent('event', 'Sidebar Support Link', 'Click', this.href);
});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDAtc3RhcnQuanMiLCIwMS1mb250cy5qcyIsIjAyLWFuYWx5dGljcy5qcyIsIjAzLXNoYXJlLmpzIiwiMDQtbmF2aWdhdGlvbi5qcyIsIjA1LWZvcm1zLmpzIiwiMDYtY29tbWVudHMuanMiXSwibmFtZXMiOlsidGxpdGUiLCJ0IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImkiLCJ0YXJnZXQiLCJuIiwicGFyZW50RWxlbWVudCIsInNob3ciLCJ0b29sdGlwIiwibyIsImhpZGUiLCJsIiwiciIsImNsYXNzTmFtZSIsInMiLCJvZmZzZXRUb3AiLCJvZmZzZXRMZWZ0Iiwib2Zmc2V0UGFyZW50Iiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJkIiwiZiIsImEiLCJzdHlsZSIsInRvcCIsImxlZnQiLCJjcmVhdGVFbGVtZW50IiwiZ3JhdiIsImdldEF0dHJpYnV0ZSIsImlubmVySFRNTCIsImFwcGVuZENoaWxkIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiYm90dG9tIiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJyaWdodCIsImlubmVyV2lkdGgiLCJ0aXRsZSIsInNldEF0dHJpYnV0ZSIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJtb2R1bGUiLCJleHBvcnRzIiwidHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQiLCJlbGVtZW50IiwidmlzaWJsZUNsYXNzIiwid2FpdE1vZGUiLCJ0aW1lb3V0RHVyYXRpb24iLCJoaWRlTW9kZSIsImRpc3BsYXlWYWx1ZSIsImNvbnNvbGUiLCJlcnJvciIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwibGlzdGVuZXIiLCJhcHBseUhpZGRlbkF0dHJpYnV0ZXMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzcGxheSIsInJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMiLCJyZW1vdmVBdHRyaWJ1dGUiLCJ0cmFuc2l0aW9uU2hvdyIsInRpbWVvdXQiLCJyZWZsb3ciLCJjbGFzc0xpc3QiLCJhZGQiLCJ0cmFuc2l0aW9uSGlkZSIsInJlbW92ZSIsInRvZ2dsZSIsImlzSGlkZGVuIiwiaGFzSGlkZGVuQXR0cmlidXRlIiwiaXNEaXNwbGF5Tm9uZSIsImhhc1Zpc2libGVDbGFzcyIsImluY2x1ZGVzIiwiUHJpb3JpdHlOYXZTY3JvbGxlciIsInNlbGVjdG9yIiwibmF2U2VsZWN0b3IiLCJjb250ZW50U2VsZWN0b3IiLCJpdGVtU2VsZWN0b3IiLCJidXR0b25MZWZ0U2VsZWN0b3IiLCJidXR0b25SaWdodFNlbGVjdG9yIiwic2Nyb2xsU3RlcCIsIm5hdlNjcm9sbGVyIiwicXVlcnlTZWxlY3RvciIsInZhbGlkYXRlU2Nyb2xsU3RlcCIsIk51bWJlciIsImlzSW50ZWdlciIsInVuZGVmaW5lZCIsIkVycm9yIiwibmF2U2Nyb2xsZXJOYXYiLCJuYXZTY3JvbGxlckNvbnRlbnQiLCJuYXZTY3JvbGxlckNvbnRlbnRJdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJuYXZTY3JvbGxlckxlZnQiLCJuYXZTY3JvbGxlclJpZ2h0Iiwic2Nyb2xsaW5nIiwic2Nyb2xsQXZhaWxhYmxlTGVmdCIsInNjcm9sbEF2YWlsYWJsZVJpZ2h0Iiwic2Nyb2xsaW5nRGlyZWN0aW9uIiwic2Nyb2xsT3ZlcmZsb3ciLCJzZXRPdmVyZmxvdyIsImdldE92ZXJmbG93IiwidG9nZ2xlQnV0dG9ucyIsImNhbGN1bGF0ZVNjcm9sbFN0ZXAiLCJyZXF1ZXN0U2V0T3ZlcmZsb3ciLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInNjcm9sbFdpZHRoIiwic2Nyb2xsVmlld3BvcnQiLCJjbGllbnRXaWR0aCIsInNjcm9sbExlZnQiLCJzY3JvbGxMZWZ0Q29uZGl0aW9uIiwic2Nyb2xsUmlnaHRDb25kaXRpb24iLCJzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyIsInBhcnNlSW50IiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImdldFByb3BlcnR5VmFsdWUiLCJzY3JvbGxTdGVwQXZlcmFnZSIsIk1hdGgiLCJmbG9vciIsImxlbmd0aCIsIm1vdmVTY3JvbGxlciIsImRpcmVjdGlvbiIsInNjcm9sbERpc3RhbmNlIiwic2Nyb2xsQXZhaWxhYmxlIiwidHJhbnNmb3JtIiwic2V0U2Nyb2xsZXJQb3NpdGlvbiIsInRyYW5zZm9ybVZhbHVlIiwiYWJzIiwic3BsaXQiLCJvdmVyZmxvdyIsImluaXQiLCIkIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsInNlc3Npb25TdG9yYWdlIiwic2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsInNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsImRvY3VtZW50RWxlbWVudCIsImciLCJwdXNoIiwibSIsInNoaWZ0IiwicCIsImIiLCJxIiwiYyIsInUiLCJUeXBlRXJyb3IiLCJ0aGVuIiwiY2FsbCIsInYiLCJoIiwicHJvdG90eXBlIiwidyIsImsiLCJ4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyYWNlIiwiYWxsIiwiY2F0Y2giLCJhdHRhY2hFdmVudCIsImJvZHkiLCJyZWFkeVN0YXRlIiwiZGV0YWNoRXZlbnQiLCJjcmVhdGVUZXh0Tm9kZSIsImNzc1RleHQiLCJ6Iiwid2lkdGgiLCJBIiwiQiIsImZhbWlseSIsIndlaWdodCIsInN0cmV0Y2giLCJDIiwiRCIsIkUiLCJGIiwiRyIsIkoiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidmVuZG9yIiwiZXhlYyIsInVzZXJBZ2VudCIsImZvbnRzIiwiSyIsImZvbnQiLCJMIiwiam9pbiIsImxvYWQiLCJIIiwiRGF0ZSIsImdldFRpbWUiLCJNIiwiTiIsInkiLCJJIiwiaGlkZGVuIiwiZGlyIiwiRm9udEZhY2VPYnNlcnZlciIsInNhbnNOb3JtYWwiLCJzYW5zQm9sZCIsInNhbnNOb3JtYWxJdGFsaWMiLCJzZXJpZkJvb2siLCJzZXJpZkJvb2tJdGFsaWMiLCJzZXJpZkJvbGQiLCJzZXJpZkJvbGRJdGFsaWMiLCJzZXJpZkJsYWNrIiwic2VyaWZCbGFja0l0YWxpYyIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsInR5cGUiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwidmFsdWUiLCJnYSIsInJlYWR5IiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsImpRdWVyeSIsImhhc0NsYXNzIiwiY29weUN1cnJlbnRVUkwiLCJkdW1teSIsImhyZWYiLCJzZWxlY3QiLCJleGVjQ29tbWFuZCIsImNsaWNrIiwiZGF0YSIsInByZXZlbnREZWZhdWx0IiwicHJpbnQiLCJ1cmwiLCJhdHRyIiwib3BlbiIsInNldHVwUHJpbWFyeU5hdiIsInByaW1hcnlOYXZUcmFuc2l0aW9uZXIiLCJwcmltYXJ5TmF2VG9nZ2xlIiwiZXhwYW5kZWQiLCJ1c2VyTmF2VHJhbnNpdGlvbmVyIiwidXNlck5hdlRvZ2dsZSIsImRpdiIsImZyYWdtZW50IiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsInNlYXJjaFRyYW5zaXRpb25lciIsInNlYXJjaFZpc2libGUiLCJzZWFyY2hDbG9zZSIsImtleXVwIiwia2V5Q29kZSIsInByaW1hcnlOYXZFeHBhbmRlZCIsInVzZXJOYXZFeHBhbmRlZCIsInNlYXJjaElzVmlzaWJsZSIsInNldHVwU2Nyb2xsTmF2IiwicHJpb3JpdHlOYXZTY3JvbGxlckRlZmF1bHQiLCJ3aWRnZXRUaXRsZSIsImNsb3Nlc3QiLCJmaW5kIiwiem9uZVRpdGxlIiwic2lkZWJhclNlY3Rpb25UaXRsZSIsImZuIiwidGV4dE5vZGVzIiwiY29udGVudHMiLCJmaWx0ZXIiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJub2RlVmFsdWUiLCJ0cmltIiwiZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCIsIm1hcmt1cCIsIm1hbmFnZUVtYWlscyIsImZvcm0iLCJyZXN0Um9vdCIsInVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QiLCJzaXRlX3VybCIsInJlc3RfbmFtZXNwYWNlIiwiZnVsbFVybCIsImNvbmZpcm1DaGFuZ2UiLCJuZXh0RW1haWxDb3VudCIsIm5ld1ByaW1hcnlFbWFpbCIsIm9sZFByaW1hcnlFbWFpbCIsInByaW1hcnlJZCIsImVtYWlsVG9SZW1vdmUiLCJjb25zb2xpZGF0ZWRFbWFpbHMiLCJuZXdFbWFpbHMiLCJhamF4Rm9ybURhdGEiLCJ0aGF0IiwicHJvcCIsIm9uIiwidmFsIiwicmVwbGFjZSIsInBhcmVudCIsImFwcGVuZCIsImV2ZW50IiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJnZXQiLCJwYXJlbnRzIiwiZmFkZU91dCIsImJlZm9yZSIsImJ1dHRvbiIsImJ1dHRvbkZvcm0iLCJzdWJtaXR0aW5nQnV0dG9uIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRvbmUiLCJtYXAiLCJpbmRleCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiaWQiLCJjbGlja1ZhbHVlIiwiY2F0ZWdvcnlQcmVmaXgiLCJjYXRlZ29yeVN1ZmZpeCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJpcyIsImFqYXh1cmwiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJodG1sIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxLQUFULENBQWVDLENBQWYsRUFBaUI7QUFBQ0MsRUFBQUEsUUFBUSxDQUFDQyxnQkFBVCxDQUEwQixXQUExQixFQUFzQyxVQUFTQyxDQUFULEVBQVc7QUFBQyxRQUFJQyxDQUFDLEdBQUNELENBQUMsQ0FBQ0Us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QUQsQ0FBd0NtSyxJQUF4QyxDQUE4QyxTQUE5QyxFQUF5RCxLQUF6RDtBQUNBLEdBTndFLENBUXpFOzs7QUFDQThCLEVBQUFBLGlCQUFpQixDQUFFLElBQUYsRUFBUS9CLElBQUksQ0FBQ3JELElBQUwsQ0FBVyxJQUFYLENBQVIsRUFBMkJxRCxJQUFJLENBQUNHLEdBQUwsRUFBM0IsQ0FBakIsQ0FUeUUsQ0FXekU7O0FBQ0FySyxFQUFBQSxDQUFDLENBQUNzTCxJQUFGLENBQVE7QUFDUHJHLElBQUFBLElBQUksRUFBRSxNQURDO0FBRVAyQixJQUFBQSxHQUFHLEVBQUUrRixPQUZFO0FBR1BsRyxJQUFBQSxJQUFJLEVBQUU7QUFDTCxnQkFBVSw0Q0FETDtBQUVMLGVBQVN5RCxJQUFJLENBQUNHLEdBQUw7QUFGSixLQUhDO0FBT1B1QyxJQUFBQSxPQUFPLEVBQUUsaUJBQVVDLFFBQVYsRUFBcUI7QUFDN0I3TSxNQUFBQSxDQUFDLENBQUUsZ0NBQUYsRUFBb0NrSyxJQUFJLENBQUNLLE1BQUwsRUFBcEMsQ0FBRCxDQUFxRHVDLElBQXJELENBQTJERCxRQUFRLENBQUNwRyxJQUFULENBQWNzRyxPQUF6RTs7QUFDQSxVQUFLLFNBQVNGLFFBQVEsQ0FBQ3BHLElBQVQsQ0FBY3ZPLElBQTVCLEVBQW1DO0FBQ2xDOEgsUUFBQUEsQ0FBQyxDQUFFLGtDQUFGLENBQUQsQ0FBd0NxSyxHQUF4QyxDQUE2QyxDQUE3QztBQUNBLE9BRkQsTUFFTztBQUNOckssUUFBQUEsQ0FBQyxDQUFFLGtDQUFGLENBQUQsQ0FBd0NxSyxHQUF4QyxDQUE2QyxDQUE3QztBQUNBO0FBQ0Q7QUFkTSxHQUFSO0FBZ0JBLENBNUJEIiwiZmlsZSI6Im1pbm5wb3N0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gdGxpdGUodCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLGZ1bmN0aW9uKGUpe3ZhciBpPWUudGFyZ2V0LG49dChpKTtufHwobj0oaT1pLnBhcmVudEVsZW1lbnQpJiZ0KGkpKSxuJiZ0bGl0ZS5zaG93KGksbiwhMCl9KX10bGl0ZS5zaG93PWZ1bmN0aW9uKHQsZSxpKXt2YXIgbj1cImRhdGEtdGxpdGVcIjtlPWV8fHt9LCh0LnRvb2x0aXB8fGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gbygpe3RsaXRlLmhpZGUodCwhMCl9ZnVuY3Rpb24gbCgpe3J8fChyPWZ1bmN0aW9uKHQsZSxpKXtmdW5jdGlvbiBuKCl7by5jbGFzc05hbWU9XCJ0bGl0ZSB0bGl0ZS1cIityK3M7dmFyIGU9dC5vZmZzZXRUb3AsaT10Lm9mZnNldExlZnQ7by5vZmZzZXRQYXJlbnQ9PT10JiYoZT1pPTApO3ZhciBuPXQub2Zmc2V0V2lkdGgsbD10Lm9mZnNldEhlaWdodCxkPW8ub2Zmc2V0SGVpZ2h0LGY9by5vZmZzZXRXaWR0aCxhPWkrbi8yO28uc3R5bGUudG9wPShcInNcIj09PXI/ZS1kLTEwOlwiblwiPT09cj9lK2wrMTA6ZStsLzItZC8yKStcInB4XCIsby5zdHlsZS5sZWZ0PShcIndcIj09PXM/aTpcImVcIj09PXM/aStuLWY6XCJ3XCI9PT1yP2krbisxMDpcImVcIj09PXI/aS1mLTEwOmEtZi8yKStcInB4XCJ9dmFyIG89ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksbD1pLmdyYXZ8fHQuZ2V0QXR0cmlidXRlKFwiZGF0YS10bGl0ZVwiKXx8XCJuXCI7by5pbm5lckhUTUw9ZSx0LmFwcGVuZENoaWxkKG8pO3ZhciByPWxbMF18fFwiXCIscz1sWzFdfHxcIlwiO24oKTt2YXIgZD1vLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVyblwic1wiPT09ciYmZC50b3A8MD8ocj1cIm5cIixuKCkpOlwiblwiPT09ciYmZC5ib3R0b20+d2luZG93LmlubmVySGVpZ2h0PyhyPVwic1wiLG4oKSk6XCJlXCI9PT1yJiZkLmxlZnQ8MD8ocj1cIndcIixuKCkpOlwid1wiPT09ciYmZC5yaWdodD53aW5kb3cuaW5uZXJXaWR0aCYmKHI9XCJlXCIsbigpKSxvLmNsYXNzTmFtZSs9XCIgdGxpdGUtdmlzaWJsZVwiLG99KHQsZCxlKSl9dmFyIHIscyxkO3JldHVybiB0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixvKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsbyksdC50b29sdGlwPXtzaG93OmZ1bmN0aW9uKCl7ZD10LnRpdGxlfHx0LmdldEF0dHJpYnV0ZShuKXx8ZCx0LnRpdGxlPVwiXCIsdC5zZXRBdHRyaWJ1dGUobixcIlwiKSxkJiYhcyYmKHM9c2V0VGltZW91dChsLGk/MTUwOjEpKX0saGlkZTpmdW5jdGlvbih0KXtpZihpPT09dCl7cz1jbGVhclRpbWVvdXQocyk7dmFyIGU9ciYmci5wYXJlbnROb2RlO2UmJmUucmVtb3ZlQ2hpbGQocikscj12b2lkIDB9fX19KHQsZSkpLnNob3coKX0sdGxpdGUuaGlkZT1mdW5jdGlvbih0LGUpe3QudG9vbHRpcCYmdC50b29sdGlwLmhpZGUoZSl9LFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9dGxpdGUpOyIsIi8qKiBcbiAqIExpYnJhcnkgY29kZVxuICogVXNpbmcgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvQGNsb3VkZm91ci90cmFuc2l0aW9uLWhpZGRlbi1lbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoe1xuICBlbGVtZW50LFxuICB2aXNpYmxlQ2xhc3MsXG4gIHdhaXRNb2RlID0gJ3RyYW5zaXRpb25lbmQnLFxuICB0aW1lb3V0RHVyYXRpb24sXG4gIGhpZGVNb2RlID0gJ2hpZGRlbicsXG4gIGRpc3BsYXlWYWx1ZSA9ICdibG9jaydcbn0pIHtcbiAgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcgJiYgdHlwZW9mIHRpbWVvdXREdXJhdGlvbiAhPT0gJ251bWJlcicpIHtcbiAgICBjb25zb2xlLmVycm9yKGBcbiAgICAgIFdoZW4gY2FsbGluZyB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCB3aXRoIHdhaXRNb2RlIHNldCB0byB0aW1lb3V0LFxuICAgICAgeW91IG11c3QgcGFzcyBpbiBhIG51bWJlciBmb3IgdGltZW91dER1cmF0aW9uLlxuICAgIGApO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRG9uJ3Qgd2FpdCBmb3IgZXhpdCB0cmFuc2l0aW9ucyBpZiBhIHVzZXIgcHJlZmVycyByZWR1Y2VkIG1vdGlvbi5cbiAgLy8gSWRlYWxseSB0cmFuc2l0aW9ucyB3aWxsIGJlIGRpc2FibGVkIGluIENTUywgd2hpY2ggbWVhbnMgd2Ugc2hvdWxkIG5vdCB3YWl0XG4gIC8vIGJlZm9yZSBhZGRpbmcgYGhpZGRlbmAuXG4gIGlmICh3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKS5tYXRjaGVzKSB7XG4gICAgd2FpdE1vZGUgPSAnaW1tZWRpYXRlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBldmVudCBsaXN0ZW5lciB0byBhZGQgYGhpZGRlbmAgYWZ0ZXIgb3VyIGFuaW1hdGlvbnMgY29tcGxldGUuXG4gICAqIFRoaXMgbGlzdGVuZXIgd2lsbCByZW1vdmUgaXRzZWxmIGFmdGVyIGNvbXBsZXRpbmcuXG4gICAqL1xuICBjb25zdCBsaXN0ZW5lciA9IGUgPT4ge1xuICAgIC8vIENvbmZpcm0gYHRyYW5zaXRpb25lbmRgIHdhcyBjYWxsZWQgb24gIG91ciBgZWxlbWVudGAgYW5kIGRpZG4ndCBidWJibGVcbiAgICAvLyB1cCBmcm9tIGEgY2hpbGQgZWxlbWVudC5cbiAgICBpZiAoZS50YXJnZXQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFwcGx5SGlkZGVuQXR0cmlidXRlcyA9ICgpID0+IHtcbiAgICBpZihoaWRlTW9kZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogU2hvdyB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25TaG93KCkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGlzIGxpc3RlbmVyIHNob3VsZG4ndCBiZSBoZXJlIGJ1dCBpZiBzb21lb25lIHNwYW1zIHRoZSB0b2dnbGVcbiAgICAgICAqIG92ZXIgYW5kIG92ZXIgcmVhbGx5IGZhc3QgaXQgY2FuIGluY29ycmVjdGx5IHN0aWNrIGFyb3VuZC5cbiAgICAgICAqIFdlIHJlbW92ZSBpdCBqdXN0IHRvIGJlIHNhZmUuXG4gICAgICAgKi9cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBTaW1pbGFybHksIHdlJ2xsIGNsZWFyIHRoZSB0aW1lb3V0IGluIGNhc2UgaXQncyBzdGlsbCBoYW5naW5nIGFyb3VuZC5cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgIH1cblxuICAgICAgcmVtb3ZlSGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICAvKipcbiAgICAgICAqIEZvcmNlIGEgYnJvd3NlciByZS1wYWludCBzbyB0aGUgYnJvd3NlciB3aWxsIHJlYWxpemUgdGhlXG4gICAgICAgKiBlbGVtZW50IGlzIG5vIGxvbmdlciBgaGlkZGVuYCBhbmQgYWxsb3cgdHJhbnNpdGlvbnMuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHJlZmxvdyA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSGlkZSB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25IaWRlKCkge1xuICAgICAgaWYgKHdhaXRNb2RlID09PSAndHJhbnNpdGlvbmVuZCcpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuICAgICAgfSBlbHNlIGlmICh3YWl0TW9kZSA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuICAgICAgICB9LCB0aW1lb3V0RHVyYXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCB0aGlzIGNsYXNzIHRvIHRyaWdnZXIgb3VyIGFuaW1hdGlvblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHZpc2libGVDbGFzcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZSB0aGUgZWxlbWVudCdzIHZpc2liaWxpdHlcbiAgICAgKi9cbiAgICB0b2dnbGUoKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbigpKSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvblNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGVsbCB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIGhpZGRlbiBvciBub3QuXG4gICAgICovXG4gICAgaXNIaWRkZW4oKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBoaWRkZW4gYXR0cmlidXRlIGRvZXMgbm90IHJlcXVpcmUgYSB2YWx1ZS4gU2luY2UgYW4gZW1wdHkgc3RyaW5nIGlzXG4gICAgICAgKiBmYWxzeSwgYnV0IHNob3dzIHRoZSBwcmVzZW5jZSBvZiBhbiBhdHRyaWJ1dGUgd2UgY29tcGFyZSB0byBgbnVsbGBcbiAgICAgICAqL1xuICAgICAgY29uc3QgaGFzSGlkZGVuQXR0cmlidXRlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hpZGRlbicpICE9PSBudWxsO1xuXG4gICAgICBjb25zdCBpc0Rpc3BsYXlOb25lID0gZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZSc7XG5cbiAgICAgIGNvbnN0IGhhc1Zpc2libGVDbGFzcyA9IFsuLi5lbGVtZW50LmNsYXNzTGlzdF0uaW5jbHVkZXModmlzaWJsZUNsYXNzKTtcblxuICAgICAgcmV0dXJuIGhhc0hpZGRlbkF0dHJpYnV0ZSB8fCBpc0Rpc3BsYXlOb25lIHx8ICFoYXNWaXNpYmxlQ2xhc3M7XG4gICAgfSxcblxuICAgIC8vIEEgcGxhY2Vob2xkZXIgZm9yIG91ciBgdGltZW91dGBcbiAgICB0aW1lb3V0OiBudWxsXG4gIH07XG59IiwiLyoqXG4gIFByaW9yaXR5KyBob3Jpem9udGFsIHNjcm9sbGluZyBtZW51LlxuXG4gIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgLSBDb250YWluZXIgZm9yIGFsbCBvcHRpb25zLlxuICAgIEBwYXJhbSB7c3RyaW5nIHx8IERPTSBub2RlfSBzZWxlY3RvciAtIEVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IG5hdlNlbGVjdG9yIC0gTmF2IGVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRTZWxlY3RvciAtIENvbnRlbnQgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gaXRlbVNlbGVjdG9yIC0gSXRlbXMgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvbkxlZnRTZWxlY3RvciAtIExlZnQgYnV0dG9uIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBidXR0b25SaWdodFNlbGVjdG9yIC0gUmlnaHQgYnV0dG9uIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7aW50ZWdlciB8fCBzdHJpbmd9IHNjcm9sbFN0ZXAgLSBBbW91bnQgdG8gc2Nyb2xsIG9uIGJ1dHRvbiBjbGljay4gJ2F2ZXJhZ2UnIGdldHMgdGhlIGF2ZXJhZ2UgbGluayB3aWR0aC5cbiovXG5cbmNvbnN0IFByaW9yaXR5TmF2U2Nyb2xsZXIgPSBmdW5jdGlvbih7XG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXInLFxuICAgIG5hdlNlbGVjdG9yOiBuYXZTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLW5hdicsXG4gICAgY29udGVudFNlbGVjdG9yOiBjb250ZW50U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1jb250ZW50JyxcbiAgICBpdGVtU2VsZWN0b3I6IGl0ZW1TZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWl0ZW0nLFxuICAgIGJ1dHRvbkxlZnRTZWxlY3RvcjogYnV0dG9uTGVmdFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0JyxcbiAgICBidXR0b25SaWdodFNlbGVjdG9yOiBidXR0b25SaWdodFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItYnRuLS1yaWdodCcsXG4gICAgc2Nyb2xsU3RlcDogc2Nyb2xsU3RlcCA9IDgwXG4gIH0gPSB7fSkge1xuXG4gIGNvbnN0IG5hdlNjcm9sbGVyID0gdHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIDogc2VsZWN0b3I7XG5cbiAgY29uc3QgdmFsaWRhdGVTY3JvbGxTdGVwID0gKCkgPT4ge1xuICAgIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKHNjcm9sbFN0ZXApIHx8IHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJztcbiAgfVxuXG4gIGlmIChuYXZTY3JvbGxlciA9PT0gdW5kZWZpbmVkIHx8IG5hdlNjcm9sbGVyID09PSBudWxsIHx8ICF2YWxpZGF0ZVNjcm9sbFN0ZXAoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgc29tZXRoaW5nIHdyb25nLCBjaGVjayB5b3VyIG9wdGlvbnMuJyk7XG4gIH1cblxuICBjb25zdCBuYXZTY3JvbGxlck5hdiA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IobmF2U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckNvbnRlbnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGNvbnRlbnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zID0gbmF2U2Nyb2xsZXJDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoaXRlbVNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJMZWZ0ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihidXR0b25MZWZ0U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlclJpZ2h0ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihidXR0b25SaWdodFNlbGVjdG9yKTtcblxuICBsZXQgc2Nyb2xsaW5nID0gZmFsc2U7XG4gIGxldCBzY3JvbGxBdmFpbGFibGVMZWZ0ID0gMDtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID0gMDtcbiAgbGV0IHNjcm9sbGluZ0RpcmVjdGlvbiA9ICcnO1xuICBsZXQgc2Nyb2xsT3ZlcmZsb3cgPSAnJztcbiAgbGV0IHRpbWVvdXQ7XG5cblxuICAvLyBTZXRzIG92ZXJmbG93IGFuZCB0b2dnbGUgYnV0dG9ucyBhY2NvcmRpbmdseVxuICBjb25zdCBzZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIHNjcm9sbE92ZXJmbG93ID0gZ2V0T3ZlcmZsb3coKTtcbiAgICB0b2dnbGVCdXR0b25zKHNjcm9sbE92ZXJmbG93KTtcbiAgICBjYWxjdWxhdGVTY3JvbGxTdGVwKCk7XG4gIH1cblxuXG4gIC8vIERlYm91bmNlIHNldHRpbmcgdGhlIG92ZXJmbG93IHdpdGggcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIGNvbnN0IHJlcXVlc3RTZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aW1lb3V0KSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGltZW91dCk7XG5cbiAgICB0aW1lb3V0ID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBzZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuICB9XG5cblxuICAvLyBHZXRzIHRoZSBvdmVyZmxvdyBhdmFpbGFibGUgb24gdGhlIG5hdiBzY3JvbGxlclxuICBjb25zdCBnZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzY3JvbGxXaWR0aCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbFdpZHRoO1xuICAgIGxldCBzY3JvbGxWaWV3cG9ydCA9IG5hdlNjcm9sbGVyTmF2LmNsaWVudFdpZHRoO1xuICAgIGxldCBzY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdDtcblxuICAgIHNjcm9sbEF2YWlsYWJsZUxlZnQgPSBzY3JvbGxMZWZ0O1xuICAgIHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID0gc2Nyb2xsV2lkdGggLSAoc2Nyb2xsVmlld3BvcnQgKyBzY3JvbGxMZWZ0KTtcblxuICAgIC8vIDEgaW5zdGVhZCBvZiAwIHRvIGNvbXBlbnNhdGUgZm9yIG51bWJlciByb3VuZGluZ1xuICAgIGxldCBzY3JvbGxMZWZ0Q29uZGl0aW9uID0gc2Nyb2xsQXZhaWxhYmxlTGVmdCA+IDE7XG4gICAgbGV0IHNjcm9sbFJpZ2h0Q29uZGl0aW9uID0gc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPiAxO1xuXG4gICAgLy8gY29uc29sZS5sb2coc2Nyb2xsV2lkdGgsIHNjcm9sbFZpZXdwb3J0LCBzY3JvbGxBdmFpbGFibGVMZWZ0LCBzY3JvbGxBdmFpbGFibGVSaWdodCk7XG5cbiAgICBpZiAoc2Nyb2xsTGVmdENvbmRpdGlvbiAmJiBzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdib3RoJztcbiAgICB9XG4gICAgZWxzZSBpZiAoc2Nyb2xsTGVmdENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdsZWZ0JztcbiAgICB9XG4gICAgZWxzZSBpZiAoc2Nyb2xsUmlnaHRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAncmlnaHQnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiAnbm9uZSc7XG4gICAgfVxuXG4gIH1cblxuXG4gIC8vIENhbGN1bGF0ZXMgdGhlIHNjcm9sbCBzdGVwIGJhc2VkIG9uIHRoZSB3aWR0aCBvZiB0aGUgc2Nyb2xsZXIgYW5kIHRoZSBudW1iZXIgb2YgbGlua3NcbiAgY29uc3QgY2FsY3VsYXRlU2Nyb2xsU3RlcCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzY3JvbGxTdGVwID09PSAnYXZlcmFnZScpIHtcbiAgICAgIGxldCBzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbFdpZHRoIC0gKHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWxlZnQnKSkgKyBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1yaWdodCcpKSk7XG5cbiAgICAgIGxldCBzY3JvbGxTdGVwQXZlcmFnZSA9IE1hdGguZmxvb3Ioc2Nyb2xsVmlld3BvcnROb1BhZGRpbmcgLyBuYXZTY3JvbGxlckNvbnRlbnRJdGVtcy5sZW5ndGgpO1xuXG4gICAgICBzY3JvbGxTdGVwID0gc2Nyb2xsU3RlcEF2ZXJhZ2U7XG4gICAgfVxuICB9XG5cblxuICAvLyBNb3ZlIHRoZSBzY3JvbGxlciB3aXRoIGEgdHJhbnNmb3JtXG4gIGNvbnN0IG1vdmVTY3JvbGxlciA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuXG4gICAgaWYgKHNjcm9sbGluZyA9PT0gdHJ1ZSB8fCAoc2Nyb2xsT3ZlcmZsb3cgIT09IGRpcmVjdGlvbiAmJiBzY3JvbGxPdmVyZmxvdyAhPT0gJ2JvdGgnKSkgcmV0dXJuO1xuXG4gICAgbGV0IHNjcm9sbERpc3RhbmNlID0gc2Nyb2xsU3RlcDtcbiAgICBsZXQgc2Nyb2xsQXZhaWxhYmxlID0gZGlyZWN0aW9uID09PSAnbGVmdCcgPyBzY3JvbGxBdmFpbGFibGVMZWZ0IDogc2Nyb2xsQXZhaWxhYmxlUmlnaHQ7XG5cbiAgICAvLyBJZiB0aGVyZSB3aWxsIGJlIGxlc3MgdGhhbiAyNSUgb2YgdGhlIGxhc3Qgc3RlcCB2aXNpYmxlIHRoZW4gc2Nyb2xsIHRvIHRoZSBlbmRcbiAgICBpZiAoc2Nyb2xsQXZhaWxhYmxlIDwgKHNjcm9sbFN0ZXAgKiAxLjc1KSkge1xuICAgICAgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxBdmFpbGFibGU7XG4gICAgfVxuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgc2Nyb2xsRGlzdGFuY2UgKj0gLTE7XG5cbiAgICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCBzY3JvbGxTdGVwKSB7XG4gICAgICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QuYWRkKCdzbmFwLWFsaWduLWVuZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJyk7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKCcgKyBzY3JvbGxEaXN0YW5jZSArICdweCknO1xuXG4gICAgc2Nyb2xsaW5nRGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHNjcm9sbGluZyA9IHRydWU7XG4gIH1cblxuXG4gIC8vIFNldCB0aGUgc2Nyb2xsZXIgcG9zaXRpb24gYW5kIHJlbW92ZXMgdHJhbnNmb3JtLCBjYWxsZWQgYWZ0ZXIgbW92ZVNjcm9sbGVyKCkgaW4gdGhlIHRyYW5zaXRpb25lbmQgZXZlbnRcbiAgY29uc3Qgc2V0U2Nyb2xsZXJQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCwgbnVsbCk7XG4gICAgdmFyIHRyYW5zZm9ybSA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3RyYW5zZm9ybScpO1xuICAgIHZhciB0cmFuc2Zvcm1WYWx1ZSA9IE1hdGguYWJzKHBhcnNlSW50KHRyYW5zZm9ybS5zcGxpdCgnLCcpWzRdKSB8fCAwKTtcblxuICAgIGlmIChzY3JvbGxpbmdEaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuICAgICAgdHJhbnNmb3JtVmFsdWUgKj0gLTE7XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJyc7XG4gICAgbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQgKyB0cmFuc2Zvcm1WYWx1ZTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnbm8tdHJhbnNpdGlvbicsICdzbmFwLWFsaWduLWVuZCcpO1xuXG4gICAgc2Nyb2xsaW5nID0gZmFsc2U7XG4gIH1cblxuXG4gIC8vIFRvZ2dsZSBidXR0b25zIGRlcGVuZGluZyBvbiBvdmVyZmxvd1xuICBjb25zdCB0b2dnbGVCdXR0b25zID0gZnVuY3Rpb24ob3ZlcmZsb3cpIHtcbiAgICBpZiAob3ZlcmZsb3cgPT09ICdib3RoJyB8fCBvdmVyZmxvdyA9PT0gJ2xlZnQnKSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJMZWZ0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cblxuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAncmlnaHQnKSB7XG4gICAgICBuYXZTY3JvbGxlclJpZ2h0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuICB9XG5cblxuICBjb25zdCBpbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICBzZXRPdmVyZmxvdygpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHJlcXVlc3RTZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJOYXYuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsICgpID0+IHtcbiAgICAgIHNldFNjcm9sbGVyUG9zaXRpb24oKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyTGVmdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1vdmVTY3JvbGxlcignbGVmdCcpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJSaWdodC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1vdmVTY3JvbGxlcigncmlnaHQnKTtcbiAgICB9KTtcblxuICB9O1xuXG5cbiAgLy8gU2VsZiBpbml0XG4gIGluaXQoKTtcblxuXG4gIC8vIFJldmVhbCBBUElcbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG5cbn07XG5cbi8vZXhwb3J0IGRlZmF1bHQgUHJpb3JpdHlOYXZTY3JvbGxlcjtcbiIsIiQoICdodG1sJyApLnJlbW92ZUNsYXNzKCAnbm8tanMnICkuYWRkQ2xhc3MoICdqcycgKTtcbiIsIi8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5pZiAoIHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgJiYgc2Vzc2lvblN0b3JhZ2Uuc2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsICkge1xuXHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkIHNhbnMtZm9udHMtbG9hZGVkJztcbn0gZWxzZSB7XG5cdC8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4xLjAgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oIGZ1bmN0aW9uKCkge1xuXHRcdCd1c2Ugc3RyaWN0Jzt2YXIgZixcblx0XHRcdGcgPSBbXTtmdW5jdGlvbiBsKCBhICkge1xuXHRcdFx0Zy5wdXNoKCBhICk7MSA9PSBnLmxlbmd0aCAmJiBmKCk7XG5cdFx0fSBmdW5jdGlvbiBtKCkge1xuXHRcdFx0Zm9yICggO2cubGVuZ3RoOyApIHtcblx0XHRcdFx0Z1swXSgpLCBnLnNoaWZ0KCk7XG5cdFx0XHR9XG5cdFx0fWYgPSBmdW5jdGlvbigpIHtcblx0XHRcdHNldFRpbWVvdXQoIG0gKTtcblx0XHR9O2Z1bmN0aW9uIG4oIGEgKSB7XG5cdFx0XHR0aGlzLmEgPSBwO3RoaXMuYiA9IHZvaWQgMDt0aGlzLmYgPSBbXTt2YXIgYiA9IHRoaXM7dHJ5IHtcblx0XHRcdFx0YSggZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0cSggYiwgYSApO1xuXHRcdFx0XHR9LCBmdW5jdGlvbiggYSApIHtcblx0XHRcdFx0XHRyKCBiLCBhICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gY2F0Y2ggKCBjICkge1xuXHRcdFx0XHRyKCBiLCBjICk7XG5cdFx0XHR9XG5cdFx0fSB2YXIgcCA9IDI7ZnVuY3Rpb24gdCggYSApIHtcblx0XHRcdHJldHVybiBuZXcgbiggZnVuY3Rpb24oIGIsIGMgKSB7XG5cdFx0XHRcdGMoIGEgKTtcblx0XHRcdH0gKTtcblx0XHR9IGZ1bmN0aW9uIHUoIGEgKSB7XG5cdFx0XHRyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBiICkge1xuXHRcdFx0XHRiKCBhICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBmdW5jdGlvbiBxKCBhLCBiICkge1xuXHRcdFx0aWYgKCBhLmEgPT0gcCApIHtcblx0XHRcdFx0aWYgKCBiID09IGEgKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcjtcblx0XHRcdFx0fSB2YXIgYyA9ICEgMTt0cnkge1xuXHRcdFx0XHRcdHZhciBkID0gYiAmJiBiLnRoZW47aWYgKCBudWxsICE9IGIgJiYgJ29iamVjdCcgPT09IHR5cGVvZiBiICYmICdmdW5jdGlvbicgPT09IHR5cGVvZiBkICkge1xuXHRcdFx0XHRcdFx0ZC5jYWxsKCBiLCBmdW5jdGlvbiggYiApIHtcblx0XHRcdFx0XHRcdFx0YyB8fCBxKCBhLCBiICk7YyA9ICEgMDtcblx0XHRcdFx0XHRcdH0sIGZ1bmN0aW9uKCBiICkge1xuXHRcdFx0XHRcdFx0XHRjIHx8IHIoIGEsIGIgKTtjID0gISAwO1xuXHRcdFx0XHRcdFx0fSApO3JldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKCBlICkge1xuXHRcdFx0XHRcdGMgfHwgciggYSwgZSApO3JldHVybjtcblx0XHRcdFx0fWEuYSA9IDA7YS5iID0gYjt2KCBhICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHIoIGEsIGIgKSB7XG5cdFx0XHRpZiAoIGEuYSA9PSBwICkge1xuXHRcdFx0XHRpZiAoIGIgPT0gYSApIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yO1xuXHRcdFx0XHR9YS5hID0gMTthLmIgPSBiO3YoIGEgKTtcblx0XHRcdH1cblx0XHR9IGZ1bmN0aW9uIHYoIGEgKSB7XG5cdFx0XHRsKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBhLmEgIT0gcCApIHtcblx0XHRcdFx0XHRmb3IgKCA7YS5mLmxlbmd0aDsgKSB7XG5cdFx0XHRcdFx0XHR2YXIgYiA9IGEuZi5zaGlmdCgpLFxuXHRcdFx0XHRcdFx0XHRjID0gYlswXSxcblx0XHRcdFx0XHRcdFx0ZCA9IGJbMV0sXG5cdFx0XHRcdFx0XHRcdGUgPSBiWzJdLFxuXHRcdFx0XHRcdFx0XHRiID0gYlszXTt0cnkge1xuXHRcdFx0XHRcdFx0XHQwID09IGEuYSA/ICdmdW5jdGlvbicgPT09IHR5cGVvZiBjID8gZSggYy5jYWxsKCB2b2lkIDAsIGEuYiApICkgOiBlKCBhLmIgKSA6IDEgPT0gYS5hICYmICggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGQgPyBlKCBkLmNhbGwoIHZvaWQgMCwgYS5iICkgKSA6IGIoIGEuYiApICk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoICggaCApIHtcblx0XHRcdFx0XHRcdFx0YiggaCApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1uLnByb3RvdHlwZS5nID0gZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jKCB2b2lkIDAsIGEgKTtcblx0XHR9O24ucHJvdG90eXBlLmMgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdHZhciBjID0gdGhpcztyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBkLCBlICkge1xuXHRcdFx0XHRjLmYucHVzaCggWyBhLCBiLCBkLCBlIF0gKTt2KCBjICk7XG5cdFx0XHR9ICk7XG5cdFx0fTtcblx0XHRmdW5jdGlvbiB3KCBhICkge1xuXHRcdFx0cmV0dXJuIG5ldyBuKCBmdW5jdGlvbiggYiwgYyApIHtcblx0XHRcdFx0ZnVuY3Rpb24gZCggYyApIHtcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGQgKSB7XG5cdFx0XHRcdFx0XHRoW2NdID0gZDtlICs9IDE7ZSA9PSBhLmxlbmd0aCAmJiBiKCBoICk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fSB2YXIgZSA9IDAsXG5cdFx0XHRcdFx0aCA9IFtdOzAgPT0gYS5sZW5ndGggJiYgYiggaCApO2ZvciAoIHZhciBrID0gMDtrIDwgYS5sZW5ndGg7ayArPSAxICkge1xuXHRcdFx0XHRcdHUoIGFba10gKS5jKCBkKCBrICksIGMgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0gZnVuY3Rpb24geCggYSApIHtcblx0XHRcdHJldHVybiBuZXcgbiggZnVuY3Rpb24oIGIsIGMgKSB7XG5cdFx0XHRcdGZvciAoIHZhciBkID0gMDtkIDwgYS5sZW5ndGg7ZCArPSAxICkge1xuXHRcdFx0XHRcdHUoIGFbZF0gKS5jKCBiLCBjICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9d2luZG93LlByb21pc2UgfHwgKCB3aW5kb3cuUHJvbWlzZSA9IG4sIHdpbmRvdy5Qcm9taXNlLnJlc29sdmUgPSB1LCB3aW5kb3cuUHJvbWlzZS5yZWplY3QgPSB0LCB3aW5kb3cuUHJvbWlzZS5yYWNlID0geCwgd2luZG93LlByb21pc2UuYWxsID0gdywgd2luZG93LlByb21pc2UucHJvdG90eXBlLnRoZW4gPSBuLnByb3RvdHlwZS5jLCB3aW5kb3cuUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2ggPSBuLnByb3RvdHlwZS5nICk7XG5cdH0oKSApO1xuXG5cdCggZnVuY3Rpb24oKSB7XG5cdFx0ZnVuY3Rpb24gbCggYSwgYiApIHtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPyBhLmFkZEV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCBiLCAhIDEgKSA6IGEuYXR0YWNoRXZlbnQoICdzY3JvbGwnLCBiICk7XG5cdFx0fSBmdW5jdGlvbiBtKCBhICkge1xuXHRcdFx0ZG9jdW1lbnQuYm9keSA/IGEoKSA6IGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uIGMoKSB7XG5cdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgYyApO2EoKTtcblx0XHRcdH0gKSA6IGRvY3VtZW50LmF0dGFjaEV2ZW50KCAnb25yZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24gaygpIHtcblx0XHRcdFx0aWYgKCAnaW50ZXJhY3RpdmUnID09IGRvY3VtZW50LnJlYWR5U3RhdGUgfHwgJ2NvbXBsZXRlJyA9PSBkb2N1bWVudC5yZWFkeVN0YXRlICkge1xuXHRcdFx0XHRcdGRvY3VtZW50LmRldGFjaEV2ZW50KCAnb25yZWFkeXN0YXRlY2hhbmdlJywgayApLCBhKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9IGZ1bmN0aW9uIHQoIGEgKSB7XG5cdFx0XHR0aGlzLmEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO3RoaXMuYS5zZXRBdHRyaWJ1dGUoICdhcmlhLWhpZGRlbicsICd0cnVlJyApO3RoaXMuYS5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIGEgKSApO3RoaXMuYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuZyA9IC0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0ID0gJ21heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4Oyc7dGhpcy5jLnN0eWxlLmNzc1RleHQgPSAnbWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7Jztcblx0XHRcdHRoaXMuZi5zdHlsZS5jc3NUZXh0ID0gJ21heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4Oyc7dGhpcy5oLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTsnO3RoaXMuYi5hcHBlbmRDaGlsZCggdGhpcy5oICk7dGhpcy5jLmFwcGVuZENoaWxkKCB0aGlzLmYgKTt0aGlzLmEuYXBwZW5kQ2hpbGQoIHRoaXMuYiApO3RoaXMuYS5hcHBlbmRDaGlsZCggdGhpcy5jICk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHUoIGEsIGIgKSB7XG5cdFx0XHRhLmEuc3R5bGUuY3NzVGV4dCA9ICdtYXgtd2lkdGg6bm9uZTttaW4td2lkdGg6MjBweDttaW4taGVpZ2h0OjIwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmF1dG87bWFyZ2luOjA7cGFkZGluZzowO3RvcDotOTk5cHg7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQtc3ludGhlc2lzOm5vbmU7Zm9udDonICsgYiArICc7Jztcblx0XHR9IGZ1bmN0aW9uIHooIGEgKSB7XG5cdFx0XHR2YXIgYiA9IGEuYS5vZmZzZXRXaWR0aCxcblx0XHRcdFx0YyA9IGIgKyAxMDA7YS5mLnN0eWxlLndpZHRoID0gYyArICdweCc7YS5jLnNjcm9sbExlZnQgPSBjO2EuYi5zY3JvbGxMZWZ0ID0gYS5iLnNjcm9sbFdpZHRoICsgMTAwO3JldHVybiBhLmcgIT09IGIgPyAoIGEuZyA9IGIsICEgMCApIDogISAxO1xuXHRcdH0gZnVuY3Rpb24gQSggYSwgYiApIHtcblx0XHRcdGZ1bmN0aW9uIGMoKSB7XG5cdFx0XHRcdHZhciBhID0gazt6KCBhICkgJiYgYS5hLnBhcmVudE5vZGUgJiYgYiggYS5nICk7XG5cdFx0XHR9IHZhciBrID0gYTtsKCBhLmIsIGMgKTtsKCBhLmMsIGMgKTt6KCBhICk7XG5cdFx0fSBmdW5jdGlvbiBCKCBhLCBiICkge1xuXHRcdFx0dmFyIGMgPSBiIHx8IHt9O3RoaXMuZmFtaWx5ID0gYTt0aGlzLnN0eWxlID0gYy5zdHlsZSB8fCAnbm9ybWFsJzt0aGlzLndlaWdodCA9IGMud2VpZ2h0IHx8ICdub3JtYWwnO3RoaXMuc3RyZXRjaCA9IGMuc3RyZXRjaCB8fCAnbm9ybWFsJztcblx0XHR9IHZhciBDID0gbnVsbCxcblx0XHRcdEQgPSBudWxsLFxuXHRcdFx0RSA9IG51bGwsXG5cdFx0XHRGID0gbnVsbDtmdW5jdGlvbiBHKCkge1xuXHRcdFx0aWYgKCBudWxsID09PSBEICkge1xuXHRcdFx0XHRpZiAoIEooKSAmJiAvQXBwbGUvLnRlc3QoIHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yICkgKSB7XG5cdFx0XHRcdFx0dmFyIGEgPSAvQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKSg/OlxcLihbMC05XSspKS8uZXhlYyggd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQgKTtEID0gISEgYSAmJiA2MDMgPiBwYXJzZUludCggYVsxXSwgMTAgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHREID0gISAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9IHJldHVybiBEO1xuXHRcdH0gZnVuY3Rpb24gSigpIHtcblx0XHRcdG51bGwgPT09IEYgJiYgKCBGID0gISEgZG9jdW1lbnQuZm9udHMgKTtyZXR1cm4gRjtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gSygpIHtcblx0XHRcdGlmICggbnVsbCA9PT0gRSApIHtcblx0XHRcdFx0dmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO3RyeSB7XG5cdFx0XHRcdFx0YS5zdHlsZS5mb250ID0gJ2NvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmJztcblx0XHRcdFx0fSBjYXRjaCAoIGIgKSB7fUUgPSAnJyAhPT0gYS5zdHlsZS5mb250O1xuXHRcdFx0fSByZXR1cm4gRTtcblx0XHR9IGZ1bmN0aW9uIEwoIGEsIGIgKSB7XG5cdFx0XHRyZXR1cm4gWyBhLnN0eWxlLCBhLndlaWdodCwgSygpID8gYS5zdHJldGNoIDogJycsICcxMDBweCcsIGIgXS5qb2luKCAnICcgKTtcblx0XHR9XG5cdFx0Qi5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0dmFyIGMgPSB0aGlzLFxuXHRcdFx0XHRrID0gYSB8fCAnQkVTYnN3eScsXG5cdFx0XHRcdHIgPSAwLFxuXHRcdFx0XHRuID0gYiB8fCAzRTMsXG5cdFx0XHRcdEggPSAoIG5ldyBEYXRlICkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZSggZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHRcdGlmICggSigpICYmICEgRygpICkge1xuXHRcdFx0XHRcdHZhciBNID0gbmV3IFByb21pc2UoIGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiBlKCkge1xuXHRcdFx0XHRcdFx0XHRcdCggbmV3IERhdGUgKS5nZXRUaW1lKCkgLSBIID49IG4gPyBiKCBFcnJvciggJycgKyBuICsgJ21zIHRpbWVvdXQgZXhjZWVkZWQnICkgKSA6IGRvY3VtZW50LmZvbnRzLmxvYWQoIEwoIGMsICdcIicgKyBjLmZhbWlseSArICdcIicgKSwgayApLnRoZW4oIGZ1bmN0aW9uKCBjICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0MSA8PSBjLmxlbmd0aCA/IGEoKSA6IHNldFRpbWVvdXQoIGUsIDI1ICk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgYiApO1xuXHRcdFx0XHRcdFx0XHR9ZSgpO1xuXHRcdFx0XHRcdFx0fSApLFxuXHRcdFx0XHRcdFx0TiA9IG5ldyBQcm9taXNlKCBmdW5jdGlvbiggYSwgYyApIHtcblx0XHRcdFx0XHRcdFx0ciA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdGMoIEVycm9yKCAnJyArIG4gKyAnbXMgdGltZW91dCBleGNlZWRlZCcgKSApO1xuXHRcdFx0XHRcdFx0XHR9LCBuICk7XG5cdFx0XHRcdFx0XHR9ICk7UHJvbWlzZS5yYWNlKCBbIE4sIE0gXSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCByICk7YSggYyApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YiApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG0oIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gdigpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGI7aWYgKCBiID0gLTEgIT0gZiAmJiAtMSAhPSBnIHx8IC0xICE9IGYgJiYgLTEgIT0gaCB8fCAtMSAhPSBnICYmIC0xICE9IGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0KCBiID0gZiAhPSBnICYmIGYgIT0gaCAmJiBnICE9IGggKSB8fCAoIG51bGwgPT09IEMgJiYgKCBiID0gL0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMoIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50ICksIEMgPSAhISBiICYmICggNTM2ID4gcGFyc2VJbnQoIGJbMV0sIDEwICkgfHwgNTM2ID09PSBwYXJzZUludCggYlsxXSwgMTAgKSAmJiAxMSA+PSBwYXJzZUludCggYlsyXSwgMTAgKSApICksIGIgPSBDICYmICggZiA9PSB3ICYmIGcgPT0gdyAmJiBoID09IHcgfHwgZiA9PSB4ICYmIGcgPT0geCAmJiBoID09IHggfHwgZiA9PSB5ICYmIGcgPT0geSAmJiBoID09IHkgKSApLCBiID0gISBiO1xuXHRcdFx0XHRcdFx0XHR9YiAmJiAoIGQucGFyZW50Tm9kZSAmJiBkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIGQgKSwgY2xlYXJUaW1lb3V0KCByICksIGEoIGMgKSApO1xuXHRcdFx0XHRcdFx0fSBmdW5jdGlvbiBJKCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICggbmV3IERhdGUgKS5nZXRUaW1lKCkgLSBIID49IG4gKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZC5wYXJlbnROb2RlICYmIGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZCApLCBiKCBFcnJvciggJycgK1xuXHRuICsgJ21zIHRpbWVvdXQgZXhjZWVkZWQnICkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgYSA9IGRvY3VtZW50LmhpZGRlbjtpZiAoICEgMCA9PT0gYSB8fCB2b2lkIDAgPT09IGEgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmID0gZS5hLm9mZnNldFdpZHRoLCBnID0gcC5hLm9mZnNldFdpZHRoLCBoID0gcS5hLm9mZnNldFdpZHRoLCB2KCk7XG5cdFx0XHRcdFx0XHRcdFx0fXIgPSBzZXRUaW1lb3V0KCBJLCA1MCApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IHZhciBlID0gbmV3IHQoIGsgKSxcblx0XHRcdFx0XHRcdFx0cCA9IG5ldyB0KCBrICksXG5cdFx0XHRcdFx0XHRcdHEgPSBuZXcgdCggayApLFxuXHRcdFx0XHRcdFx0XHRmID0gLTEsXG5cdFx0XHRcdFx0XHRcdGcgPSAtMSxcblx0XHRcdFx0XHRcdFx0aCA9IC0xLFxuXHRcdFx0XHRcdFx0XHR3ID0gLTEsXG5cdFx0XHRcdFx0XHRcdHggPSAtMSxcblx0XHRcdFx0XHRcdFx0eSA9IC0xLFxuXHRcdFx0XHRcdFx0XHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtkLmRpciA9ICdsdHInO3UoIGUsIEwoIGMsICdzYW5zLXNlcmlmJyApICk7dSggcCwgTCggYywgJ3NlcmlmJyApICk7dSggcSwgTCggYywgJ21vbm9zcGFjZScgKSApO2QuYXBwZW5kQ2hpbGQoIGUuYSApO2QuYXBwZW5kQ2hpbGQoIHAuYSApO2QuYXBwZW5kQ2hpbGQoIHEuYSApO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGQgKTt3ID0gZS5hLm9mZnNldFdpZHRoO3ggPSBwLmEub2Zmc2V0V2lkdGg7eSA9IHEuYS5vZmZzZXRXaWR0aDtJKCk7QSggZSwgZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0XHRcdGYgPSBhO3YoKTtcblx0XHRcdFx0XHRcdH0gKTt1KCBlLFxuXHRcdFx0XHRcdFx0XHRMKCBjLCAnXCInICsgYy5mYW1pbHkgKyAnXCIsc2Fucy1zZXJpZicgKSApO0EoIHAsIGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHRcdFx0XHRnID0gYTt2KCk7XG5cdFx0XHRcdFx0XHR9ICk7dSggcCwgTCggYywgJ1wiJyArIGMuZmFtaWx5ICsgJ1wiLHNlcmlmJyApICk7QSggcSwgZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0XHRcdGggPSBhO3YoKTtcblx0XHRcdFx0XHRcdH0gKTt1KCBxLCBMKCBjLCAnXCInICsgYy5mYW1pbHkgKyAnXCIsbW9ub3NwYWNlJyApICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fTsnb2JqZWN0JyA9PT0gdHlwZW9mIG1vZHVsZSA/IG1vZHVsZS5leHBvcnRzID0gQiA6ICggd2luZG93LkZvbnRGYWNlT2JzZXJ2ZXIgPSBCLCB3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZCA9IEIucHJvdG90eXBlLmxvYWQgKTtcblx0fSgpICk7XG5cblx0Ly8gbWlubnBvc3QgZm9udHNcblxuXHQvLyBzYW5zXG5cdHZhciBzYW5zTm9ybWFsID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoICdmZi1tZXRhLXdlYi1wcm8nICk7XG5cdHZhciBzYW5zQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNhbnNOb3JtYWxJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA0MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cblx0Ly8gc2VyaWZcblx0dmFyIHNlcmlmQm9vayA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDUwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9va0l0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDUwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9sZEl0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQmxhY2sgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA5MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJsYWNrSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogOTAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXG5cdFByb21pc2UuYWxsKCBbXG5cdFx0c2Fuc05vcm1hbC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc0JvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNOb3JtYWxJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9vay5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb29rSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9sZEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCbGFjay5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCbGFja0l0YWxpYy5sb2FkKCBudWxsLCAzMDAwIClcblx0XSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzZXJpZi1mb250cy1sb2FkZWQnO1xuXG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsID0gdHJ1ZTtcblx0fSApO1xuXG5cdFByb21pc2UuYWxsKCBbXG5cdFx0c2Fuc05vcm1hbC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc0JvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNOb3JtYWxJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApXG5cdF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2Fucy1mb250cy1sb2FkZWQnO1xuXG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG59XG5cbiIsImZ1bmN0aW9uIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHZhbHVlICkge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblxuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdH1cblx0XHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdH1cbn0gKTtcbiIsImZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uID0gJycgKSB7XG5cblx0Ly8gaWYgYSBub3QgbG9nZ2VkIGluIHVzZXIgdHJpZXMgdG8gZW1haWwsIGRvbid0IGNvdW50IHRoYXQgYXMgYSBzaGFyZVxuXHRpZiAoICEgalF1ZXJ5KCAnYm9keScgKS5oYXNDbGFzcyggJ2xvZ2dlZC1pbicgKSAmJiAnRW1haWwnID09PSB0ZXh0ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBjYXRlZ29yeSA9ICdTaGFyZSc7XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdGNhdGVnb3J5ID0gJ1NoYXJlIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cblx0Ly8gdHJhY2sgYXMgYW4gZXZlbnQsIGFuZCBhcyBzb2NpYWwgaWYgaXQgaXMgdHdpdHRlciBvciBmYlxuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsIGNhdGVnb3J5LCB0ZXh0LCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0IHx8ICdUd2l0dGVyJyA9PT0gdGV4dCApIHtcblx0XHRcdGlmICggJ0ZhY2Vib29rJyA9PT0gdGV4dCApIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdTaGFyZScsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1R3ZWV0JywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvcHlDdXJyZW50VVJMKCkge1xuXHR2YXIgZHVtbXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW5wdXQnICksXG5cdFx0dGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkdW1teSApO1xuXHRkdW1teS52YWx1ZSA9IHRleHQ7XG5cdGR1bW15LnNlbGVjdCgpO1xuXHRkb2N1bWVudC5leGVjQ29tbWFuZCggJ2NvcHknICk7XG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoIGR1bW15ICk7XG59XG5cbiQoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLmRhdGEoICdzaGFyZS1hY3Rpb24nICk7XG5cdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSApO1xuXG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtcHJpbnQgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0d2luZG93LnByaW50KCk7XG59ICk7XG5cbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1jb3B5LXVybCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0Y29weUN1cnJlbnRVUkwoKTtcblx0dGxpdGUuc2hvdyggKCBlLnRhcmdldCApLCB7IGdyYXY6ICd3JyB9ICk7XG5cdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdHRsaXRlLmhpZGUoICggZS50YXJnZXQgKSApO1xuXHR9LCAzMDAwICk7XG5cdHJldHVybiBmYWxzZTtcbn0gKTtcblxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWZhY2Vib29rIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXR3aXR0ZXIgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZW1haWwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0dmFyIHVybCA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblx0d2luZG93Lm9wZW4oIHVybCwgJ19ibGFuaycgKTtcbn0gKTtcbiIsIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIE5hdmlnYXRpb24gc2NyaXB0cy4gSW5jbHVkZXMgbW9iaWxlIG9yIHRvZ2dsZSBiZWhhdmlvciwgYW5hbHl0aWNzIHRyYWNraW5nIG9mIHNwZWNpZmljIG1lbnVzLlxuICovXG5cbmZ1bmN0aW9uIHNldHVwUHJpbWFyeU5hdigpIHtcblx0Y29uc3QgcHJpbWFyeU5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1saW5rcycgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHByaW1hcnlOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IGJ1dHRvbicgKTtcblx0cHJpbWFyeU5hdlRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHR9XG5cdH0gKTtcblxuXHRjb25zdCB1c2VyTmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItbWlubnBvc3QtYWNjb3VudCB1bCcgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHVzZXJOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItbWlubnBvc3QtYWNjb3VudCA+IGEnICk7XG5cdHVzZXJOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0fVxuXHR9ICk7XG5cblx0dmFyIHRhcmdldCAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgLm0tZm9ybS1zZWFyY2ggZmllbGRzZXQgLmEtYnV0dG9uLXNlbnRlbmNlJyApO1xuXHR2YXIgZGl2ICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0ZGl2LmlubmVySFRNTCA9ICc8YSBocmVmPVwiI1wiIGNsYXNzPVwiYS1jbG9zZS1zZWFyY2hcIj48aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT48L2E+Jztcblx0dmFyIGZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0ZGl2LnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuXHRmcmFnbWVudC5hcHBlbmRDaGlsZCggZGl2ICk7XG5cdHRhcmdldC5hcHBlbmRDaGlsZCggZnJhZ21lbnQgKTtcblxuXHRjb25zdCBzZWFyY2hUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcubS1tZW51LXByaW1hcnktYWN0aW9ucyAubS1mb3JtLXNlYXJjaCcgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHNlYXJjaFZpc2libGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbGkuc2VhcmNoID4gYScgKTtcblx0c2VhcmNoVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0fVxuXHR9ICk7XG5cblx0dmFyIHNlYXJjaENsb3NlICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1zZWFyY2gnICk7XG5cdHNlYXJjaENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHR9XG5cdH0gKTtcblxuXHQvLyBlc2NhcGUga2V5IHByZXNzXG5cdCQoIGRvY3VtZW50ICkua2V5dXAoIGZ1bmN0aW9uKCBlICkge1xuXHRcdGlmICggMjcgPT09IGUua2V5Q29kZSApIHtcblx0XHRcdGxldCBwcmltYXJ5TmF2RXhwYW5kZWQgPSAndHJ1ZScgPT09IHByaW1hcnlOYXZUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGxldCB1c2VyTmF2RXhwYW5kZWQgPSAndHJ1ZScgPT09IHVzZXJOYXZUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGxldCBzZWFyY2hJc1Zpc2libGUgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgcHJpbWFyeU5hdkV4cGFuZGVkICYmIHRydWUgPT09IHByaW1hcnlOYXZFeHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRvZ2dsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBwcmltYXJ5TmF2RXhwYW5kZWQgKTtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiB1c2VyTmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gdXNlck5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHVzZXJOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHNlYXJjaElzVmlzaWJsZSAmJiB0cnVlID09PSBzZWFyY2hJc1Zpc2libGUgKSB7XG5cdFx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgc2VhcmNoSXNWaXNpYmxlICk7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufVxuXG5mdW5jdGlvbiBzZXR1cFNjcm9sbE5hdiggc2VsZWN0b3IsIG5hdlNlbGVjdG9yLCBjb250ZW50U2VsZWN0b3IgKSB7XG5cblx0Ly8gSW5pdCB3aXRoIGFsbCBvcHRpb25zIGF0IGRlZmF1bHQgc2V0dGluZ1xuXHRjb25zdCBwcmlvcml0eU5hdlNjcm9sbGVyRGVmYXVsdCA9IFByaW9yaXR5TmF2U2Nyb2xsZXIoIHtcblx0XHRzZWxlY3Rvcjogc2VsZWN0b3IsXG5cdFx0bmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yLFxuXHRcdGNvbnRlbnRTZWxlY3RvcjogY29udGVudFNlbGVjdG9yLFxuXHRcdGl0ZW1TZWxlY3RvcjogJ2xpLCBhJyxcblx0XHRidXR0b25MZWZ0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tbGVmdCcsXG5cdFx0YnV0dG9uUmlnaHRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1yaWdodCdcblxuXHRcdC8vc2Nyb2xsU3RlcDogJ2F2ZXJhZ2UnXG5cdH0gKTtcblxuXHQvLyBJbml0IG11bHRpcGxlIG5hdiBzY3JvbGxlcnMgd2l0aCB0aGUgc2FtZSBvcHRpb25zXG5cdC8qbGV0IG5hdlNjcm9sbGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYtc2Nyb2xsZXInKTtcblxuXHRuYXZTY3JvbGxlcnMuZm9yRWFjaCgoY3VycmVudFZhbHVlLCBjdXJyZW50SW5kZXgpID0+IHtcblx0ICBQcmlvcml0eU5hdlNjcm9sbGVyKHtcblx0ICAgIHNlbGVjdG9yOiBjdXJyZW50VmFsdWVcblx0ICB9KTtcblx0fSk7Ki9cbn1cblxuc2V0dXBQcmltYXJ5TmF2KCk7XG5zZXR1cFNjcm9sbE5hdiggJy5tLXN1Yi1uYXZpZ2F0aW9uJywgJy5tLXN1Ym5hdi1uYXZpZ2F0aW9uJywgJy5tLW1lbnUtc3ViLW5hdmlnYXRpb24nICk7XG5zZXR1cFNjcm9sbE5hdiggJy5tLXBhZ2luYXRpb24tbmF2aWdhdGlvbicsICcubS1wYWdpbmF0aW9uLWNvbnRhaW5lcicsICcubS1wYWdpbmF0aW9uLWxpc3QnICk7XG5cbiQoICcjbmF2aWdhdGlvbi1mZWF0dXJlZCBhJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCAnRmVhdHVyZWQgQmFyIExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcbn0gKTtcblxuJCggJ2EuZ2xlYW4tc2lkZWJhcicgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1NpZGViYXIgU3VwcG9ydCBMaW5rJywgJ0NsaWNrJywgdGhpcy5ocmVmICk7XG59ICk7XG5cbiQoICdhJywgJCggJy5vLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0dmFyIHdpZGdldFRpdGxlICAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXdpZGdldCcgKS5maW5kKCAnaDMnICkudGV4dCgpO1xuXHR2YXIgem9uZVRpdGxlICAgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0tem9uZScgKS5maW5kKCAnLmEtem9uZS10aXRsZScgKS50ZXh0KCk7XG5cdHZhciBzaWRlYmFyU2VjdGlvblRpdGxlID0gJyc7XG5cdGlmICggJycgIT09IHdpZGdldFRpdGxlICkge1xuXHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB3aWRnZXRUaXRsZTtcblx0fSBlbHNlIGlmICggJycgIT09IHpvbmVUaXRsZSApIHtcblx0XHRzaWRlYmFyU2VjdGlvblRpdGxlID0gem9uZVRpdGxlO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJTZWN0aW9uVGl0bGUgKTtcbn0gKTtcbiIsImpRdWVyeS5mbi50ZXh0Tm9kZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY29udGVudHMoKS5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoIHRoaXMubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmICcnICE9PSB0aGlzLm5vZGVWYWx1ZS50cmltKCkgKTtcblx0fSApO1xufTtcblxuZnVuY3Rpb24gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggYWN0aW9uICkge1xuXHR2YXIgbWFya3VwID0gJzxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtZm9ybS1jb25maXJtXCI+PGxhYmVsPkFyZSB5b3Ugc3VyZT8gPGEgaWQ9XCJhLWNvbmZpcm0tJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPlllczwvYT4gfCA8YSBpZD1cImEtc3RvcC0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+Tm88L2E+PC9sYWJlbD48L2xpPic7XG5cdHJldHVybiBtYXJrdXA7XG59XG5cbmZ1bmN0aW9uIG1hbmFnZUVtYWlscygpIHtcblx0dmFyIGZvcm0gICAgICAgICAgICAgICA9ICQoICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJyApO1xuXHR2YXIgcmVzdFJvb3QgICAgICAgICAgID0gdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5zaXRlX3VybCArIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QucmVzdF9uYW1lc3BhY2U7XG5cdHZhciBmdWxsVXJsICAgICAgICAgICAgPSByZXN0Um9vdCArICcvJyArICd1cGRhdGUtdXNlci8nO1xuXHR2YXIgY29uZmlybUNoYW5nZSAgICAgID0gJyc7XG5cdHZhciBuZXh0RW1haWxDb3VudCAgICAgPSAxO1xuXHR2YXIgbmV3UHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBvbGRQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIHByaW1hcnlJZCAgICAgICAgICA9ICcnO1xuXHR2YXIgZW1haWxUb1JlbW92ZSAgICAgID0gJyc7XG5cdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0dmFyIG5ld0VtYWlscyAgICAgICAgICA9IFtdO1xuXHR2YXIgYWpheEZvcm1EYXRhICAgICAgID0gJyc7XG5cdHZhciB0aGF0ICAgICAgICAgICAgICAgPSAnJztcblxuXHQvLyBzdGFydCBvdXQgd2l0aCBubyBwcmltYXJ5L3JlbW92YWxzIGNoZWNrZWRcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0Ly8gaWYgdGhlcmUgaXMgYSBsaXN0IG9mIGVtYWlscyAobm90IGp1c3QgYSBzaW5nbGUgZm9ybSBmaWVsZClcblx0aWYgKCAwIDwgJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHNlbGVjdHMgYSBuZXcgcHJpbWFyeSwgbW92ZSBpdCBpbnRvIHRoYXQgcG9zaXRpb25cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScsIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRuZXdQcmltYXJ5RW1haWwgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRvbGRQcmltYXJ5RW1haWwgPSAkKCAnI2VtYWlsJyApLnZhbCgpO1xuXHRcdFx0cHJpbWFyeUlkICAgICAgID0gJCggdGhpcyApLnByb3AoICdpZCcgKS5yZXBsYWNlKCAncHJpbWFyeV9lbWFpbF8nLCAnJyApO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3ByaW1hcnktY2hhbmdlJyApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cblx0XHRcdC8vJCggdGhpcyApLnBhcmVudCgpLmFmdGVyKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgdXNlciBmYWNpbmcgdmFsdWVzXG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBuZXdQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyN1c2VyLWVtYWlsLScgKyBwcmltYXJ5SWQgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIG1haW4gaGlkZGVuIGZvcm0gdmFsdWVcblx0XHRcdFx0JCggJyNlbWFpbCcgKS52YWwoIG5ld1ByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHN1Ym1pdCBmb3JtIHZhbHVlcy5cblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblxuXHRcdFx0XHQvLyB1bmNoZWNrIHRoZSByYWRpbyBidXR0b25cblx0XHRcdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgZm9ybSB2YWx1ZXMgdG8gdGhlIG9sZCBwcmltYXJ5IGVtYWlsXG5cdFx0XHRcdCQoICcjcHJpbWFyeV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyNyZW1vdmVfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIHRoZSBjb25maXJtIG1lc3NhZ2Vcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdH0gKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdC8vIGlmIGEgdXNlciByZW1vdmVzIGFuIGVtYWlsLCB0YWtlIGl0IGF3YXkgZnJvbSB0aGUgdmlzdWFsIGFuZCBmcm9tIHRoZSBmb3JtXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NoYW5nZScsICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRlbWFpbFRvUmVtb3ZlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3JlbW92YWwnICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICE9PSBlbWFpbFRvUmVtb3ZlICkge1xuXHRcdFx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscy5wdXNoKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXIgZm9yIHJlbW92YWxcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdC8vIGlmIGNvbmZpcm1lZCwgcmVtb3ZlIHRoZSBlbWFpbCBhbmQgc3VibWl0IHRoZSBmb3JtXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpJyApLmZhZGVPdXQoICdub3JtYWwnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkucmVtb3ZlKCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXG5cdFx0XHRcdC8vY29uc29sZS5sb2coICd2YWx1ZSBpcyAnICsgY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0Ly8gaWYgYSB1c2VyIHdhbnRzIHRvIGFkZCBhbiBlbWFpbCwgZ2l2ZSB0aGVtIGEgcHJvcGVybHkgbnVtYmVyZWQgZmllbGRcblx0JCggJy5tLWZvcm0tZW1haWwnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJyApLmJlZm9yZSggJzxkaXYgY2xhc3M9XCJhLWlucHV0LXdpdGgtYnV0dG9uIGEtYnV0dG9uLXNlbnRlbmNlXCI+PGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgaWQ9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgdmFsdWU9XCJcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBuYW1lPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGlkPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGNsYXNzPVwiYS1idXR0b24gYS1idXR0b24tYWRkLXVzZXItZW1haWxcIj5BZGQ8L2J1dHRvbj48L2Rpdj4nICk7XG5cdFx0bmV4dEVtYWlsQ291bnQrKztcblx0fSApO1xuXG5cdCQoICdpbnB1dFt0eXBlPXN1Ym1pdF0nICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBidXR0b24gPSAkKCB0aGlzICk7XG5cdFx0dmFyIGJ1dHRvbkZvcm0gPSBidXR0b24uY2xvc2VzdCggJ2Zvcm0nICk7XG5cdFx0YnV0dG9uRm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nLCBidXR0b24udmFsKCkgKTtcblx0fSApO1xuXG5cdCQoICcubS1lbnRyeS1jb250ZW50JyApLm9uKCAnc3VibWl0JywgJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0dmFyIGZvcm0gPSAkKCB0aGlzICk7XG5cdFx0dmFyIHN1Ym1pdHRpbmdCdXR0b24gPSBmb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicgKSB8fCAnJztcblxuXHRcdC8vIGlmIHRoZXJlIGlzIG5vIHN1Ym1pdHRpbmcgYnV0dG9uLCBwYXNzIGl0IGJ5IEFqYXhcblx0XHRpZiAoICcnID09PSBzdWJtaXR0aW5nQnV0dG9uIHx8ICdTYXZlIENoYW5nZXMnICE9PSBzdWJtaXR0aW5nQnV0dG9uICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGFqYXhGb3JtRGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7IC8vYWRkIG91ciBvd24gYWpheCBjaGVjayBhcyBYLVJlcXVlc3RlZC1XaXRoIGlzIG5vdCBhbHdheXMgcmVsaWFibGVcblx0XHRcdGFqYXhGb3JtRGF0YSA9IGFqYXhGb3JtRGF0YSArICcmcmVzdD10cnVlJztcblx0XHRcdCQuYWpheCgge1xuXHRcdFx0XHR1cmw6IGZ1bGxVcmwsXG5cdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oIHhociApIHtcblx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Lm5vbmNlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhGb3JtRGF0YVxuXHRcdFx0fSApLmRvbmUoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRuZXdFbWFpbHMgPSAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHR9ICkuZ2V0KCk7XG5cdFx0XHRcdCQuZWFjaCggbmV3RW1haWxzLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICkge1xuXHRcdFx0XHRcdG5leHRFbWFpbENvdW50ID0gbmV4dEVtYWlsQ291bnQgKyBpbmRleDtcblx0XHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmFwcGVuZCggJzxsaSBpZD1cInVzZXItZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPicgKyB2YWx1ZSArICc8dWwgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXVzZXItZW1haWwtYWN0aW9uc1wiPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1tYWtlLXByaW1hcnktZW1haWxcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW1hcnlfZW1haWxcIiBpZD1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+TWFrZSBQcmltYXJ5PC9zbWFsbD48L2xhYmVsPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLWVtYWlsLXByZWZlcmVuY2VzXCI+PGEgaHJlZj1cIi9uZXdzbGV0dGVycy8/ZW1haWw9JyArIGVuY29kZVVSSUNvbXBvbmVudCggdmFsdWUgKSArICdcIj48c21hbGw+RW1haWwgUHJlZmVyZW5jZXM8L3NtYWxsPjwvYT48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggJCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoKSArICcsJyArIHZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0JCggJy5tLWZvcm0tY2hhbmdlLWVtYWlsIC5hLWlucHV0LXdpdGgtYnV0dG9uJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRpZiAoIDAgPT09ICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdGlmICggJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApICE9PSAkKCAnaW5wdXRbbmFtZT1cImVtYWlsXCJdJyApICkge1xuXG5cdFx0XHRcdFx0XHQvLyBpdCB3b3VsZCBiZSBuaWNlIHRvIG9ubHkgbG9hZCB0aGUgZm9ybSwgYnV0IHRoZW4gY2xpY2sgZXZlbnRzIHN0aWxsIGRvbid0IHdvcmtcblx0XHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblx0fSApO1xufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIDAgPCAkKCAnLm0tZm9ybS1lbWFpbCcgKS5sZW5ndGggKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cbn0gKTtcbiIsIi8vIGJhc2VkIG9uIHdoaWNoIGJ1dHRvbiB3YXMgY2xpY2tlZCwgc2V0IHRoZSB2YWx1ZXMgZm9yIHRoZSBhbmFseXRpY3MgZXZlbnQgYW5kIGNyZWF0ZSBpdFxuZnVuY3Rpb24gdHJhY2tTaG93Q29tbWVudHMoIGFsd2F5cywgaWQsIGNsaWNrVmFsdWUgKSB7XG5cdHZhciBhY3Rpb24gICAgICAgICAgPSAnJztcblx0dmFyIGNhdGVnb3J5UHJlZml4ID0gJyc7XG5cdHZhciBjYXRlZ29yeVN1ZmZpeCA9ICcnO1xuXHR2YXIgcG9zaXRpb24gICAgICAgID0gJyc7XG5cdHBvc2l0aW9uID0gaWQucmVwbGFjZSggJ2Fsd2F5cy1zaG93LWNvbW1lbnRzLScsICcnICk7XG5cdGlmICggJzEnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPbic7XG5cdH0gZWxzZSBpZiAoICcwJyA9PT0gY2xpY2tWYWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5UHJlZml4ID0gJ0Fsd2F5cyAnO1xuXHR9XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24uY2hhckF0KCAwICkudG9VcHBlckNhc2UoKSArIHBvc2l0aW9uLnNsaWNlKCAxICk7XG5cdFx0Y2F0ZWdvcnlTdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnlQcmVmaXggKyAnU2hvdyBDb21tZW50cycgKyBjYXRlZ29yeVN1ZmZpeCwgYWN0aW9uLCBsb2NhdGlvbi5wYXRobmFtZSApO1xufVxuXG4vLyB3aGVuIHNob3dpbmcgY29tbWVudHMgb25jZSwgdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtYnV0dG9uLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dHJhY2tTaG93Q29tbWVudHMoIGZhbHNlLCAnJywgJycgKTtcbn0gKTtcblxuLy8gU2V0IHVzZXIgbWV0YSB2YWx1ZSBmb3IgYWx3YXlzIHNob3dpbmcgY29tbWVudHMgaWYgdGhhdCBidXR0b24gaXMgY2xpY2tlZFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHZhciB0aGF0ID0gJCggdGhpcyApO1xuXHRpZiAoIHRoYXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gZWxzZSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuXHR0cmFja1Nob3dDb21tZW50cyggdHJ1ZSwgdGhhdC5hdHRyKCAnaWQnICksIHRoYXQudmFsKCkgKTtcblxuXHQvLyB3ZSBhbHJlYWR5IGhhdmUgYWpheHVybCBmcm9tIHRoZSB0aGVtZVxuXHQkLmFqYXgoIHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBhamF4dXJsLFxuXHRcdGRhdGE6IHtcblx0XHRcdCdhY3Rpb24nOiAnbWlubnBvc3RfbGFyZ29fbG9hZF9jb21tZW50c19zZXRfdXNlcl9tZXRhJyxcblx0XHRcdCd2YWx1ZSc6IHRoYXQudmFsKClcblx0XHR9LFxuXHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdCQoICcuYS1hbHdheXMtc2hvdy1jb21tZW50cy1yZXN1bHQnLCB0aGF0LnBhcmVudCgpICkuaHRtbCggcmVzcG9uc2UuZGF0YS5tZXNzYWdlICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IHJlc3BvbnNlLmRhdGEuc2hvdyApIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufSApO1xuIl19
}(jQuery));
