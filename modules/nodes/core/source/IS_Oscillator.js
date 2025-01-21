import { IS_StartableNode } from "../IS_StartableNode.js";
import { IS_StartableNodeAudioParameter } from "../../../types/parameter/IS_StartableNodeAudioParameter.js";

export class IS_Oscillator extends IS_StartableNode
{
    constructor(siblingContext, type = "sine", frequency = 440, detune = 0)
    {
        super(siblingContext);

        this._type = type;

        this._frequency = new IS_StartableNodeAudioParameter(siblingContext, frequency);
        this._detune = new IS_StartableNodeAudioParameter(siblingContext, detune);

        this.initializeCallback = this.initialize;
    }

    initialize()
    {
        this._startableNode = new OscillatorNode(this.siblingContext.audioContext);

        this._startableNode.frequency.value = 0;
        this._startableNode.detune.value = 0;

        this._startableNode.type = this._type;

        this._frequency.outlet.connect(this._startableNode.frequency);
        this._detune.outlet.connect(this._startableNode.detune);

        this.configureOutput(this._startableNode);

        this.isInitialized = true;
    }

    get type()
    {
        this._type;
    }

    set type(value)
    {
        this._type = value;
        this._startableNode.type = this._type;
    }

    get frequency()
    {
        return this._frequency.parameter;
    }

    set frequency(value)
    {
        this._frequency.value = value;
        this._startableNode.frequency.value = this._frequency.value;
    }

    get detune()
    {
        this._detune.parameter;
    }

    set detune(value)
    {
        this._detune.value = value;
        this._startableNode.detune.value = this._detune.value;
    }
}
