<?php
/**
 * Template part for displaying a festival listing page
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

$content       = get_the_content();
$content       = apply_filters( 'the_content', $content );
$content_posts = get_post_meta( get_the_ID(), '_mp_festival_content_posts', true );
if ( '' !== $content || ! empty( $content_posts ) ) :

	if ( '' !== $content ) :
		?>
		<article id="post-<?php the_ID(); ?>" <?php post_class( 'm-post m-festival m-festival-archive' ); ?>>
			<?php echo $content; ?>
		</article><!-- #post-## -->
		<?php
	endif;

	if ( ! empty( $content_posts ) ) :
		$use_permalink = get_post_meta( get_the_ID(), '_mp_festival_content_posts_use_permalinks', true );
		if ( 'on' === $use_permalink ) {
			$use_permalink = true;
		} else {
			$use_permalink = false;
		}
		$content_query_args   = array(
			'post__in'       => $content_posts,
			'posts_per_page' => -1,
			'orderby'        => 'post__in',
			'post_status'    => 'any',
			'post_type'      => array( 'tribe_events', 'tribe_ext_speaker' ),
		);
		$content_query        = new WP_Query( $content_query_args );
		$content_display_args = array(
			'use_permalink' => $use_permalink,
		);

		if ( $content_query->have_posts() ) :
			$post_type_class = '';
			$post_type       = get_post_type( $content_query->posts[0]->ID );
			if ( '' !== $post_type ) {
				$post_type_class = ' m-archive-festival-' . $post_type;
			}
			?>
			<section class="m-archive m-archive-festival<?php echo $post_type_class; ?>">
				<?php
				while ( $content_query->have_posts() ) {
					$content_query->the_post();
					set_query_var( 'current_post', $content_query->current_post );
					get_template_part( 'template-parts/post-festival', get_post_type() . '-excerpt', $content_display_args );
				}
				wp_reset_postdata();
				?>
			</section>
			<?php minnpost_festival_pass_link(); ?>
			<?php if ( 'tribe_events' === $post_type ) : ?>
				<?php minnpost_festival_disclaimer_text(); ?>
			<?php endif; ?>
			<?php
		endif;
	endif;
else :
	get_template_part( 'template-parts/content', 'none' );
endif;
