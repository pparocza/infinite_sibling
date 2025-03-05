import { IS_AudioParameter } from "./IS_AudioParameter.js";

export class IS_StartableNodeAudioParameter extends IS_AudioParameter
{
    constructor(siblingContext, value = 0)
    {
        super(siblingContext);

        this._outlet = new ConstantSourceNode(siblingContext.audioContext);
        this._parameter = new IS_AudioParameter(this.siblingContext, this._outlet.offset, value);

        this._outlet.start();
    }

    isStartableNodeAudioParameter = true;

    connect(audioParameter)
    {
        this._outlet.connect(audioParameter);
    }
}