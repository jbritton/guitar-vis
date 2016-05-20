module.exports = function(ngModule){
    ngModule.service('tuningService', [function(){

        const tuningOptions = [
            { id: 'STANDARD', label: 'Standard', notes: ['e', 'a', 'd', 'g', 'b', 'e'] },
            { id: 'DROPD', label: 'Drop D', notes: ['d', 'a', 'd', 'g', 'b', 'e'] },
            { id: 'DADGAD', label: 'DADGAD', notes: ['d', 'a', 'd', 'g', 'a', 'd'] },
            { id: 'OPENA', label: 'Open A', notes: ['e', 'a', 'e', 'a', 'c#', 'e'] },
            { id: 'OPENC', label: 'Open C', notes: ['c', 'g', 'c', 'g', 'c', 'e'] },
            { id: 'OPEND', label: 'Open D', notes: ['d', 'a', 'd', 'f#', 'a', 'd'] },
            { id: 'OPENE', label: 'Open E', notes: ['e', 'b', 'e', 'g#', 'b', 'e'] },
            { id: 'OPENG', label: 'Open G', notes: ['d', 'g', 'd', 'g', 'b', 'd'] }
        ];

        this.tuningOptions = tuningOptions;

    }]);
};