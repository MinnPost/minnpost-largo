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

function setupSubNav() {
  // Init with all options at default setting
  var priorityNavScrollerDefault = PriorityNavScroller({
    selector: '.m-sub-navigation',
    navSelector: '.m-subnav-navigation',
    contentSelector: '.m-menu-sub-navigation',
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
setupSubNav();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDAtc3RhcnQuanMiLCIwMS1mb250cy5qcyIsIjAyLWFuYWx5dGljcy5qcyIsIjAzLXNoYXJlLmpzIiwiMDQtbmF2aWdhdGlvbi5qcyIsIjA1LWZvcm1zLmpzIiwiMDYtY29tbWVudHMuanMiXSwibmFtZXMiOlsidGxpdGUiLCJ0IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImkiLCJ0YXJnZXQiLCJuIiwicGFyZW50RWxlbWVudCIsInNob3ciLCJ0b29sdGlwIiwibyIsImhpZGUiLCJsIiwiciIsImNsYXNzTmFtZSIsInMiLCJvZmZzZXRUb3AiLCJvZmZzZXRMZWZ0Iiwib2Zmc2V0UGFyZW50Iiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJkIiwiZiIsImEiLCJzdHlsZSIsInRvcCIsImxlZnQiLCJjcmVhdGVFbGVtZW50IiwiZ3JhdiIsImdldEF0dHJpYnV0ZSIsImlubmVySFRNTCIsImFwcGVuZENoaWxkIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiYm90dG9tIiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJyaWdodCIsImlubmVyV2lkdGgiLCJ0aXRsZSIsInNldEF0dHJpYnV0ZSIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJtb2R1bGUiLCJleHBvcnRzIiwidHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQiLCJlbGVtZW50IiwidmlzaWJsZUNsYXNzIiwid2FpdE1vZGUiLCJ0aW1lb3V0RHVyYXRpb24iLCJoaWRlTW9kZSIsImRpc3BsYXlWYWx1ZSIsImNvbnNvbGUiLCJlcnJvciIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwibGlzdGVuZXIiLCJhcHBseUhpZGRlbkF0dHJpYnV0ZXMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzcGxheSIsInJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMiLCJyZW1vdmVBdHRyaWJ1dGUiLCJ0cmFuc2l0aW9uU2hvdyIsInRpbWVvdXQiLCJyZWZsb3ciLCJjbGFzc0xpc3QiLCJhZGQiLCJ0cmFuc2l0aW9uSGlkZSIsInJlbW92ZSIsInRvZ2dsZSIsImlzSGlkZGVuIiwiaGFzSGlkZGVuQXR0cmlidXRlIiwiaXNEaXNwbGF5Tm9uZSIsImhhc1Zpc2libGVDbGFzcyIsImluY2x1ZGVzIiwiUHJpb3JpdHlOYXZTY3JvbGxlciIsInNlbGVjdG9yIiwibmF2U2VsZWN0b3IiLCJjb250ZW50U2VsZWN0b3IiLCJpdGVtU2VsZWN0b3IiLCJidXR0b25MZWZ0U2VsZWN0b3IiLCJidXR0b25SaWdodFNlbGVjdG9yIiwic2Nyb2xsU3RlcCIsIm5hdlNjcm9sbGVyIiwicXVlcnlTZWxlY3RvciIsInZhbGlkYXRlU2Nyb2xsU3RlcCIsIk51bWJlciIsImlzSW50ZWdlciIsInVuZGVmaW5lZCIsIkVycm9yIiwibmF2U2Nyb2xsZXJOYXYiLCJuYXZTY3JvbGxlckNvbnRlbnQiLCJuYXZTY3JvbGxlckNvbnRlbnRJdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJuYXZTY3JvbGxlckxlZnQiLCJuYXZTY3JvbGxlclJpZ2h0Iiwic2Nyb2xsaW5nIiwic2Nyb2xsQXZhaWxhYmxlTGVmdCIsInNjcm9sbEF2YWlsYWJsZVJpZ2h0Iiwic2Nyb2xsaW5nRGlyZWN0aW9uIiwic2Nyb2xsT3ZlcmZsb3ciLCJzZXRPdmVyZmxvdyIsImdldE92ZXJmbG93IiwidG9nZ2xlQnV0dG9ucyIsImNhbGN1bGF0ZVNjcm9sbFN0ZXAiLCJyZXF1ZXN0U2V0T3ZlcmZsb3ciLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInNjcm9sbFdpZHRoIiwic2Nyb2xsVmlld3BvcnQiLCJjbGllbnRXaWR0aCIsInNjcm9sbExlZnQiLCJzY3JvbGxMZWZ0Q29uZGl0aW9uIiwic2Nyb2xsUmlnaHRDb25kaXRpb24iLCJzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyIsInBhcnNlSW50IiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImdldFByb3BlcnR5VmFsdWUiLCJzY3JvbGxTdGVwQXZlcmFnZSIsIk1hdGgiLCJmbG9vciIsImxlbmd0aCIsIm1vdmVTY3JvbGxlciIsImRpcmVjdGlvbiIsInNjcm9sbERpc3RhbmNlIiwic2Nyb2xsQXZhaWxhYmxlIiwidHJhbnNmb3JtIiwic2V0U2Nyb2xsZXJQb3NpdGlvbiIsInRyYW5zZm9ybVZhbHVlIiwiYWJzIiwic3BsaXQiLCJvdmVyZmxvdyIsImluaXQiLCIkIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsInNlc3Npb25TdG9yYWdlIiwic2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsInNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCIsImRvY3VtZW50RWxlbWVudCIsImciLCJwdXNoIiwibSIsInNoaWZ0IiwicCIsImIiLCJxIiwiYyIsInUiLCJUeXBlRXJyb3IiLCJ0aGVuIiwiY2FsbCIsInYiLCJoIiwicHJvdG90eXBlIiwidyIsImsiLCJ4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyYWNlIiwiYWxsIiwiY2F0Y2giLCJhdHRhY2hFdmVudCIsImJvZHkiLCJyZWFkeVN0YXRlIiwiZGV0YWNoRXZlbnQiLCJjcmVhdGVUZXh0Tm9kZSIsImNzc1RleHQiLCJ6Iiwid2lkdGgiLCJBIiwiQiIsImZhbWlseSIsIndlaWdodCIsInN0cmV0Y2giLCJDIiwiRCIsIkUiLCJGIiwiRyIsIkoiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidmVuZG9yIiwiZXhlYyIsInVzZXJBZ2VudCIsImZvbnRzIiwiSyIsImZvbnQiLCJMIiwiam9pbiIsImxvYWQiLCJIIiwiRGF0ZSIsImdldFRpbWUiLCJNIiwiTiIsInkiLCJJIiwiaGlkZGVuIiwiZGlyIiwiRm9udEZhY2VPYnNlcnZlciIsInNhbnNOb3JtYWwiLCJzYW5zQm9sZCIsInNhbnNOb3JtYWxJdGFsaWMiLCJzZXJpZkJvb2siLCJzZXJpZkJvb2tJdGFsaWMiLCJzZXJpZkJvbGQiLCJzZXJpZkJvbGRJdGFsaWMiLCJzZXJpZkJsYWNrIiwic2VyaWZCbGFja0l0YWxpYyIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsInR5cGUiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwidmFsdWUiLCJnYSIsInJlYWR5IiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsImpRdWVyeSIsImhhc0NsYXNzIiwiY29weUN1cnJlbnRVUkwiLCJkdW1teSIsImhyZWYiLCJzZWxlY3QiLCJleGVjQ29tbWFuZCIsImNsaWNrIiwiZGF0YSIsInByZXZlbnREZWZhdWx0IiwicHJpbnQiLCJ1cmwiLCJhdHRyIiwib3BlbiIsInNldHVwUHJpbWFyeU5hdiIsInByaW1hcnlOYXZUcmFuc2l0aW9uZXIiLCJwcmltYXJ5TmF2VG9nZ2xlIiwiZXhwYW5kZWQiLCJ1c2VyTmF2VHJhbnNpdGlvbmVyIiwidXNlck5hdlRvZ2dsZSIsImRpdiIsImZyYWdtZW50IiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsInNlYXJjaFRyYW5zaXRpb25lciIsInNlYXJjaFZpc2libGUiLCJzZWFyY2hDbG9zZSIsImtleXVwIiwia2V5Q29kZSIsInByaW1hcnlOYXZFeHBhbmRlZCIsInVzZXJOYXZFeHBhbmRlZCIsInNlYXJjaElzVmlzaWJsZSIsInNldHVwU3ViTmF2IiwicHJpb3JpdHlOYXZTY3JvbGxlckRlZmF1bHQiLCJ3aWRnZXRUaXRsZSIsImNsb3Nlc3QiLCJmaW5kIiwiem9uZVRpdGxlIiwic2lkZWJhclNlY3Rpb25UaXRsZSIsImZuIiwidGV4dE5vZGVzIiwiY29udGVudHMiLCJmaWx0ZXIiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJub2RlVmFsdWUiLCJ0cmltIiwiZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCIsIm1hcmt1cCIsIm1hbmFnZUVtYWlscyIsImZvcm0iLCJyZXN0Um9vdCIsInVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QiLCJzaXRlX3VybCIsInJlc3RfbmFtZXNwYWNlIiwiZnVsbFVybCIsImNvbmZpcm1DaGFuZ2UiLCJuZXh0RW1haWxDb3VudCIsIm5ld1ByaW1hcnlFbWFpbCIsIm9sZFByaW1hcnlFbWFpbCIsInByaW1hcnlJZCIsImVtYWlsVG9SZW1vdmUiLCJjb25zb2xpZGF0ZWRFbWFpbHMiLCJuZXdFbWFpbHMiLCJhamF4Rm9ybURhdGEiLCJ0aGF0IiwicHJvcCIsIm9uIiwidmFsIiwicmVwbGFjZSIsInBhcmVudCIsImFwcGVuZCIsImV2ZW50IiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJnZXQiLCJwYXJlbnRzIiwiZmFkZU91dCIsImJlZm9yZSIsImJ1dHRvbiIsImJ1dHRvbkZvcm0iLCJzdWJtaXR0aW5nQnV0dG9uIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRvbmUiLCJtYXAiLCJpbmRleCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiaWQiLCJjbGlja1ZhbHVlIiwiY2F0ZWdvcnlQcmVmaXgiLCJjYXRlZ29yeVN1ZmZpeCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJpcyIsImFqYXh1cmwiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJodG1sIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxLQUFULENBQWVDLENBQWYsRUFBaUI7QUFBQ0MsRUFBQUEsUUFBUSxDQUFDQyxnQkFBVCxDQUEwQixXQUExQixFQUFzQyxVQUFTQyxDQUFULEVBQVc7QUFBQyxRQUFJQyxDQUFDLEdBQUNELENBQUMsQ0FBQ0UsTUFB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QUksQ0FBQ0csR0FBTCxFQUEzQixDQUFqQixDQVR5RSxDQVd6RTs7QUFDQXJLLEVBQUFBLENBQUMsQ0FBQ3NMLElBQUYsQ0FBUTtBQUNQckcsSUFBQUEsSUFBSSxFQUFFLE1BREM7QUFFUDJCLElBQUFBLEdBQUcsRUFBRStGLE9BRkU7QUFHUGxHLElBQUFBLElBQUksRUFBRTtBQUNMLGdCQUFVLDRDQURMO0FBRUwsZUFBU3lELElBQUksQ0FBQ0csR0FBTDtBQUZKLEtBSEM7QUFPUHVDLElBQUFBLE9BQU8sRUFBRSxpQkFBVUMsUUFBVixFQUFxQjtBQUM3QjdNLE1BQUFBLENBQUMsQ0FBRSxnQ0FBRixFQUFvQ2tLLElBQUksQ0FBQ0ssTUFBTCxFQUFwQyxDQUFELENBQXFEdUMsSUFBckQsQ0FBMkRELFFBQVEsQ0FBQ3BHLElBQVQsQ0FBY3NHLE9BQXpFOztBQUNBLFVBQUssU0FBU0YsUUFBUSxDQUFDcEcsSUFBVCxDQUFjdk8sSUFBNUIsRUFBbUM7QUFDbEM4SCxRQUFBQSxDQUFDLENBQUUsa0NBQUYsQ0FBRCxDQUF3Q3FLLEdBQXhDLENBQTZDLENBQTdDO0FBQ0EsT0FGRCxNQUVPO0FBQ05ySyxRQUFBQSxDQUFDLENBQUUsa0NBQUYsQ0FBRCxDQUF3Q3FLLEdBQXhDLENBQTZDLENBQTdDO0FBQ0E7QUFDRDtBQWRNLEdBQVI7QUFnQkEsQ0E1QkQiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB0bGl0ZSh0KXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZSl7dmFyIGk9ZS50YXJnZXQsbj10KGkpO258fChuPShpPWkucGFyZW50RWxlbWVudCkmJnQoaSkpLG4mJnRsaXRlLnNob3coaSxuLCEwKX0pfXRsaXRlLnNob3c9ZnVuY3Rpb24odCxlLGkpe3ZhciBuPVwiZGF0YS10bGl0ZVwiO2U9ZXx8e30sKHQudG9vbHRpcHx8ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiBvKCl7dGxpdGUuaGlkZSh0LCEwKX1mdW5jdGlvbiBsKCl7cnx8KHI9ZnVuY3Rpb24odCxlLGkpe2Z1bmN0aW9uIG4oKXtvLmNsYXNzTmFtZT1cInRsaXRlIHRsaXRlLVwiK3Irczt2YXIgZT10Lm9mZnNldFRvcCxpPXQub2Zmc2V0TGVmdDtvLm9mZnNldFBhcmVudD09PXQmJihlPWk9MCk7dmFyIG49dC5vZmZzZXRXaWR0aCxsPXQub2Zmc2V0SGVpZ2h0LGQ9by5vZmZzZXRIZWlnaHQsZj1vLm9mZnNldFdpZHRoLGE9aStuLzI7by5zdHlsZS50b3A9KFwic1wiPT09cj9lLWQtMTA6XCJuXCI9PT1yP2UrbCsxMDplK2wvMi1kLzIpK1wicHhcIixvLnN0eWxlLmxlZnQ9KFwid1wiPT09cz9pOlwiZVwiPT09cz9pK24tZjpcIndcIj09PXI/aStuKzEwOlwiZVwiPT09cj9pLWYtMTA6YS1mLzIpK1wicHhcIn12YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxsPWkuZ3Jhdnx8dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRsaXRlXCIpfHxcIm5cIjtvLmlubmVySFRNTD1lLHQuYXBwZW5kQ2hpbGQobyk7dmFyIHI9bFswXXx8XCJcIixzPWxbMV18fFwiXCI7bigpO3ZhciBkPW8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuXCJzXCI9PT1yJiZkLnRvcDwwPyhyPVwiblwiLG4oKSk6XCJuXCI9PT1yJiZkLmJvdHRvbT53aW5kb3cuaW5uZXJIZWlnaHQ/KHI9XCJzXCIsbigpKTpcImVcIj09PXImJmQubGVmdDwwPyhyPVwid1wiLG4oKSk6XCJ3XCI9PT1yJiZkLnJpZ2h0PndpbmRvdy5pbm5lcldpZHRoJiYocj1cImVcIixuKCkpLG8uY2xhc3NOYW1lKz1cIiB0bGl0ZS12aXNpYmxlXCIsb30odCxkLGUpKX12YXIgcixzLGQ7cmV0dXJuIHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLG8pLHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIixvKSx0LnRvb2x0aXA9e3Nob3c6ZnVuY3Rpb24oKXtkPXQudGl0bGV8fHQuZ2V0QXR0cmlidXRlKG4pfHxkLHQudGl0bGU9XCJcIix0LnNldEF0dHJpYnV0ZShuLFwiXCIpLGQmJiFzJiYocz1zZXRUaW1lb3V0KGwsaT8xNTA6MSkpfSxoaWRlOmZ1bmN0aW9uKHQpe2lmKGk9PT10KXtzPWNsZWFyVGltZW91dChzKTt2YXIgZT1yJiZyLnBhcmVudE5vZGU7ZSYmZS5yZW1vdmVDaGlsZChyKSxyPXZvaWQgMH19fX0odCxlKSkuc2hvdygpfSx0bGl0ZS5oaWRlPWZ1bmN0aW9uKHQsZSl7dC50b29sdGlwJiZ0LnRvb2x0aXAuaGlkZShlKX0sXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz10bGl0ZSk7IiwiLyoqIFxuICogTGlicmFyeSBjb2RlXG4gKiBVc2luZyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9AY2xvdWRmb3VyL3RyYW5zaXRpb24taGlkZGVuLWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCh7XG4gIGVsZW1lbnQsXG4gIHZpc2libGVDbGFzcyxcbiAgd2FpdE1vZGUgPSAndHJhbnNpdGlvbmVuZCcsXG4gIHRpbWVvdXREdXJhdGlvbixcbiAgaGlkZU1vZGUgPSAnaGlkZGVuJyxcbiAgZGlzcGxheVZhbHVlID0gJ2Jsb2NrJ1xufSkge1xuICBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0JyAmJiB0eXBlb2YgdGltZW91dER1cmF0aW9uICE9PSAnbnVtYmVyJykge1xuICAgIGNvbnNvbGUuZXJyb3IoYFxuICAgICAgV2hlbiBjYWxsaW5nIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50IHdpdGggd2FpdE1vZGUgc2V0IHRvIHRpbWVvdXQsXG4gICAgICB5b3UgbXVzdCBwYXNzIGluIGEgbnVtYmVyIGZvciB0aW1lb3V0RHVyYXRpb24uXG4gICAgYCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEb24ndCB3YWl0IGZvciBleGl0IHRyYW5zaXRpb25zIGlmIGEgdXNlciBwcmVmZXJzIHJlZHVjZWQgbW90aW9uLlxuICAvLyBJZGVhbGx5IHRyYW5zaXRpb25zIHdpbGwgYmUgZGlzYWJsZWQgaW4gQ1NTLCB3aGljaCBtZWFucyB3ZSBzaG91bGQgbm90IHdhaXRcbiAgLy8gYmVmb3JlIGFkZGluZyBgaGlkZGVuYC5cbiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKScpLm1hdGNoZXMpIHtcbiAgICB3YWl0TW9kZSA9ICdpbW1lZGlhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGxpc3RlbmVyIHRvIGFkZCBgaGlkZGVuYCBhZnRlciBvdXIgYW5pbWF0aW9ucyBjb21wbGV0ZS5cbiAgICogVGhpcyBsaXN0ZW5lciB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgY29tcGxldGluZy5cbiAgICovXG4gIGNvbnN0IGxpc3RlbmVyID0gZSA9PiB7XG4gICAgLy8gQ29uZmlybSBgdHJhbnNpdGlvbmVuZGAgd2FzIGNhbGxlZCBvbiAgb3VyIGBlbGVtZW50YCBhbmQgZGlkbid0IGJ1YmJsZVxuICAgIC8vIHVwIGZyb20gYSBjaGlsZCBlbGVtZW50LlxuICAgIGlmIChlLnRhcmdldCA9PT0gZWxlbWVudCkge1xuICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheVZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvblNob3coKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgbGlzdGVuZXIgc2hvdWxkbid0IGJlIGhlcmUgYnV0IGlmIHNvbWVvbmUgc3BhbXMgdGhlIHRvZ2dsZVxuICAgICAgICogb3ZlciBhbmQgb3ZlciByZWFsbHkgZmFzdCBpdCBjYW4gaW5jb3JyZWN0bHkgc3RpY2sgYXJvdW5kLlxuICAgICAgICogV2UgcmVtb3ZlIGl0IGp1c3QgdG8gYmUgc2FmZS5cbiAgICAgICAqL1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFNpbWlsYXJseSwgd2UnbGwgY2xlYXIgdGhlIHRpbWVvdXQgaW4gY2FzZSBpdCdzIHN0aWxsIGhhbmdpbmcgYXJvdW5kLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIC8qKlxuICAgICAgICogRm9yY2UgYSBicm93c2VyIHJlLXBhaW50IHNvIHRoZSBicm93c2VyIHdpbGwgcmVhbGl6ZSB0aGVcbiAgICAgICAqIGVsZW1lbnQgaXMgbm8gbG9uZ2VyIGBoaWRkZW5gIGFuZCBhbGxvdyB0cmFuc2l0aW9ucy5cbiAgICAgICAqL1xuICAgICAgY29uc3QgcmVmbG93ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIaWRlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvbkhpZGUoKSB7XG4gICAgICBpZiAod2FpdE1vZGUgPT09ICd0cmFuc2l0aW9uZW5kJykge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgICB9IGVsc2UgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICAgIH0sIHRpbWVvdXREdXJhdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoaXMgY2xhc3MgdG8gdHJpZ2dlciBvdXIgYW5pbWF0aW9uXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSBlbGVtZW50J3MgdmlzaWJpbGl0eVxuICAgICAqL1xuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUZWxsIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaGlkZGVuIG9yIG5vdC5cbiAgICAgKi9cbiAgICBpc0hpZGRlbigpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGhpZGRlbiBhdHRyaWJ1dGUgZG9lcyBub3QgcmVxdWlyZSBhIHZhbHVlLiBTaW5jZSBhbiBlbXB0eSBzdHJpbmcgaXNcbiAgICAgICAqIGZhbHN5LCBidXQgc2hvd3MgdGhlIHByZXNlbmNlIG9mIGFuIGF0dHJpYnV0ZSB3ZSBjb21wYXJlIHRvIGBudWxsYFxuICAgICAgICovXG4gICAgICBjb25zdCBoYXNIaWRkZW5BdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaGlkZGVuJykgIT09IG51bGw7XG5cbiAgICAgIGNvbnN0IGlzRGlzcGxheU5vbmUgPSBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJztcblxuICAgICAgY29uc3QgaGFzVmlzaWJsZUNsYXNzID0gWy4uLmVsZW1lbnQuY2xhc3NMaXN0XS5pbmNsdWRlcyh2aXNpYmxlQ2xhc3MpO1xuXG4gICAgICByZXR1cm4gaGFzSGlkZGVuQXR0cmlidXRlIHx8IGlzRGlzcGxheU5vbmUgfHwgIWhhc1Zpc2libGVDbGFzcztcbiAgICB9LFxuXG4gICAgLy8gQSBwbGFjZWhvbGRlciBmb3Igb3VyIGB0aW1lb3V0YFxuICAgIHRpbWVvdXQ6IG51bGxcbiAgfTtcbn0iLCIvKipcbiAgUHJpb3JpdHkrIGhvcml6b250YWwgc2Nyb2xsaW5nIG1lbnUuXG5cbiAgQHBhcmFtIHtPYmplY3R9IG9iamVjdCAtIENvbnRhaW5lciBmb3IgYWxsIG9wdGlvbnMuXG4gICAgQHBhcmFtIHtzdHJpbmcgfHwgRE9NIG5vZGV9IHNlbGVjdG9yIC0gRWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gbmF2U2VsZWN0b3IgLSBOYXYgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gY29udGVudFNlbGVjdG9yIC0gQ29udGVudCBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBpdGVtU2VsZWN0b3IgLSBJdGVtcyBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uTGVmdFNlbGVjdG9yIC0gTGVmdCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvblJpZ2h0U2VsZWN0b3IgLSBSaWdodCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtpbnRlZ2VyIHx8IHN0cmluZ30gc2Nyb2xsU3RlcCAtIEFtb3VudCB0byBzY3JvbGwgb24gYnV0dG9uIGNsaWNrLiAnYXZlcmFnZScgZ2V0cyB0aGUgYXZlcmFnZSBsaW5rIHdpZHRoLlxuKi9cblxuY29uc3QgUHJpb3JpdHlOYXZTY3JvbGxlciA9IGZ1bmN0aW9uKHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlcicsXG4gICAgbmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItbmF2JyxcbiAgICBjb250ZW50U2VsZWN0b3I6IGNvbnRlbnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWNvbnRlbnQnLFxuICAgIGl0ZW1TZWxlY3RvcjogaXRlbVNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItaXRlbScsXG4gICAgYnV0dG9uTGVmdFNlbGVjdG9yOiBidXR0b25MZWZ0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuICAgIGJ1dHRvblJpZ2h0U2VsZWN0b3I6IGJ1dHRvblJpZ2h0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0JyxcbiAgICBzY3JvbGxTdGVwOiBzY3JvbGxTdGVwID0gODBcbiAgfSA9IHt9KSB7XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXIgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiBzZWxlY3RvcjtcblxuICBjb25zdCB2YWxpZGF0ZVNjcm9sbFN0ZXAgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIoc2Nyb2xsU3RlcCkgfHwgc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnO1xuICB9XG5cbiAgaWYgKG5hdlNjcm9sbGVyID09PSB1bmRlZmluZWQgfHwgbmF2U2Nyb2xsZXIgPT09IG51bGwgfHwgIXZhbGlkYXRlU2Nyb2xsU3RlcCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGVyZSBpcyBzb21ldGhpbmcgd3JvbmcsIGNoZWNrIHlvdXIgb3B0aW9ucy4nKTtcbiAgfVxuXG4gIGNvbnN0IG5hdlNjcm9sbGVyTmF2ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihuYXZTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoY29udGVudFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMgPSBuYXZTY3JvbGxlckNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChpdGVtU2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckxlZnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvbkxlZnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyUmlnaHQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvblJpZ2h0U2VsZWN0b3IpO1xuXG4gIGxldCBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZUxlZnQgPSAwO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSAwO1xuICBsZXQgc2Nyb2xsaW5nRGlyZWN0aW9uID0gJyc7XG4gIGxldCBzY3JvbGxPdmVyZmxvdyA9ICcnO1xuICBsZXQgdGltZW91dDtcblxuXG4gIC8vIFNldHMgb3ZlcmZsb3cgYW5kIHRvZ2dsZSBidXR0b25zIGFjY29yZGluZ2x5XG4gIGNvbnN0IHNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgc2Nyb2xsT3ZlcmZsb3cgPSBnZXRPdmVyZmxvdygpO1xuICAgIHRvZ2dsZUJ1dHRvbnMoc2Nyb2xsT3ZlcmZsb3cpO1xuICAgIGNhbGN1bGF0ZVNjcm9sbFN0ZXAoKTtcbiAgfVxuXG5cbiAgLy8gRGVib3VuY2Ugc2V0dGluZyB0aGUgb3ZlcmZsb3cgd2l0aCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgY29uc3QgcmVxdWVzdFNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVvdXQpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aW1lb3V0KTtcblxuICAgIHRpbWVvdXQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHNldE92ZXJmbG93KCk7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8vIEdldHMgdGhlIG92ZXJmbG93IGF2YWlsYWJsZSBvbiB0aGUgbmF2IHNjcm9sbGVyXG4gIGNvbnN0IGdldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNjcm9sbFdpZHRoID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGg7XG4gICAgbGV0IHNjcm9sbFZpZXdwb3J0ID0gbmF2U2Nyb2xsZXJOYXYuY2xpZW50V2lkdGg7XG4gICAgbGV0IHNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0O1xuXG4gICAgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSBzY3JvbGxXaWR0aCAtIChzY3JvbGxWaWV3cG9ydCArIHNjcm9sbExlZnQpO1xuXG4gICAgLy8gMSBpbnN0ZWFkIG9mIDAgdG8gY29tcGVuc2F0ZSBmb3IgbnVtYmVyIHJvdW5kaW5nXG4gICAgbGV0IHNjcm9sbExlZnRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVMZWZ0ID4gMTtcbiAgICBsZXQgc2Nyb2xsUmlnaHRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVSaWdodCA+IDE7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhzY3JvbGxXaWR0aCwgc2Nyb2xsVmlld3BvcnQsIHNjcm9sbEF2YWlsYWJsZUxlZnQsIHNjcm9sbEF2YWlsYWJsZVJpZ2h0KTtcblxuICAgIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uICYmIHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2JvdGgnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2xlZnQnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuICdub25lJztcbiAgICB9XG5cbiAgfVxuXG5cbiAgLy8gQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHN0ZXAgYmFzZWQgb24gdGhlIHdpZHRoIG9mIHRoZSBzY3JvbGxlciBhbmQgdGhlIG51bWJlciBvZiBsaW5rc1xuICBjb25zdCBjYWxjdWxhdGVTY3JvbGxTdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJykge1xuICAgICAgbGV0IHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGggLSAocGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctbGVmdCcpKSArIHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpKTtcblxuICAgICAgbGV0IHNjcm9sbFN0ZXBBdmVyYWdlID0gTWF0aC5mbG9vcihzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyAvIG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zLmxlbmd0aCk7XG5cbiAgICAgIHNjcm9sbFN0ZXAgPSBzY3JvbGxTdGVwQXZlcmFnZTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIE1vdmUgdGhlIHNjcm9sbGVyIHdpdGggYSB0cmFuc2Zvcm1cbiAgY29uc3QgbW92ZVNjcm9sbGVyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG5cbiAgICBpZiAoc2Nyb2xsaW5nID09PSB0cnVlIHx8IChzY3JvbGxPdmVyZmxvdyAhPT0gZGlyZWN0aW9uICYmIHNjcm9sbE92ZXJmbG93ICE9PSAnYm90aCcpKSByZXR1cm47XG5cbiAgICBsZXQgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxTdGVwO1xuICAgIGxldCBzY3JvbGxBdmFpbGFibGUgPSBkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IHNjcm9sbEF2YWlsYWJsZUxlZnQgOiBzY3JvbGxBdmFpbGFibGVSaWdodDtcblxuICAgIC8vIElmIHRoZXJlIHdpbGwgYmUgbGVzcyB0aGFuIDI1JSBvZiB0aGUgbGFzdCBzdGVwIHZpc2libGUgdGhlbiBzY3JvbGwgdG8gdGhlIGVuZFxuICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCAoc2Nyb2xsU3RlcCAqIDEuNzUpKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbEF2YWlsYWJsZTtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSAqPSAtMTtcblxuICAgICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IHNjcm9sbFN0ZXApIHtcbiAgICAgICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NuYXAtYWxpZ24tZW5kJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIHNjcm9sbERpc3RhbmNlICsgJ3B4KSc7XG5cbiAgICBzY3JvbGxpbmdEaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgc2Nyb2xsaW5nID0gdHJ1ZTtcbiAgfVxuXG5cbiAgLy8gU2V0IHRoZSBzY3JvbGxlciBwb3NpdGlvbiBhbmQgcmVtb3ZlcyB0cmFuc2Zvcm0sIGNhbGxlZCBhZnRlciBtb3ZlU2Nyb2xsZXIoKSBpbiB0aGUgdHJhbnNpdGlvbmVuZCBldmVudFxuICBjb25zdCBzZXRTY3JvbGxlclBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50LCBudWxsKTtcbiAgICB2YXIgdHJhbnNmb3JtID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJyk7XG4gICAgdmFyIHRyYW5zZm9ybVZhbHVlID0gTWF0aC5hYnMocGFyc2VJbnQodHJhbnNmb3JtLnNwbGl0KCcsJylbNF0pIHx8IDApO1xuXG4gICAgaWYgKHNjcm9sbGluZ0RpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICB0cmFuc2Zvcm1WYWx1ZSAqPSAtMTtcbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbiAgICBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCArIHRyYW5zZm9ybVZhbHVlO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJywgJ3NuYXAtYWxpZ24tZW5kJyk7XG5cbiAgICBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgfVxuXG5cbiAgLy8gVG9nZ2xlIGJ1dHRvbnMgZGVwZW5kaW5nIG9uIG92ZXJmbG93XG4gIGNvbnN0IHRvZ2dsZUJ1dHRvbnMgPSBmdW5jdGlvbihvdmVyZmxvdykge1xuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAnbGVmdCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdyaWdodCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH1cblxuXG4gIGNvbnN0IGluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgIHNldE92ZXJmbG93KCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlck5hdi5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgc2V0U2Nyb2xsZXJQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJMZWZ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdsZWZ0Jyk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlclJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdyaWdodCcpO1xuICAgIH0pO1xuXG4gIH07XG5cblxuICAvLyBTZWxmIGluaXRcbiAgaW5pdCgpO1xuXG5cbiAgLy8gUmV2ZWFsIEFQSVxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcblxufTtcblxuLy9leHBvcnQgZGVmYXVsdCBQcmlvcml0eU5hdlNjcm9sbGVyO1xuIiwiJCggJ2h0bWwnICkucmVtb3ZlQ2xhc3MoICduby1qcycgKS5hZGRDbGFzcyggJ2pzJyApO1xuIiwiLy8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3NcbmlmICggc2Vzc2lvblN0b3JhZ2Uuc2VyaWZGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCAmJiBzZXNzaW9uU3RvcmFnZS5zYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgKSB7XG5cdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzZXJpZi1mb250cy1sb2FkZWQgc2Fucy1mb250cy1sb2FkZWQnO1xufSBlbHNlIHtcblx0LyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjEuMCAtIMKpIEJyYW0gU3RlaW4uIExpY2Vuc2U6IEJTRC0zLUNsYXVzZSAqLyggZnVuY3Rpb24oKSB7XG5cdFx0J3VzZSBzdHJpY3QnO3ZhciBmLFxuXHRcdFx0ZyA9IFtdO2Z1bmN0aW9uIGwoIGEgKSB7XG5cdFx0XHRnLnB1c2goIGEgKTsxID09IGcubGVuZ3RoICYmIGYoKTtcblx0XHR9IGZ1bmN0aW9uIG0oKSB7XG5cdFx0XHRmb3IgKCA7Zy5sZW5ndGg7ICkge1xuXHRcdFx0XHRnWzBdKCksIGcuc2hpZnQoKTtcblx0XHRcdH1cblx0XHR9ZiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0c2V0VGltZW91dCggbSApO1xuXHRcdH07ZnVuY3Rpb24gbiggYSApIHtcblx0XHRcdHRoaXMuYSA9IHA7dGhpcy5iID0gdm9pZCAwO3RoaXMuZiA9IFtdO3ZhciBiID0gdGhpczt0cnkge1xuXHRcdFx0XHRhKCBmdW5jdGlvbiggYSApIHtcblx0XHRcdFx0XHRxKCBiLCBhICk7XG5cdFx0XHRcdH0sIGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHRcdHIoIGIsIGEgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSBjYXRjaCAoIGMgKSB7XG5cdFx0XHRcdHIoIGIsIGMgKTtcblx0XHRcdH1cblx0XHR9IHZhciBwID0gMjtmdW5jdGlvbiB0KCBhICkge1xuXHRcdFx0cmV0dXJuIG5ldyBuKCBmdW5jdGlvbiggYiwgYyApIHtcblx0XHRcdFx0YyggYSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZnVuY3Rpb24gdSggYSApIHtcblx0XHRcdHJldHVybiBuZXcgbiggZnVuY3Rpb24oIGIgKSB7XG5cdFx0XHRcdGIoIGEgKTtcblx0XHRcdH0gKTtcblx0XHR9IGZ1bmN0aW9uIHEoIGEsIGIgKSB7XG5cdFx0XHRpZiAoIGEuYSA9PSBwICkge1xuXHRcdFx0XHRpZiAoIGIgPT0gYSApIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yO1xuXHRcdFx0XHR9IHZhciBjID0gISAxO3RyeSB7XG5cdFx0XHRcdFx0dmFyIGQgPSBiICYmIGIudGhlbjtpZiAoIG51bGwgIT0gYiAmJiAnb2JqZWN0JyA9PT0gdHlwZW9mIGIgJiYgJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGQgKSB7XG5cdFx0XHRcdFx0XHRkLmNhbGwoIGIsIGZ1bmN0aW9uKCBiICkge1xuXHRcdFx0XHRcdFx0XHRjIHx8IHEoIGEsIGIgKTtjID0gISAwO1xuXHRcdFx0XHRcdFx0fSwgZnVuY3Rpb24oIGIgKSB7XG5cdFx0XHRcdFx0XHRcdGMgfHwgciggYSwgYiApO2MgPSAhIDA7XG5cdFx0XHRcdFx0XHR9ICk7cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0XHRcdFx0YyB8fCByKCBhLCBlICk7cmV0dXJuO1xuXHRcdFx0XHR9YS5hID0gMDthLmIgPSBiO3YoIGEgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZnVuY3Rpb24gciggYSwgYiApIHtcblx0XHRcdGlmICggYS5hID09IHAgKSB7XG5cdFx0XHRcdGlmICggYiA9PSBhICkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3I7XG5cdFx0XHRcdH1hLmEgPSAxO2EuYiA9IGI7diggYSApO1xuXHRcdFx0fVxuXHRcdH0gZnVuY3Rpb24gdiggYSApIHtcblx0XHRcdGwoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIGEuYSAhPSBwICkge1xuXHRcdFx0XHRcdGZvciAoIDthLmYubGVuZ3RoOyApIHtcblx0XHRcdFx0XHRcdHZhciBiID0gYS5mLnNoaWZ0KCksXG5cdFx0XHRcdFx0XHRcdGMgPSBiWzBdLFxuXHRcdFx0XHRcdFx0XHRkID0gYlsxXSxcblx0XHRcdFx0XHRcdFx0ZSA9IGJbMl0sXG5cdFx0XHRcdFx0XHRcdGIgPSBiWzNdO3RyeSB7XG5cdFx0XHRcdFx0XHRcdDAgPT0gYS5hID8gJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGMgPyBlKCBjLmNhbGwoIHZvaWQgMCwgYS5iICkgKSA6IGUoIGEuYiApIDogMSA9PSBhLmEgJiYgKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgZCA/IGUoIGQuY2FsbCggdm9pZCAwLCBhLmIgKSApIDogYiggYS5iICkgKTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKCBoICkge1xuXHRcdFx0XHRcdFx0XHRiKCBoICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fW4ucHJvdG90eXBlLmcgPSBmdW5jdGlvbiggYSApIHtcblx0XHRcdHJldHVybiB0aGlzLmMoIHZvaWQgMCwgYSApO1xuXHRcdH07bi5wcm90b3R5cGUuYyA9IGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0dmFyIGMgPSB0aGlzO3JldHVybiBuZXcgbiggZnVuY3Rpb24oIGQsIGUgKSB7XG5cdFx0XHRcdGMuZi5wdXNoKCBbIGEsIGIsIGQsIGUgXSApO3YoIGMgKTtcblx0XHRcdH0gKTtcblx0XHR9O1xuXHRcdGZ1bmN0aW9uIHcoIGEgKSB7XG5cdFx0XHRyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBiLCBjICkge1xuXHRcdFx0XHRmdW5jdGlvbiBkKCBjICkge1xuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbiggZCApIHtcblx0XHRcdFx0XHRcdGhbY10gPSBkO2UgKz0gMTtlID09IGEubGVuZ3RoICYmIGIoIGggKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9IHZhciBlID0gMCxcblx0XHRcdFx0XHRoID0gW107MCA9PSBhLmxlbmd0aCAmJiBiKCBoICk7Zm9yICggdmFyIGsgPSAwO2sgPCBhLmxlbmd0aDtrICs9IDEgKSB7XG5cdFx0XHRcdFx0dSggYVtrXSApLmMoIGQoIGsgKSwgYyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSBmdW5jdGlvbiB4KCBhICkge1xuXHRcdFx0cmV0dXJuIG5ldyBuKCBmdW5jdGlvbiggYiwgYyApIHtcblx0XHRcdFx0Zm9yICggdmFyIGQgPSAwO2QgPCBhLmxlbmd0aDtkICs9IDEgKSB7XG5cdFx0XHRcdFx0dSggYVtkXSApLmMoIGIsIGMgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH13aW5kb3cuUHJvbWlzZSB8fCAoIHdpbmRvdy5Qcm9taXNlID0gbiwgd2luZG93LlByb21pc2UucmVzb2x2ZSA9IHUsIHdpbmRvdy5Qcm9taXNlLnJlamVjdCA9IHQsIHdpbmRvdy5Qcm9taXNlLnJhY2UgPSB4LCB3aW5kb3cuUHJvbWlzZS5hbGwgPSB3LCB3aW5kb3cuUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IG4ucHJvdG90eXBlLmMsIHdpbmRvdy5Qcm9taXNlLnByb3RvdHlwZS5jYXRjaCA9IG4ucHJvdG90eXBlLmcgKTtcblx0fSgpICk7XG5cblx0KCBmdW5jdGlvbigpIHtcblx0XHRmdW5jdGlvbiBsKCBhLCBiICkge1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA/IGEuYWRkRXZlbnRMaXN0ZW5lciggJ3Njcm9sbCcsIGIsICEgMSApIDogYS5hdHRhY2hFdmVudCggJ3Njcm9sbCcsIGIgKTtcblx0XHR9IGZ1bmN0aW9uIG0oIGEgKSB7XG5cdFx0XHRkb2N1bWVudC5ib2R5ID8gYSgpIDogZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA/IGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gYygpIHtcblx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBjICk7YSgpO1xuXHRcdFx0fSApIDogZG9jdW1lbnQuYXR0YWNoRXZlbnQoICdvbnJlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbiBrKCkge1xuXHRcdFx0XHRpZiAoICdpbnRlcmFjdGl2ZScgPT0gZG9jdW1lbnQucmVhZHlTdGF0ZSB8fCAnY29tcGxldGUnID09IGRvY3VtZW50LnJlYWR5U3RhdGUgKSB7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZGV0YWNoRXZlbnQoICdvbnJlYWR5c3RhdGVjaGFuZ2UnLCBrICksIGEoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0gZnVuY3Rpb24gdCggYSApIHtcblx0XHRcdHRoaXMuYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7dGhpcy5hLnNldEF0dHJpYnV0ZSggJ2FyaWEtaGlkZGVuJywgJ3RydWUnICk7dGhpcy5hLmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSggYSApICk7dGhpcy5iID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICk7dGhpcy5jID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICk7dGhpcy5oID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICk7dGhpcy5mID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NwYW4nICk7dGhpcy5nID0gLTE7dGhpcy5iLnN0eWxlLmNzc1RleHQgPSAnbWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7Jzt0aGlzLmMuc3R5bGUuY3NzVGV4dCA9ICdtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDsnO1xuXHRcdFx0dGhpcy5mLnN0eWxlLmNzc1RleHQgPSAnbWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7Jzt0aGlzLmguc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyMDAlO2hlaWdodDoyMDAlO2ZvbnQtc2l6ZToxNnB4O21heC13aWR0aDpub25lOyc7dGhpcy5iLmFwcGVuZENoaWxkKCB0aGlzLmggKTt0aGlzLmMuYXBwZW5kQ2hpbGQoIHRoaXMuZiApO3RoaXMuYS5hcHBlbmRDaGlsZCggdGhpcy5iICk7dGhpcy5hLmFwcGVuZENoaWxkKCB0aGlzLmMgKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gdSggYSwgYiApIHtcblx0XHRcdGEuYS5zdHlsZS5jc3NUZXh0ID0gJ21heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1zeW50aGVzaXM6bm9uZTtmb250OicgKyBiICsgJzsnO1xuXHRcdH0gZnVuY3Rpb24geiggYSApIHtcblx0XHRcdHZhciBiID0gYS5hLm9mZnNldFdpZHRoLFxuXHRcdFx0XHRjID0gYiArIDEwMDthLmYuc3R5bGUud2lkdGggPSBjICsgJ3B4JzthLmMuc2Nyb2xsTGVmdCA9IGM7YS5iLnNjcm9sbExlZnQgPSBhLmIuc2Nyb2xsV2lkdGggKyAxMDA7cmV0dXJuIGEuZyAhPT0gYiA/ICggYS5nID0gYiwgISAwICkgOiAhIDE7XG5cdFx0fSBmdW5jdGlvbiBBKCBhLCBiICkge1xuXHRcdFx0ZnVuY3Rpb24gYygpIHtcblx0XHRcdFx0dmFyIGEgPSBrO3ooIGEgKSAmJiBhLmEucGFyZW50Tm9kZSAmJiBiKCBhLmcgKTtcblx0XHRcdH0gdmFyIGsgPSBhO2woIGEuYiwgYyApO2woIGEuYywgYyApO3ooIGEgKTtcblx0XHR9IGZ1bmN0aW9uIEIoIGEsIGIgKSB7XG5cdFx0XHR2YXIgYyA9IGIgfHwge307dGhpcy5mYW1pbHkgPSBhO3RoaXMuc3R5bGUgPSBjLnN0eWxlIHx8ICdub3JtYWwnO3RoaXMud2VpZ2h0ID0gYy53ZWlnaHQgfHwgJ25vcm1hbCc7dGhpcy5zdHJldGNoID0gYy5zdHJldGNoIHx8ICdub3JtYWwnO1xuXHRcdH0gdmFyIEMgPSBudWxsLFxuXHRcdFx0RCA9IG51bGwsXG5cdFx0XHRFID0gbnVsbCxcblx0XHRcdEYgPSBudWxsO2Z1bmN0aW9uIEcoKSB7XG5cdFx0XHRpZiAoIG51bGwgPT09IEQgKSB7XG5cdFx0XHRcdGlmICggSigpICYmIC9BcHBsZS8udGVzdCggd2luZG93Lm5hdmlnYXRvci52ZW5kb3IgKSApIHtcblx0XHRcdFx0XHR2YXIgYSA9IC9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpKD86XFwuKFswLTldKykpLy5leGVjKCB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCApO0QgPSAhISBhICYmIDYwMyA+IHBhcnNlSW50KCBhWzFdLCAxMCApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdEQgPSAhIDE7XG5cdFx0XHRcdH1cblx0XHRcdH0gcmV0dXJuIEQ7XG5cdFx0fSBmdW5jdGlvbiBKKCkge1xuXHRcdFx0bnVsbCA9PT0gRiAmJiAoIEYgPSAhISBkb2N1bWVudC5mb250cyApO3JldHVybiBGO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBLKCkge1xuXHRcdFx0aWYgKCBudWxsID09PSBFICkge1xuXHRcdFx0XHR2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7dHJ5IHtcblx0XHRcdFx0XHRhLnN0eWxlLmZvbnQgPSAnY29uZGVuc2VkIDEwMHB4IHNhbnMtc2VyaWYnO1xuXHRcdFx0XHR9IGNhdGNoICggYiApIHt9RSA9ICcnICE9PSBhLnN0eWxlLmZvbnQ7XG5cdFx0XHR9IHJldHVybiBFO1xuXHRcdH0gZnVuY3Rpb24gTCggYSwgYiApIHtcblx0XHRcdHJldHVybiBbIGEuc3R5bGUsIGEud2VpZ2h0LCBLKCkgPyBhLnN0cmV0Y2ggOiAnJywgJzEwMHB4JywgYiBdLmpvaW4oICcgJyApO1xuXHRcdH1cblx0XHRCLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHR2YXIgYyA9IHRoaXMsXG5cdFx0XHRcdGsgPSBhIHx8ICdCRVNic3d5Jyxcblx0XHRcdFx0ciA9IDAsXG5cdFx0XHRcdG4gPSBiIHx8IDNFMyxcblx0XHRcdFx0SCA9ICggbmV3IERhdGUgKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKCBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdFx0aWYgKCBKKCkgJiYgISBHKCkgKSB7XG5cdFx0XHRcdFx0dmFyIE0gPSBuZXcgUHJvbWlzZSggZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHRcdFx0XHRcdGZ1bmN0aW9uIGUoKSB7XG5cdFx0XHRcdFx0XHRcdFx0KCBuZXcgRGF0ZSApLmdldFRpbWUoKSAtIEggPj0gbiA/IGIoIEVycm9yKCAnJyArIG4gKyAnbXMgdGltZW91dCBleGNlZWRlZCcgKSApIDogZG9jdW1lbnQuZm9udHMubG9hZCggTCggYywgJ1wiJyArIGMuZmFtaWx5ICsgJ1wiJyApLCBrICkudGhlbiggZnVuY3Rpb24oIGMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHQxIDw9IGMubGVuZ3RoID8gYSgpIDogc2V0VGltZW91dCggZSwgMjUgKTtcblx0XHRcdFx0XHRcdFx0XHR9LCBiICk7XG5cdFx0XHRcdFx0XHRcdH1lKCk7XG5cdFx0XHRcdFx0XHR9ICksXG5cdFx0XHRcdFx0XHROID0gbmV3IFByb21pc2UoIGZ1bmN0aW9uKCBhLCBjICkge1xuXHRcdFx0XHRcdFx0XHRyID0gc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0YyggRXJyb3IoICcnICsgbiArICdtcyB0aW1lb3V0IGV4Y2VlZGVkJyApICk7XG5cdFx0XHRcdFx0XHRcdH0sIG4gKTtcblx0XHRcdFx0XHRcdH0gKTtQcm9taXNlLnJhY2UoIFsgTiwgTSBdICkudGhlbiggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQoIHIgKTthKCBjICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRiICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bSggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRmdW5jdGlvbiB2KCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgYjtpZiAoIGIgPSAtMSAhPSBmICYmIC0xICE9IGcgfHwgLTEgIT0gZiAmJiAtMSAhPSBoIHx8IC0xICE9IGcgJiYgLTEgIT0gaCApIHtcblx0XHRcdFx0XHRcdFx0XHQoIGIgPSBmICE9IGcgJiYgZiAhPSBoICYmIGcgIT0gaCApIHx8ICggbnVsbCA9PT0gQyAmJiAoIGIgPSAvQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyggd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQgKSwgQyA9ICEhIGIgJiYgKCA1MzYgPiBwYXJzZUludCggYlsxXSwgMTAgKSB8fCA1MzYgPT09IHBhcnNlSW50KCBiWzFdLCAxMCApICYmIDExID49IHBhcnNlSW50KCBiWzJdLCAxMCApICkgKSwgYiA9IEMgJiYgKCBmID09IHcgJiYgZyA9PSB3ICYmIGggPT0gdyB8fCBmID09IHggJiYgZyA9PSB4ICYmIGggPT0geCB8fCBmID09IHkgJiYgZyA9PSB5ICYmIGggPT0geSApICksIGIgPSAhIGI7XG5cdFx0XHRcdFx0XHRcdH1iICYmICggZC5wYXJlbnROb2RlICYmIGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZCApLCBjbGVhclRpbWVvdXQoIHIgKSwgYSggYyApICk7XG5cdFx0XHRcdFx0XHR9IGZ1bmN0aW9uIEkoKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggKCBuZXcgRGF0ZSApLmdldFRpbWUoKSAtIEggPj0gbiApIHtcblx0XHRcdFx0XHRcdFx0XHRkLnBhcmVudE5vZGUgJiYgZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBkICksIGIoIEVycm9yKCAnJyArXG5cdG4gKyAnbXMgdGltZW91dCBleGNlZWRlZCcgKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBhID0gZG9jdW1lbnQuaGlkZGVuO2lmICggISAwID09PSBhIHx8IHZvaWQgMCA9PT0gYSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdGYgPSBlLmEub2Zmc2V0V2lkdGgsIGcgPSBwLmEub2Zmc2V0V2lkdGgsIGggPSBxLmEub2Zmc2V0V2lkdGgsIHYoKTtcblx0XHRcdFx0XHRcdFx0XHR9ciA9IHNldFRpbWVvdXQoIEksIDUwICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gdmFyIGUgPSBuZXcgdCggayApLFxuXHRcdFx0XHRcdFx0XHRwID0gbmV3IHQoIGsgKSxcblx0XHRcdFx0XHRcdFx0cSA9IG5ldyB0KCBrICksXG5cdFx0XHRcdFx0XHRcdGYgPSAtMSxcblx0XHRcdFx0XHRcdFx0ZyA9IC0xLFxuXHRcdFx0XHRcdFx0XHRoID0gLTEsXG5cdFx0XHRcdFx0XHRcdHcgPSAtMSxcblx0XHRcdFx0XHRcdFx0eCA9IC0xLFxuXHRcdFx0XHRcdFx0XHR5ID0gLTEsXG5cdFx0XHRcdFx0XHRcdGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO2QuZGlyID0gJ2x0cic7dSggZSwgTCggYywgJ3NhbnMtc2VyaWYnICkgKTt1KCBwLCBMKCBjLCAnc2VyaWYnICkgKTt1KCBxLCBMKCBjLCAnbW9ub3NwYWNlJyApICk7ZC5hcHBlbmRDaGlsZCggZS5hICk7ZC5hcHBlbmRDaGlsZCggcC5hICk7ZC5hcHBlbmRDaGlsZCggcS5hICk7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggZCApO3cgPSBlLmEub2Zmc2V0V2lkdGg7eCA9IHAuYS5vZmZzZXRXaWR0aDt5ID0gcS5hLm9mZnNldFdpZHRoO0koKTtBKCBlLCBmdW5jdGlvbiggYSApIHtcblx0XHRcdFx0XHRcdFx0ZiA9IGE7digpO1xuXHRcdFx0XHRcdFx0fSApO3UoIGUsXG5cdFx0XHRcdFx0XHRcdEwoIGMsICdcIicgKyBjLmZhbWlseSArICdcIixzYW5zLXNlcmlmJyApICk7QSggcCwgZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0XHRcdGcgPSBhO3YoKTtcblx0XHRcdFx0XHRcdH0gKTt1KCBwLCBMKCBjLCAnXCInICsgYy5mYW1pbHkgKyAnXCIsc2VyaWYnICkgKTtBKCBxLCBmdW5jdGlvbiggYSApIHtcblx0XHRcdFx0XHRcdFx0aCA9IGE7digpO1xuXHRcdFx0XHRcdFx0fSApO3UoIHEsIEwoIGMsICdcIicgKyBjLmZhbWlseSArICdcIixtb25vc3BhY2UnICkgKTtcblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9OydvYmplY3QnID09PSB0eXBlb2YgbW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgPSBCIDogKCB3aW5kb3cuRm9udEZhY2VPYnNlcnZlciA9IEIsIHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkID0gQi5wcm90b3R5cGUubG9hZCApO1xuXHR9KCkgKTtcblxuXHQvLyBtaW5ucG9zdCBmb250c1xuXG5cdC8vIHNhbnNcblx0dmFyIHNhbnNOb3JtYWwgPSBuZXcgRm9udEZhY2VPYnNlcnZlciggJ2ZmLW1ldGEtd2ViLXBybycgKTtcblx0dmFyIHNhbnNCb2xkID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNzAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2Fuc05vcm1hbEl0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDQwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblxuXHQvLyBzZXJpZlxuXHR2YXIgc2VyaWZCb29rID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNTAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCb29rSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNTAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCb2xkID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNzAwXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCb2xkSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogNzAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXHR2YXIgc2VyaWZCbGFjayA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDkwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQmxhY2tJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA5MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cblx0UHJvbWlzZS5hbGwoIFtcblx0XHRzYW5zTm9ybWFsLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zQm9sZC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc05vcm1hbEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb29rLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvb2tJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9sZC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb2xkSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJsYWNrLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJsYWNrSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKVxuXHRdICkudGhlbiggZnVuY3Rpb24oKSB7XG5cdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTmFtZSArPSAnIHNlcmlmLWZvbnRzLWxvYWRlZCc7XG5cblx0XHQvLyBPcHRpbWl6YXRpb24gZm9yIFJlcGVhdCBWaWV3c1xuXHRcdHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG5cblx0UHJvbWlzZS5hbGwoIFtcblx0XHRzYW5zTm9ybWFsLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzYW5zQm9sZC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc05vcm1hbEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwIClcblx0XSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzYW5zLWZvbnRzLWxvYWRlZCc7XG5cblx0XHQvLyBPcHRpbWl6YXRpb24gZm9yIFJlcGVhdCBWaWV3c1xuXHRcdHNlc3Npb25TdG9yYWdlLnNhbnNGb250c0xvYWRlZEZvdXRXaXRoQ2xhc3NQb2x5ZmlsbCA9IHRydWU7XG5cdH0gKTtcbn1cblxuIiwiZnVuY3Rpb24gbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgdmFsdWUgKSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEgJiYgJycgIT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS51cmxfYWNjZXNzX2xldmVsICkge1xuXHRcdHZhciB0eXBlID0gJ2V2ZW50Jztcblx0XHR2YXIgY2F0ZWdvcnkgPSAnTWVtYmVyIENvbnRlbnQnO1xuXHRcdHZhciBsYWJlbCA9IGxvY2F0aW9uLnBhdGhuYW1lOyAvLyBpIHRoaW5rIHdlIGNvdWxkIHBvc3NpYmx5IHB1dCBzb21lIGdyb3VwaW5nIGhlcmUsIGJ1dCB3ZSBkb24ndCBuZWNlc3NhcmlseSBoYXZlIGFjY2VzcyB0byBvbmUgYW5kIG1heWJlIGl0J3Mgbm90IHdvcnRod2hpbGUgeWV0XG5cdFx0dmFyIGFjdGlvbiA9ICdCbG9ja2VkJztcblx0XHRpZiAoIHRydWUgPT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS5jdXJyZW50X3VzZXIuY2FuX2FjY2VzcyApIHtcblx0XHRcdGFjdGlvbiA9ICdTaG93bic7XG5cdFx0fVxuXHRcdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0fVxufSApO1xuIiwiZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gPSAnJyApIHtcblxuXHQvLyBpZiBhIG5vdCBsb2dnZWQgaW4gdXNlciB0cmllcyB0byBlbWFpbCwgZG9uJ3QgY291bnQgdGhhdCBhcyBhIHNoYXJlXG5cdGlmICggISBqUXVlcnkoICdib2R5JyApLmhhc0NsYXNzKCAnbG9nZ2VkLWluJyApICYmICdFbWFpbCcgPT09IHRleHQgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGNhdGVnb3J5ID0gJ1NoYXJlJztcblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0Y2F0ZWdvcnkgPSAnU2hhcmUgLSAnICsgcG9zaXRpb247XG5cdH1cblxuXHQvLyB0cmFjayBhcyBhbiBldmVudCwgYW5kIGFzIHNvY2lhbCBpZiBpdCBpcyB0d2l0dGVyIG9yIGZiXG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnksIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgfHwgJ1R3aXR0ZXInID09PSB0ZXh0ICkge1xuXHRcdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0ICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZnVuY3Rpb24gY29weUN1cnJlbnRVUkwoKSB7XG5cdHZhciBkdW1teSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdpbnB1dCcgKSxcblx0XHR0ZXh0ID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGR1bW15ICk7XG5cdGR1bW15LnZhbHVlID0gdGV4dDtcblx0ZHVtbXkuc2VsZWN0KCk7XG5cdGRvY3VtZW50LmV4ZWNDb21tYW5kKCAnY29weScgKTtcblx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCggZHVtbXkgKTtcbn1cblxuJCggJy5tLWVudHJ5LXNoYXJlLXRvcCBhJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0dmFyIHRleHQgPSAkKCB0aGlzICkuZGF0YSggJ3NoYXJlLWFjdGlvbicgKTtcblx0dmFyIHBvc2l0aW9uID0gJ3RvcCc7XG5cdHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG59ICk7XG5cbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1wcmludCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR3aW5kb3cucHJpbnQoKTtcbn0gKTtcblxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWNvcHktdXJsIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRjb3B5Q3VycmVudFVSTCgpO1xuXHR0bGl0ZS5zaG93KCAoIGUudGFyZ2V0ICksIHsgZ3JhdjogJ3cnIH0gKTtcblx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0dGxpdGUuaGlkZSggKCBlLnRhcmdldCApICk7XG5cdH0sIDMwMDAgKTtcblx0cmV0dXJuIGZhbHNlO1xufSApO1xuXG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZmFjZWJvb2sgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtdHdpdHRlciBhLCAubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1lbWFpbCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR2YXIgdXJsID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXHR3aW5kb3cub3BlbiggdXJsLCAnX2JsYW5rJyApO1xufSApO1xuIiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogTmF2aWdhdGlvbiBzY3JpcHRzLiBJbmNsdWRlcyBtb2JpbGUgb3IgdG9nZ2xlIGJlaGF2aW9yLCBhbmFseXRpY3MgdHJhY2tpbmcgb2Ygc3BlY2lmaWMgbWVudXMuXG4gKi9cblxuZnVuY3Rpb24gc2V0dXBQcmltYXJ5TmF2KCkge1xuXHRjb25zdCBwcmltYXJ5TmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWxpbmtzJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgcHJpbWFyeU5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgYnV0dG9uJyApO1xuXHRwcmltYXJ5TmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHR0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdH1cblx0fSApO1xuXG5cdGNvbnN0IHVzZXJOYXZUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1taW5ucG9zdC1hY2NvdW50IHVsJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgdXNlck5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1taW5ucG9zdC1hY2NvdW50ID4gYScgKTtcblx0dXNlck5hdlRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHR9XG5cdH0gKTtcblxuXHR2YXIgdGFyZ2V0ICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ25hdiAubS1mb3JtLXNlYXJjaCBmaWVsZHNldCAuYS1idXR0b24tc2VudGVuY2UnICk7XG5cdHZhciBkaXYgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRkaXYuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLXNlYXJjaFwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuXHR2YXIgZnJhZ21lbnQgID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRkaXYuc2V0QXR0cmlidXRlKCAnY2xhc3MnLCAnYS1jbG9zZS1ob2xkZXInICk7XG5cdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblx0dGFyZ2V0LmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xuXG5cdGNvbnN0IHNlYXJjaFRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1hY3Rpb25zIC5tLWZvcm0tc2VhcmNoJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgc2VhcmNoVmlzaWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICdsaS5zZWFyY2ggPiBhJyApO1xuXHRzZWFyY2hWaXNpYmxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHR9XG5cdH0gKTtcblxuXHR2YXIgc2VhcmNoQ2xvc2UgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLXNlYXJjaCcgKTtcblx0c2VhcmNoQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdH1cblx0fSApO1xuXG5cdC8vIGVzY2FwZSBrZXkgcHJlc3Ncblx0JCggZG9jdW1lbnQgKS5rZXl1cCggZnVuY3Rpb24oIGUgKSB7XG5cdFx0aWYgKCAyNyA9PT0gZS5rZXlDb2RlICkge1xuXHRcdFx0bGV0IHByaW1hcnlOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gcHJpbWFyeU5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHVzZXJOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gdXNlck5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHNlYXJjaElzVmlzaWJsZSA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBwcmltYXJ5TmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gcHJpbWFyeU5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHRwcmltYXJ5TmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHByaW1hcnlOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHVzZXJOYXZFeHBhbmRlZCAmJiB0cnVlID09PSB1c2VyTmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgdXNlck5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2Ygc2VhcmNoSXNWaXNpYmxlICYmIHRydWUgPT09IHNlYXJjaElzVmlzaWJsZSApIHtcblx0XHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBzZWFyY2hJc1Zpc2libGUgKTtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIHNldHVwU3ViTmF2KCkge1xuXG5cdC8vIEluaXQgd2l0aCBhbGwgb3B0aW9ucyBhdCBkZWZhdWx0IHNldHRpbmdcblx0Y29uc3QgcHJpb3JpdHlOYXZTY3JvbGxlckRlZmF1bHQgPSBQcmlvcml0eU5hdlNjcm9sbGVyKCB7XG5cdFx0c2VsZWN0b3I6ICcubS1zdWItbmF2aWdhdGlvbicsXG5cdFx0bmF2U2VsZWN0b3I6ICcubS1zdWJuYXYtbmF2aWdhdGlvbicsXG5cdFx0Y29udGVudFNlbGVjdG9yOiAnLm0tbWVudS1zdWItbmF2aWdhdGlvbicsXG5cdFx0aXRlbVNlbGVjdG9yOiAnbGksIGEnLFxuXHRcdGJ1dHRvbkxlZnRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0Jyxcblx0XHRidXR0b25SaWdodFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0J1xuXG5cdFx0Ly9zY3JvbGxTdGVwOiAnYXZlcmFnZSdcblx0fSApO1xuXG5cdC8vIEluaXQgbXVsdGlwbGUgbmF2IHNjcm9sbGVycyB3aXRoIHRoZSBzYW1lIG9wdGlvbnNcblx0LypsZXQgbmF2U2Nyb2xsZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi1zY3JvbGxlcicpO1xuXG5cdG5hdlNjcm9sbGVycy5mb3JFYWNoKChjdXJyZW50VmFsdWUsIGN1cnJlbnRJbmRleCkgPT4ge1xuXHQgIFByaW9yaXR5TmF2U2Nyb2xsZXIoe1xuXHQgICAgc2VsZWN0b3I6IGN1cnJlbnRWYWx1ZVxuXHQgIH0pO1xuXHR9KTsqL1xufVxuXG5zZXR1cFByaW1hcnlOYXYoKTtcbnNldHVwU3ViTmF2KCk7XG5cbiQoICcjbmF2aWdhdGlvbi1mZWF0dXJlZCBhJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCAnRmVhdHVyZWQgQmFyIExpbmsnLCAnQ2xpY2snLCB0aGlzLmhyZWYgKTtcbn0gKTtcblxuJCggJ2EuZ2xlYW4tc2lkZWJhcicgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1NpZGViYXIgU3VwcG9ydCBMaW5rJywgJ0NsaWNrJywgdGhpcy5ocmVmICk7XG59ICk7XG5cbiQoICdhJywgJCggJy5vLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0dmFyIHdpZGdldFRpdGxlICAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXdpZGdldCcgKS5maW5kKCAnaDMnICkudGV4dCgpO1xuXHR2YXIgem9uZVRpdGxlICAgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0tem9uZScgKS5maW5kKCAnLmEtem9uZS10aXRsZScgKS50ZXh0KCk7XG5cdHZhciBzaWRlYmFyU2VjdGlvblRpdGxlID0gJyc7XG5cdGlmICggJycgIT09IHdpZGdldFRpdGxlICkge1xuXHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB3aWRnZXRUaXRsZTtcblx0fSBlbHNlIGlmICggJycgIT09IHpvbmVUaXRsZSApIHtcblx0XHRzaWRlYmFyU2VjdGlvblRpdGxlID0gem9uZVRpdGxlO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJTZWN0aW9uVGl0bGUgKTtcbn0gKTtcbiIsImpRdWVyeS5mbi50ZXh0Tm9kZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY29udGVudHMoKS5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoIHRoaXMubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmICcnICE9PSB0aGlzLm5vZGVWYWx1ZS50cmltKCkgKTtcblx0fSApO1xufTtcblxuZnVuY3Rpb24gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggYWN0aW9uICkge1xuXHR2YXIgbWFya3VwID0gJzxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtZm9ybS1jb25maXJtXCI+PGxhYmVsPkFyZSB5b3Ugc3VyZT8gPGEgaWQ9XCJhLWNvbmZpcm0tJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPlllczwvYT4gfCA8YSBpZD1cImEtc3RvcC0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+Tm88L2E+PC9sYWJlbD48L2xpPic7XG5cdHJldHVybiBtYXJrdXA7XG59XG5cbmZ1bmN0aW9uIG1hbmFnZUVtYWlscygpIHtcblx0dmFyIGZvcm0gICAgICAgICAgICAgICA9ICQoICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJyApO1xuXHR2YXIgcmVzdFJvb3QgICAgICAgICAgID0gdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5zaXRlX3VybCArIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QucmVzdF9uYW1lc3BhY2U7XG5cdHZhciBmdWxsVXJsICAgICAgICAgICAgPSByZXN0Um9vdCArICcvJyArICd1cGRhdGUtdXNlci8nO1xuXHR2YXIgY29uZmlybUNoYW5nZSAgICAgID0gJyc7XG5cdHZhciBuZXh0RW1haWxDb3VudCAgICAgPSAxO1xuXHR2YXIgbmV3UHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBvbGRQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIHByaW1hcnlJZCAgICAgICAgICA9ICcnO1xuXHR2YXIgZW1haWxUb1JlbW92ZSAgICAgID0gJyc7XG5cdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0dmFyIG5ld0VtYWlscyAgICAgICAgICA9IFtdO1xuXHR2YXIgYWpheEZvcm1EYXRhICAgICAgID0gJyc7XG5cdHZhciB0aGF0ICAgICAgICAgICAgICAgPSAnJztcblxuXHQvLyBzdGFydCBvdXQgd2l0aCBubyBwcmltYXJ5L3JlbW92YWxzIGNoZWNrZWRcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0Ly8gaWYgdGhlcmUgaXMgYSBsaXN0IG9mIGVtYWlscyAobm90IGp1c3QgYSBzaW5nbGUgZm9ybSBmaWVsZClcblx0aWYgKCAwIDwgJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHNlbGVjdHMgYSBuZXcgcHJpbWFyeSwgbW92ZSBpdCBpbnRvIHRoYXQgcG9zaXRpb25cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScsIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRuZXdQcmltYXJ5RW1haWwgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRvbGRQcmltYXJ5RW1haWwgPSAkKCAnI2VtYWlsJyApLnZhbCgpO1xuXHRcdFx0cHJpbWFyeUlkICAgICAgID0gJCggdGhpcyApLnByb3AoICdpZCcgKS5yZXBsYWNlKCAncHJpbWFyeV9lbWFpbF8nLCAnJyApO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3ByaW1hcnktY2hhbmdlJyApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cblx0XHRcdC8vJCggdGhpcyApLnBhcmVudCgpLmFmdGVyKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgdXNlciBmYWNpbmcgdmFsdWVzXG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBuZXdQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyN1c2VyLWVtYWlsLScgKyBwcmltYXJ5SWQgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIG1haW4gaGlkZGVuIGZvcm0gdmFsdWVcblx0XHRcdFx0JCggJyNlbWFpbCcgKS52YWwoIG5ld1ByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHN1Ym1pdCBmb3JtIHZhbHVlcy5cblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblxuXHRcdFx0XHQvLyB1bmNoZWNrIHRoZSByYWRpbyBidXR0b25cblx0XHRcdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgZm9ybSB2YWx1ZXMgdG8gdGhlIG9sZCBwcmltYXJ5IGVtYWlsXG5cdFx0XHRcdCQoICcjcHJpbWFyeV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyNyZW1vdmVfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIHRoZSBjb25maXJtIG1lc3NhZ2Vcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdH0gKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdC8vIGlmIGEgdXNlciByZW1vdmVzIGFuIGVtYWlsLCB0YWtlIGl0IGF3YXkgZnJvbSB0aGUgdmlzdWFsIGFuZCBmcm9tIHRoZSBmb3JtXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NoYW5nZScsICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRlbWFpbFRvUmVtb3ZlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3JlbW92YWwnICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICE9PSBlbWFpbFRvUmVtb3ZlICkge1xuXHRcdFx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscy5wdXNoKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXIgZm9yIHJlbW92YWxcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdC8vIGlmIGNvbmZpcm1lZCwgcmVtb3ZlIHRoZSBlbWFpbCBhbmQgc3VibWl0IHRoZSBmb3JtXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpJyApLmZhZGVPdXQoICdub3JtYWwnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkucmVtb3ZlKCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXG5cdFx0XHRcdC8vY29uc29sZS5sb2coICd2YWx1ZSBpcyAnICsgY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0Ly8gaWYgYSB1c2VyIHdhbnRzIHRvIGFkZCBhbiBlbWFpbCwgZ2l2ZSB0aGVtIGEgcHJvcGVybHkgbnVtYmVyZWQgZmllbGRcblx0JCggJy5tLWZvcm0tZW1haWwnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJyApLmJlZm9yZSggJzxkaXYgY2xhc3M9XCJhLWlucHV0LXdpdGgtYnV0dG9uIGEtYnV0dG9uLXNlbnRlbmNlXCI+PGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgaWQ9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgdmFsdWU9XCJcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBuYW1lPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGlkPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGNsYXNzPVwiYS1idXR0b24gYS1idXR0b24tYWRkLXVzZXItZW1haWxcIj5BZGQ8L2J1dHRvbj48L2Rpdj4nICk7XG5cdFx0bmV4dEVtYWlsQ291bnQrKztcblx0fSApO1xuXG5cdCQoICdpbnB1dFt0eXBlPXN1Ym1pdF0nICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBidXR0b24gPSAkKCB0aGlzICk7XG5cdFx0dmFyIGJ1dHRvbkZvcm0gPSBidXR0b24uY2xvc2VzdCggJ2Zvcm0nICk7XG5cdFx0YnV0dG9uRm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nLCBidXR0b24udmFsKCkgKTtcblx0fSApO1xuXG5cdCQoICcubS1lbnRyeS1jb250ZW50JyApLm9uKCAnc3VibWl0JywgJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0dmFyIGZvcm0gPSAkKCB0aGlzICk7XG5cdFx0dmFyIHN1Ym1pdHRpbmdCdXR0b24gPSBmb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicgKSB8fCAnJztcblxuXHRcdC8vIGlmIHRoZXJlIGlzIG5vIHN1Ym1pdHRpbmcgYnV0dG9uLCBwYXNzIGl0IGJ5IEFqYXhcblx0XHRpZiAoICcnID09PSBzdWJtaXR0aW5nQnV0dG9uIHx8ICdTYXZlIENoYW5nZXMnICE9PSBzdWJtaXR0aW5nQnV0dG9uICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGFqYXhGb3JtRGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7IC8vYWRkIG91ciBvd24gYWpheCBjaGVjayBhcyBYLVJlcXVlc3RlZC1XaXRoIGlzIG5vdCBhbHdheXMgcmVsaWFibGVcblx0XHRcdGFqYXhGb3JtRGF0YSA9IGFqYXhGb3JtRGF0YSArICcmcmVzdD10cnVlJztcblx0XHRcdCQuYWpheCgge1xuXHRcdFx0XHR1cmw6IGZ1bGxVcmwsXG5cdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oIHhociApIHtcblx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Lm5vbmNlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhGb3JtRGF0YVxuXHRcdFx0fSApLmRvbmUoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRuZXdFbWFpbHMgPSAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHR9ICkuZ2V0KCk7XG5cdFx0XHRcdCQuZWFjaCggbmV3RW1haWxzLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICkge1xuXHRcdFx0XHRcdG5leHRFbWFpbENvdW50ID0gbmV4dEVtYWlsQ291bnQgKyBpbmRleDtcblx0XHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmFwcGVuZCggJzxsaSBpZD1cInVzZXItZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPicgKyB2YWx1ZSArICc8dWwgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXVzZXItZW1haWwtYWN0aW9uc1wiPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1tYWtlLXByaW1hcnktZW1haWxcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW1hcnlfZW1haWxcIiBpZD1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+TWFrZSBQcmltYXJ5PC9zbWFsbD48L2xhYmVsPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLWVtYWlsLXByZWZlcmVuY2VzXCI+PGEgaHJlZj1cIi9uZXdzbGV0dGVycy8/ZW1haWw9JyArIGVuY29kZVVSSUNvbXBvbmVudCggdmFsdWUgKSArICdcIj48c21hbGw+RW1haWwgUHJlZmVyZW5jZXM8L3NtYWxsPjwvYT48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggJCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoKSArICcsJyArIHZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0JCggJy5tLWZvcm0tY2hhbmdlLWVtYWlsIC5hLWlucHV0LXdpdGgtYnV0dG9uJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRpZiAoIDAgPT09ICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdGlmICggJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApICE9PSAkKCAnaW5wdXRbbmFtZT1cImVtYWlsXCJdJyApICkge1xuXG5cdFx0XHRcdFx0XHQvLyBpdCB3b3VsZCBiZSBuaWNlIHRvIG9ubHkgbG9hZCB0aGUgZm9ybSwgYnV0IHRoZW4gY2xpY2sgZXZlbnRzIHN0aWxsIGRvbid0IHdvcmtcblx0XHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblx0fSApO1xufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIDAgPCAkKCAnLm0tZm9ybS1lbWFpbCcgKS5sZW5ndGggKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cbn0gKTtcbiIsIi8vIGJhc2VkIG9uIHdoaWNoIGJ1dHRvbiB3YXMgY2xpY2tlZCwgc2V0IHRoZSB2YWx1ZXMgZm9yIHRoZSBhbmFseXRpY3MgZXZlbnQgYW5kIGNyZWF0ZSBpdFxuZnVuY3Rpb24gdHJhY2tTaG93Q29tbWVudHMoIGFsd2F5cywgaWQsIGNsaWNrVmFsdWUgKSB7XG5cdHZhciBhY3Rpb24gICAgICAgICAgPSAnJztcblx0dmFyIGNhdGVnb3J5UHJlZml4ID0gJyc7XG5cdHZhciBjYXRlZ29yeVN1ZmZpeCA9ICcnO1xuXHR2YXIgcG9zaXRpb24gICAgICAgID0gJyc7XG5cdHBvc2l0aW9uID0gaWQucmVwbGFjZSggJ2Fsd2F5cy1zaG93LWNvbW1lbnRzLScsICcnICk7XG5cdGlmICggJzEnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPbic7XG5cdH0gZWxzZSBpZiAoICcwJyA9PT0gY2xpY2tWYWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5UHJlZml4ID0gJ0Fsd2F5cyAnO1xuXHR9XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24uY2hhckF0KCAwICkudG9VcHBlckNhc2UoKSArIHBvc2l0aW9uLnNsaWNlKCAxICk7XG5cdFx0Y2F0ZWdvcnlTdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnlQcmVmaXggKyAnU2hvdyBDb21tZW50cycgKyBjYXRlZ29yeVN1ZmZpeCwgYWN0aW9uLCBsb2NhdGlvbi5wYXRobmFtZSApO1xufVxuXG4vLyB3aGVuIHNob3dpbmcgY29tbWVudHMgb25jZSwgdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtYnV0dG9uLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dHJhY2tTaG93Q29tbWVudHMoIGZhbHNlLCAnJywgJycgKTtcbn0gKTtcblxuLy8gU2V0IHVzZXIgbWV0YSB2YWx1ZSBmb3IgYWx3YXlzIHNob3dpbmcgY29tbWVudHMgaWYgdGhhdCBidXR0b24gaXMgY2xpY2tlZFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHZhciB0aGF0ID0gJCggdGhpcyApO1xuXHRpZiAoIHRoYXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gZWxzZSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuXHR0cmFja1Nob3dDb21tZW50cyggdHJ1ZSwgdGhhdC5hdHRyKCAnaWQnICksIHRoYXQudmFsKCkgKTtcblxuXHQvLyB3ZSBhbHJlYWR5IGhhdmUgYWpheHVybCBmcm9tIHRoZSB0aGVtZVxuXHQkLmFqYXgoIHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBhamF4dXJsLFxuXHRcdGRhdGE6IHtcblx0XHRcdCdhY3Rpb24nOiAnbWlubnBvc3RfbGFyZ29fbG9hZF9jb21tZW50c19zZXRfdXNlcl9tZXRhJyxcblx0XHRcdCd2YWx1ZSc6IHRoYXQudmFsKClcblx0XHR9LFxuXHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdCQoICcuYS1hbHdheXMtc2hvdy1jb21tZW50cy1yZXN1bHQnLCB0aGF0LnBhcmVudCgpICkuaHRtbCggcmVzcG9uc2UuZGF0YS5tZXNzYWdlICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IHJlc3BvbnNlLmRhdGEuc2hvdyApIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufSApO1xuIl19
}(jQuery));
