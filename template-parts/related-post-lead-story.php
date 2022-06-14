<?php
/**
 * Template part for displaying a default related post when it's with the lead story
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

$seo_title = get_post_meta( $post->ID, '_mp_seo_title', true );
if ( $seo_title !== '' ) {
	$title = $seo_title;
} else {
	$title = get_the_title( $post->ID );
}
?>

<li>
	<a href="<?php echo get_permalink( $post->ID ); ?>"><?php echo $title; ?></a>
</li>
