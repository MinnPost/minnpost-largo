<?php
/**
 * Template part for displaying comments on a user's profile
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>
<section class="o-comments-area o-comments-area-user">
	<h3 class="a-comments-title">Recent Comments</h3>
	<ol>
		<?php foreach ( $comments as $comment ) : ?>
			<li class="o-comment" id="o-comment-<?php comment_ID(); ?>">
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
	<?php if ( ! empty( $pagination ) ) : ?>
		<div class="m-pagination">
			<?php echo $pagination; ?>
		</div>
	<?php endif; ?>
</section>
