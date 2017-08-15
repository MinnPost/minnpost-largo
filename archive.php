<?php
/**
 * The template for displaying archive pages
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Largo
 */

get_header(); ?>

	<div id="primary" class="m-layout-primary">
		<main id="main" class="site-main" role="main">

		<?php
		if ( have_posts() ) : ?>

			<header class="m-archive-header">
				<?php
					the_archive_title( '<h1 class="a-archive-title">', '</h1>' );
					the_archive_description( '<div class="archive-description">', '</div>' );
				?>
			</header><!-- .m-archive-header -->

			<?php if ( is_category() ) : ?>
				<aside class="m-archive-info m-category-info m-category-full-info">
					<?php
					$category_id = $wp_query->get_queried_object_id();
					// category meta
					minnpost_category_sponsorship( '', $category_id );
					minnpost_term_figure( $category_id );
					?>
					<ul class="a-archive-links a-category-links">
						<li class="a-rss-link"><a href="<?php echo get_category_feed_link( $category_id ); ?>">Subscribe with RSS</a></li>
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
			<?php endif; ?>

			<?php if ( is_category() ) : ?>
				<section class="m-archive m-archive-top m-category-top">
					<?php
					while ( have_posts() ) : the_post();
						if ( 3 > $wp_the_query->current_post ) :
							get_template_part( 'template-parts/content', 'top' );
						endif;
					endwhile;
					?>
				</section>
				<section class="m-archive m-archive-excerpt">
					<?php
					while ( have_posts() ) : the_post();
						if ( 3 < $wp_the_query->current_post ) :
							get_template_part( 'template-parts/content', 'excerpt' );
						endif;
					endwhile;
					?>
				</section>
			<?php else : ?>
				<section class="m-archive m-archive-excerpt">
					<?php
					while ( have_posts() ) : the_post();
						get_template_part( 'template-parts/content', 'excerpt' );
					endwhile;
					?>
				</section>
			<?php endif; ?>
			<?php
			numeric_pagination();

		else :
			get_template_part( 'template-parts/content', 'none' );
		endif; ?>

		</main><!-- #main -->

	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
