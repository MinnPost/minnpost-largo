<?php
/**
 * Template part for displaying posts for a user's topic interests
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<li id="post-<?php the_ID(); ?>" <?php post_class( 'm-interest-post' ); ?>>

	<a href="<?php echo esc_url( get_permalink() ); ?>">
		<?php $image_data = get_minnpost_post_image( 'author-thumbnail' ); ?>

		<div class="a-interest-image">
			<?php echo $image_data['markup']; ?>
		</div>

		<?php the_title( '<h3 class="a-entry-title a-entry-title-excerpt">', '</h3>' ); ?>

		<?php if ( 'post' === get_post_type() ) : ?>

		<div class="m-entry-meta">
			<?php minnpost_posted_on(); ?>
		</div>
	</a>

	<?php endif; ?>

</li><!-- #post-## -->
