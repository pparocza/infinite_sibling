const iSAudioContext = new AudioContext();
import { IS_Oscillator } from "./nodes/IS_Oscillator";

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