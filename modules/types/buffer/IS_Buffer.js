import { IS_Object } from "../IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";
import { IS_TWO_PI } from "../../utilities/Constants.js";
import { IS_SAMPLE_MIN_VALUE } from "../../utilities/Constants.js";
import { IS_Random } from "../../utilities/IS_Random.js";
import { IS_Array } from "../array/IS_Array.js";
import { BufferPrint } from "../../utilities/BufferPrint.js";
import { Utilities } from "../../utilities/Utilities.js";
import { IS_BufferPresets } from "../../presets/IS_BufferPresets.js";

export class IS_Buffer extends IS_Object
{
    constructor(siblingContext, numberOfChannels = 1, duration = 1, sampleRate = null)
    {
        super(IS_Type.IS_Buffer);

        if(sampleRate === null)
        {
            sampleRate = siblingContext.sampleRate;
        }

        let lengthSamples = siblingContext.SecondsToSamples(duration, sampleRate);

        this._numberOfChannels = numberOfChannels;
        this._duration = duration;
        this._length = lengthSamples;
        this._sampleRate = sampleRate;

        this._bufferShapeArray = new Float32Array(this.length);
        this._suspendedOperationsArray = new Float32Array(this.length);
        this.buffer = siblingContext.audioContext.createBuffer(numberOfChannels, lengthSamples, this.sampleRate);

        this._preset = new IS_BufferPresets(this);

        this._suspendOperation = false;
    }

    /**
     *
     * @returns {*}
     */
    get buffer()
    {
        return this._buffer;
    }

    set buffer(buffer)
    {
        if(buffer.iSType !== undefined && buffer.iSType === IS_Type.IS_Buffer)
        {
            this._buffer = buffer.buffer;
        }
        else
        {
            this._buffer = buffer;
        }
    }

    /**
     *
     * @returns {*}
     */
    get duration()
    {
        return this._duration;
    }

    /**
     *
     * @param value
     */
    set duration(value)
    {
        this._duration = value;
        this.buffer.duration = this._duration;
    }

    /**
     *
     * @returns {*}
     */
    get length()
    {
        return this._length;
    }

    /**
     *
     * @param value
     */
    set length(value)
    {
        this._length = value;
        this.buffer.length = this._length;
    }

    /**
     *
     */
    get numberOfChannels()
    {
        return this._numberOfChannels;
    }

    /**
     *
     * @param value
     */
    set numberOfChannels(value)
    {
        this._numberOfChannels = value;
        this.buffer.numberOfChannels = this._numberOfChannels;
    }

    /**
     *
     * @returns {*}
     */
    get sampleRate()
    {
        return this._sampleRate;
    }

    /**
     *
     * @param value
     */
    set sampleRate(value)
    {
        this._sampleRate = value;
        this.buffer.sampleRate = this._sampleRate;
    }

    /*
    buffer Operations
     */

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
        this._suspendedOperationsArray = new Float32Array(this.length);
        this._suspendOperation = false;
        return this;
    }

    clear(channel = null)
    {
        if(channel !== null)
        {
            this.clearChannel(channel);
        }
        else
        {
            for(let channel = 0; channel < this.numberOfChannels; channel++)
            {
                this.clearChannel(channel);
            }
        }
    }

    clearChannel(channel)
    {
        let nowBuffering = this.buffer.getChannelData(channel);

        for (let sample= 0; sample < this.buffer.length; sample++)
        {
            nowBuffering[sample] = 0;
        }
    }

    /**
     *
     * @param channel
     */
    add(channel = null)
    {
        if(channel !== null)
        {
            this.addChannel(channel);
        }
        else
        {
            for(let channel = 0; channel < this.numberOfChannels; channel++)
            {
                this.addChannel(channel);
            }
        }
    }

    addChannel(channel)
    {
        let nowBuffering = this.buffer.getChannelData(channel);

        for (let sample= 0; sample < this.buffer.length; sample++)
        {
            if(!this._suspendOperation)
            {
                nowBuffering[sample] += this._bufferShapeArray[sample];
            }
            else
            {
                this._suspendedOperationsArray[sample] += this._bufferShapeArray[sample];
            }
        }
    }

    /**
     *
     * @param channel
     */
    multiply(channel = null)
    {
        if(channel !== -1)
        {
            this.multiplyChannel(channel);
        }
        else
        {
            for(let channel = 0; channel < this.numberOfChannels; channel++)
            {
                this.multiplyChannel(channel);
            }
        }
    }

    multiplyChannel(channel)
    {
        let nowBuffering = this.buffer.getChannelData(channel);

        for (let sample= 0; sample < this.buffer.length; sample++)
        {
            if(!this._suspendOperation)
            {
                nowBuffering[sample] *= this._bufferShapeArray[sample];
            }
            else
            {
                this._suspendedOperationsArray[sample] *= this._bufferShapeArray[sample];
            }
        }
    }

    /**
     *
     * @param channel
     */
    divide(channel = null)
    {
        if(channel !== null)
        {
            this.divideChannel(channel);
        }
        else
        {
            for(let channel = 0; channel < this.numberOfChannels; channel++)
            {
                this.divideChannel(channel);
            }
        }
    }

    divideChannel(channel)
    {
        let nowBuffering = this.buffer.getChannelData(channel);

        for (let sample= 0; sample < this.buffer.length; sample++)
        {
            if(!this._suspendOperation)
            {
                nowBuffering[sample] /= this._bufferShapeArray[sample];
            }
            else
            {
                this._suspendedOperationsArray[sample] /= this._bufferShapeArray[sample];
            }
        }
    }

    /**
     *
     * @param channel
     */
    subtract(channel = null)
    {
        if(channel !== null)
        {
            this.subtractChannel(channel);
        }
        else
        {
            for(let channel = 0; channel < this.numberOfChannels; channel++)
            {
                this.subtractChannel(channel);
            }
        }
    }

    subtractChannel(channel)
    {
        let nowBuffering = this.buffer.getChannelData(channel);

        for (let sample= 0; sample < this.buffer.length; sample++)
        {
            if(!this._suspendOperation)
            {
                nowBuffering[sample] -= this._bufferShapeArray[sample];
            }
            else
            {
                this._suspendedOperationsArray[sample] -= this._bufferShapeArray[sample];
            }
        }
    }

    /**
     *
     * @param channel
     * @param startPercent
     * @param endPercent
     * @param style
     */
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

    /**
     *
     * @param value
     * @returns {IS_Buffer}
     */
    constant(value)
    {
        for(let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            this._bufferShapeArray[sample] = value;
        }
        return this;
    }

    /**
     *
     * @returns {IS_Buffer}
     */
    impulse()
    {
        for(let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            this._bufferShapeArray[sample] = sample === 0 ? 1 : 0;
        }
        return this;
    }

    /**
     *
     * @param frequency
     * @param amplitude
     * @returns {IS_Buffer}
     */
    sine(frequency, normalize = true)
    {
        let time = 0;
        let frequencies = Array.isArray(frequency) ? frequency : [frequency];
        let nFrequencies = frequencies.length;

        for(let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            let value = 0;
            time = sample / this._bufferShapeArray.length;

            for(let frequency = 0; frequency < nFrequencies; frequency++)
            {
                value += Math.sin(frequencies[frequency] * IS_TWO_PI * time);
            }

            if(normalize)
            {
                value /= nFrequencies;
            }

            this._bufferShapeArray[sample] = Math.abs(value) <= IS_SAMPLE_MIN_VALUE ? 0 : value;
        }
        return this;
    }

    /**
     *
     * @param frequency
     * @param amplitude
     * @returns {IS_Buffer}
     */
    unipolarSine(frequency, normalize = true)
    {
        let time = 0;
        let value = 0;
        let frequencies = Array.isArray(frequency) ? frequency : [frequency];
        let nFrequencies = frequencies.length;

        for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            time = sample / this._bufferShapeArray.length;

            for(let frequency = 0; frequency < nFrequencies; frequency++)
            {
                value += (( 0.5 * (Math.sin(frequencies[frequency] * IS_TWO_PI * time))) + 0.5);
            }

            if(normalize)
            {
                value /= nFrequencies;
            }

            this._bufferShapeArray[sample] = Math.abs(value) <= IS_SAMPLE_MIN_VALUE ? 0 : value;
        }
        return this;
    }

    /**
     *
     * @param exponent
     * @returns {IS_Buffer}
     */
    sawtooth(exponent = 1)
    {
        let value = 0;

        for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            value = sample / this._bufferShapeArray.length;
            this._bufferShapeArray[sample] = Math.pow(value, exponent);
        }
        return this;
    }

    /**
     *
     * @param exponent
     * @returns {IS_Buffer}
     */
    inverseSawtooth(exponent = 1)
    {
        let value = 0;

        for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            value = 1 - (sample / this._bufferShapeArray.length);
            this._bufferShapeArray[sample] = Math.pow(value , exponent);
        }
        return this;
    }

    /**
     *
     * @param exponent
     * @returns {IS_Buffer}
     */
    triangle(exponent = 1)
    {
        let value = 0;
        let halfOperationsArrayLength = this._bufferShapeArray.length * 0.5;
        let ascending = true;

        for (let sample=0; sample < this._bufferShapeArray.length; sample++)
        {
            ascending = sample <= halfOperationsArrayLength;

            if(ascending)
            {
                value = sample / halfOperationsArrayLength;
            }
            else
            {
                value = 1 - ((sample - (halfOperationsArrayLength)) / (halfOperationsArrayLength));
            }

            this._bufferShapeArray[sample] = Math.pow(value, exponent);
        }
        return this;
    }

    /**
     *
     * @returns {IS_Buffer}
     */
    noise()
    {
        for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            this._bufferShapeArray[sample] = Math.random() * 2 - 1;
        }
        return this;
    }

    /**
     *
     * @returns {IS_Buffer}
     */
    unipolarNoise()
    {
        for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            this._bufferShapeArray[sample] = Math.random();
        }
        return this;
    }

    /**
     *
     * @param dutyCycle
     * @returns {IS_Buffer}
     */
    square(dutyCycle)
    {
        let transitionSampleIndex = this._bufferShapeArray.length * dutyCycle;

        for (let sample=0; sample<this._bufferShapeArray.length; sample++)
        {
            this._bufferShapeArray[sample] = sample < transitionSampleIndex ? 1 : 0;
        }
        return this;
    }

    /**
     *
     * @param start
     * @param end
     * @returns {IS_Buffer}
     */
    floatingCycleSquare(start, end)
    {
        let cycleStart = this._bufferShapeArray.length * start;
        let cycleEnd = this._bufferShapeArray.length * end;
        let inCycleBounds = false;

        for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            inCycleBounds = sample >= cycleStart && sample <= cycleEnd;

            this._bufferShapeArray[sample] = inCycleBounds ? 1 : 0;
        }
        return this;
    }

    /**
     *
     * @param carrierFrequency
     * @param modulatorFrequency
     * @param modulatorGain
     * @returns {IS_Buffer}
     */
    frequencyModulatedSine(carrierFrequency, modulatorFrequency, modulatorGain, normalize = true)
    {
        let carrierFrequencyArray = Array.isArray(carrierFrequency) ? carrierFrequency : [carrierFrequency];
        let modulatorFrequencyArray = Array.isArray(modulatorFrequency) ? modulatorFrequency : [modulatorFrequency];
        let modulatorGainArray = Array.isArray(modulatorGain) ? modulatorGain : [modulatorGain];

        let nCarrierFrequencies = carrierFrequencyArray.length;
        let nModulatorFrequences = modulatorFrequencyArray.length;
        let nModulatorGains = modulatorGainArray.length;

        let longestArrayLength = Math.max(nCarrierFrequencies, nModulatorFrequences, nModulatorGains);

        let progressPercent = 0;
        let time = 0;

        for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            let value = 0;

            progressPercent = sample / this._bufferShapeArray.length;
            time = progressPercent * IS_TWO_PI;

            for (let i = 0; i < longestArrayLength; i++)
            {
                let modulatorGain = modulatorGainArray[i % nModulatorGains];
                let modulatorFrequency = modulatorFrequencyArray[i % nModulatorFrequences];
                let carrierFrequency = carrierFrequencyArray[i %nCarrierFrequencies];

                let modulatorAmplitude = modulatorGain * Math.sin(modulatorFrequency * time);
                value += Math.sin((carrierFrequency + modulatorAmplitude) * time);
            }

            if (normalize)
            {
                value /= longestArrayLength;
            }

            this._bufferShapeArray[sample] = Math.abs(value) <= IS_SAMPLE_MIN_VALUE ? 0 : value;
        }
        return this;
    }

    /**
     *
     * @param carrierFrequency
     * @param modulatorFrequency
     * @param modulatorGain
     * @returns {IS_Buffer}
     */
    amplitudeModulatedSine(carrierFrequency, modulatorFrequency, modulatorGain, normalize = true)
    {
        let carrierFrequencyArray = Array.isArray(carrierFrequency) ? carrierFrequency : [carrierFrequency];
        let modulatorFrequencyArray = Array.isArray(modulatorFrequency) ? modulatorFrequency : [modulatorFrequency];
        let modulatorGainArray = Array.isArray(modulatorGain) ? modulatorGain : [modulatorGain];

        let nCarrierFrequencies = carrierFrequencyArray.length;
        let nModulatorFrequences = modulatorFrequencyArray.length;
        let nModulatorGains = modulatorGainArray.length;

        let longestArrayLength = Math.max(nCarrierFrequencies, nModulatorFrequences, nModulatorGains);

        let progressPercent = 0;
        let time = 0;

        for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            let value = 0;

            progressPercent = sample / this._bufferShapeArray.length;
            time = progressPercent * IS_TWO_PI;

            for (let i = 0; i < longestArrayLength; i++)
            {
                let modulatorGain = modulatorGainArray[i % nModulatorGains];
                let modulatorFrequency = modulatorFrequencyArray[i % nModulatorFrequences];
                let carrierFrequency = carrierFrequencyArray[i %nCarrierFrequencies];

                let modulatorAmplitude = modulatorGain * Math.sin(modulatorFrequency * time);
                value += modulatorAmplitude * Math.sin(carrierFrequency * time);
            }

            if (normalize)
            {
                value /= longestArrayLength;
            }

            this._bufferShapeArray[sample] = Math.abs(value) <= IS_SAMPLE_MIN_VALUE ? 0 : value;
        }
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
        let nSamples = this._bufferShapeArray.length;
        let mod = nSamples / quantizationValue;
        let modVal = 0;
        let value = 0;

        let j = 0;

        for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            modVal = sample % mod;

            if(modVal === 0)
            {
                value = valueArray[j % valueArray.length];
                j++;
            }

            this._bufferShapeArray[sample] = value;
        }
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
    ramp(startPercent = 0, endPercent = 1,
         upEnd = 0.5, downStart = 0.5,
         upExp = 1, downExp = 1)
    {

        let rampStart = Math.round(this._bufferShapeArray.length * startPercent);
        let rampEnd = Math.round(this._bufferShapeArray.length * endPercent);

        let rampLength = rampEnd - rampStart;

        let upLength = Math.round( upEnd * rampLength );
        let downLength = Math.round(rampLength - (rampLength * downStart));

        let upPoint = rampStart + upLength;
        let downPoint = rampEnd - downLength;

        let value = 0;

        for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            switch(true)
            {
                case (sample < rampStart || sample >= rampEnd):
                    this._bufferShapeArray[sample] = 0;
                    break;
                case (sample >= rampStart && sample <= upPoint):
                    value = (sample - rampStart) / upLength;
                    this._bufferShapeArray[sample] = Math.pow(value, upExp);
                    break;
                case (sample > upPoint && sample < downPoint):
                    this._bufferShapeArray[sample] = 1;
                    break;
                case (sample >= downPoint && sample < rampEnd):
                    value = 1 - ((sample - downPoint) / downLength);
                    this._bufferShapeArray[sample] = Math.pow(value , downExp);
                    break;
                default:
                    break;
            }
        }
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
    noiseBand(carrierFrequency, bandwidth, tuningMin, tuningMax, amplitudeMin, amplitudeMax)
    {
        let halfBand = Math.round(bandwidth * 0.5);

        let bandBuffer = new IS_Buffer(this.siblingContext, this.numberOfChannels, this.length);

        let frequency = 0;
        let amplitude = 0;

        for(let i= 0; i < bandwidth; i++)
        {
            frequency = (carrierFrequency + i) - halfBand;
            amplitude = IS_Random.randomFloat(amplitudeMin, amplitudeMax);

            bandBuffer.sine(frequency * IS_Random.randomFloat(tuningMin, tuningMax), amplitude).add();
        }

        let nowBuffering = bandBuffer.buffer.getChannelData(0);

        for(let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            this._bufferShapeArray[sample] = nowBuffering[sample];
        }
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
    rampBand(centerFrequency, bandwidth, upHarmonics, midHarmonics, downHarmonics, upTuningRange, midTuningRange,
             downTuningRange, upEnd, downStart, upExponent, downExponent, upRange, midRange, downRange)
    {
        let halfBandwidth = Math.round( bandwidth * 0.5 );

        let upPoint = Math.round(bandwidth * upEnd);
        let downPoint = Math.round(bandwidth * downStart);

        let upLength = upPoint;
        let downLength = bandwidth - downPoint;

        let bandBottomFrequency = centerFrequency - halfBandwidth;

        let bandBuffer = new IS_Buffer(this.siblingContext, this.numberOfChannels, this.length);

        let frequencyIncrement = 0;
        let noiseFrequency = 0;
        let amplitude = 0;

        let randomValue = 0;
        let rampValue = 0;

        let upHarmonicsArray = new IS_Array(upHarmonics);
        let midHarmonicsArray = new IS_Array(midHarmonics);
        let downHarmonicsArray = new IS_Array(downHarmonics);

        for (let i= 0; i < bandwidth; i++)
        {
            frequencyIncrement = bandBottomFrequency + i;

            switch (true)
            {
                case (i <= upPoint):
                    randomValue = IS_Random.randomFloat(upRange[0], upRange[1]);
                    rampValue = Math.pow(i / upLength , upExponent);
                    amplitude = rampValue * randomValue;
                    noiseFrequency = frequencyIncrement * upHarmonicsArray.random() *
                        IS_Random.randomFloat(upTuningRange[0], upTuningRange[1]);
                    bandBuffer.sine(noiseFrequency, amplitude).add();
                    break;
                case (i > upPoint && i < downPoint):
                    amplitude = IS_Random.randomFloat(midRange[0], midRange[1]);
                    noiseFrequency = frequencyIncrement * midHarmonicsArray.random() *
                        IS_Random.randomFloat(midTuningRange[0], midTuningRange[1]);
                    bandBuffer.sine( noiseFrequency, amplitude).add();
                    break;
                case (i >= downPoint):
                    randomValue = IS_Random.randomFloat(downRange[0], downRange[1]);
                    rampValue = Math.pow(1 - ((i - downPoint) / downLength), downExponent);
                    amplitude = rampValue * randomValue;
                    noiseFrequency = frequencyIncrement * downHarmonicsArray.random() *
                        IS_Random.randomFloat(downTuningRange[0], downTuningRange[1]);
                    bandBuffer.sine(noiseFrequency, amplitude).add();
                    break;
                default:
                    break;
            }
        }

        let nowBuffering = bandBuffer.buffer.getChannelData(0);

        for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
        {
            this._bufferShapeArray[sample] = nowBuffering[sample];
        }

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
