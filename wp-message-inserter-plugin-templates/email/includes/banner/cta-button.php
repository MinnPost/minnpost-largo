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
			$button_style .= 'background: ' . $button_bgcolor . ' !important;';
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

	<?php if ( '' !== $button_style ) : ?>
		<style>
			.wp-message-inserter-message-id-<?php echo $id; ?> p.a-button-site-message a:hover,
			.wp-message-inserter-message-id-<?php echo $id; ?> p.a-button-site-message a:focus,
			.wp-message-inserter-message-id-<?php echo $id; ?> p.a-button-site-message a:active {
				background-color: <?php echo $button_bgcolor; ?> !important;
				color: <?php echo $button_textcolor; ?> !important;
				text-decoration: underline !important;
			}
		</style>
	<?php endif; ?>

	<?php if ( '' !== $button_text ) : ?>
		<?php
		$value  = '';
		$value .= '<a' . $button_style . $button_href . ( 'true' === $screen_size[ $prefix . 'banner_buttondetails' ]['blank'] ? 'target="_blank"' : '' ) . '>';
		$text   = '';
		if ( '' !== $button_emoji ) {
			$text .= $button_emoji . '&nbsp;';
		}
		if ( '' !== $button_text ) {
			$text  .= $button_text;
			$value .= '<!--[if mso]><i>&nbsp;</i><![endif]--><span>' . $text . '</span><!--[if mso]><i>&nbsp;</i><![endif]-->';
		}
		$value .= '</a>';
		?>

		<center>
			<table role="presentation" cellspacing="0" cellpadding="0" class="a-button a-button-site-message">
				<tbody>
					<tr>
						<td>
							<table role="presentation" cellspacing="0" cellpadding="0">
								<tbody>
									<tr>
										<td align="center" <?php echo $button_style; ?>>
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

<?php endif; ?>
