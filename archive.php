<?php
/**
 * Archive template for The Decor Diary Theme
 *
 * @package TheDecorDiary
 * @version 1.0.0
 */

get_header();
?>

<div id="root">
    <noscript>
        <main style="max-width: 1200px; margin: 40px auto; padding: 24px; font-family: serif; color: #242522;">
            <header style="margin-bottom: 32px;">
                <h1 style="font-size: 32px;"><?php the_archive_title(); ?></h1>
                <div style="color: #7A7369;"><?php the_archive_description(); ?></div>
            </header>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px;">
                <?php
                if (have_posts()) :
                    while (have_posts()) : the_post();
                        ?>
                        <article style="background: #fff; padding: 20px; border: 1px solid #E5DED2; border-radius: 12px;">
                            <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                            <p><?php echo wp_trim_words(get_the_excerpt(), 20); ?></p>
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
