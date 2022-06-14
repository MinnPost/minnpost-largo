<?php
/**
 * Template part for displaying a default related post inside a list
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<li>
	<?php
	if ( ! isset( $show_image ) || $show_image === true ) {
		minnpost_post_image(
			$image_size,
			array(
				'location' => 'related',
			),
			$post->id
		);
	}
	?>
	<?php if ( minnpost_get_replace_category_text() === '' ) : ?>
		<?php minnpost_category_breadcrumb(); ?>
	<?php else : ?>
		<?php minnpost_replace_category_text(); ?>
	<?php endif; ?>
	<header class="m-entry-header">
		<h4 class="a-entry-title"><a href="<?php echo get_permalink( $post->id ); ?>"><?php echo get_the_title( $post->id ); ?></a></h4>
		<?php if ( get_post_type( $post->id ) === 'post' ) : ?>
			<?php if ( minnpost_get_posted_by() !== '' ) : ?>
				<div class="m-entry-byline">
					<?php minnpost_posted_by( $post->id ); ?>
				</div>
			<?php endif; ?>
			<div class="m-entry-meta">
				<?php if ( minnpost_get_posted_on() !== '' ) : ?>
					<?php minnpost_posted_on(); ?>
				<?php endif; ?>
			</div><!-- .m-entry-meta -->
		<?php endif; ?>
	</header>
</li>
