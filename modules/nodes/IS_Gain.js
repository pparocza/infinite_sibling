import { IS_Node } from "./IS_Node.js";

const IS_GainParamNames =
{
    gain: "gain",
}

export class IS_Gain extends IS_Node
{
    constructor(siblingContext, gainValue = 1)
    {
        super(siblingContext);

        this.node = siblingContext.audioContext.createGain();
        this.paramNames = IS_GainParamNames;
    }

    set gain(value)
    {
        this.setParam(this.paramNames.gain, value);
    }

    get gain()
    {
        this.getParamValue(this.paramNames.gain);
    }
}
