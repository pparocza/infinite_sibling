import { IS_Object } from "./IS_Object.js";
import { IS_Type } from "../enums/IS_Type.js";

export class IS_Parameter extends IS_Object
{
    constructor(siblingContext, value)
    {
        super(IS_Type.IS_Parameter);

        this.constant = siblingContext.audioContext.createConstantSource();
        this.constant.offset.value = value;
    }

    start()
    {
        this.constant.start();
    }

    stop()
    {
        this.constant.stop();
    }

    connect(audioNode)
    {
        this.constant.connect(audioNode);
    }
}