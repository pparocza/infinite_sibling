import { IS_Node } from "../IS_Node.js";
import { IS_Type } from "../../../enums/IS_Type.js";

export class IS_Effect extends IS_Node
{
    constructor(siblingContext, audioNode, initializeConnections = true)
    {
        super(siblingContext, audioNode);

        this.iSType = IS_Type.IS_Effect;

        this.input = new GainNode(this.siblingContext.audioContext);

        if(initializeConnections)
        {
            this.initializeConnections();
        }
    }

    initializeConnections()
    {
        this.connectInputTo(this.node);
        this.connectToOutput(this.node);
    }

    connectInputTo(...audioNodes)
    {
        for(let audioNodeIndex = 0; audioNodeIndex < audioNodes.length; audioNodeIndex++)
        {
            let audioNode = audioNodes[audioNodeIndex];

            if(audioNode.iSType !== undefined && audioNode.iSType === IS_Type.IS_Effect)
            {
                this.input.connect(audioNode.input);
            }
            else
            {
                this.input.connect(audioNode);
            }
        }
    }

    connectToInput(...audioNodes)
    {
        for (let audioNodeIndex = 0; audioNodeIndex < audioNodes.length; audioNodeIndex++)
        {
            let audioNode = audioNodes[audioNodeIndex];

            if (audioNode.iSType !== undefined && audioNode.iSType === IS_Type.IS_Effect)
            {
                audioNode.connect(this.input);
            } else
            {
                audioNode.connect(this.input);
            }
        }
    }
}