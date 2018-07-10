<?php
/**
 * Newsletter subscribe full page
 *
 * @package MinnPost Largo
 */
?>

<div class="m-form m-form-standalone m-form-newsletter-shortcode m-form-newsletter-default" id="form-newsletter-shortcode-full">
	<p><img src="<?php echo get_theme_file_uri() . '/assets/img/mp-in-your-inbox.png'; ?>" alt="MinnPost in your inbox"></p>
	<form id="form-newsletter-default" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" class="m-form-newsletter">
		<input type="hidden" name="action" value="newsletter_shortcode">
		<input type="hidden" name="mp_newsletter_form_nonce" value="<?php echo $newsletter_nonce; ?>">
		<input type="hidden" name="redirect_url" value="<?php echo $redirect_url; ?>">
		<p>Subscribe to MinnPost&apos;s email newsletters.</p>
		<?php echo $message; ?>
		<fieldset class="m-user-preferences">
			<p><small><span class="a-form-item-required">*</span> indicates required</small></p>
			<div class="m-field-group m-form-item m-form-item-email">
				<label for="newsletter_user_email">Email Address: <span class="a-form-item-required">*</span></label>
				<input id="newsletter_user_email" name="user_email" value="" type="email" required>
			</div>
			<div class="m-field-group m-form-item m-form-item-first-name">
				<label for="newsletter_first_name">First Name: <span class="a-form-item-required">*</span></label>
				<input id="newsletter_first_name" name="first_name" value="" type="text" required>
			</div>
			<div class="m-field-group m-form-item m-form-item-last-name">
				<label for="newsletter_last_name">Last Name: <span class="a-form-item-required">*</span></label>
				<input id="newsletter_last_name" name="last_name" value="" type="text" required>
			</div>
			<div class="m-form-item m-form-email-options m-form-change-email-options">
				<label>Subscribe to these regular newsletters:</label>
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
			</div>
			<div class="m-form-item m-form-email-options m-form-change-email-options">
				<label>Occasional MinnPost emails:</label>
				<div class="m-field-group m-form-item m-form-item-interests m-form-checkboxes">
					<label>
						<input name="_occasional_emails[]" value="68449d845c" type="checkbox" checked> <span>Events &amp; member benefits</span>
					</label>
					<label>
						<input name="_occasional_emails[]" value="958bdb5d3c" type="checkbox"> <span>Opportunities to give input/feedback</span>
					</label>
				</div>
			</div>
		</fieldset>
		<div class="m-form-actions">
			<button type="submit" name="subscribe" id="mp-full-subscribe" class="a-button a-button-next a-button-choose">Subscribe</button>
		</div>
	</form>
</div>
