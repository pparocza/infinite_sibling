import { IS_BufferFunctionData } from "./IS_BufferFunctionData.js";
import { IS_BufferFunctionType } from "./IS_BufferFunctionType.js";

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

// TODO: Figure out what rampBand is and whether it's worth porting/rebuilding
/*
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
}
*/
