import { IS_Object } from "./IS_Object.js";
import { IS_Type } from "../enums/IS_Type.js";
import { IS_TWO_PI } from "../utilities/Constants.js";
import { IS_SAMPLE_MIN_VALUE } from "../utilities/Constants.js";
import { IS_Random } from "../utilities/IS_Random.js";
import { IS_Array } from "./IS_Array.js";
import { BufferPrint } from "../utilities/BufferPrint.js";
import { Utilities } from "../utilities/Utilities.js";

const IS_BufferParamNames =
{
    buffer: "buffer",
    numberOfChannels: "numberOfChannels",
    duration: "duration",
    length: "length",
    sampleRate: "sampleRate"
}

export class IS_Buffer extends IS_Object
{
    constructor(siblingContext, numberOfChannels = 1, duration = 1, sampleRate = null)
    {
        super(IS_Type.IS_Buffer);

        if(sampleRate === null)
        {
            sampleRate = siblingContext.sampleRate;
        }

        this.params = {};
        this.paramNames = IS_BufferParamNames;

        let lengthSamples = siblingContext.SecondsToSamples(duration, sampleRate);

        this.numberOfChannels = numberOfChannels;
        this.duration = duration;
        this.length = lengthSamples;
        this.sampleRate = sampleRate;

        this.bufferOperationsArray = new Float32Array(this.length);
        this.buffer = siblingContext.audioContext.createBuffer(numberOfChannels, lengthSamples, this.sampleRate);
    }

    /*
    Getters and Setters
     */

    /**
     *
     * @param key
     * @param value
     */
    setParam(key, value)
    {
        this.params[key] = value;
    }

    /**
     *
     * @param key
     * @returns {*}
     */
    getParam(key)
    {
        return this.params[key];
    }

    /**
     *
     * @returns {*}
     */
    get buffer()
    {
        return this.getParam(this.paramNames.buffer);
    }

    set buffer(buffer)
    {
        if(buffer.iSType !== undefined && buffer.iSType === IS_Type.IS_Buffer)
        {
            this.setParam(this.paramNames.buffer, buffer.buffer);
        }
        else
        {
            this.setParam(this.paramNames.buffer, buffer);
        }
    }

    /**
     *
     * @returns {*}
     */
    get duration()
    {
        return this.getParam(this.paramNames.duration);
    }

    /**
     *
     * @param value
     */
    set duration(value)
    {
        this.setParam(this.paramNames.duration, value);
    }

    /**
     *
     * @returns {*}
     */
    get length()
    {
        return this.getParam(this.paramNames.length);
    }

    /**
     *
     * @param value
     */
    set length(value)
    {
        this.setParam(this.paramNames.length, value);
    }

    /**
     *
     */
    get numberOfChannels()
    {
        return this.getParam(this.paramNames.numberOfChannels);
    }

    /**
     *
     * @param value
     */
    set numberOfChannels(value)
    {
        this.setParam(this.paramNames.numberOfChannels, value);
    }

    /**
     *
     * @returns {*}
     */
    get sampleRate()
    {
        return this.getParam(this.paramNames.sampleRate);
    }

    /**
     *
     * @param value
     */
    set sampleRate(value)
    {
        this.setParam(this.paramNames.sampleRate, value);
    }

    /*
    Buffer Operations
     */

    /**
     *
     * @param channel
     */
    // TODO: -1 = apply to all channels, and is default?
    fill(channel = -1)
    {
        if(channel !== -1)
        {
            this.fillChannel(channel);
        }
        else
        {
            for(let channel = 0; channel < this.numberOfChannels; channel++)
            {
                this.fillChannel(channel);
            }
        }
    }

    fillChannel(channel)
    {
        let nowBuffering = this.buffer.getChannelData(channel);

        for (let sample= 0; sample < this.buffer.length; sample++)
        {
            nowBuffering[sample] = this.bufferOperationsArray[sample];
        }
    }

    /**
     *
     * @param channel
     */
    add(channel = -1)
    {
        if(channel !== -1)
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
            nowBuffering[sample] += this.bufferOperationsArray[sample];
        }
    }

    /**
     *
     * @param channel
     */
    multiply(channel = -1)
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
            nowBuffering[sample] *= this.bufferOperationsArray[sample];
        }
    }

    /**
     *
     * @param channel
     */
    divide(channel = -1)
    {
        if(channel !== -1)
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
            nowBuffering[sample] /= this.bufferOperationsArray[sample];
        }
    }

    /**
     *
     * @param channel
     */
    subtract(channel = -1)
    {
        if(channel !== -1)
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
            nowBuffering[sample] -= this.bufferOperationsArray[sample];
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
                buffer[sample] += this.bufferOperationsArray[sample];
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
                buffer[sample] = this.bufferOperationsArray[sample - startSample];
            }
        }
    }

    /*
    Buffer "values"
     */

    amplitude(value)
    {
        for(let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            this.bufferOperationsArray[sample] *= value;
        }
        return this;
    }

    volume(value)
    {
        let amplitude = Utilities.DecibelsToAmplitude(value);

        for(let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            this.bufferOperationsArray[sample] *= amplitude;
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
        for(let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            this.bufferOperationsArray[sample] = value;
        }
        return this;
    }

    /**
     *
     * @returns {IS_Buffer}
     */
    impulse()
    {
        for(let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            this.bufferOperationsArray[sample] = sample === 0 ? 1 : 0;
        }
        return this;
    }

    /**
     *
     * @param frequency
     * @param amplitude
     * @returns {IS_Buffer}
     */
    sine(frequency = 1)
    {
        let time = 0;
        let value = 0;

        for(let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            time = sample / this.bufferOperationsArray.length;
            value = Math.sin(frequency * IS_TWO_PI * time);

            this.bufferOperationsArray[sample] = Math.abs(value) <= IS_SAMPLE_MIN_VALUE ? 0 : value;
        }
        return this;
    }

    /**
     *
     * @param frequency
     * @param amplitude
     * @returns {IS_Buffer}
     */
    unipolarSine(frequency = 1)
    {
        let time = 0;
        let value = 0;

        for (let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            time = sample / this.bufferOperationsArray.length;
            value = (( 0.5 * (Math.sin(frequency * IS_TWO_PI * time))) + 0.5);

            this.bufferOperationsArray[sample] = Math.abs(value) <= IS_SAMPLE_MIN_VALUE ? 0 : value;
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

        for (let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            value = sample / this.bufferOperationsArray.length;
            this.bufferOperationsArray[sample] = Math.pow(value, exponent);
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

        for (let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            value = 1 - (sample / this.bufferOperationsArray.length);
            this.bufferOperationsArray[sample] = Math.pow(value , exponent);
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
        let halfOperationsArrayLength = this.bufferOperationsArray.length * 0.5;
        let ascending = true;

        for (let sample=0; sample < this.bufferOperationsArray.length; sample++)
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

            this.bufferOperationsArray[sample] = Math.pow(value, exponent);
        }
        return this;
    }

    /**
     *
     * @returns {IS_Buffer}
     */
    noise()
    {
        for (let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            this.bufferOperationsArray[sample] = Math.random() * 2 - 1;
        }
        return this;
    }

    /**
     *
     * @returns {IS_Buffer}
     */
    unipolarNoise()
    {
        for (let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            this.bufferOperationsArray[sample] = Math.random();
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
        let transitionSampleIndex = this.bufferOperationsArray.length * dutyCycle;

        for (let sample=0; sample<this.bufferOperationsArray.length; sample++)
        {
            this.bufferOperationsArray[sample] = sample < transitionSampleIndex ? 1 : 0;
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
        let cycleStart = this.bufferOperationsArray.length * start;
        let cycleEnd = this.bufferOperationsArray.length * end;
        let inCycleBounds = false;

        for (let sample=0; sample<this.bufferOperationsArray.length; sample++)
        {
            inCycleBounds = sample >= cycleStart && sample >= cycleEnd;

            this.bufferOperationsArray[sample] = inCycleBounds ? 1 : 0;
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
    frequencyModulatedSine(carrierFrequency, modulatorFrequency, modulatorGain)
    {
        let progressPercent = 0;
        let value = 0;
        let time = 0;
        let modulatorAmplitude = 0;

        for (let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            progressPercent = sample / this.bufferOperationsArray.length;
            time = progressPercent * IS_TWO_PI;
            modulatorAmplitude = modulatorGain * Math.sin(modulatorFrequency * time);
            value = Math.sin((carrierFrequency + modulatorAmplitude) * time);

            this.bufferOperationsArray[sample] = Math.abs(value) <= IS_SAMPLE_MIN_VALUE ? 0 : value;
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
    amplitudeModulatedSine(carrierFrequency, modulatorFrequency, modulatorGain)
    {
        let progressPercent = 0;
        let value = 0;
        let time = 0;
        let modulatorAmplitude = 0;

        for (let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            progressPercent = sample / this.bufferOperationsArray.length;
            time = progressPercent * IS_TWO_PI;
            modulatorAmplitude = modulatorGain * Math.sin(modulatorFrequency * time);
            value = modulatorAmplitude * Math.sin(carrierFrequency * time);

            this.bufferOperationsArray[sample] = Math.abs(value) <= IS_SAMPLE_MIN_VALUE ? 0 : value;
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
        let nSamples = this.bufferOperationsArray.length;
        let mod = nSamples / quantizationValue;
        let modVal = 0;
        let value = 0;

        let j = 0;

        for (let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            modVal = sample % mod;

            if(modVal === 0)
            {
                value = valueArray[j % valueArray.length];
                j++;
            }

            this.bufferOperationsArray[sample] = value;
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

        let rampStart = Math.round(this.bufferOperationsArray.length * startPercent);
        let rampEnd = Math.round(this.bufferOperationsArray.length * endPercent);

        let rampLength = rampEnd - rampStart;

        let upLength = Math.round( upEnd * rampLength );
        let downLength = Math.round(rampLength - (rampLength * downStart));

        let upPoint = rampStart + upLength;
        let downPoint = rampEnd - downLength;

        let value = 0;

        for (let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            switch(true)
            {
                case (sample < rampStart || sample >= rampEnd):
                    this.bufferOperationsArray[sample] = 0;
                    break;
                case (sample >= rampStart && sample <= upPoint):
                    value = (sample - rampStart) / upLength;
                    this.bufferOperationsArray[sample] = Math.pow(value, upExp);
                    break;
                case (sample > upPoint && sample < downPoint):
                    this.bufferOperationsArray = 1;
                    break;
                case (sample >= downPoint && sample < rampEnd):
                    value = 1 - ((sample - downPoint) / downLength);
                    this.bufferOperationsArray[sample] = Math.pow(value , downExp);
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

        for(let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            this.bufferOperationsArray[sample] = nowBuffering[sample];
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

        for (let sample= 0; sample < this.bufferOperationsArray.length; sample++)
        {
            this.bufferOperationsArray[sample] = nowBuffering[sample];
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

            let shorterBufferLength = nowBuffering < otherNowBuffering ? nowBuffering : otherNowBuffering;

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

            let shorterBufferLength = nowBuffering < otherNowBuffering ? nowBuffering : otherNowBuffering;

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

            let shorterBufferLength = nowBuffering < otherNowBuffering ? nowBuffering : otherNowBuffering;

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

    insertBuffer(buffer, insertPercent)
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
                nowBuffering[sample + insertSample] = otherNowBuffering[sample];
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

        for (let channel=0; channel < this.buffer.numberOfChannels; channel++)
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
}
