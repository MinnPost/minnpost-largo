<?php
/**
 * The header for our festival theme
 *
 * This is the festival template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MinnPost Largo
 */

?><!DOCTYPE html>
<html class="no-js" <?php language_attributes(); ?>>
<head <?php do_action( 'add_head_attributes' ); ?>>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

	<header id="masthead" class="o-header o-header-festival">
		<div class="o-wrapper o-wrapper-site-header<?php echo ( false !== get_query_var( 'grid', false ) ) ? ' o-wrapper-grid-overlay' : ''; ?>">
			<div class="a-site-branding">
				<?php echo minnpost_largo_get_festival_logo(); ?>
			</div>
			<?php
			if ( function_exists( 'minnpost_largo_get_festival_date_range' ) ) :
				$date = minnpost_largo_get_festival_date_range( 'sessions' );
				?>
				<div class="a-festival-dates">
					<?php echo $date; ?>
				</div>
			<?php endif; ?>
		</div>
		<div class="o-wrapper o-wrapper-site-navigation">
			<nav id="navigation-primary" class="m-main-navigation">
				<button class="menu-toggle" aria-controls="primary-links" aria-expanded="false">
					<i class="fas fa-bars"></i><span><?php esc_html_e( 'Menu', 'minnpost-largo' ); ?></span>
				</button>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'festival',
						'menu_id'        => 'festival-menu',
						'container'      => false,
						'walker'         => new Minnpost_Walker_Nav_Menu,
						'item_classes'   => 'values',
						'items_wrap'     => '<ul id="%1$s" class="m-menu m-menu-%1$s">%3$s</ul>',
					)
				);
				?>
			</nav><!-- #navigation-primary -->
		</div>
	</header><!-- #masthead -->

	<?php do_action( 'wp_message_inserter', 'header' ); ?>

	<div id="content" class="o-wrapper o-wrapper-content o-wrapper-content-festival<?php echo ( false !== get_query_var( 'grid', false ) ) ? ' o-wrapper-grid-overlay' : ''; ?>">