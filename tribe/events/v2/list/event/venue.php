<?php
/**
 * View: List Single Event Venue
 *
 * This overrides the default the-events-calendar/views/v2/list/event/venue.php
 *
 * See more documentation about our views templating system.
 *
 */

if ( ! $event->venues->count() ) {
	return;
}

$separator            = esc_html_x( ', ', 'Address separator', 'the-events-calendar' );
$venue                = $event->venues[0];
$append_after_address = array_filter( array_map( 'trim', array( $venue->city, $venue->state_province, $venue->state, $venue->province ) ) );
$address              = $venue->address . ( $venue->address && $append_after_address ? $separator : '' );
?>
<address class="m-event-venue tribe-events-calendar-list__event-venue tribe-common-b2">
	<span class="a-event-venue-title tribe-events-calendar-list__event-venue-title">
		<?php echo wp_kses_post( $venue->post_title ); ?>
	</span>
	<span class="a-event-venue-address tribe-events-calendar-list__event-venue-address">
		<?php echo esc_html( $address ); ?>
		<?php if ( $append_after_address ) : ?>
			<?php echo esc_html( reset( $append_after_address ) ); ?>
		<?php endif; ?>
	</span>
</address>
