<?php
/**
 * Create custom content types
 * We do not use a plugin for creating these, but some of the types do, and some other types are created by plugins.
 *
 * @package MinnPost Largo
 */

/**
* Register custom post type 'newsletter'
*
*/
if ( ! function_exists( 'create_newsletter' ) ) :
	add_action( 'init', 'create_newsletter' );
	function create_newsletter() {
		register_post_type(
			'newsletter',
			array(
				'label'               => __( 'Newsletter', 'minnpost-largo' ),
				'labels'              => array(
					'name'               => __( 'Newsletters', 'minnpost-largo' ),
					'singular_name'      => __( 'Newsletter', 'minnpost-largo' ),
					'menu_name'          => __( 'Newsletters', 'minnpost-largo' ),
					'name_admin_bar'     => __( 'Newsletter', 'minnpost-largo' ),
					'add_new'            => __( 'Add New', 'minnpost-largo' ),
					'add_new_item'       => __( 'Add New Newsletter', 'minnpost-largo' ),
					'new_item'           => __( 'New Newsletter', 'minnpost-largo' ),
					'edit_item'          => __( 'Edit Newsletter', 'minnpost-largo' ),
					'view_item'          => __( 'View Newsletter', 'minnpost-largo' ),
					'all_items'          => __( 'All Newsletters', 'minnpost-largo' ),
					'search_items'       => __( 'Search Newsletters', 'minnpost-largo' ),
					'parent_item_colon'  => __( 'Parent Newsletters:', 'minnpost-largo' ),
					'not_found'          => __( 'No newsletters found.', 'minnpost-largo' ),
					'not_found_in_trash' => __( 'No newsletters found in Trash.', 'minnpost-largo' ),
				),
				'show_ui'             => true,
				'show_in_rest'        => true,
				'public'              => true,
				'exclude_from_search' => true,
				'hierarchical'        => true,
				'supports'            => array(
					'title',
					'editor',
				),
				'capabilities'        => array(
					'edit_post'          => 'edit_newsletter',
					'read_post'          => 'read_newsletter',
					'delete_post'        => 'delete_newsletter',
					'delete_posts'       => 'delete_newsletters',
					'edit_posts'         => 'edit_newsletters',
					'edit_others_posts'  => 'edit_others_newsletters',
					'publish_posts'      => 'publish_newsletters',
					'read_private_posts' => 'read_private_newsletters',
					'create_posts'       => 'create_newsletters',
				),
				'menu_icon'           => 'dashicons-email-alt',
			)
		);
	}
endif;

/**
* Set the admin sort order for Newsletters
*
* @param object $query
* @return object $query
*
*/
if ( ! function_exists( 'minnpost_newsletter_default_order' ) ) :
	add_filter( 'pre_get_posts', 'minnpost_newsletter_default_order' );
	function minnpost_newsletter_default_order( $query ) {
		if ( $query->is_admin ) {
			if ( 'newsletter' === $query->get( 'post_type' ) ) {
				$query->set( 'orderby', 'date' );
				$query->set( 'order', 'DESC' );
			}
		}
		return $query;
	}
endif;

/**
* Add and reorder columns on the post table for newsletters
*
* @param array $columns
* @return array $columns
*/
if ( ! function_exists( 'minnpost_filter_newsletter_columns' ) ) :
	add_filter( 'manage_newsletter_posts_columns', 'minnpost_filter_newsletter_columns' );
	function minnpost_filter_newsletter_columns( $columns ) {
		$columns['type'] = __( 'Newsletter Type', 'minnpost-largo' );
		$column_order    = array( 'cb', 'title', 'type', 'coauthors', 'date' );
		foreach ( $column_order as $column_name ) {
			$new_columns[ $column_name ] = $columns[ $column_name ];
		}
		return $new_columns;
	}
endif;

/**
* Populate columns on the post table for newsletters
*
* @param string $column
* @param int $post_id
*/
if ( ! function_exists( 'minnpost_newsletter_column' ) ) :
	add_action( 'manage_newsletter_posts_custom_column', 'minnpost_newsletter_column', 10, 2 );
	function minnpost_newsletter_column( $column, $post_id ) {
		// newsletter type
		if ( 'type' === $column ) {
			$type = ( '' !== get_post_meta( $post_id, '_mp_newsletter_type', true ) ) ? get_post_meta( $post_id, '_mp_newsletter_type', true ) : '';
			if ( '' !== $type && function_exists( 'minnpost_largo_email_types' ) ) {
				$type = minnpost_largo_email_types( $type );
			}
			echo $type;
		}
	}
endif;

/**
* Add and reorder columns on the post table for newsletters
*
* @param array $columns
* @return array $columns
*/
if ( ! function_exists( 'minnpost_newsletter_sortable_columns' ) ) :
	add_filter( 'manage_edit-newsletter_sortable_columns', 'minnpost_newsletter_sortable_columns' );
	function minnpost_newsletter_sortable_columns( $columns ) {
		$columns['type'] = 'type';
		return $columns;
	}
endif;

/**
* Order column data on the post table for newsletters
*
* @param object $query
*/
if ( ! function_exists( 'minnpost_newsletter_posts_orderby' ) ) :
	add_action( 'pre_get_posts', 'minnpost_newsletter_posts_orderby' );
	function minnpost_newsletter_posts_orderby( $query ) {
		if ( ! is_admin() || ! $query->is_main_query() ) {
			return;
		}

		// sort by type
		if ( 'type' === $query->get( 'orderby' ) ) {
			$query->set(
				'meta_query',
				array(
					'relation' => 'OR',
					array(
						'key'     => '_mp_newsletter_type',
						'compare' => 'EXISTS',
					),
					array(
						'key'     => '_mp_newsletter_type',
						'compare' => 'NOT EXISTS',
						'value'   => 'bug #23268', // arbitrary value
					),
				)
			);
			$query->set( 'orderby', 'meta_value' );
		}
	}
endif;

/**
* Dropdown for filtering newsletters by type and region.
*
*/
if ( ! function_exists( 'minnpost_filter_restrict_manage_newsletter_posts' ) ) :
	add_action( 'restrict_manage_posts', 'minnpost_filter_restrict_manage_newsletter_posts' );
	function minnpost_filter_restrict_manage_newsletter_posts() {
		$type = 'post';
		if ( isset( $_GET['post_type'] ) ) {
			$type = esc_attr( $_GET['post_type'] );
		}
		//add filter to the post type you want
		if ( 'newsletter' === $type ) { //Replace NAME_OF_YOUR_POST with the name of custom post
			$type_values = minnpost_largo_email_types();
			?>
			<select name="admin_filter_by_type">
				<option value=""><?php echo esc_html__( 'All newsletter types', 'minnpost-largo' ); ?></option>
				<?php
				$current_type = isset( $_GET['admin_filter_by_type'] ) ? esc_attr( $_GET['admin_filter_by_type'] ) : '';
				foreach ( $type_values as $key => $value ) {
					printf(
						'<option value="%1$s"%2$s>%3$s</option>',
						esc_attr( $key ),
						$key === $current_type ? ' selected="selected"' : '',
						esc_html( $value )
					);
				}
				?>
			</select>
			<?php
		}
	}
endif;

/**
* Filter the admin query for newsletters by what type or region they are, if one is present.
* @param object $query
* @return object $query
*
*/
if ( ! function_exists( 'minnpost_newsletter_posts_filter' ) ) :
	add_filter( 'parse_query', 'minnpost_newsletter_posts_filter' );
	function minnpost_newsletter_posts_filter( $query ) {
		global $pagenow;
		$type = 'post';
		if ( isset( $_GET['post_type'] ) ) {
			$type = esc_attr( $_GET['post_type'] );
		}
		if ( 'newsletter' === $type && is_admin() && 'edit.php' === $pagenow ) {
			// filter by type
			if ( isset( $_GET['admin_filter_by_type'] ) && '' !== $_GET['admin_filter_by_type'] ) {
				$query->query_vars['meta_key']   = '_mp_newsletter_type';
				$query->query_vars['meta_value'] = esc_attr( $_GET['admin_filter_by_type'] );
			}
		}
	}
endif;

/**
* Add Co-Authors-Plus support to Newsletters
*
* @param array $post_types
* @return array $post_types
*
*/
add_filter(
	'coauthors_supported_post_types',
	function( $post_types ) {
		$post_types[] = 'newsletter';
		return $post_types;
	}
);

/**
 * Fix Parent Admin Menu Item for Co-Authors
 */
if ( ! function_exists( 'coauthors_cpt_parent_file' ) ) :
	add_filter( 'parent_file', 'coauthors_cpt_parent_file' );
	function coauthors_cpt_parent_file( $parent_file ) {
		global $current_screen;
		if ( in_array( $current_screen->base, array( 'post', 'edit' ), true ) && 'guest-author' === $current_screen->post_type ) {
			$parent_file = 'users.php';
		}
		return $parent_file;
	}
endif;

/**
* Co-authors in RSS and other feeds
* /wp-includes/feed-rss2.php uses the_author(), so we selectively filter the_author value
*/
if ( ! function_exists( 'minnpost_coauthors_in_rss' ) ) :
	add_filter( 'the_author', 'minnpost_coauthors_in_rss' );
	function minnpost_coauthors_in_rss( $the_author ) {
		if ( ! is_feed() || ! function_exists( 'coauthors' ) ) {
			return $the_author;
		} else {
			if ( ! empty( esc_html( get_post_meta( get_the_ID(), '_mp_subtitle_settings_byline', true ) ) ) ) {
				return esc_html( get_post_meta( get_the_ID(), '_mp_subtitle_settings_byline', true ) );
			}
			return coauthors( null, null, null, null, false );
		}
	}
endif;

/**
* Register custom post type 'festival'
*
*/
if ( ! function_exists( 'create_festival_page' ) ) :
	add_action( 'init', 'create_festival_page' );
	function create_festival_page() {
		$labels       = array(
			'name'                  => __( 'Festival Pages', 'minnpost-largo' ),
			'singular_name'         => __( 'Festival Page', 'minnpost-largo' ),
			'menu_name'             => __( 'Festival Pages', 'minnpost-largo' ),
			'name_admin_bar'        => __( 'Festival Page', 'minnpost-largo' ),
			'add_new'               => __( 'Add New', 'minnpost-largo' ),
			'add_new_item'          => __( 'Add New Festival Page', 'minnpost-largo' ),
			'new_item'              => __( 'New Festival Page', 'minnpost-largo' ),
			'edit_item'             => __( 'Edit Festival Page', 'minnpost-largo' ),
			'update_item'           => __( 'Update Festival Page', 'minnpost-largo' ),
			'view_item'             => __( 'View Festival Page', 'minnpost-largo' ),
			'view_items'            => __( 'View Festival Pages', 'minnpost-largo' ),
			'all_items'             => __( 'Festival Pages', 'minnpost-largo' ),
			'archives'              => __( 'Festival Page Archives', 'minnpost-largo' ),
			'search_items'          => __( 'Search Festival Pages', 'minnpost-largo' ),
			'parent_item_colon'     => __( 'Parent Festival Pages:', 'minnpost-largo' ),
			'not_found'             => __( 'No festival pages found.', 'minnpost-largo' ),
			'not_found_in_trash'    => __( 'No festival pages found in Trash.', 'minnpost-largo' ),
			'attributes'            => __( 'Festival Page Attributes', 'minnpost-largo' ),
			'featured_image'        => __( 'Featured Image', 'minnpost-largo' ),
			'set_featured_image'    => __( 'Set featured image', 'minnpost-largo' ),
			'remove_featured_image' => __( 'Remove featured image', 'minnpost-largo' ),
			'use_featured_image'    => __( 'Use as featured image', 'minnpost-largo' ),
			'insert_into_item'      => __( 'Insert into message', 'minnpost-largo' ),
			'uploaded_to_this_item' => __( 'Uploaded to this festival page', 'minnpost-largo' ),
			'items_list'            => __( 'Festival pages list', 'minnpost-largo' ),
			'items_list_navigation' => __( 'Festival pages list navigation', 'minnpost-largo' ),
			'filter_items_list'     => __( 'Filter festival page list', 'minnpost-largo' ),
		);
		$capabilities = array(
			'edit_post'          => 'edit_event_website_page',
			'read_post'          => 'read_event_website_page',
			'delete_post'        => 'delete_event_website_page',
			'delete_posts'       => 'delete_event_website_pages',
			'edit_posts'         => 'edit_event_website_pages',
			'edit_others_posts'  => 'edit_others_event_website_pages',
			'publish_posts'      => 'publish_event_website_pages',
			'read_private_posts' => 'read_private_event_website_pages',
			'create_posts'       => 'create_event_website_pages',
		);
		$args         = array(
			'label'               => __( 'Festival Page', 'minnpost-largo' ),
			'description'         => __( 'Festival page template', 'minnpost-largo' ),
			'labels'              => $labels,
			'supports'            => array(
				'title',
				'revisions',
				'editor',
				//'author',
			),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => 'edit.php?post_type=tribe_events',
			'show_in_admin_bar'   => true,
			'show_in_nav_menus'   => true,
			'show_in_rest'        => true, // this will be required in gutenberg
			'can_export'          => true,
			'has_archive'         => true,
			'exclude_from_search' => false,
			'publicly_queryable'  => true,
			'capability_type'     => 'page',
			'menu_icon'           => 'dashicons-calendar-alt',
			'capabilities'        => $capabilities,
		);
		register_post_type( 'festival', $args );
	}
endif;

/**
* Register custom post type 'tonight'
*
*/
if ( ! function_exists( 'create_tonight_page' ) ) :
	add_action( 'init', 'create_tonight_page' );
	function create_tonight_page() {
		$labels       = array(
			'name'                  => __( 'MinnPost Tonight Pages', 'minnpost-largo' ),
			'singular_name'         => __( 'MinnPost Tonight Page', 'minnpost-largo' ),
			'menu_name'             => __( 'MinnPost Tonight Pages', 'minnpost-largo' ),
			'name_admin_bar'        => __( 'MinnPost Tonight Page', 'minnpost-largo' ),
			'add_new'               => __( 'Add New', 'minnpost-largo' ),
			'add_new_item'          => __( 'Add New MinnPost Tonight Page', 'minnpost-largo' ),
			'new_item'              => __( 'New MinnPost Tonight Page', 'minnpost-largo' ),
			'edit_item'             => __( 'Edit MinnPost Tonight Page', 'minnpost-largo' ),
			'update_item'           => __( 'Update MinnPost Tonight Page', 'minnpost-largo' ),
			'view_item'             => __( 'View MinnPost Tonight Page', 'minnpost-largo' ),
			'view_items'            => __( 'View MinnPost Tonight Pages', 'minnpost-largo' ),
			'all_items'             => __( 'MinnPost Tonight Pages', 'minnpost-largo' ),
			'archives'              => __( 'MinnPost Tonight Page Archives', 'minnpost-largo' ),
			'search_items'          => __( 'Search MinnPost Tonight Pages', 'minnpost-largo' ),
			'parent_item_colon'     => __( 'Parent MinnPost Tonight Pages:', 'minnpost-largo' ),
			'not_found'             => __( 'No MinnPost Tonight pages found.', 'minnpost-largo' ),
			'not_found_in_trash'    => __( 'No MinnPost Tonight pages found in Trash.', 'minnpost-largo' ),
			'attributes'            => __( 'MinnPost Tonight Page Attributes', 'minnpost-largo' ),
			'featured_image'        => __( 'Featured Image', 'minnpost-largo' ),
			'set_featured_image'    => __( 'Set featured image', 'minnpost-largo' ),
			'remove_featured_image' => __( 'Remove featured image', 'minnpost-largo' ),
			'use_featured_image'    => __( 'Use as featured image', 'minnpost-largo' ),
			'insert_into_item'      => __( 'Insert into message', 'minnpost-largo' ),
			'uploaded_to_this_item' => __( 'Uploaded to this MinnPost Tonight page', 'minnpost-largo' ),
			'items_list'            => __( 'MinnPost Tonight pages list', 'minnpost-largo' ),
			'items_list_navigation' => __( 'MinnPost Tonight pages list navigation', 'minnpost-largo' ),
			'filter_items_list'     => __( 'Filter festival page list', 'minnpost-largo' ),
		);
		$capabilities = array(
			'edit_post'          => 'edit_event_website_page',
			'read_post'          => 'read_event_website_page',
			'delete_post'        => 'delete_event_website_page',
			'delete_posts'       => 'delete_event_website_pages',
			'edit_posts'         => 'edit_event_website_pages',
			'edit_others_posts'  => 'edit_others_event_website_pages',
			'publish_posts'      => 'publish_event_website_pages',
			'read_private_posts' => 'read_private_event_website_pages',
			'create_posts'       => 'create_event_website_pages',
		);
		$args         = array(
			'label'               => __( 'MinnPost Tonight Page', 'minnpost-largo' ),
			'description'         => __( 'MinnPost Tonight page template', 'minnpost-largo' ),
			'labels'              => $labels,
			'supports'            => array(
				'title',
				'revisions',
				'editor',
				//'author',
			),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => 'edit.php?post_type=tribe_events',
			'show_in_admin_bar'   => true,
			'show_in_nav_menus'   => true,
			'show_in_rest'        => true, // this will be required in gutenberg
			'can_export'          => true,
			'has_archive'         => true,
			'exclude_from_search' => false,
			'publicly_queryable'  => true,
			'capability_type'     => 'page',
			'menu_icon'           => 'dashicons-calendar-alt',
			'capabilities'        => $capabilities,
		);
		register_post_type( 'tonight', $args );
	}
endif;

/**
 * Change which post types are publicly searchable, even if they are indexed by ElasticSearch
 * In https://github.com/Automattic/vip-go-mu-plugins/blob/master/shared-plugins/vip-go-elasticsearch/vip-go-elasticsearch.php, VIP indicates that they default to post types that don't have exclude_from_search in the args.
 *
 * @param string $post_type the name of the post type
 * @param object $args the post type args
 */
if ( ! function_exists( 'minnpost_exclude_from_search' ) ) :
	add_action( 'registered_post_type', 'minnpost_exclude_from_search', 10, 2 );
	function minnpost_exclude_from_search( $post_type, $args ) {

		// public types
		//$public_types = get_post_types( array( 'public' => true ), 'names' );
		//error_log( 'public types is ' . print_r( $public_types, true ) );

		/* default value with non-public types enabled is:
		$post_types = array(
			[post] => post
			[page] => page
			[attachment] => attachment
			[thank_you_gift] => thank_you_gift
			[partner] => partner
			[partner_offer] => partner_offer
			[message] => message
			[guest-author] => guest-author
			[cr3ativsponsor] => cr3ativsponsor
			[wp_log] => wp_log
			[vip-legacy-redirect] => vip-legacy-redirect
			[tribe_events] => tribe_events
			[tribe_ext_speaker] => tribe_ext_speaker
			[newsletter] => newsletter
			[festival] => festival
			[tonight] => tonight
			[saswp_reviews] => saswp_reviews
			[saswp-collections] => saswp-collections
		);
		*/

		$types_to_exclude = array(
			'attachment',
			'thank_you_gift',
			'partner',
			'partner_offer',
			'popup',
			'message',
			'guest-author',
			'cr3ativsponsor',
			'wp_log',
			'vip-legacy-redirect',
			'newsletter',
			'saswp_reviews',
			'saswp-collections',
			'nav_menu_item',
		);

		if ( ! in_array( $post_type, $types_to_exclude, true ) ) {
			return;
		}

		$args->exclude_from_search = true;

		global $wp_post_types;
		$wp_post_types[ $post_type ] = $args;

	}
endif;

/**
 * Change visibility for the wp_log type
 *
 * @param array $log_args the arguments for that post type
 * @return array $log_args the arguments for that post type
 */
if ( ! function_exists( 'minnpost_log_args' ) ) :
	add_action( 'wp_logging_post_type_args', 'minnpost_log_args', 10, 2 );
	function minnpost_log_args( $log_args ) {

		$log_args['capabilities'] = array(
			'edit_post'          => 'edit_log',
			'read_post'          => 'read_log',
			'delete_post'        => 'delete_log',
			'delete_posts'       => 'delete_logs',
			'edit_posts'         => 'edit_logs',
			'edit_others_posts'  => 'edit_others_logs',
			'publish_posts'      => 'publish_logs',
			'read_private_posts' => 'read_private_logs',
			'create_posts'       => 'create_logs',
		);

		return $log_args;

	}
endif;

/**
 * Change label for the deleted event type from the Event Calendar plugin
 *
 * @param array $args
 * @param string $post_type
 * @return array $args
 */
if ( ! function_exists( 'minnpost_deleted_event_args' ) ) :
	add_filter( 'register_post_type_args', 'minnpost_deleted_event_args', 20, 2 );
	function minnpost_deleted_event_args( $args, $post_type ) {
		if ( 'deleted_event' === $post_type ) {
			$args['label'] = __( 'Deleted Events', 'minnpost-largo' );
		}
		return $args;
	}
endif;

/**
 * Define regions where inserted messages can appear on the site
 *
 * @param array $regions
 * @return array $regions
 */
if ( ! function_exists( 'minnpost_message_regions' ) ) :
	add_filter( 'wp_message_inserter_regions', 'minnpost_message_regions' );
	function minnpost_message_regions( $regions ) {
		$regions = array(
			'header'                  => __( 'Site Header', 'minnpost-largo' ),
			'above_article_body'      => __( 'Above Article Body', 'minnpost-largo' ),
			//'article_middle'        => __( 'Article Middle', 'minnpost-largo' ),
			'below_article_body'      => __( 'Below Article Body', 'minnpost-largo' ),
			'article_bottom'          => __( 'Article Bottom', 'minnpost-largo' ),
			'above_homepage_articles' => __( 'Above Homepage Articles', 'minnpost-largo' ),
			'homepage_middle'         => __( 'Homepage Middle', 'minnpost-largo' ),
			'archive_middle'          => __( 'Archive Middle', 'minnpost-largo' ),
			'user_account'            => __( 'User Account', 'minnpost-largo' ),
			'popup'                   => __( 'Popup', 'minnpost-largo' ),
			'email_header'            => __( 'Email Header', 'minnpost-largo' ),
			'above_email_articles'    => __( 'Above Email Articles', 'minnpost-largo' ),
			'email_middle'            => __( 'Email Middle', 'minnpost-largo' ),
			'email_before_bios'       => __( 'Email Before Bios', 'minnpost-largo' ),
			'email_bottom'            => __( 'Email Bottom', 'minnpost-largo' ),
		);
		return $regions;
	}
endif;

/**
 * Change visibility for the message type
 *
 * @param array $message_args the arguments for that post type
 * @return array $message_args the arguments for that post type
 */
if ( ! function_exists( 'minnpost_message_args' ) ) :
	add_action( 'wp_message_inserter_message_type_args', 'minnpost_message_args', 10, 2 );
	function minnpost_message_args( $message_args ) {

		$message_args['capabilities'] = array(
			'edit_post'          => 'edit_message',
			'read_post'          => 'read_message',
			'delete_post'        => 'delete_message',
			'delete_posts'       => 'delete_messages',
			'edit_posts'         => 'edit_messages',
			'edit_others_posts'  => 'edit_others_messages',
			'publish_posts'      => 'publish_messages',
			'read_private_posts' => 'read_private_messages',
			'create_posts'       => 'create_messages',
		);

		return $message_args;

	}
endif;

/**
 * Change visibility for the action scheduler posts
 *
 * @param array $post_args the arguments for that post type
 * @return array $post_args the arguments for that post type
 */
if ( ! function_exists( 'minnpost_action_scheduler_args' ) ) :
	add_action( 'action_scheduler_post_type_args', 'minnpost_action_scheduler_args', 10, 1 );
	function minnpost_action_scheduler_args( $post_args ) {

		$post_args['capabilities'] = array(
			'edit_post'          => 'edit_scheduled_action',
			'read_post'          => 'read_scheduled_action',
			'delete_post'        => 'delete_scheduled_action',
			'delete_posts'       => 'delete_scheduled_actions',
			'edit_posts'         => 'edit_scheduled_actions',
			'edit_others_posts'  => 'edit_others_scheduled_actions',
			'publish_posts'      => 'publish_scheduled_actions',
			'read_private_posts' => 'read_private_scheduled_actions',
			'create_posts'       => 'create_scheduled_actions',
		);

		return $post_args;

	}
endif;
