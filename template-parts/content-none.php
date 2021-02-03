<?php
/**
 * Template part for displaying a 404
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */
?>

<?php
$query = new WP_Query(
	array(
		'post_type' => 'page',
		'pagename'  => 'page-not-found',
	)
);
while ( $query->have_posts() ) :
	$query->the_post();
	get_template_part( 'template-parts/content', 'page' );
endwhile; // End of the loop.
wp_reset_postdata();
