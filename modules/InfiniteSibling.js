const iSAudioContext = new AudioContext();

// core
import { IS_NodeRegistry } from "./nodes/core/IS_NodeRegistry.js";

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
import { IS_Scale } from "./types/array/IS_Scale.js";
import { IS_Schedule } from "./types/schedule/IS_Schedule.js";
import { IS_Sequence } from "./types/sequence/IS_Sequence.js";
import { IS_SequenceArray } from "./types/array/IS_SequenceArray.js";

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

        this.schedule = new IS_Schedule();
        this.schedules = [];
        this.sequences = [];

        this.loadCallbacks = [];
        this.readyCallbacks = [];
        this.startCallbacks = [];
        this.stopCallbacks = [];

        this._nodeRegistry = new IS_NodeRegistry();
    }

    get NodeType()
    {
        return IS_Type.IS_NodeType;
    }

    get nodeRegistry()
    {
        return this._nodeRegistry;
    }

    registerNode(nodeData)
    {
        this._nodeRegistry.registerNode(nodeData);
    }

    /*
    Audio Status
     */
    load()
    {
        for(let loadCallbackIndex = 0; loadCallbackIndex < this.loadCallbacks.length; loadCallbackIndex++)
        {
            this.loadCallbacks[loadCallbackIndex]();
        }

        this.ready();
    }

    onLoad(callback)
    {
        this.loadCallbacks.push(callback);
    }

    ready()
    {
        for(let readyCallbackIndex = 0; readyCallbackIndex < this.readyCallbacks.length; readyCallbackIndex++)
        {
            this.readyCallbacks[readyCallbackIndex]();
        }
    }

    onReady(callback)
    {
        this.readyCallbacks.push(callback);
    }

    start()
    {
        this.audioContext.resume();

        for(let startCallbackIndex = 0; startCallbackIndex < this.startCallbacks.length; startCallbackIndex++)
        {
            this.startCallbacks[startCallbackIndex]();
        }

        this.scheduleSequences();
        this.startSchedules();
    }

    onStart(callback)
    {
        this.startCallbacks.push(callback);
    }

    stop()
    {
        for(let stopCallbackIndex = 0; stopCallbackIndex < this.stopCallbacks.length; stopCallbackIndex++)
        {
            this.stopCallbacks[stopCallbackIndex]();
        }

        this.stopSchedules();
        this.audioContext.close();
    }

    onStop(callback)
    {
        this.stopCallbacks.push(callback);
    }

    /*
    Audio Settings
     */
    set outputGain(value)
    {
        this.output.gain.value = value;
    }

    set outputVolume(value)
    {
        this.output.gain.value = this.decibelsToAmplitude(value);
    }

    outputMono()
    {
        let channelMerger = this.audioContext.createChannelMerger(1);

        this.output.disconnect();
        this.output.connect(channelMerger);
        channelMerger.connect(this.destination);
    }

    connectSeries(...audioNodes)
    {
        for (let audioNodeIndex = 1; audioNodeIndex < audioNodes.length; audioNodeIndex++)
        {
            let previousNode = audioNodes[audioNodeIndex - 1];
            let audioNode = audioNodes[audioNodeIndex];

            if (audioNode.iSType !== undefined && audioNode.iSType === IS_Type.IS_Effect)
            {
                previousNode.connect(audioNode);
            } else
            {
                previousNode.connect(audioNode);
            }
        }
    }

    connectMatrix(...matrix)
    {
        for(let matrixRow = 1; matrixRow < matrix.length; matrixRow++)
        {
            let outputRow = matrix[matrixRow - 1];
            let inputRow = matrix[matrixRow];

            for(let outputNodeIndex = 0; outputNodeIndex < outputRow.length; outputNodeIndex++)
            {
                let outputNode = outputRow[outputNodeIndex];

                for(let inputNodeIndex = 0; inputNodeIndex < inputRow.length; inputNodeIndex++)
                {
                    outputNode.connect(inputRow[inputNodeIndex])
                }
            }
        }
    }

    connectToMainOutput(...audioNodes)
    {
        for (let audioNodeIndex = 0; audioNodeIndex < audioNodes.length; audioNodeIndex++)
        {
            let audioNode = audioNodes[audioNodeIndex];

            if (audioNode.iSType !== undefined && audioNode.iSType === IS_Type.IS_Effect)
            {
                audioNode.connect(this.output);
            } else
            {
                audioNode.connect(this.output);
            }
        }
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

    // TODO: replace with NodeFactory class?
    /*
    Nodes
     */
    createOscillator(type = "sine", frequency = 440, detune = 0)
    {
        return new IS_Oscillator(this, type, frequency, detune);
    }

    // TODO: replace these arguments with objects like IS_BiquadFilterArgs
    createFilter(type = "lowpass", frequency = 220, Q = 1, gain = 1, detune = 0)
    {
        return new IS_BiquadFilter(this, type, frequency, Q, gain, detune);
    }

    createGain(gainValue = 1)
    {
        return new IS_Gain(this, gainValue);
    }

    /**
     * Create an IS_Buffer
     * @param numberOfChannels
     * @param duration length of the buffer in seconds
     * @returns {IS_Buffer}
     */
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

    /*
    schedule
     */
    /**
     * Create an IS_Schedule and add it to the schedule Registry
     * @returns {IS_Schedule}
     */
    createSchedule()
    {
        return new IS_Schedule();
    }

    scheduleStart(schedulable, time = 0, duration = null)
    {
        this.schedule.scheduleStart(schedulable, time, duration);
    }

    scheduleStop(schedulable, time)
    {
        this.schedule.scheduleStop(schedulable, time);
    }

    scheduleValue(schedulable, value, time, transitionTime = null)
    {
        this.schedule.scheduleValue(schedulable, value, time, transitionTime);
    }

    startSchedules()
    {
        this.schedule.schedule();
    }

    stopSchedules()
    {
        this.schedule.stop();
    }

    schedule(schedule)
    {
        this.schedules.push(schedule);
    }

    /*
    sequence
     */
    createSequence()
    {
        return new IS_Sequence();
    }

    sequence(sequence)
    {
        this.sequences.push(sequence);
    }

    scheduleSequences()
    {
        for(let sequenceIndex = 0; sequenceIndex < this.sequences.length; sequenceIndex++)
        {
            this.sequences[sequenceIndex].schedule();
        }
    }

    /*
    Utilities
     */
    array(...values)
    {
        return new IS_Array(values);
    }

    sequenceArray(...values)
    {
        return new IS_SequenceArray(values);
    }

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

    coinToss(probabilityOfTrue = 0.5)
    {
        return IS_Random.coinToss(probabilityOfTrue);
    }

    randomValue(...values)
    {
        return IS_Random.randomValue(...values);
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
            scaleArray[i] = this.MidiToFrequency(midiNote);
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

    get KeyboardNote()
    {
        return IS_KeyboardNote;
    }

    intervalRatio(intervalString)
    {
        return IS_Interval[intervalString];
    }

    /**
     * Convert an amplitude value to a dB value
     * @param amplitudeValue
     * @constructor
     */
    amplitudeToDecibels(amplitudeValue)
    {
        return Utilities.AmplitudeToDecibels(amplitudeValue);
    }

    /**
     * Convert a dB value to an amplitude value
     * @param decibelValue
     * @constructor
     */
    decibelsToAmplitude(decibelValue)
    {
        return Utilities.DecibelsToAmplitude(decibelValue);
    }
}
