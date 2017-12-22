<?php
/**
 * Meta tags for <head>
 *
 * @package MinnPost Largo
 */

if ( ! function_exists( 'minnpost_largo_load_custom_scripts' ) ) :
	add_action( 'wp_enqueue_scripts', 'minnpost_largo_load_custom_scripts' );
	function minnpost_largo_load_custom_scripts() {
		wp_enqueue_script( 'modernizr', get_theme_file_uri() . '/assets/js/modernizr-custom.js', array(), '1.0', true );
		wp_enqueue_script( 'minnpost', get_theme_file_uri() . '/assets/js/minnpost.js', array( 'jquery', 'modernizr' ), '1.0', false );
	}
endif;

if ( ! function_exists( 'minnpost_largo_get_title' ) ) :
	function minnpost_largo_get_title() {
		if ( is_page() || is_single() ) {
			$title = get_the_title();
		} elseif ( is_front_page() ) {
			$title = get_bloginfo( 'name' );
		} elseif ( is_archive() && ! is_author() ) {
			$title = get_the_archive_title();
		} elseif ( is_author() ) {
			$author = get_queried_object();
    		$id = $author->ID;
    		$title = get_the_title( $id );
		} else {
			$title = '';
		}
		return $title;
    }
endif;

if ( ! function_exists( 'minnpost_largo_get_description' ) ) :
	function minnpost_largo_get_description() {
		if ( is_page() || is_single() ) {
			$excerpt = get_the_excerpt();
		} elseif ( is_front_page() ) {
			$excerpt = get_option( 'site_blurb' ) ? stripslashes( get_option( 'site_blurb' ) ) : '';
		} elseif ( is_category() ) {
			$id = get_query_var( 'cat' );
			$excerpt = minnpost_get_term_text( $id );
		} elseif ( is_author() ) {
			$author = get_queried_object();
    		$id = $author->ID;
			$excerpt = get_post_meta( $id, '_mp_author_excerpt', true );
		} else {
			$excerpt = '';
		}
		return strip_tags( $excerpt );
	}
endif;

if ( ! function_exists( 'minnpost_largo_get_og_image' ) ) :
	function minnpost_largo_get_og_image() {
		$image_url = '';
		if ( is_single() ) {
			$image_data = get_minnpost_post_image( 'large' );
			$image_url = $image_data['image_url'];
		} elseif ( is_front_page() ) {
			$image_url = get_option( 'default_image_url', '' );
		} elseif ( is_category() ) {
			$id = get_query_var( 'cat' );
			$image_data = minnpost_get_term_image( $id, 'feature' );
			if ( '' !== $image_data ) {
				$image_url = $image_data['image_url'];
			}
		} elseif ( is_author() ) {
			$author = get_queried_object();
    		$id = $author->ID;
			$image_data = minnpost_get_author_image( $id, 'photo' );
			if ( '' !== $image_data ) {
				$image_url = $image_data['image_url'];
			}
		}
		return $image_url;
	}
endif;


if ( ! function_exists( 'minnpost_largo_add_meta_tags' ) ) :
	add_action('wp_head', 'minnpost_largo_add_meta_tags');
	function minnpost_largo_add_meta_tags() {
	?>
		<meta property="og:site_name" content="<?php echo get_bloginfo( 'name' ); ?>">
		<meta property="og:url" content="<?php echo get_current_url(); ?>">
		<meta name="twitter:site" content="@minnpost" />
		<?php if ( '' !== minnpost_largo_get_title() ) : ?>
			<meta property="og:title" content="<?php echo minnpost_largo_get_title(); ?>">
		<?php endif; ?>
		<?php if ( '' !== minnpost_largo_get_description() ) : ?>
			<meta name="description" content="<?php echo minnpost_largo_get_description(); ?>">
			<meta property="og:description" content="<?php echo minnpost_largo_get_description(); ?>">
			<meta property="twitter:description" content="<?php echo minnpost_largo_get_description(); ?>">
		<?php endif; ?>
		<?php if ( is_single() ) : ?>
		<meta property="og:type" content="article">
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
	<?php }
endif;