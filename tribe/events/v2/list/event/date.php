<?php
/**
 * View: List View - Single Event Date
 *
 * This overrides the default the-events-calendar/views/v2/list/event/date.php
 *
 */
use Tribe__Date_Utils as Dates;

$event_date_attr = $event->dates->start->format( Dates::DBDATEFORMAT );
$start_date      = minnpost_largo_get_ap_date( tribe_get_start_date( $event->ID, false, 'j-F' ) );
$start_time      = minnpost_largo_get_ap_time( tribe_get_start_date( $event->ID, false, 'H:i' ) );
$end_date        = minnpost_largo_get_ap_date( tribe_get_end_date( $event->ID, false, 'j-F' ) );
$end_time        = minnpost_largo_get_ap_time( tribe_get_end_date( $event->ID, false, 'H:i' ) );

?>
<time class="m-event-datetime tribe-events-calendar-list__event-datetime" datetime="<?php echo esc_attr( $event_date_attr ); ?>">
	<span class="a-event-date"><i class="far fa-calendar-alt"></i><?php echo minnpost_largo_full_event_date( $start_date, $end_date ); ?></span>
	<span class="a-event-time"><i class="far fa-clock"></i><?php echo minnpost_largo_full_event_time( $start_time, $end_time ); ?></span>
</time>
