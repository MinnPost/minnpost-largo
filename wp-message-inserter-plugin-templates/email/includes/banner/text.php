<?php
/**
 * Template for main banner text
 *
 * @package WP Message Inserter Plugin
 */

?>

<?php if ( isset( $screen_size[ $prefix . 'banner_heading' ] ) || isset( $screen_size[ $prefix . 'banner_shortcopy' ] ) ) : ?>
	<div class="o-row o-site-message-row">
		<div class="item-contents">
			<?php if ( isset( $screen_size[ $prefix . 'banner_heading' ] ) ) : ?>
				<h3><?php echo $screen_size[ $prefix . 'banner_heading' ]; ?></h3>
			<?php endif; ?>
			<?php if ( isset( $screen_size[ $prefix . 'banner_shortcopy' ] ) ) : ?>
				<?php
				// apply content filter
				$content = apply_filters( 'the_content', $screen_size[ $prefix . 'banner_shortcopy' ], 20 );
				// email content filter
				$content = apply_filters( 'format_email_content', $content, false, true );
				echo $content;
				?>
			<?php endif; ?>
		</div>
	</div>
<?php endif; ?>
