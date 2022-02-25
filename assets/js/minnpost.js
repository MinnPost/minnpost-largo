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
 * This file does not require jQuery.
 *
 */
// track a share via analytics event.
function trackShare(text) {
  var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
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


document.querySelectorAll(".m-entry-share-top a").forEach(function (topButton) {
  return topButton.addEventListener("click", function (e) {
    var text = e.currentTarget.getAttribute('data-share-action');
    var position = 'top';
    trackShare(text, position);
  });
}); // when the print button is clicked

document.querySelectorAll(".m-entry-share .a-share-print a").forEach(function (printButton) {
  return printButton.addEventListener("click", function (e) {
    e.preventDefault();
    window.print();
  });
}); // when the republish button is clicked
// the plugin controls the rest, but we need to make sure the default event doesn't fire

document.querySelectorAll(".m-entry-share .a-share-republish a").forEach(function (republishButton) {
  return republishButton.addEventListener("click", function (e) {
    e.preventDefault();
  });
}); // when the copy link button is clicked

document.querySelectorAll(".m-entry-share .a-share-copy-url a").forEach(function (copyButton) {
  return copyButton.addEventListener("click", function (e) {
    e.preventDefault();
    copyCurrentURL();
    tlite.show(e.target, {
      grav: 'w'
    });
    setTimeout(function () {
      tlite.hide(e.target);
    }, 3000);
  });
}); // when sharing via facebook, twitter, or email, open the destination url in a new window

document.querySelectorAll(".m-entry-share .a-share-facebook a, .m-entry-share .a-share-twitter a, .m-entry-share .a-share-email a").forEach(function (anyShareButton) {
  return anyShareButton.addEventListener("click", function (e) {
    e.preventDefault();
    var url = e.currentTarget.getAttribute('href');
    window.open(url, '_blank');
  });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDQtdmFsaWQtZm9ybS5taW4uanMiLCIwMC1zdGFydC5qcyIsIjAxLWFuYWx5dGljcy5qcyIsIjAyLXNoYXJlLmpzIiwiMDMtbmF2aWdhdGlvbi5qcyIsIjA0LWZvcm1zLmpzIiwiMDUtY29tbWVudHMuanMiLCIwNi1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImMiLCJyZXF1aXJlIiwidSIsImNvZGUiLCJwIiwiY2FsbCIsIl92YWxpZEZvcm0iLCJfdmFsaWRGb3JtMiIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIlZhbGlkRm9ybSIsInRvZ2dsZUludmFsaWRDbGFzcyIsImhhbmRsZUN1c3RvbU1lc3NhZ2VzIiwiaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiY2xvbmUiLCJkZWZhdWx0cyIsImluc2VydEFmdGVyIiwiaW5zZXJ0QmVmb3JlIiwiZm9yRWFjaCIsImRlYm91bmNlIiwiY29weSIsImF0dHIiLCJoYXNPd25Qcm9wZXJ0eSIsImRlZmF1bHRPYmplY3QiLCJrIiwicmVmTm9kZSIsIm5vZGVUb0luc2VydCIsInNpYmxpbmciLCJuZXh0U2libGluZyIsIl9wYXJlbnQiLCJwYXJlbnQiLCJpdGVtcyIsImZuIiwibXMiLCJkZWJvdW5jZWRGbiIsInZhbGlkRm9ybSIsIl91dGlsIiwiaW5wdXQiLCJpbnZhbGlkQ2xhc3MiLCJ2YWxpZGl0eSIsInZhbGlkIiwiZXJyb3JQcm9wcyIsImdldEN1c3RvbU1lc3NhZ2UiLCJjdXN0b21NZXNzYWdlcyIsImxvY2FsRXJyb3JQcm9wcyIsInR5cGUiLCJjb25jYXQiLCJwcm9wIiwiY2hlY2tWYWxpZGl0eSIsIm1lc3NhZ2UiLCJzZXRDdXN0b21WYWxpZGl0eSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uRXJyb3JDbGFzcyIsInZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzIiwiZXJyb3JQbGFjZW1lbnQiLCJpbnNlcnRFcnJvciIsImVycm9yTm9kZSIsInZhbGlkYXRpb25NZXNzYWdlIiwidGV4dENvbnRlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImRlZmF1bHRPcHRpb25zIiwibm9kZU5hbWUiLCJpbnB1dHMiLCJ0b0xvd2VyQ2FzZSIsImZvY3VzSW52YWxpZElucHV0IiwidmFsaWRGb3JtSW5wdXRzIiwiZm9ybSIsImZvY3VzRmlyc3QiLCJpbnZhbGlkTm9kZSIsImZvY3VzIiwiZG9jdW1lbnRFbGVtZW50IiwibXBBbmFseXRpY3NUcmFja2luZ0V2ZW50IiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsImdhIiwiZXZlbnQiLCJtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEiLCJ1cmxfYWNjZXNzX2xldmVsIiwibG9jYXRpb24iLCJwYXRobmFtZSIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwiY29weUN1cnJlbnRVUkwiLCJkdW1teSIsImhyZWYiLCJib2R5Iiwic2VsZWN0IiwiZXhlY0NvbW1hbmQiLCJ0b3BCdXR0b24iLCJjdXJyZW50VGFyZ2V0IiwicHJpbnRCdXR0b24iLCJwcmludCIsInJlcHVibGlzaEJ1dHRvbiIsImNvcHlCdXR0b24iLCJhbnlTaGFyZUJ1dHRvbiIsInVybCIsIm9wZW4iLCJzZXR1cFByaW1hcnlOYXYiLCJwcmltYXJ5TmF2VHJhbnNpdGlvbmVyIiwicHJpbWFyeU5hdlRvZ2dsZSIsImV4cGFuZGVkIiwidXNlck5hdlRyYW5zaXRpb25lciIsInVzZXJOYXZUb2dnbGUiLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCIkIiwia2V5dXAiLCJrZXlDb2RlIiwicHJpbWFyeU5hdkV4cGFuZGVkIiwidXNlck5hdkV4cGFuZGVkIiwic2VhcmNoSXNWaXNpYmxlIiwic2V0dXBTY3JvbGxOYXYiLCJ1YSIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImlzSUUiLCJ0ZXN0IiwicHJpb3JpdHlOYXZTY3JvbGxlckRlZmF1bHQiLCJjbGljayIsIndpZGdldFRpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJ6b25lVGl0bGUiLCJzaWRlYmFyU2VjdGlvblRpdGxlIiwialF1ZXJ5IiwidGV4dE5vZGVzIiwiY29udGVudHMiLCJmaWx0ZXIiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJub2RlVmFsdWUiLCJ0cmltIiwiZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCIsIm1hcmt1cCIsIm1hbmFnZUVtYWlscyIsInJlc3RSb290IiwidXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdCIsInNpdGVfdXJsIiwicmVzdF9uYW1lc3BhY2UiLCJmdWxsVXJsIiwiY29uZmlybUNoYW5nZSIsIm5leHRFbWFpbENvdW50IiwibmV3UHJpbWFyeUVtYWlsIiwib2xkUHJpbWFyeUVtYWlsIiwicHJpbWFyeUlkIiwiZW1haWxUb1JlbW92ZSIsImNvbnNvbGlkYXRlZEVtYWlscyIsIm5ld0VtYWlscyIsImFqYXhGb3JtRGF0YSIsInRoYXQiLCJvbiIsInZhbCIsInJlcGxhY2UiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJnZXQiLCJwdXNoIiwicGFyZW50cyIsImZhZGVPdXQiLCJqb2luIiwiYmVmb3JlIiwiYnV0dG9uIiwiYnV0dG9uRm9ybSIsImRhdGEiLCJzdWJtaXR0aW5nQnV0dG9uIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRvbmUiLCJtYXAiLCJpbmRleCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsImFkZEF1dG9SZXNpemUiLCJib3hTaXppbmciLCJvZmZzZXQiLCJjbGllbnRIZWlnaHQiLCJoZWlnaHQiLCJzY3JvbGxIZWlnaHQiLCJhamF4U3RvcCIsImNvbW1lbnRBcmVhIiwiYXV0b1Jlc2l6ZVRleHRhcmVhIiwiZm9ybXMiLCJmaXJzdF9ob2xkZXIiLCJlbGVtZW50T2Zmc2V0IiwicGFnZU9mZnNldCIsInBhZ2VZT2Zmc2V0Iiwic2Nyb2xsVG9wIiwidHJhY2tTaG93Q29tbWVudHMiLCJhbHdheXMiLCJpZCIsImNsaWNrVmFsdWUiLCJjYXRlZ29yeVByZWZpeCIsImNhdGVnb3J5U3VmZml4IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImlzIiwicGFyYW1zIiwiYWpheHVybCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImh0bWwiLCJjdXJyZW50U2NyaXB0IiwicG9zdCIsImxsY2FqYXh1cmwiLCJjb21tZW50VXJsIiwicGFyYW0iLCJhZGRDb21tZW50IiwiY29tbWVudElkIiwiVVJMIiwic3Vic3RyIiwiaW5kZXhPZiIsInRhcmdldHMiLCJzZXRDYWxlbmRhciIsImxpIiwiY2FsZW5kYXJzVmlzaWJsZSIsImNhbGVuZGFyVmlzaWJsZSIsInNob3dDYWxlbmRhciIsImRhdGVIb2xkZXIiLCJjYWxlbmRhclRyYW5zaXRpb25lciIsImNhbGVuZGFyQ2xvc2UiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsS0FBVCxDQUFlQyxDQUFmLEVBQWlCO0FBQUNDLEVBQUFBLFFBQVEsQ0FBQ0MsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBc0MsVUFBU0MsQ0FBVCxFQUFXO0FBQUMsUUFBSUMsQ0FBQyxHQUFDRCxDQUFDLENBQUNFLE1BQVI7QUFBQSxRQUFlQyxDQUFDLEdBQUNOLENBQUMsQ0FBQ0ksQ0FBRCxDQUFsQjtBQUFzQkUsSUFBQUEsQ0FBQyxLQUFHQSxDQUFDLEdBQUMsQ0FBQ0YsQ0FBQyxHQUFDQSxDQUFDLENBQUNH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b3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB0bGl0ZSh0KXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZSl7dmFyIGk9ZS50YXJnZXQsbj10KGkpO258fChuPShpPWkucGFyZW50RWxlbWVudCkmJnQoaSkpLG4mJnRsaXRlLnNob3coaSxuLCEwKX0pfXRsaXRlLnNob3c9ZnVuY3Rpb24odCxlLGkpe3ZhciBuPVwiZGF0YS10bGl0ZVwiO2U9ZXx8e30sKHQudG9vbHRpcHx8ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiBvKCl7dGxpdGUuaGlkZSh0LCEwKX1mdW5jdGlvbiBsKCl7cnx8KHI9ZnVuY3Rpb24odCxlLGkpe2Z1bmN0aW9uIG4oKXtvLmNsYXNzTmFtZT1cInRsaXRlIHRsaXRlLVwiK3Irczt2YXIgZT10Lm9mZnNldFRvcCxpPXQub2Zmc2V0TGVmdDtvLm9mZnNldFBhcmVudD09PXQmJihlPWk9MCk7dmFyIG49dC5vZmZzZXRXaWR0aCxsPXQub2Zmc2V0SGVpZ2h0LGQ9by5vZmZzZXRIZWlnaHQsZj1vLm9mZnNldFdpZHRoLGE9aStuLzI7by5zdHlsZS50b3A9KFwic1wiPT09cj9lLWQtMTA6XCJuXCI9PT1yP2UrbCsxMDplK2wvMi1kLzIpK1wicHhcIixvLnN0eWxlLmxlZnQ9KFwid1wiPT09cz9pOlwiZVwiPT09cz9pK24tZjpcIndcIj09PXI/aStuKzEwOlwiZVwiPT09cj9pLWYtMTA6YS1mLzIpK1wicHhcIn12YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxsPWkuZ3Jhdnx8dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRsaXRlXCIpfHxcIm5cIjtvLmlubmVySFRNTD1lLHQuYXBwZW5kQ2hpbGQobyk7dmFyIHI9bFswXXx8XCJcIixzPWxbMV18fFwiXCI7bigpO3ZhciBkPW8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuXCJzXCI9PT1yJiZkLnRvcDwwPyhyPVwiblwiLG4oKSk6XCJuXCI9PT1yJiZkLmJvdHRvbT53aW5kb3cuaW5uZXJIZWlnaHQ/KHI9XCJzXCIsbigpKTpcImVcIj09PXImJmQubGVmdDwwPyhyPVwid1wiLG4oKSk6XCJ3XCI9PT1yJiZkLnJpZ2h0PndpbmRvdy5pbm5lcldpZHRoJiYocj1cImVcIixuKCkpLG8uY2xhc3NOYW1lKz1cIiB0bGl0ZS12aXNpYmxlXCIsb30odCxkLGUpKX12YXIgcixzLGQ7cmV0dXJuIHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLG8pLHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIixvKSx0LnRvb2x0aXA9e3Nob3c6ZnVuY3Rpb24oKXtkPXQudGl0bGV8fHQuZ2V0QXR0cmlidXRlKG4pfHxkLHQudGl0bGU9XCJcIix0LnNldEF0dHJpYnV0ZShuLFwiXCIpLGQmJiFzJiYocz1zZXRUaW1lb3V0KGwsaT8xNTA6MSkpfSxoaWRlOmZ1bmN0aW9uKHQpe2lmKGk9PT10KXtzPWNsZWFyVGltZW91dChzKTt2YXIgZT1yJiZyLnBhcmVudE5vZGU7ZSYmZS5yZW1vdmVDaGlsZChyKSxyPXZvaWQgMH19fX0odCxlKSkuc2hvdygpfSx0bGl0ZS5oaWRlPWZ1bmN0aW9uKHQsZSl7dC50b29sdGlwJiZ0LnRvb2x0aXAuaGlkZShlKX0sXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz10bGl0ZSk7IiwiLyoqIFxuICogTGlicmFyeSBjb2RlXG4gKiBVc2luZyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9AY2xvdWRmb3VyL3RyYW5zaXRpb24taGlkZGVuLWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCh7XG4gIGVsZW1lbnQsXG4gIHZpc2libGVDbGFzcyxcbiAgd2FpdE1vZGUgPSAndHJhbnNpdGlvbmVuZCcsXG4gIHRpbWVvdXREdXJhdGlvbixcbiAgaGlkZU1vZGUgPSAnaGlkZGVuJyxcbiAgZGlzcGxheVZhbHVlID0gJ2Jsb2NrJ1xufSkge1xuICBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0JyAmJiB0eXBlb2YgdGltZW91dER1cmF0aW9uICE9PSAnbnVtYmVyJykge1xuICAgIGNvbnNvbGUuZXJyb3IoYFxuICAgICAgV2hlbiBjYWxsaW5nIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50IHdpdGggd2FpdE1vZGUgc2V0IHRvIHRpbWVvdXQsXG4gICAgICB5b3UgbXVzdCBwYXNzIGluIGEgbnVtYmVyIGZvciB0aW1lb3V0RHVyYXRpb24uXG4gICAgYCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEb24ndCB3YWl0IGZvciBleGl0IHRyYW5zaXRpb25zIGlmIGEgdXNlciBwcmVmZXJzIHJlZHVjZWQgbW90aW9uLlxuICAvLyBJZGVhbGx5IHRyYW5zaXRpb25zIHdpbGwgYmUgZGlzYWJsZWQgaW4gQ1NTLCB3aGljaCBtZWFucyB3ZSBzaG91bGQgbm90IHdhaXRcbiAgLy8gYmVmb3JlIGFkZGluZyBgaGlkZGVuYC5cbiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKScpLm1hdGNoZXMpIHtcbiAgICB3YWl0TW9kZSA9ICdpbW1lZGlhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGxpc3RlbmVyIHRvIGFkZCBgaGlkZGVuYCBhZnRlciBvdXIgYW5pbWF0aW9ucyBjb21wbGV0ZS5cbiAgICogVGhpcyBsaXN0ZW5lciB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgY29tcGxldGluZy5cbiAgICovXG4gIGNvbnN0IGxpc3RlbmVyID0gZSA9PiB7XG4gICAgLy8gQ29uZmlybSBgdHJhbnNpdGlvbmVuZGAgd2FzIGNhbGxlZCBvbiAgb3VyIGBlbGVtZW50YCBhbmQgZGlkbid0IGJ1YmJsZVxuICAgIC8vIHVwIGZyb20gYSBjaGlsZCBlbGVtZW50LlxuICAgIGlmIChlLnRhcmdldCA9PT0gZWxlbWVudCkge1xuICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheVZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvblNob3coKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgbGlzdGVuZXIgc2hvdWxkbid0IGJlIGhlcmUgYnV0IGlmIHNvbWVvbmUgc3BhbXMgdGhlIHRvZ2dsZVxuICAgICAgICogb3ZlciBhbmQgb3ZlciByZWFsbHkgZmFzdCBpdCBjYW4gaW5jb3JyZWN0bHkgc3RpY2sgYXJvdW5kLlxuICAgICAgICogV2UgcmVtb3ZlIGl0IGp1c3QgdG8gYmUgc2FmZS5cbiAgICAgICAqL1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFNpbWlsYXJseSwgd2UnbGwgY2xlYXIgdGhlIHRpbWVvdXQgaW4gY2FzZSBpdCdzIHN0aWxsIGhhbmdpbmcgYXJvdW5kLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIC8qKlxuICAgICAgICogRm9yY2UgYSBicm93c2VyIHJlLXBhaW50IHNvIHRoZSBicm93c2VyIHdpbGwgcmVhbGl6ZSB0aGVcbiAgICAgICAqIGVsZW1lbnQgaXMgbm8gbG9uZ2VyIGBoaWRkZW5gIGFuZCBhbGxvdyB0cmFuc2l0aW9ucy5cbiAgICAgICAqL1xuICAgICAgY29uc3QgcmVmbG93ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIaWRlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvbkhpZGUoKSB7XG4gICAgICBpZiAod2FpdE1vZGUgPT09ICd0cmFuc2l0aW9uZW5kJykge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgICB9IGVsc2UgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICAgIH0sIHRpbWVvdXREdXJhdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoaXMgY2xhc3MgdG8gdHJpZ2dlciBvdXIgYW5pbWF0aW9uXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSBlbGVtZW50J3MgdmlzaWJpbGl0eVxuICAgICAqL1xuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUZWxsIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaGlkZGVuIG9yIG5vdC5cbiAgICAgKi9cbiAgICBpc0hpZGRlbigpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGhpZGRlbiBhdHRyaWJ1dGUgZG9lcyBub3QgcmVxdWlyZSBhIHZhbHVlLiBTaW5jZSBhbiBlbXB0eSBzdHJpbmcgaXNcbiAgICAgICAqIGZhbHN5LCBidXQgc2hvd3MgdGhlIHByZXNlbmNlIG9mIGFuIGF0dHJpYnV0ZSB3ZSBjb21wYXJlIHRvIGBudWxsYFxuICAgICAgICovXG4gICAgICBjb25zdCBoYXNIaWRkZW5BdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaGlkZGVuJykgIT09IG51bGw7XG5cbiAgICAgIGNvbnN0IGlzRGlzcGxheU5vbmUgPSBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJztcblxuICAgICAgY29uc3QgaGFzVmlzaWJsZUNsYXNzID0gWy4uLmVsZW1lbnQuY2xhc3NMaXN0XS5pbmNsdWRlcyh2aXNpYmxlQ2xhc3MpO1xuXG4gICAgICByZXR1cm4gaGFzSGlkZGVuQXR0cmlidXRlIHx8IGlzRGlzcGxheU5vbmUgfHwgIWhhc1Zpc2libGVDbGFzcztcbiAgICB9LFxuXG4gICAgLy8gQSBwbGFjZWhvbGRlciBmb3Igb3VyIGB0aW1lb3V0YFxuICAgIHRpbWVvdXQ6IG51bGxcbiAgfTtcbn0iLCIvKipcbiAgUHJpb3JpdHkrIGhvcml6b250YWwgc2Nyb2xsaW5nIG1lbnUuXG5cbiAgQHBhcmFtIHtPYmplY3R9IG9iamVjdCAtIENvbnRhaW5lciBmb3IgYWxsIG9wdGlvbnMuXG4gICAgQHBhcmFtIHtzdHJpbmcgfHwgRE9NIG5vZGV9IHNlbGVjdG9yIC0gRWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gbmF2U2VsZWN0b3IgLSBOYXYgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gY29udGVudFNlbGVjdG9yIC0gQ29udGVudCBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBpdGVtU2VsZWN0b3IgLSBJdGVtcyBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uTGVmdFNlbGVjdG9yIC0gTGVmdCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvblJpZ2h0U2VsZWN0b3IgLSBSaWdodCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtpbnRlZ2VyIHx8IHN0cmluZ30gc2Nyb2xsU3RlcCAtIEFtb3VudCB0byBzY3JvbGwgb24gYnV0dG9uIGNsaWNrLiAnYXZlcmFnZScgZ2V0cyB0aGUgYXZlcmFnZSBsaW5rIHdpZHRoLlxuKi9cblxuY29uc3QgUHJpb3JpdHlOYXZTY3JvbGxlciA9IGZ1bmN0aW9uKHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlcicsXG4gICAgbmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItbmF2JyxcbiAgICBjb250ZW50U2VsZWN0b3I6IGNvbnRlbnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWNvbnRlbnQnLFxuICAgIGl0ZW1TZWxlY3RvcjogaXRlbVNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItaXRlbScsXG4gICAgYnV0dG9uTGVmdFNlbGVjdG9yOiBidXR0b25MZWZ0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuICAgIGJ1dHRvblJpZ2h0U2VsZWN0b3I6IGJ1dHRvblJpZ2h0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0JyxcbiAgICBzY3JvbGxTdGVwOiBzY3JvbGxTdGVwID0gODBcbiAgfSA9IHt9KSB7XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXIgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiBzZWxlY3RvcjtcblxuICBjb25zdCB2YWxpZGF0ZVNjcm9sbFN0ZXAgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIoc2Nyb2xsU3RlcCkgfHwgc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnO1xuICB9XG5cbiAgaWYgKG5hdlNjcm9sbGVyID09PSB1bmRlZmluZWQgfHwgbmF2U2Nyb2xsZXIgPT09IG51bGwgfHwgIXZhbGlkYXRlU2Nyb2xsU3RlcCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGVyZSBpcyBzb21ldGhpbmcgd3JvbmcsIGNoZWNrIHlvdXIgb3B0aW9ucy4nKTtcbiAgfVxuXG4gIGNvbnN0IG5hdlNjcm9sbGVyTmF2ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihuYXZTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoY29udGVudFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMgPSBuYXZTY3JvbGxlckNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChpdGVtU2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckxlZnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvbkxlZnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyUmlnaHQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvblJpZ2h0U2VsZWN0b3IpO1xuXG4gIGxldCBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZUxlZnQgPSAwO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSAwO1xuICBsZXQgc2Nyb2xsaW5nRGlyZWN0aW9uID0gJyc7XG4gIGxldCBzY3JvbGxPdmVyZmxvdyA9ICcnO1xuICBsZXQgdGltZW91dDtcblxuXG4gIC8vIFNldHMgb3ZlcmZsb3cgYW5kIHRvZ2dsZSBidXR0b25zIGFjY29yZGluZ2x5XG4gIGNvbnN0IHNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgc2Nyb2xsT3ZlcmZsb3cgPSBnZXRPdmVyZmxvdygpO1xuICAgIHRvZ2dsZUJ1dHRvbnMoc2Nyb2xsT3ZlcmZsb3cpO1xuICAgIGNhbGN1bGF0ZVNjcm9sbFN0ZXAoKTtcbiAgfVxuXG5cbiAgLy8gRGVib3VuY2Ugc2V0dGluZyB0aGUgb3ZlcmZsb3cgd2l0aCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgY29uc3QgcmVxdWVzdFNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVvdXQpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aW1lb3V0KTtcblxuICAgIHRpbWVvdXQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHNldE92ZXJmbG93KCk7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8vIEdldHMgdGhlIG92ZXJmbG93IGF2YWlsYWJsZSBvbiB0aGUgbmF2IHNjcm9sbGVyXG4gIGNvbnN0IGdldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNjcm9sbFdpZHRoID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGg7XG4gICAgbGV0IHNjcm9sbFZpZXdwb3J0ID0gbmF2U2Nyb2xsZXJOYXYuY2xpZW50V2lkdGg7XG4gICAgbGV0IHNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0O1xuXG4gICAgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSBzY3JvbGxXaWR0aCAtIChzY3JvbGxWaWV3cG9ydCArIHNjcm9sbExlZnQpO1xuXG4gICAgLy8gMSBpbnN0ZWFkIG9mIDAgdG8gY29tcGVuc2F0ZSBmb3IgbnVtYmVyIHJvdW5kaW5nXG4gICAgbGV0IHNjcm9sbExlZnRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVMZWZ0ID4gMTtcbiAgICBsZXQgc2Nyb2xsUmlnaHRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVSaWdodCA+IDE7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhzY3JvbGxXaWR0aCwgc2Nyb2xsVmlld3BvcnQsIHNjcm9sbEF2YWlsYWJsZUxlZnQsIHNjcm9sbEF2YWlsYWJsZVJpZ2h0KTtcblxuICAgIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uICYmIHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2JvdGgnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2xlZnQnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuICdub25lJztcbiAgICB9XG5cbiAgfVxuXG5cbiAgLy8gQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHN0ZXAgYmFzZWQgb24gdGhlIHdpZHRoIG9mIHRoZSBzY3JvbGxlciBhbmQgdGhlIG51bWJlciBvZiBsaW5rc1xuICBjb25zdCBjYWxjdWxhdGVTY3JvbGxTdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJykge1xuICAgICAgbGV0IHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGggLSAocGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctbGVmdCcpKSArIHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpKTtcblxuICAgICAgbGV0IHNjcm9sbFN0ZXBBdmVyYWdlID0gTWF0aC5mbG9vcihzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyAvIG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zLmxlbmd0aCk7XG5cbiAgICAgIHNjcm9sbFN0ZXAgPSBzY3JvbGxTdGVwQXZlcmFnZTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIE1vdmUgdGhlIHNjcm9sbGVyIHdpdGggYSB0cmFuc2Zvcm1cbiAgY29uc3QgbW92ZVNjcm9sbGVyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG5cbiAgICBpZiAoc2Nyb2xsaW5nID09PSB0cnVlIHx8IChzY3JvbGxPdmVyZmxvdyAhPT0gZGlyZWN0aW9uICYmIHNjcm9sbE92ZXJmbG93ICE9PSAnYm90aCcpKSByZXR1cm47XG5cbiAgICBsZXQgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxTdGVwO1xuICAgIGxldCBzY3JvbGxBdmFpbGFibGUgPSBkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IHNjcm9sbEF2YWlsYWJsZUxlZnQgOiBzY3JvbGxBdmFpbGFibGVSaWdodDtcblxuICAgIC8vIElmIHRoZXJlIHdpbGwgYmUgbGVzcyB0aGFuIDI1JSBvZiB0aGUgbGFzdCBzdGVwIHZpc2libGUgdGhlbiBzY3JvbGwgdG8gdGhlIGVuZFxuICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCAoc2Nyb2xsU3RlcCAqIDEuNzUpKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbEF2YWlsYWJsZTtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSAqPSAtMTtcblxuICAgICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IHNjcm9sbFN0ZXApIHtcbiAgICAgICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NuYXAtYWxpZ24tZW5kJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIHNjcm9sbERpc3RhbmNlICsgJ3B4KSc7XG5cbiAgICBzY3JvbGxpbmdEaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgc2Nyb2xsaW5nID0gdHJ1ZTtcbiAgfVxuXG5cbiAgLy8gU2V0IHRoZSBzY3JvbGxlciBwb3NpdGlvbiBhbmQgcmVtb3ZlcyB0cmFuc2Zvcm0sIGNhbGxlZCBhZnRlciBtb3ZlU2Nyb2xsZXIoKSBpbiB0aGUgdHJhbnNpdGlvbmVuZCBldmVudFxuICBjb25zdCBzZXRTY3JvbGxlclBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50LCBudWxsKTtcbiAgICB2YXIgdHJhbnNmb3JtID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJyk7XG4gICAgdmFyIHRyYW5zZm9ybVZhbHVlID0gTWF0aC5hYnMocGFyc2VJbnQodHJhbnNmb3JtLnNwbGl0KCcsJylbNF0pIHx8IDApO1xuXG4gICAgaWYgKHNjcm9sbGluZ0RpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICB0cmFuc2Zvcm1WYWx1ZSAqPSAtMTtcbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbiAgICBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCArIHRyYW5zZm9ybVZhbHVlO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJywgJ3NuYXAtYWxpZ24tZW5kJyk7XG5cbiAgICBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgfVxuXG5cbiAgLy8gVG9nZ2xlIGJ1dHRvbnMgZGVwZW5kaW5nIG9uIG92ZXJmbG93XG4gIGNvbnN0IHRvZ2dsZUJ1dHRvbnMgPSBmdW5jdGlvbihvdmVyZmxvdykge1xuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAnbGVmdCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdyaWdodCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH1cblxuXG4gIGNvbnN0IGluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgIHNldE92ZXJmbG93KCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlck5hdi5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgc2V0U2Nyb2xsZXJQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJMZWZ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdsZWZ0Jyk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlclJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdyaWdodCcpO1xuICAgIH0pO1xuXG4gIH07XG5cblxuICAvLyBTZWxmIGluaXRcbiAgaW5pdCgpO1xuXG5cbiAgLy8gUmV2ZWFsIEFQSVxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcblxufTtcblxuLy9leHBvcnQgZGVmYXVsdCBQcmlvcml0eU5hdlNjcm9sbGVyO1xuIiwiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIF92YWxpZEZvcm09cmVxdWlyZShcIi4vc3JjL3ZhbGlkLWZvcm1cIik7dmFyIF92YWxpZEZvcm0yPV9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3ZhbGlkRm9ybSk7ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmope3JldHVybiBvYmomJm9iai5fX2VzTW9kdWxlP29iajp7ZGVmYXVsdDpvYmp9fXdpbmRvdy5WYWxpZEZvcm09X3ZhbGlkRm9ybTIuZGVmYXVsdDt3aW5kb3cuVmFsaWRGb3JtLnRvZ2dsZUludmFsaWRDbGFzcz1fdmFsaWRGb3JtLnRvZ2dsZUludmFsaWRDbGFzczt3aW5kb3cuVmFsaWRGb3JtLmhhbmRsZUN1c3RvbU1lc3NhZ2VzPV92YWxpZEZvcm0uaGFuZGxlQ3VzdG9tTWVzc2FnZXM7d2luZG93LlZhbGlkRm9ybS5oYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheT1fdmFsaWRGb3JtLmhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5fSx7XCIuL3NyYy92YWxpZC1mb3JtXCI6M31dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTp0cnVlfSk7ZXhwb3J0cy5jbG9uZT1jbG9uZTtleHBvcnRzLmRlZmF1bHRzPWRlZmF1bHRzO2V4cG9ydHMuaW5zZXJ0QWZ0ZXI9aW5zZXJ0QWZ0ZXI7ZXhwb3J0cy5pbnNlcnRCZWZvcmU9aW5zZXJ0QmVmb3JlO2V4cG9ydHMuZm9yRWFjaD1mb3JFYWNoO2V4cG9ydHMuZGVib3VuY2U9ZGVib3VuY2U7ZnVuY3Rpb24gY2xvbmUob2JqKXt2YXIgY29weT17fTtmb3IodmFyIGF0dHIgaW4gb2JqKXtpZihvYmouaGFzT3duUHJvcGVydHkoYXR0cikpY29weVthdHRyXT1vYmpbYXR0cl19cmV0dXJuIGNvcHl9ZnVuY3Rpb24gZGVmYXVsdHMob2JqLGRlZmF1bHRPYmplY3Qpe29iaj1jbG9uZShvYmp8fHt9KTtmb3IodmFyIGsgaW4gZGVmYXVsdE9iamVjdCl7aWYob2JqW2tdPT09dW5kZWZpbmVkKW9ialtrXT1kZWZhdWx0T2JqZWN0W2tdfXJldHVybiBvYmp9ZnVuY3Rpb24gaW5zZXJ0QWZ0ZXIocmVmTm9kZSxub2RlVG9JbnNlcnQpe3ZhciBzaWJsaW5nPXJlZk5vZGUubmV4dFNpYmxpbmc7aWYoc2libGluZyl7dmFyIF9wYXJlbnQ9cmVmTm9kZS5wYXJlbnROb2RlO19wYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGVUb0luc2VydCxzaWJsaW5nKX1lbHNle3BhcmVudC5hcHBlbmRDaGlsZChub2RlVG9JbnNlcnQpfX1mdW5jdGlvbiBpbnNlcnRCZWZvcmUocmVmTm9kZSxub2RlVG9JbnNlcnQpe3ZhciBwYXJlbnQ9cmVmTm9kZS5wYXJlbnROb2RlO3BhcmVudC5pbnNlcnRCZWZvcmUobm9kZVRvSW5zZXJ0LHJlZk5vZGUpfWZ1bmN0aW9uIGZvckVhY2goaXRlbXMsZm4pe2lmKCFpdGVtcylyZXR1cm47aWYoaXRlbXMuZm9yRWFjaCl7aXRlbXMuZm9yRWFjaChmbil9ZWxzZXtmb3IodmFyIGk9MDtpPGl0ZW1zLmxlbmd0aDtpKyspe2ZuKGl0ZW1zW2ldLGksaXRlbXMpfX19ZnVuY3Rpb24gZGVib3VuY2UobXMsZm4pe3ZhciB0aW1lb3V0PXZvaWQgMDt2YXIgZGVib3VuY2VkRm49ZnVuY3Rpb24gZGVib3VuY2VkRm4oKXtjbGVhclRpbWVvdXQodGltZW91dCk7dGltZW91dD1zZXRUaW1lb3V0KGZuLG1zKX07cmV0dXJuIGRlYm91bmNlZEZufX0se31dLDM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTp0cnVlfSk7ZXhwb3J0cy50b2dnbGVJbnZhbGlkQ2xhc3M9dG9nZ2xlSW52YWxpZENsYXNzO2V4cG9ydHMuaGFuZGxlQ3VzdG9tTWVzc2FnZXM9aGFuZGxlQ3VzdG9tTWVzc2FnZXM7ZXhwb3J0cy5oYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheT1oYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheTtleHBvcnRzLmRlZmF1bHQ9dmFsaWRGb3JtO3ZhciBfdXRpbD1yZXF1aXJlKFwiLi91dGlsXCIpO2Z1bmN0aW9uIHRvZ2dsZUludmFsaWRDbGFzcyhpbnB1dCxpbnZhbGlkQ2xhc3Mpe2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnZhbGlkXCIsZnVuY3Rpb24oKXtpbnB1dC5jbGFzc0xpc3QuYWRkKGludmFsaWRDbGFzcyl9KTtpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixmdW5jdGlvbigpe2lmKGlucHV0LnZhbGlkaXR5LnZhbGlkKXtpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKGludmFsaWRDbGFzcyl9fSl9dmFyIGVycm9yUHJvcHM9W1wiYmFkSW5wdXRcIixcInBhdHRlcm5NaXNtYXRjaFwiLFwicmFuZ2VPdmVyZmxvd1wiLFwicmFuZ2VVbmRlcmZsb3dcIixcInN0ZXBNaXNtYXRjaFwiLFwidG9vTG9uZ1wiLFwidG9vU2hvcnRcIixcInR5cGVNaXNtYXRjaFwiLFwidmFsdWVNaXNzaW5nXCIsXCJjdXN0b21FcnJvclwiXTtmdW5jdGlvbiBnZXRDdXN0b21NZXNzYWdlKGlucHV0LGN1c3RvbU1lc3NhZ2VzKXtjdXN0b21NZXNzYWdlcz1jdXN0b21NZXNzYWdlc3x8e307dmFyIGxvY2FsRXJyb3JQcm9wcz1baW5wdXQudHlwZStcIk1pc21hdGNoXCJdLmNvbmNhdChlcnJvclByb3BzKTt2YXIgdmFsaWRpdHk9aW5wdXQudmFsaWRpdHk7Zm9yKHZhciBpPTA7aTxsb2NhbEVycm9yUHJvcHMubGVuZ3RoO2krKyl7dmFyIHByb3A9bG9jYWxFcnJvclByb3BzW2ldO2lmKHZhbGlkaXR5W3Byb3BdKXtyZXR1cm4gaW5wdXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1cIitwcm9wKXx8Y3VzdG9tTWVzc2FnZXNbcHJvcF19fX1mdW5jdGlvbiBoYW5kbGVDdXN0b21NZXNzYWdlcyhpbnB1dCxjdXN0b21NZXNzYWdlcyl7ZnVuY3Rpb24gY2hlY2tWYWxpZGl0eSgpe3ZhciBtZXNzYWdlPWlucHV0LnZhbGlkaXR5LnZhbGlkP251bGw6Z2V0Q3VzdG9tTWVzc2FnZShpbnB1dCxjdXN0b21NZXNzYWdlcyk7aW5wdXQuc2V0Q3VzdG9tVmFsaWRpdHkobWVzc2FnZXx8XCJcIil9aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsY2hlY2tWYWxpZGl0eSk7aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImludmFsaWRcIixjaGVja1ZhbGlkaXR5KX1mdW5jdGlvbiBoYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheShpbnB1dCxvcHRpb25zKXt2YXIgdmFsaWRhdGlvbkVycm9yQ2xhc3M9b3B0aW9ucy52YWxpZGF0aW9uRXJyb3JDbGFzcyx2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzcz1vcHRpb25zLnZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzLGVycm9yUGxhY2VtZW50PW9wdGlvbnMuZXJyb3JQbGFjZW1lbnQ7ZnVuY3Rpb24gY2hlY2tWYWxpZGl0eShvcHRpb25zKXt2YXIgaW5zZXJ0RXJyb3I9b3B0aW9ucy5pbnNlcnRFcnJvcjt2YXIgcGFyZW50Tm9kZT1pbnB1dC5wYXJlbnROb2RlO3ZhciBlcnJvck5vZGU9cGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKFwiLlwiK3ZhbGlkYXRpb25FcnJvckNsYXNzKXx8ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtpZighaW5wdXQudmFsaWRpdHkudmFsaWQmJmlucHV0LnZhbGlkYXRpb25NZXNzYWdlKXtlcnJvck5vZGUuY2xhc3NOYW1lPXZhbGlkYXRpb25FcnJvckNsYXNzO2Vycm9yTm9kZS50ZXh0Q29udGVudD1pbnB1dC52YWxpZGF0aW9uTWVzc2FnZTtpZihpbnNlcnRFcnJvcil7ZXJyb3JQbGFjZW1lbnQ9PT1cImJlZm9yZVwiPygwLF91dGlsLmluc2VydEJlZm9yZSkoaW5wdXQsZXJyb3JOb2RlKTooMCxfdXRpbC5pbnNlcnRBZnRlcikoaW5wdXQsZXJyb3JOb2RlKTtwYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQodmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3MpfX1lbHNle3BhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSh2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzcyk7ZXJyb3JOb2RlLnJlbW92ZSgpfX1pbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixmdW5jdGlvbigpe2NoZWNrVmFsaWRpdHkoe2luc2VydEVycm9yOmZhbHNlfSl9KTtpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW52YWxpZFwiLGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKTtjaGVja1ZhbGlkaXR5KHtpbnNlcnRFcnJvcjp0cnVlfSl9KX12YXIgZGVmYXVsdE9wdGlvbnM9e2ludmFsaWRDbGFzczpcImludmFsaWRcIix2YWxpZGF0aW9uRXJyb3JDbGFzczpcInZhbGlkYXRpb24tZXJyb3JcIix2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzczpcImhhcy12YWxpZGF0aW9uLWVycm9yXCIsY3VzdG9tTWVzc2FnZXM6e30sZXJyb3JQbGFjZW1lbnQ6XCJiZWZvcmVcIn07ZnVuY3Rpb24gdmFsaWRGb3JtKGVsZW1lbnQsb3B0aW9ucyl7aWYoIWVsZW1lbnR8fCFlbGVtZW50Lm5vZGVOYW1lKXt0aHJvdyBuZXcgRXJyb3IoXCJGaXJzdCBhcmcgdG8gdmFsaWRGb3JtIG11c3QgYmUgYSBmb3JtLCBpbnB1dCwgc2VsZWN0LCBvciB0ZXh0YXJlYVwiKX12YXIgaW5wdXRzPXZvaWQgMDt2YXIgdHlwZT1lbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7b3B0aW9ucz0oMCxfdXRpbC5kZWZhdWx0cykob3B0aW9ucyxkZWZhdWx0T3B0aW9ucyk7aWYodHlwZT09PVwiZm9ybVwiKXtpbnB1dHM9ZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWFcIik7Zm9jdXNJbnZhbGlkSW5wdXQoZWxlbWVudCxpbnB1dHMpfWVsc2UgaWYodHlwZT09PVwiaW5wdXRcInx8dHlwZT09PVwic2VsZWN0XCJ8fHR5cGU9PT1cInRleHRhcmVhXCIpe2lucHV0cz1bZWxlbWVudF19ZWxzZXt0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IGZvcm0sIGlucHV0LCBzZWxlY3QsIG9yIHRleHRhcmVhIGVsZW1lbnRzIGFyZSBzdXBwb3J0ZWRcIil9dmFsaWRGb3JtSW5wdXRzKGlucHV0cyxvcHRpb25zKX1mdW5jdGlvbiBmb2N1c0ludmFsaWRJbnB1dChmb3JtLGlucHV0cyl7dmFyIGZvY3VzRmlyc3Q9KDAsX3V0aWwuZGVib3VuY2UpKDEwMCxmdW5jdGlvbigpe3ZhciBpbnZhbGlkTm9kZT1mb3JtLnF1ZXJ5U2VsZWN0b3IoXCI6aW52YWxpZFwiKTtpZihpbnZhbGlkTm9kZSlpbnZhbGlkTm9kZS5mb2N1cygpfSk7KDAsX3V0aWwuZm9yRWFjaCkoaW5wdXRzLGZ1bmN0aW9uKGlucHV0KXtyZXR1cm4gaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImludmFsaWRcIixmb2N1c0ZpcnN0KX0pfWZ1bmN0aW9uIHZhbGlkRm9ybUlucHV0cyhpbnB1dHMsb3B0aW9ucyl7dmFyIGludmFsaWRDbGFzcz1vcHRpb25zLmludmFsaWRDbGFzcyxjdXN0b21NZXNzYWdlcz1vcHRpb25zLmN1c3RvbU1lc3NhZ2VzOygwLF91dGlsLmZvckVhY2gpKGlucHV0cyxmdW5jdGlvbihpbnB1dCl7dG9nZ2xlSW52YWxpZENsYXNzKGlucHV0LGludmFsaWRDbGFzcyk7aGFuZGxlQ3VzdG9tTWVzc2FnZXMoaW5wdXQsY3VzdG9tTWVzc2FnZXMpO2hhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5KGlucHV0LG9wdGlvbnMpfSl9fSx7XCIuL3V0aWxcIjoyfV19LHt9LFsxXSk7IiwiLyoqXG4gKiBEbyB0aGVzZSB0aGluZ3MgYXMgcXVpY2tseSBhcyBwb3NzaWJsZTsgd2UgbWlnaHQgaGF2ZSBDU1Mgb3IgZWFybHkgc2NyaXB0cyB0aGF0IHJlcXVpcmUgb24gaXRcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ25vLWpzJyApO1xuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdqcycgKTtcbiIsIi8qKlxuICogVGhpcyBpcyB1c2VkIHRvIGNhdXNlIEdvb2dsZSBBbmFseXRpY3MgZXZlbnRzIHRvIHJ1blxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuZnVuY3Rpb24gbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgdmFsdWUgKSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdH1cblx0XHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3Igc2hhcmluZyBjb250ZW50XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG4vLyB0cmFjayBhIHNoYXJlIHZpYSBhbmFseXRpY3MgZXZlbnQuXG5mdW5jdGlvbiB0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiA9ICcnICkge1xuICAgIHZhciBjYXRlZ29yeSA9ICdTaGFyZSc7XG4gICAgaWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG4gICAgICAgIGNhdGVnb3J5ID0gJ1NoYXJlIC0gJyArIHBvc2l0aW9uO1xuICAgIH1cbiAgICAvLyB0cmFjayBhcyBhbiBldmVudCwgYW5kIGFzIHNvY2lhbCBpZiBpdCBpcyB0d2l0dGVyIG9yIGZiXG4gICAgbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeSwgdGV4dCwgbG9jYXRpb24ucGF0aG5hbWUgKTtcbiAgICBpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZ2EgKSB7XG4gICAgICAgIGlmICggJ0ZhY2Vib29rJyA9PT0gdGV4dCB8fCAnVHdpdHRlcicgPT09IHRleHQgKSB7XG4gICAgICAgICAgICBpZiAoICdGYWNlYm9vaycgPT09IHRleHQgKSB7XG4gICAgICAgICAgICAgICAgZ2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdTaGFyZScsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbn1cblxuLy8gY29weSB0aGUgY3VycmVudCBVUkwgdG8gdGhlIHVzZXIncyBjbGlwYm9hcmRcbmZ1bmN0aW9uIGNvcHlDdXJyZW50VVJMKCkge1xuICAgIHZhciBkdW1teSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdpbnB1dCcgKSxcbiAgICAgICAgdGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGR1bW15ICk7XG4gICAgZHVtbXkudmFsdWUgPSB0ZXh0O1xuICAgIGR1bW15LnNlbGVjdCgpO1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCAnY29weScgKTtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKCBkdW1teSApO1xufVxuXG4vLyB0b3Agc2hhcmUgYnV0dG9uIGNsaWNrXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi5tLWVudHJ5LXNoYXJlLXRvcCBhXCIgKS5mb3JFYWNoKFxuICAgIHRvcEJ1dHRvbiA9PiB0b3BCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCAoIGUgKSA9PiB7XG4gICAgICAgIHZhciB0ZXh0ID0gZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSggJ2RhdGEtc2hhcmUtYWN0aW9uJyApO1xuICAgICAgICB2YXIgcG9zaXRpb24gPSAndG9wJztcbiAgICAgICAgdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcbiAgICB9IClcbik7XG5cbi8vIHdoZW4gdGhlIHByaW50IGJ1dHRvbiBpcyBjbGlja2VkXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXByaW50IGFcIiApLmZvckVhY2goXG4gICAgcHJpbnRCdXR0b24gPT4gcHJpbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCAoIGUgKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgd2luZG93LnByaW50KCk7XG4gICAgfSApXG4pO1xuXG5cbi8vIHdoZW4gdGhlIHJlcHVibGlzaCBidXR0b24gaXMgY2xpY2tlZFxuLy8gdGhlIHBsdWdpbiBjb250cm9scyB0aGUgcmVzdCwgYnV0IHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRoZSBkZWZhdWx0IGV2ZW50IGRvZXNuJ3QgZmlyZVxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1yZXB1Ymxpc2ggYVwiICkuZm9yRWFjaChcbiAgICByZXB1Ymxpc2hCdXR0b24gPT4gcmVwdWJsaXNoQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgKCBlICkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSApXG4pO1xuXG4vLyB3aGVuIHRoZSBjb3B5IGxpbmsgYnV0dG9uIGlzIGNsaWNrZWRcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtY29weS11cmwgYVwiICkuZm9yRWFjaChcbiAgICBjb3B5QnV0dG9uID0+IGNvcHlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCAoIGUgKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29weUN1cnJlbnRVUkwoKTtcbiAgICAgICAgdGxpdGUuc2hvdyggKCBlLnRhcmdldCApLCB7IGdyYXY6ICd3JyB9ICk7XG4gICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGxpdGUuaGlkZSggKCBlLnRhcmdldCApICk7XG4gICAgICAgIH0sIDMwMDAgKTtcbiAgICB9IClcbik7XG5cbi8vIHdoZW4gc2hhcmluZyB2aWEgZmFjZWJvb2ssIHR3aXR0ZXIsIG9yIGVtYWlsLCBvcGVuIHRoZSBkZXN0aW5hdGlvbiB1cmwgaW4gYSBuZXcgd2luZG93XG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWZhY2Vib29rIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXR3aXR0ZXIgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZW1haWwgYVwiICkuZm9yRWFjaChcbiAgICBhbnlTaGFyZUJ1dHRvbiA9PiBhbnlTaGFyZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsICggZSApID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciB1cmwgPSBlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCAnaHJlZicgKTtcblx0XHR3aW5kb3cub3BlbiggdXJsLCAnX2JsYW5rJyApO1xuICAgIH0gKVxuKTsiLCIvKipcbiAqIEZpbGUgbmF2aWdhdGlvbi5qcy5cbiAqXG4gKiBOYXZpZ2F0aW9uIHNjcmlwdHMuIEluY2x1ZGVzIG1vYmlsZSBvciB0b2dnbGUgYmVoYXZpb3IsIGFuYWx5dGljcyB0cmFja2luZyBvZiBzcGVjaWZpYyBtZW51cy5cbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICovXG5cbmZ1bmN0aW9uIHNldHVwUHJpbWFyeU5hdigpIHtcblx0Y29uc3QgcHJpbWFyeU5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1saW5rcycgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHByaW1hcnlOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IGJ1dHRvbicgKTtcblx0aWYgKCBudWxsICE9PSBwcmltYXJ5TmF2VG9nZ2xlICkge1xuXHRcdHByaW1hcnlOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRjb25zdCB1c2VyTmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItYWNjb3VudCB1bCcgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHVzZXJOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItYWNjb3VudCA+IGEnICk7XG5cdGlmICggbnVsbCAhPT0gdXNlck5hdlRvZ2dsZSApIHtcblx0XHR1c2VyTmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0dmFyIHRhcmdldCAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgLm0tZm9ybS1zZWFyY2ggZmllbGRzZXQgLmEtYnV0dG9uLXNlbnRlbmNlJyApO1xuXHRpZiAoIG51bGwgIT09IHRhcmdldCApIHtcblx0XHR2YXIgZGl2ICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRkaXYuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLXNlYXJjaFwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuXHRcdHZhciBmcmFnbWVudCAgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0ZGl2LnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuXHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG5cblx0XHRjb25zdCBzZWFyY2hUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1hY3Rpb25zIC5tLWZvcm0tc2VhcmNoJyApLFxuXHRcdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHRcdH0gKTtcblxuXHRcdHZhciBzZWFyY2hWaXNpYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ2xpLnNlYXJjaCA+IGEnICk7XG5cdFx0c2VhcmNoVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHR2YXIgc2VhcmNoQ2xvc2UgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLXNlYXJjaCcgKTtcblx0XHRzZWFyY2hDbG9zZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHQvLyBlc2NhcGUga2V5IHByZXNzXG5cdCQoIGRvY3VtZW50ICkua2V5dXAoIGZ1bmN0aW9uKCBlICkge1xuXHRcdGlmICggMjcgPT09IGUua2V5Q29kZSApIHtcblx0XHRcdGxldCBwcmltYXJ5TmF2RXhwYW5kZWQgPSAndHJ1ZScgPT09IHByaW1hcnlOYXZUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGxldCB1c2VyTmF2RXhwYW5kZWQgPSAndHJ1ZScgPT09IHVzZXJOYXZUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGxldCBzZWFyY2hJc1Zpc2libGUgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgcHJpbWFyeU5hdkV4cGFuZGVkICYmIHRydWUgPT09IHByaW1hcnlOYXZFeHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRvZ2dsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBwcmltYXJ5TmF2RXhwYW5kZWQgKTtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiB1c2VyTmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gdXNlck5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHVzZXJOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHNlYXJjaElzVmlzaWJsZSAmJiB0cnVlID09PSBzZWFyY2hJc1Zpc2libGUgKSB7XG5cdFx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgc2VhcmNoSXNWaXNpYmxlICk7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufVxuXG5mdW5jdGlvbiBzZXR1cFNjcm9sbE5hdiggc2VsZWN0b3IsIG5hdlNlbGVjdG9yLCBjb250ZW50U2VsZWN0b3IgKSB7XG5cblx0dmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG5cdHZhciBpc0lFID0gL01TSUV8VHJpZGVudC8udGVzdCggdWEgKTtcblx0aWYgKCBpc0lFICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIEluaXQgd2l0aCBhbGwgb3B0aW9ucyBhdCBkZWZhdWx0IHNldHRpbmdcblx0Y29uc3QgcHJpb3JpdHlOYXZTY3JvbGxlckRlZmF1bHQgPSBQcmlvcml0eU5hdlNjcm9sbGVyKCB7XG5cdFx0c2VsZWN0b3I6IHNlbGVjdG9yLFxuXHRcdG5hdlNlbGVjdG9yOiBuYXZTZWxlY3Rvcixcblx0XHRjb250ZW50U2VsZWN0b3I6IGNvbnRlbnRTZWxlY3Rvcixcblx0XHRpdGVtU2VsZWN0b3I6ICdsaSwgYScsXG5cdFx0YnV0dG9uTGVmdFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuXHRcdGJ1dHRvblJpZ2h0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tcmlnaHQnXG5cblx0XHQvL3Njcm9sbFN0ZXA6ICdhdmVyYWdlJ1xuXHR9ICk7XG5cblx0Ly8gSW5pdCBtdWx0aXBsZSBuYXYgc2Nyb2xsZXJzIHdpdGggdGhlIHNhbWUgb3B0aW9uc1xuXHQvKmxldCBuYXZTY3JvbGxlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmF2LXNjcm9sbGVyJyk7XG5cblx0bmF2U2Nyb2xsZXJzLmZvckVhY2goKGN1cnJlbnRWYWx1ZSwgY3VycmVudEluZGV4KSA9PiB7XG5cdCAgUHJpb3JpdHlOYXZTY3JvbGxlcih7XG5cdCAgICBzZWxlY3RvcjogY3VycmVudFZhbHVlXG5cdCAgfSk7XG5cdH0pOyovXG59XG5cbnNldHVwUHJpbWFyeU5hdigpO1xuXG5pZiAoIDAgPCAkKCAnLm0tc3ViLW5hdmlnYXRpb24nICkubGVuZ3RoICkge1xuXHRzZXR1cFNjcm9sbE5hdiggJy5tLXN1Yi1uYXZpZ2F0aW9uJywgJy5tLXN1Ym5hdi1uYXZpZ2F0aW9uJywgJy5tLW1lbnUtc3ViLW5hdmlnYXRpb24nICk7XG59XG5pZiAoIDAgPCAkKCAnLm0tcGFnaW5hdGlvbi1uYXZpZ2F0aW9uJyApLmxlbmd0aCApIHtcblx0c2V0dXBTY3JvbGxOYXYoICcubS1wYWdpbmF0aW9uLW5hdmlnYXRpb24nLCAnLm0tcGFnaW5hdGlvbi1jb250YWluZXInLCAnLm0tcGFnaW5hdGlvbi1saXN0JyApO1xufVxuXG4kKCAnYScsICQoICcuby1zaXRlLXNpZGViYXInICkgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdHZhciB3aWRnZXRUaXRsZSAgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS13aWRnZXQnICkuZmluZCggJ2gzJyApLnRleHQoKTtcblx0dmFyIHpvbmVUaXRsZSAgICAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXpvbmUnICkuZmluZCggJy5hLXpvbmUtdGl0bGUnICkudGV4dCgpO1xuXHR2YXIgc2lkZWJhclNlY3Rpb25UaXRsZSA9ICcnO1xuXHRpZiAoICcnICE9PSB3aWRnZXRUaXRsZSApIHtcblx0XHRzaWRlYmFyU2VjdGlvblRpdGxlID0gd2lkZ2V0VGl0bGU7XG5cdH0gZWxzZSBpZiAoICcnICE9PSB6b25lVGl0bGUgKSB7XG5cdFx0c2lkZWJhclNlY3Rpb25UaXRsZSA9IHpvbmVUaXRsZTtcblx0fVxuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsICdTaWRlYmFyIExpbmsnLCAnQ2xpY2snLCBzaWRlYmFyU2VjdGlvblRpdGxlICk7XG59ICk7XG5cbiQoICdhJywgJCggJy50b2RheW9ubWlubnBvc3QnICkgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ0dsZWFuIExpbms6IFRvZGF5IG9uIE1pbm5Qb3N0JywgJ0NsaWNrJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn0gKTtcblxuJCggJ2EnLCAkKCAnLm0tcmVsYXRlZCcgKSApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCAnUmVsYXRlZCBTZWN0aW9uIExpbmsnLCAnQ2xpY2snLCBsb2NhdGlvbi5wYXRobmFtZSApO1xufSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBmb3Jtc1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG5qUXVlcnkuZm4udGV4dE5vZGVzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNvbnRlbnRzKCkuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKCB0aGlzLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSAmJiAnJyAhPT0gdGhpcy5ub2RlVmFsdWUudHJpbSgpICk7XG5cdH0gKTtcbn07XG5cbmZ1bmN0aW9uIGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoIGFjdGlvbiApIHtcblx0dmFyIG1hcmt1cCA9ICc8bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLWZvcm0tY29uZmlybVwiPjxsYWJlbD5BcmUgeW91IHN1cmU/IDxhIGlkPVwiYS1jb25maXJtLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ZZXM8L2E+IHwgPGEgaWQ9XCJhLXN0b3AtJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPk5vPC9hPjwvbGFiZWw+PC9saT4nO1xuXHRyZXR1cm4gbWFya3VwO1xufVxuXG5mdW5jdGlvbiBtYW5hZ2VFbWFpbHMoKSB7XG5cdHZhciBmb3JtICAgICAgICAgICAgICAgPSAkKCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScgKTtcblx0dmFyIHJlc3RSb290ICAgICAgICAgICA9IHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Quc2l0ZV91cmwgKyB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnJlc3RfbmFtZXNwYWNlO1xuXHR2YXIgZnVsbFVybCAgICAgICAgICAgID0gcmVzdFJvb3QgKyAnLycgKyAndXBkYXRlLXVzZXIvJztcblx0dmFyIGNvbmZpcm1DaGFuZ2UgICAgICA9ICcnO1xuXHR2YXIgbmV4dEVtYWlsQ291bnQgICAgID0gMTtcblx0dmFyIG5ld1ByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgb2xkUHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBwcmltYXJ5SWQgICAgICAgICAgPSAnJztcblx0dmFyIGVtYWlsVG9SZW1vdmUgICAgICA9ICcnO1xuXHR2YXIgY29uc29saWRhdGVkRW1haWxzID0gW107XG5cdHZhciBuZXdFbWFpbHMgICAgICAgICAgPSBbXTtcblx0dmFyIGFqYXhGb3JtRGF0YSAgICAgICA9ICcnO1xuXHR2YXIgdGhhdCAgICAgICAgICAgICAgID0gJyc7XG5cblx0Ly8gc3RhcnQgb3V0IHdpdGggbm8gcHJpbWFyeS9yZW1vdmFscyBjaGVja2VkXG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdC8vIGlmIHRoZXJlIGlzIGEgbGlzdCBvZiBlbWFpbHMgKG5vdCBqdXN0IGEgc2luZ2xlIGZvcm0gZmllbGQpXG5cdGlmICggMCA8ICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoICkge1xuXHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblxuXHRcdC8vIGlmIGEgdXNlciBzZWxlY3RzIGEgbmV3IHByaW1hcnksIG1vdmUgaXQgaW50byB0aGF0IHBvc2l0aW9uXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nLCBmdW5jdGlvbigpIHtcblxuXHRcdFx0bmV3UHJpbWFyeUVtYWlsID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdHByaW1hcnlJZCAgICAgICA9ICQoIHRoaXMgKS5wcm9wKCAnaWQnICkucmVwbGFjZSggJ3ByaW1hcnlfZW1haWxfJywgJycgKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdwcmltYXJ5LWNoYW5nZScgKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXG5cdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBtYWluIGhpZGRlbiBmb3JtIHZhbHVlXG5cdFx0XHRcdCQoICcjZW1haWwnICkudmFsKCBuZXdQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBzdWJtaXQgZm9ybSB2YWx1ZXMuXG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cblx0XHRcdFx0Ly8gdW5jaGVjayB0aGUgcmFkaW8gYnV0dG9uXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIGZvcm0gdmFsdWVzIHRvIHRoZSBvbGQgcHJpbWFyeSBlbWFpbFxuXHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjcmVtb3ZlX2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgY29uZmlybSBtZXNzYWdlXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHR9ICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjaGFuZ2UnLCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZW1haWxUb1JlbW92ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdyZW1vdmFsJyApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSAhPT0gZW1haWxUb1JlbW92ZSApIHtcblx0XHRcdFx0XHRjb25zb2xpZGF0ZWRFbWFpbHMucHVzaCggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyIGZvciByZW1vdmFsXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQvLyBpZiBjb25maXJtZWQsIHJlbW92ZSB0aGUgZW1haWwgYW5kIHN1Ym1pdCB0aGUgZm9ybVxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5mYWRlT3V0KCAnbm9ybWFsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLnJlbW92ZSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCAndmFsdWUgaXMgJyArIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8vIGlmIGEgdXNlciB3YW50cyB0byBhZGQgYW4gZW1haWwsIGdpdmUgdGhlbSBhIHByb3Blcmx5IG51bWJlcmVkIGZpZWxkXG5cdCQoICcubS1mb3JtLWVtYWlsJyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcgKS5iZWZvcmUoICc8ZGl2IGNsYXNzPVwiYS1pbnB1dC13aXRoLWJ1dHRvbiBhLWJ1dHRvbi1zZW50ZW5jZVwiPjxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIGlkPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIHZhbHVlPVwiXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBpZD1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBjbGFzcz1cImEtYnV0dG9uIGEtYnV0dG9uLWFkZC11c2VyLWVtYWlsXCI+QWRkPC9idXR0b24+PC9kaXY+JyApO1xuXHRcdG5leHRFbWFpbENvdW50Kys7XG5cdH0gKTtcblxuXHQkKCAnaW5wdXRbdHlwZT1zdWJtaXRdJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgYnV0dG9uID0gJCggdGhpcyApO1xuXHRcdHZhciBidXR0b25Gb3JtID0gYnV0dG9uLmNsb3Nlc3QoICdmb3JtJyApO1xuXHRcdGJ1dHRvbkZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJywgYnV0dG9uLnZhbCgpICk7XG5cdH0gKTtcblxuXHQkKCAnLm0tZW50cnktY29udGVudCcgKS5vbiggJ3N1Ym1pdCcsICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdHZhciBmb3JtID0gJCggdGhpcyApO1xuXHRcdHZhciBzdWJtaXR0aW5nQnV0dG9uID0gZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nICkgfHwgJyc7XG5cblx0XHQvLyBpZiB0aGVyZSBpcyBubyBzdWJtaXR0aW5nIGJ1dHRvbiwgcGFzcyBpdCBieSBBamF4XG5cdFx0aWYgKCAnJyA9PT0gc3VibWl0dGluZ0J1dHRvbiB8fCAnU2F2ZSBDaGFuZ2VzJyAhPT0gc3VibWl0dGluZ0J1dHRvbiApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhamF4Rm9ybURhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4Rm9ybURhdGEgPSBhamF4Rm9ybURhdGEgKyAnJnJlc3Q9dHJ1ZSc7XG5cdFx0XHQkLmFqYXgoIHtcblx0XHRcdFx0dXJsOiBmdWxsVXJsLFxuXHRcdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKCB4aHIgKSB7XG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRkYXRhOiBhamF4Rm9ybURhdGFcblx0XHRcdH0gKS5kb25lKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0fSApLmdldCgpO1xuXHRcdFx0XHQkLmVhY2goIG5ld0VtYWlscywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9IG5leHRFbWFpbENvdW50ICsgaW5kZXg7XG5cdFx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5hcHBlbmQoICc8bGkgaWQ9XCJ1c2VyLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIj4nICsgdmFsdWUgKyAnPHVsIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS11c2VyLWVtYWlsLWFjdGlvbnNcIj48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtbWFrZS1wcmltYXJ5LWVtYWlsXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJwcmltYXJ5X2VtYWlsXCIgaWQ9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPk1ha2UgUHJpbWFyeTwvc21hbGw+PC9sYWJlbD48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1lbWFpbC1wcmVmZXJlbmNlc1wiPjxhIGhyZWY9XCIvbmV3c2xldHRlcnMvP2VtYWlsPScgKyBlbmNvZGVVUklDb21wb25lbnQoIHZhbHVlICkgKyAnXCI+PHNtYWxsPkVtYWlsIFByZWZlcmVuY2VzPC9zbWFsbD48L2E+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtcmVtb3ZlLWVtYWlsXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJyZW1vdmVfZW1haWxbJyArIG5leHRFbWFpbENvdW50ICsgJ11cIiBpZD1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPlJlbW92ZTwvc21hbGw+PC9sYWJlbD48L2xpPjwvdWw+PC9saT4nICk7XG5cdFx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoICQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCkgKyAnLCcgKyB2YWx1ZSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdCQoICcubS1mb3JtLWNoYW5nZS1lbWFpbCAuYS1pbnB1dC13aXRoLWJ1dHRvbicgKS5yZW1vdmUoKTtcblx0XHRcdFx0aWYgKCAwID09PSAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKSAhPT0gJCggJ2lucHV0W25hbWU9XCJlbWFpbFwiXScgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gaXQgd291bGQgYmUgbmljZSB0byBvbmx5IGxvYWQgdGhlIGZvcm0sIGJ1dCB0aGVuIGNsaWNrIGV2ZW50cyBzdGlsbCBkb24ndCB3b3JrXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cdH0gKTtcbn1cblxuZnVuY3Rpb24gYWRkQXV0b1Jlc2l6ZSgpIHtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJ1tkYXRhLWF1dG9yZXNpemVdJyApLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdGVsZW1lbnQuc3R5bGUuYm94U2l6aW5nID0gJ2JvcmRlci1ib3gnO1xuXHRcdHZhciBvZmZzZXQgPSBlbGVtZW50Lm9mZnNldEhlaWdodCAtIGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuXHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQudGFyZ2V0LnN0eWxlLmhlaWdodCA9ICdhdXRvJztcblx0XHRcdGV2ZW50LnRhcmdldC5zdHlsZS5oZWlnaHQgPSBldmVudC50YXJnZXQuc2Nyb2xsSGVpZ2h0ICsgb2Zmc2V0ICsgJ3B4Jztcblx0XHR9ICk7XG5cdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoICdkYXRhLWF1dG9yZXNpemUnICk7XG5cdH0gKTtcbn1cblxuJCggZG9jdW1lbnQgKS5hamF4U3RvcCggZnVuY3Rpb24oKSB7XG5cdHZhciBjb21tZW50QXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcjbGxjX2NvbW1lbnRzJyApO1xuXHRpZiAoIG51bGwgIT09IGNvbW1lbnRBcmVhICkge1xuXHRcdGFkZEF1dG9SZXNpemUoKTtcblx0fVxufSApO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIDAgPCAkKCAnLm0tZm9ybS1hY2NvdW50LXNldHRpbmdzJyApLmxlbmd0aCApIHtcblx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0fVxuXHR2YXIgYXV0b1Jlc2l6ZVRleHRhcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ1tkYXRhLWF1dG9yZXNpemVdJyApO1xuXHRpZiAoIG51bGwgIT09IGF1dG9SZXNpemVUZXh0YXJlYSApIHtcblx0XHRhZGRBdXRvUmVzaXplKCk7XG5cdH1cbn0gKTtcblxudmFyIGZvcm1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWZvcm0nICk7XG5mb3Jtcy5mb3JFYWNoKCBmdW5jdGlvbiggZm9ybSApIHtcblx0VmFsaWRGb3JtKCBmb3JtLCB7XG5cdFx0dmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3M6ICdtLWhhcy12YWxpZGF0aW9uLWVycm9yJyxcblx0XHR2YWxpZGF0aW9uRXJyb3JDbGFzczogJ2EtdmFsaWRhdGlvbi1lcnJvcicsXG5cdFx0aW52YWxpZENsYXNzOiAnYS1lcnJvcicsXG5cdFx0ZXJyb3JQbGFjZW1lbnQ6ICdhZnRlcidcblx0fSApO1xufSApO1xuXG52YXIgZm9ybSA9ICQoICcubS1mb3JtJyApO1xuXG4vLyBsaXN0ZW4gZm9yIGBpbnZhbGlkYCBldmVudHMgb24gYWxsIGZvcm0gaW5wdXRzXG5mb3JtLmZpbmQoICc6aW5wdXQnICkub24oICdpbnZhbGlkJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGlucHV0ID0gJCggdGhpcyApO1xuXG4gICAgLy8gdGhlIGZpcnN0IGludmFsaWQgZWxlbWVudCBpbiB0aGUgZm9ybVxuXHR2YXIgZmlyc3QgPSBmb3JtLmZpbmQoICcuYS1lcnJvcicgKS5maXJzdCgpO1xuXG5cdC8vIHRoZSBmb3JtIGl0ZW0gdGhhdCBjb250YWlucyBpdFxuXHR2YXIgZmlyc3RfaG9sZGVyID0gZmlyc3QucGFyZW50KCk7XG5cbiAgICAvLyBvbmx5IGhhbmRsZSBpZiB0aGlzIGlzIHRoZSBmaXJzdCBpbnZhbGlkIGlucHV0XG4gICAgaWYgKCBpbnB1dFswXSA9PT0gZmlyc3RbMF0gKSB7XG5cbiAgICAgICAgLy8gaGVpZ2h0IG9mIHRoZSBuYXYgYmFyIHBsdXMgc29tZSBwYWRkaW5nIGlmIHRoZXJlJ3MgYSBmaXhlZCBuYXZcbiAgICAgICAgLy92YXIgbmF2YmFySGVpZ2h0ID0gbmF2YmFyLmhlaWdodCgpICsgNTBcblxuICAgICAgICAvLyB0aGUgcG9zaXRpb24gdG8gc2Nyb2xsIHRvIChhY2NvdW50aW5nIGZvciB0aGUgbmF2YmFyIGlmIGl0IGV4aXN0cylcbiAgICAgICAgdmFyIGVsZW1lbnRPZmZzZXQgPSBmaXJzdF9ob2xkZXIub2Zmc2V0KCkudG9wO1xuXG4gICAgICAgIC8vIHRoZSBjdXJyZW50IHNjcm9sbCBwb3NpdGlvbiAoYWNjb3VudGluZyBmb3IgdGhlIG5hdmJhcilcbiAgICAgICAgdmFyIHBhZ2VPZmZzZXQgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cbiAgICAgICAgLy8gZG9uJ3Qgc2Nyb2xsIGlmIHRoZSBlbGVtZW50IGlzIGFscmVhZHkgaW4gdmlld1xuICAgICAgICBpZiAoIGVsZW1lbnRPZmZzZXQgPiBwYWdlT2Zmc2V0ICYmIGVsZW1lbnRPZmZzZXQgPCBwYWdlT2Zmc2V0ICsgd2luZG93LmlubmVySGVpZ2h0ICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBub3RlOiBhdm9pZCB1c2luZyBhbmltYXRlLCBhcyBpdCBwcmV2ZW50cyB0aGUgdmFsaWRhdGlvbiBtZXNzYWdlIGRpc3BsYXlpbmcgY29ycmVjdGx5XG4gICAgICAgICQoICdodG1sLCBib2R5JyApLnNjcm9sbFRvcCggZWxlbWVudE9mZnNldCApO1xuICAgIH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgY29tbWVudHNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuLy8gYmFzZWQgb24gd2hpY2ggYnV0dG9uIHdhcyBjbGlja2VkLCBzZXQgdGhlIHZhbHVlcyBmb3IgdGhlIGFuYWx5dGljcyBldmVudCBhbmQgY3JlYXRlIGl0XG5mdW5jdGlvbiB0cmFja1Nob3dDb21tZW50cyggYWx3YXlzLCBpZCwgY2xpY2tWYWx1ZSApIHtcblx0dmFyIGFjdGlvbiAgICAgICAgICA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlQcmVmaXggPSAnJztcblx0dmFyIGNhdGVnb3J5U3VmZml4ID0gJyc7XG5cdHZhciBwb3NpdGlvbiAgICAgICAgPSAnJztcblx0cG9zaXRpb24gPSBpZC5yZXBsYWNlKCAnYWx3YXlzLXNob3ctY29tbWVudHMtJywgJycgKTtcblx0aWYgKCAnMScgPT09IGNsaWNrVmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09uJztcblx0fSBlbHNlIGlmICggJzAnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPZmYnO1xuXHR9IGVsc2Uge1xuXHRcdGFjdGlvbiA9ICdDbGljayc7XG5cdH1cblx0aWYgKCB0cnVlID09PSBhbHdheXMgKSB7XG5cdFx0Y2F0ZWdvcnlQcmVmaXggPSAnQWx3YXlzICc7XG5cdH1cblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbi5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgcG9zaXRpb24uc2xpY2UoIDEgKTtcblx0XHRjYXRlZ29yeVN1ZmZpeCA9ICcgLSAnICsgcG9zaXRpb247XG5cdH1cblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeVByZWZpeCArICdTaG93IENvbW1lbnRzJyArIGNhdGVnb3J5U3VmZml4LCBhY3Rpb24sIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59XG5cbi8vIHdoZW4gc2hvd2luZyBjb21tZW50cyBvbmNlLCB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1idXR0b24tc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR0cmFja1Nob3dDb21tZW50cyggZmFsc2UsICcnLCAnJyApO1xufSApO1xuXG4vLyBTZXQgdXNlciBtZXRhIHZhbHVlIGZvciBhbHdheXMgc2hvd2luZyBjb21tZW50cyBpZiB0aGF0IGJ1dHRvbiBpcyBjbGlja2VkXG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dmFyIHRoYXQgPSAkKCB0aGlzICk7XG5cdGlmICggdGhhdC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0fSBlbHNlIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHR9XG5cblx0Ly8gdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCB0cnVlLCB0aGF0LmF0dHIoICdpZCcgKSwgdGhhdC52YWwoKSApO1xuXG5cdC8vIHdlIGFscmVhZHkgaGF2ZSBhamF4dXJsIGZyb20gdGhlIHRoZW1lXG5cdCQuYWpheCgge1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHR1cmw6IHBhcmFtcy5hamF4dXJsLFxuXHRcdGRhdGE6IHtcblx0XHRcdCdhY3Rpb24nOiAnbWlubnBvc3RfbGFyZ29fbG9hZF9jb21tZW50c19zZXRfdXNlcl9tZXRhJyxcblx0XHRcdCd2YWx1ZSc6IHRoYXQudmFsKClcblx0XHR9LFxuXHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdCQoICcuYS1hbHdheXMtc2hvdy1jb21tZW50cy1yZXN1bHQnLCB0aGF0LnBhcmVudCgpICkuaHRtbCggcmVzcG9uc2UuZGF0YS5tZXNzYWdlICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IHJlc3BvbnNlLmRhdGEuc2hvdyApIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufSApO1xuXG4hICggZnVuY3Rpb24oIGQgKSB7XG5cdGlmICggISBkLmN1cnJlbnRTY3JpcHQgKSB7XG5cdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRhY3Rpb246ICdsbGNfbG9hZF9jb21tZW50cycsXG5cdFx0XHRwb3N0OiAkKCAnI2xsY19wb3N0X2lkJyApLnZhbCgpXG5cdFx0fTtcblxuXHRcdC8vIEFqYXggcmVxdWVzdCBsaW5rLlxuXHRcdHZhciBsbGNhamF4dXJsID0gJCggJyNsbGNfYWpheF91cmwnICkudmFsKCk7XG5cblx0XHQvLyBGdWxsIHVybCB0byBnZXQgY29tbWVudHMgKEFkZGluZyBwYXJhbWV0ZXJzKS5cblx0XHR2YXIgY29tbWVudFVybCA9IGxsY2FqYXh1cmwgKyAnPycgKyAkLnBhcmFtKCBkYXRhICk7XG5cblx0XHQvLyBQZXJmb3JtIGFqYXggcmVxdWVzdC5cblx0XHQkLmdldCggY29tbWVudFVybCwgZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0aWYgKCAnJyAhPT0gcmVzcG9uc2UgKSB7XG5cdFx0XHRcdCQoICcjbGxjX2NvbW1lbnRzJyApLmh0bWwoIHJlc3BvbnNlICk7XG5cblx0XHRcdFx0Ly8gSW5pdGlhbGl6ZSBjb21tZW50cyBhZnRlciBsYXp5IGxvYWRpbmcuXG5cdFx0XHRcdGlmICggd2luZG93LmFkZENvbW1lbnQgJiYgd2luZG93LmFkZENvbW1lbnQuaW5pdCApIHtcblx0XHRcdFx0XHR3aW5kb3cuYWRkQ29tbWVudC5pbml0KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBHZXQgdGhlIGNvbW1lbnQgbGkgaWQgZnJvbSB1cmwgaWYgZXhpc3QuXG5cdFx0XHRcdHZhciBjb21tZW50SWQgPSBkb2N1bWVudC5VUkwuc3Vic3RyKCBkb2N1bWVudC5VUkwuaW5kZXhPZiggJyNjb21tZW50JyApICk7XG5cblx0XHRcdFx0Ly8gSWYgY29tbWVudCBpZCBmb3VuZCwgc2Nyb2xsIHRvIHRoYXQgY29tbWVudC5cblx0XHRcdFx0aWYgKCAtMSA8IGNvbW1lbnRJZC5pbmRleE9mKCAnI2NvbW1lbnQnICkgKSB7XG5cdFx0XHRcdFx0JCggd2luZG93ICkuc2Nyb2xsVG9wKCAkKCBjb21tZW50SWQgKS5vZmZzZXQoKS50b3AgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxufSggZG9jdW1lbnQgKSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBldmVudHNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbmNvbnN0IHRhcmdldHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLmEtZXZlbnRzLWNhbC1saW5rcycgKTtcbnRhcmdldHMuZm9yRWFjaCggZnVuY3Rpb24oIHRhcmdldCApIHtcbiAgICBzZXRDYWxlbmRhciggdGFyZ2V0ICk7XG59KTtcblxuZnVuY3Rpb24gc2V0Q2FsZW5kYXIoIHRhcmdldCApIHtcbiAgICBpZiAoIG51bGwgIT09IHRhcmdldCApIHtcbiAgICAgICAgdmFyIGxpICAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdsaScgKTtcbiAgICAgICAgbGkuaW5uZXJIVE1MICA9ICc8YSBocmVmPVwiI1wiIGNsYXNzPVwiYS1jbG9zZS1idXR0b24gYS1jbG9zZS1jYWxlbmRhclwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuICAgICAgICB2YXIgZnJhZ21lbnQgID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBsaS5zZXRBdHRyaWJ1dGUoICdjbGFzcycsICdhLWNsb3NlLWhvbGRlcicgKTtcbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGxpICk7XG4gICAgICAgIHRhcmdldC5hcHBlbmRDaGlsZCggZnJhZ21lbnQgKTtcbiAgICB9XG59XG5cbmNvbnN0IGNhbGVuZGFyc1Zpc2libGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZXZlbnQtZGF0ZXRpbWUgYScgKTtcbmNhbGVuZGFyc1Zpc2libGUuZm9yRWFjaCggZnVuY3Rpb24oIGNhbGVuZGFyVmlzaWJsZSApIHtcbiAgICBzaG93Q2FsZW5kYXIoIGNhbGVuZGFyVmlzaWJsZSApO1xufSk7XG5cbmZ1bmN0aW9uIHNob3dDYWxlbmRhciggY2FsZW5kYXJWaXNpYmxlICkge1xuICAgIGNvbnN0IGRhdGVIb2xkZXIgPSBjYWxlbmRhclZpc2libGUuY2xvc2VzdCggJy5tLWV2ZW50LWRhdGUtYW5kLWNhbGVuZGFyJyApO1xuICAgIGNvbnN0IGNhbGVuZGFyVHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcbiAgICAgICAgZWxlbWVudDogZGF0ZUhvbGRlci5xdWVyeVNlbGVjdG9yKCAnLmEtZXZlbnRzLWNhbC1saW5rcycgKSxcbiAgICAgICAgdmlzaWJsZUNsYXNzOiAnYS1ldmVudHMtY2FsLWxpbmstdmlzaWJsZScsXG4gICAgICAgIGRpc3BsYXlWYWx1ZTogJ2Jsb2NrJ1xuICAgIH0gKTtcblxuICAgIGlmICggbnVsbCAhPT0gY2FsZW5kYXJWaXNpYmxlICkge1xuICAgICAgICBjYWxlbmRhclZpc2libGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IGNhbGVuZGFyVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuICAgICAgICAgICAgY2FsZW5kYXJWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgICAgICAgICBpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKTtcblxuICAgICAgICB2YXIgY2FsZW5kYXJDbG9zZSA9IGRhdGVIb2xkZXIucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLWNhbGVuZGFyJyApO1xuICAgICAgICBjYWxlbmRhckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBjYWxlbmRhclZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcbiAgICAgICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICAgICAgaWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcbiAgICAgICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ICk7XG4gICAgfVxufVxuIl19
}(jQuery));
