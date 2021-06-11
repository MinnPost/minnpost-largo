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
$postnames = array();
if ( isset( $args['object_name'] ) ) {
	$postnames[] = $args['object_name'] . '-not-found';
}
if ( isset( $args['object_type'] ) ) {
	$postnames[] = $args['object_type'] . '-not-found';
}
$postnames[] = 'page-not-found';
$query       = new WP_Query(
	array(
		'post_type'     => 'page',
		'post_name__in' => $postnames,
		'order'         => 'ASC',
		'orderby'       => 'menu_order',
		'showposts'     => 1,
	)
);
while ( $query->have_posts() ) :
	$query->the_post();
	get_template_part( 'template-parts/content', 'page-not-found' );
endwhile; // End of the loop.
wp_reset_postdata();
