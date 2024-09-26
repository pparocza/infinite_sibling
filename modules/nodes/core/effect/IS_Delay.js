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

        this.node = this.siblingContext.audioContext.createDelay(maxDelayTime);

        this.paramNames = IS_DelayParamNames;

        this.setParam(this.paramNames.delayTime, delayTime);
        this.setParamValue(this.paramNames.feedbackPercent, feedbackPercent);

        this.feedbackGain = this.siblingContext.createGain();

        this.node.delayTime.value = this.delayTime;
        this.feedbackGain.gain = this.feedbackPercent;

        this.input.connect(this.node);
        this.node.connect(this.feedbackGain.input);
        this.feedbackGain.connect(this.node);

        // TODO: WAAPI Node Wrapper so that you never have to do this
        this.node.connect(this.wetGain.input);
    }

    get delayTime()
    {
        return this.getParamValue(this.paramNames.delayTime);
    }

    set delayTime(value)
    {
        this.setParamValue(this.paramNames.delayTime, value);
    }

    get feedbackPercent()
    {
        return this.getParamValue(this.paramNames.feedbackPercent);
    }

    set feedbackPercent(value)
    {
        this.setParamValue(this.paramNames.feedbackPercent, value);
        this.feedbackGain.gain = this.feedbackPercent;
    }
}