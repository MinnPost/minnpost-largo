<?php
/**
 * Template for main banner text
 *
 * @package WP Message Inserter Plugin
 */

// if there is a color setting for links, we should use it
$colors['links'] = isset( $screen_size[ $prefix . 'banner_link_textcolor' ] ) ? $screen_size[ $prefix . 'banner_link_textcolor' ] : '';

?>

<?php if ( isset( $screen_size[ $prefix . 'banner_heading' ] ) ) : ?>
	<h3 class="h3"><?php echo $screen_size[ $prefix . 'banner_heading' ]; ?></h3>
<?php endif; ?>
<?php if ( isset( $screen_size[ $prefix . 'banner_shortcopy' ] ) ) : ?>
	<?php
	// apply content filter
	$content = apply_filters( 'the_content', $screen_size[ $prefix . 'banner_shortcopy' ], 20 );
	// email content filter
	$content = apply_filters( 'format_email_content', $content, false, true, $colors );
	echo $content;
	?>
<?php endif; ?>
