<?php
/**
 * Template part for displaying author excerpts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */


$coauthors = get_coauthors( get_the_ID() );
$author_info = '';
foreach ( $coauthors as $coauthor ) {
	$author_id = $coauthor->ID;
	$author_info .= minnpost_get_author_figure( $author_id, 'thumbnail', true, true );
}
if ( '' !== $author_info ) {
?>
<aside class="m-author-info m-author-info-excerpt<?php if ( is_singular() ) { ?> m-author-info-singular<?php } ?><?php if ( is_single() ) { ?> m-author-info-single<?php } ?>">
	<h3 class="a-about-author">About the author:</h3>
	<?php
	foreach ( $coauthors as $coauthor ) :
		$author_id = $coauthor->ID;
		minnpost_author_figure( $author_id, 'thumbnail', true, true );
	endforeach;
	?>
</aside><!-- .m-author-info -->
<?php
}
