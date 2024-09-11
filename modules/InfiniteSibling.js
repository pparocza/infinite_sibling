const iSAudioContext = new AudioContext();
import { IS_Oscillator } from "./nodes/IS_Oscillator.js";
import { IS_BiquadFilterNode } from "./nodes/IS_BiquadFilterNode.js";

export class InfiniteSibling
{
    constructor()
    {
        this.output = iSAudioContext.destination;
        this.audioContext = iSAudioContext;
    }

    start()
    {
        this.audioContext.resume();
    }

    stop()
    {
        this.audioContext.close();
    }

    osc(type = "sine", frequency = 440)
    {
        return new IS_Oscillator(this.audioContext, type, frequency);
    }

    biquadFilter(type = "lowpass", frequency = 220, Q = 1, gain = 1, detune = 0)
    {
        return new IS_BiquadFilterNode(this.audioContext, type, frequency, Q, gain, detune);
    }

}