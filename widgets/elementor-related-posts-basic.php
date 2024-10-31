<?php

namespace RelatedPostsWithRelevanssi\Widgets;

// Make sure we don't expose any info if called directly
if ( !function_exists( 'add_action' ) ) {
	echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
	exit;
}

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Memcache;

class Elementor_Widget_Related_Posts_with_Relevanssi extends \Elementor\Widget_Base {
	public function __construct( $data = [], $args = null ){
		parent::__construct( $data, $args );

		if(class_exists('Memcache')){ 
			$this->mc = new Memcache; 
			
			$mc_server = (defined('MEMCACHE_SERVER'))?MEMCACHE_SERVER:'localhost';
			$mc_port = (defined('MEMCACHE_PORT'))?MEMCACHE_PORT:11211;
			$this->mc->addServer($mc_server, $mc_port); 
		}else{
			$this->mc = null;
		}
	}

	public function get_name() {
		return 'related_posts_with_relevanssi';
	}

	public function get_title() {
		return __( 'Related posts', 'related-posts-with-relevanssi' );
	}

	public function get_icon() {
		return 'eicon-theme-builder';
	}

	public function get_categories() {
		return [ 'general' ];
	}

	protected function _register_controls() {
		global $related_posts_with_relevanssi_init;
		
		$ptypes = apply_filters('related_posts_post_types', [(object)['value'=>'post', 'label'=>'Posts']]);

		$this->start_controls_section(
			'basic_section',
			[
				'label' => __( 'Basic', 'related-posts-with-relevanssi' ),
				'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
			]
		);
		
		$this->add_control(
			'title',
			[
				'label' => __( 'Title', 'related-posts-with-relevanssi' )." (".__( 'optional', 'related-posts-with-relevanssi' ).")",
				'type' => \Elementor\Controls_Manager::TEXT,
				'input_type' => 'text',
				'placeholder' => __( 'Ex: We suggest:', 'related-posts-with-relevanssi' ),
			]
		);

		$this->add_control(
			'keyword',
			[
				'label' => __( 'Keyword', 'related-posts-with-relevanssi' ),
				'type' => \Elementor\Controls_Manager::TEXT,
				'input_type' => 'text',
				'placeholder' => __( 'Ex: test', 'related-posts-with-relevanssi' ),
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'layout_section',
			[
				'label' => __( 'Layout & styles', 'related-posts-with-relevanssi' ),
				'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
			]
		);

		$this->add_control(
			'style',
			[
				'label' => __( 'Style', 'related-posts-with-relevanssi' ),
				'type' => \Elementor\Controls_Manager::SELECT,
				'default' => 'thumb-row',
				'options' => $related_posts_with_relevanssi_init->conf['style'],
			]
		);

		$this->add_control(
			'order',
			[
				'label' => __( 'Order', 'related-posts-with-relevanssi' ),
				'type' => \Elementor\Controls_Manager::SELECT,
				'default' => 'default',
				'options' => $related_posts_with_relevanssi_init->conf['order'],
			]
		);

		$this->add_control(
			'width',
			[
				'label' => __( 'Width', 'related-posts-with-relevanssi' ),
				'type' => \Elementor\Controls_Manager::TEXT,
				'input_type' => 'text',
				'default'=>"100%",
				'placeholder' => __( 'Ex: 100%', 'related-posts-with-relevanssi' ),
			]
		);

		$this->add_control(
			'align',
			[
				'label' => __( 'Align', 'related-posts-with-relevanssi' ),
				'type' => \Elementor\Controls_Manager::SELECT,
				'default' => 'left',
				'options' => $related_posts_with_relevanssi_init->conf['align'],
			]
		);

		$this->add_control(
			'show_date',
			[
				'label' => __( 'Show post date', 'related-posts-with-relevanssi' ),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __( 'Show', 'related-posts-with-relevanssi' ),
				'label_off' => __( 'Hide', 'related-posts-with-relevanssi' ),
				'return_value' => '1',
				'default' => '',
			]
		);

		$this->add_control(
			'more',
			[
				'label' => __( 'Show `more` button', 'related-posts-with-relevanssi' ),
				'type' => \Elementor\Controls_Manager::SWITCHER,
				'label_on' => __( 'Show', 'related-posts-with-relevanssi' ),
				'label_off' => __( 'Hide', 'related-posts-with-relevanssi' ),
				'return_value' => '1',
				'default' => '',
			]
		);

		
		$this->end_controls_section();

		
		$this->start_controls_section(
			'types_section',
			[
				'label' => __( 'Post types', 'related-posts-with-relevanssi' ),
				'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
			]
		);


		foreach($ptypes as $ptype){
			$this->add_control(
				'ptypes_'.$ptype->value,
				[
					'label' => $ptype->label,
					'type' => \Elementor\Controls_Manager::SWITCHER,
					'label_on' => __( 'Show', 'your-plugin' ),
					'label_off' => __( 'Hide', 'your-plugin' ),
					'return_value' => '1',
					'default' => ($ptype->value=='post')?'1':'',
				]
			);

			if(empty($ptype->custom)){
				$this->add_control(
					'num_'.$ptype->value,
					[
						'label' => __( 'Number of posts', 'related-posts-with-relevanssi' ),
						'type' => \Elementor\Controls_Manager::TEXT,
						'input_type' => 'text',
						'placeholder' => __( 'Ex: 3', 'related-posts-with-relevanssi' ),
						'default' => ($ptype->value=='post')?'4':'',
						'conditions' => [
							'terms' => [
								[
									'name' => 'ptypes_'.$ptype->value,
									'operator' => '!==',
									'value' => ''
								],
							]
						],
					]
				);
			}else{
				if($ptype->custom_type=='select'){
					$this->add_control(
						'num_'.$ptype->value,
						[
							'label' => __( 'Ad to display', 'related-posts-with-relevanssi' ),
							'type' => \Elementor\Controls_Manager::SELECT,
							'default' => '',
							'options' => $ptype->custom,
						]
					);
				}
			}
		}
		
		if(count($ptypes)==1){ 
			$this->add_control(
				'important_note',
				[
					'label' => "",
					'type' => \Elementor\Controls_Manager::RAW_HTML,
					'raw' => 
					__( 'Install', 'related-posts-with-relevanssi' ).
					" <a href=\"".$related_posts_with_relevanssi_init->ps->showExtUrl()."\" target=\"_blank\">".
					$related_posts_with_relevanssi_init->conf['plugins']['types_and_automation']."</a> ".
					__( 'plugin to enable extended post types including products', 'related-posts-with-relevanssi' ) .".",
					'content_classes' => 'your-class',
				]
			);
		}
		

		$this->end_controls_section();

		$this->start_controls_section(
			'ids_section',
			[
				'label' => __( 'IDs include/exclude', 'related-posts-with-relevanssi' ),
				'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
			]
		);

		$this->add_control(
			'include',
			[
				'label' => __( 'Include post IDs', 'related-posts-with-relevanssi' ),
				'type' => \Elementor\Controls_Manager::TEXTAREA,
				'input_type' => 'text',
				'placeholder' => __( 'Ex: 1, 5, 12', 'related-posts-with-relevanssi' ),
			]
		);

		$this->add_control(
			'exclude',
			[
				'label' => __( 'Exclude post IDs', 'related-posts-with-relevanssi' ),
				'type' => \Elementor\Controls_Manager::TEXTAREA,
				'input_type' => 'text',
				'placeholder' => __( 'Ex: 1, 5, 12', 'related-posts-with-relevanssi' ),
			]
		);

		$this->end_controls_section();

		
	}

	protected function render() {
		global $related_posts_with_relevanssi_init;

		$widget_name = $this->get_name();

		$settings = $this->get_settings_for_display();
		
		/** Filter for widget settings */
		//$cfg = apply_filters( 'related_posts_with_relevanssi_elementor_cfg', $settings, $widget_name );
		
		echo $related_posts_with_relevanssi_init->related_posts_shortcode($settings);

	}

	protected function _content_template() {
		
	}

}

?>
