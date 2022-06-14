<?php
/**
 * Single Event Meta (Date) Template
 */
use Tribe__Date_Utils as Dates;
$event_id        = apply_filters( 'minnpost_largo_set_event_id', get_the_ID(), $args );
$event_date_attr = tribe_get_start_date( $event_id, false, Dates::DBDATEFORMAT );
$show_link       = isset( $args['show_calendar_link'] ) ? $args['show_calendar_link'] : true;
?>
<time class="m-event-datetime tribe-events-calendar-list__event-datetime" datetime="<?php echo esc_attr( $event_date_attr ); ?>">
	<?php if ( true === $show_link ) : ?>
		<a href="#">
	<?php endif; ?>
		<span class="a-event-date">
			<?php if ( true === $show_link ) : ?>
				<i class="far fa-calendar-alt" title="<?php echo __( 'Add to your calendar', 'minnpost-largo' ); ?>"></i>
			<?php endif; ?>
			<span><?php echo minnpost_largo_full_event_date( $event_id, $args ); ?></span>
		</span>
		<span class="a-event-time">
			<?php if ( true === $show_link ) : ?>
				<i class="far fa-clock" title="<?php echo __( 'Add to your calendar', 'minnpost-largo' ); ?>"></i>
			<?php endif; ?>
			<span><?php echo minnpost_largo_full_event_time( $event_id, $args ); ?></span>
		</span>
	<?php if ( true === $show_link ) : ?>
		</a>
	<?php endif; ?>
</time>
