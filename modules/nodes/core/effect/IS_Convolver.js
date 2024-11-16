import { IS_MixEffect } from "./IS_MixEffect.js";
import { IS_Type } from "../../../enums/IS_Type.js";
import { IS_ConvolverPresets } from "../../../presets/IS_ConvolverPresets.js";

export class IS_Convolver extends IS_MixEffect
{
    constructor(siblingContext, buffer = null, normalize = true)
    {
        super(siblingContext);

        this._convolver = new ConvolverNode(siblingContext.audioContext);

        this.preset = new IS_ConvolverPresets(this);

        this.initializeBuffer(buffer);

        this._normalize = normalize;
        this.normalize = this._normalize;

        this.configureWetIO(this._convolver, this._convolver);
    }

    initializeBuffer(buffer)
    {
        if (buffer === null)
        {
            this.preset.stereoNoiseReverb();
            return;
        }

        this.buffer = buffer;
    }

    get buffer()
    {
        return this._buffer;
    }

    set buffer(buffer)
    {
        if(buffer.iSType !== undefined && buffer.iSType === IS_Type.IS_Buffer)
        {
            this._buffer = buffer.buffer;
        }
        else
        {
            this._buffer = buffer;
        }

        this._convolver.buffer = this._buffer;
    }

    get normalize()
    {
        return this._normalize;
    }

    set normalize(value)
    {
        this._normalize = value;
        this._convolver.normalize = this._normalize;
    }
}