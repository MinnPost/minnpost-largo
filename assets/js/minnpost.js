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

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

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
}); // cause the current page to print

$('.m-entry-share .a-share-print a').click(function (e) {
  e.preventDefault();
  window.print();
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
var target = document.querySelector('.a-events-cal-links');

if (null !== target) {
  var li = document.createElement('li');
  li.innerHTML = '<a href="#" class="a-close-button a-close-calendar"><i class="fas fa-times"></i></a>';
  var fragment = document.createDocumentFragment();
  li.setAttribute('class', 'a-close-holder');
  fragment.appendChild(li);
  target.appendChild(fragment);
}

var calendarTransitioner = transitionHiddenElement({
  element: document.querySelector('.a-events-cal-links'),
  visibleClass: 'a-events-cal-link-visible',
  displayValue: 'block'
});
var calendarVisible = document.querySelector('.m-event-datetime a');

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
  var calendarClose = document.querySelector('.a-close-calendar');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLXRsaXRlLm1pbi5qcyIsIjAyLXRyYW5zaXRpb24taGlkZGVuLmpzIiwiMDMtcHJpb3JpdHktbmF2LXNjcm9sbGVyLmpzIiwiMDAtc3RhcnQuanMiLCIwMS1hbmFseXRpY3MuanMiLCIwMi1zaGFyZS5qcyIsIjAzLW5hdmlnYXRpb24uanMiLCIwNC1mb3Jtcy5qcyIsIjA1LWNvbW1lbnRzLmpzIiwiMDYtY2FsZW5kYXIuanMiXSwibmFtZXMiOlsidGxpdGUiLCJ0IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImkiLCJ0YXJnZXQiLCJuIiwicGFyZW50RWxlbWVudCIsInNob3ciLCJ0b29sdGlwIiwibyIsImhpZGUiLCJsIiwiciIsImNsYXNzTmFtZSIsInMiLCJvZmZzZXRUb3AiLCJvZmZzZXRMZWZ0Iiwib2Zmc2V0UGFyZW50Iiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJkIiwiZiIsImEiLCJzdHlsZSIsInRvcCIsImxlZnQiLCJjcmVhdGVFbGVtZW50IiwiZ3JhdiIsImdldEF0dHJpYnV0ZSIsImlubmVySFRNTCIsImFwcGVuZENoaWxkIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiYm90dG9tIiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJyaWdodCIsImlubmVyV2lkdGgiLCJ0aXRsZSIsInNldEF0dHJpYnV0ZSIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJtb2R1bGUiLCJleHBvcnRzIiwidHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQiLCJlbGVtZW50IiwidmlzaWJsZUNsYXNzIiwid2FpdE1vZGUiLCJ0aW1lb3V0RHVyYXRpb24iLCJoaWRlTW9kZSIsImRpc3BsYXlWYWx1ZSIsImNvbnNvbGUiLCJlcnJvciIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwibGlzdGVuZXIiLCJhcHBseUhpZGRlbkF0dHJpYnV0ZXMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzcGxheSIsInJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMiLCJyZW1vdmVBdHRyaWJ1dGUiLCJ0cmFuc2l0aW9uU2hvdyIsInRpbWVvdXQiLCJyZWZsb3ciLCJjbGFzc0xpc3QiLCJhZGQiLCJ0cmFuc2l0aW9uSGlkZSIsInJlbW92ZSIsInRvZ2dsZSIsImlzSGlkZGVuIiwiaGFzSGlkZGVuQXR0cmlidXRlIiwiaXNEaXNwbGF5Tm9uZSIsImhhc1Zpc2libGVDbGFzcyIsImluY2x1ZGVzIiwiUHJpb3JpdHlOYXZTY3JvbGxlciIsInNlbGVjdG9yIiwibmF2U2VsZWN0b3IiLCJjb250ZW50U2VsZWN0b3IiLCJpdGVtU2VsZWN0b3IiLCJidXR0b25MZWZ0U2VsZWN0b3IiLCJidXR0b25SaWdodFNlbGVjdG9yIiwic2Nyb2xsU3RlcCIsIm5hdlNjcm9sbGVyIiwicXVlcnlTZWxlY3RvciIsInZhbGlkYXRlU2Nyb2xsU3RlcCIsIk51bWJlciIsImlzSW50ZWdlciIsInVuZGVmaW5lZCIsIkVycm9yIiwibmF2U2Nyb2xsZXJOYXYiLCJuYXZTY3JvbGxlckNvbnRlbnQiLCJuYXZTY3JvbGxlckNvbnRlbnRJdGVtcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJuYXZTY3JvbGxlckxlZnQiLCJuYXZTY3JvbGxlclJpZ2h0Iiwic2Nyb2xsaW5nIiwic2Nyb2xsQXZhaWxhYmxlTGVmdCIsInNjcm9sbEF2YWlsYWJsZVJpZ2h0Iiwic2Nyb2xsaW5nRGlyZWN0aW9uIiwic2Nyb2xsT3ZlcmZsb3ciLCJzZXRPdmVyZmxvdyIsImdldE92ZXJmbG93IiwidG9nZ2xlQnV0dG9ucyIsImNhbGN1bGF0ZVNjcm9sbFN0ZXAiLCJyZXF1ZXN0U2V0T3ZlcmZsb3ciLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInNjcm9sbFdpZHRoIiwic2Nyb2xsVmlld3BvcnQiLCJjbGllbnRXaWR0aCIsInNjcm9sbExlZnQiLCJzY3JvbGxMZWZ0Q29uZGl0aW9uIiwic2Nyb2xsUmlnaHRDb25kaXRpb24iLCJzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyIsInBhcnNlSW50IiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImdldFByb3BlcnR5VmFsdWUiLCJzY3JvbGxTdGVwQXZlcmFnZSIsIk1hdGgiLCJmbG9vciIsImxlbmd0aCIsIm1vdmVTY3JvbGxlciIsImRpcmVjdGlvbiIsInNjcm9sbERpc3RhbmNlIiwic2Nyb2xsQXZhaWxhYmxlIiwidHJhbnNmb3JtIiwic2V0U2Nyb2xsZXJQb3NpdGlvbiIsInRyYW5zZm9ybVZhbHVlIiwiYWJzIiwic3BsaXQiLCJvdmVyZmxvdyIsImluaXQiLCJkb2N1bWVudEVsZW1lbnQiLCJtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQiLCJ0eXBlIiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsInZhbHVlIiwiZ2EiLCJldmVudCIsIm1pbm5wb3N0X21lbWJlcnNoaXBfZGF0YSIsInVybF9hY2Nlc3NfbGV2ZWwiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiY3VycmVudF91c2VyIiwiY2FuX2FjY2VzcyIsInRyYWNrU2hhcmUiLCJ0ZXh0IiwicG9zaXRpb24iLCJqUXVlcnkiLCJoYXNDbGFzcyIsImNvcHlDdXJyZW50VVJMIiwiZHVtbXkiLCJocmVmIiwiYm9keSIsInNlbGVjdCIsImV4ZWNDb21tYW5kIiwiJCIsImNsaWNrIiwiZGF0YSIsInByZXZlbnREZWZhdWx0IiwicHJpbnQiLCJ1cmwiLCJhdHRyIiwib3BlbiIsInNldHVwUHJpbWFyeU5hdiIsInByaW1hcnlOYXZUcmFuc2l0aW9uZXIiLCJwcmltYXJ5TmF2VG9nZ2xlIiwiZXhwYW5kZWQiLCJ1c2VyTmF2VHJhbnNpdGlvbmVyIiwidXNlck5hdlRvZ2dsZSIsImRpdiIsImZyYWdtZW50IiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsInNlYXJjaFRyYW5zaXRpb25lciIsInNlYXJjaFZpc2libGUiLCJzZWFyY2hDbG9zZSIsImtleXVwIiwia2V5Q29kZSIsInByaW1hcnlOYXZFeHBhbmRlZCIsInVzZXJOYXZFeHBhbmRlZCIsInNlYXJjaElzVmlzaWJsZSIsInNldHVwU2Nyb2xsTmF2IiwidWEiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJpc0lFIiwidGVzdCIsInByaW9yaXR5TmF2U2Nyb2xsZXJEZWZhdWx0Iiwid2lkZ2V0VGl0bGUiLCJjbG9zZXN0IiwiZmluZCIsInpvbmVUaXRsZSIsInNpZGViYXJTZWN0aW9uVGl0bGUiLCJmbiIsInRleHROb2RlcyIsImNvbnRlbnRzIiwiZmlsdGVyIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwibm9kZVZhbHVlIiwidHJpbSIsImdldENvbmZpcm1DaGFuZ2VNYXJrdXAiLCJtYXJrdXAiLCJtYW5hZ2VFbWFpbHMiLCJmb3JtIiwicmVzdFJvb3QiLCJ1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0Iiwic2l0ZV91cmwiLCJyZXN0X25hbWVzcGFjZSIsImZ1bGxVcmwiLCJjb25maXJtQ2hhbmdlIiwibmV4dEVtYWlsQ291bnQiLCJuZXdQcmltYXJ5RW1haWwiLCJvbGRQcmltYXJ5RW1haWwiLCJwcmltYXJ5SWQiLCJlbWFpbFRvUmVtb3ZlIiwiY29uc29saWRhdGVkRW1haWxzIiwibmV3RW1haWxzIiwiYWpheEZvcm1EYXRhIiwidGhhdCIsInByb3AiLCJvbiIsInZhbCIsInJlcGxhY2UiLCJwYXJlbnQiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiYXBwZW5kIiwiZmlyc3QiLCJyZXBsYWNlV2l0aCIsInN1Ym1pdCIsImVhY2giLCJnZXQiLCJwdXNoIiwicGFyZW50cyIsImZhZGVPdXQiLCJqb2luIiwiYmVmb3JlIiwiYnV0dG9uIiwiYnV0dG9uRm9ybSIsInN1Ym1pdHRpbmdCdXR0b24iLCJzZXJpYWxpemUiLCJhamF4IiwiYmVmb3JlU2VuZCIsInhociIsInNldFJlcXVlc3RIZWFkZXIiLCJub25jZSIsImRhdGFUeXBlIiwiZG9uZSIsIm1hcCIsImluZGV4IiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicmVsb2FkIiwiYWRkQXV0b1Jlc2l6ZSIsImZvckVhY2giLCJib3hTaXppbmciLCJvZmZzZXQiLCJjbGllbnRIZWlnaHQiLCJoZWlnaHQiLCJzY3JvbGxIZWlnaHQiLCJhamF4U3RvcCIsImNvbW1lbnRBcmVhIiwiYXV0b1Jlc2l6ZVRleHRhcmVhIiwidHJhY2tTaG93Q29tbWVudHMiLCJhbHdheXMiLCJpZCIsImNsaWNrVmFsdWUiLCJjYXRlZ29yeVByZWZpeCIsImNhdGVnb3J5U3VmZml4IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImlzIiwicGFyYW1zIiwiYWpheHVybCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImh0bWwiLCJtZXNzYWdlIiwiY3VycmVudFNjcmlwdCIsInBvc3QiLCJsbGNhamF4dXJsIiwiY29tbWVudFVybCIsInBhcmFtIiwiYWRkQ29tbWVudCIsImNvbW1lbnRJZCIsIlVSTCIsInN1YnN0ciIsImluZGV4T2YiLCJzY3JvbGxUb3AiLCJsaSIsImNhbGVuZGFyVHJhbnNpdGlvbmVyIiwiY2FsZW5kYXJWaXNpYmxlIiwiY2FsZW5kYXJDbG9zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxLQUFULENBQWVDLENBQWYsRUFBaUI7QUFBQ0MsRUFBQUEsUUFBUSxDQUFDQyxnQkFBVCxDQUEwQixXQUExQixFQUFzQyxVQUFTQyxDQUFULEVBQVc7QUFBQyxRQUFJQyxDQUFDLEdBQUNELENBQUMsQ0FBQ0UsTUFBUjtBQUFBLFFBQWVDLENBQUMsR0FBQ04sQ0FBQyxDQUFDSSxDQUFELENBQWxCO0FBQXNCRSxJQUFBQSxDQUFDLEtBQUdBLENBQUMsR0FBQyxDQUFDRixDQUFDLEdBQUNBLENBQUMsQ0FBQ0csYUFBTCxLQUFxQlAsQ0FBQyxDQUFDSSxDQUFELENBQTNCLENBQUQsRUFBaUNFLENBQUMsSUFBRVAsS0FBSyxDQUFDUyxJQUFOLENBQVdKLENBQVgsRUFBYUUsQ0FBYixFQUFlLENBQUMsQ0FBaEIsQ0FBcEM7QUFBdUQsR0FBL0g7QUFBaUk7O0FBQUFQLEtBQUssQ0FBQ1MsSUFBTixHQUFXLFVBQVNSLENBQVQsRUFBV0csQ0FBWCxFQUFhQyxD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TUFBSTJPLGFBQWEsR0FBR3pTLFFBQVEsQ0FBQ29GLGFBQVQsQ0FBd0IsbUJBQXhCLENBQXBCO0FBQ0FxTixFQUFBQSxhQUFhLENBQUN4UyxnQkFBZCxDQUFnQyxPQUFoQyxFQUF5QyxVQUFVQyxDQUFWLEVBQWM7QUFDbkRBLElBQUFBLENBQUMsQ0FBQ2dLLGNBQUY7QUFDQSxRQUFJUSxRQUFRLEdBQUcsV0FBVzhILGVBQWUsQ0FBQzVRLFlBQWhCLENBQThCLGVBQTlCLENBQVgsSUFBOEQsS0FBN0U7QUFDQTRRLElBQUFBLGVBQWUsQ0FBQ2xRLFlBQWhCLENBQThCLGVBQTlCLEVBQStDLENBQUVvSSxRQUFqRDs7QUFDQSxRQUFLLFNBQVNBLFFBQWQsRUFBeUI7QUFDckI2SCxNQUFBQSxvQkFBb0IsQ0FBQ3BPLGNBQXJCO0FBQ0gsS0FGRCxNQUVPO0FBQ0hvTyxNQUFBQSxvQkFBb0IsQ0FBQ3pPLGNBQXJCO0FBQ0g7QUFDSixHQVREO0FBVUgiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiB0bGl0ZSh0KXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZSl7dmFyIGk9ZS50YXJnZXQsbj10KGkpO258fChuPShpPWkucGFyZW50RWxlbWVudCkmJnQoaSkpLG4mJnRsaXRlLnNob3coaSxuLCEwKX0pfXRsaXRlLnNob3c9ZnVuY3Rpb24odCxlLGkpe3ZhciBuPVwiZGF0YS10bGl0ZVwiO2U9ZXx8e30sKHQudG9vbHRpcHx8ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiBvKCl7dGxpdGUuaGlkZSh0LCEwKX1mdW5jdGlvbiBsKCl7cnx8KHI9ZnVuY3Rpb24odCxlLGkpe2Z1bmN0aW9uIG4oKXtvLmNsYXNzTmFtZT1cInRsaXRlIHRsaXRlLVwiK3Irczt2YXIgZT10Lm9mZnNldFRvcCxpPXQub2Zmc2V0TGVmdDtvLm9mZnNldFBhcmVudD09PXQmJihlPWk9MCk7dmFyIG49dC5vZmZzZXRXaWR0aCxsPXQub2Zmc2V0SGVpZ2h0LGQ9by5vZmZzZXRIZWlnaHQsZj1vLm9mZnNldFdpZHRoLGE9aStuLzI7by5zdHlsZS50b3A9KFwic1wiPT09cj9lLWQtMTA6XCJuXCI9PT1yP2UrbCsxMDplK2wvMi1kLzIpK1wicHhcIixvLnN0eWxlLmxlZnQ9KFwid1wiPT09cz9pOlwiZVwiPT09cz9pK24tZjpcIndcIj09PXI/aStuKzEwOlwiZVwiPT09cj9pLWYtMTA6YS1mLzIpK1wicHhcIn12YXIgbz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKSxsPWkuZ3Jhdnx8dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRsaXRlXCIpfHxcIm5cIjtvLmlubmVySFRNTD1lLHQuYXBwZW5kQ2hpbGQobyk7dmFyIHI9bFswXXx8XCJcIixzPWxbMV18fFwiXCI7bigpO3ZhciBkPW8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuXCJzXCI9PT1yJiZkLnRvcDwwPyhyPVwiblwiLG4oKSk6XCJuXCI9PT1yJiZkLmJvdHRvbT53aW5kb3cuaW5uZXJIZWlnaHQ/KHI9XCJzXCIsbigpKTpcImVcIj09PXImJmQubGVmdDwwPyhyPVwid1wiLG4oKSk6XCJ3XCI9PT1yJiZkLnJpZ2h0PndpbmRvdy5pbm5lcldpZHRoJiYocj1cImVcIixuKCkpLG8uY2xhc3NOYW1lKz1cIiB0bGl0ZS12aXNpYmxlXCIsb30odCxkLGUpKX12YXIgcixzLGQ7cmV0dXJuIHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLG8pLHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIixvKSx0LnRvb2x0aXA9e3Nob3c6ZnVuY3Rpb24oKXtkPXQudGl0bGV8fHQuZ2V0QXR0cmlidXRlKG4pfHxkLHQudGl0bGU9XCJcIix0LnNldEF0dHJpYnV0ZShuLFwiXCIpLGQmJiFzJiYocz1zZXRUaW1lb3V0KGwsaT8xNTA6MSkpfSxoaWRlOmZ1bmN0aW9uKHQpe2lmKGk9PT10KXtzPWNsZWFyVGltZW91dChzKTt2YXIgZT1yJiZyLnBhcmVudE5vZGU7ZSYmZS5yZW1vdmVDaGlsZChyKSxyPXZvaWQgMH19fX0odCxlKSkuc2hvdygpfSx0bGl0ZS5oaWRlPWZ1bmN0aW9uKHQsZSl7dC50b29sdGlwJiZ0LnRvb2x0aXAuaGlkZShlKX0sXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz10bGl0ZSk7IiwiLyoqIFxuICogTGlicmFyeSBjb2RlXG4gKiBVc2luZyBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9AY2xvdWRmb3VyL3RyYW5zaXRpb24taGlkZGVuLWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCh7XG4gIGVsZW1lbnQsXG4gIHZpc2libGVDbGFzcyxcbiAgd2FpdE1vZGUgPSAndHJhbnNpdGlvbmVuZCcsXG4gIHRpbWVvdXREdXJhdGlvbixcbiAgaGlkZU1vZGUgPSAnaGlkZGVuJyxcbiAgZGlzcGxheVZhbHVlID0gJ2Jsb2NrJ1xufSkge1xuICBpZiAod2FpdE1vZGUgPT09ICd0aW1lb3V0JyAmJiB0eXBlb2YgdGltZW91dER1cmF0aW9uICE9PSAnbnVtYmVyJykge1xuICAgIGNvbnNvbGUuZXJyb3IoYFxuICAgICAgV2hlbiBjYWxsaW5nIHRyYW5zaXRpb25IaWRkZW5FbGVtZW50IHdpdGggd2FpdE1vZGUgc2V0IHRvIHRpbWVvdXQsXG4gICAgICB5b3UgbXVzdCBwYXNzIGluIGEgbnVtYmVyIGZvciB0aW1lb3V0RHVyYXRpb24uXG4gICAgYCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEb24ndCB3YWl0IGZvciBleGl0IHRyYW5zaXRpb25zIGlmIGEgdXNlciBwcmVmZXJzIHJlZHVjZWQgbW90aW9uLlxuICAvLyBJZGVhbGx5IHRyYW5zaXRpb25zIHdpbGwgYmUgZGlzYWJsZWQgaW4gQ1NTLCB3aGljaCBtZWFucyB3ZSBzaG91bGQgbm90IHdhaXRcbiAgLy8gYmVmb3JlIGFkZGluZyBgaGlkZGVuYC5cbiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKScpLm1hdGNoZXMpIHtcbiAgICB3YWl0TW9kZSA9ICdpbW1lZGlhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGxpc3RlbmVyIHRvIGFkZCBgaGlkZGVuYCBhZnRlciBvdXIgYW5pbWF0aW9ucyBjb21wbGV0ZS5cbiAgICogVGhpcyBsaXN0ZW5lciB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgY29tcGxldGluZy5cbiAgICovXG4gIGNvbnN0IGxpc3RlbmVyID0gZSA9PiB7XG4gICAgLy8gQ29uZmlybSBgdHJhbnNpdGlvbmVuZGAgd2FzIGNhbGxlZCBvbiAgb3VyIGBlbGVtZW50YCBhbmQgZGlkbid0IGJ1YmJsZVxuICAgIC8vIHVwIGZyb20gYSBjaGlsZCBlbGVtZW50LlxuICAgIGlmIChlLnRhcmdldCA9PT0gZWxlbWVudCkge1xuICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzID0gKCkgPT4ge1xuICAgIGlmKGhpZGVNb2RlID09PSAnZGlzcGxheScpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbW92ZUhpZGRlbkF0dHJpYnV0ZXMgPSAoKSA9PiB7XG4gICAgaWYoaGlkZU1vZGUgPT09ICdkaXNwbGF5Jykge1xuICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheVZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvblNob3coKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgbGlzdGVuZXIgc2hvdWxkbid0IGJlIGhlcmUgYnV0IGlmIHNvbWVvbmUgc3BhbXMgdGhlIHRvZ2dsZVxuICAgICAgICogb3ZlciBhbmQgb3ZlciByZWFsbHkgZmFzdCBpdCBjYW4gaW5jb3JyZWN0bHkgc3RpY2sgYXJvdW5kLlxuICAgICAgICogV2UgcmVtb3ZlIGl0IGp1c3QgdG8gYmUgc2FmZS5cbiAgICAgICAqL1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgbGlzdGVuZXIpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFNpbWlsYXJseSwgd2UnbGwgY2xlYXIgdGhlIHRpbWVvdXQgaW4gY2FzZSBpdCdzIHN0aWxsIGhhbmdpbmcgYXJvdW5kLlxuICAgICAgICovXG4gICAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgfVxuXG4gICAgICByZW1vdmVIaWRkZW5BdHRyaWJ1dGVzKCk7XG5cbiAgICAgIC8qKlxuICAgICAgICogRm9yY2UgYSBicm93c2VyIHJlLXBhaW50IHNvIHRoZSBicm93c2VyIHdpbGwgcmVhbGl6ZSB0aGVcbiAgICAgICAqIGVsZW1lbnQgaXMgbm8gbG9uZ2VyIGBoaWRkZW5gIGFuZCBhbGxvdyB0cmFuc2l0aW9ucy5cbiAgICAgICAqL1xuICAgICAgY29uc3QgcmVmbG93ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh2aXNpYmxlQ2xhc3MpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBIaWRlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHJhbnNpdGlvbkhpZGUoKSB7XG4gICAgICBpZiAod2FpdE1vZGUgPT09ICd0cmFuc2l0aW9uZW5kJykge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCBsaXN0ZW5lcik7XG4gICAgICB9IGVsc2UgaWYgKHdhaXRNb2RlID09PSAndGltZW91dCcpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgYXBwbHlIaWRkZW5BdHRyaWJ1dGVzKCk7XG4gICAgICAgIH0sIHRpbWVvdXREdXJhdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBseUhpZGRlbkF0dHJpYnV0ZXMoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoaXMgY2xhc3MgdG8gdHJpZ2dlciBvdXIgYW5pbWF0aW9uXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodmlzaWJsZUNsYXNzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSBlbGVtZW50J3MgdmlzaWJpbGl0eVxuICAgICAqL1xuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uU2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUZWxsIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaGlkZGVuIG9yIG5vdC5cbiAgICAgKi9cbiAgICBpc0hpZGRlbigpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGhpZGRlbiBhdHRyaWJ1dGUgZG9lcyBub3QgcmVxdWlyZSBhIHZhbHVlLiBTaW5jZSBhbiBlbXB0eSBzdHJpbmcgaXNcbiAgICAgICAqIGZhbHN5LCBidXQgc2hvd3MgdGhlIHByZXNlbmNlIG9mIGFuIGF0dHJpYnV0ZSB3ZSBjb21wYXJlIHRvIGBudWxsYFxuICAgICAgICovXG4gICAgICBjb25zdCBoYXNIaWRkZW5BdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaGlkZGVuJykgIT09IG51bGw7XG5cbiAgICAgIGNvbnN0IGlzRGlzcGxheU5vbmUgPSBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09ICdub25lJztcblxuICAgICAgY29uc3QgaGFzVmlzaWJsZUNsYXNzID0gWy4uLmVsZW1lbnQuY2xhc3NMaXN0XS5pbmNsdWRlcyh2aXNpYmxlQ2xhc3MpO1xuXG4gICAgICByZXR1cm4gaGFzSGlkZGVuQXR0cmlidXRlIHx8IGlzRGlzcGxheU5vbmUgfHwgIWhhc1Zpc2libGVDbGFzcztcbiAgICB9LFxuXG4gICAgLy8gQSBwbGFjZWhvbGRlciBmb3Igb3VyIGB0aW1lb3V0YFxuICAgIHRpbWVvdXQ6IG51bGxcbiAgfTtcbn0iLCIvKipcbiAgUHJpb3JpdHkrIGhvcml6b250YWwgc2Nyb2xsaW5nIG1lbnUuXG5cbiAgQHBhcmFtIHtPYmplY3R9IG9iamVjdCAtIENvbnRhaW5lciBmb3IgYWxsIG9wdGlvbnMuXG4gICAgQHBhcmFtIHtzdHJpbmcgfHwgRE9NIG5vZGV9IHNlbGVjdG9yIC0gRWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gbmF2U2VsZWN0b3IgLSBOYXYgZWxlbWVudCBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gY29udGVudFNlbGVjdG9yIC0gQ29udGVudCBlbGVtZW50IHNlbGVjdG9yLlxuICAgIEBwYXJhbSB7c3RyaW5nfSBpdGVtU2VsZWN0b3IgLSBJdGVtcyBzZWxlY3Rvci5cbiAgICBAcGFyYW0ge3N0cmluZ30gYnV0dG9uTGVmdFNlbGVjdG9yIC0gTGVmdCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtzdHJpbmd9IGJ1dHRvblJpZ2h0U2VsZWN0b3IgLSBSaWdodCBidXR0b24gc2VsZWN0b3IuXG4gICAgQHBhcmFtIHtpbnRlZ2VyIHx8IHN0cmluZ30gc2Nyb2xsU3RlcCAtIEFtb3VudCB0byBzY3JvbGwgb24gYnV0dG9uIGNsaWNrLiAnYXZlcmFnZScgZ2V0cyB0aGUgYXZlcmFnZSBsaW5rIHdpZHRoLlxuKi9cblxuY29uc3QgUHJpb3JpdHlOYXZTY3JvbGxlciA9IGZ1bmN0aW9uKHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlcicsXG4gICAgbmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItbmF2JyxcbiAgICBjb250ZW50U2VsZWN0b3I6IGNvbnRlbnRTZWxlY3RvciA9ICcubmF2LXNjcm9sbGVyLWNvbnRlbnQnLFxuICAgIGl0ZW1TZWxlY3RvcjogaXRlbVNlbGVjdG9yID0gJy5uYXYtc2Nyb2xsZXItaXRlbScsXG4gICAgYnV0dG9uTGVmdFNlbGVjdG9yOiBidXR0b25MZWZ0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLWxlZnQnLFxuICAgIGJ1dHRvblJpZ2h0U2VsZWN0b3I6IGJ1dHRvblJpZ2h0U2VsZWN0b3IgPSAnLm5hdi1zY3JvbGxlci1idG4tLXJpZ2h0JyxcbiAgICBzY3JvbGxTdGVwOiBzY3JvbGxTdGVwID0gODBcbiAgfSA9IHt9KSB7XG5cbiAgY29uc3QgbmF2U2Nyb2xsZXIgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiBzZWxlY3RvcjtcblxuICBjb25zdCB2YWxpZGF0ZVNjcm9sbFN0ZXAgPSAoKSA9PiB7XG4gICAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIoc2Nyb2xsU3RlcCkgfHwgc2Nyb2xsU3RlcCA9PT0gJ2F2ZXJhZ2UnO1xuICB9XG5cbiAgaWYgKG5hdlNjcm9sbGVyID09PSB1bmRlZmluZWQgfHwgbmF2U2Nyb2xsZXIgPT09IG51bGwgfHwgIXZhbGlkYXRlU2Nyb2xsU3RlcCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGVyZSBpcyBzb21ldGhpbmcgd3JvbmcsIGNoZWNrIHlvdXIgb3B0aW9ucy4nKTtcbiAgfVxuXG4gIGNvbnN0IG5hdlNjcm9sbGVyTmF2ID0gbmF2U2Nyb2xsZXIucXVlcnlTZWxlY3RvcihuYXZTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyQ29udGVudCA9IG5hdlNjcm9sbGVyLnF1ZXJ5U2VsZWN0b3IoY29udGVudFNlbGVjdG9yKTtcbiAgY29uc3QgbmF2U2Nyb2xsZXJDb250ZW50SXRlbXMgPSBuYXZTY3JvbGxlckNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChpdGVtU2VsZWN0b3IpO1xuICBjb25zdCBuYXZTY3JvbGxlckxlZnQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvbkxlZnRTZWxlY3Rvcik7XG4gIGNvbnN0IG5hdlNjcm9sbGVyUmlnaHQgPSBuYXZTY3JvbGxlci5xdWVyeVNlbGVjdG9yKGJ1dHRvblJpZ2h0U2VsZWN0b3IpO1xuXG4gIGxldCBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgbGV0IHNjcm9sbEF2YWlsYWJsZUxlZnQgPSAwO1xuICBsZXQgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSAwO1xuICBsZXQgc2Nyb2xsaW5nRGlyZWN0aW9uID0gJyc7XG4gIGxldCBzY3JvbGxPdmVyZmxvdyA9ICcnO1xuICBsZXQgdGltZW91dDtcblxuXG4gIC8vIFNldHMgb3ZlcmZsb3cgYW5kIHRvZ2dsZSBidXR0b25zIGFjY29yZGluZ2x5XG4gIGNvbnN0IHNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgc2Nyb2xsT3ZlcmZsb3cgPSBnZXRPdmVyZmxvdygpO1xuICAgIHRvZ2dsZUJ1dHRvbnMoc2Nyb2xsT3ZlcmZsb3cpO1xuICAgIGNhbGN1bGF0ZVNjcm9sbFN0ZXAoKTtcbiAgfVxuXG5cbiAgLy8gRGVib3VuY2Ugc2V0dGluZyB0aGUgb3ZlcmZsb3cgd2l0aCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgY29uc3QgcmVxdWVzdFNldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVvdXQpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aW1lb3V0KTtcblxuICAgIHRpbWVvdXQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHNldE92ZXJmbG93KCk7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8vIEdldHMgdGhlIG92ZXJmbG93IGF2YWlsYWJsZSBvbiB0aGUgbmF2IHNjcm9sbGVyXG4gIGNvbnN0IGdldE92ZXJmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNjcm9sbFdpZHRoID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGg7XG4gICAgbGV0IHNjcm9sbFZpZXdwb3J0ID0gbmF2U2Nyb2xsZXJOYXYuY2xpZW50V2lkdGg7XG4gICAgbGV0IHNjcm9sbExlZnQgPSBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0O1xuXG4gICAgc2Nyb2xsQXZhaWxhYmxlTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgc2Nyb2xsQXZhaWxhYmxlUmlnaHQgPSBzY3JvbGxXaWR0aCAtIChzY3JvbGxWaWV3cG9ydCArIHNjcm9sbExlZnQpO1xuXG4gICAgLy8gMSBpbnN0ZWFkIG9mIDAgdG8gY29tcGVuc2F0ZSBmb3IgbnVtYmVyIHJvdW5kaW5nXG4gICAgbGV0IHNjcm9sbExlZnRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVMZWZ0ID4gMTtcbiAgICBsZXQgc2Nyb2xsUmlnaHRDb25kaXRpb24gPSBzY3JvbGxBdmFpbGFibGVSaWdodCA+IDE7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhzY3JvbGxXaWR0aCwgc2Nyb2xsVmlld3BvcnQsIHNjcm9sbEF2YWlsYWJsZUxlZnQsIHNjcm9sbEF2YWlsYWJsZVJpZ2h0KTtcblxuICAgIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uICYmIHNjcm9sbFJpZ2h0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2JvdGgnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxMZWZ0Q29uZGl0aW9uKSB7XG4gICAgICByZXR1cm4gJ2xlZnQnO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY3JvbGxSaWdodENvbmRpdGlvbikge1xuICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuICdub25lJztcbiAgICB9XG5cbiAgfVxuXG5cbiAgLy8gQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHN0ZXAgYmFzZWQgb24gdGhlIHdpZHRoIG9mIHRoZSBzY3JvbGxlciBhbmQgdGhlIG51bWJlciBvZiBsaW5rc1xuICBjb25zdCBjYWxjdWxhdGVTY3JvbGxTdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHNjcm9sbFN0ZXAgPT09ICdhdmVyYWdlJykge1xuICAgICAgbGV0IHNjcm9sbFZpZXdwb3J0Tm9QYWRkaW5nID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsV2lkdGggLSAocGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuYXZTY3JvbGxlckNvbnRlbnQpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctbGVmdCcpKSArIHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpKTtcblxuICAgICAgbGV0IHNjcm9sbFN0ZXBBdmVyYWdlID0gTWF0aC5mbG9vcihzY3JvbGxWaWV3cG9ydE5vUGFkZGluZyAvIG5hdlNjcm9sbGVyQ29udGVudEl0ZW1zLmxlbmd0aCk7XG5cbiAgICAgIHNjcm9sbFN0ZXAgPSBzY3JvbGxTdGVwQXZlcmFnZTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIE1vdmUgdGhlIHNjcm9sbGVyIHdpdGggYSB0cmFuc2Zvcm1cbiAgY29uc3QgbW92ZVNjcm9sbGVyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG5cbiAgICBpZiAoc2Nyb2xsaW5nID09PSB0cnVlIHx8IChzY3JvbGxPdmVyZmxvdyAhPT0gZGlyZWN0aW9uICYmIHNjcm9sbE92ZXJmbG93ICE9PSAnYm90aCcpKSByZXR1cm47XG5cbiAgICBsZXQgc2Nyb2xsRGlzdGFuY2UgPSBzY3JvbGxTdGVwO1xuICAgIGxldCBzY3JvbGxBdmFpbGFibGUgPSBkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IHNjcm9sbEF2YWlsYWJsZUxlZnQgOiBzY3JvbGxBdmFpbGFibGVSaWdodDtcblxuICAgIC8vIElmIHRoZXJlIHdpbGwgYmUgbGVzcyB0aGFuIDI1JSBvZiB0aGUgbGFzdCBzdGVwIHZpc2libGUgdGhlbiBzY3JvbGwgdG8gdGhlIGVuZFxuICAgIGlmIChzY3JvbGxBdmFpbGFibGUgPCAoc2Nyb2xsU3RlcCAqIDEuNzUpKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSA9IHNjcm9sbEF2YWlsYWJsZTtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICBzY3JvbGxEaXN0YW5jZSAqPSAtMTtcblxuICAgICAgaWYgKHNjcm9sbEF2YWlsYWJsZSA8IHNjcm9sbFN0ZXApIHtcbiAgICAgICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NuYXAtYWxpZ24tZW5kJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmF2U2Nyb2xsZXJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRyYW5zaXRpb24nKTtcbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIHNjcm9sbERpc3RhbmNlICsgJ3B4KSc7XG5cbiAgICBzY3JvbGxpbmdEaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgc2Nyb2xsaW5nID0gdHJ1ZTtcbiAgfVxuXG5cbiAgLy8gU2V0IHRoZSBzY3JvbGxlciBwb3NpdGlvbiBhbmQgcmVtb3ZlcyB0cmFuc2Zvcm0sIGNhbGxlZCBhZnRlciBtb3ZlU2Nyb2xsZXIoKSBpbiB0aGUgdHJhbnNpdGlvbmVuZCBldmVudFxuICBjb25zdCBzZXRTY3JvbGxlclBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobmF2U2Nyb2xsZXJDb250ZW50LCBudWxsKTtcbiAgICB2YXIgdHJhbnNmb3JtID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJyk7XG4gICAgdmFyIHRyYW5zZm9ybVZhbHVlID0gTWF0aC5hYnMocGFyc2VJbnQodHJhbnNmb3JtLnNwbGl0KCcsJylbNF0pIHx8IDApO1xuXG4gICAgaWYgKHNjcm9sbGluZ0RpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICB0cmFuc2Zvcm1WYWx1ZSAqPSAtMTtcbiAgICB9XG5cbiAgICBuYXZTY3JvbGxlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnbm8tdHJhbnNpdGlvbicpO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbiAgICBuYXZTY3JvbGxlck5hdi5zY3JvbGxMZWZ0ID0gbmF2U2Nyb2xsZXJOYXYuc2Nyb2xsTGVmdCArIHRyYW5zZm9ybVZhbHVlO1xuICAgIG5hdlNjcm9sbGVyQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCduby10cmFuc2l0aW9uJywgJ3NuYXAtYWxpZ24tZW5kJyk7XG5cbiAgICBzY3JvbGxpbmcgPSBmYWxzZTtcbiAgfVxuXG5cbiAgLy8gVG9nZ2xlIGJ1dHRvbnMgZGVwZW5kaW5nIG9uIG92ZXJmbG93XG4gIGNvbnN0IHRvZ2dsZUJ1dHRvbnMgPSBmdW5jdGlvbihvdmVyZmxvdykge1xuICAgIGlmIChvdmVyZmxvdyA9PT0gJ2JvdGgnIHx8IG92ZXJmbG93ID09PSAnbGVmdCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyTGVmdC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBuYXZTY3JvbGxlckxlZnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKG92ZXJmbG93ID09PSAnYm90aCcgfHwgb3ZlcmZsb3cgPT09ICdyaWdodCcpIHtcbiAgICAgIG5hdlNjcm9sbGVyUmlnaHQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmF2U2Nyb2xsZXJSaWdodC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH1cblxuXG4gIGNvbnN0IGluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgIHNldE92ZXJmbG93KCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgcmVxdWVzdFNldE92ZXJmbG93KCk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlck5hdi5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICByZXF1ZXN0U2V0T3ZlcmZsb3coKTtcbiAgICB9KTtcblxuICAgIG5hdlNjcm9sbGVyQ29udGVudC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgc2V0U2Nyb2xsZXJQb3NpdGlvbigpO1xuICAgIH0pO1xuXG4gICAgbmF2U2Nyb2xsZXJMZWZ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdsZWZ0Jyk7XG4gICAgfSk7XG5cbiAgICBuYXZTY3JvbGxlclJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbW92ZVNjcm9sbGVyKCdyaWdodCcpO1xuICAgIH0pO1xuXG4gIH07XG5cblxuICAvLyBTZWxmIGluaXRcbiAgaW5pdCgpO1xuXG5cbiAgLy8gUmV2ZWFsIEFQSVxuICByZXR1cm4ge1xuICAgIGluaXRcbiAgfTtcblxufTtcblxuLy9leHBvcnQgZGVmYXVsdCBQcmlvcml0eU5hdlNjcm9sbGVyO1xuIiwiLyoqXG4gKiBEbyB0aGVzZSB0aGluZ3MgYXMgcXVpY2tseSBhcyBwb3NzaWJsZTsgd2UgbWlnaHQgaGF2ZSBDU1Mgb3IgZWFybHkgc2NyaXB0cyB0aGF0IHJlcXVpcmUgb24gaXRcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyBub3QgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ25vLWpzJyApO1xuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdqcycgKTtcbiIsIi8qKlxuICogVGhpcyBpcyB1c2VkIHRvIGNhdXNlIEdvb2dsZSBBbmFseXRpY3MgZXZlbnRzIHRvIHJ1blxuICpcbiAqIFRoaXMgZmlsZSBkb2VzIG5vdCByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxuZnVuY3Rpb24gbXBBbmFseXRpY3NUcmFja2luZ0V2ZW50KCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgdmFsdWUgKSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnYSggJ3NlbmQnLCB0eXBlLCBjYXRlZ29yeSwgYWN0aW9uLCBsYWJlbCwgdmFsdWUgKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuO1xuXHR9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YgbWlubnBvc3RfbWVtYmVyc2hpcF9kYXRhICYmICcnICE9PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEudXJsX2FjY2Vzc19sZXZlbCApIHtcblx0XHR2YXIgdHlwZSA9ICdldmVudCc7XG5cdFx0dmFyIGNhdGVnb3J5ID0gJ01lbWJlciBDb250ZW50Jztcblx0XHR2YXIgbGFiZWwgPSBsb2NhdGlvbi5wYXRobmFtZTsgLy8gaSB0aGluayB3ZSBjb3VsZCBwb3NzaWJseSBwdXQgc29tZSBncm91cGluZyBoZXJlLCBidXQgd2UgZG9uJ3QgbmVjZXNzYXJpbHkgaGF2ZSBhY2Nlc3MgdG8gb25lIGFuZCBtYXliZSBpdCdzIG5vdCB3b3J0aHdoaWxlIHlldFxuXHRcdHZhciBhY3Rpb24gPSAnQmxvY2tlZCc7XG5cdFx0aWYgKCB0cnVlID09PSBtaW5ucG9zdF9tZW1iZXJzaGlwX2RhdGEuY3VycmVudF91c2VyLmNhbl9hY2Nlc3MgKSB7XG5cdFx0XHRhY3Rpb24gPSAnU2hvd24nO1xuXHRcdH1cblx0XHRtcEFuYWx5dGljc1RyYWNraW5nRXZlbnQoIHR5cGUsIGNhdGVnb3J5LCBhY3Rpb24sIGxhYmVsICk7XG5cdH1cbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3Igc2hhcmluZyBjb250ZW50XG4gKlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8vIHRyYWNrIGEgc2hhcmUgdmlhIGFuYWx5dGljcyBldmVudFxuZnVuY3Rpb24gdHJhY2tTaGFyZSggdGV4dCwgcG9zaXRpb24gPSAnJyApIHtcblxuXHQvLyBpZiBhIG5vdCBsb2dnZWQgaW4gdXNlciB0cmllcyB0byBlbWFpbCwgZG9uJ3QgY291bnQgdGhhdCBhcyBhIHNoYXJlXG5cdGlmICggISBqUXVlcnkoICdib2R5JyApLmhhc0NsYXNzKCAnbG9nZ2VkLWluJyApICYmICdFbWFpbCcgPT09IHRleHQgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGNhdGVnb3J5ID0gJ1NoYXJlJztcblx0aWYgKCAnJyAhPT0gcG9zaXRpb24gKSB7XG5cdFx0Y2F0ZWdvcnkgPSAnU2hhcmUgLSAnICsgcG9zaXRpb247XG5cdH1cblxuXHQvLyB0cmFjayBhcyBhbiBldmVudCwgYW5kIGFzIHNvY2lhbCBpZiBpdCBpcyB0d2l0dGVyIG9yIGZiXG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnksIHRleHQsIGxvY2F0aW9uLnBhdGhuYW1lICk7XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBnYSApIHtcblx0XHRpZiAoICdGYWNlYm9vaycgPT09IHRleHQgfHwgJ1R3aXR0ZXInID09PSB0ZXh0ICkge1xuXHRcdFx0aWYgKCAnRmFjZWJvb2snID09PSB0ZXh0ICkge1xuXHRcdFx0XHRnYSggJ3NlbmQnLCAnc29jaWFsJywgdGV4dCwgJ1NoYXJlJywgbG9jYXRpb24ucGF0aG5hbWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdhKCAnc2VuZCcsICdzb2NpYWwnLCB0ZXh0LCAnVHdlZXQnLCBsb2NhdGlvbi5wYXRobmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm47XG5cdH1cbn1cblxuLy8gY29weSB0aGUgY3VycmVudCBVUkwgdG8gdGhlIHVzZXIncyBjbGlwYm9hcmRcbmZ1bmN0aW9uIGNvcHlDdXJyZW50VVJMKCkge1xuXHR2YXIgZHVtbXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW5wdXQnICksXG5cdFx0dGV4dCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBkdW1teSApO1xuXHRkdW1teS52YWx1ZSA9IHRleHQ7XG5cdGR1bW15LnNlbGVjdCgpO1xuXHRkb2N1bWVudC5leGVjQ29tbWFuZCggJ2NvcHknICk7XG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoIGR1bW15ICk7XG59XG5cbi8vIHRvcCBzaGFyZSBidXR0b24gY2xpY2tcbiQoICcubS1lbnRyeS1zaGFyZS10b3AgYScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdHZhciB0ZXh0ID0gJCggdGhpcyApLmRhdGEoICdzaGFyZS1hY3Rpb24nICk7XG5cdHZhciBwb3NpdGlvbiA9ICd0b3AnO1xuXHR0cmFja1NoYXJlKCB0ZXh0LCBwb3NpdGlvbiApO1xufSApO1xuXG4vLyBjYXVzZSB0aGUgY3VycmVudCBwYWdlIHRvIHByaW50XG4kKCAnLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtcHJpbnQgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0d2luZG93LnByaW50KCk7XG59ICk7XG5cbi8vIHdoZW4gdGhlIGNvcHkgbGluayBidXR0b24gaXMgY2xpY2tlZFxuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWNvcHktdXJsIGEnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRjb3B5Q3VycmVudFVSTCgpO1xuXHR0bGl0ZS5zaG93KCAoIGUudGFyZ2V0ICksIHsgZ3JhdjogJ3cnIH0gKTtcblx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0dGxpdGUuaGlkZSggKCBlLnRhcmdldCApICk7XG5cdH0sIDMwMDAgKTtcblx0cmV0dXJuIGZhbHNlO1xufSApO1xuXG4vLyB3aGVuIHNoYXJpbmcgdmlhIGZhY2Vib29rLCB0d2l0dGVyLCBvciBlbWFpbCwgb3BlbiB0aGUgZGVzdGluYXRpb24gdXJsIGluIGEgbmV3IHdpbmRvd1xuJCggJy5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLWZhY2Vib29rIGEsIC5tLWVudHJ5LXNoYXJlIC5hLXNoYXJlLXR3aXR0ZXIgYSwgLm0tZW50cnktc2hhcmUgLmEtc2hhcmUtZW1haWwgYScgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdGUucHJldmVudERlZmF1bHQoKTtcblx0dmFyIHVybCA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblx0d2luZG93Lm9wZW4oIHVybCwgJ19ibGFuaycgKTtcbn0gKTtcbiIsIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIE5hdmlnYXRpb24gc2NyaXB0cy4gSW5jbHVkZXMgbW9iaWxlIG9yIHRvZ2dsZSBiZWhhdmlvciwgYW5hbHl0aWNzIHRyYWNraW5nIG9mIHNwZWNpZmljIG1lbnVzLlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKi9cblxuZnVuY3Rpb24gc2V0dXBQcmltYXJ5TmF2KCkge1xuXHRjb25zdCBwcmltYXJ5TmF2VHJhbnNpdGlvbmVyID0gdHJhbnNpdGlvbkhpZGRlbkVsZW1lbnQoIHtcblx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWxpbmtzJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgcHJpbWFyeU5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICduYXYgYnV0dG9uJyApO1xuXHRpZiAoIG51bGwgIT09IHByaW1hcnlOYXZUb2dnbGUgKSB7XG5cdFx0cHJpbWFyeU5hdlRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBleHBhbmRlZCA9ICd0cnVlJyA9PT0gdGhpcy5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBleHBhbmRlZCApO1xuXHRcdFx0aWYgKCB0cnVlID09PSBleHBhbmRlZCApIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJpbWFyeU5hdlRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdGNvbnN0IHVzZXJOYXZUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuXHRcdGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1taW5ucG9zdC1hY2NvdW50IHVsJyApLFxuXHRcdHZpc2libGVDbGFzczogJ2lzLW9wZW4nLFxuXHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdH0gKTtcblxuXHR2YXIgdXNlck5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcueW91ci1taW5ucG9zdC1hY2NvdW50ID4gYScgKTtcblx0aWYgKCBudWxsICE9PSB1c2VyTmF2VG9nZ2xlICkge1xuXHRcdHVzZXJOYXZUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRsZXQgZXhwYW5kZWQgPSAndHJ1ZScgPT09IHRoaXMuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcblx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgZXhwYW5kZWQgKTtcblx0XHRcdGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHR2YXIgdGFyZ2V0ICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJ25hdiAubS1mb3JtLXNlYXJjaCBmaWVsZHNldCAuYS1idXR0b24tc2VudGVuY2UnICk7XG5cdGlmICggbnVsbCAhPT0gdGFyZ2V0ICkge1xuXHRcdHZhciBkaXYgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdGRpdi5pbm5lckhUTUwgPSAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImEtY2xvc2UtYnV0dG9uIGEtY2xvc2Utc2VhcmNoXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9hPic7XG5cdFx0dmFyIGZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRkaXYuc2V0QXR0cmlidXRlKCAnY2xhc3MnLCAnYS1jbG9zZS1ob2xkZXInICk7XG5cdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZCggZnJhZ21lbnQgKTtcblxuXHRcdGNvbnN0IHNlYXJjaFRyYW5zaXRpb25lciA9IHRyYW5zaXRpb25IaWRkZW5FbGVtZW50KCB7XG5cdFx0XHRlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLm0tbWVudS1wcmltYXJ5LWFjdGlvbnMgLm0tZm9ybS1zZWFyY2gnICksXG5cdFx0XHR2aXNpYmxlQ2xhc3M6ICdpcy1vcGVuJyxcblx0XHRcdGRpc3BsYXlWYWx1ZTogJ2ZsZXgnXG5cdFx0fSApO1xuXG5cdFx0dmFyIHNlYXJjaFZpc2libGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnbGkuc2VhcmNoID4gYScgKTtcblx0XHRzZWFyY2hWaXNpYmxlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdHZhciBzZWFyY2hDbG9zZSAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLmEtY2xvc2Utc2VhcmNoJyApO1xuXHRcdHNlYXJjaENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBzZWFyY2hWaXNpYmxlLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgfHwgZmFsc2U7XG5cdFx0XHRzZWFyY2hWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG5cdFx0XHRpZiAoIHRydWUgPT09IGV4cGFuZGVkICkge1xuXHRcdFx0XHRzZWFyY2hUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlYXJjaFRyYW5zaXRpb25lci50cmFuc2l0aW9uU2hvdygpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdC8vIGVzY2FwZSBrZXkgcHJlc3Ncblx0JCggZG9jdW1lbnQgKS5rZXl1cCggZnVuY3Rpb24oIGUgKSB7XG5cdFx0aWYgKCAyNyA9PT0gZS5rZXlDb2RlICkge1xuXHRcdFx0bGV0IHByaW1hcnlOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gcHJpbWFyeU5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHVzZXJOYXZFeHBhbmRlZCA9ICd0cnVlJyA9PT0gdXNlck5hdlRvZ2dsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0bGV0IHNlYXJjaElzVmlzaWJsZSA9ICd0cnVlJyA9PT0gc2VhcmNoVmlzaWJsZS5nZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJyApIHx8IGZhbHNlO1xuXHRcdFx0aWYgKCB1bmRlZmluZWQgIT09IHR5cGVvZiBwcmltYXJ5TmF2RXhwYW5kZWQgJiYgdHJ1ZSA9PT0gcHJpbWFyeU5hdkV4cGFuZGVkICkge1xuXHRcdFx0XHRwcmltYXJ5TmF2VG9nZ2xlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIHByaW1hcnlOYXZFeHBhbmRlZCApO1xuXHRcdFx0XHRwcmltYXJ5TmF2VHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gdHlwZW9mIHVzZXJOYXZFeHBhbmRlZCAmJiB0cnVlID09PSB1c2VyTmF2RXhwYW5kZWQgKSB7XG5cdFx0XHRcdHVzZXJOYXZUb2dnbGUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICEgdXNlck5hdkV4cGFuZGVkICk7XG5cdFx0XHRcdHVzZXJOYXZUcmFuc2l0aW9uZXIudHJhbnNpdGlvbkhpZGUoKTtcblx0XHRcdH1cblx0XHRcdGlmICggdW5kZWZpbmVkICE9PSB0eXBlb2Ygc2VhcmNoSXNWaXNpYmxlICYmIHRydWUgPT09IHNlYXJjaElzVmlzaWJsZSApIHtcblx0XHRcdFx0c2VhcmNoVmlzaWJsZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgISBzZWFyY2hJc1Zpc2libGUgKTtcblx0XHRcdFx0c2VhcmNoVHJhbnNpdGlvbmVyLnRyYW5zaXRpb25IaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIHNldHVwU2Nyb2xsTmF2KCBzZWxlY3RvciwgbmF2U2VsZWN0b3IsIGNvbnRlbnRTZWxlY3RvciApIHtcblxuXHR2YXIgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcblx0dmFyIGlzSUUgPSAvTVNJRXxUcmlkZW50Ly50ZXN0KCB1YSApO1xuXHRpZiAoIGlzSUUgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gSW5pdCB3aXRoIGFsbCBvcHRpb25zIGF0IGRlZmF1bHQgc2V0dGluZ1xuXHRjb25zdCBwcmlvcml0eU5hdlNjcm9sbGVyRGVmYXVsdCA9IFByaW9yaXR5TmF2U2Nyb2xsZXIoIHtcblx0XHRzZWxlY3Rvcjogc2VsZWN0b3IsXG5cdFx0bmF2U2VsZWN0b3I6IG5hdlNlbGVjdG9yLFxuXHRcdGNvbnRlbnRTZWxlY3RvcjogY29udGVudFNlbGVjdG9yLFxuXHRcdGl0ZW1TZWxlY3RvcjogJ2xpLCBhJyxcblx0XHRidXR0b25MZWZ0U2VsZWN0b3I6ICcubmF2LXNjcm9sbGVyLWJ0bi0tbGVmdCcsXG5cdFx0YnV0dG9uUmlnaHRTZWxlY3RvcjogJy5uYXYtc2Nyb2xsZXItYnRuLS1yaWdodCdcblxuXHRcdC8vc2Nyb2xsU3RlcDogJ2F2ZXJhZ2UnXG5cdH0gKTtcblxuXHQvLyBJbml0IG11bHRpcGxlIG5hdiBzY3JvbGxlcnMgd2l0aCB0aGUgc2FtZSBvcHRpb25zXG5cdC8qbGV0IG5hdlNjcm9sbGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYtc2Nyb2xsZXInKTtcblxuXHRuYXZTY3JvbGxlcnMuZm9yRWFjaCgoY3VycmVudFZhbHVlLCBjdXJyZW50SW5kZXgpID0+IHtcblx0ICBQcmlvcml0eU5hdlNjcm9sbGVyKHtcblx0ICAgIHNlbGVjdG9yOiBjdXJyZW50VmFsdWVcblx0ICB9KTtcblx0fSk7Ki9cbn1cblxuc2V0dXBQcmltYXJ5TmF2KCk7XG5cbmlmICggMCA8ICQoICcubS1zdWItbmF2aWdhdGlvbicgKS5sZW5ndGggKSB7XG5cdHNldHVwU2Nyb2xsTmF2KCAnLm0tc3ViLW5hdmlnYXRpb24nLCAnLm0tc3VibmF2LW5hdmlnYXRpb24nLCAnLm0tbWVudS1zdWItbmF2aWdhdGlvbicgKTtcbn1cbmlmICggMCA8ICQoICcubS1wYWdpbmF0aW9uLW5hdmlnYXRpb24nICkubGVuZ3RoICkge1xuXHRzZXR1cFNjcm9sbE5hdiggJy5tLXBhZ2luYXRpb24tbmF2aWdhdGlvbicsICcubS1wYWdpbmF0aW9uLWNvbnRhaW5lcicsICcubS1wYWdpbmF0aW9uLWxpc3QnICk7XG59XG5cbiQoICdhJywgJCggJy5vLXNpdGUtc2lkZWJhcicgKSApLmNsaWNrKCBmdW5jdGlvbigpIHtcblx0dmFyIHdpZGdldFRpdGxlICAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5tLXdpZGdldCcgKS5maW5kKCAnaDMnICkudGV4dCgpO1xuXHR2YXIgem9uZVRpdGxlICAgICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLm0tem9uZScgKS5maW5kKCAnLmEtem9uZS10aXRsZScgKS50ZXh0KCk7XG5cdHZhciBzaWRlYmFyU2VjdGlvblRpdGxlID0gJyc7XG5cdGlmICggJycgIT09IHdpZGdldFRpdGxlICkge1xuXHRcdHNpZGViYXJTZWN0aW9uVGl0bGUgPSB3aWRnZXRUaXRsZTtcblx0fSBlbHNlIGlmICggJycgIT09IHpvbmVUaXRsZSApIHtcblx0XHRzaWRlYmFyU2VjdGlvblRpdGxlID0gem9uZVRpdGxlO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgJ1NpZGViYXIgTGluaycsICdDbGljaycsIHNpZGViYXJTZWN0aW9uVGl0bGUgKTtcbn0gKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgZm9ybXNcbiAqXG4gKiBUaGlzIGZpbGUgZG9lcyByZXF1aXJlIGpRdWVyeS5cbiAqXG4gKi9cblxualF1ZXJ5LmZuLnRleHROb2RlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb250ZW50cygpLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICggdGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgJycgIT09IHRoaXMubm9kZVZhbHVlLnRyaW0oKSApO1xuXHR9ICk7XG59O1xuXG5mdW5jdGlvbiBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCBhY3Rpb24gKSB7XG5cdHZhciBtYXJrdXAgPSAnPGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1mb3JtLWNvbmZpcm1cIj48bGFiZWw+QXJlIHlvdSBzdXJlPyA8YSBpZD1cImEtY29uZmlybS0nICsgYWN0aW9uICsgJ1wiIGhyZWY9XCIjXCI+WWVzPC9hPiB8IDxhIGlkPVwiYS1zdG9wLScgKyBhY3Rpb24gKyAnXCIgaHJlZj1cIiNcIj5ObzwvYT48L2xhYmVsPjwvbGk+Jztcblx0cmV0dXJuIG1hcmt1cDtcbn1cblxuZnVuY3Rpb24gbWFuYWdlRW1haWxzKCkge1xuXHR2YXIgZm9ybSAgICAgICAgICAgICAgID0gJCggJyNhY2NvdW50LXNldHRpbmdzLWZvcm0nICk7XG5cdHZhciByZXN0Um9vdCAgICAgICAgICAgPSB1c2VyX2FjY291bnRfbWFuYWdlbWVudF9yZXN0LnNpdGVfdXJsICsgdXNlcl9hY2NvdW50X21hbmFnZW1lbnRfcmVzdC5yZXN0X25hbWVzcGFjZTtcblx0dmFyIGZ1bGxVcmwgICAgICAgICAgICA9IHJlc3RSb290ICsgJy8nICsgJ3VwZGF0ZS11c2VyLyc7XG5cdHZhciBjb25maXJtQ2hhbmdlICAgICAgPSAnJztcblx0dmFyIG5leHRFbWFpbENvdW50ICAgICA9IDE7XG5cdHZhciBuZXdQcmltYXJ5RW1haWwgICAgPSAnJztcblx0dmFyIG9sZFByaW1hcnlFbWFpbCAgICA9ICcnO1xuXHR2YXIgcHJpbWFyeUlkICAgICAgICAgID0gJyc7XG5cdHZhciBlbWFpbFRvUmVtb3ZlICAgICAgPSAnJztcblx0dmFyIGNvbnNvbGlkYXRlZEVtYWlscyA9IFtdO1xuXHR2YXIgbmV3RW1haWxzICAgICAgICAgID0gW107XG5cdHZhciBhamF4Rm9ybURhdGEgICAgICAgPSAnJztcblx0dmFyIHRoYXQgICAgICAgICAgICAgICA9ICcnO1xuXG5cdC8vIHN0YXJ0IG91dCB3aXRoIG5vIHByaW1hcnkvcmVtb3ZhbHMgY2hlY2tlZFxuXHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdCQoICcuYS1mb3JtLWNhcHRpb24uYS1yZW1vdmUtZW1haWwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblxuXHQvLyBpZiB0aGVyZSBpcyBhIGxpc3Qgb2YgZW1haWxzIChub3QganVzdCBhIHNpbmdsZSBmb3JtIGZpZWxkKVxuXHRpZiAoIDAgPCAkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLmxlbmd0aCApIHtcblx0XHRuZXh0RW1haWxDb3VudCA9ICQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5sZW5ndGg7XG5cblx0XHQvLyBpZiBhIHVzZXIgc2VsZWN0cyBhIG5ldyBwcmltYXJ5LCBtb3ZlIGl0IGludG8gdGhhdCBwb3NpdGlvblxuXHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcuYS1mb3JtLWNhcHRpb24uYS1tYWtlLXByaW1hcnktZW1haWwgaW5wdXRbdHlwZT1cInJhZGlvXCJdJywgZnVuY3Rpb24oKSB7XG5cblx0XHRcdG5ld1ByaW1hcnlFbWFpbCA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdG9sZFByaW1hcnlFbWFpbCA9ICQoICcjZW1haWwnICkudmFsKCk7XG5cdFx0XHRwcmltYXJ5SWQgICAgICAgPSAkKCB0aGlzICkucHJvcCggJ2lkJyApLnJlcGxhY2UoICdwcmltYXJ5X2VtYWlsXycsICcnICk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncHJpbWFyeS1jaGFuZ2UnICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlclxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblxuXHRcdFx0Ly8kKCB0aGlzICkucGFyZW50KCkuYWZ0ZXIoIGNvbmZpcm1DaGFuZ2UgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLWNvbmZpcm0tcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSB1c2VyIGZhY2luZyB2YWx1ZXNcblx0XHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCA+IGxpJyApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG5ld1ByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3VzZXItZW1haWwtJyArIHByaW1hcnlJZCApLnRleHROb2RlcygpLmZpcnN0KCkucmVwbGFjZVdpdGgoIG9sZFByaW1hcnlFbWFpbCApO1xuXG5cdFx0XHRcdC8vIGNoYW5nZSB0aGUgbWFpbiBoaWRkZW4gZm9ybSB2YWx1ZVxuXHRcdFx0XHQkKCAnI2VtYWlsJyApLnZhbCggbmV3UHJpbWFyeUVtYWlsICk7XG5cblx0XHRcdFx0Ly8gc3VibWl0IGZvcm0gdmFsdWVzLlxuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXG5cdFx0XHRcdC8vIHVuY2hlY2sgdGhlIHJhZGlvIGJ1dHRvblxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jYXB0aW9uLmEtbWFrZS1wcmltYXJ5LWVtYWlsIGlucHV0W3R5cGU9XCJyYWRpb1wiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0Ly8gY2hhbmdlIHRoZSBmb3JtIHZhbHVlcyB0byB0aGUgb2xkIHByaW1hcnkgZW1haWxcblx0XHRcdFx0JCggJyNwcmltYXJ5X2VtYWlsXycgKyBwcmltYXJ5SWQgKS52YWwoIG9sZFByaW1hcnlFbWFpbCApO1xuXHRcdFx0XHQkKCAnI3JlbW92ZV9lbWFpbF8nICsgcHJpbWFyeUlkICkudmFsKCBvbGRQcmltYXJ5RW1haWwgKTtcblxuXHRcdFx0XHQvLyByZW1vdmUgdGhlIGNvbmZpcm0gbWVzc2FnZVxuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0XHQkKCAnLmEtcHJlLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkuc2hvdygpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcHJpbWFyeS1jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5zaG93KCk7XG5cdFx0XHRcdCQoICcuYS1mb3JtLWNvbmZpcm0nLCB0aGF0LnBhcmVudCgpICkucmVtb3ZlKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gaWYgYSB1c2VyIHJlbW92ZXMgYW4gZW1haWwsIHRha2UgaXQgYXdheSBmcm9tIHRoZSB2aXN1YWwgYW5kIGZyb20gdGhlIGZvcm1cblx0XHQkKCAnLm0tdXNlci1lbWFpbC1saXN0JyApLm9uKCAnY2hhbmdlJywgJy5hLWZvcm0tY2FwdGlvbi5hLXJlbW92ZS1lbWFpbCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdGVtYWlsVG9SZW1vdmUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRjb25maXJtQ2hhbmdlICAgPSBnZXRDb25maXJtQ2hhbmdlTWFya3VwKCAncmVtb3ZhbCcgKTtcblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QgPiBsaScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCAkKCB0aGlzICkuY29udGVudHMoKS5nZXQoIDAgKS5ub2RlVmFsdWUgIT09IGVtYWlsVG9SZW1vdmUgKSB7XG5cdFx0XHRcdFx0Y29uc29saWRhdGVkRW1haWxzLnB1c2goICQoIHRoaXMgKS5jb250ZW50cygpLmdldCggMCApLm5vZGVWYWx1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIGdldCBvciBkb24ndCBnZXQgY29uZmlybWF0aW9uIGZyb20gdXNlciBmb3IgcmVtb3ZhbFxuXHRcdFx0dGhhdCA9ICQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKTtcblx0XHRcdCQoICcuYS1wcmUtY29uZmlybScsIHRoYXQgKS5oaWRlKCk7XG5cdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdCApLnNob3coKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcyggJ2EtcHJlLWNvbmZpcm0nICk7XG5cdFx0XHQkKCB0aGlzICkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdhLXN0b3AtY29uZmlybScgKTtcblx0XHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmQoIGNvbmZpcm1DaGFuZ2UgKTtcblxuXHRcdFx0Ly8gaWYgY29uZmlybWVkLCByZW1vdmUgdGhlIGVtYWlsIGFuZCBzdWJtaXQgdGhlIGZvcm1cblx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkub24oICdjbGljaycsICcjYS1jb25maXJtLXJlbW92YWwnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGknICkuZmFkZU91dCggJ25vcm1hbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5yZW1vdmUoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCggY29uc29saWRhdGVkRW1haWxzLmpvaW4oICcsJyApICk7XG5cblx0XHRcdFx0Ly9jb25zb2xlLmxvZyggJ3ZhbHVlIGlzICcgKyBjb25zb2xpZGF0ZWRFbWFpbHMuam9pbiggJywnICkgKTtcblx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSAkKCAnLm0tdXNlci1lbWFpbC1saXN0ID4gbGknICkubGVuZ3RoO1xuXHRcdFx0XHRmb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHQkKCAnLmEtZm9ybS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnJlbW92ZSgpO1xuXHRcdFx0fSApO1xuXHRcdFx0JCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5vbiggJ2NsaWNrJywgJyNhLXN0b3AtcmVtb3ZhbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JCggJy5hLXByZS1jb25maXJtJywgdGhhdC5wYXJlbnQoKSApLnNob3coKTtcblx0XHRcdFx0JCggJy5hLWZvcm0tY29uZmlybScsIHRoYXQucGFyZW50KCkgKS5yZW1vdmUoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBpZiBhIHVzZXIgd2FudHMgdG8gYWRkIGFuIGVtYWlsLCBnaXZlIHRoZW0gYSBwcm9wZXJseSBudW1iZXJlZCBmaWVsZFxuXHQkKCAnLm0tZm9ybS1lbWFpbCcgKS5vbiggJ2NsaWNrJywgJy5hLWZvcm0tY2FwdGlvbi5hLWFkZC1lbWFpbCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCQoICcuYS1mb3JtLWNhcHRpb24uYS1hZGQtZW1haWwnICkuYmVmb3JlKCAnPGRpdiBjbGFzcz1cImEtaW5wdXQtd2l0aC1idXR0b24gYS1idXR0b24tc2VudGVuY2VcIj48aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiBpZD1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIiB2YWx1ZT1cIlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5hbWU9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgaWQ9XCJhLWFkZC1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgY2xhc3M9XCJhLWJ1dHRvbiBhLWJ1dHRvbi1hZGQtdXNlci1lbWFpbFwiPkFkZDwvYnV0dG9uPjwvZGl2PicgKTtcblx0XHRuZXh0RW1haWxDb3VudCsrO1xuXHR9ICk7XG5cblx0JCggJ2lucHV0W3R5cGU9c3VibWl0XScgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGJ1dHRvbiA9ICQoIHRoaXMgKTtcblx0XHR2YXIgYnV0dG9uRm9ybSA9IGJ1dHRvbi5jbG9zZXN0KCAnZm9ybScgKTtcblx0XHRidXR0b25Gb3JtLmRhdGEoICdzdWJtaXR0aW5nX2J1dHRvbicsIGJ1dHRvbi52YWwoKSApO1xuXHR9ICk7XG5cblx0JCggJy5tLWVudHJ5LWNvbnRlbnQnICkub24oICdzdWJtaXQnLCAnI2FjY291bnQtc2V0dGluZ3MtZm9ybScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgZm9ybSA9ICQoIHRoaXMgKTtcblx0XHR2YXIgc3VibWl0dGluZ0J1dHRvbiA9IGZvcm0uZGF0YSggJ3N1Ym1pdHRpbmdfYnV0dG9uJyApIHx8ICcnO1xuXG5cdFx0Ly8gaWYgdGhlcmUgaXMgbm8gc3VibWl0dGluZyBidXR0b24sIHBhc3MgaXQgYnkgQWpheFxuXHRcdGlmICggJycgPT09IHN1Ym1pdHRpbmdCdXR0b24gfHwgJ1NhdmUgQ2hhbmdlcycgIT09IHN1Ym1pdHRpbmdCdXR0b24gKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YWpheEZvcm1EYXRhID0gZm9ybS5zZXJpYWxpemUoKTsgLy9hZGQgb3VyIG93biBhamF4IGNoZWNrIGFzIFgtUmVxdWVzdGVkLVdpdGggaXMgbm90IGFsd2F5cyByZWxpYWJsZVxuXHRcdFx0YWpheEZvcm1EYXRhID0gYWpheEZvcm1EYXRhICsgJyZyZXN0PXRydWUnO1xuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogZnVsbFVybCxcblx0XHRcdFx0dHlwZTogJ3Bvc3QnLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHVzZXJfYWNjb3VudF9tYW5hZ2VtZW50X3Jlc3Qubm9uY2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdFx0ZGF0YTogYWpheEZvcm1EYXRhXG5cdFx0XHR9ICkuZG9uZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5ld0VtYWlscyA9ICQoICdpbnB1dFtuYW1lPVwiX2NvbnNvbGlkYXRlZF9lbWFpbHNfYXJyYXlbXVwiXScgKS5tYXAoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdH0gKS5nZXQoKTtcblx0XHRcdFx0JC5lYWNoKCBuZXdFbWFpbHMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XG5cdFx0XHRcdFx0bmV4dEVtYWlsQ291bnQgPSBuZXh0RW1haWxDb3VudCArIGluZGV4O1xuXHRcdFx0XHRcdCQoICcubS11c2VyLWVtYWlsLWxpc3QnICkuYXBwZW5kKCAnPGxpIGlkPVwidXNlci1lbWFpbC0nICsgbmV4dEVtYWlsQ291bnQgKyAnXCI+JyArIHZhbHVlICsgJzx1bCBjbGFzcz1cImEtZm9ybS1jYXB0aW9uIGEtdXNlci1lbWFpbC1hY3Rpb25zXCI+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLW1ha2UtcHJpbWFyeS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicHJpbWFyeV9lbWFpbFwiIGlkPVwicHJpbWFyeV9lbWFpbF8nICsgbmV4dEVtYWlsQ291bnQgKyAnXCIgdmFsdWU9XCInICsgdmFsdWUgKyAnXCI+PGxhYmVsIGZvcj1cInByaW1hcnlfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5NYWtlIFByaW1hcnk8L3NtYWxsPjwvbGFiZWw+PC9saT48bGkgY2xhc3M9XCJhLWZvcm0tY2FwdGlvbiBhLXByZS1jb25maXJtIGEtZW1haWwtcHJlZmVyZW5jZXNcIj48YSBocmVmPVwiL25ld3NsZXR0ZXJzLz9lbWFpbD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCB2YWx1ZSApICsgJ1wiPjxzbWFsbD5FbWFpbCBQcmVmZXJlbmNlczwvc21hbGw+PC9hPjwvbGk+PGxpIGNsYXNzPVwiYS1mb3JtLWNhcHRpb24gYS1wcmUtY29uZmlybSBhLXJlbW92ZS1lbWFpbFwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwicmVtb3ZlX2VtYWlsWycgKyBuZXh0RW1haWxDb3VudCArICddXCIgaWQ9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiIHZhbHVlPVwiJyArIHZhbHVlICsgJ1wiPjxsYWJlbCBmb3I9XCJyZW1vdmVfZW1haWxfJyArIG5leHRFbWFpbENvdW50ICsgJ1wiPjxzbWFsbD5SZW1vdmU8L3NtYWxsPjwvbGFiZWw+PC9saT48L3VsPjwvbGk+JyApO1xuXHRcdFx0XHRcdCQoICcjX2NvbnNvbGlkYXRlZF9lbWFpbHMnICkudmFsKCAkKCAnI19jb25zb2xpZGF0ZWRfZW1haWxzJyApLnZhbCgpICsgJywnICsgdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHQkKCAnLm0tZm9ybS1jaGFuZ2UtZW1haWwgLmEtaW5wdXQtd2l0aC1idXR0b24nICkucmVtb3ZlKCk7XG5cdFx0XHRcdGlmICggMCA9PT0gJCggJy5tLXVzZXItZW1haWwtbGlzdCcgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkKCAnaW5wdXRbbmFtZT1cIl9jb25zb2xpZGF0ZWRfZW1haWxzX2FycmF5W11cIl0nICkgIT09ICQoICdpbnB1dFtuYW1lPVwiZW1haWxcIl0nICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIGl0IHdvdWxkIGJlIG5pY2UgdG8gb25seSBsb2FkIHRoZSBmb3JtLCBidXQgdGhlbiBjbGljayBldmVudHMgc3RpbGwgZG9uJ3Qgd29ya1xuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIGFkZEF1dG9SZXNpemUoKSB7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICdbZGF0YS1hdXRvcmVzaXplXScgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRlbGVtZW50LnN0eWxlLmJveFNpemluZyA9ICdib3JkZXItYm94Jztcblx0XHR2YXIgb2Zmc2V0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgLSBlbGVtZW50LmNsaWVudEhlaWdodDtcblx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnRhcmdldC5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG5cdFx0XHRldmVudC50YXJnZXQuc3R5bGUuaGVpZ2h0ID0gZXZlbnQudGFyZ2V0LnNjcm9sbEhlaWdodCArIG9mZnNldCArICdweCc7XG5cdFx0fSApO1xuXHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCAnZGF0YS1hdXRvcmVzaXplJyApO1xuXHR9ICk7XG59XG5cbiQoIGRvY3VtZW50ICkuYWpheFN0b3AoIGZ1bmN0aW9uKCkge1xuXHR2YXIgY29tbWVudEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnI2xsY19jb21tZW50cycgKTtcblx0aWYgKCBudWxsICE9PSBjb21tZW50QXJlYSApIHtcblx0XHRhZGRBdXRvUmVzaXplKCk7XG5cdH1cbn0gKTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0aWYgKCAwIDwgJCggJy5tLWZvcm0tYWNjb3VudC1zZXR0aW5ncycgKS5sZW5ndGggKSB7XG5cdFx0bWFuYWdlRW1haWxzKCk7XG5cdH1cblx0dmFyIGF1dG9SZXNpemVUZXh0YXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICdbZGF0YS1hdXRvcmVzaXplXScgKTtcblx0aWYgKCBudWxsICE9PSBhdXRvUmVzaXplVGV4dGFyZWEgKSB7XG5cdFx0YWRkQXV0b1Jlc2l6ZSgpO1xuXHR9XG59ICk7XG4iLCIvKipcbiAqIE1ldGhvZHMgZm9yIGNvbW1lbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgcmVxdWlyZSBqUXVlcnkuXG4gKlxuICovXG5cbi8vIGJhc2VkIG9uIHdoaWNoIGJ1dHRvbiB3YXMgY2xpY2tlZCwgc2V0IHRoZSB2YWx1ZXMgZm9yIHRoZSBhbmFseXRpY3MgZXZlbnQgYW5kIGNyZWF0ZSBpdFxuZnVuY3Rpb24gdHJhY2tTaG93Q29tbWVudHMoIGFsd2F5cywgaWQsIGNsaWNrVmFsdWUgKSB7XG5cdHZhciBhY3Rpb24gICAgICAgICAgPSAnJztcblx0dmFyIGNhdGVnb3J5UHJlZml4ID0gJyc7XG5cdHZhciBjYXRlZ29yeVN1ZmZpeCA9ICcnO1xuXHR2YXIgcG9zaXRpb24gICAgICAgID0gJyc7XG5cdHBvc2l0aW9uID0gaWQucmVwbGFjZSggJ2Fsd2F5cy1zaG93LWNvbW1lbnRzLScsICcnICk7XG5cdGlmICggJzEnID09PSBjbGlja1ZhbHVlICkge1xuXHRcdGFjdGlvbiA9ICdPbic7XG5cdH0gZWxzZSBpZiAoICcwJyA9PT0gY2xpY2tWYWx1ZSApIHtcblx0XHRhY3Rpb24gPSAnT2ZmJztcblx0fSBlbHNlIHtcblx0XHRhY3Rpb24gPSAnQ2xpY2snO1xuXHR9XG5cdGlmICggdHJ1ZSA9PT0gYWx3YXlzICkge1xuXHRcdGNhdGVnb3J5UHJlZml4ID0gJ0Fsd2F5cyAnO1xuXHR9XG5cdGlmICggJycgIT09IHBvc2l0aW9uICkge1xuXHRcdHBvc2l0aW9uID0gcG9zaXRpb24uY2hhckF0KCAwICkudG9VcHBlckNhc2UoKSArIHBvc2l0aW9uLnNsaWNlKCAxICk7XG5cdFx0Y2F0ZWdvcnlTdWZmaXggPSAnIC0gJyArIHBvc2l0aW9uO1xuXHR9XG5cdG1wQW5hbHl0aWNzVHJhY2tpbmdFdmVudCggJ2V2ZW50JywgY2F0ZWdvcnlQcmVmaXggKyAnU2hvdyBDb21tZW50cycgKyBjYXRlZ29yeVN1ZmZpeCwgYWN0aW9uLCBsb2NhdGlvbi5wYXRobmFtZSApO1xufVxuXG4vLyB3aGVuIHNob3dpbmcgY29tbWVudHMgb25jZSwgdHJhY2sgaXQgYXMgYW4gYW5hbHl0aWNzIGV2ZW50XG4kKCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCAnLmEtYnV0dG9uLXNob3ctY29tbWVudHMnLCBmdW5jdGlvbigpIHtcblx0dHJhY2tTaG93Q29tbWVudHMoIGZhbHNlLCAnJywgJycgKTtcbn0gKTtcblxuLy8gU2V0IHVzZXIgbWV0YSB2YWx1ZSBmb3IgYWx3YXlzIHNob3dpbmcgY29tbWVudHMgaWYgdGhhdCBidXR0b24gaXMgY2xpY2tlZFxuJCggZG9jdW1lbnQgKS5vbiggJ2NsaWNrJywgJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJywgZnVuY3Rpb24oKSB7XG5cdHZhciB0aGF0ID0gJCggdGhpcyApO1xuXHRpZiAoIHRoYXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHQkKCAnLmEtY2hlY2tib3gtYWx3YXlzLXNob3ctY29tbWVudHMnICkucHJvcCggJ2NoZWNrZWQnLCB0cnVlICk7XG5cdH0gZWxzZSB7XG5cdFx0JCggJy5hLWNoZWNrYm94LWFsd2F5cy1zaG93LWNvbW1lbnRzJyApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxuXG5cdC8vIHRyYWNrIGl0IGFzIGFuIGFuYWx5dGljcyBldmVudFxuXHR0cmFja1Nob3dDb21tZW50cyggdHJ1ZSwgdGhhdC5hdHRyKCAnaWQnICksIHRoYXQudmFsKCkgKTtcblxuXHQvLyB3ZSBhbHJlYWR5IGhhdmUgYWpheHVybCBmcm9tIHRoZSB0aGVtZVxuXHQkLmFqYXgoIHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0dXJsOiBwYXJhbXMuYWpheHVybCxcblx0XHRkYXRhOiB7XG5cdFx0XHQnYWN0aW9uJzogJ21pbm5wb3N0X2xhcmdvX2xvYWRfY29tbWVudHNfc2V0X3VzZXJfbWV0YScsXG5cdFx0XHQndmFsdWUnOiB0aGF0LnZhbCgpXG5cdFx0fSxcblx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHQkKCAnLmEtYWx3YXlzLXNob3ctY29tbWVudHMtcmVzdWx0JywgdGhhdC5wYXJlbnQoKSApLmh0bWwoIHJlc3BvbnNlLmRhdGEubWVzc2FnZSApO1xuXHRcdFx0aWYgKCB0cnVlID09PSByZXNwb25zZS5kYXRhLnNob3cgKSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDAgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoICcuYS1jaGVja2JveC1hbHdheXMtc2hvdy1jb21tZW50cycgKS52YWwoIDEgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcbn0gKTtcblxuISAoIGZ1bmN0aW9uKCBkICkge1xuXHRpZiAoICEgZC5jdXJyZW50U2NyaXB0ICkge1xuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0YWN0aW9uOiAnbGxjX2xvYWRfY29tbWVudHMnLFxuXHRcdFx0cG9zdDogJCggJyNsbGNfcG9zdF9pZCcgKS52YWwoKVxuXHRcdH07XG5cblx0XHQvLyBBamF4IHJlcXVlc3QgbGluay5cblx0XHR2YXIgbGxjYWpheHVybCA9ICQoICcjbGxjX2FqYXhfdXJsJyApLnZhbCgpO1xuXG5cdFx0Ly8gRnVsbCB1cmwgdG8gZ2V0IGNvbW1lbnRzIChBZGRpbmcgcGFyYW1ldGVycykuXG5cdFx0dmFyIGNvbW1lbnRVcmwgPSBsbGNhamF4dXJsICsgJz8nICsgJC5wYXJhbSggZGF0YSApO1xuXG5cdFx0Ly8gUGVyZm9ybSBhamF4IHJlcXVlc3QuXG5cdFx0JC5nZXQoIGNvbW1lbnRVcmwsIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdGlmICggJycgIT09IHJlc3BvbnNlICkge1xuXHRcdFx0XHQkKCAnI2xsY19jb21tZW50cycgKS5odG1sKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgY29tbWVudHMgYWZ0ZXIgbGF6eSBsb2FkaW5nLlxuXHRcdFx0XHRpZiAoIHdpbmRvdy5hZGRDb21tZW50ICYmIHdpbmRvdy5hZGRDb21tZW50LmluaXQgKSB7XG5cdFx0XHRcdFx0d2luZG93LmFkZENvbW1lbnQuaW5pdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gR2V0IHRoZSBjb21tZW50IGxpIGlkIGZyb20gdXJsIGlmIGV4aXN0LlxuXHRcdFx0XHR2YXIgY29tbWVudElkID0gZG9jdW1lbnQuVVJMLnN1YnN0ciggZG9jdW1lbnQuVVJMLmluZGV4T2YoICcjY29tbWVudCcgKSApO1xuXG5cdFx0XHRcdC8vIElmIGNvbW1lbnQgaWQgZm91bmQsIHNjcm9sbCB0byB0aGF0IGNvbW1lbnQuXG5cdFx0XHRcdGlmICggLTEgPCBjb21tZW50SWQuaW5kZXhPZiggJyNjb21tZW50JyApICkge1xuXHRcdFx0XHRcdCQoIHdpbmRvdyApLnNjcm9sbFRvcCggJCggY29tbWVudElkICkub2Zmc2V0KCkudG9wICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cbn0oIGRvY3VtZW50ICkgKTtcbiIsIi8qKlxuICogTWV0aG9kcyBmb3IgZXZlbnRzXG4gKlxuICogVGhpcyBmaWxlIGRvZXMgbm90IHJlcXVpcmUgalF1ZXJ5LlxuICpcbiAqL1xuXG52YXIgdGFyZ2V0ICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWV2ZW50cy1jYWwtbGlua3MnICk7XG5pZiAoIG51bGwgIT09IHRhcmdldCApIHtcbiAgICB2YXIgbGkgICAgICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2xpJyApO1xuICAgIGxpLmlubmVySFRNTCAgPSAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImEtY2xvc2UtYnV0dG9uIGEtY2xvc2UtY2FsZW5kYXJcIj48aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT48L2E+JztcbiAgICB2YXIgZnJhZ21lbnQgID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGxpLnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ2EtY2xvc2UtaG9sZGVyJyApO1xuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBsaSApO1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZCggZnJhZ21lbnQgKTtcbn1cblxuY29uc3QgY2FsZW5kYXJUcmFuc2l0aW9uZXIgPSB0cmFuc2l0aW9uSGlkZGVuRWxlbWVudCgge1xuICAgIGVsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcuYS1ldmVudHMtY2FsLWxpbmtzJyApLFxuICAgIHZpc2libGVDbGFzczogJ2EtZXZlbnRzLWNhbC1saW5rLXZpc2libGUnLFxuICAgIGRpc3BsYXlWYWx1ZTogJ2Jsb2NrJ1xufSApO1xuXG52YXIgY2FsZW5kYXJWaXNpYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5tLWV2ZW50LWRhdGV0aW1lIGEnICk7XG5pZiAoIG51bGwgIT09IGNhbGVuZGFyVmlzaWJsZSApIHtcbiAgICBjYWxlbmRhclZpc2libGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBjYWxlbmRhclZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcbiAgICAgICAgY2FsZW5kYXJWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgICAgIGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG4gICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgIHZhciBjYWxlbmRhckNsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5hLWNsb3NlLWNhbGVuZGFyJyApO1xuICAgIGNhbGVuZGFyQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGV0IGV4cGFuZGVkID0gJ3RydWUnID09PSBjYWxlbmRhclZpc2libGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSB8fCBmYWxzZTtcbiAgICAgICAgY2FsZW5kYXJWaXNpYmxlLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAhIGV4cGFuZGVkICk7XG4gICAgICAgIGlmICggdHJ1ZSA9PT0gZXhwYW5kZWQgKSB7XG4gICAgICAgICAgICBjYWxlbmRhclRyYW5zaXRpb25lci50cmFuc2l0aW9uSGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsZW5kYXJUcmFuc2l0aW9uZXIudHJhbnNpdGlvblNob3coKTtcbiAgICAgICAgfVxuICAgIH0gKTtcbn1cbiJdfQ==
}(jQuery));
