<?php
/**
 * The template for displaying the MinnPost Tonight single event
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */
get_header( 'tonight' ); ?>

	<div id="primary" class="m-layout-primary o-tonight o-tonight-single">
		<main id="main" class="site-main">
			<?php
			while ( have_posts() ) :
				the_post();
				get_template_part( 'template-parts/post-tonight', 'tribe_events' );
			endwhile; // End of the loop.
			?>
		</main><!-- #main -->
	</div><!-- #primary -->
<?php
get_footer( 'tonight' );
