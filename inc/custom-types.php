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
		$festival_taxonomy = 'tribe_events_cat';
		$labels            = array(
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
		$capabilities      = array(
			'edit_post'          => 'edit_festival_page',
			'read_post'          => 'read_festival_page',
			'delete_post'        => 'delete_festival_page',
			'delete_posts'       => 'delete_festival_pages',
			'edit_posts'         => 'edit_festival_pages',
			'edit_others_posts'  => 'edit_others_festival_pages',
			'publish_posts'      => 'publish_festival_pages',
			'read_private_posts' => 'read_private_festival_pages',
			'create_posts'       => 'create_festival_pages',
		);
		$args              = array(
			'label'               => __( 'Festival Page', 'minnpost-largo' ),
			'description'         => __( 'Festival page template', 'minnpost-largo' ),
			'labels'              => $labels,
			'supports'            => array(
				'title',
				'revisions',
				'editor',
				//'author',
			),
			/*'taxonomies'          => array(
				$festival_taxonomy,
			),*/
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
 * Change which post types are publicly searchable, even if they are indexed by ElasticSearch
 * In https://github.com/Automattic/vip-go-mu-plugins/blob/master/shared-plugins/vip-go-elasticsearch/vip-go-elasticsearch.php, VIP indicates that they default to post types that don't have exclude_from_search in the args.
 *
 * @param string $post_type the name of the post type
 * @param object $args the post type args
 */
if ( ! function_exists( 'minnpost_exclude_from_search' ) ) :
	add_action( 'registered_post_type', 'minnpost_exclude_from_search', 10, 2 );
	function minnpost_exclude_from_search( $post_type, $args ) {

		/* default value with non-public types enabled is:
		$post_types = array(
			'post'                => 'post',
			'page'                => 'page',
			'attachment'          => 'attachment',
			'revision'            => 'revision',
			'nav_menu_item'       => 'nav_menu_item',
			'custom_css'          => 'custom_css',
			'customize_changeset' => 'customize_changeset',
			'oembed_cache'        => 'oembed_cache',
			'user_request'        => 'user_request',
			'partner'             => 'partner',
			'partner_offer'       => 'partner_offer',
			'message'             => 'message',
			'popup'               => 'popup',
			'popup_theme'         => 'popup_theme',
			'scheduled-action'    => 'scheduled-action',
			'acm-code'            => 'acm-code',
			'guest-author'        => 'guest-author',
			'cr3ativsponsor'      => 'cr3ativsponsor',
			'wp_log'              => 'wp_log',
			'tribe_venue'         => 'tribe_venue',
			'tribe_organizer'     => 'tribe_organizer',
			'tribe_events'        => 'tribe_events',
			'tribe-ea-record'     => 'tribe-ea-record',
			'deleted_event'       => 'deleted_event',
			'jp_pay_order'        => 'jp_pay_order',
			'jp_pay_product'      => 'jp_pay_product',
			'newsletter'          => 'newsletter',
		);
		*/

		$types_to_exclude = array(
			'attachment',
			'partner',
			'partner_offer',
			'popup',
			'guest-author',
			'cr3ativsponsor',
			'message',
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
