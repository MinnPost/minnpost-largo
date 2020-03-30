<?php
/**
 * Template for banner disclaimer
 *
 * @package WP Message Inserter Plugin
 */
?>

<?php if ( isset( $screen_size[ $prefix . 'banner_disclaimer' ] ) ) : ?>
	<?php
	$value = $screen_size[ $prefix . 'banner_disclaimer' ];
	$value = apply_filters( 'the_content', $value, 20 );
	// email content filter
	$value = apply_filters( 'format_email_content', $value, false, true );
	?>
	<div class="disclaimer"><?php echo $value; ?></div>
<?php endif; ?>
