<aside id="secondary-second" class="o-site-sidebar" role="complementary">

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
