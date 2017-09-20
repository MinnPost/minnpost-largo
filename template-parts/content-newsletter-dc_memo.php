<?php
/**
 * Template part for displaying DC newsletter content
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>
<style>
	body {
		Margin: 0; padding: 0; min-width: 100%; background-color: #ffffff;
	}
	img {
		border: 0 none; height: auto; line-height: 100%; outline: none; text-decoration: none;
	}
	a:hover {
		color: #801019 !important; text-decoration: underline !important;
	}
	a:active {
		color: #801019 !important; text-decoration: underline !important;
	}
	a:visited {
		color: #801019 !important;
	}
	h1 a:active {
		color: #1A1818;
	}
	h2 a:active {
		color: #1A1818;
	}
	h3 a:active {
		color: #1A1818;
	}
	h4 a:active {
		color: #1A1818;
	}
	h5 a:active {
		color: #1A1818;
	}
	h6 a:active {
		color: #1A1818;
	}
	h1 a:visited {
		color: #1A1818;
	}
	h2 a:visited {
		color: #1A1818;
	}
	h3 a:visited {
		color: #1A1818;
	}
	h4 a:visited {
		color: #1A1818;
	}
	h5 a:visited {
		color: #1A1818;
	}
	h6 a:visited {
		color: #1A1818;
	}
	.content .button td td a:hover {
		color: #ffffff !important; text-decoration: none !important;
	}
	.content .button td td a:visited {
		color: #ffffff !important; text-decoration: none !important;
	}
	.content .button td td a:active {
		color: #ffffff !important; text-decoration: none !important;
	}
	@media only screen and (max-width: 600px) {
		.two-column.header .date {
			text-align: left !important;
		}
		.two-column.header .date td {
			text-align: left !important;
		}
		.two-column .column {
			max-width: 90% !important; Margin-right: auto !important; Margin-left: auto !important;
		}
		.two-column .column.ad {
			max-width: 90% !important; Margin-right: auto !important; Margin-left: auto !important;
		}
		.two-column .column.more {
			max-width: 90% !important; Margin-right: auto !important; Margin-left: auto !important;
		}
		.two-column .column.date {
			max-width: 90% !important; Margin-right: auto !important; Margin-left: auto !important;
		}
		.two-column .column.logo {
			max-width: 90% !important; Margin-right: auto !important; Margin-left: auto !important;
		}
		.one-column .column {
			max-width: 90% !important; Margin-right: auto !important; Margin-left: auto !important;
		}
		.one-column .column.ad {
			max-width: 90% !important; Margin-right: auto !important; Margin-left: auto !important;
		}
		.one-column .column.more {
			max-width: 90% !important; Margin-right: auto !important; Margin-left: auto !important;
		}
		.one-column .column.date {
			max-width: 90% !important; Margin-right: auto !important; Margin-left: auto !important;
		}
		.one-column .column.logo {
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
		<table cellpadding="0" cellspacing="0" class="outer" align="center" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; Margin: 0 auto; max-width: 600px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; width: 100%">
			<tr>
				<td class="one-column header" style="border-collapse: collapse; border-bottom-width: 2px; border-bottom-color: #cccccf; border-bottom-style: solid; Margin: 0; padding: 0;">
				<!--[if (gte mso 9)|(IE)]>
					<table cellpadding="0" cellspacing="0" width="100%">
						<tr>
							<td width="100%" valign="bottom">
				<![endif]-->
					<div class="column logo" style="width: 100%;">
						<table cellpadding="0" cellspacing="0" width="100%" style="border-spacing: 0; Margin: 0; padding: 0; font-family: Helvetica, Arial, Geneva, sans-serif; color: #1A1818; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse;">
							<tr>
								<td class="inner" style="border-collapse: collapse; Margin: 0; padding: 8px 0; max-height: 68px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0; line-height: 0px;" valign="bottom">
									<table cellpadding="0" cellspacing="0" class="contents" style="border-spacing: 0; Margin: 0; padding: 0; font-family: Helvetica, Arial, Geneva, sans-serif; color: #1A1818; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; width: 100%;">
										<tr>
											<td align="center" style="border-collapse: collapse; Margin: 0; padding: 8px 0; max-height: 68px; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0; line-height: 0px;" valign="bottom">
												<img src="<?php minnpost_newsletter_logo( get_the_ID() ); ?>" alt="<?php bloginfo( 'name' ); ?>" width="520" height="50" style="border: 0 none; display: block; height: auto; line-height: 100%; Margin: 0; max-height: 50px; max-width: 520px; outline: none; padding: 0; text-decoration: none; vertical-align: bottom; width: 100%" />
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
				</td> <!-- end .one-column.header -->
			</tr> <!-- end row -->

			<?php
			$body = get_the_content();
			if ( '' !== $body ) :
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
			<?php endif; ?>

			<tr>
				<td class="one-column footer" style="border-collapse: collapse; Margin: 0; padding: 0">
					<table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0">
						<tr>
							<td class="inner contents" style="border-collapse: collapse; Margin: 0; padding: 0; width: 100%">
								<?php dynamic_sidebar( 'sidebar-3' ); ?>
							</td>
						</tr>
					</table>
				</td> <!-- end .one-column.footer -->
			</tr> <!-- end row -->

	</div>
</center>
