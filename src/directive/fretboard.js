
angular.module('guitarvis')
    .directive('fretboard', [
        function(){
            return {
                restrict: 'AE',
                templateUrl: 'guitarvis/fretboard.html',
                replace: true,
                scope: {
                    fretdata: '='
                },
                link: function($scope, $element, $attrs){ }
            };
        }
    ]);