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
			$size      = $image_data['size'];
		}

		if ( post_password_required() || is_attachment() || ( ! isset( $image_id ) && ! isset( $image_url ) ) || empty( $image ) || false === $id ) {
			return;
		}

		$caption = wp_get_attachment_caption( $image_id );
		$credit  = get_media_credit_html( $image_id );

		if ( is_singular() && ! is_singular( 'newsletter' ) && ( ! isset( $attributes['location'] ) || 'related' !== $attributes['location'] ) ) : ?>
			<figure class="m-post-image m-post-image-<?php echo $size; ?>">
				<?php echo $image; ?>
				<?php if ( '' !== $caption || '' !== $credit ) { ?>
				<figcaption>
					<?php if ( '' !== $caption ) { ?>
						<div class="a-media-meta a-media-caption"><?php echo $caption; ?></div>
					<?php } ?>
					<?php if ( '' !== $credit ) { ?>
						<div class="a-media-meta a-media-credit"><?php echo $credit; ?></div>
					<?php } ?>
				</figcaption>
				<?php } ?>
			</figure><!-- .post-image -->
		<?php elseif ( is_singular( 'newsletter' ) ) : ?>
			<?php echo $image; ?>
		<?php else : ?>
			<a class="m-post-image m-post-thumbnail m-post-thumbnail-<?php echo $size; ?>" href="<?php the_permalink( $id ); ?>" aria-hidden="true">
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
			if ( 'full' === $size ) {
				$size = 'large';
			}
		} elseif ( is_home() && 'thumbnail' === $size ) {
			$size = 'thumbnail';
		} else {
			$size = $size;
		}

		if ( 'large' === $size ) {
			$image_url = get_post_meta( $id, '_mp_post_main_image', true );
			if ( is_home() && '' === $image_url ) {
				$image_url = get_post_meta( $id, '_mp_post_thumbnail_image', true );
			}
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
			} elseif ( is_home() && '' !== $thumbnail_image_id ) {
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
			$image_id  = '';
			$image_url = '';
		}

		// handle prevention of lazy loading
		$prevent_lazy_load = get_post_meta( $id, '_mp_prevent_lazyload', true );
		if ( 'on' === $prevent_lazy_load ) {
			$lazy_load = false;
		}
		if ( false === $lazy_load ) {
			if ( isset( $attributes['class'] ) ) {
				$attributes['class'] .= ' ';
			} else {
				$attributes['class'] = '';
			}
			$attributes['class']  .= 'no-lazy';
			$attributes['loading'] = 'eager';
		} else {
			$attributes['loading'] = 'lazy';
		}

		if ( '' !== wp_get_attachment_image( $image_id, $size ) ) {
			// this requires that the custom image sizes in custom-fields.php work correctly
			$image     = wp_get_attachment_image( $image_id, $size, false, $attributes );
			$image_url = wp_get_attachment_url( $image_id );
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
				if ( isset( $attributes['loading'] ) ) {
					$image .= ' loading="' . $attributes['loading'] . '"';
				}
				$image .= '>';
			}
		}

		if ( post_password_required() || is_attachment() || ( '' === $image_id && '' === $image_url ) ) {
			return;
		}

		$image_data = array(
			'image_id'  => $image_id,
			'image_url' => $image_url,
			'markup'    => $image,
			'size'      => $size,
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
	function minnpost_posted_on( $id = '', $time_ago = true ) {
		if ( '' === $id ) {
			$id = get_the_ID();
		}
		$date        = minnpost_get_posted_on( $id, $time_ago );
		$time_string = sprintf(
			'<time class="a-entry-date published updated" datetime="%1$s">%2$s</time>',
			$date['published']['machine'],
			$date['published']['human'],
		);
		echo $time_string;

	}
endif;

/**
* Get when the article was posted
*
* @param int $id
* @return string
*
*/
if ( ! function_exists( 'minnpost_get_posted_on' ) ) :
	/**
	 * Prints HTML with meta information for the current post-date/time and author.
	 */
	function minnpost_get_posted_on( $id = '', $time_ago = true ) {
		$posted_on = '';
		if ( '' === $id ) {
			$id = get_the_ID();
		}
		$hide_date = get_post_meta( $id, '_mp_remove_date_from_display', true );
		if ( 'on' === $hide_date ) {
			return $posted_on;
		}
		if ( function_exists( 'get_ap_date' ) ) {
			$date = array(
				'published' => array(
					'machine' => esc_attr( get_ap_date( 'c' ), $id ),
					'human'   => esc_html( get_ap_date( '', $id ) ),
				),
				'modified'  => array(
					'machine' => esc_attr( get_ap_modified_date( 'c' ), $id ),
					'human'   => esc_html( get_ap_modified_date( '', $id ) ),
				),
			);
		} else {
			$date = array(
				'published' => array(
					'machine' => esc_attr( get_the_date( 'c' ), $id ),
					'human'   => esc_html( get_the_date( '', $id ) ),
				),
				'modified'  => array(
					'machine' => esc_attr( get_the_modified_date( 'c' ), $id ),
					'human'   => esc_html( get_the_modified_date( '', $id ) ),
				),
			);
		}

		// override "today"
		if ( is_singular( 'newsletter' ) ) {
			// if it's a newsletter, use the date
			$date['published']['human'] = esc_html( get_the_date( 'F j, Y', $id ) );
			$date['modified']['human']  = esc_html( get_the_modified_date( 'F j, Y', $id ) );
		} elseif ( true && $time_ago && 'today' === $date['published']['human'] ) {
			// if it's not a newsletter, use the human readable time difference
			$date['published']['human'] = sprintf(
				// translators: 1) is the human readable time difference
				_x( '%1$s ago', '%2$s = human-readable time difference', 'minnpost-largo' ),
				human_time_diff(
					get_the_time( 'U' ),
					strtotime( wp_date( 'Y-m-d H:i:s' ) )
				)
			);
		}

		return $date;
	}
endif;

/**
* Output the author/authors who posted the article
* This depends on the Co-Authors Plus plugin
*
* @param int $id
* @param bool $include_title
*
*/
if ( ! function_exists( 'minnpost_posted_by' ) ) :
	function minnpost_posted_by( $id = '', $include_title = true ) {
		if ( '' === $id ) {
			$id = get_the_ID();
		}
		echo minnpost_get_posted_by( $id, $include_title );
	}
endif;

/**
* Get who posted the article
* This depends on the Co-Authors Plus plugin
*
* @param int $id
* @param bool $include_title
* @param bool $link_name
* @return string
*
*/
if ( ! function_exists( 'minnpost_get_posted_by' ) ) :
	function minnpost_get_posted_by( $id = '', $include_title = false, $link_name = false ) {
		if ( '' === $id ) {
			$id = get_the_ID();
		}
		$posted_by   = '';
		$hide_author = get_post_meta( $id, '_mp_remove_author_from_display', true );
		if ( 'on' === $hide_author ) {
			return $posted_by;
		}
		// is the basic byline field filled in?
		if ( ! empty( esc_html( get_post_meta( $id, '_mp_subtitle_settings_byline', true ) ) ) ) {
			return esc_html( get_post_meta( $id, '_mp_subtitle_settings_byline', true ) );
		} else {
			// we do not want to include the job title. does co-authors-plus exist?
			if ( false === $include_title && function_exists( 'coauthors_posts_links' ) ) {
				return 'By&nbsp;' . coauthors_posts_links( ', ', ' and ', null, null, false );
			} elseif ( true === $include_title && function_exists( 'get_coauthors' ) ) {
				// we do want to include the job title. co-authors-plus exists.
				$coauthors = get_coauthors( $id );
				if ( ! empty( $coauthors ) ) {
					$byline = esc_html__( 'By&nbsp;', 'minnpost-largo' );
					foreach ( $coauthors as $key => $coauthor ) {
						if ( true === $link_name ) {
							$name_display = '<a href="' . get_author_posts_url( $coauthor->ID, $coauthor->user_nicename ) . '" rel="author" class="a-entry-author">' . apply_filters( 'the_author', $coauthor->display_name ) . '</a>';
						} else {
							$name_display = '<span class="a-entry-author">' . apply_filters( 'the_author', $coauthor->display_name ) . '</span>';
						}
						// there is more than one author
						if ( 1 < sizeof( $coauthors ) ) {
							if ( array_key_first( $coauthors ) === $key ) {
								// we are at the beginning of the array
								$byline .= $name_display;
							} elseif ( array_key_last( $coauthors ) === $key ) {
								// we are at the end of the array
								$byline .= ' and ' . $name_display;
							} else {
								// we are in the middle of the array
								$byline .= ', ' . $name_display;
							}
						} else {
							// there is only one author. showing the title works here.
							if ( true === $include_title && isset( get_the_coauthor_meta( 'job-title' )[ $coauthor->ID ] ) ) {
								$title = get_the_coauthor_meta( 'job-title' )[ $coauthor->ID ];
								if ( '' !== $title ) {
									$name_display .= '&nbsp;|&nbsp;<span class="a-entry-author-job-title">' . $title . '</span>';
								}
							}
							$byline .= $name_display;
						}
					}
					// display the post-author field if it has a value
					if ( ! empty( esc_html( get_post_meta( $id, '_mp_subtitle_settings_after_authors', true ) ) ) ) {
						$byline .= '&nbsp;|&nbsp;<span class="a-entry-author-finish-text">' . esc_html( get_post_meta( $id, '_mp_subtitle_settings_after_authors', true ) ) . '</span>';
					}
					return $byline;
				}
			} else {
				// default byline from WordPress core
				return 'By&nbsp;<a href="' . get_the_author_posts_url( get_the_author_meta( 'ID' ) ) . '">' . the_author( $id ) . '</a>';
			}
		}
		return $posted_by;
	}
endif;

/*add_filter( 'the_author', 'minnpost_largo_author_display_name' );
function minnpost_largo_author_display_name( $name ) {
	if ( '' !== get_the_author_meta( 'job-title' ) ) {
		$name .= '&nbsp;|&nbsp;' . get_the_author_meta( 'job-title' );
	}
	return $name;
}*/

/**
* Output the share buttons for top or bottom
*
* @param int $id
*
*/
if ( ! function_exists( 'minnpost_share_buttons' ) ) :
	function minnpost_share_buttons( $id = '' ) {
		if ( '' === $id ) {
			$id = get_the_ID();
		}
		$display_share = true;
		$share_url     = urlencode( get_current_url() );
		$share_excerpt = minnpost_largo_get_description();
		$share_title   = minnpost_largo_get_title();
		?>
		<ul class="m-entry-share m-entry-share-top">
			<li class="a-share a-share-facebook">
				<a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo $share_url; ?>" aria-label="<?php echo __( 'Share this article on Facebook.', 'minnpost-largo' ); ?>" data-share-action="<?php echo __( 'Facebook', 'minnpost-largo' ); ?>">
					<i class="fab fa-facebook-f" aria-hidden="true"></i>
				</a>
			</li>
			<li class="a-share a-share-twitter">
				<a href="https://twitter.com/intent/tweet?via=MinnPost&text=<?php echo $share_excerpt; ?>&url=<?php echo $share_url; ?>" aria-label="<?php echo __( 'Share this article on Twitter.', 'minnpost-largo' ); ?>" data-share-action="<?php echo __( 'Twitter', 'minnpost-largo' ); ?>">
					<i class="fab fa-twitter" aria-hidden="true"></i>
				</a>
			</li>
			<li class="a-share a-share-email">
				<a href="mailto:?subject=<?php echo $share_title; ?>&body=<?php echo $share_url; ?>" aria-label="<?php echo __( 'Email this article.', 'minnpost-largo' ); ?>" data-share-action="<?php echo __( 'Email', 'minnpost-largo' ); ?>">
					<i class="far fa-envelope" aria-hidden="true"></i>
				</a>
			</li>
			<li class="a-share a-share-print">
				<a href="#" aria-label="<?php echo __( 'Print this article.', 'minnpost-largo' ); ?>" data-share-action="<?php echo __( 'Print', 'minnpost-largo' ); ?>">
					<i class="fas fa-print"></i>
				</a>
			</li>
			<li class="a-share a-share-copy-url">
				<a href="#" aria-label="<?php echo __( 'Copy the article link to your clipboard.', 'minnpost-largo' ); ?>" data-share-action="<?php echo __( 'Copy', 'minnpost-largo' ); ?>" data-tlite="<?php echo __( 'Link copied', 'minnpost-largo' ); ?>">
					<i class="fas fa-link"></i>
				</a>
			</li>
			<?php if ( class_exists( 'Republication_Tracker_Tool' ) ) : ?>
				<li class="a-share a-share-republish">
					<a href="" aria-label="<?php echo __( 'Republish this article.', 'minnpost-largo' ); ?>" data-share-action="<?php echo __( 'Republish', 'minnpost-largo' ); ?>">
						<i class="fab fa-creative-commons"></i>
					</a>
				</li>
			<?php endif; ?>
		</ul>
		<?php
	}
endif;

/**
* Output the manually picked related stories for a post
*
* @see inc/jetpack.php for automated related stories
* @param string $type
*
*/
if ( ! function_exists( 'minnpost_related' ) ) :
	function minnpost_related( $type = 'content' ) {
		$related_ids = minnpost_get_related( $type );
		if ( ! empty( $related_ids ) ) :
			?>
		<h3 class="a-related-title a-related-title-<?php echo $type; ?>">
			<?php if ( '' !== get_post_meta( get_the_ID(), '_mp_related_content_label', true ) ) : ?>
				<?php echo get_post_meta( get_the_ID(), '_mp_related_content_label', true ); ?>
			<?php else : ?>
				<?php echo esc_html__( 'Read these stories next', 'minnpost-largo' ); ?>
			<?php endif; ?>
		</h3>
		<ul class="a-related-list a-related-list-<?php echo $type; ?>">
			<?php
			global $post;
			foreach ( $related_ids as $id ) :
				$post = get_post( $id );
				setup_postdata( $post );
				get_template_part( 'template-parts/related-post', $type );
			endforeach;
			wp_reset_postdata();
			?>
		</ul>
			<?php
		endif;
	}
endif;

/**
* Get the related stories for a post
*
* @param string $type
* @return array $related
*
*/
if ( ! function_exists( 'minnpost_get_related' ) ) :
	function minnpost_get_related( $type = 'content' ) {
		$related = array();
		if ( ! empty( get_post_meta( get_the_ID(), '_mp_related_' . $type, true ) ) ) {
			$ids = get_post_meta( get_the_ID(), '_mp_related_' . $type, true );
			if ( ! is_array( $ids ) ) {
				$related = explode( ',', esc_html( $ids ) );
			} else {
				$related = $ids;
			}
		}
		return $related;
	}
endif;

/**
* Display the related terms a post should link to
*
*/
if ( ! function_exists( 'minnpost_related_terms' ) ) :
	function minnpost_related_terms() {
		$related_terms = minnpost_get_related_terms();
		if ( isset( $related_terms['category'] ) || isset( $related_terms['tag'] ) ) :
			?>
			<?php if ( isset( $related_terms['category'] ) ) : ?>
				<h3 class="a-related-title a-related-title-category">
					<a href="<?php echo esc_url( get_category_link( $related_terms['category']['term_id'] ) ); ?>">
						<?php
						echo sprintf(
							// translators: 1 is the category name
							esc_html__( 'More %1$s articles' ),
							$related_terms['category']['name']
						);
						?>
					</a>
				</h3>
			<?php endif; ?>
			<?php if ( isset( $related_terms['tag'] ) ) : ?>
				<h3 class="a-related-title a-related-title-tag">
					<a href="<?php echo esc_url( get_tag_link( $related_terms['tag']['term_id'] ) ); ?>">
						<?php
						echo sprintf(
							// translators: 1 is the tag name
							esc_html__( 'More %1$s articles' ),
							$related_terms['tag']['name']
						);
						?>
					</a>
				</h3>
			<?php endif; ?>
			<?php
		endif;
	}
endif;

/**
* Get the related terms a post should link to
*
* @return array $related_terms
*
*/
if ( ! function_exists( 'minnpost_get_related_terms' ) ) :
	function minnpost_get_related_terms() {
		$related_terms    = array();
		$related_category = get_post_meta( get_the_ID(), '_mp_related_category', true );
		$related_tag      = get_post_meta( get_the_ID(), '_mp_related_tag', true );
		if ( '' !== $related_category || '' !== $related_tag ) {
			if ( '' !== $related_category ) {
				$related_terms['category'] = get_category( $related_category, ARRAY_A );
			}
			if ( '' !== $related_tag ) {
				$related_terms['tag'] = get_tag( $related_tag, ARRAY_A );
			}
		}
		return $related_terms;
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
	function minnpost_author_figure( $author_id = '', $size = 'photo', $include_text = true, $include_name = false, $lazy_load = true ) {
		$output = minnpost_get_author_figure( $author_id, $size, $include_text, $include_name, $lazy_load );
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
	function minnpost_get_author_figure( $author_id = '', $size = 'photo', $include_text = true, $include_name = false, $lazy_load = true ) {

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

		// Make sure the guest author actually exists
		if ( class_exists( 'CoAuthors_Guest_Authors' ) ) {
			$guest_authors = new CoAuthors_Guest_Authors;
			$guest_author  = $guest_authors->get_guest_author_by( 'ID', (int) $author_id );
			if ( ! $guest_author ) {
				$count = 0;
			} else {
				// get post count
				global $coauthors_plus;
				$count = $coauthors_plus->get_guest_author_post_count( $guest_author );
			}
		} else {
			$count = 0;
		}

		if ( is_singular() || is_archive() ) {
			$output  = '';
			$output .= '<figure class="a-archive-figure a-author-figure a-author-figure-' . $size . '">';
			$output .= $image;
			if ( true === $include_text && ( '' !== $text || '' !== $name ) ) {
				$output .= '<figcaption>';
				if ( true === $include_name && '' !== $name ) {
					$output .= '<h3 class="a-author-title">';
					if ( 0 < $count ) {
						$author_url = get_author_posts_url( $author_id, sanitize_title( $name ) );
						$output    .= '<a href="' . $author_url . '">';
					}
					$output .= $name;
					if ( 0 < $count ) {
						$output .= '</a>';
					}
					$output .= '</h3>';
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
	function minnpost_get_author_image( $author_id = '', $size = 'photo', $lazy_load = true ) {

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

		// handle prevention of lazy loading
		$prevent_lazy_load = get_post_meta( $author_id, '_mp_prevent_lazyload', true );
		if ( 'on' === $prevent_lazy_load ) {
			$lazy_load = false;
		}
		$attributes = array();
		if ( false === $lazy_load ) {
			if ( isset( $attributes['class'] ) ) {
				$attributes['class'] .= ' ';
			}
			$attributes['class'] .= 'no-lazy';
		}

		if ( '' !== wp_get_attachment_image( $image_id, $size ) ) {
			// this requires that the custom image sizes in custom-fields.php work correctly
			$image     = wp_get_attachment_image( $image_id, $size, false, $attributes );
			$image_url = wp_get_attachment_url( $image_id );
		} else {
			$alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
			if ( isset( $attributes['class'] ) ) {
				$class = ' class="' . $attributes['class'] . '"';
			} else {
				$class = '';
			}
			$image = '<img src="' . $image_url . '" alt="' . $alt . $class . '">';
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
* Returns array of grouped categories for the given category
*
* @param int $category_id
* @return array $groupd_categories
*
*/
if ( ! function_exists( 'minnpost_get_grouped_categories' ) ) :
	function minnpost_get_grouped_categories( $category_id = '' ) {
		$grouped_categories = get_term_meta( $category_id, '_mp_category_grouped_categories', false );
		if ( array() !== $grouped_categories ) {
			error_log( 'grouped is ' . print_r( $grouped_categories, true ) );
		}
		return $grouped_categories;
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
	function minnpost_term_figure( $category_id = '', $size = 'feature', $include_text = true, $include_name = false, $link_on = 'title', $lazy_load = true ) {
		$output = minnpost_get_term_figure( $category_id, $size, $include_text, $include_name, $link_on, $lazy_load );
		echo $output;
	}
endif;

/**
* Returns term image, large or thumbnail, with/without the description or excerpt, all inside a <figure>
*
* @param int $category_id
* @param string $size
* @param bool $include_text
* @param bool $include_name
* @param string $link_on
* @param bool $lazy_load
* @param array $attributes
* @return string $output
*
*/
if ( ! function_exists( 'minnpost_get_term_figure' ) ) :
	function minnpost_get_term_figure( $category_id = '', $size = 'feature', $include_text = true, $include_name = false, $link_on = 'title', $lazy_load = true, $attributes = array() ) {

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
		$credit  = get_media_credit_html( $image_id );

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
* @param bool $lazy_load
* @param array $attributes
* @return array $image_data
*
*/
if ( ! function_exists( 'minnpost_get_term_image' ) ) :
	function minnpost_get_term_image( $category_id = '', $size = 'feature', $lazy_load = true, $attributes = array() ) {
		$image_url = get_term_meta( $category_id, '_mp_category_main_image', true );
		if ( 'feature' !== $size ) {
			$image_url = get_term_meta( $category_id, '_mp_category_' . $size . '_image', true );
			$image_id  = get_term_meta( $category_id, '_mp_category_' . $size . '_image_id', true );
		}

		if ( ! isset( $image_id ) ) {
			$image_id = get_term_meta( $category_id, '_mp_category_main_image_id', true );
		}

		if ( post_password_required() || is_attachment() || ( ! $image_id && ! $image_url ) ) {
			return '';
		}

		// handle prevention of lazy loading
		$prevent_lazy_load = get_term_meta( $category_id, '_mp_prevent_lazyload', true );
		if ( 'on' === $prevent_lazy_load ) {
			$lazy_load = false;
		}
		if ( false === $lazy_load ) {
			if ( isset( $attributes['class'] ) ) {
				$attributes['class'] .= ' ';
			}
			$attributes['class'] .= 'no-lazy';
		}

		if ( '' !== wp_get_attachment_image( $image_id, $size ) ) {
			// this requires that the custom image sizes in custom-fields.php work correctly
			$image     = wp_get_attachment_image( $image_id, $size, false, $attributes );
			$image_url = wp_get_attachment_url( $image_id );
		} else {
			$alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
			if ( isset( $attributes['class'] ) ) {
				$class = ' class="' . $attributes['class'] . '"';
			} else {
				$class = '';
			}
			$image = '<img src="' . $image_url . '" alt="' . $alt . $class . '">';
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
		$list_item = minnpost_get_term_extra_links( $category_id );
	}
endif;

/**
* Gets and returns any additional links for the term archive page (rss, twitter, etc.)
*
* @param int $category_id
* @return string $list_item
*
*/
if ( ! function_exists( 'minnpost_get_term_extra_links' ) ) :
	function minnpost_get_term_extra_links( $category_id = '' ) {
		$list_item = '';
		$link      = get_term_meta( $category_id, '_mp_category_excerpt_links', true );
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
			$list_item = '<li' . $class . '><a href="' . $url_prefix . $link['url'] . '">' . $link['text'] . '</a></li>';
		}
		return $list_item;
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
			comments_popup_link(
				sprintf(
					wp_kses(
						/* translators: %s: post title */
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

		$sidebar = wpautop( get_post_meta( $post_id, '_mp_post_sidebar', true ) );
		if ( null !== $sidebar && '' !== $sidebar ) {
			echo '<section id="post-sidebar" class="m-post-sidebar">' . $sidebar . '</section>';
		}
	}
endif;

/**
* Outputs HTML for the category breadcrumb
*
* @param int $post_id
* @param bool $show_group
*
*/
if ( ! function_exists( 'minnpost_category_breadcrumb' ) ) :
	function minnpost_category_breadcrumb( $post_id = '', $show_group = true ) {

		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}
		$category_id       = minnpost_get_permalink_category_id( $post_id );
		$category_group_id = '';
		if ( '' !== $category_id ) {
			$category      = get_category( $category_id );
			$category_link = get_category_link( $category );
			if ( true === $show_group ) {
				$category_group_id = get_term_meta( $category_id, '_mp_category_group', true );
				if ( '' !== $category_group_id ) {
					echo '<div class="a-breadcrumbs">';
					$category_group = get_category( $category_group_id );
					echo '<div class="a-breadcrumb a-category-group a-category-group-' . sanitize_title( $category_group->slug ) . '"><a href="' . esc_url( get_category_link( $category_group->term_id ) ) . '">' . $category_group->name . '</a></div>';
				}
			}
			$category_name = $category->name;
			echo '<div class="a-breadcrumb a-category-name"><a href="' . $category_link . '">' . $category_name . '</a></div>';
		}
		if ( '' !== $category_group_id ) {
			echo '</div>';
		}
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
		$category_name = '';
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}

		$hide_category = get_post_meta( $post_id, '_mp_remove_category_from_display', true );
		if ( 'on' === $hide_category ) {
			return $category_name;
		}

		$category_id = minnpost_get_permalink_category_id( $post_id );
		if ( '' !== $category_id ) {
			$category = get_category( $category_id );
		}

		if ( isset( $category->name ) ) {
			$category_name = $category->name;
		}

		return $category_name;
	}
endif;

/**
* Returns the category ID for a post's permalink category
*
* @param int $post_id
* @return int $category_id
*
*/
if ( ! function_exists( 'minnpost_get_permalink_category_id' ) ) :
	function minnpost_get_permalink_category_id( $post_id = '' ) {
		$category_id = '';
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}
		$category_permalink = get_post_meta( $post_id, '_category_permalink', true );
		if ( null !== $category_permalink && '' !== $category_permalink ) {
			if ( isset( $category_permalink['category'] ) && '' !== $category_permalink['category'] ) {
				$category_id = $category_permalink['category'];
			} else {
				$categories  = get_the_category();
				$category_id = isset( $categories[0] ) ? $categories[0]->term_id : '';
			}
		} else {
			$categories = get_the_category();
			if ( isset( $categories[0] ) && is_object( $categories[0] ) && ! is_wp_error( $categories[0] ) ) {
				$category_id = $categories[0]->term_id;
			}
		}
		return $category_id;
	}
endif;

/**
* Replace category text at the top of a post
*
* @param int $post_id
* @return string $pre_title_text
*
*/
if ( ! function_exists( 'minnpost_get_replace_category_text' ) ) :
	function minnpost_get_replace_category_text( $post_id = '' ) {
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}
		$replace_category_text = get_post_meta( $post_id, '_mp_replace_category_text', true );
		return $replace_category_text;
	}
endif;

/**
* Outputs HTML for pre title text
*
* @param int $post_id
*
*/
if ( ! function_exists( 'minnpost_replace_category_text' ) ) :
	function minnpost_replace_category_text( $post_id = '' ) {
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}
		$replace_category_text = minnpost_get_replace_category_text( $post_id );
		if ( '' !== $replace_category_text ) {
			echo '<div class="a-breadcrumb">' . $replace_category_text . '</div>';
		}
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
			$category_id = minnpost_get_permalink_category_id( $post_id );
			if ( '' === $category_id ) {
				return '';
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
* Outputs HTML for deck
*
* @param int $post_id
*
*/
if ( ! function_exists( 'minnpost_deck' ) ) :
	function minnpost_deck( $post_id = '' ) {
		$deck = minnpost_get_deck( $post_id );
		echo $deck;
	}
endif;

/**
* Returns the deck, if it exists
*
* @param int $post_id
* @param int $category_id
* @return string
*
*/
if ( ! function_exists( 'minnpost_get_deck' ) ) :
	function minnpost_get_deck( $post_id = '' ) {
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}
		$deck = get_post_meta( $post_id, '_mp_subtitle_settings_deck', true );
		if ( ! empty( $deck ) ) {
			return '<div class="m-entry-meta m-entry-meta-deck">' . $deck . '</div>';
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
	function minnpost_plus_icon( $post_id = '', $lazy_load = true ) {
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}
		if ( false === $post_id ) {
			return;
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

			// handle prevention of lazy loading
			$prevent_lazy_load = get_post_meta( $post_id, '_mp_prevent_lazyload', true );
			if ( 'on' === $prevent_lazy_load ) {
				$lazy_load = false;
			}

			if ( false === $lazy_load ) {
				$class = 'no-lazy';
			} else {
				$class = '';
			}

			$image = '<img src="' . get_theme_file_uri() . '/assets/img/MinnPostPlusLogo.png' . '" alt="MinnPostPlus"' . $class . '>';

			echo '<div class="a-minnpost-plus">' . $image . '</div>';
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
add_filter(
	'get_the_archive_title',
	function( $title ) {
		if ( is_category() ) {
			$title = single_cat_title( '', false );
		} elseif ( is_tag() ) {
			$title = single_tag_title( '', false );
		} elseif ( is_author() ) {
			$title = '<span class="vcard">' . get_the_author() . '</span>';
		}
		return $title;
	}
);

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
		libxml_use_internal_errors( true );
		$promo_dom->loadHTML( $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_use_internal_errors( false );
		$imgs = $promo_dom->getElementsByTagName( 'img' );
		foreach ( $imgs as $img ) {
			$img->setAttribute( 'style', 'border: 0 none; display: block; height: auto; line-height: 100%; Margin-left: auto; Margin-right: auto; outline: none; text-decoration: none; max-width: 100%;' );
		}
		$promo_xpath = new DOMXpath( $promo_dom );
		$promo_div   = $promo_xpath->query( "//div[contains(concat(' ', @class, ' '), ' image ')]/div" );

		$dom = new DomDocument;
		libxml_use_internal_errors( true );
		$dom->loadHTML( $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_use_internal_errors( false );
		$xpath = new DOMXpath( $dom );
		$divs  = $xpath->query( "//div[contains(concat(' ', @class, ' '), ' story ')]" );

		$ad_dom = new DomDocument;

		libxml_use_internal_errors( true );
		$ad_dom->loadHTML( $news_right_top, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_use_internal_errors( false );
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
