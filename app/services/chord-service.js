module.exports = function(ngModule){
    ngModule.service('chordService', ['intervalService', function(intervalService){

        var intervals = intervalService.intervals;

        const chordOptions = [
            {
                id: 'MAJOR',
                label: 'Major',
                intervals: [
                    intervals.FIRST,
                    intervals.MAJOR_THIRD,
                    intervals.PERFECT_FIFTH
                ]
            },
            {
                id: 'MINOR',
                label: 'Minor',
                intervals: [
                    intervals.FIRST,
                    intervals.MINOR_THIRD,
                    intervals.PERFECT_FIFTH
                ]
            },
            {
                id: 'AUGMENTED',
                label: 'Augmented',
                intervals: [
                    intervals.FIRST,
                    intervals.MAJOR_THIRD,
                    intervals.MINOR_SIXTH
                ]
            },
            {
                id: 'DIMINISHED',
                label: 'Diminished',
                intervals: [
                    intervals.FIRST,
                    intervals.MINOR_THIRD,
                    intervals.DIM_FIFTH
                ]
            },
            {
                id: 'MAJOR_SIXTH',
                label: 'Major Sixth',
                intervals: [
                    intervals.FIRST,
                    intervals.MAJOR_THIRD,
                    intervals.PERFECT_FIFTH,
                    intervals.MAJOR_SIXTH
                ]
            },
            {
                id: 'MINOR_SIXTH',
                label: 'Minor Sixth',
                intervals: [
                    intervals.FIRST,
                    intervals.MINOR_THIRD,
                    intervals.PERFECT_FIFTH,
                    intervals.MAJOR_SIXTH
                ]
            },
            {
                id: 'DOMINANT_SEVENTH',
                label: 'Dominant Seventh',
                intervals: [
                    intervals.FIRST,
                    intervals.MAJOR_THIRD,
                    intervals.PERFECT_FIFTH,
                    intervals.MINOR_SEVENTH
                ]
            },
            {
                id: 'MINOR_SEVENTH',
                label: 'Minor Seventh',
                intervals: [
                    intervals.FIRST,
                    intervals.MINOR_THIRD,
                    intervals.PERFECT_FIFTH,
                    intervals.MINOR_SEVENTH
                ]
            },
            {
                id: 'MAJOR_SEVENTH',
                label: 'Major Seventh',
                intervals: [
                    intervals.FIRST,
                    intervals.MAJOR_THIRD,
                    intervals.PERFECT_FIFTH,
                    intervals.MAJOR_SEVENTH
                ]
            },
            {
                id: 'AUGMENTED_SEVENTH',
                label: 'Augmented Seventh',
                intervals: [
                    intervals.FIRST,
                    intervals.MAJOR_THIRD,
                    intervals.MINOR_SIXTH,
                    intervals.MINOR_SEVENTH
                ]
            },
            {
                id: 'DIMINISHED_SEVENTH',
                label: 'Diminished Seventh',
                intervals: [
                    intervals.FIRST,
                    intervals.MINOR_THIRD,
                    intervals.DIM_FIFTH,
                    intervals.MINOR_SEVENTH
                ]
            },
            {
                id: 'POWER_FOUR',
                label: 'Power Four',
                intervals: [
                    intervals.FIRST,
                    intervals.PERFECT_FOURTH
                ]
            },
            {
                id: 'POWER_FIVE',
                label: 'Power Five',
                intervals: [
                    intervals.FIRST,
                    intervals.PERFECT_FIFTH
                ]
            }
        ];

        this.chordOptions = chordOptions;

    }]);
};