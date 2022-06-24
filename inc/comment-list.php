<?php

function minnpost_largo_comment( $comment, $args, $depth ) {
	$GLOBALS['comment'] = $comment;
	$class              = array( 'o-comment' );
	$status             = wp_get_comment_status( $comment->comment_ID );
	$class[]            = 'o-comment-' . $status;

	$child_status = function_exists( 'get_comment_status_by_access' ) ? get_comment_status_by_access() : 'approve';
	$children     = $comment->get_children(
		array(
			'status' => $child_status,
		)
	);

	if ( ! empty( $children ) ) {
		$class[] = 'o-comment-has-children';
	}

	if ( 'approved' !== $status ) {
		$class[] = 'o-comment-unpublished';
	}
	if ( (int) get_current_user_id() === (int) $comment->user_id ) {
		$class[] = 'o-comment-by-current-user';
	}

	// comment reply
	$comment_reply_line = '';
	if ( $comment->comment_parent ) {
		$comment_reply_line = sprintf(
			// translators: 1) parent comment url, 2) parent commenter name
			esc_html__( 'Replying to %1$s' ),
			get_comment_author( $comment->comment_parent )
		);
	}

	// comment author
	$comment_byline = '';
	$commenter_name = '';
	if ( $comment->user_id ) {
		$user           = get_userdata( $comment->user_id );
		$commenter_name = $user->display_name;
	} else {
		$commenter_name = comment_author( $comment->comment_ID );
	}
	if ( '' !== $commenter_name ) {
		$comment_byline = sprintf(
			// translators: 1) user profile name/link, 2) comment link, 3) ap style comment date, 4) ap style comment time
			esc_html__( 'By %1$s ' ),
			get_user_name_or_profile_link( $comment )
		);
	}

	// comment date
	$comment_dateline = '';
	if ( function_exists( 'get_ap_comment_date' ) && function_exists( 'get_ap_comment_time' ) ) {
		if ( 'today' === get_ap_comment_date() ) {
			$comment_dateline = sprintf(
				// translators: 1) is the human readable time difference
				_x( '%1$s ago', '%2$s = human-readable time difference', 'minnpost-largo' ),
				human_time_diff(
					get_comment_time( 'U' ),
					strtotime( wp_date( 'Y-m-d H:i:s' ) )
				)
			);
		} else {
			$comment_dateline = sprintf(
				// translators: 1) is the human readable time difference
				_x( 'on %1$s', '%2$s = comment date/time', 'minnpost-largo' ),
				get_ap_comment_date() . ' at ' . get_ap_comment_time()
			);
		}
	} else {
		$comment_dateline = sprintf(
			// translators: 1) user profile name/link, 2) comment link, 3) comment date, 4) comment time
			esc_html__( 'By %1$s on ' ) . '<a class="a-comment-permalink" href="%2$s">%3$s - %4$s</a>',
			get_user_name_or_profile_link( $comment ),
			htmlspecialchars( get_comment_link( $comment->comment_ID ) ),
			get_comment_date(),
			get_comment_time()
		);
	}
	?>
	<li>
		<div <?php comment_class( $class ); ?> id="comment-<?php comment_ID(); ?>">
			<div class="m-comment-meta">
				<?php if ( '' !== $comment_byline ) : ?>
					<div class="a-comment-byline"><?php echo $comment_byline; ?></div>
				<?php endif; ?>
				<?php if ( '' !== $comment_dateline ) : ?>
					<div class="a-comment-dateline"><?php echo $comment_dateline; ?></div>
				<?php endif; ?>
				<?php if ( '' !== $comment_reply_line ) : ?>
					<div class="a-comment-replyline">
						<?php echo $comment_reply_line; ?>
						<a class="a-comment-parent" href="<?php echo htmlspecialchars( get_comment_link( $comment->comment_parent ) ); ?>">
							<i class="fas fa-arrow-alt-circle-up" title="<?php echo esc_html__( 'Go to the previous comment', 'minnpost-largo' ); ?>"></i>
						</a>
					</div>
				<?php endif; ?>
			</div>
			<div class="m-comment-entry">
				<?php if ( 'approved' !== $status && (int) get_current_user_id() === (int) $comment->user_id ) : ?>
					<p class="a-moderation-notice a-moderation-notice-pending"><?php echo __( 'Your comment is awaiting moderation.', 'minnpost-largo' ); ?></p>
				<?php endif; ?>
				<?php comment_text(); ?>
			</div>
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
		</div>
	<?php
	// we omit the closing </li> tag because WordPress adds that automatically
}
