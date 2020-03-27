<?php
/**
 * Template for main banner text
 *
 * @package WP Message Inserter Plugin
 */
?>

<?php if ( isset( $screen_size[ $prefix . 'banner_heading' ] ) ) : ?>
	<h3><?php echo $screen_size[ $prefix . 'banner_heading' ]; ?></h3>
<?php endif; ?>
<?php if ( isset( $screen_size[ $prefix . 'banner_shortcopy' ] ) ) : ?>
	<?php echo wpautop( $screen_size[ $prefix . 'banner_shortcopy' ] ); ?>
<?php endif; ?>
