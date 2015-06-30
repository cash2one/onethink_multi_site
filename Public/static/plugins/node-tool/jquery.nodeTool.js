;(function($, window, document, undefined)
{

    var defaults = {
			nodesData : [], // 节点内容数据
			fontSize:14,
			maxFontSize:20,
			minFontSize:10,
			lineHeight:1.8,
        };

    function Plugin(element, options)
    {
        this.w  = $(window);
        this.el = $(element);
		this.$nodes = this.el.find('span[id*=node]');
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype = {
		
		nodeId : 0,
		
		$menu: null,
		
		init:function(){
			var options = this.options,
				$nodes = this.$nodes,
				el = this.el,
				_this = this;
				
			// 给节点写入数据
			options.nodesData.forEach(function(node){
				var id = node['sort'],
					content = node['content'];
					
				$('#node'+id).html(content).data('sort',id);
			})			
			
			this.el.css({
				'font-size':options.fontSize,
				'line-height':options.lineHeight,
			})
			
			// 为节点绑定事件
			$nodes.on({
				'click':function(e){
					if( !$(this).hasClass('active') ){
						$(this).addClass('active').removeClass('heightLight');
						
						_this.nodeId = $(this).data('sort');
						
						_this.blockUI(el);
						
						_this.createMenu();
						
						$(this).append(_this.$menu)
						
					}
				},
				'mouseover':function(){
					if( !$(this).hasClass('active') ){
						$(this).addClass('heightLight');
					}
				},
				'mouseout':function(){
					$(this).removeClass('heightLight');
				}
			})
			
			// 绑定关闭block事件
			$(document).on('click','.blockOverlay',function(){
				$nodes.removeClass('active');
				_this.unblockUI(el);
			});
			
			$(document).on('click','.node-edit',function(){
				var $node = $('#node'+_this.nodeId);
				
				$node
				.hide()
				.after('<textarea>'+$node.html()+'</textarea>');
				
			})
			
			$(document).on('click','.node-add-front',function(){
			})
			
			$(document).on('click','.node-add-back',function(){
			})
			
		},
		
		lagger:function(){
			var fontSize = this.options.fontSize + 2;
			
			if(fontSize >= this.options.maxFontSize ){
				fontSize =  this.options.maxFontSize;
			}
			
			this.options.fontSize = fontSize;
			this.el.css({'font-size':fontSize});
		},
		
		smaller:function(){
			var fontSize = this.options.fontSize - 2;
			
			if(fontSize <= this.options.minFontSize ){
				fontSize =  this.options.minFontSize;
			}
			
			this.options.fontSize = fontSize;
			this.el.css({'font-size':fontSize});
		},
		blockUI: function (el, centerY) {
            var el = jQuery(el);
            if (el.height() <= 400) {
                centerY = true;
            }
            el.block({
                message: null,
                centerY: centerY != undefined ? centerY : true,
                css: {
                    top: '10%',
                    border: 'none',
                    padding: '2px',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: '#e02222',
                    opacity: 0.2,
                    cursor: 'default'
                }
            });
        },
		unblockUI: function (el, clean) {
			this.el.find('.menu').remove();
			this.$nodes.removeClass('active');

            jQuery(el).unblock({
                onUnblock: function () {
                    jQuery(el).css('position', '');
                    jQuery(el).css('zoom', '');
                }
            });
        },
		createMenu:function(id){
			var $menu = $('<div class="btn-group col-md-12" >'),$botton;
			
			$botton = $('<button type="button" class="btn default node-edit">编辑</button>');
			$menu.append($botton);
			
			$botton = $('<button type="button" class="btn default node-add-front">在前面添加节点</button>');
			$menu.append($botton);
			
			$botton = $('<button type="button" class="btn default node-add-back">在后面添加节点</button>');
			$menu.append($botton);
			
			$menu.addClass('menu');
			
			this.$menu = $menu;
		}

    };

    $.fn.nodeTool = function(params)
    {
        var lists  = this,
            retval = this;

        lists.each(function()
        {
            var plugin = $(this).data("nodeTool");

            if (!plugin) {
                $(this).data("nodeTool", new Plugin(this, params));
                $(this).data("nodeTool-id", new Date().getTime());
            }else {
                if (typeof params === 'string' && typeof plugin[params] === 'function') {
                    retval = plugin[params]();
                }
            }
        });

        return retval || lists;
    };

})(window.jQuery, window, document);
