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
		<div class="o-wrapper">
			<?php do_action( 'acm_tag', 'Top' ); ?>
			<?php do_action( 'acm_tag', 'TopRight' ); ?>
		</div>
	</div>

	<header id="masthead" class="o-header" role="banner">
		<div class="o-wrapper o-wrapper-site-header">
			<div class="m-ad-region m-ad-region-topleft">
				<?php do_action( 'acm_tag', 'TopLeft' ); ?>
			</div>
			<div class="a-site-branding">
				<a class="a-logo" rel="home" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo( 'name' ); ?></a>
			</div><!-- .a-site-branding -->

			<nav id="navigation-ext" class="m-secondary-navigation" role="navigation">
				<?php wp_nav_menu(
					array(
						'theme_location' => 'minnpost_network',
						'menu_id' => 'minnpost-network',
						'depth' => 1,
						'container' => false,
						'item_classes' => 'values',
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
			</nav><!-- #navigation-ext -->
		</div>

		<div class="o-wrapper o-wrapper-site-navigation">
			<nav id="navigation-primary" class="m-main-navigation" role="navigation">
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
			</nav><!-- #site-navigation -->

			<nav id="navigation-featured" class="m-featured-navigation" role="navigation">
				<?php if ( ! is_singular() ) : ?>
					<span class="a-nav-label">Featured:</span>
					<?php wp_nav_menu(
						array(
							'theme_location' => 'primary_links',
							'menu_id' => 'featured-links',
							'depth' => 2,
							'container' => false,
							'walker' => new Minnpost_Walker_Nav_Menu,
							'item_classes' => 'values',
							'sub_menu' => true,
						)
					); ?>
				<?php endif; ?>
			</nav><!-- #featured-navigation -->
		</div>

	</header><!-- #masthead -->

	<div id="content" class="o-wrapper o-wrapper-content">
