<?php
/**
 * Template part for displaying posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'm-post' ); ?>>

	<div class="m-post-classification">
		<?php minnpost_category_breadcrumb(); ?>
	</div>
	<?php minnpost_category_sponsorship(); ?>

	<?php
	if ( ! is_singular() ) {
		minnpost_post_image();
	}
	?>

	<header class="m-entry-header<?php if ( is_singular() ) { ?> m-entry-header-singular<?php } ?><?php if ( is_single() ) { ?> m-entry-header-single<?php } ?>">
		<?php
		if ( is_single() ) :
			the_title( '<h1 class="a-entry-title">', '</h1>' );
		else :
			the_title( '<h3 class="a-entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
		endif;

		if ( 'post' === get_post_type() ) :
		?>

		<div class="m-entry-meta">
			<?php minnpost_posted_by(); ?> | <?php minnpost_posted_on(); ?> <?php minnpost_edit_link(); ?>
		</div>

		<?php endif; ?>

	</header><!-- .m-entry-header -->

	<?php
	if ( is_singular() ) {
		minnpost_post_image( 'large' );
	}
	?>

	<div class="m-entry-content">
		<?php the_content(); ?>
	</div><!-- .entry-content -->

	<?php
	$coauthors = get_coauthors( get_the_ID() );
	$author_info = '';
	foreach ( $coauthors as $coauthor ) {
		$author_id = $coauthor->ID;
		$author_info .= minnpost_get_author_figure( $author_id, 'thumbnail', true, true );
	}
	if ( '' !== $author_info ) {
	?>
	<aside class="m-author-info m-author-info-excerpt">
		<h3 class="a-about-author">About the author:</h3>
		<?php
		foreach ( $coauthors as $coauthor ) :
			$author_id = $coauthor->ID;
			minnpost_author_figure( $author_id, 'thumbnail', true, true );
		endforeach;
		?>
	</aside>
	<?php
	}
	?>

</article><!-- #post-## -->
