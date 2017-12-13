'use strict';

var $ = window.jQuery;
$(function () {
				$('.appnexus-ad').Lazy({
								// callback
								beforeLoad: function beforeLoad(element) {
												//console.log('element is about to load');
												//var tag = element.text().replace(/\s/g,'');
												//console.log('load this ' + tag);
												//OAS_AD(tag);
								},

								afterLoad: function afterLoad(element) {
												//console.log('element was loaded');
												//var tag = element.text().replace(/\s/g,'');
												//console.log('load this ' + tag);
												//element.html('<script>OAS_AD("' + tag + '");</script>');
								},

								// custom loaders
								lazyLoadAd: function lazyLoadAd(element) {
												//element.load();
												var tag = element.text().replace(/\s/g, '');
												//console.log('load this ' + tag);
												element.html('<script>OAS_AD("' + tag + '");</script>');
								}
				});
});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkcy5qcyIsIm5hdmlnYXRpb24uanMiXSwibmFtZXMiOlsiJCIsIndpbmRvdyIsImpRdWVyeSIsIkxhenkiLCJiZWZvcmVMb2FkIiwiZWxlbWVudCIsImFmdGVyTG9hZCIsImxhenlMb2FkQWQiLCJ0YWciLCJ0ZXh0IiwicmVwbGFjZSIsImh0bWwiLCJjb250YWluZXIiLCJidXR0b24iLCJtZW51IiwibGlua3MiLCJpIiwibGVuIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwic3R5bGUiLCJkaXNwbGF5Iiwic2V0QXR0cmlidXRlIiwiY2xhc3NOYW1lIiwiaW5kZXhPZiIsIm9uY2xpY2siLCJsZW5ndGgiLCJhZGRFdmVudExpc3RlbmVyIiwidG9nZ2xlRm9jdXMiLCJzZWxmIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwicGFyZW50RWxlbWVudCIsInRvdWNoU3RhcnRGbiIsInBhcmVudExpbmsiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZSIsIm1lbnVJdGVtIiwicGFyZW50Tm9kZSIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwicHJldmVudERlZmF1bHQiLCJjaGlsZHJlbiIsInJlbW92ZSIsImFkZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxJQUFJQyxPQUFPQyxNQUFmO0FBQ0FGLEVBQUUsWUFBVztBQUNUQSxNQUFFLGNBQUYsRUFBa0JHLElBQWxCLENBQXVCO0FBQ25CO0FBQ0hDLG9CQUFZLG9CQUFTQyxPQUFULEVBQWtCO0FBQzdCO0FBQ0E7QUFDRztBQUNBO0FBQ0gsU0FQcUI7O0FBU3RCQyxtQkFBVyxtQkFBU0QsT0FBVCxFQUFrQjtBQUM1QjtBQUNBO0FBQ0c7QUFDQTtBQUNILFNBZHFCOztBQWdCdEI7QUFDQUUsb0JBQVksb0JBQVNGLE9BQVQsRUFBa0I7QUFDNUI7QUFDQSxnQkFBSUcsTUFBTUgsUUFBUUksSUFBUixHQUFlQyxPQUFmLENBQXVCLEtBQXZCLEVBQTZCLEVBQTdCLENBQVY7QUFD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bmRvdy5qUXVlcnk7XG4kKGZ1bmN0aW9uKCkge1xuICAgICQoJy5hcHBuZXh1cy1hZCcpLkxhenkoe1xuICAgICAgICAvLyBjYWxsYmFja1xuXHQgICAgYmVmb3JlTG9hZDogZnVuY3Rpb24oZWxlbWVudCkge1xuXHQgICAgXHQvL2NvbnNvbGUubG9nKCdlbGVtZW50IGlzIGFib3V0IHRvIGxvYWQnKTtcblx0ICAgIFx0Ly92YXIgdGFnID0gZWxlbWVudC50ZXh0KCkucmVwbGFjZSgvXFxzL2csJycpO1xuXHQgICAgICAgIC8vY29uc29sZS5sb2coJ2xvYWQgdGhpcyAnICsgdGFnKTtcblx0ICAgICAgICAvL09BU19BRCh0YWcpO1xuXHQgICAgfSxcblxuXHQgICAgYWZ0ZXJMb2FkOiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdCAgICBcdC8vY29uc29sZS5sb2coJ2VsZW1lbnQgd2FzIGxvYWRlZCcpO1xuXHQgICAgXHQvL3ZhciB0YWcgPSBlbGVtZW50LnRleHQoKS5yZXBsYWNlKC9cXHMvZywnJyk7XG5cdCAgICAgICAgLy9jb25zb2xlLmxvZygnbG9hZCB0aGlzICcgKyB0YWcpO1xuXHQgICAgICAgIC8vZWxlbWVudC5odG1sKCc8c2NyaXB0Pk9BU19BRChcIicgKyB0YWcgKyAnXCIpOzwvc2NyaXB0PicpO1xuXHQgICAgfSxcblxuXHQgICAgLy8gY3VzdG9tIGxvYWRlcnNcblx0ICAgIGxhenlMb2FkQWQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0ICAgICBcdC8vZWxlbWVudC5sb2FkKCk7XG5cdCAgICAgXHR2YXIgdGFnID0gZWxlbWVudC50ZXh0KCkucmVwbGFjZSgvXFxzL2csJycpO1xuXHQgICAgICAgIC8vY29uc29sZS5sb2coJ2xvYWQgdGhpcyAnICsgdGFnKTtcblx0ICAgICAgICBlbGVtZW50Lmh0bWwoJzxzY3JpcHQ+T0FTX0FEKFwiJyArIHRhZyArICdcIik7PC9zY3JpcHQ+Jyk7XG5cdCAgICB9XG4gICAgfSk7XG59KTsiLCIvKipcbiAqIEZpbGUgbmF2aWdhdGlvbi5qcy5cbiAqXG4gKiBIYW5kbGVzIHRvZ2dsaW5nIHRoZSBuYXZpZ2F0aW9uIG1lbnUgZm9yIHNtYWxsIHNjcmVlbnMgYW5kIGVuYWJsZXMgVEFCIGtleVxuICogbmF2aWdhdGlvbiBzdXBwb3J0IGZvciBkcm9wZG93biBtZW51cy5cbiAqL1xuKCBmdW5jdGlvbigpIHtcblx0dmFyIGNvbnRhaW5lciwgYnV0dG9uLCBtZW51LCBsaW5rcywgaSwgbGVuO1xuXG5cdGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAnbmF2aWdhdGlvbi1wcmltYXJ5JyApO1xuXHRpZiAoICEgY29udGFpbmVyICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGJ1dHRvbiA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2J1dHRvbicgKVswXTtcblx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIGJ1dHRvbiApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRtZW51ID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAndWwnIClbMF07XG5cblx0Ly8gSGlkZSBtZW51IHRvZ2dsZSBidXR0b24gaWYgbWVudSBpcyBlbXB0eSBhbmQgcmV0dXJuIGVhcmx5LlxuXHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2YgbWVudSApIHtcblx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRyZXR1cm47XG5cdH1cblxuXHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdGlmICggLTEgPT09IG1lbnUuY2xhc3NOYW1lLmluZGV4T2YoICdtZW51JyApICkge1xuXHRcdG1lbnUuY2xhc3NOYW1lICs9ICcgbWVudSc7XG5cdH1cblxuXHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggLTEgIT09IGNvbnRhaW5lci5jbGFzc05hbWUuaW5kZXhPZiggJ3RvZ2dsZWQnICkgKSB7XG5cdFx0XHRjb250YWluZXIuY2xhc3NOYW1lID0gY29udGFpbmVyLmNsYXNzTmFtZS5yZXBsYWNlKCAnIHRvZ2dsZWQnLCAnJyApO1xuXHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRhaW5lci5jbGFzc05hbWUgKz0gJyB0b2dnbGVkJztcblx0XHRcdGJ1dHRvbi5zZXRBdHRyaWJ1dGUoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnICk7XG5cdFx0XHRtZW51LnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gR2V0IGFsbCB0aGUgbGluayBlbGVtZW50cyB3aXRoaW4gdGhlIG1lbnUuXG5cdGxpbmtzICAgID0gbWVudS5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2EnICk7XG5cblx0Ly8gRWFjaCB0aW1lIGEgbWVudSBsaW5rIGlzIGZvY3VzZWQgb3IgYmx1cnJlZCwgdG9nZ2xlIGZvY3VzLlxuXHRmb3IgKCBpID0gMCwgbGVuID0gbGlua3MubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0bGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lciggJ2ZvY3VzJywgdG9nZ2xlRm9jdXMsIHRydWUgKTtcblx0XHRsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCAnYmx1cicsIHRvZ2dsZUZvY3VzLCB0cnVlICk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyBvciByZW1vdmVzIC5mb2N1cyBjbGFzcyBvbiBhbiBlbGVtZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlRm9jdXMoKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0Ly8gTW92ZSB1cCB0aHJvdWdoIHRoZSBhbmNlc3RvcnMgb2YgdGhlIGN1cnJlbnQgbGluayB1bnRpbCB3ZSBoaXQgLm5hdi1tZW51LlxuXHRcdHdoaWxlICggLTEgPT09IHNlbGYuY2xhc3NOYW1lLmluZGV4T2YoICdtZW51JyApICkge1xuXG5cdFx0XHQvLyBPbiBsaSBlbGVtZW50cyB0b2dnbGUgdGhlIGNsYXNzIC5mb2N1cy5cblx0XHRcdGlmICggJ2xpJyA9PT0gc2VsZi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgKSB7XG5cdFx0XHRcdGlmICggLTEgIT09IHNlbGYuY2xhc3NOYW1lLmluZGV4T2YoICdmb2N1cycgKSApIHtcblx0XHRcdFx0XHRzZWxmLmNsYXNzTmFtZSA9IHNlbGYuY2xhc3NOYW1lLnJlcGxhY2UoICcgZm9jdXMnLCAnJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNlbGYuY2xhc3NOYW1lICs9ICcgZm9jdXMnO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHNlbGYgPSBzZWxmLnBhcmVudEVsZW1lbnQ7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRvZ2dsZXMgYGZvY3VzYCBjbGFzcyB0byBhbGxvdyBzdWJtZW51IGFjY2VzcyBvbiB0YWJsZXRzLlxuXHQgKi9cblx0KCBmdW5jdGlvbiggY29udGFpbmVyICkge1xuXHRcdHZhciB0b3VjaFN0YXJ0Rm4sIGksXG5cdFx0XHRwYXJlbnRMaW5rID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoICcubWVudS1pdGVtLWhhcy1jaGlsZHJlbiA+IGEsIC5wYWdlX2l0ZW1faGFzX2NoaWxkcmVuID4gYScgKTtcblxuXHRcdGlmICggJ29udG91Y2hzdGFydCcgaW4gd2luZG93ICkge1xuXHRcdFx0dG91Y2hTdGFydEZuID0gZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdHZhciBtZW51SXRlbSA9IHRoaXMucGFyZW50Tm9kZSwgaTtcblxuXHRcdFx0XHRpZiAoICEgbWVudUl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCAnZm9jdXMnICkgKSB7XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgbWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbi5sZW5ndGg7ICsraSApIHtcblx0XHRcdFx0XHRcdGlmICggbWVudUl0ZW0gPT09IG1lbnVJdGVtLnBhcmVudE5vZGUuY2hpbGRyZW5baV0gKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bWVudUl0ZW0ucGFyZW50Tm9kZS5jaGlsZHJlbltpXS5jbGFzc0xpc3QucmVtb3ZlKCAnZm9jdXMnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG1lbnVJdGVtLmNsYXNzTGlzdC5hZGQoICdmb2N1cycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZW51SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCAnZm9jdXMnICk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGZvciAoIGkgPSAwOyBpIDwgcGFyZW50TGluay5sZW5ndGg7ICsraSApIHtcblx0XHRcdFx0cGFyZW50TGlua1tpXS5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIHRvdWNoU3RhcnRGbiwgZmFsc2UgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0oIGNvbnRhaW5lciApICk7XG59ICkoKTtcbiJdfQ==
