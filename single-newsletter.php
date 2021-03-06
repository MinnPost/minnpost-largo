<?php
/**
 * The template for displaying newsletter posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package MinnPost Largo
 */

get_header( 'newsletter' );

while ( have_posts() ) :
	the_post();
	$newsletter_type = get_post_meta( get_the_ID(), '_mp_newsletter_type', true );
	get_template_part( 'template-parts/content-newsletter', $newsletter_type );
endwhile; // End of the loop.

get_footer( 'newsletter' );
