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
	$args = array(
		'user_id' => $user->ID,
		'status' => 'approve',
	);
	$comments = get_comments( $args );
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
					<?php echo $comment->comment_content; ?>
				</li>
			<?php endforeach; ?>
		</ol>
	</section>
	<?php } ?>
</article>
