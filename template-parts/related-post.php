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
		minnpost_post_image(
			'thumbnail',
			array(
				'location' => 'related',
			),
			$id
		);
		?>
	<p class="a-post-category a-zone-item-category"><?php echo minnpost_get_category_name( $id ); ?></p>
	<header class="m-entry-header">
		<h3 class="a-entry-title"><a href="<?php echo get_permalink( $id ); ?>"><?php echo get_the_title( $id ); ?></a></h3>
		<?php if ( 'post' === get_post_type( $id ) ) : ?>
			<div class="m-entry-meta">
				<?php minnpost_posted_by( $id ); ?> | <?php minnpost_posted_on( $id ); ?> <?php minnpost_edit_link( $id ); ?>
			</div>
			<?php endif; ?>
	</header>
</li>
