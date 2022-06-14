<?php
/**
 * Robots.txt methods
 * Outputs at /robots.txt
 *
 * @package MinnPost Largo
 */

/**
 * Nofollow for non-production domains
 *
 * @param array $args
 * @return array $args
 */
if ( ! function_exists( 'minnpost_largo_domain_nofollow' ) ) :
	add_action( 'do_robotstxt', 'minnpost_largo_domain_nofollow' );
	function minnpost_largo_domain_nofollow() {
		if ( VIP_GO_ENV !== 'production' ) {
			echo 'User-agent: *' . PHP_EOL;
			echo 'Disallow: /' . PHP_EOL;
		}
	}
endif;
