import { IS_Object } from "../IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";
import { IS_Random } from "../../utilities/IS_Random.js";
import { IS_Array } from "../array/IS_Array.js";
import { BufferPrint } from "../../utilities/BufferPrint.js";
import { Utilities } from "../../utilities/Utilities.js";
import { IS_BufferPresets } from "../../presets/IS_BufferPresets.js";
import { IS_BufferOperationManager } from "./operation/IS_BufferOperationManager.js";
import { IS_BufferOperationRequestData } from "./operation/IS_BufferOperationRequestData.js";
import { IS_BufferFunctionData } from "./operation/function/IS_BufferFunctionData.js";
import { IS_BufferFunctionType } from "./operation/function/IS_BufferFunctionType.js";
import { IS_BufferOperatorType } from "./operation/IS_BufferOperatorType.js"

// TODO: SmoothClip

export class IS_Buffer extends IS_Object
{
    constructor(siblingContext, numberOfChannels = 1, duration = 1, sampleRate = null)
    {
        super(IS_Type.IS_Data.IS_Buffer);

        if (sampleRate === null)
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

        this._operationRequestData = new IS_BufferOperationRequestData();
        this._operationRequestData.bufferLength = this._sampleRate;
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

    _requestOperation()
    {
        let operationRequestData = new IS_BufferOperationRequestData
        (
            this._operationRequestData.operatorType,
            this._operationRequestData.functionData,
            this._buffer.getChannelData(0),
            this._uuid
        );

        IS_BufferOperationManager.requestOperation(this, operationRequestData);
    }

    _setOperationRequestOperatorData(iSBufferOperatorType)
    {
        this._operationRequestData.operatorType = iSBufferOperatorType;
    }

    _setOperationRequestFunctionData(iSBufferFunctionType, ...args)
    {
        this._operationRequestData.functionData = new IS_BufferFunctionData
        (
            iSBufferFunctionType, ...args
        );
    }

    // OPERATION SUSPENSION
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

    _handleOperatorMethod(iSBufferOperatorType)
    {
        this._setOperationRequestOperatorData(iSBufferOperatorType);
        this._requestOperation();
    }

    add(buffer = null)
    {
        if (buffer === null)
        {
            this._handleOperatorMethod(IS_BufferOperatorType.Add);
        }
        else
        {
            this._handleBufferMath(IS_BufferOperatorType.Add, buffer);
        }
    }

    multiply(buffer = null)
    {
        if (buffer === null)
        {
            this._handleOperatorMethod(IS_BufferOperatorType.Multiply);
        }
        else
        {
            this._handleBufferMath(IS_BufferOperatorType.Multiply, buffer);
        }
    }

    divide(buffer = null)
    {
        if (buffer === null)
        {
            this._handleOperatorMethod(IS_BufferOperatorType.Divide);
        }
        else
        {
            this._handleBufferMath(IS_BufferOperatorType.Divide, buffer);
        }
    }

    subtract(buffer = null)
    {
        if (buffer === null)
        {
            this._handleOperatorMethod(IS_BufferOperatorType.Subtract);
        }
        else
        {
            this._handleBufferMath(IS_BufferOperatorType.Subtract, buffer);
        }
    }

    _handleBufferMath(iSBufferOperatorType, buffer)
    {
        let otherBuffer = buffer.isBuffer ? buffer.buffer : buffer;
        let nowBuffering = null;
        let otherNowBuffering = null;

        for (let channel= 0; channel < this.numberOfChannels; channel++)
        {
            nowBuffering = this.buffer.getChannelData(channel);
            otherNowBuffering = otherBuffer.getChannelData(channel);

            let shorterBufferLength = nowBuffering < otherNowBuffering ?
                nowBuffering.length : otherNowBuffering.length;

            for (let sample= 0; sample < shorterBufferLength; sample++)
            {
                switch(iSBufferOperatorType)
                {
                    case (IS_BufferOperatorType.Add):
                        nowBuffering[sample] += otherNowBuffering[sample];
                        break;
                    case (IS_BufferOperatorType.Multiply):
                        nowBuffering[sample] -= otherNowBuffering[sample];
                        break;
                    case (IS_BufferOperatorType.Divide):
                        nowBuffering[sample] /= otherNowBuffering[sample];
                        break;
                    case (IS_BufferOperatorType.Subtract):
                        nowBuffering[sample] -= otherNowBuffering[sample];
                        break;
                    default:
                        break;
                }
            }
        }
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

    // TODO: IS_FunctionWorker that caches arguments and carries out the sample calculation loop
    // FUNCTIONS
    constant(value)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Constant, value
        );

        return this;
    }

    impulse()
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Impulse, null
        );

        return this;
    }

    sawtooth(exponent = 1)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Sawtooth, exponent
        );

        return this;
    }

    inverseSawtooth(exponent = 1)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.InverseSawtooth, exponent
        );

        return this;
    }

    triangle(exponent = 1)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Triangle, exponent
        );

        return this;
    }

    noise()
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Noise, null
        );

        return this;
    }

    unipolarNoise()
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Noise, null
        );

        return this;
    }

    square(dutyCycle = 0.5)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Square, dutyCycle
        );

        return this;
    }

    pulse(startPercent = 0.5, endPercent= 1.0)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Pulse,
            startPercent, endPercent
        );

        return this;
    }

    sine(frequency)
    {
        // TODO: dealing with multiple frequencies
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Sine, frequency
        );

        return this;
    }

    unipolarSine(frequency)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.UnipolarSine, frequency
        );

        return this;
    }

    frequencyModulatedSine(carrierFrequency, modulatorFrequency, modulatorGain)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.FrequencyModulatedSine,
            carrierFrequency, modulatorFrequency, modulatorGain
        );

        return this;
    }

    amplitudeModulatedSine(carrierFrequency, modulatorFrequency, modulatorGain)
    {
        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.AmplitudeModulatedSine,
            carrierFrequency, modulatorFrequency, modulatorGain
        );

        return this;
    }

    quantizedArrayBuffer(valueArray, quantizationValue = null)
    {
        let quantization = quantizationValue !== null ? quantizationValue : valueArray.length;

        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.QuantizedArrayBuffer, valueArray, quantization
        );

        return this;
    }

    ramp
    (
        startPercent = 0, endPercent = 1,
        upEndPercent = 0.5, downStartPercent = null,
        upExponent = 1, downExponent = 1
    )
    {
        let rampStart = startPercent;
        let rampEnd = endPercent;

        let rampLength = endPercent - startPercent;

        let upLength = (rampLength * upEndPercent);
        let upEnd = rampStart + upLength;

        downStartPercent = downStartPercent !== null ? downStartPercent : upEndPercent;

        let downLength = rampLength - (rampLength * downStartPercent);
        let downStart = rampStart + (rampLength - downLength);

        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.Ramp,
            rampStart, rampEnd,
            upEnd, upLength,
            downStart, downLength,
            upExponent, downExponent
        );

        return this;
    }

    noiseBand
    (
        centerFrequency, bandwidth,
        amplitudeMin = 0, amplitudeMax = 1,
        tuningMin = 1, tuningMax = 1
    )
    {
        let frequencies = [];
        let amplitudes = [];

        let halfBand = Math.round(bandwidth * 0.5);
        let bottomFrequency = centerFrequency - halfBand;

        for(let frequencyIndex = 0; frequencyIndex < bandwidth; frequencyIndex++)
        {
            let frequency = bottomFrequency + frequencyIndex;
            let tuning = IS_Random.randomFloat(tuningMin, tuningMax);

            frequencies.push(frequency * tuning);
            amplitudes.push(IS_Random.randomFloat(amplitudeMin, amplitudeMax));
        }

        let frequencyData = [];
        frequencyData.push(frequencies, amplitudes);

        this._setOperationRequestFunctionData
        (
            IS_BufferFunctionType.NoiseBand, frequencyData
        );

        return this;
    }

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

        if (buffer.iSType !== undefined && buffer.iSType === IS_Type.IS_Buffer)
        {
            otherBuffer = buffer.buffer;
        } else
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
                switch (writeMode)
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

    // UTILITY
    amplitude(value)
    {
        this._setOperationRequestFunctionData(IS_BufferFunctionType.Constant, value);
        this._setOperationRequestOperatorData(IS_BufferOperatorType.Multiply);
        this._requestOperation();
    }

    volume(value)
    {
        let amplitude = Utilities.DecibelsToAmplitude(value);

        this._setOperationRequestFunctionData(IS_BufferFunctionType.Constant, amplitude);
        this._setOperationRequestOperatorData(IS_BufferOperatorType.Multiply);
        this._requestOperation();
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
