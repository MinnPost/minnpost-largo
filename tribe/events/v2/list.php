<?php
/**
 * View: List View
 *
 * This overrides the default the-events-calendar/views/v2/list.php
 */
get_header();
$container_classes[] = 'm-layout-primary';
?>
<div id="primary"<?php tribe_classes( $container_classes ); ?>>
	<main id="main" class="site-main tribe-common-l-container tribe-events-l-container">
		<header class="m-archive-header tribe-events-header">
			<?php if ( ! empty( $events ) ) : ?>
				<?php $this->template( 'components/messages' ); ?>
			<?php endif; ?>
			<?php $this->template( 'list/heading' ); ?>
			<?php $this->template( 'list/header-link' ); ?>
		</header>
		<?php $this->template( 'components/before' ); ?>
		<?php if ( ! empty( $events ) ) : ?>
			<section class="m-archive m-archive-events tribe-events-calendar-list">
				<?php foreach ( $events as $event ) : ?>
					<?php $this->setup_postdata( $event ); ?>
					<?php $this->template( 'list/event', array( 'event' => $event ) ); ?>
				<?php endforeach; ?>
			</section>
		<?php else : ?>
			<div class="m-entry-content">
				<p><?php echo __( 'There are no upcoming events at this time. Check back soon, or browse our previous events by the year when they occurred.', 'minnpost-largo' ); ?></p>
			</div>
		<?php endif; ?>
		<?php $this->template( 'components/after' ); ?>
		<?php $this->template( 'list/nav' ); ?>

		<?php if ( function_exists( 'numeric_pagination' ) ) : ?>
			<?php numeric_pagination(); ?>
		<?php endif; ?>
	</main>
</div>

<?php
get_sidebar();
get_footer();
