export class IS_EffectPresets
{
	constructor(IS_Effect)
	{
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