<?php
/**
 * Single Event Meta (Speaker) Template
 *
 * Override this template in your own theme by creating a file at:
 * [your-theme]/tribe-events/modules/meta/speaker.php
 *
 * @package TribeEventsCalendar
 * @version 4.6.19
 */

$post_type    = 'tribe_ext_speaker';
$all_speakers = tribe_get_linked_posts_by_post_type( get_the_ID(), $post_type );
$speakers     = array();
$moderators   = array();
foreach ( $all_speakers as $speaker ) {
	$moderator = get_post_meta( $speaker->ID, '_mp_speaker_moderator', true );
	if ( $moderator === 'on' ) {
		$moderators[] = $speaker;
	} else {
		$speakers[] = $speaker;
	}
}
$multiple_speakers   = count( $speakers ) > 1;
$multiple_moderators = count( $moderators ) > 1;

$permalink_category_slug = minnpost_get_event_category_slug( get_the_ID() );

$speakers_label = __( 'Speaker:', 'minnpost-largo' );
if ( $multiple_speakers === true ) {
	$speakers_label = __( 'Speakers:', 'minnpost-largo' );
}
$moderators_label = __( 'Moderator:', 'minnpost-largo' );
if ( $multiple_moderators === true ) {
	$moderators_label = __( 'Moderators:', 'minnpost-largo' );
}

if ( $permalink_category_slug === 'festival' ) {
	$speakers_label = __( 'Speaker:', 'minnpost-largo' );
	if ( $multiple_speakers === true ) {
		$speakers_label = __( 'Speakers:', 'minnpost-largo' );
	}
	$moderators_label = __( 'Moderator:', 'minnpost-largo' );
	if ( $multiple_moderators === true ) {
		$moderators_label = __( 'Moderators:', 'minnpost-largo' );
	}
} elseif ( $permalink_category_slug === 'tonight' ) {
	$speakers_label = __( 'Guest:', 'minnpost-largo' );
	if ( $multiple_speakers === true ) {
		$speakers_label = __( 'Guests:', 'minnpost-largo' );
	}
	$moderators_label = __( 'Host:', 'minnpost-largo' );
	if ( $multiple_moderators === true ) {
		$moderators_label = __( 'Hosts:', 'minnpost-largo' );
	}
}
?>

<?php if ( ! empty( $all_speakers ) ) : ?>
	<section class="m-archive m-archive-<?php echo $permalink_category_slug; ?> m-archive-<?php echo $permalink_category_slug; ?>-tribe_ext_speaker">
		<?php do_action( 'tribe_events_single_meta_speaker_section_start' ); ?>
		<?php
		$speaker_names = '';
		$prefix        = '';
		$class_suffix  = '';
		if ( $permalink_category_slug !== '' ) {
			$class_suffix = ' a-' . $permalink_category_slug . '-speakers';
		}
		if ( ! empty( $all_speakers ) ) {
			global $post;
			foreach ( $all_speakers as $post ) {
				if ( ! $post ) {
					continue;
				}
				setup_postdata( $post );
				?>
				<?php get_template_part( 'template-parts/post-' . $permalink_category_slug, 'tribe_ext_speaker-excerpt' ); ?>
				<?php
			}
			wp_reset_postdata();
		}
		?>
		<?php do_action( 'tribe_events_single_meta_speaker_section_end' ); ?>
	</section>
<?php endif; ?>
