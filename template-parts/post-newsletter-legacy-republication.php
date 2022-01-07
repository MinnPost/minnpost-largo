<?php
/**
 * Template part for displaying posts inside the republication newsletter template
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

if ( ( $current_post + 1 ) === (int) $found_posts ) {
	$label = ' story-last';
} elseif ( ( $current_post + 1 ) == 1 ) {
	$label = ' story-first';
} else {
	$label = '';
}

if ( ' story-first' === $label ) {
	$end_styles = ' Margin-top: 18px;';
} elseif ( ' story-last' === $label ) {
	$end_styles = ' padding-bottom: 18px;Margin-bottom: 0;';
} else {
	$end_styles = '';
}

if ( $is_republishable_story ) : ?>
<tr>
	<td class="one-column content story" style="border-collapse: collapse; font-size: 0; Margin: 0; padding: 0; text-align: center" align="center">
		<!--[if (gte mso 9)|(IE)]>
			<table cellpadding="0" cellspacing="0" width="100%">
				<tr>
					<td width="280" valign="middle">
		<![endif]-->
<?php endif; ?>
		<div class="story story-<?php echo $current_post + 1; ?><?php echo $label; ?>" style="display: inline-block; vertical-align: middle; width: 100%;">
			<div class="story-inner" style="border-bottom-color: #cccccf; border-bottom-style: solid; border-bottom-width: 2px; Margin-bottom: 18px; padding-bottom: 18px;<?php echo $end_styles; ?>">
				<?php if ( 'on' === $show_republishable_departments ) : ?>
					<h4 style="color: #555556; display: block; font-family: Helvetica, Arial, Geneva, sans-serif; font-size: 10px; font-weight: normal; line-height: 100%; Margin: 0 0 5px; text-align: left; text-transform: uppercase" align="left"><?php echo minnpost_get_category_name(); ?></h4>
				<?php endif; ?>
				<h3 style="color: #1a1818; display: block; font-family: Helvetica, Arial, Geneva, sans-serif; font-size: 22px; font-weight: bold; line-height: 1.05; Margin: 0 0 10px; padding: 0; text-align: left" align="left">
					<a href="<?php echo esc_url( get_permalink() ); ?>" style="color: #1A1818; text-decoration: none"><?php echo get_the_title(); ?></a>
				</h3>
				<table class="bodyTable" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; text-align: left" cellspacing="0" cellpadding="0">
					<tbody>
						<tr>
							<td style="border-collapse: collapse; Margin: 0; padding: 0" valign="top">
								<?php
								if ( 'on' === $show_image ) {
									minnpost_post_image(
										'newsletter-thumbnail',
										array(
											'title'  => get_the_title(),
											'style'  => 'border: 0 none; display: block; Float: left; height: auto; line-height: 100%; Margin: 0 10px 5px 0; outline: none; text-decoration: none;',
											'class'  => 'thumb',
											'align'  => 'left',
											'width'  => 80,
											'height' => 60,
										),
										'',
										false
									);
								}
								?>
								<h5 style="color: #1A1818; display: block; font-family: Helvetica, Arial, Geneva, sans-serif; font-size: 10px; font-weight: bold; line-height: 100%; Margin: 0 0 5px; text-align: left; text-transform: uppercase" align="left"><?php echo preg_replace( '/(<a\b[^><]*)>/i', '$1 style="color: #1A1818; text-decoration: none;">', preg_replace( '/\s*title\s*=\s*(["\']).*?\1/', '', minnpost_get_posted_by() ) ); ?>
								</h5>
								<div>
									<p style="font-family: Georgia, 'Times New Roman', Times, serif; font-size: 16px; line-height: 20.787px; Margin: 0 0 10px; padding: 0">
									<?php echo strip_tags( get_the_excerpt() ); ?>
									</p>
									<p style="font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 20.787px; Margin: 0; padding: 0;" class="read-or-republish">
										<?php if ( class_exists( 'Republication_Tracker_Tool' ) ) : ?>
											<a href="<?php echo esc_url( get_permalink() . '#show-republish' ); ?>" style="color:#801018;text-decoration: none;font-weight: bold;">Republish story</a>&nbsp;|&nbsp;
										<?php endif; ?><a href="<?php echo esc_url( get_permalink() ); ?>" style="color:#801018;text-decoration: none;font-weight: normal;<?php if ( ! class_exists( 'Republication_Tracker_Tool' ) ) : ?>font-weight: bold;<?php endif; ?>">Read story</a>
									</p>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
<?php if ( $is_republishable_story ) : ?>
		<!-- end .story -->
		<!--[if (gte mso 9)|(IE)]>
			</td><td width="20">&nbsp;</td><td width="50%" valign="middle">
		<![endif]-->
		<div class="column ad" style="display: inline-block; Margin-right: 0; max-width: 300px; vertical-align: middle; width: 100%">
			<table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0">
				<tr>
					<td class="inner" style="border-collapse: collapse; Margin: 0; padding: 0">
						<table cellpadding="0" cellspacing="0" class="contents" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; font-size: 16px; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; text-align: left; width: 100%">
							<tr>
								<td style="border-collapse: collapse; Margin: 0; padding: 0">
									<?php
									if ( isset( $newsletter_ads[ "$current_post" ] ) && ! empty( $newsletter_ads[ "$current_post" ] ) ) {
										echo $newsletter_ads[ "$current_post" ];
									}
									?>
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
	</td> <!-- end .two-column.content.story -->
</tr> <!-- end row -->
<?php endif; ?>
