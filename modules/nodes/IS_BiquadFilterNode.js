import { IS_Node } from "./IS_Node.js";

export class IS_BiquadFilterNode extends IS_Node
{
    constructor(audioContext, type = "lowpass", frequency = 220, Q = 1, gain = 1, detune = 0)
    {
        super(audioContext);

        this.filter = this.audioContext.createBiquadFilter();
        this.filter.type = type;
        this.filter.frequency.value = frequency;
        this.filter.Q.value = Q;
        this.filter.gain.value = gain;
        this.filter.detune.value = detune;
    }

    connect(audioNode)
    {
        this.filter.connect(audioNode);
    }
}