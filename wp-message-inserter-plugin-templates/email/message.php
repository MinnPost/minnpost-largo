<?php
/**
 * Template and variables for email site message
 * This template controls editor and image messages, as well as loading the banner message template, specifically for emails.
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
$screen_sizes    = isset( $message['meta'][ $prefix . 'screen_size' ][0] ) && $message['meta'][ $prefix . 'screen_size' ][0] !== '' ? maybe_unserialize( $message['meta'][ $prefix . 'screen_size' ][0] ) : array();
$body_classes    = get_body_class();
$wp_classes      = '';
foreach ( $body_classes as $class ) {
	$wp_classes .= 'wp-message-inserter-message-' . $class . ' ';
}
// sort screen sizes
usort(
	$screen_sizes,
	function ( array $a, array $b ) use ( $prefix ) {
		return $a[ $prefix . 'minimum_width' ] <=> $b[ $prefix . 'minimum_width' ];
	}
);

?>

<?php if ( $type === 'image' || $type === 'editor' ) : ?>
	<div class="o-columns o-site-message wp-message-inserter-message wp-message-inserter-message-<?php echo $slug; ?> wp-message-inserter-message-region-<?php echo $region; ?> wp-message-inserter-message-id-<?php echo $id; ?> wp-message-inserter-message-<?php echo $type; ?> wp-message-inserter-message-<?php echo $message_counter; ?>">
		[outlook]
		<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
			<tr>
				<td align="center" class="outlook-outer-padding">
					<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
						<tr>
							<td class="outlook-inner-padding">
		[/outlook]
		<div class="o-column o-site-message">
			<div class="item-contents item-contents--margin">
				<?php if ( $type === 'image' ) : ?>
					<div class="m-wp-insert-message-item m-wp-insert-message-images">
						<?php if ( isset( $message['meta'][ $prefix . 'link_url' ] ) ) : ?>
							<a href="<?php echo $message['meta'][ $prefix . 'link_url' ][0]; ?>">
							<?php endif; ?>
							<picture>
								<?php foreach ( $screen_sizes as $key => $screen_size ) : ?>
									<?php
									if ( ( ! isset( $screen_size[ $prefix . 'no_maximum_width' ] ) || ( isset( $screen_size[ $prefix . 'no_maximum_width' ] ) && $screen_size[ $prefix . 'no_maximum_width' ] !== 'on' ) ) && isset( $screen_size[ $prefix . 'maximum_width' ] ) ) {
										$max_width = '(max-width: ' . $screen_size[ $prefix . 'maximum_width' ] . 'px)';
									} else {
										$max_width = '';
									}

									if ( isset( $screen_size[ $prefix . 'minimum_width' ] ) && filter_var( $screen_size[ $prefix . 'minimum_width' ], FILTER_VALIDATE_INT ) !== 0 ) {
										$min_width = '(min-width: ' . $screen_size[ $prefix . 'minimum_width' ] . 'px)';
									} else {
										$min_width = '';
									}
									if ( $min_width !== '' && $max_width !== '' ) {
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

				<?php if ( $type === 'editor' ) : ?>
					<?php if ( 0 < count( $screen_sizes ) ) : ?>
						<?php foreach ( $screen_sizes as $key => $screen_size ) : ?>
							<div class="m-wp-insert-message-item m-wp-insert-message-editor m-wp-insert-message-item-<?php echo $key; ?>">
								<?php
								$content = apply_filters( 'the_content', $screen_size[ $prefix . 'message_editor' ], 20 );
								// email content filter.
								//$content = apply_filters( 'format_email_content', $content, false, true );
								echo $content;
								?>
							</div>
						<?php endforeach; ?>
					<?php endif; ?>
				<?php endif; ?>
			</div> <!-- item-contents -->
		</div>
		[outlook]
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
		[/outlook]
	</div> <!-- end o-site-message -->
<?php elseif ( $type === 'banner' ) : ?>
	<?php require 'includes/banner.php'; ?>
<?php endif; ?>
