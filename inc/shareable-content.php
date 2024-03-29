<?php
/**
 * This file provides an AJAX response containing the body of a post as well as some sharing information.
 *
 * Expected URL is something like /wp-content/plugins/republication-tracker-tool/includes/shareable-content.php?post=22078&_=1512494948576
 * We aren't passing a NONCE; this isn't a form.
 */

/**
 * The article WP_Post object
 *
 * @var WP_Post $post the post object
 */
global $post;

/**
 * What tags do we want to keep in the embed?
 * Not things from our server.
 *
 * Generall: wp_kses_post, but not allowing the terms listed below because
 * - they're referencing assets on our server: audio, figure, img, track, video
 * - they're referencing the referenced asset: figure, figcaption
 * - they're not likely to work: form, button
 *
 * @var array $allowed_tags_excerpt
 * @link https://codex.wordpress.org/Function_Reference/wp_kses
 */
global $allowedposttags;
$allowed_tags_excerpt = $allowedposttags;
unset( $allowed_tags_excerpt['form'] );

/**
 * Allow sites to configure which tags are allowed to be output in the republication content
 *
 * Default value is the standard global $allowedposttags, except form elements.
 *
 * @link https://github.com/Automattic/republication-tracker-tool/issues/49
 * @link https://developer.wordpress.org/reference/functions/wp_kses_allowed_html/
 * @param Array $allowed_tags_excerpt an associative array of element tags that are allowed
 */
$allowed_tags_excerpt = apply_filters( 'republication_tracker_tool_allowed_tags_excerpt', $allowed_tags_excerpt, $post );

/**
 * The content of the aforementioned post
 *
 * @var HTML $content
 */
$content = $post->post_content;

// Remove shortcodes from the content.
$content = strip_shortcodes( $content );

// make sure the shortcodes are really gone
$content = preg_replace( '#\[[^\]]+\]#', '', $content );

// Remove comments from the content. (Lookin' at you, Gutenberg.)
$content = preg_replace( '/<!--(.|\s)*?-->/i', ' ', $content );

// And finally, remove some tags.
$content = wp_kses( $content, $allowed_tags_excerpt );

// remove spare p tags and clean up these paragraphs
$content = str_replace( '<p></p>', '', wpautop( $content ) );

// Force the content to be UTF-8 escaped HTML.
$content = htmlspecialchars( $content, ENT_HTML5, 'UTF-8', true );

$content_footer = Republication_Tracker_Tool::create_content_footer( $post );

// ours
if ( function_exists( 'minnpost_get_posted_on' ) ) {
	$date = minnpost_get_posted_on( $post->ID, true );
	if ( '' === $date ) {
		return;
	}
	$time_string = sprintf(
		'<time class="a-entry-date published updated" datetime="%1$s">%2$s</time>',
		$date['published']['machine'],
		$date['published']['human'],
	);
} else {
	$time_string = gmdate( 'F j, Y', strtotime( $post->post_date ) );
}
// end ours

/**
 * The article title, byline, source site, and date
 *
 * @var HTML $article_info The article title, etc.
 */
$article_info = sprintf(
	// translators: %1$s is the post title, %2$s is the byline, %3$s is the date in our date format
	__( '<h1>%1$s</h1><p class="a-entry-byline">%2$s</p><p class="a-entry-date">%3$s</p>', 'republication-tracker-tool' ),
	wp_kses_post( get_the_title( $post ) ),
	minnpost_get_posted_by( $post->ID, true, false ),
	wp_kses_post( $time_string )
);
// strip empty tags after automatically applying p tags.
$article_info = str_replace( '<p></p>', '', wpautop( $article_info ) );

/**
 * The licensing statement from this plugin
 *
 * @var HTML $license_statement
 */
$license_statement = wp_kses_post( get_option( 'republication_tracker_tool_policy' ) );
$license_statement = apply_filters( 'the_content', $license_statement );
?>

<div id="republication-tracker-tool-modal-content" style="display:none;">
	<a href="#" class="a-close-button republication-tracker-tool-close">
		<span class="screen-reader-text"><?php echo esc_html( 'Close window', 'republication-tracker-tool' ); ?></span>
		<i class="fas fa-times"></i>
	</a>
	<div class="m-republication-info">
	</div>
	<header class="m-entry-header m-republication-entry-header">
		<h1 class="a-entry-title"><?php echo esc_html__( 'Republish this article', 'minnpost-largo' ); ?></h1>
	</header>
	<div class="m-entry-content m-republication-entry-content">
		<?php echo wp_kses_post( $license_statement ); ?>
	</div>
	<div class="m-republication-article-info">
		<?php echo wp_kses_post( $article_info ); ?>
		<?php
		// the text area that is copyable
		echo wp_kses_post(
			sprintf(
				'<textarea readonly id="republication-tracker-tool-shareable-content" rows="5">%1$s %2$s %3$s</textarea>',
				esc_html( $article_info ),
				$content . "\n\n",
				$content_footer
			)
		);
		?>
		<button class="a-button" onclick="copyToClipboard('#republication-tracker-tool-shareable-content')">
			<?php echo esc_html__( 'Copy HTML', 'republication-tracker-tool' ); ?>
		</button>
	</div>
</div>
