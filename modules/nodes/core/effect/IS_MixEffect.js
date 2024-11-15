import { IS_Effect } from "./IS_Effect.js";
import { IS_AudioParameter } from "../../../types/parameter/IS_AudioParameter.js";

export class IS_MixEffect extends IS_Effect
{
    constructor(siblingContext, audioNode, wetMix = 1)
    {
        super(siblingContext, audioNode, false);

        this.dryGainNode = new GainNode(siblingContext.audioContext);
        this.wetGainNode = new GainNode(siblingContext.audioContext);

        this._dryGain = new IS_AudioParameter(this.dryGainNode.gain, 0);
        this._wetGain = new IS_AudioParameter(this.wetGainNode.gain, 1);

        this._wetMix = wetMix;

        this.connectInputTo(this.dryGainNode);
        this.connectToOutput(this.dryGainNode);

        this.connectInputTo(this.node);
        this.node.connect(this.wetGainNode);
        this.connectToOutput(this.wetGainNode);
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