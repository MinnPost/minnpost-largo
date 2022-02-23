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

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

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

(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }

        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }

      return n[i].exports;
    }

    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
      o(t[i]);
    }

    return o;
  }

  return r;
})()({
  1: [function (require, module, exports) {
    "use strict";

    var _validForm = require("./src/valid-form");

    var _validForm2 = _interopRequireDefault(_validForm);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    window.ValidForm = _validForm2.default;
    window.ValidForm.toggleInvalidClass = _validForm.toggleInvalidClass;
    window.ValidForm.handleCustomMessages = _validForm.handleCustomMessages;
    window.ValidForm.handleCustomMessageDisplay = _validForm.handleCustomMessageDisplay;
  }, {
    "./src/valid-form": 3
  }],
  2: [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.clone = clone;
    exports.defaults = defaults;
    exports.insertAfter = insertAfter;
    exports.insertBefore = insertBefore;
    exports.forEach = forEach;
    exports.debounce = debounce;

    function clone(obj) {
      var copy = {};

      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }

      return copy;
    }

    function defaults(obj, defaultObject) {
      obj = clone(obj || {});

      for (var k in defaultObject) {
        if (obj[k] === undefined) obj[k] = defaultObject[k];
      }

      return obj;
    }

    function insertAfter(refNode, nodeToInsert) {
      var sibling = refNode.nextSibling;

      if (sibling) {
        var _parent = refNode.parentNode;

        _parent.insertBefore(nodeToInsert, sibling);
      } else {
        parent.appendChild(nodeToInsert);
      }
    }

    function insertBefore(refNode, nodeToInsert) {
      var parent = refNode.parentNode;
      parent.insertBefore(nodeToInsert, refNode);
    }

    function forEach(items, fn) {
      if (!items) return;

      if (items.forEach) {
        items.forEach(fn);
      } else {
        for (var i = 0; i < items.length; i++) {
          fn(items[i], i, items);
        }
      }
    }

    function debounce(ms, fn) {
      var timeout = void 0;

      var debouncedFn = function debouncedFn() {
        clearTimeout(timeout);
        timeout = setTimeout(fn, ms);
      };

      return debouncedFn;
    }
  }, {}],
  3: [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.toggleInvalidClass = toggleInvalidClass;
    exports.handleCustomMessages = handleCustomMessages;
    exports.handleCustomMessageDisplay = handleCustomMessageDisplay;
    exports.default = validForm;

    var _util = require("./util");

    function toggleInvalidClass(input, invalidClass) {
      input.addEventListener("invalid", function () {
        input.classList.add(invalidClass);
      });
      input.addEventListener("input", function () {
        if (input.validity.valid) {
          input.classList.remove(invalidClass);
        }
      });
    }

    var errorProps = ["badInput", "patternMismatch", "rangeOverflow", "rangeUnderflow", "stepMismatch", "tooLong", "tooShort", "typeMismatch", "valueMissing", "customError"];

    function getCustomMessage(input, customMessages) {
      customMessages = customMessages || {};
      var localErrorProps = [input.type + "Mismatch"].concat(errorProps);
      var validity = input.validity;

      for (var i = 0; i < localErrorProps.length; i++) {
        var prop = localErrorProps[i];

        if (validity[prop]) {
          return input.getAttribute("data-" + prop) || customMessages[prop];
        }
      }
    }

    function handleCustomMessages(input, customMessages) {
      function checkValidity() {
        var message = input.validity.valid ? null : getCustomMessage(input, customMessages);
        input.setCustomValidity(message || "");
      }

      input.addEventListener("input", checkValidity);
      input.addEventListener("invalid", checkValidity);
    }

    function handleCustomMessageDisplay(input, options) {
      var validationErrorClass = options.validationErrorClass,
          validationErrorParentClass = options.validationErrorParentClass,
          errorPlacement = options.errorPlacement;

      function checkValidity(options) {
        var insertError = options.insertError;
        var parentNode = input.parentNode;
        var errorNode = parentNode.querySelector("." + validationErrorClass) || document.createElement("div");

        if (!input.validity.valid && input.validationMessage) {
          errorNode.className = validationErrorClass;
          errorNode.textContent = input.validationMessage;

          if (insertError) {
            errorPlacement === "before" ? (0, _util.insertBefore)(input, errorNode) : (0, _util.insertAfter)(input, errorNode);
            parentNode.classList.add(validationErrorParentClass);
          }
        } else {
          parentNode.classList.remove(validationErrorParentClass);
          errorNode.remove();
        }
      }

      input.addEventListener("input", function () {
        checkValidity({
          insertError: false
        });
      });
      input.addEventListener("invalid", function (e) {
        e.preventDefault();
        checkValidity({
          insertError: true
        });
      });
    }

    var defaultOptions = {
      invalidClass: "invalid",
      validationErrorClass: "validation-error",
      validationErrorParentClass: "has-validation-error",
      customMessages: {},
      errorPlacement: "before"
    };

    function validForm(element, options) {
      if (!element || !element.nodeName) {
        throw new Error("First arg to validForm must be a form, input, select, or textarea");
      }

      var inputs = void 0;
      var type = element.nodeName.toLowerCase();
      options = (0, _util.defaults)(options, defaultOptions);

      if (type === "form") {
        inputs = element.querySelectorAll("input, select, textarea");
        focusInvalidInput(element, inputs);
      } else if (type === "input" || type === "select" || type === "textarea") {
        inputs = [element];
      } else {
        throw new Error("Only form, input, select, or textarea elements are supported");
      }

      validFormInputs(inputs, options);
    }

    function focusInvalidInput(form, inputs) {
      var focusFirst = (0, _util.debounce)(100, function () {
        var invalidNode = form.querySelector(":invalid");
        if (invalidNode) invalidNode.focus();
      });
      (0, _util.forEach)(inputs, function (input) {
        return input.addEventListener("invalid", focusFirst);
      });
    }

    function validFormInputs(inputs, options) {
      var invalidClass = options.invalidClass,
          customMessages = options.customMessages;
      (0, _util.forEach)(inputs, function (input) {
        toggleInvalidClass(input, invalidClass);
        handleCustomMessages(input, customMessages);
        handleCustomMessageDisplay(input, options);
      });
    }
  }, {
    "./util": 2
  }]
}, {}, [1]);
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

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

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
    element: document.querySelector('.your-account ul'),
    visibleClass: 'is-open',
    displayValue: 'flex'
  });
  var userNavToggle = document.querySelector('.your-account > a');

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
$('a', $('.todayonminnpost')).click(function () {
  mpAnalyticsTrackingEvent('event', 'Glean Link: Today on MinnPost', 'Click', location.pathname);
});
$('a', $('.m-related')).click(function () {
  mpAnalyticsTrackingEvent('event', 'Related Section Link', 'Click', location.pathname);
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
var forms = document.querySelectorAll('.m-form');
forms.forEach(function (form) {
  ValidForm(form, {
    validationErrorParentClass: 'm-has-validation-error',
    validationErrorClass: 'a-validation-error',
    invalidClass: 'a-error',
    errorPlacement: 'after'
  });
});
var form = $('.m-form'); // listen for `invalid` events on all form inputs

form.find(':input').on('invalid', function () {
  var input = $(this); // the first invalid element in the form

  var first = form.find('.a-error').first(); // the form item that contains it

  var first_holder = first.parent(); // only handle if this is the first invalid input

  if (input[0] === first[0]) {
    // height of the nav bar plus some padding if there's a fixed nav
    //var navbarHeight = navbar.height() + 50
    // the position to scroll to (accounting for the navbar if it exists)
    var elementOffset = first_holder.offset().top; // the current scroll position (accounting for the navbar)

    var pageOffset = window.pageYOffset; // don't scroll if the element is already in view

    if (elementOffset > pageOffset && elementOffset < pageOffset + window.innerHeight) {
      return true;
    } // note: avoid using animate, as it prevents the validation message displaying correctly


    $('html, body').scrollTop(elementOffset);
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
      action: 'llc_load_comments',
      post: $('#llc_post_id').val()
    }; // Ajax request link.

    var llcajaxurl = $('#llc_ajax_url').val(); // Full url to get comments (Adding parameters).

    var commentUrl = llcajaxurl + '?' + $.param(data); // Perform ajax request.

    $.get(commentUrl, function (response) {
      if ('' !== response) {
        $('#llc_comments').html(response); // Initialize comments after lazy loading.

        if (window.addComment && window.addComment.init) {
          window.addComment.init();
        } // Get the comment li id from url if exist.


        var commentId = document.URL.substr(document.URL.indexOf('#comment')); // If comment id found, scroll to that comment.

        if (-1 < commentId.indexOf('#comment')) {
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
var targets = document.querySelectorAll('.a-events-cal-links');
targets.forEach(function (target) {
  setCalendar(target);
});

function setCalendar(target) {
  if (null !== target) {
    var li = document.createElement('li');
    li.innerHTML = '<a href="#" class="a-close-button a-close-calendar"><i class="fas fa-times"></i></a>';
    var fragment = document.createDocumentFragment();
    li.setAttribute('class', 'a-close-holder');
    fragment.appendChild(li);
    target.appendChild(fragment);
  }
}

var calendarsVisible = document.querySelectorAll('.m-event-datetime a');
calendarsVisible.forEach(function (calendarVisible) {
  showCalendar(calendarVisible);
});

function showCalendar(calendarVisible) {
  var dateHolder = calendarVisible.closest('.m-event-date-and-calendar');
  var calendarTransitioner = transitionHiddenElement({
    element: dateHolder.querySelector('.a-events-cal-links'),
    visibleClass: 'a-events-cal-link-visible',
    displayValue: 'block'
  });

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
    var calendarClose = dateHolder.querySelector('.a-close-calendar');
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
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDQtdmFsaWQtZm9ybS5taW4uanMiLCIwMC1zdGFydC5qcyIsIjAxLWFuYWx5dGljcy5qcyIsIjAyLXNoYXJlLmpzIiwiMDMtbmF2aWdhdGlvbi5qcyIsIjA0LWZvcm1zLmpzIiwiMDUtY29tbWVudHMuanMiLCIwNi1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImMiLCJyZXF1aXJlIiwidSIsImNvZGUiLCJwIiwiY2FsbCIsIl92YWxpZEZvcm0iLCJfdmFsaWRGb3JtMiIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIlZhbGlkRm9ybSIsInRvZ2dsZUludmFsaWRDbGFzcyIsImhhbmRsZUN1c3RvbU1lc3NhZ2VzIiwiaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiY2xvbmUiLCJkZWZhdWx0cyIsImluc2VydEFmdGVyIiwiaW5zZXJ0QmVmb3JlIiwiZm9yRWFjaCIsImRlYm91bmNlIiwiY29weSIsImF0dHIiLCJoYXNPd25Qcm9wZXJ0eSIsImRlZmF1bHRPYmplY3QiLCJrIiwicmVmTm9kZSIsIm5vZGVUb0luc2VydCIsInNpYmxpbmciLCJuZXh0U2libGluZyIsIl9wYXJlbnQiLCJwYXJlbnQiLCJpdGVtcyIsImZuIiwibXMiLCJkZWJvdW5jZWRGbiIsInZhbGlkRm9ybSIsIl91dGlsIiwiaW5wdXQiLCJpbnZhbGlkQ2xhc3MiLCJ2YWxpZGl0eSIsInZhbGlkIiwiZXJyb3JQcm9wcyIsImdldEN1c3RvbU1lc3NhZ2UiLCJjdXN0b21NZXNzYWdlcyIsImxvY2FsRXJyb3JQcm9wcyIsInR5cGUiLCJjb25jYXQiLCJwcm9wIiwiY2hlY2tWYWxpZGl0eSIsIm1lc3NhZ2UiLCJzZXRDdXN0b21WYWxpZGl0eSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uRXJyb3JDbGFzcyIsInZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzIiwiZXJyb3JQbGFjZW1lbnQiLCJpbnNlcnRFcnJvciIsImVycm9yTm9kZSIsInZhbGlkYXRpb25NZXNzYWdlIiwidGV4dENvbnRlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImRlZmF1bHRPcHRpb25zIiwibm9kZU5hbWUiLCJpbnB1dHMiLCJ0b0xvd2VyQ2FzZSIsImZvY3VzSW52YWxpZElucHV0IiwidmFsaWRGb3JtSW5wdXRzIiwiZm9ybSIsImZvY3VzRmlyc3QiLCJpbnZhbGlkTm9kZSIsImZvY3VzIiwiZG9jdW1lbnRFbGVtZW50IiwibXBBbmFseXRpY3NUcmFja2luZ0V2ZW50IiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsImdhIiwiZXZlbnQiLCJtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEiLCJ1cmxfYWNjZXNzX2xldmVsIiwibG9jYXRpb24iLCJwYXRobmFtZSIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJjb3B5Q3VycmVudFVSTCIsImR1bW15IiwiaHJlZiIsImJvZHkiLCJzZWxlY3QiLCJleGVjQ29tbWFuZCIsIiQiLCJjbGljayIsImRhdGEiLCJwcmludCIsInVybCIsIm9wZW4iLCJzZXR1cFByaW1hcnlOYXYiLCJwcmltYXJ5TmF2VHJhbnNpdGlvbmVyIiwicHJpbWFyeU5hdlRvZ2dsZSIsImV4cGFuZGVkIiwidXNlck5hdlRyYW5zaXRpb25lciIsInVzZXJOYXZUb2dnbGUiLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCJrZXl1cCIsImtleUNvZGUiLCJwcmltYXJ5TmF2RXhwYW5kZWQiLCJ1c2VyTmF2RXhwYW5kZWQiLCJzZWFyY2hJc1Zpc2libGUiLCJzZXR1cFNjcm9sbE5hdiIsInVhIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiaXNJRSIsInRlc3QiLCJwcmlvcml0eU5hdlNjcm9sbGVyRGVmYXVsdCIsIndpZGdldFRpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJ6b25lVGl0bGUiLCJzaWRlYmFyU2VjdGlvblRpdGxlIiwidGV4dE5vZGVzIiwiY29udGVudHMiLCJmaWx0ZXIiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJub2RlVmFsdWUiLCJ0cmltIiwiZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCIsIm1hcmt1cCIsIm1hbmFnZUVtYWlscyIsInJlc3RSb290IiwidXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdCIsInNpdGVfdXJsIiwicmVzdF9uYW1lc3BhY2UiLCJmdWxsVXJsIiwiY29uZmlybUNoYW5nZSIsIm5leHRFbWFpbENvdW50IiwibmV3UHJpbWFyeUVtYWlsIiwib2xkUHJpbWFyeUVtYWlsIiwicHJpbWFyeUlkIiwiZW1haWxUb1JlbW92ZSIsImNvbnNvbGlkYXRlZEVtYWlscyIsIm5ld0VtYWlscyIsImFqYXhGb3JtRGF0YSIsInRoYXQiLCJvbiIsInZhbCIsInJlcGxhY2UiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJnZXQiLCJwdXNoIiwicGFyZW50cyIsImZhZGVPdXQiLCJqb2luIiwiYmVmb3JlIiwiYnV0dG9uIiwiYnV0dG9uRm9ybSIsInN1Ym1pdHRpbmdCdXR0b24iLCJzZXJpYWxpemUiLCJhamF4IiwiYmVmb3JlU2VuZCIsInhociIsInNldFJlcXVlc3RIZWFkZXIiLCJub25jZSIsImRhdGFUeXBlIiwiZG9uZSIsIm1hcCIsImluZGV4IiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicmVsb2FkIiwiYWRkQXV0b1Jlc2l6ZSIsImJveFNpemluZyIsIm9mZnNldCIsImNsaWVudEhlaWdodCIsImhlaWdodCIsInNjcm9sbEhlaWdodCIsImFqYXhTdG9wIiwiY29tbWVudEFyZWEiLCJhdXRvUmVzaXplVGV4dGFyZWEiLCJmb3JtcyIsImZpcnN0X2hvbGRlciIsImVsZW1lbnRPZmZzZXQiLCJwYWdlT2Zmc2V0IiwicGFnZVlPZmZzZXQiLCJzY3JvbGxUb3AiLCJ0cmFja1Nob3dDb21tZW50cyIsImFsd2F5cyIsImlkIiwiY2xpY2tWYWx1ZSIsImNhdGVnb3J5UHJlZml4IiwiY2F0ZWdvcnlTdWZmaXgiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiaXMiLCJwYXJhbXMiLCJhamF4dXJsIiwic3VjY2VzcyIsInJlc3BvbnNlIiwiaHRtbCIsImN1cnJlbnRTY3JpcHQiLCJwb3N0IiwibGxjYWpheHVybCIsImNvbW1lbnRVcmwiLCJwYXJhbSIsImFkZENvbW1lbnQiLCJjb21tZW50SWQiLCJVUkwiLCJzdWJzdHIiLCJpbmRleE9mIiwidGFyZ2V0cyIsInNldENhbGVuZGFyIiwibGkiLCJjYWxlbmRhcnNWaXNpYmxlIiwiY2FsZW5kYXJWaXNpYmxlIiwic2hvd0NhbGVuZGFyIiwiZGF0ZUhvbGRlciIsImNhbGVuZGFyVHJhbnNpdGlvbmVyIiwiY2FsZW5kYXJDbG9zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxLQUFULENBQWVDLENBQWYsRUFBaUI7QUFBQ0MsRUFBQUEsUUFBUSxDQUFDQyxnQkFBVCxDQUEwQixXQUExQixFQUFzQyxVQUFTQyxDQUFULEVBQVc7QUFBQyxRQUFJQyxDQUFDLEdBQUNELENBQUMsQ0FBQ0UsTUFBUjtBQUFBLFFBQWVDLENBQUMsR0FBQ04sQ0FBQyxDQUFDSSxDQUFELENBQWxCO0FBQXNCRSxJQUFBQSxDQUFDLEtBQUdBLENBQUMsR0FBQyxDQUFDRixDQUFDLEdBQUNBLENBQUMsQ0FBQ0csYUFBTCxLQUFxQlAsQ0FBQyxDQUFDSSxDQUFELENBQTNCLENBQUQsRUFBaUNFLENBQUMsSUFBRVAsS0FBSyxDQUFDUyxJQUFOLENBQVdK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QW9CLENBQUNyVCxjQUFyQjtBQUNIO0FBQ0osS0FURDtBQVdBLFFBQUlzVCxhQUFhLEdBQUdGLFVBQVUsQ0FBQzlSLGFBQVgsQ0FBMEIsbUJBQTFCLENBQXBCO0FBQ0FnUyxJQUFBQSxhQUFhLENBQUNuWCxnQkFBZCxDQUFnQyxPQUFoQyxFQUF5QyxVQUFVQyxDQUFWLEVBQWM7QUFDbkRBLE1BQUFBLENBQUMsQ0FBQ21NLGNBQUY7QUFDQSxVQUFJNEMsUUFBUSxHQUFHLFdBQVcrSCxlQUFlLENBQUNwVixZQUFoQixDQUE4QixlQUE5QixDQUFYLElBQThELEtBQTdFO0FBQ0FvVixNQUFBQSxlQUFlLENBQUMxVSxZQUFoQixDQUE4QixlQUE5QixFQUErQyxDQUFFMk0sUUFBakQ7O0FBQ0EsVUFBSyxTQUFTQSxRQUFkLEVBQXlCO0FBQ3JCa0ksUUFBQUEsb0JBQW9CLENBQUNoVCxjQUFyQjtBQUNILE9BRkQsTUFFTztBQUNIZ1QsUUFBQUEsb0JBQW9CLENBQUNyVCxjQUFyQjtBQUNIO0FBQ0osS0FURDtBQVVIO0FBQ0oiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB0bGl0ZSh0KXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZSl7dmFyIGk9ZS50YXJnZXQsbj10KGkpO258fChuPShpPWkucGFyZW50RWxlbWVudCkmJnQoaSkpLG4mJnRsaXRlLnNob3coaSxuLCEwKX0pfXRsaXRlLnNob3c9ZnVuY3Rpb24odCxlLGkpe3ZhciBuPVwiZGF0YS10bGl0ZVwiO2U9ZXx8e30sKHQudG9vbHRpcHx8ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiBvKCl7dGxpdGUuaGlkZSh0LCEwKX1mdW5jdGlvbiBsKCl7cnx8KHI9ZnVuY3Rpb24odCxlLGkpe2Z1bmN0aW9uIG4oKXtvLmNsYXNzTmFtZT1cInRsaXRlIHRsaXRlLVwiK3Irczt2YXIgZT10Lm9mZnNldFRvcCxpPXQub2Zmc2V0TGVmdDtvLm9mZnNldFBhcmVudD09PXQmJihlPWk9MCk7dmFyIG49dC5vZmZzZXRXaWR0aCxsPXQub2Zmc2V0SGVpZ2h0LGQ9by5vZmZzZXRIZWlnaHQsZj1vLm9mZnNldFdpZHRoLGE9aStuLzI7by5zdHlsZS50b3A9KFwic1wiPT09cj9lLWQtMTA6XCJuXCI9PT1yP2UrbCsxMDplK2wvMi1kLzIpK1wicHhcIixvLnN0eWxlLmxlZnQ9KFwid1wiPT09cz9pOlwiZVwiPT09cz9pK24tZjpcIndcIj09PXI/aStuKzEwOlwiZVwiPT09cj9pLWYtMTA6YS1mLzIpK1wicHhcIn12YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxsPWkuZ3Jhdnx8dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRsaXRlXCIpfHxcIm5cIjtvLmlubmVySFRNTD1lLHQuYXBwZW5kQ2hpbGQobyk7dmFyIHI9bFswXXx8XCJcIixzPWxbMV18fFwiXCI7bigpO3ZhciBkPW8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuXCJzXCI9PT1yJiZkLnRvcDwwPyhyPVwiblwiLG4oKSk6XCJuXCI9PT1yJiZkLmJvdHRvbT53aW5kb3cuaW5uZXJIZWlnaHQ/KHI9XCJzXCIsbigpKTpcImVcIj09PXImJmQubGVmdDwwPyhyPVwid1wiLG4oKSk6XCJ3XCI9PT1yJiZkLnJpZ2h0PndpbmRvdy5pbm5lcldpZHRoJiYocj1cImVcIixuKCkpLG8uY2xhc3NOYW1lKz1cIiB0bGl0ZS12aXNpYmxlXCIsb30odCxkLGUpKX12YXIgcixzLGQ7cmV0dXJuIHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLG8pLHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIixvKSx0LnRvb2x0aXA9e3Nob3c6ZnVuY3Rpb24oKXtkPXQudGl0bGV8fHQuZ2V0QXR0cmlidXRlKG4pfHxkLHQudGl0bGU9XCJcIix0LnNldEF0dHJpYnV0ZShuLFwiXCIpLGQmJiFzJiYocz1zZXRUaW1lb3V0KGwsaT8xNTA6MSkpfSxoaWRlOmZ1bmN0aW9uKHQpe2lmKGk9PT10KXtzPWNsZWFyVGltZW91dChzKTt2YXIgZT1yJiZyLnBhcmVudE5vZGU7ZSYmZS5yZW1vdmVDaGlsZChyKSxyPXZvaWQgMH19fX0odCxlKSkuc2hvdygpfSx0bGl0ZS5oaWRlPWZ1bmN0aW9uKHQsZSl7dC50b29sdGlwJiZ0LnRvb2x0aXAuaGlkZShlKX0sXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz10bGl0ZSk7IiwiLyoqIFxuICogTGlicmFyeSBjb2RlXG4gKiBVc2luZyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9AY2xvdWRmb3VyL3RyYW5zaXRpb24taGlkZGVuLWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCh7XG4gIGVsZW1lbnQsXG4gIHZpc2libGVDbGFzcyxcbiAgd2FpdE1vZGUgPSAndHJhbnNpdGlvbmVuZCcsXG4gIHRpbWVvdXREdXJhdGlvbixcbiAgaGlkZU1vZGUgPSAnaGlkZGVuJyxcbiAgZGlzcGxheVZhbHVlID0gJ2Jsb2NrJ1xufSkge1xuICBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0JyAmJiB0eXBlb2YgdGltZW91dER1cmF0aW9uICE9PSAnbnVtYmVyJykge1xuICAgIGNvbnNvbGUuZXJyb3IoYFxuICAgICAgV2hlbiBjYWxsaW5nIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50IHdpdGggd2FpdE1vZGUgc2V0IHRvIHRpbWVvdXQsXG4gICAgICB5b3UgbXVzdCBwYXNzIGluIGEgbnVtYmVyIGZvciB0aW1lb3V0RHVyYXRpb24uXG4gICAgYCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEb24ndCB3YWl0IGZvciBleGl0IHRyYW5zaXRpb25zIGlmIGEgdXNlciBwcmVmZXJzIHJlZHVjZWQgbW90aW9uLlxuICAvLyBJZGVhbGx5IHRyYW5zaXRpb25zIHdpbGwgYmUgZGlzYWJsZWQgaW4gQ1NTLCB3aGljaCBtZWFucyB3ZSBzaG91bGQgbm90IHdhaXRcbiAgLy8gYmVmb3JlIGFkZGluZyBgaGlkZGVuYC5cbiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKScpLm1hdGNoZXMpIHtcbiAgICB3YWl0TW9kZSA9ICdpbW1lZGlhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGxpc3RlbmVyIHRvIGFkZCBgaGlkZGVuYCBhZnRlciBvdXIgYW5pbWF0aW9ucyBjb21wbGV0ZS5cbiAgICogVGhpcyBsaXN0ZW5lciB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgY29tcGxldGluZy5cbiAgICovXG4gIGNvbnN0IGxpc3RlbmVyID0gZSA9PiB7XG4gICAgLy8gQ29uZmlybSBgdHJhbnNpdGlvbmVuZGAgd2FzIGNhbGxlZCBvbiAgb3VyIGBlbGVtZW50YCBhbmQgZGlkbid0IGJ1YmJsZVxuICAgIC8vIHVwIGZyb20gYSBjaGlsZCBlbGVtZW50LlxuICAgIGlmIChlLnRhcmdldCA9PT0gZWxlbWVudCkge1xuICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheVZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvblNob3coKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgbGlzdGVuZXIgc2hvdWxkbid0IGJlIGhlcmUgYnV0IGlmIHNvbWVvbmUgc3BhbXMgdGhlIHRvZ2dsZVxuICAgICAgICogb3ZlciBhbmQgb3ZlciByZWFsbHkgZmFzdCBpdCBjYW4gaW5jb3JyZWN0bHkgc3RpY2sgYXJvdW5kLlxuICAgICAgICogV2UgcmVtb3ZlIGl0IGp1c3QgdG8gYmUgc2FmZS5cbiAgICAgICAqL1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFNpbWlsYXJseSwgd2UnbGwgY2xlYXIgdGhlIHRpbWVvdXQgaW4gY2FzZSBpdCdzIHN0aWxsIGhhbmdpbmcgYXJvdW5kLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIC8qKlxuICAgICAgICogRm9yY2UgYSBicm93c2VyIHJlLXBhaW50IHNvIHRoZSBicm93c2VyIHdpbGwgcmVhbGl6ZSB0aGVcbiAgICAgICAqIGVsZW1lbnQgaXMgbm8gbG9uZ2VyIGBoaWRkZW5gIGFuZCBhbGxvdyB0cmFuc2l0aW9ucy5cbiAgICAgICAqL1xuICAgICAgY29uc3QgcmVmbG93ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIaWRlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvbkhpZGUoKSB7XG4gICAgICBpZiAod2FpdE1vZGUgPT09ICd0cmFuc2l0aW9uZW5kJykge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgICB9IGVsc2UgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICAgIH0sIHRpbWVvdXREdXJhdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoaXMgY2xhc3MgdG8gdHJpZ2dlciBvdXIgYW5pbWF0aW9uXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSBlbGVtZW50J3MgdmlzaWJpbGl0eVxuICAgICAqL1xuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUZWxsIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaGlkZGVuIG9yIG5vdC5cbiAgICAgKi9cbiAgICBpc0hpZGRlbigpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGhpZGRlbiBhdHRyaWJ1dGUgZG9lcyBub3QgcmVxdWlyZSBhIHZhbHVlLiBTaW5jZSBhbiBlbXB0eSBzdHJpbmcgaXNcbiAgICAgICAqIGZhbHN5LCBidXQgc2hvd3MgdGhlIHByZXNlbmNlIG9mIGFuIGF0dHJpYnV0ZSB3ZSBjb21wYXJlIHRvIGBudWxsYFxuICAgICAgICovXG4gICAgICBjb25zdCBoYXNIaWRkZW5BdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaGlkZGVuJykgIT09IG51bGw7XG5cbiAgICAgIGNvbnN0IGlzRGlzcGxheU5vbmUgPSBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJztcblxuICAgICAgY29uc3QgaGFzVmlzaWJsZUNsYXNzID0gWy4uLmVsZW1lbnQuY2xhc3NMaXN0XS5pbmNsdWRlcyh2aXNpYmxlQ2xhc3MpO1xuXG4gICAgICByZXR1cm4gaGFzSGlkZGVuQXR0cmlidXRlIHx8IGlzRGlzcGxheU5vbmUgfHwgIWhhc1Zpc2libGVDbGFzcztcbiAgICB9LFxuXG4gICAgLy8gQSBwbGFjZWhvbGRlciBmb3Igb3VyIGB0aW1lb3V0YFxuICAgIHRpbWVvdXQ6IG51bGxcbiAgfTtcbn0iLCIvKipcbiAgUHJpb3JpdHkrIGhvcml6b250YWwgc2Nyb2xsaW5nIG1lbnUuXG5cbiAgQHBhcmFtIHtPYmplY3R9IG9iamVjdCAtIENvbnRhaW5lciBmb3IgYWxsIG9wdGlvbnMuXG4gICAgQHBhcmFtIHtzdHJpbmcgfHwgRE9NIG5vZGV9IHNlbGVjdG9yIC0gRWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gbmF2U2VsZWN0b3IgLSBOYXYgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gY29udGVudFNlbGVjdG9yIC0gQ29udGVudCBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBpdGVtU2VsZWN0b3IgLSBJdGVtcyBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uTGVmdFNlbGVjdG9yIC0gTGVmdCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvblJpZ2h0U2VsZWN0b3IgLSBSaWdodCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtpbnRlZ2VyIHx8IHN0cmluZ30gc2Nyb2xsU3RlcCAtIEFtb3VudCB0byBzY3JvbGwgb24gYnV0dG9uIGNsaWNrLiAnYXZlcmFnZScgZ2V0cyB0aGUgYXZlcmFnZSBsaW5rIHdpZHRoLlxuKi9cblxuY29uc3QgUHJpb3JpdHlOYXZTY3JvbGxlciA9IGZ1bmN0aW9uKHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlcicsXG4gICAgbmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItbmF2JyxcbiAgICBjb250ZW50U2VsZWN0b3I6IGNvbnRlbnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWNvbnRlbnQnLFxuICAgIGl0ZW1TZWxlY3RvcjogaXRlbVNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItaXRlbScsXG4gICAgYnV0dG9uTGVmdFNlbGVjdG9yOiBidXR0b25MZWZ0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuICAgIGJ1dHRvblJpZ2h0U2VsZWN0b3I6IGJ1dHRvblJpZ2h0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0JyxcbiAgICBzY3JvbGxTdGVwOiBzY3JvbGxTdGVwID0gODBcbiAgfSA9IHt9KSB7XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXIgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiBzZWxlY3RvcjtcblxuICBjb25zdCB2YWxpZGF0ZVNjcm9sbFN0ZXAgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIoc2Nyb2xsU3RlcCkgfHwgc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnO1xuICB9XG5cbiAgaWYgKG5hdlNjcm9sbGVyID09PSB1bmRlZmluZWQgfHwgbmF2U2Nyb2xsZXIgPT09IG51bGwgfHwgIXZhbGlkYXRlU2Nyb2xsU3RlcCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGVyZSBpcyBzb21ldGhpbmcgd3JvbmcsIGNoZWNrIHlvdXIgb3B0aW9ucy4nKTtcbiAgfVxuXG4gIGNvbnN0IG5hdlNjcm9sbGVyTmF2ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihuYXZTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoY29udGVudFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMgPSBuYXZTY3JvbGxlckNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChpdGVtU2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckxlZnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvbkxlZnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyUmlnaHQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvblJpZ2h0U2VsZWN0b3IpO1xuXG4gIGxldCBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZUxlZnQgPSAwO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSAwO1xuICBsZXQgc2Nyb2xsaW5nRGlyZWN0aW9uID0gJyc7XG4gIGxldCBzY3JvbGxPdmVyZmxvdyA9ICcnO1xuICBsZXQgdGltZW91dDtcblxuXG4gIC8vIFNldHMgb3ZlcmZsb3cgYW5kIHRvZ2dsZSBidXR0b25zIGFjY29yZGluZ2x5XG4gIGNvbnN0IHNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgc2Nyb2xsT3ZlcmZsb3cgPSBnZXRPdmVyZmxvdygpO1xuICAgIHRvZ2dsZUJ1dHRvbnMoc2Nyb2xsT3ZlcmZsb3cpO1xuICAgIGNhbGN1bGF0ZVNjcm9sbFN0ZXAoKTtcbiAgfVxuXG5cbiAgLy8gRGVib3VuY2Ugc2V0dGluZyB0aGUgb3ZlcmZsb3cgd2l0aCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgY29uc3QgcmVxdWVzdFNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVvdXQpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aW1lb3V0KTtcblxuICAgIHRpbWVvdXQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHNldE92ZXJmbG93KCk7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8vIEdldHMgdGhlIG92ZXJmbG93IGF2YWlsYWJsZSBvbiB0aGUgbmF2IHNjcm9sbGVyXG4gIGNvbnN0IGdldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNjcm9sbFdpZHRoID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGg7XG4gICAgbGV0IHNjcm9sbFZpZXdwb3J0ID0gbmF2U2Nyb2xsZXJOYXYuY2xpZW50V2lkdGg7XG4gICAgbGV0IHNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0O1xuXG4gICAgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSBzY3JvbGxXaWR0aCAtIChzY3JvbGxWaWV3cG9ydCArIHNjcm9sbExlZnQpO1xuXG4gICAgLy8gMSBpbnN0ZWFkIG9mIDAgdG8gY29tcGVuc2F0ZSBmb3IgbnVtYmVyIHJvdW5kaW5nXG4gICAgbGV0IHNjcm9sbExlZnRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVMZWZ0ID4gMTtcbiAgICBsZXQgc2Nyb2xsUmlnaHRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVSaWdodCA+IDE7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhzY3JvbGxXaWR0aCwgc2Nyb2xsVmlld3BvcnQsIHNjcm9sbEF2YWlsYWJsZUxlZnQsIHNjcm9sbEF2YWlsYWJsZVJpZ2h0KTtcblxuICAgIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uICYmIHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2JvdGgnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2xlZnQnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuICdub25lJztcbiAgICB9XG5cbiAgfVxuXG5cbiAgLy8gQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHN0ZXAgYmFzZWQgb24gdGhlIHdpZHRoIG9mIHRoZSBzY3JvbGxlciBhbmQgdGhlIG51bWJlciBvZiBsaW5rc1xuICBjb25zdCBjYWxjdWxhdGVTY3JvbGxTdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJykge1xuICAgICAgbGV0IHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGggLSAocGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctbGVmdCcpKSArIHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpKTtcblxuICAgICAgbGV0IHNjcm9sbFN0ZXBBdmVyYWdlID0gTWF0aC5mbG9vcihzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyAvIG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zLmxlbmd0aCk7XG5cbiAgICAgIHNjcm9sbFN0ZXAgPSBzY3JvbGxTdGVwQXZlcmFnZTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIE1vdmUgdGhlIHNjcm9sbGVyIHdpdGggYSB0cmFuc2Zvcm1cbiAgY29uc3QgbW92ZVNjcm9sbGVyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG5cbiAgICBpZiAoc2Nyb2xsaW5nID09PSB0cnVlIHx8IChzY3JvbGxPdmVyZmxvdyAhPT0gZGlyZWN0aW9uICYmIHNjcm9sbE92ZXJmbG93ICE9PSAnYm90aCcpKSByZXR1cm47XG5cbiAgICBsZXQgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxTdGVwO1xuICAgIGxldCBzY3JvbGxBdmFpbGFibGUgPSBkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IHNjcm9sbEF2YWlsYWJsZUxlZnQgOiBzY3JvbGxBdmFpbGFibGVSaWdodDtcblxuICAgIC8vIElmIHRoZXJlIHdpbGwgYmUgbGVzcyB0aGFuIDI1JSBvZiB0aGUgbGFzdCBzdGVwIHZpc2libGUgdGhlbiBzY3JvbGwgdG8gdGhlIGVuZFxuICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCAoc2Nyb2xsU3RlcCAqIDEuNzUpKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbEF2YWlsYWJsZTtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSAqPSAtMTtcblxuICAgICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IHNjcm9sbFN0ZXApIHtcbiAgICAgICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NuYXAtYWxpZ24tZW5kJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIHNjcm9sbERpc3RhbmNlICsgJ3B4KSc7XG5cbiAgICBzY3JvbGxpbmdEaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgc2Nyb2xsaW5nID0gdHJ1ZTtcbiAgfVxuXG5cbiAgLy8gU2V0IHRoZSBzY3JvbGxlciBwb3NpdGlvbiBhbmQgcmVtb3ZlcyB0cmFuc2Zvcm0sIGNhbGxlZCBhZnRlciBtb3ZlU2Nyb2xsZXIoKSBpbiB0aGUgdHJhbnNpdGlvbmVuZCBldmVudFxuICBjb25zdCBzZXRTY3JvbGxlclBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50LCBudWxsKTtcbiAgICB2YXIgdHJhbnNmb3JtID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJyk7XG4gICAgdmFyIHRyYW5zZm9ybVZhbHVlID0gTWF0aC5hYnMocGFyc2VJbnQodHJhbnNmb3JtLnNwbGl0KCcsJylbNF0pIHx8IDApO1xuXG4gICAgaWYgKHNjcm9sbGluZ0RpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICB0cmFuc2Zvcm1WYWx1ZSAqPSAtMTtcbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbiAgICBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCArIHRyYW5zZm9ybVZhbHVlO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJywgJ3NuYXAtYWxpZ24tZW5kJyk7XG5cbiAgICBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgfVxuXG5cbiAgLy8gVG9nZ2xlIGJ1dHRvbnMgZGVwZW5kaW5nIG9uIG92ZXJmbG93XG4gIGNvbnN0IHRvZ2dsZUJ1dHRvbnMgPSBmdW5jdGlvbihvdmVyZmxvdykge1xuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAnbGVmdCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdyaWdodCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH1cblxuXG4gIGNvbnN0IGluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgIHNldE92ZXJmbG93KCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlck5hdi5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgc2V0U2Nyb2xsZXJQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJMZWZ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdsZWZ0Jyk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlclJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdyaWdodCcpO1xuICAgIH0pO1xuXG4gIH07XG5cblxuICAvLyBTZWxmIGluaXRcbiAgaW5pdCgpO1xuXG5cbiAgLy8gUmV2ZWFsIEFQSVxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcblxufTtcblxuLy9leHBvcnQgZGVmYXVsdCBQcmlvcml0eU5hdlNjcm9sbGVyO1xuIiwiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIF92YWxpZEZvcm09cmVxdWlyZShcIi4vc3JjL3ZhbGlkLWZvcm1cIik7dmFyIF92YWxpZEZvcm0yPV9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3ZhbGlkRm9ybSk7ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmope3JldHVybiBvYmomJm9iai5fX2VzTW9kdWxlP29iajp7ZGVmYXVsdDpvYmp9fXdpbmRvdy5WYWxpZEZvcm09X3ZhbGlkRm9ybTIuZGVmYXVsdDt3aW5kb3cuVmFsaWRGb3JtLnRvZ2dsZUludmFsaWRDbGFzcz1fdmFsaWRGb3JtLnRvZ2dsZUludmFsaWRDbGFzczt3aW5kb3cuVmFsaWRGb3JtLmhhbmRsZUN1c3RvbU1lc3NhZ2VzPV92YWxpZEZvcm0uaGFuZGxlQ3VzdG9tTWVzc2FnZXM7d2luZG93LlZhbGlkRm9ybS5oYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheT1fdmFsaWRGb3JtLmhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5fSx7XCIuL3NyYy92YWxpZC1mb3JtXCI6M31dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTp0cnVlfSk7ZXhwb3J0cy5jbG9uZT1jbG9uZTtleHBvcnRzLmRlZmF1bHRzPWRlZmF1bHRzO2V4cG9ydHMuaW5zZXJ0QWZ0ZXI9aW5zZXJ0QWZ0ZXI7ZXhwb3J0cy5pbnNlcnRCZWZvcmU9aW5zZXJ0QmVmb3JlO2V4cG9ydHMuZm9yRWFjaD1mb3JFYWNoO2V4cG9ydHMuZGVib3VuY2U9ZGVib3VuY2U7ZnVuY3Rpb24gY2xvbmUob2JqKXt2YXIgY29weT17fTtmb3IodmFyIGF0dHIgaW4gb2JqKXtpZihvYmouaGFzT3duUHJvcGVydHkoYXR0cikpY29weVthdHRyXT1vYmpbYXR0cl19cmV0dXJuIGNvcHl9ZnVuY3Rpb24gZGVmYXVsdHMob2JqLGRlZmF1bHRPYmplY3Qpe29iaj1jbG9uZShvYmp8fHt9KTtmb3IodmFyIGsgaW4gZGVmYXVsdE9iamVjdCl7aWYob2JqW2tdPT09dW5kZWZpbmVkKW9ialtrXT1kZWZhdWx0T2JqZWN0W2tdfXJldHVybiBvYmp9ZnVuY3Rpb24gaW5zZXJ0QWZ0ZXIocmVmTm9kZSxub2RlVG9JbnNlcnQpe3ZhciBzaWJsaW5nPXJlZk5vZGUubmV4dFNpYmxpbmc7aWYoc2libGluZyl7dmFyIF9wYXJlbnQ9cmVmTm9kZS5wYXJlbnROb2RlO19wYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGVUb0luc2VydCxzaWJsaW5nKX1lbHNle3BhcmVudC5hcHBlbmRDaGlsZChub2RlVG9JbnNlcnQpfX1mdW5jdGlvbiBpbnNlcnRCZWZvcmUocmVmTm9kZSxub2RlVG9JbnNlcnQpe3ZhciBwYXJlbnQ9cmVmTm9kZS5wYXJlbnROb2RlO3BhcmVudC5pbnNlcnRCZWZvcmUobm9kZVRvSW5zZXJ0LHJlZk5vZGUpfWZ1bmN0aW9uIGZvckVhY2goaXRlbXMsZm4pe2lmKCFpdGVtcylyZXR1cm47aWYoaXRlbXMuZm9yRWFjaCl7aXRlbXMuZm9yRWFjaChmbil9ZWxzZXtmb3IodmFyIGk9MDtpPGl0ZW1zLmxlbmd0aDtpKyspe2ZuKGl0ZW1zW2ldLGksaXRlbXMpfX19ZnVuY3Rpb24gZGVib3VuY2UobXMsZm4pe3ZhciB0aW1lb3V0PXZvaWQgMDt2YXIgZGVib3VuY2VkRm49ZnVuY3Rpb24gZGVib3VuY2VkRm4oKXtjbGVhclRpbWVvdXQodGltZW91dCk7dGltZW91dD1zZXRUaW1lb3V0KGZuLG1zKX07cmV0dXJuIGRlYm91bmNlZEZufX0se31dLDM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTp0cnVlfSk7ZXhwb3J0cy50b2dnbGVJbnZhbGlkQ2xhc3M9dG9nZ2xlSW52YWxpZENsYXNzO2V4cG9ydHMuaGFuZGxlQ3VzdG9tTWVzc2FnZXM9aGFuZGxlQ3VzdG9tTWVzc2FnZXM7ZXhwb3J0cy5oYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheT1oYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheTtleHBvcnRzLmRlZmF1bHQ9dmFsaWRGb3JtO3ZhciBfdXRpbD1yZXF1aXJlKFwiLi91dGlsXCIpO2Z1bmN0aW9uIHRvZ2dsZUludmFsaWRDbGFzcyhpbnB1dCxpbnZhbGlkQ2xhc3Mpe2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnZhbGlkXCIsZnVuY3Rpb24oKXtpbnB1dC5jbGFzc0xpc3QuYWRkKGludmFsaWRDbGFzcyl9KTtpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixmdW5jdGlvbigpe2lmKGlucHV0LnZhbGlkaXR5LnZhbGlkKXtpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKGludmFsaWRDbGFzcyl9fSl9dmFyIGVycm9yUHJvcHM9W1wiYmFkSW5wdXRcIixcInBhdHRlcm5NaXNtYXRjaFwiLFwicmFuZ2VPdmVyZmxvd1wiLFwicmFuZ2VVbmRlcmZsb3dcIixcInN0ZXBNaXNtYXRjaFwiLFwidG9vTG9uZ1wiLFwidG9vU2hvcnRcIixcInR5cGVNaXNtYXRjaFwiLFwidmFsdWVNaXNzaW5nXCIsXCJjdXN0b21FcnJvclwiXTtmdW5jdGlvbiBnZXRDdXN0b21NZXNzYWdlKGlucHV0LGN1c3RvbU1lc3NhZ2VzKXtjdXN0b21NZXNzYWdlcz1jdXN0b21NZXNzYWdlc3x8e307dmFyIGxvY2FsRXJyb3JQcm9wcz1baW5wdXQudHlwZStcIk1pc21hdGNoXCJdLmNvbmNhdChlcnJvclByb3BzKTt2YXIgdmFsaWRpdHk9aW5wdXQudmFsaWRpdHk7Zm9yKHZhciBpPTA7aTxsb2NhbEVycm9yUHJvcHMubGVuZ3RoO2krKyl7dmFyIHByb3A9bG9jYWxFcnJvclByb3BzW2ldO2lmKHZhbGlkaXR5W3Byb3BdKXtyZXR1cm4gaW5wdXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1cIitwcm9wKXx8Y3VzdG9tTWVzc2FnZXNbcHJvcF19fX1mdW5jdGlvbiBoYW5kbGVDdXN0b21NZXNzYWdlcyhpbnB1dCxjdXN0b21NZXNzYWdlcyl7ZnVuY3Rpb24gY2hlY2tWYWxpZGl0eSgpe3ZhciBtZXNzYWdlPWlucHV0LnZhbGlkaXR5LnZhbGlkP251bGw6Z2V0Q3VzdG9tTWVzc2FnZShpbnB1dCxjdXN0b21NZXNzYWdlcyk7aW5wdXQuc2V0Q3VzdG9tVmFsaWRpdHkobWVzc2FnZXx8XCJcIil9aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsY2hlY2tWYWxpZGl0eSk7aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImludmFsaWRcIixjaGVja1ZhbGlkaXR5KX1mdW5jdGlvbiBoYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheShpbnB1dCxvcHRpb25zKXt2YXIgdmFsaWRhdGlvbkVycm9yQ2xhc3M9b3B0aW9ucy52YWxpZGF0aW9uRXJyb3JDbGFzcyx2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzcz1vcHRpb25zLnZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzLGVycm9yUGxhY2VtZW50PW9wdGlvbnMuZXJyb3JQbGFjZW1lbnQ7ZnVuY3Rpb24gY2hlY2tWYWxpZGl0eShvcHRpb25zKXt2YXIgaW5zZXJ0RXJyb3I9b3B0aW9ucy5pbnNlcnRFcnJvcjt2YXIgcGFyZW50Tm9kZT1pbnB1dC5wYXJlbnROb2RlO3ZhciBlcnJvck5vZGU9cGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKFwiLlwiK3ZhbGlkYXRpb25FcnJvckNsYXNzKXx8ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtpZighaW5wdXQudmFsaWRpdHkudmFsaWQmJmlucHV0LnZhbGlkYXRpb25NZXNzYWdlKXtlcnJvck5vZGUuY2xhc3NOYW1lPXZhbGlkYXRpb25FcnJvckNsYXNzO2Vycm9yTm9kZS50ZXh0Q29udGVudD1pbnB1dC52YWxpZGF0aW9uTWVzc2FnZTtpZihpbnNlcnRFcnJvcil7ZXJyb3JQbGFjZW1lbnQ9PT1cImJlZm9yZVwiPygwLF91dGlsLmluc2VydEJlZm9yZSkoaW5wdXQsZXJyb3JOb2RlKTooMCxfdXRpbC5pbnNlcnRBZnRlcikoaW5wdXQsZXJyb3JOb2RlKTtwYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQodmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3MpfX1lbHNle3BhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSh2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzcyk7ZXJyb3JOb2RlLnJlbW92ZSgpfX1pbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixmdW5jdGlvbigpe2NoZWNrVmFsaWRpdHkoe2luc2VydEVycm9yOmZhbHNlfSl9KTtpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW52YWxpZFwiLGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKTtjaGVja1ZhbGlkaXR5KHtpbnNlcnRFcnJvcjp0cnVlfSl9KX12YXIgZGVmYXVsdE9wdGlvbnM9e2ludmFsaWRDbGFzczpcImludmFsaWRcIix2YWxpZGF0aW9uRXJyb3JDbGFzczpcInZhbGlkYXRpb24tZXJyb3JcIix2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzczpcImhhcy12YWxpZGF0aW9uLWVycm9yXCIsY3VzdG9tTWVzc2FnZXM6e30sZXJyb3JQbGFjZW1lbnQ6XCJiZWZvcmVcIn07ZnVuY3Rpb24gdmFsaWRGb3JtKGVsZW1lbnQsb3B0aW9ucyl7aWYoIWVsZW1lbnR8fCFlbGVtZW50Lm5vZGVOYW1lKXt0aHJvdyBuZXcgRXJyb3IoXCJGaXJzdCBhcmcgdG8gdmFsaWRGb3JtIG11c3QgYmUgYSBmb3JtLCBpbnB1dCwgc2VsZWN0LCBvciB0ZXh0YXJlYVwiKX12YXIgaW5wdXRzPXZvaWQgMDt2YXIgdHlwZT1lbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7b3B0aW9ucz0oMCxfdXRpbC5kZWZhdWx0cykob3B0aW9ucyxkZWZhdWx0T3B0aW9ucyk7aWYodHlwZT09PVwiZm9ybVwiKXtpbnB1dHM9ZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWFcIik7Zm9jdXNJbnZhbGlkSW5wdXQoZWxlbWVudCxpbnB1dHMpfWVsc2UgaWYodHlwZT09PVwiaW5wdXRcInx8dHlwZT09PVwic2VsZWN0XCJ8fHR5cGU9PT1cInRleHRhcmVhXCIpe2lucHV0cz1bZWxlbWVudF19ZWxzZXt0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IGZvcm0sIGlucHV0LCBzZWxlY3QsIG9yIHRleHRhcmVhIGVsZW1lbnRzIGFyZSBzdXBwb3J0ZWRcIil9dmFsaWRGb3JtSW5wdXRzKGlucHV0cyxvcHRpb25zKX1mdW5jdGlvbiBmb2N1c0ludmFsaWRJbnB1dChmb3JtLGlucHV0cyl7dmFyIGZvY3VzRmlyc3Q9KDAsX3V0aWwuZGVib3VuY2UpKDEwMCxmdW5jdGlvbigpe3ZhciBpbnZhbGlkTm9kZT1mb3JtLnF1ZXJ5U2VsZWN0b3IoXCI6aW52YWxpZFwiKTtpZihpbnZhbGlkTm9kZSlpbnZhbGlkTm9kZS5mb2N1cygpfSk7KDAsX3V0aWwuZm9yRWFjaCkoaW5wdXRzLGZ1bmN0aW9uKGlucHV0KXtyZXR1cm4gaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImludmFsaWRcIixmb2N1c0ZpcnN0KX0pfWZ1bmN0aW9uIHZhbGlkRm9ybUlucHV0cyhpbnB1dHMsb3B0aW9ucyl7dmFyIGludmFsaWRDbGFzcz1vcHRpb25zLmludmFsaWRDbGFzcyxjdXN0b21NZXNzYWdlcz1vcHRpb25zLmN1c3RvbU1lc3NhZ2VzOygwLF91dGlsLmZvckVhY2gpKGlucHV0cyxmdW5jdGlvbihpbnB1dCl7dG9nZ2xlSW52YWxpZENsYXNzKGlucHV0LGludmFsaWRDbGFzcyk7aGFuZGxlQ3VzdG9tTWVzc2FnZXMoaW5wdXQsY3VzdG9tTWVzc2FnZXMpO2hhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5KGlucHV0LG9wdGlvbnMpfSl9fSx7XCIuL3V0aWxcIjoyfV19LHt9LFsxXSk7IiwiLyoqXG4gKiBEbyB0aGVzZSB0aGluZ3MgYXMgcXVpY2tseSBhcyBwb3NzaWJsZTsgd2UgbWlnaHQgaGF2ZSBDU1Mgb3IgZWFybHkgc2NyaXB0cyB0aGF0IHJlcXVpcmUgb24gaXRcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ25vLWpzJyApO1xuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdqcycgKTtcbiIsIi8qKlxuICogVGhpcyBpcyB1c2VkIHRvIGNhdXNlIEdvb2dsZSBBbmFseXRpY3MgZXZlbnRzIHRvIHJ1blxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuZnVuY3Rpb24gbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgdmFsdWUgKSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdH1cblx0XHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3Igc2hhcmluZyBjb250ZW50XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8vIHRyYWNrIGEgc2hhcmUgdmlhIGFuYWx5dGljcyBldmVudFxuZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gPSAnJyApIHtcblxuXHQvLyBpZiBhIG5vdCBsb2dnZWQgaW4gdXNlciB0cmllcyB0byBlbWFpbCwgZG9uJ3QgY291bnQgdGhhdCBhcyBhIHNoYXJlXG5cdGlmICggISBqUXVlcnkoICdib2R5JyApLmhhc0NsYXNzKCAnbG9nZ2VkLWluJyApICYmICdFbWFpbCcgPT09IHRleHQgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGNhdGVnb3J5ID0gJ1NoYXJlJztcblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0Y2F0ZWdvcnkgPSAnU2hhcmUgLSAnICsgcG9zaXRpb247XG5cdH1cblxuXHQvLyB0cmFjayBhcyBhbiBldmVudCwgYW5kIGFzIHNvY2lhbCBpZiBpdCBpcyB0d2l0dGVyIG9yIGZiXG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnksIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgfHwgJ1R3aXR0ZXInID09PSB0ZXh0ICkge1xuXHRcdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0ICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuLy8gY29weSB0aGUgY3VycmVudCBVUkwgdG8gdGhlIHVzZXIncyBjbGlwYm9hcmRcbmZ1bmN0aW9uIGNvcHlDdXJyZW50VVJMKCkge1xuXHR2YXIgZHVtbXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW5wdXQnICksXG5cdFx0dGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkdW1teSApO1xuXHRkdW1teS52YWx1ZSA9IHRleHQ7XG5cdGR1bW15LnNlbGVjdCgpO1xuXHRkb2N1bWVudC5leGVjQ29tbWFuZCggJ2NvcHknICk7XG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoIGR1bW15ICk7XG59XG5cbi8vIHRvcCBzaGFyZSBidXR0b24gY2xpY2tcbiQoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLmRhdGEoICdzaGFyZS1hY3Rpb24nICk7XG5cdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSApO1xuXG4vLyB3aGVuIHRoZSBwcmludCBidXR0b24gaXMgY2xpY2tlZFxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXByaW50IGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHdpbmRvdy5wcmludCgpO1xufSApO1xuXG4vLyB3aGVuIHRoZSByZXB1Ymxpc2ggYnV0dG9uIGlzIGNsaWNrZWRcbi8vIHRoZSBwbHVnaW4gY29udHJvbHMgdGhlIHJlc3QsIGJ1dCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGUgZGVmYXVsdCBldmVudCBkb2Vzbid0IGZpcmVcbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1yZXB1Ymxpc2ggYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcbn0gKTtcblxuLy8gd2hlbiB0aGUgY29weSBsaW5rIGJ1dHRvbiBpcyBjbGlja2VkXG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtY29weS11cmwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGNvcHlDdXJyZW50VVJMKCk7XG5cdHRsaXRlLnNob3coICggZS50YXJnZXQgKSwgeyBncmF2OiAndycgfSApO1xuXHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHR0bGl0ZS5oaWRlKCAoIGUudGFyZ2V0ICkgKTtcblx0fSwgMzAwMCApO1xuXHRyZXR1cm4gZmFsc2U7XG59ICk7XG5cbi8vIHdoZW4gc2hhcmluZyB2aWEgZmFjZWJvb2ssIHR3aXR0ZXIsIG9yIGVtYWlsLCBvcGVuIHRoZSBkZXN0aW5hdGlvbiB1cmwgaW4gYSBuZXcgd2luZG93XG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZmFjZWJvb2sgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtdHdpdHRlciBhLCAubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1lbWFpbCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHR2YXIgdXJsID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXHR3aW5kb3cub3BlbiggdXJsLCAnX2JsYW5rJyApO1xufSApO1xuIiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogTmF2aWdhdGlvbiBzY3JpcHRzLiBJbmNsdWRlcyBtb2JpbGUgb3IgdG9nZ2xlIGJlaGF2aW9yLCBhbmFseXRpY3MgdHJhY2tpbmcgb2Ygc3BlY2lmaWMgbWVudXMuXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqL1xuXG5mdW5jdGlvbiBzZXR1cFByaW1hcnlOYXYoKSB7XG5cdGNvbnN0IHByaW1hcnlOYXZUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcubS1tZW51LXByaW1hcnktbGlua3MnICksXG5cdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0ZGlzcGxheVZhbHVlOiAnZmxleCdcblx0fSApO1xuXG5cdHZhciBwcmltYXJ5TmF2VG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ25hdiBidXR0b24nICk7XG5cdGlmICggbnVsbCAhPT0gcHJpbWFyeU5hdlRvZ2dsZSApIHtcblx0XHRwcmltYXJ5TmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0Y29uc3QgdXNlck5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy55b3VyLWFjY291bnQgdWwnICksXG5cdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0ZGlzcGxheVZhbHVlOiAnZmxleCdcblx0fSApO1xuXG5cdHZhciB1c2VyTmF2VG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy55b3VyLWFjY291bnQgPiBhJyApO1xuXHRpZiAoIG51bGwgIT09IHVzZXJOYXZUb2dnbGUgKSB7XG5cdFx0dXNlck5hdlRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHZhciB0YXJnZXQgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IC5tLWZvcm0tc2VhcmNoIGZpZWxkc2V0IC5hLWJ1dHRvbi1zZW50ZW5jZScgKTtcblx0aWYgKCBudWxsICE9PSB0YXJnZXQgKSB7XG5cdFx0dmFyIGRpdiAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0ZGl2LmlubmVySFRNTCA9ICc8YSBocmVmPVwiI1wiIGNsYXNzPVwiYS1jbG9zZS1idXR0b24gYS1jbG9zZS1zZWFyY2hcIj48aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT48L2E+Jztcblx0XHR2YXIgZnJhZ21lbnQgID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGRpdi5zZXRBdHRyaWJ1dGUoICdjbGFzcycsICdhLWNsb3NlLWhvbGRlcicgKTtcblx0XHRmcmFnbWVudC5hcHBlbmRDaGlsZCggZGl2ICk7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xuXG5cdFx0Y29uc3Qgc2VhcmNoVHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcubS1tZW51LXByaW1hcnktYWN0aW9ucyAubS1mb3JtLXNlYXJjaCcgKSxcblx0XHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdFx0ZGlzcGxheVZhbHVlOiAnZmxleCdcblx0XHR9ICk7XG5cblx0XHR2YXIgc2VhcmNoVmlzaWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICdsaS5zZWFyY2ggPiBhJyApO1xuXHRcdHNlYXJjaFZpc2libGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0dmFyIHNlYXJjaENsb3NlICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1zZWFyY2gnICk7XG5cdFx0c2VhcmNoQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0Ly8gZXNjYXBlIGtleSBwcmVzc1xuXHQkKCBkb2N1bWVudCApLmtleXVwKCBmdW5jdGlvbiggZSApIHtcblx0XHRpZiAoIDI3ID09PSBlLmtleUNvZGUgKSB7XG5cdFx0XHRsZXQgcHJpbWFyeU5hdkV4cGFuZGVkID0gJ3RydWUnID09PSBwcmltYXJ5TmF2VG9nZ2xlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRsZXQgdXNlck5hdkV4cGFuZGVkID0gJ3RydWUnID09PSB1c2VyTmF2VG9nZ2xlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRsZXQgc2VhcmNoSXNWaXNpYmxlID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHByaW1hcnlOYXZFeHBhbmRlZCAmJiB0cnVlID09PSBwcmltYXJ5TmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgcHJpbWFyeU5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgdXNlck5hdkV4cGFuZGVkICYmIHRydWUgPT09IHVzZXJOYXZFeHBhbmRlZCApIHtcblx0XHRcdFx0dXNlck5hdlRvZ2dsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISB1c2VyTmF2RXhwYW5kZWQgKTtcblx0XHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBzZWFyY2hJc1Zpc2libGUgJiYgdHJ1ZSA9PT0gc2VhcmNoSXNWaXNpYmxlICkge1xuXHRcdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHNlYXJjaElzVmlzaWJsZSApO1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcbn1cblxuZnVuY3Rpb24gc2V0dXBTY3JvbGxOYXYoIHNlbGVjdG9yLCBuYXZTZWxlY3RvciwgY29udGVudFNlbGVjdG9yICkge1xuXG5cdHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuXHR2YXIgaXNJRSA9IC9NU0lFfFRyaWRlbnQvLnRlc3QoIHVhICk7XG5cdGlmICggaXNJRSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBJbml0IHdpdGggYWxsIG9wdGlvbnMgYXQgZGVmYXVsdCBzZXR0aW5nXG5cdGNvbnN0IHByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0ID0gUHJpb3JpdHlOYXZTY3JvbGxlcigge1xuXHRcdHNlbGVjdG9yOiBzZWxlY3Rvcixcblx0XHRuYXZTZWxlY3RvcjogbmF2U2VsZWN0b3IsXG5cdFx0Y29udGVudFNlbGVjdG9yOiBjb250ZW50U2VsZWN0b3IsXG5cdFx0aXRlbVNlbGVjdG9yOiAnbGksIGEnLFxuXHRcdGJ1dHRvbkxlZnRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0Jyxcblx0XHRidXR0b25SaWdodFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0J1xuXG5cdFx0Ly9zY3JvbGxTdGVwOiAnYXZlcmFnZSdcblx0fSApO1xuXG5cdC8vIEluaXQgbXVsdGlwbGUgbmF2IHNjcm9sbGVycyB3aXRoIHRoZSBzYW1lIG9wdGlvbnNcblx0LypsZXQgbmF2U2Nyb2xsZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi1zY3JvbGxlcicpO1xuXG5cdG5hdlNjcm9sbGVycy5mb3JFYWNoKChjdXJyZW50VmFsdWUsIGN1cnJlbnRJbmRleCkgPT4ge1xuXHQgIFByaW9yaXR5TmF2U2Nyb2xsZXIoe1xuXHQgICAgc2VsZWN0b3I6IGN1cnJlbnRWYWx1ZVxuXHQgIH0pO1xuXHR9KTsqL1xufVxuXG5zZXR1cFByaW1hcnlOYXYoKTtcblxuaWYgKCAwIDwgJCggJy5tLXN1Yi1uYXZpZ2F0aW9uJyApLmxlbmd0aCApIHtcblx0c2V0dXBTY3JvbGxOYXYoICcubS1zdWItbmF2aWdhdGlvbicsICcubS1zdWJuYXYtbmF2aWdhdGlvbicsICcubS1tZW51LXN1Yi1uYXZpZ2F0aW9uJyApO1xufVxuaWYgKCAwIDwgJCggJy5tLXBhZ2luYXRpb24tbmF2aWdhdGlvbicgKS5sZW5ndGggKSB7XG5cdHNldHVwU2Nyb2xsTmF2KCAnLm0tcGFnaW5hdGlvbi1uYXZpZ2F0aW9uJywgJy5tLXBhZ2luYXRpb24tY29udGFpbmVyJywgJy5tLXBhZ2luYXRpb24tbGlzdCcgKTtcbn1cblxuJCggJ2EnLCAkKCAnLm8tc2l0ZS1zaWRlYmFyJyApICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHR2YXIgd2lkZ2V0VGl0bGUgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0td2lkZ2V0JyApLmZpbmQoICdoMycgKS50ZXh0KCk7XG5cdHZhciB6b25lVGl0bGUgICAgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS16b25lJyApLmZpbmQoICcuYS16b25lLXRpdGxlJyApLnRleHQoKTtcblx0dmFyIHNpZGViYXJTZWN0aW9uVGl0bGUgPSAnJztcblx0aWYgKCAnJyAhPT0gd2lkZ2V0VGl0bGUgKSB7XG5cdFx0c2lkZWJhclNlY3Rpb25UaXRsZSA9IHdpZGdldFRpdGxlO1xuXHR9IGVsc2UgaWYgKCAnJyAhPT0gem9uZVRpdGxlICkge1xuXHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB6b25lVGl0bGU7XG5cdH1cblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBMaW5rJywgJ0NsaWNrJywgc2lkZWJhclNlY3Rpb25UaXRsZSApO1xufSApO1xuXG4kKCAnYScsICQoICcudG9kYXlvbm1pbm5wb3N0JyApICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsICdHbGVhbiBMaW5rOiBUb2RheSBvbiBNaW5uUG9zdCcsICdDbGljaycsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59ICk7XG5cbiQoICdhJywgJCggJy5tLXJlbGF0ZWQnICkgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1JlbGF0ZWQgU2VjdGlvbiBMaW5rJywgJ0NsaWNrJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgZm9ybXNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxualF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICggdGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgJycgIT09IHRoaXMubm9kZVZhbHVlLnRyaW0oKSApO1xuXHR9ICk7XG59O1xuXG5mdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0cmV0dXJuIG1hcmt1cDtcbn1cblxuZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCggJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nICk7XG5cdHZhciByZXN0Um9vdCAgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0dmFyIGZ1bGxVcmwgICAgICAgICAgICA9IHJlc3RSb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdHZhciBjb25maXJtQ2hhbmdlICAgICAgPSAnJztcblx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdHZhciBuZXdQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIG9sZFByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0dmFyIGNvbnNvbGlkYXRlZEVtYWlscyA9IFtdO1xuXHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdHZhciBhamF4Rm9ybURhdGEgICAgICAgPSAnJztcblx0dmFyIHRoYXQgICAgICAgICAgICAgICA9ICcnO1xuXG5cdC8vIHN0YXJ0IG91dCB3aXRoIG5vIHByaW1hcnkvcmVtb3ZhbHMgY2hlY2tlZFxuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHQvLyBpZiB0aGVyZSBpcyBhIGxpc3Qgb2YgZW1haWxzIChub3QganVzdCBhIHNpbmdsZSBmb3JtIGZpZWxkKVxuXHRpZiAoIDAgPCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cblx0XHQvLyBpZiBhIHVzZXIgc2VsZWN0cyBhIG5ldyBwcmltYXJ5LCBtb3ZlIGl0IGludG8gdGhhdCBwb3NpdGlvblxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oKSB7XG5cblx0XHRcdG5ld1ByaW1hcnlFbWFpbCA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdG9sZFByaW1hcnlFbWFpbCA9ICQoICcjZW1haWwnICkudmFsKCk7XG5cdFx0XHRwcmltYXJ5SWQgICAgICAgPSAkKCB0aGlzICkucHJvcCggJ2lkJyApLnJlcGxhY2UoICdwcmltYXJ5X2VtYWlsXycsICcnICk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncHJpbWFyeS1jaGFuZ2UnICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlclxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblxuXHRcdFx0Ly8kKCB0aGlzICkucGFyZW50KCkuYWZ0ZXIoIGNvbmZpcm1DaGFuZ2UgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSB1c2VyIGZhY2luZyB2YWx1ZXNcblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG5ld1ByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3VzZXItZW1haWwtJyArIHByaW1hcnlJZCApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgbWFpbiBoaWRkZW4gZm9ybSB2YWx1ZVxuXHRcdFx0XHQkKCAnI2VtYWlsJyApLnZhbCggbmV3UHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gc3VibWl0IGZvcm0gdmFsdWVzLlxuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXG5cdFx0XHRcdC8vIHVuY2hlY2sgdGhlIHJhZGlvIGJ1dHRvblxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBmb3JtIHZhbHVlcyB0byB0aGUgb2xkIHByaW1hcnkgZW1haWxcblx0XHRcdFx0JCggJyNwcmltYXJ5X2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3JlbW92ZV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyByZW1vdmUgdGhlIGNvbmZpcm0gbWVzc2FnZVxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHJlbW92ZXMgYW4gZW1haWwsIHRha2UgaXQgYXdheSBmcm9tIHRoZSB2aXN1YWwgYW5kIGZyb20gdGhlIGZvcm1cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2hhbmdlJywgJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgIT09IGVtYWlsVG9SZW1vdmUgKSB7XG5cdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlciBmb3IgcmVtb3ZhbFxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0Ly8gaWYgY29uZmlybWVkLCByZW1vdmUgdGhlIGVtYWlsIGFuZCBzdWJtaXQgdGhlIGZvcm1cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGknICkuZmFkZU91dCggJ25vcm1hbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cblx0XHRcdFx0Ly9jb25zb2xlLmxvZyggJ3ZhbHVlIGlzICcgKyBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnICkuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvbiBhLWJ1dHRvbi1hZGQtdXNlci1lbWFpbFwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRuZXh0RW1haWxDb3VudCsrO1xuXHR9ICk7XG5cblx0JCggJ2lucHV0W3R5cGU9c3VibWl0XScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGJ1dHRvbiA9ICQoIHRoaXMgKTtcblx0XHR2YXIgYnV0dG9uRm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCAnZm9ybScgKTtcblx0XHRidXR0b25Gb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicsIGJ1dHRvbi52YWwoKSApO1xuXHR9ICk7XG5cblx0JCggJy5tLWVudHJ5LWNvbnRlbnQnICkub24oICdzdWJtaXQnLCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgZm9ybSA9ICQoIHRoaXMgKTtcblx0XHR2YXIgc3VibWl0dGluZ0J1dHRvbiA9IGZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJyApIHx8ICcnO1xuXG5cdFx0Ly8gaWYgdGhlcmUgaXMgbm8gc3VibWl0dGluZyBidXR0b24sIHBhc3MgaXQgYnkgQWpheFxuXHRcdGlmICggJycgPT09IHN1Ym1pdHRpbmdCdXR0b24gfHwgJ1NhdmUgQ2hhbmdlcycgIT09IHN1Ym1pdHRpbmdCdXR0b24gKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheEZvcm1EYXRhID0gZm9ybS5zZXJpYWxpemUoKTsgLy9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheEZvcm1EYXRhID0gYWpheEZvcm1EYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogZnVsbFVybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Qubm9uY2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0ZGF0YTogYWpheEZvcm1EYXRhXG5cdFx0XHR9ICkuZG9uZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5ld0VtYWlscyA9ICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKS5tYXAoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdH0gKS5nZXQoKTtcblx0XHRcdFx0JC5lYWNoKCBuZXdFbWFpbHMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSBuZXh0RW1haWxDb3VudCArIGluZGV4O1xuXHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkuYXBwZW5kKCAnPGxpIGlkPVwidXNlci1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtZW1haWwtcHJlZmVyZW5jZXNcIj48YSBocmVmPVwiL25ld3NsZXR0ZXJzLz9lbWFpbD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCB2YWx1ZSApICsgJ1wiPjxzbWFsbD5FbWFpbCBQcmVmZXJlbmNlczwvc21hbGw+PC9hPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLXJlbW92ZS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwicmVtb3ZlX2VtYWlsWycgKyBuZXh0RW1haWxDb3VudCArICddXCIgaWQ9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5SZW1vdmU8L3NtYWxsPjwvbGFiZWw+PC9saT48L3VsPjwvbGk+JyApO1xuXHRcdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCAkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCgpICsgJywnICsgdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggMCA9PT0gJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIGl0IHdvdWxkIGJlIG5pY2UgdG8gb25seSBsb2FkIHRoZSBmb3JtLCBidXQgdGhlbiBjbGljayBldmVudHMgc3RpbGwgZG9uJ3Qgd29ya1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIGFkZEF1dG9SZXNpemUoKSB7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICdbZGF0YS1hdXRvcmVzaXplXScgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRlbGVtZW50LnN0eWxlLmJveFNpemluZyA9ICdib3JkZXItYm94Jztcblx0XHR2YXIgb2Zmc2V0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgLSBlbGVtZW50LmNsaWVudEhlaWdodDtcblx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnRhcmdldC5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG5cdFx0XHRldmVudC50YXJnZXQuc3R5bGUuaGVpZ2h0ID0gZXZlbnQudGFyZ2V0LnNjcm9sbEhlaWdodCArIG9mZnNldCArICdweCc7XG5cdFx0fSApO1xuXHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCAnZGF0YS1hdXRvcmVzaXplJyApO1xuXHR9ICk7XG59XG5cbiQoIGRvY3VtZW50ICkuYWpheFN0b3AoIGZ1bmN0aW9uKCkge1xuXHR2YXIgY29tbWVudEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnI2xsY19jb21tZW50cycgKTtcblx0aWYgKCBudWxsICE9PSBjb21tZW50QXJlYSApIHtcblx0XHRhZGRBdXRvUmVzaXplKCk7XG5cdH1cbn0gKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKCAwIDwgJCggJy5tLWZvcm0tYWNjb3VudC1zZXR0aW5ncycgKS5sZW5ndGggKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cblx0dmFyIGF1dG9SZXNpemVUZXh0YXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICdbZGF0YS1hdXRvcmVzaXplXScgKTtcblx0aWYgKCBudWxsICE9PSBhdXRvUmVzaXplVGV4dGFyZWEgKSB7XG5cdFx0YWRkQXV0b1Jlc2l6ZSgpO1xuXHR9XG59ICk7XG5cbnZhciBmb3JtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1mb3JtJyApO1xuZm9ybXMuZm9yRWFjaCggZnVuY3Rpb24oIGZvcm0gKSB7XG5cdFZhbGlkRm9ybSggZm9ybSwge1xuXHRcdHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzOiAnbS1oYXMtdmFsaWRhdGlvbi1lcnJvcicsXG5cdFx0dmFsaWRhdGlvbkVycm9yQ2xhc3M6ICdhLXZhbGlkYXRpb24tZXJyb3InLFxuXHRcdGludmFsaWRDbGFzczogJ2EtZXJyb3InLFxuXHRcdGVycm9yUGxhY2VtZW50OiAnYWZ0ZXInXG5cdH0gKTtcbn0gKTtcblxudmFyIGZvcm0gPSAkKCAnLm0tZm9ybScgKTtcblxuLy8gbGlzdGVuIGZvciBgaW52YWxpZGAgZXZlbnRzIG9uIGFsbCBmb3JtIGlucHV0c1xuZm9ybS5maW5kKCAnOmlucHV0JyApLm9uKCAnaW52YWxpZCcsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbnB1dCA9ICQoIHRoaXMgKTtcblxuICAgIC8vIHRoZSBmaXJzdCBpbnZhbGlkIGVsZW1lbnQgaW4gdGhlIGZvcm1cblx0dmFyIGZpcnN0ID0gZm9ybS5maW5kKCAnLmEtZXJyb3InICkuZmlyc3QoKTtcblxuXHQvLyB0aGUgZm9ybSBpdGVtIHRoYXQgY29udGFpbnMgaXRcblx0dmFyIGZpcnN0X2hvbGRlciA9IGZpcnN0LnBhcmVudCgpO1xuXG4gICAgLy8gb25seSBoYW5kbGUgaWYgdGhpcyBpcyB0aGUgZmlyc3QgaW52YWxpZCBpbnB1dFxuICAgIGlmICggaW5wdXRbMF0gPT09IGZpcnN0WzBdICkge1xuXG4gICAgICAgIC8vIGhlaWdodCBvZiB0aGUgbmF2IGJhciBwbHVzIHNvbWUgcGFkZGluZyBpZiB0aGVyZSdzIGEgZml4ZWQgbmF2XG4gICAgICAgIC8vdmFyIG5hdmJhckhlaWdodCA9IG5hdmJhci5oZWlnaHQoKSArIDUwXG5cbiAgICAgICAgLy8gdGhlIHBvc2l0aW9uIHRvIHNjcm9sbCB0byAoYWNjb3VudGluZyBmb3IgdGhlIG5hdmJhciBpZiBpdCBleGlzdHMpXG4gICAgICAgIHZhciBlbGVtZW50T2Zmc2V0ID0gZmlyc3RfaG9sZGVyLm9mZnNldCgpLnRvcDtcblxuICAgICAgICAvLyB0aGUgY3VycmVudCBzY3JvbGwgcG9zaXRpb24gKGFjY291bnRpbmcgZm9yIHRoZSBuYXZiYXIpXG4gICAgICAgIHZhciBwYWdlT2Zmc2V0ID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuXG4gICAgICAgIC8vIGRvbid0IHNjcm9sbCBpZiB0aGUgZWxlbWVudCBpcyBhbHJlYWR5IGluIHZpZXdcbiAgICAgICAgaWYgKCBlbGVtZW50T2Zmc2V0ID4gcGFnZU9mZnNldCAmJiBlbGVtZW50T2Zmc2V0IDwgcGFnZU9mZnNldCArIHdpbmRvdy5pbm5lckhlaWdodCApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm90ZTogYXZvaWQgdXNpbmcgYW5pbWF0ZSwgYXMgaXQgcHJldmVudHMgdGhlIHZhbGlkYXRpb24gbWVzc2FnZSBkaXNwbGF5aW5nIGNvcnJlY3RseVxuICAgICAgICAkKCAnaHRtbCwgYm9keScgKS5zY3JvbGxUb3AoIGVsZW1lbnRPZmZzZXQgKTtcbiAgICB9XG59ICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIGNvbW1lbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8vIGJhc2VkIG9uIHdoaWNoIGJ1dHRvbiB3YXMgY2xpY2tlZCwgc2V0IHRoZSB2YWx1ZXMgZm9yIHRoZSBhbmFseXRpY3MgZXZlbnQgYW5kIGNyZWF0ZSBpdFxuZnVuY3Rpb24gdHJhY2tTaG93Q29tbWVudHMoIGFsd2F5cywgaWQsIGNsaWNrVmFsdWUgKSB7XG5cdHZhciBhY3Rpb24gICAgICAgICAgPSAnJztcblx0dmFyIGNhdGVnb3J5UHJlZml4ID0gJyc7XG5cdHZhciBjYXRlZ29yeVN1ZmZpeCA9ICcnO1xuXHR2YXIgcG9zaXRpb24gICAgICAgID0gJyc7XG5cdHBvc2l0aW9uID0gaWQucmVwbGFjZSggJ2Fsd2F5cy1zaG93LWNvbW1lbnRzLScsICcnICk7XG5cdGlmICggJzEnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPbic7XG5cdH0gZWxzZSBpZiAoICcwJyA9PT0gY2xpY2tWYWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5UHJlZml4ID0gJ0Fsd2F5cyAnO1xuXHR9XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24uY2hhckF0KCAwICkudG9VcHBlckNhc2UoKSArIHBvc2l0aW9uLnNsaWNlKCAxICk7XG5cdFx0Y2F0ZWdvcnlTdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnlQcmVmaXggKyAnU2hvdyBDb21tZW50cycgKyBjYXRlZ29yeVN1ZmZpeCwgYWN0aW9uLCBsb2NhdGlvbi5wYXRobmFtZSApO1xufVxuXG4vLyB3aGVuIHNob3dpbmcgY29tbWVudHMgb25jZSwgdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtYnV0dG9uLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dHJhY2tTaG93Q29tbWVudHMoIGZhbHNlLCAnJywgJycgKTtcbn0gKTtcblxuLy8gU2V0IHVzZXIgbWV0YSB2YWx1ZSBmb3IgYWx3YXlzIHNob3dpbmcgY29tbWVudHMgaWYgdGhhdCBidXR0b24gaXMgY2xpY2tlZFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHZhciB0aGF0ID0gJCggdGhpcyApO1xuXHRpZiAoIHRoYXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gZWxzZSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuXHR0cmFja1Nob3dDb21tZW50cyggdHJ1ZSwgdGhhdC5hdHRyKCAnaWQnICksIHRoYXQudmFsKCkgKTtcblxuXHQvLyB3ZSBhbHJlYWR5IGhhdmUgYWpheHVybCBmcm9tIHRoZSB0aGVtZVxuXHQkLmFqYXgoIHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBwYXJhbXMuYWpheHVybCxcblx0XHRkYXRhOiB7XG5cdFx0XHQnYWN0aW9uJzogJ21pbm5wb3N0X2xhcmdvX2xvYWRfY29tbWVudHNfc2V0X3VzZXJfbWV0YScsXG5cdFx0XHQndmFsdWUnOiB0aGF0LnZhbCgpXG5cdFx0fSxcblx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHQkKCAnLmEtYWx3YXlzLXNob3ctY29tbWVudHMtcmVzdWx0JywgdGhhdC5wYXJlbnQoKSApLmh0bWwoIHJlc3BvbnNlLmRhdGEubWVzc2FnZSApO1xuXHRcdFx0aWYgKCB0cnVlID09PSByZXNwb25zZS5kYXRhLnNob3cgKSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDAgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDEgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcbn0gKTtcblxuISAoIGZ1bmN0aW9uKCBkICkge1xuXHRpZiAoICEgZC5jdXJyZW50U2NyaXB0ICkge1xuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0YWN0aW9uOiAnbGxjX2xvYWRfY29tbWVudHMnLFxuXHRcdFx0cG9zdDogJCggJyNsbGNfcG9zdF9pZCcgKS52YWwoKVxuXHRcdH07XG5cblx0XHQvLyBBamF4IHJlcXVlc3QgbGluay5cblx0XHR2YXIgbGxjYWpheHVybCA9ICQoICcjbGxjX2FqYXhfdXJsJyApLnZhbCgpO1xuXG5cdFx0Ly8gRnVsbCB1cmwgdG8gZ2V0IGNvbW1lbnRzIChBZGRpbmcgcGFyYW1ldGVycykuXG5cdFx0dmFyIGNvbW1lbnRVcmwgPSBsbGNhamF4dXJsICsgJz8nICsgJC5wYXJhbSggZGF0YSApO1xuXG5cdFx0Ly8gUGVyZm9ybSBhamF4IHJlcXVlc3QuXG5cdFx0JC5nZXQoIGNvbW1lbnRVcmwsIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdGlmICggJycgIT09IHJlc3BvbnNlICkge1xuXHRcdFx0XHQkKCAnI2xsY19jb21tZW50cycgKS5odG1sKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgY29tbWVudHMgYWZ0ZXIgbGF6eSBsb2FkaW5nLlxuXHRcdFx0XHRpZiAoIHdpbmRvdy5hZGRDb21tZW50ICYmIHdpbmRvdy5hZGRDb21tZW50LmluaXQgKSB7XG5cdFx0XHRcdFx0d2luZG93LmFkZENvbW1lbnQuaW5pdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gR2V0IHRoZSBjb21tZW50IGxpIGlkIGZyb20gdXJsIGlmIGV4aXN0LlxuXHRcdFx0XHR2YXIgY29tbWVudElkID0gZG9jdW1lbnQuVVJMLnN1YnN0ciggZG9jdW1lbnQuVVJMLmluZGV4T2YoICcjY29tbWVudCcgKSApO1xuXG5cdFx0XHRcdC8vIElmIGNvbW1lbnQgaWQgZm91bmQsIHNjcm9sbCB0byB0aGF0IGNvbW1lbnQuXG5cdFx0XHRcdGlmICggLTEgPCBjb21tZW50SWQuaW5kZXhPZiggJyNjb21tZW50JyApICkge1xuXHRcdFx0XHRcdCQoIHdpbmRvdyApLnNjcm9sbFRvcCggJCggY29tbWVudElkICkub2Zmc2V0KCkudG9wICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cbn0oIGRvY3VtZW50ICkgKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgZXZlbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG5jb25zdCB0YXJnZXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5hLWV2ZW50cy1jYWwtbGlua3MnICk7XG50YXJnZXRzLmZvckVhY2goIGZ1bmN0aW9uKCB0YXJnZXQgKSB7XG4gICAgc2V0Q2FsZW5kYXIoIHRhcmdldCApO1xufSk7XG5cbmZ1bmN0aW9uIHNldENhbGVuZGFyKCB0YXJnZXQgKSB7XG4gICAgaWYgKCBudWxsICE9PSB0YXJnZXQgKSB7XG4gICAgICAgIHZhciBsaSAgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnbGknICk7XG4gICAgICAgIGxpLmlubmVySFRNTCAgPSAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImEtY2xvc2UtYnV0dG9uIGEtY2xvc2UtY2FsZW5kYXJcIj48aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT48L2E+JztcbiAgICAgICAgdmFyIGZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgbGkuc2V0QXR0cmlidXRlKCAnY2xhc3MnLCAnYS1jbG9zZS1ob2xkZXInICk7XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBsaSApO1xuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG4gICAgfVxufVxuXG5jb25zdCBjYWxlbmRhcnNWaXNpYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWV2ZW50LWRhdGV0aW1lIGEnICk7XG5jYWxlbmRhcnNWaXNpYmxlLmZvckVhY2goIGZ1bmN0aW9uKCBjYWxlbmRhclZpc2libGUgKSB7XG4gICAgc2hvd0NhbGVuZGFyKCBjYWxlbmRhclZpc2libGUgKTtcbn0pO1xuXG5mdW5jdGlvbiBzaG93Q2FsZW5kYXIoIGNhbGVuZGFyVmlzaWJsZSApIHtcbiAgICBjb25zdCBkYXRlSG9sZGVyID0gY2FsZW5kYXJWaXNpYmxlLmNsb3Nlc3QoICcubS1ldmVudC1kYXRlLWFuZC1jYWxlbmRhcicgKTtcbiAgICBjb25zdCBjYWxlbmRhclRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG4gICAgICAgIGVsZW1lbnQ6IGRhdGVIb2xkZXIucXVlcnlTZWxlY3RvciggJy5hLWV2ZW50cy1jYWwtbGlua3MnICksXG4gICAgICAgIHZpc2libGVDbGFzczogJ2EtZXZlbnRzLWNhbC1saW5rLXZpc2libGUnLFxuICAgICAgICBkaXNwbGF5VmFsdWU6ICdibG9jaydcbiAgICB9ICk7XG5cbiAgICBpZiAoIG51bGwgIT09IGNhbGVuZGFyVmlzaWJsZSApIHtcbiAgICAgICAgY2FsZW5kYXJWaXNpYmxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBjYWxlbmRhclZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcbiAgICAgICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICAgICAgaWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcbiAgICAgICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ICk7XG5cbiAgICAgICAgdmFyIGNhbGVuZGFyQ2xvc2UgPSBkYXRlSG9sZGVyLnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1jYWxlbmRhcicgKTtcbiAgICAgICAgY2FsZW5kYXJDbG9zZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gY2FsZW5kYXJWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG4gICAgICAgICAgICBjYWxlbmRhclZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcbiAgICAgICAgICAgIGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG4gICAgICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApO1xuICAgIH1cbn1cbiJdfQ==
}(jQuery));
