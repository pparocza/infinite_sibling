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

        this.output = siblingContext.createGain();
    }

    connect(audioNode)
    {
        if(audioNode.iSType !== undefined && audioNode.iSType === IS_Type.IS_Node)
        {
            this.output.connect(audioNode.node);
        }
        else
        {
            this.output.connect(audioNode);
        }
    }

    connectToMainOutput()
    {
        this.output.connect(this.siblingContext.output);
    }

    connectToAudioDestination()
    {
        this.output.connect(this.siblingContext.destination);
    }

    set gain(value)
    {
        this.output.gain.value = value;
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
        if(this.node[key].value !== undefined)
        {
            this.node[key].value = this.params[key];
        }
        else
        {
            this.node[key] = this.params[key];
        }
    }
}
