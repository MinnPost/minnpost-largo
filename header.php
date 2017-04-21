<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MinnPost Largo
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

	<div class="m-ad-region m-ad-region-leaderboard">
		<div class="g g-12up gi12">
			<?php do_action( 'acm_tag', 'Top' ); ?>
			<?php do_action( 'acm_tag', 'TopRight' ); ?>
		</div>
	</div>

	<header id="masthead" class="g g-12up gi-12 o-header" role="banner">
		<div class="m-ad-region m-ad-region-topleft">
			<?php do_action( 'acm_tag', 'TopLeft' ); ?>
		</div>
		<div class="gi-12">
			<div class="site-branding">
				<a class="logo" rel="home" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo( 'name' ); ?></a>
			</div><!-- .site-branding -->

			<nav id="navigation-secondary" class="secondary-navigation" role="navigation">
				<?php wp_nav_menu(
					array(
						'theme_location' => 'minnpost_network',
						'menu_id' => 'minnpost-network',
						'depth' => 1,
						'container' => false,
						'walker' => new Minnpost_Walker_Nav_Menu,
					)
				); ?>

				<?php get_search_form(); ?>

				<?php wp_nav_menu(
					array(
						'theme_location' => 'secondary_links',
						'menu_id' => 'secondary-links',
						'depth' => 1,
						'container' => false,
						'walker' => new Minnpost_Walker_Nav_Menu,
					)
				); ?>
			</nav>
		</div>

		<div class="gi-12">
			<nav id="navigation-primary" class="main-navigation" role="navigation">
				<button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><?php esc_html_e( 'Primary Menu', 'minnpost-largo' ); ?></button>
				<?php wp_nav_menu(
					array(
						'theme_location' => 'primary_links',
						'menu_id' => 'primary-links',
						'depth' => 1,
						'container' => false,
						'walker' => new Minnpost_Walker_Nav_Menu,
					)
				); ?>
				<?php wp_nav_menu(
					array(
						'theme_location' => 'primary_links',
						'menu_id' => 'primary-links',
						'depth' => 2,
						'container' => false,
						'walker' => new Minnpost_Walker_Nav_Menu,
						'sub_menu' => true
					)
				); ?>
			</nav><!-- #site-navigation -->
		</div>


	</header><!-- #masthead -->
