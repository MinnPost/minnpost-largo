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
	<?php dynamic_sidebar( 'sidebar-1' ); ?>
	<div class="m-ad-region m-ad-region-sidebar">
		<?php do_action( 'acm_tag', 'Middle' ); ?>
	</div>
	<div class="m-ad-region m-ad-region-sidebar">
		<?php do_action( 'acm_tag', 'BottomRight' ); ?>
	</div>
</aside><!-- #secondary -->
