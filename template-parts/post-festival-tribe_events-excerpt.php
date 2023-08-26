<?php
/**
 * Template part for displaying MinnPost Festival event posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

$post_class = 'm-post m-festival-post m-festival-post-event m-festival-post-event-excerpt';
if ( '' !== get_minnpost_post_image( 'feature-large' ) ) {
	$post_class .= ' m-festival-post-event-with-image';
}
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( $post_class ); ?>>
	<?php if ( '' !== get_minnpost_post_image() ) : ?>
		<div class="o-event-content-with-image">
	<?php endif; ?>
	<header class="m-entry-header">
		<?php if ( true === $args['use_permalink'] ) : ?>
			<?php the_title( '<h3 class="a-entry-title a-entry-title-excerpt a-festival-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h3>' ); ?>
		<?php else : ?>
			<?php the_title( '<h3 class="a-entry-title a-entry-title-excerpt a-festival-title">', '</h3>' ); ?>
		<?php endif; ?>
		<?php
		$hide_notices = get_post_meta( get_the_ID(), '_mp_remove_notice_from_display', true );
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
			$hide_details = get_post_meta( get_the_ID(), '_mp_remove_event_details_from_display', true );
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
				</div>
			</div>
			<?php
				get_template_part(
					'tribe/events/modules/meta/venue-simple'
				);
				?>
			<?php endif; ?>
			<div class="m-event-content m-festival-event-content">
				<?php the_content(); ?>
			</div>
			<?php get_template_part( 'tribe/events/modules/meta/speaker' ); ?>
		</div>
	</div>
	<?php if ( '' !== get_minnpost_post_image( 'feature-large' ) ) : ?>
		</div>
		<?php minnpost_post_image( 'feature-large' ); ?>
	<?php endif; ?>
</article>
