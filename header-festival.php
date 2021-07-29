<?php
/**
 * The header for our MinnPost Festival theme
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
		<?php $festival_logo_info = minnpost_largo_get_festival_logo_info( 'festival' ); ?>
		<div class="o-wrapper o-wrapper-site-navigation">
			<?php get_template_part( 'template-parts/logo', 'festival', $festival_logo_info ); ?>
			<nav id="navigation-primary" class="m-main-navigation m-main-navigation-festival">
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
		<?php if ( false === $festival_logo_info['is_current_url'] && ! is_singular( array( 'tribe_events', 'tribe_ext_speaker' ) ) ) : ?>
			<div class="o-wrapper o-wrapper-festival-page-title">
				<?php the_title( '<h1 class="a-page-title">', '</h1>' ); ?>
			</div>
		<?php endif; ?>
	</header><!-- #masthead -->

	<?php do_action( 'wp_message_inserter', 'header' ); ?>

	<div id="content" class="o-wrapper o-wrapper-content o-wrapper-content-festival<?php echo ( false !== get_query_var( 'grid', false ) ) ? ' o-wrapper-grid-overlay' : ''; ?>">
