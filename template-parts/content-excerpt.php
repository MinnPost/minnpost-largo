<?php
/**
 * Template part for displaying posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'm-post' ); ?>>

	<?php minnpost_post_image( 'feature-large' ); ?>

	<?php if ( '' !== minnpost_get_category_name() || '' !== minnpost_get_replace_category_text() ) : ?>
		<div class="m-post-classification">
			<?php if ( '' === minnpost_get_replace_category_text() ) : ?>
				<?php minnpost_category_breadcrumb(); ?>
			<?php else : ?>
				<?php minnpost_replace_category_text(); ?>
			<?php endif; ?>
			<?php minnpost_plus_icon(); ?>
		</div>
	<?php endif; ?>

	<header class="m-entry-header">
		<?php the_title( '<h3 class="a-entry-title a-entry-title-excerpt"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h3>' ); ?>

		<?php if ( 'post' === get_post_type() ) : ?>

		<div class="m-entry-meta">
			<?php minnpost_posted_by(); ?> | <?php minnpost_posted_on(); ?> <?php minnpost_edit_link(); ?>
		</div>

		<?php endif; ?>

	</header><!-- .m-entry-header -->

	<div class="m-entry-excerpt">
		<?php the_excerpt(); ?>
	</div><!-- .m-entry-excerpt -->


</article><!-- #post-## -->
