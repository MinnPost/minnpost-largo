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
  //wp.hooks.addAction( 'wpMessageInserterDataLayerEvent', 'minnpostLargo', mpDataLayerEvent, 10 );
  wp.hooks.addAction('minnpostFormProcessorMailchimpDataLayerEvent', 'minnpostLargo', mpDataLayerEvent, 10);
  //wp.hooks.addAction( 'minnpostMembershipDataLayerEvent', 'minnpostLargo', mpDataLayerEvent, 10 );
  //wp.hooks.addAction( 'minnpostMembershipDataLayerEcommerceAction', 'minnpostLargo', mpDataLayerEcommerce, 10 );
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
 * dataLayer: the object that should be added
*/
function mpDataLayerEvent(dataLayer) {
  if (typeof window.dataLayer !== 'undefined') {
    window.dataLayer.push(dataLayer);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDQtdmFsaWQtZm9ybS5taW4uanMiLCIwMC1zdGFydC5qcyIsIjAxLWFuYWx5dGljcy5qcyIsIjAyLXNoYXJlLmpzIiwiMDMtbmF2aWdhdGlvbi5qcyIsIjA0LWZvcm1zLmpzIiwiMDUtY29tbWVudHMuanMiLCIwNi1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImMiLCJyZXF1aXJlIiwidSIsImNvZGUiLCJwIiwiY2FsbCIsIl92YWxpZEZvcm0iLCJfdmFsaWRGb3JtMiIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIlZhbGlkRm9ybSIsInRvZ2dsZUludmFsaWRDbGFzcyIsImhhbmRsZUN1c3RvbU1lc3NhZ2VzIiwiaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiY2xvbmUiLCJkZWZhdWx0cyIsImluc2VydEFmdGVyIiwiaW5zZXJ0QmVmb3JlIiwiZm9yRWFjaCIsImRlYm91bmNlIiwiY29weSIsImF0dHIiLCJoYXNPd25Qcm9wZXJ0eSIsImRlZmF1bHRPYmplY3QiLCJrIiwicmVmTm9kZSIsIm5vZGVUb0luc2VydCIsInNpYmxpbmciLCJuZXh0U2libGluZyIsIl9wYXJlbnQiLCJwYXJlbnQiLCJpdGVtcyIsImZuIiwibXMiLCJkZWJvdW5jZWRGbiIsInZhbGlkRm9ybSIsIl91dGlsIiwiaW5wdXQiLCJpbnZhbGlkQ2xhc3MiLCJ2YWxpZGl0eSIsInZhbGlkIiwiZXJyb3JQcm9wcyIsImdldEN1c3RvbU1lc3NhZ2UiLCJjdXN0b21NZXNzYWdlcyIsImxvY2FsRXJyb3JQcm9wcyIsInR5cGUiLCJjb25jYXQiLCJwcm9wIiwiY2hlY2tWYWxpZGl0eSIsIm1lc3NhZ2UiLCJzZXRDdXN0b21WYWxpZGl0eSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uRXJyb3JDbGFzcyIsInZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzIiwiZXJyb3JQbGFjZW1lbnQiLCJpbnNlcnRFcnJvciIsImVycm9yTm9kZSIsInZhbGlkYXRpb25NZXNzYWdlIiwidGV4dENvbnRlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImRlZmF1bHRPcHRpb25zIiwibm9kZU5hbWUiLCJpbnB1dHMiLCJ0b0xvd2VyQ2FzZSIsImZvY3VzSW52YWxpZElucHV0IiwidmFsaWRGb3JtSW5wdXRzIiwiZm9ybSIsImZvY3VzRmlyc3QiLCJpbnZhbGlkTm9kZSIsImZvY3VzIiwiZG9jdW1lbnRFbGVtZW50Iiwid3AiLCJob29rcyIsImFkZEFjdGlvbiIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFY29tbWVyY2VBY3Rpb24iLCJtcERhdGFMYXllckV2ZW50IiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsIm5vbl9pbnRlcmFjdGlvbiIsImRvQWN0aW9uIiwiZGF0YUxheWVyIiwicHVzaCIsInByb2R1Y3QiLCJzdGVwIiwiZXZlbnQiLCJtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEiLCJ1cmxfYWNjZXNzX2xldmVsIiwibG9jYXRpb24iLCJwYXRobmFtZSIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwidG9wQnV0dG9uIiwiY3VycmVudFRhcmdldCIsInByaW50QnV0dG9uIiwicHJpbnQiLCJyZXB1Ymxpc2hCdXR0b24iLCJjb3B5QnV0dG9uIiwiY29weVRleHQiLCJocmVmIiwibmF2aWdhdG9yIiwiY2xpcGJvYXJkIiwid3JpdGVUZXh0IiwidGhlbiIsImFueVNoYXJlQnV0dG9uIiwidXJsIiwib3BlbiIsInNldHVwUHJpbWFyeU5hdiIsInByaW1hcnlOYXZUcmFuc2l0aW9uZXIiLCJwcmltYXJ5TmF2VG9nZ2xlIiwiZXhwYW5kZWQiLCJ1c2VyTmF2VHJhbnNpdGlvbmVyIiwidXNlck5hdlRvZ2dsZSIsImRpdiIsImZyYWdtZW50IiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsInNlYXJjaFRyYW5zaXRpb25lciIsInNlYXJjaFZpc2libGUiLCJzZWFyY2hDbG9zZSIsIm9ua2V5ZG93biIsImV2dCIsImlzRXNjYXBlIiwia2V5Iiwia2V5Q29kZSIsInByaW1hcnlOYXZFeHBhbmRlZCIsInVzZXJOYXZFeHBhbmRlZCIsInNlYXJjaElzVmlzaWJsZSIsInNldHVwU2Nyb2xsTmF2Iiwic3ViTmF2U2Nyb2xsZXJzIiwiY3VycmVudFZhbHVlIiwicGFnaW5hdGlvblNjcm9sbGVycyIsIiQiLCJjbGljayIsIndpZGdldFRpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJ6b25lVGl0bGUiLCJzaWRlYmFyU2VjdGlvblRpdGxlIiwialF1ZXJ5IiwidGV4dE5vZGVzIiwiY29udGVudHMiLCJmaWx0ZXIiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJub2RlVmFsdWUiLCJ0cmltIiwiZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCIsIm1hcmt1cCIsIm1hbmFnZUVtYWlscyIsInJlc3RSb290IiwidXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdCIsInNpdGVfdXJsIiwicmVzdF9uYW1lc3BhY2UiLCJmdWxsVXJsIiwiY29uZmlybUNoYW5nZSIsIm5leHRFbWFpbENvdW50IiwibmV3UHJpbWFyeUVtYWlsIiwib2xkUHJpbWFyeUVtYWlsIiwicHJpbWFyeUlkIiwiZW1haWxUb1JlbW92ZSIsImNvbnNvbGlkYXRlZEVtYWlscyIsIm5ld0VtYWlscyIsImFqYXhGb3JtRGF0YSIsInRoYXQiLCJvbiIsInZhbCIsInJlcGxhY2UiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJnZXQiLCJwYXJlbnRzIiwiZmFkZU91dCIsImpvaW4iLCJiZWZvcmUiLCJidXR0b24iLCJidXR0b25Gb3JtIiwiZGF0YSIsInN1Ym1pdHRpbmdCdXR0b24iLCJzZXJpYWxpemUiLCJhamF4IiwiYmVmb3JlU2VuZCIsInhociIsInNldFJlcXVlc3RIZWFkZXIiLCJub25jZSIsImRhdGFUeXBlIiwiZG9uZSIsIm1hcCIsImluZGV4IiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicmVsb2FkIiwiYWRkQXV0b1Jlc2l6ZSIsImJveFNpemluZyIsIm9mZnNldCIsImNsaWVudEhlaWdodCIsImhlaWdodCIsInNjcm9sbEhlaWdodCIsImFqYXhTdG9wIiwiY29tbWVudEFyZWEiLCJhdXRvUmVzaXplVGV4dGFyZWEiLCJmb3JtcyIsImZpcnN0X2hvbGRlciIsImVsZW1lbnRPZmZzZXQiLCJwYWdlT2Zmc2V0IiwicGFnZVlPZmZzZXQiLCJzY3JvbGxUb3AiLCJ0cmFja1Nob3dDb21tZW50cyIsImFsd2F5cyIsImlkIiwiY2xpY2tWYWx1ZSIsImNhdGVnb3J5UHJlZml4IiwiY2F0ZWdvcnlTdWZmaXgiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiaXMiLCJwYXJhbXMiLCJhamF4dXJsIiwic3VjY2VzcyIsInJlc3BvbnNlIiwiaHRtbCIsImN1cnJlbnRTY3JpcHQiLCJwb3N0IiwibGxjYWpheHVybCIsImNvbW1lbnRVcmwiLCJwYXJhbSIsImFkZENvbW1lbnQiLCJjb21tZW50SWQiLCJVUkwiLCJzdWJzdHIiLCJpbmRleE9mIiwidGFyZ2V0cyIsInNldENhbGVuZGFyIiwibGkiLCJjYWxlbmRhcnNWaXNpYmxlIiwiY2FsZW5kYXJWaXNpYmxlIiwic2hvd0NhbGVuZGFyIiwiZGF0ZUhvbGRlciIsImNhbGVuZGFyVHJhbnNpdGlvbmVyIiwiY2FsZW5kYXJDbG9zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxLQUFLLENBQUNDLENBQUMsRUFBQztFQUFDQyxRQUFRLENBQUNDLGdCQUFnQixDQUFDLFdBQVcsRUFBQyxVQUFTQyxDQUFDLEVBQUM7SUFBQyxJQUFJ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QSxlQUFlLENBQUM3WCxnQkFBZ0IsQ0FBRSxPQUFPLEVBQUUsVUFBVUMsQ0FBQyxFQUFHO01BQ3JEQSxDQUFDLENBQUNtTSxjQUFjLEVBQUU7TUFDbEIsSUFBSXVELFFBQVEsR0FBRyxNQUFNLEtBQUtrSSxlQUFlLENBQUNsVyxZQUFZLENBQUUsZUFBZSxDQUFFLElBQUksS0FBSztNQUNsRmtXLGVBQWUsQ0FBQ3hWLFlBQVksQ0FBRSxlQUFlLEVBQUUsQ0FBRXNOLFFBQVEsQ0FBRTtNQUMzRCxJQUFLLElBQUksS0FBS0EsUUFBUSxFQUFHO1FBQ3JCcUksb0JBQW9CLENBQUM5VCxjQUFjLEVBQUU7TUFDekMsQ0FBQyxNQUFNO1FBQ0g4VCxvQkFBb0IsQ0FBQ25VLGNBQWMsRUFBRTtNQUN6QztJQUNKLENBQUMsQ0FBRTtJQUVILElBQUlvVSxhQUFhLEdBQUdGLFVBQVUsQ0FBQzVTLGFBQWEsQ0FBRSxtQkFBbUIsQ0FBRTtJQUNuRSxJQUFLLElBQUksS0FBSzhTLGFBQWEsRUFBRztNQUMxQkEsYUFBYSxDQUFDalksZ0JBQWdCLENBQUUsT0FBTyxFQUFFLFVBQVVDLENBQUMsRUFBRztRQUNuREEsQ0FBQyxDQUFDbU0sY0FBYyxFQUFFO1FBQ2xCLElBQUl1RCxRQUFRLEdBQUcsTUFBTSxLQUFLa0ksZUFBZSxDQUFDbFcsWUFBWSxDQUFFLGVBQWUsQ0FBRSxJQUFJLEtBQUs7UUFDbEZrVyxlQUFlLENBQUN4VixZQUFZLENBQUUsZUFBZSxFQUFFLENBQUVzTixRQUFRLENBQUU7UUFDM0QsSUFBSyxJQUFJLEtBQUtBLFFBQVEsRUFBRztVQUNyQnFJLG9CQUFvQixDQUFDOVQsY0FBYyxFQUFFO1FBQ3pDLENBQUMsTUFBTTtVQUNIOFQsb0JBQW9CLENBQUNuVSxjQUFjLEVBQUU7UUFDekM7TUFDSixDQUFDLENBQUU7SUFDUDtFQUNKO0FBQ0oiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB0bGl0ZSh0KXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZSl7dmFyIGk9ZS50YXJnZXQsbj10KGkpO258fChuPShpPWkucGFyZW50RWxlbWVudCkmJnQoaSkpLG4mJnRsaXRlLnNob3coaSxuLCEwKX0pfXRsaXRlLnNob3c9ZnVuY3Rpb24odCxlLGkpe3ZhciBuPVwiZGF0YS10bGl0ZVwiO2U9ZXx8e30sKHQudG9vbHRpcHx8ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiBvKCl7dGxpdGUuaGlkZSh0LCEwKX1mdW5jdGlvbiBsKCl7cnx8KHI9ZnVuY3Rpb24odCxlLGkpe2Z1bmN0aW9uIG4oKXtvLmNsYXNzTmFtZT1cInRsaXRlIHRsaXRlLVwiK3Irczt2YXIgZT10Lm9mZnNldFRvcCxpPXQub2Zmc2V0TGVmdDtvLm9mZnNldFBhcmVudD09PXQmJihlPWk9MCk7dmFyIG49dC5vZmZzZXRXaWR0aCxsPXQub2Zmc2V0SGVpZ2h0LGQ9by5vZmZzZXRIZWlnaHQsZj1vLm9mZnNldFdpZHRoLGE9aStuLzI7by5zdHlsZS50b3A9KFwic1wiPT09cj9lLWQtMTA6XCJuXCI9PT1yP2UrbCsxMDplK2wvMi1kLzIpK1wicHhcIixvLnN0eWxlLmxlZnQ9KFwid1wiPT09cz9pOlwiZVwiPT09cz9pK24tZjpcIndcIj09PXI/aStuKzEwOlwiZVwiPT09cj9pLWYtMTA6YS1mLzIpK1wicHhcIn12YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxsPWkuZ3Jhdnx8dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRsaXRlXCIpfHxcIm5cIjtvLmlubmVySFRNTD1lLHQuYXBwZW5kQ2hpbGQobyk7dmFyIHI9bFswXXx8XCJcIixzPWxbMV18fFwiXCI7bigpO3ZhciBkPW8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuXCJzXCI9PT1yJiZkLnRvcDwwPyhyPVwiblwiLG4oKSk6XCJuXCI9PT1yJiZkLmJvdHRvbT53aW5kb3cuaW5uZXJIZWlnaHQ/KHI9XCJzXCIsbigpKTpcImVcIj09PXImJmQubGVmdDwwPyhyPVwid1wiLG4oKSk6XCJ3XCI9PT1yJiZkLnJpZ2h0PndpbmRvdy5pbm5lcldpZHRoJiYocj1cImVcIixuKCkpLG8uY2xhc3NOYW1lKz1cIiB0bGl0ZS12aXNpYmxlXCIsb30odCxkLGUpKX12YXIgcixzLGQ7cmV0dXJuIHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLG8pLHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIixvKSx0LnRvb2x0aXA9e3Nob3c6ZnVuY3Rpb24oKXtkPXQudGl0bGV8fHQuZ2V0QXR0cmlidXRlKG4pfHxkLHQudGl0bGU9XCJcIix0LnNldEF0dHJpYnV0ZShuLFwiXCIpLGQmJiFzJiYocz1zZXRUaW1lb3V0KGwsaT8xNTA6MSkpfSxoaWRlOmZ1bmN0aW9uKHQpe2lmKGk9PT10KXtzPWNsZWFyVGltZW91dChzKTt2YXIgZT1yJiZyLnBhcmVudE5vZGU7ZSYmZS5yZW1vdmVDaGlsZChyKSxyPXZvaWQgMH19fX0odCxlKSkuc2hvdygpfSx0bGl0ZS5oaWRlPWZ1bmN0aW9uKHQsZSl7dC50b29sdGlwJiZ0LnRvb2x0aXAuaGlkZShlKX0sXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz10bGl0ZSk7IiwiLyoqIFxuICogTGlicmFyeSBjb2RlXG4gKiBVc2luZyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9AY2xvdWRmb3VyL3RyYW5zaXRpb24taGlkZGVuLWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCh7XG4gIGVsZW1lbnQsXG4gIHZpc2libGVDbGFzcyxcbiAgd2FpdE1vZGUgPSAndHJhbnNpdGlvbmVuZCcsXG4gIHRpbWVvdXREdXJhdGlvbixcbiAgaGlkZU1vZGUgPSAnaGlkZGVuJyxcbiAgZGlzcGxheVZhbHVlID0gJ2Jsb2NrJ1xufSkge1xuICBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0JyAmJiB0eXBlb2YgdGltZW91dER1cmF0aW9uICE9PSAnbnVtYmVyJykge1xuICAgIGNvbnNvbGUuZXJyb3IoYFxuICAgICAgV2hlbiBjYWxsaW5nIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50IHdpdGggd2FpdE1vZGUgc2V0IHRvIHRpbWVvdXQsXG4gICAgICB5b3UgbXVzdCBwYXNzIGluIGEgbnVtYmVyIGZvciB0aW1lb3V0RHVyYXRpb24uXG4gICAgYCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEb24ndCB3YWl0IGZvciBleGl0IHRyYW5zaXRpb25zIGlmIGEgdXNlciBwcmVmZXJzIHJlZHVjZWQgbW90aW9uLlxuICAvLyBJZGVhbGx5IHRyYW5zaXRpb25zIHdpbGwgYmUgZGlzYWJsZWQgaW4gQ1NTLCB3aGljaCBtZWFucyB3ZSBzaG91bGQgbm90IHdhaXRcbiAgLy8gYmVmb3JlIGFkZGluZyBgaGlkZGVuYC5cbiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKScpLm1hdGNoZXMpIHtcbiAgICB3YWl0TW9kZSA9ICdpbW1lZGlhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGxpc3RlbmVyIHRvIGFkZCBgaGlkZGVuYCBhZnRlciBvdXIgYW5pbWF0aW9ucyBjb21wbGV0ZS5cbiAgICogVGhpcyBsaXN0ZW5lciB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgY29tcGxldGluZy5cbiAgICovXG4gIGNvbnN0IGxpc3RlbmVyID0gZSA9PiB7XG4gICAgLy8gQ29uZmlybSBgdHJhbnNpdGlvbmVuZGAgd2FzIGNhbGxlZCBvbiAgb3VyIGBlbGVtZW50YCBhbmQgZGlkbid0IGJ1YmJsZVxuICAgIC8vIHVwIGZyb20gYSBjaGlsZCBlbGVtZW50LlxuICAgIGlmIChlLnRhcmdldCA9PT0gZWxlbWVudCkge1xuICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheVZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvblNob3coKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgbGlzdGVuZXIgc2hvdWxkbid0IGJlIGhlcmUgYnV0IGlmIHNvbWVvbmUgc3BhbXMgdGhlIHRvZ2dsZVxuICAgICAgICogb3ZlciBhbmQgb3ZlciByZWFsbHkgZmFzdCBpdCBjYW4gaW5jb3JyZWN0bHkgc3RpY2sgYXJvdW5kLlxuICAgICAgICogV2UgcmVtb3ZlIGl0IGp1c3QgdG8gYmUgc2FmZS5cbiAgICAgICAqL1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFNpbWlsYXJseSwgd2UnbGwgY2xlYXIgdGhlIHRpbWVvdXQgaW4gY2FzZSBpdCdzIHN0aWxsIGhhbmdpbmcgYXJvdW5kLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIC8qKlxuICAgICAgICogRm9yY2UgYSBicm93c2VyIHJlLXBhaW50IHNvIHRoZSBicm93c2VyIHdpbGwgcmVhbGl6ZSB0aGVcbiAgICAgICAqIGVsZW1lbnQgaXMgbm8gbG9uZ2VyIGBoaWRkZW5gIGFuZCBhbGxvdyB0cmFuc2l0aW9ucy5cbiAgICAgICAqL1xuICAgICAgY29uc3QgcmVmbG93ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIaWRlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvbkhpZGUoKSB7XG4gICAgICBpZiAod2FpdE1vZGUgPT09ICd0cmFuc2l0aW9uZW5kJykge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgICB9IGVsc2UgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICAgIH0sIHRpbWVvdXREdXJhdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoaXMgY2xhc3MgdG8gdHJpZ2dlciBvdXIgYW5pbWF0aW9uXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSBlbGVtZW50J3MgdmlzaWJpbGl0eVxuICAgICAqL1xuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUZWxsIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaGlkZGVuIG9yIG5vdC5cbiAgICAgKi9cbiAgICBpc0hpZGRlbigpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGhpZGRlbiBhdHRyaWJ1dGUgZG9lcyBub3QgcmVxdWlyZSBhIHZhbHVlLiBTaW5jZSBhbiBlbXB0eSBzdHJpbmcgaXNcbiAgICAgICAqIGZhbHN5LCBidXQgc2hvd3MgdGhlIHByZXNlbmNlIG9mIGFuIGF0dHJpYnV0ZSB3ZSBjb21wYXJlIHRvIGBudWxsYFxuICAgICAgICovXG4gICAgICBjb25zdCBoYXNIaWRkZW5BdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaGlkZGVuJykgIT09IG51bGw7XG5cbiAgICAgIGNvbnN0IGlzRGlzcGxheU5vbmUgPSBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJztcblxuICAgICAgY29uc3QgaGFzVmlzaWJsZUNsYXNzID0gWy4uLmVsZW1lbnQuY2xhc3NMaXN0XS5pbmNsdWRlcyh2aXNpYmxlQ2xhc3MpO1xuXG4gICAgICByZXR1cm4gaGFzSGlkZGVuQXR0cmlidXRlIHx8IGlzRGlzcGxheU5vbmUgfHwgIWhhc1Zpc2libGVDbGFzcztcbiAgICB9LFxuXG4gICAgLy8gQSBwbGFjZWhvbGRlciBmb3Igb3VyIGB0aW1lb3V0YFxuICAgIHRpbWVvdXQ6IG51bGxcbiAgfTtcbn0iLCIvKipcbiAgUHJpb3JpdHkrIGhvcml6b250YWwgc2Nyb2xsaW5nIG1lbnUuXG5cbiAgQHBhcmFtIHtPYmplY3R9IG9iamVjdCAtIENvbnRhaW5lciBmb3IgYWxsIG9wdGlvbnMuXG4gICAgQHBhcmFtIHtzdHJpbmcgfHwgRE9NIG5vZGV9IHNlbGVjdG9yIC0gRWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gbmF2U2VsZWN0b3IgLSBOYXYgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gY29udGVudFNlbGVjdG9yIC0gQ29udGVudCBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBpdGVtU2VsZWN0b3IgLSBJdGVtcyBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uTGVmdFNlbGVjdG9yIC0gTGVmdCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvblJpZ2h0U2VsZWN0b3IgLSBSaWdodCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtpbnRlZ2VyIHx8IHN0cmluZ30gc2Nyb2xsU3RlcCAtIEFtb3VudCB0byBzY3JvbGwgb24gYnV0dG9uIGNsaWNrLiAnYXZlcmFnZScgZ2V0cyB0aGUgYXZlcmFnZSBsaW5rIHdpZHRoLlxuKi9cblxuY29uc3QgUHJpb3JpdHlOYXZTY3JvbGxlciA9IGZ1bmN0aW9uKHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlcicsXG4gICAgbmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItbmF2JyxcbiAgICBjb250ZW50U2VsZWN0b3I6IGNvbnRlbnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWNvbnRlbnQnLFxuICAgIGl0ZW1TZWxlY3RvcjogaXRlbVNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItaXRlbScsXG4gICAgYnV0dG9uTGVmdFNlbGVjdG9yOiBidXR0b25MZWZ0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuICAgIGJ1dHRvblJpZ2h0U2VsZWN0b3I6IGJ1dHRvblJpZ2h0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0JyxcbiAgICBzY3JvbGxTdGVwOiBzY3JvbGxTdGVwID0gODBcbiAgfSA9IHt9KSB7XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXIgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiBzZWxlY3RvcjtcblxuICBjb25zdCB2YWxpZGF0ZVNjcm9sbFN0ZXAgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIoc2Nyb2xsU3RlcCkgfHwgc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnO1xuICB9XG5cbiAgaWYgKG5hdlNjcm9sbGVyID09PSB1bmRlZmluZWQgfHwgbmF2U2Nyb2xsZXIgPT09IG51bGwgfHwgIXZhbGlkYXRlU2Nyb2xsU3RlcCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGVyZSBpcyBzb21ldGhpbmcgd3JvbmcsIGNoZWNrIHlvdXIgb3B0aW9ucy4nKTtcbiAgfVxuXG4gIGNvbnN0IG5hdlNjcm9sbGVyTmF2ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihuYXZTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoY29udGVudFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMgPSBuYXZTY3JvbGxlckNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChpdGVtU2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckxlZnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvbkxlZnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyUmlnaHQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvblJpZ2h0U2VsZWN0b3IpO1xuXG4gIGxldCBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZUxlZnQgPSAwO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSAwO1xuICBsZXQgc2Nyb2xsaW5nRGlyZWN0aW9uID0gJyc7XG4gIGxldCBzY3JvbGxPdmVyZmxvdyA9ICcnO1xuICBsZXQgdGltZW91dDtcblxuXG4gIC8vIFNldHMgb3ZlcmZsb3cgYW5kIHRvZ2dsZSBidXR0b25zIGFjY29yZGluZ2x5XG4gIGNvbnN0IHNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgc2Nyb2xsT3ZlcmZsb3cgPSBnZXRPdmVyZmxvdygpO1xuICAgIHRvZ2dsZUJ1dHRvbnMoc2Nyb2xsT3ZlcmZsb3cpO1xuICAgIGNhbGN1bGF0ZVNjcm9sbFN0ZXAoKTtcbiAgfVxuXG5cbiAgLy8gRGVib3VuY2Ugc2V0dGluZyB0aGUgb3ZlcmZsb3cgd2l0aCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgY29uc3QgcmVxdWVzdFNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVvdXQpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aW1lb3V0KTtcblxuICAgIHRpbWVvdXQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHNldE92ZXJmbG93KCk7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8vIEdldHMgdGhlIG92ZXJmbG93IGF2YWlsYWJsZSBvbiB0aGUgbmF2IHNjcm9sbGVyXG4gIGNvbnN0IGdldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNjcm9sbFdpZHRoID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGg7XG4gICAgbGV0IHNjcm9sbFZpZXdwb3J0ID0gbmF2U2Nyb2xsZXJOYXYuY2xpZW50V2lkdGg7XG4gICAgbGV0IHNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0O1xuXG4gICAgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSBzY3JvbGxXaWR0aCAtIChzY3JvbGxWaWV3cG9ydCArIHNjcm9sbExlZnQpO1xuXG4gICAgLy8gMSBpbnN0ZWFkIG9mIDAgdG8gY29tcGVuc2F0ZSBmb3IgbnVtYmVyIHJvdW5kaW5nXG4gICAgbGV0IHNjcm9sbExlZnRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVMZWZ0ID4gMTtcbiAgICBsZXQgc2Nyb2xsUmlnaHRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVSaWdodCA+IDE7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhzY3JvbGxXaWR0aCwgc2Nyb2xsVmlld3BvcnQsIHNjcm9sbEF2YWlsYWJsZUxlZnQsIHNjcm9sbEF2YWlsYWJsZVJpZ2h0KTtcblxuICAgIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uICYmIHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2JvdGgnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2xlZnQnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuICdub25lJztcbiAgICB9XG5cbiAgfVxuXG5cbiAgLy8gQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHN0ZXAgYmFzZWQgb24gdGhlIHdpZHRoIG9mIHRoZSBzY3JvbGxlciBhbmQgdGhlIG51bWJlciBvZiBsaW5rc1xuICBjb25zdCBjYWxjdWxhdGVTY3JvbGxTdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJykge1xuICAgICAgbGV0IHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGggLSAocGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctbGVmdCcpKSArIHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpKTtcblxuICAgICAgbGV0IHNjcm9sbFN0ZXBBdmVyYWdlID0gTWF0aC5mbG9vcihzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyAvIG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zLmxlbmd0aCk7XG5cbiAgICAgIHNjcm9sbFN0ZXAgPSBzY3JvbGxTdGVwQXZlcmFnZTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIE1vdmUgdGhlIHNjcm9sbGVyIHdpdGggYSB0cmFuc2Zvcm1cbiAgY29uc3QgbW92ZVNjcm9sbGVyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG5cbiAgICBpZiAoc2Nyb2xsaW5nID09PSB0cnVlIHx8IChzY3JvbGxPdmVyZmxvdyAhPT0gZGlyZWN0aW9uICYmIHNjcm9sbE92ZXJmbG93ICE9PSAnYm90aCcpKSByZXR1cm47XG5cbiAgICBsZXQgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxTdGVwO1xuICAgIGxldCBzY3JvbGxBdmFpbGFibGUgPSBkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IHNjcm9sbEF2YWlsYWJsZUxlZnQgOiBzY3JvbGxBdmFpbGFibGVSaWdodDtcblxuICAgIC8vIElmIHRoZXJlIHdpbGwgYmUgbGVzcyB0aGFuIDI1JSBvZiB0aGUgbGFzdCBzdGVwIHZpc2libGUgdGhlbiBzY3JvbGwgdG8gdGhlIGVuZFxuICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCAoc2Nyb2xsU3RlcCAqIDEuNzUpKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbEF2YWlsYWJsZTtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSAqPSAtMTtcblxuICAgICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IHNjcm9sbFN0ZXApIHtcbiAgICAgICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NuYXAtYWxpZ24tZW5kJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIHNjcm9sbERpc3RhbmNlICsgJ3B4KSc7XG5cbiAgICBzY3JvbGxpbmdEaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgc2Nyb2xsaW5nID0gdHJ1ZTtcbiAgfVxuXG5cbiAgLy8gU2V0IHRoZSBzY3JvbGxlciBwb3NpdGlvbiBhbmQgcmVtb3ZlcyB0cmFuc2Zvcm0sIGNhbGxlZCBhZnRlciBtb3ZlU2Nyb2xsZXIoKSBpbiB0aGUgdHJhbnNpdGlvbmVuZCBldmVudFxuICBjb25zdCBzZXRTY3JvbGxlclBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50LCBudWxsKTtcbiAgICB2YXIgdHJhbnNmb3JtID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJyk7XG4gICAgdmFyIHRyYW5zZm9ybVZhbHVlID0gTWF0aC5hYnMocGFyc2VJbnQodHJhbnNmb3JtLnNwbGl0KCcsJylbNF0pIHx8IDApO1xuXG4gICAgaWYgKHNjcm9sbGluZ0RpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICB0cmFuc2Zvcm1WYWx1ZSAqPSAtMTtcbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbiAgICBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCArIHRyYW5zZm9ybVZhbHVlO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJywgJ3NuYXAtYWxpZ24tZW5kJyk7XG5cbiAgICBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgfVxuXG5cbiAgLy8gVG9nZ2xlIGJ1dHRvbnMgZGVwZW5kaW5nIG9uIG92ZXJmbG93XG4gIGNvbnN0IHRvZ2dsZUJ1dHRvbnMgPSBmdW5jdGlvbihvdmVyZmxvdykge1xuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAnbGVmdCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdyaWdodCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH1cblxuXG4gIGNvbnN0IGluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgIHNldE92ZXJmbG93KCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlck5hdi5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgc2V0U2Nyb2xsZXJQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJMZWZ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdsZWZ0Jyk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlclJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdyaWdodCcpO1xuICAgIH0pO1xuXG4gIH07XG5cblxuICAvLyBTZWxmIGluaXRcbiAgaW5pdCgpO1xuXG5cbiAgLy8gUmV2ZWFsIEFQSVxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcblxufTtcblxuLy9leHBvcnQgZGVmYXVsdCBQcmlvcml0eU5hdlNjcm9sbGVyO1xuIiwiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIF92YWxpZEZvcm09cmVxdWlyZShcIi4vc3JjL3ZhbGlkLWZvcm1cIik7dmFyIF92YWxpZEZvcm0yPV9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3ZhbGlkRm9ybSk7ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmope3JldHVybiBvYmomJm9iai5fX2VzTW9kdWxlP29iajp7ZGVmYXVsdDpvYmp9fXdpbmRvdy5WYWxpZEZvcm09X3ZhbGlkRm9ybTIuZGVmYXVsdDt3aW5kb3cuVmFsaWRGb3JtLnRvZ2dsZUludmFsaWRDbGFzcz1fdmFsaWRGb3JtLnRvZ2dsZUludmFsaWRDbGFzczt3aW5kb3cuVmFsaWRGb3JtLmhhbmRsZUN1c3RvbU1lc3NhZ2VzPV92YWxpZEZvcm0uaGFuZGxlQ3VzdG9tTWVzc2FnZXM7d2luZG93LlZhbGlkRm9ybS5oYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheT1fdmFsaWRGb3JtLmhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5fSx7XCIuL3NyYy92YWxpZC1mb3JtXCI6M31dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTp0cnVlfSk7ZXhwb3J0cy5jbG9uZT1jbG9uZTtleHBvcnRzLmRlZmF1bHRzPWRlZmF1bHRzO2V4cG9ydHMuaW5zZXJ0QWZ0ZXI9aW5zZXJ0QWZ0ZXI7ZXhwb3J0cy5pbnNlcnRCZWZvcmU9aW5zZXJ0QmVmb3JlO2V4cG9ydHMuZm9yRWFjaD1mb3JFYWNoO2V4cG9ydHMuZGVib3VuY2U9ZGVib3VuY2U7ZnVuY3Rpb24gY2xvbmUob2JqKXt2YXIgY29weT17fTtmb3IodmFyIGF0dHIgaW4gb2JqKXtpZihvYmouaGFzT3duUHJvcGVydHkoYXR0cikpY29weVthdHRyXT1vYmpbYXR0cl19cmV0dXJuIGNvcHl9ZnVuY3Rpb24gZGVmYXVsdHMob2JqLGRlZmF1bHRPYmplY3Qpe29iaj1jbG9uZShvYmp8fHt9KTtmb3IodmFyIGsgaW4gZGVmYXVsdE9iamVjdCl7aWYob2JqW2tdPT09dW5kZWZpbmVkKW9ialtrXT1kZWZhdWx0T2JqZWN0W2tdfXJldHVybiBvYmp9ZnVuY3Rpb24gaW5zZXJ0QWZ0ZXIocmVmTm9kZSxub2RlVG9JbnNlcnQpe3ZhciBzaWJsaW5nPXJlZk5vZGUubmV4dFNpYmxpbmc7aWYoc2libGluZyl7dmFyIF9wYXJlbnQ9cmVmTm9kZS5wYXJlbnROb2RlO19wYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGVUb0luc2VydCxzaWJsaW5nKX1lbHNle3BhcmVudC5hcHBlbmRDaGlsZChub2RlVG9JbnNlcnQpfX1mdW5jdGlvbiBpbnNlcnRCZWZvcmUocmVmTm9kZSxub2RlVG9JbnNlcnQpe3ZhciBwYXJlbnQ9cmVmTm9kZS5wYXJlbnROb2RlO3BhcmVudC5pbnNlcnRCZWZvcmUobm9kZVRvSW5zZXJ0LHJlZk5vZGUpfWZ1bmN0aW9uIGZvckVhY2goaXRlbXMsZm4pe2lmKCFpdGVtcylyZXR1cm47aWYoaXRlbXMuZm9yRWFjaCl7aXRlbXMuZm9yRWFjaChmbil9ZWxzZXtmb3IodmFyIGk9MDtpPGl0ZW1zLmxlbmd0aDtpKyspe2ZuKGl0ZW1zW2ldLGksaXRlbXMpfX19ZnVuY3Rpb24gZGVib3VuY2UobXMsZm4pe3ZhciB0aW1lb3V0PXZvaWQgMDt2YXIgZGVib3VuY2VkRm49ZnVuY3Rpb24gZGVib3VuY2VkRm4oKXtjbGVhclRpbWVvdXQodGltZW91dCk7dGltZW91dD1zZXRUaW1lb3V0KGZuLG1zKX07cmV0dXJuIGRlYm91bmNlZEZufX0se31dLDM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTp0cnVlfSk7ZXhwb3J0cy50b2dnbGVJbnZhbGlkQ2xhc3M9dG9nZ2xlSW52YWxpZENsYXNzO2V4cG9ydHMuaGFuZGxlQ3VzdG9tTWVzc2FnZXM9aGFuZGxlQ3VzdG9tTWVzc2FnZXM7ZXhwb3J0cy5oYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheT1oYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheTtleHBvcnRzLmRlZmF1bHQ9dmFsaWRGb3JtO3ZhciBfdXRpbD1yZXF1aXJlKFwiLi91dGlsXCIpO2Z1bmN0aW9uIHRvZ2dsZUludmFsaWRDbGFzcyhpbnB1dCxpbnZhbGlkQ2xhc3Mpe2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnZhbGlkXCIsZnVuY3Rpb24oKXtpbnB1dC5jbGFzc0xpc3QuYWRkKGludmFsaWRDbGFzcyl9KTtpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixmdW5jdGlvbigpe2lmKGlucHV0LnZhbGlkaXR5LnZhbGlkKXtpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKGludmFsaWRDbGFzcyl9fSl9dmFyIGVycm9yUHJvcHM9W1wiYmFkSW5wdXRcIixcInBhdHRlcm5NaXNtYXRjaFwiLFwicmFuZ2VPdmVyZmxvd1wiLFwicmFuZ2VVbmRlcmZsb3dcIixcInN0ZXBNaXNtYXRjaFwiLFwidG9vTG9uZ1wiLFwidG9vU2hvcnRcIixcInR5cGVNaXNtYXRjaFwiLFwidmFsdWVNaXNzaW5nXCIsXCJjdXN0b21FcnJvclwiXTtmdW5jdGlvbiBnZXRDdXN0b21NZXNzYWdlKGlucHV0LGN1c3RvbU1lc3NhZ2VzKXtjdXN0b21NZXNzYWdlcz1jdXN0b21NZXNzYWdlc3x8e307dmFyIGxvY2FsRXJyb3JQcm9wcz1baW5wdXQudHlwZStcIk1pc21hdGNoXCJdLmNvbmNhdChlcnJvclByb3BzKTt2YXIgdmFsaWRpdHk9aW5wdXQudmFsaWRpdHk7Zm9yKHZhciBpPTA7aTxsb2NhbEVycm9yUHJvcHMubGVuZ3RoO2krKyl7dmFyIHByb3A9bG9jYWxFcnJvclByb3BzW2ldO2lmKHZhbGlkaXR5W3Byb3BdKXtyZXR1cm4gaW5wdXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1cIitwcm9wKXx8Y3VzdG9tTWVzc2FnZXNbcHJvcF19fX1mdW5jdGlvbiBoYW5kbGVDdXN0b21NZXNzYWdlcyhpbnB1dCxjdXN0b21NZXNzYWdlcyl7ZnVuY3Rpb24gY2hlY2tWYWxpZGl0eSgpe3ZhciBtZXNzYWdlPWlucHV0LnZhbGlkaXR5LnZhbGlkP251bGw6Z2V0Q3VzdG9tTWVzc2FnZShpbnB1dCxjdXN0b21NZXNzYWdlcyk7aW5wdXQuc2V0Q3VzdG9tVmFsaWRpdHkobWVzc2FnZXx8XCJcIil9aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsY2hlY2tWYWxpZGl0eSk7aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImludmFsaWRcIixjaGVja1ZhbGlkaXR5KX1mdW5jdGlvbiBoYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheShpbnB1dCxvcHRpb25zKXt2YXIgdmFsaWRhdGlvbkVycm9yQ2xhc3M9b3B0aW9ucy52YWxpZGF0aW9uRXJyb3JDbGFzcyx2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzcz1vcHRpb25zLnZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzLGVycm9yUGxhY2VtZW50PW9wdGlvbnMuZXJyb3JQbGFjZW1lbnQ7ZnVuY3Rpb24gY2hlY2tWYWxpZGl0eShvcHRpb25zKXt2YXIgaW5zZXJ0RXJyb3I9b3B0aW9ucy5pbnNlcnRFcnJvcjt2YXIgcGFyZW50Tm9kZT1pbnB1dC5wYXJlbnROb2RlO3ZhciBlcnJvck5vZGU9cGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKFwiLlwiK3ZhbGlkYXRpb25FcnJvckNsYXNzKXx8ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtpZighaW5wdXQudmFsaWRpdHkudmFsaWQmJmlucHV0LnZhbGlkYXRpb25NZXNzYWdlKXtlcnJvck5vZGUuY2xhc3NOYW1lPXZhbGlkYXRpb25FcnJvckNsYXNzO2Vycm9yTm9kZS50ZXh0Q29udGVudD1pbnB1dC52YWxpZGF0aW9uTWVzc2FnZTtpZihpbnNlcnRFcnJvcil7ZXJyb3JQbGFjZW1lbnQ9PT1cImJlZm9yZVwiPygwLF91dGlsLmluc2VydEJlZm9yZSkoaW5wdXQsZXJyb3JOb2RlKTooMCxfdXRpbC5pbnNlcnRBZnRlcikoaW5wdXQsZXJyb3JOb2RlKTtwYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQodmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3MpfX1lbHNle3BhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSh2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzcyk7ZXJyb3JOb2RlLnJlbW92ZSgpfX1pbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixmdW5jdGlvbigpe2NoZWNrVmFsaWRpdHkoe2luc2VydEVycm9yOmZhbHNlfSl9KTtpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW52YWxpZFwiLGZ1bmN0aW9uKGUpe2UucHJldmVudERlZmF1bHQoKTtjaGVja1ZhbGlkaXR5KHtpbnNlcnRFcnJvcjp0cnVlfSl9KX12YXIgZGVmYXVsdE9wdGlvbnM9e2ludmFsaWRDbGFzczpcImludmFsaWRcIix2YWxpZGF0aW9uRXJyb3JDbGFzczpcInZhbGlkYXRpb24tZXJyb3JcIix2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzczpcImhhcy12YWxpZGF0aW9uLWVycm9yXCIsY3VzdG9tTWVzc2FnZXM6e30sZXJyb3JQbGFjZW1lbnQ6XCJiZWZvcmVcIn07ZnVuY3Rpb24gdmFsaWRGb3JtKGVsZW1lbnQsb3B0aW9ucyl7aWYoIWVsZW1lbnR8fCFlbGVtZW50Lm5vZGVOYW1lKXt0aHJvdyBuZXcgRXJyb3IoXCJGaXJzdCBhcmcgdG8gdmFsaWRGb3JtIG11c3QgYmUgYSBmb3JtLCBpbnB1dCwgc2VsZWN0LCBvciB0ZXh0YXJlYVwiKX12YXIgaW5wdXRzPXZvaWQgMDt2YXIgdHlwZT1lbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7b3B0aW9ucz0oMCxfdXRpbC5kZWZhdWx0cykob3B0aW9ucyxkZWZhdWx0T3B0aW9ucyk7aWYodHlwZT09PVwiZm9ybVwiKXtpbnB1dHM9ZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWFcIik7Zm9jdXNJbnZhbGlkSW5wdXQoZWxlbWVudCxpbnB1dHMpfWVsc2UgaWYodHlwZT09PVwiaW5wdXRcInx8dHlwZT09PVwic2VsZWN0XCJ8fHR5cGU9PT1cInRleHRhcmVhXCIpe2lucHV0cz1bZWxlbWVudF19ZWxzZXt0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IGZvcm0sIGlucHV0LCBzZWxlY3QsIG9yIHRleHRhcmVhIGVsZW1lbnRzIGFyZSBzdXBwb3J0ZWRcIil9dmFsaWRGb3JtSW5wdXRzKGlucHV0cyxvcHRpb25zKX1mdW5jdGlvbiBmb2N1c0ludmFsaWRJbnB1dChmb3JtLGlucHV0cyl7dmFyIGZvY3VzRmlyc3Q9KDAsX3V0aWwuZGVib3VuY2UpKDEwMCxmdW5jdGlvbigpe3ZhciBpbnZhbGlkTm9kZT1mb3JtLnF1ZXJ5U2VsZWN0b3IoXCI6aW52YWxpZFwiKTtpZihpbnZhbGlkTm9kZSlpbnZhbGlkTm9kZS5mb2N1cygpfSk7KDAsX3V0aWwuZm9yRWFjaCkoaW5wdXRzLGZ1bmN0aW9uKGlucHV0KXtyZXR1cm4gaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImludmFsaWRcIixmb2N1c0ZpcnN0KX0pfWZ1bmN0aW9uIHZhbGlkRm9ybUlucHV0cyhpbnB1dHMsb3B0aW9ucyl7dmFyIGludmFsaWRDbGFzcz1vcHRpb25zLmludmFsaWRDbGFzcyxjdXN0b21NZXNzYWdlcz1vcHRpb25zLmN1c3RvbU1lc3NhZ2VzOygwLF91dGlsLmZvckVhY2gpKGlucHV0cyxmdW5jdGlvbihpbnB1dCl7dG9nZ2xlSW52YWxpZENsYXNzKGlucHV0LGludmFsaWRDbGFzcyk7aGFuZGxlQ3VzdG9tTWVzc2FnZXMoaW5wdXQsY3VzdG9tTWVzc2FnZXMpO2hhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5KGlucHV0LG9wdGlvbnMpfSl9fSx7XCIuL3V0aWxcIjoyfV19LHt9LFsxXSk7IiwiLyoqXG4gKiBEbyB0aGVzZSB0aGluZ3MgYXMgcXVpY2tseSBhcyBwb3NzaWJsZTsgd2UgbWlnaHQgaGF2ZSBDU1Mgb3IgZWFybHkgc2NyaXB0cyB0aGF0IHJlcXVpcmUgb24gaXRcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ25vLWpzJyApO1xuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdqcycgKTtcbiIsIi8qKlxuICogVGhpcyBpcyB1c2VkIHRvIGNhdXNlIEdvb2dsZSBBbmFseXRpY3MgZXZlbnRzIHRvIHJ1blxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuLypcbiAqIENhbGwgaG9va3MgZnJvbSBvdGhlciBwbGFjZXMuXG4gKiBUaGlzIGFsbG93cyBvdGhlciBwbHVnaW5zIHRoYXQgd2UgbWFpbnRhaW4gdG8gcGFzcyBkYXRhIHRvIHRoZSB0aGVtZSdzIGFuYWx5dGljcyBtZXRob2QuXG4qL1xuaWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIHdwICkge1xuXHQvLyBmb3IgYW5hbHl0aWNzXG5cdHdwLmhvb2tzLmFkZEFjdGlvbiggJ3dwTWVzc2FnZUluc2VydGVyQW5hbHl0aWNzRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCwgMTAgKTtcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnbWlubnBvc3RGb3JtUHJvY2Vzc29yTWFpbGNoaW1wQW5hbHl0aWNzRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCwgMTAgKTtcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnbWlubnBvc3RNZW1iZXJzaGlwQW5hbHl0aWNzRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCwgMTAgKTtcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnbWlubnBvc3RNZW1iZXJzaGlwQW5hbHl0aWNzRWNvbW1lcmNlQWN0aW9uJywgJ21pbm5wb3N0TGFyZ28nLCBtcEFuYWx5dGljc1RyYWNraW5nRWNvbW1lcmNlQWN0aW9uLCAxMCApO1xuXG5cdC8vIGZvciBkYXRhIGxheWVyIHRvIEdvb2dsZSBUYWcgTWFuYWdlclxuXHQvL3dwLmhvb2tzLmFkZEFjdGlvbiggJ3dwTWVzc2FnZUluc2VydGVyRGF0YUxheWVyRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wRGF0YUxheWVyRXZlbnQsIDEwICk7XG5cdHdwLmhvb2tzLmFkZEFjdGlvbiggJ21pbm5wb3N0Rm9ybVByb2Nlc3Nvck1haWxjaGltcERhdGFMYXllckV2ZW50JywgJ21pbm5wb3N0TGFyZ28nLCBtcERhdGFMYXllckV2ZW50LCAxMCApO1xuXHQvL3dwLmhvb2tzLmFkZEFjdGlvbiggJ21pbm5wb3N0TWVtYmVyc2hpcERhdGFMYXllckV2ZW50JywgJ21pbm5wb3N0TGFyZ28nLCBtcERhdGFMYXllckV2ZW50LCAxMCApO1xuXHQvL3dwLmhvb2tzLmFkZEFjdGlvbiggJ21pbm5wb3N0TWVtYmVyc2hpcERhdGFMYXllckVjb21tZXJjZUFjdGlvbicsICdtaW5ucG9zdExhcmdvJywgbXBEYXRhTGF5ZXJFY29tbWVyY2UsIDEwICk7XG59XG5cbi8qXG4gKiBDcmVhdGUgYSBHb29nbGUgQW5hbHl0aWNzIGV2ZW50IGZvciB0aGUgdGhlbWUuIFRoaXMgY2FsbHMgdGhlIHdwLWFuYWx5dGljcy10cmFja2luZy1nZW5lcmF0b3IgYWN0aW9uLlxuICogdHlwZTogZ2VuZXJhbGx5IHRoaXMgaXMgXCJldmVudFwiXG4gKiBjYXRlZ29yeTogRXZlbnQgQ2F0ZWdvcnlcbiAqIGxhYmVsOiBFdmVudCBMYWJlbFxuICogYWN0aW9uOiBFdmVudCBBY3Rpb25cbiAqIHZhbHVlOiBvcHRpb25hbFxuICogbm9uX2ludGVyYWN0aW9uOiBvcHRpb25hbFxuKi9cbmZ1bmN0aW9uIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlLCBub25faW50ZXJhY3Rpb24gKSB7XG5cdHdwLmhvb2tzLmRvQWN0aW9uKCAnd3BBbmFseXRpY3NUcmFja2luZ0dlbmVyYXRvckV2ZW50JywgdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlLCBub25faW50ZXJhY3Rpb24gKTtcbn1cblxuLypcbiAqIENyZWF0ZSBhIGRhdGFsYXllciBldmVudCBmb3IgdGhlIHRoZW1lIHVzaW5nIHRoZSBndG00d3AgcGx1Z2luLiBUaGlzIHNldHMgdGhlIGRhdGFMYXllciBvYmplY3QgZm9yIEdvb2dsZSBUYWcgTWFuYWdlci5cbiAqIEl0IHNob3VsZCBvbmx5IGhhdmUgZGF0YSB0aGF0IGlzIG5vdCBhdmFpYWxhYmxlIHRvIEdUTSBieSBkZWZhdWx0LlxuICogZGF0YUxheWVyOiB0aGUgb2JqZWN0IHRoYXQgc2hvdWxkIGJlIGFkZGVkXG4qL1xuZnVuY3Rpb24gbXBEYXRhTGF5ZXJFdmVudCggZGF0YUxheWVyICkge1xuXHRpZiAoIHR5cGVvZiB3aW5kb3cuZGF0YUxheWVyICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHR3aW5kb3cuZGF0YUxheWVyLnB1c2goIGRhdGFMYXllciApO1xuXHR9XG59XG5cbi8qXG4gKiBDcmVhdGUgYSBHb29nbGUgQW5hbHl0aWNzIEVjb21tZXJjZSBhY3Rpb24gZm9yIHRoZSB0aGVtZS4gVGhpcyBjYWxscyB0aGUgd3AtYW5hbHl0aWNzLXRyYWNraW5nLWdlbmVyYXRvciBhY3Rpb24uXG4gKlxuKi9cbmZ1bmN0aW9uIG1wQW5hbHl0aWNzVHJhY2tpbmdFY29tbWVyY2VBY3Rpb24oIHR5cGUsIGFjdGlvbiwgcHJvZHVjdCwgc3RlcCApIHtcblx0d3AuaG9va3MuZG9BY3Rpb24oICd3cEFuYWx5dGljc1RyYWNraW5nR2VuZXJhdG9yRWNvbW1lcmNlQWN0aW9uJywgdHlwZSwgYWN0aW9uLCBwcm9kdWN0LCBzdGVwICk7XG59XG5cbi8qXG4gKiBXaGVuIGEgcGFydCBvZiB0aGUgd2Vic2l0ZSBpcyBtZW1iZXItc3BlY2lmaWMsIGNyZWF0ZSBhbiBldmVudCBmb3Igd2hldGhlciBpdCB3YXMgc2hvd24gb3Igbm90LlxuKi9cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdH1cblx0XHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3Igc2hhcmluZyBjb250ZW50XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG4vLyB0cmFjayBhIHNoYXJlIHZpYSBhbmFseXRpY3MgZXZlbnQuXG5mdW5jdGlvbiB0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiA9ICcnICkge1xuICAgIHZhciBjYXRlZ29yeSA9ICdTaGFyZSc7XG4gICAgaWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG4gICAgICAgIGNhdGVnb3J5ID0gJ1NoYXJlIC0gJyArIHBvc2l0aW9uO1xuICAgIH1cblxuICAgIC8vIHRyYWNrIGFzIGFuIGV2ZW50XG4gICAgbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeSwgdGV4dCwgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn1cblxuLy8gdG9wIHNoYXJlIGJ1dHRvbiBjbGlja1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWVudHJ5LXNoYXJlLXRvcCBhJyApLmZvckVhY2goXG4gICAgdG9wQnV0dG9uID0+IHRvcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoIGUgKSA9PiB7XG4gICAgICAgIHZhciB0ZXh0ID0gZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSggJ2RhdGEtc2hhcmUtYWN0aW9uJyApO1xuICAgICAgICB2YXIgcG9zaXRpb24gPSAndG9wJztcbiAgICAgICAgdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gKTtcbiAgICB9IClcbik7XG5cbi8vIHdoZW4gdGhlIHByaW50IGJ1dHRvbiBpcyBjbGlja2VkXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtcHJpbnQgYScgKS5mb3JFYWNoKFxuICAgIHByaW50QnV0dG9uID0+IHByaW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsICggZSApID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB3aW5kb3cucHJpbnQoKTtcbiAgICB9IClcbik7XG5cbi8vIHdoZW4gdGhlIHJlcHVibGlzaCBidXR0b24gaXMgY2xpY2tlZFxuLy8gdGhlIHBsdWdpbiBjb250cm9scyB0aGUgcmVzdCwgYnV0IHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRoZSBkZWZhdWx0IGV2ZW50IGRvZXNuJ3QgZmlyZVxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXJlcHVibGlzaCBhJyApLmZvckVhY2goXG4gICAgcmVwdWJsaXNoQnV0dG9uID0+IHJlcHVibGlzaEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoIGUgKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9IClcbik7XG5cbi8vIHdoZW4gdGhlIGNvcHkgbGluayBidXR0b24gaXMgY2xpY2tlZFxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWNvcHktdXJsIGEnICkuZm9yRWFjaChcbiAgICBjb3B5QnV0dG9uID0+IGNvcHlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCBlICkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCBjb3B5VGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCggY29weVRleHQgKS50aGVuKCAoKSA9PiB7XG4gICAgICAgICAgICB0bGl0ZS5zaG93KCAoIGUudGFyZ2V0ICksIHsgZ3JhdjogJ3cnIH0gKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRsaXRlLmhpZGUoICggZS50YXJnZXQgKSApO1xuICAgICAgICAgICAgfSwgMzAwMCApO1xuICAgICAgICB9ICk7XG4gICAgfSApXG4pO1xuXG4vLyB3aGVuIHNoYXJpbmcgdmlhIGZhY2Vib29rLCB0d2l0dGVyLCBvciBlbWFpbCwgb3BlbiB0aGUgZGVzdGluYXRpb24gdXJsIGluIGEgbmV3IHdpbmRvd1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWZhY2Vib29rIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXR3aXR0ZXIgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZW1haWwgYScgKS5mb3JFYWNoKFxuICAgIGFueVNoYXJlQnV0dG9uID0+IGFueVNoYXJlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsICggZSApID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciB1cmwgPSBlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCAnaHJlZicgKTtcblx0XHR3aW5kb3cub3BlbiggdXJsLCAnX2JsYW5rJyApO1xuICAgIH0gKVxuKTtcbiIsIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIE5hdmlnYXRpb24gc2NyaXB0cy4gSW5jbHVkZXMgbW9iaWxlIG9yIHRvZ2dsZSBiZWhhdmlvciwgYW5hbHl0aWNzIHRyYWNraW5nIG9mIHNwZWNpZmljIG1lbnVzLlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkgaW4gdGhlIGZ1bmN0aW9ucyBhdCB0aGUgYm90dG9tLlxuICovXG5cbmZ1bmN0aW9uIHNldHVwUHJpbWFyeU5hdigpIHtcblx0Y29uc3QgcHJpbWFyeU5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1saW5rcycgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHByaW1hcnlOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IGJ1dHRvbicgKTtcblx0aWYgKCBudWxsICE9PSBwcmltYXJ5TmF2VG9nZ2xlICkge1xuXHRcdHByaW1hcnlOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRjb25zdCB1c2VyTmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItYWNjb3VudCB1bCcgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHVzZXJOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItYWNjb3VudCA+IGEnICk7XG5cdGlmICggbnVsbCAhPT0gdXNlck5hdlRvZ2dsZSApIHtcblx0XHR1c2VyTmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0dmFyIHRhcmdldCAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgLm0tZm9ybS1zZWFyY2ggZmllbGRzZXQgLmEtYnV0dG9uLXNlbnRlbmNlJyApO1xuXHRpZiAoIG51bGwgIT09IHRhcmdldCApIHtcblx0XHR2YXIgZGl2ICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRkaXYuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLXNlYXJjaFwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuXHRcdHZhciBmcmFnbWVudCAgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0ZGl2LnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuXHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG5cblx0XHRjb25zdCBzZWFyY2hUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1hY3Rpb25zIC5tLWZvcm0tc2VhcmNoJyApLFxuXHRcdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHRcdH0gKTtcblxuXHRcdHZhciBzZWFyY2hWaXNpYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ2xpLnNlYXJjaCA+IGEnICk7XG5cdFx0c2VhcmNoVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHR2YXIgc2VhcmNoQ2xvc2UgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLXNlYXJjaCcgKTtcblx0XHRzZWFyY2hDbG9zZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiggZXZ0ICkge1xuXHRcdGV2dCA9IGV2dCB8fCB3aW5kb3cuZXZlbnQ7XG5cdFx0dmFyIGlzRXNjYXBlID0gZmFsc2U7XG5cdFx0aWYgKCAna2V5JyBpbiBldnQgKSB7XG5cdFx0XHRpc0VzY2FwZSA9ICggJ0VzY2FwZScgPT09IGV2dC5rZXkgfHwgJ0VzYycgPT09IGV2dC5rZXkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aXNFc2NhcGUgPSAoIDI3ID09PSBldnQua2V5Q29kZSApO1xuXHRcdH1cblx0XHRpZiAoIGlzRXNjYXBlICkge1xuXHRcdFx0bGV0IHByaW1hcnlOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gcHJpbWFyeU5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHVzZXJOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gdXNlck5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHNlYXJjaElzVmlzaWJsZSA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBwcmltYXJ5TmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gcHJpbWFyeU5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHRwcmltYXJ5TmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHByaW1hcnlOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHVzZXJOYXZFeHBhbmRlZCAmJiB0cnVlID09PSB1c2VyTmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgdXNlck5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2Ygc2VhcmNoSXNWaXNpYmxlICYmIHRydWUgPT09IHNlYXJjaElzVmlzaWJsZSApIHtcblx0XHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBzZWFyY2hJc1Zpc2libGUgKTtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufVxuc2V0dXBQcmltYXJ5TmF2KCk7IC8vIHRoaXMgd2hvbGUgZnVuY3Rpb24gZG9lcyBub3QgcmVxdWlyZSBqcXVlcnkuXG5cbmZ1bmN0aW9uIHNldHVwU2Nyb2xsTmF2KCkge1xuXG5cdGxldCBzdWJOYXZTY3JvbGxlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tc3ViLW5hdmlnYXRpb24nICk7XG5cdHN1Yk5hdlNjcm9sbGVycy5mb3JFYWNoKCAoIGN1cnJlbnRWYWx1ZSApID0+IHtcblx0XHRQcmlvcml0eU5hdlNjcm9sbGVyKCB7XG5cdFx0XHRzZWxlY3RvcjogY3VycmVudFZhbHVlLFxuXHRcdFx0bmF2U2VsZWN0b3I6ICcubS1zdWJuYXYtbmF2aWdhdGlvbicsXG5cdFx0XHRjb250ZW50U2VsZWN0b3I6ICcubS1tZW51LXN1Yi1uYXZpZ2F0aW9uJyxcblx0XHRcdGl0ZW1TZWxlY3RvcjogJ2xpLCBhJyxcblx0XHRcdGJ1dHRvbkxlZnRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0Jyxcblx0XHRcdGJ1dHRvblJpZ2h0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tcmlnaHQnXG5cdFx0fSApO1xuXHR9ICk7XG5cblx0bGV0IHBhZ2luYXRpb25TY3JvbGxlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tcGFnaW5hdGlvbi1uYXZpZ2F0aW9uJyApO1xuXHRwYWdpbmF0aW9uU2Nyb2xsZXJzLmZvckVhY2goICggY3VycmVudFZhbHVlICkgPT4ge1xuXHRcdFByaW9yaXR5TmF2U2Nyb2xsZXIoIHtcblx0XHRcdHNlbGVjdG9yOiBjdXJyZW50VmFsdWUsXG5cdFx0XHRuYXZTZWxlY3RvcjogJy5tLXBhZ2luYXRpb24tY29udGFpbmVyJyxcblx0XHRcdGNvbnRlbnRTZWxlY3RvcjogJy5tLXBhZ2luYXRpb24tbGlzdCcsXG5cdFx0XHRpdGVtU2VsZWN0b3I6ICdsaSwgYScsXG5cdFx0XHRidXR0b25MZWZ0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tbGVmdCcsXG5cdFx0XHRidXR0b25SaWdodFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0J1xuXHRcdH0gKTtcblx0fSApO1xuXG59XG5zZXR1cFNjcm9sbE5hdigpOyAvLyB0aGlzIHdob2xlIGZ1bmN0aW9uIGRvZXMgbm90IHJlcXVpcmUganF1ZXJ5LlxuXG5cbi8vIHRoaXMgaXMgdGhlIHBhcnQgdGhhdCByZXF1aXJlcyBqcXVlcnkuXG4kKCAnYScsICQoICcuby1zaXRlLXNpZGViYXInICkgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdHZhciB3aWRnZXRUaXRsZSAgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS13aWRnZXQnICkuZmluZCggJ2gzJyApLnRleHQoKTtcblx0dmFyIHpvbmVUaXRsZSAgICAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXpvbmUnICkuZmluZCggJy5hLXpvbmUtdGl0bGUnICkudGV4dCgpO1xuXHR2YXIgc2lkZWJhclNlY3Rpb25UaXRsZSA9ICcnO1xuXHRpZiAoICcnICE9PSB3aWRnZXRUaXRsZSApIHtcblx0XHRzaWRlYmFyU2VjdGlvblRpdGxlID0gd2lkZ2V0VGl0bGU7XG5cdH0gZWxzZSBpZiAoICcnICE9PSB6b25lVGl0bGUgKSB7XG5cdFx0c2lkZWJhclNlY3Rpb25UaXRsZSA9IHpvbmVUaXRsZTtcblx0fVxuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsICdTaWRlYmFyIExpbmsnLCAnQ2xpY2snLCBzaWRlYmFyU2VjdGlvblRpdGxlICk7XG59ICk7XG5cbiQoICdhJywgJCggJy5tLXJlbGF0ZWQnICkgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1JlbGF0ZWQgU2VjdGlvbiBMaW5rJywgJ0NsaWNrJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgZm9ybXNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxualF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICggdGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgJycgIT09IHRoaXMubm9kZVZhbHVlLnRyaW0oKSApO1xuXHR9ICk7XG59O1xuXG5mdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0cmV0dXJuIG1hcmt1cDtcbn1cblxuZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCggJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nICk7XG5cdHZhciByZXN0Um9vdCAgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0dmFyIGZ1bGxVcmwgICAgICAgICAgICA9IHJlc3RSb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdHZhciBjb25maXJtQ2hhbmdlICAgICAgPSAnJztcblx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdHZhciBuZXdQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIG9sZFByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0dmFyIGNvbnNvbGlkYXRlZEVtYWlscyA9IFtdO1xuXHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdHZhciBhamF4Rm9ybURhdGEgICAgICAgPSAnJztcblx0dmFyIHRoYXQgICAgICAgICAgICAgICA9ICcnO1xuXG5cdC8vIHN0YXJ0IG91dCB3aXRoIG5vIHByaW1hcnkvcmVtb3ZhbHMgY2hlY2tlZFxuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHQvLyBpZiB0aGVyZSBpcyBhIGxpc3Qgb2YgZW1haWxzIChub3QganVzdCBhIHNpbmdsZSBmb3JtIGZpZWxkKVxuXHRpZiAoIDAgPCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cblx0XHQvLyBpZiBhIHVzZXIgc2VsZWN0cyBhIG5ldyBwcmltYXJ5LCBtb3ZlIGl0IGludG8gdGhhdCBwb3NpdGlvblxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oKSB7XG5cblx0XHRcdG5ld1ByaW1hcnlFbWFpbCA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdG9sZFByaW1hcnlFbWFpbCA9ICQoICcjZW1haWwnICkudmFsKCk7XG5cdFx0XHRwcmltYXJ5SWQgICAgICAgPSAkKCB0aGlzICkucHJvcCggJ2lkJyApLnJlcGxhY2UoICdwcmltYXJ5X2VtYWlsXycsICcnICk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncHJpbWFyeS1jaGFuZ2UnICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlclxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblxuXHRcdFx0Ly8kKCB0aGlzICkucGFyZW50KCkuYWZ0ZXIoIGNvbmZpcm1DaGFuZ2UgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSB1c2VyIGZhY2luZyB2YWx1ZXNcblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG5ld1ByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3VzZXItZW1haWwtJyArIHByaW1hcnlJZCApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgbWFpbiBoaWRkZW4gZm9ybSB2YWx1ZVxuXHRcdFx0XHQkKCAnI2VtYWlsJyApLnZhbCggbmV3UHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gc3VibWl0IGZvcm0gdmFsdWVzLlxuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXG5cdFx0XHRcdC8vIHVuY2hlY2sgdGhlIHJhZGlvIGJ1dHRvblxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBmb3JtIHZhbHVlcyB0byB0aGUgb2xkIHByaW1hcnkgZW1haWxcblx0XHRcdFx0JCggJyNwcmltYXJ5X2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3JlbW92ZV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyByZW1vdmUgdGhlIGNvbmZpcm0gbWVzc2FnZVxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHJlbW92ZXMgYW4gZW1haWwsIHRha2UgaXQgYXdheSBmcm9tIHRoZSB2aXN1YWwgYW5kIGZyb20gdGhlIGZvcm1cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2hhbmdlJywgJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgIT09IGVtYWlsVG9SZW1vdmUgKSB7XG5cdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlciBmb3IgcmVtb3ZhbFxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0Ly8gaWYgY29uZmlybWVkLCByZW1vdmUgdGhlIGVtYWlsIGFuZCBzdWJtaXQgdGhlIGZvcm1cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGknICkuZmFkZU91dCggJ25vcm1hbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cblx0XHRcdFx0Ly9jb25zb2xlLmxvZyggJ3ZhbHVlIGlzICcgKyBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnICkuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvbiBhLWJ1dHRvbi1hZGQtdXNlci1lbWFpbFwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRuZXh0RW1haWxDb3VudCsrO1xuXHR9ICk7XG5cblx0JCggJ2lucHV0W3R5cGU9c3VibWl0XScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGJ1dHRvbiA9ICQoIHRoaXMgKTtcblx0XHR2YXIgYnV0dG9uRm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCAnZm9ybScgKTtcblx0XHRidXR0b25Gb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicsIGJ1dHRvbi52YWwoKSApO1xuXHR9ICk7XG5cblx0JCggJy5tLWVudHJ5LWNvbnRlbnQnICkub24oICdzdWJtaXQnLCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgZm9ybSA9ICQoIHRoaXMgKTtcblx0XHR2YXIgc3VibWl0dGluZ0J1dHRvbiA9IGZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJyApIHx8ICcnO1xuXG5cdFx0Ly8gaWYgdGhlcmUgaXMgbm8gc3VibWl0dGluZyBidXR0b24sIHBhc3MgaXQgYnkgQWpheFxuXHRcdGlmICggJycgPT09IHN1Ym1pdHRpbmdCdXR0b24gfHwgJ1NhdmUgQ2hhbmdlcycgIT09IHN1Ym1pdHRpbmdCdXR0b24gKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheEZvcm1EYXRhID0gZm9ybS5zZXJpYWxpemUoKTsgLy9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheEZvcm1EYXRhID0gYWpheEZvcm1EYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogZnVsbFVybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Qubm9uY2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0ZGF0YTogYWpheEZvcm1EYXRhXG5cdFx0XHR9ICkuZG9uZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5ld0VtYWlscyA9ICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKS5tYXAoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdH0gKS5nZXQoKTtcblx0XHRcdFx0JC5lYWNoKCBuZXdFbWFpbHMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSBuZXh0RW1haWxDb3VudCArIGluZGV4O1xuXHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkuYXBwZW5kKCAnPGxpIGlkPVwidXNlci1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtZW1haWwtcHJlZmVyZW5jZXNcIj48YSBocmVmPVwiL25ld3NsZXR0ZXJzLz9lbWFpbD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCB2YWx1ZSApICsgJ1wiPjxzbWFsbD5FbWFpbCBQcmVmZXJlbmNlczwvc21hbGw+PC9hPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLXJlbW92ZS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwicmVtb3ZlX2VtYWlsWycgKyBuZXh0RW1haWxDb3VudCArICddXCIgaWQ9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5SZW1vdmU8L3NtYWxsPjwvbGFiZWw+PC9saT48L3VsPjwvbGk+JyApO1xuXHRcdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCAkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCgpICsgJywnICsgdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggMCA9PT0gJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIGl0IHdvdWxkIGJlIG5pY2UgdG8gb25seSBsb2FkIHRoZSBmb3JtLCBidXQgdGhlbiBjbGljayBldmVudHMgc3RpbGwgZG9uJ3Qgd29ya1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIGFkZEF1dG9SZXNpemUoKSB7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICdbZGF0YS1hdXRvcmVzaXplXScgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRlbGVtZW50LnN0eWxlLmJveFNpemluZyA9ICdib3JkZXItYm94Jztcblx0XHR2YXIgb2Zmc2V0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgLSBlbGVtZW50LmNsaWVudEhlaWdodDtcblx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnRhcmdldC5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG5cdFx0XHRldmVudC50YXJnZXQuc3R5bGUuaGVpZ2h0ID0gZXZlbnQudGFyZ2V0LnNjcm9sbEhlaWdodCArIG9mZnNldCArICdweCc7XG5cdFx0fSApO1xuXHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCAnZGF0YS1hdXRvcmVzaXplJyApO1xuXHR9ICk7XG59XG5cbiQoIGRvY3VtZW50ICkuYWpheFN0b3AoIGZ1bmN0aW9uKCkge1xuXHR2YXIgY29tbWVudEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnI2xsY19jb21tZW50cycgKTtcblx0aWYgKCBudWxsICE9PSBjb21tZW50QXJlYSApIHtcblx0XHRhZGRBdXRvUmVzaXplKCk7XG5cdH1cbn0gKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKCAwIDwgJCggJy5tLWZvcm0tYWNjb3VudC1zZXR0aW5ncycgKS5sZW5ndGggKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cblx0dmFyIGF1dG9SZXNpemVUZXh0YXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICdbZGF0YS1hdXRvcmVzaXplXScgKTtcblx0aWYgKCBudWxsICE9PSBhdXRvUmVzaXplVGV4dGFyZWEgKSB7XG5cdFx0YWRkQXV0b1Jlc2l6ZSgpO1xuXHR9XG59ICk7XG5cbnZhciBmb3JtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1mb3JtJyApO1xuZm9ybXMuZm9yRWFjaCggZnVuY3Rpb24oIGZvcm0gKSB7XG5cdFZhbGlkRm9ybSggZm9ybSwge1xuXHRcdHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzOiAnbS1oYXMtdmFsaWRhdGlvbi1lcnJvcicsXG5cdFx0dmFsaWRhdGlvbkVycm9yQ2xhc3M6ICdhLXZhbGlkYXRpb24tZXJyb3InLFxuXHRcdGludmFsaWRDbGFzczogJ2EtZXJyb3InLFxuXHRcdGVycm9yUGxhY2VtZW50OiAnYWZ0ZXInXG5cdH0gKTtcbn0gKTtcblxudmFyIGZvcm0gPSAkKCAnLm0tZm9ybScgKTtcblxuLy8gbGlzdGVuIGZvciBgaW52YWxpZGAgZXZlbnRzIG9uIGFsbCBmb3JtIGlucHV0c1xuZm9ybS5maW5kKCAnOmlucHV0JyApLm9uKCAnaW52YWxpZCcsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbnB1dCA9ICQoIHRoaXMgKTtcblxuICAgIC8vIHRoZSBmaXJzdCBpbnZhbGlkIGVsZW1lbnQgaW4gdGhlIGZvcm1cblx0dmFyIGZpcnN0ID0gZm9ybS5maW5kKCAnLmEtZXJyb3InICkuZmlyc3QoKTtcblxuXHQvLyB0aGUgZm9ybSBpdGVtIHRoYXQgY29udGFpbnMgaXRcblx0dmFyIGZpcnN0X2hvbGRlciA9IGZpcnN0LnBhcmVudCgpO1xuXG4gICAgLy8gb25seSBoYW5kbGUgaWYgdGhpcyBpcyB0aGUgZmlyc3QgaW52YWxpZCBpbnB1dFxuICAgIGlmICggaW5wdXRbMF0gPT09IGZpcnN0WzBdICkge1xuXG4gICAgICAgIC8vIGhlaWdodCBvZiB0aGUgbmF2IGJhciBwbHVzIHNvbWUgcGFkZGluZyBpZiB0aGVyZSdzIGEgZml4ZWQgbmF2XG4gICAgICAgIC8vdmFyIG5hdmJhckhlaWdodCA9IG5hdmJhci5oZWlnaHQoKSArIDUwXG5cbiAgICAgICAgLy8gdGhlIHBvc2l0aW9uIHRvIHNjcm9sbCB0byAoYWNjb3VudGluZyBmb3IgdGhlIG5hdmJhciBpZiBpdCBleGlzdHMpXG4gICAgICAgIHZhciBlbGVtZW50T2Zmc2V0ID0gZmlyc3RfaG9sZGVyLm9mZnNldCgpLnRvcDtcblxuICAgICAgICAvLyB0aGUgY3VycmVudCBzY3JvbGwgcG9zaXRpb24gKGFjY291bnRpbmcgZm9yIHRoZSBuYXZiYXIpXG4gICAgICAgIHZhciBwYWdlT2Zmc2V0ID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuXG4gICAgICAgIC8vIGRvbid0IHNjcm9sbCBpZiB0aGUgZWxlbWVudCBpcyBhbHJlYWR5IGluIHZpZXdcbiAgICAgICAgaWYgKCBlbGVtZW50T2Zmc2V0ID4gcGFnZU9mZnNldCAmJiBlbGVtZW50T2Zmc2V0IDwgcGFnZU9mZnNldCArIHdpbmRvdy5pbm5lckhlaWdodCApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm90ZTogYXZvaWQgdXNpbmcgYW5pbWF0ZSwgYXMgaXQgcHJldmVudHMgdGhlIHZhbGlkYXRpb24gbWVzc2FnZSBkaXNwbGF5aW5nIGNvcnJlY3RseVxuICAgICAgICAkKCAnaHRtbCwgYm9keScgKS5zY3JvbGxUb3AoIGVsZW1lbnRPZmZzZXQgKTtcbiAgICB9XG59ICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIGNvbW1lbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8vIGJhc2VkIG9uIHdoaWNoIGJ1dHRvbiB3YXMgY2xpY2tlZCwgc2V0IHRoZSB2YWx1ZXMgZm9yIHRoZSBhbmFseXRpY3MgZXZlbnQgYW5kIGNyZWF0ZSBpdFxuZnVuY3Rpb24gdHJhY2tTaG93Q29tbWVudHMoIGFsd2F5cywgaWQsIGNsaWNrVmFsdWUgKSB7XG5cdHZhciBhY3Rpb24gICAgICAgICAgPSAnJztcblx0dmFyIGNhdGVnb3J5UHJlZml4ID0gJyc7XG5cdHZhciBjYXRlZ29yeVN1ZmZpeCA9ICcnO1xuXHR2YXIgcG9zaXRpb24gICAgICAgID0gJyc7XG5cdHBvc2l0aW9uID0gaWQucmVwbGFjZSggJ2Fsd2F5cy1zaG93LWNvbW1lbnRzLScsICcnICk7XG5cdGlmICggJzEnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPbic7XG5cdH0gZWxzZSBpZiAoICcwJyA9PT0gY2xpY2tWYWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5UHJlZml4ID0gJ0Fsd2F5cyAnO1xuXHR9XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24uY2hhckF0KCAwICkudG9VcHBlckNhc2UoKSArIHBvc2l0aW9uLnNsaWNlKCAxICk7XG5cdFx0Y2F0ZWdvcnlTdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnlQcmVmaXggKyAnU2hvdyBDb21tZW50cycgKyBjYXRlZ29yeVN1ZmZpeCwgYWN0aW9uLCBsb2NhdGlvbi5wYXRobmFtZSApO1xufVxuXG4vLyB3aGVuIHNob3dpbmcgY29tbWVudHMgb25jZSwgdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtYnV0dG9uLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dHJhY2tTaG93Q29tbWVudHMoIGZhbHNlLCAnJywgJycgKTtcbn0gKTtcblxuLy8gU2V0IHVzZXIgbWV0YSB2YWx1ZSBmb3IgYWx3YXlzIHNob3dpbmcgY29tbWVudHMgaWYgdGhhdCBidXR0b24gaXMgY2xpY2tlZFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHZhciB0aGF0ID0gJCggdGhpcyApO1xuXHRpZiAoIHRoYXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gZWxzZSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuXHR0cmFja1Nob3dDb21tZW50cyggdHJ1ZSwgdGhhdC5hdHRyKCAnaWQnICksIHRoYXQudmFsKCkgKTtcblxuXHQvLyB3ZSBhbHJlYWR5IGhhdmUgYWpheHVybCBmcm9tIHRoZSB0aGVtZVxuXHQkLmFqYXgoIHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBwYXJhbXMuYWpheHVybCxcblx0XHRkYXRhOiB7XG5cdFx0XHQnYWN0aW9uJzogJ21pbm5wb3N0X2xhcmdvX2xvYWRfY29tbWVudHNfc2V0X3VzZXJfbWV0YScsXG5cdFx0XHQndmFsdWUnOiB0aGF0LnZhbCgpXG5cdFx0fSxcblx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHQkKCAnLmEtYWx3YXlzLXNob3ctY29tbWVudHMtcmVzdWx0JywgdGhhdC5wYXJlbnQoKSApLmh0bWwoIHJlc3BvbnNlLmRhdGEubWVzc2FnZSApO1xuXHRcdFx0aWYgKCB0cnVlID09PSByZXNwb25zZS5kYXRhLnNob3cgKSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDAgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDEgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcbn0gKTtcblxuISAoIGZ1bmN0aW9uKCBkICkge1xuXHRpZiAoICEgZC5jdXJyZW50U2NyaXB0ICkge1xuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0YWN0aW9uOiAnbGxjX2xvYWRfY29tbWVudHMnLFxuXHRcdFx0cG9zdDogJCggJyNsbGNfcG9zdF9pZCcgKS52YWwoKVxuXHRcdH07XG5cblx0XHQvLyBBamF4IHJlcXVlc3QgbGluay5cblx0XHR2YXIgbGxjYWpheHVybCA9ICQoICcjbGxjX2FqYXhfdXJsJyApLnZhbCgpO1xuXG5cdFx0Ly8gRnVsbCB1cmwgdG8gZ2V0IGNvbW1lbnRzIChBZGRpbmcgcGFyYW1ldGVycykuXG5cdFx0dmFyIGNvbW1lbnRVcmwgPSBsbGNhamF4dXJsICsgJz8nICsgJC5wYXJhbSggZGF0YSApO1xuXG5cdFx0Ly8gUGVyZm9ybSBhamF4IHJlcXVlc3QuXG5cdFx0JC5nZXQoIGNvbW1lbnRVcmwsIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdGlmICggJycgIT09IHJlc3BvbnNlICkge1xuXHRcdFx0XHQkKCAnI2xsY19jb21tZW50cycgKS5odG1sKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgY29tbWVudHMgYWZ0ZXIgbGF6eSBsb2FkaW5nLlxuXHRcdFx0XHRpZiAoIHdpbmRvdy5hZGRDb21tZW50ICYmIHdpbmRvdy5hZGRDb21tZW50LmluaXQgKSB7XG5cdFx0XHRcdFx0d2luZG93LmFkZENvbW1lbnQuaW5pdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gR2V0IHRoZSBjb21tZW50IGxpIGlkIGZyb20gdXJsIGlmIGV4aXN0LlxuXHRcdFx0XHR2YXIgY29tbWVudElkID0gZG9jdW1lbnQuVVJMLnN1YnN0ciggZG9jdW1lbnQuVVJMLmluZGV4T2YoICcjY29tbWVudCcgKSApO1xuXG5cdFx0XHRcdC8vIElmIGNvbW1lbnQgaWQgZm91bmQsIHNjcm9sbCB0byB0aGF0IGNvbW1lbnQuXG5cdFx0XHRcdGlmICggLTEgPCBjb21tZW50SWQuaW5kZXhPZiggJyNjb21tZW50JyApICkge1xuXHRcdFx0XHRcdCQoIHdpbmRvdyApLnNjcm9sbFRvcCggJCggY29tbWVudElkICkub2Zmc2V0KCkudG9wICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cbn0oIGRvY3VtZW50ICkgKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgZXZlbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG5jb25zdCB0YXJnZXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5hLWV2ZW50cy1jYWwtbGlua3MnICk7XG50YXJnZXRzLmZvckVhY2goIGZ1bmN0aW9uKCB0YXJnZXQgKSB7XG4gICAgc2V0Q2FsZW5kYXIoIHRhcmdldCApO1xufSApO1xuXG5mdW5jdGlvbiBzZXRDYWxlbmRhciggdGFyZ2V0ICkge1xuICAgIGlmICggbnVsbCAhPT0gdGFyZ2V0ICkge1xuICAgICAgICB2YXIgbGkgICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2xpJyApO1xuICAgICAgICBsaS5pbm5lckhUTUwgID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLWNhbGVuZGFyXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG4gICAgICAgIHZhciBmcmFnbWVudCAgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGxpLnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggbGkgKTtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xuICAgIH1cbn1cblxuY29uc3QgY2FsZW5kYXJzVmlzaWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1ldmVudC1kYXRldGltZSBhJyApO1xuY2FsZW5kYXJzVmlzaWJsZS5mb3JFYWNoKCBmdW5jdGlvbiggY2FsZW5kYXJWaXNpYmxlICkge1xuICAgIHNob3dDYWxlbmRhciggY2FsZW5kYXJWaXNpYmxlICk7XG59ICk7XG5cbmZ1bmN0aW9uIHNob3dDYWxlbmRhciggY2FsZW5kYXJWaXNpYmxlICkge1xuICAgIGNvbnN0IGRhdGVIb2xkZXIgPSBjYWxlbmRhclZpc2libGUuY2xvc2VzdCggJy5tLWV2ZW50LWRhdGUtYW5kLWNhbGVuZGFyJyApO1xuICAgIGNvbnN0IGNhbGVuZGFyVHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcbiAgICAgICAgZWxlbWVudDogZGF0ZUhvbGRlci5xdWVyeVNlbGVjdG9yKCAnLmEtZXZlbnRzLWNhbC1saW5rcycgKSxcbiAgICAgICAgdmlzaWJsZUNsYXNzOiAnYS1ldmVudHMtY2FsLWxpbmstdmlzaWJsZScsXG4gICAgICAgIGRpc3BsYXlWYWx1ZTogJ2Jsb2NrJ1xuICAgIH0gKTtcblxuICAgIGlmICggbnVsbCAhPT0gY2FsZW5kYXJWaXNpYmxlICkge1xuICAgICAgICBjYWxlbmRhclZpc2libGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IGNhbGVuZGFyVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuICAgICAgICAgICAgY2FsZW5kYXJWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgICAgICAgICBpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKTtcblxuICAgICAgICB2YXIgY2FsZW5kYXJDbG9zZSA9IGRhdGVIb2xkZXIucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLWNhbGVuZGFyJyApO1xuICAgICAgICBpZiAoIG51bGwgIT09IGNhbGVuZGFyQ2xvc2UgKSB7XG4gICAgICAgICAgICBjYWxlbmRhckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IGNhbGVuZGFyVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICAgICAgICAgIGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGVuZGFyVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
}(jQuery));
