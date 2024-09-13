import { IS_StartableNode } from "./IS_StartableNode.js";

const IS_OscillatorParamNames =
{
    type: "type",
    frequency: "frequency",
    detune: "detune"
}

export class IS_Oscillator extends IS_StartableNode
{
    constructor(siblingContext, type = "sine", frequency = 440, detune = 0)
    {
        super(siblingContext);

        this.node = this.siblingContext.audioContext.createOscillator();

        this.paramNames = IS_OscillatorParamNames;

        // TODO: eventually use setParamValue so values persist when node is destroyed in order to be re-started
        this.setParam(this.paramNames.type, type);
        this.setParam(this.paramNames.frequency, frequency);
        this.setParam(this.paramNames.detune, detune);
    }

    set type(value)
    {
        this.setParam(this.paramNames.type, value);
    }

    get type()
    {
        return this.getParamValue(this.paramNames.type);

    }

    set frequency(value)
    {
        this.setParam(this.paramNames.frequency, value);
    }

    get frequency()
    {
        this.getParamValue(this.paramNames.frequency);
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
