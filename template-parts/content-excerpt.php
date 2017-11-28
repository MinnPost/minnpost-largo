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

	<?php minnpost_post_image( 'thumbnail' ); ?>

	<?php if ( is_home() || ( is_archive() && isset( $featured_columns ) && '' !== $featured_columns ) ) : ?>
		<p class="a-post-category a-zone-item-category"><?php echo minnpost_get_category_name(); ?></p>
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
