import { IS_AudioParameter } from "./IS_AudioParameter.js";

export class IS_StartableNodeAudioParameter extends IS_AudioParameter
{
    constructor(siblingContext)
    {
        super();

        this._outlet = new ConstantSourceNode(siblingContext.audioContext);
        this._parameter = new IS_AudioParameter(this._outlet.offset);

        this._outlet.start();
    }

    get outlet()
    {
        return this._outlet;
    }
}