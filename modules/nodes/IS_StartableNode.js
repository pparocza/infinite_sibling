import { IS_Node } from "./IS_Node.js";

export class IS_StartableNode extends IS_Node
{
    constructor(siblingContext)
    {
        super(siblingContext);

        this.startables = {};
    }

    initialize()
    {
        /*
        foreach(startable in startables)
        {
            startable.create();
        }
         */
    }

    start(time = this.siblingContext.now)
    {
        this.node.start(time);
    }

    stop(time = this.siblingContext.now)
    {
        this.node.stop(time);
    }
}
