import { IS_Effect } from "./IS_Effect.js";
import { IS_AudioParameter } from "../../../types/parameter/audio/IS_AudioParameter.js";

export class IS_MixEffect extends IS_Effect
{
    constructor(siblingContext, iSEffectType = undefined, wetMix = 1)
    {
        super(siblingContext, iSEffectType);

        this._mixEffectInputNode = new GainNode(siblingContext.AudioContext);
        this._mixEffectOutputNode = new GainNode(siblingContext.AudioContext);

        this.dryGainNode = new GainNode(siblingContext.AudioContext);
        this.wetGainNode = new GainNode(siblingContext.AudioContext);

        this._dryGain = new IS_AudioParameter(this._siblingContext, this, this.dryGainNode.gain, 0);
        this._wetGain = new IS_AudioParameter(this._siblingContext, this, this.wetGainNode.gain, 1);

        this._wetMix = wetMix;

        this._mixEffectInputNode.connect(this.dryGainNode);
        this.dryGainNode.connect(this._mixEffectOutputNode);

        this.configureInput(this._mixEffectInputNode);
        this._configureOutput(this._mixEffectOutputNode);
    }

    isISMixEffect = true;

    configureMixIO(input, output)
    {
        this._mixEffectInputNode.connect(input);

        if(output.isISNode)
        {
            output.connect(this._mixEffectOutputNode);
        }
        else
        {
            output.connect(this._mixEffectOutputNode);
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
