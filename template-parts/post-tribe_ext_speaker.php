<?php
/**
 * Template part for displaying non-categorized speaker posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

$post_class       = 'm-post m-post-speaker m-post-speaker-full';
$speaker_instance = Tribe__Extension__Speaker_Linked_Post_Type::instance();
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( $post_class ); ?>>
	<div class="m-entry-content">
		<div class="m-archive-info m-author-info m-author-excerpt">						   
			<?php minnpost_speaker_figure( get_the_ID(), 'full', 'content', true, 'the_title', true, false, '_tribe_ext_speaker_title', true, true ); ?>
		</div>
		<?php $events = $speaker_instance->get_events( get_the_ID() ); ?>
		<?php if ( $events->have_posts() ) : ?>
			<section class="m-archive m-archive-events tribe-events-calendar-list">
				<h2>
				<?php
				echo sprintf(
					// translators: 1) speaker name
					__( 'MinnPost events with %1$s', 'minnpost-largo' ),
					get_the_title()
				);
				?>
				</h2>
				<?php
				$content_display_args = array(
					'use_permalink' => true,
				);
				while ( $events->have_posts() ) {
					$events->the_post();
					set_query_var( 'current_post', $events->current_post );
					get_template_part( 'template-parts/post', get_post_type() . '-excerpt', $content_display_args );
				}
				wp_reset_postdata();
				?>
			</section>
		<?php endif; ?>
	</div>
</article>
