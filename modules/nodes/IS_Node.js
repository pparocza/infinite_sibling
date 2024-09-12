import { IS_Object } from "../types/IS_Object.js";
import { IS_Type } from "../enums/IS_Type.js";

export class IS_Node extends IS_Object
{
    // TODO: all nodes have an output gain
    constructor(siblingContext)
    {
        super(IS_Type.IS_Node);

        this.siblingContext = siblingContext;

        this.node = null;
        this.params = {};
    }

    connect(audioNode)
    {
        if(Object.hasOwn(audioNode, "type") && audioNode.type === IS_Type.IS_Node)
        {
            this.node.connect(audioNode.node);
        }
        else
        {
            this.node.connect(audioNode);
        }
    }

    connectToMainOutput()
    {
        this.node.connect(this.siblingContext.output);
    }

    connectToAudioDestination()
    {
        this.node.connect(this.siblingContext.destination);
    }

    setParamValue(key, value)
    {
        this.params[key] = value;
    }

    getParamValue(key)
    {
        return this.params[key];
    }

    setParam(key, value)
    {
        this.params[key] = value;
        this.node[key].value = this.params[key];
    }
}
