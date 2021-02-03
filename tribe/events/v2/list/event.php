<?php
/**
 * View: List Event
 *
 * This overrides the default the-events-calendar/views/v2/list/event.php
 *
 */

$event_classes = tribe_get_post_class( array( 'm-post, m-event, tribe-events-calendar-list__event', 'tribe-common-g-row' ), $event->ID );
?>

<article id="post-<?php the_ID(); ?>" <?php tribe_classes( $event_classes ); ?>>
	<?php echo minnpost_event_category_breadcrumb(); ?>
	<header class="m-event-header m-entry-header tribe-events-calendar-list__event-header">
		<?php $this->template( 'list/event/title', array( 'event' => $event ) ); ?>
		<div class="m-event-details">
			<?php $this->template( 'list/event/date', array( 'event' => $event ) ); ?>
			<?php $this->template( 'list/event/venue', array( 'event' => $event ) ); ?>
			<?php $this->template( 'list/event/cost', array( 'event' => $event ) ); ?>
		</div>
	</header>
	<?php if ( '' !== get_the_excerpt() ) : ?>
		<div class="m-entry-excerpt m-entry-excerpt-event">
			<?php the_excerpt(); ?>
		</div>
	<?php endif; ?>
</article>
