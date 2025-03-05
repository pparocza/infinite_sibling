import { IS_Effect } from "./IS_Effect.js";
import { IS_AudioParameter } from "../../../types/parameter/IS_AudioParameter.js";
import { IS_Type } from "../../../enums/IS_Type.js";

export class IS_MixEffect extends IS_Effect
{
    constructor(siblingContext, iSEffectType = undefined, wetMix = 1)
    {
        super(siblingContext, iSEffectType);

        this._mixEffectInputNode = this._siblingContext.createGain();
        this._mixEffectOutputNode = this._siblingContext.createGain();

        this.dryGainNode = this._siblingContext.createGain();
        this.wetGainNode = this._siblingContext.createGain();

        this._dryGain = new IS_AudioParameter(this._siblingContext, this.dryGainNode.gain, 0);
        this._wetGain = new IS_AudioParameter(this._siblingContext, this.wetGainNode.gain, 1);

        this._wetMix = wetMix;

        this._mixEffectInputNode.connect(this.dryGainNode);
        this.dryGainNode.connect(this._mixEffectOutputNode);

        this.configureInput(this._mixEffectInputNode);
        this.configureOutput(this._mixEffectOutputNode);
    }

    isMixEffect = true;

    configureMixIO(input, output)
    {
        this._mixEffectInputNode.connect(input);

        if(output.iSType !== undefined)
        {
            output.connect(this._mixEffectOutputNode);
        }
        else
        {
            output.connect(this._mixEffectOutputNode.input);
        }
    }

    get dryGain()
    {
        return this._dryGain;
    }

    set dryGain(value)
    {
        this._dryGain.value = value;
    }

    get wetGain()
    {
        return this._wetGain;
    }

    set wetGain(value)
    {
        this._wetGain.value = value;
    }

    get wetMix()
    {
        return this._wetMix;
    }

    set wetMix(value)
    {
        this._wetMix = value;

        this.dryGain = 1 - this._wetMix;
        this.wetGain = this._wetMix;
    }
}
