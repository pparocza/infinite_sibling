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
        super(siblingContext, new BiquadFilterNode(siblingContext.audioContext))

        this._type = type;
        this._frequency = new IS_AudioParameter(this.node.frequency, frequency);
        this._Q = new IS_AudioParameter(this.node.Q, Q);
        this._gain = new IS_AudioParameter(this.node.gain, gain);
        this._detune = new IS_AudioParameter(this.node.detune, detune);
    }

    get type()
    {
        return this._type;
    }

    set type(value)
    {
        this._type = value;
        this.node.type = value;
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
