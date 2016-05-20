
module.exports = function(ngModule){

    require('./main.css');

    ngModule.directive('main', ['tuningService', 'noteService', 'scaleService',
    function(tuningService, noteService, scaleService){
            return {
                restrict: 'E',
                scope: {},
                template: require('./main.html'),
                replace: true,
                link: function($scope, $elem, $attrs){
                    $scope.tuningOptions = tuningService.tuningOptions;
                    $scope.tuningSelection = tuningService.tuningOptions[0];
                    $scope.keyOptions = noteService.noteOptions;
                    $scope.keySelection = noteService.noteOptions[0];
                    $scope.scaleOptions = scaleService.scaleOptions;
                    $scope.scaleSelection = scaleService.scaleOptions[0];
                }
            };
        }]);

};