import { IS_Effect } from "./IS_Effect.js";

const IS_StereoPannerParamNames =
{
    pan: "pan"
}

export class IS_StereoPanner extends IS_Effect
{
    constructor(siblingContext, pan = 0)
    {
        super(siblingContext);

        this.node = new StereoPannerNode(this.siblingContext.audioContext);

        this.paramNames = IS_StereoPannerParamNames;

        this.setParam(this.paramNames.pan, pan);

        this.input.connect(this.node);
        this.node.connect(this.output);
    }

    get pan()
    {
        return this.getParamValue(this.paramNames.pan);
    }

    set pan(value)
    {
        this.setParam(this.paramNames.pan, value);
    }
}