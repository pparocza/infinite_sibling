import { IS_Effect } from "./IS_Effect.js";

const IS_MixEffectParamNames =
{
    wetMix: "wetMix"
}

export class IS_MixEffect extends IS_Effect
{
    constructor(siblingContext, wetMix = 1)
    {
        super(siblingContext);

        this.dryGain = this.siblingContext.createGain();
        this.wetGain = this.siblingContext.createGain();

        this.setParamValue(IS_MixEffectParamNames.wetMix, wetMix);

        this.wetMix = wetMix;

        this.input.connect(this.dryGain.input);
        this.dryGain.connect(this.output);

        this.wetGain.connect(this.output);
    }

    connectToWetGain(audioNode)
    {
        // TODO: WAAPI Node Wrapper so that you never have to specify "input"
        audioNode.connect(this.wetGain.input);
    }

    get wetMix()
    {
        return this.getParamValue(IS_MixEffectParamNames.wetMix);
    }

    set wetMix(value)
    {
        this.setParamValue(IS_MixEffectParamNames.wetMix, value);

        this.dryGain.gain = 1 - this.wetMix;
        this.wetGain.gain = this.wetMix;
    }
}