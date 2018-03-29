<?php
/**
 * Template part for displaying pages
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<article id="page-<?php the_ID(); ?>" <?php post_class( 'm-page' ); ?>>

	<?php
	global $post;
	$post_slug    = $post->post_name;
	$custom_class = '';
	if ( 'columns' === $post_slug || 'news-region' === $post_slug ) {
		$custom_class = ' m-entry-content-custom';
	}
	$remove_title_from_display = get_post_meta( get_the_ID(), '_mp_remove_title_from_display', true );
	if ( ! isset( $remove_title_from_display ) || 'on' !== $remove_title_from_display ) {
	?>

	<header class="m-entry-header<?php if ( is_singular() || is_404() ) { ?> m-entry-header-singular<?php } ?>">
		<?php
		if ( is_singular() || is_404() ) :
			the_title( '<h1 class="a-entry-title">', '</h1>' );
		else :
			the_title( '<h3 class="a-entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
		endif;
		?>
	</header><!-- .m-entry-header -->	
	<?php } ?>


	<div class="m-entry-content<?php echo $custom_class; ?>">
		<?php the_content(); ?>
	</div><!-- .m-entry-content -->

</article><!-- #page-## -->
