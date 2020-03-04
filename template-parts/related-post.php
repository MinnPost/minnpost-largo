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
	if ( isset( $show_image ) && false !== $show_image ) {
		minnpost_post_image(
			$image_size,
			array(
				'location' => 'related',
			),
			$post->id
		);
	}
	?>
	<p class="a-post-category a-zone-item-category"><?php echo minnpost_get_category_name( $post->id ); ?></p>
	<header class="m-entry-header">
		<h3 class="a-entry-title"><a href="<?php echo get_permalink( $post->id ); ?>"><?php echo get_the_title( $post->id ); ?></a></h3>
		<?php if ( 'post' === get_post_type( $post->id ) ) : ?>
			<div class="m-entry-meta">
				<?php minnpost_posted_by( $post->id ); ?> | <?php minnpost_posted_on( $post->id ); ?> <?php minnpost_edit_link( $post->id ); ?>
			</div>
			<?php endif; ?>
	</header>
</li>
