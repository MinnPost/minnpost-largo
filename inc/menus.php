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
				'user_account_access' => __( 'User Account Access Menu' ), // menu where users log in/register/log out
				'user_account_management' => __( 'User Account Management Menu' ), // menu where users manage their account info/preferences
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

	private $user_id;

	public function __construct( $user_id = '' ) {
		$this->user_id = $user_id;
	}

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
			$length = strlen( $url );
			if ( home_url( '/' ) !== $url && substr( wp_logout_url(), 0, $length ) === $url ) {
				$url = wp_logout_url();
			}
			if ( site_url( '/users/userid' ) === $url ) {
				if ( '' !== $this->user_id && get_current_user_id() !== $this->user_id ) {
					$user_id = $this->user_id;
				} else {
					$user_id = get_current_user_id();
				}
				$url = site_url( '/users/' . $user_id . '/' );
				if ( rtrim( get_current_url(), '/' ) . '/' === $url ) {
					$active_class = ' class="active"';
				}
			}
			if ( strpos( $url, '/user/' ) && '' !== $this->user_id && get_current_user_id() !== $this->user_id ) {
				$url = $url . '?user_id=' . $this->user_id;
			}
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

// show admin bar only for users with see_admin_bar capability
if ( ! current_user_can( 'see_admin_bar' ) ) {
	add_filter( 'show_admin_bar', '__return_false' );
}

// change links/menus in the admin bar
if ( ! function_exists( 'minnpost_largo_admin_bar_render' ) ) :
	add_action( 'wp_before_admin_bar_render', 'minnpost_largo_admin_bar_render' );
	function minnpost_largo_admin_bar_render() {
		global $wp_admin_bar;
		// remove security from non admins
		if ( ! current_user_can( 'manage_options' ) ) {
			$wp_admin_bar->remove_menu( 'itsec_admin_bar_menu' );
		}

		global $wp_query;

		// edit/view user stuff
		if ( isset( $_REQUEST['user_id'] ) ) {
			$user_id = esc_attr( $_REQUEST['user_id'] );
		} elseif ( array_key_exists( 'users', $wp_query->query_vars ) ) {
			$user_id = $wp_query->query_vars['users'];
		} else {
			$user_id = get_current_user_id();
		}
		if ( ! current_user_can( 'edit_user', $user_id ) ) {
			$wp_admin_bar->remove_menu( 'vaa' );
		} else {
			global $post;
			$page = get_page_by_path( 'user' );
			$user_parent_id = $page->ID;

			if ( array_key_exists( 'users', $wp_query->query_vars ) ) {
				$wp_admin_bar->remove_menu( 'edit' );
				if ( current_user_can( 'edit_user', $user_id ) && $edit_user_link = get_edit_user_link( $user_id ) ) {
					$wp_admin_bar->add_menu( array(
						'id'    => 'edit',
						'title' => __( 'Edit User' ),
						'href'  => $edit_user_link,
					) );
				}
			}

			if ( isset( $post ) && ( $post->post_parent === $user_parent_id || $post->ID === $user_parent_id )
				&& current_user_can( 'edit_user', $user_id )
				&& $edit_user_link = get_edit_user_link( $user_id ) ) {
				$wp_admin_bar->add_menu( array(
					'id'    => 'edit',
					'title' => __( 'Edit User' ),
					'href'  => $edit_user_link,
				) );
			}
			if ( is_admin() ) {
				$current_screen = get_current_screen();
				if ( 'user-edit' === $current_screen->base && isset( $user_id )
					&& ( $user_object = get_userdata( $user_id ) )
					&& $user_object->exists()
					&& $view_link = site_url( '/users/' . $user_id . '/' ) )
				{
					$wp_admin_bar->add_menu( array(
						'id'    => 'view',
						'title' => __( 'View User' ),
						'href'  => $view_link,
					) );
				}
			}
		}
		$wp_admin_bar->remove_menu( 'customize' );
		$wp_admin_bar->remove_menu( 'tribe-events' );

		/*if ( is_a( $current_object, 'WP_User' )
			&& current_user_can( 'edit_user', $current_object->ID )
			&& $edit_user_link = get_edit_user_link( $current_object->ID ) )
		{
		}*/

	}
endif;
