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

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml">
		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
			<!--[if !mso]><!-->
				<meta http-equiv="X-UA-Compatible" content="IE=edge" />
			<!--<![endif]-->
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link rel="shortcut icon" href="https://www.minnpost.com/sites/default/themes/siteskin/favicon.ico" type="image/x-icon" />
			<!-- Facebook sharing information tags -->
			<meta property="og:title" content="<?php echo get_the_title(); ?> | <?php bloginfo( 'name' ); ?>">
			<title><?php echo get_the_title(); ?> | <?php bloginfo( 'name' ); ?></title>

			<style type="text/css">
			.webkit {
				max-width: 600px;
			}
			.ExternalClass {
				width: 100%;
			}
			.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
				line-height: 100%;
			}

			a[x-apple-data-detectors] {
				color: #801019 !important;
				text-decoration: none !important;
				font-size: inherit !important;
				font-family: inherit !important;
				font-weight: normal !important;
				line-height: inherit !important;
			}
			</style>

			<!--[if (gte mso 9)|(IE)]>
			<style type="text/css">
			.header table { font-size:1px; line-height:0; mso-Margin-top-alt:1px; }
			</style>
			<![endif]-->

		</head>
		<body style="background: #ffffff; Margin: 0; min-width: 100%; padding: 0" bgcolor="#ffffff">

