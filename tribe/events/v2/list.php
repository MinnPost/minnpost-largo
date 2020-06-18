<?php
/**
 * View: List View
 *
 * This overrides the default the-events-calendar/views/v2/list.php
 *
 */
$container_classes[] = 'm-layout-primary';
?>
<div id="primary"<?php tribe_classes( $container_classes ); ?>>
	<main id="main" class="site-main tribe-common-l-container tribe-events-l-container">
		<header class="m-archive-header tribe-events-header">
			<?php $this->template( 'components/messages' ); ?>
			<?php $this->template( 'list/heading' ); ?>
			<?php $this->template( 'list/header-link' ); ?>
		</header>
		<?php $this->template( 'components/before' ); ?>
		<section class="m-archive m-archive-events tribe-events-calendar-list">
			<?php foreach ( $events as $event ) : ?>
				<?php $this->setup_postdata( $event ); ?>
				<?php $this->template( 'list/event', array( 'event' => $event ) ); ?>
			<?php endforeach; ?>
		</section>
		<?php $this->template( 'components/after' ); ?>
		<?php $this->template( 'list/nav' ); ?>

		<?php numeric_pagination(); ?>
	</main>
</div>

<?php
get_sidebar();
