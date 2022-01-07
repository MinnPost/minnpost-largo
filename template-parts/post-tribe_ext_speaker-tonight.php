<?php
/**
 * Template part for displaying Minnpost Tonight speaker posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

$post_class       = 'm-post m-tonight-post m-tonight-post-speaker m-tonight-post-speaker-full';
$speaker_instance = Tribe__Extension__Speaker_Linked_Post_Type::instance();
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( $post_class ); ?>>
	<div class="m-entry-content">
		<div class="m-archive-info m-author-info m-author-excerpt">						   
			<?php minnpost_speaker_figure( get_the_ID(), 'full', 'content', true, 'the_title', true, false, '_tribe_ext_speaker_title', true, true ); ?>
		</div>
		<?php minnpost_event_website_disclaimer_text( 'tonight' ); ?>
	</div>
</article>
