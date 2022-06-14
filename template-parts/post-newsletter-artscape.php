<?php
/**
 * Template part for displaying posts inside the artscape newsletter template
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */
?>
<div class="m-post m-post-newsletter m-post-newsletter-<?php echo $args['newsletter_type']; ?><?php echo isset( $args['extra_class'] ) ? $args['extra_class'] : ''; ?>">
	[outlook]
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
		<tr>
			<td align="center" class="outlook-outer-padding">
				<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
					<tr>
						<td class="outlook-inner-padding">
	[/outlook]
	<div class="post-contents">
		<?php if ( $args['image_size'] === 'full' ) : ?>
			<table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="m-post-image m-post-image-<?php echo $args['image_size']; ?>">
				<tr>
					<td>
						<?php
						$attributes = array(
							'content_width'  => 600,
							'content_height' => 400,
						);
						if ( ! empty( get_minnpost_post_image( $args['image_size'], $attributes ) ) ) :
							?>
							<a href="<?php echo get_the_permalink(); ?>"><?php minnpost_post_image( $args['image_size'], $attributes ); ?></a>
						<?php elseif ( ! empty( minnpost_largo_get_social_images() ) ) : ?>
							<?php
							$meta_images = minnpost_largo_get_social_images( $id );
							$image_id    = array_key_first( $meta_images );
							$image_url   = wp_get_attachment_url( $image_id );
							if ( function_exists( 'get_minnpost_modified_image_url' ) ) {
								$image_url = get_minnpost_modified_image_url( $image_url, $attributes );
							}
							?>
							<a href="<?php echo get_the_permalink(); ?>"><?php echo minnpost_largo_manual_image_tag( $image_id, $image_url, $attributes, 'newsletter' ); ?></a>
						<?php endif; ?>
					</td>
				</tr>
			</table>
		<?php endif; ?>
		<?php if ( $args['show_category'] === true ) : ?>
			[not-outlook]
				<?php minnpost_category_breadcrumb_newsletter(); ?>
			[/not-outlook]
			[outlook]
			<?php minnpost_category_breadcrumb_newsletter_outlook(); ?>
			[/outlook]
		<?php endif; ?>
		<table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="h3 a-entry-title">
			<tr>
				<td>
					<h3><a href="<?php echo get_the_permalink(); ?>"><?php echo minnpost_newsletter_get_entry_title(); ?></a></h3>
				</td>
			</tr>
		</table>
		<table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="m-entry-excerpt">
			<tr>
				<td>
					[outlook]
						<table role="presentation" width="202" cellpadding="0" cellspacing="0" class="outlook-table" style="width: 202px; max-width: 202px; Float: left;" align="left">
							<tr>
								<td valign="top" align="left">
					[/outlook]
					<?php
					if ( $args['image_size'] === 'thumb' ) {
						minnpost_post_image(
							'feature',
							array(
								'title'  => get_the_title(),
								'class'  => 'a-excerpt-thumb',
								'align'  => 'left',
								'width'  => 190,
								'height' => 126, // leaving the height at 9999 instead of a fixed height will mess us up.
							),
							'',
							false
						);
					}
					?>
					[outlook]
						</td>
							</tr>
								</table>
					[/outlook]
					<?php echo minnpost_newsletter_get_entry_excerpt(); ?>
				</td>
			</tr>
		</table>
	</div>
	[outlook]
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
	[/outlook]
</div>
