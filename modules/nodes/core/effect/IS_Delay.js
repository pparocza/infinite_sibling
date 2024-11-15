import { IS_MixEffect } from "./IS_MixEffect.js";
import { IS_AudioParameter } from "../../../types/parameter/IS_AudioParameter.js";

export class IS_Delay extends IS_MixEffect
{
    constructor
    (
        siblingContext,
        delayTime = 1, feedbackPercent = 0.25, wetMix = 0.5, maxDelayTime = 1
    )
    {
        super(siblingContext, siblingContext.audioContext.createDelay(maxDelayTime));

        this.feedbackGain = new GainNode(siblingContext.audioContext);

        this._delayTime = new IS_AudioParameter(this.node.delayTime, delayTime);
        this._feedbackPercent = new IS_AudioParameter(this.feedbackGain.gain, feedbackPercent);

        this.node.connect(this.feedbackGain);
        this.feedbackGain.connect(this.node);
    }

    get delayTime()
    {
        return this._delayTime;
    }

    set delayTime(value)
    {
        this._delayTime.value = value;
    }

    get feedbackPercent()
    {
        return this._feedbackPercent;
    }

    set feedbackPercent(value)
    {
        this._feedbackPercent.value = value;
    }
}