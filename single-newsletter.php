<?php
/**
 * The template for displaying newsletter posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package MinnPost Largo
 */

get_header( 'newsletter' );
	while ( have_posts() ) : the_post();
		get_template_part( 'template-parts/content-newsletter', get_post_format() );
	endwhile; // End of the loop.
get_footer( 'newsletter' );
