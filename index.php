<?php
/**
 * The main template file for The Decor Diary Theme
 *
 * @package TheDecorDiary
 * @version 1.0.0
 */

get_header();
?>

<!-- React Mount Point -->
<div id="root">
    <!-- SEO and Crawler Fallback (Renders if JavaScript is loading or disabled) -->
    <noscript>
        <div style="max-width: 1200px; margin: 40px auto; padding: 24px; font-family: serif; color: #242522;">
            <header style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-size: 36px; margin-bottom: 8px;"><?php bloginfo('name'); ?></h1>
                <p style="font-size: 18px; color: #7A7369;"><?php bloginfo('description'); ?></p>
            </header>

            <section>
                <h2>Recent Stories & Editorial Guides</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-top: 20px;">
                    <?php
                    if (have_posts()) :
                        while (have_posts()) : the_post();
                            ?>
                            <article style="background: #fff; padding: 20px; border: 1px solid #E5DED2; border-radius: 12px;">
                                <?php if (has_post_thumbnail()) : ?>
                                    <div style="margin-bottom: 12px;"><?php the_post_thumbnail('medium_large'); ?></div>
                                <?php endif; ?>
                                <h3><a href="<?php the_permalink(); ?>" style="color: #242522; text-decoration: none;"><?php the_title(); ?></a></h3>
                                <p style="font-size: 14px; color: #666;"><?php echo wp_trim_words(get_the_excerpt(), 25); ?></p>
                                <span style="font-size: 12px; color: #8C6D53;"><?php echo get_the_date(); ?></span>
                            </article>
                            <?php
                        endwhile;
                    endif;
                    ?>
                </div>
            </section>
        </div>
    </noscript>
</div>

<?php
get_footer();
