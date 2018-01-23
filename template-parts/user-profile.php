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
	$comments = get_comments( 'user_id=' . $user->ID );
	if ( 1 >= count( $comments ) ) {
	?>
	<section class="o-comments-area o-comments-area-user">
		<h2>Recent Comments</h2>
		<?php foreach ( $comments as $comment ) : ?>
			<?php
			$post_id = $comment->comment_post_ID;
			$post_link = get_the_permalink( $post_id );
			$post_title = get_the_title( $post_id );
			?>
			<p>Posted on <?php echo $comment->comment_date; ?> in response to <a href="<?php echo $post_link; ?>"><?php echo $post_title; ?></a></p>
			<?php echo $comment->comment_content; ?>
		<?php
		endforeach;
		}
		?>
	</section>
</article>
