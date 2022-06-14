<?php
/**
 * Template part for displaying DC Memo newsletter content around the posts
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


					<div class="o-single-column m-newsletter-sponsor-small">
					[outlook]
						<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
							<tr>
								<td align="center" class="outlook-outer-padding">
									<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
										<tr>
											<td class="outlook-inner-padding">
						[/outlook]
						<div class="item-contents">
							<table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="a-newsletter-sponsor-small">
								<tr>
									<td>
										<span><?php echo __( 'Sponsored by&nbsp;', 'minnpost-largo' ); ?></span>
										<a href="https://greatriverenergy.com/">
											<img src="https://www.minnpost.com/wp-content/uploads/sites/default/files/imagecache/image_detail/images/image/great-river-energy-small.png" alt="<?php echo __( 'Great River Energy', 'minnpost-largo' ); ?>">
										</a>
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
							<?php
							// body text
							$body = apply_filters( 'the_content', get_the_content() );
							if ( $body !== '' ) :
								// add the inline sponsor before the second h2-h6 in the body
								$heading_counter = 1;
								$ad_string       = '<div class="o-single-column m-newsletter-sponsor-inline-region">
								[outlook]
								<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
									<tr>
										<td align="center" class="outlook-outer-padding">
											<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
												<tr>
													<td class="outlook-inner-padding">
								[/outlook]
								<div class="item-contents">
									<div class="m-newsletter-sponsor-inline">
										<h4 class="a-sponsored-headline">' . __( 'D.C. Memo Sponsored by Great River Energy', 'minnpost-largo' ) . '</h4><p class="a-sponsor-inline"><a href="https://greatriverenergy.com/"><img src="https://www.minnpost.com/wp-content/uploads/sites/default/files/imagecache/image_detail/images/image/great-river-energy-logo.png" alt="' . __( 'Great River Energy', 'minnpost-largo' ) . '"></a></p>
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
							</div>';
								$ad_string      .= '<h4';
								$body            = preg_replace_callback(
									'/<h[2-6](.*?)/',
									function ( $match ) use ( &$heading_counter, $ad_string ) {
										// prefix second heading that is not an h1 with ad content
										if ( $heading_counter++ === 2 ) {
											return $ad_string;
										}
										return $match[0];
									},
									$body
								);
								$body            = apply_filters( 'format_email_content', $body, true, false );
								?>
								<div class="o-row m-newsletter-body-text-email">
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

					<div class="o-single-column m-newsletter-sponsor-large">
					[outlook]
						<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-table">
							<tr>
								<td align="center" class="outlook-outer-padding">
									<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outlook-background-border">
										<tr>
											<td class="outlook-inner-padding">
						[/outlook]
						<div class="item-contents">
							<table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="a-newsletter-sponsor-large">
								<tr>
									<td>
										<table class="h4 a-sponsored-headline">
											<tr>
												<td>
													<h4 class="a-sponsored-headline"><?php echo __( 'D.C. Memo Sponsor', 'minnpost-largo' ); ?></h4>
												</td>
											</tr>
										</table>
										<p class="a-presenting-sponsor"><?php echo __( 'Presenting sponsor', 'minnpost-largo' ); ?></p>
										<p class="a-presenting-sponsor-image"><a href="http://greatriverenergy.com/"><img src="https://www.minnpost.com/wp-content/uploads/sites/default/files/imagecache/image_detail/images/image/great-river-energy-logo.png" alt="<?php echo __( 'Great River Energy', 'minnpost-largo' ); ?>"></a></p>
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
