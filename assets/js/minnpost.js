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

/*
 * Call hooks from other places.
 * This allows other plugins that we maintain to pass data to the theme's analytics method.
*/
if (typeof wp !== 'undefined') {
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
  } // track as an event


  mpAnalyticsTrackingEvent('event', category, text, location.pathname);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDQtdmFsaWQtZm9ybS5taW4uanMiLCIwMC1zdGFydC5qcyIsIjAxLWFuYWx5dGljcy5qcyIsIjAyLXNoYXJlLmpzIiwiMDMtbmF2aWdhdGlvbi5qcyIsIjA0LWZvcm1zLmpzIiwiMDUtY29tbWVudHMuanMiLCIwNi1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImMiLCJyZXF1aXJlIiwidSIsImNvZGUiLCJwIiwiY2FsbCIsIl92YWxpZEZvcm0iLCJfdmFsaWRGb3JtMiIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIlZhbGlkRm9ybSIsInRvZ2dsZUludmFsaWRDbGFzcyIsImhhbmRsZUN1c3RvbU1lc3NhZ2VzIiwiaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiY2xvbmUiLCJkZWZhdWx0cyIsImluc2VydEFmdGVyIiwiaW5zZXJ0QmVmb3JlIiwiZm9yRWFjaCIsImRlYm91bmNlIiwiY29weSIsImF0dHIiLCJoYXNPd25Qcm9wZXJ0eSIsImRlZmF1bHRPYmplY3QiLCJrIiwicmVmTm9kZSIsIm5vZGVUb0luc2VydCIsInNpYmxpbmciLCJuZXh0U2libGluZyIsIl9wYXJlbnQiLCJwYXJlbnQiLCJpdGVtcyIsImZuIiwibXMiLCJkZWJvdW5jZWRGbiIsInZhbGlkRm9ybSIsIl91dGlsIiwiaW5wdXQiLCJpbnZhbGlkQ2xhc3MiLCJ2YWxpZGl0eSIsInZhbGlkIiwiZXJyb3JQcm9wcyIsImdldEN1c3RvbU1lc3NhZ2UiLCJjdXN0b21NZXNzYWdlcyIsImxvY2FsRXJyb3JQcm9wcyIsInR5cGUiLCJjb25jYXQiLCJwcm9wIiwiY2hlY2tWYWxpZGl0eSIsIm1lc3NhZ2UiLCJzZXRDdXN0b21WYWxpZGl0eSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uRXJyb3JDbGFzcyIsInZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzIiwiZXJyb3JQbGFjZW1lbnQiLCJpbnNlcnRFcnJvciIsImVycm9yTm9kZSIsInZhbGlkYXRpb25NZXNzYWdlIiwidGV4dENvbnRlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImRlZmF1bHRPcHRpb25zIiwibm9kZU5hbWUiLCJpbnB1dHMiLCJ0b0xvd2VyQ2FzZSIsImZvY3VzSW52YWxpZElucHV0IiwidmFsaWRGb3JtSW5wdXRzIiwiZm9ybSIsImZvY3VzRmlyc3QiLCJpbnZhbGlkTm9kZSIsImZvY3VzIiwiZG9jdW1lbnRFbGVtZW50Iiwid3AiLCJob29rcyIsImFkZEFjdGlvbiIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCIsIm1wQW5hbHl0aWNzVHJhY2tpbmdFY29tbWVyY2VBY3Rpb24iLCJjYXRlZ29yeSIsImFjdGlvbiIsImxhYmVsIiwibm9uX2ludGVyYWN0aW9uIiwiZG9BY3Rpb24iLCJwcm9kdWN0Iiwic3RlcCIsImV2ZW50IiwibWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhIiwidXJsX2FjY2Vzc19sZXZlbCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJjdXJyZW50X3VzZXIiLCJjYW5fYWNjZXNzIiwidHJhY2tTaGFyZSIsInRleHQiLCJwb3NpdGlvbiIsImNvcHlDdXJyZW50VVJMIiwiZHVtbXkiLCJocmVmIiwiYm9keSIsInNlbGVjdCIsImV4ZWNDb21tYW5kIiwidG9wQnV0dG9uIiwiY3VycmVudFRhcmdldCIsInByaW50QnV0dG9uIiwicHJpbnQiLCJyZXB1Ymxpc2hCdXR0b24iLCJjb3B5QnV0dG9uIiwiYW55U2hhcmVCdXR0b24iLCJ1cmwiLCJvcGVuIiwic2V0dXBQcmltYXJ5TmF2IiwicHJpbWFyeU5hdlRyYW5zaXRpb25lciIsInByaW1hcnlOYXZUb2dnbGUiLCJleHBhbmRlZCIsInVzZXJOYXZUcmFuc2l0aW9uZXIiLCJ1c2VyTmF2VG9nZ2xlIiwiZGl2IiwiZnJhZ21lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50Iiwic2VhcmNoVHJhbnNpdGlvbmVyIiwic2VhcmNoVmlzaWJsZSIsInNlYXJjaENsb3NlIiwiJCIsImtleXVwIiwia2V5Q29kZSIsInByaW1hcnlOYXZFeHBhbmRlZCIsInVzZXJOYXZFeHBhbmRlZCIsInNlYXJjaElzVmlzaWJsZSIsInNldHVwU2Nyb2xsTmF2IiwidWEiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJpc0lFIiwidGVzdCIsInByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0IiwiY2xpY2siLCJ3aWRnZXRUaXRsZSIsImNsb3Nlc3QiLCJmaW5kIiwiem9uZVRpdGxlIiwic2lkZWJhclNlY3Rpb25UaXRsZSIsImpRdWVyeSIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwidHJpbSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJyZXN0Um9vdCIsInVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QiLCJzaXRlX3VybCIsInJlc3RfbmFtZXNwYWNlIiwiZnVsbFVybCIsImNvbmZpcm1DaGFuZ2UiLCJuZXh0RW1haWxDb3VudCIsIm5ld1ByaW1hcnlFbWFpbCIsIm9sZFByaW1hcnlFbWFpbCIsInByaW1hcnlJZCIsImVtYWlsVG9SZW1vdmUiLCJjb25zb2xpZGF0ZWRFbWFpbHMiLCJuZXdFbWFpbHMiLCJhamF4Rm9ybURhdGEiLCJ0aGF0Iiwib24iLCJ2YWwiLCJyZXBsYWNlIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFwcGVuZCIsImZpcnN0IiwicmVwbGFjZVdpdGgiLCJzdWJtaXQiLCJlYWNoIiwiZ2V0IiwicHVzaCIsInBhcmVudHMiLCJmYWRlT3V0Iiwiam9pbiIsImJlZm9yZSIsImJ1dHRvbiIsImJ1dHRvbkZvcm0iLCJkYXRhIiwic3VibWl0dGluZ0J1dHRvbiIsInNlcmlhbGl6ZSIsImFqYXgiLCJiZWZvcmVTZW5kIiwieGhyIiwic2V0UmVxdWVzdEhlYWRlciIsIm5vbmNlIiwiZGF0YVR5cGUiLCJkb25lIiwibWFwIiwiaW5kZXgiLCJlbmNvZGVVUklDb21wb25lbnQiLCJyZWxvYWQiLCJhZGRBdXRvUmVzaXplIiwiYm94U2l6aW5nIiwib2Zmc2V0IiwiY2xpZW50SGVpZ2h0IiwiaGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0IiwiYWpheFN0b3AiLCJjb21tZW50QXJlYSIsImF1dG9SZXNpemVUZXh0YXJlYSIsImZvcm1zIiwiZmlyc3RfaG9sZGVyIiwiZWxlbWVudE9mZnNldCIsInBhZ2VPZmZzZXQiLCJwYWdlWU9mZnNldCIsInNjcm9sbFRvcCIsInRyYWNrU2hvd0NvbW1lbnRzIiwiYWx3YXlzIiwiaWQiLCJjbGlja1ZhbHVlIiwiY2F0ZWdvcnlQcmVmaXgiLCJjYXRlZ29yeVN1ZmZpeCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJpcyIsInBhcmFtcyIsImFqYXh1cmwiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJodG1sIiwiY3VycmVudFNjcmlwdCIsInBvc3QiLCJsbGNhamF4dXJsIiwiY29tbWVudFVybCIsInBhcmFtIiwiYWRkQ29tbWVudCIsImNvbW1lbnRJZCIsIlVSTCIsInN1YnN0ciIsImluZGV4T2YiLCJ0YXJnZXRzIiwic2V0Q2FsZW5kYXIiLCJsaSIsImNhbGVuZGFyc1Zpc2libGUiLCJjYWxlbmRhclZpc2libGUiLCJzaG93Q2FsZW5kYXIiLCJkYXRlSG9sZGVyIiwiY2FsZW5kYXJUcmFuc2l0aW9uZXIiLCJjYWxlbmRhckNsb3NlIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLEtBQVQsQ0FBZUMsQ0FBZixFQUFpQjtBQUFDQyxFQUFBQSxRQUFRLENBQUNDLGdCQUFULENBQTBCLFdBQTFCLEVBQXNDLFVBQVNDLENBQVQsRUFBVztBQUFDLFFBQUlDLENBQUMsR0FBQ0QsQ0FBQyxDQUFDRSxNQUFSO0FB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bU4sUUFBakQ7O0FBQ0EsWUFBSyxTQUFTQSxRQUFkLEVBQXlCO0FBQ3JCc0ksVUFBQUEsb0JBQW9CLENBQUM1VCxjQUFyQjtBQUNILFNBRkQsTUFFTztBQUNINFQsVUFBQUEsb0JBQW9CLENBQUNqVSxjQUFyQjtBQUNIO0FBQ0osT0FURDtBQVVIO0FBQ0o7QUFDSiIsImZpbGUiOiJtaW5ucG9zdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHRsaXRlKHQpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIixmdW5jdGlvbihlKXt2YXIgaT1lLnRhcmdldCxuPXQoaSk7bnx8KG49KGk9aS5wYXJlbnRFbGVtZW50KSYmdChpKSksbiYmdGxpdGUuc2hvdyhpLG4sITApfSl9dGxpdGUuc2hvdz1mdW5jdGlvbih0LGUsaSl7dmFyIG49XCJkYXRhLXRsaXRlXCI7ZT1lfHx7fSwodC50b29sdGlwfHxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIG8oKXt0bGl0ZS5oaWRlKHQsITApfWZ1bmN0aW9uIGwoKXtyfHwocj1mdW5jdGlvbih0LGUsaSl7ZnVuY3Rpb24gbigpe28uY2xhc3NOYW1lPVwidGxpdGUgdGxpdGUtXCIrcitzO3ZhciBlPXQub2Zmc2V0VG9wLGk9dC5vZmZzZXRMZWZ0O28ub2Zmc2V0UGFyZW50PT09dCYmKGU9aT0wKTt2YXIgbj10Lm9mZnNldFdpZHRoLGw9dC5vZmZzZXRIZWlnaHQsZD1vLm9mZnNldEhlaWdodCxmPW8ub2Zmc2V0V2lkdGgsYT1pK24vMjtvLnN0eWxlLnRvcD0oXCJzXCI9PT1yP2UtZC0xMDpcIm5cIj09PXI/ZStsKzEwOmUrbC8yLWQvMikrXCJweFwiLG8uc3R5bGUubGVmdD0oXCJ3XCI9PT1zP2k6XCJlXCI9PT1zP2krbi1mOlwid1wiPT09cj9pK24rMTA6XCJlXCI9PT1yP2ktZi0xMDphLWYvMikrXCJweFwifXZhciBvPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpLGw9aS5ncmF2fHx0LmdldEF0dHJpYnV0ZShcImRhdGEtdGxpdGVcIil8fFwiblwiO28uaW5uZXJIVE1MPWUsdC5hcHBlbmRDaGlsZChvKTt2YXIgcj1sWzBdfHxcIlwiLHM9bFsxXXx8XCJcIjtuKCk7dmFyIGQ9by5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm5cInNcIj09PXImJmQudG9wPDA/KHI9XCJuXCIsbigpKTpcIm5cIj09PXImJmQuYm90dG9tPndpbmRvdy5pbm5lckhlaWdodD8ocj1cInNcIixuKCkpOlwiZVwiPT09ciYmZC5sZWZ0PDA/KHI9XCJ3XCIsbigpKTpcIndcIj09PXImJmQucmlnaHQ+d2luZG93LmlubmVyV2lkdGgmJihyPVwiZVwiLG4oKSksby5jbGFzc05hbWUrPVwiIHRsaXRlLXZpc2libGVcIixvfSh0LGQsZSkpfXZhciByLHMsZDtyZXR1cm4gdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsbyksdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLG8pLHQudG9vbHRpcD17c2hvdzpmdW5jdGlvbigpe2Q9dC50aXRsZXx8dC5nZXRBdHRyaWJ1dGUobil8fGQsdC50aXRsZT1cIlwiLHQuc2V0QXR0cmlidXRlKG4sXCJcIiksZCYmIXMmJihzPXNldFRpbWVvdXQobCxpPzE1MDoxKSl9LGhpZGU6ZnVuY3Rpb24odCl7aWYoaT09PXQpe3M9Y2xlYXJUaW1lb3V0KHMpO3ZhciBlPXImJnIucGFyZW50Tm9kZTtlJiZlLnJlbW92ZUNoaWxkKHIpLHI9dm9pZCAwfX19fSh0LGUpKS5zaG93KCl9LHRsaXRlLmhpZGU9ZnVuY3Rpb24odCxlKXt0LnRvb2x0aXAmJnQudG9vbHRpcC5oaWRlKGUpfSxcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmKG1vZHVsZS5leHBvcnRzPXRsaXRlKTsiLCIvKiogXG4gKiBMaWJyYXJ5IGNvZGVcbiAqIFVzaW5nIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL0BjbG91ZGZvdXIvdHJhbnNpdGlvbi1oaWRkZW4tZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KHtcbiAgZWxlbWVudCxcbiAgdmlzaWJsZUNsYXNzLFxuICB3YWl0TW9kZSA9ICd0cmFuc2l0aW9uZW5kJyxcbiAgdGltZW91dER1cmF0aW9uLFxuICBoaWRlTW9kZSA9ICdoaWRkZW4nLFxuICBkaXNwbGF5VmFsdWUgPSAnYmxvY2snXG59KSB7XG4gIGlmICh3YWl0TW9kZSA9PT0gJ3RpbWVvdXQnICYmIHR5cGVvZiB0aW1lb3V0RHVyYXRpb24gIT09ICdudW1iZXInKSB7XG4gICAgY29uc29sZS5lcnJvcihgXG4gICAgICBXaGVuIGNhbGxpbmcgdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQgd2l0aCB3YWl0TW9kZSBzZXQgdG8gdGltZW91dCxcbiAgICAgIHlvdSBtdXN0IHBhc3MgaW4gYSBudW1iZXIgZm9yIHRpbWVvdXREdXJhdGlvbi5cbiAgICBgKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIERvbid0IHdhaXQgZm9yIGV4aXQgdHJhbnNpdGlvbnMgaWYgYSB1c2VyIHByZWZlcnMgcmVkdWNlZCBtb3Rpb24uXG4gIC8vIElkZWFsbHkgdHJhbnNpdGlvbnMgd2lsbCBiZSBkaXNhYmxlZCBpbiBDU1MsIHdoaWNoIG1lYW5zIHdlIHNob3VsZCBub3Qgd2FpdFxuICAvLyBiZWZvcmUgYWRkaW5nIGBoaWRkZW5gLlxuICBpZiAod2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJykubWF0Y2hlcykge1xuICAgIHdhaXRNb2RlID0gJ2ltbWVkaWF0ZSc7XG4gIH1cblxuICAvKipcbiAgICogQW4gZXZlbnQgbGlzdGVuZXIgdG8gYWRkIGBoaWRkZW5gIGFmdGVyIG91ciBhbmltYXRpb25zIGNvbXBsZXRlLlxuICAgKiBUaGlzIGxpc3RlbmVyIHdpbGwgcmVtb3ZlIGl0c2VsZiBhZnRlciBjb21wbGV0aW5nLlxuICAgKi9cbiAgY29uc3QgbGlzdGVuZXIgPSBlID0+IHtcbiAgICAvLyBDb25maXJtIGB0cmFuc2l0aW9uZW5kYCB3YXMgY2FsbGVkIG9uICBvdXIgYGVsZW1lbnRgIGFuZCBkaWRuJ3QgYnViYmxlXG4gICAgLy8gdXAgZnJvbSBhIGNoaWxkIGVsZW1lbnQuXG4gICAgaWYgKGUudGFyZ2V0ID09PSBlbGVtZW50KSB7XG4gICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcblxuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhcHBseUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVtb3ZlSGlkZGVuQXR0cmlidXRlcyA9ICgpID0+IHtcbiAgICBpZihoaWRlTW9kZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5VmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC8qKlxuICAgICAqIFNob3cgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICB0cmFuc2l0aW9uU2hvdygpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhpcyBsaXN0ZW5lciBzaG91bGRuJ3QgYmUgaGVyZSBidXQgaWYgc29tZW9uZSBzcGFtcyB0aGUgdG9nZ2xlXG4gICAgICAgKiBvdmVyIGFuZCBvdmVyIHJlYWxseSBmYXN0IGl0IGNhbiBpbmNvcnJlY3RseSBzdGljayBhcm91bmQuXG4gICAgICAgKiBXZSByZW1vdmUgaXQganVzdCB0byBiZSBzYWZlLlxuICAgICAgICovXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG5cbiAgICAgIC8qKlxuICAgICAgICogU2ltaWxhcmx5LCB3ZSdsbCBjbGVhciB0aGUgdGltZW91dCBpbiBjYXNlIGl0J3Mgc3RpbGwgaGFuZ2luZyBhcm91bmQuXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgICB9XG5cbiAgICAgIHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMoKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBGb3JjZSBhIGJyb3dzZXIgcmUtcGFpbnQgc28gdGhlIGJyb3dzZXIgd2lsbCByZWFsaXplIHRoZVxuICAgICAgICogZWxlbWVudCBpcyBubyBsb25nZXIgYGhpZGRlbmAgYW5kIGFsbG93IHRyYW5zaXRpb25zLlxuICAgICAgICovXG4gICAgICBjb25zdCByZWZsb3cgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHZpc2libGVDbGFzcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEhpZGUgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICB0cmFuc2l0aW9uSGlkZSgpIHtcbiAgICAgIGlmICh3YWl0TW9kZSA9PT0gJ3RyYW5zaXRpb25lbmQnKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICAgIH0gZWxzZSBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0Jykge1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgICAgfSwgdGltZW91dER1cmF0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdGhpcyBjbGFzcyB0byB0cmlnZ2VyIG91ciBhbmltYXRpb25cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgdGhlIGVsZW1lbnQncyB2aXNpYmlsaXR5XG4gICAgICovXG4gICAgdG9nZ2xlKCkge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oKSkge1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRlbGwgd2hldGhlciB0aGUgZWxlbWVudCBpcyBoaWRkZW4gb3Igbm90LlxuICAgICAqL1xuICAgIGlzSGlkZGVuKCkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgaGlkZGVuIGF0dHJpYnV0ZSBkb2VzIG5vdCByZXF1aXJlIGEgdmFsdWUuIFNpbmNlIGFuIGVtcHR5IHN0cmluZyBpc1xuICAgICAgICogZmFsc3ksIGJ1dCBzaG93cyB0aGUgcHJlc2VuY2Ugb2YgYW4gYXR0cmlidXRlIHdlIGNvbXBhcmUgdG8gYG51bGxgXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IGhhc0hpZGRlbkF0dHJpYnV0ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdoaWRkZW4nKSAhPT0gbnVsbDtcblxuICAgICAgY29uc3QgaXNEaXNwbGF5Tm9uZSA9IGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnO1xuXG4gICAgICBjb25zdCBoYXNWaXNpYmxlQ2xhc3MgPSBbLi4uZWxlbWVudC5jbGFzc0xpc3RdLmluY2x1ZGVzKHZpc2libGVDbGFzcyk7XG5cbiAgICAgIHJldHVybiBoYXNIaWRkZW5BdHRyaWJ1dGUgfHwgaXNEaXNwbGF5Tm9uZSB8fCAhaGFzVmlzaWJsZUNsYXNzO1xuICAgIH0sXG5cbiAgICAvLyBBIHBsYWNlaG9sZGVyIGZvciBvdXIgYHRpbWVvdXRgXG4gICAgdGltZW91dDogbnVsbFxuICB9O1xufSIsIi8qKlxuICBQcmlvcml0eSsgaG9yaXpvbnRhbCBzY3JvbGxpbmcgbWVudS5cblxuICBAcGFyYW0ge09iamVjdH0gb2JqZWN0IC0gQ29udGFpbmVyIGZvciBhbGwgb3B0aW9ucy5cbiAgICBAcGFyYW0ge3N0cmluZyB8fCBET00gbm9kZX0gc2VsZWN0b3IgLSBFbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBuYXZTZWxlY3RvciAtIE5hdiBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50U2VsZWN0b3IgLSBDb250ZW50IGVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGl0ZW1TZWxlY3RvciAtIEl0ZW1zIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBidXR0b25MZWZ0U2VsZWN0b3IgLSBMZWZ0IGJ1dHRvbiBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uUmlnaHRTZWxlY3RvciAtIFJpZ2h0IGJ1dHRvbiBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge2ludGVnZXIgfHwgc3RyaW5nfSBzY3JvbGxTdGVwIC0gQW1vdW50IHRvIHNjcm9sbCBvbiBidXR0b24gY2xpY2suICdhdmVyYWdlJyBnZXRzIHRoZSBhdmVyYWdlIGxpbmsgd2lkdGguXG4qL1xuXG5jb25zdCBQcmlvcml0eU5hdlNjcm9sbGVyID0gZnVuY3Rpb24oe1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyJyxcbiAgICBuYXZTZWxlY3RvcjogbmF2U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1uYXYnLFxuICAgIGNvbnRlbnRTZWxlY3RvcjogY29udGVudFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItY29udGVudCcsXG4gICAgaXRlbVNlbGVjdG9yOiBpdGVtU2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1pdGVtJyxcbiAgICBidXR0b25MZWZ0U2VsZWN0b3I6IGJ1dHRvbkxlZnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWJ0bi0tbGVmdCcsXG4gICAgYnV0dG9uUmlnaHRTZWxlY3RvcjogYnV0dG9uUmlnaHRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWJ0bi0tcmlnaHQnLFxuICAgIHNjcm9sbFN0ZXA6IHNjcm9sbFN0ZXAgPSA4MFxuICB9ID0ge30pIHtcblxuICBjb25zdCBuYXZTY3JvbGxlciA9IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSA6IHNlbGVjdG9yO1xuXG4gIGNvbnN0IHZhbGlkYXRlU2Nyb2xsU3RlcCA9ICgpID0+IHtcbiAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihzY3JvbGxTdGVwKSB8fCBzY3JvbGxTdGVwID09PSAnYXZlcmFnZSc7XG4gIH1cblxuICBpZiAobmF2U2Nyb2xsZXIgPT09IHVuZGVmaW5lZCB8fCBuYXZTY3JvbGxlciA9PT0gbnVsbCB8fCAhdmFsaWRhdGVTY3JvbGxTdGVwKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGlzIHNvbWV0aGluZyB3cm9uZywgY2hlY2sgeW91ciBvcHRpb25zLicpO1xuICB9XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXJOYXYgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKG5hdlNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3Rvcihjb250ZW50U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckNvbnRlbnRJdGVtcyA9IG5hdlNjcm9sbGVyQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKGl0ZW1TZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyTGVmdCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoYnV0dG9uTGVmdFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJSaWdodCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoYnV0dG9uUmlnaHRTZWxlY3Rvcik7XG5cbiAgbGV0IHNjcm9sbGluZyA9IGZhbHNlO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IDA7XG4gIGxldCBzY3JvbGxBdmFpbGFibGVSaWdodCA9IDA7XG4gIGxldCBzY3JvbGxpbmdEaXJlY3Rpb24gPSAnJztcbiAgbGV0IHNjcm9sbE92ZXJmbG93ID0gJyc7XG4gIGxldCB0aW1lb3V0O1xuXG5cbiAgLy8gU2V0cyBvdmVyZmxvdyBhbmQgdG9nZ2xlIGJ1dHRvbnMgYWNjb3JkaW5nbHlcbiAgY29uc3Qgc2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBzY3JvbGxPdmVyZmxvdyA9IGdldE92ZXJmbG93KCk7XG4gICAgdG9nZ2xlQnV0dG9ucyhzY3JvbGxPdmVyZmxvdyk7XG4gICAgY2FsY3VsYXRlU2Nyb2xsU3RlcCgpO1xuICB9XG5cblxuICAvLyBEZWJvdW5jZSBzZXR0aW5nIHRoZSBvdmVyZmxvdyB3aXRoIHJlcXVlc3RBbmltYXRpb25GcmFtZVxuICBjb25zdCByZXF1ZXN0U2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGltZW91dCkgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRpbWVvdXQpO1xuXG4gICAgdGltZW91dCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgc2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgLy8gR2V0cyB0aGUgb3ZlcmZsb3cgYXZhaWxhYmxlIG9uIHRoZSBuYXYgc2Nyb2xsZXJcbiAgY29uc3QgZ2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgc2Nyb2xsV2lkdGggPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxXaWR0aDtcbiAgICBsZXQgc2Nyb2xsVmlld3BvcnQgPSBuYXZTY3JvbGxlck5hdi5jbGllbnRXaWR0aDtcbiAgICBsZXQgc2Nyb2xsTGVmdCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQ7XG5cbiAgICBzY3JvbGxBdmFpbGFibGVMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICBzY3JvbGxBdmFpbGFibGVSaWdodCA9IHNjcm9sbFdpZHRoIC0gKHNjcm9sbFZpZXdwb3J0ICsgc2Nyb2xsTGVmdCk7XG5cbiAgICAvLyAxIGluc3RlYWQgb2YgMCB0byBjb21wZW5zYXRlIGZvciBudW1iZXIgcm91bmRpbmdcbiAgICBsZXQgc2Nyb2xsTGVmdENvbmRpdGlvbiA9IHNjcm9sbEF2YWlsYWJsZUxlZnQgPiAxO1xuICAgIGxldCBzY3JvbGxSaWdodENvbmRpdGlvbiA9IHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID4gMTtcblxuICAgIC8vIGNvbnNvbGUubG9nKHNjcm9sbFdpZHRoLCBzY3JvbGxWaWV3cG9ydCwgc2Nyb2xsQXZhaWxhYmxlTGVmdCwgc2Nyb2xsQXZhaWxhYmxlUmlnaHQpO1xuXG4gICAgaWYgKHNjcm9sbExlZnRDb25kaXRpb24gJiYgc2Nyb2xsUmlnaHRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAnYm90aCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNjcm9sbExlZnRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAnbGVmdCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ3JpZ2h0JztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gJ25vbmUnO1xuICAgIH1cblxuICB9XG5cblxuICAvLyBDYWxjdWxhdGVzIHRoZSBzY3JvbGwgc3RlcCBiYXNlZCBvbiB0aGUgd2lkdGggb2YgdGhlIHNjcm9sbGVyIGFuZCB0aGUgbnVtYmVyIG9mIGxpbmtzXG4gIGNvbnN0IGNhbGN1bGF0ZVNjcm9sbFN0ZXAgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnKSB7XG4gICAgICBsZXQgc2Nyb2xsVmlld3BvcnROb1BhZGRpbmcgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxXaWR0aCAtIChwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1sZWZ0JykpICsgcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKSkpO1xuXG4gICAgICBsZXQgc2Nyb2xsU3RlcEF2ZXJhZ2UgPSBNYXRoLmZsb29yKHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIC8gbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMubGVuZ3RoKTtcblxuICAgICAgc2Nyb2xsU3RlcCA9IHNjcm9sbFN0ZXBBdmVyYWdlO1xuICAgIH1cbiAgfVxuXG5cbiAgLy8gTW92ZSB0aGUgc2Nyb2xsZXIgd2l0aCBhIHRyYW5zZm9ybVxuICBjb25zdCBtb3ZlU2Nyb2xsZXIgPSBmdW5jdGlvbihkaXJlY3Rpb24pIHtcblxuICAgIGlmIChzY3JvbGxpbmcgPT09IHRydWUgfHwgKHNjcm9sbE92ZXJmbG93ICE9PSBkaXJlY3Rpb24gJiYgc2Nyb2xsT3ZlcmZsb3cgIT09ICdib3RoJykpIHJldHVybjtcblxuICAgIGxldCBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbFN0ZXA7XG4gICAgbGV0IHNjcm9sbEF2YWlsYWJsZSA9IGRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gc2Nyb2xsQXZhaWxhYmxlTGVmdCA6IHNjcm9sbEF2YWlsYWJsZVJpZ2h0O1xuXG4gICAgLy8gSWYgdGhlcmUgd2lsbCBiZSBsZXNzIHRoYW4gMjUlIG9mIHRoZSBsYXN0IHN0ZXAgdmlzaWJsZSB0aGVuIHNjcm9sbCB0byB0aGUgZW5kXG4gICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IChzY3JvbGxTdGVwICogMS43NSkpIHtcbiAgICAgIHNjcm9sbERpc3RhbmNlID0gc2Nyb2xsQXZhaWxhYmxlO1xuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHNjcm9sbERpc3RhbmNlICo9IC0xO1xuXG4gICAgICBpZiAoc2Nyb2xsQXZhaWxhYmxlIDwgc2Nyb2xsU3RlcCkge1xuICAgICAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc25hcC1hbGlnbi1lbmQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgnICsgc2Nyb2xsRGlzdGFuY2UgKyAncHgpJztcblxuICAgIHNjcm9sbGluZ0RpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICBzY3JvbGxpbmcgPSB0cnVlO1xuICB9XG5cblxuICAvLyBTZXQgdGhlIHNjcm9sbGVyIHBvc2l0aW9uIGFuZCByZW1vdmVzIHRyYW5zZm9ybSwgY2FsbGVkIGFmdGVyIG1vdmVTY3JvbGxlcigpIGluIHRoZSB0cmFuc2l0aW9uZW5kIGV2ZW50XG4gIGNvbnN0IHNldFNjcm9sbGVyUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQsIG51bGwpO1xuICAgIHZhciB0cmFuc2Zvcm0gPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd0cmFuc2Zvcm0nKTtcbiAgICB2YXIgdHJhbnNmb3JtVmFsdWUgPSBNYXRoLmFicyhwYXJzZUludCh0cmFuc2Zvcm0uc3BsaXQoJywnKVs0XSkgfHwgMCk7XG5cbiAgICBpZiAoc2Nyb2xsaW5nRGlyZWN0aW9uID09PSAnbGVmdCcpIHtcbiAgICAgIHRyYW5zZm9ybVZhbHVlICo9IC0xO1xuICAgIH1cblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QuYWRkKCduby10cmFuc2l0aW9uJyk7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LnN0eWxlLnRyYW5zZm9ybSA9ICcnO1xuICAgIG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ICsgdHJhbnNmb3JtVmFsdWU7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nLCAnc25hcC1hbGlnbi1lbmQnKTtcblxuICAgIHNjcm9sbGluZyA9IGZhbHNlO1xuICB9XG5cblxuICAvLyBUb2dnbGUgYnV0dG9ucyBkZXBlbmRpbmcgb24gb3ZlcmZsb3dcbiAgY29uc3QgdG9nZ2xlQnV0dG9ucyA9IGZ1bmN0aW9uKG92ZXJmbG93KSB7XG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdsZWZ0Jykge1xuICAgICAgbmF2U2Nyb2xsZXJMZWZ0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG5cbiAgICBpZiAob3ZlcmZsb3cgPT09ICdib3RoJyB8fCBvdmVyZmxvdyA9PT0gJ3JpZ2h0Jykge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlclJpZ2h0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cbiAgfVxuXG5cbiAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgc2V0T3ZlcmZsb3coKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyTmF2LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgIHJlcXVlc3RTZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCAoKSA9PiB7XG4gICAgICBzZXRTY3JvbGxlclBvc2l0aW9uKCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlckxlZnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBtb3ZlU2Nyb2xsZXIoJ2xlZnQnKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyUmlnaHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBtb3ZlU2Nyb2xsZXIoJ3JpZ2h0Jyk7XG4gICAgfSk7XG5cbiAgfTtcblxuXG4gIC8vIFNlbGYgaW5pdFxuICBpbml0KCk7XG5cblxuICAvLyBSZXZlYWwgQVBJXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xuXG59O1xuXG4vL2V4cG9ydCBkZWZhdWx0IFByaW9yaXR5TmF2U2Nyb2xsZXI7XG4iLCIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcInVzZSBzdHJpY3RcIjt2YXIgX3ZhbGlkRm9ybT1yZXF1aXJlKFwiLi9zcmMvdmFsaWQtZm9ybVwiKTt2YXIgX3ZhbGlkRm9ybTI9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdmFsaWRGb3JtKTtmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iail7cmV0dXJuIG9iaiYmb2JqLl9fZXNNb2R1bGU/b2JqOntkZWZhdWx0Om9ian19d2luZG93LlZhbGlkRm9ybT1fdmFsaWRGb3JtMi5kZWZhdWx0O3dpbmRvdy5WYWxpZEZvcm0udG9nZ2xlSW52YWxpZENsYXNzPV92YWxpZEZvcm0udG9nZ2xlSW52YWxpZENsYXNzO3dpbmRvdy5WYWxpZEZvcm0uaGFuZGxlQ3VzdG9tTWVzc2FnZXM9X3ZhbGlkRm9ybS5oYW5kbGVDdXN0b21NZXNzYWdlczt3aW5kb3cuVmFsaWRGb3JtLmhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5PV92YWxpZEZvcm0uaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXl9LHtcIi4vc3JjL3ZhbGlkLWZvcm1cIjozfV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOnRydWV9KTtleHBvcnRzLmNsb25lPWNsb25lO2V4cG9ydHMuZGVmYXVsdHM9ZGVmYXVsdHM7ZXhwb3J0cy5pbnNlcnRBZnRlcj1pbnNlcnRBZnRlcjtleHBvcnRzLmluc2VydEJlZm9yZT1pbnNlcnRCZWZvcmU7ZXhwb3J0cy5mb3JFYWNoPWZvckVhY2g7ZXhwb3J0cy5kZWJvdW5jZT1kZWJvdW5jZTtmdW5jdGlvbiBjbG9uZShvYmope3ZhciBjb3B5PXt9O2Zvcih2YXIgYXR0ciBpbiBvYmope2lmKG9iai5oYXNPd25Qcm9wZXJ0eShhdHRyKSljb3B5W2F0dHJdPW9ialthdHRyXX1yZXR1cm4gY29weX1mdW5jdGlvbiBkZWZhdWx0cyhvYmosZGVmYXVsdE9iamVjdCl7b2JqPWNsb25lKG9ianx8e30pO2Zvcih2YXIgayBpbiBkZWZhdWx0T2JqZWN0KXtpZihvYmpba109PT11bmRlZmluZWQpb2JqW2tdPWRlZmF1bHRPYmplY3Rba119cmV0dXJuIG9ian1mdW5jdGlvbiBpbnNlcnRBZnRlcihyZWZOb2RlLG5vZGVUb0luc2VydCl7dmFyIHNpYmxpbmc9cmVmTm9kZS5uZXh0U2libGluZztpZihzaWJsaW5nKXt2YXIgX3BhcmVudD1yZWZOb2RlLnBhcmVudE5vZGU7X3BhcmVudC5pbnNlcnRCZWZvcmUobm9kZVRvSW5zZXJ0LHNpYmxpbmcpfWVsc2V7cGFyZW50LmFwcGVuZENoaWxkKG5vZGVUb0luc2VydCl9fWZ1bmN0aW9uIGluc2VydEJlZm9yZShyZWZOb2RlLG5vZGVUb0luc2VydCl7dmFyIHBhcmVudD1yZWZOb2RlLnBhcmVudE5vZGU7cGFyZW50Lmluc2VydEJlZm9yZShub2RlVG9JbnNlcnQscmVmTm9kZSl9ZnVuY3Rpb24gZm9yRWFjaChpdGVtcyxmbil7aWYoIWl0ZW1zKXJldHVybjtpZihpdGVtcy5mb3JFYWNoKXtpdGVtcy5mb3JFYWNoKGZuKX1lbHNle2Zvcih2YXIgaT0wO2k8aXRlbXMubGVuZ3RoO2krKyl7Zm4oaXRlbXNbaV0saSxpdGVtcyl9fX1mdW5jdGlvbiBkZWJvdW5jZShtcyxmbil7dmFyIHRpbWVvdXQ9dm9pZCAwO3ZhciBkZWJvdW5jZWRGbj1mdW5jdGlvbiBkZWJvdW5jZWRGbigpe2NsZWFyVGltZW91dCh0aW1lb3V0KTt0aW1lb3V0PXNldFRpbWVvdXQoZm4sbXMpfTtyZXR1cm4gZGVib3VuY2VkRm59fSx7fV0sMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOnRydWV9KTtleHBvcnRzLnRvZ2dsZUludmFsaWRDbGFzcz10b2dnbGVJbnZhbGlkQ2xhc3M7ZXhwb3J0cy5oYW5kbGVDdXN0b21NZXNzYWdlcz1oYW5kbGVDdXN0b21NZXNzYWdlcztleHBvcnRzLmhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5PWhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5O2V4cG9ydHMuZGVmYXVsdD12YWxpZEZvcm07dmFyIF91dGlsPXJlcXVpcmUoXCIuL3V0aWxcIik7ZnVuY3Rpb24gdG9nZ2xlSW52YWxpZENsYXNzKGlucHV0LGludmFsaWRDbGFzcyl7aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImludmFsaWRcIixmdW5jdGlvbigpe2lucHV0LmNsYXNzTGlzdC5hZGQoaW52YWxpZENsYXNzKX0pO2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLGZ1bmN0aW9uKCl7aWYoaW5wdXQudmFsaWRpdHkudmFsaWQpe2lucHV0LmNsYXNzTGlzdC5yZW1vdmUoaW52YWxpZENsYXNzKX19KX12YXIgZXJyb3JQcm9wcz1bXCJiYWRJbnB1dFwiLFwicGF0dGVybk1pc21hdGNoXCIsXCJyYW5nZU92ZXJmbG93XCIsXCJyYW5nZVVuZGVyZmxvd1wiLFwic3RlcE1pc21hdGNoXCIsXCJ0b29Mb25nXCIsXCJ0b29TaG9ydFwiLFwidHlwZU1pc21hdGNoXCIsXCJ2YWx1ZU1pc3NpbmdcIixcImN1c3RvbUVycm9yXCJdO2Z1bmN0aW9uIGdldEN1c3RvbU1lc3NhZ2UoaW5wdXQsY3VzdG9tTWVzc2FnZXMpe2N1c3RvbU1lc3NhZ2VzPWN1c3RvbU1lc3NhZ2VzfHx7fTt2YXIgbG9jYWxFcnJvclByb3BzPVtpbnB1dC50eXBlK1wiTWlzbWF0Y2hcIl0uY29uY2F0KGVycm9yUHJvcHMpO3ZhciB2YWxpZGl0eT1pbnB1dC52YWxpZGl0eTtmb3IodmFyIGk9MDtpPGxvY2FsRXJyb3JQcm9wcy5sZW5ndGg7aSsrKXt2YXIgcHJvcD1sb2NhbEVycm9yUHJvcHNbaV07aWYodmFsaWRpdHlbcHJvcF0pe3JldHVybiBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLVwiK3Byb3ApfHxjdXN0b21NZXNzYWdlc1twcm9wXX19fWZ1bmN0aW9uIGhhbmRsZUN1c3RvbU1lc3NhZ2VzKGlucHV0LGN1c3RvbU1lc3NhZ2VzKXtmdW5jdGlvbiBjaGVja1ZhbGlkaXR5KCl7dmFyIG1lc3NhZ2U9aW5wdXQudmFsaWRpdHkudmFsaWQ/bnVsbDpnZXRDdXN0b21NZXNzYWdlKGlucHV0LGN1c3RvbU1lc3NhZ2VzKTtpbnB1dC5zZXRDdXN0b21WYWxpZGl0eShtZXNzYWdlfHxcIlwiKX1pbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixjaGVja1ZhbGlkaXR5KTtpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW52YWxpZFwiLGNoZWNrVmFsaWRpdHkpfWZ1bmN0aW9uIGhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5KGlucHV0LG9wdGlvbnMpe3ZhciB2YWxpZGF0aW9uRXJyb3JDbGFzcz1vcHRpb25zLnZhbGlkYXRpb25FcnJvckNsYXNzLHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzPW9wdGlvbnMudmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3MsZXJyb3JQbGFjZW1lbnQ9b3B0aW9ucy5lcnJvclBsYWNlbWVudDtmdW5jdGlvbiBjaGVja1ZhbGlkaXR5KG9wdGlvbnMpe3ZhciBpbnNlcnRFcnJvcj1vcHRpb25zLmluc2VydEVycm9yO3ZhciBwYXJlbnROb2RlPWlucHV0LnBhcmVudE5vZGU7dmFyIGVycm9yTm9kZT1wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoXCIuXCIrdmFsaWRhdGlvbkVycm9yQ2xhc3MpfHxkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2lmKCFpbnB1dC52YWxpZGl0eS52YWxpZCYmaW5wdXQudmFsaWRhdGlvbk1lc3NhZ2Upe2Vycm9yTm9kZS5jbGFzc05hbWU9dmFsaWRhdGlvbkVycm9yQ2xhc3M7ZXJyb3JOb2RlLnRleHRDb250ZW50PWlucHV0LnZhbGlkYXRpb25NZXNzYWdlO2lmKGluc2VydEVycm9yKXtlcnJvclBsYWNlbWVudD09PVwiYmVmb3JlXCI/KDAsX3V0aWwuaW5zZXJ0QmVmb3JlKShpbnB1dCxlcnJvck5vZGUpOigwLF91dGlsLmluc2VydEFmdGVyKShpbnB1dCxlcnJvck5vZGUpO3BhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCh2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzcyl9fWVsc2V7cGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzKTtlcnJvck5vZGUucmVtb3ZlKCl9fWlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLGZ1bmN0aW9uKCl7Y2hlY2tWYWxpZGl0eSh7aW5zZXJ0RXJyb3I6ZmFsc2V9KX0pO2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnZhbGlkXCIsZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO2NoZWNrVmFsaWRpdHkoe2luc2VydEVycm9yOnRydWV9KX0pfXZhciBkZWZhdWx0T3B0aW9ucz17aW52YWxpZENsYXNzOlwiaW52YWxpZFwiLHZhbGlkYXRpb25FcnJvckNsYXNzOlwidmFsaWRhdGlvbi1lcnJvclwiLHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzOlwiaGFzLXZhbGlkYXRpb24tZXJyb3JcIixjdXN0b21NZXNzYWdlczp7fSxlcnJvclBsYWNlbWVudDpcImJlZm9yZVwifTtmdW5jdGlvbiB2YWxpZEZvcm0oZWxlbWVudCxvcHRpb25zKXtpZighZWxlbWVudHx8IWVsZW1lbnQubm9kZU5hbWUpe3Rocm93IG5ldyBFcnJvcihcIkZpcnN0IGFyZyB0byB2YWxpZEZvcm0gbXVzdCBiZSBhIGZvcm0sIGlucHV0LCBzZWxlY3QsIG9yIHRleHRhcmVhXCIpfXZhciBpbnB1dHM9dm9pZCAwO3ZhciB0eXBlPWVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtvcHRpb25zPSgwLF91dGlsLmRlZmF1bHRzKShvcHRpb25zLGRlZmF1bHRPcHRpb25zKTtpZih0eXBlPT09XCJmb3JtXCIpe2lucHV0cz1lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYVwiKTtmb2N1c0ludmFsaWRJbnB1dChlbGVtZW50LGlucHV0cyl9ZWxzZSBpZih0eXBlPT09XCJpbnB1dFwifHx0eXBlPT09XCJzZWxlY3RcInx8dHlwZT09PVwidGV4dGFyZWFcIil7aW5wdXRzPVtlbGVtZW50XX1lbHNle3Rocm93IG5ldyBFcnJvcihcIk9ubHkgZm9ybSwgaW5wdXQsIHNlbGVjdCwgb3IgdGV4dGFyZWEgZWxlbWVudHMgYXJlIHN1cHBvcnRlZFwiKX12YWxpZEZvcm1JbnB1dHMoaW5wdXRzLG9wdGlvbnMpfWZ1bmN0aW9uIGZvY3VzSW52YWxpZElucHV0KGZvcm0saW5wdXRzKXt2YXIgZm9jdXNGaXJzdD0oMCxfdXRpbC5kZWJvdW5jZSkoMTAwLGZ1bmN0aW9uKCl7dmFyIGludmFsaWROb2RlPWZvcm0ucXVlcnlTZWxlY3RvcihcIjppbnZhbGlkXCIpO2lmKGludmFsaWROb2RlKWludmFsaWROb2RlLmZvY3VzKCl9KTsoMCxfdXRpbC5mb3JFYWNoKShpbnB1dHMsZnVuY3Rpb24oaW5wdXQpe3JldHVybiBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW52YWxpZFwiLGZvY3VzRmlyc3QpfSl9ZnVuY3Rpb24gdmFsaWRGb3JtSW5wdXRzKGlucHV0cyxvcHRpb25zKXt2YXIgaW52YWxpZENsYXNzPW9wdGlvbnMuaW52YWxpZENsYXNzLGN1c3RvbU1lc3NhZ2VzPW9wdGlvbnMuY3VzdG9tTWVzc2FnZXM7KDAsX3V0aWwuZm9yRWFjaCkoaW5wdXRzLGZ1bmN0aW9uKGlucHV0KXt0b2dnbGVJbnZhbGlkQ2xhc3MoaW5wdXQsaW52YWxpZENsYXNzKTtoYW5kbGVDdXN0b21NZXNzYWdlcyhpbnB1dCxjdXN0b21NZXNzYWdlcyk7aGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkoaW5wdXQsb3B0aW9ucyl9KX19LHtcIi4vdXRpbFwiOjJ9XX0se30sWzFdKTsiLCIvKipcbiAqIERvIHRoZXNlIHRoaW5ncyBhcyBxdWlja2x5IGFzIHBvc3NpYmxlOyB3ZSBtaWdodCBoYXZlIENTUyBvciBlYXJseSBzY3JpcHRzIHRoYXQgcmVxdWlyZSBvbiBpdFxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAnbm8tanMnICk7XG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ2pzJyApO1xuIiwiLyoqXG4gKiBUaGlzIGlzIHVzZWQgdG8gY2F1c2UgR29vZ2xlIEFuYWx5dGljcyBldmVudHMgdG8gcnVuXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG4vKlxuICogQ2FsbCBob29rcyBmcm9tIG90aGVyIHBsYWNlcy5cbiAqIFRoaXMgYWxsb3dzIG90aGVyIHBsdWdpbnMgdGhhdCB3ZSBtYWludGFpbiB0byBwYXNzIGRhdGEgdG8gdGhlIHRoZW1lJ3MgYW5hbHl0aWNzIG1ldGhvZC5cbiovXG5pZiAoIHR5cGVvZiB3cCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdHdwLmhvb2tzLmFkZEFjdGlvbiggJ3dwTWVzc2FnZUluc2VydGVyQW5hbHl0aWNzRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCwgMTAgKTtcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnbWlubnBvc3RGb3JtUHJvY2Vzc29yTWFpbGNoaW1wQW5hbHl0aWNzRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCwgMTAgKTtcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnbWlubnBvc3RNZW1iZXJzaGlwQW5hbHl0aWNzRXZlbnQnLCAnbWlubnBvc3RMYXJnbycsIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCwgMTAgKTtcblx0d3AuaG9va3MuYWRkQWN0aW9uKCAnbWlubnBvc3RNZW1iZXJzaGlwQW5hbHl0aWNzRWNvbW1lcmNlQWN0aW9uJywgJ21pbm5wb3N0TGFyZ28nLCBtcEFuYWx5dGljc1RyYWNraW5nRWNvbW1lcmNlQWN0aW9uLCAxMCApO1xufVxuXG4vKlxuICogQ3JlYXRlIGEgR29vZ2xlIEFuYWx5dGljcyBldmVudCBmb3IgdGhlIHRoZW1lLiBUaGlzIGNhbGxzIHRoZSB3cC1hbmFseXRpY3MtdHJhY2tpbmctZ2VuZXJhdG9yIGFjdGlvbi5cbiAqIHR5cGU6IGdlbmVyYWxseSB0aGlzIGlzIFwiZXZlbnRcIlxuICogY2F0ZWdvcnk6IEV2ZW50IENhdGVnb3J5XG4gKiBsYWJlbDogRXZlbnQgTGFiZWxcbiAqIGFjdGlvbjogRXZlbnQgQWN0aW9uXG4gKiB2YWx1ZTogb3B0aW9uYWxcbiAqIG5vbl9pbnRlcmFjdGlvbjogb3B0aW9uYWxcbiovXG5mdW5jdGlvbiBtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSwgbm9uX2ludGVyYWN0aW9uICkge1xuXHR3cC5ob29rcy5kb0FjdGlvbiggJ3dwQW5hbHl0aWNzVHJhY2tpbmdHZW5lcmF0b3JFdmVudCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSwgbm9uX2ludGVyYWN0aW9uICk7XG59XG5cbi8qXG4gKiBDcmVhdGUgYSBHb29nbGUgQW5hbHl0aWNzIEVjb21tZXJjZSBhY3Rpb24gZm9yIHRoZSB0aGVtZS4gVGhpcyBjYWxscyB0aGUgd3AtYW5hbHl0aWNzLXRyYWNraW5nLWdlbmVyYXRvciBhY3Rpb24uXG4gKlxuKi9cbmZ1bmN0aW9uIG1wQW5hbHl0aWNzVHJhY2tpbmdFY29tbWVyY2VBY3Rpb24oIHR5cGUsIGFjdGlvbiwgcHJvZHVjdCwgc3RlcCApIHtcblx0d3AuaG9va3MuZG9BY3Rpb24oICd3cEFuYWx5dGljc1RyYWNraW5nR2VuZXJhdG9yRWNvbW1lcmNlQWN0aW9uJywgdHlwZSwgYWN0aW9uLCBwcm9kdWN0LCBzdGVwICk7XG59XG5cbi8qXG4gKiBXaGVuIGEgcGFydCBvZiB0aGUgd2Vic2l0ZSBpcyBtZW1iZXItc3BlY2lmaWMsIGNyZWF0ZSBhbiBldmVudCBmb3Igd2hldGhlciBpdCB3YXMgc2hvd24gb3Igbm90LlxuKi9cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdH1cblx0XHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3Igc2hhcmluZyBjb250ZW50XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG4vLyB0cmFjayBhIHNoYXJlIHZpYSBhbmFseXRpY3MgZXZlbnQuXG5mdW5jdGlvbiB0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiA9ICcnICkge1xuICAgIHZhciBjYXRlZ29yeSA9ICdTaGFyZSc7XG4gICAgaWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG4gICAgICAgIGNhdGVnb3J5ID0gJ1NoYXJlIC0gJyArIHBvc2l0aW9uO1xuICAgIH1cbiAgICAvLyB0cmFjayBhcyBhbiBldmVudFxuICAgIG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnksIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59XG5cbi8vIGNvcHkgdGhlIGN1cnJlbnQgVVJMIHRvIHRoZSB1c2VyJ3MgY2xpcGJvYXJkXG5mdW5jdGlvbiBjb3B5Q3VycmVudFVSTCgpIHtcbiAgICB2YXIgZHVtbXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW5wdXQnICksXG4gICAgICAgIHRleHQgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkdW1teSApO1xuICAgIGR1bW15LnZhbHVlID0gdGV4dDtcbiAgICBkdW1teS5zZWxlY3QoKTtcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZCggJ2NvcHknICk7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCggZHVtbXkgKTtcbn1cblxuLy8gdG9wIHNoYXJlIGJ1dHRvbiBjbGlja1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIubS1lbnRyeS1zaGFyZS10b3AgYVwiICkuZm9yRWFjaChcbiAgICB0b3BCdXR0b24gPT4gdG9wQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgKCBlICkgPT4ge1xuICAgICAgICB2YXIgdGV4dCA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoICdkYXRhLXNoYXJlLWFjdGlvbicgKTtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gJ3RvcCc7XG4gICAgICAgIHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG4gICAgfSApXG4pO1xuXG4vLyB3aGVuIHRoZSBwcmludCBidXR0b24gaXMgY2xpY2tlZFxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1wcmludCBhXCIgKS5mb3JFYWNoKFxuICAgIHByaW50QnV0dG9uID0+IHByaW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgKCBlICkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHdpbmRvdy5wcmludCgpO1xuICAgIH0gKVxuKTtcblxuXG4vLyB3aGVuIHRoZSByZXB1Ymxpc2ggYnV0dG9uIGlzIGNsaWNrZWRcbi8vIHRoZSBwbHVnaW4gY29udHJvbHMgdGhlIHJlc3QsIGJ1dCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGUgZGVmYXVsdCBldmVudCBkb2Vzbid0IGZpcmVcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtcmVwdWJsaXNoIGFcIiApLmZvckVhY2goXG4gICAgcmVwdWJsaXNoQnV0dG9uID0+IHJlcHVibGlzaEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsICggZSApID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gKVxuKTtcblxuLy8gd2hlbiB0aGUgY29weSBsaW5rIGJ1dHRvbiBpcyBjbGlja2VkXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWNvcHktdXJsIGFcIiApLmZvckVhY2goXG4gICAgY29weUJ1dHRvbiA9PiBjb3B5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgKCBlICkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvcHlDdXJyZW50VVJMKCk7XG4gICAgICAgIHRsaXRlLnNob3coICggZS50YXJnZXQgKSwgeyBncmF2OiAndycgfSApO1xuICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRsaXRlLmhpZGUoICggZS50YXJnZXQgKSApO1xuICAgICAgICB9LCAzMDAwICk7XG4gICAgfSApXG4pO1xuXG4vLyB3aGVuIHNoYXJpbmcgdmlhIGZhY2Vib29rLCB0d2l0dGVyLCBvciBlbWFpbCwgb3BlbiB0aGUgZGVzdGluYXRpb24gdXJsIGluIGEgbmV3IHdpbmRvd1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1mYWNlYm9vayBhLCAubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS10d2l0dGVyIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWVtYWlsIGFcIiApLmZvckVhY2goXG4gICAgYW55U2hhcmVCdXR0b24gPT4gYW55U2hhcmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCAoIGUgKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgdXJsID0gZS5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSggJ2hyZWYnICk7XG5cdFx0d2luZG93Lm9wZW4oIHVybCwgJ19ibGFuaycgKTtcbiAgICB9IClcbik7IiwiLyoqXG4gKiBGaWxlIG5hdmlnYXRpb24uanMuXG4gKlxuICogTmF2aWdhdGlvbiBzY3JpcHRzLiBJbmNsdWRlcyBtb2JpbGUgb3IgdG9nZ2xlIGJlaGF2aW9yLCBhbmFseXRpY3MgdHJhY2tpbmcgb2Ygc3BlY2lmaWMgbWVudXMuXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqL1xuXG5mdW5jdGlvbiBzZXR1cFByaW1hcnlOYXYoKSB7XG5cdGNvbnN0IHByaW1hcnlOYXZUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcubS1tZW51LXByaW1hcnktbGlua3MnICksXG5cdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0ZGlzcGxheVZhbHVlOiAnZmxleCdcblx0fSApO1xuXG5cdHZhciBwcmltYXJ5TmF2VG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ25hdiBidXR0b24nICk7XG5cdGlmICggbnVsbCAhPT0gcHJpbWFyeU5hdlRvZ2dsZSApIHtcblx0XHRwcmltYXJ5TmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0Y29uc3QgdXNlck5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy55b3VyLWFjY291bnQgdWwnICksXG5cdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0ZGlzcGxheVZhbHVlOiAnZmxleCdcblx0fSApO1xuXG5cdHZhciB1c2VyTmF2VG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy55b3VyLWFjY291bnQgPiBhJyApO1xuXHRpZiAoIG51bGwgIT09IHVzZXJOYXZUb2dnbGUgKSB7XG5cdFx0dXNlck5hdlRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHZhciB0YXJnZXQgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IC5tLWZvcm0tc2VhcmNoIGZpZWxkc2V0IC5hLWJ1dHRvbi1zZW50ZW5jZScgKTtcblx0aWYgKCBudWxsICE9PSB0YXJnZXQgKSB7XG5cdFx0dmFyIGRpdiAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0ZGl2LmlubmVySFRNTCA9ICc8YSBocmVmPVwiI1wiIGNsYXNzPVwiYS1jbG9zZS1idXR0b24gYS1jbG9zZS1zZWFyY2hcIj48aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT48L2E+Jztcblx0XHR2YXIgZnJhZ21lbnQgID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGRpdi5zZXRBdHRyaWJ1dGUoICdjbGFzcycsICdhLWNsb3NlLWhvbGRlcicgKTtcblx0XHRmcmFnbWVudC5hcHBlbmRDaGlsZCggZGl2ICk7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xuXG5cdFx0Y29uc3Qgc2VhcmNoVHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcubS1tZW51LXByaW1hcnktYWN0aW9ucyAubS1mb3JtLXNlYXJjaCcgKSxcblx0XHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdFx0ZGlzcGxheVZhbHVlOiAnZmxleCdcblx0XHR9ICk7XG5cblx0XHR2YXIgc2VhcmNoVmlzaWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICdsaS5zZWFyY2ggPiBhJyApO1xuXHRcdHNlYXJjaFZpc2libGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0dmFyIHNlYXJjaENsb3NlICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1zZWFyY2gnICk7XG5cdFx0c2VhcmNoQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0Ly8gZXNjYXBlIGtleSBwcmVzc1xuXHQkKCBkb2N1bWVudCApLmtleXVwKCBmdW5jdGlvbiggZSApIHtcblx0XHRpZiAoIDI3ID09PSBlLmtleUNvZGUgKSB7XG5cdFx0XHRsZXQgcHJpbWFyeU5hdkV4cGFuZGVkID0gJ3RydWUnID09PSBwcmltYXJ5TmF2VG9nZ2xlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRsZXQgdXNlck5hdkV4cGFuZGVkID0gJ3RydWUnID09PSB1c2VyTmF2VG9nZ2xlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRsZXQgc2VhcmNoSXNWaXNpYmxlID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHByaW1hcnlOYXZFeHBhbmRlZCAmJiB0cnVlID09PSBwcmltYXJ5TmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgcHJpbWFyeU5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgdXNlck5hdkV4cGFuZGVkICYmIHRydWUgPT09IHVzZXJOYXZFeHBhbmRlZCApIHtcblx0XHRcdFx0dXNlck5hdlRvZ2dsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISB1c2VyTmF2RXhwYW5kZWQgKTtcblx0XHRcdFx0dXNlck5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBzZWFyY2hJc1Zpc2libGUgJiYgdHJ1ZSA9PT0gc2VhcmNoSXNWaXNpYmxlICkge1xuXHRcdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHNlYXJjaElzVmlzaWJsZSApO1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcbn1cblxuZnVuY3Rpb24gc2V0dXBTY3JvbGxOYXYoIHNlbGVjdG9yLCBuYXZTZWxlY3RvciwgY29udGVudFNlbGVjdG9yICkge1xuXG5cdHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuXHR2YXIgaXNJRSA9IC9NU0lFfFRyaWRlbnQvLnRlc3QoIHVhICk7XG5cdGlmICggaXNJRSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBJbml0IHdpdGggYWxsIG9wdGlvbnMgYXQgZGVmYXVsdCBzZXR0aW5nXG5cdGNvbnN0IHByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0ID0gUHJpb3JpdHlOYXZTY3JvbGxlcigge1xuXHRcdHNlbGVjdG9yOiBzZWxlY3Rvcixcblx0XHRuYXZTZWxlY3RvcjogbmF2U2VsZWN0b3IsXG5cdFx0Y29udGVudFNlbGVjdG9yOiBjb250ZW50U2VsZWN0b3IsXG5cdFx0aXRlbVNlbGVjdG9yOiAnbGksIGEnLFxuXHRcdGJ1dHRvbkxlZnRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1sZWZ0Jyxcblx0XHRidXR0b25SaWdodFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0J1xuXG5cdFx0Ly9zY3JvbGxTdGVwOiAnYXZlcmFnZSdcblx0fSApO1xuXG5cdC8vIEluaXQgbXVsdGlwbGUgbmF2IHNjcm9sbGVycyB3aXRoIHRoZSBzYW1lIG9wdGlvbnNcblx0LypsZXQgbmF2U2Nyb2xsZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi1zY3JvbGxlcicpO1xuXG5cdG5hdlNjcm9sbGVycy5mb3JFYWNoKChjdXJyZW50VmFsdWUsIGN1cnJlbnRJbmRleCkgPT4ge1xuXHQgIFByaW9yaXR5TmF2U2Nyb2xsZXIoe1xuXHQgICAgc2VsZWN0b3I6IGN1cnJlbnRWYWx1ZVxuXHQgIH0pO1xuXHR9KTsqL1xufVxuXG5zZXR1cFByaW1hcnlOYXYoKTtcblxuaWYgKCAwIDwgJCggJy5tLXN1Yi1uYXZpZ2F0aW9uJyApLmxlbmd0aCApIHtcblx0c2V0dXBTY3JvbGxOYXYoICcubS1zdWItbmF2aWdhdGlvbicsICcubS1zdWJuYXYtbmF2aWdhdGlvbicsICcubS1tZW51LXN1Yi1uYXZpZ2F0aW9uJyApO1xufVxuaWYgKCAwIDwgJCggJy5tLXBhZ2luYXRpb24tbmF2aWdhdGlvbicgKS5sZW5ndGggKSB7XG5cdHNldHVwU2Nyb2xsTmF2KCAnLm0tcGFnaW5hdGlvbi1uYXZpZ2F0aW9uJywgJy5tLXBhZ2luYXRpb24tY29udGFpbmVyJywgJy5tLXBhZ2luYXRpb24tbGlzdCcgKTtcbn1cblxuJCggJ2EnLCAkKCAnLm8tc2l0ZS1zaWRlYmFyJyApICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHR2YXIgd2lkZ2V0VGl0bGUgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0td2lkZ2V0JyApLmZpbmQoICdoMycgKS50ZXh0KCk7XG5cdHZhciB6b25lVGl0bGUgICAgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS16b25lJyApLmZpbmQoICcuYS16b25lLXRpdGxlJyApLnRleHQoKTtcblx0dmFyIHNpZGViYXJTZWN0aW9uVGl0bGUgPSAnJztcblx0aWYgKCAnJyAhPT0gd2lkZ2V0VGl0bGUgKSB7XG5cdFx0c2lkZWJhclNlY3Rpb25UaXRsZSA9IHdpZGdldFRpdGxlO1xuXHR9IGVsc2UgaWYgKCAnJyAhPT0gem9uZVRpdGxlICkge1xuXHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB6b25lVGl0bGU7XG5cdH1cblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCAnU2lkZWJhciBMaW5rJywgJ0NsaWNrJywgc2lkZWJhclNlY3Rpb25UaXRsZSApO1xufSApO1xuXG4kKCAnYScsICQoICcubS1yZWxhdGVkJyApICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsICdSZWxhdGVkIFNlY3Rpb24gTGluaycsICdDbGljaycsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG59ICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIGZvcm1zXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbmpRdWVyeS5mbi50ZXh0Tm9kZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY29udGVudHMoKS5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoIHRoaXMubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmICcnICE9PSB0aGlzLm5vZGVWYWx1ZS50cmltKCkgKTtcblx0fSApO1xufTtcblxuZnVuY3Rpb24gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggYWN0aW9uICkge1xuXHR2YXIgbWFya3VwID0gJzxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtZm9ybS1jb25maXJtXCI+PGxhYmVsPkFyZSB5b3Ugc3VyZT8gPGEgaWQ9XCJhLWNvbmZpcm0tJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPlllczwvYT4gfCA8YSBpZD1cImEtc3RvcC0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+Tm88L2E+PC9sYWJlbD48L2xpPic7XG5cdHJldHVybiBtYXJrdXA7XG59XG5cbmZ1bmN0aW9uIG1hbmFnZUVtYWlscygpIHtcblx0dmFyIGZvcm0gICAgICAgICAgICAgICA9ICQoICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJyApO1xuXHR2YXIgcmVzdFJvb3QgICAgICAgICAgID0gdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5zaXRlX3VybCArIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3QucmVzdF9uYW1lc3BhY2U7XG5cdHZhciBmdWxsVXJsICAgICAgICAgICAgPSByZXN0Um9vdCArICcvJyArICd1cGRhdGUtdXNlci8nO1xuXHR2YXIgY29uZmlybUNoYW5nZSAgICAgID0gJyc7XG5cdHZhciBuZXh0RW1haWxDb3VudCAgICAgPSAxO1xuXHR2YXIgbmV3UHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBvbGRQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIHByaW1hcnlJZCAgICAgICAgICA9ICcnO1xuXHR2YXIgZW1haWxUb1JlbW92ZSAgICAgID0gJyc7XG5cdHZhciBjb25zb2xpZGF0ZWRFbWFpbHMgPSBbXTtcblx0dmFyIG5ld0VtYWlscyAgICAgICAgICA9IFtdO1xuXHR2YXIgYWpheEZvcm1EYXRhICAgICAgID0gJyc7XG5cdHZhciB0aGF0ICAgICAgICAgICAgICAgPSAnJztcblxuXHQvLyBzdGFydCBvdXQgd2l0aCBubyBwcmltYXJ5L3JlbW92YWxzIGNoZWNrZWRcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0Ly8gaWYgdGhlcmUgaXMgYSBsaXN0IG9mIGVtYWlscyAobm90IGp1c3QgYSBzaW5nbGUgZm9ybSBmaWVsZClcblx0aWYgKCAwIDwgJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHNlbGVjdHMgYSBuZXcgcHJpbWFyeSwgbW92ZSBpdCBpbnRvIHRoYXQgcG9zaXRpb25cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScsIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRuZXdQcmltYXJ5RW1haWwgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRvbGRQcmltYXJ5RW1haWwgPSAkKCAnI2VtYWlsJyApLnZhbCgpO1xuXHRcdFx0cHJpbWFyeUlkICAgICAgID0gJCggdGhpcyApLnByb3AoICdpZCcgKS5yZXBsYWNlKCAncHJpbWFyeV9lbWFpbF8nLCAnJyApO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3ByaW1hcnktY2hhbmdlJyApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXJcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cblx0XHRcdC8vJCggdGhpcyApLnBhcmVudCgpLmFmdGVyKCBjb25maXJtQ2hhbmdlICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgdXNlciBmYWNpbmcgdmFsdWVzXG5cdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBuZXdQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyN1c2VyLWVtYWlsLScgKyBwcmltYXJ5SWQgKS50ZXh0Tm9kZXMoKS5maXJzdCgpLnJlcGxhY2VXaXRoKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIG1haW4gaGlkZGVuIGZvcm0gdmFsdWVcblx0XHRcdFx0JCggJyNlbWFpbCcgKS52YWwoIG5ld1ByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHN1Ym1pdCBmb3JtIHZhbHVlcy5cblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblxuXHRcdFx0XHQvLyB1bmNoZWNrIHRoZSByYWRpbyBidXR0b25cblx0XHRcdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgZm9ybSB2YWx1ZXMgdG8gdGhlIG9sZCBwcmltYXJ5IGVtYWlsXG5cdFx0XHRcdCQoICcjcHJpbWFyeV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblx0XHRcdFx0JCggJyNyZW1vdmVfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIHRoZSBjb25maXJtIG1lc3NhZ2Vcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdH0gKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXByaW1hcnktY2hhbmdlJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdC8vIGlmIGEgdXNlciByZW1vdmVzIGFuIGVtYWlsLCB0YWtlIGl0IGF3YXkgZnJvbSB0aGUgdmlzdWFsIGFuZCBmcm9tIHRoZSBmb3JtXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NoYW5nZScsICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRlbWFpbFRvUmVtb3ZlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0Y29uZmlybUNoYW5nZSAgID0gZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCggJ3JlbW92YWwnICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICE9PSBlbWFpbFRvUmVtb3ZlICkge1xuXHRcdFx0XHRcdGNvbnNvbGlkYXRlZEVtYWlscy5wdXNoKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBnZXQgb3IgZG9uJ3QgZ2V0IGNvbmZpcm1hdGlvbiBmcm9tIHVzZXIgZm9yIHJlbW92YWxcblx0XHRcdHRoYXQgPSAkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0ICkuaGlkZSgpO1xuXHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQgKS5zaG93KCk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoICdhLXByZS1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnYS1zdG9wLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkuYXBwZW5kKCBjb25maXJtQ2hhbmdlICk7XG5cblx0XHRcdC8vIGlmIGNvbmZpcm1lZCwgcmVtb3ZlIHRoZSBlbWFpbCBhbmQgc3VibWl0IHRoZSBmb3JtXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpJyApLmZhZGVPdXQoICdub3JtYWwnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkucmVtb3ZlKCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXG5cdFx0XHRcdC8vY29uc29sZS5sb2coICd2YWx1ZSBpcyAnICsgY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cdFx0XHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblx0XHRcdFx0Zm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1zdG9wLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0Ly8gaWYgYSB1c2VyIHdhbnRzIHRvIGFkZCBhbiBlbWFpbCwgZ2l2ZSB0aGVtIGEgcHJvcGVybHkgbnVtYmVyZWQgZmllbGRcblx0JCggJy5tLWZvcm0tZW1haWwnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJyApLmJlZm9yZSggJzxkaXYgY2xhc3M9XCJhLWlucHV0LXdpdGgtYnV0dG9uIGEtYnV0dG9uLXNlbnRlbmNlXCI+PGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgaWQ9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCIgdmFsdWU9XCJcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBuYW1lPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGlkPVwiYS1hZGQtZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIGNsYXNzPVwiYS1idXR0b24gYS1idXR0b24tYWRkLXVzZXItZW1haWxcIj5BZGQ8L2J1dHRvbj48L2Rpdj4nICk7XG5cdFx0bmV4dEVtYWlsQ291bnQrKztcblx0fSApO1xuXG5cdCQoICdpbnB1dFt0eXBlPXN1Ym1pdF0nICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBidXR0b24gPSAkKCB0aGlzICk7XG5cdFx0dmFyIGJ1dHRvbkZvcm0gPSBidXR0b24uY2xvc2VzdCggJ2Zvcm0nICk7XG5cdFx0YnV0dG9uRm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nLCBidXR0b24udmFsKCkgKTtcblx0fSApO1xuXG5cdCQoICcubS1lbnRyeS1jb250ZW50JyApLm9uKCAnc3VibWl0JywgJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0dmFyIGZvcm0gPSAkKCB0aGlzICk7XG5cdFx0dmFyIHN1Ym1pdHRpbmdCdXR0b24gPSBmb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicgKSB8fCAnJztcblxuXHRcdC8vIGlmIHRoZXJlIGlzIG5vIHN1Ym1pdHRpbmcgYnV0dG9uLCBwYXNzIGl0IGJ5IEFqYXhcblx0XHRpZiAoICcnID09PSBzdWJtaXR0aW5nQnV0dG9uIHx8ICdTYXZlIENoYW5nZXMnICE9PSBzdWJtaXR0aW5nQnV0dG9uICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGFqYXhGb3JtRGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7IC8vYWRkIG91ciBvd24gYWpheCBjaGVjayBhcyBYLVJlcXVlc3RlZC1XaXRoIGlzIG5vdCBhbHdheXMgcmVsaWFibGVcblx0XHRcdGFqYXhGb3JtRGF0YSA9IGFqYXhGb3JtRGF0YSArICcmcmVzdD10cnVlJztcblx0XHRcdCQuYWpheCgge1xuXHRcdFx0XHR1cmw6IGZ1bGxVcmwsXG5cdFx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdFx0YmVmb3JlU2VuZDogZnVuY3Rpb24oIHhociApIHtcblx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggJ1gtV1AtTm9uY2UnLCB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Lm5vbmNlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdGRhdGE6IGFqYXhGb3JtRGF0YVxuXHRcdFx0fSApLmRvbmUoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRuZXdFbWFpbHMgPSAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkubWFwKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHR9ICkuZ2V0KCk7XG5cdFx0XHRcdCQuZWFjaCggbmV3RW1haWxzLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICkge1xuXHRcdFx0XHRcdG5leHRFbWFpbENvdW50ID0gbmV4dEVtYWlsQ291bnQgKyBpbmRleDtcblx0XHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmFwcGVuZCggJzxsaSBpZD1cInVzZXItZW1haWwtJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPicgKyB2YWx1ZSArICc8dWwgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXVzZXItZW1haWwtYWN0aW9uc1wiPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1tYWtlLXByaW1hcnktZW1haWxcIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInByaW1hcnlfZW1haWxcIiBpZD1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+TWFrZSBQcmltYXJ5PC9zbWFsbD48L2xhYmVsPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLWVtYWlsLXByZWZlcmVuY2VzXCI+PGEgaHJlZj1cIi9uZXdzbGV0dGVycy8/ZW1haWw9JyArIGVuY29kZVVSSUNvbXBvbmVudCggdmFsdWUgKSArICdcIj48c21hbGw+RW1haWwgUHJlZmVyZW5jZXM8L3NtYWxsPjwvYT48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1yZW1vdmUtZW1haWxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInJlbW92ZV9lbWFpbFsnICsgbmV4dEVtYWlsQ291bnQgKyAnXVwiIGlkPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicmVtb3ZlX2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIj48c21hbGw+UmVtb3ZlPC9zbWFsbD48L2xhYmVsPjwvbGk+PC91bD48L2xpPicgKTtcblx0XHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggJCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoKSArICcsJyArIHZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0JCggJy5tLWZvcm0tY2hhbmdlLWVtYWlsIC5hLWlucHV0LXdpdGgtYnV0dG9uJyApLnJlbW92ZSgpO1xuXHRcdFx0XHRpZiAoIDAgPT09ICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdGlmICggJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApICE9PSAkKCAnaW5wdXRbbmFtZT1cImVtYWlsXCJdJyApICkge1xuXG5cdFx0XHRcdFx0XHQvLyBpdCB3b3VsZCBiZSBuaWNlIHRvIG9ubHkgbG9hZCB0aGUgZm9ybSwgYnV0IHRoZW4gY2xpY2sgZXZlbnRzIHN0aWxsIGRvbid0IHdvcmtcblx0XHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblx0fSApO1xufVxuXG5mdW5jdGlvbiBhZGRBdXRvUmVzaXplKCkge1xuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnW2RhdGEtYXV0b3Jlc2l6ZV0nICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0ZWxlbWVudC5zdHlsZS5ib3hTaXppbmcgPSAnYm9yZGVyLWJveCc7XG5cdFx0dmFyIG9mZnNldCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC50YXJnZXQuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuXHRcdFx0ZXZlbnQudGFyZ2V0LnN0eWxlLmhlaWdodCA9IGV2ZW50LnRhcmdldC5zY3JvbGxIZWlnaHQgKyBvZmZzZXQgKyAncHgnO1xuXHRcdH0gKTtcblx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSggJ2RhdGEtYXV0b3Jlc2l6ZScgKTtcblx0fSApO1xufVxuXG4kKCBkb2N1bWVudCApLmFqYXhTdG9wKCBmdW5jdGlvbigpIHtcblx0dmFyIGNvbW1lbnRBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJyNsbGNfY29tbWVudHMnICk7XG5cdGlmICggbnVsbCAhPT0gY29tbWVudEFyZWEgKSB7XG5cdFx0YWRkQXV0b1Jlc2l6ZSgpO1xuXHR9XG59ICk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmICggMCA8ICQoICcubS1mb3JtLWFjY291bnQtc2V0dGluZ3MnICkubGVuZ3RoICkge1xuXHRcdG1hbmFnZUVtYWlscygpO1xuXHR9XG5cdHZhciBhdXRvUmVzaXplVGV4dGFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnW2RhdGEtYXV0b3Jlc2l6ZV0nICk7XG5cdGlmICggbnVsbCAhPT0gYXV0b1Jlc2l6ZVRleHRhcmVhICkge1xuXHRcdGFkZEF1dG9SZXNpemUoKTtcblx0fVxufSApO1xuXG52YXIgZm9ybXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm0tZm9ybScgKTtcbmZvcm1zLmZvckVhY2goIGZ1bmN0aW9uKCBmb3JtICkge1xuXHRWYWxpZEZvcm0oIGZvcm0sIHtcblx0XHR2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzczogJ20taGFzLXZhbGlkYXRpb24tZXJyb3InLFxuXHRcdHZhbGlkYXRpb25FcnJvckNsYXNzOiAnYS12YWxpZGF0aW9uLWVycm9yJyxcblx0XHRpbnZhbGlkQ2xhc3M6ICdhLWVycm9yJyxcblx0XHRlcnJvclBsYWNlbWVudDogJ2FmdGVyJ1xuXHR9ICk7XG59ICk7XG5cbnZhciBmb3JtID0gJCggJy5tLWZvcm0nICk7XG5cbi8vIGxpc3RlbiBmb3IgYGludmFsaWRgIGV2ZW50cyBvbiBhbGwgZm9ybSBpbnB1dHNcbmZvcm0uZmluZCggJzppbnB1dCcgKS5vbiggJ2ludmFsaWQnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5wdXQgPSAkKCB0aGlzICk7XG5cbiAgICAvLyB0aGUgZmlyc3QgaW52YWxpZCBlbGVtZW50IGluIHRoZSBmb3JtXG5cdHZhciBmaXJzdCA9IGZvcm0uZmluZCggJy5hLWVycm9yJyApLmZpcnN0KCk7XG5cblx0Ly8gdGhlIGZvcm0gaXRlbSB0aGF0IGNvbnRhaW5zIGl0XG5cdHZhciBmaXJzdF9ob2xkZXIgPSBmaXJzdC5wYXJlbnQoKTtcblxuICAgIC8vIG9ubHkgaGFuZGxlIGlmIHRoaXMgaXMgdGhlIGZpcnN0IGludmFsaWQgaW5wdXRcbiAgICBpZiAoIGlucHV0WzBdID09PSBmaXJzdFswXSApIHtcblxuICAgICAgICAvLyBoZWlnaHQgb2YgdGhlIG5hdiBiYXIgcGx1cyBzb21lIHBhZGRpbmcgaWYgdGhlcmUncyBhIGZpeGVkIG5hdlxuICAgICAgICAvL3ZhciBuYXZiYXJIZWlnaHQgPSBuYXZiYXIuaGVpZ2h0KCkgKyA1MFxuXG4gICAgICAgIC8vIHRoZSBwb3NpdGlvbiB0byBzY3JvbGwgdG8gKGFjY291bnRpbmcgZm9yIHRoZSBuYXZiYXIgaWYgaXQgZXhpc3RzKVxuICAgICAgICB2YXIgZWxlbWVudE9mZnNldCA9IGZpcnN0X2hvbGRlci5vZmZzZXQoKS50b3A7XG5cbiAgICAgICAgLy8gdGhlIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uIChhY2NvdW50aW5nIGZvciB0aGUgbmF2YmFyKVxuICAgICAgICB2YXIgcGFnZU9mZnNldCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcblxuICAgICAgICAvLyBkb24ndCBzY3JvbGwgaWYgdGhlIGVsZW1lbnQgaXMgYWxyZWFkeSBpbiB2aWV3XG4gICAgICAgIGlmICggZWxlbWVudE9mZnNldCA+IHBhZ2VPZmZzZXQgJiYgZWxlbWVudE9mZnNldCA8IHBhZ2VPZmZzZXQgKyB3aW5kb3cuaW5uZXJIZWlnaHQgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vdGU6IGF2b2lkIHVzaW5nIGFuaW1hdGUsIGFzIGl0IHByZXZlbnRzIHRoZSB2YWxpZGF0aW9uIG1lc3NhZ2UgZGlzcGxheWluZyBjb3JyZWN0bHlcbiAgICAgICAgJCggJ2h0bWwsIGJvZHknICkuc2Nyb2xsVG9wKCBlbGVtZW50T2Zmc2V0ICk7XG4gICAgfVxufSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBjb21tZW50c1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG4vLyBiYXNlZCBvbiB3aGljaCBidXR0b24gd2FzIGNsaWNrZWQsIHNldCB0aGUgdmFsdWVzIGZvciB0aGUgYW5hbHl0aWNzIGV2ZW50IGFuZCBjcmVhdGUgaXRcbmZ1bmN0aW9uIHRyYWNrU2hvd0NvbW1lbnRzKCBhbHdheXMsIGlkLCBjbGlja1ZhbHVlICkge1xuXHR2YXIgYWN0aW9uICAgICAgICAgID0gJyc7XG5cdHZhciBjYXRlZ29yeVByZWZpeCA9ICcnO1xuXHR2YXIgY2F0ZWdvcnlTdWZmaXggPSAnJztcblx0dmFyIHBvc2l0aW9uICAgICAgICA9ICcnO1xuXHRwb3NpdGlvbiA9IGlkLnJlcGxhY2UoICdhbHdheXMtc2hvdy1jb21tZW50cy0nLCAnJyApO1xuXHRpZiAoICcxJyA9PT0gY2xpY2tWYWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT24nO1xuXHR9IGVsc2UgaWYgKCAnMCcgPT09IGNsaWNrVmFsdWUgKSB7XG5cdFx0YWN0aW9uID0gJ09mZic7XG5cdH0gZWxzZSB7XG5cdFx0YWN0aW9uID0gJ0NsaWNrJztcblx0fVxuXHRpZiAoIHRydWUgPT09IGFsd2F5cyApIHtcblx0XHRjYXRlZ29yeVByZWZpeCA9ICdBbHdheXMgJztcblx0fVxuXHRpZiAoICcnICE9PSBwb3NpdGlvbiApIHtcblx0XHRwb3NpdGlvbiA9IHBvc2l0aW9uLmNoYXJBdCggMCApLnRvVXBwZXJDYXNlKCkgKyBwb3NpdGlvbi5zbGljZSggMSApO1xuXHRcdGNhdGVnb3J5U3VmZml4ID0gJyAtICcgKyBwb3NpdGlvbjtcblx0fVxuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsIGNhdGVnb3J5UHJlZml4ICsgJ1Nob3cgQ29tbWVudHMnICsgY2F0ZWdvcnlTdWZmaXgsIGFjdGlvbiwgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn1cblxuLy8gd2hlbiBzaG93aW5nIGNvbW1lbnRzIG9uY2UsIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWJ1dHRvbi1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHRyYWNrU2hvd0NvbW1lbnRzKCBmYWxzZSwgJycsICcnICk7XG59ICk7XG5cbi8vIFNldCB1c2VyIG1ldGEgdmFsdWUgZm9yIGFsd2F5cyBzaG93aW5nIGNvbW1lbnRzIGlmIHRoYXQgYnV0dG9uIGlzIGNsaWNrZWRcbiQoIGRvY3VtZW50ICkub24oICdjbGljaycsICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycsIGZ1bmN0aW9uKCkge1xuXHR2YXIgdGhhdCA9ICQoIHRoaXMgKTtcblx0aWYgKCB0aGF0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9IGVsc2Uge1xuXHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvLyB0cmFjayBpdCBhcyBhbiBhbmFseXRpY3MgZXZlbnRcblx0dHJhY2tTaG93Q29tbWVudHMoIHRydWUsIHRoYXQuYXR0ciggJ2lkJyApLCB0aGF0LnZhbCgpICk7XG5cblx0Ly8gd2UgYWxyZWFkeSBoYXZlIGFqYXh1cmwgZnJvbSB0aGUgdGhlbWVcblx0JC5hamF4KCB7XG5cdFx0dHlwZTogJ1BPU1QnLFxuXHRcdHVybDogcGFyYW1zLmFqYXh1cmwsXG5cdFx0ZGF0YToge1xuXHRcdFx0J2FjdGlvbic6ICdtaW5ucG9zdF9sYXJnb19sb2FkX2NvbW1lbnRzX3NldF91c2VyX21ldGEnLFxuXHRcdFx0J3ZhbHVlJzogdGhhdC52YWwoKVxuXHRcdH0sXG5cdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0JCggJy5hLWFsd2F5cy1zaG93LWNvbW1lbnRzLXJlc3VsdCcsIHRoYXQucGFyZW50KCkgKS5odG1sKCByZXNwb25zZS5kYXRhLm1lc3NhZ2UgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gcmVzcG9uc2UuZGF0YS5zaG93ICkge1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAwICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkudmFsKCAxICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG59ICk7XG5cbiEgKCBmdW5jdGlvbiggZCApIHtcblx0aWYgKCAhIGQuY3VycmVudFNjcmlwdCApIHtcblx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdGFjdGlvbjogJ2xsY19sb2FkX2NvbW1lbnRzJyxcblx0XHRcdHBvc3Q6ICQoICcjbGxjX3Bvc3RfaWQnICkudmFsKClcblx0XHR9O1xuXG5cdFx0Ly8gQWpheCByZXF1ZXN0IGxpbmsuXG5cdFx0dmFyIGxsY2FqYXh1cmwgPSAkKCAnI2xsY19hamF4X3VybCcgKS52YWwoKTtcblxuXHRcdC8vIEZ1bGwgdXJsIHRvIGdldCBjb21tZW50cyAoQWRkaW5nIHBhcmFtZXRlcnMpLlxuXHRcdHZhciBjb21tZW50VXJsID0gbGxjYWpheHVybCArICc/JyArICQucGFyYW0oIGRhdGEgKTtcblxuXHRcdC8vIFBlcmZvcm0gYWpheCByZXF1ZXN0LlxuXHRcdCQuZ2V0KCBjb21tZW50VXJsLCBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRpZiAoICcnICE9PSByZXNwb25zZSApIHtcblx0XHRcdFx0JCggJyNsbGNfY29tbWVudHMnICkuaHRtbCggcmVzcG9uc2UgKTtcblxuXHRcdFx0XHQvLyBJbml0aWFsaXplIGNvbW1lbnRzIGFmdGVyIGxhenkgbG9hZGluZy5cblx0XHRcdFx0aWYgKCB3aW5kb3cuYWRkQ29tbWVudCAmJiB3aW5kb3cuYWRkQ29tbWVudC5pbml0ICkge1xuXHRcdFx0XHRcdHdpbmRvdy5hZGRDb21tZW50LmluaXQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEdldCB0aGUgY29tbWVudCBsaSBpZCBmcm9tIHVybCBpZiBleGlzdC5cblx0XHRcdFx0dmFyIGNvbW1lbnRJZCA9IGRvY3VtZW50LlVSTC5zdWJzdHIoIGRvY3VtZW50LlVSTC5pbmRleE9mKCAnI2NvbW1lbnQnICkgKTtcblxuXHRcdFx0XHQvLyBJZiBjb21tZW50IGlkIGZvdW5kLCBzY3JvbGwgdG8gdGhhdCBjb21tZW50LlxuXHRcdFx0XHRpZiAoIC0xIDwgY29tbWVudElkLmluZGV4T2YoICcjY29tbWVudCcgKSApIHtcblx0XHRcdFx0XHQkKCB3aW5kb3cgKS5zY3JvbGxUb3AoICQoIGNvbW1lbnRJZCApLm9mZnNldCgpLnRvcCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG59KCBkb2N1bWVudCApICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIGV2ZW50c1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuY29uc3QgdGFyZ2V0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcuYS1ldmVudHMtY2FsLWxpbmtzJyApO1xudGFyZ2V0cy5mb3JFYWNoKCBmdW5jdGlvbiggdGFyZ2V0ICkge1xuICAgIHNldENhbGVuZGFyKCB0YXJnZXQgKTtcbn0pO1xuXG5mdW5jdGlvbiBzZXRDYWxlbmRhciggdGFyZ2V0ICkge1xuICAgIGlmICggbnVsbCAhPT0gdGFyZ2V0ICkge1xuICAgICAgICB2YXIgbGkgICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2xpJyApO1xuICAgICAgICBsaS5pbm5lckhUTUwgID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLWNhbGVuZGFyXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG4gICAgICAgIHZhciBmcmFnbWVudCAgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGxpLnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCggbGkgKTtcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xuICAgIH1cbn1cblxuY29uc3QgY2FsZW5kYXJzVmlzaWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubS1ldmVudC1kYXRldGltZSBhJyApO1xuY2FsZW5kYXJzVmlzaWJsZS5mb3JFYWNoKCBmdW5jdGlvbiggY2FsZW5kYXJWaXNpYmxlICkge1xuICAgIHNob3dDYWxlbmRhciggY2FsZW5kYXJWaXNpYmxlICk7XG59KTtcblxuZnVuY3Rpb24gc2hvd0NhbGVuZGFyKCBjYWxlbmRhclZpc2libGUgKSB7XG4gICAgY29uc3QgZGF0ZUhvbGRlciA9IGNhbGVuZGFyVmlzaWJsZS5jbG9zZXN0KCAnLm0tZXZlbnQtZGF0ZS1hbmQtY2FsZW5kYXInICk7XG4gICAgY29uc3QgY2FsZW5kYXJUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuICAgICAgICBlbGVtZW50OiBkYXRlSG9sZGVyLnF1ZXJ5U2VsZWN0b3IoICcuYS1ldmVudHMtY2FsLWxpbmtzJyApLFxuICAgICAgICB2aXNpYmxlQ2xhc3M6ICdhLWV2ZW50cy1jYWwtbGluay12aXNpYmxlJyxcbiAgICAgICAgZGlzcGxheVZhbHVlOiAnYmxvY2snXG4gICAgfSApO1xuXG4gICAgaWYgKCBudWxsICE9PSBjYWxlbmRhclZpc2libGUgKSB7XG4gICAgICAgIGNhbGVuZGFyVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gY2FsZW5kYXJWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG4gICAgICAgICAgICBjYWxlbmRhclZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcbiAgICAgICAgICAgIGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG4gICAgICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApO1xuXG4gICAgICAgIHZhciBjYWxlbmRhckNsb3NlID0gZGF0ZUhvbGRlci5xdWVyeVNlbGVjdG9yKCAnLmEtY2xvc2UtY2FsZW5kYXInICk7XG4gICAgICAgIGlmICggbnVsbCAhPT0gY2FsZW5kYXJDbG9zZSApIHtcbiAgICAgICAgICAgIGNhbGVuZGFyQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gY2FsZW5kYXJWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG4gICAgICAgICAgICAgICAgY2FsZW5kYXJWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgICAgICAgICAgICAgaWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
}(jQuery));
