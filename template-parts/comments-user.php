<?php
/**
 * Template part for displaying comments on a user's profile
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

?>
<section class="o-comments-area o-comments-area-user">
	<h3 class="a-comments-title">Recent Comments</h3>
	<ol>
		<?php foreach ( $comments as $comment ) : ?>
			<li>
				<?php
				$post_id    = $comment->comment_post_ID;
				$post_link  = get_the_permalink( $post_id );
				$post_title = get_the_title( $post_id );

				// comment date
				$comment_dateline = '';
				if ( function_exists( 'get_ap_comment_date' ) && function_exists( 'get_ap_comment_time' ) ) {
					if ( 'today' === get_ap_comment_date() ) {
						$comment_dateline = sprintf(
							// translators: 1) is the human readable time difference
							_x( '%1$s ago', '%2$s = human-readable time difference', 'minnpost-largo' ),
							human_time_diff(
								get_comment_time( 'U' ),
								strtotime( wp_date( 'Y-m-d H:i:s' ) )
							)
						);
					} else {
						$comment_dateline = sprintf(
							// translators: 1) is the human readable time difference
							_x( 'on %1$s', '%2$s = comment date/time', 'minnpost-largo' ),
							get_ap_comment_date() . ' at ' . get_ap_comment_time()
						);
					}
				} else {
					$comment_dateline = sprintf(
						// translators: 1) user profile name/link, 2) comment link, 3) comment date, 4) comment time
						esc_html__( 'By %1$s on ' ) . '<a class="a-comment-permalink" href="%2$s">%3$s - %4$s</a>',
						get_user_name_or_profile_link( $comment ),
						htmlspecialchars( get_comment_link( $comment->comment_ID ) ),
						get_comment_date(),
						get_comment_time()
					);
				}
				$comment_byline = sprintf(
					// translators: 1) post link, 2) post title
					esc_html__( 'Posted in response to %1$s' ),
					'<a href="' . $post_link . '">' . $post_title . '</a>'
				);
				?>
				<div class="o-comment" id="comment-<?php echo $comment->comment_ID; ?>">
					<div class="m-comment-meta">
						<div class="a-comment-byline">
							<?php echo $comment_byline; ?>
						</div>
						<?php if ( '' !== $comment_dateline ) : ?>
							<div class="a-comment-dateline"><?php echo $comment_dateline; ?></div>
						<?php endif; ?>
					</div>
					<div class="m-comment-entry">
						<?php echo wpautop( $comment->comment_content ); ?>
					</div>
				</div>
			</li>
		<?php endforeach; ?>
	</ol>
	<?php if ( ! empty( $pagination ) ) : ?>
		<div class="m-pagination">
			<?php echo $pagination; ?>
		</div>
	<?php endif; ?>
</section>
