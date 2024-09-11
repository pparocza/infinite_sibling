import { IS_Node } from "./IS_Node.js";

export class IS_Oscillator extends IS_Node
{
    constructor(audioContext, type = "sine", frequency = 440)
    {
        super(audioContext);

        this.oscillator = this.audioContext.createOscillator();
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