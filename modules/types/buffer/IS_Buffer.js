import { IS_Object } from "../IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";
import { IS_TWO_PI } from "../../utilities/Constants.js";
import { IS_SAMPLE_MIN_VALUE } from "../../utilities/Constants.js";
import { IS_Random } from "../../utilities/IS_Random.js";
import { IS_Array } from "../array/IS_Array.js";
import { BufferPrint } from "../../utilities/BufferPrint.js";
import { Utilities } from "../../utilities/Utilities.js";
import { IS_BufferPresets } from "../../presets/IS_BufferPresets.js";

import { IS_BufferOperationManager } from "./operation/IS_BufferOperationManager.js";
// TODO: some of these can probably be consolidated into the files that reference them
/*
 EX:
    -> IS_BufferOperationData.function.Sine(440) creates that function data in the operation
    -> IS_BufferOperationData.operation.Add
 */
import { IS_BufferOperationData } from "./operation/IS_BufferOperationData.js";
import { IS_BufferFunctionData } from "./operation/function/IS_BufferFunctionData.js";
import { IS_BufferFunctionType } from "./operation/function/IS_BufferFunctionType.js";
import { IS_BufferOperatorType } from "./operation/IS_BufferOperatorType.js"


// TODO: Operation Queue - operation methods return asynchronous queue objects that get handled sequentially by an asynchronous operator
// TODO: BufferOperator -> holds an operation array - doesn't need a suspended operation array, instead a suspended operation creates a parallel BufferOperator
// TODO: BufferOperation(Operation = IS_BufferOperation.Add, Shape = IS_BufferShape.Sine) -> Queued in BufferOperator, which holds the buffer being operated on
/*
    ^^ enums are entirely internal for the purpose of formatting messages to the buffer operator -> so IS_Buffer
    just creates operation, and BufferOperator references the actual generation algorithms
    - REMEMBER: shapes will have to have arguments (should be fine)
*/

// TODO: SmoothClip

export class IS_Buffer extends IS_Object
{
    constructor(siblingContext, numberOfChannels = 1, duration = 1, sampleRate = null)
    {
        super(IS_Type.IS_Data.IS_Buffer);

        if(sampleRate === null)
        {
            sampleRate = siblingContext.sampleRate;
        }

        let lengthSamples = siblingContext.SecondsToSamples(duration, sampleRate);

        this._numberOfChannels = numberOfChannels;
        this._duration = duration;
        this._length = lengthSamples;
        this._sampleRate = sampleRate;

        this._bufferShapeArray = new Float32Array(this._length);
        this._suspendedOperationsArray = new Float32Array(this._length);
        this._buffer = siblingContext.audioContext.createBuffer(numberOfChannels, lengthSamples, this._sampleRate);

        this._preset = new IS_BufferPresets(this);
        this._siblingContext = siblingContext;

        this._suspendOperation = false;
        this._periodicShapeIncrements = null;
        this._timeIncrement = 1 / lengthSamples;

        this._operationRequestData = new IS_BufferOperationData();
        this._operationRequestData.sampleRate = this._sampleRate;
    }

    isBuffer = true;

    get buffer() { return this._buffer; }
    set buffer(buffer)
    {
        this._buffer = buffer.isBuffer ? buffer.buffer : buffer;
    }

    get duration() { return this._duration; }
    set duration(value)
    {
        this._duration = value;
        this._buffer.duration = this._duration;
    }

    get length() { return this._length; }
    set length(value)
    {
        this._length = value;
        this._buffer.length = this._length;
    }

    get numberOfChannels() { return this._numberOfChannels; }
    set numberOfChannels(value)
    {
        this._numberOfChannels = value;
        this._buffer.numberOfChannels = this._numberOfChannels;
    }

    get sampleRate() { return this._sampleRate; }
    set sampleRate(value)
    {
        this._sampleRate = value;
        this._buffer.sampleRate = this._sampleRate;
    }

    /*
    Buffer Operations
     */
    get operationRequestData() { return this._operationRequestData; }

    _requestOperation(operationData)
    {
        IS_BufferOperationManager.requestOperation(this);
    }

    get suspendOperation()
    {
        return this._suspendOperation;
    }

    set suspendOperation(value)
    {
        this._suspendOperation = value;
    }

    suspendOperations()
    {
        this._suspendOperation = true;
    }

    applySuspendedOperations()
    {
        this._bufferShapeArray = [...this._suspendedOperationsArray];
        this._suspendedOperationsArray = new Float32Array(this._length);
        this._suspendOperation = false;
        return this;
    }

    _setOperationRequestOperatorData(iSBufferOperatorType)
    {
        this._operationRequestData.operatorType = iSBufferOperatorType;
        this._requestOperation();
    }

    add()
    {
        this._setOperationRequestOperatorData(IS_BufferOperatorType.Add);
    }

    multiply()
    {
        this._setOperationRequestOperatorData(IS_BufferOperatorType.Multiply);
    }

    divide()
    {
        this._setOperationRequestOperatorData(IS_BufferOperatorType.Divide);
    }

    subtract()
    {
        this._setOperationRequestOperatorData(IS_BufferOperatorType.Subtract);
    }

    insert(channel = 0, startPercent = 0, endPercent = 1, style = "add")
    {
        // TODO: all methods have default range arguments?
        let startSample = Math.round(this.length * startPercent);
        let endSample = Math.round(this.length * endPercent);

        let nowBuffering = this.buffer.getChannelData(channel);

        switch(style)
        {
            case "add":
            case 0:
                this.insertAdd(nowBuffering, startSample, endSample);
                break;
            case "replace":
            case 1:
                this.insertReplace(nowBuffering, startSample, endSample);
                break;
            default:
                break;
        }
    }

    /**
     *
     * @param buffer
     * @param startSample
     * @param endSample
     */
    insertAdd(buffer, startSample, endSample)
    {
        for (let sample= 0; sample < this.buffer.length; sample++)
        {
            if(sample > startSample && sample < endSample)
            {
                buffer[sample] += this._bufferShapeArray[sample];
            }
        }
    }

    /**
     *
     * @param buffer
     * @param startSample
     * @param endSample
     */
    insertReplace(buffer, startSample, endSample)
    {
        for (let sample= 0; sample < this.buffer.length; sample++)
        {
            if(sample > startSample && sample < endSample)
            {
                buffer[sample] = this._bufferShapeArray[sample - startSample];
            }
        }
    }

    amplitude(value)
    {
        for(let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            this._bufferShapeArray[sample] *= value;
        }
        return this;
    }

    volume(value)
    {
        let amplitude = Utilities.DecibelsToAmplitude(value);

        for(let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            this._bufferShapeArray[sample] *= amplitude;
        }
        return this;
    }

    _setOperationRequestFunctionData(iSBufferFunctionType, ...args)
    {
        this._operationRequestData.functionData = new IS_BufferFunctionData
        (
            iSBufferFunctionType, args
        );
    }

    /**
     *
     * @param value
     * @returns {IS_Buffer}
     */
    constant(value)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Constant, value
        );

        return this;
    }

    /**
     *
     * @returns {IS_Buffer}
     */
    impulse()
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Impulse, null
        );

        return this;
    }

    /**
     *
     * @param exponent
     * @returns {IS_Buffer}
     */
    sawtooth(exponent = 1)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Sawtooth, exponent
        );

        return this;
    }

    /**
     *
     * @param exponent
     * @returns {IS_Buffer}
     */
    inverseSawtooth(exponent = 1)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.InverseSawtooth, exponent
        );

        return this;
    }

    /**
     *
     * @param exponent
     * @returns {IS_Buffer}
     */
    triangle(exponent = 1)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.InverseSawtooth, exponent
        );

        return this;
    }

    /**
     *
     * @returns {IS_Buffer}
     */
    noise()
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Noise, null
        );

        return this;
    }

    /**
     *
     * @returns {IS_Buffer}
     */
    unipolarNoise()
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Noise, null
        );

        return this;
    }

    /**
     *
     * @param dutyCycle
     * @returns {IS_Buffer}
     */
    square(dutyCycle)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Square, dutyCycle
        );

        return this;
    }

    /**
     *
     * @param startPercent
     * @param endPercent
     * @returns {IS_Buffer}
     */
    floatingCycleSquare(startPercent, endPercent)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.FloatingCycleSquare, startPercent, endPercent
        );

        return this;
    }

    /**
     *
     * @param frequency
     * @returns {IS_Buffer}
     */
    sine(frequency)
    {
        // TODO: dealing with multiple frequencies
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Sine, frequency
        );

        return this;
    }

    /**
     *
     * @param frequency
     * @returns {IS_Buffer}
     */
    unipolarSine(frequency)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.UnipolarSine, frequency
        );

        return this;
    }

    /**
     *
     * @param carrierFrequency
     * @param modulatorFrequency
     * @param modulatorGain
     * @returns {IS_Buffer}
     */
    frequencyModulatedSine
    (
        carrierFrequency, modulatorFrequency, modulatorGain
    )
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.FrequencyModulatedSine,
            carrierFrequency, modulatorFrequency, modulatorGain
        );

        return this;
    }

    /**
     *
     * @param carrierFrequency
     * @param modulatorFrequency
     * @param modulatorGain
     * @returns {IS_Buffer}
     */
    amplitudeModulatedSine
    (
        carrierFrequency, modulatorFrequency, modulatorGain
    )
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.AmplitudeModulatedSine,
            carrierFrequency, modulatorFrequency, modulatorGain
        );

        return this;
    }

    /**
     *
     * @param quantizationValue
     * @param valueArray
     * @returns {IS_Buffer}
     */
    quantizedArrayBuffer(quantizationValue, valueArray)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.QuantizedArrayBuffer, quantizationValue, valueArray
        );

        return this;
    }

    /**
     *
     * @param startPercent
     * @param endPercent
     * @param upEnd
     * @param downStart
     * @param upExp
     * @param downExp
     * @returns {IS_Buffer}
     */
    ramp
    (
        startPercent = 0, endPercent = 1,
        upEnd = 0.5, downStart = 0.5,
        upExp = 1, downExp = 1
    )
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Ramp,
            startPercent, endPercent, upEnd, downStart, upExp, downExp
        );

        return this;
    }

    /**
     *
     * @param carrierFrequency
     * @param bandwidth
     * @param tuningMin
     * @param tuningMax
     * @param amplitudeMin
     * @param amplitudeMax
     * @returns {IS_Buffer}
     */
    noiseBand
    (
        carrierFrequency, bandwidth, tuningMin, tuningMax, amplitudeMin, amplitudeMax
    )
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.NoiseBand,
            carrierFrequency, bandwidth, tuningMin, tuningMax, amplitudeMin, amplitudeMax
        );

        return this;
    }

    /**
     *
     * @param centerFrequency
     * @param bandwidth
     * @param upHarmonics
     * @param midHarmonics
     * @param downHarmonics
     * @param upTuningRange
     * @param midTuningRange
     * @param downTuningRange
     * @param upEnd
     * @param downStart
     * @param upExponent
     * @param downExponent
     * @param upRange
     * @param midRange
     * @param downRange
     * @returns {IS_Buffer}
     */
    rampBand
    (
        centerFrequency, bandwidth, upHarmonics, midHarmonics, downHarmonics, upTuningRange, midTuningRange,
        downTuningRange, upEnd, downStart, upExponent, downExponent, upRange, midRange, downRange
    )
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.RampBand,
            centerFrequency, bandwidth, upHarmonics, midHarmonics, downHarmonics, upTuningRange,
            midTuningRange, downTuningRange, upEnd, downStart, upExponent, downExponent, upRange,
            midRange, downRange
        );

        return this;
    }

    /**
     * Add contents of another buffer to this buffer
     * @param buffer
     */
    addBuffer(buffer)
    {
        let otherBuffer = null;
        let nowBuffering = null;
        let otherNowBuffering = null;

        if (buffer.iSType !== undefined && buffer.iSType === IS_Type.IS_Buffer)
        {
            otherBuffer = buffer.buffer;
        }
        else
        {
            otherBuffer = buffer;
        }

        for (let channel= 0; channel < this.numberOfChannels; channel++)
        {
            nowBuffering = this.buffer.getChannelData(channel);
            otherNowBuffering = otherBuffer.getChannelData(channel);

            let shorterBufferLength = nowBuffering < otherNowBuffering ?
                nowBuffering.length : otherNowBuffering.length;

            for (let sample= 0; sample < shorterBufferLength; sample++)
            {
                nowBuffering[sample] += otherNowBuffering[sample];
            }
        }
    }

    /**
     * Multiply contents of this buffer by another buffer
     * @param buffer
     */
    multiplyBuffer(buffer)
    {
        let otherBuffer = null;
        let nowBuffering = null;
        let otherNowBuffering = null;

        if(buffer.iSType !== undefined && buffer.iSType === IS_Type.IS_Buffer)
        {
            otherBuffer = buffer.buffer;
        }
        else
        {
            otherBuffer = buffer;
        }

        for (let channel= 0; channel < this.numberOfChannels; channel++)
        {
            nowBuffering = this.buffer.getChannelData(channel);
            otherNowBuffering = otherBuffer.getChannelData(channel);

            let shorterBufferLength = nowBuffering < otherNowBuffering ?
                nowBuffering.length : otherNowBuffering.length;

            for (let sample= 0; sample < shorterBufferLength; sample++)
            {
                nowBuffering[sample] *= otherNowBuffering[sample];
            }
        }
    }

    /**
     * Divide contents of this buffer by another buffer
     * @param buffer
     */
    divideBuffer(buffer)
    {
        let otherBuffer = null;
        let nowBuffering = null;
        let otherNowBuffering = null;

        if (buffer.iSType !== undefined && buffer.iSType === IS_Type.IS_Buffer)
        {
            otherBuffer = buffer.buffer;
        }
        else
        {
            otherBuffer = buffer;
        }

        for (let channel= 0; channel < this.numberOfChannels; channel++)
        {
            nowBuffering = this.buffer.getChannelData(channel);
            otherNowBuffering = otherBuffer.getChannelData(channel);

            let shorterBufferLength = nowBuffering < otherNowBuffering ? nowBuffering : otherNowBuffering;

            for (let sample= 0; sample < shorterBufferLength; sample++)
            {
                nowBuffering[sample] /= otherNowBuffering[sample];
            }
        }
    }

    /**
     * Subtract contents of a buffer from this buffer
     * @param buffer
     */
    subtractBuffer(buffer)
    {
        let otherBuffer = null;
        let nowBuffering = null;
        let otherNowBuffering = null;

        if(buffer.iSType !== undefined && buffer.iSType === IS_Type.IS_Buffer)
        {
            otherBuffer = buffer.buffer;
        }
        else
        {
            otherBuffer = buffer;
        }

        for (let channel= 0; channel < this.numberOfChannels; channel++)
        {
            nowBuffering = this.buffer.getChannelData(channel);
            otherNowBuffering = otherBuffer.getChannelData(channel);

            let shorterBufferLength = nowBuffering < otherNowBuffering ?
                nowBuffering.length : otherNowBuffering.length;

            for (let sample= 0; sample < shorterBufferLength; sample++)
            {
                nowBuffering[sample] -= otherNowBuffering[sample];
            }
        }
    }

    /**
     * place portion of one buffer in another buffer
     * @param buffer
     * @param cropStartPercent
     * @param cropEndPercent
     * @param insertPercent
     */
    spliceBuffer(buffer, cropStartPercent, cropEndPercent, insertPercent)
    {
        let otherBuffer = null;
        let nowBuffering = null;
        let otherNowBuffering = null;

        if(buffer.iSType !== undefined && buffer.iSType === IS_Type.IS_Buffer)
        {
            otherBuffer = buffer.buffer;
        }
        else
        {
            otherBuffer = buffer;
        }

        let cropStartSample = Math.round(otherBuffer.length * cropStartPercent);
        let cropEndSample = Math.round(otherBuffer.length * cropEndPercent);

        let cropLength = cropEndSample - cropStartSample;

        let cropArray = [];

        for (let channel= 0; channel < this.numberOfChannels; channel++)
        {
            nowBuffering = this.buffer.getChannelData(channel);
            otherNowBuffering = otherBuffer.getChannelData(channel);

            // crop the buffer values
            for (let cropSample= 0; cropSample < cropLength; cropSample++)
            {
                cropArray[cropSample] = otherNowBuffering[cropSample + cropStartSample];
            }

            // reinsert the cropped values at the new position
            for (let insertSample= 0; insertSample < cropLength; insertSample++)
            {
                if (insertSample + insertSample <= nowBuffering.length)
                {
                    nowBuffering[insertSample + insertSample] += cropArray[insertSample];
                }
            }
        }
    }

    /**
     *
     * @param buffer
     * @param insertPercent
     * @param writeMode
     */
    insertBuffer(buffer, insertPercent, writeMode = 0)
    {
        let otherBuffer = null;
        let nowBuffering = null;
        let otherNowBuffering = null;

        if(buffer.iSType !== undefined && buffer.iSType === IS_Type.IS_Buffer)
        {
            otherBuffer = buffer.buffer;
        }
        else
        {
            otherBuffer = buffer;
        }

        let insertSample = Math.round(this.length * insertPercent);

        for (let channel = 0; channel < this.numberOfChannels; channel++)
        {
            nowBuffering = this.buffer.getChannelData(channel);
            otherNowBuffering = otherBuffer.getChannelData(channel);

            for (let sample = 0; sample < otherNowBuffering.length; sample++)
            {
                switch(writeMode)
                {
                    case 0:
                        nowBuffering[sample + insertSample] = otherNowBuffering[sample];
                        break;
                    case 1:
                        nowBuffering[sample + insertSample] += otherNowBuffering[sample];
                        break;
                    default:
                        nowBuffering[sample + insertSample] = otherNowBuffering[sample];
                        break;
                }
            }
        }
    }

    attenuate(decibelValue = 0)
    {
        let amplitude = Utilities.DecibelsToAmplitude(decibelValue);

        for(let channel = 0; channel < this.numberOfChannels; channel++)
        {
            let nowBuffering = this.buffer.getChannelData(channel);

            for (let sample = 0; sample < this.buffer.length; sample++)
            {
                nowBuffering[sample] *= amplitude;
            }
        }
    }

    /**
     * Normalize buffer contents to specified range
     * @param min
     * @param max
     */
    normalize(min = 0, max = 1)
    {
        let range = min - max;
        let offset = min;
        let bufferArray = new IS_Array();
        let bufferArrayMax = 0;
        let bufferArrayMin = 0;
        let normalizedValue = 0;

        for (let channel= 0; channel < this.buffer.numberOfChannels; channel++)
        {
            bufferArray.value = this.buffer.getChannelData(channel);
            bufferArrayMax = bufferArray.max;
            bufferArrayMin = bufferArray.min;

            for (let sample= 0; sample < this.buffer.length; sample++)
            {
                normalizedValue = (bufferArray.value[sample] - bufferArrayMin) / (bufferArrayMax - bufferArrayMin);
                bufferArray.value[sample] = (range * normalizedValue) + offset;
            }
        }
    }

    /**
     *
     * @param windowSize
     */
    movingAverage(windowSize)
    {
        let newBuffers = [];
        let accumulator = 0;

        let hanningWindow = Math.round(windowSize * 0.5);

        for (let channel= 0; channel < this.buffer.numberOfChannels; channel++)
        {
            let nowBuffering = this.buffer.getChannelData(channel);
            newBuffers[channel] = new Float32Array(this.buffer.length);

            for (let sample= 0; sample < this.buffer.length; sample++)
            {
                for (let offset= 0; offset < windowSize; offset++)
                {
                    let index = (sample + offset) - hanningWindow;
                    if (index > 0)
                    {
                        accumulator += nowBuffering[index % this.buffer.length];
                    }
                    else if (index < 0)
                    {
                        accumulator += nowBuffering[this.buffer.length + index];
                    }
                }
                newBuffers[channel][sample] = accumulator / windowSize;
                accumulator = 0;
            }

            this.buffer.copyToChannel(newBuffers[channel], channel);
        }
    }

    /**
     * Reverse contents of buffer
     */
    reverse()
    {
        for(let channel= 0; channel < this.buffer.numberOfChannels; channel++)
        {
            let nowBuffering = this.buffer.getChannelData(channel);
            nowBuffering.reverse();
        }
    }

    /**
     * Reverse contents of a single channel
     * @param channel
     */
    reverseChannel(channel)
    {
        let nowBuffering = this.buffer.getChannelData(channel);
        nowBuffering.reverse();
    }

    /**
     * Move portion of buffer to another location
     * @param cropStartPercent
     * @param cropEndPercent
     * @param insertPercent
     */
    edit(cropStartPercent, cropEndPercent, insertPercent)
    {
        let cropStartSample = Math.round(this.buffer.length * cropStartPercent);
        let cropEndSample = Math.round(this.buffer.length * cropEndPercent);

        let cropLength = cropEndSample - cropStartSample;

        let newStartSample = Math.round(this.buffer.length * insertPercent);

        let cropArray = [];

        for (let channel= 0; channel < this.buffer.numberOfChannels; channel++)
        {
            let nowBuffering = this.buffer.getChannelData(channel);

            // crop the buffer values
            for (let cropSample= 0; cropSample < cropLength; cropSample++)
            {
                cropArray[cropSample] = nowBuffering[cropSample + cropStartSample];
            }

            // reinsert the cropped values at the new position
            for (let insertSample= 0; insertSample < cropLength; insertSample++)
            {
                if (insertSample + this.nSP <= nowBuffering.length)
                {
                    nowBuffering[insertSample + newStartSample] = cropArray[insertSample];
                }
            }
        }
    }

    channelMerge()
    {
        let nChannels = this._numberOfChannels;

        let tempBuffer = this._siblingContext.audioContext.createBuffer
        (
            nChannels, this._length, this._sampleRate
        );

        for(let channel = 0; channel < nChannels; channel++)
        {
            tempBuffer.copyToChannel
            (
                this._buffer.getChannelData(channel),
                nChannels - channel - 1
            );
        }

        for(let channel = 0; channel < nChannels; channel++)
        {
            let tempChannel = tempBuffer.getChannelData(channel);
            let nowBuffering = this._buffer.getChannelData(channel);

            for(let sample = 0; sample < this._length; sample++)
            {
                let currentMergeFactor = Math.abs(this._bufferShapeArray[sample]);

                let nowBufferingValue = nowBuffering[sample];
                let otherChannelValue = tempChannel[sample];

                let nowBufferingScaledAmplitude = nowBufferingValue * currentMergeFactor;
                let otherChannelScaledAmplitude = otherChannelValue * (1 - currentMergeFactor);

                let mergedValue = nowBufferingScaledAmplitude + otherChannelScaledAmplitude;

                if(!this._suspendOperation)
                {
                    nowBuffering[sample] = mergedValue;
                }
                else
                {
                    this._suspendedOperationsArray[sample] = mergedValue;
                }
            }
        }
    }

    /**
     * print the contents of a buffer as a graph in the browser console
     * @param channel
     * @param tag
     */
    print(channel = 0, tag)
    {
        if (tag)
        {
            console.log(tag)
        }

        let bufferData = new Float32Array(this.length);
        this.buffer.copyFromChannel(bufferData, channel, 0);

        for(let sample= 0; sample < bufferData.length; sample++)
        {
            bufferData[sample] = (0.5 * (100 + (Math.floor(bufferData[sample] * 100))));
        }

        BufferPrint.print(bufferData);
    }

    printSuspendedOperations(channel = 0, tag)
    {
        if (tag)
        {
            console.log(tag)
        }

        let bufferData = [...this._suspendedOperationsArray];

        for(let sample= 0; sample < bufferData.length; sample++)
        {
            bufferData[sample] = (0.5 * (100 + (Math.floor(bufferData[sample] * 100))));
        }

        BufferPrint.print(bufferData);
    }

    get preset()
    {
        return this._preset;
    }
}
