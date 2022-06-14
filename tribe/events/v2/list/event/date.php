<?php
/**
 * View: List View - Single Event Date
 *
 * This overrides the default the-events-calendar/views/v2/list/event/date.php
 */
use Tribe__Date_Utils as Dates;
$event_date_attr = $event->dates->start->format( Dates::DBDATEFORMAT );
?>
<time class="m-event-datetime tribe-events-calendar-list__event-datetime" datetime="<?php echo esc_attr( $event_date_attr ); ?>">
	<span class="a-event-date"><i class="far fa-calendar-alt"></i><?php echo minnpost_largo_full_event_date( $event->ID ); ?></span>
	<span class="a-event-time"><i class="far fa-clock"></i><?php echo minnpost_largo_full_event_time( $event->ID ); ?></span>
</time>
