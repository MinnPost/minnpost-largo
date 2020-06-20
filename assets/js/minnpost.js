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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDAtc3RhcnQuanMiLCIwMS1mb250cy5qcyIsIjAyLWFuYWx5dGljcy5qcyIsIjAzLXNoYXJlLmpzIiwiMDQtbmF2aWdhdGlvbi5qcyIsIjA1LWZvcm1zLmpzIiwiMDYtY29tbWVudHMuanMiLCIwNy1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsIiQiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwic2Vzc2lvblN0b3JhZ2UiLCJzZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsIiwic2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsIiwiZG9jdW1lbnRFbGVtZW50IiwiZyIsInB1c2giLCJtIiwic2hpZnQiLCJwIiwiYiIsInEiLCJjIiwidSIsIlR5cGVFcnJvciIsInRoZW4iLCJjYWxsIiwidiIsImgiLCJwcm90b3R5cGUiLCJ3IiwiayIsIngiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJhY2UiLCJhbGwiLCJjYXRjaCIsImF0dGFjaEV2ZW50IiwiYm9keSIsInJlYWR5U3RhdGUiLCJkZXRhY2hFdmVudCIsImNyZWF0ZVRleHROb2RlIiwiY3NzVGV4dCIsInoiLCJ3aWR0aCIsIkEiLCJCIiwiZmFtaWx5Iiwid2VpZ2h0Iiwic3RyZXRjaCIsIkMiLCJEIiwiRSIsIkYiLCJHIiwiSiIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ2ZW5kb3IiLCJleGVjIiwidXNlckFnZW50IiwiZm9udHMiLCJLIiwiZm9udCIsIkwiLCJqb2luIiwibG9hZCIsIkgiLCJEYXRlIiwiZ2V0VGltZSIsIk0iLCJOIiwieSIsIkkiLCJoaWRkZW4iLCJkaXIiLCJGb250RmFjZU9ic2VydmVyIiwic2Fuc05vcm1hbCIsInNhbnNCb2xkIiwic2Fuc05vcm1hbEl0YWxpYyIsInNlcmlmQm9vayIsInNlcmlmQm9va0l0YWxpYyIsInNlcmlmQm9sZCIsInNlcmlmQm9sZEl0YWxpYyIsInNlcmlmQmxhY2siLCJzZXJpZkJsYWNrSXRhbGljIiwibXBBbmFseXRpY3NUcmFja2luZ0V2ZW50IiwidHlwZSIsImNhdGVnb3J5IiwiYWN0aW9uIiwibGFiZWwiLCJ2YWx1ZSIsImdhIiwicmVhZHkiLCJtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEiLCJ1cmxfYWNjZXNzX2xldmVsIiwibG9jYXRpb24iLCJwYXRobmFtZSIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJjb3B5Q3VycmVudFVSTCIsImR1bW15IiwiaHJlZiIsInNlbGVjdCIsImV4ZWNDb21tYW5kIiwiY2xpY2siLCJkYXRhIiwicHJldmVudERlZmF1bHQiLCJwcmludCIsInVybCIsImF0dHIiLCJvcGVuIiwic2V0dXBQcmltYXJ5TmF2IiwicHJpbWFyeU5hdlRyYW5zaXRpb25lciIsInByaW1hcnlOYXZUb2dnbGUiLCJleHBhbmRlZCIsInVzZXJOYXZUcmFuc2l0aW9uZXIiLCJ1c2VyTmF2VG9nZ2xlIiwiZGl2IiwiZnJhZ21lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50Iiwic2VhcmNoVHJhbnNpdGlvbmVyIiwic2VhcmNoVmlzaWJsZSIsInNlYXJjaENsb3NlIiwia2V5dXAiLCJrZXlDb2RlIiwicHJpbWFyeU5hdkV4cGFuZGVkIiwidXNlck5hdkV4cGFuZGVkIiwic2VhcmNoSXNWaXNpYmxlIiwic2V0dXBTY3JvbGxOYXYiLCJwcmlvcml0eU5hdlNjcm9sbGVyRGVmYXVsdCIsIndpZGdldFRpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJ6b25lVGl0bGUiLCJzaWRlYmFyU2VjdGlvblRpdGxlIiwiZm4iLCJ0ZXh0Tm9kZXMiLCJjb250ZW50cyIsImZpbHRlciIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSIsIm5vZGVWYWx1ZSIsInRyaW0iLCJnZXRDb25maXJtQ2hhbmdlTWFya3VwIiwibWFya3VwIiwibWFuYWdlRW1haWxzIiwiZm9ybSIsInJlc3RSb290IiwidXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdCIsInNpdGVfdXJsIiwicmVzdF9uYW1lc3BhY2UiLCJmdWxsVXJsIiwiY29uZmlybUNoYW5nZSIsIm5leHRFbWFpbENvdW50IiwibmV3UHJpbWFyeUVtYWlsIiwib2xkUHJpbWFyeUVtYWlsIiwicHJpbWFyeUlkIiwiZW1haWxUb1JlbW92ZSIsImNvbnNvbGlkYXRlZEVtYWlscyIsIm5ld0VtYWlscyIsImFqYXhGb3JtRGF0YSIsInRoYXQiLCJwcm9wIiwib24iLCJ2YWwiLCJyZXBsYWNlIiwicGFyZW50IiwiYXBwZW5kIiwiZXZlbnQiLCJmaXJzdCIsInJlcGxhY2VXaXRoIiwic3VibWl0IiwiZWFjaCIsImdldCIsInBhcmVudHMiLCJmYWRlT3V0IiwiYmVmb3JlIiwiYnV0dG9uIiwiYnV0dG9uRm9ybSIsInN1Ym1pdHRpbmdCdXR0b24iLCJzZXJpYWxpemUiLCJhamF4IiwiYmVmb3JlU2VuZCIsInhociIsInNldFJlcXVlc3RIZWFkZXIiLCJub25jZSIsImRhdGFUeXBlIiwiZG9uZSIsIm1hcCIsImluZGV4IiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicmVsb2FkIiwidHJhY2tTaG93Q29tbWVudHMiLCJhbHdheXMiLCJpZCIsImNsaWNrVmFsdWUiLCJjYXRlZ29yeVByZWZpeCIsImNhdGVnb3J5U3VmZml4IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImlzIiwiYWpheHVybCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImh0bWwiLCJtZXNzYWdlIiwibGkiLCJjYWxlbmRhclRyYW5zaXRpb25lciIsImNhbGVuZGFyVmlzaWJsZSIsImNhbGVuZGFyQ2xvc2UiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsS0FBVCxDQUFlQyxDQUFmLEVBQWlCO0FBQUNDLEVBQUFBLFFBQVEs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QUd4VixRQUFRLENBQUNvRixhQUFULENBQXdCLG1CQUF4QixDQUFwQjtBQUNBb1EsRUFBQUEsYUFBYSxDQUFDdlYsZ0JBQWQsQ0FBZ0MsT0FBaEMsRUFBeUMsVUFBVUMsQ0FBVixFQUFjO0FBQ25EQSxJQUFBQSxDQUFDLENBQUM2TyxjQUFGO0FBQ0EsUUFBSVEsUUFBUSxHQUFHLFdBQVdnRyxlQUFlLENBQUMzVCxZQUFoQixDQUE4QixlQUE5QixDQUFYLElBQThELEtBQTdFO0FBQ0EyVCxJQUFBQSxlQUFlLENBQUNqVCxZQUFoQixDQUE4QixlQUE5QixFQUErQyxDQUFFaU4sUUFBakQ7O0FBQ0EsUUFBSyxTQUFTQSxRQUFkLEVBQXlCO0FBQ3JCK0YsTUFBQUEsb0JBQW9CLENBQUNuUixjQUFyQjtBQUNILEtBRkQsTUFFTztBQUNIbVIsTUFBQUEsb0JBQW9CLENBQUN4UixjQUFyQjtBQUNIO0FBQ0osR0FURDtBQVVIIiwiZmlsZSI6Im1pbm5wb3N0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gdGxpdGUodCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLGZ1bmN0aW9uKGUpe3ZhciBpPWUudGFyZ2V0LG49dChpKTtufHwobj0oaT1pLnBhcmVudEVsZW1lbnQpJiZ0KGkpKSxuJiZ0bGl0ZS5zaG93KGksbiwhMCl9KX10bGl0ZS5zaG93PWZ1bmN0aW9uKHQsZSxpKXt2YXIgbj1cImRhdGEtdGxpdGVcIjtlPWV8fHt9LCh0LnRvb2x0aXB8fGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gbygpe3RsaXRlLmhpZGUodCwhMCl9ZnVuY3Rpb24gbCgpe3J8fChyPWZ1bmN0aW9uKHQsZSxpKXtmdW5jdGlvbiBuKCl7by5jbGFzc05hbWU9XCJ0bGl0ZSB0bGl0ZS1cIityK3M7dmFyIGU9dC5vZmZzZXRUb3AsaT10Lm9mZnNldExlZnQ7by5vZmZzZXRQYXJlbnQ9PT10JiYoZT1pPTApO3ZhciBuPXQub2Zmc2V0V2lkdGgsbD10Lm9mZnNldEhlaWdodCxkPW8ub2Zmc2V0SGVpZ2h0LGY9by5vZmZzZXRXaWR0aCxhPWkrbi8yO28uc3R5bGUudG9wPShcInNcIj09PXI/ZS1kLTEwOlwiblwiPT09cj9lK2wrMTA6ZStsLzItZC8yKStcInB4XCIsby5zdHlsZS5sZWZ0PShcIndcIj09PXM/aTpcImVcIj09PXM/aStuLWY6XCJ3XCI9PT1yP2krbisxMDpcImVcIj09PXI/aS1mLTEwOmEtZi8yKStcInB4XCJ9dmFyIG89ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksbD1pLmdyYXZ8fHQuZ2V0QXR0cmlidXRlKFwiZGF0YS10bGl0ZVwiKXx8XCJuXCI7by5pbm5lckhUTUw9ZSx0LmFwcGVuZENoaWxkKG8pO3ZhciByPWxbMF18fFwiXCIscz1sWzFdfHxcIlwiO24oKTt2YXIgZD1vLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVyblwic1wiPT09ciYmZC50b3A8MD8ocj1cIm5cIixuKCkpOlwiblwiPT09ciYmZC5ib3R0b20+d2luZG93LmlubmVySGVpZ2h0PyhyPVwic1wiLG4oKSk6XCJlXCI9PT1yJiZkLmxlZnQ8MD8ocj1cIndcIixuKCkpOlwid1wiPT09ciYmZC5yaWdodD53aW5kb3cuaW5uZXJXaWR0aCYmKHI9XCJlXCIsbigpKSxvLmNsYXNzTmFtZSs9XCIgdGxpdGUtdmlzaWJsZVwiLG99KHQsZCxlKSl9dmFyIHIscyxkO3JldHVybiB0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixvKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsbyksdC50b29sdGlwPXtzaG93OmZ1bmN0aW9uKCl7ZD10LnRpdGxlfHx0LmdldEF0dHJpYnV0ZShuKXx8ZCx0LnRpdGxlPVwiXCIsdC5zZXRBdHRyaWJ1dGUobixcIlwiKSxkJiYhcyYmKHM9c2V0VGltZW91dChsLGk/MTUwOjEpKX0saGlkZTpmdW5jdGlvbih0KXtpZihpPT09dCl7cz1jbGVhclRpbWVvdXQocyk7dmFyIGU9ciYmci5wYXJlbnROb2RlO2UmJmUucmVtb3ZlQ2hpbGQocikscj12b2lkIDB9fX19KHQsZSkpLnNob3coKX0sdGxpdGUuaGlkZT1mdW5jdGlvbih0LGUpe3QudG9vbHRpcCYmdC50b29sdGlwLmhpZGUoZSl9LFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9dGxpdGUpOyIsIi8qKiBcbiAqIExpYnJhcnkgY29kZVxuICogVXNpbmcgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvQGNsb3VkZm91ci90cmFuc2l0aW9uLWhpZGRlbi1lbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoe1xuICBlbGVtZW50LFxuICB2aXNpYmxlQ2xhc3MsXG4gIHdhaXRNb2RlID0gJ3RyYW5zaXRpb25lbmQnLFxuICB0aW1lb3V0RHVyYXRpb24sXG4gIGhpZGVNb2RlID0gJ2hpZGRlbicsXG4gIGRpc3BsYXlWYWx1ZSA9ICdibG9jaydcbn0pIHtcbiAgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcgJiYgdHlwZW9mIHRpbWVvdXREdXJhdGlvbiAhPT0gJ251bWJlcicpIHtcbiAgICBjb25zb2xlLmVycm9yKGBcbiAgICAgIFdoZW4gY2FsbGluZyB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCB3aXRoIHdhaXRNb2RlIHNldCB0byB0aW1lb3V0LFxuICAgICAgeW91IG11c3QgcGFzcyBpbiBhIG51bWJlciBmb3IgdGltZW91dER1cmF0aW9uLlxuICAgIGApO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRG9uJ3Qgd2FpdCBmb3IgZXhpdCB0cmFuc2l0aW9ucyBpZiBhIHVzZXIgcHJlZmVycyByZWR1Y2VkIG1vdGlvbi5cbiAgLy8gSWRlYWxseSB0cmFuc2l0aW9ucyB3aWxsIGJlIGRpc2FibGVkIGluIENTUywgd2hpY2ggbWVhbnMgd2Ugc2hvdWxkIG5vdCB3YWl0XG4gIC8vIGJlZm9yZSBhZGRpbmcgYGhpZGRlbmAuXG4gIGlmICh3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKS5tYXRjaGVzKSB7XG4gICAgd2FpdE1vZGUgPSAnaW1tZWRpYXRlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBldmVudCBsaXN0ZW5lciB0byBhZGQgYGhpZGRlbmAgYWZ0ZXIgb3VyIGFuaW1hdGlvbnMgY29tcGxldGUuXG4gICAqIFRoaXMgbGlzdGVuZXIgd2lsbCByZW1vdmUgaXRzZWxmIGFmdGVyIGNvbXBsZXRpbmcuXG4gICAqL1xuICBjb25zdCBsaXN0ZW5lciA9IGUgPT4ge1xuICAgIC8vIENvbmZpcm0gYHRyYW5zaXRpb25lbmRgIHdhcyBjYWxsZWQgb24gIG91ciBgZWxlbWVudGAgYW5kIGRpZG4ndCBidWJibGVcbiAgICAvLyB1cCBmcm9tIGEgY2hpbGQgZWxlbWVudC5cbiAgICBpZiAoZS50YXJnZXQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFwcGx5SGlkZGVuQXR0cmlidXRlcyA9ICgpID0+IHtcbiAgICBpZihoaWRlTW9kZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogU2hvdyB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25TaG93KCkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGlzIGxpc3RlbmVyIHNob3VsZG4ndCBiZSBoZXJlIGJ1dCBpZiBzb21lb25lIHNwYW1zIHRoZSB0b2dnbGVcbiAgICAgICAqIG92ZXIgYW5kIG92ZXIgcmVhbGx5IGZhc3QgaXQgY2FuIGluY29ycmVjdGx5IHN0aWNrIGFyb3VuZC5cbiAgICAgICAqIFdlIHJlbW92ZSBpdCBqdXN0IHRvIGJlIHNhZmUuXG4gICAgICAgKi9cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBTaW1pbGFybHksIHdlJ2xsIGNsZWFyIHRoZSB0aW1lb3V0IGluIGNhc2UgaXQncyBzdGlsbCBoYW5naW5nIGFyb3VuZC5cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgIH1cblxuICAgICAgcmVtb3ZlSGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICAvKipcbiAgICAgICAqIEZvcmNlIGEgYnJvd3NlciByZS1wYWludCBzbyB0aGUgYnJvd3NlciB3aWxsIHJlYWxpemUgdGhlXG4gICAgICAgKiBlbGVtZW50IGlzIG5vIGxvbmdlciBgaGlkZGVuYCBhbmQgYWxsb3cgdHJhbnNpdGlvbnMuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHJlZmxvdyA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSGlkZSB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25IaWRlKCkge1xuICAgICAgaWYgKHdhaXRNb2RlID09PSAndHJhbnNpdGlvbmVuZCcpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuICAgICAgfSBlbHNlIGlmICh3YWl0TW9kZSA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuICAgICAgICB9LCB0aW1lb3V0RHVyYXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCB0aGlzIGNsYXNzIHRvIHRyaWdnZXIgb3VyIGFuaW1hdGlvblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHZpc2libGVDbGFzcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZSB0aGUgZWxlbWVudCdzIHZpc2liaWxpdHlcbiAgICAgKi9cbiAgICB0b2dnbGUoKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbigpKSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvblNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGVsbCB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIGhpZGRlbiBvciBub3QuXG4gICAgICovXG4gICAgaXNIaWRkZW4oKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBoaWRkZW4gYXR0cmlidXRlIGRvZXMgbm90IHJlcXVpcmUgYSB2YWx1ZS4gU2luY2UgYW4gZW1wdHkgc3RyaW5nIGlzXG4gICAgICAgKiBmYWxzeSwgYnV0IHNob3dzIHRoZSBwcmVzZW5jZSBvZiBhbiBhdHRyaWJ1dGUgd2UgY29tcGFyZSB0byBgbnVsbGBcbiAgICAgICAqL1xuICAgICAgY29uc3QgaGFzSGlkZGVuQXR0cmlidXRlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hpZGRlbicpICE9PSBudWxsO1xuXG4gICAgICBjb25zdCBpc0Rpc3BsYXlOb25lID0gZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZSc7XG5cbiAgICAgIGNvbnN0IGhhc1Zpc2libGVDbGFzcyA9IFsuLi5lbGVtZW50LmNsYXNzTGlzdF0uaW5jbHVkZXModmlzaWJsZUNsYXNzKTtcblxuICAgICAgcmV0dXJuIGhhc0hpZGRlbkF0dHJpYnV0ZSB8fCBpc0Rpc3BsYXlOb25lIHx8ICFoYXNWaXNpYmxlQ2xhc3M7XG4gICAgfSxcblxuICAgIC8vIEEgcGxhY2Vob2xkZXIgZm9yIG91ciBgdGltZW91dGBcbiAgICB0aW1lb3V0OiBudWxsXG4gIH07XG59IiwiLyoqXG4gIFByaW9yaXR5KyBob3Jpem9udGFsIHNjcm9sbGluZyBtZW51LlxuXG4gIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgLSBDb250YWluZXIgZm9yIGFsbCBvcHRpb25zLlxuICAgIEBwYXJhbSB7c3RyaW5nIHx8IERPTSBub2RlfSBzZWxlY3RvciAtIEVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IG5hdlNlbGVjdG9yIC0gTmF2IGVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRTZWxlY3RvciAtIENvbnRlbnQgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gaXRlbVNlbGVjdG9yIC0gSXRlbXMgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvbkxlZnRTZWxlY3RvciAtIExlZnQgYnV0dG9uIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBidXR0b25SaWdodFNlbGVjdG9yIC0gUmlnaHQgYnV0dG9uIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7aW50ZWdlciB8fCBzdHJpbmd9IHNjcm9sbFN0ZXAgLSBBbW91bnQgdG8gc2Nyb2xsIG9uIGJ1dHRvbiBjbGljay4gJ2F2ZXJhZ2UnIGdldHMgdGhlIGF2ZXJhZ2UgbGluayB3aWR0aC5cbiovXG5cbmNvbnN0IFByaW9yaXR5TmF2U2Nyb2xsZXIgPSBmdW5jdGlvbih7XG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXInLFxuICAgIG5hdlNlbGVjdG9yOiBuYXZTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLW5hdicsXG4gICAgY29udGVudFNlbGVjdG9yOiBjb250ZW50U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1jb250ZW50JyxcbiAgICBpdGVtU2VsZWN0b3I6IGl0ZW1TZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWl0ZW0nLFxuICAgIGJ1dHRvbkxlZnRTZWxlY3RvcjogYnV0dG9uTGVmdFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0JyxcbiAgICBidXR0b25SaWdodFNlbGVjdG9yOiBidXR0b25SaWdodFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItYnRuLS1yaWdodCcsXG4gICAgc2Nyb2xsU3RlcDogc2Nyb2xsU3RlcCA9IDgwXG4gIH0gPSB7fSkge1xuXG4gIGNvbnN0IG5hdlNjcm9sbGVyID0gdHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIDogc2VsZWN0b3I7XG5cbiAgY29uc3QgdmFsaWRhdGVTY3JvbGxTdGVwID0gKCkgPT4ge1xuICAgIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKHNjcm9sbFN0ZXApIHx8IHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJztcbiAgfVxuXG4gIGlmIChuYXZTY3JvbGxlciA9PT0gdW5kZWZpbmVkIHx8IG5hdlNjcm9sbGVyID09PSBudWxsIHx8ICF2YWxpZGF0ZVNjcm9sbFN0ZXAoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgc29tZXRoaW5nIHdyb25nLCBjaGVjayB5b3VyIG9wdGlvbnMuJyk7XG4gIH1cblxuICBjb25zdCBuYXZTY3JvbGxlck5hdiA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IobmF2U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckNvbnRlbnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGNvbnRlbnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zID0gbmF2U2Nyb2xsZXJDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoaXRlbVNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJMZWZ0ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihidXR0b25MZWZ0U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlclJpZ2h0ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihidXR0b25SaWdodFNlbGVjdG9yKTtcblxuICBsZXQgc2Nyb2xsaW5nID0gZmFsc2U7XG4gIGxldCBzY3JvbGxBdmFpbGFibGVMZWZ0ID0gMDtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID0gMDtcbiAgbGV0IHNjcm9sbGluZ0RpcmVjdGlvbiA9ICcnO1xuICBsZXQgc2Nyb2xsT3ZlcmZsb3cgPSAnJztcbiAgbGV0IHRpbWVvdXQ7XG5cblxuICAvLyBTZXRzIG92ZXJmbG93IGFuZCB0b2dnbGUgYnV0dG9ucyBhY2NvcmRpbmdseVxuICBjb25zdCBzZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIHNjcm9sbE92ZXJmbG93ID0gZ2V0T3ZlcmZsb3coKTtcbiAgICB0b2dnbGVCdXR0b25zKHNjcm9sbE92ZXJmbG93KTtcbiAgICBjYWxjdWxhdGVTY3JvbGxTdGVwKCk7XG4gIH1cblxuXG4gIC8vIERlYm91bmNlIHNldHRpbmcgdGhlIG92ZXJmbG93IHdpdGggcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIGNvbnN0IHJlcXVlc3RTZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aW1lb3V0KSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGltZW91dCk7XG5cbiAgICB0aW1lb3V0ID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBzZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuICB9XG5cblxuICAvLyBHZXRzIHRoZSBvdmVyZmxvdyBhdmFpbGFibGUgb24gdGhlIG5hdiBzY3JvbGxlclxuICBjb25zdCBnZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzY3JvbGxXaWR0aCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbFdpZHRoO1xuICAgIGxldCBzY3JvbGxWaWV3cG9ydCA9IG5hdlNjcm9sbGVyTmF2LmNsaWVudFdpZHRoO1xuICAgIGxldCBzY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdDtcblxuICAgIHNjcm9sbEF2YWlsYWJsZUxlZnQgPSBzY3JvbGxMZWZ0O1xuICAgIHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID0gc2Nyb2xsV2lkdGggLSAoc2Nyb2xsVmlld3BvcnQgKyBzY3JvbGxMZWZ0KTtcblxuICAgIC8vIDEgaW5zdGVhZCBvZiAwIHRvIGNvbXBlbnNhdGUgZm9yIG51bWJlciByb3VuZGluZ1xuICAgIGxldCBzY3JvbGxMZWZ0Q29uZGl0aW9uID0gc2Nyb2xsQXZhaWxhYmxlTGVmdCA+IDE7XG4gICAgbGV0IHNjcm9sbFJpZ2h0Q29uZGl0aW9uID0gc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPiAxO1xuXG4gICAgLy8gY29uc29sZS5sb2coc2Nyb2xsV2lkdGgsIHNjcm9sbFZpZXdwb3J0LCBzY3JvbGxBdmFpbGFibGVMZWZ0LCBzY3JvbGxBdmFpbGFibGVSaWdodCk7XG5cbiAgICBpZiAoc2Nyb2xsTGVmdENvbmRpdGlvbiAmJiBzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdib3RoJztcbiAgICB9XG4gICAgZWxzZSBpZiAoc2Nyb2xsTGVmdENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdsZWZ0JztcbiAgICB9XG4gICAgZWxzZSBpZiAoc2Nyb2xsUmlnaHRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAncmlnaHQnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiAnbm9uZSc7XG4gICAgfVxuXG4gIH1cblxuXG4gIC8vIENhbGN1bGF0ZXMgdGhlIHNjcm9sbCBzdGVwIGJhc2VkIG9uIHRoZSB3aWR0aCBvZiB0aGUgc2Nyb2xsZXIgYW5kIHRoZSBudW1iZXIgb2YgbGlua3NcbiAgY29uc3QgY2FsY3VsYXRlU2Nyb2xsU3RlcCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzY3JvbGxTdGVwID09PSAnYXZlcmFnZScpIHtcbiAgICAgIGxldCBzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbFdpZHRoIC0gKHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWxlZnQnKSkgKyBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1yaWdodCcpKSk7XG5cbiAgICAgIGxldCBzY3JvbGxTdGVwQXZlcmFnZSA9IE1hdGguZmxvb3Ioc2Nyb2xsVmlld3BvcnROb1BhZGRpbmcgLyBuYXZTY3JvbGxlckNvbnRlbnRJdGVtcy5sZW5ndGgpO1xuXG4gICAgICBzY3JvbGxTdGVwID0gc2Nyb2xsU3RlcEF2ZXJhZ2U7XG4gICAgfVxuICB9XG5cblxuICAvLyBNb3ZlIHRoZSBzY3JvbGxlciB3aXRoIGEgdHJhbnNmb3JtXG4gIGNvbnN0IG1vdmVTY3JvbGxlciA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuXG4gICAgaWYgKHNjcm9sbGluZyA9PT0gdHJ1ZSB8fCAoc2Nyb2xsT3ZlcmZsb3cgIT09IGRpcmVjdGlvbiAmJiBzY3JvbGxPdmVyZmxvdyAhPT0gJ2JvdGgnKSkgcmV0dXJuO1xuXG4gICAgbGV0IHNjcm9sbERpc3RhbmNlID0gc2Nyb2xsU3RlcDtcbiAgICBsZXQgc2Nyb2xsQXZhaWxhYmxlID0gZGlyZWN0aW9uID09PSAnbGVmdCcgPyBzY3JvbGxBdmFpbGFibGVMZWZ0IDogc2Nyb2xsQXZhaWxhYmxlUmlnaHQ7XG5cbiAgICAvLyBJZiB0aGVyZSB3aWxsIGJlIGxlc3MgdGhhbiAyNSUgb2YgdGhlIGxhc3Qgc3RlcCB2aXNpYmxlIHRoZW4gc2Nyb2xsIHRvIHRoZSBlbmRcbiAgICBpZiAoc2Nyb2xsQXZhaWxhYmxlIDwgKHNjcm9sbFN0ZXAgKiAxLjc1KSkge1xuICAgICAgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxBdmFpbGFibGU7XG4gICAgfVxuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgc2Nyb2xsRGlzdGFuY2UgKj0gLTE7XG5cbiAgICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCBzY3JvbGxTdGVwKSB7XG4gICAgICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QuYWRkKCdzbmFwLWFsaWduLWVuZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJyk7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKCcgKyBzY3JvbGxEaXN0YW5jZSArICdweCknO1xuXG4gICAgc2Nyb2xsaW5nRGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHNjcm9sbGluZyA9IHRydWU7XG4gIH1cblxuXG4gIC8vIFNldCB0aGUgc2Nyb2xsZXIgcG9zaXRpb24gYW5kIHJlbW92ZXMgdHJhbnNmb3JtLCBjYWxsZWQgYWZ0ZXIgbW92ZVNjcm9sbGVyKCkgaW4gdGhlIHRyYW5zaXRpb25lbmQgZXZlbnRcbiAgY29uc3Qgc2V0U2Nyb2xsZXJQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCwgbnVsbCk7XG4gICAgdmFyIHRyYW5zZm9ybSA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3RyYW5zZm9ybScpO1xuICAgIHZhciB0cmFuc2Zvcm1WYWx1ZSA9IE1hdGguYWJzKHBhcnNlSW50KHRyYW5zZm9ybS5zcGxpdCgnLCcpWzRdKSB8fCAwKTtcblxuICAgIGlmIChzY3JvbGxpbmdEaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuICAgICAgdHJhbnNmb3JtVmFsdWUgKj0gLTE7XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJyc7XG4gICAgbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQgKyB0cmFuc2Zvcm1WYWx1ZTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnbm8tdHJhbnNpdGlvbicsICdzbmFwLWFsaWduLWVuZCcpO1xuXG4gICAgc2Nyb2xsaW5nID0gZmFsc2U7XG4gIH1cblxuXG4gIC8vIFRvZ2dsZSBidXR0b25zIGRlcGVuZGluZyBvbiBvdmVyZmxvd1xuICBjb25zdCB0b2dnbGVCdXR0b25zID0gZnVuY3Rpb24ob3ZlcmZsb3cpIHtcbiAgICBpZiAob3ZlcmZsb3cgPT09ICdib3RoJyB8fCBvdmVyZmxvdyA9PT0gJ2xlZnQnKSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJMZWZ0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cblxuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAncmlnaHQnKSB7XG4gICAgICBuYXZTY3JvbGxlclJpZ2h0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuICB9XG5cblxuICBjb25zdCBpbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICBzZXRPdmVyZmxvdygpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHJlcXVlc3RTZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJOYXYuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsICgpID0+IHtcbiAgICAgIHNldFNjcm9sbGVyUG9zaXRpb24oKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyTGVmdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1vdmVTY3JvbGxlcignbGVmdCcpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJSaWdodC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1vdmVTY3JvbGxlcigncmlnaHQnKTtcbiAgICB9KTtcblxuICB9O1xuXG5cbiAgLy8gU2VsZiBpbml0XG4gIGluaXQoKTtcblxuXG4gIC8vIFJldmVhbCBBUElcbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG5cbn07XG5cbi8vZXhwb3J0IGRlZmF1bHQgUHJpb3JpdHlOYXZTY3JvbGxlcjtcbiIsIiQoICdodG1sJyApLnJlbW92ZUNsYXNzKCAnbm8tanMnICkuYWRkQ2xhc3MoICdqcycgKTtcbiIsIi8vIE9wdGltaXphdGlvbiBmb3IgUmVwZWF0IFZpZXdzXG5pZiAoIHNlc3Npb25TdG9yYWdlLnNlcmlmRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgJiYgc2Vzc2lvblN0b3JhZ2Uuc2Fuc0ZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsICkge1xuXHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2VyaWYtZm9udHMtbG9hZGVkIHNhbnMtZm9udHMtbG9hZGVkJztcbn0gZWxzZSB7XG5cdC8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4xLjAgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oIGZ1bmN0aW9uKCkge1xuXHRcdCd1c2Ugc3RyaWN0Jzt2YXIgZixcblx0XHRcdGcgPSBbXTtmdW5jdGlvbiBsKCBhICkge1xuXHRcdFx0Zy5wdXNoKCBhICk7MSA9PSBnLmxlbmd0aCAmJiBmKCk7XG5cdFx0fSBmdW5jdGlvbiBtKCkge1xuXHRcdFx0Zm9yICggO2cubGVuZ3RoOyApIHtcblx0XHRcdFx0Z1swXSgpLCBnLnNoaWZ0KCk7XG5cdFx0XHR9XG5cdFx0fWYgPSBmdW5jdGlvbigpIHtcblx0XHRcdHNldFRpbWVvdXQoIG0gKTtcblx0XHR9O2Z1bmN0aW9uIG4oIGEgKSB7XG5cdFx0XHR0aGlzLmEgPSBwO3RoaXMuYiA9IHZvaWQgMDt0aGlzLmYgPSBbXTt2YXIgYiA9IHRoaXM7dHJ5IHtcblx0XHRcdFx0YSggZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0cSggYiwgYSApO1xuXHRcdFx0XHR9LCBmdW5jdGlvbiggYSApIHtcblx0XHRcdFx0XHRyKCBiLCBhICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gY2F0Y2ggKCBjICkge1xuXHRcdFx0XHRyKCBiLCBjICk7XG5cdFx0XHR9XG5cdFx0fSB2YXIgcCA9IDI7ZnVuY3Rpb24gdCggYSApIHtcblx0XHRcdHJldHVybiBuZXcgbiggZnVuY3Rpb24oIGIsIGMgKSB7XG5cdFx0XHRcdGMoIGEgKTtcblx0XHRcdH0gKTtcblx0XHR9IGZ1bmN0aW9uIHUoIGEgKSB7XG5cdFx0XHRyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBiICkge1xuXHRcdFx0XHRiKCBhICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBmdW5jdGlvbiBxKCBhLCBiICkge1xuXHRcdFx0aWYgKCBhLmEgPT0gcCApIHtcblx0XHRcdFx0aWYgKCBiID09IGEgKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcjtcblx0XHRcdFx0fSB2YXIgYyA9ICEgMTt0cnkge1xuXHRcdFx0XHRcdHZhciBkID0gYiAmJiBiLnRoZW47aWYgKCBudWxsICE9IGIgJiYgJ29iamVjdCcgPT09IHR5cGVvZiBiICYmICdmdW5jdGlvbicgPT09IHR5cGVvZiBkICkge1xuXHRcdFx0XHRcdFx0ZC5jYWxsKCBiLCBmdW5jdGlvbiggYiApIHtcblx0XHRcdFx0XHRcdFx0YyB8fCBxKCBhLCBiICk7YyA9ICEgMDtcblx0XHRcdFx0XHRcdH0sIGZ1bmN0aW9uKCBiICkge1xuXHRcdFx0XHRcdFx0XHRjIHx8IHIoIGEsIGIgKTtjID0gISAwO1xuXHRcdFx0XHRcdFx0fSApO3JldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gY2F0Y2ggKCBlICkge1xuXHRcdFx0XHRcdGMgfHwgciggYSwgZSApO3JldHVybjtcblx0XHRcdFx0fWEuYSA9IDA7YS5iID0gYjt2KCBhICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHIoIGEsIGIgKSB7XG5cdFx0XHRpZiAoIGEuYSA9PSBwICkge1xuXHRcdFx0XHRpZiAoIGIgPT0gYSApIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yO1xuXHRcdFx0XHR9YS5hID0gMTthLmIgPSBiO3YoIGEgKTtcblx0XHRcdH1cblx0XHR9IGZ1bmN0aW9uIHYoIGEgKSB7XG5cdFx0XHRsKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBhLmEgIT0gcCApIHtcblx0XHRcdFx0XHRmb3IgKCA7YS5mLmxlbmd0aDsgKSB7XG5cdFx0XHRcdFx0XHR2YXIgYiA9IGEuZi5zaGlmdCgpLFxuXHRcdFx0XHRcdFx0XHRjID0gYlswXSxcblx0XHRcdFx0XHRcdFx0ZCA9IGJbMV0sXG5cdFx0XHRcdFx0XHRcdGUgPSBiWzJdLFxuXHRcdFx0XHRcdFx0XHRiID0gYlszXTt0cnkge1xuXHRcdFx0XHRcdFx0XHQwID09IGEuYSA/ICdmdW5jdGlvbicgPT09IHR5cGVvZiBjID8gZSggYy5jYWxsKCB2b2lkIDAsIGEuYiApICkgOiBlKCBhLmIgKSA6IDEgPT0gYS5hICYmICggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGQgPyBlKCBkLmNhbGwoIHZvaWQgMCwgYS5iICkgKSA6IGIoIGEuYiApICk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoICggaCApIHtcblx0XHRcdFx0XHRcdFx0YiggaCApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1uLnByb3RvdHlwZS5nID0gZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jKCB2b2lkIDAsIGEgKTtcblx0XHR9O24ucHJvdG90eXBlLmMgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdHZhciBjID0gdGhpcztyZXR1cm4gbmV3IG4oIGZ1bmN0aW9uKCBkLCBlICkge1xuXHRcdFx0XHRjLmYucHVzaCggWyBhLCBiLCBkLCBlIF0gKTt2KCBjICk7XG5cdFx0XHR9ICk7XG5cdFx0fTtcblx0XHRmdW5jdGlvbiB3KCBhICkge1xuXHRcdFx0cmV0dXJuIG5ldyBuKCBmdW5jdGlvbiggYiwgYyApIHtcblx0XHRcdFx0ZnVuY3Rpb24gZCggYyApIHtcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGQgKSB7XG5cdFx0XHRcdFx0XHRoW2NdID0gZDtlICs9IDE7ZSA9PSBhLmxlbmd0aCAmJiBiKCBoICk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fSB2YXIgZSA9IDAsXG5cdFx0XHRcdFx0aCA9IFtdOzAgPT0gYS5sZW5ndGggJiYgYiggaCApO2ZvciAoIHZhciBrID0gMDtrIDwgYS5sZW5ndGg7ayArPSAxICkge1xuXHRcdFx0XHRcdHUoIGFba10gKS5jKCBkKCBrICksIGMgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0gZnVuY3Rpb24geCggYSApIHtcblx0XHRcdHJldHVybiBuZXcgbiggZnVuY3Rpb24oIGIsIGMgKSB7XG5cdFx0XHRcdGZvciAoIHZhciBkID0gMDtkIDwgYS5sZW5ndGg7ZCArPSAxICkge1xuXHRcdFx0XHRcdHUoIGFbZF0gKS5jKCBiLCBjICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9d2luZG93LlByb21pc2UgfHwgKCB3aW5kb3cuUHJvbWlzZSA9IG4sIHdpbmRvdy5Qcm9taXNlLnJlc29sdmUgPSB1LCB3aW5kb3cuUHJvbWlzZS5yZWplY3QgPSB0LCB3aW5kb3cuUHJvbWlzZS5yYWNlID0geCwgd2luZG93LlByb21pc2UuYWxsID0gdywgd2luZG93LlByb21pc2UucHJvdG90eXBlLnRoZW4gPSBuLnByb3RvdHlwZS5jLCB3aW5kb3cuUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2ggPSBuLnByb3RvdHlwZS5nICk7XG5cdH0oKSApO1xuXG5cdCggZnVuY3Rpb24oKSB7XG5cdFx0ZnVuY3Rpb24gbCggYSwgYiApIHtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPyBhLmFkZEV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCBiLCAhIDEgKSA6IGEuYXR0YWNoRXZlbnQoICdzY3JvbGwnLCBiICk7XG5cdFx0fSBmdW5jdGlvbiBtKCBhICkge1xuXHRcdFx0ZG9jdW1lbnQuYm9keSA/IGEoKSA6IGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgPyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uIGMoKSB7XG5cdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgYyApO2EoKTtcblx0XHRcdH0gKSA6IGRvY3VtZW50LmF0dGFjaEV2ZW50KCAnb25yZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24gaygpIHtcblx0XHRcdFx0aWYgKCAnaW50ZXJhY3RpdmUnID09IGRvY3VtZW50LnJlYWR5U3RhdGUgfHwgJ2NvbXBsZXRlJyA9PSBkb2N1bWVudC5yZWFkeVN0YXRlICkge1xuXHRcdFx0XHRcdGRvY3VtZW50LmRldGFjaEV2ZW50KCAnb25yZWFkeXN0YXRlY2hhbmdlJywgayApLCBhKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9IGZ1bmN0aW9uIHQoIGEgKSB7XG5cdFx0XHR0aGlzLmEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO3RoaXMuYS5zZXRBdHRyaWJ1dGUoICdhcmlhLWhpZGRlbicsICd0cnVlJyApO3RoaXMuYS5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIGEgKSApO3RoaXMuYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO3RoaXMuZyA9IC0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0ID0gJ21heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4Oyc7dGhpcy5jLnN0eWxlLmNzc1RleHQgPSAnbWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7Jztcblx0XHRcdHRoaXMuZi5zdHlsZS5jc3NUZXh0ID0gJ21heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4Oyc7dGhpcy5oLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTsnO3RoaXMuYi5hcHBlbmRDaGlsZCggdGhpcy5oICk7dGhpcy5jLmFwcGVuZENoaWxkKCB0aGlzLmYgKTt0aGlzLmEuYXBwZW5kQ2hpbGQoIHRoaXMuYiApO3RoaXMuYS5hcHBlbmRDaGlsZCggdGhpcy5jICk7XG5cdFx0fVxuXHRcdGZ1bmN0aW9uIHUoIGEsIGIgKSB7XG5cdFx0XHRhLmEuc3R5bGUuY3NzVGV4dCA9ICdtYXgtd2lkdGg6bm9uZTttaW4td2lkdGg6MjBweDttaW4taGVpZ2h0OjIwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmF1dG87bWFyZ2luOjA7cGFkZGluZzowO3RvcDotOTk5cHg7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQtc3ludGhlc2lzOm5vbmU7Zm9udDonICsgYiArICc7Jztcblx0XHR9IGZ1bmN0aW9uIHooIGEgKSB7XG5cdFx0XHR2YXIgYiA9IGEuYS5vZmZzZXRXaWR0aCxcblx0XHRcdFx0YyA9IGIgKyAxMDA7YS5mLnN0eWxlLndpZHRoID0gYyArICdweCc7YS5jLnNjcm9sbExlZnQgPSBjO2EuYi5zY3JvbGxMZWZ0ID0gYS5iLnNjcm9sbFdpZHRoICsgMTAwO3JldHVybiBhLmcgIT09IGIgPyAoIGEuZyA9IGIsICEgMCApIDogISAxO1xuXHRcdH0gZnVuY3Rpb24gQSggYSwgYiApIHtcblx0XHRcdGZ1bmN0aW9uIGMoKSB7XG5cdFx0XHRcdHZhciBhID0gazt6KCBhICkgJiYgYS5hLnBhcmVudE5vZGUgJiYgYiggYS5nICk7XG5cdFx0XHR9IHZhciBrID0gYTtsKCBhLmIsIGMgKTtsKCBhLmMsIGMgKTt6KCBhICk7XG5cdFx0fSBmdW5jdGlvbiBCKCBhLCBiICkge1xuXHRcdFx0dmFyIGMgPSBiIHx8IHt9O3RoaXMuZmFtaWx5ID0gYTt0aGlzLnN0eWxlID0gYy5zdHlsZSB8fCAnbm9ybWFsJzt0aGlzLndlaWdodCA9IGMud2VpZ2h0IHx8ICdub3JtYWwnO3RoaXMuc3RyZXRjaCA9IGMuc3RyZXRjaCB8fCAnbm9ybWFsJztcblx0XHR9IHZhciBDID0gbnVsbCxcblx0XHRcdEQgPSBudWxsLFxuXHRcdFx0RSA9IG51bGwsXG5cdFx0XHRGID0gbnVsbDtmdW5jdGlvbiBHKCkge1xuXHRcdFx0aWYgKCBudWxsID09PSBEICkge1xuXHRcdFx0XHRpZiAoIEooKSAmJiAvQXBwbGUvLnRlc3QoIHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yICkgKSB7XG5cdFx0XHRcdFx0dmFyIGEgPSAvQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKSg/OlxcLihbMC05XSspKS8uZXhlYyggd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQgKTtEID0gISEgYSAmJiA2MDMgPiBwYXJzZUludCggYVsxXSwgMTAgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHREID0gISAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9IHJldHVybiBEO1xuXHRcdH0gZnVuY3Rpb24gSigpIHtcblx0XHRcdG51bGwgPT09IEYgJiYgKCBGID0gISEgZG9jdW1lbnQuZm9udHMgKTtyZXR1cm4gRjtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gSygpIHtcblx0XHRcdGlmICggbnVsbCA9PT0gRSApIHtcblx0XHRcdFx0dmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO3RyeSB7XG5cdFx0XHRcdFx0YS5zdHlsZS5mb250ID0gJ2NvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmJztcblx0XHRcdFx0fSBjYXRjaCAoIGIgKSB7fUUgPSAnJyAhPT0gYS5zdHlsZS5mb250O1xuXHRcdFx0fSByZXR1cm4gRTtcblx0XHR9IGZ1bmN0aW9uIEwoIGEsIGIgKSB7XG5cdFx0XHRyZXR1cm4gWyBhLnN0eWxlLCBhLndlaWdodCwgSygpID8gYS5zdHJldGNoIDogJycsICcxMDBweCcsIGIgXS5qb2luKCAnICcgKTtcblx0XHR9XG5cdFx0Qi5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0dmFyIGMgPSB0aGlzLFxuXHRcdFx0XHRrID0gYSB8fCAnQkVTYnN3eScsXG5cdFx0XHRcdHIgPSAwLFxuXHRcdFx0XHRuID0gYiB8fCAzRTMsXG5cdFx0XHRcdEggPSAoIG5ldyBEYXRlICkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZSggZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHRcdGlmICggSigpICYmICEgRygpICkge1xuXHRcdFx0XHRcdHZhciBNID0gbmV3IFByb21pc2UoIGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiBlKCkge1xuXHRcdFx0XHRcdFx0XHRcdCggbmV3IERhdGUgKS5nZXRUaW1lKCkgLSBIID49IG4gPyBiKCBFcnJvciggJycgKyBuICsgJ21zIHRpbWVvdXQgZXhjZWVkZWQnICkgKSA6IGRvY3VtZW50LmZvbnRzLmxvYWQoIEwoIGMsICdcIicgKyBjLmZhbWlseSArICdcIicgKSwgayApLnRoZW4oIGZ1bmN0aW9uKCBjICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0MSA8PSBjLmxlbmd0aCA/IGEoKSA6IHNldFRpbWVvdXQoIGUsIDI1ICk7XG5cdFx0XHRcdFx0XHRcdFx0fSwgYiApO1xuXHRcdFx0XHRcdFx0XHR9ZSgpO1xuXHRcdFx0XHRcdFx0fSApLFxuXHRcdFx0XHRcdFx0TiA9IG5ldyBQcm9taXNlKCBmdW5jdGlvbiggYSwgYyApIHtcblx0XHRcdFx0XHRcdFx0ciA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdGMoIEVycm9yKCAnJyArIG4gKyAnbXMgdGltZW91dCBleGNlZWRlZCcgKSApO1xuXHRcdFx0XHRcdFx0XHR9LCBuICk7XG5cdFx0XHRcdFx0XHR9ICk7UHJvbWlzZS5yYWNlKCBbIE4sIE0gXSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCByICk7YSggYyApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YiApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG0oIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gdigpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGI7aWYgKCBiID0gLTEgIT0gZiAmJiAtMSAhPSBnIHx8IC0xICE9IGYgJiYgLTEgIT0gaCB8fCAtMSAhPSBnICYmIC0xICE9IGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0KCBiID0gZiAhPSBnICYmIGYgIT0gaCAmJiBnICE9IGggKSB8fCAoIG51bGwgPT09IEMgJiYgKCBiID0gL0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMoIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50ICksIEMgPSAhISBiICYmICggNTM2ID4gcGFyc2VJbnQoIGJbMV0sIDEwICkgfHwgNTM2ID09PSBwYXJzZUludCggYlsxXSwgMTAgKSAmJiAxMSA+PSBwYXJzZUludCggYlsyXSwgMTAgKSApICksIGIgPSBDICYmICggZiA9PSB3ICYmIGcgPT0gdyAmJiBoID09IHcgfHwgZiA9PSB4ICYmIGcgPT0geCAmJiBoID09IHggfHwgZiA9PSB5ICYmIGcgPT0geSAmJiBoID09IHkgKSApLCBiID0gISBiO1xuXHRcdFx0XHRcdFx0XHR9YiAmJiAoIGQucGFyZW50Tm9kZSAmJiBkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIGQgKSwgY2xlYXJUaW1lb3V0KCByICksIGEoIGMgKSApO1xuXHRcdFx0XHRcdFx0fSBmdW5jdGlvbiBJKCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICggbmV3IERhdGUgKS5nZXRUaW1lKCkgLSBIID49IG4gKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZC5wYXJlbnROb2RlICYmIGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZCApLCBiKCBFcnJvciggJycgK1xuXHRuICsgJ21zIHRpbWVvdXQgZXhjZWVkZWQnICkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgYSA9IGRvY3VtZW50LmhpZGRlbjtpZiAoICEgMCA9PT0gYSB8fCB2b2lkIDAgPT09IGEgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRmID0gZS5hLm9mZnNldFdpZHRoLCBnID0gcC5hLm9mZnNldFdpZHRoLCBoID0gcS5hLm9mZnNldFdpZHRoLCB2KCk7XG5cdFx0XHRcdFx0XHRcdFx0fXIgPSBzZXRUaW1lb3V0KCBJLCA1MCApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IHZhciBlID0gbmV3IHQoIGsgKSxcblx0XHRcdFx0XHRcdFx0cCA9IG5ldyB0KCBrICksXG5cdFx0XHRcdFx0XHRcdHEgPSBuZXcgdCggayApLFxuXHRcdFx0XHRcdFx0XHRmID0gLTEsXG5cdFx0XHRcdFx0XHRcdGcgPSAtMSxcblx0XHRcdFx0XHRcdFx0aCA9IC0xLFxuXHRcdFx0XHRcdFx0XHR3ID0gLTEsXG5cdFx0XHRcdFx0XHRcdHggPSAtMSxcblx0XHRcdFx0XHRcdFx0eSA9IC0xLFxuXHRcdFx0XHRcdFx0XHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtkLmRpciA9ICdsdHInO3UoIGUsIEwoIGMsICdzYW5zLXNlcmlmJyApICk7dSggcCwgTCggYywgJ3NlcmlmJyApICk7dSggcSwgTCggYywgJ21vbm9zcGFjZScgKSApO2QuYXBwZW5kQ2hpbGQoIGUuYSApO2QuYXBwZW5kQ2hpbGQoIHAuYSApO2QuYXBwZW5kQ2hpbGQoIHEuYSApO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGQgKTt3ID0gZS5hLm9mZnNldFdpZHRoO3ggPSBwLmEub2Zmc2V0V2lkdGg7eSA9IHEuYS5vZmZzZXRXaWR0aDtJKCk7QSggZSwgZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0XHRcdGYgPSBhO3YoKTtcblx0XHRcdFx0XHRcdH0gKTt1KCBlLFxuXHRcdFx0XHRcdFx0XHRMKCBjLCAnXCInICsgYy5mYW1pbHkgKyAnXCIsc2Fucy1zZXJpZicgKSApO0EoIHAsIGZ1bmN0aW9uKCBhICkge1xuXHRcdFx0XHRcdFx0XHRnID0gYTt2KCk7XG5cdFx0XHRcdFx0XHR9ICk7dSggcCwgTCggYywgJ1wiJyArIGMuZmFtaWx5ICsgJ1wiLHNlcmlmJyApICk7QSggcSwgZnVuY3Rpb24oIGEgKSB7XG5cdFx0XHRcdFx0XHRcdGggPSBhO3YoKTtcblx0XHRcdFx0XHRcdH0gKTt1KCBxLCBMKCBjLCAnXCInICsgYy5mYW1pbHkgKyAnXCIsbW9ub3NwYWNlJyApICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fTsnb2JqZWN0JyA9PT0gdHlwZW9mIG1vZHVsZSA/IG1vZHVsZS5leHBvcnRzID0gQiA6ICggd2luZG93LkZvbnRGYWNlT2JzZXJ2ZXIgPSBCLCB3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZCA9IEIucHJvdG90eXBlLmxvYWQgKTtcblx0fSgpICk7XG5cblx0Ly8gbWlubnBvc3QgZm9udHNcblxuXHQvLyBzYW5zXG5cdHZhciBzYW5zTm9ybWFsID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoICdmZi1tZXRhLXdlYi1wcm8nICk7XG5cdHZhciBzYW5zQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNhbnNOb3JtYWxJdGFsaWMgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA0MDAsXG5cdFx0XHRzdHlsZTogJ2l0YWxpYydcblx0XHR9XG5cdCk7XG5cblx0Ly8gc2VyaWZcblx0dmFyIHNlcmlmQm9vayA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDUwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9va0l0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDUwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9sZCA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMFxuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQm9sZEl0YWxpYyA9IG5ldyBGb250RmFjZU9ic2VydmVyKFxuXHRcdCdmZi1tZXRhLXNlcmlmLXdlYi1wcm8nLCB7XG5cdFx0XHR3ZWlnaHQ6IDcwMCxcblx0XHRcdHN0eWxlOiAnaXRhbGljJ1xuXHRcdH1cblx0KTtcblx0dmFyIHNlcmlmQmxhY2sgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihcblx0XHQnZmYtbWV0YS1zZXJpZi13ZWItcHJvJywge1xuXHRcdFx0d2VpZ2h0OiA5MDBcblx0XHR9XG5cdCk7XG5cdHZhciBzZXJpZkJsYWNrSXRhbGljID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoXG5cdFx0J2ZmLW1ldGEtc2VyaWYtd2ViLXBybycsIHtcblx0XHRcdHdlaWdodDogOTAwLFxuXHRcdFx0c3R5bGU6ICdpdGFsaWMnXG5cdFx0fVxuXHQpO1xuXG5cdFByb21pc2UuYWxsKCBbXG5cdFx0c2Fuc05vcm1hbC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc0JvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNOb3JtYWxJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9vay5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCb29rSXRhbGljLmxvYWQoIG51bGwsIDMwMDAgKSxcblx0XHRzZXJpZkJvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNlcmlmQm9sZEl0YWxpYy5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCbGFjay5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2VyaWZCbGFja0l0YWxpYy5sb2FkKCBudWxsLCAzMDAwIClcblx0XSApLnRoZW4oIGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc05hbWUgKz0gJyBzZXJpZi1mb250cy1sb2FkZWQnO1xuXG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zZXJpZkZvbnRzTG9hZGVkRm91dFdpdGhDbGFzc1BvbHlmaWxsID0gdHJ1ZTtcblx0fSApO1xuXG5cdFByb21pc2UuYWxsKCBbXG5cdFx0c2Fuc05vcm1hbC5sb2FkKCBudWxsLCAzMDAwICksXG5cdFx0c2Fuc0JvbGQubG9hZCggbnVsbCwgMzAwMCApLFxuXHRcdHNhbnNOb3JtYWxJdGFsaWMubG9hZCggbnVsbCwgMzAwMCApXG5cdF0gKS50aGVuKCBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2Fucy1mb250cy1sb2FkZWQnO1xuXG5cdFx0Ly8gT3B0aW1pemF0aW9uIGZvciBSZXBlYXQgVmlld3Ncblx0XHRzZXNzaW9uU3RvcmFnZS5zYW5zRm9udHNMb2FkZWRGb3V0V2l0aENsYXNzUG9seWZpbGwgPSB0cnVlO1xuXHR9ICk7XG59XG5cbiIsImZ1bmN0aW9uIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIHZhbHVlICkge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z2EoICdzZW5kJywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlICk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblxuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdH1cblx0XHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdH1cbn0gKTtcbiIsImZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uID0gJycgKSB7XG5cblx0Ly8gaWYgYSBub3QgbG9nZ2VkIGluIHVzZXIgdHJpZXMgdG8gZW1haWwsIGRvbid0IGNvdW50IHRoYXQgYXMgYSBzaGFyZVxuXHRpZiAoICEgalF1ZXJ5KCAnYm9keScgKS5oYXNDbGFzcyggJ2xvZ2dlZC1pbicgKSAmJiAnRW1haWwnID09PSB0ZXh0ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBjYXRlZ29yeSA9ICdTaGFyZSc7XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdGNhdGVnb3J5ID0gJ1NoYXJlIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cblx0Ly8gdHJhY2sgYXMgYW4gZXZlbnQsIGFuZCBhcyBzb2NpYWwgaWYgaXQgaXMgdHdpdHRlciBvciBmYlxuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsIGNhdGVnb3J5LCB0ZXh0LCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG5cdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0IHx8ICdUd2l0dGVyJyA9PT0gdGV4dCApIHtcblx0XHRcdGlmICggJ0ZhY2Vib29rJyA9PT0gdGV4dCApIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdTaGFyZScsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1R3ZWV0JywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNvcHlDdXJyZW50VVJMKCkge1xuXHR2YXIgZHVtbXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW5wdXQnICksXG5cdFx0dGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkdW1teSApO1xuXHRkdW1teS52YWx1ZSA9IHRleHQ7XG5cdGR1bW15LnNlbGVjdCgpO1xuXHRkb2N1bWVudC5leGVjQ29tbWFuZCggJ2NvcHknICk7XG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoIGR1bW15ICk7XG59XG5cbiQoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLmRhdGEoICdzaGFyZS1hY3Rpb24nICk7XG5cdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSApO1xuXG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtcHJpbnQgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0d2luZG93LnByaW50KCk7XG59ICk7XG5cbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1jb3B5LXVybCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0Y29weUN1cnJlbnRVUkwoKTtcblx0dGxpdGUuc2hvdyggKCBlLnRhcmdldCApLCB7IGdyYXY6ICd3JyB9ICk7XG5cdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdHRsaXRlLmhpZGUoICggZS50YXJnZXQgKSApO1xuXHR9LCAzMDAwICk7XG5cdHJldHVybiBmYWxzZTtcbn0gKTtcblxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWZhY2Vib29rIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXR3aXR0ZXIgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZW1haWwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0dmFyIHVybCA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblx0d2luZG93Lm9wZW4oIHVybCwgJ19ibGFuaycgKTtcbn0gKTtcbiIsIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIE5hdmlnYXRpb24gc2NyaXB0cy4gSW5jbHVkZXMgbW9iaWxlIG9yIHRvZ2dsZSBiZWhhdmlvciwgYW5hbHl0aWNzIHRyYWNraW5nIG9mIHNwZWNpZmljIG1lbnVzLlxuICovXG5cbmZ1bmN0aW9uIHNldHVwUHJpbWFyeU5hdigpIHtcblx0Y29uc3QgcHJpbWFyeU5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1saW5rcycgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHByaW1hcnlOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IGJ1dHRvbicgKTtcblx0aWYgKCBudWxsICE9PSBwcmltYXJ5TmF2VG9nZ2xlICkge1xuXHRcdHByaW1hcnlOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRjb25zdCB1c2VyTmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItbWlubnBvc3QtYWNjb3VudCB1bCcgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHVzZXJOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItbWlubnBvc3QtYWNjb3VudCA+IGEnICk7XG5cdGlmICggbnVsbCAhPT0gdXNlck5hdlRvZ2dsZSApIHtcblx0XHR1c2VyTmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0dmFyIHRhcmdldCAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgLm0tZm9ybS1zZWFyY2ggZmllbGRzZXQgLmEtYnV0dG9uLXNlbnRlbmNlJyApO1xuXHRpZiAoIG51bGwgIT09IHRhcmdldCApIHtcblx0XHR2YXIgZGl2ICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRkaXYuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLXNlYXJjaFwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuXHRcdHZhciBmcmFnbWVudCAgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0ZGl2LnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuXHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG5cblx0XHRjb25zdCBzZWFyY2hUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1hY3Rpb25zIC5tLWZvcm0tc2VhcmNoJyApLFxuXHRcdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHRcdH0gKTtcblxuXHRcdHZhciBzZWFyY2hWaXNpYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ2xpLnNlYXJjaCA+IGEnICk7XG5cdFx0c2VhcmNoVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHR2YXIgc2VhcmNoQ2xvc2UgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLXNlYXJjaCcgKTtcblx0XHRzZWFyY2hDbG9zZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHQvLyBlc2NhcGUga2V5IHByZXNzXG5cdCQoIGRvY3VtZW50ICkua2V5dXAoIGZ1bmN0aW9uKCBlICkge1xuXHRcdGlmICggMjcgPT09IGUua2V5Q29kZSApIHtcblx0XHRcdGxldCBwcmltYXJ5TmF2RXhwYW5kZWQgPSAndHJ1ZScgPT09IHByaW1hcnlOYXZUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGxldCB1c2VyTmF2RXhwYW5kZWQgPSAndHJ1ZScgPT09IHVzZXJOYXZUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGxldCBzZWFyY2hJc1Zpc2libGUgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgcHJpbWFyeU5hdkV4cGFuZGVkICYmIHRydWUgPT09IHByaW1hcnlOYXZFeHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRvZ2dsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBwcmltYXJ5TmF2RXhwYW5kZWQgKTtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiB1c2VyTmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gdXNlck5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHVzZXJOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHNlYXJjaElzVmlzaWJsZSAmJiB0cnVlID09PSBzZWFyY2hJc1Zpc2libGUgKSB7XG5cdFx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgc2VhcmNoSXNWaXNpYmxlICk7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufVxuXG5mdW5jdGlvbiBzZXR1cFNjcm9sbE5hdiggc2VsZWN0b3IsIG5hdlNlbGVjdG9yLCBjb250ZW50U2VsZWN0b3IgKSB7XG5cblx0Ly8gSW5pdCB3aXRoIGFsbCBvcHRpb25zIGF0IGRlZmF1bHQgc2V0dGluZ1xuXHRjb25zdCBwcmlvcml0eU5hdlNjcm9sbGVyRGVmYXVsdCA9IFByaW9yaXR5TmF2U2Nyb2xsZXIoIHtcblx0XHRzZWxlY3Rvcjogc2VsZWN0b3IsXG5cdFx0bmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yLFxuXHRcdGNvbnRlbnRTZWxlY3RvcjogY29udGVudFNlbGVjdG9yLFxuXHRcdGl0ZW1TZWxlY3RvcjogJ2xpLCBhJyxcblx0XHRidXR0b25MZWZ0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tbGVmdCcsXG5cdFx0YnV0dG9uUmlnaHRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1yaWdodCdcblxuXHRcdC8vc2Nyb2xsU3RlcDogJ2F2ZXJhZ2UnXG5cdH0gKTtcblxuXHQvLyBJbml0IG11bHRpcGxlIG5hdiBzY3JvbGxlcnMgd2l0aCB0aGUgc2FtZSBvcHRpb25zXG5cdC8qbGV0IG5hdlNjcm9sbGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYtc2Nyb2xsZXInKTtcblxuXHRuYXZTY3JvbGxlcnMuZm9yRWFjaCgoY3VycmVudFZhbHVlLCBjdXJyZW50SW5kZXgpID0+IHtcblx0ICBQcmlvcml0eU5hdlNjcm9sbGVyKHtcblx0ICAgIHNlbGVjdG9yOiBjdXJyZW50VmFsdWVcblx0ICB9KTtcblx0fSk7Ki9cbn1cblxuc2V0dXBQcmltYXJ5TmF2KCk7XG5cbmlmICggMCA8ICQoICcubS1zdWItbmF2aWdhdGlvbicgKS5sZW5ndGggKSB7XG5cdHNldHVwU2Nyb2xsTmF2KCAnLm0tc3ViLW5hdmlnYXRpb24nLCAnLm0tc3VibmF2LW5hdmlnYXRpb24nLCAnLm0tbWVudS1zdWItbmF2aWdhdGlvbicgKTtcbn1cbmlmICggMCA8ICQoICcubS1wYWdpbmF0aW9uLW5hdmlnYXRpb24nICkubGVuZ3RoICkge1xuXHRzZXR1cFNjcm9sbE5hdiggJy5tLXBhZ2luYXRpb24tbmF2aWdhdGlvbicsICcubS1wYWdpbmF0aW9uLWNvbnRhaW5lcicsICcubS1wYWdpbmF0aW9uLWxpc3QnICk7XG59XG5cbiQoICdhJywgJCggJy5vLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0dmFyIHdpZGdldFRpdGxlICAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXdpZGdldCcgKS5maW5kKCAnaDMnICkudGV4dCgpO1xuXHR2YXIgem9uZVRpdGxlICAgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0tem9uZScgKS5maW5kKCAnLmEtem9uZS10aXRsZScgKS50ZXh0KCk7XG5cdHZhciBzaWRlYmFyU2VjdGlvblRpdGxlID0gJyc7XG5cdGlmICggJycgIT09IHdpZGdldFRpdGxlICkge1xuXHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB3aWRnZXRUaXRsZTtcblx0fSBlbHNlIGlmICggJycgIT09IHpvbmVUaXRsZSApIHtcblx0XHRzaWRlYmFyU2VjdGlvblRpdGxlID0gem9uZVRpdGxlO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJTZWN0aW9uVGl0bGUgKTtcbn0gKTtcbiIsImpRdWVyeS5mbi50ZXh0Tm9kZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY29udGVudHMoKS5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoIHRoaXMubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmICcnICE9PSB0aGlzLm5vZGVWYWx1ZS50cmltKCkgKTtcblx0fSApO1xufTtcblxuZnVuY3Rpb24gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggYWN0aW9uICkge1xuXHR2YXIgbWFya3VwID0gJzxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtZm9ybS1jb25maXJtXCI+PGxhYmVsPkFyZSB5b3Ugc3VyZT8gPGEgaWQ9XCJhLWNvbmZpcm0tJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPlllczwvYT4gfCA8YSBpZD1cImEtc3RvcC0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+Tm88L2E+PC9sYWJlbD48L2xpPic7XG5cdHJldHVybiBtYXJrdXA7XG59XG5cbmZ1bmN0aW9uIG1hbmFnZUVtYWlscygpIHtcblx0dmFyIGZvcm0gICAgICAgICAgICAgICA9ICQoICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJyApO1xuXHR2YXIgcmVzdFJvb3QgICAgICAgICAgID0gdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5zaXRlX3VybCArIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QucmVzdF9uYW1lc3BhY2U7XG5cdHZhciBmdWxsVXJsICAgICAgICAgICAgPSByZXN0Um9vdCArICcvJyArICd1cGRhdGUtdXNlci8nO1xuXHR2YXIgY29uZmlybUNoYW5nZSAgICAgID0gJyc7XG5cdHZhciBuZXh0RW1haWxDb3VudCAgICAgPSAxO1xuXHR2YXIgbmV3UHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBvbGRQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIHByaW1hcnlJZCAgICAgICAgICA9ICcnO1xuXHR2YXIgZW1haWxUb1JlbW92ZSAgICAgID0gJyc7XG5cdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0dmFyIG5ld0VtYWlscyAgICAgICAgICA9IFtdO1xuXHR2YXIgYWpheEZvcm1EYXRhICAgICAgID0gJyc7XG5cdHZhciB0aGF0ICAgICAgICAgICAgICAgPSAnJztcblxuXHQvLyBzdGFydCBvdXQgd2l0aCBubyBwcmltYXJ5L3JlbW92YWxzIGNoZWNrZWRcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0Ly8gaWYgdGhlcmUgaXMgYSBsaXN0IG9mIGVtYWlscyAobm90IGp1c3QgYSBzaW5nbGUgZm9ybSBmaWVsZClcblx0aWYgKCAwIDwgJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHNlbGVjdHMgYSBuZXcgcHJpbWFyeSwgbW92ZSBpdCBpbnRvIHRoYXQgcG9zaXRpb25cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScsIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRuZXdQcmltYXJ5RW1haWwgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRvbGRQcmltYXJ5RW1haWwgPSAkKCAnI2VtYWlsJyApLnZhbCgpO1xuXHRcdFx0cHJpbWFyeUlkICAgICAgID0gJCggdGhpcyApLnByb3AoICdpZCcgKS5yZXBsYWNlKCAncHJpbWFyeV9lbWFpbF8nLCAnJyApO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3ByaW1hcnktY2hhbmdlJyApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cblx0XHRcdC8vJCggdGhpcyApLnBhcmVudCgpLmFmdGVyKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgdXNlciBmYWNpbmcgdmFsdWVzXG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBuZXdQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyN1c2VyLWVtYWlsLScgKyBwcmltYXJ5SWQgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIG1haW4gaGlkZGVuIGZvcm0gdmFsdWVcblx0XHRcdFx0JCggJyNlbWFpbCcgKS52YWwoIG5ld1ByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHN1Ym1pdCBmb3JtIHZhbHVlcy5cblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblxuXHRcdFx0XHQvLyB1bmNoZWNrIHRoZSByYWRpbyBidXR0b25cblx0XHRcdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgZm9ybSB2YWx1ZXMgdG8gdGhlIG9sZCBwcmltYXJ5IGVtYWlsXG5cdFx0XHRcdCQoICcjcHJpbWFyeV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyNyZW1vdmVfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIHRoZSBjb25maXJtIG1lc3NhZ2Vcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdH0gKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdC8vIGlmIGEgdXNlciByZW1vdmVzIGFuIGVtYWlsLCB0YWtlIGl0IGF3YXkgZnJvbSB0aGUgdmlzdWFsIGFuZCBmcm9tIHRoZSBmb3JtXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NoYW5nZScsICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRlbWFpbFRvUmVtb3ZlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3JlbW92YWwnICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICE9PSBlbWFpbFRvUmVtb3ZlICkge1xuXHRcdFx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscy5wdXNoKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXIgZm9yIHJlbW92YWxcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdC8vIGlmIGNvbmZpcm1lZCwgcmVtb3ZlIHRoZSBlbWFpbCBhbmQgc3VibWl0IHRoZSBmb3JtXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpJyApLmZhZGVPdXQoICdub3JtYWwnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkucmVtb3ZlKCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXG5cdFx0XHRcdC8vY29uc29sZS5sb2coICd2YWx1ZSBpcyAnICsgY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0Ly8gaWYgYSB1c2VyIHdhbnRzIHRvIGFkZCBhbiBlbWFpbCwgZ2l2ZSB0aGVtIGEgcHJvcGVybHkgbnVtYmVyZWQgZmllbGRcblx0JCggJy5tLWZvcm0tZW1haWwnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJyApLmJlZm9yZSggJzxkaXYgY2xhc3M9XCJhLWlucHV0LXdpdGgtYnV0dG9uIGEtYnV0dG9uLXNlbnRlbmNlXCI+PGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgaWQ9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgdmFsdWU9XCJcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBuYW1lPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGlkPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGNsYXNzPVwiYS1idXR0b24gYS1idXR0b24tYWRkLXVzZXItZW1haWxcIj5BZGQ8L2J1dHRvbj48L2Rpdj4nICk7XG5cdFx0bmV4dEVtYWlsQ291bnQrKztcblx0fSApO1xuXG5cdCQoICdpbnB1dFt0eXBlPXN1Ym1pdF0nICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBidXR0b24gPSAkKCB0aGlzICk7XG5cdFx0dmFyIGJ1dHRvbkZvcm0gPSBidXR0b24uY2xvc2VzdCggJ2Zvcm0nICk7XG5cdFx0YnV0dG9uRm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nLCBidXR0b24udmFsKCkgKTtcblx0fSApO1xuXG5cdCQoICcubS1lbnRyeS1jb250ZW50JyApLm9uKCAnc3VibWl0JywgJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0dmFyIGZvcm0gPSAkKCB0aGlzICk7XG5cdFx0dmFyIHN1Ym1pdHRpbmdCdXR0b24gPSBmb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicgKSB8fCAnJztcblxuXHRcdC8vIGlmIHRoZXJlIGlzIG5vIHN1Ym1pdHRpbmcgYnV0dG9uLCBwYXNzIGl0IGJ5IEFqYXhcblx0XHRpZiAoICcnID09PSBzdWJtaXR0aW5nQnV0dG9uIHx8ICdTYXZlIENoYW5nZXMnICE9PSBzdWJtaXR0aW5nQnV0dG9uICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGFqYXhGb3JtRGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7IC8vYWRkIG91ciBvd24gYWpheCBjaGVjayBhcyBYLVJlcXVlc3RlZC1XaXRoIGlzIG5vdCBhbHdheXMgcmVsaWFibGVcblx0XHRcdGFqYXhGb3JtRGF0YSA9IGFqYXhGb3JtRGF0YSArICcmcmVzdD10cnVlJztcblx0XHRcdCQuYWpheCgge1xuXHRcdFx0XHR1cmw6IGZ1bGxVcmwsXG5cdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oIHhociApIHtcblx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Lm5vbmNlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhGb3JtRGF0YVxuXHRcdFx0fSApLmRvbmUoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRuZXdFbWFpbHMgPSAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHR9ICkuZ2V0KCk7XG5cdFx0XHRcdCQuZWFjaCggbmV3RW1haWxzLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICkge1xuXHRcdFx0XHRcdG5leHRFbWFpbENvdW50ID0gbmV4dEVtYWlsQ291bnQgKyBpbmRleDtcblx0XHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmFwcGVuZCggJzxsaSBpZD1cInVzZXItZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPicgKyB2YWx1ZSArICc8dWwgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXVzZXItZW1haWwtYWN0aW9uc1wiPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1tYWtlLXByaW1hcnktZW1haWxcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW1hcnlfZW1haWxcIiBpZD1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+TWFrZSBQcmltYXJ5PC9zbWFsbD48L2xhYmVsPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLWVtYWlsLXByZWZlcmVuY2VzXCI+PGEgaHJlZj1cIi9uZXdzbGV0dGVycy8/ZW1haWw9JyArIGVuY29kZVVSSUNvbXBvbmVudCggdmFsdWUgKSArICdcIj48c21hbGw+RW1haWwgUHJlZmVyZW5jZXM8L3NtYWxsPjwvYT48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggJCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoKSArICcsJyArIHZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0JCggJy5tLWZvcm0tY2hhbmdlLWVtYWlsIC5hLWlucHV0LXdpdGgtYnV0dG9uJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRpZiAoIDAgPT09ICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdGlmICggJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApICE9PSAkKCAnaW5wdXRbbmFtZT1cImVtYWlsXCJdJyApICkge1xuXG5cdFx0XHRcdFx0XHQvLyBpdCB3b3VsZCBiZSBuaWNlIHRvIG9ubHkgbG9hZCB0aGUgZm9ybSwgYnV0IHRoZW4gY2xpY2sgZXZlbnRzIHN0aWxsIGRvbid0IHdvcmtcblx0XHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblx0fSApO1xufVxuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIDAgPCAkKCAnLm0tZm9ybS1lbWFpbCcgKS5sZW5ndGggKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cbn0gKTtcbiIsIi8vIGJhc2VkIG9uIHdoaWNoIGJ1dHRvbiB3YXMgY2xpY2tlZCwgc2V0IHRoZSB2YWx1ZXMgZm9yIHRoZSBhbmFseXRpY3MgZXZlbnQgYW5kIGNyZWF0ZSBpdFxuZnVuY3Rpb24gdHJhY2tTaG93Q29tbWVudHMoIGFsd2F5cywgaWQsIGNsaWNrVmFsdWUgKSB7XG5cdHZhciBhY3Rpb24gICAgICAgICAgPSAnJztcblx0dmFyIGNhdGVnb3J5UHJlZml4ID0gJyc7XG5cdHZhciBjYXRlZ29yeVN1ZmZpeCA9ICcnO1xuXHR2YXIgcG9zaXRpb24gICAgICAgID0gJyc7XG5cdHBvc2l0aW9uID0gaWQucmVwbGFjZSggJ2Fsd2F5cy1zaG93LWNvbW1lbnRzLScsICcnICk7XG5cdGlmICggJzEnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPbic7XG5cdH0gZWxzZSBpZiAoICcwJyA9PT0gY2xpY2tWYWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5UHJlZml4ID0gJ0Fsd2F5cyAnO1xuXHR9XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24uY2hhckF0KCAwICkudG9VcHBlckNhc2UoKSArIHBvc2l0aW9uLnNsaWNlKCAxICk7XG5cdFx0Y2F0ZWdvcnlTdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnlQcmVmaXggKyAnU2hvdyBDb21tZW50cycgKyBjYXRlZ29yeVN1ZmZpeCwgYWN0aW9uLCBsb2NhdGlvbi5wYXRobmFtZSApO1xufVxuXG4vLyB3aGVuIHNob3dpbmcgY29tbWVudHMgb25jZSwgdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtYnV0dG9uLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dHJhY2tTaG93Q29tbWVudHMoIGZhbHNlLCAnJywgJycgKTtcbn0gKTtcblxuLy8gU2V0IHVzZXIgbWV0YSB2YWx1ZSBmb3IgYWx3YXlzIHNob3dpbmcgY29tbWVudHMgaWYgdGhhdCBidXR0b24gaXMgY2xpY2tlZFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHZhciB0aGF0ID0gJCggdGhpcyApO1xuXHRpZiAoIHRoYXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gZWxzZSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuXHR0cmFja1Nob3dDb21tZW50cyggdHJ1ZSwgdGhhdC5hdHRyKCAnaWQnICksIHRoYXQudmFsKCkgKTtcblxuXHQvLyB3ZSBhbHJlYWR5IGhhdmUgYWpheHVybCBmcm9tIHRoZSB0aGVtZVxuXHQkLmFqYXgoIHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBhamF4dXJsLFxuXHRcdGRhdGE6IHtcblx0XHRcdCdhY3Rpb24nOiAnbWlubnBvc3RfbGFyZ29fbG9hZF9jb21tZW50c19zZXRfdXNlcl9tZXRhJyxcblx0XHRcdCd2YWx1ZSc6IHRoYXQudmFsKClcblx0XHR9LFxuXHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdCQoICcuYS1hbHdheXMtc2hvdy1jb21tZW50cy1yZXN1bHQnLCB0aGF0LnBhcmVudCgpICkuaHRtbCggcmVzcG9uc2UuZGF0YS5tZXNzYWdlICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IHJlc3BvbnNlLmRhdGEuc2hvdyApIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufSApO1xuIiwidmFyIHRhcmdldCAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1ldmVudHMtY2FsLWxpbmtzJyApO1xuaWYgKCBudWxsICE9PSB0YXJnZXQgKSB7XG4gICAgdmFyIGxpICAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdsaScgKTtcbiAgICBsaS5pbm5lckhUTUwgID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLWNhbGVuZGFyXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG4gICAgdmFyIGZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBsaS5zZXRBdHRyaWJ1dGUoICdjbGFzcycsICdhLWNsb3NlLWhvbGRlcicgKTtcbiAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggbGkgKTtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG59XG5cbmNvbnN0IGNhbGVuZGFyVHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcbiAgICBlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmEtZXZlbnRzLWNhbC1saW5rcycgKSxcbiAgICB2aXNpYmxlQ2xhc3M6ICdhLWV2ZW50cy1jYWwtbGluay12aXNpYmxlJyxcbiAgICBkaXNwbGF5VmFsdWU6ICdibG9jaydcbn0gKTtcblxudmFyIGNhbGVuZGFyVmlzaWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcubS1ldmVudC1kYXRldGltZSBhJyApO1xuaWYgKCBudWxsICE9PSBjYWxlbmRhclZpc2libGUgKSB7XG4gICAgY2FsZW5kYXJWaXNpYmxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gY2FsZW5kYXJWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG4gICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICBpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICB2YXIgY2FsZW5kYXJDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1jYWxlbmRhcicgKTtcbiAgICBjYWxlbmRhckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gY2FsZW5kYXJWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG4gICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICBpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICAgIH1cbiAgICB9ICk7XG59XG4iXX0=
}(jQuery));
