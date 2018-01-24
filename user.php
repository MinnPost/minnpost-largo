<?php
/**
 * The template for displaying user account pages
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */
get_header(); ?>

	<div id="primary" class="m-layout-primary o-user">
		<main id="main" class="site-main" role="main">
			<?php
				$user_account_management_menu = wp_nav_menu(
					array(
						'theme_location' => 'user_account_management',
						'menu_id' => 'user-account-management',
						'depth' => 1,
						'container' => false,
						'walker' => new Minnpost_Walker_Nav_Menu,
						'echo' => false,
					)
				);
			?>
			<?php if ( ! empty( $user_account_management_menu ) ) : ?>
				<div id="navigation-account-management">
					<?php if ( ! empty( $user_account_management_menu ) ) : ?>
					<nav id="navigation-user-account-access" class="m-secondary-navigation" role="navigation">
						<?php echo $user_account_management_menu; ?>
					</nav><!-- #navigation-user-account-management -->
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<?php
			while ( have_posts() ) : the_post();
				get_template_part( 'template-parts/content', 'page' );
			endwhile; // End of the loop.
			?>

		</main><!-- #main -->

	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
