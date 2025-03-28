import { IS_StartableNode } from "../IS_StartableNode.js";
import { IS_Type } from "../../../enums/IS_Type.js";
import { BufferPrint } from "../../../utilities/BufferPrint.js";
import { IS_StartableNodeAudioParameter } from "../../../types/parameter/IS_StartableNodeAudioParameter.js";

export class IS_BufferSource extends IS_StartableNode
{
    /**
     *
     * @param siblingContext
     * @param buffer
     * @param detune
     * @param loop
     * @param loopStart
     * @param loopEnd
     * @param playbackRate
     */
    constructor(siblingContext, buffer = null, detune = 0,
                loop = false, loopStart = 0, loopEnd = 1,
                playbackRate = 1)
    {
        super(siblingContext, IS_Type.IS_SourceType.IS_BufferSource);

        if(buffer !== null)
        {
            this.buffer = buffer;
        }

        this._loop = loop;
        this._loopStart = loopStart;
        this._loopEnd = loopEnd;

        this._detune = new IS_StartableNodeAudioParameter(siblingContext, this, detune);
        this._playbackRate = new IS_StartableNodeAudioParameter(siblingContext, this, playbackRate);

        this.initializeCallback = this.initialize;
    }

    isISBufferSource = true;

    initialize()
    {
        this._startableNode = new AudioBufferSourceNode(this._siblingContext.AudioContext);

        this._startableNode.buffer = this.buffer;
        this._startableNode.detune.value = 0;
        this._startableNode.playbackRate.value = 0;
        this._startableNode.loopStart = this.loopStart;
        this._startableNode.loopEnd = this.loopEnd;

        this._startableNode.loop = this.loop;

        this._detune.connect(this._startableNode.detune);
        this._playbackRate.connect(this._startableNode.playbackRate);

        this._configureOutput(this._startableNode);

        this.isInitialized = true;
    }

    get buffer()
    {
        return this._buffer;
    }

    set buffer(buffer)
    {
        if(buffer.isISBuffer)
        {
            this._buffer = buffer.requestBuffer(this);
        }
        else
        {
            this._buffer = buffer;
        }

        if(this._buffer)
        {
            this._ready();
        }
    }

    get detune()
    {
        return this._detune.parameter;
    }

    set detune(value)
    {
        this._detune.value = value;
    }

    get loop()
    {
        return this._loop;
    }

    set loop(value)
    {
        this._loop = value;
    }

    get loopStart()
    {
        return this._loopStart;
    }

    set loopStart(value)
    {
        this._loopStart = value;
    }

    get loopEnd()
    {
        return this._loopEnd;
    }

    set loopEnd(value)
    {
        this._loopEnd = value;
    }

    get playbackRate()
    {
        return this._playbackRate.parameter;
    }

    set playbackRate(value)
    {
        this._playbackRate.value = value;
    }

    printBuffer()
    {
        BufferPrint.print(this.buffer);
    }
}