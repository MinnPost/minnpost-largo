<article id="post-<?php the_ID(); ?>" <?php post_class( 'm-post m-event' ); ?>>
		<header class="m-event-header m-entry-header tribe-events-calendar-list__event-header">
			<h1 class="a-entry-title a-event-title tribe-events-single-event-title"><?php echo get_the_title(); ?></h1>
			<div class="m-event-notices">
				<?php tribe_the_notices(); ?>
			</div>
			<!-- Event meta -->
			<?php do_action( 'tribe_events_single_event_before_the_meta' ); ?>
			<?php get_template_part( 'tribe/events/modules/meta/date' ); ?>
			<?php get_template_part( 'tribe/events/modules/meta/venue' ); ?>
			<?php do_action( 'tribe_events_single_event_after_the_meta' ); ?>
		</header>	
		<?php get_template_part( 'tribe/events/modules/meta/cost' ); ?>
		<?php minnpost_post_image( 'large' ); ?>

		<!-- Event content -->
		<?php do_action( 'tribe_events_single_event_before_the_content' ); ?>
		<div class="tribe-events-single-event-description tribe-events-content">
			<?php the_content(); ?>
		</div>
		<!-- .tribe-events-single-event-description -->
		<?php do_action( 'tribe_events_single_event_after_the_content' ); ?>
</article> <!-- #post-x -->
