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
	<p class="adr a-event-venue-address">
		<?php if ( ! empty( tribe_get_address() ) ) : ?>
			<span class="street-address"><?php echo tribe_get_address(); ?></span>
		<?php endif; ?>
		<?php if ( ! empty( tribe_get_city() ) ) : ?>
		<span class="locality"><?php echo tribe_get_city(); ?></span>
		<?php endif; ?>
		<?php if ( ! empty( tribe_get_region() ) ) : ?>
			<span class="region"><?php echo tribe_get_region(); ?></span>
		<?php endif; ?>
		<?php if ( ! empty( tribe_get_zip() ) ) : ?>
			<span class="postal-code"><?php echo tribe_get_zip(); ?></span>
		<?php endif; ?>
		<?php if ( ! empty( tribe_get_country() ) ) : ?>
			<span class="country-name"><?php echo tribe_get_country(); ?></span>
		<?php endif; ?>
	</p>
	<?php if ( ! empty( tribe_get_phone() ) ) : ?>
		<p class="tel"><?php echo tribe_get_phone(); ?></p>
	<?php endif; ?>
	<?php if ( tribe_show_google_map_link() && ! empty( tribe_get_map_link() ) ) : ?>
		<p class="a-google-map-link"><a href="<?php echo tribe_get_map_link(); ?>"><i class="fas fa-map-marker-alt"></i> <?php echo __( 'On Google Maps', 'minnpost-largo' ); ?></a></p>
	<?php endif; ?>
</div>
