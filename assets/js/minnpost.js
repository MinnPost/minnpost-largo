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
  }

  // Don't wait for exit transitions if a user prefers reduced motion.
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
      }

      // Add this class to trigger our animation
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
  var timeout;

  // Sets overflow and toggle buttons accordingly
  var setOverflow = function setOverflow() {
    scrollOverflow = getOverflow();
    toggleButtons(scrollOverflow);
    calculateScrollStep();
  };

  // Debounce setting the overflow with requestAnimationFrame
  var requestSetOverflow = function requestSetOverflow() {
    if (timeout) window.cancelAnimationFrame(timeout);
    timeout = window.requestAnimationFrame(function () {
      setOverflow();
    });
  };

  // Gets the overflow available on the nav scroller
  var getOverflow = function getOverflow() {
    var scrollWidth = navScrollerNav.scrollWidth;
    var scrollViewport = navScrollerNav.clientWidth;
    var scrollLeft = navScrollerNav.scrollLeft;
    scrollAvailableLeft = scrollLeft;
    scrollAvailableRight = scrollWidth - (scrollViewport + scrollLeft);

    // 1 instead of 0 to compensate for number rounding
    var scrollLeftCondition = scrollAvailableLeft > 1;
    var scrollRightCondition = scrollAvailableRight > 1;

    // console.log(scrollWidth, scrollViewport, scrollAvailableLeft, scrollAvailableRight);

    if (scrollLeftCondition && scrollRightCondition) {
      return 'both';
    } else if (scrollLeftCondition) {
      return 'left';
    } else if (scrollRightCondition) {
      return 'right';
    } else {
      return 'none';
    }
  };

  // Calculates the scroll step based on the width of the scroller and the number of links
  var calculateScrollStep = function calculateScrollStep() {
    if (scrollStep === 'average') {
      var scrollViewportNoPadding = navScrollerNav.scrollWidth - (parseInt(getComputedStyle(navScrollerContent).getPropertyValue('padding-left')) + parseInt(getComputedStyle(navScrollerContent).getPropertyValue('padding-right')));
      var scrollStepAverage = Math.floor(scrollViewportNoPadding / navScrollerContentItems.length);
      scrollStep = scrollStepAverage;
    }
  };

  // Move the scroller with a transform
  var moveScroller = function moveScroller(direction) {
    if (scrolling === true || scrollOverflow !== direction && scrollOverflow !== 'both') return;
    var scrollDistance = scrollStep;
    var scrollAvailable = direction === 'left' ? scrollAvailableLeft : scrollAvailableRight;

    // If there will be less than 25% of the last step visible then scroll to the end
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
  };

  // Set the scroller position and removes transform, called after moveScroller() in the transitionend event
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
  };

  // Toggle buttons depending on overflow
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
  };

  // Self init
  init();

  // Reveal API
  return {
    init: init
  };
};

//export default PriorityNavScroller;
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

/*
 * Call hooks from other places.
 * This allows other plugins that we maintain to pass data to the theme's analytics method.
*/
if ('undefined' !== typeof wp) {
  wp.hooks.addAction('wpMessageInserterAnalyticsEvent', 'minnpostLargo', mpAnalyticsTrackingEvent, 10);
  wp.hooks.addAction('minnpostFormProcessorMailchimpAnalyticsEvent', 'minnpostLargo', mpAnalyticsTrackingEvent, 10);
  wp.hooks.addAction('minnpostMembershipAnalyticsEvent', 'minnpostLargo', mpAnalyticsTrackingEvent, 10);
  wp.hooks.addAction('minnpostMembershipAnalyticsEcommerceAction', 'minnpostLargo', mpAnalyticsTrackingEcommerceAction, 10);
}

/*
 * Create a Google Analytics event for the theme. This calls the wp-analytics-tracking-generator action.
 * type: generally this is "event"
 * category: Event Category
 * label: Event Label
 * action: Event Action
 * value: optional
 * non_interaction: optional
*/
function mpAnalyticsTrackingEvent(type, category, action, label, value, non_interaction) {
  wp.hooks.doAction('wpAnalyticsTrackingGeneratorEvent', type, category, action, label, value, non_interaction);
}

/*
 * Create a Google Analytics Ecommerce action for the theme. This calls the wp-analytics-tracking-generator action.
 *
*/
function mpAnalyticsTrackingEcommerceAction(type, action, product, step) {
  wp.hooks.doAction('wpAnalyticsTrackingGeneratorEcommerceAction', type, action, product, step);
}

/*
 * When a part of the website is member-specific, create an event for whether it was shown or not.
*/
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
  }

  // track as an event
  mpAnalyticsTrackingEvent('event', category, text, location.pathname);
}

// top share button click
document.querySelectorAll('.m-entry-share-top a').forEach(function (topButton) {
  return topButton.addEventListener('click', function (e) {
    var text = e.currentTarget.getAttribute('data-share-action');
    var position = 'top';
    trackShare(text, position);
  });
});

// when the print button is clicked
document.querySelectorAll('.m-entry-share .a-share-print a').forEach(function (printButton) {
  return printButton.addEventListener('click', function (e) {
    e.preventDefault();
    window.print();
  });
});

// when the republish button is clicked
// the plugin controls the rest, but we need to make sure the default event doesn't fire
document.querySelectorAll('.m-entry-share .a-share-republish a').forEach(function (republishButton) {
  return republishButton.addEventListener('click', function (e) {
    e.preventDefault();
  });
});

// when the copy link button is clicked
document.querySelectorAll('.m-entry-share .a-share-copy-url a').forEach(function (copyButton) {
  return copyButton.addEventListener('click', function (e) {
    e.preventDefault();
    var copyText = window.location.href;
    navigator.clipboard.writeText(copyText).then(function () {
      tlite.show(e.target, {
        grav: 'w'
      });
      setTimeout(function () {
        tlite.hide(e.target);
      }, 3000);
    });
  });
});

// when sharing via facebook, twitter, or email, open the destination url in a new window
document.querySelectorAll('.m-entry-share .a-share-facebook a, .m-entry-share .a-share-twitter a, .m-entry-share .a-share-email a').forEach(function (anyShareButton) {
  return anyShareButton.addEventListener('click', function (e) {
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
 * This file does require jQuery in the functions at the bottom.
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
  }
  document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ('key' in evt) {
      isEscape = 'Escape' === evt.key || 'Esc' === evt.key;
    } else {
      isEscape = 27 === evt.keyCode;
    }
    if (isEscape) {
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
  };
}
setupPrimaryNav(); // this whole function does not require jquery.

function setupScrollNav() {
  var subNavScrollers = document.querySelectorAll('.m-sub-navigation');
  subNavScrollers.forEach(function (currentValue) {
    PriorityNavScroller({
      selector: currentValue,
      navSelector: '.m-subnav-navigation',
      contentSelector: '.m-menu-sub-navigation',
      itemSelector: 'li, a',
      buttonLeftSelector: '.nav-scroller-btn--left',
      buttonRightSelector: '.nav-scroller-btn--right'
    });
  });
  var paginationScrollers = document.querySelectorAll('.m-pagination-navigation');
  paginationScrollers.forEach(function (currentValue) {
    PriorityNavScroller({
      selector: currentValue,
      navSelector: '.m-pagination-container',
      contentSelector: '.m-pagination-list',
      itemSelector: 'li, a',
      buttonLeftSelector: '.nav-scroller-btn--left',
      buttonRightSelector: '.nav-scroller-btn--right'
    });
  });
}
setupScrollNav(); // this whole function does not require jquery.

// this is the part that requires jquery.
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
  var that = '';

  // start out with no primary/removals checked
  $('.a-form-caption.a-make-primary-email input[type="radio"]').prop('checked', false);
  $('.a-form-caption.a-remove-email input[type="checkbox"]').prop('checked', false);

  // if there is a list of emails (not just a single form field)
  if (0 < $('.m-user-email-list').length) {
    nextEmailCount = $('.m-user-email-list > li').length;

    // if a user selects a new primary, move it into that position
    $('.m-user-email-list').on('click', '.a-form-caption.a-make-primary-email input[type="radio"]', function () {
      newPrimaryEmail = $(this).val();
      oldPrimaryEmail = $('#email').val();
      primaryId = $(this).prop('id').replace('primary_email_', '');
      confirmChange = getConfirmChangeMarkup('primary-change');

      // get or don't get confirmation from user
      that = $(this).parent().parent();
      $('.a-pre-confirm', that).hide();
      $('.a-form-confirm', that).show();
      $(this).parent().parent().addClass('a-pre-confirm');
      $(this).parent().parent().removeClass('a-stop-confirm');

      //$( this ).parent().after( confirmChange );
      $(this).parent().parent().append(confirmChange);
      $('.m-user-email-list').on('click', '#a-confirm-primary-change', function (event) {
        event.preventDefault();

        // change the user facing values
        $('.m-user-email-list > li').textNodes().first().replaceWith(newPrimaryEmail);
        $('#user-email-' + primaryId).textNodes().first().replaceWith(oldPrimaryEmail);

        // change the main hidden form value
        $('#email').val(newPrimaryEmail);

        // submit form values.
        form.submit();

        // uncheck the radio button
        $('.a-form-caption.a-make-primary-email input[type="radio"]').prop('checked', false);

        // change the form values to the old primary email
        $('#primary_email_' + primaryId).val(oldPrimaryEmail);
        $('#remove_email_' + primaryId).val(oldPrimaryEmail);

        // remove the confirm message
        $('.a-form-confirm', that.parent()).remove();
        $('.a-pre-confirm', that.parent()).show();
      });
      $('.m-user-email-list').on('click', '#a-stop-primary-change', function (event) {
        event.preventDefault();
        $('.a-pre-confirm', that.parent()).show();
        $('.a-form-confirm', that.parent()).remove();
      });
    });

    // if a user removes an email, take it away from the visual and from the form
    $('.m-user-email-list').on('change', '.a-form-caption.a-remove-email input[type="checkbox"]', function () {
      emailToRemove = $(this).val();
      confirmChange = getConfirmChangeMarkup('removal');
      $('.m-user-email-list > li').each(function () {
        if ($(this).contents().get(0).nodeValue !== emailToRemove) {
          consolidatedEmails.push($(this).contents().get(0).nodeValue);
        }
      });

      // get or don't get confirmation from user for removal
      that = $(this).parent().parent();
      $('.a-pre-confirm', that).hide();
      $('.a-form-confirm', that).show();
      $(this).parent().parent().addClass('a-pre-confirm');
      $(this).parent().parent().removeClass('a-stop-confirm');
      $(this).parent().parent().append(confirmChange);

      // if confirmed, remove the email and submit the form
      $('.m-user-email-list').on('click', '#a-confirm-removal', function (event) {
        event.preventDefault();
        $(this).parents('li').fadeOut('normal', function () {
          $(this).remove();
        });
        $('#_consolidated_emails').val(consolidatedEmails.join(','));

        //console.log( 'value is ' + consolidatedEmails.join( ',' ) );
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
  }

  // if a user wants to add an email, give them a properly numbered field
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
    var submittingButton = form.data('submitting_button') || '';

    // if there is no submitting button, pass it by Ajax
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
var form = $('.m-form');

// listen for `invalid` events on all form inputs
form.find(':input').on('invalid', function () {
  var input = $(this);

  // the first invalid element in the form
  var first = form.find('.a-error').first();

  // the form item that contains it
  var first_holder = first.parent();

  // only handle if this is the first invalid input
  if (input[0] === first[0]) {
    // height of the nav bar plus some padding if there's a fixed nav
    //var navbarHeight = navbar.height() + 50

    // the position to scroll to (accounting for the navbar if it exists)
    var elementOffset = first_holder.offset().top;

    // the current scroll position (accounting for the navbar)
    var pageOffset = window.pageYOffset;

    // don't scroll if the element is already in view
    if (elementOffset > pageOffset && elementOffset < pageOffset + window.innerHeight) {
      return true;
    }

    // note: avoid using animate, as it prevents the validation message displaying correctly
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
}

// when showing comments once, track it as an analytics event
$(document).on('click', '.a-button-show-comments', function () {
  trackShowComments(false, '', '');
});

// Set user meta value for always showing comments if that button is clicked
$(document).on('click', '.a-checkbox-always-show-comments', function () {
  var that = $(this);
  if (that.is(':checked')) {
    $('.a-checkbox-always-show-comments').prop('checked', true);
  } else {
    $('.a-checkbox-always-show-comments').prop('checked', false);
  }

  // track it as an analytics event
  trackShowComments(true, that.attr('id'), that.val());

  // we already have ajaxurl from the theme
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
    };

    // Ajax request link.
    var llcajaxurl = $('#llc_ajax_url').val();

    // Full url to get comments (Adding parameters).
    var commentUrl = llcajaxurl + '?' + $.param(data);

    // Perform ajax request.
    $.get(commentUrl, function (response) {
      if ('' !== response) {
        $('#llc_comments').html(response);

        // Initialize comments after lazy loading.
        if (window.addComment && window.addComment.init) {
          window.addComment.init();
        }

        // Get the comment li id from url if exist.
        var commentId = document.URL.substr(document.URL.indexOf('#comment'));

        // If comment id found, scroll to that comment.
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
    if (null !== calendarClose) {
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
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDQtdmFsaWQtZm9ybS5taW4uanMiLCIwMC1zdGFydC5qcyIsIjAxLWFuYWx5dGljcy5qcyIsIjAyLXNoYXJlLmpzIiwiMDMtbmF2aWdhdGlvbi5qcyIsIjA0LWZvcm1zLmpzIiwiMDUtY29tbWVudHMuanMiLCIwNi1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImMiLCJyZXF1aXJlIiwidSIsImNvZGUiLCJwIiwiY2FsbCIsIl92YWxpZEZvcm0iLCJfdmFsaWRGb3JtMiIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIlZhbGlkRm9ybSIsInRvZ2dsZUludmFsaWRDbGFzcyIsImhhbmRsZUN1c3RvbU1lc3NhZ2VzIiwiaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiY2xvbmUiLCJkZWZhdWx0cyIsImluc2VydEFmdGVyIiwiaW5zZXJ0QmVmb3JlIiwiZm9yRWFjaCIsImRlYm91bmNlIiwiY29weSIsImF0dHIiLCJoYXNPd25Qcm9wZXJ0eSIsImRlZmF1bHRPYmplY3QiLCJrIiwicmVmTm9kZSIsIm5vZGVUb0luc2VydCIsInNpYmxpbmciLCJuZXh0U2libGluZyIsIl9wYXJlbnQiLCJwYXJlbnQiLCJpdGVtcyIsImZuIiwibXMiLCJkZWJvdW5jZWRGbiIsInZhbGlkRm9ybSIsIl91dGlsIiwiaW5wdXQiLCJpbnZhbGlkQ2xhc3MiLCJ2YWxpZGl0eSIsInZhbGlkIiwiZXJyb3JQcm9wcyIsImdldEN1c3RvbU1lc3NhZ2UiLCJjdXN0b21NZXNzYWdlcyIsImxvY2FsRXJyb3JQcm9wcyIsInR5cGUiLCJjb25jYXQiLCJwcm9wIiwiY2hlY2tWYWxpZGl0eSIsIm1lc3NhZ2UiLCJzZXRDdXN0b21WYWxpZGl0eSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uRXJyb3JDbGFzcyIsInZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzIiwiZXJyb3JQbGFjZW1lbnQiLCJpbnNlcnRFcnJvciIsImVycm9yTm9kZSIsInZhbGlkYXRpb25NZXNzYWdlIiwidGV4dENvbnRlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImRlZmF1bHRPcHRpb25zIiwibm9kZU5hbWUiLCJpbnB1dHMiLCJ0b0xvd2VyQ2FzZSIsImZvY3VzSW52YWxpZElucHV0IiwidmFsaWRGb3JtSW5wdXRzIiwiZm9ybSIsImZvY3VzRmlyc3QiLCJpbnZhbGlkTm9kZSIsImZvY3VzIiwiZG9jdW1lbnRFbGVtZW50Iiwid3AiLCJob29rcyIsImFkZEFjdGlvbiIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFY29tbWVyY2VBY3Rpb24iLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwibm9uX2ludGVyYWN0aW9uIiwiZG9BY3Rpb24iLCJwcm9kdWN0Iiwic3RlcCIsImV2ZW50IiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsInRvcEJ1dHRvbiIsImN1cnJlbnRUYXJnZXQiLCJwcmludEJ1dHRvbiIsInByaW50IiwicmVwdWJsaXNoQnV0dG9uIiwiY29weUJ1dHRvbiIsImNvcHlUZXh0IiwiaHJlZiIsIm5hdmlnYXRvciIsImNsaXBib2FyZCIsIndyaXRlVGV4dCIsInRoZW4iLCJhbnlTaGFyZUJ1dHRvbiIsInVybCIsIm9wZW4iLCJzZXR1cFByaW1hcnlOYXYiLCJwcmltYXJ5TmF2VHJhbnNpdGlvbmVyIiwicHJpbWFyeU5hdlRvZ2dsZSIsImV4cGFuZGVkIiwidXNlck5hdlRyYW5zaXRpb25lciIsInVzZXJOYXZUb2dnbGUiLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCJvbmtleWRvd24iLCJldnQiLCJpc0VzY2FwZSIsImtleSIsImtleUNvZGUiLCJwcmltYXJ5TmF2RXhwYW5kZWQiLCJ1c2VyTmF2RXhwYW5kZWQiLCJzZWFyY2hJc1Zpc2libGUiLCJzZXR1cFNjcm9sbE5hdiIsInN1Yk5hdlNjcm9sbGVycyIsImN1cnJlbnRWYWx1ZSIsInBhZ2luYXRpb25TY3JvbGxlcnMiLCIkIiwiY2xpY2siLCJ3aWRnZXRUaXRsZSIsImNsb3Nlc3QiLCJmaW5kIiwiem9uZVRpdGxlIiwic2lkZWJhclNlY3Rpb25UaXRsZSIsImpRdWVyeSIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwidHJpbSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJyZXN0Um9vdCIsInVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QiLCJzaXRlX3VybCIsInJlc3RfbmFtZXNwYWNlIiwiZnVsbFVybCIsImNvbmZpcm1DaGFuZ2UiLCJuZXh0RW1haWxDb3VudCIsIm5ld1ByaW1hcnlFbWFpbCIsIm9sZFByaW1hcnlFbWFpbCIsInByaW1hcnlJZCIsImVtYWlsVG9SZW1vdmUiLCJjb25zb2xpZGF0ZWRFbWFpbHMiLCJuZXdFbWFpbHMiLCJhamF4Rm9ybURhdGEiLCJ0aGF0Iiwib24iLCJ2YWwiLCJyZXBsYWNlIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFwcGVuZCIsImZpcnN0IiwicmVwbGFjZVdpdGgiLCJzdWJtaXQiLCJlYWNoIiwiZ2V0IiwicHVzaCIsInBhcmVudHMiLCJmYWRlT3V0Iiwiam9pbiIsImJlZm9yZSIsImJ1dHRvbiIsImJ1dHRvbkZvcm0iLCJkYXRhIiwic3VibWl0dGluZ0J1dHRvbiIsInNlcmlhbGl6ZSIsImFqYXgiLCJiZWZvcmVTZW5kIiwieGhyIiwic2V0UmVxdWVzdEhlYWRlciIsIm5vbmNlIiwiZGF0YVR5cGUiLCJkb25lIiwibWFwIiwiaW5kZXgiLCJlbmNvZGVVUklDb21wb25lbnQiLCJyZWxvYWQiLCJhZGRBdXRvUmVzaXplIiwiYm94U2l6aW5nIiwib2Zmc2V0IiwiY2xpZW50SGVpZ2h0IiwiaGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0IiwiYWpheFN0b3AiLCJjb21tZW50QXJlYSIsImF1dG9SZXNpemVUZXh0YXJlYSIsImZvcm1zIiwiZmlyc3RfaG9sZGVyIiwiZWxlbWVudE9mZnNldCIsInBhZ2VPZmZzZXQiLCJwYWdlWU9mZnNldCIsInNjcm9sbFRvcCIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiaWQiLCJjbGlja1ZhbHVlIiwiY2F0ZWdvcnlQcmVmaXgiLCJjYXRlZ29yeVN1ZmZpeCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJpcyIsInBhcmFtcyIsImFqYXh1cmwiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJodG1sIiwiY3VycmVudFNjcmlwdCIsInBvc3QiLCJsbGNhamF4dXJsIiwiY29tbWVudFVybCIsInBhcmFtIiwiYWRkQ29tbWVudCIsImNvbW1lbnRJZCIsIlVSTCIsInN1YnN0ciIsImluZGV4T2YiLCJ0YXJnZXRzIiwic2V0Q2FsZW5kYXIiLCJsaSIsImNhbGVuZGFyc1Zpc2libGUiLCJjYWxlbmRhclZpc2libGUiLCJzaG93Q2FsZW5kYXIiLCJkYXRlSG9sZGVyIiwiY2FsZW5kYXJUcmFuc2l0aW9uZXIiLCJjYWxlbmRhckNsb3NlIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLEtBQUssQ0FBQ0MsQ0FBQyxFQUFDO0VBQUNDLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsV0FBVyxFQUFDLFVBQVNDLENBQUMsRUFBQztJQUFDLElBQUlDLENBQUMsR0FBQ0QsQ0FBQyxDQUFDRSxNQUFNO01B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Y0FBYyxFQUFFO01BQ3pDO0lBQ0osQ0FBQyxDQUFFO0lBRUgsSUFBSWtVLGFBQWEsR0FBR0YsVUFBVSxDQUFDMVMsYUFBYSxDQUFFLG1CQUFtQixDQUFFO0lBQ25FLElBQUssSUFBSSxLQUFLNFMsYUFBYSxFQUFHO01BQzFCQSxhQUFhLENBQUMvWCxnQkFBZ0IsQ0FBRSxPQUFPLEVBQUUsVUFBVUMsQ0FBQyxFQUFHO1FBQ25EQSxDQUFDLENBQUNtTSxjQUFjLEVBQUU7UUFDbEIsSUFBSW9ELFFBQVEsR0FBRyxNQUFNLEtBQUttSSxlQUFlLENBQUNoVyxZQUFZLENBQUUsZUFBZSxDQUFFLElBQUksS0FBSztRQUNsRmdXLGVBQWUsQ0FBQ3RWLFlBQVksQ0FBRSxlQUFlLEVBQUUsQ0FBRW1OLFFBQVEsQ0FBRTtRQUMzRCxJQUFLLElBQUksS0FBS0EsUUFBUSxFQUFHO1VBQ3JCc0ksb0JBQW9CLENBQUM1VCxjQUFjLEVBQUU7UUFDekMsQ0FBQyxNQUFNO1VBQ0g0VCxvQkFBb0IsQ0FBQ2pVLGNBQWMsRUFBRTtRQUN6QztNQUNKLENBQUMsQ0FBRTtJQUNQO0VBQ0o7QUFDSiIsImZpbGUiOiJtaW5ucG9zdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHRsaXRlKHQpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIixmdW5jdGlvbihlKXt2YXIgaT1lLnRhcmdldCxuPXQoaSk7bnx8KG49KGk9aS5wYXJlbnRFbGVtZW50KSYmdChpKSksbiYmdGxpdGUuc2hvdyhpLG4sITApfSl9dGxpdGUuc2hvdz1mdW5jdGlvbih0LGUsaSl7dmFyIG49XCJkYXRhLXRsaXRlXCI7ZT1lfHx7fSwodC50b29sdGlwfHxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIG8oKXt0bGl0ZS5oaWRlKHQsITApfWZ1bmN0aW9uIGwoKXtyfHwocj1mdW5jdGlvbih0LGUsaSl7ZnVuY3Rpb24gbigpe28uY2xhc3NOYW1lPVwidGxpdGUgdGxpdGUtXCIrcitzO3ZhciBlPXQub2Zmc2V0VG9wLGk9dC5vZmZzZXRMZWZ0O28ub2Zmc2V0UGFyZW50PT09dCYmKGU9aT0wKTt2YXIgbj10Lm9mZnNldFdpZHRoLGw9dC5vZmZzZXRIZWlnaHQsZD1vLm9mZnNldEhlaWdodCxmPW8ub2Zmc2V0V2lkdGgsYT1pK24vMjtvLnN0eWxlLnRvcD0oXCJzXCI9PT1yP2UtZC0xMDpcIm5cIj09PXI/ZStsKzEwOmUrbC8yLWQvMikrXCJweFwiLG8uc3R5bGUubGVmdD0oXCJ3XCI9PT1zP2k6XCJlXCI9PT1zP2krbi1mOlwid1wiPT09cj9pK24rMTA6XCJlXCI9PT1yP2ktZi0xMDphLWYvMikrXCJweFwifXZhciBvPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpLGw9aS5ncmF2fHx0LmdldEF0dHJpYnV0ZShcImRhdGEtdGxpdGVcIil8fFwiblwiO28uaW5uZXJIVE1MPWUsdC5hcHBlbmRDaGlsZChvKTt2YXIgcj1sWzBdfHxcIlwiLHM9bFsxXXx8XCJcIjtuKCk7dmFyIGQ9by5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm5cInNcIj09PXImJmQudG9wPDA/KHI9XCJuXCIsbigpKTpcIm5cIj09PXImJmQuYm90dG9tPndpbmRvdy5pbm5lckhlaWdodD8ocj1cInNcIixuKCkpOlwiZVwiPT09ciYmZC5sZWZ0PDA/KHI9XCJ3XCIsbigpKTpcIndcIj09PXImJmQucmlnaHQ+d2luZG93LmlubmVyV2lkdGgmJihyPVwiZVwiLG4oKSksby5jbGFzc05hbWUrPVwiIHRsaXRlLXZpc2libGVcIixvfSh0LGQsZSkpfXZhciByLHMsZDtyZXR1cm4gdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsbyksdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLG8pLHQudG9vbHRpcD17c2hvdzpmdW5jdGlvbigpe2Q9dC50aXRsZXx8dC5nZXRBdHRyaWJ1dGUobil8fGQsdC50aXRsZT1cIlwiLHQuc2V0QXR0cmlidXRlKG4sXCJcIiksZCYmIXMmJihzPXNldFRpbWVvdXQobCxpPzE1MDoxKSl9LGhpZGU6ZnVuY3Rpb24odCl7aWYoaT09PXQpe3M9Y2xlYXJUaW1lb3V0KHMpO3ZhciBlPXImJnIucGFyZW50Tm9kZTtlJiZlLnJlbW92ZUNoaWxkKHIpLHI9dm9pZCAwfX19fSh0LGUpKS5zaG93KCl9LHRsaXRlLmhpZGU9ZnVuY3Rpb24odCxlKXt0LnRvb2x0aXAmJnQudG9vbHRpcC5oaWRlKGUpfSxcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmKG1vZHVsZS5leHBvcnRzPXRsaXRlKTsiLCIvKiogXG4gKiBMaWJyYXJ5IGNvZGVcbiAqIFVzaW5nIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL0BjbG91ZGZvdXIvdHJhbnNpdGlvbi1oaWRkZW4tZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KHtcbiAgZWxlbWVudCxcbiAgdmlzaWJsZUNsYXNzLFxuICB3YWl0TW9kZSA9ICd0cmFuc2l0aW9uZW5kJyxcbiAgdGltZW91dER1cmF0aW9uLFxuICBoaWRlTW9kZSA9ICdoaWRkZW4nLFxuICBkaXNwbGF5VmFsdWUgPSAnYmxvY2snXG59KSB7XG4gIGlmICh3YWl0TW9kZSA9PT0gJ3RpbWVvdXQnICYmIHR5cGVvZiB0aW1lb3V0RHVyYXRpb24gIT09ICdudW1iZXInKSB7XG4gICAgY29uc29sZS5lcnJvcihgXG4gICAgICBXaGVuIGNhbGxpbmcgdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQgd2l0aCB3YWl0TW9kZSBzZXQgdG8gdGltZW91dCxcbiAgICAgIHlvdSBtdXN0IHBhc3MgaW4gYSBudW1iZXIgZm9yIHRpbWVvdXREdXJhdGlvbi5cbiAgICBgKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIERvbid0IHdhaXQgZm9yIGV4aXQgdHJhbnNpdGlvbnMgaWYgYSB1c2VyIHByZWZlcnMgcmVkdWNlZCBtb3Rpb24uXG4gIC8vIElkZWFsbHkgdHJhbnNpdGlvbnMgd2lsbCBiZSBkaXNhYmxlZCBpbiBDU1MsIHdoaWNoIG1lYW5zIHdlIHNob3VsZCBub3Qgd2FpdFxuICAvLyBiZWZvcmUgYWRkaW5nIGBoaWRkZW5gLlxuICBpZiAod2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJykubWF0Y2hlcykge1xuICAgIHdhaXRNb2RlID0gJ2ltbWVkaWF0ZSc7XG4gIH1cblxuICAvKipcbiAgICogQW4gZXZlbnQgbGlzdGVuZXIgdG8gYWRkIGBoaWRkZW5gIGFmdGVyIG91ciBhbmltYXRpb25zIGNvbXBsZXRlLlxuICAgKiBUaGlzIGxpc3RlbmVyIHdpbGwgcmVtb3ZlIGl0c2VsZiBhZnRlciBjb21wbGV0aW5nLlxuICAgKi9cbiAgY29uc3QgbGlzdGVuZXIgPSBlID0+IHtcbiAgICAvLyBDb25maXJtIGB0cmFuc2l0aW9uZW5kYCB3YXMgY2FsbGVkIG9uICBvdXIgYGVsZW1lbnRgIGFuZCBkaWRuJ3QgYnViYmxlXG4gICAgLy8gdXAgZnJvbSBhIGNoaWxkIGVsZW1lbnQuXG4gICAgaWYgKGUudGFyZ2V0ID09PSBlbGVtZW50KSB7XG4gICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcblxuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhcHBseUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVtb3ZlSGlkZGVuQXR0cmlidXRlcyA9ICgpID0+IHtcbiAgICBpZihoaWRlTW9kZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5VmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC8qKlxuICAgICAqIFNob3cgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICB0cmFuc2l0aW9uU2hvdygpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhpcyBsaXN0ZW5lciBzaG91bGRuJ3QgYmUgaGVyZSBidXQgaWYgc29tZW9uZSBzcGFtcyB0aGUgdG9nZ2xlXG4gICAgICAgKiBvdmVyIGFuZCBvdmVyIHJlYWxseSBmYXN0IGl0IGNhbiBpbmNvcnJlY3RseSBzdGljayBhcm91bmQuXG4gICAgICAgKiBXZSByZW1vdmUgaXQganVzdCB0byBiZSBzYWZlLlxuICAgICAgICovXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG5cbiAgICAgIC8qKlxuICAgICAgICogU2ltaWxhcmx5LCB3ZSdsbCBjbGVhciB0aGUgdGltZW91dCBpbiBjYXNlIGl0J3Mgc3RpbGwgaGFuZ2luZyBhcm91bmQuXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgICB9XG5cbiAgICAgIHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMoKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBGb3JjZSBhIGJyb3dzZXIgcmUtcGFpbnQgc28gdGhlIGJyb3dzZXIgd2lsbCByZWFsaXplIHRoZVxuICAgICAgICogZWxlbWVudCBpcyBubyBsb25nZXIgYGhpZGRlbmAgYW5kIGFsbG93IHRyYW5zaXRpb25zLlxuICAgICAgICovXG4gICAgICBjb25zdCByZWZsb3cgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHZpc2libGVDbGFzcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEhpZGUgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICB0cmFuc2l0aW9uSGlkZSgpIHtcbiAgICAgIGlmICh3YWl0TW9kZSA9PT0gJ3RyYW5zaXRpb25lbmQnKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICAgIH0gZWxzZSBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0Jykge1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgICAgfSwgdGltZW91dER1cmF0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdGhpcyBjbGFzcyB0byB0cmlnZ2VyIG91ciBhbmltYXRpb25cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgdGhlIGVsZW1lbnQncyB2aXNpYmlsaXR5XG4gICAgICovXG4gICAgdG9nZ2xlKCkge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oKSkge1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRlbGwgd2hldGhlciB0aGUgZWxlbWVudCBpcyBoaWRkZW4gb3Igbm90LlxuICAgICAqL1xuICAgIGlzSGlkZGVuKCkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgaGlkZGVuIGF0dHJpYnV0ZSBkb2VzIG5vdCByZXF1aXJlIGEgdmFsdWUuIFNpbmNlIGFuIGVtcHR5IHN0cmluZyBpc1xuICAgICAgICogZmFsc3ksIGJ1dCBzaG93cyB0aGUgcHJlc2VuY2Ugb2YgYW4gYXR0cmlidXRlIHdlIGNvbXBhcmUgdG8gYG51bGxgXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IGhhc0hpZGRlbkF0dHJpYnV0ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdoaWRkZW4nKSAhPT0gbnVsbDtcblxuICAgICAgY29uc3QgaXNEaXNwbGF5Tm9uZSA9IGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnO1xuXG4gICAgICBjb25zdCBoYXNWaXNpYmxlQ2xhc3MgPSBbLi4uZWxlbWVudC5jbGFzc0xpc3RdLmluY2x1ZGVzKHZpc2libGVDbGFzcyk7XG5cbiAgICAgIHJldHVybiBoYXNIaWRkZW5BdHRyaWJ1dGUgfHwgaXNEaXNwbGF5Tm9uZSB8fCAhaGFzVmlzaWJsZUNsYXNzO1xuICAgIH0sXG5cbiAgICAvLyBBIHBsYWNlaG9sZGVyIGZvciBvdXIgYHRpbWVvdXRgXG4gICAgdGltZW91dDogbnVsbFxuICB9O1xufSIsIi8qKlxuICBQcmlvcml0eSsgaG9yaXpvbnRhbCBzY3JvbGxpbmcgbWVudS5cblxuICBAcGFyYW0ge09iamVjdH0gb2JqZWN0IC0gQ29udGFpbmVyIGZvciBhbGwgb3B0aW9ucy5cbiAgICBAcGFyYW0ge3N0cmluZyB8fCBET00gbm9kZX0gc2VsZWN0b3IgLSBFbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBuYXZTZWxlY3RvciAtIE5hdiBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50U2VsZWN0b3IgLSBDb250ZW50IGVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGl0ZW1TZWxlY3RvciAtIEl0ZW1zIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBidXR0b25MZWZ0U2VsZWN0b3IgLSBMZWZ0IGJ1dHRvbiBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uUmlnaHRTZWxlY3RvciAtIFJpZ2h0IGJ1dHRvbiBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge2ludGVnZXIgfHwgc3RyaW5nfSBzY3JvbGxTdGVwIC0gQW1vdW50IHRvIHNjcm9sbCBvbiBidXR0b24gY2xpY2suICdhdmVyYWdlJyBnZXRzIHRoZSBhdmVyYWdlIGxpbmsgd2lkdGguXG4qL1xuXG5jb25zdCBQcmlvcml0eU5hdlNjcm9sbGVyID0gZnVuY3Rpb24oe1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyJyxcbiAgICBuYXZTZWxlY3RvcjogbmF2U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1uYXYnLFxuICAgIGNvbnRlbnRTZWxlY3RvcjogY29udGVudFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItY29udGVudCcsXG4gICAgaXRlbVNlbGVjdG9yOiBpdGVtU2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1pdGVtJyxcbiAgICBidXR0b25MZWZ0U2VsZWN0b3I6IGJ1dHRvbkxlZnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWJ0bi0tbGVmdCcsXG4gICAgYnV0dG9uUmlnaHRTZWxlY3RvcjogYnV0dG9uUmlnaHRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWJ0bi0tcmlnaHQnLFxuICAgIHNjcm9sbFN0ZXA6IHNjcm9sbFN0ZXAgPSA4MFxuICB9ID0ge30pIHtcblxuICBjb25zdCBuYXZTY3JvbGxlciA9IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSA6IHNlbGVjdG9yO1xuXG4gIGNvbnN0IHZhbGlkYXRlU2Nyb2xsU3RlcCA9ICgpID0+IHtcbiAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihzY3JvbGxTdGVwKSB8fCBzY3JvbGxTdGVwID09PSAnYXZlcmFnZSc7XG4gIH1cblxuICBpZiAobmF2U2Nyb2xsZXIgPT09IHVuZGVmaW5lZCB8fCBuYXZTY3JvbGxlciA9PT0gbnVsbCB8fCAhdmFsaWRhdGVTY3JvbGxTdGVwKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGlzIHNvbWV0aGluZyB3cm9uZywgY2hlY2sgeW91ciBvcHRpb25zLicpO1xuICB9XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXJOYXYgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKG5hdlNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3Rvcihjb250ZW50U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckNvbnRlbnRJdGVtcyA9IG5hdlNjcm9sbGVyQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKGl0ZW1TZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyTGVmdCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoYnV0dG9uTGVmdFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJSaWdodCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoYnV0dG9uUmlnaHRTZWxlY3Rvcik7XG5cbiAgbGV0IHNjcm9sbGluZyA9IGZhbHNlO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IDA7XG4gIGxldCBzY3JvbGxBdmFpbGFibGVSaWdodCA9IDA7XG4gIGxldCBzY3JvbGxpbmdEaXJlY3Rpb24gPSAnJztcbiAgbGV0IHNjcm9sbE92ZXJmbG93ID0gJyc7XG4gIGxldCB0aW1lb3V0O1xuXG5cbiAgLy8gU2V0cyBvdmVyZmxvdyBhbmQgdG9nZ2xlIGJ1dHRvbnMgYWNjb3JkaW5nbHlcbiAgY29uc3Qgc2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBzY3JvbGxPdmVyZmxvdyA9IGdldE92ZXJmbG93KCk7XG4gICAgdG9nZ2xlQnV0dG9ucyhzY3JvbGxPdmVyZmxvdyk7XG4gICAgY2FsY3VsYXRlU2Nyb2xsU3RlcCgpO1xuICB9XG5cblxuICAvLyBEZWJvdW5jZSBzZXR0aW5nIHRoZSBvdmVyZmxvdyB3aXRoIHJlcXVlc3RBbmltYXRpb25GcmFtZVxuICBjb25zdCByZXF1ZXN0U2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGltZW91dCkgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRpbWVvdXQpO1xuXG4gICAgdGltZW91dCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgc2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgLy8gR2V0cyB0aGUgb3ZlcmZsb3cgYXZhaWxhYmxlIG9uIHRoZSBuYXYgc2Nyb2xsZXJcbiAgY29uc3QgZ2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgc2Nyb2xsV2lkdGggPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxXaWR0aDtcbiAgICBsZXQgc2Nyb2xsVmlld3BvcnQgPSBuYXZTY3JvbGxlck5hdi5jbGllbnRXaWR0aDtcbiAgICBsZXQgc2Nyb2xsTGVmdCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQ7XG5cbiAgICBzY3JvbGxBdmFpbGFibGVMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICBzY3JvbGxBdmFpbGFibGVSaWdodCA9IHNjcm9sbFdpZHRoIC0gKHNjcm9sbFZpZXdwb3J0ICsgc2Nyb2xsTGVmdCk7XG5cbiAgICAvLyAxIGluc3RlYWQgb2YgMCB0byBjb21wZW5zYXRlIGZvciBudW1iZXIgcm91bmRpbmdcbiAgICBsZXQgc2Nyb2xsTGVmdENvbmRpdGlvbiA9IHNjcm9sbEF2YWlsYWJsZUxlZnQgPiAxO1xuICAgIGxldCBzY3JvbGxSaWdodENvbmRpdGlvbiA9IHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID4gMTtcblxuICAgIC8vIGNvbnNvbGUubG9nKHNjcm9sbFdpZHRoLCBzY3JvbGxWaWV3cG9ydCwgc2Nyb2xsQXZhaWxhYmxlTGVmdCwgc2Nyb2xsQXZhaWxhYmxlUmlnaHQpO1xuXG4gICAgaWYgKHNjcm9sbExlZnRDb25kaXRpb24gJiYgc2Nyb2xsUmlnaHRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAnYm90aCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNjcm9sbExlZnRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAnbGVmdCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ3JpZ2h0JztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gJ25vbmUnO1xuICAgIH1cblxuICB9XG5cblxuICAvLyBDYWxjdWxhdGVzIHRoZSBzY3JvbGwgc3RlcCBiYXNlZCBvbiB0aGUgd2lkdGggb2YgdGhlIHNjcm9sbGVyIGFuZCB0aGUgbnVtYmVyIG9mIGxpbmtzXG4gIGNvbnN0IGNhbGN1bGF0ZVNjcm9sbFN0ZXAgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnKSB7XG4gICAgICBsZXQgc2Nyb2xsVmlld3BvcnROb1BhZGRpbmcgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxXaWR0aCAtIChwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1sZWZ0JykpICsgcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKSkpO1xuXG4gICAgICBsZXQgc2Nyb2xsU3RlcEF2ZXJhZ2UgPSBNYXRoLmZsb29yKHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIC8gbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMubGVuZ3RoKTtcblxuICAgICAgc2Nyb2xsU3RlcCA9IHNjcm9sbFN0ZXBBdmVyYWdlO1xuICAgIH1cbiAgfVxuXG5cbiAgLy8gTW92ZSB0aGUgc2Nyb2xsZXIgd2l0aCBhIHRyYW5zZm9ybVxuICBjb25zdCBtb3ZlU2Nyb2xsZXIgPSBmdW5jdGlvbihkaXJlY3Rpb24pIHtcblxuICAgIGlmIChzY3JvbGxpbmcgPT09IHRydWUgfHwgKHNjcm9sbE92ZXJmbG93ICE9PSBkaXJlY3Rpb24gJiYgc2Nyb2xsT3ZlcmZsb3cgIT09ICdib3RoJykpIHJldHVybjtcblxuICAgIGxldCBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbFN0ZXA7XG4gICAgbGV0IHNjcm9sbEF2YWlsYWJsZSA9IGRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gc2Nyb2xsQXZhaWxhYmxlTGVmdCA6IHNjcm9sbEF2YWlsYWJsZVJpZ2h0O1xuXG4gICAgLy8gSWYgdGhlcmUgd2lsbCBiZSBsZXNzIHRoYW4gMjUlIG9mIHRoZSBsYXN0IHN0ZXAgdmlzaWJsZSB0aGVuIHNjcm9sbCB0byB0aGUgZW5kXG4gICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IChzY3JvbGxTdGVwICogMS43NSkpIHtcbiAgICAgIHNjcm9sbERpc3RhbmNlID0gc2Nyb2xsQXZhaWxhYmxlO1xuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHNjcm9sbERpc3RhbmNlICo9IC0xO1xuXG4gICAgICBpZiAoc2Nyb2xsQXZhaWxhYmxlIDwgc2Nyb2xsU3RlcCkge1xuICAgICAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc25hcC1hbGlnbi1lbmQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgnICsgc2Nyb2xsRGlzdGFuY2UgKyAncHgpJztcblxuICAgIHNjcm9sbGluZ0RpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICBzY3JvbGxpbmcgPSB0cnVlO1xuICB9XG5cblxuICAvLyBTZXQgdGhlIHNjcm9sbGVyIHBvc2l0aW9uIGFuZCByZW1vdmVzIHRyYW5zZm9ybSwgY2FsbGVkIGFmdGVyIG1vdmVTY3JvbGxlcigpIGluIHRoZSB0cmFuc2l0aW9uZW5kIGV2ZW50XG4gIGNvbnN0IHNldFNjcm9sbGVyUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQsIG51bGwpO1xuICAgIHZhciB0cmFuc2Zvcm0gPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd0cmFuc2Zvcm0nKTtcbiAgICB2YXIgdHJhbnNmb3JtVmFsdWUgPSBNYXRoLmFicyhwYXJzZUludCh0cmFuc2Zvcm0uc3BsaXQoJywnKVs0XSkgfHwgMCk7XG5cbiAgICBpZiAoc2Nyb2xsaW5nRGlyZWN0aW9uID09PSAnbGVmdCcpIHtcbiAgICAgIHRyYW5zZm9ybVZhbHVlICo9IC0xO1xuICAgIH1cblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QuYWRkKCduby10cmFuc2l0aW9uJyk7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LnN0eWxlLnRyYW5zZm9ybSA9ICcnO1xuICAgIG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ICsgdHJhbnNmb3JtVmFsdWU7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nLCAnc25hcC1hbGlnbi1lbmQnKTtcblxuICAgIHNjcm9sbGluZyA9IGZhbHNlO1xuICB9XG5cblxuICAvLyBUb2dnbGUgYnV0dG9ucyBkZXBlbmRpbmcgb24gb3ZlcmZsb3dcbiAgY29uc3QgdG9nZ2xlQnV0dG9ucyA9IGZ1bmN0aW9uKG92ZXJmbG93KSB7XG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdsZWZ0Jykge1xuICAgICAgbmF2U2Nyb2xsZXJMZWZ0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG5cbiAgICBpZiAob3ZlcmZsb3cgPT09ICdib3RoJyB8fCBvdmVyZmxvdyA9PT0gJ3JpZ2h0Jykge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlclJpZ2h0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cbiAgfVxuXG5cbiAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgc2V0T3ZlcmZsb3coKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyTmF2LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgIHJlcXVlc3RTZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCAoKSA9PiB7XG4gICAgICBzZXRTY3JvbGxlclBvc2l0aW9uKCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlckxlZnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBtb3ZlU2Nyb2xsZXIoJ2xlZnQnKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyUmlnaHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBtb3ZlU2Nyb2xsZXIoJ3JpZ2h0Jyk7XG4gICAgfSk7XG5cbiAgfTtcblxuXG4gIC8vIFNlbGYgaW5pdFxuICBpbml0KCk7XG5cblxuICAvLyBSZXZlYWwgQVBJXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xuXG59O1xuXG4vL2V4cG9ydCBkZWZhdWx0IFByaW9yaXR5TmF2U2Nyb2xsZXI7XG4iLCIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcInVzZSBzdHJpY3RcIjt2YXIgX3ZhbGlkRm9ybT1yZXF1aXJlKFwiLi9zcmMvdmFsaWQtZm9ybVwiKTt2YXIgX3ZhbGlkRm9ybTI9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdmFsaWRGb3JtKTtmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iail7cmV0dXJuIG9iaiYmb2JqLl9fZXNNb2R1bGU/b2JqOntkZWZhdWx0Om9ian19d2luZG93LlZhbGlkRm9ybT1fdmFsaWRGb3JtMi5kZWZhdWx0O3dpbmRvdy5WYWxpZEZvcm0udG9nZ2xlSW52YWxpZENsYXNzPV92YWxpZEZvcm0udG9nZ2xlSW52YWxpZENsYXNzO3dpbmRvdy5WYWxpZEZvcm0uaGFuZGxlQ3VzdG9tTWVzc2FnZXM9X3ZhbGlkRm9ybS5oYW5kbGVDdXN0b21NZXNzYWdlczt3aW5kb3cuVmFsaWRGb3JtLmhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5PV92YWxpZEZvcm0uaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXl9LHtcIi4vc3JjL3ZhbGlkLWZvcm1cIjozfV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOnRydWV9KTtleHBvcnRzLmNsb25lPWNsb25lO2V4cG9ydHMuZGVmYXVsdHM9ZGVmYXVsdHM7ZXhwb3J0cy5pbnNlcnRBZnRlcj1pbnNlcnRBZnRlcjtleHBvcnRzLmluc2VydEJlZm9yZT1pbnNlcnRCZWZvcmU7ZXhwb3J0cy5mb3JFYWNoPWZvckVhY2g7ZXhwb3J0cy5kZWJvdW5jZT1kZWJvdW5jZTtmdW5jdGlvbiBjbG9uZShvYmope3ZhciBjb3B5PXt9O2Zvcih2YXIgYXR0ciBpbiBvYmope2lmKG9iai5oYXNPd25Qcm9wZXJ0eShhdHRyKSljb3B5W2F0dHJdPW9ialthdHRyXX1yZXR1cm4gY29weX1mdW5jdGlvbiBkZWZhdWx0cyhvYmosZGVmYXVsdE9iamVjdCl7b2JqPWNsb25lKG9ianx8e30pO2Zvcih2YXIgayBpbiBkZWZhdWx0T2JqZWN0KXtpZihvYmpba109PT11bmRlZmluZWQpb2JqW2tdPWRlZmF1bHRPYmplY3Rba119cmV0dXJuIG9ian1mdW5jdGlvbiBpbnNlcnRBZnRlcihyZWZOb2RlLG5vZGVUb0luc2VydCl7dmFyIHNpYmxpbmc9cmVmTm9kZS5uZXh0U2libGluZztpZihzaWJsaW5nKXt2YXIgX3BhcmVudD1yZWZOb2RlLnBhcmVudE5vZGU7X3BhcmVudC5pbnNlcnRCZWZvcmUobm9kZVRvSW5zZXJ0LHNpYmxpbmcpfWVsc2V7cGFyZW50LmFwcGVuZENoaWxkKG5vZGVUb0luc2VydCl9fWZ1bmN0aW9uIGluc2VydEJlZm9yZShyZWZOb2RlLG5vZGVUb0luc2VydCl7dmFyIHBhcmVudD1yZWZOb2RlLnBhcmVudE5vZGU7cGFyZW50Lmluc2VydEJlZm9yZShub2RlVG9JbnNlcnQscmVmTm9kZSl9ZnVuY3Rpb24gZm9yRWFjaChpdGVtcyxmbil7aWYoIWl0ZW1zKXJldHVybjtpZihpdGVtcy5mb3JFYWNoKXtpdGVtcy5mb3JFYWNoKGZuKX1lbHNle2Zvcih2YXIgaT0wO2k8aXRlbXMubGVuZ3RoO2krKyl7Zm4oaXRlbXNbaV0saSxpdGVtcyl9fX1mdW5jdGlvbiBkZWJvdW5jZShtcyxmbil7dmFyIHRpbWVvdXQ9dm9pZCAwO3ZhciBkZWJvdW5jZWRGbj1mdW5jdGlvbiBkZWJvdW5jZWRGbigpe2NsZWFyVGltZW91dCh0aW1lb3V0KTt0aW1lb3V0PXNldFRpbWVvdXQoZm4sbXMpfTtyZXR1cm4gZGVib3VuY2VkRm59fSx7fV0sMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOnRydWV9KTtleHBvcnRzLnRvZ2dsZUludmFsaWRDbGFzcz10b2dnbGVJbnZhbGlkQ2xhc3M7ZXhwb3J0cy5oYW5kbGVDdXN0b21NZXNzYWdlcz1oYW5kbGVDdXN0b21NZXNzYWdlcztleHBvcnRzLmhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5PWhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5O2V4cG9ydHMuZGVmYXVsdD12YWxpZEZvcm07dmFyIF91dGlsPXJlcXVpcmUoXCIuL3V0aWxcIik7ZnVuY3Rpb24gdG9nZ2xlSW52YWxpZENsYXNzKGlucHV0LGludmFsaWRDbGFzcyl7aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImludmFsaWRcIixmdW5jdGlvbigpe2lucHV0LmNsYXNzTGlzdC5hZGQoaW52YWxpZENsYXNzKX0pO2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLGZ1bmN0aW9uKCl7aWYoaW5wdXQudmFsaWRpdHkudmFsaWQpe2lucHV0LmNsYXNzTGlzdC5yZW1vdmUoaW52YWxpZENsYXNzKX19KX12YXIgZXJyb3JQcm9wcz1bXCJiYWRJbnB1dFwiLFwicGF0dGVybk1pc21hdGNoXCIsXCJyYW5nZU92ZXJmbG93XCIsXCJyYW5nZVVuZGVyZmxvd1wiLFwic3RlcE1pc21hdGNoXCIsXCJ0b29Mb25nXCIsXCJ0b29TaG9ydFwiLFwidHlwZU1pc21hdGNoXCIsXCJ2YWx1ZU1pc3NpbmdcIixcImN1c3RvbUVycm9yXCJdO2Z1bmN0aW9uIGdldEN1c3RvbU1lc3NhZ2UoaW5wdXQsY3VzdG9tTWVzc2FnZXMpe2N1c3RvbU1lc3NhZ2VzPWN1c3RvbU1lc3NhZ2VzfHx7fTt2YXIgbG9jYWxFcnJvclByb3BzPVtpbnB1dC50eXBlK1wiTWlzbWF0Y2hcIl0uY29uY2F0KGVycm9yUHJvcHMpO3ZhciB2YWxpZGl0eT1pbnB1dC52YWxpZGl0eTtmb3IodmFyIGk9MDtpPGxvY2FsRXJyb3JQcm9wcy5sZW5ndGg7aSsrKXt2YXIgcHJvcD1sb2NhbEVycm9yUHJvcHNbaV07aWYodmFsaWRpdHlbcHJvcF0pe3JldHVybiBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLVwiK3Byb3ApfHxjdXN0b21NZXNzYWdlc1twcm9wXX19fWZ1bmN0aW9uIGhhbmRsZUN1c3RvbU1lc3NhZ2VzKGlucHV0LGN1c3RvbU1lc3NhZ2VzKXtmdW5jdGlvbiBjaGVja1ZhbGlkaXR5KCl7dmFyIG1lc3NhZ2U9aW5wdXQudmFsaWRpdHkudmFsaWQ/bnVsbDpnZXRDdXN0b21NZXNzYWdlKGlucHV0LGN1c3RvbU1lc3NhZ2VzKTtpbnB1dC5zZXRDdXN0b21WYWxpZGl0eShtZXNzYWdlfHxcIlwiKX1pbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixjaGVja1ZhbGlkaXR5KTtpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW52YWxpZFwiLGNoZWNrVmFsaWRpdHkpfWZ1bmN0aW9uIGhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5KGlucHV0LG9wdGlvbnMpe3ZhciB2YWxpZGF0aW9uRXJyb3JDbGFzcz1vcHRpb25zLnZhbGlkYXRpb25FcnJvckNsYXNzLHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzPW9wdGlvbnMudmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3MsZXJyb3JQbGFjZW1lbnQ9b3B0aW9ucy5lcnJvclBsYWNlbWVudDtmdW5jdGlvbiBjaGVja1ZhbGlkaXR5KG9wdGlvbnMpe3ZhciBpbnNlcnRFcnJvcj1vcHRpb25zLmluc2VydEVycm9yO3ZhciBwYXJlbnROb2RlPWlucHV0LnBhcmVudE5vZGU7dmFyIGVycm9yTm9kZT1wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoXCIuXCIrdmFsaWRhdGlvbkVycm9yQ2xhc3MpfHxkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2lmKCFpbnB1dC52YWxpZGl0eS52YWxpZCYmaW5wdXQudmFsaWRhdGlvbk1lc3NhZ2Upe2Vycm9yTm9kZS5jbGFzc05hbWU9dmFsaWRhdGlvbkVycm9yQ2xhc3M7ZXJyb3JOb2RlLnRleHRDb250ZW50PWlucHV0LnZhbGlkYXRpb25NZXNzYWdlO2lmKGluc2VydEVycm9yKXtlcnJvclBsYWNlbWVudD09PVwiYmVmb3JlXCI/KDAsX3V0aWwuaW5zZXJ0QmVmb3JlKShpbnB1dCxlcnJvck5vZGUpOigwLF91dGlsLmluc2VydEFmdGVyKShpbnB1dCxlcnJvck5vZGUpO3BhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCh2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzcyl9fWVsc2V7cGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzKTtlcnJvck5vZGUucmVtb3ZlKCl9fWlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLGZ1bmN0aW9uKCl7Y2hlY2tWYWxpZGl0eSh7aW5zZXJ0RXJyb3I6ZmFsc2V9KX0pO2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnZhbGlkXCIsZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO2NoZWNrVmFsaWRpdHkoe2luc2VydEVycm9yOnRydWV9KX0pfXZhciBkZWZhdWx0T3B0aW9ucz17aW52YWxpZENsYXNzOlwiaW52YWxpZFwiLHZhbGlkYXRpb25FcnJvckNsYXNzOlwidmFsaWRhdGlvbi1lcnJvclwiLHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzOlwiaGFzLXZhbGlkYXRpb24tZXJyb3JcIixjdXN0b21NZXNzYWdlczp7fSxlcnJvclBsYWNlbWVudDpcImJlZm9yZVwifTtmdW5jdGlvbiB2YWxpZEZvcm0oZWxlbWVudCxvcHRpb25zKXtpZighZWxlbWVudHx8IWVsZW1lbnQubm9kZU5hbWUpe3Rocm93IG5ldyBFcnJvcihcIkZpcnN0IGFyZyB0byB2YWxpZEZvcm0gbXVzdCBiZSBhIGZvcm0sIGlucHV0LCBzZWxlY3QsIG9yIHRleHRhcmVhXCIpfXZhciBpbnB1dHM9dm9pZCAwO3ZhciB0eXBlPWVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtvcHRpb25zPSgwLF91dGlsLmRlZmF1bHRzKShvcHRpb25zLGRlZmF1bHRPcHRpb25zKTtpZih0eXBlPT09XCJmb3JtXCIpe2lucHV0cz1lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYVwiKTtmb2N1c0ludmFsaWRJbnB1dChlbGVtZW50LGlucHV0cyl9ZWxzZSBpZih0eXBlPT09XCJpbnB1dFwifHx0eXBlPT09XCJzZWxlY3RcInx8dHlwZT09PVwidGV4dGFyZWFcIil7aW5wdXRzPVtlbGVtZW50XX1lbHNle3Rocm93IG5ldyBFcnJvcihcIk9ubHkgZm9ybSwgaW5wdXQsIHNlbGVjdCwgb3IgdGV4dGFyZWEgZWxlbWVudHMgYXJlIHN1cHBvcnRlZFwiKX12YWxpZEZvcm1JbnB1dHMoaW5wdXRzLG9wdGlvbnMpfWZ1bmN0aW9uIGZvY3VzSW52YWxpZElucHV0KGZvcm0saW5wdXRzKXt2YXIgZm9jdXNGaXJzdD0oMCxfdXRpbC5kZWJvdW5jZSkoMTAwLGZ1bmN0aW9uKCl7dmFyIGludmFsaWROb2RlPWZvcm0ucXVlcnlTZWxlY3RvcihcIjppbnZhbGlkXCIpO2lmKGludmFsaWROb2RlKWludmFsaWROb2RlLmZvY3VzKCl9KTsoMCxfdXRpbC5mb3JFYWNoKShpbnB1dHMsZnVuY3Rpb24oaW5wdXQpe3JldHVybiBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW52YWxpZFwiLGZvY3VzRmlyc3QpfSl9ZnVuY3Rpb24gdmFsaWRGb3JtSW5wdXRzKGlucHV0cyxvcHRpb25zKXt2YXIgaW52YWxpZENsYXNzPW9wdGlvbnMuaW52YWxpZENsYXNzLGN1c3RvbU1lc3NhZ2VzPW9wdGlvbnMuY3VzdG9tTWVzc2FnZXM7KDAsX3V0aWwuZm9yRWFjaCkoaW5wdXRzLGZ1bmN0aW9uKGlucHV0KXt0b2dnbGVJbnZhbGlkQ2xhc3MoaW5wdXQsaW52YWxpZENsYXNzKTtoYW5kbGVDdXN0b21NZXNzYWdlcyhpbnB1dCxjdXN0b21NZXNzYWdlcyk7aGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkoaW5wdXQsb3B0aW9ucyl9KX19LHtcIi4vdXRpbFwiOjJ9XX0se30sWzFdKTsiLCIvKipcbiAqIERvIHRoZXNlIHRoaW5ncyBhcyBxdWlja2x5IGFzIHBvc3NpYmxlOyB3ZSBtaWdodCBoYXZlIENTUyBvciBlYXJseSBzY3JpcHRzIHRoYXQgcmVxdWlyZSBvbiBpdFxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAnbm8tanMnICk7XG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ2pzJyApO1xuIiwiLyoqXG4gKiBUaGlzIGlzIHVzZWQgdG8gY2F1c2UgR29vZ2xlIEFuYWx5dGljcyBldmVudHMgdG8gcnVuXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG4vKlxuICogQ2FsbCBob29rcyBmcm9tIG90aGVyIHBsYWNlcy5cbiAqIFRoaXMgYWxsb3dzIG90aGVyIHBsdWdpbnMgdGhhdCB3ZSBtYWludGFpbiB0byBwYXNzIGRhdGEgdG8gdGhlIHRoZW1lJ3MgYW5hbHl0aWNzIG1ldGhvZC5cbiovXG5pZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2Ygd3AgKSB7XG5cdHdwLmhvb2tzLmFkZEFjdGlvbiggJ3dwTWVzc2FnZUluc2VydGVyQW5hbHl0aWNzRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCwgMTAgKTtcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnbWlubnBvc3RGb3JtUHJvY2Vzc29yTWFpbGNoaW1wQW5hbHl0aWNzRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCwgMTAgKTtcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnbWlubnBvc3RNZW1iZXJzaGlwQW5hbHl0aWNzRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCwgMTAgKTtcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnbWlubnBvc3RNZW1iZXJzaGlwQW5hbHl0aWNzRWNvbW1lcmNlQWN0aW9uJywgJ21pbm5wb3N0TGFyZ28nLCBtcEFuYWx5dGljc1RyYWNraW5nRWNvbW1lcmNlQWN0aW9uLCAxMCApO1xufVxuXG4vKlxuICogQ3JlYXRlIGEgR29vZ2xlIEFuYWx5dGljcyBldmVudCBmb3IgdGhlIHRoZW1lLiBUaGlzIGNhbGxzIHRoZSB3cC1hbmFseXRpY3MtdHJhY2tpbmctZ2VuZXJhdG9yIGFjdGlvbi5cbiAqIHR5cGU6IGdlbmVyYWxseSB0aGlzIGlzIFwiZXZlbnRcIlxuICogY2F0ZWdvcnk6IEV2ZW50IENhdGVnb3J5XG4gKiBsYWJlbDogRXZlbnQgTGFiZWxcbiAqIGFjdGlvbjogRXZlbnQgQWN0aW9uXG4gKiB2YWx1ZTogb3B0aW9uYWxcbiAqIG5vbl9pbnRlcmFjdGlvbjogb3B0aW9uYWxcbiovXG5mdW5jdGlvbiBtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSwgbm9uX2ludGVyYWN0aW9uICkge1xuXHR3cC5ob29rcy5kb0FjdGlvbiggJ3dwQW5hbHl0aWNzVHJhY2tpbmdHZW5lcmF0b3JFdmVudCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSwgbm9uX2ludGVyYWN0aW9uICk7XG59XG5cbi8qXG4gKiBDcmVhdGUgYSBHb29nbGUgQW5hbHl0aWNzIEVjb21tZXJjZSBhY3Rpb24gZm9yIHRoZSB0aGVtZS4gVGhpcyBjYWxscyB0aGUgd3AtYW5hbHl0aWNzLXRyYWNraW5nLWdlbmVyYXRvciBhY3Rpb24uXG4gKlxuKi9cbmZ1bmN0aW9uIG1wQW5hbHl0aWNzVHJhY2tpbmdFY29tbWVyY2VBY3Rpb24oIHR5cGUsIGFjdGlvbiwgcHJvZHVjdCwgc3RlcCApIHtcblx0d3AuaG9va3MuZG9BY3Rpb24oICd3cEFuYWx5dGljc1RyYWNraW5nR2VuZXJhdG9yRWNvbW1lcmNlQWN0aW9uJywgdHlwZSwgYWN0aW9uLCBwcm9kdWN0LCBzdGVwICk7XG59XG5cbi8qXG4gKiBXaGVuIGEgcGFydCBvZiB0aGUgd2Vic2l0ZSBpcyBtZW1iZXItc3BlY2lmaWMsIGNyZWF0ZSBhbiBldmVudCBmb3Igd2hldGhlciBpdCB3YXMgc2hvd24gb3Igbm90LlxuKi9cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdH1cblx0XHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3Igc2hhcmluZyBjb250ZW50XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG4vLyB0cmFjayBhIHNoYXJlIHZpYSBhbmFseXRpY3MgZXZlbnQuXG5mdW5jdGlvbiB0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiA9ICcnICkge1xuICAgIHZhciBjYXRlZ29yeSA9ICdTaGFyZSc7XG4gICAgaWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG4gICAgICAgIGNhdGVnb3J5ID0gJ1NoYXJlIC0gJyArIHBvc2l0aW9uO1xuICAgIH1cblxuICAgIC8vIHRyYWNrIGFzIGFuIGV2ZW50XG4gICAgbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeSwgdGV4dCwgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn1cblxuLy8gdG9wIHNoYXJlIGJ1dHRvbiBjbGlja1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWVudHJ5LXNoYXJlLXRvcCBhJyApLmZvckVhY2goXG4gICAgdG9wQnV0dG9uID0+IHRvcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoIGUgKSA9PiB7XG4gICAgICAgIHZhciB0ZXh0ID0gZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSggJ2RhdGEtc2hhcmUtYWN0aW9uJyApO1xuICAgICAgICB2YXIgcG9zaXRpb24gPSAndG9wJztcbiAgICAgICAgdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcbiAgICB9IClcbik7XG5cbi8vIHdoZW4gdGhlIHByaW50IGJ1dHRvbiBpcyBjbGlja2VkXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtcHJpbnQgYScgKS5mb3JFYWNoKFxuICAgIHByaW50QnV0dG9uID0+IHByaW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsICggZSApID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB3aW5kb3cucHJpbnQoKTtcbiAgICB9IClcbik7XG5cbi8vIHdoZW4gdGhlIHJlcHVibGlzaCBidXR0b24gaXMgY2xpY2tlZFxuLy8gdGhlIHBsdWdpbiBjb250cm9scyB0aGUgcmVzdCwgYnV0IHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRoZSBkZWZhdWx0IGV2ZW50IGRvZXNuJ3QgZmlyZVxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXJlcHVibGlzaCBhJyApLmZvckVhY2goXG4gICAgcmVwdWJsaXNoQnV0dG9uID0+IHJlcHVibGlzaEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoIGUgKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9IClcbik7XG5cbi8vIHdoZW4gdGhlIGNvcHkgbGluayBidXR0b24gaXMgY2xpY2tlZFxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWNvcHktdXJsIGEnICkuZm9yRWFjaChcbiAgICBjb3B5QnV0dG9uID0+IGNvcHlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCBlICkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCBjb3B5VGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCggY29weVRleHQgKS50aGVuKCAoKSA9PiB7XG4gICAgICAgICAgICB0bGl0ZS5zaG93KCAoIGUudGFyZ2V0ICksIHsgZ3JhdjogJ3cnIH0gKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRsaXRlLmhpZGUoICggZS50YXJnZXQgKSApO1xuICAgICAgICAgICAgfSwgMzAwMCApO1xuICAgICAgICB9ICk7XG4gICAgfSApXG4pO1xuXG4vLyB3aGVuIHNoYXJpbmcgdmlhIGZhY2Vib29rLCB0d2l0dGVyLCBvciBlbWFpbCwgb3BlbiB0aGUgZGVzdGluYXRpb24gdXJsIGluIGEgbmV3IHdpbmRvd1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWZhY2Vib29rIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXR3aXR0ZXIgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZW1haWwgYScgKS5mb3JFYWNoKFxuICAgIGFueVNoYXJlQnV0dG9uID0+IGFueVNoYXJlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsICggZSApID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciB1cmwgPSBlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCAnaHJlZicgKTtcblx0XHR3aW5kb3cub3BlbiggdXJsLCAnX2JsYW5rJyApO1xuICAgIH0gKVxuKTtcbiIsIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIE5hdmlnYXRpb24gc2NyaXB0cy4gSW5jbHVkZXMgbW9iaWxlIG9yIHRvZ2dsZSBiZWhhdmlvciwgYW5hbHl0aWNzIHRyYWNraW5nIG9mIHNwZWNpZmljIG1lbnVzLlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkgaW4gdGhlIGZ1bmN0aW9ucyBhdCB0aGUgYm90dG9tLlxuICovXG5cbmZ1bmN0aW9uIHNldHVwUHJpbWFyeU5hdigpIHtcblx0Y29uc3QgcHJpbWFyeU5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1saW5rcycgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHByaW1hcnlOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IGJ1dHRvbicgKTtcblx0aWYgKCBudWxsICE9PSBwcmltYXJ5TmF2VG9nZ2xlICkge1xuXHRcdHByaW1hcnlOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRjb25zdCB1c2VyTmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItYWNjb3VudCB1bCcgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHVzZXJOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItYWNjb3VudCA+IGEnICk7XG5cdGlmICggbnVsbCAhPT0gdXNlck5hdlRvZ2dsZSApIHtcblx0XHR1c2VyTmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0dmFyIHRhcmdldCAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgLm0tZm9ybS1zZWFyY2ggZmllbGRzZXQgLmEtYnV0dG9uLXNlbnRlbmNlJyApO1xuXHRpZiAoIG51bGwgIT09IHRhcmdldCApIHtcblx0XHR2YXIgZGl2ICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRkaXYuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLXNlYXJjaFwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuXHRcdHZhciBmcmFnbWVudCAgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0ZGl2LnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuXHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG5cblx0XHRjb25zdCBzZWFyY2hUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1hY3Rpb25zIC5tLWZvcm0tc2VhcmNoJyApLFxuXHRcdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHRcdH0gKTtcblxuXHRcdHZhciBzZWFyY2hWaXNpYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ2xpLnNlYXJjaCA+IGEnICk7XG5cdFx0c2VhcmNoVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHR2YXIgc2VhcmNoQ2xvc2UgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLXNlYXJjaCcgKTtcblx0XHRzZWFyY2hDbG9zZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiggZXZ0ICkge1xuXHRcdGV2dCA9IGV2dCB8fCB3aW5kb3cuZXZlbnQ7XG5cdFx0dmFyIGlzRXNjYXBlID0gZmFsc2U7XG5cdFx0aWYgKCAna2V5JyBpbiBldnQgKSB7XG5cdFx0XHRpc0VzY2FwZSA9ICggJ0VzY2FwZScgPT09IGV2dC5rZXkgfHwgJ0VzYycgPT09IGV2dC5rZXkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aXNFc2NhcGUgPSAoIDI3ID09PSBldnQua2V5Q29kZSApO1xuXHRcdH1cblx0XHRpZiAoIGlzRXNjYXBlICkge1xuXHRcdFx0bGV0IHByaW1hcnlOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gcHJpbWFyeU5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHVzZXJOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gdXNlck5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHNlYXJjaElzVmlzaWJsZSA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBwcmltYXJ5TmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gcHJpbWFyeU5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHRwcmltYXJ5TmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHByaW1hcnlOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHVzZXJOYXZFeHBhbmRlZCAmJiB0cnVlID09PSB1c2VyTmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgdXNlck5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2Ygc2VhcmNoSXNWaXNpYmxlICYmIHRydWUgPT09IHNlYXJjaElzVmlzaWJsZSApIHtcblx0XHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBzZWFyY2hJc1Zpc2libGUgKTtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufVxuc2V0dXBQcmltYXJ5TmF2KCk7IC8vIHRoaXMgd2hvbGUgZnVuY3Rpb24gZG9lcyBub3QgcmVxdWlyZSBqcXVlcnkuXG5cbmZ1bmN0aW9uIHNldHVwU2Nyb2xsTmF2KCkge1xuXG5cdGxldCBzdWJOYXZTY3JvbGxlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tc3ViLW5hdmlnYXRpb24nICk7XG5cdHN1Yk5hdlNjcm9sbGVycy5mb3JFYWNoKCAoIGN1cnJlbnRWYWx1ZSApID0+IHtcblx0XHRQcmlvcml0eU5hdlNjcm9sbGVyKCB7XG5cdFx0XHRzZWxlY3RvcjogY3VycmVudFZhbHVlLFxuXHRcdFx0bmF2U2VsZWN0b3I6ICcubS1zdWJuYXYtbmF2aWdhdGlvbicsXG5cdFx0XHRjb250ZW50U2VsZWN0b3I6ICcubS1tZW51LXN1Yi1uYXZpZ2F0aW9uJyxcblx0XHRcdGl0ZW1TZWxlY3RvcjogJ2xpLCBhJyxcblx0XHRcdGJ1dHRvbkxlZnRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0Jyxcblx0XHRcdGJ1dHRvblJpZ2h0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tcmlnaHQnXG5cdFx0fSApO1xuXHR9ICk7XG5cblx0bGV0IHBhZ2luYXRpb25TY3JvbGxlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tcGFnaW5hdGlvbi1uYXZpZ2F0aW9uJyApO1xuXHRwYWdpbmF0aW9uU2Nyb2xsZXJzLmZvckVhY2goICggY3VycmVudFZhbHVlICkgPT4ge1xuXHRcdFByaW9yaXR5TmF2U2Nyb2xsZXIoIHtcblx0XHRcdHNlbGVjdG9yOiBjdXJyZW50VmFsdWUsXG5cdFx0XHRuYXZTZWxlY3RvcjogJy5tLXBhZ2luYXRpb24tY29udGFpbmVyJyxcblx0XHRcdGNvbnRlbnRTZWxlY3RvcjogJy5tLXBhZ2luYXRpb24tbGlzdCcsXG5cdFx0XHRpdGVtU2VsZWN0b3I6ICdsaSwgYScsXG5cdFx0XHRidXR0b25MZWZ0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tbGVmdCcsXG5cdFx0XHRidXR0b25SaWdodFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0J1xuXHRcdH0gKTtcblx0fSApO1xuXG59XG5zZXR1cFNjcm9sbE5hdigpOyAvLyB0aGlzIHdob2xlIGZ1bmN0aW9uIGRvZXMgbm90IHJlcXVpcmUganF1ZXJ5LlxuXG5cbi8vIHRoaXMgaXMgdGhlIHBhcnQgdGhhdCByZXF1aXJlcyBqcXVlcnkuXG4kKCAnYScsICQoICcuby1zaXRlLXNpZGViYXInICkgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdHZhciB3aWRnZXRUaXRsZSAgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS13aWRnZXQnICkuZmluZCggJ2gzJyApLnRleHQoKTtcblx0dmFyIHpvbmVUaXRsZSAgICAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXpvbmUnICkuZmluZCggJy5hLXpvbmUtdGl0bGUnICkudGV4dCgpO1xuXHR2YXIgc2lkZWJhclNlY3Rpb25UaXRsZSA9ICcnO1xuXHRpZiAoICcnICE9PSB3aWRnZXRUaXRsZSApIHtcblx0XHRzaWRlYmFyU2VjdGlvblRpdGxlID0gd2lkZ2V0VGl0bGU7XG5cdH0gZWxzZSBpZiAoICcnICE9PSB6b25lVGl0bGUgKSB7XG5cdFx0c2lkZWJhclNlY3Rpb25UaXRsZSA9IHpvbmVUaXRsZTtcblx0fVxuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsICdTaWRlYmFyIExpbmsnLCAnQ2xpY2snLCBzaWRlYmFyU2VjdGlvblRpdGxlICk7XG59ICk7XG5cbiQoICdhJywgJCggJy5tLXJlbGF0ZWQnICkgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1JlbGF0ZWQgU2VjdGlvbiBMaW5rJywgJ0NsaWNrJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgZm9ybXNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxualF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICggdGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgJycgIT09IHRoaXMubm9kZVZhbHVlLnRyaW0oKSApO1xuXHR9ICk7XG59O1xuXG5mdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0cmV0dXJuIG1hcmt1cDtcbn1cblxuZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCggJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nICk7XG5cdHZhciByZXN0Um9vdCAgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0dmFyIGZ1bGxVcmwgICAgICAgICAgICA9IHJlc3RSb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdHZhciBjb25maXJtQ2hhbmdlICAgICAgPSAnJztcblx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdHZhciBuZXdQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIG9sZFByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0dmFyIGNvbnNvbGlkYXRlZEVtYWlscyA9IFtdO1xuXHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdHZhciBhamF4Rm9ybURhdGEgICAgICAgPSAnJztcblx0dmFyIHRoYXQgICAgICAgICAgICAgICA9ICcnO1xuXG5cdC8vIHN0YXJ0IG91dCB3aXRoIG5vIHByaW1hcnkvcmVtb3ZhbHMgY2hlY2tlZFxuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHQvLyBpZiB0aGVyZSBpcyBhIGxpc3Qgb2YgZW1haWxzIChub3QganVzdCBhIHNpbmdsZSBmb3JtIGZpZWxkKVxuXHRpZiAoIDAgPCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cblx0XHQvLyBpZiBhIHVzZXIgc2VsZWN0cyBhIG5ldyBwcmltYXJ5LCBtb3ZlIGl0IGludG8gdGhhdCBwb3NpdGlvblxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oKSB7XG5cblx0XHRcdG5ld1ByaW1hcnlFbWFpbCA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdG9sZFByaW1hcnlFbWFpbCA9ICQoICcjZW1haWwnICkudmFsKCk7XG5cdFx0XHRwcmltYXJ5SWQgICAgICAgPSAkKCB0aGlzICkucHJvcCggJ2lkJyApLnJlcGxhY2UoICdwcmltYXJ5X2VtYWlsXycsICcnICk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncHJpbWFyeS1jaGFuZ2UnICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlclxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblxuXHRcdFx0Ly8kKCB0aGlzICkucGFyZW50KCkuYWZ0ZXIoIGNvbmZpcm1DaGFuZ2UgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSB1c2VyIGZhY2luZyB2YWx1ZXNcblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG5ld1ByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3VzZXItZW1haWwtJyArIHByaW1hcnlJZCApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgbWFpbiBoaWRkZW4gZm9ybSB2YWx1ZVxuXHRcdFx0XHQkKCAnI2VtYWlsJyApLnZhbCggbmV3UHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gc3VibWl0IGZvcm0gdmFsdWVzLlxuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXG5cdFx0XHRcdC8vIHVuY2hlY2sgdGhlIHJhZGlvIGJ1dHRvblxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBmb3JtIHZhbHVlcyB0byB0aGUgb2xkIHByaW1hcnkgZW1haWxcblx0XHRcdFx0JCggJyNwcmltYXJ5X2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3JlbW92ZV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyByZW1vdmUgdGhlIGNvbmZpcm0gbWVzc2FnZVxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHJlbW92ZXMgYW4gZW1haWwsIHRha2UgaXQgYXdheSBmcm9tIHRoZSB2aXN1YWwgYW5kIGZyb20gdGhlIGZvcm1cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2hhbmdlJywgJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgIT09IGVtYWlsVG9SZW1vdmUgKSB7XG5cdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlciBmb3IgcmVtb3ZhbFxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0Ly8gaWYgY29uZmlybWVkLCByZW1vdmUgdGhlIGVtYWlsIGFuZCBzdWJtaXQgdGhlIGZvcm1cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGknICkuZmFkZU91dCggJ25vcm1hbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cblx0XHRcdFx0Ly9jb25zb2xlLmxvZyggJ3ZhbHVlIGlzICcgKyBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnICkuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvbiBhLWJ1dHRvbi1hZGQtdXNlci1lbWFpbFwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRuZXh0RW1haWxDb3VudCsrO1xuXHR9ICk7XG5cblx0JCggJ2lucHV0W3R5cGU9c3VibWl0XScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGJ1dHRvbiA9ICQoIHRoaXMgKTtcblx0XHR2YXIgYnV0dG9uRm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCAnZm9ybScgKTtcblx0XHRidXR0b25Gb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicsIGJ1dHRvbi52YWwoKSApO1xuXHR9ICk7XG5cblx0JCggJy5tLWVudHJ5LWNvbnRlbnQnICkub24oICdzdWJtaXQnLCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgZm9ybSA9ICQoIHRoaXMgKTtcblx0XHR2YXIgc3VibWl0dGluZ0J1dHRvbiA9IGZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJyApIHx8ICcnO1xuXG5cdFx0Ly8gaWYgdGhlcmUgaXMgbm8gc3VibWl0dGluZyBidXR0b24sIHBhc3MgaXQgYnkgQWpheFxuXHRcdGlmICggJycgPT09IHN1Ym1pdHRpbmdCdXR0b24gfHwgJ1NhdmUgQ2hhbmdlcycgIT09IHN1Ym1pdHRpbmdCdXR0b24gKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheEZvcm1EYXRhID0gZm9ybS5zZXJpYWxpemUoKTsgLy9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheEZvcm1EYXRhID0gYWpheEZvcm1EYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogZnVsbFVybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Qubm9uY2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0ZGF0YTogYWpheEZvcm1EYXRhXG5cdFx0XHR9ICkuZG9uZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5ld0VtYWlscyA9ICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKS5tYXAoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdH0gKS5nZXQoKTtcblx0XHRcdFx0JC5lYWNoKCBuZXdFbWFpbHMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSBuZXh0RW1haWxDb3VudCArIGluZGV4O1xuXHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkuYXBwZW5kKCAnPGxpIGlkPVwidXNlci1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtZW1haWwtcHJlZmVyZW5jZXNcIj48YSBocmVmPVwiL25ld3NsZXR0ZXJzLz9lbWFpbD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCB2YWx1ZSApICsgJ1wiPjxzbWFsbD5FbWFpbCBQcmVmZXJlbmNlczwvc21hbGw+PC9hPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLXJlbW92ZS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwicmVtb3ZlX2VtYWlsWycgKyBuZXh0RW1haWxDb3VudCArICddXCIgaWQ9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5SZW1vdmU8L3NtYWxsPjwvbGFiZWw+PC9saT48L3VsPjwvbGk+JyApO1xuXHRcdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCAkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCgpICsgJywnICsgdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggMCA9PT0gJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIGl0IHdvdWxkIGJlIG5pY2UgdG8gb25seSBsb2FkIHRoZSBmb3JtLCBidXQgdGhlbiBjbGljayBldmVudHMgc3RpbGwgZG9uJ3Qgd29ya1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIGFkZEF1dG9SZXNpemUoKSB7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICdbZGF0YS1hdXRvcmVzaXplXScgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRlbGVtZW50LnN0eWxlLmJveFNpemluZyA9ICdib3JkZXItYm94Jztcblx0XHR2YXIgb2Zmc2V0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgLSBlbGVtZW50LmNsaWVudEhlaWdodDtcblx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnRhcmdldC5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG5cdFx0XHRldmVudC50YXJnZXQuc3R5bGUuaGVpZ2h0ID0gZXZlbnQudGFyZ2V0LnNjcm9sbEhlaWdodCArIG9mZnNldCArICdweCc7XG5cdFx0fSApO1xuXHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCAnZGF0YS1hdXRvcmVzaXplJyApO1xuXHR9ICk7XG59XG5cbiQoIGRvY3VtZW50ICkuYWpheFN0b3AoIGZ1bmN0aW9uKCkge1xuXHR2YXIgY29tbWVudEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnI2xsY19jb21tZW50cycgKTtcblx0aWYgKCBudWxsICE9PSBjb21tZW50QXJlYSApIHtcblx0XHRhZGRBdXRvUmVzaXplKCk7XG5cdH1cbn0gKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKCAwIDwgJCggJy5tLWZvcm0tYWNjb3VudC1zZXR0aW5ncycgKS5sZW5ndGggKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cblx0dmFyIGF1dG9SZXNpemVUZXh0YXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICdbZGF0YS1hdXRvcmVzaXplXScgKTtcblx0aWYgKCBudWxsICE9PSBhdXRvUmVzaXplVGV4dGFyZWEgKSB7XG5cdFx0YWRkQXV0b1Jlc2l6ZSgpO1xuXHR9XG59ICk7XG5cbnZhciBmb3JtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1mb3JtJyApO1xuZm9ybXMuZm9yRWFjaCggZnVuY3Rpb24oIGZvcm0gKSB7XG5cdFZhbGlkRm9ybSggZm9ybSwge1xuXHRcdHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzOiAnbS1oYXMtdmFsaWRhdGlvbi1lcnJvcicsXG5cdFx0dmFsaWRhdGlvbkVycm9yQ2xhc3M6ICdhLXZhbGlkYXRpb24tZXJyb3InLFxuXHRcdGludmFsaWRDbGFzczogJ2EtZXJyb3InLFxuXHRcdGVycm9yUGxhY2VtZW50OiAnYWZ0ZXInXG5cdH0gKTtcbn0gKTtcblxudmFyIGZvcm0gPSAkKCAnLm0tZm9ybScgKTtcblxuLy8gbGlzdGVuIGZvciBgaW52YWxpZGAgZXZlbnRzIG9uIGFsbCBmb3JtIGlucHV0c1xuZm9ybS5maW5kKCAnOmlucHV0JyApLm9uKCAnaW52YWxpZCcsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbnB1dCA9ICQoIHRoaXMgKTtcblxuICAgIC8vIHRoZSBmaXJzdCBpbnZhbGlkIGVsZW1lbnQgaW4gdGhlIGZvcm1cblx0dmFyIGZpcnN0ID0gZm9ybS5maW5kKCAnLmEtZXJyb3InICkuZmlyc3QoKTtcblxuXHQvLyB0aGUgZm9ybSBpdGVtIHRoYXQgY29udGFpbnMgaXRcblx0dmFyIGZpcnN0X2hvbGRlciA9IGZpcnN0LnBhcmVudCgpO1xuXG4gICAgLy8gb25seSBoYW5kbGUgaWYgdGhpcyBpcyB0aGUgZmlyc3QgaW52YWxpZCBpbnB1dFxuICAgIGlmICggaW5wdXRbMF0gPT09IGZpcnN0WzBdICkge1xuXG4gICAgICAgIC8vIGhlaWdodCBvZiB0aGUgbmF2IGJhciBwbHVzIHNvbWUgcGFkZGluZyBpZiB0aGVyZSdzIGEgZml4ZWQgbmF2XG4gICAgICAgIC8vdmFyIG5hdmJhckhlaWdodCA9IG5hdmJhci5oZWlnaHQoKSArIDUwXG5cbiAgICAgICAgLy8gdGhlIHBvc2l0aW9uIHRvIHNjcm9sbCB0byAoYWNjb3VudGluZyBmb3IgdGhlIG5hdmJhciBpZiBpdCBleGlzdHMpXG4gICAgICAgIHZhciBlbGVtZW50T2Zmc2V0ID0gZmlyc3RfaG9sZGVyLm9mZnNldCgpLnRvcDtcblxuICAgICAgICAvLyB0aGUgY3VycmVudCBzY3JvbGwgcG9zaXRpb24gKGFjY291bnRpbmcgZm9yIHRoZSBuYXZiYXIpXG4gICAgICAgIHZhciBwYWdlT2Zmc2V0ID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuXG4gICAgICAgIC8vIGRvbid0IHNjcm9sbCBpZiB0aGUgZWxlbWVudCBpcyBhbHJlYWR5IGluIHZpZXdcbiAgICAgICAgaWYgKCBlbGVtZW50T2Zmc2V0ID4gcGFnZU9mZnNldCAmJiBlbGVtZW50T2Zmc2V0IDwgcGFnZU9mZnNldCArIHdpbmRvdy5pbm5lckhlaWdodCApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm90ZTogYXZvaWQgdXNpbmcgYW5pbWF0ZSwgYXMgaXQgcHJldmVudHMgdGhlIHZhbGlkYXRpb24gbWVzc2FnZSBkaXNwbGF5aW5nIGNvcnJlY3RseVxuICAgICAgICAkKCAnaHRtbCwgYm9keScgKS5zY3JvbGxUb3AoIGVsZW1lbnRPZmZzZXQgKTtcbiAgICB9XG59ICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIGNvbW1lbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8vIGJhc2VkIG9uIHdoaWNoIGJ1dHRvbiB3YXMgY2xpY2tlZCwgc2V0IHRoZSB2YWx1ZXMgZm9yIHRoZSBhbmFseXRpY3MgZXZlbnQgYW5kIGNyZWF0ZSBpdFxuZnVuY3Rpb24gdHJhY2tTaG93Q29tbWVudHMoIGFsd2F5cywgaWQsIGNsaWNrVmFsdWUgKSB7XG5cdHZhciBhY3Rpb24gICAgICAgICAgPSAnJztcblx0dmFyIGNhdGVnb3J5UHJlZml4ID0gJyc7XG5cdHZhciBjYXRlZ29yeVN1ZmZpeCA9ICcnO1xuXHR2YXIgcG9zaXRpb24gICAgICAgID0gJyc7XG5cdHBvc2l0aW9uID0gaWQucmVwbGFjZSggJ2Fsd2F5cy1zaG93LWNvbW1lbnRzLScsICcnICk7XG5cdGlmICggJzEnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPbic7XG5cdH0gZWxzZSBpZiAoICcwJyA9PT0gY2xpY2tWYWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5UHJlZml4ID0gJ0Fsd2F5cyAnO1xuXHR9XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24uY2hhckF0KCAwICkudG9VcHBlckNhc2UoKSArIHBvc2l0aW9uLnNsaWNlKCAxICk7XG5cdFx0Y2F0ZWdvcnlTdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnlQcmVmaXggKyAnU2hvdyBDb21tZW50cycgKyBjYXRlZ29yeVN1ZmZpeCwgYWN0aW9uLCBsb2NhdGlvbi5wYXRobmFtZSApO1xufVxuXG4vLyB3aGVuIHNob3dpbmcgY29tbWVudHMgb25jZSwgdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtYnV0dG9uLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dHJhY2tTaG93Q29tbWVudHMoIGZhbHNlLCAnJywgJycgKTtcbn0gKTtcblxuLy8gU2V0IHVzZXIgbWV0YSB2YWx1ZSBmb3IgYWx3YXlzIHNob3dpbmcgY29tbWVudHMgaWYgdGhhdCBidXR0b24gaXMgY2xpY2tlZFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHZhciB0aGF0ID0gJCggdGhpcyApO1xuXHRpZiAoIHRoYXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gZWxzZSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuXHR0cmFja1Nob3dDb21tZW50cyggdHJ1ZSwgdGhhdC5hdHRyKCAnaWQnICksIHRoYXQudmFsKCkgKTtcblxuXHQvLyB3ZSBhbHJlYWR5IGhhdmUgYWpheHVybCBmcm9tIHRoZSB0aGVtZVxuXHQkLmFqYXgoIHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBwYXJhbXMuYWpheHVybCxcblx0XHRkYXRhOiB7XG5cdFx0XHQnYWN0aW9uJzogJ21pbm5wb3N0X2xhcmdvX2xvYWRfY29tbWVudHNfc2V0X3VzZXJfbWV0YScsXG5cdFx0XHQndmFsdWUnOiB0aGF0LnZhbCgpXG5cdFx0fSxcblx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHQkKCAnLmEtYWx3YXlzLXNob3ctY29tbWVudHMtcmVzdWx0JywgdGhhdC5wYXJlbnQoKSApLmh0bWwoIHJlc3BvbnNlLmRhdGEubWVzc2FnZSApO1xuXHRcdFx0aWYgKCB0cnVlID09PSByZXNwb25zZS5kYXRhLnNob3cgKSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDAgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDEgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcbn0gKTtcblxuISAoIGZ1bmN0aW9uKCBkICkge1xuXHRpZiAoICEgZC5jdXJyZW50U2NyaXB0ICkge1xuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0YWN0aW9uOiAnbGxjX2xvYWRfY29tbWVudHMnLFxuXHRcdFx0cG9zdDogJCggJyNsbGNfcG9zdF9pZCcgKS52YWwoKVxuXHRcdH07XG5cblx0XHQvLyBBamF4IHJlcXVlc3QgbGluay5cblx0XHR2YXIgbGxjYWpheHVybCA9ICQoICcjbGxjX2FqYXhfdXJsJyApLnZhbCgpO1xuXG5cdFx0Ly8gRnVsbCB1cmwgdG8gZ2V0IGNvbW1lbnRzIChBZGRpbmcgcGFyYW1ldGVycykuXG5cdFx0dmFyIGNvbW1lbnRVcmwgPSBsbGNhamF4dXJsICsgJz8nICsgJC5wYXJhbSggZGF0YSApO1xuXG5cdFx0Ly8gUGVyZm9ybSBhamF4IHJlcXVlc3QuXG5cdFx0JC5nZXQoIGNvbW1lbnRVcmwsIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdGlmICggJycgIT09IHJlc3BvbnNlICkge1xuXHRcdFx0XHQkKCAnI2xsY19jb21tZW50cycgKS5odG1sKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgY29tbWVudHMgYWZ0ZXIgbGF6eSBsb2FkaW5nLlxuXHRcdFx0XHRpZiAoIHdpbmRvdy5hZGRDb21tZW50ICYmIHdpbmRvdy5hZGRDb21tZW50LmluaXQgKSB7XG5cdFx0XHRcdFx0d2luZG93LmFkZENvbW1lbnQuaW5pdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gR2V0IHRoZSBjb21tZW50IGxpIGlkIGZyb20gdXJsIGlmIGV4aXN0LlxuXHRcdFx0XHR2YXIgY29tbWVudElkID0gZG9jdW1lbnQuVVJMLnN1YnN0ciggZG9jdW1lbnQuVVJMLmluZGV4T2YoICcjY29tbWVudCcgKSApO1xuXG5cdFx0XHRcdC8vIElmIGNvbW1lbnQgaWQgZm91bmQsIHNjcm9sbCB0byB0aGF0IGNvbW1lbnQuXG5cdFx0XHRcdGlmICggLTEgPCBjb21tZW50SWQuaW5kZXhPZiggJyNjb21tZW50JyApICkge1xuXHRcdFx0XHRcdCQoIHdpbmRvdyApLnNjcm9sbFRvcCggJCggY29tbWVudElkICkub2Zmc2V0KCkudG9wICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cbn0oIGRvY3VtZW50ICkgKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgZXZlbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG5jb25zdCB0YXJnZXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5hLWV2ZW50cy1jYWwtbGlua3MnICk7XG50YXJnZXRzLmZvckVhY2goIGZ1bmN0aW9uKCB0YXJnZXQgKSB7XG4gICAgc2V0Q2FsZW5kYXIoIHRhcmdldCApO1xufSApO1xuXG5mdW5jdGlvbiBzZXRDYWxlbmRhciggdGFyZ2V0ICkge1xuICAgIGlmICggbnVsbCAhPT0gdGFyZ2V0ICkge1xuICAgICAgICB2YXIgbGkgICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2xpJyApO1xuICAgICAgICBsaS5pbm5lckhUTUwgID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLWNhbGVuZGFyXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG4gICAgICAgIHZhciBmcmFnbWVudCAgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGxpLnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggbGkgKTtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xuICAgIH1cbn1cblxuY29uc3QgY2FsZW5kYXJzVmlzaWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1ldmVudC1kYXRldGltZSBhJyApO1xuY2FsZW5kYXJzVmlzaWJsZS5mb3JFYWNoKCBmdW5jdGlvbiggY2FsZW5kYXJWaXNpYmxlICkge1xuICAgIHNob3dDYWxlbmRhciggY2FsZW5kYXJWaXNpYmxlICk7XG59ICk7XG5cbmZ1bmN0aW9uIHNob3dDYWxlbmRhciggY2FsZW5kYXJWaXNpYmxlICkge1xuICAgIGNvbnN0IGRhdGVIb2xkZXIgPSBjYWxlbmRhclZpc2libGUuY2xvc2VzdCggJy5tLWV2ZW50LWRhdGUtYW5kLWNhbGVuZGFyJyApO1xuICAgIGNvbnN0IGNhbGVuZGFyVHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcbiAgICAgICAgZWxlbWVudDogZGF0ZUhvbGRlci5xdWVyeVNlbGVjdG9yKCAnLmEtZXZlbnRzLWNhbC1saW5rcycgKSxcbiAgICAgICAgdmlzaWJsZUNsYXNzOiAnYS1ldmVudHMtY2FsLWxpbmstdmlzaWJsZScsXG4gICAgICAgIGRpc3BsYXlWYWx1ZTogJ2Jsb2NrJ1xuICAgIH0gKTtcblxuICAgIGlmICggbnVsbCAhPT0gY2FsZW5kYXJWaXNpYmxlICkge1xuICAgICAgICBjYWxlbmRhclZpc2libGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IGNhbGVuZGFyVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuICAgICAgICAgICAgY2FsZW5kYXJWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgICAgICAgICBpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKTtcblxuICAgICAgICB2YXIgY2FsZW5kYXJDbG9zZSA9IGRhdGVIb2xkZXIucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLWNhbGVuZGFyJyApO1xuICAgICAgICBpZiAoIG51bGwgIT09IGNhbGVuZGFyQ2xvc2UgKSB7XG4gICAgICAgICAgICBjYWxlbmRhckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IGNhbGVuZGFyVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICAgICAgICAgIGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
}(jQuery));
