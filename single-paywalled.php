<?php
/**
 * The template for displaying all paywalled single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package MinnPost Largo
 */

get_header(); ?>

	<div id="primary" class="m-layout-primary">
		<main id="main" class="site-main">
			<?php
			while ( have_posts() ) :
				the_post();
				get_template_part( 'template-parts/content-paywalled', get_post_format() );
			endwhile; // End of the loop.
			?>
		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
