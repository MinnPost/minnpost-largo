<?php
/**
 * Create custom fields
 *
 * Currently this uses the Carbon Fields plugin
 *
 * @link https://github.com/htmlburger/carbon-fields
 *
 * @package MinnPost Largo
 */


/**
 * Define methods to use
 */
use Carbon_Fields\Container;
use Carbon_Fields\Field;


/**
 * Category properties
 *
 * @uses show_on_taxonomy()
 * @uses add_fields()
 * @uses Field::make()
 */
Container::make('term_meta', 'Category Properties')
    ->show_on_taxonomy('category')
    ->add_fields(array(
        Field::make('text', 'crb_deck', 'Deck'),
        Field::make('rich_text', 'crb_excerpt', 'Excerpt'),
        Field::make('rich_text', 'crb_sponsorship', 'Sponsorship'),
        Field::make('image', 'crb_thumbnail', 'Category Thumbnail'),
        Field::make('image', 'crb_main_image', 'Category Main Image'),
        Field::make('rich_text', 'crb_body', 'Body'),
    )
);