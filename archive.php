<?php
/**
 * The template for displaying archive pages
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package MinnPost Largo
 */

get_header(); ?>

	<div id="primary" class="m-layout-primary o-archive-listing">
		<main id="main" class="site-main">

		<?php
		if ( is_category() ) {
			$object_id   = $wp_query->get_queried_object_id();
			$object_type = 'category';
		} elseif ( is_tag() ) {
			$object_id   = $wp_query->get_queried_object_id();
			$object_type = 'post_tag';
		} elseif ( is_author() ) {
			$object_id   = get_the_author_meta( 'ID' );
			$object_type = 'author';
		}

		if ( isset( $object_type ) ) {
			$archive_type = $object_type;
			$sponsorship  = minnpost_get_content_sponsorship( $object_type, $object_id );
			if ( 'author' === $object_type ) {
				$figure = minnpost_get_author_figure();
			} else {
				$figure = minnpost_get_term_figure( $object_id );
			}
		} else {
			if ( is_year() || is_month() || is_day() ) {
				$archive_type = 'date';
			}
		}
		?>

		<header class="m-archive-header<?php if ( is_year() || is_month() || is_day() ) { echo ' m-archive-header-time'; } ?>">
			<?php
				the_archive_title( '<h1 class="a-archive-title">', '</h1>' );
				the_archive_description( '<div class="archive-description">', '</div>' );
			?>
		</header><!-- .m-archive-header -->

		<?php if ( is_category() || is_tag() ) : ?>
			<div class="m-archive-info m-term-info m-term-full-info">
				<?php
				if ( '' !== $figure && isset( $object_type ) ) {
					// description and image
					echo $figure;
				} else {
					$text = minnpost_get_term_text( $object_id );
					if ( '' !== $text ) {
						echo '<div class="a-description">' . $text . '</div>';
					}
				}
				?>
				<?php
				$term_extra_links = minnpost_get_term_extra_links( $object_id );
				if ( '' !== $term_extra_links ) :
					?>
					<ul class="a-archive-links a-category-links">
						<?php minnpost_term_extra_links( $object_id ); ?>
					</ul>
				<?php endif; ?>
			</div>
		<?php elseif ( is_author() ) : ?>
			<div class="m-archive-info m-author-info m-author-full-info">
				<?php
				minnpost_author_figure();
				$author_email   = get_post_meta( $object_id, 'cap-user_email', true );
				$author_twitter = get_post_meta( $object_id, 'cap-twitter', true );
				if ( '' !== $author_email || '' !== $author_twitter ) :
					?>
					<ul class="a-archive-links a-author-links">
						<?php if ( '' !== $author_email ) : ?>
							<li class="a-email-link"><a href="mailto:<?php echo $author_email; ?>"><?php echo __( 'Email', 'minnpost-largo' ); ?></a></li>
						<?php endif; ?>
						<?php if ( '' !== $author_twitter ) : ?>
							<li class="a-twitter-link"><a href="<?php echo $author_twitter; ?>"><?php echo __( 'Twitter', 'minnpost-largo' ); ?></a></li>
						<?php endif; ?>
					</ul>
				<?php endif; ?>
			</div>
			<h2 class="a-archive-subtitle"><?php echo __( 'Articles by this author:', 'minnpost-largo' ); ?></h2>
		<?php elseif ( is_year() ) : ?>
			<form method="post" class="m-form m-form-archive" action="<?php echo admin_url( 'admin-post.php' ); ?>">
				<input type="hidden" name="action" value="date_archive_submit">
				<label for="archive-dropdown"><?php echo __( 'Select a different year', 'minnpost-largo' ); ?></label>
				<div class="a-input-with-button a-button-sentence">
					<select id="archive-dropdown" name="archive_dropdown" onchange="document.location.href=this.options[this.selectedIndex].value;">
						<option value=""><?php esc_attr( _e( 'Select Year', 'minnpost-largo' ) ); ?></option>
						<?php
						wp_get_archives(
							array(
								'type'            => 'yearly',
								'format'          => 'option',
								'show_post_count' => 0,
							)
						);
						?>
					</select>
					<input type="submit" value="<?php echo __( 'Go', 'minnpost-largo' ); ?>">
				</div>
			</form>
		<?php elseif ( is_month() ) : ?>
			<form method="post" class="m-form m-form-archive" action="<?php echo admin_url( 'admin-post.php' ); ?>">
				<input type="hidden" name="action" value="date_archive_submit">
				<label for="archive-dropdown"><?php echo __( 'Select a different month', 'minnpost-largo' ); ?></label>
				<div class="a-input-with-button a-button-sentence">
					<select id="archive-dropdown" name="archive_dropdown">
						<option value=""><?php esc_attr( _e( 'Select Month', 'minnpost-largo' ) ); ?></option>
						<?php
						wp_get_archives(
							array(
								'type'            => 'monthly',
								'format'          => 'option',
								'show_post_count' => 0,
							)
						);
						?>
					</select>
					<input type="submit" value="<?php echo __( 'Go', 'minnpost-largo' ); ?>">
				</div>
			</form>
		<?php endif; ?>

		<?php
		if ( isset( $sponsorship ) && '' !== $sponsorship && isset( $object_type ) ) {
			echo '<div class="m-category-info">';
				minnpost_content_sponsorship( $object_type, $object_id );
			echo '</div>';
		}
		?>

		<?php if ( have_posts() ) : ?>
			<?php
			$paged              = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
			$archive_type_class = isset( $archive_type ) ? ' m-archive-' . $archive_type : '';
			?>
			<section class="m-archive m-archive-excerpt<?php echo $archive_type_class; ?>">
				<?php
				while ( have_posts() ) :
					the_post();
					get_template_part( 'template-parts/content', 'excerpt' );
				endwhile;
				?>
				<?php numeric_pagination(); ?>
			</section>
			<?php
		else :
			get_template_part( 'template-parts/content', 'none' );
		endif;
		?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();
