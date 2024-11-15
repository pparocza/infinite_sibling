import { IS_Effect } from "./IS_Effect.js";

export class IS_MixEffect extends IS_Effect
{
    constructor(siblingContext, audioNode, wetMix = 1)
    {
        super(siblingContext, audioNode);

        this.dryGain = this.siblingContext.createGain();
        this.wetGain = this.siblingContext.createGain();

        this._wetMix = wetMix;
        this.wetMix = this._wetMix;

        this.connectInputTo(this.dryGain.input);
        this.connectToOutput(this.dryGain);

        this.wetGain.connect(this.node);
        this.connectToOutput(this.wetGain);
    }

    get wetMix()
    {
        return this._wetMix;
    }

    set wetMix(value)
    {
        this._wetMix = value;

        this.dryGain.gain = 1 - this._wetMix;
        this.wetGain.gain = this._wetMix;
    }
}