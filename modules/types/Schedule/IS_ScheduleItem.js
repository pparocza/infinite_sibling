import { IS_ScheduleAction } from "../../enums/IS_ScheduleAction.js";

/**
 * Schedule the Start or Stop of an IS_StartableNode
 * - maybe a schedule Item contains individual schedule actions?
 */
export class IS_ScheduleItem
{
    constructor(startableNode, scheduleAction, startTime, duration = -1)
    {
        this.startableNode = startableNode;
        this.scheduleAction = scheduleAction;
        this.startTime = startTime;
        this.duration = duration
    }

    schedule()
    {
        switch (this.scheduleAction)
        {
            case (IS_ScheduleAction.Start):
                this.scheduleStart();
                break;
            case (IS_ScheduleAction.Stop):
                this.scheduleStop();
                break;
            default:
                break;
        }
    }

    scheduleStart()
    {
        this.startableNode.start(this.startTime);

        if (this.duration >= 0)
        {
            this.startableNode.stop(this.startTime + this.duration);
        }
    }

    scheduleStop(offset = 0)
    {
        let stopTime = offset + this.startTime;

        this.startableNode.stop(stopTime);
    }

    start()
    {
        this.startableNode.start();
    }

    stop()
    {
        this.startableNode.stop();
    }
}