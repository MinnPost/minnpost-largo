<?php
/**
 * View: List Single Event Venue
 *
 * This overrides the default the-events-calendar/views/v2/list/event/venue.php
 *
 * See more documentation about our views templating system.
 */

if ( ! $event->venues->count() ) {
	return;
}
$venue = $event->venues[0];
?>
<div class="m-event-venue vcard tribe-events-calendar-list__event-venue tribe-common-b2">
	<span class="fn a-event-venue-title a-event-venue-title tribe-events-calendar-list__event-venue-title">
		<?php echo wp_kses_post( $venue->post_title ); ?><?php echo esc_html( ',', 'minnpost-largo' ); ?>
	</span>
	<span class="adr a-event-venue-address">
		<?php if ( ! empty( $venue->address ) ) : ?>
		<span class="street-address"><?php echo esc_html( $venue->address ); ?>
												<?php
												if ( ! empty( $venue->address ) && ! empty( $venue->city ) ) :
													?>
													<?php echo esc_html( ',', 'minnpost-largo' ); ?><?php endif; ?></span>
		<?php endif; ?>
		<?php if ( ! empty( $venue->city ) ) : ?>
			<span class="locality"><?php echo esc_html( $venue->city ); ?></span>
		<?php endif; ?>
		<?php if ( ! empty( $venue->state ) ) : ?>
			<span class="region"><?php echo esc_html( $venue->state ); ?></span>
		<?php endif; ?>
	</span>
</div>
