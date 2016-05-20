
module.exports = function(ngModule){
    ngModule.service('noteService', [ function(){

        /**
         * Note constants
         * @type {string[]}
         */
        const NOTES = ["a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"];
        this.notes = NOTES;

        this.noteOptions = NOTES.map(function(note){
            return { id: note, label: note.toUpperCase() };
        });

        /**
         * NoteIterator Class
         * @param note
         * @constructor
         */
        function NoteIterator(note){
            var noteIndex = NOTES.indexOf(note);

            // error if note not found
            if(noteIndex == -1)
                throw Error('Invalid note: ', note);

            this.currentIndex = noteIndex;
        }

        /**
         * Gets the next note in the sequence
         * @returns {string}
         */
        NoteIterator.prototype.next = function(){
            var lastIndex = NOTES.length - 1;
            var nextIndex = (this.currentIndex < lastIndex)? ++this.currentIndex : 0;
            this.currentIndex = nextIndex;
            return NOTES[nextIndex];
        };

        /**
         * Creates a new instance of a NoteIterator
         * @param note
         * @returns {NoteIterator}
         */
        function noteIterator(note){
            return new NoteIterator(note);
        }
        this.noteIterator = noteIterator;

        /**
         * Creates a matrix of notes
         * @param {Array} tuning The guitar tuning, array of open notes
         * @param {Array} range The range of frets, min and max index
         */
        this.noteMatrix = function(tuning, range){
            var defaultRange = [0, 12];
            range = (angular.isArray(range))? range : defaultRange;

            // reverse tuning note order for display (1st - 6th string)
            var tuningNotes = tuning.notes.slice().reverse();

            // get an array of notes for each string starting with the open position
            return tuningNotes.map(function(note){
                return noteRange(note, range);
            });
        };

        /**
         * Creates a range of notes
         * @param note The starting note
         * @param range The range of notes between the min and max
         * @returns {*[]}
         */
        function noteRange(note, range){
            var min = range[0];
            var max = range[1];
            var iterator = noteIterator(note);
            var stringNotes = [ note ];
            for(var x=0; x<max; x++){
                if(x >= min){
                    stringNotes.push(iterator.next());
                }
            }
            return stringNotes;
        }
        this.noteRange = noteRange;

    }]);
};