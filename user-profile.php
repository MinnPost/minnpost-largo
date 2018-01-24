<?php
/**
 * The template for displaying user profiles
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */
get_header(); ?>

	<div id="primary" class="m-layout-primary o-user-profile">
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
					<nav id="navigation-user-account-management" class="m-secondary-navigation" role="navigation">
						<?php echo $user_account_management_menu; ?>
					</nav><!-- #navigation-user-account-management -->
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<?php

			$query_var = $wp_query->query_vars['users'];
			$args = array(
				'include' => array( $query_var ),
			);

			// The Query
			$user_query = new WP_User_Query( $args );

			?>

			<?php if ( ! empty( $user_query->get_results() ) ) : ?>
				<?php
				foreach ( $user_query->get_results() as $user ) :
					set_query_var( 'user', $user );
					get_template_part( 'template-parts/user', 'profile' );
				endforeach;
				?>
			<?php
			else :
				get_template_part( 'template-parts/user', 'none' );
			endif;
			?>

		</main><!-- #main -->

	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
