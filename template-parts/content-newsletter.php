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
						<div class="o-column a-logo">
							<div class="item-contents">
								<img src="<?php minnpost_newsletter_logo( get_the_ID(), false ); ?>" alt="<?php bloginfo( 'name' ); ?>" class="light-img">
								[not-outlook]
									<div class="dark-img">
										<img src="<?php minnpost_newsletter_logo( get_the_ID(), true ); ?>" alt="<?php bloginfo( 'name' ); ?>">
									</div>
								[/not-outlook]
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
					<div class="o-columns o-navigation">
						[outlook]
						<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
							<tr>
								<td align="center" class="outlook-outer-padding">
									<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
										<tr>
											<td class="outlook-inner-padding">
						[/outlook]
						<div class="o-column o-navigation">
							<table role="presentation" id="navigation-primary" class="m-main-navigation">
								<?php
								wp_nav_menu(
									array(
										'theme_location' => 'primary_links',
										'menu_id'      => 'primary-links',
										'depth'        => 1,
										'container'    => false,
										'walker'       => new Minnpost_Email_Walker_Nav_Menu,
										'priority'     => '20',
										'items_wrap'   => '<tr id="%1$s" class="m-menu m-menu-%1$s">%3$s</tr>',
										'item_classes' => 'values',
									)
								);
								?>
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
					// top post section
					$section               = 'top';
					$top_query             = minnpost_newsletter_get_section_query( $section );
					$args['image_size']    = 'full';
					$args['section']       = $section;
					$args['show_category'] = true;
					$total_post_count      = 0;
					$this_section_post     = 0;
					?>
					<?php if ( $top_query->have_posts() ) : ?>
						<?php
						$post_count = $top_query->post_count;
						$total_post_count++;
						$this_section_post++;
						?>
						<div class="o-single-column o-section-top-story">
							[outlook]
							<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
								<tr>
									<td align="center" class="outlook-outer-padding">
										<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
											<tr>
												<td class="outlook-inner-padding">
							[/outlook]
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
							while ( $top_query->have_posts() ) :
								$top_query->the_post();
								set_query_var( 'current_post', $top_query->current_post );
								$args['post_id'] = $id;
								// with newsletters, the individual post can override the image size for the newsletter section the post is in.
								$override_size = esc_html( get_post_meta( $args['post_id'], '_mp_post_newsletter_image_size', true ) );
								if ( '' !== $override_size && 'default' !== $override_size ) {
									$args['image_size'] = $override_size;
								}
								$args['extra_class'] = '';
								if ( $post_count === $this_section_post ) {
									$args['extra_class'] = ' m-post-newsletter-last';
								}
								get_template_part( 'template-parts/post-newsletter-fullwidth', $args['newsletter_type'], $args );
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
					<?php endif; ?>

					<?php
					// news post section
					$section               = 'news';
					$news_query            = minnpost_newsletter_get_section_query( $section );
					$args['section']       = $section;
					$args['show_category'] = true;
					?>
					<?php if ( $news_query->have_posts() ) : ?>
						<div class="o-single-column o-section-news-stories">
						[outlook]
						<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
							<tr>
								<td align="center" class="outlook-outer-padding">
									<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
										<tr>
											<td class="outlook-inner-padding">
						[/outlook]

						<?php
						$post_count        = $news_query->post_count;
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
						while ( $news_query->have_posts() ) :
							$this_section_post++;
							$total_post_count++;
							$news_query->the_post();
							set_query_var( 'current_post', $news_query->current_post );
							$args['post_id'] = $id;
							if ( 1 !== $this_section_post ) {
								$args['image_size'] = 'none';
							} else {
								$args['image_size'] = 'full';
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
							get_template_part( 'template-parts/post-newsletter-fullwidth', $args['newsletter_type'], $args );
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

					<?php do_action( 'wp_message_inserter', 'email_middle', 'email' ); ?>

					<?php
					// opinion post section
					$section               = 'opinion';
					$opinion_query         = minnpost_newsletter_get_section_query( $section );
					$args['section']       = $section;
					$args['show_category'] = true;
					?>
					<?php if ( $opinion_query->have_posts() ) : ?>
						<div class="o-single-column o-section-opinion-stories">

							[outlook]
							<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
								<tr>
									<td align="center" class="outlook-outer-padding">
										<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
											<tr>
												<td class="outlook-inner-padding">
							[/outlook]

							<?php
							$post_count        = $opinion_query->post_count;
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
							while ( $opinion_query->have_posts() ) :
								$this_section_post++;
								$total_post_count++;
								$opinion_query->the_post();
								set_query_var( 'current_post', $opinion_query->current_post );
								$args['post_id'] = $id;
								if ( 1 !== $this_section_post ) {
									$args['image_size'] = 'none';
								} else {
									$args['image_size'] = 'full';
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
								get_template_part( 'template-parts/post-newsletter-fullwidth', $args['newsletter_type'], $args );
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

					<?php
					// editors choice post section
					$section                    = 'editors';
					$newsletter_recommended_query = z_get_zone_query( 'newsletter-recommended-stories' );
					if ( $newsletter_recommended_query->have_posts() ) {
						$editors_query = $newsletter_recommended_query;
					} else {
						$editors_query = minnpost_newsletter_get_section_query( $section );
					}
					$args['section']            = $section;
					$args['show_category']      = false;
					$use_other_section_settings = get_post_meta( get_the_ID(), '_mp_newsletter_editors_use_other_section_settings', true );
					$remove_editors_section     = get_post_meta( get_the_ID(), '_mp_newsletter_remove_editors_section', true );
					?>
					<?php if ( 'on' !== $remove_editors_section && $editors_query->have_posts() ) : ?>
						<div class="o-single-column o-section-editors-stories">
							[outlook]
							<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
								<tr>
									<td align="center" class="outlook-outer-padding">
										<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
											<tr>
												<td class="outlook-inner-padding">
							[/outlook]

							<?php
							$post_count         = isset( $newsletter_recommended_query->post_count ) ? $newsletter_recommended_query->post_count : $editors_query->post_count;
							$this_section_post  = 0;
							$args['image_size'] = 'none';
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
							while ( $editors_query->have_posts() ) :
								$this_section_post++;
								$total_post_count++;
								$editors_query->the_post();
								set_query_var( 'current_post', $editors_query->current_post );
								$args['post_id'] = $id;
								if ( 'on' === $use_other_section_settings ) {
									$args['show_category'] = true;
									if ( 1 !== $this_section_post ) {
										$args['image_size'] = 'none';
									} else {
										$args['image_size'] = 'full';
									}
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
								get_template_part( 'template-parts/post-newsletter-fullwidth', $args['newsletter_type'], $args );
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
