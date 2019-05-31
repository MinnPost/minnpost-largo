<form role="search" method="get" class="search-form" action="<?php echo home_url( '/' ); ?>">
	<fieldset>
		<div class="a-input-with-button a-button-sentence">
			<input type="search" class="search-field" placeholder="<?php echo esc_attr_x( 'Search', 'placeholder' ); ?>" value="<?php echo get_search_query(); ?>" name="s" maxlength="128">
			<input type="submit" class="search-submit" value="<?php echo esc_attr_x( 'Search', 'submit button' ); ?>">
		</div>
	</fieldset>
</form>
