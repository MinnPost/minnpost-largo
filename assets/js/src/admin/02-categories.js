function showHideCategoryGroupChoices( radioValue, checkboxesSelector ) {
	if ( 'undefined' === typeof radioValue || '' === radioValue ) {
		$( checkboxesSelector ).show();
	} else {
		$( checkboxesSelector ).hide();
	}
}

function setupCategoryGroupChoices() {
	var categoryGroupSelector     = '.cmb2-id--mp-category-group input:checked';
	var groupedCategoriesSelector = '.cmb2-id--mp-category-grouped-categories';
	if ( 0 < $( categoryGroupSelector ).length || 0 < $( groupedCategoriesSelector ).length ) {
		showHideCategoryGroupChoices( $( categoryGroupSelector ).val(), groupedCategoriesSelector );
		$( document ).on( 'change', categoryGroupSelector, function() {
			showHideCategoryGroupChoices( $( this ).val(), groupedCategoriesSelector );
		} );
	}
}

$( document ).ready( function() {
	setupCategoryGroupChoices();
} );
