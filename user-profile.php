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

		$query_var = $wp_query->query_vars['users'];
		$args = array(
			'include' => array( $query_var ),
		);

		// The Query
		$user_query = new WP_User_Query( $args );

		?>

		<?php if ( ! empty( $user_query->get_results() ) ) : ?>

			<section class="m-user m-user-profile">
				<?php
				foreach ( $user_query->get_results() as $user ) :
					set_query_var( 'user', $user );
					get_template_part( 'template-parts/user', 'profile' );
				endforeach;
				?>
			</section>
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
