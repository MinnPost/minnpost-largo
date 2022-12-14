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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDQtdmFsaWQtZm9ybS5taW4uanMiLCIwMC1zdGFydC5qcyIsIjAxLWFuYWx5dGljcy5qcyIsIjAyLXNoYXJlLmpzIiwiMDMtbmF2aWdhdGlvbi5qcyIsIjA0LWZvcm1zLmpzIiwiMDUtY29tbWVudHMuanMiLCIwNi1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImMiLCJyZXF1aXJlIiwidSIsImNvZGUiLCJwIiwiY2FsbCIsIl92YWxpZEZvcm0iLCJfdmFsaWRGb3JtMiIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIlZhbGlkRm9ybSIsInRvZ2dsZUludmFsaWRDbGFzcyIsImhhbmRsZUN1c3RvbU1lc3NhZ2VzIiwiaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiY2xvbmUiLCJkZWZhdWx0cyIsImluc2VydEFmdGVyIiwiaW5zZXJ0QmVmb3JlIiwiZm9yRWFjaCIsImRlYm91bmNlIiwiY29weSIsImF0dHIiLCJoYXNPd25Qcm9wZXJ0eSIsImRlZmF1bHRPYmplY3QiLCJrIiwicmVmTm9kZSIsIm5vZGVUb0luc2VydCIsInNpYmxpbmciLCJuZXh0U2libGluZyIsIl9wYXJlbnQiLCJwYXJlbnQiLCJpdGVtcyIsImZuIiwibXMiLCJkZWJvdW5jZWRGbiIsInZhbGlkRm9ybSIsIl91dGlsIiwiaW5wdXQiLCJpbnZhbGlkQ2xhc3MiLCJ2YWxpZGl0eSIsInZhbGlkIiwiZXJyb3JQcm9wcyIsImdldEN1c3RvbU1lc3NhZ2UiLCJjdXN0b21NZXNzYWdlcyIsImxvY2FsRXJyb3JQcm9wcyIsInR5cGUiLCJjb25jYXQiLCJwcm9wIiwiY2hlY2tWYWxpZGl0eSIsIm1lc3NhZ2UiLCJzZXRDdXN0b21WYWxpZGl0eSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uRXJyb3JDbGFzcyIsInZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzIiwiZXJyb3JQbGFjZW1lbnQiLCJpbnNlcnRFcnJvciIsImVycm9yTm9kZSIsInZhbGlkYXRpb25NZXNzYWdlIiwidGV4dENvbnRlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImRlZmF1bHRPcHRpb25zIiwibm9kZU5hbWUiLCJpbnB1dHMiLCJ0b0xvd2VyQ2FzZSIsImZvY3VzSW52YWxpZElucHV0IiwidmFsaWRGb3JtSW5wdXRzIiwiZm9ybSIsImZvY3VzRmlyc3QiLCJpbnZhbGlkTm9kZSIsImZvY3VzIiwiZG9jdW1lbnRFbGVtZW50Iiwid3AiLCJob29rcyIsImFkZEFjdGlvbiIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFY29tbWVyY2VBY3Rpb24iLCJtcERhdGFMYXllckV2ZW50IiwibXBEYXRhTGF5ZXJFY29tbWVyY2UiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwibm9uX2ludGVyYWN0aW9uIiwiZG9BY3Rpb24iLCJkYXRhTGF5ZXJDb250ZW50IiwiZGF0YUxheWVyIiwia2V5cyIsInB1c2giLCJwcm9kdWN0Iiwic3RlcCIsImVjb21tZXJjZSIsImV2ZW50IiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsInRvcEJ1dHRvbiIsImN1cnJlbnRUYXJnZXQiLCJwcmludEJ1dHRvbiIsInByaW50IiwicmVwdWJsaXNoQnV0dG9uIiwiY29weUJ1dHRvbiIsImNvcHlUZXh0IiwiaHJlZiIsIm5hdmlnYXRvciIsImNsaXBib2FyZCIsIndyaXRlVGV4dCIsInRoZW4iLCJhbnlTaGFyZUJ1dHRvbiIsInVybCIsIm9wZW4iLCJzZXR1cFByaW1hcnlOYXYiLCJwcmltYXJ5TmF2VHJhbnNpdGlvbmVyIiwicHJpbWFyeU5hdlRvZ2dsZSIsImV4cGFuZGVkIiwidXNlck5hdlRyYW5zaXRpb25lciIsInVzZXJOYXZUb2dnbGUiLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCJvbmtleWRvd24iLCJldnQiLCJpc0VzY2FwZSIsImtleSIsImtleUNvZGUiLCJwcmltYXJ5TmF2RXhwYW5kZWQiLCJ1c2VyTmF2RXhwYW5kZWQiLCJzZWFyY2hJc1Zpc2libGUiLCJzZXR1cFNjcm9sbE5hdiIsInN1Yk5hdlNjcm9sbGVycyIsImN1cnJlbnRWYWx1ZSIsInBhZ2luYXRpb25TY3JvbGxlcnMiLCIkIiwiY2xpY2siLCJ3aWRnZXRUaXRsZSIsImNsb3Nlc3QiLCJmaW5kIiwiem9uZVRpdGxlIiwic2lkZWJhclNlY3Rpb25UaXRsZSIsImpRdWVyeSIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwidHJpbSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJyZXN0Um9vdCIsInVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QiLCJzaXRlX3VybCIsInJlc3RfbmFtZXNwYWNlIiwiZnVsbFVybCIsImNvbmZpcm1DaGFuZ2UiLCJuZXh0RW1haWxDb3VudCIsIm5ld1ByaW1hcnlFbWFpbCIsIm9sZFByaW1hcnlFbWFpbCIsInByaW1hcnlJZCIsImVtYWlsVG9SZW1vdmUiLCJjb25zb2xpZGF0ZWRFbWFpbHMiLCJuZXdFbWFpbHMiLCJhamF4Rm9ybURhdGEiLCJ0aGF0Iiwib24iLCJ2YWwiLCJyZXBsYWNlIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFwcGVuZCIsImZpcnN0IiwicmVwbGFjZVdpdGgiLCJzdWJtaXQiLCJlYWNoIiwiZ2V0IiwicGFyZW50cyIsImZhZGVPdXQiLCJqb2luIiwiYmVmb3JlIiwiYnV0dG9uIiwiYnV0dG9uRm9ybSIsImRhdGEiLCJzdWJtaXR0aW5nQnV0dG9uIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRvbmUiLCJtYXAiLCJpbmRleCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsImFkZEF1dG9SZXNpemUiLCJib3hTaXppbmciLCJvZmZzZXQiLCJjbGllbnRIZWlnaHQiLCJoZWlnaHQiLCJzY3JvbGxIZWlnaHQiLCJhamF4U3RvcCIsImNvbW1lbnRBcmVhIiwiYXV0b1Jlc2l6ZVRleHRhcmVhIiwiZm9ybXMiLCJmaXJzdF9ob2xkZXIiLCJlbGVtZW50T2Zmc2V0IiwicGFnZU9mZnNldCIsInBhZ2VZT2Zmc2V0Iiwic2Nyb2xsVG9wIiwidHJhY2tTaG93Q29tbWVudHMiLCJhbHdheXMiLCJpZCIsImNsaWNrVmFsdWUiLCJjYXRlZ29yeVByZWZpeCIsImNhdGVnb3J5U3VmZml4IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImlzIiwicGFyYW1zIiwiYWpheHVybCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImh0bWwiLCJjdXJyZW50U2NyaXB0IiwicG9zdCIsImxsY2FqYXh1cmwiLCJjb21tZW50VXJsIiwicGFyYW0iLCJhZGRDb21tZW50IiwiY29tbWVudElkIiwiVVJMIiwic3Vic3RyIiwiaW5kZXhPZiIsInRhcmdldHMiLCJzZXRDYWxlbmRhciIsImxpIiwiY2FsZW5kYXJzVmlzaWJsZSIsImNhbGVuZGFyVmlzaWJsZSIsInNob3dDYWxlbmRhciIsImRhdGVIb2xkZXIiLCJjYWxlbmRhclRyYW5zaXRpb25lciIsImNhbGVuZGFyQ2xvc2UiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsS0FBSyxDQUFDQyxDQUFDLEVBQUM7RUFB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VyxlQUFlLENBQUM1VixZQUFZLENBQUUsZUFBZSxFQUFFLENBQUUwTixRQUFRLENBQUU7TUFDM0QsSUFBSyxJQUFJLEtBQUtBLFFBQVEsRUFBRztRQUNyQnFJLG9CQUFvQixDQUFDbFUsY0FBYyxFQUFFO01BQ3pDLENBQUMsTUFBTTtRQUNIa1Usb0JBQW9CLENBQUN2VSxjQUFjLEVBQUU7TUFDekM7SUFDSixDQUFDLENBQUU7SUFFSCxJQUFJd1UsYUFBYSxHQUFHRixVQUFVLENBQUNoVCxhQUFhLENBQUUsbUJBQW1CLENBQUU7SUFDbkUsSUFBSyxJQUFJLEtBQUtrVCxhQUFhLEVBQUc7TUFDMUJBLGFBQWEsQ0FBQ3JZLGdCQUFnQixDQUFFLE9BQU8sRUFBRSxVQUFVQyxDQUFDLEVBQUc7UUFDbkRBLENBQUMsQ0FBQ21NLGNBQWMsRUFBRTtRQUNsQixJQUFJMkQsUUFBUSxHQUFHLE1BQU0sS0FBS2tJLGVBQWUsQ0FBQ3RXLFlBQVksQ0FBRSxlQUFlLENBQUUsSUFBSSxLQUFLO1FBQ2xGc1csZUFBZSxDQUFDNVYsWUFBWSxDQUFFLGVBQWUsRUFBRSxDQUFFME4sUUFBUSxDQUFFO1FBQzNELElBQUssSUFBSSxLQUFLQSxRQUFRLEVBQUc7VUFDckJxSSxvQkFBb0IsQ0FBQ2xVLGNBQWMsRUFBRTtRQUN6QyxDQUFDLE1BQU07VUFDSGtVLG9CQUFvQixDQUFDdlUsY0FBYyxFQUFFO1FBQ3pDO01BQ0osQ0FBQyxDQUFFO0lBQ1A7RUFDSjtBQUNKIiwiZmlsZSI6Im1pbm5wb3N0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gdGxpdGUodCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLGZ1bmN0aW9uKGUpe3ZhciBpPWUudGFyZ2V0LG49dChpKTtufHwobj0oaT1pLnBhcmVudEVsZW1lbnQpJiZ0KGkpKSxuJiZ0bGl0ZS5zaG93KGksbiwhMCl9KX10bGl0ZS5zaG93PWZ1bmN0aW9uKHQsZSxpKXt2YXIgbj1cImRhdGEtdGxpdGVcIjtlPWV8fHt9LCh0LnRvb2x0aXB8fGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gbygpe3RsaXRlLmhpZGUodCwhMCl9ZnVuY3Rpb24gbCgpe3J8fChyPWZ1bmN0aW9uKHQsZSxpKXtmdW5jdGlvbiBuKCl7by5jbGFzc05hbWU9XCJ0bGl0ZSB0bGl0ZS1cIityK3M7dmFyIGU9dC5vZmZzZXRUb3AsaT10Lm9mZnNldExlZnQ7by5vZmZzZXRQYXJlbnQ9PT10JiYoZT1pPTApO3ZhciBuPXQub2Zmc2V0V2lkdGgsbD10Lm9mZnNldEhlaWdodCxkPW8ub2Zmc2V0SGVpZ2h0LGY9by5vZmZzZXRXaWR0aCxhPWkrbi8yO28uc3R5bGUudG9wPShcInNcIj09PXI/ZS1kLTEwOlwiblwiPT09cj9lK2wrMTA6ZStsLzItZC8yKStcInB4XCIsby5zdHlsZS5sZWZ0PShcIndcIj09PXM/aTpcImVcIj09PXM/aStuLWY6XCJ3XCI9PT1yP2krbisxMDpcImVcIj09PXI/aS1mLTEwOmEtZi8yKStcInB4XCJ9dmFyIG89ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksbD1pLmdyYXZ8fHQuZ2V0QXR0cmlidXRlKFwiZGF0YS10bGl0ZVwiKXx8XCJuXCI7by5pbm5lckhUTUw9ZSx0LmFwcGVuZENoaWxkKG8pO3ZhciByPWxbMF18fFwiXCIscz1sWzFdfHxcIlwiO24oKTt2YXIgZD1vLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVyblwic1wiPT09ciYmZC50b3A8MD8ocj1cIm5cIixuKCkpOlwiblwiPT09ciYmZC5ib3R0b20+d2luZG93LmlubmVySGVpZ2h0PyhyPVwic1wiLG4oKSk6XCJlXCI9PT1yJiZkLmxlZnQ8MD8ocj1cIndcIixuKCkpOlwid1wiPT09ciYmZC5yaWdodD53aW5kb3cuaW5uZXJXaWR0aCYmKHI9XCJlXCIsbigpKSxvLmNsYXNzTmFtZSs9XCIgdGxpdGUtdmlzaWJsZVwiLG99KHQsZCxlKSl9dmFyIHIscyxkO3JldHVybiB0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixvKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsbyksdC50b29sdGlwPXtzaG93OmZ1bmN0aW9uKCl7ZD10LnRpdGxlfHx0LmdldEF0dHJpYnV0ZShuKXx8ZCx0LnRpdGxlPVwiXCIsdC5zZXRBdHRyaWJ1dGUobixcIlwiKSxkJiYhcyYmKHM9c2V0VGltZW91dChsLGk/MTUwOjEpKX0saGlkZTpmdW5jdGlvbih0KXtpZihpPT09dCl7cz1jbGVhclRpbWVvdXQocyk7dmFyIGU9ciYmci5wYXJlbnROb2RlO2UmJmUucmVtb3ZlQ2hpbGQocikscj12b2lkIDB9fX19KHQsZSkpLnNob3coKX0sdGxpdGUuaGlkZT1mdW5jdGlvbih0LGUpe3QudG9vbHRpcCYmdC50b29sdGlwLmhpZGUoZSl9LFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9dGxpdGUpOyIsIi8qKiBcbiAqIExpYnJhcnkgY29kZVxuICogVXNpbmcgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvQGNsb3VkZm91ci90cmFuc2l0aW9uLWhpZGRlbi1lbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoe1xuICBlbGVtZW50LFxuICB2aXNpYmxlQ2xhc3MsXG4gIHdhaXRNb2RlID0gJ3RyYW5zaXRpb25lbmQnLFxuICB0aW1lb3V0RHVyYXRpb24sXG4gIGhpZGVNb2RlID0gJ2hpZGRlbicsXG4gIGRpc3BsYXlWYWx1ZSA9ICdibG9jaydcbn0pIHtcbiAgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcgJiYgdHlwZW9mIHRpbWVvdXREdXJhdGlvbiAhPT0gJ251bWJlcicpIHtcbiAgICBjb25zb2xlLmVycm9yKGBcbiAgICAgIFdoZW4gY2FsbGluZyB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCB3aXRoIHdhaXRNb2RlIHNldCB0byB0aW1lb3V0LFxuICAgICAgeW91IG11c3QgcGFzcyBpbiBhIG51bWJlciBmb3IgdGltZW91dER1cmF0aW9uLlxuICAgIGApO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRG9uJ3Qgd2FpdCBmb3IgZXhpdCB0cmFuc2l0aW9ucyBpZiBhIHVzZXIgcHJlZmVycyByZWR1Y2VkIG1vdGlvbi5cbiAgLy8gSWRlYWxseSB0cmFuc2l0aW9ucyB3aWxsIGJlIGRpc2FibGVkIGluIENTUywgd2hpY2ggbWVhbnMgd2Ugc2hvdWxkIG5vdCB3YWl0XG4gIC8vIGJlZm9yZSBhZGRpbmcgYGhpZGRlbmAuXG4gIGlmICh3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKS5tYXRjaGVzKSB7XG4gICAgd2FpdE1vZGUgPSAnaW1tZWRpYXRlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBldmVudCBsaXN0ZW5lciB0byBhZGQgYGhpZGRlbmAgYWZ0ZXIgb3VyIGFuaW1hdGlvbnMgY29tcGxldGUuXG4gICAqIFRoaXMgbGlzdGVuZXIgd2lsbCByZW1vdmUgaXRzZWxmIGFmdGVyIGNvbXBsZXRpbmcuXG4gICAqL1xuICBjb25zdCBsaXN0ZW5lciA9IGUgPT4ge1xuICAgIC8vIENvbmZpcm0gYHRyYW5zaXRpb25lbmRgIHdhcyBjYWxsZWQgb24gIG91ciBgZWxlbWVudGAgYW5kIGRpZG4ndCBidWJibGVcbiAgICAvLyB1cCBmcm9tIGEgY2hpbGQgZWxlbWVudC5cbiAgICBpZiAoZS50YXJnZXQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFwcGx5SGlkZGVuQXR0cmlidXRlcyA9ICgpID0+IHtcbiAgICBpZihoaWRlTW9kZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogU2hvdyB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25TaG93KCkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGlzIGxpc3RlbmVyIHNob3VsZG4ndCBiZSBoZXJlIGJ1dCBpZiBzb21lb25lIHNwYW1zIHRoZSB0b2dnbGVcbiAgICAgICAqIG92ZXIgYW5kIG92ZXIgcmVhbGx5IGZhc3QgaXQgY2FuIGluY29ycmVjdGx5IHN0aWNrIGFyb3VuZC5cbiAgICAgICAqIFdlIHJlbW92ZSBpdCBqdXN0IHRvIGJlIHNhZmUuXG4gICAgICAgKi9cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBTaW1pbGFybHksIHdlJ2xsIGNsZWFyIHRoZSB0aW1lb3V0IGluIGNhc2UgaXQncyBzdGlsbCBoYW5naW5nIGFyb3VuZC5cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgIH1cblxuICAgICAgcmVtb3ZlSGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICAvKipcbiAgICAgICAqIEZvcmNlIGEgYnJvd3NlciByZS1wYWludCBzbyB0aGUgYnJvd3NlciB3aWxsIHJlYWxpemUgdGhlXG4gICAgICAgKiBlbGVtZW50IGlzIG5vIGxvbmdlciBgaGlkZGVuYCBhbmQgYWxsb3cgdHJhbnNpdGlvbnMuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHJlZmxvdyA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSGlkZSB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25IaWRlKCkge1xuICAgICAgaWYgKHdhaXRNb2RlID09PSAndHJhbnNpdGlvbmVuZCcpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuICAgICAgfSBlbHNlIGlmICh3YWl0TW9kZSA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuICAgICAgICB9LCB0aW1lb3V0RHVyYXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCB0aGlzIGNsYXNzIHRvIHRyaWdnZXIgb3VyIGFuaW1hdGlvblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHZpc2libGVDbGFzcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZSB0aGUgZWxlbWVudCdzIHZpc2liaWxpdHlcbiAgICAgKi9cbiAgICB0b2dnbGUoKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbigpKSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvblNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGVsbCB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIGhpZGRlbiBvciBub3QuXG4gICAgICovXG4gICAgaXNIaWRkZW4oKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBoaWRkZW4gYXR0cmlidXRlIGRvZXMgbm90IHJlcXVpcmUgYSB2YWx1ZS4gU2luY2UgYW4gZW1wdHkgc3RyaW5nIGlzXG4gICAgICAgKiBmYWxzeSwgYnV0IHNob3dzIHRoZSBwcmVzZW5jZSBvZiBhbiBhdHRyaWJ1dGUgd2UgY29tcGFyZSB0byBgbnVsbGBcbiAgICAgICAqL1xuICAgICAgY29uc3QgaGFzSGlkZGVuQXR0cmlidXRlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hpZGRlbicpICE9PSBudWxsO1xuXG4gICAgICBjb25zdCBpc0Rpc3BsYXlOb25lID0gZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZSc7XG5cbiAgICAgIGNvbnN0IGhhc1Zpc2libGVDbGFzcyA9IFsuLi5lbGVtZW50LmNsYXNzTGlzdF0uaW5jbHVkZXModmlzaWJsZUNsYXNzKTtcblxuICAgICAgcmV0dXJuIGhhc0hpZGRlbkF0dHJpYnV0ZSB8fCBpc0Rpc3BsYXlOb25lIHx8ICFoYXNWaXNpYmxlQ2xhc3M7XG4gICAgfSxcblxuICAgIC8vIEEgcGxhY2Vob2xkZXIgZm9yIG91ciBgdGltZW91dGBcbiAgICB0aW1lb3V0OiBudWxsXG4gIH07XG59IiwiLyoqXG4gIFByaW9yaXR5KyBob3Jpem9udGFsIHNjcm9sbGluZyBtZW51LlxuXG4gIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgLSBDb250YWluZXIgZm9yIGFsbCBvcHRpb25zLlxuICAgIEBwYXJhbSB7c3RyaW5nIHx8IERPTSBub2RlfSBzZWxlY3RvciAtIEVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IG5hdlNlbGVjdG9yIC0gTmF2IGVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRTZWxlY3RvciAtIENvbnRlbnQgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gaXRlbVNlbGVjdG9yIC0gSXRlbXMgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvbkxlZnRTZWxlY3RvciAtIExlZnQgYnV0dG9uIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBidXR0b25SaWdodFNlbGVjdG9yIC0gUmlnaHQgYnV0dG9uIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7aW50ZWdlciB8fCBzdHJpbmd9IHNjcm9sbFN0ZXAgLSBBbW91bnQgdG8gc2Nyb2xsIG9uIGJ1dHRvbiBjbGljay4gJ2F2ZXJhZ2UnIGdldHMgdGhlIGF2ZXJhZ2UgbGluayB3aWR0aC5cbiovXG5cbmNvbnN0IFByaW9yaXR5TmF2U2Nyb2xsZXIgPSBmdW5jdGlvbih7XG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXInLFxuICAgIG5hdlNlbGVjdG9yOiBuYXZTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLW5hdicsXG4gICAgY29udGVudFNlbGVjdG9yOiBjb250ZW50U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1jb250ZW50JyxcbiAgICBpdGVtU2VsZWN0b3I6IGl0ZW1TZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWl0ZW0nLFxuICAgIGJ1dHRvbkxlZnRTZWxlY3RvcjogYnV0dG9uTGVmdFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0JyxcbiAgICBidXR0b25SaWdodFNlbGVjdG9yOiBidXR0b25SaWdodFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItYnRuLS1yaWdodCcsXG4gICAgc2Nyb2xsU3RlcDogc2Nyb2xsU3RlcCA9IDgwXG4gIH0gPSB7fSkge1xuXG4gIGNvbnN0IG5hdlNjcm9sbGVyID0gdHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIDogc2VsZWN0b3I7XG5cbiAgY29uc3QgdmFsaWRhdGVTY3JvbGxTdGVwID0gKCkgPT4ge1xuICAgIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKHNjcm9sbFN0ZXApIHx8IHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJztcbiAgfVxuXG4gIGlmIChuYXZTY3JvbGxlciA9PT0gdW5kZWZpbmVkIHx8IG5hdlNjcm9sbGVyID09PSBudWxsIHx8ICF2YWxpZGF0ZVNjcm9sbFN0ZXAoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgc29tZXRoaW5nIHdyb25nLCBjaGVjayB5b3VyIG9wdGlvbnMuJyk7XG4gIH1cblxuICBjb25zdCBuYXZTY3JvbGxlck5hdiA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IobmF2U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckNvbnRlbnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGNvbnRlbnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zID0gbmF2U2Nyb2xsZXJDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoaXRlbVNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJMZWZ0ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihidXR0b25MZWZ0U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlclJpZ2h0ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihidXR0b25SaWdodFNlbGVjdG9yKTtcblxuICBsZXQgc2Nyb2xsaW5nID0gZmFsc2U7XG4gIGxldCBzY3JvbGxBdmFpbGFibGVMZWZ0ID0gMDtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID0gMDtcbiAgbGV0IHNjcm9sbGluZ0RpcmVjdGlvbiA9ICcnO1xuICBsZXQgc2Nyb2xsT3ZlcmZsb3cgPSAnJztcbiAgbGV0IHRpbWVvdXQ7XG5cblxuICAvLyBTZXRzIG92ZXJmbG93IGFuZCB0b2dnbGUgYnV0dG9ucyBhY2NvcmRpbmdseVxuICBjb25zdCBzZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIHNjcm9sbE92ZXJmbG93ID0gZ2V0T3ZlcmZsb3coKTtcbiAgICB0b2dnbGVCdXR0b25zKHNjcm9sbE92ZXJmbG93KTtcbiAgICBjYWxjdWxhdGVTY3JvbGxTdGVwKCk7XG4gIH1cblxuXG4gIC8vIERlYm91bmNlIHNldHRpbmcgdGhlIG92ZXJmbG93IHdpdGggcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIGNvbnN0IHJlcXVlc3RTZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aW1lb3V0KSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGltZW91dCk7XG5cbiAgICB0aW1lb3V0ID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBzZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuICB9XG5cblxuICAvLyBHZXRzIHRoZSBvdmVyZmxvdyBhdmFpbGFibGUgb24gdGhlIG5hdiBzY3JvbGxlclxuICBjb25zdCBnZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzY3JvbGxXaWR0aCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbFdpZHRoO1xuICAgIGxldCBzY3JvbGxWaWV3cG9ydCA9IG5hdlNjcm9sbGVyTmF2LmNsaWVudFdpZHRoO1xuICAgIGxldCBzY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdDtcblxuICAgIHNjcm9sbEF2YWlsYWJsZUxlZnQgPSBzY3JvbGxMZWZ0O1xuICAgIHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID0gc2Nyb2xsV2lkdGggLSAoc2Nyb2xsVmlld3BvcnQgKyBzY3JvbGxMZWZ0KTtcblxuICAgIC8vIDEgaW5zdGVhZCBvZiAwIHRvIGNvbXBlbnNhdGUgZm9yIG51bWJlciByb3VuZGluZ1xuICAgIGxldCBzY3JvbGxMZWZ0Q29uZGl0aW9uID0gc2Nyb2xsQXZhaWxhYmxlTGVmdCA+IDE7XG4gICAgbGV0IHNjcm9sbFJpZ2h0Q29uZGl0aW9uID0gc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPiAxO1xuXG4gICAgLy8gY29uc29sZS5sb2coc2Nyb2xsV2lkdGgsIHNjcm9sbFZpZXdwb3J0LCBzY3JvbGxBdmFpbGFibGVMZWZ0LCBzY3JvbGxBdmFpbGFibGVSaWdodCk7XG5cbiAgICBpZiAoc2Nyb2xsTGVmdENvbmRpdGlvbiAmJiBzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdib3RoJztcbiAgICB9XG4gICAgZWxzZSBpZiAoc2Nyb2xsTGVmdENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdsZWZ0JztcbiAgICB9XG4gICAgZWxzZSBpZiAoc2Nyb2xsUmlnaHRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAncmlnaHQnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiAnbm9uZSc7XG4gICAgfVxuXG4gIH1cblxuXG4gIC8vIENhbGN1bGF0ZXMgdGhlIHNjcm9sbCBzdGVwIGJhc2VkIG9uIHRoZSB3aWR0aCBvZiB0aGUgc2Nyb2xsZXIgYW5kIHRoZSBudW1iZXIgb2YgbGlua3NcbiAgY29uc3QgY2FsY3VsYXRlU2Nyb2xsU3RlcCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzY3JvbGxTdGVwID09PSAnYXZlcmFnZScpIHtcbiAgICAgIGxldCBzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbFdpZHRoIC0gKHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWxlZnQnKSkgKyBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1yaWdodCcpKSk7XG5cbiAgICAgIGxldCBzY3JvbGxTdGVwQXZlcmFnZSA9IE1hdGguZmxvb3Ioc2Nyb2xsVmlld3BvcnROb1BhZGRpbmcgLyBuYXZTY3JvbGxlckNvbnRlbnRJdGVtcy5sZW5ndGgpO1xuXG4gICAgICBzY3JvbGxTdGVwID0gc2Nyb2xsU3RlcEF2ZXJhZ2U7XG4gICAgfVxuICB9XG5cblxuICAvLyBNb3ZlIHRoZSBzY3JvbGxlciB3aXRoIGEgdHJhbnNmb3JtXG4gIGNvbnN0IG1vdmVTY3JvbGxlciA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuXG4gICAgaWYgKHNjcm9sbGluZyA9PT0gdHJ1ZSB8fCAoc2Nyb2xsT3ZlcmZsb3cgIT09IGRpcmVjdGlvbiAmJiBzY3JvbGxPdmVyZmxvdyAhPT0gJ2JvdGgnKSkgcmV0dXJuO1xuXG4gICAgbGV0IHNjcm9sbERpc3RhbmNlID0gc2Nyb2xsU3RlcDtcbiAgICBsZXQgc2Nyb2xsQXZhaWxhYmxlID0gZGlyZWN0aW9uID09PSAnbGVmdCcgPyBzY3JvbGxBdmFpbGFibGVMZWZ0IDogc2Nyb2xsQXZhaWxhYmxlUmlnaHQ7XG5cbiAgICAvLyBJZiB0aGVyZSB3aWxsIGJlIGxlc3MgdGhhbiAyNSUgb2YgdGhlIGxhc3Qgc3RlcCB2aXNpYmxlIHRoZW4gc2Nyb2xsIHRvIHRoZSBlbmRcbiAgICBpZiAoc2Nyb2xsQXZhaWxhYmxlIDwgKHNjcm9sbFN0ZXAgKiAxLjc1KSkge1xuICAgICAgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxBdmFpbGFibGU7XG4gICAgfVxuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgc2Nyb2xsRGlzdGFuY2UgKj0gLTE7XG5cbiAgICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCBzY3JvbGxTdGVwKSB7XG4gICAgICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QuYWRkKCdzbmFwLWFsaWduLWVuZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJyk7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKCcgKyBzY3JvbGxEaXN0YW5jZSArICdweCknO1xuXG4gICAgc2Nyb2xsaW5nRGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHNjcm9sbGluZyA9IHRydWU7XG4gIH1cblxuXG4gIC8vIFNldCB0aGUgc2Nyb2xsZXIgcG9zaXRpb24gYW5kIHJlbW92ZXMgdHJhbnNmb3JtLCBjYWxsZWQgYWZ0ZXIgbW92ZVNjcm9sbGVyKCkgaW4gdGhlIHRyYW5zaXRpb25lbmQgZXZlbnRcbiAgY29uc3Qgc2V0U2Nyb2xsZXJQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCwgbnVsbCk7XG4gICAgdmFyIHRyYW5zZm9ybSA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3RyYW5zZm9ybScpO1xuICAgIHZhciB0cmFuc2Zvcm1WYWx1ZSA9IE1hdGguYWJzKHBhcnNlSW50KHRyYW5zZm9ybS5zcGxpdCgnLCcpWzRdKSB8fCAwKTtcblxuICAgIGlmIChzY3JvbGxpbmdEaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuICAgICAgdHJhbnNmb3JtVmFsdWUgKj0gLTE7XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJyc7XG4gICAgbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQgKyB0cmFuc2Zvcm1WYWx1ZTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnbm8tdHJhbnNpdGlvbicsICdzbmFwLWFsaWduLWVuZCcpO1xuXG4gICAgc2Nyb2xsaW5nID0gZmFsc2U7XG4gIH1cblxuXG4gIC8vIFRvZ2dsZSBidXR0b25zIGRlcGVuZGluZyBvbiBvdmVyZmxvd1xuICBjb25zdCB0b2dnbGVCdXR0b25zID0gZnVuY3Rpb24ob3ZlcmZsb3cpIHtcbiAgICBpZiAob3ZlcmZsb3cgPT09ICdib3RoJyB8fCBvdmVyZmxvdyA9PT0gJ2xlZnQnKSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJMZWZ0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cblxuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAncmlnaHQnKSB7XG4gICAgICBuYXZTY3JvbGxlclJpZ2h0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuICB9XG5cblxuICBjb25zdCBpbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICBzZXRPdmVyZmxvdygpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHJlcXVlc3RTZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJOYXYuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsICgpID0+IHtcbiAgICAgIHNldFNjcm9sbGVyUG9zaXRpb24oKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyTGVmdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1vdmVTY3JvbGxlcignbGVmdCcpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJSaWdodC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1vdmVTY3JvbGxlcigncmlnaHQnKTtcbiAgICB9KTtcblxuICB9O1xuXG5cbiAgLy8gU2VsZiBpbml0XG4gIGluaXQoKTtcblxuXG4gIC8vIFJldmVhbCBBUElcbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG5cbn07XG5cbi8vZXhwb3J0IGRlZmF1bHQgUHJpb3JpdHlOYXZTY3JvbGxlcjtcbiIsIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1widXNlIHN0cmljdFwiO3ZhciBfdmFsaWRGb3JtPXJlcXVpcmUoXCIuL3NyYy92YWxpZC1mb3JtXCIpO3ZhciBfdmFsaWRGb3JtMj1faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF92YWxpZEZvcm0pO2Z1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKXtyZXR1cm4gb2JqJiZvYmouX19lc01vZHVsZT9vYmo6e2RlZmF1bHQ6b2JqfX13aW5kb3cuVmFsaWRGb3JtPV92YWxpZEZvcm0yLmRlZmF1bHQ7d2luZG93LlZhbGlkRm9ybS50b2dnbGVJbnZhbGlkQ2xhc3M9X3ZhbGlkRm9ybS50b2dnbGVJbnZhbGlkQ2xhc3M7d2luZG93LlZhbGlkRm9ybS5oYW5kbGVDdXN0b21NZXNzYWdlcz1fdmFsaWRGb3JtLmhhbmRsZUN1c3RvbU1lc3NhZ2VzO3dpbmRvdy5WYWxpZEZvcm0uaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXk9X3ZhbGlkRm9ybS5oYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheX0se1wiLi9zcmMvdmFsaWQtZm9ybVwiOjN9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6dHJ1ZX0pO2V4cG9ydHMuY2xvbmU9Y2xvbmU7ZXhwb3J0cy5kZWZhdWx0cz1kZWZhdWx0cztleHBvcnRzLmluc2VydEFmdGVyPWluc2VydEFmdGVyO2V4cG9ydHMuaW5zZXJ0QmVmb3JlPWluc2VydEJlZm9yZTtleHBvcnRzLmZvckVhY2g9Zm9yRWFjaDtleHBvcnRzLmRlYm91bmNlPWRlYm91bmNlO2Z1bmN0aW9uIGNsb25lKG9iail7dmFyIGNvcHk9e307Zm9yKHZhciBhdHRyIGluIG9iail7aWYob2JqLmhhc093blByb3BlcnR5KGF0dHIpKWNvcHlbYXR0cl09b2JqW2F0dHJdfXJldHVybiBjb3B5fWZ1bmN0aW9uIGRlZmF1bHRzKG9iaixkZWZhdWx0T2JqZWN0KXtvYmo9Y2xvbmUob2JqfHx7fSk7Zm9yKHZhciBrIGluIGRlZmF1bHRPYmplY3Qpe2lmKG9ialtrXT09PXVuZGVmaW5lZClvYmpba109ZGVmYXVsdE9iamVjdFtrXX1yZXR1cm4gb2JqfWZ1bmN0aW9uIGluc2VydEFmdGVyKHJlZk5vZGUsbm9kZVRvSW5zZXJ0KXt2YXIgc2libGluZz1yZWZOb2RlLm5leHRTaWJsaW5nO2lmKHNpYmxpbmcpe3ZhciBfcGFyZW50PXJlZk5vZGUucGFyZW50Tm9kZTtfcGFyZW50Lmluc2VydEJlZm9yZShub2RlVG9JbnNlcnQsc2libGluZyl9ZWxzZXtwYXJlbnQuYXBwZW5kQ2hpbGQobm9kZVRvSW5zZXJ0KX19ZnVuY3Rpb24gaW5zZXJ0QmVmb3JlKHJlZk5vZGUsbm9kZVRvSW5zZXJ0KXt2YXIgcGFyZW50PXJlZk5vZGUucGFyZW50Tm9kZTtwYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGVUb0luc2VydCxyZWZOb2RlKX1mdW5jdGlvbiBmb3JFYWNoKGl0ZW1zLGZuKXtpZighaXRlbXMpcmV0dXJuO2lmKGl0ZW1zLmZvckVhY2gpe2l0ZW1zLmZvckVhY2goZm4pfWVsc2V7Zm9yKHZhciBpPTA7aTxpdGVtcy5sZW5ndGg7aSsrKXtmbihpdGVtc1tpXSxpLGl0ZW1zKX19fWZ1bmN0aW9uIGRlYm91bmNlKG1zLGZuKXt2YXIgdGltZW91dD12b2lkIDA7dmFyIGRlYm91bmNlZEZuPWZ1bmN0aW9uIGRlYm91bmNlZEZuKCl7Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO3RpbWVvdXQ9c2V0VGltZW91dChmbixtcyl9O3JldHVybiBkZWJvdW5jZWRGbn19LHt9XSwzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6dHJ1ZX0pO2V4cG9ydHMudG9nZ2xlSW52YWxpZENsYXNzPXRvZ2dsZUludmFsaWRDbGFzcztleHBvcnRzLmhhbmRsZUN1c3RvbU1lc3NhZ2VzPWhhbmRsZUN1c3RvbU1lc3NhZ2VzO2V4cG9ydHMuaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXk9aGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXk7ZXhwb3J0cy5kZWZhdWx0PXZhbGlkRm9ybTt2YXIgX3V0aWw9cmVxdWlyZShcIi4vdXRpbFwiKTtmdW5jdGlvbiB0b2dnbGVJbnZhbGlkQ2xhc3MoaW5wdXQsaW52YWxpZENsYXNzKXtpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW52YWxpZFwiLGZ1bmN0aW9uKCl7aW5wdXQuY2xhc3NMaXN0LmFkZChpbnZhbGlkQ2xhc3MpfSk7aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsZnVuY3Rpb24oKXtpZihpbnB1dC52YWxpZGl0eS52YWxpZCl7aW5wdXQuY2xhc3NMaXN0LnJlbW92ZShpbnZhbGlkQ2xhc3MpfX0pfXZhciBlcnJvclByb3BzPVtcImJhZElucHV0XCIsXCJwYXR0ZXJuTWlzbWF0Y2hcIixcInJhbmdlT3ZlcmZsb3dcIixcInJhbmdlVW5kZXJmbG93XCIsXCJzdGVwTWlzbWF0Y2hcIixcInRvb0xvbmdcIixcInRvb1Nob3J0XCIsXCJ0eXBlTWlzbWF0Y2hcIixcInZhbHVlTWlzc2luZ1wiLFwiY3VzdG9tRXJyb3JcIl07ZnVuY3Rpb24gZ2V0Q3VzdG9tTWVzc2FnZShpbnB1dCxjdXN0b21NZXNzYWdlcyl7Y3VzdG9tTWVzc2FnZXM9Y3VzdG9tTWVzc2FnZXN8fHt9O3ZhciBsb2NhbEVycm9yUHJvcHM9W2lucHV0LnR5cGUrXCJNaXNtYXRjaFwiXS5jb25jYXQoZXJyb3JQcm9wcyk7dmFyIHZhbGlkaXR5PWlucHV0LnZhbGlkaXR5O2Zvcih2YXIgaT0wO2k8bG9jYWxFcnJvclByb3BzLmxlbmd0aDtpKyspe3ZhciBwcm9wPWxvY2FsRXJyb3JQcm9wc1tpXTtpZih2YWxpZGl0eVtwcm9wXSl7cmV0dXJuIGlucHV0LmdldEF0dHJpYnV0ZShcImRhdGEtXCIrcHJvcCl8fGN1c3RvbU1lc3NhZ2VzW3Byb3BdfX19ZnVuY3Rpb24gaGFuZGxlQ3VzdG9tTWVzc2FnZXMoaW5wdXQsY3VzdG9tTWVzc2FnZXMpe2Z1bmN0aW9uIGNoZWNrVmFsaWRpdHkoKXt2YXIgbWVzc2FnZT1pbnB1dC52YWxpZGl0eS52YWxpZD9udWxsOmdldEN1c3RvbU1lc3NhZ2UoaW5wdXQsY3VzdG9tTWVzc2FnZXMpO2lucHV0LnNldEN1c3RvbVZhbGlkaXR5KG1lc3NhZ2V8fFwiXCIpfWlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLGNoZWNrVmFsaWRpdHkpO2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnZhbGlkXCIsY2hlY2tWYWxpZGl0eSl9ZnVuY3Rpb24gaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkoaW5wdXQsb3B0aW9ucyl7dmFyIHZhbGlkYXRpb25FcnJvckNsYXNzPW9wdGlvbnMudmFsaWRhdGlvbkVycm9yQ2xhc3MsdmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3M9b3B0aW9ucy52YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzcyxlcnJvclBsYWNlbWVudD1vcHRpb25zLmVycm9yUGxhY2VtZW50O2Z1bmN0aW9uIGNoZWNrVmFsaWRpdHkob3B0aW9ucyl7dmFyIGluc2VydEVycm9yPW9wdGlvbnMuaW5zZXJ0RXJyb3I7dmFyIHBhcmVudE5vZGU9aW5wdXQucGFyZW50Tm9kZTt2YXIgZXJyb3JOb2RlPXBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihcIi5cIit2YWxpZGF0aW9uRXJyb3JDbGFzcyl8fGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7aWYoIWlucHV0LnZhbGlkaXR5LnZhbGlkJiZpbnB1dC52YWxpZGF0aW9uTWVzc2FnZSl7ZXJyb3JOb2RlLmNsYXNzTmFtZT12YWxpZGF0aW9uRXJyb3JDbGFzcztlcnJvck5vZGUudGV4dENvbnRlbnQ9aW5wdXQudmFsaWRhdGlvbk1lc3NhZ2U7aWYoaW5zZXJ0RXJyb3Ipe2Vycm9yUGxhY2VtZW50PT09XCJiZWZvcmVcIj8oMCxfdXRpbC5pbnNlcnRCZWZvcmUpKGlucHV0LGVycm9yTm9kZSk6KDAsX3V0aWwuaW5zZXJ0QWZ0ZXIpKGlucHV0LGVycm9yTm9kZSk7cGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzKX19ZWxzZXtwYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUodmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3MpO2Vycm9yTm9kZS5yZW1vdmUoKX19aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsZnVuY3Rpb24oKXtjaGVja1ZhbGlkaXR5KHtpbnNlcnRFcnJvcjpmYWxzZX0pfSk7aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImludmFsaWRcIixmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCk7Y2hlY2tWYWxpZGl0eSh7aW5zZXJ0RXJyb3I6dHJ1ZX0pfSl9dmFyIGRlZmF1bHRPcHRpb25zPXtpbnZhbGlkQ2xhc3M6XCJpbnZhbGlkXCIsdmFsaWRhdGlvbkVycm9yQ2xhc3M6XCJ2YWxpZGF0aW9uLWVycm9yXCIsdmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3M6XCJoYXMtdmFsaWRhdGlvbi1lcnJvclwiLGN1c3RvbU1lc3NhZ2VzOnt9LGVycm9yUGxhY2VtZW50OlwiYmVmb3JlXCJ9O2Z1bmN0aW9uIHZhbGlkRm9ybShlbGVtZW50LG9wdGlvbnMpe2lmKCFlbGVtZW50fHwhZWxlbWVudC5ub2RlTmFtZSl7dGhyb3cgbmV3IEVycm9yKFwiRmlyc3QgYXJnIHRvIHZhbGlkRm9ybSBtdXN0IGJlIGEgZm9ybSwgaW5wdXQsIHNlbGVjdCwgb3IgdGV4dGFyZWFcIil9dmFyIGlucHV0cz12b2lkIDA7dmFyIHR5cGU9ZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO29wdGlvbnM9KDAsX3V0aWwuZGVmYXVsdHMpKG9wdGlvbnMsZGVmYXVsdE9wdGlvbnMpO2lmKHR5cGU9PT1cImZvcm1cIil7aW5wdXRzPWVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0LCBzZWxlY3QsIHRleHRhcmVhXCIpO2ZvY3VzSW52YWxpZElucHV0KGVsZW1lbnQsaW5wdXRzKX1lbHNlIGlmKHR5cGU9PT1cImlucHV0XCJ8fHR5cGU9PT1cInNlbGVjdFwifHx0eXBlPT09XCJ0ZXh0YXJlYVwiKXtpbnB1dHM9W2VsZW1lbnRdfWVsc2V7dGhyb3cgbmV3IEVycm9yKFwiT25seSBmb3JtLCBpbnB1dCwgc2VsZWN0LCBvciB0ZXh0YXJlYSBlbGVtZW50cyBhcmUgc3VwcG9ydGVkXCIpfXZhbGlkRm9ybUlucHV0cyhpbnB1dHMsb3B0aW9ucyl9ZnVuY3Rpb24gZm9jdXNJbnZhbGlkSW5wdXQoZm9ybSxpbnB1dHMpe3ZhciBmb2N1c0ZpcnN0PSgwLF91dGlsLmRlYm91bmNlKSgxMDAsZnVuY3Rpb24oKXt2YXIgaW52YWxpZE5vZGU9Zm9ybS5xdWVyeVNlbGVjdG9yKFwiOmludmFsaWRcIik7aWYoaW52YWxpZE5vZGUpaW52YWxpZE5vZGUuZm9jdXMoKX0pOygwLF91dGlsLmZvckVhY2gpKGlucHV0cyxmdW5jdGlvbihpbnB1dCl7cmV0dXJuIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnZhbGlkXCIsZm9jdXNGaXJzdCl9KX1mdW5jdGlvbiB2YWxpZEZvcm1JbnB1dHMoaW5wdXRzLG9wdGlvbnMpe3ZhciBpbnZhbGlkQ2xhc3M9b3B0aW9ucy5pbnZhbGlkQ2xhc3MsY3VzdG9tTWVzc2FnZXM9b3B0aW9ucy5jdXN0b21NZXNzYWdlczsoMCxfdXRpbC5mb3JFYWNoKShpbnB1dHMsZnVuY3Rpb24oaW5wdXQpe3RvZ2dsZUludmFsaWRDbGFzcyhpbnB1dCxpbnZhbGlkQ2xhc3MpO2hhbmRsZUN1c3RvbU1lc3NhZ2VzKGlucHV0LGN1c3RvbU1lc3NhZ2VzKTtoYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheShpbnB1dCxvcHRpb25zKX0pfX0se1wiLi91dGlsXCI6Mn1dfSx7fSxbMV0pOyIsIi8qKlxuICogRG8gdGhlc2UgdGhpbmdzIGFzIHF1aWNrbHkgYXMgcG9zc2libGU7IHdlIG1pZ2h0IGhhdmUgQ1NTIG9yIGVhcmx5IHNjcmlwdHMgdGhhdCByZXF1aXJlIG9uIGl0XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICduby1qcycgKTtcbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCAnanMnICk7XG4iLCIvKipcbiAqIFRoaXMgaXMgdXNlZCB0byBjYXVzZSBHb29nbGUgQW5hbHl0aWNzIGV2ZW50cyB0byBydW5cbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8qXG4gKiBDYWxsIGhvb2tzIGZyb20gb3RoZXIgcGxhY2VzLlxuICogVGhpcyBhbGxvd3Mgb3RoZXIgcGx1Z2lucyB0aGF0IHdlIG1haW50YWluIHRvIHBhc3MgZGF0YSB0byB0aGUgdGhlbWUncyBhbmFseXRpY3MgbWV0aG9kLlxuKi9cbmlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiB3cCApIHtcblx0Ly8gZm9yIGFuYWx5dGljc1xuXHR3cC5ob29rcy5hZGRBY3Rpb24oICd3cE1lc3NhZ2VJbnNlcnRlckFuYWx5dGljc0V2ZW50JywgJ21pbm5wb3N0TGFyZ28nLCBtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQsIDEwICk7XG5cdHdwLmhvb2tzLmFkZEFjdGlvbiggJ21pbm5wb3N0Rm9ybVByb2Nlc3Nvck1haWxjaGltcEFuYWx5dGljc0V2ZW50JywgJ21pbm5wb3N0TGFyZ28nLCBtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQsIDEwICk7XG5cdHdwLmhvb2tzLmFkZEFjdGlvbiggJ21pbm5wb3N0TWVtYmVyc2hpcEFuYWx5dGljc0V2ZW50JywgJ21pbm5wb3N0TGFyZ28nLCBtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQsIDEwICk7XG5cdHdwLmhvb2tzLmFkZEFjdGlvbiggJ21pbm5wb3N0TWVtYmVyc2hpcEFuYWx5dGljc0Vjb21tZXJjZUFjdGlvbicsICdtaW5ucG9zdExhcmdvJywgbXBBbmFseXRpY3NUcmFja2luZ0Vjb21tZXJjZUFjdGlvbiwgMTAgKTtcblxuXHQvLyBmb3IgZGF0YSBsYXllciB0byBHb29nbGUgVGFnIE1hbmFnZXJcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnd3BNZXNzYWdlSW5zZXJ0ZXJEYXRhTGF5ZXJFdmVudCcsICdtaW5ucG9zdExhcmdvJywgbXBEYXRhTGF5ZXJFdmVudCwgMTAgKTtcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnbWlubnBvc3RGb3JtUHJvY2Vzc29yTWFpbGNoaW1wRGF0YUxheWVyRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wRGF0YUxheWVyRXZlbnQsIDEwICk7XG5cdHdwLmhvb2tzLmFkZEFjdGlvbiggJ21pbm5wb3N0TWVtYmVyc2hpcERhdGFMYXllckVjb21tZXJjZUFjdGlvbicsICdtaW5ucG9zdExhcmdvJywgbXBEYXRhTGF5ZXJFY29tbWVyY2UsIDEwICk7XG59XG5cbi8qXG4gKiBDcmVhdGUgYSBHb29nbGUgQW5hbHl0aWNzIGV2ZW50IGZvciB0aGUgdGhlbWUuIFRoaXMgY2FsbHMgdGhlIHdwLWFuYWx5dGljcy10cmFja2luZy1nZW5lcmF0b3IgYWN0aW9uLlxuICogdHlwZTogZ2VuZXJhbGx5IHRoaXMgaXMgXCJldmVudFwiXG4gKiBjYXRlZ29yeTogRXZlbnQgQ2F0ZWdvcnlcbiAqIGxhYmVsOiBFdmVudCBMYWJlbFxuICogYWN0aW9uOiBFdmVudCBBY3Rpb25cbiAqIHZhbHVlOiBvcHRpb25hbFxuICogbm9uX2ludGVyYWN0aW9uOiBvcHRpb25hbFxuKi9cbmZ1bmN0aW9uIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlLCBub25faW50ZXJhY3Rpb24gKSB7XG5cdHdwLmhvb2tzLmRvQWN0aW9uKCAnd3BBbmFseXRpY3NUcmFja2luZ0dlbmVyYXRvckV2ZW50JywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlLCBub25faW50ZXJhY3Rpb24gKTtcbn1cblxuLypcbiAqIENyZWF0ZSBhIGRhdGFsYXllciBldmVudCBmb3IgdGhlIHRoZW1lIHVzaW5nIHRoZSBndG00d3AgcGx1Z2luLiBUaGlzIHNldHMgdGhlIGRhdGFMYXllciBvYmplY3QgZm9yIEdvb2dsZSBUYWcgTWFuYWdlci5cbiAqIEl0IHNob3VsZCBvbmx5IGhhdmUgZGF0YSB0aGF0IGlzIG5vdCBhdmFpYWxhYmxlIHRvIEdUTSBieSBkZWZhdWx0LlxuICogZGF0YUxheWVyQ29udGVudDogdGhlIG9iamVjdCB0aGF0IHNob3VsZCBiZSBhZGRlZFxuKi9cbmZ1bmN0aW9uIG1wRGF0YUxheWVyRXZlbnQoIGRhdGFMYXllckNvbnRlbnQgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBkYXRhTGF5ZXIgJiYgT2JqZWN0LmtleXMoIGRhdGFMYXllckNvbnRlbnQgKS5sZW5ndGggIT09IDAgKSB7XG5cdFx0ZGF0YUxheWVyLnB1c2goIGRhdGFMYXllckNvbnRlbnQgKTtcblx0fVxufVxuXG4vKlxuICogQ3JlYXRlIGEgR29vZ2xlIEFuYWx5dGljcyBFY29tbWVyY2UgYWN0aW9uIGZvciB0aGUgdGhlbWUuIFRoaXMgY2FsbHMgdGhlIHdwLWFuYWx5dGljcy10cmFja2luZy1nZW5lcmF0b3IgYWN0aW9uLlxuICpcbiovXG5mdW5jdGlvbiBtcEFuYWx5dGljc1RyYWNraW5nRWNvbW1lcmNlQWN0aW9uKCB0eXBlLCBhY3Rpb24sIHByb2R1Y3QsIHN0ZXAgKSB7XG5cdHdwLmhvb2tzLmRvQWN0aW9uKCAnd3BBbmFseXRpY3NUcmFja2luZ0dlbmVyYXRvckVjb21tZXJjZUFjdGlvbicsIHR5cGUsIGFjdGlvbiwgcHJvZHVjdCwgc3RlcCApO1xufVxuXG4vKlxuICogU2V0IHVwIGRhdGFMYXllciBzdHVmZiBmb3IgZWNvbW1lcmNlIHZpYSBHb29nbGUgVGFnIE1hbmFnZXIgdXNpbmcgdGhlIGd0bTR3cCBwbHVnaW4uXG4gKlxuKi9cbmZ1bmN0aW9uIG1wRGF0YUxheWVyRWNvbW1lcmNlKCBkYXRhTGF5ZXJDb250ZW50ICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZGF0YUxheWVyICYmIE9iamVjdC5rZXlzKCBkYXRhTGF5ZXJDb250ZW50ICkubGVuZ3RoICE9PSAwICkge1xuXHRcdGRhdGFMYXllci5wdXNoKHsgZWNvbW1lcmNlOiBudWxsIH0pOyAvLyBmaXJzdCwgbWFrZSBzdXJlIHRoZXJlIGFyZW4ndCBtdWx0aXBsZSB0aGluZ3MgaGFwcGVuaW5nLlxuXHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBkYXRhTGF5ZXJDb250ZW50LmFjdGlvbiAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGRhdGFMYXllckNvbnRlbnQucHJvZHVjdCApIHtcblx0XHRcdGRhdGFMYXllci5wdXNoKHtcblx0XHRcdFx0ZXZlbnQ6IGRhdGFMYXllckNvbnRlbnQuYWN0aW9uLFxuXHRcdFx0XHRlY29tbWVyY2U6IHtcblx0XHRcdFx0XHRpdGVtczogW2RhdGFMYXllckNvbnRlbnQucHJvZHVjdF1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG59XG5cbi8qXG4gKiBXaGVuIGEgcGFydCBvZiB0aGUgd2Vic2l0ZSBpcyBtZW1iZXItc3BlY2lmaWMsIGNyZWF0ZSBhbiBldmVudCBmb3Igd2hldGhlciBpdCB3YXMgc2hvd24gb3Igbm90LlxuKi9cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdH1cblx0XHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3Igc2hhcmluZyBjb250ZW50XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG4vLyB0cmFjayBhIHNoYXJlIHZpYSBhbmFseXRpY3MgZXZlbnQuXG5mdW5jdGlvbiB0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiA9ICcnICkge1xuICAgIHZhciBjYXRlZ29yeSA9ICdTaGFyZSc7XG4gICAgaWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG4gICAgICAgIGNhdGVnb3J5ID0gJ1NoYXJlIC0gJyArIHBvc2l0aW9uO1xuICAgIH1cblxuICAgIC8vIHRyYWNrIGFzIGFuIGV2ZW50XG4gICAgbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeSwgdGV4dCwgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn1cblxuLy8gdG9wIHNoYXJlIGJ1dHRvbiBjbGlja1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWVudHJ5LXNoYXJlLXRvcCBhJyApLmZvckVhY2goXG4gICAgdG9wQnV0dG9uID0+IHRvcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoIGUgKSA9PiB7XG4gICAgICAgIHZhciB0ZXh0ID0gZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSggJ2RhdGEtc2hhcmUtYWN0aW9uJyApO1xuICAgICAgICB2YXIgcG9zaXRpb24gPSAndG9wJztcbiAgICAgICAgdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcbiAgICB9IClcbik7XG5cbi8vIHdoZW4gdGhlIHByaW50IGJ1dHRvbiBpcyBjbGlja2VkXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtcHJpbnQgYScgKS5mb3JFYWNoKFxuICAgIHByaW50QnV0dG9uID0+IHByaW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsICggZSApID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB3aW5kb3cucHJpbnQoKTtcbiAgICB9IClcbik7XG5cbi8vIHdoZW4gdGhlIHJlcHVibGlzaCBidXR0b24gaXMgY2xpY2tlZFxuLy8gdGhlIHBsdWdpbiBjb250cm9scyB0aGUgcmVzdCwgYnV0IHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRoZSBkZWZhdWx0IGV2ZW50IGRvZXNuJ3QgZmlyZVxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXJlcHVibGlzaCBhJyApLmZvckVhY2goXG4gICAgcmVwdWJsaXNoQnV0dG9uID0+IHJlcHVibGlzaEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoIGUgKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9IClcbik7XG5cbi8vIHdoZW4gdGhlIGNvcHkgbGluayBidXR0b24gaXMgY2xpY2tlZFxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWNvcHktdXJsIGEnICkuZm9yRWFjaChcbiAgICBjb3B5QnV0dG9uID0+IGNvcHlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCBlICkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCBjb3B5VGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCggY29weVRleHQgKS50aGVuKCAoKSA9PiB7XG4gICAgICAgICAgICB0bGl0ZS5zaG93KCAoIGUudGFyZ2V0ICksIHsgZ3JhdjogJ3cnIH0gKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRsaXRlLmhpZGUoICggZS50YXJnZXQgKSApO1xuICAgICAgICAgICAgfSwgMzAwMCApO1xuICAgICAgICB9ICk7XG4gICAgfSApXG4pO1xuXG4vLyB3aGVuIHNoYXJpbmcgdmlhIGZhY2Vib29rLCB0d2l0dGVyLCBvciBlbWFpbCwgb3BlbiB0aGUgZGVzdGluYXRpb24gdXJsIGluIGEgbmV3IHdpbmRvd1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWZhY2Vib29rIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXR3aXR0ZXIgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZW1haWwgYScgKS5mb3JFYWNoKFxuICAgIGFueVNoYXJlQnV0dG9uID0+IGFueVNoYXJlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsICggZSApID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciB1cmwgPSBlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCAnaHJlZicgKTtcblx0XHR3aW5kb3cub3BlbiggdXJsLCAnX2JsYW5rJyApO1xuICAgIH0gKVxuKTtcbiIsIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIE5hdmlnYXRpb24gc2NyaXB0cy4gSW5jbHVkZXMgbW9iaWxlIG9yIHRvZ2dsZSBiZWhhdmlvciwgYW5hbHl0aWNzIHRyYWNraW5nIG9mIHNwZWNpZmljIG1lbnVzLlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkgaW4gdGhlIGZ1bmN0aW9ucyBhdCB0aGUgYm90dG9tLlxuICovXG5cbmZ1bmN0aW9uIHNldHVwUHJpbWFyeU5hdigpIHtcblx0Y29uc3QgcHJpbWFyeU5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1saW5rcycgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHByaW1hcnlOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IGJ1dHRvbicgKTtcblx0aWYgKCBudWxsICE9PSBwcmltYXJ5TmF2VG9nZ2xlICkge1xuXHRcdHByaW1hcnlOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRjb25zdCB1c2VyTmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItYWNjb3VudCB1bCcgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHVzZXJOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItYWNjb3VudCA+IGEnICk7XG5cdGlmICggbnVsbCAhPT0gdXNlck5hdlRvZ2dsZSApIHtcblx0XHR1c2VyTmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0dmFyIHRhcmdldCAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgLm0tZm9ybS1zZWFyY2ggZmllbGRzZXQgLmEtYnV0dG9uLXNlbnRlbmNlJyApO1xuXHRpZiAoIG51bGwgIT09IHRhcmdldCApIHtcblx0XHR2YXIgZGl2ICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRkaXYuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLXNlYXJjaFwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuXHRcdHZhciBmcmFnbWVudCAgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0ZGl2LnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuXHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG5cblx0XHRjb25zdCBzZWFyY2hUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1hY3Rpb25zIC5tLWZvcm0tc2VhcmNoJyApLFxuXHRcdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHRcdH0gKTtcblxuXHRcdHZhciBzZWFyY2hWaXNpYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ2xpLnNlYXJjaCA+IGEnICk7XG5cdFx0c2VhcmNoVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHR2YXIgc2VhcmNoQ2xvc2UgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLXNlYXJjaCcgKTtcblx0XHRzZWFyY2hDbG9zZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiggZXZ0ICkge1xuXHRcdGV2dCA9IGV2dCB8fCB3aW5kb3cuZXZlbnQ7XG5cdFx0dmFyIGlzRXNjYXBlID0gZmFsc2U7XG5cdFx0aWYgKCAna2V5JyBpbiBldnQgKSB7XG5cdFx0XHRpc0VzY2FwZSA9ICggJ0VzY2FwZScgPT09IGV2dC5rZXkgfHwgJ0VzYycgPT09IGV2dC5rZXkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aXNFc2NhcGUgPSAoIDI3ID09PSBldnQua2V5Q29kZSApO1xuXHRcdH1cblx0XHRpZiAoIGlzRXNjYXBlICkge1xuXHRcdFx0bGV0IHByaW1hcnlOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gcHJpbWFyeU5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHVzZXJOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gdXNlck5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHNlYXJjaElzVmlzaWJsZSA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBwcmltYXJ5TmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gcHJpbWFyeU5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHRwcmltYXJ5TmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHByaW1hcnlOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHVzZXJOYXZFeHBhbmRlZCAmJiB0cnVlID09PSB1c2VyTmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgdXNlck5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2Ygc2VhcmNoSXNWaXNpYmxlICYmIHRydWUgPT09IHNlYXJjaElzVmlzaWJsZSApIHtcblx0XHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBzZWFyY2hJc1Zpc2libGUgKTtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufVxuc2V0dXBQcmltYXJ5TmF2KCk7IC8vIHRoaXMgd2hvbGUgZnVuY3Rpb24gZG9lcyBub3QgcmVxdWlyZSBqcXVlcnkuXG5cbmZ1bmN0aW9uIHNldHVwU2Nyb2xsTmF2KCkge1xuXG5cdGxldCBzdWJOYXZTY3JvbGxlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tc3ViLW5hdmlnYXRpb24nICk7XG5cdHN1Yk5hdlNjcm9sbGVycy5mb3JFYWNoKCAoIGN1cnJlbnRWYWx1ZSApID0+IHtcblx0XHRQcmlvcml0eU5hdlNjcm9sbGVyKCB7XG5cdFx0XHRzZWxlY3RvcjogY3VycmVudFZhbHVlLFxuXHRcdFx0bmF2U2VsZWN0b3I6ICcubS1zdWJuYXYtbmF2aWdhdGlvbicsXG5cdFx0XHRjb250ZW50U2VsZWN0b3I6ICcubS1tZW51LXN1Yi1uYXZpZ2F0aW9uJyxcblx0XHRcdGl0ZW1TZWxlY3RvcjogJ2xpLCBhJyxcblx0XHRcdGJ1dHRvbkxlZnRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0Jyxcblx0XHRcdGJ1dHRvblJpZ2h0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tcmlnaHQnXG5cdFx0fSApO1xuXHR9ICk7XG5cblx0bGV0IHBhZ2luYXRpb25TY3JvbGxlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tcGFnaW5hdGlvbi1uYXZpZ2F0aW9uJyApO1xuXHRwYWdpbmF0aW9uU2Nyb2xsZXJzLmZvckVhY2goICggY3VycmVudFZhbHVlICkgPT4ge1xuXHRcdFByaW9yaXR5TmF2U2Nyb2xsZXIoIHtcblx0XHRcdHNlbGVjdG9yOiBjdXJyZW50VmFsdWUsXG5cdFx0XHRuYXZTZWxlY3RvcjogJy5tLXBhZ2luYXRpb24tY29udGFpbmVyJyxcblx0XHRcdGNvbnRlbnRTZWxlY3RvcjogJy5tLXBhZ2luYXRpb24tbGlzdCcsXG5cdFx0XHRpdGVtU2VsZWN0b3I6ICdsaSwgYScsXG5cdFx0XHRidXR0b25MZWZ0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tbGVmdCcsXG5cdFx0XHRidXR0b25SaWdodFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0J1xuXHRcdH0gKTtcblx0fSApO1xuXG59XG5zZXR1cFNjcm9sbE5hdigpOyAvLyB0aGlzIHdob2xlIGZ1bmN0aW9uIGRvZXMgbm90IHJlcXVpcmUganF1ZXJ5LlxuXG5cbi8vIHRoaXMgaXMgdGhlIHBhcnQgdGhhdCByZXF1aXJlcyBqcXVlcnkuXG4kKCAnYScsICQoICcuby1zaXRlLXNpZGViYXInICkgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdHZhciB3aWRnZXRUaXRsZSAgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS13aWRnZXQnICkuZmluZCggJ2gzJyApLnRleHQoKTtcblx0dmFyIHpvbmVUaXRsZSAgICAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXpvbmUnICkuZmluZCggJy5hLXpvbmUtdGl0bGUnICkudGV4dCgpO1xuXHR2YXIgc2lkZWJhclNlY3Rpb25UaXRsZSA9ICcnO1xuXHRpZiAoICcnICE9PSB3aWRnZXRUaXRsZSApIHtcblx0XHRzaWRlYmFyU2VjdGlvblRpdGxlID0gd2lkZ2V0VGl0bGU7XG5cdH0gZWxzZSBpZiAoICcnICE9PSB6b25lVGl0bGUgKSB7XG5cdFx0c2lkZWJhclNlY3Rpb25UaXRsZSA9IHpvbmVUaXRsZTtcblx0fVxuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsICdTaWRlYmFyIExpbmsnLCAnQ2xpY2snLCBzaWRlYmFyU2VjdGlvblRpdGxlICk7XG59ICk7XG5cbiQoICdhJywgJCggJy5tLXJlbGF0ZWQnICkgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1JlbGF0ZWQgU2VjdGlvbiBMaW5rJywgJ0NsaWNrJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgZm9ybXNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxualF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICggdGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgJycgIT09IHRoaXMubm9kZVZhbHVlLnRyaW0oKSApO1xuXHR9ICk7XG59O1xuXG5mdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0cmV0dXJuIG1hcmt1cDtcbn1cblxuZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCggJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nICk7XG5cdHZhciByZXN0Um9vdCAgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0dmFyIGZ1bGxVcmwgICAgICAgICAgICA9IHJlc3RSb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdHZhciBjb25maXJtQ2hhbmdlICAgICAgPSAnJztcblx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdHZhciBuZXdQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIG9sZFByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0dmFyIGNvbnNvbGlkYXRlZEVtYWlscyA9IFtdO1xuXHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdHZhciBhamF4Rm9ybURhdGEgICAgICAgPSAnJztcblx0dmFyIHRoYXQgICAgICAgICAgICAgICA9ICcnO1xuXG5cdC8vIHN0YXJ0IG91dCB3aXRoIG5vIHByaW1hcnkvcmVtb3ZhbHMgY2hlY2tlZFxuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHQvLyBpZiB0aGVyZSBpcyBhIGxpc3Qgb2YgZW1haWxzIChub3QganVzdCBhIHNpbmdsZSBmb3JtIGZpZWxkKVxuXHRpZiAoIDAgPCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cblx0XHQvLyBpZiBhIHVzZXIgc2VsZWN0cyBhIG5ldyBwcmltYXJ5LCBtb3ZlIGl0IGludG8gdGhhdCBwb3NpdGlvblxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oKSB7XG5cblx0XHRcdG5ld1ByaW1hcnlFbWFpbCA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdG9sZFByaW1hcnlFbWFpbCA9ICQoICcjZW1haWwnICkudmFsKCk7XG5cdFx0XHRwcmltYXJ5SWQgICAgICAgPSAkKCB0aGlzICkucHJvcCggJ2lkJyApLnJlcGxhY2UoICdwcmltYXJ5X2VtYWlsXycsICcnICk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncHJpbWFyeS1jaGFuZ2UnICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlclxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblxuXHRcdFx0Ly8kKCB0aGlzICkucGFyZW50KCkuYWZ0ZXIoIGNvbmZpcm1DaGFuZ2UgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSB1c2VyIGZhY2luZyB2YWx1ZXNcblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG5ld1ByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3VzZXItZW1haWwtJyArIHByaW1hcnlJZCApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgbWFpbiBoaWRkZW4gZm9ybSB2YWx1ZVxuXHRcdFx0XHQkKCAnI2VtYWlsJyApLnZhbCggbmV3UHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gc3VibWl0IGZvcm0gdmFsdWVzLlxuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXG5cdFx0XHRcdC8vIHVuY2hlY2sgdGhlIHJhZGlvIGJ1dHRvblxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBmb3JtIHZhbHVlcyB0byB0aGUgb2xkIHByaW1hcnkgZW1haWxcblx0XHRcdFx0JCggJyNwcmltYXJ5X2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3JlbW92ZV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyByZW1vdmUgdGhlIGNvbmZpcm0gbWVzc2FnZVxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHJlbW92ZXMgYW4gZW1haWwsIHRha2UgaXQgYXdheSBmcm9tIHRoZSB2aXN1YWwgYW5kIGZyb20gdGhlIGZvcm1cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2hhbmdlJywgJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgIT09IGVtYWlsVG9SZW1vdmUgKSB7XG5cdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlciBmb3IgcmVtb3ZhbFxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0Ly8gaWYgY29uZmlybWVkLCByZW1vdmUgdGhlIGVtYWlsIGFuZCBzdWJtaXQgdGhlIGZvcm1cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGknICkuZmFkZU91dCggJ25vcm1hbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cblx0XHRcdFx0Ly9jb25zb2xlLmxvZyggJ3ZhbHVlIGlzICcgKyBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnICkuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvbiBhLWJ1dHRvbi1hZGQtdXNlci1lbWFpbFwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRuZXh0RW1haWxDb3VudCsrO1xuXHR9ICk7XG5cblx0JCggJ2lucHV0W3R5cGU9c3VibWl0XScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGJ1dHRvbiA9ICQoIHRoaXMgKTtcblx0XHR2YXIgYnV0dG9uRm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCAnZm9ybScgKTtcblx0XHRidXR0b25Gb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicsIGJ1dHRvbi52YWwoKSApO1xuXHR9ICk7XG5cblx0JCggJy5tLWVudHJ5LWNvbnRlbnQnICkub24oICdzdWJtaXQnLCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgZm9ybSA9ICQoIHRoaXMgKTtcblx0XHR2YXIgc3VibWl0dGluZ0J1dHRvbiA9IGZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJyApIHx8ICcnO1xuXG5cdFx0Ly8gaWYgdGhlcmUgaXMgbm8gc3VibWl0dGluZyBidXR0b24sIHBhc3MgaXQgYnkgQWpheFxuXHRcdGlmICggJycgPT09IHN1Ym1pdHRpbmdCdXR0b24gfHwgJ1NhdmUgQ2hhbmdlcycgIT09IHN1Ym1pdHRpbmdCdXR0b24gKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheEZvcm1EYXRhID0gZm9ybS5zZXJpYWxpemUoKTsgLy9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheEZvcm1EYXRhID0gYWpheEZvcm1EYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogZnVsbFVybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Qubm9uY2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0ZGF0YTogYWpheEZvcm1EYXRhXG5cdFx0XHR9ICkuZG9uZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5ld0VtYWlscyA9ICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKS5tYXAoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdH0gKS5nZXQoKTtcblx0XHRcdFx0JC5lYWNoKCBuZXdFbWFpbHMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSBuZXh0RW1haWxDb3VudCArIGluZGV4O1xuXHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkuYXBwZW5kKCAnPGxpIGlkPVwidXNlci1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtZW1haWwtcHJlZmVyZW5jZXNcIj48YSBocmVmPVwiL25ld3NsZXR0ZXJzLz9lbWFpbD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCB2YWx1ZSApICsgJ1wiPjxzbWFsbD5FbWFpbCBQcmVmZXJlbmNlczwvc21hbGw+PC9hPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLXJlbW92ZS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwicmVtb3ZlX2VtYWlsWycgKyBuZXh0RW1haWxDb3VudCArICddXCIgaWQ9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5SZW1vdmU8L3NtYWxsPjwvbGFiZWw+PC9saT48L3VsPjwvbGk+JyApO1xuXHRcdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCAkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCgpICsgJywnICsgdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggMCA9PT0gJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIGl0IHdvdWxkIGJlIG5pY2UgdG8gb25seSBsb2FkIHRoZSBmb3JtLCBidXQgdGhlbiBjbGljayBldmVudHMgc3RpbGwgZG9uJ3Qgd29ya1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIGFkZEF1dG9SZXNpemUoKSB7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICdbZGF0YS1hdXRvcmVzaXplXScgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRlbGVtZW50LnN0eWxlLmJveFNpemluZyA9ICdib3JkZXItYm94Jztcblx0XHR2YXIgb2Zmc2V0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgLSBlbGVtZW50LmNsaWVudEhlaWdodDtcblx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnRhcmdldC5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG5cdFx0XHRldmVudC50YXJnZXQuc3R5bGUuaGVpZ2h0ID0gZXZlbnQudGFyZ2V0LnNjcm9sbEhlaWdodCArIG9mZnNldCArICdweCc7XG5cdFx0fSApO1xuXHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCAnZGF0YS1hdXRvcmVzaXplJyApO1xuXHR9ICk7XG59XG5cbiQoIGRvY3VtZW50ICkuYWpheFN0b3AoIGZ1bmN0aW9uKCkge1xuXHR2YXIgY29tbWVudEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnI2xsY19jb21tZW50cycgKTtcblx0aWYgKCBudWxsICE9PSBjb21tZW50QXJlYSApIHtcblx0XHRhZGRBdXRvUmVzaXplKCk7XG5cdH1cbn0gKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKCAwIDwgJCggJy5tLWZvcm0tYWNjb3VudC1zZXR0aW5ncycgKS5sZW5ndGggKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cblx0dmFyIGF1dG9SZXNpemVUZXh0YXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICdbZGF0YS1hdXRvcmVzaXplXScgKTtcblx0aWYgKCBudWxsICE9PSBhdXRvUmVzaXplVGV4dGFyZWEgKSB7XG5cdFx0YWRkQXV0b1Jlc2l6ZSgpO1xuXHR9XG59ICk7XG5cbnZhciBmb3JtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1mb3JtJyApO1xuZm9ybXMuZm9yRWFjaCggZnVuY3Rpb24oIGZvcm0gKSB7XG5cdFZhbGlkRm9ybSggZm9ybSwge1xuXHRcdHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzOiAnbS1oYXMtdmFsaWRhdGlvbi1lcnJvcicsXG5cdFx0dmFsaWRhdGlvbkVycm9yQ2xhc3M6ICdhLXZhbGlkYXRpb24tZXJyb3InLFxuXHRcdGludmFsaWRDbGFzczogJ2EtZXJyb3InLFxuXHRcdGVycm9yUGxhY2VtZW50OiAnYWZ0ZXInXG5cdH0gKTtcbn0gKTtcblxudmFyIGZvcm0gPSAkKCAnLm0tZm9ybScgKTtcblxuLy8gbGlzdGVuIGZvciBgaW52YWxpZGAgZXZlbnRzIG9uIGFsbCBmb3JtIGlucHV0c1xuZm9ybS5maW5kKCAnOmlucHV0JyApLm9uKCAnaW52YWxpZCcsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbnB1dCA9ICQoIHRoaXMgKTtcblxuICAgIC8vIHRoZSBmaXJzdCBpbnZhbGlkIGVsZW1lbnQgaW4gdGhlIGZvcm1cblx0dmFyIGZpcnN0ID0gZm9ybS5maW5kKCAnLmEtZXJyb3InICkuZmlyc3QoKTtcblxuXHQvLyB0aGUgZm9ybSBpdGVtIHRoYXQgY29udGFpbnMgaXRcblx0dmFyIGZpcnN0X2hvbGRlciA9IGZpcnN0LnBhcmVudCgpO1xuXG4gICAgLy8gb25seSBoYW5kbGUgaWYgdGhpcyBpcyB0aGUgZmlyc3QgaW52YWxpZCBpbnB1dFxuICAgIGlmICggaW5wdXRbMF0gPT09IGZpcnN0WzBdICkge1xuXG4gICAgICAgIC8vIGhlaWdodCBvZiB0aGUgbmF2IGJhciBwbHVzIHNvbWUgcGFkZGluZyBpZiB0aGVyZSdzIGEgZml4ZWQgbmF2XG4gICAgICAgIC8vdmFyIG5hdmJhckhlaWdodCA9IG5hdmJhci5oZWlnaHQoKSArIDUwXG5cbiAgICAgICAgLy8gdGhlIHBvc2l0aW9uIHRvIHNjcm9sbCB0byAoYWNjb3VudGluZyBmb3IgdGhlIG5hdmJhciBpZiBpdCBleGlzdHMpXG4gICAgICAgIHZhciBlbGVtZW50T2Zmc2V0ID0gZmlyc3RfaG9sZGVyLm9mZnNldCgpLnRvcDtcblxuICAgICAgICAvLyB0aGUgY3VycmVudCBzY3JvbGwgcG9zaXRpb24gKGFjY291bnRpbmcgZm9yIHRoZSBuYXZiYXIpXG4gICAgICAgIHZhciBwYWdlT2Zmc2V0ID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuXG4gICAgICAgIC8vIGRvbid0IHNjcm9sbCBpZiB0aGUgZWxlbWVudCBpcyBhbHJlYWR5IGluIHZpZXdcbiAgICAgICAgaWYgKCBlbGVtZW50T2Zmc2V0ID4gcGFnZU9mZnNldCAmJiBlbGVtZW50T2Zmc2V0IDwgcGFnZU9mZnNldCArIHdpbmRvdy5pbm5lckhlaWdodCApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm90ZTogYXZvaWQgdXNpbmcgYW5pbWF0ZSwgYXMgaXQgcHJldmVudHMgdGhlIHZhbGlkYXRpb24gbWVzc2FnZSBkaXNwbGF5aW5nIGNvcnJlY3RseVxuICAgICAgICAkKCAnaHRtbCwgYm9keScgKS5zY3JvbGxUb3AoIGVsZW1lbnRPZmZzZXQgKTtcbiAgICB9XG59ICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIGNvbW1lbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8vIGJhc2VkIG9uIHdoaWNoIGJ1dHRvbiB3YXMgY2xpY2tlZCwgc2V0IHRoZSB2YWx1ZXMgZm9yIHRoZSBhbmFseXRpY3MgZXZlbnQgYW5kIGNyZWF0ZSBpdFxuZnVuY3Rpb24gdHJhY2tTaG93Q29tbWVudHMoIGFsd2F5cywgaWQsIGNsaWNrVmFsdWUgKSB7XG5cdHZhciBhY3Rpb24gICAgICAgICAgPSAnJztcblx0dmFyIGNhdGVnb3J5UHJlZml4ID0gJyc7XG5cdHZhciBjYXRlZ29yeVN1ZmZpeCA9ICcnO1xuXHR2YXIgcG9zaXRpb24gICAgICAgID0gJyc7XG5cdHBvc2l0aW9uID0gaWQucmVwbGFjZSggJ2Fsd2F5cy1zaG93LWNvbW1lbnRzLScsICcnICk7XG5cdGlmICggJzEnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPbic7XG5cdH0gZWxzZSBpZiAoICcwJyA9PT0gY2xpY2tWYWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5UHJlZml4ID0gJ0Fsd2F5cyAnO1xuXHR9XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24uY2hhckF0KCAwICkudG9VcHBlckNhc2UoKSArIHBvc2l0aW9uLnNsaWNlKCAxICk7XG5cdFx0Y2F0ZWdvcnlTdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnlQcmVmaXggKyAnU2hvdyBDb21tZW50cycgKyBjYXRlZ29yeVN1ZmZpeCwgYWN0aW9uLCBsb2NhdGlvbi5wYXRobmFtZSApO1xufVxuXG4vLyB3aGVuIHNob3dpbmcgY29tbWVudHMgb25jZSwgdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtYnV0dG9uLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dHJhY2tTaG93Q29tbWVudHMoIGZhbHNlLCAnJywgJycgKTtcbn0gKTtcblxuLy8gU2V0IHVzZXIgbWV0YSB2YWx1ZSBmb3IgYWx3YXlzIHNob3dpbmcgY29tbWVudHMgaWYgdGhhdCBidXR0b24gaXMgY2xpY2tlZFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHZhciB0aGF0ID0gJCggdGhpcyApO1xuXHRpZiAoIHRoYXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gZWxzZSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuXHR0cmFja1Nob3dDb21tZW50cyggdHJ1ZSwgdGhhdC5hdHRyKCAnaWQnICksIHRoYXQudmFsKCkgKTtcblxuXHQvLyB3ZSBhbHJlYWR5IGhhdmUgYWpheHVybCBmcm9tIHRoZSB0aGVtZVxuXHQkLmFqYXgoIHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBwYXJhbXMuYWpheHVybCxcblx0XHRkYXRhOiB7XG5cdFx0XHQnYWN0aW9uJzogJ21pbm5wb3N0X2xhcmdvX2xvYWRfY29tbWVudHNfc2V0X3VzZXJfbWV0YScsXG5cdFx0XHQndmFsdWUnOiB0aGF0LnZhbCgpXG5cdFx0fSxcblx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHQkKCAnLmEtYWx3YXlzLXNob3ctY29tbWVudHMtcmVzdWx0JywgdGhhdC5wYXJlbnQoKSApLmh0bWwoIHJlc3BvbnNlLmRhdGEubWVzc2FnZSApO1xuXHRcdFx0aWYgKCB0cnVlID09PSByZXNwb25zZS5kYXRhLnNob3cgKSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDAgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDEgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcbn0gKTtcblxuISAoIGZ1bmN0aW9uKCBkICkge1xuXHRpZiAoICEgZC5jdXJyZW50U2NyaXB0ICkge1xuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0YWN0aW9uOiAnbGxjX2xvYWRfY29tbWVudHMnLFxuXHRcdFx0cG9zdDogJCggJyNsbGNfcG9zdF9pZCcgKS52YWwoKVxuXHRcdH07XG5cblx0XHQvLyBBamF4IHJlcXVlc3QgbGluay5cblx0XHR2YXIgbGxjYWpheHVybCA9ICQoICcjbGxjX2FqYXhfdXJsJyApLnZhbCgpO1xuXG5cdFx0Ly8gRnVsbCB1cmwgdG8gZ2V0IGNvbW1lbnRzIChBZGRpbmcgcGFyYW1ldGVycykuXG5cdFx0dmFyIGNvbW1lbnRVcmwgPSBsbGNhamF4dXJsICsgJz8nICsgJC5wYXJhbSggZGF0YSApO1xuXG5cdFx0Ly8gUGVyZm9ybSBhamF4IHJlcXVlc3QuXG5cdFx0JC5nZXQoIGNvbW1lbnRVcmwsIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdGlmICggJycgIT09IHJlc3BvbnNlICkge1xuXHRcdFx0XHQkKCAnI2xsY19jb21tZW50cycgKS5odG1sKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgY29tbWVudHMgYWZ0ZXIgbGF6eSBsb2FkaW5nLlxuXHRcdFx0XHRpZiAoIHdpbmRvdy5hZGRDb21tZW50ICYmIHdpbmRvdy5hZGRDb21tZW50LmluaXQgKSB7XG5cdFx0XHRcdFx0d2luZG93LmFkZENvbW1lbnQuaW5pdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gR2V0IHRoZSBjb21tZW50IGxpIGlkIGZyb20gdXJsIGlmIGV4aXN0LlxuXHRcdFx0XHR2YXIgY29tbWVudElkID0gZG9jdW1lbnQuVVJMLnN1YnN0ciggZG9jdW1lbnQuVVJMLmluZGV4T2YoICcjY29tbWVudCcgKSApO1xuXG5cdFx0XHRcdC8vIElmIGNvbW1lbnQgaWQgZm91bmQsIHNjcm9sbCB0byB0aGF0IGNvbW1lbnQuXG5cdFx0XHRcdGlmICggLTEgPCBjb21tZW50SWQuaW5kZXhPZiggJyNjb21tZW50JyApICkge1xuXHRcdFx0XHRcdCQoIHdpbmRvdyApLnNjcm9sbFRvcCggJCggY29tbWVudElkICkub2Zmc2V0KCkudG9wICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cbn0oIGRvY3VtZW50ICkgKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgZXZlbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG5jb25zdCB0YXJnZXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5hLWV2ZW50cy1jYWwtbGlua3MnICk7XG50YXJnZXRzLmZvckVhY2goIGZ1bmN0aW9uKCB0YXJnZXQgKSB7XG4gICAgc2V0Q2FsZW5kYXIoIHRhcmdldCApO1xufSApO1xuXG5mdW5jdGlvbiBzZXRDYWxlbmRhciggdGFyZ2V0ICkge1xuICAgIGlmICggbnVsbCAhPT0gdGFyZ2V0ICkge1xuICAgICAgICB2YXIgbGkgICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2xpJyApO1xuICAgICAgICBsaS5pbm5lckhUTUwgID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLWNhbGVuZGFyXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG4gICAgICAgIHZhciBmcmFnbWVudCAgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGxpLnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggbGkgKTtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xuICAgIH1cbn1cblxuY29uc3QgY2FsZW5kYXJzVmlzaWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1ldmVudC1kYXRldGltZSBhJyApO1xuY2FsZW5kYXJzVmlzaWJsZS5mb3JFYWNoKCBmdW5jdGlvbiggY2FsZW5kYXJWaXNpYmxlICkge1xuICAgIHNob3dDYWxlbmRhciggY2FsZW5kYXJWaXNpYmxlICk7XG59ICk7XG5cbmZ1bmN0aW9uIHNob3dDYWxlbmRhciggY2FsZW5kYXJWaXNpYmxlICkge1xuICAgIGNvbnN0IGRhdGVIb2xkZXIgPSBjYWxlbmRhclZpc2libGUuY2xvc2VzdCggJy5tLWV2ZW50LWRhdGUtYW5kLWNhbGVuZGFyJyApO1xuICAgIGNvbnN0IGNhbGVuZGFyVHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcbiAgICAgICAgZWxlbWVudDogZGF0ZUhvbGRlci5xdWVyeVNlbGVjdG9yKCAnLmEtZXZlbnRzLWNhbC1saW5rcycgKSxcbiAgICAgICAgdmlzaWJsZUNsYXNzOiAnYS1ldmVudHMtY2FsLWxpbmstdmlzaWJsZScsXG4gICAgICAgIGRpc3BsYXlWYWx1ZTogJ2Jsb2NrJ1xuICAgIH0gKTtcblxuICAgIGlmICggbnVsbCAhPT0gY2FsZW5kYXJWaXNpYmxlICkge1xuICAgICAgICBjYWxlbmRhclZpc2libGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IGNhbGVuZGFyVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuICAgICAgICAgICAgY2FsZW5kYXJWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgICAgICAgICBpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKTtcblxuICAgICAgICB2YXIgY2FsZW5kYXJDbG9zZSA9IGRhdGVIb2xkZXIucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLWNhbGVuZGFyJyApO1xuICAgICAgICBpZiAoIG51bGwgIT09IGNhbGVuZGFyQ2xvc2UgKSB7XG4gICAgICAgICAgICBjYWxlbmRhckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IGNhbGVuZGFyVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICAgICAgICAgIGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
}(jQuery));
