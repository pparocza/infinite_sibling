import { IS_Object } from "../IS_Object.js";
import { IS_Type } from "../../enums/IS_Type.js";

export class IS_AudioParameter extends IS_Object
{
    constructor(siblingContext, audioParameter = null, value = null)
    {
        super(IS_Type.IS_AudioParameter);

        this.siblingContext = siblingContext;

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

    scheduleValue(value, time = 0)
    {
        this.siblingContext.scheduleValue(this, value, time);
    }

    scheduleValueSequence(valueSequence, timeSequence)
    {
        for(let timeSequenceIndex = 0; timeSequenceIndex < timeSequence.length; timeSequenceIndex++)
        {
            this.scheduleValue
            (
                valueSequence.value[timeSequenceIndex % valueSequence.length],
                timeSequence.value[timeSequenceIndex]
            )
        }
    }

    setValueAtTime(value, time = 0)
    {
        this.parameter.setValueAtTime(value, this.siblingContext.now + time);
    }
}