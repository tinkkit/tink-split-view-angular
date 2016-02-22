angular.module('tink.split-view').run(['$templateCache', function($templateCache) {
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
