<?php
/**
 * Single Event Meta (Venue) Template
 *
 * Override this template in your own theme by creating a file at:
 * [your-theme]/tribe-events/modules/meta/venue.php
 *
 * @package TribeEventsCalendar
 * @version 4.6.19
 */

if ( ! tribe_get_venue_id() ) {
	return;
}
?>

<div class="m-event-venue vcard">
	<?php if ( ! empty( tribe_get_venue_website_link() ) ) : ?>
		<p class="fn a-event-venue-title"><a class="url" href="<?php echo tribe_get_venue_website_link(); ?>"><?php echo tribe_get_venue(); ?></a></p>
	<?php else : ?>
		<p class="fn a-event-venue-title"><?php echo tribe_get_venue(); ?></p>
	<?php endif; ?>
</div>
