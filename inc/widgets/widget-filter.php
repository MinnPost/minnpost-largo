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
	$widget_output = str_replace( ' class="widget popular-widget">', ' class="m-widget m-widget-popular-widget">', $widget_output );
	$widget_output = str_replace( ' class="widget rpwe_widget recent-posts-extended">', ' class="m-widget m-widget-rpwe-widget m-widget-recent-posts-extended">', $widget_output );

	// target custom html widget
	if ( false !== strpos( $widget_output, 'm-widget m-widget-text m-widget-custom-html' ) && 'custom_html' == $widget_type ) {

		$widget_output = str_replace( '<div id="custom_html-', '<section id="custom_html-', $widget_output );
		if ( false !== strpos( $widget_output, 'm-form-newsletter-shortcode-dc' ) ) {
			$widget_output = str_replace( 'class="m-widget m-widget-text m-widget-custom-html"', 'class="m-widget m-widget-text m-widget-custom-html m-widget-form-dc"', $widget_output );
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
			foreach ( $paragraph->childNodes as $node ) {
				if ( isset( $node->tagName ) && 'a' === $node->tagName && 'a-more' === $node->getAttribute( 'class' ) ) {
					$move = $paragraph->ownerDocument->saveHTML( $paragraph );
					$paragraph->parentNode->removeChild( $paragraph );
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
		$widget_output = str_replace( '</div></div>', '</div></section>', $widget_output );
		$widget_output = str_replace( '<div class="m-widget m-minnpost-spills-widget ', '<section class="m-widget m-minnpost-spills-widget ', $widget_output );
	}

	// target featured columns widget
	if ( false !== strpos( $widget_output, 'menu-menu-featured-columns-container' ) && 'nav_menu' == $widget_type ) {
		$html = '';
		$doc  = new DOMDocument();
		libxml_use_internal_errors( true );
		$doc->loadHTML( $widget_output, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_use_internal_errors( false );
		$title      = $doc->getElementsByTagName( 'h3' )->item( 0 )->nodeValue;
		$list_items = $doc->getElementsByTagName( 'li' );

		$html .= '<section class="m-featured-columns"><h3 class="a-widget-title">' . $title . '</h3><ul>';
		foreach ( $list_items as $li ) {
			$name = $li->nodeValue;
			$id   = get_cat_ID( $name );

			$query = new WP_Query(
				array(
					'posts_per_page' => 1,
					'cat'            => $id,
					'orderby'        => 'date',
					'ep_integrate'   => true,
				)
			);

			while ( $query->have_posts() ) {
				$query->the_post();
				$first_title = get_the_title();
				$first_id    = get_the_ID();
			}

			if ( isset( $first_title ) ) {

				$html .= '
					<li>
						<a href="' . get_permalink( $first_id ) . '">' .
							minnpost_get_term_figure( $id, 'category-featured-column', false, false ) .
							'<h3 class="a-featured-title">' . $name . '</h3>' .
							'<p>' . $first_title . '</p>' .
						'</a>
					</li>
				';
			}
		}
		$html .= '</ul></section>';
		return $html;
	}

	// target recent stories widget
	if ( false !== strpos( $widget_output, 'class="m-widget m-widget-rpwe-widget m-widget-recent-posts-extended"' ) && 'rpwe_widget' == $widget_type ) {
		$widget_output = str_replace( '<div id="rpwe_widget-', '<section id="rpwe_widget-', $widget_output );
		$widget_output = str_replace( '</div><!-- Generated by http://wordpress.org/plugins/recent-posts-widget-extended/ --></div>', '</div><!-- Generated by http://wordpress.org/plugins/recent-posts-widget-extended/ --></section>', $widget_output );
		$widget_output = str_replace( '<div  class="rpwe-block ">', '<div class="m-widget-contents rpwe-block">', $widget_output );
		$widget_output = str_replace( '<h3 class="rpwe-title">', '<p class="a-post-title a-spill-item-title">', $widget_output );
		$widget_output = str_replace( '</h3></li>', '</p></li>', $widget_output );
	}

	// target popular widget
	if ( false !== strpos( $widget_output, 'class="m-widget m-widget-popular-widget"' ) && 'popular-widget' == $widget_type ) {
		$widget_output = str_replace( '<div id="popular-widget-', '<section id="popular-widget-', $widget_output );
		$widget_output = str_replace( '</div><!--.pop-layout-v--></div>', '</div></section>', $widget_output );
		$widget_output = str_replace( '<a href="#commented" rel="nofollow">Most Commented</a>', '<h3 class="a-widget-title"><a href="#commented" rel="nofollow">Most Commented</a></h3>', $widget_output );
		$widget_output = str_replace( '<div class="pop-inside-', '<div class="m-widget-contents pop-inside-', $widget_output );
	}

	return $widget_output;

}

add_filter( 'widget_display_callback', 'minnpost_widget_display_callback', 10, 3 );
function minnpost_widget_display_callback( $instance, $widget, $args ) {
	global $post;
	// if this is a newsletter, only show newsletter widgets
	if ( is_object( $post ) && 'newsletter' === $post->post_type ) {
		$class = array_column( $instance, 'class' );
		if ( addslashes( 'is_singular("newsletter")' ) !== $class[0]['logic'] && 'is_singular("newsletter")' !== $class[0]['logic'] ) {
			return false;
		}
	}
	return $instance;
}

if ( ! function_exists( 'minnpost_recent_stories_widget' ) ) :
	add_filter( 'rpwe_default_query_arguments', 'minnpost_recent_stories_widget', 10, 1 );
	function minnpost_recent_stories_widget( $query ) {
		global $wpdb;
		$results       = $wpdb->get_results( 'SELECT DISTINCT `post_id` FROM wp_postmeta WHERE meta_key LIKE "_zoninator_order_%"', 'ARRAY_A' );
		$exclude_ids   = array_column( $results, 'post_id' );
		$exclude_ids[] = get_the_ID();
		$query         = array(
			'post__not_in'     => $exclude_ids,
			'post_type'        => 'post',
			'orderby'          => 'modified',
			'ep_integrate'     => true,
			'date_query'       => array(
				array(
					'after' => '7 days ago',
				),
			),
			'category__not_in' => array( 55577, 55630, 55590, 55628, 55569, 55575 ),
		);
		return $query;
	}
endif;

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
