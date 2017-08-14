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

			<?php if ( is_author() ) : ?>
				<?php
				$author_id = get_the_author_meta( 'ID' );
				minnpost_author_image();
				$text = get_post_meta( $author_id, '_mp_author_bio', true );
				echo $text;
				?>
				<ul class="a-author-links">
					<li><a href="<?php echo get_author_feed_link( $author_id ); ?>">Subscribe with RSS</a></li>
					<?php if ( '' !== get_post_meta( $author_id, 'cap-user_email', true ) ) : ?>
						<li><a href="mailto:<?php echo get_post_meta( $author_id, 'cap-user_email', true ); ?>">Email</a></li>
					<?php endif; ?>
					<?php if ( '' !== get_post_meta( $author_id, 'cap-twitter', true ) ) : ?>
						<li><a href="<?php echo get_post_meta( $author_id, 'cap-twitter', true ); ?>">Twitter</a></li>
					<?php endif; ?>
				</ul>
				<h2 class="a-archive-subtitle">Articles by this author:</h2>
			<?php endif; ?>

			<?php
			/* Start the Loop */
			while ( have_posts() ) : the_post();

				if ( 3 > $wp_the_query->current_post ) :

					/*
					 * Include the Post-Format-specific template for the content.
					 * If you want to override this in a child theme, then include a file
					 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
					 */
					get_template_part( 'template-parts/content', 'featured' );

				else :

					/*
					 * Include the Post-Format-specific template for the content.
					 * If you want to override this in a child theme, then include a file
					 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
					 */
					get_template_part( 'template-parts/content', 'excerpt' );

				endif;

			endwhile;

			numeric_pagination();

		else :
			get_template_part( 'template-parts/content', 'none' );
		endif; ?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
