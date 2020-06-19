<article id="post-<?php the_ID(); ?>" <?php post_class( 'm-post m-event m-event m-event-single' ); ?>>
	<header class="m-event-header m-entry-header tribe-events-calendar-list__event-header">
		<?php
		$hide_title = get_post_meta( $id, '_mp_remove_title_from_display', true );
		if ( 'on' !== $hide_title ) :
			if ( is_single() ) :
				the_title( '<h1 class="a-entry-title a-event-title tribe-events-single-event-title">', '</h1>' );
			else :
				the_title( '<h3 class="a-entry-title a-event-title tribe-events-single-event-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h3>' );
			endif;
		endif;
		?>
		<?php
		$hide_notices = get_post_meta( $id, '_mp_remove_notice_from_display', true );
		if ( 'on' !== $hide_notices ) :
			?>
		<div class="m-event-notices">
			<?php tribe_the_notices(); ?>
		</div>
		<?php endif; ?>
	</header>

	<div class="o-entry">
		<div class="m-entry-meta">
			<?php minnpost_share_buttons(); ?>
		</div><!-- .m-entry-meta -->

		<div class="m-entry-content">
			<?php
			$hide_details = get_post_meta( $id, '_mp_remove_event_details_from_display', true );
			if ( 'on' !== $hide_details ) :
				?>
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
			<?php endif; ?>
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
