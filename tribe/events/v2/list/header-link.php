<?php
/**
 * View: Header Link
 *
 * This sits in the header and toggles between past and upcoming event URLs.
 */
?>

<?php if ( true === tribe_is_past() ) : ?>
	<a class="past-events-link events-link" href="<?php echo site_url( '/events/list/' ); ?>"><?php echo __( 'Upcoming Events', 'minnpost-largo' ); ?></a>
<?php elseif ( true === tribe_is_upcoming() ) : ?>
	<a class="past-events-link events-link" href="<?php echo site_url( '/events/list/?eventDisplay=past&amp;tribe-bar-year=' . date( 'Y' ) ); ?>"><?php echo __( 'Past Events', 'minnpost-largo' ); ?></a>
<?php endif; ?>
