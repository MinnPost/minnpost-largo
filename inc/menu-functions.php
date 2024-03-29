<?php
/**
 * Create custom menus
 *
 * @package MinnPost Largo
 */

/**
 * Create the menus we need
 */
if ( ! function_exists( 'minnpost_menus' ) ) :
	add_action( 'init', 'minnpost_menus' );
	function minnpost_menus() {
		register_nav_menus(
			array(
				'primary_links'           => __( 'Primary Categories', 'minnpost-largo' ), // main nav below logo
				'primary_actions'         => __( 'Primary Actions', 'minnpost-largo' ), // main nav below logo
				'support_actions'         => __( 'Support Actions', 'minnpost-largo' ), // nav below logo on support pages
				'topics'                  => __( 'Topics', 'minnpost-largo' ), // scrolling topics nav
				'user_account_management' => __( 'User Account Management Menu', 'minnpost-largo' ), // menu where users manage their account info/preferences
				'minnpost_network'        => __( 'Network Menu', 'minnpost-largo' ), // social networks
				'minnpost_network_email'  => __( 'Network Menu for Emails', 'minnpost-largo' ), // social network menu on email footers
				'footer_primary'          => __( 'Footer Primary', 'minnpost-largo' ), // main footer. about, advertise, member benefits, etc
				'festival'                => __( 'Festival', 'minnpost-largo' ), // MinnPost Festival menu
				'tonight'                 => __( 'Tonight', 'minnpost-largo' ), // MinnPost Tonight menu
			)
		);
		unregister_nav_menu( 'menu-1' ); // we don't need whatever this is
	}
endif;

/**
* Add custom fields to menu
*
* @param int $item_id
* @param object $item
* @param int $depth
* @param array $args
*/
if ( ! function_exists( 'minnpost_largo_menu_custom_fields' ) ) :
	add_action( 'wp_nav_menu_item_custom_fields', 'minnpost_largo_menu_custom_fields', 10, 4 );
	function minnpost_largo_menu_custom_fields( $item_id, $item, $depth, $args ) {
		wp_nonce_field( 'minnpost_largo_menu_meta_nonce', '_minnpost_largo_menu_meta_nonce_name' );
		$minnpost_largo_menu_item_priority    = get_post_meta( $item_id, '_minnpost_largo_menu_item_priority', true );
		$minnpost_largo_menu_item_mobile_text = get_post_meta( $item_id, '_minnpost_largo_menu_item_mobile_text', true );
		$minnpost_largo_menu_item_icon        = get_post_meta( $item_id, '_minnpost_largo_menu_item_icon', true );
		?>
		<input type="hidden" name="minnpost-largo-menu-meta-nonce" value="<?php echo wp_create_nonce( 'minnpost-largo-menu-meta-name' ); ?>">
		<input type="hidden" class="nav-menu-id" value="<?php echo $item_id; ?>">
		<p class="field-minnpost_largo_menu_item_priority description description-wide">
			<label for="minnpost-largo-menu-meta-item-priority-for-<?php echo $item_id; ?>">
				<?php echo esc_html__( 'Priority', 'minnpost-largo' ); ?>
				<br>
				<input type="number" name="minnpost_largo_menu_item_priority[<?php echo $item_id; ?>]" id="minnpost-largo-menu-meta-item-priority-for-<?php echo $item_id; ?>" value="<?php echo esc_attr( $minnpost_largo_menu_item_priority ); ?>">
			</label>
			<small class="description" style="display: inline-block;"><?php echo esc_html__( 'A low priority (ex 1) will cause the site to try to show this menu item at the smallest screen sizes. A higher priority will potentially hide this item on smaller screens, and show it as the screen gets bigger.', 'minnpost-largo' ); ?></small>
		</p>
		<p class="field-minnpost_largo_menu_item_mobile_text description description-wide">
			<label for="minnpost-largo-menu-meta-item-mobile-text-for-<?php echo $item_id; ?>">
				<?php echo esc_html__( 'Navigation Label On Smallest Screens', 'minnpost-largo' ); ?>
				<br>
				<input type="text" name="minnpost_largo_menu_item_mobile_text[<?php echo $item_id; ?>]" id="minnpost-largo-menu-meta-item-mobile-text-for-<?php echo $item_id; ?>" value="<?php echo esc_attr( $minnpost_largo_menu_item_mobile_text ); ?>">
			</label>
			<small class="description" style="display: inline-block;"><?php echo esc_html__( 'Text in this field will be used as the label at the smallest screen sizes. It is useful for shortening a label rather than removing it.', 'minnpost-largo' ); ?></small>
		</p>
		<p class="field-minnpost_largo_menu_item_icon description description-wide">
			<label for="minnpost-largo-menu-meta-item-icon-for-<?php echo $item_id; ?>">
				<?php echo esc_html__( 'Font Awesome Icon Name', 'minnpost-largo' ); ?>
				<br>
				<input type="text" name="minnpost_largo_menu_item_icon[<?php echo $item_id; ?>]" id="minnpost-largo-menu-meta-item-icon-for-<?php echo $item_id; ?>" value="<?php echo esc_attr( $minnpost_largo_menu_item_icon ); ?>">
			</label>
			<small class="description" style="display: inline-block;"><?php echo esc_html__( 'A value here will cause the menu item to display as an icon.', 'minnpost-largo' ); ?></small>
		</p>
		<?php
	}
endif;

/**
* Save the menu item meta fields
*
* @param int $menu_id
* @param int $menu_item_db_id
*/
if ( ! function_exists( 'minnpost_largo_nav_update' ) ) :
	add_action( 'wp_update_nav_menu_item', 'minnpost_largo_nav_update', 10, 2 );
	function minnpost_largo_nav_update( $menu_id, $menu_item_db_id ) {

		// Verify this came from our screen and with proper authorization.
		if ( ! isset( $_POST['_minnpost_largo_menu_meta_nonce_name'] ) || ! wp_verify_nonce( $_POST['_minnpost_largo_menu_meta_nonce_name'], 'minnpost_largo_menu_meta_nonce' ) ) {
			return $menu_id;
		}

		// menu item priority
		if ( isset( $_POST['minnpost_largo_menu_item_priority'][ $menu_item_db_id ] ) ) {
			$sanitized_data = sanitize_text_field( $_POST['minnpost_largo_menu_item_priority'][ $menu_item_db_id ] );
			update_post_meta( $menu_item_db_id, '_minnpost_largo_menu_item_priority', $sanitized_data );
		} else {
			delete_post_meta( $menu_item_db_id, '_minnpost_largo_menu_item_priority' );
		}

		// menu item mobile text
		if ( isset( $_POST['minnpost_largo_menu_item_mobile_text'][ $menu_item_db_id ] ) ) {
			$sanitized_data = sanitize_text_field( $_POST['minnpost_largo_menu_item_mobile_text'][ $menu_item_db_id ] );
			update_post_meta( $menu_item_db_id, '_minnpost_largo_menu_item_mobile_text', $sanitized_data );
		} else {
			delete_post_meta( $menu_item_db_id, '_minnpost_largo_menu_item_mobile_text' );
		}

		// menu item icon
		if ( isset( $_POST['minnpost_largo_menu_item_icon'][ $menu_item_db_id ] ) ) {
			$sanitized_data = sanitize_text_field( $_POST['minnpost_largo_menu_item_icon'][ $menu_item_db_id ] );
			update_post_meta( $menu_item_db_id, '_minnpost_largo_menu_item_icon', $sanitized_data );
		} else {
			delete_post_meta( $menu_item_db_id, '_minnpost_largo_menu_item_icon' );
		}
	}
endif;

/**
 * Nav Menu Walker
 *
 * @param int $user_id
 */
class Minnpost_Walker_Nav_Menu extends Walker_Nav_Menu {

	private $user_id;

	// we change some menu items based on user id
	public function __construct( $user_id = '' ) {
		$this->user_id = $user_id;
	}

	// start and end submenu output with an unordered list
	public function start_lvl( &$output, $depth = 0, $args = array() ) {
		$output .= '<ul hidden>';
	}
	public function end_lvl( &$output, $depth = 0, $args = array() ) {
		$output .= '</ul>';
	}

	/**
	 * Start element and change its classes
	 * We use this to:
	 * - set the classes we want, mainly for current items
	 * - change the urls for user specific items
	 *
	 * @param string $output - don't ever remove the & because php will complain about the parent class
	 * @param object $item
	 * @param int    $depth
	 * @param array  $args
	 * @param int    $id
	 *
	 * @return string $output
	 */
	public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {

		$classes = array();
		if ( ! empty( $item->classes ) ) {
			$classes = (array) $item->classes;
		}

		$active_class = '';
		if ( in_array( 'current-menu-item', $classes, true ) ) {
			$active_class = 'active';
		} elseif ( in_array( 'current-menu-parent', $classes, true ) && '/' !== $item->url ) {
			// checking '/' because home menu should never be a parent menu
			$active_class = 'active-parent';
		} elseif ( in_array( 'current-menu-ancestor', $classes, true ) ) {
			$active_class = 'active-ancestor';
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
			$category_group_id = minnpost_get_category_group_id( get_the_id(), $cat_id );
			if ( '' !== $category_group_id && $category_group_id === $item->object_id ) {
				$active_class = 'active-parent';
			}
		}

		$url = '';
		if ( ! empty( $item->url ) ) {

			if ( '' !== $this->user_id && get_current_user_id() !== $this->user_id ) {
				$user_id = $this->user_id;
			} else {
				$user_id = get_current_user_id();
			}
			$user_id             = (int) $user_id;
			$account_parent_item = get_page_by_title( 'Welcome', 'OBJECT', 'nav_menu_item' );
			$account_parent_id   = isset( $account_parent_item->ID ) ? $account_parent_item->ID : 0;

			$url    = rtrim( $item->url, '/' );
			$length = strlen( $url );
			if ( '' === $url ) {
				$url = home_url();
			}
			if ( home_url() !== $url && substr( '/wp_logout_url()', 0, $length ) === $url ) {
				$url = wp_logout_url();
			}

			if ( '/?s=' === $url ) {
				$form     = get_search_form( false );
				$has_form = true;
			}

			if ( rtrim( wp_login_url(), '/' ) === $url ) {
				$current_url = $_SERVER['REQUEST_URI'];
				if ( home_url() !== rtrim( site_url( $current_url ), '/' ) ) {
					$url = wp_login_url( $current_url );
				}
			}

			if ( rtrim( site_url( '/user/' ), '/' ) === $url && 'Welcome' === $item->title ) {
				$user = wp_get_current_user();
				if ( isset( $user->first_name ) && '' !== trim( $user->first_name ) ) {
					$item->title = '<span class="name">Welcome, ' . $user->first_name . '</span><span class="a-user-initial">' . $user->first_name[0] . '</span><span class="a-arrow-down"></span>';
				} elseif ( isset( $user->display_name ) && '' !== trim( $user->display_name ) ) {
					$item->title = '<span class="name">Welcome, ' . $user->display_name . '</span><span class="a-user-initial">' . $user->display_name[0] . '</span><span class="a-arrow-down"></span>';
				} else {
					$item->title = '<span class="name">Welcome, ' . $user->user_email . '</span><span class="a-user-initial">' . $user->user_email[0] . '</span><span class="a-arrow-down"></span>';
				}
			}
			if ( site_url( '/users/userid' ) === $url || '/users/userid' === $url ) {
				$url = site_url( '/users/' . $user_id . '/' );
				if ( rtrim( get_current_url(), '/' ) . '/' === $url ) {
					$active_class = 'active';
				}
			}
			if ( ( $account_parent_id !== (int) $item->menu_item_parent && $account_parent_id !== (int) $item->ID ) && strpos( $url, '/user/' ) && '' !== $user_id && get_current_user_id() !== $user_id ) {
				$url = $url . '?user_id=' . $user_id;
			}

			if ( strpos( $url, '/user' ) && '' !== $user_id && get_current_user_id() !== $user_id ) {
				$active_class = '';
			}
			if ( 'Your MinnPost' === $item->title && '' !== $user_id && get_current_user_id() !== $user_id ) {
				$user        = get_userdata( $user_id );
				$item->title = $user->first_name . "'s MinnPost";
			}
		}

		if ( isset( $args->item_classes ) && 'values' === $args->item_classes ) {
			if ( '' !== $active_class ) {
				$active_class .= ' ' . sanitize_title( $item->title );
			} else {
				$active_class = sanitize_title( $item->title );
			}
		}

		if ( ! isset( $args->item_classes ) || 'values' !== $args->item_classes ) {
			$custom_classes = $this->get_custom_classes( $item->classes );
			if ( '' !== $active_class ) {
				$active_class .= ' ' . $custom_classes;
			} else {
				$active_class = $custom_classes;
			}
		}

		$active_class = apply_filters( 'minnpost_largo_nav_item_classes', $active_class, $item );

		if ( '' !== $active_class ) {
			$active_class = ' class="' . $active_class . '"';
		}

		$minnpost_largo_menu_item_priority = get_post_meta( $item->ID, '_minnpost_largo_menu_item_priority', true );
		$data                              = '';
		if ( '' !== $minnpost_largo_menu_item_priority ) {
			$data = ' data-menu-item-priority="' . $minnpost_largo_menu_item_priority . '"';
		}

		$minnpost_largo_menu_item_mobile_text = get_post_meta( $item->ID, '_minnpost_largo_menu_item_mobile_text', true );
		if ( '' !== $minnpost_largo_menu_item_mobile_text ) {
			$item->title = '<span class="a-label-xxs">' . $minnpost_largo_menu_item_mobile_text . '</span><span class="a-label-xs">' . $item->title . '</span>';
		}

		$minnpost_largo_menu_item_icon = get_post_meta( $item->ID, '_minnpost_largo_menu_item_icon', true );
		if ( '' !== $minnpost_largo_menu_item_icon ) {
			$item->title = '<i title="' . $item->title . '" class="' . $minnpost_largo_menu_item_icon . '"></i>';
		}

		$output .= '<li' . $active_class . $data . '><a href="' . $url . '">' . $item->title . '</a>';

		if ( isset( $has_form ) && true === $has_form ) {
			$output .= $form;
		}

		if ( 'Your MinnPost' === $item->title ) {
			// $output .= '<button class="menu-toggle" aria-controls="user-account-management" aria-expanded="false">' . esc_html( 'Sections', 'minnpost-largo' ) . '</button>';
		}
	}

	// end item with a </li>
	public function end_el( &$output, $item, $depth = 0, $args = array() ) {
		$output .= '</li>';
	}

	/**
	 * Return the custom classes added in the admin by filtering out the default WordPress classes
	 *
	 * @param array $all_classes
	 * @return string $custom_classes
	 */
	private function get_custom_classes( $all_classes ) {
		if ( is_array( $all_classes ) ) {
			$custom_classes = array_filter(
				$all_classes,
				function( $value ) {
					return ( str_replace( array( 'menu-', 'page_', 'page-' ), '', $value ) !== $value ) ? false : true;
				}
			);
			return implode( ' ', $custom_classes );
		} else {
			return '';
		}
	}
}

/**
 * Nav Menu Walker for email
 *
 * @param int $user_id
 */
class Minnpost_Email_Walker_Nav_Menu extends Minnpost_Walker_Nav_Menu {

	// start and end submenu output with an unordered list
	public function start_lvl( &$output, $depth = 0, $args = array() ) {
		$output .= '<tr>';
	}
	public function end_lvl( &$output, $depth = 0, $args = array() ) {
		$output .= '</tr>';
	}

	/**
	 * Start element and change its classes
	 * We use this to:
	 * - set the classes we want, mainly for current items
	 * - change the urls for user specific items
	 *
	 * @param string $output - don't ever remove the & because php will complain about the parent class
	 * @param object $item
	 * @param int    $depth
	 * @param array  $args
	 * @param int    $id
	 *
	 * @return string $output
	 */
	public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {

		$classes = array();
		if ( ! empty( $item->classes ) ) {
			$classes = (array) $item->classes;
		}

		$active_class = '';
		if ( in_array( 'current-menu-item', $classes, true ) ) {
			$active_class = 'active';
		} elseif ( in_array( 'current-menu-parent', $classes, true ) && '/' !== $item->url ) {
			// checking '/' because home menu should never be a parent menu
			$active_class = 'active-parent';
		} elseif ( in_array( 'current-menu-ancestor', $classes, true ) ) {
			$active_class = 'active-ancestor';
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
			$category_group_id = minnpost_get_category_group_id( get_the_id(), $cat_id );
			if ( '' !== $category_group_id && $category_group_id === $item->object_id ) {
				$active_class = 'active-parent';
			}
		}

		$url = '';
		if ( ! empty( $item->url ) ) {

			$url    = rtrim( $item->url, '/' );
			$length = strlen( $url );
			if ( '' === $url ) {
				$url = home_url();
			}
			if ( home_url() !== $url && substr( '/wp_logout_url()', 0, $length ) === $url ) {
				$url = wp_logout_url();
			}
		}

		if ( isset( $args->item_classes ) && 'values' === $args->item_classes ) {
			if ( '' !== $active_class ) {
				$active_class .= ' ' . sanitize_title( $item->title );
			} else {
				$active_class = sanitize_title( $item->title );
			}
		}

		if ( ! isset( $args->item_classes ) || 'values' !== $args->item_classes ) {
			$custom_classes = $this->get_custom_classes( $item->classes );
			if ( '' !== $active_class ) {
				$active_class .= ' ' . $custom_classes;
			} else {
				$active_class = $custom_classes;
			}
		}

		if ( '' !== $active_class ) {
			$active_class = ' class="' . $active_class . '"';
		}

		// if there is a value for the icon, check and see if we have it as a downloaded image and use it, if so.
		$minnpost_largo_menu_item_icon = get_post_meta( $item->ID, '_minnpost_largo_menu_item_icon', true );
		if ( '' !== $minnpost_largo_menu_item_icon ) {
			$exploded  = explode( ' ', $minnpost_largo_menu_item_icon );
			$icon_type = $exploded[0];
			$icon_name = $exploded[1];
			if ( false !== $icon_type ) {
				$font_awesome_suffix = 'fa' . $icon_type[2];
			}
			switch ( $font_awesome_suffix ) {
				case 'fab':
					$end = '-brands';
					break;
				case 'fas':
					$end = '-solid';
					break;
				default:
					$end = '';
			}
			$icon_post_name = str_replace( 'fa-', '', $icon_name . $end );
			$attachment_id  = wp_get_attachment_id_by_post_name( $icon_post_name );
			if ( false !== $attachment_id ) {
				$image     = wp_get_attachment_image( $attachment_id );
				$image_url = wp_get_attachment_url( $attachment_id );
				if ( function_exists( 'get_minnpost_modified_image_url' ) ) {
					$image_url = get_minnpost_modified_image_url( $image_url, array() );
				}
				$image        = minnpost_largo_manual_image_tag( $attachment_id, $image_url, array(), 'newsletter' );
				$item->title  = $image;
				$active_class = ' class="with-icon"';
			}
		}
		$output .= '<td' . $active_class . '><a href="' . $url . '">' . $item->title . '</a>';
		$output  = apply_filters( 'format_email_content', $output, true, false );
	}

	// end item with a </td>
	public function end_el( &$output, $item, $depth = 0, $args = array() ) {
		$output .= '</td>';
	}

	/**
	 * Return the custom classes added in the admin by filtering out the default WordPress classes
	 *
	 * @param array $all_classes
	 * @return string $custom_classes
	 */
	private function get_custom_classes( $all_classes ) {
		if ( is_array( $all_classes ) ) {
			$custom_classes = array_filter(
				$all_classes,
				function( $value ) {
					return ( str_replace( array( 'menu-', 'page_', 'page-' ), '', $value ) !== $value ) ? false : true;
				}
			);
			return implode( ' ', $custom_classes );
		} else {
			return '';
		}
	}
}

/**
* Show the admin bar only for users with see_admin_bar capability
* This relies on the MinnPost Roles and Capabilities plugin which creates this capability and assigns it to roles
*/
if ( ! current_user_can( 'see_admin_bar' ) ) {
	add_filter( 'show_admin_bar', '__return_false' );
}

/**
* Show the debug bar menu - included with WP VIP Go - to administrator level users
*/
if ( ! function_exists( 'minnpost_largo_debug_bar_render' ) ) :
	add_filter( 'debug_bar_enable', 'minnpost_largo_debug_bar_render', 100, 1 );
	function minnpost_largo_debug_bar_render( $enable ) {
		// remove autoptimize from non admins
		if ( current_user_can( 'administrator' ) ) {
			$enable = true;
		}
		return $enable;
	}
endif;

/**
* Change links and menus in the admin bar
* This relies on user access levels, and a little bit on the MinnPost Roles and Capabilities plugin (for the comment moderator part)
*/
if ( ! function_exists( 'minnpost_largo_admin_bar_render' ) ) :
	add_action( 'wp_before_admin_bar_render', 'minnpost_largo_admin_bar_render' );
	function minnpost_largo_admin_bar_render() {
		global $wp_admin_bar;

		// remove comment count from users who cannot moderate
		if ( ! current_user_can( 'moderate_comments' ) ) {
			$wp_admin_bar->remove_menu( 'comments' );
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
			$page           = get_page_by_path( 'user' );
			$user_parent_id = is_object( $page ) ? $page->ID : '';

			if ( array_key_exists( 'users', $wp_query->query_vars ) ) {
				$wp_admin_bar->remove_menu( 'edit' );
				if ( current_user_can( 'edit_user', $user_id ) && $edit_user_link = get_edit_user_link( $user_id ) ) {
					$wp_admin_bar->add_menu(
						array(
							'id'    => 'edit',
							'title' => __( 'Edit User' ),
							'href'  => $edit_user_link,
						)
					);
				}
			}

			if ( isset( $post ) && ( $post->post_parent === $user_parent_id || $post->ID === $user_parent_id )
				&& current_user_can( 'edit_user', $user_id )
				&& $edit_user_link = get_edit_user_link( $user_id ) ) {
				$wp_admin_bar->add_menu(
					array(
						'id'    => 'edit',
						'title' => __( 'Edit User' ),
						'href'  => $edit_user_link,
					)
				);
			}
			if ( is_admin() ) {
				$current_screen = get_current_screen();
				if ( 'user-edit' === $current_screen->base && isset( $user_id )
					&& ( $user_object = get_userdata( $user_id ) )
					&& $user_object->exists()
					&& $view_link = site_url( '/users/' . $user_id . '/' ) ) {
					$wp_admin_bar->add_menu(
						array(
							'id'    => 'view',
							'title' => __( 'View User' ),
							'href'  => $view_link,
						)
					);
				}
			}
		}

		$user = wp_get_current_user();

		// comment moderators
		if ( in_array( 'comment_moderator', (array) $user->roles, true ) ) {
			$wp_admin_bar->remove_menu( 'new-content' );
			$wp_admin_bar->remove_menu( 'edit' );
		}

		// users who cannot create sponsors
		if ( ! current_user_can( 'create_sponsors' ) ) {
			$wp_admin_bar->remove_node( 'new-cr3ativsponsor' );
		}

		$wp_admin_bar->remove_menu( 'customize' );
		$wp_admin_bar->remove_menu( 'tribe-events' );

		/*
		if ( is_a( $current_object, 'WP_User' )
			&& current_user_can( 'edit_user', $current_object->ID )
			&& $edit_user_link = get_edit_user_link( $current_object->ID ) )
		{
		}*/

	}
endif;

if ( ! function_exists( 'minnpost_largo_menu_support' ) ) :
	add_action( 'minnpost_membership_site_header_support', 'minnpost_largo_menu_support' );
	function minnpost_largo_menu_support() {
		?>
		<div class="o-wrapper o-wrapper-site-navigation o-wrapper-site-navigation-support">
			<nav id="navigation-support" class="m-main-navigation m-main-navigation-support">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'support_actions',
						'menu_id'        => 'primary-actions',
						'container'      => false,
						'walker'         => new Minnpost_Walker_Nav_Menu(),
						'item_classes'   => 'values',
						'items_wrap'     => '<ul id="%1$s" class="m-menu m-menu-%1$s">%3$s</ul>',
					)
				);
				?>
			</nav><!-- #navigation-support -->
		</div>
		<?php
	}
endif;

/**
* Change menu classes for festival/tonight/event menus. This applies to archive and singular speakers and sessions.
 *
* @param string $classes
* @param object $item
* @return string $classes
*/
if ( ! function_exists( 'minnpost_largo_event_menu_classes' ) ) :
	add_filter( 'minnpost_largo_nav_item_classes', 'minnpost_largo_event_menu_classes', 10, 2 );
	function minnpost_largo_event_menu_classes( $classes, $item ) {
		if ( is_singular( 'tribe_ext_speaker' ) || is_singular( 'sessions' ) || is_singular( 'tribe_events' ) ) {
			if ( is_object( $item ) ) {
				$title = $item->title;
			} else {
				$title = $item['title'];
			}
			if ( 'Speakers' === $title ) {
				$classes .= ' active';
			}
			if ( is_singular( 'tribe_events' ) || is_singular( 'sessions' ) ) {
				if ( 'Sessions' === $title || 'Events' === $title ) {
					$classes .= ' active';
				}
			}
		}
		return $classes;
	}
endif;

/**
* Outputs the user account management menu
*/
if ( ! function_exists( 'minnpost_account_management_menu' ) ) :
	function minnpost_account_management_menu() {
		$user_id = get_query_var( 'users', '' );
		if ( isset( $_GET['user_id'] ) ) {
			$user_id = esc_attr( $_GET['user_id'] );
		}
		$menu = get_minnpost_account_management_menu( $user_id );
		?>
		<?php if ( ! empty( $menu ) ) : ?>
			<div class="o-wrapper o-wrapper-sub-navigation o-wrapper-user-account-management-navigation">
				<a class="a-subnav-label a-user-account-management-label" href="/user/"><?php echo __( 'Your&nbsp;MinnPost&nbsp;Account', 'minnpost-largo' ); ?></a>
				<div class="m-sub-navigation m-user-account-management">
					<nav id="navigation-user-account-management" class="m-subnav-navigation m-user-account-management-navigation">
						<?php echo $menu; ?>
					</nav><!-- #navigation-user-account-management -->
					<button class="nav-scroller-btn nav-scroller-btn--left" aria-label="Scroll left">
						<i class="fas fa-chevron-left"></i>
					</button>
					<button class="nav-scroller-btn nav-scroller-btn--right" aria-label="Scroll right"><i class="fas fa-chevron-right"></i>
					</button>
				</div>
			</div>
		<?php endif; ?>
		<?php
	}
endif;

/**
* Returns the user account management menu for each user
* This depends on the User Account Management plugin
*
* @param int $user_id
* @return object $menu
*/
if ( ! function_exists( 'get_minnpost_account_management_menu' ) ) :
	function get_minnpost_account_management_menu( $user_id = '' ) {
		$menu       = '';
		$can_access = false;

		if ( function_exists( 'user_account_management' ) ) {
			$account_management = user_account_management();
			$can_access         = $account_management->user_data->check_user_permissions( $user_id );
		} else {
			if ( get_current_user_id() === $user_id || current_user_can( 'edit_user', $user_id ) ) {
				$can_access = true;
			}
		}
		// if we are on the current user, or if this user can edit users
		if ( true === $can_access ) {
			$menu = wp_nav_menu(
				array(
					'theme_location' => 'user_account_management',
					'menu_id'        => 'user-account-management',
					'depth'          => 1,
					'container'      => false,
					'walker'         => new Minnpost_Walker_Nav_Menu( $user_id ),
					'items_wrap'     => '<ul id="%1$s" class="m-menu m-menu-sub-navigation m-menu-%1$s">%3$s</ul>',
					'echo'           => false,
				)
			);
		}
		return $menu;
	}
endif;

/**
* Outputs the user account access menu
*/
if ( ! function_exists( 'minnpost_account_access_menu' ) ) :
	function minnpost_account_access_menu() {
		$user_id = get_current_user_id();
		$menu    = get_minnpost_account_access_menu();
		?>
		<?php if ( ! empty( $menu ) ) : ?>
			<nav id="navigation-user-account-access" class="m-secondary-navigation" role="navigation">
				<?php echo $menu; ?>
			</nav><!-- #navigation-user-account-access -->
		<?php endif; ?>
		<?php
	}
endif;

/**
* Returns the user account access menu for each user
* This depends on the User Account Management plugin
*
* @param int $user_id
* @return object $menu
*/
if ( ! function_exists( 'get_minnpost_account_access_menu' ) ) :

	function get_minnpost_account_access_menu( $user_id = '' ) {

		if ( '' === $user_id ) {
			$user_id = get_current_user_id();
		}

		$menu       = '';
		$can_access = false;
		if ( function_exists( 'user_account_management' ) ) {
			$account_management = user_account_management();
			$can_access         = $account_management->user_data->check_user_permissions( $user_id );
		} else {
			if ( get_current_user_id() === $user_id || current_user_can( 'edit_user', $user_id ) ) {
				$can_access = true;
			}
		}
		// if we are on the current user, or if this user can edit users
		if ( true === $can_access ) {
			$menu = wp_nav_menu(
				array(
					'theme_location' => 'user_account_access',
					'menu_id'        => 'user-account-access',
					'depth'          => 2,
					'container'      => false,
					'walker'         => new Minnpost_Walker_Nav_Menu( $user_id ),
					'echo'           => false,
				)
			);
		}
		return $menu;
	}
endif;

/**
* Remove pages from admin menu
* This relies on user access levels, and on the MinnPost Roles and Capabilities plugin
*/
if ( ! function_exists( 'minnpost_largo_remove_menu_pages' ) ) :
	add_action( 'admin_menu', 'minnpost_largo_remove_menu_pages', 999 );
	function minnpost_largo_remove_menu_pages() {
		// users who cannot manage jetpack
		if ( class_exists( 'Jetpack' ) && ! current_user_can( 'manage_jetpack' ) ) {
			remove_menu_page( 'jetpack' );
			remove_submenu_page( 'options-general.php', 'sharing' );
		}

		// users who cannot edit themes
		if ( ! current_user_can( 'edit_themes' ) ) {
			remove_submenu_page( 'themes.php', 'themes.php' );
			$customize_url = add_query_arg( 'return', urlencode( wp_unslash( $_SERVER['REQUEST_URI'] ) ), 'customize.php' );
			remove_submenu_page( 'themes.php', $customize_url );
		}

		// users who cannot do anything with sponsors
		if ( ! current_user_can( 'edit_sponsors' ) && ! current_user_can( 'create_sponsors' ) && ! current_user_can( 'edit_sponsor_levels' ) ) {
			remove_menu_page( 'edit.php?post_type=cr3ativsponsor' );
		} else {
			// users who cannot edit sponsors
			if ( ! current_user_can( 'edit_sponsors' ) ) {
				remove_submenu_page( 'edit.php?post_type=cr3ativsponsor', 'edit.php?post_type=cr3ativsponsor' );
			}
			// users who cannot edit sponsor levels
			if ( ! current_user_can( 'edit_sponsor_levels' ) ) {
				remove_submenu_page( 'edit.php?post_type=cr3ativsponsor', 'edit-tags.php?taxonomy=cr3ativsponsor_level&amp;post_type=cr3ativsponsor' );
				remove_submenu_page( 'post-new.php?post_type=cr3ativsponsor', 'edit-tags.php?taxonomy=cr3ativsponsor_level&amp;post_type=cr3ativsponsor' );
			}
			// users who cannot create sponsors
			if ( ! current_user_can( 'create_sponsors' ) ) {
				remove_submenu_page( 'edit.php?post_type=cr3ativsponsor', 'post-new.php?post_type=cr3ativsponsor' );
			}
		}

		// users who cannot moderate comments
		if ( ! current_user_can( 'moderate_comments' ) ) {
			remove_menu_page( 'edit-comments.php' );
			remove_submenu_page( 'options-general.php', 'sce' );
		}

		// advertising
		if ( ! current_user_can( 'manage_advertising' ) ) {
			// tools
			remove_submenu_page( 'options-general.php', 'ad-code-manager' );
			// settings
			remove_submenu_page( 'options-general.php', 'arcads-dfp-acm-provider' );
		}

		// thumbnails
		if ( ! current_user_can( 'upload_files' ) ) {
			// settings
			remove_submenu_page( 'options-general.php', 'options-media.php' );
		}

		// users who cannot do anything with scheduled actions
		if ( ! current_user_can( 'edit_scheduled_actions' ) && ! current_user_can( 'create_scheduled_actions' ) ) {
			remove_submenu_page( 'tools.php', 'action-scheduler' );
		}

		// whole tools menu
		if ( ! current_user_can( 'see_tools_menu' ) ) {
			remove_menu_page( 'tools.php' );
		}

		// whole profile menu
		if ( ! current_user_can( 'see_profile_menu' ) ) {
			remove_menu_page( 'profile.php' );
		}

		// comment moderators
		// this uses current_user_can with a role which is not recommended - the codex says this can produce unreliable results but it seems to work in this case
		if ( current_user_can( 'comment_moderator' ) ) {
			// posts
			remove_menu_page( 'edit.php' );
		}

		// users who cannot manage redirects
		if ( ! current_user_can( 'manage_redirects' ) ) {
			remove_menu_page( 'edit.php?post_type=vip-legacy-redirect' );
		}

		// admins only
		if ( ! current_user_can( 'administrator' ) ) {
			// vip host stuff
			remove_menu_page( 'vip-dashboard' );
			// tools
			remove_submenu_page( 'tools.php', 'tools.php' );
			// settings
			remove_submenu_page( 'options-general.php', 'options-writing.php' );
			remove_submenu_page( 'options-general.php', 'options-permalink.php' );
			remove_submenu_page( 'options-general.php', 'documentcloud' );
			remove_submenu_page( 'options-general.php', 'duplicatepost' );
			remove_submenu_page( 'options-general.php', 'font-awesome' );
			remove_submenu_page( 'options-general.php', 'form-processor-mailchimp' );
			remove_submenu_page( 'options-general.php', 'jquery-updater' );
			remove_submenu_page( 'options-general.php', 'user-account-management' );
			remove_submenu_page( 'options-general.php', 'widgetopts_plugin_settings' );
			remove_submenu_page( 'options-general.php', 'wp-analytics-tracking-generator-admin' );
			remove_submenu_page( 'options-general.php', 'image-credits' ); // these settings are ignored anyway because of how the theme works
			// chartbeat
			remove_menu_page( 'chartbeat_console' );
			// stop spammers
			remove_menu_page( 'stop_spammers' );
			// font awesome
			remove_menu_page( 'font-awesome' );
			// structured data
			remove_menu_page( 'edit.php?post_type=saswp' );
		}

	}
endif;

/**
* Set Zoninator access capabilities
*/
if ( ! function_exists( 'minnpost_largo_add_zones' ) ) :
	add_filter( 'zoninator_add_zone_cap', 'minnpost_largo_add_zones', 10, 1 );
	function minnpost_largo_add_zones( $role ) {
		return 'create_zones';
	}
endif;

if ( ! function_exists( 'minnpost_largo_edit_zones' ) ) :
	add_filter( 'zoninator_edit_zone_cap', 'minnpost_largo_edit_zones', 10, 1 );
	function minnpost_largo_edit_zones( $role ) {
		return 'edit_zones';
	}
endif;

if ( ! function_exists( 'minnpost_largo_manage_zones' ) ) :
	add_filter( 'zoninator_manage_zone_cap', 'minnpost_largo_manage_zones', 10, 1 );
	function minnpost_largo_manage_zones( $role ) {
		return 'manage_zones';
	}
endif;

/**
* Add unpublished indicator to admin bar menu
*/
if ( ! function_exists( 'minnpost_largo_unpublished_indicator' ) ) :
	add_action( 'admin_bar_menu', 'minnpost_largo_unpublished_indicator', 81 );
	function minnpost_largo_unpublished_indicator( $wp_admin_bar ) {

		if ( ! current_user_can( 'edit_posts' ) || ! is_singular() ) {
			return;
		}

		$user = wp_get_current_user();
		// not for comment moderators
		if ( in_array( 'comment_moderator', (array) $user->roles, true ) ) {
			return;
		}

		$post_id = get_the_ID();

		if ( false === $post_id ) {
			return;
		}

		$post_status = get_post_status( $post_id );

		if ( 'publish' === $post_status ) {
			return;
		}

		$args = array(
			'id'    => 'item_unpublishd',
			'title' => __( 'Unpublished', 'minnpost-largo' ),
			'meta'  => array(
				'class' => 'unpublished-indicator',
			),
		);
		$wp_admin_bar->add_node( $args );
	}
endif;

/**
* Any admin bar CSS customizations should go here so they're consistent on front and back end
*/
if ( ! function_exists( 'minnpost_style_tool_bar' ) ) :
	add_action( 'admin_head', 'minnpost_style_tool_bar' );
	add_action( 'wp_head', 'minnpost_style_tool_bar' );
	function minnpost_style_tool_bar() {
		echo '
		<style>
		#wp-admin-bar-item_unpublishd div, #wpadminbar:not(.mobile) #wp-admin-bar-item_unpublishd:hover div {
			text-transform: uppercase;
			background: #b60;
			color: #fff;
		}
	    </style>';
	}
endif;
