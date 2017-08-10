<?php
/**
 * The sidebar containing the main widget area
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MinnPost Largo
 */

/*if ( ! is_active_sidebar( 'sidebar-1' ) ) {
	return;
}*/
?>

<aside id="secondary" class="o-site-sidebar" role="complementary">
	 <div class="m-ad-region m-ad-region-sidebar">
		<?php do_action( 'acm_tag', 'Right1' ); ?>
	</div>
	<?php if ( is_archive() || is_single() ) : ?>
		<?php
		$i = 1;
		while ( $i <= 10 ) : ?>
			<div class="m-ad-region m-ad-region-sidebar">
				<?php do_action( 'acm_tag', 'X' . str_pad( $i, 2, '0', STR_PAD_LEFT ) ); ?>
			</div>
		<?php
		$i++;
		endwhile;
		?>
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
