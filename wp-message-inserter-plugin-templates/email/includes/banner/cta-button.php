<?php
/**
 * Template for banner CTA buttons
 *
 * @package WP Message Inserter Plugin
 */
?>

<?php if ( is_array( $screen_size[ $prefix . 'banner_buttondetails' ] ) ) : ?>
	<?php
	$button_bgcolor   = isset( $screen_size[ $prefix . 'banner_btn_bgcolor' ] ) ? $screen_size[ $prefix . 'banner_btn_bgcolor' ] : '';
	$button_textcolor = isset( $screen_size[ $prefix . 'banner_btn_textcolor' ] ) ? $screen_size[ $prefix . 'banner_btn_textcolor' ] : '';
	$button_style     = '';

	if ( '' !== $button_bgcolor || '' !== $button_textcolor ) {
		$button_style = ' style="-moz-border-radius: 4px; -webkit-border-radius: 4px; border: 1px solid ' . $button_bgcolor . '; border-radius: 4px; display: inline-block; font-size: 16px; padding: 8px 12px; text-decoration: none; font-weight: bold;';
		if ( '' !== $button_bgcolor ) {
			$button_style .= 'background: ' . $button_bgcolor . ';';
		}
		if ( '' !== $button_textcolor ) {
			$button_style .= 'color: ' . $button_textcolor . ' !important;';
		}
		$button_style .= '"';
	}
	$button_href = '';
	$button_url  = isset( $screen_size[ $prefix . 'banner_buttondetails' ]['url'] ) ? $screen_size[ $prefix . 'banner_buttondetails' ]['url'] : '';
	if ( '' !== $button_url ) {
		$button_href = ' href="' . $button_url . '"';
	}
	$button_emoji = isset( $screen_size[ $prefix . 'banner_buttonemoji' ] ) ? $screen_size[ $prefix . 'banner_buttonemoji' ] : '';
	$button_text  = isset( $screen_size[ $prefix . 'banner_buttondetails' ]['text'] ) ? $screen_size[ $prefix . 'banner_buttondetails' ]['text'] : '';
	?>
	<?php if ( '' !== $button_text ) : ?>
		<?php
		$value  = '';
		$value .= '<a class="a-button"' . $button_style . $button_href . ( 'true' === $screen_size[ $prefix . 'banner_buttondetails' ]['blank'] ? 'target="_blank"' : '' ) . '>';
		$text   = '';
		if ( '' !== $button_emoji ) {
			$text .= $button_emoji . '&nbsp;';
		}
		if ( '' !== $button_text ) {
			$text  .= $button_text;
			$value .= '<!--[if mso]>&nbsp;<![endif]-->' . $text . '<!--[if mso]>&nbsp;<![endif]-->';
		}
		$value .= '</a>';
		// email content filter
		$value = apply_filters( 'format_email_content', $value, false, true );
		?>

		<p class="a-button a-button-site-message">
			<?php echo $value; ?>
		</p>

		
	
	<?php endif; ?>
	<?php
endif;
