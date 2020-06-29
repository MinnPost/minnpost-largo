<?php
/**
 * Template part for displaying posts for a user's topic interests
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<li id="post-<?php the_ID(); ?>">
	<?php
	if ( ! isset( $show_image ) || true === $show_image ) {
		$image_size = 'feature-medium';
		minnpost_post_image(
			$image_size,
			array(
				'location' => 'interest',
			),
			$post->id
		);
	}
	?>
	<?php if ( '' === minnpost_get_replace_category_text() ) : ?>
		<?php minnpost_category_breadcrumb(); ?>
	<?php else : ?>
		<?php minnpost_replace_category_text(); ?>
	<?php endif; ?>
	<header class="m-entry-header">
		<h4 class="a-entry-title"><a href="<?php echo get_permalink( $post->id ); ?>"><?php echo get_the_title( $post->id ); ?></a></h4>
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
</li>
