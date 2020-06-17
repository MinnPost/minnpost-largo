<?php
/**
 * View: List View
 *
 * This overrides the default the-events-calendar/views/v2/list/nav.php
 *
 */
?>
<nav class="tribe-events-calendar-list-nav tribe-events-c-nav">
	<ul class="tribe-events-c-nav__list">
		<?php
		if ( ! empty( $prev_url ) ) {
			$this->template( 'list/nav/prev', [ 'link' => $prev_url ] );
		} else {
			$this->template( 'list/nav/prev-disabled' );
		}
		?>

		<?php $this->template( 'list/nav/today' ); ?>

		<?php
		if ( ! empty( $next_url ) ) {
			$this->template( 'list/nav/next', [ 'link' => $next_url ] );
		} else {
			$this->template( 'list/nav/next-disabled' );
		}
		?>
	</ul>
</nav>
