import { IS_BufferFunctionType } from "./IS_BufferFunctionType.js";
import { IS_Random } from "../../../../utilities/IS_Random.js";

const IS_TWO_PI = Math.PI * 2;

// TODO: Anti-aliasing (sawooth, square)
// TODO: Fast Sine

export const IS_EvaluateBufferFunction =
{
	evaluate(currentIncrement, functionType, functionArgs)
	{
		// TODO: args is a unique data type
		switch (functionType)
		{
			case (IS_BufferFunctionType.AmplitudeModulatedSine):
				return this.AmplitudeModulatedSine(currentIncrement, functionArgs);
			case (IS_BufferFunctionType.Constant):
				return this.Constant(functionArgs);
			case (IS_BufferFunctionType.Pulse):
				return this.Pulse(currentIncrement, functionArgs);
			case (IS_BufferFunctionType.FrequencyModulatedSine):
				return this.FrequencyModulatedSine(currentIncrement, functionArgs);
			case (IS_BufferFunctionType.Impulse):
				return this.Impulse(currentIncrement);
			case (IS_BufferFunctionType.InverseSawtooth):
				return this.InverseSawtooth(currentIncrement, functionArgs);
			case (IS_BufferFunctionType.Noise):
				return this.Noise();
			case (IS_BufferFunctionType.NoiseBand):
				return this.NoiseBand(currentIncrement, functionArgs);
			case (IS_BufferFunctionType.QuantizedArrayBuffer):
				return this.QuantizedArrayBuffer(currentIncrement, functionArgs);
			case (IS_BufferFunctionType.Ramp):
				return this.Ramp(currentIncrement, functionArgs);
			case (IS_BufferFunctionType.RampBand):
				return this.RampBand(currentIncrement, functionArgs);
			case (IS_BufferFunctionType.Sawtooth):
				return this.Sawtooth(currentIncrement, functionArgs);
			case (IS_BufferFunctionType.Sine):
				return this.Sine(currentIncrement, functionArgs);
			case (IS_BufferFunctionType.Square):
				return this.Square(currentIncrement, functionArgs);
			case (IS_BufferFunctionType.Triangle):
				return this.Triangle(currentIncrement, functionArgs);
			case (IS_BufferFunctionType.UnipolarNoise):
				return this.UnipolarNoise(currentIncrement, functionArgs);
			case (IS_BufferFunctionType.UnipolarSine):
				return this.UnipolarSine(currentIncrement, functionArgs);
			default:
				break;
		}
	},

	AmplitudeModulatedSine(currentIncrement, args)
	{
		let time = currentIncrement;

		let carrierFrequency = args[0];
		let modulatorFrequency = args[1];
		let modulatorGain = args[2]

		let modulatorAmplitude = modulatorGain * Math.sin(modulatorFrequency * time * IS_TWO_PI);
		let carrierAmplitude = Math.sin(carrierFrequency * time * IS_TWO_PI);

		return modulatorAmplitude * carrierAmplitude;
	},

	Constant(args)
	{
		return args[0]
	},

	Pulse(currentIncrement, args)
	{
		// TODO: Values like this and frequencies are very cacheable - maybe the function worker should be an
		//  instance so that you don't have to evaluate these static values for every sample
		// --> IS_FunctionWorker fills an array, sends it back to the queue
		let pulseStartPercent = args[0];
		let pulseEndPercent = args[1];
		let inCycleBounds = currentIncrement >= pulseStartPercent && currentIncrement <= pulseEndPercent;

		return inCycleBounds ? 1 : 0;
	},

	FrequencyModulatedSine(currentIncrement, args)
	{
		let time = currentIncrement;
		let carrierFrequency = args[0];
		let modulatorFrequency = args[1];
		let modulatorGain = args[2];

		let modulationValue = modulatorGain * Math.sin(modulatorFrequency * time * IS_TWO_PI);
		let modulatedFrequencyValue = carrierFrequency + modulationValue;

		return Math.sin(modulatedFrequencyValue * IS_TWO_PI * time);
	},

	Impulse(currentIncrement)
	{
		return currentIncrement === 0 ? 1 : 0;
	},

	InverseSawtooth(currentIncrement, args)
	{
		let exponent = args[0];

		return Math.pow(1 - currentIncrement, exponent);
	},

	Noise()
	{
		return IS_Random.randomFloat(-1, 1);
	},

	NoiseBand(currentIncrement, args)
	{
		let frequencyData = args[0];

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

	QuantizedArrayBuffer(currentIncrement, args)
	{
		let valueArray = args[0];
		let quantizationValue = args[1];

		let currentStep = Math.floor(currentIncrement * quantizationValue);
		let index = currentStep % valueArray.length;

		return valueArray[index];
	},

	Ramp(currentIncrement, args)
	{
		let rampStart = args[0];
		let rampEnd = args[1];
		let upEnd = args[2];
		let upLength = args[3]
		let downStart = args[4];
		let downLength = args[5];
		let upExponent = args[6];
		let downExponent = args[7];

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

	RampBand(currentIncrement, args)
	{
		// TODO: determine what this even is and decide whether to port it
	},

	Sawtooth(currentIncrement, args)
	{
		let exponent = args[0];

		return Math.pow(currentIncrement, exponent);
	},

	// TODO: fast sine
	// TODO: multiple frequencies
	Sine(currentIncrement, args)
	{
		let time = currentIncrement;
		let frequency = args[0];

		return Math.sin(time * frequency * IS_TWO_PI);
	},

	Square(currentIncrement, args)
	{
		let dutyCycle = args[0];

		return currentIncrement < dutyCycle ? 1 : 0;
	},

	Triangle(currentIncrement, args)
	{
		let exponent = args[0];

		let ascending = currentIncrement <= 0.5;
		let value = Math.pow(currentIncrement, exponent);

		return ascending ? value : 1 - value;
	},

	UnipolarNoise(currentIncrement, args)
	{
		return IS_Random.randomFloat(0, 1);
	},

	UnipolarSine(currentIncrement, args)
	{
		let time = currentIncrement;
		let frequency = args[0];
		let value = Math.sin(time * frequency * IS_TWO_PI);

		return value * 0.5 + 0.5;
	},
}