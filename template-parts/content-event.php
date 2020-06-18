<article id="post-<?php the_ID(); ?>" <?php post_class( 'm-post m-event' ); ?>>

	<!-- Notices -->
	<?php tribe_the_notices() ?>

	<?php the_title( '<h1 class="tribe-events-single-event-title">', '</h1>' ); ?>

	<div class="tribe-events-schedule tribe-clearfix">
		<?php echo tribe_events_event_schedule_details( get_the_ID(), '<h2>', '</h2>' ); ?>
		<?php if ( tribe_get_cost() ) : ?>
			<span class="tribe-events-cost"><?php echo tribe_get_cost( null, true ) ?></span>
		<?php endif; ?>
	</div>

	<!-- Event featured image, but exclude link -->
	<?php echo tribe_event_featured_image( get_the_ID(), 'full', false ); ?>

	<!-- Event content -->
	<?php do_action( 'tribe_events_single_event_before_the_content' ) ?>
	<div class="tribe-events-single-event-description tribe-events-content">
		<?php the_content(); ?>
	</div>
	<!-- .tribe-events-single-event-description -->
	<?php do_action( 'tribe_events_single_event_after_the_content' ) ?>

	<!-- Event meta -->
	<?php do_action( 'tribe_events_single_event_before_the_meta' ) ?>
	<?php tribe_get_template_part( 'modules/meta' ); ?>
	<?php do_action( 'tribe_events_single_event_after_the_meta' ) ?>
</article> <!-- #post-x -->
