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
	 site sidebar here
	<?php dynamic_sidebar( 'sidebar-1' ); ?>
</aside><!-- #secondary -->
