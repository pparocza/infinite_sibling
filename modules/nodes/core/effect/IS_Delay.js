import { IS_Node } from "../IS_Node.js";

const IS_DelayParamNames =
{
    delayTime: "delayTime"
}

export class IS_Delay extends IS_Node
{
    constructor(siblingContext, delayTime = 1, maxDelayTime = 1)
    {
        super(siblingContext);

        this.paramNames = IS_DelayParamNames;

        this.node = this.siblingContext.audioContext.createDelay(maxDelayTime);
        this.node.connect(this.output);

        this.setParam(this.paramNames.delayTime, delayTime);
    }

    get delayTime()
    {
        return this.getParamValue(this.paramNames.delayTime);
    }

    set delayTime(value)
    {
        this.setParam(this.paramNames.delayTime, value);
    }
}