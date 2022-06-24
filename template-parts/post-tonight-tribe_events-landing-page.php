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
	<div class="o-entry">
		<div class="m-entry-content">
			<?php
			if ( '' !== get_minnpost_post_image( 'full' ) && is_singular() ) {
				minnpost_post_image( 'full' );
			}
			?>
			<?php do_action( 'tribe_events_single_event_before_the_content' ); ?>
			<div class="m-event-content m-tonight-event-content">
				<?php the_content(); ?>
			</div>
		</div>
	</div>
	<?php get_template_part( 'tribe/events/modules/meta/speaker-image' ); ?>
	<div class="o-entry">
		<div class="m-entry-content">
			<?php minnpost_event_website_pass_link( 'tonight' ); ?>
			<?php minnpost_event_website_disclaimer_text( 'tonight' ); ?>
		</div><!-- .m-entry-content -->
	</div>
</article> <!-- #post-x -->
