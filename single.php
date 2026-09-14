<?php
/**
 * Single post template for The Decor Diary Theme
 *
 * @package TheDecorDiary
 * @version 1.0.0
 */

get_header();
?>

<!-- React dynamic single post mount container -->
<div id="root">
    <noscript>
        <main style="max-width: 860px; margin: 40px auto; padding: 24px; font-family: serif; color: #242522;">
            <?php
            while (have_posts()) : the_post();
                ?>
                <article>
                    <header style="margin-bottom: 24px;">
                        <h1 style="font-size: 40px; line-height: 1.2;"><?php the_title(); ?></h1>
                        <div style="font-size: 14px; color: #8C6D53; margin-top: 10px;">
                            <span>By <?php the_author(); ?></span> • <span><?php echo get_the_date(); ?></span>
                        </div>
                    </header>
                    <?php if (has_post_thumbnail()) : ?>
                        <div style="margin: 24px 0; border-radius: 12px; overflow: hidden;">
                            <?php the_post_thumbnail('large', array('style' => 'width:100%; height:auto;')); ?>
                        </div>
                    <?php endif; ?>
                    <div style="font-size: 18px; line-height: 1.8; font-family: sans-serif; color: #333;">
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
