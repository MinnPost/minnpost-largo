<?php

  $post_id = get_the_ID();

  global $wpdb;
  $table_name = $wpdb->prefix . 'who_is_running_dataset';
  $query = $wpdb->prepare("SELECT * FROM $table_name WHERE post_id = %d", $post_id);
  $data = $wpdb->get_results($query, ARRAY_A);

  $nested_sectioned_data = array();
  foreach ($data as $item) {
      $office_sought = $item['office_sought'];
      $parent_group = get_parent_group($office_sought);
  
      if (!isset($nested_sectioned_data[$parent_group])) {
          $nested_sectioned_data[$parent_group] = array();
      }
      if (!isset($nested_sectioned_data[$parent_group][$office_sought])) {
          $nested_sectioned_data[$parent_group][$office_sought] = array();
      }
      $nested_sectioned_data[$parent_group][$office_sought][] = $item;
  }

  function get_parent_group($office_sought) {
    if (preg_match('/^(.*?)(\d+)$/', $office_sought, $matches)) {
      return $matches[1];
    }
    
    return $office_sought;
  }
?>
<?php if ($data) { ?>
<div class="who-is-running-listing">
    <div class="listing-filter">
      <div class="search-container">
        <input id="listing-search" type="text" placeholder="Search for a candidate, party, region, or district">
      </div>
      <div class="filter-container">
        <select id="party-select" name="party">
          <option value="blank">Choose a party...</option>
          <?php foreach (array_unique(array_column($data, 'party')) as $party) : ?>
            <?php if (!empty(esc_attr($party))) : ?>
              <option value="<?php echo esc_attr(str_replace(' ', '-', $party)); ?>"><?php echo esc_html($party); ?></option>
            <?php endif; ?>
          <?php endforeach; ?>
        </select>
        <select id="region-select" name="region">
          <option value="blank">Choose a region...</option>
        </select>
        <select id="district-select" name="district">
          <option value="blank">Choose a district...</option>
          <?php foreach (array_keys($nested_sectioned_data) as $office_sought) : ?>
              <?php if (!empty(esc_attr($office_sought))) : ?>
                <option value="<?php echo esc_attr(str_replace(' ', '-', $office_sought)); ?>"><?php echo esc_html($office_sought); ?></option>
              <?php endif; ?>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="no-longer-running">
        <div id="show-non-running"><span></span></div>
        Show candidates who are no longer running
      </div>
    </div>
    <div id="data-feed-listing" class="listing-container">
      <?php foreach ($nested_sectioned_data as $parent_group => $section_data) : ?>
          <div class="parent-group">
              <h2 data-district="<?php echo esc_attr(str_replace(' ', '-', $parent_group)); ?>"><?php echo esc_html($parent_group); ?></h2>
              <?php foreach ($section_data as $office_sought => $group_data) : ?>
                  <div class="section">
                    <?php if (esc_html($office_sought) != esc_html($parent_group)): ?>
                      <h3 data-district="<?php echo esc_attr(str_replace(' ', '-', $office_sought)); ?>"><?php echo esc_html($office_sought); ?></h3>
                    <?php endif; ?>
                      <div class="data-set-container">
                        <?php foreach ($group_data as $item) : ?>
                          <?php if (esc_html($item['name'])) : ?>
                            <div data-party="<?php echo esc_attr(str_replace(' ', '-', $item['party'])); ?>" data-district="<?php echo esc_attr(str_replace(' ', '-', $office_sought)); ?>" class="data-set <?php if (esc_html($item['dropped_out'])) { echo "dropped"; } ?>">
                                <?php if (esc_html($item['headshot_url'])) { ?>
                                  <img src="<?php echo esc_html($item['headshot_url']); ?>" alt="<?php echo esc_html($item['name']); ?>">
                                <?php } else {; ?>
                                  <img src="/wp-content/uploads/2023/08/placeholder-user.png" alt="<?php echo esc_html($item['name']); ?>">
                                <?php }; ?>
                                <h4 class="name"><?php echo esc_html($item['name']); ?></h4>
                                <h5 class="party">
                                  <?php if (esc_html($item['party']) == "Republican") { ?>
                                    <span class="badge republican">R</span>
                                  <?php } elseif (esc_html($item['party']) == "DFL") { ?>
                                    <span class="badge dfl">D</span>
                                  <?php } ?>
                                  <?php echo esc_html($item['party']); ?>
                                  <?php if (esc_html($item['endorsed'])) { ?>
                                    <span>(✔️ Endorsed)</span>
                                  <?php }; ?>
                                </h5>
                                <h5 class="hometown">🏠 Lives in: <?php echo esc_html($item['hometown']); ?></h5>
                                <?php if (esc_html($item['incumbent'])) { ?>
                                <h5 class="incumbent">⭐ Member of House</h5>
                                <?php }; ?>
                                <?php if (esc_html($item['website'])) { ?>
                                <h5>🔗 <a target="_blank" class="website" href="<?= esc_html($item['website']); ?>">Campaign website</a></h5>
                                <?php }; ?>
                                <?php if (esc_html($item['dropped_out'])) { ?>
                                <h5>✖️ Out of the race</h5>
                                <?php }; ?>
                                <p class="blurb"><?php echo wp_kses_post($item['blurb']); ?></p>
                            </div>
                            <?php endif; ?>
                        <?php endforeach; ?>
                      </div>
                  </div>
              <?php endforeach; ?>
          </div>
      <?php endforeach; ?>
    </div>
</div>

<script>
  jQuery(document).ready(function ($) {
    // who's running page related
    $(document).on("click", "#show-non-running", function () {
      $(this).toggleClass("active");
      $('.data-set.dropped').toggleClass('active');
    });

    $('#party-select').on('change', function() {
        var selectedParty = $(this).val();

        // Show all parent-group and headings with data-district
        $('.parent-group, [data-district]').show();

        if (selectedParty == "blank") {
            $('.data-set').removeClass('hidden-party');
            return;
        }

        // Hide elements without the selected party
        $('.data-set').each(function() {
            var dataParty = $(this).data('party');

            if (selectedParty === '' || dataParty === selectedParty) {
                $(this).removeClass('hidden-party');
            } else {
                $(this).addClass('hidden-party');
            }
        });

        // Check if all data-set elements have hidden-party class within each parent-group
        $('.parent-group').each(function() {
            var allHidden = $(this).find('.data-set:not(.hidden-party)').length === 0;
            if (allHidden) {
                $(this).hide();
            }
        });
    });



    $('#district-select').on('change', function() {
        var selectedDistrict = $(this).val();

        if (selectedDistrict == "blank") {
          $('.data-set').removeClass('hidden-district');
          return;
        }
        
        // Hide elements without the selected party
        $('.data-set').each(function() {
            var dataDistrict = $(this).data('district');
            
            if (selectedDistrict === '' || dataDistrict === selectedDistrict) {
                $(this).removeClass('hidden-district');
            } else {
                $(this).addClass('hidden-district');
            }
        });

        $('.parent-group').each(function() {
            var dataDistrict = $(this).find('h2').data('district');
            var dataDistrict2 = $(this).find('h3').data('district');
            
            if (dataDistrict === selectedDistrict) {
                $(this).find('h2').removeClass('hidden-district');
            } else {
                $(this).find('h2').addClass('hidden-district');
            }
            if (dataDistrict2 === selectedDistrict) {
                $(this).find('h3').removeClass('hidden-district');
            } else {
                $(this).find('h3').addClass('hidden-district');
            }
        });
    });

    $('#listing-search').on('input', function() {
        var searchTerm = $(this).val().trim();
        var currentPostID = <?php echo get_the_ID(); ?>; 
        
        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            type: 'POST',
            data: {
                action: 'search_data',
                post_id: currentPostID,
                search_term: searchTerm
            },
            success: function(response) {
                $('#data-feed-listing').html(response);
            }
        });
    });
  });
</script>
<?php }; ?>