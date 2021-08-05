<?php
/**
 * The header for our MinnPost Tonight theme
 *
 * This is the tonight template that displays all of the <head> section and everything up until <div id="content">
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

	<header id="masthead" class="o-header o-header-tonight">
		<?php $event_logo_info = minnpost_largo_get_event_website_logo_info( 'tonight' ); ?>
		<div class="o-wrapper o-wrapper-site-navigation">
			<?php get_template_part( 'template-parts/logo', 'tonight', $event_logo_info ); ?>
			<nav id="navigation-primary" class="m-main-navigation m-main-navigation-tonight">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'tonight',
						'menu_id'        => 'tonight-menu',
						'container'      => false,
						'walker'         => new Minnpost_Walker_Nav_Menu,
						'item_classes'   => 'values',
						'items_wrap'     => '<ul id="%1$s" class="m-menu m-menu-%1$s">%3$s</ul>',
					)
				);
				?>
			</nav>

			<?php
			$hide_details = get_post_meta( $id, '_mp_remove_event_details_from_display', true );
			if ( 'on' !== $hide_details ) :
				?>
			<div class="m-event-details m-tonight-dates">
				<?php do_action( 'tribe_events_single_event_before_the_meta' ); ?>
				<div class="m-event-date-and-calendar">
					<?php get_template_part( 'tribe/events/modules/meta/date', '', array( 'show_timezone' => true, 'separator' => '&ndash;' ) ); ?>
					<?php do_action( 'tribe_events_single_event_after_the_content' ); ?>
				</div>
			</div>
			<?php endif; ?>

			
		</div>
		<?php if ( false === $event_logo_info['is_current_url'] && ! is_singular( array( 'tribe_events', 'tribe_ext_speaker' ) ) ) : ?>
			<div class="o-wrapper o-wrapper-tonight-page-title">
				<?php the_title( '<h1 class="a-page-title">', '</h1>' ); ?>
			</div>
		<?php endif; ?>
	</header><!-- #masthead -->

	<?php do_action( 'wp_message_inserter', 'header' ); ?>

	<div id="content" class="o-wrapper o-wrapper-content o-wrapper-content-tonight<?php echo ( false !== get_query_var( 'grid', false ) ) ? ' o-wrapper-grid-overlay' : ''; ?>">
