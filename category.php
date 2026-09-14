<?php
/**
 * The category template file for The Decor Diary Theme
 *
 * @package TheDecorDiary
 * @version 1.0.0
 */

get_header();
?>

<div id="root">
    <noscript>
        <main style="max-width: 1200px; margin: 40px auto; padding: 24px; font-family: serif; color: #242522;">
            <header style="margin-bottom: 32px; border-bottom: 1px solid #E5DED2; padding-bottom: 16px;">
                <span style="text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; color: #8C6D53; font-weight: bold;">Category</span>
                <h1 style="font-size: 32px; margin-top: 4px;"><?php single_cat_title(); ?></h1>
                <?php the_archive_description('<p style="color: #7A7369; font-size: 16px;">', '</p>'); ?>
            </header>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
                <?php
                if (have_posts()) :
                    while (have_posts()) : the_post();
                        ?>
                        <article style="background: #fff; padding: 20px; border: 1px solid #E5DED2; border-radius: 16px;">
                            <?php if (has_post_thumbnail()) : ?>
                                <div style="margin-bottom: 12px; border-radius: 12px; overflow: hidden;">
                                    <?php the_post_thumbnail('medium_large', array('style' => 'width: 100%; height: 200px; object-fit: cover;')); ?>
                                </div>
                            <?php endif; ?>
                            <h2 style="font-size: 20px; margin-top: 0;"><a href="<?php the_permalink(); ?>" style="color: inherit; text-decoration: none;"><?php the_title(); ?></a></h2>
                            <p style="color: #5A534B; font-size: 14px;"><?php echo wp_trim_words(get_the_excerpt(), 20); ?></p>
                            <span style="font-size: 12px; color: #8C6D53; font-weight: bold;"><?php echo get_the_date(); ?></span>
                        </article>
                        <?php
                    endwhile;
                endif;
                ?>
            </div>
        </main>
    </noscript>
</div>

<?php
get_footer();
