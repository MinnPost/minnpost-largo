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

	<?php if ( '' !== minnpost_get_category_name() || '' !== minnpost_get_replace_category_text() ) : ?>
		<div class="m-post-classification">
			<?php if ( '' === minnpost_get_replace_category_text() ) : ?>
				<?php minnpost_category_breadcrumb(); ?>
			<?php else : ?>
				<?php minnpost_replace_category_text(); ?>
			<?php endif; ?>
			<?php minnpost_plus_icon(); ?>
		</div>
		<?php minnpost_category_sponsorship(); ?>
	<?php endif; ?>

	<?php
	if ( ! is_singular() ) {
		minnpost_post_image();
	}
	?>

	<header class="m-entry-header<?php if ( is_singular() ) { ?> m-entry-header-singular<?php } ?><?php if ( is_single() ) { ?> m-entry-header-single<?php } ?>">
		<?php
		$hide_title = get_post_meta( $id, '_mp_remove_title_from_display', true );
		if ( 'on' !== $hide_title ) {
			if ( is_single() ) :
				the_title( '<h1 class="a-entry-title">', '</h1>' );
			else :
				the_title( '<h3 class="a-entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
			endif;
		}

		if ( 'post' === get_post_type() ) :
			?>

			<?php minnpost_share_buttons( 'top' ); ?>

			<?php minnpost_deck(); ?>

			<?php if ( '' !== minnpost_get_posted_by() && '' !== minnpost_get_posted_on() ) : ?>
				<div class="m-entry-meta">
					<?php minnpost_posted_by(); ?> | <?php minnpost_posted_on(); ?>
				</div>
			<?php elseif ( '' !== minnpost_get_posted_by() ) : ?>
				<?php minnpost_posted_by(); ?>
			<?php elseif ( '' !== minnpost_get_posted_on() ) : ?>
				<?php minnpost_posted_on(); ?>
			<?php endif; ?>

		<?php endif; ?>

	</header><!-- .m-entry-header -->

	<?php
	if ( is_singular() ) {
		minnpost_post_image( 'large' );
	}
	?>

	<div class="m-entry-content">
		<?php do_action( 'wp_message_inserter', 'above_article_body' ); ?>
		<?php the_content(); ?>
	</div><!-- .m-entry-content -->

	<?php minnpost_share_buttons( 'bottom' ); ?>

	<?php if ( 'on' !== get_post_meta( get_the_ID(), '_mp_remove_newsletter_signup_from_display', true ) ) : ?>
		<?php do_action( 'wp_message_inserter', 'article_bottom' ); ?>
	<?php endif; ?>

	<?php
	minnpost_related( 'multimedia' );
	minnpost_related( 'content' );
	?>

	<?php
	$tags = get_the_tag_list( '<aside class="a-related-tags"><h4>Related Tags:</h4><ul><li>', '</li><li>', '</li></ul></aside>' );
	echo $tags;
	?>

	<?php
	$hide_author = get_post_meta( $id, '_mp_remove_author_from_display', true );
	$coauthors   = get_coauthors( get_the_ID() );
	$author_info = '';
	if ( 'on' !== $hide_author && empty( esc_html( get_post_meta( $id, '_mp_subtitle_settings_byline', true ) ) ) ) {
		foreach ( $coauthors as $coauthor ) {
			$author_id    = $coauthor->ID;
			$author_info .= minnpost_get_author_figure( $author_id, 'author-teaser', true, true );
		}
	}
	if ( '' !== $author_info ) {
		?>
	<aside class="m-author-info m-author-info-excerpt<?php if ( is_singular() ) { ?> m-author-info-singular<?php } ?><?php if ( is_single() ) { ?> m-author-info-single<?php } ?>">
		<h3 class="a-about-author">About the author:</h3>
		<?php
		foreach ( $coauthors as $coauthor ) :
			$author_id = $coauthor->ID;
			minnpost_author_figure( $author_id, 'author-teaser', true, true );
		endforeach;
		?>
	</aside><!-- .m-author-info -->
		<?php
	}
	?>

	<?php
	// If comments are open or we have at least one comment, load up the comment template.
	if ( comments_open() || get_comments_number() ) :
		comments_template();
	endif;
	?>

</article><!-- #post-## -->
