<?php

// default message

$msg  = __( 'Hello!', 'user-account-management' ) . "\r\n\r\n";
$msg .= sprintf( __( 'You asked us to reset your password for your account using the email address %s.', 'user-account-management' ), $attributes['user_login'] ) . "\r\n\r\n";
$msg .= __( "If this was a mistake, or you didn't ask for a password reset, just ignore this email and nothing will happen.", 'user-account-management' ) . "\r\n\r\n";
$msg .= sprintf( __( 'To reset your password, visit the following address: %s', 'user-account-management' ), $attributes['reset_url'] ) . "\r\n\r\n";
$msg .= __( 'Thanks!', 'user-account-management' ) . "\r\n";

echo $msg;
