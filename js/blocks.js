var __ = wp.i18n.__;

var el = wp.element.createElement,
	registerBlockType = wp.blocks.registerBlockType,
    ServerSideRender = wp.serverSideRender,
	blockStyle = { backgroundColor: '#900', color: '#fff', padding: '20px' };
var {Panel, PanelBody, PanelRow, SelectControl, TextControl, CheckboxControl, TextareaControl, CustomSelectControl} = wp.components;
    
var {
	PluginSidebar,
	PluginSidebarMoreMenuItem,
	PluginPostStatusInfo,
	InspectorControls,
	BlockControls,
	RichText
} = wp.editor;	

var { Fragment } = wp.element;

/* Custom plugin icon */
const customIcon = el('svg', 
{ 
	width: 20, 
	height: 20,
	viewBox: "0 0 128 128",
	class: "dashicon dashicons-admin-generic",
	xmlns: "http://www.w3.org/2000/svg"
},
el( 'path', { d: 'M22.13257,90.34143H13.40366a11.84755,11.84755,0,1,0,0,23.6951h8.72891a11.84755,11.84755,0,0,0,0-23.6951Zm0,19.62883H13.40366a7.78127,7.78127,0,1,1,0-15.56255h8.72891a7.78127,7.78127,0,0,1,0,15.56255Z', fill: 'white',	stroke: 'black', strokeWidth: '6'}),
el( 'path', { d: 'M68.36562,90.34143h-8.729a11.84755,11.84755,0,1,0,0,23.6951h8.729a11.84755,11.84755,0,0,0,0-23.6951Zm0,19.62883h-8.729a7.78127,7.78127,0,1,1,0-15.56255h8.729a7.78127,7.78127,0,0,1,0,15.56255Z', fill: 'white',	stroke: 'black', strokeWidth: '6'}),
el( 'path', { d: 'M114.5986,90.34143h-8.72891a11.84755,11.84755,0,1,0,0,23.6951h8.72891a11.84755,11.84755,0,0,0,0-23.6951Zm0,19.62883h-8.72891a7.78127,7.78127,0,1,1,0-15.56255h8.72891a7.78127,7.78127,0,0,1,0,15.56255Z', fill: 'white',	stroke: 'black', strokeWidth: '6'}),
el( 'path', { d: 'M57.531,49.91431H70.7761a17.97542,17.97542,0,0,0,0-35.95084H57.531a17.97542,17.97542,0,0,0,0,35.95084Z', fill: 'white',	stroke: 'black', strokeWidth: '6'}),
el( 'path', { d: 'M17.03544,83.61407a2.87944,2.87944,0,0,0,2.8762-2.87614V73.60175H61.37233v7.13618a2.8762,2.8762,0,0,0,5.75241,0V73.60175h41.27069v7.13618a2.87623,2.87623,0,0,0,5.75247,0V70.72542a2.87932,2.87932,0,0,0-2.87608-2.87608H67.09747V60.713a2.87617,2.87617,0,1,0-5.75234,0v7.13637H17.03544a2.87944,2.87944,0,0,0-2.87627,2.87608V80.73793A2.87945,2.87945,0,0,0,17.03544,83.61407Z', fill: 'white',	stroke: 'black', strokeWidth: '6'}),
);

/* Registering block type */
registerBlockType( 'related-posts-blocks/related-posts', {
    title: __('Related posts', 'related-posts-with-relevanssi'),
    description: __('Related postst generated via configured search engine on your WordPress installation', 'related-posts-with-relevanssi'),
    icon: customIcon,
    category: 'widgets',
    
    /* Attributes used by block */
    attributes: {
		order: {
			type: 'string',
			default: "default",
		},
		style: {
			type: 'string',
			default: "thumb-row",
		},
		ptypes: {
			type: 'array',
			default: ["post"],
		},
		num: {
			type: 'object',
			default: {
				'post': 4,
			},
		},
		width: {
			type: 'string',
			default: "100%",
		},
		align: {
			type: 'string',
			default: "center",
		},
		keyword: {
			type: 'string',
			default: "",
		},
		title: {
			type: 'string',
			default: "",
		},
		include: {
			type: 'string',
			default: "",
		},
		exclude: {
			type: 'string',
			default: "",
		},
		more: {
			type: 'bool',
		},
		show_date: {
			type: 'bool',
		},
		updater: {
			type: 'string',
			default: "",
		}
	},
	
	/* Block interface - editor side */
    edit: function(props) {
    
    	let tmpEl = [];
    	
    	js_cfg.ptypes.forEach(tEl=>{
			tmpEl.push(
			el(CheckboxControl,
				{
					//heading: __('Article', 'related-posts-with-relevanssi'), 
					label: tEl.label, 
					//help: __('Article help', 'related-posts-with-relevanssi'), 
					//id: ('ptypes_'+tEl.value),
					name: ('ptypes_'+tEl.value),
					checked: props.attributes.ptypes.includes(tEl.value)?'1':'',
					onChange: function (value) {
						if( value ) {
							let tmp = props.attributes.ptypes;
							let tmp1 = Array();
							if(!tmp.includes(tEl.value)){ tmp1 = tmp.concat(tEl.value); }
							props.setAttributes({ ptypes: tmp1, updater: new Date()});
						} else {
							let tmp = props.attributes.ptypes;
							let tmp1 = Array();
							let tIndex = tmp.indexOf(tEl.value);
							if (tIndex !== -1){ tmp.splice(tIndex, 1); tmp1 = tmp.concat([]); }
							props.setAttributes({ ptypes: tmp1, updater: new Date()});
						}
					}
				}
			)
			);

			if(props.attributes.ptypes.includes(tEl.value)){
				if(!tEl.custom_block){
					tmpEl.push(el(TextControl,
		                {
							label: __('Number of suggestions', 'related-posts-with-relevanssi'), 
							id: 'related_post_number_'+tEl.value,
		                    class: 'related_post_number',
		                    name: 'num['+tEl.value+']',
		                    defaultValue: props.attributes.num[tEl.value],
							placeholder: 'Ex: 3',
							onChange: function (value) {
								let tmp = props.attributes.num;
								tmp[tEl.value] = value;
								let tmp1 = Object.create(tmp);
								for(key in tmp) tmp1[key] = tmp[key];
								props.setAttributes({num: tmp1, updater: new Date()});
		                    }
		                }
					));
				}else{
					if(tEl.custom_type=='multiselect'){
						tmpEl.push(el(SelectControl, {
								size: 5,
								multiple: true,
								label: tEl.custom_name_block, 
								id: 'related_post_number_'+tEl.value,
								name: 'num['+tEl.value+']',
								defaultValue: props.attributes.num[tEl.value], 
								options: tEl.custom_block,
								onMouseDown: (e)=>{
									e.preventDefault();
									e.target.selected = !e.target.selected;
									
									let tmp = props.attributes.num;
									tmp[tEl.value] = [];
									for (var i = 0; i < e.target.parentNode.length; i++) {
										if(e.target.parentNode.options[i].selected) tmp[tEl.value].push(e.target.parentNode.options[i].value);
									};
									props.setAttributes({num: tmp, updater: new Date()});
									
									e.target.focus();
								},
								onChange: (value)=>{ 
									/*
									if(value!=''){ 
										let tmp = props.attributes.num;
										tmp[tEl.value] = value;
										let tmp1 = Object.create(tmp);
										for(key in tmp) tmp1[key] = tmp[key];
										console.log(tmp1);
										//props.setAttributes({num: tmp1, updater: new Date()});
									}
									*/
								}
							}));
					}
					
					if(tEl.custom_type=='select'){
						tmpEl.push(el(SelectControl, {
								label: tEl.custom_name_block, 
								id: 'related_post_number_'+tEl.value,
								name: 'num['+tEl.value+']',
								defaultValue: props.attributes.num[tEl.value], 
								options: tEl.custom_block,
								onChange: (value)=>{ 
									if(value!=''){ 
										let tmp = props.attributes.num;
										tmp[tEl.value] = value;
										let tmp1 = Object.create(tmp);
										for(key in tmp) tmp1[key] = tmp[key];
										props.setAttributes({num: tmp1, updater: new Date()});
									}
								}
							}));
					}
				}
			}
		});

		if(js_cfg.ptypes.length==1){
			tmpEl.push(el('p',{},
					__( 'Install', 'related-posts-with-relevanssi' ),
					" ",
					el('a',
						{
							'href': js_cfg.upgrade_link,
							
						},
						js_cfg.upgrade_text
					),
					" ",
					__( 'plugin to enable extended post types including products', 'related-posts-with-relevanssi' )
			));
		}

		let opAlign = [];
		Object.keys(js_cfg.arrays.align).forEach(key => {
			opAlign.push({'value': key, 'label': js_cfg.arrays.align[key]});
		});

		let opStyle = [];
		Object.keys(js_cfg.arrays.style).forEach(key => {
			opStyle.push({'value': key, 'label': js_cfg.arrays.style[key]});
		});

		let opOrder = [];
		Object.keys(js_cfg.arrays.order).forEach(key => {
			opOrder.push({'value': key, 'label': js_cfg.arrays.order[key]});
		});

		return [
			/*el(ServerSideRender, {
				block: props.name,
				attributes: props.attributes,
			}),*/
			el('div', {},
			//el('div', {}, __('Suggestions block', 'related-posts-with-relevanssi')),
			el(ServerSideRender, {
				block: props.name,
				attributes: props.attributes,
			})), 
			el(InspectorControls, {key: 'inspector'},
				el(Panel, {},
					el(PanelBody, {title: __('Basic settings', 'related-posts-with-relevanssi'), initialOpen : true},
						el(TextControl,	{
							label: __('Title', 'related-posts-with-relevanssi')+" ("+__('optional', 'related-posts-with-relevanssi')+"}", 
							id: 'related_post_title',
							name: "title",
							defaultValue: props.attributes.title,
							onChange: function (value) {
								props.setAttributes({title: value});
							}
						}),
						el(TextControl,	{
							label: __('Search keyword', 'related-posts-with-relevanssi'), 
							id: 'related_post_keyword',
							name: "keyword",
							defaultValue: props.attributes.keyword,
							onChange: function (value) {
								props.setAttributes({keyword: value});
							}
						}),
					),
					el(PanelBody, {title: __('Layout & styles', 'related-posts-with-relevanssi'), initialOpen : false},
						el(SelectControl, {
							label: __('Style', 'related-posts-with-relevanssi'), 
							id: 'related_post_style',
							name: "style",
							defaultValue: props.attributes.style, 
							options: opStyle,
							onChange: (value)=>{ if(value!='') props.setAttributes({style: value}); }
						}),
						el(SelectControl, {
							label: __('Order', 'related-posts-with-relevanssi'), 
							id: 'related_post_order',
							name: "order",
							defaultValue: props.attributes.order, 
							options: opOrder,
							onChange: (value)=>{ 
								if(value!=''){ 
									props.setAttributes({order: value}); 
								}
							}
						}),
						el(TextControl, {
							label: __('Width', 'related-posts-with-relevanssi'), 
							id: 'insta_grid_width',
							name: "width",
							defaultValue: props.attributes.width,
							placeholder: 'Ex: 100%',
							onChange: function (value) {
								if(value!='') props.setAttributes({width: value});
							}
						}),
						el(SelectControl, {
							label: __('Align', 'related-posts-with-relevanssi'), 
							name: "align",
							defaultValue: props.attributes.align, 
							options: opAlign,
							onChange: (value)=>{ if(value!='') props.setAttributes({align: value}); }
						}),
						el(CheckboxControl,	{
							label: __('Show post date', 'related-posts-with-relevanssi'), 
							name: "show_date",
							checked: props.attributes.show_date,
							onChange: function (value) {
								if( value ) {
									props.setAttributes({ show_date: '1' })
								} else {
									props.setAttributes({ show_date: '' })
								}
							}
						}),
						el(CheckboxControl,	{
							label: __('Show `more` button', 'related-posts-with-relevanssi'), 
							name: "more",
							checked: props.attributes.more,
							onChange: function (value) {
								if( value ) {
									props.setAttributes({ more: '1' })
								} else {
									props.setAttributes({ more: '' })
								}
							}
						}),
					),
					el(PanelBody, {title: __('Post types', 'related-posts-with-relevanssi'), initialOpen : false},
						tmpEl,
					),
					el(PanelBody, {title: __('IDs include/exclude', 'related-posts-with-relevanssi'), initialOpen : false},
						el(TextareaControl,	{
							label: __('Include post IDs', 'related-posts-with-relevanssi'), 
							id: 'related_post_include',
							name: "include",
							defaultValue: props.attributes.include,
							onChange: function (value) {
								if(value!='') props.setAttributes({include: value});
							}
						}),
						el(TextareaControl, {
							label: __('Exclude post IDs', 'related-posts-with-relevanssi'), 
							name: "exclude",
							defaultValue: props.attributes.exclude,
							onChange: function (value) {
								if(value!='') props.setAttributes({exclude: value});
							}
						}),
					),
				),
				
				)];
    },
	
	/* Block visualization for the front-end */
    save: function(props) {
    	return [el(ServerSideRender, {
				block: props.name,
				attributes: props.attributes
			})];
    },
} );


