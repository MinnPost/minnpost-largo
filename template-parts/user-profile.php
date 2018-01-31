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
	<h1 class="a-user-title"><?php echo $user->first_name . ' ' . $user->last_name; ?></h1>
	<p class="registered-since">On MinnPost since <?php echo date( 'm/d/y', strtotime( $user->user_registered ) ); ?></p>

	<?php
	# The comment functions use the query var 'cpage', so we'll ensure that's set
	$page = intval( get_query_var( 'page' ) );
	if ( 0 === $page ) {
		$page = 1;
	}
	$comments_per_page = 10;
	$params = array(
		'user_id' => $user->ID,
		'status' => 'approve',
		'number' => $comments_per_page,
		'offset' => $page * $comments_per_page,
	);
	$comments = get_comments( $params );
	$total_comments = get_comments(
		array_merge(
			$params,
			array(
				'count' => true,
				'offset' => 0,
				'number' => 0,
			)
		)
	);
	$pages = ceil( $total_comments / $comments_per_page );
	$args = array(
		'total'     => $pages,
		'current'   => $page,
		'format' => '?page=%#%',
		'prev_text' => '&lt; Previous',
		'next_text' => 'Next &gt;',
		'type' => 'list',
		'end_size' => 3,
		'prev_next' => true,
	);
	$pagination = paginate_links( $args );
	if ( 1 !== $page || $pages !== $page ) {
		$doc = new DOMDocument();
		$doc->loadHTML( $pagination );
		if ( 1 !== $page ) {
			$ul = $doc->getElementsByTagName( 'ul' )->item( 0 );
			$node = $ul->childNodes->item( 0 );
			$li = $doc->createElement( 'li' );
			$a = $doc->createElement( 'a', '&Lt; First' );
			$a->setAttribute( 'href', get_current_url() );
			$li->appendChild( $a );
			$ul->insertBefore( $li, $node );
		}
		if ( $pages !== $page ) {
			$ul = $doc->getElementsByTagName( 'ul' )->item( 0 );
			$length = $ul->childNodes->length;
			$node = $ul->childNodes->item( $length );
			$li = $doc->createElement( 'li' );
			$a = $doc->createElement( 'a', 'Last &Gt;' );
			$a->setAttribute( 'href', get_current_url() . '?page=' . $pages );
			$li->appendChild( $a );
			$ul->insertBefore( $li, $node );
		}
		$pagination = $doc->saveHTML();
	}
	if ( $comments ) {
	?>
	<section class="o-comments-area o-comments-area-user">
		<h3 class="a-comments-title">Recent Comments</h3>
		<ol>
			<?php foreach ( $comments as $comment ) : ?>
				<li>
					<?php
					$post_id = $comment->comment_post_ID;
					$post_link = get_the_permalink( $post_id );
					$post_title = get_the_title( $post_id );
					?>
					<div class="m-comment-meta">Posted on <?php comment_date( 'm/d/y \a\t g:i a' ); ?> in response to <a href="<?php echo $post_link; ?>"><?php echo $post_title; ?></a></div>
					<?php echo wpautop( $comment->comment_content ); ?>
				</li>
			<?php endforeach; ?>
		</ol>
		<div class="m-pagination">
			<?php echo $pagination; ?>
		</div>
	</section>
	<?php } ?>
</article>
