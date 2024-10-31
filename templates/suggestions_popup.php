<h2><?php _e("Pop-up suggestions", 'related-posts-with-relevanssi'); ?></h2>

<div class="rpwr_admin_info">
	<div>
		<p><?php _e("Under this section, after upgrade to advanced version, you will be able to configure a suggestion block that will be shown in a popup box on the post pages of the selected post types. You will be able to configure the following options in addition to standard suggestion block settings", 'related-posts-with-relevanssi'); ?>:</p>

		<ul>
			<li><?php _e("Source of the content keywords used to build the suggestion block", 'related-posts-with-relevanssi'); ?>.</li>
			<li><?php _e("Select post types where the suggestion block should be shown", 'related-posts-with-relevanssi'); ?>.</li>
			<li><?php _e("Define % of the page scroll when popup suggestions will be shown", 'related-posts-with-relevanssi'); ?>.</li>
		</ul>
		<p>
			<?php _e("Install", 'related-posts-with-relevanssi'); ?> <a href="<?php echo $this->ps->showExtUrl(); ?>" target="_blank"><?php echo $this->conf['plugins']['types_and_automation']; ?></a> <?php _e("plugin to enable features described above", 'related-posts-with-relevanssi'); ?>. 
			<?php _e("Advanced version also includes additional templates and prioritized support and updates", 'related-posts-with-relevanssi'); ?>.
		</p>
	</div>
	<img src="<?php echo plugins_url( 'assets/img/suggest_popup.svg', __DIR__ ); ?>"/>
</div>
