import { IS_Node } from "./IS_Node";

export class IS_StartableNode extends IS_Node
{
    constructor(siblingContext)
    {
        super(siblingContext);
    }

    start()
    {
        // TODO: remember that some nodes can't be re-started after stopping, and need to be created
        this.node.start(this.siblingContext.audioContext.currentTime);
    }

    stop()
    {
        this.node.stop(this.siblingContext.audioContext.currentTime);
    }
}
