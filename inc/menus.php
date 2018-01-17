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
				'featured_columns' => __( 'Featured Columns' ), // featured columns on homepage, category pages
				'minnpost_network' => __( 'Network Menu' ), // social networks, rss
				'support_minnpost' => __( 'Support Menu' ), // the support box next to the top banner ad
				'secondary_links' => __( 'Secondary' ), // that weird nav next to logo with columns, weather, events, support
				'primary_links' => __( 'Primary' ), // main nav below logo
				'user_account' => __( 'User Account Menu' ), // menu where users log in/register/log out
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

			// find the current menu item
			foreach ( $sorted_menu_items as $menu_item ) {

				$found_top_parent_id = false;
				if ( ( 0 === $menu_item->menu_item_parent && 1 === $menu_item->current_item_ancestor ) || ( 0 === $menu_item->menu_item_parent && 1 === $menu_item->current ) ) {
					$root_id = $menu_item->ID;
				}

				if ( $menu_item->current ) {
					// set the root id based on whether the current menu item has a parent or not
					$root_id = ( $menu_item->menu_item_parent ) ? $menu_item->menu_item_parent : $menu_item->ID;
					break;
				}
			}

			if ( is_home() ) {
				$root_id = 0;
				$menu = wp_get_nav_menu_items( $args->menu->name, array(
					'posts_per_page' => -1,
					'meta_key' => '_menu_item_menu_item_parent',
					'meta_value' => $root_id,
				));
				$root_id = $menu[0]->ID;
			}

			// fix places that are not part of any category
			if ( ! isset( $root_id ) ) {
				return;
			}

			$menu_item_parents = array();
			foreach ( $sorted_menu_items as $key => $item ) {

				// init menu_item_parents
				if ( (int) $root_id === (int) $item->ID ) {
					$menu_item_parents[] = $item->ID;
				} elseif ( (int) $root_id === (int) $item->menu_item_parent ) {
					$menu_item_parents[] = $item->menu_item_parent;
					break;
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

		// if we aren't on the main category, remove the active classes for other categories
		if ( is_singular( 'post' ) ) {
			$primary_category = get_post_meta( get_the_id(), '_category_permalink', true );
			if ( isset( $primary_category['category'] ) ) {
				$cat_id = $primary_category['category'];
			} else {
				$cat_id = 0;
			}
			if ( $cat_id !== $item->object_id ) {
				$active_class = '';
			}
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
