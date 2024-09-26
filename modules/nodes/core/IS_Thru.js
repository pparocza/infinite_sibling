import { IS_Object } from "../../types/IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";

export class IS_Thru extends IS_Object
{
    constructor(siblingContext)
    {
        super(IS_Type.IS_Thru);

        this.siblingContext = siblingContext;
        this.gain = new GainNode(this.siblingContext.audioContext);
    }

    connect(audioNode)
    {
        if(audioNode.iSType !== undefined && audioNode.iSType === IS_Type.IS_Effect)
        {
            this.output.connect(audioNode.input);
        }
        else
        {
            this.output.connect(audioNode);
        }
    }

    get gain()
    {
        return this.gain.value;
    }

    set gain(value)
    {
        this.gain.value = value;
    }
}