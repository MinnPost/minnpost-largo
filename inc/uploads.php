<?php
/**
 * Do things for media uploads
 *
 * @package MinnPost Largo
 */

/**
* Add image settings for posts.
* These are created when an image is uploaded.
*
*/
if ( ! function_exists( 'minnpost_image_settings' ) ) :
	add_action( 'after_setup_theme', 'minnpost_image_settings' );
	function minnpost_image_settings() {
		add_theme_support( 'html5', array( 'caption' ) );
		add_image_size( 'medium_large', '768', '0', false );
		add_image_size( '1536x1536', '1536', '1536', false );
		add_image_size( '2048x2048', '2048', '2048', false );
		add_image_size( 'feature', '190', '9999', false );
		add_image_size( 'feature-large', '400', '400', false );
		add_image_size( 'feature-medium', '190', '125', true );
		add_image_size( 'newsletter-thumbnail', '80', '60', true );
		add_image_size( 'author-image', '190', '9999', false );
		add_image_size( 'author-teaser', '75', '9999', false );
		add_image_size( 'author-thumbnail', '130', '85', true );
		add_image_size( 'partner-logo', '200', '9999', false );
		add_image_size( 'sponsor-thumb', '130', '130', false ); 
	}
endif;

/**
* Add image sizes to media chooser
* These are added to dropdown when images are chosen in posts
*
*/
if ( ! function_exists( 'minnpost_image_size_chooser' ) ) :
	add_filter( 'image_size_names_choose', 'minnpost_image_size_chooser' );
	function minnpost_image_size_chooser( $sizes ) {
		return array_merge( $sizes, array(
			'feature'                  => __( 'Feature', 'minnpost-largo' ),
			'feature-large'            => __( 'Feature large', 'minnpost-largo' ),
			'feature-medium'           => __( 'Feature medium', 'minnpost-largo' ),
			'newsletter-thumbnail'     => __( 'Newsletter thumbnail', 'minnpost-largo' ),
			'category-featured-column' => __( 'Featured column', 'minnpost-largo' ),
			'author-image'             => __( 'Author photo', 'minnpost-largo' ),
			'author-teaser'            => __( 'Author teaser', 'minnpost-largo' ),
			'author-thumbnail'         => __( 'Author thumbnail', 'minnpost-largo' ),
			'partner-logo'             => __( 'Partner logo', 'minnpost-largo' ),
		) );
	}
endif;

/**
* Size attribute for thumbnail images
*
* @param array $attributes
* @param object $attachment
* @param string|array $size
*
* @return array $attributes
*/
if ( ! function_exists( 'minnpost_post_thumbnail_sizes_attr' ) ) :
	add_filter( 'wp_get_attachment_image_attributes', 'minnpost_post_thumbnail_sizes_attr', 10, 3 );
	function minnpost_post_thumbnail_sizes_attr( $attributes = array(), $attachment, $size = '' ) {
		if ( 'post-thumbnail' === $size ) {
			is_active_sidebar( 'sidebar-1' ) && $attributes['sizes']   = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 984px) 60vw, (max-width: 1362px) 62vw, 840px';
			! is_active_sidebar( 'sidebar-1' ) && $attributes['sizes'] = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 1362px) 88vw, 1200px';
		}
		return $attributes;
	}
endif;

/**
* Whether this image should be watermarked. For us, this should depend on the member level field of the post
*
* @param bool $allowed
* @param int $post_id
*
* @return bool $allowed
*/
if ( ! function_exists( 'image_watermark_allowed' ) ) :
	add_filter( 'image_watermark_allowed', 'minnpost_image_watermark_allowed', 10, 2 );
	function minnpost_image_watermark_allowed( $allowed, $post_id ) {
		// allowed default is false
		$access_level = get_post_meta( $post_id, '_access_level', true );
		if ( '' !== $access_level ) {
			if ( class_exists( 'Blocked_Content_Template' ) ) {
				$blocked_content_template = Blocked_Content_Template::get_instance();
				$minimum_level            = $blocked_content_template->get_minimum_branded_level();
				if ( $access_level >= $minimum_level ) {
					$allowed = true;
				}
			} else {
				$allowed = true;
			}
		}
		return $allowed;
	}
endif;

/**
 * Get credit HTML
 *
 * @param int $post_id
 * @return string $credit
 *
 */
if ( ! function_exists( 'get_media_credit_html' ) ) :
	function get_media_credit_html( $post_id = 0 ) {
		if ( 0 === $post_id ) {
			return '';
		}
		$credit_meta = get_post_meta( $post_id, '_wp_attachment_source_name', true );
		$credit_url  = get_post_meta( $post_id, '_wp_attachment_source_url', true );

		// deprecated credit field
		if ( '' === $credit_meta ) {
			$credit_meta = get_post_meta( $post_id, 'media_credit', true );
		}

		// deprecated credit url field
		if ( '' === $credit_url ) {
			$credit_url = get_post_meta( $post_id, 'media_credit_url', true );
		}

		$credit = '';

		if ( '' !== $credit_meta ) {
			if ( ! empty( $credit_url ) ) {
				$credit = '<a href="' . esc_url( $credit_url ) . '">' . $credit_meta . '</a>';
			} else {
				$credit = $credit_meta;
			}
		}

		return $credit;
	}
endif;

/**
 * Put credit with caption into editor
 *
 * @param string $html
 * @param int $id
 * @param string $caption
 * @param string $title
 * @param string $align
 * @param string $url
 * @param string $size
 * @param string $alt
 * @return string $html
 *
 */
if ( ! function_exists( 'minnpost_largo_image_add_caption_with_credit' ) ) :
	// remove the existing filter
	remove_filter( 'image_send_to_editor', 'image_add_caption', 20, 8 );

	// add the new filter
	add_filter( 'image_send_to_editor', 'minnpost_largo_image_add_caption_with_credit', 20, 8 );
	function minnpost_largo_image_add_caption_with_credit( $html, $id, $caption, $title, $align, $url, $size, $alt = '' ) {

		/**
		* Filters the caption text and adds source info.
		*
		* Note: If the caption text is empty, the caption shortcode will not be appended
		* to the image HTML when inserted into the editor.
		*
		* Passing an empty value also prevents the {@see 'image_add_caption_shortcode'}
		* Filters from being evaluated at the end of image_add_caption().
		*
		* @since 4.1.0
		*
		* @param string $caption The original caption text.
		* @param int    $id      The attachment ID.
		*/
		$caption = apply_filters( 'image_add_caption_text', $caption, $id );
		$credit  = get_media_credit_html( $id );

		/**
		* Filters whether to disable captions.
		*
		* Prevents image captions from being appended to image HTML when inserted into the editor.
		*
		* @since 2.6.0
		*
		* @param bool $bool Whether to disable appending captions. Returning true to the filter
		*                   will disable captions. Default empty string.
		*/
		if ( ( empty( $caption ) && empty( $credit ) ) || apply_filters( 'disable_captions', '' ) ) {
			return $html;
		}

		$id = ( 0 < (int) $id ) ? 'attachment_' . $id : '';

		if ( ! preg_match( '/width=["\']([0-9]+)/', $html, $matches ) ) {
			return $html;
		}

		$width = $matches[1];

		$caption = str_replace( array( "\r\n", "\r" ), "\n", $caption );
		$caption = preg_replace_callback( '/<[a-zA-Z0-9]+(?: [^<>]+>)*/', '_cleanup_image_add_caption', $caption );

		// Convert any remaining line breaks to <br>.
		$caption = preg_replace( '/[ \n\t]*\n[ \t]*/', '<br />', $caption );

		$html = preg_replace( '/(class=["\'][^\'"]*)align(none|left|right|center)\s?/', '$1', $html );

		if ( empty( $align ) ) {
			$align = 'none';
		}

		$credit_html = '';
		if ( '' !== $credit ) {
			$credit_html = '[image_credit]' . $credit . '[/image_credit]';
		}

		$caption_html = '';
		if ( '' !== $caption ) {
			$caption_html = '[image_caption]' . $caption . '[/image_caption]';
		}

		$shcode = '[caption id="' . $id . '" align="align' . $align . '" width="' . $width . '"]' . $html . '<code>' . $credit_html . $caption_html . '</code>[/caption]';

		/**
		* Filters the image HTML markup including the caption shortcode.
		*
		* @since 2.6.0
		*
		* @param string $shcode The image HTML markup with caption shortcode.
		* @param string $html   The image HTML markup.
		*/

		return apply_filters( 'image_add_caption_shortcode', $shcode, $html );
	}
endif;

/**
 * Handle the [image_caption] shortcode
 *
 * @param array $attributes
 * @param string $content
 * @return string $content
 *
 */
if ( ! function_exists( 'minnpost_largo_image_caption' ) ) :
	add_shortcode( 'image_caption', 'minnpost_largo_image_caption' );
	function minnpost_largo_image_caption( $attributes, $content = '' ) {
		return '<div class="a-media-meta a-media-caption">' . $content . '</div>';
	}
endif;

/**
 * Handle the [image_credit] shortcode
 *
 * @param array $attributes
 * @param string $content
 * @return string $content
 *
 */
if ( ! function_exists( 'minnpost_largo_image_credit' ) ) :
	add_shortcode( 'image_credit', 'minnpost_largo_image_credit' );
	function minnpost_largo_image_credit( $attributes, $content = '' ) {
		return '<div class="a-media-meta a-media-credit">' . $content . '</div>';
	}
endif;

/**
 * Handle deprecated [div class="credit"] shortcode
 *
 * @param array $attributes
 * @param string $content
 * @return string $content
 *
 */
if ( ! function_exists( 'minnpost_largo_div_shortcode' ) ) :
	add_shortcode( 'div', 'minnpost_largo_div_shortcode' );
	function minnpost_largo_div_shortcode( $attributes, $content = '' ) {
		$a = shortcode_atts( array(
			'class' => '',
		), $attributes );
		if ( 'caption' === $a['class'] ) {
			return '<div class="a-media-meta a-media-caption">' . $content . '</div>';
		} elseif ( 'credit' === $a['class'] ) {
			return '<div class="a-media-meta a-media-credit">' . $content . '</div>';
		}
		return $content;
	}
endif;

/**
 * Modify rendering of [caption] shortcode from WordPress Core on the front end
 *
 * @param string $output
 * @param array $attributes
 * @param string $content
 * @return string $html
 *
 */
if ( ! function_exists( 'minnpost_largo_fix_shortcode' ) ) :
	add_filter( 'img_caption_shortcode', 'minnpost_largo_fix_shortcode', 10, 3 );
	function minnpost_largo_fix_shortcode( $output, $attributes, $content ) {
		$attributes          = shortcode_atts( array(
			'id'      => '',
			'align'   => 'alignnone',
			'width'   => '',
			'caption' => '',
			'class'   => '',
		), $attributes, 'caption' );
		$attributes['width'] = (int) $attributes['width'];
		if ( $attributes['width'] < 1 || empty( $attributes['caption'] ) ) {
			return $content;
		}
		if ( ! empty( $attributes['id'] ) ) {
			$attributes['id'] = 'id="' . esc_attr( sanitize_html_class( $attributes['id'] ) ) . '" ';
		}
		$class = trim( 'wp-caption ' . $attributes['align'] . ' ' . $attributes['class'] );
		$width = $attributes['width'];
		/**
		 * Filters the width of an image's caption.
		 *
		 * By default, the caption is 10 pixels greater than the width of the image,
		 * to prevent post content from running up against a floated image.
		 *
		 * @since 3.7.0
		 *
		 * @see img_caption_shortcode()
		 *
		 * @param int    $width      Width of the caption in pixels. To remove this inline style,
		 *                         return zero.
		 * @param array  $attributes Attributes of the caption shortcode.
		 * @param string $content    The image element, possibly wrapped in a hyperlink.
		 */
		$caption_width = apply_filters( 'img_caption_shortcode_width', $width, $attributes, $content );

		$style = '';
		if ( $caption_width ) {
			$style = 'style="width: ' . (int) $caption_width . 'px" ';
		}
		$html = '<figure ' . $attributes['id'] . $style . 'class="m-content-media ' . esc_attr( $class ) . '">'
			. do_shortcode( $content ) . '<figcaption class="m-content-caption wp-caption-text">' . do_shortcode( $attributes['caption'] ) . '</figcaption></figure>';
		$html = str_replace( '<code>', '', $html );
		$html = str_replace( '</code>', '', $html );
		// deprecated
		$html = str_replace( '<br />', '', $html );
		return $html;
	}
endif;

// don't break responsive images by adding a width to the figure tag
add_filter( 'img_caption_shortcode_width', '__return_false' );

/**
* Set the image size for the staff list page
*
* @param string $image_size
* @return string $image_size
*
*/
if ( ! function_exists( 'minnpost_largo_staff_image_size' ) ) :
	add_filter( 'staff_user_post_list_image_size', 'minnpost_largo_staff_image_size' );
	function minnpost_largo_staff_image_size( $image_size ) {
		$image_size = 'photo';
		return $image_size;
	}
endif;

