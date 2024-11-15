import { IS_Node } from "./IS_Node.js";

export class IS_StartableNode extends IS_Node
{
    constructor(siblingContext)
    {
        super(siblingContext);

        this.isInitialized = false;
        this.initializeCallback = null;
    }

    start(time = this.siblingContext.now)
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

        this.node.start(time + this.siblingContext.now);

        this.isInitialized = false;
    }

    stop(time = this.siblingContext.now)
    {
        this.node.stop(time + this.siblingContext.now);
        this.isInitialized = false;
    }

    scheduleStart(time, duration)
    {
        this.siblingContext.scheduleStart(this, time, duration);
    }

    scheduleStop(time)
    {
        this.siblingContext.scheduleStop(this, time);
    }
}
