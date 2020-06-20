<?php
/**
 * Component: After Events
 *
 * This overrides the default the-events-calendar/views/v2/components/after.php
 */

if ( empty( $after_events ) ) {
	return;
}
?>
<aside class="m-archive-info m-events-info m-events-after-info">
	<?php echo $after_events; ?>
</aside>
