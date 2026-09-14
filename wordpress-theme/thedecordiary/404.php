<?php
/**
 * The 404 Not Found template for The Decor Diary Theme
 *
 * @package TheDecorDiary
 * @version 1.0.0
 */

get_header();
?>

<div id="root">
    <noscript>
        <main style="max-width: 800px; margin: 80px auto; padding: 32px; text-align: center; font-family: serif; color: #242522;">
            <h1 style="font-size: 48px; margin-bottom: 16px; color: #8C6D53;">404</h1>
            <h2 style="font-size: 24px; margin-bottom: 16px;">Story or Room Not Found</h2>
            <p style="color: #7A7369; margin-bottom: 24px;">The interior design guide or page you are looking for does not exist or has been moved.</p>
            <a href="<?php echo esc_url(home_url('/')); ?>" style="display: inline-block; padding: 12px 24px; background: #2F3A32; color: #fff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-family: sans-serif; font-size: 14px;">
                Return to Decor Diary &rarr;
            </a>
        </main>
    </noscript>
</div>

<?php
get_footer();
