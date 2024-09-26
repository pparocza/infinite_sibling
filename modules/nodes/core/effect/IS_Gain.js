import { IS_Effect } from "./IS_Effect";

const IS_GainParamNames =
{
    gain: "gain",
}

export class IS_Gain extends IS_Effect
{
    constructor(siblingContext, gainValue = 1)
    {
        super(siblingContext);

        this.node = new GainNode(this.siblingContext.audioContext);

        this.paramNames = IS_GainParamNames;

        this.setParam(this.paramNames.gain, gainValue);

        this.input.connect(this.node);
        this.node.connect(this.output);
    }

    get gain()
    {
        return this.getParamValue(this.paramNames.gain);
    }

    set gain(value)
    {
        this.setParam(this.paramNames.gain, value);
    }
}
