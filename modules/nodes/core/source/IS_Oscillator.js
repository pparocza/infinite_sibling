import { IS_StartableNode } from "../IS_StartableNode.js";
import { IS_StartableNodeAudioParameter } from "../../../types/parameter/IS_StartableNodeAudioParameter.js";

export class IS_Oscillator extends IS_StartableNode
{
    constructor(siblingContext, type = "sine", frequency = 440, detune = 0)
    {
        super(siblingContext);

        this._type = type;

        this._frequency = new IS_StartableNodeAudioParameter(siblingContext);
        this._detune = new IS_StartableNodeAudioParameter(siblingContext);

        this.initializeCallback = this.initialize;
        this.initialize();

        this.frequency = frequency;
        this.detune = detune;
    }

    initialize()
    {
        this.node = new OscillatorNode(this.siblingContext.audioContext);

        this.node.frequency.value = 0;
        this.node.detune.value = 0;

        this.node.type = this._type;

        this._frequency.outlet.connect(this.node.frequency);
        this._detune.outlet.connect(this.node.detune);

        this.node.connect(this._output);

        this.isInitialized = true;
    }

    get type()
    {
        this._type;
    }

    set type(value)
    {
        this._type = value;
        this.node.type = this._type;
    }

    get frequency()
    {
        return this._frequency.parameter;
    }

    set frequency(value)
    {
        this._frequency.value = value;
        this.node.frequency.value = this._frequency.value;
    }

    get detune()
    {
        this._detune.parameter;
    }

    set detune(value)
    {
        this._detune.value = value;
        this.node.detune.value = this._detune.value;
    }
}
