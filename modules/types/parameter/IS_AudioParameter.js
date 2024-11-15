import { IS_Object } from "../IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";

export class IS_AudioParameter extends IS_Object
{
    constructor(audioParameter = null, value = null)
    {
        super(IS_Type.IS_AudioParameter);

        if (audioParameter !== null)
        {
            this._parameter = audioParameter;

            if (value !== null)
            {
                this._parameter.value = value;
            }
        }
    }

    get parameter()
    {
        return this._parameter;
    }

    set parameter(audioParameter)
    {
        this._parameter = audioParameter;
    }

    get value()
    {
        return this.parameter.value;
    }

    set value(value)
    {
        this.parameter.value = value;
    }

    setValueAtTime(value, time)
    {
        this.parameter.setValueAtTime(value, time);
    }
}