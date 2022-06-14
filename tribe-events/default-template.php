<?php
/**
 * Default Events Template
 * This file is the basic wrapper template for all the views if 'Default Events Template'
 * is selected in Events -> Settings -> Display -> Events Template.
 * The only thing it does for us is load the single-event templates.
 *
 * This overrides the default the-events-calendar/views/default-template.php
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

tribe_get_view();
