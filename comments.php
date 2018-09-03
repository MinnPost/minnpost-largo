<?php
/**
 * The template for displaying comments
 *
 * This is the template that displays the area of the page that contains both the current comments
 * and the comment form.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if ( post_password_required() ) {
	return;
}
?>

<section id="comments" class="o-comments-area o-comments-area-post">

	<?php

	$status = function_exists( 'get_comment_status_by_access' ) ? get_comment_status_by_access() : 'approve';
	$params = array(
		'post_id' => get_the_ID(),
		'status'  => $status,
		'type'    => array( 'comment' ),
		'orderby' => 'comment_date_gmt', // i think we previously had oldest comments first
		'order'   => 'ASC',
	);
	if ( is_user_logged_in() ) {
		$params['include_unapproved'] = get_current_user_id();
	}
	$count_visible_comments = get_comments(
		array_merge(
			$params,
			array(
				'count' => true,
			)
		)
	);
	?>
	<?php if ( 0 < $count_visible_comments ) : ?>
		<h3 class="a-comments-title">Comments (<?php echo $count_visible_comments; ?>)</h3>
		<ol>
			<?php
			$comments_query = new WP_Comment_Query;
			$comments       = $comments_query->query( $params );
			wp_list_comments(
				array(
					'callback' => 'minnpost_largo_comment',
					'type'     => 'comment',
				)
			);
			?>
		</ol>
		<?php
		// If comments are closed and there are comments, let's leave a little note
		if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) :
			?>
			<p class="no-comments"><?php esc_html_e( 'Comments are closed.', 'minnpost-largo' ); ?></p>
			<?php
		endif;
		?>

	<?php else : ?>
		<h3 class="a-comments-title"><?php echo esc_html_e( 'No comments yet', 'minnpost-largo' ); ?></h3>
	<?php endif; ?>

	<?php
	$logged_in_as = '<p class="a-form-instructions">' . sprintf(
		/* translators: 1: edit user link, 2: accessibility text, 3: user name */
		__( 'You are commenting as <a href="%1$s" aria-label="%2$s">%3$s</a>.' ),
		site_url( '/user/' ),
		/* translators: %s: user name */
		esc_attr( sprintf( __( 'You are logged in as %s. Edit your profile.' ), $user_identity ) ),
		$user_identity
	) . '</p>';

	// if the user is allowed to comment, show them the comment form
	if ( ! current_user_can( 'not_comment', get_the_ID() ) ) {
		$comment_form_args = array(
			'logged_in_as'       => $logged_in_as,
			'title_reply_before' => '<h3 id="reply-title" class="a-comment-reply-title">',
			'class_form'         => 'm-form m-form-comment-form m-form-standalone',
			'comment_field'      => '<div class="m-form-item m-form-item-comment"><label for="comment">' . _x( 'Comment', 'noun' ) . '</label> <textarea id="comment" name="comment" cols="45" rows="8" maxlength="65525" aria-required="true" required="required"></textarea></div>',
			'submit_field'       => '<div class="m-form-actions">%1$s %2$s</div>',
		);
		comment_form( $comment_form_args );
	}
	?>
</section><!-- #comments -->
