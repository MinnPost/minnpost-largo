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
</section>
