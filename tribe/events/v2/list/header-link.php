<?php
/**
 * View: Header Link
 *
 * This sits in the header and toggles between past and upcoming event URLs.
 */
?>

<?php if ( tribe_is_past() === true ) : ?>
	<a class="past-events-link events-link" href="<?php echo site_url( '/events/list/' ); ?>"><?php echo __( 'Upcoming Events', 'minnpost-largo' ); ?></a>
<?php elseif ( tribe_is_upcoming() === true ) : ?>
	<a class="past-events-link events-link" href="<?php echo site_url( '/events/list/?eventDisplay=past&amp;tribe-bar-year=' . date( 'Y' ) ); ?>"><?php echo __( 'Past Events', 'minnpost-largo' ); ?></a>
<?php endif; ?>
