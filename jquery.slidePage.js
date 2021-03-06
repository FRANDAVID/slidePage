(function($, window){
	
	//transition兼容
	var suportsTransition = (function(){
		var style = document.documentElement.style || document.body.style,
			transition = "transition", vender = ["Moz", "Webkit", "O", "ms"],
			transition = transition.charAt(0).toUpperCase() + transition.substr(1), i = 0;
		while( i < vender.length){
			if(typeof style[vender[i] + transition] === "string"){
				return vender[i];
			}
			i++;
		}
		
		return false;
	})();
	
	var defaults = {
		orientation: 'vertical',   //滑块方向
		keyboard: true,            //是否开启键盘监听
		duration: 1000,            //动画持续时间，单位毫秒
		quietPeriod: 300,          //停滞时间，单位毫秒
		menu: null,                //滑动点的名称，是一个数组，根据滑块的多少而定
		fun: null                  //滑块滑动的事件，类型为function
	};
	
	$.fn.slidePage = function(options){
		var setting = $.extend({}, defaults, options || {}),
			_this = this, 
			winW = document.documentElement.clientWidth || document.body.clientWidth,
			winH = document.documentElement.clientHeight || document.body.clientHeight,
			index = 0,                                      //目前滑块的序号
			lastTransition = 0,                              //上一个滑动的时间
			isResize = false,                                //是否窗口重置
			items = $(_this).children(".slide-page-item");     //滑块数组
		
		items.each(function(i, el){
			$(el).addClass("slide-page-item-" + parseInt(i));
			$(el).css({"width": winW, "height": winH});
			$('body,html').addClass('initBody')
		})
		
		$(this).wrap('<div class="wrapper"></div>');
		$('.wrapper').css({width:winW,height:winH,'position':'relative'});
		
		if(items.length > 1){
			if(setting.orientation == "vertical"){
				$(".wrapper").append("<ul class='vertical-page'></ul>");
				if(suportsTransition){
					$(_this).css({
						"transform": "translate3d(0 ,0 ,0)",
						"transition": "all " + setting.duration + "ms"
					});
				} else{
					$(_this).css({width:winW,height:winH,'position':'absolute','left':0}).animate({top: 0}, setting.duration);
				}
				for(var i = 0; i < items.length; i++){
					var li = document.createElement("li");
					if(setting.menu){
						li.innerHTML = "<a href='#slide-page-item-" + i + "' data-index='" + i + "'><i class='dot'></i><span>" + setting.menu[i] + "</span>";
					} else {
						li.innerHTML = "<a href='#slide-page-item-" + i + "' data-index='" + i + "'><i class='dot'></i><span></span>"
					}
					$(".vertical-page")[0].appendChild(li);
				}
			}else if(setting.orientation == "horizontal"){
				$(".wrapper").append("<ul class='horizontal-page'></ul>");
				items.css({"display": "inline-block"});
				if(suportsTransition){
					$(_this).css({
						"transform": "translate3d(0 ,0 ,0)",
						"transition": "all " + setting.duration + "ms",
						"width": winW * items.length
					});
				} else{
					$(_this).css({width:winW * items.length,height:winH,'position':'absolute','left':0}).animate({top: 0}, setting.duration);
				}
				for(var i = 0; i < items.length; i++){
					var li = document.createElement("li");
					if(setting.menu){
						li.innerHTML = "<a href='#slide-page-item-" + i + "' data-index='" + i + "'><i class='dot'></i><span>" + setting.menu[i] + "</span>";
					} else {
						li.innerHTML = "<a href='#slide-page-item-" + i + "' data-index='" + i + "'><i class='dot'></i><span></span>"
					}
					$(".horizontal-page")[0].appendChild(li);
				}
			}
		
		}
		if(setting.orientation == "vertical"){
			$(".vertical-page").eq(0).find("li").first().addClass("page-active");
			var pageH = $(".vertical-page")[0].offsetHeight;
			$(".vertical-page").css({'height': pageH, 'margin-top': - pageH / 2 });
			$(".vertical-page").eq(0).find("li").on("click", function(){
				var _li = this;
				var hash = $(_li).find("a").attr("href").split("#")[1];
				$(_li).addClass("page-active").siblings().removeClass("page-active");
				index = $(_li).index();
				slide(index);
				if(history.replaceState){
					history.pushState({}, document.title, "#" + hash);
				} else{
					location.hash = hash;
				}
			});
			$(".vertical-page").eq(0).find("li").hover(function(){
				$(this).find("span").css({"display": "inline-block","opacity" : "1"});
			},function(){
				$(this).find("span").hide()
				$(this).find("span").css({"display": "none","opacity" : "0"});
			})
		} else if(setting.orientation == "horizontal"){
			$(".horizontal-page").eq(0).find("li").first().addClass("page-active");
			var pageW = $(".horizontal-page")[0].offsetWidth;
			$(".horizontal-page").eq(0).css({'width': pageW, 'margin-left': - pageW / 2 });
			$(".horizontal-page").eq(0).find("li").on("click", function(){
				var _li = this;
				var hash = $(_li).find("a").attr("href").split("#")[1];
				$(_li).addClass("page-active").siblings().removeClass("page-active");
				index = $(_li).index();
				slide(index);
				if(history.replaceState){
					history.pushState({}, document.title, "#" + hash);
				} else{
					location.hash = hash;
				}
			});
			$(".horizontal-page").eq(0).find("li").hover(function(){
				$(this).find("span").show()
				$(this).find("span").css({"opacity" : "1"});
			},function(){
				$(this).find("span").hide()
				$(this).find("span").css({"opacity" : "0"});
			})
		}
		
		function slide(i){
			if(setting.orientation == "vertical"){
				var posY = - i * winH + "px";
				$(".vertical-page").find("li").removeClass("page-active").eq(i).addClass("page-active");
				if(suportsTransition){
					$(_this).css({
						"transform": "translate3d(0 ," + posY + ",0)",
						"transition": "all " + setting.duration + "ms"
					});
				} else{
					$(_this).animate({top: posY}, setting.duration);
				}
				if(!isResize){
					$(_this).trigger('slide');
				}else{
					isResize = false;
				}
			} else if(setting.orientation == "horizontal"){
				var posX = - i * winW + "px";
				$(".horizontal-page").find("li").removeClass("page-active").eq(i).addClass("page-active");
				if(suportsTransition){
					$(_this).css({
						"transform": "translate3d(" + posX + ",0 ,0)",
						"transition": "all " + setting.duration + "ms"
					});
				} else{
					$(_this).animate({left: posX}, setting.duration);
				}
				if(!isResize){
					$(_this).trigger('slide');
				}else{
					isResize = false;
				}
			}
		}
		
		function initSlide(d){
			var timeNow = new Date().getTime();
			if(timeNow - lastTransition < setting.duration + setting.quietPeriod){
				return;
			}
			if(d > 0){
				index--;
				if(index < 0){
					index = 0;
				}
				slide(index);
			} else if(d < 0){
				index++;
				if(index > items.length - 1){
					index = items.length - 1;
				}
				slide(index);
			}
			lastTransition = timeNow;
		}
		
		$(document).on("mousewheel DOMMouseScroll", function(e){
			var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
			e.preventDefault();
			initSlide(delta);
		})
		
		function windowSize(w, h){
			$('.wrapper').css({'width':w,'height':h});
			items.css({"width":w, "height": h});
			$('body,html').addClass('initBody')
		}
		
		$(window).on("resize", function(){
			winW = document.documentElement.clientWidth || document.body.clientWidth;
			winH = document.documentElement.clientHeight || document.body.clientHeight;
			windowSize(winW, winH);
			isResize = true;
			slide(index);
		})
		
		if(setting.keyboard == true){
			$(document).on("keyup", function(e){
				var key = e.keyCode;
				if(key == 38){
					index--;
					if(index < 0){
						index = 0;
					}
					slide(index);
				} else if(key == 40){
					index++;
					if(index > items.length - 1){
						index = items.length - 1;
					}
					slide(index);
				}
			})
		}
		
		return $(_this);
		
	}
	
})(jQuery, window);