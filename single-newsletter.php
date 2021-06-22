<?php
/**
 * The template for displaying newsletter posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package MinnPost Largo
 */

//use Pelago\Emogrifier\CssInliner;

use Pelago\Emogrifier\CssInliner;
use Pelago\Emogrifier\HtmlProcessor\CssToAttributeConverter;
use Pelago\Emogrifier\HtmlProcessor\HtmlPruner;

$newsletter_type = get_post_meta( get_the_ID(), '_mp_newsletter_type', true );
$is_legacy       = apply_filters( 'minnpost_largo_newsletter_legacy', false, '', get_the_ID() );

$args = array(
	'newsletter_type' => $newsletter_type,
	'is_legacy'       => $is_legacy,
);

ob_start();
if ( false === $is_legacy ) {
	$css = wp_strip_all_tags( file_get_contents( get_stylesheet_directory() . '/email.css' ) );
	$css = str_replace( 'margin', 'Margin', $css );
	$css = str_replace( '*,:after,:before{box-sizing:inherit}', '', $css );
}
get_header( 'newsletter', $args );

while ( have_posts() ) :
	the_post();
	if ( false === $is_legacy ) {
		get_template_part( 'template-parts/content-newsletter', $newsletter_type, $args );
	} else {
		get_template_part( 'template-parts/content-newsletter-legacy', $newsletter_type, $args );
	}
endwhile; // End of the loop.

get_footer( 'newsletter', $args );

$html = ob_get_contents();
ob_end_clean();
if ( false === $is_legacy ) {
	// get the HTML and inline the CSS.
	$css_inliner = CssInliner::fromHtml( $html )->inlineCss( $css );
	// make a DOMDocument out of it.
	$dom_document = $css_inliner->getDomDocument();
	// remove stuff from the HTML.
	HtmlPruner::fromDomDocument( $dom_document )->removeRedundantClassesAfterCssInlined( $css_inliner );
	// convert some CSS to HTML attributes for older email clients.
	$html = CssToAttributeConverter::fromDomDocument( $dom_document )->render();

	// apply filter that turns the shortcodes into HTML after the CSS has been messed with.
	$html = apply_filters( 'do_shortcodes_after_emogrifier', $html );

}
echo $html;
