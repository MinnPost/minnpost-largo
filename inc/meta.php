<?php
/**
 * Meta tags for <head>
 *
 * @package MinnPost Largo
 */

/**
* Make sure theme always uses the <title> tag. This fixes a homepage issue.
*
*/
if ( ! function_exists( 'minnpost_largo_title_tag' ) ) :
	add_action( 'after_setup_theme', 'minnpost_largo_title_tag' );
	function minnpost_largo_title_tag() {
		add_theme_support( 'title-tag' );
	}
endif;

/**
* Set the title correctly
*
* @return string $title
*/
if ( ! function_exists( 'minnpost_largo_get_title' ) ) :
	add_filter( 'pre_get_document_title', 'minnpost_largo_get_title' );
	function minnpost_largo_get_title() {
		if ( is_page() || is_single() ) {
			$title     = get_the_title();
			$post_id   = get_the_ID();
			$seo_title = get_post_meta( $post_id, '_mp_seo_title', true );
			if ( '' !== $seo_title ) {
				if ( false === strpos( $seo_title, get_bloginfo( 'name' ) ) ) {
					$seo_title .= ' | ' . get_bloginfo( 'name' );
				}
				$title = $seo_title;
			} else {
				if ( substr( $title, -strlen( ' | ' . get_bloginfo( 'name' ) ) ) !== ' | ' . get_bloginfo( 'name' ) ) {
					$title .= ' | ' . get_bloginfo( 'name' );
				}
			}
		} elseif ( is_front_page() ) {
			$title = get_bloginfo( 'name' );
		} elseif ( is_archive() && ! is_author() ) {
			$title = get_the_archive_title();
			if ( substr( $title, -strlen( ' | ' . get_bloginfo( 'name' ) ) ) !== ' | ' . get_bloginfo( 'name' ) ) {
				$title .= ' | ' . get_bloginfo( 'name' );
			}
		} elseif ( is_author() ) {
			$author = get_queried_object();
			$id     = $author->ID;
			$title  = get_the_title( $id );
			if ( substr( $title, -strlen( ' | ' . get_bloginfo( 'name' ) ) ) !== ' | ' . get_bloginfo( 'name' ) ) {
				$title .= ' | ' . get_bloginfo( 'name' );
			}
		} else {
			$title = '';
		}
		return $title;
	}
endif;

/**
* Set the meta description correctly
*
* @return string $excerpt with no html tags
*/
if ( ! function_exists( 'minnpost_largo_get_description' ) ) :
	function minnpost_largo_get_description() {
		if ( is_page() || is_single() ) {
			global $post;
			$excerpt  = ! empty( $post->post_excerpt ) ? get_the_excerpt() : null;
			$post_id  = get_the_ID();
			$seo_desc = get_post_meta( $post_id, '_mp_seo_description', true );
			if ( '' !== $seo_desc ) {
				$excerpt = $seo_desc;
			}
		} elseif ( is_front_page() ) {
			$excerpt = get_option( 'site_blurb' ) ? stripslashes( get_option( 'site_blurb' ) ) : '';
		} elseif ( is_category() ) {
			$id      = get_query_var( 'cat' );
			$excerpt = minnpost_get_term_text( $id );
		} elseif ( is_author() ) {
			$author  = get_queried_object();
			$id      = $author->ID;
			$excerpt = get_post_meta( $id, '_mp_author_excerpt', true );
		} else {
			$excerpt = '';
		}
		return wp_strip_all_tags( $excerpt, true );
	}
endif;

/**
* Set the og image tag
*
* @return string $image_url
*/
if ( ! function_exists( 'minnpost_largo_get_og_image' ) ) :
	function minnpost_largo_get_og_image() {
		$image_url = '';
		if ( is_single() ) {
			$image_data = get_minnpost_post_image( 'large' );
			$image_url  = isset( $image_data['image_url'] ) ? $image_data['image_url'] : '';
		} elseif ( is_front_page() ) {
			$image_url = get_option( 'default_image_url', '' );
		} elseif ( is_category() ) {
			$id         = get_query_var( 'cat' );
			$image_data = minnpost_get_term_image( $id, 'feature' );
			if ( '' !== $image_data ) {
				$image_url = isset( $image_data['image_url'] ) ? $image_data['image_url'] : '';
			}
		} elseif ( is_author() ) {
			$author     = get_queried_object();
			$id         = $author->ID;
			$image_data = minnpost_get_author_image( $id, 'photo' );
			if ( '' !== $image_data ) {
				$image_url = isset( $image_data['image_url'] ) ? $image_data['image_url'] : '';
			}
		}
		return $image_url;
	}
endif;

/**
* Get a default og image url if nothing else is present
*
* @return string $image_url
*/
if ( ! function_exists( 'minnpost_largo_get_og_default' ) ) :
	function minnpost_largo_get_og_default() {
		$image_url = '';
		if ( '' === $image_url ) {
			$image_url = get_option( 'default_image_url', '' );
		}
		return $image_url;
	}
endif;

/**
* Set the og image tag for post thumbnail also
*
* @return string $image_url
*/
if ( ! function_exists( 'minnpost_largo_get_og_image_thumbnail' ) ) :
	function minnpost_largo_get_og_image_thumbnail() {
		$image_url = '';
		if ( is_single() ) {
			$image_data = get_minnpost_post_image( 'feature-large' );
			$image_url  = isset( $image_data['image_url'] ) ? $image_data['image_url'] : '';
		}
		return $image_url;
	}
endif;

/**
* Set meta tags in <head>
*
*/
if ( ! function_exists( 'minnpost_largo_add_meta_tags' ) ) :
	add_action( 'wp_head', 'minnpost_largo_add_meta_tags' );
	function minnpost_largo_add_meta_tags() {
		?>
		<meta property="og:site_name" content="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
		<link rel="shortcut icon" href="<?php echo esc_url( get_theme_file_uri( '/assets/img/app-icons/favicon.ico' ) ); ?>" type="image/x-icon">
		<meta property="og:locale" content="<?php echo esc_attr( get_locale() ); ?>">
		<meta property="og:url" content="<?php echo esc_url( get_current_url() ); ?>">
		<meta name="twitter:site" content="@<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" />
		<?php if ( '' !== minnpost_largo_get_title() ) : ?>
			<meta property="og:title" content="<?php echo esc_attr( minnpost_largo_get_title() ); ?>">
		<?php endif; ?>
		<?php if ( '' !== minnpost_largo_get_description() ) : ?>
			<meta name="description" content="<?php echo esc_attr( minnpost_largo_get_description() ); ?>">
			<meta property="og:description" content="<?php echo esc_attr( minnpost_largo_get_description() ); ?>">
			<meta property="twitter:description" content="<?php echo minnpost_largo_get_description(); ?>">
		<?php endif; ?>
		<?php if ( is_single() ) : ?>
		<meta property="og:type" content="article">
		<meta property="article:published_time" content="<?php echo get_the_date( 'c' ); ?>">
		<meta property="article:modified_time" content="<?php echo get_the_modified_date( 'c' ); ?>">
		<?php endif; ?>
		<?php if ( is_single() ) : ?>
			<meta property="twitter:card" content="summary_large_image">
		<?php else : ?>
			<meta property="twitter:card" content="summary">
		<?php endif; ?>
		<?php if ( '' !== minnpost_largo_get_og_image() ) : ?>
			<meta property="og:image" content="<?php echo minnpost_largo_get_og_image(); ?>">
			<meta property="twitter:image" content="<?php echo minnpost_largo_get_og_image(); ?>">
		<?php endif; ?>
		<?php if ( '' !== minnpost_largo_get_og_image_thumbnail() ) : ?>
			<meta property="og:image" content="<?php echo minnpost_largo_get_og_image_thumbnail(); ?>">
		<?php endif; ?>

		<?php if ( is_single() && ! is_home() && ! wp_attachment_is_image() ) : ?>
			<?php
				global $post;
				$images = get_children(array(
					'post_parent'    => $post->ID,
					'post_type'      => 'attachment',
					'posts_per_page' => -1,
					'post_mime_type' => 'image',
				));
			?>
			<?php if ( $images ) : ?>
				<?php foreach ( $images as $image ) : ?>
					<meta property="og:image" content="<?php echo wp_get_attachment_url( $image->ID ); ?>">
				<?php endforeach; ?>
			<?php endif; ?>
		<?php endif; ?>

		<?php if ( '' === minnpost_largo_get_og_image() && '' === minnpost_largo_get_og_image_thumbnail() && '' !== minnpost_largo_get_og_default() ) : ?>
			<meta property="og:image" content="<?php echo minnpost_largo_get_og_default(); ?>">
		<?php endif; ?>

		<?php if ( is_singular() ) : ?>
			<?php
			global $wp_query;
			if ( array_key_exists( 'users', $wp_query->query_vars ) ) {
				?>
				<meta name="robots" content="noindex">
				<?php
			}
			?>
		<?php endif; ?>

		<?php if ( is_search() ) : ?>
			<meta name="robots" content="noindex, nofollow">
		<?php endif; ?>

		<?php
	}
endif;

if ( ! function_exists( 'admin_favicon' ) ) :
	add_action( 'admin_head', 'admin_favicon' );
	function admin_favicon() {
		echo '<link rel="shortcut icon" href="' . esc_url( get_theme_file_uri( '/assets/img/app-icons/favicon.ico' ) ) . '" type="image/x-icon">';
	}
endif;

if ( ! function_exists( 'remove_dashboard_widgets' ) ) :
	add_action( 'wp_dashboard_setup', 'remove_dashboard_widgets' );
	function remove_dashboard_widgets() {
		global $wp_meta_boxes;
		$normal               = $wp_meta_boxes['dashboard']['normal']['core'];
		$allowed_normal_boxes = array( 'dashboard_right_now', 'dashboard_activity' );

		foreach ( $normal as $key => $normal_box ) {
			if ( ! in_array( $normal_box['id'], $allowed_normal_boxes ) ) {
				unset( $wp_meta_boxes['dashboard']['normal']['core'][ $key ] );
			}
		}

		$side               = $wp_meta_boxes['dashboard']['side']['core'];
		$allowed_side_boxes = array( 'dashboard_quick_press' );
		foreach ( $side as $key => $side_box ) {
			if ( ! in_array( $side_box['id'], $allowed_side_boxes ) ) {
				unset( $wp_meta_boxes['dashboard']['side']['core'][ $key ] );
			}
		}
	}
endif;
