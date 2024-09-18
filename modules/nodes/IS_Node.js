import { IS_Object } from "../types/IS_Object.js";
import { IS_Type } from "../enums/IS_Type.js";
import { IS_Parameter } from "../types/IS_Parameter.js";

export class IS_Node extends IS_Object
{
    // TODO: all nodes have an output gain
    constructor(siblingContext)
    {
        super(IS_Type.IS_Node);

        this.siblingContext = siblingContext;

        this.node = null;
        this.params = {};
        this.inlet = {};

        this.output = siblingContext.audioContext.createGain();
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

    disconnect()
    {
        // TODO: IS_Connectable class?
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

    /**
     * Sets value of an audio parameter
     * @param key - key used to index parameter value
     * @param value - parameter value
     */
    setParam(key, value)
    {
        this.params[key] = value;

        // TODO: resolve this with node inlets
        if(value.iSType && value.iSType === IS_Type.IS_Parameter)
        {
            this.params[key].connect(this.node[key]);
        }
        else if(this.node[key].value !== undefined)
        {
            this.node[key].value = this.params[key];
        }
        else
        {
            this.node[key] = this.params[key];
        }
    }

    getInlet(key)
    {
        return this.inlets[key];
    }
}
