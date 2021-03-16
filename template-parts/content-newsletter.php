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

			<?php
			$section            = 'top';
			$top_query          = minnpost_newsletter_get_section_query( $section );
			$args['image_size'] = 'feature-large';
			$args['section']    = $section;
			?>
			<?php if ( $top_query->have_posts() ) : ?>
				<?php $post_count = $top_query->post_count; ?>
				<tr>
					<td class="m-newsletter-section m-newsletter-section-top m-newsletter-section-has-<?php echo (int) $post_count; ?>-post" align="center">
						<?php if ( '' !== minnpost_newsletter_get_section_title( $section ) ) : ?>
							<table cellpadding="0" cellspacing="0" width="100%" class="h2 a-section-title">
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
							// with newsletters, the individual post can override the image size for the newsletter section the post is in.
							$override_size = esc_html( get_post_meta( $id, '_mp_post_newsletter_image_size', true ) );
							if ( '' !== $override_size && 'default' !== $override_size ) {
								$args['image_size'] = $override_size;
							}
							get_template_part( 'template-parts/post-newsletter', $args['newsletter_type'], $args );
						endwhile;
						wp_reset_postdata();
						?>
					</td>
				</tr>
			<?php endif; ?>

			<?php
			$section         = 'news';
			$news_query      = minnpost_newsletter_get_section_query( $section );
			$args['section'] = $section;
			?>
			<?php if ( $news_query->have_posts() ) : ?>
				<?php
					$post_count     = $news_query->post_count;
					$this_news_post = 0;
				?>
				<tr>
					<td class="m-newsletter-section m-newsletter-section-top m-newsletter-section-has-<?php echo (int) $post_count; ?>-post" align="center">
						<?php if ( '' !== minnpost_newsletter_get_section_title( $section ) ) : ?>
							<table cellpadding="0" cellspacing="0" width="100%" class="h2 a-section-title">
								<tr>
									<td>
										<h2><?php echo minnpost_newsletter_get_section_title( $section ); ?></h2>
									</td>
								</tr>
							</table>
						<?php endif; ?>
						<?php
						while ( $news_query->have_posts() ) :
							$this_news_post++;
							$news_query->the_post();
							set_query_var( 'current_post', $news_query->current_post );

							// the first post in this section is differently sized than subsequents, by default.
							if ( 1 === $this_news_post ) {
								$args['image_size'] = 'feature-large';
							} else {
								$args['image_size'] = 'feature-medium';
							}

							// with newsletters, the individual post can override the image size for the newsletter section the post is in.
							$override_size = esc_html( get_post_meta( $id, '_mp_post_newsletter_image_size', true ) );
							if ( '' !== $override_size && 'default' !== $override_size ) {
								$args['image_size'] = $override_size;
							}
							get_template_part( 'template-parts/post-newsletter', $args['newsletter_type'], $args );
						endwhile;
						wp_reset_postdata();
						?>
					</td>
				</tr>
			<?php endif; ?>

			<?php
			$section         = 'opinion';
			$opinion_query   = minnpost_newsletter_get_section_query( $section );
			$args['section'] = $section;
			?>
			<?php if ( $opinion_query->have_posts() ) : ?>
				<?php
					$post_count        = $opinion_query->post_count;
					$this_opinion_post = 0;
				?>
				<tr>
					<td class="m-newsletter-section m-newsletter-section-top m-newsletter-section-has-<?php echo (int) $post_count; ?>-post" align="center">
						<?php if ( '' !== minnpost_newsletter_get_section_title( $section ) ) : ?>
							<table cellpadding="0" cellspacing="0" width="100%" class="h2 a-section-title">
								<tr>
									<td>
										<h2><?php echo minnpost_newsletter_get_section_title( $section ); ?></h2>
									</td>
								</tr>
							</table>
						<?php endif; ?>
						<?php
						while ( $opinion_query->have_posts() ) :
							$this_opinion_post++;
							$opinion_query->the_post();
							set_query_var( 'current_post', $opinion_query->current_post );

							// the first post in this section is differently sized than subsequents, by default.
							if ( 1 === $this_opinion_post ) {
								$args['image_size'] = 'feature-large';
							} else {
								$args['image_size'] = 'feature-medium';
							}

							// with newsletters, the individual post can override the image size for the newsletter section the post is in.
							$override_size = esc_html( get_post_meta( $id, '_mp_post_newsletter_image_size', true ) );
							if ( '' !== $override_size && 'default' !== $override_size ) {
								$args['image_size'] = $override_size;
							}
							get_template_part( 'template-parts/post-newsletter', $args['newsletter_type'], $args );
						endwhile;
						wp_reset_postdata();
						?>
					</td>
				</tr>
			<?php endif; ?>

			<?php
			$section         = 'arts';
			$arts_query      = minnpost_newsletter_get_section_query( $section );
			$args['section'] = $section;
			?>
			<?php if ( $arts_query->have_posts() ) : ?>
				<?php
					$post_count     = $arts_query->post_count;
					$this_arts_post = 0;
				?>
				<tr>
					<td class="m-newsletter-section m-newsletter-section-top m-newsletter-section-has-<?php echo (int) $post_count; ?>-post" align="center">
						<?php if ( '' !== minnpost_newsletter_get_section_title( $section ) ) : ?>
							<table cellpadding="0" cellspacing="0" width="100%" class="h2 a-section-title">
								<tr>
									<td>
										<h2><?php echo minnpost_newsletter_get_section_title( $section ); ?></h2>
									</td>
								</tr>
							</table>
						<?php endif; ?>
						<?php
						while ( $arts_query->have_posts() ) :
							$this_arts_post++;
							$arts_query->the_post();
							set_query_var( 'current_post', $top_query->current_post );

							// the first post in this section is differently sized than subsequents, by default.
							if ( 1 === $this_arts_post ) {
								$args['image_size'] = 'feature-large';
							} else {
								$args['image_size'] = 'feature-medium';
							}

							// with newsletters, the individual post can override the image size for the newsletter section the post is in.
							$override_size = esc_html( get_post_meta( $id, '_mp_post_newsletter_image_size', true ) );
							if ( '' !== $override_size && 'default' !== $override_size ) {
								$args['image_size'] = $override_size;
							}
							get_template_part( 'template-parts/post-newsletter', $args['newsletter_type'], $args );
						endwhile;
						wp_reset_postdata();
						?>
					</td>
				</tr>
			<?php endif; ?>

			

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
