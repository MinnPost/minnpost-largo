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

	<header class="m-entry-header<?php if ( is_singular() || is_404() ) { ?> m-entry-header-singular<?php } ?>">
		<?php
		if ( is_singular() || is_404() ) :
			the_title( '<h1 class="a-entry-title">', '</h1>' );
		else :
			the_title( '<h3 class="a-entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
		endif;
		edit_post_link(
			sprintf(
				/* translators: %s: Name of current post */
				esc_html__( 'Edit %s', 'minnpost-largo' ),
				the_title( '<span class="screen-reader-text">"', '"</span>', false )
			),
			'<span class="edit-link">',
			'</span>'
		);
		?>

	</header><!-- .m-entry-header -->

	<?php
	global $post;
	$post_slug = $post->post_name;
	$custom_class = '';
	if ( 'columns' === $post_slug || 'news-region' === $post_slug ) {
		$custom_class = ' m-entry-content-custom';
	}
	?>

	<div class="m-entry-content<?php echo $custom_class; ?>">
		<?php the_content(); ?>
	</div><!-- .m-entry-content -->

</article><!-- #page-## -->
