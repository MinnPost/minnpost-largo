<?php

function minnpost_largo_comment( $comment, $args, $depth ) {
	$GLOBALS['comment'] = $comment;
	$class              = array( 'o-comment' );
	$status             = wp_get_comment_status( $comment->comment_ID );
	$class[]            = 'o-comment-' . $status;
	if ( 'approved' !== $status ) {
		$class[] = 'o-comment-unpublished';
	}
	if ( intval( get_current_user_id() ) === intval( $comment->user_id ) ) {
		$class[] = 'o-comment-by-current-user';
	}
	?>
	<li <?php comment_class( $class ); ?> id="o-comment-<?php comment_ID(); ?>">
		<div class="m-comment-meta">
			<?php
			if ( $comment->user_id ) {
				$user         = get_userdata( $comment->user_id );
				$comment_name = $user->display_name;
			} else {
				$comment_name = comment_author( $comment->comment_ID );
			}
			?>
			Submitted by <?php echo get_user_name_or_profile_link( $comment ); ?> on <a class="a-comment-permalink" href="<?php echo htmlspecialchars( get_comment_link( $comment->comment_ID ) ); ?>"><?php printf( __( '%1$s - %2$s' ), get_comment_date(), get_comment_time() ); ?></a>. 
		</div>
		<?php if ( intval( get_current_user_id() ) === intval( $comment->user_id ) ) : ?>
			<p class="a-moderation-notice a-moderation-notice-pending"><?php echo __( 'Your comment is awaiting moderation.', 'minnpost-largo' ); ?></p>
		<?php endif; ?>

		<?php comment_text(); ?>

		<div class="a-comment-links">
			<div class="a-comment-link a-comment-link-reply">
				<?php
				comment_reply_link(
					array_merge(
						$args,
						array(
							'depth'     => $depth,
							'max_depth' => $args['max_depth'],
						)
					)
				);
				?>
			</div>
			<?php
			if ( '0' === $comment->comment_approved ) {
				$text = __( 'Approve', 'minnpost-largo' );
			} else {
				$text = __( 'Unapprove', 'minnpost-largo' );
			}
			approve_comment_link( $text, '<div class="a-comment-link a-comment-link-approve">', '</div>' );
			?>
			<?php spam_comment_link( __( 'Spam', 'minnpost-largo' ), '<div class="a-comment-link a-comment-link-spam">', '</div>' ); ?>
			<?php edit_comment_link( __( 'Edit', 'minnpost-largo' ), '<div class="a-comment-link a-comment-link-edit">', '</div>' ); ?>
			<?php trash_comment_link( __( 'Trash', 'minnpost-largo' ), '<div class="a-comment-link a-comment-link-trash">', '</div>' ); ?>
		</div>
	</li>
<?php
}
