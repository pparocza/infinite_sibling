import { IS_Object } from "../types/IS_Object.js";
import { IS_Type } from "../enums/IS_Type.js";

export class IS_ConvolverPresets extends IS_Object
{
    constructor(IS_Convolver)
    {
        super(IS_Type.IS_Data.IS_Presets.IS_ConvolverPresets);

        this.convolver = IS_Convolver;
        this.siblingContext = this.convolver.siblingContext;
    }

    stereoNoiseReverb(length = 3)
    {
        let buffer = this.siblingContext.createBuffer(2, length, this.siblingContext.sampleRate);

        buffer.noise().add(0);
        buffer.noise().add(1);
        buffer.inverseSawtooth(2).multiply(0);
        buffer.inverseSawtooth(2).multiply(1);

        this.convolver.buffer = buffer;
    }
}