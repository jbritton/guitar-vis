
module.exports = function(ngModule){

    require('./fretboard.css');

    ngModule.directive('fretboard', ['tuningService', 'noteService',
        function(tuningService, noteService){

            return {
                restrict: 'E',
                scope: {
                    tuning: '='
                },
                template: require('./fretboard.html'),
                replace: true,
                link: function($scope, $elem, $attrs){
                    console.log('fretboard directive');

                    $scope.fretMatrix = null;

                    $scope.formatRoman = function(num) {
                        if(num === 0)
                            return 'Open';
                        
                        if (!+num)
                            return false;
                        var digits = String(+num).split(''),
                            key = ['','C','CC','CCC','CD','D','DC','DCC','DCCC','CM',
                                '','X','XX','XXX','XL','L','LX','LXX','LXXX','XC',
                                '','I','II','III','IV','V','VI','VII','VIII','IX'],
                            roman = '',
                            i = 3;
                        while (i--)
                            roman = (key[+digits.pop() + (i * 10)] || '') + roman;
                        return Array(+digits.join('') + 1).join('M') + roman;
                    };

                    function createFretMatrix(noteMatrix){
                        var fretMatrix = noteMatrix.map(function(noteRow){
                            return noteRow.map(function(note){
                                return { note: note, cssClasses: [] };
                            });
                        });
                        return fretMatrix;
                    }

                    function draw(){
                        var noteMatrix = noteService.noteMatrix($scope.tuning);
                        $scope.fretMatrix = createFretMatrix(noteMatrix);
                    }

                    function onTuningChange(newTuning, oldTuning){
                        console.log('tuning change', arguments);
                        draw();
                    }

                    function init(){
                        console.log('tuning', $scope.tuning)
                        if(angular.isObject($scope.tuning)){
                            draw();
                        }
                        $scope.$watch('tuning', onTuningChange);
                    }

                    init();
                }
            };
    }]);

};