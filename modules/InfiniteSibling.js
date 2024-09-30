const iSAudioContext = new AudioContext();

// audio nodes
import { IS_Gain } from "./nodes/core/effect/IS_Gain.js";
import { IS_Oscillator } from "./nodes/core/source/IS_Oscillator.js";
import { IS_BiquadFilter } from "./nodes/core/effect/IS_BiquadFilter.js";
import { IS_Buffer } from "./types/IS_Buffer.js";
import { IS_BufferSource } from "./nodes/core/source/IS_BufferSource.js";
import { IS_Delay } from "./nodes/core/effect/IS_Delay.js";
import { IS_StereoPanner } from "./nodes/core/effect/IS_StereoPanner.js";
import { IS_StereoDelay } from "./nodes/custom/IS_StereoDelay.js";
import { IS_Convolver } from "./nodes/core/effect/IS_Convolver.js";
import {IS_AmplitudeModulator} from "./nodes/custom/IS_AmplitudeModulator.js";


// enums
import { IS_Interval } from "./enums/IS_Interval.js";
import { IS_KeyboardNote } from "./enums/IS_KeyboardNote.js";
import { IS_Mode } from "./enums/IS_Mode.js";

// types
import { IS_Scale } from "./types/IS_Scale.js";

// utilities
import { IS_Random } from "./utilities/IS_Random.js";
import { Utilities } from "./utilities/Utilities.js";
import { BufferPrint } from "./utilities/BufferPrint.js";

export class InfiniteSibling
{
    constructor()
    {
        this.audioContext = iSAudioContext;
        this.destination = this.audioContext.destination;

        this.output = this.audioContext.createGain();
        this.output.connect(this.destination);

        BufferPrint.configure();
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
    Global Values
     */
    get now()
    {
        return this.audioContext.currentTime;
    }

    get sampleRate()
    {
        return this.audioContext.sampleRate;
    }

    /*
    Node Creation
     */
    createOscillator(type = "sine", frequency = 440, detune = 0)
    {
        return new IS_Oscillator(this, type, frequency, detune);
    }

    createFilter(type = "lowpass", frequency = 220, Q = 1, gain = 1, detune = 0)
    {
        return new IS_BiquadFilter(this, type, frequency, Q, gain, detune);
    }

    createGain(gainValue = 1)
    {
        return new IS_Gain(this, gainValue);
    }

    createBuffer(numberOfChannels = 1, duration = 1)
    {
        return new IS_Buffer(this, numberOfChannels, duration, this.sampleRate);
    }

    createBufferSource(buffer = null, detune = 0,
                       loop = false, loopStart = 0, loopEnd = 1,
                       playbackRate = 1)
    {
        return new IS_BufferSource(this, buffer, detune, loop, loopStart, loopEnd, playbackRate)
    }

    createDelay(delayTime = 1, feedbackPercent = 0.25, wetMix = 0.5,
                maxDelayTime = 1)
    {
        return new IS_Delay(this, delayTime, feedbackPercent, wetMix, maxDelayTime);
    }

    createStereoPanner(pan = 0)
    {
        return new IS_StereoPanner(this, pan);
    }

    createStereoDelay(delayTimeLeft = 0.5, delayTimeRight = 0.25, feedbackPercent = 0.5,
                      wetMix = 0.5, maxDelayTime = 1)
    {
        return new IS_StereoDelay(this, delayTimeLeft, delayTimeRight, feedbackPercent, wetMix, maxDelayTime);
    }

    createConvolver(buffer = null, normalize = true)
    {
        return new IS_Convolver(this, buffer, normalize);
    }

    createAmplitudeModulator(buffer = null, modulatorPlaybackRate = 1, loop = true)
    {
        return new IS_AmplitudeModulator(this, buffer, modulatorPlaybackRate, loop);
    }

    /*
    Utilities
     */
    MidiToFrequency(midiNoteNumber)
    {
        return Utilities.MidiToFrequency(midiNoteNumber);
    }

    SecondsToSamples(nSeconds)
    {
        return Utilities.SecondsToSamples(nSeconds, this.audioContext.sampleRate);
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
