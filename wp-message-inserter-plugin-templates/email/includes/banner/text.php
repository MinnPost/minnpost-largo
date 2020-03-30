<?php
/**
 * Template for main banner text
 *
 * @package WP Message Inserter Plugin
 */

$value = '';
if ( isset( $screen_size[ $prefix . 'banner_heading' ] ) ) {
	$value .= '<h3>' . $screen_size[ $prefix . 'banner_heading' ] . '</h3>';
}
if ( isset( $screen_size[ $prefix . 'banner_shortcopy' ] ) ) {
	$value .= $screen_size[ $prefix . 'banner_shortcopy' ];
}

// apply content filter
$value = apply_filters( 'the_content', $value, 20 );
// email content filter
$value = apply_filters( 'format_email_content', $value, false, true );
echo $value;
