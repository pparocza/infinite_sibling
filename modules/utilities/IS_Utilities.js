import { Utilities } from "./Utilities.js";
import { IS_Mode } from "../enums/IS_Mode.js";
import { IS_KeyboardNote } from "../enums/IS_KeyboardNote.js";
import { IS_Interval } from "../enums/IS_Interval.js";

export const IS_Utilities =
{
	_siblingContext: null,
	set siblingContext(siblingContext) { this._siblingContext = siblingContext; },

	MidiToFrequency(midiNoteNumber)
	{
		return Utilities.MidiToFrequency(midiNoteNumber);
	},

	SecondsToSamples(nSeconds)
	{
		return Utilities.SecondsToSamples(nSeconds, this._siblingContext.sampleRate);
	},

	AmplitudeToDecibels(amplitudeValue)
	{
		return Utilities.AmplitudeToDecibels(amplitudeValue);
	},

	DecibelsToAmplitude(decibelValue)
	{
		return Utilities.DecibelsToAmplitude(decibelValue);
	},

	get Mode()
	{
		return IS_Mode;
	},

	get KeyboardNote()
	{
		return IS_KeyboardNote;
	},

	IntervalRatio(intervalString)
	{
		return IS_Interval[intervalString];
	},

	get SpeedTest()
	{
		return Utilities.SpeedTest;
	},
}