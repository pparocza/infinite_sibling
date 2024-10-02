import { IS_ScheduleAction } from "../../enums/IS_ScheduleAction.js";

export class IS_ScheduleItem
{
    constructor(startableNode, scheduleAction, time, duration = -1)
    {
        this.startableNode = startableNode;
        this.scheduleAction = scheduleAction;
        this.time = time;
        this.duration = duration
    }

    schedule()
    {
        switch (this.scheduleAction)
        {
            case (IS_ScheduleAction.Start):
                this.start();
                break;
            case (IS_ScheduleAction.Stop):
                this.stop();
                break;
            default:
                break;
        }
    }

    start()
    {
        this.startableNode.start(this.time);

        if(this.duration >= 0)
        {
            this.startableNode.stop(this.time + this.duration);
        }
    }

    stop()
    {
        this.startableNode.stop(this.time);
    }
}