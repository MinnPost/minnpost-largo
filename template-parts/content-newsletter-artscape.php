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
					<div class="o-columns o-header o-header-no-menu">
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
								/*
								 this doesn't currently work because the mailchimp importer removes display none elements.
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

					<div class="o-single-column m-newsletter-byline">
						[outlook]
						<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
							<tr>
								<td align="center" class="outlook-outer-padding">
									<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
										<tr>
											<td class="outlook-inner-padding">
						[/outlook]
						<div class="item-contents">
							<table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="a-newsletter-byline">
								<tr>
									<td>
										<?php minnpost_posted_by( get_the_ID(), true, true ); ?>
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
							<?php minnpost_newsletter_teaser(); ?>
							<?php
							// body text
							$body = apply_filters( 'the_content', get_the_content() );
							if ( $body !== '' ) :
								$body = apply_filters( 'format_email_content', $body, true, false );
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

						<?php if ( minnpost_newsletter_get_section_title( $section ) !== '' ) : ?>
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
							if ( $post_count === $this_section_post && $post_count > 2 ) {
								$args['extra_class'] = ' m-post-newsletter-last';
							}
							?>

							<?php
							// with newsletters, the individual post can override the image size for the newsletter section the post is in.
							$override_size = esc_html( get_post_meta( $args['post_id'], '_mp_post_newsletter_image_size', true ) );
							if ( $override_size !== '' && $override_size !== 'default' ) {
								$args['image_size'] = $override_size;
							}
							get_template_part( 'template-parts/post-newsletter', $args['newsletter_type'], $args );
							?>

							<?php if ( $total_post_count === 1 && isset( $ads[0] ) && ! empty( $ads[0] ) ) : ?>
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
							<?php elseif ( $total_post_count === 2 && isset( $ads[1] ) && ! empty( $ads[1] ) ) : ?>
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

					<?php
					$hide_author = get_post_meta( $id, '_mp_remove_author_from_display', true );
					$coauthors   = get_coauthors( get_the_ID() );
					$author_info = '';
					if ( $hide_author !== 'on' && empty( esc_html( get_post_meta( $id, '_mp_subtitle_settings_byline', true ) ) ) ) {
						foreach ( $coauthors as $key => $coauthor ) {
							$author_id    = $coauthor->ID;
							$author_info .= minnpost_get_author_figure( $author_id, 'photo', 'excerpt', true, 'cap-display_name', true, '', false, false );
						}
					}
					if ( $author_info !== '' ) {
						?>
						<div class="m-author-info m-author-info-excerpt
						<?php
						if ( is_singular() ) {
							?>
							 m-author-info-singular<?php } ?>
							<?php
							if ( is_single() ) {
								?>
							 m-author-info-single<?php } ?>">
							<?php
							$author_keys = array_keys( $coauthors );
							$last_key    = end( $author_keys );
							$end         = false;
							foreach ( $coauthors as $key => $coauthor ) :
								$author_id = $coauthor->ID;
								if ( $key === $last_key ) {
									$end = true;
								}
								minnpost_author_figure( $author_id, 'photo', 'excerpt', true, 'cap-display_name', true, '', false, false, $end );
							endforeach;
							?>
						</div>
						<?php
					}
					?>

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
												'menu_id'  => 'minnpost-network-emails',
												'depth'    => 1,
												'container' => false,
												'walker'   => new Minnpost_Email_Walker_Nav_Menu(),
												'priority' => '20',
												'items_wrap' => '<tr id="%1$s" class="m-menu m-menu-%1$s">%3$s</tr>',
												'item_classes' => 'values',
											)
										);
										?>
									</table>
								</div>
								<?php
								$footer_message = get_option( 'site_footer_message', '' );
								if ( $footer_message !== '' ) :
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
