'use strict';
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
})();