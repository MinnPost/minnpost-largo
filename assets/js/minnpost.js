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
  // for analytics
  wp.hooks.addAction('wpMessageInserterAnalyticsEvent', 'minnpostLargo', mpAnalyticsTrackingEvent, 10);
  wp.hooks.addAction('minnpostFormProcessorMailchimpAnalyticsEvent', 'minnpostLargo', mpAnalyticsTrackingEvent, 10);
  wp.hooks.addAction('minnpostMembershipAnalyticsEvent', 'minnpostLargo', mpAnalyticsTrackingEvent, 10);
  wp.hooks.addAction('minnpostMembershipAnalyticsEcommerceAction', 'minnpostLargo', mpAnalyticsTrackingEcommerceAction, 10);

  // for data layer to Google Tag Manager
  wp.hooks.addAction('wpMessageInserterDataLayerEvent', 'minnpostLargo', mpDataLayerEvent, 10);
  wp.hooks.addAction('minnpostFormProcessorMailchimpDataLayerEvent', 'minnpostLargo', mpDataLayerEvent, 10);
  wp.hooks.addAction('minnpostMembershipDataLayerEcommerceAction', 'minnpostLargo', mpDataLayerEcommerce, 10);
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
 * Create a datalayer event for the theme using the gtm4wp plugin. This sets the dataLayer object for Google Tag Manager.
 * It should only have data that is not avaialable to GTM by default.
 * dataLayerContent: the object that should be added
*/
function mpDataLayerEvent(dataLayerContent) {
  if ('undefined' !== typeof dataLayer && Object.keys(dataLayerContent).length !== 0) {
    dataLayer.push(dataLayerContent);
  }
}

/*
 * Create a Google Analytics Ecommerce action for the theme. This calls the wp-analytics-tracking-generator action.
 *
*/
function mpAnalyticsTrackingEcommerceAction(type, action, product, step) {
  wp.hooks.doAction('wpAnalyticsTrackingGeneratorEcommerceAction', type, action, product, step);
}

/*
 * Set up dataLayer stuff for ecommerce via Google Tag Manager using the gtm4wp plugin.
 *
*/
function mpDataLayerEcommerce(dataLayerContent) {
  if ('undefined' !== typeof dataLayer && Object.keys(dataLayerContent).length !== 0) {
    dataLayer.push({
      ecommerce: null
    }); // first, make sure there aren't multiple things happening.
    if ('undefined' !== typeof dataLayerContent.action && 'undefined' !== typeof dataLayerContent.product) {
      dataLayer.push({
        event: dataLayerContent.action,
        ecommerce: {
          items: [dataLayerContent.product]
        }
      });
    }
  }
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
 * This file does not require jQuery.
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
setupPrimaryNav();
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
setupScrollNav();

// sidebar link click
document.querySelectorAll('.o-site-sidebar a').forEach(function (sidebarLink) {
  return sidebarLink.addEventListener('click', function (e) {
    var closestWidget = sidebarLink.closest('.m-widget');
    var closestZone = sidebarLink.closest('.m-zone');
    var widgetTitle = '';
    var zoneTitle = '';
    var sidebarSectionTitle = '';
    if (null !== closestWidget) {
      widgetTitle = closestWidget.querySelector('h3').textContent;
    } else if (null !== closestZone) {
      zoneTitle = closestZone.querySelector('.a-zone-title').textContent;
    }
    if (null !== widgetTitle) {
      sidebarSectionTitle = widgetTitle;
    } else if (null !== zoneTitle) {
      sidebarSectionTitle = zoneTitle;
    }
    mpAnalyticsTrackingEvent('event', 'Sidebar Link', 'Click', sidebarSectionTitle);
  });
});

// related section link click
document.querySelectorAll('.m-related a').forEach(function (relatedLink) {
  return relatedLink.addEventListener('click', function (e) {
    mpAnalyticsTrackingEvent('event', 'Related Section Link', 'Click', location.pathname);
  });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDQtdmFsaWQtZm9ybS5taW4uanMiLCIwMC1zdGFydC5qcyIsIjAxLWFuYWx5dGljcy5qcyIsIjAyLXNoYXJlLmpzIiwiMDMtbmF2aWdhdGlvbi5qcyIsIjA0LWZvcm1zLmpzIiwiMDUtY29tbWVudHMuanMiLCIwNi1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImMiLCJyZXF1aXJlIiwidSIsImNvZGUiLCJwIiwiY2FsbCIsIl92YWxpZEZvcm0iLCJfdmFsaWRGb3JtMiIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIlZhbGlkRm9ybSIsInRvZ2dsZUludmFsaWRDbGFzcyIsImhhbmRsZUN1c3RvbU1lc3NhZ2VzIiwiaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiY2xvbmUiLCJkZWZhdWx0cyIsImluc2VydEFmdGVyIiwiaW5zZXJ0QmVmb3JlIiwiZm9yRWFjaCIsImRlYm91bmNlIiwiY29weSIsImF0dHIiLCJoYXNPd25Qcm9wZXJ0eSIsImRlZmF1bHRPYmplY3QiLCJrIiwicmVmTm9kZSIsIm5vZGVUb0luc2VydCIsInNpYmxpbmciLCJuZXh0U2libGluZyIsIl9wYXJlbnQiLCJwYXJlbnQiLCJpdGVtcyIsImZuIiwibXMiLCJkZWJvdW5jZWRGbiIsInZhbGlkRm9ybSIsIl91dGlsIiwiaW5wdXQiLCJpbnZhbGlkQ2xhc3MiLCJ2YWxpZGl0eSIsInZhbGlkIiwiZXJyb3JQcm9wcyIsImdldEN1c3RvbU1lc3NhZ2UiLCJjdXN0b21NZXNzYWdlcyIsImxvY2FsRXJyb3JQcm9wcyIsInR5cGUiLCJjb25jYXQiLCJwcm9wIiwiY2hlY2tWYWxpZGl0eSIsIm1lc3NhZ2UiLCJzZXRDdXN0b21WYWxpZGl0eSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uRXJyb3JDbGFzcyIsInZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzIiwiZXJyb3JQbGFjZW1lbnQiLCJpbnNlcnRFcnJvciIsImVycm9yTm9kZSIsInZhbGlkYXRpb25NZXNzYWdlIiwidGV4dENvbnRlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImRlZmF1bHRPcHRpb25zIiwibm9kZU5hbWUiLCJpbnB1dHMiLCJ0b0xvd2VyQ2FzZSIsImZvY3VzSW52YWxpZElucHV0IiwidmFsaWRGb3JtSW5wdXRzIiwiZm9ybSIsImZvY3VzRmlyc3QiLCJpbnZhbGlkTm9kZSIsImZvY3VzIiwiZG9jdW1lbnRFbGVtZW50Iiwid3AiLCJob29rcyIsImFkZEFjdGlvbiIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFY29tbWVyY2VBY3Rpb24iLCJtcERhdGFMYXllckV2ZW50IiwibXBEYXRhTGF5ZXJFY29tbWVyY2UiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwibm9uX2ludGVyYWN0aW9uIiwiZG9BY3Rpb24iLCJkYXRhTGF5ZXJDb250ZW50IiwiZGF0YUxheWVyIiwia2V5cyIsInB1c2giLCJwcm9kdWN0Iiwic3RlcCIsImVjb21tZXJjZSIsImV2ZW50IiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsInRvcEJ1dHRvbiIsImN1cnJlbnRUYXJnZXQiLCJwcmludEJ1dHRvbiIsInByaW50IiwicmVwdWJsaXNoQnV0dG9uIiwiY29weUJ1dHRvbiIsImNvcHlUZXh0IiwiaHJlZiIsIm5hdmlnYXRvciIsImNsaXBib2FyZCIsIndyaXRlVGV4dCIsInRoZW4iLCJhbnlTaGFyZUJ1dHRvbiIsInVybCIsIm9wZW4iLCJzZXR1cFByaW1hcnlOYXYiLCJwcmltYXJ5TmF2VHJhbnNpdGlvbmVyIiwicHJpbWFyeU5hdlRvZ2dsZSIsImV4cGFuZGVkIiwidXNlck5hdlRyYW5zaXRpb25lciIsInVzZXJOYXZUb2dnbGUiLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCJvbmtleWRvd24iLCJldnQiLCJpc0VzY2FwZSIsImtleSIsImtleUNvZGUiLCJwcmltYXJ5TmF2RXhwYW5kZWQiLCJ1c2VyTmF2RXhwYW5kZWQiLCJzZWFyY2hJc1Zpc2libGUiLCJzZXR1cFNjcm9sbE5hdiIsInN1Yk5hdlNjcm9sbGVycyIsImN1cnJlbnRWYWx1ZSIsInBhZ2luYXRpb25TY3JvbGxlcnMiLCJzaWRlYmFyTGluayIsImNsb3Nlc3RXaWRnZXQiLCJjbG9zZXN0IiwiY2xvc2VzdFpvbmUiLCJ3aWRnZXRUaXRsZSIsInpvbmVUaXRsZSIsInNpZGViYXJTZWN0aW9uVGl0bGUiLCJyZWxhdGVkTGluayIsImpRdWVyeSIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwidHJpbSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCIkIiwicmVzdFJvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxVcmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheEZvcm1EYXRhIiwidGhhdCIsIm9uIiwidmFsIiwicmVwbGFjZSIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJhcHBlbmQiLCJmaXJzdCIsInJlcGxhY2VXaXRoIiwic3VibWl0IiwiZWFjaCIsImdldCIsInBhcmVudHMiLCJmYWRlT3V0Iiwiam9pbiIsImJlZm9yZSIsImNsaWNrIiwiYnV0dG9uIiwiYnV0dG9uRm9ybSIsImRhdGEiLCJzdWJtaXR0aW5nQnV0dG9uIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRvbmUiLCJtYXAiLCJpbmRleCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsImFkZEF1dG9SZXNpemUiLCJib3hTaXppbmciLCJvZmZzZXQiLCJjbGllbnRIZWlnaHQiLCJoZWlnaHQiLCJzY3JvbGxIZWlnaHQiLCJhamF4U3RvcCIsImNvbW1lbnRBcmVhIiwiYXV0b1Jlc2l6ZVRleHRhcmVhIiwiZm9ybXMiLCJmaW5kIiwiZmlyc3RfaG9sZGVyIiwiZWxlbWVudE9mZnNldCIsInBhZ2VPZmZzZXQiLCJwYWdlWU9mZnNldCIsInNjcm9sbFRvcCIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiaWQiLCJjbGlja1ZhbHVlIiwiY2F0ZWdvcnlQcmVmaXgiLCJjYXRlZ29yeVN1ZmZpeCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJpcyIsInBhcmFtcyIsImFqYXh1cmwiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJodG1sIiwiY3VycmVudFNjcmlwdCIsInBvc3QiLCJsbGNhamF4dXJsIiwiY29tbWVudFVybCIsInBhcmFtIiwiYWRkQ29tbWVudCIsImNvbW1lbnRJZCIsIlVSTCIsInN1YnN0ciIsImluZGV4T2YiLCJ0YXJnZXRzIiwic2V0Q2FsZW5kYXIiLCJsaSIsImNhbGVuZGFyc1Zpc2libGUiLCJjYWxlbmRhclZpc2libGUiLCJzaG93Q2FsZW5kYXIiLCJkYXRlSG9sZGVyIiwiY2FsZW5kYXJUcmFuc2l0aW9uZXIiLCJjYWxlbmRh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LENBQUMsQ0FBRTtJQUNQO0VBQ0o7QUFDSiIsImZpbGUiOiJtaW5ucG9zdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHRsaXRlKHQpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIixmdW5jdGlvbihlKXt2YXIgaT1lLnRhcmdldCxuPXQoaSk7bnx8KG49KGk9aS5wYXJlbnRFbGVtZW50KSYmdChpKSksbiYmdGxpdGUuc2hvdyhpLG4sITApfSl9dGxpdGUuc2hvdz1mdW5jdGlvbih0LGUsaSl7dmFyIG49XCJkYXRhLXRsaXRlXCI7ZT1lfHx7fSwodC50b29sdGlwfHxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIG8oKXt0bGl0ZS5oaWRlKHQsITApfWZ1bmN0aW9uIGwoKXtyfHwocj1mdW5jdGlvbih0LGUsaSl7ZnVuY3Rpb24gbigpe28uY2xhc3NOYW1lPVwidGxpdGUgdGxpdGUtXCIrcitzO3ZhciBlPXQub2Zmc2V0VG9wLGk9dC5vZmZzZXRMZWZ0O28ub2Zmc2V0UGFyZW50PT09dCYmKGU9aT0wKTt2YXIgbj10Lm9mZnNldFdpZHRoLGw9dC5vZmZzZXRIZWlnaHQsZD1vLm9mZnNldEhlaWdodCxmPW8ub2Zmc2V0V2lkdGgsYT1pK24vMjtvLnN0eWxlLnRvcD0oXCJzXCI9PT1yP2UtZC0xMDpcIm5cIj09PXI/ZStsKzEwOmUrbC8yLWQvMikrXCJweFwiLG8uc3R5bGUubGVmdD0oXCJ3XCI9PT1zP2k6XCJlXCI9PT1zP2krbi1mOlwid1wiPT09cj9pK24rMTA6XCJlXCI9PT1yP2ktZi0xMDphLWYvMikrXCJweFwifXZhciBvPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpLGw9aS5ncmF2fHx0LmdldEF0dHJpYnV0ZShcImRhdGEtdGxpdGVcIil8fFwiblwiO28uaW5uZXJIVE1MPWUsdC5hcHBlbmRDaGlsZChvKTt2YXIgcj1sWzBdfHxcIlwiLHM9bFsxXXx8XCJcIjtuKCk7dmFyIGQ9by5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm5cInNcIj09PXImJmQudG9wPDA/KHI9XCJuXCIsbigpKTpcIm5cIj09PXImJmQuYm90dG9tPndpbmRvdy5pbm5lckhlaWdodD8ocj1cInNcIixuKCkpOlwiZVwiPT09ciYmZC5sZWZ0PDA/KHI9XCJ3XCIsbigpKTpcIndcIj09PXImJmQucmlnaHQ+d2luZG93LmlubmVyV2lkdGgmJihyPVwiZVwiLG4oKSksby5jbGFzc05hbWUrPVwiIHRsaXRlLXZpc2libGVcIixvfSh0LGQsZSkpfXZhciByLHMsZDtyZXR1cm4gdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsbyksdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLG8pLHQudG9vbHRpcD17c2hvdzpmdW5jdGlvbigpe2Q9dC50aXRsZXx8dC5nZXRBdHRyaWJ1dGUobil8fGQsdC50aXRsZT1cIlwiLHQuc2V0QXR0cmlidXRlKG4sXCJcIiksZCYmIXMmJihzPXNldFRpbWVvdXQobCxpPzE1MDoxKSl9LGhpZGU6ZnVuY3Rpb24odCl7aWYoaT09PXQpe3M9Y2xlYXJUaW1lb3V0KHMpO3ZhciBlPXImJnIucGFyZW50Tm9kZTtlJiZlLnJlbW92ZUNoaWxkKHIpLHI9dm9pZCAwfX19fSh0LGUpKS5zaG93KCl9LHRsaXRlLmhpZGU9ZnVuY3Rpb24odCxlKXt0LnRvb2x0aXAmJnQudG9vbHRpcC5oaWRlKGUpfSxcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmKG1vZHVsZS5leHBvcnRzPXRsaXRlKTsiLCIvKiogXG4gKiBMaWJyYXJ5IGNvZGVcbiAqIFVzaW5nIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL0BjbG91ZGZvdXIvdHJhbnNpdGlvbi1oaWRkZW4tZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KHtcbiAgZWxlbWVudCxcbiAgdmlzaWJsZUNsYXNzLFxuICB3YWl0TW9kZSA9ICd0cmFuc2l0aW9uZW5kJyxcbiAgdGltZW91dER1cmF0aW9uLFxuICBoaWRlTW9kZSA9ICdoaWRkZW4nLFxuICBkaXNwbGF5VmFsdWUgPSAnYmxvY2snXG59KSB7XG4gIGlmICh3YWl0TW9kZSA9PT0gJ3RpbWVvdXQnICYmIHR5cGVvZiB0aW1lb3V0RHVyYXRpb24gIT09ICdudW1iZXInKSB7XG4gICAgY29uc29sZS5lcnJvcihgXG4gICAgICBXaGVuIGNhbGxpbmcgdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQgd2l0aCB3YWl0TW9kZSBzZXQgdG8gdGltZW91dCxcbiAgICAgIHlvdSBtdXN0IHBhc3MgaW4gYSBudW1iZXIgZm9yIHRpbWVvdXREdXJhdGlvbi5cbiAgICBgKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIERvbid0IHdhaXQgZm9yIGV4aXQgdHJhbnNpdGlvbnMgaWYgYSB1c2VyIHByZWZlcnMgcmVkdWNlZCBtb3Rpb24uXG4gIC8vIElkZWFsbHkgdHJhbnNpdGlvbnMgd2lsbCBiZSBkaXNhYmxlZCBpbiBDU1MsIHdoaWNoIG1lYW5zIHdlIHNob3VsZCBub3Qgd2FpdFxuICAvLyBiZWZvcmUgYWRkaW5nIGBoaWRkZW5gLlxuICBpZiAod2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJykubWF0Y2hlcykge1xuICAgIHdhaXRNb2RlID0gJ2ltbWVkaWF0ZSc7XG4gIH1cblxuICAvKipcbiAgICogQW4gZXZlbnQgbGlzdGVuZXIgdG8gYWRkIGBoaWRkZW5gIGFmdGVyIG91ciBhbmltYXRpb25zIGNvbXBsZXRlLlxuICAgKiBUaGlzIGxpc3RlbmVyIHdpbGwgcmVtb3ZlIGl0c2VsZiBhZnRlciBjb21wbGV0aW5nLlxuICAgKi9cbiAgY29uc3QgbGlzdGVuZXIgPSBlID0+IHtcbiAgICAvLyBDb25maXJtIGB0cmFuc2l0aW9uZW5kYCB3YXMgY2FsbGVkIG9uICBvdXIgYGVsZW1lbnRgIGFuZCBkaWRuJ3QgYnViYmxlXG4gICAgLy8gdXAgZnJvbSBhIGNoaWxkIGVsZW1lbnQuXG4gICAgaWYgKGUudGFyZ2V0ID09PSBlbGVtZW50KSB7XG4gICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcblxuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhcHBseUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVtb3ZlSGlkZGVuQXR0cmlidXRlcyA9ICgpID0+IHtcbiAgICBpZihoaWRlTW9kZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5VmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC8qKlxuICAgICAqIFNob3cgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICB0cmFuc2l0aW9uU2hvdygpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhpcyBsaXN0ZW5lciBzaG91bGRuJ3QgYmUgaGVyZSBidXQgaWYgc29tZW9uZSBzcGFtcyB0aGUgdG9nZ2xlXG4gICAgICAgKiBvdmVyIGFuZCBvdmVyIHJlYWxseSBmYXN0IGl0IGNhbiBpbmNvcnJlY3RseSBzdGljayBhcm91bmQuXG4gICAgICAgKiBXZSByZW1vdmUgaXQganVzdCB0byBiZSBzYWZlLlxuICAgICAgICovXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG5cbiAgICAgIC8qKlxuICAgICAgICogU2ltaWxhcmx5LCB3ZSdsbCBjbGVhciB0aGUgdGltZW91dCBpbiBjYXNlIGl0J3Mgc3RpbGwgaGFuZ2luZyBhcm91bmQuXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgICB9XG5cbiAgICAgIHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMoKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBGb3JjZSBhIGJyb3dzZXIgcmUtcGFpbnQgc28gdGhlIGJyb3dzZXIgd2lsbCByZWFsaXplIHRoZVxuICAgICAgICogZWxlbWVudCBpcyBubyBsb25nZXIgYGhpZGRlbmAgYW5kIGFsbG93IHRyYW5zaXRpb25zLlxuICAgICAgICovXG4gICAgICBjb25zdCByZWZsb3cgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHZpc2libGVDbGFzcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEhpZGUgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICB0cmFuc2l0aW9uSGlkZSgpIHtcbiAgICAgIGlmICh3YWl0TW9kZSA9PT0gJ3RyYW5zaXRpb25lbmQnKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICAgIH0gZWxzZSBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0Jykge1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgICAgfSwgdGltZW91dER1cmF0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdGhpcyBjbGFzcyB0byB0cmlnZ2VyIG91ciBhbmltYXRpb25cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgdGhlIGVsZW1lbnQncyB2aXNpYmlsaXR5XG4gICAgICovXG4gICAgdG9nZ2xlKCkge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oKSkge1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRlbGwgd2hldGhlciB0aGUgZWxlbWVudCBpcyBoaWRkZW4gb3Igbm90LlxuICAgICAqL1xuICAgIGlzSGlkZGVuKCkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgaGlkZGVuIGF0dHJpYnV0ZSBkb2VzIG5vdCByZXF1aXJlIGEgdmFsdWUuIFNpbmNlIGFuIGVtcHR5IHN0cmluZyBpc1xuICAgICAgICogZmFsc3ksIGJ1dCBzaG93cyB0aGUgcHJlc2VuY2Ugb2YgYW4gYXR0cmlidXRlIHdlIGNvbXBhcmUgdG8gYG51bGxgXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IGhhc0hpZGRlbkF0dHJpYnV0ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdoaWRkZW4nKSAhPT0gbnVsbDtcblxuICAgICAgY29uc3QgaXNEaXNwbGF5Tm9uZSA9IGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnO1xuXG4gICAgICBjb25zdCBoYXNWaXNpYmxlQ2xhc3MgPSBbLi4uZWxlbWVudC5jbGFzc0xpc3RdLmluY2x1ZGVzKHZpc2libGVDbGFzcyk7XG5cbiAgICAgIHJldHVybiBoYXNIaWRkZW5BdHRyaWJ1dGUgfHwgaXNEaXNwbGF5Tm9uZSB8fCAhaGFzVmlzaWJsZUNsYXNzO1xuICAgIH0sXG5cbiAgICAvLyBBIHBsYWNlaG9sZGVyIGZvciBvdXIgYHRpbWVvdXRgXG4gICAgdGltZW91dDogbnVsbFxuICB9O1xufSIsIi8qKlxuICBQcmlvcml0eSsgaG9yaXpvbnRhbCBzY3JvbGxpbmcgbWVudS5cblxuICBAcGFyYW0ge09iamVjdH0gb2JqZWN0IC0gQ29udGFpbmVyIGZvciBhbGwgb3B0aW9ucy5cbiAgICBAcGFyYW0ge3N0cmluZyB8fCBET00gbm9kZX0gc2VsZWN0b3IgLSBFbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBuYXZTZWxlY3RvciAtIE5hdiBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50U2VsZWN0b3IgLSBDb250ZW50IGVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGl0ZW1TZWxlY3RvciAtIEl0ZW1zIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBidXR0b25MZWZ0U2VsZWN0b3IgLSBMZWZ0IGJ1dHRvbiBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uUmlnaHRTZWxlY3RvciAtIFJpZ2h0IGJ1dHRvbiBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge2ludGVnZXIgfHwgc3RyaW5nfSBzY3JvbGxTdGVwIC0gQW1vdW50IHRvIHNjcm9sbCBvbiBidXR0b24gY2xpY2suICdhdmVyYWdlJyBnZXRzIHRoZSBhdmVyYWdlIGxpbmsgd2lkdGguXG4qL1xuXG5jb25zdCBQcmlvcml0eU5hdlNjcm9sbGVyID0gZnVuY3Rpb24oe1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyJyxcbiAgICBuYXZTZWxlY3RvcjogbmF2U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1uYXYnLFxuICAgIGNvbnRlbnRTZWxlY3RvcjogY29udGVudFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItY29udGVudCcsXG4gICAgaXRlbVNlbGVjdG9yOiBpdGVtU2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1pdGVtJyxcbiAgICBidXR0b25MZWZ0U2VsZWN0b3I6IGJ1dHRvbkxlZnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWJ0bi0tbGVmdCcsXG4gICAgYnV0dG9uUmlnaHRTZWxlY3RvcjogYnV0dG9uUmlnaHRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWJ0bi0tcmlnaHQnLFxuICAgIHNjcm9sbFN0ZXA6IHNjcm9sbFN0ZXAgPSA4MFxuICB9ID0ge30pIHtcblxuICBjb25zdCBuYXZTY3JvbGxlciA9IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSA6IHNlbGVjdG9yO1xuXG4gIGNvbnN0IHZhbGlkYXRlU2Nyb2xsU3RlcCA9ICgpID0+IHtcbiAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihzY3JvbGxTdGVwKSB8fCBzY3JvbGxTdGVwID09PSAnYXZlcmFnZSc7XG4gIH1cblxuICBpZiAobmF2U2Nyb2xsZXIgPT09IHVuZGVmaW5lZCB8fCBuYXZTY3JvbGxlciA9PT0gbnVsbCB8fCAhdmFsaWRhdGVTY3JvbGxTdGVwKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGlzIHNvbWV0aGluZyB3cm9uZywgY2hlY2sgeW91ciBvcHRpb25zLicpO1xuICB9XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXJOYXYgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKG5hdlNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3Rvcihjb250ZW50U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckNvbnRlbnRJdGVtcyA9IG5hdlNjcm9sbGVyQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKGl0ZW1TZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyTGVmdCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoYnV0dG9uTGVmdFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJSaWdodCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoYnV0dG9uUmlnaHRTZWxlY3Rvcik7XG5cbiAgbGV0IHNjcm9sbGluZyA9IGZhbHNlO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IDA7XG4gIGxldCBzY3JvbGxBdmFpbGFibGVSaWdodCA9IDA7XG4gIGxldCBzY3JvbGxpbmdEaXJlY3Rpb24gPSAnJztcbiAgbGV0IHNjcm9sbE92ZXJmbG93ID0gJyc7XG4gIGxldCB0aW1lb3V0O1xuXG5cbiAgLy8gU2V0cyBvdmVyZmxvdyBhbmQgdG9nZ2xlIGJ1dHRvbnMgYWNjb3JkaW5nbHlcbiAgY29uc3Qgc2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBzY3JvbGxPdmVyZmxvdyA9IGdldE92ZXJmbG93KCk7XG4gICAgdG9nZ2xlQnV0dG9ucyhzY3JvbGxPdmVyZmxvdyk7XG4gICAgY2FsY3VsYXRlU2Nyb2xsU3RlcCgpO1xuICB9XG5cblxuICAvLyBEZWJvdW5jZSBzZXR0aW5nIHRoZSBvdmVyZmxvdyB3aXRoIHJlcXVlc3RBbmltYXRpb25GcmFtZVxuICBjb25zdCByZXF1ZXN0U2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGltZW91dCkgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRpbWVvdXQpO1xuXG4gICAgdGltZW91dCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgc2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgLy8gR2V0cyB0aGUgb3ZlcmZsb3cgYXZhaWxhYmxlIG9uIHRoZSBuYXYgc2Nyb2xsZXJcbiAgY29uc3QgZ2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgc2Nyb2xsV2lkdGggPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxXaWR0aDtcbiAgICBsZXQgc2Nyb2xsVmlld3BvcnQgPSBuYXZTY3JvbGxlck5hdi5jbGllbnRXaWR0aDtcbiAgICBsZXQgc2Nyb2xsTGVmdCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQ7XG5cbiAgICBzY3JvbGxBdmFpbGFibGVMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICBzY3JvbGxBdmFpbGFibGVSaWdodCA9IHNjcm9sbFdpZHRoIC0gKHNjcm9sbFZpZXdwb3J0ICsgc2Nyb2xsTGVmdCk7XG5cbiAgICAvLyAxIGluc3RlYWQgb2YgMCB0byBjb21wZW5zYXRlIGZvciBudW1iZXIgcm91bmRpbmdcbiAgICBsZXQgc2Nyb2xsTGVmdENvbmRpdGlvbiA9IHNjcm9sbEF2YWlsYWJsZUxlZnQgPiAxO1xuICAgIGxldCBzY3JvbGxSaWdodENvbmRpdGlvbiA9IHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID4gMTtcblxuICAgIC8vIGNvbnNvbGUubG9nKHNjcm9sbFdpZHRoLCBzY3JvbGxWaWV3cG9ydCwgc2Nyb2xsQXZhaWxhYmxlTGVmdCwgc2Nyb2xsQXZhaWxhYmxlUmlnaHQpO1xuXG4gICAgaWYgKHNjcm9sbExlZnRDb25kaXRpb24gJiYgc2Nyb2xsUmlnaHRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAnYm90aCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNjcm9sbExlZnRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAnbGVmdCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ3JpZ2h0JztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gJ25vbmUnO1xuICAgIH1cblxuICB9XG5cblxuICAvLyBDYWxjdWxhdGVzIHRoZSBzY3JvbGwgc3RlcCBiYXNlZCBvbiB0aGUgd2lkdGggb2YgdGhlIHNjcm9sbGVyIGFuZCB0aGUgbnVtYmVyIG9mIGxpbmtzXG4gIGNvbnN0IGNhbGN1bGF0ZVNjcm9sbFN0ZXAgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnKSB7XG4gICAgICBsZXQgc2Nyb2xsVmlld3BvcnROb1BhZGRpbmcgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxXaWR0aCAtIChwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1sZWZ0JykpICsgcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKSkpO1xuXG4gICAgICBsZXQgc2Nyb2xsU3RlcEF2ZXJhZ2UgPSBNYXRoLmZsb29yKHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIC8gbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMubGVuZ3RoKTtcblxuICAgICAgc2Nyb2xsU3RlcCA9IHNjcm9sbFN0ZXBBdmVyYWdlO1xuICAgIH1cbiAgfVxuXG5cbiAgLy8gTW92ZSB0aGUgc2Nyb2xsZXIgd2l0aCBhIHRyYW5zZm9ybVxuICBjb25zdCBtb3ZlU2Nyb2xsZXIgPSBmdW5jdGlvbihkaXJlY3Rpb24pIHtcblxuICAgIGlmIChzY3JvbGxpbmcgPT09IHRydWUgfHwgKHNjcm9sbE92ZXJmbG93ICE9PSBkaXJlY3Rpb24gJiYgc2Nyb2xsT3ZlcmZsb3cgIT09ICdib3RoJykpIHJldHVybjtcblxuICAgIGxldCBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbFN0ZXA7XG4gICAgbGV0IHNjcm9sbEF2YWlsYWJsZSA9IGRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gc2Nyb2xsQXZhaWxhYmxlTGVmdCA6IHNjcm9sbEF2YWlsYWJsZVJpZ2h0O1xuXG4gICAgLy8gSWYgdGhlcmUgd2lsbCBiZSBsZXNzIHRoYW4gMjUlIG9mIHRoZSBsYXN0IHN0ZXAgdmlzaWJsZSB0aGVuIHNjcm9sbCB0byB0aGUgZW5kXG4gICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IChzY3JvbGxTdGVwICogMS43NSkpIHtcbiAgICAgIHNjcm9sbERpc3RhbmNlID0gc2Nyb2xsQXZhaWxhYmxlO1xuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHNjcm9sbERpc3RhbmNlICo9IC0xO1xuXG4gICAgICBpZiAoc2Nyb2xsQXZhaWxhYmxlIDwgc2Nyb2xsU3RlcCkge1xuICAgICAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc25hcC1hbGlnbi1lbmQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgnICsgc2Nyb2xsRGlzdGFuY2UgKyAncHgpJztcblxuICAgIHNjcm9sbGluZ0RpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICBzY3JvbGxpbmcgPSB0cnVlO1xuICB9XG5cblxuICAvLyBTZXQgdGhlIHNjcm9sbGVyIHBvc2l0aW9uIGFuZCByZW1vdmVzIHRyYW5zZm9ybSwgY2FsbGVkIGFmdGVyIG1vdmVTY3JvbGxlcigpIGluIHRoZSB0cmFuc2l0aW9uZW5kIGV2ZW50XG4gIGNvbnN0IHNldFNjcm9sbGVyUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQsIG51bGwpO1xuICAgIHZhciB0cmFuc2Zvcm0gPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd0cmFuc2Zvcm0nKTtcbiAgICB2YXIgdHJhbnNmb3JtVmFsdWUgPSBNYXRoLmFicyhwYXJzZUludCh0cmFuc2Zvcm0uc3BsaXQoJywnKVs0XSkgfHwgMCk7XG5cbiAgICBpZiAoc2Nyb2xsaW5nRGlyZWN0aW9uID09PSAnbGVmdCcpIHtcbiAgICAgIHRyYW5zZm9ybVZhbHVlICo9IC0xO1xuICAgIH1cblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QuYWRkKCduby10cmFuc2l0aW9uJyk7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LnN0eWxlLnRyYW5zZm9ybSA9ICcnO1xuICAgIG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ICsgdHJhbnNmb3JtVmFsdWU7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nLCAnc25hcC1hbGlnbi1lbmQnKTtcblxuICAgIHNjcm9sbGluZyA9IGZhbHNlO1xuICB9XG5cblxuICAvLyBUb2dnbGUgYnV0dG9ucyBkZXBlbmRpbmcgb24gb3ZlcmZsb3dcbiAgY29uc3QgdG9nZ2xlQnV0dG9ucyA9IGZ1bmN0aW9uKG92ZXJmbG93KSB7XG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdsZWZ0Jykge1xuICAgICAgbmF2U2Nyb2xsZXJMZWZ0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG5cbiAgICBpZiAob3ZlcmZsb3cgPT09ICdib3RoJyB8fCBvdmVyZmxvdyA9PT0gJ3JpZ2h0Jykge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlclJpZ2h0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cbiAgfVxuXG5cbiAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgc2V0T3ZlcmZsb3coKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyTmF2LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgIHJlcXVlc3RTZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCAoKSA9PiB7XG4gICAgICBzZXRTY3JvbGxlclBvc2l0aW9uKCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlckxlZnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBtb3ZlU2Nyb2xsZXIoJ2xlZnQnKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyUmlnaHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBtb3ZlU2Nyb2xsZXIoJ3JpZ2h0Jyk7XG4gICAgfSk7XG5cbiAgfTtcblxuXG4gIC8vIFNlbGYgaW5pdFxuICBpbml0KCk7XG5cblxuICAvLyBSZXZlYWwgQVBJXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xuXG59O1xuXG4vL2V4cG9ydCBkZWZhdWx0IFByaW9yaXR5TmF2U2Nyb2xsZXI7XG4iLCIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcInVzZSBzdHJpY3RcIjt2YXIgX3ZhbGlkRm9ybT1yZXF1aXJlKFwiLi9zcmMvdmFsaWQtZm9ybVwiKTt2YXIgX3ZhbGlkRm9ybTI9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdmFsaWRGb3JtKTtmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iail7cmV0dXJuIG9iaiYmb2JqLl9fZXNNb2R1bGU/b2JqOntkZWZhdWx0Om9ian19d2luZG93LlZhbGlkRm9ybT1fdmFsaWRGb3JtMi5kZWZhdWx0O3dpbmRvdy5WYWxpZEZvcm0udG9nZ2xlSW52YWxpZENsYXNzPV92YWxpZEZvcm0udG9nZ2xlSW52YWxpZENsYXNzO3dpbmRvdy5WYWxpZEZvcm0uaGFuZGxlQ3VzdG9tTWVzc2FnZXM9X3ZhbGlkRm9ybS5oYW5kbGVDdXN0b21NZXNzYWdlczt3aW5kb3cuVmFsaWRGb3JtLmhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5PV92YWxpZEZvcm0uaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXl9LHtcIi4vc3JjL3ZhbGlkLWZvcm1cIjozfV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOnRydWV9KTtleHBvcnRzLmNsb25lPWNsb25lO2V4cG9ydHMuZGVmYXVsdHM9ZGVmYXVsdHM7ZXhwb3J0cy5pbnNlcnRBZnRlcj1pbnNlcnRBZnRlcjtleHBvcnRzLmluc2VydEJlZm9yZT1pbnNlcnRCZWZvcmU7ZXhwb3J0cy5mb3JFYWNoPWZvckVhY2g7ZXhwb3J0cy5kZWJvdW5jZT1kZWJvdW5jZTtmdW5jdGlvbiBjbG9uZShvYmope3ZhciBjb3B5PXt9O2Zvcih2YXIgYXR0ciBpbiBvYmope2lmKG9iai5oYXNPd25Qcm9wZXJ0eShhdHRyKSljb3B5W2F0dHJdPW9ialthdHRyXX1yZXR1cm4gY29weX1mdW5jdGlvbiBkZWZhdWx0cyhvYmosZGVmYXVsdE9iamVjdCl7b2JqPWNsb25lKG9ianx8e30pO2Zvcih2YXIgayBpbiBkZWZhdWx0T2JqZWN0KXtpZihvYmpba109PT11bmRlZmluZWQpb2JqW2tdPWRlZmF1bHRPYmplY3Rba119cmV0dXJuIG9ian1mdW5jdGlvbiBpbnNlcnRBZnRlcihyZWZOb2RlLG5vZGVUb0luc2VydCl7dmFyIHNpYmxpbmc9cmVmTm9kZS5uZXh0U2libGluZztpZihzaWJsaW5nKXt2YXIgX3BhcmVudD1yZWZOb2RlLnBhcmVudE5vZGU7X3BhcmVudC5pbnNlcnRCZWZvcmUobm9kZVRvSW5zZXJ0LHNpYmxpbmcpfWVsc2V7cGFyZW50LmFwcGVuZENoaWxkKG5vZGVUb0luc2VydCl9fWZ1bmN0aW9uIGluc2VydEJlZm9yZShyZWZOb2RlLG5vZGVUb0luc2VydCl7dmFyIHBhcmVudD1yZWZOb2RlLnBhcmVudE5vZGU7cGFyZW50Lmluc2VydEJlZm9yZShub2RlVG9JbnNlcnQscmVmTm9kZSl9ZnVuY3Rpb24gZm9yRWFjaChpdGVtcyxmbil7aWYoIWl0ZW1zKXJldHVybjtpZihpdGVtcy5mb3JFYWNoKXtpdGVtcy5mb3JFYWNoKGZuKX1lbHNle2Zvcih2YXIgaT0wO2k8aXRlbXMubGVuZ3RoO2krKyl7Zm4oaXRlbXNbaV0saSxpdGVtcyl9fX1mdW5jdGlvbiBkZWJvdW5jZShtcyxmbil7dmFyIHRpbWVvdXQ9dm9pZCAwO3ZhciBkZWJvdW5jZWRGbj1mdW5jdGlvbiBkZWJvdW5jZWRGbigpe2NsZWFyVGltZW91dCh0aW1lb3V0KTt0aW1lb3V0PXNldFRpbWVvdXQoZm4sbXMpfTtyZXR1cm4gZGVib3VuY2VkRm59fSx7fV0sMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOnRydWV9KTtleHBvcnRzLnRvZ2dsZUludmFsaWRDbGFzcz10b2dnbGVJbnZhbGlkQ2xhc3M7ZXhwb3J0cy5oYW5kbGVDdXN0b21NZXNzYWdlcz1oYW5kbGVDdXN0b21NZXNzYWdlcztleHBvcnRzLmhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5PWhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5O2V4cG9ydHMuZGVmYXVsdD12YWxpZEZvcm07dmFyIF91dGlsPXJlcXVpcmUoXCIuL3V0aWxcIik7ZnVuY3Rpb24gdG9nZ2xlSW52YWxpZENsYXNzKGlucHV0LGludmFsaWRDbGFzcyl7aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImludmFsaWRcIixmdW5jdGlvbigpe2lucHV0LmNsYXNzTGlzdC5hZGQoaW52YWxpZENsYXNzKX0pO2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLGZ1bmN0aW9uKCl7aWYoaW5wdXQudmFsaWRpdHkudmFsaWQpe2lucHV0LmNsYXNzTGlzdC5yZW1vdmUoaW52YWxpZENsYXNzKX19KX12YXIgZXJyb3JQcm9wcz1bXCJiYWRJbnB1dFwiLFwicGF0dGVybk1pc21hdGNoXCIsXCJyYW5nZU92ZXJmbG93XCIsXCJyYW5nZVVuZGVyZmxvd1wiLFwic3RlcE1pc21hdGNoXCIsXCJ0b29Mb25nXCIsXCJ0b29TaG9ydFwiLFwidHlwZU1pc21hdGNoXCIsXCJ2YWx1ZU1pc3NpbmdcIixcImN1c3RvbUVycm9yXCJdO2Z1bmN0aW9uIGdldEN1c3RvbU1lc3NhZ2UoaW5wdXQsY3VzdG9tTWVzc2FnZXMpe2N1c3RvbU1lc3NhZ2VzPWN1c3RvbU1lc3NhZ2VzfHx7fTt2YXIgbG9jYWxFcnJvclByb3BzPVtpbnB1dC50eXBlK1wiTWlzbWF0Y2hcIl0uY29uY2F0KGVycm9yUHJvcHMpO3ZhciB2YWxpZGl0eT1pbnB1dC52YWxpZGl0eTtmb3IodmFyIGk9MDtpPGxvY2FsRXJyb3JQcm9wcy5sZW5ndGg7aSsrKXt2YXIgcHJvcD1sb2NhbEVycm9yUHJvcHNbaV07aWYodmFsaWRpdHlbcHJvcF0pe3JldHVybiBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLVwiK3Byb3ApfHxjdXN0b21NZXNzYWdlc1twcm9wXX19fWZ1bmN0aW9uIGhhbmRsZUN1c3RvbU1lc3NhZ2VzKGlucHV0LGN1c3RvbU1lc3NhZ2VzKXtmdW5jdGlvbiBjaGVja1ZhbGlkaXR5KCl7dmFyIG1lc3NhZ2U9aW5wdXQudmFsaWRpdHkudmFsaWQ/bnVsbDpnZXRDdXN0b21NZXNzYWdlKGlucHV0LGN1c3RvbU1lc3NhZ2VzKTtpbnB1dC5zZXRDdXN0b21WYWxpZGl0eShtZXNzYWdlfHxcIlwiKX1pbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixjaGVja1ZhbGlkaXR5KTtpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW52YWxpZFwiLGNoZWNrVmFsaWRpdHkpfWZ1bmN0aW9uIGhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5KGlucHV0LG9wdGlvbnMpe3ZhciB2YWxpZGF0aW9uRXJyb3JDbGFzcz1vcHRpb25zLnZhbGlkYXRpb25FcnJvckNsYXNzLHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzPW9wdGlvbnMudmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3MsZXJyb3JQbGFjZW1lbnQ9b3B0aW9ucy5lcnJvclBsYWNlbWVudDtmdW5jdGlvbiBjaGVja1ZhbGlkaXR5KG9wdGlvbnMpe3ZhciBpbnNlcnRFcnJvcj1vcHRpb25zLmluc2VydEVycm9yO3ZhciBwYXJlbnROb2RlPWlucHV0LnBhcmVudE5vZGU7dmFyIGVycm9yTm9kZT1wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoXCIuXCIrdmFsaWRhdGlvbkVycm9yQ2xhc3MpfHxkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2lmKCFpbnB1dC52YWxpZGl0eS52YWxpZCYmaW5wdXQudmFsaWRhdGlvbk1lc3NhZ2Upe2Vycm9yTm9kZS5jbGFzc05hbWU9dmFsaWRhdGlvbkVycm9yQ2xhc3M7ZXJyb3JOb2RlLnRleHRDb250ZW50PWlucHV0LnZhbGlkYXRpb25NZXNzYWdlO2lmKGluc2VydEVycm9yKXtlcnJvclBsYWNlbWVudD09PVwiYmVmb3JlXCI/KDAsX3V0aWwuaW5zZXJ0QmVmb3JlKShpbnB1dCxlcnJvck5vZGUpOigwLF91dGlsLmluc2VydEFmdGVyKShpbnB1dCxlcnJvck5vZGUpO3BhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCh2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzcyl9fWVsc2V7cGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzKTtlcnJvck5vZGUucmVtb3ZlKCl9fWlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLGZ1bmN0aW9uKCl7Y2hlY2tWYWxpZGl0eSh7aW5zZXJ0RXJyb3I6ZmFsc2V9KX0pO2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnZhbGlkXCIsZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO2NoZWNrVmFsaWRpdHkoe2luc2VydEVycm9yOnRydWV9KX0pfXZhciBkZWZhdWx0T3B0aW9ucz17aW52YWxpZENsYXNzOlwiaW52YWxpZFwiLHZhbGlkYXRpb25FcnJvckNsYXNzOlwidmFsaWRhdGlvbi1lcnJvclwiLHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzOlwiaGFzLXZhbGlkYXRpb24tZXJyb3JcIixjdXN0b21NZXNzYWdlczp7fSxlcnJvclBsYWNlbWVudDpcImJlZm9yZVwifTtmdW5jdGlvbiB2YWxpZEZvcm0oZWxlbWVudCxvcHRpb25zKXtpZighZWxlbWVudHx8IWVsZW1lbnQubm9kZU5hbWUpe3Rocm93IG5ldyBFcnJvcihcIkZpcnN0IGFyZyB0byB2YWxpZEZvcm0gbXVzdCBiZSBhIGZvcm0sIGlucHV0LCBzZWxlY3QsIG9yIHRleHRhcmVhXCIpfXZhciBpbnB1dHM9dm9pZCAwO3ZhciB0eXBlPWVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtvcHRpb25zPSgwLF91dGlsLmRlZmF1bHRzKShvcHRpb25zLGRlZmF1bHRPcHRpb25zKTtpZih0eXBlPT09XCJmb3JtXCIpe2lucHV0cz1lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYVwiKTtmb2N1c0ludmFsaWRJbnB1dChlbGVtZW50LGlucHV0cyl9ZWxzZSBpZih0eXBlPT09XCJpbnB1dFwifHx0eXBlPT09XCJzZWxlY3RcInx8dHlwZT09PVwidGV4dGFyZWFcIil7aW5wdXRzPVtlbGVtZW50XX1lbHNle3Rocm93IG5ldyBFcnJvcihcIk9ubHkgZm9ybSwgaW5wdXQsIHNlbGVjdCwgb3IgdGV4dGFyZWEgZWxlbWVudHMgYXJlIHN1cHBvcnRlZFwiKX12YWxpZEZvcm1JbnB1dHMoaW5wdXRzLG9wdGlvbnMpfWZ1bmN0aW9uIGZvY3VzSW52YWxpZElucHV0KGZvcm0saW5wdXRzKXt2YXIgZm9jdXNGaXJzdD0oMCxfdXRpbC5kZWJvdW5jZSkoMTAwLGZ1bmN0aW9uKCl7dmFyIGludmFsaWROb2RlPWZvcm0ucXVlcnlTZWxlY3RvcihcIjppbnZhbGlkXCIpO2lmKGludmFsaWROb2RlKWludmFsaWROb2RlLmZvY3VzKCl9KTsoMCxfdXRpbC5mb3JFYWNoKShpbnB1dHMsZnVuY3Rpb24oaW5wdXQpe3JldHVybiBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW52YWxpZFwiLGZvY3VzRmlyc3QpfSl9ZnVuY3Rpb24gdmFsaWRGb3JtSW5wdXRzKGlucHV0cyxvcHRpb25zKXt2YXIgaW52YWxpZENsYXNzPW9wdGlvbnMuaW52YWxpZENsYXNzLGN1c3RvbU1lc3NhZ2VzPW9wdGlvbnMuY3VzdG9tTWVzc2FnZXM7KDAsX3V0aWwuZm9yRWFjaCkoaW5wdXRzLGZ1bmN0aW9uKGlucHV0KXt0b2dnbGVJbnZhbGlkQ2xhc3MoaW5wdXQsaW52YWxpZENsYXNzKTtoYW5kbGVDdXN0b21NZXNzYWdlcyhpbnB1dCxjdXN0b21NZXNzYWdlcyk7aGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkoaW5wdXQsb3B0aW9ucyl9KX19LHtcIi4vdXRpbFwiOjJ9XX0se30sWzFdKTsiLCIvKipcbiAqIERvIHRoZXNlIHRoaW5ncyBhcyBxdWlja2x5IGFzIHBvc3NpYmxlOyB3ZSBtaWdodCBoYXZlIENTUyBvciBlYXJseSBzY3JpcHRzIHRoYXQgcmVxdWlyZSBvbiBpdFxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAnbm8tanMnICk7XG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ2pzJyApO1xuIiwiLyoqXG4gKiBUaGlzIGlzIHVzZWQgdG8gY2F1c2UgR29vZ2xlIEFuYWx5dGljcyBldmVudHMgdG8gcnVuXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG4vKlxuICogQ2FsbCBob29rcyBmcm9tIG90aGVyIHBsYWNlcy5cbiAqIFRoaXMgYWxsb3dzIG90aGVyIHBsdWdpbnMgdGhhdCB3ZSBtYWludGFpbiB0byBwYXNzIGRhdGEgdG8gdGhlIHRoZW1lJ3MgYW5hbHl0aWNzIG1ldGhvZC5cbiovXG5pZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2Ygd3AgKSB7XG5cdC8vIGZvciBhbmFseXRpY3Ncblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnd3BNZXNzYWdlSW5zZXJ0ZXJBbmFseXRpY3NFdmVudCcsICdtaW5ucG9zdExhcmdvJywgbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50LCAxMCApO1xuXHR3cC5ob29rcy5hZGRBY3Rpb24oICdtaW5ucG9zdEZvcm1Qcm9jZXNzb3JNYWlsY2hpbXBBbmFseXRpY3NFdmVudCcsICdtaW5ucG9zdExhcmdvJywgbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50LCAxMCApO1xuXHR3cC5ob29rcy5hZGRBY3Rpb24oICdtaW5ucG9zdE1lbWJlcnNoaXBBbmFseXRpY3NFdmVudCcsICdtaW5ucG9zdExhcmdvJywgbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50LCAxMCApO1xuXHR3cC5ob29rcy5hZGRBY3Rpb24oICdtaW5ucG9zdE1lbWJlcnNoaXBBbmFseXRpY3NFY29tbWVyY2VBY3Rpb24nLCAnbWlubnBvc3RMYXJnbycsIG1wQW5hbHl0aWNzVHJhY2tpbmdFY29tbWVyY2VBY3Rpb24sIDEwICk7XG5cblx0Ly8gZm9yIGRhdGEgbGF5ZXIgdG8gR29vZ2xlIFRhZyBNYW5hZ2VyXG5cdHdwLmhvb2tzLmFkZEFjdGlvbiggJ3dwTWVzc2FnZUluc2VydGVyRGF0YUxheWVyRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wRGF0YUxheWVyRXZlbnQsIDEwICk7XG5cdHdwLmhvb2tzLmFkZEFjdGlvbiggJ21pbm5wb3N0Rm9ybVByb2Nlc3Nvck1haWxjaGltcERhdGFMYXllckV2ZW50JywgJ21pbm5wb3N0TGFyZ28nLCBtcERhdGFMYXllckV2ZW50LCAxMCApO1xuXHR3cC5ob29rcy5hZGRBY3Rpb24oICdtaW5ucG9zdE1lbWJlcnNoaXBEYXRhTGF5ZXJFY29tbWVyY2VBY3Rpb24nLCAnbWlubnBvc3RMYXJnbycsIG1wRGF0YUxheWVyRWNvbW1lcmNlLCAxMCApO1xufVxuXG4vKlxuICogQ3JlYXRlIGEgR29vZ2xlIEFuYWx5dGljcyBldmVudCBmb3IgdGhlIHRoZW1lLiBUaGlzIGNhbGxzIHRoZSB3cC1hbmFseXRpY3MtdHJhY2tpbmctZ2VuZXJhdG9yIGFjdGlvbi5cbiAqIHR5cGU6IGdlbmVyYWxseSB0aGlzIGlzIFwiZXZlbnRcIlxuICogY2F0ZWdvcnk6IEV2ZW50IENhdGVnb3J5XG4gKiBsYWJlbDogRXZlbnQgTGFiZWxcbiAqIGFjdGlvbjogRXZlbnQgQWN0aW9uXG4gKiB2YWx1ZTogb3B0aW9uYWxcbiAqIG5vbl9pbnRlcmFjdGlvbjogb3B0aW9uYWxcbiovXG5mdW5jdGlvbiBtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSwgbm9uX2ludGVyYWN0aW9uICkge1xuXHR3cC5ob29rcy5kb0FjdGlvbiggJ3dwQW5hbHl0aWNzVHJhY2tpbmdHZW5lcmF0b3JFdmVudCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSwgbm9uX2ludGVyYWN0aW9uICk7XG59XG5cbi8qXG4gKiBDcmVhdGUgYSBkYXRhbGF5ZXIgZXZlbnQgZm9yIHRoZSB0aGVtZSB1c2luZyB0aGUgZ3RtNHdwIHBsdWdpbi4gVGhpcyBzZXRzIHRoZSBkYXRhTGF5ZXIgb2JqZWN0IGZvciBHb29nbGUgVGFnIE1hbmFnZXIuXG4gKiBJdCBzaG91bGQgb25seSBoYXZlIGRhdGEgdGhhdCBpcyBub3QgYXZhaWFsYWJsZSB0byBHVE0gYnkgZGVmYXVsdC5cbiAqIGRhdGFMYXllckNvbnRlbnQ6IHRoZSBvYmplY3QgdGhhdCBzaG91bGQgYmUgYWRkZWRcbiovXG5mdW5jdGlvbiBtcERhdGFMYXllckV2ZW50KCBkYXRhTGF5ZXJDb250ZW50ICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZGF0YUxheWVyICYmIE9iamVjdC5rZXlzKCBkYXRhTGF5ZXJDb250ZW50ICkubGVuZ3RoICE9PSAwICkge1xuXHRcdGRhdGFMYXllci5wdXNoKCBkYXRhTGF5ZXJDb250ZW50ICk7XG5cdH1cbn1cblxuLypcbiAqIENyZWF0ZSBhIEdvb2dsZSBBbmFseXRpY3MgRWNvbW1lcmNlIGFjdGlvbiBmb3IgdGhlIHRoZW1lLiBUaGlzIGNhbGxzIHRoZSB3cC1hbmFseXRpY3MtdHJhY2tpbmctZ2VuZXJhdG9yIGFjdGlvbi5cbiAqXG4qL1xuZnVuY3Rpb24gbXBBbmFseXRpY3NUcmFja2luZ0Vjb21tZXJjZUFjdGlvbiggdHlwZSwgYWN0aW9uLCBwcm9kdWN0LCBzdGVwICkge1xuXHR3cC5ob29rcy5kb0FjdGlvbiggJ3dwQW5hbHl0aWNzVHJhY2tpbmdHZW5lcmF0b3JFY29tbWVyY2VBY3Rpb24nLCB0eXBlLCBhY3Rpb24sIHByb2R1Y3QsIHN0ZXAgKTtcbn1cblxuLypcbiAqIFNldCB1cCBkYXRhTGF5ZXIgc3R1ZmYgZm9yIGVjb21tZXJjZSB2aWEgR29vZ2xlIFRhZyBNYW5hZ2VyIHVzaW5nIHRoZSBndG00d3AgcGx1Z2luLlxuICpcbiovXG5mdW5jdGlvbiBtcERhdGFMYXllckVjb21tZXJjZSggZGF0YUxheWVyQ29udGVudCApIHtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGRhdGFMYXllciAmJiBPYmplY3Qua2V5cyggZGF0YUxheWVyQ29udGVudCApLmxlbmd0aCAhPT0gMCApIHtcblx0XHRkYXRhTGF5ZXIucHVzaCh7IGVjb21tZXJjZTogbnVsbCB9KTsgLy8gZmlyc3QsIG1ha2Ugc3VyZSB0aGVyZSBhcmVuJ3QgbXVsdGlwbGUgdGhpbmdzIGhhcHBlbmluZy5cblx0XHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZGF0YUxheWVyQ29udGVudC5hY3Rpb24gJiYgJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBkYXRhTGF5ZXJDb250ZW50LnByb2R1Y3QgKSB7XG5cdFx0XHRkYXRhTGF5ZXIucHVzaCh7XG5cdFx0XHRcdGV2ZW50OiBkYXRhTGF5ZXJDb250ZW50LmFjdGlvbixcblx0XHRcdFx0ZWNvbW1lcmNlOiB7XG5cdFx0XHRcdFx0aXRlbXM6IFtkYXRhTGF5ZXJDb250ZW50LnByb2R1Y3RdXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxufVxuXG4vKlxuICogV2hlbiBhIHBhcnQgb2YgdGhlIHdlYnNpdGUgaXMgbWVtYmVyLXNwZWNpZmljLCBjcmVhdGUgYW4gZXZlbnQgZm9yIHdoZXRoZXIgaXQgd2FzIHNob3duIG9yIG5vdC5cbiovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSAmJiAnJyAhPT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLnVybF9hY2Nlc3NfbGV2ZWwgKSB7XG5cdFx0dmFyIHR5cGUgPSAnZXZlbnQnO1xuXHRcdHZhciBjYXRlZ29yeSA9ICdNZW1iZXIgQ29udGVudCc7XG5cdFx0dmFyIGxhYmVsID0gbG9jYXRpb24ucGF0aG5hbWU7IC8vIGkgdGhpbmsgd2UgY291bGQgcG9zc2libHkgcHV0IHNvbWUgZ3JvdXBpbmcgaGVyZSwgYnV0IHdlIGRvbid0IG5lY2Vzc2FyaWx5IGhhdmUgYWNjZXNzIHRvIG9uZSBhbmQgbWF5YmUgaXQncyBub3Qgd29ydGh3aGlsZSB5ZXRcblx0XHR2YXIgYWN0aW9uID0gJ0Jsb2NrZWQnO1xuXHRcdGlmICggdHJ1ZSA9PT0gbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhLmN1cnJlbnRfdXNlci5jYW5fYWNjZXNzICkge1xuXHRcdFx0YWN0aW9uID0gJ1Nob3duJztcblx0XHR9XG5cdFx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHR9XG59ICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIHNoYXJpbmcgY29udGVudFxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuLy8gdHJhY2sgYSBzaGFyZSB2aWEgYW5hbHl0aWNzIGV2ZW50LlxuZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gPSAnJyApIHtcbiAgICB2YXIgY2F0ZWdvcnkgPSAnU2hhcmUnO1xuICAgIGlmICggJycgIT09IHBvc2l0aW9uICkge1xuICAgICAgICBjYXRlZ29yeSA9ICdTaGFyZSAtICcgKyBwb3NpdGlvbjtcbiAgICB9XG5cbiAgICAvLyB0cmFjayBhcyBhbiBldmVudFxuICAgIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnksIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59XG5cbi8vIHRvcCBzaGFyZSBidXR0b24gY2xpY2tcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5mb3JFYWNoKFxuICAgIHRvcEJ1dHRvbiA9PiB0b3BCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCBlICkgPT4ge1xuICAgICAgICB2YXIgdGV4dCA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoICdkYXRhLXNoYXJlLWFjdGlvbicgKTtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gJ3RvcCc7XG4gICAgICAgIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG4gICAgfSApXG4pO1xuXG4vLyB3aGVuIHRoZSBwcmludCBidXR0b24gaXMgY2xpY2tlZFxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXByaW50IGEnICkuZm9yRWFjaChcbiAgICBwcmludEJ1dHRvbiA9PiBwcmludEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoIGUgKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgd2luZG93LnByaW50KCk7XG4gICAgfSApXG4pO1xuXG4vLyB3aGVuIHRoZSByZXB1Ymxpc2ggYnV0dG9uIGlzIGNsaWNrZWRcbi8vIHRoZSBwbHVnaW4gY29udHJvbHMgdGhlIHJlc3QsIGJ1dCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGUgZGVmYXVsdCBldmVudCBkb2Vzbid0IGZpcmVcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1yZXB1Ymxpc2ggYScgKS5mb3JFYWNoKFxuICAgIHJlcHVibGlzaEJ1dHRvbiA9PiByZXB1Ymxpc2hCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCBlICkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSApXG4pO1xuXG4vLyB3aGVuIHRoZSBjb3B5IGxpbmsgYnV0dG9uIGlzIGNsaWNrZWRcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1jb3B5LXVybCBhJyApLmZvckVhY2goXG4gICAgY29weUJ1dHRvbiA9PiBjb3B5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsICggZSApID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBsZXQgY29weVRleHQgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoIGNvcHlUZXh0ICkudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgdGxpdGUuc2hvdyggKCBlLnRhcmdldCApLCB7IGdyYXY6ICd3JyB9ICk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0bGl0ZS5oaWRlKCAoIGUudGFyZ2V0ICkgKTtcbiAgICAgICAgICAgIH0sIDMwMDAgKTtcbiAgICAgICAgfSApO1xuICAgIH0gKVxuKTtcblxuLy8gd2hlbiBzaGFyaW5nIHZpYSBmYWNlYm9vaywgdHdpdHRlciwgb3IgZW1haWwsIG9wZW4gdGhlIGRlc3RpbmF0aW9uIHVybCBpbiBhIG5ldyB3aW5kb3dcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1mYWNlYm9vayBhLCAubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS10d2l0dGVyIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWVtYWlsIGEnICkuZm9yRWFjaChcbiAgICBhbnlTaGFyZUJ1dHRvbiA9PiBhbnlTaGFyZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoIGUgKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgdXJsID0gZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSggJ2hyZWYnICk7XG5cdFx0d2luZG93Lm9wZW4oIHVybCwgJ19ibGFuaycgKTtcbiAgICB9IClcbik7XG4iLCIvKipcbiAqIEZpbGUgbmF2aWdhdGlvbi5qcy5cbiAqXG4gKiBOYXZpZ2F0aW9uIHNjcmlwdHMuIEluY2x1ZGVzIG1vYmlsZSBvciB0b2dnbGUgYmVoYXZpb3IsIGFuYWx5dGljcyB0cmFja2luZyBvZiBzcGVjaWZpYyBtZW51cy5cbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqL1xuXG5mdW5jdGlvbiBzZXR1cFByaW1hcnlOYXYoKSB7XG5cdGNvbnN0IHByaW1hcnlOYXZUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcubS1tZW51LXByaW1hcnktbGlua3MnICksXG5cdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0ZGlzcGxheVZhbHVlOiAnZmxleCdcblx0fSApO1xuXG5cdHZhciBwcmltYXJ5TmF2VG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ25hdiBidXR0b24nICk7XG5cdGlmICggbnVsbCAhPT0gcHJpbWFyeU5hdlRvZ2dsZSApIHtcblx0XHRwcmltYXJ5TmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0Y29uc3QgdXNlck5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy55b3VyLWFjY291bnQgdWwnICksXG5cdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0ZGlzcGxheVZhbHVlOiAnZmxleCdcblx0fSApO1xuXG5cdHZhciB1c2VyTmF2VG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy55b3VyLWFjY291bnQgPiBhJyApO1xuXHRpZiAoIG51bGwgIT09IHVzZXJOYXZUb2dnbGUgKSB7XG5cdFx0dXNlck5hdlRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHZhciB0YXJnZXQgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IC5tLWZvcm0tc2VhcmNoIGZpZWxkc2V0IC5hLWJ1dHRvbi1zZW50ZW5jZScgKTtcblx0aWYgKCBudWxsICE9PSB0YXJnZXQgKSB7XG5cdFx0dmFyIGRpdiAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0ZGl2LmlubmVySFRNTCA9ICc8YSBocmVmPVwiI1wiIGNsYXNzPVwiYS1jbG9zZS1idXR0b24gYS1jbG9zZS1zZWFyY2hcIj48aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT48L2E+Jztcblx0XHR2YXIgZnJhZ21lbnQgID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGRpdi5zZXRBdHRyaWJ1dGUoICdjbGFzcycsICdhLWNsb3NlLWhvbGRlcicgKTtcblx0XHRmcmFnbWVudC5hcHBlbmRDaGlsZCggZGl2ICk7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xuXG5cdFx0Y29uc3Qgc2VhcmNoVHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcubS1tZW51LXByaW1hcnktYWN0aW9ucyAubS1mb3JtLXNlYXJjaCcgKSxcblx0XHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdFx0ZGlzcGxheVZhbHVlOiAnZmxleCdcblx0XHR9ICk7XG5cblx0XHR2YXIgc2VhcmNoVmlzaWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICdsaS5zZWFyY2ggPiBhJyApO1xuXHRcdHNlYXJjaFZpc2libGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0dmFyIHNlYXJjaENsb3NlICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1zZWFyY2gnICk7XG5cdFx0c2VhcmNoQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0ZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24oIGV2dCApIHtcblx0XHRldnQgPSBldnQgfHwgd2luZG93LmV2ZW50O1xuXHRcdHZhciBpc0VzY2FwZSA9IGZhbHNlO1xuXHRcdGlmICggJ2tleScgaW4gZXZ0ICkge1xuXHRcdFx0aXNFc2NhcGUgPSAoICdFc2NhcGUnID09PSBldnQua2V5IHx8ICdFc2MnID09PSBldnQua2V5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlzRXNjYXBlID0gKCAyNyA9PT0gZXZ0LmtleUNvZGUgKTtcblx0XHR9XG5cdFx0aWYgKCBpc0VzY2FwZSApIHtcblx0XHRcdGxldCBwcmltYXJ5TmF2RXhwYW5kZWQgPSAndHJ1ZScgPT09IHByaW1hcnlOYXZUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGxldCB1c2VyTmF2RXhwYW5kZWQgPSAndHJ1ZScgPT09IHVzZXJOYXZUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGxldCBzZWFyY2hJc1Zpc2libGUgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgcHJpbWFyeU5hdkV4cGFuZGVkICYmIHRydWUgPT09IHByaW1hcnlOYXZFeHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRvZ2dsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBwcmltYXJ5TmF2RXhwYW5kZWQgKTtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiB1c2VyTmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gdXNlck5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHVzZXJOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHNlYXJjaElzVmlzaWJsZSAmJiB0cnVlID09PSBzZWFyY2hJc1Zpc2libGUgKSB7XG5cdFx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgc2VhcmNoSXNWaXNpYmxlICk7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cbnNldHVwUHJpbWFyeU5hdigpO1xuXG5mdW5jdGlvbiBzZXR1cFNjcm9sbE5hdigpIHtcblxuXHRsZXQgc3ViTmF2U2Nyb2xsZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLXN1Yi1uYXZpZ2F0aW9uJyApO1xuXHRzdWJOYXZTY3JvbGxlcnMuZm9yRWFjaCggKCBjdXJyZW50VmFsdWUgKSA9PiB7XG5cdFx0UHJpb3JpdHlOYXZTY3JvbGxlcigge1xuXHRcdFx0c2VsZWN0b3I6IGN1cnJlbnRWYWx1ZSxcblx0XHRcdG5hdlNlbGVjdG9yOiAnLm0tc3VibmF2LW5hdmlnYXRpb24nLFxuXHRcdFx0Y29udGVudFNlbGVjdG9yOiAnLm0tbWVudS1zdWItbmF2aWdhdGlvbicsXG5cdFx0XHRpdGVtU2VsZWN0b3I6ICdsaSwgYScsXG5cdFx0XHRidXR0b25MZWZ0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tbGVmdCcsXG5cdFx0XHRidXR0b25SaWdodFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0J1xuXHRcdH0gKTtcblx0fSApO1xuXG5cdGxldCBwYWdpbmF0aW9uU2Nyb2xsZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLXBhZ2luYXRpb24tbmF2aWdhdGlvbicgKTtcblx0cGFnaW5hdGlvblNjcm9sbGVycy5mb3JFYWNoKCAoIGN1cnJlbnRWYWx1ZSApID0+IHtcblx0XHRQcmlvcml0eU5hdlNjcm9sbGVyKCB7XG5cdFx0XHRzZWxlY3RvcjogY3VycmVudFZhbHVlLFxuXHRcdFx0bmF2U2VsZWN0b3I6ICcubS1wYWdpbmF0aW9uLWNvbnRhaW5lcicsXG5cdFx0XHRjb250ZW50U2VsZWN0b3I6ICcubS1wYWdpbmF0aW9uLWxpc3QnLFxuXHRcdFx0aXRlbVNlbGVjdG9yOiAnbGksIGEnLFxuXHRcdFx0YnV0dG9uTGVmdFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuXHRcdFx0YnV0dG9uUmlnaHRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1yaWdodCdcblx0XHR9ICk7XG5cdH0gKTtcblxufVxuc2V0dXBTY3JvbGxOYXYoKTtcblxuLy8gc2lkZWJhciBsaW5rIGNsaWNrXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm8tc2l0ZS1zaWRlYmFyIGEnICkuZm9yRWFjaChcbiAgICBzaWRlYmFyTGluayA9PiBzaWRlYmFyTGluay5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoIGUgKSA9PiB7XG5cdFx0bGV0IGNsb3Nlc3RXaWRnZXQgICAgICAgPSBzaWRlYmFyTGluay5jbG9zZXN0KCAnLm0td2lkZ2V0JyApO1xuXHRcdGxldCBjbG9zZXN0Wm9uZSAgICAgICAgID0gc2lkZWJhckxpbmsuY2xvc2VzdCggJy5tLXpvbmUnICk7XG5cdFx0bGV0IHdpZGdldFRpdGxlICAgICAgICAgPSAnJztcblx0XHRsZXQgem9uZVRpdGxlICAgICAgICAgICA9ICcnO1xuXHRcdGxldCBzaWRlYmFyU2VjdGlvblRpdGxlID0gJyc7XG5cdFx0aWYgKCBudWxsICE9PSBjbG9zZXN0V2lkZ2V0ICkge1xuXHRcdFx0d2lkZ2V0VGl0bGUgPSBjbG9zZXN0V2lkZ2V0LnF1ZXJ5U2VsZWN0b3IoICdoMycgKS50ZXh0Q29udGVudDtcblx0XHR9IGVsc2UgaWYgKCBudWxsICE9PSBjbG9zZXN0Wm9uZSApIHtcblx0XHRcdHpvbmVUaXRsZSA9IGNsb3Nlc3Rab25lLnF1ZXJ5U2VsZWN0b3IoICcuYS16b25lLXRpdGxlJyApLnRleHRDb250ZW50O1xuXHRcdH1cblx0XHRpZiAoIG51bGwgIT09IHdpZGdldFRpdGxlICkge1xuXHRcdFx0c2lkZWJhclNlY3Rpb25UaXRsZSA9IHdpZGdldFRpdGxlO1xuXHRcdH0gZWxzZSBpZiAoIG51bGwgIT09IHpvbmVUaXRsZSApIHtcblx0XHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB6b25lVGl0bGU7XG5cdFx0fVxuXHRcdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJTZWN0aW9uVGl0bGUgKTtcbiAgICB9IClcbik7XG5cbi8vIHJlbGF0ZWQgc2VjdGlvbiBsaW5rIGNsaWNrXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tcmVsYXRlZCBhJyApLmZvckVhY2goXG4gICAgcmVsYXRlZExpbmsgPT4gcmVsYXRlZExpbmsuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCBlICkgPT4ge1xuXHRcdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1JlbGF0ZWQgU2VjdGlvbiBMaW5rJywgJ0NsaWNrJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcbiAgICB9IClcbik7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIGZvcm1zXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbmpRdWVyeS5mbi50ZXh0Tm9kZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY29udGVudHMoKS5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoIHRoaXMubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmICcnICE9PSB0aGlzLm5vZGVWYWx1ZS50cmltKCkgKTtcblx0fSApO1xufTtcblxuZnVuY3Rpb24gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggYWN0aW9uICkge1xuXHR2YXIgbWFya3VwID0gJzxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtZm9ybS1jb25maXJtXCI+PGxhYmVsPkFyZSB5b3Ugc3VyZT8gPGEgaWQ9XCJhLWNvbmZpcm0tJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPlllczwvYT4gfCA8YSBpZD1cImEtc3RvcC0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+Tm88L2E+PC9sYWJlbD48L2xpPic7XG5cdHJldHVybiBtYXJrdXA7XG59XG5cbmZ1bmN0aW9uIG1hbmFnZUVtYWlscygpIHtcblx0dmFyIGZvcm0gICAgICAgICAgICAgICA9ICQoICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJyApO1xuXHR2YXIgcmVzdFJvb3QgICAgICAgICAgID0gdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5zaXRlX3VybCArIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QucmVzdF9uYW1lc3BhY2U7XG5cdHZhciBmdWxsVXJsICAgICAgICAgICAgPSByZXN0Um9vdCArICcvJyArICd1cGRhdGUtdXNlci8nO1xuXHR2YXIgY29uZmlybUNoYW5nZSAgICAgID0gJyc7XG5cdHZhciBuZXh0RW1haWxDb3VudCAgICAgPSAxO1xuXHR2YXIgbmV3UHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBvbGRQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIHByaW1hcnlJZCAgICAgICAgICA9ICcnO1xuXHR2YXIgZW1haWxUb1JlbW92ZSAgICAgID0gJyc7XG5cdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0dmFyIG5ld0VtYWlscyAgICAgICAgICA9IFtdO1xuXHR2YXIgYWpheEZvcm1EYXRhICAgICAgID0gJyc7XG5cdHZhciB0aGF0ICAgICAgICAgICAgICAgPSAnJztcblxuXHQvLyBzdGFydCBvdXQgd2l0aCBubyBwcmltYXJ5L3JlbW92YWxzIGNoZWNrZWRcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0Ly8gaWYgdGhlcmUgaXMgYSBsaXN0IG9mIGVtYWlscyAobm90IGp1c3QgYSBzaW5nbGUgZm9ybSBmaWVsZClcblx0aWYgKCAwIDwgJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHNlbGVjdHMgYSBuZXcgcHJpbWFyeSwgbW92ZSBpdCBpbnRvIHRoYXQgcG9zaXRpb25cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScsIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRuZXdQcmltYXJ5RW1haWwgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRvbGRQcmltYXJ5RW1haWwgPSAkKCAnI2VtYWlsJyApLnZhbCgpO1xuXHRcdFx0cHJpbWFyeUlkICAgICAgID0gJCggdGhpcyApLnByb3AoICdpZCcgKS5yZXBsYWNlKCAncHJpbWFyeV9lbWFpbF8nLCAnJyApO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3ByaW1hcnktY2hhbmdlJyApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cblx0XHRcdC8vJCggdGhpcyApLnBhcmVudCgpLmFmdGVyKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgdXNlciBmYWNpbmcgdmFsdWVzXG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBuZXdQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyN1c2VyLWVtYWlsLScgKyBwcmltYXJ5SWQgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIG1haW4gaGlkZGVuIGZvcm0gdmFsdWVcblx0XHRcdFx0JCggJyNlbWFpbCcgKS52YWwoIG5ld1ByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHN1Ym1pdCBmb3JtIHZhbHVlcy5cblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblxuXHRcdFx0XHQvLyB1bmNoZWNrIHRoZSByYWRpbyBidXR0b25cblx0XHRcdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgZm9ybSB2YWx1ZXMgdG8gdGhlIG9sZCBwcmltYXJ5IGVtYWlsXG5cdFx0XHRcdCQoICcjcHJpbWFyeV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyNyZW1vdmVfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIHRoZSBjb25maXJtIG1lc3NhZ2Vcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdH0gKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdC8vIGlmIGEgdXNlciByZW1vdmVzIGFuIGVtYWlsLCB0YWtlIGl0IGF3YXkgZnJvbSB0aGUgdmlzdWFsIGFuZCBmcm9tIHRoZSBmb3JtXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NoYW5nZScsICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRlbWFpbFRvUmVtb3ZlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3JlbW92YWwnICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICE9PSBlbWFpbFRvUmVtb3ZlICkge1xuXHRcdFx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscy5wdXNoKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXIgZm9yIHJlbW92YWxcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdC8vIGlmIGNvbmZpcm1lZCwgcmVtb3ZlIHRoZSBlbWFpbCBhbmQgc3VibWl0IHRoZSBmb3JtXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpJyApLmZhZGVPdXQoICdub3JtYWwnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkucmVtb3ZlKCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXG5cdFx0XHRcdC8vY29uc29sZS5sb2coICd2YWx1ZSBpcyAnICsgY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0Ly8gaWYgYSB1c2VyIHdhbnRzIHRvIGFkZCBhbiBlbWFpbCwgZ2l2ZSB0aGVtIGEgcHJvcGVybHkgbnVtYmVyZWQgZmllbGRcblx0JCggJy5tLWZvcm0tZW1haWwnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJyApLmJlZm9yZSggJzxkaXYgY2xhc3M9XCJhLWlucHV0LXdpdGgtYnV0dG9uIGEtYnV0dG9uLXNlbnRlbmNlXCI+PGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgaWQ9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgdmFsdWU9XCJcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBuYW1lPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGlkPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGNsYXNzPVwiYS1idXR0b24gYS1idXR0b24tYWRkLXVzZXItZW1haWxcIj5BZGQ8L2J1dHRvbj48L2Rpdj4nICk7XG5cdFx0bmV4dEVtYWlsQ291bnQrKztcblx0fSApO1xuXG5cdCQoICdpbnB1dFt0eXBlPXN1Ym1pdF0nICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBidXR0b24gPSAkKCB0aGlzICk7XG5cdFx0dmFyIGJ1dHRvbkZvcm0gPSBidXR0b24uY2xvc2VzdCggJ2Zvcm0nICk7XG5cdFx0YnV0dG9uRm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nLCBidXR0b24udmFsKCkgKTtcblx0fSApO1xuXG5cdCQoICcubS1lbnRyeS1jb250ZW50JyApLm9uKCAnc3VibWl0JywgJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0dmFyIGZvcm0gPSAkKCB0aGlzICk7XG5cdFx0dmFyIHN1Ym1pdHRpbmdCdXR0b24gPSBmb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicgKSB8fCAnJztcblxuXHRcdC8vIGlmIHRoZXJlIGlzIG5vIHN1Ym1pdHRpbmcgYnV0dG9uLCBwYXNzIGl0IGJ5IEFqYXhcblx0XHRpZiAoICcnID09PSBzdWJtaXR0aW5nQnV0dG9uIHx8ICdTYXZlIENoYW5nZXMnICE9PSBzdWJtaXR0aW5nQnV0dG9uICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGFqYXhGb3JtRGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7IC8vYWRkIG91ciBvd24gYWpheCBjaGVjayBhcyBYLVJlcXVlc3RlZC1XaXRoIGlzIG5vdCBhbHdheXMgcmVsaWFibGVcblx0XHRcdGFqYXhGb3JtRGF0YSA9IGFqYXhGb3JtRGF0YSArICcmcmVzdD10cnVlJztcblx0XHRcdCQuYWpheCgge1xuXHRcdFx0XHR1cmw6IGZ1bGxVcmwsXG5cdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oIHhociApIHtcblx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Lm5vbmNlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhGb3JtRGF0YVxuXHRcdFx0fSApLmRvbmUoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRuZXdFbWFpbHMgPSAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHR9ICkuZ2V0KCk7XG5cdFx0XHRcdCQuZWFjaCggbmV3RW1haWxzLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICkge1xuXHRcdFx0XHRcdG5leHRFbWFpbENvdW50ID0gbmV4dEVtYWlsQ291bnQgKyBpbmRleDtcblx0XHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmFwcGVuZCggJzxsaSBpZD1cInVzZXItZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPicgKyB2YWx1ZSArICc8dWwgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXVzZXItZW1haWwtYWN0aW9uc1wiPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1tYWtlLXByaW1hcnktZW1haWxcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW1hcnlfZW1haWxcIiBpZD1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+TWFrZSBQcmltYXJ5PC9zbWFsbD48L2xhYmVsPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLWVtYWlsLXByZWZlcmVuY2VzXCI+PGEgaHJlZj1cIi9uZXdzbGV0dGVycy8/ZW1haWw9JyArIGVuY29kZVVSSUNvbXBvbmVudCggdmFsdWUgKSArICdcIj48c21hbGw+RW1haWwgUHJlZmVyZW5jZXM8L3NtYWxsPjwvYT48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggJCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoKSArICcsJyArIHZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0JCggJy5tLWZvcm0tY2hhbmdlLWVtYWlsIC5hLWlucHV0LXdpdGgtYnV0dG9uJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRpZiAoIDAgPT09ICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdGlmICggJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApICE9PSAkKCAnaW5wdXRbbmFtZT1cImVtYWlsXCJdJyApICkge1xuXG5cdFx0XHRcdFx0XHQvLyBpdCB3b3VsZCBiZSBuaWNlIHRvIG9ubHkgbG9hZCB0aGUgZm9ybSwgYnV0IHRoZW4gY2xpY2sgZXZlbnRzIHN0aWxsIGRvbid0IHdvcmtcblx0XHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblx0fSApO1xufVxuXG5mdW5jdGlvbiBhZGRBdXRvUmVzaXplKCkge1xuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnW2RhdGEtYXV0b3Jlc2l6ZV0nICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0ZWxlbWVudC5zdHlsZS5ib3hTaXppbmcgPSAnYm9yZGVyLWJveCc7XG5cdFx0dmFyIG9mZnNldCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC50YXJnZXQuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuXHRcdFx0ZXZlbnQudGFyZ2V0LnN0eWxlLmhlaWdodCA9IGV2ZW50LnRhcmdldC5zY3JvbGxIZWlnaHQgKyBvZmZzZXQgKyAncHgnO1xuXHRcdH0gKTtcblx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSggJ2RhdGEtYXV0b3Jlc2l6ZScgKTtcblx0fSApO1xufVxuXG4kKCBkb2N1bWVudCApLmFqYXhTdG9wKCBmdW5jdGlvbigpIHtcblx0dmFyIGNvbW1lbnRBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJyNsbGNfY29tbWVudHMnICk7XG5cdGlmICggbnVsbCAhPT0gY29tbWVudEFyZWEgKSB7XG5cdFx0YWRkQXV0b1Jlc2l6ZSgpO1xuXHR9XG59ICk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICggMCA8ICQoICcubS1mb3JtLWFjY291bnQtc2V0dGluZ3MnICkubGVuZ3RoICkge1xuXHRcdG1hbmFnZUVtYWlscygpO1xuXHR9XG5cdHZhciBhdXRvUmVzaXplVGV4dGFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnW2RhdGEtYXV0b3Jlc2l6ZV0nICk7XG5cdGlmICggbnVsbCAhPT0gYXV0b1Jlc2l6ZVRleHRhcmVhICkge1xuXHRcdGFkZEF1dG9SZXNpemUoKTtcblx0fVxufSApO1xuXG52YXIgZm9ybXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZm9ybScgKTtcbmZvcm1zLmZvckVhY2goIGZ1bmN0aW9uKCBmb3JtICkge1xuXHRWYWxpZEZvcm0oIGZvcm0sIHtcblx0XHR2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzczogJ20taGFzLXZhbGlkYXRpb24tZXJyb3InLFxuXHRcdHZhbGlkYXRpb25FcnJvckNsYXNzOiAnYS12YWxpZGF0aW9uLWVycm9yJyxcblx0XHRpbnZhbGlkQ2xhc3M6ICdhLWVycm9yJyxcblx0XHRlcnJvclBsYWNlbWVudDogJ2FmdGVyJ1xuXHR9ICk7XG59ICk7XG5cbnZhciBmb3JtID0gJCggJy5tLWZvcm0nICk7XG5cbi8vIGxpc3RlbiBmb3IgYGludmFsaWRgIGV2ZW50cyBvbiBhbGwgZm9ybSBpbnB1dHNcbmZvcm0uZmluZCggJzppbnB1dCcgKS5vbiggJ2ludmFsaWQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5wdXQgPSAkKCB0aGlzICk7XG5cbiAgICAvLyB0aGUgZmlyc3QgaW52YWxpZCBlbGVtZW50IGluIHRoZSBmb3JtXG5cdHZhciBmaXJzdCA9IGZvcm0uZmluZCggJy5hLWVycm9yJyApLmZpcnN0KCk7XG5cblx0Ly8gdGhlIGZvcm0gaXRlbSB0aGF0IGNvbnRhaW5zIGl0XG5cdHZhciBmaXJzdF9ob2xkZXIgPSBmaXJzdC5wYXJlbnQoKTtcblxuICAgIC8vIG9ubHkgaGFuZGxlIGlmIHRoaXMgaXMgdGhlIGZpcnN0IGludmFsaWQgaW5wdXRcbiAgICBpZiAoIGlucHV0WzBdID09PSBmaXJzdFswXSApIHtcblxuICAgICAgICAvLyBoZWlnaHQgb2YgdGhlIG5hdiBiYXIgcGx1cyBzb21lIHBhZGRpbmcgaWYgdGhlcmUncyBhIGZpeGVkIG5hdlxuICAgICAgICAvL3ZhciBuYXZiYXJIZWlnaHQgPSBuYXZiYXIuaGVpZ2h0KCkgKyA1MFxuXG4gICAgICAgIC8vIHRoZSBwb3NpdGlvbiB0byBzY3JvbGwgdG8gKGFjY291bnRpbmcgZm9yIHRoZSBuYXZiYXIgaWYgaXQgZXhpc3RzKVxuICAgICAgICB2YXIgZWxlbWVudE9mZnNldCA9IGZpcnN0X2hvbGRlci5vZmZzZXQoKS50b3A7XG5cbiAgICAgICAgLy8gdGhlIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uIChhY2NvdW50aW5nIGZvciB0aGUgbmF2YmFyKVxuICAgICAgICB2YXIgcGFnZU9mZnNldCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcblxuICAgICAgICAvLyBkb24ndCBzY3JvbGwgaWYgdGhlIGVsZW1lbnQgaXMgYWxyZWFkeSBpbiB2aWV3XG4gICAgICAgIGlmICggZWxlbWVudE9mZnNldCA+IHBhZ2VPZmZzZXQgJiYgZWxlbWVudE9mZnNldCA8IHBhZ2VPZmZzZXQgKyB3aW5kb3cuaW5uZXJIZWlnaHQgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vdGU6IGF2b2lkIHVzaW5nIGFuaW1hdGUsIGFzIGl0IHByZXZlbnRzIHRoZSB2YWxpZGF0aW9uIG1lc3NhZ2UgZGlzcGxheWluZyBjb3JyZWN0bHlcbiAgICAgICAgJCggJ2h0bWwsIGJvZHknICkuc2Nyb2xsVG9wKCBlbGVtZW50T2Zmc2V0ICk7XG4gICAgfVxufSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBjb21tZW50c1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG4vLyBiYXNlZCBvbiB3aGljaCBidXR0b24gd2FzIGNsaWNrZWQsIHNldCB0aGUgdmFsdWVzIGZvciB0aGUgYW5hbHl0aWNzIGV2ZW50IGFuZCBjcmVhdGUgaXRcbmZ1bmN0aW9uIHRyYWNrU2hvd0NvbW1lbnRzKCBhbHdheXMsIGlkLCBjbGlja1ZhbHVlICkge1xuXHR2YXIgYWN0aW9uICAgICAgICAgID0gJyc7XG5cdHZhciBjYXRlZ29yeVByZWZpeCA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlTdWZmaXggPSAnJztcblx0dmFyIHBvc2l0aW9uICAgICAgICA9ICcnO1xuXHRwb3NpdGlvbiA9IGlkLnJlcGxhY2UoICdhbHdheXMtc2hvdy1jb21tZW50cy0nLCAnJyApO1xuXHRpZiAoICcxJyA9PT0gY2xpY2tWYWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT24nO1xuXHR9IGVsc2UgaWYgKCAnMCcgPT09IGNsaWNrVmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09mZic7XG5cdH0gZWxzZSB7XG5cdFx0YWN0aW9uID0gJ0NsaWNrJztcblx0fVxuXHRpZiAoIHRydWUgPT09IGFsd2F5cyApIHtcblx0XHRjYXRlZ29yeVByZWZpeCA9ICdBbHdheXMgJztcblx0fVxuXHRpZiAoICcnICE9PSBwb3NpdGlvbiApIHtcblx0XHRwb3NpdGlvbiA9IHBvc2l0aW9uLmNoYXJBdCggMCApLnRvVXBwZXJDYXNlKCkgKyBwb3NpdGlvbi5zbGljZSggMSApO1xuXHRcdGNhdGVnb3J5U3VmZml4ID0gJyAtICcgKyBwb3NpdGlvbjtcblx0fVxuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsIGNhdGVnb3J5UHJlZml4ICsgJ1Nob3cgQ29tbWVudHMnICsgY2F0ZWdvcnlTdWZmaXgsIGFjdGlvbiwgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn1cblxuLy8gd2hlbiBzaG93aW5nIGNvbW1lbnRzIG9uY2UsIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWJ1dHRvbi1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCBmYWxzZSwgJycsICcnICk7XG59ICk7XG5cbi8vIFNldCB1c2VyIG1ldGEgdmFsdWUgZm9yIGFsd2F5cyBzaG93aW5nIGNvbW1lbnRzIGlmIHRoYXQgYnV0dG9uIGlzIGNsaWNrZWRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR2YXIgdGhhdCA9ICQoIHRoaXMgKTtcblx0aWYgKCB0aGF0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9IGVsc2Uge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvLyB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcblx0dHJhY2tTaG93Q29tbWVudHMoIHRydWUsIHRoYXQuYXR0ciggJ2lkJyApLCB0aGF0LnZhbCgpICk7XG5cblx0Ly8gd2UgYWxyZWFkeSBoYXZlIGFqYXh1cmwgZnJvbSB0aGUgdGhlbWVcblx0JC5hamF4KCB7XG5cdFx0dHlwZTogJ1BPU1QnLFxuXHRcdHVybDogcGFyYW1zLmFqYXh1cmwsXG5cdFx0ZGF0YToge1xuXHRcdFx0J2FjdGlvbic6ICdtaW5ucG9zdF9sYXJnb19sb2FkX2NvbW1lbnRzX3NldF91c2VyX21ldGEnLFxuXHRcdFx0J3ZhbHVlJzogdGhhdC52YWwoKVxuXHRcdH0sXG5cdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0JCggJy5hLWFsd2F5cy1zaG93LWNvbW1lbnRzLXJlc3VsdCcsIHRoYXQucGFyZW50KCkgKS5odG1sKCByZXNwb25zZS5kYXRhLm1lc3NhZ2UgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gcmVzcG9uc2UuZGF0YS5zaG93ICkge1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAwICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAxICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG59ICk7XG5cbiEgKCBmdW5jdGlvbiggZCApIHtcblx0aWYgKCAhIGQuY3VycmVudFNjcmlwdCApIHtcblx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdGFjdGlvbjogJ2xsY19sb2FkX2NvbW1lbnRzJyxcblx0XHRcdHBvc3Q6ICQoICcjbGxjX3Bvc3RfaWQnICkudmFsKClcblx0XHR9O1xuXG5cdFx0Ly8gQWpheCByZXF1ZXN0IGxpbmsuXG5cdFx0dmFyIGxsY2FqYXh1cmwgPSAkKCAnI2xsY19hamF4X3VybCcgKS52YWwoKTtcblxuXHRcdC8vIEZ1bGwgdXJsIHRvIGdldCBjb21tZW50cyAoQWRkaW5nIHBhcmFtZXRlcnMpLlxuXHRcdHZhciBjb21tZW50VXJsID0gbGxjYWpheHVybCArICc/JyArICQucGFyYW0oIGRhdGEgKTtcblxuXHRcdC8vIFBlcmZvcm0gYWpheCByZXF1ZXN0LlxuXHRcdCQuZ2V0KCBjb21tZW50VXJsLCBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRpZiAoICcnICE9PSByZXNwb25zZSApIHtcblx0XHRcdFx0JCggJyNsbGNfY29tbWVudHMnICkuaHRtbCggcmVzcG9uc2UgKTtcblxuXHRcdFx0XHQvLyBJbml0aWFsaXplIGNvbW1lbnRzIGFmdGVyIGxhenkgbG9hZGluZy5cblx0XHRcdFx0aWYgKCB3aW5kb3cuYWRkQ29tbWVudCAmJiB3aW5kb3cuYWRkQ29tbWVudC5pbml0ICkge1xuXHRcdFx0XHRcdHdpbmRvdy5hZGRDb21tZW50LmluaXQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEdldCB0aGUgY29tbWVudCBsaSBpZCBmcm9tIHVybCBpZiBleGlzdC5cblx0XHRcdFx0dmFyIGNvbW1lbnRJZCA9IGRvY3VtZW50LlVSTC5zdWJzdHIoIGRvY3VtZW50LlVSTC5pbmRleE9mKCAnI2NvbW1lbnQnICkgKTtcblxuXHRcdFx0XHQvLyBJZiBjb21tZW50IGlkIGZvdW5kLCBzY3JvbGwgdG8gdGhhdCBjb21tZW50LlxuXHRcdFx0XHRpZiAoIC0xIDwgY29tbWVudElkLmluZGV4T2YoICcjY29tbWVudCcgKSApIHtcblx0XHRcdFx0XHQkKCB3aW5kb3cgKS5zY3JvbGxUb3AoICQoIGNvbW1lbnRJZCApLm9mZnNldCgpLnRvcCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG59KCBkb2N1bWVudCApICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIGV2ZW50c1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuY29uc3QgdGFyZ2V0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcuYS1ldmVudHMtY2FsLWxpbmtzJyApO1xudGFyZ2V0cy5mb3JFYWNoKCBmdW5jdGlvbiggdGFyZ2V0ICkge1xuICAgIHNldENhbGVuZGFyKCB0YXJnZXQgKTtcbn0gKTtcblxuZnVuY3Rpb24gc2V0Q2FsZW5kYXIoIHRhcmdldCApIHtcbiAgICBpZiAoIG51bGwgIT09IHRhcmdldCApIHtcbiAgICAgICAgdmFyIGxpICAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdsaScgKTtcbiAgICAgICAgbGkuaW5uZXJIVE1MICA9ICc8YSBocmVmPVwiI1wiIGNsYXNzPVwiYS1jbG9zZS1idXR0b24gYS1jbG9zZS1jYWxlbmRhclwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuICAgICAgICB2YXIgZnJhZ21lbnQgID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBsaS5zZXRBdHRyaWJ1dGUoICdjbGFzcycsICdhLWNsb3NlLWhvbGRlcicgKTtcbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGxpICk7XG4gICAgICAgIHRhcmdldC5hcHBlbmRDaGlsZCggZnJhZ21lbnQgKTtcbiAgICB9XG59XG5cbmNvbnN0IGNhbGVuZGFyc1Zpc2libGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZXZlbnQtZGF0ZXRpbWUgYScgKTtcbmNhbGVuZGFyc1Zpc2libGUuZm9yRWFjaCggZnVuY3Rpb24oIGNhbGVuZGFyVmlzaWJsZSApIHtcbiAgICBzaG93Q2FsZW5kYXIoIGNhbGVuZGFyVmlzaWJsZSApO1xufSApO1xuXG5mdW5jdGlvbiBzaG93Q2FsZW5kYXIoIGNhbGVuZGFyVmlzaWJsZSApIHtcbiAgICBjb25zdCBkYXRlSG9sZGVyID0gY2FsZW5kYXJWaXNpYmxlLmNsb3Nlc3QoICcubS1ldmVudC1kYXRlLWFuZC1jYWxlbmRhcicgKTtcbiAgICBjb25zdCBjYWxlbmRhclRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG4gICAgICAgIGVsZW1lbnQ6IGRhdGVIb2xkZXIucXVlcnlTZWxlY3RvciggJy5hLWV2ZW50cy1jYWwtbGlua3MnICksXG4gICAgICAgIHZpc2libGVDbGFzczogJ2EtZXZlbnRzLWNhbC1saW5rLXZpc2libGUnLFxuICAgICAgICBkaXNwbGF5VmFsdWU6ICdibG9jaydcbiAgICB9ICk7XG5cbiAgICBpZiAoIG51bGwgIT09IGNhbGVuZGFyVmlzaWJsZSApIHtcbiAgICAgICAgY2FsZW5kYXJWaXNpYmxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBjYWxlbmRhclZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcbiAgICAgICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICAgICAgaWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcbiAgICAgICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ICk7XG5cbiAgICAgICAgdmFyIGNhbGVuZGFyQ2xvc2UgPSBkYXRlSG9sZGVyLnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1jYWxlbmRhcicgKTtcbiAgICAgICAgaWYgKCBudWxsICE9PSBjYWxlbmRhckNsb3NlICkge1xuICAgICAgICAgICAgY2FsZW5kYXJDbG9zZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBjYWxlbmRhclZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcbiAgICAgICAgICAgICAgICBjYWxlbmRhclZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcbiAgICAgICAgICAgICAgICBpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuICAgICAgICAgICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
}(jQuery));
