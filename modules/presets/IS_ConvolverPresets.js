export class IS_ConvolverPresets
{
    constructor(IS_Convolver)
    {
        this.convolver = IS_Convolver;
        this.siblingContext = this.convolver.siblingContext;
    }

    stereoNoiseReverb(length = 3)
    {
        let buffer = this.siblingContext.createBuffer(2, length, this.siblingContext.sampleRate);

        buffer.noise().add(0);
        buffer.noise().add(1);
        buffer.inverseSawtooth(2).multiply(0);
        buffer.inverseSawtooth(2).multiply(1);

        this.convolver.buffer = buffer;
    }
}