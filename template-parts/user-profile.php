<?php
/**
 * Template part for displaying user profile
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>
<article id="user-<?php echo $user->ID; ?>" class="m-user m-user-profile">
	<h1 class="a-user-title"><?php echo $user->display_name; ?></h1>
	<p class="registered-since">On MinnPost since <?php echo minnpost_largo_get_ap_date( $user->user_registered ); ?></p>

	<?php
	// The comment functions use the query var 'cpage', so we'll ensure that's set
	$page = (int) get_query_var( 'page' );
	if ( 0 === $page ) {
		$page = 1;
	}
	$comments_per_page = 10;
	$params            = array(
		'user_id' => $user->ID,
		'status'  => 'approve',
		'number'  => $comments_per_page,
		'offset'  => ( $page - 1 ) * $comments_per_page,
	);
	$comments          = get_comments( $params );
	$total_comments    = get_comments(
		array_merge(
			$params,
			array(
				'count'  => true,
				'offset' => 0,
				'number' => 0,
			)
		)
	);
	$pages             = ceil( $total_comments / $comments_per_page );
	$args              = array(
		'total'     => $pages,
		'current'   => $page,
		'format'    => '?page=%#%',
		'prev_text' => '&lt; Previous',
		'next_text' => 'Next &gt;',
		'type'      => 'list',
		'end_size'  => 3,
		'prev_next' => true,
	);
	$pagination        = paginate_links( $args );
	if ( ! empty( $pagination ) && ( 1 !== $page || $pages !== $page ) ) {
		$doc = new DOMDocument();
		libxml_use_internal_errors( true );
		$doc->loadHTML( $pagination, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_use_internal_errors( false );
		if ( 1 !== $page ) {
			$ul   = $doc->getElementsByTagName( 'ul' )->item( 0 );
			$node = $ul->childNodes->item( 0 );
			$li   = $doc->createElement( 'li' );
			$a    = $doc->createElement( 'a', '&Lt; First' );
			$a->setAttribute( 'href', get_current_url() );
			$li->appendChild( $a );
			$ul->insertBefore( $li, $node );
		}
		if ( $pages !== $page ) {
			$ul     = $doc->getElementsByTagName( 'ul' )->item( 0 );
			$length = $ul->childNodes->length;
			$node   = $ul->childNodes->item( $length );
			$li     = $doc->createElement( 'li' );
			$a      = $doc->createElement( 'a', 'Last &Gt;' );
			$a->setAttribute( 'href', get_current_url() . '?page=' . $pages );
			$li->appendChild( $a );
			$ul->insertBefore( $li, $node );
		}
		$pagination = $doc->saveHTML();
	}
	if ( $comments ) {
		set_query_var( 'comments', $comments );
		set_query_var( 'pagination', $pagination );
		get_template_part( 'template-parts/comments', 'user' );
	}
	?>
</article>
