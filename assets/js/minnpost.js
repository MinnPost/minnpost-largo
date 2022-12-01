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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDQtdmFsaWQtZm9ybS5taW4uanMiLCIwMC1zdGFydC5qcyIsIjAxLWFuYWx5dGljcy5qcyIsIjAyLXNoYXJlLmpzIiwiMDMtbmF2aWdhdGlvbi5qcyIsIjA0LWZvcm1zLmpzIiwiMDUtY29tbWVudHMuanMiLCIwNi1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImMiLCJyZXF1aXJlIiwidSIsImNvZGUiLCJwIiwiY2FsbCIsIl92YWxpZEZvcm0iLCJfdmFsaWRGb3JtMiIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIlZhbGlkRm9ybSIsInRvZ2dsZUludmFsaWRDbGFzcyIsImhhbmRsZUN1c3RvbU1lc3NhZ2VzIiwiaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiY2xvbmUiLCJkZWZhdWx0cyIsImluc2VydEFmdGVyIiwiaW5zZXJ0QmVmb3JlIiwiZm9yRWFjaCIsImRlYm91bmNlIiwiY29weSIsImF0dHIiLCJoYXNPd25Qcm9wZXJ0eSIsImRlZmF1bHRPYmplY3QiLCJrIiwicmVmTm9kZSIsIm5vZGVUb0luc2VydCIsInNpYmxpbmciLCJuZXh0U2libGluZyIsIl9wYXJlbnQiLCJwYXJlbnQiLCJpdGVtcyIsImZuIiwibXMiLCJkZWJvdW5jZWRGbiIsInZhbGlkRm9ybSIsIl91dGlsIiwiaW5wdXQiLCJpbnZhbGlkQ2xhc3MiLCJ2YWxpZGl0eSIsInZhbGlkIiwiZXJyb3JQcm9wcyIsImdldEN1c3RvbU1lc3NhZ2UiLCJjdXN0b21NZXNzYWdlcyIsImxvY2FsRXJyb3JQcm9wcyIsInR5cGUiLCJjb25jYXQiLCJwcm9wIiwiY2hlY2tWYWxpZGl0eSIsIm1lc3NhZ2UiLCJzZXRDdXN0b21WYWxpZGl0eSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uRXJyb3JDbGFzcyIsInZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzIiwiZXJyb3JQbGFjZW1lbnQiLCJpbnNlcnRFcnJvciIsImVycm9yTm9kZSIsInZhbGlkYXRpb25NZXNzYWdlIiwidGV4dENvbnRlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImRlZmF1bHRPcHRpb25zIiwibm9kZU5hbWUiLCJpbnB1dHMiLCJ0b0xvd2VyQ2FzZSIsImZvY3VzSW52YWxpZElucHV0IiwidmFsaWRGb3JtSW5wdXRzIiwiZm9ybSIsImZvY3VzRmlyc3QiLCJpbnZhbGlkTm9kZSIsImZvY3VzIiwiZG9jdW1lbnRFbGVtZW50Iiwid3AiLCJob29rcyIsImFkZEFjdGlvbiIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFY29tbWVyY2VBY3Rpb24iLCJtcERhdGFMYXllckV2ZW50IiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsIm5vbl9pbnRlcmFjdGlvbiIsImRvQWN0aW9uIiwiZGF0YUxheWVyQ29udGVudCIsImRhdGFMYXllciIsImtleXMiLCJwdXNoIiwicHJvZHVjdCIsInN0ZXAiLCJldmVudCIsIm1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSIsInVybF9hY2Nlc3NfbGV2ZWwiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiY3VycmVudF91c2VyIiwiY2FuX2FjY2VzcyIsInRyYWNrU2hhcmUiLCJ0ZXh0IiwicG9zaXRpb24iLCJ0b3BCdXR0b24iLCJjdXJyZW50VGFyZ2V0IiwicHJpbnRCdXR0b24iLCJwcmludCIsInJlcHVibGlzaEJ1dHRvbiIsImNvcHlCdXR0b24iLCJjb3B5VGV4dCIsImhyZWYiLCJuYXZpZ2F0b3IiLCJjbGlwYm9hcmQiLCJ3cml0ZVRleHQiLCJ0aGVuIiwiYW55U2hhcmVCdXR0b24iLCJ1cmwiLCJvcGVuIiwic2V0dXBQcmltYXJ5TmF2IiwicHJpbWFyeU5hdlRyYW5zaXRpb25lciIsInByaW1hcnlOYXZUb2dnbGUiLCJleHBhbmRlZCIsInVzZXJOYXZUcmFuc2l0aW9uZXIiLCJ1c2VyTmF2VG9nZ2xlIiwiZGl2IiwiZnJhZ21lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50Iiwic2VhcmNoVHJhbnNpdGlvbmVyIiwic2VhcmNoVmlzaWJsZSIsInNlYXJjaENsb3NlIiwib25rZXlkb3duIiwiZXZ0IiwiaXNFc2NhcGUiLCJrZXkiLCJrZXlDb2RlIiwicHJpbWFyeU5hdkV4cGFuZGVkIiwidXNlck5hdkV4cGFuZGVkIiwic2VhcmNoSXNWaXNpYmxlIiwic2V0dXBTY3JvbGxOYXYiLCJzdWJOYXZTY3JvbGxlcnMiLCJjdXJyZW50VmFsdWUiLCJwYWdpbmF0aW9uU2Nyb2xsZXJzIiwiJCIsImNsaWNrIiwid2lkZ2V0VGl0bGUiLCJjbG9zZXN0IiwiZmluZCIsInpvbmVUaXRsZSIsInNpZGViYXJTZWN0aW9uVGl0bGUiLCJqUXVlcnkiLCJ0ZXh0Tm9kZXMiLCJjb250ZW50cyIsImZpbHRlciIsIm5vZGVUeXBlIiwiTm9kZSIsIlRFWFRfTk9ERSIsIm5vZGVWYWx1ZSIsInRyaW0iLCJnZXRDb25maXJtQ2hhbmdlTWFya3VwIiwibWFya3VwIiwibWFuYWdlRW1haWxzIiwicmVzdFJvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxVcmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheEZvcm1EYXRhIiwidGhhdCIsIm9uIiwidmFsIiwicmVwbGFjZSIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJhcHBlbmQiLCJmaXJzdCIsInJlcGxhY2VXaXRoIiwic3VibWl0IiwiZWFjaCIsImdldCIsInBhcmVudHMiLCJmYWRlT3V0Iiwiam9pbiIsImJlZm9yZSIsImJ1dHRvbiIsImJ1dHRvbkZvcm0iLCJkYXRhIiwic3VibWl0dGluZ0J1dHRvbiIsInNlcmlhbGl6ZSIsImFqYXgiLCJiZWZvcmVTZW5kIiwieGhyIiwic2V0UmVxdWVzdEhlYWRlciIsIm5vbmNlIiwiZGF0YVR5cGUiLCJkb25lIiwibWFwIiwiaW5kZXgiLCJlbmNvZGVVUklDb21wb25lbnQiLCJyZWxvYWQiLCJhZGRBdXRvUmVzaXplIiwiYm94U2l6aW5nIiwib2Zmc2V0IiwiY2xpZW50SGVpZ2h0IiwiaGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0IiwiYWpheFN0b3AiLCJjb21tZW50QXJlYSIsImF1dG9SZXNpemVUZXh0YXJlYSIsImZvcm1zIiwiZmlyc3RfaG9sZGVyIiwiZWxlbWVudE9mZnNldCIsInBhZ2VPZmZzZXQiLCJwYWdlWU9mZnNldCIsInNjcm9sbFRvcCIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiaWQiLCJjbGlja1ZhbHVlIiwiY2F0ZWdvcnlQcmVmaXgiLCJjYXRlZ29yeVN1ZmZpeCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJpcyIsInBhcmFtcyIsImFqYXh1cmwiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJodG1sIiwiY3VycmVudFNjcmlwdCIsInBvc3QiLCJsbGNhamF4dXJsIiwiY29tbWVudFVybCIsInBhcmFtIiwiYWRkQ29tbWVudCIsImNvbW1lbnRJZCIsIlVSTCIsInN1YnN0ciIsImluZGV4T2YiLCJ0YXJnZXRzIiwic2V0Q2FsZW5kYXIiLCJsaSIsImNhbGVuZGFyc1Zpc2libGUiLCJjYWxlbmRhclZpc2libGUiLCJzaG93Q2FsZW5kYXIiLCJkYXRlSG9sZGVyIiwiY2FsZW5kYXJUcmFuc2l0aW9uZXIiLCJjYWxlbmRhckNsb3NlIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLEtBQUssQ0FBQ0MsQ0FBQyxFQUFDO0VBQUNDLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsV0FBVyxFQUFD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c291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gdGxpdGUodCl7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLGZ1bmN0aW9uKGUpe3ZhciBpPWUudGFyZ2V0LG49dChpKTtufHwobj0oaT1pLnBhcmVudEVsZW1lbnQpJiZ0KGkpKSxuJiZ0bGl0ZS5zaG93KGksbiwhMCl9KX10bGl0ZS5zaG93PWZ1bmN0aW9uKHQsZSxpKXt2YXIgbj1cImRhdGEtdGxpdGVcIjtlPWV8fHt9LCh0LnRvb2x0aXB8fGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gbygpe3RsaXRlLmhpZGUodCwhMCl9ZnVuY3Rpb24gbCgpe3J8fChyPWZ1bmN0aW9uKHQsZSxpKXtmdW5jdGlvbiBuKCl7by5jbGFzc05hbWU9XCJ0bGl0ZSB0bGl0ZS1cIityK3M7dmFyIGU9dC5vZmZzZXRUb3AsaT10Lm9mZnNldExlZnQ7by5vZmZzZXRQYXJlbnQ9PT10JiYoZT1pPTApO3ZhciBuPXQub2Zmc2V0V2lkdGgsbD10Lm9mZnNldEhlaWdodCxkPW8ub2Zmc2V0SGVpZ2h0LGY9by5vZmZzZXRXaWR0aCxhPWkrbi8yO28uc3R5bGUudG9wPShcInNcIj09PXI/ZS1kLTEwOlwiblwiPT09cj9lK2wrMTA6ZStsLzItZC8yKStcInB4XCIsby5zdHlsZS5sZWZ0PShcIndcIj09PXM/aTpcImVcIj09PXM/aStuLWY6XCJ3XCI9PT1yP2krbisxMDpcImVcIj09PXI/aS1mLTEwOmEtZi8yKStcInB4XCJ9dmFyIG89ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksbD1pLmdyYXZ8fHQuZ2V0QXR0cmlidXRlKFwiZGF0YS10bGl0ZVwiKXx8XCJuXCI7by5pbm5lckhUTUw9ZSx0LmFwcGVuZENoaWxkKG8pO3ZhciByPWxbMF18fFwiXCIscz1sWzFdfHxcIlwiO24oKTt2YXIgZD1vLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3JldHVyblwic1wiPT09ciYmZC50b3A8MD8ocj1cIm5cIixuKCkpOlwiblwiPT09ciYmZC5ib3R0b20+d2luZG93LmlubmVySGVpZ2h0PyhyPVwic1wiLG4oKSk6XCJlXCI9PT1yJiZkLmxlZnQ8MD8ocj1cIndcIixuKCkpOlwid1wiPT09ciYmZC5yaWdodD53aW5kb3cuaW5uZXJXaWR0aCYmKHI9XCJlXCIsbigpKSxvLmNsYXNzTmFtZSs9XCIgdGxpdGUtdmlzaWJsZVwiLG99KHQsZCxlKSl9dmFyIHIscyxkO3JldHVybiB0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixvKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsbyksdC50b29sdGlwPXtzaG93OmZ1bmN0aW9uKCl7ZD10LnRpdGxlfHx0LmdldEF0dHJpYnV0ZShuKXx8ZCx0LnRpdGxlPVwiXCIsdC5zZXRBdHRyaWJ1dGUobixcIlwiKSxkJiYhcyYmKHM9c2V0VGltZW91dChsLGk/MTUwOjEpKX0saGlkZTpmdW5jdGlvbih0KXtpZihpPT09dCl7cz1jbGVhclRpbWVvdXQocyk7dmFyIGU9ciYmci5wYXJlbnROb2RlO2UmJmUucmVtb3ZlQ2hpbGQocikscj12b2lkIDB9fX19KHQsZSkpLnNob3coKX0sdGxpdGUuaGlkZT1mdW5jdGlvbih0LGUpe3QudG9vbHRpcCYmdC50b29sdGlwLmhpZGUoZSl9LFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9dGxpdGUpOyIsIi8qKiBcbiAqIExpYnJhcnkgY29kZVxuICogVXNpbmcgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvQGNsb3VkZm91ci90cmFuc2l0aW9uLWhpZGRlbi1lbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoe1xuICBlbGVtZW50LFxuICB2aXNpYmxlQ2xhc3MsXG4gIHdhaXRNb2RlID0gJ3RyYW5zaXRpb25lbmQnLFxuICB0aW1lb3V0RHVyYXRpb24sXG4gIGhpZGVNb2RlID0gJ2hpZGRlbicsXG4gIGRpc3BsYXlWYWx1ZSA9ICdibG9jaydcbn0pIHtcbiAgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcgJiYgdHlwZW9mIHRpbWVvdXREdXJhdGlvbiAhPT0gJ251bWJlcicpIHtcbiAgICBjb25zb2xlLmVycm9yKGBcbiAgICAgIFdoZW4gY2FsbGluZyB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCB3aXRoIHdhaXRNb2RlIHNldCB0byB0aW1lb3V0LFxuICAgICAgeW91IG11c3QgcGFzcyBpbiBhIG51bWJlciBmb3IgdGltZW91dER1cmF0aW9uLlxuICAgIGApO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRG9uJ3Qgd2FpdCBmb3IgZXhpdCB0cmFuc2l0aW9ucyBpZiBhIHVzZXIgcHJlZmVycyByZWR1Y2VkIG1vdGlvbi5cbiAgLy8gSWRlYWxseSB0cmFuc2l0aW9ucyB3aWxsIGJlIGRpc2FibGVkIGluIENTUywgd2hpY2ggbWVhbnMgd2Ugc2hvdWxkIG5vdCB3YWl0XG4gIC8vIGJlZm9yZSBhZGRpbmcgYGhpZGRlbmAuXG4gIGlmICh3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKS5tYXRjaGVzKSB7XG4gICAgd2FpdE1vZGUgPSAnaW1tZWRpYXRlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBldmVudCBsaXN0ZW5lciB0byBhZGQgYGhpZGRlbmAgYWZ0ZXIgb3VyIGFuaW1hdGlvbnMgY29tcGxldGUuXG4gICAqIFRoaXMgbGlzdGVuZXIgd2lsbCByZW1vdmUgaXRzZWxmIGFmdGVyIGNvbXBsZXRpbmcuXG4gICAqL1xuICBjb25zdCBsaXN0ZW5lciA9IGUgPT4ge1xuICAgIC8vIENvbmZpcm0gYHRyYW5zaXRpb25lbmRgIHdhcyBjYWxsZWQgb24gIG91ciBgZWxlbWVudGAgYW5kIGRpZG4ndCBidWJibGVcbiAgICAvLyB1cCBmcm9tIGEgY2hpbGQgZWxlbWVudC5cbiAgICBpZiAoZS50YXJnZXQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFwcGx5SGlkZGVuQXR0cmlidXRlcyA9ICgpID0+IHtcbiAgICBpZihoaWRlTW9kZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogU2hvdyB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25TaG93KCkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGlzIGxpc3RlbmVyIHNob3VsZG4ndCBiZSBoZXJlIGJ1dCBpZiBzb21lb25lIHNwYW1zIHRoZSB0b2dnbGVcbiAgICAgICAqIG92ZXIgYW5kIG92ZXIgcmVhbGx5IGZhc3QgaXQgY2FuIGluY29ycmVjdGx5IHN0aWNrIGFyb3VuZC5cbiAgICAgICAqIFdlIHJlbW92ZSBpdCBqdXN0IHRvIGJlIHNhZmUuXG4gICAgICAgKi9cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBTaW1pbGFybHksIHdlJ2xsIGNsZWFyIHRoZSB0aW1lb3V0IGluIGNhc2UgaXQncyBzdGlsbCBoYW5naW5nIGFyb3VuZC5cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgIH1cblxuICAgICAgcmVtb3ZlSGlkZGVuQXR0cmlidXRlcygpO1xuXG4gICAgICAvKipcbiAgICAgICAqIEZvcmNlIGEgYnJvd3NlciByZS1wYWludCBzbyB0aGUgYnJvd3NlciB3aWxsIHJlYWxpemUgdGhlXG4gICAgICAgKiBlbGVtZW50IGlzIG5vIGxvbmdlciBgaGlkZGVuYCBhbmQgYWxsb3cgdHJhbnNpdGlvbnMuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHJlZmxvdyA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSGlkZSB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHRyYW5zaXRpb25IaWRlKCkge1xuICAgICAgaWYgKHdhaXRNb2RlID09PSAndHJhbnNpdGlvbmVuZCcpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuICAgICAgfSBlbHNlIGlmICh3YWl0TW9kZSA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuICAgICAgICB9LCB0aW1lb3V0RHVyYXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCB0aGlzIGNsYXNzIHRvIHRyaWdnZXIgb3VyIGFuaW1hdGlvblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHZpc2libGVDbGFzcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZSB0aGUgZWxlbWVudCdzIHZpc2liaWxpdHlcbiAgICAgKi9cbiAgICB0b2dnbGUoKSB7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlbigpKSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvblNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGVsbCB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIGhpZGRlbiBvciBub3QuXG4gICAgICovXG4gICAgaXNIaWRkZW4oKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBoaWRkZW4gYXR0cmlidXRlIGRvZXMgbm90IHJlcXVpcmUgYSB2YWx1ZS4gU2luY2UgYW4gZW1wdHkgc3RyaW5nIGlzXG4gICAgICAgKiBmYWxzeSwgYnV0IHNob3dzIHRoZSBwcmVzZW5jZSBvZiBhbiBhdHRyaWJ1dGUgd2UgY29tcGFyZSB0byBgbnVsbGBcbiAgICAgICAqL1xuICAgICAgY29uc3QgaGFzSGlkZGVuQXR0cmlidXRlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hpZGRlbicpICE9PSBudWxsO1xuXG4gICAgICBjb25zdCBpc0Rpc3BsYXlOb25lID0gZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZSc7XG5cbiAgICAgIGNvbnN0IGhhc1Zpc2libGVDbGFzcyA9IFsuLi5lbGVtZW50LmNsYXNzTGlzdF0uaW5jbHVkZXModmlzaWJsZUNsYXNzKTtcblxuICAgICAgcmV0dXJuIGhhc0hpZGRlbkF0dHJpYnV0ZSB8fCBpc0Rpc3BsYXlOb25lIHx8ICFoYXNWaXNpYmxlQ2xhc3M7XG4gICAgfSxcblxuICAgIC8vIEEgcGxhY2Vob2xkZXIgZm9yIG91ciBgdGltZW91dGBcbiAgICB0aW1lb3V0OiBudWxsXG4gIH07XG59IiwiLyoqXG4gIFByaW9yaXR5KyBob3Jpem9udGFsIHNjcm9sbGluZyBtZW51LlxuXG4gIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgLSBDb250YWluZXIgZm9yIGFsbCBvcHRpb25zLlxuICAgIEBwYXJhbSB7c3RyaW5nIHx8IERPTSBub2RlfSBzZWxlY3RvciAtIEVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IG5hdlNlbGVjdG9yIC0gTmF2IGVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRTZWxlY3RvciAtIENvbnRlbnQgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gaXRlbVNlbGVjdG9yIC0gSXRlbXMgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvbkxlZnRTZWxlY3RvciAtIExlZnQgYnV0dG9uIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBidXR0b25SaWdodFNlbGVjdG9yIC0gUmlnaHQgYnV0dG9uIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7aW50ZWdlciB8fCBzdHJpbmd9IHNjcm9sbFN0ZXAgLSBBbW91bnQgdG8gc2Nyb2xsIG9uIGJ1dHRvbiBjbGljay4gJ2F2ZXJhZ2UnIGdldHMgdGhlIGF2ZXJhZ2UgbGluayB3aWR0aC5cbiovXG5cbmNvbnN0IFByaW9yaXR5TmF2U2Nyb2xsZXIgPSBmdW5jdGlvbih7XG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXInLFxuICAgIG5hdlNlbGVjdG9yOiBuYXZTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLW5hdicsXG4gICAgY29udGVudFNlbGVjdG9yOiBjb250ZW50U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1jb250ZW50JyxcbiAgICBpdGVtU2VsZWN0b3I6IGl0ZW1TZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWl0ZW0nLFxuICAgIGJ1dHRvbkxlZnRTZWxlY3RvcjogYnV0dG9uTGVmdFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0JyxcbiAgICBidXR0b25SaWdodFNlbGVjdG9yOiBidXR0b25SaWdodFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItYnRuLS1yaWdodCcsXG4gICAgc2Nyb2xsU3RlcDogc2Nyb2xsU3RlcCA9IDgwXG4gIH0gPSB7fSkge1xuXG4gIGNvbnN0IG5hdlNjcm9sbGVyID0gdHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIDogc2VsZWN0b3I7XG5cbiAgY29uc3QgdmFsaWRhdGVTY3JvbGxTdGVwID0gKCkgPT4ge1xuICAgIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKHNjcm9sbFN0ZXApIHx8IHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJztcbiAgfVxuXG4gIGlmIChuYXZTY3JvbGxlciA9PT0gdW5kZWZpbmVkIHx8IG5hdlNjcm9sbGVyID09PSBudWxsIHx8ICF2YWxpZGF0ZVNjcm9sbFN0ZXAoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgc29tZXRoaW5nIHdyb25nLCBjaGVjayB5b3VyIG9wdGlvbnMuJyk7XG4gIH1cblxuICBjb25zdCBuYXZTY3JvbGxlck5hdiA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IobmF2U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckNvbnRlbnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGNvbnRlbnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zID0gbmF2U2Nyb2xsZXJDb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoaXRlbVNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJMZWZ0ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihidXR0b25MZWZ0U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlclJpZ2h0ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihidXR0b25SaWdodFNlbGVjdG9yKTtcblxuICBsZXQgc2Nyb2xsaW5nID0gZmFsc2U7XG4gIGxldCBzY3JvbGxBdmFpbGFibGVMZWZ0ID0gMDtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID0gMDtcbiAgbGV0IHNjcm9sbGluZ0RpcmVjdGlvbiA9ICcnO1xuICBsZXQgc2Nyb2xsT3ZlcmZsb3cgPSAnJztcbiAgbGV0IHRpbWVvdXQ7XG5cblxuICAvLyBTZXRzIG92ZXJmbG93IGFuZCB0b2dnbGUgYnV0dG9ucyBhY2NvcmRpbmdseVxuICBjb25zdCBzZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIHNjcm9sbE92ZXJmbG93ID0gZ2V0T3ZlcmZsb3coKTtcbiAgICB0b2dnbGVCdXR0b25zKHNjcm9sbE92ZXJmbG93KTtcbiAgICBjYWxjdWxhdGVTY3JvbGxTdGVwKCk7XG4gIH1cblxuXG4gIC8vIERlYm91bmNlIHNldHRpbmcgdGhlIG92ZXJmbG93IHdpdGggcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIGNvbnN0IHJlcXVlc3RTZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aW1lb3V0KSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGltZW91dCk7XG5cbiAgICB0aW1lb3V0ID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBzZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuICB9XG5cblxuICAvLyBHZXRzIHRoZSBvdmVyZmxvdyBhdmFpbGFibGUgb24gdGhlIG5hdiBzY3JvbGxlclxuICBjb25zdCBnZXRPdmVyZmxvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzY3JvbGxXaWR0aCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbFdpZHRoO1xuICAgIGxldCBzY3JvbGxWaWV3cG9ydCA9IG5hdlNjcm9sbGVyTmF2LmNsaWVudFdpZHRoO1xuICAgIGxldCBzY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdDtcblxuICAgIHNjcm9sbEF2YWlsYWJsZUxlZnQgPSBzY3JvbGxMZWZ0O1xuICAgIHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID0gc2Nyb2xsV2lkdGggLSAoc2Nyb2xsVmlld3BvcnQgKyBzY3JvbGxMZWZ0KTtcblxuICAgIC8vIDEgaW5zdGVhZCBvZiAwIHRvIGNvbXBlbnNhdGUgZm9yIG51bWJlciByb3VuZGluZ1xuICAgIGxldCBzY3JvbGxMZWZ0Q29uZGl0aW9uID0gc2Nyb2xsQXZhaWxhYmxlTGVmdCA+IDE7XG4gICAgbGV0IHNjcm9sbFJpZ2h0Q29uZGl0aW9uID0gc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPiAxO1xuXG4gICAgLy8gY29uc29sZS5sb2coc2Nyb2xsV2lkdGgsIHNjcm9sbFZpZXdwb3J0LCBzY3JvbGxBdmFpbGFibGVMZWZ0LCBzY3JvbGxBdmFpbGFibGVSaWdodCk7XG5cbiAgICBpZiAoc2Nyb2xsTGVmdENvbmRpdGlvbiAmJiBzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdib3RoJztcbiAgICB9XG4gICAgZWxzZSBpZiAoc2Nyb2xsTGVmdENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdsZWZ0JztcbiAgICB9XG4gICAgZWxzZSBpZiAoc2Nyb2xsUmlnaHRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAncmlnaHQnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiAnbm9uZSc7XG4gICAgfVxuXG4gIH1cblxuXG4gIC8vIENhbGN1bGF0ZXMgdGhlIHNjcm9sbCBzdGVwIGJhc2VkIG9uIHRoZSB3aWR0aCBvZiB0aGUgc2Nyb2xsZXIgYW5kIHRoZSBudW1iZXIgb2YgbGlua3NcbiAgY29uc3QgY2FsY3VsYXRlU2Nyb2xsU3RlcCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzY3JvbGxTdGVwID09PSAnYXZlcmFnZScpIHtcbiAgICAgIGxldCBzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbFdpZHRoIC0gKHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWxlZnQnKSkgKyBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1yaWdodCcpKSk7XG5cbiAgICAgIGxldCBzY3JvbGxTdGVwQXZlcmFnZSA9IE1hdGguZmxvb3Ioc2Nyb2xsVmlld3BvcnROb1BhZGRpbmcgLyBuYXZTY3JvbGxlckNvbnRlbnRJdGVtcy5sZW5ndGgpO1xuXG4gICAgICBzY3JvbGxTdGVwID0gc2Nyb2xsU3RlcEF2ZXJhZ2U7XG4gICAgfVxuICB9XG5cblxuICAvLyBNb3ZlIHRoZSBzY3JvbGxlciB3aXRoIGEgdHJhbnNmb3JtXG4gIGNvbnN0IG1vdmVTY3JvbGxlciA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuXG4gICAgaWYgKHNjcm9sbGluZyA9PT0gdHJ1ZSB8fCAoc2Nyb2xsT3ZlcmZsb3cgIT09IGRpcmVjdGlvbiAmJiBzY3JvbGxPdmVyZmxvdyAhPT0gJ2JvdGgnKSkgcmV0dXJuO1xuXG4gICAgbGV0IHNjcm9sbERpc3RhbmNlID0gc2Nyb2xsU3RlcDtcbiAgICBsZXQgc2Nyb2xsQXZhaWxhYmxlID0gZGlyZWN0aW9uID09PSAnbGVmdCcgPyBzY3JvbGxBdmFpbGFibGVMZWZ0IDogc2Nyb2xsQXZhaWxhYmxlUmlnaHQ7XG5cbiAgICAvLyBJZiB0aGVyZSB3aWxsIGJlIGxlc3MgdGhhbiAyNSUgb2YgdGhlIGxhc3Qgc3RlcCB2aXNpYmxlIHRoZW4gc2Nyb2xsIHRvIHRoZSBlbmRcbiAgICBpZiAoc2Nyb2xsQXZhaWxhYmxlIDwgKHNjcm9sbFN0ZXAgKiAxLjc1KSkge1xuICAgICAgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxBdmFpbGFibGU7XG4gICAgfVxuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgc2Nyb2xsRGlzdGFuY2UgKj0gLTE7XG5cbiAgICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCBzY3JvbGxTdGVwKSB7XG4gICAgICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QuYWRkKCdzbmFwLWFsaWduLWVuZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJyk7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKCcgKyBzY3JvbGxEaXN0YW5jZSArICdweCknO1xuXG4gICAgc2Nyb2xsaW5nRGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHNjcm9sbGluZyA9IHRydWU7XG4gIH1cblxuXG4gIC8vIFNldCB0aGUgc2Nyb2xsZXIgcG9zaXRpb24gYW5kIHJlbW92ZXMgdHJhbnNmb3JtLCBjYWxsZWQgYWZ0ZXIgbW92ZVNjcm9sbGVyKCkgaW4gdGhlIHRyYW5zaXRpb25lbmQgZXZlbnRcbiAgY29uc3Qgc2V0U2Nyb2xsZXJQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCwgbnVsbCk7XG4gICAgdmFyIHRyYW5zZm9ybSA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3RyYW5zZm9ybScpO1xuICAgIHZhciB0cmFuc2Zvcm1WYWx1ZSA9IE1hdGguYWJzKHBhcnNlSW50KHRyYW5zZm9ybS5zcGxpdCgnLCcpWzRdKSB8fCAwKTtcblxuICAgIGlmIChzY3JvbGxpbmdEaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuICAgICAgdHJhbnNmb3JtVmFsdWUgKj0gLTE7XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJyc7XG4gICAgbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQgKyB0cmFuc2Zvcm1WYWx1ZTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnbm8tdHJhbnNpdGlvbicsICdzbmFwLWFsaWduLWVuZCcpO1xuXG4gICAgc2Nyb2xsaW5nID0gZmFsc2U7XG4gIH1cblxuXG4gIC8vIFRvZ2dsZSBidXR0b25zIGRlcGVuZGluZyBvbiBvdmVyZmxvd1xuICBjb25zdCB0b2dnbGVCdXR0b25zID0gZnVuY3Rpb24ob3ZlcmZsb3cpIHtcbiAgICBpZiAob3ZlcmZsb3cgPT09ICdib3RoJyB8fCBvdmVyZmxvdyA9PT0gJ2xlZnQnKSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJMZWZ0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cblxuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAncmlnaHQnKSB7XG4gICAgICBuYXZTY3JvbGxlclJpZ2h0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuICB9XG5cblxuICBjb25zdCBpbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICBzZXRPdmVyZmxvdygpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHJlcXVlc3RTZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJOYXYuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsICgpID0+IHtcbiAgICAgIHNldFNjcm9sbGVyUG9zaXRpb24oKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyTGVmdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1vdmVTY3JvbGxlcignbGVmdCcpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJSaWdodC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIG1vdmVTY3JvbGxlcigncmlnaHQnKTtcbiAgICB9KTtcblxuICB9O1xuXG5cbiAgLy8gU2VsZiBpbml0XG4gIGluaXQoKTtcblxuXG4gIC8vIFJldmVhbCBBUElcbiAgcmV0dXJuIHtcbiAgICBpbml0XG4gIH07XG5cbn07XG5cbi8vZXhwb3J0IGRlZmF1bHQgUHJpb3JpdHlOYXZTY3JvbGxlcjtcbiIsIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1widXNlIHN0cmljdFwiO3ZhciBfdmFsaWRGb3JtPXJlcXVpcmUoXCIuL3NyYy92YWxpZC1mb3JtXCIpO3ZhciBfdmFsaWRGb3JtMj1faW50ZXJvcFJlcXVpcmVEZWZhdWx0KF92YWxpZEZvcm0pO2Z1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKXtyZXR1cm4gb2JqJiZvYmouX19lc01vZHVsZT9vYmo6e2RlZmF1bHQ6b2JqfX13aW5kb3cuVmFsaWRGb3JtPV92YWxpZEZvcm0yLmRlZmF1bHQ7d2luZG93LlZhbGlkRm9ybS50b2dnbGVJbnZhbGlkQ2xhc3M9X3ZhbGlkRm9ybS50b2dnbGVJbnZhbGlkQ2xhc3M7d2luZG93LlZhbGlkRm9ybS5oYW5kbGVDdXN0b21NZXNzYWdlcz1fdmFsaWRGb3JtLmhhbmRsZUN1c3RvbU1lc3NhZ2VzO3dpbmRvdy5WYWxpZEZvcm0uaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXk9X3ZhbGlkRm9ybS5oYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheX0se1wiLi9zcmMvdmFsaWQtZm9ybVwiOjN9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6dHJ1ZX0pO2V4cG9ydHMuY2xvbmU9Y2xvbmU7ZXhwb3J0cy5kZWZhdWx0cz1kZWZhdWx0cztleHBvcnRzLmluc2VydEFmdGVyPWluc2VydEFmdGVyO2V4cG9ydHMuaW5zZXJ0QmVmb3JlPWluc2VydEJlZm9yZTtleHBvcnRzLmZvckVhY2g9Zm9yRWFjaDtleHBvcnRzLmRlYm91bmNlPWRlYm91bmNlO2Z1bmN0aW9uIGNsb25lKG9iail7dmFyIGNvcHk9e307Zm9yKHZhciBhdHRyIGluIG9iail7aWYob2JqLmhhc093blByb3BlcnR5KGF0dHIpKWNvcHlbYXR0cl09b2JqW2F0dHJdfXJldHVybiBjb3B5fWZ1bmN0aW9uIGRlZmF1bHRzKG9iaixkZWZhdWx0T2JqZWN0KXtvYmo9Y2xvbmUob2JqfHx7fSk7Zm9yKHZhciBrIGluIGRlZmF1bHRPYmplY3Qpe2lmKG9ialtrXT09PXVuZGVmaW5lZClvYmpba109ZGVmYXVsdE9iamVjdFtrXX1yZXR1cm4gb2JqfWZ1bmN0aW9uIGluc2VydEFmdGVyKHJlZk5vZGUsbm9kZVRvSW5zZXJ0KXt2YXIgc2libGluZz1yZWZOb2RlLm5leHRTaWJsaW5nO2lmKHNpYmxpbmcpe3ZhciBfcGFyZW50PXJlZk5vZGUucGFyZW50Tm9kZTtfcGFyZW50Lmluc2VydEJlZm9yZShub2RlVG9JbnNlcnQsc2libGluZyl9ZWxzZXtwYXJlbnQuYXBwZW5kQ2hpbGQobm9kZVRvSW5zZXJ0KX19ZnVuY3Rpb24gaW5zZXJ0QmVmb3JlKHJlZk5vZGUsbm9kZVRvSW5zZXJ0KXt2YXIgcGFyZW50PXJlZk5vZGUucGFyZW50Tm9kZTtwYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGVUb0luc2VydCxyZWZOb2RlKX1mdW5jdGlvbiBmb3JFYWNoKGl0ZW1zLGZuKXtpZighaXRlbXMpcmV0dXJuO2lmKGl0ZW1zLmZvckVhY2gpe2l0ZW1zLmZvckVhY2goZm4pfWVsc2V7Zm9yKHZhciBpPTA7aTxpdGVtcy5sZW5ndGg7aSsrKXtmbihpdGVtc1tpXSxpLGl0ZW1zKX19fWZ1bmN0aW9uIGRlYm91bmNlKG1zLGZuKXt2YXIgdGltZW91dD12b2lkIDA7dmFyIGRlYm91bmNlZEZuPWZ1bmN0aW9uIGRlYm91bmNlZEZuKCl7Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO3RpbWVvdXQ9c2V0VGltZW91dChmbixtcyl9O3JldHVybiBkZWJvdW5jZWRGbn19LHt9XSwzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6dHJ1ZX0pO2V4cG9ydHMudG9nZ2xlSW52YWxpZENsYXNzPXRvZ2dsZUludmFsaWRDbGFzcztleHBvcnRzLmhhbmRsZUN1c3RvbU1lc3NhZ2VzPWhhbmRsZUN1c3RvbU1lc3NhZ2VzO2V4cG9ydHMuaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXk9aGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXk7ZXhwb3J0cy5kZWZhdWx0PXZhbGlkRm9ybTt2YXIgX3V0aWw9cmVxdWlyZShcIi4vdXRpbFwiKTtmdW5jdGlvbiB0b2dnbGVJbnZhbGlkQ2xhc3MoaW5wdXQsaW52YWxpZENsYXNzKXtpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW52YWxpZFwiLGZ1bmN0aW9uKCl7aW5wdXQuY2xhc3NMaXN0LmFkZChpbnZhbGlkQ2xhc3MpfSk7aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsZnVuY3Rpb24oKXtpZihpbnB1dC52YWxpZGl0eS52YWxpZCl7aW5wdXQuY2xhc3NMaXN0LnJlbW92ZShpbnZhbGlkQ2xhc3MpfX0pfXZhciBlcnJvclByb3BzPVtcImJhZElucHV0XCIsXCJwYXR0ZXJuTWlzbWF0Y2hcIixcInJhbmdlT3ZlcmZsb3dcIixcInJhbmdlVW5kZXJmbG93XCIsXCJzdGVwTWlzbWF0Y2hcIixcInRvb0xvbmdcIixcInRvb1Nob3J0XCIsXCJ0eXBlTWlzbWF0Y2hcIixcInZhbHVlTWlzc2luZ1wiLFwiY3VzdG9tRXJyb3JcIl07ZnVuY3Rpb24gZ2V0Q3VzdG9tTWVzc2FnZShpbnB1dCxjdXN0b21NZXNzYWdlcyl7Y3VzdG9tTWVzc2FnZXM9Y3VzdG9tTWVzc2FnZXN8fHt9O3ZhciBsb2NhbEVycm9yUHJvcHM9W2lucHV0LnR5cGUrXCJNaXNtYXRjaFwiXS5jb25jYXQoZXJyb3JQcm9wcyk7dmFyIHZhbGlkaXR5PWlucHV0LnZhbGlkaXR5O2Zvcih2YXIgaT0wO2k8bG9jYWxFcnJvclByb3BzLmxlbmd0aDtpKyspe3ZhciBwcm9wPWxvY2FsRXJyb3JQcm9wc1tpXTtpZih2YWxpZGl0eVtwcm9wXSl7cmV0dXJuIGlucHV0LmdldEF0dHJpYnV0ZShcImRhdGEtXCIrcHJvcCl8fGN1c3RvbU1lc3NhZ2VzW3Byb3BdfX19ZnVuY3Rpb24gaGFuZGxlQ3VzdG9tTWVzc2FnZXMoaW5wdXQsY3VzdG9tTWVzc2FnZXMpe2Z1bmN0aW9uIGNoZWNrVmFsaWRpdHkoKXt2YXIgbWVzc2FnZT1pbnB1dC52YWxpZGl0eS52YWxpZD9udWxsOmdldEN1c3RvbU1lc3NhZ2UoaW5wdXQsY3VzdG9tTWVzc2FnZXMpO2lucHV0LnNldEN1c3RvbVZhbGlkaXR5KG1lc3NhZ2V8fFwiXCIpfWlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLGNoZWNrVmFsaWRpdHkpO2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnZhbGlkXCIsY2hlY2tWYWxpZGl0eSl9ZnVuY3Rpb24gaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkoaW5wdXQsb3B0aW9ucyl7dmFyIHZhbGlkYXRpb25FcnJvckNsYXNzPW9wdGlvbnMudmFsaWRhdGlvbkVycm9yQ2xhc3MsdmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3M9b3B0aW9ucy52YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzcyxlcnJvclBsYWNlbWVudD1vcHRpb25zLmVycm9yUGxhY2VtZW50O2Z1bmN0aW9uIGNoZWNrVmFsaWRpdHkob3B0aW9ucyl7dmFyIGluc2VydEVycm9yPW9wdGlvbnMuaW5zZXJ0RXJyb3I7dmFyIHBhcmVudE5vZGU9aW5wdXQucGFyZW50Tm9kZTt2YXIgZXJyb3JOb2RlPXBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihcIi5cIit2YWxpZGF0aW9uRXJyb3JDbGFzcyl8fGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7aWYoIWlucHV0LnZhbGlkaXR5LnZhbGlkJiZpbnB1dC52YWxpZGF0aW9uTWVzc2FnZSl7ZXJyb3JOb2RlLmNsYXNzTmFtZT12YWxpZGF0aW9uRXJyb3JDbGFzcztlcnJvck5vZGUudGV4dENvbnRlbnQ9aW5wdXQudmFsaWRhdGlvbk1lc3NhZ2U7aWYoaW5zZXJ0RXJyb3Ipe2Vycm9yUGxhY2VtZW50PT09XCJiZWZvcmVcIj8oMCxfdXRpbC5pbnNlcnRCZWZvcmUpKGlucHV0LGVycm9yTm9kZSk6KDAsX3V0aWwuaW5zZXJ0QWZ0ZXIpKGlucHV0LGVycm9yTm9kZSk7cGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzKX19ZWxzZXtwYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUodmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3MpO2Vycm9yTm9kZS5yZW1vdmUoKX19aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsZnVuY3Rpb24oKXtjaGVja1ZhbGlkaXR5KHtpbnNlcnRFcnJvcjpmYWxzZX0pfSk7aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImludmFsaWRcIixmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCk7Y2hlY2tWYWxpZGl0eSh7aW5zZXJ0RXJyb3I6dHJ1ZX0pfSl9dmFyIGRlZmF1bHRPcHRpb25zPXtpbnZhbGlkQ2xhc3M6XCJpbnZhbGlkXCIsdmFsaWRhdGlvbkVycm9yQ2xhc3M6XCJ2YWxpZGF0aW9uLWVycm9yXCIsdmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3M6XCJoYXMtdmFsaWRhdGlvbi1lcnJvclwiLGN1c3RvbU1lc3NhZ2VzOnt9LGVycm9yUGxhY2VtZW50OlwiYmVmb3JlXCJ9O2Z1bmN0aW9uIHZhbGlkRm9ybShlbGVtZW50LG9wdGlvbnMpe2lmKCFlbGVtZW50fHwhZWxlbWVudC5ub2RlTmFtZSl7dGhyb3cgbmV3IEVycm9yKFwiRmlyc3QgYXJnIHRvIHZhbGlkRm9ybSBtdXN0IGJlIGEgZm9ybSwgaW5wdXQsIHNlbGVjdCwgb3IgdGV4dGFyZWFcIil9dmFyIGlucHV0cz12b2lkIDA7dmFyIHR5cGU9ZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO29wdGlvbnM9KDAsX3V0aWwuZGVmYXVsdHMpKG9wdGlvbnMsZGVmYXVsdE9wdGlvbnMpO2lmKHR5cGU9PT1cImZvcm1cIil7aW5wdXRzPWVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0LCBzZWxlY3QsIHRleHRhcmVhXCIpO2ZvY3VzSW52YWxpZElucHV0KGVsZW1lbnQsaW5wdXRzKX1lbHNlIGlmKHR5cGU9PT1cImlucHV0XCJ8fHR5cGU9PT1cInNlbGVjdFwifHx0eXBlPT09XCJ0ZXh0YXJlYVwiKXtpbnB1dHM9W2VsZW1lbnRdfWVsc2V7dGhyb3cgbmV3IEVycm9yKFwiT25seSBmb3JtLCBpbnB1dCwgc2VsZWN0LCBvciB0ZXh0YXJlYSBlbGVtZW50cyBhcmUgc3VwcG9ydGVkXCIpfXZhbGlkRm9ybUlucHV0cyhpbnB1dHMsb3B0aW9ucyl9ZnVuY3Rpb24gZm9jdXNJbnZhbGlkSW5wdXQoZm9ybSxpbnB1dHMpe3ZhciBmb2N1c0ZpcnN0PSgwLF91dGlsLmRlYm91bmNlKSgxMDAsZnVuY3Rpb24oKXt2YXIgaW52YWxpZE5vZGU9Zm9ybS5xdWVyeVNlbGVjdG9yKFwiOmludmFsaWRcIik7aWYoaW52YWxpZE5vZGUpaW52YWxpZE5vZGUuZm9jdXMoKX0pOygwLF91dGlsLmZvckVhY2gpKGlucHV0cyxmdW5jdGlvbihpbnB1dCl7cmV0dXJuIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnZhbGlkXCIsZm9jdXNGaXJzdCl9KX1mdW5jdGlvbiB2YWxpZEZvcm1JbnB1dHMoaW5wdXRzLG9wdGlvbnMpe3ZhciBpbnZhbGlkQ2xhc3M9b3B0aW9ucy5pbnZhbGlkQ2xhc3MsY3VzdG9tTWVzc2FnZXM9b3B0aW9ucy5jdXN0b21NZXNzYWdlczsoMCxfdXRpbC5mb3JFYWNoKShpbnB1dHMsZnVuY3Rpb24oaW5wdXQpe3RvZ2dsZUludmFsaWRDbGFzcyhpbnB1dCxpbnZhbGlkQ2xhc3MpO2hhbmRsZUN1c3RvbU1lc3NhZ2VzKGlucHV0LGN1c3RvbU1lc3NhZ2VzKTtoYW5kbGVDdXN0b21NZXNzYWdlRGlzcGxheShpbnB1dCxvcHRpb25zKX0pfX0se1wiLi91dGlsXCI6Mn1dfSx7fSxbMV0pOyIsIi8qKlxuICogRG8gdGhlc2UgdGhpbmdzIGFzIHF1aWNrbHkgYXMgcG9zc2libGU7IHdlIG1pZ2h0IGhhdmUgQ1NTIG9yIGVhcmx5IHNjcmlwdHMgdGhhdCByZXF1aXJlIG9uIGl0XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICduby1qcycgKTtcbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCAnanMnICk7XG4iLCIvKipcbiAqIFRoaXMgaXMgdXNlZCB0byBjYXVzZSBHb29nbGUgQW5hbHl0aWNzIGV2ZW50cyB0byBydW5cbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8qXG4gKiBDYWxsIGhvb2tzIGZyb20gb3RoZXIgcGxhY2VzLlxuICogVGhpcyBhbGxvd3Mgb3RoZXIgcGx1Z2lucyB0aGF0IHdlIG1haW50YWluIHRvIHBhc3MgZGF0YSB0byB0aGUgdGhlbWUncyBhbmFseXRpY3MgbWV0aG9kLlxuKi9cbmlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiB3cCApIHtcblx0Ly8gZm9yIGFuYWx5dGljc1xuXHR3cC5ob29rcy5hZGRBY3Rpb24oICd3cE1lc3NhZ2VJbnNlcnRlckFuYWx5dGljc0V2ZW50JywgJ21pbm5wb3N0TGFyZ28nLCBtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQsIDEwICk7XG5cdHdwLmhvb2tzLmFkZEFjdGlvbiggJ21pbm5wb3N0Rm9ybVByb2Nlc3Nvck1haWxjaGltcEFuYWx5dGljc0V2ZW50JywgJ21pbm5wb3N0TGFyZ28nLCBtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQsIDEwICk7XG5cdHdwLmhvb2tzLmFkZEFjdGlvbiggJ21pbm5wb3N0TWVtYmVyc2hpcEFuYWx5dGljc0V2ZW50JywgJ21pbm5wb3N0TGFyZ28nLCBtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQsIDEwICk7XG5cdHdwLmhvb2tzLmFkZEFjdGlvbiggJ21pbm5wb3N0TWVtYmVyc2hpcEFuYWx5dGljc0Vjb21tZXJjZUFjdGlvbicsICdtaW5ucG9zdExhcmdvJywgbXBBbmFseXRpY3NUcmFja2luZ0Vjb21tZXJjZUFjdGlvbiwgMTAgKTtcblxuXHQvLyBmb3IgZGF0YSBsYXllciB0byBHb29nbGUgVGFnIE1hbmFnZXJcblx0Ly93cC5ob29rcy5hZGRBY3Rpb24oICd3cE1lc3NhZ2VJbnNlcnRlckRhdGFMYXllckV2ZW50JywgJ21pbm5wb3N0TGFyZ28nLCBtcERhdGFMYXllckV2ZW50LCAxMCApO1xuXHR3cC5ob29rcy5hZGRBY3Rpb24oICdtaW5ucG9zdEZvcm1Qcm9jZXNzb3JNYWlsY2hpbXBEYXRhTGF5ZXJFdmVudCcsICdtaW5ucG9zdExhcmdvJywgbXBEYXRhTGF5ZXJFdmVudCwgMTAgKTtcblx0Ly93cC5ob29rcy5hZGRBY3Rpb24oICdtaW5ucG9zdE1lbWJlcnNoaXBEYXRhTGF5ZXJFdmVudCcsICdtaW5ucG9zdExhcmdvJywgbXBEYXRhTGF5ZXJFdmVudCwgMTAgKTtcblx0Ly93cC5ob29rcy5hZGRBY3Rpb24oICdtaW5ucG9zdE1lbWJlcnNoaXBEYXRhTGF5ZXJFY29tbWVyY2VBY3Rpb24nLCAnbWlubnBvc3RMYXJnbycsIG1wRGF0YUxheWVyRWNvbW1lcmNlLCAxMCApO1xufVxuXG4vKlxuICogQ3JlYXRlIGEgR29vZ2xlIEFuYWx5dGljcyBldmVudCBmb3IgdGhlIHRoZW1lLiBUaGlzIGNhbGxzIHRoZSB3cC1hbmFseXRpY3MtdHJhY2tpbmctZ2VuZXJhdG9yIGFjdGlvbi5cbiAqIHR5cGU6IGdlbmVyYWxseSB0aGlzIGlzIFwiZXZlbnRcIlxuICogY2F0ZWdvcnk6IEV2ZW50IENhdGVnb3J5XG4gKiBsYWJlbDogRXZlbnQgTGFiZWxcbiAqIGFjdGlvbjogRXZlbnQgQWN0aW9uXG4gKiB2YWx1ZTogb3B0aW9uYWxcbiAqIG5vbl9pbnRlcmFjdGlvbjogb3B0aW9uYWxcbiovXG5mdW5jdGlvbiBtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSwgbm9uX2ludGVyYWN0aW9uICkge1xuXHR3cC5ob29rcy5kb0FjdGlvbiggJ3dwQW5hbHl0aWNzVHJhY2tpbmdHZW5lcmF0b3JFdmVudCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSwgbm9uX2ludGVyYWN0aW9uICk7XG59XG5cbi8qXG4gKiBDcmVhdGUgYSBkYXRhbGF5ZXIgZXZlbnQgZm9yIHRoZSB0aGVtZSB1c2luZyB0aGUgZ3RtNHdwIHBsdWdpbi4gVGhpcyBzZXRzIHRoZSBkYXRhTGF5ZXIgb2JqZWN0IGZvciBHb29nbGUgVGFnIE1hbmFnZXIuXG4gKiBJdCBzaG91bGQgb25seSBoYXZlIGRhdGEgdGhhdCBpcyBub3QgYXZhaWFsYWJsZSB0byBHVE0gYnkgZGVmYXVsdC5cbiAqIGRhdGFMYXllckNvbnRlbnQ6IHRoZSBvYmplY3QgdGhhdCBzaG91bGQgYmUgYWRkZWRcbiovXG5mdW5jdGlvbiBtcERhdGFMYXllckV2ZW50KCBkYXRhTGF5ZXJDb250ZW50ICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgZGF0YUxheWVyICYmIE9iamVjdC5rZXlzKCBkYXRhTGF5ZXJDb250ZW50ICkubGVuZ3RoICE9PSAwICkge1xuXHRcdGRhdGFMYXllci5wdXNoKCBkYXRhTGF5ZXJDb250ZW50ICk7XG5cdH1cbn1cblxuLypcbiAqIENyZWF0ZSBhIEdvb2dsZSBBbmFseXRpY3MgRWNvbW1lcmNlIGFjdGlvbiBmb3IgdGhlIHRoZW1lLiBUaGlzIGNhbGxzIHRoZSB3cC1hbmFseXRpY3MtdHJhY2tpbmctZ2VuZXJhdG9yIGFjdGlvbi5cbiAqXG4qL1xuZnVuY3Rpb24gbXBBbmFseXRpY3NUcmFja2luZ0Vjb21tZXJjZUFjdGlvbiggdHlwZSwgYWN0aW9uLCBwcm9kdWN0LCBzdGVwICkge1xuXHR3cC5ob29rcy5kb0FjdGlvbiggJ3dwQW5hbHl0aWNzVHJhY2tpbmdHZW5lcmF0b3JFY29tbWVyY2VBY3Rpb24nLCB0eXBlLCBhY3Rpb24sIHByb2R1Y3QsIHN0ZXAgKTtcbn1cblxuLypcbiAqIFdoZW4gYSBwYXJ0IG9mIHRoZSB3ZWJzaXRlIGlzIG1lbWJlci1zcGVjaWZpYywgY3JlYXRlIGFuIGV2ZW50IGZvciB3aGV0aGVyIGl0IHdhcyBzaG93biBvciBub3QuXG4qL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEgJiYgJycgIT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS51cmxfYWNjZXNzX2xldmVsICkge1xuXHRcdHZhciB0eXBlID0gJ2V2ZW50Jztcblx0XHR2YXIgY2F0ZWdvcnkgPSAnTWVtYmVyIENvbnRlbnQnO1xuXHRcdHZhciBsYWJlbCA9IGxvY2F0aW9uLnBhdGhuYW1lOyAvLyBpIHRoaW5rIHdlIGNvdWxkIHBvc3NpYmx5IHB1dCBzb21lIGdyb3VwaW5nIGhlcmUsIGJ1dCB3ZSBkb24ndCBuZWNlc3NhcmlseSBoYXZlIGFjY2VzcyB0byBvbmUgYW5kIG1heWJlIGl0J3Mgbm90IHdvcnRod2hpbGUgeWV0XG5cdFx0dmFyIGFjdGlvbiA9ICdCbG9ja2VkJztcblx0XHRpZiAoIHRydWUgPT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS5jdXJyZW50X3VzZXIuY2FuX2FjY2VzcyApIHtcblx0XHRcdGFjdGlvbiA9ICdTaG93bic7XG5cdFx0fVxuXHRcdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0fVxufSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBzaGFyaW5nIGNvbnRlbnRcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8vIHRyYWNrIGEgc2hhcmUgdmlhIGFuYWx5dGljcyBldmVudC5cbmZ1bmN0aW9uIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uID0gJycgKSB7XG4gICAgdmFyIGNhdGVnb3J5ID0gJ1NoYXJlJztcbiAgICBpZiAoICcnICE9PSBwb3NpdGlvbiApIHtcbiAgICAgICAgY2F0ZWdvcnkgPSAnU2hhcmUgLSAnICsgcG9zaXRpb247XG4gICAgfVxuXG4gICAgLy8gdHJhY2sgYXMgYW4gZXZlbnRcbiAgICBtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsIGNhdGVnb3J5LCB0ZXh0LCBsb2NhdGlvbi5wYXRobmFtZSApO1xufVxuXG4vLyB0b3Agc2hhcmUgYnV0dG9uIGNsaWNrXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZW50cnktc2hhcmUtdG9wIGEnICkuZm9yRWFjaChcbiAgICB0b3BCdXR0b24gPT4gdG9wQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsICggZSApID0+IHtcbiAgICAgICAgdmFyIHRleHQgPSBlLmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCAnZGF0YS1zaGFyZS1hY3Rpb24nICk7XG4gICAgICAgIHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuICAgICAgICB0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xuICAgIH0gKVxuKTtcblxuLy8gd2hlbiB0aGUgcHJpbnQgYnV0dG9uIGlzIGNsaWNrZWRcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1wcmludCBhJyApLmZvckVhY2goXG4gICAgcHJpbnRCdXR0b24gPT4gcHJpbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCBlICkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHdpbmRvdy5wcmludCgpO1xuICAgIH0gKVxuKTtcblxuLy8gd2hlbiB0aGUgcmVwdWJsaXNoIGJ1dHRvbiBpcyBjbGlja2VkXG4vLyB0aGUgcGx1Z2luIGNvbnRyb2xzIHRoZSByZXN0LCBidXQgd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhlIGRlZmF1bHQgZXZlbnQgZG9lc24ndCBmaXJlXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtcmVwdWJsaXNoIGEnICkuZm9yRWFjaChcbiAgICByZXB1Ymxpc2hCdXR0b24gPT4gcmVwdWJsaXNoQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsICggZSApID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gKVxuKTtcblxuLy8gd2hlbiB0aGUgY29weSBsaW5rIGJ1dHRvbiBpcyBjbGlja2VkXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtY29weS11cmwgYScgKS5mb3JFYWNoKFxuICAgIGNvcHlCdXR0b24gPT4gY29weUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoIGUgKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGV0IGNvcHlUZXh0ID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KCBjb3B5VGV4dCApLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgIHRsaXRlLnNob3coICggZS50YXJnZXQgKSwgeyBncmF2OiAndycgfSApO1xuICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGxpdGUuaGlkZSggKCBlLnRhcmdldCApICk7XG4gICAgICAgICAgICB9LCAzMDAwICk7XG4gICAgICAgIH0gKTtcbiAgICB9IClcbik7XG5cbi8vIHdoZW4gc2hhcmluZyB2aWEgZmFjZWJvb2ssIHR3aXR0ZXIsIG9yIGVtYWlsLCBvcGVuIHRoZSBkZXN0aW5hdGlvbiB1cmwgaW4gYSBuZXcgd2luZG93XG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZmFjZWJvb2sgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtdHdpdHRlciBhLCAubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1lbWFpbCBhJyApLmZvckVhY2goXG4gICAgYW55U2hhcmVCdXR0b24gPT4gYW55U2hhcmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCBlICkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyIHVybCA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoICdocmVmJyApO1xuXHRcdHdpbmRvdy5vcGVuKCB1cmwsICdfYmxhbmsnICk7XG4gICAgfSApXG4pO1xuIiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogTmF2aWdhdGlvbiBzY3JpcHRzLiBJbmNsdWRlcyBtb2JpbGUgb3IgdG9nZ2xlIGJlaGF2aW9yLCBhbmFseXRpY3MgdHJhY2tpbmcgb2Ygc3BlY2lmaWMgbWVudXMuXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeSBpbiB0aGUgZnVuY3Rpb25zIGF0IHRoZSBib3R0b20uXG4gKi9cblxuZnVuY3Rpb24gc2V0dXBQcmltYXJ5TmF2KCkge1xuXHRjb25zdCBwcmltYXJ5TmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWxpbmtzJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgcHJpbWFyeU5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgYnV0dG9uJyApO1xuXHRpZiAoIG51bGwgIT09IHByaW1hcnlOYXZUb2dnbGUgKSB7XG5cdFx0cHJpbWFyeU5hdlRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdGNvbnN0IHVzZXJOYXZUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1hY2NvdW50IHVsJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgdXNlck5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1hY2NvdW50ID4gYScgKTtcblx0aWYgKCBudWxsICE9PSB1c2VyTmF2VG9nZ2xlICkge1xuXHRcdHVzZXJOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHR2YXIgdGFyZ2V0ICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ25hdiAubS1mb3JtLXNlYXJjaCBmaWVsZHNldCAuYS1idXR0b24tc2VudGVuY2UnICk7XG5cdGlmICggbnVsbCAhPT0gdGFyZ2V0ICkge1xuXHRcdHZhciBkaXYgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdGRpdi5pbm5lckhUTUwgPSAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImEtY2xvc2UtYnV0dG9uIGEtY2xvc2Utc2VhcmNoXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG5cdFx0dmFyIGZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRkaXYuc2V0QXR0cmlidXRlKCAnY2xhc3MnLCAnYS1jbG9zZS1ob2xkZXInICk7XG5cdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZCggZnJhZ21lbnQgKTtcblxuXHRcdGNvbnN0IHNlYXJjaFRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWFjdGlvbnMgLm0tZm9ybS1zZWFyY2gnICksXG5cdFx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdFx0fSApO1xuXG5cdFx0dmFyIHNlYXJjaFZpc2libGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbGkuc2VhcmNoID4gYScgKTtcblx0XHRzZWFyY2hWaXNpYmxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdHZhciBzZWFyY2hDbG9zZSAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmEtY2xvc2Utc2VhcmNoJyApO1xuXHRcdHNlYXJjaENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdGRvY3VtZW50Lm9ua2V5ZG93biA9IGZ1bmN0aW9uKCBldnQgKSB7XG5cdFx0ZXZ0ID0gZXZ0IHx8IHdpbmRvdy5ldmVudDtcblx0XHR2YXIgaXNFc2NhcGUgPSBmYWxzZTtcblx0XHRpZiAoICdrZXknIGluIGV2dCApIHtcblx0XHRcdGlzRXNjYXBlID0gKCAnRXNjYXBlJyA9PT0gZXZ0LmtleSB8fCAnRXNjJyA9PT0gZXZ0LmtleSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpc0VzY2FwZSA9ICggMjcgPT09IGV2dC5rZXlDb2RlICk7XG5cdFx0fVxuXHRcdGlmICggaXNFc2NhcGUgKSB7XG5cdFx0XHRsZXQgcHJpbWFyeU5hdkV4cGFuZGVkID0gJ3RydWUnID09PSBwcmltYXJ5TmF2VG9nZ2xlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRsZXQgdXNlck5hdkV4cGFuZGVkID0gJ3RydWUnID09PSB1c2VyTmF2VG9nZ2xlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRsZXQgc2VhcmNoSXNWaXNpYmxlID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHByaW1hcnlOYXZFeHBhbmRlZCAmJiB0cnVlID09PSBwcmltYXJ5TmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgcHJpbWFyeU5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgdXNlck5hdkV4cGFuZGVkICYmIHRydWUgPT09IHVzZXJOYXZFeHBhbmRlZCApIHtcblx0XHRcdFx0dXNlck5hdlRvZ2dsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISB1c2VyTmF2RXhwYW5kZWQgKTtcblx0XHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBzZWFyY2hJc1Zpc2libGUgJiYgdHJ1ZSA9PT0gc2VhcmNoSXNWaXNpYmxlICkge1xuXHRcdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHNlYXJjaElzVmlzaWJsZSApO1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5zZXR1cFByaW1hcnlOYXYoKTsgLy8gdGhpcyB3aG9sZSBmdW5jdGlvbiBkb2VzIG5vdCByZXF1aXJlIGpxdWVyeS5cblxuZnVuY3Rpb24gc2V0dXBTY3JvbGxOYXYoKSB7XG5cblx0bGV0IHN1Yk5hdlNjcm9sbGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1zdWItbmF2aWdhdGlvbicgKTtcblx0c3ViTmF2U2Nyb2xsZXJzLmZvckVhY2goICggY3VycmVudFZhbHVlICkgPT4ge1xuXHRcdFByaW9yaXR5TmF2U2Nyb2xsZXIoIHtcblx0XHRcdHNlbGVjdG9yOiBjdXJyZW50VmFsdWUsXG5cdFx0XHRuYXZTZWxlY3RvcjogJy5tLXN1Ym5hdi1uYXZpZ2F0aW9uJyxcblx0XHRcdGNvbnRlbnRTZWxlY3RvcjogJy5tLW1lbnUtc3ViLW5hdmlnYXRpb24nLFxuXHRcdFx0aXRlbVNlbGVjdG9yOiAnbGksIGEnLFxuXHRcdFx0YnV0dG9uTGVmdFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuXHRcdFx0YnV0dG9uUmlnaHRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1yaWdodCdcblx0XHR9ICk7XG5cdH0gKTtcblxuXHRsZXQgcGFnaW5hdGlvblNjcm9sbGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1wYWdpbmF0aW9uLW5hdmlnYXRpb24nICk7XG5cdHBhZ2luYXRpb25TY3JvbGxlcnMuZm9yRWFjaCggKCBjdXJyZW50VmFsdWUgKSA9PiB7XG5cdFx0UHJpb3JpdHlOYXZTY3JvbGxlcigge1xuXHRcdFx0c2VsZWN0b3I6IGN1cnJlbnRWYWx1ZSxcblx0XHRcdG5hdlNlbGVjdG9yOiAnLm0tcGFnaW5hdGlvbi1jb250YWluZXInLFxuXHRcdFx0Y29udGVudFNlbGVjdG9yOiAnLm0tcGFnaW5hdGlvbi1saXN0Jyxcblx0XHRcdGl0ZW1TZWxlY3RvcjogJ2xpLCBhJyxcblx0XHRcdGJ1dHRvbkxlZnRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0Jyxcblx0XHRcdGJ1dHRvblJpZ2h0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tcmlnaHQnXG5cdFx0fSApO1xuXHR9ICk7XG5cbn1cbnNldHVwU2Nyb2xsTmF2KCk7IC8vIHRoaXMgd2hvbGUgZnVuY3Rpb24gZG9lcyBub3QgcmVxdWlyZSBqcXVlcnkuXG5cblxuLy8gdGhpcyBpcyB0aGUgcGFydCB0aGF0IHJlcXVpcmVzIGpxdWVyeS5cbiQoICdhJywgJCggJy5vLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0dmFyIHdpZGdldFRpdGxlICAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXdpZGdldCcgKS5maW5kKCAnaDMnICkudGV4dCgpO1xuXHR2YXIgem9uZVRpdGxlICAgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0tem9uZScgKS5maW5kKCAnLmEtem9uZS10aXRsZScgKS50ZXh0KCk7XG5cdHZhciBzaWRlYmFyU2VjdGlvblRpdGxlID0gJyc7XG5cdGlmICggJycgIT09IHdpZGdldFRpdGxlICkge1xuXHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB3aWRnZXRUaXRsZTtcblx0fSBlbHNlIGlmICggJycgIT09IHpvbmVUaXRsZSApIHtcblx0XHRzaWRlYmFyU2VjdGlvblRpdGxlID0gem9uZVRpdGxlO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJTZWN0aW9uVGl0bGUgKTtcbn0gKTtcblxuJCggJ2EnLCAkKCAnLm0tcmVsYXRlZCcgKSApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCAnUmVsYXRlZCBTZWN0aW9uIExpbmsnLCAnQ2xpY2snLCBsb2NhdGlvbi5wYXRobmFtZSApO1xufSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBmb3Jtc1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG5qUXVlcnkuZm4udGV4dE5vZGVzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNvbnRlbnRzKCkuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKCB0aGlzLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSAmJiAnJyAhPT0gdGhpcy5ub2RlVmFsdWUudHJpbSgpICk7XG5cdH0gKTtcbn07XG5cbmZ1bmN0aW9uIGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoIGFjdGlvbiApIHtcblx0dmFyIG1hcmt1cCA9ICc8bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLWZvcm0tY29uZmlybVwiPjxsYWJlbD5BcmUgeW91IHN1cmU/IDxhIGlkPVwiYS1jb25maXJtLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ZZXM8L2E+IHwgPGEgaWQ9XCJhLXN0b3AtJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPk5vPC9hPjwvbGFiZWw+PC9saT4nO1xuXHRyZXR1cm4gbWFya3VwO1xufVxuXG5mdW5jdGlvbiBtYW5hZ2VFbWFpbHMoKSB7XG5cdHZhciBmb3JtICAgICAgICAgICAgICAgPSAkKCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScgKTtcblx0dmFyIHJlc3RSb290ICAgICAgICAgICA9IHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Quc2l0ZV91cmwgKyB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnJlc3RfbmFtZXNwYWNlO1xuXHR2YXIgZnVsbFVybCAgICAgICAgICAgID0gcmVzdFJvb3QgKyAnLycgKyAndXBkYXRlLXVzZXIvJztcblx0dmFyIGNvbmZpcm1DaGFuZ2UgICAgICA9ICcnO1xuXHR2YXIgbmV4dEVtYWlsQ291bnQgICAgID0gMTtcblx0dmFyIG5ld1ByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgb2xkUHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBwcmltYXJ5SWQgICAgICAgICAgPSAnJztcblx0dmFyIGVtYWlsVG9SZW1vdmUgICAgICA9ICcnO1xuXHR2YXIgY29uc29saWRhdGVkRW1haWxzID0gW107XG5cdHZhciBuZXdFbWFpbHMgICAgICAgICAgPSBbXTtcblx0dmFyIGFqYXhGb3JtRGF0YSAgICAgICA9ICcnO1xuXHR2YXIgdGhhdCAgICAgICAgICAgICAgID0gJyc7XG5cblx0Ly8gc3RhcnQgb3V0IHdpdGggbm8gcHJpbWFyeS9yZW1vdmFscyBjaGVja2VkXG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdC8vIGlmIHRoZXJlIGlzIGEgbGlzdCBvZiBlbWFpbHMgKG5vdCBqdXN0IGEgc2luZ2xlIGZvcm0gZmllbGQpXG5cdGlmICggMCA8ICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoICkge1xuXHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblxuXHRcdC8vIGlmIGEgdXNlciBzZWxlY3RzIGEgbmV3IHByaW1hcnksIG1vdmUgaXQgaW50byB0aGF0IHBvc2l0aW9uXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nLCBmdW5jdGlvbigpIHtcblxuXHRcdFx0bmV3UHJpbWFyeUVtYWlsID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdHByaW1hcnlJZCAgICAgICA9ICQoIHRoaXMgKS5wcm9wKCAnaWQnICkucmVwbGFjZSggJ3ByaW1hcnlfZW1haWxfJywgJycgKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdwcmltYXJ5LWNoYW5nZScgKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXG5cdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBtYWluIGhpZGRlbiBmb3JtIHZhbHVlXG5cdFx0XHRcdCQoICcjZW1haWwnICkudmFsKCBuZXdQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBzdWJtaXQgZm9ybSB2YWx1ZXMuXG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cblx0XHRcdFx0Ly8gdW5jaGVjayB0aGUgcmFkaW8gYnV0dG9uXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIGZvcm0gdmFsdWVzIHRvIHRoZSBvbGQgcHJpbWFyeSBlbWFpbFxuXHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjcmVtb3ZlX2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgY29uZmlybSBtZXNzYWdlXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHR9ICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjaGFuZ2UnLCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZW1haWxUb1JlbW92ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdyZW1vdmFsJyApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSAhPT0gZW1haWxUb1JlbW92ZSApIHtcblx0XHRcdFx0XHRjb25zb2xpZGF0ZWRFbWFpbHMucHVzaCggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyIGZvciByZW1vdmFsXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQvLyBpZiBjb25maXJtZWQsIHJlbW92ZSB0aGUgZW1haWwgYW5kIHN1Ym1pdCB0aGUgZm9ybVxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5mYWRlT3V0KCAnbm9ybWFsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLnJlbW92ZSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCAndmFsdWUgaXMgJyArIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8vIGlmIGEgdXNlciB3YW50cyB0byBhZGQgYW4gZW1haWwsIGdpdmUgdGhlbSBhIHByb3Blcmx5IG51bWJlcmVkIGZpZWxkXG5cdCQoICcubS1mb3JtLWVtYWlsJyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcgKS5iZWZvcmUoICc8ZGl2IGNsYXNzPVwiYS1pbnB1dC13aXRoLWJ1dHRvbiBhLWJ1dHRvbi1zZW50ZW5jZVwiPjxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIGlkPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIHZhbHVlPVwiXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBpZD1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBjbGFzcz1cImEtYnV0dG9uIGEtYnV0dG9uLWFkZC11c2VyLWVtYWlsXCI+QWRkPC9idXR0b24+PC9kaXY+JyApO1xuXHRcdG5leHRFbWFpbENvdW50Kys7XG5cdH0gKTtcblxuXHQkKCAnaW5wdXRbdHlwZT1zdWJtaXRdJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgYnV0dG9uID0gJCggdGhpcyApO1xuXHRcdHZhciBidXR0b25Gb3JtID0gYnV0dG9uLmNsb3Nlc3QoICdmb3JtJyApO1xuXHRcdGJ1dHRvbkZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJywgYnV0dG9uLnZhbCgpICk7XG5cdH0gKTtcblxuXHQkKCAnLm0tZW50cnktY29udGVudCcgKS5vbiggJ3N1Ym1pdCcsICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdHZhciBmb3JtID0gJCggdGhpcyApO1xuXHRcdHZhciBzdWJtaXR0aW5nQnV0dG9uID0gZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nICkgfHwgJyc7XG5cblx0XHQvLyBpZiB0aGVyZSBpcyBubyBzdWJtaXR0aW5nIGJ1dHRvbiwgcGFzcyBpdCBieSBBamF4XG5cdFx0aWYgKCAnJyA9PT0gc3VibWl0dGluZ0J1dHRvbiB8fCAnU2F2ZSBDaGFuZ2VzJyAhPT0gc3VibWl0dGluZ0J1dHRvbiApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhamF4Rm9ybURhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4Rm9ybURhdGEgPSBhamF4Rm9ybURhdGEgKyAnJnJlc3Q9dHJ1ZSc7XG5cdFx0XHQkLmFqYXgoIHtcblx0XHRcdFx0dXJsOiBmdWxsVXJsLFxuXHRcdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKCB4aHIgKSB7XG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRkYXRhOiBhamF4Rm9ybURhdGFcblx0XHRcdH0gKS5kb25lKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0fSApLmdldCgpO1xuXHRcdFx0XHQkLmVhY2goIG5ld0VtYWlscywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9IG5leHRFbWFpbENvdW50ICsgaW5kZXg7XG5cdFx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5hcHBlbmQoICc8bGkgaWQ9XCJ1c2VyLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIj4nICsgdmFsdWUgKyAnPHVsIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS11c2VyLWVtYWlsLWFjdGlvbnNcIj48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtbWFrZS1wcmltYXJ5LWVtYWlsXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJwcmltYXJ5X2VtYWlsXCIgaWQ9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPk1ha2UgUHJpbWFyeTwvc21hbGw+PC9sYWJlbD48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1lbWFpbC1wcmVmZXJlbmNlc1wiPjxhIGhyZWY9XCIvbmV3c2xldHRlcnMvP2VtYWlsPScgKyBlbmNvZGVVUklDb21wb25lbnQoIHZhbHVlICkgKyAnXCI+PHNtYWxsPkVtYWlsIFByZWZlcmVuY2VzPC9zbWFsbD48L2E+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtcmVtb3ZlLWVtYWlsXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJyZW1vdmVfZW1haWxbJyArIG5leHRFbWFpbENvdW50ICsgJ11cIiBpZD1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPlJlbW92ZTwvc21hbGw+PC9sYWJlbD48L2xpPjwvdWw+PC9saT4nICk7XG5cdFx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoICQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCkgKyAnLCcgKyB2YWx1ZSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdCQoICcubS1mb3JtLWNoYW5nZS1lbWFpbCAuYS1pbnB1dC13aXRoLWJ1dHRvbicgKS5yZW1vdmUoKTtcblx0XHRcdFx0aWYgKCAwID09PSAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKSAhPT0gJCggJ2lucHV0W25hbWU9XCJlbWFpbFwiXScgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gaXQgd291bGQgYmUgbmljZSB0byBvbmx5IGxvYWQgdGhlIGZvcm0sIGJ1dCB0aGVuIGNsaWNrIGV2ZW50cyBzdGlsbCBkb24ndCB3b3JrXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cdH0gKTtcbn1cblxuZnVuY3Rpb24gYWRkQXV0b1Jlc2l6ZSgpIHtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJ1tkYXRhLWF1dG9yZXNpemVdJyApLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdGVsZW1lbnQuc3R5bGUuYm94U2l6aW5nID0gJ2JvcmRlci1ib3gnO1xuXHRcdHZhciBvZmZzZXQgPSBlbGVtZW50Lm9mZnNldEhlaWdodCAtIGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuXHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQudGFyZ2V0LnN0eWxlLmhlaWdodCA9ICdhdXRvJztcblx0XHRcdGV2ZW50LnRhcmdldC5zdHlsZS5oZWlnaHQgPSBldmVudC50YXJnZXQuc2Nyb2xsSGVpZ2h0ICsgb2Zmc2V0ICsgJ3B4Jztcblx0XHR9ICk7XG5cdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoICdkYXRhLWF1dG9yZXNpemUnICk7XG5cdH0gKTtcbn1cblxuJCggZG9jdW1lbnQgKS5hamF4U3RvcCggZnVuY3Rpb24oKSB7XG5cdHZhciBjb21tZW50QXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcjbGxjX2NvbW1lbnRzJyApO1xuXHRpZiAoIG51bGwgIT09IGNvbW1lbnRBcmVhICkge1xuXHRcdGFkZEF1dG9SZXNpemUoKTtcblx0fVxufSApO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIDAgPCAkKCAnLm0tZm9ybS1hY2NvdW50LXNldHRpbmdzJyApLmxlbmd0aCApIHtcblx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0fVxuXHR2YXIgYXV0b1Jlc2l6ZVRleHRhcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ1tkYXRhLWF1dG9yZXNpemVdJyApO1xuXHRpZiAoIG51bGwgIT09IGF1dG9SZXNpemVUZXh0YXJlYSApIHtcblx0XHRhZGRBdXRvUmVzaXplKCk7XG5cdH1cbn0gKTtcblxudmFyIGZvcm1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWZvcm0nICk7XG5mb3Jtcy5mb3JFYWNoKCBmdW5jdGlvbiggZm9ybSApIHtcblx0VmFsaWRGb3JtKCBmb3JtLCB7XG5cdFx0dmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3M6ICdtLWhhcy12YWxpZGF0aW9uLWVycm9yJyxcblx0XHR2YWxpZGF0aW9uRXJyb3JDbGFzczogJ2EtdmFsaWRhdGlvbi1lcnJvcicsXG5cdFx0aW52YWxpZENsYXNzOiAnYS1lcnJvcicsXG5cdFx0ZXJyb3JQbGFjZW1lbnQ6ICdhZnRlcidcblx0fSApO1xufSApO1xuXG52YXIgZm9ybSA9ICQoICcubS1mb3JtJyApO1xuXG4vLyBsaXN0ZW4gZm9yIGBpbnZhbGlkYCBldmVudHMgb24gYWxsIGZvcm0gaW5wdXRzXG5mb3JtLmZpbmQoICc6aW5wdXQnICkub24oICdpbnZhbGlkJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGlucHV0ID0gJCggdGhpcyApO1xuXG4gICAgLy8gdGhlIGZpcnN0IGludmFsaWQgZWxlbWVudCBpbiB0aGUgZm9ybVxuXHR2YXIgZmlyc3QgPSBmb3JtLmZpbmQoICcuYS1lcnJvcicgKS5maXJzdCgpO1xuXG5cdC8vIHRoZSBmb3JtIGl0ZW0gdGhhdCBjb250YWlucyBpdFxuXHR2YXIgZmlyc3RfaG9sZGVyID0gZmlyc3QucGFyZW50KCk7XG5cbiAgICAvLyBvbmx5IGhhbmRsZSBpZiB0aGlzIGlzIHRoZSBmaXJzdCBpbnZhbGlkIGlucHV0XG4gICAgaWYgKCBpbnB1dFswXSA9PT0gZmlyc3RbMF0gKSB7XG5cbiAgICAgICAgLy8gaGVpZ2h0IG9mIHRoZSBuYXYgYmFyIHBsdXMgc29tZSBwYWRkaW5nIGlmIHRoZXJlJ3MgYSBmaXhlZCBuYXZcbiAgICAgICAgLy92YXIgbmF2YmFySGVpZ2h0ID0gbmF2YmFyLmhlaWdodCgpICsgNTBcblxuICAgICAgICAvLyB0aGUgcG9zaXRpb24gdG8gc2Nyb2xsIHRvIChhY2NvdW50aW5nIGZvciB0aGUgbmF2YmFyIGlmIGl0IGV4aXN0cylcbiAgICAgICAgdmFyIGVsZW1lbnRPZmZzZXQgPSBmaXJzdF9ob2xkZXIub2Zmc2V0KCkudG9wO1xuXG4gICAgICAgIC8vIHRoZSBjdXJyZW50IHNjcm9sbCBwb3NpdGlvbiAoYWNjb3VudGluZyBmb3IgdGhlIG5hdmJhcilcbiAgICAgICAgdmFyIHBhZ2VPZmZzZXQgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cbiAgICAgICAgLy8gZG9uJ3Qgc2Nyb2xsIGlmIHRoZSBlbGVtZW50IGlzIGFscmVhZHkgaW4gdmlld1xuICAgICAgICBpZiAoIGVsZW1lbnRPZmZzZXQgPiBwYWdlT2Zmc2V0ICYmIGVsZW1lbnRPZmZzZXQgPCBwYWdlT2Zmc2V0ICsgd2luZG93LmlubmVySGVpZ2h0ICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBub3RlOiBhdm9pZCB1c2luZyBhbmltYXRlLCBhcyBpdCBwcmV2ZW50cyB0aGUgdmFsaWRhdGlvbiBtZXNzYWdlIGRpc3BsYXlpbmcgY29ycmVjdGx5XG4gICAgICAgICQoICdodG1sLCBib2R5JyApLnNjcm9sbFRvcCggZWxlbWVudE9mZnNldCApO1xuICAgIH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgY29tbWVudHNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuLy8gYmFzZWQgb24gd2hpY2ggYnV0dG9uIHdhcyBjbGlja2VkLCBzZXQgdGhlIHZhbHVlcyBmb3IgdGhlIGFuYWx5dGljcyBldmVudCBhbmQgY3JlYXRlIGl0XG5mdW5jdGlvbiB0cmFja1Nob3dDb21tZW50cyggYWx3YXlzLCBpZCwgY2xpY2tWYWx1ZSApIHtcblx0dmFyIGFjdGlvbiAgICAgICAgICA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlQcmVmaXggPSAnJztcblx0dmFyIGNhdGVnb3J5U3VmZml4ID0gJyc7XG5cdHZhciBwb3NpdGlvbiAgICAgICAgPSAnJztcblx0cG9zaXRpb24gPSBpZC5yZXBsYWNlKCAnYWx3YXlzLXNob3ctY29tbWVudHMtJywgJycgKTtcblx0aWYgKCAnMScgPT09IGNsaWNrVmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09uJztcblx0fSBlbHNlIGlmICggJzAnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPZmYnO1xuXHR9IGVsc2Uge1xuXHRcdGFjdGlvbiA9ICdDbGljayc7XG5cdH1cblx0aWYgKCB0cnVlID09PSBhbHdheXMgKSB7XG5cdFx0Y2F0ZWdvcnlQcmVmaXggPSAnQWx3YXlzICc7XG5cdH1cblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0cG9zaXRpb24gPSBwb3NpdGlvbi5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgcG9zaXRpb24uc2xpY2UoIDEgKTtcblx0XHRjYXRlZ29yeVN1ZmZpeCA9ICcgLSAnICsgcG9zaXRpb247XG5cdH1cblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeVByZWZpeCArICdTaG93IENvbW1lbnRzJyArIGNhdGVnb3J5U3VmZml4LCBhY3Rpb24sIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59XG5cbi8vIHdoZW4gc2hvd2luZyBjb21tZW50cyBvbmNlLCB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1idXR0b24tc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR0cmFja1Nob3dDb21tZW50cyggZmFsc2UsICcnLCAnJyApO1xufSApO1xuXG4vLyBTZXQgdXNlciBtZXRhIHZhbHVlIGZvciBhbHdheXMgc2hvd2luZyBjb21tZW50cyBpZiB0aGF0IGJ1dHRvbiBpcyBjbGlja2VkXG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dmFyIHRoYXQgPSAkKCB0aGlzICk7XG5cdGlmICggdGhhdC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0fSBlbHNlIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHR9XG5cblx0Ly8gdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCB0cnVlLCB0aGF0LmF0dHIoICdpZCcgKSwgdGhhdC52YWwoKSApO1xuXG5cdC8vIHdlIGFscmVhZHkgaGF2ZSBhamF4dXJsIGZyb20gdGhlIHRoZW1lXG5cdCQuYWpheCgge1xuXHRcdHR5cGU6ICdQT1NUJyxcblx0XHR1cmw6IHBhcmFtcy5hamF4dXJsLFxuXHRcdGRhdGE6IHtcblx0XHRcdCdhY3Rpb24nOiAnbWlubnBvc3RfbGFyZ29fbG9hZF9jb21tZW50c19zZXRfdXNlcl9tZXRhJyxcblx0XHRcdCd2YWx1ZSc6IHRoYXQudmFsKClcblx0XHR9LFxuXHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdCQoICcuYS1hbHdheXMtc2hvdy1jb21tZW50cy1yZXN1bHQnLCB0aGF0LnBhcmVudCgpICkuaHRtbCggcmVzcG9uc2UuZGF0YS5tZXNzYWdlICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IHJlc3BvbnNlLmRhdGEuc2hvdyApIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnZhbCggMSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufSApO1xuXG4hICggZnVuY3Rpb24oIGQgKSB7XG5cdGlmICggISBkLmN1cnJlbnRTY3JpcHQgKSB7XG5cdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRhY3Rpb246ICdsbGNfbG9hZF9jb21tZW50cycsXG5cdFx0XHRwb3N0OiAkKCAnI2xsY19wb3N0X2lkJyApLnZhbCgpXG5cdFx0fTtcblxuXHRcdC8vIEFqYXggcmVxdWVzdCBsaW5rLlxuXHRcdHZhciBsbGNhamF4dXJsID0gJCggJyNsbGNfYWpheF91cmwnICkudmFsKCk7XG5cblx0XHQvLyBGdWxsIHVybCB0byBnZXQgY29tbWVudHMgKEFkZGluZyBwYXJhbWV0ZXJzKS5cblx0XHR2YXIgY29tbWVudFVybCA9IGxsY2FqYXh1cmwgKyAnPycgKyAkLnBhcmFtKCBkYXRhICk7XG5cblx0XHQvLyBQZXJmb3JtIGFqYXggcmVxdWVzdC5cblx0XHQkLmdldCggY29tbWVudFVybCwgZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0aWYgKCAnJyAhPT0gcmVzcG9uc2UgKSB7XG5cdFx0XHRcdCQoICcjbGxjX2NvbW1lbnRzJyApLmh0bWwoIHJlc3BvbnNlICk7XG5cblx0XHRcdFx0Ly8gSW5pdGlhbGl6ZSBjb21tZW50cyBhZnRlciBsYXp5IGxvYWRpbmcuXG5cdFx0XHRcdGlmICggd2luZG93LmFkZENvbW1lbnQgJiYgd2luZG93LmFkZENvbW1lbnQuaW5pdCApIHtcblx0XHRcdFx0XHR3aW5kb3cuYWRkQ29tbWVudC5pbml0KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBHZXQgdGhlIGNvbW1lbnQgbGkgaWQgZnJvbSB1cmwgaWYgZXhpc3QuXG5cdFx0XHRcdHZhciBjb21tZW50SWQgPSBkb2N1bWVudC5VUkwuc3Vic3RyKCBkb2N1bWVudC5VUkwuaW5kZXhPZiggJyNjb21tZW50JyApICk7XG5cblx0XHRcdFx0Ly8gSWYgY29tbWVudCBpZCBmb3VuZCwgc2Nyb2xsIHRvIHRoYXQgY29tbWVudC5cblx0XHRcdFx0aWYgKCAtMSA8IGNvbW1lbnRJZC5pbmRleE9mKCAnI2NvbW1lbnQnICkgKSB7XG5cdFx0XHRcdFx0JCggd2luZG93ICkuc2Nyb2xsVG9wKCAkKCBjb21tZW50SWQgKS5vZmZzZXQoKS50b3AgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxufSggZG9jdW1lbnQgKSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBldmVudHNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbmNvbnN0IHRhcmdldHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLmEtZXZlbnRzLWNhbC1saW5rcycgKTtcbnRhcmdldHMuZm9yRWFjaCggZnVuY3Rpb24oIHRhcmdldCApIHtcbiAgICBzZXRDYWxlbmRhciggdGFyZ2V0ICk7XG59ICk7XG5cbmZ1bmN0aW9uIHNldENhbGVuZGFyKCB0YXJnZXQgKSB7XG4gICAgaWYgKCBudWxsICE9PSB0YXJnZXQgKSB7XG4gICAgICAgIHZhciBsaSAgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnbGknICk7XG4gICAgICAgIGxpLmlubmVySFRNTCAgPSAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImEtY2xvc2UtYnV0dG9uIGEtY2xvc2UtY2FsZW5kYXJcIj48aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT48L2E+JztcbiAgICAgICAgdmFyIGZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgbGkuc2V0QXR0cmlidXRlKCAnY2xhc3MnLCAnYS1jbG9zZS1ob2xkZXInICk7XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBsaSApO1xuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG4gICAgfVxufVxuXG5jb25zdCBjYWxlbmRhcnNWaXNpYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWV2ZW50LWRhdGV0aW1lIGEnICk7XG5jYWxlbmRhcnNWaXNpYmxlLmZvckVhY2goIGZ1bmN0aW9uKCBjYWxlbmRhclZpc2libGUgKSB7XG4gICAgc2hvd0NhbGVuZGFyKCBjYWxlbmRhclZpc2libGUgKTtcbn0gKTtcblxuZnVuY3Rpb24gc2hvd0NhbGVuZGFyKCBjYWxlbmRhclZpc2libGUgKSB7XG4gICAgY29uc3QgZGF0ZUhvbGRlciA9IGNhbGVuZGFyVmlzaWJsZS5jbG9zZXN0KCAnLm0tZXZlbnQtZGF0ZS1hbmQtY2FsZW5kYXInICk7XG4gICAgY29uc3QgY2FsZW5kYXJUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuICAgICAgICBlbGVtZW50OiBkYXRlSG9sZGVyLnF1ZXJ5U2VsZWN0b3IoICcuYS1ldmVudHMtY2FsLWxpbmtzJyApLFxuICAgICAgICB2aXNpYmxlQ2xhc3M6ICdhLWV2ZW50cy1jYWwtbGluay12aXNpYmxlJyxcbiAgICAgICAgZGlzcGxheVZhbHVlOiAnYmxvY2snXG4gICAgfSApO1xuXG4gICAgaWYgKCBudWxsICE9PSBjYWxlbmRhclZpc2libGUgKSB7XG4gICAgICAgIGNhbGVuZGFyVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gY2FsZW5kYXJWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG4gICAgICAgICAgICBjYWxlbmRhclZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcbiAgICAgICAgICAgIGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG4gICAgICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApO1xuXG4gICAgICAgIHZhciBjYWxlbmRhckNsb3NlID0gZGF0ZUhvbGRlci5xdWVyeVNlbGVjdG9yKCAnLmEtY2xvc2UtY2FsZW5kYXInICk7XG4gICAgICAgIGlmICggbnVsbCAhPT0gY2FsZW5kYXJDbG9zZSApIHtcbiAgICAgICAgICAgIGNhbGVuZGFyQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gY2FsZW5kYXJWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG4gICAgICAgICAgICAgICAgY2FsZW5kYXJWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgICAgICAgICAgICAgaWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
}(jQuery));
