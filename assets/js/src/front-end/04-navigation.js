/**
 * File navigation.js.
 *
 * Navigation scripts. Includes mobile or toggle behavior, analytics tracking of specific menus.
 */

function setupPrimaryNav() {
	const navTransitioner = transitionHiddenElement({
	  element: document.querySelector( '.m-menu-primary-links' ),
	  visibleClass: 'is-open',
	  displayValue: 'flex'
	});

	var navToggle = document.querySelector( 'nav button' );
	navToggle.addEventListener( 'click', function(e) {
		e.preventDefault();
		let expanded = this.getAttribute( 'aria-expanded' ) === 'true' || false;
		this.setAttribute( 'aria-expanded', ! expanded );
		if ( true === expanded ) {
			navTransitioner.transitionHide();	
		} else {
			navTransitioner.transitionShow();
		}
	});

	var target = document.querySelector( 'nav .m-form-search fieldset' );
	var span = document.createElement( 'span');
	span.innerHTML = '<a href="#" class="a-close-search"><i class="fas fa-times"></i></a>';

	var div = document.createElement('div');
	div.appendChild(span);

	var fragment = document.createDocumentFragment();
	fragment.appendChild(div);

	target.appendChild(fragment);

	const searchTransitioner = transitionHiddenElement({
	  element: document.querySelector( '.m-menu-primary-actions .m-form-search' ),
	  visibleClass: 'is-open',
	  displayValue: 'flex'
	});

	var searchVisible = document.querySelector( 'li.search > a' );
	searchVisible.addEventListener( 'click', function(e) {
		e.preventDefault();
		let expanded = searchVisible.getAttribute( 'aria-expanded' ) === 'true' || false;
		searchVisible.setAttribute( 'aria-expanded', ! expanded );
		if ( true === expanded ) {
			searchTransitioner.transitionHide();
		} else {
			searchTransitioner.transitionShow();
		}
	});

	var searchClose  = document.querySelector( '.a-close-search' );
	searchClose.addEventListener( 'click', function(e) {
		e.preventDefault();
		let expanded = searchVisible.getAttribute( 'aria-expanded' ) === 'true' || false;
		searchVisible.setAttribute( 'aria-expanded', ! expanded );
		if ( true === expanded ) {
			searchTransitioner.transitionHide();
		} else {
			searchTransitioner.transitionShow();
		}
	});

	// escape key press
	$(document).keyup(function(e) {
		if (27 === e.keyCode ) {
			let expanded = navToggle.getAttribute( 'aria-expanded' ) === 'true' || false;
			let searchIsVisible = searchVisible.getAttribute( 'aria-expanded' ) === 'true' || false;
			if ( undefined !== typeof expanded && true === expanded ) {
				navToggle.setAttribute( 'aria-expanded', ! expanded );
				navTransitioner.transitionHide();	
			}
			if ( undefined !== typeof searchIsVisible && true === searchIsVisible ) {
				searchVisible.setAttribute( 'aria-expanded', ! searchIsVisible );
				searchTransitioner.transitionHide();
			}
		}
	});
}

setupPrimaryNav();

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
