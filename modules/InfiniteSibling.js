const iSAudioContext = new AudioContext();

export class InfiniteSibling
{
    constructor()
    {
        this.output = iSAudioContext.destination;
        this.audioContext = iSAudioContext;
    }

    osc(type = "sine", frequency = 440)
    {
        return new IS_Oscillator(type, frequency);
    }

    start()
    {
        this.audioContext.resume();
    }

    stop()
    {
        this.audioContext.close();
    }
}

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