<?php
/**
 * Newsletter subscribe DC only full page
 *
 * @package MinnPost Largo
 */
?>

<div class="m-form m-form-standalone m-form-newsletter-shortcode m-form-newsletter-dc" id="form-newsletter-shortcode-dc">
	<p><img src="<?php echo get_theme_file_uri() . '/assets/img/dc-memo-header-520x50.png'; ?>" alt="MinnPost D.C. Memo"></p>
	<form id="form-newsletter-dc" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" class="m-form-newsletter">
		<input type="hidden" name="action" value="newsletter_shortcode">
		<input type="hidden" name="mp_newsletter_form_nonce" value="<?php echo $newsletter_nonce; ?>">
		<input type="hidden" name="redirect_url" value="<?php echo $redirect_url; ?>">
		<input type="hidden" name="newsletters_available[]" value="d89249e207">
		<input type="hidden" name="_newsletters[]" value="d89249e207">
		<?php echo wpautop( $content ); ?>
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
		</fieldset>
		<div class="m-form-actions">
			<button type="submit" name="subscribe" id="mp-full-subscribe" class="a-button a-button-next a-button-choose">Subscribe</button>
		</div>
	</form>
</div>
