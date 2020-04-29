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
	<main id="main" class="site-main m-homepage-zones">
		<div id="home-first" class="m-layout-primary o-homepage-listing">
			<?php if ( function_exists( 'z_get_zone' ) ) : ?>
				<?php $top_query = z_get_zone_query( 'homepage-top' ); ?>
				<?php if ( $top_query->have_posts() ) : ?>
					<?php $post_count = $top_query->post_count; ?>
					<section class="m-zone m-zone-homepage-top m-archive m-archive-top m-archive-has-<?php echo (int) $post_count; ?>-post">
						<?php
						while ( $top_query->have_posts() ) :
							$top_query->the_post();
							get_template_part( 'template-parts/content', 'top' ); // content-top
						endwhile;
						?>
						<?php dynamic_sidebar( 'sidebar-4' ); ?>
					</section>
				<?php endif; ?>
			<?php endif; ?>
			<?php if ( function_exists( 'z_get_zone' ) ) : ?>
				<?php $middle_query = z_get_zone_query( 'homepage-middle' ); ?>
				<?php if ( $middle_query->have_posts() ) : ?>
					<?php if ( $top_query->have_posts() ) : ?>
						<section class="m-zone m-zone-homepage-middle m-archive m-archive-middle">
							<?php
							while ( $middle_query->have_posts() ) :
								$middle_query->the_post();
								get_template_part( 'template-parts/content', 'middle' ); // content-middle
							endwhile;
							?>
						</section>
					<?php else : ?>
						<section class="m-zone m-zone-homepage-middle m-archive m-archive-middle">
							<?php
							$count = 1;
							while ( $middle_query->have_posts() ) :
								$middle_query->the_post();
								get_template_part( 'template-parts/content', 'middle' ); // content-middle
								?>
								<?php if ( 2 === $count && ! $top_query->have_posts() ) : ?>
									<?php dynamic_sidebar( 'sidebar-4' ); ?>
								<?php endif; ?>
								<?php
								$count++;
							endwhile;
							?>
						</section>
					<?php endif; ?>
				<?php endif; ?>
			<?php endif; ?>
		</div>

		<?php get_sidebar( 'first' ); ?>

		<?php do_action( 'wp_message_inserter', 'homepage_middle' ); ?>

		<div id="home-second" class="m-layout-primary o-homepage-listing">
			<?php if ( function_exists( 'z_get_zone' ) ) : ?>
				<?php $bottom_query = z_get_zone_query( 'homepage-bottom' ); ?>
				<?php if ( $bottom_query->have_posts() ) : ?>
					<section class="m-zone m-zone-homepage-bottom m-archive m-archive-excerpt">
						<div class="m-ad-region m-ad-region-home">
							<?php do_action( 'acm_tag', 'Middle3' ); ?>
						</div>
						<?php
						while ( $bottom_query->have_posts() ) :
							$bottom_query->the_post();
							get_template_part( 'template-parts/content', 'excerpt' ); // content-excerpt
						endwhile;
						?>
					</section>
					<aside id="content-sidebar" class="o-content-sidebar" role="complementary">
						<?php dynamic_sidebar( 'sidebar-2' ); ?>
					</aside>
				<?php endif; ?>
			<?php endif; ?>
		</div>

		<?php get_sidebar( 'second' ); ?>

	</main>

<?php
get_footer();
