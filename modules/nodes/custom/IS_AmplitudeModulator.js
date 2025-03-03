import { IS_Effect } from "../core/effect/IS_Effect.js";
import { IS_Type } from "../../enums/IS_Type.js";

const IS_AmplitudeModulatorParamNames =
    {
        buffer: "buffer",
        loop: "loop",
        modulatorPlaybackRate: "modulatorPlaybackRate"
    }

/**
 * Modulate the amplitude of an input signal with an IS_BufferSource
 */
export class IS_AmplitudeModulator extends IS_Effect
{
    constructor(siblingContext, buffer = null, modulatorPlaybackRate = 1, loop = true)
    {
        super(siblingContext, IS_Type.IS_EffectType.IS_AmplitudeModulator);

        this.paramNames = IS_AmplitudeModulatorParamNames;

        if(buffer !== null)
        {
            this.setParamValue(this.paramNames.buffer, buffer);
        }
        else
        {
            this.setParamValue(this.paramNames.buffer, siblingContext.createBuffer());
        }

        this.setParamValue(this.paramNames.loop, loop);
        this.setParamValue(this.paramNames.modulatorPlaybackRate, modulatorPlaybackRate);

        this.amplitudeModulationGain = this._siblingContext.createGain();
        this.amplitudeModulationGain.gain = 0;
        this.amplitudeModulatorBufferSource = siblingContext.createBufferSource();

        this.amplitudeModulatorBufferSource.buffer = this.buffer;
        this.amplitudeModulatorBufferSource.loop = this.loop
        this.amplitudeModulatorBufferSource.playbackRate = this.modulatorPlaybackRate;

        this.connectInputTo(this.amplitudeModulationGain);
        this.amplitudeModulatorBufferSource.connect(this.amplitudeModulationGain.gainInput);

        this.connectToOutput(this.amplitudeModulationGain);
    }

    get buffer()
    {
        return this.getParamValue(this.paramNames.buffer);
    }

    set buffer(value)
    {
        this.setParamValue(this.paramNames.buffer, value);
    }

    get loop()
    {
        return this.getParamValue(this.paramNames.loop);
    }

    set loop(value)
    {
        this.setParamValue(this.paramNames.loop, value);
        this.amplitudeModulatorBufferSource.loop = value;
    }

    get modulatorPlaybackRate()
    {
        return this.getParamValue(this.paramNames.modulatorPlaybackRate);
    }

    set modulatorPlaybackRate(value)
    {
        this.setParamValue(this.paramNames.modulatorPlaybackRate, value);
        this.amplitudeModulatorBufferSource.playbackRate = value;
    }

    start(time = this._siblingContext.now)
    {
        this.amplitudeModulatorBufferSource.start(time);
    }

    stop(time = this._siblingContext.now)
    {
        this.amplitudeModulatorBufferSource.stop(time);
    }

    sine(frequency = 1, amplitude = 1)
    {
        this.buffer.sine(1, amplitude).fill();
        this.modulatorPlaybackRate = frequency;
    }
}