<?php
/**
 * Template part for displaying festival event posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

$post_class = 'm-post m-festival-post m-festival-post-event';
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( $post_class ); ?>>
	<div class="m-entry-content">
		<header class="m-entry-header">
			<?php if ( true === $args['use_permalink'] ) : ?>
				<?php the_title( '<h3 class="a-entry-title a-entry-title-excerpt"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h3>' ); ?>
			<?php else : ?>
				<?php the_title( '<h3 class="a-entry-title a-entry-title-excerpt">', '</h3>' ); ?>
			<?php endif; ?>
		</header>
		<div class="m-entry-excerpt">
			<?php the_excerpt(); ?>
		</div>
	</div>
</article>
