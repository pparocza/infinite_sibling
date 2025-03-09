import { IS_BufferFunctionData } from "./IS_BufferFunctionData.js";
import { IS_BufferFunctionType } from "./IS_BufferFunctionType.js";

export const IS_BufferFunction =
{
	Sine(frequency)
	{
		return new IS_BufferFunctionData(IS_BufferFunctionType.Sine, frequency);
	},

	FrequencyModulatedSine(carrierFrequency, modulatorFrequency, modulatorGain)
	{
		return new IS_BufferFunctionData(IS_BufferFunctionType.FrequencyModulatedSine, carrierFrequency, modulatorFrequency, modulatorGain);
	},

	Constant(value)
	{
		return new IS_BufferFunctionData(IS_BufferFunctionType.Constant, value);
	}
}