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

<section id="comments" class="o-comments-area">

	<h3 class="a-comments-title">Comments<?php if ( have_comments() ) { $count = wp_count_comments( get_the_ID() ); echo ' (' . $count->approved . ')'; } ?></h3>

	<?php
	if ( have_comments() ) :
	?>
		<ol class="comment-list">
			<?php
				wp_list_comments( array(
					'callback' => 'minnpost_largo_comment',
					'type' => 'comment',
				) );
			?>
		</ol><!-- .comment-list -->
	<?php
	endif; // Check for have_comments().

	// If comments are closed and there are comments, let's leave a little note, shall we?
	if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) :
	?>
		<p class="no-comments"><?php esc_html_e( 'Comments are closed.', 'minnpost-largo' ); ?></p>
	<?php
	endif;

	comment_form();
	?>

</section><!-- #comments -->
