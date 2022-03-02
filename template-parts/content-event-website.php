<?php
/**
 * Template part for displaying an event website's listing page
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

$object_type           = $args['object_type'];
$content               = get_the_content();
$content               = apply_filters( 'the_content', $content );
$secondary_body        = get_post_meta( get_the_ID(), '_mp_' . $object_type . '_secondary_body', true );
$secondary_body        = apply_filters( 'the_content', $secondary_body );
$content_posts_heading = get_post_meta( get_the_ID(), '_mp_' . $object_type . '_content_posts_section_heading', true );
$content_posts         = get_post_meta( get_the_ID(), '_mp_' . $object_type . '_content_posts', true );
if ( '' !== $content || ! empty( $content_posts ) || '' !== $secondary_body ) :

	if ( '' !== $content && ! empty( $content_posts ) ) :
		?>
		<section class="m-event-content-section">
	<?php endif; ?>
	<?php
	if ( '' !== $content ) :
		?>
		<article id="post-<?php the_ID(); ?>" <?php post_class( 'm-post m-' . $object_type . ' m-' . $object_type . '-archive' ); ?>>
			<?php echo $content; ?>
		</article>
		<?php
	endif;
	if ( '' !== $content && ! empty( $content_posts ) ) :
		?>
		</section>
		<?php
	endif;

	if ( ! empty( $content_posts ) ) :
		$use_permalink = get_post_meta( get_the_ID(), '_mp_' . $object_type . '_content_posts_use_permalinks', true );
		if ( 'on' === $use_permalink ) {
			$use_permalink = true;
		} else {
			$use_permalink = false;
		}
		$load_content_instead_of_links = get_post_meta( get_the_ID(), '_mp_' . $object_type . '_content_posts_load_content_instead_of_links', true );
		if ( 'on' === $load_content_instead_of_links ) {
			$load_content_instead_of_links = true;
		} else {
			$load_content_instead_of_links = false;
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
			'featured'      => false,
		);
		if ( '' !== $content && ! empty( $content_posts ) ) {
			$content_display_args['featured'] = true;
		}

		if ( $content_query->have_posts() ) :
			$post_type_class = '';
			$post_type       = get_post_type( $content_query->posts[0]->ID );
			if ( '' !== $post_type ) {
				$post_type_class = ' m-archive-' . $object_type . ' m-archive-' . $object_type . '-' . $post_type;
			}
			?>
			<?php if ( true === $load_content_instead_of_links ) : ?>
				<?php
				while ( $content_query->have_posts() ) {
					$content_query->the_post();
					set_query_var( 'current_post', $content_query->current_post );
					get_template_part( 'template-parts/post-' . $object_type, get_post_type() . '-landing-page', $content_display_args );
				}
				wp_reset_postdata();
				?>
			<?php else : ?>
				<?php if ( '' !== $content && ! empty( $content_posts ) ) : ?>
					<div class="m-event-content-section o-full-width-wrapper">
						<div class="m-<?php echo $object_type; ?>-post-container">
				<?php endif; ?>
						<section class="m-archive<?php echo $post_type_class; ?>">
							<?php if ( '' !== $content_posts_heading ) : ?>
								<h2 class="a-zone-title"><?php echo $content_posts_heading; ?></h2>
							<?php endif; ?>
							<?php
							while ( $content_query->have_posts() ) {
								$content_query->the_post();
								set_query_var( 'current_post', $content_query->current_post );
								if ( false === $content_display_args['featured'] ) {
									get_template_part( 'template-parts/post-' . $object_type, get_post_type() . '-excerpt', $content_display_args );
								} else {
									get_template_part( 'template-parts/post-' . $object_type, get_post_type() . '-excerpt-featured', $content_display_args );
								}
							}
							wp_reset_postdata();
							?>
						</section>
				<?php if ( '' !== $content && ! empty( $content_posts ) ) : ?>
						<a class="a-button"><?php echo __( 'See all sessions', 'minnpost-largo' ); ?></a>
					</div>
				</div>
				<?php endif; ?>
			<?php endif; ?>
			<?php if ( '' !== $secondary_body ) : ?>
				<section class="m-event-content-section">
					<article id="post-<?php the_ID(); ?>-secondary-body" <?php post_class( 'm-post m-' . $object_type . ' m-' . $object_type . '-archive' ); ?>>
						<?php echo $secondary_body; ?>
					</article>
				</section>
			<?php endif; ?>
			<section class="m-event-content-section">
				<?php minnpost_event_website_pass_link( $object_type ); ?>
				<?php if ( 'tribe_events' === $post_type ) : ?>
					<?php minnpost_event_website_disclaimer_text( $object_type ); ?>
				<?php endif; ?>
			</section>
			<?php
		endif;
	endif;
else :
	get_template_part( 'template-parts/content', 'none' );
endif;
