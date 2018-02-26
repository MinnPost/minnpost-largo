<?php
/**
 * Template part for displaying post paywall when member does not have sufficient access
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class( array( 'm-post', 'm-post-paywalled' ) ); ?>>

	<div class="m-post-classification">
		<?php minnpost_category_breadcrumb(); ?>
		<div class="a-minnpost-plus">
			<img src="<?php echo get_theme_file_uri() . '/assets/img/MinnPostPlusLogo.png'; ?>" alt="MinnPostPlus">
		</div>
	</div>
	<?php minnpost_category_sponsorship(); ?>

	<header class="m-entry-header<?php if ( is_singular() ) { ?> m-entry-header-singular<?php } ?><?php if ( is_single() ) { ?> m-entry-header-single<?php } ?>">
		<?php
		if ( is_single() ) :
			the_title( '<h1 class="a-entry-title">', '</h1>' );
		else :
			the_title( '<h3 class="a-entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
		endif;

		if ( 'post' === get_post_type() ) :
		?>

		<?php endif; ?>

	</header><!-- .m-entry-header -->

	<div class="m-entry-content">
		This is the part to tell users they don't have access.
	</div><!-- .m-entry-content -->

</article><!-- #post-## -->
