<table role="presentation">
	<tr>
		<td class="m-post m-post-newsletter m-post-newsletter-<?php echo $args['newsletter_type']; ?><?php echo isset( $args['extra_class'] ) ? $args['extra_class'] : ''; ?>">
			<div class="post-contents">
				<?php if ( 'none' !== $args['image_size'] ) : ?>
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
				<?php if ( true === $args['show_category'] ) : ?>
					<?php minnpost_category_breadcrumb_newsletter(); ?>
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
							<?php echo minnpost_newsletter_get_entry_excerpt(); ?>
						</td>
					</tr>
				</table>
				<table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="m-entry-byline">
					<tr>
						<td>
							<?php minnpost_posted_by( get_the_ID(), true, false ); ?>
						</td>
					</tr>
				</table>
			</div>
		</td>
	</tr>
</table>