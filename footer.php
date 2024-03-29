<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MinnPost Largo
 */

?>

	</div>

	<footer id="site-footer" class="o-footer">

		<div class="o-wrapper o-wrapper-site-footer<?php echo ( false !== get_query_var( 'grid', false ) ) ? ' o-wrapper-grid-overlay' : ''; ?>">

			<aside class="o-footer-hat">
				<?php dynamic_sidebar( 'sidebar-3' ); ?>
				<?php do_action( 'minnpost_membership_site_footer', true ); ?>
			</aside>

			<aside class="o-footer-links">
				<nav id="footer-primary" class="m-secondary-navigation">
					<?php
					if ( class_exists( 'Minnpost_Walker_Nav_Menu' ) ) :
						wp_nav_menu(
							array(
								'theme_location' => 'footer_primary',
								'menu_id'        => 'footer-primary-links',
								'depth'          => 1,
								'container'      => false,
								'walker'         => new Minnpost_Walker_Nav_Menu(),
							)
						);
					endif;
					?>
				</nav><!-- #footer-primary -->

				<nav id="footer-network" class="m-secondary-navigation">
					<?php
					if ( class_exists( 'Minnpost_Walker_Nav_Menu' ) ) :
						wp_nav_menu(
							array(
								'theme_location' => 'minnpost_network',
								'menu_id'        => 'minnpost-network',
								'depth'          => 1,
								'container'      => false,
								'walker'         => new Minnpost_Walker_Nav_Menu(),
							)
						);
					endif;
					?>
				</nav><!-- #footer-network -->

				<?php
				$footer_message = get_option( 'site_footer_message', '' );
				if ( '' !== $footer_message ) :
					?>
					<p class="a-footer-message"><?php echo $footer_message; ?></p>
				<?php endif; ?>

			</aside>

			<?php if ( function_exists( 'vip_powered_wpcom' ) ) : ?>
				<?php echo vip_powered_wpcom( 1 ); ?>
			<?php endif; ?>

		</div>
	</footer>

<?php wp_footer(); ?>

</body>
</html>
<?php do_action( 'wp_message_inserter', 'popup' ); ?>
