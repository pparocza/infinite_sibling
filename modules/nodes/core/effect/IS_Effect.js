import { IS_Node } from "../IS_Node.js";
import { IS_Type } from "../../../enums/IS_Type.js";

export class IS_Effect extends IS_Node
{
    constructor(siblingContext)
    {
        super(siblingContext);

        this.iSType = IS_Type.IS_Effect;

        this._effectInputNode = new GainNode(siblingContext.audioContext);
        this._effectOutputNode = new GainNode(siblingContext.audioContext);
    }

    get input()
    {
        return this._effectInputNode;
    }

    configureIO(input, output)
    {
        this.connectInputTo(input);
        output.connect(this._effectOutputNode);
        this.connectToOutput(this._effectOutputNode);
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