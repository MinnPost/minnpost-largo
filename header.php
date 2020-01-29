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

	<div class="m-ad-region m-ad-region-leaderboard">
		<div class="o-wrapper<?php echo ( false !== get_query_var( 'grid', false ) ) ? ' o-wrapper-grid-overlay' : ''; ?>">
			<?php do_action( 'acm_tag', 'leaderboard' ); ?>
		</div>
	</div>

	<header id="masthead" class="o-header">
		<div class="o-wrapper o-wrapper-site-header<?php echo ( false !== get_query_var( 'grid', false ) ) ? ' o-wrapper-grid-overlay' : ''; ?>">
			<?php get_template_part( 'template-parts/logo', 'top' ); ?>
			<?php do_action( 'minnpost_membership_site_header', true ); ?>
		</div>
		<div class="o-wrapper o-wrapper-site-navigation<?php echo ( false !== get_query_var( 'grid', false ) ) ? ' o-wrapper-grid-overlay' : ''; ?>">
			<nav id="navigation-primary" class="m-main-navigation">
				<button class="menu-toggle" aria-controls="primary-links" aria-expanded="false">
					<span><?php esc_html_e( 'Menu', 'minnpost-largo' ); ?></span>
				</button>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'primary_links',
						'menu_id'        => 'primary-links',
						'depth'          => 1,
						'container'      => false,
						'walker'         => new Minnpost_Walker_Nav_Menu,
					)
				);
				?>
			</nav><!-- #site-navigation -->
			<?php
				$featured_menu = wp_nav_menu(
					array(
						'theme_location' => 'primary_links',
						'menu_id'        => 'featured-links',
						'depth'          => 2,
						'container'      => false,
						'walker'         => new Minnpost_Walker_Nav_Menu,
						'item_classes'   => 'values',
						'sub_menu'       => true,
						'echo'           => false,
						'fallback_cb'    => '__return_false',
					)
				);

				$user_account_access_menu = get_minnpost_account_access_menu();
				?>
			<?php if ( ! empty( $featured_menu ) || ! empty( $user_account_access_menu ) ) : ?>
				<div id="navigation-featured-account-access">
					<?php if ( ! empty( $featured_menu ) ) : ?>
					<nav id="navigation-featured" class="m-featured-navigation">
						<span class="a-nav-label">Featured:</span>
						<?php echo $featured_menu; ?>
					</nav><!-- #navigation-featured -->
					<?php endif; ?>
					<?php if ( ! empty( $user_account_access_menu ) ) : ?>
					<nav id="navigation-user-account-access" class="m-secondary-navigation">
						<?php echo $user_account_access_menu; ?>
					</nav><!-- #navigation-user-account-access -->
					<?php endif; ?>
				</div>
			<?php endif; ?>

		</div>
	</header><!-- #masthead -->

	<?php
	$full_class = '';
	if ( is_singular() ) {
		$remove_sidebar = get_post_meta( get_the_ID(), '_mp_remove_right_sidebar', true );
		if ( isset( $remove_sidebar ) && 'on' === $remove_sidebar ) {
			$full_class = ' o-wrapper-content-full';
		}
	}
	?>

	<?php do_action( 'wp_message_inserter', 'header' ); ?>

	<div id="content" class="o-wrapper o-wrapper-content<?php echo $full_class; ?><?php echo ( false !== get_query_var( 'grid', false ) ) ? ' o-wrapper-grid-overlay' : ''; ?>">
