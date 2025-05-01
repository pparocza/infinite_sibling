import { IS_AudioParameter } from "./IS_AudioParameter.js";

export class IS_StartableNodeAudioParameter extends IS_AudioParameter
{
    constructor(siblingContext, parentNode, value = 0)
    {
        super(siblingContext, parentNode);

        this._outlet = new ConstantSourceNode(siblingContext.AudioContext);
        this._parameter = new IS_AudioParameter(this.siblingContext, parentNode, this._outlet.offset, value);

        this._outlet.start();
    }

    isISStartableNodeAudioParameter = true;

    connect(audioParameter)
    {
        this._outlet.connect(audioParameter);
    }
}