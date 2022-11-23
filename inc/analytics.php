<?php

if ( ! function_exists( 'minnpost_gtm4wp_wp_header_begin' ) ) :
    add_action( 'wp_head', 'minnpost_gtm4wp_wp_header_begin', 2, 0 );
    function minnpost_gtm4wp_wp_header_begin() {
        $output_container_code = true;
        if ( defined( 'GTM4WP_OPTION_NOGTMFORLOGGEDIN' ) && isset( $GLOBALS['gtm4wp_options'][ GTM4WP_OPTION_NOGTMFORLOGGEDIN ] ) ) {
            $disabled_roles = explode( ',', (string) $GLOBALS['gtm4wp_options'][ GTM4WP_OPTION_NOGTMFORLOGGEDIN ] );
            if ( count( $disabled_roles ) > 0 ) {
                $current_user = wp_get_current_user();
                foreach ( $current_user->roles as $user_role ) {
                    if ( in_array( $user_role, $disabled_roles, true ) ) {
                        $output_container_code = false;

                        echo '
        <script>
            console.log && console.log("[GTM4WP] Google Tag Manager container code was disabled for this user role: ' . esc_js( $user_role ) . ' !!!");
            console.log && console.log("[GTM4WP] Logout or login with a user having a different user role!");
            console.log && console.log("[GTM4WP] Data layer codes are active but GTM container code is omitted !!!");
        </script>';

                        break;
                    }
                }
            }
        }
        if ( 'production' !== VIP_GO_ENV ) {
            $output_container_code = true;
        }

        if ( defined( 'GTM4WP_OPTION_GTM_CODE' ) && isset( $GLOBALS['gtm4wp_options'][ GTM4WP_OPTION_GTM_CODE ] ) ) {
            $_gtm_codes = explode( ',', str_replace( array( ';', ' ' ), array( ',', '' ), $GLOBALS['gtm4wp_options'][ GTM4WP_OPTION_GTM_CODE ] ) );
            foreach ( $_gtm_codes as $one_gtm_id ) {
                if ( preg_match( '/^GTM-[A-Z0-9]+$/', $one_gtm_id ) ) {
                    if ( true === $output_container_code ) :
                        ?>
                        <!-- minnpost template for environment-specific google tag manager -->
                        <script>
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        '//www.googletagmanager.com/gtm.'+'js?id='+i+dl+'&gtm_auth=<?php echo defined( 'GTM4WP_GTM_AUTH' ) ? GTM4WP_GTM_AUTH : ""; ?>&gtm_preview=<?php echo defined( 'GTM4WP_GTM_PREVIEW' ) ? GTM4WP_GTM_PREVIEW : ""; ?>&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','<?php echo esc_attr( $one_gtm_id ); ?>');
                        </script>
                        <?php
                    endif;
                }
            }
        }
    }
endif;

if ( ! function_exists( 'minnpost_gtmcode_body_insert' ) ) :
    add_action( 'wp_body_open', 'minnpost_gtmcode_body_insert', 10, 0 );
    function minnpost_gtmcode_body_insert() {
        if ( defined( 'GTM4WP_OPTION_GTM_CODE' ) && isset( $GLOBALS['gtm4wp_options'][ GTM4WP_OPTION_GTM_CODE ] ) ) {
            $_gtm_codes = explode( ',', str_replace( array( ';', ' ' ), array( ',', '' ), $GLOBALS['gtm4wp_options'][ GTM4WP_OPTION_GTM_CODE ] ) );
            foreach ( $_gtm_codes as $one_gtm_id ) {
                if ( preg_match( '/^GTM-[A-Z0-9]+$/', $one_gtm_id ) ) {
        ?>
        <!-- GTM Container placement set to off -->
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=<?php echo esc_attr( $one_gtm_id ); ?>&amp;gtm_auth=<?php echo defined( 'GTM4WP_GTM_AUTH' ) ? GTM4WP_GTM_AUTH : ""; ?>&amp;gtm_preview=<?php echo defined( 'GTM4WP_GTM_PREVIEW' ) ? GTM4WP_GTM_PREVIEW : ""; ?>&amp;gtm_cookies_win=x" height="0" width="0" style="display:none;visibility:hidden" aria-hidden="true"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
        <?php
                }
            }
        }
    }
endif;

if ( ! function_exists( 'minnpost_custom_dataLayer' ) ) :
    add_filter( 'gtm4wp_compile_datalayer', 'minnpost_custom_dataLayer' );
    function minnpost_custom_dataLayer( $data_layer ) {
        /* syntax is like this:
        $data_layer['variableName'] = value
        */
        // get user's membership status.
		if ( function_exists( 'minnpost_membership' ) ) {
			$minnpost_membership = minnpost_membership();
			$user_id             = get_current_user_id();
			if ( 0 !== $user_id ) {
				$user_state = $minnpost_membership->user_info->user_member_level( $user_id )['name'];
				if ( 'Non-member' === $user_state ) {
					$value = 'Logged In Non-Member';
				} else {
					$value = get_bloginfo( 'name' ) . ' ' . $user_state;
				}
			} else {
				$value = 'Not Logged In';
			}
			$data_layer['membershipStatus'] = $value;
		}

        // get post's author list from co-authors-plus.
        if ( is_singular() ) {
            if ( function_exists( 'coauthors' ) ) {
                $data_layer['pagePostAuthor'] = coauthors( ',', null, null, null, false );
            }
        }

        return $data_layer;
    }
endif;
