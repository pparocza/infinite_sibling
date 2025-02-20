import { IS_Array } from "./IS_Array.js";
import { IS_KeyboardNote } from "../../enums/IS_KeyboardNote.js";
import { IS_Mode } from "../../enums/IS_Mode.js";
import { IS_Type } from "../../enums/IS_Type.js";

export class IS_Scale extends IS_Array
{
    // TODO: tonic and mode should be able to be strings OR "enums"
    constructor(tonic = IS_KeyboardNote.C, mode = IS_Mode.Major)
    {
        super([], IS_Type.IS_Data.IS_Scale);

        this.tonic = tonic;
        this.mode = mode;

        this.generateScale();
    }

    generateScale()
    {
        for(let i = 0; i < this.mode.length; i++)
        {
            this.value.push(this.mode[i] + this.tonic);
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
