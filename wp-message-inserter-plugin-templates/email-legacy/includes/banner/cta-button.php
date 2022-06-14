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

	if ( $button_bgcolor !== '' || $button_textcolor !== '' ) {
		$button_style = ' style="-moz-border-radius: 4px; -webkit-border-radius: 4px; border: 1px solid ' . $button_bgcolor . '; border-radius: 4px; display: inline-block; font-size: 16px; padding: 8px 12px; text-decoration: none; font-weight: bold;';
		if ( $button_bgcolor !== '' ) {
			$button_style .= 'background: ' . $button_bgcolor . ';';
		}
		if ( $button_textcolor !== '' ) {
			$button_style .= 'color: ' . $button_textcolor . ' !important;';
		}
		$button_style .= '"';
	}
	$button_href = '';
	$button_url  = isset( $screen_size[ $prefix . 'banner_buttondetails' ]['url'] ) ? $screen_size[ $prefix . 'banner_buttondetails' ]['url'] : '';
	if ( $button_url !== '' ) {
		$button_href = ' href="' . $button_url . '"';
	}
	$button_emoji = isset( $screen_size[ $prefix . 'banner_buttonemoji' ] ) ? $screen_size[ $prefix . 'banner_buttonemoji' ] : '';
	$button_text  = isset( $screen_size[ $prefix . 'banner_buttondetails' ]['text'] ) ? $screen_size[ $prefix . 'banner_buttondetails' ]['text'] : '';
	?>
	<?php if ( $button_text !== '' ) : ?>
		<?php
		$value  = '';
		$value .= '<a class="a-button"' . $button_style . $button_href . ( ( isset( $screen_size[ $prefix . 'banner_buttondetails' ]['blank'] ) && $screen_size[ $prefix . 'banner_buttondetails' ]['blank'] === 'true' ) ? 'target="_blank"' : '' ) . '>';
		$text   = '';
		if ( $button_emoji !== '' ) {
			$text .= $button_emoji . '&nbsp;';
		}
		if ( $button_text !== '' ) {
			$text  .= $button_text;
			$value .= '<!--[if mso]>&nbsp;<![endif]-->' . $text . '<!--[if mso]>&nbsp;<![endif]-->';
		}
		$value .= '</a>';
		// email content filter
		$value = apply_filters( 'format_email_content_legacy', $value, false, true );
		?>
		<center>
			<table class="button read-story" style="border-collapse: collapse; border-spacing: 0; Margin: 0 0 15px 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0" cellspacing="0" cellpadding="0">
				<tbody>
					<tr>
						<td style="border-collapse: collapse; Margin: 0; padding: 0">
							<table style="border-collapse: collapse; border-spacing: 0; color: #<?php echo $button_textcolor; ?>; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0" cellspacing="0" cellpadding="0">
								<tbody>
									<tr>
										<td style="-moz-border-radius: 4px; -webkit-border-radius: 4px; background: <?php echo $button_bgcolor; ?> border-collapse: collapse; border-radius:4px; Margin: 0; padding: 0; color: <?php echo $button_textcolor; ?>" bgcolor="<?php echo $button_bgcolor; ?>" align="center">
											<?php echo $value; ?>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
		</center>
	<?php endif; ?>
	<?php
endif;
