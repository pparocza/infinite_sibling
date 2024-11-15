import { IS_Array } from "./IS_Array.js";
import { IS_KeyboardNote } from "../../enums/IS_KeyboardNote.js";
import { IS_Mode } from "../../enums/IS_Mode.js";

export class IS_Scale extends IS_Array
{
    // TODO: tonic and mode should be able to be strings OR "enums"
    constructor(tonic = IS_KeyboardNote.C, mode = IS_Mode.major)
    {
        super();
        this.tonic = tonic;
        this.mode = mode.toLowerCase();

        this.generateScale(this.tonic, this.mode);
    }

    get tonicIndex()
    {
        return IS_KeyboardNote[this.tonic];
    }

    get modeArray()
    {
        return IS_Mode[this.mode];
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
        let noteKeys = Object.keys(IS_KeyboardNote);

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
