 
(function() {
		function removeMenus() {
			$('.m-select').removeClass('m-focus').find('dd').hide();
		};
		var SelectorJS = {
			selector: {
				init: function(options) {
					this.select = $(options.id);
					this.data = options.data;
					this.value = options.value;
					this.height = options.height;
					this.width = options.width;
					this.curValue = this.select.find('dt');
					this.list = this.select.find('dd');
					this.input = this.select.find('input');
					this.click = options.click;

					this.height && this.list.css({
						height: this.height,
						overflowY: 'auto'
					});
					this.width && this.select.css({
						width: this.width
					});

					this.create = function() {
						var listHTML = '',
							that = this;
						if (typeof this.data !== 'string') {
							$.each(this.data, function(index, val) {
								if (val[0] == that.value) {
									that.input.val(val[0]);
									that.curValue.html(val[1]);
								}
								listHTML += '<a val="' + val[0] + '" href="javascript:;">' + val[1] + '</a>';
							});
						} else {
							listHTML = this.data;
						}
						this.list.children().not('input').remove();
						this.list.append(listHTML);
						if (this.data !== 'string') {
							//that.input.val(this.value);
							//that.curValue.html(this.value);
						}
					},
					this.events = function() {
						var that = this;
						this.list.find('a').bind('click', function(e) {
							e.stopPropagation();
							that.input.val($(this).attr('val'));
							that.curValue.html($(this).text());
							that.list.hide();
							that.select.removeClass('m-focus');
							that.click && that.click.call(this, $(this).attr('val') | 0, $(this).index());
						});
						$(document).unbind('click', removeMenus)
							.bind('click', removeMenus);
						this.select.bind('click', function(e) {
							e.stopPropagation();
							removeMenus();
							that.list.show();
							that.select.addClass('m-focus');
						});
					}

					this.create();
					this.events();
				}
			},
			script: function(src, callback, that) {
				var script = document.getElementsByTagName('script'),
					i = 0,
					len = script.length;
				for (; i < len; i++) {
					if (/Selector.js/.test(script[i].src)) {
						$.getScript(script[i].src.replace('Selector.js', src), function() {
							callback.call(that, addressCode);
						});
						break;
					}
				}
			}
	}; window.SelectorJS = SelectorJS;
})();