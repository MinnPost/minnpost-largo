<?php
/**
 * MinnPost settings for site messages and popups
 *
 * Currently, this depends on the wp-message-inserter-plugin plugin
 *
 * @package MinnPost Largo
 */


/**
* Allows us to determine if a popup should be shown to the user, after the conditions have been processed.
* We use this to prevent popups on /support, /user, /account urls
*
* @param bool $show_message
* @return string $region
*/
if ( ! function_exists( 'minnpost_message_show' ) ) :
	add_filter( 'wp_message_inserter_show_message', 'minnpost_message_show', 10, 2 );
	function minnpost_message_show( $show_message, $region ) {
		if ( 'popup' === $region ) {
			$url = wp_parse_url( $_SERVER['REQUEST_URI'] );
			if ( isset( $url['path'] ) ) {
				$path = $url['path'];
				if ( substr( $path, 0, strlen( '/support' ) ) === '/support' ) {
					$show_message = false;
				}
				if ( substr( $path, 0, strlen( '/user' ) ) === '/user' ) {
					$show_message = false;
				}
				if ( substr( $path, 0, strlen( '/account' ) ) === '/account' ) {
					$show_message = false;
				}
			}
		}
		return $show_message;
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
			'name'       => 'gets_emails',
			'method'     => 'minnpost_user_gets_emails',
			'has_params' => true,
			'params'     => array(
				'list',
			),
		);
		$conditionals['url'][]  = array(
			'name'       => 'url_is',
			'method'     => 'minnpost_url_matches',
			'has_params' => true,
			'params'     => array(
				'target',
			),
		);
		$conditionals['url'][]  = array(
			'name'       => 'url_contains',
			'method'     => 'minnpost_url_matches',
			'has_params' => true,
			'params'     => array(
				'target',
			),
		);
		$conditionals['url'][]  = array(
			'name'       => 'url_begins_with',
			'method'     => 'minnpost_url_matches',
			'has_params' => true,
			'params'     => array(
				'target',
			),
		);
		$conditionals['url'][]  = array(
			'name'       => 'url_ends_with',
			'method'     => 'minnpost_url_matches',
			'has_params' => true,
			'params'     => array(
				'target',
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
* Modify the site message cache flag
*
* @param bool $cache
* @return bool $cache
*/
if ( ! function_exists( 'minnpost_site_message_cache' ) ) :
	add_filter( 'wp_message_inserter_cache', 'minnpost_site_message_cache', 10, 1 );
	function minnpost_site_message_cache( $cache ) {
		if ( current_user_can( 'edit_messages' ) ) {
			$cache = false;
		}
		return $cache;
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
		if ( 0 === $user->ID ) {
			return false;
		}

		if ( function_exists( 'minnpost_membership' ) ) {
			$minnpost_membership = minnpost_membership();
			$member_levels       = array_column( $minnpost_membership->member_levels->get_member_levels( '', false ), 'slug' );
			// Check each selected role against the user's roles
			foreach ( $member_levels as $level ) {
				// If the selected role matches, return true
				if ( in_array( $level, (array) $user->roles, true ) ) {
					return true;
				}
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
			'name'       => __( 'Emails to Match', 'minnpost-largo' ),
			'id'         => $prefix . 'emails_to_match',
			'type'       => 'multicheck',
			'desc'       => __( 'This will match users who get ANY of the checked emails. If you want to require that the user gets multiple email addresses, use another conditional with an AND operator.', 'minnpost-largo' ),
			'options'    => minnpost_email_options(),
			'classes'    => 'cmb2-message-conditional-emails-value',
			'default'    => 'none',
			'attributes' => array(
				'required'               => false,
				'data-conditional-id'    => wp_json_encode( array( $group_id, $prefix . 'conditional' ) ),
				'data-conditional-value' => 'gets_emails',
			),
		);
		$conditional_fields[] = array(
			'name'       => __( 'Roles to Match', 'minnpost-largo' ),
			'id'         => $prefix . 'roles_to_match',
			'type'       => 'multicheck',
			'desc'       => __( 'This will match users who have ANY of the checked roles. If you want to require that the user has multiple roles, use another conditional with an AND operator.', 'minnpost-largo' ),
			'options'    => minnpost_role_options(),
			'classes'    => 'cmb2-message-conditional-roles-value',
			'default'    => 'none',
			'attributes' => array(
				'required'               => false,
				'data-conditional-id'    => wp_json_encode( array( $group_id, $prefix . 'conditional' ) ),
				'data-conditional-value' => 'has_role',
			),
		);
		return $conditional_fields;
	}
endif;

/**
* Change the conditional value we expect when it is being replaced in the admin UI
*
* @param string $value
* @param string $method
* @return string $key
*/
if ( ! function_exists( 'minnpost_largo_message_conditional_value' ) ) :
	add_filter( 'wp_message_inserter_add_conditional_value', 'minnpost_largo_message_conditional_value', 10, 2 );
	function minnpost_largo_message_conditional_value( $value, $conditional ) {
		$method = isset( $conditional['_wp_inserted_message_conditional'] ) ? $conditional['_wp_inserted_message_conditional'] : '';
		if ( 'gets_emails' === $method && isset( $conditional['_wp_inserted_message_emails_to_match'] ) ) {
			// these are the emails we want to check and see if the user is getting
			$value = $conditional['_wp_inserted_message_emails_to_match'];
		}
		if ( 'has_role' === $method && isset( $conditional['_wp_inserted_message_roles_to_match'] ) ) {
			// these are the roles we want to check and see if the user has
			$value = $conditional['_wp_inserted_message_roles_to_match'];
		}
		return $value;
	}
endif;

/**
* Check to see if the user's newsletters match any of the one(s) we're checking against from the settings.
*
* @param array $lists_to_check
* @return bool $user_is_match
*/
if ( ! function_exists( 'minnpost_user_gets_emails' ) ) :
	function minnpost_user_gets_emails( $lists_to_check = array() ) {
		$user_is_match = false;
		$user          = wp_get_current_user();
		if ( 0 === $user->ID ) {
			return $user_is_match;
		}
		if ( ! is_array( $lists_to_check ) ) {
			$emails_to_check   = array();
			$emails_to_check[] = $lists_to_check;
		} else {
			$emails_to_check = $lists_to_check;
		}

		// populate values we need for the mc call
		if ( function_exists( 'minnpost_form_processor_mailchimp' ) ) {
			$minnpost_form_processor_mailchimp = minnpost_form_processor_mailchimp();
			$shortcode                         = 'newsletter_form';
			$resource_type                     = $minnpost_form_processor_mailchimp->get_data->get_resource_type( $shortcode );
			$resource_id                       = $minnpost_form_processor_mailchimp->get_data->get_resource_id( $shortcode );

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
						// check until there's a match for the list we're checking against on the user's groups. if there's at least one match, it's a true result.
						if ( in_array( $item['value'], $emails_to_check, true ) ) {
							$user_is_match = true;
							break;
						}
					}
				}
			}
		}
		return $user_is_match;
	}
endif;

/**
* Check to see if the user's newsletters match any of the one(s) we're checking against from the settings.
*
* @return bool
*/
if ( ! function_exists( 'minnpost_user_gets_emails' ) ) :
	function minnpost_popup_user_gets_emails( $lists_to_check = array() ) {
		$user = wp_get_current_user();
		if ( 0 === $user->ID ) {
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
						if ( in_array( $item['text'], $lists_to_check, true ) ) {
							return true;
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
if ( ! function_exists( 'minnpost_role_options' ) ) :
	function minnpost_role_options() {
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
* @param array $roles
* @return bool
*/
if ( ! function_exists( 'minnpost_user_has_role' ) ) :
	function minnpost_user_has_role( $roles = array() ) {
		$user = wp_get_current_user();
		if ( 0 === $user->ID ) {
			return false;
		}

		if ( ! is_array( $roles ) ) {
			$roles_to_check   = array();
			$roles_to_check[] = $roles;
		} else {
			$roles_to_check = $roles;
		}

		$user_has_role = array_intersect( $roles_to_check, (array) $user->roles );
		if ( false !== $user_has_role ) {
			return true;
		} else {
			return false;
		}
	}
endif;

/**
* Check to see if the user has any of the selected roles
*
* @param array $settings
* @return bool
*/
if ( ! function_exists( 'minnpost_popup_user_has_role' ) ) :
	function minnpost_popup_user_has_role( $settings = array() ) {
		$user = wp_get_current_user();
		if ( 0 === $user->ID ) {
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
		if ( function_exists( 'minnpost_membership' ) ) {
			$minnpost_membership    = minnpost_membership();
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
		} else {
			return false;
		}
	}
endif;

/**
* Check to see if the URL matches
*
* @param string $name
* @param string $value
* @return bool
*/
if ( ! function_exists( 'minnpost_url_matches' ) ) :
	function minnpost_url_matches( $name, $value = '' ) {
		$is_match = false;
		$target   = $value;
		$url      = $_SERVER['REQUEST_URI'];

		if ( '' !== $value ) {
			switch ( $name ) {
				case 'url_is':
					if ( $url === $value || site_url( $url ) === site_url( $value ) ) {
						$is_match = true;
					}
					break;
				case 'url_contains':
					if ( false !== strpos( $url, $value ) ) {
						$is_match = true;
					}
					break;
				case 'url_begins_with':
					if ( substr( $url, 0, strlen( $value ) ) === $value ) {
						$is_match = true;
					}
					break;
				case 'url_ends_with':
					if ( substr( $url, -strlen( $value ) ) === $value ) {
						$is_match = true;
					}
					break;
			}
		}

		return $is_match;
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

/**
 * Use Elasticsearch to extend message queries
 * @param array $args
 * @return array $args
 */
if ( ! function_exists( 'minnpost_extend_message_args' ) ) :
	add_filter( 'wp_message_inserter_post_args', 'minnpost_extend_message_args', 10, 1 );
	function minnpost_extend_message_args( $args ) {
		if ( 'production' === VIP_GO_ENV || true === VIP_ENABLE_VIP_SEARCH_QUERY_INTEGRATION ) {
			// stupid bug where elasticsearch seemingly can't handle orderby
			if ( ! isset( $args['orderby'] ) ) {
			$args['es'] = true; // elasticsearch.
		}
		}
		return $args;
	}
endif;

/**
* Allows us to change the template folder location for a site message
* We use this to support legacy newsletter message markup
*
* @param string $location
* @return string $location
*/
if ( ! function_exists( 'minnpost_message_change_template_location' ) ) :
	add_filter( 'wp_message_inserter_change_template_location', 'minnpost_message_change_template_location', 10, 1 );
	function minnpost_message_change_template_location( $location ) {
		if ( 'email' === $location ) {
			$is_legacy = apply_filters( 'minnpost_largo_newsletter_legacy', false, '', get_the_ID() );
			if ( false === $is_legacy ) {
				return $location;
			} else {
				$location = 'email-legacy';
			}
		}
		return $location;
	}
endif;
