<?php
/**
 * Template for banner icon
 *
 * @package WP Message Inserter Plugin
 */
?>

<?php if ( isset( $screen_size[ $prefix . 'banner_icon' ] ) ) : ?>
	<div class="col banner-icon" aria-hidden="true">
		<img src="<?php echo $screen_size[ $prefix . 'banner_icon' ]; ?>" alt="">
	</div>
<?php endif; ?>
