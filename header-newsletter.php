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
		
		<link rel="shortcut icon" href="<?php echo esc_url( get_theme_file_uri( '/assets/img/app-icons/favicon.ico' ) ); ?>" type="image/x-icon" />
		<meta property="og:title" content="<?php echo get_the_title(); ?> | <?php bloginfo( 'name' ); ?>">
		<title><?php echo get_the_title(); ?> | <?php bloginfo( 'name' ); ?></title>
		<!--[if mso]>
		<noscript>
			<xml>
				<o:OfficeDocumentSettings>
					<o:PixelsPerInch>96</o:PixelsPerInch>
				</o:OfficeDocumentSettings>
			</xml>
		</noscript>
		<![endif]-->
	</head>
	<body class="body">
		<?php email_preview_text(); ?>
		<div class="o-email">
