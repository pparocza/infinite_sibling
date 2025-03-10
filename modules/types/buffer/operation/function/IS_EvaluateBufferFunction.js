import { IS_BufferFunctionType } from "./IS_BufferFunctionType.js";
import { IS_Random } from "../../../../utilities/IS_Random.js";

const IS_TWO_PI = Math.PI * 2;

export const IS_EvaluateBufferFunction =
{
	evaluate(currentIncrement, functionData)
	{
		let args = functionData._args;

		// TODO: args is a unique data type
		switch (functionData._type)
		{
			case (IS_BufferFunctionType.AmplitudeModulatedSine):
				return this.AmplitudeModulatedSine(currentIncrement, args);
			case (IS_BufferFunctionType.Constant):
				return this.Constant(currentIncrement, args);
			case (IS_BufferFunctionType.FloatingCycleSquare):
				return this.FloatingCycleSquare(currentIncrement, args);
			case (IS_BufferFunctionType.FrequencyModulatedSine):
				return this.FrequencyModulatedSine(currentIncrement, args);
			case (IS_BufferFunctionType.Impulse):
				return this.Impulse(currentIncrement, args);
			case (IS_BufferFunctionType.InverseSawtooth):
				return this.InverseSawtooth(currentIncrement, args);
			case (IS_BufferFunctionType.Noise):
				return this.Noise(currentIncrement, args);
			case (IS_BufferFunctionType.NoiseBand):
				return this.NoiseBand(currentIncrement, args);
			case (IS_BufferFunctionType.QuantizedArrayBuffer):
				return this.QuantizedArrayBuffer(currentIncrement, args);
			case (IS_BufferFunctionType.Ramp):
				return this.Ramp(currentIncrement, args);
			case (IS_BufferFunctionType.RampBand):
				return this.RampBand(currentIncrement, args);
			case (IS_BufferFunctionType.Sawtooth):
				return this.Sawtooth(currentIncrement, args);
			case (IS_BufferFunctionType.Sine):
				return this.Sine(currentIncrement, args);
			case (IS_BufferFunctionType.Square):
				return this.Square(currentIncrement, args);
			case (IS_BufferFunctionType.Triangle):
				return this.Triangle(currentIncrement, args);
			case (IS_BufferFunctionType.UnipolarNoise):
				return this.UnipolarNoise(currentIncrement, args);
			case (IS_BufferFunctionType.UnipolarSine):
				return this.UnipolarSine(currentIncrement, args);
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

	// TODO: needs to know position in buffer
	FloatingCycleSquare(currentIncrement, args)
	{
		/*
			let cycleStart = this._bufferShapeArray.length * start;
			let cycleEnd = this._bufferShapeArray.length * end;
			let inCycleBounds = false;

			for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
			{
				inCycleBounds = sample >= cycleStart && sample <= cycleEnd;

				this._bufferShapeArray[sample] = inCycleBounds ? 1 : 0;
			}
			return this;
	 	*/
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

	Impulse(currentIncrement, args)
	{
		return currentIncrement === 0 ? 1 : 0;
	},

	InverseSawtooth(currentIncrement, args)
	{
		let exponent = args[0];

		return Math.pow(currentIncrement, exponent);
	},

	Noise(currentIncrement, args)
	{
		return IS_Random.randomFloat(-1, 1);
	},

	NoiseBand(currentIncrement, args)
	{

	},

	QuantizedArrayBuffer(currentIncrement, args)
	{

	},

	Ramp(currentIncrement, args)
	{

	},

	RampBand(currentIncrement, args)
	{

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

	// TODO: needs to know progress in buffer
	Square(currentIncrement, args)
	{
		/*
		let transitionSampleIndex = this._bufferShapeArray.length * dutyCycle;

		for (let sample= 0; sample < this._bufferShapeArray.length; sample++)
		{
			this._bufferShapeArray[sample] = sample < transitionSampleIndex ? 1 : 0;
		}
		return this;
	 	*/
	},

	// TODO: needs to know progress in buffer
	Triangle(currentIncrement, args)
	{
		/*
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
	 	*/
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