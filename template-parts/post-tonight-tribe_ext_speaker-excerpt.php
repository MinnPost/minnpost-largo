<?php
/**
 * Template part for displaying MinnPost Tonight speaker posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

$post_class = 'm-post m-tonight-post m-tonight-post-speaker m-tonight-post-speaker-excerpt';
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( $post_class ); ?>>
	<div class="o-entry">
		<div class="m-archive-info m-author-info m-author-excerpt">
			<?php minnpost_speaker_figure( get_the_ID(), 'full', 'the_excerpt', false, 'the_title', true, true ); ?>
		</div>
	</div>
</article>
