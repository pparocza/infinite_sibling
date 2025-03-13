import { IS_Object } from "../types/IS_Object.js";
import { IS_Type } from "../enums/IS_Type.js";

export class IS_ConvolverPresets extends IS_Object
{
    constructor(IS_Convolver)
    {
        super(IS_Type.IS_Data.IS_Presets.IS_ConvolverPresets);

        this.convolver = IS_Convolver;
    }

    stereoNoiseReverb(length = 3)
    {
        let buffer = this._siblingContext.createBuffer(1, length);

        buffer.noise().add();
        buffer.inverseSawtooth(2).multiply();

        this.convolver.buffer = buffer;
    }
}