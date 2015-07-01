'use strict';
(function(module) {
  try {
    module = angular.module('tink.split-view');
  } catch (e) {
    module = angular.module('tink.split-view', []);
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
})();