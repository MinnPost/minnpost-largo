<?php

  $post_id = get_the_ID();

  global $wpdb;
  $table_name = $wpdb->prefix . 'who_is_running_dataset';
  $query = $wpdb->prepare("SELECT * FROM $table_name WHERE post_id = %d", $post_id);
  $data = $wpdb->get_results($query, ARRAY_A);
  $data_type = "generic";

  if (!$data) {
    $table_name = $wpdb->prefix . 'who_is_running_questions_dataset';
    $query = $wpdb->prepare("SELECT * FROM $table_name WHERE post_id = %d", $post_id);
    $data = $wpdb->get_results($query, ARRAY_A);
    $data_type = "questions";
  }

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
<?php if ($data_type == "generic") { ?>
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
        <select id="district-select" name="district">
          <option value="blank">Choose a district...</option>
          <?php foreach (array_unique(array_column($data, 'office_sought')) as $office_sought) : ?>
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
              $('h2').removeClass('hidden-party')
              $('h3').removeClass('hidden-party')
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
              var allHiddenParty = $(this).find('.data-set:not(.hidden-party)').length === 0;
              var allHiddenDistrict = $(this).find('.data-set:not(.hidden-district)').length === 0;
              if (allHidden && allHiddenDistrict) {
                  $(this).hide();
              }
          });
      });



      $('#district-select').on('change', function() {
          var selectedDistrict = $(this).val();

          $('.parent-group').removeClass('hidden')
          $('.section').removeClass('hidden')

          if (selectedDistrict == "blank") {
            $('.data-set').removeClass('hidden-district');
            $('h2').removeClass('hidden-district')
            $('.parent-group').removeClass('hidden-district')
            $('h3').removeClass('hidden-district')
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
              var dataDistrict2 = $(this).find('h3');
              
              if (selectedDistrict.includes(dataDistrict)) {
                  $(this).find('h2').removeClass('hidden-district');
              } else {
                  $(this).find('h2').addClass('hidden-district');
                  $(this).addClass('hidden');
              }
              dataDistrict2.each(function() {
                if ($(this).data('district') == selectedDistrict) {
                  $(this).removeClass('hidden-district')
                } else {
                  $(this).addClass('hidden-district')
                  $(this).closest('.section').addClass('hidden')
                }
              })
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
<?php } elseif ($data_type == "questions") { ?>
  <div class="who-is-running-listing questions">
    <div class="listing-filter">
      <div class="search-container">
        <input id="listing-search" type="text" placeholder="Search for a candidate, party, region, or district">
      </div>
      <div class="filter-container">
        <select id="district-select" name="district">
          <option value="blank">Choose a city...</option>
          <?php foreach (array_unique(array_column($data, 'office_sought')) as $office_sought) : ?>
              <?php if (!empty(esc_attr($office_sought))) : ?>
                <option value="<?php echo esc_attr(str_replace(' ', '-', $office_sought)); ?>"><?php echo esc_html($office_sought); ?></option>
              <?php endif; ?>
          <?php endforeach; ?>
        </select>
        <select id="city-select" name="party">
          <option value="blank">Choose an office...</option>
          <?php
            $uniqueCities = array_unique(array_column($data, 'city'));

            // Custom sort function
            uasort($uniqueCities, function($a, $b) {
                // Extract numbers from the strings 'Ward x' using regex
                preg_match('/\d+/', $a, $matchesA);
                preg_match('/\d+/', $b, $matchesB);
                
                $numberA = isset($matchesA[0]) ? (int) $matchesA[0] : 0;
                $numberB = isset($matchesB[0]) ? (int) $matchesB[0] : 0;

                // Compare the extracted numbers
                return $numberA <=> $numberB;
            });
          ?>
          <?php foreach ($uniqueCities as $party) : ?>
            <?php if (!empty(esc_attr($party))) : ?>
              <option value="<?php echo esc_attr(str_replace(' ', '-', $party)); ?>"><?php echo esc_html($party); ?></option>
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
                            <div data-city="<?php echo esc_attr(str_replace(' ', '-', $item['city'])); ?>" data-district="<?php echo esc_attr(str_replace(' ', '-', $office_sought)); ?>" class="data-set <?php if (esc_html($item['dropped_out'])) { echo "dropped"; } ?>">
                                <?php if (esc_html($item['headshot_url'])) { ?>
                                  <img src="<?php echo esc_html($item['headshot_url']); ?>" alt="<?php echo esc_html($item['name']); ?>">
                                <?php } else {; ?>
                                <?php }; ?>
                                <h4 class="name"><?php echo esc_html($item['name']); ?></h4>
                                <h5 class="party">
                                  <?php if (esc_html($item['city']) == "Republican") { ?>
                                    <span class="badge republican">R</span>
                                  <?php } elseif (esc_html($item['city']) == "DFL") { ?>
                                    <span class="badge dfl">D</span>
                                  <?php } ?>
                                  <?php echo esc_html($item['city']); ?>
                                  <?php if (esc_html($item['endorsed'])) { ?>
                                    <span>(✔️ Endorsed)</span>
                                  <?php }; ?>
                                </h5>
                                <h5 class="hometown">Lives in: <?php echo esc_html($item['hometown']); ?></h5>
                                <?php if (esc_html($item['incumbent'])) { ?>
                                <h5 class="incumbent">Member of House</h5>
                                <?php }; ?>
                                <?php if (esc_html($item['website'])) { ?>
                                <h5><a target="_blank" class="website" href="<?= esc_html($item['website']); ?>">Campaign website</a></h5>
                                <?php }; ?>
                                <?php if (esc_html($item['dropped_out'])) { ?>
                                <h5>✖️ Out of the race</h5>
                                <?php }; ?>
                                <h5 class="read-qa">Read Q&A <span><svg xmlns="http://www.w3.org/2000/svg" width="21px" height="21px" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.00003 8.5C6.59557 8.5 6.23093 8.74364 6.07615 9.11732C5.92137 9.49099 6.00692 9.92111 6.29292 10.2071L11.2929 15.2071C11.6834 15.5976 12.3166 15.5976 12.7071 15.2071L17.7071 10.2071C17.9931 9.92111 18.0787 9.49099 17.9239 9.11732C17.7691 8.74364 17.4045 8.5 17 8.5H7.00003Z" fill="#000000"/></svg></span></h5>
                                <div class="accordion-container">
                                  <?php if (esc_html($item['answer_1'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_1']); ?></h5>
                                      <p><?php echo esc_html($item['answer_1']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_2'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_2']); ?></h5>
                                      <p><?php echo esc_html($item['answer_2']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_3'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_3']); ?></h5>
                                      <p><?php echo esc_html($item['answer_3']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_4'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_4']); ?></h5>
                                      <p><?php echo esc_html($item['answer_4']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_5'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_5']); ?></h5>
                                      <p><?php echo esc_html($item['answer_5']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_6'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_6']); ?></h5>
                                      <p><?php echo esc_html($item['answer_6']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_7'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_7']); ?></h5>
                                      <p><?php echo esc_html($item['answer_7']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_8'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_8']); ?></h5>
                                      <p><?php echo esc_html($item['answer_8']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_9'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_9']); ?></h5>
                                      <p><?php echo esc_html($item['answer_9']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_10'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_10']); ?></h5>
                                      <p><?php echo esc_html($item['answer_10']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_11'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_11']); ?></h5>
                                      <p><?php echo esc_html($item['answer_11']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_12'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_12']); ?></h5>
                                      <p><?php echo esc_html($item['answer_12']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_13'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_13']); ?></h5>
                                      <p><?php echo esc_html($item['answer_13']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_14'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_14']); ?></h5>
                                      <p><?php echo esc_html($item['answer_14']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_15'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_15']); ?></h5>
                                      <p><?php echo esc_html($item['answer_15']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_16'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_16']); ?></h5>
                                      <p><?php echo esc_html($item['answer_16']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_17'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_17']); ?></h5>
                                      <p><?php echo esc_html($item['answer_17']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_18'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_18']); ?></h5>
                                      <p><?php echo esc_html($item['answer_18']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_19'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_19']); ?></h5>
                                      <p><?php echo esc_html($item['answer_19']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_20'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_20']); ?></h5>
                                      <p><?php echo esc_html($item['answer_20']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_1'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_1']); ?></h5>
                                      <p><?php echo esc_html($item['answer_1']); ?></p>
                                    </div>
                                  <?php } ?>
                                  <?php if (esc_html($item['answer_1'])) { ?> 
                                    <div class="accordion">
                                      <h5><?php echo esc_html($item['question_1']); ?></h5>
                                      <p><?php echo esc_html($item['answer_1']); ?></p>
                                    </div>
                                  <?php } ?>

                                </div>
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

      $('#city-select').on('change', function() {
          var selectedCity = $(this).val();

          // Show all parent-group and headings with data-district
          $('.parent-group, [data-district]').show();

          if (selectedCity == "blank") {
              $('.data-set').removeClass('hidden-party');
              $('h2').removeClass('hidden-party')
              $('h3').removeClass('hidden-party')
              return;
          }

          // Hide elements without the selected party
          $('.data-set').each(function() {
              var dataParty = $(this).data('city');

              if (selectedCity === '' || dataParty === selectedCity) {
                  $(this).removeClass('hidden-party');
              } else {
                  $(this).addClass('hidden-party');
              }
          });

          // Check if all data-set elements have hidden-party class within each parent-group
          $('.parent-group').each(function() {
              var dataCity = $(this).find('h2').data('city');
              
              if (selectedDistrict.includes(dataCity)) {
                  $(this).find('h2').removeClass('hidden-party');
              } else {
                  $(this).find('h2').addClass('hidden-party');
              }
          });
      });



      $('#district-select').on('change', function() {
          var selectedDistrict = $(this).val();

          if (selectedDistrict == "blank") {
            $('.data-set').removeClass('hidden-district');
            $('h2').removeClass('hidden-district')
            $('h3').removeClass('hidden-district')
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
              var dataDistrict2 = $(this).find('h3');
              
              if (selectedDistrict.includes(dataDistrict)) {
                  $(this).find('h2').removeClass('hidden-district');
              } else {
                  $(this).find('h2').addClass('hidden-district');
              }
              dataDistrict2.each(function() {
                if ($(this).data('district') == selectedDistrict) {
                  $(this).removeClass('hidden-district')
                } else {
                  $(this).addClass('hidden-district')
                }
              })
          });
      });

      $('#listing-search').on('input', function() {
          var searchTerm = $(this).val().trim();
          var currentPostID = <?php echo get_the_ID(); ?>; 
          
          $.ajax({
              url: '/wp-admin/admin-ajax.php',
              type: 'POST',
              data: {
                  action: 'search_questions_data',
                  post_id: currentPostID,
                  search_term: searchTerm
              },
              success: function(response) {
                  $('#data-feed-listing').html(response);
              }
          });
      });

      $(document).on('click','.read-qa',function() {
        $(this).toggleClass('active')
        $(this).next().toggleClass('active')
      })
    });
  </script>
<?php }; ?>
<?php }; ?>