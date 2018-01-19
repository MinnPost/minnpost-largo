<?php

// default message

$msg = '';

$msg .= sprintf(
    __( 'Hi %1$s,%2$s', 'user-account-management' ),
    $attributes['user_data']->display_name,
    "\r\n\r\n"
);

$msg .= sprintf(
    __( 'Thanks for creating an account on %1$s! You can log in with your email address, %4$s%2$s, and your password, at %3$s. %4$sThere you can manage your account information and preferences. %4$s%4$sWe do not have access to your password, but you can reset it %4$son our site if you lose access to it.%5$s', 'user-account-management' ),
    $attributes['blogname'],
    $attributes['user_data']->user_email,
	$attributes['login_url'],
	"\r\n",
    "\r\n\r\n"
);

$msg .= sprintf(
    __( 'Thanks,%2$s%1$s%2$s', 'user-account-management' ),
    $attributes['blogname'],
    "\r\n"
);

echo $msg;
