import { IS_Node } from "../IS_Node.js";

const IS_DelayParamNames =
{
    delayTime: "delayTime",
    feedbackPercent: "feedbackPercent",
    wetMix: "wetMix",
}

export class IS_Delay extends IS_Node
{
    constructor(siblingContext, delayTime = 1, feedbackPercent = 0.25,
                wetMix = 0.5, maxDelayTime = 1)
    {
        super(siblingContext);

        this.paramNames = IS_DelayParamNames;

        this.setParamValue(this.paramNames.delayTime, delayTime);
        this.setParamValue(this.paramNames.feedbackPercent, feedbackPercent);
        this.setParamValue(this.paramNames.wetMix, wetMix);

        this.node = new GainNode(this.siblingContext.audioContext);
        this.delayNode = this.siblingContext.audioContext.createDelay(maxDelayTime);
        this.dryGain = new GainNode(this.siblingContext.audioContext);
        this.wetGain = new GainNode(this.siblingContext.audioContext);
        this.feedbackGain = new GainNode(this.siblingContext.audioContext);

        this.delayNode.delayTime.value = this.delayTime;

        this.dryGain.gain.value = 1 - this.wetMix;
        this.wetGain.gain.value = this.wetMix;
        this.feedbackGain.gain.value = this.feedbackPercent;

        this.node.connect(this.dryGain);
        this.dryGain.connect(this.output);

        this.node.connect(this.delayNode);
        this.delayNode.connect(this.wetGain);
        this.delayNode.connect(this.feedbackGain);
        this.feedbackGain.connect(this.delayNode);
        this.wetGain.connect(this.output);
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

    get wetMix()
    {
        return this.getParamValue(this.paramNames.wetMix);
    }

    set wetMix(value)
    {
        this.setParamValue(this.paramNames.wetMix, value);
        this.wetGain.gain.value = this.wetMix;
        this.dryGain.gain.value = 1 - this.wetMix;
    }
}