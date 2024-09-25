import { IS_Node } from "../IS_Node.js";

const IS_StereoPannerParamNames =
{
    pan: "pan"
}

export class IS_StereoPanner extends IS_Node
{
    constructor(siblingContext, pan = 0)
    {
        super(siblingContext);

        this.node = this.siblingContext.audioContext.createStereoPanner();
        this.node.connect(this.output);

        this.paramNames = IS_StereoPannerParamNames;

        this.setParam(this.paramNames.pan, pan);
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