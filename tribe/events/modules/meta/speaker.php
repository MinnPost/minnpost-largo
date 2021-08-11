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

$permalink_category_slug = minnpost_get_event_category_slug( get_the_ID() );

$speakers_label = __( 'Speaker:', 'minnpost-largo' );
if ( true === $multiple_speakers ) {
	$speakers_label = __( 'Speakers:', 'minnpost-largo' );
}
$moderators_label = __( 'Moderator:', 'minnpost-largo' );
if ( true === $multiple_moderators ) {
	$moderators_label = __( 'Moderators:', 'minnpost-largo' );
}

if ( 'festival' === $permalink_category_slug ) {
	$speakers_label = __( 'Speaker:', 'minnpost-largo' );
	if ( true === $multiple_speakers ) {
		$speakers_label = __( 'Speakers:', 'minnpost-largo' );
	}
	$moderators_label = __( 'Moderator:', 'minnpost-largo' );
	if ( true === $multiple_moderators ) {
		$moderators_label = __( 'Moderators:', 'minnpost-largo' );
	}
} elseif ( 'tonight' === $permalink_category_slug ) {
	$speakers_label = __( 'Guest:', 'minnpost-largo' );
	if ( true === $multiple_speakers ) {
		$speakers_label = __( 'Guests:', 'minnpost-largo' );
	}
	$moderators_label = __( 'Host:', 'minnpost-largo' );
	if ( true === $multiple_moderators ) {
		$moderators_label = __( 'Hosts:', 'minnpost-largo' );
	}
}
?>

<?php if ( ! empty( $speakers ) || ! empty( $moderators ) ) : ?>
	<div class="m-speakers<?php if ( '' !== $permalink_category_slug ) : ?> m-<?php echo $permalink_category_slug; ?>-speakers<?php endif; ?>">
		<?php do_action( 'tribe_events_single_meta_speaker_section_start' ); ?>
		<?php
		$speaker_names = '';
		$prefix        = '';
		$class_suffix  = '';
		if ( '' !== $permalink_category_slug ) {
			$class_suffix = ' a-' . $permalink_category_slug . '-speakers';
		}
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
				'<p class="a-speakers%1$s"><strong>%2$s</strong> %3$s</p>',
				esc_html( $class_suffix ),
				esc_html( $speakers_label ),
				$speaker_names,
			);
		}
		?>
		<?php
		$moderator_names         = '';
		$prefix                  = '';
		$moderator_class_suffix  = '';
		if ( '' !== $permalink_category_slug ) {
			$class_suffix = ' a-' . $permalink_category_slug . '-moderators';
		}
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
				'<p class="a-speakers a-moderators%1$s%2$s"><strong>%3$s</strong> %4$s</p>',
				esc_html( $class_suffix ),
				esc_html( $moderator_class_suffix ),
				esc_html( $moderators_label ),
				$moderator_names,
			);
		}
		?>
		<?php do_action( 'tribe_events_single_meta_speaker_section_end' ); ?>
	</div>
<?php endif; ?>
