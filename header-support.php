<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MinnPost Largo
 */

?><!DOCTYPE html>
<html class="no-js" <?php language_attributes(); ?>>
<head <?php do_action( 'add_head_attributes' ); ?>>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

	<header id="masthead" class="o-header o-header-support">
		<div class="o-wrapper o-wrapper-site-header<?php echo ( get_query_var( 'grid', false ) !== false ) ? ' o-wrapper-grid-overlay' : ''; ?>">
			<?php get_template_part( 'template-parts/logo', 'top' ); ?>
			<?php do_action( 'minnpost_membership_site_header', false ); ?>
		</div>
	</header><!-- #masthead -->

	<?php
	$full_class = '';
	if ( is_singular() ) {
		$full_class = ' o-wrapper-content-full';
	}
	?>

	<?php do_action( 'wp_message_inserter', 'header' ); ?>

	<div id="content" class="o-wrapper o-wrapper-content<?php echo $full_class; ?><?php echo ( get_query_var( 'grid', false ) !== false ) ? ' o-wrapper-grid-overlay' : ''; ?>">
