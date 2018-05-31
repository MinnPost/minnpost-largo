<?php
/**
 * MinnPost popup settings
 *
 * @package MinnPost Largo
 */

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
* Modify the conditions that control when users see popups
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
		$conditions['is_logged_in']     = array(
			'group'    => __( 'User', 'minnpost-largo' ),
			'name'     => __( 'User: Logged In', 'minnpost-largo' ),
			'callback' => 'is_user_logged_in',
			'priority' => 1,
		);
		$conditions['is_member']        = array(
			'group'    => __( 'User', 'minnpost-largo' ),
			'name'     => __( 'User: Is Member', 'minnpost-largo' ),
			'callback' => 'minnpost_user_is_member',
			'priority' => 2,
		);
		$conditions['has_role']         = array(
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
			'priority' => 2,
		);
		$conditions['benefit_eligible'] = array(
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
* Get roles as options for the <select>
*
* @return array $roles
*/
if ( ! function_exists( 'minnpost_popup_roles' ) ) :
	function minnpost_popup_roles() {
		static $roles = null;

		if ( null === $roles ) {
			$roles          = array();
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
				'partner_offers' => 'Partner Offers',
				'fan_club'       => 'Fan Club',
			);
		}
		return $benefits;
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
