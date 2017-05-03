<?php
/**
 * Custom widget methods
 *
 * @package MinnPost Largo
 */

if ( ! function_exists( 'minnpost_largo_glean' ) ) :
	function minnpost_largo_glean($categories, $terms) {

		$the_query = new WP_Query(
			array(
				'posts_per_page' => 2,
				'cat' => $categories[0],
				'orderby' => 'date'
			)
		);

		?>

		<?php if ( $the_query->have_posts() ) : ?>

			<!-- the loop -->
			<?php $i = 0; while ( $the_query->have_posts() ) : $the_query->the_post(); ?>
				<?php if ( $i === 0 ) : ?>
					<p class="spill-item-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></p>
					<div class="entry-meta">
						By <?php minnpost_posted_by(); ?> | <?php minnpost_posted_on(); ?> <?php minnpost_edit_link(); ?>
					</div>
				<?php else: ?>
					<p><a href="<?php the_permalink(); ?>">Read <?php the_date('l A'); ?> edition</a></p>
				<?php endif; ?>
			<?php $i++; endwhile; ?>
			<!-- end of the loop -->
			<p><a href="<?php echo esc_url( get_category_link( $categories[0] ) ); ?>">More</a></p>

			<?php wp_reset_postdata(); ?>

		<?php endif; ?>

		<?php
	}
endif;