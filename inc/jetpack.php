<?php
/**
 * Jetpack methods
 *
 * @package MinnPost Largo
 */

// sharing by email
if ( ! function_exists( 'share_email_allowed' ) ) :
	add_filter( 'sharing_services_email', 'share_email_allowed' );
	function share_email_allowed() {
		return true;
	}
endif;

// where sharing does not go
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

if ( ! function_exists( 'share_content' ) ) :
	add_filter( 'jetpack_sharing_display_markup', 'share_content' );
	function share_content( $sharing_content ) {
		if ( ! is_user_logged_in() && ! empty( $sharing_content ) ) {
			$doc = new DOMDocument();
			$doc->loadHTML( $sharing_content );
			$finder = new DomXPath( $doc );
			$classname = 'share-email';
			$elements = $finder->query( "//li[contains(@class, '$classname')]" );
			$element = $elements->item( 0 );
			//$element->nodeValue = '<strong>what man</strong>';
			$item = $doc->createDocumentFragment();
			$item->appendXML( '<li class="' . $classname . '"><a rel="nofollow" class="sd-button share-icon" href="' . site_url( '/user/login/?source=share_email&amp;redirect_to=https://minnpost-wordpress.test/politics-policy/2017/11/we-ve-learned-how-survive-amid-allegations-women-describe-toxic-culture-minn/' ) . '"><span>Email</span></a></li>' );
			//$element->appendChild( $frag );
			$element->parentNode->replaceChild( $item, $element );

			$sharing_content = $doc->saveHTML();
		}
		return $sharing_content;
	}
endif;

if ( ! function_exists( 'share_email_login_form_message_info' ) ) :
	add_filter( 'user_account_management_login_form_message_info', 'share_email_login_form_message_info', 10, 2 );
	function share_email_login_form_message_info( $message_info, $source = '' ) {
		if ( 'share_email' === $source ) {
			$message_info = 'After you log in, you can email the story.';
		}
		return $message_info;
	}
endif;
