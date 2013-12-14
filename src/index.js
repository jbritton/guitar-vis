
(function(){

    var gvis = { version: 0.1 };


    //---------------------------------------------------------------------------------------------
    //  Notes
    //---------------------------------------------------------------------------------------------

    var NOTES = ["a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"];

    gvis.note = {};

    /**
     * Generate a sequence of notes (ie. notes on a string)
     * @param note {Note} starting note
     * @param size {Number} number of frets
     * @param offset {Number} optional
     */
    gvis.note.range = function(note, size, offset){
        return gvis_note_range(note, size, offset)
    }

    /**
     * Generate a matrix of notes (ie. a fretboard)
     * @param notes {Array} tuning
     * @param size {Number} number of frets
     * @param offset {Number} optional
     */
    gvis.note.matrix = function(notes, size, offset){
        return gvis_note_matrix(notes, size, offset);
    }

    function gvis_note_range(note, size, offset){
        var values = [];
        var noteIndex = NOTES.indexOf(note);

        // exit if note not found
        if(noteIndex == -1)
            return values;

        var i = (offset)? offset : 1;
        while(i <= size){
            values.push(NOTES[noteIndex]);
            noteIndex = (noteIndex === NOTES.length-2)? 0 : ++noteIndex;
            i++;
        }
        return values;
    }

    function gvis_note_matrix(notes, size, offset){
        var matrix = [];
        for(var x=0; x<notes.length; x++){
            matrix.push(gvis_note_range(notes[x], size, offset))
        }
        return matrix;
    }

    //---------------------------------------------------------------------------------------------
    //  Tuning
    //---------------------------------------------------------------------------------------------
    gvis.tuning = {};
    gvis.tuning.STANDARD = ["e", "a", "d", "g", "b", "e"];
    gvis.tuning.DADGAD = ["d", "a", "d", "g", "a", "d"];
    gvis.tuning.OPENA = ["e", "a", "e", "a", "c#", "e"];
    gvis.tuning.OPENC = ["c", "g", "c", "g", "c", "e"];
    gvis.tuning.OPEND = ["d", "a", "d", "f#", "a", "d"];
    gvis.tuning.OPENE = ["e", "b", "e", "g#", "b", "e"];
    gvis.tuning.OPENG = ["d", "g", "d", "g", "b", "d"];

    //---------------------------------------------------------------------------------------------
    //  Interval
    //---------------------------------------------------------------------------------------------
    gvis.interval = {};
    gvis.interval.nth = function(root, steps){
        return gvis_interval_nth(root, steps);
    };
    gvis.interval.root = function(root){
        return root;
    };
    gvis.interval.minorSecond = function(root){
        return gvis_interval_nth(root, 1);
    };
    gvis.interval.majorSecond = function(root){
        return gvis_interval_nth(root, 2);
    };
    gvis.interval.minorThird = function(root){
        return gvis_interval_nth(root, 3);
    };
    gvis.interval.majorThird = function(root){
        return gvis_interval_nth(root, 4);
    };
    gvis.interval.fourth = function(root){
        return gvis_interval_nth(root, 5);
    };
    gvis.interval.minorFifth = function(root){
        return gvis_interval_nth(root, 6);
    };
    gvis.interval.majorFifth = function(root){
        return gvis_interval_nth(root, 7);
    };
    gvis.interval.minorSixth = function(root){
        return gvis_interval_nth(root, 8);
    };
    gvis.interval.majorSixth = function(root){
        return gvis_interval_nth(root, 9);
    };
    gvis.interval.minorSeventh = function(root){
        return gvis_interval_nth(root, 10);
    };
    gvis.interval.majorSeventh = function(root){
        return gvis_interval_nth(root, 11);
    };

    function gvis_interval_nth(root, steps){
        var noteIndex = NOTES.indexOf(root);
        if(noteIndex == -1)
            return undefined;
        var i = (noteIndex + steps) % (NOTES.length);
        return NOTES[i];
    }

    //---------------------------------------------------------------------------------------------
    //  Scale
    //---------------------------------------------------------------------------------------------
    gvis.scale = {};
    gvis.scale.major = function(root){
        var intervals = ["root", "majorSecond", "majorThird", "fourth", "majorFifth", "majorSixth", "majorSeventh"];
        return gvis_scale_notes(root, intervals);
    }

    gvis.scale.minor = function(root){
        var intervals = ["root", "majorSecond", "minorThird", "fourth", "majorFifth", "minorSixth", "minorSeventh"];
        return gvis_scale_notes(root, intervals);
    }

    gvis.scale.pentatonic = function(root){
        var intervals = ["root", "minorThird", "fourth", "majorFifth", "minorSeventh"];
        return gvis_scale_notes(root, intervals);
    }

    gvis.scale.blues = function(root){
        var intervals = ["root", "minorThird", "fourth", "minorFifth", "majorFifth", "minorSeventh"];
        return gvis_scale_notes(root, intervals);
    }

    function gvis_scale_notes(root, intervals){
        var values = [];
        for(var x=0; x<intervals.length; x++){
            var key = intervals[x];
            var fn = gvis.interval[key];
            values.push(fn.apply(root));
        }
        return values;
    }

    window.gvis = gvis;
})();