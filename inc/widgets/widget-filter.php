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

/**
* Change the output of our widgets
* @param string $widget_output
* @param string $widget_type
* @param int $widget_id
* @param int $sidebar_id
* @return string $widget_output
*
*/
if ( ! function_exists( 'minnpost_widget_output_filter' ) ) :
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
			$widget_output = preg_replace( '/\>\s+\</m', '><', $widget_output );
			$widget_output = str_replace(
				'</ul></div>',
				'</ul></div></section>',
				$widget_output
			);
			$widget_output = str_replace( '<ul', '<div class="m-widget-contents"><ul', $widget_output );
		}

		// target most commented widget
		if ( false !== strpos( $widget_output, 'class="m-widget m-widget-most-commented"' ) && 'most-commented' == $widget_type ) {
			$widget_output = str_replace( '<div id="most-commented-', '<section id="most-commented-widget-', $widget_output );
			$widget_output = str_replace( '</ol></div>', '</ol></div></section>', $widget_output );
			$widget_output = str_replace( '<ol', '<div class="m-widget-contents"><ol', $widget_output );
		}

		return $widget_output;

	}
endif;

/**
* Change the display conditions on a widget
*
* @param array $instance
* @param array $widget
* @param array $args
* @return array $widget
*
*/
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

/**
* Filter the output of a WP_Query for a spill widget
* @param string $output
* @param object $query
* @param string $before_title
* @param string $title
* @param string $after_title
* @param array $instance
* @return string $output
*
*/
if ( ! function_exists( 'minnpost_largo_spill_posts' ) ) :
	add_filter( 'minnpost_spills_display_spill_posts', 'minnpost_largo_spill_posts', 10, 6 );
	function minnpost_largo_spill_posts( $output = '', $query, $before_title = '', $title = '', $after_title = '', $instance = array() ) {
		if ( isset( $query ) && $query->have_posts() ) {
			$output = '';
			if ( $title ) {
				$before_title = str_replace( 'widget-title', 'a-widget-title', $before_title );
				if ( isset( $instance['url'] ) && '' !== $instance['url'] ) {
					$output .= $before_title . '<a href="' . site_url( $url ) . '">' . $title . '</a>' . $after_title;
				} else {
					$output .= $before_title . $title . $after_title;
				}
			}
			$output .= '<div class="m-widget-contents">';
			if ( isset( $instance['content'] ) ) {
				$output .= $instance['content'];
			}
			while ( $query->have_posts() ) {
				$query->the_post();
				$output .= '<article id="' . get_the_ID() . '" class="m-post m-post-spill">';
				$output .= '<header class="m-entry-header">';
				$output .= '<h5 class="a-entry-title a-spill-item-title"><a href="' . esc_url( get_the_permalink() ) . '">' . get_the_title() . '</a></h5>';
				if ( '' !== minnpost_get_posted_by() ) {
					$output .= '<div class="m-entry-byline">' . minnpost_get_posted_by() . '</div>';
				}
				if ( '' !== minnpost_get_posted_on() ) {
					$date    = minnpost_get_posted_on();
					$output .= sprintf(
						'<time class="a-entry-date published updated" datetime="%1$s">%2$s</time>',
						$date['published']['machine'],
						$date['published']['human'],
					);
				}
				$output .= '</header>';
				$output .= '</article>';
			}
			wp_reset_postdata();
			$output .= '</div>';
			if ( isset( $instance['button_label'] ) && '' !== $instance['button_label'] ) {
				$output .= '<div class="a-spill-actions"><a href="' . $instance['url'] . '" class="a-button-content">' . $instance['button_label'] . '</a></div>';
			}
		}
		return $output;
	}
endif;

/**
* Extend widget options
* @param string $display_logic
* @return string $display_logic
*
*/
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

/**
* If we're not in production, extend the timeframe for most commented so we can actually see some
* @param array $args
* @param string $post_type
* @param bool $show_pass_post
* @param int $duration
* @return array $args
*
*/
if ( 'production' !== VIP_GO_ENV ) {
	if ( ! function_exists( 'minnpost_largo_most_commented_args' ) ) :
		add_filter( 'most_commented_widget_args_pre_cache', 'minnpost_largo_most_commented_args', 10, 4 );
		add_filter( 'most_commented_widget_args_ids', 'minnpost_largo_most_commented_args', 10, 4 );
		function minnpost_largo_most_commented_args( $args, $post_type, $show_pass_post, $duration ) {
			$args['date_query'] = array(
				'after' => '90 days ago',
			);
			return $args;
		}
	endif;
}
