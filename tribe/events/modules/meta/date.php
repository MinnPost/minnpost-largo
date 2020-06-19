<?php
/**
 * Single Event Meta (Date) Template
 *
 */
use Tribe__Date_Utils as Dates;
$event_date_attr = tribe_get_start_date( get_the_ID(), false, Dates::DBDATEFORMAT );
?>
<time class="m-event-datetime tribe-events-calendar-list__event-datetime" datetime="<?php echo esc_attr( $event_date_attr ); ?>">
	<span class="a-event-date"><i class="far fa-calendar-alt"></i><?php echo minnpost_largo_full_event_date(); ?></span>
	<span class="a-event-time"><i class="far fa-clock"></i><?php echo minnpost_largo_full_event_time(); ?></span>
</time>
