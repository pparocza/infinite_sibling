const iSAudioContext = new AudioContext();

// audio nodes
import { IS_Oscillator } from "./nodes/IS_Oscillator.js";
import { IS_BiquadFilterNode } from "./nodes/IS_BiquadFilterNode.js";

// types
import { IS_Scale } from "./types/IS_Scale.js";
import { IS_Interval } from "./types/IS_Interval.js";
import { IS_KeyboardNotes } from "./types/IS_KeyboardNotes.js";
import { IS_Modes } from "./types/IS_Modes.js";

// utilities
import { IS_Random } from "./utilities/IS_Random.js";
import { mToF } from "./utilities/MidiToFrequency.js";

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

    mToF(midiNoteNumber)
    {
        return mToF(midiNoteNumber);
    }

    randomInt(min, max)
    {
        return IS_Random.randomInt(min, max);
    }
    randomFloat(min, max)
    {
        return IS_Random.randomFloat(min, max);
    }

    scale(tonic = IS_KeyboardNotes.C, mode = IS_Modes.major)
    {
        return new IS_Scale(tonic, mode);
    }

    intervalRatio(intervalString)
    {
        return IS_Interval[intervalString];
    }
}