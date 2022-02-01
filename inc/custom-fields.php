<?php
/**
 * Create custom fields for standard and custom content types.
 * Currently this uses the CMB2 plugin
 * @link https://github.com/WebDevStudios/CMB2
 *
 * @package MinnPost Largo
 */

// cmb2_init is the hook that works on rest api; cmb2_admin_init does not; there doesn't seem to be any difference in how often the hooks run though

/**
* Newsletter fields
* Even though this is a custom type, it does not currently depend on any plugins aside from CMB2
*
*/
if ( function_exists( 'create_newsletter' ) ) :
	// speed up the post loading for newsletters a little
	if ( is_admin() ) {
		add_action( 'load-post-new.php', 'check_current_screen' );
		add_action( 'load-post.php', 'check_current_screen' );
	}
	function check_current_screen() {
		$screen = get_current_screen();
		$type   = $screen->post_type;
		if ( 'newsletter' === $type ) {
			add_action( 'pre_get_posts', 'newsletter_pre_get_posts' );
		}
	}
	function newsletter_pre_get_posts( WP_Query $wp_query ) {
		if ( in_array( $wp_query->get( 'post_type' ), array( 'post' ), true ) ) {
			$wp_query->set( 'update_post_meta_cache', false );
		}
	}

	/**
	* CMB2 custom fields for newsletters
	*
	* @param array $conditionals
	* @return array $conditionals
	*/
	add_action( 'cmb2_init', 'cmb2_newsletter_fields' );
	function cmb2_newsletter_fields() {

		$object_type = 'newsletter';
		$prefix      = '_mp_newsletter_';

		/**
		 * Newsletter setup
		 */
		$newsletter_setup = new_cmb2_box(
			array(
				'id'           => $prefix . 'setup',
				'title'        => __( 'Setup', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'after_title',
				//'priority'     => 'high',
			)
		);
		$newsletter_setup->add_field(
			array(
				'name'    => __( 'Newsletter Type', 'minnpost-largo' ),
				'id'      => $prefix . 'type',
				'type'    => 'select',
				'desc'    => __( 'Select an option', 'minnpost-largo' ),
				'default' => 'daily',
				'options' => minnpost_largo_email_types(),
			)
		);
		$newsletter_setup->add_field(
			array(
				'name'       => __( 'Display date, welcome message, and preview text or teaser instead of default republication teaser?', 'minnpost-largo' ),
				'id'         => $prefix . 'republication_newsletter_override_teaser',
				'type'       => 'checkbox',
				'desc'       => sprintf(
					// translators: 1) the default republication teaser.
					'<p>' . esc_html__( 'The default republication teaser and preview text is: ', 'minnpost-largo' ) . '</p>' . '<p>%1$s</p>' . '<p>' . esc_html__( 'If you check this box, this edition of the republication newsletter will instead use the preview text and teaser settings that the other newsletter types use.', 'minnpost-largo' ) . '</p>',
					( function_exists( 'minnpost_get_republication_newsletter_teaser' ) ? minnpost_get_republication_newsletter_teaser() : '' )
				),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => 'republication',
				),
			)
		);
		$newsletter_setup->add_field(
			array(
				'name'         => __( 'Preview Text', 'minnpost-largo' ),
				'id'           => $prefix . 'preview_text',
				'type'         => 'textarea_small',
				'char_counter' => true,
				'char_max'     => 140,
				'desc'         => __( 'This text is displayed between the date and the "Welcome to..." message at the top of the newsletter. It is also displayed after the subject line in some email clients. You can also add the text for those clients only by using the Preview Text field when you add the Subject Line to your campaign in Mailchimp. It is limited to 140 characters.<br><br>If you need the newsletter teaser text to be longer or have special formatting, see "Introduction" below.', 'minnpost-largo' ),
			)
		);
		$newsletter_setup->add_field(
			array(
				'name'       => __( 'Remove author(s) from display?', 'minnpost-largo' ),
				'id'         => '_mp_remove_author_from_display',
				'type'       => 'checkbox',
				'desc'       => __( 'If checked, the newsletter author(s) will not display.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => 'daily_coronavirus',
				),
			)
		);

		/**
		 * Introduction
		 */
		$newsletter_introduction_options = new_cmb2_box(
			array(
				'id'           => $prefix . 'introduction',
				'title'        => __( 'Introduction', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'after_title',
				'closed'       => false,
			)
		);
		$newsletter_introduction_options->add_field(
			array(
				'name'       => __( 'Intro Text', 'minnpost-largo' ),
				'id'         => $prefix . 'newsletter_teaser',
				'type'       => 'wysiwyg',
				'options'    => array(
					'media_buttons' => false, // show insert/upload button(s)
					'textarea_rows' => 15,
					'teeny'         => false, // keep the formatting toolbar and such
				),
				'desc'       => __( 'Use this field if you need a longer introduction or formatting in the introduction. Note: this will not be displayed in the "preview text" that is shown after the subject line in some email clients. You still need to fill out the "Preview Text" field above to have preview text.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review', 'artscape' ) ),
				),
			)
		);
		$newsletter_introduction_options->add_field(
			array(
				'name'       => __( 'Do Not Add Automatic Date and Newsletter Type Text', 'minnpost-largo' ),
				'id'         => $prefix . 'do_not_show_automatic_teaser_items',
				'type'       => 'checkbox',
				'desc'       => __( 'If you check this box, the newsletter introduction will not contain an automatic date, and will not state what type of newsletter this is.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
			)
		);
		$newsletter_introduction_options->add_field(
			array(
				'name'       => __( 'Do Not Show Any Teaser Text', 'minnpost-largo' ),
				'id'         => $prefix . 'do_not_show_teaser_text',
				'type'       => 'checkbox',
				'desc'       => __( 'If you check this box, no intro text will be shown in the body of the email. If there is a preview text value, it will only be shown before the email is opened.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
			)
		);

		/**
		 * For posts on newsletters
		 */
		$recent_newsletter_args = array(
			'posts_per_page' => 1,
			'numberposts'    => 1,
			'orderby'        => 'modified',
			'order'          => 'DESC',
			'post_type'      => $object_type,
			'post_status'    => 'any',
		);
		$most_recent_newsletter = wp_get_recent_posts( $recent_newsletter_args, OBJECT );
		if ( isset( $most_recent_newsletter[0] ) && is_object( $most_recent_newsletter[0] ) ) {
			$most_recent_newsletter_modified = $most_recent_newsletter[0]->post_modified;
		} else {
			$most_recent_newsletter_modified = strtotime( time() );
		}
		$newsletter_post_args = array(
			'posts_per_page' => -1,
			'post_type'      => array( 'post' ),
			'orderby'        => 'modified',
			'order'          => 'DESC',
			'post_status'    => 'any',
			'date_query'     => array(
				array(
					'column' => 'post_modified',
					'after'  => $most_recent_newsletter_modified,
				),
			),
		);
		if ( 'production' === VIP_GO_ENV ) {
			$newsletter_post_args['es'] = true; // elasticsearch on production only
		}
		$top_section = new_cmb2_box(
			array(
				'id'           => $prefix . 'top_section',
				'title'        => __( 'Top Post', 'minnpost-largo' ),
				'object_types' => array( $object_type ), // Post type
				'context'      => 'after_title',
				'priority'     => 'high',
				'show_names'   => true, // Show field names on the left
				'classes'      => 'cmb2-newsletter-section cmb2-newsletter-section-daily cmb2-newsletter-section-greater_mn cmb2-newsletter-section-sunday_review',
				'attributes'   => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
			)
		);
		$top_section->add_field(
			array(
				'name'       => __( 'Section Title', 'minnpost-largo' ),
				'id'         => $prefix . 'top_section_title',
				'type'       => 'text',
				'desc'       => __( 'The default value will be used if you do not change it.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
				'default'    => __( 'Top story', 'minnpost-largo' ),
			)
		);
		$top_section->add_field(
			minnpost_post_search_field(
				array(
					'name'       => __( 'Story', 'minnpost-largo' ),
					'desc'       => __( 'Search for a post here.', 'minnpost-largo' ),
					'id'         => $prefix . 'top_post',
					'query_args' => array(
						'orderby'     => 'modified',
						'order'       => 'DESC',
						'post_status' => 'any',
					),
					'attributes' => array(
						'data-conditional-id'    => $prefix . 'type',
						'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
					),
				),
				'post_search_ajax'
			)
		);
		$top_section->add_field(
			array(
				'name'       => __( 'Story Manual Override', 'minnpost-largo' ),
				'id'         => $prefix . 'top_post_override',
				'type'       => 'text',
				'desc'       => __( 'Use this field if the search is not working. Enter a post ID, and the newsletter template will use it instead of the search field value.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
			)
		);

		$news_section = new_cmb2_box(
			array(
				'id'           => $prefix . 'news_section',
				'title'        => __( 'News Posts', 'minnpost-largo' ),
				'object_types' => array( $object_type ), // Post type
				'context'      => 'after_title',
				'priority'     => 'high',
				'show_names'   => true, // Show field names on the left
				'classes'      => 'cmb2-newsletter-section cmb2-newsletter-section-daily cmb2-newsletter-section-greater_mn cmb2-newsletter-section-sunday_review',
				'attributes'   => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
			)
		);
		$news_section->add_field(
			array(
				'name'       => __( 'Section Title', 'minnpost-largo' ),
				'id'         => $prefix . 'news_section_title',
				'type'       => 'text',
				'desc'       => __( 'The default value will be used if you do not change it.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
				'default'    => __( 'More news', 'minnpost-largo' ),
			)
		);
		$news_section->add_field(
			minnpost_post_search_field(
				array(
					'name'       => __( 'Stories', 'minnpost-largo' ),
					'desc'       => __( 'Search for posts here.', 'minnpost-largo' ),
					'id'         => $prefix . 'news_posts',
					'query_args' => array(
						'orderby'     => 'modified',
						'order'       => 'DESC',
						'post_status' => 'any',
					),
					'attributes' => array(
						'data-conditional-id'    => $prefix . 'type',
						'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
					),
				),
				'post_search_ajax'
			)
		);
		$news_section->add_field(
			array(
				'name'       => __( 'Stories Manual Override', 'minnpost-largo' ),
				'id'         => $prefix . 'news_posts_override',
				'type'       => 'text',
				'desc'       => __( 'Use this field if the search is not working. Enter a comma separated list of post IDs, and the newsletter template will use them instead of the search field value.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
			)
		);

		$opinion_section = new_cmb2_box(
			array(
				'id'           => $prefix . 'opinion_section',
				'title'        => __( 'Opinion Posts', 'minnpost-largo' ),
				'object_types' => array( $object_type ), // Post type
				'context'      => 'after_title',
				'priority'     => 'high',
				'show_names'   => true, // Show field names on the left
				'classes'      => 'cmb2-newsletter-section cmb2-newsletter-section-daily cmb2-newsletter-section-greater_mn cmb2-newsletter-section-sunday_review',
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
			)
		);
		$opinion_section->add_field(
			array(
				'name'       => __( 'Section Title', 'minnpost-largo' ),
				'id'         => $prefix . 'opinion_section_title',
				'type'       => 'text',
				'desc'       => __( 'The default value will be used if you do not change it.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
				'default'    => __( 'Commentary and opinion', 'minnpost-largo' ),
			)
		);
		$opinion_section->add_field(
			minnpost_post_search_field(
				array(
					'name'       => __( 'Stories', 'minnpost-largo' ),
					'desc'       => __( 'Search for posts here.', 'minnpost-largo' ),
					'id'         => $prefix . 'opinion_posts',
					'query_args' => array(
						'orderby'     => 'modified',
						'order'       => 'DESC',
						'post_status' => 'any',
					),
					'attributes' => array(
						'data-conditional-id'    => $prefix . 'type',
						'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
					),
				),
				'post_search_ajax'
			)
		);
		$opinion_section->add_field(
			array(
				'name'       => __( 'Stories Manual Override', 'minnpost-largo' ),
				'id'         => $prefix . 'opinion_posts_override',
				'type'       => 'text',
				'desc'       => __( 'Use this field if the search is not working. Enter a comma separated list of post IDs, and the newsletter template will use them instead of the search field value.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
			)
		);

		$editors_section = new_cmb2_box(
			array(
				'id'           => $prefix . 'editors_section',
				'title'        => __( 'Editor\'s Picks Posts', 'minnpost-largo' ),
				'object_types' => array( $object_type ), // Post type
				'context'      => 'after_title',
				'priority'     => 'high',
				'show_names'   => true, // Show field names on the left
				'classes'      => 'cmb2-newsletter-section cmb2-newsletter-section-daily cmb2-newsletter-section-greater_mn cmb2-newsletter-section-sunday_review',
				'attributes'   => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
			)
		);
		$editors_section->add_field(
			array(
				'name'       => __( 'Section Title', 'minnpost-largo' ),
				'id'         => $prefix . 'editors_section_title',
				'type'       => 'text',
				'desc'       => __( 'The default value will be used if you do not change it.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
				'default'    => __( 'MinnPost recommends', 'minnpost-largo' ),
			)
		);
		$editors_section->add_field(
			minnpost_post_search_field(
				array(
					'name'       => __( 'Stories', 'minnpost-largo' ),
					'desc'       => __( 'Search for posts here. If you do not add any, the newsletter will use the posts from the Newsletter Recommended Stories zone.', 'minnpost-largo' ),
					'id'         => $prefix . 'editors_posts',
					'query_args' => array(
						'orderby'     => 'modified',
						'order'       => 'DESC',
						'post_status' => 'any',
					),
					'attributes' => array(
						'data-conditional-id'    => $prefix . 'type',
						'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
					),
				),
				'post_search_ajax'
			)
		);
		$editors_section->add_field(
			array(
				'name'       => __( 'Stories Manual Override', 'minnpost-largo' ),
				'id'         => $prefix . 'editors_posts_override',
				'type'       => 'text',
				'desc'       => __( 'Use this field if the search above is not working. Enter a comma separated list of post IDs, and the newsletter template will use them instead of the search field value.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
			)
		);
		$editors_section->add_field(
			array(
				'name'       => __( 'Use Other Section Settings', 'minnpost-largo' ),
				'id'         => $prefix . 'editors_use_other_section_settings',
				'type'       => 'checkbox',
				'desc'       => __( 'If checked, this section will behave like the above sections instead. Individual stories can override this behavior.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
			)
		);
		$editors_section->add_field(
			array(
				'name'       => __( 'Remove This Section', 'minnpost-largo' ),
				'id'         => $prefix . 'remove_editors_section',
				'type'       => 'checkbox',
				'desc'       => __( 'If checked, this section will be removed from this edition of this newsletter, regardless of what posts are in the zone or the fields above.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
			)
		);
		$artscape_section = new_cmb2_box(
			array(
				'id'           => $prefix . 'artscape_section',
				'title'        => __( 'Artscape Newsletter Content', 'minnpost-largo' ),
				'object_types' => array( $object_type ), // Post type
				'context'      => 'after_title',
				'priority'     => 'high',
				'show_names'   => true, // Show field names on the left
				'classes'      => 'cmb2-newsletter-section cmb2-newsletter-section-artscape',
				'attributes'   => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'artscape' ) ),
				),
			)
		);
		$artscape_section->add_field(
			array(
				'name'             => __( 'Image Size', 'minnpost-largo' ),
				'id'               => $prefix . 'image_for_artscape_stories',
				'type'             => 'select',
				'show_option_none' => false,
				'desc'             => __( 'The value for this field will be used for image placement on artscape newsletters.', 'minnpost-largo' ),
				'default'          => 'thumb',
				'options'          => array(
					'none'       => __( 'No images', 'minnpost-largo' ),
					'thumb'      => __( 'Thumbnail on all stories', 'minnpost-largo' ),
					'full'       => __( 'Large on all stories', 'minnpost-largo' ),
					'full-first' => __( 'Large on the first story, none on subsequent stories', 'minnpost-largo' ),
				),
			)
		);
		$artscape_section->add_field(
			array(
				'name'       => __( 'Section Title', 'minnpost-largo' ),
				'id'         => $prefix . 'artscape_section_title',
				'type'       => 'text',
				'desc'       => __( 'The default value will be used if you do not change it.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'artscape' ) ),
				),
				'default'    => __( 'This week in Artscape', 'minnpost-largo' ),
			)
		);
		$artscape_section->add_field(
			minnpost_post_search_field(
				array(
					'name'       => __( 'Artscape Stories', 'minnpost-largo' ),
					'desc'       => __( 'Search for a post here.', 'minnpost-largo' ),
					'id'         => $prefix . 'artscape_posts',
					'query_args' => array(
						'orderby'     => 'modified',
						'order'       => 'DESC',
						'post_status' => 'any',
					),
					'attributes' => array(
						'data-conditional-id'    => $prefix . 'type',
						'data-conditional-value' => 'artscape',
					),
				),
				'post_search_ajax'
			)
		);

		$republication_section = new_cmb2_box(
			array(
				'id'           => $prefix . 'republication_section',
				'title'        => __( 'Republication Newsletter Content', 'minnpost-largo' ),
				'object_types' => array( $object_type ), // Post type
				'context'      => 'after_title',
				'priority'     => 'high',
				'show_names'   => true, // Show field names on the left
				'closed'       => true,
				'attributes'   => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'republication' ) ),
				),
			)
		);
		$republication_section->add_field(
			array(
				'name'             => __( 'Image Size', 'minnpost-largo' ),
				'id'               => $prefix . 'image_for_republish_stories',
				'type'             => 'select',
				'show_option_none' => false,
				'desc'             => __( 'The value for this field will be used for image placement on republication newsletters.', 'minnpost-largo' ),
				'default'          => 'thumb',
				'options'          => array(
					'none'       => __( 'No images', 'minnpost-largo' ),
					'thumb'      => __( 'Thumbnail on all stories', 'minnpost-largo' ),
					'full'       => __( 'Large on all stories', 'minnpost-largo' ),
					'full-first' => __( 'Large on the first story, none on subsequent stories', 'minnpost-largo' ),
				),
			)
		);
		$republication_section->add_field(
			minnpost_post_search_field(
				array(
					'name'       => __( 'Republishable Stories', 'minnpost-largo' ),
					'desc'       => __( 'Search for a post here.', 'minnpost-largo' ),
					'id'         => $prefix . 'republishable_posts',
					'query_args' => array(
						'orderby'     => 'modified',
						'order'       => 'DESC',
						'post_status' => 'any',
					),
					'attributes' => array(
						'data-conditional-id'    => $prefix . 'type',
						'data-conditional-value' => 'republication',
					),
				),
				'post_search_ajax'
			)
		);
		/*$republication_section->add_field(
			array(
				'name'        => __( 'Preview of Upcoming Stories', 'minnpost-largo' ),
				'id'          => $prefix . 'upcoming',
				'type'        => 'wysiwyg',
				'options'     => array(
					'media_buttons' => false, // show insert/upload button(s)
					'textarea_rows' => 5,
					'teeny'         => true, // output the minimal editor config used in Press This
				),
				'desc'        => __( 'Use this to describe upcoming stories for this edition.', 'minnpost-largo' ),
				'attributes'  => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => 'republication',
				),
				'after_field' => '<input name="asdf" type="hidden" data-conditional-id="' . $prefix . 'type' . '" data-conditional-value="republication">', // hack to fix the condtional display
			)
		);*/

		// legacy
		$legacy_newsletter_posts = new_cmb2_box(
			array(
				'id'           => $prefix . 'top_posts',
				'title'        => __( 'Legacy Newsletter Content', 'minnpost-largo' ),
				'object_types' => array( $object_type ), // Post type
				'context'      => 'normal',
				'priority'     => 'high',
				'show_names'   => true, // Show field names on the left
				'closed'       => true,
			)
		);
		$legacy_newsletter_posts->add_field(
			minnpost_post_search_field(
				array(
					'name'       => __( 'Top Stories', 'minnpost-largo' ),
					'desc'       => __( 'Search for a post here.', 'minnpost-largo' ),
					'id'         => $prefix . 'top_posts',
					'query_args' => array(
						'orderby'     => 'modified',
						'order'       => 'DESC',
						'post_status' => 'any',
					),
					'attributes' => array(
						'data-conditional-id'    => $prefix . 'type',
						'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
					),
				),
				'post_search_ajax'
			)
		);
		$legacy_newsletter_posts->add_field(
			array(
				'name'       => __( 'Top Stories Manual Override', 'minnpost-largo' ),
				'id'         => $prefix . 'top_posts_override',
				'type'       => 'text',
				'desc'       => __( 'Use this field if the search is not working. Enter a comma separated list of post IDs, and the newsletter template will use them in the order they are entered instead of the search field value.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
			)
		);
		$legacy_newsletter_posts->add_field(
			minnpost_post_search_field(
				array(
					'name'       => __( 'More Stories', 'minnpost-largo' ),
					'desc'       => __( 'Search for a post here.', 'minnpost-largo' ),
					'id'         => $prefix . 'more_posts',
					'query_args' => array(
						'orderby'     => 'modified',
						'order'       => 'DESC',
						'post_status' => 'any',
					),
					'attributes' => array(
						'data-conditional-id'    => $prefix . 'type',
						'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
					),
				)
			)
		);
		$legacy_newsletter_posts->add_field(
			array(
				'name'       => __( 'More Stories Manual Override', 'minnpost-largo' ),
				'id'         => $prefix . 'more_posts_override',
				'type'       => 'text',
				'desc'       => __( 'Use this field if the search is not working. Enter a comma separated list of post IDs, and the newsletter template will use them in the order they are entered instead of the search field value.', 'minnpost-largo' ),
				'attributes' => array(
					'data-conditional-id'    => $prefix . 'type',
					'data-conditional-value' => wp_json_encode( array( 'daily', 'greater_mn', 'sunday_review' ) ),
				),
			)
		);
	}
endif;

add_action( 'cmb2_after_form', 'minnpost_largo_after_newsletter_section_output', 10, 4 );
function minnpost_largo_after_newsletter_section_output( $cmb_id, $object_id, $object_type, $cmb ) {
	$object_type = 'newsletter';
	$prefix      = '_mp_newsletter_';
	// Only output above the _yourprefix_demo_metabox metabox.
	$newsletter_sections = array(
		$prefix . 'top_section'      => esc_html__( 'The default behavior for this section is: 1) Image is full size. 2) There is a teaser on the story. Use the Newsletter Settings section of the story to change this behavior.', 'minnpost-largo' ),
		$prefix . 'news_section'     => esc_html__( 'The default behavior for this section is: 1) Image is full size on the first story in a section. 2) There is a teaser on each story. Use the Newsletter Settings section of each story to change how the story behaves.', 'minnpost-largo' ),
		$prefix . 'opinion_section'  => esc_html__( 'The default behavior for this section is: 1) Image is full size on the first story in a section. 2) There is a teaser on each story. Use the Newsletter Settings section of each story to change how the story behaves.', 'minnpost-largo' ),
		$prefix . 'editors_section'  => esc_html__( 'The default behavior for this section is: stories will display with no image or teaser. The "Use Other Section Settings" checkbox will cause this section to behave, by default, like the above sections instead. Then you can use the Newsletter Settings section of each story to change how that story behaves.', 'minnpost-largo' ),
		$prefix . 'artscape_section' => esc_html__( 'The default behavior for this section is: stories will display with a small thumbnail image and a teaser. You can use the Newsletter Settings section of each story to change how that story behaves.', 'minnpost-largo' ),
	);
	if ( ! in_array( $cmb_id, array_keys( $newsletter_sections ), true ) ) {
		return;
	}

	$after = '<p class="description">' . $newsletter_sections[ $cmb_id ] . '</p>';
	echo $after;
}


/**
* Post fields
*
*/

/**
* Remove featured images from theme
* We do this because we use the CMB2 file field for post images, instead of the built in featured image
* This is kind of unfortunate, but it is necessary at least in this design.
*
*/
if ( ! function_exists( 'remove_featured_images_from_child_theme' ) ) :
	add_action( 'after_setup_theme', 'remove_featured_images_from_child_theme', 11 );
	function remove_featured_images_from_child_theme() {
		remove_theme_support( 'post-thumbnails' );
		//add_theme_support( 'post-thumbnails', array( 'post' ) );
	}
endif;

/**
 * Remove the default WordPress excerpt field.
 */
function minnpost_largo_admin_hide_excerpt_field() {
	add_action( 'add_meta_boxes', '_minnpost_largo_admin_hide_excerpt_field' );
}
add_filter( 'admin_init', 'minnpost_largo_admin_hide_excerpt_field' );
function _minnpost_largo_admin_hide_excerpt_field() {
	$screen = get_current_screen();
	if ( isset( $screen->post_type ) && 'post' === $screen->post_type || 'tribe_events' === $screen->post_type ) {
		remove_meta_box( 'postexcerpt', null, 'normal' );
	}
}

/**
 * Override the WordPress Excerpt field
 */
add_filter( 'cmb2_override_excerpt_meta_value', 'minnpost_largo_override_excerpt_display', 10, 2 );
function minnpost_largo_override_excerpt_display( $data, $post_id ) {
	return get_post_field( 'post_excerpt', $post_id );
}

/*
 * WP will handle the saving for us, so don't save to meta.
 */
add_filter( 'cmb2_override_excerpt_meta_save', '__return_true' );

/**
* Add custom fields to posts
*
*/
if ( ! function_exists( 'cmb2_post_fields' ) ) :

	add_action( 'cmb2_init', 'cmb2_post_fields' );
	function cmb2_post_fields() {

		$object_type = 'post';

		/**
		 * Excerpt settings
		 */
		$excerpt = new_cmb2_box(
			array(
				'id'           => 'cmb2_excerpt',
				'title'        => __( 'Excerpt', 'minnpost-largo' ),
				'object_types' => array( $object_type ), // Post type
				'context'      => 'after_editor',
				'priority'     => 'high',
				'show_names'   => false,
			)
		);
		$excerpt->add_field(
			array(
				'id'        => 'excerpt',
				'name'      => __( 'Excerpt', 'minnpost-largo' ),
				'desc'      => '',
				'type'      => 'wysiwyg',
				'escape_cb' => false,
				'options'   => array(
					'media_buttons' => false, // show insert/upload button(s)
					'textarea_rows' => 5,
					'teeny'         => true, // output the minimal editor config used in Press This
				),
			)
		);

		/**
		 * Subtitle settings
		 */
		$subtitle_settings = new_cmb2_box(
			array(
				'id'           => 'subtitle_settings',
				'title'        => __( 'Byline & Subtitle Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$subtitle_settings->add_field(
			array(
				'name' => __( 'After Multiple Authors', 'minnpost-largo' ),
				'id'   => '_mp_subtitle_settings_after_authors',
				'type' => 'text',
				'desc' => __( 'Proceeded by a |, this value will display right after the authors if there are more than one. For example, to show "Tom Nehil and Greta Kaul | MinnPost Staff," put "MinnPost Staff" into this field.', 'minnpost-largo' ),
			)
		);
		$subtitle_settings->add_field(
			array(
				'name' => __( 'Byline', 'minnpost-largo' ),
				'id'   => '_mp_subtitle_settings_byline',
				'type' => 'text',
				'desc' => __( 'This value will override any authors associated with this post.', 'minnpost-largo' ),
			)
		);
		$subtitle_settings->add_field(
			array(
				'name' => __( 'Deck', 'minnpost-largo' ),
				'id'   => '_mp_subtitle_settings_deck',
				'type' => 'text',
			)
		);

		/**
		 * SEO and social meta settings
		 */
		$seo_settings = new_cmb2_box(
			array(
				'id'           => 'seo_settings',
				'title'        => 'SEO &amp; Social Settings',
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$seo_settings->add_field(
			array(
				'name'         => 'Title',
				'id'           => '_mp_seo_title',
				'type'         => 'text',
				'char_counter' => true,
				'char_max'     => 78,
				'desc'         => sprintf(
					// translators: 1) the sitename
					esc_html__( 'If you do not fill this out, the post title will be used. If you do fill it out and do not include %1$s in the value, it will be placed at the end in this way: Your Title | %1$s' ),
					get_bloginfo( 'name' )
				),
				'attributes'   => array(
					'maxlength' => 78, // retrieved from https://seopressor.com/blog/google-title-meta-descriptions-length/ on 9/27/2018
				),
			)
		);
		$seo_settings->add_field(
			array(
				'name'         => 'Description',
				'id'           => '_mp_seo_description',
				'type'         => 'textarea_small',
				'char_counter' => true,
				'char_max'     => 200,
				'attributes'   => array(
					'maxlength' => 200, // 155 is the number, but it's ok to go higher as long as the spider sees the most important stuff at the beginning. retrieved from https://moz.com/blog/how-to-write-meta-descriptions-in-a-changing-world on 5/8/2020
				),
				'desc'         => esc_html__( 'When using this field, make sure the most important text is in the first 155 characters to ensure that Google can see it. If you do not fill it out, the post excerpt will be used.' ),
			)
		);
		$seo_settings->add_field(
			array(
				'name'         => esc_html__( 'Meta images', 'minnpost-largo' ),
				'desc'         => esc_html__( 'Using this field will remove images that are uploaded to this story from the story\'s metadata, and replace them with the images in this field.', 'minnpost-largo' ),
				'id'           => '_mp_social_images',
				'type'         => 'file_list',
				'preview_size' => array( 130, 85 ),
				// query_args are passed to wp.media's library query.
				'query_args'   => array(
					'type' => 'image',
				),
			)
		);

		/**
		 * Image settings
		 */
		$image_settings = new_cmb2_box(
			array(
				'id'           => $object_type . '_image_settings',
				'title'        => __( 'Image Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$image_settings->add_field(
			array(
				'name'         => __( 'Thumbnail Image', 'minnpost-largo' ),
				'desc'         => __( 'Upload an image or enter an URL.', 'minnpost-largo' ),
				'id'           => '_mp_post_thumbnail_image',
				'type'         => 'file',
				'preview_size' => array( 130, 85 ),
				'options'      => array(
					//'url' => false, // Hide the text input for the url
				),
				'text'         => array(
					//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
				),
				// query_args are passed to wp.media's library query.
				'query_args'   => array(
					'type' => 'image',
				),
			)
		);
		$image_settings->add_field(
			array(
				'name'             => __( 'Homepage Image Size', 'minnpost-largo' ),
				'id'               => '_mp_post_homepage_image_size',
				'type'             => 'select',
				'show_option_none' => true,
				'desc'             => __( 'Select an option', 'minnpost-largo' ),
				'default'          => 'feature-large',
				'options'          => array(
					'feature-medium' => __( 'Medium', 'minnpost-largo' ),
					'none'           => __( 'Do not display image', 'minnpost-largo' ),
					'feature-large'  => __( 'Large', 'minnpost-largo' ),
					'full'           => __( 'Full size', 'minnpost-largo' ),
				),
			)
		);
		$image_settings->add_field(
			array(
				'name'             => __( 'Homepage Image Position', 'minnpost-largo' ),
				'id'               => '_mp_post_homepage_image_position',
				'type'             => 'radio_inline',
				'show_option_none' => false,
				'desc'             => __( 'Pick whether the image should go before or after the text. If before, it will be flush left on large screens, unless it is too wide. If after, it will be flush right, unless it is too wide.', 'minnpost-largo' ),
				'default'          => 'after',
				'options'          => array(
					'before' => __( 'Before', 'minnpost-largo' ),
					'after'  => __( 'After', 'minnpost-largo' ),
				),
			)
		);
		$image_settings->add_field(
			array(
				'name'         => __( 'Main Image', 'minnpost-largo' ),
				'desc'         => __( 'Upload an image or enter an URL.', 'minnpost-largo' ),
				'id'           => '_mp_post_main_image',
				'type'         => 'file',
				'preview_size' => array( 130, 85 ),
				'options'      => array(
					//'url' => false, // Hide the text input for the url
				),
				'text'         => array(
					//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
				),
				// query_args are passed to wp.media's library query.
				'query_args'   => array(
					'type' => 'image',
				),
			)
		);

		/**
		 * Display settings
		 */
		$display_settings = new_cmb2_box(
			array(
				'id'           => $object_type . '_display_settings',
				'title'        => __( 'Display Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Prevent lazy loading of images?', 'minnpost-largo' ),
				'id'   => '_mp_prevent_lazyload',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not attempt to lazy load images.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Load HTML editor by default?', 'minnpost-largo' ),
				'id'   => '_mp_post_use_html_editor',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will open with the HTML editor visible.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Remove category from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_category_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not display its categories.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Replace category text', 'minnpost-largo' ),
				'id'   => '_mp_replace_category_text',
				'type' => 'text',
				'desc' => __( 'This text will show in place of the category name(s).', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Remove title from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_title_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, the post title will not display.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Remove excerpt from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_excerpt_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, the post excerpt will not display.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Remove author(s) from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_author_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, the post author(s) will not display.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Remove deck from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_deck_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, any deck content will be ignored.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Remove date from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_date_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, the post date will not display.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Remove newsletter signup from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_newsletter_signup_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not have a newsletter signup box.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Remove share buttons from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_share_buttons_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, share buttons will not display on this post.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Keep share buttons horizontal on large screens', 'minnpost-largo' ),
				'id'   => '_mp_share_buttons_always_horizontal',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will have horizontal share buttons above the post content, rather than vertical ones next to it, on large screens. This is similar to its mobile behavior.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Remove republish button from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_republish_button_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, the republication button will not display on this post, regardless of the other share button settings.', 'minnpost-largo' ),
			)
		);

		/**
		 * Newsletter Display settings
		 */
		$newsletter_settings = new_cmb2_box(
			array(
				'id'           => $object_type . '_post_newsletter_settings',
				'title'        => __( 'Newsletter Display Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$newsletter_settings->add_field(
			array(
				'name' => __( 'Prevent excerpt display?', 'minnpost-largo' ),
				'id'   => '_mp_post_newsletter_prevent_excerpt',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not display with an excerpt when it is included in a newsletter. By default, the excerpt will show except in the Editor\'s Picks section.', 'minnpost-largo' ),
			)
		);
		$newsletter_settings->add_field(
			array(
				'name' => __( 'Use SEO title?', 'minnpost-largo' ),
				'id'   => '_mp_post_newsletter_use_seo_title',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will use the SEO Title value when it is included in a newsletter, if there is one. Follow the guidelines for that value in the SEO & Social Settings section. If there is no value for the SEO title, the post will use its standard title even if this box is checked.', 'minnpost-largo' ),
			)
		);
		$newsletter_settings->add_field(
			array(
				'name' => __( 'Use SEO description?', 'minnpost-largo' ),
				'id'   => '_mp_post_newsletter_use_seo_description',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will use the SEO Description value when it is included in a newsletter, if there is one. Follow the guidelines for that value in the SEO & Social Settings section. If there is no value for the SEO description, the post will use its standard excerpt even if this box is checked.', 'minnpost-largo' ),
			)
		);
		$newsletter_settings->add_field(
			array(
				'name'             => __( 'Image Size', 'minnpost-largo' ),
				'id'               => '_mp_post_newsletter_image_size',
				'type'             => 'select',
				'show_option_none' => false,
				'desc'             => __( 'If selected, the image size will be used for this post regardless of where it is in the newsletter post order. By default, the Editor\'s Picks section has no image. In other sections, the default behavior is to use the Full size image for the first post, then to use no image for subsequent posts.', 'minnpost-largo' ),
				'default'          => 'default',
				'options'          => array(
					'none'    => __( 'None', 'minnpost-largo' ),
					'default' => __( 'Default for the section', 'minnpost-largo' ),
					'full'    => __( 'Full size', 'minnpost-largo' ),
				),
			)
		);

		/**
		 * Ad & Sponsorship settings
		 */
		$ad_settings = new_cmb2_box(
			array(
				'id'           => $object_type . '_ad_settings',
				'title'        => __( 'Ad & Sponsorship Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$ad_settings->add_field(
			array(
				'name' => __( 'Prevent automatic embed ads?', 'minnpost-largo' ),
				'id'   => '_mp_prevent_automatic_ads',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not contain automatic embed ads.', 'minnpost-largo' ),
			)
		);
		$ad_settings->add_field(
			array(
				'name' => __( 'Prevent all embed ads?', 'minnpost-largo' ),
				'id'   => '_mp_prevent_ads',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not contain any embed ads.', 'minnpost-largo' ),
			)
		);
		$ad_settings->add_field(
			array(
				'name' => __( 'Prevent lazy loading of embed ads?', 'minnpost-largo' ),
				'id'   => 'arcads_dfp_acm_provider_post_prevent_lazyload',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not attempt to lazy load embed ads.', 'minnpost-largo' ),
			)
		);
		$ad_settings->add_field(
			array(
				'name'    => __( 'Sponsorship', 'minnpost-largo' ),
				'id'      => '_mp_post_sponsorship',
				'type'    => 'wysiwyg',
				'desc'    => __( 'This field overrides a sponsorship message from the category or tag that contains a post.', 'minnpost-largo' ),
				'options' => array(
					'media_buttons' => false, // show insert/upload button(s)
					'textarea_rows' => 5,
					'teeny'         => true, // output the minimal editor config used in Press This
				),
			)
		);
		$ad_settings->add_field(
			array(
				'name' => __( 'Prevent sponsorship display', 'minnpost-largo' ),
				'id'   => '_mp_prevent_post_sponsorship',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not display any sponsorship message, regardless of its tags or categories.', 'minnpost-largo' ),
			)
		);

		/**
		 * Sidebar settings
		 */
		$sidebar_settings = new_cmb2_box(
			array(
				'id'           => $object_type . '_sidebar_options',
				'title'        => __( 'Sidebar Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$sidebar_settings->add_field(
			array(
				'name' => __( 'Remove whole right sidebar from this post?', 'minnpost-largo' ),
				'id'   => '_mp_remove_right_sidebar',
				'type' => 'checkbox',
				'desc' => '',
			)
		);
		$sidebar_settings->add_field(
			array(
				'name' => __( 'Remove whole right sidebar from this post? (V2)', 'minnpost-largo' ),
				'id'   => '_mp_remove_right_sidebar_v2',
				'type' => 'checkbox',
				'desc' => '',
			)
		);
		$sidebar_settings->add_field(
			array(
				'name' => __( 'Sidebar Content Box', 'minnpost-largo' ),
				'desc' => __( 'Content for a single right sidebar box', 'minnpost-largo' ),
				'id'   => '_mp_post_sidebar',
				'type' => 'wysiwyg',
			)
		);

		/**
		 * Related content settings
		 */
		$related_settings = new_cmb2_box(
			array(
				'id'           => $object_type . '_related_content_options',
				'title'        => __( 'Related Content Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$related_settings->add_field(
			array(
				'name' => __( 'Prevent related content?', 'minnpost-largo' ),
				'id'   => '_mp_prevent_related_content',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not contain any related content. This prevents manual and automated recommendations, as well as "more ___ articles" links, from showing within the related content area.', 'minnpost-largo' ),
			)
		);
		$related_settings->add_field(
			array(
				'name' => __( 'Related Content Label', 'minnpost-largo' ),
				'id'   => '_mp_related_content_label',
				'type' => 'text',
				'desc' => sprintf(
					// translators: 1) the default label for related items
					esc_html__( 'This text will show as a heading above the Related Content items. If you leave it blank, it will say %1$s.', 'minnpost-largo' ),
					esc_html__( 'Read these stories next', 'minnpost-largo' )
				),
			)
		);
		$related_settings->add_field(
			minnpost_post_search_field(
				array(
					'name'       => __( 'Related Content', 'minnpost-largo' ),
					'desc'       => __( 'Search for a post here. If any posts are selected, they will override automated recommendations.', 'minnpost-largo' ),
					'id'         => '_mp_related_content',
					'query_args' => array(
						'nopaging' => true,
					),
				)
			)
		);
		$related_settings->add_field(
			array(
				'name' => __( 'Show related posts on homepage?', 'minnpost-largo' ),
				'id'   => '_mp_related_content_on_listing',
				'type' => 'checkbox',
				'desc' => __( 'If checked, and if this post is the lead story on the homepage, this post will list the above related content posts as related coverage. Each story will display its SEO Title value if there is one. Otherwise it will display its normal title.', 'minnpost-largo' ),
			)
		);
		$related_settings->add_field(
			minnpost_post_search_field(
				array(
					'name'       => __( 'Related Multimedia', 'minnpost-largo' ),
					'desc'       => __( 'Search for a post here. If any posts are selected, they will override automated recommendations.', 'minnpost-largo' ),
					'id'         => '_mp_related_multimedia',
					'query_args' => array(
						'nopaging' => true,
					),
				)
			)
		);
		$related_settings->add_field(
			array(
				'name'       => __( 'Link to a related category', 'minnpost-largo' ),
				'desc'       => __( 'Search for a category here. If present, it will override the default category based on the permalink.', 'minnpost-largo' ),
				'id'         => '_mp_related_category',
				'type'       => 'term_ajax_search',
				'query_args' => array(
					'taxonomy' => 'category', //Enter Taxonomy Slug
					'default'  => '',
				),
			)
		);
		$related_settings->add_field(
			array(
				'name'       => __( 'Link to a related tag', 'minnpost-largo' ),
				'desc'       => __( 'Search for a tag here.', 'minnpost-largo' ),
				'id'         => '_mp_related_tag',
				'type'       => 'term_ajax_search',
				'query_args' => array(
					'taxonomy' => 'post_tag', //Enter Taxonomy Slug
					'default'  => '',
				),
			)
		);

		/**
		 * Membership content settings
		 * This depends on the Blocked Content Template plugin, which is called in get_member_levels()
		 */
		$member_content_settings = new_cmb2_box(
			array(
				'id'           => $object_type . '_member_content_options',
				'title'        => __( 'Member Content Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$member_content_settings->add_field(
			array(
				'name'             => __( 'Lowest access level', 'minnpost-largo' ),
				'id'               => '_access_level',
				'type'             => 'select',
				'desc'             => __( 'If this content is restricted, select the lowest level that can access it.', 'minnpost-largo' ),
				'show_option_none' => true,
				'default'          => '',
				'options'          => get_member_levels(),
			)
		);
		$member_content_settings->add_field(
			array(
				'name'             => __( 'MinnPost+ icon style', 'minnpost-largo' ),
				'id'               => '_mp_plus_icon_style',
				'type'             => 'select',
				'desc'             => __( 'Which MP+ icon to overlay on the thumbnails', 'minnpost-largo' ),
				'show_option_none' => true,
				'default'          => '',
				'options'          => array(
					'mp_plus_blackonwhite'       => __( 'Black on White', 'minnpost-largo' ),
					'mp_plus_whiteonblack'       => __( 'White on Black', 'minnpost-largo' ),
					'mp_plus_whiteonred'         => __( 'White on Red', 'minnpost-largo' ),
					'mp_plus_whiteontransparent' => __( 'White on Transparent', 'minnpost-largo' ),
				),
			)
		);

	}
endif;

/**
* Add custom fields to pages
*
*/
if ( ! function_exists( 'cmb2_page_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_page_fields' );
	function cmb2_page_fields() {

		$object_type = 'page';

		$excerpt = new_cmb2_box(
			array(
				'id'           => $object_type . '_excerpt',
				'title'        => __( 'Excerpt', 'minnpost-largo' ),
				'object_types' => array( $object_type ), // Post type
				'context'      => 'after_editor',
				'priority'     => 'high',
				'show_names'   => false,
			)
		);
		$excerpt->add_field(
			array(
				'id'        => 'excerpt',
				'name'      => __( 'Excerpt', 'minnpost-largo' ),
				'desc'      => __( 'By default, this is only used as the description for search results. But we can also configure its use in other ways. For example, the Commenting Policy excerpt is used at the top of our comments list.', 'minnpost-largo' ),
				'type'      => 'wysiwyg',
				'escape_cb' => false,
				'options'   => array(
					'media_buttons' => false, // show insert/upload button(s)
					'textarea_rows' => 5,
					'teeny'         => true, // output the minimal editor config used in Press This
				),
			)
		);

		/**
		 * SEO and social meta settings
		 */
		$seo_settings = new_cmb2_box(
			array(
				'id'           => $object_type . '_seo_settings',
				'title'        => 'SEO &amp; Social Settings',
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$seo_settings->add_field(
			array(
				'name'         => 'Title',
				'id'           => '_mp_seo_title',
				'type'         => 'text',
				'char_counter' => true,
				'char_max'     => 78,
				'desc'         => sprintf(
					// translators: 1) the sitename
					esc_html__( 'If you do not fill this out, the page title will be used. If you do fill it out and do not include %1$s in the value, it will be placed at the end in this way: Your Title | %1$s' ),
					get_bloginfo( 'name' )
				),
				'attributes'   => array(
					'maxlength' => 78, // retrieved from https://seopressor.com/blog/google-title-meta-descriptions-length/ on 9/27/2018
				),
			)
		);
		$seo_settings->add_field(
			array(
				'name'         => 'Description',
				'id'           => '_mp_seo_description',
				'type'         => 'textarea_small',
				'char_counter' => true,
				'char_max'     => 200,
				'attributes'   => array(
					'maxlength' => 200, // 155 is the number, but it's ok to go higher as long as the spider sees the most important stuff at the beginning. retrieved from https://moz.com/blog/how-to-write-meta-descriptions-in-a-changing-world on 5/8/2020
				),
				'desc'         => esc_html__( 'When using this field, make sure the most important text is in the first 155 characters to ensure that Google can see it. If you do not fill it out, the page excerpt will be used.' ),
			)
		);

		/**
		 * Page settings
		 */
		$page_settings = new_cmb2_box(
			array(
				'id'           => 'page_settings',
				'title'        => __( 'Page Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'low',
				'closed'       => true,
			)
		);
		$page_settings->add_field(
			array(
				'name' => __( 'Pre-title text', 'minnpost-largo' ),
				'id'   => '_mp_replace_category_text',
				'type' => 'text',
				'desc' => __( 'This text will show above the title', 'minnpost-largo' ),
			)
		);
		$page_settings->add_field(
			array(
				'name' => __( 'Remove title from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_title_from_display',
				'type' => 'checkbox',
				'desc' => '',
			)
		);

		$page_sidebar = new_cmb2_box(
			array(
				'id'           => $object_type . '_sidebar_options',
				'title'        => __( 'Sidebar Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'low',
				'closed'       => true,
			)
		);
		$page_sidebar->add_field(
			array(
				'name' => __( 'Remove whole right sidebar from this page?', 'minnpost-largo' ),
				'id'   => '_mp_remove_right_sidebar',
				'type' => 'checkbox',
				'desc' => '',
			)
		);
		$page_sidebar->add_field(
			array(
				'name' => __( 'Remove whole right sidebar from this page? (V2)', 'minnpost-largo' ),
				'id'   => '_mp_remove_right_sidebar_v2',
				'type' => 'checkbox',
				'desc' => '',
			)
		);
		$page_sidebar->add_field(
			array(
				'name' => __( 'Sidebar Content Box', 'minnpost-largo' ),
				'desc' => __( 'Content for a single right sidebar box', 'minnpost-largo' ),
				'id'   => '_mp_post_sidebar',
				'type' => 'wysiwyg',
			)
		);
		$page_sidebar->add_field(
			array(
				'name' => __( 'Prevent lazy loading of images?', 'minnpost-largo' ),
				'id'   => '_mp_prevent_lazyload',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this page will not attempt to lazy load images.', 'minnpost-largo' ),
			)
		);
	}
endif;


/**
* Add custom fields to categories
*
*/
if ( ! function_exists( 'cmb2_category_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_category_fields' );
	function cmb2_category_fields() {

		$object_type = 'term';

		/**
		 * Category settings
		 */
		$category_setup = new_cmb2_box(
			array(
				'id'               => 'category_properties',
				'title'            => __( 'Category Settings', 'minnpost-largo' ),
				'object_types'     => array( $object_type ),
				'taxonomies'       => array( 'category' ),
				'new_term_section' => false, // will display in add category sidebar
			)
		);
		// for news/opinion/arts/sponsored content display
		$group_categories = minnpost_largo_category_groups();
		$category_id      = '';
		if ( isset( $_GET['tag_ID'] ) ) {
			$category_id = absint( $_GET['tag_ID'] );
		} elseif ( isset( $_POST['tag_ID'] ) ) {
			$category_id = absint( $_POST['tag_ID'] );
		}
		$category   = get_category( $category_id );
		$is_current = false;
		if ( isset( $category->slug ) ) {
			$is_current = in_array( $category->slug, $group_categories, true );
		}
		if ( ! $is_current ) {
			$category_setup->add_field(
				array(
					'name'             => __( 'Category Group', 'minnpost-largo' ),
					'id'               => '_mp_category_group',
					'type'             => 'radio_inline',
					'desc'             => __( 'Puts this category into this group. If Opinion or Sponsored Content is the group, this category will be excluded from automated story recommendations.', 'minnpost-largo' ),
					'classes'          => 'cmb2-match-admin-width',
					'options'          => minnpost_largo_category_group_options(),
					'show_option_none' => true,
				)
			);
		}
		// for news/opinion/sponsored content display
		$category_setup->add_field(
			array(
				'name'              => __( 'Grouped Categories', 'minnpost-largo' ),
				'id'                => '_mp_category_grouped_categories',
				'type'              => 'multicheck',
				'desc'              => __( 'If this category is used to group other categories, they will be checked here, as well as indicated on that category\'s settings page.', 'minnpost-largo' ),
				'classes'           => 'cmb2-category-multicheck cmb2-match-admin-width',
				'options'           => minnpost_largo_grouped_categories(),
				'select_all_button' => false,
			)
		);
		// text fields
		$category_setup->add_field(
			array(
				'name'    => __( 'Excerpt', 'minnpost-largo' ),
				'id'      => '_mp_category_excerpt',
				'type'    => 'wysiwyg',
				'options' => array(
					'media_buttons' => false, // show insert/upload button(s)
					'textarea_rows' => 5,
					'teeny'         => true, // output the minimal editor config used in Press This
				),
			)
		);
		$category_setup->add_field(
			array(
				'name'    => __( 'Sponsorship', 'minnpost-largo' ),
				'id'      => '_mp_category_sponsorship',
				'type'    => 'wysiwyg',
				'options' => array(
					'media_buttons' => false, // show insert/upload button(s)
					'textarea_rows' => 5,
					'teeny'         => true, // output the minimal editor config used in Press This
				),
			)
		);
		// image fields
		$category_setup->add_field(
			array(
				'name'       => __( 'Category Thumbnail', 'minnpost-largo' ),
				'id'         => '_mp_category_thumbnail_image',
				'type'       => 'file',
				'query_args' => array(
					'type' => 'image',
				),
			)
		);
		$category_setup->add_field(
			array(
				'name'       => __( 'Category Main Image', 'minnpost-largo' ),
				'id'         => '_mp_category_main_image',
				'type'       => 'file',
				// query_args are passed to wp.media's library query.
				'query_args' => array(
					'type' => 'image',
				),
			)
		);
		// main body field
		$category_setup->add_field(
			array(
				'name'    => __( 'Body', 'minnpost-largo' ),
				'id'      => '_mp_category_body',
				'type'    => 'wysiwyg',
				'options' => array(
					'media_buttons' => false, // show insert/upload button(s)
					'teeny'         => false, // output the minimal editor config used in Press This
				),
			)
		);
		$category_setup->add_field(
			array(
				'name' => __( 'Prevent lazy loading of image?', 'minnpost-largo' ),
				'id'   => '_mp_prevent_lazyload',
				'type' => 'checkbox',
				'desc' => __( 'If checked, the image for this category will not be lazy loaded.', 'minnpost-largo' ),
			)
		);
		$category_setup->add_field(
			array(
				'name'              => __( 'Featured Columns', 'minnpost-largo' ),
				'id'                => '_mp_category_featured_columns',
				'type'              => 'multicheck',
				'classes'           => 'cmb2-category-multicheck',
				'options'           => minnpost_largo_featured_column_options(),
				'select_all_button' => false,
			)
		);
	}

endif;

/**
* Add custom fields to tags
*
*/
if ( ! function_exists( 'cmb2_tag_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_tag_fields' );
	function cmb2_tag_fields() {

		$object_type = 'term';

		/**
		 * Tag settings
		 */
		$tag_setup = new_cmb2_box(
			array(
				'id'               => 'tag_properties',
				'title'            => __( 'Tag Settings', 'minnpost-largo' ),
				'object_types'     => array( $object_type ),
				'taxonomies'       => array( 'post_tag' ),
				'new_term_section' => false, // will display in add category sidebar
			)
		);
		// text fields
		$tag_setup->add_field(
			array(
				'name'    => __( 'Excerpt', 'minnpost-largo' ),
				'id'      => '_mp_tag_excerpt',
				'type'    => 'wysiwyg',
				'options' => array(
					'media_buttons' => false, // show insert/upload button(s)
					'textarea_rows' => 5,
					'teeny'         => true, // output the minimal editor config used in Press This
				),
			)
		);
		$tag_setup->add_field(
			array(
				'name'    => __( 'Sponsorship', 'minnpost-largo' ),
				'id'      => '_mp_tag_sponsorship',
				'type'    => 'wysiwyg',
				'options' => array(
					'media_buttons' => false, // show insert/upload button(s)
					'textarea_rows' => 5,
					'teeny'         => true, // output the minimal editor config used in Press This
				),
			)
		);
		// image fields
		$tag_setup->add_field(
			array(
				'name'       => __( 'Tag Thumbnail', 'minnpost-largo' ),
				'id'         => '_mp_tag_thumbnail_image',
				'type'       => 'file',
				'query_args' => array(
					'type' => 'image',
				),
			)
		);
		$tag_setup->add_field(
			array(
				'name'       => __( 'Tag Main Image', 'minnpost-largo' ),
				'id'         => '_mp_tag_main_image',
				'type'       => 'file',
				// query_args are passed to wp.media's library query.
				'query_args' => array(
					'type' => 'image',
				),
			)
		);
		// main body field
		$tag_setup->add_field(
			array(
				'name'    => __( 'Body', 'minnpost-largo' ),
				'id'      => '_mp_tag_body',
				'type'    => 'wysiwyg',
				'options' => array(
					'media_buttons' => false, // show insert/upload button(s)
					'teeny'         => false, // output the minimal editor config used in Press This
				),
			)
		);
		$tag_setup->add_field(
			array(
				'name' => __( 'Prevent lazy loading of image?', 'minnpost-largo' ),
				'id'   => '_mp_prevent_lazyload',
				'type' => 'checkbox',
				'desc' => __( 'If checked, the image for this tag will not be lazy loaded.', 'minnpost-largo' ),
			)
		);
	}

endif;

/**
* Remove the default description from categories and tags
* We do this because we have a whole body field for them; it is a wysiwyg field
*
*/
if ( ! function_exists( 'remove_default_category_tag_description' ) ) :
	add_action( 'admin_head', 'remove_default_category_tag_description' );
	function remove_default_category_tag_description() {
		global $current_screen;
		if ( 'edit-category' === $current_screen->id || 'edit-post_tag' === $current_screen->id ) { ?>
			<script>
			jQuery(function($) {
				$('textarea#description, textarea#tag-description').closest('tr.form-field, div.form-field').remove();
			});
			</script>
			<?php
		}
	}
endif;

/**
* Array of categories for grouped categories
* @return $options
*
*/
if ( ! function_exists( 'minnpost_largo_grouped_categories' ) ) :
	function minnpost_largo_grouped_categories() {
		// categories that can be grouped with this category
		$options = array();
		if ( is_admin() && ( isset( $_GET['taxonomy'] ) && 'category' === sanitize_key( $_GET['taxonomy'] ) && isset( $_GET['tag_ID'] ) ) || isset( $_POST['tag_ID'] ) && 'category' === sanitize_key( $_POST['taxonomy'] ) ) {

			if ( isset( $_GET['tag_ID'] ) ) {
				$category_id = absint( $_GET['tag_ID'] );
			} elseif ( isset( $_POST['tag_ID'] ) ) {
				$category_id = absint( $_POST['tag_ID'] );
			}

			$categories = get_terms(
				array(
					'taxonomy'   => 'category',
					'hide_empty' => false,
				)
			);
			foreach ( $categories as $category ) {
				if ( isset( $category_id ) && $category_id !== $category->term_id ) {
					$options[ $category->term_id ] = $category->name;
				}
			}
		}
		return $options;
	}
endif;

/**
* Get the grouped categories for the given category
* @param array $data
* @param string $object_id
* @param array $args
* @param object $field
* @return $value
*
*/
if ( ! function_exists( 'minnpost_largo_get_grouped_categories' ) ) :
	add_filter( 'cmb2_override__mp_category_grouped_categories_meta_value', 'minnpost_largo_get_grouped_categories', 10, 4 );
	function minnpost_largo_get_grouped_categories( $data, $object_id, $args, $field ) {
		if ( is_admin() && ( isset( $_GET['taxonomy'] ) && 'category' === sanitize_key( $_GET['taxonomy'] ) && isset( $_GET['tag_ID'] ) ) || isset( $_POST['tag_ID'] ) && 'category' === sanitize_key( $_POST['taxonomy'] ) ) {
			$value   = array();
			$cat_ids = array_keys( $field->args['options'] );
			if ( ! empty( $cat_ids ) ) {
				foreach ( $cat_ids as $cat_id ) {
					if ( isset( $args['id'] ) && $args['id'] !== $cat_id ) {
						$category_group = get_term_meta( $cat_id, '_mp_category_group', true );
						if ( '' !== $category_group ) {
							if ( $category_group === $args['id'] ) {
								$value[] = $cat_id;
							}
						}
					}
				}
			}
			return $value;
		}
	}
endif;

/**
* Set the grouped categories for the given category
* @param bool $override
* @param array $args
* @param array $field_args
* @param object $field
* @return int|WP_Error|bool $updated
*
*/
if ( ! function_exists( 'minnpost_largo_set_grouped_categories' ) ) :
	add_filter( 'cmb2_override__mp_category_grouped_categories_meta_save', 'minnpost_largo_set_grouped_categories', 10, 4 );
	function minnpost_largo_set_grouped_categories( $override, $args, $field_args, $field ) {
		if ( is_admin() && ( isset( $_GET['taxonomy'] ) && 'category' === sanitize_key( $_GET['taxonomy'] ) && isset( $_GET['tag_ID'] ) ) || isset( $_POST['tag_ID'] ) && 'category' === sanitize_key( $_POST['taxonomy'] ) ) {

			if ( isset( $_GET['tag_ID'] ) ) {
				$category_id = absint( $_GET['tag_ID'] );
			} elseif ( isset( $_POST['tag_ID'] ) ) {
				$category_id = absint( $_POST['tag_ID'] );
			}

			$cat_ids = $args['value']; // this should be an array of category ids
			if ( ! empty( $cat_ids ) ) {
				foreach ( $cat_ids as $cat_id ) {
					$updated = update_term_meta( $cat_id, '_mp_category_group', $category_id );
				}
			}

			return ! ! $updated;
		}
	}
endif;

/**
* Manage admin columns for categories
* @param array $category_columns
* @return array $category_columns
*
*/
if ( ! function_exists( 'minnpost_largo_manage_category_columns' ) ) :
	add_filter( 'manage_edit-category_columns', 'minnpost_largo_manage_category_columns', 10, 2 );
	function minnpost_largo_manage_category_columns( $category_columns ) {
		$category_columns['_mp_category_group'] = __( 'Category Group', 'minnpost-largo' );
		return $category_columns;
	}
endif;

/**
* Add data to admin columns for categories
* @param string $string is blank
* @param string $column_name
* @param int $term_id
*
*/
if ( ! function_exists( 'minnpost_largo_manage_category_custom_fields' ) ) :
	add_filter( 'manage_category_custom_column', 'minnpost_largo_manage_category_custom_fields', 10, 3 );
	function minnpost_largo_manage_category_custom_fields( $string, $column_name, $term_id ) {
		if ( '_mp_category_group' === $column_name ) {
			$category_group_id = get_term_meta( $term_id, $column_name, true );
			if ( '' !== $category_group_id ) {
				$category = get_the_category_by_ID( $category_group_id );
				echo $category;
			}
		}
	}
endif;

/**
* Array of categories for featured columns
* This is deprecated
* @return $options
*
*/
if ( ! function_exists( 'minnpost_largo_featured_column_options' ) ) :
	function minnpost_largo_featured_column_options() {
		// featured columns that appear on categories
		$options = array();
		if ( is_admin() && ( isset( $_GET['taxonomy'] ) && 'category' === sanitize_key( $_GET['taxonomy'] ) && isset( $_GET['tag_ID'] ) ) || isset( $_POST['tag_ID'] ) && 'category' === sanitize_key( $_POST['taxonomy'] ) ) {

			if ( isset( $_GET['tag_ID'] ) ) {
				$category_id = absint( $_GET['tag_ID'] );
			} elseif ( isset( $_POST['tag_ID'] ) ) {
				$category_id = absint( $_POST['tag_ID'] );
			}

			$categories = get_terms(
				array(
					'taxonomy'   => 'category',
					'hide_empty' => false,
				)
			);
			foreach ( $categories as $category ) {
				if ( isset( $category_id ) && $category_id !== $category->term_id ) {
					$options[ $category->term_id ] = $category->name;
				}
			}
		}
		return $options;
	}
endif;

/**
* Store the category slugs for the group categories
* @return $choices
*
*/
if ( ! function_exists( 'minnpost_largo_category_groups' ) ) :
	function minnpost_largo_category_groups() {
		$choices = array( 'news', 'arts-culture', 'opinion', 'sponsored-content' );
		return $choices;
	}
endif;

/**
* For the category group custom field, generate the options
* @return $options
*
*/
if ( ! function_exists( 'minnpost_largo_category_group_options' ) ) :
	function minnpost_largo_category_group_options() {
		$choices = minnpost_largo_category_groups();
		$options = array();
		foreach ( $choices as $choice ) {
			$category = minnpost_largo_group_category( $choice );
			if ( false !== $category ) {
				$options[ $category->term_id ] = $category->name;
			}
		}
		return $options;
	}
endif;

/**
* For a category group option, get the category data
* @param $slug
* @return $category
*
*/
if ( ! function_exists( 'minnpost_largo_group_category' ) ) :
	function minnpost_largo_group_category( $slug ) {
		$category = get_category_by_slug( $slug );
		return $category;
	}
endif;

/**
* Custom Author fields
*
*/

/**
* Remove guest author bio and comments from custom author
* Bio is probably a wysiwyg thing, but I honestly don't remember.
*
*/
if ( ! function_exists( 'remove_author_fields' ) ) :
	add_action( 'add_meta_boxes', 'remove_author_fields', 19 );
	function remove_author_fields() {
		remove_meta_box( 'coauthors-manage-guest-author-bio', 'guest-author', 'normal' );
		remove_meta_box( 'commentstatusdiv', 'guest-author', 'normal' );
		remove_meta_box( 'commentsdiv', 'guest-author', 'normal' );
	}
endif;

/**
* Remove comment support from authors
*
*/
if ( ! function_exists( 'minnpost_remove_author_comments' ) ) :
	add_action( 'init', 'minnpost_remove_author_comments', 100 );
	function minnpost_remove_author_comments() {
		remove_post_type_support( 'guest-author', 'comments' );
		remove_post_type_support( 'guest-author', 'trackbacks' );
	}
endif;

/**
* Add custom fields to authors
*
*/
if ( ! function_exists( 'cmb2_author_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_author_fields', 9 );
	function cmb2_author_fields() {
		$object_type = 'guest-author';
		/**
		 * Author Settings
		 */
		$author_setup = new_cmb2_box(
			array(
				'id'           => $object_type . '_page_settings',
				'title'        => __( 'Page Info', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'low',
			)
		);
		// image
		$author_setup->add_field(
			array(
				'name' => __( 'Photo', 'minnpost-largo' ),
				'id'   => '_mp_author_image',
				'type' => 'file',
			)
		);
		// excerpt
		$author_setup->add_field(
			array(
				'name'    => __( 'Excerpt', 'minnpost-largo' ),
				'id'      => '_mp_author_excerpt',
				'type'    => 'wysiwyg',
				'options' => array(
					'media_buttons' => false, // show insert/upload button(s)
					'textarea_rows' => 5,
					'teeny'         => true, // output the minimal editor config used in Press This
				),
			)
		);
		// full bio
		$author_setup->add_field(
			array(
				'name'    => __( 'Bio', 'minnpost-largo' ),
				'id'      => '_mp_author_bio',
				'type'    => 'wysiwyg',
				'options' => array(
					'media_buttons' => false, // show insert/upload button(s)
					'textarea_rows' => 5,
					'teeny'         => true, // output the minimal editor config used in Press This
				),
			)
		);
		$author_setup->add_field(
			array(
				'name' => __( 'Staff Member?', 'minnpost-largo' ),
				'id'   => '_staff_member',
				'type' => 'checkbox',
				'desc' => '',
			)
		);
		$author_setup->add_field(
			array(
				'name' => __( 'Prevent lazy loading of embed ads?', 'minnpost-largo' ),
				'id'   => 'arcads_dfp_acm_provider_post_prevent_lazyload',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not attempt to lazy load embed ads.', 'minnpost-largo' ),
			)
		);
	}

endif;

/**
* Add fields to users
*
*/
if ( ! function_exists( 'cmb2_user_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_user_fields' );
	function cmb2_user_fields() {

		$object_type = 'user';

		// address fields
		$user_address = new_cmb2_box(
			array(
				'id'           => $object_type . '_address',
				'title'        => __( 'Address Info', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'low',
			)
		);
		$user_address->add_field(
			array(
				'name' => __( 'All Email Addresses', 'minnpost-largo' ),
				'id'   => '_consolidated_emails',
				'type' => 'text',
				'desc' => __( 'Separate each email address with a comma.', 'minnpost-largo' ),
			)
		);
		$user_address->add_field(
			array(
				'name' => __( 'Street Address', 'minnpost-largo' ),
				'id'   => '_street_address',
				'type' => 'text',
				'desc' => '',
			)
		);
		$user_address->add_field(
			array(
				'name' => __( 'City', 'minnpost-largo' ),
				'id'   => '_city',
				'type' => 'text',
				'desc' => '',
			)
		);
		$user_address->add_field(
			array(
				'name' => __( 'State', 'minnpost-largo' ),
				'id'   => '_state',
				'type' => 'text',
				'desc' => '',
			)
		);
		$user_address->add_field(
			array(
				'name' => __( 'Zip Code', 'minnpost-largo' ),
				'id'   => '_zip_code',
				'type' => 'text',
				'desc' => '',
			)
		);
		$user_address->add_field(
			array(
				'name' => __( 'Country', 'minnpost-largo' ),
				'id'   => '_country',
				'type' => 'text',
				'desc' => '',
			)
		);

		// reading preferences
		$reading_preferences = new_cmb2_box(
			array(
				'id'           => $object_type . '_reading_preferences',
				'title'        => __( 'Reading Preferences', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'low',
			)
		);
		$reading_preferences->add_field(
			array(
				'name'    => __( 'Reading preferences:', 'minnpost-largo' ),
				'desc'    => '',
				'id'      => '_reading_topics',
				'type'    => 'multicheck',
				'options' => array(
					'Arts & Culture'         => __( 'Arts & Culture', 'minnpost-largo' ),
					'Economy'                => __( 'Economy', 'minnpost-largo' ),
					'Education'              => __( 'Education', 'minnpost-largo' ),
					'Environment'            => __( 'Environment', 'minnpost-largo' ),
					'Greater Minnesota news' => __( 'Greater Minnesota news', 'minnpost-largo' ),
					'Health'                 => __( 'Health', 'minnpost-largo' ),
					'MinnPost announcements' => __( 'MinnPost announcements', 'minnpost-largo' ),
					'Opinion/Commentary'     => __( 'Opinion/Commentary', 'minnpost-largo' ),
					'Politics & Policy'      => __( 'Politics & Policy', 'minnpost-largo' ),
					'Sports'                 => __( 'Sports', 'minnpost-largo' ),
				),
			)
		);

		// site preferences
		$site_preferences = new_cmb2_box(
			array(
				'id'           => $object_type . '_site_preferences',
				'title'        => __( 'Site Preferences', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'low',
			)
		);
		$site_preferences->add_field(
			array(
				'name' => __( 'Always load comments', 'minnpost-largo' ),
				'id'   => 'always_load_comments',
				'type' => 'checkbox',
				'desc' => '',
			)
		);

		// donation fields
		$user_donation_info = new_cmb2_box(
			array(
				'id'           => $object_type . '_donation_info',
				'title'        => __( 'Donation Info', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'low',
			)
		);
		$user_donation_info->add_field(
			array(
				'name' => __( 'Stripe Customer ID', 'minnpost-largo' ),
				'desc' => '',
				'id'   => '_stripe_customer_id',
				'type' => 'text',
			)
		);
		$user_donation_info->add_field(
			array(
				'name' => __( 'Membership Qualification Amount', 'minnpost-largo' ),
				'desc' => '',
				'id'   => '_membership_qualification_amount',
				'type' => 'text',
			)
		);
		$user_donation_info->add_field(
			array(
				'name' => __( 'Annual Recurring Amount', 'minnpost-largo' ),
				'desc' => '',
				'id'   => '_annual_recurring_amount',
				'type' => 'text',
			)
		);
		$user_donation_info->add_field(
			array(
				'name' => __( 'Coming Year Contributions', 'minnpost-largo' ),
				'desc' => '',
				'id'   => '_coming_year_contributions',
				'type' => 'text',
			)
		);
		$user_donation_info->add_field(
			array(
				'name' => __( 'Prior Year Contributions', 'minnpost-largo' ),
				'desc' => '',
				'id'   => '_prior_year_contributions',
				'type' => 'text',
			)
		);
		$user_donation_info->add_field(
			array(
				'name' => __( 'Sustaining Member', 'minnpost-largo' ),
				'id'   => '_sustaining_member',
				'type' => 'checkbox',
				'desc' => '',
			)
		);
		$user_donation_info->add_field(
			array(
				'name' => __( 'Next Partner Claim Date', 'minnpost-largo' ),
				'id'   => '_next_partner_claim_date',
				'type' => 'text_date',
				'desc' => '',
			)
		);
		$user_donation_info->add_field(
			array(
				'name' => __( 'Last Partner Claim Date', 'minnpost-largo' ),
				'id'   => '_last_partner_claim_date',
				'type' => 'text_date',
				'desc' => '',
			)
		);
		$user_donation_info->add_field(
			array(
				'name' => __( 'Exclude from current campaign', 'minnpost-largo' ),
				'id'   => '_exclude_from_current_campaign',
				'type' => 'checkbox',
				'desc' => '',
			)
		);

	}
endif;

/**
* Get member levels so we can assign them to content access
* This depends on the MinnPost Membership plugin
*
* @param array $field_args
* @param array $field
* @param bool $reset
*
* @return array $values
*/
if ( ! function_exists( 'get_member_levels' ) ) :
	function get_member_levels( $field_args = array(), $field = array(), $reset = false ) {
		$values = array();
		if ( ! class_exists( 'MinnPost_Membership' ) ) {
			$file = TEMPLATEPATH . 'plugins/minnpost-membership/minnpost-membership.php';
			if ( file_exists( $file ) ) {
				require_once( $file );
			} else {
				return $values;
			}
		}
		if ( function_exists( 'minnpost_membership' ) ) {
			$minnpost_membership = minnpost_membership();
			$member_values       = $minnpost_membership->member_levels->get_member_levels();
			foreach ( $member_values as $key => $value ) {
				$values[ $key + 1 ] = $value['name'];
			}
		}
		return $values;
	}
endif;

/**
* Add fields to sponsors
* This all depends on the cr3ativ sponsor plugin, which is kind of bad but sufficient.
*
*/
if ( ! function_exists( 'cmb2_sponsor_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_sponsor_fields' );
	function cmb2_sponsor_fields() {

		$object_type = 'cr3ativsponsor';

		$sponsor_info = new_cmb2_box(
			array(
				'id'           => 'cr3ativsponsor_box',
				'title'        => __( 'Sponsor Information', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
			)
		);
		// sponsor company url
		$sponsor_info->add_field(
			array(
				'name' => __( 'Company URL', 'minnpost-largo' ),
				'id'   => 'cr3ativ_sponsorurl',
				'type' => 'text',
			)
		);
		// what to display for the sponsor
		$sponsor_info->add_field(
			array(
				'name' => __( 'Display Text', 'minnpost-largo' ),
				'id'   => 'cr3ativ_sponsortext',
				'type' => 'text',
			)
		);
		// sponsor twitter username
		$sponsor_info->add_field(
			array(
				'name' => __( 'Twitter Username', 'minnpost-largo' ),
				'id'   => 'cr3ativ_sponsortwitter',
				'type' => 'text',
				'desc' => __( 'Enter the Twitter username only. No need to include the @ symbol.', 'minnpost-largo' ),
			)
		);

		/**
		 * Sponsor image settings
		 */
		$sponsor_image = new_cmb2_box(
			array(
				'id'           => $object_type . '_image_settings',
				'title'        => __( 'Image Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
			)
		);
		// thumbnail
		$sponsor_image->add_field(
			array(
				'name'       => __( 'Thumbnail Image', 'minnpost-largo' ),
				'desc'       => __( 'Upload an image or enter an URL.', 'minnpost-largo' ),
				'id'         => '_mp_post_thumbnail_image',
				'type'       => 'file',
				'options'    => array(
					//'url' => false, // Hide the text input for the url
				),
				'text'       => array(
					//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
				),
				// query_args are passed to wp.media's library query.
				'query_args' => array(
					'type' => 'image',
				),
			)
		);
		// large image
		$sponsor_image->add_field(
			array(
				'name'       => __( 'Large Image', 'minnpost-largo' ),
				'desc'       => __( 'Upload an image or enter an URL.', 'minnpost-largo' ),
				'id'         => '_mp_post_main_image',
				'type'       => 'file',
				'options'    => array(
					//'url' => false, // Hide the text input for the url
				),
				'text'       => array(
					//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
				),
				// query_args are passed to wp.media's library query.
				'query_args' => array(
					'type' => 'image',
				),
			)
		);

	}

	/**
	* Remove comments and trackbacks from the sponsor post because that's absurd
	*
	*/
	add_action( 'init', 'remove_custom_post_comment', 100 );
	function remove_custom_post_comment() {
		remove_post_type_support( 'cr3ativsponsor', 'comments' );
		remove_post_type_support( 'cr3ativsponsor', 'trackbacks' );
	}

	/**
	* Edit the sponsor list display on the admin
	*
	*/
	add_filter( 'manage_edit-cr3ativsponsor_columns', 'minnpost_edit_sponsor_columns' );
	function minnpost_edit_sponsor_columns( $columns ) {
		$columns = array(
			'cb'              => '<input type="checkbox" />',
			'title'           => __( 'Sponsor Name', 'cr3at_sponsor' ),
			'sponsor_website' => __( 'Sponsor Website', 'cr3at_sponsor' ),
			'sponsor_level'   => __( 'Sponsor Level', 'cr3at_sponsor' ),
		);
		return $columns;
	}

endif;

/**
* Add custom fields to events
* This all depends on the The Events Calendar plugin
*
*/
if ( ! function_exists( 'cmb2_event_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_event_fields' );
	function cmb2_event_fields() {

		$object_type = 'tribe_events';

		/**
		 * Excerpt settings
		 */
		$excerpt = new_cmb2_box(
			array(
				'id'           => $object_type . '_excerpt',
				'title'        => __( 'Excerpt', 'minnpost-largo' ),
				'object_types' => array( $object_type ), // Post type
				'context'      => 'after_editor',
				'priority'     => 'high',
				'show_names'   => false,
			)
		);
		$excerpt->add_field(
			array(
				'id'        => 'excerpt',
				'name'      => __( 'Excerpt', 'minnpost-largo' ),
				'desc'      => '',
				'type'      => 'wysiwyg',
				'escape_cb' => false,
				'options'   => array(
					'media_buttons' => false, // show insert/upload button(s)
					'textarea_rows' => 5,
					'teeny'         => true, // output the minimal editor config used in Press This
				),
			)
		);

		/**
		 * Event speaker settings
		 */
		$event_speaker_posts = new_cmb2_box(
			array(
				'id'           => $object_type . '_event_posts',
				'title'        => __( 'Speakers', 'minnpost-largo' ),
				'object_types' => array( $object_type ), // Post type
				'context'      => 'after_editor',
				'priority'     => 'high',
				'show_names'   => false,
			)
		);

		$event_speaker_posts->add_field(
			minnpost_post_search_field(
				array(
					'name'       => __( 'Speakers', 'minnpost-largo' ),
					'desc'       => __( 'Search for a speaker post by name here.', 'minnpost-largo' ),
					'id'         => '_tribe_linked_post_tribe_ext_speaker',
					//'multiple'   => true, - this does not seem to work on VIP go.
					'query_args' => array(
						'orderby'     => 'modified',
						'order'       => 'DESC',
						'post_status' => 'any',
						'post_type'   => array( 'tribe_ext_speaker' ),
					),
				),
				'post_search_ajax'
			)
		);

		/**
		 * SEO and social meta settings
		 */
		$seo_settings = new_cmb2_box(
			array(
				'id'           => $object_type . '_seo_settings',
				'title'        => 'SEO &amp; Social Settings',
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$seo_settings->add_field(
			array(
				'name'         => 'Title',
				'id'           => '_mp_seo_title',
				'type'         => 'text',
				'char_counter' => true,
				'char_max'     => 78,
				'desc'         => sprintf(
					// translators: 1) the sitename
					esc_html__( 'If you do not fill this out, the event title will be used. If you do fill it out and do not include %1$s in the value, it will be placed at the end in this way: Your Title | %1$s' ),
					get_bloginfo( 'name' )
				),
				'attributes'   => array(
					'maxlength' => 78, // retrieved from https://seopressor.com/blog/google-title-meta-descriptions-length/ on 9/27/2018
				),
			)
		);
		$seo_settings->add_field(
			array(
				'name'         => 'Description',
				'id'           => '_mp_seo_description',
				'type'         => 'textarea_small',
				'char_counter' => true,
				'char_max'     => 200,
				'attributes'   => array(
					'maxlength' => 200, // 155 is the number, but it's ok to go higher as long as the spider sees the most important stuff at the beginning. retrieved from https://moz.com/blog/how-to-write-meta-descriptions-in-a-changing-world on 5/8/2020
				),
				'desc'         => esc_html__( 'When using this field, make sure the most important text is in the first 155 characters to ensure that Google can see it. If you do not fill it out, the event excerpt will be used.' ),
			)
		);
		$seo_settings->add_field(
			array(
				'name'         => esc_html__( 'Meta images', 'minnpost-largo' ),
				'desc'         => esc_html__( 'Using this field will remove images that are uploaded to this event from the event\'s metadata, and replace them with the images in this field.', 'minnpost-largo' ),
				'id'           => '_mp_social_images',
				'type'         => 'file_list',
				'preview_size' => array( 130, 85 ),
				// query_args are passed to wp.media's library query.
				'query_args'   => array(
					'type' => 'image',
				),
			)
		);

		/**
		 * Image settings
		 */
		$image_settings = new_cmb2_box(
			array(
				'id'           => $object_type . '_image_settings',
				'title'        => __( 'Image Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
			)
		);
		$image_settings->add_field(
			array(
				'name'       => __( 'Thumbnail Image', 'minnpost-largo' ),
				'desc'       => __( 'Upload an image or enter an URL.', 'minnpost-largo' ),
				'id'         => '_mp_post_thumbnail_image',
				'type'       => 'file',
				'options'    => array(
					//'url' => false, // Hide the text input for the url
				),
				'text'       => array(
					//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
				),
				// query_args are passed to wp.media's library query.
				'query_args' => array(
					'type' => 'image',
				),
			)
		);
		$image_settings->add_field(
			array(
				'name'             => __( 'Homepage Image Size', 'minnpost-largo' ),
				'id'               => '_mp_post_homepage_image_size',
				'type'             => 'select',
				'show_option_none' => true,
				'desc'             => __( 'Select an option', 'minnpost-largo' ),
				'default'          => 'feature-large',
				'options'          => array(
					'feature-medium' => __( 'Medium', 'minnpost-largo' ),
					'none'           => __( 'Do not display image', 'minnpost-largo' ),
					'feature-large'  => __( 'Large', 'minnpost-largo' ),
				),
			)
		);
		$image_settings->add_field(
			array(
				'name'             => __( 'Homepage Image Position', 'minnpost-largo' ),
				'id'               => '_mp_post_homepage_image_position',
				'type'             => 'radio_inline',
				'show_option_none' => false,
				'desc'             => __( 'Pick whether the image should go before or after the text. If before, it will be flush left on large screens, unless it is too wide. If after, it will be flush right, unless it is too wide.', 'minnpost-largo' ),
				'default'          => 'after',
				'options'          => array(
					'before' => __( 'Before', 'minnpost-largo' ),
					'after'  => __( 'After', 'minnpost-largo' ),
				),
			)
		);
		$image_settings->add_field(
			array(
				'name'         => __( 'Main Image', 'minnpost-largo' ),
				'desc'         => __( 'Upload an image or enter an URL.', 'minnpost-largo' ),
				'id'           => '_mp_post_main_image',
				'type'         => 'file',
				'preview_size' => array( 130, 85 ),
				'options'      => array(
					//'url' => false, // Hide the text input for the url
				),
				'text'         => array(
					//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
				),
				// query_args are passed to wp.media's library query.
				'query_args'   => array(
					'type' => 'image',
				),
			)
		);

		/**
		 * Display settings
		 */
		$display_settings = new_cmb2_box(
			array(
				'id'           => $object_type . '_display_settings',
				'title'        => __( 'Display Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Prevent lazy loading of images?', 'minnpost-largo' ),
				'id'   => '_mp_prevent_lazyload',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this event will not attempt to lazy load images.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Load HTML editor by default?', 'minnpost-largo' ),
				'id'   => '_mp_post_use_html_editor',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this event will open with the HTML editor visible.', 'minnpost-largo' ),
			)
		);
		/*$display_settings->add_field(
			array(
				'name' => __( 'Remove category from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_category_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not display its categories.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Replace category text', 'minnpost-largo' ),
				'id'   => '_mp_replace_category_text',
				'type' => 'text',
				'desc' => __( 'This text will show in place of the category name(s).', 'minnpost-largo' ),
			)
		);*/
		$display_settings->add_field(
			array(
				'name' => __( 'Remove title from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_title_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, the event title will not display.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Remove notice(s) from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_notice_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this event will not display any notices it would otherwise contain from the events plugin.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Remove all event details from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_event_details_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this event will not display any of its details in their normal locations, including date, venue, and cost information.', 'minnpost-largo' ),
			)
		);
		/*$display_settings->add_field(
			array(
				'name' => __( 'Remove author(s) from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_author_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, the post author(s) will not display.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Remove deck from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_deck_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, any deck content will be ignored.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Remove date from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_date_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, the post date will not display.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Remove newsletter signup from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_newsletter_signup_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not have a newsletter signup box.', 'minnpost-largo' ),
			)
		);*/
		$display_settings->add_field(
			array(
				'name' => __( 'Remove share buttons from display?', 'minnpost-largo' ),
				'id'   => '_mp_remove_share_buttons_from_display',
				'type' => 'checkbox',
				'desc' => __( 'If checked, share buttons will not display on this event.', 'minnpost-largo' ),
			)
		);
		$display_settings->add_field(
			array(
				'name' => __( 'Keep share buttons horizontal on large screens', 'minnpost-largo' ),
				'id'   => '_mp_share_buttons_always_horizontal',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this event will have horizontal share buttons above the event content, rather than vertical ones next to it, on large screens. This is similar to its mobile behavior.', 'minnpost-largo' ),
			)
		);

		// Don't add ads if this event is not a supported type
		$post_types = get_option( 'arcads_dfp_acm_provider_post_types', array( 'post' ) );
		if ( in_array( $object_type, $post_types, true ) ) {
			cmb2_event_ad_fields();
		}

		/**
		 * Sidebar settings
		 */
		$sidebar_settings = new_cmb2_box(
			array(
				'id'           => $object_type . '_sidebar_options',
				'title'        => __( 'Sidebar Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$sidebar_settings->add_field(
			array(
				'name' => __( 'Remove whole right sidebar from this event?', 'minnpost-largo' ),
				'id'   => '_mp_remove_right_sidebar',
				'type' => 'checkbox',
				'desc' => '',
			)
		);
		$sidebar_settings->add_field(
			array(
				'name' => __( 'Remove whole right sidebar from this event? (V2)', 'minnpost-largo' ),
				'id'   => '_mp_remove_right_sidebar_v2',
				'type' => 'checkbox',
				'desc' => '',
			)
		);
		$sidebar_settings->add_field(
			array(
				'name' => __( 'Sidebar Content Box', 'minnpost-largo' ),
				'desc' => __( 'Content for a single right sidebar box', 'minnpost-largo' ),
				'id'   => '_mp_post_sidebar',
				'type' => 'wysiwyg',
			)
		);

	}

endif;

/**
* Add custom fields to event website pages
*
*/
if ( ! function_exists( 'cmb2_event_website_page_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_event_website_page_fields' );
	function cmb2_event_website_page_fields() {

		$event_website_page_settings = array(
			'festival' => array(
				'name'   => esc_html__( 'Festival', ),
				'prefix' => '_mp_festival_',
			),
			'tonight'  => array(
				'name'   => esc_html__( 'Tonight', ),
				'prefix' => '_mp_tonight_',
			),
		);

		foreach ( $event_website_page_settings as $object_type => $settings ) {

			$prefix = $settings['prefix'];
			$event_year = minnpost_largo_get_event_year( $object_type );

			$year_suffix = '';
			if ( '' !== get_the_date( 'Y' ) && get_the_date( 'Y' ) !== gmdate( 'Y' ) ) {
				$year_suffix = $event_year . '/';
			}
			error_log( 'year suffix is ' . $year_suffix );

			/**
			 * event directory settings
			 */
			$directory_page_settings = new_cmb2_box(
				array(
					'id'           => $object_type . '_directory_page_settings',
					'title'        => __( 'Directory Page Settings', 'minnpost-largo' ),
					'object_types' => array( $object_type ),
					'context'      => 'normal',
					'priority'     => 'high',
					'closed'       => true,
				)
			);
			$directory_attributes    = array();
			$directory_desc          = sprintf(
				// translators: 1) the directory url
				esc_html__( 'If checked, this page will load as the content of %1$s.' ),
				'<a href="' . site_url( '/' . $object_type . '/' . $year_suffix ) . '">' . site_url( '/' . $object_type . '/' . $year_suffix ) . '</a>',
			);
			// check to see if there is a post checked for /object-type already
			$directory_args  = array(
				'posts_per_page' => 1,
				'post_type'      => $object_type,
				'meta_key'       => $object_type . '_load_as_directory_content',
				'meta_value'     => 'on',
				'year'           => $event_year,
			);
			$directory_query = new WP_Query( $directory_args );
			if ( $directory_query->have_posts() ) {
				global $post;
				$post_id           = isset( $post->ID ) ? $post->ID : '';
				$directory_post_id = isset( $directory_query->posts[0]->ID ) ? (int) $directory_query->posts[0]->ID : '';
				if ( empty( $post ) && array_key_exists( 'post', $_GET ) ) {
					$post_id = esc_attr( $_GET['post'] );
				}
				$post_id = (int) $post_id;
				if ( $directory_post_id !== $post_id ) {
					$directory_attributes = array(
						'readonly' => 'readonly',
						'disabled' => 'disabled',
					);
					$directory_desc       = sprintf(
						// translators: 1) the directory url
						esc_html__( 'The post %1$s is already loaded for the content of %2$s. You will need to uncheck this box on that post first.' ),
						'<a href="' . admin_url( '/post.php?post=' . $directory_post_id . '&action=edit' ) . '">editable here</a>',
						'<a href="' . site_url( '/' . $object_type . '/' ) . '">' . site_url( '/' . $object_type . '/' ) . '</a>',
					);
				}
			}
			$directory_page_settings->add_field(
				array(
					'name'       => __( 'Load this page as the directory index', 'minnpost-largo' ),
					'id'         => $object_type . '_load_as_directory_content',
					'type'       => 'checkbox',
					'desc'       => $directory_desc,
					'attributes' => $directory_attributes,
				)
			);

			/**
			 * Excerpt settings
			 */
			$excerpt = new_cmb2_box(
				array(
					'id'           => $object_type . '_excerpt',
					'title'        => __( 'Excerpt', 'minnpost-largo' ),
					'object_types' => array( $object_type ), // Post type
					'context'      => 'after_editor',
					'priority'     => 'high',
					'show_names'   => false,
				)
			);
			$excerpt->add_field(
				array(
					'id'        => 'excerpt',
					'name'      => __( 'Excerpt', 'minnpost-largo' ),
					'desc'      => '',
					'type'      => 'wysiwyg',
					'escape_cb' => false,
					'options'   => array(
						'media_buttons' => false, // show insert/upload button(s)
						'textarea_rows' => 5,
						'teeny'         => true, // output the minimal editor config used in Press This
					),
				)
			);

			/**
			 * Event post settings
			 */
			$event_posts = new_cmb2_box(
				array(
					'id'           => $object_type . '_event_posts',
					'title'        => __( 'Page Content Settings', 'minnpost-largo' ),
					'object_types' => array( $object_type ), // Post type
					'context'      => 'normal',
					'priority'     => 'high',
					'show_names'   => true,
				)
			);

			$event_posts->add_field(
				minnpost_post_search_field(
					array(
						'name'       => __( 'Content posts to load', 'minnpost-largo' ),
						'desc'       => __( 'Search for an event or speaker post by title here.', 'minnpost-largo' ),
						'id'         => $prefix . 'content_posts',
						'query_args' => array(
							'orderby'     => 'modified',
							'order'       => 'DESC',
							'post_status' => 'any',
							'post_type'   => array( 'tribe_events', 'tribe_ext_speaker' ),
						),
					),
					'post_search_ajax'
				)
			);
			$event_posts->add_field(
				array(
					'name' => __( 'Link to individual posts?', 'minnpost-largo' ),
					'id'   => $prefix . 'content_posts_use_permalinks',
					'type' => 'checkbox',
					'desc' => __( 'If checked, each entry will link to the individual URL for that post.', 'minnpost-largo' ),
				)
			);
			$event_posts->add_field(
				array(
					'name' => __( 'Load as page content instead of links?', 'minnpost-largo' ),
					'id'   => $prefix . 'content_posts_load_content_instead_of_links',
					'type' => 'checkbox',
					'desc' => __( 'If checked, the content for each entry will be displayed on this page. This is useful if you want to have a landing page for a single event without a session list.', 'minnpost-largo' ),
				)
			);

			/**
			 * SEO and social meta settings
			 */
			$seo_settings = new_cmb2_box(
				array(
					'id'           => $object_type . '_seo_settings',
					'title'        => 'SEO &amp; Social Settings',
					'object_types' => array( $object_type ),
					'context'      => 'normal',
					'priority'     => 'high',
					'closed'       => true,
				)
			);
			$seo_settings->add_field(
				array(
					'name'         => 'Title',
					'id'           => '_mp_seo_title',
					'type'         => 'text',
					'char_counter' => true,
					'char_max'     => 78,
					'desc'         => sprintf(
						// translators: 1) the object type, 2) the sitename
						esc_html__( 'If you do not fill this out, the %1$s page title will be used. If you do fill it out and do not include %2$s in the value, it will be placed at the end in this way: Your Title | %2$s' ),
						$object_type,
						get_bloginfo( 'name' )
					),
					'attributes'   => array(
						'maxlength' => 78, // retrieved from https://seopressor.com/blog/google-title-meta-descriptions-length/ on 9/27/2018
					),
				)
			);
			$seo_settings->add_field(
				array(
					'name'         => 'Description',
					'id'           => '_mp_seo_description',
					'type'         => 'textarea_small',
					'char_counter' => true,
					'char_max'     => 200,
					'attributes'   => array(
						'maxlength' => 200, // 155 is the number, but it's ok to go higher as long as the spider sees the most important stuff at the beginning. retrieved from https://moz.com/blog/how-to-write-meta-descriptions-in-a-changing-world on 5/8/2020
					),
					'desc'         => sprintf(
						// translators: 1) the object type
						esc_html__( 'When using this field, make sure the most important text is in the first 155 characters to ensure that Google can see it. If you do not fill it out, the %1$s page excerpt will be used.', 'minnpost-largo' ),
						$object_type
					),
				)
			);
			$seo_settings->add_field(
				array(
					'name'         => esc_html__( 'Meta images', 'minnpost-largo' ),
					'desc'         => sprintf(
						// translators: 1) the object type
						esc_html__( 'Using this field will remove images that are uploaded to this %1$s page from the page\'s metadata, and replace them with the images in this field.', 'minnpost-largo' ),
						$object_type
					),
					'id'           => '_mp_social_images',
					'type'         => 'file_list',
					'preview_size' => array( 130, 85 ),
					// query_args are passed to wp.media's library query.
					'query_args'   => array(
						'type' => 'image',
					),
				)
			);

			/**
			 * Image settings
			 */
			$image_settings = new_cmb2_box(
				array(
					'id'           => $object_type . '_image_settings',
					'title'        => __( 'Image Settings', 'minnpost-largo' ),
					'object_types' => array( $object_type ),
					'context'      => 'normal',
					'priority'     => 'high',
				)
			);
			$image_settings->add_field(
				array(
					'name'       => __( 'Thumbnail Image', 'minnpost-largo' ),
					'desc'       => __( 'Upload an image or enter an URL.', 'minnpost-largo' ),
					'id'         => '_mp_post_thumbnail_image',
					'type'       => 'file',
					'options'    => array(
						//'url' => false, // Hide the text input for the url
					),
					'text'       => array(
						//'add_upload_file_text' => 'Add Image', // Change upload button text. Default: "Add or Upload File"
					),
					// query_args are passed to wp.media's library query.
					'query_args' => array(
						'type' => 'image',
					),
				)
			);
			$image_settings->add_field(
				array(
					'name'             => __( 'Homepage Image Size', 'minnpost-largo' ),
					'id'               => '_mp_post_homepage_image_size',
					'type'             => 'select',
					'show_option_none' => true,
					'desc'             => __( 'Select an option', 'minnpost-largo' ),
					'default'          => 'feature-large',
					'options'          => array(
						'feature-medium' => __( 'Medium', 'minnpost-largo' ),
						'none'           => __( 'Do not display image', 'minnpost-largo' ),
						'feature-large'  => __( 'Large', 'minnpost-largo' ),
					),
				)
			);
			$image_settings->add_field(
				array(
					'name'             => __( 'Homepage Image Position', 'minnpost-largo' ),
					'id'               => '_mp_post_homepage_image_position',
					'type'             => 'radio_inline',
					'show_option_none' => false,
					'desc'             => __( 'Pick whether the image should go before or after the text. If before, it will be flush left on large screens, unless it is too wide. If after, it will be flush right, unless it is too wide.', 'minnpost-largo' ),
					'default'          => 'after',
					'options'          => array(
						'before' => __( 'Before', 'minnpost-largo' ),
						'after'  => __( 'After', 'minnpost-largo' ),
					),
				)
			);
		}
	}
endif;

/**
* Add custom fields to speakers
*
*/
if ( ! function_exists( 'cmb2_speaker_fields' ) ) :
	add_action( 'cmb2_init', 'cmb2_speaker_fields' );
	function cmb2_speaker_fields() {

		$object_type = 'tribe_ext_speaker';
		$prefix      = '_mp_speaker_';

		/**
		 * Excerpt settings
		 */
		$excerpt = new_cmb2_box(
			array(
				'id'           => 'speaker_excerpt',
				'title'        => __( 'Excerpt', 'minnpost-largo' ),
				'object_types' => array( $object_type ), // Post type
				'context'      => 'after_editor',
				'priority'     => 'high',
				'show_names'   => false,
			)
		);
		$excerpt->add_field(
			array(
				'id'        => 'excerpt',
				'name'      => __( 'Excerpt', 'minnpost-largo' ),
				'desc'      => '',
				'type'      => 'wysiwyg',
				'escape_cb' => false,
				'options'   => array(
					'media_buttons' => false, // show insert/upload button(s)
					'textarea_rows' => 5,
					'teeny'         => true, // output the minimal editor config used in Press This
				),
			)
		);

		/**
		 * Speaker Settings
		 */
		$speaker_setup = new_cmb2_box(
			array(
				'id'           => $object_type . '_speaker_settings',
				'title'        => __( 'Additional Speaker Information', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
			)
		);
		$speaker_setup->add_field(
			array(
				'name' => __( 'Moderator?', 'minnpost-largo' ),
				'id'   => $prefix . 'moderator',
				'type' => 'checkbox',
				'desc' => __( 'Check the box if this speaker is a moderator.', 'minnpost-largo' ),
			)
		);
		// image
		$speaker_setup->add_field(
			array(
				'name' => __( 'Photo', 'minnpost-largo' ),
				'id'   => $prefix . 'photo',
				'type' => 'file',
			)
		);

		/**
		 * SEO and social meta settings
		 */
		$seo_settings = new_cmb2_box(
			array(
				'id'           => $object_type . '_seo_settings',
				'title'        => 'SEO &amp; Social Settings',
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$seo_settings->add_field(
			array(
				'name'         => 'Title',
				'id'           => '_mp_seo_title',
				'type'         => 'text',
				'char_counter' => true,
				'char_max'     => 78,
				'desc'         => sprintf(
					// translators: 1) the sitename
					esc_html__( 'If you do not fill this out, the speaker title will be used. If you do fill it out and do not include %1$s in the value, it will be placed at the end in this way: Your Title | %1$s' ),
					get_bloginfo( 'name' )
				),
				'attributes'   => array(
					'maxlength' => 78, // retrieved from https://seopressor.com/blog/google-title-meta-descriptions-length/ on 9/27/2018
				),
			)
		);
		$seo_settings->add_field(
			array(
				'name'         => 'Description',
				'id'           => '_mp_seo_description',
				'type'         => 'textarea_small',
				'char_counter' => true,
				'char_max'     => 200,
				'attributes'   => array(
					'maxlength' => 200, // 155 is the number, but it's ok to go higher as long as the spider sees the most important stuff at the beginning. retrieved from https://moz.com/blog/how-to-write-meta-descriptions-in-a-changing-world on 5/8/2020
				),
				'desc'         => esc_html__( 'When using this field, make sure the most important text is in the first 155 characters to ensure that Google can see it. If you do not fill it out, the speaker excerpt will be used.' ),
			)
		);
		$seo_settings->add_field(
			array(
				'name'         => esc_html__( 'Meta images', 'minnpost-largo' ),
				'desc'         => esc_html__( 'Using this field will remove images that are uploaded to this speaker from the speaker\'s metadata, and replace them with the images in this field.', 'minnpost-largo' ),
				'id'           => '_mp_social_images',
				'type'         => 'file_list',
				'preview_size' => array( 130, 85 ),
				// query_args are passed to wp.media's library query.
				'query_args'   => array(
					'type' => 'image',
				),
			)
		);
	}
endif;

/**
* Ad & Sponsorship settings if ads are enabled on events
*
*/
if ( ! function_exists( 'cmb2_event_ad_fields' ) ) :
	function cmb2_event_ad_fields() {
		$ad_settings = new_cmb2_box(
			array(
				'id'           => $object_type . '_ad_settings',
				'title'        => __( 'Ad & Sponsorship Settings', 'minnpost-largo' ),
				'object_types' => array( $object_type ),
				'context'      => 'normal',
				'priority'     => 'high',
				'closed'       => true,
			)
		);
		$ad_settings->add_field(
			array(
				'name' => __( 'Prevent automatic embed ads?', 'minnpost-largo' ),
				'id'   => '_mp_prevent_automatic_ads',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not contain automatic embed ads.', 'minnpost-largo' ),
			)
		);
		$ad_settings->add_field(
			array(
				'name' => __( 'Prevent all embed ads?', 'minnpost-largo' ),
				'id'   => '_mp_prevent_ads',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not contain any embed ads.', 'minnpost-largo' ),
			)
		);
		$ad_settings->add_field(
			array(
				'name' => __( 'Prevent lazy loading of embed ads?', 'minnpost-largo' ),
				'id'   => 'arcads_dfp_acm_provider_post_prevent_lazyload',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this post will not attempt to lazy load embed ads.', 'minnpost-largo' ),
			)
		);
		$ad_settings->add_field(
			array(
				'name'    => __( 'Sponsorship', 'minnpost-largo' ),
				'id'      => '_mp_post_sponsorship',
				'type'    => 'wysiwyg',
				'desc'    => __( 'This field overrides a sponsorship message from the category or tag that contains an event.', 'minnpost-largo' ),
				'options' => array(
					'media_buttons' => false, // show insert/upload button(s)
					'textarea_rows' => 5,
					'teeny'         => true, // output the minimal editor config used in Press This
				),
			)
		);
		$ad_settings->add_field(
			array(
				'name' => __( 'Prevent sponsorship display', 'minnpost-largo' ),
				'id'   => '_mp_prevent_post_sponsorship',
				'type' => 'checkbox',
				'desc' => __( 'If checked, this event will not display any sponsorship message, regardless of its tags or categories.', 'minnpost-largo' ),
			)
		);
	}
endif;

/**
* Generate arguments for CMB2 field for picking other posts on an edit post screen.
* This can support either custom_attached_posts or post_ajax_search field types from CMB2 plugins
* @param array $args
* @param string $type
* @return array $args
*
*/
if ( ! function_exists( 'minnpost_post_search_field' ) ) :
	function minnpost_post_search_field( $args, $type = 'post_search_ajax' ) {

		// this is the attached post field default
		if ( 'custom_attached_posts' === $type ) {
			$args = array_merge(
				array(
					'desc'    => '',
					'type'    => $type,
					'options' => array(
						'show_thumbnails' => false,
						'filter_boxes'    => false,
						'query_args'      => array(
							'post_type'      => array( 'post' ),
							'post_status'    => 'publish',
							'posts_per_page' => 10,
							'cache_results'  => false,
						),
					),
				),
				$args
			);
			if ( 'production' === VIP_GO_ENV ) {
				$args['query_args']['es'] = true; // elasticsearch on production only
			}
			return $args;
		}

		// this is the cmb2-field-ajax-search plugin
		if ( 'post_ajax_search' === $type ) {
			$args = array_merge(
				array(
					'desc'       => '',
					'type'       => $type,
					'multiple'   => true,
					'sortable'   => true,
					'query_args' => array(
						'post_type'      => array( 'post' ),
						'post_status'    => 'publish',
						'posts_per_page' => 10,
						'cache_results'  => false,
					),
				),
				$args
			);
			if ( 'production' === VIP_GO_ENV ) {
				$args['query_args']['es'] = true; // elasticsearch on production only
			}
			return $args;
		}

		// this is the cmb2-field-post-search-ajax plugin, which is the default
		$args = array_merge(
			array(
				'desc'       => '',
				'type'       => $type,
				'sortable'   => true,
				'query_args' => array(
					'post_type'      => array( 'post' ),
					'post_status'    => 'publish',
					'posts_per_page' => 10,
					'cache_results'  => false,
				),
			),
			$args
		);
		if ( 'production' === VIP_GO_ENV ) {
			$args['query_args']['es'] = true; // elasticsearch on production only
		}
		return $args;

	}
endif;

/**
* Remove raw html meta box from non-admins
*
*/
if ( ! function_exists( 'limit_raw_html_box' ) ) :
	add_action( 'do_meta_boxes', 'limit_raw_html_box' );
	function limit_raw_html_box() {
		if ( ! current_user_can( 'administrator' ) ) {
			remove_meta_box( 'rawhtml_meta_box', 'post', 'side' );
			remove_meta_box( 'rawhtml_meta_box', 'page', 'side' );
		}
	}
endif;

/**
* Change expiration of public post preview links
*
* @return int $nonce_life
*
*/
if ( ! function_exists( 'minnpost_public_preview_nonce_life' ) ) :
	add_filter( 'ppp_nonce_life', 'minnpost_public_preview_nonce_life' );
	function minnpost_public_preview_nonce_life() {
		return 259200; // 3 days
	}
endif;

/**
* Remove liveblog meta box from non-editors
*
*/
if ( ! function_exists( 'limit_liveblog_box' ) ) :
	add_action( 'do_meta_boxes', 'limit_liveblog_box' );
	function limit_liveblog_box() {
		if ( ! current_user_can( 'enable_liveblog' ) ) {
			remove_meta_box( 'liveblog', 'post', 'advanced' );
		}
	}
endif;

/**
* Array of supported newsletter types. Or, a string of a single type name.
* @param string $type
* @return array $types
*
*/
if ( ! function_exists( 'minnpost_largo_email_types' ) ) :
	function minnpost_largo_email_types( $type = '' ) {
		$types = array(
			'daily'             => __( 'Daily', 'minnpost-largo' ),
			'greater_mn'        => __( 'Greater Minnesota', 'minnpost-largo' ),
			'sunday_review'     => __( 'Sunday Review', 'minnpost-largo' ),
			'dc_memo'           => __( 'D.C. Memo', 'minnpost-largo' ),
			'daily_coronavirus' => __( 'Daily Coronavirus Update', 'minnpost-largo' ),
			'artscape'          => __( 'Artscape', 'minnpost-largo' ),
			'republication'     => __( 'Republication', 'minnpost-largo' ),
		);
		if ( '' !== $type ) {
			return $types[ $type ];
		}
		return $types;
	}
endif;

/**
* Whether to remove the site sidebar
*
* @param bool $remove_sidebar
* @param int $post_id
* @return bool $remove_sidebar
*
*/
if ( ! function_exists( 'minnpost_largo_check_remove_sidebar' ) ) :
	add_filter( 'minnpost_largo_remove_sidebar', 'minnpost_largo_check_remove_sidebar' );
	function minnpost_largo_check_remove_sidebar( $remove_sidebar = false, $post_id = '' ) {
		if ( ! is_singular() ) {
			return $remove_sidebar;
		}

		if ( '' === $post_id ) {
			$post_id = get_the_ID();
		}

		/*$remove_sidebar_meta = get_post_meta( $post_id, '_mp_remove_right_sidebar', true );
		if ( isset( $remove_sidebar_meta ) && 'on' === $remove_sidebar_meta ) {
			$remove_sidebar = true;
		}*/

		$remove_sidebar_meta_v2 = get_post_meta( $post_id, '_mp_remove_right_sidebar_v2', true );
		if ( isset( $remove_sidebar_meta_v2 ) && 'on' === $remove_sidebar_meta_v2 ) {
			$remove_sidebar = true;
		}

		return $remove_sidebar;
	}
endif;

/**
* Add the image credits fields to the REST API response
*
*/
if ( ! function_exists( 'minnpost_largo_rest_api_image_credit' ) ) :
	add_action( 'rest_api_init', 'minnpost_largo_rest_api_image_credit' );
	function minnpost_largo_rest_api_image_credit() {
		register_rest_field(
			'attachment',
			'better_image_credits',
			array(
				'get_callback' => 'minnpost_largo_get_better_image_credits',
				'schema' => null,
			)
		);
	};
endif;

/**
* Add the image credits fields to the REST API response
* @param array $object
* @return array $better_image_credits
*
*/
if ( ! function_exists( 'minnpost_largo_get_better_image_credits' ) ) :
	function minnpost_largo_get_better_image_credits( $object ) {
		$meta                 = get_post_meta( $object['id'] );
		$better_image_credits = array(
			'credits'      => isset( $meta['_wp_attachment_source_name'] ) ? $meta['_wp_attachment_source_name'][0] : '',
			'link'         => isset( $meta['_wp_attachment_source_url'] ) ? $meta['_wp_attachment_source_url'][0] : '',
			'license'      => isset( $meta['_wp_attachment_license'] ) ? $meta['_wp_attachment_license'][0] : '',
			'license_link' => isset( $meta['_wp_attachment_license_url'] ) ? $meta['_wp_attachment_license_url'][0] : '',
		);
		return $better_image_credits;
	};
endif;
