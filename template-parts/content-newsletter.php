<?php
/**
 * Template part for displaying newsletter content around the posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
	<tr>
		<td align="center">
			[outlook]
				<table role="presentation" align="center" class="o-wrapper">
					<tr>
						<td>
			[/outlook]
			<div class="o-wrapper">

				<div class="o-columns o-header">
					[outlook]
						<table role="presentation" width="100%" class="o-columns o-header">
							<tr>
								<td class="o-column a-logo">
					[/outlook]
					<div class="o-column a-logo">
						<div class="item-contents">
							<a href="<?php echo esc_url( get_permalink() ); ?>">
								<img src="<?php minnpost_newsletter_logo( get_the_ID() ); ?>" alt="<?php bloginfo( 'name' ); ?>">
							</a>
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
					[/outlook]
				</div> <!-- end o-header -->

				<div class="o-columns o-navigation">
					[outlook]
						<table role="presentation" width="100%" class="o-columns o-navigation">
							<tr>
								<td class="o-column o-navigation">
					[/outlook]
					<div class="o-column o-navigation">
						<div class="item-contents">
							<table id="navigation-primary" class="m-main-navigation">
								<?php
								wp_nav_menu(
									array(
										'theme_location' => 'primary_links',
										'menu_id'        => 'primary-links',
										'depth'          => 1,
										'container'      => false,
										'walker'         => new Minnpost_Email_Walker_Nav_Menu,
										'priority'       => '20',
										'items_wrap'     => '<tr id="%1$s" class="m-menu m-menu-%1$s">%3$s</tr>',
										'item_classes'   => 'values',
									)
								);
								?>
							</table><!-- #navigation-primary -->
						</div> <!-- item-contents -->
					</div>
					[outlook]
								</td>
							</tr>
						</table>
					[/outlook]
				</div> <!-- end o-navigation -->

				<?php do_action( 'wp_message_inserter', 'email_header', 'email' ); ?>

				<table role="presentation" width="100%" class="o-single-column">
					<tr>
						<td class="o-row">
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
						</td>
					</tr>
				</table>

				<?php do_action( 'wp_message_inserter', 'above_email_articles', 'email' ); ?>

				<?php $ads = minnpost_newsletter_get_ads( $args['newsletter_type'] ); ?>

				<div class="o-columns o-newsletter-section">
					[outlook]
						<table role="presentation" width="100%" class="o-columns o-newsletter-section">
							<tr>
								<td class="o-column o-newsletter-listing">
					[/outlook]
					<div class="o-column o-newsletter-listing">
						<div class="item-contents">
							<?php
							// top post section
							$section            = 'top';
							$top_query          = minnpost_newsletter_get_section_query( $section );
							$args['image_size'] = 'feature-large';
							$args['section']    = $section;
							?>
							<?php if ( $top_query->have_posts() ) : ?>
								<?php $post_count = $top_query->post_count; ?>
								<div class="o-row m-newsletter-stories m-newsletter-stories-<?php echo $section; ?> m-newsletter-stories-has-<?php echo (int) $post_count; ?>-post">
									<?php if ( '' !== minnpost_newsletter_get_section_title( $section ) ) : ?>
										<table role="presentation" width="100%" class="h2 a-section-title">
											<tr>
												<td>
													<div class="a-section-title-bg">
														<h2><?php echo minnpost_newsletter_get_section_title( $section ); ?></h2>
													</div>
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
										get_template_part( 'template-parts/post-newsletter', $args['newsletter_type'], $args );
									endwhile;
									wp_reset_postdata();
									?>
								</div> <!-- end row -->
							<?php endif; ?>

						</div>
					</div> <!-- .o-column -->
					[outlook]
								</td>
								<td class="o-column m-newsletter-ad">
					[/outlook]
					<div class="o-column m-newsletter-ad-region">
						<div class="item-contents">
							<div class="o-row m-newsletter-ad">
								<?php
								if ( isset( $ads[0] ) && ! empty( $ads[0] ) ) {
									echo $ads[0];
								}
								?>
							</div>
						</div>
					</div>
					[outlook]
								</td>
							</tr>
						</table>
					[/outlook]
				</div> <!-- end o-columns.o-newsletter-section -->

				<div class="o-columns o-newsletter-section">
					[outlook]
						<table role="presentation" width="100%" class="o-columns o-newsletter-section">
							<tr>
								<td class="o-column o-newsletter-listing">
					[/outlook]
					<div class="o-column o-newsletter-listing">
						<div class="item-contents">
							<?php
							// news post section
							$section         = 'news';
							$news_query      = minnpost_newsletter_get_section_query( $section );
							$args['section'] = $section;
							?>
							<?php if ( $news_query->have_posts() ) : ?>
								<?php
								$post_count     = $news_query->post_count;
								$this_news_post = 0;
								?>
								<div class="o-row m-newsletter-stories m-newsletter-stories-<?php echo $section; ?> m-newsletter-stories-has-<?php echo (int) $post_count; ?>-post">
									<?php if ( '' !== minnpost_newsletter_get_section_title( $section ) ) : ?>
										<table role="presentation" width="100%" class="h2 a-section-title">
											<tr>
												<td>
													<div class="a-section-title-bg">
														<h2><?php echo minnpost_newsletter_get_section_title( $section ); ?></h2>
													</div>
												</td>
											</tr>
										</table>
									<?php endif; ?>
									<?php
									while ( $news_query->have_posts() ) :
										$this_news_post++;
										$news_query->the_post();
										set_query_var( 'current_post', $news_query->current_post );
										$args['post_id'] = $id;

										// the first post in this section is differently sized than subsequents, by default.
										if ( 1 === $this_news_post ) {
											$args['image_size'] = 'feature-large';
										} else {
											$args['image_size'] = 'feature-medium';
										}

										$args['extra_class'] = '';
										if ( $post_count === $this_news_post ) {
											$args['extra_class'] = ' m-post-newsletter-last';
										}

										// with newsletters, the individual post can override the image size for the newsletter section the post is in.
										$override_size = esc_html( get_post_meta( $args['post_id'], '_mp_post_newsletter_image_size', true ) );
										if ( '' !== $override_size && 'default' !== $override_size ) {
											$args['image_size'] = $override_size;
										}
										get_template_part( 'template-parts/post-newsletter', $args['newsletter_type'], $args );
									endwhile;
									wp_reset_postdata();
									?>
								</div> <!-- end row -->
							<?php endif; ?>

						</div>
					</div> <!-- .o-column -->
					[outlook]
								</td>
								<td class="o-column m-newsletter-ad">
					[/outlook]
					<div class="o-column m-newsletter-ad-region">
						<div class="item-contents">
							<div class="o-row m-newsletter-ad">
								<?php
								if ( isset( $ads[1] ) && ! empty( $ads[1] ) ) {
									echo $ads[1];
								}
								?>
							</div>
						</div>
					</div>
					[outlook]
								</td>
							</tr>
						</table>
					[/outlook]
				</div> <!-- end o-columns.o-newsletter-section -->

				<div class="o-columns o-newsletter-section">
					[outlook]
						<table role="presentation" width="100%" class="o-columns o-newsletter-section">
							<tr>
								<td class="o-column o-newsletter-listing">
					[/outlook]
					<div class="o-column o-newsletter-listing">
						<div class="item-contents">
							<?php
							// opinion post section
							$section         = 'opinion';
							$opinion_query   = minnpost_newsletter_get_section_query( $section );
							$args['section'] = $section;
							?>
							<?php if ( $opinion_query->have_posts() ) : ?>
								<?php
								$post_count        = $opinion_query->post_count;
								$this_opinion_post = 0;
								?>
								<div class="o-row m-newsletter-stories m-newsletter-stories-<?php echo $section; ?> m-newsletter-stories-has-<?php echo (int) $post_count; ?>-post">
									<?php if ( '' !== minnpost_newsletter_get_section_title( $section ) ) : ?>
										<table role="presentation" width="100%" class="h2 a-section-title">
											<tr>
												<td>
													<div class="a-section-title-bg">
														<h2><?php echo minnpost_newsletter_get_section_title( $section ); ?></h2>
													</div>
												</td>
											</tr>
										</table>
									<?php endif; ?>
									<?php
									while ( $opinion_query->have_posts() ) :
										$this_opinion_post++;
										$opinion_query->the_post();
										set_query_var( 'current_post', $opinion_query->current_post );
										$args['post_id'] = $id;

										// the first post in this section is differently sized than subsequents, by default.
										if ( 1 === $this_opinion_post ) {
											$args['image_size'] = 'feature-large';
										} else {
											$args['image_size'] = 'feature-medium';
										}

										$args['extra_class'] = '';
										if ( $post_count === $this_opinion_post ) {
											$args['extra_class'] = ' m-post-newsletter-last';
										}

										// with newsletters, the individual post can override the image size for the newsletter section the post is in.
										$override_size = esc_html( get_post_meta( $args['post_id'], '_mp_post_newsletter_image_size', true ) );
										if ( '' !== $override_size && 'default' !== $override_size ) {
											$args['image_size'] = $override_size;
										}
										get_template_part( 'template-parts/post-newsletter', $args['newsletter_type'], $args );
									endwhile;
									wp_reset_postdata();
									?>
								</div> <!-- end row -->
							<?php endif; ?>

						</div>
					</div> <!-- .o-column -->
					[outlook]
								</td>
								<td class="o-column m-newsletter-ad">
					[/outlook]
					<div class="o-column m-newsletter-ad-region">
						<div class="item-contents">
							<div class="o-row m-newsletter-ad">
								<?php
								if ( isset( $ads[2] ) && ! empty( $ads[2] ) ) {
									echo $ads[2];
								}
								?>
							</div>
						</div>
					</div>
					[outlook]
								</td>
							</tr>
						</table>
					[/outlook]
				</div> <!-- end o-columns.o-newsletter-section -->

				<div class="o-columns o-newsletter-section">
					[outlook]
						<table role="presentation" width="100%" class="o-columns o-newsletter-section">
							<tr>
								<td class="o-column o-newsletter-listing">
					[/outlook]
					<div class="o-column o-newsletter-listing">
						<div class="item-contents">
							<?php
							// arts post section
							$section         = 'arts';
							$arts_query      = minnpost_newsletter_get_section_query( $section );
							$args['section'] = $section;
							?>
							<?php if ( $arts_query->have_posts() ) : ?>
								<?php
								$post_count     = $arts_query->post_count;
								$this_arts_post = 0;
								?>
								<div class="o-row m-newsletter-stories m-newsletter-stories-<?php echo $section; ?> m-newsletter-stories-has-<?php echo (int) $post_count; ?>-post">
									<?php if ( '' !== minnpost_newsletter_get_section_title( $section ) ) : ?>
										<table role="presentation" width="100%" class="h2 a-section-title">
											<tr>
												<td>
													<div class="a-section-title-bg">
														<h2><?php echo minnpost_newsletter_get_section_title( $section ); ?></h2>
													</div>
												</td>
											</tr>
										</table>
									<?php endif; ?>
									<?php
									while ( $arts_query->have_posts() ) :
										$this_arts_post++;
										$arts_query->the_post();
										set_query_var( 'current_post', $arts_query->current_post );
										$args['post_id'] = $id;

										// the first post in this section is differently sized than subsequents, by default.
										if ( 1 === $this_arts_post ) {
											$args['image_size'] = 'feature-large';
										} else {
											$args['image_size'] = 'feature-medium';
										}

										// with newsletters, the individual post can override the image size for the newsletter section the post is in.
										$override_size = esc_html( get_post_meta( $args['post_id'], '_mp_post_newsletter_image_size', true ) );
										if ( '' !== $override_size && 'default' !== $override_size ) {
											$args['image_size'] = $override_size;
										}

										$args['extra_class'] = '';
										if ( $post_count === $this_arts_post ) {
											$args['extra_class'] = ' m-post-newsletter-last';
										}

										get_template_part( 'template-parts/post-newsletter', $args['newsletter_type'], $args );
									endwhile;
									wp_reset_postdata();
									?>
								</div> <!-- end row -->
							<?php endif; ?>

						</div>
					</div> <!-- .o-column -->
					[outlook]
								</td>
								<td class="o-column m-newsletter-ad">
					[/outlook]
					<div class="o-column m-newsletter-ad-region">
						<div class="item-contents">
							<div class="o-row m-newsletter-ad">
								<?php
								if ( isset( $ads[3] ) && ! empty( $ads[3] ) ) {
									echo $ads[3];
								}
								?>
							</div>
						</div>
					</div>
					[outlook]
								</td>
							</tr>
						</table>
					[/outlook]
				</div> <!-- end o-columns.o-newsletter-section -->

				<div class="o-columns o-newsletter-section">
					[outlook]
						<table role="presentation" width="100%" class="o-columns o-newsletter-section">
							<tr>
								<td class="o-column o-newsletter-listing">
					[/outlook]
					<div class="o-column o-newsletter-listing">
						<div class="item-contents">
							<?php
							// editors post section
							$section         = 'editors';
							$editors_query   = minnpost_newsletter_get_section_query( $section );
							$args['section'] = $section;
							?>
							<?php if ( $editors_query->have_posts() ) : ?>
								<?php
								$post_count        = $editors_query->post_count;
								$this_editors_post = 0;
								?>
								<div class="o-row m-newsletter-stories m-newsletter-stories-<?php echo $section; ?> m-newsletter-stories-has-<?php echo (int) $post_count; ?>-post">
									<?php if ( '' !== minnpost_newsletter_get_section_title( $section ) ) : ?>
										<table role="presentation" width="100%" class="h2 a-section-title">
											<tr>
												<td>
													<div class="a-section-title-bg">
														<h2><?php echo minnpost_newsletter_get_section_title( $section ); ?></h2>
													</div>
												</td>
											</tr>
										</table>
									<?php endif; ?>
									<?php
									while ( $editors_query->have_posts() ) :
										$this_editors_post++;
										$editors_query->the_post();
										set_query_var( 'current_post', $editors_query->current_post );
										$args['post_id'] = $id;

										// the first post in this section is differently sized than subsequents, by default.
										if ( 1 === $this_editors_post ) {
											$args['image_size'] = 'feature-large';
										} else {
											$args['image_size'] = 'feature-medium';
										}

										$args['extra_class'] = '';
										if ( $post_count === $this_editors_post ) {
											$args['extra_class'] = ' m-post-newsletter-last';
										}

										// with newsletters, the individual post can override the image size for the newsletter section the post is in.
										$override_size = esc_html( get_post_meta( $args['post_id'], '_mp_post_newsletter_image_size', true ) );
										if ( '' !== $override_size && 'default' !== $override_size ) {
											$args['image_size'] = $override_size;
										}
										get_template_part( 'template-parts/post-newsletter', $args['newsletter_type'], $args );
									endwhile;
									wp_reset_postdata();
									?>
								</div> <!-- end row -->
							<?php endif; ?>

						</div>
					</div> <!-- .o-column -->
					[outlook]
								</td>
								<td class="o-column m-newsletter-ad">
					[/outlook]
					<div class="o-column m-newsletter-ad-region">
						<div class="item-contents">
							<div class="o-row m-newsletter-ad">
								<?php
								if ( isset( $ads[2] ) && ! empty( $ads[2] ) ) {
									echo $ads[2];
								}
								?>
							</div>
						</div>
					</div>
					[outlook]
								</td>
							</tr>
						</table>
					[/outlook]
				</div> <!-- end o-columns.o-newsletter-section -->

				<?php do_action( 'wp_message_inserter', 'email_before_bios', 'email' ); ?>

				<?php do_action( 'wp_message_inserter', 'email_bottom', 'email' ); ?>

				<div class="o-columns o-footer">
					[outlook]
						<table role="presentation" width="100%" class="o-columns o-footer">
							<tr>
								<td class="o-column o-footer">
					[/outlook]
					<div class="o-column o-footer">
						<div class="item-contents">
							<div align="center">
								<table id="footer-network" class="m-secondary-navigation">
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
								</table><!-- #footer-network -->
							</div>
							<?php
							$footer_message = get_option( 'site_footer_message', '' );
							if ( '' !== $footer_message ) :
								?>
								<p class="a-footer-message"><?php echo $footer_message; ?></p>
							<?php endif; ?>
						</div> <!-- item-contents -->
					</div>
					[outlook]
								</td>
							</tr>
						</table>
					[/outlook]
				</div> <!-- end o-footer -->

			</div> <!-- end o-wrapper -->
			[outlook]
						</td>
					</tr>
				</table>
			[/outlook]
		</td>
	</tr>
</table>
