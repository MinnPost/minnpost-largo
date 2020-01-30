<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package MinnPost Largo
 */

get_header(); ?>

	<div id="primary" class="m-layout-primary">
		<main id="main" class="site-main">

			<?php
			$query = new WP_Query(
				array(
					'post_type' => 'page',
					'pagename'  => 'page-not-found',
				)
			);
			while ( $query->have_posts() ) :
				$query->the_post();
				get_template_part( 'template-parts/content', 'page' );
			endwhile; // End of the loop.
			wp_reset_postdata();
			?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
