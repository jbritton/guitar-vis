module.exports = function(ngModule){
    ngModule.service('scaleService', ['intervalService', function(intervalService){
        var intervals = intervalService.intervals;

        const scaleOptions = [
            {
                id: 'MAJOR',
                label: 'Major',
                intervals: [
                    intervals.FIRST,
                    intervals.MAJOR_SECOND,
                    intervals.MAJOR_THIRD,
                    intervals.PERFECT_FOURTH,
                    intervals.PERFECT_FIFTH,
                    intervals.MAJOR_SIXTH,
                    intervals.MAJOR_SEVENTH
                ]
            },
            {
                id: 'MAJOR_PENTATONIC',
                label: 'Major Pentatonic',
                intervals: [
                    intervals.FIRST,
                    intervals.MAJOR_SECOND,
                    intervals.MAJOR_THIRD,
                    intervals.PERFECT_FIFTH,
                    intervals.MAJOR_SIXTH
                ]
            },
            {
                id: 'MINOR',
                label: 'Natural Minor',
                intervals: [
                    intervals.FIRST,
                    intervals.MAJOR_SECOND,
                    intervals.MINOR_THIRD,
                    intervals.PERFECT_FOURTH,
                    intervals.PERFECT_FIFTH,
                    intervals.MINOR_SIXTH,
                    intervals.MAJOR_SEVENTH
                ]
            },
            {
                id: 'MINOR_PENTATONIC',
                label: 'Minor Pentatonic',
                intervals: [
                    intervals.FIRST,
                    intervals.MINOR_THIRD,
                    intervals.PERFECT_FOURTH,
                    intervals.PERFECT_FIFTH,
                    intervals.MINOR_SEVENTH
                ]
            }
        ];

        this.scaleOptions = scaleOptions;
    }]);
};