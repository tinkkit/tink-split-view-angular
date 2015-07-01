 'use strict';
  angular.module('tinkApp')
 .directive('tinkListView',[function () {
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