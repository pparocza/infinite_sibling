import { IS_Node } from "../IS_Node.js";
import { IS_Type } from "../../../enums/IS_Type.js";

export class IS_Effect extends IS_Node
{
    constructor(siblingContext, iSEffectType = undefined)
    {
        super(siblingContext, IS_Type.IS_Effect);

        this._effectInputNode = new GainNode(siblingContext.AudioContext);
    }

    isISEffect = true;

    get input() { return this._effectInputNode; };

    configureInput(input)
    {
        this.connectInputTo(input);
    }

    connectInputTo(audioNode)
    {
        if(audioNode.iSType !== undefined && audioNode.iSType === IS_Type.IS_Effect)
        {
            this._effectInputNode.connect(audioNode.input);
        }
        else
        {
            this._effectInputNode.connect(audioNode);
        }
    }
}
