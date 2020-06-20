<?php
/**
 * View: List View - Single Event Title
 *
 * This overrides the default the-events-calendar/views/v2/list/event/title.php
 *
 * @var WP_Post $event The event post object with properties added by the `tribe_get_event` function.
 *
 */
?>
<h3 class="a-entry-title a-event-title tribe-events-calendar-list__event-title"><a href="<?php echo esc_url( $event->permalink ); ?>"><?php echo $event->title; ?></a></h3>
