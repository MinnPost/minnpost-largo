<?php
/**
 * Template and variables for banner messages
 * This template the banner messages only
 *
 * @package WP Message Inserter Plugin
 */

$check_session          = isset( $message['meta'][ $prefix . 'check_session' ] ) ? $message['meta'][ $prefix . 'check_session' ][0] : '';
$session_count_check    = isset( $message['meta'][ $prefix . 'number_of_sessions' ] ) ? $message['meta'][ $prefix . 'number_of_sessions' ][0] : '';
$session_count_operator = isset( $message['meta'][ $prefix . 'operator_session' ] ) ? $message['meta'][ $prefix . 'operator_session' ][0] : '';

?>

<?php if ( 0 < count( $screen_sizes ) ) : ?>
	<tr>
		<td class="one-column message" style="Margin: 0 0 15px 0; padding: 0;">
		<!--[if (gte mso 9)|(IE)]>
			<table cellpadding="0" cellspacing="0" width="100%">
				<tr>
					<td width="100%" valign="bottom">
		<![endif]-->
			<div class="message">
		<?php foreach ( $screen_sizes as $key => $screen_size ) : ?>

			<?php
			// Banner BG Setup
			$bgcolor     = isset( $screen_size[ $prefix . 'banner_bgcolor' ] ) ? 'linear-gradient(
				' . $screen_size[ $prefix . 'banner_bgcolor' ] . ',
				' . $screen_size[ $prefix . 'banner_bgcolor' ] . '
			)' : '';
			$banner_bg   = isset( $screen_size[ $prefix . 'banner_bgimage' ] ) ? 'background: ' . $bgcolor . ', url(' . $screen_size[ $prefix . 'banner_bgimage' ] . ') center center no-repeat; background-size: cover;' : 'background: ' . $bgcolor . ';';
			$banner_text = isset( $screen_size[ $prefix . 'banner_textcolor' ] ) ? 'color: ' . $screen_size[ $prefix . 'banner_textcolor' ] . ';' : '';

			$banner_size           = '';
			$banner_max_width      = isset( $screen_size[ $prefix . 'banner_max_width' ] ) ? $screen_size[ $prefix . 'banner_max_width' ] : 'page';
			$banner_max_width_text = isset( $screen_size[ $prefix . 'banner_max_width_text' ] ) ? $screen_size[ $prefix . 'banner_max_width_text' ] : '';
			$banner_max_width_unit = isset( $screen_size[ $prefix . 'banner_max_width_unit' ] ) ? $screen_size[ $prefix . 'banner_max_width_unit' ] : '';
			if ( 'page' !== $banner_max_width && 'custom' !== $banner_max_width ) {
				$banner_size = 'max-width:' . $banner_max_width;
			} elseif ( '' !== $banner_max_width_text && '' !== $banner_max_width_unit ) {
				$banner_size = 'max-width:' . $banner_max_width_text . $banner_max_width_unit;
			}

			$banner_style = $banner_bg . $banner_text . $banner_size . ';';

			// session data attributes
			$session_data_attributes = '';
			if ( '' !== $check_session && '' !== $session_count_check && '' !== $session_count_operator ) {
				$session_data_attributes = ' data-session-count-to-check="' . $session_count_check . '" data-session-count-operator="' . $session_count_operator . '"';
			}

			?>

			<div class="m-wp-insert-message-item m-wp-insert-message-item-<?php echo $key; ?> m-wp-insert-message-item-<?php echo $type; ?><?php echo ( 'page' === $banner_max_width ) ? ' banner-width-page' : ''; ?>" style="padding: 15px 10px 5px 10px; Margin: 15px 0; border: 1px solid #cccccf; <?php echo $banner_style; ?>">

				<?php if ( 'dualcol' === $screen_size[ $prefix . 'banner_layout' ] ) : ?>
					<!-- Dual Col -->
					<div class="dual-wrap <?php echo ( isset( $screen_size[ $prefix . 'banner_flip_columns' ] ) && 'on' === $screen_size[ $prefix . 'banner_flip_columns' ] ) ? 'flip' : ''; ?>">
						<div class="col">
							<?php require( 'banner/text.php' ); ?>
						</div>
						<div class="col">
							<?php if ( 'button' === $screen_size[ $prefix . 'cta_type_email' ] ) : ?>
								<?php require( 'banner/cta-button.php' ); ?>
							<?php endif; ?>
							<?php require( 'banner/disclaimer.php' ); ?>
						</div>
					</div>
				<?php endif; ?>

				<?php if ( 'stacked' === $screen_size[ $prefix . 'banner_layout' ] ) : ?>
					<!-- Stacked Banner -->
					<div class="stack-wrap">
						<?php require( 'banner/text.php' ); ?>
						<?php if ( 'button' === $screen_size[ $prefix . 'cta_type_email' ] ) : ?>
							<?php require( 'banner/cta-button.php' ); ?>
						<?php endif; ?>
						<?php require( 'banner/disclaimer.php' ); ?>
					</div>
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
		</div>
		<!--[if (gte mso 9)|(IE)]>
				</td>
			</tr>
		</table>
		<![endif]-->
		</td> <!-- end .one-column.message -->
	</tr> <!-- end row -->
<?php endif; ?>
