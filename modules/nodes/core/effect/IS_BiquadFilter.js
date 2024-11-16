import { IS_Effect } from "./IS_Effect.js";
import { IS_AudioParameter } from "../../../types/parameter/IS_AudioParameter.js";

export class IS_BiquadFilter extends IS_Effect
{
    constructor
    (
        siblingContext,
        type = "lowpass", frequency = 220, Q = 1, gain = 1, detune = 0
    )
    {
        super(siblingContext)

        this._filterNode = new BiquadFilterNode(siblingContext.audioContext);

        this._type = type;
        this._frequency = new IS_AudioParameter(this._filterNode.frequency, frequency);
        this._Q = new IS_AudioParameter(this._filterNode.Q, Q);
        this._gain = new IS_AudioParameter(this._filterNode.gain, gain);
        this._detune = new IS_AudioParameter(this._filterNode.detune, detune);

        this.configureIO(this._filterNode, this._filterNode);
    }

    get type()
    {
        return this._type;
    }

    set type(value)
    {
        this._type = value;
        this._filterNode.type = value;
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
        this._detune.value;
    }

    set detune(value)
    {
        this._detune.value = value;
    }
}
