<?php
/**
 * Newsletter subscribe shortcode
 *
 * @package MinnPost Largo
 */
?>
<div class="m-form m-form-in-body m-form-newsletter-shortcode m-form-newsletter-shortcode-email"><form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" class="m-form-newsletter"><input type="hidden" name="action" value="newsletter_shortcode"><input type="hidden" name="mp_newsletter_form_nonce" value="<?php echo $newsletter_nonce; ?>"><input type="hidden" name="redirect_url" value="<?php echo $redirect_url; ?>"><input type="hidden" name="newsletters_available[]" value="04471b1571"><input type="hidden" name="_newsletters[]" value="04471b1571"><input type="hidden" name="first_name" value=""><input type="hidden" name="last_name" value=""><input type="hidden" name="confirm_message" value="<?php echo $confirm_message; ?>"><?php echo $message; ?><fieldset><div class="m-field-group m-form-item m-form-item-email"><label>Email Address: <input name="user_email" value="" type="email" required></label><button type="submit" name="subscribe" class="a-button a-button-next a-button-choose">Subscribe</button></div></fieldset></form></div>
