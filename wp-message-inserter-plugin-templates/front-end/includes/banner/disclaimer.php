<?php
/**
 * Template for banner disclaimer
 *
 * @package WP Message Inserter Plugin
 */
?>

<?php if ( isset( $screen_size[ $prefix . 'banner_disclaimer' ] ) ) : ?>
	<div class="disclaimer"><?php echo wpautop( $screen_size[ $prefix . 'banner_disclaimer' ] ); ?></div>
<?php endif; ?>
