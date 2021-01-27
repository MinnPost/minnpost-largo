<?php
$festival_logo_info = minnpost_largo_get_festival_logo_info( 'festival' );
?>

<div class="m-festival-branding<?php echo $festival_logo_info['is_current_url'] ? ' m-festival-branding-landing-page' : ''; ?>">
	<a href="<?php echo $festival_logo_info['url']; ?>">
		<div class="a-festival-branding">
			<?php echo $festival_logo_info['title']; ?>
		</div>
		<?php
		if ( function_exists( 'minnpost_largo_get_festival_date_range' ) ) :
			$date = minnpost_largo_get_festival_date_range( 'sessions' );
			?>
			<div class="a-festival-dates">
				<?php echo $date; ?>
			</div>
		<?php endif; ?>
	</a>
</div>
