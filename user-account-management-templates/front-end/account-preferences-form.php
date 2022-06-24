<form id="account-preferences-form" action="<?php echo site_url( '/user/account-settings' ); ?>" method="post" class="m-form m-form-standalone m-form-user m-form-account-preferences">
	<?php if ( isset( $_GET['user_id'] ) ) : ?>
		<input type="hidden" name="user_id" value="<?php echo $_GET['user_id']; ?>">
	<?php endif; ?>
	<input type="hidden" name="user_account_management_action" value="account-settings-update">
	<input type="hidden" name="user_account_management_redirect" value="<?php echo $attributes['redirect']; ?>">
	<input type="hidden" name="user_account_management_account_settings_nonce" value="<?php echo wp_create_nonce( 'uam-account-settings-nonce' ); ?>">
	<input type="hidden" name="_reading_topics" value="">
	<input type="hidden" name="always_load_comments" value="">

	<?php if ( ! empty( $attributes['instructions'] ) ) : ?>
		<?php echo $attributes['instructions']; ?>
	<?php endif; ?>

	<?php if ( count( $attributes['errors'] ) > 0 ) : ?>
		<div class="m-form-message m-form-message-error">
			<?php if ( count( $attributes['errors'] ) > 1 ) : ?>
				<ul>
					<?php foreach ( $attributes['errors'] as $error ) : ?>
						<li><?php echo $error; ?></li>
					<?php endforeach; ?>
				</ul>
			<?php else : ?>
				<p><?php echo $attributes['errors'][0]; ?></p>
			<?php endif; ?>
		</div>
	<?php endif; ?>

	<?php if ( ! empty( $_GET['account-settings-update'] ) && 'true' === esc_attr( $_GET['account-settings-update'] ) ) : ?>
		<div class="m-form-message m-form-message-info">
			<p class="login-info">
				<?php _e( 'Your preferences were successfully updated.', 'minnpost-largo' ); ?>
			</p>
		</div>
	<?php endif; ?>

	<fieldset class="m-user-preferences">
		<div class="m-form-item m-form-always-load-comments">
			<label><?php _e( 'Always Load Comments:', 'minnpost-largo' ); ?>
			<?php
			$checked = '';
			if ( function_exists( 'user_always_loads_comments' ) ) {
				if ( isset( $_REQUEST['user_id'] ) ) {
					$user_id = intval( wp_unslash( $_REQUEST['user_id'] ) );
				} else {
					$user_id = get_current_user_id();
				}
				$always_load_comments = get_user_meta( $user_id, 'always_load_comments', true );
				$always_load_comments = user_always_loads_comments( $always_load_comments );
				if ( true === $always_load_comments ) {
					$checked = ' checked';
				}
			}
			?>
			<input type="checkbox" name="always_load_comments" id="always-load-comments-checkbox" value="on"<?php echo $checked; ?>></label>
		</div>
		<?php if ( ! empty( $attributes['reading_topics'] ) ) : ?>
			<div class="m-form-item m-form-reading-preferences m-form-change-reading-preferences">
				<label><?php _e( 'Reading Preferences:', 'minnpost-largo' ); ?></label>
				<div class="checkboxes">
					<?php
					$topic_index = 1;
					$user_topics = array_values( $attributes['user_reading_topics'] );
					?>
					<?php foreach ( $attributes['reading_topics'] as $topic ) : ?>
						<?php
						$checked = '';
						if ( in_array( $topic, $user_topics, true ) ) {
							$checked = ' checked';
						}
						?>
						<label><input id="_reading_topics<?php echo $topic_index; ?>" name="_reading_topics[]" value="<?php echo $topic; ?>" type="checkbox"<?php echo $checked; ?>> <?php echo $topic; ?></label>
						<?php $topic_index++; ?>
					<?php endforeach; ?>
				</div>
			</div>
		<?php endif; ?>
	</fieldset>

	<div class="m-form-actions">
		<input type="submit" name="submit" id="change-button" value="<?php _e( 'Save Reading Preferences', 'minnpost-largo' ); ?>" class="btn btn-submit btn-account-settings">
	</div>

</form>

<?php echo do_shortcode( '[newsletter_form placement="useraccount" groups_available="all" button_text="Save Email Preferences"]' ); ?>
