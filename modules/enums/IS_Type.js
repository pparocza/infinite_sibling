export const IS_Type =
{
	IS_AudioParameter: "IS_AudioParameter",
	IS_Node: "IS_Node",
	IS_StartableNode: "IS_StartableNode",

	IS_Effect: "IS_Effect",
	IS_EffectType:
	{
		IS_BiquadFilter: "IS_BiquadFilter",
		IS_Gain: "IS_Gain:",

		IS_MixEffect:
		{
			IS_AmplitudeModulator: "IS_AmplitudeModulator",
			IS_Convolver: "IS_Convolver",
			IS_Delay: "IS_Delay",
			IS_StereoDelay: "IS_StereoDelay"
		},

		IS_NodeMatrix: "IS_NodeMatrix",
		IS_ParallelEffect: "IS_ParallelEffect",
		IS_StereoPanner: "IS_StereoPanner",
		IS_WaveShaper: "IS_WaveShaper"
	},

	IS_Source: "IS_Source",
	IS_SourceType:
	{
		IS_BufferSource: "IS_BufferSource",
		IS_ConstantSource: "IS_ConstantSource",
		IS_Oscillator: "IS_Oscillator",
	},

	IS_Data:
	{
		IS_Array: "IS_Array",
		IS_Buffer: "IS_Buffer",
		IS_BufferOperationQueue: "IS_BufferOperationQueue",

		IS_Presets:
		{
			IS_BufferPresets: "IS_BufferPresets",
			IS_ConvolverPresets: "IS_ConvolverPresets",
			IS_EffectPresets: "IS_EffectPresets"
		},

		IS_Scale: "IS_Scale",
		IS_Schedule: "IS_Schedule:",
		IS_ScheduleItem: "IS_ScheduleItem",
		IS_Sequence: "IS_Sequence",
		IS_SequenceArray: "IS_SequenceArray"
	},

	IS_Network: "IS_Network"
}
