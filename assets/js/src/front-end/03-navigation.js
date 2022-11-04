/**
 * File navigation.js.
 *
 * Navigation scripts. Includes mobile or toggle behavior, analytics tracking of specific menus.
 * This file does require jQuery in the functions at the bottom.
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

	document.onkeydown = function(evt) {
		evt = evt || window.event;
		var isEscape = false;
		if ( "key" in evt ) {
			isEscape = ( evt.key === "Escape" || evt.key === "Esc" );
		} else {
			isEscape = ( evt.keyCode === 27 );
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
setupPrimaryNav(); // this whole function does not require jquery.

function setupScrollNav() {

	let subNavScrollers = document.querySelectorAll( '.m-sub-navigation' );
	subNavScrollers.forEach((currentValue) => {
		PriorityNavScroller( {
			selector: currentValue,
			navSelector: '.m-subnav-navigation',
			contentSelector: '.m-menu-sub-navigation',
			itemSelector: 'li, a',
			buttonLeftSelector: '.nav-scroller-btn--left',
			buttonRightSelector: '.nav-scroller-btn--right'
		} );
	});

	let paginationScrollers = document.querySelectorAll( '.m-pagination-navigation' );
	paginationScrollers.forEach((currentValue) => {
		PriorityNavScroller( {
			selector: currentValue,
			navSelector: '.m-pagination-container',
			contentSelector: '.m-pagination-list',
			itemSelector: 'li, a',
			buttonLeftSelector: '.nav-scroller-btn--left',
			buttonRightSelector: '.nav-scroller-btn--right'
		} );
	});

}
setupScrollNav(); // this whole function does not require jquery.


// this is the part that requires jquery.
$( 'a', $( '.o-site-sidebar' ) ).click( function() {
	var widgetTitle         = $( this ).closest( '.m-widget' ).find( 'h3' ).text();
	var zoneTitle           = $( this ).closest( '.m-zone' ).find( '.a-zone-title' ).text();
	var sidebarSectionTitle = '';
	if ( '' !== widgetTitle ) {
		sidebarSectionTitle = widgetTitle;
	} else if ( '' !== zoneTitle ) {
		sidebarSectionTitle = zoneTitle;
	}
	mpAnalyticsTrackingEvent( 'event', 'Sidebar Link', 'Click', sidebarSectionTitle );
} );

$( 'a', $( '.m-related' ) ).click( function() {
	mpAnalyticsTrackingEvent( 'event', 'Related Section Link', 'Click', location.pathname );
} );
