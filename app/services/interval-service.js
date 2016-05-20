module.exports = function(ngModule){
    ngModule.service('intervalService', [function(){

        var intervals = this.intervals = {};
        intervals.FIRST = { id: 'FIRST', label: 'Root', offset: 0 };
        intervals.MINOR_SECOND = { id: 'MINOR_SECOND', label: 'Min 2nd', offset: 1 };
        intervals.MAJOR_SECOND = { id: 'MAJOR_SECOND', label: 'Maj 2nd', offset: 2 };
        intervals.MINOR_THIRD = { id: 'MINOR_THIRD', label: 'Min 3rd', offset: 3 };
        intervals.MAJOR_THIRD = { id: 'MAJOR_THIRD', label: 'Maj 3rd', offset: 4 };
        intervals.PERFECT_FOURTH = { id: 'PERFECT_FOURTH', label: 'Perfect 4th', offset: 5 };
        intervals.DIM_FIFTH = { id: 'DIM_FIFTH', label: 'Dim 5th', offset: 6 };
        intervals.PERFECT_FIFTH = { id: 'PERFECT_FIFTH', label: 'Perfect 5th', offset: 7 };
        intervals.MINOR_SIXTH = { id: 'MINOR_SIXTH', label: 'Min 6th', offset: 8 };
        intervals.MAJOR_SIXTH = { id: 'MAJOR_SIXTH', label: 'Maj 6th', offset: 9 };
        intervals.MINOR_SEVENTH = { id: 'MINOR_SEVENTH', label: 'Min 7th', offset: 10 };
        intervals.MAJOR_SEVENTH = { id: 'MAJOR_SEVENTH', label: 'Maj 7th', offset: 11 };
        intervals.OCTAVE = { id: 'OCTAVE', label: 'Octave', offset: 12 };

    }]);
};