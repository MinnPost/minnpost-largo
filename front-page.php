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
			<?php
			if ( function_exists( 'z_get_zone' ) ) {
				$the_query = z_get_zone_query( 'homepage-top' );
			}
			if ( $the_query->have_posts() ) : ?>
				<section class="m-zone m-zone-homepage-top m-archive m-archive-top">
					<?php
					while ( $the_query->have_posts() ) : $the_query->the_post();
						get_template_part( 'template-parts/content', 'top' ); // content-top
					endwhile;
					?>
				</section>
			<?php endif; ?>
			
			<?php
			if ( function_exists( 'z_get_zone' ) ) {
				$the_query = z_get_zone_query( 'homepage-middle' );
			}
			if ( $the_query->have_posts() ) : ?>
				<section class="m-zone m-zone-homepage-middle m-archive m-archive-middle">
					<?php
					while ( $the_query->have_posts() ) : $the_query->the_post();
						get_template_part( 'template-parts/content', 'middle' ); // content-middle
					endwhile;
					?>
				</section>
			<?php endif; ?>

			<div class="m-ad-region m-ad-region-home">
				<?php do_action( 'acm_tag', 'Middle3' ); ?>
			</div>

			<?php
			if ( function_exists( 'z_get_zone' ) ) {
				$the_query = z_get_zone_query( 'homepage-bottom' );
			}
			if ( $the_query->have_posts() ) : ?>
				<section class="m-zone m-zone-homepage-bottom m-archive m-archive-excerpt">
					<?php
					while ( $the_query->have_posts() ) : $the_query->the_post();
						get_template_part( 'template-parts/content', 'excerpt' ); // content-excerpt
					endwhile;
					?>
				</section>
			<?php endif; ?>

		</main><!-- #main -->

		<aside id="content-sidebar" class="o-content-sidebar" role="complementary">
			<?php dynamic_sidebar( 'sidebar-2' ); ?>
		</aside>

	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
