import { IS_ScheduleAction } from "../../enums/IS_ScheduleAction.js";

/**
 * Schedule the Start or Stop of an IS_StartableNode
 * - maybe a schedule Item contains individual schedule actions?
 */
export class IS_ScheduleItem
{
    constructor(startableNode, scheduleAction, time, duration = -1)
    {
        this.startableNode = startableNode;
        this.scheduleAction = scheduleAction;
        this.time = time;
        this.duration = duration
    }

    schedule(offset = 0, duration = -1)
    {
        switch (this.scheduleAction)
        {
            case (IS_ScheduleAction.Start):
                this.scheduleStart(offset, duration);
                break;
            case (IS_ScheduleAction.Stop):
                this.scheduleStop(offset);
                break;
            default:
                break;
        }
    }

    scheduleStart(offset = 0, duration = -1)
    {
        let startTime = this.time + offset;

        // if the duration argument is less than this.duration, or this.duration is negative...
        if (this.duration > duration || this.duration < 0)
        {
            // ...replace this.duration with duration argument
            this.duration = duration;
        }

        this.startableNode.start(startTime);

        if (this.duration >= 0)
        {
            this.startableNode.stop(startTime + this.duration);
        }
    }

    scheduleStop(offset = 0)
    {
        let stopTime = offset + this.time;

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