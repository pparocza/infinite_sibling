import { IS_Object } from "../types/IS_Object.js";
import { IS_Type } from "../enums/IS_Type.js";

export class IS_EffectPresets extends IS_Object
{
	constructor(IS_Effect)
	{
		super(IS_Type.IS_Data.IS_Presets.IS_EffectPresets);

		this._effect = IS_Effect;
		this.siblingContext = this._effect.siblingContext;
	}

	configureEffect(audioNode)
	{
		this._effect.configureInput(audioNode);
		this._effect.configureOutput(audioNode);
	}

	stereoReverb(length = 3)
	{
		let convolver = this.siblingContext.createConvolver();
		convolver.preset.stereoNoiseReverb(length);
		this.configureEffect(convolver);
	}

	stereoDelay()
	{
		let delay = this.siblingContext.createStereoDelay();
		this.configureEffect(delay);
	}
}