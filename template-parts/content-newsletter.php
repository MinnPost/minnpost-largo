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
		<table cellpadding="0" cellspacing="0" class="outer" align="center">
			<tr>
				<td class="o-wrapper o-header" align="center">
					<div class="o-column a-logo">
						<table cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td valign="bottom">
									<a href="<?php echo esc_url( get_permalink() ); ?>">
										<img src="<?php minnpost_newsletter_logo( get_the_ID() ); ?>" alt="<?php bloginfo( 'name' ); ?>">
									</a>
								</td>
							</tr>
						</table>
					</div>
					<?php do_action( 'minnpost_membership_email_header' ); ?>
				</td>
			</tr> <!-- end row -->

			<tr>
				<td class="wrapper">
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
				</td>
			</tr>

			<?php do_action( 'wp_message_inserter', 'email_header', 'email' ); ?>

			<?php
			$do_not_show_automatic_teaser_items = get_post_meta( get_the_ID(), '_mp_newsletter_do_not_show_automatic_teaser_items', true );
			$do_not_show_teaser_text            = get_post_meta( get_the_ID(), '_mp_newsletter_do_not_show_teaser_text', true );
			if ( 'on' !== $do_not_show_automatic_teaser_items || 'on' !== $do_not_show_teaser_text ) :
				?>
			<tr>
				<td class="o-wrapper m-teaser" align="center">
						<div class="m-teaser">
							<table cellpadding="0" cellspacing="0" width="100%">
								<tr>
									<td valign="bottom">
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
								</td>
							</tr>
						</table>
					</div>
				</td>
			</tr>
				<?php
			endif;
			?>
			<?php do_action( 'wp_message_inserter', 'above_email_articles', 'email' ); ?>

			<?php
			$body = apply_filters( 'the_content', get_the_content() );
			if ( '' !== $body ) :
				?>
			<tr>
				<td class="o-wrapper o-body" align="center">
					<div class="m-body">
						<table cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td valign="bottom">
									<?php echo $body; ?>
								</td>
							</tr>
						</table>
					</div>
				</td>
			</tr> <!-- end row -->
				<?php
			endif;
			?>

			<?php $top_query = minnpost_newsletter_get_section_query( 'top' ); ?>
			<?php if ( $top_query->have_posts() ) : ?>
				<?php $post_count = $top_query->post_count; ?>
				<tr>
					<td class="m-newsletter-section m-newsletter-section-top m-newsletter-section-has-<?php echo (int) $post_count; ?>-post" align="center">
						<?php if ( '' !== minnpost_newsletter_get_section_title( 'top' ) ) : ?>
							<table cellpadding="0" cellspacing="0" width="100%" class="h2 a-section-title">
								<tr>
									<td>
										<h2><?php echo minnpost_newsletter_get_section_title( 'top' ); ?></h2>
									</td>
								</tr>
							</table>
						<?php endif; ?>
						<?php
						while ( $top_query->have_posts() ) :
							$top_query->the_post();
							set_query_var( 'current_post', $top_query->current_post );
							get_template_part( 'template-parts/post-newsletter', $args['newsletter_type'] );
						endwhile;
						wp_reset_postdata();
						?>
					</td>
				</tr>
			<?php endif; ?>

			<?php
			$top_offset  = 2;
			$top_stories = minnpost_largo_get_newsletter_stories( get_the_ID(), 'top' );

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
			foreach ( $ad_divs as $key => $value ) {
				$style = $value->getAttribute( 'style' );
				$ads[] = '<p style="Margin: 0 0 10px; padding: 0">' . minnpost_dom_innerhtml( $value ) . '</p>';
			}

			set_query_var( 'newsletter_ads', $ads );

			
			?>

			<?php do_action( 'wp_message_inserter', 'email_before_bios', 'email' ); ?>

			<?php do_action( 'wp_message_inserter', 'email_bottom', 'email' ); ?>

			<tr>
				<td class="wrapper one-column footer">
					<table cellpadding="0" cellspacing="0" width="100%">
						<tr>
							<td class="inner contents" style="width: 100%">
								<?php dynamic_sidebar( 'sidebar-3' ); ?>
								<?php
								$footer_message = get_option( 'site_footer_message', '' );
								if ( '' !== $footer_message ) :
									?>
									<p class="a-address" align="center"><?php echo $footer_message; ?></p>
								<?php endif; ?>
							</td>
						</tr>
					</table>
				</td> <!-- end .one-column.footer -->
			</tr> <!-- end row -->
		</table>
	</div>
</center>
