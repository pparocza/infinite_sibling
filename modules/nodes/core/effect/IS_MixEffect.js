import { IS_Effect } from "./IS_Effect.js";
import { IS_AudioParameter } from "../../../types/parameter/IS_AudioParameter.js";

export class IS_MixEffect extends IS_Effect
{
    constructor(siblingContext, wetMix = 1)
    {
        super(siblingContext);

        this._mixEffectInputNode = new GainNode(siblingContext.audioContext);
        this._mixEffectOutputNode = new GainNode(siblingContext.audioContext);

        this.dryGainNode = new GainNode(siblingContext.audioContext);
        this.wetGainNode = new GainNode(siblingContext.audioContext);

        this._dryGain = new IS_AudioParameter(this.dryGainNode.gain, 0);
        this._wetGain = new IS_AudioParameter(this.wetGainNode.gain, 1);

        this._wetMix = wetMix;

        this._mixEffectInputNode.connect(this.dryGainNode);
        this.dryGainNode.connect(this._mixEffectOutputNode);

        this.configureIO(this._mixEffectInputNode, this._mixEffectOutputNode);
    }

    configureWetIO(input, output)
    {
        this._mixEffectInputNode.connect(input);
        output.connect(this._mixEffectOutputNode);
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