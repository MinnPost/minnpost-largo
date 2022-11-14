<?php
/**
 * Single Event Template
 * A single event. This displays the event title, description, meta, and
 * optionally, the Google map for the event.
 *
 * This overrides the default the-events-calendar/views/single-event.php
 */

//get_header(); ?>

	
			<?php
			while ( have_posts() ) :
				the_post();
				get_template_part( 'template-parts/content', 'event' );
			endwhile; // End of the loop.
			?>
		

<?php
//get_sidebar();
//get_footer();
