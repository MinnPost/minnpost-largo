<?php
/**
 * Template part for displaying artscape newsletter content around the posts
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
						<div class="o-column a-logo">
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
									<td class="o-column m-support-cta">
						[/outlook]
						<div class="o-column m-support-cta">
							<div class="item-contents">
								<?php do_action( 'minnpost_membership_email_header' ); ?>
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
							$do_not_show_automatic_teaser_items = get_post_meta( get_the_ID(), '_mp_newsletter_do_not_show_automatic_teaser_items', true );
							$do_not_show_automatic_teaser_items = 'on';
							$do_not_show_teaser_text            = get_post_meta( get_the_ID(), '_mp_newsletter_do_not_show_teaser_text', true );
							if ( 'on' !== $do_not_show_automatic_teaser_items || 'on' !== $do_not_show_teaser_text ) :
								?>
								<div class="o-row m-teaser">
								<?php
							endif;
							?>
							<?php if ( 'on' !== $do_not_show_automatic_teaser_items ) : ?>
								<?php minnpost_newsletter_today(); ?>
							<?php endif; ?>
							<?php if ( 'on' !== $do_not_show_teaser_text ) : ?>
								<?php minnpost_newsletter_teaser(); ?>
							<?php endif; ?>
							<?php if ( 'on' !== $do_not_show_automatic_teaser_items ) : ?>
								<?php minnpost_newsletter_type_welcome(); ?>
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

					<?php $ads = minnpost_newsletter_get_ads( $args['newsletter_type'] ); ?>

					<?php
					// artscape post section
					$section               = 'artscape';
					$artscape_query        = minnpost_newsletter_get_section_query( $section );
					$args['section']       = $section;
					$args['show_category'] = false;
					?>
					<?php if ( $artscape_query->have_posts() ) : ?>
						<div class="o-single-column o-section-artscape-stories">
						[outlook]
						<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
							<tr>
								<td align="center" class="outlook-outer-padding">
									<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
										<tr>
											<td class="outlook-inner-padding">
						[/outlook]

						<?php
						$post_count        = $artscape_query->post_count;
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
						$total_post_count = 0;
						while ( $artscape_query->have_posts() ) :
							$this_section_post++;
							$total_post_count++;
							$artscape_query->the_post();
							set_query_var( 'current_post', $artscape_query->current_post );
							$args['post_id']     = $id;
							$args['image_size']  = 'thumb';
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
							?>

							<?php if ( 1 === $total_post_count && isset( $ads[0] ) && ! empty( $ads[0] ) ) : ?>
								<div class="o-single-column m-newsletter-ad-region">
									[outlook]
									<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
										<tr>
											<td align="center" class="outlook-outer-padding">
												<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
													<tr>
														<td class="outlook-inner-padding">
												[/outlook]
													<div class="item-contents">
														<?php echo $ads[0]; ?>
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
							<?php elseif ( 2 === $total_post_count && isset( $ads[1] ) && ! empty( $ads[1] ) ) : ?>
								<div class="o-single-column m-newsletter-ad-region">
									[outlook]
									<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
										<tr>
											<td align="center" class="outlook-outer-padding">
												<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
													<tr>
														<td class="outlook-inner-padding">
												[/outlook]
													<div class="item-contents">
														<?php echo $ads[1]; ?>
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
							<?php endif; ?>
							<?php
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