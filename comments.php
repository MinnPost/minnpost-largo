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

	<h3 class="a-comments-title">Comments<?php if ( have_comments() ) { $count = wp_count_comments( get_the_ID() ); echo ' (' . $count->approved . ')'; } ?></h3>

	<?php if ( have_comments() ) : ?>
		<ol>
			<?php
			wp_list_comments(
				array(
					'callback' => 'minnpost_largo_comment',
					'type' => 'comment',
				)
			);
			?>
		</ol>
	<?php endif; ?>

	<?php
	// If comments are closed and there are comments, let's leave a little note
	if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) :
	?>
		<p class="no-comments"><?php esc_html_e( 'Comments are closed.', 'minnpost-largo' ); ?></p>
	<?php
	endif;

	$logged_in_as = '<p class="a-form-instructions">' . sprintf(
		/* translators: 1: edit user link, 2: accessibility text, 3: user name */
		__( 'You are commenting as <a href="%1$s" aria-label="%2$s">%3$s</a>.' ),
		site_url( '/user/' ),
		/* translators: %s: user name */
		esc_attr( sprintf( __( 'You are logged in as %s. Edit your profile.' ), $user_identity ) ),
		$user_identity
	) . '</p>';

	$comment_form_args = array(
		'logged_in_as' => $logged_in_as,
		'title_reply_before' => '<h3 id="reply-title" class="a-comment-reply-title">',
		'class_form' => 'm-form m-form-comment-form m-form-standalone',
		'comment_field' => '<div class="m-form-item m-form-item-comment"><label for="comment">' . _x( 'Comment', 'noun' ) . '</label> <textarea id="comment" name="comment" cols="45" rows="8" maxlength="65525" aria-required="true" required="required"></textarea></div>',
		'submit_field' => '<div class="m-form-actions">%1$s %2$s</div>',
	);
	comment_form( $comment_form_args );
	?>

</section><!-- #comments -->
