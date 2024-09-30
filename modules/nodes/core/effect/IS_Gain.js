import { IS_Effect } from "./IS_Effect.js";

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

        this.connectInputTo(this.node);
        this.connectToOutput(this.node);
    }

    get gainInput()
    {
        // TODO: input/parameter management - Inlet class?
        return this.node.gain;
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
