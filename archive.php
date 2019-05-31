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
		<main id="main" class="site-main">

		<?php if ( have_posts() ) : ?>

			<?php
			if ( is_category() ) {
				$category_id = $wp_query->get_queried_object_id();
				$figure      = minnpost_get_term_figure( $category_id );
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
					if ( '' !== $figure ) {
						// category meta
						$sponsorship = minnpost_get_category_sponsorship( '', $category_id );
						if ( '' !== $sponsorship ) {
							echo $sponsorship;
						}
						echo $figure;
					} else {
						$text = minnpost_get_term_text( $category_id );
						if ( '' !== $text ) {
							echo '<div class="a-description">' . $text . '</div>';
						}
					}
					?>
					<?php
					$term_extra_links = minnpost_get_term_extra_links( $category_id );
					if ( '' !== $term_extra_links ) :
						?>
						<ul class="a-archive-links a-category-links">
							<?php minnpost_term_extra_links( $category_id ); ?>
						</ul>
					<?php endif; ?>
				</aside>
			<?php elseif ( is_author() ) : ?>
				<aside class="m-archive-info m-author-info m-author-full-info">
					<?php
					$author_id = get_the_author_meta( 'ID' );
					minnpost_author_figure();
					$author_email   = get_post_meta( $author_id, 'cap-user_email', true );
					$author_twitter = get_post_meta( $author_id, 'cap-twitter', true );
					if ( '' !== $author_email || '' !== $author_twitter ) :
						?>
						<ul class="a-archive-links a-author-links">
							<?php if ( '' !== $author_email ) : ?>
								<li class="a-email-link"><a href="mailto:<?php echo $author_email; ?>">Email</a></li>
							<?php endif; ?>
							<?php if ( '' !== $author_twitter ) : ?>
								<li class="a-twitter-link"><a href="<?php echo $author_twitter; ?>">Twitter</a></li>
							<?php endif; ?>
						</ul>
					<?php endif; ?>
				</aside>
				<h2 class="a-archive-subtitle">Articles by this author:</h2>
			<?php endif; ?>

			<?php
			$paged        = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
			$featured_num = get_query_var( 'featured_num' );
			?>

			<?php if ( is_category() && 1 === $paged ) : ?>
				<section class="m-archive m-archive-top m-category-top">
					<?php
					while ( have_posts() ) :
						the_post();
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
					while ( have_posts() ) :
						the_post();
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
												<?php minnpost_term_figure( $value, 'category-featured-column', false, false ); ?>
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
					while ( have_posts() ) :
						the_post();
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
