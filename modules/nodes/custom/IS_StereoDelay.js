import { IS_MixEffect } from "../core/effect/IS_MixEffect.js";
import { IS_Type } from "../../enums/IS_Type.js";

export class IS_StereoDelay extends IS_MixEffect
{
    constructor(siblingContext, delayTimeLeft = 0.5, delayTimeRight = 0.25,
                feedbackPercent = 0.5, wetMix = 0.5, maxDelayTime = 1)
    {
        super(siblingContext, IS_Type.IS_EffectType.IS_MixEffect.IS_StereoDelay, wetMix);

        this._inputNode = this.siblingContext.createGain();
        this._outputNode = this.siblingContext.createGain();

        this._delayLeft = this.siblingContext.createDelay(delayTimeLeft, feedbackPercent, wetMix, maxDelayTime);
        this._delayRight = this.siblingContext.createDelay(delayTimeRight, feedbackPercent, wetMix, maxDelayTime);
        this._panLeft = this.siblingContext.createStereoPanner(-1);
        this._panRight = this.siblingContext.createStereoPanner(1);

        this._panLeft.pan = -1;
        this._panRight.pan = 1;

        this._delayTimeLeft = this._delayLeft.delayTime;
        this._delayTimeRight = this._delayRight.delayTime;
        this._feedbackPercent = feedbackPercent;

        this._delayLeft.connect(this._panLeft);
        this._delayRight.connect(this._panRight);

        this._inputNode.connect(this._delayLeft);
        this._inputNode.connect(this._delayRight);

        this._panLeft.connect(this._outputNode);
        this._panRight.connect(this._outputNode);

        this.configureMixIO(this._inputNode, this._outputNode);
    }

    get delayTimeLeft()
    {
        return this._delayTimeLeft;
    }

    set delayTimeLeft(value)
    {
        this._delayTimeLeft = value;
    }

    get delayTimeRight()
    {
        return this._delayTimeRight;
    }

    set delayTimeRight(value)
    {
        this._delayTimeRight = value;
    }

    get feedbackPercent()
    {
        return this._feedbackPercent;
    }

    set feedbackPercent(value)
    {
        this._feedbackPercent = value;

        this._delayRight.feedbackPercent = this._feedbackPercent;
        this._delayLeft.feedbackPercent = this._feedbackPercent;
    }
}