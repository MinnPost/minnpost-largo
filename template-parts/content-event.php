<article id="post-<?php the_ID(); ?>" <?php post_class( 'm-post m-event m-event m-event-single' ); ?>>
	<header class="m-event-header m-entry-header tribe-events-calendar-list__event-header">
		<h1 class="a-entry-title a-event-title tribe-events-single-event-title"><?php echo get_the_title(); ?></h1>
		<div class="m-event-notices">
			<?php tribe_the_notices(); ?>
		</div>
	</header>

	<div class="o-entry">
		<div class="m-entry-meta">
			<?php minnpost_share_buttons(); ?>
		</div><!-- .m-entry-meta -->

		<div class="m-entry-content">
			<div class="m-event-details">
				<?php do_action( 'tribe_events_single_event_before_the_meta' ); ?>
				<div class="m-event-date-and-calendar">
					<?php get_template_part( 'tribe/events/modules/meta/date' ); ?>
					<?php do_action( 'tribe_events_single_event_after_the_content' ); ?>
				</div>
				<?php get_template_part( 'tribe/events/modules/meta/venue' ); ?>
				<?php do_action( 'tribe_events_single_event_after_the_meta' ); ?>
				<?php get_template_part( 'tribe/events/modules/meta/cost' ); ?>
			</div>
			<?php minnpost_post_image( 'large' ); ?>
			<?php do_action( 'wp_message_inserter', 'above_article_body' ); ?>
			<?php do_action( 'tribe_events_single_event_before_the_content' ); ?>
			<div class="tribe-events-single-event-description tribe-events-content">
				<?php the_content(); ?>
			</div>
			<?php do_action( 'wp_message_inserter', 'below_article_body' ); ?>
		</div><!-- .m-entry-content -->
	</div>
</article> <!-- #post-x -->
