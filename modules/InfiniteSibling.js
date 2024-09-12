const iSAudioContext = new AudioContext();

// audio nodes
import { IS_Gain } from "./nodes/IS_Gain.js";
import { IS_Oscillator } from "./nodes/IS_Oscillator.js";
import { IS_BiquadFilterNode } from "./nodes/IS_BiquadFilterNode.js";

// enums
import { IS_Interval } from "./enums/IS_Interval.js";
import { IS_KeyboardNote } from "./enums/IS_KeyboardNote.js";
import { IS_Mode } from "./enums/IS_Mode.js";

// types
import { IS_Scale } from "./types/IS_Scale.js";

// utilities
import { IS_Random } from "./utilities/IS_Random.js";
import { mToF } from "./utilities/MidiToFrequency.js";

export class InfiniteSibling
{
    constructor()
    {
        this.audioContext = iSAudioContext;
        this.destination = this.audioContext.destination;

        this.output = this.createGain(1);
        this.output.connect(this.destination);
    }

    /*
    Audio Status
     */
    start()
    {
        this.audioContext.resume();
    }

    stop()
    {
        this.audioContext.close();
    }

    /*
    Audio Settings
     */
    set outputGain(value)
    {
        this.output.setParam("gain", value);
    }

    /*
    Node Creation
     */
    createOsc(type = "sine", frequency = 440, detune = 0)
    {
        return new IS_Oscillator(this, type, frequency, detune);
    }

    createFilter(type = "lowpass", frequency = 220, Q = 1, gain = 1, detune = 0)
    {
        return new IS_BiquadFilterNode(this, type, frequency, Q, gain, detune);
    }

    createGain(gainValue = 1)
    {
        return new IS_Gain(this, gainValue);
    }

    /*
    Utilities
     */
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

    scale(tonic = IS_KeyboardNote.C, mode = IS_Mode.major)
    {
        return new IS_Scale(tonic, mode);
    }

    intervalRatio(intervalString)
    {
        return IS_Interval[intervalString];
    }
}
