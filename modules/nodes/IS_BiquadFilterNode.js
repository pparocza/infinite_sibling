import { IS_Node } from "./IS_Node.js";

const IS_BiquadFilterParamNames =
{
    type: "type",
    frequency: "frequency",
    Q: "Q",
    gain: "gain",
    detune: "detune"
}

export class IS_BiquadFilterNode extends IS_Node
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

    set type(value)
    {
        this.params.type = value;
        this.node.type = this.params.type;
    }

    get type()
    {
        return this.node.type;

    }

    set frequency(value)
    {
        this.setParam(this.paramNames.frequency, value);
    }

    get frequency()
    {
        this.getParamValue(this.paramNames.frequency);
    }

    set Q(value)
    {
        this.setParam(this.paramNames.Q, value);
    }

    get Q()
    {
        this.getParamValue(this.paramNames.Q);
    }

    set gain(value)
    {
        this.setParam(this.paramNames.gain, value);
    }

    get gain()
    {
        this.getParamValue(this.paramNames.gain);
    }

    set detune(value)
    {
        this.setParam(this.paramNames.detune, value);
    }

    get detune()
    {
        this.getParamValue(this.paramNames.detune);
    }
}
