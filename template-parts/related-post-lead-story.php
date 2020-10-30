<?php
/**
 * Template part for displaying a default related post when it's with the lead story
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<li>
	<a href="<?php echo get_permalink( $post->id ); ?>"><?php echo get_the_title( $post->id ); ?></a>
</li>
