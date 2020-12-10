<?php
/**
 * The template for displaying newsletter posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package MinnPost Largo
 */

use Pelago\Emogrifier\CssInliner;
ob_start();
//$css = wpcom_vip_file_get_contents( get_theme_file_uri() . '/style.css' );
$test = vip_safe_wp_remote_get( get_theme_file_uri() . '/style.css' );
//error_log( 'css is ' . $css );
error_log( 'test is ' . print_r( $test, true ) );
//$css = wpcom_vip_file_get_contents()
$css = 'a { color: #f00; }';
get_header( 'newsletter' );

while ( have_posts() ) :
	the_post();
	$newsletter_type = get_post_meta( get_the_ID(), '_mp_newsletter_type', true );
	$is_legacy       = apply_filters( 'minnpost_largo_newsletter_legacy', false, get_the_ID() );
	if ( false === $is_legacy ) {
		get_template_part( 'template-parts/content-newsletter', $newsletter_type );
	} else {
		get_template_part( 'template-parts/content-newsletter-legacy', $newsletter_type );
	}
endwhile; // End of the loop.

get_footer( 'newsletter' );

$html = ob_get_contents();
ob_end_clean();

$html = CssInliner::fromHtml( $html )->inlineCss( $css )->render();
echo $html;
