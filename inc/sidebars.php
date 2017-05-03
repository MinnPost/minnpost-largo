<?php
/**
 * Create sidebars for widgets
 *
 * @package MinnPost Largo
 */

// Remove the default function
add_action( 'widgets_init', 'minnpost_largo_remove_widgets_init', 11 );
function minnpost_largo_remove_widgets_init() {
    // don't need customizer widgets now
    $homepage_sections = is_customize_preview() ? 5 : get_theme_mod( 'largo_homepage_layout_settings', 5 );
	if ( $homepage_sections || is_customize_preview() ) {
		$count = 1;
		while ( $count <= $homepage_sections ) {
			$columns = is_customize_preview() ? 4 : get_theme_mod( "largo_homepage_layout_settings_$count", 4 );
			$column_count = 1;
			while ( $column_count <= $columns ) {
				unregister_sidebar("section-$count-column-$column_count");
				$column_count++;
			}
			$count++;
		}
	}
}


/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
add_action( 'widgets_init', 'minnpost_largo_widgets_init', 20 );
function minnpost_largo_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Sidebar Right', 'minnpost_largo' ),
		'id'            => 'sidebar-1',
		'description'   => __( 'Add widgets here to appear in your right sidebar.', 'minnpost_largo' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );

	register_sidebar( array(
		'name'          => __( 'Sidebar Middle', 'minnpost_largo' ),
		'id'            => 'sidebar-2',
		'description'   => __( 'Add widgets here to appear in your middle sidebar, which is more rarely used.', 'minnpost_largo' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );
}