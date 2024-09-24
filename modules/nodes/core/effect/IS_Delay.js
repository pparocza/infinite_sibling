import { IS_Node } from "../IS_Node.js";

const IS_DelayParamNames =
{
    delayTime: "delayTime",
    maxDelayTime: "maxDelayTime"
}

export class IS_Delay extends IS_Node
{
    constructor(siblingContext, delayTime = 1, maxDelayTime = 1)
    {
        super();

        this.paramNames = IS_DelayParamNames;

        this.node = new DelayNode(this.siblingContext.audioContext);

        this.setParam(this.paramNames.maxDelayTime, maxDelayTime);
        this.setParam(this.paramNames.delayTime, delayTime);
    }

    get maxDelayTime()
    {
        return this.getParamValue(this.paramNames.maxDelayTime);
    }

    set maxDelayTime(value)
    {
        this.setParam(this.paramNames.maxDelayTime, value);
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