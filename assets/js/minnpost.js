'use strict';

/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
(function () {
	var container, button, menu, links, i, len;

	container = document.getElementById('navigation-primary');
	if (!container) {
		return;
	}

	button = container.getElementsByTagName('button')[0];
	if ('undefined' === typeof button) {
		return;
	}

	menu = container.getElementsByTagName('ul')[0];

	// Hide menu toggle button if menu is empty and return early.
	if ('undefined' === typeof menu) {
		button.style.display = 'none';
		return;
	}

	menu.setAttribute('aria-expanded', 'false');
	if (-1 === menu.className.indexOf('menu')) {
		menu.className += ' menu';
	}

	button.onclick = function () {
		if (-1 !== container.className.indexOf('toggled')) {
			container.className = container.className.replace(' toggled', '');
			button.setAttribute('aria-expanded', 'false');
			menu.setAttribute('aria-expanded', 'false');
		} else {
			container.className += ' toggled';
			button.setAttribute('aria-expanded', 'true');
			menu.setAttribute('aria-expanded', 'true');
		}
	};

	// Get all the link elements within the menu.
	links = menu.getElementsByTagName('a');

	// Each time a menu link is focused or blurred, toggle focus.
	for (i = 0, len = links.length; i < len; i++) {
		links[i].addEventListener('focus', toggleFocus, true);
		links[i].addEventListener('blur', toggleFocus, true);
	}

	/**
  * Sets or removes .focus class on an element.
  */
	function toggleFocus() {
		var self = this;

		// Move up through the ancestors of the current link until we hit .nav-menu.
		while (-1 === self.className.indexOf('menu')) {

			// On li elements toggle the class .focus.
			if ('li' === self.tagName.toLowerCase()) {
				if (-1 !== self.className.indexOf('focus')) {
					self.className = self.className.replace(' focus', '');
				} else {
					self.className += ' focus';
				}
			}

			self = self.parentElement;
		}
	}

	/**
  * Toggles `focus` class to allow submenu access on tablets.
  */
	(function (container) {
		var touchStartFn,
		    i,
		    parentLink = container.querySelectorAll('.menu-item-has-children > a, .page_item_has_children > a');

		if ('ontouchstart' in window) {
			touchStartFn = function touchStartFn(e) {
				var menuItem = this.parentNode,
				    i;

				if (!menuItem.classList.contains('focus')) {
					e.preventDefault();
					for (i = 0; i < menuItem.parentNode.children.length; ++i) {
						if (menuItem === menuItem.parentNode.children[i]) {
							continue;
						}
						menuItem.parentNode.children[i].classList.remove('focus');
					}
					menuItem.classList.add('focus');
				} else {
					menuItem.classList.remove('focus');
				}
			};

			for (i = 0; i < parentLink.length; ++i) {
				parentLink[i].addEventListener('touchstart', touchStartFn, false);
			}
		}
	})(container);
})();

// user account navigation can be a dropdown
var $ = window.jQuery;

$(document).ready(function () {
	// hide menu
	if ($('#user-account-access ul').length > 0) {
		$('#user-account-access > li a').on('click', function (event) {
			$('#user-account-access ul').toggleClass('visible');
			event.preventDefault();
		});
	}
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5hdmlnYXRpb24uanMiXSwibmFtZXMiOlsiY29udGFpbmVyIiwiYnV0dG9uIiwibWVudSIsImxpbmtzIiwiaSIsImxlbiIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsInN0eWxlIiwiZGlzcGxheSIsInNldEF0dHJpYnV0ZSIsImNsYXNzTmFtZSIsImluZGV4T2YiLCJvbmNsaWNrIiwicmVwbGFjZSIsImxlbmd0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0b2dnbGVGb2N1cyIsInNlbGYiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJwYXJlbnRFbGVtZW50IiwidG91Y2hTdGFydEZuIiwicGFyZW50TGluayIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJ3aW5kb3ciLCJlIiwibWVudUl0ZW0iLCJwYXJlbnROb2RlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJwcmV2ZW50RGVmYXVsdCIsImNoaWxkcmVuIiwicmVtb3ZlIiwiYWRkIiwiJCIsImpRdWVyeSIsInJlYWR5Iiwib24iLCJldmVudCIsInRvZ2dsZUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7QUFNQSxDQUFFLFlBQVc7QUFDWixLQUFJQSxTQUFKLEVBQWVDLE1BQWYsRUFBdUJDLElBQXZCLEVBQTZCQyxLQUE3QixFQUFvQ0MsQ0FBcEMsRUFBdUNDLEdBQXZDOztBQUVBTCxhQUFZTSxTQUFTQyxjQUFULENBQXlCLG9CQUF6QixDQUFaO0FBQ0EsS0FBSyxDQUFFUCxTQUFQLEVBQW1CO0FBQ2xCO0FBQ0E7O0FBRURDLFVBQVNELFVBQVVRLG9CQUFWLENBQWdDLFFBQWhDLEVBQTJDLENBQTNDLENBQVQ7QUFDQSxLQUFLLGdCQUFnQixPQUFPUCxNQUE1QixFQUFxQztBQUNwQztBQUNBOztBQUVEQyxRQUFPRixVQUFVUSxvQkFBVixDQUFnQyxJQUFoQyxFQUF1QyxDQUF2QyxDQUFQOztBQUVBO0FBQ0EsS0FBSyxnQkFBZ0IsT0FBT04sSUFBNUIsRUFB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U0MsVUFBVCxDQUFvQkksUUFBcEIsQ0FBNkI3QixDQUE3QixFQUFnQzBCLFNBQWhDLENBQTBDSSxNQUExQyxDQUFrRCxPQUFsRDtBQUNBO0FBQ0ROLGNBQVNFLFNBQVQsQ0FBbUJLLEdBQW5CLENBQXdCLE9BQXhCO0FBQ0EsS0FURCxNQVNPO0FBQ05QLGNBQVNFLFNBQVQsQ0FBbUJJLE1BQW5CLENBQTJCLE9BQTNCO0FBQ0E7QUFDRCxJQWZEOztBQWlCQSxRQUFNOUIsSUFBSSxDQUFWLEVBQWFBLElBQUlvQixXQUFXUixNQUE1QixFQUFvQyxFQUFFWixDQUF0QyxFQUEwQztBQUN6Q29CLGVBQVdwQixDQUFYLEVBQWNhLGdCQUFkLENBQWdDLFlBQWhDLEVBQThDTSxZQUE5QyxFQUE0RCxLQUE1RDtBQUNBO0FBQ0Q7QUFDRCxFQTFCQyxFQTBCQ3ZCLFNBMUJELENBQUY7QUEyQkEsQ0FuR0Q7O0FBcUdBO0FBQ0EsSUFBSW9DLElBQUlWLE9BQU9XLE1BQWY7O0FBRUFELEVBQUU5QixRQUFGLEVBQVlnQyxLQUFaLENBQWtCLFlBQVc7QUFDNUI7QUFDQSxLQUFJRixFQUFFLHlCQUFGLEVBQTZCcEIsTUFBN0IsR0FBc0MsQ0FBMUMsRUFBOEM7QUFDN0NvQixJQUFFLDZCQUFGLEVBQWlDRyxFQUFqQyxDQUFxQyxPQUFyQyxFQUE4QyxVQUFTQyxLQUFULEVBQWdCO0FBQzdESixLQUFFLHlCQUFGLEVBQTZCSyxXQUE3QixDQUEwQyxTQUExQztBQUNBRCxTQUFNUixjQUFOO0FBQ0EsR0FIRDtBQUlBO0FBRUQsQ0FURCIsImZpbGUiOiJtaW5ucG9zdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRmlsZSBuYXZpZ2F0aW9uLmpzLlxuICpcbiAqIEhhbmRsZXMgdG9nZ2xpbmcgdGhlIG5hdmlnYXRpb24gbWVudSBmb3Igc21hbGwgc2NyZWVucyBhbmQgZW5hYmxlcyBUQUIga2V5XG4gKiBuYXZpZ2F0aW9uIHN1cHBvcnQgZm9yIGRyb3Bkb3duIG1lbnVzLlxuICovXG4oIGZ1bmN0aW9uKCkge1xuXHR2YXIgY29udGFpbmVyLCBidXR0b24sIG1lbnUsIGxpbmtzLCBpLCBsZW47XG5cblx0Y29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICduYXZpZ2F0aW9uLXByaW1hcnknICk7XG5cdGlmICggISBjb250YWluZXIgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0YnV0dG9uID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYnV0dG9uJyApWzBdO1xuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgYnV0dG9uICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1lbnUgPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICd1bCcgKVswXTtcblxuXHQvLyBIaWRlIG1lbnUgdG9nZ2xlIGJ1dHRvbiBpZiBtZW51IGlzIGVtcHR5IGFuZCByZXR1cm4gZWFybHkuXG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBtZW51ICkge1xuXHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0aWYgKCAtMSA9PT0gbWVudS5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cdFx0bWVudS5jbGFzc05hbWUgKz0gJyBtZW51Jztcblx0fVxuXG5cdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCAtMSAhPT0gY29udGFpbmVyLmNsYXNzTmFtZS5pbmRleE9mKCAndG9nZ2xlZCcgKSApIHtcblx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgPSBjb250YWluZXIuY2xhc3NOYW1lLnJlcGxhY2UoICcgdG9nZ2xlZCcsICcnICk7XG5cdFx0XHRidXR0b24uc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29udGFpbmVyLmNsYXNzTmFtZSArPSAnIHRvZ2dsZWQnO1xuXHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHRcdG1lbnUuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyApO1xuXHRcdH1cblx0fTtcblxuXHQvLyBHZXQgYWxsIHRoZSBsaW5rIGVsZW1lbnRzIHdpdGhpbiB0aGUgbWVudS5cblx0bGlua3MgICAgPSBtZW51LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYScgKTtcblxuXHQvLyBFYWNoIHRpbWUgYSBtZW51IGxpbmsgaXMgZm9jdXNlZCBvciBibHVycmVkLCB0b2dnbGUgZm9jdXMuXG5cdGZvciAoIGkgPSAwLCBsZW4gPSBsaW5rcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCAnZm9jdXMnLCB0b2dnbGVGb2N1cywgdHJ1ZSApO1xuXHRcdGxpbmtzW2ldLmFkZEV2ZW50TGlzdGVuZXIoICdibHVyJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIG9yIHJlbW92ZXMgLmZvY3VzIGNsYXNzIG9uIGFuIGVsZW1lbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVGb2N1cygpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHQvLyBNb3ZlIHVwIHRocm91Z2ggdGhlIGFuY2VzdG9ycyBvZiB0aGUgY3VycmVudCBsaW5rIHVudGlsIHdlIGhpdCAubmF2LW1lbnUuXG5cdFx0d2hpbGUgKCAtMSA9PT0gc2VsZi5jbGFzc05hbWUuaW5kZXhPZiggJ21lbnUnICkgKSB7XG5cblx0XHRcdC8vIE9uIGxpIGVsZW1lbnRzIHRvZ2dsZSB0aGUgY2xhc3MgLmZvY3VzLlxuXHRcdFx0aWYgKCAnbGknID09PSBzZWxmLnRhZ05hbWUudG9Mb3dlckNhc2UoKSApIHtcblx0XHRcdFx0aWYgKCAtMSAhPT0gc2VsZi5jbGFzc05hbWUuaW5kZXhPZiggJ2ZvY3VzJyApICkge1xuXHRcdFx0XHRcdHNlbGYuY2xhc3NOYW1lID0gc2VsZi5jbGFzc05hbWUucmVwbGFjZSggJyBmb2N1cycsICcnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2VsZi5jbGFzc05hbWUgKz0gJyBmb2N1cyc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0c2VsZiA9IHNlbGYucGFyZW50RWxlbWVudDtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyBgZm9jdXNgIGNsYXNzIHRvIGFsbG93IHN1Ym1lbnUgYWNjZXNzIG9uIHRhYmxldHMuXG5cdCAqL1xuXHQoIGZ1bmN0aW9uKCBjb250YWluZXIgKSB7XG5cdFx0dmFyIHRvdWNoU3RhcnRGbiwgaSxcblx0XHRcdHBhcmVudExpbmsgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCggJy5tZW51LWl0ZW0taGFzLWNoaWxkcmVuID4gYSwgLnBhZ2VfaXRlbV9oYXNfY2hpbGRyZW4gPiBhJyApO1xuXG5cdFx0aWYgKCAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgKSB7XG5cdFx0XHR0b3VjaFN0YXJ0Rm4gPSBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0dmFyIG1lbnVJdGVtID0gdGhpcy5wYXJlbnROb2RlLCBpO1xuXG5cdFx0XHRcdGlmICggISBtZW51SXRlbS5jbGFzc0xpc3QuY29udGFpbnMoICdmb2N1cycgKSApIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0Zm9yICggaSA9IDA7IGkgPCBtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuLmxlbmd0aDsgKytpICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtZW51SXRlbSA9PT0gbWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbltpXSApIHtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRtZW51SXRlbS5wYXJlbnROb2RlLmNoaWxkcmVuW2ldLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bWVudUl0ZW0uY2xhc3NMaXN0LmFkZCggJ2ZvY3VzJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1lbnVJdGVtLmNsYXNzTGlzdC5yZW1vdmUoICdmb2N1cycgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBwYXJlbnRMaW5rLmxlbmd0aDsgKytpICkge1xuXHRcdFx0XHRwYXJlbnRMaW5rW2ldLmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0JywgdG91Y2hTdGFydEZuLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSggY29udGFpbmVyICkgKTtcbn0gKSgpO1xuXG4vLyB1c2VyIGFjY291bnQgbmF2aWdhdGlvbiBjYW4gYmUgYSBkcm9wZG93blxudmFyICQgPSB3aW5kb3cualF1ZXJ5O1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblx0Ly8gaGlkZSBtZW51XG5cdGlmICgkKCcjdXNlci1hY2NvdW50LWFjY2VzcyB1bCcpLmxlbmd0aCA+IDAgKSB7XG5cdFx0JCgnI3VzZXItYWNjb3VudC1hY2Nlc3MgPiBsaSBhJykub24oICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHQkKCcjdXNlci1hY2NvdW50LWFjY2VzcyB1bCcpLnRvZ2dsZUNsYXNzKCAndmlzaWJsZScgKTtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fSk7XG5cdH1cblxufSk7XG4iXX0=
