import { IS_Effect } from "./IS_Effect.js";
import { IS_AudioParameter } from "../../../types/parameter/IS_AudioParameter.js";
import { IS_Type } from "../../../enums/IS_Type.js";

export class IS_StereoPanner extends IS_Effect
{
    constructor(siblingContext, pan = 0)
    {
        super(siblingContext, IS_Type.IS_EffectType.IS_StereoPanner);

        this._pannerNode = new StereoPannerNode(siblingContext.audioContext);

        this._pan = new IS_AudioParameter(this.siblingContext, this._pannerNode.pan, pan)

        this.configureInput(this._pannerNode);
        this.configureOutput(this._pannerNode);
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
