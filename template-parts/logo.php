<div class="a-site-branding">
	<?php
	$logo_title = sprintf(
		// translators: 1 is the site name
		esc_html__( 'Return to %1$s Homepage', 'minnpost-largo' ),
		get_bloginfo( 'name' )
	);
	?>
	<a class="a-logo a-logo-svg" rel="home" href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo $logo_title; ?>">
		<picture>
			<source type="image/svg+xml" srcset="<?php echo get_stylesheet_directory_uri(); ?>/assets/img/minnpost-logo.svg">
			<img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/img/logo.png" alt="<?php bloginfo( 'name' ); ?>">
		</picture>
	</a>
</div><!-- .a-site-branding -->
