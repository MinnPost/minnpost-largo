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

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDQtdmFsaWQtZm9ybS5taW4uanMiLCIwMC1zdGFydC5qcyIsIjAxLWFuYWx5dGljcy5qcyIsIjAyLXNoYXJlLmpzIiwiMDMtbmF2aWdhdGlvbi5qcyIsIjA0LWZvcm1zLmpzIiwiMDUtY29tbWVudHMuanMiLCIwNi1jYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJ0bGl0ZSIsInQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiaSIsInRhcmdldCIsIm4iLCJwYXJlbnRFbGVtZW50Iiwic2hvdyIsInRvb2x0aXAiLCJvIiwiaGlkZSIsImwiLCJyIiwiY2xhc3NOYW1lIiwicyIsIm9mZnNldFRvcCIsIm9mZnNldExlZnQiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImQiLCJmIiwiYSIsInN0eWxlIiwidG9wIiwibGVmdCIsImNyZWF0ZUVsZW1lbnQiLCJncmF2IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJib3R0b20iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInJpZ2h0IiwiaW5uZXJXaWR0aCIsInRpdGxlIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJ0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCIsImVsZW1lbnQiLCJ2aXNpYmxlQ2xhc3MiLCJ3YWl0TW9kZSIsInRpbWVvdXREdXJhdGlvbiIsImhpZGVNb2RlIiwiZGlzcGxheVZhbHVlIiwiY29uc29sZSIsImVycm9yIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJsaXN0ZW5lciIsImFwcGx5SGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwbGF5IiwicmVtb3ZlSGlkZGVuQXR0cmlidXRlcyIsInJlbW92ZUF0dHJpYnV0ZSIsInRyYW5zaXRpb25TaG93IiwidGltZW91dCIsInJlZmxvdyIsImNsYXNzTGlzdCIsImFkZCIsInRyYW5zaXRpb25IaWRlIiwicmVtb3ZlIiwidG9nZ2xlIiwiaXNIaWRkZW4iLCJoYXNIaWRkZW5BdHRyaWJ1dGUiLCJpc0Rpc3BsYXlOb25lIiwiaGFzVmlzaWJsZUNsYXNzIiwiaW5jbHVkZXMiLCJQcmlvcml0eU5hdlNjcm9sbGVyIiwic2VsZWN0b3IiLCJuYXZTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsIml0ZW1TZWxlY3RvciIsImJ1dHRvbkxlZnRTZWxlY3RvciIsImJ1dHRvblJpZ2h0U2VsZWN0b3IiLCJzY3JvbGxTdGVwIiwibmF2U2Nyb2xsZXIiLCJxdWVyeVNlbGVjdG9yIiwidmFsaWRhdGVTY3JvbGxTdGVwIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYXZTY3JvbGxlck5hdiIsIm5hdlNjcm9sbGVyQ29udGVudCIsIm5hdlNjcm9sbGVyQ29udGVudEl0ZW1zIiwicXVlcnlTZWxlY3RvckFsbCIsIm5hdlNjcm9sbGVyTGVmdCIsIm5hdlNjcm9sbGVyUmlnaHQiLCJzY3JvbGxpbmciLCJzY3JvbGxBdmFpbGFibGVMZWZ0Iiwic2Nyb2xsQXZhaWxhYmxlUmlnaHQiLCJzY3JvbGxpbmdEaXJlY3Rpb24iLCJzY3JvbGxPdmVyZmxvdyIsInNldE92ZXJmbG93IiwiZ2V0T3ZlcmZsb3ciLCJ0b2dnbGVCdXR0b25zIiwiY2FsY3VsYXRlU2Nyb2xsU3RlcCIsInJlcXVlc3RTZXRPdmVyZmxvdyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic2Nyb2xsV2lkdGgiLCJzY3JvbGxWaWV3cG9ydCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNjcm9sbExlZnRDb25kaXRpb24iLCJzY3JvbGxSaWdodENvbmRpdGlvbiIsInNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIiwicGFyc2VJbnQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjcm9sbFN0ZXBBdmVyYWdlIiwiTWF0aCIsImZsb29yIiwibGVuZ3RoIiwibW92ZVNjcm9sbGVyIiwiZGlyZWN0aW9uIiwic2Nyb2xsRGlzdGFuY2UiLCJzY3JvbGxBdmFpbGFibGUiLCJ0cmFuc2Zvcm0iLCJzZXRTY3JvbGxlclBvc2l0aW9uIiwidHJhbnNmb3JtVmFsdWUiLCJhYnMiLCJzcGxpdCIsIm92ZXJmbG93IiwiaW5pdCIsImMiLCJyZXF1aXJlIiwidSIsImNvZGUiLCJwIiwiY2FsbCIsIl92YWxpZEZvcm0iLCJfdmFsaWRGb3JtMiIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIlZhbGlkRm9ybSIsInRvZ2dsZUludmFsaWRDbGFzcyIsImhhbmRsZUN1c3RvbU1lc3NhZ2VzIiwiaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiY2xvbmUiLCJkZWZhdWx0cyIsImluc2VydEFmdGVyIiwiaW5zZXJ0QmVmb3JlIiwiZm9yRWFjaCIsImRlYm91bmNlIiwiY29weSIsImF0dHIiLCJoYXNPd25Qcm9wZXJ0eSIsImRlZmF1bHRPYmplY3QiLCJrIiwicmVmTm9kZSIsIm5vZGVUb0luc2VydCIsInNpYmxpbmciLCJuZXh0U2libGluZyIsIl9wYXJlbnQiLCJwYXJlbnQiLCJpdGVtcyIsImZuIiwibXMiLCJkZWJvdW5jZWRGbiIsInZhbGlkRm9ybSIsIl91dGlsIiwiaW5wdXQiLCJpbnZhbGlkQ2xhc3MiLCJ2YWxpZGl0eSIsInZhbGlkIiwiZXJyb3JQcm9wcyIsImdldEN1c3RvbU1lc3NhZ2UiLCJjdXN0b21NZXNzYWdlcyIsImxvY2FsRXJyb3JQcm9wcyIsInR5cGUiLCJjb25jYXQiLCJwcm9wIiwiY2hlY2tWYWxpZGl0eSIsIm1lc3NhZ2UiLCJzZXRDdXN0b21WYWxpZGl0eSIsIm9wdGlvbnMiLCJ2YWxpZGF0aW9uRXJyb3JDbGFzcyIsInZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzIiwiZXJyb3JQbGFjZW1lbnQiLCJpbnNlcnRFcnJvciIsImVycm9yTm9kZSIsInZhbGlkYXRpb25NZXNzYWdlIiwidGV4dENvbnRlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImRlZmF1bHRPcHRpb25zIiwibm9kZU5hbWUiLCJpbnB1dHMiLCJ0b0xvd2VyQ2FzZSIsImZvY3VzSW52YWxpZElucHV0IiwidmFsaWRGb3JtSW5wdXRzIiwiZm9ybSIsImZvY3VzRmlyc3QiLCJpbnZhbGlkTm9kZSIsImZvY3VzIiwiZG9jdW1lbnRFbGVtZW50IiwibXBBbmFseXRpY3NUcmFja2luZ0V2ZW50IiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsImdhIiwiZXZlbnQiLCJtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEiLCJ1cmxfYWNjZXNzX2xldmVsIiwibG9jYXRpb24iLCJwYXRobmFtZSIsImN1cnJlbnRfdXNlciIsImNhbl9hY2Nlc3MiLCJ0cmFja1NoYXJlIiwidGV4dCIsInBvc2l0aW9uIiwialF1ZXJ5IiwiaGFzQ2xhc3MiLCJjb3B5Q3VycmVudFVSTCIsImR1bW15IiwiaHJlZiIsImJvZHkiLCJzZWxlY3QiLCJleGVjQ29tbWFuZCIsIiQiLCJjbGljayIsImRhdGEiLCJwcmludCIsInVybCIsIm9wZW4iLCJzZXR1cFByaW1hcnlOYXYiLCJwcmltYXJ5TmF2VHJhbnNpdGlvbmVyIiwicHJpbWFyeU5hdlRvZ2dsZSIsImV4cGFuZGVkIiwidXNlck5hdlRyYW5zaXRpb25lciIsInVzZXJOYXZUb2dnbGUiLCJkaXYiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJzZWFyY2hUcmFuc2l0aW9uZXIiLCJzZWFyY2hWaXNpYmxlIiwic2VhcmNoQ2xvc2UiLCJrZXl1cCIsImtleUNvZGUiLCJwcmltYXJ5TmF2RXhwYW5kZWQiLCJ1c2VyTmF2RXhwYW5kZWQiLCJzZWFyY2hJc1Zpc2libGUiLCJzZXR1cFNjcm9sbE5hdiIsInVhIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiaXNJRSIsInRlc3QiLCJwcmlvcml0eU5hdlNjcm9sbGVyRGVmYXVsdCIsIndpZGdldFRpdGxlIiwiY2xvc2VzdCIsImZpbmQiLCJ6b25lVGl0bGUiLCJzaWRlYmFyU2VjdGlvblRpdGxlIiwidGV4dE5vZGVzIiwiY29udGVudHMiLCJmaWx0ZXIiLCJub2RlVHlwZSIsIk5vZGUiLCJURVhUX05PREUiLCJub2RlVmFsdWUiLCJ0cmltIiwiZ2V0Q29uZmlybUNoYW5nZU1hcmt1cCIsIm1hcmt1cCIsIm1hbmFnZUVtYWlscyIsInJlc3RSb290IiwidXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdCIsInNpdGVfdXJsIiwicmVzdF9uYW1lc3BhY2UiLCJmdWxsVXJsIiwiY29uZmlybUNoYW5nZSIsIm5leHRFbWFpbENvdW50IiwibmV3UHJpbWFyeUVtYWlsIiwib2xkUHJpbWFyeUVtYWlsIiwicHJpbWFyeUlkIiwiZW1haWxUb1JlbW92ZSIsImNvbnNvbGlkYXRlZEVtYWlscyIsIm5ld0VtYWlscyIsImFqYXhGb3JtRGF0YSIsInRoYXQiLCJvbiIsInZhbCIsInJlcGxhY2UiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJnZXQiLCJwdXNoIiwicGFyZW50cyIsImZhZGVPdXQiLCJqb2luIiwiYmVmb3JlIiwiYnV0dG9uIiwiYnV0dG9uRm9ybSIsInN1Ym1pdHRpbmdCdXR0b24iLCJzZXJpYWxpemUiLCJhamF4IiwiYmVmb3JlU2VuZCIsInhociIsInNldFJlcXVlc3RIZWFkZXIiLCJub25jZSIsImRhdGFUeXBlIiwiZG9uZSIsIm1hcCIsImluZGV4IiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicmVsb2FkIiwiYWRkQXV0b1Jlc2l6ZSIsImJveFNpemluZyIsIm9mZnNldCIsImNsaWVudEhlaWdodCIsImhlaWdodCIsInNjcm9sbEhlaWdodCIsImFqYXhTdG9wIiwiY29tbWVudEFyZWEiLCJhdXRvUmVzaXplVGV4dGFyZWEiLCJmb3JtcyIsImZpcnN0X2hvbGRlciIsImVsZW1lbnRPZmZzZXQiLCJwYWdlT2Zmc2V0IiwicGFnZVlPZmZzZXQiLCJzY3JvbGxUb3AiLCJ0cmFja1Nob3dDb21tZW50cyIsImFsd2F5cyIsImlkIiwiY2xpY2tWYWx1ZSIsImNhdGVnb3J5UHJlZml4IiwiY2F0ZWdvcnlTdWZmaXgiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiaXMiLCJwYXJhbXMiLCJhamF4dXJsIiwic3VjY2VzcyIsInJlc3BvbnNlIiwiaHRtbCIsImN1cnJlbnRTY3JpcHQiLCJwb3N0IiwibGxjYWpheHVybCIsImNvbW1lbnRVcmwiLCJwYXJhbSIsImFkZENvbW1lbnQiLCJjb21tZW50SWQiLCJVUkwiLCJzdWJzdHIiLCJpbmRleE9mIiwidGFyZ2V0cyIsInNldENhbGVuZGFyIiwibGkiLCJjYWxlbmRhcnNWaXNpYmxlIiwiY2FsZW5kYXJWaXNpYmxlIiwic2hvd0NhbGVuZGFyIiwiZGF0ZUhvbGRlciIsImNhbGVuZGFyVHJhbnNpdGlvbmVyIiwiY2FsZW5kYXJDbG9zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxLQUFULENBQWVDLENBQWYsRUFBaUI7QUFBQ0MsRUFBQUEsUUFBUSxDQUFDQyxnQkFBVCxDQUEwQixXQUExQixFQUFzQyxVQUFTQyxDQUFULEVBQVc7QUFBQyxRQUFJQyxDQUFDLEdBQUNELENBQUMsQ0FBQ0UsTUFBUjtBQUFBLFFBQWVDLENBQUMsR0FBQ04sQ0FBQyxDQUFDSSxDQUFELENBQWxCO0FBQXNCRSxJQUFBQSxDQUFDLEtBQUdBLENBQUMsR0FBQyxDQUFDRixDQUFDLEdBQUNBLENBQUMsQ0FBQ0csYUFBTCxLQUFxQlAsQ0FBQyxDQUFDSSxDQUFELENBQTNCLENBQUQsRUFBaUNFLENBQUMsSUFBRVAsS0FBSyxDQUFDUyxJQUFOLENBQVdKLENBQVgsRUFBYUUsQ0FBYixFQUFlLENBQUMsQ0FBaEIsQ0FBcEM7QUFBdUQsR0FBL0g7QUFBaUk7O0FBQUFQLEtBQUssQ0FBQ1MsSUFBTixHQUFXLFVBQVNSLENBQVQsRUFBV0csQ0FBWCxFQUFhQyxDQUFiLEVBQWU7QUFBQyxNQUFJRSxDQUFDLEdBQUMsWUFBTjtBQUFtQkgsRUFBQUEsQ0FBQyxHQUFDQSxDQUFDLElBQUUsRUFBTCxFQUFRLENBQUNILENBQUMsQ0FBQ1MsT0FBRixJQUFXLFVBQVNULENBQVQsRUFBV0csQ0FBWCxFQUFhO0FBQUMsYUFBU08sQ0FBVCxHQUFZO0FBQUNYLE1BQUFBLEtBQUssQ0FBQ1ksSUFBTixDQUFXWCxDQUFYLEVBQWEsQ0FBQyxDQUFkO0FBQWlCOztBQUFBLGFBQVNZLENBQVQsR0FBWTtBQUFDQyxNQUFBQSxDQUFDLEtBQUdBLENBQUMsR0FBQyxVQUFTYixDQUFULEVBQVdHLENBQVgsRUFBYUMsQ0FBYixFQUFlO0FBQUMsaUJBQVNFLENBQVQsR0FBWTtBQUFDSSxVQUFBQSxDQUFDLENBQUNJLFNBQUYsR0FBWSxpQkFBZUQsQ0FBZixHQUFpQkUsQ0FBN0I7QUFBK0IsY0FBSVosQ0FBQyxHQUFDSCxDQUFDLENBQUNnQixTQUFSO0FBQUEsY0FBa0JaLENBQUMsR0FBQ0osQ0FBQyxDQUFDaUIsVUFBdEI7QUFBaUNQLFVBQUFBLENBQUMsQ0FBQ1EsWUFBRixLQUFpQmxCLENBQWpCLEtBQXFCRyxDQUFDLEdBQUNDLENBQUMsR0FBQyxDQUF6QjtBQUE0QixjQUFJRSxDQUFDLEdBQUNOLENBQUMsQ0FBQ21CLFdBQVI7QUFBQSxjQUFvQlAsQ0FBQyxHQUFDWixDQUFDLENBQUNvQixZQUF4QjtBQUFBLGNBQXFDQyxDQUFDLEdBQUNYLENBQUMsQ0FBQ1UsWUFBekM7QUFBQSxjQUFzREUsQ0FBQyxHQUFDWixDQUFDLENBQUNTLFdBQTFEO0FBQUEsY0FBc0VJLENBQUMsR0FBQ25CLENBQUMsR0FBQ0UsQ0FBQyxHQUFDLENBQTVFO0FBQThFSSxVQUFBQSxDQUFDLENBQUNjLEtBQUYsQ0FBUUMsR0FBUixHQUFZLENBQUMsUUFBTVosQ0FBTixHQUFRVixDQUFDLEdBQUNrQixDQUFGLEdBQUksRUFBWixHQUFlLFFBQU1SLENBQU4sR0FBUVYsQ0FBQyxHQUFDUyxDQUFGLEdBQUksRUFBWixHQUFlVCxDQUFDLEdBQUNTLENBQUMsR0FBQyxDQUFKLEdBQU1TLENBQUMsR0FBQyxDQUF2QyxJQUEwQyxJQUF0RCxFQUEyRFgsQ0FBQyxDQUFDYyxLQUFGLENBQVFFLElBQVIsR0FBYSxDQUFDLFFBQU1YLENBQU4sR0FBUVgsQ0FBUixHQUFVLFFBQU1XLENBQU4sR0FBUVgsQ0FBQyxHQUFDRSxDQUFGLEdBQUlnQixDQUFaLEdBQWMsUUFBTVQsQ0FBTixHQUFRVCxDQUFDLEdBQUNFLENBQUYsR0FBSSxFQUFaLEdBQWUsUUFBTU8sQ0FBTixHQUFRVCxDQUFDLEdBQUNrQixDQUFGLEdBQUksRUFBWixHQUFlQyxDQUFDLEdBQUNELENBQUMsR0FBQyxDQUEzRCxJQUE4RCxJQUF0STtBQUEySTs7QUFBQSxZQUFJWixDQUFDLEdBQUNULFFBQVEsQ0FBQzBCLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBTjtBQUFBLFlBQXFDZixDQUFDLEdBQUNSLENBQUMsQ0FBQ3dCLElBQUYsSUFBUTVCLENBQUMsQ0FBQzZCLFlBQUYsQ0FBZSxZQUFmLENBQVIsSUFBc0MsR0FBN0U7QUFBaUZuQixRQUFBQSxDQUFDLENBQUNvQixTQUFGLEdBQVkzQixDQUFaLEVBQWNILENBQUMsQ0FBQytCLFdBQUYsQ0FBY3JCLENBQWQsQ0FBZDtBQUErQixZQUFJRyxDQUFDLEdBQUNELENBQUMsQ0FBQyxDQUFELENBQUQsSUFBTSxFQUFaO0FBQUEsWUFBZUcsQ0FBQyxHQUFDSCxDQUFDLENBQUMsQ0FBRCxDQUFELElBQU0sRUFBdkI7QUFBMEJOLFFBQUFBLENBQUM7QUFBRyxZQUFJZSxDQUFDLEdBQUNYLENBQUMsQ0FBQ3NCLHFCQUFGLEVBQU47QUFBZ0MsZUFBTSxRQUFNbkIsQ0FBTixJQUFTUSxDQUFDLENBQUNJLEdBQUYsR0FBTSxDQUFmLElBQWtCWixDQUFDLEdBQUMsR0FBRixFQUFNUCxDQUFDLEVBQXpCLElBQTZCLFFBQU1PLENBQU4sSUFBU1EsQ0FBQyxDQUFDWSxNQUFGLEdBQVNDLE1BQU0sQ0FBQ0MsV0FBekIsSUFBc0N0QixDQUFDLEdBQUMsR0FBRixFQUFNUCxDQUFDLEVBQTdDLElBQWlELFFBQU1PLENBQU4sSUFBU1EsQ0FBQyxDQUFDSyxJQUFGLEdBQU8sQ0FBaEIsSUFBbUJiLENBQUMsR0FBQyxHQUFGLEVBQU1QLENBQUMsRUFBMUIsSUFBOEIsUUFBTU8sQ0FBTixJQUFTUSxDQUFDLENBQUNlLEtBQUYsR0FBUUYsTUFBTSxDQUFDRyxVQUF4QixLQUFxQ3hCLENBQUMsR0FBQyxHQUFGLEVBQU1QLENBQUMsRUFBNUMsQ0FBNUcsRUFBNEpJLENBQUMsQ0FBQ0ksU0FBRixJQUFhLGdCQUF6SyxFQUEwTEosQ0FBaE07QUFBa00sT0FBbHNCLENBQW1zQlYsQ0FBbnNCLEVBQXFzQnFCLENBQXJzQixFQUF1c0JsQixDQUF2c0IsQ0FBTCxDQUFEO0FBQWl0Qjs7QUFBQSxRQUFJVSxDQUFKLEVBQU1FLENBQU4sRUFBUU0sQ0FBUjtBQUFVLFdBQU9yQixDQUFDLENBQUNFLGdCQUFGLENBQW1CLFdBQW5CLEVBQStCUSxDQUEvQixHQUFrQ1YsQ0FBQyxDQUFDRSxnQkFBRixDQUFtQixZQUFuQixFQUFnQ1EsQ0FBaEMsQ0FBbEMsRUFBcUVWLENBQUMsQ0FBQ1MsT0FBRixHQUFVO0FBQUNELE1BQUFBLElBQUksRUFBQyxnQkFBVTtBQUFDYSxRQUFBQSxDQUFDLEdBQUNyQixDQUFDLENBQUNzQyxLQUFGLElBQVN0QyxDQUFDLENBQUM2QixZQUFGLENBQWV2QixDQUFmLENBQVQsSUFBNEJlLENBQTlCLEVBQWdDckIsQ0FBQyxDQUFDc0MsS0FBRixHQUFRLEVBQXhDLEVBQTJDdEMsQ0FBQyxDQUFDdUMsWUFBRixDQUFlakMsQ0FBZixFQUFpQixFQUFqQixDQUEzQyxFQUFnRWUsQ0FBQyxJQUFFLENBQUNOLENBQUosS0FBUUEsQ0FBQyxHQUFDeUIsVUFBVSxDQUFDNUIsQ0FBRCxFQUFHUixDQUFDLEdBQUMsR0FBRCxHQUFLLENBQVQsQ0FBcEIsQ0FBaEU7QUFBaUcsT0FBbEg7QUFBbUhPLE1BQUFBLElBQUksRUFBQyxjQUFTWCxDQUFULEVBQVc7QUFBQyxZQUFHSSxDQUFDLEtBQUdKLENBQVAsRUFBUztBQUFDZSxVQUFBQSxDQUFDLEdBQUMwQixZQUFZLENBQUMxQixDQUFELENBQWQ7QUFBa0IsY0FBSVosQ0FBQyxHQUFDVSxDQUFDLElBQUVBLENBQUMsQ0FBQzZCLFVBQVg7QUFBc0J2QyxVQUFBQSxDQUFDLElBQUVBLENBQUMsQ0FBQ3dDLFdBQUYsQ0FBYzlCLENBQWQsQ0FBSCxFQUFvQkEsQ0FBQyxHQUFDLEtBQUssQ0FBM0I7QUFBNkI7QUFBQztBQUFwTixLQUF0RjtBQUE0UyxHQUFoa0MsQ0FBaWtDYixDQUFqa0MsRUFBbWtDRyxDQUFua0MsQ0FBWixFQUFtbENLLElBQW5sQyxFQUFSO0FBQWttQyxDQUFocEMsRUFBaXBDVCxLQUFLLENBQUNZLElBQU4sR0FBVyxVQUFTWCxDQUFULEVBQVdHLENBQVgsRUFBYTtBQUFDSCxFQUFBQSxDQUFDLENBQUNTLE9BQUYsSUFBV1QsQ0FBQyxDQUFDUyxPQUFGLENBQVVFLElBQVYsQ0FBZVIsQ0FBZixDQUFYO0FBQTZCLENBQXZzQyxFQUF3c0MsZUFBYSxPQUFPeUMsTUFBcEIsSUFBNEJBLE1BQU0sQ0FBQ0MsT0FBbkMsS0FBNkNELE1BQU0sQ0FBQ0MsT0FBUCxHQUFlOUMsS0FBNUQsQ0FBeHNDOzs7Ozs7Ozs7Ozs7Ozs7QUNBbko7QUFDQTtBQUNBO0FBQ0E7QUFFQSxTQUFTK0MsdUJBQVQsT0FPRztBQUFBLE1BTkRDLE9BTUMsUUFOREEsT0FNQztBQUFBLE1BTERDLFlBS0MsUUFMREEsWUFLQztBQUFBLDJCQUpEQyxRQUlDO0FBQUEsTUFKREEsUUFJQyw4QkFKVSxlQUlWO0FBQUEsTUFIREMsZUFHQyxRQUhEQSxlQUdDO0FBQUEsMkJBRkRDLFFBRUM7QUFBQSxNQUZEQSxRQUVDLDhCQUZVLFFBRVY7QUFBQSwrQkFEREMsWUFDQztBQUFBLE1BRERBLFlBQ0Msa0NBRGMsT0FDZDs7QUFDRCxNQUFJSCxRQUFRLEtBQUssU0FBYixJQUEwQixPQUFPQyxlQUFQLEtBQTJCLFFBQXpELEVBQW1FO0FBQ2pFRyxJQUFBQSxPQUFPLENBQUNDLEtBQVI7QUFLQTtBQUNELEdBUkEsQ0FVRDtBQUNBO0FBQ0E7OztBQUNBLE1BQUlwQixNQUFNLENBQUNxQixVQUFQLENBQWtCLGtDQUFsQixFQUFzREMsT0FBMUQsRUFBbUU7QUFDakVQLElBQUFBLFFBQVEsR0FBRyxXQUFYO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7O0FBQ0UsTUFBTVEsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQXRELENBQUMsRUFBSTtBQUNwQjtBQUNBO0FBQ0EsUUFBSUEsQ0FBQyxDQUFDRSxNQUFGLEtBQWEwQyxPQUFqQixFQUEwQjtBQUN4QlcsTUFBQUEscUJBQXFCO0FBRXJCWCxNQUFBQSxPQUFPLENBQUNZLG1CQUFSLENBQTRCLGVBQTVCLEVBQTZDRixRQUE3QztBQUNEO0FBQ0YsR0FSRDs7QUFVQSxNQUFNQyxxQkFBcUIsR0FBRyxTQUF4QkEscUJBQXdCLEdBQU07QUFDbEMsUUFBR1AsUUFBUSxLQUFLLFNBQWhCLEVBQTJCO0FBQ3pCSixNQUFBQSxPQUFPLENBQUN2QixLQUFSLENBQWNvQyxPQUFkLEdBQXdCLE1BQXhCO0FBQ0QsS0FGRCxNQUVPO0FBQ0xiLE1BQUFBLE9BQU8sQ0FBQ1IsWUFBUixDQUFxQixRQUFyQixFQUErQixJQUEvQjtBQUNEO0FBQ0YsR0FORDs7QUFRQSxNQUFNc0Isc0JBQXNCLEdBQUcsU0FBekJBLHNCQUF5QixHQUFNO0FBQ25DLFFBQUdWLFFBQVEsS0FBSyxTQUFoQixFQUEyQjtBQUN6QkosTUFBQUEsT0FBTyxDQUFDdkIsS0FBUixDQUFjb0MsT0FBZCxHQUF3QlIsWUFBeEI7QUFDRCxLQUZELE1BRU87QUFDTEwsTUFBQUEsT0FBTyxDQUFDZSxlQUFSLENBQXdCLFFBQXhCO0FBQ0Q7QUFDRixHQU5EOztBQVFBLFNBQU87QUFDTDtBQUNKO0FBQ0E7QUFDSUMsSUFBQUEsY0FKSyw0QkFJWTtBQUNmO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDTWhCLE1BQUFBLE9BQU8sQ0FBQ1ksbUJBQVIsQ0FBNEIsZUFBNUIsRUFBNkNGLFFBQTdDO0FBRUE7QUFDTjtBQUNBOztBQUNNLFVBQUksS0FBS08sT0FBVCxFQUFrQjtBQUNoQnZCLFFBQUFBLFlBQVksQ0FBQyxLQUFLdUIsT0FBTixDQUFaO0FBQ0Q7O0FBRURILE1BQUFBLHNCQUFzQjtBQUV0QjtBQUNOO0FBQ0E7QUFDQTs7QUFDTSxVQUFNSSxNQUFNLEdBQUdsQixPQUFPLENBQUMzQixZQUF2QjtBQUVBMkIsTUFBQUEsT0FBTyxDQUFDbUIsU0FBUixDQUFrQkMsR0FBbEIsQ0FBc0JuQixZQUF0QjtBQUNELEtBNUJJOztBQThCTDtBQUNKO0FBQ0E7QUFDSW9CLElBQUFBLGNBakNLLDRCQWlDWTtBQUNmLFVBQUluQixRQUFRLEtBQUssZUFBakIsRUFBa0M7QUFDaENGLFFBQUFBLE9BQU8sQ0FBQzdDLGdCQUFSLENBQXlCLGVBQXpCLEVBQTBDdUQsUUFBMUM7QUFDRCxPQUZELE1BRU8sSUFBSVIsUUFBUSxLQUFLLFNBQWpCLEVBQTRCO0FBQ2pDLGFBQUtlLE9BQUwsR0FBZXhCLFVBQVUsQ0FBQyxZQUFNO0FBQzlCa0IsVUFBQUEscUJBQXFCO0FBQ3RCLFNBRndCLEVBRXRCUixlQUZzQixDQUF6QjtBQUdELE9BSk0sTUFJQTtBQUNMUSxRQUFBQSxxQkFBcUI7QUFDdEIsT0FUYyxDQVdmOzs7QUFDQVgsTUFBQUEsT0FBTyxDQUFDbUIsU0FBUixDQUFrQkcsTUFBbEIsQ0FBeUJyQixZQUF6QjtBQUNELEtBOUNJOztBQWdETDtBQUNKO0FBQ0E7QUFDSXNCLElBQUFBLE1BbkRLLG9CQW1ESTtBQUNQLFVBQUksS0FBS0MsUUFBTCxFQUFKLEVBQXFCO0FBQ25CLGFBQUtSLGNBQUw7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLSyxjQUFMO0FBQ0Q7QUFDRixLQXpESTs7QUEyREw7QUFDSjtBQUNBO0FBQ0lHLElBQUFBLFFBOURLLHNCQThETTtBQUNUO0FBQ047QUFDQTtBQUNBO0FBQ00sVUFBTUMsa0JBQWtCLEdBQUd6QixPQUFPLENBQUNsQixZQUFSLENBQXFCLFFBQXJCLE1BQW1DLElBQTlEO0FBRUEsVUFBTTRDLGFBQWEsR0FBRzFCLE9BQU8sQ0FBQ3ZCLEtBQVIsQ0FBY29DLE9BQWQsS0FBMEIsTUFBaEQ7O0FBRUEsVUFBTWMsZUFBZSxHQUFHLG1CQUFJM0IsT0FBTyxDQUFDbUIsU0FBWixFQUF1QlMsUUFBdkIsQ0FBZ0MzQixZQUFoQyxDQUF4Qjs7QUFFQSxhQUFPd0Isa0JBQWtCLElBQUlDLGFBQXRCLElBQXVDLENBQUNDLGVBQS9DO0FBQ0QsS0ExRUk7QUE0RUw7QUFDQVYsSUFBQUEsT0FBTyxFQUFFO0FBN0VKLEdBQVA7QUErRUQ7OztBQzFJRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNWSxtQkFBbUIsR0FBRyxTQUF0QkEsbUJBQXNCLEdBUWxCO0FBQUEsaUZBQUosRUFBSTtBQUFBLDJCQVBOQyxRQU9NO0FBQUEsTUFQSUEsUUFPSiw4QkFQZSxlQU9mO0FBQUEsOEJBTk5DLFdBTU07QUFBQSxNQU5PQSxXQU1QLGlDQU5xQixtQkFNckI7QUFBQSxrQ0FMTkMsZUFLTTtBQUFBLE1BTFdBLGVBS1gscUNBTDZCLHVCQUs3QjtBQUFBLCtCQUpOQyxZQUlNO0FBQUEsTUFKUUEsWUFJUixrQ0FKdUIsb0JBSXZCO0FBQUEsbUNBSE5DLGtCQUdNO0FBQUEsTUFIY0Esa0JBR2Qsc0NBSG1DLHlCQUduQztBQUFBLG1DQUZOQyxtQkFFTTtBQUFBLE1BRmVBLG1CQUVmLHNDQUZxQywwQkFFckM7QUFBQSw2QkFETkMsVUFDTTtBQUFBLE1BRE1BLFVBQ04sZ0NBRG1CLEVBQ25COztBQUVSLE1BQU1DLFdBQVcsR0FBRyxPQUFPUCxRQUFQLEtBQW9CLFFBQXBCLEdBQStCNUUsUUFBUSxDQUFDb0YsYUFBVCxDQUF1QlIsUUFBdkIsQ0FBL0IsR0FBa0VBLFFBQXRGOztBQUVBLE1BQU1TLGtCQUFrQixHQUFHLFNBQXJCQSxrQkFBcUIsR0FBTTtBQUMvQixXQUFPQyxNQUFNLENBQUNDLFNBQVAsQ0FBaUJMLFVBQWpCLEtBQWdDQSxVQUFVLEtBQUssU0FBdEQ7QUFDRCxHQUZEOztBQUlBLE1BQUlDLFdBQVcsS0FBS0ssU0FBaEIsSUFBNkJMLFdBQVcsS0FBSyxJQUE3QyxJQUFxRCxDQUFDRSxrQkFBa0IsRUFBNUUsRUFBZ0Y7QUFDOUUsVUFBTSxJQUFJSSxLQUFKLENBQVUsK0NBQVYsQ0FBTjtBQUNEOztBQUVELE1BQU1DLGNBQWMsR0FBR1AsV0FBVyxDQUFDQyxhQUFaLENBQTBCUCxXQUExQixDQUF2QjtBQUNBLE1BQU1jLGtCQUFrQixHQUFHUixXQUFXLENBQUNDLGFBQVosQ0FBMEJOLGVBQTFCLENBQTNCO0FBQ0EsTUFBTWMsdUJBQXVCLEdBQUdELGtCQUFrQixDQUFDRSxnQkFBbkIsQ0FBb0NkLFlBQXBDLENBQWhDO0FBQ0EsTUFBTWUsZUFBZSxHQUFHWCxXQUFXLENBQUNDLGFBQVosQ0FBMEJKLGtCQUExQixDQUF4QjtBQUNBLE1BQU1lLGdCQUFnQixHQUFHWixXQUFXLENBQUNDLGFBQVosQ0FBMEJILG1CQUExQixDQUF6QjtBQUVBLE1BQUllLFNBQVMsR0FBRyxLQUFoQjtBQUNBLE1BQUlDLG1CQUFtQixHQUFHLENBQTFCO0FBQ0EsTUFBSUMsb0JBQW9CLEdBQUcsQ0FBM0I7QUFDQSxNQUFJQyxrQkFBa0IsR0FBRyxFQUF6QjtBQUNBLE1BQUlDLGNBQWMsR0FBRyxFQUFyQjtBQUNBLE1BQUlyQyxPQUFKLENBdkJRLENBMEJSOztBQUNBLE1BQU1zQyxXQUFXLEdBQUcsU0FBZEEsV0FBYyxHQUFXO0FBQzdCRCxJQUFBQSxjQUFjLEdBQUdFLFdBQVcsRUFBNUI7QUFDQUMsSUFBQUEsYUFBYSxDQUFDSCxjQUFELENBQWI7QUFDQUksSUFBQUEsbUJBQW1CO0FBQ3BCLEdBSkQsQ0EzQlEsQ0FrQ1I7OztBQUNBLE1BQU1DLGtCQUFrQixHQUFHLFNBQXJCQSxrQkFBcUIsR0FBVztBQUNwQyxRQUFJMUMsT0FBSixFQUFhOUIsTUFBTSxDQUFDeUUsb0JBQVAsQ0FBNEIzQyxPQUE1QjtBQUViQSxJQUFBQSxPQUFPLEdBQUc5QixNQUFNLENBQUMwRSxxQkFBUCxDQUE2QixZQUFNO0FBQzNDTixNQUFBQSxXQUFXO0FBQ1osS0FGUyxDQUFWO0FBR0QsR0FORCxDQW5DUSxDQTRDUjs7O0FBQ0EsTUFBTUMsV0FBVyxHQUFHLFNBQWRBLFdBQWMsR0FBVztBQUM3QixRQUFJTSxXQUFXLEdBQUdsQixjQUFjLENBQUNrQixXQUFqQztBQUNBLFFBQUlDLGNBQWMsR0FBR25CLGNBQWMsQ0FBQ29CLFdBQXBDO0FBQ0EsUUFBSUMsVUFBVSxHQUFHckIsY0FBYyxDQUFDcUIsVUFBaEM7QUFFQWQsSUFBQUEsbUJBQW1CLEdBQUdjLFVBQXRCO0FBQ0FiLElBQUFBLG9CQUFvQixHQUFHVSxXQUFXLElBQUlDLGNBQWMsR0FBR0UsVUFBckIsQ0FBbEMsQ0FONkIsQ0FRN0I7O0FBQ0EsUUFBSUMsbUJBQW1CLEdBQUdmLG1CQUFtQixHQUFHLENBQWhEO0FBQ0EsUUFBSWdCLG9CQUFvQixHQUFHZixvQkFBb0IsR0FBRyxDQUFsRCxDQVY2QixDQVk3Qjs7QUFFQSxRQUFJYyxtQkFBbUIsSUFBSUMsb0JBQTNCLEVBQWlEO0FBQy9DLGFBQU8sTUFBUDtBQUNELEtBRkQsTUFHSyxJQUFJRCxtQkFBSixFQUF5QjtBQUM1QixhQUFPLE1BQVA7QUFDRCxLQUZJLE1BR0EsSUFBSUMsb0JBQUosRUFBMEI7QUFDN0IsYUFBTyxPQUFQO0FBQ0QsS0FGSSxNQUdBO0FBQ0gsYUFBTyxNQUFQO0FBQ0Q7QUFFRixHQTNCRCxDQTdDUSxDQTJFUjs7O0FBQ0EsTUFBTVQsbUJBQW1CLEdBQUcsU0FBdEJBLG1CQUFzQixHQUFXO0FBQ3JDLFFBQUl0QixVQUFVLEtBQUssU0FBbkIsRUFBOEI7QUFDNUIsVUFBSWdDLHVCQUF1QixHQUFHeEIsY0FBYyxDQUFDa0IsV0FBZixJQUE4Qk8sUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQ3pCLGtCQUFELENBQWhCLENBQXFDMEIsZ0JBQXJDLENBQXNELGNBQXRELENBQUQsQ0FBUixHQUFrRkYsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQ3pCLGtCQUFELENBQWhCLENBQXFDMEIsZ0JBQXJDLENBQXNELGVBQXRELENBQUQsQ0FBeEgsQ0FBOUI7QUFFQSxVQUFJQyxpQkFBaUIsR0FBR0MsSUFBSSxDQUFDQyxLQUFMLENBQVdOLHVCQUF1QixHQUFHdEIsdUJBQXVCLENBQUM2QixNQUE3RCxDQUF4QjtBQUVBdkMsTUFBQUEsVUFBVSxHQUFHb0MsaUJBQWI7QUFDRDtBQUNGLEdBUkQsQ0E1RVEsQ0F1RlI7OztBQUNBLE1BQU1JLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQVNDLFNBQVQsRUFBb0I7QUFFdkMsUUFBSTNCLFNBQVMsS0FBSyxJQUFkLElBQXVCSSxjQUFjLEtBQUt1QixTQUFuQixJQUFnQ3ZCLGNBQWMsS0FBSyxNQUE5RSxFQUF1RjtBQUV2RixRQUFJd0IsY0FBYyxHQUFHMUMsVUFBckI7QUFDQSxRQUFJMkMsZUFBZSxHQUFHRixTQUFTLEtBQUssTUFBZCxHQUF1QjFCLG1CQUF2QixHQUE2Q0Msb0JBQW5FLENBTHVDLENBT3ZDOztBQUNBLFFBQUkyQixlQUFlLEdBQUkzQyxVQUFVLEdBQUcsSUFBcEMsRUFBMkM7QUFDekMwQyxNQUFBQSxjQUFjLEdBQUdDLGVBQWpCO0FBQ0Q7O0FBRUQsUUFBSUYsU0FBUyxLQUFLLE9BQWxCLEVBQTJCO0FBQ3pCQyxNQUFBQSxjQUFjLElBQUksQ0FBQyxDQUFuQjs7QUFFQSxVQUFJQyxlQUFlLEdBQUczQyxVQUF0QixFQUFrQztBQUNoQ1MsUUFBQUEsa0JBQWtCLENBQUMxQixTQUFuQixDQUE2QkMsR0FBN0IsQ0FBaUMsZ0JBQWpDO0FBQ0Q7QUFDRjs7QUFFRHlCLElBQUFBLGtCQUFrQixDQUFDMUIsU0FBbkIsQ0FBNkJHLE1BQTdCLENBQW9DLGVBQXBDO0FBQ0F1QixJQUFBQSxrQkFBa0IsQ0FBQ3BFLEtBQW5CLENBQXlCdUcsU0FBekIsR0FBcUMsZ0JBQWdCRixjQUFoQixHQUFpQyxLQUF0RTtBQUVBekIsSUFBQUEsa0JBQWtCLEdBQUd3QixTQUFyQjtBQUNBM0IsSUFBQUEsU0FBUyxHQUFHLElBQVo7QUFDRCxHQXpCRCxDQXhGUSxDQW9IUjs7O0FBQ0EsTUFBTStCLG1CQUFtQixHQUFHLFNBQXRCQSxtQkFBc0IsR0FBVztBQUNyQyxRQUFJeEcsS0FBSyxHQUFHVSxNQUFNLENBQUNtRixnQkFBUCxDQUF3QnpCLGtCQUF4QixFQUE0QyxJQUE1QyxDQUFaO0FBQ0EsUUFBSW1DLFNBQVMsR0FBR3ZHLEtBQUssQ0FBQzhGLGdCQUFOLENBQXVCLFdBQXZCLENBQWhCO0FBQ0EsUUFBSVcsY0FBYyxHQUFHVCxJQUFJLENBQUNVLEdBQUwsQ0FBU2QsUUFBUSxDQUFDVyxTQUFTLENBQUNJLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBRCxDQUFSLElBQXFDLENBQTlDLENBQXJCOztBQUVBLFFBQUkvQixrQkFBa0IsS0FBSyxNQUEzQixFQUFtQztBQUNqQzZCLE1BQUFBLGNBQWMsSUFBSSxDQUFDLENBQW5CO0FBQ0Q7O0FBRURyQyxJQUFBQSxrQkFBa0IsQ0FBQzFCLFNBQW5CLENBQTZCQyxHQUE3QixDQUFpQyxlQUFqQztBQUNBeUIsSUFBQUEsa0JBQWtCLENBQUNwRSxLQUFuQixDQUF5QnVHLFNBQXpCLEdBQXFDLEVBQXJDO0FBQ0FwQyxJQUFBQSxjQUFjLENBQUNxQixVQUFmLEdBQTRCckIsY0FBYyxDQUFDcUIsVUFBZixHQUE0QmlCLGNBQXhEO0FBQ0FyQyxJQUFBQSxrQkFBa0IsQ0FBQzFCLFNBQW5CLENBQTZCRyxNQUE3QixDQUFvQyxlQUFwQyxFQUFxRCxnQkFBckQ7QUFFQTRCLElBQUFBLFNBQVMsR0FBRyxLQUFaO0FBQ0QsR0FmRCxDQXJIUSxDQXVJUjs7O0FBQ0EsTUFBTU8sYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixDQUFTNEIsUUFBVCxFQUFtQjtBQUN2QyxRQUFJQSxRQUFRLEtBQUssTUFBYixJQUF1QkEsUUFBUSxLQUFLLE1BQXhDLEVBQWdEO0FBQzlDckMsTUFBQUEsZUFBZSxDQUFDN0IsU0FBaEIsQ0FBMEJDLEdBQTFCLENBQThCLFFBQTlCO0FBQ0QsS0FGRCxNQUdLO0FBQ0g0QixNQUFBQSxlQUFlLENBQUM3QixTQUFoQixDQUEwQkcsTUFBMUIsQ0FBaUMsUUFBakM7QUFDRDs7QUFFRCxRQUFJK0QsUUFBUSxLQUFLLE1BQWIsSUFBdUJBLFFBQVEsS0FBSyxPQUF4QyxFQUFpRDtBQUMvQ3BDLE1BQUFBLGdCQUFnQixDQUFDOUIsU0FBakIsQ0FBMkJDLEdBQTNCLENBQStCLFFBQS9CO0FBQ0QsS0FGRCxNQUdLO0FBQ0g2QixNQUFBQSxnQkFBZ0IsQ0FBQzlCLFNBQWpCLENBQTJCRyxNQUEzQixDQUFrQyxRQUFsQztBQUNEO0FBQ0YsR0FkRDs7QUFpQkEsTUFBTWdFLElBQUksR0FBRyxTQUFQQSxJQUFPLEdBQVc7QUFFdEIvQixJQUFBQSxXQUFXO0FBRVhwRSxJQUFBQSxNQUFNLENBQUNoQyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxZQUFNO0FBQ3RDd0csTUFBQUEsa0JBQWtCO0FBQ25CLEtBRkQ7QUFJQWYsSUFBQUEsY0FBYyxDQUFDekYsZ0JBQWYsQ0FBZ0MsUUFBaEMsRUFBMEMsWUFBTTtBQUM5Q3dHLE1BQUFBLGtCQUFrQjtBQUNuQixLQUZEO0FBSUFkLElBQUFBLGtCQUFrQixDQUFDMUYsZ0JBQW5CLENBQW9DLGVBQXBDLEVBQXFELFlBQU07QUFDekQ4SCxNQUFBQSxtQkFBbUI7QUFDcEIsS0FGRDtBQUlBakMsSUFBQUEsZUFBZSxDQUFDN0YsZ0JBQWhCLENBQWlDLE9BQWpDLEVBQTBDLFlBQU07QUFDOUN5SCxNQUFBQSxZQUFZLENBQUMsTUFBRCxDQUFaO0FBQ0QsS0FGRDtBQUlBM0IsSUFBQUEsZ0JBQWdCLENBQUM5RixnQkFBakIsQ0FBa0MsT0FBbEMsRUFBMkMsWUFBTTtBQUMvQ3lILE1BQUFBLFlBQVksQ0FBQyxPQUFELENBQVo7QUFDRCxLQUZEO0FBSUQsR0F4QkQsQ0F6SlEsQ0FvTFI7OztBQUNBVSxFQUFBQSxJQUFJLEdBckxJLENBd0xSOztBQUNBLFNBQU87QUFDTEEsSUFBQUEsSUFBSSxFQUFKQTtBQURLLEdBQVA7QUFJRCxDQXJNRCxDLENBdU1BOzs7QUNwTkEsQ0FBQyxZQUFVO0FBQUMsV0FBU3hILENBQVQsQ0FBV1YsQ0FBWCxFQUFhRyxDQUFiLEVBQWVOLENBQWYsRUFBaUI7QUFBQyxhQUFTVSxDQUFULENBQVdOLENBQVgsRUFBYWtCLENBQWIsRUFBZTtBQUFDLFVBQUcsQ0FBQ2hCLENBQUMsQ0FBQ0YsQ0FBRCxDQUFMLEVBQVM7QUFBQyxZQUFHLENBQUNELENBQUMsQ0FBQ0MsQ0FBRCxDQUFMLEVBQVM7QUFBQyxjQUFJa0ksQ0FBQyxHQUFDLGNBQVksT0FBT0MsT0FBbkIsSUFBNEJBLE9BQWxDO0FBQTBDLGNBQUcsQ0FBQ2pILENBQUQsSUFBSWdILENBQVAsRUFBUyxPQUFPQSxDQUFDLENBQUNsSSxDQUFELEVBQUcsQ0FBQyxDQUFKLENBQVI7QUFBZSxjQUFHb0ksQ0FBSCxFQUFLLE9BQU9BLENBQUMsQ0FBQ3BJLENBQUQsRUFBRyxDQUFDLENBQUosQ0FBUjtBQUFlLGNBQUltQixDQUFDLEdBQUMsSUFBSW1FLEtBQUosQ0FBVSx5QkFBdUJ0RixDQUF2QixHQUF5QixHQUFuQyxDQUFOO0FBQThDLGdCQUFNbUIsQ0FBQyxDQUFDa0gsSUFBRixHQUFPLGtCQUFQLEVBQTBCbEgsQ0FBaEM7QUFBa0M7O0FBQUEsWUFBSW1ILENBQUMsR0FBQ3BJLENBQUMsQ0FBQ0YsQ0FBRCxDQUFELEdBQUs7QUFBQ3lDLFVBQUFBLE9BQU8sRUFBQztBQUFULFNBQVg7QUFBd0IxQyxRQUFBQSxDQUFDLENBQUNDLENBQUQsQ0FBRCxDQUFLLENBQUwsRUFBUXVJLElBQVIsQ0FBYUQsQ0FBQyxDQUFDN0YsT0FBZixFQUF1QixVQUFTaEMsQ0FBVCxFQUFXO0FBQUMsY0FBSVAsQ0FBQyxHQUFDSCxDQUFDLENBQUNDLENBQUQsQ0FBRCxDQUFLLENBQUwsRUFBUVMsQ0FBUixDQUFOO0FBQWlCLGlCQUFPSCxDQUFDLENBQUNKLENBQUMsSUFBRU8sQ0FBSixDQUFSO0FBQWUsU0FBbkUsRUFBb0U2SCxDQUFwRSxFQUFzRUEsQ0FBQyxDQUFDN0YsT0FBeEUsRUFBZ0ZoQyxDQUFoRixFQUFrRlYsQ0FBbEYsRUFBb0ZHLENBQXBGLEVBQXNGTixDQUF0RjtBQUF5Rjs7QUFBQSxhQUFPTSxDQUFDLENBQUNGLENBQUQsQ0FBRCxDQUFLeUMsT0FBWjtBQUFvQjs7QUFBQSxTQUFJLElBQUkyRixDQUFDLEdBQUMsY0FBWSxPQUFPRCxPQUFuQixJQUE0QkEsT0FBbEMsRUFBMENuSSxDQUFDLEdBQUMsQ0FBaEQsRUFBa0RBLENBQUMsR0FBQ0osQ0FBQyxDQUFDMEgsTUFBdEQsRUFBNkR0SCxDQUFDLEVBQTlEO0FBQWlFTSxNQUFBQSxDQUFDLENBQUNWLENBQUMsQ0FBQ0ksQ0FBRCxDQUFGLENBQUQ7QUFBakU7O0FBQXlFLFdBQU9NLENBQVA7QUFBUzs7QUFBQSxTQUFPRyxDQUFQO0FBQVMsQ0FBeGMsSUFBNGM7QUFBQyxLQUFFLENBQUMsVUFBUzBILE9BQVQsRUFBaUIzRixNQUFqQixFQUF3QkMsT0FBeEIsRUFBZ0M7QUFBQzs7QUFBYSxRQUFJK0YsVUFBVSxHQUFDTCxPQUFPLENBQUMsa0JBQUQsQ0FBdEI7O0FBQTJDLFFBQUlNLFdBQVcsR0FBQ0Msc0JBQXNCLENBQUNGLFVBQUQsQ0FBdEM7O0FBQW1ELGFBQVNFLHNCQUFULENBQWdDQyxHQUFoQyxFQUFvQztBQUFDLGFBQU9BLEdBQUcsSUFBRUEsR0FBRyxDQUFDQyxVQUFULEdBQW9CRCxHQUFwQixHQUF3QjtBQUFDRSxRQUFBQSxPQUFPLEVBQUNGO0FBQVQsT0FBL0I7QUFBNkM7O0FBQUE3RyxJQUFBQSxNQUFNLENBQUNnSCxTQUFQLEdBQWlCTCxXQUFXLENBQUNJLE9BQTdCO0FBQXFDL0csSUFBQUEsTUFBTSxDQUFDZ0gsU0FBUCxDQUFpQkMsa0JBQWpCLEdBQW9DUCxVQUFVLENBQUNPLGtCQUEvQztBQUFrRWpILElBQUFBLE1BQU0sQ0FBQ2dILFNBQVAsQ0FBaUJFLG9CQUFqQixHQUFzQ1IsVUFBVSxDQUFDUSxvQkFBakQ7QUFBc0VsSCxJQUFBQSxNQUFNLENBQUNnSCxTQUFQLENBQWlCRywwQkFBakIsR0FBNENULFVBQVUsQ0FBQ1MsMEJBQXZEO0FBQWtGLEdBQTlkLEVBQStkO0FBQUMsd0JBQW1CO0FBQXBCLEdBQS9kLENBQUg7QUFBMGYsS0FBRSxDQUFDLFVBQVNkLE9BQVQsRUFBaUIzRixNQUFqQixFQUF3QkMsT0FBeEIsRUFBZ0M7QUFBQzs7QUFBYXlHLElBQUFBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQjFHLE9BQXRCLEVBQThCLFlBQTlCLEVBQTJDO0FBQUMyRyxNQUFBQSxLQUFLLEVBQUM7QUFBUCxLQUEzQztBQUF5RDNHLElBQUFBLE9BQU8sQ0FBQzRHLEtBQVIsR0FBY0EsS0FBZDtBQUFvQjVHLElBQUFBLE9BQU8sQ0FBQzZHLFFBQVIsR0FBaUJBLFFBQWpCO0FBQTBCN0csSUFBQUEsT0FBTyxDQUFDOEcsV0FBUixHQUFvQkEsV0FBcEI7QUFBZ0M5RyxJQUFBQSxPQUFPLENBQUMrRyxZQUFSLEdBQXFCQSxZQUFyQjtBQUFrQy9HLElBQUFBLE9BQU8sQ0FBQ2dILE9BQVIsR0FBZ0JBLE9BQWhCO0FBQXdCaEgsSUFBQUEsT0FBTyxDQUFDaUgsUUFBUixHQUFpQkEsUUFBakI7O0FBQTBCLGFBQVNMLEtBQVQsQ0FBZVYsR0FBZixFQUFtQjtBQUFDLFVBQUlnQixJQUFJLEdBQUMsRUFBVDs7QUFBWSxXQUFJLElBQUlDLElBQVIsSUFBZ0JqQixHQUFoQixFQUFvQjtBQUFDLFlBQUdBLEdBQUcsQ0FBQ2tCLGNBQUosQ0FBbUJELElBQW5CLENBQUgsRUFBNEJELElBQUksQ0FBQ0MsSUFBRCxDQUFKLEdBQVdqQixHQUFHLENBQUNpQixJQUFELENBQWQ7QUFBcUI7O0FBQUEsYUFBT0QsSUFBUDtBQUFZOztBQUFBLGFBQVNMLFFBQVQsQ0FBa0JYLEdBQWxCLEVBQXNCbUIsYUFBdEIsRUFBb0M7QUFBQ25CLE1BQUFBLEdBQUcsR0FBQ1UsS0FBSyxDQUFDVixHQUFHLElBQUUsRUFBTixDQUFUOztBQUFtQixXQUFJLElBQUlvQixDQUFSLElBQWFELGFBQWIsRUFBMkI7QUFBQyxZQUFHbkIsR0FBRyxDQUFDb0IsQ0FBRCxDQUFILEtBQVMxRSxTQUFaLEVBQXNCc0QsR0FBRyxDQUFDb0IsQ0FBRCxDQUFILEdBQU9ELGFBQWEsQ0FBQ0MsQ0FBRCxDQUFwQjtBQUF3Qjs7QUFBQSxhQUFPcEIsR0FBUDtBQUFXOztBQUFBLGFBQVNZLFdBQVQsQ0FBcUJTLE9BQXJCLEVBQTZCQyxZQUE3QixFQUEwQztBQUFDLFVBQUlDLE9BQU8sR0FBQ0YsT0FBTyxDQUFDRyxXQUFwQjs7QUFBZ0MsVUFBR0QsT0FBSCxFQUFXO0FBQUMsWUFBSUUsT0FBTyxHQUFDSixPQUFPLENBQUMxSCxVQUFwQjs7QUFBK0I4SCxRQUFBQSxPQUFPLENBQUNaLFlBQVIsQ0FBcUJTLFlBQXJCLEVBQWtDQyxPQUFsQztBQUEyQyxPQUF0RixNQUEwRjtBQUFDRyxRQUFBQSxNQUFNLENBQUMxSSxXQUFQLENBQW1Cc0ksWUFBbkI7QUFBaUM7QUFBQzs7QUFBQSxhQUFTVCxZQUFULENBQXNCUSxPQUF0QixFQUE4QkMsWUFBOUIsRUFBMkM7QUFBQyxVQUFJSSxNQUFNLEdBQUNMLE9BQU8sQ0FBQzFILFVBQW5CO0FBQThCK0gsTUFBQUEsTUFBTSxDQUFDYixZQUFQLENBQW9CUyxZQUFwQixFQUFpQ0QsT0FBakM7QUFBMEM7O0FBQUEsYUFBU1AsT0FBVCxDQUFpQmEsS0FBakIsRUFBdUJDLEVBQXZCLEVBQTBCO0FBQUMsVUFBRyxDQUFDRCxLQUFKLEVBQVU7O0FBQU8sVUFBR0EsS0FBSyxDQUFDYixPQUFULEVBQWlCO0FBQUNhLFFBQUFBLEtBQUssQ0FBQ2IsT0FBTixDQUFjYyxFQUFkO0FBQWtCLE9BQXBDLE1BQXdDO0FBQUMsYUFBSSxJQUFJdkssQ0FBQyxHQUFDLENBQVYsRUFBWUEsQ0FBQyxHQUFDc0ssS0FBSyxDQUFDaEQsTUFBcEIsRUFBMkJ0SCxDQUFDLEVBQTVCLEVBQStCO0FBQUN1SyxVQUFBQSxFQUFFLENBQUNELEtBQUssQ0FBQ3RLLENBQUQsQ0FBTixFQUFVQSxDQUFWLEVBQVlzSyxLQUFaLENBQUY7QUFBcUI7QUFBQztBQUFDOztBQUFBLGFBQVNaLFFBQVQsQ0FBa0JjLEVBQWxCLEVBQXFCRCxFQUFyQixFQUF3QjtBQUFDLFVBQUkzRyxPQUFPLEdBQUMsS0FBSyxDQUFqQjs7QUFBbUIsVUFBSTZHLFdBQVcsR0FBQyxTQUFTQSxXQUFULEdBQXNCO0FBQUNwSSxRQUFBQSxZQUFZLENBQUN1QixPQUFELENBQVo7QUFBc0JBLFFBQUFBLE9BQU8sR0FBQ3hCLFVBQVUsQ0FBQ21JLEVBQUQsRUFBSUMsRUFBSixDQUFsQjtBQUEwQixPQUF2Rjs7QUFBd0YsYUFBT0MsV0FBUDtBQUFtQjtBQUFDLEdBQXptQyxFQUEwbUMsRUFBMW1DLENBQTVmO0FBQTBtRCxLQUFFLENBQUMsVUFBU3RDLE9BQVQsRUFBaUIzRixNQUFqQixFQUF3QkMsT0FBeEIsRUFBZ0M7QUFBQzs7QUFBYXlHLElBQUFBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQjFHLE9BQXRCLEVBQThCLFlBQTlCLEVBQTJDO0FBQUMyRyxNQUFBQSxLQUFLLEVBQUM7QUFBUCxLQUEzQztBQUF5RDNHLElBQUFBLE9BQU8sQ0FBQ3NHLGtCQUFSLEdBQTJCQSxrQkFBM0I7QUFBOEN0RyxJQUFBQSxPQUFPLENBQUN1RyxvQkFBUixHQUE2QkEsb0JBQTdCO0FBQWtEdkcsSUFBQUEsT0FBTyxDQUFDd0csMEJBQVIsR0FBbUNBLDBCQUFuQztBQUE4RHhHLElBQUFBLE9BQU8sQ0FBQ29HLE9BQVIsR0FBZ0I2QixTQUFoQjs7QUFBMEIsUUFBSUMsS0FBSyxHQUFDeEMsT0FBTyxDQUFDLFFBQUQsQ0FBakI7O0FBQTRCLGFBQVNZLGtCQUFULENBQTRCNkIsS0FBNUIsRUFBa0NDLFlBQWxDLEVBQStDO0FBQUNELE1BQUFBLEtBQUssQ0FBQzlLLGdCQUFOLENBQXVCLFNBQXZCLEVBQWlDLFlBQVU7QUFBQzhLLFFBQUFBLEtBQUssQ0FBQzlHLFNBQU4sQ0FBZ0JDLEdBQWhCLENBQW9COEcsWUFBcEI7QUFBa0MsT0FBOUU7QUFBZ0ZELE1BQUFBLEtBQUssQ0FBQzlLLGdCQUFOLENBQXVCLE9BQXZCLEVBQStCLFlBQVU7QUFBQyxZQUFHOEssS0FBSyxDQUFDRSxRQUFOLENBQWVDLEtBQWxCLEVBQXdCO0FBQUNILFVBQUFBLEtBQUssQ0FBQzlHLFNBQU4sQ0FBZ0JHLE1BQWhCLENBQXVCNEcsWUFBdkI7QUFBcUM7QUFBQyxPQUF6RztBQUEyRzs7QUFBQSxRQUFJRyxVQUFVLEdBQUMsQ0FBQyxVQUFELEVBQVksaUJBQVosRUFBOEIsZUFBOUIsRUFBOEMsZ0JBQTlDLEVBQStELGNBQS9ELEVBQThFLFNBQTlFLEVBQXdGLFVBQXhGLEVBQW1HLGNBQW5HLEVBQWtILGNBQWxILEVBQWlJLGFBQWpJLENBQWY7O0FBQStKLGFBQVNDLGdCQUFULENBQTBCTCxLQUExQixFQUFnQ00sY0FBaEMsRUFBK0M7QUFBQ0EsTUFBQUEsY0FBYyxHQUFDQSxjQUFjLElBQUUsRUFBL0I7QUFBa0MsVUFBSUMsZUFBZSxHQUFDLENBQUNQLEtBQUssQ0FBQ1EsSUFBTixHQUFXLFVBQVosRUFBd0JDLE1BQXhCLENBQStCTCxVQUEvQixDQUFwQjtBQUErRCxVQUFJRixRQUFRLEdBQUNGLEtBQUssQ0FBQ0UsUUFBbkI7O0FBQTRCLFdBQUksSUFBSTlLLENBQUMsR0FBQyxDQUFWLEVBQVlBLENBQUMsR0FBQ21MLGVBQWUsQ0FBQzdELE1BQTlCLEVBQXFDdEgsQ0FBQyxFQUF0QyxFQUF5QztBQUFDLFlBQUlzTCxJQUFJLEdBQUNILGVBQWUsQ0FBQ25MLENBQUQsQ0FBeEI7O0FBQTRCLFlBQUc4SyxRQUFRLENBQUNRLElBQUQsQ0FBWCxFQUFrQjtBQUFDLGlCQUFPVixLQUFLLENBQUNuSixZQUFOLENBQW1CLFVBQVE2SixJQUEzQixLQUFrQ0osY0FBYyxDQUFDSSxJQUFELENBQXZEO0FBQThEO0FBQUM7QUFBQzs7QUFBQSxhQUFTdEMsb0JBQVQsQ0FBOEI0QixLQUE5QixFQUFvQ00sY0FBcEMsRUFBbUQ7QUFBQyxlQUFTSyxhQUFULEdBQXdCO0FBQUMsWUFBSUMsT0FBTyxHQUFDWixLQUFLLENBQUNFLFFBQU4sQ0FBZUMsS0FBZixHQUFxQixJQUFyQixHQUEwQkUsZ0JBQWdCLENBQUNMLEtBQUQsRUFBT00sY0FBUCxDQUF0RDtBQUE2RU4sUUFBQUEsS0FBSyxDQUFDYSxpQkFBTixDQUF3QkQsT0FBTyxJQUFFLEVBQWpDO0FBQXFDOztBQUFBWixNQUFBQSxLQUFLLENBQUM5SyxnQkFBTixDQUF1QixPQUF2QixFQUErQnlMLGFBQS9CO0FBQThDWCxNQUFBQSxLQUFLLENBQUM5SyxnQkFBTixDQUF1QixTQUF2QixFQUFpQ3lMLGFBQWpDO0FBQWdEOztBQUFBLGFBQVN0QywwQkFBVCxDQUFvQzJCLEtBQXBDLEVBQTBDYyxPQUExQyxFQUFrRDtBQUFDLFVBQUlDLG9CQUFvQixHQUFDRCxPQUFPLENBQUNDLG9CQUFqQztBQUFBLFVBQXNEQywwQkFBMEIsR0FBQ0YsT0FBTyxDQUFDRSwwQkFBekY7QUFBQSxVQUFvSEMsY0FBYyxHQUFDSCxPQUFPLENBQUNHLGNBQTNJOztBQUEwSixlQUFTTixhQUFULENBQXVCRyxPQUF2QixFQUErQjtBQUFDLFlBQUlJLFdBQVcsR0FBQ0osT0FBTyxDQUFDSSxXQUF4QjtBQUFvQyxZQUFJeEosVUFBVSxHQUFDc0ksS0FBSyxDQUFDdEksVUFBckI7QUFBZ0MsWUFBSXlKLFNBQVMsR0FBQ3pKLFVBQVUsQ0FBQzJDLGFBQVgsQ0FBeUIsTUFBSTBHLG9CQUE3QixLQUFvRDlMLFFBQVEsQ0FBQzBCLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBbEU7O0FBQWdHLFlBQUcsQ0FBQ3FKLEtBQUssQ0FBQ0UsUUFBTixDQUFlQyxLQUFoQixJQUF1QkgsS0FBSyxDQUFDb0IsaUJBQWhDLEVBQWtEO0FBQUNELFVBQUFBLFNBQVMsQ0FBQ3JMLFNBQVYsR0FBb0JpTCxvQkFBcEI7QUFBeUNJLFVBQUFBLFNBQVMsQ0FBQ0UsV0FBVixHQUFzQnJCLEtBQUssQ0FBQ29CLGlCQUE1Qjs7QUFBOEMsY0FBR0YsV0FBSCxFQUFlO0FBQUNELFlBQUFBLGNBQWMsS0FBRyxRQUFqQixHQUEwQixDQUFDLEdBQUVsQixLQUFLLENBQUNuQixZQUFULEVBQXVCb0IsS0FBdkIsRUFBNkJtQixTQUE3QixDQUExQixHQUFrRSxDQUFDLEdBQUVwQixLQUFLLENBQUNwQixXQUFULEVBQXNCcUIsS0FBdEIsRUFBNEJtQixTQUE1QixDQUFsRTtBQUF5R3pKLFlBQUFBLFVBQVUsQ0FBQ3dCLFNBQVgsQ0FBcUJDLEdBQXJCLENBQXlCNkgsMEJBQXpCO0FBQXFEO0FBQUMsU0FBelQsTUFBNlQ7QUFBQ3RKLFVBQUFBLFVBQVUsQ0FBQ3dCLFNBQVgsQ0FBcUJHLE1BQXJCLENBQTRCMkgsMEJBQTVCO0FBQXdERyxVQUFBQSxTQUFTLENBQUM5SCxNQUFWO0FBQW1CO0FBQUM7O0FBQUEyRyxNQUFBQSxLQUFLLENBQUM5SyxnQkFBTixDQUF1QixPQUF2QixFQUErQixZQUFVO0FBQUN5TCxRQUFBQSxhQUFhLENBQUM7QUFBQ08sVUFBQUEsV0FBVyxFQUFDO0FBQWIsU0FBRCxDQUFiO0FBQW1DLE9BQTdFO0FBQStFbEIsTUFBQUEsS0FBSyxDQUFDOUssZ0JBQU4sQ0FBdUIsU0FBdkIsRUFBaUMsVUFBU0MsQ0FBVCxFQUFXO0FBQUNBLFFBQUFBLENBQUMsQ0FBQ21NLGNBQUY7QUFBbUJYLFFBQUFBLGFBQWEsQ0FBQztBQUFDTyxVQUFBQSxXQUFXLEVBQUM7QUFBYixTQUFELENBQWI7QUFBa0MsT0FBbEc7QUFBb0c7O0FBQUEsUUFBSUssY0FBYyxHQUFDO0FBQUN0QixNQUFBQSxZQUFZLEVBQUMsU0FBZDtBQUF3QmMsTUFBQUEsb0JBQW9CLEVBQUMsa0JBQTdDO0FBQWdFQyxNQUFBQSwwQkFBMEIsRUFBQyxzQkFBM0Y7QUFBa0hWLE1BQUFBLGNBQWMsRUFBQyxFQUFqSTtBQUFvSVcsTUFBQUEsY0FBYyxFQUFDO0FBQW5KLEtBQW5COztBQUFnTCxhQUFTbkIsU0FBVCxDQUFtQi9ILE9BQW5CLEVBQTJCK0ksT0FBM0IsRUFBbUM7QUFBQyxVQUFHLENBQUMvSSxPQUFELElBQVUsQ0FBQ0EsT0FBTyxDQUFDeUosUUFBdEIsRUFBK0I7QUFBQyxjQUFNLElBQUk5RyxLQUFKLENBQVUsbUVBQVYsQ0FBTjtBQUFxRjs7QUFBQSxVQUFJK0csTUFBTSxHQUFDLEtBQUssQ0FBaEI7QUFBa0IsVUFBSWpCLElBQUksR0FBQ3pJLE9BQU8sQ0FBQ3lKLFFBQVIsQ0FBaUJFLFdBQWpCLEVBQVQ7QUFBd0NaLE1BQUFBLE9BQU8sR0FBQyxDQUFDLEdBQUVmLEtBQUssQ0FBQ3JCLFFBQVQsRUFBbUJvQyxPQUFuQixFQUEyQlMsY0FBM0IsQ0FBUjs7QUFBbUQsVUFBR2YsSUFBSSxLQUFHLE1BQVYsRUFBaUI7QUFBQ2lCLFFBQUFBLE1BQU0sR0FBQzFKLE9BQU8sQ0FBQytDLGdCQUFSLENBQXlCLHlCQUF6QixDQUFQO0FBQTJENkcsUUFBQUEsaUJBQWlCLENBQUM1SixPQUFELEVBQVMwSixNQUFULENBQWpCO0FBQWtDLE9BQS9HLE1BQW9ILElBQUdqQixJQUFJLEtBQUcsT0FBUCxJQUFnQkEsSUFBSSxLQUFHLFFBQXZCLElBQWlDQSxJQUFJLEtBQUcsVUFBM0MsRUFBc0Q7QUFBQ2lCLFFBQUFBLE1BQU0sR0FBQyxDQUFDMUosT0FBRCxDQUFQO0FBQWlCLE9BQXhFLE1BQTRFO0FBQUMsY0FBTSxJQUFJMkMsS0FBSixDQUFVLDhEQUFWLENBQU47QUFBZ0Y7O0FBQUFrSCxNQUFBQSxlQUFlLENBQUNILE1BQUQsRUFBUVgsT0FBUixDQUFmO0FBQWdDOztBQUFBLGFBQVNhLGlCQUFULENBQTJCRSxJQUEzQixFQUFnQ0osTUFBaEMsRUFBdUM7QUFBQyxVQUFJSyxVQUFVLEdBQUMsQ0FBQyxHQUFFL0IsS0FBSyxDQUFDakIsUUFBVCxFQUFtQixHQUFuQixFQUF1QixZQUFVO0FBQUMsWUFBSWlELFdBQVcsR0FBQ0YsSUFBSSxDQUFDeEgsYUFBTCxDQUFtQixVQUFuQixDQUFoQjtBQUErQyxZQUFHMEgsV0FBSCxFQUFlQSxXQUFXLENBQUNDLEtBQVo7QUFBb0IsT0FBcEgsQ0FBZjtBQUFxSSxPQUFDLEdBQUVqQyxLQUFLLENBQUNsQixPQUFULEVBQWtCNEMsTUFBbEIsRUFBeUIsVUFBU3pCLEtBQVQsRUFBZTtBQUFDLGVBQU9BLEtBQUssQ0FBQzlLLGdCQUFOLENBQXVCLFNBQXZCLEVBQWlDNE0sVUFBakMsQ0FBUDtBQUFvRCxPQUE3RjtBQUErRjs7QUFBQSxhQUFTRixlQUFULENBQXlCSCxNQUF6QixFQUFnQ1gsT0FBaEMsRUFBd0M7QUFBQyxVQUFJYixZQUFZLEdBQUNhLE9BQU8sQ0FBQ2IsWUFBekI7QUFBQSxVQUFzQ0ssY0FBYyxHQUFDUSxPQUFPLENBQUNSLGNBQTdEO0FBQTRFLE9BQUMsR0FBRVAsS0FBSyxDQUFDbEIsT0FBVCxFQUFrQjRDLE1BQWxCLEVBQXlCLFVBQVN6QixLQUFULEVBQWU7QUFBQzdCLFFBQUFBLGtCQUFrQixDQUFDNkIsS0FBRCxFQUFPQyxZQUFQLENBQWxCO0FBQXVDN0IsUUFBQUEsb0JBQW9CLENBQUM0QixLQUFELEVBQU9NLGNBQVAsQ0FBcEI7QUFBMkNqQyxRQUFBQSwwQkFBMEIsQ0FBQzJCLEtBQUQsRUFBT2MsT0FBUCxDQUExQjtBQUEwQyxPQUFySztBQUF1SztBQUFDLEdBQXZnSCxFQUF3Z0g7QUFBQyxjQUFTO0FBQVYsR0FBeGdIO0FBQTVtRCxDQUE1YyxFQUEra0wsRUFBL2tMLEVBQWtsTCxDQUFDLENBQUQsQ0FBbGxMOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTdMLFFBQVEsQ0FBQ2dOLGVBQVQsQ0FBeUIvSSxTQUF6QixDQUFtQ0csTUFBbkMsQ0FBMkMsT0FBM0M7QUFDQXBFLFFBQVEsQ0FBQ2dOLGVBQVQsQ0FBeUIvSSxTQUF6QixDQUFtQ0MsR0FBbkMsQ0FBd0MsSUFBeEM7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLFNBQVMrSSx3QkFBVCxDQUFtQzFCLElBQW5DLEVBQXlDMkIsUUFBekMsRUFBbURDLE1BQW5ELEVBQTJEQyxLQUEzRCxFQUFrRTdELEtBQWxFLEVBQTBFO0FBQ3pFLE1BQUssZ0JBQWdCLE9BQU84RCxFQUE1QixFQUFpQztBQUNoQyxRQUFLLGdCQUFnQixPQUFPOUQsS0FBNUIsRUFBb0M7QUFDbkM4RCxNQUFBQSxFQUFFLENBQUUsTUFBRixFQUFVOUIsSUFBVixFQUFnQjJCLFFBQWhCLEVBQTBCQyxNQUExQixFQUFrQ0MsS0FBbEMsQ0FBRjtBQUNBLEtBRkQsTUFFTztBQUNOQyxNQUFBQSxFQUFFLENBQUUsTUFBRixFQUFVOUIsSUFBVixFQUFnQjJCLFFBQWhCLEVBQTBCQyxNQUExQixFQUFrQ0MsS0FBbEMsRUFBeUM3RCxLQUF6QyxDQUFGO0FBQ0E7QUFDRCxHQU5ELE1BTU87QUFDTjtBQUNBO0FBQ0Q7O0FBRUR2SixRQUFRLENBQUNDLGdCQUFULENBQTJCLGtCQUEzQixFQUErQyxVQUFVcU4sS0FBVixFQUFrQjtBQUNoRSxNQUFLLGdCQUFnQixPQUFPQyx3QkFBdkIsSUFBbUQsT0FBT0Esd0JBQXdCLENBQUNDLGdCQUF4RixFQUEyRztBQUMxRyxRQUFJakMsSUFBSSxHQUFHLE9BQVg7QUFDQSxRQUFJMkIsUUFBUSxHQUFHLGdCQUFmO0FBQ0EsUUFBSUUsS0FBSyxHQUFHSyxRQUFRLENBQUNDLFFBQXJCLENBSDBHLENBRzNFOztBQUMvQixRQUFJUCxNQUFNLEdBQUcsU0FBYjs7QUFDQSxRQUFLLFNBQVNJLHdCQUF3QixDQUFDSSxZQUF6QixDQUFzQ0MsVUFBcEQsRUFBaUU7QUFDaEVULE1BQUFBLE1BQU0sR0FBRyxPQUFUO0FBQ0E7O0FBQ0RGLElBQUFBLHdCQUF3QixDQUFFMUIsSUFBRixFQUFRMkIsUUFBUixFQUFrQkMsTUFBbEIsRUFBMEJDLEtBQTFCLENBQXhCO0FBQ0E7QUFDRCxDQVhEOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQSxTQUFTUyxVQUFULENBQXFCQyxJQUFyQixFQUEyQztBQUFBLE1BQWhCQyxRQUFnQix1RUFBTCxFQUFLOztBQUUxQztBQUNBLE1BQUssQ0FBRUMsTUFBTSxDQUFFLE1BQUYsQ0FBTixDQUFpQkMsUUFBakIsQ0FBMkIsV0FBM0IsQ0FBRixJQUE4QyxZQUFZSCxJQUEvRCxFQUFzRTtBQUNyRTtBQUNBOztBQUVELE1BQUlaLFFBQVEsR0FBRyxPQUFmOztBQUNBLE1BQUssT0FBT2EsUUFBWixFQUF1QjtBQUN0QmIsSUFBQUEsUUFBUSxHQUFHLGFBQWFhLFFBQXhCO0FBQ0EsR0FWeUMsQ0FZMUM7OztBQUNBZCxFQUFBQSx3QkFBd0IsQ0FBRSxPQUFGLEVBQVdDLFFBQVgsRUFBcUJZLElBQXJCLEVBQTJCTCxRQUFRLENBQUNDLFFBQXBDLENBQXhCOztBQUNBLE1BQUssZ0JBQWdCLE9BQU9MLEVBQTVCLEVBQWlDO0FBQ2hDLFFBQUssZUFBZVMsSUFBZixJQUF1QixjQUFjQSxJQUExQyxFQUFpRDtBQUNoRCxVQUFLLGVBQWVBLElBQXBCLEVBQTJCO0FBQzFCVCxRQUFBQSxFQUFFLENBQUUsTUFBRixFQUFVLFFBQVYsRUFBb0JTLElBQXBCLEVBQTBCLE9BQTFCLEVBQW1DTCxRQUFRLENBQUNDLFFBQTVDLENBQUY7QUFDQSxPQUZELE1BRU87QUFDTkwsUUFBQUEsRUFBRSxDQUFFLE1BQUYsRUFBVSxRQUFWLEVBQW9CUyxJQUFwQixFQUEwQixPQUExQixFQUFtQ0wsUUFBUSxDQUFDQyxRQUE1QyxDQUFGO0FBQ0E7QUFDRDtBQUNELEdBUkQsTUFRTztBQUNOO0FBQ0E7QUFDRCxDLENBRUQ7OztBQUNBLFNBQVNRLGNBQVQsR0FBMEI7QUFDekIsTUFBSUMsS0FBSyxHQUFHbk8sUUFBUSxDQUFDMEIsYUFBVCxDQUF3QixPQUF4QixDQUFaO0FBQUEsTUFDQ29NLElBQUksR0FBRzdMLE1BQU0sQ0FBQ3dMLFFBQVAsQ0FBZ0JXLElBRHhCO0FBRUFwTyxFQUFBQSxRQUFRLENBQUNxTyxJQUFULENBQWN2TSxXQUFkLENBQTJCcU0sS0FBM0I7QUFDQUEsRUFBQUEsS0FBSyxDQUFDNUUsS0FBTixHQUFjdUUsSUFBZDtBQUNBSyxFQUFBQSxLQUFLLENBQUNHLE1BQU47QUFDQXRPLEVBQUFBLFFBQVEsQ0FBQ3VPLFdBQVQsQ0FBc0IsTUFBdEI7QUFDQXZPLEVBQUFBLFFBQVEsQ0FBQ3FPLElBQVQsQ0FBYzNMLFdBQWQsQ0FBMkJ5TCxLQUEzQjtBQUNBLEMsQ0FFRDs7O0FBQ0FLLENBQUMsQ0FBRSxzQkFBRixDQUFELENBQTRCQyxLQUE1QixDQUFtQyxZQUFXO0FBQzdDLE1BQUlYLElBQUksR0FBR1UsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVRSxJQUFWLENBQWdCLGNBQWhCLENBQVg7QUFDQSxNQUFJWCxRQUFRLEdBQUcsS0FBZjtBQUNBRixFQUFBQSxVQUFVLENBQUVDLElBQUYsRUFBUUMsUUFBUixDQUFWO0FBQ0EsQ0FKRCxFLENBTUE7O0FBQ0FTLENBQUMsQ0FBRSxpQ0FBRixDQUFELENBQXVDQyxLQUF2QyxDQUE4QyxVQUFVdk8sQ0FBVixFQUFjO0FBQzNEQSxFQUFBQSxDQUFDLENBQUNtTSxjQUFGO0FBQ0FwSyxFQUFBQSxNQUFNLENBQUMwTSxLQUFQO0FBQ0EsQ0FIRCxFLENBS0E7QUFDQTs7QUFDQUgsQ0FBQyxDQUFFLHFDQUFGLENBQUQsQ0FBMkNDLEtBQTNDLENBQWtELFVBQVV2TyxDQUFWLEVBQWM7QUFDL0RBLEVBQUFBLENBQUMsQ0FBQ21NLGNBQUY7QUFDQSxDQUZELEUsQ0FJQTs7QUFDQW1DLENBQUMsQ0FBRSxvQ0FBRixDQUFELENBQTBDQyxLQUExQyxDQUFpRCxVQUFVdk8sQ0FBVixFQUFjO0FBQzlEZ08sRUFBQUEsY0FBYztBQUNkcE8sRUFBQUEsS0FBSyxDQUFDUyxJQUFOLENBQWNMLENBQUMsQ0FBQ0UsTUFBaEIsRUFBMEI7QUFBRXVCLElBQUFBLElBQUksRUFBRTtBQUFSLEdBQTFCO0FBQ0FZLEVBQUFBLFVBQVUsQ0FBRSxZQUFXO0FBQ3RCekMsSUFBQUEsS0FBSyxDQUFDWSxJQUFOLENBQWNSLENBQUMsQ0FBQ0UsTUFBaEI7QUFDQSxHQUZTLEVBRVAsSUFGTyxDQUFWO0FBR0EsU0FBTyxLQUFQO0FBQ0EsQ0FQRCxFLENBU0E7O0FBQ0FvTyxDQUFDLENBQUUsd0dBQUYsQ0FBRCxDQUE4R0MsS0FBOUcsQ0FBcUgsVUFBVXZPLENBQVYsRUFBYztBQUNsSUEsRUFBQUEsQ0FBQyxDQUFDbU0sY0FBRjtBQUNBLE1BQUl1QyxHQUFHLEdBQUdKLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVXpFLElBQVYsQ0FBZ0IsTUFBaEIsQ0FBVjtBQUNBOUgsRUFBQUEsTUFBTSxDQUFDNE0sSUFBUCxDQUFhRCxHQUFiLEVBQWtCLFFBQWxCO0FBQ0EsQ0FKRDs7Ozs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsU0FBU0UsZUFBVCxHQUEyQjtBQUMxQixNQUFNQyxzQkFBc0IsR0FBR2xNLHVCQUF1QixDQUFFO0FBQ3ZEQyxJQUFBQSxPQUFPLEVBQUU5QyxRQUFRLENBQUNvRixhQUFULENBQXdCLHVCQUF4QixDQUQ4QztBQUV2RHJDLElBQUFBLFlBQVksRUFBRSxTQUZ5QztBQUd2REksSUFBQUEsWUFBWSxFQUFFO0FBSHlDLEdBQUYsQ0FBdEQ7QUFNQSxNQUFJNkwsZ0JBQWdCLEdBQUdoUCxRQUFRLENBQUNvRixhQUFULENBQXdCLFlBQXhCLENBQXZCOztBQUNBLE1BQUssU0FBUzRKLGdCQUFkLEVBQWlDO0FBQ2hDQSxJQUFBQSxnQkFBZ0IsQ0FBQy9PLGdCQUFqQixDQUFtQyxPQUFuQyxFQUE0QyxVQUFVQyxDQUFWLEVBQWM7QUFDekRBLE1BQUFBLENBQUMsQ0FBQ21NLGNBQUY7QUFDQSxVQUFJNEMsUUFBUSxHQUFHLFdBQVcsS0FBS3JOLFlBQUwsQ0FBbUIsZUFBbkIsQ0FBWCxJQUFtRCxLQUFsRTtBQUNBLFdBQUtVLFlBQUwsQ0FBbUIsZUFBbkIsRUFBb0MsQ0FBRTJNLFFBQXRDOztBQUNBLFVBQUssU0FBU0EsUUFBZCxFQUF5QjtBQUN4QkYsUUFBQUEsc0JBQXNCLENBQUM1SyxjQUF2QjtBQUNBLE9BRkQsTUFFTztBQUNONEssUUFBQUEsc0JBQXNCLENBQUNqTCxjQUF2QjtBQUNBO0FBQ0QsS0FURDtBQVVBOztBQUVELE1BQU1vTCxtQkFBbUIsR0FBR3JNLHVCQUF1QixDQUFFO0FBQ3BEQyxJQUFBQSxPQUFPLEVBQUU5QyxRQUFRLENBQUNvRixhQUFULENBQXdCLDJCQUF4QixDQUQyQztBQUVwRHJDLElBQUFBLFlBQVksRUFBRSxTQUZzQztBQUdwREksSUFBQUEsWUFBWSxFQUFFO0FBSHNDLEdBQUYsQ0FBbkQ7QUFNQSxNQUFJZ00sYUFBYSxHQUFHblAsUUFBUSxDQUFDb0YsYUFBVCxDQUF3Qiw0QkFBeEIsQ0FBcEI7O0FBQ0EsTUFBSyxTQUFTK0osYUFBZCxFQUE4QjtBQUM3QkEsSUFBQUEsYUFBYSxDQUFDbFAsZ0JBQWQsQ0FBZ0MsT0FBaEMsRUFBeUMsVUFBVUMsQ0FBVixFQUFjO0FBQ3REQSxNQUFBQSxDQUFDLENBQUNtTSxjQUFGO0FBQ0EsVUFBSTRDLFFBQVEsR0FBRyxXQUFXLEtBQUtyTixZQUFMLENBQW1CLGVBQW5CLENBQVgsSUFBbUQsS0FBbEU7QUFDQSxXQUFLVSxZQUFMLENBQW1CLGVBQW5CLEVBQW9DLENBQUUyTSxRQUF0Qzs7QUFDQSxVQUFLLFNBQVNBLFFBQWQsRUFBeUI7QUFDeEJDLFFBQUFBLG1CQUFtQixDQUFDL0ssY0FBcEI7QUFDQSxPQUZELE1BRU87QUFDTitLLFFBQUFBLG1CQUFtQixDQUFDcEwsY0FBcEI7QUFDQTtBQUNELEtBVEQ7QUFVQTs7QUFFRCxNQUFJMUQsTUFBTSxHQUFNSixRQUFRLENBQUNvRixhQUFULENBQXdCLGdEQUF4QixDQUFoQjs7QUFDQSxNQUFLLFNBQVNoRixNQUFkLEVBQXVCO0FBQ3RCLFFBQUlnUCxHQUFHLEdBQVNwUCxRQUFRLENBQUMwQixhQUFULENBQXdCLEtBQXhCLENBQWhCO0FBQ0EwTixJQUFBQSxHQUFHLENBQUN2TixTQUFKLEdBQWdCLG9GQUFoQjtBQUNBLFFBQUl3TixRQUFRLEdBQUlyUCxRQUFRLENBQUNzUCxzQkFBVCxFQUFoQjtBQUNBRixJQUFBQSxHQUFHLENBQUM5TSxZQUFKLENBQWtCLE9BQWxCLEVBQTJCLGdCQUEzQjtBQUNBK00sSUFBQUEsUUFBUSxDQUFDdk4sV0FBVCxDQUFzQnNOLEdBQXRCO0FBQ0FoUCxJQUFBQSxNQUFNLENBQUMwQixXQUFQLENBQW9CdU4sUUFBcEI7O0FBRUEsUUFBTUUsbUJBQWtCLEdBQUcxTSx1QkFBdUIsQ0FBRTtBQUNuREMsTUFBQUEsT0FBTyxFQUFFOUMsUUFBUSxDQUFDb0YsYUFBVCxDQUF3Qix3Q0FBeEIsQ0FEMEM7QUFFbkRyQyxNQUFBQSxZQUFZLEVBQUUsU0FGcUM7QUFHbkRJLE1BQUFBLFlBQVksRUFBRTtBQUhxQyxLQUFGLENBQWxEOztBQU1BLFFBQUlxTSxhQUFhLEdBQUd4UCxRQUFRLENBQUNvRixhQUFULENBQXdCLGVBQXhCLENBQXBCO0FBQ0FvSyxJQUFBQSxhQUFhLENBQUN2UCxnQkFBZCxDQUFnQyxPQUFoQyxFQUF5QyxVQUFVQyxDQUFWLEVBQWM7QUFDdERBLE1BQUFBLENBQUMsQ0FBQ21NLGNBQUY7QUFDQSxVQUFJNEMsUUFBUSxHQUFHLFdBQVdPLGFBQWEsQ0FBQzVOLFlBQWQsQ0FBNEIsZUFBNUIsQ0FBWCxJQUE0RCxLQUEzRTtBQUNBNE4sTUFBQUEsYUFBYSxDQUFDbE4sWUFBZCxDQUE0QixlQUE1QixFQUE2QyxDQUFFMk0sUUFBL0M7O0FBQ0EsVUFBSyxTQUFTQSxRQUFkLEVBQXlCO0FBQ3hCTSxRQUFBQSxtQkFBa0IsQ0FBQ3BMLGNBQW5CO0FBQ0EsT0FGRCxNQUVPO0FBQ05vTCxRQUFBQSxtQkFBa0IsQ0FBQ3pMLGNBQW5CO0FBQ0E7QUFDRCxLQVREO0FBV0EsUUFBSTJMLFdBQVcsR0FBSXpQLFFBQVEsQ0FBQ29GLGFBQVQsQ0FBd0IsaUJBQXhCLENBQW5CO0FBQ0FxSyxJQUFBQSxXQUFXLENBQUN4UCxnQkFBWixDQUE4QixPQUE5QixFQUF1QyxVQUFVQyxDQUFWLEVBQWM7QUFDcERBLE1BQUFBLENBQUMsQ0FBQ21NLGNBQUY7QUFDQSxVQUFJNEMsUUFBUSxHQUFHLFdBQVdPLGFBQWEsQ0FBQzVOLFlBQWQsQ0FBNEIsZUFBNUIsQ0FBWCxJQUE0RCxLQUEzRTtBQUNBNE4sTUFBQUEsYUFBYSxDQUFDbE4sWUFBZCxDQUE0QixlQUE1QixFQUE2QyxDQUFFMk0sUUFBL0M7O0FBQ0EsVUFBSyxTQUFTQSxRQUFkLEVBQXlCO0FBQ3hCTSxRQUFBQSxtQkFBa0IsQ0FBQ3BMLGNBQW5CO0FBQ0EsT0FGRCxNQUVPO0FBQ05vTCxRQUFBQSxtQkFBa0IsQ0FBQ3pMLGNBQW5CO0FBQ0E7QUFDRCxLQVREO0FBVUEsR0EvRXlCLENBaUYxQjs7O0FBQ0EwSyxFQUFBQSxDQUFDLENBQUV4TyxRQUFGLENBQUQsQ0FBYzBQLEtBQWQsQ0FBcUIsVUFBVXhQLENBQVYsRUFBYztBQUNsQyxRQUFLLE9BQU9BLENBQUMsQ0FBQ3lQLE9BQWQsRUFBd0I7QUFDdkIsVUFBSUMsa0JBQWtCLEdBQUcsV0FBV1osZ0JBQWdCLENBQUNwTixZQUFqQixDQUErQixlQUEvQixDQUFYLElBQStELEtBQXhGO0FBQ0EsVUFBSWlPLGVBQWUsR0FBRyxXQUFXVixhQUFhLENBQUN2TixZQUFkLENBQTRCLGVBQTVCLENBQVgsSUFBNEQsS0FBbEY7QUFDQSxVQUFJa08sZUFBZSxHQUFHLFdBQVdOLGFBQWEsQ0FBQzVOLFlBQWQsQ0FBNEIsZUFBNUIsQ0FBWCxJQUE0RCxLQUFsRjs7QUFDQSxVQUFLNEQsU0FBUyxhQUFZb0ssa0JBQVosQ0FBVCxJQUEyQyxTQUFTQSxrQkFBekQsRUFBOEU7QUFDN0VaLFFBQUFBLGdCQUFnQixDQUFDMU0sWUFBakIsQ0FBK0IsZUFBL0IsRUFBZ0QsQ0FBRXNOLGtCQUFsRDtBQUNBYixRQUFBQSxzQkFBc0IsQ0FBQzVLLGNBQXZCO0FBQ0E7O0FBQ0QsVUFBS3FCLFNBQVMsYUFBWXFLLGVBQVosQ0FBVCxJQUF3QyxTQUFTQSxlQUF0RCxFQUF3RTtBQUN2RVYsUUFBQUEsYUFBYSxDQUFDN00sWUFBZCxDQUE0QixlQUE1QixFQUE2QyxDQUFFdU4sZUFBL0M7QUFDQVgsUUFBQUEsbUJBQW1CLENBQUMvSyxjQUFwQjtBQUNBOztBQUNELFVBQUtxQixTQUFTLGFBQVlzSyxlQUFaLENBQVQsSUFBd0MsU0FBU0EsZUFBdEQsRUFBd0U7QUFDdkVOLFFBQUFBLGFBQWEsQ0FBQ2xOLFlBQWQsQ0FBNEIsZUFBNUIsRUFBNkMsQ0FBRXdOLGVBQS9DO0FBQ0FQLFFBQUFBLGtCQUFrQixDQUFDcEwsY0FBbkI7QUFDQTtBQUNEO0FBQ0QsR0FsQkQ7QUFtQkE7O0FBRUQsU0FBUzRMLGNBQVQsQ0FBeUJuTCxRQUF6QixFQUFtQ0MsV0FBbkMsRUFBZ0RDLGVBQWhELEVBQWtFO0FBRWpFLE1BQUlrTCxFQUFFLEdBQUcvTixNQUFNLENBQUNnTyxTQUFQLENBQWlCQyxTQUExQjtBQUNBLE1BQUlDLElBQUksR0FBRyxlQUFlQyxJQUFmLENBQXFCSixFQUFyQixDQUFYOztBQUNBLE1BQUtHLElBQUwsRUFBWTtBQUNYO0FBQ0EsR0FOZ0UsQ0FRakU7OztBQUNBLE1BQU1FLDBCQUEwQixHQUFHMUwsbUJBQW1CLENBQUU7QUFDdkRDLElBQUFBLFFBQVEsRUFBRUEsUUFENkM7QUFFdkRDLElBQUFBLFdBQVcsRUFBRUEsV0FGMEM7QUFHdkRDLElBQUFBLGVBQWUsRUFBRUEsZUFIc0M7QUFJdkRDLElBQUFBLFlBQVksRUFBRSxPQUp5QztBQUt2REMsSUFBQUEsa0JBQWtCLEVBQUUseUJBTG1DO0FBTXZEQyxJQUFBQSxtQkFBbUIsRUFBRSwwQkFOa0MsQ0FRdkQ7O0FBUnVELEdBQUYsQ0FBdEQsQ0FUaUUsQ0FvQmpFOztBQUNBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVDOztBQUVENkosZUFBZTs7QUFFZixJQUFLLElBQUlOLENBQUMsQ0FBRSxtQkFBRixDQUFELENBQXlCL0csTUFBbEMsRUFBMkM7QUFDMUNzSSxFQUFBQSxjQUFjLENBQUUsbUJBQUYsRUFBdUIsc0JBQXZCLEVBQStDLHdCQUEvQyxDQUFkO0FBQ0E7O0FBQ0QsSUFBSyxJQUFJdkIsQ0FBQyxDQUFFLDBCQUFGLENBQUQsQ0FBZ0MvRyxNQUF6QyxFQUFrRDtBQUNqRHNJLEVBQUFBLGNBQWMsQ0FBRSwwQkFBRixFQUE4Qix5QkFBOUIsRUFBeUQsb0JBQXpELENBQWQ7QUFDQTs7QUFFRHZCLENBQUMsQ0FBRSxHQUFGLEVBQU9BLENBQUMsQ0FBRSxpQkFBRixDQUFSLENBQUQsQ0FBaUNDLEtBQWpDLENBQXdDLFlBQVc7QUFDbEQsTUFBSTZCLFdBQVcsR0FBVzlCLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVStCLE9BQVYsQ0FBbUIsV0FBbkIsRUFBaUNDLElBQWpDLENBQXVDLElBQXZDLEVBQThDMUMsSUFBOUMsRUFBMUI7QUFDQSxNQUFJMkMsU0FBUyxHQUFhakMsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVK0IsT0FBVixDQUFtQixTQUFuQixFQUErQkMsSUFBL0IsQ0FBcUMsZUFBckMsRUFBdUQxQyxJQUF2RCxFQUExQjtBQUNBLE1BQUk0QyxtQkFBbUIsR0FBRyxFQUExQjs7QUFDQSxNQUFLLE9BQU9KLFdBQVosRUFBMEI7QUFDekJJLElBQUFBLG1CQUFtQixHQUFHSixXQUF0QjtBQUNBLEdBRkQsTUFFTyxJQUFLLE9BQU9HLFNBQVosRUFBd0I7QUFDOUJDLElBQUFBLG1CQUFtQixHQUFHRCxTQUF0QjtBQUNBOztBQUNEeEQsRUFBQUEsd0JBQXdCLENBQUUsT0FBRixFQUFXLGNBQVgsRUFBMkIsT0FBM0IsRUFBb0N5RCxtQkFBcEMsQ0FBeEI7QUFDQSxDQVZEO0FBWUFsQyxDQUFDLENBQUUsR0FBRixFQUFPQSxDQUFDLENBQUUsa0JBQUYsQ0FBUixDQUFELENBQWtDQyxLQUFsQyxDQUF5QyxZQUFXO0FBQ25EeEIsRUFBQUEsd0JBQXdCLENBQUUsT0FBRixFQUFXLCtCQUFYLEVBQTRDLE9BQTVDLEVBQXFEUSxRQUFRLENBQUNDLFFBQTlELENBQXhCO0FBQ0EsQ0FGRDtBQUlBYyxDQUFDLENBQUUsR0FBRixFQUFPQSxDQUFDLENBQUUsWUFBRixDQUFSLENBQUQsQ0FBNEJDLEtBQTVCLENBQW1DLFlBQVc7QUFDN0N4QixFQUFBQSx3QkFBd0IsQ0FBRSxPQUFGLEVBQVcsc0JBQVgsRUFBbUMsT0FBbkMsRUFBNENRLFFBQVEsQ0FBQ0MsUUFBckQsQ0FBeEI7QUFDQSxDQUZEOzs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFNLE1BQU0sQ0FBQ3RELEVBQVAsQ0FBVWlHLFNBQVYsR0FBc0IsWUFBVztBQUNoQyxTQUFPLEtBQUtDLFFBQUwsR0FBZ0JDLE1BQWhCLENBQXdCLFlBQVc7QUFDekMsV0FBUyxLQUFLQyxRQUFMLEtBQWtCQyxJQUFJLENBQUNDLFNBQXZCLElBQW9DLE9BQU8sS0FBS0MsU0FBTCxDQUFlQyxJQUFmLEVBQXBEO0FBQ0EsR0FGTSxDQUFQO0FBR0EsQ0FKRDs7QUFNQSxTQUFTQyxzQkFBVCxDQUFpQ2hFLE1BQWpDLEVBQTBDO0FBQ3pDLE1BQUlpRSxNQUFNLEdBQUcscUZBQXFGakUsTUFBckYsR0FBOEYscUNBQTlGLEdBQXNJQSxNQUF0SSxHQUErSSxnQ0FBNUo7QUFDQSxTQUFPaUUsTUFBUDtBQUNBOztBQUVELFNBQVNDLFlBQVQsR0FBd0I7QUFDdkIsTUFBSXpFLElBQUksR0FBaUI0QixDQUFDLENBQUUsd0JBQUYsQ0FBMUI7QUFDQSxNQUFJOEMsUUFBUSxHQUFhQyw0QkFBNEIsQ0FBQ0MsUUFBN0IsR0FBd0NELDRCQUE0QixDQUFDRSxjQUE5RjtBQUNBLE1BQUlDLE9BQU8sR0FBY0osUUFBUSxHQUFHLEdBQVgsR0FBaUIsY0FBMUM7QUFDQSxNQUFJSyxhQUFhLEdBQVEsRUFBekI7QUFDQSxNQUFJQyxjQUFjLEdBQU8sQ0FBekI7QUFDQSxNQUFJQyxlQUFlLEdBQU0sRUFBekI7QUFDQSxNQUFJQyxlQUFlLEdBQU0sRUFBekI7QUFDQSxNQUFJQyxTQUFTLEdBQVksRUFBekI7QUFDQSxNQUFJQyxhQUFhLEdBQVEsRUFBekI7QUFDQSxNQUFJQyxrQkFBa0IsR0FBRyxFQUF6QjtBQUNBLE1BQUlDLFNBQVMsR0FBWSxFQUF6QjtBQUNBLE1BQUlDLFlBQVksR0FBUyxFQUF6QjtBQUNBLE1BQUlDLElBQUksR0FBaUIsRUFBekIsQ0FidUIsQ0FldkI7O0FBQ0E1RCxFQUFBQSxDQUFDLENBQUUsMERBQUYsQ0FBRCxDQUFnRS9DLElBQWhFLENBQXNFLFNBQXRFLEVBQWlGLEtBQWpGO0FBQ0ErQyxFQUFBQSxDQUFDLENBQUUsdURBQUYsQ0FBRCxDQUE2RC9DLElBQTdELENBQW1FLFNBQW5FLEVBQThFLEtBQTlFLEVBakJ1QixDQW1CdkI7O0FBQ0EsTUFBSyxJQUFJK0MsQ0FBQyxDQUFFLG9CQUFGLENBQUQsQ0FBMEIvRyxNQUFuQyxFQUE0QztBQUMzQ21LLElBQUFBLGNBQWMsR0FBR3BELENBQUMsQ0FBRSx5QkFBRixDQUFELENBQStCL0csTUFBaEQsQ0FEMkMsQ0FHM0M7O0FBQ0ErRyxJQUFBQSxDQUFDLENBQUUsb0JBQUYsQ0FBRCxDQUEwQjZELEVBQTFCLENBQThCLE9BQTlCLEVBQXVDLDBEQUF2QyxFQUFtRyxZQUFXO0FBRTdHUixNQUFBQSxlQUFlLEdBQUdyRCxDQUFDLENBQUUsSUFBRixDQUFELENBQVU4RCxHQUFWLEVBQWxCO0FBQ0FSLE1BQUFBLGVBQWUsR0FBR3RELENBQUMsQ0FBRSxRQUFGLENBQUQsQ0FBYzhELEdBQWQsRUFBbEI7QUFDQVAsTUFBQUEsU0FBUyxHQUFTdkQsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVL0MsSUFBVixDQUFnQixJQUFoQixFQUF1QjhHLE9BQXZCLENBQWdDLGdCQUFoQyxFQUFrRCxFQUFsRCxDQUFsQjtBQUNBWixNQUFBQSxhQUFhLEdBQUtSLHNCQUFzQixDQUFFLGdCQUFGLENBQXhDLENBTDZHLENBTzdHOztBQUNBaUIsTUFBQUEsSUFBSSxHQUFHNUQsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVaEUsTUFBVixHQUFtQkEsTUFBbkIsRUFBUDtBQUNBZ0UsTUFBQUEsQ0FBQyxDQUFFLGdCQUFGLEVBQW9CNEQsSUFBcEIsQ0FBRCxDQUE0QjFSLElBQTVCO0FBQ0E4TixNQUFBQSxDQUFDLENBQUUsaUJBQUYsRUFBcUI0RCxJQUFyQixDQUFELENBQTZCN1IsSUFBN0I7QUFDQWlPLE1BQUFBLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVWhFLE1BQVYsR0FBbUJBLE1BQW5CLEdBQTRCZ0ksUUFBNUIsQ0FBc0MsZUFBdEM7QUFDQWhFLE1BQUFBLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVWhFLE1BQVYsR0FBbUJBLE1BQW5CLEdBQTRCaUksV0FBNUIsQ0FBeUMsZ0JBQXpDLEVBWjZHLENBYzdHOztBQUNBakUsTUFBQUEsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVaEUsTUFBVixHQUFtQkEsTUFBbkIsR0FBNEJrSSxNQUE1QixDQUFvQ2YsYUFBcEM7QUFFQW5ELE1BQUFBLENBQUMsQ0FBRSxvQkFBRixDQUFELENBQTBCNkQsRUFBMUIsQ0FBOEIsT0FBOUIsRUFBdUMsMkJBQXZDLEVBQW9FLFVBQVUvRSxLQUFWLEVBQWtCO0FBQ3JGQSxRQUFBQSxLQUFLLENBQUNqQixjQUFOLEdBRHFGLENBR3JGOztBQUNBbUMsUUFBQUEsQ0FBQyxDQUFFLHlCQUFGLENBQUQsQ0FBK0JtQyxTQUEvQixHQUEyQ2dDLEtBQTNDLEdBQW1EQyxXQUFuRCxDQUFnRWYsZUFBaEU7QUFDQXJELFFBQUFBLENBQUMsQ0FBRSxpQkFBaUJ1RCxTQUFuQixDQUFELENBQWdDcEIsU0FBaEMsR0FBNENnQyxLQUE1QyxHQUFvREMsV0FBcEQsQ0FBaUVkLGVBQWpFLEVBTHFGLENBT3JGOztBQUNBdEQsUUFBQUEsQ0FBQyxDQUFFLFFBQUYsQ0FBRCxDQUFjOEQsR0FBZCxDQUFtQlQsZUFBbkIsRUFScUYsQ0FVckY7O0FBQ0FqRixRQUFBQSxJQUFJLENBQUNpRyxNQUFMLEdBWHFGLENBYXJGOztBQUNBckUsUUFBQUEsQ0FBQyxDQUFFLDBEQUFGLENBQUQsQ0FBZ0UvQyxJQUFoRSxDQUFzRSxTQUF0RSxFQUFpRixLQUFqRixFQWRxRixDQWdCckY7O0FBQ0ErQyxRQUFBQSxDQUFDLENBQUUsb0JBQW9CdUQsU0FBdEIsQ0FBRCxDQUFtQ08sR0FBbkMsQ0FBd0NSLGVBQXhDO0FBQ0F0RCxRQUFBQSxDQUFDLENBQUUsbUJBQW1CdUQsU0FBckIsQ0FBRCxDQUFrQ08sR0FBbEMsQ0FBdUNSLGVBQXZDLEVBbEJxRixDQW9CckY7O0FBQ0F0RCxRQUFBQSxDQUFDLENBQUUsaUJBQUYsRUFBcUI0RCxJQUFJLENBQUM1SCxNQUFMLEVBQXJCLENBQUQsQ0FBc0NwRyxNQUF0QztBQUNBb0ssUUFBQUEsQ0FBQyxDQUFFLGdCQUFGLEVBQW9CNEQsSUFBSSxDQUFDNUgsTUFBTCxFQUFwQixDQUFELENBQXFDakssSUFBckM7QUFDQSxPQXZCRDtBQXdCQWlPLE1BQUFBLENBQUMsQ0FBRSxvQkFBRixDQUFELENBQTBCNkQsRUFBMUIsQ0FBOEIsT0FBOUIsRUFBdUMsd0JBQXZDLEVBQWlFLFVBQVUvRSxLQUFWLEVBQWtCO0FBQ2xGQSxRQUFBQSxLQUFLLENBQUNqQixjQUFOO0FBQ0FtQyxRQUFBQSxDQUFDLENBQUUsZ0JBQUYsRUFBb0I0RCxJQUFJLENBQUM1SCxNQUFMLEVBQXBCLENBQUQsQ0FBcUNqSyxJQUFyQztBQUNBaU8sUUFBQUEsQ0FBQyxDQUFFLGlCQUFGLEVBQXFCNEQsSUFBSSxDQUFDNUgsTUFBTCxFQUFyQixDQUFELENBQXNDcEcsTUFBdEM7QUFDQSxPQUpEO0FBS0EsS0E5Q0QsRUFKMkMsQ0FvRDNDOztBQUNBb0ssSUFBQUEsQ0FBQyxDQUFFLG9CQUFGLENBQUQsQ0FBMEI2RCxFQUExQixDQUE4QixRQUE5QixFQUF3Qyx1REFBeEMsRUFBaUcsWUFBVztBQUMzR0wsTUFBQUEsYUFBYSxHQUFHeEQsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVOEQsR0FBVixFQUFoQjtBQUNBWCxNQUFBQSxhQUFhLEdBQUtSLHNCQUFzQixDQUFFLFNBQUYsQ0FBeEM7QUFDQTNDLE1BQUFBLENBQUMsQ0FBRSx5QkFBRixDQUFELENBQStCc0UsSUFBL0IsQ0FBcUMsWUFBVztBQUMvQyxZQUFLdEUsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVb0MsUUFBVixHQUFxQm1DLEdBQXJCLENBQTBCLENBQTFCLEVBQThCOUIsU0FBOUIsS0FBNENlLGFBQWpELEVBQWlFO0FBQ2hFQyxVQUFBQSxrQkFBa0IsQ0FBQ2UsSUFBbkIsQ0FBeUJ4RSxDQUFDLENBQUUsSUFBRixDQUFELENBQVVvQyxRQUFWLEdBQXFCbUMsR0FBckIsQ0FBMEIsQ0FBMUIsRUFBOEI5QixTQUF2RDtBQUNBO0FBQ0QsT0FKRCxFQUgyRyxDQVMzRzs7QUFDQW1CLE1BQUFBLElBQUksR0FBRzVELENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVWhFLE1BQVYsR0FBbUJBLE1BQW5CLEVBQVA7QUFDQWdFLE1BQUFBLENBQUMsQ0FBRSxnQkFBRixFQUFvQjRELElBQXBCLENBQUQsQ0FBNEIxUixJQUE1QjtBQUNBOE4sTUFBQUEsQ0FBQyxDQUFFLGlCQUFGLEVBQXFCNEQsSUFBckIsQ0FBRCxDQUE2QjdSLElBQTdCO0FBQ0FpTyxNQUFBQSxDQUFDLENBQUUsSUFBRixDQUFELENBQVVoRSxNQUFWLEdBQW1CQSxNQUFuQixHQUE0QmdJLFFBQTVCLENBQXNDLGVBQXRDO0FBQ0FoRSxNQUFBQSxDQUFDLENBQUUsSUFBRixDQUFELENBQVVoRSxNQUFWLEdBQW1CQSxNQUFuQixHQUE0QmlJLFdBQTVCLENBQXlDLGdCQUF6QztBQUNBakUsTUFBQUEsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVaEUsTUFBVixHQUFtQkEsTUFBbkIsR0FBNEJrSSxNQUE1QixDQUFvQ2YsYUFBcEMsRUFmMkcsQ0FpQjNHOztBQUNBbkQsTUFBQUEsQ0FBQyxDQUFFLG9CQUFGLENBQUQsQ0FBMEI2RCxFQUExQixDQUE4QixPQUE5QixFQUF1QyxvQkFBdkMsRUFBNkQsVUFBVS9FLEtBQVYsRUFBa0I7QUFDOUVBLFFBQUFBLEtBQUssQ0FBQ2pCLGNBQU47QUFDQW1DLFFBQUFBLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVXlFLE9BQVYsQ0FBbUIsSUFBbkIsRUFBMEJDLE9BQTFCLENBQW1DLFFBQW5DLEVBQTZDLFlBQVc7QUFDdkQxRSxVQUFBQSxDQUFDLENBQUUsSUFBRixDQUFELENBQVVwSyxNQUFWO0FBQ0EsU0FGRDtBQUdBb0ssUUFBQUEsQ0FBQyxDQUFFLHVCQUFGLENBQUQsQ0FBNkI4RCxHQUE3QixDQUFrQ0wsa0JBQWtCLENBQUNrQixJQUFuQixDQUF5QixHQUF6QixDQUFsQyxFQUw4RSxDQU85RTs7QUFDQXZCLFFBQUFBLGNBQWMsR0FBR3BELENBQUMsQ0FBRSx5QkFBRixDQUFELENBQStCL0csTUFBaEQ7QUFDQW1GLFFBQUFBLElBQUksQ0FBQ2lHLE1BQUw7QUFDQXJFLFFBQUFBLENBQUMsQ0FBRSxpQkFBRixFQUFxQjRELElBQUksQ0FBQzVILE1BQUwsRUFBckIsQ0FBRCxDQUFzQ3BHLE1BQXRDO0FBQ0EsT0FYRDtBQVlBb0ssTUFBQUEsQ0FBQyxDQUFFLG9CQUFGLENBQUQsQ0FBMEI2RCxFQUExQixDQUE4QixPQUE5QixFQUF1QyxpQkFBdkMsRUFBMEQsVUFBVS9FLEtBQVYsRUFBa0I7QUFDM0VBLFFBQUFBLEtBQUssQ0FBQ2pCLGNBQU47QUFDQW1DLFFBQUFBLENBQUMsQ0FBRSxnQkFBRixFQUFvQjRELElBQUksQ0FBQzVILE1BQUwsRUFBcEIsQ0FBRCxDQUFxQ2pLLElBQXJDO0FBQ0FpTyxRQUFBQSxDQUFDLENBQUUsaUJBQUYsRUFBcUI0RCxJQUFJLENBQUM1SCxNQUFMLEVBQXJCLENBQUQsQ0FBc0NwRyxNQUF0QztBQUNBLE9BSkQ7QUFLQSxLQW5DRDtBQW9DQSxHQTdHc0IsQ0ErR3ZCOzs7QUFDQW9LLEVBQUFBLENBQUMsQ0FBRSxlQUFGLENBQUQsQ0FBcUI2RCxFQUFyQixDQUF5QixPQUF6QixFQUFrQyw2QkFBbEMsRUFBaUUsVUFBVS9FLEtBQVYsRUFBa0I7QUFDbEZBLElBQUFBLEtBQUssQ0FBQ2pCLGNBQU47QUFDQW1DLElBQUFBLENBQUMsQ0FBRSw2QkFBRixDQUFELENBQW1DNEUsTUFBbkMsQ0FBMkMsbU1BQW1NeEIsY0FBbk0sR0FBb04sb0JBQXBOLEdBQTJPQSxjQUEzTyxHQUE0UCwrREFBdlM7QUFDQUEsSUFBQUEsY0FBYztBQUNkLEdBSkQ7QUFNQXBELEVBQUFBLENBQUMsQ0FBRSxvQkFBRixDQUFELENBQTBCQyxLQUExQixDQUFpQyxZQUFXO0FBQzNDLFFBQUk0RSxNQUFNLEdBQUc3RSxDQUFDLENBQUUsSUFBRixDQUFkO0FBQ0EsUUFBSThFLFVBQVUsR0FBR0QsTUFBTSxDQUFDOUMsT0FBUCxDQUFnQixNQUFoQixDQUFqQjtBQUNBK0MsSUFBQUEsVUFBVSxDQUFDNUUsSUFBWCxDQUFpQixtQkFBakIsRUFBc0MyRSxNQUFNLENBQUNmLEdBQVAsRUFBdEM7QUFDQSxHQUpEO0FBTUE5RCxFQUFBQSxDQUFDLENBQUUsa0JBQUYsQ0FBRCxDQUF3QjZELEVBQXhCLENBQTRCLFFBQTVCLEVBQXNDLHdCQUF0QyxFQUFnRSxVQUFVL0UsS0FBVixFQUFrQjtBQUNqRixRQUFJVixJQUFJLEdBQUc0QixDQUFDLENBQUUsSUFBRixDQUFaO0FBQ0EsUUFBSStFLGdCQUFnQixHQUFHM0csSUFBSSxDQUFDOEIsSUFBTCxDQUFXLG1CQUFYLEtBQW9DLEVBQTNELENBRmlGLENBSWpGOztBQUNBLFFBQUssT0FBTzZFLGdCQUFQLElBQTJCLG1CQUFtQkEsZ0JBQW5ELEVBQXNFO0FBQ3JFakcsTUFBQUEsS0FBSyxDQUFDakIsY0FBTjtBQUNBOEYsTUFBQUEsWUFBWSxHQUFHdkYsSUFBSSxDQUFDNEcsU0FBTCxFQUFmLENBRnFFLENBRXBDOztBQUNqQ3JCLE1BQUFBLFlBQVksR0FBR0EsWUFBWSxHQUFHLFlBQTlCO0FBQ0EzRCxNQUFBQSxDQUFDLENBQUNpRixJQUFGLENBQVE7QUFDUDdFLFFBQUFBLEdBQUcsRUFBRThDLE9BREU7QUFFUG5HLFFBQUFBLElBQUksRUFBRSxNQUZDO0FBR1BtSSxRQUFBQSxVQUFVLEVBQUUsb0JBQVVDLEdBQVYsRUFBZ0I7QUFDM0JBLFVBQUFBLEdBQUcsQ0FBQ0MsZ0JBQUosQ0FBc0IsWUFBdEIsRUFBb0NyQyw0QkFBNEIsQ0FBQ3NDLEtBQWpFO0FBQ0EsU0FMTTtBQU1QQyxRQUFBQSxRQUFRLEVBQUUsTUFOSDtBQU9QcEYsUUFBQUEsSUFBSSxFQUFFeUQ7QUFQQyxPQUFSLEVBUUk0QixJQVJKLENBUVUsWUFBVztBQUNwQjdCLFFBQUFBLFNBQVMsR0FBRzFELENBQUMsQ0FBRSw0Q0FBRixDQUFELENBQWtEd0YsR0FBbEQsQ0FBdUQsWUFBVztBQUM3RSxpQkFBT3hGLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVThELEdBQVYsRUFBUDtBQUNBLFNBRlcsRUFFUlMsR0FGUSxFQUFaO0FBR0F2RSxRQUFBQSxDQUFDLENBQUNzRSxJQUFGLENBQVFaLFNBQVIsRUFBbUIsVUFBVStCLEtBQVYsRUFBaUIxSyxLQUFqQixFQUF5QjtBQUMzQ3FJLFVBQUFBLGNBQWMsR0FBR0EsY0FBYyxHQUFHcUMsS0FBbEM7QUFDQXpGLFVBQUFBLENBQUMsQ0FBRSxvQkFBRixDQUFELENBQTBCa0UsTUFBMUIsQ0FBa0Msd0JBQXdCZCxjQUF4QixHQUF5QyxJQUF6QyxHQUFnRHJJLEtBQWhELEdBQXdELDJLQUF4RCxHQUFzT3FJLGNBQXRPLEdBQXVQLFdBQXZQLEdBQXFRckksS0FBclEsR0FBNlEsOEJBQTdRLEdBQThTcUksY0FBOVMsR0FBK1Qsc0lBQS9ULEdBQXdjc0Msa0JBQWtCLENBQUUzSyxLQUFGLENBQTFkLEdBQXNlLCtJQUF0ZSxHQUF3bkJxSSxjQUF4bkIsR0FBeW9CLHNCQUF6b0IsR0FBa3FCQSxjQUFscUIsR0FBbXJCLFdBQW5yQixHQUFpc0JySSxLQUFqc0IsR0FBeXNCLDZCQUF6c0IsR0FBeXVCcUksY0FBenVCLEdBQTB2QixnREFBNXhCO0FBQ0FwRCxVQUFBQSxDQUFDLENBQUUsdUJBQUYsQ0FBRCxDQUE2QjhELEdBQTdCLENBQWtDOUQsQ0FBQyxDQUFFLHVCQUFGLENBQUQsQ0FBNkI4RCxHQUE3QixLQUFxQyxHQUFyQyxHQUEyQy9JLEtBQTdFO0FBQ0EsU0FKRDtBQUtBaUYsUUFBQUEsQ0FBQyxDQUFFLDJDQUFGLENBQUQsQ0FBaURwSyxNQUFqRDs7QUFDQSxZQUFLLE1BQU1vSyxDQUFDLENBQUUsb0JBQUYsQ0FBRCxDQUEwQi9HLE1BQXJDLEVBQThDO0FBQzdDLGNBQUsrRyxDQUFDLENBQUUsNENBQUYsQ0FBRCxLQUFzREEsQ0FBQyxDQUFFLHFCQUFGLENBQTVELEVBQXdGO0FBRXZGO0FBQ0FmLFlBQUFBLFFBQVEsQ0FBQzBHLE1BQVQ7QUFDQTtBQUNEO0FBQ0QsT0F6QkQ7QUEwQkE7QUFDRCxHQXBDRDtBQXFDQTs7QUFFRCxTQUFTQyxhQUFULEdBQXlCO0FBQ3hCcFUsRUFBQUEsUUFBUSxDQUFDNkYsZ0JBQVQsQ0FBMkIsbUJBQTNCLEVBQWlEK0QsT0FBakQsQ0FBMEQsVUFBVTlHLE9BQVYsRUFBb0I7QUFDN0VBLElBQUFBLE9BQU8sQ0FBQ3ZCLEtBQVIsQ0FBYzhTLFNBQWQsR0FBMEIsWUFBMUI7QUFDQSxRQUFJQyxNQUFNLEdBQUd4UixPQUFPLENBQUMzQixZQUFSLEdBQXVCMkIsT0FBTyxDQUFDeVIsWUFBNUM7QUFDQXpSLElBQUFBLE9BQU8sQ0FBQzdDLGdCQUFSLENBQTBCLE9BQTFCLEVBQW1DLFVBQVVxTixLQUFWLEVBQWtCO0FBQ3BEQSxNQUFBQSxLQUFLLENBQUNsTixNQUFOLENBQWFtQixLQUFiLENBQW1CaVQsTUFBbkIsR0FBNEIsTUFBNUI7QUFDQWxILE1BQUFBLEtBQUssQ0FBQ2xOLE1BQU4sQ0FBYW1CLEtBQWIsQ0FBbUJpVCxNQUFuQixHQUE0QmxILEtBQUssQ0FBQ2xOLE1BQU4sQ0FBYXFVLFlBQWIsR0FBNEJILE1BQTVCLEdBQXFDLElBQWpFO0FBQ0EsS0FIRDtBQUlBeFIsSUFBQUEsT0FBTyxDQUFDZSxlQUFSLENBQXlCLGlCQUF6QjtBQUNBLEdBUkQ7QUFTQTs7QUFFRDJLLENBQUMsQ0FBRXhPLFFBQUYsQ0FBRCxDQUFjMFUsUUFBZCxDQUF3QixZQUFXO0FBQ2xDLE1BQUlDLFdBQVcsR0FBRzNVLFFBQVEsQ0FBQ29GLGFBQVQsQ0FBd0IsZUFBeEIsQ0FBbEI7O0FBQ0EsTUFBSyxTQUFTdVAsV0FBZCxFQUE0QjtBQUMzQlAsSUFBQUEsYUFBYTtBQUNiO0FBQ0QsQ0FMRDtBQU9BcFUsUUFBUSxDQUFDQyxnQkFBVCxDQUEyQixrQkFBM0IsRUFBK0MsVUFBVXFOLEtBQVYsRUFBa0I7QUFDaEU7O0FBQ0EsTUFBSyxJQUFJa0IsQ0FBQyxDQUFFLDBCQUFGLENBQUQsQ0FBZ0MvRyxNQUF6QyxFQUFrRDtBQUNqRDRKLElBQUFBLFlBQVk7QUFDWjs7QUFDRCxNQUFJdUQsa0JBQWtCLEdBQUc1VSxRQUFRLENBQUNvRixhQUFULENBQXdCLG1CQUF4QixDQUF6Qjs7QUFDQSxNQUFLLFNBQVN3UCxrQkFBZCxFQUFtQztBQUNsQ1IsSUFBQUEsYUFBYTtBQUNiO0FBQ0QsQ0FURDtBQVdBLElBQUlTLEtBQUssR0FBRzdVLFFBQVEsQ0FBQzZGLGdCQUFULENBQTJCLFNBQTNCLENBQVo7QUFDQWdQLEtBQUssQ0FBQ2pMLE9BQU4sQ0FBZSxVQUFXZ0QsSUFBWCxFQUFrQjtBQUNoQzNELEVBQUFBLFNBQVMsQ0FBRTJELElBQUYsRUFBUTtBQUNoQmIsSUFBQUEsMEJBQTBCLEVBQUUsd0JBRFo7QUFFaEJELElBQUFBLG9CQUFvQixFQUFFLG9CQUZOO0FBR2hCZCxJQUFBQSxZQUFZLEVBQUUsU0FIRTtBQUloQmdCLElBQUFBLGNBQWMsRUFBRTtBQUpBLEdBQVIsQ0FBVDtBQU1BLENBUEQ7QUFTQSxJQUFJWSxJQUFJLEdBQUc0QixDQUFDLENBQUUsU0FBRixDQUFaLEMsQ0FDQTs7QUFDQTVCLElBQUksQ0FBQzRELElBQUwsQ0FBVyxRQUFYLEVBQXNCNkIsRUFBdEIsQ0FBMEIsU0FBMUIsRUFBcUMsWUFBWTtBQUM3QyxNQUFJdEgsS0FBSyxHQUFHeUQsQ0FBQyxDQUFFLElBQUYsQ0FBYixDQUQ2QyxDQUU3Qzs7QUFDSCxNQUFJbUUsS0FBSyxHQUFHL0YsSUFBSSxDQUFDNEQsSUFBTCxDQUFXLFVBQVgsRUFBd0JtQyxLQUF4QixFQUFaLENBSGdELENBSWhEOztBQUNBLE1BQUltQyxZQUFZLEdBQUduQyxLQUFLLENBQUNuSSxNQUFOLEVBQW5CLENBTGdELENBTTdDOztBQUNBLE1BQUlPLEtBQUssQ0FBQyxDQUFELENBQUwsS0FBYTRILEtBQUssQ0FBQyxDQUFELENBQXRCLEVBQTJCO0FBQ3ZCO0FBQ0E7QUFFQTtBQUNBLFFBQUlvQyxhQUFhLEdBQUdELFlBQVksQ0FBQ1IsTUFBYixHQUFzQjlTLEdBQTFDLENBTHVCLENBT3ZCOztBQUNBLFFBQUl3VCxVQUFVLEdBQUcvUyxNQUFNLENBQUNnVCxXQUF4QixDQVJ1QixDQVV2Qjs7QUFDQSxRQUFLRixhQUFhLEdBQUdDLFVBQWhCLElBQThCRCxhQUFhLEdBQUdDLFVBQVUsR0FBRy9TLE1BQU0sQ0FBQ0MsV0FBdkUsRUFBcUY7QUFDakYsYUFBTyxJQUFQO0FBQ0gsS0Fic0IsQ0FldkI7OztBQUNBc00sSUFBQUEsQ0FBQyxDQUFFLFlBQUYsQ0FBRCxDQUFrQjBHLFNBQWxCLENBQTZCSCxhQUE3QjtBQUNIO0FBQ0osQ0F6QkQ7OztBQy9OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBLFNBQVNJLGlCQUFULENBQTRCQyxNQUE1QixFQUFvQ0MsRUFBcEMsRUFBd0NDLFVBQXhDLEVBQXFEO0FBQ3BELE1BQUluSSxNQUFNLEdBQVksRUFBdEI7QUFDQSxNQUFJb0ksY0FBYyxHQUFHLEVBQXJCO0FBQ0EsTUFBSUMsY0FBYyxHQUFHLEVBQXJCO0FBQ0EsTUFBSXpILFFBQVEsR0FBVSxFQUF0QjtBQUNBQSxFQUFBQSxRQUFRLEdBQUdzSCxFQUFFLENBQUM5QyxPQUFILENBQVksdUJBQVosRUFBcUMsRUFBckMsQ0FBWDs7QUFDQSxNQUFLLFFBQVErQyxVQUFiLEVBQTBCO0FBQ3pCbkksSUFBQUEsTUFBTSxHQUFHLElBQVQ7QUFDQSxHQUZELE1BRU8sSUFBSyxRQUFRbUksVUFBYixFQUEwQjtBQUNoQ25JLElBQUFBLE1BQU0sR0FBRyxLQUFUO0FBQ0EsR0FGTSxNQUVBO0FBQ05BLElBQUFBLE1BQU0sR0FBRyxPQUFUO0FBQ0E7O0FBQ0QsTUFBSyxTQUFTaUksTUFBZCxFQUF1QjtBQUN0QkcsSUFBQUEsY0FBYyxHQUFHLFNBQWpCO0FBQ0E7O0FBQ0QsTUFBSyxPQUFPeEgsUUFBWixFQUF1QjtBQUN0QkEsSUFBQUEsUUFBUSxHQUFHQSxRQUFRLENBQUMwSCxNQUFULENBQWlCLENBQWpCLEVBQXFCQyxXQUFyQixLQUFxQzNILFFBQVEsQ0FBQzRILEtBQVQsQ0FBZ0IsQ0FBaEIsQ0FBaEQ7QUFDQUgsSUFBQUEsY0FBYyxHQUFHLFFBQVF6SCxRQUF6QjtBQUNBOztBQUNEZCxFQUFBQSx3QkFBd0IsQ0FBRSxPQUFGLEVBQVdzSSxjQUFjLEdBQUcsZUFBakIsR0FBbUNDLGNBQTlDLEVBQThEckksTUFBOUQsRUFBc0VNLFFBQVEsQ0FBQ0MsUUFBL0UsQ0FBeEI7QUFDQSxDLENBRUQ7OztBQUNBYyxDQUFDLENBQUV4TyxRQUFGLENBQUQsQ0FBY3FTLEVBQWQsQ0FBa0IsT0FBbEIsRUFBMkIseUJBQTNCLEVBQXNELFlBQVc7QUFDaEU4QyxFQUFBQSxpQkFBaUIsQ0FBRSxLQUFGLEVBQVMsRUFBVCxFQUFhLEVBQWIsQ0FBakI7QUFDQSxDQUZELEUsQ0FJQTs7QUFDQTNHLENBQUMsQ0FBRXhPLFFBQUYsQ0FBRCxDQUFjcVMsRUFBZCxDQUFrQixPQUFsQixFQUEyQixrQ0FBM0IsRUFBK0QsWUFBVztBQUN6RSxNQUFJRCxJQUFJLEdBQUc1RCxDQUFDLENBQUUsSUFBRixDQUFaOztBQUNBLE1BQUs0RCxJQUFJLENBQUN3RCxFQUFMLENBQVMsVUFBVCxDQUFMLEVBQTZCO0FBQzVCcEgsSUFBQUEsQ0FBQyxDQUFFLGtDQUFGLENBQUQsQ0FBd0MvQyxJQUF4QyxDQUE4QyxTQUE5QyxFQUF5RCxJQUF6RDtBQUNBLEdBRkQsTUFFTztBQUNOK0MsSUFBQUEsQ0FBQyxDQUFFLGtDQUFGLENBQUQsQ0FBd0MvQyxJQUF4QyxDQUE4QyxTQUE5QyxFQUF5RCxLQUF6RDtBQUNBLEdBTndFLENBUXpFOzs7QUFDQTBKLEVBQUFBLGlCQUFpQixDQUFFLElBQUYsRUFBUS9DLElBQUksQ0FBQ3JJLElBQUwsQ0FBVyxJQUFYLENBQVIsRUFBMkJxSSxJQUFJLENBQUNFLEdBQUwsRUFBM0IsQ0FBakIsQ0FUeUUsQ0FXekU7O0FBQ0E5RCxFQUFBQSxDQUFDLENBQUNpRixJQUFGLENBQVE7QUFDUGxJLElBQUFBLElBQUksRUFBRSxNQURDO0FBRVBxRCxJQUFBQSxHQUFHLEVBQUVpSCxNQUFNLENBQUNDLE9BRkw7QUFHUHBILElBQUFBLElBQUksRUFBRTtBQUNMLGdCQUFVLDRDQURMO0FBRUwsZUFBUzBELElBQUksQ0FBQ0UsR0FBTDtBQUZKLEtBSEM7QUFPUHlELElBQUFBLE9BQU8sRUFBRSxpQkFBVUMsUUFBVixFQUFxQjtBQUM3QnhILE1BQUFBLENBQUMsQ0FBRSxnQ0FBRixFQUFvQzRELElBQUksQ0FBQzVILE1BQUwsRUFBcEMsQ0FBRCxDQUFxRHlMLElBQXJELENBQTJERCxRQUFRLENBQUN0SCxJQUFULENBQWMvQyxPQUF6RTs7QUFDQSxVQUFLLFNBQVNxSyxRQUFRLENBQUN0SCxJQUFULENBQWNuTyxJQUE1QixFQUFtQztBQUNsQ2lPLFFBQUFBLENBQUMsQ0FBRSxrQ0FBRixDQUFELENBQXdDOEQsR0FBeEMsQ0FBNkMsQ0FBN0M7QUFDQSxPQUZELE1BRU87QUFDTjlELFFBQUFBLENBQUMsQ0FBRSxrQ0FBRixDQUFELENBQXdDOEQsR0FBeEMsQ0FBNkMsQ0FBN0M7QUFDQTtBQUNEO0FBZE0sR0FBUjtBQWdCQSxDQTVCRDtBQThCQSxDQUFJLFVBQVVsUixDQUFWLEVBQWM7QUFDakIsTUFBSyxDQUFFQSxDQUFDLENBQUM4VSxhQUFULEVBQXlCO0FBQ3hCLFFBQUl4SCxJQUFJLEdBQUc7QUFDVnZCLE1BQUFBLE1BQU0sRUFBRSxtQkFERTtBQUVWZ0osTUFBQUEsSUFBSSxFQUFFM0gsQ0FBQyxDQUFFLGNBQUYsQ0FBRCxDQUFvQjhELEdBQXBCO0FBRkksS0FBWCxDQUR3QixDQU14Qjs7QUFDQSxRQUFJOEQsVUFBVSxHQUFHNUgsQ0FBQyxDQUFFLGVBQUYsQ0FBRCxDQUFxQjhELEdBQXJCLEVBQWpCLENBUHdCLENBU3hCOztBQUNBLFFBQUkrRCxVQUFVLEdBQUdELFVBQVUsR0FBRyxHQUFiLEdBQW1CNUgsQ0FBQyxDQUFDOEgsS0FBRixDQUFTNUgsSUFBVCxDQUFwQyxDQVZ3QixDQVl4Qjs7QUFDQUYsSUFBQUEsQ0FBQyxDQUFDdUUsR0FBRixDQUFPc0QsVUFBUCxFQUFtQixVQUFVTCxRQUFWLEVBQXFCO0FBQ3ZDLFVBQUssT0FBT0EsUUFBWixFQUF1QjtBQUN0QnhILFFBQUFBLENBQUMsQ0FBRSxlQUFGLENBQUQsQ0FBcUJ5SCxJQUFyQixDQUEyQkQsUUFBM0IsRUFEc0IsQ0FHdEI7O0FBQ0EsWUFBSy9ULE1BQU0sQ0FBQ3NVLFVBQVAsSUFBcUJ0VSxNQUFNLENBQUNzVSxVQUFQLENBQWtCbk8sSUFBNUMsRUFBbUQ7QUFDbERuRyxVQUFBQSxNQUFNLENBQUNzVSxVQUFQLENBQWtCbk8sSUFBbEI7QUFDQSxTQU5xQixDQVF0Qjs7O0FBQ0EsWUFBSW9PLFNBQVMsR0FBR3hXLFFBQVEsQ0FBQ3lXLEdBQVQsQ0FBYUMsTUFBYixDQUFxQjFXLFFBQVEsQ0FBQ3lXLEdBQVQsQ0FBYUUsT0FBYixDQUFzQixVQUF0QixDQUFyQixDQUFoQixDQVRzQixDQVd0Qjs7QUFDQSxZQUFLLENBQUMsQ0FBRCxHQUFLSCxTQUFTLENBQUNHLE9BQVYsQ0FBbUIsVUFBbkIsQ0FBVixFQUE0QztBQUMzQ25JLFVBQUFBLENBQUMsQ0FBRXZNLE1BQUYsQ0FBRCxDQUFZaVQsU0FBWixDQUF1QjFHLENBQUMsQ0FBRWdJLFNBQUYsQ0FBRCxDQUFlbEMsTUFBZixHQUF3QjlTLEdBQS9DO0FBQ0E7QUFDRDtBQUNELEtBakJEO0FBa0JBO0FBQ0QsQ0FqQ0csQ0FpQ0R4QixRQWpDQyxDQUFKOzs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTTRXLE9BQU8sR0FBRzVXLFFBQVEsQ0FBQzZGLGdCQUFULENBQTJCLHFCQUEzQixDQUFoQjtBQUNBK1EsT0FBTyxDQUFDaE4sT0FBUixDQUFpQixVQUFVeEosTUFBVixFQUFtQjtBQUNoQ3lXLEVBQUFBLFdBQVcsQ0FBRXpXLE1BQUYsQ0FBWDtBQUNILENBRkQ7O0FBSUEsU0FBU3lXLFdBQVQsQ0FBc0J6VyxNQUF0QixFQUErQjtBQUMzQixNQUFLLFNBQVNBLE1BQWQsRUFBdUI7QUFDbkIsUUFBSTBXLEVBQUUsR0FBVTlXLFFBQVEsQ0FBQzBCLGFBQVQsQ0FBd0IsSUFBeEIsQ0FBaEI7QUFDQW9WLElBQUFBLEVBQUUsQ0FBQ2pWLFNBQUgsR0FBZ0Isc0ZBQWhCO0FBQ0EsUUFBSXdOLFFBQVEsR0FBSXJQLFFBQVEsQ0FBQ3NQLHNCQUFULEVBQWhCO0FBQ0F3SCxJQUFBQSxFQUFFLENBQUN4VSxZQUFILENBQWlCLE9BQWpCLEVBQTBCLGdCQUExQjtBQUNBK00sSUFBQUEsUUFBUSxDQUFDdk4sV0FBVCxDQUFzQmdWLEVBQXRCO0FBQ0ExVyxJQUFBQSxNQUFNLENBQUMwQixXQUFQLENBQW9CdU4sUUFBcEI7QUFDSDtBQUNKOztBQUVELElBQU0wSCxnQkFBZ0IsR0FBRy9XLFFBQVEsQ0FBQzZGLGdCQUFULENBQTJCLHFCQUEzQixDQUF6QjtBQUNBa1IsZ0JBQWdCLENBQUNuTixPQUFqQixDQUEwQixVQUFVb04sZUFBVixFQUE0QjtBQUNsREMsRUFBQUEsWUFBWSxDQUFFRCxlQUFGLENBQVo7QUFDSCxDQUZEOztBQUlBLFNBQVNDLFlBQVQsQ0FBdUJELGVBQXZCLEVBQXlDO0FBQ3JDLE1BQU1FLFVBQVUsR0FBR0YsZUFBZSxDQUFDekcsT0FBaEIsQ0FBeUIsNEJBQXpCLENBQW5CO0FBQ0EsTUFBTTRHLG9CQUFvQixHQUFHdFUsdUJBQXVCLENBQUU7QUFDbERDLElBQUFBLE9BQU8sRUFBRW9VLFVBQVUsQ0FBQzlSLGFBQVgsQ0FBMEIscUJBQTFCLENBRHlDO0FBRWxEckMsSUFBQUEsWUFBWSxFQUFFLDJCQUZvQztBQUdsREksSUFBQUEsWUFBWSxFQUFFO0FBSG9DLEdBQUYsQ0FBcEQ7O0FBTUEsTUFBSyxTQUFTNlQsZUFBZCxFQUFnQztBQUM1QkEsSUFBQUEsZUFBZSxDQUFDL1csZ0JBQWhCLENBQWtDLE9BQWxDLEVBQTJDLFVBQVVDLENBQVYsRUFBYztBQUNyREEsTUFBQUEsQ0FBQyxDQUFDbU0sY0FBRjtBQUNBLFVBQUk0QyxRQUFRLEdBQUcsV0FBVytILGVBQWUsQ0FBQ3BWLFlBQWhCLENBQThCLGVBQTlCLENBQVgsSUFBOEQsS0FBN0U7QUFDQW9WLE1BQUFBLGVBQWUsQ0FBQzFVLFlBQWhCLENBQThCLGVBQTlCLEVBQStDLENBQUUyTSxRQUFqRDs7QUFDQSxVQUFLLFNBQVNBLFFBQWQsRUFBeUI7QUFDckJrSSxRQUFBQSxvQkFBb0IsQ0FBQ2hULGNBQXJCO0FBQ0gsT0FGRCxNQUVPO0FBQ0hnVCxRQUFBQSxvQkFBb0IsQ0FBQ3JULGNBQXJCO0FBQ0g7QUFDSixLQVREO0FBV0EsUUFBSXNULGFBQWEsR0FBR0YsVUFBVSxDQUFDOVIsYUFBWCxDQUEwQixtQkFBMUIsQ0FBcEI7QUFDQWdTLElBQUFBLGFBQWEsQ0FBQ25YLGdCQUFkLENBQWdDLE9BQWhDLEVBQXlDLFVBQVVDLENBQVYsRUFBYztBQUNuREEsTUFBQUEsQ0FBQyxDQUFDbU0sY0FBRjtBQUNBLFVBQUk0QyxRQUFRLEdBQUcsV0FBVytILGVBQWUsQ0FBQ3BWLFlBQWhCLENBQThCLGVBQTlCLENBQVgsSUFBOEQsS0FBN0U7QUFDQW9WLE1BQUFBLGVBQWUsQ0FBQzFVLFlBQWhCLENBQThCLGVBQTlCLEVBQStDLENBQUUyTSxRQUFqRDs7QUFDQSxVQUFLLFNBQVNBLFFBQWQsRUFBeUI7QUFDckJrSSxRQUFBQSxvQkFBb0IsQ0FBQ2hULGNBQXJCO0FBQ0gsT0FGRCxNQUVPO0FBQ0hnVCxRQUFBQSxvQkFBb0IsQ0FBQ3JULGNBQXJCO0FBQ0g7QUFDSixLQVREO0FBVUg7QUFDSiIsImZpbGUiOiJtaW5ucG9zdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHRsaXRlKHQpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIixmdW5jdGlvbihlKXt2YXIgaT1lLnRhcmdldCxuPXQoaSk7bnx8KG49KGk9aS5wYXJlbnRFbGVtZW50KSYmdChpKSksbiYmdGxpdGUuc2hvdyhpLG4sITApfSl9dGxpdGUuc2hvdz1mdW5jdGlvbih0LGUsaSl7dmFyIG49XCJkYXRhLXRsaXRlXCI7ZT1lfHx7fSwodC50b29sdGlwfHxmdW5jdGlvbih0LGUpe2Z1bmN0aW9uIG8oKXt0bGl0ZS5oaWRlKHQsITApfWZ1bmN0aW9uIGwoKXtyfHwocj1mdW5jdGlvbih0LGUsaSl7ZnVuY3Rpb24gbigpe28uY2xhc3NOYW1lPVwidGxpdGUgdGxpdGUtXCIrcitzO3ZhciBlPXQub2Zmc2V0VG9wLGk9dC5vZmZzZXRMZWZ0O28ub2Zmc2V0UGFyZW50PT09dCYmKGU9aT0wKTt2YXIgbj10Lm9mZnNldFdpZHRoLGw9dC5vZmZzZXRIZWlnaHQsZD1vLm9mZnNldEhlaWdodCxmPW8ub2Zmc2V0V2lkdGgsYT1pK24vMjtvLnN0eWxlLnRvcD0oXCJzXCI9PT1yP2UtZC0xMDpcIm5cIj09PXI/ZStsKzEwOmUrbC8yLWQvMikrXCJweFwiLG8uc3R5bGUubGVmdD0oXCJ3XCI9PT1zP2k6XCJlXCI9PT1zP2krbi1mOlwid1wiPT09cj9pK24rMTA6XCJlXCI9PT1yP2ktZi0xMDphLWYvMikrXCJweFwifXZhciBvPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpLGw9aS5ncmF2fHx0LmdldEF0dHJpYnV0ZShcImRhdGEtdGxpdGVcIil8fFwiblwiO28uaW5uZXJIVE1MPWUsdC5hcHBlbmRDaGlsZChvKTt2YXIgcj1sWzBdfHxcIlwiLHM9bFsxXXx8XCJcIjtuKCk7dmFyIGQ9by5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtyZXR1cm5cInNcIj09PXImJmQudG9wPDA/KHI9XCJuXCIsbigpKTpcIm5cIj09PXImJmQuYm90dG9tPndpbmRvdy5pbm5lckhlaWdodD8ocj1cInNcIixuKCkpOlwiZVwiPT09ciYmZC5sZWZ0PDA/KHI9XCJ3XCIsbigpKTpcIndcIj09PXImJmQucmlnaHQ+d2luZG93LmlubmVyV2lkdGgmJihyPVwiZVwiLG4oKSksby5jbGFzc05hbWUrPVwiIHRsaXRlLXZpc2libGVcIixvfSh0LGQsZSkpfXZhciByLHMsZDtyZXR1cm4gdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsbyksdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLG8pLHQudG9vbHRpcD17c2hvdzpmdW5jdGlvbigpe2Q9dC50aXRsZXx8dC5nZXRBdHRyaWJ1dGUobil8fGQsdC50aXRsZT1cIlwiLHQuc2V0QXR0cmlidXRlKG4sXCJcIiksZCYmIXMmJihzPXNldFRpbWVvdXQobCxpPzE1MDoxKSl9LGhpZGU6ZnVuY3Rpb24odCl7aWYoaT09PXQpe3M9Y2xlYXJUaW1lb3V0KHMpO3ZhciBlPXImJnIucGFyZW50Tm9kZTtlJiZlLnJlbW92ZUNoaWxkKHIpLHI9dm9pZCAwfX19fSh0LGUpKS5zaG93KCl9LHRsaXRlLmhpZGU9ZnVuY3Rpb24odCxlKXt0LnRvb2x0aXAmJnQudG9vbHRpcC5oaWRlKGUpfSxcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmKG1vZHVsZS5leHBvcnRzPXRsaXRlKTsiLCIvKiogXG4gKiBMaWJyYXJ5IGNvZGVcbiAqIFVzaW5nIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL0BjbG91ZGZvdXIvdHJhbnNpdGlvbi1oaWRkZW4tZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KHtcbiAgZWxlbWVudCxcbiAgdmlzaWJsZUNsYXNzLFxuICB3YWl0TW9kZSA9ICd0cmFuc2l0aW9uZW5kJyxcbiAgdGltZW91dER1cmF0aW9uLFxuICBoaWRlTW9kZSA9ICdoaWRkZW4nLFxuICBkaXNwbGF5VmFsdWUgPSAnYmxvY2snXG59KSB7XG4gIGlmICh3YWl0TW9kZSA9PT0gJ3RpbWVvdXQnICYmIHR5cGVvZiB0aW1lb3V0RHVyYXRpb24gIT09ICdudW1iZXInKSB7XG4gICAgY29uc29sZS5lcnJvcihgXG4gICAgICBXaGVuIGNhbGxpbmcgdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQgd2l0aCB3YWl0TW9kZSBzZXQgdG8gdGltZW91dCxcbiAgICAgIHlvdSBtdXN0IHBhc3MgaW4gYSBudW1iZXIgZm9yIHRpbWVvdXREdXJhdGlvbi5cbiAgICBgKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIERvbid0IHdhaXQgZm9yIGV4aXQgdHJhbnNpdGlvbnMgaWYgYSB1c2VyIHByZWZlcnMgcmVkdWNlZCBtb3Rpb24uXG4gIC8vIElkZWFsbHkgdHJhbnNpdGlvbnMgd2lsbCBiZSBkaXNhYmxlZCBpbiBDU1MsIHdoaWNoIG1lYW5zIHdlIHNob3VsZCBub3Qgd2FpdFxuICAvLyBiZWZvcmUgYWRkaW5nIGBoaWRkZW5gLlxuICBpZiAod2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJykubWF0Y2hlcykge1xuICAgIHdhaXRNb2RlID0gJ2ltbWVkaWF0ZSc7XG4gIH1cblxuICAvKipcbiAgICogQW4gZXZlbnQgbGlzdGVuZXIgdG8gYWRkIGBoaWRkZW5gIGFmdGVyIG91ciBhbmltYXRpb25zIGNvbXBsZXRlLlxuICAgKiBUaGlzIGxpc3RlbmVyIHdpbGwgcmVtb3ZlIGl0c2VsZiBhZnRlciBjb21wbGV0aW5nLlxuICAgKi9cbiAgY29uc3QgbGlzdGVuZXIgPSBlID0+IHtcbiAgICAvLyBDb25maXJtIGB0cmFuc2l0aW9uZW5kYCB3YXMgY2FsbGVkIG9uICBvdXIgYGVsZW1lbnRgIGFuZCBkaWRuJ3QgYnViYmxlXG4gICAgLy8gdXAgZnJvbSBhIGNoaWxkIGVsZW1lbnQuXG4gICAgaWYgKGUudGFyZ2V0ID09PSBlbGVtZW50KSB7XG4gICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcblxuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBhcHBseUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVtb3ZlSGlkZGVuQXR0cmlidXRlcyA9ICgpID0+IHtcbiAgICBpZihoaWRlTW9kZSA9PT0gJ2Rpc3BsYXknKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5VmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC8qKlxuICAgICAqIFNob3cgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICB0cmFuc2l0aW9uU2hvdygpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhpcyBsaXN0ZW5lciBzaG91bGRuJ3QgYmUgaGVyZSBidXQgaWYgc29tZW9uZSBzcGFtcyB0aGUgdG9nZ2xlXG4gICAgICAgKiBvdmVyIGFuZCBvdmVyIHJlYWxseSBmYXN0IGl0IGNhbiBpbmNvcnJlY3RseSBzdGljayBhcm91bmQuXG4gICAgICAgKiBXZSByZW1vdmUgaXQganVzdCB0byBiZSBzYWZlLlxuICAgICAgICovXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG5cbiAgICAgIC8qKlxuICAgICAgICogU2ltaWxhcmx5LCB3ZSdsbCBjbGVhciB0aGUgdGltZW91dCBpbiBjYXNlIGl0J3Mgc3RpbGwgaGFuZ2luZyBhcm91bmQuXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgICB9XG5cbiAgICAgIHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMoKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBGb3JjZSBhIGJyb3dzZXIgcmUtcGFpbnQgc28gdGhlIGJyb3dzZXIgd2lsbCByZWFsaXplIHRoZVxuICAgICAgICogZWxlbWVudCBpcyBubyBsb25nZXIgYGhpZGRlbmAgYW5kIGFsbG93IHRyYW5zaXRpb25zLlxuICAgICAgICovXG4gICAgICBjb25zdCByZWZsb3cgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHZpc2libGVDbGFzcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEhpZGUgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICB0cmFuc2l0aW9uSGlkZSgpIHtcbiAgICAgIGlmICh3YWl0TW9kZSA9PT0gJ3RyYW5zaXRpb25lbmQnKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICAgIH0gZWxzZSBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0Jykge1xuICAgICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgICAgfSwgdGltZW91dER1cmF0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGx5SGlkZGVuQXR0cmlidXRlcygpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdGhpcyBjbGFzcyB0byB0cmlnZ2VyIG91ciBhbmltYXRpb25cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgdGhlIGVsZW1lbnQncyB2aXNpYmlsaXR5XG4gICAgICovXG4gICAgdG9nZ2xlKCkge1xuICAgICAgaWYgKHRoaXMuaXNIaWRkZW4oKSkge1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25TaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25IaWRlKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRlbGwgd2hldGhlciB0aGUgZWxlbWVudCBpcyBoaWRkZW4gb3Igbm90LlxuICAgICAqL1xuICAgIGlzSGlkZGVuKCkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgaGlkZGVuIGF0dHJpYnV0ZSBkb2VzIG5vdCByZXF1aXJlIGEgdmFsdWUuIFNpbmNlIGFuIGVtcHR5IHN0cmluZyBpc1xuICAgICAgICogZmFsc3ksIGJ1dCBzaG93cyB0aGUgcHJlc2VuY2Ugb2YgYW4gYXR0cmlidXRlIHdlIGNvbXBhcmUgdG8gYG51bGxgXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IGhhc0hpZGRlbkF0dHJpYnV0ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdoaWRkZW4nKSAhPT0gbnVsbDtcblxuICAgICAgY29uc3QgaXNEaXNwbGF5Tm9uZSA9IGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnO1xuXG4gICAgICBjb25zdCBoYXNWaXNpYmxlQ2xhc3MgPSBbLi4uZWxlbWVudC5jbGFzc0xpc3RdLmluY2x1ZGVzKHZpc2libGVDbGFzcyk7XG5cbiAgICAgIHJldHVybiBoYXNIaWRkZW5BdHRyaWJ1dGUgfHwgaXNEaXNwbGF5Tm9uZSB8fCAhaGFzVmlzaWJsZUNsYXNzO1xuICAgIH0sXG5cbiAgICAvLyBBIHBsYWNlaG9sZGVyIGZvciBvdXIgYHRpbWVvdXRgXG4gICAgdGltZW91dDogbnVsbFxuICB9O1xufSIsIi8qKlxuICBQcmlvcml0eSsgaG9yaXpvbnRhbCBzY3JvbGxpbmcgbWVudS5cblxuICBAcGFyYW0ge09iamVjdH0gb2JqZWN0IC0gQ29udGFpbmVyIGZvciBhbGwgb3B0aW9ucy5cbiAgICBAcGFyYW0ge3N0cmluZyB8fCBET00gbm9kZX0gc2VsZWN0b3IgLSBFbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBuYXZTZWxlY3RvciAtIE5hdiBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50U2VsZWN0b3IgLSBDb250ZW50IGVsZW1lbnQgc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGl0ZW1TZWxlY3RvciAtIEl0ZW1zIHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBidXR0b25MZWZ0U2VsZWN0b3IgLSBMZWZ0IGJ1dHRvbiBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uUmlnaHRTZWxlY3RvciAtIFJpZ2h0IGJ1dHRvbiBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge2ludGVnZXIgfHwgc3RyaW5nfSBzY3JvbGxTdGVwIC0gQW1vdW50IHRvIHNjcm9sbCBvbiBidXR0b24gY2xpY2suICdhdmVyYWdlJyBnZXRzIHRoZSBhdmVyYWdlIGxpbmsgd2lkdGguXG4qL1xuXG5jb25zdCBQcmlvcml0eU5hdlNjcm9sbGVyID0gZnVuY3Rpb24oe1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyJyxcbiAgICBuYXZTZWxlY3RvcjogbmF2U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1uYXYnLFxuICAgIGNvbnRlbnRTZWxlY3RvcjogY29udGVudFNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItY29udGVudCcsXG4gICAgaXRlbVNlbGVjdG9yOiBpdGVtU2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1pdGVtJyxcbiAgICBidXR0b25MZWZ0U2VsZWN0b3I6IGJ1dHRvbkxlZnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWJ0bi0tbGVmdCcsXG4gICAgYnV0dG9uUmlnaHRTZWxlY3RvcjogYnV0dG9uUmlnaHRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWJ0bi0tcmlnaHQnLFxuICAgIHNjcm9sbFN0ZXA6IHNjcm9sbFN0ZXAgPSA4MFxuICB9ID0ge30pIHtcblxuICBjb25zdCBuYXZTY3JvbGxlciA9IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSA6IHNlbGVjdG9yO1xuXG4gIGNvbnN0IHZhbGlkYXRlU2Nyb2xsU3RlcCA9ICgpID0+IHtcbiAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihzY3JvbGxTdGVwKSB8fCBzY3JvbGxTdGVwID09PSAnYXZlcmFnZSc7XG4gIH1cblxuICBpZiAobmF2U2Nyb2xsZXIgPT09IHVuZGVmaW5lZCB8fCBuYXZTY3JvbGxlciA9PT0gbnVsbCB8fCAhdmFsaWRhdGVTY3JvbGxTdGVwKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGlzIHNvbWV0aGluZyB3cm9uZywgY2hlY2sgeW91ciBvcHRpb25zLicpO1xuICB9XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXJOYXYgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKG5hdlNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3Rvcihjb250ZW50U2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckNvbnRlbnRJdGVtcyA9IG5hdlNjcm9sbGVyQ29udGVudC5xdWVyeVNlbGVjdG9yQWxsKGl0ZW1TZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyTGVmdCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoYnV0dG9uTGVmdFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJSaWdodCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoYnV0dG9uUmlnaHRTZWxlY3Rvcik7XG5cbiAgbGV0IHNjcm9sbGluZyA9IGZhbHNlO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IDA7XG4gIGxldCBzY3JvbGxBdmFpbGFibGVSaWdodCA9IDA7XG4gIGxldCBzY3JvbGxpbmdEaXJlY3Rpb24gPSAnJztcbiAgbGV0IHNjcm9sbE92ZXJmbG93ID0gJyc7XG4gIGxldCB0aW1lb3V0O1xuXG5cbiAgLy8gU2V0cyBvdmVyZmxvdyBhbmQgdG9nZ2xlIGJ1dHRvbnMgYWNjb3JkaW5nbHlcbiAgY29uc3Qgc2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBzY3JvbGxPdmVyZmxvdyA9IGdldE92ZXJmbG93KCk7XG4gICAgdG9nZ2xlQnV0dG9ucyhzY3JvbGxPdmVyZmxvdyk7XG4gICAgY2FsY3VsYXRlU2Nyb2xsU3RlcCgpO1xuICB9XG5cblxuICAvLyBEZWJvdW5jZSBzZXR0aW5nIHRoZSBvdmVyZmxvdyB3aXRoIHJlcXVlc3RBbmltYXRpb25GcmFtZVxuICBjb25zdCByZXF1ZXN0U2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGltZW91dCkgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRpbWVvdXQpO1xuXG4gICAgdGltZW91dCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgc2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgLy8gR2V0cyB0aGUgb3ZlcmZsb3cgYXZhaWxhYmxlIG9uIHRoZSBuYXYgc2Nyb2xsZXJcbiAgY29uc3QgZ2V0T3ZlcmZsb3cgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgc2Nyb2xsV2lkdGggPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxXaWR0aDtcbiAgICBsZXQgc2Nyb2xsVmlld3BvcnQgPSBuYXZTY3JvbGxlck5hdi5jbGllbnRXaWR0aDtcbiAgICBsZXQgc2Nyb2xsTGVmdCA9IG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQ7XG5cbiAgICBzY3JvbGxBdmFpbGFibGVMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICBzY3JvbGxBdmFpbGFibGVSaWdodCA9IHNjcm9sbFdpZHRoIC0gKHNjcm9sbFZpZXdwb3J0ICsgc2Nyb2xsTGVmdCk7XG5cbiAgICAvLyAxIGluc3RlYWQgb2YgMCB0byBjb21wZW5zYXRlIGZvciBudW1iZXIgcm91bmRpbmdcbiAgICBsZXQgc2Nyb2xsTGVmdENvbmRpdGlvbiA9IHNjcm9sbEF2YWlsYWJsZUxlZnQgPiAxO1xuICAgIGxldCBzY3JvbGxSaWdodENvbmRpdGlvbiA9IHNjcm9sbEF2YWlsYWJsZVJpZ2h0ID4gMTtcblxuICAgIC8vIGNvbnNvbGUubG9nKHNjcm9sbFdpZHRoLCBzY3JvbGxWaWV3cG9ydCwgc2Nyb2xsQXZhaWxhYmxlTGVmdCwgc2Nyb2xsQXZhaWxhYmxlUmlnaHQpO1xuXG4gICAgaWYgKHNjcm9sbExlZnRDb25kaXRpb24gJiYgc2Nyb2xsUmlnaHRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAnYm90aCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNjcm9sbExlZnRDb25kaXRpb24pIHtcbiAgICAgIHJldHVybiAnbGVmdCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ3JpZ2h0JztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gJ25vbmUnO1xuICAgIH1cblxuICB9XG5cblxuICAvLyBDYWxjdWxhdGVzIHRoZSBzY3JvbGwgc3RlcCBiYXNlZCBvbiB0aGUgd2lkdGggb2YgdGhlIHNjcm9sbGVyIGFuZCB0aGUgbnVtYmVyIG9mIGxpbmtzXG4gIGNvbnN0IGNhbGN1bGF0ZVNjcm9sbFN0ZXAgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnKSB7XG4gICAgICBsZXQgc2Nyb2xsVmlld3BvcnROb1BhZGRpbmcgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxXaWR0aCAtIChwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG5hdlNjcm9sbGVyQ29udGVudCkuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1sZWZ0JykpICsgcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKSkpO1xuXG4gICAgICBsZXQgc2Nyb2xsU3RlcEF2ZXJhZ2UgPSBNYXRoLmZsb29yKHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nIC8gbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMubGVuZ3RoKTtcblxuICAgICAgc2Nyb2xsU3RlcCA9IHNjcm9sbFN0ZXBBdmVyYWdlO1xuICAgIH1cbiAgfVxuXG5cbiAgLy8gTW92ZSB0aGUgc2Nyb2xsZXIgd2l0aCBhIHRyYW5zZm9ybVxuICBjb25zdCBtb3ZlU2Nyb2xsZXIgPSBmdW5jdGlvbihkaXJlY3Rpb24pIHtcblxuICAgIGlmIChzY3JvbGxpbmcgPT09IHRydWUgfHwgKHNjcm9sbE92ZXJmbG93ICE9PSBkaXJlY3Rpb24gJiYgc2Nyb2xsT3ZlcmZsb3cgIT09ICdib3RoJykpIHJldHVybjtcblxuICAgIGxldCBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbFN0ZXA7XG4gICAgbGV0IHNjcm9sbEF2YWlsYWJsZSA9IGRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gc2Nyb2xsQXZhaWxhYmxlTGVmdCA6IHNjcm9sbEF2YWlsYWJsZVJpZ2h0O1xuXG4gICAgLy8gSWYgdGhlcmUgd2lsbCBiZSBsZXNzIHRoYW4gMjUlIG9mIHRoZSBsYXN0IHN0ZXAgdmlzaWJsZSB0aGVuIHNjcm9sbCB0byB0aGUgZW5kXG4gICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IChzY3JvbGxTdGVwICogMS43NSkpIHtcbiAgICAgIHNjcm9sbERpc3RhbmNlID0gc2Nyb2xsQXZhaWxhYmxlO1xuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcbiAgICAgIHNjcm9sbERpc3RhbmNlICo9IC0xO1xuXG4gICAgICBpZiAoc2Nyb2xsQXZhaWxhYmxlIDwgc2Nyb2xsU3RlcCkge1xuICAgICAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc25hcC1hbGlnbi1lbmQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgnICsgc2Nyb2xsRGlzdGFuY2UgKyAncHgpJztcblxuICAgIHNjcm9sbGluZ0RpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICBzY3JvbGxpbmcgPSB0cnVlO1xuICB9XG5cblxuICAvLyBTZXQgdGhlIHNjcm9sbGVyIHBvc2l0aW9uIGFuZCByZW1vdmVzIHRyYW5zZm9ybSwgY2FsbGVkIGFmdGVyIG1vdmVTY3JvbGxlcigpIGluIHRoZSB0cmFuc2l0aW9uZW5kIGV2ZW50XG4gIGNvbnN0IHNldFNjcm9sbGVyUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQsIG51bGwpO1xuICAgIHZhciB0cmFuc2Zvcm0gPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd0cmFuc2Zvcm0nKTtcbiAgICB2YXIgdHJhbnNmb3JtVmFsdWUgPSBNYXRoLmFicyhwYXJzZUludCh0cmFuc2Zvcm0uc3BsaXQoJywnKVs0XSkgfHwgMCk7XG5cbiAgICBpZiAoc2Nyb2xsaW5nRGlyZWN0aW9uID09PSAnbGVmdCcpIHtcbiAgICAgIHRyYW5zZm9ybVZhbHVlICo9IC0xO1xuICAgIH1cblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QuYWRkKCduby10cmFuc2l0aW9uJyk7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LnN0eWxlLnRyYW5zZm9ybSA9ICcnO1xuICAgIG5hdlNjcm9sbGVyTmF2LnNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ICsgdHJhbnNmb3JtVmFsdWU7XG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nLCAnc25hcC1hbGlnbi1lbmQnKTtcblxuICAgIHNjcm9sbGluZyA9IGZhbHNlO1xuICB9XG5cblxuICAvLyBUb2dnbGUgYnV0dG9ucyBkZXBlbmRpbmcgb24gb3ZlcmZsb3dcbiAgY29uc3QgdG9nZ2xlQnV0dG9ucyA9IGZ1bmN0aW9uKG92ZXJmbG93KSB7XG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdsZWZ0Jykge1xuICAgICAgbmF2U2Nyb2xsZXJMZWZ0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG5cbiAgICBpZiAob3ZlcmZsb3cgPT09ICdib3RoJyB8fCBvdmVyZmxvdyA9PT0gJ3JpZ2h0Jykge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlclJpZ2h0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cbiAgfVxuXG5cbiAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgc2V0T3ZlcmZsb3coKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyTmF2LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgIHJlcXVlc3RTZXRPdmVyZmxvdygpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCAoKSA9PiB7XG4gICAgICBzZXRTY3JvbGxlclBvc2l0aW9uKCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlckxlZnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBtb3ZlU2Nyb2xsZXIoJ2xlZnQnKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyUmlnaHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBtb3ZlU2Nyb2xsZXIoJ3JpZ2h0Jyk7XG4gICAgfSk7XG5cbiAgfTtcblxuXG4gIC8vIFNlbGYgaW5pdFxuICBpbml0KCk7XG5cblxuICAvLyBSZXZlYWwgQVBJXG4gIHJldHVybiB7XG4gICAgaW5pdFxuICB9O1xuXG59O1xuXG4vL2V4cG9ydCBkZWZhdWx0IFByaW9yaXR5TmF2U2Nyb2xsZXI7XG4iLCIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcInVzZSBzdHJpY3RcIjt2YXIgX3ZhbGlkRm9ybT1yZXF1aXJlKFwiLi9zcmMvdmFsaWQtZm9ybVwiKTt2YXIgX3ZhbGlkRm9ybTI9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdmFsaWRGb3JtKTtmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iail7cmV0dXJuIG9iaiYmb2JqLl9fZXNNb2R1bGU/b2JqOntkZWZhdWx0Om9ian19d2luZG93LlZhbGlkRm9ybT1fdmFsaWRGb3JtMi5kZWZhdWx0O3dpbmRvdy5WYWxpZEZvcm0udG9nZ2xlSW52YWxpZENsYXNzPV92YWxpZEZvcm0udG9nZ2xlSW52YWxpZENsYXNzO3dpbmRvdy5WYWxpZEZvcm0uaGFuZGxlQ3VzdG9tTWVzc2FnZXM9X3ZhbGlkRm9ybS5oYW5kbGVDdXN0b21NZXNzYWdlczt3aW5kb3cuVmFsaWRGb3JtLmhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5PV92YWxpZEZvcm0uaGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXl9LHtcIi4vc3JjL3ZhbGlkLWZvcm1cIjozfV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOnRydWV9KTtleHBvcnRzLmNsb25lPWNsb25lO2V4cG9ydHMuZGVmYXVsdHM9ZGVmYXVsdHM7ZXhwb3J0cy5pbnNlcnRBZnRlcj1pbnNlcnRBZnRlcjtleHBvcnRzLmluc2VydEJlZm9yZT1pbnNlcnRCZWZvcmU7ZXhwb3J0cy5mb3JFYWNoPWZvckVhY2g7ZXhwb3J0cy5kZWJvdW5jZT1kZWJvdW5jZTtmdW5jdGlvbiBjbG9uZShvYmope3ZhciBjb3B5PXt9O2Zvcih2YXIgYXR0ciBpbiBvYmope2lmKG9iai5oYXNPd25Qcm9wZXJ0eShhdHRyKSljb3B5W2F0dHJdPW9ialthdHRyXX1yZXR1cm4gY29weX1mdW5jdGlvbiBkZWZhdWx0cyhvYmosZGVmYXVsdE9iamVjdCl7b2JqPWNsb25lKG9ianx8e30pO2Zvcih2YXIgayBpbiBkZWZhdWx0T2JqZWN0KXtpZihvYmpba109PT11bmRlZmluZWQpb2JqW2tdPWRlZmF1bHRPYmplY3Rba119cmV0dXJuIG9ian1mdW5jdGlvbiBpbnNlcnRBZnRlcihyZWZOb2RlLG5vZGVUb0luc2VydCl7dmFyIHNpYmxpbmc9cmVmTm9kZS5uZXh0U2libGluZztpZihzaWJsaW5nKXt2YXIgX3BhcmVudD1yZWZOb2RlLnBhcmVudE5vZGU7X3BhcmVudC5pbnNlcnRCZWZvcmUobm9kZVRvSW5zZXJ0LHNpYmxpbmcpfWVsc2V7cGFyZW50LmFwcGVuZENoaWxkKG5vZGVUb0luc2VydCl9fWZ1bmN0aW9uIGluc2VydEJlZm9yZShyZWZOb2RlLG5vZGVUb0luc2VydCl7dmFyIHBhcmVudD1yZWZOb2RlLnBhcmVudE5vZGU7cGFyZW50Lmluc2VydEJlZm9yZShub2RlVG9JbnNlcnQscmVmTm9kZSl9ZnVuY3Rpb24gZm9yRWFjaChpdGVtcyxmbil7aWYoIWl0ZW1zKXJldHVybjtpZihpdGVtcy5mb3JFYWNoKXtpdGVtcy5mb3JFYWNoKGZuKX1lbHNle2Zvcih2YXIgaT0wO2k8aXRlbXMubGVuZ3RoO2krKyl7Zm4oaXRlbXNbaV0saSxpdGVtcyl9fX1mdW5jdGlvbiBkZWJvdW5jZShtcyxmbil7dmFyIHRpbWVvdXQ9dm9pZCAwO3ZhciBkZWJvdW5jZWRGbj1mdW5jdGlvbiBkZWJvdW5jZWRGbigpe2NsZWFyVGltZW91dCh0aW1lb3V0KTt0aW1lb3V0PXNldFRpbWVvdXQoZm4sbXMpfTtyZXR1cm4gZGVib3VuY2VkRm59fSx7fV0sMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOnRydWV9KTtleHBvcnRzLnRvZ2dsZUludmFsaWRDbGFzcz10b2dnbGVJbnZhbGlkQ2xhc3M7ZXhwb3J0cy5oYW5kbGVDdXN0b21NZXNzYWdlcz1oYW5kbGVDdXN0b21NZXNzYWdlcztleHBvcnRzLmhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5PWhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5O2V4cG9ydHMuZGVmYXVsdD12YWxpZEZvcm07dmFyIF91dGlsPXJlcXVpcmUoXCIuL3V0aWxcIik7ZnVuY3Rpb24gdG9nZ2xlSW52YWxpZENsYXNzKGlucHV0LGludmFsaWRDbGFzcyl7aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImludmFsaWRcIixmdW5jdGlvbigpe2lucHV0LmNsYXNzTGlzdC5hZGQoaW52YWxpZENsYXNzKX0pO2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLGZ1bmN0aW9uKCl7aWYoaW5wdXQudmFsaWRpdHkudmFsaWQpe2lucHV0LmNsYXNzTGlzdC5yZW1vdmUoaW52YWxpZENsYXNzKX19KX12YXIgZXJyb3JQcm9wcz1bXCJiYWRJbnB1dFwiLFwicGF0dGVybk1pc21hdGNoXCIsXCJyYW5nZU92ZXJmbG93XCIsXCJyYW5nZVVuZGVyZmxvd1wiLFwic3RlcE1pc21hdGNoXCIsXCJ0b29Mb25nXCIsXCJ0b29TaG9ydFwiLFwidHlwZU1pc21hdGNoXCIsXCJ2YWx1ZU1pc3NpbmdcIixcImN1c3RvbUVycm9yXCJdO2Z1bmN0aW9uIGdldEN1c3RvbU1lc3NhZ2UoaW5wdXQsY3VzdG9tTWVzc2FnZXMpe2N1c3RvbU1lc3NhZ2VzPWN1c3RvbU1lc3NhZ2VzfHx7fTt2YXIgbG9jYWxFcnJvclByb3BzPVtpbnB1dC50eXBlK1wiTWlzbWF0Y2hcIl0uY29uY2F0KGVycm9yUHJvcHMpO3ZhciB2YWxpZGl0eT1pbnB1dC52YWxpZGl0eTtmb3IodmFyIGk9MDtpPGxvY2FsRXJyb3JQcm9wcy5sZW5ndGg7aSsrKXt2YXIgcHJvcD1sb2NhbEVycm9yUHJvcHNbaV07aWYodmFsaWRpdHlbcHJvcF0pe3JldHVybiBpbnB1dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLVwiK3Byb3ApfHxjdXN0b21NZXNzYWdlc1twcm9wXX19fWZ1bmN0aW9uIGhhbmRsZUN1c3RvbU1lc3NhZ2VzKGlucHV0LGN1c3RvbU1lc3NhZ2VzKXtmdW5jdGlvbiBjaGVja1ZhbGlkaXR5KCl7dmFyIG1lc3NhZ2U9aW5wdXQudmFsaWRpdHkudmFsaWQ/bnVsbDpnZXRDdXN0b21NZXNzYWdlKGlucHV0LGN1c3RvbU1lc3NhZ2VzKTtpbnB1dC5zZXRDdXN0b21WYWxpZGl0eShtZXNzYWdlfHxcIlwiKX1pbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIixjaGVja1ZhbGlkaXR5KTtpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW52YWxpZFwiLGNoZWNrVmFsaWRpdHkpfWZ1bmN0aW9uIGhhbmRsZUN1c3RvbU1lc3NhZ2VEaXNwbGF5KGlucHV0LG9wdGlvbnMpe3ZhciB2YWxpZGF0aW9uRXJyb3JDbGFzcz1vcHRpb25zLnZhbGlkYXRpb25FcnJvckNsYXNzLHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzPW9wdGlvbnMudmFsaWRhdGlvbkVycm9yUGFyZW50Q2xhc3MsZXJyb3JQbGFjZW1lbnQ9b3B0aW9ucy5lcnJvclBsYWNlbWVudDtmdW5jdGlvbiBjaGVja1ZhbGlkaXR5KG9wdGlvbnMpe3ZhciBpbnNlcnRFcnJvcj1vcHRpb25zLmluc2VydEVycm9yO3ZhciBwYXJlbnROb2RlPWlucHV0LnBhcmVudE5vZGU7dmFyIGVycm9yTm9kZT1wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoXCIuXCIrdmFsaWRhdGlvbkVycm9yQ2xhc3MpfHxkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2lmKCFpbnB1dC52YWxpZGl0eS52YWxpZCYmaW5wdXQudmFsaWRhdGlvbk1lc3NhZ2Upe2Vycm9yTm9kZS5jbGFzc05hbWU9dmFsaWRhdGlvbkVycm9yQ2xhc3M7ZXJyb3JOb2RlLnRleHRDb250ZW50PWlucHV0LnZhbGlkYXRpb25NZXNzYWdlO2lmKGluc2VydEVycm9yKXtlcnJvclBsYWNlbWVudD09PVwiYmVmb3JlXCI/KDAsX3V0aWwuaW5zZXJ0QmVmb3JlKShpbnB1dCxlcnJvck5vZGUpOigwLF91dGlsLmluc2VydEFmdGVyKShpbnB1dCxlcnJvck5vZGUpO3BhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCh2YWxpZGF0aW9uRXJyb3JQYXJlbnRDbGFzcyl9fWVsc2V7cGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzKTtlcnJvck5vZGUucmVtb3ZlKCl9fWlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLGZ1bmN0aW9uKCl7Y2hlY2tWYWxpZGl0eSh7aW5zZXJ0RXJyb3I6ZmFsc2V9KX0pO2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnZhbGlkXCIsZnVuY3Rpb24oZSl7ZS5wcmV2ZW50RGVmYXVsdCgpO2NoZWNrVmFsaWRpdHkoe2luc2VydEVycm9yOnRydWV9KX0pfXZhciBkZWZhdWx0T3B0aW9ucz17aW52YWxpZENsYXNzOlwiaW52YWxpZFwiLHZhbGlkYXRpb25FcnJvckNsYXNzOlwidmFsaWRhdGlvbi1lcnJvclwiLHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzOlwiaGFzLXZhbGlkYXRpb24tZXJyb3JcIixjdXN0b21NZXNzYWdlczp7fSxlcnJvclBsYWNlbWVudDpcImJlZm9yZVwifTtmdW5jdGlvbiB2YWxpZEZvcm0oZWxlbWVudCxvcHRpb25zKXtpZighZWxlbWVudHx8IWVsZW1lbnQubm9kZU5hbWUpe3Rocm93IG5ldyBFcnJvcihcIkZpcnN0IGFyZyB0byB2YWxpZEZvcm0gbXVzdCBiZSBhIGZvcm0sIGlucHV0LCBzZWxlY3QsIG9yIHRleHRhcmVhXCIpfXZhciBpbnB1dHM9dm9pZCAwO3ZhciB0eXBlPWVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtvcHRpb25zPSgwLF91dGlsLmRlZmF1bHRzKShvcHRpb25zLGRlZmF1bHRPcHRpb25zKTtpZih0eXBlPT09XCJmb3JtXCIpe2lucHV0cz1lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYVwiKTtmb2N1c0ludmFsaWRJbnB1dChlbGVtZW50LGlucHV0cyl9ZWxzZSBpZih0eXBlPT09XCJpbnB1dFwifHx0eXBlPT09XCJzZWxlY3RcInx8dHlwZT09PVwidGV4dGFyZWFcIil7aW5wdXRzPVtlbGVtZW50XX1lbHNle3Rocm93IG5ldyBFcnJvcihcIk9ubHkgZm9ybSwgaW5wdXQsIHNlbGVjdCwgb3IgdGV4dGFyZWEgZWxlbWVudHMgYXJlIHN1cHBvcnRlZFwiKX12YWxpZEZvcm1JbnB1dHMoaW5wdXRzLG9wdGlvbnMpfWZ1bmN0aW9uIGZvY3VzSW52YWxpZElucHV0KGZvcm0saW5wdXRzKXt2YXIgZm9jdXNGaXJzdD0oMCxfdXRpbC5kZWJvdW5jZSkoMTAwLGZ1bmN0aW9uKCl7dmFyIGludmFsaWROb2RlPWZvcm0ucXVlcnlTZWxlY3RvcihcIjppbnZhbGlkXCIpO2lmKGludmFsaWROb2RlKWludmFsaWROb2RlLmZvY3VzKCl9KTsoMCxfdXRpbC5mb3JFYWNoKShpbnB1dHMsZnVuY3Rpb24oaW5wdXQpe3JldHVybiBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW52YWxpZFwiLGZvY3VzRmlyc3QpfSl9ZnVuY3Rpb24gdmFsaWRGb3JtSW5wdXRzKGlucHV0cyxvcHRpb25zKXt2YXIgaW52YWxpZENsYXNzPW9wdGlvbnMuaW52YWxpZENsYXNzLGN1c3RvbU1lc3NhZ2VzPW9wdGlvbnMuY3VzdG9tTWVzc2FnZXM7KDAsX3V0aWwuZm9yRWFjaCkoaW5wdXRzLGZ1bmN0aW9uKGlucHV0KXt0b2dnbGVJbnZhbGlkQ2xhc3MoaW5wdXQsaW52YWxpZENsYXNzKTtoYW5kbGVDdXN0b21NZXNzYWdlcyhpbnB1dCxjdXN0b21NZXNzYWdlcyk7aGFuZGxlQ3VzdG9tTWVzc2FnZURpc3BsYXkoaW5wdXQsb3B0aW9ucyl9KX19LHtcIi4vdXRpbFwiOjJ9XX0se30sWzFdKTsiLCIvKipcbiAqIERvIHRoZXNlIHRoaW5ncyBhcyBxdWlja2x5IGFzIHBvc3NpYmxlOyB3ZSBtaWdodCBoYXZlIENTUyBvciBlYXJseSBzY3JpcHRzIHRoYXQgcmVxdWlyZSBvbiBpdFxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cbmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAnbm8tanMnICk7XG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ2pzJyApO1xuIiwiLyoqXG4gKiBUaGlzIGlzIHVzZWQgdG8gY2F1c2UgR29vZ2xlIEFuYWx5dGljcyBldmVudHMgdG8gcnVuXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG5mdW5jdGlvbiBtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApIHtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGdhICkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB2YWx1ZSApIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdhKCAnc2VuZCcsIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsLCB2YWx1ZSApO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEgJiYgJycgIT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS51cmxfYWNjZXNzX2xldmVsICkge1xuXHRcdHZhciB0eXBlID0gJ2V2ZW50Jztcblx0XHR2YXIgY2F0ZWdvcnkgPSAnTWVtYmVyIENvbnRlbnQnO1xuXHRcdHZhciBsYWJlbCA9IGxvY2F0aW9uLnBhdGhuYW1lOyAvLyBpIHRoaW5rIHdlIGNvdWxkIHBvc3NpYmx5IHB1dCBzb21lIGdyb3VwaW5nIGhlcmUsIGJ1dCB3ZSBkb24ndCBuZWNlc3NhcmlseSBoYXZlIGFjY2VzcyB0byBvbmUgYW5kIG1heWJlIGl0J3Mgbm90IHdvcnRod2hpbGUgeWV0XG5cdFx0dmFyIGFjdGlvbiA9ICdCbG9ja2VkJztcblx0XHRpZiAoIHRydWUgPT09IG1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YS5jdXJyZW50X3VzZXIuY2FuX2FjY2VzcyApIHtcblx0XHRcdGFjdGlvbiA9ICdTaG93bic7XG5cdFx0fVxuXHRcdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggdHlwZSwgY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwgKTtcblx0fVxufSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBzaGFyaW5nIGNvbnRlbnRcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuLy8gdHJhY2sgYSBzaGFyZSB2aWEgYW5hbHl0aWNzIGV2ZW50XG5mdW5jdGlvbiB0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiA9ICcnICkge1xuXG5cdC8vIGlmIGEgbm90IGxvZ2dlZCBpbiB1c2VyIHRyaWVzIHRvIGVtYWlsLCBkb24ndCBjb3VudCB0aGF0IGFzIGEgc2hhcmVcblx0aWYgKCAhIGpRdWVyeSggJ2JvZHknICkuaGFzQ2xhc3MoICdsb2dnZWQtaW4nICkgJiYgJ0VtYWlsJyA9PT0gdGV4dCApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgY2F0ZWdvcnkgPSAnU2hhcmUnO1xuXHRpZiAoICcnICE9PSBwb3NpdGlvbiApIHtcblx0XHRjYXRlZ29yeSA9ICdTaGFyZSAtICcgKyBwb3NpdGlvbjtcblx0fVxuXG5cdC8vIHRyYWNrIGFzIGFuIGV2ZW50LCBhbmQgYXMgc29jaWFsIGlmIGl0IGlzIHR3aXR0ZXIgb3IgZmJcblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCBjYXRlZ29yeSwgdGV4dCwgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGdhICkge1xuXHRcdGlmICggJ0ZhY2Vib29rJyA9PT0gdGV4dCB8fCAnVHdpdHRlcicgPT09IHRleHQgKSB7XG5cdFx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgKSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnU2hhcmUnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Z2EoICdzZW5kJywgJ3NvY2lhbCcsIHRleHQsICdUd2VldCcsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybjtcblx0fVxufVxuXG4vLyBjb3B5IHRoZSBjdXJyZW50IFVSTCB0byB0aGUgdXNlcidzIGNsaXBib2FyZFxuZnVuY3Rpb24gY29weUN1cnJlbnRVUkwoKSB7XG5cdHZhciBkdW1teSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdpbnB1dCcgKSxcblx0XHR0ZXh0ID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGR1bW15ICk7XG5cdGR1bW15LnZhbHVlID0gdGV4dDtcblx0ZHVtbXkuc2VsZWN0KCk7XG5cdGRvY3VtZW50LmV4ZWNDb21tYW5kKCAnY29weScgKTtcblx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCggZHVtbXkgKTtcbn1cblxuLy8gdG9wIHNoYXJlIGJ1dHRvbiBjbGlja1xuJCggJy5tLWVudHJ5LXNoYXJlLXRvcCBhJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0dmFyIHRleHQgPSAkKCB0aGlzICkuZGF0YSggJ3NoYXJlLWFjdGlvbicgKTtcblx0dmFyIHBvc2l0aW9uID0gJ3RvcCc7XG5cdHRyYWNrU2hhcmUoIHRleHQsIHBvc2l0aW9uICk7XG59ICk7XG5cbi8vIHdoZW4gdGhlIHByaW50IGJ1dHRvbiBpcyBjbGlja2VkXG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtcHJpbnQgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0d2luZG93LnByaW50KCk7XG59ICk7XG5cbi8vIHdoZW4gdGhlIHJlcHVibGlzaCBidXR0b24gaXMgY2xpY2tlZFxuLy8gdGhlIHBsdWdpbiBjb250cm9scyB0aGUgcmVzdCwgYnV0IHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRoZSBkZWZhdWx0IGV2ZW50IGRvZXNuJ3QgZmlyZVxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXJlcHVibGlzaCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xufSApO1xuXG4vLyB3aGVuIHRoZSBjb3B5IGxpbmsgYnV0dG9uIGlzIGNsaWNrZWRcbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1jb3B5LXVybCBhJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0Y29weUN1cnJlbnRVUkwoKTtcblx0dGxpdGUuc2hvdyggKCBlLnRhcmdldCApLCB7IGdyYXY6ICd3JyB9ICk7XG5cdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdHRsaXRlLmhpZGUoICggZS50YXJnZXQgKSApO1xuXHR9LCAzMDAwICk7XG5cdHJldHVybiBmYWxzZTtcbn0gKTtcblxuLy8gd2hlbiBzaGFyaW5nIHZpYSBmYWNlYm9vaywgdHdpdHRlciwgb3IgZW1haWwsIG9wZW4gdGhlIGRlc3RpbmF0aW9uIHVybCBpbiBhIG5ldyB3aW5kb3dcbiQoICcubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS1mYWNlYm9vayBhLCAubS1lbnRyeS1zaGFyZSAuYS1zaGFyZS10d2l0dGVyIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWVtYWlsIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdHZhciB1cmwgPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cdHdpbmRvdy5vcGVuKCB1cmwsICdfYmxhbmsnICk7XG59ICk7XG4iLCIvKipcbiAqIEZpbGUgbmF2aWdhdGlvbi5qcy5cbiAqXG4gKiBOYXZpZ2F0aW9uIHNjcmlwdHMuIEluY2x1ZGVzIG1vYmlsZSBvciB0b2dnbGUgYmVoYXZpb3IsIGFuYWx5dGljcyB0cmFja2luZyBvZiBzcGVjaWZpYyBtZW51cy5cbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICovXG5cbmZ1bmN0aW9uIHNldHVwUHJpbWFyeU5hdigpIHtcblx0Y29uc3QgcHJpbWFyeU5hdlRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1saW5rcycgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHByaW1hcnlOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbmF2IGJ1dHRvbicgKTtcblx0aWYgKCBudWxsICE9PSBwcmltYXJ5TmF2VG9nZ2xlICkge1xuXHRcdHByaW1hcnlOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByaW1hcnlOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRjb25zdCB1c2VyTmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItbWlubnBvc3QtYWNjb3VudCB1bCcgKSxcblx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHR9ICk7XG5cblx0dmFyIHVzZXJOYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnlvdXItbWlubnBvc3QtYWNjb3VudCA+IGEnICk7XG5cdGlmICggbnVsbCAhPT0gdXNlck5hdlRvZ2dsZSApIHtcblx0XHR1c2VyTmF2VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSB0aGlzLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25TaG93KCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0dmFyIHRhcmdldCAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgLm0tZm9ybS1zZWFyY2ggZmllbGRzZXQgLmEtYnV0dG9uLXNlbnRlbmNlJyApO1xuXHRpZiAoIG51bGwgIT09IHRhcmdldCApIHtcblx0XHR2YXIgZGl2ICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRkaXYuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJhLWNsb3NlLWJ1dHRvbiBhLWNsb3NlLXNlYXJjaFwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nO1xuXHRcdHZhciBmcmFnbWVudCAgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0ZGl2LnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuXHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG5cblx0XHRjb25zdCBzZWFyY2hUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdFx0ZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLW1lbnUtcHJpbWFyeS1hY3Rpb25zIC5tLWZvcm0tc2VhcmNoJyApLFxuXHRcdFx0dmlzaWJsZUNsYXNzOiAnaXMtb3BlbicsXG5cdFx0XHRkaXNwbGF5VmFsdWU6ICdmbGV4J1xuXHRcdH0gKTtcblxuXHRcdHZhciBzZWFyY2hWaXNpYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ2xpLnNlYXJjaCA+IGEnICk7XG5cdFx0c2VhcmNoVmlzaWJsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHR2YXIgc2VhcmNoQ2xvc2UgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLXNlYXJjaCcgKTtcblx0XHRzZWFyY2hDbG9zZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHQvLyBlc2NhcGUga2V5IHByZXNzXG5cdCQoIGRvY3VtZW50ICkua2V5dXAoIGZ1bmN0aW9uKCBlICkge1xuXHRcdGlmICggMjcgPT09IGUua2V5Q29kZSApIHtcblx0XHRcdGxldCBwcmltYXJ5TmF2RXhwYW5kZWQgPSAndHJ1ZScgPT09IHByaW1hcnlOYXZUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGxldCB1c2VyTmF2RXhwYW5kZWQgPSAndHJ1ZScgPT09IHVzZXJOYXZUb2dnbGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGxldCBzZWFyY2hJc1Zpc2libGUgPSAndHJ1ZScgPT09IHNlYXJjaFZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2YgcHJpbWFyeU5hdkV4cGFuZGVkICYmIHRydWUgPT09IHByaW1hcnlOYXZFeHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRvZ2dsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBwcmltYXJ5TmF2RXhwYW5kZWQgKTtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiB1c2VyTmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gdXNlck5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHR1c2VyTmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHVzZXJOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHR1c2VyTmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHNlYXJjaElzVmlzaWJsZSAmJiB0cnVlID09PSBzZWFyY2hJc1Zpc2libGUgKSB7XG5cdFx0XHRcdHNlYXJjaFZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgc2VhcmNoSXNWaXNpYmxlICk7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufVxuXG5mdW5jdGlvbiBzZXR1cFNjcm9sbE5hdiggc2VsZWN0b3IsIG5hdlNlbGVjdG9yLCBjb250ZW50U2VsZWN0b3IgKSB7XG5cblx0dmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG5cdHZhciBpc0lFID0gL01TSUV8VHJpZGVudC8udGVzdCggdWEgKTtcblx0aWYgKCBpc0lFICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIEluaXQgd2l0aCBhbGwgb3B0aW9ucyBhdCBkZWZhdWx0IHNldHRpbmdcblx0Y29uc3QgcHJpb3JpdHlOYXZTY3JvbGxlckRlZmF1bHQgPSBQcmlvcml0eU5hdlNjcm9sbGVyKCB7XG5cdFx0c2VsZWN0b3I6IHNlbGVjdG9yLFxuXHRcdG5hdlNlbGVjdG9yOiBuYXZTZWxlY3Rvcixcblx0XHRjb250ZW50U2VsZWN0b3I6IGNvbnRlbnRTZWxlY3Rvcixcblx0XHRpdGVtU2VsZWN0b3I6ICdsaSwgYScsXG5cdFx0YnV0dG9uTGVmdFNlbGVjdG9yOiAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuXHRcdGJ1dHRvblJpZ2h0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tcmlnaHQnXG5cblx0XHQvL3Njcm9sbFN0ZXA6ICdhdmVyYWdlJ1xuXHR9ICk7XG5cblx0Ly8gSW5pdCBtdWx0aXBsZSBuYXYgc2Nyb2xsZXJzIHdpdGggdGhlIHNhbWUgb3B0aW9uc1xuXHQvKmxldCBuYXZTY3JvbGxlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmF2LXNjcm9sbGVyJyk7XG5cblx0bmF2U2Nyb2xsZXJzLmZvckVhY2goKGN1cnJlbnRWYWx1ZSwgY3VycmVudEluZGV4KSA9PiB7XG5cdCAgUHJpb3JpdHlOYXZTY3JvbGxlcih7XG5cdCAgICBzZWxlY3RvcjogY3VycmVudFZhbHVlXG5cdCAgfSk7XG5cdH0pOyovXG59XG5cbnNldHVwUHJpbWFyeU5hdigpO1xuXG5pZiAoIDAgPCAkKCAnLm0tc3ViLW5hdmlnYXRpb24nICkubGVuZ3RoICkge1xuXHRzZXR1cFNjcm9sbE5hdiggJy5tLXN1Yi1uYXZpZ2F0aW9uJywgJy5tLXN1Ym5hdi1uYXZpZ2F0aW9uJywgJy5tLW1lbnUtc3ViLW5hdmlnYXRpb24nICk7XG59XG5pZiAoIDAgPCAkKCAnLm0tcGFnaW5hdGlvbi1uYXZpZ2F0aW9uJyApLmxlbmd0aCApIHtcblx0c2V0dXBTY3JvbGxOYXYoICcubS1wYWdpbmF0aW9uLW5hdmlnYXRpb24nLCAnLm0tcGFnaW5hdGlvbi1jb250YWluZXInLCAnLm0tcGFnaW5hdGlvbi1saXN0JyApO1xufVxuXG4kKCAnYScsICQoICcuby1zaXRlLXNpZGViYXInICkgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdHZhciB3aWRnZXRUaXRsZSAgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcubS13aWRnZXQnICkuZmluZCggJ2gzJyApLnRleHQoKTtcblx0dmFyIHpvbmVUaXRsZSAgICAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXpvbmUnICkuZmluZCggJy5hLXpvbmUtdGl0bGUnICkudGV4dCgpO1xuXHR2YXIgc2lkZWJhclNlY3Rpb25UaXRsZSA9ICcnO1xuXHRpZiAoICcnICE9PSB3aWRnZXRUaXRsZSApIHtcblx0XHRzaWRlYmFyU2VjdGlvblRpdGxlID0gd2lkZ2V0VGl0bGU7XG5cdH0gZWxzZSBpZiAoICcnICE9PSB6b25lVGl0bGUgKSB7XG5cdFx0c2lkZWJhclNlY3Rpb25UaXRsZSA9IHpvbmVUaXRsZTtcblx0fVxuXHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoICdldmVudCcsICdTaWRlYmFyIExpbmsnLCAnQ2xpY2snLCBzaWRlYmFyU2VjdGlvblRpdGxlICk7XG59ICk7XG5cbiQoICdhJywgJCggJy50b2RheW9ubWlubnBvc3QnICkgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ0dsZWFuIExpbms6IFRvZGF5IG9uIE1pbm5Qb3N0JywgJ0NsaWNrJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcbn0gKTtcblxuJCggJ2EnLCAkKCAnLm0tcmVsYXRlZCcgKSApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0bXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCAnZXZlbnQnLCAnUmVsYXRlZCBTZWN0aW9uIExpbmsnLCAnQ2xpY2snLCBsb2NhdGlvbi5wYXRobmFtZSApO1xufSApO1xuIiwiLyoqXG4gKiBNZXRob2RzIGZvciBmb3Jtc1xuICpcbiAqIFRoaXMgZmlsZSBkb2VzIHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG5qUXVlcnkuZm4udGV4dE5vZGVzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNvbnRlbnRzKCkuZmlsdGVyKCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKCB0aGlzLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSAmJiAnJyAhPT0gdGhpcy5ub2RlVmFsdWUudHJpbSgpICk7XG5cdH0gKTtcbn07XG5cbmZ1bmN0aW9uIGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoIGFjdGlvbiApIHtcblx0dmFyIG1hcmt1cCA9ICc8bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLWZvcm0tY29uZmlybVwiPjxsYWJlbD5BcmUgeW91IHN1cmU/IDxhIGlkPVwiYS1jb25maXJtLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ZZXM8L2E+IHwgPGEgaWQ9XCJhLXN0b3AtJyArIGFjdGlvbiArICdcIiBocmVmPVwiI1wiPk5vPC9hPjwvbGFiZWw+PC9saT4nO1xuXHRyZXR1cm4gbWFya3VwO1xufVxuXG5mdW5jdGlvbiBtYW5hZ2VFbWFpbHMoKSB7XG5cdHZhciBmb3JtICAgICAgICAgICAgICAgPSAkKCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScgKTtcblx0dmFyIHJlc3RSb290ICAgICAgICAgICA9IHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Quc2l0ZV91cmwgKyB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnJlc3RfbmFtZXNwYWNlO1xuXHR2YXIgZnVsbFVybCAgICAgICAgICAgID0gcmVzdFJvb3QgKyAnLycgKyAndXBkYXRlLXVzZXIvJztcblx0dmFyIGNvbmZpcm1DaGFuZ2UgICAgICA9ICcnO1xuXHR2YXIgbmV4dEVtYWlsQ291bnQgICAgID0gMTtcblx0dmFyIG5ld1ByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgb2xkUHJpbWFyeUVtYWlsICAgID0gJyc7XG5cdHZhciBwcmltYXJ5SWQgICAgICAgICAgPSAnJztcblx0dmFyIGVtYWlsVG9SZW1vdmUgICAgICA9ICcnO1xuXHR2YXIgY29uc29saWRhdGVkRW1haWxzID0gW107XG5cdHZhciBuZXdFbWFpbHMgICAgICAgICAgPSBbXTtcblx0dmFyIGFqYXhGb3JtRGF0YSAgICAgICA9ICcnO1xuXHR2YXIgdGhhdCAgICAgICAgICAgICAgID0gJyc7XG5cblx0Ly8gc3RhcnQgb3V0IHdpdGggbm8gcHJpbWFyeS9yZW1vdmFscyBjaGVja2VkXG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdC8vIGlmIHRoZXJlIGlzIGEgbGlzdCBvZiBlbWFpbHMgKG5vdCBqdXN0IGEgc2luZ2xlIGZvcm0gZmllbGQpXG5cdGlmICggMCA8ICQoICcubS11c2VyLWVtYWlsLWxpc3QnICkubGVuZ3RoICkge1xuXHRcdG5leHRFbWFpbENvdW50ID0gJCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmxlbmd0aDtcblxuXHRcdC8vIGlmIGEgdXNlciBzZWxlY3RzIGEgbmV3IHByaW1hcnksIG1vdmUgaXQgaW50byB0aGF0IHBvc2l0aW9uXG5cdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLW1ha2UtcHJpbWFyeS1lbWFpbCBpbnB1dFt0eXBlPVwicmFkaW9cIl0nLCBmdW5jdGlvbigpIHtcblxuXHRcdFx0bmV3UHJpbWFyeUVtYWlsID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0b2xkUHJpbWFyeUVtYWlsID0gJCggJyNlbWFpbCcgKS52YWwoKTtcblx0XHRcdHByaW1hcnlJZCAgICAgICA9ICQoIHRoaXMgKS5wcm9wKCAnaWQnICkucmVwbGFjZSggJ3ByaW1hcnlfZW1haWxfJywgJycgKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdwcmltYXJ5LWNoYW5nZScgKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXG5cdFx0XHQvLyQoIHRoaXMgKS5wYXJlbnQoKS5hZnRlciggY29uZmlybUNoYW5nZSApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2EtY29uZmlybS1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIHVzZXIgZmFjaW5nIHZhbHVlc1xuXHRcdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggbmV3UHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjdXNlci1lbWFpbC0nICsgcHJpbWFyeUlkICkudGV4dE5vZGVzKCkuZmlyc3QoKS5yZXBsYWNlV2l0aCggb2xkUHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBtYWluIGhpZGRlbiBmb3JtIHZhbHVlXG5cdFx0XHRcdCQoICcjZW1haWwnICkudmFsKCBuZXdQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyBzdWJtaXQgZm9ybSB2YWx1ZXMuXG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cblx0XHRcdFx0Ly8gdW5jaGVjayB0aGUgcmFkaW8gYnV0dG9uXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHRcdFx0XHQvLyBjaGFuZ2UgdGhlIGZvcm0gdmFsdWVzIHRvIHRoZSBvbGQgcHJpbWFyeSBlbWFpbFxuXHRcdFx0XHQkKCAnI3ByaW1hcnlfZW1haWxfJyArIHByaW1hcnlJZCApLnZhbCggb2xkUHJpbWFyeUVtYWlsICk7XG5cdFx0XHRcdCQoICcjcmVtb3ZlX2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSB0aGUgY29uZmlybSBtZXNzYWdlXG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHR9ICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1wcmltYXJ5LWNoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHQvLyBpZiBhIHVzZXIgcmVtb3ZlcyBhbiBlbWFpbCwgdGFrZSBpdCBhd2F5IGZyb20gdGhlIHZpc3VhbCBhbmQgZnJvbSB0aGUgZm9ybVxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjaGFuZ2UnLCAnLmEtZm9ybS1jYXB0aW9uLmEtcmVtb3ZlLWVtYWlsIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZW1haWxUb1JlbW92ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdGNvbmZpcm1DaGFuZ2UgICA9IGdldENvbmZpcm1DaGFuZ2VNYXJrdXAoICdyZW1vdmFsJyApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSAhPT0gZW1haWxUb1JlbW92ZSApIHtcblx0XHRcdFx0XHRjb25zb2xpZGF0ZWRFbWFpbHMucHVzaCggJCggdGhpcyApLmNvbnRlbnRzKCkuZ2V0KCAwICkubm9kZVZhbHVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gZ2V0IG9yIGRvbid0IGdldCBjb25maXJtYXRpb24gZnJvbSB1c2VyIGZvciByZW1vdmFsXG5cdFx0XHR0aGF0ID0gJCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpO1xuXHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdCApLmhpZGUoKTtcblx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0ICkuc2hvdygpO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCAnYS1wcmUtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2Etc3RvcC1jb25maXJtJyApO1xuXHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnBhcmVudCgpLmFwcGVuZCggY29uZmlybUNoYW5nZSApO1xuXG5cdFx0XHQvLyBpZiBjb25maXJtZWQsIHJlbW92ZSB0aGUgZW1haWwgYW5kIHN1Ym1pdCB0aGUgZm9ybVxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggdGhpcyApLnBhcmVudHMoICdsaScgKS5mYWRlT3V0KCAnbm9ybWFsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLnJlbW92ZSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCAndmFsdWUgaXMgJyArIGNvbnNvbGlkYXRlZEVtYWlscy5qb2luKCAnLCcgKSApO1xuXHRcdFx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cdFx0XHRcdGZvcm0uc3VibWl0KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2xpY2snLCAnI2Etc3RvcC1yZW1vdmFsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8vIGlmIGEgdXNlciB3YW50cyB0byBhZGQgYW4gZW1haWwsIGdpdmUgdGhlbSBhIHByb3Blcmx5IG51bWJlcmVkIGZpZWxkXG5cdCQoICcubS1mb3JtLWVtYWlsJyApLm9uKCAnY2xpY2snLCAnLmEtZm9ybS1jYXB0aW9uLmEtYWRkLWVtYWlsJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCggJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcgKS5iZWZvcmUoICc8ZGl2IGNsYXNzPVwiYS1pbnB1dC13aXRoLWJ1dHRvbiBhLWJ1dHRvbi1zZW50ZW5jZVwiPjxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIGlkPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiIHZhbHVlPVwiXCI+PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgbmFtZT1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBpZD1cImEtYWRkLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIiBjbGFzcz1cImEtYnV0dG9uIGEtYnV0dG9uLWFkZC11c2VyLWVtYWlsXCI+QWRkPC9idXR0b24+PC9kaXY+JyApO1xuXHRcdG5leHRFbWFpbENvdW50Kys7XG5cdH0gKTtcblxuXHQkKCAnaW5wdXRbdHlwZT1zdWJtaXRdJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0XHR2YXIgYnV0dG9uID0gJCggdGhpcyApO1xuXHRcdHZhciBidXR0b25Gb3JtID0gYnV0dG9uLmNsb3Nlc3QoICdmb3JtJyApO1xuXHRcdGJ1dHRvbkZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJywgYnV0dG9uLnZhbCgpICk7XG5cdH0gKTtcblxuXHQkKCAnLm0tZW50cnktY29udGVudCcgKS5vbiggJ3N1Ym1pdCcsICcjYWNjb3VudC1zZXR0aW5ncy1mb3JtJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdHZhciBmb3JtID0gJCggdGhpcyApO1xuXHRcdHZhciBzdWJtaXR0aW5nQnV0dG9uID0gZm9ybS5kYXRhKCAnc3VibWl0dGluZ19idXR0b24nICkgfHwgJyc7XG5cblx0XHQvLyBpZiB0aGVyZSBpcyBubyBzdWJtaXR0aW5nIGJ1dHRvbiwgcGFzcyBpdCBieSBBamF4XG5cdFx0aWYgKCAnJyA9PT0gc3VibWl0dGluZ0J1dHRvbiB8fCAnU2F2ZSBDaGFuZ2VzJyAhPT0gc3VibWl0dGluZ0J1dHRvbiApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhamF4Rm9ybURhdGEgPSBmb3JtLnNlcmlhbGl6ZSgpOyAvL2FkZCBvdXIgb3duIGFqYXggY2hlY2sgYXMgWC1SZXF1ZXN0ZWQtV2l0aCBpcyBub3QgYWx3YXlzIHJlbGlhYmxlXG5cdFx0XHRhamF4Rm9ybURhdGEgPSBhamF4Rm9ybURhdGEgKyAnJnJlc3Q9dHJ1ZSc7XG5cdFx0XHQkLmFqYXgoIHtcblx0XHRcdFx0dXJsOiBmdWxsVXJsLFxuXHRcdFx0XHR0eXBlOiAncG9zdCcsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKCB4aHIgKSB7XG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoICdYLVdQLU5vbmNlJywgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5ub25jZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0XHRkYXRhOiBhamF4Rm9ybURhdGFcblx0XHRcdH0gKS5kb25lKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0bmV3RW1haWxzID0gJCggJ2lucHV0W25hbWU9XCJfY29uc29saWRhdGVkX2VtYWlsc19hcnJheVtdXCJdJyApLm1hcCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0fSApLmdldCgpO1xuXHRcdFx0XHQkLmVhY2goIG5ld0VtYWlscywgZnVuY3Rpb24oIGluZGV4LCB2YWx1ZSApIHtcblx0XHRcdFx0XHRuZXh0RW1haWxDb3VudCA9IG5leHRFbWFpbENvdW50ICsgaW5kZXg7XG5cdFx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5hcHBlbmQoICc8bGkgaWQ9XCJ1c2VyLWVtYWlsLScgKyBuZXh0RW1haWxDb3VudCArICdcIj4nICsgdmFsdWUgKyAnPHVsIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS11c2VyLWVtYWlsLWFjdGlvbnNcIj48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtbWFrZS1wcmltYXJ5LWVtYWlsXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJwcmltYXJ5X2VtYWlsXCIgaWQ9XCJwcmltYXJ5X2VtYWlsXycgKyBuZXh0RW1haWxDb3VudCArICdcIiB2YWx1ZT1cIicgKyB2YWx1ZSArICdcIj48bGFiZWwgZm9yPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPk1ha2UgUHJpbWFyeTwvc21hbGw+PC9sYWJlbD48L2xpPjxsaSBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtcHJlLWNvbmZpcm0gYS1lbWFpbC1wcmVmZXJlbmNlc1wiPjxhIGhyZWY9XCIvbmV3c2xldHRlcnMvP2VtYWlsPScgKyBlbmNvZGVVUklDb21wb25lbnQoIHZhbHVlICkgKyAnXCI+PHNtYWxsPkVtYWlsIFByZWZlcmVuY2VzPC9zbWFsbD48L2E+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtcmVtb3ZlLWVtYWlsXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJyZW1vdmVfZW1haWxbJyArIG5leHRFbWFpbENvdW50ICsgJ11cIiBpZD1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInJlbW92ZV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+PHNtYWxsPlJlbW92ZTwvc21hbGw+PC9sYWJlbD48L2xpPjwvdWw+PC9saT4nICk7XG5cdFx0XHRcdFx0JCggJyNfY29uc29saWRhdGVkX2VtYWlscycgKS52YWwoICQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCkgKyAnLCcgKyB2YWx1ZSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdCQoICcubS1mb3JtLWNoYW5nZS1lbWFpbCAuYS1pbnB1dC13aXRoLWJ1dHRvbicgKS5yZW1vdmUoKTtcblx0XHRcdFx0aWYgKCAwID09PSAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKSAhPT0gJCggJ2lucHV0W25hbWU9XCJlbWFpbFwiXScgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gaXQgd291bGQgYmUgbmljZSB0byBvbmx5IGxvYWQgdGhlIGZvcm0sIGJ1dCB0aGVuIGNsaWNrIGV2ZW50cyBzdGlsbCBkb24ndCB3b3JrXG5cdFx0XHRcdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cdH0gKTtcbn1cblxuZnVuY3Rpb24gYWRkQXV0b1Jlc2l6ZSgpIHtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJ1tkYXRhLWF1dG9yZXNpemVdJyApLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdGVsZW1lbnQuc3R5bGUuYm94U2l6aW5nID0gJ2JvcmRlci1ib3gnO1xuXHRcdHZhciBvZmZzZXQgPSBlbGVtZW50Lm9mZnNldEhlaWdodCAtIGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuXHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQudGFyZ2V0LnN0eWxlLmhlaWdodCA9ICdhdXRvJztcblx0XHRcdGV2ZW50LnRhcmdldC5zdHlsZS5oZWlnaHQgPSBldmVudC50YXJnZXQuc2Nyb2xsSGVpZ2h0ICsgb2Zmc2V0ICsgJ3B4Jztcblx0XHR9ICk7XG5cdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoICdkYXRhLWF1dG9yZXNpemUnICk7XG5cdH0gKTtcbn1cblxuJCggZG9jdW1lbnQgKS5hamF4U3RvcCggZnVuY3Rpb24oKSB7XG5cdHZhciBjb21tZW50QXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcjbGxjX2NvbW1lbnRzJyApO1xuXHRpZiAoIG51bGwgIT09IGNvbW1lbnRBcmVhICkge1xuXHRcdGFkZEF1dG9SZXNpemUoKTtcblx0fVxufSApO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRpZiAoIDAgPCAkKCAnLm0tZm9ybS1hY2NvdW50LXNldHRpbmdzJyApLmxlbmd0aCApIHtcblx0XHRtYW5hZ2VFbWFpbHMoKTtcblx0fVxuXHR2YXIgYXV0b1Jlc2l6ZVRleHRhcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ1tkYXRhLWF1dG9yZXNpemVdJyApO1xuXHRpZiAoIG51bGwgIT09IGF1dG9SZXNpemVUZXh0YXJlYSApIHtcblx0XHRhZGRBdXRvUmVzaXplKCk7XG5cdH1cbn0gKTtcblxudmFyIGZvcm1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWZvcm0nICk7XG5mb3Jtcy5mb3JFYWNoKCBmdW5jdGlvbiAoIGZvcm0gKSB7XG5cdFZhbGlkRm9ybSggZm9ybSwge1xuXHRcdHZhbGlkYXRpb25FcnJvclBhcmVudENsYXNzOiAnbS1oYXMtdmFsaWRhdGlvbi1lcnJvcicsXG5cdFx0dmFsaWRhdGlvbkVycm9yQ2xhc3M6ICdhLXZhbGlkYXRpb24tZXJyb3InLFxuXHRcdGludmFsaWRDbGFzczogJ2EtZXJyb3InLFxuXHRcdGVycm9yUGxhY2VtZW50OiAnYWZ0ZXInXG5cdH0gKVxufSApO1xuXG52YXIgZm9ybSA9ICQoICcubS1mb3JtJyApO1xuLy8gbGlzdGVuIGZvciBgaW52YWxpZGAgZXZlbnRzIG9uIGFsbCBmb3JtIGlucHV0c1xuZm9ybS5maW5kKCAnOmlucHV0JyApLm9uKCAnaW52YWxpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW5wdXQgPSAkKCB0aGlzICk7XG4gICAgLy8gdGhlIGZpcnN0IGludmFsaWQgZWxlbWVudCBpbiB0aGUgZm9ybVxuXHR2YXIgZmlyc3QgPSBmb3JtLmZpbmQoICcuYS1lcnJvcicgKS5maXJzdCgpO1xuXHQvLyB0aGUgZm9ybSBpdGVtIHRoYXQgY29udGFpbnMgaXRcblx0dmFyIGZpcnN0X2hvbGRlciA9IGZpcnN0LnBhcmVudCgpO1xuICAgIC8vIG9ubHkgaGFuZGxlIGlmIHRoaXMgaXMgdGhlIGZpcnN0IGludmFsaWQgaW5wdXRcbiAgICBpZiAoaW5wdXRbMF0gPT09IGZpcnN0WzBdKSB7XG4gICAgICAgIC8vIGhlaWdodCBvZiB0aGUgbmF2IGJhciBwbHVzIHNvbWUgcGFkZGluZyBpZiB0aGVyZSdzIGEgZml4ZWQgbmF2XG4gICAgICAgIC8vdmFyIG5hdmJhckhlaWdodCA9IG5hdmJhci5oZWlnaHQoKSArIDUwXG5cbiAgICAgICAgLy8gdGhlIHBvc2l0aW9uIHRvIHNjcm9sbCB0byAoYWNjb3VudGluZyBmb3IgdGhlIG5hdmJhciBpZiBpdCBleGlzdHMpXG4gICAgICAgIHZhciBlbGVtZW50T2Zmc2V0ID0gZmlyc3RfaG9sZGVyLm9mZnNldCgpLnRvcDtcblxuICAgICAgICAvLyB0aGUgY3VycmVudCBzY3JvbGwgcG9zaXRpb24gKGFjY291bnRpbmcgZm9yIHRoZSBuYXZiYXIpXG4gICAgICAgIHZhciBwYWdlT2Zmc2V0ID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuXG4gICAgICAgIC8vIGRvbid0IHNjcm9sbCBpZiB0aGUgZWxlbWVudCBpcyBhbHJlYWR5IGluIHZpZXdcbiAgICAgICAgaWYgKCBlbGVtZW50T2Zmc2V0ID4gcGFnZU9mZnNldCAmJiBlbGVtZW50T2Zmc2V0IDwgcGFnZU9mZnNldCArIHdpbmRvdy5pbm5lckhlaWdodCApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm90ZTogYXZvaWQgdXNpbmcgYW5pbWF0ZSwgYXMgaXQgcHJldmVudHMgdGhlIHZhbGlkYXRpb24gbWVzc2FnZSBkaXNwbGF5aW5nIGNvcnJlY3RseVxuICAgICAgICAkKCAnaHRtbCwgYm9keScgKS5zY3JvbGxUb3AoIGVsZW1lbnRPZmZzZXQgKTtcbiAgICB9XG59ICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIGNvbW1lbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8vIGJhc2VkIG9uIHdoaWNoIGJ1dHRvbiB3YXMgY2xpY2tlZCwgc2V0IHRoZSB2YWx1ZXMgZm9yIHRoZSBhbmFseXRpY3MgZXZlbnQgYW5kIGNyZWF0ZSBpdFxuZnVuY3Rpb24gdHJhY2tTaG93Q29tbWVudHMoIGFsd2F5cywgaWQsIGNsaWNrVmFsdWUgKSB7XG5cdHZhciBhY3Rpb24gICAgICAgICAgPSAnJztcblx0dmFyIGNhdGVnb3J5UHJlZml4ID0gJyc7XG5cdHZhciBjYXRlZ29yeVN1ZmZpeCA9ICcnO1xuXHR2YXIgcG9zaXRpb24gICAgICAgID0gJyc7XG5cdHBvc2l0aW9uID0gaWQucmVwbGFjZSggJ2Fsd2F5cy1zaG93LWNvbW1lbnRzLScsICcnICk7XG5cdGlmICggJzEnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPbic7XG5cdH0gZWxzZSBpZiAoICcwJyA9PT0gY2xpY2tWYWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5UHJlZml4ID0gJ0Fsd2F5cyAnO1xuXHR9XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24uY2hhckF0KCAwICkudG9VcHBlckNhc2UoKSArIHBvc2l0aW9uLnNsaWNlKCAxICk7XG5cdFx0Y2F0ZWdvcnlTdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnlQcmVmaXggKyAnU2hvdyBDb21tZW50cycgKyBjYXRlZ29yeVN1ZmZpeCwgYWN0aW9uLCBsb2NhdGlvbi5wYXRobmFtZSApO1xufVxuXG4vLyB3aGVuIHNob3dpbmcgY29tbWVudHMgb25jZSwgdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtYnV0dG9uLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dHJhY2tTaG93Q29tbWVudHMoIGZhbHNlLCAnJywgJycgKTtcbn0gKTtcblxuLy8gU2V0IHVzZXIgbWV0YSB2YWx1ZSBmb3IgYWx3YXlzIHNob3dpbmcgY29tbWVudHMgaWYgdGhhdCBidXR0b24gaXMgY2xpY2tlZFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHZhciB0aGF0ID0gJCggdGhpcyApO1xuXHRpZiAoIHRoYXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gZWxzZSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuXHR0cmFja1Nob3dDb21tZW50cyggdHJ1ZSwgdGhhdC5hdHRyKCAnaWQnICksIHRoYXQudmFsKCkgKTtcblxuXHQvLyB3ZSBhbHJlYWR5IGhhdmUgYWpheHVybCBmcm9tIHRoZSB0aGVtZVxuXHQkLmFqYXgoIHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBwYXJhbXMuYWpheHVybCxcblx0XHRkYXRhOiB7XG5cdFx0XHQnYWN0aW9uJzogJ21pbm5wb3N0X2xhcmdvX2xvYWRfY29tbWVudHNfc2V0X3VzZXJfbWV0YScsXG5cdFx0XHQndmFsdWUnOiB0aGF0LnZhbCgpXG5cdFx0fSxcblx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHQkKCAnLmEtYWx3YXlzLXNob3ctY29tbWVudHMtcmVzdWx0JywgdGhhdC5wYXJlbnQoKSApLmh0bWwoIHJlc3BvbnNlLmRhdGEubWVzc2FnZSApO1xuXHRcdFx0aWYgKCB0cnVlID09PSByZXNwb25zZS5kYXRhLnNob3cgKSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDAgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDEgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcbn0gKTtcblxuISAoIGZ1bmN0aW9uKCBkICkge1xuXHRpZiAoICEgZC5jdXJyZW50U2NyaXB0ICkge1xuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0YWN0aW9uOiAnbGxjX2xvYWRfY29tbWVudHMnLFxuXHRcdFx0cG9zdDogJCggJyNsbGNfcG9zdF9pZCcgKS52YWwoKVxuXHRcdH07XG5cblx0XHQvLyBBamF4IHJlcXVlc3QgbGluay5cblx0XHR2YXIgbGxjYWpheHVybCA9ICQoICcjbGxjX2FqYXhfdXJsJyApLnZhbCgpO1xuXG5cdFx0Ly8gRnVsbCB1cmwgdG8gZ2V0IGNvbW1lbnRzIChBZGRpbmcgcGFyYW1ldGVycykuXG5cdFx0dmFyIGNvbW1lbnRVcmwgPSBsbGNhamF4dXJsICsgJz8nICsgJC5wYXJhbSggZGF0YSApO1xuXG5cdFx0Ly8gUGVyZm9ybSBhamF4IHJlcXVlc3QuXG5cdFx0JC5nZXQoIGNvbW1lbnRVcmwsIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdGlmICggJycgIT09IHJlc3BvbnNlICkge1xuXHRcdFx0XHQkKCAnI2xsY19jb21tZW50cycgKS5odG1sKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgY29tbWVudHMgYWZ0ZXIgbGF6eSBsb2FkaW5nLlxuXHRcdFx0XHRpZiAoIHdpbmRvdy5hZGRDb21tZW50ICYmIHdpbmRvdy5hZGRDb21tZW50LmluaXQgKSB7XG5cdFx0XHRcdFx0d2luZG93LmFkZENvbW1lbnQuaW5pdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gR2V0IHRoZSBjb21tZW50IGxpIGlkIGZyb20gdXJsIGlmIGV4aXN0LlxuXHRcdFx0XHR2YXIgY29tbWVudElkID0gZG9jdW1lbnQuVVJMLnN1YnN0ciggZG9jdW1lbnQuVVJMLmluZGV4T2YoICcjY29tbWVudCcgKSApO1xuXG5cdFx0XHRcdC8vIElmIGNvbW1lbnQgaWQgZm91bmQsIHNjcm9sbCB0byB0aGF0IGNvbW1lbnQuXG5cdFx0XHRcdGlmICggLTEgPCBjb21tZW50SWQuaW5kZXhPZiggJyNjb21tZW50JyApICkge1xuXHRcdFx0XHRcdCQoIHdpbmRvdyApLnNjcm9sbFRvcCggJCggY29tbWVudElkICkub2Zmc2V0KCkudG9wICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cbn0oIGRvY3VtZW50ICkgKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgZXZlbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG5jb25zdCB0YXJnZXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5hLWV2ZW50cy1jYWwtbGlua3MnICk7XG50YXJnZXRzLmZvckVhY2goIGZ1bmN0aW9uKCB0YXJnZXQgKSB7XG4gICAgc2V0Q2FsZW5kYXIoIHRhcmdldCApO1xufSk7XG5cbmZ1bmN0aW9uIHNldENhbGVuZGFyKCB0YXJnZXQgKSB7XG4gICAgaWYgKCBudWxsICE9PSB0YXJnZXQgKSB7XG4gICAgICAgIHZhciBsaSAgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnbGknICk7XG4gICAgICAgIGxpLmlubmVySFRNTCAgPSAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImEtY2xvc2UtYnV0dG9uIGEtY2xvc2UtY2FsZW5kYXJcIj48aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT48L2E+JztcbiAgICAgICAgdmFyIGZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgbGkuc2V0QXR0cmlidXRlKCAnY2xhc3MnLCAnYS1jbG9zZS1ob2xkZXInICk7XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBsaSApO1xuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG4gICAgfVxufVxuXG5jb25zdCBjYWxlbmRhcnNWaXNpYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5tLWV2ZW50LWRhdGV0aW1lIGEnICk7XG5jYWxlbmRhcnNWaXNpYmxlLmZvckVhY2goIGZ1bmN0aW9uKCBjYWxlbmRhclZpc2libGUgKSB7XG4gICAgc2hvd0NhbGVuZGFyKCBjYWxlbmRhclZpc2libGUgKTtcbn0pO1xuXG5mdW5jdGlvbiBzaG93Q2FsZW5kYXIoIGNhbGVuZGFyVmlzaWJsZSApIHtcbiAgICBjb25zdCBkYXRlSG9sZGVyID0gY2FsZW5kYXJWaXNpYmxlLmNsb3Nlc3QoICcubS1ldmVudC1kYXRlLWFuZC1jYWxlbmRhcicgKTtcbiAgICBjb25zdCBjYWxlbmRhclRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG4gICAgICAgIGVsZW1lbnQ6IGRhdGVIb2xkZXIucXVlcnlTZWxlY3RvciggJy5hLWV2ZW50cy1jYWwtbGlua3MnICksXG4gICAgICAgIHZpc2libGVDbGFzczogJ2EtZXZlbnRzLWNhbC1saW5rLXZpc2libGUnLFxuICAgICAgICBkaXNwbGF5VmFsdWU6ICdibG9jaydcbiAgICB9ICk7XG5cbiAgICBpZiAoIG51bGwgIT09IGNhbGVuZGFyVmlzaWJsZSApIHtcbiAgICAgICAgY2FsZW5kYXJWaXNpYmxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgbGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBjYWxlbmRhclZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcbiAgICAgICAgICAgIGNhbGVuZGFyVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuICAgICAgICAgICAgaWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcbiAgICAgICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ICk7XG5cbiAgICAgICAgdmFyIGNhbGVuZGFyQ2xvc2UgPSBkYXRlSG9sZGVyLnF1ZXJ5U2VsZWN0b3IoICcuYS1jbG9zZS1jYWxlbmRhcicgKTtcbiAgICAgICAgY2FsZW5kYXJDbG9zZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gY2FsZW5kYXJWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG4gICAgICAgICAgICBjYWxlbmRhclZpc2libGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcbiAgICAgICAgICAgIGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG4gICAgICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApO1xuICAgIH1cbn1cbiJdfQ==
}(jQuery));
