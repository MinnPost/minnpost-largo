<?php
/**
 * Template part for displaying pages
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<article id="page-<?php the_ID(); ?>" <?php post_class( 'm-page' ); ?>>

	<header class="m-entry-header<?php if ( is_singular() ) { ?> m-entry-header-singular<?php } ?>">
		<?php
		if ( is_singular() ) :
			the_title( '<h1 class="a-entry-title">', '</h1>' );
		else :
			the_title( '<h3 class="a-entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
		endif;
		?>

	</header><!-- .m-entry-header -->

	<div class="m-entry-content">
		<?php the_content(); ?>
	</div><!-- .entry-content -->

</article><!-- #page-## -->
