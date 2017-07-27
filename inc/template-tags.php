<?php
/**
 * Custom template tags for this theme
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package MinnPost Largo
 */

if ( ! function_exists( 'minnpost_post_image' ) ) :
	/**
	 * Outputs story image, whether detail or various kinds of thumbnail, depending on where it is called
	 */
	function minnpost_post_image( $size = 'detail' ) {

		$image_url = get_post_meta( get_the_ID(), '_mp_image_settings_main_image', true );
		$image_id = get_post_meta( get_the_ID(), '_mp_image_settings_main_image_id', true );
		if ( post_password_required() || is_attachment() || ( ! $image_id && ! $image_url ) ) {
			return;
		}

		$caption = wp_get_attachment_caption( $image_id );
		$credit = get_media_credit_html( $image_id );

		if ( '' !== wp_get_attachment_image( $image_id, $size ) ) {
			$image = wp_get_attachment_image( $image_id, $size );
		} else {
			$alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
			$image = '<img src="' . $image_url . '" alt="' . $alt . '">';
		}

		if ( is_singular() ) : ?>
			<figure class="post-image post-image-<?php echo $size; ?>">
				<?php echo $image; ?>
				<?php if ( '' !== $caption || '' !== $credit ) { ?>
				<figcaption>
					<?php if ( '' !== $credit ) { ?>
					<div class="credit"><?php echo $credit; ?></div>
					<div class="caption"><?php echo $caption; ?></div>
					<?php } ?>
				</figcaption>
				<?php } ?>
			</figure><!-- .post-image -->
		<?php else : ?>
			<a class="post-thumbnail" href="<?php the_permalink(); ?>" aria-hidden="true">
				<?php
				if ( is_home() ) :
					$size = esc_html( get_post_meta( get_the_ID(), '_mp_image_settings_homepage_image_size', true ) );
					the_post_thumbnail(
						$size,
						array(
							'alt' => the_title_attribute( 'echo=0' ),
						)
					);
				else :
					the_post_thumbnail(
						$size,
						array(
							'alt' => the_title_attribute( 'echo=0' ),
						)
					);
				endif;
				?>
			</a>
		<?php endif; // End is_singular()
	}
endif;

if ( ! function_exists( 'minnpost_posted_on' ) ) :
	/**
	 * Prints HTML with meta information for the current post-date/time and author.
	 */
	function minnpost_posted_on() {
		$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
		/*if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
			$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
		}*/

		$time_string = sprintf( $time_string,
			esc_attr( get_the_date( 'c' ) ),
			esc_html( get_the_date() ),
			esc_attr( get_the_modified_date( 'c' ) ),
			esc_html( get_the_modified_date() )
		);

		$posted_on = sprintf(
			esc_html_x( '%s', 'post date', 'minnpost-largo' ),
			$time_string
		);

		echo '<span class="posted-on">' . $posted_on . '</span>'; // WPCS: XSS OK.

	}
endif;

if ( ! function_exists( 'minnpost_posted_by' ) ) :
	/**
	 * Integrate Co-Authors Plus
	 */
	function minnpost_posted_by() {
		if ( ! empty( esc_html( get_post_meta( get_the_ID(), '_mp_subtitle_settings_byline', true ) ) ) ) :
			printf( esc_html( get_post_meta( get_the_ID(), '_mp_subtitle_settings_byline', true ) ) );
		else :
			if ( function_exists( 'coauthors_posts_links' ) ) :
				printf( coauthors_posts_links( ',', ',', null, null, false ) );
			else :
				the_author_posts_link();
			endif;
		endif;
	}
endif;

if ( ! function_exists( 'minnpost_entry_footer' ) ) :
	/**
	 * Prints HTML with meta information for the categories, tags and comments.
	 */
	function minnpost_entry_footer() {
		// Hide category and tag text for pages.
		if ( 'post' === get_post_type() ) {
			/* translators: used between list items, there is a space after the comma */
			$categories_list = get_the_category_list( esc_html__( ', ', 'minnpost-largo' ) );
			if ( $categories_list && minnpost_categorized_blog() ) {
				printf( '<span class="cat-links">' . esc_html__( 'Posted in %1$s', 'minnpost-largo' ) . '</span>', $categories_list ); // WPCS: XSS OK.
			}

			/* translators: used between list items, there is a space after the comma */
			$tags_list = get_the_tag_list( '', esc_html__( ', ', 'minnpost-largo' ) );
			if ( $tags_list ) {
				printf( '<span class="tags-links">' . esc_html__( 'Tagged %1$s', 'minnpost-largo' ) . '</span>', $tags_list ); // WPCS: XSS OK.
			}
		}

		if ( ! is_single() && ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
			echo '<span class="comments-link">';
			/* translators: %s: post title */
			comments_popup_link( sprintf( wp_kses( __( 'Leave a Comment<span class="screen-reader-text"> on %s</span>', 'minnpost-largo' ), array( 'span' => array( 'class' => array() ) ) ), get_the_title() ) );
			echo '</span>';
		}

		edit_post_link(
			sprintf(
				/* translators: %s: Name of current post */
				esc_html__( 'Edit %s', 'minnpost-largo' ),
				the_title( '<span class="screen-reader-text">"', '"</span>', false )
			),
			'<span class="edit-link">',
			'</span>'
		);
	}
endif;


if ( ! function_exists( 'minnpost_edit_link' ) ) :
	/**
	 * Prints HTML with meta information for the categories, tags and comments.
	 */
	function minnpost_edit_link() {
		edit_post_link(
			sprintf(
				/* translators: %s: Name of current post */
				esc_html__( 'Edit %s', 'minnpost-largo' ),
				the_title( '<span class="screen-reader-text">"', '"</span>', false )
			),
			'<span class="edit-link">',
			'</span>'
		);
	}
endif;
