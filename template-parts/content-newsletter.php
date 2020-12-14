<?php
/**
 * Template part for displaying newsletter content around the posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<center class="wrapper">
	<div class="webkit">
		<!--[if (gte mso 9)|(IE)]>
			<table cellpadding="0" cellspacing="0" width="600" align="center">
				<tr>
					<td>
		<![endif]-->
		<table cellpadding="0" cellspacing="0" class="outer" align="center">
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

		<tr>
			<td>put the menu here</td>
		</tr>

		<?php do_action( 'wp_message_inserter', 'email_header', 'email' ); ?>
		<tr><td>today is <?php echo date( 'y' ); ?></td></tr>
		<?php do_action( 'wp_message_inserter', 'above_email_articles', 'email' ); ?>

		<?php
		$body = apply_filters( 'the_content', get_the_content() );

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
		$newsletter_type = get_post_meta( get_the_ID(), '_mp_newsletter_type', true );
		$top_offset      = 2;
		$top_stories     = minnpost_largo_get_newsletter_stories( get_the_ID(), 'top' );

		$top_query_args = array(
			'post__in'       => $top_stories,
			'posts_per_page' => $top_offset,
			'orderby'        => 'post__in',
			'post_status'    => 'any',
		);
		$top_query      = new WP_Query( $top_query_args );
		// the total does not stop at posts_per_page
		set_query_var( 'found_posts', $top_query->found_posts );

		ob_start();
		dynamic_sidebar( 'sidebar-1' );
		$sidebar = ob_get_contents();
		ob_end_clean();

		$ad_dom = new DomDocument;
		libxml_use_internal_errors( true );
		$ad_dom->loadHTML( $sidebar, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_use_internal_errors( false );
		$ad_xpath = new DOMXpath( $ad_dom );
		$ad_divs  = $ad_xpath->query( "//section[contains(concat(' ', @class, ' '), ' m-widget ')]/div/p" );

		$ads = array();
		if ( 'dc_memo' !== $newsletter_type ) {
			foreach ( $ad_divs as $key => $value ) {
				$style = $value->getAttribute( 'style' );
				$ads[] = '<p style="Margin: 0 0 10px; padding: 0">' . minnpost_dom_innerhtml( $value ) . '</p>';
			}
		} else {
			foreach ( $ad_divs as $key => $value ) {
				$style = $value->getAttribute( 'style' );
				$ads[] = '<p style="Margin: 0 0 10px; padding: 0">' . minnpost_dom_innerhtml( $value ) . '</p>';
			}
		}

		set_query_var( 'newsletter_ads', $ads );

		if ( $top_query->have_posts() ) {
			set_query_var( 'show_top_departments', get_post_meta( get_the_ID(), '_mp_newsletter_show_department_for_top_stories', true ) );

			while ( $top_query->have_posts() ) {
				$top_query->the_post();
				set_query_var( 'current_post', $top_query->current_post );
				set_query_var( 'is_top_story', true );
				get_template_part( 'template-parts/post-newsletter', $newsletter_type );
			}
			wp_reset_postdata();
		}

		?>

		<?php do_action( 'wp_message_inserter', 'email_before_bios', 'email' ); ?>

		<?php do_action( 'wp_message_inserter', 'email_bottom', 'email' ); ?>

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
