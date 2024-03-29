<?php
/**
 * Comment settings and such
 *
 * @package MinnPost Largo
 */

/**
 * Detect whether a user has the capability of moderating comments
 * This depends on the comment_moderator role and its capabilities
 *
 * @return bool $can_moderate
 */
if ( ! function_exists( 'user_can_moderate' ) ) :
	function user_can_moderate() {
		$can_moderate = false;
		if ( current_user_can( 'moderate_comments' ) ) {
			$can_moderate = true;
		}
		return $can_moderate;
	}
endif;

/**
* Change the URL for the post link in the "In Response To" column of the comment screen for comment moderators since they can't edit posts
*
* @param string $link
* @param int $post_id
* @param string $context
* @return string $link
*/
if ( ! function_exists( 'minnpost_largo_comment_table_post_link' ) ) :
	add_action( 'get_edit_post_link', 'minnpost_largo_comment_table_post_link', 10, 3 );
	function minnpost_largo_comment_table_post_link( $link, $post_id, $context ) {
		if ( current_user_can( 'comment_moderator' ) ) {
			$link = get_permalink( $post_id );
		}
		return $link;
	}
endif;

/**
* Modify the columns on the edit-comments admin page
*
* @param array $columns
* @return array $columns
*/
if ( ! function_exists( 'minnpost_largo_comment_columns' ) ) :
	add_filter( 'manage_edit-comments_columns', 'minnpost_largo_comment_columns' );
	function minnpost_largo_comment_columns( $columns ) {
		unset( $columns['date'] );
		$columns['custom_date'] = _x( 'In Context', 'column name' );
		return $columns;
	}
endif;

/**
* Set up our custom comment date column for the edit-comments screen
*
* @param string $column
* @return int $comment_id
*/
if ( ! function_exists( 'minnpost_largo_comment_date_column' ) ) :
	add_action( 'manage_comments_custom_column', 'minnpost_largo_comment_date_column', 10, 2 );
	function minnpost_largo_comment_date_column( $column, $comment_id ) {
		if ( 'custom_date' === $column ) {
			$comment   = get_comment( $comment_id );
			$submitted = sprintf(
				/* translators: 1: comment date, 2: comment time */
				__( 'Submitted on %1$s at %2$s' ),
				/* translators: comment date format. See https://secure.php.net/date */
				get_comment_date( __( 'Y/m/d' ), $comment ),
				get_comment_date( __( 'g:i a' ), $comment )
			);

			echo '<div class="submitted-on">';
			if ( ! empty( $comment->comment_post_ID ) ) {
				printf(
					'<a href="%s" target="wp-comment-%s">View comment in context</a> (%s)',
					esc_url( get_comment_link( $comment ) ),
					$comment_id,
					$submitted
				);
			} else {
				echo $submitted;
			}
			echo '</div>';
		}
	}
endif;

/**
* Remove comment support from post types where we don't want comments
*/
if ( ! function_exists( 'minnpost_remove_comment_support' ) ) :
	add_action( 'init', 'minnpost_remove_comment_support', 100 );
	function minnpost_remove_comment_support() {
		// page
		remove_post_type_support( 'page', 'comments' );
		remove_post_type_support( 'page', 'trackbacks' );
		// event
		remove_post_type_support( 'tribe_events', 'comments' );
		remove_post_type_support( 'tribe_events', 'trackbacks' );
	}
endif;

/**
* Get the link to approve comments
*
* @param int $comment_id
* @return string from get_approve_comment_link
*/
if ( ! function_exists( 'get_approve_comment_link' ) ) :
	function get_approve_comment_link( $comment_id = 0 ) {
		$comment = get_comment( $comment_id );

		if ( ! current_user_can( 'edit_comment', $comment->comment_ID ) ) {
			return;
		}

		// make approve/unapprove links work without approval
		$nonce_action = 'approve-comment_' . $comment->comment_ID;
		$nonce        = wp_create_nonce( $nonce_action );
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

/**
 * Displays the approve comment link with formatting.
 *
 * @param string $text   Optional. Anchor text. If null, default is 'Approve This'. Default null.
 * @param string $before Optional. Display before approve link. Default empty.
 * @param string $after  Optional. Display after approve link. Default empty.
 */
if ( ! function_exists( 'approve_comment_link' ) ) :
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

/**
* Get the link to mark comments as spam
*
* @param int $comment_id
* @return string from get_spam_comment_link
*/
if ( ! function_exists( 'get_spam_comment_link' ) ) :
	function get_spam_comment_link( $comment_id = 0 ) {
		$comment = get_comment( $comment_id );

		if ( ! current_user_can( 'edit_comment', $comment->comment_ID ) ) {
			return;
		}

		// make spam link work
		$nonce_action = 'delete-comment_' . $comment->comment_ID;
		$nonce        = wp_create_nonce( $nonce_action );
		$location     = admin_url( 'comment.php?action=cdc&dt=spam&amp;c=' ) . $comment->comment_ID . '&_wpnonce=' . esc_attr( $nonce );

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


/**
 * Displays the spam comment link with formatting.
 *
 * @param string $text   Optional. Anchor text. If null, default is 'Spam This'. Default null.
 * @param string $before Optional. Display before spam link. Default empty.
 * @param string $after  Optional. Display after spam link. Default empty.
 */
if ( ! function_exists( 'spam_comment_link' ) ) :
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

/**
* Get the link to delete comments
*
* @param int $comment_id
* @return string from get_trash_comment_link
*/
if ( ! function_exists( 'get_trash_comment_link' ) ) :
	function get_trash_comment_link( $comment_id = 0 ) {
		$comment = get_comment( $comment_id );
		if ( ! current_user_can( 'edit_comment', $comment->comment_ID ) ) {
			return;
		}
		// make trash link work
		$nonce_action = 'delete-comment_' . $comment->comment_ID;
		$nonce        = wp_create_nonce( $nonce_action );
		$location     = admin_url( 'comment.php?action=cdc&amp;c=' ) . $comment->comment_ID . '&_wpnonce=' . esc_attr( $nonce );
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

/**
* Displays the trash comment link with formatting.
*
* @param string $text   Optional. Anchor text. If null, default is 'Trash This'. Default null.
* @param string $before Optional. Display before trash link. Default empty.
* @param string $after  Optional. Display after trash link. Default empty.
*/
if ( ! function_exists( 'trash_comment_link' ) ) :
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

/**
* Get accessible comment statuses based on the user's ability to moderate
*
* @return string $status
*/
if ( ! function_exists( 'get_comment_status_by_access' ) ) :
	function get_comment_status_by_access() {
		$status       = 'approve';
		$can_moderate = user_can_moderate();
		if ( true === $can_moderate ) {
			$status = 'all';
		}
		return $status;
	}
endif;

/**
* Remove the scheduled delete action from the theme.
* This keeps the trash from being emptied, ever. We leave unapproved comments in there.
*/
if ( ! function_exists( 'remove_schedule_delete' ) ) :
	function remove_schedule_delete() {
		remove_action( 'wp_scheduled_delete', 'wp_scheduled_delete' );
	}
	add_action( 'init', 'remove_schedule_delete' );
endif;

/**
* Set max comments depth to 99 on the discussion settings page
*
* @param int $max
* @return int $max
*/
add_filter(
	'thread_comments_depth_max',
	function( $max ) {
		return 99;
	}
);

/**
* Use a spinner image from Core instead of the one from the lazy load comments plugin
 *
* @param string $image_tag
* @return string $image_tag
*/
if ( ! function_exists( 'minnpost_largo_lazy_load_loading_image' ) ) :
	add_filter( 'llc_loader_element_content', 'minnpost_largo_lazy_load_loading_image' );
	function minnpost_largo_lazy_load_loading_image( $image_tag ) {
		$image_tag = '<img src="' . admin_url( '/images/spinner.gif' ) . '" srcset="' . admin_url( '/images/spinner.gif' ) . ' 1x, ' . admin_url( 'images/spinner-2x.gif' ) . ' 2x,">';
		return $image_tag;
	}
endif;

/**
* Use the 1x spinner image from Core instead of the one from the simple comment editing plugin
 *
* @param string $image_url
* @return string $image_url
*/
if ( ! function_exists( 'minnpost_largo_comment_edit_loading_image' ) ) :
	add_filter( 'sce_loading_img', 'minnpost_largo_comment_edit_loading_image' );
	function minnpost_largo_comment_edit_loading_image( $image_url ) {
		$image_url = admin_url( '/images/spinner.gif' );
		return $image_url;
	}
endif;

/**
* When lazy loading comments, allow users to indicate they always want to load comments.
 *
* @param bool $can_lazyload
* @return bool $can_lazyload
*/
if ( ! function_exists( 'minnpost_largo_always_load_comments_for_user' ) ) :
	add_filter( 'llc_can_lazy_load', 'minnpost_largo_always_load_comments_for_user' );
	function minnpost_largo_always_load_comments_for_user( $can_lazyload ) {
		$user_id      = get_current_user_id();
		$can_lazyload = true; // set a default of true; user overrides it
		if ( 0 !== $user_id ) {
			$always_load_comments = get_user_meta( $user_id, 'always_load_comments', true );
			$always_load_comments = user_always_loads_comments( $always_load_comments );
			if ( true === $always_load_comments ) {
				$can_lazyload = false;
			}
		}
		// Test if the query exists at the URL
		if ( get_query_var( 'replytocom' ) ) {
			$can_lazyload = false;
		}
		return $can_lazyload;
	}
endif;

/**
* Allow for checking if the URL has a replytocom parameter. This means the user is replying to a comment.
 *
* @param array $vars
* @return array $vars
*/
if ( ! function_exists( 'add_query_vars_reply_comment' ) ) :
	add_filter( 'query_vars', 'add_query_vars_reply_comment' );
	function add_query_vars_reply_comment( $vars ) {
		$vars[] = 'replytocom';
		return $vars;
	}
endif;

/**
* This is used to determine whether the always load comment variable is true
* regardless of which source it's coming from.
 *
* @param bool $always_load_comments
* @return bool $always_load_comments
*/
if ( ! function_exists( 'user_always_loads_comments' ) ) :
	function user_always_loads_comments( $always_load_comments = false ) {
		if ( 'on' === $always_load_comments || true === filter_var( $always_load_comments, FILTER_VALIDATE_BOOLEAN ) ) {
			$always_load_comments = true;
		} else {
			$always_load_comments = false;
		}
		return $always_load_comments;
	}
endif;

/**
* Class for show comments button
 *
* @param string $class
* @return string $class
*/
if ( ! function_exists( 'minnpost_largo_load_comments_button_class' ) ) :
	add_filter( 'llc_button_class', 'minnpost_largo_load_comments_button_class' );
	function minnpost_largo_load_comments_button_class( $class ) {
		$class = 'a-button a-button-next a-button-choose a-button-show-comments';
		return $class;
	}
endif;

/**
* Text for show comments button
 *
* @param string $text
* @return string $text
*/
if ( ! function_exists( 'minnpost_largo_load_comments_button_text' ) ) :
	add_filter( 'llc_button_text', 'minnpost_largo_load_comments_button_text' );
	function minnpost_largo_load_comments_button_text( $text ) {
		$text = esc_html__( 'Show comments or leave a comment', 'minnpost-largo' );
		return $text;
	}
endif;

/**
* Don't center the comments div because why would anyone even do that
 *
* @param bool $center
* @return bool $center
*/
if ( ! function_exists( 'minnpost_largo_load_comments_button_center' ) ) :
	add_filter( 'llc_enable_loader_center', 'minnpost_largo_load_comments_button_center' );
	function minnpost_largo_load_comments_button_center( $center ) {
		$center = false;
		return $center;
	}
endif;

/**
* Ajax method to set user comment load preference
*/
if ( ! function_exists( 'minnpost_largo_load_comments_set_user_meta' ) ) :
	add_action( 'wp_ajax_minnpost_largo_load_comments_set_user_meta', 'minnpost_largo_load_comments_set_user_meta' );
	add_action( 'wp_ajax_nopriv_minnpost_largo_load_comments_set_user_meta', 'minnpost_largo_load_comments_set_user_meta' );
	function minnpost_largo_load_comments_set_user_meta() {
		// if there is no logged in user, don't do anything
		$user_id = get_current_user_id();
		if ( 0 === $user_id ) {
			die();
		}

		$always_show = isset( $_POST['value'] ) ? (int) $_POST['value'] : 0;
		$update      = update_user_meta( $user_id, 'always_load_comments', $always_show );

		if ( 1 === $always_show ) {
			$return = array(
				'show'    => true,
				'message' => __( 'You will always see comments loaded when you are logged in', 'minnpost-largo' ),
			);
		} else {
			$return = array(
				'show'    => false,
				'message' => __( 'You will not see comments loaded when you are logged in unless you click the button.', 'minnpost-largo' ),
			);
		}
		wp_send_json_success( $return );
	}
endif;

/**
* HTML for the toggle switch used to always load comments
 *
* @param string $position
*/
if ( ! function_exists( 'minnpost_largo_load_comments_switch' ) ) :
	function minnpost_largo_load_comments_switch( $position ) {
		$always_load_comments = false;
		$user_id              = get_current_user_id();

		if ( ! class_exists( 'Lazy_Load_Comments' ) ) {
			return;
		}
		$always_load_comments = get_user_meta( $user_id, 'always_load_comments', true );
		$always_load_comments = user_always_loads_comments( $always_load_comments );
		if ( comments_open() ) :
			?>
			<div class="m-user-always-show-comments m-user-always-show-comments-<?php echo $position; ?>">
			<?php if ( 0 === $user_id ) : ?>
				<span class="always-show-comments">
				<?php
				$login_url = site_url( '/user/login/' );
				$login_url = add_query_arg( 'redirect_to', get_current_url() . '#comments', $login_url );
				echo sprintf(
					// translators: 1) the log in link
					__( '<a href="%1$s">Log in</a> for the option to always show comments on MinnPost.', 'minnpost-largo' ),
					$login_url
				);
				?>
				</span>
			<?php else : ?>
				<label class="always-show-comments" for="always-show-comments-<?php echo $position; ?>"><?php echo esc_html__( 'Always show comments when you are logged in', 'minnpost-largo' ); ?></label>
				<label class="a-switch a-switch-always-show-comments a-switch-always-show-comments-<?php echo $position; ?>">
					<input type="checkbox" class="a-checkbox-always-show-comments" id="always-show-comments-<?php echo $position; ?>"<?php echo ( true === $always_load_comments ) ? ' value="0" checked' : ' value="1"'; ?>>
					<span class="slider round"></span>
				</label>
			<?php endif; ?>
			</div>
			<?php
		endif;
	}
endif;

/**
* Text for the edit button on comments
 *
* @param string $translated_text
*/
add_filter(
	'sce_text_edit',
	function( $translated_text ) {
		return esc_html__( 'Edit', 'minnpost-largo' );
	}
);

/**
* Text for the save button on comments
 *
* @param string $translated_text
*/
add_filter(
	'sce_text_save',
	function( $translated_text ) {
		return esc_html__( 'Save Changes', 'minnpost-largo' );
	}
);

/**
* Text for the cancel edit button on comments
 *
* @param string $translated_text
*/
add_filter(
	'sce_text_cancel',
	function( $translated_text ) {
		return esc_html__( 'Cancel Changes', 'minnpost-largo' );
	}
);

/**
* Text for the delete button on comments
 *
* @param string $translated_text
*/
add_filter(
	'sce_text_delete',
	function( $translated_text ) {
		return esc_html__( 'Delete Comment', 'minnpost-largo' );
	}
);

/**
* Filter: sce_content
* Filter to overral simple comment edit output
*
* @param string  $sce_content SCE content
* @param int     $comment_id Comment ID of the comment
*/
if ( ! function_exists( 'minnpost_largo_sce_output' ) ) :
	add_filter( 'sce_content', 'minnpost_largo_sce_output', 10, 2 );
	function minnpost_largo_sce_output( $sce_content, $comment_id ) {
		$sce_content = '<div class="m-form-standalone m-form-comment-edit"><div class="m-form-item">' . $sce_content . '</div></div>';
		return $sce_content;
	}
endif;

/**
* Change the comment reply link
*
* @param array   $args
* @param object  $comment
* @param object  $post
* @return array $args
*/
if ( ! function_exists( 'minnpost_largo_comment_reply_link' ) ) :
	add_filter( 'comment_reply_link_args', 'minnpost_largo_comment_reply_link', 10, 3 );
	function minnpost_largo_comment_reply_link( $args, $comment, $post ) {

		$comment = get_comment( $comment );

		if ( empty( $comment->comment_author ) ) {
			if ( ! empty( $comment->user_id ) ) {
				$user           = get_userdata( $comment->user_id );
				$commenter_name = $user->display_name;
			} else {
				$commenter_name = '';
			}
		} else {
			$commenter_name = get_comment_author( $comment->comment_ID );
		}

		$args['reply_text'] = sprintf(
			// translators: 1) the font awesome icon, 2) the name of the commenter
			__( '%1$s Reply to %2$s', 'minnpost-largo' ),
			__( '<i class="far fa-comment" aria-hidden="true"></i>', 'minnpost-largo' ),
			$commenter_name
		);

		$args['login_text'] = sprintf(
			// translators: 1) the font awesome icon, 2) the name of the commenter
			__( '%1$s Log in to reply to %2$s', 'minnpost-largo' ),
			__( '<i class="far fa-comment" aria-hidden="true"></i>', 'minnpost-largo' ),
			$commenter_name
		);

		return $args;
	}
endif;
