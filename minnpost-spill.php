<?php
/**
 * The template for displaying spill url pages
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */
get_header(); ?>

	<div id="primary" class="m-layout-primary">
		<main id="main" class="site-main" role="main">

		<?php
		if ( have_posts() ) :
		?>

			<header class="m-archive-header">
				<?php
					the_archive_title( '<h1 class="a-archive-title">', '</h1>' );
					the_archive_description( '<div class="archive-description">', '</div>' );
				?>
			</header><!-- .m-archive-header -->

			<aside class="m-archive-info m-category-info m-category-full-info">
			</aside>

			<section class="m-archive m-archive-excerpt">
				<?php
				while ( have_posts() ) : the_post();
					get_template_part( 'template-parts/content', 'excerpt' );
				endwhile;
				?>
			</section>
			<?php
			numeric_pagination();

		else :
			get_template_part( 'template-parts/content', 'none' );
		endif;
		?>

		</main><!-- #main -->

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
