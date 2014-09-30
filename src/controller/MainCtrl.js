
angular.module('guitarvis')
    .controller('MainCtrl', ['$scope', function($scope){

        $scope.model = {};
        $scope.model.fretdata = {
            noteMatrix: [
                [ 'e', 'f', 'f#', 'g' ],
                [ 'b', 'c', 'c#', 'd' ],
                [ 'g', 'g#', 'a', 'a#' ],
                [ 'd', 'd#', 'f', 'f#' ],
                [ 'a', 'a#', 'b', 'c' ],
                [ 'e', 'f', 'f#', 'g' ]
            ]
        };
    }]);