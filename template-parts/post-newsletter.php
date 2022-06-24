<table role="presentation">
	<tr>
		<td class="m-post m-post-newsletter m-post-newsletter-<?php echo $args['newsletter_type']; ?><?php echo isset( $args['extra_class'] ) ? $args['extra_class'] : ''; ?>">
			<div class="post-contents">
				<?php if ( 'none' !== $args['image_size'] ) : ?>
					<table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="m-post-image m-post-image-<?php echo $args['image_size']; ?>">
						<tr>
							<td>
								<a href="<?php echo get_the_permalink(); ?>"><?php minnpost_post_image( $args['image_size'] ); ?></a>
							</td>
						</tr>
					</table>
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
