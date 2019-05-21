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

	<header id="masthead" class="o-header">
		<div class="o-wrapper o-wrapper-site-header">
			<div class="a-site-branding">
				<a class="a-logo a-logo-svg" rel="home" href="<?php echo esc_url( home_url( '/' ) ); ?>">
					<picture>
						<source type="image/svg+xml" srcset="<?php echo get_stylesheet_directory_uri(); ?>/assets/img/minnpost-logo.svg">
						<img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/img/logo.png" alt="<?php bloginfo( 'name' ); ?>">
					</picture>
				</a>
			</div><!-- .a-site-branding -->
		</div>
		<div class="o-wrapper o-wrapper-site-navigation o-wrapper-support-navigation">
			<?php
				$user_account_access_menu = get_minnpost_account_access_menu();
			?>
			<?php if ( ! empty( $user_account_access_menu ) ) : ?>
				<div id="navigation-featured-account-access">
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
		$full_class = ' o-wrapper-content-full';
	}
	?>

	<?php do_action( 'wp_message_inserter', 'header' ); ?>

	<div id="content" class="o-wrapper o-wrapper-content<?php echo $full_class; ?>">
