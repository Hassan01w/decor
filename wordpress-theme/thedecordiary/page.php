<?php
/**
 * Page template for The Decor Diary Theme
 *
 * @package TheDecorDiary
 * @version 1.0.0
 */

get_header();
?>

<div id="root">
    <noscript>
        <main style="max-width: 860px; margin: 40px auto; padding: 24px; font-family: serif; color: #242522;">
            <?php
            while (have_posts()) : the_post();
                ?>
                <article>
                    <h1 style="font-size: 36px;"><?php the_title(); ?></h1>
                    <div style="font-size: 16px; line-height: 1.8; font-family: sans-serif; color: #333; margin-top: 20px;">
                        <?php the_content(); ?>
                    </div>
                </article>
                <?php
            endwhile;
            ?>
        </main>
    </noscript>
</div>

<?php
get_footer();
