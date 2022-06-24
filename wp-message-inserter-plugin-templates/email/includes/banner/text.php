<?php
/**
 * Template for main banner text
 *
 * @package WP Message Inserter Plugin
 */

// if there is a color setting for links, we should use it.
$colors['links'] = isset( $screen_size[ $prefix . 'banner_link_textcolor' ] ) ? $screen_size[ $prefix . 'banner_link_textcolor' ] : '';
$content         = '';
if ( isset( $screen_size[ $prefix . 'banner_heading' ] ) ) {
	$content .= '<h3 class="h3">' . $screen_size[ $prefix . 'banner_heading' ] . '</h3>';
}
if ( isset( $screen_size[ $prefix . 'banner_shortcopy' ] ) ) {
	$content .= $screen_size[ $prefix . 'banner_shortcopy' ];
}
// normal content filter.
$content = apply_filters( 'the_content', $content, 20 );
// email content filter.
$content = apply_filters( 'format_email_content', $content, false, true, $colors );
?>

<?php if ( '' !== $content ) : ?>
	<?php echo wp_kses_post( $content ); ?>
	<?php
endif;
