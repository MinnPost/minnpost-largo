<?php
/**
 * View: List View
 *
 * This overrides the default the-events-calendar/views/v2/list/nav.php
 *
 */

$years = minnpost_event_addon_event_years( 'tribe-bar-year', 'DESC', false, true );
?>
<?php if ( '' !== $years ) : ?>
<div class="m-pagination-all m-pagination-events">
	<span class="a-subnav-label"><?php echo __( 'Past Events By Year', 'minnpost-largo' ); ?></span>
	<div class="m-pagination-navigation m-events">
		<div class="m-pagination-container m-pagination-container-events">
			<?php minnpost_event_addon_event_years( 'tribe-bar-year', 'DESC', true, true ); ?>
		</div>
		<button class="nav-scroller-btn nav-scroller-btn--left" aria-label="Scroll left">
			<i class="fas fa-chevron-left"></i>
		</button>
		<button class="nav-scroller-btn nav-scroller-btn--right" aria-label="Scroll right">
			<i class="fas fa-chevron-right"></i>
		</button>
	</div>
</div>
<?php endif; ?>
