const INFINITE_SIBLING_AUDIO_CONTEXT = new AudioContext();

// core
import { IS_LifeCycle } from "./utilities/IS_LifeCycle.js";
import { IS_NodeRegistry } from "./nodes/registry/IS_NodeRegistry.js";
import { IS_NetworkRegistry } from "./nodes/network/IS_NetworkRegistry.js"
import { IS_Scheduler } from "./types/schedule/IS_Scheduler.js";
import { IS_ConnectionManager } from "./utilities/IS_ConnectionManager.js";

// audio nodes
import { IS_Gain } from "./nodes/core/effect/IS_Gain.js";
import { IS_Oscillator } from "./nodes/core/source/IS_Oscillator.js";
import { IS_BiquadFilter } from "./nodes/core/effect/IS_BiquadFilter.js";
import { IS_Buffer } from "./types/buffer/IS_Buffer.js";
import { IS_BufferSource } from "./nodes/core/source/IS_BufferSource.js";
import { IS_Delay } from "./nodes/core/effect/IS_Delay.js";
import { IS_StereoPanner } from "./nodes/core/effect/IS_StereoPanner.js";
import { IS_StereoDelay } from "./nodes/custom/IS_StereoDelay.js";
import { IS_Convolver } from "./nodes/core/effect/IS_Convolver.js";
import { IS_AmplitudeModulator } from "./nodes/custom/IS_AmplitudeModulator.js";
import { IS_ParallelEffect } from "./nodes/custom/IS_ParallelEffect.js";
import { IS_Effect } from "./nodes/core/effect/IS_Effect.js";
import { IS_NodeMatrix } from "./nodes/custom/IS_NodeMatrix.js";

// enums
import { IS_Interval } from "./enums/IS_Interval.js";
import { IS_KeyboardNote } from "./enums/IS_KeyboardNote.js";
import { IS_Mode } from "./enums/IS_Mode.js";
import { IS_Type } from "./enums/IS_Type.js";

// types
import { IS_Array } from "./types/array/IS_Array.js";
import { IS_ControlParameters } from "./types/parameter/control/IS_ControlParameters.js";
import { IS_Scale } from "./types/array/IS_Scale.js";
import { IS_SequenceArray } from "./types/array/IS_SequenceArray.js";

// utilities
import { IS_Random } from "./utilities/IS_Random.js";
import { IS_Utilities } from "./utilities/IS_Utilities.js";
import { BufferPrint } from "./utilities/BufferPrint.js";
import { IS_MessageBus } from "./utilities/IS_MessageBus.js";

export class InfiniteSibling
{
    constructor()
    {
        this._audioContext = INFINITE_SIBLING_AUDIO_CONTEXT;
        this.destination = this.AudioContext.destination;

        this.output = this.AudioContext.createGain();
        this.output.connect(this.destination);

        this._siblingName = null;

        this.Utility.siblingContext = this;

        BufferPrint.configure();
    }

    /*
        AUDIO CONTEXT
    */
    get AudioContext () { return this._audioContext; }

    /*
        NODE REGISTRY
    */
    get NodeRegistry()  { return IS_NodeRegistry; }

    /*
        NETWORK REGISTRY
    */
    get NetworkRegistry() { return IS_NetworkRegistry; }

    /*
        LIFE CYCLE
    */
    load()
    {
        IS_LifeCycle.load();
    }

    start()
    {
        this.AudioContext.resume();
        IS_LifeCycle.start();
        IS_Scheduler.start();
    }

    stop()
    {
        this.AudioContext.close();
        IS_LifeCycle.stop();
        IS_Scheduler.stop();
    }

    onLoad(callback) { IS_LifeCycle.onLoad(callback); }
    onReady(callback) { IS_LifeCycle.onReady(callback); }
    onStart(callback) { IS_LifeCycle.onStart(callback); }
    onStop(callback) { IS_LifeCycle.onStop(callback); }

    /*
        SCHEDULING
    */
    get Scheduler() { return IS_Scheduler; }

    /*
        OUTPUT SETTINGS
    */
    set outputGain(value) { this.output.gain.value = value; }
    set outputVolume(value) { this.output.gain.value = this.Utility.DecibelsToAmplitude(value); }

    outputMono()
    {
        let channelMerger = this.AudioContext.createChannelMerger(1);

        this.output.disconnect();
        this.output.connect(channelMerger);
        channelMerger.connect(this.destination);
    }

    /*
        CONNECTION
    */
    get connect() { return IS_ConnectionManager; }

    /*
        GLOBAL VALUES
    */
    get now() { return this.AudioContext.currentTime; }
    get sampleRate() { return this.AudioContext.sampleRate; }

    /*
        NODE CREATION
    */
    createOscillator(type = "sine", frequency = 440, detune = 0)
    {
        return new IS_Oscillator(this, type, frequency, detune);
    }

    createFilter(type = "lowpass", frequency = 220, Q = 1, gain = 1, detune = 0)
    {
        return new IS_BiquadFilter(this, type, frequency, Q, gain, detune);
    }

    // TODO: This sort of works as a constructor, but then you have to include the sibling context as an argument
    //  -> so I guess you should have some kind of constructor class or factory that references the context?
    get Gain()
    {
        return IS_Gain;
    }

    // TODO: Change to constructors, or keep consistent with WAAPI? -> probably both
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
                maxDelayTime = null)
    {
        let maxTime = maxDelayTime === null ? delayTime : maxDelayTime;

        return new IS_Delay(this, delayTime, feedbackPercent, wetMix, maxTime);
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

    // TODO: This is a preset
    createAmplitudeModulator(buffer = null, modulatorPlaybackRate = 1, loop = true)
    {
        return new IS_AmplitudeModulator(this, buffer, modulatorPlaybackRate, loop);
    }

    createEffect()
    {
        return new IS_Effect(this);
    }

    createParallelEffect()
    {
        return new IS_ParallelEffect(this);
    }

    createNodeMatrix()
    {
        return new IS_NodeMatrix(this);
    }

    // TODO: Consolidate to a factory
    /*
        ARRAYS
    */
    array(...values)
    {
        return new IS_Array(values);
    }

    sequenceArray(...values)
    {
        return new IS_SequenceArray(values);
    }

    scale(tonic = IS_KeyboardNote.C, mode = IS_Mode.Major)
    {
        return new IS_Scale(tonic, mode);
    }

    frequencyScale(tonic = IS_KeyboardNote.C, mode = IS_Mode.Major)
    {
        let scaleArray = [];
        let midiScale = this.scale(tonic, mode).value;

        for (let i = 0; i < midiScale.length; i++)
        {
            let midiNote = midiScale[i];
            scaleArray[i] = this.Utility.MidiToFrequency(midiNote);
        }

        return new IS_Array(scaleArray);
    }

    ratioScale(mode = IS_Mode.Major)
    {
        let frequencyScale = this.frequencyScale(IS_KeyboardNote.C, mode);
        frequencyScale.divide(frequencyScale.value[0]);

        return frequencyScale;
    }

    get Mode()
    {
        return IS_Mode;
    }

    /*
        RANDOM
    */
    get Random()
    {
        return IS_Random;
    }

    /*
	    UTILITY
    */
    get Utility()
    {
        return IS_Utilities;
    }

    /*
        MESSAGE BUS
    */
    get MessageBus()
    {
        return IS_MessageBus;
    }

    /*
        PARAMETERS
     */
    get ControlParameters()
    {
        return IS_ControlParameters;
    }

    /*
        SIBLING NAME
    */
    get SiblingName()
    {
        return this._siblingName;
    }

    set SiblingName(value)
    {
        this._siblingName = value;
    }

    /*
        SIBLING CONFIG
    */
    get SiblingConfig()
    {
        let json = IS_ControlParameters.JSON;
        json["Name"] = this._siblingName;

        return json;
    }
}
