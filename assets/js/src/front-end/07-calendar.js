var target    = document.querySelector( '.a-events-cal-links' );
var li        = document.createElement( 'li' );
li.innerHTML  = '<a href="#" class="a-close-button a-close-calendar"><i class="fas fa-times"></i></a>';
var fragment  = document.createDocumentFragment();
li.setAttribute( 'class', 'a-close-holder' );
fragment.appendChild( li );
target.appendChild( fragment );

const calendarTransitioner = transitionHiddenElement( {
    element: document.querySelector( '.a-events-cal-links' ),
    visibleClass: 'a-events-cal-link-visible',
    displayValue: 'block'
} );

var calendarVisible = document.querySelector( '.a-close-calendar' );
calendarVisible.addEventListener( 'click', function( e ) {
    e.preventDefault();
    let expanded = 'true' === calendarVisible.getAttribute( 'aria-expanded' ) || false;
    calendarVisible.setAttribute( 'aria-expanded', ! expanded );
    if ( true === expanded ) {
        calendarTransitioner.transitionHide();
    } else {
        calendarTransitioner.transitionShow();
    }
} );

var calendarClose = document.querySelector( '.a-close-calendar' );
calendarClose.addEventListener( 'click', function( e ) {
    e.preventDefault();
    let expanded = 'true' === calendarVisible.getAttribute( 'aria-expanded' ) || false;
    calendarVisible.setAttribute( 'aria-expanded', ! expanded );
    if ( true === expanded ) {
        calendarTransitioner.transitionHide();
    } else {
        calendarTransitioner.transitionShow();
    }
} );

// when a datetime is clicked, if the calendar link is present, show it
$( document ).on( 'click', '.m-event-datetime', function() {
    if ( 0 < $( '.a-events-cal-links' ).length ) {
        $( '.a-events-cal-links' ).toggleClass( 'a-events-cal-link-visible' );
    }
} );
