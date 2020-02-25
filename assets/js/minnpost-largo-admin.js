;(function($) {
"use strict";

function showHideConditionalValue(value) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if ('gets_emails' === value && '' !== parent) {
    $('.cmb2-message-conditional-value', parent).hide();
    $('.cmb2-message-conditional-emails-value', parent).show();
  } else if ('has_role' === value && '' !== parent) {
    $('.cmb2-message-conditional-value', parent).hide();
    $('.cmb2-message-conditional-roles-value', parent).show();
  }

  if ('gets_emails' !== value && '' !== parent) {
    $('.cmb2-message-conditional-emails-value', parent).hide();
    $('.cmb2-message-conditional-emails-value input:checkbox', parent).prop('checked', false);
  }

  if ('has_role' !== value && '' !== parent) {
    $('.cmb2-message-conditional-roles-value', parent).hide();
    $('.cmb2-message-conditional-roles-value input:checkbox', parent).prop('checked', false);
  }
}

function setupMessageConditional() {
  var conditional_selector = '.cmb2-message-conditional select';

  if ($(conditional_selector).length > 0) {
    showHideConditionalValue($(conditional_selector).val());
    $(document).on('change', conditional_selector, function (event) {
      showHideConditionalValue($(this).val(), $(event.target).closest('.cmb-field-list'));
    });
  }
}

$(document).ready(function (e) {
  setupMessageConditional();
});
"use strict";

function showHideCategoryGroupChoices(radio_value, checkboxes_selector) {
  if ('undefined' === typeof radio_value || '' === radio_value) {
    $(checkboxes_selector).show();
  } else {
    $(checkboxes_selector).hide();
  }
}

function setupCategoryGroupChoices() {
  var category_group_selector = '.cmb2-id--mp-category-group input';
  var grouped_categories_selector = '.cmb2-id--mp-grouped-categories';

  if ($(category_group_selector).length > 0 || $(grouped_categories_selector).length > 0) {
    showHideCategoryGroupChoices($(category_group_selector).val(), grouped_categories_selector);
    $(document).on('change', category_group_selector, function (event) {
      showHideCategoryGroupChoices($(this).val(), grouped_categories_selector);
    });
  }
}

$(document).ready(function (e) {
  setupCategoryGroupChoices();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAxLW1lc3NhZ2VzLmpzIiwiMDItY2F0ZWdvcmllcy5qcyJdLCJuYW1lcyI6WyJzaG93SGlkZUNvbmRpdGlvbmFsVmFsdWUiLCJ2YWx1ZSIsInBhcmVudCIsIiQiLCJoaWRlIiwic2hvdyIsInByb3AiLCJzZXR1cE1lc3NhZ2VDb25kaXRpb25hbCIsImNvbmRpdGlvbmFsX3NlbGVjdG9yIiwibGVuZ3RoIiwidmFsIiwiZG9jdW1lbnQiLCJvbiIsImV2ZW50IiwidGFyZ2V0IiwiY2xvc2VzdCIsInJlYWR5IiwiZSIsInNob3dIaWRlQ2F0ZWdvcnlHcm91cENob2ljZXMiLCJyYWRpb192YWx1ZSIsImNoZWNrYm94ZXNfc2VsZWN0b3IiLCJzZXR1cENhdGVnb3J5R3JvdXBDaG9pY2VzIiwiY2F0ZWdvcnlfZ3JvdXBfc2VsZWN0b3IiLCJncm91cGVkX2NhdGVnb3JpZXNfc2VsZWN0b3IiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0Esd0JBQVQsQ0FBbUNDLEtBQW5DLEVBQXdEO0FBQUEsTUFBZEMsTUFBYyx1RUFBTCxFQUFLOztBQUN2RCxNQUFLLGtCQUFrQkQsS0FBbEIsSUFBMkIsT0FBT0MsTUFBdkMsRUFBZ0Q7QUFDL0NDLElBQUFBLENBQUMsQ0FBRSxpQ0FBRixFQUFxQ0QsTUFBckMsQ0FBRCxDQUErQ0UsSUFBL0M7QUFDQUQsSUFBQUEsQ0FBQyxDQUFFLHdDQUFGLEVBQTRDRCxNQUE1QyxDQUFELENBQXNERyxJQUF0RDtBQUNBLEdBSEQsTUFHTyxJQUFLLGVBQWVKLEtBQWYsSUFBd0IsT0FBT0MsTUFBcEMsRUFBNkM7QUFDbkRDLElBQUFBLENBQUMsQ0FBRSxpQ0FBRixFQUFxQ0QsTUFBckMsQ0FBRCxDQUErQ0UsSUFBL0M7QUFDQUQsSUFBQUEsQ0FBQyxDQUFFLHVDQUFGLEVBQTJDRCxNQUEzQyxDQUFELENBQXFERyxJQUFyRDtBQUNBOztBQUNELE1BQUssa0JBQWtCSixLQUFsQixJQUEyQixPQUFPQyxNQUF2QyxFQUFnRDtBQUMvQ0MsSUFBQUEsQ0FBQyxDQUFFLHdDQUFGLEVBQTRDRCxNQUE1QyxDQUFELENBQXNERSxJQUF0RDtBQUNBRCxJQUFBQSxDQUFDLENBQUUsdURBQUYsRUFBMkRELE1BQTNELENBQUQsQ0FBcUVJLElBQXJFLENBQTJFLFNBQTNFLEVBQXNGLEtBQXRGO0FBQ0E7O0FBQ0QsTUFBSyxlQUFlTCxLQUFmLElBQXdCLE9BQU9DLE1BQXBDLEVBQTZDO0FBQzVDQyxJQUFBQSxDQUFDLENBQUUsdUNBQUYsRUFBMkNELE1BQTNDLENBQUQsQ0FBcURFLElBQXJEO0FBQ0FELElBQUFBLENBQUMsQ0FBRSxzREFBRixFQUEwREQsTUFBMUQsQ0FBRCxDQUFvRUksSUFBcEUsQ0FBMEUsU0FBMUUsRUFBcUYsS0FBckY7QUFDQTtBQUNEOztBQUVELFNBQVNDLHVCQUFULEdBQW1DO0FBQ2xDLE1BQUlDLG9CQUFvQixHQUFHLGtDQUEzQjs7QUFDQSxNQUFLTCxDQUFDLENBQUVLLG9CQUFGLENBQUQsQ0FBMEJDLE1BQTFCLEdBQW1DLENBQXhDLEVBQTRDO0FBQzNDVCxJQUFBQSx3QkFBd0IsQ0FBRUcsQ0FBQyxDQUFFSyxvQkFBRixDQUFELENBQTBCRSxHQUExQixFQUFGLENBQXhCO0FBQ0FQLElBQUFBLENBQUMsQ0FBRVEsUUFBRixDQUFELENBQWNDLEVBQWQsQ0FBa0IsUUFBbEIsRUFBNEJKLG9CQUE1QixFQUFrRCxVQUFVSyxLQUFWLEVBQWtCO0FBQ25FYixNQUFBQSx3QkFBd0IsQ0FBRUcsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVTyxHQUFWLEVBQUYsRUFBbUJQLENBQUMsQ0FBRVUsS0FBSyxDQUFDQyxNQUFSLENBQUQsQ0FBa0JDLE9BQWxCLENBQTJCLGlCQUEzQixDQUFuQixDQUF4QjtBQUNBLEtBRkQ7QUFHQTtBQUNEOztBQUVEWixDQUFDLENBQUVRLFFBQUYsQ0FBRCxDQUFjSyxLQUFkLENBQXFCLFVBQVdDLENBQVgsRUFBZTtBQUNuQ1YsRUFBQUEsdUJBQXVCO0FBQ3ZCLENBRkQ7OztBQzVCQSxTQUFTVyw0QkFBVCxDQUF1Q0MsV0FBdkMsRUFBb0RDLG1CQUFwRCxFQUEwRTtBQUN6RSxNQUFLLGdCQUFnQixPQUFPRCxXQUF2QixJQUFzQyxPQUFPQSxXQUFsRCxFQUFnRTtBQUMvRGhCLElBQUFBLENBQUMsQ0FBRWlCLG1CQUFGLENBQUQsQ0FBeUJmLElBQXpCO0FBQ0EsR0FGRCxNQUVPO0FBQ05GLElBQUFBLENBQUMsQ0FBRWlCLG1CQUFGLENBQUQsQ0FBeUJoQixJQUF6QjtBQUNBO0FBQ0Q7O0FBRUQsU0FBU2lCLHlCQUFULEdBQXFDO0FBQ3BDLE1BQUlDLHVCQUF1QixHQUFPLG1DQUFsQztBQUNBLE1BQUlDLDJCQUEyQixHQUFHLGlDQUFsQzs7QUFDQSxNQUFLcEIsQ0FBQyxDQUFFbUIsdUJBQUYsQ0FBRCxDQUE2QmIsTUFBN0IsR0FBc0MsQ0FBdEMsSUFBMkNOLENBQUMsQ0FBRW9CLDJCQUFGLENBQUQsQ0FBaUNkLE1BQWpDLEdBQTBDLENBQTFGLEVBQThGO0FBQzdGUyxJQUFBQSw0QkFBNEIsQ0FBRWYsQ0FBQyxDQUFFbUIsdUJBQUYsQ0FBRCxDQUE2QlosR0FBN0IsRUFBRixFQUFzQ2EsMkJBQXRDLENBQTVCO0FBQ0FwQixJQUFBQSxDQUFDLENBQUVRLFFBQUYsQ0FBRCxDQUFjQyxFQUFkLENBQWtCLFFBQWxCLEVBQTRCVSx1QkFBNUIsRUFBcUQsVUFBVVQsS0FBVixFQUFrQjtBQUN0RUssTUFBQUEsNEJBQTRCLENBQUVmLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVU8sR0FBVixFQUFGLEVBQW1CYSwyQkFBbkIsQ0FBNUI7QUFDQSxLQUZEO0FBR0E7QUFDRDs7QUFFRHBCLENBQUMsQ0FBRVEsUUFBRixDQUFELENBQWNLLEtBQWQsQ0FBcUIsVUFBV0MsQ0FBWCxFQUFlO0FBQ25DSSxFQUFBQSx5QkFBeUI7QUFDekIsQ0FGRCIsImZpbGUiOiJtaW5ucG9zdC1sYXJnby1hZG1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHNob3dIaWRlQ29uZGl0aW9uYWxWYWx1ZSggdmFsdWUsIHBhcmVudCA9ICcnICkge1xuXHRpZiAoICdnZXRzX2VtYWlscycgPT09IHZhbHVlICYmICcnICE9PSBwYXJlbnQgKSB7XG5cdFx0JCggJy5jbWIyLW1lc3NhZ2UtY29uZGl0aW9uYWwtdmFsdWUnLCBwYXJlbnQgKS5oaWRlKCk7XG5cdFx0JCggJy5jbWIyLW1lc3NhZ2UtY29uZGl0aW9uYWwtZW1haWxzLXZhbHVlJywgcGFyZW50ICkuc2hvdygpO1xuXHR9IGVsc2UgaWYgKCAnaGFzX3JvbGUnID09PSB2YWx1ZSAmJiAnJyAhPT0gcGFyZW50ICkge1xuXHRcdCQoICcuY21iMi1tZXNzYWdlLWNvbmRpdGlvbmFsLXZhbHVlJywgcGFyZW50ICkuaGlkZSgpO1xuXHRcdCQoICcuY21iMi1tZXNzYWdlLWNvbmRpdGlvbmFsLXJvbGVzLXZhbHVlJywgcGFyZW50ICkuc2hvdygpO1xuXHR9XG5cdGlmICggJ2dldHNfZW1haWxzJyAhPT0gdmFsdWUgJiYgJycgIT09IHBhcmVudCApIHtcblx0XHQkKCAnLmNtYjItbWVzc2FnZS1jb25kaXRpb25hbC1lbWFpbHMtdmFsdWUnLCBwYXJlbnQgKS5oaWRlKCk7XG5cdFx0JCggJy5jbWIyLW1lc3NhZ2UtY29uZGl0aW9uYWwtZW1haWxzLXZhbHVlIGlucHV0OmNoZWNrYm94JywgcGFyZW50ICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHR9XG5cdGlmICggJ2hhc19yb2xlJyAhPT0gdmFsdWUgJiYgJycgIT09IHBhcmVudCApIHtcblx0XHQkKCAnLmNtYjItbWVzc2FnZS1jb25kaXRpb25hbC1yb2xlcy12YWx1ZScsIHBhcmVudCApLmhpZGUoKTtcblx0XHQkKCAnLmNtYjItbWVzc2FnZS1jb25kaXRpb25hbC1yb2xlcy12YWx1ZSBpbnB1dDpjaGVja2JveCcsIHBhcmVudCApLnByb3AoICdjaGVja2VkJywgZmFsc2UgKTtcblx0fVxufVxuXG5mdW5jdGlvbiBzZXR1cE1lc3NhZ2VDb25kaXRpb25hbCgpIHtcblx0dmFyIGNvbmRpdGlvbmFsX3NlbGVjdG9yID0gJy5jbWIyLW1lc3NhZ2UtY29uZGl0aW9uYWwgc2VsZWN0Jztcblx0aWYgKCAkKCBjb25kaXRpb25hbF9zZWxlY3RvciApLmxlbmd0aCA+IDAgKSB7XG5cdFx0c2hvd0hpZGVDb25kaXRpb25hbFZhbHVlKCAkKCBjb25kaXRpb25hbF9zZWxlY3RvciApLnZhbCgpICk7XG5cdFx0JCggZG9jdW1lbnQgKS5vbiggJ2NoYW5nZScsIGNvbmRpdGlvbmFsX3NlbGVjdG9yLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRzaG93SGlkZUNvbmRpdGlvbmFsVmFsdWUoICQoIHRoaXMgKS52YWwoKSwgJCggZXZlbnQudGFyZ2V0ICkuY2xvc2VzdCggJy5jbWItZmllbGQtbGlzdCcgKSApO1xuXHRcdH0pO1xuXHR9XG59XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uICggZSApIHtcblx0c2V0dXBNZXNzYWdlQ29uZGl0aW9uYWwoKTtcbn0pO1xuIiwiZnVuY3Rpb24gc2hvd0hpZGVDYXRlZ29yeUdyb3VwQ2hvaWNlcyggcmFkaW9fdmFsdWUsIGNoZWNrYm94ZXNfc2VsZWN0b3IgKSB7XG5cdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiByYWRpb192YWx1ZSB8fCAnJyA9PT0gcmFkaW9fdmFsdWUgKSB7XG5cdFx0JCggY2hlY2tib3hlc19zZWxlY3RvciApLnNob3coKTtcblx0fSBlbHNlIHtcblx0XHQkKCBjaGVja2JveGVzX3NlbGVjdG9yICkuaGlkZSgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHNldHVwQ2F0ZWdvcnlHcm91cENob2ljZXMoKSB7XG5cdHZhciBjYXRlZ29yeV9ncm91cF9zZWxlY3RvciAgICAgPSAnLmNtYjItaWQtLW1wLWNhdGVnb3J5LWdyb3VwIGlucHV0Jztcblx0dmFyIGdyb3VwZWRfY2F0ZWdvcmllc19zZWxlY3RvciA9ICcuY21iMi1pZC0tbXAtZ3JvdXBlZC1jYXRlZ29yaWVzJztcblx0aWYgKCAkKCBjYXRlZ29yeV9ncm91cF9zZWxlY3RvciApLmxlbmd0aCA+IDAgfHwgJCggZ3JvdXBlZF9jYXRlZ29yaWVzX3NlbGVjdG9yICkubGVuZ3RoID4gMCApIHtcblx0XHRzaG93SGlkZUNhdGVnb3J5R3JvdXBDaG9pY2VzKCAkKCBjYXRlZ29yeV9ncm91cF9zZWxlY3RvciApLnZhbCgpLCBncm91cGVkX2NhdGVnb3JpZXNfc2VsZWN0b3IgKTtcblx0XHQkKCBkb2N1bWVudCApLm9uKCAnY2hhbmdlJywgY2F0ZWdvcnlfZ3JvdXBfc2VsZWN0b3IsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdHNob3dIaWRlQ2F0ZWdvcnlHcm91cENob2ljZXMoICQoIHRoaXMgKS52YWwoKSwgZ3JvdXBlZF9jYXRlZ29yaWVzX3NlbGVjdG9yICk7XG5cdFx0fSk7XG5cdH1cbn1cblxuJCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24gKCBlICkge1xuXHRzZXR1cENhdGVnb3J5R3JvdXBDaG9pY2VzKCk7XG59KTtcbiJdfQ==
}(jQuery));
