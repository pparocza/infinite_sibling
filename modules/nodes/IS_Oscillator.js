export class IS_Oscillator
{
    constructor(type = "sine", frequency = 440)
    {
        this.oscillator = iSAudioContext.createOscillator();
        this.oscillator.frequency.value = frequency;
        this.oscillator.type = type;
    }

    start()
    {
        this.oscillator.start(iSAudioContext.currentTime);
    }

    stop()
    {
        this.oscillator.stop(iSAudioContext.currentTime);
    }

    connect(audioNode)
    {
        this.oscillator.connect(audioNode);
    }
}