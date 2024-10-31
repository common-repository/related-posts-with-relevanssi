<?php
		foreach ( $r_posts as $post ) { ?>
            <?php
            $title = wp_trim_words(get_the_title($post->ID), 5, __('more', 'related-posts-with-relevanssi'));
            ?>
            <div class="rpwr-cell rpwr-cell-cnt" data-title="<?php echo $title; ?>" data-date="<?php echo get_the_date( 'U', $post->ID ); ?>">
                <a class="rpwr-post-image" href="<?php the_permalink( $post->ID ); ?>"><div class="rpwr-image" style="background-image: url('<?php echo get_the_post_thumbnail_url($post->ID, 'thumbnail'); ?>');"></div></a>
                <div class="rpwr-post-info">
                    <a class="rpwr-post-title" href="<?php the_permalink( $post->ID ); ?>"><?php echo $title ; ?></a>
                    <?php if ( $cfg['show_date'] == 1) : ?>
                        <span class="rpwr-post-date"><?php _e( 'Published', 'related-posts-with-relevanssi' ); echo ": "; echo get_the_date( get_option('date_format'), $post->ID ); ?></span>
                    <?php endif; ?>
                </div>
            </div>
        <?php } 

?>