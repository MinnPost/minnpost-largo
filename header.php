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
<html class="no-js" <?php language_attributes(); ?>>
<head <?php do_action( 'add_head_attributes' ); ?>>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

	<?php wp_body_open(); ?>
	<div class="m-ad-region m-ad-region-leaderboard">
		<div class="o-wrapper">
			<?php do_action( 'acm_tag', 'leaderboard' ); ?>
		</div>
	</div>

	<header id="masthead" class="o-header">
		<div class="o-wrapper o-wrapper-site-header<?php echo ( false !== get_query_var( 'grid', false ) ) ? ' o-wrapper-grid-overlay' : ''; ?>">
			<?php get_template_part( 'template-parts/logo', 'top' ); ?>
			<?php do_action( 'minnpost_membership_site_header', true ); ?>
		</div>
		<div class="o-wrapper o-wrapper-site-navigation">
			<nav id="navigation-primary" class="m-main-navigation">
				<button class="menu-toggle" aria-controls="primary-links" aria-expanded="false">
					<i class="fas fa-bars"></i><span><?php esc_html_e( 'Menu', 'minnpost-largo' ); ?></span>
				</button>
				<?php
				if ( class_exists( 'Minnpost_Walker_Nav_Menu' ) ) :
					wp_nav_menu(
						array(
							'theme_location' => 'primary_links',
							'menu_id'        => 'primary-links',
							'depth'          => 1,
							'container'      => false,
							'walker'         => new Minnpost_Walker_Nav_Menu(),
							'priority'       => '20',
							'items_wrap'     => '<ul hidden id="%1$s" class="m-menu m-menu-%1$s">%3$s</ul>',
							// 'item_classes'   => 'values',
						)
					);
					wp_nav_menu(
						array(
							'theme_location' => 'primary_actions',
							'menu_id'        => 'primary-actions',
							// 'depth'          => 1,
							'container'      => false,
							'walker'         => new Minnpost_Walker_Nav_Menu(),
							'item_classes'   => 'values',
							'items_wrap'     => '<ul id="%1$s" class="m-menu m-menu-%1$s">%3$s</ul>',
						)
					);
				endif;
				?>
			</nav><!-- #navigation-primary -->
		</div>
		<div class="o-wrapper o-wrapper-sub-navigation o-wrapper-topics-navigation">
			<a class="a-subnav-label a-topics-label" href="/topics/"><?php echo __( 'Topics', 'minnpost-largo' ); ?></a>
			<div class="m-sub-navigation m-topics">
				<nav id="navigation-topics" class="m-subnav-navigation m-topics-navigation">
					<?php
					if ( class_exists( 'Minnpost_Walker_Nav_Menu' ) ) :
						wp_nav_menu(
							array(
								'theme_location' => 'topics',
								'menu_id'        => 'topics',
								'depth'          => 1,
								'container'      => false,
								'walker'         => new Minnpost_Walker_Nav_Menu(),
								'items_wrap'     => '<ul id="%1$s" class="m-menu m-menu-sub-navigation m-menu-%1$s">%3$s</ul>',
								// 'item_classes'   => 'values',
							)
						);
					endif;
					?>
				</nav><!-- #navigation-topics -->
				<button class="nav-scroller-btn nav-scroller-btn--left" aria-label="Scroll left">
					<i class="fas fa-chevron-left"></i>
				</button>
				<button class="nav-scroller-btn nav-scroller-btn--right" aria-label="Scroll right">
					<i class="fas fa-chevron-right"></i>
				</button>
			</div>
		</div>
	</header><!-- #masthead -->

	<?php
	$full_class     = '';
	$remove_sidebar = apply_filters( 'minnpost_largo_remove_sidebar', false );
	if ( true === $remove_sidebar ) {
		$full_class = ' o-wrapper-content-full';
	}
	?>

	<?php do_action( 'wp_message_inserter', 'header' ); ?>

	<div id="content" class="o-wrapper o-wrapper-content<?php echo $full_class; ?><?php echo ( false !== get_query_var( 'grid', false ) ) ? ' o-wrapper-grid-overlay' : ''; ?>">
