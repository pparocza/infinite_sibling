import { IS_MixEffect } from "./IS_MixEffect.js";
import { IS_Type } from "../../../enums/IS_Type.js";

const IS_ConvolverParamNames =
{
    buffer: "buffer",
    normalize: "normalize",
    // TODO: Implement wetMix (IS_MixEffect superclass?)
    wetMix: "wetMix"
}

export class IS_Convolver extends IS_MixEffect
{
    constructor(siblingContext, buffer = null, normalize = true)
    {
        super(siblingContext);

        this.node = new ConvolverNode(this.siblingContext.audioContext);

        this.paramNames = IS_ConvolverParamNames;

        this.setParam(this.paramNames.normalize, normalize);

        if(buffer !== null)
        {
            this.setParam(this.paramNames.buffer, buffer);
        }
        else
        {
            this.stereoNoiseReverb();
        }

        this.connectInputTo(this.node);
        this.connectToWetGain(this.node);
    }

    get buffer()
    {
        this.getParamValue(this.paramNames.buffer);
    }

    set buffer(buffer)
    {
        if(buffer.iSType !== undefined && buffer.iSType === IS_Type.IS_Buffer)
        {
            this.setParam(this.paramNames.buffer, buffer.buffer);
        }
        else
        {
            this.setParam(this.paramNames.buffer, buffer);
        }
    }

    get normalize()
    {
        this.getParamValue(this.paramNames.normalize);
    }

    set normalize(value)
    {
        this.setParam(this.paramNames.normalize, value);
    }

    stereoNoiseReverb(length = 3)
    {
        let buffer = this.siblingContext.createBuffer(2, length, this.siblingContext.sampleRate);

        buffer.noise().fill(0);
        buffer.noise().fill(1);
        buffer.inverseSawtooth(2).multiply(0);
        buffer.inverseSawtooth(2).multiply(1);

        this.buffer = buffer;
    }
}