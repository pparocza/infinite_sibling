import { IS_StartableNode } from "./IS_StartableNode.js";
import { IS_Type } from "../enums/IS_Type.js";

const IS_BufferSourceParamNames =
{
    buffer: "buffer",
    detune: "detune",
    loop: "loop",
    loopStart: "loopStart",
    loopEnd: "loopEnd",
    playbackRate: "playbackRate"
}

/**
 * Play IS_Buffers
 */
export class IS_BufferSource extends IS_StartableNode
{
    constructor(siblingContext, buffer = null, detune = 0,
                loop = false, loopStart = 0, loopEnd = 1,
                playbackRate = 1)
    {
        super(siblingContext);

        if(buffer.iSType && buffer.iSType === IS_Type.IS_Buffer)
        {
            this.buffer = buffer.buffer;
        }
        else
        {
            this.buffer = buffer;
        }

        this.paramNames = IS_BufferSourceParamNames;

        this.setParamValue(this.paramNames.buffer, buffer);
        this.setParamValue(this.paramNames.detune , detune);
        this.setParamValue(this.paramNames.loop, loop);
        this.setParamValue(this.paramNames.loopStart, loopStart);
        this.setParamValue(this.paramNames.loopEnd, loopEnd);
        this.setParamValue(this.paramNames.playbackRate, playbackRate);
    }

    initialize()
    {
        this.node = this.siblingContext.audioContext.createBufferSource();
        this.node.buffer = this.buffer;

        this.node.connect(this.output);
    }

    // output buffer contents at specified time (in seconds)
    start(time)
    {
        this.time = time;

        this.node = this.siblingContext.audioContext.createBufferSource();

        this.node.loop = this.loop;
        this.node.playbackRate.value = this.playbackRate;
        this.node.buffer = this.buffer;
        this.node.connect(this.output);
        this.node.start(this.time);
    }

    get buffer()
    {
        return this.getParamValue(this.paramNames.buffer);
    }

    set buffer(buffer)
    {
        if(buffer.iSType && buffer.iSType === IS_Type.IS_Buffer)
        {
            this.setParam(this.paramNames.buffer, buffer.buffer);
        }
        else
        {
            this.setParam(this.paramNames.buffer, buffer);
        }
    }

    get detune()
    {
        return this.getParamValue(this.paramNames.detune);
    }

    set detune(value)
    {
        this.setParam(this.paramNames.detune, value);
    }

    get loop()
    {
        return this.getParamValue(this.paramNames.loop);
    }

    set loop(value)
    {
        this.setParam(this.paramNames.loop, value);
    }

    get loopStart()
    {
        return this.getParamValue(this.paramNames.loopStart);
    }

    set loopStart(value)
    {
        this.setParam(this.paramNames.loopStart, value);
    }

    get loopEnd()
    {
        return this.getParamValue(this.paramNames.loopEnd);
    }

    set loopEnd(value)
    {
        this.setParam(this.paramNames.loopEnd, value);
    }

    set playbackRate(value)
    {
        this.setParam(this.paramNames.playbackRate, value);
    }

    get playbackRate()
    {
        return this.params[this.paramNames.playbackRate];
    }
}