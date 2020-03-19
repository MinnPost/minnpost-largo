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
* Set which post types are indexable by Elasticpress
*
* @param array $post_types
* @return array $post_types
*
*/
if ( ! function_exists( 'minnpost_indexable_post_types' ) ) :
	add_filter( 'ep_indexable_post_types', 'minnpost_indexable_post_types', 11 );
	function minnpost_indexable_post_types( $post_types ) {
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
		$non_indexable_types = array(
			'partner_offer'    => 'partner_offer',
			'message'          => 'message',
			'scheduled-action' => 'message',
			'wp_log'           => 'wp_log',
			'deleted_event'    => 'wp_log',
		);
		$post_types          = array_diff_assoc( $post_types, $non_indexable_types );
		return $post_types;
	}
endif;

/**
 * Change which post types are publicly searchable, even if they are indexed by ElasticSearch
 *
 * @param string $post_type the name of the post type
 * @param object $args the post type args
 */
if ( ! function_exists( 'minnpost_exclude_from_search' ) ) :
	add_action( 'registered_post_type', 'minnpost_exclude_from_search', 10, 2 );
	function minnpost_exclude_from_search( $post_type, $args ) {

		$types_to_exclude = array(
			'attachment',
			'partner',
			'partner_offer',
			'popup',
			'guest-author',
			'cr3ativsponsor',
			'message',
		);

		if ( ! in_array( $post_type, $types_to_exclude ) ) {
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
			'header'             => __( 'Site Header', 'minnpost-largo' ),
			'above_article_body' => __( 'Above Article Body', 'minnpost-largo' ),
			//'article_middle'   => __( 'Article Middle', 'minnpost-largo' ),
			'article_bottom'     => __( 'Article Bottom', 'minnpost-largo' ),
			'homepage_middle'    => __( 'Homepage Middle', 'minnpost-largo' ),
			'archive_middle'     => __( 'Archive Middle', 'minnpost-largo' ),
			'user_account'       => __( 'User Account', 'minnpost-largo' ),
			'popup'              => __( 'Popup', 'minnpost-largo' ),
			'email_header'       => __( 'Email Header', 'minnpost-largo' ),
			'email_middle'       => __( 'Email Middle', 'minnpost-largo' ),
			'email_footer'       => __( 'Email Footer', 'minnpost-largo' ),
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
