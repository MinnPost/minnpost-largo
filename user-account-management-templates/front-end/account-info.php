<section class="o-user-summary">
	<dl class="m-member-info m-member-info-<?php echo $attributes['member_level_value']; ?>">
		<dt class="a-member-level">MinnPost Membership Level</dt>
		<dd class="a-member-level"><?php echo $attributes['member_level_name']; ?></dd>
		<dd class="a-membership-actions"> <a href="/support" class="a-button a-button-submit a-button-support">Support MinnPost Now</a><a href="/support/member-benefits">Learn about member benefits</a></dd>
	</dl>
</section>

<section class="o-user-section o-story-recommendations">
	<h2 class="a-user-section-title">Story recommendations for you</h2>
	<?php if ( ! empty( $attributes['reading_topics'] ) ) : ?>
		<p class="a-has-interests"><strong>Based on Your Interests:</strong> <span class="interests"><?php echo implode( ', ', array_values( $attributes['reading_topics'] ) ); ?></span> | <a href="/user/41043/edit/preferences?destination=user%2F41043%2Fview">Edit interests</a></p>
		<div class="m-interest-posts">
			<ul>
			<?php
			if ( $attributes['topics_query']->have_posts() ) {
				while ( $attributes['topics_query']->have_posts() ) {
					$attributes['topics_query']->the_post();
					?>
					<?php get_template_part( 'template-parts/content', 'interests' ); ?>
					<?php
				}
				wp_reset_postdata();
			}
			?>
			</ul>
		</div>
	<?php else : ?>
		<p class="a-button-sentence"><a href="/user/preferences/" class="a-button a-button-next a-button-interests">Tell us your interests</a> <span class="a-interest-explain">to see personalized recommendations</span></p>
	<?php endif; ?>
</section>

<section class="o-user-section o-communication-preferences">
	<h2 class="a-user-section-title">Communication preferences</h2>

	<?php
		$user_info   = get_mailchimp_user_values( array(), array(), true );
		$user_emails = isset( $user_info['checked'] ) ? array_values( $user_info['checked'] ) : array();
	?>

	<?php if ( ! empty( $user_emails ) ) : ?>

		<?php
		$newsletters            = get_mailchimp_newsletter_options();
		$occasional_emails      = get_mailchimp_occasional_email_options();
		$newsletter_index       = 1;
		$occasional_email_index = 1;
		$user_newsletters       = array();
		$user_occasional        = array();
		foreach ( $newsletters as $key => $value ) {
			if ( in_array( $key, $user_emails ) ) {
				$user_newsletters[ $key ] = $value;
			}
		}
		foreach ( $occasional_emails as $key => $value ) {
			if ( in_array( $key, $user_emails ) ) {
				$user_occasional[ $key ] = $value;
			}
		}
		?>

		<p>These are the MinnPost email messages that you currently receive. You can <a href="/user/preferences/">edit your preferences</a> to change them.</p>
		<dl class="a-user-emails">
			<dt>Newsletter subscriptions</dt>
			<dd><?php echo implode( ', ', array_values( $user_newsletters ) ); ?></dd>
			<dt>Occasional messages</dt>
			<dd><?php echo implode( ', ', array_values( $user_occasional ) ); ?></dd>
		</dl>
		<p class="a-edit-preferences"><a href="/user/preferences/">Edit your preferences</a></p>
	<?php else : ?>
		<p>You are not subscribed to any MinnPost emails. You can <a href="/user/preferences/">edit your preferences</a>.</p>
	<?php endif; ?>
</section>
