<?php
/**
 * The Decor Diary Theme Functions & Definitions
 *
 * @package TheDecorDiary
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function thedecordiary_setup() {
    // Add default posts and comments RSS feed links to head.
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title.
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails on posts and pages.
    add_theme_support('post-thumbnails');
    set_post_thumbnail_size(1200, 800, true);

    // Switch default core markup for search form, comment form, etc. to output valid HTML5.
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));

    // Support Gutenberg wide, full alignments, block styles, and editor styles
    add_theme_support('align-wide');
    add_theme_support('responsive-embeds');
    add_theme_support('wp-block-styles');
    add_theme_support('editor-styles');
    add_editor_style('style.css');
    add_theme_support('custom-logo');

    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Navigation', 'thedecordiary'),
        'footer'  => __('Footer Navigation', 'thedecordiary'),
    ));
}
add_action('after_setup_theme', 'thedecordiary_setup');

/**
 * Enqueue scripts and styles.
 */
function thedecordiary_scripts() {
    $theme_dir = get_template_directory();
    $theme_uri = get_template_directory_uri();

    // 1. Google Fonts Pairing: Playfair Display + Plus Jakarta Sans
    wp_enqueue_style(
        'thedecordiary-google-fonts',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap',
        array(),
        null
    );

    // 2. Main Theme Style header
    wp_enqueue_style('thedecordiary-theme-root', get_stylesheet_uri(), array(), '1.0.0');

    // 3. Dynamically discover and enqueue compiled React CSS & JS from assets/
    $assets_dir = $theme_dir . '/assets';
    if (is_dir($assets_dir)) {
        $files = scandir($assets_dir);
        if ($files) {
            foreach ($files as $file) {
                if (pathinfo($file, PATHINFO_EXTENSION) === 'css') {
                    wp_enqueue_style(
                        'thedecordiary-app-css-' . sanitize_key($file),
                        $theme_uri . '/assets/' . $file,
                        array(),
                        filemtime($assets_dir . '/' . $file)
                    );
                }
                if (pathinfo($file, PATHINFO_EXTENSION) === 'js') {
                    wp_enqueue_script(
                        'thedecordiary-app-js-' . sanitize_key($file),
                        $theme_uri . '/assets/' . $file,
                        array(),
                        filemtime($assets_dir . '/' . $file),
                        true
                    );
                }
            }
        }
    }
}
add_action('wp_enqueue_scripts', 'thedecordiary_scripts');

/**
 * Enable ES Module loading for Vite-compiled React bundles
 */
add_filter('script_loader_tag', function($tag, $handle, $src) {
    if (strpos($handle, 'thedecordiary-app-js') !== false || strpos($src, '/assets/') !== false) {
        return '<script type="module" crossorigin src="' . esc_url($src) . '"></script>' . "\n";
    }
    return $tag;
}, 10, 3);

/**
 * Inject WordPress Boot Configuration into HTML head before scripts execute
 */
add_action('wp_head', function() {
    $categories = get_categories(array('hide_empty' => false));
    $cats_formatted = array();
    foreach ($categories as $c) {
        $cats_formatted[] = array(
            'id'    => 'cat-' . $c->term_id,
            'name'  => $c->name,
            'slug'  => $c->slug,
            'count' => $c->count,
        );
    }

    $wp_config = array(
        'isWordPress'       => true,
        'siteUrl'           => esc_url(home_url('/')),
        'siteName'          => get_bloginfo('name'),
        'siteTagline'       => get_bloginfo('description'),
        'restUrl'           => esc_url_raw(rest_url()),
        'restNonce'         => wp_create_nonce('wp_rest'),
        'currentTheme'      => 'The Decor Diary v1.0.0',
        'ajaxUrl'           => admin_url('admin-ajax.php'),
        'initialPosts'      => function_exists('thedecordiary_rest_get_posts') ? thedecordiary_rest_get_posts() : array(),
        'initialCategories' => $cats_formatted,
    );
    echo '<script id="thedecordiary-wp-boot">window.DECORDIARY_WP_BOOT = ' . wp_json_encode($wp_config) . ';</script>' . "\n";
}, 1);

/**
 * Register Custom WP REST API Endpoints for Real-Time Cross-Device Blog Synchronization
 */
function thedecordiary_register_rest_routes() {
    register_rest_route('decordiary/v1', '/posts', array(
        'methods'             => 'GET',
        'callback'            => 'thedecordiary_rest_get_posts',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('decordiary/v1', '/sync', array(
        'methods'             => 'POST',
        'callback'            => 'thedecordiary_rest_sync_posts',
        'permission_callback' => function() {
            return current_user_can('edit_posts');
        },
    ));
}
add_action('rest_api_init', 'thedecordiary_register_rest_routes');

/**
 * REST Callback: Get native WordPress posts formatted for The Decor Diary
 */
function thedecordiary_rest_get_posts() {
    $args = array(
        'post_type'      => 'post',
        'post_status'    => 'publish',
        'posts_per_page' => 100,
        'orderby'        => 'date',
        'order'          => 'DESC',
    );

    $query = new WP_Query($args);
    $posts_data = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            $cats = get_the_category();
            $primary_cat = !empty($cats) ? $cats[0]->name : 'Home Decor';

            $featured_img = get_the_post_thumbnail_url($post_id, 'full');
            if (!$featured_img) {
                $featured_img = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80';
            }

            $posts_data[] = array(
                'id'            => 'wp-' . $post_id,
                'title'         => get_the_title(),
                'slug'          => get_post_field('post_name', $post_id),
                'excerpt'       => wp_strip_all_tags(get_the_excerpt()),
                'content'       => apply_filters('the_content', get_the_content()),
                'category'      => $primary_cat,
                'author'        => get_the_author(),
                'authorRole'    => 'Editorial Contributor',
                'publishedAt'   => get_the_date('c'),
                'readingTime'   => ceil(str_word_count(wp_strip_all_tags(get_the_content())) / 200) . ' min read',
                'featuredImage' => $featured_img,
                'status'        => 'published',
                'views'         => (int) get_post_meta($post_id, '_decordiary_views', true) ?: 1,
            );
        }
        wp_reset_postdata();
    }

    return rest_ensure_response(array(
        'success'     => true,
        'count'       => count($posts_data),
        'lastUpdated' => time() * 1000,
        'posts'       => $posts_data,
    ));
}

/**
 * REST Callback: Sync posts from The Decor Diary into WordPress database
 */
function thedecordiary_rest_sync_posts($request) {
    $params = $request->get_json_params();
    $posts = isset($params['posts']) ? $params['posts'] : array();
    $imported_count = 0;

    foreach ($posts as $post) {
        if (empty($post['title'])) continue;

        // Check if post already exists by title
        $existing = get_page_by_title($post['title'], OBJECT, 'post');
        if (!$existing) {
            $new_post_id = wp_insert_post(array(
                'post_title'   => sanitize_text_field($post['title']),
                'post_content' => wp_kses_post($post['content'] ?? ''),
                'post_excerpt' => sanitize_text_field($post['excerpt'] ?? ''),
                'post_status'  => 'publish',
                'post_type'    => 'post',
            ));

            if ($new_post_id && !is_wp_error($new_post_id)) {
                $imported_count++;
                if (!empty($post['views'])) {
                    update_post_meta($new_post_id, '_decordiary_views', (int)$post['views']);
                }
            }
        }
    }

    return rest_ensure_response(array(
        'success'  => true,
        'imported' => $imported_count,
        'message'  => "Synchronized {$imported_count} posts into WordPress database.",
    ));
}

/**
 * Add Admin Menu for The Decor Diary Theme
 */
function thedecordiary_admin_menu() {
    add_theme_page(
        __('The Decor Diary Settings', 'thedecordiary'),
        __('The Decor Diary', 'thedecordiary'),
        'edit_theme_options',
        'thedecordiary-theme',
        'thedecordiary_admin_page'
    );
}
add_action('admin_menu', 'thedecordiary_admin_menu');

function thedecordiary_admin_page() {
    ?>
    <div class="wrap" style="max-width: 900px; padding: 20px; background: #fff; border-radius: 12px; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
        <h1 style="font-family: serif; color: #242522; font-size: 28px; margin-bottom: 8px;">The Decor Diary — Theme Control Hub</h1>
        <p style="color: #7A7369; font-size: 14px; margin-top: 0;">Your modern React-powered editorial magazine and home decor store theme is active.</p>
        
        <hr style="border: 0; border-top: 1px solid #E5DED2; margin: 20px 0;" />
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <div style="background: #F7F4EE; padding: 18px; border-radius: 8px; border: 1px solid #E5DED2;">
                <h3 style="margin-top: 0; color: #2F3A32;">🚀 Real-Time Synchronization</h3>
                <p style="font-size: 13px; color: #4A4640; line-height: 1.6;">
                    The Decor Diary supports cross-device real-time syncing. Any blog published in the app or WordPress is accessible via the built-in REST API.
                </p>
                <code style="display: block; padding: 8px; background: #fff; border-radius: 4px; font-size: 12px; color: #8C6D53;">
                    <?php echo esc_url(rest_url('decordiary/v1/posts')); ?>
                </code>
            </div>

            <div style="background: #F7F4EE; padding: 18px; border-radius: 8px; border: 1px solid #E5DED2;">
                <h3 style="margin-top: 0; color: #2F3A32;">🎨 Complete Front-End Suite</h3>
                <p style="font-size: 13px; color: #4A4640; line-height: 1.6;">
                    Enjoy smooth carousel sliders, interactive categories, saved posts drawer, search modal, and responsive mobile navigation with zero configuration.
                </p>
                <a href="<?php echo esc_url(home_url('/')); ?>" target="_blank" class="button button-primary" style="background: #2F3A32; border-color: #2F3A32;">
                    View Live Store Front
                </a>
            </div>
        </div>

        <div style="background: #FAF8F5; padding: 16px; border-left: 4px solid #8C6D53; border-radius: 4px; font-size: 13px; color: #4A4640;">
            <strong>Pro Tip:</strong> To customize articles, header categories, and layout, open the front-end website and click on the <strong>Admin CMS</strong> bar or navigate to <code>/admin</code> to access the comprehensive visual management suite.
        </div>
    </div>
    <?php
}
