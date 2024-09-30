import { IS_Object } from "../../types/IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";
import { IS_Parameter } from "../../types/IS_Parameter.js";

export class IS_Node extends IS_Object
{
    constructor(siblingContext)
    {
        super(IS_Type.IS_Node);

        this.siblingContext = siblingContext;

        this.node = null;
        this.params = {};
        // TODO: inlets and parameter connections
        this.inlet = {};

        this.output = new GainNode(this.siblingContext.audioContext);
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
        if(audioNode.iSType !== undefined && audioNode.iSType === IS_Type.IS_Effect)
        {
            this.output.connect(audioNode.input);
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

    connectToOutput(audioNode)
    {
        audioNode.connect(this.output);
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

    get gain()
    {
        return this.output.gain;
    }

    /**
     *
     * @param value
     */
    set gain(value)
    {
        this.output.gain = value;
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
     * Sets value of an audio parameter // TODO: SET AT TIME
     * @param key - key used to index parameter value
     * @param value - parameter value
     */
    setParam(key, value)
    {
        this.setParamValue(key, value);

        if(value === null)
        {
            return;
        }

        if(this.node[key] !== null && this.node[key].value !== undefined)
        {
            this.node[key].value = this.params[key];
        }
        else
        {
            this.node[key] = this.params[key];
        }
    }
}
