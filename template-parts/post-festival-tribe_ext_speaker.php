<?php
/**
 * Template part for displaying festival speaker posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

$post_class = 'm-post m-festival-post m-festival-post-speaker';
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( $post_class ); ?>>
	<div class="m-entry-content">
		<header class="m-entry-header">
			<?php the_title( '<h1 class="a-entry-title a-entry-title-excerpt">', '</h1>' ); ?>
		</header>
		<div class="m-entry-excerpt">
			<?php the_content(); ?>
		</div>
	</div>
</article>
