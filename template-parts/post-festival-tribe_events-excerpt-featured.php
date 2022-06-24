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
if ( true === $args['featured'] ) {
	$post_class .= ' m-festival-post-event-featured';
}
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( $post_class ); ?>>

	<aside class="m-featured-event-details">
		<?php
		$hide_details = get_post_meta( $id, '_mp_remove_event_details_from_display', true );
		if ( 'on' !== $hide_details ) :
			?>
		<div class="m-event-details">
			<div class="m-event-date-and-calendar">
				<?php
				get_template_part(
					'tribe/events/modules/meta/date',
					'',
					array(
						'show_timezone'      => true,
						'separator'          => '&ndash;',
						'show_calendar_link' => false,
						'show_end_time'      => false,
					)
				);
				?>
			</div>
		</div>
		<?php endif; ?>
	</aside>

	<?php if ( ! empty( get_minnpost_post_image( 'feature-large' ) ) ) : ?>
		<figure class="m-featured-event-image">
			<?php minnpost_post_image( 'feature-large' ); ?>
		</figure>
	<div class="m-featured-event-content m-featured-event-content-with-image">
	<?php else : ?>
		<div class="m-featured-event-content m-featured-event-content-without-image">
	<?php endif; ?>
		<header class="m-entry-header">
			<?php if ( true === $args['use_permalink'] ) : ?>
				<?php the_title( '<h3 class="a-entry-title a-entry-title-excerpt a-festival-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h3>' ); ?>
			<?php else : ?>
				<?php the_title( '<h3 class="a-entry-title a-entry-title-excerpt a-festival-title">', '</h3>' ); ?>
			<?php endif; ?>
		</header>
		<div class="o-entry">
			<div class="m-entry-excerpt m-festival-event-content">
				<?php the_excerpt(); ?>
				<p><?php minnpost_event_website_pass_link( 'festival', array( 'label' => __( 'Get a Festival Pass', 'minnpost-largo' ) ) ); ?></p>
			</div>
		</div>
	</div>
</article>
