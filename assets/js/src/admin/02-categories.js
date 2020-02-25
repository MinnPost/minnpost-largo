function showHideCategoryGroupChoices( radio_value, checkboxes_selector ) {
	if ( '' === radio_value ) {
		$( checkboxes_selector ).show();
	} else {
		$( checkboxes_selector ).hide();
	}
}

function setupCategoryGroupChoices() {
	var category_group_selector     = '.cmb2-id--mp-category-group input';
	var grouped_categories_selector = '.cmb2-id--mp-grouped-categories';
	if ( $( category_group_selector ).length > 0 || $( grouped_categories_selector ).length > 0 ) {
		showHideCategoryGroupChoices( $( category_group_selector ).val(), grouped_categories_selector );
		$( document ).on( 'change', category_group_selector, function( event ) {
			showHideCategoryGroupChoices( $( this ).val(), grouped_categories_selector );
		});
	}
}

$( document ).ready( function ( e ) {
	setupCategoryGroupChoices();
});
