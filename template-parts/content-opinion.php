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
	<?php if ( '' === minnpost_get_replace_category_text() ) : ?>
		<?php minnpost_category_breadcrumb(); ?>
	<?php else : ?>
		<?php minnpost_replace_category_text(); ?>
	<?php endif; ?>
	<header class="m-entry-header">
		<h3 class="h4 a-entry-title"><a href="<?php echo get_permalink( $post->id ); ?>"><?php echo get_the_title( $post->id ); ?></a></h3>
		<?php if ( 'post' === get_post_type( $post->id ) ) : ?>
			<?php if ( '' !== minnpost_get_posted_by() ) : ?>
				<div class="m-entry-byline">
					<?php minnpost_posted_by( $post->id ); ?>
				</div>
			<?php endif; ?>
			<div class="m-entry-meta">
				<?php if ( '' !== minnpost_get_posted_on() ) : ?>
					<?php minnpost_posted_on(); ?>
				<?php endif; ?>
			</div><!-- .m-entry-meta -->
		<?php endif; ?>
	</header>
</article>
