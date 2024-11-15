import { IS_Effect } from "./IS_Effect.js";
import { IS_AudioParameter } from "../../../types/parameter/IS_AudioParameter.js";

export class IS_StereoPanner extends IS_Effect
{
    constructor(siblingContext, pan = 0)
    {
        super(siblingContext, new StereoPannerNode(siblingContext.audioContext));

        this._pan = new IS_AudioParameter(this.node.pan, pan)
    }

    get pan()
    {
        return this._pan;
    }

    set pan(value)
    {
        this._pan.value = value;
    }
}