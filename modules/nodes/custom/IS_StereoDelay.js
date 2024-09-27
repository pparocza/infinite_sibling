import { IS_MixEffect } from "../core/effect/IS_MixEffect.js";

const IS_StereoDelayParamNames =
{
    delayTimeLeft: "delayTimeLeft",
    delayTimeRight: "delayTimeRight",
    feedbackPercent: "feedbackPercent",
}

export class IS_StereoDelay extends IS_MixEffect
{
    constructor(siblingContext, delayTimeLeft = 0.5, delayTimeRight = 0.25,
                feedbackPercent = 0.5, wetMix = 0.5, maxDelayTime = 1)
    {
        super(siblingContext, wetMix);

        this.paramNames = IS_StereoDelayParamNames;

        this.setParamValue(this.paramNames.delayTimeLeft, delayTimeLeft);
        this.setParamValue(this.paramNames.delayTimeRight, delayTimeRight);
        this.setParamValue(this.paramNames.feedbackPercent, feedbackPercent);

        this.delayLeft = this.siblingContext.createDelay(this.delayTimeLeft, this.feedbackPercent, 1, maxDelayTime);
        this.delayRight = this.siblingContext.createDelay(this.delayTimeRight, this.feedbackPercent, 1, maxDelayTime);
        this.panLeft = this.siblingContext.createStereoPanner(-1);
        this.panRight = this.siblingContext.createStereoPanner(1);

        this.connectInputTo(this.delayLeft.input);
        this.connectInputTo(this.delayRight.input);

        this.delayLeft.connect(this.panLeft);
        this.delayRight.connect(this.panRight);

        this.connectToWetGain(this.panLeft);
        this.connectToWetGain(this.panRight);
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
}