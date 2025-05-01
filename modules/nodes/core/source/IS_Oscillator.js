import { IS_StartableNode } from "../IS_StartableNode.js";
import { IS_StartableNodeAudioParameter } from "../../../types/parameter/audio/IS_StartableNodeAudioParameter.js";
import { IS_Type } from "../../../enums/IS_Type.js";

export class IS_Oscillator extends IS_StartableNode
{
    constructor(siblingContext, type = "sine", frequency = 440, detune = 0)
    {
        super(siblingContext, IS_Type.IS_SourceType.IS_Oscillator);

        this._type = type;

        this._frequency = new IS_StartableNodeAudioParameter(siblingContext, this, frequency);
        this._detune = new IS_StartableNodeAudioParameter(siblingContext, this, detune);

        this.initializeCallback = this.initialize;
    }

    isISOscillator = true;

    initialize()
    {
        this._startableNode = new OscillatorNode(this._siblingContext.AudioContext);

        this._startableNode.frequency.value = 0;
        this._startableNode.detune.value = 0;

        this._startableNode.type = this._type;

        this._frequency.connect(this._startableNode.frequency);
        this._detune.connect(this._startableNode.detune);

        this._configureOutput(this._startableNode);

        this.isInitialized = true;
    }

    get type()
    {
        return this._type;
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
    }

    get detune()
    {
        this._detune.parameter;
    }

    set detune(value)
    {
        this._detune.value = value;
    }
}
