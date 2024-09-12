import { IS_Array } from "./IS_Array.js";
import { IS_KeyboardNotes } from "./IS_KeyboardNotes.js";
import { IS_Modes } from "./IS_Modes.js";

export class IS_Scale extends IS_Array
{
    constructor(tonic = IS_KeyboardNotes.C, mode = IS_Modes.major)
    {
        super();
        this.tonic = tonic;
        this.mode = mode.toLowerCase();

        this.generateScale(this.tonic, this.mode);
    }

    get tonicIndex()
    {
        return IS_KeyboardNotes[this.tonic];
    }

    get modeArray()
    {
        return IS_Modes[this.mode];
    }

    generateScale()
    {
        let tonic = this.tonicIndex;
        let mode = this.modeArray;

        for(let i = 0; i < mode.length; i++)
        {
            this.value[i] = mode[i] + tonic;
        }
    }

    printNotes()
    {
        let noteKeys = Object.keys(IS_KeyboardNotes);

        for(let i = 0 ; i < this.value.length; i++)
        {
            console.log(noteKeys[this.value[i]]);
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
}