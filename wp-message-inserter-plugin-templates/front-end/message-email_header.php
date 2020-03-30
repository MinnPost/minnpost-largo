<?php
/**
 * Template and variables for email header site message
 * This template controls editor and image messages, as well as loading the banner message template, specifically for the email header region.
 *
 * @package MinnPost Largo
 */
$message         = $attributes['message'];
$prefix          = $attributes['meta_prefix'];
$message_counter = $attributes['message_counter'];
$region          = $message['meta'][ $prefix . 'region' ][0];
$id              = $message['ID'];
$slug            = $message['post_name'];
$type            = $message['meta'][ $prefix . 'message_type' ][0];
$screen_sizes    = isset( $message['meta'][ $prefix . 'screen_size' ][0] ) && '' !== $message['meta'][ $prefix . 'screen_size' ][0] ? maybe_unserialize( $message['meta'][ $prefix . 'screen_size' ][0] ) : array();
$body_classes    = get_body_class();
$wp_classes      = '';
foreach ( $body_classes as $class ) {
	$wp_classes .= 'wp-message-inserter-message-' . $class . ' ';
}

// setup for checking sessions
$check_session          = isset( $message['meta'][ $prefix . 'check_session' ] ) ? $message['meta'][ $prefix . 'check_session' ][0] : '';
$session_count_check    = isset( $message['meta'][ $prefix . 'number_of_sessions' ] ) ? $message['meta'][ $prefix . 'number_of_sessions' ][0] : '';
$session_count_operator = isset( $message['meta'][ $prefix . 'operator_session' ] ) ? $message['meta'][ $prefix . 'operator_session' ][0] : '';

// close timer setup
$close_time_days  = 0;
$close_time_hours = 0;

// sort screen sizes
usort(
	$screen_sizes,
	function ( array $a, array $b ) use ( $prefix ) {
		return $a[ $prefix . 'minimum_width' ] <=> $b[ $prefix . 'minimum_width' ];
	}
);

?>

<?php if ( 'image' === $type || 'editor' === $type ) : ?>

	<tr>
		<td class="one-column message" style="border-collapse: collapse; border-bottom-width: 2px; border-bottom-color: #cccccf; border-bottom-style: solid; Margin: 0; padding: 0;">
		<!--[if (gte mso 9)|(IE)]>
			<table cellpadding="0" cellspacing="0" width="100%">
				<tr>
					<td width="100%" valign="bottom">
		<![endif]-->
			<div class="message">
				<?php if ( 'image' === $type ) : ?>
					<div class="m-wp-insert-message-item m-wp-insert-message-images">
						<?php if ( isset( $message['meta'][ $prefix . 'link_url' ] ) ) : ?>
							<a href="<?php echo $message['meta'][ $prefix . 'link_url' ][0]; ?>">
							<?php endif; ?>
							<picture>
								<?php foreach ( $screen_sizes as $key => $screen_size ) : ?>
									<?php
									if ( ( ! isset( $screen_size[ $prefix . 'no_maximum_width' ] ) || ( isset( $screen_size[ $prefix . 'no_maximum_width' ] ) && 'on' !== $screen_size[ $prefix . 'no_maximum_width' ] ) ) && isset( $screen_size[ $prefix . 'maximum_width' ] ) ) {
										$max_width = '(max-width: ' . $screen_size[ $prefix . 'maximum_width' ] . 'px)';
									} else {
										$max_width = '';
									}

									if ( isset( $screen_size[ $prefix . 'minimum_width' ] ) && 0 !== filter_var( $screen_size[ $prefix . 'minimum_width' ], FILTER_VALIDATE_INT ) ) {
										$min_width = '(min-width: ' . $screen_size[ $prefix . 'minimum_width' ] . 'px)';
									} else {
										$min_width = '';
									}
									if ( '' !== $min_width && '' !== $max_width ) {
										$join = ' and ';
									} else {
										$join = '';
									}
									?>
									<source media="<?php echo $min_width; ?><?php echo $join; ?><?php echo $max_width; ?>" srcset="<?php echo $screen_size[ $prefix . 'message_image' ]; ?>">
								<?php endforeach; ?>
								<img src="<?php echo $screen_sizes[0][ $prefix . 'message_image' ]; ?>" alt="<?php echo get_post_meta( $screen_sizes[0][ $prefix . 'message_image_id' ], '_wp_attachment_image_alt', true ); ?>">
							</picture>
							<?php if ( isset( $message['meta'][ $prefix . 'link_url' ] ) ) : ?>
							</a>
						<?php endif; ?>
					</div>
				<?php endif; ?>

				<?php if ( 'editor' === $type ) : ?>
					<?php if ( 0 < count( $screen_sizes ) ) : ?>
						<?php foreach ( $screen_sizes as $key => $screen_size ) : ?>
							<div class="m-wp-insert-message-item m-wp-insert-message-editor m-wp-insert-message-item-<?php echo $key; ?>">
								<?php
								$content = apply_filters( 'the_content', $screen_size[ $prefix . 'message_editor' ], 20 );
								// email content filter
								$content = apply_filters( 'format_email_content', $content, false, true );
								echo $content;
								?>
							</div>
						<?php endforeach; ?>
					<?php endif; ?>
				<?php endif; ?>
			</div>
		<!--[if (gte mso 9)|(IE)]>
				</td>
			</tr>
		</table>
		<![endif]-->
		</td> <!-- end .one-column.message -->
	</tr> <!-- end row -->
<?php endif; ?>

<?php
// For Banners we Loop over them because with session checking we might need to load more than one
foreach ( $attributes as $message ) {
	if ( isset( $message['meta'] ) && is_array( $message['meta'] ) ) {
		$type = $message['meta'][ $prefix . 'message_type' ][0];
		if ( 'banner' === $type ) {
			require( 'includes/email_header-banner.php' );
		}
	}
}
?>
