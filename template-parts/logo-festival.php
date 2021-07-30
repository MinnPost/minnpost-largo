<div class="m-festival-branding<?php echo $args['is_current_url'] ? ' m-festival-branding-landing-page' : ''; ?>">
	<a href="<?php echo $args['url']; ?>">
		<div class="a-festival-branding">
			<?php echo $args['title']; ?>
		</div>
		<?php
		if ( function_exists( 'minnpost_largo_get_event_website_date_range' ) ) :
			$date = minnpost_largo_get_event_website_date_range( 'festival', 'sessions' );
			?>
			<div class="a-festival-dates">
				<?php echo $date; ?>
			</div>
		<?php endif; ?>
	</a>
</div>
