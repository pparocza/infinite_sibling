import { IS_MixEffect } from "./IS_MixEffect.js";
import { IS_Type } from "../../../enums/IS_Type.js";
import { IS_ConvolverPresets } from "../../../presets/IS_ConvolverPresets.js";

export class IS_Convolver extends IS_MixEffect
{
    constructor(siblingContext, buffer = null, normalize = true)
    {
        super(siblingContext, IS_Type.IS_EffectType.IS_MixEffect.IS_Convolver);

        this._convolver = new ConvolverNode(siblingContext.AudioContext);

        this.buffer = buffer;

        this._normalize = normalize;
        this.normalize = this._normalize;

        this.configureMixIO(this._convolver, this._convolver);
    }

    isISConvolver = true;

    get buffer()
    {
        return this._buffer;
    }

    set buffer(buffer)
    {
        if(buffer.isISBuffer)
        {
            this._buffer = buffer.requestBuffer(this);
        }
        else
        {
            this._buffer = buffer;
        }

        if(this._buffer)
        {
            this._convolver.buffer = this._buffer;
            this._ready();
        }
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

    get preset()
    {
        return this._preset;
    }
}
