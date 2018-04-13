<?php
/**
 * Custom template tags for this theme
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package MinnPost Largo
 */

/**
* Output story image based on where it should go
*
* @param string $size
* @param array $attributes
* @param int $id
*
*/
if ( ! function_exists( 'minnpost_post_image' ) ) :
	/**
	 * Outputs story image, whether large or various kinds of thumbnail, depending on where it is called
	 */
	function minnpost_post_image( $size = 'thumbnail', $attributes = array(), $id = '', $lazy_load = true ) {
		if ( '' === $id ) {
			$id = get_the_ID();
		}
		$image_data = get_minnpost_post_image( $size, $attributes, $id, $lazy_load );
		if ( '' !== $image_data ) {
			$image_id  = $image_data['image_id'];
			$image_url = $image_data['image_url'];
			$image     = $image_data['markup'];
		}

		if ( post_password_required() || is_attachment() || ( ! isset( $image_id ) && ! isset( $image_url ) ) ) {
			return;
		}

		if ( true === $lazy_load ) {
			$image = apply_filters( 'easy_lazy_loader_html', $image );
		}

		$caption = wp_get_attachment_caption( $image_id );
		$credit  = get_media_credit_html( $image_id, false ); // don't show the uploader by default

		if ( is_singular() && ! is_singular( 'newsletter' ) && ( ! isset( $attributes['location'] ) || 'related' !== $attributes['location'] ) ) : ?>
			<figure class="m-post-image m-post-image-<?php echo $size; ?>">
				<?php echo $image; ?>
				<?php if ( '' !== $caption || '' !== $credit ) { ?>
				<figcaption>
					<?php if ( '' !== $credit ) { ?>
						<div class="a-media-meta a-media-credit"><?php echo $credit; ?></div>
					<?php } ?>
					<?php if ( '' !== $caption ) { ?>
						<div class="a-media-meta a-media-caption"><?php echo $caption; ?></div>
					<?php } ?>
				</figcaption>
				<?php } ?>
			</figure><!-- .post-image -->
		<?php elseif ( is_singular( 'newsletter' ) ) : ?>
			<?php echo $image; ?>
		<?php else : ?>
			<a class="m-post-image m-post-thumbnail" href="<?php the_permalink( $id ); ?>" aria-hidden="true">
				<?php
				echo $image;
				?>
			</a>
		<?php
		endif; // End is_singular()
	}
endif;

/**
* Get the story image based on where it should go
*
* @param string $size
* @param array $attributes
* @param int $id
*
* @return array $image_data
*
*/
if ( ! function_exists( 'get_minnpost_post_image' ) ) :
	/**
	 * Returns story image, whether large or various kinds of thumbnail, depending on where it is called
	 */
	function get_minnpost_post_image( $size = 'thumbnail', $attributes = array(), $id = '', $lazy_load = true ) {
		if ( '' === $id ) {
			$id = get_the_ID();
		}
		// large is the story detail image. this is a built in size in WP
		// home has its own size field
		if ( is_home() && 'feature' === $size ) {
			$size = esc_html( get_post_meta( $id, '_mp_post_homepage_image_size', true ) );
		} elseif ( is_home() && 'thumbnail' === $size ) {
			$size = 'thumbnail';
		} elseif ( is_single() && ! is_singular( 'newsletter' ) && ( ! isset( $attributes['location'] ) || ( 'sidebar' !== $attributes['location'] && 'related' !== $attributes['location'] ) ) ) {
			$size = 'large';
		} else {
			$size = $size;
		}

		if ( 'large' === $size ) {
			$image_url = get_post_meta( $id, '_mp_post_main_image', true );
		} elseif ( 'thumbnail' !== $size ) {
			$image_url = get_post_meta( $id, '_mp_post_thumbnail_image_' . $size, true );
		} else {
			$image_url = get_post_meta( $id, '_mp_post_thumbnail_image', true );
		}

		$main_image_id      = get_post_meta( $id, '_mp_post_main_image_id', true );
		$thumbnail_image_id = get_post_meta( $id, '_mp_post_thumbnail_image_id', true );

		if ( 'large' === $size ) {
			if ( '' !== $main_image_id ) {
				$image_id = $main_image_id;
			} elseif ( '' !== $thumbnail_image_id ) {
				$image_id = $thumbnail_image_id;
			}
		} else {
			if ( '' !== $thumbnail_image_id ) {
				$image_id = $thumbnail_image_id;
			} elseif ( '' !== $main_image_id ) {
				$image_id = $main_image_id;
			}
		}

		if ( ! isset( $image_id ) ) {
			$image_id = '';
		}

		if ( '' !== wp_get_attachment_image( $image_id, $size ) ) {
			// this requires that the custom image sizes in custom-fields.php work correctly
			$image = wp_get_attachment_image( $image_id, $size );
		} else {
			if ( '' !== $image_id ) {
				$alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
			} else {
				$alt = '';
			}
			$image = '<img src="' . $image_url . '" alt="' . $alt . '">';
			if ( is_singular( 'newsletter' ) ) {
				$image = '<img src="' . $image_url . '" alt="' . $alt . '"';
				if ( isset( $attributes['title'] ) ) {
					$image .= ' title="' . $attributes['title'] . '"';
				}
				if ( isset( $attributes['style'] ) ) {
					$image .= ' style="' . $attributes['style'] . '"';
				}
				if ( isset( $attributes['class'] ) ) {
					$image .= ' class="' . $attributes['class'] . '"';
				}
				if ( isset( $attributes['align'] ) ) {
					$image .= ' align="' . $attributes['align'] . '"';
				}
				if ( isset( $attributes['width'] ) ) {
					$image .= ' width="' . $attributes['width'] . '"';
				}
				if ( isset( $attributes['height'] ) ) {
					$image .= ' height="' . $attributes['height'] . '"';
				}
				$image .= '>';
			}
		}

		if ( post_password_required() || is_attachment() || ( '' === $image_id && '' === $image_url ) ) {
			return;
		}

		if ( true === $lazy_load ) {
			$image = apply_filters( 'easy_lazy_loader_html', $image );
		}

		$image_data = array(
			'image_id'  => $image_id,
			'image_url' => $image_url,
			'markup'    => $image,
		);
		return $image_data;
	}
endif;

/**
* Output when the article was posted
*
* @param int $id
*
*/
if ( ! function_exists( 'minnpost_posted_on' ) ) :
	/**
	 * Prints HTML with meta information for the current post-date/time and author.
	 */
	function minnpost_posted_on( $id = '' ) {
		if ( '' === $id ) {
			$id = get_the_ID();
		}
		$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
		$time_string = sprintf( $time_string,
			esc_attr( get_the_date( 'c' ), $id ),
			esc_html( get_the_date( '', $id ) ),
			esc_attr( get_the_modified_date( 'c', $id ) ),
			esc_html( get_the_modified_date( '', $id ) )
		);

		$posted_on = sprintf(
			// translators: the placeholder is the time string, which can be translated
			esc_html_x( '%s', 'post date', 'minnpost-largo' ),
			$time_string
		);

		echo '<span class="posted-on">' . $posted_on . '</span>'; // WPCS: XSS OK.

	}
endif;

/**
* Output the author/authors who posted the article
* This depends on the Co-Authors Plus plugin
*
* @param int $id
*
*/
if ( ! function_exists( 'minnpost_posted_by' ) ) :
	function minnpost_posted_by( $id = '' ) {
		if ( '' === $id ) {
			$id = get_the_ID();
		}
		if ( ! empty( esc_html( get_post_meta( $id, '_mp_subtitle_settings_byline', true ) ) ) ) :
			printf( esc_html( get_post_meta( $id, '_mp_subtitle_settings_byline', true ) ) );
		else :
			if ( function_exists( 'coauthors_posts_links' ) ) :
				printf( 'By ' . coauthors_posts_links( ',', ',', null, null, false ) );
			else :
				printf( 'By <a href="' . get_the_author_posts_url( get_the_author_meta( 'ID' ) ) . '">' . the_author( $id ) . '</a>' );
			endif;
		endif;
	}
endif;

/**
* Get who posted the article
* This depends on the Co-Authors Plus plugin
*
* @param int $id
* @return string
*
*/
if ( ! function_exists( 'minnpost_get_posted_by' ) ) :
	function minnpost_get_posted_by( $id = '' ) {
		if ( '' === $id ) {
			$id = get_the_ID();
		}
		if ( ! empty( esc_html( get_post_meta( $id, '_mp_subtitle_settings_byline', true ) ) ) ) :
			return esc_html( get_post_meta( $id, '_mp_subtitle_settings_byline', true ) );
		else :
			if ( function_exists( 'coauthors_posts_links' ) ) :
				return 'By ' . coauthors_posts_links( ',', ',', null, null, false );
			else :
				return 'By <a href="' . get_the_author_posts_url( get_the_author_meta( 'ID' ) ) . '">' . the_author( $id ) . '</a>';
			endif;
		endif;
	}
endif;

/**
* Output the related stories for a post
*
* @param string $type
*
*/
if ( ! function_exists( 'minnpost_related' ) ) :
	function minnpost_related( $type = 'content' ) {
		if ( ! empty( get_post_meta( get_the_ID(), '_mp_related_' . $type, true ) ) ) :
		?>
		<aside class="m-related m-related-<?php echo $type; ?>">
			<h3 class="a-related-title a-related-title-<?php echo $type; ?>">Related <?php echo ucfirst( $type ); ?>:</h3>
			<ul class="a-related-list a-related-list-<?php echo $type; ?>">
				<?php
				$ids = get_post_meta( get_the_ID(), '_mp_related_' . $type, true );
				if ( ! is_array( $ids ) ) {
					$ids = explode( ',', esc_html( $ids ) );
				}
				foreach ( $ids as $id ) :
					//$post = get_post( $id, ARRAY_A );
				?>
					<li>
						<?php
							minnpost_post_image(
								'thumbnail',
								array(
									'location' => 'related',
								),
								$id
							);
						?>
						<p class="a-post-category a-zone-item-category"><?php echo minnpost_get_category_name( $id ); ?></p>
						<header class="m-entry-header">
							<h3 class="a-entry-title"><a href="<?php echo get_permalink( $id ); ?>"><?php echo get_the_title( $id ); ?></a></h3>
							<?php if ( 'post' === get_post_type( $id ) ) : ?>
								<div class="m-entry-meta">
									<?php minnpost_posted_by( $id ); ?> | <?php minnpost_posted_on( $id ); ?> <?php minnpost_edit_link( $id ); ?>
								</div>
								<?php endif; ?>
						</header>
						<div class="m-entry-excerpt"><?php echo wpautop( get_the_excerpt( $id ) ); ?></div>
					</li>
				<?php
				endforeach;
				?>
			</ul>
		</aside>
		<?php
	endif;
	}
endif;

/**
* Outputs author image, large or thumbnail, with/without the bio or excerpt bio, all inside a <figure>
*
* @param int $author_id
* @param string $size
* @param bool $include_text
* @param bool $include_name
*
*/
if ( ! function_exists( 'minnpost_author_figure' ) ) :
	function minnpost_author_figure( $author_id = '', $size = 'photo', $include_text = true, $include_name = false ) {
		$output = minnpost_get_author_figure( $author_id, $size, $include_text, $include_name );
		echo $output;
	}
endif;

/**
* Get author image, large or thumbnail, with/without the bio or excerpt bio, all inside a <figure>
*
* @param int $author_id
* @param string $size
* @param bool $include_text
* @param bool $include_name
*
* @return string $output
*
*/
if ( ! function_exists( 'minnpost_get_author_figure' ) ) :
	/**
	 * Returns author image, large or thumbnail, with/without the bio or excerpt bio, all inside a <figure>
	 */
	function minnpost_get_author_figure( $author_id = '', $size = 'photo', $include_text = true, $include_name = false ) {

		// in drupal there was only one author image size
		if ( '' === $author_id ) {
			$author_id = get_the_author_meta( 'ID' );
		}

		$image_data = minnpost_get_author_image( $author_id, $size );
		if ( '' !== $image_data ) {
			$image_id  = $image_data['image_id'];
			$image_url = $image_data['image_url'];
			$image     = $image_data['markup'];
		}

		$text = '';
		if ( 'photo' === $size ) { // full text
			$text = get_post_meta( $author_id, '_mp_author_bio', true );
		} else { // excerpt
			$text = wpautop( get_post_meta( $author_id, '_mp_author_excerpt', true ) );
		}

		if ( post_password_required() || is_attachment() || ( ! isset( $image_id ) && ! isset( $image_url ) ) ) {
			return;
		}

		$name = '';
		$name = get_post_meta( $author_id, 'cap-display_name', true );

		$caption = wp_get_attachment_caption( $image_id );
		$credit  = get_media_credit_html( $image_id );

		if ( is_singular() || is_archive() ) {
			$output  = '';
			$output .= '<figure class="a-archive-figure a-author-figure a-author-figure-' . $size . '">';
			$output .= $image;
			if ( true === $include_text && '' !== $text ) {
				$output .= '<figcaption>';
				if ( true === $include_name && '' !== $name ) {
					$output .= '<h3 class="a-author-title"><a href="' . get_author_posts_url( $author_id, sanitize_title( $name ) ) . '">' . $name . '</a></h3>';
				}
				$output .= $text;
				$output .= '</figcaption>';
			}
			$output .= '</figure><!-- .author-figure -->';
			return $output;
		}; // End is_singular() || is_archive
	}
endif;

/**
* Returns author image, large or thumbnail, to put inside the figure
*
* @param int $author_id
* @param string $size
*
* @return array $image_data
*
*/
if ( ! function_exists( 'minnpost_get_author_image' ) ) :
	function minnpost_get_author_image( $author_id = '', $size = 'photo' ) {

		$image_url = get_post_meta( $author_id, '_mp_author_image', true );
		if ( 'photo' !== $size ) {
			$image_url = get_post_meta( $author_id, '_mp_author_image_' . $size, true );
		}
		$image_id = get_post_meta( $author_id, '_mp_author_image_id', true );

		// some authors have an image, but they do not have a thumbnail
		if ( '' !== $image_id && '' === $image_url && 'author-thumbnail' === $size ) {
			$image_url = get_post_meta( $author_id, '_mp_author_image', true );
		}

		// some authors have an image, but they do not have a teaser
		if ( '' !== $image_id && '' === $image_url && 'author-teaser' === $size ) {
			$image_url = get_post_meta( $author_id, '_mp_author_image', true );
		}

		if ( post_password_required() || is_attachment() || ( ! $image_id && ! $image_url ) ) {
			return '';
		}

		if ( '' !== wp_get_attachment_image( $image_id, $size ) ) {
			// todo: test this display because so far we just have external urls
			$image = wp_get_attachment_image( $image_id, $size );
		} else {
			$alt   = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
			$image = '<img src="' . $image_url . '" alt="' . $alt . '">';
		}

		$image = apply_filters( 'easy_lazy_loader_html', $image );

		$image_data = array(
			'image_id'  => $image_id,
			'image_url' => $image_url,
			'markup'    => $image,
		);
		return $image_data;

	}
endif;

/**
* Outputs term image, large or thumbnail, with/without the description or excerpt, all inside a <figure>
*
* @param int $category_id
* @param string $size
* @param string $include_text
* @param string $include_name
* @param string $link_on
*
*/
if ( ! function_exists( 'minnpost_term_figure' ) ) :
	function minnpost_term_figure( $category_id = '', $size = 'feature', $include_text = true, $include_name = false, $link_on = 'title' ) {
		$output = minnpost_get_term_figure( $category_id, $size, $include_text, $include_name, $link_on );
		echo $output;
	}
endif;

/**
* Returns term image, large or thumbnail, with/without the description or excerpt, all inside a <figure>
*
* @param int $category_id
* @param string $size
* @param string $include_text
* @param string $include_name
* @param string $link_on
* @return string $output
*
*/
if ( ! function_exists( 'minnpost_get_term_figure' ) ) :
	function minnpost_get_term_figure( $category_id = '', $size = 'feature', $include_text = true, $include_name = false, $link_on = 'title' ) {

		$image_data = minnpost_get_term_image( $category_id, $size );
		if ( '' !== $image_data ) {
			$image_id  = $image_data['image_id'];
			$image_url = $image_data['image_url'];
			$image     = $image_data['markup'];
		}

		$text = minnpost_get_term_text( $category_id, $size );

		if ( post_password_required() || is_attachment() || ( ! isset( $image_id ) && ! isset( $image_url ) ) ) {
			return '';
		}

		$name = '';
		$name = get_cat_name( $category_id, $size );

		$caption = wp_get_attachment_caption( $image_id );
		$credit  = get_media_credit_html( $image_id, false ); // don't show the uploader by default

		if ( is_singular() || is_archive() || is_home() ) {
			$output  = '';
			$output .= '<figure class="a-archive-figure a-category-figure a-category-figure-' . $size . '">';
			if ( 'figure' === $link_on ) {
				$output .= '<a href="' . get_category_link( $category_id ) . '">';
			}
			$output .= $image;
			if ( true === $include_text && '' !== $text ) {
				$output .= '<figcaption>';
				if ( true === $include_name && '' !== $name ) {
					$output .= '<h3 class="a-category-title">';
					if ( 'title' === $link_on ) {
						$output .= '<a href="' . get_category_link( $category_id ) . '">' . $name . '</a>';
					} else {
						$output .= $name;
					}
					$output .= '</h3>';
				}
				$output .= $text;
				$output .= '</figcaption>';
			}
			if ( 'figure' === $link_on ) {
				$output .= '</a>';
			}
			$output .= '</figure><!-- .category-figure -->';
			return $output;
		} // End is_singular() || is_archive() || is_home()
	}
endif;

/**
* Returns term image, large or thumbnail, to put inside the figure
*
* @param int $category_id
* @param string $size
* @return array $image_data
*
*/
if ( ! function_exists( 'minnpost_get_term_image' ) ) :
	function minnpost_get_term_image( $category_id = '', $size = 'feature' ) {
		$image_url = get_term_meta( $category_id, '_mp_category_main_image', true );
		if ( 'feature' !== $size ) {
			$image_url = get_term_meta( $category_id, '_mp_category_' . $size . '_image', true );
			$image_id  = get_term_meta( $category_id, '_mp_category_' . $size . '_image_id', true );
		}

		$image_id = get_term_meta( $category_id, '_mp_category_main_image_id', true );

		if ( post_password_required() || is_attachment() || ( ! $image_id && ! $image_url ) ) {
			return '';
		}

		if ( '' !== wp_get_attachment_image( $image_id, $size ) ) {
			// todo: test this display because so far we just have external urls
			$image = wp_get_attachment_image( $image_id, $size );
		} else {
			$alt   = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
			$image = '<img src="' . $image_url . '" alt="' . $alt . '">';
		}

		$image = apply_filters( 'easy_lazy_loader_html', $image );

		$image_data = array(
			'image_id'  => $image_id,
			'image_url' => $image_url,
			'markup'    => $image,
		);
		return $image_data;

	}
endif;

/**
* Returns term description or excerpt, by itself
*
* @param int $category_id
* @param string $size
* @return string $text
*
*/
if ( ! function_exists( 'minnpost_get_term_text' ) ) :
	function minnpost_get_term_text( $category_id = '', $size = 'feature' ) {
		$text = '';
		if ( 'feature' === $size ) { // full text
			$text = get_term_meta( $category_id, '_mp_category_body', true );
		} else { // excerpt
			$text = '<p>' . strip_tags( get_term_meta( $category_id, '_mp_category_excerpt', true ) ) . '</p>';
		}
		return $text;
	}
endif;

/**
* Outputs any additional links for the term archive page (rss, twitter, etc.)
*
* @param int $category_id
*
*/
if ( ! function_exists( 'minnpost_term_extra_links' ) ) :
	function minnpost_term_extra_links( $category_id = '' ) {
		$link = get_term_meta( $category_id, '_mp_category_excerpt_links', true );
		if ( ! empty( $link ) ) {
			if ( 'Author bio' === $link['text'] ) {
				$class      = ' class="a-bio-link"';
				$url_prefix = get_bloginfo( 'url' ) . '/';
			} elseif ( 'Follow on Twitter' === $link['text'] ) {
				$class      = ' class="a-twitter-link"';
				$url_prefix = '';
			} elseif ( false !== strpos( $link['url'], 'mailto' ) ) {
				$class      = ' class="a-email-link"';
				$url_prefix = get_bloginfo( 'url' ) . '/';
			} else {
				$class      = '';
				$url_prefix = '';
			}
			echo '<li' . $class . '><a href="' . $url_prefix . $link['url'] . '">' . $link['text'] . '</a></li>';
		}
	}
endif;

/**
* Outputs HTML for the footer of the post - includes meta information
*
* @param int $category_id
* @param string $size
* @return string $text
*
*/
if ( ! function_exists( 'minnpost_entry_footer' ) ) :
	function minnpost_entry_footer() {
		// Hide category and tag text for pages.
		if ( 'post' === get_post_type() ) {
			/* translators: used between list items, there is a space after the comma */
			$categories_list = get_the_category_list( esc_html__( ', ', 'minnpost-largo' ) );
			if ( $categories_list && minnpost_categorized_blog() ) {
				// translators: placeholder is the list of categories
				printf( '<span class="cat-links">' . esc_html__( 'Posted in %1$s', 'minnpost-largo' ) . '</span>', $categories_list ); // WPCS: XSS OK.
			}

			/* translators: used between list items, there is a space after the comma */
			$tags_list = get_the_tag_list( '', esc_html__( ', ', 'minnpost-largo' ) );
			if ( $tags_list ) {
				// translators: placeholder is the list of tags
				printf( '<span class="tags-links">' . esc_html__( 'Tagged %1$s', 'minnpost-largo' ) . '</span>', $tags_list ); // WPCS: XSS OK.
			}
		}

		if ( ! is_single() && ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
			echo '<span class="comments-link">';
			/* translators: %s: post title */
			comments_popup_link(
				sprintf(
					wp_kses(
						__( 'Leave a Comment<span class="screen-reader-text"> on %s</span>', 'minnpost-largo' ),
						array(
							'span' => array(
								'class' => array(),
							),
						)
					),
					get_the_title()
				)
			);
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

/**
* Outputs edit link to users with that permission
*
* @param int $id
*
*/
if ( ! function_exists( 'minnpost_edit_link' ) ) :
	function minnpost_edit_link( $id = '' ) {
		if ( '' === $id ) {
			$id = get_the_ID();
			if ( 0 === $id ) {
				return;
			}
		}
		$user = wp_get_current_user();
		if ( 0 === $user->ID || in_array( 'comment_moderator', (array) $user->roles ) ) {
			return;
		}
		edit_post_link(
			sprintf(
				/* translators: %s: Name of current post */
				esc_html__( 'Edit %s', 'minnpost-largo' ),
				the_title( '<span class="screen-reader-text">"', '"</span>', false )
			),
			'<span class="edit-link">',
			'</span>',
			$id
		);
	}
endif;

/**
* Outputs HTML for the post sidebar, if it is present
*
* @param int $post_id
*
*/
if ( ! function_exists( 'minnpost_post_sidebar' ) ) :
	function minnpost_post_sidebar( $post_id = '' ) {

		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}

		$sidebar = get_post_meta( $post_id, '_mp_post_sidebar', true );
		if ( null !== $sidebar && '' !== $sidebar ) {
			echo '<section id="post-sidebar" class="m-post-sidebar">' . $sidebar . '</section>';
		}
	}
endif;

/**
* Outputs HTML for the category breadcrumb
*
* @param int $post_id
*
*/
if ( ! function_exists( 'minnpost_category_breadcrumb' ) ) :
	function minnpost_category_breadcrumb( $post_id = '' ) {

		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}

		$category_permalink = get_post_meta( $post_id, '_category_permalink', true );
		if ( null !== $category_permalink && '' !== $category_permalink ) {
			if ( isset( $category_permalink['category'] ) && '' !== $category_permalink['category'] ) {
				$cat_id   = $category_permalink['category'];
				$category = get_category( $cat_id );
			} else {
				$categories = get_the_category();
				$category   = $categories[0];
			}
		} else {
			$categories = get_the_category();
			$category   = $categories[0];
		}
		$category_link = get_category_link( $category );
		$category_name = $category->name;
		echo '<div class="a-breadcrumb"><a href="' . $category_link . '">' . $category_name . '</a></div>';
	}
endif;

/**
* Returns the category name for a post's main category
*
* @param int $post_id
* @return string $category_name
*
*/
if ( ! function_exists( 'minnpost_get_category_name' ) ) :
	function minnpost_get_category_name( $post_id = '' ) {

		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}

		$category_permalink = get_post_meta( $post_id, '_category_permalink', true );
		// we have to check a few conditions to get the category correctly
		if ( null !== $category_permalink && '' !== $category_permalink ) {
			if ( is_array( $category_permalink ) ) {
				$cat_id = $category_permalink['category'];
			} else {
				$cat_id = $category_permalink;
			}
			$category = get_category( $cat_id );
		} else {
			$categories = get_the_category();
			if ( empty( $categories ) ) {
				return '';
			}
			$category = $categories[0];
		}
		if ( isset( $category->name ) ) {
			$category_name = $category->name;
		} else {
			$category_name = ''; // there is no category
		}

		return $category_name;
	}
endif;

/**
* Outputs HTML for category sponsorship
*
* @param int $post_id
* @param int $category_id
*
*/
if ( ! function_exists( 'minnpost_category_sponsorship' ) ) :
	function minnpost_category_sponsorship( $post_id = '', $category_id = '' ) {
		$sponsorship = minnpost_get_category_sponsorship( $post_id, $category_id );
		echo $sponsorship;
	}
endif;

/**
* Returns the category sponsorship for a post's primary category, if it exists
*
* @param int $post_id
* @param int $category_id
* @return string
*
*/
if ( ! function_exists( 'minnpost_get_category_sponsorship' ) ) :
	function minnpost_get_category_sponsorship( $post_id = '', $category_id = '' ) {
		if ( '' === $category_id ) {
			if ( '' === $post_id ) {
				$post_id = get_the_ID();
			}
			$category_permalink = get_post_meta( $post_id, '_category_permalink', true );
			if ( null !== $category_permalink && '' !== $category_permalink ) {
				$category_id = $category_permalink['category'];
			} else {
				$categories  = get_the_category();
				$category_id = $categories[0]->cat_id;
			}
		}
		$sponsorship = get_term_meta( $category_id, '_mp_category_sponsorship', true );
		if ( ! empty( $sponsorship ) ) {
			return '<div class="a-sponsorship">' . $sponsorship . '</div>';
		} else {
			return '';
		}
	}
endif;

/**
* Outputs HTML for MinnPost Plus content
*
* @param int $post_id
*
*/
if ( ! function_exists( 'minnpost_plus_icon' ) ) :
	function minnpost_plus_icon( $post_id = '' ) {
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}
		$access_level = get_post_meta( $post_id, '_access_level', true );
		if ( '' !== $access_level ) {
			if ( class_exists( 'Blocked_Content_Template' ) ) {
				$blocked_content_template = Blocked_Content_Template::get_instance();
				$minimum_level            = $blocked_content_template->get_minimum_branded_level();
				if ( $access_level < $minimum_level ) {
					return;
				}
			}
			echo '<div class="a-minnpost-plus">
				<img src="' . get_theme_file_uri() . '/assets/img/MinnPostPlusLogo.png' . '" alt="MinnPostPlus">
			</div>';
		}
	}
endif;

/**
* Fixes the title on archive pages so it isn't awful
*
* @param string $title
* @return string $title
*
*/
add_filter( 'get_the_archive_title', function ( $title ) {
	if ( is_category() ) {
		$title = single_cat_title( '', false );
	} elseif ( is_tag() ) {
		$title = single_tag_title( '', false );
	} elseif ( is_author() ) {
		$title = '<span class="vcard">' . get_the_author() . '</span>';
	}
	return $title;
});

/**
* Outputs HTML for numeric pagination on archive pages
*
*/
if ( ! function_exists( 'numeric_pagination' ) ) :
	function numeric_pagination() {
		// if this is a singular item and we accidentally left it on there, get out
		if ( is_singular() ) {
			return;
		}

		global $wp_query;

		// only continue if there is more than one page
		if ( $wp_query->max_num_pages <= 1 ) {
			return;
		}

		$paged = get_query_var( 'paged' ) ? absint( get_query_var( 'paged' ) ) : 1;
		$max   = intval( $wp_query->max_num_pages );

		// current page
		if ( $paged >= 1 ) {
			$links[] = $paged;
		}

		// pages around the current page
		if ( $paged >= 3 ) {
			$links[] = $paged - 1;
			$links[] = $paged - 2;
		}
		if ( ( $paged + 2 ) <= $max ) {
			$links[] = $paged + 2;
			$links[] = $paged + 1;
		}

		echo '<div class="m-pagination"><ul>' . "\n";

		// link to page 1
		if ( ! in_array( 1, $links ) ) {
			printf( '<li><a href="%s">%s</a></li>' . "\n", esc_url( get_pagenum_link( 1 ) ), '&Lt; First' );
		}

		// "previous" link
		if ( get_previous_posts_link() ) {
			printf( '<li>%s</li>' . "\n", get_previous_posts_link( '&lt; Previous' ) );
			// elipses
			if ( ! in_array( 2, $links ) ) {
				echo '<li>&hellip;</li>';
			}
		}

		// each line item. don't link the current one because that's silly.
		sort( $links );
		foreach ( (array) $links as $link ) {
			if ( $paged === $link ) {
				printf( '<li class="current">%s</li>' . "\n", $link );
			} else {
				printf( '<li><a href="%s">%s</a></li>' . "\n", esc_url( get_pagenum_link( $link ) ), $link );
			}
		}

		// elipses
		if ( ! in_array( $max - 1, $links ) ) {
			echo '<li>&hellip;</li>' . "\n";
		}

		// "next" link
		if ( get_next_posts_link() ) {
			printf( '<li>%s</li>' . "\n", get_next_posts_link( 'Next &gt;' ) );
		}

		// "last" link
		if ( ! in_array( $max, $links ) ) {
			printf( '<li><a href="%s">%s</a></li>' . "\n", esc_url( get_pagenum_link( $max ) ), 'Last &Gt;' );
		}

		echo '</ul></div>' . "\n";

	}
endif;

/**
* Outputs newsletter logo based on which type of newsletter it is
*
* @param int $newsletter_id
*
*/
if ( ! function_exists( 'minnpost_newsletter_logo' ) ) :
	function minnpost_newsletter_logo( $newsletter_id = '' ) {

		$logo = '';

		$newsletter_type = get_post_meta( $newsletter_id, '_mp_newsletter_type', true );

		if ( '' !== $newsletter_type ) {

			switch ( $newsletter_type ) {
				case 'book_club':
					$filename = 'newsletter-logo-book-club.png';
					break;
				case 'daily':
					$filename = 'newsletter-logo-daily.png';
					break;
				case 'dc_memo':
					$filename = 'dc-memo-header-520x50.png';
					break;
				case 'greater_mn':
					$filename = 'newsletter-logo-mn-week.png';
					break;
				case 'sunday_review':
					$filename = 'newsletter-logo-sunday-review.png';
					break;
				default:
					$filename = 'newsletter-logo-daily.png';
					break;
			}

			$logo = get_theme_file_uri() . '/assets/img/' . $filename;

		}

		echo $logo;
	}
endif;

/**
* Arrange contents for newsletters
*
* @param string $content
* @param string $news_right_top
* @param string $type
* @return array $data
*
*/
if ( ! function_exists( 'minnpost_newsletter_arrange' ) ) :
	function minnpost_newsletter_arrange( $content, $news_right_top, $type = '' ) {
		$promo_dom = new DomDocument;
		$promo_dom->loadHTML( '<?xml encoding="utf-8" ?>' . $content );
		$imgs = $promo_dom->getElementsByTagName( 'img' );
		foreach ( $imgs as $img ) {
			$img->setAttribute( 'style', 'border: 0 none; display: block; height: auto; line-height: 100%; Margin-left: auto; Margin-right: auto; outline: none; text-decoration: none; max-width: 100%;' );
		}
		$promo_xpath = new DOMXpath( $promo_dom );
		$promo_div   = $promo_xpath->query( "//div[contains(concat(' ', @class, ' '), ' image ')]/div" );

		$dom = new DomDocument;
		$dom->loadHTML( '<?xml encoding="utf-8" ?>' . $content );
		$xpath = new DOMXpath( $dom );
		$divs  = $xpath->query( "//div[contains(concat(' ', @class, ' '), ' story ')]" );

		$ad_dom = new DomDocument;
		$ad_dom->loadHTML( '<?xml encoding="utf-8" ?>' . $news_right_top );
		$ad_xpath = new DOMXpath( $ad_dom );
		$ad_divs  = $ad_xpath->query( "//div[contains(concat(' ', @class, ' '), ' block ')]/div/div/p" );

		$contents = array();
		$bottom   = '';
		foreach ( $divs as $key => $value ) {
			$class = $value->getAttribute( 'class' );
			$style = $value->getAttribute( 'style' );
			if ( 0 === $key || 1 === $key ) {
				$contents[] = '<div class="' . $class . '" style="' . $style . '">' . minnpost_dom_innerhtml( $value ) . '</div>';
			} else {
				$bottom .= '<div class="' . $class . '">' . minnpost_dom_innerhtml( $value ) . '</div>';
			}
		}

		$promo = array();
		foreach ( $promo_div as $key => $value ) {
			$href    = $value->getAttribute( 'href' );
			$target  = $value->getAttribute( 'target' );
			$promo[] = '<div class="image">' . minnpost_dom_innerhtml( $value ) . '</div>';
		}

		$ads = array();
		if ( 'dc_memo' !== $type ) {
			foreach ( $ad_divs as $key => $value ) {
				$style = $value->getAttribute( 'style' );
				$ads[] = '<p style="Margin: 0 0 10px; padding: 0">' . minnpost_dom_innerhtml( $value ) . '</p>';
			}
		} else {
			foreach ( $ad_divs as $key => $value ) {
				$style = $value->getAttribute( 'style' );
				$ads[] = '<p style="Margin: 0 0 10px; padding: 0">' . minnpost_dom_innerhtml( $value ) . '</p>';
			}
		}

		$data = array(
			'stories' => $contents,
			'ads'     => $ads,
			'bottom'  => $bottom,
		);
		if ( ! empty( $promo ) ) {
			$data['promo'] = $promo[0];
		}
		return $data;
	}
endif;

/**
* Returns title parts for user profile page
*
* @param string $title
* @return string $title
*
*/
if ( ! function_exists( 'minnpost_user_title_parts' ) ) :
	add_filter( 'document_title_parts', 'minnpost_user_title_parts' );
	function minnpost_user_title_parts( $title ) {
		if ( get_query_var( 'users' ) ) {
			$user_id        = get_query_var( 'users' );
			$user           = get_userdata( $user_id );
			$title['title'] = $user->display_name;
		}
		return $title;
	}
endif;

/**
* Outputs the user account management menu
*
*/
if ( ! function_exists( 'minnpost_account_management_menu' ) ) :
	function minnpost_account_management_menu() {
		$user_id = get_query_var( 'users', '' );
		if ( isset( $_GET['user_id'] ) ) {
			$user_id = esc_attr( $_GET['user_id'] );
		}
		$menu = get_minnpost_account_management_menu( $user_id );
		?>
		<?php if ( ! empty( $menu ) ) : ?>
			<div id="navigation-account-management">
				<nav id="navigation-user-account-management" class="m-secondary-navigation" role="navigation">
					<?php echo $menu; ?>
				</nav><!-- #navigation-user-account-management -->
			</div>
		<?php endif; ?>
		<?php
	}
endif;

/**
* Returns the user account management menu for each user
* This depends on the User Account Management plugin
*
* @param int $user_id
* @return object $menu
*
*/
if ( ! function_exists( 'get_minnpost_account_management_menu' ) ) :
	function get_minnpost_account_management_menu( $user_id = '' ) {
		$menu       = '';
		$can_access = false;
		if ( class_exists( 'User_Account_Management' ) ) {
			$account_management = User_Account_Management::get_instance();
			$can_access         = $account_management->check_user_permissions( $user_id );
		} else {
			if ( get_current_user_id() === $user_id || current_user_can( 'edit_user', $user_id ) ) {
				$can_access = true;
			}
		}
		// if we are on the current user, or if this user can edit users
		if ( true === $can_access ) {
			$menu = wp_nav_menu(
				array(
					'theme_location' => 'user_account_management',
					'menu_id'        => 'user-account-management',
					'depth'          => 1,
					'container'      => false,
					'walker'         => new Minnpost_Walker_Nav_Menu( $user_id ),
					'echo'           => false,
				)
			);
		}
		return $menu;
	}
endif;

/**
* Outputs the user account access menu
*
*/
if ( ! function_exists( 'minnpost_account_access_menu' ) ) :
	function minnpost_account_access_menu() {
		$user_id = get_current_user_id();
		$menu    = get_minnpost_account_access_menu();
		?>
		<?php if ( ! empty( $menu ) ) : ?>
			<nav id="navigation-user-account-access" class="m-secondary-navigation" role="navigation">
				<?php echo $menu; ?>
			</nav><!-- #navigation-user-account-access -->
		<?php endif; ?>
		<?php
	}
endif;

/**
* Returns the user account access menu for each user
* This depends on the User Account Management plugin
*
* @param int $user_id
* @return object $menu
*
*/
if ( ! function_exists( 'get_minnpost_account_access_menu' ) ) :

	function get_minnpost_account_access_menu( $user_id = '' ) {

		if ( '' === $user_id ) {
			$user_id = get_current_user_id();
		}

		$menu       = '';
		$can_access = false;
		if ( class_exists( 'User_Account_Management' ) ) {
			$account_management = User_Account_Management::get_instance();
			$can_access         = $account_management->check_user_permissions( $user_id );
		} else {
			if ( get_current_user_id() === $user_id || current_user_can( 'edit_user', $user_id ) ) {
				$can_access = true;
			}
		}
		// if we are on the current user, or if this user can edit users
		if ( true === $can_access ) {
			$menu = wp_nav_menu(
				array(
					'theme_location' => 'user_account_access',
					'menu_id'        => 'user-account-access',
					'depth'          => 2,
					'container'      => false,
					'walker'         => new Minnpost_Walker_Nav_Menu( $user_id ),
					'echo'           => false,
				)
			);
		}
		return $menu;
	}
endif;

/**
* Returns a username or profile link to be used on comments
*
* @param object $comment
* @return object $comment
*
*/
if ( ! function_exists( 'get_user_name_or_profile_link' ) ) :
	function get_user_name_or_profile_link( $comment ) {

		if ( $comment->user_id ) {
			$user         = get_userdata( $comment->user_id );
			$comment_name = $user->display_name;
		} else {
			$comment_name = comment_author( $comment->comment_ID );
		}

		$user = wp_get_current_user();
		// we have a comment user id, and there is a logged in user right now
		if ( $comment->user_id && 0 !== $user->ID ) {
			return sprintf(
				'<a href="%1$s">%2$s</a>',
				site_url( '/users/' . $comment->user_id . '/' ),
				$comment_name
			);
		} else {
			return $comment_name;
		}
	}
endif;
