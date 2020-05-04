<form role="search" method="get" class="m-form m-form-search" action="<?php echo home_url( '/' ); ?>" hidden>
	<fieldset>
		<label class="a-search-label screen-reader-text" for="s"><?php echo __( 'Search MinnPost', 'minnpost-largo' ); ?>
			<p id="error" role="alert"></p>
		</label>
		<div class="a-input-with-button a-button-sentence">
			<input type="search" class="search-field" placeholder="<?php echo esc_attr_x( 'Search MinnPost', 'placeholder', 'minnpost-largo' ); ?>" value="<?php echo get_search_query(); ?>" name="s" maxlength="128">
			<input type="submit" class="search-submit" value="<?php echo esc_attr_x( 'Search', 'submit button', 'minnpost-largo' ); ?>">
		</div>
	</fieldset>
</form>
