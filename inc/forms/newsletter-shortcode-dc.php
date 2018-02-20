<?php
/**
 * Newsletter subscribe shortcode for DC
 *
 * @package MinnPost Largo
 */
?>
<div class="m-widget-form m-form m-form-newsletter-shortcode m-form-newsletter-shortcode-dc" id="form-newsletter-shortcode-dc">
	<img src="<?php echo get_theme_file_uri() . '/assets/img/dcmemologo-transparent.png'; ?>" alt="MinnPost D.C. Memo">
	<div class="m-form-container">
		<p>For a one-stop source of the most informative, insightful and entertaining coverage coming out of Washington, subscribe to MinnPost&apos;s D.C. Memo.</p>
		<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" class="m-form-newsletter">
			<input type="hidden" name="action" value="newsletter_shortcode">
			<input type="hidden" name="mp_newsletter_form_nonce" value="<?php echo $newsletter_nonce; ?>">
			<input type="hidden" name="redirect_url" value="<?php echo $redirect_url; ?>">
			<input type="hidden" name="newsletters_available[]" value="d89249e207">
			<input type="hidden" name="_newsletters[]" value="d89249e207">
			<?php echo $message; ?>
			<fieldset>
				<div class="m-field-group m-form-item m-form-item-email">
					<label for="dc_user_email">Email Address: <span class="a-form-item-required">*</span></label>
					<input id="dc_user_email" name="user_email" value="" type="email" required>
				</div>
				<div class="m-field-group m-form-item m-form-item-first-name">
					<label for="dc_first_name">First Name: <span class="a-form-item-required">*</span></label>
					<input id="dc_first_name" name="first_name" value="" type="text" required>
				</div>
				<div class="m-field-group m-form-item m-form-item-last-name">
					<label for="dc_last_name">Last Name: <span class="a-form-item-required">*</span></label>
					<input id="dc_last_name" name="last_name" value="" type="text" required>
				</div>
			</fieldset>
			<div class="m-form-actions">
				<button type="submit" name="subscribe" id="mc-embedded-dc-subscribe" class="a-button a-button-next a-button-choose">Subscribe Now</button>
			</div>
		</form>
	</div>
</div>
