<?php
/**
 * MinnPost settings for popups, site messages, etc.
 *
 * Currently, this depends on these plugins: popup-maker (for popups)
 * and wp-message-inserter-plugin (for site messages)
 *
 * @package MinnPost Largo
 */

/**
* Allows us to determine if a popup can be loaded, after the conditions have been processed.
* We use this to prevent popups on /support, /user, /account urls
*
* @param bool $loadable
* @return int $id
*/
if ( ! function_exists( 'minnpost_popup_is_loadable' ) ) :
	add_filter( 'pum_popup_is_loadable', 'minnpost_popup_is_loadable', 10, 2 );
	function minnpost_popup_is_loadable( $loadable, $id ) {
		$url = wp_parse_url( $_SERVER['REQUEST_URI'] );
		if ( isset( $url['path'] ) ) {
			$path = $url['path'];
			if ( substr( $path, 0, strlen( '/support' ) ) === '/support' ) {
				$loadable = false;
			}
			if ( substr( $path, 0, strlen( '/user' ) ) === '/user' ) {
				$loadable = false;
			}
			if ( substr( $path, 0, strlen( '/account' ) ) === '/account' ) {
				$loadable = false;
			}
		}
		return $loadable;
	}
endif;

/**
* Modify the pages that show on the admin side of the popup manager
*
* @param array $admin_pages
* @return array $admin_pages
*/
if ( ! function_exists( 'minnpost_popup_admin_pages' ) ) :
	add_filter( 'pum_admin_pages', 'minnpost_popup_admin_pages' );
	function minnpost_popup_admin_pages( $admin_pages ) {
		if ( isset( $admin_pages['subscribers'] ) ) {
			$admin_pages['subscribers']['capability'] = 'nobody_needs_this';
		}
		return $admin_pages;
	}
endif;

/**
* Modify the popup capabilities
*
* @param array $admin_pages
* @return array $admin_pages
*/
if ( ! function_exists( 'minnpost_popup_admin_pages' ) ) :
	add_filter( 'pum_admin_pages', 'minnpost_popup_admin_pages' );
	function minnpost_popup_admin_pages( $admin_pages ) {
		if ( isset( $admin_pages['subscribers'] ) ) {
			$admin_pages['subscribers']['capability'] = 'nobody_needs_this';
		}
		return $admin_pages;
	}
endif;

/**
* Modify the conditions that control when users see popups
* todo: we could move the membership focused methods into the membership plugin
*
* @param array $conditions
* @return array $conditions
*/
if ( ! function_exists( 'minnpost_popup_conditions' ) ) :
	add_filter( 'pum_registered_conditions', 'minnpost_popup_conditions' );
	function minnpost_popup_conditions( $conditions ) {
		foreach ( $conditions as $key => $condition ) {
			$skip_these_groups = array( 'Logs', 'Guest Authors', 'Sponsors', 'Newsletters', 'Sponsor Level', 'Media' );
			if ( in_array( $condition['group'], $skip_these_groups ) ) {
				unset( $conditions[ $key ] );
			}
		}
		$conditions['is_logged_in']         = array(
			'group'    => __( 'User', 'minnpost-largo' ),
			'name'     => __( 'User: Is Logged In', 'minnpost-largo' ),
			'callback' => 'is_user_logged_in',
			'priority' => 1,
		);
		$conditions['is_member']            = array(
			'group'    => __( 'User', 'minnpost-largo' ),
			'name'     => __( 'User: Is Member', 'minnpost-largo' ),
			'callback' => 'minnpost_user_is_member',
			'priority' => 2,
		);
		$conditions['is_sustaining_member'] = array(
			'group'    => __( 'User', 'minnpost-largo' ),
			'name'     => __( 'User: Is Sustaining Member', 'minnpost-largo' ),
			'callback' => 'minnpost_user_is_sustaining_member',
			'priority' => 3,
		);
		$conditions['is_in_campaign']       = array(
			'group'    => __( 'User', 'minnpost-largo' ),
			'name'     => __( 'User: In This Campaign', 'minnpost-largo' ),
			'callback' => 'minnpost_user_is_in_campaign',
			'priority' => 4,
		);
		$conditions['has_role']             = array(
			'group'    => __( 'User', 'minnpost-largo' ),
			'name'     => __( 'User: Has Role', 'minnpost-largo' ),
			'fields'   => array(
				'selected' => array(
					'placeholder' => __( 'Select Role', 'minnpost-largo' ),
					'type'        => 'select',
					'multiple'    => true,
					//'select2'     => true,
					'as_array'    => true,
					'options'     => minnpost_popup_roles(),
				),
			),
			'callback' => 'minnpost_user_has_role',
			'priority' => 5,
		);
		$conditions['benefit_eligible']     = array(
			'group'    => __( 'User', 'minnpost-largo' ),
			'name'     => __( 'User: Eligible For Benefit', 'minnpost-largo' ),
			'fields'   => array(
				'selected' => array(
					'placeholder' => __( 'Select Benefit', 'minnpost-largo' ),
					'type'        => 'select',
					'multiple'    => true,
					//'select2'     => true,
					'as_array'    => true,
					'options'     => minnpost_popup_benefits(),
				),
			),
			'callback' => 'minnpost_user_eligible_for_benefit',
			'priority' => 6,
		);
		$conditions['gets_emails']          = array(
			'group'    => __( 'User', 'minnpost-largo' ),
			'name'     => __( 'User: Gets Emails', 'minnpost-largo' ),
			'fields'   => array(
				'selected' => array(
					'placeholder' => __( 'Select Email', 'minnpost-largo' ),
					'type'        => 'select',
					'multiple'    => true,
					//'select2'     => true,
					'as_array'    => true,
					'options'     => minnpost_email_options(),
				),
			),
			'callback' => 'minnpost_user_gets_emails',
			'priority' => 7,
		);
		$conditions['session_count']        = array(
			'group'    => __( 'User', 'minnpost-largo' ),
			'name'     => __( 'User: Session Count', 'minnpost-largo' ),
			'fields'   => array(
				'selected' => array(
					'placeholder' => __( 'Session Count', 'minnpost-largo' ),
					'type'        => 'text',
				),
			),
			'callback' => 'minnpost_user_session_count',
			'priority' => 7,
		);
		$conditions['url_is']               = array(
			'group'    => __( 'URL', 'minnpost-largo' ),
			'name'     => __( 'URL: Is', 'minnpost-largo' ),
			'fields'   => array(
				'selected' => array(
					'placeholder' => __( 'Enter the exact URL', 'minnpost-largo' ),
					'type'        => 'text',
				),
			),
			'callback' => 'minnpost_popup_url_matches',
			'priority' => 1,
		);
		$conditions['url_contains']         = array(
			'group'    => __( 'URL', 'minnpost-largo' ),
			'name'     => __( 'URL: Contains', 'minnpost-largo' ),
			'fields'   => array(
				'selected' => array(
					'placeholder' => __( 'Check for text in the URL', 'minnpost-largo' ),
					'type'        => 'text',
				),
			),
			'callback' => 'minnpost_popup_url_matches',
			'priority' => 2,
		);
		$conditions['url_begins_with']      = array(
			'group'    => __( 'URL', 'minnpost-largo' ),
			'name'     => __( 'URL: Begins With', 'minnpost-largo' ),
			'fields'   => array(
				'selected' => array(
					'placeholder' => __( 'Check for text at the beginning of the URL', 'minnpost-largo' ),
					'type'        => 'text',
				),
			),
			'callback' => 'minnpost_popup_url_matches',
			'priority' => 2,
		);
		$conditions['url_ends_with']        = array(
			'group'    => __( 'URL', 'minnpost-largo' ),
			'name'     => __( 'URL: Ends With', 'minnpost-largo' ),
			'fields'   => array(
				'selected' => array(
					'placeholder' => __( 'Check for text at the end of the URL', 'minnpost-largo' ),
					'type'        => 'text',
				),
			),
			'callback' => 'minnpost_popup_url_matches',
			'priority' => 2,
		);
		/*$conditions['using_ad_blocker'] = array(
			'group'    => __( 'User', 'minnpost-largo' ),
			'name'     => __( 'User: Using Ad Blocker', 'minnpost-largo' ),
			'callback' => 'user_is_using_ad_blocker',
			'priority' => 2,
		);
		*/
		return $conditions;
	}
endif;

/**
* Modify the conditions that control when users see site messages
* todo: we could move the membership focused methods into the membership plugin
*
* @param array $conditionals
* @return array $conditionals
*/
if ( ! function_exists( 'minnpost_site_message_conditionals' ) ) :
	add_filter( 'wp_message_inserter_conditionals', 'minnpost_site_message_conditionals', 10, 1 );
	function minnpost_site_message_conditionals( $conditionals ) {
		$conditionals['user'][] = array(
			'name'       => 'is_member',
			'method'     => 'minnpost_user_is_member',
			'has_params' => false,
		);
		$conditionals['user'][] = array(
			'name'       => 'is_sustaining_member',
			'method'     => 'minnpost_user_is_sustaining_member',
			'has_params' => false,
		);
		$conditionals['user'][] = array(
			'name'       => 'is_in_campaign',
			'method'     => 'minnpost_user_is_in_campaign',
			'has_params' => false,
		);
		$conditionals['user'][] = array(
			'name'       => 'has_role',
			'method'     => 'minnpost_user_has_role',
			'has_params' => true,
			'params'     => array(
				'role',
			),
		);
		$conditionals['user'][] = array(
			'name'       => 'session_count',
			'method'     => 'minnpost_user_session_count',
			'has_params' => true,
			'params'     => array(
				'list',
			),
		);
		$conditionals['user'][] = array(
			'name'       => 'gets_emails',
			'method'     => 'minnpost_user_gets_emails',
			'has_params' => true,
			'params'     => array(
				'list',
			),
		);
		/*$conditionals['benefit_eligible']     = array(
			'group'    => __( 'User', 'minnpost-largo' ),
			'name'     => __( 'User: Eligible For Benefit', 'minnpost-largo' ),
			'fields'   => array(
				'selected' => array(
					'placeholder' => __( 'Select Benefit', 'minnpost-largo' ),
					'type'        => 'select',
					'multiple'    => true,
					//'select2'     => true,
					'as_array'    => true,
					'options'     => minnpost_popup_benefits(),
				),
			),
			'callback' => 'minnpost_user_eligible_for_benefit',
			'priority' => 6,
		);*/

		return $conditionals;
	}
endif;

/**
* Check to see if the user has any membership level role
*
* @return bool
*/
if ( ! function_exists( 'minnpost_user_is_member' ) ) :
	function minnpost_user_is_member() {
		$user = wp_get_current_user();
		if ( 0 === $user ) {
			return false;
		}

		global $minnpost_membership;
		$member_levels = array_column( $minnpost_membership->member_levels->get_member_levels( '', false ), 'slug' );

		// Check each selected role against the user's roles
		foreach ( $member_levels as $level ) {
			// If the selected role matches, return true
			if ( in_array( $level, (array) $user->roles ) ) {
				return true;
			}
		}

		// otherwise, return false
		return false;

	}
endif;

/**
* Check to see if the user has the sustaining member meta field value of 1
*
* @return bool
*/
if ( ! function_exists( 'minnpost_user_is_sustaining_member' ) ) :
	function minnpost_user_is_sustaining_member() {

		$user_id = get_current_user_id();
		if ( 0 === $user_id ) {
			return false;
		}

		$sustaining_member = get_user_meta( $user_id, '_sustaining_member', true );
		if ( true === filter_var( $sustaining_member, FILTER_VALIDATE_BOOLEAN ) ) {
			// if this user is a sustaining member, return true
			return true;
		}

		// otherwise, return false
		return false;

	}
endif;


/**
* Return additional conditional fields for message disply
*
* @param int $group_id
* @param string $prefix
* @return array $conditional_fields
*/
if ( ! function_exists( 'minnpost_largo_message_conditional_fields' ) ) :
	add_filter( 'wp_message_inserter_add_group_conditional_fields', 'minnpost_largo_message_conditional_fields', 10, 3 );
	function minnpost_largo_message_conditional_fields( $conditional_fields, $group_id, $prefix ) {
		$conditional_fields[] = array(
			'name'       => __( 'Emails to match', 'minnpost-largo' ),
			'id'         => $prefix . 'emails_to_match',
			'type'       => 'multicheck',
			'desc'       => __( 'If you check values here, users who are subscribed to all of them will match. If you leave it unchecked, users who get ANY of the possible emails will match.', 'minnpost-largo' ),
			'options'    => minnpost_email_options(),
			'default'    => 'none',
			'attributes' => array(
				'required'               => false,
				'data-conditional-id'    => wp_json_encode( array( $group_id, $prefix . 'conditional' ) ),
				'data-conditional-value' => 'gets_emails',
			),
		);
		return $conditional_fields;
	}
endif;

/**
* Check to see if the user's newsletters match any of the one(s) we're checking against from the settings.
*
* @return bool
*/
if ( ! function_exists( 'minnpost_user_gets_emails' ) ) :
	function minnpost_user_gets_emails( $lists_to_check = array() ) {
		$user = wp_get_current_user();
		if ( 0 === $user ) {
			return false;
		}

		$lists_to_check = explode( ',', $lists_to_check );
		if ( ! is_array( $lists_to_check ) ) {
			$emails_to_check   = array();
			$emails_to_check[] = $lists_to_check;
		} else {
			$emails_to_check = $lists_to_check;
		}

		// populate values we need for the mc call
		if ( function_exists( 'minnpost_form_processor_mailchimp' ) ) {
			$minnpost_form_processor_mailchimp = minnpost_form_processor_mailchimp();

			$shortcode     = 'newsletter_form';
			$resource_type = $minnpost_form_processor_mailchimp->get_data->get_resource_type( $shortcode );
			$resource_id   = $minnpost_form_processor_mailchimp->get_data->get_resource_id( $shortcode );

			$user_email      = $user->user_email;
			$reset_user_info = false;
			$message_code    = get_query_var( 'newsletter_message_code' );
			if ( '' !== $message_code ) {
				$reset_user_info = true;
			}

			$user_mailchimp_groups = get_option( $minnpost_form_processor_mailchimp->option_prefix . $shortcode . '_mc_resource_item_type', '' );
			$user_mailchimp_info   = $minnpost_form_processor_mailchimp->get_data->get_user_info( $shortcode, $resource_type, $resource_id, $user_email, $reset_user_info );

			if ( ! is_wp_error( $user_mailchimp_info ) ) {
				$mailchimp_user_id = $user_mailchimp_info['id'];
				$groups            = $user_mailchimp_info[ $user_mailchimp_groups ];
				$mailchimp_status  = $user_mailchimp_info['status'];
				if ( 'subscribed' === $mailchimp_status ) {
					$mc_resource_items = $minnpost_form_processor_mailchimp->get_data->get_mc_resource_items( $resource_type, $resource_id );
					foreach ( $mc_resource_items as $item ) {
						// check until there's a match for the list we're checking against on the user's groups
						if ( in_array( $item['text'], $lists_to_check ) ) {
							error_log( 'yep' );
						}
					}
				}
			}
		}
		// otherwise, return false
		return false;

	}
endif;

/**
* Check to see if the user is excluded from the current campaign
*
* @return bool
*/
if ( ! function_exists( 'minnpost_user_is_in_campaign' ) ) :
	function minnpost_user_is_in_campaign() {

		$user_id = get_current_user_id();
		if ( 0 === $user_id ) {
			// user is NOT logged in. return true because we can't exclude them.
			return true;
		}

		$exclude_from_current_campaign = get_user_meta( $user_id, '_exclude_from_current_campaign', true );
		if ( true !== filter_var( $exclude_from_current_campaign, FILTER_VALIDATE_BOOLEAN ) ) {
			// if this user is NOT excluded from this campaign, return true
			return true;
		}

		// otherwise, return false
		return false;

	}
endif;

/**
* Get roles as options for the <select>
*
* @return array $roles
*/
if ( ! function_exists( 'minnpost_popup_roles' ) ) :
	function minnpost_popup_roles() {
		static $roles = null;

		if ( null === $roles ) {
			$roles = array();
			if ( ! function_exists( 'get_editable_roles' ) ) {
				require_once( ABSPATH . '/wp-admin/includes/user.php' );
			}
			$editable_roles = array_keys( get_editable_roles() );
			foreach ( $editable_roles as $editable_role ) {
				$roles[ $editable_role ] = $editable_role;
			}
		}

		return $roles;
	}
endif;

/**
* Check to see if the user has any of the selected roles
*
* @param array $settings
* @return bool
*/
if ( ! function_exists( 'minnpost_user_has_role' ) ) :
	function minnpost_user_has_role( $settings = array() ) {
		$user = wp_get_current_user();
		if ( 0 === $user ) {
			return false;
		}

		$settings = $settings['settings'];

		// we can support either single or multiple values for the <select> here
		$check_items = array();
		if ( is_string( $settings['selected'] ) ) {
			$check_items[] = $settings['selected'];
		} elseif ( is_array( $settings['selected'] ) ) {
			$check_items = $settings['selected'];
		}

		// here we will need to use whatever method we use to check whether a user is eligible to claim the selected benefit(s)
		// if the user is eligible for the selected benefit, return true

		// otherwise, return false
		return false;

	}
endif;

/**
* Get benefits as options for the <select>
*
* @return array $benefits
*/
if ( ! function_exists( 'minnpost_popup_benefits' ) ) :
	function minnpost_popup_benefits() {
		static $benefits = null;
		if ( null === $benefits ) {
			$benefits = array(
				'partner-offers' => 'Partner Offers',
				'fan-club'       => 'Fan Club',
			);
		}
		return $benefits;
	}
endif;

/**
* Get emails as options for the <select>
*
* @return array $emails
*/
if ( ! function_exists( 'minnpost_email_options' ) ) :
	function minnpost_email_options() {
		static $emails = null;
		if ( null === $emails ) {
			$emails = array();
			// populate values we need for the mc call
			if ( function_exists( 'minnpost_form_processor_mailchimp' ) ) {
				$minnpost_form_processor_mailchimp = minnpost_form_processor_mailchimp();

				$shortcode         = 'newsletter_form';
				$resource_type     = $minnpost_form_processor_mailchimp->get_data->get_resource_type( $shortcode );
				$resource_id       = $minnpost_form_processor_mailchimp->get_data->get_resource_id( $shortcode );
				$mc_resource_items = $minnpost_form_processor_mailchimp->get_data->get_mc_resource_items( $resource_type, $resource_id );
				foreach ( $mc_resource_items as $item ) {
					$emails[ $item['id'] ] = $item['text'];
				}
			}
		}
		return $emails;
	}
endif;

/**
* Check to see if the user is eligible for has any of the selected benefits
*
* @param array $settings
* @return bool
*/
if ( ! function_exists( 'minnpost_user_eligible_for_benefit' ) ) :
	function minnpost_user_eligible_for_benefit( $settings = array() ) {
		$benefit_prefix = 'account-benefits-';
		$benefit_name   = $settings['settings']['selected'][0];
		global $minnpost_membership;
		$user_claim_eligibility = $minnpost_membership->user_info->get_user_benefit_eligibility( $benefit_name );
		if ( 'member_eligible' === $user_claim_eligibility['state'] ) {
			$user_claim_status = $minnpost_membership->front_end->get_user_claim_status( $benefit_prefix, $benefit_name );
			if ( is_array( $user_claim_status ) && ! empty( $user_claim_status ) ) {
				if ( isset( $user_claim_status['status'] ) ) {
					$user_claim_status = $user_claim_status['status'];
				}
			}
			if ( 'user_is_eligible' === $user_claim_status ) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
endif;


/**
* Filter the cookies that can trigger a popup
*
* @param array $cookies
* @return array $cookies
*/
if ( ! function_exists( 'minnpost_popup_cookies' ) ) :
	add_filter( 'pum_registered_cookies', 'minnpost_popup_cookies', 10, 1 );
	function minnpost_popup_cookies( $cookies ) {
		unset( $cookies['pum_sub_form_success'] );
		unset( $cookies['pum_sub_form_already_subscribed'] );
		return $cookies;
	}
endif;

/**
* Filter the order of popup conditons in the admin UI
*
* @param array $order
* @return array $order
*/
if ( ! function_exists( 'minnpost_popup_condition_order' ) ) :
	add_filter( 'pum_condition_sort_order', 'minnpost_popup_condition_order', 10, 1 );
	function minnpost_popup_condition_order( $order ) {
		$order['User'] = 2;
		return $order;
	}
endif;

if ( ! function_exists( 'minnpost_popup_settings_fields' ) ) :
	add_filter( 'pum_settings_fields', 'minnpost_popup_settings_fields', 10, 1 );
	function minnpost_popup_settings_fields( $fields ) {
		if ( isset( $fields['privacy']['forms'] ) && ! empty( $fields['privacy']['forms'] ) ) {
			$fields['privacy']['forms'] = array();
		}
		if ( isset( $fields['subscriptions'] ) && ! empty( $fields['subscriptions'] ) ) {
			$fields['subscriptions'] = array();
		}
		return $fields;
	}
endif;

/**
* Check to see if the URL matches
*
* @param array $settings
* @return bool
*/
if ( ! function_exists( 'minnpost_popup_url_matches' ) ) :
	function minnpost_popup_url_matches( $settings = array() ) {
		$is_match = false;
		$target   = $settings['target'];
		$selected = isset( $settings['selected'] ) ? $settings['selected'] : '';
		$url      = $_SERVER['REQUEST_URI'];

		if ( '' !== $selected ) {
			switch ( $target ) {
				case 'url_is':
					if ( $url === $selected || site_url( $url ) === $selected ) {
						$is_match = true;
					}
					break;
				case 'url_contains':
					if ( false !== strpos( $url, $selected ) ) {
						$is_match = true;
					}
					break;
				case 'url_begins_with':
					if ( substr( $url, 0, strlen( $selected ) ) === $selected ) {
						$is_match = true;
					}
					break;
				case 'url_ends_with':
					if ( substr( $url, -strlen( $selected ) ) === $selected ) {
						$is_match = true;
					}
					break;
			}
		}

		return $is_match;
	}
endif;


// Checks preloaded popups in the head for which assets to enqueue.
if ( ! function_exists( 'minnpost_popup_assets' ) ) :
	add_action( 'pum_preload_popup', 'minnpost_popup_assets' );
	add_filter( 'wp_enqueue_scripts', 'minnpost_popup_assets' );
	function minnpost_popup_assets( $popup_id = 0 ) {
		wp_dequeue_style( 'popup-maker-site' );
		wp_enqueue_style( 'minnpost-popups', get_theme_file_uri() . '/assets/css/popups.css', array(), filemtime( get_theme_file_path() . '/assets/css/popups.css' ), 'screen' );
	}
endif;

/**
 * Modify popup post type arguments
 *
 * @param    array    $popup_args
 * @return   array    $popup_args
 */
if ( ! function_exists( 'minnpost_popup_post_type_args' ) ) :
	add_filter( 'popmake_popup_post_type_args', 'minnpost_popup_post_type_args', 10, 1 );
	function minnpost_popup_post_type_args( $popup_args ) {
		$popup_args['capabilities'] = array(
			'edit_post'          => 'edit_popup',
			'delete_post'        => 'delete_popup',
			'delete_posts'       => 'delete_popup',
			'edit_posts'         => 'edit_popups',
			'edit_others_posts'  => 'edit_others_popups',
			'publish_posts'      => 'publish_popups',
			'read_private_posts' => 'read_private_popups',
		);
		return $popup_args;
	}
endif;

/**
 * Modify popup theme post type arguments
 *
 * @param    array    $popup_theme_args
 * @return   array    $popup_theme_args
 */
if ( ! function_exists( 'minnpost_popup_theme_post_type_args' ) ) :
	add_filter( 'popmake_popup_theme_post_type_args', 'minnpost_popup_theme_post_type_args', 10, 1 );
	function minnpost_popup_theme_post_type_args( $popup_theme_args ) {
		$popup_theme_args['capabilities'] = array(
			'edit_post'          => 'edit_popup_theme',
			'delete_post'        => 'delete_popup_theme',
			'delete_posts'       => 'delete_popup_theme',
			'edit_posts'         => 'edit_popup_themes',
			'edit_others_posts'  => 'edit_others_popup_themes',
			'publish_posts'      => 'publish_popup_themes',
			'read_private_posts' => 'read_private_popup_themes',
		);
		return $popup_theme_args;
	}
endif;

/**
 * Filter popup content - allows [raw] to be parsed
 *
 * @param    string    $content
 * @param    int       $id
 * @return   string    $content
 */
if ( ! function_exists( 'minnpost_popup_content_filter' ) ) :
	add_filter( 'pum_popup_content', 'minnpost_popup_content_filter', 10, 2 );
	function minnpost_popup_content_filter( $content, $id ) {
		remove_filter( 'the_content', 'sharing_display', 19 ); // Prevent Jetpack share buttons from being added.
		$content = apply_filters( 'the_content', $content );
		add_filter( 'the_content', 'sharing_display', 19 ); // Re-add the Jetpack filter in case it's needed later on in the page load.
		return $content;
	}
endif;

/**
 * Faux session counting
 * wp_loaded doesn't fire 800 times like some of the other hooks
 *
 * @param    string    $content
 * @param    int       $id
 * @return   string    $content
 */
if ( ! function_exists( 'faux_session_checking' ) ) :
	add_action( 'wp_loaded', 'faux_session_checking' );
	function faux_session_checking() {
		// If we don't have a count cookie set it to first visit. Expire it in a year
		if ( ! isset( $_COOKIE['count'] ) ) {
			// Set our count to one and let it sit for a year
			setcookie( 'count', 1, time() + 31556926, '/' );
			$_COOKIE['count'] = 1;

			setcookie( 'timecheck', time() + 3600, time() + 31556926, '/' );
			$_COOKIE['timecheck'] = time() + 3600; // setcookie does not update the superglobal $_COOKIE
		} else {

			if ( time() > $_COOKIE['timecheck'] ) {
				// Update Timecheck to new value
				setcookie( 'timecheck', time() + 3600, time() + 31556926, '/' );
				$_COOKIE['timecheck'] = time() + 3600;

				// Count exists already and it has been an hour. Update count
				setcookie( 'count', $_COOKIE['count'] + 1, time() + 31556926, '/' );
				$_COOKIE['count'] + 1;
			}
		}
	}
endif;
