<?php
/**
 * Template part for displaying posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'm-post m-post-single' ); ?>>

	<?php if ( '' !== minnpost_get_category_name() || '' !== minnpost_get_replace_category_text() ) : ?>
		<div class="m-post-classification">
			<?php if ( '' === minnpost_get_replace_category_text() ) : ?>
				<?php minnpost_category_breadcrumb(); ?>
			<?php else : ?>
				<?php minnpost_replace_category_text(); ?>
			<?php endif; ?>
			<?php minnpost_plus_icon(); ?>
		</div>
	<?php endif; ?>

	<?php minnpost_content_sponsorship( 'post' ); ?>

	<?php
	if ( ! is_singular() ) {
		minnpost_post_image( 'full' );
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

			<?php minnpost_deck(); ?>

			<?php
			$hide_excerpt = get_post_meta( $id, '_mp_remove_excerpt_from_display', true );
			if ( 'on' !== $hide_excerpt ) :
				?>
				<?php if ( '' !== get_the_excerpt() ) : ?>
					<div class="m-entry-excerpt">
						<?php the_excerpt(); ?>
					</div><!-- .m-entry-excerpt -->
				<?php endif; ?>
			<?php endif; ?>

			<?php if ( '' !== minnpost_get_posted_by() ) : ?>
				<div class="m-entry-byline">
					<?php minnpost_posted_by(); ?>
				</div>
			<?php endif; ?>

		<?php endif; ?>

	</header><!-- .m-entry-header -->

	<?php
	if ( is_singular() ) {
		minnpost_post_image( 'full' );
	}
	?>

	<?php
	// keep share buttons horizontal if instructed
	$layout_class                    = '';
	$share_buttons_always_horizontal = get_post_meta( $id, '_mp_share_buttons_always_horizontal', true );
	if ( 'on' === $share_buttons_always_horizontal ) {
		$layout_class .= ' o-entry-horizontal';
	}
	?>
	<div class="o-entry<?php echo $layout_class; ?>">
		<?php
		// keep share buttons horizontal if instructed
		$layout_class_meta = '';
		$share_buttons_always_horizontal = get_post_meta( $id, '_mp_share_buttons_always_horizontal', true );
		if ( 'on' === $share_buttons_always_horizontal ) {
			$layout_class_meta .= ' m-entry-meta-horizontal';
		}
		?>
		<div class="m-entry-meta<?php echo $layout_class_meta; ?>">
			<?php if ( '' !== minnpost_get_posted_on() ) : ?>
				<?php minnpost_posted_on(); ?>
			<?php endif; ?>
			<?php minnpost_share_buttons(); ?>
		</div><!-- .m-entry-meta -->

		<div class="m-entry-content">
			<?php do_action( 'wp_message_inserter', 'above_article_body' ); ?>
			<?php the_content(); ?>
			<?php do_action( 'wp_message_inserter', 'below_article_body' ); ?>
		</div><!-- .m-entry-content -->
	</div><!-- .o-entry -->

	<?php
	$hide_author = get_post_meta( $id, '_mp_remove_author_from_display', true );
	$hide_author = apply_filters( 'minnpost_largo_hide_author', $hide_author );
	$coauthors   = get_coauthors( get_the_ID() );
	$author_info = '';
	if ( 'on' !== $hide_author && empty( esc_html( get_post_meta( $id, '_mp_subtitle_settings_byline', true ) ) ) ) {
		foreach ( $coauthors as $coauthor ) {
			$author_id    = $coauthor->ID;
			$author_info .= minnpost_get_author_figure( $author_id, 'photo', 'excerpt', true, 'display_name', true, 'cap-job-title', false );
		}
	}
	if ( '' !== $author_info ) {
		?>
	<aside class="m-author-info m-author-info-excerpt<?php if ( is_singular() ) { ?> m-author-info-singular<?php } ?><?php if ( is_single() ) { ?> m-author-info-single<?php } ?>">
		<?php
		foreach ( $coauthors as $coauthor ) :
			$author_id = $coauthor->ID;
			minnpost_author_figure( $author_id, 'photo', 'excerpt', true, 'display_name', true, 'cap-job-title', false );
		endforeach;
		?>
	</aside><!-- .m-author-info -->
		<?php
	}
	?>

	<?php if ( 'on' !== get_post_meta( get_the_ID(), '_mp_remove_newsletter_signup_from_display', true ) ) : ?>
		<?php do_action( 'wp_message_inserter', 'article_bottom' ); ?>
	<?php endif; ?>

	<?php if ( 'on' !== get_post_meta( get_the_ID(), '_mp_prevent_related_content', true ) ) : ?>
		<aside class="m-related">
			<?php
			$related_multimedia_ids = minnpost_get_related( 'multimedia' );
			$related_content_ids    = minnpost_get_related( 'content' );
			if ( empty( $related_multimedia_ids ) && empty( $related_content_ids ) ) {
				if ( ! empty( minnpost_get_related( 'zoninator' ) ) ) {
					// this function has a true/false flag in it to set whether it returns results.
					minnpost_related( 'zoninator' );
				} elseif ( ! empty( minnpost_largo_get_jetpack_results() ) ) {
					// this function has true/false flags in it to determine the filters it uses for Jetpack.
					minnpost_related( 'automated' );
				} else {
					echo do_shortcode( '[jetpack-related-posts]' );
				}
			} else {
				// these are the manually selected recommendations that override all the automated ones.
				minnpost_related( 'multimedia' );
				minnpost_related( 'content' );
			}
			$related_terms = minnpost_get_related_terms();
			if ( ! empty( $related_terms ) ) {
				minnpost_related_terms();
			}
			?>
		</aside>
	<?php endif; ?>

	<?php
	// If comments are open or we have at least one comment, load up the comment template.
	if ( comments_open() || get_comments_number() ) :
		comments_template();
	endif;
	?>

</article><!-- #post-## -->
