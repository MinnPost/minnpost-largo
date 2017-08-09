<?php
/**
 * The front page template file
 *
 * This is the home page
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

get_header(); ?>
		
	<div id="primary" class="m-layout-primary o-homepage-listing">
		<main id="main" class="site-main m-homepage-zones" role="main">

			<section class="m-zone m-zone-homepage-top">
				<?php
				if ( function_exists( 'z_get_zone' ) ) {
					$the_query = z_get_zone_query( 'homepage-top' );
				}
				if ( $the_query->have_posts() ) :
					while ( $the_query->have_posts() ) : $the_query->the_post();
						get_template_part( 'template-parts/content', 'featured' ); // content-featured
					endwhile;
				else : // I'm not sure it's possible to have no posts when this page is shown
					get_template_part( 'template-parts/content', 'none' );
				endif; ?>
			</section>

		</main><!-- #main -->

		<aside id="content-sidebar" class="o-content-sidebar" role="complementary">
			<?php dynamic_sidebar( 'sidebar-2' ); ?>
		</aside>

	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
