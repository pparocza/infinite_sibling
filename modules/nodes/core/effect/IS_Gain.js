import { IS_Node } from "../IS_Node.js";

const IS_GainParamNames =
{
    gain: "gain",
}

export class IS_Gain extends IS_Node
{
    constructor(siblingContext, gainValue = 1)
    {
        super(siblingContext);

        this.node = new GainNode(this.siblingContext.audioContext);
        this.node.connect(this.output);

        this.paramNames = IS_GainParamNames;

        this.setParam(this.paramNames.gain, gainValue);
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
