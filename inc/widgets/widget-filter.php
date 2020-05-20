<?php
/**
 * Filter widget output
 *
 *
 * @package MinnPost Largo
 */

// Enable shortcodes in widgets
add_filter( 'widget_text', 'shortcode_unautop' );
add_filter( 'widget_text', 'do_shortcode' );

add_filter( 'widget_output', 'minnpost_widget_output_filter', 10, 4 );
function minnpost_widget_output_filter( $widget_output, $widget_type, $widget_id, $sidebar_id ) {
	$widget_output = str_replace( '<h2 class="widgettitle"', '<h2 class="a-widget-title"', $widget_output );
	$widget_output = str_replace( '<h3 class="widget-title"', '<h3 class="a-widget-title"', $widget_output );
	$widget_output = str_replace( '<div class="textwidget custom-html-widget">', '<div class="m-widget-contents m-textwidget m-custom-html-widget">', $widget_output );
	$widget_output = str_replace( ' class="widget_text widget widget_custom_html">', ' class="m-widget m-widget-text m-widget-custom-html">', $widget_output );
	$widget_output = str_replace( ' class="widget widget_most-commented">', ' class="m-widget m-widget-most-commented">', $widget_output );
	$widget_output = str_replace( ' class="widget widget-zone-posts">', ' class="m-widget m-widget-zone-posts">', $widget_output );

	// target custom html widget
	if ( false !== strpos( $widget_output, 'm-widget m-widget-text m-widget-custom-html' ) && 'custom_html' == $widget_type ) {

		$widget_output = str_replace( '<div id="custom_html-', '<section id="custom_html-', $widget_output );
		// site branding in sitewide footer
		if ( false !== strpos( $widget_output, 'a-site-branding' ) ) {
			$widget_output = str_replace( 'class="m-widget m-widget-text m-widget-custom-html"', 'class="m-widget m-widget-text m-widget-custom-html m-widget-site-branding"', $widget_output );
		}
		// mailchimp form
		if ( false !== strpos( $widget_output, 'm-form-minnpost-form-processor-mailchimp' ) ) {
			$widget_output = str_replace( 'class="m-widget m-widget-text m-widget-custom-html"', 'class="m-widget m-widget-text m-widget-custom-html m-form-minnpost-form-processor-mailchimp"', $widget_output );
		}
		// sponsor list
		if ( false !== strpos( $widget_output, 'a-sponsor-list' ) ) {
			$widget_output = str_replace( 'class="m-widget m-widget-text m-widget-custom-html"', 'class="m-widget m-widget-text m-widget-custom-html m-widget-sponsor-list"', $widget_output );
		}
		$widget_output = str_replace( '</div></div>', '</div></section>', $widget_output );

		$html = '';
		$doc  = new DOMDocument();
		libxml_use_internal_errors( true );
		$doc->loadHTML( $widget_output, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_use_internal_errors( false );

		$paragraphs = $doc->getElementsByTagName( 'p' );
		foreach ( $paragraphs as $paragraph ) {
			foreach ( $paragraph->childNodes as $node ) { // phpcs:ignore WordPress
				if ( isset( $node->tagName ) && 'a' === $node->tagName && 'a-more' === $node->getAttribute( 'class' ) ) { // phpcs:ignore WordPress
					$move = $paragraph->ownerDocument->saveHTML( $paragraph ); // phpcs:ignore WordPress
					$paragraph->parentNode->removeChild( $paragraph ); // phpcs:ignore WordPress
				}
			}
		}

		$html .= $doc->saveHTML();

		if ( isset( $move ) ) {
			$html = str_replace( '</div></section>', '</div>' . $move . '</section>', $html );
		}

		return $html;
	}

	// target minnpost spill widget
	if ( false !== strpos( $widget_output, 'm-widget m-minnpost-spills-widget' ) && 'minnpostspills_widget' == $widget_type ) {
		$widget_output = str_replace( '<div id="minnpostspills_widget-', '<section id="minnpostspills_widget-', $widget_output );
		$widget_output = str_replace(
			'</div>

		
		</div>',
			'</div></div>',
			$widget_output
		);
		$widget_output = str_replace( '</div></div>', '</div></section>', $widget_output );
		$widget_output = str_replace( '<div class="m-widget m-minnpost-spills-widget ', '<section class="m-widget m-minnpost-spills-widget ', $widget_output );
	}

	// target the recommended widget
	if ( false !== strpos( $widget_output, 'class="m-widget m-widget-zone-posts"' ) && 'zoninator_zoneposts_widget' == $widget_type ) {
		$widget_output = str_replace( '<div id="zoninator_zoneposts_widget-', '<section id="zoninator-zoneposts-widget-', $widget_output );
		$widget_output = str_replace(
			'</ul>

		</div>',
			'</ul></div></section>',
			$widget_output
		);
		$widget_output = str_replace( '<ul', '<div class="m-widget-contents"><ul', $widget_output );
	}

	// target most commented widget
	if ( false !== strpos( $widget_output, 'class="m-widget m-widget-most-commented"' ) && 'most-commented' == $widget_type ) {
		$widget_output = str_replace( '<div id="most-commented-', '<section id="most-commented-widget-', $widget_output );
		$widget_output = str_replace( '</ul></div>', '</ul></div></section>', $widget_output );
		$widget_output = str_replace( '<ul', '<div class="m-widget-contents"><ul', $widget_output );
	}

	return $widget_output;

}

add_filter( 'widget_display_callback', 'minnpost_widget_display_callback', 10, 3 );
function minnpost_widget_display_callback( $instance, $widget, $args ) {
	global $post;
	// if this is a newsletter, only show widgets that contain an is_singular( 'newsletter' ) conditional
	if ( is_object( $post ) && 'newsletter' === $post->post_type ) {
		$class = array_column( $instance, 'class' );
		if ( false === strpos( $class[0]['logic'], addslashes( 'is_singular("newsletter")' ) ) && false === strpos( $class[0]['logic'], 'is_singular("newsletter")' ) ) {
			return false;
		}
	}
	return $instance;
}

if ( ! function_exists( 'get_the_image' ) ) :
	function get_the_image( $args ) {
		$attributes = array( 'location' => 'sidebar' );
		$image_data = get_minnpost_post_image( 'author-thumbnail', $attributes );
		$image_id   = $image_data['image_id'];
		$image_url  = $image_data['image_url'];
		$markup     = $image_data['markup'];

		$image         = '<a class="a-spill-item-thumbnail" href="' . get_the_permalink() . '" aria-hidden="true">' . $markup . '</a>';
		$category_name = minnpost_get_category_name();
		$category      = '<p class="a-post-category a-spill-item-category">' . $category_name . '</p>';

		return $image . $category;
	}
endif;

if ( ! function_exists( 'minnpost_largo_extend_widget_options' ) ) :
	add_filter( 'extended_widget_options_logic_override', 'minnpost_largo_extend_widget_options', 10, 1 );
	function minnpost_largo_extend_widget_options( $display_logic ) {
		if ( 'false === is_membership()' === $display_logic ) {
			if ( ! function_exists( 'is_membership' ) ) {
				return false;
			}
		}
		return $display_logic;
	}
endif;
