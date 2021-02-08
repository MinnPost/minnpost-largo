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
	if ( 'on' === $moderator ) {
		$moderators[] = $speaker;
	} else {
		$speakers[] = $speaker;
	}
}
$multiple_speakers   = count( $speakers ) > 1;
$multiple_moderators = count( $moderators ) > 1;

$speakers_label = __( 'Speaker:', 'minnpost-largo' );
if ( true === $multiple_speakers ) {
	$speakers_label = __( 'Speakers:', 'minnpost-largo' );
}

$moderators_label = __( 'Moderator:', 'minnpost-largo' );
if ( true === $multiple_moderators ) {
	$moderators_label = __( 'Moderators:', 'minnpost-largo' );
}
?>

<?php if ( ! empty( $speakers ) || ! empty( $moderators ) ) : ?>
	<div class="m-festival-speakers">
		<?php do_action( 'tribe_events_single_meta_speaker_section_start' ); ?>
		<?php
		$speaker_names = '';
		$prefix        = '';
		if ( ! empty( $speakers ) ) {
			foreach ( $speakers as $speaker ) {
				if ( ! $speaker ) {
					continue;
				}
				$speaker_names .= $prefix . '&nbsp;' . '<a href="' . get_permalink( $speaker->ID ) . '">' . $speaker->post_title . '</a>';
				$prefix         = ', ';
				?>
				<?php
			}
			echo sprintf(
				'<p class="a-festival-speakers"><strong>%1$s</strong> %2$s</p>',
				esc_html( $speakers_label ),
				$speaker_names,
			);
		}
		?>
		<?php
		$moderator_names = '';
		$prefix          = '';
		if ( ! empty( $moderators ) ) {
			foreach ( $moderators as $moderator ) {
				if ( ! $moderator ) {
					continue;
				}
				$moderator_names .= $prefix . '&nbsp;' . '<a href="' . get_permalink( $moderator->ID ) . '">' . $moderator->post_title . '</a>';
				$prefix           = ', ';
				?>
				<?php
			}
			echo sprintf(
				'<p class="a-festival-speakers a-festival-moderators"><strong>%1$s</strong> %2$s</p>',
				esc_html( $moderators_label ),
				$moderator_names,
			);
		}
		?>
		<?php do_action( 'tribe_events_single_meta_speaker_section_end' ); ?>
	</div>
<?php endif; ?>
