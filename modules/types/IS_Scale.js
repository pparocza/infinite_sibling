import { IS_Array } from "./IS_Array.js";

export class IS_Scale extends IS_Array
{
    constructor(tonic = "C", mode = "major")
    {
        super();
        this.tonic = tonic;
        this.mode = mode.toLowerCase();
    }

    get tonicIndex()
    {
        return this.tonics[this.tonic];
    }

    get modeArray()
    {
        return this.modes[this.mode];
    }

    generateScale()
    {
        let tonic = this.tonicIndex;
        let mode = this.modeArray;

        for(let i = 0; i < mode; i++)
        {
            this.value[i] = mode[i] + tonic;
        }
    }

    transpose(tonic)
    {
        this.tonic = tonic;
        this.generateScale(this.tonic, this.mode);
    }

    tune(mode)
    {
        this.mode = mode.toLowerCase();
        this.generateScale(this.tonic, this.mode);
    }

    tonics =
    {
        "C": 0,
        "C#": 1, "Db": 1,
        "D": 2,
        "D#": 3, "Eb": 3,
        "E": 4,
        "F": 5,
        "F#": 6, "Gb": 6,
        "G": 7,
        "G#": 8, "Ab": 8,
        "A": 9,
        "A#": 10, "Bb": 10,
        "B": 11
    }

    modes =
    {
        major: [0, 2, 4, 5, 7, 9, 11, 12],
        minor: [0, 2, 3, 5, 7, 8, 10, 12],
        dorian: [0, 2, 3, 5, 7, 9, 10, 12],
        phrygian: [0, 1, 3, 5, 7, 8, 10, 12],
        lydian: [0, 2, 4, 6, 7, 9, 11, 12],
        mixolydian: [0, 2, 4, 5, 7, 9, 10, 12]
    }
}