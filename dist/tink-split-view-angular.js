'use strict';
(function(module) {
  try {
    module = angular.module('tink.split-view');
  } catch (e) {
    module = angular.module('tink.split-view', ['ngSanitize']);
  }
 module.directive('tinkContentView',[function () {
  return {
    require:'^tinkMasterDetailView',
    restirct:'E',
    templateUrl:'templates/tinkContentView.html',
    scope:true,
    transclude:true,
      replace:true,
    link:function(scope,elem,attr,ctrl){
      ctrl.addView(elem);
      elem.on('$destroy', function () {
          scope.$destroy();
      });
      scope.$on('$destroy',function(){
        ctrl.removeView($(elem));
      });
    }
  };
 }]);
})();;'use strict';
(function(module) {
  try {
    module = angular.module('tink.split-view');
  } catch (e) {
    module = angular.module('tink.split-view',['ngSanitize']);
  }
 module.directive('tinkListItem',[function () {
 	return {
 		require:'^tinkListView',
 		restirct:'EA',
 		scope:{
 			tinkListItem:'='
 		},

 		link:function(scope,elem,attr,ctrl){
 			var id = scope.tinkListItem;
 			var object = {id:id,elem:$(elem)};
 			if(id){
 				ctrl.addItem(object);
 			}else{
 				return;
 			}

 			elem.on('$destroy', function () {
			  	scope.$destroy();
			});
 			scope.$on('$destroy',function(){
 				ctrl.removeItem(object);
 			});
 			$(elem).bind('click',function(){
 				scope.$apply(function(){
 					ctrl.setActiveItem(id);
 				});
 			});
 		}
 	};
 }]);
})();;'use strict';
(function(module) {
  try {
    module = angular.module('tink.split-view');
  } catch (e) {
    module = angular.module('tink.split-view',['ngSanitize']);
  }
 module.directive('tinkListView',[function () {
 	return {
 		require:['tinkListView','^tinkMasterDetailView'],
 		restirct:'E',
 		templateUrl:'templates/tinkListView.html',
 		scope:{
 			tinkActiveItem:'=',
 			itemChange:'&'
 		},
 		transclude:true,
 		replace:true,
 		terminal: true,
 		controller:function($scope,$rootScope){
 			var ctrl = this;
 			var items = {};
 			var activeItem;

 			function callChange(item){

 				var callData = '';
 				if(item){
 					callData = {
 						$active:item.id
 					};
 				}

 				$scope.itemChange(callData);

 				$rootScope.$broadcast('tink-list-item-click',callData);
 			}
 			function setElementActive(item){
 				if(item === undefined || item === null || !items[item.id]){

 					if(activeItem){
 						$scope.tinkActiveItem = undefined;
 						ctrl.unselect();
 					}
 					activeItem = item;
 					return;
 				}
 				if(activeItem && activeItem.id === item.id){
 					return;
 				}
 				if(activeItem){
 					//disable item
 					$(activeItem.elem).removeClass('active');
 				}

 				callChange(item);

 				activeItem = item;
 				$(activeItem.elem).addClass('active');

 			}
 			this.unselect = function(){
 				if(activeItem){
 					$(activeItem.elem).removeClass('active');
 					activeItem = undefined;
 					callChange(activeItem);
 				}
 			};
 			this.getActiveItem=function(){
 				return activeItem;
 			};
 			this.setElementActive = function(id){
 				if(items[id]){
 					setElementActive(items[id]);
 				}else if(id){
 					setElementActive({id:id});
 				}else{
 					setElementActive(undefined);
 				}
 			};
 			this.setActiveItem = function(id){
 				$scope.tinkActiveItem = id;
 			};
 			this.addItem=function(item){
 				if(!items[item.id]){
 					items[item.id] = item;
 					if(activeItem && item.id === activeItem.id){
 						activeItem = null;
 						ctrl.setElementActive(item.id);
 					}
 				}else if(items[item.id]){

 				}
 			};
 			this.removeItem=function(item){
 				if(items[item.id]){
 					delete items[item.id];
 				}
 			};


 		},
 		link:function(scope,elem,attr,ctrl){
 			var ctrlList = ctrl[0];
 			var ctrlListView = ctrl[1];

 			ctrlListView.addView(elem);
 			elem.on('$destroy', function () {
			  	scope.$destroy();
			});
 			scope.$on('$destroy',function(){
 				// ctrl.removeView($(elem));
 			});
 			scope.$watch('tinkActiveItem',function(newData/*,oldData*/){
 				ctrlList.setElementActive(newData);
 			});

 		}
 	};
 }]);
})();;'use strict';
(function(module) {
  try {
    module = angular.module('tink.split-view');
  } catch (e) {
    module = angular.module('tink.split-view',['ngSanitize']);
  }
  module.directive('tinkMasterDetailView',[function () {
    return {
     restirct:'E',
     templateUrl:'templates/tinkMasterDetailView.html',
     transclude:'true',
     replace:true,
     scope:{
      tinkIsResizable:'='
    },
    controller:function($scope,$element){
      var ctrl = this;
      $element={listView:undefined,contentView:undefined,main:undefined};
      var $split={first:undefined,second:undefined,bar:undefined};
      var $direction='vertical';
      var $isResizable = true;

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
 					$scope.$watch('tinkIsResizable',function(value){
            if(angular.isDefined(value)) {
              $isResizable = value === true || value === 'true';
            }
            if($isResizable){
              ctrl.addReziseEvent();
            }else{
              ctrl.removeResizeEvent();
            }
          });
 				}else{
 					console.warn('there is already a first and second element !');
 				}
 			}

      function changeX(e){
        // console.log("Change X");
        // var currentWidth = $split.first.outerWidth(true);
        // console.log(currentWidth);
        // if(currentWidth > 300) {
        var pageX = pointerEventToXY(e).x;
        var x = (pageX-$split.first.offset().left)/$element.main.outerWidth(true) *100;
        if(x > 10 && x < 90){
          $split.first.css('width',x+'%');
          $split.bar.css('left','calc('+x+'% - 3px)');
          $split.second.css('width',(100-x)+'%');
        }
        // } else {
        //  $split.first.width(301);
        //  $split.bar.css('left','calc('+x+'% - 3px)');
        //  $split.second.width((100-x)+'%');
        // }
      }

      function changeY(e){
        // console.log("Change Y");
        var pageY = pointerEventToXY(e).y;
        var y = (pageY-$split.first.offset().top)/$element.main.outerHeight(true) * 100;
        if(y > 10 && y < 90){
          // $split.first.height(y+'%');
          $split.first.css('height',y+'%');
          $split.bar.css('top','calc('+y+'% - 3px)');
          $split.second.css('height',100-y+'%');
        }
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
            $split.first.css('height',size+'%');
            $split.second.css('height',100-size+'%');
            if($split.bar !== undefined) {
              $split.bar.css('top','calc('+size+'% - 3px)');
            }
          }else{
            $split.first.css('width',size+'%');
            $split.second.css('width',100-size+'%');
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
})();;angular.module('tink.split-view').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/tinkContentView.html',
    "<div class=split-pane ng-transclude> </div>"
  );


  $templateCache.put('templates/tinkListView.html',
    "<div class=split-pane ng-transclude> </div>"
  );


  $templateCache.put('templates/tinkMasterDetailView.html',
    "<div ng-transclude> </div>"
  );

}]);
