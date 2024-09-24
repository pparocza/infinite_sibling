import { IS_StartableNode } from "../IS_StartableNode.js";
import { IS_Parameter } from "../../../types/IS_Parameter.js";

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

        this.initializeCallback = this.initialize;
        this.initialize();
    }

    initialize()
    {
        this.node = this.siblingContext.audioContext.createOscillator();

        this.setParam(this.paramNames.type, this.type);
        this.setParam(this.paramNames.frequency, this.frequency);
        this.setParam(this.paramNames.detune, this.detune);

        /*
            // TODO: Parameter abstraction and initialization method
            this.inlet[this.paramNames.frequency] = new IS_Parameter(this.siblingContext, this.frequency);
            this.inlet[this.paramNames.detune] = new IS_Parameter(this.siblingContext, this.detune);
        */

        this.node.connect(this.output);

        this.isInitialized = true;
    }

    get type()
    {
        return this.getParamValue(this.paramNames.type);
    }

    set type(value)
    {
        this.setParam(this.paramNames.type, value);
    }

    get frequency()
    {
        return this.getParamValue(this.paramNames.frequency);
    }

    set frequency(value)
    {
        this.setParam(this.paramNames.frequency, value);
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
