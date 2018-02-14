<form id="account-preferences-form" action="<?php echo site_url( '/user/account-settings' ); ?>" method="post" class="m-form m-form-standalone m-form-user m-form-account-preferences">

	<input type="hidden" name="user_account_management_action" value="account-settings-update">
	<input type="hidden" name="user_account_management_redirect" value="<?php echo $attributes['redirect']; ?>">
	<input type="hidden" name="user_account_management_account_settings_nonce" value="<?php echo wp_create_nonce( 'uam-account-settings-nonce' ); ?>">
	<input type="hidden" name="email" value="<?php echo $attributes['user']->user_email; ?>">
	<input type="hidden" name="first_name" value="<?php echo $attributes['user']->first_name; ?>">
	<input type="hidden" name="last_name" value="<?php echo $attributes['user']->last_name; ?>">

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
		<?php if ( ! empty( $attributes['reading_topics'] ) ) : ?>
			<div class="m-form-item m-form-reading-preferences m-form-change-reading-preferences">
				<label><?php _e( 'Reading Preferences:', 'minnpost-largo' ); ?></label>
				<div class="checkboxes">
					<?php
					$n = 1;
					$user_topics = array_values( $attributes['user_reading_topics'] );
					?>
					<?php foreach ( $attributes['reading_topics'] as $topic ) : ?>
						<?php
						$checked = '';
						if ( in_array( $topic, $user_topics ) ) {
							$checked = ' checked';
						}
						?>
						<label><input id="_reading_topics<?php echo $n; ?>" name="_reading_topics[]" value="<?php echo $topic; ?>" type="checkbox"<?php echo $checked; ?>> <?php echo $topic; ?></label>
						<?php $n++; ?>
					<?php endforeach; ?>
				</div>
			</div>
		<?php endif; ?>

		<?php
		?>
	</fieldset>

	<div class="m-form-actions">
		<input type="submit" name="submit" id="change-button" value="<?php _e( 'Save Changes', 'user-account-management' ); ?>" class="btn btn-submit btn-account-settings">
	</div>

</form>
