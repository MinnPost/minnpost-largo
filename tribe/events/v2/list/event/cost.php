<?php
/**
 * View: List Single Event Cost
 *
 * This overrides the default the-events-calendar/views/v2/list/event/cost.php
 *
 * @var WP_Post $event The event post object with properties added by the `tribe_get_event` function.
 *
 * @see tribe_get_event() For the format of the event object.
 */
if ( empty( $event->cost ) ) {
	return;
}
?>
<div class="a-event-cta a-event-cost">
	<span class="a-event-price">
		<?php
		echo sprintf(
			// translators: 1) cost
			__( 'Cost: %1$s', 'minnpost-largo' ),
			esc_html( $event->cost )
		);
		?>
	</span>
</div>
