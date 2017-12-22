<?php
/**
 * Extra methods
 *
 * @package MinnPost Largo
 */

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

		if ( !current_user_can( 'edit_comment', $comment->comment_ID ) )
			return;

		if ( '0' === $comment->comment_approved ) {
			$location = admin_url( 'comment.php?action=approvecomment&amp;c=' ) . $comment->comment_ID;
		} else {
			$location = admin_url( 'comment.php?action=unapprovecomment&amp;c=' ) . $comment->comment_ID;
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

		if ( !current_user_can( 'edit_comment', $comment->comment_ID ) )
			return;

		$location = admin_url('comment.php?action=cdc&dt=spam&amp;c=') . $comment->comment_ID;

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

		if ( !current_user_can( 'edit_comment', $comment->comment_ID ) )
			return;

		$location = admin_url('comment.php?action=cdc&amp;c=') . $comment->comment_ID;

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


if ( ! function_exists( 'is_post_type' ) ) :
	function is_post_type( $type ) {
		global $wp_query;
		if ( get_post_type( $wp_query->post->ID ) === $type ) {
			return true;
		}
		return false;
	}
endif;

if ( ! function_exists( 'minnpost_post_thumbnail_sizes_attr' ) ) :
	add_filter( 'wp_get_attachment_image_attributes', 'minnpost_post_thumbnail_sizes_attr', 10 , 3 );
	function minnpost_post_thumbnail_sizes_attr( $attr = array(), $attachment, $size = '' ) {
		if ( 'post-thumbnail' === $size ) {
			is_active_sidebar( 'sidebar-1' ) && $attr['sizes'] = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 984px) 60vw, (max-width: 1362px) 62vw, 840px';
			! is_active_sidebar( 'sidebar-1' ) && $attr['sizes'] = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 1362px) 88vw, 1200px';
		}
		return $attr;
	}
endif;

if ( ! function_exists( 'minnpost_dom_innerhtml' ) ) :
	function minnpost_dom_innerhtml( $element ) {
		$inner_html = '';
		$children = $element->childNodes;
		foreach ( $children as $child ) {
			$tmp_dom = new DOMDocument();
			$tmp_dom->appendChild( $tmp_dom->importNode( $child, true ) );
			$inner_html .= trim( $tmp_dom->saveHTML() );
		}
		return $inner_html;
	}
endif;

if ( ! function_exists( 'keep_me_logged_in_for_1_year' ) ) :
	add_filter( 'auth_cookie_expiration', 'keep_me_logged_in_for_1_year' );
	function keep_me_logged_in_for_1_year( $expirein ) {
		return 31556926; // 1 year in seconds
	}
endif;

if ( ! function_exists( 'minnpost_unregister_widgets' ) ) :
	//add_action( 'widgets_init', 'minnpost_unregister_widgets', 11 );
	function minnpost_unregister_widgets() {
		unregister_widget( 'WP_Widget_Pages' );
		unregister_widget( 'WP_Widget_Calendar' );
		unregister_widget( 'WP_Widget_Archives' );
		unregister_widget( 'WP_Widget_Meta' );
		unregister_widget( 'WP_Widget_Search' );
		unregister_widget( 'WP_Widget_Text' );
		unregister_widget( 'WP_Widget_Categories' );
		unregister_widget( 'WP_Widget_Recent_Posts' );
		unregister_widget( 'WP_Widget_Recent_Comments' );
		unregister_widget( 'WP_Widget_RSS' );
		unregister_widget( 'WP_Widget_Tag_Cloud' );
		//unregister_widget( 'WP_Nav_Menu_Widget' );
	}
endif;

if ( ! function_exists( 'disable_autoformatting_old_content' ) ) :
	add_action( 'wp', 'disable_autoformatting_old_content' );
	function disable_autoformatting_old_content() {
		$migrated_date = get_option( 'wp_migrate_timestamp', time() );
		$post_date = get_the_date( 'U' );
		if ( $migrated_date > $post_date ) {
			$remove_filter = true;
		}
		if ( ! isset( $remove_filter ) || false === $remove_filter ) {
			return;
		}
		remove_filter( 'the_content', 'wpautop' );
	}
endif;

if ( ! function_exists( 'remove_tagline' ) ) :
	add_filter( 'document_title_parts', 'remove_tagline' );
	function remove_tagline( $title ) {
		if ( isset( $title['tagline'] ) ) {
			unset( $title['tagline'] );
		}
		return $title;
	}
endif;

if ( ! function_exists( 'minnpost_document_title_separator' ) ) :
	add_filter( 'document_title_separator', 'minnpost_document_title_separator' );
	function minnpost_document_title_separator( $sep ) {
		$sep = '|';
		return $sep;
	}
endif;

if ( ! function_exists( 'minnpost_remove_head_hooks' ) ) :
	function minnpost_remove_head_hooks() {
		add_filter( 'feed_links_show_comments_feed', '__return_false' );
		add_filter( 'the_generator', '__return_false' );
		remove_action( 'wp_head','feed_links_extra', 3 );
		remove_action( 'wp_head', 'wlwmanifest_link' );
		remove_action( 'wp_head', 'wp_generator' );
		remove_action( 'wp_head', 'wp_shortlink_wp_head' );
		remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10 );
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
	}
	minnpost_remove_head_hooks();
endif;

if ( ! function_exists( 'get_current_url' ) ) :
	function get_current_url() {
		if ( is_page() || is_single() ) {
			$current_url = wp_get_canonical_url();
		} else {
			global $wp;
			$current_url = home_url( add_query_arg( array(), $wp->request ) );
		}
		return $current_url;
	}
endif;
