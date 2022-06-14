<?php
/**
 * Single Event Meta (Website) Template
 */
?>
<?php if ( tribe_get_event_website_link() ) : ?>
	<div class="a-event-cta a-event-website">
		<p><?php echo __( 'Event website:', 'minnpost-largo' ); ?> <?php echo tribe_get_event_website_link(); ?></p>
	</div>
<?php endif; ?>
