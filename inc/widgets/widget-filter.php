<?php
/**
 * Filter widget output
 *
 *
 * @package MinnPost Largo
 */

add_filter( 'widget_output', 'minnpost_widget_output_filter', 10, 4 );
function minnpost_widget_output_filter( $widget_output, $widget_type, $widget_id, $sidebar_id ) {
	$widget_output = str_replace( '<h3 class="widget-title"', '<h3 class="a-widget-title"', $widget_output );
	$widget_output = str_replace( '<div class="textwidget custom-html-widget">', '<div class="m-widget-contents m-textwidget m-custom-html-widget">', $widget_output );
	$widget_output = str_replace( ' class="widget_text widget widget_custom_html">', ' class="m-widget m-widget-text m-widget-custom-html">', $widget_output );

	// target a specific widget
	if ( false !== strpos( $widget_output, 'm-widget m-widget-text m-widget-custom-html' ) && 'custom_html' == $widget_type ) {
		$html = '';
		$doc = new DOMDocument();
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

	// target a specific widget
	if ( false !== strpos( $widget_output, 'menu-menu-featured-columns-container' ) && 'nav_menu' == $widget_type ) {
		$html = '';
		$doc = new DOMDocument();
		libxml_use_internal_errors( true );
		$doc->loadHTML( $widget_output );
		libxml_use_internal_errors( false );
		$title = $doc->getElementsByTagName( 'h3' )->item( 0 )->nodeValue;
		$list_items = $doc->getElementsByTagName( 'li' );

		$html .= '<section class="m-featured-columns"><h3 class="a-widget-title">' . $title . '</h3><ul>';
		foreach ( $list_items as $li ) {
			$name = $li->nodeValue;
			$id = get_cat_ID( $name );

			$query = new WP_Query(
				array(
					'posts_per_page' => 1,
					'cat' => $id,
					'orderby' => 'date',
				)
			);

			while ( $query->have_posts() ) {
				$query->the_post();
				$first_title = get_the_title();
			}

			$html .= '
				<li>
					<a href="' . get_category_link( $id ) . '">' .
						minnpost_get_term_figure( $id, 'featured_column', false, false ) .
						'<h3 class="a-featured-title">' . $name . '</h3>' .
						'<p>' . $first_title . '</p>' .
					'</a>
				</li>
			';
		}
		$html .= '</ul></section>';
		return $html;
	}

	return $widget_output;

}


