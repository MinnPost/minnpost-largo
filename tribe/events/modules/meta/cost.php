<?php
/**
 * Single Event Meta (Cost) Template
 */
?>
<?php if ( tribe_get_cost() ) : ?>
	<div class="a-event-cta a-event-cost">
		<span class="a-event-price">
			<?php
			echo sprintf(
				// translators: 1) cost
				__( 'Cost: %1$s', 'minnpost-largo' ),
				tribe_get_formatted_cost()
			);
			?>
		</span>
	</div>
<?php endif; ?>
