import { IS_StartableNode } from "../IS_StartableNode.js";
import { IS_Type } from "../../../enums/IS_Type.js";
import { BufferPrint } from "../../../utilities/BufferPrint.js";
import { IS_StartableNodeAudioParameter } from "../../../types/parameter/IS_StartableNodeAudioParameter.js";

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

        this.initializeBuffer(buffer);

        this._loop = loop;
        this._loopStart = loopStart;
        this._loopEnd = loopEnd;

        this._detune = new IS_StartableNodeAudioParameter(siblingContext, detune);
        this._playbackRate = new IS_StartableNodeAudioParameter(siblingContext, playbackRate);

        this.initializeCallback = this.initialize;
        this.initialize();
    }

    initialize()
    {
        this.node = new AudioBufferSourceNode(this.siblingContext.audioContext);

        this.node.buffer = this.buffer;

        this.node.detune.value = 0;
        this.node.playbackRate.value = 0;

        this._detune.outlet.connect(this.node.detune);
        this._playbackRate.outlet.connect(this.node.playbackRate);

        this.node.loop = this.loop;

        this.node.loopStart = this.loopStart;
        this.node.loopEnd = this.loopEnd;

        this.node.connect(this._output);

        this.isInitialized = true;
    }

    initializeBuffer(buffer)
    {
        if (buffer === null)
        {
            return;
        }

        this.buffer = buffer;
    }

    get buffer()
    {
        return this._buffer;
    }

    set buffer(buffer)
    {
        if(buffer.iSType !== undefined && buffer.iSType === IS_Type.IS_Buffer)
        {
            this._buffer = buffer.buffer;
        }
        else
        {
            this._buffer = buffer;
        }
    }

    get detune()
    {
        return this._detune.parameter;
    }

    set detune(value)
    {
        this._detune.value = value;
        this.node.detune.value = this._detune.value;
    }

    get loop()
    {
        return this._loop;
    }

    set loop(value)
    {
        this._loop = value;
        this.node.loop = this._loop;
    }

    get loopStart()
    {
        return this._loopStart;
    }

    set loopStart(value)
    {
        this._loopStart = value;
        this.node.loopStart = this._loopStart;
    }

    get loopEnd()
    {
        return this._loopEnd;
    }

    set loopEnd(value)
    {
        this._loopEnd = value;
        this.node.loopEnd = this._loopEnd;
    }

    get playbackRate()
    {
        return this._playbackRate.parameter;
    }

    set playbackRate(value)
    {
        this._playbackRate.value = value;
        this.node.playbackRate.value = this._playbackRate.value;
    }

    printBuffer()
    {
        BufferPrint.print(this.buffer);
    }
}