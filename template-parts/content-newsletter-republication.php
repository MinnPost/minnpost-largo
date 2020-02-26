<?php
/**
 * Template part for displaying republish newsletter content
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>
<style type="text/css">
	body {
		Margin: 0; padding: 0; min-width: 100%; background-color: #ffffff;
	}
	img {
		border: 0 none; height: auto; line-height: 100%; outline: none; text-decoration: none;
	}
	a:hover {
		color: #1A1818 !important; text-decoration: underline !important;
	}
	a:active {
		color: #1A1818 !important; text-decoration: underline !important;
	}
	a:visited {
		color: #1A1818 !important;
	}
	h3 a:active {
		color: #1A1818;
	}
	h5 a:active {
		color: #1A1818;
	}
	h3 a:visited {
		color: #1A1818;
	}
	h5 a:visited {
		color: #1A1818;
	}
	.content .button.read-story td td a:hover {
		color: #ffffff !important; text-decoration: none !important;
	}
	.content .button.read-story td td a:visited {
		color: #ffffff !important; text-decoration: none !important;
	}
	.content .button.read-story td td a:active {
		color: #ffffff !important; text-decoration: none !important;
	}
	@media only screen and (max-width: 600px) {
		.two-column.header .logo td {
			border-bottom: 10px solid #000 !important; Margin-bottom: 5px !important;
		}
		.two-column.header .date {
			text-align: left !important;
		}
		.two-column.header .date td {
			text-align: left !important;
		}
		.one-column .column, .two-column .column, .two-column .column.ad, .two-column .column.more, .two-column .column.date, .two-column .column.logo {
			max-width: 90% !important; Margin-right: auto !important; Margin-left: auto !important;
		}
		.content.story .ad {
			border-bottom: 2px solid #cccccf !important; padding-bottom: 18px !important; Margin-bottom: 18px !important;
		}
		div.story.story-last .story-inner {
			border-bottom: 2px solid #cccccf !important; padding-bottom: 18px !important; Margin-bottom: 18px !important;
		}
	}
</style>

<center class="wrapper" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; table-layout: fixed; width: 100%">
	<div class="webkit">
		<!--[if (gte mso 9)|(IE)]>
			<table cellpadding="0" cellspacing="0" width="600" align="center">
				<tr>
					<td>
		<![endif]-->
		<table cellpadding="0" cellspacing="0" class="outer" align="center" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; Margin: 0 auto; max-width: 600px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; width: 100%; background-color: #ffffff;">
			<tr>
				<td class="two-column header" style="border-bottom-color: #000; border-bottom-style: solid; border-bottom-width: 10px; border-collapse: collapse; font-size: 0; Margin: 0; padding: 0; text-align: center" align="center">
					<!--[if (gte mso 9)|(IE)]>
						<table cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td width="50%" valign="bottom">
					<![endif]-->
					<div class="column logo" style="display: inline-block; Margin-right: 0; max-width: 390px; vertical-align: bottom; width: 100%">
						<table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0">
							<tr>
								<td class="inner" style="border-collapse: collapse; font-size: 0; line-height: 0px; Margin: 0; max-height: 90px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; vertical-align: bottom" valign="bottom">
									<table cellpadding="0" cellspacing="0" class="contents" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; font-size: 16px; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; text-align: left; width: 100%">
									<tr>
										<td style="border-collapse: collapse; font-size: 0; line-height: 0px; Margin: 0; max-height: 90px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; vertical-align: bottom" valign="bottom">
											<a href="<?php echo esc_url( get_permalink() ); ?>" style="color: #1A1818; text-decoration: none">
												<img src="<?php minnpost_newsletter_logo( get_the_ID() ); ?>" alt="<?php bloginfo( 'name' ); ?>" width="390" height="90" align="left" style="border: 0 none; display: block; height: auto; line-height: 100%; Margin: 0; max-height: 90px; max-width: 390px; outline: none; padding: 0; text-decoration: none; vertical-align: bottom; width: 100%" />
											</a>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</div>
				<!--[if (gte mso 9)|(IE)]>
					</td><td width="50%" valign="bottom">
				<![endif]-->
				<div class="column date" style="display: inline-block; Margin-right: 0; max-width: 210px; vertical-align: bottom; width: 100%">
					<table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0">
						<tr>
							<td class="inner" style="border-collapse: collapse; font-family: Helvetica, Arial, Geneva, sans-serif; font-size: 16px; font-weight: bold; line-height: 100%; Margin: 0; max-height: 90px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 10px 0 5px; text-align: right; vertical-align: bottom; width: 100%" align="right" valign="bottom">
								<table cellpadding="0" cellspacing="0" class="contents" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; font-size: 16px; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; text-align: left; width: 100%">
									<tr>
										<td class="text" style="border-collapse: collapse; font-family: Helvetica, Arial, Geneva, sans-serif; font-size: 16px; font-weight: bold; line-height: 100%; Margin: 0; max-height: 90px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 10px 0 5px; text-align: right; vertical-align: bottom; width: 100%" align="right" valign="bottom">
											<?php minnpost_posted_on(); ?>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</div>
				<!--[if (gte mso 9)|(IE)]>
							</td>
						</tr>
					</table>
				<![endif]-->
			</td> <!-- end .two-column.header -->
		</tr> <!-- end row -->

		<?php
		// default value for the republication newsletter summary
		$content = 'This is the MinnPost republication newsletter. You can republish stories from it.';
		// allow it to be overridden by the post content field
		if ( '' !== get_the_content() ) {
			$content = get_the_content();
		}
		$body = apply_filters( 'the_content', $content );

		if ( '' !== $body ) {
			?>
		<tr>
			<td class="one-column content promo" style="border-collapse: collapse; margin: 0; padding: 0">
			<!--[if (gte mso 9)|(IE)]>
				<table cellpadding="0" cellspacing="0" width="100%">
					<tr>
						<td width="100%" valign="bottom">
			<![endif]-->
				<div class="column promo" style="margin-bottom: 0; margin-top: 18px">
					<?php echo $body; ?>
				</div>
				<!--[if (gte mso 9)|(IE)]>
						</td>
					</tr>
				</table>
				<![endif]-->
			</td> <!-- end .one-column.promo -->
		</tr> <!-- end row -->
			<?php
		}
		$republishable_posts_limit = -1;
		$republishable_stories     = get_post_meta( get_the_ID(), '_mp_newsletter_republishable_posts', true );
		$republishable_query_args  = array(
			'post__in'       => $republishable_stories,
			'posts_per_page' => $republishable_posts_limit,
			'orderby'        => 'post__in',
			'post_status'    => 'any',
		);
		$republishable_query       = new WP_Query( $republishable_query_args );

		// the total does not stop at posts_per_page
		set_query_var( 'found_posts', $republishable_query->found_posts );
		$newsletter_type = get_post_meta( get_the_ID(), '_mp_newsletter_type', true );

		if ( $republishable_query->have_posts() ) {
			set_query_var( 'show_republishable_departments', get_post_meta( get_the_ID(), '_mp_newsletter_show_department_for_republish_stories', true ) );

			while ( $republishable_query->have_posts() ) {
				$republishable_query->the_post();
				set_query_var( 'current_post', $republishable_query->current_post );
				set_query_var( 'is_republishable_story', true );
				get_template_part( 'template-parts/post-newsletter', $newsletter_type );
			}
			wp_reset_postdata();
		}
		?>
		<tr>
			<td class="one-column footer" style="border-collapse: collapse; Margin: 0; padding: 0">
				<table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0">
					<tr>
						<td class="inner contents" style="border-collapse: collapse; Margin: 0; padding: 0; width: 100%">
							<?php dynamic_sidebar( 'sidebar-3' ); ?>
							<?php
							$footer_message = get_option( 'site_footer_message', '' );
							if ( '' !== $footer_message ) :
								?>
								<p class="address" style="font-size: 12px; Margin: 10px 0 15px; padding: 0; text-align: center;" align="center"><?php echo $footer_message; ?></p>
							<?php endif; ?>
						</td>
					</tr>
				</table>
			</td> <!-- end .one-column.footer -->
		</tr> <!-- end row -->

	</div>
</center>
