import { IS_Object } from "../../types/IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";
import { Utilities } from "../../utilities/Utilities.js";
import { IS_AudioParameter } from "../../types/parameter/IS_AudioParameter.js";
import { IS_NetworkRegistry } from "../network/IS_NetworkRegistry.js";

export class IS_Node extends IS_Object
{
    constructor(siblingContext, iSType)
    {
        super(iSType);

        this._siblingContext = siblingContext;

        this._output = new GainNode(siblingContext.AudioContext);
        this._gain = new IS_AudioParameter(this._siblingContext, this, this._output.gain);

        this._siblingContext.NodeRegistry.registerNode(this);

        this._networkNode = IS_NetworkRegistry.HandleNodeCreated(this);

        this._readyCallbacks = null;
        this._analyser = null;
    }

    isISNode = true;

    get gain() { return this._gain; }
    set gain(value) { this._gain.value = value; }

    get volume() { return Utilities.AmplitudeToDecibels(this._gain.value); }
    set volume(value) { this._gain.value = Utilities.DecibelsToAmplitude(value); }

    /*
        CONNECTION
    */
    connect(...audioNodes)
    {
        for(let nodeIndex = 0; nodeIndex < audioNodes.length; nodeIndex++)
        {
            let audioNode = audioNodes[nodeIndex];

            if(audioNode.isISObject && !audioNode.isISAudioParameter && !audioNode.input)
            {
                // TODO: Warning/Error utilities
                console.warn
                (
                    "INFINITE SIBLING:", "ErrType: CONNECTION_ERR", "[" + this.iSType + "]",
                    "Attempted to connect to:", "[" + audioNode.iSType + "]",
                    ", which has no input."
                )

                return;
            }

            if(audioNode.isISObject)
            {
                if (audioNode.isISEffect)
                {
                    this._output.connect(audioNode.input);
                }
                else if(audioNode.isISAudioParameter)
                {
                    this._output.connect(audioNode.parameter);
                }

            }
            else
            {
                this._output.connect(audioNode);
            }

            this._handleNetworkMembership(audioNode);
        }
    }

    connectToMainOutput()
    {
        this._output.connect(this._siblingContext.output);
    }

    connectToAudioDestination()
    {
        this._output.connect(this._siblingContext.destination);
    }

    onReady(callback)
    {
        if(this._readyCallbacks === null)
        {
            this._readyCallbacks = [];
        }

        this._readyCallbacks.push(callback);
    }

    _ready()
    {
        this._doReadyCallbacks();
    }

    _doReadyCallbacks()
    {
        if(!this._readyCallbacks)
        {
            return;
        }

        while(this._readyCallbacks.length > 0)
        {
            this._readyCallbacks.shift()(this._uuid);
        }
    }

    _configureOutput(audioNode)
    {
        audioNode.connect(this._output);
    }

    _initializeAnalyser(fftSize = 2048)
    {
        if(this._analyser !== null)
        {
            return;
        }

        let analyser = this._siblingContext.AudioContext.createAnalyser();
        analyser.fftSize = fftSize;

        this._analyser = analyser;
        this._analyserData = new Float32Array(this._analyser.fftSize);
        this._analyser.getFloatTimeDomainData(this._analyserData);

        this._output.connect(this._analyser);
    }

    get analyser()
    {
        this._initializeAnalyser();

        return this._analyser;
    }

    // TODO: Something that isn't just the first value of the analysis buffer
    get outputValue()
    {
        this.analyser.getFloatTimeDomainData(this._analyserData);
        return this._analyserData[0];
    }

    _handleNetworkMembership(toNode)
    {
        if(toNode.isISNode || toNode.isISAudioParameter)
        {
            IS_NetworkRegistry.ResolveNetworkMembership(this, toNode);
        }
    }

    _getNetworkNode() { return this._networkNode; }
}
