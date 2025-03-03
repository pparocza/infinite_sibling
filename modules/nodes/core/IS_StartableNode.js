import { IS_Node } from "./IS_Node.js";
import { IS_Type } from "../../enums/IS_Type.js";

// TODO: replace IS_StartableNode with IS_NodeScheduler - it takes a node and manages its creation/destruction/timing
export class IS_StartableNode extends IS_Node
{
    constructor(siblingContext, iSType)
    {
        super(siblingContext, iSType);

        this._startableNode = null;

        this.isInitialized = false;
        this.initializeCallback = null;
    }

    start(time = 0)
    {
        if(!this.isInitialized)
        {
            if(this.initializeCallback === null)
            {
                throw new Error
                (
                    "IS_StartableNode initializeCallback has not been defined. Please define in extending class"
                );
            }
            this.initializeCallback();
        }

        this._startableNode.start(time + this._siblingContext.now);

        this.isInitialized = false;
    }

    stop(time = 0)
    {
        this._startableNode.stop(time + this._siblingContext.now);
        this.isInitialized = false;
    }

    scheduleStart(time = 0, duration)
    {
        this._siblingContext.scheduleStart(this, time, duration);
    }

    scheduleStop(time = 0)
    {
        this._siblingContext.scheduleStop(this, time);
    }

    scheduleSequence(sequence)
    {
        for(let sequenceIndex = 0; sequenceIndex < sequence.length; sequenceIndex++)
        {
            this.scheduleStart(sequence.value[sequenceIndex]);
        }
    }
}
