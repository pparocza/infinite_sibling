import { IS_BufferFunctionData } from "./IS_BufferFunctionData.js";
import { IS_BufferFunctionType } from "./IS_BufferFunctionType.js";
import {IS_BufferOperatorType} from "../IS_BufferOperatorType";
import {IS_SAMPLE_MIN_VALUE, IS_TWO_PI} from "../../../../utilities/Constants";
import {IS_Random} from "../../../../utilities/IS_Random";
import {IS_Array} from "../../../array/IS_Array";

export const IS_BufferFunction =
{
	Constant(value)
	{
		return new IS_BufferFunctionData
		(
			IS_BufferFunctionType.Constant, value
		);
	},

	Sine(frequency)
	{
		return new IS_BufferFunctionData
		(
			IS_BufferFunctionType.Sine, frequency
		);
	},

	FrequencyModulatedSine(carrierFrequency, modulatorFrequency, modulatorGain)
	{
		return new IS_BufferFunctionData
		(
			IS_BufferFunctionType.FrequencyModulatedSine,
			carrierFrequency, modulatorFrequency, modulatorGain
		);
	},
}

/*
sine(frequency)
{
	let time = 0;
	let frequencies = Array.isArray(frequency) ? frequency : [frequency];
	let nFrequencies = frequencies.length;
	let normalizeFactor = 1 / nFrequencies;

	this._initializeFastSine(frequencies);

	for(let sampleIndex = 0; sampleIndex < this.length; sampleIndex++)
	{
		let value = 0;

		for(let frequencyIndex = 0; frequencyIndex < nFrequencies; frequencyIndex++)
		{
			let frequency = frequencies[frequencyIndex];
			value += this._fastSine(frequency, frequencyIndex, time);
		}

		if (normalize)
		{
			value *= normalizeFactor;
		}

		this._bufferShapeArray[sampleIndex] = this._zeroClamp(value);

		time += this._timeIncrement;
	}
}

*/

/*
add(channel = null)
{
	if(channel !== null)
	{
		this.addChannel(channel);
	}
	else
	{
		for(let channel = 0; channel < this._numberOfChannels; channel++)
		{
			this.addChannel(channel);
		}
	}

	this._operationRequestData.operatorType = IS_BufferOperatorType.Add;
	this._requestOperation();
}

addChannel(channel)
{
	let nowBuffering = this._buffer.getChannelData(channel);

	for (let sample= 0; sample < this._length; sample++)
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
*/

/*

/!**
 *
 * @param value
 * @returns {IS_Buffer}
 *!/
constant(value)
{
	for(let sample= 0; sample < this._bufferShapeArray.length; sample++)
	{
		this._bufferShapeArray[sample] = value;
	}
	return this;
}

/!**
 *
 * @returns {IS_Buffer}
 *!/
impulse()
{
	for(let sample= 0; sample < this._bufferShapeArray.length; sample++)
	{
		this._bufferShapeArray[sample] = sample === 0 ? 1 : 0;
	}
	return this;
}

/!**
 *
 * @param exponent
 * @returns {IS_Buffer}
 *!/
sawtooth(exponent = 1)
{
	let value = 0;

	for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
	{
		this._bufferShapeArray[sample] = Math.pow(value, exponent);
		value += this._timeIncrement;
	}
	return this;
}

/!**
 *
 * @param exponent
 * @returns {IS_Buffer}
 *!/
inverseSawtooth(exponent = 1)
{
	let value = 1;

	for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
	{
		this._bufferShapeArray[sample] = Math.pow(value , exponent);
		value -= this._timeIncrement;
	}
	return this;
}

/!**
 *
 * @param exponent
 * @returns {IS_Buffer}
 *!/
triangle(exponent = 1)
{
	let value = 0;
	let halfOperationsArrayLength = this._bufferShapeArray.length * 0.5;
	let timeIncrement = 1 / halfOperationsArrayLength;
	let ascending = true;

	for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
	{
		ascending = sample <= halfOperationsArrayLength;

		this._bufferShapeArray[sample] = Math.pow(value, exponent);

		if(ascending)
		{
			value += timeIncrement;
		}
		else
		{
			value -= timeIncrement;
		}
	}
	return this;
}

/!**
 *
 * @returns {IS_Buffer}
 *!/
noise()
{
	for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
	{
		this._bufferShapeArray[sample] = Math.random() * 2 - 1;
	}
	return this;
}

/!**
 *
 * @returns {IS_Buffer}
 *!/
unipolarNoise()
{
	for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
	{
		this._bufferShapeArray[sample] = Math.random();
	}
	return this;
}

/!**
 *
 * @param dutyCycle
 * @returns {IS_Buffer}
 *!/
square(dutyCycle)
{
	let transitionSampleIndex = this._bufferShapeArray.length * dutyCycle;

	for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
	{
		this._bufferShapeArray[sample] = sample < transitionSampleIndex ? 1 : 0;
	}
	return this;
}

/!**
 *
 * @param start
 * @param end
 * @returns {IS_Buffer}
 *!/
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

// TODO: replace all Math.sin with direct-form digital resonator? (Synths w/ JUCE in C++ pg. 120)
/!**
 *
 * @param frequency
 * @param amplitude
 * @returns {IS_Buffer}
 *!/
sine(frequency, normalize = true)
{
	// TODO: dealing with multiple frequencies
	this._operationRequestData.functionData = new IS_BufferFunctionData(IS_BufferFunctionType.Sine, frequency);

	return this;
}

/!**
 *
 * @param frequency
 * @param amplitude
 * @returns {IS_Buffer}
 *!/
unipolarSine(frequency, normalize = true)
{
	let time = 0;
	let frequencies = Array.isArray(frequency) ? frequency : [frequency];
	let nFrequencies = frequencies.length;
	let normalizeFactor = 1 / nFrequencies;

	this._initializeFastSine(frequencies);

	for(let sampleIndex = 0; sampleIndex < this.length; sampleIndex++)
	{
		let value = 0;

		for (let frequencyIndex = 0; frequencyIndex < nFrequencies; frequencyIndex++)
		{
			let frequency = frequencies[frequencyIndex];
			value += this._fastSine(frequency, frequencyIndex, time);
		}

		value = 0.5 * value + 0.5;

		if (normalize)
		{
			value *= normalizeFactor;
		}

		this._bufferShapeArray[sampleIndex] = this._zeroClamp(value);

		time += this._timeIncrement;
	}

	return this;
}

/!**
 *
 * @param carrierFrequency
 * @param modulatorFrequency
 * @param modulatorGain
 * @returns {IS_Buffer}
 *!/
frequencyModulatedSine(carrierFrequency, modulatorFrequency, modulatorGain, normalize = true)
{
	let carrierFrequencyArray = Array.isArray(carrierFrequency) ? carrierFrequency : [carrierFrequency];
	let modulatorFrequencyArray = Array.isArray(modulatorFrequency) ? modulatorFrequency : [modulatorFrequency];
	let modulatorGainArray = Array.isArray(modulatorGain) ? modulatorGain : [modulatorGain];

	let nCarrierFrequencies = carrierFrequencyArray.length;
	let nModulatorFrequencies = modulatorFrequencyArray.length;
	let nModulatorGains = modulatorGainArray.length;

	let longestArrayLength = Math.max(nCarrierFrequencies, nModulatorFrequencies, nModulatorGains);
	let normalizeFactor = 1 / longestArrayLength;

	let time = 0;

	this._initializeFastSine(modulatorFrequencyArray);

	for (let sample= 0; sample < this.length; sample++)
	{
		let value = 0;

		for (let frequencyIndex = 0; frequencyIndex < longestArrayLength; frequencyIndex++)
		{
			let modulatorGain = modulatorGainArray[frequencyIndex % nModulatorGains];
			let modulatorFrequencyIndex = frequencyIndex % nModulatorFrequencies;
			let modulatorFrequency = modulatorFrequencyArray[modulatorFrequencyIndex];
			let carrierFrequency = carrierFrequencyArray[frequencyIndex % nCarrierFrequencies];

			let modulatedFrequencyValue = carrierFrequency +
				(
					modulatorGain * this._fastSine(modulatorFrequency, modulatorFrequencyIndex, time)
				)
			// TODO: IS_FastSine - stores fast sine increments and returns .nextSample() for a given frequency
			value += Math.sin(modulatedFrequencyValue * IS_TWO_PI * time);
		}

		if (normalize)
		{
			value *= normalizeFactor;
		}

		this._bufferShapeArray[sample] = this._zeroClamp(value);

		time += this._timeIncrement;
	}
	return this;
}

/!**
 *
 * @param carrierFrequency
 * @param modulatorFrequency
 * @param modulatorGain
 * @returns {IS_Buffer}
 *!/
amplitudeModulatedSine(carrierFrequency, modulatorFrequency, modulatorGain, normalize = true)
{
	let carrierFrequencyArray = Array.isArray(carrierFrequency) ? carrierFrequency : [carrierFrequency];
	let modulatorFrequencyArray = Array.isArray(modulatorFrequency) ? modulatorFrequency : [modulatorFrequency];
	let modulatorGainArray = Array.isArray(modulatorGain) ? modulatorGain : [modulatorGain];

	let nCarrierFrequencies = carrierFrequencyArray.length;
	let nModulatorFrequecies = modulatorFrequencyArray.length;
	let nModulatorGains = modulatorGainArray.length;

	let longestArrayLength = Math.max(nCarrierFrequencies, nModulatorFrequecies, nModulatorGains);
	let normalizeFactor = 1 / longestArrayLength;

	let time = 0;

	let frequencyArray = [...carrierFrequencyArray];
	frequencyArray.push(...modulatorFrequencyArray);
	let modulatorFrequencyIndexOffset = carrierFrequencyArray.length;

	this._initializeFastSine(frequencyArray);

	for (let sample= 0; sample < this.length; sample++)
	{
		let value = 0;

		for (let i = 0; i < longestArrayLength; i++)
		{
			let carrierFrequencyIndex = i % nCarrierFrequencies
			let carrierFrequency = carrierFrequencyArray[carrierFrequencyIndex];

			let modulatorFrequencyIndex = i % nModulatorFrequecies;
			let modulatorFrequency = modulatorFrequencyArray[modulatorFrequencyIndex];

			let modulatorGain = modulatorGainArray[i % nModulatorGains];

			let modulatorAmplitude = modulatorGain * this._fastSine
			(
				modulatorFrequency, modulatorFrequencyIndex + modulatorFrequencyIndexOffset, time
			);

			value += modulatorAmplitude * this._fastSine(carrierFrequency, carrierFrequencyIndex, time);
		}

		if (normalize)
		{
			value *= normalizeFactor;
		}

		this._bufferShapeArray[sample] = this._zeroClamp(value);
		time += this._timeIncrement;
	}

	return this;
}

_zeroClamp(value)
{
	return Math.abs(value) <= IS_SAMPLE_MIN_VALUE ? 0 : value;
}

_fastSineValues = null;

_initializeFastSine(frequencyArray)
{
	this._setFastSineIncrements(frequencyArray);
	this._setFastSineValues(frequencyArray);
}

_fastSine(frequency, frequencyIndex, time)
{
	if(frequency <= 10)
	{
		return Math.sin(this._fastSineIncrements[frequencyIndex] * time);
	}

	let indexOffset = frequencyIndex * 3;

	let sin0Index = indexOffset;
	let sin1Index = indexOffset + 1;
	let dSinIndex = indexOffset + 2;

	let sin0 = this._fastSineValues[sin0Index];
	let sin1 = this._fastSineValues[sin1Index];
	let dSin = this._fastSineValues[dSinIndex];

	let sinx = dSin * sin0 - sin1;

	this._fastSineValues[sin1Index] = sin0;
	this._fastSineValues[sin0Index] = sinx;

	return sinx;
}

_setFastSineValues(frequencies)
{
	this._fastSineValues = new Float32Array(frequencies.length * 3);

	for(let frequencyIndex = 0; frequencyIndex < frequencies.length; frequencyIndex++)
	{
		let increment = this._fastSineIncrements[frequencyIndex];

		let sin0 = 0;
		let sin1 = Math.sin(-increment * IS_TWO_PI);
		let dSin = 2 * Math.cos(increment * IS_TWO_PI);

		let indexOffset = frequencyIndex * 3;

		this._fastSineValues[indexOffset] = sin0;
		this._fastSineValues[indexOffset + 1] = sin1;
		this._fastSineValues[indexOffset + 2] = dSin;
	}
}

_setFastSineIncrements(frequencies)
{
	this._fastSineIncrements = new Float32Array(frequencies);

	for(let frequencyIndex = 0; frequencyIndex < frequencies.length; frequencyIndex++)
	{
		let frequency = frequencies[frequencyIndex];

		if(frequency >= 10)
		{
			let increment = frequency / this.length;
			this._fastSineIncrements[frequencyIndex] = increment;
		}
		else
		{
			this._fastSineIncrements[frequencyIndex] = frequency * IS_TWO_PI;
		}
	}
}

_normalizeSines(nWaves)
{
	let normalizeRatio = 1 / nWaves;
	let bufferLength = this._bufferShapeArray.length;

	for(let sampleIndex = 0; sampleIndex < bufferLength; sampleIndex++)
	{
		this._bufferShapeArray[sampleIndex] *= normalizeRatio;
	}
}

/!**
 *
 * @param quantizationValue
 * @param valueArray
 * @returns {IS_Buffer}
 *!/
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

/!**
 *
 * @param startPercent
 * @param endPercent
 * @param upEnd
 * @param downStart
 * @param upExp
 * @param downExp
 * @returns {IS_Buffer}
 *!/
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

/!**
 *
 * @param carrierFrequency
 * @param bandwidth
 * @param tuningMin
 * @param tuningMax
 * @param amplitudeMin
 * @param amplitudeMax
 * @returns {IS_Buffer}
 *!/
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

/!**
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
 *!/
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
}*/
