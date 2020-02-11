<?php
/**
 * Template part for displaying posts at the top of the homepage
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'm-post' ); ?>>

	<div class="m-post-classification">
		<?php if ( '' === minnpost_get_replace_category_text() ) : ?>
			<?php minnpost_category_breadcrumb(); ?>
		<?php else : ?>
			<?php minnpost_replace_category_text(); ?>
		<?php endif; ?>
	</div>

	<header class="m-entry-header">
		<?php the_title( '<h3 class="a-entry-title a-entry-title-largeimage"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h3>' ); ?>

		<?php if ( 'post' === get_post_type() ) : ?>

		<div class="m-entry-meta">
			<?php minnpost_posted_by(); ?> | <?php minnpost_posted_on(); ?> <?php minnpost_edit_link(); ?>
		</div>

		<?php endif; ?>

	</header><!-- .m-entry-header -->

	<?php minnpost_post_image( 'feature' ); ?>

	<div class="m-entry-excerpt">
		<?php the_excerpt(); ?>
	</div><!-- .m-entry-excerpt -->


</article><!-- #post-## -->
