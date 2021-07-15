<?php
/**
 * Template part for displaying newsletter content around the posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<table width="100%" align="center" cellpadding="0" cellspacing="0" role="presentation" class="o-full-table">
	<tr>
		<td align="center">
			<div class="o-wrapper">
				[outlook]
				<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
					<tr>
						<td align="center" class="outlook-outer-padding">
							<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
								<tr>
									<td class="outlook-inner-padding">
				[/outlook]
					<div class="o-columns o-header">
						[outlook]
						<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
							<tr>
								<td align="center" class="outlook-outer-padding">
									<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
										<tr>
											<td class="outlook-inner-padding">
						[/outlook]
						<div class="o-column a-logo a-logo-fullwidth">
							<div class="item-contents">
								<img src="<?php minnpost_newsletter_logo( get_the_ID(), false ); ?>" alt="<?php bloginfo( 'name' ); ?>" class="light-img">
								<?php
								/* this doesn't currently work because the mailchimp importer removes display none elements.
								[not-outlook]
									<div class="dark-img-wrapper -emogrifier-keep">
										<img src="<?php minnpost_newsletter_logo( get_the_ID(), true ); ?>" alt="<?php bloginfo( 'name' ); ?>" class="dark-img -emogrifier-keep">
									</div>
								[/not-outlook]*/
								?>
							</div>
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

					<?php do_action( 'wp_message_inserter', 'email_header', 'email' ); ?>

					<div class="o-single-column o-newsletter-intro">
						[outlook]
						<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
							<tr>
								<td align="center" class="outlook-outer-padding">
									<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
										<tr>
											<td class="outlook-inner-padding">
						[/outlook]
						<div class="item-contents">
							<?php
							// teaser text
							$republication_newsletter_override_teaser = get_post_meta( get_the_ID(), '_mp_newsletter_republication_newsletter_override_teaser', true );
							$do_not_show_automatic_teaser_items       = get_post_meta( get_the_ID(), '_mp_newsletter_do_not_show_automatic_teaser_items', true );
							$do_not_show_teaser_text                  = get_post_meta( get_the_ID(), '_mp_newsletter_do_not_show_teaser_text', true );
							if ( 'on' !== $do_not_show_automatic_teaser_items || 'on' !== $do_not_show_teaser_text ) :
								?>
								<div class="o-row m-teaser">
								<?php
							endif;
							?>
							<?php if ( 'on' !== $republication_newsletter_override_teaser ) : ?>
								<?php minnpost_newsletter_teaser(); ?>
							<?php else : ?>
								<?php if ( 'on' !== $do_not_show_automatic_teaser_items ) : ?>
									<?php minnpost_newsletter_today(); ?>
								<?php endif; ?>
								<?php if ( 'on' !== $do_not_show_teaser_text ) : ?>
									<?php minnpost_newsletter_teaser(); ?>
								<?php endif; ?>
								<?php if ( 'on' !== $do_not_show_automatic_teaser_items ) : ?>
									<?php minnpost_newsletter_type_welcome(); ?>
								<?php endif; ?>
							<?php endif; ?>
							<?php
							if ( 'on' !== $do_not_show_automatic_teaser_items || 'on' !== $do_not_show_teaser_text ) :
								?>
								</div>
								<?php
							endif;
							?>

							<?php
							// body text
							$body = apply_filters( 'the_content', get_the_content() );
							if ( '' !== $body ) :
								?>
								<div class="o-row m-newsletter-body">
									<?php echo $body; ?>
								</div>
								<?php
							endif;
							?>
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

					<?php do_action( 'wp_message_inserter', 'above_email_articles', 'email' ); ?>

					<?php
					// republishable post section
					$section               = 'republishable';
					$republishable_query   = minnpost_newsletter_get_section_query( $section );
					$args['section']       = $section;
					$args['show_category'] = true;
					?>
					<?php if ( $republishable_query->have_posts() ) : ?>
						<div class="o-single-column o-section-republishable-stories">

							[outlook]
							<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
								<tr>
									<td align="center" class="outlook-outer-padding">
										<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
											<tr>
												<td class="outlook-inner-padding">
							[/outlook]

							<?php
							$post_count        = $republishable_query->post_count;
							$this_section_post = 0;
							?>

							<?php if ( '' !== minnpost_newsletter_get_section_title( $section ) ) : ?>
								<table role="presentation" width="100%" class="h2 a-section-title">
									<tr>
										<td>
											<h2><?php echo minnpost_newsletter_get_section_title( $section ); ?></h2>
										</td>
									</tr>
								</table>
							<?php endif; ?>

							<?php
							$newsletter_id = get_the_ID();
							while ( $republishable_query->have_posts() ) :
								$this_section_post++;
								$republishable_query->the_post();
								set_query_var( 'current_post', $republishable_query->current_post );
								$args['image_for_republish_stories'] = get_post_meta( $newsletter_id, '_mp_newsletter_image_for_republish_stories', true );
								$args['post_id']                     = $id;
								// if there's no image, or if it's the first story and we want to treat it differently.
								if ( '' !== $args['image_for_republish_stories'] ) {
									if ( 'none' === $args['image_for_republish_stories'] || ( 1 !== $this_section_post && 'full-first' === $args['image_for_republish_stories'] ) ) {
										$args['image_size'] = 'none';
									} elseif ( 'thumb' === $args['image_for_republish_stories'] ) {
										$args['image_size'] = 'thumb';
									} else {
										$args['image_size'] = 'full';
									}
								} else {
									$args['image_size'] = 'thumb';
								}
								$args['extra_class'] = '';
								if ( $post_count === $this_section_post ) {
									$args['extra_class'] = ' m-post-newsletter-last';
								}
								?>

								<?php
								// with newsletters, the individual post can override the image size for the newsletter section the post is in.
								$override_size = esc_html( get_post_meta( $args['post_id'], '_mp_post_newsletter_image_size', true ) );
								if ( '' !== $override_size && 'default' !== $override_size ) {
									$args['image_size'] = $override_size;
								}
								get_template_part( 'template-parts/post-newsletter', $args['newsletter_type'], $args );
							endwhile;
							wp_reset_postdata();
							?>
							[outlook]
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
							[/outlook]
						</div>
					<?php endif; ?>

					<?php
					// upcoming stories section
					$upcoming = get_post_meta( get_the_ID(), '_mp_newsletter_upcoming', true );
					$upcoming = apply_filters( 'the_content', $upcoming );
					if ( '' !== $upcoming ) :
						?>
					<div class="o-single-column o-newsletter-upcoming">
						[outlook]
						<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
							<tr>
								<td align="center" class="outlook-outer-padding">
									<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
										<tr>
											<td class="outlook-inner-padding">
						[/outlook]
						<div class="item-contents">
							<div class="o-row m-upcoming">
								<?php
								$upcoming = apply_filters( 'format_email_content', $upcoming );
								echo $upcoming;
								?>
							</div>
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
						<?php
					endif;
					?>

					<?php do_action( 'wp_message_inserter', 'email_before_bios', 'email' ); ?>

					<?php do_action( 'wp_message_inserter', 'email_bottom', 'email' ); ?>

					<div class="o-columns o-footer">
						[outlook]
						<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
							<tr>
								<td align="center" class="outlook-outer-padding">
									<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
										<tr>
											<td class="outlook-inner-padding">
						[/outlook]
						<div class="o-column o-footer">
							<div class="item-contents">
								<div align="center">
									<table role="presentation" id="footer-network" class="m-secondary-navigation">
										<?php
										wp_nav_menu(
											array(
												'theme_location' => 'minnpost_network_email',
												'menu_id'        => 'minnpost-network-emails',
												'depth'          => 1,
												'container'      => false,
												'walker'         => new Minnpost_Email_Walker_Nav_Menu,
												'priority'       => '20',
												'items_wrap'     => '<tr id="%1$s" class="m-menu m-menu-%1$s">%3$s</tr>',
												'item_classes'   => 'values',
											)
										);
										?>
									</table>
								</div>
								<?php
								$footer_message = get_option( 'site_footer_message', '' );
								if ( '' !== $footer_message ) :
									?>
									<p class="a-footer-message"><?php echo $footer_message; ?></p>
								<?php endif; ?>
							</div>
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
				[outlook]
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
				[/outlook]
			</div>
		</td>
	</tr>
</table>
