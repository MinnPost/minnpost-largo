/**
 * File navigation.js.
 *
 * Navigation scripts. Includes mobile or toggle behavior, analytics tracking of specific menus.
 * This file does not require jQuery.
 */

function setupPrimaryNav() {
	const primaryNavTransitioner = transitionHiddenElement( {
		element: document.querySelector( '.m-menu-primary-links' ),
		visibleClass: 'is-open',
		displayValue: 'flex'
	} );

	var primaryNavToggle = document.querySelector( 'nav button' );
	if ( null !== primaryNavToggle ) {
		primaryNavToggle.addEventListener( 'click', function( e ) {
			e.preventDefault();
			let expanded = 'true' === this.getAttribute( 'aria-expanded' ) || false;
			this.setAttribute( 'aria-expanded', ! expanded );
			if ( true === expanded ) {
				primaryNavTransitioner.transitionHide();
			} else {
				primaryNavTransitioner.transitionShow();
			}
		} );
	}

	const userNavTransitioner = transitionHiddenElement( {
		element: document.querySelector( '.your-account ul' ),
		visibleClass: 'is-open',
		displayValue: 'flex'
	} );

	var userNavToggle = document.querySelector( '.your-account > a' );
	if ( null !== userNavToggle ) {
		userNavToggle.addEventListener( 'click', function( e ) {
			e.preventDefault();
			let expanded = 'true' === this.getAttribute( 'aria-expanded' ) || false;
			this.setAttribute( 'aria-expanded', ! expanded );
			if ( true === expanded ) {
				userNavTransitioner.transitionHide();
			} else {
				userNavTransitioner.transitionShow();
			}
		} );
	}

	var target    = document.querySelector( 'nav .m-form-search fieldset .a-button-sentence' );
	if ( null !== target ) {
		var div       = document.createElement( 'div' );
		div.innerHTML = '<a href="#" class="a-close-button a-close-search"><i class="fas fa-times"></i></a>';
		var fragment  = document.createDocumentFragment();
		div.setAttribute( 'class', 'a-close-holder' );
		fragment.appendChild( div );
		target.appendChild( fragment );

		const searchTransitioner = transitionHiddenElement( {
			element: document.querySelector( '.m-menu-primary-actions .m-form-search' ),
			visibleClass: 'is-open',
			displayValue: 'flex'
		} );

		var searchVisible = document.querySelector( 'li.search > a' );
		searchVisible.addEventListener( 'click', function( e ) {
			e.preventDefault();
			let expanded = 'true' === searchVisible.getAttribute( 'aria-expanded' ) || false;
			searchVisible.setAttribute( 'aria-expanded', ! expanded );
			if ( true === expanded ) {
				searchTransitioner.transitionHide();
			} else {
				searchTransitioner.transitionShow();
			}
		} );

		var searchClose  = document.querySelector( '.a-close-search' );
		searchClose.addEventListener( 'click', function( e ) {
			e.preventDefault();
			let expanded = 'true' === searchVisible.getAttribute( 'aria-expanded' ) || false;
			searchVisible.setAttribute( 'aria-expanded', ! expanded );
			if ( true === expanded ) {
				searchTransitioner.transitionHide();
			} else {
				searchTransitioner.transitionShow();
			}
		} );
	}

	document.onkeydown = function( evt ) {
		evt = evt || window.event;
		var isEscape = false;
		if ( 'key' in evt ) {
			isEscape = ( 'Escape' === evt.key || 'Esc' === evt.key );
		} else {
			isEscape = ( 27 === evt.keyCode );
		}
		if ( isEscape ) {
			let primaryNavExpanded = 'true' === primaryNavToggle.getAttribute( 'aria-expanded' ) || false;
			let userNavExpanded = 'true' === userNavToggle.getAttribute( 'aria-expanded' ) || false;
			let searchIsVisible = 'true' === searchVisible.getAttribute( 'aria-expanded' ) || false;
			if ( undefined !== typeof primaryNavExpanded && true === primaryNavExpanded ) {
				primaryNavToggle.setAttribute( 'aria-expanded', ! primaryNavExpanded );
				primaryNavTransitioner.transitionHide();
			}
			if ( undefined !== typeof userNavExpanded && true === userNavExpanded ) {
				userNavToggle.setAttribute( 'aria-expanded', ! userNavExpanded );
				userNavTransitioner.transitionHide();
			}
			if ( undefined !== typeof searchIsVisible && true === searchIsVisible ) {
				searchVisible.setAttribute( 'aria-expanded', ! searchIsVisible );
				searchTransitioner.transitionHide();
			}
		}
	};
}
setupPrimaryNav();

function setupScrollNav() {

	let subNavScrollers = document.querySelectorAll( '.m-sub-navigation' );
	subNavScrollers.forEach( ( currentValue ) => {
		PriorityNavScroller( {
			selector: currentValue,
			navSelector: '.m-subnav-navigation',
			contentSelector: '.m-menu-sub-navigation',
			itemSelector: 'li, a',
			buttonLeftSelector: '.nav-scroller-btn--left',
			buttonRightSelector: '.nav-scroller-btn--right'
		} );
	} );

	let paginationScrollers = document.querySelectorAll( '.m-pagination-navigation' );
	paginationScrollers.forEach( ( currentValue ) => {
		PriorityNavScroller( {
			selector: currentValue,
			navSelector: '.m-pagination-container',
			contentSelector: '.m-pagination-list',
			itemSelector: 'li, a',
			buttonLeftSelector: '.nav-scroller-btn--left',
			buttonRightSelector: '.nav-scroller-btn--right'
		} );
	} );

}
setupScrollNav();

// sidebar link click
document.querySelectorAll( '.o-site-sidebar a' ).forEach(
    sidebarLink => sidebarLink.addEventListener( 'click', ( e ) => {
		let closestWidget       = sidebarLink.closest( '.m-widget' );
		let closestZone         = sidebarLink.closest( '.m-zone' );
		let widgetTitle         = '';
		let zoneTitle           = '';
		let sidebarSectionTitle = '';
		if ( null !== closestWidget ) {
			widgetTitle = closestWidget.querySelector( 'h3' ).textContent;
		} else if ( null !== closestZone ) {
			zoneTitle = closestZone.querySelector( '.a-zone-title' ).textContent;
		}
		if ( null !== widgetTitle ) {
			sidebarSectionTitle = widgetTitle;
		} else if ( null !== zoneTitle ) {
			sidebarSectionTitle = zoneTitle;
		}
		mpAnalyticsTrackingEvent( 'event', 'Sidebar Link', 'Click', sidebarSectionTitle );
    } )
);

// related section link click
document.querySelectorAll( '.m-related a' ).forEach(
    relatedLink => relatedLink.addEventListener( 'click', ( e ) => {
		mpAnalyticsTrackingEvent( 'event', 'Related Section Link', 'Click', location.pathname );
    } )
);
