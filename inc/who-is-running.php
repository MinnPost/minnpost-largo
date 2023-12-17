<?php 

function add_csv_upload_meta_box() {
	add_meta_box(
			'csv_upload_meta_box',
			'Upload CSV (Who\'s running for dataset)',
			'render_csv_upload_meta_box',
			'post',
			'normal',
			'high'
	);
}

add_action('add_meta_boxes', 'add_csv_upload_meta_box');

function render_csv_upload_meta_box($post) {
    wp_nonce_field('csv_upload_nonce', 'csv_upload_nonce');
    
    // Get the CSV file details
    $csv_file_url = get_post_meta($post->ID, 'csv_file_url', true);
    
    ?>
        <input type="file" name="csv_file" id="csv_file">
        
        <?php if ($csv_file_url) : ?>
            <p>Uploaded CSV file: <?php echo basename($csv_file_url); ?></p>
        <?php endif; ?>
        
        <?php wp_nonce_field('save_csv_file', 'csv_nonce'); ?>
    <?php
}

function add_enctype_to_post_form() {
  ?>
  <script>
      document.addEventListener('DOMContentLoaded', function() {
          var postForm = document.querySelector('form#post');
          
          if (postForm) {
              postForm.setAttribute('enctype', 'multipart/form-data');
          }
      });
  </script>
  <?php
}
add_action('admin_print_scripts', 'add_enctype_to_post_form');



function save_csv_file($post_id) {
  if (!isset($_POST['csv_upload_nonce']) || !wp_verify_nonce($_POST['csv_upload_nonce'], 'csv_upload_nonce')) {
      return;
  }

  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
      return;
  }

  if (!current_user_can('edit_post', $post_id)) {
      return;
  }

  error_log("Files :/:/:/:/ " . print_r($_FILES['csv_file']));


  if (!empty($_FILES['csv_file'])) {
      $csv_file = $_FILES['csv_file']['tmp_name'];
      
      $upload_dir = wp_upload_dir();
      $csv_file_name = sanitize_file_name($_FILES['csv_file']['name']);
      $csv_file_url = $upload_dir['url'] . '/' . $csv_file_name;
      update_post_meta($post_id, 'csv_file_url', $csv_file_url);

      if ($csv_file_name == "") {
        return;
      }
      $csv_data = array_map('str_getcsv', file($csv_file));

      global $wpdb;

      // Determine the type of CSV based on the column header
      $csv_type = strtolower($csv_data[0][1]); // Assuming "party" or "city" is the third column

      if ($csv_type == 'party') {
        $table_name = $wpdb->prefix . 'who_is_running_dataset';

        $wpdb->delete(
            $table_name,
            array('post_id' => $post_id),
            array('%d')
        );
  
        array_shift($csv_data);
        foreach ($csv_data as $row) {
            $data = [
                'post_id' => $post_id,
                'name' => $row[0],
                'office_sought' => $row[1],
                'party' => $row[2],
                'hometown' => $row[3],
                'incumbent' => convert_csv_boolean_to_db_value($row[4]),
                'endorsed' => convert_csv_boolean_to_db_value($row[5]),
                'dropped_out' => convert_csv_boolean_to_db_value($row[6]),
                'date_added' => convert_csv_date_to_mysql_format($row[7]),
                'date_dropped_out' => convert_csv_date_to_mysql_format($row[8]),
                'approved' => convert_csv_boolean_to_db_value($row[9]),
                'blurb' => str_replace(array("\r\n", "\r", "\n"), '', $row[10]),
                'headshot_url' => $row[11],
                'website' => $row[12]
            ];
  
            $data['post_id'] = $post_id;
  
            $wpdb->insert($table_name, $data);
        }
      } elseif ($csv_type == "city") {
        $table_name = $wpdb->prefix . 'who_is_running_questions_dataset';

        $wpdb->delete(
            $table_name,
            array('post_id' => $post_id),
            array('%d')
        );
  
        $headings = array_shift($csv_data);
        $end_question_col = array_search('website', $headings); // Find the index of 'website' heading

        foreach ($csv_data as $row) {
            // ... your existing code to process common data
        
            // Assuming the first question starts at column index 10
            $start_question_col = 10;
        
            $data = [
                'post_id' => $post_id,
                'name' => $row[0],
                'office_sought' => $row[2],
                'city' => $row[1], // Assuming 'city' corresponds to the new 'city' column
                'hometown' => $row[4],
                'incumbent' => convert_csv_boolean_to_db_value($row[5]),
                'endorsed' => convert_csv_boolean_to_db_value($row[6]),
                'dropped_out' => convert_csv_boolean_to_db_value($row[7]),
                'date_added' => convert_csv_date_to_mysql_format($row[8]),
                'date_dropped_out' => convert_csv_date_to_mysql_format($row[9]),
                'approved' => convert_csv_boolean_to_db_value($row[10]),
            ];
        
            for ($i = $start_question_col; $i < $end_question_col; $i++) {
                $data['question_' . ($i - $start_question_col + 1)] = $headings[$i];
                $data['answer_' . ($i - $start_question_col + 1)] = $row[$i];
            }
        
            // Populate 'website' from the last column (assumption)
            $data['website'] = end($row);
        
            $wpdb->insert($table_name, $data);
        }
        
      }
  }
}

function convert_csv_date_to_mysql_format($csv_date) {
  $date = DateTime::createFromFormat('m/d/Y', $csv_date);
  return $date ? $date->format('Y-m-d') : ''; 
}

function convert_csv_boolean_to_db_value($csv_value) {
  return strtolower($csv_value) === 'x' ? 1 : 0;
}

add_action('save_post', 'save_csv_file');

function create_who_is_running_dataset_table() {
	global $wpdb;
	$table_name = $wpdb->prefix . 'who_is_running_dataset';

	$sql = "CREATE TABLE IF NOT EXISTS $table_name (
			id INT AUTO_INCREMENT PRIMARY KEY,
			post_id VARCHAR(255),
			name VARCHAR(255),
			office_sought VARCHAR(255),
			party VARCHAR(255),
			hometown VARCHAR(255),
			incumbent BOOLEAN,
			endorsed BOOLEAN,
			dropped_out BOOLEAN,
			date_added DATE,
			date_dropped_out DATE,
			approved BOOLEAN,
			blurb VARCHAR(255),
			headshot_url VARCHAR(255),
			website VARCHAR(255)
	)";

	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
	dbDelta($sql);
}

add_action('admin_init', 'create_who_is_running_dataset_table');

function create_who_is_running_questions_dataset_table() {
	global $wpdb;
	$table_name = $wpdb->prefix . 'who_is_running_questions_dataset';

	$sql = "CREATE TABLE IF NOT EXISTS $table_name (
			id INT AUTO_INCREMENT PRIMARY KEY,
			post_id VARCHAR(255),
			name VARCHAR(255),
			office_sought VARCHAR(255),
			city VARCHAR(255),
			hometown VARCHAR(255),
			incumbent BOOLEAN,
			endorsed BOOLEAN,
			dropped_out BOOLEAN,
			date_added DATE,
			date_dropped_out DATE,
			approved BOOLEAN,
			question_1 TEXT,
            answer_1 TEXT,
			question_2 TEXT,
            answer_2 TEXT,
			question_3 TEXT,
            answer_3 TEXT,
			question_4 TEXT,
            answer_4 TEXT,
			question_5 TEXT,
            answer_5 TEXT,
			question_6 TEXT,
            answer_6 TEXT,
			question_7 TEXT,
            answer_7 TEXT,
			question_8 TEXT,
            answer_8 TEXT,
			question_9 TEXT,
            answer_9 TEXT,
			question_10 TEXT,
            answer_10 TEXT,
			question_11 TEXT,
            answer_11 TEXT,
			question_12 TEXT,
            answer_12 TEXT,
			question_13 TEXT,
            answer_13 TEXT,
			question_14 TEXT,
            answer_14 TEXT,
			question_15 TEXT,
            answer_15 TEXT,
			question_16 TEXT,
            answer_16 TEXT,
			question_17 TEXT,
            answer_17 TEXT,
			question_18 TEXT,
            answer_18 TEXT,
			question_19 TEXT,
            answer_19 TEXT,
			question_20 TEXT,
            answer_20 TEXT,
			website VARCHAR(255)
	)";

	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
	dbDelta($sql);
}

add_action('admin_init', 'create_who_is_running_questions_dataset_table');


add_action('wp_ajax_search_data', 'ajax_search_data');
add_action('wp_ajax_nopriv_search_data', 'ajax_search_data'); // For non-logged-in users

function ajax_search_data() {
    $search_term = sanitize_text_field($_POST['search_term']);
    $post_id = intval($_POST['post_id']); 

    // Modify the query to filter based on the search term
    global $wpdb;
    $table_name = $wpdb->prefix . 'who_is_running_dataset';
    $query = $wpdb->prepare("SELECT * FROM $table_name WHERE post_id = %d AND (name LIKE %s OR party LIKE %s OR office_sought LIKE %s)", $post_id, '%' . $wpdb->esc_like($search_term) . '%', '%' . $wpdb->esc_like($search_term) . '%', '%' . $wpdb->esc_like($search_term) . '%');
    $filtered_data = $wpdb->get_results($query, ARRAY_A);


    $nested_sectioned_data = array();

    function get_parent_group($office_sought) {
        if (preg_match('/^(.*?)(\d+)$/', $office_sought, $matches)) {
          return $matches[1];
        }
        
        return $office_sought;
      }
      
    foreach ($filtered_data as $item) {
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


    foreach ($nested_sectioned_data as $parent_group => $section_data) : 
        $html_output .= '<div class="parent-group">';
        $html_output .= '<h2 data-district="' . esc_attr(str_replace(' ', '-', $parent_group)) . '">' . esc_html($parent_group) . '</h2>';
        foreach ($section_data as $office_sought => $group_data) {
            $html_output .= '<div class="section">';
            if (esc_html($office_sought) != esc_html($parent_group)) {
                $html_output .= '<h3 data-district="' . esc_attr(str_replace(' ', '-', $office_sought)) . '">' . esc_html($office_sought) . '</h3>';
            }
            $html_output .= '<div class="data-set-container">';
            foreach ($group_data as $item) {
                if (esc_html($item['name'])) {
                    $html_output .= '<div data-party="' . esc_attr(str_replace(' ', '-', $item['party'])) . '" data-district="' . esc_attr(str_replace(' ', '-', $office_sought)) . '" class="data-set ' . (esc_html($item['dropped_out']) ? 'dropped' : '') . '">';
                    if (esc_html($item['headshot_url'])) {
                        $html_output .= '<img src="' . esc_html($item['headshot_url']) . '" alt="' . esc_html($item['name']) . '">';
                    } else {
                        $html_output .= '<img src="/wp-content/uploads/2023/08/placeholder-user.png" alt="' . esc_html($item['name']) . '">';
                    }
                    $html_output .= '<h4 class="name">' . esc_html($item['name']) . '</h4>';
                    $html_output .= '<h5 class="party">';
                    if (esc_html($item['party']) == "Republican") {
                        $html_output .= '<span class="badge republican">R</span>';
                    } elseif (esc_html($item['party']) == "DFL") {
                        $html_output .= '<span class="badge dfl">D</span>';
                    }
                    $html_output .= esc_html($item['party']);
                    if (esc_html($item['endorsed'])) {
                        $html_output .= '<span>(✔️ Endorsed)</span>';
                    }
                    $html_output .= '</h5>';
                    $html_output .= '<h5 class="hometown">🏠 Lives in: ' . esc_html($item['hometown']) . '</h5>';
                    if (esc_html($item['incumbent'])) {
                        $html_output .= '<h5 class="incumbent">⭐ Incumbent</h5>';
                    }
                    if (esc_html($item['website'])) {
                        $html_output .= '<h5>🔗 <a target="_blank" class="website" href="' . esc_html($item['website']) . '">Campaign website</a></h5>';
                    }
                    if (esc_html($item['dropped_out'])) {
                        $html_output .= '<h5>✖️ Out of the race</h5>';
                    }
                    $html_output .= '<p class="blurb">' . wp_kses_post($item['blurb']) . '</p>';
                    $html_output .= '</div>';
                }
            }
            $html_output .= '</div>';
            $html_output .= '</div>';
        }
        $html_output .= '</div>';
    endforeach;

    // Echo the HTML markup as the response
    echo $html_output;
    wp_die();
}

add_action('wp_ajax_search_questions_data', 'ajax_search_questions_data');
add_action('wp_ajax_nopriv_search_questions_data', 'ajax_search_questions_data'); // For non-logged-in users

function ajax_search_questions_data() {
    $search_term = sanitize_text_field($_POST['search_term']);
    $post_id = intval($_POST['post_id']); 

    // Modify the query to filter based on the search term
    global $wpdb;
    $table_name = $wpdb->prefix . 'who_is_running_questions_dataset';
    $query = $wpdb->prepare("SELECT * FROM $table_name WHERE post_id = %d AND (name LIKE %s OR city LIKE %s OR office_sought LIKE %s)", $post_id, '%' . $wpdb->esc_like($search_term) . '%', '%' . $wpdb->esc_like($search_term) . '%', '%' . $wpdb->esc_like($search_term) . '%');
    $filtered_data = $wpdb->get_results($query, ARRAY_A);


    $nested_sectioned_data = array();

    function get_parent_group($office_sought) {
        if (preg_match('/^(.*?)(\d+)$/', $office_sought, $matches)) {
          return $matches[1];
        }
        
        return $office_sought;
      }
      
    foreach ($filtered_data as $item) {
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


    foreach ($nested_sectioned_data as $parent_group => $section_data) : 
        $html_output .= '<div class="parent-group">';
        $html_output .= '<h2 data-district="' . esc_attr(str_replace(' ', '-', $parent_group)) . '">' . esc_html($parent_group) . '</h2>';
        foreach ($section_data as $office_sought => $group_data) {
            $html_output .= '<div class="section">';
            if (esc_html($office_sought) != esc_html($parent_group)) {
                $html_output .= '<h3 data-district="' . esc_attr(str_replace(' ', '-', $office_sought)) . '">' . esc_html($office_sought) . '</h3>';
            }
            $html_output .= '<div class="data-set-container">';
            foreach ($group_data as $item) {
                if (esc_html($item['name'])) {
                    $html_output .= '<div data-city="' . esc_attr(str_replace(' ', '-', $item['city'])) . '" data-district="' . esc_attr(str_replace(' ', '-', $office_sought)) . '" class="data-set ' . (esc_html($item['dropped_out']) ? 'dropped' : '') . '">';
                    if (esc_html($item['headshot_url'])) {
                        $html_output .= '<img src="' . esc_html($item['headshot_url']) . '" alt="' . esc_html($item['name']) . '">';
                    } 
                    $html_output .= '<h4 class="name">' . esc_html($item['name']) . '</h4>';
                    $html_output .= '<h5 class="party">';
                    if (esc_html($item['city']) == "Republican") {
                        $html_output .= '<span class="badge republican">R</span>';
                    } elseif (esc_html($item['city']) == "DFL") {
                        $html_output .= '<span class="badge dfl">D</span>';
                    }
                    $html_output .= esc_html($item['city']);
                    if (esc_html($item['endorsed'])) {
                        $html_output .= '<span>(✔️ Endorsed)</span>';
                    }
                    $html_output .= '</h5>';
                    $html_output .= '<h5 class="hometown">🏠 Lives in: ' . esc_html($item['hometown']) . '</h5>';
                    if (esc_html($item['incumbent'])) {
                        $html_output .= '<h5 class="incumbent">⭐ Incumbent</h5>';
                    }
                    if (esc_html($item['website'])) {
                        $html_output .= '<h5>🔗 <a target="_blank" class="website" href="' . esc_html($item['website']) . '">Campaign website</a></h5>';
                    }
                    if (esc_html($item['dropped_out'])) {
                        $html_output .= '<h5>✖️ Out of the race</h5>';
                    }
                    $hasAnswers = false;
                    for ($i = 1; $i <= 20; $i++) {
                        if (!empty($item['answer_' . $i])) {
                            $hasAnswers = true;
                            break; 
                        }
                    }

                    if ($hasAnswers) {
                        $html_output .= '
                            <h5 class="read-qa">Read Q&A <span><svg xmlns="http://www.w3.org/2000/svg" width="21px" height="21px" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.00003 8.5C6.59557 8.5 6.23093 8.74364 6.07615 9.11732C5.92137 9.49099 6.00692 9.92111 6.29292 10.2071L11.2929 15.2071C11.6834 15.5976 12.3166 15.5976 12.7071 15.2071L17.7071 10.2071C17.9931 9.92111 18.0787 9.49099 17.9239 9.11732C17.7691 8.74364 17.4045 8.5 17 8.5H7.00003Z" fill="#000000"/></svg></span></h5>
                            <div class="accordion-container">';

                        for ($i = 1; $i <= 20; $i++) {
                            if (esc_html($item['answer_' . $i])) {
                                $html_output .= '
                                    <div class="accordion">
                                        <h5>' . esc_html($item['question_' . $i]) . '</h5>
                                        <p>' . esc_html($item['answer_' . $i]) . '</p>
                                    </div>';
                            }
                        }
                    }

                    $html_output .= '
                        </div>';

                    $html_output .= '</div>';
                }
            }
            $html_output .= '</div>';
            $html_output .= '</div>';
        }
        $html_output .= '</div>';
    endforeach;

    // Echo the HTML markup as the response
    echo $html_output;
    wp_die();
}

