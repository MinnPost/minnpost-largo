<?php
/**
 * The template for displaying the MinnPost Festival archive
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */
get_header( 'festival' ); ?>

<div id="primary" class="m-layout-primary o-festival o-festival-archive">
	<main id="main" class="site-main">
		<?php
		while ( have_posts() ) :
			the_post();
			$args = array(
				'object_type' => 'festival',
			);
			get_template_part( 'template-parts/content-event-website', 'festival', $args );
		endwhile; // End of the loop.
		?>
	</main><!-- #main -->
</div><!-- #primary -->
<?php
get_footer( 'festival' );
