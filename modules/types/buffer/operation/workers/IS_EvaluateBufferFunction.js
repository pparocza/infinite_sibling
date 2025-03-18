import { IS_BufferFunctionType } from "../function/IS_BufferFunctionType.js";
import { IS_Random } from "../../../../utilities/IS_Random.js";
const IS_TWO_PI = Math.PI * 2;

export const IS_EvaluateBufferFunction =
{
	_requestArgumentValues: null,

	get cachedRequestArgumentValues() { return this._requestArgumentValues; },
	cacheRequestArgumentValues(args) { this._requestArgumentValues = args; },

	evaluate(functionType, functionArgs, currentIncrement, currentSample)
	{
		if(currentSample === 0)
		{
			this.cacheRequestArgumentValues(functionArgs);
		}

		// TODO: args is a unique data type
		switch (functionType)
		{
			case (IS_BufferFunctionType.AmplitudeModulatedSine):
				return this.AmplitudeModulatedSine(currentIncrement);
			case(IS_BufferFunctionType.Buffer):
				return this.Buffer(currentSample);
			case (IS_BufferFunctionType.Constant):
				return this.Constant();
			case (IS_BufferFunctionType.FrequencyModulatedSine):
				return this.FrequencyModulatedSine(currentIncrement);
			case (IS_BufferFunctionType.Impulse):
				return this.Impulse();
			case (IS_BufferFunctionType.InverseSawtooth):
				return this.InverseSawtooth(currentIncrement);
			case (IS_BufferFunctionType.Noise):
				return this.Noise();
			case (IS_BufferFunctionType.NoiseBand):
				return this.NoiseBand(currentIncrement);
			case (IS_BufferFunctionType.Pulse):
				return this.Pulse(currentIncrement);
			case (IS_BufferFunctionType.QuantizedArrayBuffer):
				return this.QuantizedArrayBuffer(currentIncrement);
			case (IS_BufferFunctionType.Ramp):
				return this.Ramp(currentIncrement);
			case (IS_BufferFunctionType.RampBand):
				return this.RampBand(currentIncrement);
			case (IS_BufferFunctionType.Sawtooth):
				return this.Sawtooth(currentIncrement);
			case (IS_BufferFunctionType.Sine):
				return this.Sine(currentIncrement);
			case (IS_BufferFunctionType.Square):
				return this.Square(currentIncrement);
			case (IS_BufferFunctionType.SuspendedOperations):
				return  this.SuspendedOperations(currentSample);
			case (IS_BufferFunctionType.Triangle):
				return this.Triangle(currentIncrement);
			case (IS_BufferFunctionType.UnipolarNoise):
				return this.UnipolarNoise();
			case (IS_BufferFunctionType.UnipolarSine):
				return this.UnipolarSine(currentIncrement);
			default:
				break;
		}
	},

	// TODO: IS_FunctionWorker that caches arguments and carries out the sample calculation loop
	AmplitudeModulatedSine(currentIncrement)
	{
		let time = currentIncrement;

		let carrierFrequency = this.cachedRequestArgumentValues[0];
		let modulatorFrequency = this.cachedRequestArgumentValues[1];
		let modulatorGain = this.cachedRequestArgumentValues[2]

		let modulatorAmplitude = modulatorGain * Math.sin(modulatorFrequency * time * IS_TWO_PI);
		let carrierAmplitude = Math.sin(carrierFrequency * time * IS_TWO_PI);

		return modulatorAmplitude * carrierAmplitude;
	},

	Buffer(currentSample)
	{
		let otherBufferArray = this.cachedRequestArgumentValues[0];

		return currentSample <= otherBufferArray.length ? otherBufferArray[currentSample] : null;
	},

	Constant()
	{
		return this.cachedRequestArgumentValues[0];
	},

	Pulse(currentIncrement)
	{
		// TODO: Values like this and frequencies are very cacheable - maybe the function worker should be an
		//  instance so that you don't have to evaluate these static values for every sample
		// --> IS_FunctionWorker fills an array, sends it back to the queue
		let pulseStartPercent = this.cachedRequestArgumentValues[0];
		let pulseEndPercent = this.cachedRequestArgumentValues[1];
		let inCycleBounds = currentIncrement >= pulseStartPercent && currentIncrement <= pulseEndPercent;

		return inCycleBounds ? 1 : 0;
	},

	FrequencyModulatedSine(currentIncrement)
	{
		let time = currentIncrement;
		let carrierFrequency = this.cachedRequestArgumentValues[0];
		let modulatorFrequency = this.cachedRequestArgumentValues[1];
		let modulatorGain = this.cachedRequestArgumentValues[2];

		let modulationValue = modulatorGain * Math.sin(time * modulatorFrequency * IS_TWO_PI);
		let modulatedFrequencyValue = carrierFrequency + modulationValue;

		return Math.sin(time * modulatedFrequencyValue * IS_TWO_PI);
	},

	Impulse()
	{
		return currentIncrement === 0 ? 1 : 0;
	},

	InverseSawtooth(currentIncrement)
	{
		let exponent = this.cachedRequestArgumentValues[0];

		return Math.pow(1 - currentIncrement, exponent);
	},

	Noise()
	{
		return IS_Random.Float(-1, 1);
	},

	NoiseBand(currentIncrement)
	{
		let frequencyData = this.cachedRequestArgumentValues[0];

		let frequencies = frequencyData[0];
		let amplitudes = frequencyData[1];

		let nFrequencies = frequencies.length;

		let sampleValue = 0;

		for(let frequencyIndex= 0; frequencyIndex < nFrequencies; frequencyIndex++)
		{
			let amplitude = amplitudes[frequencyIndex];
			let frequency = frequencies[frequencyIndex];

			sampleValue += amplitude * Math.sin(frequency * currentIncrement * IS_TWO_PI);
		}

		return sampleValue;
	},

	QuantizedArrayBuffer(currentIncrement)
	{
		let valueArray = this.cachedRequestArgumentValues[0];
		let quantizationValue = this.cachedRequestArgumentValues[1];

		let currentStep = Math.floor(currentIncrement * quantizationValue);
		let index = currentStep % valueArray.length;

		return valueArray[index];
	},

	Ramp(currentIncrement)
	{
		let rampStart = this.cachedRequestArgumentValues[0];
		let rampEnd = this.cachedRequestArgumentValues[1];
		let upEnd = this.cachedRequestArgumentValues[2];
		let upLength = this.cachedRequestArgumentValues[3]
		let downStart = this.cachedRequestArgumentValues[4];
		let downLength = this.cachedRequestArgumentValues[5];
		let upExponent = this.cachedRequestArgumentValues[6];
		let downExponent = this.cachedRequestArgumentValues[7];

		let value = 0;

		switch(true)
		{
			case (currentIncrement < rampStart || currentIncrement >= rampEnd):
				value = 0;
				break;
			case (currentIncrement >= rampStart && currentIncrement <= upEnd):
				value = (currentIncrement - rampStart) / upLength;
				value = Math.pow(value, upExponent);
				break;
			case (currentIncrement > upEnd && currentIncrement < downStart):
				value = 1;
				break;
			case (currentIncrement >= downStart && currentIncrement < rampEnd):
				value = 1 - ((currentIncrement - downStart) / downLength);
				value = Math.pow(value, downExponent);
				break;
			default:
				break;
		}

		return value;
	},

	RampBand(currentIncrement)
	{
		// TODO: determine what this even is and decide whether to port it
	},

	Sawtooth(currentIncrement)
	{
		let exponent = this.cachedRequestArgumentValues[0];

		return Math.pow(currentIncrement, exponent);
	},

	// TODO: fast sine
	// TODO: multiple frequencies
	Sine(currentIncrement)
	{
		let time = currentIncrement;
		let frequency = this.cachedRequestArgumentValues[0];

		return Math.sin(time * frequency * IS_TWO_PI);
	},

	Square(currentIncrement)
	{
		let dutyCycle = this.cachedRequestArgumentValues[0];

		return currentIncrement < dutyCycle ? 1 : 0;
	},

	SuspendedOperations(currentSample)
	{
		let otherBufferArray = this.cachedRequestArgumentValues[0];

		return currentSample <= otherBufferArray.length ? otherBufferArray[currentSample] : null;
	},

	Triangle(currentIncrement)
	{
		let exponent = this.cachedRequestArgumentValues[0];

		let ascending = currentIncrement <= 0.5;
		currentIncrement = ascending ? currentIncrement : 1 - currentIncrement;
		return Math.pow(currentIncrement, exponent);
	},

	UnipolarNoise()
	{
		return IS_Random.Float(0, 1);
	},

	UnipolarSine(currentIncrement)
	{
		let time = currentIncrement;
		let frequency = this.cachedRequestArgumentValues[0];
		let value = Math.sin(time * frequency * IS_TWO_PI);

		return value * 0.5 + 0.5;
	},
}
