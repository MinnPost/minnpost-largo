<?php
/**
 * Create sidebars for widgets
 *
 * @package MinnPost Largo
 */

// turn off the block widget editor.
add_filter( 'use_widgets_block_editor', '__return_false' );

/**
 * Remove default largo sidebar settings
 */
if ( ! function_exists( 'minnpost_largo_remove_widgets_init' ) ) :
	add_action( 'widgets_init', 'minnpost_largo_remove_widgets_init', 11 );
	function minnpost_largo_remove_widgets_init() {
		// don't need customizer widgets now
		$homepage_sections = is_customize_preview() ? 5 : get_theme_mod( 'largo_homepage_layout_settings', 5 );
		if ( $homepage_sections || is_customize_preview() ) {
			$count = 1;
			while ( $count <= $homepage_sections ) {
				$columns      = is_customize_preview() ? 4 : get_theme_mod( "largo_homepage_layout_settings_$count", 4 );
				$column_count = 1;
				while ( $column_count <= $columns ) {
					unregister_sidebar( "section-$count-column-$column_count" );
					$column_count++;
				}
				$count++;
			}
		}
	}
endif;


/**
 * Register our sidebar widget areas.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
if ( ! function_exists( 'minnpost_largo_widgets_init' ) ) :
	add_action( 'widgets_init', 'minnpost_largo_widgets_init', 20 );
	function minnpost_largo_widgets_init() {
		register_sidebar(
			array(
				'name'          => __( 'Footer', 'minnpost_largo' ),
				'id'            => 'sidebar-3',
				'description'   => __( 'Add widgets here to appear in the site footer', 'minnpost_largo' ),
				'before_widget' => '<section id="%1$s" class="widget %2$s">',
				'after_widget'  => '</section>',
				'before_title'  => '<h3 class="widget-title">',
				'after_title'   => '</h3>',
			)
		);
		register_sidebar(
			array(
				'name'          => __( 'Sidebar Right', 'minnpost_largo' ),
				'id'            => 'sidebar-1',
				'description'   => __( 'Add widgets here to appear in your right sidebar.', 'minnpost_largo' ),
				'before_widget' => '<div id="%1$s" class="widget %2$s">',
				'after_widget'  => '</div>',
				'before_title'  => '<h3 class="widget-title">',
				'after_title'   => '</h3>',
			)
		);
		register_sidebar(
			array(
				'name'          => __( 'Homepage Glean', 'minnpost_largo' ),
				'id'            => 'sidebar-glean',
				'description'   => __( 'This should only contain the Glean that sits within the homepage content flow.', 'minnpost_largo' ),
				'before_widget' => '<section id="%1$s" class="m-widget-glean m-widget-glean-home-content %2$s">',
				'after_widget'  => '</section>',
				'before_title'  => '<h3 class="h4 widget-title">',
				'after_title'   => '</h3>',
			)
		);
		register_sidebar(
			array(
				'name'          => __( 'Homepage Spills', 'minnpost_largo' ),
				'id'            => 'sidebar-spills',
				'description'   => __( 'This should contain spills that sit within the homepage content flow.', 'minnpost_largo' ),
				'before_widget' => '<section id="%1$s" class="m-widget-spills m-widget-spills-home-content %2$s">',
				'after_widget'  => '</section>',
				'before_title'  => '<h3 class="widget-title">',
				'after_title'   => '</h3>',
			)
		);
		register_sidebar(
			array(
				'name'          => __( 'Homepage Membership', 'minnpost_largo' ),
				'id'            => 'sidebar-membership',
				'description'   => __( 'This should contain spills for membership content on the homepage.', 'minnpost_largo' ),
				'before_widget' => '<section id="%1$s" class="m-widget-spills m-widget-spills-membership-content %2$s">',
				'after_widget'  => '</section>',
				'before_title'  => '<h3 class="widget-title">',
				'after_title'   => '</h3>',
			)
		);
	}
endif;
