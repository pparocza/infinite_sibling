import { IS_Node } from "../IS_Node.js";
import { IS_Type } from "../../../enums/IS_Type.js";

const IS_ConvolverParamNames =
{
    buffer: "buffer",
    normalize: "normalize"
}

export class IS_Convolver extends IS_Node
{
    constructor(siblingContext, buffer = null, normalize = true)
    {
        super(siblingContext);

        this.paramNames = IS_ConvolverParamNames;

        this.node = new ConvolverNode(this.siblingContext.audioContext);

        this.setParam(this.paramNames.buffer, buffer);
        this.setParam(this.paramNames.normalize, normalize);

        this.node.connect(this.output);
    }

    get buffer()
    {
        this.getParamValue(this.paramNames.buffer);
    }

    set buffer(buffer)
    {
        if(buffer.iSType !== undefined && buffer.iSType === IS_Type.IS_Buffer)
        {
            this.setParam(this.paramNames.buffer, buffer.buffer);
        }
        else
        {
            this.setParam(this.paramNames.buffer, buffer);
        }
    }

    get normalize()
    {
        this.getParamValue(this.paramNames.normalize);
    }

    set normalize(value)
    {
        this.setParam(this.paramNames.normalize, value);
    }

    noiseReverb(length = 1, numberOfChannels = 2)
    {
        let buffer = this.siblingContext.createBuffer(numberOfChannels, length, this.siblingContext.sampleRate);

        buffer.noise().fill(0);
        buffer.noise().fill(1);
        buffer.inverseSawtooth(2).multiply(0);
        buffer.inverseSawtooth(2).multiply(1);

        this.setParam(this.paramNames.buffer, buffer);
    }
}