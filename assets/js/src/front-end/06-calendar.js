/**
 * Methods for events
 *
 * This file does not require jQuery.
 *
 */

const targets = document.querySelectorAll( '.a-events-cal-links' );
targets.forEach( function( target ) {
    setCalendar( target );
});

function setCalendar( target ) {
    if ( null !== target ) {
        var li        = document.createElement( 'li' );
        li.innerHTML  = '<a href="#" class="a-close-button a-close-calendar"><i class="fas fa-times"></i></a>';
        var fragment  = document.createDocumentFragment();
        li.setAttribute( 'class', 'a-close-holder' );
        fragment.appendChild( li );
        target.appendChild( fragment );
    }
}

const calendarsVisible = document.querySelectorAll( '.m-event-datetime a' );
calendarsVisible.forEach( function( calendarVisible ) {
    showCalendar( calendarVisible );
});

function showCalendar( calendarVisible ) {
    const dateHolder = calendarVisible.closest( '.m-event-date-and-calendar' );
    const calendarTransitioner = transitionHiddenElement( {
        element: dateHolder.querySelector( '.a-events-cal-links' ),
        visibleClass: 'a-events-cal-link-visible',
        displayValue: 'block'
    } );

    if ( null !== calendarVisible ) {
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

        var calendarClose = dateHolder.querySelector( '.a-close-calendar' );
        if ( null !== calendarClose ) {
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
        }
    }
}
