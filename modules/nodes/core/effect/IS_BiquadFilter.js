import { IS_Effect } from "./IS_Effect.js";
import { IS_AudioParameter } from "../../../types/parameter/IS_AudioParameter.js";

export class IS_BiquadFilterArgs
{
    constructor(filterArgs)
    {
        this._type = filterArgs[0];
        this._frequency = filterArgs[1];
        this._Q = filterArgs[2];
        this._gain = filterArgs[3];
        this._detune = filterArgs[4];
    }

    get type() { return this._type; }
    get frequency() { return this._frequency; }
    get Q() { return this._Q; }
    get gain() { return this._gain; }
    get detune() { return this._detune; }
}

export class IS_BiquadFilter extends IS_Effect
{
    constructor(siblingContext, ...filterArgs)
    {
        super(siblingContext)

        this._filterNode = new BiquadFilterNode(siblingContext.audioContext);

        this._parameterValues = new IS_BiquadFilterArgs(filterArgs);

        this._type = this._parameterValues.type;
        this._frequency = new IS_AudioParameter(this.siblingContext, this._filterNode.frequency, this._parameterValues.frequency);
        this._Q = new IS_AudioParameter(this.siblingContext, this._filterNode.Q, this._parameterValues.Q);
        this._gain = new IS_AudioParameter(this.siblingContext, this._filterNode.gain, this._parameterValues.gain);
        this._detune = new IS_AudioParameter(this.siblingContext, this._filterNode.detune, this._parameterValues.detune);

        this._filterNode.type = this._type;

        this.configureInput(this._filterNode);
        this.configureOutput(this._filterNode);
    }

    get type()
    {
        return this._type;
    }

    set type(value)
    {
        this._type = value;
        this._filterNode.type = this._type;
    }

    get frequency()
    {
        return this._frequency;
    }

    set frequency(value)
    {
        this._frequency.value = value;
    }

    get Q()
    {
        return this._Q;
    }

    set Q(value)
    {
        this._Q.value = value;
    }

    get gain()
    {
        return this._gain.value;
    }

    set gain(value)
    {
        this._gain.value = value;
    }

    get detune()
    {
        return this._detune;
    }

    set detune(value)
    {
        this._detune.value = value;
    }
}
