import { IS_MixEffect } from "./IS_MixEffect.js";

const IS_DelayParamNames =
{
    delayTime: "delayTime",
    feedbackPercent: "feedbackPercent",
}

export class IS_Delay extends IS_MixEffect
{
    constructor(siblingContext, delayTime = 1, feedbackPercent = 0.25,
                wetMix = 0.5, maxDelayTime = 1)
    {
        super(siblingContext, wetMix);

        this.paramNames = IS_DelayParamNames;

        this.setParamValue(this.paramNames.delayTime, delayTime);
        this.setParamValue(this.paramNames.feedbackPercent, feedbackPercent);

        this.delayNode = this.siblingContext.audioContext.createDelay(maxDelayTime);
        this.feedbackGain = new GainNode(this.siblingContext.audioContext);

        this.delayNode.delayTime.value = this.delayTime;
        this.feedbackGain.gain.value = this.feedbackPercent;

        this.node.connect(this.delayNode);
        this.delayNode.connect(this.feedbackGain);
        this.feedbackGain.connect(this.delayNode);

        this.delayNode.connect(this.wetGain);
    }

    get delayTime()
    {
        return this.getParamValue(this.paramNames.delayTime);
    }

    set delayTime(value)
    {
        this.setParamValue(this.paramNames.delayTime, value);
        this.delayNode.delayTime.value = this.delayTime;
    }

    get feedbackPercent()
    {
        return this.getParamValue(this.paramNames.feedbackPercent);
    }

    set feedbackPercent(value)
    {
        this.setParamValue(this.paramNames.feedbackPercent, value);
        this.feedbackGain.gain.value = this.feedbackPercent;
    }
}