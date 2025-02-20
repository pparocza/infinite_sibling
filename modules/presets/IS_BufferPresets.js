import { IS_Object } from "../types/IS_Object.js";
import { IS_Type } from "../enums/IS_Type.js";

export class IS_BufferPresets extends IS_Object
{
    constructor(IS_Buffer)
    {
        super(IS_Type.IS_Data.IS_Presets.IS_BufferPresets);

        this.buffer = IS_Buffer;
        this.siblingContext = this.buffer.siblingContext;
    }

    sineWave(frequency = 1)
    {
        this.buffer.sine(1).fill();
    }
}