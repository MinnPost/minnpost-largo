<?php
/**
 * Custom widget methods
 *
 * @package MinnPost Largo
 */

if ( ! function_exists( 'minnpost_largo_user_has_topics' ) ) :
	function minnpost_largo_user_has_topics() {
		$user_id = get_current_user_id();
		if ( 0 === $user_id ) {
			return false;
		}
		$user_topics = maybe_unserialize( get_user_meta( $user_id, '_reading_topics', true ) );
		if ( '' === $user_topics || ! is_array( $user_topics ) ) {
			return false;
		} else {
			return true;
		}
	}
endif;

if ( ! function_exists( 'minnpost_largo_picked_for_you' ) ) :
	function minnpost_largo_picked_for_you( $before_title, $title, $after_title, $content, $categories, $terms ) {

		$user_id = get_current_user_id();
		if ( 0 === $user_id ) {
			return;
		}

		$query_categories = array();

		if ( isset( $categories ) ) {
			foreach ( $categories as $slug ) {
				$category           = get_category_by_slug( $slug );
				$query_categories[] = $category->cat_ID;
			}
		}

		$user_topics = maybe_unserialize( get_user_meta( $user_id, '_reading_topics', true ) );
		foreach ( $user_topics as $topic ) {
			$term = get_term_by( 'slug', sanitize_title( $topic ), 'category' );
			if ( false !== $term ) {
				$cat_id             = $term->term_id;
				$query_categories[] = $cat_id;
			}
		}

		if ( $title ) {
			$before_title = str_replace( 'widget-title', 'a-widget-title', $before_title );
			echo $before_title . $title . $after_title;
		}

		$query_args = array(
			'posts_per_page' => 5,
			'category__in'   => $query_categories,
			'orderby'        => 'date',
		);
		if ( 'production' === VIP_GO_ENV ) {
			$query_args['es'] = true; // elasticsearch on production only
		}
		$query_args = new WP_Query( $query_args );

		?>

		<?php if ( $query_args->have_posts() ) : ?>
			<div class="m-widget-contents">
				<?php if ( '' !== $content ) : ?>
					<?php echo $content; ?>
				<?php endif; ?>
				<!-- the loop -->
				<?php
				while ( $query_args->have_posts() ) :
					$query_args->the_post();
					?>
					<article id="<?php the_ID(); ?>" class="m-post m-post-spill">
						<?php
						if ( function_exists( 'minnpost_get_permalink_category_id' ) ) {
							$category_id = minnpost_get_permalink_category_id( get_the_ID() );
							$category    = get_category( $category_id );
						} else {
							$url_array = explode( '/', get_permalink() );
							$slug      = $url_array[3];
							$category  = get_category_by_slug( $category );
						}
						if ( is_object( $category ) && ! is_wp_error( $category ) ) {
							?>
						<p class="a-post-category a-spill-item-category"><?php echo $category->name; ?></p>
						<?php } ?>
						<p class="a-post-title a-spill-item-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></p>
					</article>
				<?php endwhile; ?>
				<!-- end of the loop -->

				<?php wp_reset_postdata(); ?>
			</div>

		<?php endif; ?>

		<?php
	}
endif;
