<?php
/**
 * Template and variables for banner messages within HTML emails
 * This template the banner messages only
 *
 * @package WP Message Inserter Plugin
 */

?>

<?php if ( 0 < count( $screen_sizes ) ) : ?>
	<?php foreach ( $screen_sizes as $key => $screen_size ) : ?>

		<?php
		// Banner BG Setup
		$bgcolor     = isset( $screen_size[ $prefix . 'banner_bgcolor' ] ) ? $screen_size[ $prefix . 'banner_bgcolor' ] : '';
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

		?>

		<?php if ( 'dualcol' === $screen_size[ $prefix . 'banner_layout' ] ) : ?>
			<!-- Dual Col -->
			<div class="o-columns o-site-message wp-message-inserter-message wp-message-inserter-message-<?php echo $slug; ?> wp-message-inserter-message-region-<?php echo $region; ?> wp-message-inserter-message-id-<?php echo $id; ?> wp-message-inserter-message-<?php echo $type; ?> wp-message-inserter-message-<?php echo $message_counter; ?> dual-wrap <?php echo ( isset( $screen_size[ $prefix . 'banner_flip_columns' ] ) && 'on' === $screen_size[ $prefix . 'banner_flip_columns' ] ) ? 'flip' : ''; ?>" style="<?php echo $banner_style; ?>">
				[outlook]
					<table role="presentation" width="100%" class="o-columns o-site-message">
						<tr>
							<td class="o-column o-site-message-column o-site-message-column-text">
				[/outlook]
				<div class="o-column o-site-message-column o-site-message-column-text">				
					<div class="item-contents item-contents--margin">
						<?php require( 'banner/text.php' ); ?>
					</div>
				</div> <!-- .o-column -->
				[outlook]
							</td>
							<?php echo 'the type is ' . $screen_size[ $prefix . 'cta_type_email' ]; ?>
							<?php if ( 'button' === $screen_size[ $prefix . 'cta_type_email' ] ) : ?>
							<td class="o-column o-site-message-column o-site-message-column-button">
				[/outlook]
				<div class="o-column o-site-message-column o-site-message-column-button">
					<div class="item-contents item-contents--margin">
						<?php if ( 'button' === $screen_size[ $prefix . 'cta_type_email' ] ) : ?>
							<?php require( 'banner/cta-button.php' ); ?>
						<?php endif; ?>
						<?php require( 'banner/disclaimer.php' ); ?>
					</div>
				</div>
				[outlook]
							</td>
							<?php endif; ?>
						</tr>
					</table>
				[/outlook]
			</div> <!-- end o-columns.o-site-message -->
		<?php endif; ?>

		<?php if ( 'stacked' === $screen_size[ $prefix . 'banner_layout' ] ) : ?>
			<!-- Stacked Banner -->
			<div class="o-rows o-site-message stack-wrap <?php echo ( isset( $screen_size[ $prefix . 'banner_flip_columns' ] ) && 'on' === $screen_size[ $prefix . 'banner_flip_columns' ] ) ? 'flip' : ''; ?>" style="<?php echo $banner_style; ?>">
				[outlook]
					<table role="presentation" width="100%" class="o-rows o-site-message">
						<tr>
							<td class="o-row o-site-message-row o-site-message-row-text">
				[/outlook]
				<?php if ( isset( $screen_size[ $prefix . 'banner_heading' ] ) || isset( $screen_size[ $prefix . 'banner_shortcopy' ] ) ) : ?>
					<div class="o-row o-site-message-row">
						<div class="item-contents item-contents--margin">
							<?php require( 'banner/text.php' ); ?>
						</div>
					</div>
				<?php endif; ?>
				<div class="o-row o-site-message-row o-site-message-row-button">
					<div class="item-contents item-contents--margin">
						<?php if ( is_array( $screen_size[ $prefix . 'banner_buttondetails' ] ) || isset( $screen_size[ $prefix . 'banner_disclaimer' ] ) ) : ?>
							<?php if ( 'button' === $screen_size[ $prefix . 'cta_type_email' ] ) : ?>
								<?php require( 'banner/cta-button.php' ); ?>
							<?php endif; ?>
							<?php require( 'banner/disclaimer.php' ); ?>
						<?php endif; ?>
					</div>
				</div>
				[outlook]
							</td>
						</tr>
					</table>
				[/outlook]
			</div> <!-- end .o-rows.o-site-message -->
		<?php endif; ?>

	<?php endforeach; ?>
<?php endif; ?>
