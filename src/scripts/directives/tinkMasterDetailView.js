'use strict';
   angular.module('tinkApp')
 .directive('tinkMasterDetailView',[function () {
 	return {
 		restirct:'E',
 		templateUrl:'templates/tinkMasterDetailView.html',
 		transclude:'true',
 		replace:true,
 		scope:true,
 		controller:function($scope,$element,$attrs){
 			var ctrl = this;
 			$element={listView:undefined,contentView:undefined,main:undefined};
 			var $split={first:undefined,second:undefined,bar:undefined};
 			var $direction='vertical';
 			var $isResizable = true;
 			if($attrs.tinkIsResizable) {
 				$isResizable = $attrs.tinkIsResizable;
 			}

 			// this.setUnresizable = function() {
 			// 	$split.bar = undefined;
 			// }

 			this.addView=function(element){
 				if($split.first === undefined || $split.second === undefined){
 					addview($(element));
 				}else{
 					$(element).remove();
 				}
 			};

 			this.removeView=function(element){
 				if($($split.first).get(0) === $(element).get(0)){

 					$split.first = undefined;
 					if($split.bar !== null) {
	 					$split.bar.remove();
	 					$split.bar = undefined;
	 				}
 				}else if($($split.second).get(0) === $(element).get(0)){
 					$split.second = undefined;
 				}
 			};

 			this.setInitSize = function(size){
 				size = parseInt(size);
 				if(size >=7 && size <= 90 && $split.first && $split.second){
 					if($direction === 'horizontal'){
 						$split.first.height(size-1+'%');
	    				$split.second.height((100-size)+'%');
	    				if($split.bar !== undefined) {
		    				$split.bar.css('top','calc('+size+'% - 3px)');
		    			}
 					}else{
 						$split.first.width(size-1+'%');
	    				$split.second.width((100-size)+'%');
	    				if($split.bar !== undefined) {
		    				$split.bar.css('left','calc('+size+'% - 3px)');
		    			}
 					}
 				}
 			};

 			this.setVertical = function(){
 				$direction = 'vertical';
 			};

 			this.setHorizontal = function(){
 				$direction = 'horizontal';
 			};

 			this.setMain = function(element){
 				$element.main = element;
 			};

 			function addview(element){
					//check if this is the first or the second view !
 				if($split.first === null || $split.first === undefined){
 					$split.first = $(element);
 					// console.log($isResizable);
 					// if($isResizable != false) {
 						// console.log($isResizable);
 						$split.bar = $('<div class="split-handle"></div>');
 						$(element).after($split.bar);
 					// }
 				}else if($split.second === null || $split.second === undefined){
 					$split.second = $(element);
 					//Add the resize event if all the panes are added.
 					ctrl.addReziseEvent();
 				}else{
 					console.warn('there is already a first and second element !');
 				}
 			}

 			 var pointerEventToXY = function(e){
		      var out = {x:0, y:0};
		      if(e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel'){
		        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
		        out.x = touch.pageX;
		        out.y = touch.pageY;
		      } else if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover'|| e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
		        out.x = e.pageX;
		        out.y = e.pageY;
		      }
		      return out;
		    };

	    function changeX(e){
	    	// console.log("Change X");
	    	// var currentWidth = $split.first.outerWidth(true);
	    	// console.log(currentWidth);
	    	// if(currentWidth > 300) {
	    		var pageX = pointerEventToXY(e).x;
		    	var x = (pageX-$split.first.offset().left)/$element.main.outerWidth(true) *100;
		    	if(x > 10 && x < 90){
		    		$split.first.width(x-1+'%');
		    		$split.bar.css('left','calc('+x+'% - 3px)');
		    		$split.second.width((100-x)+'%');
		    	}
	    	// } else {
	    	// 	$split.first.width(301);
	    	// 	$split.bar.css('left','calc('+x+'% - 3px)');
	    	// 	$split.second.width((100-x)+'%');
	    	// }
	    }

	    function changeY(e){
	    	// console.log("Change Y");
	    	var pageY = pointerEventToXY(e).y;
	    	var y = (pageY-$split.first.offset().top)/$element.main.outerHeight(true) * 100;
		    if(y > 10 && y < 90){
		    	$split.first.height(y-1+'%');
		    	$split.bar.css('top','calc('+y+'% - 3px)');
		    	$split.second.height((100-y)+'%');
		    }
	    }

 			this.addReziseEvent = function(){
 				if($split.bar !== undefined) {
	 				$split.bar.bind('mousedown touchstart',function(/*e*/){
					   $(document).bind('mousemove touchmove',function (e) {
					    if($direction==='vertical'){
					  		$('html').addClass('col-resize');
					    	changeX(e);

					    } else if($direction ==='horizontal'){
					    	$('html').addClass('row-resize');
					    	changeY(e);
					    }
					    return false;
						});
						$(document).bind('mouseup touchend',function(){
							//var x = parseInt($split.bar.css('left'))/$(document).innerWidth() *100;
							//$split.bar.css('left','calc('+x+'% + 3px)');
							$('html').removeClass('row-resize').removeClass('col-resize');
							$(document).unbind('mousemove touchmove mouseup touchend');
							return false;
			 			});
						return false;
	 				});
 				}
 			};

 			this.removeResizeEvent = function(){
 				if($split.bar !== null) {
	 				$split.bar.unbind('mousedown touchstart');
	 			}
 			};
 		},

 		link:function(scope,elem,attr,ctrl){
 			ctrl.setMain($(elem));
 			if(attr.tinkSplitViewDirection){
 				if(attr.tinkSplitViewDirection === 'horizontal'){
 					elem.addClass('split-view-horizontal');
 					ctrl.setHorizontal();
 				}else{
 					elem.addClass('split-view-vertical');
 					ctrl.setVertical();
 				}
 			}else{
 				elem.addClass('split-view-vertical');
 				ctrl.setVertical();
 			}

 			if(attr.tinkInitSize){
 				ctrl.setInitSize(attr.tinkInitSize);
 			}

 			// if(attr.tinkIsResizable){
 			// 	ctrl.setUnresizable();
 			// }

			scope.$on('$destroy',function handleDestroyEvent() {
				ctrl.removeResizeEvent();
			});

			// scope.addResizer = function(){
			//  	var x = e.pageX - $('#sidebar').offset().left;
			// 	if (x > min && x < max && e.pageX < ($(window).width() - mainmin)) {
			// 	  $('#sidebar').css("width", x);
			// 	  $('#main').css("margin-left", x);
			// 	}
			// }

 		}
 	};
 }]);