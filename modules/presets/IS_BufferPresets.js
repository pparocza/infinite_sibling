export class IS_BufferPresets
{
    constructor(IS_Buffer)
    {
        this.buffer = IS_Buffer;
        this.siblingContext = this.buffer.siblingContext;
    }

    sineWave(frequency = 1)
    {
        this.buffer.sine(1).fill();
    }
}