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
		$button_style = ' style="';
		if ( '' !== $button_bgcolor ) {
			$button_style .= 'background: ' . $button_bgcolor . ';';
		}
		if ( '' !== $button_textcolor ) {
			$button_style .= 'color: ' . $button_textcolor . ';';
		}
		$button_style .= '"';
	}
	$button_href = '';
	$button_url  = isset( $screen_size[ $prefix . 'banner_buttondetails' ]['url'] ) ? $screen_size[ $prefix . 'banner_buttondetails' ]['url'] : '';
	if ( '' !== $button_url ) {
		$button_href = ' href="' . $button_url . '"';
	}
	$button_icon = isset( $screen_size[ $prefix . 'banner_buttonicon' ] ) ? $screen_size[ $prefix . 'banner_buttonicon' ] : '';
	$button_text = isset( $screen_size[ $prefix . 'banner_buttondetails' ]['text'] ) ? $screen_size[ $prefix . 'banner_buttondetails' ]['text'] : '';
	?>
	<?php if ( '' !== $button_icon || '' !== $button_text ) : ?>
		<a class="a-button"<?php echo $button_style . $button_href; ?><?php ( 'true' === $screen_size[ $prefix . 'banner_buttondetails' ]['blank'] ? 'target="_blank"' : '' ); ?>>
			<?php if ( '' !== $button_icon ) : ?>
				<i class="<?php echo $button_icon; ?>" aria-hidden="true"></i>
			<?php endif; ?>
			<?php if ( '' !== $button_text ) : ?>
				<?php echo $button_text; ?>
			<?php endif; ?>
		</a>
	<?php endif; ?>
<?php endif; ?>
