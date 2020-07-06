<?php
/**
 * Component: Before Events
 *
 * This overrides the default the-events-calendar/views/v2/components/before.php
 */

if ( empty( $before_events ) ) {
	return;
}
?>
<div class="m-archive-info m-events-info m-events-before-info">
	<?php echo $before_events; ?>
</div>
