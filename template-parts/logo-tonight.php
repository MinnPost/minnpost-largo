<div class="m-tonight-branding<?php echo $args['is_current_url'] ? ' m-tonight-branding-landing-page' : ''; ?>">
	<a href="<?php echo $args['url']; ?>">
		<picture class="a-tonight-branding">
			<source media="(min-width: 800px)" srcset="<?php echo get_stylesheet_directory_uri(); ?>/assets/img/events/tonight/minnpost-tonight.png">
			<img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/img/events/tonight/minnpost-tonight.png" alt="<?php echo $args['title']; ?>" loading="lazy">
		</picture>
	</a>
</div>
