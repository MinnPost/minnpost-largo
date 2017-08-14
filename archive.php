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
