import { IS_Object } from "../types/IS_Object.js";
import { IS_Type } from "../enums/IS_Type.js";
import { IS_Parameter } from "../types/IS_Parameter.js";

export class IS_Node extends IS_Object
{
    constructor(siblingContext)
    {
        super(IS_Type.IS_Node);

        this.siblingContext = siblingContext;

        this.node = null;
        this.params = {};
        this.inlet = {};

        this.output = siblingContext.audioContext.createGain();
    }

    /**
     *
     */
    connectInlets()
    {
        /*
        foreach(inlet in inlets)
        {
            connect(inlet to corresponding paramName);
        }
         */
    }

    /**
     *
     */
    createInlet()
    {
        /*
        new IS_Inlet(paramName);
         */
    }

    /**
     *
     * @param audioNode
     */
    connect(audioNode)
    {
        /*
        if(audioNode == parameter)
        {
            connect to parameter inlet
        }
         */
        // TODO: resolve this with node inlets
        if(audioNode.iSType !== undefined && audioNode.iSType === IS_Type.IS_Node)
        {
            this.output.connect(audioNode.node);
        }
        else
        {
            this.output.connect(audioNode);
        }
    }

    /**
     *
     */
    disconnect()
    {
        // TODO: IS_Connectable class?
    }

    /**
     *
     */
    connectToMainOutput()
    {
        this.output.connect(this.siblingContext.output);
    }

    /**
     *
     */
    connectToAudioDestination()
    {
        this.output.connect(this.siblingContext.destination);
    }

    /**
     *
     * @param value
     */
    set gain(value)
    {
        this.output.gain.value = value;
    }

    /**
     *
     * @param key
     * @param value
     */
    setParamValue(key, value)
    {
        this.params[key] = value;
    }

    /**
     *
     * @param key
     * @returns {*}
     */
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
        if(value === null)
        {
            return;
        }

        if(this.node[key] !== null && this.node[key].value !== undefined)
        {
            this.node[key].value = value;
        }
        else
        {
            this.node[key] = value;
        }

        this.setParamValue(key, value);
    }

    /**
     *
     * @param key
     * @returns {*}
     */
    getInlet(key)
    {
        return this.inlets[key];
    }
}
