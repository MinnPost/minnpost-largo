<?php
/**
 * Newsletter subscribe shortcode
 *
 * @package MinnPost Largo
 */
?>
<div class="m-form m-form-in-body m-form-newsletter-shortcode m-form-newsletter-shortcode-default" id="form-newsletter-shortcode-default">
	<h2 class="a-form-title">Get MinnPost's top stories in your inbox</h2>
	<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" class="m-form-newsletter">
		<input type="hidden" name="action" value="newsletter_shortcode">
		<input type="hidden" name="minnpost_form_processor_mailchimp_nonce" value="<?php echo $newsletter_nonce; ?>">
		<input type="hidden" name="redirect_url" value="<?php echo $redirect_url; ?>">
		<input type="hidden" name="newsletters_available[]" value="04471b1571">
		<input type="hidden" name="newsletters_available[]" value="94fc1bd7c9">
		<input type="hidden" name="newsletters_available[]" value="ce6fd734b6">
		<input type="hidden" name="newsletters_available[]" value="d89249e207">
		<?php echo $message; ?>
		<fieldset>
			<div class="m-field-group m-form-item m-form-item-first-name">
				<label for="newsletter_first_name">First Name: <span class="a-form-item-required">*</span></label>
				<input id="newsletter_first_name" name="first_name" value="" type="text" required>
			</div>
			<div class="m-field-group m-form-item m-form-item-last-name">
				<label for="newsletter_last_name">Last Name: <span class="a-form-item-required">*</span></label>
				<input id="newsletter_last_name" name="last_name" value="" type="text" required>
			</div>
			<div class="m-field-group m-form-item m-form-item-email">
				<label for="newsletter_user_email">Email Address: <span class="a-form-item-required">*</span></label>
				<input id="newsletter_user_email" name="user_email" value="" type="email" required>
			</div>
			<div class="m-field-group m-form-item m-form-item-interests m-form-checkboxes">
				<label>
					<input name="_newsletters[]" value="04471b1571" checked type="checkbox"> <span>Daily newsletter</span>
				</label>
				<label>
					<input name="_newsletters[]" value="94fc1bd7c9" checked type="checkbox"> <span>Sunday review</span>
				</label>
				<label>
					<input name="_newsletters[]" value="ce6fd734b6" type="checkbox"> <span>Greater Minnesota newsletter</span>
				</label>
				<label>
					<input name="_newsletters[]" value="d89249e207" type="checkbox" checked> <span>D.C. Memo</span>
				</label>
			</div>
		</fieldset>
		<div class="clear">
			<button type="submit" name="subscribe" id="mc-embedded-dc-subscribe" class="a-button a-button-next a-button-choose">Subscribe Now</button>
		</div>
	</form>
</div>
