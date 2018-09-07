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
		<main id="main" class="site-main m-homepage-zones">
			<?php if ( function_exists( 'z_get_zone' ) ) : ?>
				<?php $the_query = z_get_zone_query( 'homepage-top' ); ?>
				<?php if ( $the_query->have_posts() ) : ?>
					<?php $post_count = $the_query->post_count; ?>
					<section class="m-zone m-zone-homepage-top m-archive m-archive-top m-archive-has-<?php echo $post_count; ?>-post">
						<?php
						while ( $the_query->have_posts() ) :
							$the_query->the_post();
							get_template_part( 'template-parts/content', 'top' ); // content-top
						endwhile;
						?>
					</section>
				<?php endif; ?>
			<?php endif; ?>
			<?php if ( function_exists( 'z_get_zone' ) ) : ?>
				<?php $the_query = z_get_zone_query( 'homepage-middle' ); ?>
				<?php if ( $the_query->have_posts() ) : ?>
					<section class="m-zone m-zone-homepage-middle m-archive m-archive-middle">
						<?php
						while ( $the_query->have_posts() ) :
							$the_query->the_post();
							get_template_part( 'template-parts/content', 'middle' ); // content-middle
						endwhile;
						?>
					</section>
				<?php endif; ?>
			<?php endif; ?>

			<div class="m-ad-region m-ad-region-home">
				<?php do_action( 'acm_tag', 'Middle3' ); ?>
			</div>

			<?php if ( function_exists( 'z_get_zone' ) ) : ?>
				<?php $the_query = z_get_zone_query( 'homepage-bottom' ); ?>
				<?php if ( $the_query->have_posts() ) : ?>
					<section class="m-zone m-zone-homepage-bottom m-archive m-archive-excerpt">
						<?php
						while ( $the_query->have_posts() ) :
							$the_query->the_post();
							get_template_part( 'template-parts/content', 'excerpt' ); // content-excerpt
						endwhile;
						?>
					</section>
				<?php endif; ?>
			<?php endif; ?>
		</main><!-- #main -->

		<aside id="content-sidebar" class="o-content-sidebar" role="complementary">
			<?php dynamic_sidebar( 'sidebar-2' ); ?>
		</aside>

	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
