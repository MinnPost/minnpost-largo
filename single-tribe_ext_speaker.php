<?php
/**
 * The template for displaying the festival speaker single page
 * This is not ideal because it doesn't use the event hierarchy from The Events Calendar, but it's not clear
 * how to do that in the V2 templating system of The Events Calendar when using custom post types
 * See tribe-ext-speaker-linked-post-type plugin, but the template part only works with their V1 templates.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

while ( have_posts() ) :
	the_post();
	$permalink_category = minnpost_get_event_category_slug( get_the_ID() );

	if ( '' !== $permalink_category ) :
		get_header( 'festival' );
	else :
		get_header();
	endif;
	?>

	<div id="primary" class="m-layout-primary o-festival o-festival-speaker o-festival-speaker-single">
		<main id="main" class="site-main">
			<?php get_template_part( 'template-parts/post-tribe_ext_speaker', $permalink_category ); ?>
		</main><!-- #main -->
	</div><!-- #primary -->
	<?php
	if ( '' !== $permalink_category ) :
		get_footer( 'festival' );
	else :
		get_footer();
	endif;
endwhile; // End of the loop.
