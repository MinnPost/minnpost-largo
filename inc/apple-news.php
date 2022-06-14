<?php
/**
 * Methods for Apple News
 * This depends on the Publish to Apple News plugin
 *
 * @package MinnPost Largo
 */

/**
 * Apple News: allow authors and above to automatically
 * publish their posts on Apple News.
 */
add_filter(
	'apple_news_publish_capability',
	function() {
		return 'publish_posts';
	},
	10,
	0
);

/**
 * Apple News: allow editors and above to see the Apple News
 * listing screen.
 *
 * Users with this capability will be able to push any posts
 * to the Apple News channel
 */
add_filter(
	'apple_news_list_capability',
	function() {
		return 'edit_others_posts';
	},
	10,
	0
);

/**
 * Apple News: don't push to apple news if this is not production
 */
if ( ! function_exists( 'minnpost_skip_apple_news' ) ) :
	add_filter( 'apple_news_skip_push', 'skip_apple_news', 10, 1 );
	function skip_apple_news( $post_id ) {
		if ( VIP_GO_ENV !== 'production' ) {
			return true;
		}
	}
endif;
