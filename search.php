<?php
/**
 * The template for displaying search results pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package MinnPost Largo
 */

get_header(); ?>

	<div id="primary" class="m-layout-primary o-search-result">
		<main id="main" class="site-main" role="main">

		<?php if ( have_posts() ) : ?>

			<header class="m-search-result-header">
				<h1 class="a-search-result-title"><?php printf( esc_html__( 'Search Results', 'minnpost-largo' ) ); ?></h1>
			</header><!-- .m-search-result-header -->

			<aside class="m-search-result-info">
				<?php

				global $wp_query;

				$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
				$from = ( $wp_query->query_vars['posts_per_page'] * $paged ) - ( $wp_query->query_vars['posts_per_page'] - 1 );
				if ( ( $wp_query->query_vars['posts_per_page'] * $paged ) <= ( $wp_query->found_posts ) ) {
					$to = ( $wp_query->query_vars['posts_per_page'] * $paged );
				} else {
					$to = $wp_query->found_posts;
				}

				if ( $from === $to ) {
					$from_to = number_format_i18n( $from );
				} else {
					$from_to = number_format_i18n( $from ) . ' - ' . number_format_i18n( $to );
				}

				echo sprintf( 'Showing results %1$s of %2$s for <strong>%3$s</strong>',
					$from_to,
					number_format_i18n( $wp_query->found_posts ),
					get_search_query()
				);

				?>
			</aside>

			<section class="m-search-result">
				<?php
				while ( have_posts() ) : the_post();
					/**
					 * Run the loop for the search to output the results.
					 * If you want to overload this in a child theme then include a file
					 * called content-search.php and that will be used instead.
					 */
					get_template_part( 'template-parts/content', 'search' );
				endwhile;
				?>
			</section>

			<?php
			numeric_pagination();

		else :
			get_template_part( 'template-parts/content', 'none' );
		endif;
		?>

		</main><!-- #main -->

	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
