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

		if ( is_singular() && ! is_singular( 'newsletter' ) && ( ! isset( $attributes['location'] ) || ( 'interest' !== $attributes['location'] && 'related' !== $attributes['location'] ) ) ) : ?>
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
			<a class="m-post-image m-post-thumbnail m-post-thumbnail-<?php echo $size; ?>" href="<?php the_permalink( $id ); ?>">
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

		// defaults
		$image_id  = '';
		$image_url = '';

		// large is the story detail image. this is a built in size in WP
		// home has its own size field
		if ( is_home() && 'feature' === $size || 'feature-large' === $size ) {
			$size = esc_html( get_post_meta( $id, '_mp_post_homepage_image_size', true ) );
		} elseif ( is_home() && 'thumbnail' === $size ) {
			$size = 'thumbnail';
		} else {
			$size = $size;
		}

		if ( 'large' === $size || 'full' === $size ) {
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

		if ( 'large' === $size || 'full' === $size ) {
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

		// set up lazy load attributes
		$attributes = apply_filters( 'minnpost_largo_lazy_load_attributes', $attributes, $id, 'post', $lazy_load );

		if ( '' !== $image_id && '' !== wp_get_attachment_image( $image_id, $size ) ) {
			// this requires that the custom image sizes in custom-fields.php work correctly
			$image     = wp_get_attachment_image( $image_id, $size, false, $attributes );
			$image_url = wp_get_attachment_url( $image_id );
		} else {
			if ( is_singular( 'newsletter' ) ) {
				$image = minnpost_largo_manual_image_tag( $image_id, $image_url, $attributes, 'newsletter' );
			} else {
				$image = minnpost_largo_manual_image_tag( $image_id, $image_url, $attributes );
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
		$date = minnpost_get_posted_on( $id, $time_ago );
		if ( '' === $date ) {
			return;
		}
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
* Get the AP date from a date string
*
* @return string $date_string
* @return string $date
*
*/
if ( ! function_exists( 'minnpost_largo_get_ap_date' ) ) :
	function minnpost_largo_get_ap_date( $date_string ) {
		$date_time = new DateTime( $date_string );
		if ( function_exists( 'get_ap_date' ) ) {
			$month   = $date_time->format( 'm' );
			$ap_year = $date_time->format( 'Y' );
			$ap_day  = $date_time->format( 'j' );
			switch ( $month ) {
				case '01':
					$ap_month = 'Jan.';
					break;
				case '02':
					$ap_month = 'Feb.';
					break;
				case '08':
					$ap_month = 'Aug.';
					break;
				case '09':
					$ap_month = 'Sept.';
					break;
				case '10':
					$ap_month = 'Oct.';
					break;
				case '11':
					$ap_month = 'Nov.';
					break;
				case '12':
					$ap_month = 'Dec.';
					break;
				default:
					$ap_month = $date_time->format( 'F' );
					break;
			}
			$date = $ap_month . ' ' . $ap_day . ', ' . $ap_year;
		} else {
			$date_format = get_option( 'date_format', 'c' );
			$date        = $date_time->format( $date_format );
		}
		return $date;
	}
endif;

/**
* Get the AP time from a time string
*
* @return string $time_string
* @return string $time
*
*/
if ( ! function_exists( 'minnpost_largo_get_ap_time' ) ) :
	function minnpost_largo_get_ap_time( $time_string ) {
		$date_time = new DateTime( $time_string );
		if ( function_exists( 'get_ap_time' ) ) {
			$capnoon    = get_option( 'ap_capnoon' );
			$meridian   = $date_time->format( 'a' );
			$ap_hour_12 = $date_time->format( 'g' );
			$ap_minute  = $date_time->format( 'i' );
			$ap_time_24 = $date_time->format( 'H:i' );
			$ap_time_12 = $date_time->format( 'g:i' );

			// Format am and pm to AP Style abbreviations
			if ( 'am' === $meridian ) {
				$meridian = 'a.m.';
			} elseif ( 'pm' === $meridian ) {
				$meridian = 'p.m.';
			}

			// Reformat 12:00 and 00:00 to noon and midnight
			if ( '00:00' === $ap_time_24 ) {
				if ( 'true' === $capnoon ) {
					$time = 'Midnight';
				} else {
					$time = 'midnight';
				}
			} elseif ( '12:00' === $ap_time_24 ) {
				if ( 'true' === $capnoon ) {
					$time = 'Noon';
				} else {
					$time = 'noon';
				}
			} elseif ( '00' === $ap_minute ) {
				$time = $ap_hour_12 . ' ' . $meridian;
			} else {
				$time = $ap_time_12 . ' ' . $meridian;
			}
		} else {
			$date_format = get_option( 'date_format', 'c' );
			$time        = $date_time->format( $date_format );
		}
		return $time;
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
	function minnpost_posted_by( $id = '', $include_title = true, $link_name = true ) {
		if ( '' === $id ) {
			$id = get_the_ID();
		}
		echo minnpost_get_posted_by( $id, $include_title, $link_name );
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
					// display the post-author field if it has a value and if there were multiple authors
					if ( 1 < sizeof( $coauthors ) && ! empty( esc_html( get_post_meta( $id, '_mp_subtitle_settings_after_authors', true ) ) ) ) {
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
* Output the share buttons
*
* @param int $post_id
*
*/
if ( ! function_exists( 'minnpost_share_buttons' ) ) :
	function minnpost_share_buttons( $post_id = '' ) {
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}

		// don't show share buttons if instructed
		$hide_share_buttons = get_post_meta( $post_id, '_mp_remove_share_buttons_from_display', true );
		if ( 'on' === $hide_share_buttons ) {
			return;
		}

		$layout_class = '';

		// keep share buttons horizontal if instructed
		$share_buttons_always_horizontal = get_post_meta( $post_id, '_mp_share_buttons_always_horizontal', true );
		if ( 'on' === $share_buttons_always_horizontal ) {
			$layout_class .= ' m-entry-share-horizontal';
		}

		$share_url     = urlencode( get_current_url() );
		$share_excerpt = minnpost_largo_get_description();
		$share_title   = minnpost_largo_get_title();
		?>
		<ul class="m-entry-share m-entry-share-top<?php echo $layout_class; ?>">
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
				<?php
				// INN will have a template tag we can use to display the button in the next plugin release.
				?>
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
	function minnpost_related( $type = 'content', $only_show_images_if_not_missing = false ) {
		if ( 'automated' === $type && function_exists( 'minnpost_largo_get_jetpack_results' ) ) {
			$related_posts = minnpost_largo_get_jetpack_results();
		} else {
			$related_ids   = minnpost_get_related( $type );
			$related_posts = array();
			foreach ( $related_ids as $id ) {
				$related_posts[] = get_post( $id );
			}
		}
		if ( ! empty( $related_posts ) ) :
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
			$image_size = 'feature-medium';
			if ( true === $only_show_images_if_not_missing ) {
				$show_image = true;
				foreach ( $related_posts as $post ) {
					setup_postdata( $post );
					$image_data = get_minnpost_post_image( $image_size, array(), $post->id, true );
					if ( empty( $image_data ) ) {
						$show_image = false;
						break;
					}
				}
			}
			foreach ( $related_posts as $post ) :
				setup_postdata( $post );
				include(
					locate_template(
						array(
							'template-parts/related-post-' . $type . '.php',
							'template-parts/related-post.php',
						)
					)
				);
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
		if ( ( isset( $related_terms['category'] ) && ! is_wp_error( $related_terms['category'] ) ) || ( isset( $related_terms['tag'] ) && ! is_wp_error( $related_terms['tag'] ) ) ) :
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
		if ( '' !== $related_category ) {
			$related_terms['category'] = get_category( $related_category, ARRAY_A );
		} else {
			$permalink_category        = minnpost_get_permalink_category_id( get_the_ID() );
			$related_terms['category'] = get_category( $permalink_category, ARRAY_A );
		}
		if ( '' !== $related_tag ) {
			$related_terms['tag'] = get_tag( $related_tag, ARRAY_A );
		}
		return $related_terms;
	}
endif;

/**
* Outputs author image, large or thumbnail, with/without the bio or excerpt bio, all inside a <figure>
*
* @param int $author_id
* @param string $photo_size
* @param string $text_field
* @param bool $include_text
* @param bool $include_name
* @param bool $include_title
* @param bool $lazy_load
* @param bool $end
*
*/
if ( ! function_exists( 'minnpost_author_figure' ) ) :
	function minnpost_author_figure( $author_id = '', $photo_size = 'photo', $text_field = 'excerpt', $include_text = true, $name_field = 'display_name', $include_name = false, $title_field = 'job-title', $include_title = true, $lazy_load = true, $end = false ) {
		$output = minnpost_get_author_figure( $author_id, $photo_size, $text_field, $include_text, $name_field, $include_name, $title_field, $include_title, $lazy_load, $end );
		echo $output;
	}
endif;

/**
* Get author image, large or thumbnail, with/without the bio or excerpt bio, all inside a <figure>
*
* @param int $author_id
* @param string $photo_size
* @param string $text_field
* @param bool $include_text
* @param bool $include_name
* @param bool $include_title
* @param bool $lazy_load
* @param bool $end
*
* @return string $output
*
*/
if ( ! function_exists( 'minnpost_get_author_figure' ) ) :
	/**
	 * Returns author image, large or thumbnail, with/without the bio or excerpt bio, all inside a <figure>
	 */
	function minnpost_get_author_figure( $author_id = '', $photo_size = 'photo', $text_field = 'excerpt', $include_text = true, $name_field = 'display_name', $include_name = false, $title_field = 'job-title', $include_title = true, $lazy_load = true, $end = false ) {

		// some empty defaults
		$image_id  = '';
		$image_url = '';
		$image     = '';
		$text      = '';
		$name      = '';
		$title     = '';

		// default job title
		$default_title = esc_html__( 'About the author', 'minnpost-largo' );

		// in drupal there was only one author image size
		if ( '' === $author_id ) {
			$author_id = get_the_author_meta( 'ID' );
		}

		$image_data = minnpost_get_author_image( $author_id, $photo_size );
		if ( '' !== $image_data ) {
			$image_id  = $image_data['image_id'];
			$image_url = $image_data['image_url'];
			$image     = $image_data['markup'];
		}

		if ( 'excerpt' === $text_field ) { // excerpt
			$text .= get_post_meta( $author_id, '_mp_author_excerpt', true );
		} elseif ( '' !== get_post_meta( $author_id, $text_field, true ) ) { // the field exists
			$text = get_post_meta( $author_id, $text_field, true );
		} else { // full text
			$text = get_post_meta( $author_id, '_mp_author_bio', true );
		}

		if ( post_password_required() || is_attachment() || ( '' === $image_id && '' === $image_url && '' === $text ) ) {
			return;
		}

		if ( 'display_name' === $name_field ) { // name
			$name = get_post_meta( $author_id, 'cap-display_name', true );
		} elseif ( '' !== get_post_meta( $author_id, $name_field, true ) ) { // the field exists
			$name = get_post_meta( $author_id, $name_field, true );
		}

		if ( '' !== get_post_meta( $author_id, $title_field, true ) ) { // the field exists
			$title = get_post_meta( $author_id, $title_field, true );
		}

		$text = wpautop( $text ); // for some reason the paragraphs don't work without this
		$text = apply_filters( 'the_content', $text );

		if ( '' !== $image_id ) {
			$caption = wp_get_attachment_caption( $image_id );
			$credit  = get_media_credit_html( $image_id );
		}

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

		if ( ( is_singular() || is_archive() ) && ! is_singular( 'newsletter' ) ) {
			$output = '';
			if ( '' !== $image ) {
				$output .= '<figure class="a-archive-figure a-author-figure a-author-figure-' . $photo_size . '">';
				$output .= $image;
			}
			if ( true === $include_text && ( '' !== $text || '' !== $name ) ) {
				if ( '' !== $image ) {
					$output .= '<figcaption class="a-author-bio">';
				} else {
					$output .= '<div class="a-author-bio">';
				}
				if ( true === $include_name && '' !== $name ) {
					$output .= '<h3 class="a-author-title">';
					if ( 1 < $count ) {
						// at least as of July 2020, co-authors-plus never returns a count of zero
						// see this github issue: https://github.com/Automattic/Co-Authors-Plus/issues/740
						// we can update this code if that situation ever changes
						$author_url = get_author_posts_url( $author_id, sanitize_title( $name ) );
						$output    .= '<a href="' . $author_url . '">';
					}
					$output .= $name;
					if ( 0 < $count ) {
						$output .= '</a>';
					}
					if ( is_single() && '' === $title ) { // if this is a byline on a story, do the default title
						// default job title
						$title = $default_title;
					}
					if ( true === $include_title && '' !== $title ) {
						$output .= '&nbsp;|&nbsp;<span class="a-entry-author-job-title">' . $title . '</span>';
					}
					$output .= '</h3>';
				} elseif ( '' !== $name ) {
					if ( 0 < $count ) {
						$title = '';
						if ( true === $include_title && isset( get_the_coauthor_meta( 'job-title', $author_id )[ $author_id ] ) && '' !== get_the_coauthor_meta( 'job-title', $author_id )[ $author_id ] ) {
							$title = get_the_coauthor_meta( 'job-title', $author_id )[ $author_id ];
						} elseif ( true === $include_title ) {
							$title = $default_title;
						}
						if ( '' !== $title ) {
							$output .= '<h3 class="a-author-figure-job-title">' . $title . '</h3>';
						}
						if ( is_single() ) {
							$author_url = get_author_posts_url( $author_id, sanitize_title( $name ) );
							$text      .= sprintf(
								// translators: 1) author archive url, 2) author name
								'<p class="a-more-by-author"><a href="%1$s">' . esc_html__( 'More articles by %2$s', 'minnpost-largo' ) . '</a></p>',
								esc_url( $author_url ),
								$name
							);
						}
					}
				}
				$output .= $text;
				if ( '' !== $image ) {
					$output .= '</figcaption>';
				} else {
					$output .= '</div>';
				}
			}
			if ( '' !== $image ) {
				$output .= '</figure><!-- .author-figure -->';
			}
			return $output;
		} elseif ( is_singular( 'newsletter' ) ) {
			$output    = '';
			$lazy_load = false;
			$margin    = '';
			if ( false === $end ) {
				$margin = 'border-bottom: 2px solid #cccccf; padding-bottom: 15px; Margin-bottom: 20px; ';
			}
			$output .= '
			<div class="author" style="display: block; ' . $margin . 'width: 100%;">
					<!--[if (gte mso 9)|(IE)]>
						<table cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td width="25%" valign="top">
					<![endif]-->
				<div class="column photo" style="display: inline-block; Margin-right: 0; max-width: 95px; vertical-align: top; width: 100%">
					<table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0;">
							<tr>
								<td class="inner" style="border-collapse: collapse; font-size: 0; line-height: 0px; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; vertical-align: top" valign="top">
									<table cellpadding="0" cellspacing="0" class="contents" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; font-size: 16px; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; text-align: left; width: 100%">
									<tr>
										<td style="border-collapse: collapse; font-size: 0; line-height: 0px; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; vertical-align: top" valign="top">' . $image . '</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</div>';
			$output .= '<!--[if (gte mso 9)|(IE)]>
				</td><td width="75%" valign="top">
			<![endif]-->';
			$output .= '<div class="column bio" style="display: inline-block; Margin-right: 0; max-width: 75%; vertical-align: top; width: 100%">
					<table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0">
						<tr>
							<td class="inner" style="border-collapse: collapse; font-family: Helvetica, Arial, Geneva, sans-serif; font-size: 16px; font-weight: normal; line-height: 100%; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; text-align: right; vertical-align: top; width: 100%" align="right" valign="top">
								<table cellpadding="0" cellspacing="0" class="contents" style="border-collapse: collapse; border-spacing: 0; color: #1a1818; font-family: Helvetica, Arial, Geneva, sans-serif; font-size: 16px; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; text-align: left; width: 100%">
									<tr>
										<td class="text" style="border-collapse: collapse; font-family: Georgia, &quot;Times New Roman&quot;, Times, serif; font-size: 16px; line-height: 20.787px; Margin: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0; text-align: left; vertical-align: top; width: 100%" align="right" valign="top">';
			if ( true === $include_name && '' !== $name ) {
				$output .= '<h3 style="Margin: 0 0 5px 0; display: block; font-size: 14px; line-height: 1; font-family: Helvetica, Arial, Geneva, sans-serif; font-weight: bold;">';
				if ( 0 < $count ) {
					$author_url = get_author_posts_url( $author_id, sanitize_title( $name ) );
					$output    .= '<a style="color: #801019; text-decoration: none;" href="' . $author_url . '">';
				}
				$output .= $name;
				if ( 0 < $count ) {
					$output .= '</a>';
				}
				$output .= '</h3>';
			}
			// email content filter
			$text    = apply_filters( 'format_email_content', $text, false );
			$output .= $text;
			$output .= '</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</div>
</div>';
			return $output;
		}
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

		$author_sizes = array(
			/*array(
				'name'      => 'photo',
				'media'     => '(min-width: 80em)',
				'width'     => 225,
				'placement' => 'archive',
			),*/
			array(
				'name'  => 'author-photo',
				'media' => '(min-width: 640px)',
				'width' => 190,
				//'placement' => 'post',
			),
			array(
				'name'  => 'author-teaser',
				'media' => '',
				'width' => 75,
			),
		);

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

		$attributes = array();

		// set up lazy load attributes
		$attributes = apply_filters( 'minnpost_largo_lazy_load_attributes', $attributes, $author_id, 'post', $lazy_load );
		if ( '' !== wp_get_attachment_image( $image_id, $size ) ) {
			$alt_text  = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
			$image_url = wp_get_attachment_url( $image_id );
			if ( ( is_singular() || is_archive() ) && ! is_singular( 'newsletter' ) ) {
				if ( isset( $attributes['class'] ) ) {
					$class = ' class="' . $attributes['class'] . '"';
				} else {
					$class = '';
				}
				if ( isset( $attributes['loading'] ) ) {
					$loading = ' loading="' . $attributes['loading'] . '"';
				} else {
					$loading = '';
				}
				$image = '<picture class="a-author-sizes">';
				foreach ( $author_sizes as $size ) {
					if ( isset( $size['placement'] ) && 'post' === $size['placement'] && ! is_single() ) {
						continue;
					} elseif ( isset( $size['placement'] ) && 'archive' === $size['placement'] && ! is_archive() ) {
						continue;
					}
					$image_url_width = $image_url . '?w=' . $size['width'];
					if ( '' !== $size['media'] ) {
						$image .= '<source media="' . $size['media'] . '" srcset="' . $image_url_width . '">';
					} else {
						$image .= '<source srcset="' . $image_url_width . '">';
					}
				}
				$image .= '<img src="' . $image_url . '" alt="' . $alt_text . '"' . $class . $loading . '>';
				$image .= '</picture>';
			} else {
				// this requires that the custom image sizes in custom-fields.php work correctly
				$image = '<div class="a-author-sizes">' . wp_get_attachment_image( $image_id, $size, false, $attributes ) . '</div>';
			}
		} else {
			$image = '<div class="a-author-sizes">' . minnpost_largo_manual_image_tag( $image_id, $image_url, $attributes ) . '</div>';
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

		// set up lazy load attributes
		$attributes = apply_filters( 'minnpost_largo_lazy_load_attributes', $attributes, $category_id, 'term', $lazy_load );

		if ( '' !== wp_get_attachment_image( $image_id, $size ) ) {
			// this requires that the custom image sizes in custom-fields.php work correctly
			$image     = wp_get_attachment_image( $image_id, $size, false, $attributes );
			$image_url = wp_get_attachment_url( $image_id );
		} else {
			$image = minnpost_largo_manual_image_tag( $image_id, $image_url, $attributes );
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
			$text = get_term_meta( $category_id, '_mp_category_excerpt', true );
		}
		$text = apply_filters( 'the_content', $text );
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
		if ( 0 === $user->ID || in_array( 'comment_moderator', (array) $user->roles, true ) ) {
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

		$sidebar = apply_filters( 'the_content', get_post_meta( $post_id, '_mp_post_sidebar', true ) );

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
			$category          = get_category( $category_id );
			$category_link     = get_category_link( $category );
			$category_is_group = false;
			if ( true === $show_group ) {
				$category_group_id = minnpost_get_category_group_id( $post_id, $category_id );
				if ( '' !== $category_group_id ) {
					$category_group = get_category( $category_group_id );
					echo '<div class="a-breadcrumbs a-breadcrumbs-' . sanitize_title( $category_group->slug ) . '">';
					echo '<div class="a-breadcrumb a-category-group"><a href="' . esc_url( get_category_link( $category_group->term_id ) ) . '">' . $category_group->name . '</a></div>';
				} else {
					if ( function_exists( 'minnpost_largo_category_groups' ) ) {
						$groups = minnpost_largo_category_groups();
						if ( in_array( $category->slug, $groups, true ) ) {
							$category_is_group = true;
						}
					}
				}
			}
			if ( false === $category_is_group ) {
				$category_name = isset( $category->name ) ? $category->name : '';
				if ( '' !== $category_name ) {
					echo '<div class="a-breadcrumb a-category-name"><a href="' . $category_link . '">' . $category_name . '</a></div>';
				}
			} else {
				echo '<div class="a-breadcrumbs a-breadcrumbs-' . sanitize_title( $category->slug ) . '">';
				echo '<div class="a-breadcrumb a-category-group"><a href="' . esc_url( get_category_link( $category->term_id ) ) . '">' . $category->name . '</a></div>';
			}
		}
		if ( '' !== $category_group_id || true === $category_is_group ) {
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
* Returns the grouping category ID for a post's main category
*
* @param int $post_id
* @param int $category_id
* @return int $category_group_id
*
*/
if ( ! function_exists( 'minnpost_get_category_group_id' ) ) :
	function minnpost_get_category_group_id( $post_id = '', $category_id = '' ) {
		$category_group_id = '';
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}

		if ( '' === $category_id ) {
			$category_id = minnpost_get_permalink_category_id( $post_id );
		}

		$category_group_id = get_term_meta( $category_id, '_mp_category_group', true );

		return $category_group_id;
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
* Outputs HTML for sponsorship on an object
*
* @param string $object_type
* @param int $object_id
*
*/
if ( ! function_exists( 'minnpost_content_sponsorship' ) ) :
	function minnpost_content_sponsorship( $object_type = 'post', $object_id = '' ) {
		$sponsorship = minnpost_get_content_sponsorship( $object_type, $object_id );
		if ( '' !== $sponsorship ) {
			$sponsorship = apply_filters( 'the_content', $sponsorship );
			echo '<div class="a-sponsorship">' . $sponsorship . '</div>';
		}
	}
endif;

/**
* Returns the sponsorship for an object
*
* @param string $object_type
* @param int $object_id
* @return string
*
*/
if ( ! function_exists( 'minnpost_get_content_sponsorship' ) ) :
	function minnpost_get_content_sponsorship( $object_type = 'post', $object_id = '' ) {
		$sponsorship = '';
		$post_id     = '';
		$tag_id      = '';
		$category_id = '';

		$post_sponsorship_field     = '_mp_post_sponsorship';
		$tag_sponsorship_field      = '_mp_tag_sponsorship';
		$category_sponsorship_field = '_mp_category_sponsorship';

		if ( 'post' === $object_type ) {
			$post_id = $object_id;
		}

		if ( 'category' === $object_type ) {
			$category_id = $object_id;
		}

		if ( 'post_tag' === $object_type ) {
			$tag_id = $object_id;
		}

		if ( '' === $object_id && 'post' === $object_type ) {
			$post_id     = get_the_ID();
			$category_id = minnpost_get_permalink_category_id( $post_id );
			// look for a tag on this post that has a non-empty sponsorship value
			$tag_args  = array(
				'hide_empty' => true, // also retrieve terms which are not used yet
				'meta_query' => array(
					array(
						'key'     => $tag_sponsorship_field,
						'value'   => '',
						'compare' => '!=',
					),
				),
				'fields'     => 'ids',
			);
			$post_tags = wp_get_post_terms( $post_id, 'post_tag', $tag_args );
			if ( ! empty( $post_tags ) && ! is_wp_error( $post_tags ) ) {
				$tag_id = $post_tags[0];
			}
		}

		// we have to supply a tag id if we want to use the tag for a sponsor

		if ( '' === $post_id && '' === $category_id && '' === $tag_id ) {
			return $sponsorship; // empty
		}

		if ( 'post' === $object_type ) {
			// allow a post to prevent sponsorship display
			$prevent_sponsorship = get_post_meta( $post_id, '_mp_prevent_post_sponsorship', true );
			if ( 'on' === $prevent_sponsorship ) {
				return $sponsorship; // empty
			}
			// post sponsorship has the highest priority on a post
			$sponsorship = get_post_meta( $post_id, $post_sponsorship_field, true );
			if ( ! empty( $sponsorship ) ) {
				return $sponsorship;
			}
		}

		if ( 'post' === $object_type || 'post_tag' === $object_type ) {
			// followed by tag sponsorship of the post's tag
			$sponsorship = get_term_meta( $tag_id, $tag_sponsorship_field, true );
			if ( ! empty( $sponsorship ) ) {
				return $sponsorship;
			}
		}

		if ( 'post' === $object_type || 'category' === $object_type ) {
			// followed by category sponsorship of the post's category
			$sponsorship = get_term_meta( $category_id, $category_sponsorship_field, true );
			if ( ! empty( $sponsorship ) ) {
				return $sponsorship;
			}
		}

		// we could also have sponsored authors later

		return $sponsorship; // empty
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
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}
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

			$class = '';

			// set up lazy load attributes
			if ( ! isset( $attributes ) ) {
				$attributes = array();
			}
			$attributes = apply_filters( 'minnpost_largo_lazy_load_attributes', $attributes, $post_id, 'post', $lazy_load );

			if ( isset( $attributes['class'] ) ) {
				$class = $attributes['class'];
			}

			$attributes['alt'] = __( 'MinnPostPlus', 'minnpost-largo' );
			$image_url         = get_theme_file_uri() . '/assets/img/MinnPostPlusLogo.png';
			$image             = minnpost_largo_manual_image_tag( '', $image_url, $attributes );

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
		} elseif ( is_year() ) {
			/* translators: Yearly archive title. %s: Year. */
			$title = sprintf( __( 'Yearly Archives: %s', 'minnpost-largo' ), get_the_date( _x( 'Y', 'yearly archives date format' ) ) );
		} elseif ( is_month() ) {
			/* translators: Monthly archive title. %s: Month name and year. */
			$title = sprintf( __( 'Monthly Archives: %s', 'minnpost-largo' ), get_the_date( _x( 'F Y', 'monthly archives date format' ) ) );
		} elseif ( is_day() ) {
			/* translators: Daily archive title. %s: Date. */
			$title = sprintf( __( 'Daily Archives: %s', 'minnpost-largo' ), get_the_date( _x( 'F j, Y', 'daily archives date format' ) ) );
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
		$max   = (int) $wp_query->max_num_pages;

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

		echo '<div class="m-pagination"><ol>' . "\n";

		// "previous" link
		if ( get_previous_posts_link() ) {
			printf( '<li class="a-pagination-previous">%s</li>' . "\n", get_previous_posts_link( '<i class="fas fa-chevron-left"></i> Previous' ) );
			// elipses
			if ( ! in_array( 2, $links, true ) ) {
				echo '<li class="a-pagination-ellipsis"><span>&hellip;</span></li>';
			}
		}

		// each line item. don't link the current one because that's silly.
		sort( $links );
		foreach ( (array) $links as $link ) {
			if ( $paged === $link ) {
				printf( '<li class="current"><span>%s</span></li>' . "\n", $link );
			} else {
				printf( '<li><a href="%s">%s</a></li>' . "\n", esc_url( get_pagenum_link( $link ) ), $link );
			}
		}

		// elipses
		if ( ! in_array( $max - 1, $links, true ) ) {
			echo '<li class="a-pagination-ellipsis"><span>&hellip;</span></li>' . "\n";
		}

		// "next" link
		if ( get_next_posts_link() ) {
			printf( '<li class="a-pagination-next">%s</li>' . "\n", get_next_posts_link( 'Next <i class="fas fa-chevron-right"></i>' ) );
		}

		echo '</ol></div>' . "\n";

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
				case 'daily_coronavirus':
					$filename = 'mp-dcu-600.png';
					break;
				case 'republication':
					$filename = 'republication-header-260x50.png';
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
			<div class="o-wrapper o-wrapper-sub-navigation o-wrapper-user-account-management-navigation">
				<a class="a-subnav-label a-user-account-management-label" href="/user/"><?php echo __( 'Your&nbsp;MinnPost&nbsp;Account', 'minnpost-largo' ); ?></a>
				<div class="m-sub-navigation m-user-account-management">
					<nav id="navigation-user-account-management" class="m-subnav-navigation m-user-account-management-navigation">
						<?php echo $menu; ?>
					</nav><!-- #navigation-user-account-management -->
					<button class="nav-scroller-btn nav-scroller-btn--left" aria-label="Scroll left">
						<i class="fas fa-chevron-left"></i>
					</button>
					<button class="nav-scroller-btn nav-scroller-btn--right" aria-label="Scroll right"><i class="fas fa-chevron-right"></i>
					</button>
				</div>
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

		if ( function_exists( 'user_account_management' ) ) {
			$account_management = user_account_management();
			$can_access         = $account_management->user_data->check_user_permissions( $user_id );
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
					'items_wrap'     => '<ul id="%1$s" class="m-menu m-menu-sub-navigation m-menu-%1$s">%3$s</ul>',
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
		if ( function_exists( 'user_account_management' ) ) {
			$account_management = user_account_management();
			$can_access         = $account_management->user_data->check_user_permissions( $user_id );
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

/**
* Common filter for setting up lazy load attributes
*
* @param array $attributes
* @param int $object_id
* @param string $object_type
* @param bool $lazy_load
* @return array $attributes
*
*/
if ( ! function_exists( 'minnpost_largo_add_lazy_load_attributes' ) ) :
	add_filter( 'minnpost_largo_lazy_load_attributes', 'minnpost_largo_add_lazy_load_attributes', 10, 3 );
	function minnpost_largo_add_lazy_load_attributes( $attributes, $object_id, $object_type = 'post', $lazy_load = true ) {
		// handle prevention of lazy loading from the object loading the image
		if ( 'post' === $object_type ) {
			$prevent_lazy_load = get_post_meta( $object_id, '_mp_prevent_lazyload', true );
		} elseif ( 'term' === $object_type ) {
			$prevent_lazy_load = get_term_meta( $object_id, '_mp_prevent_lazyload', true );
		}
		if ( 'on' === $prevent_lazy_load ) {
			$lazy_load = false;
		}
		if ( false === $lazy_load ) {
			if ( isset( $attributes['class'] ) ) {
				$attributes['class'] .= ' ';
			} else {
				$attributes['class'] = '';
			}
			// this is the class and attribute to disable lazy loading on an image
			$attributes['class']  .= 'no-lazy';
			$attributes['loading'] = 'eager';
		} else {
			$attributes['loading'] = 'lazy';
			$attributes['class']   = 'jetpack-lazy-image';
		}
		return $attributes;
	}
endif;

/**
* Manually generate an image tag from its attributes
* This is mostly used for images that are migrated pre-WordPress, but at least we can still add
* attributes to them.
*
* @param int $image_id
* @param string $image_url
* @param array $attributes
* @return string $image
*
*/
if ( ! function_exists( 'minnpost_largo_manual_image_tag' ) ) :
	function minnpost_largo_manual_image_tag( $image_id = '', $image_url = '', $attributes = array(), $object_type = 'post' ) {
		$image = '';
		if ( '' !== $image_id ) {
			$alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
		} elseif ( isset( $attributes['alt'] ) ) {
			$alt = $attributes['alt'];
		} else {
			$alt = '';
		}
		$image = '<img src="' . $image_url . '" alt="' . $alt . '"';
		if ( 'newsletter' === $object_type ) {
			if ( isset( $attributes['title'] ) ) {
				$image .= ' title="' . $attributes['title'] . '"';
			}
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
		return $image;
	}
endif;

/**
* Common filter for setting up lazy load attributes
*
* @param array $attributes
* @param int $object_id
* @param string $object_type
* @param bool $lazy_load
* @return array $attributes
*
*/
if ( ! function_exists( 'minnpost_largo_add_lazy_load_attributes' ) ) :
	add_filter( 'minnpost_largo_lazy_load_attributes', 'minnpost_largo_add_lazy_load_attributes', 10, 3 );
	function minnpost_largo_add_lazy_load_attributes( $attributes, $object_id, $object_type = 'post', $lazy_load = true ) {
		// handle prevention of lazy loading from the object loading the image
		if ( 'post' === $object_type ) {
			$prevent_lazy_load = get_post_meta( $object_id, '_mp_prevent_lazyload', true );
		} elseif ( 'term' === $object_type ) {
			$prevent_lazy_load = get_term_meta( $object_id, '_mp_prevent_lazyload', true );
		}
		if ( 'on' === $prevent_lazy_load ) {
			$lazy_load = false;
		}
		if ( false === $lazy_load ) {
			if ( isset( $attributes['class'] ) ) {
				$attributes['class'] .= ' ';
			} else {
				$attributes['class'] = '';
			}
			// this is the class and attribute to disable lazy loading on an image
			$attributes['class']  .= 'no-lazy';
			$attributes['loading'] = 'eager';
		} else {
			$attributes['loading'] = 'lazy';
			$attributes['class']   = 'jetpack-lazy-image';
		}
		return $attributes;
	}
endif;

/**
* Manually generate an image tag from its attributes
* This is mostly used for images that are migrated pre-WordPress, but at least we can still add
* attributes to them.
*
* @param int $image_id
* @param string $image_url
* @param array $attributes
* @return string $image
*
*/
if ( ! function_exists( 'minnpost_largo_manual_image_tag' ) ) :
	function minnpost_largo_manual_image_tag( $image_id = '', $image_url = '', $attributes = array(), $object_type = 'post' ) {
		$image = '';
		if ( '' !== $image_id ) {
			$alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
		} elseif ( isset( $attributes['alt'] ) ) {
			$alt = $attributes['alt'];
		} else {
			$alt = '';
		}
		$image = '<img src="' . $image_url . '" alt="' . $alt . '"';
		if ( 'newsletter' === $object_type ) {
			if ( isset( $attributes['title'] ) ) {
				$image .= ' title="' . $attributes['title'] . '"';
			}
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
		return $image;
	}
endif;

/**
* Display a string for email-friendly formatting
*
* @param string $content
* @param bool $message
*
*/
if ( ! function_exists( 'email_formatted_content' ) ) :
	function email_formatted_content( $content, $message = false ) {
		$content = apply_filters( 'format_email_content', $content );
		echo $content;
	}
endif;

/**
* Format a string for email-friendly display
*
* @param string $content
* @param bool $message
* @return string $content
*
*/
if ( ! function_exists( 'format_email_content' ) ) :
	add_filter( 'format_email_content', 'format_email_content', 10, 3 );
	function format_email_content( $content, $body = true, $message = false ) {
		$serif_stack = 'font-family: Georgia, \'Times New Roman\', Times, serif; ';
		$sans_stack  = 'font-family: Helvetica, Arial, Geneva, sans-serif; ';
		$font_stack  = $serif_stack;
		if ( true === $message ) {
			$font_stack = $sans_stack;
		}
		$content = str_replace( ' dir="ltr"', '', $content );

		// links
		$content = str_replace( '<a href="', '<a style="' . $font_stack . 'color: #801019; text-decoration: none;" href="', $content );
		// paragraphs
		if ( true === $body ) {
			$content = str_replace( '<p class="intro">', '<p>', $content );
			$content = preg_replace( '/<p>/', '<p class="intro" style="' . $font_stack . 'font-size: 17.6px; line-height: 24.9444px; Margin: 0 0 15px; padding: 15px 0 0;">', $content, 1 );
		}
		$content = str_replace( '<p>', '<p style="' . $font_stack . 'font-size: 16px; line-height: 20.787px; Margin: 0 0 15px; padding: 0;">', $content );
		// lists
		$content = str_replace( '<li>', '<li style="' . $font_stack . 'font-size: 16px; line-height: 20.787px; Margin: 0 0 15px; padding: 0;">', $content );
		$content = str_replace( '<ul>', '<ul style="' . $font_stack . 'font-size: 16px; line-height: 20.787px; Margin: 0 0 15px; padding: 0 0 0 40px;">', $content );
		// headings
		if ( false === $message ) {
			$content = preg_replace( '/(<h[2-6]\b[^><]*)>/i', '$1 style="color: #801019; Margin: 15px 0; display: block; font-size: 14px; line-height: 1; ' . $sans_stack . 'font-weight: bold; text-transform: uppercase; border-top-width: 2px; border-top-color: #cccccf; border-top-style: solid; padding-top: 15px;">', $content );
		} else {
			$content = preg_replace( '/(<h[2-6]\b[^><]*)>/i', '$1 style="Margin: 0 0 15px 0; display: block; font-size: 16px; line-height: 1; ' . $sans_stack . 'font-weight: bold;">', $content );
		}
		// blockquotes
		$content = str_replace( '<blockquote><p style="' . $font_stack . 'font-size: 16px; line-height: 20.787px; Margin: 0 0 15px; padding: 0;">', '<blockquote style="border-left-width: 2px; border-left-color: #cccccf; border-left-style: solid; Margin: 10px 10px 15px; padding: 0 10px; color: #6a6161;"><p style="' . $font_stack . 'font-size: 16px; line-height: 20.787px; Margin: 0 0 15px; padding: 0;">', $content );
		return $content;
	}
endif;
