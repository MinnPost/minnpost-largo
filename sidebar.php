<?php
/**
 * The sidebar containing the main widget area
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MinnPost Largo
 */
?>

<?php if ( is_singular() ) : ?>
	<?php
	$remove_sidebar = get_post_meta( get_the_ID(), '_mp_remove_right_sidebar', true );
	if ( isset( $remove_sidebar ) && 'on' === $remove_sidebar ) {
		return;
	}
	?>
<?php endif; ?>

<aside id="secondary" class="o-site-sidebar" role="complementary">
	<div class="m-ad-region m-ad-region-sidebar">
		<?php do_action( 'acm_tag', 'halfpage' ); ?>
	</div>

	<?php if ( is_home() && function_exists( 'z_get_zone' ) ) : ?>
		<?php
		$recommended_zone        = 'homepage-recommended';
		$show_recommended_number = 4;
		$zone                    = z_get_zone( $recommended_zone );
		$recommended_query       = z_get_zone_query(
			$recommended_zone,
			array(
				'posts_per_page' => $show_recommended_number,
				'order'          => 'rand',
			)
		);
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

	<?php if ( is_archive() || is_single() ) : ?>
		<?php
		$i = 1;
		while ( $i <= 10 ) :
			?>
			<div class="m-ad-region m-ad-region-sidebar m-ad-region-x<?php echo str_pad( $i, 2, '0', STR_PAD_LEFT ); ?>">
				<?php do_action( 'acm_tag', 'x' . str_pad( $i, 2, '0', STR_PAD_LEFT ) ); ?>
			</div>
			<?php
			$i++;
		endwhile;
		?>
	<?php endif; ?>
	<?php if ( is_singular() ) : ?>
		<?php minnpost_post_sidebar(); ?>
	<?php endif; ?>
	<?php dynamic_sidebar( 'sidebar-1' ); ?>
	<?php if ( ! is_single() ) : ?>
		<div class="m-ad-region m-ad-region-sidebar">
			<?php do_action( 'acm_tag', 'Middle' ); ?>
		</div>
	<?php endif; ?>
	<?php if ( is_home() ) : ?>
		<div class="m-ad-region m-ad-region-sidebar">
			<?php do_action( 'acm_tag', 'BottomRight' ); ?>
		</div>
	<?php endif; ?>
</aside><!-- #secondary -->
