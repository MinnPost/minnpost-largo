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
				<?php $top_query = z_get_zone_query( 'homepage-top' ); ?>
				<?php if ( $top_query->have_posts() ) : ?>
					<?php $post_count = $top_query->post_count; ?>
					<section class="m-zone m-zone-homepage-top m-archive m-archive-top m-archive-has-<?php echo intval( $post_count ); ?>-post">
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

			<aside class="o-content-message o-content-message-homepage">
				<article class="o-content-message-body o-content-message-homepage-body">
					<?php echo do_shortcode( '[newsletter_form placement="frontpage" content_before="<header><h3 class=\'a-signup-title-homepage\'>Stay informed</h3><h4>Sign up for our daily newsletter</h4></header>" content_after="<p>Or, see our <a href=\'/subscribe/\'>other free newsletter options</a></p>" in_content_label="Enter your email address" in_content_label_placement="after"]' ); ?>
				</article>
			</aside>

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
		</main><!-- #main -->

	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
