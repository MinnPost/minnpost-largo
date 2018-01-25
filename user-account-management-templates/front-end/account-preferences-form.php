<form id="account-preferences-form" action="<?php echo $attributes['current_url']; ?>" method="post" class="m-form m-form-standalone m-form-user m-form-account-preferences">

	<input type="hidden" name="user_account_management_action" value="account-preferences-update"/>
	<input type="hidden" name="user_account_management_redirect" value="<?php echo $attributes['redirect']; ?>"/>
	<input type="hidden" name="user_account_management_account_preferences_nonce" value="<?php echo wp_create_nonce( 'uam-account-preferences-nonce' ); ?>"/>

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

	<?php if ( ! empty( $_GET['account-preferences-update'] ) && 'true' === esc_attr( $_GET['account-preferences-update'] ) ) : ?>
		<div class="m-form-message m-form-message-info">
			<p class="login-info">
				<?php _e( 'Your preferences were successfully updated.', 'minnpost-largo' ); ?>
			</p>
		</div>
	<?php endif; ?>

	<fieldset>
		<?php
		$args = array(
			'save_button' => esc_html__( 'Save Changes', 'cmb2' ),
			'cmb_styles'  => false,
			'enqueue_js'  => false,
		);
		echo cmb2_get_metabox_form( 'user_reading_preferences', $attributes['user']->ID, $args );
		?>
	</fieldset>
</form>
