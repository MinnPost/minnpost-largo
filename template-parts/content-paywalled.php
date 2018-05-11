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
		<?php minnpost_plus_icon(); ?>
	</div>

	<header class="m-entry-header<?php if ( is_singular() ) { ?> m-entry-header-singular<?php } ?><?php if ( is_single() ) { ?> m-entry-header-single<?php } ?>">
		<?php
		if ( is_single() ) :
			the_title( '<h1 class="a-entry-title">', '</h1>' );
		else :
			the_title( '<h3 class="a-entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
		endif;
		?>
	</header><!-- .m-entry-header -->

	<div class="m-entry-content">
		<?php echo apply_filters( 'the_content', $minnpost_membership->front_end->get_option_based_on_user_status( $minnpost_membership->option_prefix . 'post_access_blocked_message', $user_state ) ); ?>
	</div><!-- .m-entry-content -->

</article><!-- #post-## -->
