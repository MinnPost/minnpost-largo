<?php
/**
 * The template for displaying newsletter posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package MinnPost Largo
 */

use Pelago\Emogrifier\CssInliner;
$newsletter_type = get_post_meta( get_the_ID(), '_mp_newsletter_type', true );
$is_legacy       = apply_filters( 'minnpost_largo_newsletter_legacy', false, get_the_ID() );

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
get_header( 'newsletter' );

while ( have_posts() ) :
	the_post();
	if ( false === $is_legacy ) {
		get_template_part( 'template-parts/content-newsletter', $newsletter_type, $args );
	} else {
		get_template_part( 'template-parts/content-newsletter-legacy', $newsletter_type, $args );
	}
endwhile; // End of the loop.

get_footer( 'newsletter' );

$html = ob_get_contents();
ob_end_clean();
if ( false === $is_legacy ) {
	$html = CssInliner::fromHtml( $html )->inlineCss( $css )->render();
	$html = str_replace( '[outlook]', '<!--[if mso]>', $html );
	$html = str_replace( '[/outlook]', '<![endif]-->', $html );
}
echo $html;
