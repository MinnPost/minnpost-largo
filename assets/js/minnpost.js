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

// when showing comments once, allow it to be an analytics event
var showCommentsButton = document.querySelector('.a-button-show-comments');
if (showCommentsButton) {
  showCommentsButton.addEventListener('click', function (e) {
    trackShowComments(false, '', '');
  });
}

// Set user meta value for always showing comments if that button is clicked. this uses jquery.
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

// this uses jquery.
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDQtdmFsaWQtZm9ybS5taW4uanMiLCIwMC1zdGFydC5qcyIsIjAxLWFuYWx5dGljcy5qcyIsIjAyLXNoYXJlLmpzIiwiMDMtbmF2aWdhdGlvbi5qcyIsIjA0LWZvcm1zLmpzIiwiMDUtY29tbWVudHMuanMiLCIwNi1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImMiLCJyZXF1aXJlIiwidSIsImNvZGUiLCJwIiwiY2FsbCIsIl92YWxpZEZvcm0iLCJfdmFsaWRGb3JtMiIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIlZhbGlkRm9ybSIsInRvZ2dsZUludmFsaWRDbGFzcyIsImhhbmRsZUN1c3RvbU1lc3NhZ2VzIiwiaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiY2xvbmUiLCJkZWZhdWx0cyIsImluc2VydEFmdGVyIiwiaW5zZXJ0QmVmb3JlIiwiZm9yRWFjaCIsImRlYm91bmNlIiwiY29weSIsImF0dHIiLCJoYXNPd25Qcm9wZXJ0eSIsImRlZmF1bHRPYmplY3QiLCJrIiwicmVmTm9kZSIsIm5vZGVUb0luc2VydCIsInNpYmxpbmciLCJuZXh0U2libGluZyIsIl9wYXJlbnQiLCJwYXJlbnQiLCJpdGVtcyIsImZuIiwibXMiLCJkZWJvdW5jZWRGbiIsInZhbGlkRm9ybSIsIl91dGlsIiwiaW5wdXQiLCJpbnZhbGlkQ2xhc3MiLCJ2YWxpZGl0eSIsInZhbGlkIiwiZXJyb3JQcm9wcyIsImdldEN1c3RvbU1lc3NhZ2UiLCJjdXN0b21NZXNzYWdlcyIsImxvY2FsRXJyb3JQcm9wcyIsInR5cGUiLCJjb25jYXQiLCJwcm9wIiwiY2hlY2tWYWxpZGl0eSIsIm1lc3NhZ2UiLCJzZXRDdXN0b21WYWxpZGl0eSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uRXJyb3JDbGFzcyIsInZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzIiwiZXJyb3JQbGFjZW1lbnQiLCJpbnNlcnRFcnJvciIsImVycm9yTm9kZSIsInZhbGlkYXRpb25NZXNzYWdlIiwidGV4dENvbnRlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImRlZmF1bHRPcHRpb25zIiwibm9kZU5hbWUiLCJpbnB1dHMiLCJ0b0xvd2VyQ2FzZSIsImZvY3VzSW52YWxpZElucHV0IiwidmFsaWRGb3JtSW5wdXRzIiwiZm9ybSIsImZvY3VzRmlyc3QiLCJpbnZhbGlkTm9kZSIsImZvY3VzIiwiZG9jdW1lbnRFbGVtZW50Iiwid3AiLCJob29rcyIsImFkZEFjdGlvbiIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFY29tbWVyY2VBY3Rpb24iLCJtcERhdGFMYXllckV2ZW50IiwibXBEYXRhTGF5ZXJFY29tbWVyY2UiLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwibm9uX2ludGVyYWN0aW9uIiwiZG9BY3Rpb24iLCJkYXRhTGF5ZXJDb250ZW50IiwiZGF0YUxheWVyIiwia2V5cyIsInB1c2giLCJwcm9kdWN0Iiwic3RlcCIsImVjb21tZXJjZSIsImV2ZW50IiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsInRvcEJ1dHRvbiIsImN1cnJlbnRUYXJnZXQiLCJwcmludEJ1dHRvbiIsInByaW50IiwicmVwdWJsaXNoQnV0dG9uIiwiY29weUJ1dHRvbiIsImNvcHlUZXh0IiwiaHJlZiIsIm5hdmlnYXRvciIsImNsaXBib2FyZCIsIndyaXRlVGV4dCIsInRoZW4iLCJhbnlTaGFyZUJ1dHRvbiIsInVybCIsIm9wZW4iLCJzZXR1cFByaW1hcnlOYXYiLCJwcmltYXJ5TmF2VHJhbnNpdGlvbmVyIiwicHJpbWFyeU5hdlRvZ2dsZSIsImV4cGFuZGVkIiwidXNlck5hdlRyYW5zaXRpb25lciIsInVzZXJOYXZUb2dnbGUiLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCJvbmtleWRvd24iLCJldnQiLCJpc0VzY2FwZSIsImtleSIsImtleUNvZGUiLCJwcmltYXJ5TmF2RXhwYW5kZWQiLCJ1c2VyTmF2RXhwYW5kZWQiLCJzZWFyY2hJc1Zpc2libGUiLCJzZXR1cFNjcm9sbE5hdiIsInN1Yk5hdlNjcm9sbGVycyIsImN1cnJlbnRWYWx1ZSIsInBhZ2luYXRpb25TY3JvbGxlcnMiLCJzaWRlYmFyTGluayIsImNsb3Nlc3RXaWRnZXQiLCJjbG9zZXN0IiwiY2xvc2VzdFpvbmUiLCJ3aWRnZXRUaXRsZSIsInpvbmVUaXRsZSIsInNpZGViYXJTZWN0aW9uVGl0bGUiLCJyZWxhdGVkTGluayIsImpRdWVyeSIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwidHJpbSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCIkIiwicmVzdFJvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxVcmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheEZvcm1EYXRhIiwidGhhdCIsIm9uIiwidmFsIiwicmVwbGFjZSIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJhcHBlbmQiLCJmaXJzdCIsInJlcGxhY2VXaXRoIiwic3VibWl0IiwiZWFjaCIsImdldCIsInBhcmVudHMiLCJmYWRlT3V0Iiwiam9pbiIsImJlZm9yZSIsImNsaWNrIiwiYnV0dG9uIiwiYnV0dG9uRm9ybSIsImRhdGEiLCJzdWJtaXR0aW5nQnV0dG9uIiwic2VyaWFsaXplIiwiYWpheCIsImJlZm9yZVNlbmQiLCJ4aHIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwibm9uY2UiLCJkYXRhVHlwZSIsImRvbmUiLCJtYXAiLCJpbmRleCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlbG9hZCIsImFkZEF1dG9SZXNpemUiLCJib3hTaXppbmciLCJvZmZzZXQiLCJjbGllbnRIZWlnaHQiLCJoZWlnaHQiLCJzY3JvbGxIZWlnaHQiLCJhamF4U3RvcCIsImNvbW1lbnRBcmVhIiwiYXV0b1Jlc2l6ZVRleHRhcmVhIiwiZm9ybXMiLCJmaW5kIiwiZmlyc3RfaG9sZGVyIiwiZWxlbWVudE9mZnNldCIsInBhZ2VPZmZzZXQiLCJwYWdlWU9mZnNldCIsInNjcm9sbFRvcCIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiaWQiLCJjbGlja1ZhbHVlIiwiY2F0ZWdvcnlQcmVmaXgiLCJjYXRlZ29yeVN1ZmZpeCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJzaG93Q29tbWVudHNCdXR0b24iLCJpcyIsInBhcmFtcyIsImFqYXh1cmwiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJodG1sIiwiY3VycmVudFNjcmlwdCIsInBvc3QiLCJsbGNhamF4dXJsIiwiY29tbWVudFVybCIsInBhcmFtIiwiYWRkQ29tbWVudCIsImNvbW1lbnRJZCIsIlVSTCIsInN1YnN0ciIsImluZGV4T2YiLCJ0YXJnZXRzIiwic2V0Q2FsZW5kYXIiLCJsaSIsImNhbGVuZGFyc1Zpc2libGUiLCJjYWxlbmRhclZpc2libGUiLCJzaG93Q2FsZW5kYXIiLCJkYXRlSG9sZGVyIiwiY2FsZW5kYXJU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QUtBLFFBQVEsRUFBRztVQUNyQjBJLG9CQUFvQixDQUFDdlUsY0FBYyxFQUFFO1FBQ3pDLENBQUMsTUFBTTtVQUNIdVUsb0JBQW9CLENBQUM1VSxjQUFjLEVBQUU7UUFDekM7TUFDSixDQUFDLENBQUU7SUFDUDtFQUNKO0FBQ0oiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB0bGl0ZSh0KXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZSl7dmFyIGk9ZS50YXJnZXQsbj10KGkpO258fChuPShpPWkucGFyZW50RWxlbWVudCkmJnQoaSkpLG4mJnRsaXRlLnNob3coaSxuLCEwKX0pfXRsaXRlLnNob3c9ZnVuY3Rpb24odCxlLGkpe3ZhciBuPVwiZGF0YS10bGl0ZVwiO2U9ZXx8e30sKHQudG9vbHRpcHx8ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiBvKCl7dGxpdGUuaGlkZSh0LCEwKX1mdW5jdGlvbiBsKCl7cnx8KHI9ZnVuY3Rpb24odCxlLGkpe2Z1bmN0aW9uIG4oKXtvLmNsYXNzTmFtZT1cInRsaXRlIHRsaXRlLVwiK3Irczt2YXIgZT10Lm9mZnNldFRvcCxpPXQub2Zmc2V0TGVmdDtvLm9mZnNldFBhcmVudD09PXQmJihlPWk9MCk7dmFyIG49dC5vZmZzZXRXaWR0aCxsPXQub2Zmc2V0SGVpZ2h0LGQ9by5vZmZzZXRIZWlnaHQsZj1vLm9mZnNldFdpZHRoLGE9aStuLzI7by5zdHlsZS50b3A9KFwic1wiPT09cj9lLWQtMTA6XCJuXCI9PT1yP2UrbCsxMDplK2wvMi1kLzIpK1wicHhcIixvLnN0eWxlLmxlZnQ9KFwid1wiPT09cz9pOlwiZVwiPT09cz9pK24tZjpcIndcIj09PXI/aStuKzEwOlwiZVwiPT09cj9pLWYtMTA6YS1mLzIpK1wicHhcIn12YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxsPWkuZ3Jhdnx8dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRsaXRlXCIpfHxcIm5cIjtvLmlubmVySFRNTD1lLHQuYXBwZW5kQ2hpbGQobyk7dmFyIHI9bFswXXx8XCJcIixzPWxbMV18fFwiXCI7bigpO3ZhciBkPW8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuXCJzXCI9PT1yJiZkLnRvcDwwPyhyPVwiblwiLG4oKSk6XCJuXCI9PT1yJiZkLmJvdHRvbT53aW5kb3cuaW5uZXJIZWlnaHQ/KHI9XCJzXCIsbigpKTpcImVcIj09PXImJmQubGVmdDwwPyhyPVwid1wiLG4oKSk6XCJ3XCI9PT1yJiZkLnJpZ2h0PndpbmRvdy5pbm5lcldpZHRoJiYocj1cImVcIixuKCkpLG8uY2xhc3NOYW1lKz1cIiB0bGl0ZS12aXNpYmxlXCIsb30odCxkLGUpKX12YXIgcixzLGQ7cmV0dXJuIHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLG8pLHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIixvKSx0LnRvb2x0aXA9e3Nob3c6ZnVuY3Rpb24oKXtkPXQudGl0bGV8fHQuZ2V0QXR0cmlidXRlKG4pfHxkLHQudGl0bGU9XCJcIix0LnNldEF0dHJpYnV0ZShuLFwiXCIpLGQmJiFzJiYocz1zZXRUaW1lb3V0KGwsaT8xNTA6MSkpfSxoaWRlOmZ1bmN0aW9uKHQpe2lmKGk9PT10KXtzPWNsZWFyVGltZW91dChzKTt2YXIgZT1yJiZyLnBhcmVudE5vZGU7ZSYmZS5yZW1vdmVDaGlsZChyKSxyPXZvaWQgMH19fX0odCxlKSkuc2hvdygpfSx0bGl0ZS5oaWRlPWZ1bmN0aW9uKHQsZSl7dC50b29sdGlwJiZ0LnRvb2x0aXAuaGlkZShlKX0sXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz10bGl0ZSk7IiwiLyoqIFxuICogTGlicmFyeSBjb2RlXG4gKiBVc2luZyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9AY2xvdWRmb3VyL3RyYW5zaXRpb24taGlkZGVuLWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCh7XG4gIGVsZW1lbnQsXG4gIHZpc2libGVDbGFzcyxcbiAgd2FpdE1vZGUgPSAndHJhbnNpdGlvbmVuZCcsXG4gIHRpbWVvdXREdXJhdGlvbixcbiAgaGlkZU1vZGUgPSAnaGlkZGVuJyxcbiAgZGlzcGxheVZhbHVlID0gJ2Jsb2NrJ1xufSkge1xuICBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0JyAmJiB0eXBlb2YgdGltZW91dER1cmF0aW9uICE9PSAnbnVtYmVyJykge1xuICAgIGNvbnNvbGUuZXJyb3IoYFxuICAgICAgV2hlbiBjYWxsaW5nIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50IHdpdGggd2FpdE1vZGUgc2V0IHRvIHRpbWVvdXQsXG4gICAgICB5b3UgbXVzdCBwYXNzIGluIGEgbnVtYmVyIGZvciB0aW1lb3V0RHVyYXRpb24uXG4gICAgYCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEb24ndCB3YWl0IGZvciBleGl0IHRyYW5zaXRpb25zIGlmIGEgdXNlciBwcmVmZXJzIHJlZHVjZWQgbW90aW9uLlxuICAvLyBJZGVhbGx5IHRyYW5zaXRpb25zIHdpbGwgYmUgZGlzYWJsZWQgaW4gQ1NTLCB3aGljaCBtZWFucyB3ZSBzaG91bGQgbm90IHdhaXRcbiAgLy8gYmVmb3JlIGFkZGluZyBgaGlkZGVuYC5cbiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKScpLm1hdGNoZXMpIHtcbiAgICB3YWl0TW9kZSA9ICdpbW1lZGlhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGxpc3RlbmVyIHRvIGFkZCBgaGlkZGVuYCBhZnRlciBvdXIgYW5pbWF0aW9ucyBjb21wbGV0ZS5cbiAgICogVGhpcyBsaXN0ZW5lciB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgY29tcGxldGluZy5cbiAgICovXG4gIGNvbnN0IGxpc3RlbmVyID0gZSA9PiB7XG4gICAgLy8gQ29uZmlybSBgdHJhbnNpdGlvbmVuZGAgd2FzIGNhbGxlZCBvbiAgb3VyIGBlbGVtZW50YCBhbmQgZGlkbid0IGJ1YmJsZVxuICAgIC8vIHVwIGZyb20gYSBjaGlsZCBlbGVtZW50LlxuICAgIGlmIChlLnRhcmdldCA9PT0gZWxlbWVudCkge1xuICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheVZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvblNob3coKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgbGlzdGVuZXIgc2hvdWxkbid0IGJlIGhlcmUgYnV0IGlmIHNvbWVvbmUgc3BhbXMgdGhlIHRvZ2dsZVxuICAgICAgICogb3ZlciBhbmQgb3ZlciByZWFsbHkgZmFzdCBpdCBjYW4gaW5jb3JyZWN0bHkgc3RpY2sgYXJvdW5kLlxuICAgICAgICogV2UgcmVtb3ZlIGl0IGp1c3QgdG8gYmUgc2FmZS5cbiAgICAgICAqL1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFNpbWlsYXJseSwgd2UnbGwgY2xlYXIgdGhlIHRpbWVvdXQgaW4gY2FzZSBpdCdzIHN0aWxsIGhhbmdpbmcgYXJvdW5kLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIC8qKlxuICAgICAgICogRm9yY2UgYSBicm93c2VyIHJlLXBhaW50IHNvIHRoZSBicm93c2VyIHdpbGwgcmVhbGl6ZSB0aGVcbiAgICAgICAqIGVsZW1lbnQgaXMgbm8gbG9uZ2VyIGBoaWRkZW5gIGFuZCBhbGxvdyB0cmFuc2l0aW9ucy5cbiAgICAgICAqL1xuICAgICAgY29uc3QgcmVmbG93ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIaWRlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvbkhpZGUoKSB7XG4gICAgICBpZiAod2FpdE1vZGUgPT09ICd0cmFuc2l0aW9uZW5kJykge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgICB9IGVsc2UgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICAgIH0sIHRpbWVvdXREdXJhdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoaXMgY2xhc3MgdG8gdHJpZ2dlciBvdXIgYW5pbWF0aW9uXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSBlbGVtZW50J3MgdmlzaWJpbGl0eVxuICAgICAqL1xuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUZWxsIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaGlkZGVuIG9yIG5vdC5cbiAgICAgKi9cbiAgICBpc0hpZGRlbigpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGhpZGRlbiBhdHRyaWJ1dGUgZG9lcyBub3QgcmVxdWlyZSBhIHZhbHVlLiBTaW5jZSBhbiBlbXB0eSBzdHJpbmcgaXNcbiAgICAgICAqIGZhbHN5LCBidXQgc2hvd3MgdGhlIHByZXNlbmNlIG9mIGFuIGF0dHJpYnV0ZSB3ZSBjb21wYXJlIHRvIGBudWxsYFxuICAgICAgICovXG4gICAgICBjb25zdCBoYXNIaWRkZW5BdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaGlkZGVuJykgIT09IG51bGw7XG5cbiAgICAgIGNvbnN0IGlzRGlzcGxheU5vbmUgPSBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJztcblxuICAgICAgY29uc3QgaGFzVmlzaWJsZUNsYXNzID0gWy4uLmVsZW1lbnQuY2xhc3NMaXN0XS5pbmNsdWRlcyh2aXNpYmxlQ2xhc3MpO1xuXG4gICAgICByZXR1cm4gaGFzSGlkZGVuQXR0cmlidXRlIHx8IGlzRGlzcGxheU5vbmUgfHwgIWhhc1Zpc2libGVDbGFzcztcbiAgICB9LFxuXG4gICAgLy8gQSBwbGFjZWhvbGRlciBmb3Igb3VyIGB0aW1lb3V0YFxuICAgIHRpbWVvdXQ6IG51bGxcbiAgfTtcbn0iLCIvKipcbiAgUHJpb3JpdHkrIGhvcml6b250YWwgc2Nyb2xsaW5nIG1lbnUuXG5cbiAgQHBhcmFtIHtPYmplY3R9IG9iamVjdCAtIENvbnRhaW5lciBmb3IgYWxsIG9wdGlvbnMuXG4gICAgQHBhcmFtIHtzdHJpbmcgfHwgRE9NIG5vZGV9IHNlbGVjdG9yIC0gRWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gbmF2U2VsZWN0b3IgLSBOYXYgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gY29udGVudFNlbGVjdG9yIC0gQ29udGVudCBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBpdGVtU2VsZWN0b3IgLSBJdGVtcyBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uTGVmdFNlbGVjdG9yIC0gTGVmdCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvblJpZ2h0U2VsZWN0b3IgLSBSaWdodCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtpbnRlZ2VyIHx8IHN0cmluZ30gc2Nyb2xsU3RlcCAtIEFtb3VudCB0byBzY3JvbGwgb24gYnV0dG9uIGNsaWNrLiAnYXZlcmFnZScgZ2V0cyB0aGUgYXZlcmFnZSBsaW5rIHdpZHRoLlxuKi9cblxuY29uc3QgUHJpb3JpdHlOYXZTY3JvbGxlciA9IGZ1bmN0aW9uKHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlcicsXG4gICAgbmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItbmF2JyxcbiAgICBjb250ZW50U2VsZWN0b3I6IGNvbnRlbnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWNvbnRlbnQnLFxuICAgIGl0ZW1TZWxlY3RvcjogaXRlbVNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItaXRlbScsXG4gICAgYnV0dG9uTGVmdFNlbGVjdG9yOiBidXR0b25MZWZ0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuICAgIGJ1dHRvblJpZ2h0U2VsZWN0b3I6IGJ1dHRvblJpZ2h0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0JyxcbiAgICBzY3JvbGxTdGVwOiBzY3JvbGxTdGVwID0gODBcbiAgfSA9IHt9KSB7XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXIgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiBzZWxlY3RvcjtcblxuICBjb25zdCB2YWxpZGF0ZVNjcm9sbFN0ZXAgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIoc2Nyb2xsU3RlcCkgfHwgc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnO1xuICB9XG5cbiAgaWYgKG5hdlNjcm9sbGVyID09PSB1bmRlZmluZWQgfHwgbmF2U2Nyb2xsZXIgPT09IG51bGwgfHwgIXZhbGlkYXRlU2Nyb2xsU3RlcCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGVyZSBpcyBzb21ldGhpbmcgd3JvbmcsIGNoZWNrIHlvdXIgb3B0aW9ucy4nKTtcbiAgfVxuXG4gIGNvbnN0IG5hdlNjcm9sbGVyTmF2ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihuYXZTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoY29udGVudFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMgPSBuYXZTY3JvbGxlckNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChpdGVtU2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckxlZnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvbkxlZnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyUmlnaHQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvblJpZ2h0U2VsZWN0b3IpO1xuXG4gIGxldCBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZUxlZnQgPSAwO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSAwO1xuICBsZXQgc2Nyb2xsaW5nRGlyZWN0aW9uID0gJyc7XG4gIGxldCBzY3JvbGxPdmVyZmxvdyA9ICcnO1xuICBsZXQgdGltZW91dDtcblxuXG4gIC8vIFNldHMgb3ZlcmZsb3cgYW5kIHRvZ2dsZSBidXR0b25zIGFjY29yZGluZ2x5XG4gIGNvbnN0IHNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgc2Nyb2xsT3ZlcmZsb3cgPSBnZXRPdmVyZmxvdygpO1xuICAgIHRvZ2dsZUJ1dHRvbnMoc2Nyb2xsT3ZlcmZsb3cpO1xuICAgIGNhbGN1bGF0ZVNjcm9sbFN0ZXAoKTtcbiAgfVxuXG5cbiAgLy8gRGVib3VuY2Ugc2V0dGluZyB0aGUgb3ZlcmZsb3cgd2l0aCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgY29uc3QgcmVxdWVzdFNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVvdXQpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aW1lb3V0KTtcblxuICAgIHRpbWVvdXQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHNldE92ZXJmbG93KCk7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8vIEdldHMgdGhlIG92ZXJmbG93IGF2YWlsYWJsZSBvbiB0aGUgbmF2IHNjcm9sbGVyXG4gIGNvbnN0IGdldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNjcm9sbFdpZHRoID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGg7XG4gICAgbGV0IHNjcm9sbFZpZXdwb3J0ID0gbmF2U2Nyb2xsZXJOYXYuY2xpZW50V2lkdGg7XG4gICAgbGV0IHNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0O1xuXG4gICAgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSBzY3JvbGxXaWR0aCAtIChzY3JvbGxWaWV3cG9ydCArIHNjcm9sbExlZnQpO1xuXG4gICAgLy8gMSBpbnN0ZWFkIG9mIDAgdG8gY29tcGVuc2F0ZSBmb3IgbnVtYmVyIHJvdW5kaW5nXG4gICAgbGV0IHNjcm9sbExlZnRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVMZWZ0ID4gMTtcbiAgICBsZXQgc2Nyb2xsUmlnaHRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVSaWdodCA+IDE7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhzY3JvbGxXaWR0aCwgc2Nyb2xsVmlld3BvcnQsIHNjcm9sbEF2YWlsYWJsZUxlZnQsIHNjcm9sbEF2YWlsYWJsZVJpZ2h0KTtcblxuICAgIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uICYmIHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2JvdGgnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2xlZnQnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuICdub25lJztcbiAgICB9XG5cbiAgfVxuXG5cbiAgLy8gQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHN0ZXAgYmFzZWQgb24gdGhlIHdpZHRoIG9mIHRoZSBzY3JvbGxlciBhbmQgdGhlIG51bWJlciBvZiBsaW5rc1xuICBjb25zdCBjYWxjdWxhdGVTY3JvbGxTdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJykge1xuICAgICAgbGV0IHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGggLSAocGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctbGVmdCcpKSArIHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpKTtcblxuICAgICAgbGV0IHNjcm9sbFN0ZXBBdmVyYWdlID0gTWF0aC5mbG9vcihzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyAvIG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zLmxlbmd0aCk7XG5cbiAgICAgIHNjcm9sbFN0ZXAgPSBzY3JvbGxTdGVwQXZlcmFnZTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIE1vdmUgdGhlIHNjcm9sbGVyIHdpdGggYSB0cmFuc2Zvcm1cbiAgY29uc3QgbW92ZVNjcm9sbGVyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG5cbiAgICBpZiAoc2Nyb2xsaW5nID09PSB0cnVlIHx8IChzY3JvbGxPdmVyZmxvdyAhPT0gZGlyZWN0aW9uICYmIHNjcm9sbE92ZXJmbG93ICE9PSAnYm90aCcpKSByZXR1cm47XG5cbiAgICBsZXQgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxTdGVwO1xuICAgIGxldCBzY3JvbGxBdmFpbGFibGUgPSBkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IHNjcm9sbEF2YWlsYWJsZUxlZnQgOiBzY3JvbGxBdmFpbGFibGVSaWdodDtcblxuICAgIC8vIElmIHRoZXJlIHdpbGwgYmUgbGVzcyB0aGFuIDI1JSBvZiB0aGUgbGFzdCBzdGVwIHZpc2libGUgdGhlbiBzY3JvbGwgdG8gdGhlIGVuZFxuICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCAoc2Nyb2xsU3RlcCAqIDEuNzUpKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbEF2YWlsYWJsZTtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSAqPSAtMTtcblxuICAgICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IHNjcm9sbFN0ZXApIHtcbiAgICAgICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NuYXAtYWxpZ24tZW5kJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIHNjcm9sbERpc3RhbmNlICsgJ3B4KSc7XG5cbiAgICBzY3JvbGxpbmdEaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgc2Nyb2xsaW5nID0gdHJ1ZTtcbiAgfVxuXG5cbiAgLy8gU2V0IHRoZSBzY3JvbGxlciBwb3NpdGlvbiBhbmQgcmVtb3ZlcyB0cmFuc2Zvcm0sIGNhbGxlZCBhZnRlciBtb3ZlU2Nyb2xsZXIoKSBpbiB0aGUgdHJhbnNpdGlvbmVuZCBldmVudFxuICBjb25zdCBzZXRTY3JvbGxlclBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50LCBudWxsKTtcbiAgICB2YXIgdHJhbnNmb3JtID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJyk7XG4gICAgdmFyIHRyYW5zZm9ybVZhbHVlID0gTWF0aC5hYnMocGFyc2VJbnQodHJhbnNmb3JtLnNwbGl0KCcsJylbNF0pIHx8IDApO1xuXG4gICAgaWYgKHNjcm9sbGluZ0RpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICB0cmFuc2Zvcm1WYWx1ZSAqPSAtMTtcbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbiAgICBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCArIHRyYW5zZm9ybVZhbHVlO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJywgJ3NuYXAtYWxpZ24tZW5kJyk7XG5cbiAgICBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgfVxuXG5cbiAgLy8gVG9nZ2xlIGJ1dHRvbnMgZGVwZW5kaW5nIG9uIG92ZXJmbG93XG4gIGNvbnN0IHRvZ2dsZUJ1dHRvbnMgPSBmdW5jdGlvbihvdmVyZmxvdykge1xuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAnbGVmdCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdyaWdodCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH1cblxuXG4gIGNvbnN0IGluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgIHNldE92ZXJmbG93KCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlck5hdi5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgc2V0U2Nyb2xsZXJQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJMZWZ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdsZWZ0Jyk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlclJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdyaWdodCcpO1xuICAgIH0pO1xuXG4gIH07XG5cblxuICAvLyBTZWxmIGluaXRcbiAgaW5pdCgpO1xuXG5cbiAgLy8gUmV2ZWFsIEFQSVxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcblxufTtcblxuLy9leHBvcnQgZGVmYXVsdCBQcmlvcml0eU5hdlNjcm9sbGVyO1xuIiwiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIF92YWxpZEZvcm09cmVxdWlyZShcIi4vc3JjL3ZhbGlkLWZvcm1cIik7dmFyIF92YWxpZEZvcm0yPV9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3ZhbGlkRm9ybSk7ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmope3JldHVybiBvYmomJm9iai5fX2VzTW9kdWxlP29iajp7ZGVmYXVsdDpvYmp9fXdpbmRvdy5WYWxpZEZvcm09X3ZhbGlkRm9ybTIuZGVmYXVsdDt3aW5kb3cuVmFsaWRGb3JtLnRvZ2dsZUludmFsaWRDbGFzcz1fdmFsaWRGb3JtLnRvZ2dsZUludmFsaWRDbGFzczt3aW5kb3cuVmFsaWRGb3JtLmhhbmRsZUN1c3RvbU1lc3NhZ2VzPV92YWxpZEZvcm0uaGFuZGxlQ3VzdG9tTWVzc2FnZXM7d2luZG93LlZhbGlkRm9ybS5oYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheT1fdmFsaWRGb3JtLmhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5fSx7XCIuL3NyYy92YWxpZC1mb3JtXCI6M31dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTp0cnVlfSk7ZXhwb3J0cy5jbG9uZT1jbG9uZTtleHBvcnRzLmRlZmF1bHRzPWRlZmF1bHRzO2V4cG9ydHMuaW5zZXJ0QWZ0ZXI9aW5zZXJ0QWZ0ZXI7ZXhwb3J0cy5pbnNlcnRCZWZvcmU9aW5zZXJ0QmVmb3JlO2V4cG9ydHMuZm9yRWFjaD1mb3JFYWNoO2V4cG9ydHMuZGVib3VuY2U9ZGVib3VuY2U7ZnVuY3Rpb24gY2xvbmUob2JqKXt2YXIgY29weT17fTtmb3IodmFyIGF0dHIgaW4gb2JqKXtpZihvYmouaGFzT3duUHJvcGVydHkoYXR0cikpY29weVthdHRyXT1vYmpbYXR0cl19cmV0dXJuIGNvcHl9ZnVuY3Rpb24gZGVmYXVsdHMob2JqLGRlZmF1bHRPYmplY3Qpe29iaj1jbG9uZShvYmp8fHt9KTtmb3IodmFyIGsgaW4gZGVmYXVsdE9iamVjdCl7aWYob2JqW2tdPT09dW5kZWZpbmVkKW9ialtrXT1kZWZhdWx0T2JqZWN0W2tdfXJldHVybiBvYmp9ZnVuY3Rpb24gaW5zZXJ0QWZ0ZXIocmVmTm9kZSxub2RlVG9JbnNlcnQpe3ZhciBzaWJsaW5nPXJlZk5vZGUubmV4dFNpYmxpbmc7aWYoc2libGluZyl7dmFyIF9wYXJlbnQ9cmVmTm9kZS5wYXJlbnROb2RlO19wYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGVUb0luc2VydCxzaWJsaW5nKX1lbHNle3BhcmVudC5hcHBlbmRDaGlsZChub2RlVG9JbnNlcnQpfX1mdW5jdGlvbiBpbnNlcnRCZWZvcmUocmVmTm9kZSxub2RlVG9JbnNlcnQpe3ZhciBwYXJlbnQ9cmVmTm9kZS5wYXJlbnROb2RlO3BhcmVudC5pbnNlcnRCZWZvcmUobm9kZVRvSW5zZXJ0LHJlZk5vZGUpfWZ1bmN0aW9uIGZvckVhY2goaXRlbXMsZm4pe2lmKCFpdGVtcylyZXR1cm47aWYoaXRlbXMuZm9yRWFjaCl7aXRlbXMuZm9yRWFjaChmbil9ZWxzZXtmb3IodmFyIGk9MDtpPGl0ZW1zLmxlbmd0aDtpKyspe2ZuKGl0ZW1zW2ldLGksaXRlbXMpfX19ZnVuY3Rpb24gZGVib3VuY2UobXMsZm4pe3ZhciB0aW1lb3V0PXZvaWQgMDt2YXIgZGVib3VuY2VkRm49ZnVuY3Rpb24gZGVib3VuY2VkRm4oKXtjbGVhclRpbWVvdXQodGltZW91dCk7dGltZW91dD1zZXRUaW1lb3V0KGZuLG1zKX07cmV0dXJuIGRlYm91bmNlZEZufX0se31dLDM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTp0cnVlfSk7ZXhwb3J0cy50b2dnbGVJbnZhbGlkQ2xhc3M9dG9nZ2xlSW52YWxpZENsYXNzO2V4cG9ydHMuaGFuZGxlQ3VzdG9tTWVzc2FnZXM9aGFuZGxlQ3VzdG9tTWVzc2FnZXM7ZXhwb3J0cy5oYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheT1oYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheTtleHBvcnRzLmRlZmF1bHQ9dmFsaWRGb3JtO3ZhciBfdXRpbD1yZXF1aXJlKFwiLi91dGlsXCIpO2Z1bmN0aW9uIHRvZ2dsZUludmFsaWRDbGFzcyhpbnB1dCxpbnZhbGlkQ2xhc3Mpe2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnZhbGlkXCIsZnVuY3Rpb24oKXtpbnB1dC5jbGFzc0xpc3QuYWRkKGludmFsaWRDbGFzcyl9KTtpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixmdW5jdGlvbigpe2lmKGlucHV0LnZhbGlkaXR5LnZhbGlkKXtpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKGludmFsaWRDbGFzcyl9fSl9dmFyIGVycm9yUHJvcHM9W1wiYmFkSW5wdXRcIixcInBhdHRlcm5NaXNtYXRjaFwiLFwicmFuZ2VPdmVyZmxvd1wiLFwicmFuZ2VVbmRlcmZsb3dcIixcInN0ZXBNaXNtYXRjaFwiLFwidG9vTG9uZ1wiLFwidG9vU2hvcnRcIixcInR5cGVNaXNtYXRjaFwiLFwidmFsdWVNaXNzaW5nXCIsXCJjdXN0b21FcnJvclwiXTtmdW5jdGlvbiBnZXRDdXN0b21NZXNzYWdlKGlucHV0LGN1c3RvbU1lc3NhZ2VzKXtjdXN0b21NZXNzYWdlcz1jdXN0b21NZXNzYWdlc3x8e307dmFyIGxvY2FsRXJyb3JQcm9wcz1baW5wdXQudHlwZStcIk1pc21hdGNoXCJdLmNvbmNhdChlcnJvclByb3BzKTt2YXIgdmFsaWRpdHk9aW5wdXQudmFsaWRpdHk7Zm9yKHZhciBpPTA7aTxsb2NhbEVycm9yUHJvcHMubGVuZ3RoO2krKyl7dmFyIHByb3A9bG9jYWxFcnJvclByb3BzW2ldO2lmKHZhbGlkaXR5W3Byb3BdKXtyZXR1cm4gaW5wdXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1cIitwcm9wKXx8Y3VzdG9tTWVzc2FnZXNbcHJvcF19fX1mdW5jdGlvbiBoYW5kbGVDdXN0b21NZXNzYWdlcyhpbnB1dCxjdXN0b21NZXNzYWdlcyl7ZnVuY3Rpb24gY2hlY2tWYWxpZGl0eSgpe3ZhciBtZXNzYWdlPWlucHV0LnZhbGlkaXR5LnZhbGlkP251bGw6Z2V0Q3VzdG9tTWVzc2FnZShpbnB1dCxjdXN0b21NZXNzYWdlcyk7aW5wdXQuc2V0Q3VzdG9tVmFsaWRpdHkobWVzc2FnZXx8XCJcIil9aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsY2hlY2tWYWxpZGl0eSk7aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImludmFsaWRcIixjaGVja1ZhbGlkaXR5KX1mdW5jdGlvbiBoYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheShpbnB1dCxvcHRpb25zKXt2YXIgdmFsaWRhdGlvbkVycm9yQ2xhc3M9b3B0aW9ucy52YWxpZGF0aW9uRXJyb3JDbGFzcyx2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzcz1vcHRpb25zLnZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzLGVycm9yUGxhY2VtZW50PW9wdGlvbnMuZXJyb3JQbGFjZW1lbnQ7ZnVuY3Rpb24gY2hlY2tWYWxpZGl0eShvcHRpb25zKXt2YXIgaW5zZXJ0RXJyb3I9b3B0aW9ucy5pbnNlcnRFcnJvcjt2YXIgcGFyZW50Tm9kZT1pbnB1dC5wYXJlbnROb2RlO3ZhciBlcnJvck5vZGU9cGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKFwiLlwiK3ZhbGlkYXRpb25FcnJvckNsYXNzKXx8ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtpZighaW5wdXQudmFsaWRpdHkudmFsaWQmJmlucHV0LnZhbGlkYXRpb25NZXNzYWdlKXtlcnJvck5vZGUuY2xhc3NOYW1lPXZhbGlkYXRpb25FcnJvckNsYXNzO2Vycm9yTm9kZS50ZXh0Q29udGVudD1pbnB1dC52YWxpZGF0aW9uTWVzc2FnZTtpZihpbnNlcnRFcnJvcil7ZXJyb3JQbGFjZW1lbnQ9PT1cImJlZm9yZVwiPygwLF91dGlsLmluc2VydEJlZm9yZSkoaW5wdXQsZXJyb3JOb2RlKTooMCxfdXRpbC5pbnNlcnRBZnRlcikoaW5wdXQsZXJyb3JOb2RlKTtwYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQodmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3MpfX1lbHNle3BhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSh2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzcyk7ZXJyb3JOb2RlLnJlbW92ZSgpfX1pbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixmdW5jdGlvbigpe2NoZWNrVmFsaWRpdHkoe2luc2VydEVycm9yOmZhbHNlfSl9KTtpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW52YWxpZFwiLGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKTtjaGVja1ZhbGlkaXR5KHtpbnNlcnRFcnJvcjp0cnVlfSl9KX12YXIgZGVmYXVsdE9wdGlvbnM9e2ludmFsaWRDbGFzczpcImludmFsaWRcIix2YWxpZGF0aW9uRXJyb3JDbGFzczpcInZhbGlkYXRpb24tZXJyb3JcIix2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzczpcImhhcy12YWxpZGF0aW9uLWVycm9yXCIsY3VzdG9tTWVzc2FnZXM6e30sZXJyb3JQbGFjZW1lbnQ6XCJiZWZvcmVcIn07ZnVuY3Rpb24gdmFsaWRGb3JtKGVsZW1lbnQsb3B0aW9ucyl7aWYoIWVsZW1lbnR8fCFlbGVtZW50Lm5vZGVOYW1lKXt0aHJvdyBuZXcgRXJyb3IoXCJGaXJzdCBhcmcgdG8gdmFsaWRGb3JtIG11c3QgYmUgYSBmb3JtLCBpbnB1dCwgc2VsZWN0LCBvciB0ZXh0YXJlYVwiKX12YXIgaW5wdXRzPXZvaWQgMDt2YXIgdHlwZT1lbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7b3B0aW9ucz0oMCxfdXRpbC5kZWZhdWx0cykob3B0aW9ucyxkZWZhdWx0T3B0aW9ucyk7aWYodHlwZT09PVwiZm9ybVwiKXtpbnB1dHM9ZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWFcIik7Zm9jdXNJbnZhbGlkSW5wdXQoZWxlbWVudCxpbnB1dHMpfWVsc2UgaWYodHlwZT09PVwiaW5wdXRcInx8dHlwZT09PVwic2VsZWN0XCJ8fHR5cGU9PT1cInRleHRhcmVhXCIpe2lucHV0cz1bZWxlbWVudF19ZWxzZXt0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IGZvcm0sIGlucHV0LCBzZWxlY3QsIG9yIHRleHRhcmVhIGVsZW1lbnRzIGFyZSBzdXBwb3J0ZWRcIil9dmFsaWRGb3JtSW5wdXRzKGlucHV0cyxvcHRpb25zKX1mdW5jdGlvbiBmb2N1c0ludmFsaWRJbnB1dChmb3JtLGlucHV0cyl7dmFyIGZvY3VzRmlyc3Q9KDAsX3V0aWwuZGVib3VuY2UpKDEwMCxmdW5jdGlvbigpe3ZhciBpbnZhbGlkTm9kZT1mb3JtLnF1ZXJ5U2VsZWN0b3IoXCI6aW52YWxpZFwiKTtpZihpbnZhbGlkTm9kZSlpbnZhbGlkTm9kZS5mb2N1cygpfSk7KDAsX3V0aWwuZm9yRWFjaCkoaW5wdXRzLGZ1bmN0aW9uKGlucHV0KXtyZXR1cm4gaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImludmFsaWRcIixmb2N1c0ZpcnN0KX0pfWZ1bmN0aW9uIHZhbGlkRm9ybUlucHV0cyhpbnB1dHMsb3B0aW9ucyl7dmFyIGludmFsaWRDbGFzcz1vcHRpb25zLmludmFsaWRDbGFzcyxjdXN0b21NZXNzYWdlcz1vcHRpb25zLmN1c3RvbU1lc3NhZ2VzOygwLF91dGlsLmZvckVhY2gpKGlucHV0cyxmdW5jdGlvbihpbnB1dCl7dG9nZ2xlSW52YWxpZENsYXNzKGlucHV0LGludmFsaWRDbGFzcyk7aGFuZGxlQ3VzdG9tTWVzc2FnZXMoaW5wdXQsY3VzdG9tTWVzc2FnZXMpO2hhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5KGlucHV0LG9wdGlvbnMpfSl9fSx7XCIuL3V0aWxcIjoyfV19LHt9LFsxXSk7IiwiLyoqXG4gKiBEbyB0aGVzZSB0aGluZ3MgYXMgcXVpY2tseSBhcyBwb3NzaWJsZTsgd2UgbWlnaHQgaGF2ZSBDU1Mgb3IgZWFybHkgc2NyaXB0cyB0aGF0IHJlcXVpcmUgb24gaXRcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ25vLWpzJyApO1xuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdqcycgKTtcbiIsIi8qKlxuICogVGhpcyBpcyB1c2VkIHRvIGNhdXNlIEdvb2dsZSBBbmFseXRpY3MgZXZlbnRzIHRvIHJ1blxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuLypcbiAqIENhbGwgaG9va3MgZnJvbSBvdGhlciBwbGFjZXMuXG4gKiBUaGlzIGFsbG93cyBvdGhlciBwbHVnaW5zIHRoYXQgd2UgbWFpbnRhaW4gdG8gcGFzcyBkYXRhIHRvIHRoZSB0aGVtZSdzIGFuYWx5dGljcyBtZXRob2QuXG4qL1xuaWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIHdwICkge1xuXHQvLyBmb3IgYW5hbHl0aWNzXG5cdHdwLmhvb2tzLmFkZEFjdGlvbiggJ3dwTWVzc2FnZUluc2VydGVyQW5hbHl0aWNzRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCwgMTAgKTtcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnbWlubnBvc3RGb3JtUHJvY2Vzc29yTWFpbGNoaW1wQW5hbHl0aWNzRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCwgMTAgKTtcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnbWlubnBvc3RNZW1iZXJzaGlwQW5hbHl0aWNzRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCwgMTAgKTtcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnbWlubnBvc3RNZW1iZXJzaGlwQW5hbHl0aWNzRWNvbW1lcmNlQWN0aW9uJywgJ21pbm5wb3N0TGFyZ28nLCBtcEFuYWx5dGljc1RyYWNraW5nRWNvbW1lcmNlQWN0aW9uLCAxMCApO1xuXG5cdC8vIGZvciBkYXRhIGxheWVyIHRvIEdvb2dsZSBUYWcgTWFuYWdlclxuXHR3cC5ob29rcy5hZGRBY3Rpb24oICd3cE1lc3NhZ2VJbnNlcnRlckRhdGFMYXllckV2ZW50JywgJ21pbm5wb3N0TGFyZ28nLCBtcERhdGFMYXllckV2ZW50LCAxMCApO1xuXHR3cC5ob29rcy5hZGRBY3Rpb24oICdtaW5ucG9zdEZvcm1Qcm9jZXNzb3JNYWlsY2hpbXBEYXRhTGF5ZXJFdmVudCcsICdtaW5ucG9zdExhcmdvJywgbXBEYXRhTGF5ZXJFdmVudCwgMTAgKTtcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnbWlubnBvc3RNZW1iZXJzaGlwRGF0YUxheWVyRWNvbW1lcmNlQWN0aW9uJywgJ21pbm5wb3N0TGFyZ28nLCBtcERhdGFMYXllckVjb21tZXJjZSwgMTAgKTtcbn1cblxuLypcbiAqIENyZWF0ZSBhIEdvb2dsZSBBbmFseXRpY3MgZXZlbnQgZm9yIHRoZSB0aGVtZS4gVGhpcyBjYWxscyB0aGUgd3AtYW5hbHl0aWNzLXRyYWNraW5nLWdlbmVyYXRvciBhY3Rpb24uXG4gKiB0eXBlOiBnZW5lcmFsbHkgdGhpcyBpcyBcImV2ZW50XCJcbiAqIGNhdGVnb3J5OiBFdmVudCBDYXRlZ29yeVxuICogbGFiZWw6IEV2ZW50IExhYmVsXG4gKiBhY3Rpb246IEV2ZW50IEFjdGlvblxuICogdmFsdWU6IG9wdGlvbmFsXG4gKiBub25faW50ZXJhY3Rpb246IG9wdGlvbmFsXG4qL1xuZnVuY3Rpb24gbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUsIG5vbl9pbnRlcmFjdGlvbiApIHtcblx0d3AuaG9va3MuZG9BY3Rpb24oICd3cEFuYWx5dGljc1RyYWNraW5nR2VuZXJhdG9yRXZlbnQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUsIG5vbl9pbnRlcmFjdGlvbiApO1xufVxuXG4vKlxuICogQ3JlYXRlIGEgZGF0YWxheWVyIGV2ZW50IGZvciB0aGUgdGhlbWUgdXNpbmcgdGhlIGd0bTR3cCBwbHVnaW4uIFRoaXMgc2V0cyB0aGUgZGF0YUxheWVyIG9iamVjdCBmb3IgR29vZ2xlIFRhZyBNYW5hZ2VyLlxuICogSXQgc2hvdWxkIG9ubHkgaGF2ZSBkYXRhIHRoYXQgaXMgbm90IGF2YWlhbGFibGUgdG8gR1RNIGJ5IGRlZmF1bHQuXG4gKiBkYXRhTGF5ZXJDb250ZW50OiB0aGUgb2JqZWN0IHRoYXQgc2hvdWxkIGJlIGFkZGVkXG4qL1xuZnVuY3Rpb24gbXBEYXRhTGF5ZXJFdmVudCggZGF0YUxheWVyQ29udGVudCApIHtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGRhdGFMYXllciAmJiBPYmplY3Qua2V5cyggZGF0YUxheWVyQ29udGVudCApLmxlbmd0aCAhPT0gMCApIHtcblx0XHRkYXRhTGF5ZXIucHVzaCggZGF0YUxheWVyQ29udGVudCApO1xuXHR9XG59XG5cbi8qXG4gKiBDcmVhdGUgYSBHb29nbGUgQW5hbHl0aWNzIEVjb21tZXJjZSBhY3Rpb24gZm9yIHRoZSB0aGVtZS4gVGhpcyBjYWxscyB0aGUgd3AtYW5hbHl0aWNzLXRyYWNraW5nLWdlbmVyYXRvciBhY3Rpb24uXG4gKlxuKi9cbmZ1bmN0aW9uIG1wQW5hbHl0aWNzVHJhY2tpbmdFY29tbWVyY2VBY3Rpb24oIHR5cGUsIGFjdGlvbiwgcHJvZHVjdCwgc3RlcCApIHtcblx0d3AuaG9va3MuZG9BY3Rpb24oICd3cEFuYWx5dGljc1RyYWNraW5nR2VuZXJhdG9yRWNvbW1lcmNlQWN0aW9uJywgdHlwZSwgYWN0aW9uLCBwcm9kdWN0LCBzdGVwICk7XG59XG5cbi8qXG4gKiBTZXQgdXAgZGF0YUxheWVyIHN0dWZmIGZvciBlY29tbWVyY2UgdmlhIEdvb2dsZSBUYWcgTWFuYWdlciB1c2luZyB0aGUgZ3RtNHdwIHBsdWdpbi5cbiAqXG4qL1xuZnVuY3Rpb24gbXBEYXRhTGF5ZXJFY29tbWVyY2UoIGRhdGFMYXllckNvbnRlbnQgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBkYXRhTGF5ZXIgJiYgT2JqZWN0LmtleXMoIGRhdGFMYXllckNvbnRlbnQgKS5sZW5ndGggIT09IDAgKSB7XG5cdFx0ZGF0YUxheWVyLnB1c2goeyBlY29tbWVyY2U6IG51bGwgfSk7IC8vIGZpcnN0LCBtYWtlIHN1cmUgdGhlcmUgYXJlbid0IG11bHRpcGxlIHRoaW5ncyBoYXBwZW5pbmcuXG5cdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGRhdGFMYXllckNvbnRlbnQuYWN0aW9uICYmICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZGF0YUxheWVyQ29udGVudC5wcm9kdWN0ICkge1xuXHRcdFx0ZGF0YUxheWVyLnB1c2goe1xuXHRcdFx0XHRldmVudDogZGF0YUxheWVyQ29udGVudC5hY3Rpb24sXG5cdFx0XHRcdGVjb21tZXJjZToge1xuXHRcdFx0XHRcdGl0ZW1zOiBbZGF0YUxheWVyQ29udGVudC5wcm9kdWN0XVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn1cblxuLypcbiAqIFdoZW4gYSBwYXJ0IG9mIHRoZSB3ZWJzaXRlIGlzIG1lbWJlci1zcGVjaWZpYywgY3JlYXRlIGFuIGV2ZW50IGZvciB3aGV0aGVyIGl0IHdhcyBzaG93biBvciBub3QuXG4qL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEgJiYgJycgIT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS51cmxfYWNjZXNzX2xldmVsICkge1xuXHRcdHZhciB0eXBlID0gJ2V2ZW50Jztcblx0XHR2YXIgY2F0ZWdvcnkgPSAnTWVtYmVyIENvbnRlbnQnO1xuXHRcdHZhciBsYWJlbCA9IGxvY2F0aW9uLnBhdGhuYW1lOyAvLyBpIHRoaW5rIHdlIGNvdWxkIHBvc3NpYmx5IHB1dCBzb21lIGdyb3VwaW5nIGhlcmUsIGJ1dCB3ZSBkb24ndCBuZWNlc3NhcmlseSBoYXZlIGFjY2VzcyB0byBvbmUgYW5kIG1heWJlIGl0J3Mgbm90IHdvcnRod2hpbGUgeWV0XG5cdFx0dmFyIGFjdGlvbiA9ICdCbG9ja2VkJztcblx0XHRpZiAoIHRydWUgPT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS5jdXJyZW50X3VzZXIuY2FuX2FjY2VzcyApIHtcblx0XHRcdGFjdGlvbiA9ICdTaG93bic7XG5cdFx0fVxuXHRcdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0fVxufSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBzaGFyaW5nIGNvbnRlbnRcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8vIHRyYWNrIGEgc2hhcmUgdmlhIGFuYWx5dGljcyBldmVudC5cbmZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uID0gJycgKSB7XG4gICAgdmFyIGNhdGVnb3J5ID0gJ1NoYXJlJztcbiAgICBpZiAoICcnICE9PSBwb3NpdGlvbiApIHtcbiAgICAgICAgY2F0ZWdvcnkgPSAnU2hhcmUgLSAnICsgcG9zaXRpb247XG4gICAgfVxuXG4gICAgLy8gdHJhY2sgYXMgYW4gZXZlbnRcbiAgICBtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsIGNhdGVnb3J5LCB0ZXh0LCBsb2NhdGlvbi5wYXRobmFtZSApO1xufVxuXG4vLyB0b3Agc2hhcmUgYnV0dG9uIGNsaWNrXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZW50cnktc2hhcmUtdG9wIGEnICkuZm9yRWFjaChcbiAgICB0b3BCdXR0b24gPT4gdG9wQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsICggZSApID0+IHtcbiAgICAgICAgdmFyIHRleHQgPSBlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCAnZGF0YS1zaGFyZS1hY3Rpb24nICk7XG4gICAgICAgIHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuICAgICAgICB0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xuICAgIH0gKVxuKTtcblxuLy8gd2hlbiB0aGUgcHJpbnQgYnV0dG9uIGlzIGNsaWNrZWRcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1wcmludCBhJyApLmZvckVhY2goXG4gICAgcHJpbnRCdXR0b24gPT4gcHJpbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCBlICkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHdpbmRvdy5wcmludCgpO1xuICAgIH0gKVxuKTtcblxuLy8gd2hlbiB0aGUgcmVwdWJsaXNoIGJ1dHRvbiBpcyBjbGlja2VkXG4vLyB0aGUgcGx1Z2luIGNvbnRyb2xzIHRoZSByZXN0LCBidXQgd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhlIGRlZmF1bHQgZXZlbnQgZG9lc24ndCBmaXJlXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtcmVwdWJsaXNoIGEnICkuZm9yRWFjaChcbiAgICByZXB1Ymxpc2hCdXR0b24gPT4gcmVwdWJsaXNoQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsICggZSApID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gKVxuKTtcblxuLy8gd2hlbiB0aGUgY29weSBsaW5rIGJ1dHRvbiBpcyBjbGlja2VkXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtY29weS11cmwgYScgKS5mb3JFYWNoKFxuICAgIGNvcHlCdXR0b24gPT4gY29weUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoIGUgKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGV0IGNvcHlUZXh0ID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KCBjb3B5VGV4dCApLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgIHRsaXRlLnNob3coICggZS50YXJnZXQgKSwgeyBncmF2OiAndycgfSApO1xuICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGxpdGUuaGlkZSggKCBlLnRhcmdldCApICk7XG4gICAgICAgICAgICB9LCAzMDAwICk7XG4gICAgICAgIH0gKTtcbiAgICB9IClcbik7XG5cbi8vIHdoZW4gc2hhcmluZyB2aWEgZmFjZWJvb2ssIHR3aXR0ZXIsIG9yIGVtYWlsLCBvcGVuIHRoZSBkZXN0aW5hdGlvbiB1cmwgaW4gYSBuZXcgd2luZG93XG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZmFjZWJvb2sgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtdHdpdHRlciBhLCAubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1lbWFpbCBhJyApLmZvckVhY2goXG4gICAgYW55U2hhcmVCdXR0b24gPT4gYW55U2hhcmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCBlICkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyIHVybCA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoICdocmVmJyApO1xuXHRcdHdpbmRvdy5vcGVuKCB1cmwsICdfYmxhbmsnICk7XG4gICAgfSApXG4pO1xuIiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogTmF2aWdhdGlvbiBzY3JpcHRzLiBJbmNsdWRlcyBtb2JpbGUgb3IgdG9nZ2xlIGJlaGF2aW9yLCBhbmFseXRpY3MgdHJhY2tpbmcgb2Ygc3BlY2lmaWMgbWVudXMuXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKi9cblxuZnVuY3Rpb24gc2V0dXBQcmltYXJ5TmF2KCkge1xuXHRjb25zdCBwcmltYXJ5TmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWxpbmtzJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgcHJpbWFyeU5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgYnV0dG9uJyApO1xuXHRpZiAoIG51bGwgIT09IHByaW1hcnlOYXZUb2dnbGUgKSB7XG5cdFx0cHJpbWFyeU5hdlRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdGNvbnN0IHVzZXJOYXZUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1hY2NvdW50IHVsJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgdXNlck5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1hY2NvdW50ID4gYScgKTtcblx0aWYgKCBudWxsICE9PSB1c2VyTmF2VG9nZ2xlICkge1xuXHRcdHVzZXJOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHR2YXIgdGFyZ2V0ICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ25hdiAubS1mb3JtLXNlYXJjaCBmaWVsZHNldCAuYS1idXR0b24tc2VudGVuY2UnICk7XG5cdGlmICggbnVsbCAhPT0gdGFyZ2V0ICkge1xuXHRcdHZhciBkaXYgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdGRpdi5pbm5lckhUTUwgPSAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImEtY2xvc2UtYnV0dG9uIGEtY2xvc2Utc2VhcmNoXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG5cdFx0dmFyIGZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRkaXYuc2V0QXR0cmlidXRlKCAnY2xhc3MnLCAnYS1jbG9zZS1ob2xkZXInICk7XG5cdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZCggZnJhZ21lbnQgKTtcblxuXHRcdGNvbnN0IHNlYXJjaFRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWFjdGlvbnMgLm0tZm9ybS1zZWFyY2gnICksXG5cdFx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdFx0fSApO1xuXG5cdFx0dmFyIHNlYXJjaFZpc2libGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbGkuc2VhcmNoID4gYScgKTtcblx0XHRzZWFyY2hWaXNpYmxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdHZhciBzZWFyY2hDbG9zZSAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmEtY2xvc2Utc2VhcmNoJyApO1xuXHRcdHNlYXJjaENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdGRvY3VtZW50Lm9ua2V5ZG93biA9IGZ1bmN0aW9uKCBldnQgKSB7XG5cdFx0ZXZ0ID0gZXZ0IHx8IHdpbmRvdy5ldmVudDtcblx0XHR2YXIgaXNFc2NhcGUgPSBmYWxzZTtcblx0XHRpZiAoICdrZXknIGluIGV2dCApIHtcblx0XHRcdGlzRXNjYXBlID0gKCAnRXNjYXBlJyA9PT0gZXZ0LmtleSB8fCAnRXNjJyA9PT0gZXZ0LmtleSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpc0VzY2FwZSA9ICggMjcgPT09IGV2dC5rZXlDb2RlICk7XG5cdFx0fVxuXHRcdGlmICggaXNFc2NhcGUgKSB7XG5cdFx0XHRsZXQgcHJpbWFyeU5hdkV4cGFuZGVkID0gJ3RydWUnID09PSBwcmltYXJ5TmF2VG9nZ2xlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRsZXQgdXNlck5hdkV4cGFuZGVkID0gJ3RydWUnID09PSB1c2VyTmF2VG9nZ2xlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRsZXQgc2VhcmNoSXNWaXNpYmxlID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHByaW1hcnlOYXZFeHBhbmRlZCAmJiB0cnVlID09PSBwcmltYXJ5TmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgcHJpbWFyeU5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgdXNlck5hdkV4cGFuZGVkICYmIHRydWUgPT09IHVzZXJOYXZFeHBhbmRlZCApIHtcblx0XHRcdFx0dXNlck5hdlRvZ2dsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISB1c2VyTmF2RXhwYW5kZWQgKTtcblx0XHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBzZWFyY2hJc1Zpc2libGUgJiYgdHJ1ZSA9PT0gc2VhcmNoSXNWaXNpYmxlICkge1xuXHRcdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHNlYXJjaElzVmlzaWJsZSApO1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5zZXR1cFByaW1hcnlOYXYoKTtcblxuZnVuY3Rpb24gc2V0dXBTY3JvbGxOYXYoKSB7XG5cblx0bGV0IHN1Yk5hdlNjcm9sbGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1zdWItbmF2aWdhdGlvbicgKTtcblx0c3ViTmF2U2Nyb2xsZXJzLmZvckVhY2goICggY3VycmVudFZhbHVlICkgPT4ge1xuXHRcdFByaW9yaXR5TmF2U2Nyb2xsZXIoIHtcblx0XHRcdHNlbGVjdG9yOiBjdXJyZW50VmFsdWUsXG5cdFx0XHRuYXZTZWxlY3RvcjogJy5tLXN1Ym5hdi1uYXZpZ2F0aW9uJyxcblx0XHRcdGNvbnRlbnRTZWxlY3RvcjogJy5tLW1lbnUtc3ViLW5hdmlnYXRpb24nLFxuXHRcdFx0aXRlbVNlbGVjdG9yOiAnbGksIGEnLFxuXHRcdFx0YnV0dG9uTGVmdFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuXHRcdFx0YnV0dG9uUmlnaHRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1yaWdodCdcblx0XHR9ICk7XG5cdH0gKTtcblxuXHRsZXQgcGFnaW5hdGlvblNjcm9sbGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1wYWdpbmF0aW9uLW5hdmlnYXRpb24nICk7XG5cdHBhZ2luYXRpb25TY3JvbGxlcnMuZm9yRWFjaCggKCBjdXJyZW50VmFsdWUgKSA9PiB7XG5cdFx0UHJpb3JpdHlOYXZTY3JvbGxlcigge1xuXHRcdFx0c2VsZWN0b3I6IGN1cnJlbnRWYWx1ZSxcblx0XHRcdG5hdlNlbGVjdG9yOiAnLm0tcGFnaW5hdGlvbi1jb250YWluZXInLFxuXHRcdFx0Y29udGVudFNlbGVjdG9yOiAnLm0tcGFnaW5hdGlvbi1saXN0Jyxcblx0XHRcdGl0ZW1TZWxlY3RvcjogJ2xpLCBhJyxcblx0XHRcdGJ1dHRvbkxlZnRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0Jyxcblx0XHRcdGJ1dHRvblJpZ2h0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tcmlnaHQnXG5cdFx0fSApO1xuXHR9ICk7XG5cbn1cbnNldHVwU2Nyb2xsTmF2KCk7XG5cbi8vIHNpZGViYXIgbGluayBjbGlja1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5vLXNpdGUtc2lkZWJhciBhJyApLmZvckVhY2goXG4gICAgc2lkZWJhckxpbmsgPT4gc2lkZWJhckxpbmsuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCBlICkgPT4ge1xuXHRcdGxldCBjbG9zZXN0V2lkZ2V0ICAgICAgID0gc2lkZWJhckxpbmsuY2xvc2VzdCggJy5tLXdpZGdldCcgKTtcblx0XHRsZXQgY2xvc2VzdFpvbmUgICAgICAgICA9IHNpZGViYXJMaW5rLmNsb3Nlc3QoICcubS16b25lJyApO1xuXHRcdGxldCB3aWRnZXRUaXRsZSAgICAgICAgID0gJyc7XG5cdFx0bGV0IHpvbmVUaXRsZSAgICAgICAgICAgPSAnJztcblx0XHRsZXQgc2lkZWJhclNlY3Rpb25UaXRsZSA9ICcnO1xuXHRcdGlmICggbnVsbCAhPT0gY2xvc2VzdFdpZGdldCApIHtcblx0XHRcdHdpZGdldFRpdGxlID0gY2xvc2VzdFdpZGdldC5xdWVyeVNlbGVjdG9yKCAnaDMnICkudGV4dENvbnRlbnQ7XG5cdFx0fSBlbHNlIGlmICggbnVsbCAhPT0gY2xvc2VzdFpvbmUgKSB7XG5cdFx0XHR6b25lVGl0bGUgPSBjbG9zZXN0Wm9uZS5xdWVyeVNlbGVjdG9yKCAnLmEtem9uZS10aXRsZScgKS50ZXh0Q29udGVudDtcblx0XHR9XG5cdFx0aWYgKCBudWxsICE9PSB3aWRnZXRUaXRsZSApIHtcblx0XHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB3aWRnZXRUaXRsZTtcblx0XHR9IGVsc2UgaWYgKCBudWxsICE9PSB6b25lVGl0bGUgKSB7XG5cdFx0XHRzaWRlYmFyU2VjdGlvblRpdGxlID0gem9uZVRpdGxlO1xuXHRcdH1cblx0XHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsICdTaWRlYmFyIExpbmsnLCAnQ2xpY2snLCBzaWRlYmFyU2VjdGlvblRpdGxlICk7XG4gICAgfSApXG4pO1xuXG4vLyByZWxhdGVkIHNlY3Rpb24gbGluayBjbGlja1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLXJlbGF0ZWQgYScgKS5mb3JFYWNoKFxuICAgIHJlbGF0ZWRMaW5rID0+IHJlbGF0ZWRMaW5rLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsICggZSApID0+IHtcblx0XHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsICdSZWxhdGVkIFNlY3Rpb24gTGluaycsICdDbGljaycsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG4gICAgfSApXG4pO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBmb3Jtc1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG5qUXVlcnkuZm4udGV4dE5vZGVzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNvbnRlbnRzKCkuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKCB0aGlzLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSAmJiAnJyAhPT0gdGhpcy5ub2RlVmFsdWUudHJpbSgpICk7XG5cdH0gKTtcbn07XG5cbmZ1bmN0aW9uIGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoIGFjdGlvbiApIHtcblx0dmFyIG1hcmt1cCA9ICc8bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLWZvcm0tY29uZmlybVwiPjxsYWJlbD5BcmUgeW91IHN1cmU/IDxhIGlkPVwiYS1jb25maXJtLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ZZXM8L2E+IHwgPGEgaWQ9XCJhLXN0b3AtJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPk5vPC9hPjwvbGFiZWw+PC9saT4nO1xuXHRyZXR1cm4gbWFya3VwO1xufVxuXG5mdW5jdGlvbiBtYW5hZ2VFbWFpbHMoKSB7XG5cdHZhciBmb3JtICAgICAgICAgICAgICAgPSAkKCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScgKTtcblx0dmFyIHJlc3RSb290ICAgICAgICAgICA9IHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Quc2l0ZV91cmwgKyB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnJlc3RfbmFtZXNwYWNlO1xuXHR2YXIgZnVsbFVybCAgICAgICAgICAgID0gcmVzdFJvb3QgKyAnLycgKyAndXBkYXRlLXVzZXIvJztcblx0dmFyIGNvbmZpcm1DaGFuZ2UgICAgICA9ICcnO1xuXHR2YXIgbmV4dEVtYWlsQ291bnQgICAgID0gMTtcblx0dmFyIG5ld1ByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgb2xkUHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBwcmltYXJ5SWQgICAgICAgICAgPSAnJztcblx0dmFyIGVtYWlsVG9SZW1vdmUgICAgICA9ICcnO1xuXHR2YXIgY29uc29saWRhdGVkRW1haWxzID0gW107XG5cdHZhciBuZXdFbWFpbHMgICAgICAgICAgPSBbXTtcblx0dmFyIGFqYXhGb3JtRGF0YSAgICAgICA9ICcnO1xuXHR2YXIgdGhhdCAgICAgICAgICAgICAgID0gJyc7XG5cblx0Ly8gc3RhcnQgb3V0IHdpdGggbm8gcHJpbWFyeS9yZW1vdmFscyBjaGVja2VkXG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdC8vIGlmIHRoZXJlIGlzIGEgbGlzdCBvZiBlbWFpbHMgKG5vdCBqdXN0IGEgc2luZ2xlIGZvcm0gZmllbGQpXG5cdGlmICggMCA8ICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoICkge1xuXHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblxuXHRcdC8vIGlmIGEgdXNlciBzZWxlY3RzIGEgbmV3IHByaW1hcnksIG1vdmUgaXQgaW50byB0aGF0IHBvc2l0aW9uXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nLCBmdW5jdGlvbigpIHtcblxuXHRcdFx0bmV3UHJpbWFyeUVtYWlsID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdHByaW1hcnlJZCAgICAgICA9ICQoIHRoaXMgKS5wcm9wKCAnaWQnICkucmVwbGFjZSggJ3ByaW1hcnlfZW1haWxfJywgJycgKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdwcmltYXJ5LWNoYW5nZScgKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXG5cdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBtYWluIGhpZGRlbiBmb3JtIHZhbHVlXG5cdFx0XHRcdCQoICcjZW1haWwnICkudmFsKCBuZXdQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBzdWJtaXQgZm9ybSB2YWx1ZXMuXG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cblx0XHRcdFx0Ly8gdW5jaGVjayB0aGUgcmFkaW8gYnV0dG9uXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIGZvcm0gdmFsdWVzIHRvIHRoZSBvbGQgcHJpbWFyeSBlbWFpbFxuXHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjcmVtb3ZlX2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgY29uZmlybSBtZXNzYWdlXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHR9ICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjaGFuZ2UnLCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZW1haWxUb1JlbW92ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdyZW1vdmFsJyApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSAhPT0gZW1haWxUb1JlbW92ZSApIHtcblx0XHRcdFx0XHRjb25zb2xpZGF0ZWRFbWFpbHMucHVzaCggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyIGZvciByZW1vdmFsXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQvLyBpZiBjb25maXJtZWQsIHJlbW92ZSB0aGUgZW1haWwgYW5kIHN1Ym1pdCB0aGUgZm9ybVxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5mYWRlT3V0KCAnbm9ybWFsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLnJlbW92ZSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCAndmFsdWUgaXMgJyArIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8vIGlmIGEgdXNlciB3YW50cyB0byBhZGQgYW4gZW1haWwsIGdpdmUgdGhlbSBhIHByb3Blcmx5IG51bWJlcmVkIGZpZWxkXG5cdCQoICcubS1mb3JtLWVtYWlsJyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcgKS5iZWZvcmUoICc8ZGl2IGNsYXNzPVwiYS1pbnB1dC13aXRoLWJ1dHRvbiBhLWJ1dHRvbi1zZW50ZW5jZVwiPjxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIGlkPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIHZhbHVlPVwiXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBpZD1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBjbGFzcz1cImEtYnV0dG9uIGEtYnV0dG9uLWFkZC11c2VyLWVtYWlsXCI+QWRkPC9idXR0b24+PC9kaXY+JyApO1xuXHRcdG5leHRFbWFpbENvdW50Kys7XG5cdH0gKTtcblxuXHQkKCAnaW5wdXRbdHlwZT1zdWJtaXRdJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgYnV0dG9uID0gJCggdGhpcyApO1xuXHRcdHZhciBidXR0b25Gb3JtID0gYnV0dG9uLmNsb3Nlc3QoICdmb3JtJyApO1xuXHRcdGJ1dHRvbkZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJywgYnV0dG9uLnZhbCgpICk7XG5cdH0gKTtcblxuXHQkKCAnLm0tZW50cnktY29udGVudCcgKS5vbiggJ3N1Ym1pdCcsICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdHZhciBmb3JtID0gJCggdGhpcyApO1xuXHRcdHZhciBzdWJtaXR0aW5nQnV0dG9uID0gZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nICkgfHwgJyc7XG5cblx0XHQvLyBpZiB0aGVyZSBpcyBubyBzdWJtaXR0aW5nIGJ1dHRvbiwgcGFzcyBpdCBieSBBamF4XG5cdFx0aWYgKCAnJyA9PT0gc3VibWl0dGluZ0J1dHRvbiB8fCAnU2F2ZSBDaGFuZ2VzJyAhPT0gc3VibWl0dGluZ0J1dHRvbiApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhamF4Rm9ybURhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4Rm9ybURhdGEgPSBhamF4Rm9ybURhdGEgKyAnJnJlc3Q9dHJ1ZSc7XG5cdFx0XHQkLmFqYXgoIHtcblx0XHRcdFx0dXJsOiBmdWxsVXJsLFxuXHRcdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKCB4aHIgKSB7XG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRkYXRhOiBhamF4Rm9ybURhdGFcblx0XHRcdH0gKS5kb25lKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0fSApLmdldCgpO1xuXHRcdFx0XHQkLmVhY2goIG5ld0VtYWlscywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9IG5leHRFbWFpbENvdW50ICsgaW5kZXg7XG5cdFx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5hcHBlbmQoICc8bGkgaWQ9XCJ1c2VyLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIj4nICsgdmFsdWUgKyAnPHVsIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS11c2VyLWVtYWlsLWFjdGlvbnNcIj48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtbWFrZS1wcmltYXJ5LWVtYWlsXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJwcmltYXJ5X2VtYWlsXCIgaWQ9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPk1ha2UgUHJpbWFyeTwvc21hbGw+PC9sYWJlbD48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1lbWFpbC1wcmVmZXJlbmNlc1wiPjxhIGhyZWY9XCIvbmV3c2xldHRlcnMvP2VtYWlsPScgKyBlbmNvZGVVUklDb21wb25lbnQoIHZhbHVlICkgKyAnXCI+PHNtYWxsPkVtYWlsIFByZWZlcmVuY2VzPC9zbWFsbD48L2E+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtcmVtb3ZlLWVtYWlsXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJyZW1vdmVfZW1haWxbJyArIG5leHRFbWFpbENvdW50ICsgJ11cIiBpZD1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPlJlbW92ZTwvc21hbGw+PC9sYWJlbD48L2xpPjwvdWw+PC9saT4nICk7XG5cdFx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoICQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCkgKyAnLCcgKyB2YWx1ZSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdCQoICcubS1mb3JtLWNoYW5nZS1lbWFpbCAuYS1pbnB1dC13aXRoLWJ1dHRvbicgKS5yZW1vdmUoKTtcblx0XHRcdFx0aWYgKCAwID09PSAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKSAhPT0gJCggJ2lucHV0W25hbWU9XCJlbWFpbFwiXScgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gaXQgd291bGQgYmUgbmljZSB0byBvbmx5IGxvYWQgdGhlIGZvcm0sIGJ1dCB0aGVuIGNsaWNrIGV2ZW50cyBzdGlsbCBkb24ndCB3b3JrXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cdH0gKTtcbn1cblxuZnVuY3Rpb24gYWRkQXV0b1Jlc2l6ZSgpIHtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJ1tkYXRhLWF1dG9yZXNpemVdJyApLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdGVsZW1lbnQuc3R5bGUuYm94U2l6aW5nID0gJ2JvcmRlci1ib3gnO1xuXHRcdHZhciBvZmZzZXQgPSBlbGVtZW50Lm9mZnNldEhlaWdodCAtIGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuXHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQudGFyZ2V0LnN0eWxlLmhlaWdodCA9ICdhdXRvJztcblx0XHRcdGV2ZW50LnRhcmdldC5zdHlsZS5oZWlnaHQgPSBldmVudC50YXJnZXQuc2Nyb2xsSGVpZ2h0ICsgb2Zmc2V0ICsgJ3B4Jztcblx0XHR9ICk7XG5cdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoICdkYXRhLWF1dG9yZXNpemUnICk7XG5cdH0gKTtcbn1cblxuJCggZG9jdW1lbnQgKS5hamF4U3RvcCggZnVuY3Rpb24oKSB7XG5cdHZhciBjb21tZW50QXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcjbGxjX2NvbW1lbnRzJyApO1xuXHRpZiAoIG51bGwgIT09IGNvbW1lbnRBcmVhICkge1xuXHRcdGFkZEF1dG9SZXNpemUoKTtcblx0fVxufSApO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIDAgPCAkKCAnLm0tZm9ybS1hY2NvdW50LXNldHRpbmdzJyApLmxlbmd0aCApIHtcblx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0fVxuXHR2YXIgYXV0b1Jlc2l6ZVRleHRhcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ1tkYXRhLWF1dG9yZXNpemVdJyApO1xuXHRpZiAoIG51bGwgIT09IGF1dG9SZXNpemVUZXh0YXJlYSApIHtcblx0XHRhZGRBdXRvUmVzaXplKCk7XG5cdH1cbn0gKTtcblxudmFyIGZvcm1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWZvcm0nICk7XG5mb3Jtcy5mb3JFYWNoKCBmdW5jdGlvbiggZm9ybSApIHtcblx0VmFsaWRGb3JtKCBmb3JtLCB7XG5cdFx0dmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3M6ICdtLWhhcy12YWxpZGF0aW9uLWVycm9yJyxcblx0XHR2YWxpZGF0aW9uRXJyb3JDbGFzczogJ2EtdmFsaWRhdGlvbi1lcnJvcicsXG5cdFx0aW52YWxpZENsYXNzOiAnYS1lcnJvcicsXG5cdFx0ZXJyb3JQbGFjZW1lbnQ6ICdhZnRlcidcblx0fSApO1xufSApO1xuXG52YXIgZm9ybSA9ICQoICcubS1mb3JtJyApO1xuXG4vLyBsaXN0ZW4gZm9yIGBpbnZhbGlkYCBldmVudHMgb24gYWxsIGZvcm0gaW5wdXRzXG5mb3JtLmZpbmQoICc6aW5wdXQnICkub24oICdpbnZhbGlkJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGlucHV0ID0gJCggdGhpcyApO1xuXG4gICAgLy8gdGhlIGZpcnN0IGludmFsaWQgZWxlbWVudCBpbiB0aGUgZm9ybVxuXHR2YXIgZmlyc3QgPSBmb3JtLmZpbmQoICcuYS1lcnJvcicgKS5maXJzdCgpO1xuXG5cdC8vIHRoZSBmb3JtIGl0ZW0gdGhhdCBjb250YWlucyBpdFxuXHR2YXIgZmlyc3RfaG9sZGVyID0gZmlyc3QucGFyZW50KCk7XG5cbiAgICAvLyBvbmx5IGhhbmRsZSBpZiB0aGlzIGlzIHRoZSBmaXJzdCBpbnZhbGlkIGlucHV0XG4gICAgaWYgKCBpbnB1dFswXSA9PT0gZmlyc3RbMF0gKSB7XG5cbiAgICAgICAgLy8gaGVpZ2h0IG9mIHRoZSBuYXYgYmFyIHBsdXMgc29tZSBwYWRkaW5nIGlmIHRoZXJlJ3MgYSBmaXhlZCBuYXZcbiAgICAgICAgLy92YXIgbmF2YmFySGVpZ2h0ID0gbmF2YmFyLmhlaWdodCgpICsgNTBcblxuICAgICAgICAvLyB0aGUgcG9zaXRpb24gdG8gc2Nyb2xsIHRvIChhY2NvdW50aW5nIGZvciB0aGUgbmF2YmFyIGlmIGl0IGV4aXN0cylcbiAgICAgICAgdmFyIGVsZW1lbnRPZmZzZXQgPSBmaXJzdF9ob2xkZXIub2Zmc2V0KCkudG9wO1xuXG4gICAgICAgIC8vIHRoZSBjdXJyZW50IHNjcm9sbCBwb3NpdGlvbiAoYWNjb3VudGluZyBmb3IgdGhlIG5hdmJhcilcbiAgICAgICAgdmFyIHBhZ2VPZmZzZXQgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cbiAgICAgICAgLy8gZG9uJ3Qgc2Nyb2xsIGlmIHRoZSBlbGVtZW50IGlzIGFscmVhZHkgaW4gdmlld1xuICAgICAgICBpZiAoIGVsZW1lbnRPZmZzZXQgPiBwYWdlT2Zmc2V0ICYmIGVsZW1lbnRPZmZzZXQgPCBwYWdlT2Zmc2V0ICsgd2luZG93LmlubmVySGVpZ2h0ICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBub3RlOiBhdm9pZCB1c2luZyBhbmltYXRlLCBhcyBpdCBwcmV2ZW50cyB0aGUgdmFsaWRhdGlvbiBtZXNzYWdlIGRpc3BsYXlpbmcgY29ycmVjdGx5XG4gICAgICAgICQoICdodG1sLCBib2R5JyApLnNjcm9sbFRvcCggZWxlbWVudE9mZnNldCApO1xuICAgIH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgY29tbWVudHNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuLy8gYmFzZWQgb24gd2hpY2ggYnV0dG9uIHdhcyBjbGlja2VkLCBzZXQgdGhlIHZhbHVlcyBmb3IgdGhlIGFuYWx5dGljcyBldmVudCBhbmQgY3JlYXRlIGl0XG5mdW5jdGlvbiB0cmFja1Nob3dDb21tZW50cyggYWx3YXlzLCBpZCwgY2xpY2tWYWx1ZSApIHtcblx0dmFyIGFjdGlvbiAgICAgICAgICA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlQcmVmaXggPSAnJztcblx0dmFyIGNhdGVnb3J5U3VmZml4ID0gJyc7XG5cdHZhciBwb3NpdGlvbiAgICAgICAgPSAnJztcblx0cG9zaXRpb24gPSBpZC5yZXBsYWNlKCAnYWx3YXlzLXNob3ctY29tbWVudHMtJywgJycgKTtcblx0aWYgKCAnMScgPT09IGNsaWNrVmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09uJztcblx0fSBlbHNlIGlmICggJzAnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPZmYnO1xuXHR9IGVsc2Uge1xuXHRcdGFjdGlvbiA9ICdDbGljayc7XG5cdH1cblx0aWYgKCB0cnVlID09PSBhbHdheXMgKSB7XG5cdFx0Y2F0ZWdvcnlQcmVmaXggPSAnQWx3YXlzICc7XG5cdH1cblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbi5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgcG9zaXRpb24uc2xpY2UoIDEgKTtcblx0XHRjYXRlZ29yeVN1ZmZpeCA9ICcgLSAnICsgcG9zaXRpb247XG5cdH1cblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeVByZWZpeCArICdTaG93IENvbW1lbnRzJyArIGNhdGVnb3J5U3VmZml4LCBhY3Rpb24sIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59XG5cbi8vIHdoZW4gc2hvd2luZyBjb21tZW50cyBvbmNlLCBhbGxvdyBpdCB0byBiZSBhbiBhbmFseXRpY3MgZXZlbnRcbmNvbnN0IHNob3dDb21tZW50c0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1idXR0b24tc2hvdy1jb21tZW50cycgKTtcbmlmIChzaG93Q29tbWVudHNCdXR0b24pIHtcblx0c2hvd0NvbW1lbnRzQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblx0XHR0cmFja1Nob3dDb21tZW50cyggZmFsc2UsICcnLCAnJyApO1xuXHR9ICk7XG59XG5cbi8vIFNldCB1c2VyIG1ldGEgdmFsdWUgZm9yIGFsd2F5cyBzaG93aW5nIGNvbW1lbnRzIGlmIHRoYXQgYnV0dG9uIGlzIGNsaWNrZWQuIHRoaXMgdXNlcyBqcXVlcnkuXG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dmFyIHRoYXQgPSAkKCB0aGlzICk7XG5cdGlmICggdGhhdC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0fSBlbHNlIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHR9XG5cblx0Ly8gdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCB0cnVlLCB0aGF0LmF0dHIoICdpZCcgKSwgdGhhdC52YWwoKSApO1xuXG5cdC8vIHdlIGFscmVhZHkgaGF2ZSBhamF4dXJsIGZyb20gdGhlIHRoZW1lXG5cdCQuYWpheCgge1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHR1cmw6IHBhcmFtcy5hamF4dXJsLFxuXHRcdGRhdGE6IHtcblx0XHRcdCdhY3Rpb24nOiAnbWlubnBvc3RfbGFyZ29fbG9hZF9jb21tZW50c19zZXRfdXNlcl9tZXRhJyxcblx0XHRcdCd2YWx1ZSc6IHRoYXQudmFsKClcblx0XHR9LFxuXHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdCQoICcuYS1hbHdheXMtc2hvdy1jb21tZW50cy1yZXN1bHQnLCB0aGF0LnBhcmVudCgpICkuaHRtbCggcmVzcG9uc2UuZGF0YS5tZXNzYWdlICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IHJlc3BvbnNlLmRhdGEuc2hvdyApIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufSApO1xuXG4vLyB0aGlzIHVzZXMganF1ZXJ5LlxuISAoIGZ1bmN0aW9uKCBkICkge1xuXHRpZiAoICEgZC5jdXJyZW50U2NyaXB0ICkge1xuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0YWN0aW9uOiAnbGxjX2xvYWRfY29tbWVudHMnLFxuXHRcdFx0cG9zdDogJCggJyNsbGNfcG9zdF9pZCcgKS52YWwoKVxuXHRcdH07XG5cblx0XHQvLyBBamF4IHJlcXVlc3QgbGluay5cblx0XHR2YXIgbGxjYWpheHVybCA9ICQoICcjbGxjX2FqYXhfdXJsJyApLnZhbCgpO1xuXG5cdFx0Ly8gRnVsbCB1cmwgdG8gZ2V0IGNvbW1lbnRzIChBZGRpbmcgcGFyYW1ldGVycykuXG5cdFx0dmFyIGNvbW1lbnRVcmwgPSBsbGNhamF4dXJsICsgJz8nICsgJC5wYXJhbSggZGF0YSApO1xuXG5cdFx0Ly8gUGVyZm9ybSBhamF4IHJlcXVlc3QuXG5cdFx0JC5nZXQoIGNvbW1lbnRVcmwsIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdGlmICggJycgIT09IHJlc3BvbnNlICkge1xuXHRcdFx0XHQkKCAnI2xsY19jb21tZW50cycgKS5odG1sKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgY29tbWVudHMgYWZ0ZXIgbGF6eSBsb2FkaW5nLlxuXHRcdFx0XHRpZiAoIHdpbmRvdy5hZGRDb21tZW50ICYmIHdpbmRvdy5hZGRDb21tZW50LmluaXQgKSB7XG5cdFx0XHRcdFx0d2luZG93LmFkZENvbW1lbnQuaW5pdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gR2V0IHRoZSBjb21tZW50IGxpIGlkIGZyb20gdXJsIGlmIGV4aXN0LlxuXHRcdFx0XHR2YXIgY29tbWVudElkID0gZG9jdW1lbnQuVVJMLnN1YnN0ciggZG9jdW1lbnQuVVJMLmluZGV4T2YoICcjY29tbWVudCcgKSApO1xuXG5cdFx0XHRcdC8vIElmIGNvbW1lbnQgaWQgZm91bmQsIHNjcm9sbCB0byB0aGF0IGNvbW1lbnQuXG5cdFx0XHRcdGlmICggLTEgPCBjb21tZW50SWQuaW5kZXhPZiggJyNjb21tZW50JyApICkge1xuXHRcdFx0XHRcdCQoIHdpbmRvdyApLnNjcm9sbFRvcCggJCggY29tbWVudElkICkub2Zmc2V0KCkudG9wICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cbn0oIGRvY3VtZW50ICkgKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgZXZlbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG5jb25zdCB0YXJnZXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5hLWV2ZW50cy1jYWwtbGlua3MnICk7XG50YXJnZXRzLmZvckVhY2goIGZ1bmN0aW9uKCB0YXJnZXQgKSB7XG4gICAgc2V0Q2FsZW5kYXIoIHRhcmdldCApO1xufSApO1xuXG5mdW5jdGlvbiBzZXRDYWxlbmRhciggdGFyZ2V0ICkge1xuICAgIGlmICggbnVsbCAhPT0gdGFyZ2V0ICkge1xuICAgICAgICB2YXIgbGkgICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2xpJyApO1xuICAgICAgICBsaS5pbm5lckhUTUwgID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLWNhbGVuZGFyXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG4gICAgICAgIHZhciBmcmFnbWVudCAgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGxpLnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggbGkgKTtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xuICAgIH1cbn1cblxuY29uc3QgY2FsZW5kYXJzVmlzaWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1ldmVudC1kYXRldGltZSBhJyApO1xuY2FsZW5kYXJzVmlzaWJsZS5mb3JFYWNoKCBmdW5jdGlvbiggY2FsZW5kYXJWaXNpYmxlICkge1xuICAgIHNob3dDYWxlbmRhciggY2FsZW5kYXJWaXNpYmxlICk7XG59ICk7XG5cbmZ1bmN0aW9uIHNob3dDYWxlbmRhciggY2FsZW5kYXJWaXNpYmxlICkge1xuICAgIGNvbnN0IGRhdGVIb2xkZXIgPSBjYWxlbmRhclZpc2libGUuY2xvc2VzdCggJy5tLWV2ZW50LWRhdGUtYW5kLWNhbGVuZGFyJyApO1xuICAgIGNvbnN0IGNhbGVuZGFyVHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcbiAgICAgICAgZWxlbWVudDogZGF0ZUhvbGRlci5xdWVyeVNlbGVjdG9yKCAnLmEtZXZlbnRzLWNhbC1saW5rcycgKSxcbiAgICAgICAgdmlzaWJsZUNsYXNzOiAnYS1ldmVudHMtY2FsLWxpbmstdmlzaWJsZScsXG4gICAgICAgIGRpc3BsYXlWYWx1ZTogJ2Jsb2NrJ1xuICAgIH0gKTtcblxuICAgIGlmICggbnVsbCAhPT0gY2FsZW5kYXJWaXNpYmxlICkge1xuICAgICAgICBjYWxlbmRhclZpc2libGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IGNhbGVuZGFyVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuICAgICAgICAgICAgY2FsZW5kYXJWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgICAgICAgICBpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKTtcblxuICAgICAgICB2YXIgY2FsZW5kYXJDbG9zZSA9IGRhdGVIb2xkZXIucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLWNhbGVuZGFyJyApO1xuICAgICAgICBpZiAoIG51bGwgIT09IGNhbGVuZGFyQ2xvc2UgKSB7XG4gICAgICAgICAgICBjYWxlbmRhckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IGNhbGVuZGFyVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICAgICAgICAgIGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
}(jQuery));
