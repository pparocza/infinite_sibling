export class IS_Oscillator
{
    constructor(audioContext, type = "sine", frequency = 440)
    {
        this.audioContext = audioContext;

        this.oscillator = audioContext.createOscillator();
        this.oscillator.frequency.value = frequency;
        this.oscillator.type = type;
    }

    start()
    {
        this.oscillator.start(this.audioContext.currentTime);
    }

    stop()
    {
        this.oscillator.stop(this.audioContext.currentTime);
    }

    connect(audioNode)
    {
        this.oscillator.connect(audioNode);
    }
}