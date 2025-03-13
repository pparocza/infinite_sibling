import { IS_Effect } from "./IS_Effect.js";
import { IS_AudioParameter } from "../../../types/parameter/IS_AudioParameter.js";
import { IS_Type } from "../../../enums/IS_Type.js";

export class IS_Gain extends IS_Effect
{
    constructor(siblingContext, gainValue = 1)
    {
        super(siblingContext, IS_Type.IS_EffectType.IS_Gain);

        this._gainNode = new GainNode(siblingContext.audioContext);

        this._gain = new IS_AudioParameter(this._siblingContext, this._gainNode.gain, gainValue);

        this.configureInput(this._gainNode);
        this.configureOutput(this._gainNode);
    }

    isISGain = true;

    get gain()
    {
        return this._gain;
    }

    set gain(value)
    {
        this._gain.value = value;
    }
}
