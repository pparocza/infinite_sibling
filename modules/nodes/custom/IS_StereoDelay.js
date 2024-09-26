import { IS_MixEffect } from "../core/effect/IS_MixEffect.js";

const IS_StereoDelayParamNames =
{
    delayTimeLeft: "delayTimeLeft",
    delayTimeRight: "delayTimeRight",
    feedbackPercent: "feedbackPercent",
    wetMix: "wetMix",
}

export class IS_StereoDelay extends IS_MixEffect
{
    constructor(siblingContext, delayTimeLeft = 0.5, delayTimeRight = 0.25,
                feedbackPercent = 0.5, wetMix = 0.5, maxDelayTime = 1)
    {
        super(siblingContext);

        this.paramNames = IS_StereoDelayParamNames;

        this.setParamValue(this.paramNames.delayTimeLeft, delayTimeLeft);
        this.setParamValue(this.paramNames.delayTimeRight, delayTimeRight);
        this.setParamValue(this.paramNames.feedbackPercent, feedbackPercent);
        this.setParamValue(this.paramNames.wetMix, wetMix);

        this.delayLeft = this.siblingContext.createDelay(this.delayTimeLeft, this.feedbackPercent, 1, maxDelayTime);
        this.delayRight = this.siblingContext.createDelay(this.delayTimeRight, this.feedbackPercent, 1, maxDelayTime);
        this.panLeft = this.siblingContext.createStereoPanner(-1);
        this.panRight = this.siblingContext.createStereoPanner(1);

        this.input.connect(this.delayLeft.input);
        this.input.connect(this.delayRight.input);

        this.delayLeft.connect(this.panLeft);
        this.delayRight.connect(this.panRight);
        this.panLeft.connect(this.wetGain);
        this.panRight.connect(this.wetGain);
    }

    get delayTimeLeft()
    {
        return this.getParamValue(this.paramNames.delayTimeLeft);
    }

    set delayTimeLeft(value)
    {
        this.setParamValue(this.paramNames.delayTimeLeft, value);
        this.delayLeft.delayTime = this.delayTimeLeft;
    }

    get delayTimeRight()
    {
        return this.getParamValue(this.paramNames.delayTimeRight);
    }

    set delayTimeRight(value)
    {
        this.setParamValue(this.paramNames.delayTimeRight, value);
        this.delayRight.delayTime = this.delayTimeRight;
    }

    get feedbackPercent()
    {
        return this.getParamValue(this.paramNames.feedbackPercent);
    }

    set feedbackPercent(value)
    {
        this.setParamValue(this.paramNames.feedbackPercent, value)
        this.delayRight.feedbackPercent = this.feedbackPercent;
        this.delayLeft.feedbackPercent = this.feedbackPercent;
    }

    get wetMix()
    {
        return this.getParamValue(this.paramNames.wetMix);
    }

    set wetMix(value)
    {
        this.setParamValue(this.paramNames.wetMix, value);
        this.dryGain.gain = 1 - this.wetMix;
        this.wetGain.gain = this.wetMix;
    }
}