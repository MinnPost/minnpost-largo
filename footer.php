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

	<footer id="site-footer" class="o-footer" role="contentinfo">

		<nav id="footer-primary" class="m-secondary-navigation" role="navigation">
			<?php wp_nav_menu(
				array(
					'theme_location' => 'footer_primary',
					'menu_id' => 'footer-primary',
					'depth' => 1,
					'container' => false,
					'walker' => new Minnpost_Walker_Nav_Menu,
				)
			); ?>
		</nav><!-- #footer-primary -->

		<nav id="footer-secondary" class="m-secondary-navigation" role="navigation">
			<?php wp_nav_menu(
				array(
					'theme_location' => 'footer_secondary',
					'menu_id' => 'footer-secondary',
					'depth' => 1,
					'container' => false,
					'walker' => new Minnpost_Walker_Nav_Menu,
				)
			); ?>
		</nav><!-- #footer-secondary -->
	
		<div class="a-company-info vcard">
			<p><span class="fn">MinnPost</span> | <span class="adr"><span class="street-address">900 6th Avenue SE</span> | <span class="locality">Minneapolis</span>, <span class="region">MN</span> <span class="postal-code">55414</span> | <span class="tel">612.455.6950</span></span></p>
		</div><!-- .a-company-info -->

	</footer>


<?php wp_footer(); ?>

</body>
</html>
