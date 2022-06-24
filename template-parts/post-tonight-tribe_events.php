<?php
/**
 * Template part for displaying MinnPost Tonight event posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

$post_class = 'm-post m-tonight-post m-tonight-post-event m-tonight-post-event-full';
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( $post_class ); ?>>
	<header class="m-event-header m-entry-header tribe-events-calendar-list__event-header">
		<?php the_title( '<h1 class="a-entry-title a-event-title a-tonight-title tribe-events-single-event-title">', '</h1>' ); ?>
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
		<div class="m-entry-content">
			<?php
			$hide_details = get_post_meta( $id, '_mp_remove_event_details_from_display', true );
			if ( 'on' !== $hide_details ) :
				?>
			<div class="m-event-details">
				<?php do_action( 'tribe_events_single_event_before_the_meta' ); ?>
				<div class="m-event-date-and-calendar">
					<?php
					get_template_part(
						'tribe/events/modules/meta/date',
						'',
						array(
							'show_timezone' => true,
							'separator'     => '&ndash;',
						)
					);
					?>
					<?php do_action( 'tribe_events_single_event_after_the_content' ); ?>
				</div>
			</div>
			<?php endif; ?>
			<?php
			if ( '' !== get_minnpost_post_image( 'full' ) && is_singular() ) {
				minnpost_post_image( 'full' );
			}
			?>
			<?php do_action( 'tribe_events_single_event_before_the_content' ); ?>
			<div class="m-event-content m-tonight-event-content">
				<?php the_content(); ?>
			</div>
			<?php get_template_part( 'tribe/events/modules/meta/speaker' ); ?>
			<?php minnpost_event_website_pass_link( 'tonight' ); ?>
			<?php minnpost_event_website_disclaimer_text( 'tonight' ); ?>
		</div><!-- .m-entry-content -->
	</div>
</article> <!-- #post-x -->
