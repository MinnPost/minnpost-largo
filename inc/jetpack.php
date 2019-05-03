<?php
/**
 * Jetpack methods
 *
 * @package MinnPost Largo
 */

/**
* Enable sharing stories by email
*
* @return bool
*/
if ( ! function_exists( 'share_email_allowed' ) ) :
	add_filter( 'sharing_services_email', 'share_email_allowed' );
	function share_email_allowed() {
		return true;
	}
endif;

/**
* Remove share links that are automatically added
*
*/
if ( ! function_exists( 'jptweak_remove_share' ) ) :
	add_action( 'loop_start', 'jptweak_remove_share' );
	function jptweak_remove_share() {
		remove_filter( 'the_content', 'sharing_display', 19 );
		remove_filter( 'the_excerpt', 'sharing_display', 19 );
		if ( class_exists( 'Jetpack_Likes' ) ) {
			remove_filter( 'the_content', array( Jetpack_Likes::init(), 'post_likes' ), 30, 1 );
		}
	}
endif;

/**
* Remove count from share buttons
*
*/
add_filter( 'jetpack_sharing_counts', '__return_false' );

/**
* Edit markup for sharing
*
* @param string $sharing_content
*
* @return string $sharing_content
*/
if ( ! function_exists( 'share_content' ) ) :
	add_filter( 'jetpack_sharing_display_markup', 'share_content' );
	function share_content( $sharing_content ) {
		if ( ! is_user_logged_in() && ! empty( $sharing_content ) ) {
			$doc = new DOMDocument();
			libxml_use_internal_errors( true );
			$doc->loadHTML( $sharing_content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
			libxml_use_internal_errors( false );
			$finder    = new DomXPath( $doc );
			$classname = 'share-email';
			$elements  = $finder->query( "//li[contains(@class, '$classname')]" );
			$element   = $elements->item( 0 );

			$item = $doc->createDocumentFragment();
			$item->appendXML( '<li class="' . $classname . '"><a rel="nofollow" class="sd-button share-icon" href="' . site_url( '/user/login/?source=share_email&amp;redirect_to=' . get_permalink() ) . '"><span>Email</span></a></li>' );

			$element->parentNode->replaceChild( $item, $element );

			$sharing_content = $doc->saveHTML();
		}
		return $sharing_content;
	}
endif;

/**
* Message for users to log in to share a story by email
* This requires the User Account Management plugin
*
* @param string $message_info
* @param string $source
*
* @return string $message_info
*/
if ( ! function_exists( 'share_email_login_form_message_info' ) ) :
	add_filter( 'user_account_management_login_form_message_info', 'share_email_login_form_message_info', 10, 2 );
	function share_email_login_form_message_info( $message_info, $source = '' ) {
		if ( 'share_email' === $source ) {
			$message_info = 'After you log in, you can email the story.';
		}
		return $message_info;
	}
endif;

/**
* Hide the sharing box from edit pages
*/
if ( ! function_exists( 'minnpost_show_sharing_box' ) ) :
	add_filter( 'sharing_meta_box_show', 'minnpost_show_sharing_box' );
	function minnpost_show_sharing_box() {
		return false;
	}
endif;

// remove the open graph tags because we handle them in meta.php
add_filter( 'jetpack_enable_open_graph', '__return_false' );

/**
* Arguments for VIP Go image processing
* documentation at https://vip.wordpress.com/documentation/vip-go/images-on-vip-go/
*
* @param array $args
* @return array $args
*/
if ( ! function_exists( 'minnpost_largo_custom_photon' ) ) :
	add_filter( 'jetpack_photon_pre_args', 'minnpost_largo_custom_photon' );
	function minnpost_largo_custom_photon( $args ) {
		$args['strip'] = 'all';
		return $args;
	}
endif;
