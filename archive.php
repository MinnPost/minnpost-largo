<?php
/**
 * The template for displaying archive pages
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

get_header(); ?>

	<div id="primary" class="m-layout-primary o-archive-listing">
		<main id="main" class="site-main" role="main">

		<?php if ( have_posts() ) : ?>

			<?php
			if ( is_category() ) {
				$category_id = $wp_query->get_queried_object_id();
				$figure = minnpost_get_term_figure( $category_id );
				if ( '' === $figure ) {
					$sponsorship = minnpost_get_category_sponsorship( '', $category_id );
					if ( '' !== $sponsorship ) {
						echo '<div class="m-category-info">';
							echo $sponsorship;
						echo '</div>';
					}
				}
			}
			?>

			<header class="m-archive-header<?php if ( is_year() || is_month() || is_day() ) { echo ' m-archive-header-time'; } ?>">
				<?php
					the_archive_title( '<h1 class="a-archive-title">', '</h1>' );
					the_archive_description( '<div class="archive-description">', '</div>' );
				?>
			</header><!-- .m-archive-header -->

			<?php if ( is_category() ) : ?>
				<aside class="m-archive-info m-category-info m-category-full-info">
					<?php
					// category meta
					$sponsorship = minnpost_get_category_sponsorship( '', $category_id );
					if ( '' !== $sponsorship ) {
						echo $sponsorship;
					}
					if ( '' !== $figure ) {
						echo $figure;
					} else {
						$text = minnpost_get_term_text( $category_id );
						if ( '' !== $text ) {
							echo '<div class="a-description">' . $text . '</div>';
						}
					}
					?>
					<ul class="a-archive-links a-category-links">
						<li class="a-rss-link"><a href="<?php echo get_category_feed_link( $category_id ); ?>">Subscribe with RSS</a></li>
						<?php minnpost_term_extra_links( $category_id ); ?>
					</ul>
				</aside>
			<?php elseif ( is_author() ) : ?>
				<aside class="m-archive-info m-author-info m-author-full-info">
					<?php
					$author_id = get_the_author_meta( 'ID' );
					minnpost_author_figure();
					?>
					<ul class="a-archive-links a-author-links">
						<li class="a-rss-link"><a href="<?php echo get_author_feed_link( $author_id ); ?>">Subscribe with RSS</a></li>
						<?php if ( '' !== get_post_meta( $author_id, 'cap-user_email', true ) ) : ?>
							<li class="a-email-link"><a href="mailto:<?php echo get_post_meta( $author_id, 'cap-user_email', true ); ?>">Email</a></li>
						<?php endif; ?>
						<?php if ( '' !== get_post_meta( $author_id, 'cap-twitter', true ) ) : ?>
							<li class="a-twitter-link"><a href="<?php echo get_post_meta( $author_id, 'cap-twitter', true ); ?>">Twitter</a></li>
						<?php endif; ?>
					</ul>
				</aside>
				<h2 class="a-archive-subtitle">Articles by this author:</h2>
			<?php elseif ( is_tag() ) : ?>
				<aside class="m-archive-info m-category-info m-category-full-info">
					<?php $tag_id = $wp_query->get_queried_object_id(); ?>
					<ul class="a-archive-links a-tag-links">
						<li class="a-rss-link"><a href="<?php echo get_tag_feed_link( $tag_id ); ?>">Subscribe with RSS</a></li>
					</ul>
				</aside>
			<?php endif; ?>

			<?php
			$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
			$featured_num = get_query_var( 'featured_num' );
			?>

			<?php if ( is_category() && 1 === $paged ) : ?>
				<section class="m-archive m-archive-top m-category-top">
					<?php
					while ( have_posts() ) : the_post();
						if ( $featured_num > $wp_the_query->current_post ) :
							get_template_part( 'template-parts/content', 'top' );
						endif;
					endwhile;
					?>
				</section>
				<?php
				$featured_columns = get_query_var( 'featured_columns' );
				// getting rid of the icymi box
				// then we do need to allow for widgets to be here but that's it
				?>
				
				<?php if ( '' !== $featured_columns || is_active_sidebar( 'sidebar-2' ) ) : ?>
				<div class="m-archive-has-sidebar">
				<?php endif; ?>

				<section class="m-archive m-archive-excerpt">
					<?php
					while ( have_posts() ) : the_post();
						if ( $featured_num <= $wp_the_query->current_post ) :
							get_template_part( 'template-parts/content', 'excerpt' );
						endif;
					endwhile;
					?>
					<?php numeric_pagination(); ?>
				</section>
				<?php if ( '' !== $featured_columns || is_active_sidebar( 'sidebar-2' ) ) : ?>
					<aside id="content-sidebar" class="o-content-sidebar" role="complementary">
						<?php if ( '' !== $featured_columns ) : ?>
							<section class="m-featured-columns">
								<h2 class="a-sidebar-box-title">Featured Columns</h2>
								<ul>
									<?php foreach ( $featured_columns as $key => $value ) : ?>
										<li>
											<a href="<?php echo get_category_link( $value ); ?>">
												<?php minnpost_term_figure( $value, 'featured_column', false, false ); ?>
												<h3 class="a-featured-title"><?php echo get_cat_name( $value ); ?></h3>
											</a>
										</li>
									<?php endforeach; ?>
								</ul>
							</section>
						<?php endif; ?>
						<?php dynamic_sidebar( 'sidebar-2' ); ?>
					</aside>
				<?php endif; ?>

				<?php if ( '' !== $featured_columns || is_active_sidebar( 'sidebar-2' ) ) : ?>
				</div>
				<?php endif; ?>

			<?php else : ?>
				<section class="m-archive m-archive-excerpt">
					<?php
					while ( have_posts() ) : the_post();
						get_template_part( 'template-parts/content', 'excerpt' );
					endwhile;
					?>
					<?php numeric_pagination(); ?>
				</section>
			<?php endif; ?>

		<?php
		else :
			get_template_part( 'template-parts/content', 'none' );
		endif;
		?>

		</main><!-- #main -->

	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
