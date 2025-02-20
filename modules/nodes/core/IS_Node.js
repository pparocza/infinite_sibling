import { IS_Object } from "../../types/IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";
import { Utilities } from "../../utilities/Utilities.js";
import { IS_AudioParameter } from "../../types/parameter/IS_AudioParameter.js";

class NodeRegistryData
{
    constructor(audioNode)
    {
        this._audioNode = audioNode;

        this._connections = [];
    };

    get audioNode() { return this._audioNode; };
    get connections () { return this._connections };

    registerConnection(nodeRegistryData)
    {
        this._connections.push(nodeRegistryData);
    }
}

export class IS_Node extends IS_Object
{
    constructor(siblingContext, iSType)
    {
        super(iSType);

        // TODO: change to this._siblingContext
        this.siblingContext = siblingContext;

        this._output = new GainNode(siblingContext.audioContext);
        this._gain = new IS_AudioParameter(this.siblingContext, this._output.gain);

        this._hasInput = false;

        this._registryData = new NodeRegistryData
        (
            this, iSType
        );

        this.siblingContext.registerNode(this._registryData);
    }

    get hasInput() { return this._hasInput; };
    get registryData() { return this._registryData; };

    /**
     *
     * @param audioNodes
     */
    connect(...audioNodes)
    {
        for(let nodeIndex = 0; nodeIndex < audioNodes.length; nodeIndex++)
        {
            let audioNode = audioNodes[nodeIndex];

            if(audioNode.iSType !== undefined)
            {
                switch (audioNode.iSType)
                {
                    case (IS_Type.IS_Effect):
                        this._output.connect(audioNode.input);
                        break;
                    case (IS_Type.IS_AudioParameter):
                        this._output.connect(audioNode.parameter);
                        break;
                    default:
                        break;
                }
            }
            else
            {
                this._output.connect(audioNode);
            }

            this._registryData.registerConnection(audioNode.registryData);
        }
    }

    configureOutput(audioNode)
    {
        audioNode.connect(this._output);
    }

    /**
     *
     */
    connectToMainOutput()
    {
        this._output.connect(this.siblingContext.output);
    }

    /**
     *
     */
    connectToAudioDestination()
    {
        this._output.connect(this.siblingContext.destination);
    }

    /**
     *
     * @returns
     */
    get gain()
    {
        return this._gain;
    }

    /**
     *
     * @param value
     */
    set gain(value)
    {
        this._gain.value = value;
    }

    /**
     * Set the volume of a node in Decibels
     * @param value = decibel value
     */
    set volume(value)
    {
        this._gain.value = Utilities.DecibelsToAmplitude(value);
    }

    /**
     * Return the current gain level in Decibels
     * @returns {*}
     */
    get volume()
    {
        return Utilities.AmplitudeToDecibels(this._gain.value);
    }
}
