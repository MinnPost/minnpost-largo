<?php
/**
 * Template part for displaying posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<?php
$image_position = esc_html( get_post_meta( get_the_ID(), '_mp_post_homepage_image_position', true ) );
$post_class     = 'm-post';
if ( $image_position === 'before' ) {
	$post_class .= ' m-post-image-first';
}
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( $post_class ); ?>>
	<div class="m-entry-content">
		<?php if ( minnpost_get_replace_category_text() === '' ) : ?>
			<?php minnpost_category_breadcrumb(); ?>
		<?php else : ?>
			<?php minnpost_replace_category_text(); ?>
		<?php endif; ?>
		<header class="m-entry-header">
			<?php the_title( '<h3 class="a-entry-title a-entry-title-excerpt"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h3>' ); ?>
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
				</div>
			<?php endif; ?>
		</header>
		<div class="m-entry-excerpt">
			<?php the_excerpt(); ?>
		</div>
	</div>
	<?php minnpost_post_image( 'feature-large' ); ?>
	<?php minnpost_related_on_listing( 'lead-story', get_the_ID() ); ?>
</article>
