import { IS_Node } from "../IS_Node.js";
import { IS_Type } from "../../../enums/IS_Type.js";
import { IS_EffectPresets } from "../../../presets/IS_EffectPresets.js";

export class IS_Effect extends IS_Node
{
    constructor(siblingContext)
    {
        super(siblingContext);

        this.iSType = IS_Type.IS_Effect;

        this._preset = new IS_EffectPresets(this);

        this._effectInputNode = new GainNode(siblingContext.audioContext);
    }

    get input()
    {
        return this._effectInputNode;
    }

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

    connectToInput(...audioNodes)
    {
        for (let node = 0; node < audioNodes.length; node++)
        {
            audioNodes[node].connect(this.input);
        }
    }

    get preset()
    {
        return this._preset;
    }
}