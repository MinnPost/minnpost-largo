<?php
/**
 * Template part for displaying festival event posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

$post_class = 'm-post m-festival-post m-festival-post-event m-festival-post-event-excerpt';
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( $post_class ); ?>>
	<header class="m-entry-header">
		<?php if ( true === $args['use_permalink'] ) : ?>
			<?php the_title( '<h3 class="a-entry-title a-entry-title-excerpt"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h3>' ); ?>
		<?php else : ?>
			<?php the_title( '<h3 class="a-entry-title a-entry-title-excerpt">', '</h3>' ); ?>
		<?php endif; ?>
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
		<div class="m-entry-excerpt">
			<?php
			$hide_details = get_post_meta( $id, '_mp_remove_event_details_from_display', true );
			if ( 'on' !== $hide_details ) :
				?>
			<div class="m-event-details">
				<?php do_action( 'tribe_events_single_event_before_the_meta' ); ?>
				<div class="m-event-date-and-calendar">
					<?php get_template_part( 'tribe/events/modules/meta/date', '', array( 'show_timezone' => true ) ); ?>
					<?php do_action( 'tribe_events_single_event_after_the_content' ); ?>
				</div>
			</div>
			<?php endif; ?>
			<?php do_action( 'tribe_events_single_event_before_the_content' ); ?>
			<div class="m-event-content m-festival-event-content">
				<?php the_content(); ?>
			</div>
			<?php get_template_part( 'tribe/events/modules/meta/speaker' ); ?>
		</div><!-- .m-entry-content -->
	</div>
</article> <!-- #post-x -->
