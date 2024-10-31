<?php
		//echo $cfg['before_widget'];
		
		//if ( $title ) {
			//echo $args['before_title'] . $title . $args['after_title'];
        //}
        // https://erlycoder.com/?s=photo&post_type[]=post&post_type[]=product
        
        foreach ( $r_posts as $post ) { $product = wc_get_product( $post->ID ); ?>
            <?php
            $title = wp_trim_words(get_the_title($post->ID), 5, __('more', 'related-posts-with-relevanssi'));
            ?>
            <div class="rpwr-cell rpwr-cell-cnt" data-title="<?php echo $title; ?>" data-date="<?php echo get_the_date( 'U', $post->ID ); ?>">
                <a class="rpwr-post-image" href="<?php the_permalink( $post->ID ); ?>"><div class="rpwr-image" style="background-image: url('<?php echo get_the_post_thumbnail_url($post->ID, 'thumbnail'); ?>');"></div></a>
                <div class="rpwr-post-info">
                    <a class="rpwr-post-title" href="<?php the_permalink( $post->ID ); ?>"><?php echo $title ; ?></a>
                    <div class="rpwr-product-price <?php echo ($product->get_regular_price()!=$product->get_price())?"sale":""; ?>">
                        <?php echo $product->get_price_html(); ?>
                    </div>
                </div>
            </div>
        <?php } 
        
		//echo $cfg['after_widget'];

?>