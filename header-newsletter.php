<?php
/**
 * The header for our newsletters
 *
 * This is the template that displays all of the header stuff for email templates
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MinnPost Largo
 */

?><!DOCTYPE html>
<html lang="en" xmlns="https://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<meta name="x-apple-disable-message-reformatting">
		<?php if ( false === $args['is_legacy'] ) : ?>
			<meta name="color-scheme" content="light dark">
			<meta name="supported-color-schemes" content="light dark">
			<style type="text/css">
			:root {
				color-scheme: light dark;
				supported-color-schemes: light dark;
			}
			</style>
			<style type="text/css">
				/****** EMAIL CLIENT BUG FIXES - BEST NOT TO CHANGE THESE ********/
				.ExternalClass {
					width: 100%;
				}
				/* Forces Outlook.com to display emails at full width */
				.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
				/* Forces Outlook.com to display normal line spacing, here is more on that: http://www.emailonacid.com/forum/viewthread/43/ */
				body {
					-webkit-text-size-adjust: none;
					-ms-text-size-adjust: none;
				}
				/* Prevents Webkit and Windows Mobile platforms from changing default font sizes. */
				html,
				body {
					margin: 0;
					padding: 0;
					border: 0;
					outline: 0;
				}
				/* Resets all body margins and padding to 0 for good measure */
				table td {
					border-collapse: collapse;
					border-spacing: 0px;
					border: 0px none;
					vertical-align: top;
				}
				/*This resolves the Outlook 07, 10, and Gmail td padding issue. Heres more info: http://www.ianhoar.com/2008/04/29/outlook-2007-borders-and-1px-padding-on-table-cells http://www.campaignmonitor.com/blog/post/3392/1px-borders-padding-on-table-cells-in-outlook-07 */
				/****** END BUG FIXES ********/
				/****** RESETTING DEFAULTS, IT IS BEST TO OVERWRITE THESE STYLES INLINE ********/
				body,
				#body_style {
					background: #fff;
					min-height: 1000px;
					color: #000;
					font-family: Arial, Helvetica, sans-serif;
					font-size: 14px;
				}
				/*The "body" is defined here for Yahoo Beta because it does not support your body tag. Instead, it will create a wrapper div around your email and that div will inherit your embedded body styles. The "#body_style" is defined for AOL because it does not support your embedded body definition nor your body tag, we will use this class in our wrapper div. The "min-height" attribute is used for AOL so that your background does not get cut off if your email is short. We are using universal styles for Outlook 2007, including them in the wrapper will not effect nested tables*/
				
				html,
				body {
					line-height: 1.2;
				}
				/* This looks insane, but all we're doing here is setting a default height for BRs because outlook.com doesn't support margin bottom. Other tags are reset to sensible defaults below... */
				
				/*p {
					font-size: 100px !important;
					font-family: cursive !important;
					color: green !important;
					background-color: magenta !important;
				}
				span {
					font-size: 15px;
					line-height: 1.2;
					margin: 0;
					padding: 0;
				}*/
				/* ...and seriously, never use p tags - outlook.com will drive you insane with its insistence on adding a 1.35em bottom margin (thanks Microsoft!) Use span to mark text areas, br's for spacing, and the line-height on html, body to set the height of those br's */
				
				h1,
				h2,
				h3,
				h4,
				h5,
				h6,
				p,
				i,
				b,
				a,
				ul,
				li,
				blockquote,
				hr,
				img,
				div,
				span,
				strong {
					line-height: 1.2;
					margin:0;
					padding:0;
				}
				/* A more sensible default for H1s */
				
				a,
				a:link {
					color: #2A5DB0;
					text-decoration: underline;
				}
				/* This is the embedded CSS link color for Gmail. This will overwrite Outlook.com and Yahoo Beta's embedded link colors and make it consistent with Gmail. You must overwrite this color inline */
				
				img {
					display: block;
					border: 0 none;
					outline: none;
					line-height: 100%;
					outline: none;
					text-decoration: none;
					vertical-align: bottom;
				}
				a img {
					border: 0 none;
				}
				/** Some email clients add space below images by default, which is problematic if you’re tiling images. Be aware that, by setting images to block-level elements, you can’t align them without resorting to the float or position CSS properties, which aren’t widely supported */
				
				small {
					font-size: 11px;
					line-height: 1.4;
				}
				small a {
					color: inherit;
					text-decoration: underline;
				}
				span.yshortcuts {
					color: #000;
					background-color: none;
					border: none;
				}
				span.yshortcuts:hover,
				span.yshortcuts:active,
				span.yshortcuts:focus {
					color: #000;
					background-color: none;
					border: none;
				}
				/*When Yahoo! Beta came out, we thought we could put those days behind us but we might have celebrated a little too soon. Here's more: http://www.emailonacid.com/blog/details/C13/yahoo_shortcuts_are_baaaaaaaack */
				/*Optional:*/
				
				a:visited {
					color: #3c96e2;
					text-decoration: none
				}
				a:focus {
					color: #3c96e2;
					text-decoration: underline
				}
				a:hover {
					color: #3c96e2;
					text-decoration: underline
				}
				/* There is no way to set these inline so you have the option of adding pseudo class definitions here. They won't work for Gmail nor older versions of Lotus Notes but its a nice addition for all other clients. */
				/*** EMBEDDED CSS NOTES *** 1.) Be aware that Gmail will not read any of your embedded CSS 2.) Although I have seen the !important priority used in other examples, it is not necessary. If you use "!important" you can no longer overwrite your styles inline which is required for Gmail. 3.) The Android does not support "class" declarations outside of the media query. Here is more info on that: http://www.emailonacid.com/blog/the_android_mail_app_and_css_class_declarations/ 4.) You might want to consider duplicating your embedded CSS after the closing body tag for Yahoo! Mail in IE7 & 8. *** END EMBEDDED CSS NOTES ***/
			</style>
		<?php endif; ?>
		<link rel="shortcut icon" href="<?php echo esc_url( get_theme_file_uri( '/assets/img/app-icons/favicon.ico' ) ); ?>" type="image/x-icon" />
		<meta property="og:title" content="<?php echo get_the_title(); ?> | <?php bloginfo( 'name' ); ?>">
		<title><?php echo get_the_title(); ?> | <?php bloginfo( 'name' ); ?></title>
		<!--[if mso]>
		<style type="text/css">
			table {border-collapse:collapse;border-spacing:0;margin:0;}
			div, td {padding:0;}
			div {margin:0 !important;}
		</style>
		<noscript>
		<xml>
			<o:OfficeDocumentSettings>
				<o:PixelsPerInch>96</o:PixelsPerInch>
			</o:OfficeDocumentSettings>
		</xml>
		</noscript>
		<![endif]-->
	</head>
	<body>
		<?php email_preview_text(); ?>
		<div class="o-email" role="article" aria-roledescription="email" lang="en">
