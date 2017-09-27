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

		<div class="o-wrapper o-wrapper-site-footer">

			<aside class="o-footer-hat">
				<section class="m-widget m-widget-text m-widget-custom-html m-footer-sponsors">
					<h3 class="a-widget-title">Thanks to our major sponsors</h3>
				</section>
				<?php dynamic_sidebar( 'sidebar-3' ); ?>
			</aside>

			<!--
			<aside class="o-footer-hat o-footer-hat-two">
				<section class="m-footer-box m-footer-sponsors">
					<h2 class="a-footer-title">Thanks to our major sponsors</h2>
				</section>
				
				<section class="m-footer-box m-footer-donors">
					<h2 class="a-footer-title">Thanks to our generous donors</h2>
					<p>MinnPost is a nonprofit, nonpartisan enterprise whose mission is to provide high-quality journalism for news-intense people who care about Minnesota.</p>
					<p>Donations and pledges totaling $25,000 or more have been made by each of the families and foundations listed. For a list of all donors by category, see our most recent Year End Report.</p>
					<ul class="donors">
						<li>David &amp; Debbie Andreas</li><li>Blandin Foundation</li><li>Carla Blumberg</li><li>Otto Bremer Trust</li><li>Burdick Family Fund of The Minneapolis Foundation</li><li>Bush Foundation</li><li>Central Corridor Funders Collaborative</li><li>Bill &amp; Sharon Clapp</li><li>Sage &amp; John Cowles</li><li>Jay &amp; Page Cowles</li><li>David &amp; Vicki Cox</li><li>Toby &amp; Mae Dayton</li><li>Jack &amp; Claire Dempsey</li><li>Ethics and Excellence in Journalism Foundation</li><li>Jill &amp; Larry Field</li><li>Great River Energy</li><li>Sam Heins &amp; Stacey Mills</li><li>The Joyce Foundation</li><li>Tom &amp; Marlene Kayser</li><li>Kim &amp; Garry Kieves</li><li>John S. and James L. Knight Foundation</li><li>Joel &amp; Laurie Kramer</li><li>Lee Lynch &amp; Terry Saario</li><li>Martin and Brown Foundation</li><li>Bill and Amy McKinney</li><li>The McKnight Foundation</li><li>The Minneapolis Foundation</li><li>Northwest Area Foundation</li><li>Jeremy Edes Pierotti &amp; Kathryn Klibanoff</li><li>Susan &amp; David Plimpton</li><li>Pohlad Family Foundation</li><li>Jeff Ross</li><li>The Saint Paul Foundation</li><li>John &amp; Linda Satorius</li><li>Rebecca &amp; Mark Shavlik</li>
					</ul>
				</section>
			</aside>
			-->

			<aside class="o-footer-links">
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

			</aside>

		</div>
	</footer>


<?php wp_footer(); ?>

</body>
</html>
