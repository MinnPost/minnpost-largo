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
				</div>

			</div>
			[outlook]
						</td>
					</tr>
				</table>
			[/outlook]
		</td>
	</tr>
</table>