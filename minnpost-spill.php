<?php
/**
 * The template for displaying spill url pages
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */
get_header(); ?>

	<div id="primary" class="m-layout-primary o-archive-listing o-archive-listing-spill">
		<main id="main" class="site-main">

		<?php if ( have_posts() ) : ?>

			<header class="m-archive-header m-archive-header-spill">
				<?php the_archive_title( '<h1 class="a-archive-title">', '</h1>' ); ?>
			</header><!-- .m-archive-header -->

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

	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
