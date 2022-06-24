<?php
/**
 * Template part for displaying posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<li id="post-<?php the_ID(); ?>">
<?php
if ( ! isset( $show_image ) || true === $show_image ) {
	minnpost_post_image(
		'feature-medium',
		array(
			'location' => 'related',
		),
		get_the_ID()
	);
}
?>
	
	<header class="m-entry-header">
		<h4 class="a-entry-title"><a href="<?php echo get_permalink( get_the_ID() ); ?>"><?php echo get_the_title( get_the_ID() ); ?></a></h4>
	</header>
</li>
