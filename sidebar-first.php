<?php
/**
 * The sidebar containing the main widget area
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MinnPost Largo
 */

$remove_sidebar = get_post_meta( get_the_ID(), '_mp_remove_right_sidebar', true );
if ( isset( $remove_sidebar ) && 'on' === $remove_sidebar ) {
	return;
}
?>

<aside id="secondary-first" class="o-site-sidebar" role="complementary">
	<div class="m-ad-region m-ad-region-sidebar">
		<?php do_action( 'acm_tag', 'halfpage' ); ?>
	</div>

	<?php if ( is_home() && function_exists( 'z_get_zone' ) ) : ?>
		<?php
		$recommended_zone  = 'homepage-recommended';
		$zone              = z_get_zone( $recommended_zone );
		$recommended_query = z_get_zone_query( $recommended_zone );
		?>
		<?php if ( $recommended_query->have_posts() ) : ?>
			<section class="m-zone m-zone-sidebar m-zone-sidebar-recommended">
				<h3 class="a-zone-title"><?php echo $zone->name; ?></h3>
				<div class="m-zone-contents">
					<?php
					while ( $recommended_query->have_posts() ) :
						$recommended_query->the_post();
						get_template_part( 'template-parts/content', 'sidebar' ); // content-sidebar
					endwhile;
					?>
				</div>
			</section>
		<?php endif; ?>
	<?php endif; ?>
</aside>

