import { IS_Node } from "../IS_Node.js";

const IS_BiquadFilterParamNames =
{
    type: "type",
    frequency: "frequency",
    Q: "Q",
    gain: "gain",
    detune: "detune"
}

export class IS_BiquadFilter extends IS_Node
{
    constructor(siblingContext, type = "lowpass", frequency = 220, Q = 1, gain = 1, detune = 0)
    {
        super(siblingContext);

        this.node = this.siblingContext.audioContext.createBiquadFilter();

        this.paramNames = IS_BiquadFilterParamNames;

        this.setParam(this.paramNames.type, type);
        this.setParam(this.paramNames.frequency, frequency);
        this.setParam(this.paramNames.Q, Q);
        this.setParam(this.paramNames.gain, gain);
        this.setParam(this.paramNames.detune, detune);
    }

    get type()
    {
        return this.getParamValue(this.paramNames.type);

    }

    set type(value)
    {
        this.setParam(this.paramNames.type, value)
    }

    get frequency()
    {
        return this.getParamValue(this.paramNames.frequency);
    }

    set frequency(value)
    {
        this.setParam(this.paramNames.frequency, value);
    }

    get Q()
    {
        return this.getParamValue(this.paramNames.Q);
    }

    set Q(value)
    {
        this.setParam(this.paramNames.Q, value);
    }

    get gain()
    {
        return this.getParamValue(this.paramNames.gain);
    }

    set gain(value)
    {
        this.setParam(this.paramNames.gain, value);
    }

    get detune()
    {
        return this.getParamValue(this.paramNames.detune);
    }

    set detune(value)
    {
        this.setParam(this.paramNames.detune, value);
    }
}
