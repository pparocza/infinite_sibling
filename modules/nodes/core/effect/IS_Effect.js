import { IS_Node } from "../IS_Node.js";
import { IS_Type } from "../../../enums/IS_Type.js";

export class IS_Effect extends IS_Node
{
    constructor(siblingContext)
    {
        super(siblingContext);

        this.iSType = IS_Type.IS_Effect;

        this.input = new GainNode(this.siblingContext.audioContext);
    }

    connectInputTo(audioNode)
    {
        if(audioNode.iSType !== undefined && audioNode.iSType === IS_Type.IS_Effect)
        {
            this.input.connect(audioNode.input);
        }
        else
        {
            this.input.connect(audioNode);
        }
    }
}