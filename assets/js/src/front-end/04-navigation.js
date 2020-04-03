/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */

//setupMenu( 'navigation-primary' );
//setupMenu( 'navigation-user-account-management' );
//setupNavSearch( 'navigation-primary' );

var navButton = document.querySelector( 'nav button' );
let menu = navButton.nextElementSibling;
navButton.addEventListener( 'click', function() {
    let expanded = this.getAttribute( 'aria-expanded' ) === 'true' || false;
    this.setAttribute( 'aria-expanded', ! expanded );
    let menu = this.nextElementSibling;
    menu.hidden = ! menu.hidden;
});
// escape key press
$(document).keyup(function(e) {
	if (27 === e.keyCode) {
		navButton.setAttribute( 'aria-expanded', false );
		//let menu = navButton.nextElementSibling;
		menu.hidden = true;
	}
});

document.addEventListener(
	"click", function( event ) {
		navButton.setAttribute( 'aria-expanded', false );
		//let menu = navButton.nextElementSibling;
		menu.hidden = true;
	}, true
);

function setupNavSearch( container ) {

	var navsearchcontainer, navsearchtoggle, navsearchform;

	container = document.getElementById( container );
	if ( ! container ) {
		return;
	}

	navsearchcontainer = $( 'li.search', $( container ) );
	navsearchtoggle    = $( 'li.search a', $( container ) );
	navsearchform      = container.getElementsByTagName( 'form' )[0];

	if ( 'undefined' === typeof navsearchtoggle || 'undefined' === typeof navsearchform ) {
		return;
	}

	if ( 0 < $( navsearchform ).length ) {
		$( document ).click( function( event ) {
			var $target = $( event.target );
			if ( ! $target.closest( navsearchcontainer ).length && $( navsearchform ).is( ':visible' ) ) {
				navsearchform.className = navsearchform.className.replace( ' toggled-form', '' );
				$( navsearchtoggle ).prop( 'aria-expanded', false );
				$( navsearchtoggle ).removeClass( 'toggled-form' );
			}
		});
		$( navsearchtoggle ).on( 'click', function( event ) {
			event.preventDefault();
			if ( -1 !== navsearchform.className.indexOf( 'toggled-form' ) ) {
				navsearchform.className = navsearchform.className.replace( ' toggled-form', '' );
				$( navsearchtoggle ).prop( 'aria-expanded', false );
				$( navsearchtoggle ).removeClass( 'toggled-form' );
			} else {
				navsearchform.className += ' toggled-form';
				$( navsearchtoggle ).prop( 'aria-expanded', true );
				$( navsearchtoggle ).addClass( 'toggled-form' );
			}
		});
	}
}

function setupMenu( container ) {
	var button, menu, links, i, len;
	container = document.getElementById( container );
	if ( ! container ) {
		return;
	}

	button = container.getElementsByTagName( 'button' )[0];
	if ( 'undefined' === typeof button ) {
		return;
	}

	menu = container.getElementsByTagName( 'ul' )[0];

	// Hide menu toggle button if menu is empty and return early.
	if ( 'undefined' === typeof menu ) {
		button.style.display = 'none';
		return;
	}

	menu.setAttribute( 'aria-expanded', 'false' );
	if ( -1 === menu.className.indexOf( 'menu' ) ) {
		menu.className += ' menu';
	}

	button.onclick = function() {
		if ( -1 !== container.className.indexOf( 'toggled' ) ) {
			container.className = container.className.replace( ' toggled', '' );
			button.setAttribute( 'aria-expanded', 'false' );
			menu.setAttribute( 'aria-expanded', 'false' );
		} else {
			container.className += ' toggled';
			button.setAttribute( 'aria-expanded', 'true' );
			menu.setAttribute( 'aria-expanded', 'true' );
		}
	};

	// Get all the link elements within the menu.
	links    = menu.getElementsByTagName( 'a' );

	// Each time a menu link is focused or blurred, toggle focus.
	for ( i = 0, len = links.length; i < len; i++ ) {
		links[i].addEventListener( 'focus', toggleFocus, true );
		links[i].addEventListener( 'blur', toggleFocus, true );
	}

	/**
	 * Toggles `focus` class to allow submenu access on tablets.
	 */
	( function( container ) {
		var touchStartFn, i,
			parentLink = container.querySelectorAll( '.menu-item-has-children > a, .page_item_has_children > a' );

		if ( 'ontouchstart' in window ) {
			touchStartFn = function( e ) {
				var menuItem = this.parentNode,
					i;

				if ( ! menuItem.classList.contains( 'focus' ) ) {
					e.preventDefault();
					for ( i = 0; i < menuItem.parentNode.children.length; ++i ) {
						if ( menuItem === menuItem.parentNode.children[i]) {
							continue;
						}
						menuItem.parentNode.children[i].classList.remove( 'focus' );
					}
					menuItem.classList.add( 'focus' );
				} else {
					menuItem.classList.remove( 'focus' );
				}
			};

			for ( i = 0; i < parentLink.length; ++i ) {
				parentLink[i].addEventListener( 'touchstart', touchStartFn, false );
			}
		}
	}( container ) );
}

/**
 * Sets or removes .focus class on an element.
 */
function toggleFocus() {
	var self = this;

	// Move up through the ancestors of the current link until we hit .nav-menu.
	while ( -1 === self.className.indexOf( 'menu' ) ) {

		// On li elements toggle the class .focus.
		if ( 'li' === self.tagName.toLowerCase() ) {
			if ( -1 !== self.className.indexOf( 'focus' ) ) {
				self.className = self.className.replace( ' focus', '' );
			} else {
				self.className += ' focus';
			}
		}

		self = self.parentElement;
	}
}

$( '#navigation-featured a' ).click( function( e ) {
	mp_analytics_tracking_event( 'event', 'Featured Bar Link', 'Click', this.href );
});

$( 'a.glean-sidebar' ).click( function( e ) {
	mp_analytics_tracking_event( 'event', 'Sidebar Support Link', 'Click', this.href );
});

$( 'a', $( '.o-site-sidebar' ) ).click( function( e ) {
	var widget_title = $( this ).closest( '.m-widget' ).find( 'h3' ).text();
	var zone_title   = $( this ).closest( '.m-zone' ).find( '.a-zone-title' ).text();
	var sidebar_section_title = '';
	if ( '' !== widget_title ) {
		sidebar_section_title = widget_title;
	} else if ( '' !== zone_title ) {
		sidebar_section_title = zone_title;
	}
	mp_analytics_tracking_event( 'event', 'Sidebar Link', 'Click', sidebar_section_title );
});

// user account navigation can be a dropdown
$( document ).ready( function() {

	// hide menu
	if ( 0 < $( '#user-account-access ul' ).length ) {
		$( '#user-account-access > li > a' ).on( 'click', function( event ) {
			$( '#user-account-access ul' ).toggleClass( 'visible' );
			event.preventDefault();
		});
	}
});
