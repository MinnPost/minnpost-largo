<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

get_header(); 

$author = get_user_by('slug', get_query_var('author_name'));

if (!$author) {
	wp_redirect(home_url('/404/'));
}

?>

	<div id="primary" class="m-layout-primary">
		<main id="main" class="site-main">

		<?php if ( have_posts() ) : ?>

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
				while ( have_posts() ) :
					the_post();
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
