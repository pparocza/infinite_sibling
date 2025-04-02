import { IS_MixEffect } from "./IS_MixEffect.js";
import { IS_AudioParameter } from "../../../types/parameter/IS_AudioParameter.js";
import { IS_Type } from "../../../enums/IS_Type.js";

export class IS_Delay extends IS_MixEffect
{
    constructor
    (
        siblingContext,
        delayTime = 1, feedbackPercent = 0.25, wetMix = 0.5, maxDelayTime = 1
    )
    {
        super(siblingContext, IS_Type.IS_EffectType.IS_MixEffect.IS_Delay);

        this._delayNode = siblingContext.AudioContext.createDelay(maxDelayTime);

        this._feedbackGainNode = new GainNode(siblingContext.AudioContext);

        this._delayTime = new IS_AudioParameter(this._siblingContext, this, this._delayNode.delayTime, delayTime);
        this._feedbackPercent = new IS_AudioParameter(this._siblingContext, this, this._feedbackGainNode.gain, feedbackPercent);

        this._delayNode.connect(this._feedbackGainNode);
        this._feedbackGainNode.connect(this._delayNode);

        this.configureMixIO(this._delayNode, this._delayNode);
    }

    isISDelay = true;

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
