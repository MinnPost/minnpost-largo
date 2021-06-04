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
		if ( '' !== $image_data && ! empty( $image_data ) ) {
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
				// don't show republish button if instructed
				$hide_republish_button = get_post_meta( $post_id, '_mp_remove_republish_button_from_display', true );
				$hide_republish_button = apply_filters( 'minnpost_largo_republish_button_from_display', '', $post_id );
				if ( 'on' !== $hide_republish_button ) :
					// INN will have a template tag we can use to display the button in the next plugin release.
					?>
					<li class="a-share a-share-republish">
						<a href="#" class="republication-tracker-tool-button" aria-label="<?php echo __( 'Republish this article.', 'minnpost-largo' ); ?>" data-share-action="<?php echo __( 'Republish', 'minnpost-largo' ); ?>">
							<i class="fab fa-creative-commons"></i>
						</a>
					</li>
				<?php endif; ?>
			<?php endif; ?>
		</ul>
		<?php
	}
endif;

/**
* Output the manually picked related stories for a post in an archive context.
* ex with lead story on homepage.
*
* @param string $placement
* @param int $post_id
*
*/
if ( ! function_exists( 'minnpost_related_on_listing' ) ) :
	function minnpost_related_on_listing( $placement, $post_id ) {
		$related_posts = minnpost_get_related_on_listing( $placement, $post_id );
		if ( ! empty( $related_posts ) ) :
			?>
			<div class="m-related m-related-on-listing">
				<h4 class="a-related-title"><?php echo __( 'Related MinnPost Coverage', 'minnpost-largo' ); ?></h4>
				<ul class="a-related-list a-related-list-<?php echo $placement; ?>">
					<?php
					global $post;
					foreach ( $related_posts as $post ) :
						setup_postdata( $post );
						include(
							locate_template(
								array(
									'template-parts/related-post-' . $placement . '.php',
									'template-parts/related-post.php',
								)
							)
						);
					endforeach;
					wp_reset_postdata();
					?>
				</ul>
			</div>
			<?php
		endif;
	}
endif;

/**
* Output the manually picked related stories for a post
*
* @see inc/jetpack.php for automated related stories
* @param string $type
* @param int $count
* @param bool $only_show_images_if_not_missing
*
*/
if ( ! function_exists( 'minnpost_related' ) ) :
	function minnpost_related( $type = 'content', $count = 3, $only_show_images_if_not_missing = false ) {
		if ( 'automated' === $type && function_exists( 'minnpost_largo_get_jetpack_results' ) ) {
			$related_posts = minnpost_largo_get_jetpack_results( $count );
		} else {
			$related_ids   = minnpost_get_related( $type, get_the_ID(), $count );
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
* Outputs speaker image, large or thumbnail, with/without the bio or excerpt bio, all inside a <figure>
*
* @param int $speaker_id
* @param string $photo_size
* @param string $text_field
* @param bool $include_text
* @param bool $include_name
* @param bool $include_title
* @param bool $lazy_load
*
*/
if ( ! function_exists( 'minnpost_speaker_figure' ) ) :
	function minnpost_speaker_figure( $speaker_id = '', $photo_size = 'photo', $text_field = 'the_excerpt', $include_text = true, $name_field = 'display_name', $include_name = false, $include_link = false, $title_field = '_tribe_ext_speaker_title', $include_title = true, $include_twitter = false, $twitter_field = '_tribe_ext_speaker_twitter_username', $lazy_load = true ) {
		$output = minnpost_get_speaker_figure( $speaker_id, $photo_size, $text_field, $include_text, $name_field, $include_name, $include_link, $title_field, $include_title, $include_twitter, $twitter_field, $lazy_load );
		echo $output;
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
		$category_is_group = false;
		if ( '' !== $category_id ) {
			$category      = get_category( $category_id );
			$category_link = get_category_link( $category );
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
