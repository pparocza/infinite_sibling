import { IS_StartableNode } from "./IS_StartableNode.js";
import { IS_Parameter } from "../types/IS_Parameter.js";

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

        this.paramNames = IS_OscillatorParamNames;

        this.setParamValue(this.paramNames.type, type);
        this.setParamValue(this.paramNames.frequency, frequency);
        this.setParamValue(this.paramNames.detune, detune);

        // TODO: Parameter abstraction and initialization method
        this.inlet[this.paramNames.frequency] = new IS_Parameter(siblingContext, frequency);
        this.inlet[this.paramNames.detune] = new IS_Parameter(siblingContext, detune);
    }

    initialize()
    {
        this.node = this.siblingContext.audioContext.createOscillator();

        this.setParam(this.paramNames.type, this.params[this.paramNames.type]);
        this.setParam(this.paramNames.frequency, this.params[this.paramNames.frequency]);
        this.setParam(this.paramNames.detune, this.params[this.paramNames.detune]);

        this.node.connect(this.output);
    }

    start()
    {
        this.initialize();

        this.node.start();
    }

    stop()
    {
        this.node.stop();
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
