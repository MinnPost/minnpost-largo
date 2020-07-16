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
		<?php if ( function_exists( 'z_get_zone' ) ) : ?>
			<?php $top_query = z_get_zone_query( 'homepage-top' ); ?>
		<div id="home-list" class="o-homepage-listing<?php if ( $top_query->have_posts() ) : ?> o-homepage-listing-with-top<?php else : ?> o-homepage-listing-without-top<?php endif; ?>">
				<?php if ( $top_query->have_posts() ) : ?>
					<?php $post_count = $top_query->post_count; ?>
					<section class="m-archive m-archive-top m-archive-has-<?php echo (int) $post_count; ?>-post m-zone m-zone-homepage-top">
						<?php do_action( 'wp_message_inserter', 'above_homepage_articles' ); ?>
						<?php
						while ( $top_query->have_posts() ) :
							$top_query->the_post();
							get_template_part( 'template-parts/content', 'top' ); // content-top
						endwhile;
						?>
						<?php dynamic_sidebar( 'sidebar-glean' ); ?>
					</section>
					<?php get_sidebar( 'first' ); ?>
				<?php endif; ?>
				<?php
				$top_stories_zone = 'homepage-more-top-stories';
				$zone             = z_get_zone( $top_stories_zone );
				$more_top_stories = z_get_zone_query( $top_stories_zone );
				?>
				<?php if ( $more_top_stories->have_posts() ) : ?>
					<section class="m-archive m-archive-homepage m-zone m-zone-homepage-more-top">
						<?php if ( ! $top_query->have_posts() ) : ?>
							<?php do_action( 'wp_message_inserter', 'above_homepage_articles' ); ?>
							<h2 class="a-zone-title"><?php echo __( 'Today\'s top stories', 'minnpost-largo' ); ?></h2>
						<?php else : ?>
							<h2 class="a-zone-title"><?php echo __( 'More of today\'s top stories', 'minnpost-largo' ); ?></h2>
						<?php endif; ?>
						<?php
						$count = 1;
						while ( $more_top_stories->have_posts() ) :
							$more_top_stories->the_post();
							get_template_part( 'template-parts/content', 'excerpt' ); // content-middle
							?>
							<?php if ( 2 === $count && ! $top_query->have_posts() ) : ?>
								<?php dynamic_sidebar( 'sidebar-glean' ); ?>
							<?php endif; ?>
							<?php
							$count++;
						endwhile;
						?>
						<!--<div class="a-zone-actions">
							<a href="<?php echo site_url( '/news/' ); ?>" class="a-button-content"><?php echo __( 'More news', 'minnpost-largo' ); ?></a>
						</div>-->
					</section>
				<?php endif; ?>
				<?php if ( ! $top_query->have_posts() ) : ?>
					<?php get_sidebar( 'first-and-second' ); ?>
				<?php else : ?>
					<?php get_sidebar( 'second' ); ?>
				<?php endif; ?>
				<?php do_action( 'wp_message_inserter', 'homepage_middle' ); ?>
				<?php
				$opinion_zone  = 'homepage-opinion';
				$zone          = z_get_zone( $opinion_zone );
				$opinion_query = z_get_zone_query( $opinion_zone );
				?>
				<?php if ( $opinion_query->have_posts() ) : ?>
					<section class="m-archive m-archive-excerpt m-zone m-zone-homepage-opinion">
						<h2 class="a-zone-title"><?php echo $zone->description; ?></h2>
						<?php
						while ( $opinion_query->have_posts() ) :
							$opinion_query->the_post();
							get_template_part( 'template-parts/content', 'opinion' ); // content-excerpt
						endwhile;
						?>
						<!--<div class="a-zone-actions">
							<a href="<?php echo site_url( '/opinion/' ); ?>" class="a-button-content"><?php echo __( 'More commentary', 'minnpost-largo' ); ?></a>
						</div>-->
					</section>
				<?php endif; ?>
				<?php get_sidebar( 'third' ); ?>
				<div class="m-ad-region m-ad-region-home m-ad-region-home-full-width">
					<?php do_action( 'acm_tag', 'Middle3' ); ?>
				</div>
				<div class="m-widget-group m-widget-group-homepage">
					<?php dynamic_sidebar( 'sidebar-spills' ); ?>
				</div>
				<div class="m-widget-group m-widget-group-homepage">
					<?php dynamic_sidebar( 'sidebar-membership' ); ?>
				</div>
			</div>
		<?php endif; ?>
	</main>
<?php
get_footer();
