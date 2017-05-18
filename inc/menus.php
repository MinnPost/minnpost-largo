<?php
/**
 * Create custom menus
 *
 * @package MinnPost Largo
 */

if ( ! function_exists( 'minnpost_menus' ) ) :
	function minnpost_menus() {
		// Add Your Menu Locations
		register_nav_menus(
			array(
				'footer_primary' => __( 'Footer Primary' ), // main footer. about, advertise, member benefits, etc
				'footer_secondary' => __( 'Footer Secondary' ), // bottom of footer. careers, etc
				'minnpost_network' => __( 'Network Menu' ), // social networks, rss
				'support_minnpost' => __( 'Support Menu' ), // the support box next to the top banner ad
				'secondary_links' => __( 'Secondary' ), // that weird nav next to logo with columns, weather, events, support
				'primary_links' => __( 'Primary' ), // main nav below logo
			)
		);
		unregister_nav_menu( 'menu-1' );
	}

	add_action( 'init', 'minnpost_menus' );

endif;

if ( ! function_exists( 'minnpost_wp_nav_menu_objects_sub_menu' ) ) :
	// get submenu functionality from https://christianvarga.com/how-to-get-submenu-items-from-a-wordpress-menu-based-on-parent-or-sibling/

	// filter_hook function to react on sub_menu flag
	function minnpost_wp_nav_menu_objects_sub_menu( $sorted_menu_items, $args ) {
		if ( isset( $args->sub_menu ) ) {
			$root_id = 0;

			// find the current menu item
			foreach ( $sorted_menu_items as $menu_item ) {
				if ( $menu_item->current ) {
					// set the root id based on whether the current menu item has a parent or not
					$root_id = ( $menu_item->menu_item_parent ) ? $menu_item->menu_item_parent : $menu_item->ID;
					break;
				}
			}

			// find the top level parent
			if ( ! isset( $args->direct_parent ) ) {
				$prev_root_id = $root_id;
				while ( 0 !== (int) $prev_root_id ) {
					foreach ( $sorted_menu_items as $menu_item ) {
						if ( $menu_item->ID === $prev_root_id ) {
							$prev_root_id = $menu_item->menu_item_parent;
							// don't set the root_id to 0 if we've reached the top of the menu
							if ( 0 !== (int) $prev_root_id ) {
								$root_id = $menu_item->menu_item_parent;
							}
							break;
						}
					}
				}
			}
			$menu_item_parents = array();
			foreach ( $sorted_menu_items as $key => $item ) {
				// init menu_item_parents
				if ( $root_id === (int) $item->ID ) {
					$menu_item_parents[] = $item->ID;
				}
				if ( in_array( $item->menu_item_parent, $menu_item_parents ) ) {
					// part of sub-tree: keep!
					$menu_item_parents[] = $item->ID;
				} elseif ( ! ( isset( $args->show_parent ) && in_array( $item->ID, $menu_item_parents ) ) ) {
					// not part of sub-tree: away with it!
					unset( $sorted_menu_items[ $key ] );
				}
			}

			return $sorted_menu_items;
		} else {
			return $sorted_menu_items;
		} // End if().
	}

	add_filter( 'wp_nav_menu_objects', 'minnpost_wp_nav_menu_objects_sub_menu', 10, 2 );

endif;

class Minnpost_Walker_Nav_Menu extends Walker_Nav_Menu {
	public function start_lvl( &$output, $depth = 0, $args = array() ) {
		$output .= '<ul>';
	}

	public function end_lvl( &$output, $depth = 0, $args = array() ) {
		$output .= '</ul>';
	}

	public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
		$classes = array();
		if ( ! empty( $item->classes ) ) {
			$classes = (array) $item->classes;
		}

		$active_class = '';
		if ( in_array( 'current-menu-item', $classes ) ) {
			$active_class = ' class="active"';
		} elseif ( in_array( 'current-menu-parent', $classes ) ) {
			$active_class = ' class="active-parent"';
		} elseif ( in_array( 'current-menu-ancestor', $classes ) ) {
			$active_class = ' class="active-ancestor"';
		}

		$url = '';
		if ( ! empty( $item->url ) ) {
			$url = $item->url;
		}

		if ( isset( $args->item_classes ) && 'values' === $args->item_classes ) {
			if ( '' !== $active_class ) {
				$active_class .= ' ' . sanitize_title( $item->title );
			} else {
				$active_class = ' class="' . sanitize_title( $item->title ) . '"';
			}
		}

		$output .= '<li' . $active_class . '><a href="' . $url . '">' . $item->title . '</a></li>';
	}

	public function end_el( &$output, $item, $depth = 0, $args = array() ) {
		$output .= '</li>';
	}
}
