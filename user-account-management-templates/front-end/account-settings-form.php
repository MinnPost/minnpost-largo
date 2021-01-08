<form id="account-settings-form" action="<?php echo esc_url( $attributes['current_url'] ); ?>" method="post" class="m-form m-form-standalone m-form-user m-form-account-settings">
	<?php if ( isset( $_GET['user_id'] ) ) : ?>
		<input type="hidden" name="user_id" value="<?php echo (int) wp_unslash( $_GET['user_id'] ); ?>">
	<?php else : ?>
		<input type="hidden" name="user_id" value="<?php echo (int) wp_unslash( get_current_user_id() ); ?>">
	<?php endif; ?>
	<input type="hidden" name="user_account_management_action" value="account-settings-update">
	<input type="hidden" name="user_account_management_redirect" value="<?php echo esc_url( $attributes['redirect'] ); ?>"/>
	<input type="hidden" name="user_account_management_account_settings_nonce" value="<?php echo esc_attr( wp_create_nonce( 'uam-account-settings-nonce' ) ); ?>"/>
	<?php if ( '1' === $attributes['include_city_state'] && '1' === $attributes['hidden_city_state'] ) : ?>
		<input type="hidden" name="city" value="<?php echo $attributes['city_value']; ?>">
		<input type="hidden" name="state" value="<?php echo $attributes['state_value']; ?>">
	<?php endif; ?>

	<?php if ( ! empty( $attributes['instructions'] ) ) : ?>
		<?php echo wp_kses_post( $attributes['instructions'] ); ?>
	<?php endif; ?>

	<?php if ( count( $attributes['errors'] ) > 0 ) : ?>
		<div class="m-form-message m-form-message-error">
			<?php if ( count( $attributes['errors'] ) > 1 ) : ?>
				<ul>
					<?php foreach ( $attributes['errors'] as $error ) : ?>
						<li><?php echo wp_kses_post( $error ); ?></li>
					<?php endforeach; ?>
				</ul>
			<?php else : ?>
				<p><?php echo wp_kses_post( $attributes['errors'][0] ); ?></p>
			<?php endif; ?>
		</div>
	<?php endif; ?>

	<?php if ( ! empty( $_GET['account-settings-update'] ) && 'true' === esc_attr( wp_unslash( $_GET['account-settings-update'] ) ) ) : ?>
		<div class="m-form-message m-form-message-info">
			<p class="login-info">
				<?php echo esc_html__( 'Your account settings were successfully updated.', 'minnpost-largo' ); ?>
			</p>
		</div>
	<?php endif; ?>

	<fieldset>
		<div class="m-form-item m-form-email m-form-change-email">
			<?php
			$user_other_emails = minnpost_largo_check_consolidated_emails( $attributes['user_meta'], $attributes['email_value'] );
			$email_count       = count( $user_other_emails );
			if ( 0 === $email_count ) {
				$label = sprintf( esc_html__( 'Email address:', 'minnpost-largo' ), $email_count );
			} else {
				$label = sprintf( esc_html__( 'Email addresses:', 'minnpost-largo' ), $email_count );
			}
			?>
			<label for="email"><?php echo esc_html( $label ); ?> <span class="a-form-item-required" title="<?php esc_html( 'This field is required.', 'minnpost-largo' ); ?>">*</span></label>
			<?php if ( ! empty( $user_other_emails ) ) : ?>
				<ul class="m-user-email-list">
					<li class="a-user-email-primary"><?php echo isset( $attributes['user']->user_email ) ? esc_html( $attributes['user']->user_email ) : ''; ?><ul class="a-form-caption a-user-email-actions">
							<li><small><?php echo esc_html__( '(Primary)', 'minnpost-largo' ); ?></small></li>
						</ul>
					</li>
					<?php foreach ( $user_other_emails as $key => $other_email ) : ?>
						<li class="m-user-email-data" id="user-email-<?php echo esc_attr( $key ); ?>"><?php echo esc_html( trim( $other_email ) ); ?><ul class="a-form-caption a-user-email-actions">
								<li class="a-form-caption a-pre-confirm a-make-primary-email">
									<input type="radio" name="primary_email" id="primary_email_<?php echo esc_attr( $key ); ?>" value="<?php echo esc_html( $other_email ); ?>">
									<label for="primary_email_<?php echo esc_attr( $key ); ?>"><small><?php echo esc_html( 'Make Primary', 'minnpost-largo' ); ?></small></label>
								</li>
								<li class="a-form-caption a-pre-confirm a-email-preferences"><a href="<?php echo site_url( '/newsletters/?email=' . urlencode( trim( $other_email ) ) ); ?>"><small><?php echo esc_html( 'Email Preferences', 'minnpost-largo' ); ?></small></a></li>
								<li class="a-form-caption a-pre-confirm a-remove-email">
									<input type="checkbox" name="remove_email[<?php echo esc_attr( $key ); ?>]" id="remove_email_<?php echo esc_attr( $key ); ?>" value="<?php echo esc_html( $other_email ); ?>">
									<label for="remove_email_<?php echo esc_attr( $key ); ?>"><small><?php echo esc_html( 'Remove', 'minnpost-largo' ); ?></small></label>
								</li>
							</ul>
						</li>
					<?php endforeach; ?>
				</ul>
				<input type="hidden" name="email" id="email" value="<?php echo isset( $attributes['user']->user_email ) ? esc_html( $attributes['user']->user_email ) : ''; ?>">
				<input type="hidden" name="_consolidated_emails" id="_consolidated_emails" value="<?php echo isset( $attributes['user']->user_email ) ? esc_html( $attributes['user']->user_email ) . ',' : ''; ?><?php echo implode( ',', array_map( 'esc_html', wp_unslash( $user_other_emails ) ) ); ?>">
			<?php else : ?>
					<input type="email" name="email" id="email" value="<?php echo $attributes['email_value']; ?>" required>
			<?php endif; ?>
			<div class="a-form-caption a-add-email">
				<a href="#">Add another email address</a>
			</div>
		</div>

		<div class="m-form-item m-form-first-name m-form-change-first-name">
			<label for="first-name"><?php echo esc_html__( 'First name:', 'minnpost-largo' ); ?> <span class="a-form-item-required" title="<?php echo esc_html__( 'This field is required.', 'minnpost-largo' ); ?>">*</span></label>
			<input type="text" name="first_name" id="first-name" value="<?php echo $attributes['first_name_value']; ?>" required>
		</div>

		<div class="m-form-item m-form-last-name m-form-change-last-name">
			<label for="last-name"><?php echo esc_html__( 'Last name:', 'minnpost-largo' ); ?> <span class="a-form-item-required" title="<?php echo esc_html__( 'This field is required.', 'minnpost-largo' ); ?>">*</span></label>
			<input type="text" name="last_name" id="last-name" value="<?php echo $attributes['last_name_value']; ?>" required>
		</div>

		<?php if ( '1' === $attributes['include_city_state'] && '1' !== $attributes['hidden_city_state'] ) : ?>
			<div class="m-form-item m-form-city m-form-change-city">
				<label for="city"><?php echo esc_html__( 'City:', 'minnpost-largo' ); ?> <span class="a-form-item-required" title="<?php echo esc_html__( 'This field is required.', 'minnpost-largo' ); ?>">*</span></label>
				<input type="text" name="city" id="city" value="<?php echo $attributes['city_value']; ?>"  required>
			</div>
			<div class="m-form-item m-form-state m-form-change-state">
				<label for="state"><?php echo esc_html__( 'State:', 'minnpost-largo' ); ?> <span class="a-form-item-required" title="<?php echo esc_html__( 'This field is required.', 'minnpost-largo' ); ?>">*</span></label>
				<input type="text" name="state" id="state" value="<?php echo $attributes['state_value']; ?>" required>
			</div>
		<?php endif; ?>

		<div class="m-form-item m-form-street-address m-form-change-street-address">
			<label for="street-address"><?php echo esc_html__( 'Street address:', 'minnpost-largo' ); ?></label>
			<?php 
			if ( isset( $_POST['street_address'] ) ) {
				$street_address = sanitize_text_field( $_POST['street_address'] );
			} elseif ( isset( $attributes['user_meta']['_street_address'] ) ) {
				$street_address = $attributes['user_meta']['_street_address'][0];
			} else {
				$street_address = '';
			}
			?>
			<input type="text" name="street_address" id="street-address" value="<?php echo $street_address; ?>">
		</div>

		<div class="m-form-item m-form-zip-code m-form-change-zip-code">
			<label for="zip-code"><?php echo esc_html__( 'Zip code:', 'minnpost-largo' ); ?> <span class="a-form-item-required" title="<?php echo esc_html__( 'This field is required.', 'minnpost-largo' ); ?>">*</span></label>
			<input type="tel" name="zip_code" id="zip-code" value="<?php echo $attributes['zip_code_value']; ?>" required>
		</div>

		<?php if ( isset( $attributes['countries'] ) ) : ?>
			<div class="m-form-item m-form-country m-form-change-country">
				<label for="country"><?php echo esc_html__( 'Country:', 'minnpost-largo' ); ?> <span class="a-form-item-required" title="<?php echo esc_html__( 'This field is required.', 'minnpost-largo' ); ?>">*</span></label>
				<select name="country" id="country">
					<option value="">Choose country</option>
					<?php foreach ( $attributes['countries'] as $country ) : ?>
						<?php if ( isset( $attributes['user_meta']['_country'][0] ) && ( $country['alpha2Code'] === $attributes['user_meta']['_country'][0] || $country['name'] === $attributes['user_meta']['_country'][0] ) ) : ?>
							<option value="<?php echo $country['alpha2Code']; ?>" selected><?php echo $country['name']; ?></option>
						<?php else : ?>
							<option value="<?php echo $country['alpha2Code']; ?>"><?php echo $country['name']; ?></option>
						<?php endif; ?>
					<?php endforeach; ?>
				</select>
			</div>
		<?php endif; ?>

		<div class="m-form-actions">
			<input type="submit" name="submit" id="change-button" value="<?php echo esc_html__( 'Save Changes', 'minnpost-largo' ); ?>" class="btn btn-submit btn-account-settings">
		</div>
	</fieldset>
</form>
