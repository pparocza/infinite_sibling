import { IS_Node } from "../IS_Node.js";

const IS_MixEffectParamNames =
{
    wetMix: "wetMix"
}

export class IS_MixEffect extends IS_Node
{
    constructor(siblingContext, wetMix = 1)
    {
        super(siblingContext);

        this.node = new GainNode(this.siblingContext.audioContext);

        this.dryGain = this.siblingContext.createGain();
        this.wetGain = this.siblingContext.createGain();

        this.setParamValue(IS_MixEffectParamNames.wetMix, wetMix);

        this.node.connect(this.output);
        this.dryGain.connect(this.output);
        this.wetGain.connect(this.output);
    }

    get wetMix()
    {
        return this.getParamValue(IS_MixEffectParamNames.wetMix);
    }

    set wetMix(value)
    {
        this.dryGain.gain.value = 1 - this.wetMix;
        this.wetGain.gain.value = this.wetMix;

        this.setParamValue(IS_MixEffectParamNames.wetMix, value);
    }

}