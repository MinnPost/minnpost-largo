<?php
/**
 * Custom template functions for this theme.
 *
 *
 * @package MinnPost Largo
 */

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
* @param string $date_string
* @param string $part
* @param string $part_to_remove
* @return string $date
*
*/
if ( ! function_exists( 'minnpost_largo_get_ap_date' ) ) :
	function minnpost_largo_get_ap_date( $date_string, $part = '', $part_to_remove = '' ) {
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

			if ( '' !== $part_to_remove ) {
				if ( 'month' === $part_to_remove ) {
					$date = $ap_day . ', ' . $ap_year;
				} elseif ( 'day' === $part_to_remove ) {
					$date = $ap_month . ', ' . $ap_year;
				} elseif ( 'year' === $part_to_remove ) {
					$date = $ap_month . ' ' . $ap_day;
				}
			} else {
				$date = $ap_month . ' ' . $ap_day . ', ' . $ap_year;
			}

			if ( '' !== $part ) {
				if ( 'month' === $part ) {
					return $ap_month;
				}
				if ( 'day' === $part ) {
					return $ap_day;
				}
				if ( 'year' === $part ) {
					return $ap_year;
				}
			}
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
* Get timezone abbreviation from a time string
*
* @param string $time_string
* @return string $timezone
*
*/
if ( ! function_exists( 'minnpost_largo_get_timezone' ) ) :
	function minnpost_largo_get_timezone( $time_string ) {
		$date_time = new DateTime( $time_string );
		$tz        = new DateTimeZone( get_option( 'timezone_string' ) );
		$tz        = $date_time->setTimeZone( $tz );
		$timezone  = $date_time->format( 'T' );
		return $timezone;
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

/**
* Get the manually picked related stories for a post in an archive context.
* ex with lead story on homepage.
*
* @param string $placement
* @param int $post_id
*
*/
if ( ! function_exists( 'minnpost_get_related_on_archive' ) ) :
	function minnpost_get_related_on_listing( $placement, $post_id ) {
		$related_posts              = array();
		$related_content_on_listing = get_post_meta( $post_id, '_mp_related_content_on_listing', true );
		if ( 'on' !== $related_content_on_listing ) {
			return $related_posts;
		}
		if ( 'lead-story' === $placement ) {
			$related_ids = minnpost_get_related( 'content', $post_id );
			foreach ( $related_ids as $id ) {
				$related_posts[] = get_post( $id );
			}
		}
		return $related_posts;
	}
endif;

/**
* Get the related stories for a post
*
* @param string $type
* @param int $post_id
* @param int $count
* @return array $related
*
*/
if ( ! function_exists( 'minnpost_get_related' ) ) :
	function minnpost_get_related( $type = 'content', $post_id = 0, $count = 3 ) {
		if ( 0 === $post_id ) {
			$post_id = get_the_ID();
		}
		$related = array();

		// settings for non-jetpack related posts.
		// if all are false, it checks the next set for manually recommended posts, then goes to Jetpack.
		// if multiples are true, it would run the first true one, and ignore the subsequent ones.
		$zoninator_related_enabled = false; // allow for using zoninator posts as related posts.
		$recent_same_category      = true; // most recent posts in the same category.
		$recent_not_same_category  = false; // most recent posts not in the same category.
		if ( 'zoninator' === $type && true === $zoninator_related_enabled ) {
			$cache_zoninator_related = true;
			if ( true === $cache_zoninator_related ) {
				$cache_key   = md5( 'minnpost_zoninator_related_posts_' . $post_id );
				$cache_group = 'minnpost';
				$related     = wp_cache_get( $cache_key, $cache_group );
				if ( false === $related ) {
					$related = array();
				}
			}
			if ( empty( $related ) ) {
				$zoninator_related_random = true;
				$current_post_id          = get_the_ID();
				$exclude_categories       = array(
					'inside-minnpost',
				);
				if ( function_exists( 'z_get_zone' ) ) {
					$top_query = z_get_zone_query( 'homepage-top' );
					if ( $top_query->have_posts() ) {
						while ( $top_query->have_posts() ) {
							$top_query->the_post();
							if ( get_the_ID() !== $current_post_id && ! in_category( $exclude_categories, get_the_ID() ) ) {
								$related[] = get_the_ID();
							}
						}
					}
					$top_more_query = z_get_zone_query( 'homepage-more-top-stories' );
					if ( $top_more_query->have_posts() ) {
						while ( $top_more_query->have_posts() ) {
							$top_more_query->the_post();
							if ( get_the_ID() !== $current_post_id && ! in_category( $exclude_categories, get_the_ID() ) ) {
								$related[] = get_the_ID();
							}
						}
					}
					$opinion_query = z_get_zone_query( 'homepage-opinion' );
					if ( $opinion_query->have_posts() ) {
						while ( $opinion_query->have_posts() ) {
							$opinion_query->the_post();
							if ( get_the_ID() !== $current_post_id && ! in_category( $exclude_categories, get_the_ID() ) ) {
								$related[] = get_the_ID();
							}
						}
					}
					wp_reset_postdata();
					if ( true === $zoninator_related_random ) {
						shuffle( $related );
					}
					$related = array_slice( $related, 0, $count );
				}
				if ( true === $cache_zoninator_related ) {
					wp_cache_set( $cache_key, $related, $cache_group, MINUTE_IN_SECONDS * 30 );
				}
			}
		}
		if ( 'content' === $type ) {
			// recent same category and recent not same category should only apply to "content" type. otherwise it runs twice.
			if ( true === $recent_same_category || true === $recent_not_same_category ) {
				$exclude_category_ids = array();
				$exclude_post_ids     = array();

				// load the category ids that should be excluded.
				if ( function_exists( 'minnpost_largo_get_excluded_related_terms' ) ) {
					$exclude_category_ids = minnpost_largo_get_excluded_related_terms();
				}
				// load the current post's permalink category ID.
				$permalink_category = minnpost_get_permalink_category_id( $post_id );
				if ( in_array( (int) $permalink_category, $exclude_category_ids, true ) ) {
					// if the current category should be excluded, don't recommend stories only from this category.
					$recent_same_category = false;
				}

				// load the post ids that should be excluded.
				if ( function_exists( 'minnpost_largo_get_excluded_related_posts' ) ) {
					$exclude_post_ids = minnpost_largo_get_excluded_related_posts();
				}
			}
			if ( true === $recent_same_category ) {
				$query = new WP_Query(
					array(
						'cat'              => $permalink_category,
						'fields'           => 'ids',
						'posts_per_page'   => $count,
						'category__not_in' => $exclude_category_ids,
						'post__not_in'     => $exclude_post_ids,
					)
				);
			}
			if ( true === $recent_not_same_category ) {
				$exclude_category_ids[] = $permalink_category;
				$query                  = new WP_Query(
					array(
						'fields'           => 'ids',
						'posts_per_page'   => $count,
						'category__not_in' => $exclude_category_ids,
						'post__not_in'     => $exclude_post_ids,
					)
				);
			}
			if ( $query->have_posts() ) {
				// this is an array of the related post IDs.
				$related = $query->posts;
			}
		}
		// manually selected related posts. these always override the other kinds.
		if ( ! empty( get_post_meta( $post_id, '_mp_related_' . $type, true ) ) ) {
			$ids = get_post_meta( $post_id, '_mp_related_' . $type, true );
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
* Get the terms that should be excluded from related posts
*
* @return array $exclude_ids
*
*/
if ( ! function_exists( 'minnpost_largo_get_excluded_related_terms' ) ) :
	function minnpost_largo_get_excluded_related_terms() {
		// glean, fonm, mp-picks.
		$exclude_ids = array(
			55575,
			55630,
			55628,
		);

		// add in the plugin-based exclusions from the shortcode.
		$exclusions = do_shortcode( '[return_excluded_terms ]' );
		if ( ! empty( $exclusions ) ) {
			$exclude_ids = array_merge( $exclude_ids, str_getcsv( $exclusions, ',', "'" ) );
		}

		return $exclude_ids;
	}
endif;

/**
* Get the posts that should be excluded from related posts
*
* @return array $post_ids
*
*/
if ( ! function_exists( 'minnpost_largo_get_excluded_related_posts' ) ) :
	function minnpost_largo_get_excluded_related_posts() {

		// start with the Daily Coronavirus Update post query.
		$coronavirus_update_ids = array();

		$cache_coronavirus_update_ids = true;
		if ( true === $cache_coronavirus_update_ids ) {
			$cache_key              = md5( 'minnpost_cache_coronavirus_update_ids' );
			$cache_group            = 'minnpost';
			$coronavirus_update_ids = wp_cache_get( $cache_key, $cache_group );
			if ( false === $coronavirus_update_ids ) {
				$coronavirus_update_ids = array();
			}
		}

		if ( empty( $coronavirus_update_ids ) ) {
			// load all posts that start with "The daily coronavirus update: "
			$coronavirus_update_query = new WP_Query(
				array(
					'title_starts_with' => 'The daily coronavirus update: ',
					'fields'            => 'ids',
					'posts_per_page'    => -1,
					'post_status'       => 'publish',
				)
			);
			// if there are no posts, it's an empty array.
			$coronavirus_update_ids = $coronavirus_update_query->posts;

			// cache the array of IDs for one hour.
			if ( true === $cache_coronavirus_update_ids ) {
				wp_cache_set( $cache_key, $coronavirus_update_ids, $cache_group, HOUR_IN_SECONDS * 1 );
			}
		}

		// we could merge arrays here later, if we have multiple arrays
		$exclude_ids = $coronavirus_update_ids;

		// add the current post id.
		$exclude_ids[] = get_the_ID();

		return $exclude_ids;
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
* Get speaker image, large or thumbnail, with/without the bio or excerpt bio, all inside a <figure>
*
* @param int $speaker_id
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
if ( ! function_exists( 'minnpost_get_speaker_figure' ) ) :
	function minnpost_get_speaker_figure( $speaker_id = '', $photo_size = 'full', $text_field = 'the_excerpt', $include_text = true, $name_field = 'the_title', $include_name = true, $include_link = false, $title_field = '_tribe_ext_speaker_title', $include_title = true, $include_twitter = false, $twitter_field = '_tribe_ext_speaker_twitter_username', $lazy_load = true ) {

		// some empty defaults
		$image_id  = '';
		$image_url = '';
		$image     = '';
		$text      = '';
		$name      = '';
		$title     = '';

		$image_data = minnpost_get_speaker_image( $speaker_id, $photo_size );
		if ( '' !== $image_data ) {
			$image_id  = $image_data['image_id'];
			$image_url = $image_data['image_url'];
			$image     = $image_data['markup'];
		}

		if ( 'the_excerpt' === $text_field ) { // excerpt
			$text .= get_the_excerpt( $speaker_id );
		} elseif ( '' !== get_post_meta( $speaker_id, $text_field, true ) ) { // a different field exists
			$text = get_post_meta( $speaker_id, $text_field, true );
		} else { // full text
			$text = get_the_content( $speaker_id );
		}

		if ( post_password_required() || is_attachment() || ( '' === $image_id && '' === $image_url && '' === $text ) ) {
			return;
		}

		if ( 'the_title' === $name_field ) { // name
			$name = get_the_title( $speaker_id );
		} elseif ( '' !== get_post_meta( $speaker_id, $name_field, true ) ) { // a different field exists
			$name = get_post_meta( $speaker_id, $name_field, true );
		}
		if ( '' !== get_post_meta( $speaker_id, $title_field, true ) ) { // the field exists
			$title = get_post_meta( $speaker_id, $title_field, true );
		}

		//$text = wpautop( $text ); // for some reason the paragraphs don't work without this
		$text = apply_filters( 'the_content', $text );

		if ( '' !== $image_id ) {
			$caption = wp_get_attachment_caption( $image_id );
			$credit  = get_media_credit_html( $image_id );
		}

		if ( ( is_singular() || is_archive() ) && ! is_singular( 'newsletter' ) ) {
			$output = '';
			if ( '' !== $image ) {
				$output .= '<figure class="a-archive-figure a-speaker-figure a-speaker-figure-' . $text_field . ' a-speaker-figure-' . $photo_size . '">';
				if ( true === $include_link ) {
					$speaker_url = get_permalink( $speaker_id );
					$output     .= '<a href="' . $speaker_url . '" class="m-speaker-link">';
				}
				$output .= $image;
			}
			if ( ( true === $include_text || true === $include_name || true === $include_title ) && ( '' !== $text || '' !== $name || '' !== $title ) ) {
				if ( '' !== $image ) {
					$output .= '<figcaption class="a-speaker-bio">';
				} else {
					$output .= '<div class="a-speaker-bio">';
				}
				if ( ( true === $include_name && '' !== $name ) || ( true === $include_title && '' !== $title ) ) {
					$output .= '<header class="m-speaker-headings">';
				}
				if ( true === $include_name && '' !== $name ) {
					if ( 'content' === $text_field ) {
						$output .= '<h1 class="a-speaker-heading a-speaker-title">' . $name . '</h1>';
					} else {
						$output .= '<h3 class="a-speaker-heading a-speaker-title">' . $name . '</h3>';
					}
				}
				if ( true === $include_title && '' !== $title ) {
					if ( 'content' === $text_field ) {
						$output .= '<h2 class="a-speaker-heading a-speaker-job-title">' . $title . '</h2>';
					} else {
						$output .= '<h4 class="a-speaker-heading a-speaker-job-title">' . $title . '</h4>';
					}
				}

				$twitter_username = get_post_meta( $speaker_id, '_tribe_ext_speaker_twitter_username', true );
				if ( true === $include_twitter && '' !== $twitter_username ) {
					$twitter_username = str_replace( '@', '', esc_attr( $twitter_username ) );
					if ( ! empty( $twitter_username ) ) {
						$output .= sprintf( '<h4 class="a-speaker-twitter"><a href="https://twitter.com/%1$s">@%1$s</a></h4>', $twitter_username );
					}
				}

				if ( ( true === $include_name && '' !== $name ) || ( true === $include_title && '' !== $title ) ) {
					$output .= '</header>';
				}

				if ( true === $include_text && '' !== $text && true === $include_link ) {
					$output .= '<div class="a-speaker-bio-text">';
				}
				if ( true === $include_text && '' !== $text ) {
					$output .= $text;
				}
				if ( true === $include_text && '' !== $text && true === $include_link ) {
					$output .= '</div>';
				}
				if ( '' !== $image ) {
					$output .= '</figcaption>';
				} else {
					$output .= '</div>';
				}
			}
			if ( '' !== $image ) {
				if ( true === $include_link ) {
					$output .= '</a>';
				}
				$output .= '</figure><!-- .speaker-figure -->';
			}
			return $output;
		}
	}
endif;

/**
* Returns speaker image, large or thumbnail, to put inside the figure
*
* @param int $speaker_id
* @param string $size
* @param bool $lazy_load
*
* @return array $image_data
*
*/
if ( ! function_exists( 'minnpost_get_speaker_image' ) ) :
	function minnpost_get_speaker_image( $speaker_id = '', $size = 'full', $lazy_load = true ) {
		$image     = '';
		$image_url = get_post_meta( $speaker_id, '_mp_speaker_photo', true );
		if ( 'full' !== $size ) {
			$image_url = get_post_meta( $speaker_id, '_mp_speaker_photo_' . $size, true );
		}
		$image_id = get_post_meta( $speaker_id, '_mp_speaker_photo_id', true );

		if ( post_password_required() || is_attachment() || ( ! $image_id && ! $image_url ) ) {
			return '';
		}

		$attributes = array();

		// set up lazy load attributes
		$attributes = apply_filters( 'minnpost_largo_lazy_load_attributes', $attributes, $speaker_id, 'tribe_ext_speaker', $lazy_load );
		if ( '' !== wp_get_attachment_image( $image_id, $size ) ) {
			$alt_text  = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
			$image_url = wp_get_attachment_url( $image_id );
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
			$image = '<img src="' . $image_url . '" alt="' . $alt_text . '"' . $class . $loading . '>';
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
		if ( 'term' === $object_type ) {
			$prevent_lazy_load = get_term_meta( $object_id, '_mp_prevent_lazyload', true );
		} else {
			$prevent_lazy_load = get_post_meta( $object_id, '_mp_prevent_lazyload', true );
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
* Get teaser text for a newsletter
*
* @param int $post_id
* @return string $teaser
*
*/
if ( ! function_exists( 'minnpost_get_newsletter_teaser' ) ) :
	function minnpost_get_newsletter_teaser( $post_id ) {
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}
		$teaser      = get_post_meta( $post_id, '_mp_newsletter_preview_text', true );
		$teaser_text = get_post_meta( $post_id, '_mp_newsletter_newsletter_teaser', true );
		if ( '' !== $teaser_text ) {
			$teaser = $teaser_text;
		}
		if ( '' !== $teaser ) {
			$teaser = apply_filters( 'the_content', $teaser );
		}
		return $teaser;
	}
endif;

/**
* Get newsletter type for a newsletter
*
* @param int $post_id
* @return string $newsletter_type
*
*/
if ( ! function_exists( 'minnpost_get_newsletter_type' ) ) :
	function minnpost_get_newsletter_type( $post_id ) {
		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}
		$newsletter_type = get_post_meta( get_the_ID(), '_mp_newsletter_type', true );
		return $newsletter_type;
	}
endif;

/**
* Format a string for email-friendly display
*
* @param string $content
* @param bool $body
* @param bool $message
* @param array $colors
* @return string $content
*
*/
if ( ! function_exists( 'format_email_content' ) ) :
	add_filter( 'format_email_content', 'format_email_content', 10, 4 );
	function format_email_content( $content, $body = true, $message = false, $colors = array() ) {

		$is_legacy = apply_filters( 'minnpost_largo_newsletter_legacy', false, get_the_ID() );
		if ( true === $is_legacy ) {
			format_email_content_legacy( $content, $body, $message );
		}

		$content = str_replace( ' dir="ltr"', '', $content );

		// links
		if ( isset( $colors['links'] ) ) {
			$content = str_replace( '<a href="', '<a style="color: ' . $colors['links'] . ' !important; text-decoration: underline;" href="', $content );
		}

		return $content;
	}
endif;

/**
* Format a string for email-friendly display on legacy templates
*
* @param string $content
* @param bool $message
* @return string $content
*
*/
if ( ! function_exists( 'format_email_content_legacy' ) ) :
	function format_email_content_legacy( $content, $body, $message ) {
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

/**
* Get story ids for a newsletter section
*
* @param int $post_id
* @param string $section
* @return array $story_ids
*
*/
if ( ! function_exists( 'minnpost_largo_get_newsletter_stories' ) ) :
	function minnpost_largo_get_newsletter_stories( $post_id, $section ) {
		if ( 'top' === $section ) {
			$posts = 'post';
		} else {
			$posts = 'posts';
		}
		$story_ids        = get_post_meta( $post_id, '_mp_newsletter_' . $section . '_' . $posts, true );
		$stories_override = get_post_meta( $post_id, '_mp_newsletter_' . $section . '_' . $posts . '_override', true );
		if ( '' !== $stories_override ) {
			$stories_override = explode( ',', $stories_override );
			$story_ids        = array_map( 'trim', $stories_override );
		}
		return $story_ids;
	}
endif;

/**
* Determine whether this is a legacy newsletter.
*
* @param bool $is_legacy
* @param int $post_id
* @return bool $is_legacy
*
*/
if ( ! function_exists( 'minnpost_largo_check_newsletter_legacy' ) ) :
	add_filter( 'minnpost_largo_newsletter_legacy', 'minnpost_largo_check_newsletter_legacy', 10, 2 );
	function minnpost_largo_check_newsletter_legacy( $is_legacy, $post_id ) {
		$top_story = minnpost_largo_get_newsletter_stories( $post_id, 'top' );
		if ( ! empty( $top_story ) ) {
			return false;
		}
		$news_stories = minnpost_largo_get_newsletter_stories( $post_id, 'news' );
		if ( ! empty( $news_stories ) ) {
			return false;
		}
		$opinion_stories = minnpost_largo_get_newsletter_stories( $post_id, 'opinion' );
		if ( ! empty( $opinion_stories ) ) {
			return false;
		}
		$arts_stories = minnpost_largo_get_newsletter_stories( $post_id, 'arts' );
		if ( ! empty( $arts_stories ) ) {
			return false;
		}
		$editors_stories = minnpost_largo_get_newsletter_stories( $post_id, 'editors' );
		if ( ! empty( $editors_stories ) ) {
			return false;
		}
		return true;
	}
endif;

/**
* Load the title for a newsletter section.
*
* @param string $section
* @param int $newsletter_id
* @return string $section_title
*
*/
if ( ! function_exists( 'minnpost_newsletter_get_section_title' ) ) :
	function minnpost_newsletter_get_section_title( $section, $newsletter_id = '' ) {
		if ( '' === $newsletter_id ) {
			$newsletter_id = get_the_ID();
		}
		$section_title = get_post_meta( $newsletter_id, '_mp_newsletter_' . $section . '_section_title', true );
		return $section_title;
	}
endif;

/**
* Load the query for a newsletter section. This should function similarly to z_get_zone_query
*
* @param string $section
* @param int $newsletter_id
* @return object $section_query
*
*/
if ( ! function_exists( 'minnpost_newsletter_get_section_query' ) ) :
	function minnpost_newsletter_get_section_query( $section, $newsletter_id = '' ) {
		if ( '' === $newsletter_id ) {
			$newsletter_id = get_the_ID();
		}
		$post_ids      = minnpost_largo_get_newsletter_stories( $newsletter_id, $section );
		$query_args    = array(
			'post__in'    => $post_ids,
			'orderby'     => 'post__in',
			'post_status' => 'any',
		);
		$section_query = new WP_Query( $query_args );
		// the total does not stop at posts_per_page
		set_query_var( 'found_posts', $section_query->found_posts );
		return $section_query;
	}
endif;

/**
* Load the title for a post in a newsletter.
*
* @param int $post_id
* @return string $title
*
*/
if ( ! function_exists( 'minnpost_newsletter_get_entry_title' ) ) :
	function minnpost_newsletter_get_entry_title( $post_id = 0 ) {
		if ( 0 === $post_id ) {
			$post_id = get_the_ID();
		}
		$title         = get_the_title( $post_id );
		$use_seo_title = get_post_meta( $post_id, '_mp_post_newsletter_use_seo_title', true );
		if ( 'on' !== $use_seo_title ) {
			return $title;
		}
		$seo_title = get_post_meta( $post_id, '_mp_seo_title', true );
		if ( '' !== $seo_title ) {
			$title = $seo_title;
		}
		return $title;
	}
endif;

/**
* Load the excerpt for a post in a newsletter.
*
* @param int $post_id
* @return string $excerpt
*
*/
if ( ! function_exists( 'minnpost_newsletter_get_entry_excerpt' ) ) :
	function minnpost_newsletter_get_entry_excerpt( $post_id = 0 ) {
		if ( 0 === $post_id ) {
			$post_id = get_the_ID();
		}
		$excerpt      = get_the_excerpt( $post_id );
		$use_seo_desc = get_post_meta( $post_id, '_mp_post_newsletter_use_seo_description', true );
		if ( 'on' !== $use_seo_desc ) {
			return $excerpt;
		}
		$seo_desc = get_post_meta( $post_id, '_mp_seo_description', true );
		if ( '' !== $seo_desc ) {
			$excerpt = $seo_desc;
		}
		$excerpt = apply_filters( 'the_content', $excerpt );
		return $excerpt;
	}
endif;

/**
* Load the ads for a newsletter.
*
* @param string $newsletter_type
* @return array $ads
*
*/
if ( ! function_exists( 'minnpost_newsletter_get_ads' ) ) :
	function minnpost_newsletter_get_ads( $newsletter_type = '' ) {
		ob_start();
		dynamic_sidebar( 'sidebar-1' );
		$sidebar = ob_get_contents();
		ob_end_clean();

		$ad_dom = new DomDocument;
		libxml_use_internal_errors( true );
		$ad_dom->loadHTML( $sidebar, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_use_internal_errors( false );
		$ad_xpath = new DOMXpath( $ad_dom );
		$ad_divs  = $ad_xpath->query( "//section[contains(concat(' ', @class, ' '), ' m-widget ')]/div/p" );

		$ads = array();
		if ( 'dc_memo' !== $newsletter_type ) {
			foreach ( $ad_divs as $key => $value ) {
				$style = $value->getAttribute( 'style' );
				$ads[] = '<p>' . minnpost_dom_innerhtml( $value ) . '</p>';
			}
		} else {
			foreach ( $ad_divs as $key => $value ) {
				$style = $value->getAttribute( 'style' );
				$ads[] = '<p>' . minnpost_dom_innerhtml( $value ) . '</p>';
			}
		}
		set_query_var( 'newsletter_ads', $ads );
		return $ads;
	}
endif;
