<?php
/**
 * Template for banner form CTAs
 *
 * @package WP Message Inserter Plugin
 */
?>

<?php if ( isset( $screen_size[ $prefix . 'banner_form_shortcode' ] ) ) : ?>
	<?php echo do_shortcode( $screen_size[ $prefix . 'banner_form_shortcode' ] ); ?>
<?php endif; ?>
