<?php
/**
 * Custom widget methods
 *
 * @package MinnPost Largo
 */

if ( ! function_exists( 'minnpost_largo_glean' ) ) :
	function minnpost_largo_glean( $before_title, $title, $after_title, $content, $categories, $terms ) {
		if ( ! isset( $categories[0] ) ) {
			$category = get_category_by_slug( 'glean' );
			$category = $category->cat_ID;
		} else {
			$category = $categories[0];
			if ( ! is_integer( $category ) ) {
				$category = get_category_by_slug( 'glean' );
				$category = $category->cat_ID;
			}
		}
		if ( $title ) {
			$before_title = str_replace( 'widget-title', 'a-widget-title', $before_title );
			echo $before_title . '<a href="' . esc_url( get_category_link( $category ) ) . '">' . $title . '</a>' . $after_title;
		}
		if ( '' !== $content ) {
			echo $content;
		}

		$the_query = new WP_Query(
			array(
				'posts_per_page' => 2,
				'cat'            => $category,
				'orderby'        => 'date',
			)
		);
		if ( 'production' === VIP_GO_ENV ) {
			$the_query['es'] = true; // elasticsearch on production only
		}

		?>

		<?php if ( $the_query->have_posts() ) : ?>
			<article id="<?php the_ID(); ?>" class="m-post m-post-glean">
				<!-- the loop -->
				<?php $i = 0; while ( $the_query->have_posts() ) : $the_query->the_post(); ?>
					<?php if ( 0 === $i ) : ?>
						<header class="m-entry-header">
							<?php the_title( '<h3 class="a-entry-title a-spill-entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h3>' ); ?>

							<?php if ( 'post' === get_post_type() ) : ?>

							<div class="m-entry-meta">
								<?php minnpost_posted_by(); ?> | <?php minnpost_posted_on(); ?> <?php minnpost_edit_link(); ?>
							</div>

							<?php endif; ?>

						</header><!-- .m-entry-header -->

						<div class="m-entry-excerpt">
							<?php the_excerpt(); ?>
						</div><!-- .m-entry-excerpt -->
					<?php else : ?>
						<p><a href="<?php the_permalink(); ?>">Read <?php the_date('l A'); ?> edition</a></p>
					<?php endif; ?>
				<?php $i++; endwhile; ?>
				<!-- end of the loop -->
				<p class="a-more a-glean-more"><a href="<?php echo esc_url( get_category_link( $category ) ); ?>">More</a></p>

				<?php wp_reset_postdata(); ?>
			</article>

		<?php endif; ?>

		<?php
	}
endif;
