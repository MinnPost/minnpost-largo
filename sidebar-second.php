<?php
/**
 * The first sidebar area for the homepage
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MinnPost Largo
 */
?>

<aside id="secondary-second" class="o-site-sidebar" role="complementary">
	<?php if ( is_home() && function_exists( 'z_get_zone' ) ) : ?>
		<?php
		$recommended_zone  = 'homepage-recommended';
		$zone              = z_get_zone( $recommended_zone );
		$recommended_query = z_get_zone_query( $recommended_zone );
		?>
		<?php if ( $recommended_query->have_posts() ) : ?>
			<section class="m-widget m-widget-zone-posts">
				<h3 class="a-zone-title"><?php echo $zone->name; ?></h3>
				<div class="m-zone-contents">
					<ul>
					<?php
					while ( $recommended_query->have_posts() ) :
						$recommended_query->the_post();
						get_template_part( 'template-parts/content', 'sidebar' ); // content-sidebar
					endwhile;
					?>
					</ul>
				</div>
			</section>
		<?php endif; ?>
	<?php endif; ?>
	<div class="m-ad-region m-ad-region-sidebar">
		<?php do_action( 'acm_tag', 'Middle' ); ?>
	</div>

</aside>
