<?php
/**
 * The sidebar containing the main widget area
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MinnPost Largo
 */
?>

<?php
$remove_sidebar = apply_filters( 'minnpost_largo_remove_sidebar', false );
if ( true === $remove_sidebar ) {
	return;
}
?>

<aside id="secondary" class="o-site-sidebar" role="complementary">
	<div class="m-ad-region m-ad-region-sidebar">
		<?php do_action( 'acm_tag', 'halfpage' ); ?>
	</div>
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
</aside><!-- #secondary -->
