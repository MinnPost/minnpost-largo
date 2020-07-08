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

		<div id="home-first" class="o-homepage-listing o-homepage-listing-top-story">
			<?php if ( function_exists( 'z_get_zone' ) ) : ?>
				<?php $top_query = z_get_zone_query( 'homepage-top' ); ?>
				<?php if ( $top_query->have_posts() ) : ?>
					<?php $post_count = $top_query->post_count; ?>
					<section class="m-archive m-archive-top m-archive-has-<?php echo (int) $post_count; ?>-post m-zone m-zone-homepage-top ">
						<?php
						while ( $top_query->have_posts() ) :
							$top_query->the_post();
							get_template_part( 'template-parts/content', 'top' ); // content-top
						endwhile;
						?>
						<?php dynamic_sidebar( 'sidebar-glean' ); ?>
					</section>
				<?php endif; ?>
			<?php endif; ?>
			<?php get_sidebar( 'first' ); ?>
		</div>

		<div id="home-second" class="o-homepage-listing o-homepage-listing-more-top-stories">
			<?php if ( function_exists( 'z_get_zone' ) ) : ?>
				<?php
				$top_stories_zone = 'homepage-todays-top-stories';
				$zone             = z_get_zone( $top_stories_zone );
				$more_top_stories = z_get_zone_query( $top_stories_zone );
				?>
				<?php if ( $more_top_stories->have_posts() ) : ?>
					<section class="m-archive m-archive-homepage m-zone m-zone-homepage-more-top">
						<h2 class="a-zone-title"><?php echo $zone->description; ?></h2>
						<?php
						while ( $more_top_stories->have_posts() ) :
							$more_top_stories->the_post();
							get_template_part( 'template-parts/content', 'excerpt' ); // content-middle
						endwhile;
						?>
						<div class="a-zone-actions">
							<a href="<?php echo site_url( '/news/' ); ?>" class="a-button-content"><?php echo __( 'More news', 'minnpost-largo' ); ?></a>
						</div>
					</section>
				<?php endif; ?>
			<?php endif; ?>
			<?php get_sidebar( 'second' ); ?>
		</div>

		<?php do_action( 'wp_message_inserter', 'homepage_middle' ); ?>

		<div id="home-third" class="o-homepage-listing o-homepage-listing-opinion">
			<?php if ( function_exists( 'z_get_zone' ) ) : ?>
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
						<div class="a-zone-actions">
							<a href="<?php echo site_url( '/opinion/' ); ?>" class="a-button-content"><?php echo __( 'More commentary', 'minnpost-largo' ); ?></a>
						</div>
					</section>
				<?php endif; ?>
			<?php endif; ?>
			<?php get_sidebar( 'third' ); ?>
		</div>

		<div class="m-ad-region m-ad-region-home m-ad-region-home-full-width">
			<?php do_action( 'acm_tag', 'Middle3' ); ?>
		</div>

		<div id="home-fourth" class="o-homepage-listing o-homepage-listing-categories">
			<?php dynamic_sidebar( 'sidebar-spills' ); ?>
		</div>

		<!--<div id="home-fifth" class="o-homepage-listing o-homepage-listing-membership">
			<?php dynamic_sidebar( 'sidebar-membership' ); ?>
		</div>-->

	</main>

<?php
get_footer();
