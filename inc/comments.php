<?php
/**
 * Comment settings and such
 *
 * @package MinnPost Largo
 */

if ( ! function_exists( 'user_can_moderate' ) ) :
	function user_can_moderate() {
		$can_moderate = false;
		$user = wp_get_current_user();
		if ( in_array( 'comment_moderator', (array) $user->roles ) ) {
			$can_moderate = true;
		}
		return $can_moderate;
	}
endif;


if ( ! function_exists( 'minnpost_remove_comment_support' ) ) :
	function minnpost_remove_comment_support() {
		remove_post_type_support( 'page', 'comments' );
		remove_post_type_support( 'page', 'trackbacks' );
	}

	// remove comments from pages
	add_action( 'init', 'minnpost_remove_comment_support', 100 );

endif;


if ( ! function_exists( 'get_approve_comment_link' ) ) :
	function get_approve_comment_link( $comment_id = 0 ) {
		$comment = get_comment( $comment_id );

		if ( ! current_user_can( 'edit_comment', $comment->comment_ID ) ) {
			return;
		}

		// make approve/unapprove links work without approval
		$nonce_action = 'approve-comment_' . $comment->comment_ID;
		$nonce = wp_create_nonce( $nonce_action );
		if ( '0' === $comment->comment_approved ) {
			$location = admin_url( 'comment.php?action=approvecomment&amp;c=' ) . $comment->comment_ID . '&_wpnonce=' . esc_attr( $nonce );
		} else {
			$location = admin_url( 'comment.php?action=unapprovecomment&amp;c=' ) . $comment->comment_ID . '&_wpnonce=' . esc_attr( $nonce );
		}

		/**
		 * Filters the comment spam link.
		 *
		 * @since 2.3.0
		 *
		 * @param string $location The spam link.
		 */
		return apply_filters( 'get_approve_comment_link', $location );
	}
endif;

if ( ! function_exists( 'approve_comment_link' ) ) :
	/**
	 * Displays the approve comment link with formatting.
	 *
	 * @since 1.0.0
	 *
	 * @param string $text   Optional. Anchor text. If null, default is 'Approve This'. Default null.
	 * @param string $before Optional. Display before approve link. Default empty.
	 * @param string $after  Optional. Display after approve link. Default empty.
	 */
	function approve_comment_link( $text = null, $before = '', $after = '' ) {
		$comment = get_comment();

		if ( ! current_user_can( 'edit_comment', $comment->comment_ID ) ) {
			return;
		}

		if ( null === $text ) {
			if ( '0' === $comment->comment_approved ) {
				$text = __( 'Approve This' );
			} else {
				$text = __( 'Unapprove This' );
			}
		}

		$link = '<a class="comment-approve-link" href="' . esc_url( get_approve_comment_link( $comment ) ) . '">' . $text . '</a>';

		/**
		 * Filters the comment spam link anchor tag.
		 *
		 * @since 2.3.0
		 *
		 * @param string $link       Anchor tag for the spam link.
		 * @param int    $comment_id Comment ID.
		 * @param string $text       Anchor text.
		 */
		echo $before . apply_filters( 'spam_comment_link', $link, $comment->comment_ID, $text ) . $after;
	}
endif;


if ( ! function_exists( 'get_spam_comment_link' ) ) :
	function get_spam_comment_link( $comment_id = 0 ) {
		$comment = get_comment( $comment_id );

		if ( ! current_user_can( 'edit_comment', $comment->comment_ID ) ) {
			return;
		}

		// make spam link work
		$nonce_action = 'delete-comment_' . $comment->comment_ID;
		$nonce = wp_create_nonce( $nonce_action );
		$location = admin_url( 'comment.php?action=cdc&dt=spam&amp;c=' ) . $comment->comment_ID . '&_wpnonce=' . esc_attr( $nonce );

		/**
		 * Filters the comment spam link.
		 *
		 * @since 2.3.0
		 *
		 * @param string $location The spam link.
		 */
		return apply_filters( 'get_spam_comment_link', $location );
	}
endif;


if ( ! function_exists( 'spam_comment_link' ) ) :
	/**
	 * Displays the spam comment link with formatting.
	 *
	 * @since 1.0.0
	 *
	 * @param string $text   Optional. Anchor text. If null, default is 'Spam This'. Default null.
	 * @param string $before Optional. Display before spam link. Default empty.
	 * @param string $after  Optional. Display after spam link. Default empty.
	 */
	function spam_comment_link( $text = null, $before = '', $after = '' ) {
		$comment = get_comment();

		if ( ! current_user_can( 'edit_comment', $comment->comment_ID ) ) {
			return;
		}

		if ( null === $text ) {
			$text = __( 'Spam This' );
		}

		$link = '<a class="comment-spam-link" href="' . esc_url( get_spam_comment_link( $comment ) ) . '">' . $text . '</a>';

		/**
		 * Filters the comment spam link anchor tag.
		 *
		 * @since 2.3.0
		 *
		 * @param string $link       Anchor tag for the spam link.
		 * @param int    $comment_id Comment ID.
		 * @param string $text       Anchor text.
		 */
		echo $before . apply_filters( 'spam_comment_link', $link, $comment->comment_ID, $text ) . $after;
	}
endif;


if ( ! function_exists( 'get_trash_comment_link' ) ) :
	function get_trash_comment_link( $comment_id = 0 ) {
		$comment = get_comment( $comment_id );

		if ( ! current_user_can( 'edit_comment', $comment->comment_ID ) ) {
			return;
		}

		// make trash link work
		$nonce_action = 'delete-comment_' . $comment->comment_ID;
		$nonce = wp_create_nonce( $nonce_action );
		$location = admin_url( 'comment.php?action=cdc&amp;c=' ) . $comment->comment_ID . '&_wpnonce=' . esc_attr( $nonce );

		/**
		 * Filters the comment trash link.
		 *
		 * @since 2.3.0
		 *
		 * @param string $location The trash link.
		 */
		return apply_filters( 'get_trash_comment_link', $location );
	}
endif;


if ( ! function_exists( 'trash_comment_link' ) ) :
	/**
	 * Displays the trash comment link with formatting.
	 *
	 * @since 1.0.0
	 *
	 * @param string $text   Optional. Anchor text. If null, default is 'Trash This'. Default null.
	 * @param string $before Optional. Display before trash link. Default empty.
	 * @param string $after  Optional. Display after trash link. Default empty.
	 */
	function trash_comment_link( $text = null, $before = '', $after = '' ) {
		$comment = get_comment();

		if ( ! current_user_can( 'edit_comment', $comment->comment_ID ) ) {
			return;
		}

		if ( null === $text ) {
			$text = __( 'Trash This' );
		}

		$link = '<a class="comment-trash-link" href="' . esc_url( get_trash_comment_link( $comment ) ) . '">' . $text . '</a>';

		/**
		 * Filters the comment trash link anchor tag.
		 *
		 * @since 2.3.0
		 *
		 * @param string $link       Anchor tag for the edit link.
		 * @param int    $comment_id Comment ID.
		 * @param string $text       Anchor text.
		 */
		echo $before . apply_filters( 'trash_comment_link', $link, $comment->comment_ID, $text ) . $after;
	}
endif;

if ( ! function_exists( 'get_comment_status_by_access' ) ) :
	function get_comment_status_by_access() {
		$status = 'approve';
		$can_moderate = user_can_moderate();
		if ( true === $can_moderate ) {
			$status = 'all';
		}
		return $status;
	}
endif;
