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

	<?php
	if ( ! isset( $show_image ) || true === $show_image ) {
		minnpost_post_image(
			'feature-medium',
			array(),
			$event->ID
		);
	}
	?>

	<div class="tribe-events-calendar-list__event-details tribe-common-g-col">

		<header class="tribe-events-calendar-list__event-header">
			<?php $this->template( 'list/event/venue', array( 'event' => $event ) ); ?>
			<?php $this->template( 'list/event/title', array( 'event' => $event ) ); ?>
		</header>

		<?php $this->template( 'list/event/date', array( 'event' => $event ) ); ?>

		<?php if ( '' !== get_the_excerpt() ) : ?>
			<div class="m-entry-excerpt">
				<?php the_excerpt(); ?>
			</div><!-- .m-entry-excerpt -->
		<?php endif; ?>
		<?php $this->template( 'list/event/cost', [ 'event' => $event ] ); ?>

	</div>

</article>
