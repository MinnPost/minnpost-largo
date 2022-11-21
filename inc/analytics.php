<?php

if ( ! function_exists( 'minnpost_gtm4wp_wp_header_begin' ) ) :
    add_action( 'wp_head', 'minnpost_gtm4wp_wp_header_begin', 2, 0 );
    function minnpost_gtm4wp_wp_header_begin() {
        $output_container_code = true;
        if ( isset( $GLOBALS['gtm4wp_options'][ GTM4WP_OPTION_NOGTMFORLOGGEDIN ] ) ) {
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
        if ( true === $output_container_code ) :
            ?>
            <!-- minnpost template for environment-specific google tag manager and optimize -->
            <script>
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            '//www.googletagmanager.com/gtm.'+'js?id='+i+dl+'&gtm_auth=kVpcZKythZ8hbACxZyUNWA&gtm_preview=env-5&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','<?php echo defined( 'GTM4WP_GTM_TAG_ID' ) ? GTM4WP_GTM_TAG_ID : ""; ?>');
            </script>
            <?php if ( defined( 'GTM4WP_OPTIMIZE_CONTAINER_ID' ) ) : ?>
            <style>.async-hide { opacity: 0 !important} </style>
            <script>(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
            h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
            (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
            })(window,document.documentElement,'async-hide','dataLayer',4000,
            {'<?php echo defined( 'GTM4WP_OPTIMIZE_CONTAINER_ID' ) ? GTM4WP_OPTIMIZE_CONTAINER_ID : ""; ?>':true});</script>
            <!-- end minnpost template -->
            <?php endif;
        endif;
    }
endif;

if ( ! function_exists( 'minnpost_gtmcode_body_insert' ) ) :
    //add_action( 'wp_body_open', 'minnpost_gtmcode_body_insert', 5, 0 );
    function minnpost_gtmcode_body_insert() {
        if ( function_exists( 'gtm4wp_the_gtm_tag' ) ) {
            gtm4wp_the_gtm_tag();
        }
    }
endif;
