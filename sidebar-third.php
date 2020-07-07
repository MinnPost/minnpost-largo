<?php
/**
 * The third sidebar area for the homepage
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MinnPost Largo
 */
?>

<aside id="secondary-third" class="o-site-sidebar" role="complementary">

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
	<?php dynamic_sidebar( 'sidebar-1' ); ?>

	<div class="m-ad-region m-ad-region-sidebar">
		<?php do_action( 'acm_tag', 'BottomRight' ); ?>
	</div>
	
</aside><!-- #secondary -->
