import { IS_Effect } from "./IS_Effect.js";
import { IS_AudioParameter } from "../../../types/parameter/IS_AudioParameter.js";

export class IS_Gain extends IS_Effect
{
    constructor(siblingContext, gainValue = 1)
    {
        super(siblingContext, new GainNode(siblingContext.audioContext));

        this._gain = new IS_AudioParameter(this.node.gain, gainValue);
    }

    get gain()
    {
        return this._gain;
    }

    set gain(value)
    {
        this._gain.value = value;
    }
}
